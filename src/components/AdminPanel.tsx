import React, { useState, useEffect } from 'react';
import type {
  Product,
  DeliveryZone,
  ExchangeRateRecord,
  Order,
  OrderStatus,
  CategoryType,
  VariantType,
  ProductAvailability,
} from '../types';
import {
  getProducts,
  saveProducts,
  getDeliveryZones,
  saveDeliveryZones,
  getExchangeRates,
  getCurrentRate,
  addExchangeRate,
  getOrders,
  updateOrderStatus,
  formatBs,
  formatUSD,
} from '../lib/store';
import {
  Zap,
  Truck,
  Package,
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Flame,
  ArrowLeft,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Search,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasas' | 'zonas' | 'productos' | 'pedidos'>('pedidos');

  // Exchange rates state
  const [ratesHistory, setRatesHistory] = useState<ExchangeRateRecord[]>([]);
  const [newRateInput, setNewRateInput] = useState<string>('');
  const [rateNoteInput, setRateNoteInput] = useState<string>('');
  const [rateSuccessMessage, setRateSuccessMessage] = useState<string>('');

  // Delivery zones state
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<CategoryType>('ninos');
  const [newProductVariantType, setNewProductVariantType] = useState<VariantType>('print');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductImage, setNewProductImage] = useState('/images/kids-sweaters.jpg');
  const [newProductBasePrice, setNewProductBasePrice] = useState('10.00');
  const [newProductTier3, setNewProductTier3] = useState('8.50');
  const [newProductTier6, setNewProductTier6] = useState('7.50');
  const [newProductTier12, setNewProductTier12] = useState('6.50');
  const [newProductAvailability, setNewProductAvailability] = useState<ProductAvailability>('inmediato');
  const [newProductOptionsText, setNewProductOptionsText] = useState('Sonic Azul, Minnie Gris, Koala Verde');
  const [newProductSizesText, setNewProductSizesText] = useState('4, 6, 8, 10, 12');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('todos');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  const currentRate = ratesHistory[0]?.rate || 76.50;

  useEffect(() => {
    setRatesHistory(getExchangeRates());
    setZones(getDeliveryZones());
    setProducts(getProducts());
    setOrders(getOrders());
  }, []);

  // --- Handlers para Tasa de Cambio ---
  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newRateInput);
    if (isNaN(parsed) || parsed <= 0) return;

    addExchangeRate(parsed, rateNoteInput || 'Actualización manual');
    setRatesHistory(getExchangeRates());
    setNewRateInput('');
    setRateNoteInput('');
    setRateSuccessMessage(`¡Tasa actualizada con éxito a ${parsed.toFixed(2)} Bs/$!`);
    setTimeout(() => setRateSuccessMessage(''), 3500);
  };

  // --- Handlers para Zonas de Entrega ---
  const handleToggleZoneActive = (zoneId: string) => {
    const updated = zones.map((z) => (z.id === zoneId ? { ...z, isActive: !z.isActive } : z));
    setZones(updated);
    saveDeliveryZones(updated);
  };

  const handleUpdateZone = (zone: DeliveryZone) => {
    const updated = zones.map((z) => (z.id === zone.id ? zone : z));
    setZones(updated);
    saveDeliveryZones(updated);
    setEditingZone(null);
  };

  // --- Handlers para Productos ---
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const optionsArray = newProductOptionsText.split(',').map((s) => s.trim()).filter(Boolean);
    const sizesArray = newProductSizesText.split(',').map((s) => s.trim()).filter(Boolean);

    // Generar combinaciones de variantes
    const generatedVariants: Product['variants'] = [];
    optionsArray.forEach((opt, optIndex) => {
      sizesArray.forEach((size, szIndex) => {
        generatedVariants.push({
          id: `var-${Date.now()}-${optIndex}-${szIndex}`,
          size,
          optionName: opt,
          stock: 12,
        });
      });
    });

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      slug: newProductName.trim().toLowerCase().replace(/\s+/g, '-'),
      category: newProductCategory,
      variantType: newProductVariantType,
      description: newProductDescription.trim(),
      basePriceUSD: parseFloat(newProductBasePrice) || 10,
      tier3PriceUSD: newProductTier3 ? parseFloat(newProductTier3) : undefined,
      tier6PriceUSD: newProductTier6 ? parseFloat(newProductTier6) : undefined,
      tier12PriceUSD: newProductTier12 ? parseFloat(newProductTier12) : undefined,
      images: [newProductImage || '/images/kids-sweaters.jpg'],
      variants: generatedVariants,
      availability: newProductAvailability,
      isActive: true,
      badge: newProductTier6 ? 'PROMO VOLUMEN' : undefined,
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    saveProducts(updated);
    setShowProductForm(false);
    setNewProductName('');
    setNewProductDescription('');
  };

  const handleToggleProductActive = (prodId: string) => {
    const updated = products.map((p) => (p.id === prodId ? { ...p, isActive: !p.isActive } : p));
    setProducts(updated);
    saveProducts(updated);
  };

  // --- Handlers para Pedidos ---
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setOrders(getOrders());
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'todos' && o.status !== orderStatusFilter) return false;
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase().trim();
    return (
      o.orderCode.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      o.deliveryZoneName.toLowerCase().includes(q)
    );
  });

  // Métricas rápidas
  const totalSalesUSD = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((acc, o) => acc + o.totalUSD, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'por_confirmar').length;

  return (
    <div className="min-h-screen bg-[#131518] text-white">
      {/* Admin Top Navigation */}
      <header className="border-b border-[#2a313d] bg-[#1c2026] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-[#131518] px-3 py-1.5 rounded-lg border border-[#2a313d] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Tienda</span>
            </a>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#009fe3]">
                <img src="/images/ezer-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-display font-black text-xl text-white">
                  Panel Administrativo <span className="text-[#009fe3]">Ezer Sport</span>
                </h1>
                <p className="text-xs text-gray-400">
                  Control de Tasa, Envíos, Inventario y Pedidos
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Tasa Activa</span>
              <span className="font-display font-bold text-sm text-[#d0d709]">
                {currentRate.toFixed(2)} Bs/$
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-4 overflow-x-auto border-t border-[#2a313d]/60">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`py-3.5 px-4 font-display font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'pedidos'
                ? 'border-[#009fe3] text-white bg-[#0c3b74]/20'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-[#009fe3]" />
            <span>Pedidos</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-[#d0d709] text-[#131518] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tasas')}
            className={`py-3.5 px-4 font-display font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'tasas'
                ? 'border-[#009fe3] text-white bg-[#0c3b74]/20'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-[#d0d709]" />
            <span>Tasa del Día & Historial (10)</span>
          </button>

          <button
            onClick={() => setActiveTab('zonas')}
            className={`py-3.5 px-4 font-display font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'zonas'
                ? 'border-[#009fe3] text-white bg-[#0c3b74]/20'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4 text-[#009fe3]" />
            <span>Logística & Puntos de Entrega</span>
          </button>

          <button
            onClick={() => setActiveTab('productos')}
            className={`py-3.5 px-4 font-display font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'productos'
                ? 'border-[#009fe3] text-white bg-[#0c3b74]/20'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 text-[#d0d709]" />
            <span>Catálogo & Precios por Mayor</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#1c2026] p-5 rounded-2xl border border-[#2a313d] flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-semibold block">Total Facturado</span>
                  <span className="font-display font-black text-2xl text-[#d0d709]">
                    {formatBs(totalSalesUSD * currentRate)}
                  </span>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    Ref. {formatUSD(totalSalesUSD)}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#0c3b74] flex items-center justify-center text-[#d0d709]">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#1c2026] p-5 rounded-2xl border border-[#2a313d] flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-semibold block">Total Pedidos</span>
                  <span className="font-display font-black text-2xl text-white">
                    {orders.length}
                  </span>
                  <span className="text-xs text-gray-400 block mt-0.5">Registrados en el sistema</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#009fe3]/20 flex items-center justify-center text-[#009fe3]">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#1c2026] p-5 rounded-2xl border border-[#2a313d] flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-semibold block">Por Confirmar Pago</span>
                  <span className="font-display font-black text-2xl text-amber-400">
                    {pendingOrdersCount}
                  </span>
                  <span className="text-xs text-gray-400 block mt-0.5">Esperando comprobante</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Search and Status Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Bar for Order Number / Client */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por # de Orden (ej. #EZ-4821), cliente o teléfono..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-[#131518] border border-[#2a313d] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#009fe3] transition-colors"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <span className="text-xs text-gray-400">
                  Mostrando <strong className="text-white">{filteredOrders.length}</strong> de {orders.length} pedidos
                </span>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['todos', 'por_confirmar', 'pago_confirmado', 'en_preparacion', 'despachado', 'entregado'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 ${
                      orderStatusFilter === st
                        ? 'bg-[#009fe3] text-white'
                        : 'bg-[#1c2026] text-gray-400 hover:text-white border border-[#2a313d]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#1c2026] rounded-2xl border border-[#2a313d] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#131518] text-gray-400 uppercase font-bold text-[11px] border-b border-[#2a313d]">
                    <tr>
                      <th className="p-4">Pedido / Fecha</th>
                      <th className="p-4">Cliente & WhatsApp</th>
                      <th className="p-4">Zona de Entrega & Horario</th>
                      <th className="p-4">Prendas</th>
                      <th className="p-4">Monto Total</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a313d]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No hay pedidos con este estado.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const cleanPhone = ord.customerPhone.replace(/\D/g, '');
                        const waLink = `https://wa.me/58${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;

                        return (
                          <tr key={ord.id} className="hover:bg-[#131518]/50 transition-colors">
                            <td className="p-4">
                              <span className="font-display font-black text-sm text-white block">
                                {ord.orderCode}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(ord.createdAt).toLocaleDateString('es-VE', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="font-bold text-white block">{ord.customerName}</span>
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#009fe3] hover:underline flex items-center gap-1 font-semibold mt-0.5"
                              >
                                <span>{ord.customerPhone}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>

                            <td className="p-4 max-w-xs">
                              <span className="font-bold text-gray-200 block truncate">
                                {ord.deliveryZoneName}
                              </span>
                              <span className="text-[11px] text-gray-400 block mt-0.5">
                                {ord.scheduleDetails}
                              </span>
                              <span className="text-[10px] text-gray-500 block truncate">
                                📍 {ord.deliveryAddressDetail}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="space-y-1">
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="text-[11px]">
                                    <span className="font-bold text-white">{it.quantity}x</span>{' '}
                                    <span className="text-gray-300">{it.productName.split(' ')[0]}</span>{' '}
                                    <span className="text-[#009fe3]">({it.size} - {it.optionName})</span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="font-display font-black text-sm text-[#d0d709] block">
                                {formatBs(ord.totalBs)}
                              </span>
                              <span className="text-[10px] text-gray-400 block">
                                Ref. {formatUSD(ord.totalUSD)}
                              </span>
                              <span className="text-[10px] bg-[#131518] px-1.5 py-0.5 rounded border border-[#2a313d] text-gray-300 uppercase mt-1 inline-block">
                                {ord.paymentMethod.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="p-4">
                              <select
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                                className={`text-[11px] font-bold rounded-lg px-2.5 py-1.5 border bg-[#131518] focus:outline-none ${
                                  ord.status === 'pago_confirmado'
                                    ? 'border-emerald-500 text-emerald-400'
                                    : ord.status === 'por_confirmar'
                                    ? 'border-amber-500 text-amber-400'
                                    : ord.status === 'despachado'
                                    ? 'border-cyan-500 text-cyan-400'
                                    : 'border-[#2a313d] text-gray-300'
                                }`}
                              >
                                <option value="por_confirmar">Por Confirmar</option>
                                <option value="pago_confirmado">Pago Confirmado</option>
                                <option value="en_preparacion">En Preparación</option>
                                <option value="despachado">Despachado</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                              </select>
                            </td>

                            <td className="p-4 text-right">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#0c3b74] hover:bg-[#009fe3] text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors"
                              >
                                <span>WhatsApp</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASA DEL DÍA E HISTORIAL */}
        {activeTab === 'tasas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form to update rate */}
            <div className="lg:col-span-5 bg-[#1c2026] p-6 rounded-2xl border border-[#2a313d] space-y-5">
              <div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#d0d709]" />
                  <span>Actualizar Tasa de Cambio</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Todos los precios de la tienda pública se multiplicarán al instante por esta tasa.
                </p>
              </div>

              {rateSuccessMessage && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{rateSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveRate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Nueva Tasa Oficial (Bs por cada $):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder={currentRate.toFixed(2)}
                      value={newRateInput}
                      onChange={(e) => setNewRateInput(e.target.value)}
                      className="w-full bg-[#131518] border border-[#2a313d] rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-[#009fe3]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      Bs / USD
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Motivo / Nota del cambio:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Tasa BCV jornada de la tarde"
                    value={rateNoteInput}
                    onChange={(e) => setRateNoteInput(e.target.value)}
                    className="w-full bg-[#131518] border border-[#2a313d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#009fe3]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d0d709] hover:bg-[#b8be08] text-[#131518] py-3 rounded-xl font-display font-black text-sm transition-all shadow-md active:scale-95"
                >
                  PUBLICAR NUEVA TASA
                </button>
              </form>

              <div className="p-4 rounded-xl bg-[#0c3b74]/20 border border-[#009fe3]/30 text-xs text-gray-300 space-y-1">
                <p className="font-bold text-white">💡 ¿Cómo protege esto tu negocio?</p>
                <p className="text-[11px] text-gray-400">
                  Tus productos siguen valiendo sus $10 o $15 originales en la base de datos. Al cambiar la tasa aquí, tus clientes ven de inmediato la cifra exacta en Bolívares para pagar por Pago Móvil sin pérdidas.
                </p>
              </div>
            </div>

            {/* Table of last 10 rate changes */}
            <div className="lg:col-span-7 bg-[#1c2026] p-6 rounded-2xl border border-[#2a313d] space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Historial de los Últimos 10 Cambios de Tasa
                </h3>
                <p className="text-xs text-gray-400">
                  Auditoría completa de modificaciones guardadas.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#131518] text-gray-400 uppercase font-bold text-[10px] border-b border-[#2a313d]">
                    <tr>
                      <th className="p-3">Fecha y Hora</th>
                      <th className="p-3">Tasa Registrada</th>
                      <th className="p-3">Responsable</th>
                      <th className="p-3">Nota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a313d]">
                    {ratesHistory.map((rec, index) => (
                      <tr
                        key={rec.id}
                        className={index === 0 ? 'bg-[#0c3b74]/20 font-semibold' : ''}
                      >
                        <td className="p-3">
                          {new Date(rec.createdAt).toLocaleDateString('es-VE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {index === 0 && (
                            <span className="ml-2 text-[9px] bg-[#d0d709] text-[#131518] font-black px-1.5 py-0.2 rounded">
                              ACTUAL
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-display font-black text-sm text-[#009fe3]">
                          {rec.rate.toFixed(2)} Bs/$
                        </td>
                        <td className="p-3 text-gray-400">{rec.createdBy}</td>
                        <td className="p-3 text-gray-400 italic text-[11px]">{rec.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOGÍSTICA & PUNTOS DE ENTREGA */}
        {activeTab === 'zonas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  Puntos de Encuentro y Envíos (Los Teques & Caracas)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Edita costos de traslado, horarios de entrega de los viernes y condiciones para delivery gratis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    zone.isActive
                      ? 'bg-[#1c2026] border-[#2a313d]'
                      : 'bg-[#1c2026]/50 border-red-500/20 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#009fe3] uppercase">
                      {zone.zoneType}
                    </span>
                    <button
                      onClick={() => handleToggleZoneActive(zone.id)}
                      className={`text-[11px] font-black px-3 py-1 rounded-full transition-colors ${
                        zone.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {zone.isActive ? 'ACTIVO' : 'EN PAUSA'}
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-base text-white">
                    {zone.name}
                  </h4>

                  <p className="text-xs text-gray-400 mt-1">
                    {zone.instructions}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#2a313d] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Horario de Entrega:</span>
                      <span className="font-bold text-white">{zone.scheduleDetails}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Costo Base Delivery:</span>
                      <span className="font-bold text-[#d0d709]">
                        {zone.costUSD === 0 ? 'Sin recargo' : `$${zone.costUSD.toFixed(2)} (${formatBs(zone.costUSD * currentRate)})`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Monto Mínimo Delivery Gratis:</span>
                      <span className="font-bold text-[#009fe3]">
                        {zone.freeDeliveryMinUSD ? `$${zone.freeDeliveryMinUSD.toFixed(2)}` : 'No aplica'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setEditingZone(zone)}
                      className="text-xs font-bold text-gray-300 hover:text-white bg-[#131518] px-3 py-1.5 rounded-lg border border-[#2a313d]"
                    >
                      Editar Parámetros
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Zone Modal */}
            {editingZone && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#1c2026] p-6 rounded-3xl border border-[#2a313d] w-full max-w-lg space-y-4">
                  <h3 className="font-display font-bold text-lg text-white">
                    Editar: {editingZone.name}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Nombre de la Zona / Punto:</label>
                      <input
                        type="text"
                        value={editingZone.name}
                        onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                        className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Costo Delivery ($USD):</label>
                        <input
                          type="number"
                          step="0.5"
                          value={editingZone.costUSD}
                          onChange={(e) => setEditingZone({ ...editingZone, costUSD: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Mínimo para Gratis ($USD):</label>
                        <input
                          type="number"
                          step="1"
                          value={editingZone.freeDeliveryMinUSD || ''}
                          onChange={(e) => setEditingZone({ ...editingZone, freeDeliveryMinUSD: e.target.value ? parseFloat(e.target.value) : undefined })}
                          placeholder="Ej. 30"
                          className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Días y Horarios de Entrega:</label>
                      <input
                        type="text"
                        value={editingZone.scheduleDetails}
                        onChange={(e) => setEditingZone({ ...editingZone, scheduleDetails: e.target.value })}
                        className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Instrucciones al Cliente:</label>
                      <textarea
                        rows={2}
                        value={editingZone.instructions}
                        onChange={(e) => setEditingZone({ ...editingZone, instructions: e.target.value })}
                        className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingZone(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateZone(editingZone)}
                      className="bg-[#009fe3] hover:bg-[#0087c2] text-white px-5 py-2 rounded-xl text-xs font-bold"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CATÁLOGO & PRECIOS POR VOLUMEN */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  Catálogo de Productos y Escalas por Mayor
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configura si la prenda es por estampados (Sonic, Minnie, etc.) o por colores, y fija precios para 1, 3, 6 y 12 piezas.
                </p>
              </div>

              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-[#d0d709] hover:bg-[#b8be08] text-[#131518] px-4 py-2.5 rounded-xl font-display font-black text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{showProductForm ? 'Cerrar Formulario' : 'Crear Nuevo Producto'}</span>
              </button>
            </div>

            {/* Create Product Form */}
            {showProductForm && (
              <form onSubmit={handleCreateProduct} className="bg-[#1c2026] p-6 rounded-3xl border border-[#2a313d] space-y-6 animate-fadeIn">
                <h4 className="font-display font-bold text-base text-white">
                  Nuevo Producto para el Catálogo
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Nombre del Producto *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Suéter Deportivo Batman"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Categoría</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value as any)}
                      className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                    >
                      <option value="ninos">Infantil & Estampados</option>
                      <option value="damas">Damas</option>
                      <option value="caballeros">Caballeros</option>
                      <option value="combos">Combos / Mayor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Tipo de Variante</label>
                    <select
                      value={newProductVariantType}
                      onChange={(e) => setNewProductVariantType(e.target.value as any)}
                      className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                    >
                      <option value="print">Por Estampado / Personaje (Sonic, Minnie...)</option>
                      <option value="color">Por Color (Negro, Azul, Gris...)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Disponibilidad</label>
                    <select
                      value={newProductAvailability}
                      onChange={(e) => setNewProductAvailability(e.target.value as any)}
                      className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                    >
                      <option value="inmediato">🟢 En Stock (Entrega Inmediata)</option>
                      <option value="bajo_pedido">⏱️ Bajo Pedido (Confección 2-4 días)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 font-semibold mb-1">
                      {newProductVariantType === 'print' ? 'Motivos / Estampados (separados por coma)' : 'Colores (separados por coma)'}
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Sonic Azul, Minnie Rosa, Koala Verde"
                      value={newProductOptionsText}
                      onChange={(e) => setNewProductOptionsText(e.target.value)}
                      className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Tallas Disponibles (separadas por coma)</label>
                    <input
                      type="text"
                      placeholder="Ej. 4, 6, 8, 10, 12 o S, M, L"
                      value={newProductSizesText}
                      onChange={(e) => setNewProductSizesText(e.target.value)}
                      className="w-full bg-[#131518] border border-[#2a313d] rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Wholesale Tier Prices */}
                <div className="p-4 rounded-2xl bg-[#131518] border border-[#2a313d] space-y-3">
                  <span className="text-xs font-bold text-[#d0d709] flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>Escala de Precios por Volumen ($USD)</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">1 Unidad (Detal):</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={newProductBasePrice}
                        onChange={(e) => setNewProductBasePrice(e.target.value)}
                        className="w-full bg-[#1c2026] border border-[#2a313d] rounded-xl p-2 font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#009fe3] mb-1">Desde 3 piezas (c/u):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newProductTier3}
                        onChange={(e) => setNewProductTier3(e.target.value)}
                        className="w-full bg-[#1c2026] border border-[#2a313d] rounded-xl p-2 font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#d0d709] mb-1">1/2 Docena (6) (c/u):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newProductTier6}
                        onChange={(e) => setNewProductTier6(e.target.value)}
                        className="w-full bg-[#1c2026] border border-[#2a313d] rounded-xl p-2 font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">Docena (12) (c/u):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newProductTier12}
                        onChange={(e) => setNewProductTier12(e.target.value)}
                        className="w-full bg-[#1c2026] border border-[#2a313d] rounded-xl p-2 font-bold text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d0d709] hover:bg-[#b8be08] text-[#131518] px-6 py-2.5 rounded-xl font-display font-black text-xs"
                  >
                    Guardar y Publicar
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-[#1c2026] rounded-2xl border border-[#2a313d] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#131518] text-gray-400 uppercase font-bold text-[10px] border-b border-[#2a313d]">
                    <tr>
                      <th className="p-3">Producto</th>
                      <th className="p-3">Tipo / Variantes</th>
                      <th className="p-3">Precio 1 Unid</th>
                      <th className="p-3">Escalas x3 / x6 / x12</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a313d]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#131518]/50">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.images[0] || '/images/kids-sweaters.jpg'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#131518]"
                          />
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-gray-400 capitalize">{p.category}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="font-semibold text-[#009fe3] block">
                            {p.variantType === 'print' ? 'Estampados' : 'Colores'}: {p.variants.length}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {Array.from(new Set(p.variants.map((v) => v.optionName))).join(', ')}
                          </span>
                        </td>

                        <td className="p-3 font-bold text-white">
                          ${p.basePriceUSD.toFixed(2)}{' '}
                          <span className="text-gray-400 text-[10px] block">
                            ({formatBs(p.basePriceUSD * currentRate)})
                          </span>
                        </td>

                        <td className="p-3 text-[11px]">
                          <span className="text-gray-300">x3: ${p.tier3PriceUSD?.toFixed(2) || '-'}</span> •{' '}
                          <span className="text-[#d0d709] font-bold">x6: ${p.tier6PriceUSD?.toFixed(2) || '-'}</span> •{' '}
                          <span className="text-[#009fe3]">x12: ${p.tier12PriceUSD?.toFixed(2) || '-'}</span>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => handleToggleProductActive(p.id)}
                            className={`text-[10px] font-black px-2 py-0.5 rounded ${
                              p.isActive
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {p.isActive ? 'PUBLICADO' : 'OCULTO'}
                          </button>
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleProductActive(p.id)}
                            className="text-xs text-gray-400 hover:text-white underline"
                          >
                            {p.isActive ? 'Pausar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
