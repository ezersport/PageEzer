import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Hacen ventas al mayor y a partir de cuántas piezas?',
    answer:
      'Sí, manejamos precios especiales de fábrica a partir de 6 piezas. Puedes combinar modelos, tallas o colores según la línea para armar tu pedido. Escríbenos por WhatsApp para enviarte el catálogo mayorista vigente.',
  },
  {
    question: '¿Cuánto tarda en confeccionarse un pedido personalizado («Mándalo a Hacer»)?',
    answer:
      'El tiempo estimado de corte, estampado y confección es de 4 a 7 días hábiles tras confirmar el pago o abono. El plazo exacto dependerá del volumen de prendas y la técnica de personalización requerida.',
  },
  {
    question: '¿Las prendas en stock tienen entrega inmediata?',
    answer:
      'Las piezas disponibles en stock se procesan y despachan en un lapso de 24 a 48 horas hábiles tras verificar el pago. Aunque tengamos disponibilidad inmediata, la entrega final se coordina según tu ubicación: retiro o delivery en Los Teques/Caracas, o por agencia de encomiendas.',
  },
  {
    question: '¿Cuáles son los métodos de pago y qué tasa de cambio utilizan?',
    answer:
      'Aceptamos bolívares mediante transferencia bancaria y Pago Móvil (Banco Mercantil y Banco de Venezuela). En divisas recibimos Zinli y Binance Pay (USDT). Los pagos en moneda nacional se calculan a la tasa oficial del Banco Central de Venezuela (BCV) del día.',
  },
  {
    question: '¿Dónde entregan en Caracas y hacen envíos a toda Venezuela?',
    answer:
      'Coordinamos entregas personales y delivery en zonas céntricas y accesibles de Caracas y Los Teques previa cita. Para el resto del país, realizamos envíos cobro en destino a través de MRW, Zoom, Tealca y Domesa, enviándote la guía para rastrear tu paquete.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="bg-white py-20 sm:py-24 border-t border-slate-200 relative overflow-hidden"
    >
      {/* Ambient background blur */}
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div
          className={`text-center space-y-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0c3755] text-xs sm:text-sm font-bold border border-blue-100 shadow-sm">
            <HelpCircle className="w-4 h-4 text-[#009fe3]" />
            <span>Resolvemos tus dudas</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight uppercase">
            Preguntas Frecuentes
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Conoce los tiempos de confección, entregas en Caracas y Los Teques, y escalas de precios al mayor.
          </p>
        </div>

        {/* Dynamic Accordion list with scroll reveal and smooth CSS grid unfolding */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const delayMs = index * 100;

            return (
              <div
                key={index}
                style={{ transitionDelay: `${delayMs}ms` }}
                className={`rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                } ${
                  isOpen
                    ? 'border-[#009fe3] bg-gradient-to-b from-blue-50/40 to-white shadow-lg shadow-blue-500/5'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none group"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display font-bold text-base sm:text-lg transition-colors ${
                      isOpen ? 'text-[#0c3755]' : 'text-slate-800 group-hover:text-[#009fe3]'
                    }`}
                  >
                    {faq.question}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm ${
                      isOpen
                        ? 'bg-[#009fe3] text-white rotate-180 scale-105'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#009fe3]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* Buttery smooth grid expansion container */}
                <div
                  className={`accordion-content-grid ${isOpen ? 'is-open' : ''}`}
                >
                  <div className="accordion-content-inner">
                    <div className="px-5 sm:px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/90 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
