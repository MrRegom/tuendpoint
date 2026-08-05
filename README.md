# Regom — Sitio Web Corporativo

Sitio web corporativo bilingüe (ES/EN) para **Regom**, empresa chilena de desarrollo de software y transformación digital. Construido para transmitir confianza, tecnología, innovación y experiencia a clientes corporativos (hospitales, universidades, retail, empresas).

---

## 1. Concepto

Regom ofrece un **catálogo inteligente de soluciones digitales** organizado por sector industrial. El sitio web es la cara pública de ese catálogo: muestra capacidades, sectores atendidos, metodología de trabajo y permite solicitar reuniones.

### Diferenciadores de marca
- **Catálogo, no servicios genéricos**: muestra 19 soluciones específicas en 6 sectores
- **Evidencia sobre promesas**: comunica sistemas "en producción" sin inventar clientes
- **Idioma doctor/paciente**: español chileno formal, sin jerga startup
- **Tono corporativo premium**: nivel Accenture/Azure/Minsait

### Audiencia
- Gerencias de hospital
- Departamentos TI de universidades
- Empresas medianas y grandes en Chile
- Sector público y retail

---

## 2. Stack Tecnológico

### Core
| Tecnología | Versión | Uso |
|---|---|---|
| **Next.js** | 14.2.18 | Framework React con SSR/SSG |
| **TypeScript** | 5.6.3 | Tipado estático estricto |
| **React** | 18.3.1 | UI declarativa |
| **Tailwind CSS** | 3.4.15 | Styling utility-first |
| **Framer Motion** | 11.11.17 | Animaciones |

### Integración
| Tecnología | Versión | Uso |
|---|---|---|
| **next-intl** | 3.26.0 | Internacionalización con App Router |
| **React Hook Form** | 7.53.2 | Manejo de formularios |
| **Zod** | 3.23.8 | Validación de schemas |
| **Lucide React** | 0.460.0 | Iconos line-art |

### Tipografías
| Familia | Estilo | Uso |
|---|---|---|
| **Plus Jakarta Sans** | Sans, geométrica | Cuerpo y headings |
| **Instrument Serif** | Serif, elegante | Momentos editoriales (Statement) |
| **JetBrains Mono** | Monospace | Eyebrows, numerales, metadata |

### Build / Deploy
- **Node.js** >= 18
- **Vercel** (recomendado) — Next.js nativo
- Cualquier hosting que soporte Node (`npm run start`)

---

## 3. Estructura del Proyecto

```
regom-web/
├── app/                                # Next.js App Router
│   ├── layout.tsx                     # Root layout + fuentes
│   ├── globals.css                    # Sistema de diseño base
│   ├── sitemap.ts                     # Sitemap dinámico
│   ├── robots.ts                      # Robots.txt
│   ├── not-found.tsx                  # 404
│   └── [locale]/                      # Rutas internacionalizadas
│       ├── layout.tsx                 # Layout por locale
│       ├── page.tsx                   # Home
│       ├── soluciones/                # Catálogo completo
│       ├── sectores/                  # Páginas verticales
│       │   ├── salud/
│       │   ├── educacion/
│       │   ├── retail/
│       │   ├── empresas/
│       │   ├── gobierno/
│       │   └── logistica/
│       ├── proceso/                   # Metodología
│       ├── nosotros/                  # About
│       ├── contacto/                  # Formulario
│       └── legal/
│           ├── privacidad/
│           └── terminos/
│
├── components/
│   ├── ui/                            # Primitivos reutilizables
│   │   ├── Button.tsx                 # 5 variants × 4 sizes
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ├── Eyebrow.tsx
│   │   ├── Heading.tsx                # 5 sizes
│   │   └── Text.tsx
│   ├── motion/                        # Wrappers de animación
│   │   ├── Reveal.tsx                 # Fade-up on scroll
│   │   ├── StaggerGroup.tsx           # Cascada de hijos
│   │   └── Marquee.tsx                # Scroll infinito
│   ├── layout/
│   │   ├── Nav.tsx                    # Sticky adaptativo
│   │   ├── Footer.tsx                 # Dark con CTA
│   │   ├── Logo.tsx                   # SVG inline
│   │   └── LocaleSwitcher.tsx
│   └── sections/                      # Secciones del sitio
│       ├── Hero.tsx                   # Hero full-screen
│       ├── SectorMarquee.tsx          # Ticker de sectores
│       ├── Statement.tsx              # Serif italic editorial
│       ├── SectorsGrid.tsx            # Horizontal scroll
│       ├── Capabilities.tsx           # Lista numerada
│       ├── Stats.tsx                  # Stats en banda negra
│       ├── Differentiators.tsx        # Split con foto
│       ├── Process.tsx                # Timeline vertical
│       ├── Technologies.tsx           # Pills por categoría
│       ├── CatalogPreview.tsx         # Magazine layout
│       └── CTASection.tsx             # CTA final
│
├── lib/
│   ├── data/                          # Datos estáticos tipados
│   │   ├── sectors.ts                 # 6 sectores
│   │   ├── solutions.ts               # 19 soluciones
│   │   ├── capabilities.ts            # 6 capacidades
│   │   ├── process.ts                 # 6 pasos
│   │   └── technologies.ts            # Stack + stats
│   ├── config/
│   │   ├── brand.ts                   # Nombre, contacto, social
│   │   ├── navigation.ts              # Links del nav
│   │   └── locale.ts                  # Configuración i18n
│   └── utils/
│       └── cn.ts                      # clsx + tailwind-merge
│
├── i18n/
│   ├── routing.ts                     # defineRouting + createNavigation
│   └── request.ts                     # getRequestConfig
│
├── messages/
│   ├── es.json                        # Español (default)
│   └── en.json                        # Inglés
│
├── middleware.ts                      # next-intl middleware
├── next.config.mjs                    # Configuración Next
├── tailwind.config.ts                 # Sistema de diseño
├── tsconfig.json                      # Strict TypeScript
├── package.json
└── README.md
```

---

## 4. Convenciones de Código

### Naming
- **Componentes**: PascalCase (`Hero.tsx`, `SectorMarquee.tsx`)
- **Funciones/hooks**: camelCase (`useReducedMotion`, `cn()`)
- **Constantes**: UPPER_SNAKE_CASE para enums
- **Archivos de datos**: camelCase plural (`sectors.ts`, `solutions.ts`)
- **Tipos**: PascalCase con sufijo descriptivo (`Sector`, `Capability`, `ProcessStep`)

### TypeScript
- `strict: true` activado
- Sin `any` excepto en lugares explícitamente tipados como flex (`href as any`)
- Tipos derivados de datos con `interface` + `type`
- Props siempre tipados explícitamente

### Componentes
- **'use client'** solo donde hay estado, animación o interactividad
- Server Components por defecto
- Props tipados con interface
- Sin declaraciones inline de tipos
- Un componente por archivo

### Estilos
- **Tailwind utility-first**, sin CSS modules
- Variantes personalizadas en `tailwind.config.ts`
- Tokens del sistema en `app/globals.css` con `@layer`
- Sin `style={}` inline excepto para valores dinámicos críticos

---

## 5. Sistema de Diseño

### Paleta de colores

```typescript
ink:           '#0A0A0A'  // Texto principal, headlines
ink-soft:      '#1F2937'  // Texto secundario
ink-muted:     '#4B5563'  // Texto auxiliar
paper:         '#FFFFFF'  // Background default
bone:          '#F5F5F4'  // Background alternativo
accent:        '#0A2540'  // CTAs, acentos
accent-hover:  '#0F3057'  // Hover del acento
muted:         '#6B7280'  // Eyebrows, captions
border:        '#E5E7EB'  // Divisores
border-soft:   '#F0F0EE'  // Bordes sutiles
```

**Reglas:**
- No gradientes decorativos
- Acento usado solo en CTAs y puntos focales
- 65% blanco / 25% ink / 8% accent / 2% gris

### Tipografía (escala sóbria)

```
display-2xl:  clamp(2.75rem, 5.5vw, 5.5rem)   // Hero principal
display-xl:   clamp(2.25rem, 4.5vw, 4.5rem)   // H1 grandes
display-l:    clamp(1.875rem, 3.5vw, 3.25rem) // H1 secciones
display-m:    clamp(1.625rem, 2.8vw, 2.5rem)  // H2
h1:           clamp(1.5rem, 2.4vw, 2rem)      // H2 estándar
h2:           clamp(1.25rem, 1.8vw, 1.5rem)   // H3
h3:           clamp(1.125rem, 1.4vw, 1.25rem) // H4
body-l:       1.0625rem                        // Lead text
body-m:       0.9375rem                        // Default
body-s:       0.8125rem                        // Caption
body-xs:      0.75rem                          // Micro
eyebrow:      0.6875rem uppercase tracking 0.14em
```

**Reglas:**
- Sentence case (no Title Case)
- Eyebrow siempre en JetBrains Mono uppercase
- Títulos editoriales pueden usar Instrument Serif italic

### Spacing (8px grid)

```
section-y:      clamp(4rem, 7vw, 8rem)     // 128px max
section-y-sm:   clamp(2.5rem, 5vw, 4rem)   // 64px max
gap-grid:       1rem
gap-blocks:     clamp(2rem, 3.5vw, 3.5rem) // 56px max
```

### Container

- **Ancho máximo**: 1280px (default), 1440px (wide)
- **Padding lateral**: 1.25rem mobile, 2rem tablet, 3rem desktop
- **Columnas**: 12 desktop, 6 tablet, 1 mobile

### Borders y radios

- **Bordes**: 1px con `border-border` o `border-ink/10`
- **Radios**: 4px (elementos), 0 (botones), 2px (logo)
- **Sombras**: ninguna por defecto (sitios premium no usan)

---

## 6. Datos Estáticos

Todos los datos están en `lib/data/*.ts` como **TypeScript files** (no JSON). Esto permite:
- Tipado fuerte
- Autocomplete en el editor
- Refactor seguro
- Validación en compile-time

### Estructura de datos clave

**Sector** (`sectors.ts`):
```typescript
{
  id: 'salud',
  name: { es: 'Salud', en: 'Healthcare' },
  description: { es: '...', en: '...' },
  longDescription: { es: '...', en: '...' },
  image: 'https://...',
  highlights: { es: ['...'], en: ['...'] }
}
```

**Solution** (`solutions.ts`):
```typescript
{
  id: 'gestion-equipamiento',
  name: { es: '...', en: '...' },
  sector: 'salud',
  shortDescription: { es: '...', en: '...' },
  longDescription: { es: '...', en: '...' },
  features: { es: ['...'], en: ['...'] },
  origin: 'proven' | 'template',
  image: 'https://...'
}
```

**Marca** (`brand.ts`):
```typescript
{
  name: 'Regom',
  tagline: '...',
  email: 'contacto@regom.cl',
  phone: '+56 ...',
  // ...
}
```

> **Para agregar más soluciones/sectores**: editar el archivo correspondiente. El sistema se actualiza automáticamente.

---

## 7. Internacionalización (ES/EN)

Implementado con **next-intl 3.26+**.

### Estructura
- `messages/es.json` — Mensajes en español (default)
- `messages/en.json` — Mensajes en inglés
- `i18n/routing.ts` — Configuración de locales
- `i18n/request.ts` — Carga de mensajes por request
- `middleware.ts` — Detección de locale en URL

### Routing
- Español (default): `/soluciones`, `/sectores/salud`
- Inglés: `/en/soluciones`, `/en/sectors/health`

### Uso en componentes

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('home.hero');
return <h1>{t('title')}</h1>;
```

### Cambio entre idiomas
El `LocaleSwitcher` en el nav preserva la ruta actual y solo cambia el prefijo de locale.

---

## 8. Animaciones

Todas las animaciones usan **Framer Motion** con respeto a `prefers-reduced-motion`.

### Patrones

**Reveal (fade-up on scroll)**:
```typescript
<Reveal>
  <h2>Título</h2>
</Reveal>
```

**Stagger (cascada en grupo)**:
```typescript
<StaggerGroup>
  {items.map(item => <Card {...item} />)}
</StaggerGroup>
```

**Animaciones custom** en componentes específicos:
- Hero: fade-up + scale + delay escalonado
- Marquee: scroll infinito (CSS @keyframes)
- Stats: fade-up on scroll
- Tabs: AnimatePresence con slide horizontal

### Reglas
- Duración máxima: 600ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (curva editorial) o `cubic-bezier(0.22, 1, 0.36, 1)` (curva soft)
- `useReducedMotion()` se respeta en todas las animaciones
- Sin parallax, sin scroll-jacking

---

## 9. Responsive

Mobile-first. Breakpoints Tailwind:

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1440px
```

### Patrones responsive usados

- **Grids colapsables**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Tipografía fluida**: `clamp()` en todos los font-size
- **Padding lateral**: escala de 1.25rem → 3rem
- **Hero**: `min-h-[85vh]` mobile, `min-h-[88vh]` desktop
- **Nav**: hamburger en mobile, horizontal en desktop
- **Cards**: 78vw mobile, 480px desktop

---

## 10. SEO y Performance

### SEO
- Metadata API de Next.js (title, description, OG)
- Sitemap.xml dinámico (`app/sitemap.ts`)
- Robots.txt (`app/robots.ts`)
- Open Graph + Twitter Cards
- Schema.org semántico en HTML
- `lang` correcto en `<html>`
- URLs localizadas

### Performance
- Server Components por defecto
- Fonts con `display: swap` y preload automático
- Imágenes con `next/image` (próxima mejora)
- Code splitting automático (Next.js)
- Bundle First Load JS: < 200kb promedio
- Sin librerías pesadas innecesarias

### Accesibilidad (WCAG 2.1 AA)
- Contraste mínimo 4.5:1
- Focus visible en todos los interactivos
- Skip link al contenido principal
- ARIA labels en íconos
- Navegación por teclado completa
- `prefers-reduced-motion` respetado
- Textos en español chileno formal

---

## 11. Setup y Desarrollo

### Prerequisitos
- Node.js >= 18
- npm, pnpm, o yarn

### Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (puerto 3000)
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm run start

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Variables de entorno

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://regom.cl
```

---

## 12. Deployment

### Vercel (recomendado)

1. Conectar el repositorio de GitHub
2. Vercel detecta Next.js automáticamente
3. Configurar variable `NEXT_PUBLIC_SITE_URL`
4. Deploy

### Build manual

```bash
npm run build
npm run start
```

El servidor corre en `http://localhost:3000` por defecto.

---

## 13. Personalización

### Cambiar marca

Editar `lib/config/brand.ts`:

```typescript
export const brand = {
  name: 'Nuevo Nombre',
  tagline: '...',
  email: '...',
  phone: '...',
  // ...
};
```

### Agregar solución

Editar `lib/data/solutions.ts`:

```typescript
{
  id: 'nueva-solucion',
  name: { es: '...', en: '...' },
  sector: 'salud', // ID del sector
  // ...
}
```

### Cambiar paleta

Editar `tailwind.config.ts` → `extend.colors` y `app/globals.css` → variables CSS.

### Cambiar fuente

Editar `app/layout.tsx` y `tailwind.config.ts` (`fontFamily`).

---

## 14. Convenciones de Commits

Mensajes en español, formato:

```
tipo: descripción corta

[cuerpo opcional]
```

Tipos:
- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `style`: cambios de estilo sin afectar lógica
- `refactor`: refactorización de código
- `docs`: cambios en documentación
- `chore`: tareas de mantenimiento

---

## 15. Roadmap

### Pendientes
- [ ] Convertir `<img>` a `next/image` (optimización)
- [ ] Traducción profesional de `messages/en.json`
- [ ] Backend para formulario de contacto (Resend + edge function)
- [ ] Schema.org JSON-LD en todas las páginas
- [ ] Blog / Insights (CMS opcional)
- [ ] Analytics con Plausible (privacy-first)

### Mejoras futuras
- [ ] Test E2E con Playwright
- [ ] Visual regression tests
- [ ] Storybook para componentes
- [ ] CI/CD con GitHub Actions

---

## 16. Licencia

Privado. Todos los derechos reservados a Regom SpA.

---

## 17. Créditos

Sitio diseñado y desarrollado para **Regom**.

Stack principal:
- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [next-intl](https://next-intl-docs.vercel.app)
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- [Lucide Icons](https://lucide.dev)
