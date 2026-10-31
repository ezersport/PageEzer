import React, { useState, useRef } from 'react';
import { Sparkles, Maximize2, Loader2, ExternalLink, BookOpen } from 'lucide-react';
import { extractCanvaEmbedUrl } from '../lib/store';

interface CanvaViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export const CanvaViewer: React.FC<CanvaViewerProps> = ({ url, title, className = '' }) => {
  const [loading, setLoading] = useState(true);
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
      className={`rounded-2xl sm:rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-md flex flex-col ${className}`}
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
              {title || 'Desliza las páginas para ver todos los estampados'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white flex items-center gap-1 text-xs font-medium cursor-pointer"
            title="Ver catálogo a pantalla completa"
            aria-label="Ver a pantalla completa"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* Contenedor Iframe con Proporción Adaptable */}
      <div className="relative w-full bg-slate-900 aspect-[4/3] sm:aspect-video min-h-[340px] sm:min-h-[420px] max-h-[580px] overflow-hidden">
        {/* Skeleton mientras carga Canva */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 text-white gap-3 p-4 text-center">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <div className="space-y-1">
              <p className="font-semibold text-sm sm:text-base text-amber-200">
                Cargando fotos del catálogo...
              </p>
              <p className="text-xs text-slate-300 max-w-xs">
                Conectando con el visor de alta resolución.
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
          allow="fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 select-none"
        />
      </div>

      {/* Barra de Instrucción Móvil Inferior */}
      <div className="bg-slate-50 px-4 py-2.5 sm:px-5 sm:py-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">👆</span>
          <span>
            <strong className="text-slate-800 font-semibold">Tip para tu pedido:</strong> Pasa las páginas con el dedo para ver todas las fotos. Recuerda el modelo que te guste para pedirlo abajo.
          </span>
        </div>
      </div>
    </div>
  );
};

