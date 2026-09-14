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
import {
  ArrowLeft,
  Check,
  Plus,
  Minus,
  ShoppingBag,
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
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

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
      setSelectedVariant(motifMatches[0] || newMatches[0]);
    } else {
      setSelectedVariant(safeVariants[0]);
    }
  }, [selectedColor, selectedMotif, product]);

  // Cálculo de precio según cantidad seleccionada
  let unitPriceUSD = product.basePriceUSD || 0;
  let activeTier = 'Precio Detal (1 unidad)';
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
      setAddedAnimation(false);
    }, 1500);
  };

  const handleDirectWhatsApp = () => {
    if (!selectedVariant) return;
    const msg = `¡Hola Ezer Sport! Me interesa consultar la siguiente prenda:
- Modelo: ${product.name}
- Talla: ${selectedVariant.size}
- ${product.variantType === 'print' ? 'Estampado' : 'Color'}: ${selectedOption}
- Cantidad: ${quantity}
- Total estimado: ${formatBs(totalBs)}

¿Tienen disponibilidad para coordinar la entrega? ¡Muchas gracias!`;

    window.open(`https://wa.me/584241282108?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
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
          className="text-xs sm:text-sm font-semibold text-[#0c3b74] bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 text-[#009fe3]" />
          <span>Ver mi carrito</span>
        </button>
      </div>

      {/* Main product presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square relative shadow-lg">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
              {product.badge && (
                <span className="bg-[#0c3b74] text-white text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}

              {selectedVariant && selectedVariant.stock > 0 ? (
                <span className="bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                  🟢 Stock en Almacén ({selectedVariant.stock} pzs)
                </span>
              ) : (
                <span className="bg-amber-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Confección Taller ({product.productionDays || 2} días hábiles)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Purchase form */}
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

            {/* Availability Notice Dinámico */}
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
                      <span className="text-base font-bold">✓</span>
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

          {/* Selector 1: Color de la Prenda */}
          <div className="space-y-3">
            <label className="text-sm sm:text-base font-semibold text-slate-900 flex items-center justify-between">
              <span>1. Elige el Color de la Prenda:</span>
              <span className="text-[#009fe3] font-bold">{selectedColor}</span>
            </label>

            <div className="flex flex-wrap gap-2.5">
              {availableColors.map((col) => {
                const isSelected = selectedColor === col;
                const colVariant = safeVariants.find(
                  (v) => (v.colorName || v.optionName || 'Color Estándar') === col
                );
                const hex = colVariant?.colorHex || '#009fe3';

                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#009fe3] text-white border-[#009fe3] shadow-md shadow-cyan-500/20'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-sm shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span>{col}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
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
                      onClick={() => setSelectedMotif(motif)}
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

          {/* Selector 2: Talla (100% Seleccionable) */}
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
                      {hasStock ? `${v.stock} disp.` : 'Bajo pedido'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wholesale Pricing Table */}
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

          {/* Quantity Controls & Action Buttons */}
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

            {/* Direct WhatsApp button option */}
            <button
              onClick={handleDirectWhatsApp}
              disabled={!selectedVariant}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-display font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>Consultar o pedir directamente por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Modals for Checkout and Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
};
