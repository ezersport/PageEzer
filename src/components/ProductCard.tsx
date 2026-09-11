import React from 'react';
import type { Product } from '../types';
import { formatBs, formatUSD } from '../lib/store';
import { ArrowRight, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currentRate: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, currentRate }) => {
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

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 hover:border-[#009fe3] transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1">
      {/* Product Image Link - Direct navigation to product page */}
      <a
        href={productUrl}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 block text-left"
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
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="bg-[#0c3b74] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}

          {product.availability === 'inmediato' ? (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>En Stock</span>
            </span>
          ) : (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Bajo Pedido</span>
            </span>
          )}
        </div>
      </a>

      {/* Product Information */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Fabric Spec */}
          {product.fabric && (
            <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
              Tela: {product.fabric}
            </p>
          )}

          <h3 className="font-display font-semibold text-lg sm:text-xl text-slate-900 leading-snug group-hover:text-[#009fe3] transition-colors">
            <a
              href={productUrl}
              className="text-left font-semibold hover:text-[#009fe3] transition-colors block"
            >
              {product.name || 'Prenda de Confección'}
            </a>
          </h3>

          {/* Color / Option Circles or Badges */}
          <div className="pt-1 flex items-center gap-2">
            {uniqueVariants.length > 0 && uniqueVariants.some((v) => v.colorHex && v.colorHex !== '#009fe3') ? (
              <>
                <span className="text-xs text-slate-400">Opciones:</span>
                <div className="flex items-center gap-1.5">
                  {uniqueVariants.slice(0, 5).map((v) => (
                    <span
                      key={v.id}
                      title={v.optionName}
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: v.colorHex || '#009fe3' }}
                    ></span>
                  ))}
                  {uniqueVariants.length > 5 && (
                    <span className="text-xs text-slate-400 font-medium">
                      +{uniqueVariants.length - 5}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-xs text-[#009fe3] font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                ⭐ Confección de Taller
              </span>
            )}
          </div>
        </div>

        {/* Bottom Section: Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <span className="font-display font-bold text-2xl text-slate-900 block leading-tight">
              {formatBs(priceBs)}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              Ref. {formatUSD(product.basePriceUSD || 0)} • Fábrica desde 6 pzs
            </span>
          </div>

          <a
            href={productUrl}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 group-hover:bg-[#009fe3] text-slate-700 group-hover:text-white flex items-center gap-1.5 shrink-0 transition-all shadow-sm text-xs font-bold"
            aria-label={`Ver detalles de ${product.name}`}
          >
            <span>Ver Detalles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
