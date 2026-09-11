import React, { useEffect, useState } from 'react';
import { ArrowDown, Scissors, Sparkles, Package } from 'lucide-react';

export const FullWidthHero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Full-bleed background with parallax and lighter overlays for visible workshop machines */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 scale-105"
        style={{
          backgroundImage: `url('/images/hero-familia-taller.webp')`,
          transform: `translateY(${scrollY * 0.22}px) scale(1.05)`,
        }}
      >
        {/* Soft, warm overlays allowing the family and workshop textiles to show through */}
        <div className="absolute inset-0 bg-slate-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50"></div>
      </div>

      {/* Blue accent glow line */}
      <div
        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#009fe3] to-transparent shadow-[0_0_25px_#009fe3] opacity-70 pointer-events-none transition-all duration-300"
        style={{
          bottom: `${Math.min(100, scrollY * 0.4)}px`,
        }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 pt-12 pb-20">
        {/* Workshop badge - hidden on mobile as requested, floating animation on desktop */}
        <div className="hidden sm:inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white shadow-xl animate-fadeInUp animate-floatGentle">
          <Scissors className="w-4 h-4 text-[#d0d709]" />
          <span className="font-medium text-sm sm:text-base text-blue-100">
            Taller de Confección Textil Directo de Fábrica
          </span>
          <span className="text-white/40">•</span>
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white">
            Ezer Sport
          </span>
        </div>

        {/* High-Impact Brand Title with dynamic entrance */}
        <h1
          style={{ animationDelay: '150ms' }}
          className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] animate-fadeInUp"
        >
          Comodidad real para <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#009fe3]">
            entrenar, descansar y compartir.
          </span>
        </h1>

        {/* Clear Two-Line Subtitle with staggered entrance */}
        <div
          style={{ animationDelay: '300ms' }}
          className="max-w-3xl mx-auto space-y-2 pt-1 animate-fadeInUp"
        >
          <p className="font-display font-medium text-base sm:text-xl md:text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-relaxed">
            Línea deportiva, monos, suéteres y pijamas familiares confeccionadas con amor y precisión.
          </p>
          <p className="font-display font-semibold text-sm sm:text-lg md:text-xl text-blue-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            100% confección venezolana. <span className="text-[#d0d709]">Ventas al detal y combos al mayor.</span>
          </p>
        </div>

        {/* Action Buttons with staggered entrance */}
        <div
          style={{ animationDelay: '450ms' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-3 animate-fadeInUp"
        >
          <a
            href="#catalogo"
            className="group relative px-9 py-4 sm:py-5 rounded-2xl bg-[#009fe3] hover:bg-[#0087c2] text-white font-display font-bold text-base sm:text-lg tracking-wide uppercase shadow-[0_0_30px_rgba(0,159,227,0.5)] hover:shadow-[0_0_50px_rgba(0,159,227,0.8)] transition-all duration-300 active:scale-95 flex items-center gap-3 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out"></div>
            <span>EXPLORAR COLECCIÓN</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </a>

          <a
            href="#mandalo-a-hacer"
            className="px-8 py-4 sm:py-5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-display font-semibold text-base sm:text-lg tracking-wide border border-white/30 hover:border-white/50 transition-all flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
          >
            <Scissors className="w-5 h-5 text-[#d0d709]" />
            <span>«¡Mándalo a Hacer!»</span>
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none"></div>
    </section>
  );
};
