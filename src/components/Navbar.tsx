import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import Logo from "../assets/Lucia Calderini Website Logo.png";
import Logo from '../assets/image.png';
 
const navLinks = [
  { name: "Home", to: "/" },
  { name: "Portfolio", to: "#portfolio" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];
 
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
 
  // consider about/contact pages as "special" where hamburger should be black
  const isSpecialPage = ["/about", "/contact"].includes(location.pathname);
 
  // compute icon color class
  const iconColorClass = isSpecialPage
    ? "text-gray-900"
    : isScrolled || isMenuOpen
    ? "text-gray-900"
    : "text-white";
 
  // Debounced scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);
 
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);
 
  // Generic helper to navigate to home then scroll to an id (supports "#id" or "id")
  const scrollToHash = useCallback(async (hash: string) => {
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // fallback: set hash so later loads can pick it up
        window.location.hash = `#${id}`;
      }
    };

    // if already on home, scroll immediately
    if (location.pathname === "/") {
      scroll();
      return;
    }

    // navigate to home then scroll after small delay to allow rendering
    navigate("/", { replace: false });
    // small delay; adjust if Home has async data
    setTimeout(scroll, 220);
  }, [location.pathname, navigate]);

  // UPDATED: unified navigation handler — navigates to route then scrolls to top (or to hash)
  const handleLinkClick = useCallback((to: string, closeMenu = true, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (closeMenu) setIsMenuOpen(false);

    // hash-only (in-page) links like '#portfolio'
    if (to.startsWith("#")) {
      scrollToHash(to);
      return;
    }

    // links containing a hash like '/#portfolio' or '/about#team'
    const hashIndex = to.indexOf("#");
    if (hashIndex !== -1) {
      const path = to.slice(0, hashIndex) || "/";
      const hash = to.slice(hashIndex);
      if (location.pathname === path) {
        // already on the target path -> scroll to hash
        scrollToHash(hash);
      } else {
        // navigate to target path then scroll to hash after render
        navigate(path, { replace: false });
        setTimeout(() => scrollToHash(hash), 250);
      }
      return;
    }

    // normal route navigation: scroll to top of the new page/component
    if (location.pathname === to) {
      // already on the target route -> scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(to, { replace: false });
      // allow small delay for route mount, then scroll to top
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 180);
    }
  }, [location.pathname, navigate, scrollToHash]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Hamburger Menu Button - Left */}
            <button
              onClick={toggleMenu}
              className={`relative z-50 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100/10 group ${
                isMenuOpen ? "bg-white/10" : ""
              }`}
              aria-label="Toggle menu"
              tabIndex={0}
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 transition-all duration-200 ${
                    isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                  } ${iconColorClass} group-hover:scale-110`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 transition-all duration-200 ${
                    isMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-180"
                  } ${iconColorClass} group-hover:scale-110`}
                />
              </div>
            </button>
 
            {/* Logo and Text - Right */}
            <div className="flex items-center space-x-4 group cursor-pointer">
              <Link to="/" className="flex items-center space-x-4" onClick={(e) => handleLinkClick("/", false, e)}>
                <div className="relative overflow-hidden rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200">
                  <img
                    src={Logo}
                    alt="Lucia Calderini"
                    className="w-12 h-12 object-fit transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    width={48}
                    height={48}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="text-right">
                  <h1
                    className={`text-xl font-semi tracking-tight transition-colors duration-200 ${
                      isScrolled ? "text-gray-900" : "text-white"
                    } group-hover:text-gray-300`}
                  >
                    Lucia Calderini
                  </h1>
                </div>
              </Link>
            </div>

            {/* <-- If you add a desktop nav, use handleLinkClick for anchors there too --> */}
          </div>
        </div>
      </nav>
 
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-200 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        />
 
        {/* Menu Panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-80 bg-black shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Mobile menu"
        >
          {/* Menu Header */}
          <div className="pt-24 pb-8 px-8 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="relative overflow-hidden rounded-full ring-2 ring-white/30">
                <img
                  src={Logo}
                  alt="Lucia Calderini "
                  className="w-16 h-16 object-cover"
                  loading="lazy"
                  decoding="async"
                  width={64}
                  height={64}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Lucia Calderini
                </h2>
              </div>
            </div>
          </div>
 
          {/* Navigation Links */}
          <nav className="px-8 py-8">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={link.name}>
                  {link.to.startsWith("#") ? (
                    <button
                      onClick={(e) => handleLinkClick(link.to, true, e)}
                      className={`w-full text-left block py-4 px-6 rounded-xl text-white hover:text-gray-400 hover:bg-white/5 transition-all duration-200 transform hover:translate-x-2 hover:scale-105 group relative overflow-hidden animate-slide-in`}
                      style={{
                        animationDelay: `${index * 80}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <span className="relative z-10 text-lg font-medium tracking-wide">
                        {link.name}
                      </span>
                    </button>
                  ) : (
                    <NavLink
                      to={link.to}
                      onClick={(e) => {
                        // unify navigation + scrolling for all links
                        handleLinkClick(link.to, true, e);
                      }}
                      className={({ isActive }) =>
                        `block py-4 px-6 rounded-xl text-white hover:text-gray-400 hover:bg-white/5 transition-all duration-200 transform hover:translate-x-2 hover:scale-105 group relative overflow-hidden animate-slide-in ${
                          isActive ? "bg-white/10 text-amber-300" : ""
                        }`
                      }
                      style={{
                        animationDelay: `${index * 80}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <span className="relative z-10 text-lg font-medium tracking-wide">
                        {link.name}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
 
          {/* Menu Footer */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
            <p className="text-white/50 text-sm text-center font-light">
              Capturing moments, creating memories
            </p>
          </div>
        </aside>
      </div>
 
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
};
 
export default Navbar;
