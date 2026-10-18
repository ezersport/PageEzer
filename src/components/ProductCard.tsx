import React from 'react';
import type { Product } from '../types';
import { formatBs } from '../lib/store';
import { ArrowRight, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currentRate: number;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, currentRate, onSelectProduct }) => {
  const priceBs = (product.basePriceUSD || 0) * (currentRate || 76.50);
  const productUrl = `/producto/${product.slug}`;

  // Extraer opciones únicas de forma segura
  const safeVariants = Array.isArray(product.variants) ? product.variants : [];
  const uniqueVariants = Array.from(
    new Map(
      safeVariants.map((v) => [v.optionName || 'Estándar', v])
    ).values()
  );

  const mainImage =
    (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) ||
    '/images/conjunto-ninos-mickey.webp';

  const handleClick = (e: React.MouseEvent) => {
    if (onSelectProduct) {
      e.preventDefault();
      onSelectProduct(product);
    }
  };

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-[#009fe3] transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1">
      {/* Product Image Link */}
      <a
        href={productUrl}
        onClick={handleClick}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 block text-left cursor-pointer"
        aria-label={`Ver prenda ${product.name}`}
      >
        <img
          src={mainImage}
          alt={product.name || 'Prenda de Confección Textil Ezer Sport'}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 items-start">
          {product.badge && (
            <span className="bg-[#0c3b74] text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}

          {product.availability === 'inmediato' ? (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>En Stock</span>
            </span>
          ) : (
            <span className="bg-amber-600/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Bajo Pedido</span>
            </span>
          )}
        </div>
      </a>

      {/* Product Information */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1 sm:space-y-1.5">
          {product.fabric && (
            <p className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-wide uppercase line-clamp-1">
              {product.fabric}
            </p>
          )}

          <h3 className="font-display font-semibold text-sm sm:text-base lg:text-lg text-slate-900 leading-snug line-clamp-2 group-hover:text-[#009fe3] transition-colors">
            <a
              href={productUrl}
              onClick={handleClick}
              className="text-left font-semibold hover:text-[#009fe3] transition-colors cursor-pointer"
            >
              {product.name || 'Prenda de Confección'}
            </a>
          </h3>

          {/* Color / Option Circles or Badges */}
          <div className="pt-0.5 flex items-center gap-1.5">
            {uniqueVariants.length > 0 && uniqueVariants.some((v) => v.colorHex && v.colorHex !== '#009fe3') ? (
              <div className="flex items-center gap-1">
                {uniqueVariants.slice(0, 4).map((v) => (
                  <span
                    key={v.id}
                    title={v.optionName}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-slate-300 shadow-xs"
                    style={{ backgroundColor: v.colorHex || '#009fe3' }}
                  ></span>
                ))}
                {uniqueVariants.length > 4 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    +{uniqueVariants.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] sm:text-xs text-[#009fe3] font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                Directo de Taller
              </span>
            )}
          </div>
        </div>

        {/* Bottom Section: Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <span className="font-display font-black text-base sm:text-xl lg:text-2xl text-slate-900 block leading-tight truncate">
              {formatBs(priceBs)}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-normal block truncate">
              Mayor desde 6 pzs
            </span>
          </div>

          <a
            href={productUrl}
            onClick={handleClick}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-100 group-hover:bg-[#009fe3] text-slate-700 group-hover:text-white flex items-center gap-1 shrink-0 transition-all shadow-xs text-xs font-bold cursor-pointer"
            aria-label={`Ver detalles de ${product.name}`}
          >
            <span className="hidden sm:inline">Ver</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
