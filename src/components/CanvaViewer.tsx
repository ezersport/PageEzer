import React, { useState, useRef } from 'react';
import { Sparkles, Maximize2, Minimize2, Loader2, BookOpen } from 'lucide-react';
import { extractCanvaEmbedUrl } from '../lib/store';

interface CanvaViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export const CanvaViewer: React.FC<CanvaViewerProps> = ({ url, title, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [isLargeView, setIsLargeView] = useState(true);
  const embedUrl = extractCanvaEmbedUrl(url);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!embedUrl) return null;

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xl flex flex-col transition-all ${className}`}
    >
      {/* Header del Visor Interactivo */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-4 py-3 sm:px-5 sm:py-3.5 text-white flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span className="p-1.5 rounded-xl bg-white/15 backdrop-blur-md shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display font-black text-xs sm:text-sm tracking-wide uppercase text-white truncate">
                Catálogo Interactivo 🎄
              </span>
              <span className="bg-white/20 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full text-amber-100 shrink-0">
                100+ Fotos
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/90 truncate">
              {title || 'Toca ‹ › abajo en la foto para ver todos los modelos'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botón cambiar tamaño vertical */}
          <button
            type="button"
            onClick={() => setIsLargeView(!isLargeView)}
            className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white flex items-center gap-1 text-xs font-bold cursor-pointer"
            title={isLargeView ? 'Vista Estándar' : 'Vista Gigante'}
            aria-label="Cambiar tamaño"
          >
            {isLargeView ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Normal</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Grande</span>
              </>
            )}
          </button>

          {/* Botón pantalla completa nativo */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Ver catálogo a pantalla completa"
            aria-label="Ver a pantalla completa"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* Contenedor Iframe Grande y Vertical para Modelos Navideños y Diseños Móvil */}
      <div
        className={`relative w-full bg-slate-950 overflow-hidden transition-all duration-300 ${
          isLargeView
            ? 'h-[75vh] min-h-[580px] sm:min-h-[700px] max-h-[880px]'
            : 'h-[50vh] min-h-[380px] max-h-[520px]'
        }`}
      >
        {/* Skeleton mientras carga Canva */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-white gap-3 p-4 text-center">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <div className="space-y-1">
              <p className="font-semibold text-sm sm:text-base text-amber-200">
                Cargando catálogo en alta resolución...
              </p>
              <p className="text-xs text-slate-300 max-w-xs">
                Preparando todas las fotos y estampados navideños.
              </p>
            </div>
          </div>
        )}

        {/* Visor Iframe de Canva Oficial */}
        <iframe
          loading="lazy"
          title={title || 'Catálogo de Diseños Canva'}
          src={embedUrl}
          onLoad={() => setLoading(false)}
          allow="fullscreen; clipboard-write; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>

      {/* Barra de Instrucción Móvil Inferior con Explicación Clara */}
      <div className="bg-slate-50 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2.5">
          <span className="text-lg shrink-0">👉</span>
          <span className="leading-snug">
            <strong className="text-slate-900 font-bold">Cómo pasar las páginas:</strong> Toca las flechas <strong>‹</strong> y <strong>›</strong> en la barra inferior de la imagen (o toca el borde derecho de la foto para avanzar).
          </span>
        </div>
      </div>
    </div>
  );
};
