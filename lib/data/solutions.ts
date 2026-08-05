import type { SectorId } from './sectors';
import { sectors } from './sectors';

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
  icon?: string;
}

export const solutions: Solution[] = [
  // SALUD — experiencia real comprobada
  {
    id: 'gestion-equipamiento',
    name: { es: 'Gestión de Equipamiento Clínico', en: 'Clinical Equipment Management' },
    sector: 'salud',
    shortDescription: {
      es: 'Inventario, mantención y trazabilidad de equipos médicos críticos.',
      en: 'Inventory, maintenance and traceability of critical medical equipment.',
    },
    longDescription: {
      es: 'Sistema integral para gestionar el ciclo de vida del equipamiento clínico. Control de inventario, programación de mantenciones preventivas y correctivas, registro de calibraciones, historial por equipo y trazabilidad operativa completa.',
      en: 'Comprehensive system to manage the lifecycle of clinical equipment. Inventory control, preventive and corrective maintenance scheduling, calibration records, equipment history and full operational traceability.',
    },
    features: {
      es: [
        'Inventario con códigos y fotos',
        'Mantenciones programadas y alertas',
        'Historial y trazabilidad por equipo',
        'Reportes de cumplimiento',
      ],
      en: [
        'Inventory with codes and photos',
        'Scheduled maintenance and alerts',
        'Per-equipment history and traceability',
        'Compliance reports',
      ],
    },
    origin: 'proven',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'portal-paciente',
    name: { es: 'Portal del Paciente', en: 'Patient Portal' },
    sector: 'salud',
    shortDescription: {
      es: 'Citas, resultados, antecedentes y comunicación clínica con el paciente.',
      en: 'Appointments, results, history and clinical communication with patients.',
    },
    longDescription: {
      es: 'Portal web y móvil para que pacientes agenden horas, descarguen resultados, revisen su historial clínico y se comuniquen con el equipo médico. Integración con sistemas hospitalarios para mantener una sola fuente de verdad.',
      en: 'Web and mobile portal for patients to schedule appointments, download results, review their clinical history and communicate with the medical team. Integration with hospital systems to maintain a single source of truth.',
    },
    features: {
      es: [
        'Agenda de citas en línea',
        'Resultados y exámenes descargables',
        'Historial clínico accesible',
        'Notificaciones y recordatorios',
      ],
      en: [
        'Online appointment booking',
        'Downloadable results and exams',
        'Accessible clinical history',
        'Notifications and reminders',
      ],
    },
    origin: 'proven',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gestion-filas',
    name: { es: 'Gestión de Filas y Triage', en: 'Queue Management & Triage' },
    sector: 'salud',
    shortDescription: {
      es: 'Asignación de turnos, priorización clínica y llamados en pantalla.',
      en: 'Turn assignment, clinical prioritization and on-screen calls.',
    },
    longDescription: {
      es: 'Sistema de gestión de filas con priorización por triage. Asignación automática de turnos, llamado a boxes, pantallas informativas y métricas de tiempo de espera. Diseñado para flujos de urgencia y consulta ambulatoria.',
      en: 'Queue management system with triage prioritization. Automatic turn assignment, box calling, information screens and waiting time metrics. Designed for emergency and outpatient flows.',
    },
    features: {
      es: [
        'Triage automático por prioridad',
        'Pantallas de llamado en vivo',
        'Métricas de espera y rendimiento',
        'Integración con agenda clínica',
      ],
      en: [
        'Automatic triage by priority',
        'Live call screens',
        'Waiting and performance metrics',
        'Clinical schedule integration',
      ],
    },
    origin: 'proven',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'registro-visitas',
    name: { es: 'Registro de Visitas', en: 'Visitor Registry' },
    sector: 'salud',
    shortDescription: {
      es: 'Control de acceso, visitas a pacientes y horarios.',
      en: 'Access control, patient visits and schedules.',
    },
    longDescription: {
      es: 'Registro digital de visitas a pacientes hospitalizados. Control de identidad, horarios de visita, restricciones por área clínica y trazabilidad para seguridad y auditoría.',
      en: 'Digital registry of visits to hospitalized patients. Identity control, visiting hours, restrictions by clinical area and traceability for security and auditing.',
    },
    features: {
      es: [
        'Identificación de visitantes',
        'Control de horarios por área',
        'Trazabilidad y auditoría',
        'Reportes de visitas',
      ],
      en: [
        'Visitor identification',
        'Schedule control by area',
        'Traceability and auditing',
        'Visit reports',
      ],
    },
    origin: 'proven',
    image:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'inventario-tic',
    name: { es: 'Inventario TIC Hospitalario', en: 'Hospital IT Inventory' },
    sector: 'salud',
    shortDescription: {
      es: 'Activos tecnológicos, licencias y ciclos de vida del equipamiento TI.',
      en: 'IT assets, licenses and lifecycle of IT equipment.',
    },
    longDescription: {
      es: 'Sistema de inventario para activos tecnológicos de un hospital o clínica. Equipos, periféricos, software, licencias, mantenciones y baja de activos. Visión centralizada para el equipo TI.',
      en: 'Inventory system for technological assets of a hospital or clinic. Equipment, peripherals, software, licenses, maintenance and asset retirement. Centralized view for the IT team.',
    },
    features: {
      es: [
        'Inventario físico y lógico',
        'Licencias y vencimientos',
        'Historial de mantención',
        'Reportes ejecutivos',
      ],
      en: [
        'Physical and logical inventory',
        'Licenses and expirations',
        'Maintenance history',
        'Executive reports',
      ],
    },
    origin: 'proven',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'integracion-fonasa',
    name: { es: 'Integración FONASA · HL7 · FHIR', en: 'FONASA · HL7 · FHIR Integration' },
    sector: 'salud',
    shortDescription: {
      es: 'Conexión con sistemas públicos de salud y estándares clínicos.',
      en: 'Connection with public health systems and clinical standards.',
    },
    longDescription: {
      es: 'Integración con FONASA, sistemas hospitalarios y plataformas clínicas bajo estándares HL7 v2/v3 y FHIR R4. Middleware de traducción, validación y monitoreo de transacciones clínicas.',
      en: 'Integration with FONASA, hospital systems and clinical platforms under HL7 v2/v3 and FHIR R4 standards. Translation, validation and monitoring middleware for clinical transactions.',
    },
    features: {
      es: [
        'Conectores HL7 y FHIR nativos',
        'Integración con FONASA',
        'Middleware de traducción',
        'Monitoreo y auditoría',
      ],
      en: [
        'Native HL7 and FHIR connectors',
        'FONASA integration',
        'Translation middleware',
        'Monitoring and auditing',
      ],
    },
    origin: 'proven',
    image:
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=80',
  },

  // EDUCACIÓN — plantillas adaptativas
  {
    id: 'matriculas',
    name: { es: 'Sistema de Matrículas y Admisión', en: 'Enrollment & Admissions System' },
    sector: 'educacion',
    shortDescription: {
      es: 'Inscripción online, documentación y seguimiento de postulación.',
      en: 'Online enrollment, documentation and application tracking.',
    },
    longDescription: {
      es: 'Plataforma de matrícula y admisión para instituciones de educación superior. Inscripción online, carga de documentos, validación, pago inicial y seguimiento del estado de cada postulación.',
      en: 'Enrollment and admissions platform for higher education institutions. Online registration, document upload, validation, initial payment and application status tracking.',
    },
    features: {
      es: [
        'Formulario de admisión multipaso',
        'Carga y validación de documentos',
        'Pasarela de pago integrada',
        'Dashboard de seguimiento',
      ],
      en: [
        'Multi-step admission form',
        'Document upload and validation',
        'Integrated payment gateway',
        'Tracking dashboard',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'portal-academico',
    name: { es: 'Portal Académico', en: 'Academic Portal' },
    sector: 'educacion',
    shortDescription: {
      es: 'Vista integral para estudiantes y docentes en una sola plataforma.',
      en: 'Comprehensive view for students and faculty in a single platform.',
    },
    longDescription: {
      es: 'Portal que centraliza la experiencia académica. Estudiantes ven notas, horarios, asistencia y materiales. Docentes ingresan calificaciones, gestionan cursos y se comunican con sus cursos.',
      en: 'Portal that centralizes the academic experience. Students see grades, schedules, attendance and materials. Faculty enter grades, manage courses and communicate with their classes.',
    },
    features: {
      es: [
        'Calificaciones y asistencia',
        'Horarios y calendarios',
        'Material de clases',
        'Comunicación estudiante-docente',
      ],
      en: [
        'Grades and attendance',
        'Schedules and calendars',
        'Class materials',
        'Student-faculty communication',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'aula-virtual',
    name: { es: 'Aula Virtual · LMS', en: 'Virtual Classroom · LMS' },
    sector: 'educacion',
    shortDescription: {
      es: 'Contenidos, evaluaciones y seguimiento del progreso del estudiante.',
      en: 'Content, assessments and student progress tracking.',
    },
    longDescription: {
      es: 'Plataforma LMS para impartir clases híbridas o a distancia. Contenidos multimedia, evaluaciones, tareas, foros y métricas de progreso por estudiante y por curso.',
      en: 'LMS platform to deliver hybrid or remote classes. Multimedia content, assessments, assignments, forums and progress metrics per student and per course.',
    },
    features: {
      es: [
        'Carga de contenidos multimedia',
        'Evaluaciones y quizzes',
        'Foros y mensajería',
        'Métricas de progreso',
      ],
      en: [
        'Multimedia content upload',
        'Assessments and quizzes',
        'Forums and messaging',
        'Progress metrics',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gestion-biblioteca',
    name: { es: 'Gestión de Biblioteca', en: 'Library Management' },
    sector: 'educacion',
    shortDescription: {
      es: 'Catálogo digital, préstamos y recursos bibliográficos.',
      en: 'Digital catalog, loans and bibliographic resources.',
    },
    longDescription: {
      es: 'Sistema de gestión bibliotecaria con catálogo en línea, control de préstamos, reservas, devoluciones y administración de recursos digitales y físicos.',
      en: 'Library management system with online catalog, loan control, reservations, returns and digital and physical resource administration.',
    },
    features: {
      es: [
        'Catálogo en línea',
        'Préstamos y devoluciones',
        'Sistema de reservas',
        'Recursos digitales',
      ],
      en: [
        'Online catalog',
        'Loans and returns',
        'Reservation system',
        'Digital resources',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pagos-aranceles',
    name: { es: 'Pagos y Aranceles Online', en: 'Online Payments & Tuition' },
    sector: 'educacion',
    shortDescription: {
      es: 'Webpay, Flow y Mercado Pago para matrícula y mensualidades.',
      en: 'Webpay, Flow and Mercado Pago for enrollment and monthly fees.',
    },
    longDescription: {
      es: 'Plataforma de pagos para instituciones educacionales. Integración con Webpay, Flow, Mercado Pago y bancos. Soporte para convenios, financiamiento y cuotas.',
      en: 'Payment platform for educational institutions. Integration with Webpay, Flow, Mercado Pago and banks. Support for agreements, financing and installments.',
    },
    features: {
      es: [
        'Webpay, Flow, Mercado Pago',
        'Convenios y financiamiento',
        'Comprobantes automáticos',
        'Cobranza y seguimiento',
      ],
      en: [
        'Webpay, Flow, Mercado Pago',
        'Agreements and financing',
        'Automatic receipts',
        'Collection and tracking',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'titulos-egresados',
    name: { es: 'Títulos y Egresados', en: 'Degrees & Alumni' },
    sector: 'educacion',
    shortDescription: {
      es: 'Emisión de certificados, verificación pública y seguimiento de alumni.',
      en: 'Certificate issuance, public verification and alumni tracking.',
    },
    longDescription: {
      es: 'Sistema de emisión de títulos y certificaciones con verificación pública en línea. Seguimiento de egresados, encuestas y red de alumni.',
      en: 'Degree and certification issuance system with online public verification. Alumni tracking, surveys and alumni network.',
    },
    features: {
      es: [
        'Emisión de certificados digitales',
        'Verificación pública en línea',
        'Seguimiento de egresados',
        'Red de alumni',
      ],
      en: [
        'Digital certificate issuance',
        'Public online verification',
        'Alumni tracking',
        'Alumni network',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  },

  // RETAIL — plantillas adaptativas
  {
    id: 'pos',
    name: { es: 'Punto de Venta (POS)', en: 'Point of Sale (POS)' },
    sector: 'retail',
    shortDescription: {
      es: 'Terminal táctil, boleta SII y operación rápida.',
      en: 'Touch terminal, SII receipt and fast operation.',
    },
    longDescription: {
      es: 'Sistema de punto de venta para tiendas y cadenas. Terminal táctil, gestión de productos, descuentos, medios de pago, integración con boleta electrónica SII y sincronización con inventario.',
      en: 'Point of sale system for stores and chains. Touch terminal, product management, discounts, payment methods, SII electronic receipt integration and inventory sync.',
    },
    features: {
      es: [
        'Terminal táctil optimizado',
        'Boleta electrónica SII',
        'Múltiples medios de pago',
        'Sincronización con inventario',
      ],
      en: [
        'Optimized touch terminal',
        'SII electronic receipts',
        'Multiple payment methods',
        'Inventory sync',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'inventario-multisucursal',
    name: { es: 'Inventario Multi-sucursal', en: 'Multi-branch Inventory' },
    sector: 'retail',
    shortDescription: {
      es: 'Stock centralizado, traspasos y mermas.',
      en: 'Centralized stock, transfers and losses.',
    },
    longDescription: {
      es: 'Sistema de inventario para operaciones con múltiples sucursales. Stock centralizado, traspasos entre locales, control de mermas y reportes consolidados.',
      en: 'Inventory system for multi-branch operations. Centralized stock, inter-store transfers, loss control and consolidated reports.',
    },
    features: {
      es: [
        'Stock centralizado',
        'Traspasos entre sucursales',
        'Control de mermas',
        'Reportes consolidados',
      ],
      en: [
        'Centralized stock',
        'Inter-branch transfers',
        'Loss control',
        'Consolidated reports',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
  },

  // EMPRESAS — plantillas adaptativas y desarrollo a medida
  {
    id: 'fabrica-software',
    name: { es: 'Fábrica de Software (A medida)', en: 'Software Factory (Custom Development)' },
    sector: 'empresas',
    shortDescription: {
      es: 'Diseño, arquitectura y desarrollo de sistemas core a medida.',
      en: 'Design, architecture and development of custom core systems.',
    },
    longDescription: {
      es: 'Servicio de desarrollo de software end-to-end. Tomamos tus reglas de negocio y construimos aplicaciones web, móviles o de escritorio altamente escalables. Si no existe en el mercado, nosotros lo construimos.',
      en: 'End-to-end software development service. We take your business rules and build highly scalable web, mobile or desktop applications. If it does not exist in the market, we build it.',
    },
    features: {
      es: [
        'Arquitectura en la nube (AWS/Azure)',
        'Desarrollo Web y Móvil (React/Node)',
        'Diseño UI/UX de alto estándar',
        'Soporte y mantención continua',
      ],
      en: [
        'Cloud architecture (AWS/Azure)',
        'Web and Mobile Development (React/Node)',
        'High standard UI/UX design',
        'Continuous support and maintenance',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gestion-documental',
    name: { es: 'Gestión Documental', en: 'Document Management' },
    sector: 'empresas',
    shortDescription: {
      es: 'Repositorio, versiones, firma y búsqueda.',
      en: 'Repository, versioning, signature and search.',
    },
    longDescription: {
      es: 'Plataforma de gestión documental empresarial. Repositorio centralizado, control de versiones, búsqueda full-text, firma electrónica y flujos de aprobación.',
      en: 'Enterprise document management platform. Centralized repository, version control, full-text search, electronic signature and approval workflows.',
    },
    features: {
      es: [
        'Repositorio centralizado',
        'Control de versiones',
        'Firma electrónica',
        'Búsqueda full-text',
      ],
      en: [
        'Centralized repository',
        'Version control',
        'Electronic signature',
        'Full-text search',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'automatizacion-workflows',
    name: { es: 'Automatización de Workflows', en: 'Workflow Automation' },
    sector: 'empresas',
    shortDescription: {
      es: 'Aprobaciones, notificaciones e integraciones automatizadas.',
      en: 'Approvals, notifications and automated integrations.',
    },
    longDescription: {
      es: 'Automatización de procesos internos: aprobaciones, notificaciones, integraciones entre sistemas, RPA ligero y orquestación de tareas repetitivas.',
      en: 'Internal process automation: approvals, notifications, system integrations, light RPA and repetitive task orchestration.',
    },
    features: {
      es: [
        'Workflows configurables',
        'Aprobaciones multinivel',
        'Integraciones entre sistemas',
        'Notificaciones automáticas',
      ],
      en: [
        'Configurable workflows',
        'Multi-level approvals',
        'System integrations',
        'Automatic notifications',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'integracion-sistemas',
    name: { es: 'Integración de Sistemas', en: 'Systems Integration' },
    sector: 'empresas',
    shortDescription: {
      es: 'ERPs, APIs públicas y sistemas legacy.',
      en: 'ERPs, public APIs and legacy systems.',
    },
    longDescription: {
      es: 'Conectamos sistemas legacy con plataformas modernas. APIs, ESB, ETL, iPaaS y adaptadores específicos para ERPs y sistemas chilenos (SII, previred, etc.).',
      en: 'We connect legacy systems with modern platforms. APIs, ESB, ETL, iPaaS and specific adapters for ERPs and Chilean systems (SII, previred, etc.).',
    },
    features: {
      es: [
        'Conectores para ERPs',
        'Integración con SII y Previred',
        'APIs REST y SOAP',
        'Middleware de traducción',
      ],
      en: [
        'ERP connectors',
        'SII and Previred integration',
        'REST and SOAP APIs',
        'Translation middleware',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },

  // LOGÍSTICA — soluciones operacionales
  {
    id: 'control-flota',
    name: { es: 'Control de Flota y Despachos', en: 'Fleet & Dispatch Control' },
    sector: 'logistica',
    shortDescription: {
      es: 'Seguimiento de vehículos, rutas y estado de entregas en tiempo real.',
      en: 'Vehicle tracking, routes and delivery status in real time.',
    },
    longDescription: {
      es: 'Sistema de control de flota para empresas de transporte y distribución. Asignación de rutas, seguimiento GPS, estado de despachos, confirmación de entrega y reportes de eficiencia por conductor y vehículo.',
      en: 'Fleet control system for transport and distribution companies. Route assignment, GPS tracking, dispatch status, delivery confirmation and efficiency reports per driver and vehicle.',
    },
    features: {
      es: [
        'Mapa con ubicación de flota en vivo',
        'Asignación y optimización de rutas',
        'Confirmación de entrega digital',
        'Reportes de eficiencia y kilometraje',
      ],
      en: [
        'Live fleet location map',
        'Route assignment and optimization',
        'Digital delivery confirmation',
        'Efficiency and mileage reports',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'inventario-bodega',
    name: { es: 'Inventario y Gestión de Bodega', en: 'Warehouse & Inventory Management' },
    sector: 'logistica',
    shortDescription: {
      es: 'Stock en tiempo real, ubicaciones, recepciones y despachos.',
      en: 'Real-time stock, locations, receipts and dispatches.',
    },
    longDescription: {
      es: 'Sistema WMS para control de bodegas y centros de distribución. Gestión de ubicaciones, recepciones, preparación de pedidos, despacho y trazabilidad de productos desde la entrada hasta la salida.',
      en: 'WMS system for warehouse and distribution center control. Location management, receipts, order preparation, dispatch and product traceability from entry to exit.',
    },
    features: {
      es: [
        'Control de ubicaciones en bodega',
        'Recepciones y despachos digitales',
        'Trazabilidad por lote y serie',
        'Alertas de stock mínimo',
      ],
      en: [
        'Warehouse location control',
        'Digital receipts and dispatches',
        'Batch and serial traceability',
        'Minimum stock alerts',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'trazabilidad-envios',
    name: { es: 'Portal de Trazabilidad de Envíos', en: 'Shipment Tracking Portal' },
    sector: 'logistica',
    shortDescription: {
      es: 'Portal para clientes donde consultan el estado de sus pedidos.',
      en: 'Customer portal where they track the status of their orders.',
    },
    longDescription: {
      es: 'Portal público o privado para que los clientes consulten el estado de sus pedidos sin tener que llamar. Tracking en línea, notificaciones automáticas por email/SMS y historial de envíos.',
      en: 'Public or private portal for customers to check the status of their orders without calling. Online tracking, automatic email/SMS notifications and shipment history.',
    },
    features: {
      es: [
        'Tracking en línea con mapa',
        'Notificaciones por email y SMS',
        'Historial de envíos del cliente',
        'Estado en tiempo real',
      ],
      en: [
        'Online tracking with map',
        'Email and SMS notifications',
        'Customer shipment history',
        'Real-time status',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gestion-pedidos',
    name: { es: 'Gestión de Pedidos y Órdenes', en: 'Order Management System' },
    sector: 'logistica',
    shortDescription: {
      es: 'Desde la orden hasta la entrega: todo controlado en un solo sistema.',
      en: 'From order to delivery: everything controlled in one system.',
    },
    longDescription: {
      es: 'Sistema de gestión de órdenes que integra ventas, bodega y despacho. Recepción de pedidos, asignación a bodega, preparación, despacho y confirmación de entrega en un flujo unificado.',
      en: 'Order management system integrating sales, warehouse and dispatch. Order reception, warehouse assignment, preparation, dispatch and delivery confirmation in a unified flow.',
    },
    features: {
      es: [
        'Recepción y priorización de pedidos',
        'Asignación automática a bodega',
        'Seguimiento de preparación',
        'Confirmación de entrega',
      ],
      en: [
        'Order receipt and prioritization',
        'Automatic warehouse assignment',
        'Preparation tracking',
        'Delivery confirmation',
      ],
    },
    origin: 'template',
    image:
      'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1200&q=80',
  },
];

export const getSolutionsBySector = (sectorId: SectorId): Solution[] =>
  solutions.filter((s) => s.sector === sectorId);

export const getSolution = (id: string): Solution | undefined =>
  solutions.find((s) => s.id === id);

export const getSectorForSolution = (sectorId: SectorId) =>
  sectors.find((s) => s.id === sectorId);
