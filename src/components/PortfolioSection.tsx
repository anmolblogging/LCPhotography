import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import ImageModal from "./ImageModal";
// import { Image } from "../types";
import Loader from './Loader'

type ImageItem = {
  id: number;
  title?: string;
  url: string;
  category?: string;
  // optional thumbnail field if you add it later to DB
  thumbnail?: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PAGE_SIZE = 16;

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver | null>(null);

  // Cache: Map<filter, Map<pageNumber, ImageItem[]>>
  const cacheRef = useRef<Map<string, Map<number, ImageItem[]>>>(new Map());
  // In-flight tracker: Map<filter, Set<pageNumber>>
  const inflightRef = useRef<Map<string, Set<number>>>(new Map());

  /** Fetch images from Supabase (uses cache + inflight tracking) */
  const fetchImages = useCallback(
    async ({
      reset = false,
      filter = activeFilter,
      pageNum = 1,
    }: {
      reset?: boolean;
      filter?: string;
      pageNum?: number;
    }) => {
      // If requesting a page that's already in cache, use it and avoid network call
      const filterCache = cacheRef.current.get(filter);
      if (filterCache && filterCache.has(pageNum)) {
        // assemble pages 1..pageNum for display when reset or append single page when not reset
        if (reset) {
          const pages = Array.from(filterCache.keys())
            .sort((a, b) => a - b)
            .filter((p) => p <= pageNum)
            .map((p) => filterCache.get(p) || [])
            .flat();
          setImages(pages);
        } else {
          setImages((prev) => [...prev, ...(filterCache.get(pageNum) || [])]);
        }
        // determine hasMore from cached page size
        setHasMore((filterCache.get(pageNum) || []).length === PAGE_SIZE);
        setLoading(false);
        setIsFetchingMore(false);
        return;
      }

      // Prevent duplicate requests for same filter+page
      const inflightForFilter = inflightRef.current.get(filter) || new Set<number>();
      if (inflightForFilter.has(pageNum)) {
        return;
      }
      inflightForFilter.add(pageNum);
      inflightRef.current.set(filter, inflightForFilter);

      if (reset) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        let query = supabase
          .from("images")
          .select("id, title, url, category")
          .order("id", { ascending: false })
          .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);

        if (filter !== "All") {
          query = query.eq("category", filter);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching images:", error);
          return;
        }

        const fetched = (data || []) as ImageItem[];

        // store in cache
        const mapForFilter = cacheRef.current.get(filter) || new Map<number, ImageItem[]>();
        mapForFilter.set(pageNum, fetched);
        cacheRef.current.set(filter, mapForFilter);

        if (reset) {
          // assemble pages 1..pageNum from cache (in case pages already exist)
          const pages = Array.from(mapForFilter.keys())
            .sort((a, b) => a - b)
            .filter((p) => p <= pageNum)
            .map((p) => mapForFilter.get(p) || [])
            .flat();
          setImages(pages);
        } else {
          setImages((prev) => [...prev, ...fetched]);
        }

        setHasMore(fetched.length === PAGE_SIZE);
      } finally {
        // clear inflight flag and state flags
        const s = inflightRef.current.get(filter);
        s?.delete(pageNum);
        if (s && s.size === 0) inflightRef.current.delete(filter);

        if (reset) setLoading(false);
        else setIsFetchingMore(false);
      }
    },
    [activeFilter]
  );

  /** Initial fetch & on filter change */
  useEffect(() => {
    setPage(1);

    // if we have cached page 1 for this filter, use it synchronously
    const filterCache = cacheRef.current.get(activeFilter);
    if (filterCache && filterCache.has(1)) {
      const pages = Array.from(filterCache.keys())
        .sort((a, b) => a - b)
        .map((p) => filterCache.get(p) || [])
        .flat();
      setImages(pages);
      setLoading(false);
      setHasMore((filterCache.get(1) || []).length === PAGE_SIZE);
      return;
    }

    setImages([]);
    fetchImages({ reset: true, filter: activeFilter, pageNum: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  /** Fetch more on page change */
  useEffect(() => {
    if (page > 1) {
      fetchImages({ reset: false, filter: activeFilter, pageNum: page });
    }
  }, [page, activeFilter, fetchImages]);

  /** Infinite scroll observer */
  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isFetchingMore || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // avoid queuing multiple page increments while a page fetch is inflight
          const inflightForFilter = inflightRef.current.get(activeFilter) || new Set<number>();
          if (!inflightForFilter.has(page + 1)) {
            setPage((prev) => prev + 1);
          }
        }
      }, { rootMargin: "300px" }); // prefetch earlier

      if (node) observer.current.observe(node);
    },
    [loading, isFetchingMore, hasMore, activeFilter, page]
  );

  /** Open modal */
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const filterButtons: string[] = ["All", "Portrait", "Street", "Animal"];
  const filteredImages = useMemo(() => images, [images]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:mt-[-100px]" id='portfolio'>
      {/* Header */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 mb-6 leading-tight">Through My Lens</h1>
      </div>

      {/* Filter Buttons */}
      
      <div className="flex justify-center mb-12 px-4 sm:px-6">
  <nav 
    role="tablist" 
    aria-label="Portfolio filter options"
    className="inline-flex flex-wrap justify-center items-center gap-0.5 sm:gap-1 lg:gap-2 bg-gradient-to-r from-gray-100/90 via-gray-50/80 to-gray-100/90 backdrop-blur-md rounded-2xl p-1 lg:p-1.5 border border-gray-300/40 shadow-sm will-change-transform  max-w-sm sm:max-w-md lg:max-w-4xl"
  >
    {filterButtons.map((filter) => {
      const isActive = activeFilter === filter;
      return (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-controls="portfolio-content"
          onClick={() => {
            if (!isActive) {
              setActiveFilter(filter);
            }
          }}
          className={`
            relative px-3 sm:px-5 lg:px-7 py-2 sm:py-2.5 lg:py-3 rounded-xl text-sm sm:text-base lg:text-base font-medium
            transition-[transform,background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
            focus:outline-none           focus-visible:ring-2 focus-visible:ring-gray-400/50 focus-visible:ring-offset-1
            active:scale-95 active:duration-75
            will-change-transform whitespace-nowrap select-none
            ${
              isActive
                ? "bg-white text-gray-900 shadow-lg shadow-gray-200/60 border border-gray-300/60 z-10"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/70 hover:scale-[1.01] hover:shadow-md hover:shadow-gray-200/40"
            }
          `}
        >
          <span className="block font-medium tracking-wide">{filter}</span>
          {isActive && (
            <div 
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-50/70 via-white to-gray-50/70 opacity-50 pointer-events-none"
              aria-hidden="true"
            />
          )}
        </button>
      );
    })}
  </nav>
</div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading && images.length === 0 ? (
         <Loader/>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredImages.map((image, index) => {
              const isLast = index === filteredImages.length - 1;
              return (
                <div
                  key={image.id}
                  ref={isLast ? lastImageRef : null}
                  className="break-inside-avoid mb-6 group cursor-pointer"
                  onClick={() => handleImageClick(index)}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-gray-100">
                    {/* Use thumbnail when available; fall back to original url.
                        Keep lazy, low fetchPriority, and dimensions to reduce layout shift */}
                    <img
                      src={image.thumbnail ?? image.url}
                      alt={image.title ?? "Portfolio image"}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      // if you know common width/height you can add width/height attributes here
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Spinner when fetching more */}
        {isFetchingMore && (
          <div className="py-8">
            <Loader/>
          </div>
        )}

        {/* No results */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              No images found in this category
            </p>
          </div>
          
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ImageModal
          photos={filteredImages}
          currentIndex={currentImageIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Portfolio;
