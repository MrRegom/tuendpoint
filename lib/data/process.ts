export interface ProcessStep {
  number: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  details: { es: string[]; en: string[] };
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: { es: 'Discovery & UX', en: 'Discovery & UX' },
    description: {
      es: 'Entendemos su operación, identificamos cuellos de botella y definimos la solución.',
      en: 'We understand your operation, identify bottlenecks and define the solution.',
    },
    details: {
      es: [
        'Mapeo de procesos críticos',
        'Definición de KPIs y ROI',
        'Entrevistas con stakeholders',
        'Diseño de experiencia (UX)',
      ],
      en: [
        'Critical process mapping',
        'KPI and ROI definition',
        'Stakeholder interviews',
        'Experience design (UX)',
      ],
    },
  },
  {
    number: '02',
    title: { es: 'Arquitectura', en: 'Architecture' },
    description: {
      es: 'Seleccionamos los componentes, APIs y stack tecnológico para garantizar escalabilidad.',
      en: 'We select the components, APIs and tech stack to ensure scalability.',
    },
    details: {
      es: [
        'Diseño de arquitectura Cloud',
        'Evaluación de integraciones (ERPs, HL7)',
        'Estrategia de seguridad (OWASP)',
        'Modelado de datos',
      ],
      en: [
        'Cloud architecture design',
        'Integration assessment (ERPs, HL7)',
        'Security strategy (OWASP)',
        'Data modeling',
      ],
    },
  },
  {
    number: '03',
    title: { es: 'Desarrollo Ágil', en: 'Agile Development' },
    description: {
      es: 'Construimos iterativamente con entregas funcionales tempranas. Usted tiene el código.',
      en: 'We build iteratively with early functional deliveries. You own the code.',
    },
    details: {
      es: [
        'Sprints quincenales',
        'Repositorio abierto para el cliente',
        'Code reviews estrictos',
        'Demos funcionales',
      ],
      en: [
        'Bi-weekly sprints',
        'Open repository for the client',
        'Strict code reviews',
        'Functional demos',
      ],
    },
  },
  {
    number: '04',
    title: { es: 'QA & Pruebas', en: 'QA & Testing' },
    description: {
      es: 'Aseguramos la calidad y resistencia del sistema antes de tocar producción.',
      en: 'We ensure system quality and resilience before hitting production.',
    },
    details: {
      es: [
        'Pruebas unitarias y de integración',
        'Testing de carga y estrés',
        'Validación de seguridad',
        'UAT (User Acceptance Testing)',
      ],
      en: [
        'Unit and integration tests',
        'Load and stress testing',
        'Security validation',
        'UAT (User Acceptance Testing)',
      ],
    },
  },
  {
    number: '05',
    title: { es: 'Deploy & Capacitación', en: 'Deploy & Training' },
    description: {
      es: 'Lanzamiento seguro, migración de datos y acompañamiento en la adopción.',
      en: 'Secure launch, data migration and adoption support.',
    },
    details: {
      es: [
        'Estrategia de paso a producción (Zero-downtime)',
        'Migración de datos legacy',
        'Capacitación in-situ',
        'Manuales y documentación',
      ],
      en: [
        'Go-live strategy (Zero-downtime)',
        'Legacy data migration',
        'On-site training',
        'Manuals and documentation',
      ],
    },
  },
  {
    number: '06',
    title: { es: 'Soporte & Monitoreo', en: 'Support & Monitoring' },
    description: {
      es: 'SLA comprometidos. Monitoreamos activamente para prevenir incidentes.',
      en: 'Committed SLAs. We actively monitor to prevent incidents.',
    },
    details: {
      es: [
        'Monitoreo 24/7 de infraestructura',
        'Resolución de incidentes (SLA)',
        'Evolución y nuevas features',
        'Actualizaciones de seguridad',
      ],
      en: [
        '24/7 infrastructure monitoring',
        'Incident resolution (SLA)',
        'Evolution and new features',
        'Security updates',
      ],
    },
  },
];
