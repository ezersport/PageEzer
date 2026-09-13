import React from 'react';
import { MapPin, Truck, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';

export const DeliveryInfoSection: React.FC = () => {
  return (
    <section id="entregas" className="relative w-full overflow-hidden bg-slate-950 pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36 text-white">
      {/* Background: Edge-to-edge El Ávila Panoramic View with vibrant lighting */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/images/avila-entregas-banner.webp')`,
        }}
      >
        {/* Soft, light gradient overlay so the mountain image is clearly visible behind the frosted cards */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-sky-950/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with generous top spacing and clean modern typography */}
        <div className="text-center space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-[#d0d709]" />
            <span>PUNTOS FIJOS &amp; DESPACHOS DIRECTOS</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            ENTREGAS
          </h2>

          <p className="text-white/95 text-base sm:text-lg max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed">
            Confeccionamos en <strong className="text-white font-bold underline decoration-[#009fe3] underline-offset-4">Los Teques</strong> y te entregamos en Caracas, Altos Mirandinos o enviamos a toda Venezuela.
          </p>
        </div>

        {/* Frosted Translucent Cards Grid (mountain visible through the cards, no repeated badges, min 16px font size) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {/* Card 1: Caracas */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border-2 border-white/90 hover:bg-white/90 hover:shadow-[0_24px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-5 text-slate-900">
            <div className="space-y-4">
              {/* Header Box */}
              <div className="border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#009fe3] block mb-1">
                  Punto de Encuentro
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
                  CARACAS
                </h3>
              </div>

              {/* Day & Location badge */}
              <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-100/90 space-y-1">
                <span className="font-display font-bold text-base text-[#0c3b74] block">
                  🗓️ Sábados
                </span>
                <p className="font-display font-bold text-base text-slate-900 leading-snug">
                  Plaza Venezuela
                </p>
                <p className="text-base text-slate-700 font-medium">
                  Frente a la <strong className="text-slate-900">Torre La Previsora</strong>
                </p>
              </div>

              {/* Free delivery promo badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-display font-black text-base">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>¡ENTREGA GRATIS!</span>
                </div>
                <p className="text-base text-emerald-900 font-semibold leading-snug">
                  Para pedidos y compras al mayor
                </p>
              </div>

              <p className="text-base text-slate-700 leading-relaxed">
                Entregas en punto acordado coordinadas directamente con el taller.
              </p>
            </div>
          </div>

          {/* Card 2: Los Teques */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border-2 border-white/90 hover:bg-white/90 hover:shadow-[0_24px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-5 text-slate-900">
            <div className="space-y-4">
              {/* Header Box */}
              <div className="border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                  Base del Taller Textil
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
                  LOS TEQUES
                </h3>
              </div>

              {/* Free badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 space-y-1">
                <span className="font-display font-black text-base text-emerald-700 block">
                  🎉 ¡ENTREGA 100% GRATIS!
                </span>
                <p className="text-base text-emerald-900 font-medium">
                  Sin costo de delivery adicional
                </p>
              </div>

              {/* Meeting Points */}
              <div className="space-y-2">
                <span className="text-base font-bold text-slate-900 block">
                  Puntos de Encuentro:
                </span>
                <ul className="space-y-2 text-base text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span><strong>Estación Independencia</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span><strong>Estación Alí Primera</strong></span>
                  </li>
                </ul>
                <p className="text-base text-slate-600 pt-1 leading-relaxed">
                  Metro Los Teques. Entregas de Lunes a Sábado con previa confirmación.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: San Antonio */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border-2 border-white/90 hover:bg-white/90 hover:shadow-[0_24px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-5 text-slate-900">
            <div className="space-y-4">
              {/* Header Box */}
              <div className="border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Altos Mirandinos
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
                  SAN ANTONIO
                </h3>
              </div>

              {/* Price badge */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-1">
                <span className="font-display font-black text-base text-amber-800 block">
                  🛵 Delivery Directo Express
                </span>
                <p className="text-base text-amber-900 font-medium">
                  Directo y express en Altos Mirandinos
                </p>
              </div>

              {/* 3 Meeting Points: Rosaleda, La Casona, Farmatodo */}
              <div className="space-y-2">
                <span className="text-base font-bold text-slate-900 block">
                  Puntos de Encuentro:
                </span>
                <ul className="space-y-2 text-base text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span><strong>La Rosaleda</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span><strong>La Casona</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span><strong>Farmatodo</strong></span>
                  </li>
                </ul>
                <p className="text-base text-slate-600 pt-1 leading-relaxed">
                  También despachamos directo a domicilio en San Antonio y Carrizal.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Envíos Nacionales */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border-2 border-white/90 hover:bg-white/90 hover:shadow-[0_24px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-5 text-slate-900">
            <div className="space-y-4">
              {/* Header Box */}
              <div className="border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
                  A Todo el País
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
                  VENEZUELA
                </h3>
              </div>

              {/* National badge */}
              <div className="p-3.5 rounded-2xl bg-sky-50/90 border border-sky-200/90 space-y-1">
                <span className="font-display font-bold text-base text-[#0c3b74] block">
                  📦 Envíos Nacionales
                </span>
                <p className="font-display font-bold text-base text-slate-900">
                  MRW • Zoom • Tealca • Domesa
                </p>
              </div>

              {/* Service Details */}
              <div className="space-y-2">
                <span className="text-base font-bold text-slate-900 block">
                  Modalidad de Envío:
                </span>
                <p className="text-base text-slate-700 leading-relaxed">
                  <strong>Cobro en Destino (COD)</strong> a cualquier agencia o domicilio de Venezuela.
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Te proporcionamos tu número de guía oficial al instante para rastreo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Strip */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 text-slate-900">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0c3b74] flex items-center justify-center shrink-0 border border-blue-200 shadow-sm">
              <Truck className="w-7 h-7 text-[#009fe3]" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug tracking-tight">
                Tengo dudas para coordinar las entregas
              </h4>
              <p className="text-sm sm:text-base text-slate-800 font-medium mt-1">
                Escríbenos directamente y coordinamos contigo en Plaza Venezuela, Los Teques, San Antonio o tu envío nacional.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/584241282108?text=Hola%20Ezer%20Sport!%20Tengo%20dudas%20para%20coordinar%20las%20entregas"
            target="_blank"
            rel="noreferrer"
            className="px-7 py-4 rounded-2xl bg-[#0c3755] hover:bg-[#009fe3] text-white font-display font-bold text-base sm:text-lg transition-all shrink-0 shadow-lg hover:shadow-cyan-500/25 active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Consultar Entrega por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
