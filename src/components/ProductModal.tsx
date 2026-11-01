import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../types';
import { addToCart, formatBs, emitEvent } from '../lib/store';
import { CanvaViewer } from './CanvaViewer';
import { X, Plus, Minus, Check, ShoppingBag, ShoppingCart, Zap, Clock, Ruler } from 'lucide-react';

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

  // Lista única de colores disponibles en la prenda
  const availableColors = Array.from(
    new Set(
      safeVariants
        .map((v) => v.colorName || v.optionName || 'Color Estándar')
        .filter(Boolean)
    )
  );

  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors[0] || 'Color Estándar'
  );

  // Variantes correspondientes al color seleccionado
  const variantsForColor = safeVariants.filter(
    (v) => (v.colorName || v.optionName || 'Color Estándar') === selectedColor
  );

  // Motivos / Estampas disponibles para este color
  const availableMotifs = Array.from(
    new Set(
      variantsForColor
        .map((v) => v.optionName)
        .filter((opt) => opt && opt !== selectedColor && opt !== 'Estándar')
    )
  );

  const [selectedMotif, setSelectedMotif] = useState<string>(
    availableMotifs[0] || ''
  );

  const matchingVariants = variantsForColor.filter((v) => {
    if (availableMotifs.length > 1 && selectedMotif) {
      return v.optionName === selectedMotif;
    }
    return true;
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    matchingVariants[0] || safeVariants[0]
  );

  const hasTiers = Array.isArray(product.escalas_precio) && product.escalas_precio.length > 0;

  // Si tiene escalas, inicializamos con la primera escala disponible
  const [quantity, setQuantity] = useState<number>(() => {
    if (hasTiers && product.escalas_precio![0]) {
      return product.escalas_precio![0].cantidad;
    }
    return 1;
  });
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const firstColor = availableColors[0] || 'Color Estándar';
    setSelectedColor(firstColor);
  }, [product]);

  useEffect(() => {
    const newMatches = safeVariants.filter(
      (v) => (v.colorName || v.optionName || 'Color Estándar') === selectedColor
    );
    if (newMatches.length > 0) {
      const motifMatches = newMatches.filter((v) => {
        if (availableMotifs.length > 1 && selectedMotif) {
          return v.optionName === selectedMotif;
        }
        return true;
      });
      setSelectedVariant(motifMatches[0] || newMatches[0]);
    } else {
      setSelectedVariant(safeVariants[0]);
    }
  }, [selectedColor, selectedMotif, product]);

  useEffect(() => {
    if (hasTiers && product.escalas_precio![0]) {
      setQuantity(product.escalas_precio![0].cantidad);
    } else {
      setQuantity(1);
    }
    setAddedAnimation(false);
  }, [product]);

  let unitPriceUSD = product.basePriceUSD || 0;
  let activeTier = 'Precio Detal';
  let matchedTierObject = null;

  if (hasTiers) {
    const sortedTiers = [...product.escalas_precio!].sort((a, b) => b.cantidad - a.cantidad);
    const matched = sortedTiers.find((t) => quantity >= t.cantidad);
    if (matched) {
      matchedTierObject = matched;
      unitPriceUSD = matched.precio_unitario_usd || (matched.precio_total_usd / matched.cantidad);
      activeTier = matched.nombre;
    } else {
      const lowest = sortedTiers[sortedTiers.length - 1];
      if (lowest) {
        matchedTierObject = lowest;
        unitPriceUSD = lowest.precio_unitario_usd || (lowest.precio_total_usd / lowest.cantidad);
        activeTier = lowest.nombre;
      }
    }
  } else {
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
  }

  const totalUSD = matchedTierObject && quantity === matchedTierObject.cantidad
    ? matchedTierObject.precio_total_usd
    : unitPriceUSD * quantity;
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

  const handleDirectWhatsApp = () => {
    const variantToAdd = selectedVariant || safeVariants[0];
    if (!variantToAdd) return;
    const selectedOption = variantToAdd.colorName || variantToAdd.optionName || 'Estándar';
    const tierInfo = activeTier ? `- Presentación: ${activeTier}\n` : '';
    const msg = `¡Hola Ezer Sport! Me interesa realizar este pedido:\n- Prenda: ${product.name}\n- Talla: ${variantToAdd.size}\n- Color/Diseño: ${selectedOption}\n${tierInfo}- Cantidad: ${quantity} pzas\n- Total: ${formatBs(totalBs)}\n\n¿Tienen disponibilidad para coordinar la entrega? ¡Muchas gracias!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/584241282108?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200 shadow-sm transition-colors cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Top section: imagen + información principal */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-5 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 aspect-square relative shadow-xs">
              <img
                src={product.images[0] || '/images/kids-sweaters.webp'}
                alt={product.name}
                className="w-full h-full object-cover"
                width="400"
                height="400"
              />

              {/* Badge Dinámico de Disponibilidad */}
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                {selectedVariant && selectedVariant.stock > 0 ? (
                  <span className="bg-emerald-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <span>🟢 En Stock</span>
                  </span>
                ) : (
                  <span className="bg-amber-500 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Bajo Pedido</span>
                  </span>
                )}
              </div>
            </div>

            <div className="sm:col-span-7 space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#009fe3]">
                  {product.variantType === 'print' ? 'Prenda con Estampado' : 'Prenda por Color'}
                </span>
                {product.categoryId === 'cat-navidad' && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    🎄 Especial Navidad
                  </span>
                )}
              </div>

              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                {product.name}
              </h2>

              {product.description && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Aviso de Stock / Tiempo de Despacho */}
              {(() => {
                const isVariantInStock = Boolean(selectedVariant && selectedVariant.stock > 0);
                const leadDays = product.productionDays || 2;
                const leadDaysText = leadDays === 1 ? '1 día hábil' : `${leadDays} días hábiles`;

                return (
                  <div
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      isVariantInStock
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50/70 border-amber-200 text-amber-800'
                    }`}
                  >
                    {isVariantInStock ? (
                      <span className="font-medium flex items-center gap-1.5">
                        <span className="font-bold text-emerald-600">✓</span>
                        <span>Prenda en stock: embalaje y despacho en 24 a 48h hábiles.</span>
                      </span>
                    ) : (
                      <span className="font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span>Confección bajo pedido: corte y costura en <strong>{leadDaysText}</strong>.</span>
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Si NO tiene escalas, muestra la caja simple de precio unitario */}
              {!hasTiers && (
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      Precio unitario:
                    </span>
                    <span className="font-display font-black text-2xl text-[#0c3b74]">
                      {formatBs(unitPriceUSD * currentRate)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#009fe3] bg-white px-2.5 py-1 rounded-lg border border-sky-100">
                    {activeTier}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN PRINCIPAL DE CARDS: DISTINTOS PRECIOS DE ACUERDO A LA CANTIDAD */}
          {hasTiers && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <span>Elige tu presentación:</span>
                </span>
                <span className="bg-sky-100 text-[#0c3b74] text-xs font-black px-2.5 py-0.5 rounded-full">
                  {product.escalas_precio!.length} opciones de precio
                </span>
              </div>

              {/* Grid 2 Columnas de Cards en Colores EZER (#009fe3 y #0c3b74) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.escalas_precio!.map((tier) => {
                  const isSelected = quantity === tier.cantidad;
                  const priceBs = tier.precio_total_usd * (currentRate || 76.50);
                  const unitPriceBs = priceBs / tier.cantidad;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setQuantity(tier.cantidad)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#009fe3] bg-sky-50/80 shadow-md ring-2 ring-[#009fe3]/25'
                          : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-display font-black text-xs sm:text-sm leading-snug ${
                            isSelected ? 'text-[#0c3b74]' : 'text-slate-800'
                          }`}
                        >
                          {tier.nombre}
                        </span>

                        {/* Radio Button Ezer (#009fe3) */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'border-[#009fe3]' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#009fe3]" />
                          )}
                        </div>
                      </div>

                      <div className="border-t border-dashed border-slate-200 my-2" />

                      <div className="flex items-baseline justify-between gap-1">
                        <div>
                          <span
                            className={`font-display font-black text-sm sm:text-base leading-tight block ${
                              isSelected ? 'text-[#0c3b74]' : 'text-slate-900'
                            }`}
                          >
                            {formatBs(priceBs)}
                          </span>
                          {tier.cantidad > 1 && (
                            <span className="text-[11px] font-semibold text-slate-500">
                              ({formatBs(unitPriceBs)} c/u)
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector 1: Color de la Prenda */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>1. Elige el Color de la Prenda:</span>
              <span className="text-[#009fe3] font-black">{selectedColor}</span>
            </label>

            {/* Círculos de Color Textil */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              {availableColors.map((col) => {
                const isSelected = selectedColor === col;
                const colVariant = safeVariants.find(
                  (v) => (v.colorName || v.optionName || 'Color Estándar') === col
                );
                const hex = colVariant?.colorHex || '#009fe3';
                const isLight =
                  hex.toLowerCase() === '#ffffff' ||
                  hex.toLowerCase() === '#fff' ||
                  hex.toLowerCase().startsWith('#f') ||
                  hex.toLowerCase().startsWith('#e');

                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
                    title={col}
                  >
                    <div
                      className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shadow-xs ${
                        isSelected
                          ? 'ring-3 ring-[#009fe3] ring-offset-2 scale-110 border-2 border-white'
                          : 'border-2 border-slate-300 hover:scale-105 hover:border-slate-400'
                      }`}
                      style={{ backgroundColor: hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 drop-shadow-xs ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-bold transition-colors ${
                        isSelected
                          ? 'text-[#009fe3]'
                          : 'text-slate-600 group-hover:text-slate-900'
                      }`}
                    >
                      {col}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-selector de Motivo / Estampa */}
            {availableMotifs.length > 1 && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Diseño / Motivo:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableMotifs.map((motif) => (
                    <button
                      key={motif}
                      type="button"
                      onClick={() => setSelectedMotif(motif)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                        selectedMotif === motif
                          ? 'bg-[#0c3b74] text-white border-[#0c3b74]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {motif}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {availableMotifs.length === 1 && (
              <div className="text-xs text-slate-500 pt-1 font-medium">
                Estampa / Técnica: <span className="font-semibold text-slate-700">{availableMotifs[0]}</span>
              </div>
            )}
          </div>

          {/* Selector 2: Talla */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
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
                    className={`min-w-[60px] py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? hasStock
                          ? 'bg-[#0c3b74] text-white border-[#0c3b74] shadow-sm font-bold'
                          : 'bg-amber-600 text-white border-amber-600 shadow-sm font-bold'
                        : hasStock
                        ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        : 'bg-amber-50/60 text-slate-700 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="font-bold">{v.size}</span>
                    <span
                      className={`text-[10px] leading-tight ${
                        isSelected
                          ? 'text-white/90'
                          : hasStock
                          ? 'text-emerald-600 font-semibold'
                          : 'text-amber-600 font-semibold'
                      }`}
                    >
                      {hasStock ? 'Disponible' : 'Bajo pedido'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTONES DE ACCIÓN: COLORES EZER SPORT (#009fe3 y #0c3b74) */}
          {hasTiers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className="w-full py-4 px-6 rounded-full font-display font-black text-sm sm:text-base bg-[#009fe3] hover:bg-[#0082ba] text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{addedAnimation ? '¡Agregado al Carrito!' : `Agregar ${quantity} al Carrito`}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                disabled={!selectedVariant}
                className="w-full py-4 px-6 rounded-full font-display font-black text-sm sm:text-base bg-white hover:bg-sky-50 text-[#0c3b74] border-2 border-[#009fe3] flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Pedir Directamente</span>
              </button>
            </div>
          ) : (
            /* Layout Estándar con contador -/+ */
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
              {/* Controles de Cantidad */}
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

              {/* Botón dinámico agregar */}
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
                        ? 'bg-[#009fe3] hover:bg-[#0082ba] text-white shadow-cyan-500/20'
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
          )}

          {/* VISOR INTERACTIVO DE CANVA (Catálogo de Fotos y Modelos vinculados) */}
          {product.canvaEmbedUrl && (
            <div className="pt-3 border-t border-slate-100">
              <CanvaViewer
                url={product.canvaEmbedUrl}
                title={`Catálogo de Fotos y Diseños: ${product.name}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
