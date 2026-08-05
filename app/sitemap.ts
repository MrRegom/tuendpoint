import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { brand } from '@/lib/config/brand';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = brand.url;
  const now = new Date();

  const routes = [
    '',
    '/soluciones',
    '/sectores/salud',
    '/sectores/educacion',
    '/sectores/retail',
    '/sectores/empresas',
    '/sectores/gobierno',
    '/sectores/logistica',
    '/proceso',
    '/nosotros',
    '/contacto',
    '/legal/privacidad',
    '/legal/terminos',
  ];

  return routing.locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7,
    }))
  );
}
