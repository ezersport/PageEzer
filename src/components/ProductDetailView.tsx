import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../types';
import {
  addToCart,
  getCurrentRate,
  formatBs,
  emitEvent,
} from '../lib/store';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { CanvaViewer } from './CanvaViewer';
import {
  ArrowLeft,
  X,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  ShoppingCart,
  Zap,
  Clock,
  Sparkles,
  Flame,
  Info,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const [currentRate, setCurrentRate] = useState<number>(76.50);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Opciones únicas (colores o estampados) de forma segura
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

  const [selectedImage, setSelectedImage] = useState<string>(
    (product.images && product.images[0]) || '/images/conjunto-ninos-mickey.webp'
  );

  const hasTiers = Array.isArray(product.escalas_precio) && product.escalas_precio.length > 0;

  const [quantity, setQuantity] = useState<number>(() => {
    if (hasTiers && product.escalas_precio![0]) {
      return product.escalas_precio![0].cantidad;
    }
    return 1;
  });
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = React.useRef<any>(null);

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
    const firstColor = availableColors[0] || 'Color Estándar';
    setSelectedColor(firstColor);
  }, [product]);

  useEffect(() => {
    setCurrentRate(getCurrentRate());
    const handleRateUpdate = (e: any) => {
      setCurrentRate(e.detail?.currentRate || getCurrentRate());
    };
    window.addEventListener('ezer-rate-updated', handleRateUpdate);
    return () => window.removeEventListener('ezer-rate-updated', handleRateUpdate);
  }, []);

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
      const resolved = motifMatches[0] || newMatches[0];
      setSelectedVariant(resolved);
      if (resolved?.imagePreview && resolved.imagePreview !== '/images/conjunto-ninos-mickey.webp') {
        setSelectedImage(resolved.imagePreview);
      }
    } else {
      setSelectedVariant(safeVariants[0]);
      if (safeVariants[0]?.imagePreview && safeVariants[0].imagePreview !== '/images/conjunto-ninos-mickey.webp') {
        setSelectedImage(safeVariants[0].imagePreview);
      }
    }
  }, [selectedColor, selectedMotif, product]);

  // Si cambia la variante seleccionada y tiene imagen asignada, actualizar foto principal
  useEffect(() => {
    if (selectedVariant?.imagePreview && selectedVariant.imagePreview !== '/images/conjunto-ninos-mickey.webp') {
      setSelectedImage(selectedVariant.imagePreview);
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (hasTiers && product.escalas_precio![0]) {
      setQuantity(product.escalas_precio![0].cantidad);
    } else {
      setQuantity(1);
    }
  }, [product]);

  // Cálculo de precio según cantidad seleccionada
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
    addToCart(product, variantToAdd, quantity, selectedImage);
    setAddedAnimation(true);
    const designLabel = variantToAdd.optionName || variantToAdd.colorName || 'Prenda';
    setToastMessage(`${quantity}x ${product.name} (${designLabel})`);
    setShowToast(true);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setAddedAnimation(false);
      setShowToast(false);
    }, 3500);
  };

  const handleThumbnailClick = (img: string) => {
    setSelectedImage(img);
    // Buscar si alguna variante está vinculada a esta foto
    const matchingVar = safeVariants.find((v) => v.imagePreview === img);
    if (matchingVar) {
      if (matchingVar.colorName && availableColors.includes(matchingVar.colorName)) {
        setSelectedColor(matchingVar.colorName);
      }
      if (matchingVar.optionName && matchingVar.optionName !== matchingVar.colorName) {
        setSelectedMotif(matchingVar.optionName);
      }
      setSelectedVariant(matchingVar);
    }
  };

  const handleDirectWhatsApp = () => {
    if (!selectedVariant) return;
    const selectedOption = selectedVariant.colorName || selectedVariant.optionName || 'Estándar';
    const tierInfo = activeTier ? `- Presentación: ${activeTier}\n` : '';
    const msg = `¡Hola Ezer Sport! Me interesa realizar este pedido:\n- Modelo: ${product.name}\n- Talla: ${selectedVariant.size}\n- Color/Estampa: ${selectedOption}\n${tierInfo}- Cantidad: ${quantity} pzas\n- Total: ${formatBs(totalBs)}\n\n¿Tienen disponibilidad para coordinar la entrega? ¡Muchas gracias!`;

    window.open(`https://wa.me/584241282108?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <a
          href="/#catalogo"
          className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-slate-600 hover:text-[#009fe3] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Catálogo</span>
        </a>

        <button
          onClick={() => emitEvent('ezer-open-cart')}
          className="text-xs sm:text-sm font-semibold text-[#0c3b74] bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#009fe3]" />
          <span>Ver mi carrito</span>
        </button>
      </div>

      {/* Presentación principal del producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Galería & Sección Canva */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square relative shadow-lg">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges (Sin revelar números de piezas) */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
              {product.categoryId === 'cat-navidad' && (
                <span className="bg-rose-600 text-white text-xs sm:text-sm font-black px-3.5 py-1 rounded-full shadow-md">
                  🎄 Especial Navidad
                </span>
              )}
              {product.badge && product.categoryId !== 'cat-navidad' && (
                <span className="bg-[#0c3b74] text-white text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}

              {selectedVariant && selectedVariant.stock > 0 ? (
                <span className="bg-emerald-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  🟢 Disponible en Stock
                </span>
              ) : (
                <span className="bg-amber-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Confección Taller ({product.productionDays || 2} días hábiles)</span>
                </span>
              )}
            </div>
          </div>

          {/* Miniaturas de Fotos Secundarias / Galería de la Prenda */}
          {product.images && product.images.length > 1 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Fotos de la prenda ({product.images.length} fotos disponibles):
              </span>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleThumbnailClick(img)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#009fe3] ring-3 ring-[#009fe3]/25 shadow-md scale-105'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100 bg-slate-50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Foto ${idx + 1} de ${product.name}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Visor Interactivo de Canva */}
          {product.canvaEmbedUrl && (
            <div className="pt-2">
              <CanvaViewer
                url={product.canvaEmbedUrl}
                title={`Catálogo de Fotos y Modelos: ${product.name}`}
              />
            </div>
          )}
        </div>

        {/* Formulario de Compra */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            {product.fabric && (
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#009fe3] block">
                Tela: {product.fabric}
              </span>
            )}
            <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1">
              {product.description}
            </p>

            {/* Aviso de Stock / Tiempo de Despacho (Sin cantidad de piezas) */}
            {(() => {
              const isVariantInStock = Boolean(selectedVariant && selectedVariant.stock > 0);
              const leadDays = product.productionDays || 2;
              const leadDaysText = leadDays === 1 ? '1 día hábil' : `${leadDays} días hábiles`;

              return (
                <div
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm transition-colors mt-2 ${
                    isVariantInStock
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  {isVariantInStock ? (
                    <span className="font-medium flex items-center gap-2">
                      <span className="text-base font-bold text-emerald-600">✓</span>
                      <span>Prenda disponible en stock: entrega inmediata / despacho en 24 a 48 horas hábiles.</span>
                    </span>
                  ) : (
                    <span className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>
                        Confección bajo pedido: tiempo estimado de corte y costura de <strong>{leadDaysText}</strong>.
                      </span>
                    </span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* SECCIÓN DE PRECIOS: EN CARDS PARA PRODUCTOS CON ESCALAS O CAJA TRADICIONAL (SÓLO EN BS) */}
          {hasTiers ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-slate-900 text-lg sm:text-xl">
                  Elige tu presentación:
                </h3>
                <span className="bg-sky-100 text-[#0c3b74] text-xs font-black px-3 py-1 rounded-full">
                  {product.escalas_precio!.length} opciones de precio
                </span>
              </div>

              {/* Grid 2 Columnas de Tarjetas de Presentación en Colores Ezer (#009fe3 y #0c3b74) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {product.escalas_precio!.map((tier) => {
                  const isSelected = quantity === tier.cantidad;
                  const priceBs = tier.precio_total_usd * (currentRate || 76.50);
                  const unitPriceBs = priceBs / tier.cantidad;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setQuantity(tier.cantidad)}
                      className={`p-4 sm:p-5 rounded-3xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#009fe3] bg-sky-50/80 shadow-md ring-2 ring-[#009fe3]/25'
                          : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-display font-black text-base sm:text-lg leading-snug ${
                            isSelected ? 'text-[#0c3b74]' : 'text-slate-900'
                          }`}
                        >
                          {tier.nombre}
                        </span>
                        {/* Radio Button Ezer */}
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

                      <div className="border-t border-dashed border-slate-200/80 my-3" />

                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <span
                            className={`font-display font-black text-lg sm:text-xl block leading-tight ${
                              isSelected ? 'text-[#0c3b74]' : 'text-slate-900'
                            }`}
                          >
                            {formatBs(priceBs)}
                          </span>
                          {tier.cantidad > 1 && (
                            <span className="text-xs font-semibold text-slate-500">
                              ({formatBs(unitPriceBs)} c/u)
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botones de Acción Estilo Ezer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  className="w-full py-4 px-6 rounded-full font-display font-black text-base sm:text-lg bg-[#009fe3] hover:bg-[#0082ba] text-white flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{addedAnimation ? '¡Agregado al Carrito!' : `Agregar ${quantity} al Carrito`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  disabled={!selectedVariant}
                  className="w-full py-4 px-6 rounded-full font-display font-black text-base sm:text-lg bg-white hover:bg-sky-50 text-[#0c3b74] border-2 border-[#009fe3] flex items-center justify-center gap-2.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Pedir Directamente</span>
                </button>
              </div>
            </div>
          ) : (
            /* Layout Tradicional */
            <>
              {/* Price Box */}
              <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-100 space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Total estimado:</span>
                    <span className="font-display font-black text-3xl sm:text-4xl text-[#0c3b74]">
                      {formatBs(totalBs)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#0c3b74] bg-white px-3 py-1 rounded-full border border-blue-100">
                    {activeTier}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Selector 1: Color de la Prenda */}
          <div className="space-y-3 pt-2">
            <label className="text-sm sm:text-base font-semibold text-slate-900 flex items-center justify-between">
              <span>1. Elige el Color de la Prenda:</span>
              <span className="text-[#009fe3] font-bold">{selectedColor}</span>
            </label>

            {/* Círculos de Color Textil */}
            <div className="flex items-center gap-4 flex-wrap pt-1">
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
                    onClick={() => {
                      setSelectedColor(col);
                      const matchingForCol = safeVariants.filter(
                        (v) => (v.colorName || v.optionName || 'Color Estándar') === col
                      );
                      const motifsForCol = Array.from(
                        new Set(
                          matchingForCol
                            .map((v) => v.optionName)
                            .filter((opt) => opt && opt !== col && opt !== 'Estándar')
                        )
                      );
                      const nextMotif = motifsForCol[0] || '';
                      setSelectedMotif(nextMotif);
                      const foundVar = matchingForCol.find((v) => !nextMotif || v.optionName === nextMotif) || matchingForCol[0];
                      if (foundVar) {
                        setSelectedVariant(foundVar);
                        if (foundVar.imagePreview && foundVar.imagePreview !== '/images/conjunto-ninos-mickey.webp') {
                          setSelectedImage(foundVar.imagePreview);
                        }
                      }
                    }}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
                    title={col}
                  >
                    <div
                      className={`w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm ${
                        isSelected
                          ? 'ring-3 ring-[#009fe3] ring-offset-2 scale-110 border-2 border-white'
                          : 'border-2 border-slate-300 hover:scale-105 hover:border-slate-400'
                      }`}
                      style={{ backgroundColor: hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-5 h-5 drop-shadow-xs ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold transition-colors ${
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

            {/* Sub-selector de Motivo / Estampa si hay varios para este color */}
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
                      onClick={() => {
                        setSelectedMotif(motif);
                        const foundVar = variantsForColor.find((v) => v.optionName === motif) || variantsForColor[0];
                        if (foundVar) {
                          setSelectedVariant(foundVar);
                          if (foundVar.imagePreview && foundVar.imagePreview !== '/images/conjunto-ninos-mickey.webp') {
                            setSelectedImage(foundVar.imagePreview);
                          }
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
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

          {/* Selector 2: Talla (100% Seleccionable, sin revelar stock) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base font-semibold text-slate-900">
                2. Selecciona la Talla:
              </label>
              <button
                type="button"
                onClick={() => emitEvent('ezer-open-size-guide')}
                className="text-xs sm:text-sm text-[#009fe3] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Ver tabla de medidas en cm</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {matchingVariants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const hasStock = v.stock > 0;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`min-w-[64px] py-2.5 px-3.5 rounded-2xl text-sm font-medium transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? hasStock
                          ? 'bg-[#0c3b74] text-white border-[#0c3b74] shadow-md font-semibold'
                          : 'bg-amber-600 text-white border-amber-600 shadow-md font-semibold'
                        : hasStock
                        ? 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        : 'bg-amber-50/60 text-slate-700 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="font-bold text-sm sm:text-base">{v.size}</span>
                    <span
                      className={`text-[10px] leading-tight ${
                        isSelected
                          ? 'text-white/85'
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

          {/* Para productos sin escalas personalizadas: tabla tradicional y controles */}
          {!hasTiers && (
            <>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Escala de Precios al Mayor para este modelo:</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-slate-400 text-xs">1 Unidad</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{formatBs((product.basePriceUSD || 0) * currentRate)}</span>
                    <span className="text-[11px] text-slate-500">Detal</span>
                  </div>

                  {product.tier3PriceUSD && (
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                      <span className="block text-[#009fe3] font-semibold text-xs">x3 piezas</span>
                      <span className="font-bold text-[#0c3b74] block mt-0.5">{formatBs(product.tier3PriceUSD * currentRate)}</span>
                      <span className="text-[11px] text-[#009fe3]">Ahorras 15%</span>
                    </div>
                  )}

                  {product.tier6PriceUSD && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <span className="block text-amber-700 font-bold text-xs">1/2 Doc (6)</span>
                      <span className="font-bold text-amber-800 block mt-0.5">{formatBs(product.tier6PriceUSD * currentRate)}</span>
                      <span className="text-[11px] text-amber-600 font-medium">Mayor</span>
                    </div>
                  )}

                  {product.tier12PriceUSD && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-slate-600 font-semibold text-xs">Docena</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{formatBs(product.tier12PriceUSD * currentRate)}</span>
                      <span className="text-[11px] text-emerald-700 font-medium">Super Mayor</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Action Buttons Tradicionales */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-2xl border border-slate-200 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl hover:bg-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Restar cantidad"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-display font-bold text-lg text-slate-900 px-5">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl hover:bg-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Sumar cantidad"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Add to cart dinámico */}
                  {(() => {
                    const isVariantInStock = Boolean(selectedVariant && selectedVariant.stock > 0);

                    return (
                      <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant}
                        className={`flex-1 py-4 px-6 rounded-2xl font-display font-semibold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 shadow-md cursor-pointer ${
                          addedAnimation
                            ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                            : isVariantInStock
                            ? 'bg-[#009fe3] hover:bg-[#0087c2] text-white shadow-cyan-500/20'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/25'
                        }`}
                      >
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
                      </button>
                    );
                  })()}
                </div>

                {/* Botón WhatsApp directo */}
                <button
                  onClick={handleDirectWhatsApp}
                  disabled={!selectedVariant}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-display font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Consultar o pedir directamente por WhatsApp</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Global Modals for Checkout and Cart Drawer */}
      {/* Floating Toast Notification discreto sin abrir el drawer abruptamente */}
      {showToast && (
        <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-50 bg-[#0c3b74] text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-3 border border-sky-400/30 animate-bounce-subtle">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check className="w-5 h-5" />
            </div>
            <div className="truncate text-xs sm:text-sm">
              <p className="font-bold text-white">¡Prenda agregada al carrito!</p>
              <p className="text-sky-200 text-[11px] truncate">{toastMessage}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setShowToast(false);
                emitEvent('ezer-open-cart');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#009fe3] hover:bg-[#0082ba] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
            >
              Ver Carrito
            </button>
            <button
              onClick={() => setShowToast(false)}
              className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <CartDrawer onOpenCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
};
