export type CategoryType = 'ninos' | 'chaquetas' | 'pijamas' | 'casual' | 'combos' | 'damas' | 'caballeros' | string;

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  activa: boolean;
  icono?: string;
  orden?: number;
}

export type VariantType = 'print' | 'color';

export type ProductAvailability = 'inmediato' | 'bajo_pedido';

export interface ProductVariant {
  id: string;
  size: string; // '2-4', '6-8', '10-14', 'S', 'M', 'L', 'XL'
  optionName: string; // 'Mickey Celeste', 'Jirafita Peach', 'Dino Verde', etc.
  colorName?: string; // Ej: 'Rosado Pastel', 'Azul Rey'
  colorHex?: string;
  imagePreview?: string;
  stock: number;
}

export interface SizeGuideRow {
  category: 'Infantil' | 'Dama / Caballero';
  size: string;
  chestWidth: string;
  totalLength: string;
  waist: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  description: string;
  variantType: VariantType;
  fabric?: string; // ej. '50% Poliéster 50% Algodón Afelpado'
  availability: ProductAvailability; // 'inmediato' (en stock) | 'bajo_pedido'
  productionDays?: number; // Días hábiles de confección registrados en taller
  basePriceUSD: number; // 1 unidad (detal)
  tier3PriceUSD?: number; // 3 unidades
  tier6PriceUSD?: number; // 6 unidades (Mayorista de fábrica oficial)
  tier12PriceUSD?: number; // 12 unidades (Docena)
  images: string[];
  variants: ProductVariant[];
  isFeatured?: boolean;
  badge?: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  zoneType: 'encuentro' | 'directo_teques' | 'directo_caracas' | 'nacional';
  costUSD: number;
  freeDeliveryMinUSD?: number;
  scheduleDetails: string;
  instructions: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ExchangeRateRecord {
  id: string;
  rate: number;
  createdAt: string;
  createdBy: string;
  note?: string;
}

export interface AppConfig {
  id?: string;
  tasa_bcv: number;
  entregas_caracas_activas: boolean;
  horario_caracas?: string;
  mensaje_anuncio?: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  optionName: string;
  colorName?: string;
  colorHex?: string;
  variantType: VariantType;
  availability: ProductAvailability;
  isBajoPedido?: boolean;
  productionDays?: number;
  image: string;
  quantity: number;
  basePriceUSD: number;
  appliedUnitPriceUSD: number;
  tierApplied?: 'detal' | 'tier3' | 'tier6' | 'tier12';
}

export type OrderStatus =
  | 'por_confirmar'
  | 'pago_confirmado'
  | 'en_preparacion'
  | 'despachado'
  | 'entregado'
  | 'cancelado';

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  scheduleDetails: string;
  deliveryCostUSD: number;
  deliveryIsFree: boolean;
  deliveryAddressDetail: string;
  paymentMethod: 'pago_movil' | 'efectivo' | 'binance' | 'zinli';
  rateSnapshot: number;
  subtotalUSD: number;
  totalUSD: number;
  totalBs: number;
  hasMadeToOrderItems: boolean; // Indica si incluye prendas bajo pedido
  status: OrderStatus;
  items: {
    productId: string;
    productName: string;
    size: string;
    optionName: string;
    availability: ProductAvailability;
    quantity: number;
    unitPriceUSD: number;
    subtotalUSD: number;
  }[];
  createdAt: string;
}
