"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3 ${
          scrolled ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`section-container flex justify-between items-center transition-all duration-500 px-5 sm:px-8 py-3 rounded-full border border-transparent w-full pointer-events-auto ${
            scrolled
              ? "bg-[#1a1a2e]/80 backdrop-blur-md border-white/10 shadow-2xl shadow-black/20"
              : "bg-transparent"
          }`}
        >
          <Link href="/" className="flex items-center group shrink-0" aria-label="CEJOP Tucumán - Inicio">
            <div className="relative transition-all duration-500 w-36 h-10 sm:w-44 sm:h-12">
              <img
                alt="CEJOP Tucumán"
                className="object-contain object-left w-full h-full"
                src="https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            <Link
              href="/#programa"
              className="font-encode text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-all duration-300 relative group"
            >
              El Programa
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cejop-blue-light transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#que-te-llevas"
              className="font-encode text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-all duration-300 relative group"
            >
              Qué te llevás
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cejop-blue-light transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#como-funciona"
              className="font-encode text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-all duration-300 relative group"
            >
              Cómo funciona
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cejop-blue-light transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#faq"
              className="font-encode text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-all duration-300 relative group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cejop-blue-light transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/inscribite"
              className="btn-primary px-5 py-2 text-[11px]"
              aria-label="Inscribite al programa CEJOP"
            >
              Inscribite
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-white p-2 hover:text-cejop-blue-light transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#1a1a2e] flex flex-col justify-center items-center gap-8 transition-all duration-500 transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6 text-white p-2 hover:text-cejop-blue-light transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={24} />
        </button>

        <nav className="flex flex-col items-center gap-6" aria-label="Navegación móvil">
          <Link
            href="/#programa"
            onClick={() => setMobileMenuOpen(false)}
            className="font-encode text-lg font-bold tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
          >
            El Programa
          </Link>
          <Link
            href="/#que-te-llevas"
            onClick={() => setMobileMenuOpen(false)}
            className="font-encode text-lg font-bold tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
          >
            Qué te llevás
          </Link>
          <Link
            href="/#como-funciona"
            onClick={() => setMobileMenuOpen(false)}
            className="font-encode text-lg font-bold tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
          >
            Cómo funciona
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="font-encode text-lg font-bold tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/inscribite"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-primary px-8 py-3 mt-4 text-sm"
          >
            Inscribite
          </Link>
        </nav>
      </div>
    </>
  );
}
