import React from 'react';
import { Palette, Scissors, Clock, CheckCircle2, MessageCircle, Sparkles, Shirt } from 'lucide-react';

export const CustomOrderSection: React.FC = () => {
  const handleOpenWhatsAppCustom = () => {
    const message = `¡Hola Ezer Sport! ✂️ Quiero confeccionar un pedido especial «¡Mándalo a Hacer!»:
- Tipo de prenda: 
- Cantidad estimada (detal o por volumen): 
- Técnica de interés (DTF / Vinil / Sublimación / Confección lisa): 
- Tallas o especificaciones: 

¿Me pueden orientar con la cotización y tiempo de confección?`;
    window.open(`https://wa.me/584241282108?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="mandalo-a-hacer" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#009fe3]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#d0d709]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#009fe3] text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <Scissors className="w-4 h-4 text-[#d0d709]" />
            <span>Servicio Exclusivo de Taller Textil</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            «¡Mándalo a Hacer!»
          </h2>

          <p className="font-display font-bold text-xl sm:text-2xl text-blue-200">
            ¿Tienes una idea en mente? Nosotros la confeccionamos.
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Si buscas una prenda única, tallas especiales, uniformes para tu equipo de trabajo o pijamas combinadas para una fecha familiar especial, en nuestro taller hacemos realidad tu proyecto con acabados industriales de primera.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Step 1 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-[#009fe3]/50 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0c3b74] text-[#009fe3] border border-blue-500/30 flex items-center justify-center font-display font-black text-2xl">
                1
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Elige el modelo o referencia
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Comparte tu boceto, logo, foto de inspiración o elige la estructura base (chaqueta cortavientos, hoodie, mono jogger, franela o pijama).
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-blue-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#d0d709]" />
              <span>Corte a la medida de tus ideas</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-[#009fe3]/50 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0c3b74] text-[#d0d709] border border-yellow-500/30 flex items-center justify-center font-display font-black text-2xl">
                2
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Selecciona tela, colores y técnica
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Personalizamos con las mejores técnicas del mercado: <strong className="text-white">DTF digital</strong> de alta resolución, <strong className="text-white">vinil textil</strong> resistente al lavado o <strong className="text-white">sublimación</strong> full color.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-yellow-200 font-medium">
              <Palette className="w-4 h-4 text-[#d0d709]" />
              <span>Colores firmes y telas certificadas</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-[#009fe3]/50 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0c3b74] text-white border border-blue-400/30 flex items-center justify-center font-display font-black text-2xl">
                3
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Medidas, cantidades y cotización
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Indícanos las tallas requeridas y volumen. Te entregamos cotización inmediata de taller y tiempo de confección estimado (<strong className="text-white">4 a 7 días hábiles</strong>).
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-blue-200 font-medium">
              <Clock className="w-4 h-4 text-[#009fe3]" />
              <span>Tiempos de despacho confiables</span>
            </div>
          </div>
        </div>

        {/* Call to Action CTA */}
        <div className="text-center pt-4">
          <a
            href="https://wa.me/584241282108?text=%C2%A1Hola%20Ezer%20Sport!%20%E2%9C%82%EF%B8%8F%20Quiero%20confeccionar%20un%20pedido%20especial%20%C2%AB%C2%A1M%C3%A1ndalo%20a%20Hacer!%C2%BB%20directo%20de%20taller"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-base sm:text-lg tracking-wide uppercase shadow-[0_0_30px_rgba(5,150,105,0.4)] hover:shadow-[0_0_40px_rgba(5,150,105,0.6)] transition-all duration-300 active:scale-95 group cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            <span>Diseñar mi pedido por WhatsApp</span>
          </a>
          <p className="text-xs text-slate-400 mt-3">
            Atención directa de taller • Lunes a Sábado de 8:00 a.m. a 6:00 p.m.
          </p>
        </div>
      </div>
    </section>
  );
};
