import React, { useState, useEffect } from 'react';
import type { Product, CategoryType, Category } from '../types';
import {
  getProducts,
  getCurrentRate,
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  fetchCurrentRateFromSupabase,
  emitEvent,
} from '../lib/store';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { Search, Scissors } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentRate, setCurrentRate] = useState<number>(76.50);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  useEffect(() => {
    // 1. Carga inicial síncrona desde caché
    setProducts(getProducts());
    setCurrentRate(getCurrentRate());

    // 2. Carga en tiempo real directamente desde Supabase
    fetchProductsFromSupabase().then((prods) => {
      if (prods && prods.length > 0) setProducts(prods);
    });

    fetchCategoriesFromSupabase().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });

    fetchCurrentRateFromSupabase().then((rate) => {
      if (rate && rate > 0) setCurrentRate(rate);
    });

    // 3. Suscripción a eventos de actualización local
    const handleProductsUpdate = (e: any) => {
      if (e.detail?.products) setProducts(e.detail.products);
    };

    const handleCategoriesUpdate = (e: any) => {
      if (e.detail?.categories) setCategories(e.detail.categories);
    };

    const handleRateUpdate = (e: any) => {
      if (e.detail?.currentRate) setCurrentRate(e.detail.currentRate);
    };

    window.addEventListener('ezer-products-updated', handleProductsUpdate);
    window.addEventListener('ezer-categories-updated', handleCategoriesUpdate);
    window.addEventListener('ezer-rate-updated', handleRateUpdate);

    return () => {
      window.removeEventListener('ezer-products-updated', handleProductsUpdate);
      window.removeEventListener('ezer-categories-updated', handleCategoriesUpdate);
      window.removeEventListener('ezer-rate-updated', handleRateUpdate);
    };
  }, []);

  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;
    const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.fabric && p.fabric.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (Array.isArray(p.variants) &&
        p.variants.some((v) => v.optionName && v.optionName.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  // Pestañas dinámicas: Si hay categorías en Supabase, las usa; de lo contrario usa las estándar
  const displayTabs = [
    { id: 'todos', label: 'Todos los Modelos' },
    ...(categories.length > 0
      ? categories.map((c) => ({ id: c.slug, label: c.nombre }))
      : [
          { id: 'ninos', label: '👶 Conjuntos Infantiles' },
          { id: 'chaquetas', label: '🧥 Chaquetas & Cortavientos' },
          { id: 'pijamas', label: '🌙 Pijamas' },
          { id: 'sueteres', label: '👔 Suéteres & Hoodies' },
          { id: 'combos', label: '📦 Mayoristas (6+ Piezas)' },
        ]),
  ];

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#009fe3]"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#009fe3]">
              Directo de Fábrica • Los Teques
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Colección de Confección
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Prendas confeccionadas en algodón y materiales de alta calidad para toda la familia.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por prenda, tela o diseño..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#009fe3] focus:ring-2 focus:ring-[#009fe3]/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs & Pricing Legend */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          {displayTabs.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0c3b74] text-white shadow-md shadow-blue-950/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Pricing tier quick guide badge */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-800 bg-white px-5 py-2.5 rounded-2xl border border-blue-100 shadow-sm shrink-0">
          <span className="text-slate-600">Detal: 1 unidad</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#009fe3] font-semibold">x3 piezas: Precio promo</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">Mayorista: desde 6 piezas 🔥</span>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="py-20 px-4 text-center rounded-3xl bg-white border border-slate-200/90 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#009fe3]/10 text-[#009fe3] flex items-center justify-center mx-auto">
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900">
            Catálogo en Preparación Textil
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Estamos cargando las nuevas prendas de confección venezolana. Si deseas un pedido a la medida o cotización al mayor, puedes contactarnos directamente al taller.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/584241282108?text=Hola%20Ezer%20Sport,%20deseo%20consultar%20modelos%20disponibles"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#009fe3] hover:bg-[#0082ba] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>Consultar al Taller por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="text-base font-medium">No se encontraron prendas con esa búsqueda.</p>
          <button
            onClick={() => {
              setSelectedCategory('todos');
              setSearchQuery('');
            }}
            className="mt-3 text-sm text-[#009fe3] underline font-bold cursor-pointer"
          >
            Limpiar filtros y ver todas las prendas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentRate={currentRate}
              onSelectProduct={(p) => setSelectedProductModal(p)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProductModal}
        currentRate={currentRate}
        onClose={() => setSelectedProductModal(null)}
      />

      {/* Drawers & Modals */}
      <CartDrawer onOpenCheckout={() => setCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </section>
  );
};
