import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../types';
import { addToCart, formatBs, emitEvent } from '../lib/store';
import { X, Plus, Minus, Check, ShoppingBag, Flame, Sparkles, Clock, Info, Ruler } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  currentRate: number;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, currentRate, onClose }) => {
  if (!product) return null;

  const safeVariants: ProductVariant[] = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : [{
        id: `var-std-${product.id}`,
        size: 'Única',
        optionName: 'Estándar Taller',
        colorHex: '#009fe3',
        stock: 99,
        imagePreview: (product.images && product.images[0]) || '/images/conjunto-ninos-mickey.webp',
      }];

  const availableOptions = Array.from(new Set(safeVariants.map((v) => v.optionName || 'Estándar')));
  const [selectedOption, setSelectedOption] = useState<string>(availableOptions[0] || 'Estándar');

  const matchingVariants = safeVariants.filter((v) => (v.optionName || 'Estándar') === selectedOption);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    matchingVariants[0] || safeVariants[0]
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const newMatches = safeVariants.filter((v) => (v.optionName || 'Estándar') === selectedOption);
    if (newMatches.length > 0) {
      setSelectedVariant(newMatches[0]);
    } else {
      setSelectedVariant(safeVariants[0]);
    }
  }, [selectedOption, product]);

  useEffect(() => {
    setQuantity(1);
    setAddedAnimation(false);
  }, [product]);

  let unitPriceUSD = product.basePriceUSD || 0;
  let activeTier = 'Precio Detal';
  if (quantity >= 12 && product.tier12PriceUSD) {
    unitPriceUSD = product.tier12PriceUSD;
    activeTier = 'Docena Mayorista (12+)';
  } else if (quantity >= 6 && product.tier6PriceUSD) {
    unitPriceUSD = product.tier6PriceUSD;
    activeTier = 'Mayorista de Fábrica (6+)';
  } else if (quantity >= 3 && product.tier3PriceUSD) {
    unitPriceUSD = product.tier3PriceUSD;
    activeTier = 'Promo x3 piezas';
  }

  const totalUSD = unitPriceUSD * quantity;
  const totalBs = totalUSD * (currentRate || 76.50);

  const handleAddToCart = () => {
    const variantToAdd = selectedVariant || safeVariants[0];
    if (!variantToAdd) return;
    addToCart(product, variantToAdd, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Top section: image + main info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            <div className="sm:col-span-5 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 aspect-square relative">
              <img
                src={product.images[0] || '/images/kids-sweaters.webp'}
                alt={product.name}
                className="w-full h-full object-cover"
                width="400"
                height="400"
              />

              {/* Badge Dinámico según variante seleccionada */}
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                {selectedVariant && selectedVariant.stock > 0 ? (
                  <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <span>🟢 En Stock</span>
                    <span className="opacity-90">({selectedVariant.stock} pzs)</span>
                  </span>
                ) : (
                  <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Bajo Pedido (Confección)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#009fe3]">
                {product.variantType === 'print' ? 'Prenda con Estampado' : 'Prenda por Color'}
              </span>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
                {product.name}
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Availability Notice Dinámico */}
              {(() => {
                const isVariantInStock = Boolean(selectedVariant && selectedVariant.stock > 0);
                const leadDays = product.productionDays || 2;
                const leadDaysText = leadDays === 1 ? '1 día hábil' : `${leadDays} días hábiles`;

                return (
                  <div
                    className={`p-3 rounded-xl border text-xs transition-colors ${
                      isVariantInStock
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    {isVariantInStock ? (
                      <span className="font-medium flex items-center gap-1.5">
                        <span className="text-base">✓</span>
                        <span>Prenda en stock: embalaje y despacho inmediato en 24 a 48 horas hábiles.</span>
                      </span>
                    ) : (
                      <span className="font-medium flex items-center gap-1.5">
                        <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>
                          Confección bajo pedido: tiempo estimado de corte y costura de <strong>{leadDaysText}</strong>.
                        </span>
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Calculated Price */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">
                    Precio unitario:
                  </span>
                  <span className="font-display font-bold text-2xl text-[#0c3b74]">
                    {formatBs(unitPriceUSD * currentRate)}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#009fe3] bg-white px-2.5 py-1 rounded-lg border border-blue-100">
                  {activeTier}
                </span>
              </div>
            </div>
          </div>

          {/* Selector 1: Estampado o Color */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-sm font-semibold text-slate-800 flex items-center justify-between">
              <span>
                1. Elige el {product.variantType === 'print' ? 'Estampado / Motivo' : 'Color'}:
              </span>
              <span className="text-[#009fe3] font-bold">{selectedOption}</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {availableOptions.map((opt) => {
                const isSelected = selectedOption === opt;
                const optVariant = safeVariants.find((v) => (v.optionName || 'Estándar') === opt);
                const hex = optVariant?.colorHex;
                const colorLabel = optVariant?.colorName && optVariant.colorName !== opt ? ` (${optVariant.colorName})` : '';

                return (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#009fe3] text-white border-[#009fe3] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {hex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                    )}
                    <span>{opt}{colorLabel}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector 2: Talla (100% Seleccionable, sin bloqueos) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800">
                2. Selecciona la Talla:
              </label>
              <button
                type="button"
                onClick={() => emitEvent('ezer-open-size-guide')}
                className="text-xs text-[#009fe3] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Ver tabla de medidas en cm</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {matchingVariants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const hasStock = v.stock > 0;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`min-w-[62px] py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? hasStock
                          ? 'bg-[#0c3b74] text-white border-[#0c3b74] shadow-sm font-semibold'
                          : 'bg-amber-600 text-white border-amber-600 shadow-sm font-semibold'
                        : hasStock
                        ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        : 'bg-amber-50/60 text-slate-700 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="font-bold">{v.size}</span>
                    <span
                      className={`text-[10px] leading-tight ${
                        isSelected
                          ? 'text-white/85'
                          : hasStock
                          ? 'text-emerald-600 font-semibold'
                          : 'text-amber-600 font-semibold'
                      }`}
                    >
                      {hasStock ? `${v.stock} disp.` : 'Bajo pedido'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cantidad y Botón de Agregar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            {/* Quantity Controls */}
            <div className="flex items-center bg-slate-100 rounded-2xl border border-slate-200 p-1 w-full sm:w-auto justify-between">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl hover:bg-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Restar cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-display font-bold text-base sm:text-lg text-slate-900 px-4">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl hover:bg-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Sumar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Total and Submit Button Dinámico */}
            {(() => {
              const isVariantInStock = Boolean(selectedVariant && selectedVariant.stock > 0);

              return (
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  className={`flex-1 w-full py-4 px-6 rounded-2xl font-display font-semibold text-sm sm:text-base flex items-center justify-between transition-all duration-200 active:scale-95 shadow-md cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : isVariantInStock
                      ? 'bg-[#009fe3] hover:bg-[#0087c2] text-white shadow-cyan-500/20'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/25'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isVariantInStock ? (
                      <ShoppingBag className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                    <span>
                      {addedAnimation
                        ? '¡Agregado al Carrito!'
                        : isVariantInStock
                        ? `Agregar ${quantity} al Carrito`
                        : `Encargar Bajo Pedido (${quantity})`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold leading-none">
                      {formatBs(totalBs)}
                    </span>
                  </div>
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
