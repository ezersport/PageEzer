import React, { useEffect, useState } from 'react';
import { ShoppingBag, Truck, Menu, X, Ruler, Scissors } from 'lucide-react';
import {
  getCartItems,
  getCurrentRate,
  fetchCurrentRateFromSupabase,
  calculateCartSummary,
  formatBs,
  emitEvent,
  getAppConfig,
} from '../lib/store';
import type { CartItem, AppConfig } from '../types';
import { EzLogo } from './EzLogo';

interface NavLink {
  label: string;
  mobileLabel: string;
  href: string;
  /** Si existe, el enlace abre el catálogo filtrado por esta categoría */
  category?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

// Los enlaces usan "/#..." para que también funcionen desde las fichas de producto.
const NAV_LINKS: NavLink[] = [
  { label: 'Catálogo', mobileLabel: 'Catálogo completo', href: '/#catalogo' },
  { label: 'Niños', mobileLabel: '👶 Ropa infantil (tallas 2 a 14)', href: '/#cat-ninos', category: 'ninos' },
  { label: 'Pijamas', mobileLabel: '🌙 Pijamas', href: '/#cat-pijamas', category: 'pijamas' },
  { label: 'Chaquetas', mobileLabel: '🧥 Chaquetas y cortavientos', href: '/#cat-chaquetas', category: 'chaquetas' },
  {
    label: '«Mándalo a Hacer»',
    mobileLabel: '✂️ «¡Mándalo a Hacer!» (personalizados)',
    href: '/#mandalo-a-hacer',
    icon: <Scissors className="w-4 h-4 text-amber-500" aria-hidden="true" />,
    highlight: true,
  },
  {
    label: 'Entregas',
    mobileLabel: '🛵 Entregas y envíos',
    href: '/#entregas',
    icon: <Truck className="w-4 h-4 text-[#009fe3]" aria-hidden="true" />,
  },
  {
    label: 'Medidas',
    mobileLabel: '📏 Tabla de medidas',
    href: '/#tabla-de-medidas',
    icon: <Ruler className="w-4 h-4 text-[#009fe3]" aria-hidden="true" />,
  },
];

export const Header: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentRate, setCurrentRate] = useState<number>(76.5);
  const [appConfig, setAppConfig] = useState<AppConfig>({ tasa_bcv: 76.5, entregas_caracas_activas: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setCartItems(getCartItems());
    setCurrentRate(getCurrentRate());
    setAppConfig(getAppConfig());

    fetchCurrentRateFromSupabase().then((rate) => {
      if (rate && rate > 0) setCurrentRate(rate);
    });

    const handleCartUpdate = (e: any) => setCartItems(e.detail?.items || getCartItems());
    const handleRateUpdate = (e: any) => setCurrentRate(e.detail?.currentRate || getCurrentRate());
    const handleConfigUpdate = (e: any) => {
      if (e.detail?.config) setAppConfig(e.detail.config);
    };
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener('ezer-cart-updated', handleCartUpdate);
    window.addEventListener('ezer-rate-updated', handleRateUpdate);
    window.addEventListener('ezer-config-updated', handleConfigUpdate);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('ezer-cart-updated', handleCartUpdate);
      window.removeEventListener('ezer-rate-updated', handleRateUpdate);
      window.removeEventListener('ezer-config-updated', handleConfigUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cartSummary = calculateCartSummary(cartItems, currentRate);
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  /** En la home filtra el catálogo sin recargar; en otras páginas navega normal. */
  const handleNavClick = (link: NavLink) => (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (link.category && window.location.pathname === '/') {
      e.preventDefault();
      history.replaceState(null, '', `#cat-${link.category}`);
      emitEvent('ezer-filter-category', { category: link.category });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Barra de anuncios */}
      <div className="bg-[#0c3b74] text-white text-xs sm:text-sm py-2 px-4 tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center lg:justify-between gap-2">
          <p className="flex items-center gap-2 min-w-0 truncate">
            {appConfig.entregas_caracas_activas ? (
              <>
                <span className="flex h-2 w-2 rounded-full bg-[#d0d709] animate-pulse shrink-0" />
                <span className="font-semibold text-[#d0d709] shrink-0">¡Entregas los sábados!</span>
                <span className="text-blue-100 truncate">
                  Caracas: <strong className="text-white">Plaza Venezuela</strong>
                  <span className="hidden sm:inline">
                    {' '}• <strong className="text-white">Los Teques y San Antonio</strong> con delivery
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="flex h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <span className="font-bold text-rose-300 shrink-0">Entregas en Caracas en pausa</span>
                <span className="text-blue-100 truncate hidden sm:inline">
                  • Delivery activo en <strong className="text-white">Los Teques y San Antonio</strong>
                </span>
              </>
            )}
          </p>

          <p className="hidden lg:flex items-center gap-2 text-xs text-blue-100 font-medium shrink-0">
            <Truck className="w-3.5 h-3.5 text-[#d0d709]" aria-hidden="true" />
            <span>Envíos a toda Venezuela (MRW, Zoom, Tealca)</span>
          </p>
        </div>
      </div>

      {/* Navegación principal */}
      <nav
        aria-label="Navegación principal"
        className={`w-full transition-colors duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center group shrink-0" aria-label="Ezer Sport - Inicio">
            <EzLogo className="w-11 h-9 sm:w-12 sm:h-10" />
          </a>

          {/* Escritorio: solo desde 1024px para que los 7 enlaces no se amontonen en tablets */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick(link)}
                  className={`text-sm xl:text-base transition-colors hover:text-[#009fe3] flex items-center gap-1.5 whitespace-nowrap ${
                    link.highlight ? 'font-semibold text-[#0c3b74]' : 'font-medium text-slate-700'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => emitEvent('ezer-open-cart')}
              className="relative flex items-center gap-3 bg-[#0c3b74] hover:bg-[#092d59] text-white px-3.5 sm:px-4 py-2.5 rounded-2xl text-sm font-medium transition-all shadow-sm active:scale-95"
              aria-label={totalUnits > 0 ? `Ver carrito (${totalUnits} prendas)` : 'Ver carrito de compras'}
            >
              <span className="relative">
                <ShoppingBag className="w-5 h-5 text-[#d0d709]" aria-hidden="true" />
                {totalUnits > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d0d709] text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalUnits}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline font-semibold">
                {totalUnits > 0 ? formatBs(cartSummary.subtotalBs) : 'Mi carrito'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="menu-movil"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil / tablet */}
        {mobileMenuOpen && (
          <ul
            id="menu-movil"
            className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 shadow-lg max-h-[calc(100svh-7rem)] overflow-y-auto"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick(link)}
                  className={`block py-3 text-base border-b border-slate-100 last:border-0 hover:text-[#009fe3] ${
                    link.highlight ? 'font-semibold text-[#0c3b74]' : 'font-medium text-slate-800'
                  }`}
                >
                  {link.mobileLabel}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};
