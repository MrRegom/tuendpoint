export interface Capability {
  id: string;
  iconName: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  image: string;
  /** Ruta a la que navega el card al hacer click */
  link: string;
}

export const capabilities: Capability[] = [
  {
    id: 'sistemas-core',
    iconName: 'CodeXml',
    title: { es: 'Programas a Medida', en: 'Custom Software' },
    description: {
      es: '¿Tu negocio necesita algo que no existe en el mercado? Lo construimos exactamente como lo necesitas. Inventarios, gestores, portales y más.',
      en: 'Does your business need something that doesn\'t exist in the market? We build it exactly as you need it.',
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    link: '/soluciones',
  },
  {
    id: 'automatizacion',
    iconName: 'Workflow',
    title: { es: 'De lo Manual a lo Automático', en: 'Automation' },
    description: {
      es: 'Olvídate de los Excel y los procesos manuales. Automatizamos tareas repetitivas para que tu equipo se enfoque en lo que importa.',
      en: 'Forget spreadsheets and manual processes. We automate repetitive tasks so your team can focus on what matters.',
    },
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    link: '/soluciones',
  },
  {
    id: 'sistemas-educativos',
    iconName: 'GraduationCap',
    title: { es: 'Plataformas para Educación', en: 'Education Platforms' },
    description: {
      es: 'Sistemas para universidades y colegios: matrículas online, notas, asistencia y comunicación con apoderados, todo en un solo lugar.',
      en: 'Systems for universities and schools: online enrollment, grades, attendance and parent communication, all in one place.',
    },
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    link: '/sectores/educacion',
  },
  {
    id: 'salud-clinica',
    iconName: 'HeartPulse',
    title: { es: 'Gestión Clínica y Salud', en: 'Clinical Management' },
    description: {
      es: 'Control de fichas, equipamiento médico, agendas y más. Probados en hospitales reales donde los sistemas no pueden fallar.',
      en: 'Record management, medical equipment, schedules and more. Proven in real hospitals where systems cannot fail.',
    },
    // Médico con tablet - sistema clínico digital
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    link: '/sectores/salud',
  },
  {
    id: 'punto-de-venta',
    iconName: 'Store',
    title: { es: 'Caja y Punto de Venta', en: 'Point of Sale' },
    description: {
      es: 'Sistemas de caja registradora modernos con boleta electrónica integrada al SII. Sin complicaciones, fácil de usar.',
      en: 'Modern cash register systems with electronic receipts integrated with SII. No complications, easy to use.',
    },
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    link: '/sectores/retail',
  },
  {
    id: 'integraciones',
    iconName: 'Plug',
    title: { es: 'Conexión entre Sistemas', en: 'System Integration' },
    description: {
      es: '¿Tienes varios programas que no se hablan entre sí? Los conectamos para que la información fluya sola, sin doble ingreso.',
      en: 'Do you have several programs that don\'t talk to each other? We connect them so information flows automatically.',
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    link: '/soluciones',
  },
];
