import React from 'react';
import { Ruler, Lightbulb, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { SIZE_GUIDE_DATA } from '../data/mockData';

export const SizeGuideSection: React.FC = () => {
  const kidsRows = SIZE_GUIDE_DATA.filter((r) => r.category === 'Infantil');
  const adultRows = SIZE_GUIDE_DATA.filter((r) => r.category === 'Dama / Caballero');

  const handleOpenWASizeHelp = () => {
    const message = '¡Hola Ezer Sport! 👋 Tengo dudas para elegir la talla ideal de una prenda (medidas de mi niño/familiar). ¿Me podrían orientar?';
    window.open(`https://wa.me/584241282108?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="tabla-de-medidas" className="py-20 bg-gradient-to-b from-white via-sky-50/40 to-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0c3b74] text-xs sm:text-sm font-semibold border border-blue-100 shadow-sm">
            <Ruler className="w-4 h-4 text-[#009fe3]" />
            <span>Guía de Confección en Centímetros (cm)</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight uppercase">
            TABLA DE MEDIDAS &amp; TALLAS
          </h2>

          <p className="font-display font-bold text-xl sm:text-2xl text-[#009fe3]">
            Elige con total seguridad la talla ideal para tus niños y toda la familia
          </p>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Nuestras prendas son confeccionadas con moldes cómodos y holgados para garantizar libertad de movimiento y máxima durabilidad.
          </p>
        </div>

        {/* Visual Measurement Cards with real photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Visual Card 1: Suéteres y Monos Niños */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col space-y-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
              <img
                src="/images/conjunto-ninos-mickey.webp"
                alt="Medidas de Suéter y Mono Infantil Ezer Sport"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width="400"
                height="300"
              />
              <span className="absolute bottom-3 left-3 bg-[#0c3b74]/95 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow">
                👶 Conjuntos Niños
              </span>
            </div>

            <div className="space-y-3 flex-1">
              <h4 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug">
                ¿Cómo medir el conjunto infantil?
              </h4>
              <ul className="text-base text-slate-700 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">1.</span>
                  <span><strong className="text-slate-900 font-bold">Ancho / Pecho:</strong> Mide de axila a axila sobre la prenda en plano.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">2.</span>
                  <span><strong className="text-slate-900 font-bold">Largo de Suéter:</strong> Desde el punto más alto del hombro hasta la pretina.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">3.</span>
                  <span><strong className="text-slate-900 font-bold">Mono Jogger:</strong> Pretina elástica anatómica que no aprieta la pancita.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Card 2: Chaquetas Cortavientos */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col space-y-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
              <img
                src="/images/chaqueta-cortavientos.webp"
                alt="Medidas de Chaquetas Cortavientos Ezer Sport"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
                width="400"
                height="300"
              />
              <span className="absolute bottom-3 left-3 bg-[#881337]/95 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow">
                🧥 Chaquetas &amp; Adultos
              </span>
            </div>

            <div className="space-y-3 flex-1">
              <h4 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug">
                ¿Cómo medir chaquetas y hoodies?
              </h4>
              <ul className="text-base text-slate-700 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">1.</span>
                  <span><strong className="text-slate-900 font-bold">Pecho:</strong> Extiende la chaqueta cerrada y mide de lado a lado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">2.</span>
                  <span><strong className="text-slate-900 font-bold">Cintura / Ruedo:</strong> Cordón ajustable para llevarla suelta o recogida.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">3.</span>
                  <span><strong className="text-slate-900 font-bold">Corte Liviano:</strong> Diseñada para usar cómodamente sobre franelas.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Card 3: Pijamas y Prendas Frescas */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col space-y-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
              <img
                src="/images/pijamas-familiares.webp"
                alt="Medidas de Pijamas Familiares Ezer Sport"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width="400"
                height="300"
              />
              <span className="absolute bottom-3 left-3 bg-emerald-700/95 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow">
                🌙 Pijamas Familiares
              </span>
            </div>

            <div className="space-y-3 flex-1">
              <h4 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug">
                Algodón suave para descanso
              </h4>
              <ul className="text-base text-slate-700 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">1.</span>
                  <span><strong className="text-slate-900 font-bold">Pantalón de Pijama:</strong> Cintura con elástico suave que no marca la piel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">2.</span>
                  <span><strong className="text-slate-900 font-bold">Caída Relajada:</strong> Tela 100% transpirable ideal para climas frescos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#009fe3] font-black text-base shrink-0">3.</span>
                  <span><strong className="text-slate-900 font-bold">A Juego:</strong> Tallas disponibles para mamá, papá y los niños.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tables Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Table 1: Infantil */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#009fe3]"></span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Línea Infantil (Tallas 2 a 14)
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#0c3b74] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Monos &amp; Suéteres
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Talla</th>
                    <th className="py-3.5 px-4">Pecho / Ancho</th>
                    <th className="py-3.5 px-4">Largo Total</th>
                    <th className="py-3.5 px-4">Cintura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {kidsRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.size}</td>
                      <td className="py-3.5 px-4 text-[#009fe3] font-semibold">{row.chestWidth}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{row.totalLength}</td>
                      <td className="py-3.5 px-4 text-slate-500">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Modelos disponibles también desde la talla 1 para los más pequeñitos de la casa.</span>
            </p>
          </div>

          {/* Table 2: Adultos */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#0c3b74]"></span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Línea Dama / Caballero (S a XL)
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#009fe3] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Chaquetas &amp; Pijamas
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Talla</th>
                    <th className="py-3.5 px-4">Pecho / Ancho</th>
                    <th className="py-3.5 px-4">Largo Total</th>
                    <th className="py-3.5 px-4">Cintura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {adultRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.size}</td>
                      <td className="py-3.5 px-4 text-[#009fe3] font-semibold">{row.chestWidth}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{row.totalLength}</td>
                      <td className="py-3.5 px-4 text-slate-500">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Para tallas especiales (XXL o pedidos a medida), puedes solicitar confección en «Mándalo a Hacer».</span>
            </p>
          </div>
        </div>

        {/* Workshop Tip Banner + WhatsApp Asesoría */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-black text-lg text-amber-950">
                Consejo del taller textil:
              </h4>
              <p className="text-base text-amber-900/90 leading-relaxed max-w-2xl">
                No tomes medidas sobre el cuerpo ajustado; mide una prenda similar tuya o de tu niño que le siente cómoda extendida en plano sobre una mesa y compara ancho y largo.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenWASizeHelp}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Asesoría de Tallas por WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
