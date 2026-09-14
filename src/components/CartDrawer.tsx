import React, { useState, useEffect } from 'react';
import type { CartItem } from '../types';
import {
  getCartItems,
  getCurrentRate,
  calculateCartSummary,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  formatBs,
} from '../lib/store';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Flame,
  Sparkles,
  Clock,
} from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentRate, setCurrentRate] = useState<number>(76.50);

  useEffect(() => {
    setCartItems(getCartItems());
    setCurrentRate(getCurrentRate());

    const handleOpenCart = () => setIsOpen(true);
    const handleCartUpdate = (e: any) => {
      setCartItems(e.detail?.items || getCartItems());
    };
    const handleRateUpdate = (e: any) => {
      setCurrentRate(e.detail?.currentRate || getCurrentRate());
    };

    window.addEventListener('ezer-open-cart', handleOpenCart);
    window.addEventListener('ezer-cart-updated', handleCartUpdate);
    window.addEventListener('ezer-rate-updated', handleRateUpdate);

    return () => {
      window.removeEventListener('ezer-open-cart', handleOpenCart);
      window.removeEventListener('ezer-cart-updated', handleCartUpdate);
      window.removeEventListener('ezer-rate-updated', handleRateUpdate);
    };
  }, []);

  const summary = calculateCartSummary(cartItems, currentRate);
  const totalPieces = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      {/* Click outside */}
      <div className="flex-1" onClick={() => setIsOpen(false)}></div>

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 z-10 animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0c3b74] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg sm:text-xl text-slate-900">
                Tu Carrito de Pedido
              </h2>
              <span className="text-xs sm:text-sm text-slate-500">
                {totalPieces} {totalPieces === 1 ? 'prenda' : 'prendas seleccionadas'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200"
            aria-label="Cerrar Carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Alerts */}
        {cartItems.length > 0 && (
          <div className="bg-blue-50/80 border-b border-blue-100 p-4 space-y-2">
            {summary.savingsUSD > 0 && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-800 font-semibold">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  ¡Ahorras {formatBs(summary.savingsBs)} con la escala por volumen!
                </span>
              </div>
            )}
            {summary.volumeTierMessage && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#0c3b74] font-medium">
                <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{summary.volumeTierMessage}</span>
              </div>
            )}
            {summary.hasMadeToOrderItems && (
              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Incluye prendas bajo pedido (confección en taller: {summary.maxLeadDays === 1 ? '1 día hábil' : `${summary.maxLeadDays || 2} días hábiles`}).
                </span>
              </div>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-slate-800">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs">
                  Añade ropa deportiva o suéteres infantiles. Puedes mezclar tallas y modelos para activar los precios al mayor.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[#009fe3] hover:bg-[#0087c2] text-white text-sm font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            summary.items.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-3.5 items-center"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-sm sm:text-base text-slate-900 truncate">
                    {item.productName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600 flex-wrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-800 border border-slate-200">
                      Talla {item.size}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md font-semibold text-slate-800 border border-slate-200">
                      {item.colorHex && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-xs shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      )}
                      <span>{item.colorName || item.optionName}</span>
                    </span>
                    {item.optionName && item.colorName && item.optionName.toLowerCase() !== item.colorName.toLowerCase() && (
                      <span className="text-slate-500 font-medium text-[11px] truncate">
                        • {item.optionName}
                      </span>
                    )}
                    {item.availability === 'bajo_pedido' || item.isBajoPedido ? (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200">
                        ⏱️ Bajo Pedido
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        🟢 En Stock
                      </span>
                    )}
                  </div>

                  {/* Price breakdown */}
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="font-display font-bold text-sm sm:text-base text-slate-900">
                      {formatBs(item.appliedUnitPriceUSD * item.quantity * currentRate)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({formatBs(item.appliedUnitPriceUSD * currentRate)} c/u)
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Eliminar prenda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 px-2">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs sm:text-sm text-slate-600">
                <span>Total prendas ({totalPieces} piezas):</span>
                <span className="font-semibold text-slate-800">{formatBs(summary.subtotalBs)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-display font-medium text-base text-slate-900">
                  Total a Pagar:
                </span>
                <span className="font-display font-bold text-2xl text-[#0c3b74]">
                  {formatBs(summary.subtotalBs)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                El delivery o punto de entrega se selecciona en el siguiente paso.
              </p>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenCheckout();
              }}
              className="w-full bg-[#009fe3] hover:bg-[#0087c2] text-white py-4 rounded-2xl font-display font-medium text-base flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            >
              <span>Continuar a Entrega y Pago</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
