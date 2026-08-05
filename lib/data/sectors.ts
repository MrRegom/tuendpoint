export type SectorId =
  | 'salud'
  | 'educacion'
  | 'retail'
  | 'empresas'
  | 'logistica';

export interface Sector {
  id: SectorId;
  name: { es: string; en: string };
  description: { es: string; en: string };
  longDescription: { es: string; en: string };
  image: string;
  highlights: { es: string[]; en: string[] };
}

export const sectors: Sector[] = [
  {
    id: 'salud',
    name: { es: 'Salud', en: 'Healthcare' },
    description: {
      es: 'Software clínico, gestión hospitalaria e integración con sistemas públicos de salud.',
      en: 'Clinical software, hospital management and integration with public health systems.',
    },
    longDescription: {
      es: 'Construimos software para hospitales, clínicas y centros de salud. Experiencia ejecutada en operaciones reales: gestión de equipamiento, portales para pacientes, integración con FONASA, HL7 y FHIR. Sistemas que corren en producción, no prototipos.',
      en: 'We build software for hospitals, clinics and healthcare centers. Executed experience in real operations: equipment management, patient portals, FONASA, HL7 and FHIR integration. Systems running in production, not prototypes.',
    },
    image:
      'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1600&q=80',
    highlights: {
      es: [
        'Experiencia ejecutada en hospital público de alta complejidad',
        'Integración FONASA, HL7 y FHIR',
        'Cumplimiento de normativa clínica chilena',
      ],
      en: [
        'Executed experience in a high-complexity public hospital',
        'FONASA, HL7 and FHIR integration',
        'Chilean clinical regulatory compliance',
      ],
    },
  },
  {
    id: 'educacion',
    name: { es: 'Educación', en: 'Education' },
    description: {
      es: 'Plataformas académicas, matrículas, aulas virtuales y gestión administrativa.',
      en: 'Academic platforms, enrollment, virtual classrooms and administrative management.',
    },
    longDescription: {
      es: 'Soluciones adaptadas para universidades, institutos y centros de formación. Desde matrícula online hasta portales académicos, aulas virtuales y gestión documental. Construido sobre plantillas probadas que se ajustan a la operación de cada institución.',
      en: 'Solutions adapted for universities, institutes and training centers. From online enrollment to academic portals, virtual classrooms and document management. Built on proven templates that adjust to each institution’s operations.',
    },
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
    highlights: {
      es: [
        'Plataformas para instituciones de educación superior',
        'Integración con Webpay, Flow y sistemas de pago',
        'Cumplimiento de normativa académica',
      ],
      en: [
        'Platforms for higher education institutions',
        'Integration with Webpay, Flow and payment systems',
        'Academic regulatory compliance',
      ],
    },
  },
  {
    id: 'retail',
    name: { es: 'Retail', en: 'Retail' },
    description: {
      es: 'Punto de venta, inventario multi-sucursal y operaciones de comercio.',
      en: 'Point of sale, multi-branch inventory and commerce operations.',
    },
    longDescription: {
      es: 'Soluciones para tiendas, cadenas comerciales y operaciones de retail. Sistemas de punto de venta, inventario distribuido, integración con boleta electrónica SII y herramientas de gestión operativa.',
      en: 'Solutions for stores, retail chains and commerce operations. Point of sale systems, distributed inventory, SII electronic receipt integration and operational management tools.',
    },
    image:
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1600&q=80',
    highlights: {
      es: [
        'Boleta electrónica integrada con SII',
        'Inventario en tiempo real multi-sucursal',
        'Punto de venta táctil y móvil',
      ],
      en: [
        'Electronic receipts integrated with SII',
        'Real-time multi-branch inventory',
        'Touch and mobile point of sale',
      ],
    },
  },
  {
    id: 'empresas',
    name: { es: 'Empresas', en: 'Enterprise' },
    description: {
      es: 'Automatización de procesos, gestión documental e integraciones corporativas.',
      en: 'Process automation, document management and corporate integrations.',
    },
    longDescription: {
      es: 'Software para empresas que necesitan ordenar sus operaciones internas. Automatización de workflows, gestión documental, integración entre sistemas legacy y plataformas modernas. Entrega continua y soporte post-implementación.',
      en: 'Software for companies that need to organize their internal operations. Workflow automation, document management, integration between legacy systems and modern platforms. Continuous delivery and post-implementation support.',
    },
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    highlights: {
      es: [
        'Workflows automatizados sin código o con código',
        'Integración con ERPs y sistemas legacy',
        'Soporte post-implementación garantizado',
      ],
      en: [
        'Automated workflows no-code or code-based',
        'Integration with ERPs and legacy systems',
        'Guaranteed post-implementation support',
      ],
    },
  },
  {
    id: 'logistica',
    name: { es: 'Logística', en: 'Logistics' },
    description: {
      es: 'Tracking de operaciones, gestión de flotas y trazabilidad.',
      en: 'Operations tracking, fleet management and traceability.',
    },
    longDescription: {
      es: 'Sistemas para empresas de transporte, distribución y logística. Tracking en tiempo real, gestión de rutas, trazabilidad de envíos y controladores de operación.',
      en: 'Systems for transportation, distribution and logistics companies. Real-time tracking, route management, shipment traceability and operations controllers.',
    },
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    highlights: {
      es: [
        'Tracking GPS en tiempo real',
        'Integración con despachadores y transportistas',
        'Trazabilidad de punta a punta',
      ],
      en: [
        'Real-time GPS tracking',
        'Integration with dispatchers and carriers',
        'End-to-end traceability',
      ],
    },
  },
];

export const getSector = (id: string): Sector | undefined =>
  sectors.find((s) => s.id === id);
