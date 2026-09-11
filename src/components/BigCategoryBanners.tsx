import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  link: string;
}

const categories: CategoryItem[] = [
  {
    id: 'pijamas',
    title: 'PIJAMAS',
    subtitle: 'Pijamas de algodón, franelas y shorts estampados para el descanso de los pequeños',
    badge: 'Favorito Infantil ⭐',
    image: '/images/pijama-ninos-mickey.webp',
    link: '#catalogo',
  },
  {
    id: 'ninos',
    title: 'CONJUNTOS INFANTILES',
    subtitle: 'Suéteres, faldas tableadas y conjuntos coordinados confeccionados con amor y detalle',
    badge: 'Nueva Colección 🌸',
    image: '/images/conjunto-nina-conejita.webp',
    link: '#catalogo',
  },
  {
    id: 'chaquetas',
    title: 'CHAQUETAS & ROPA DEPORTIVA',
    subtitle: 'Cortavientos impermeables con capucha, monos joggers y prendas activas para entrenamiento',
    badge: 'Prendas de Fábrica ⚡',
    image: '/images/chaqueta-cortavientos.webp',
    link: '#catalogo',
  },
  {
    id: 'mayorista',
    title: 'VENTAS AL MAYOR',
    subtitle: 'Precios directos de taller a partir de 6 piezas surtidas para tiendas y revendedores',
    badge: 'Impulsa tu Marca 📦',
    image: '/images/taller-confeccion.webp',
    link: '#mandalo-a-hacer',
  },
];

export const BigCategoryBanners: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categorias-principales"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 overflow-hidden"
    >
      {/* Header with scroll reveal */}
      <div
        className={`text-center max-w-2xl mx-auto mb-12 space-y-2 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <span className="font-display font-bold text-base sm:text-lg text-[#009fe3] uppercase tracking-wider block">
          Explora por Departamentos
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight uppercase">
          CATEGORÍAS DE CONFECCIÓN
        </h2>
      </div>

      {/* Grid with Progressive Staggered Scroll Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, index) => {
          const delayMs = index * 140;

          return (
            <a
              key={cat.id}
              href={cat.link}
              style={{ transitionDelay: `${delayMs}ms` }}
              className={`group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] bg-slate-900 block shadow-xl border-2 border-slate-200 hover:border-[#009fe3] transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-2xl ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}
            >
              {/* Background image with smooth scale on hover */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-95"
                loading="lazy"
                decoding="async"
                width="600"
                height="400"
              />

              {/* Dark gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent transition-opacity duration-300 group-hover:via-slate-950/20"></div>

              {/* Giant Bold Typography Over Image */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 z-10">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-bold tracking-wider text-[#d0d709] uppercase block mb-1">
                      {cat.badge}
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tighter uppercase leading-none drop-shadow-lg group-hover:text-blue-200 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-slate-200 text-xs sm:text-sm mt-2 max-w-sm drop-shadow line-clamp-2 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-[#009fe3] group-hover:scale-115 group-hover:rotate-12 transition-all duration-300 shadow-xl border border-white/20">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
