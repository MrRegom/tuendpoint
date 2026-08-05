# ARCHITECTURE.md — Guía técnica para developers e IA

Documento de arquitectura del proyecto Regom. Está pensado para que **un nuevo developer o un asistente de IA (Claude, GPT, Cursor, etc.) pueda entender el proyecto, hacer cambios y extenderlo sin perder tiempo**.

---

## 1. Resumen ejecutivo en una línea

**Next.js 14 App Router + TypeScript strict + Tailwind + Framer Motion + next-intl** — sitio corporativo bilingüe con datos estáticos tipados, sistema de diseño custom basado en tokens, animaciones suaves y arquitectura modular.

---

## 2. Cómo está hecho el routing

### Estructura de URLs

```
/                                   → Español (default locale, sin prefijo)
/en                                 → Inglés
/[locale]/soluciones                → Catálogo
/[locale]/sectores/[sector]         → Vertical dinámica (6 sectores)
/[locale]/proceso                   → Metodología
/[locale]/nosotros                  → About
/[locale]/contacto                  → Formulario
/[locale]/legal/[doc]               → Páginas legales
```

### Definición del routing

**Archivo**: `i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',  // /soluciones (es), /en/soluciones (en)
  pathnames: {
    '/': '/',
    '/soluciones': '/soluciones',
    '/sectores/[sector]': '/sectores/[sector]',
    '/proceso': '/proceso',
    '/nosotros': '/nosotros',
    '/contacto': '/contacto',
    '/legal/privacidad': '/legal/privacidad',
    '/legal/terminos': '/legal/terminos',
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

**Nota para IA**: `localePrefix: 'as-needed'` significa que el español no tiene prefijo (`/soluciones`) pero el inglés sí (`/en/soluciones`). Esto es lo más SEO-friendly para mercado primario en español.

### Middleware

**Archivo**: `middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

El middleware detecta el locale del usuario (header `Accept-Language`) y redirige a la URL correcta.

---

## 3. Sistema de tipos

Todo está estrictamente tipado. Los datos viven en `lib/data/*.ts` con tipos exportados.

### Tipos de datos clave

```typescript
// lib/data/sectors.ts
export type SectorId = 'salud' | 'educacion' | 'retail' | 'empresas' | 'gobierno' | 'logistica';

export interface Sector {
  id: SectorId;
  name: { es: string; en: string };
  description: { es: string; en: string };
  longDescription: { es: string; en: string };
  image: string;
  highlights: { es: string[]; en: string[] };
}

// lib/data/solutions.ts
export type SolutionOrigin = 'proven' | 'template';

export interface Solution {
  id: string;
  name: { es: string; en: string };
  sector: SectorId;
  shortDescription: { es: string; en: string };
  longDescription: { es: string; en: string };
  features: { es: string[]; en: string[] };
  origin: SolutionOrigin;
  image: string;
}
```

### Patrón de tipos bilingüe

Todos los textos que se muestran al usuario tienen estructura `{ es: string; en: string }`. Esto permite:
- Type safety en compile-time
- Autocomplete en el editor
- Refactor seguro

**Helper para acceder según locale**:
```typescript
const locale = useLocale() as 'es' | 'en';
const name = sector.name[locale];
```

---

## 4. Cómo agregar contenido

### Agregar una nueva solución

1. Abrir `lib/data/solutions.ts`
2. Agregar objeto en el array `solutions`:

```typescript
{
  id: 'nueva-solucion',
  name: { es: 'Nueva Solución', en: 'New Solution' },
  sector: 'salud',  // ID del sector
  shortDescription: { es: '...', en: '...' },
  longDescription: { es: '...', en: '...' },
  features: {
    es: ['feature 1', 'feature 2'],
    en: ['feature 1', 'feature 2'],
  },
  origin: 'proven',  // o 'template' si es plantilla adaptativa
  image: 'https://images.unsplash.com/...',
}
```

3. **Automáticamente** aparece en:
   - Home `/soluciones` preview
   - Página `/soluciones` (catálogo)
   - Página `/sectores/[sector]` correspondiente

### Agregar un nuevo sector

1. Abrir `lib/data/sectors.ts`
2. Agregar objeto en el array `sectors`:

```typescript
{
  id: 'nuevo-sector',
  name: { es: '...', en: '...' },
  description: { es: '...', en: '...' },
  longDescription: { es: '...', en: '...' },
  image: 'https://...',
  highlights: { es: ['...'], en: ['...'] },
}
```

3. Agregar su ID al tipo `SectorId`:
```typescript
export type SectorId = 'salud' | 'educacion' | '...nuevo-sector';
```

4. Crear archivo dinámico `app/[locale]/sectores/nuevo-sector/page.tsx` (Next.js lo hace accesible automáticamente)

### Agregar un nuevo idioma

1. Crear `messages/[locale].json` (copiar `es.json` y traducir)
2. Actualizar `lib/config/locale.ts`:
   ```typescript
   export const locales: Locale[] = ['es', 'en', 'fr'];
   export const defaultLocale: Locale = 'es';
   ```
3. Actualizar `i18n/routing.ts`:
   ```typescript
   locales: ['es', 'en', 'fr'],
   ```
4. Actualizar `lib/config/locale.ts` `localeNames`:
   ```typescript
   fr: 'Français',
   ```

---

## 5. Patrón de componentes

### Anatomía de un componente

```typescript
'use client';  // Solo si usa estado, animaciones, oestá en el cliente

import { useTranslations, useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ComponentProps {
  // Props tipados
}

export function Component({ ...props }: ComponentProps) {
  const t = useTranslations('namespace');
  const locale = useLocale() as 'es' | 'en';
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-paper py-section-y">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        {/* Contenido */}
      </div>
    </section>
  );
}
```

### Server vs Client Components

- **Server (default)**: páginas, layouts, datos estáticos
- **Client (`'use client'`)**: secciones con animación, formularios, hooks

```
app/[locale]/page.tsx              → Server (home)
app/[locale]/soluciones/page.tsx   → Server (página estática)
components/sections/Hero.tsx       → Client (animación)
components/sections/CatalogGrid.tsx → Client (useState en filtros)
```

### Patrón `Reveal`

Componente client que aplica fade-up al entrar en viewport:

```typescript
<Reveal>
  <h2>Mi título</h2>
</Reveal>

<Reveal delay={0.2}>
  <p>Más contenido</p>
</Reveal>
```

Props:
- `delay`: número en segundos
- `y`: distancia inicial de translateY (default 24px)
- `duration`: ms (default 600)
- `once`: si true, anima solo una vez (default true)

### Patrón `StaggerGroup`

Aplica cascada a hijos directos:

```typescript
<StaggerGroup staggerDelay={0.08}>
  {items.map(item => <Card key={item.id} {...item} />)}
</StaggerGroup>
```

### Patrón `Marquee`

Scroll infinito horizontal:

```typescript
<Marquee duration={50} fade>
  {items.map(item => (
    <span key={item.id}>{item}</span>
  ))}
</Marquee>
```

---

## 6. Sistema de diseño

### CSS Variables (`app/globals.css`)

```css
:root {
  --color-ink: #0A0A0A;
  --color-paper: #FFFFFF;
  --color-accent: #0A2540;
  --color-muted: #6B7280;
  --color-border: #E5E7EB;
  --color-bone: #F5F5F4;
}
```

### Tailwind tokens (`tailwind.config.ts`)

```typescript
extend: {
  colors: {
    ink: '#0A0A0A',
    paper: '#FFFFFF',
    accent: { DEFAULT: '#0A2540', hover: '#0F3057' },
    bone: '#F5F5F4',
    muted: '#6B7280',
    border: '#E5E7EB',
    // ...
  },
  fontFamily: {
    sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    serif: ['var(--font-serif)', 'Georgia', 'serif'],
    mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    'display-2xl': ['clamp(2.75rem, 5.5vw, 5.5rem)', { ... }],
    // ...
  },
  spacing: {
    'section-y': 'clamp(4rem, 7vw, 8rem)',
    // ...
  },
}
```

### Escalas

**Display sizes** (mobile-first, scale sólobria):
- `display-2xl`: hasta 88px (hero)
- `display-xl`: hasta 72px (H1 grandes)
- `display-l`: hasta 52px (H1 secciones)
- `display-m`: hasta 40px (H2)
- `h1`: hasta 32px (H2)
- `h2`: hasta 24px (H3)
- `h3`: hasta 20px (H4)

**Spacing** (8px grid, fluid con clamp):
- `section-y`: 64-128px
- `section-y-sm`: 40-64px
- `gap-blocks`: 32-56px

### Aplicar tipografía

Usar nombres semánticos, no tamaños directos:

```typescript
// ❌ Mal
<h1 className="text-5xl font-bold tracking-tight">

// ✅ Bien
<h1 className="text-display-xl text-ink text-balance">
```

### Aplicar color

```typescript
// ❌ Mal
<div className="text-gray-900 bg-white">

// ✅ Bien
<div className="text-ink bg-paper">
```

---

## 7. Sistema de animaciones

### Curvas de easing

```typescript
// En tailwind.config.ts
transitionTimingFunction: {
  'soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
  'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
}
```

**Cuándo usar cada una**:
- `soft`: transiciones generales, hover
- `editorial`: reveals suaves, scroll-triggered

### Duraciones

```typescript
transitionDuration: {
  '250': '250ms',  // hover, micro-interacciones
  '400': '400ms',  // transiciones de cards
  '600': '600ms',  // reveals, slides
}
```

**Nunca más de 600ms**. El sitio se siente premium porque todo es rápido.

### Reducir motion

Todos los componentes con animación usan `useReducedMotion()`:

```typescript
const reduceMotion = useReducedMotion();

if (reduceMotion) {
  return <staticContent />;
}

return <motion.div animate={...} />;
```

`globals.css` también tiene:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Internacionalización

### Estructura de mensajes

`messages/es.json` y `messages/en.json` tienen **la misma estructura**. Cualquier traducción que falte tira error en build.

```json
{
  "meta": { "title": "...", "description": "..." },
  "nav": { "solutions": "Soluciones", "..." },
  "home": {
    "hero": { "title": "...", "subtitle": "...", "..." },
    "sectors": { "eyebrow": "...", "title": "...", "..." }
  }
}
```

### Uso en componentes

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('home.hero');
<h1>{t('title')}</h1>
<p>{t('subtitle')}</p>
```

### Uso en server components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

### Cambio de locale

```typescript
import { useRouter, usePathname } from '@/i18n/routing';

const router = useRouter();
const pathname = usePathname();  // Ya sin locale

router.replace(pathname, { locale: 'en' });
```

### Navegación tipada

```typescript
import { Link } from '@/i18n/routing';

<Link href="/soluciones">Ver soluciones</Link>
// Preserva el locale actual
```

Para links dinámicos con pathnames parametrizados:
```typescript
<Link href={`/sectores/${sector.id}` as any}>
  {sector.name}
</Link>
```

El `as any` es necesario por la limitación de tipo en rutas dinámicas.

---

## 9. Estructura de las páginas

### Home (`app/[locale]/page.tsx`)

Server Component que compone las secciones:

```typescript
export default function HomePage({ params: { locale } }) {
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <SectorMarquee />
      <Statement />
      <SectorsGrid />
      <Capabilities />
      <Stats />
      <Differentiators />
      <Process />
      <Technologies />
      <CatalogPreview />
      <CTASection />
    </>
  );
}
```

### Página dinámica de sector

`app/[locale]/sectores/[sector]/page.tsx`:

```typescript
export function generateStaticParams() {
  return sectors.map((s) => ({ sector: s.id }));
}

export default async function SectorPage({ params: { locale, sector } }) {
  const sectorData = getSector(sector);
  if (!sectorData) notFound();
  // Render
}
```

Todas las páginas de sector se **prerenderizan estáticamente** en build.

---

## 10. Formulario de contacto

**Archivo**: `components/sections/ContactForm.tsx`

Implementado con:
- `react-hook-form` para manejo de estado
- `zod` para validación de schema
- Server action ready (todavía no conectado)

```typescript
const schema = z.object({
  name: z.string().min(2, 'Requerido'),
  email: z.string().email('Email inválido'),
  company: z.string().min(2, 'Requerido'),
  phone: z.string().optional(),
  sector: z.string().min(1, 'Requerido'),
  message: z.string().min(10, 'Mínimo 10 caracteres'),
});
```

**Para conectar a backend**:
1. Crear `app/api/contact/route.ts` con handler
2. Llamar `fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })`
3. O usar Server Action de Next.js

**Servicio recomendado**: [Resend](https://resend.com) para emails transaccionales.

---

## 11. SEO técnico

### Metadata por página

```typescript
export async function generateMetadata({ params: { locale, sector } }) {
  const t = await getTranslations({ locale, namespace: 'sectores' });
  return {
    title: `${sectorData.name[locale]} — ${t('title')}`,
    description: sectorData.description[locale],
  };
}
```

### Sitemap dinámico

`app/sitemap.ts` itera sobre locales y rutas para generar URLs:

```typescript
const routes = ['', '/soluciones', '/sectores/salud', ...];
return routing.locales.flatMap((locale) =>
  routes.map((route) => ({
    url: `${brand.url}/${locale}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
);
```

### Robots.txt

`app/robots.ts` configura el crawler:

```typescript
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
```

---

## 12. Performance

### Bundle size actual

```
Route (app)                              Size     First Load JS
┌ ○ /_not-found                          138 B          87.3 kB
├ ● /[locale]                            14.3 kB         178 kB
├ ● /[locale]/contacto                   27.3 kB         183 kB
├ ● /[locale]/sectores/[sector]          1.31 kB         141 kB
└ ● /[locale]/soluciones                 3.28 kB         167 kB

First Load JS shared by all: 87.2 kB
```

**Por debajo del target** para sitios premium.

### Optimizaciones aplicadas

- Server Components por defecto
- Code splitting automático
- Tailwind purge de clases no usadas
- Fonts con `display: swap`
- Sin dependencias pesadas de UI

### Optimizaciones pendientes

- Convertir `<img>` → `next/image` (probablemente -1s en LCP)
- Lazy load imágenes below the fold
- Preload de fuentes críticas (configurar en `next/font`)

---

## 13. Errores comunes y soluciones

### ❌ "Cannot find name 'motion'"

`framer-motion` requiere `import { motion } from 'framer-motion'`. Si el error dice que no encuentra `motion`, importar:

```typescript
import { motion, useReducedMotion } from 'framer-motion';
```

### ❌ "Module has no exported member 'createNavigation'"

En `next-intl 3.26+`, `createNavigation` está en `next-intl/navigation`, no en `next-intl`:

```typescript
import { createNavigation } from 'next-intl/navigation';
```

### ❌ "Argument is not assignable to Link href"

Esto ocurre cuando el path es dinámico. Usar `as any`:

```typescript
<Link href={`/sectores/${sector.id}` as any}>
```

### ❌ "hasLocale is not exported"

En `next-intl 3.26`, `hasLocale` no existe. Usar `(routing.locales as readonly string[]).includes(requested ?? '')`:

```typescript
const locale = (routing.locales as readonly string[]).includes(requested ?? '')
  ? (requested as (typeof routing.locales)[number])
  : routing.defaultLocale;
```

---

## 14. Convenciones de código

### Imports

```typescript
// 1. React/Next
import { useState } from 'react';
import { Metadata } from 'next';

// 2. Third-party
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// 3. Internal (con alias)
import { Button } from '@/components/ui/Button';
import { brand } from '@/lib/config/brand';

// 4. Tipos
import type { Sector } from '@/lib/data/sectors';
```

### Naming

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componente | PascalCase | `Hero.tsx`, `SectorCard.tsx` |
| Hook | camelCase + `use` | `useReducedMotion` |
| Constante | UPPER_SNAKE_CASE | `DEFAULT_LOCALE` |
| Tipo | PascalCase | `Sector`, `Solution` |
| Interface | PascalCase sin `I` | `SectorCardProps` |
| Archivo datos | camelCase plural | `sectors.ts`, `solutions.ts` |

### Comentarios

Solo en lugares donde la lógica no es evidente. El código debe ser self-documenting.

---

## 15. Próximos pasos para extender

### Corto plazo (1-2 días)
- [ ] Conectar formulario de contacto a Resend
- [ ] Convertir `<img>` a `next/image`
- [ ] Agregar JSON-LD schema.org a páginas clave

### Mediano plazo (1 semana)
- [ ] Página de Insights/Blog con CMS (Sanity)
- [ ] Test E2E con Playwright
- [ ] Analytics con Plausible

### Largo plazo (1 mes)
- [ ] Storybook para documentar componentes
- [ ] Sistema de búsqueda de soluciones (fuse.js)
- [ ] Multi-producto (si se ramifica el catálogo)

---

## 16. Recursos

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [next-intl docs](https://next-intl-docs.vercel.app)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [Framer Motion docs](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Para dudas, contactar al equipo de desarrollo o abrir un issue en el repositorio.**
