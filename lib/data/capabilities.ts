export interface Capability {
  id: string;
  iconName: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  image: string;
  link: string;
}

export const capabilities: Capability[] = [
  {
    id: 'sistemas-core',
    iconName: 'ShieldCheck',
    title: { es: 'Sistemas Core & Misión Crítica', en: 'Mission-Critical Core Systems' },
    description: {
      es: 'Arquitectura de software desacoplada y tolerante a fallos para organizaciones que no pueden permitirse caídas. Probado en entornos hospitalarios de alta complejidad.',
      en: 'Fault-tolerant, decoupled software architecture for organizations where downtime is not an option. Validated in complex hospital settings.',
    },
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    link: '/#portal-experience',
  },
  {
    id: 'tiempo-real-colas',
    iconName: 'Activity',
    title: { es: 'Tiempo Real & Orquestación de Filas', en: 'Real-Time Queue Orchestration' },
    description: {
      es: 'Transmisión subsegundo vía WebSockets, terminales táctiles de autoservicio con impresión térmica y pantallas de llamado con síntesis de voz.',
      en: 'Sub-second WebSocket dispatch, self-service touch totems with thermal printing, and smart TV screens with synthetic speech.',
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    link: '/#portal-experience',
  },
  {
    id: 'automatizacion-ai',
    iconName: 'Workflow',
    title: { es: 'Automatizaciones & Agentes de IA', en: 'Automations & AI Agents' },
    description: {
      es: 'Tuberías de datos inteligentes, automatización robótica de procesos (RPA) y modelos autónomos para reducir hasta un 85% del esfuerzo manual.',
      en: 'Intelligent data pipelines, robotic process automation (RPA), and autonomous AI models cutting up to 85% of manual operational effort.',
    },
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    link: '/#portal-experience',
  },
  {
    id: 'erp-institucional',
    iconName: 'GraduationCap',
    title: { es: 'ERP Institucional & Trazabilidad', en: 'Institutional ERP & Traceability' },
    description: {
      es: 'Control integral de bodegas, activos fijos, órdenes de compra y solicitudes jerárquicas con auditoría inmutable continua.',
      en: 'Comprehensive warehouse control, fixed asset custody, purchase orders and hierarchical requests with continuous audit trails.',
    },
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    link: '/#portal-experience',
  },
  {
    id: 'comercio-agil',
    iconName: 'Store',
    title: { es: 'Vitrinas Digitales & Comercio Ágil', en: 'Agile Commerce & Digital Showcases' },
    description: {
      es: 'Despliegue ultrarrápido de catálogos interactivos optimizados para conversión directa hacia WhatsApp y redes sociales sin comisiones.',
      en: 'Ultra-fast deployment of mobile interactive product showcases optimized for direct WhatsApp checkouts with zero fees.',
    },
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    link: '/#portal-experience',
  },
  {
    id: 'integraciones-apis',
    iconName: 'Plug',
    title: { es: 'Integraciones Críticas & Conectores API', en: 'Critical Integrations & API Bridges' },
    description: {
      es: 'Conexión de sistemas legacy con arquitecturas cloud modernas, facturación SII, servicios de salud (FONASA/HL7) y pasarelas de pago.',
      en: 'Secure bridges connecting legacy on-prem systems with modern cloud infrastructure, government APIs, and payment rails.',
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    link: '/#portal-experience',
  },
];
