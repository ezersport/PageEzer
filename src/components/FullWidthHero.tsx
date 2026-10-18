import React from 'react';
import { ArrowDown, Scissors } from 'lucide-react';

/**
 * Hero principal. Es HTML estático (sin hidratación): la imagen es un <img>
 * real con prioridad alta y versión móvil liviana, lo que mejora el LCP.
 */
export const FullWidthHero: React.FC = () => (
  <section
    aria-labelledby="hero-titulo"
    className="relative w-full min-h-[72svh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-950"
  >
    <img
      src="/images/hero-familia-taller.webp"
      srcSet="/images/hero-familia-taller-768.webp 768w, /images/hero-familia-taller.webp 1376w"
      sizes="100vw"
      alt="Familia trabajando en el taller de confección textil Ezer Sport en Los Teques"
      width={1376}
      height={768}
      fetchPriority="high"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />

    {/* Capas para garantizar contraste del texto sobre la foto */}
    <div className="absolute inset-0 bg-slate-950/45" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/40" />

    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-7 pt-10 pb-16">
      <p className="hidden sm:inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white shadow-xl animate-fadeInUp">
        <Scissors className="w-4 h-4 text-[#d0d709]" aria-hidden="true" />
        <span className="font-medium text-sm sm:text-base text-blue-100">
          Taller de confección textil directo de fábrica
        </span>
      </p>

      <h1
        id="hero-titulo"
        style={{ animationDelay: '100ms' }}
        className="font-display font-black text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] animate-fadeInUp"
      >
        Ropa para niños y familia{' '}
        <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#009fe3]">
          hecha en Venezuela.
        </span>
      </h1>

      <div style={{ animationDelay: '200ms' }} className="max-w-3xl mx-auto space-y-2 animate-fadeInUp">
        <p className="font-display font-medium text-base sm:text-xl md:text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-relaxed">
          Pijamas, uniformes, ropa deportiva, monos y suéteres confeccionados en nuestro taller de Los Teques.
        </p>
        <p className="font-display font-semibold text-sm sm:text-lg md:text-xl text-blue-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Ventas al detal y <span className="text-[#d0d709]">al mayor desde 6 piezas.</span>
        </p>
      </div>

      <div
        style={{ animationDelay: '300ms' }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5 pt-2 max-w-xs sm:max-w-none mx-auto animate-fadeInUp"
      >
        <a
          href="#catalogo"
          className="group px-8 py-4 rounded-2xl bg-[#009fe3] hover:bg-[#0087c2] text-white font-display font-bold text-base sm:text-lg tracking-wide uppercase shadow-[0_0_30px_rgba(0,159,227,0.45)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
        >
          <span>Ver catálogo</span>
          <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" aria-hidden="true" />
        </a>
        <a
          href="#mandalo-a-hacer"
          className="px-8 py-4 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-display font-semibold text-base sm:text-lg border border-white/30 hover:border-white/50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          <Scissors className="w-5 h-5 text-[#d0d709]" aria-hidden="true" />
          <span>«¡Mándalo a Hacer!»</span>
        </a>
      </div>

      {/* Indicador de scroll dinámico hacia categorías */}
      <div className="pt-6 sm:pt-8 flex justify-center">
        <a
          href="#categorias-principales"
          className="inline-flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors group cursor-pointer"
          aria-label="Desplazarse a las categorías de confección"
        >
          <span className="tracking-widest uppercase text-[10px] font-semibold text-blue-200 group-hover:text-white transition-colors">
            Explorar departamentos
          </span>
          <span className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1 group-hover:border-[#009fe3] transition-colors shadow-sm">
            <span className="w-1.5 h-2 bg-[#d0d709] rounded-full animate-bounce"></span>
          </span>
        </a>
      </div>
    </div>

    {/* Línea luminosa de transición entre el Hero y las Categorías */}
    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#009fe3]/80 to-transparent shadow-[0_0_20px_#009fe3] z-10" />
    <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none" />
  </section>
);
