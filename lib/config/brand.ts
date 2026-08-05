export const brand = {
  name: 'Regom',
  legalName: 'Regom SpA',
  tagline: 'Ingeniería de software a medida',
  description:
    'Catálogo inteligente de soluciones digitales para industrias críticas. Salud, educación, retail, empresas.',
  email: 'contacto@regom.cl',
  phone: '+56 9 0000 0000',
  address: 'Santiago, Chile',
  url: 'https://regom.cl',
  ogImage: '/og-image.png',
  social: {
    linkedin: 'https://linkedin.com/company/regom',
  },
  foundedYear: 2026,
} as const;

export type Brand = typeof brand;
