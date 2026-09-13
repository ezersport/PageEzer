import React from 'react';
import { Phone, MapPin, Truck, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-14 pb-8 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-sm bg-[#0c3755] p-1 flex items-center justify-center">
                <img
                  src="/images/ezer-icon.webp"
                  alt="Ezer Sport - Confección Textil"
                  className="w-full h-full object-contain"
                  width="44"
                  height="44"
                  loading="lazy"
                />
              </div>
              <span className="font-display font-black text-2xl text-[#0c3755] tracking-tight">
                EZER <span className="text-[#009fe3]">SPORT</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Taller de confección textil venezolano en Los Teques. Ropa casual, chaquetas y pijamas familiares con acabados de alta calidad. No somos intermediarios: cortamos, estampamos y cosemos cada pieza.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-800 font-medium text-xs sm:text-sm">
              <a
                href="https://instagram.com/ezer_sport"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#009fe3] transition-colors"
              >
                <svg className="w-4 h-4 text-[#009fe3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>@ezer_sport</span>
              </a>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">TikTok: @ezer_sport</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Facebook Ezer</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-base text-slate-900">
              Colecciones & Taller
            </h4>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <a href="#catalogo" className="hover:text-[#009fe3] transition-colors">
                  👶 Línea Infantil (Mickey GAP, Dino, Jirafita)
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-[#009fe3] transition-colors">
                  🧥 Chaquetas Cortavientos & Hoodies
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-[#009fe3] transition-colors">
                  🌙 Pijamas Familiares Combinadas
                </a>
              </li>
              <li>
                <a href="#mandalo-a-hacer" className="text-[#0c3b74] hover:underline font-semibold">
                  ✂️ «¡Mándalo a Hacer!» (Prendas Bajo Pedido)
                </a>
              </li>
              <li>
                <a href="#mandalo-a-hacer" className="text-emerald-700 hover:underline font-semibold">
                  📦 Precios al Mayor (a partir de 6 piezas)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Logistics & Contact */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-base text-slate-900">
              Atención & Despachos
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href="https://wa.me/584241282108"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#009fe3] font-semibold text-slate-900"
                >
                  WhatsApp: 0424-128-2108
                </a>
              </li>
              <li className="text-xs text-slate-500 pl-6">
                Horario: Lunes a Sábado de 8:00 a.m. a 6:00 p.m.
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#009fe3] shrink-0 mt-0.5" />
                <span>Taller de confección: Los Teques, Estado Miranda</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#009fe3] shrink-0 mt-0.5" />
                <span>
                  Sábados en Plaza Venezuela (Torre La Previsora) • Gratis en Los Teques • San Antonio (Altos Mirandinos)
                </span>
              </li>
              <li className="pt-1">
                <a
                  href="#tabla-de-medidas"
                  className="inline-flex items-center gap-1.5 text-xs text-[#009fe3] hover:underline font-semibold"
                >
                  <span>📏 Ver Tabla de Medidas &amp; Tallas (Guía en cm)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Ezer Sport. Taller Textil Venezolano. Todos los derechos reservados.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-500 hover:text-[#009fe3] transition-colors font-medium"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
