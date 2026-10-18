import type { APIRoute } from 'astro';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { supabase } from '../lib/supabase';

export const prerender = false;

const SITE = 'https://ezersport.com';

export const GET: APIRoute = async () => {
  const productSlugs = new Set<string>();

  // 1. Slugs iniciales de mockData
  INITIAL_PRODUCTS.forEach((p) => {
    if (p.slug) productSlugs.add(p.slug);
  });

  // 2. Slugs frescos de Supabase
  try {
    const { data } = await supabase
      .from('products')
      .select('slug, is_active')
      .eq('is_active', true);

    if (data && Array.isArray(data)) {
      data.forEach((p) => {
        if (p.slug) productSlugs.add(p.slug);
      });
    }
  } catch (err) {
    // Si falla Supabase, se mantiene con INITIAL_PRODUCTS
  }

  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Página principal -->
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Secciones ancla indexables -->
  <url>
    <loc>${SITE}/#catalogo</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE}/#nosotros</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE}/#entregas</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE}/#mandalo-a-hacer</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE}/#tabla-de-medidas</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Fichas individuales de producto para SEO orgánico en Google -->
  ${Array.from(productSlugs)
    .map(
      (slug) => `  <url>
    <loc>${SITE}/producto/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=14400',
    },
  });
};
