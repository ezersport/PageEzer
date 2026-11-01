import React, { useState, useEffect, useRef } from 'react';
import type { Product, CategoryType, Category } from '../types';
import {
  getProducts,
  getCurrentRate,
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  fetchCurrentRateFromSupabase,
} from '../lib/store';
import { ProductCard } from './ProductCard';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { Search, Scissors, Flame } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentRate, setCurrentRate] = useState<number>(76.50);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 1. Carga inicial síncrona desde caché
    setProducts(getProducts());
    setCurrentRate(getCurrentRate());

    // 2. Revisar si hay categoría en el hash de la URL (#cat-ninos, #cat-pijamas, etc.)
    const checkHashCategory = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#cat-')) {
        const cat = hash.replace('#cat-', '');
        if (cat) {
          setSelectedCategory(cat);
          setTimeout(() => {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };
    checkHashCategory();

    // 3. Carga en tiempo real directamente desde Supabase
    fetchProductsFromSupabase().then((prods) => {
      if (prods && prods.length > 0) setProducts(prods);
    });

    fetchCategoriesFromSupabase().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });

    fetchCurrentRateFromSupabase().then((rate) => {
      if (rate && rate > 0) setCurrentRate(rate);
    });

    // 4. Suscripción a eventos
    const handleProductsUpdate = (e: any) => {
      if (e.detail?.products) setProducts(e.detail.products);
    };

    const handleCategoriesUpdate = (e: any) => {
      if (e.detail?.categories) setCategories(e.detail.categories);
    };

    const handleRateUpdate = (e: any) => {
      if (e.detail?.currentRate) setCurrentRate(e.detail.currentRate);
    };

    const handleFilterCategory = (e: any) => {
      const cat = e.detail?.category;
      if (cat) {
        setSelectedCategory(cat);
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('ezer-products-updated', handleProductsUpdate);
    window.addEventListener('ezer-categories-updated', handleCategoriesUpdate);
    window.addEventListener('ezer-rate-updated', handleRateUpdate);
    window.addEventListener('ezer-filter-category', handleFilterCategory);
    window.addEventListener('hashchange', checkHashCategory);

    return () => {
      window.removeEventListener('ezer-products-updated', handleProductsUpdate);
      window.removeEventListener('ezer-categories-updated', handleCategoriesUpdate);
      window.removeEventListener('ezer-rate-updated', handleRateUpdate);
      window.removeEventListener('ezer-filter-category', handleFilterCategory);
      window.removeEventListener('hashchange', checkHashCategory);
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

  // Pestañas dinámicas
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
    <section
      ref={sectionRef}
      id="catalogo"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-8 sm:space-y-10"
    >
      {/* Encabezado y buscador */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#009fe3]"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#009fe3]">
              Directo de Fábrica • Los Teques
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
            Colección de Confección
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-base mt-1">
            Prendas de algodón y materiales térmicos confeccionadas para durar.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar prenda, tela, diseño..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#009fe3] focus:ring-2 focus:ring-[#009fe3]/20 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Guía rápida de escalas de precio (responsiva) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:px-5 rounded-2xl bg-blue-50/70 border border-blue-100/90 text-xs sm:text-sm text-slate-800 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-[#0c3b74]">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Precios de fábrica por volumen:</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-medium text-xs sm:text-sm">
          <span className="text-slate-600 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200/80">
            Detal: 1 pza
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[#009fe3] font-semibold bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border border-blue-100">
            x3 pzas: Promo
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border border-emerald-200">
            Mayor: 6+ pzs 🔥
          </span>
        </div>
      </div>

      {/* Pestañas de categorías con scroll horizontal suave */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto w-full pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {displayTabs.map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
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

      {/* Grid de productos responsivo: 2 columnas en móvil, 3 en tablet, 4 en desktop */}
      {products.length === 0 ? (
        <div className="py-20 px-4 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#009fe3]/10 text-[#009fe3] flex items-center justify-center mx-auto">
            <Scissors className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
            Catálogo en Preparación Textil
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Estamos cargando las nuevas prendas de confección venezolana. Si deseas un pedido a la medida o cotización al mayor, puedes contactarnos directamente al taller.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/584241282108?text=Hola%20Ezer%20Sport,%20deseo%20consultar%20modelos%20disponibles"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#009fe3] hover:bg-[#0082ba] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <span>Consultar al Taller por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="text-sm sm:text-base font-medium">No se encontraron prendas con esa búsqueda o filtro.</p>
          <button
            onClick={() => {
              setSelectedCategory('todos');
              setSearchQuery('');
            }}
            className="mt-3 text-xs sm:text-sm text-[#009fe3] underline font-bold cursor-pointer"
          >
            Limpiar filtros y ver todas las prendas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentRate={currentRate}
            />
          ))}
        </div>
      )}

      {/* Drawers & Modals */}
      <CartDrawer onOpenCheckout={() => setCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </section>
  );
};
