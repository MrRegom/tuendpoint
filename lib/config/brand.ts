export const brand = {
  name: 'tuEndpoint',
  legalName: 'tuEndpoint Technology Consulting',
  tagline: 'Consultora de software a medida',
  description:
    'Desarrollamos soluciones tecnológicas para empresas. Salud, educación, retail, logística y más.',
  email: 'mr.reinaldo.g@gmail.com',
  phone: '+56 7 9492 5337',
  address: 'Viña del Mar, Chile',
  url: 'https://tuendpoint.vercel.app',
  ogImage: '/og-image.png',
  social: {},
  foundedYear: 2024,
} as const;

export type Brand = typeof brand;
