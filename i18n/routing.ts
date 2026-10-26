import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/soluciones': '/soluciones',
    '/sectores/[sector]': '/sectores/[sector]',
    '/proceso': '/proceso',
    '/nosotros': '/nosotros',
    '/contacto': '/contacto',
    '/cotizador': '/cotizador',
    '/legal/privacidad': '/legal/privacidad',
    '/legal/terminos': '/legal/terminos',
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
