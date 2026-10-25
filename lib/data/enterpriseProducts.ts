export interface EnterpriseProduct {
  id: string;
  name: string;
  code: string;
  category: string;
  badge: string;
  tagline: {
    es: string;
    en: string;
  };
  summary: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  provenIn: {
    name: string;
    role: string;
    badge: string;
  };
  metrics: {
    label: { es: string; en: string };
    value: string;
    hint: { es: string; en: string };
  }[];
  capabilities: {
    title: { es: string; en: string };
    desc: { es: string; en: string };
  }[];
  techStack: string[];
  themeColor: string;
  accentGlow: string;
  portalPortalId: string;
  demoUrl?: string;
  githubUrl?: string;
  localPath?: string;
  portalView: {
    terminalCommand: string;
    hudStatus: string;
    architectureType: string;
  };
}

export const ENTERPRISE_PRODUCTS: EnterpriseProduct[] = [
  {
    id: 'ticpanel',
    name: 'TICPanel',
    code: 'PROD_01//HOSPITAL_NOC',
    category: 'Salud & Infraestructura Crítica',
    badge: 'Producción Activa · Hospital Dr. Gustavo Fricke',
    tagline: {
      es: 'Telemetría viva, gestión de parque tecnológico y mesa de ayuda hospitalaria.',
      en: 'Live telemetry, hospital IT asset management and service desk.',
    },
    summary: {
      es: 'Plataforma central que monitorea en vivo más de 1.500 computadores y periféricos con telemetría cada 30 segundos, centro de alertas tempranas, mesa de ayuda con SLA estricto y actas digitales con PDF.',
      en: 'Central platform monitoring 1,500+ endpoints via 30s telemetry, proactive alert center, SLA-driven service desk and digital delivery acts.',
    },
    description: {
      es: 'Desarrollada para soportar la exigencia 24/7 de un hospital de alta complejidad. Los computadores se auto-descubren y actualizan en tiempo real mediante un agente PowerShell seguro. Incluye gestión de inventario clínico, hoja de vida forense de cada equipo, actas de entrega con firma digital, control de anexos telefónicos y Centro de Operaciones de Red (NOC).',
      en: 'Engineered for 24/7 mission-critical hospital demands. Endpoints auto-register and report through a lightweight PowerShell agent. Features complete device lifecycle, alert automation, digital sign-off acts and network operations center (NOC).',
    },
    provenIn: {
      name: 'Hospital Dr. Gustavo Fricke',
      role: 'Unidad TIC / Gestión de Equipos',
      badge: 'Hospital de Alta Complejidad',
    },
    metrics: [
      {
        label: { es: 'Nodos en Telemetría', en: 'Live Monitored Nodes' },
        value: '1.500+',
        hint: { es: 'Reporte activo cada 30s', en: 'Active 30s heartbeat' },
      },
      {
        label: { es: 'Disponibilidad', en: 'Uptime SLA' },
        value: '99.98%',
        hint: { es: 'Operación ininterrumpida', en: 'Non-stop clinical operation' },
      },
      {
        label: { es: 'Módulos Integrados', en: 'Core Modules' },
        value: '12',
        hint: { es: 'Tickets, NOC, Actas, Alertas', en: 'Tickets, NOC, Acts, Alerts' },
      },
    ],
    capabilities: [
      {
        title: { es: 'Telemetría Viva & Auto-descubrimiento', en: 'Live Telemetry & Auto-discovery' },
        desc: {
          es: 'El inventario se alimenta de los agentes locales; no requiere ingreso manual para registrar especificaciones, IP, usuario activo o estado.',
          en: 'Endpoints register hardware specs, IP, active user and health status automatically without manual intervention.',
        },
      },
      {
        title: { es: 'Centro de Alertas & Diagnóstico', en: 'Proactive Alert Center' },
        desc: {
          es: 'Detección automática de desconexiones prolongadas (3, 5, 7 o 15 días) para prevenir extravíos y fallas en unidades asistenciales críticas.',
          en: 'Instant notification on disconnected nodes to prevent loss and keep critical clinical stations operational.',
        },
      },
      {
        title: { es: 'Mesa de Ayuda & Trazabilidad Forense', en: 'SLA Service Desk & History' },
        desc: {
          es: 'Tickets organizados por grupos resolutores, tablero Kanban e historial cronológico imborrable de mantenimientos y movimientos por serie.',
          en: 'Planner-style ticket dispatch, resolver teams and tamper-proof chronological lifecycle timeline per device.',
        },
      },
      {
        title: { es: 'Actas Digitales con Firma & PDF', en: 'Handover Acts & PDF Engine' },
        desc: {
          es: 'Asistente de entrega de equipamiento en 3 pasos con validación de firmas y generación de documentos legales en PDF.',
          en: 'Step-by-step equipment handover flow with signature verification and official PDF document generation.',
        },
      },
    ],
    techStack: ['Django 6.0', 'PostgreSQL', 'Django-Q2', 'PowerShell Agent', 'Nginx', 'DataTables'],
    themeColor: '#0EA5E9',
    accentGlow: 'rgba(14, 165, 233, 0.25)',
    portalPortalId: 'portal-ticpanel',
    githubUrl: 'https://github.com/MrRegom/tuendpoint',
    localPath: 'C:\\proyectos\\ticpanel',
    portalView: {
      terminalCommand: 'ticpanel --telemetry=live --cluster=hgf-core',
      hudStatus: 'TELEMETRY ONLINE · 1,514 NODES PINGING',
      architectureType: 'Hospital-Grade Monolith + Agent Service',
    },
  },
  {
    id: 'gestordefilas',
    name: 'Gestor de Filas & Triage',
    code: 'PROD_02//REALTIME_QUEUE',
    category: 'Atención Masiva & Tiempo Real',
    badge: 'Producción Activa · Red Asistencial',
    tagline: {
      es: 'Atención al público en subsegundo con tótems táctiles, TV y voz sintética.',
      en: 'Sub-second public queue orchestration with touch kiosks, TV displays and synthetic voice.',
    },
    summary: {
      es: 'Sistema de turnos de alta concurrencia diseñado para hospitales y centros de alta afluencia. Llamados en pantalla en menos de 1 segundo mediante WebSockets, tótems de autoservicio con impresión térmica y tolerancia a cortes de red.',
      en: 'High-concurrency queue orchestration for hospitals and public offices. Sub-second WebSocket TV dispatch, touch totems with thermal printing and zero-downtime offline mode.',
    },
    description: {
      es: 'Reemplaza sistemas propietarios costosos y rígidos por una arquitectura moderna de micro-canales en tiempo real. Gestiona múltiples salas de espera simultáneamente, con priorización clínica por triage, pantalla de TV con voz sintetizada para el llamado de pacientes, y un modo de contingencia que continúa imprimiendo tickets incluso ante caídas de servidor.',
      en: 'Modern real-time queue platform replacing rigid legacy systems. Powers multi-unit waiting halls with priority triage, smart TV displays with browser speech synthesis, and local fallback printing so service never stops.',
    },
    provenIn: {
      name: 'Hospital Dr. Gustavo Fricke',
      role: 'Atención Ambulatoria & Urgencias',
      badge: 'Unidades de Alta Demanda',
    },
    metrics: [
      {
        label: { es: 'Latencia de Llamado', en: 'Dispatch Latency' },
        value: '< 800ms',
        hint: { es: 'Tiempo real vía WebSockets', en: 'WebSockets push to TV' },
      },
      {
        label: { es: 'Capacidad Diaria', en: 'Daily Capacity' },
        value: '5.000+',
        hint: { es: 'Tickets por jornada', en: 'Tickets served per day' },
      },
      {
        label: { es: 'Tolerancia a Fallos', en: 'Fault Tolerance' },
        value: '100%',
        hint: { es: 'Tótem imprime en modo degradado', en: 'Autonomous fallback printing' },
      },
    ],
    capabilities: [
      {
        title: { es: 'Llamados Inmediatos con Voz Sintética', en: 'Sub-second Calls & Voice Synthesis' },
        desc: {
          es: 'Cuando el funcionario presiona llamar, la TV emite sonido y voz anunciando el turno y el box en milisegundos.',
          en: 'Instant audio-visual turn call on TV displays with native speech synthesis directing patients to the right desk.',
        },
      },
      {
        title: { es: 'Tótems con Impresión Térmica ESC/POS', en: 'Touch Kiosks & ESC/POS Printers' },
        desc: {
          es: 'Agente local en Python que gestiona la impresora térmica de 80mm y reporta estado de papel en tiempo real.',
          en: 'Embedded kiosk service driving 80mm thermal receipt printers with paper-out detection and auto-recovery.',
        },
      },
      {
        title: { es: 'Arquitectura Multi-Unidad', en: 'Multi-Unit Scale' },
        desc: {
          es: 'Una sola instalación orquesta Farmacia, Toma de Muestras, Admisión y CAE con canales Redis independientes.',
          en: 'Single deployment isolated across multiple departments via scoped Redis channels and permissions.',
        },
      },
      {
        title: { es: 'Auditoría & Tiempos de Espera', en: 'Operational Analytics' },
        desc: {
          es: 'Métricas detalladas de tiempo de espera, permanencia y productividad por funcionario exportables a BI.',
          en: 'Granular waiting time, desk duration and staff throughput metrics ready for executive dashboards.',
        },
      },
    ],
    techStack: ['Django REST', 'Django Channels', 'Redis Pub/Sub', 'WebSockets', 'ESC/POS', 'Docker'],
    themeColor: '#38BDF8',
    accentGlow: 'rgba(56, 189, 248, 0.25)',
    portalPortalId: 'portal-gestorfilas',
    githubUrl: 'https://github.com/MrRegom/tuendpoint',
    localPath: 'C:\\proyectos\\gestordefilas',
    portalView: {
      terminalCommand: 'gestorfilas --channels=ws://redis:6379/1 --mode=triage',
      hudStatus: 'SOCKET STREAMING · BROADCAST LATENCY 14MS',
      architectureType: 'Event-Driven Realtime Pub/Sub',
    },
  },
  {
    id: 'tba',
    name: 'Logística TBA',
    code: 'PROD_03//EDU_ERP',
    category: 'Educación & Gestión de Recursos',
    badge: 'Producción Activa · Colegio TBA',
    tagline: {
      es: 'ERP escolar integral: bodegas, compras, activos fijos y solicitudes.',
      en: 'Institutional school ERP: inventory, procurement, fixed assets and approvals.',
    },
    summary: {
      es: 'Sistema modular de logística y recursos para instituciones educativas. Controla bodegas con stock crítico, órdenes de compra a proveedores, ciclo de vida de activos fijos asignados a docentes y portal de autoservicio de materiales.',
      en: 'Complete resource management ERP for educational institutions. Powers warehouse operations, supplier purchase orders, classroom asset custody and self-service staff requisitions.',
    },
    description: {
      es: 'Diseñado a la medida para resolver la fuga de materiales y la falta de control en colegios y universidades. Centraliza el ciclo completo: desde la solicitud del profesor en el portal interno, la aprobación directiva, la orden de compra al proveedor y la recepción en bodega, hasta la asignación final con registro auditable inmutable.',
      en: 'Custom-built to eliminate supply leakage and lack of accountability in schools. Centralizes the full lifecycle: from teacher self-service requests and administrative sign-offs to supplier purchase orders, warehouse intake and audit logs.',
    },
    provenIn: {
      name: 'Colegio TBA',
      role: 'Dirección Administrativa & Logística',
      badge: 'Establecimiento Educacional',
    },
    metrics: [
      {
        label: { es: 'Trazabilidad de Stock', en: 'Inventory Accuracy' },
        value: '100%',
        hint: { es: 'Movimientos auditados', en: 'Tamper-proof log entries' },
      },
      {
        label: { es: 'Aprobación de Compras', en: 'Procurement Flow' },
        value: '< 24 hrs',
        hint: { es: 'Flujo digital jerárquico', en: 'Hierarchical approvals' },
      },
      {
        label: { es: 'Reducción de Pérdidas', en: 'Supply Waste Cut' },
        value: '-42%',
        hint: { es: 'Control de cuotas y consumo', en: 'Quota & cost-center control' },
      },
    ],
    capabilities: [
      {
        title: { es: 'Control de Bodegas & Stock Crítico', en: 'Warehouse & Critical Stock' },
        desc: {
          es: 'Alertas tempranas de desabastecimiento, ubicación en estanterías físicas y registro estricto de entradas y salidas.',
          en: 'Automated threshold alerts, shelf location mapping and verified intake/dispatch balance.',
        },
      },
      {
        title: { es: 'Activos Fijos con Hoja de Vida', en: 'Fixed Assets Custody' },
        desc: {
          es: 'Seguimiento de proyectores, computadores de laboratorio y mobiliario asignados formalmente a profesores y salas.',
          en: 'Serial-level custody tracking for lab PCs, projectors and institutional assets assigned to faculty members.',
        },
      },
      {
        title: { es: 'Portal Autoservicio de Solicitudes', en: 'Requisition Self-Service' },
        desc: {
          es: 'Los docentes piden insumos desde su teléfono con flujo jerárquico: Pendiente, Aprobado, Entregado.',
          en: 'Faculty requests classroom materials via mobile with real-time approval pipelines.',
        },
      },
      {
        title: { es: 'Auditoría Continua Inmutable', en: 'Continuous Audit Log' },
        desc: {
          es: 'Middleware que registra cada inserción, edición o baja con marca temporal y usuario responsable para rendición de cuentas.',
          en: 'Audit middleware tracking all data mutations for compliance and accountability inspections.',
        },
      },
    ],
    techStack: ['Python 3.13', 'Django 5', 'PostgreSQL', 'ApexCharts', 'Bootstrap 5', 'Gulp'],
    themeColor: '#10B981',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    portalPortalId: 'portal-tba',
    githubUrl: 'https://github.com/MrRegom/tba',
    portalView: {
      terminalCommand: 'tba-erp --verify-inventory --compliance=active',
      hudStatus: 'AUDIT LOG SYNCED · ZERO ANOMALIES',
      architectureType: 'Institutional Resource ERP',
    },
  },
  {
    id: 'paginago',
    name: 'PaginaGo',
    code: 'PROD_04//FAST_COMMERCE',
    category: 'PyMEs & Comercio Digital Ágil',
    badge: 'Solución SaaS · Comercio Digital',
    tagline: {
      es: 'Catálogos digitales ultrarrápidos con venta directa por WhatsApp en minutos.',
      en: 'Ultra-fast digital catalogs with direct WhatsApp ordering ready in minutes.',
    },
    summary: {
      es: 'Motor de catálogos y vitrinas digitales de alto rendimiento diseñado para PyMEs y marcas en crecimiento. Despliegue en minutos, carga instantánea en teléfonos y conversión directa hacia WhatsApp con carritos estructurados.',
      en: 'High-velocity digital catalog and instant e-commerce engine for SMEs. Live in minutes, ultra-light mobile load and direct-to-WhatsApp checkout with pre-filled orders.',
    },
    description: {
      es: 'Elimina las complejidades y costos prohibitivos de los e-commerce tradicionales. PaginaGo permite a cualquier empresa o negocio local publicar su catálogo de productos, gestionar stock y recibir pedidos estructurados en WhatsApp listos para cobrar, sin comisiones por venta y con la velocidad de una Progressive Web App.',
      en: 'Replaces complex, slow e-commerce platforms with a streamlined sales engine. Businesses showcase product catalogs, manage pricing and receive structured orders straight into WhatsApp without transaction fees.',
    },
    provenIn: {
      name: 'Comercio & Retail PyME',
      role: 'Canales de Venta Digital',
      badge: 'Orientado a Conversión',
    },
    metrics: [
      {
        label: { es: 'Tiempo de Despliegue', en: 'Time to Live' },
        value: '< 15 min',
        hint: { es: 'De cero a catálogo activo', en: 'From zero to selling' },
      },
      {
        label: { es: 'Velocidad de Carga', en: 'Mobile PageSpeed' },
        value: '99/100',
        hint: { es: 'Optimizado para redes móviles', en: 'Sub-second mobile rendering' },
      },
      {
        label: { es: 'Canal de Conversión', en: 'Order Channel' },
        value: 'WhatsApp',
        hint: { es: 'Carrito con mensaje listo', en: 'One-click checkout payload' },
      },
    ],
    capabilities: [
      {
        title: { es: 'Checkout Automatizado a WhatsApp', en: 'One-Click WhatsApp Orders' },
        desc: {
          es: 'El comprador arma su pedido y al presionar comprar se abre WhatsApp con el detalle exacto, cantidades y total.',
          en: 'Customers build their cart and launch WhatsApp with full itemized summary, price and address details.',
        },
      },
      {
        title: { es: 'Panel Ágil de Administración', en: 'Mobile Admin Dashboard' },
        desc: {
          es: 'Actualización de fotos, precios y stock desde el teléfono sin necesidad de diseñadores ni programadores.',
          en: 'Update inventory, banners and prices straight from a smartphone without code knowledge.',
        },
      },
      {
        title: { es: 'Optimización SEO & Compartir en Redes', en: 'Social & OpenGraph SEO' },
        desc: {
          es: 'Cada producto genera vistas previas enriquecidas para compartir en Instagram, Facebook y TikTok.',
          en: 'Rich preview cards generated for every product to boost conversion across social media feeds.',
        },
      },
      {
        title: { es: 'Sin Comisiones por Transacción', en: 'Zero Commission Model' },
        desc: {
          es: 'El 100% de la venta queda en el comercio, utilizando sus propios medios de pago o transferencias bancarias.',
          en: 'Keep 100% of revenue with direct bank transfers or chosen payment gateways.',
        },
      },
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'WhatsApp Business API', 'Vercel Edge'],
    themeColor: '#EC4899',
    accentGlow: 'rgba(236, 72, 153, 0.25)',
    portalPortalId: 'portal-paginago',
    githubUrl: 'https://github.com/MrRegom/paginago',
    portalView: {
      terminalCommand: 'paginago --generate-catalog --channel=whatsapp',
      hudStatus: 'CATALOG READY · MOBILE LATENCY 240MS',
      architectureType: 'Edge-Rendered Headless Commerce',
    },
  },
  {
    id: 'automatizaciones',
    name: 'Automatizaciones & Agentes IA',
    code: 'PROD_05//AI_RPA_CORE',
    category: 'Integraciones & Eficiencia Operativa',
    badge: 'Arquitectura Enterprise & Conectividad',
    tagline: {
      es: 'Automatización de procesos, agentes autónomos y conectores de sistemas críticos.',
      en: 'Process automation, autonomous agents and mission-critical system connectors.',
    },
    summary: {
      es: 'Diseñamos e implementamos flujos de automatización robótica (RPA), agentes de inteligencia artificial y conectores para sistemas gubernamentales (SII, FONASA), bases de datos legacy y pasarelas de pago.',
      en: 'Custom robotic process automation (RPA), autonomous AI workflows and deep bridges for government APIs (tax authority, public health), legacy databases and payment gateways.',
    },
    description: {
      es: 'Transformamos cuellos de botella manuales en tuberías digitales automatizadas de alta fidelidad. Desde agentes de IA que analizan y extraen datos de contratos o correos, hasta sincronizaciones masivas entre ERPs antiguos y sistemas en la nube, garantizamos que los datos fluyan sin fricción ni fallos humanos.',
      en: 'We eliminate repetitive operational bottlenecks with reliable background pipelines. From LLM agents extracting structured insights from documents to scheduled batch synchronizations between legacy DBs and modern clouds.',
    },
    provenIn: {
      name: 'Integraciones Corporativas & Salud',
      role: 'Arquitectura de Datos & Conectores',
      badge: 'Soluciones a Medida',
    },
    metrics: [
      {
        label: { es: 'Ahorro de Horas Hombre', en: 'Manual Effort Saved' },
        value: '-85%',
        hint: { es: 'Procesos administrativos', en: 'In repetitive backoffice tasks' },
      },
      {
        label: { es: 'Tiempo de Respuesta', en: 'Processing Latency' },
        value: 'Segundos',
        hint: { es: 'Frente a horas manuales', en: 'Versus hours of manual work' },
      },
      {
        label: { es: 'Tasa de Error Humano', en: 'Data Error Rate' },
        value: '0.01%',
        hint: { es: 'Validaciones estrictas', en: 'With strict schema checks' },
      },
    ],
    capabilities: [
      {
        title: { es: 'Conectores Críticos & APIs Públicas', en: 'Mission-Critical API Bridges' },
        desc: {
          es: 'Integración con facturación electrónica SII, previsión de salud (FONASA), estándares HL7/FHIR y banca chilena.',
          en: 'Reliable integrations with government tax authorities, healthcare clearing houses and payment rails.',
        },
      },
      {
        title: { es: 'Agentes de Inteligencia Artificial', en: 'Autonomous AI Agents' },
        desc: {
          es: 'Sistemas inteligentes que leen documentos, clasifican solicitudes, redactan respuestas y orquestan decisiones de negocio.',
          en: 'Autonomous models that parse unstructured documents, route tickets and execute workflow decisions.',
        },
      },
      {
        title: { es: 'Tuberías de Datos & Sincronización', en: 'Data Pipelines & Sync' },
        desc: {
          es: 'Buses de integración para conectar sistemas legacy on-premise con dashboards modernos en la nube.',
          en: 'Enterprise service buses synchronizing on-prem legacy databases with modern cloud infrastructure.',
        },
      },
      {
        title: { es: 'Monitoreo & Auto-Recuperación', en: 'Self-Healing Workflows' },
        desc: {
          es: 'Alertas automáticas ante inconsistencias, reintentos exponenciales y auditoría de cada transacción.',
          en: 'Automatic retries, circuit breakers and instant alert delivery on sync anomalies.',
        },
      },
    ],
    techStack: ['Python', 'LangChain', 'Redis / Celery', 'Docker', 'PostgreSQL', 'REST / SOAP'],
    themeColor: '#8B5CF6',
    accentGlow: 'rgba(139, 92, 246, 0.25)',
    portalPortalId: 'portal-automatizaciones',
    githubUrl: 'https://github.com/MrRegom/tuendpoint',
    portalView: {
      terminalCommand: 'auto-core --pipeline=active --ai-agent=orchestrator',
      hudStatus: 'AGENT PIPELINE ACTIVE · 0 FAILURES IN 24H',
      architectureType: 'Autonomous Agentic Workflow Engine',
    },
  },
];
