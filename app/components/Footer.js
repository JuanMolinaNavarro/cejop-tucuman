import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b0b14] text-white/50 font-source pt-16 pb-10 border-t border-white/5">
      <div className="section-container">
        
        {/* Top 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 pb-12">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="w-44 h-12 relative opacity-90">
              <img
                alt="CEJOP Tucumán"
                className="object-contain object-left w-full h-full"
                src="https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Centro de Jóvenes Políticos. Formación política e institucional para jóvenes de 18 a 30 años en Tucumán, Argentina.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4 md:pl-10">
            <h3 className="font-montserrat font-bold text-xs tracking-widest text-white/90 uppercase">
              Navegación
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/50">
              <li>
                <Link href="/#programa" className="hover:text-white transition-colors">
                  El Programa
                </Link>
              </li>
              <li>
                <Link href="/#que-te-llevas" className="hover:text-white transition-colors">
                  Qué te llevás
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-white transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/inscribite" className="hover:text-white transition-colors">
                  Inscripción
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-montserrat font-bold text-xs tracking-widest text-white/90 uppercase">
              Contacto
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-white/50">
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-white/40"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <a href="mailto:cejoptucuman@gmail.com" className="hover:text-white transition-colors">
                  cejoptucuman@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-white/40"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <a
                  href="https://www.instagram.com/cejoptucuman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @cejoptucuman
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Divider and Bottom Row */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40 font-source">
          <p>© 2026 CEJOP Tucumán. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-2">
            <span>Desarrollado por</span>
            <a
              href="https://vitrio.tech?utm_source=cejoptucuman&utm_medium=landing-footer&utm_campaign=powered-by"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors inline-flex items-center gap-1 font-semibold"
            >
              {/* Vitrio Emblem: Styled Purple/Blue Slash & Red Slash */}
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-auto"
              >
                <path
                  d="M5 11L10 1"
                  stroke="#5267c9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 11L15 1"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
