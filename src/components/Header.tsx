import React, { useEffect, useState } from 'react';
import { ShoppingBag, Truck, Menu, X, Ruler } from 'lucide-react';
import {
  getCartItems,
  getCurrentRate,
  fetchCurrentRateFromSupabase,
  calculateCartSummary,
  formatBs,
  emitEvent,
} from '../lib/store';
import type { CartItem } from '../types';
import { EzLogo } from './EzLogo';

export const Header: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentRate, setCurrentRate] = useState<number>(76.50);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setCartItems(getCartItems());
    setCurrentRate(getCurrentRate());

    // Fetch fresh official rate from Supabase
    fetchCurrentRateFromSupabase().then((rate) => {
      if (rate && rate > 0) setCurrentRate(rate);
    });

    const handleCartUpdate = (e: any) => {
      setCartItems(e.detail?.items || getCartItems());
    };

    const handleRateUpdate = (e: any) => {
      setCurrentRate(e.detail?.currentRate || getCurrentRate());
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('ezer-cart-updated', handleCartUpdate);
    window.addEventListener('ezer-rate-updated', handleRateUpdate);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('ezer-cart-updated', handleCartUpdate);
      window.removeEventListener('ezer-rate-updated', handleRateUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cartSummary = calculateCartSummary(cartItems, currentRate);
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#0c3b74] text-white text-xs sm:text-sm py-2 px-4 font-normal tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis mx-auto sm:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-[#d0d709] animate-pulse"></span>
            <span className="font-medium text-[#d0d709]">¡Entregas los Sábados!</span>
            <span className="text-blue-200 hidden sm:inline">•</span>
            <span className="text-blue-100">
              Caracas: <strong className="text-white">Plaza Venezuela (Punto de Encuentro)</strong> | Gratis en <strong className="text-white">Los Teques (Metro)</strong> | San Antonio <strong className="text-white">(Altos Mirandinos)</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-blue-100 font-medium">
            <Truck className="w-3.5 h-3.5 text-[#d0d709]" />
            <span>Envíos a toda Venezuela (MRW, Zoom, Tealca)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar: Clean & Luminous Light Design */}
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="/" className="flex items-center group">
            <EzLogo className="w-12 h-10" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#catalogo"
              className="text-sm lg:text-base font-medium text-slate-700 hover:text-[#009fe3] transition-colors"
            >
              Catálogo
            </a>
            <a
              href="#catalogo"
              className="text-sm lg:text-base font-medium text-slate-700 hover:text-[#009fe3] transition-colors flex items-center gap-1.5"
            >
              Niños
              <span className="text-[11px] bg-blue-50 text-[#009fe3] px-2 py-0.5 rounded-full font-bold border border-blue-100">
                1 a 10
              </span>
            </a>
            <a
              href="#catalogo"
              className="text-sm lg:text-base font-medium text-slate-700 hover:text-[#009fe3] transition-colors"
            >
              Chaquetas
            </a>
            <a
              href="#catalogo"
              className="text-sm lg:text-base font-medium text-slate-700 hover:text-[#009fe3] transition-colors"
            >
              Pijamas
            </a>
            <a
              href="#mandalo-a-hacer"
              className="text-sm lg:text-base font-semibold text-[#0c3b74] hover:text-[#009fe3] transition-colors flex items-center gap-1"
            >
              <span className="text-amber-500 font-bold">✂️</span>
              <span>«Mándalo a Hacer»</span>
            </a>
            <a
              href="#entregas"
              className="text-sm lg:text-base font-medium text-slate-700 hover:text-[#009fe3] transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-[#009fe3]" />
              <span>Entregas</span>
            </a>
            <a
              href="#tabla-de-medidas"
              className="text-sm lg:text-base font-medium text-slate-700 hover:text-[#009fe3] transition-colors flex items-center gap-1.5"
            >
              <Ruler className="w-4 h-4 text-[#009fe3]" />
              <span>Medidas</span>
            </a>
          </div>

          {/* Cart Trigger Button & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => emitEvent('ezer-open-cart')}
              className="relative flex items-center gap-3 bg-[#0c3b74] hover:bg-[#092d59] text-white px-4 py-2.5 rounded-2xl text-sm font-medium transition-all shadow-sm active:scale-95"
              aria-label="Ver Carrito de Compras"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#d0d709]" />
                {totalUnits > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d0d709] text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalUnits}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {totalUnits > 0 ? (
                  <span className="font-semibold">{formatBs(cartSummary.subtotalBs)}</span>
                ) : (
                  <span>Mi Carrito</span>
                )}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
            <a
              href="#catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-800 hover:text-[#009fe3]"
            >
              Catálogo Completo
            </a>
            <a
              href="#catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-800 hover:text-[#009fe3]"
            >
              👶 Línea Infantil (Mickey GAP, Dino, Jirafita)
            </a>
            <a
              href="#catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-800 hover:text-[#009fe3]"
            >
              🧥 Chaquetas Cortavientos & Hoodies
            </a>
            <a
              href="#catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-800 hover:text-[#009fe3]"
            >
              🌙 Pijamas Familiares a Juego
            </a>
            <a
              href="#mandalo-a-hacer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-[#0c3b74]"
            >
              ✂️ «¡Mándalo a Hacer!» (Personalizados & DTF)
            </a>
            <a
              href="#entregas"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-800 hover:text-[#009fe3]"
            >
              🛵 Entregas (Plaza Venezuela, Los Teques, San Antonio)
            </a>
            <a
              href="#tabla-de-medidas"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#009fe3] font-semibold"
            >
              📏 Tabla de Medidas & Tallas (Guía en cm)
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};
