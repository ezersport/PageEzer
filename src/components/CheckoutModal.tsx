import React, { useState, useEffect } from 'react';
import type { CartItem, DeliveryZone, Order } from '../types';
import {
  getCartItems,
  getCurrentRate,
  getDeliveryZones,
  fetchDeliveryZonesFromSupabase,
  calculateCartSummary,
  saveOrder,
  createOrderInSupabase,
  clearCart,
  formatBs,
} from '../lib/store';
import {
  X,
  Send,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentRate, setCurrentRate] = useState<number>(76.50);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddressDetail, setDeliveryAddressDetail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pago_movil' | 'efectivo' | 'binance' | 'zinli'>('pago_movil');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const items = getCartItems();
      const rate = getCurrentRate();
      const loadedZones = getDeliveryZones().filter((z) => z.isActive);

      setCartItems(items);
      setCurrentRate(rate);
      setZones(loadedZones);

      if (loadedZones.length > 0 && !selectedZoneId) {
        setSelectedZoneId(loadedZones[0].id);
      }

      // Sincronizar zonas frescas desde Supabase
      fetchDeliveryZonesFromSupabase().then((freshZones) => {
        if (freshZones && freshZones.length > 0) {
          setZones(freshZones);
          if (!selectedZoneId) setSelectedZoneId(freshZones[0].id);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0] || null;
  const summary = calculateCartSummary(cartItems, currentRate, selectedZone);

  // Determinar si la zona seleccionada requiere ingresar dirección (solo si es domicilio o nacional)
  const isPickupPoint = selectedZone?.zoneType === 'encuentro';
  const isNational = selectedZone?.zoneType === 'nacional';

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Por favor ingresa tu Nombre y Apellido');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage('Por favor ingresa un número de teléfono o WhatsApp válido');
      return;
    }
    if (!selectedZone) {
      setErrorMessage('Por favor selecciona una opción de entrega');
      return;
    }
    if (!isPickupPoint && !deliveryAddressDetail.trim()) {
      setErrorMessage('Por favor indica tu dirección de entrega o agencia de destino');
      return;
    }

    setIsSubmitting(true);

    const orderNumber = `#EZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderCode: orderNumber,
      customerName,
      customerPhone,
      deliveryZoneId: selectedZone.id,
      deliveryZoneName: selectedZone.name,
      scheduleDetails: selectedZone.scheduleDetails,
      deliveryCostUSD: summary.deliveryCostUSD,
      deliveryIsFree: summary.deliveryIsFree,
      deliveryAddressDetail: isPickupPoint ? selectedZone.name : deliveryAddressDetail,
      paymentMethod,
      rateSnapshot: currentRate,
      subtotalUSD: summary.subtotalUSD,
      totalUSD: summary.totalUSD,
      totalBs: summary.totalBs,
      hasMadeToOrderItems: summary.hasMadeToOrderItems,
      status: 'por_confirmar',
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        optionName: item.optionName,
        colorName: item.colorName,
        colorHex: item.colorHex,
        availability: item.availability,
        quantity: item.quantity,
        unitPriceUSD: item.appliedUnitPriceUSD,
        subtotalUSD: item.appliedUnitPriceUSD * item.quantity,
      })),
    };

    saveOrder(newOrder);

    // Guardar también en la base de datos Supabase para ezer-admin
    createOrderInSupabase({
      orderNumber,
      customer: {
        idNumber: 'V-00000000',
        firstName: customerName.split(' ')[0] || customerName,
        lastName: customerName.split(' ').slice(1).join(' ') || 'Cliente',
        phone: customerPhone,
      },
      deliveryZone: selectedZone,
      meetingPoint: isPickupPoint ? selectedZone.name : deliveryAddressDetail,
      paymentMethod,
      exchangeRate: currentRate,
      totalUnits: summary.totalUnits,
      subtotalUSD: summary.subtotalUSD,
      deliveryCostUSD: summary.deliveryCostUSD,
      totalUSD: summary.totalUSD,
      totalBs: summary.totalBs,
      items: cartItems,
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {}

    // Formatear mensaje oficial para WhatsApp Ezer Sport (Limpio, conciso, seguro y con detalle de entrega)
    const itemsListText = cartItems
      .map((item) => {
        const isBajoPedido = item.availability === 'bajo_pedido' || item.isBajoPedido;
        const statusTag = isBajoPedido
          ? `[BAJO PEDIDO - ${item.productionDays || 2} días hábiles]`
          : `[EN STOCK - INMEDIATO]`;
        const colorDisplay = item.colorName || item.optionName || 'Estándar';
        const estampaDisplay = item.optionName && item.colorName && item.optionName.toLowerCase() !== item.colorName.toLowerCase()
          ? ` • Estampa: ${item.optionName}`
          : '';

        return `* ${item.quantity}x ${item.productName} (Talla: ${item.size} | Color: ${colorDisplay}${estampaDisplay}) ${statusTag} - ${formatBs(
          item.appliedUnitPriceUSD * item.quantity * currentRate
        )}`;
      })
      .join('\n');

    const paymentLabel =
      paymentMethod === 'pago_movil'
        ? 'Pago Movil / BDV / Mercantil'
        : paymentMethod === 'transferencia'
        ? 'Transferencia Bancaria'
        : 'Efectivo en Entrega';

    const deliveryCostText = summary.deliveryIsFree
      ? 'GRATIS'
      : formatBs(summary.deliveryCostBs);

    const cleanZoneName = selectedZone.name
      .replace(/\s*\(desde\s*[^\)]+\)/gi, '')
      .replace(/\s*\([^)]*\$[^)]*\)/gi, '')
      .trim();

    const leadTimeFormatted = summary.maxLeadDays === 1 ? '1 día hábil' : `${summary.maxLeadDays || 2} días hábiles`;

    const whatsappMessage = `¡Hola Ezer Sport! Deseo formalizar el siguiente pedido:

*Pedido ${orderNumber}*
--------------------------------
${itemsListText}
${summary.hasMadeToOrderItems ? `\n⏱️ *Nota:* Incluye prendas bajo confección en taller (${leadTimeFormatted}).\n` : ''}
- Subtotal: ${formatBs(summary.subtotalBs)}
- Entrega: ${cleanZoneName}
- Costo Envio: ${deliveryCostText}
*TOTAL A PAGAR: ${formatBs(summary.totalBs)}*

- Cliente: ${customerName}
- Telefono: ${customerPhone}
- Metodo de Pago: ${paymentLabel}
${!isPickupPoint && deliveryAddressDetail ? `- Direccion: ${deliveryAddressDetail}\n` : ''}
¿Me confirman los datos bancarios para realizar el pago? ¡Muchas gracias!`;

    setTimeout(() => {
      clearCart();
      const whatsappUrl = `https://wa.me/584241282108?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0c3b74] flex items-center justify-center font-bold text-lg">
              EZ
            </div>
            <div>
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-slate-900">
                Finalizar Pedido
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Se enviará directamente al WhatsApp oficial de Ezer Sport (0424-128-2108)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 sm:p-7 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs sm:text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer info */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#009fe3] flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>1. Tus Datos de Contacto</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-[#009fe3]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 0412-1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-[#009fe3]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Option */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#009fe3] flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>2. ¿Dónde vas a recibir tu pedido?</span>
            </h3>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                Selecciona la opción de entrega:
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-[#009fe3]"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {zone.costUSD === 0 ? 'Sin recargo' : formatBs(zone.costUSD * currentRate)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Zone Information Card */}
            {selectedZone && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#009fe3]" />
                    Horario de Entrega:
                  </span>
                  <span className="text-[#0c3b74] font-medium">
                    {selectedZone.scheduleDetails}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    Costo de Entrega:
                  </span>
                  <div>
                    {summary.deliveryIsFree ? (
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        ¡GRATIS! 🎉
                      </span>
                    ) : (
                      <span className="text-slate-900 font-bold">
                        {formatBs(summary.deliveryCostBs)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Instructions / Fixed Point Note */}
                <p className="text-xs text-slate-600 pt-1 border-t border-blue-100">
                  {selectedZone.instructions}
                </p>

                {summary.freeDeliveryMessage && (
                  <p
                    className={`text-xs pt-1 font-semibold ${
                      summary.deliveryIsFree ? 'text-emerald-700' : 'text-[#009fe3]'
                    }`}
                  >
                    {summary.freeDeliveryMessage}
                  </p>
                )}
              </div>
            )}

            {/* Address input ONLY if NOT a fixed pickup point */}
            {!isPickupPoint && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  {isNational
                    ? 'Indica Cédula y Agencia de Encomienda (ej. MRW Chacao / Zoom)'
                    : 'Dirección exacta para la entrega a domicilio *'}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={
                    isNational
                      ? 'Ej. C.I. 20.123.456, Agencia MRW San Antonio de los Altos'
                      : 'Ej. Calle principal, edificio Ávila piso 3 apto 3B'
                  }
                  value={deliveryAddressDetail}
                  onChange={(e) => setDeliveryAddressDetail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-[#009fe3]"
                />
              </div>
            )}
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#009fe3] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>3. Método de Pago</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'pago_movil', label: 'Pago Móvil / BDV / Mercantil' },
                { id: 'transferencia', label: 'Transferencia Bancaria' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl text-xs font-medium transition-all border text-center ${
                    paymentMethod === m.id
                      ? 'bg-[#0c3b74] border-[#0c3b74] text-white shadow-sm font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Payment brief note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-600">
              <p>
                💳 <strong>Pago en Bolívares:</strong> Pagos mediante Pago Móvil o transferencia bancaria (Mercantil y Banco de Venezuela). Total:{' '}
                <strong className="text-slate-900">{formatBs(summary.totalBs)}</strong>.
              </p>
            </div>
          </div>

          {/* Section 4: Final Summary & Submit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Prendas:</span>
              <span className="font-semibold text-slate-800">{formatBs(summary.subtotalBs)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Entrega / Delivery:</span>
              <span>
                {summary.deliveryIsFree ? (
                  <strong className="text-emerald-700">¡GRATIS!</strong>
                ) : (
                  <strong className="text-slate-800">{formatBs(summary.deliveryCostBs)}</strong>
                )}
              </span>
            </div>

            {summary.hasMadeToOrderItems && (
              <div className="py-1 text-xs text-amber-800 font-medium">
                ⚠️ Incluye prendas bajo pedido (tiempo de confección en taller: {summary.maxLeadDays === 1 ? '1 día hábil' : `${summary.maxLeadDays || 2} días hábiles`}).
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="font-display font-semibold text-base text-slate-900">
                  Total a Pagar:
                </span>
              </div>
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#0c3b74]">
                {formatBs(summary.totalBs)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full bg-[#009fe3] hover:bg-[#0087c2] text-white py-4 rounded-2xl font-display font-semibold text-base flex items-center justify-center gap-2.5 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span>
              {isSubmitting ? 'Preparando pedido...' : 'Confirmar y Enviar a WhatsApp'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
