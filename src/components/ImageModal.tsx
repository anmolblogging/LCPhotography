import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "../types";

interface ImageModalProps {
  photos: Image[];
  currentIndex: number;
  onClose: () => void;
}

const Thumbnail = memo(
  ({
    photo,
    index,
    isActive,
    onClick,
    refCallback,
  }: {
    photo: Image;
    index: number;
    isActive: boolean;
    onClick: (i: number) => void;
    refCallback: (el: HTMLButtonElement | null) => void;
  }) => (
    <button
      ref={refCallback}
      onClick={() => onClick(index)}
      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
        isActive ? "border-blue-500 scale-105" : "border-transparent hover:border-gray-400"
      }`}
      type="button"
      aria-label={`Go to image ${index + 1}`}
    >
      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" loading="lazy" />
    </button>
  )
);

const ImageModal: React.FC<ImageModalProps> = ({ photos, currentIndex = 0, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);

  /** Update current index when prop changes */
  useEffect(() => setCurrentImageIndex(currentIndex), [currentIndex]);

  /** Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentImageIndex((prev) => (prev + 1) % photos.length);
      if (e.key === "ArrowLeft") setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    },
    [onClose, photos.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /** Scroll active thumbnail into view */
  useEffect(() => {
    const el = thumbRefs.current[currentImageIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentImageIndex]);

  if (!photos || photos.length === 0) return null;
  const currentPhoto = photos[currentImageIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full"
        type="button"
        aria-label="Close"
      >
        <X size={28} />
      </button>

      {/* Image */}
      <div
        className="relative flex items-center justify-center w-full flex-1 max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.length > 1 && (
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full"
            type="button"
            aria-label="Previous"
          >
            <ChevronLeft size={40} />
          </button>
        )}

        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="rounded-lg shadow-2xl object-contain max-h-[calc(95vh-110px)] max-w-full transition-all mx-auto"
        />

        {photos.length > 1 && (
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % photos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full"
            type="button"
            aria-label="Next"
          >
            <ChevronRight size={40} />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div
          className="fixed left-0 bottom-0 w-full px-2 md:px-6 pb-4 bg-black/70 overflow-x-auto hide-scrollbar flex justify-center"
          ref={thumbnailsRef}
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((photo, index) => (
            <Thumbnail
              key={photo.id}
              photo={photo}
              index={index}
              isActive={index === currentImageIndex}
              onClick={setCurrentImageIndex}
              refCallback={(el) => (thumbRefs.current[index] = el)}
            />
          ))}
        </div>
      )}

      {/* Hide scrollbar */}
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ImageModal;
