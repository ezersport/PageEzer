import React, { useState, useEffect } from 'react';
import { X, Ruler, Lightbulb, CheckCircle2 } from 'lucide-react';
import { SIZE_GUIDE_DATA } from '../data/mockData';

export const SizeGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('ezer-open-size-guide', handleOpen);
    return () => window.removeEventListener('ezer-open-size-guide', handleOpen);
  }, []);

  if (!isOpen) return null;

  const kidsRows = SIZE_GUIDE_DATA.filter((r) => r.category === 'Infantil');
  const adultRows = SIZE_GUIDE_DATA.filter((r) => r.category === 'Dama / Caballero');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0c3b74] flex items-center justify-center">
              <Ruler className="w-6 h-6 text-[#009fe3]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                Guía de Medidas y Tallas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Medidas oficiales en centímetros (cm) de nuestro taller de confección
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200 transition-colors"
            aria-label="Cerrar Guía de Tallas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Workshop tip alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-bold block text-amber-950 mb-0.5">Consejo del taller:</strong>
              No tomes medidas sobre el cuerpo ajustado; extiende sobre una mesa una prenda tuya que te siente cómoda y compara el ancho de pecho y el largo total.
            </div>
          </div>

          {/* Table 1: Infantil */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009fe3]"></span>
              <h3 className="font-display font-bold text-base text-slate-900">
                Línea Infantil (Monos, Suéteres y Conjuntos)
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Talla</th>
                    <th className="py-3 px-4">Pecho / Ancho</th>
                    <th className="py-3 px-4">Largo Total</th>
                    <th className="py-3 px-4">Cintura Sugerida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {kidsRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.size}</td>
                      <td className="py-3 px-4">{row.chestWidth}</td>
                      <td className="py-3 px-4">{row.totalLength}</td>
                      <td className="py-3 px-4 text-[#0c3b74] font-semibold">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Adultos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0c3b74]"></span>
              <h3 className="font-display font-bold text-base text-slate-900">
                Línea Dama / Caballero (Chaquetas, Hoodies y Pijamas)
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Talla</th>
                    <th className="py-3 px-4">Pecho / Ancho</th>
                    <th className="py-3 px-4">Largo Total</th>
                    <th className="py-3 px-4">Cintura Sugerida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {adultRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.size}</td>
                      <td className="py-3 px-4">{row.chestWidth}</td>
                      <td className="py-3 px-4">{row.totalLength}</td>
                      <td className="py-3 px-4">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Prendas confeccionadas con pretinas anatómicas elásticas que se adaptan con suavidad.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
