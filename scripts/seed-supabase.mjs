import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkuorsixjqnqcpzcpaok.supabase.co';
const supabaseKey = 'sb_publishable_wgFJaN9pnuHT3keBH42uPg_-ZPg6e17';
const supabase = createClient(supabaseUrl, supabaseKey);

export const SEED_CATEGORIES = [
  {
    id: 'cat-ninos',
    nombre: 'Conjuntos y Ropa Infantil',
    slug: 'ninos',
    descripcion: 'Conjuntos con capucha afelpados, monos joggers estampados DTF y prendas térmicas para niños y niñas.',
    activa: true,
    icono: 'Baby',
    orden: 1,
  },
  {
    id: 'cat-pijamas',
    nombre: 'Pijamas Familiares & Infantiles',
    slug: 'pijamas',
    descripcion: 'Pijamas térmicas en algodón afelpado, enterizas para niños y conjuntos combinados para toda la familia.',
    activa: true,
    icono: 'Moon',
    orden: 2,
  },
  {
    id: 'cat-uniformes',
    nombre: 'Uniformes Escolares & Deportivos',
    slug: 'uniformes',
    descripcion: 'Chemises en piqué, franelas escolares en algodón, monos deportivos y uniformes para colegios e instituciones.',
    activa: true,
    icono: 'GraduationCap',
    orden: 3,
  },
  {
    id: 'cat-sueteres',
    nombre: 'Suéteres & Hoodies Afelpados',
    slug: 'sueteres',
    descripcion: 'Suéteres afelpados con capucha unisex, corte regular y oversize con bolsillo canguro y cordones.',
    activa: true,
    icono: 'Shirt',
    orden: 4,
  },
  {
    id: 'cat-monos',
    nombre: 'Monos Joggers & Deportivos',
    slug: 'monos',
    descripcion: 'Monos deportivos con puños elásticos acanalados, bolsillos laterales profundos y pretina reforzada.',
    activa: true,
    icono: 'Layers',
    orden: 5,
  },
  {
    id: 'cat-deportiva',
    nombre: 'Ropa Deportiva Activa',
    slug: 'ropa-deportiva',
    descripcion: 'Prendas de alto rendimiento para entrenamiento, microfibra ligera, chaquetas cortavientos y licras.',
    activa: true,
    icono: 'Flame',
    orden: 6,
  },
  {
    id: 'cat-camisas',
    nombre: 'Camisas, Chemises & Franelas',
    slug: 'camisas',
    descripcion: 'Franelas en algodón peinado y poliéster para sublimación, vinil textil y personalizaciones al mayor.',
    activa: true,
    icono: 'Sparkles',
    orden: 7,
  },
];

export const SEED_PRODUCTS = [
  {
    id: 'prod-pijama-termica-kids',
    codigo_sku: 'EZ-PIJ-001',
    nombre: 'Pijama Térmica para Niños Afelpada Osito Polar',
    slug: 'pijama-termica-para-ninos-afelpada-osito-polar',
    categoria: 'pijamas',
    tela_material: 'Algodón Térmico Afelpado Perchado (Antialérgico)',
    descripcion: 'Pijama de dos piezas para niños y niñas en algodón afelpado supersuave. Mantiene a los pequeños abrigados con puños acanalados en muñecas y tobillos para evitar que se suba la tela mientras duermen. Costuras planas confortables que no irritan la piel.',
    precio_detal_usd: 12.00,
    precio_3_piezas_usd: 10.00,
    precio_mayor_usd: 8.50,
    costo_produccion_usd: 4.80,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/pijamas-familiares.webp',
    imagenes_galeria: ['/images/conjunto-jirafita-peach.webp', '/images/conjunto-ninos-mickey.webp'],
    activo: true,
    destacado: true,
    variants: [
      { id: 'var-pij-t2-azul', talla: '2-4', tipo_variante: 'estampado', nombre_variante: 'Azul Nube Estampado', color_base: 'Azul Nube', codigo_hex: '#38bdf8', stock_disponible: 18, stock_minimo_alerta: 3 },
      { id: 'var-pij-t6-azul', talla: '6-8', tipo_variante: 'estampado', nombre_variante: 'Azul Nube Estampado', color_base: 'Azul Nube', codigo_hex: '#38bdf8', stock_disponible: 15, stock_minimo_alerta: 3 },
      { id: 'var-pij-t10-rosa', talla: '10-12', tipo_variante: 'estampado', nombre_variante: 'Rosa Pastel Ositos', color_base: 'Rosa Pastel', codigo_hex: '#f472b6', stock_disponible: 12, stock_minimo_alerta: 3 },
      { id: 'var-pij-t4-gris', talla: '4-6', tipo_variante: 'unicolor', nombre_variante: 'Gris Perla Suave', color_base: 'Gris Jaspe', codigo_hex: '#94a3b8', stock_disponible: 10, stock_minimo_alerta: 2 },
    ],
  },
  {
    id: 'prod-uniforme-escolar-combo',
    codigo_sku: 'EZ-UNI-001',
    nombre: 'Uniforme Escolar Completo: Chemise Piqué + Mono Deportivo',
    slug: 'uniforme-escolar-completo-chemise-pique-mono-deportivo',
    categoria: 'uniformes',
    tela_material: 'Chemise Piqué Algodón 65/35 & Mono en Algodón Afelpado Institucional',
    descripcion: 'Combo institucional escolar duradero y resistente a lavadas diarias. Chemise con cuello tejido firme y botones reforzados. Mono deportivo escolar con costuras dobles, bolsillos y elástico de alta densidad que no pierde ajuste. Ideal para escuelas y liceos.',
    precio_detal_usd: 16.00,
    precio_3_piezas_usd: 14.00,
    precio_mayor_usd: 11.50,
    costo_produccion_usd: 6.20,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/kids-sweaters.webp',
    imagenes_galeria: ['/images/kids-outfit-set.webp'],
    activo: true,
    destacado: true,
    variants: [
      { id: 'var-uni-t4-blanco-azul', talla: '4', tipo_variante: 'unicolor', nombre_variante: 'Blanco / Azul Marino', color_base: 'Azul Marino', codigo_hex: '#0f172a', stock_disponible: 25, stock_minimo_alerta: 5 },
      { id: 'var-uni-t8-blanco-azul', talla: '8', tipo_variante: 'unicolor', nombre_variante: 'Blanco / Azul Marino', color_base: 'Azul Marino', codigo_hex: '#0f172a', stock_disponible: 20, stock_minimo_alerta: 5 },
      { id: 'var-uni-t12-blanco-azul', talla: '12', tipo_variante: 'unicolor', nombre_variante: 'Blanco / Azul Marino', color_base: 'Azul Marino', codigo_hex: '#0f172a', stock_disponible: 18, stock_minimo_alerta: 5 },
      { id: 'var-uni-t14-beige-marron', talla: '14', tipo_variante: 'unicolor', nombre_variante: 'Beige / Marrón Escolar', color_base: 'Beige', codigo_hex: '#d4b996', stock_disponible: 12, stock_minimo_alerta: 3 },
    ],
  },
  {
    id: 'prod-hoodie-sueter-unisex',
    codigo_sku: 'EZ-SUE-001',
    nombre: 'Suéter Hoodie Afelpado con Capucha Unisex (Oversize / Regular)',
    slug: 'sueter-hoodie-afelpado-con-capucha-unisex',
    categoria: 'sueteres',
    tela_material: 'Algodón Fleece Perchado Pesado 280g con Interior Afelpado',
    descripcion: 'El suéter favorito para el frío y el estilo urbano. Capucha forrada con caída perfecta, bolsillo canguro delantero con costura de seguridad y rib acanalado de alta densidad. Disponible tanto para jóvenes como para adultos. Excelente soporte para bordados y DTF.',
    precio_detal_usd: 15.00,
    precio_3_piezas_usd: 12.50,
    precio_mayor_usd: 10.00,
    costo_produccion_usd: 5.50,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/hoodies-unisex.webp',
    imagenes_galeria: ['/images/men-activewear.webp'],
    activo: true,
    destacado: true,
    variants: [
      { id: 'var-sue-s-negro', talla: 'S', tipo_variante: 'unicolor', nombre_variante: 'Negro Azabache', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 20, stock_minimo_alerta: 4 },
      { id: 'var-sue-m-negro', talla: 'M', tipo_variante: 'unicolor', nombre_variante: 'Negro Azabache', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 22, stock_minimo_alerta: 4 },
      { id: 'var-sue-l-negro', talla: 'L', tipo_variante: 'unicolor', nombre_variante: 'Negro Azabache', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 15, stock_minimo_alerta: 3 },
      { id: 'var-sue-m-azul', talla: 'M', tipo_variante: 'unicolor', nombre_variante: 'Azul Royal Ezer', color_base: 'Azul Rey', codigo_hex: '#009fe3', stock_disponible: 14, stock_minimo_alerta: 3 },
      { id: 'var-sue-s-gris', talla: 'S', tipo_variante: 'unicolor', nombre_variante: 'Gris Jaspe Urbano', color_base: 'Gris Jaspe', codigo_hex: '#64748b', stock_disponible: 12, stock_minimo_alerta: 2 },
    ],
  },
  {
    id: 'prod-mono-jogger-deportivo',
    codigo_sku: 'EZ-MON-001',
    nombre: 'Mono Jogger Deportivo Afelpado con Puños Elásticos',
    slug: 'mono-jogger-deportivo-afelpado-con-punos-elasticos',
    categoria: 'monos',
    tela_material: 'Algodón Deportivo con Forro Perchado Térmico',
    descripcion: 'Pantalón tipo mono jogger de corte moderno con puños acanalados elásticos. Dos bolsillos laterales profundos, pretina con elástico ancho y cordón interior de ajuste. Confeccionado con hilo reforzado para máxima durabilidad en actividades físicas o descanso.',
    precio_detal_usd: 10.00,
    precio_3_piezas_usd: 8.50,
    precio_mayor_usd: 7.00,
    costo_produccion_usd: 3.90,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/men-activewear.webp',
    imagenes_galeria: ['/images/hoodies-unisex.webp'],
    activo: true,
    destacado: true,
    variants: [
      { id: 'var-mon-s-negro', talla: 'S', tipo_variante: 'unicolor', nombre_variante: 'Negro Intenso', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 18, stock_minimo_alerta: 3 },
      { id: 'var-mon-m-negro', talla: 'M', tipo_variante: 'unicolor', nombre_variante: 'Negro Intenso', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 25, stock_minimo_alerta: 4 },
      { id: 'var-mon-l-negro', talla: 'L', tipo_variante: 'unicolor', nombre_variante: 'Negro Intenso', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 16, stock_minimo_alerta: 3 },
      { id: 'var-mon-m-azul', talla: 'M', tipo_variante: 'unicolor', nombre_variante: 'Azul Marino Escolar/Casual', color_base: 'Azul Marino', codigo_hex: '#0f172a', stock_disponible: 20, stock_minimo_alerta: 4 },
      { id: 'var-mon-l-gris', talla: 'L', tipo_variante: 'unicolor', nombre_variante: 'Gris Medio Deportivo', color_base: 'Gris', codigo_hex: '#64748b', stock_disponible: 14, stock_minimo_alerta: 3 },
    ],
  },
  {
    id: 'prod-conjunto-mickey-kids',
    codigo_sku: 'EZ-CONJ-001',
    nombre: 'Conjunto Infantil Mickey Mouse Sudadera con Capucha & Mono',
    slug: 'conjunto-infantil-mickey-mouse-sudadera-con-capucha-y-mono',
    categoria: 'ninos',
    tela_material: 'Algodón Afelpado Nacional 80/20 con Estampado DTF Premium',
    descripcion: 'Conjunto completo de 2 piezas (sudadera con capucha forrada y mono jogger coordinado) para niños. Estampado de Mickey Mouse en DTF de alta resistencia a lavados. Tela gruesa y abrigadora confeccionada en nuestro taller en Los Teques.',
    precio_detal_usd: 15.00,
    precio_3_piezas_usd: 12.00,
    precio_mayor_usd: 10.00,
    costo_produccion_usd: 5.20,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/conjunto-ninos-mickey.webp',
    imagenes_galeria: ['/images/conjunto-dino-kids.webp'],
    activo: true,
    destacado: true,
    variants: [
      { id: 'var-mic-t2-azul', talla: '2', tipo_variante: 'estampado', nombre_variante: 'Mickey Azul Rey', color_base: 'Azul Rey', codigo_hex: '#009fe3', stock_disponible: 12, stock_minimo_alerta: 2 },
      { id: 'var-mic-t4-azul', talla: '4', tipo_variante: 'estampado', nombre_variante: 'Mickey Azul Rey', color_base: 'Azul Rey', codigo_hex: '#009fe3', stock_disponible: 15, stock_minimo_alerta: 3 },
      { id: 'var-mic-t6-rojo', talla: '6', tipo_variante: 'estampado', nombre_variante: 'Mickey Rojo Clásico', color_base: 'Rojo', codigo_hex: '#ef4444', stock_disponible: 10, stock_minimo_alerta: 2 },
      { id: 'var-mic-t8-negro', talla: '8', tipo_variante: 'estampado', nombre_variante: 'Mickey Negro Urbano', color_base: 'Negro', codigo_hex: '#1e293b', stock_disponible: 8, stock_minimo_alerta: 2 },
    ],
  },
  {
    id: 'prod-chaqueta-cortavientos-avila',
    codigo_sku: 'EZ-CHAQ-001',
    nombre: 'Chaqueta Cortavientos Impermeable Ligera Ávila Run',
    slug: 'chaqueta-cortavientos-impermeable-ligera-avila-run',
    categoria: 'ropa-deportiva',
    tela_material: 'Taslan Impermeable Cortavientos con Forro de Malla Transpirable',
    descripcion: 'Chaqueta ligera de alta resistencia contra lluvia fina y viento. Capucha ajustable, cremallera completa sellada y elástico en cintura. Ideal para correr, ciclismo, entrenamientos matutinos o uso urbano diario.',
    precio_detal_usd: 18.00,
    precio_3_piezas_usd: 15.00,
    precio_mayor_usd: 12.50,
    costo_produccion_usd: 7.00,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/chaqueta-cortavientos.webp',
    imagenes_galeria: ['/images/avila-entregas-banner.webp'],
    activo: true,
    destacado: true,
    variants: [
      { id: 'var-chaq-s-negro', talla: 'S', tipo_variante: 'unicolor', nombre_variante: 'Negro Mate', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 10, stock_minimo_alerta: 2 },
      { id: 'var-chaq-m-negro', talla: 'M', tipo_variante: 'unicolor', nombre_variante: 'Negro Mate', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 14, stock_minimo_alerta: 3 },
      { id: 'var-chaq-l-azul', talla: 'L', tipo_variante: 'unicolor', nombre_variante: 'Azul Cobalto Eléctrico', color_base: 'Azul', codigo_hex: '#2563eb', stock_disponible: 12, stock_minimo_alerta: 2 },
    ],
  },
  {
    id: 'prod-conjunto-dino-aventura',
    codigo_sku: 'EZ-DINO-001',
    nombre: 'Conjunto Dinosaurio Aventura Sudadera & Jogger Kids',
    slug: 'conjunto-dinosaurio-aventura-sudadera-y-jogger-kids',
    categoria: 'ninos',
    tela_material: 'Algodón Fleece Perchado Térmico con Estampado DTF',
    descripcion: 'Prenda infantil con diseño divertido de dinosaurio, combinando tonos tierra y capucha reforzada. Mono jogger con bolsillos laterales funcionales y puños acanalados ajustados. Hecho a prueba de juegos y saltos infantiles.',
    precio_detal_usd: 14.00,
    precio_3_piezas_usd: 11.50,
    precio_mayor_usd: 9.50,
    costo_produccion_usd: 4.90,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/conjunto-dino-kids.webp',
    imagenes_galeria: ['/images/conjunto-ninos-mickey.webp'],
    activo: true,
    destacado: false,
    variants: [
      { id: 'var-dino-t2-verde', talla: '2-3', tipo_variante: 'estampado', nombre_variante: 'Verde Aventura', color_base: 'Verde Oliva', codigo_hex: '#65a30d', stock_disponible: 15, stock_minimo_alerta: 3 },
      { id: 'var-dino-t4-verde', talla: '4-5', tipo_variante: 'estampado', nombre_variante: 'Verde Aventura', color_base: 'Verde Oliva', codigo_hex: '#65a30d', stock_disponible: 18, stock_minimo_alerta: 3 },
      { id: 'var-dino-t6-azul', talla: '6-7', tipo_variante: 'estampado', nombre_variante: 'Azul Dino', color_base: 'Azul Petróleo', codigo_hex: '#0284c7', stock_disponible: 12, stock_minimo_alerta: 2 },
    ],
  },
  {
    id: 'prod-conjunto-jirafita-peach',
    codigo_sku: 'EZ-JIR-001',
    nombre: 'Conjunto Delicado Jirafita Peach para Niña (2 Piezas)',
    slug: 'conjunto-delicado-jirafita-peach-para-nina',
    categoria: 'ninos',
    tela_material: 'Algodón Suave Peinado con Forro Ligero',
    descripcion: 'Conjunto dulce y abrigador en tono durazno / peach con estampado delicado de jirafita. Suéter con puños elásticos suaves y mono jogger con cinturilla elástica ergonómica que no aprieta la pancita.',
    precio_detal_usd: 14.00,
    precio_3_piezas_usd: 11.50,
    precio_mayor_usd: 9.50,
    costo_produccion_usd: 4.80,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/conjunto-jirafita-peach.webp',
    imagenes_galeria: ['/images/pijamas-familiares.webp'],
    activo: true,
    destacado: false,
    variants: [
      { id: 'var-jir-t2-peach', talla: '2', tipo_variante: 'estampado', nombre_variante: 'Peach Melocotón', color_base: 'Melocotón', codigo_hex: '#fb923c', stock_disponible: 16, stock_minimo_alerta: 3 },
      { id: 'var-jir-t4-peach', talla: '4', tipo_variante: 'estampado', nombre_variante: 'Peach Melocotón', color_base: 'Melocotón', codigo_hex: '#fb923c', stock_disponible: 14, stock_minimo_alerta: 3 },
      { id: 'var-jir-t6-crema', talla: '6', tipo_variante: 'estampado', nombre_variante: 'Crema Vainilla', color_base: 'Crema', codigo_hex: '#fef08a', stock_disponible: 10, stock_minimo_alerta: 2 },
    ],
  },
  {
    id: 'prod-camisa-franela-algodon',
    codigo_sku: 'EZ-FRA-001',
    nombre: 'Franela en Algodón Peinado 100% Cuello Redondo para Estampados',
    slug: 'franela-en-algodon-peinado-cuello-redondo-para-estampados',
    categoria: 'camisas',
    tela_material: '100% Algodón Peinado 24/1 Suave y Fresco',
    descripcion: 'Franela básica premium de confección nacional con tapa costura de hombro a hombro. Ideal para uso diario, uniformes corporativos, eventos y personalizaciones en serigrafía, vinil o DTF. No destiñe ni encoge.',
    precio_detal_usd: 6.00,
    precio_3_piezas_usd: 5.00,
    precio_mayor_usd: 4.00,
    costo_produccion_usd: 2.20,
    disponibilidad: 'inmediato',
    dias_confeccion: 0,
    imagen_principal: '/images/taller-confeccion.webp',
    imagenes_galeria: ['/images/ezer-logo.webp'],
    activo: true,
    destacado: false,
    variants: [
      { id: 'var-fra-s-blanco', talla: 'S', tipo_variante: 'unicolor', nombre_variante: 'Blanco Óptico', color_base: 'Blanco', codigo_hex: '#ffffff', stock_disponible: 30, stock_minimo_alerta: 5 },
      { id: 'var-fra-m-blanco', talla: 'M', tipo_variante: 'unicolor', nombre_variante: 'Blanco Óptico', color_base: 'Blanco', codigo_hex: '#ffffff', stock_disponible: 35, stock_minimo_alerta: 5 },
      { id: 'var-fra-l-blanco', talla: 'L', tipo_variante: 'unicolor', nombre_variante: 'Blanco Óptico', color_base: 'Blanco', codigo_hex: '#ffffff', stock_disponible: 25, stock_minimo_alerta: 5 },
      { id: 'var-fra-m-negro', talla: 'M', tipo_variante: 'unicolor', nombre_variante: 'Negro Azabache', color_base: 'Negro', codigo_hex: '#111827', stock_disponible: 30, stock_minimo_alerta: 5 },
    ],
  },
];

async function seedDatabase() {
  console.log('🚀 Iniciando Seed en Supabase...');

  // 1. Sembrar Categorías
  for (const cat of SEED_CATEGORIES) {
    const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'id' });
    if (error) {
      console.error(`Error al insertar categoría ${cat.nombre}:`, error.message);
    } else {
      console.log(`✓ Categoría lista: ${cat.nombre}`);
    }
  }

  // 2. Sembrar Productos y Variantes
  for (const prod of SEED_PRODUCTS) {
    const { variants, ...prodData } = prod;

    const { error: prodErr } = await supabase.from('products').upsert(prodData, { onConflict: 'id' });
    if (prodErr) {
      console.error(`Error al insertar producto ${prod.nombre}:`, prodErr.message);
      continue;
    }
    console.log(`✓ Producto guardado: ${prod.nombre}`);

    // Limpiar variantes anteriores de este producto e insertar las nuevas
    await supabase.from('product_variants').delete().eq('producto_id', prod.id);

    if (variants && variants.length > 0) {
      const varsWithProdId = variants.map(v => ({
        ...v,
        producto_id: prod.id,
      }));
      const { error: varErr } = await supabase.from('product_variants').insert(varsWithProdId);
      if (varErr) {
        console.error(`  x Error al insertar variantes para ${prod.nombre}:`, varErr.message);
      } else {
        console.log(`  ✓ ${variants.length} variantes registradas.`);
      }
    }
  }

  console.log('🎉 Seed de Supabase completado con éxito.');
}

seedDatabase();
