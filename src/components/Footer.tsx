import React from "react";
import Logo from "../assets/image.png";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white font-montserrat pt-16 pb-8">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
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
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Lucia Calderini
              </h2>
              <p className="text-xs font-light text-white/60 tracking-widest uppercase">
                Photography
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-base mt-2 max-w-md text-center">
            Capturing moments, creating memories. Let’s make your story timeless.
          </p>
          <div className="flex space-x-3 mt-4">
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} className="text-gray-300" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} className="text-gray-300" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} className="text-gray-300" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full mt-10 border-t border-gray-800 pt-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm text-center">
            &copy; 2025 Lucia Calderini Photography. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
