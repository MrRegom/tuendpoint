export const brand = {
  name: 'tuEndpoint',
  legalName: 'tuEndpoint Technology Consulting',
  tagline: 'Consultora de software a medida',
  description:
    'Desarrollamos soluciones tecnológicas para empresas. Salud, educación, retail, logística y más.',
  email: 'contacto@tuendpoint.cl',
  phone: '+56 9 492 5337',
  address: 'Viña del Mar, Chile',
  url: 'https://tuendpoint.vercel.app',
  ogImage: '/og-image.png',
  social: {},
  foundedYear: 2024,
} as const;

export type Brand = typeof brand;
