import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  alt: string;
  link: string;
}

// Los enlaces "#cat-<slug>" abren el catálogo ya filtrado por esa categoría.
const categories: CategoryItem[] = [
  {
    id: 'pijamas',
    title: 'Pijamas',
    subtitle: 'Pijamas de algodón para el descanso de los pequeños',
    badge: 'Favorito infantil',
    image: '/images/pijama-ninos-mickey.webp',
    alt: 'Pijamas para niños de algodón confeccionadas en Venezuela',
    link: '/#cat-pijamas',
  },
  {
    id: 'ninos',
    title: 'Conjuntos infantiles',
    subtitle: 'Suéteres, faldas y conjuntos coordinados para niñas y niños',
    badge: 'Nueva colección',
    image: '/images/conjunto-nina-conejita.webp',
    alt: 'Conjunto infantil para niña con suéter y falda',
    link: '/#cat-ninos',
  },
  {
    id: 'chaquetas',
    title: 'Chaquetas y deportiva',
    subtitle: 'Cortavientos con capucha, monos joggers y ropa para entrenar',
    badge: 'De fábrica',
    image: '/images/chaqueta-cortavientos.webp',
    alt: 'Chaqueta cortavientos impermeable con capucha',
    link: '/#cat-chaquetas',
  },
  {
    id: 'mayorista',
    title: 'Ventas al mayor',
    subtitle: 'Precios de taller desde 6 piezas surtidas',
    badge: 'Para tu negocio',
    image: '/images/taller-confeccion.webp',
    alt: 'Taller de confección textil Ezer Sport en Los Teques',
    link: '#mandalo-a-hacer',
  },
];

/** Componente 100% estático (sin JS en el navegador). */
export const BigCategoryBanners: React.FC = () => (
  <section
    id="categorias-principales"
    aria-labelledby="categorias-titulo"
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4 sm:pt-16"
  >
    <div data-reveal="fade-in" className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-1">
      <span className="font-display font-bold text-sm sm:text-base text-[#009fe3] uppercase tracking-wider block">
        Explora por departamentos
      </span>
      <h2
        id="categorias-titulo"
        className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight"
      >
        Categorías de confección
      </h2>
    </div>

    {/* 2 columnas en móvil, 4 en escritorio: todo visible con entrada escalonada fluida */}
    <div data-reveal-group className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={cat.link}
          data-reveal="zoom-in"
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] bg-slate-900 block shadow-md border border-slate-200 hover:border-[#009fe3] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <img
            src={cat.image}
            alt={cat.alt}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
            width="600"
            height="800"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#d0d709] uppercase block mb-1">
                {cat.badge}
              </span>
              <h3 className="font-display font-black text-base sm:text-xl lg:text-2xl text-white leading-tight drop-shadow">
                {cat.title}
              </h3>
              <p className="hidden sm:block text-slate-200 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                {cat.subtitle}
              </p>
            </div>
            <span className="hidden sm:flex w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center text-white shrink-0 group-hover:bg-[#009fe3] transition-colors border border-white/20">
              <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
            </span>
          </div>
        </a>
      ))}
    </div>
  </section>
);
