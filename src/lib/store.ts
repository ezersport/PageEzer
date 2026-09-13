import type {
  Product,
  ProductVariant,
  DeliveryZone,
  ExchangeRateRecord,
  CartItem,
  Order,
  Category,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_EXCHANGE_RATES,
  INITIAL_ORDERS,
} from '../data/mockData';
import { supabase } from './supabase';

const CART_KEY = 'ezer_cart_clean_v3';
const PRODUCTS_KEY = 'ezer_products_clean_v3';
const ADMIN_PRODUCTS_KEY = 'ezer_admin_products_clean_v3';
const ZONES_KEY = 'ezer_zones_clean_v3';
const RATES_KEY = 'ezer_rates_clean_v3';
const ORDERS_KEY = 'ezer_orders_clean_v3';
const CATEGORIES_KEY = 'ezer_categories_clean_v3';

const isBrowser = typeof window !== 'undefined';

export function emitEvent(eventName: string, detail?: any) {
  if (isBrowser) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

// Normalizador universal y defensivo de productos (Soporta productos sin variantes creados en ezer-admin)
export function normalizeProduct(p: any): Product {
  const images = (Array.isArray(p.images) && p.images.length > 0)
    ? p.images
    : [p.imagen_principal, ...(Array.isArray(p.imagenes_galeria) ? p.imagenes_galeria : [])].filter(Boolean);

  const fallbackImage = images.length > 0 ? images[0] : '/images/conjunto-ninos-mickey.webp';

  const rawVariants = (Array.isArray(p.variants) ? p.variants : (Array.isArray(p.variantes) ? p.variantes : (Array.isArray(p.product_variants) ? p.product_variants : []))).map((v: any, idx: number) => ({
    id: String(v.id || `v-${idx}`),
    size: String(v.size || v.talla || 'Única'),
    optionName: String(v.optionName || v.nombre_variante || 'Estándar'),
    colorHex: String(v.colorHex || v.codigo_hex || '#009fe3'),
    stock: Number(v.stock ?? v.stock_disponible ?? 10),
    imagePreview: v.imagePreview || v.imagen_variante_url || fallbackImage,
  }));

  // SI NO HAY VARIANTES REGISTRADAS, CREAR UNA VARIANTE SEGURA POR DEFECTO PARA QUE NUNCA CRASHEE EL FRONTEND
  const safeVariants: ProductVariant[] = rawVariants.length > 0 ? rawVariants : [
    {
      id: `var-std-${p.id || '1'}`,
      size: 'Única',
      optionName: 'Modelo Estándar de Taller',
      colorHex: '#009fe3',
      stock: 99,
      imagePreview: fallbackImage,
    },
  ];

  return {
    id: String(p.id || `prod-${Date.now()}`),
    name: String(p.name || p.nombre || 'Prenda de Confección'),
    slug: String(p.slug || (p.nombre ? p.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${Date.now()}`)),
    category: (p.category || p.categoria || 'ninos') as any,
    description: String(p.description || p.descripcion || ''),
    variantType: p.variantType || (p.variantes?.[0]?.tipo_variante === 'estampado' ? 'print' : 'color'),
    fabric: String(p.fabric || p.tela_material || 'Algodón Confección'),
    availability: p.availability || p.disponibilidad || 'inmediato',
    basePriceUSD: Number(p.basePriceUSD ?? p.precio_detal_usd ?? 0),
    tier3PriceUSD: Number(p.tier3PriceUSD ?? p.precio_3_piezas_usd ?? 0),
    tier6PriceUSD: Number(p.tier6PriceUSD ?? p.precio_mayor_usd ?? 0),
    tier12PriceUSD: Number(p.tier12PriceUSD ?? 0),
    images: images.length > 0 ? images : ['/images/conjunto-ninos-mickey.webp'],
    variants: safeVariants,
    isFeatured: Boolean(p.isFeatured ?? p.destacado),
    badge: p.badge || (p.destacado ? 'DESTACADO ⭐' : undefined),
    isActive: p.isActive !== undefined ? Boolean(p.isActive) : (p.activo !== undefined ? Boolean(p.activo) : true),
  };
}

// ----------------- FETCH SUPABASE REAL-TIME APIS -----------------

// 1. Obtener productos directamente desde Supabase
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts error (usando caché):', error.message);
      return getProducts();
    }

    if (data && data.length > 0) {
      const normalized = data.map(normalizeProduct);
      if (isBrowser) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(normalized));
        emitEvent('ezer-products-updated', { products: normalized });
      }
      return normalized;
    }
    return getProducts();
  } catch (err) {
    console.error('Error al conectar con Supabase en fetchProducts:', err);
    return getProducts();
  }
}

// 2. Obtener categorías directamente desde Supabase
export async function fetchCategoriesFromSupabase(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('activa', true)
      .order('orden', { ascending: true });

    if (error) {
      console.warn('Supabase fetchCategories error:', error.message);
      return [];
    }

    if (data && data.length > 0) {
      if (isBrowser) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data));
        emitEvent('ezer-categories-updated', { categories: data });
      }
      return data;
    }
    return [];
  } catch (err) {
    console.error('Error al obtener categorías de Supabase:', err);
    return [];
  }
}

// 3. Obtener Zonas de Entrega directamente desde Supabase
export async function fetchDeliveryZonesFromSupabase(): Promise<DeliveryZone[]> {
  try {
    const { data, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('activa_esta_semana', true);

    if (error) {
      console.warn('Supabase fetchDeliveryZones error:', error.message);
      return getDeliveryZones();
    }

    if (data && data.length > 0) {
      const mapped: DeliveryZone[] = data.map((z: any) => ({
        id: z.id,
        name: z.nombre,
        zoneType: z.zona_tipo === 'nacional' ? 'nacional' : 'encuentro',
        costUSD: Number(z.costo_usd || 0),
        freeDeliveryMinUSD: Number(z.monto_minimo_gratis_usd || 0),
        scheduleDetails: Array.isArray(z.puntos_encuentro) ? z.puntos_encuentro.join(' • ') : '',
        instructions: Array.isArray(z.agencias_disponibles) && z.agencias_disponibles.length > 0
          ? `Agencias: ${z.agencias_disponibles.join(', ')}`
          : 'Entrega coordinada con el taller',
        isActive: Boolean(z.activa_esta_semana),
        sortOrder: 1,
      }));

      if (isBrowser) {
        localStorage.setItem(ZONES_KEY, JSON.stringify(mapped));
        emitEvent('ezer-zones-updated', { zones: mapped });
      }
      return mapped;
    }
    return getDeliveryZones();
  } catch (err) {
    console.error('Error al obtener zonas de Supabase:', err);
    return getDeliveryZones();
  }
}

// 4. Obtener Tasa de Cambio Oficial desde Supabase
export async function fetchCurrentRateFromSupabase(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('tasa_bcv')
      .eq('id', 'global')
      .single();

    if (error) {
      console.warn('Supabase fetchCurrentRate error:', error.message);
      return getCurrentRate();
    }

    if (data && data.tasa_bcv) {
      const rate = Number(data.tasa_bcv);
      if (isBrowser) {
        localStorage.setItem('ezer_rate_single', String(rate));
        emitEvent('ezer-rate-updated', { currentRate: rate });
      }
      return rate;
    }
    return getCurrentRate();
  } catch (err) {
    console.error('Error al obtener tasa de Supabase:', err);
    return getCurrentRate();
  }
}

// 5. Crear Pedido en Supabase
export async function createOrderInSupabase(orderData: any): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({
        numero_orden: orderData.orderNumber || `#EZ-${Math.floor(1000 + Math.random() * 9000)}`,
        cedula_cliente: orderData.customer?.idNumber || 'V-00000000',
        nombre_cliente: orderData.customer?.firstName || 'Cliente',
        apellido_cliente: orderData.customer?.lastName || 'Ezer',
        telefono_cliente: orderData.customer?.phone || '',
        tipo_destino: orderData.destinationType || 'caracas_sabado',
        zona_entrega_id: orderData.deliveryZone?.id || null,
        zona_nombre: orderData.deliveryZone?.name || 'Caracas Plaza Venezuela',
        punto_encuentro: orderData.meetingPoint || orderData.agencyCode || null,
        metodo_pago_codigo: orderData.paymentMethod || 'pago_movil',
        tasa_cambio_snapshot: orderData.exchangeRate || 76.50,
        total_unidades: orderData.totalUnits || 1,
        subtotal_usd: orderData.subtotalUSD || 0,
        costo_delivery_usd: orderData.deliveryCostUSD || 0,
        total_usd: orderData.totalUSD || 0,
        total_bs: orderData.totalBs || 0,
        costo_total_produccion_usd: (orderData.totalUSD || 0) * 0.5,
        ganancia_neta_usd: (orderData.totalUSD || 0) * 0.5,
        tipo_pago: orderData.paymentType || 'completo_100',
        monto_pagado_usd: orderData.totalUSD || 0,
        estado: 'por_confirmar',
      })
      .select()
      .single();

    if (orderError) {
      console.warn('Error al insertar orden en Supabase:', orderError);
      return { success: false, error: orderError.message };
    }

    // Insertar items de la orden
    if (orderResult && orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        order_id: orderResult.id,
        producto_id: item.productId,
        nombre_producto: item.productName,
        talla: item.size || 'Única',
        tipo_variante: item.variantType === 'print' ? 'estampado' : 'unicolor',
        nombre_variante: item.optionName || 'Estándar',
        cantidad: item.quantity,
        precio_unitario_aplicado_usd: item.appliedUnitPriceUSD,
        costo_unitario_usd: item.appliedUnitPriceUSD * 0.5,
        subtotal_venta_usd: item.appliedUnitPriceUSD * item.quantity,
      }));

      await supabase.from('order_items').insert(orderItems);
    }

    return { success: true, orderId: orderResult.id };
  } catch (err: any) {
    console.error('Excepción al crear orden en Supabase:', err);
    return { success: false, error: err.message };
  }
}

// ----------------- LOCAL SYNCHRONOUS GETTERS (CACHED) -----------------
export function getExchangeRates(): ExchangeRateRecord[] {
  if (!isBrowser) return INITIAL_EXCHANGE_RATES;
  const stored = localStorage.getItem(RATES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getCurrentRate(): number {
  if (isBrowser) {
    const single = localStorage.getItem('ezer_rate_single');
    if (single && Number(single) > 0) return Number(single);
  }
  const rates = getExchangeRates();
  if (rates.length > 0 && rates[0].rate > 0) return rates[0].rate;
  return 76.50;
}

export function addExchangeRate(newRate: number, note: string = 'Ajuste desde el panel'): ExchangeRateRecord {
  const history = getExchangeRates();
  const newRecord: ExchangeRateRecord = {
    id: `rate-${Date.now()}`,
    rate: Number(newRate),
    createdAt: new Date().toISOString(),
    createdBy: 'Administrador Ezer',
    note,
  };
  const updatedHistory = [newRecord, ...history].slice(0, 10);
  if (isBrowser) {
    localStorage.setItem(RATES_KEY, JSON.stringify(updatedHistory));
    emitEvent('ezer-rate-updated', { currentRate: newRate, history: updatedHistory });
  }
  return newRecord;
}

export function getDeliveryZones(): DeliveryZone[] {
  if (!isBrowser) return INITIAL_DELIVERY_ZONES;
  const stored = localStorage.getItem(ZONES_KEY);
  if (!stored) return INITIAL_DELIVERY_ZONES;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DELIVERY_ZONES;
  }
}

export function saveDeliveryZones(zones: DeliveryZone[]) {
  if (isBrowser) {
    localStorage.setItem(ZONES_KEY, JSON.stringify(zones));
    emitEvent('ezer-zones-updated', { zones });
  }
}

export function getProducts(): Product[] {
  if (!isBrowser) return INITIAL_PRODUCTS;
  const stored = localStorage.getItem(PRODUCTS_KEY) || localStorage.getItem(ADMIN_PRODUCTS_KEY);
  if (!stored) return INITIAL_PRODUCTS;
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizeProduct);
    }
    return INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]) {
  if (isBrowser) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
    emitEvent('ezer-products-updated', { products });
  }
}

export function getOrders(): Order[] {
  if (!isBrowser) return [];
  const stored = localStorage.getItem(ORDERS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  const orders = getOrders();
  const updated = [order, ...orders];
  if (isBrowser) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    emitEvent('ezer-orders-updated', { orders: updated });
  }
}

export function updateOrderStatus(orderId: string, newStatus: Order['status']) {
  const orders = getOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
  if (isBrowser) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    emitEvent('ezer-orders-updated', { orders: updated });
  }
}


// ----------------- CART MANAGEMENT & VOLUME ENGINE -----------------
export function getCartItems(): CartItem[] {
  if (!isBrowser) return [];
  const stored = localStorage.getItem(CART_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (isBrowser) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    emitEvent('ezer-cart-updated', { items });
  }
}

export function addToCart(
  product: Product,
  variant: ProductVariant,
  quantity: number = 1
) {
  const cart = getCartItems();
  const cartItemId = `${product.id}-${variant.id}`;
  const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      cartItemId,
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      size: variant.size,
      optionName: variant.optionName,
      variantType: product.variantType,
      availability: product.availability,
      image: product.images[0] || '/images/kids-sweaters.webp',
      quantity,
      basePriceUSD: product.basePriceUSD,
      appliedUnitPriceUSD: product.basePriceUSD,
    });
  }

  saveCartItems(cart);
  emitEvent('ezer-open-cart');
}

export function updateCartItemQuantity(cartItemId: string, newQty: number) {
  let cart = getCartItems();
  if (newQty <= 0) {
    cart = cart.filter((item) => item.cartItemId !== cartItemId);
  } else {
    cart = cart.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
    );
  }
  saveCartItems(cart);
}

export function removeFromCart(cartItemId: string) {
  const cart = getCartItems().filter((item) => item.cartItemId !== cartItemId);
  saveCartItems(cart);
}

export function clearCart() {
  saveCartItems([]);
}

// ----------------- VOLUME PRICING CALCULATION ENGINE -----------------
export interface CartCalculationResult {
  items: CartItem[];
  totalUnits: number;
  subtotalUSD: number;
  subtotalBs: number;
  savingsUSD: number;
  savingsBs: number;
  deliveryCostUSD: number;
  deliveryCostBs: number;
  deliveryIsFree: boolean;
  totalUSD: number;
  totalBs: number;
  hasMadeToOrderItems: boolean;
  volumeTierMessage?: string;
  freeDeliveryMessage?: string;
}

export function calculateCartSummary(
  items: CartItem[],
  currentRate: number,
  selectedZone?: DeliveryZone | null
): CartCalculationResult {
  const products = getProducts();
  const productsMap = new Map(products.map((p) => [p.id, p]));

  // Contar unidades por producto
  const productQuantityMap: Record<string, number> = {};
  items.forEach((item) => {
    productQuantityMap[item.productId] = (productQuantityMap[item.productId] || 0) + item.quantity;
  });

  let subtotalUSD = 0;
  let totalWithoutDiscountsUSD = 0;
  let totalUnits = 0;
  let hasMadeToOrderItems = false;
  let volumeTierMessage: string | undefined;

  const calculatedItems = items.map((item) => {
    const product = productsMap.get(item.productId);
    const totalProductUnits = productQuantityMap[item.productId] || item.quantity;
    totalUnits += item.quantity;

    if (item.availability === 'bajo_pedido') {
      hasMadeToOrderItems = true;
    }

    let appliedPrice = item.basePriceUSD;
    let tierApplied: CartItem['tierApplied'] = 'detal';

    if (product) {
      if (totalProductUnits >= 12 && product.tier12PriceUSD) {
        appliedPrice = product.tier12PriceUSD;
        tierApplied = 'tier12';
      } else if (totalProductUnits >= 6 && product.tier6PriceUSD) {
        appliedPrice = product.tier6PriceUSD;
        tierApplied = 'tier6';
      } else if (totalProductUnits >= 3 && product.tier3PriceUSD) {
        appliedPrice = product.tier3PriceUSD;
        tierApplied = 'tier3';
      }

      // Mensaje de incentivo para siguiente tramo
      if (totalProductUnits < 3 && product.tier3PriceUSD) {
        const remaining = 3 - totalProductUnits;
        volumeTierMessage = `¡Agrega ${remaining} prenda${remaining > 1 ? 's' : ''} más para activar precio especial x3 (${formatBs(product.tier3PriceUSD * currentRate)} c/u)!`;
      } else if (totalProductUnits >= 3 && totalProductUnits < 6 && product.tier6PriceUSD) {
        const remaining = 6 - totalProductUnits;
        volumeTierMessage = `¡Estás a ${remaining} prenda${remaining > 1 ? 's' : ''} de precio de MEDIA DOCENA (${formatBs(product.tier6PriceUSD * currentRate)} c/u)!`;
      } else if (totalProductUnits >= 6 && totalProductUnits < 12 && product.tier12PriceUSD) {
        const remaining = 12 - totalProductUnits;
        volumeTierMessage = `¡Añade ${remaining} prenda${remaining > 1 ? 's' : ''} para precio DOCENA MAYORISTA (${formatBs(product.tier12PriceUSD * currentRate)} c/u)!`;
      }
    }

    const itemSubtotal = appliedPrice * item.quantity;
    subtotalUSD += itemSubtotal;
    totalWithoutDiscountsUSD += item.basePriceUSD * item.quantity;

    return {
      ...item,
      appliedUnitPriceUSD: appliedPrice,
      tierApplied,
    };
  });

  const savingsUSD = Math.max(0, totalWithoutDiscountsUSD - subtotalUSD);

  // Delivery y Mínimo para Delivery Gratis
  let deliveryCostUSD = 0;
  let deliveryIsFree = false;
  let freeDeliveryMessage: string | undefined;

  if (selectedZone) {
    if (selectedZone.freeDeliveryMinUSD && subtotalUSD >= selectedZone.freeDeliveryMinUSD) {
      deliveryCostUSD = 0;
      deliveryIsFree = true;
      freeDeliveryMessage = `¡Felicidades! 🎉 Calificas para Entrega GRATIS en ${selectedZone.name}.`;
    } else {
      deliveryCostUSD = selectedZone.costUSD;
      deliveryIsFree = false;
      if (selectedZone.freeDeliveryMinUSD) {
        const needed = selectedZone.freeDeliveryMinUSD - subtotalUSD;
        freeDeliveryMessage = `¡Agrega ${formatBs(needed * currentRate)} más para obtener Entrega GRATIS!`;
      }
    }
  }

  const totalUSD = subtotalUSD + deliveryCostUSD;
  const subtotalBs = subtotalUSD * currentRate;
  const savingsBs = savingsUSD * currentRate;
  const deliveryCostBs = deliveryCostUSD * currentRate;
  const totalBs = totalUSD * currentRate;

  return {
    items: calculatedItems,
    totalUnits,
    subtotalUSD,
    subtotalBs,
    savingsUSD,
    savingsBs,
    deliveryCostUSD,
    deliveryCostBs,
    deliveryIsFree,
    totalUSD,
    totalBs,
    hasMadeToOrderItems,
    volumeTierMessage,
    freeDeliveryMessage,
  };
}

export function formatBs(amount: number): string {
  return `Bs. ${amount.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
