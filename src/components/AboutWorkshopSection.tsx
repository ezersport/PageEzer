import React from 'react';
import { ShieldCheck, HeartHandshake, Scissors, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutWorkshopSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image & Guarantee badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              <img
                src="/images/historia-taller-familiar.webp"
                alt="Taller textil venezolano Ezer Sport en Los Teques - Confección familiar y dedicación"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width="800"
                height="600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#d0d709] block mb-1">
                  Taller Textil en Los Teques
                </span>
                <p className="font-display font-bold text-lg sm:text-xl leading-tight">
                  Maquinaria industrial y dedicación venezolana en cada costura
                </p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0c3b74] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#009fe3]" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Confección Propia
                </span>
                <span className="block font-display font-bold text-sm sm:text-base text-slate-900">
                  Directo de Fábrica
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0c3b74] text-xs sm:text-sm font-semibold border border-blue-100">
              <HeartHandshake className="w-4 h-4 text-[#009fe3]" />
              <span>Nuestra Historia & Compromiso</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Detrás de cada costura, una pasión familiar
              </h2>
              <p className="font-display font-bold text-lg sm:text-xl text-[#009fe3]">
                Confección cuidada al milímetro con manos venezolanas
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nacimos con el propósito de ofrecer prendas con verdadero valor: ropa pensada para durar, con telas seleccionadas y confección cuidada al milímetro. En nuestro taller combinamos maquinaria industrial, precisión técnica y un trato cercano para vestir a familias y marcas.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Creemos en la producción consciente y en el poder de personalizar: desde conjuntos infantiles y chaquetas cortavientos hasta pijamas familiares que unen hogares. Cuando compras con nosotros, no llevas una prenda genérica; llevas el resultado de dedicación y compromiso total con la calidad.
            </p>

            {/* The core manufacturer pillar */}
            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-display font-bold text-slate-900 text-base">
                <Scissors className="w-5 h-5 text-[#009fe3]" />
                <span>No somos intermediarios</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900">Cortamos, estampamos y cosemos cada pieza</strong>. Cuando compras en Ezer Sport, apoyas la manufactura local y te llevas a casa prendas con acabados industriales de alta durabilidad y confort.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Taller en Los Teques</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ventas al detal y mayor</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Despacho 24-48h stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
