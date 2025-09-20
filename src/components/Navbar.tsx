import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
// import Logo from "../assets/Lucia Calderini Website Logo.png";
import Logo from '../assets/image.png';

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
                  } ${
                    isScrolled || isMenuOpen ? "text-gray-900" : "text-white"
                  } group-hover:scale-110`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 transition-all duration-200 ${
                    isMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-180"
                  } ${
                    isScrolled || isMenuOpen ? "text-white" : "text-white"
                  } group-hover:scale-110`}
                />
              </div>
            </button>

            {/* Logo and Text - Right */}
            <div className="flex items-center space-x-4 group cursor-pointer">
              <div className="relative overflow-hidden rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200">
                <img
                  src={Logo}
                  alt="Lucia Calderini Photography"
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
                <p
                  className={`text-sm font-light tracking-widest uppercase transition-colors duration-200 ${
                    isScrolled ? "text-gray-600" : "text-white/80"
                  } group-hover:text-gray-300`}
                >
                  Photography
                </p>
              </div>
            </div>
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
                  alt="Lucia Calderini Photography"
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
                <p className="text-sm font-light text-white/70 tracking-widest uppercase">
                  Photography
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-8 py-8">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={toggleMenu}
                    className={`block py-4 px-6 rounded-xl text-white hover:text-gray-400 hover:bg-white/5 transition-all duration-200 transform hover:translate-x-2 hover:scale-105 group relative overflow-hidden animate-slide-in`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <span className="relative z-10 text-lg font-medium tracking-wide">
                      {link.name}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </a>
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
