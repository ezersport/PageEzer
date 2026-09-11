import React from 'react';
import { ArrowRight, Sparkles, Truck, Flame } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200/80">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-50/80 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0c3b74] text-xs sm:text-sm font-medium">
              <Sparkles className="w-4 h-4 text-[#009fe3]" />
              <span>Fabricantes Directos • Los Teques, Altos Mirandinos</span>
            </div>

            {/* Main Headline with delicate, elegant typography */}
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.2]">
              Moda Deportiva & Urbana{' '}
              <span className="text-[#0c3b74] block sm:inline">
                al Detal y al Mayor
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
              En <strong className="text-slate-900 font-semibold">Ezer Sport</strong> confeccionamos ropa deportiva y suéteres infantiles con los personajes favoritos y estilo urbano. Compra fácil por WhatsApp y aprovecha <span className="text-[#0c3b74] font-semibold">precios al mayor a partir de 3, 6 y 12 piezas</span> combinando las tallas y modelos que prefieras.
            </p>

            {/* Key Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalogo"
                className="bg-[#009fe3] hover:bg-[#0087c2] text-white px-7 py-3.5 rounded-2xl font-display font-medium text-base transition-all duration-200 shadow-md shadow-cyan-500/15 hover:shadow-cyan-500/25 flex items-center gap-2 active:scale-95"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#mayorista"
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-2xl font-display font-medium text-base transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Precios por Volumen (1, 3, 6, 12)</span>
              </a>
            </div>

            {/* Delivery highlights banner inside hero */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-[#0c3b74]">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <span>Jornadas de Entrega los Viernes en Caracas</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-0.5 rounded-full">
                    Gratis según compra
                  </span>
                </p>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  Puntos fijos en Metro <strong>La Hoyada</strong> y <strong>Las Adjuntas</strong>. También entregas en <strong>Los Teques</strong> y envíos a toda Venezuela.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white">
                <img
                  src="/images/kids-sweaters.jpg"
                  alt="Colección Infantil Ezer Sport"
                  className="w-full h-80 object-cover object-top"
                />
                <div className="p-6 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0c3b74] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Colección Infantil
                    </span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                      🟢 Entrega Inmediata
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl text-slate-900">
                    Suéteres Infantiles (Sonic, Minnie & Koala)
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Tallas 4 a 12 • Precios por mayor se activan solos en el carrito
                  </p>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="block text-xs text-slate-500">1 Pieza</span>
                      <span className="font-bold text-slate-900 text-sm">$10.00</span>
                    </div>
                    <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-100">
                      <span className="block text-xs text-[#009fe3] font-medium">x3 Piezas</span>
                      <span className="font-bold text-[#0c3b74] text-sm">$8.50 c/u</span>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                      <span className="block text-xs text-amber-700 font-bold">1/2 Doc (6)</span>
                      <span className="font-bold text-amber-800 text-sm">$7.50 c/u</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="block text-xs text-slate-600 font-medium">Docena (12)</span>
                      <span className="font-bold text-slate-900 text-sm">$6.50 c/u</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href="#ninos"
            className="group p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-[#009fe3] transition-all flex items-center gap-3 shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">
              👶
            </div>
            <div>
              <p className="font-display font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#009fe3] transition-colors">
                Infantil & Estampados
              </p>
              <p className="text-xs text-slate-500">Sonic, Minnie, Koala</p>
            </div>
          </a>

          <a
            href="#damas"
            className="group p-4 rounded-2xl bg-white hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 transition-all flex items-center gap-3 shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <p className="font-display font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#009fe3] transition-colors">
                Colección Damas
              </p>
              <p className="text-xs text-slate-500">Conjuntos High-Waist</p>
            </div>
          </a>

          <a
            href="#caballeros"
            className="group p-4 rounded-2xl bg-white hover:bg-slate-100/50 border border-slate-200 hover:border-slate-400 transition-all flex items-center gap-3 shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">
              🏃
            </div>
            <div>
              <p className="font-display font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#009fe3] transition-colors">
                Caballeros
              </p>
              <p className="text-xs text-slate-500">Joggers y Dry-Fit</p>
            </div>
          </a>

          <a
            href="#mayorista"
            className="group p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:border-[#009fe3] transition-all flex items-center gap-3 shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#0c3b74] text-white flex items-center justify-center text-lg font-bold">
              🔥
            </div>
            <div>
              <p className="font-display font-semibold text-sm sm:text-base text-[#0c3b74]">
                Combos y Mayor
              </p>
              <p className="text-xs text-slate-600">Escalas x3, x6, x12</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
