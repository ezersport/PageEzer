import React from 'react';
import { Sparkles, Package, ArrowRight, MessageCircle } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  const handleOpenWholesaleWA = () => {
    const message = '¡Hola Ezer Sport! 👋 Tengo un negocio o proyecto y me gustaría solicitar su Catálogo Mayorista con precios de fábrica a partir de 6 piezas. ¿Me podrían brindar más información?';
    window.open(`https://wa.me/584241282108?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner 1: Promo Lanzamiento / Temporada */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c3b74] via-[#092d59] to-slate-950 p-8 sm:p-10 text-white shadow-xl border border-blue-900/40 flex flex-col justify-between">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#009fe3]/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d0d709] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Promo Lanzamiento & Temporada</span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
              ¡Renueva el clóset de toda la familia!
            </h3>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Aprovecha hasta un <strong className="text-[#d0d709] font-bold">15% OFF</strong> en conjuntos infantiles, suéteres y combos familiares seleccionados. Acabados de alta durabilidad directo de nuestro taller.
            </p>
          </div>

          <div className="pt-6">
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#009fe3] hover:bg-[#0087c2] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 active:scale-95 group"
            >
              <span>Aprovechar Oferta</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Banner 2: Ventas al Mayor */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#1e293b] to-slate-950 p-8 sm:p-10 text-white shadow-xl border border-slate-700/60 flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#d0d709]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d0d709]/20 border border-[#d0d709]/30 text-[#d0d709] text-xs font-semibold uppercase tracking-wider">
              <Package className="w-3.5 h-3.5" />
              <span>Ventas al Mayor & Fabricación</span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
              ¿Tienes un negocio o proyecto?
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Manejamos precios especiales al mayor a partir de <strong className="text-white font-bold">6 piezas</strong> (surtidas en tallas y colores). Confección directa sin intermediarios. ¡Impulsa tu marca con nosotros!
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={handleOpenWholesaleWA}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 active:scale-95 group"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Solicitar Catálogo Mayorista</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
