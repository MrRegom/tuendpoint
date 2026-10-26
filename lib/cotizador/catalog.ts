/**
 * Datos oficiales de Soluciones tuEndpoint SpA para cotizaciones y licitaciones
 * de Mercado Público (ChileCompra) y clientes privados.
 */

export interface CompanyData {
  razonSocial: string;
  rut: string;
  giro: string;
  direccion: string;
  ciudad: string;
  pais: string;
  email: string;
  telefono: string;
  web: string;
  habilidadMercadoPublico: {
    estado: 'HÁBIL';
    registro: 'Registro de Proveedores del Estado (ChileCompra)';
    detalles: 'Habilitado para contratar con organismos del Estado (Hospitales, Municipalidades, Servicios Públicos, Ministerios).';
  };
  sii: {
    regimen: 'Facturación y Boleta Electrónica DTE';
    casaMatriz: 'Reñaca Norte 265 Of. 510 R, Viña del Mar';
  };
  banco: {
    titular: string;
    rut: string;
    banco: string;
    tipoCuenta: string;
    email: string;
  };
}

export const TUENDPOINT_COMPANY: CompanyData = {
  razonSocial: 'SOLUCIONES TUENDPOINT SPA',
  rut: '78.411.033-8',
  giro: 'SERVICIOS TECNOLÓGICOS, PORTALES WEB, COM. ONLINE DE COMPUTADORES',
  direccion: 'Reñaca Norte 265, Of. 510 R',
  ciudad: 'Viña del Mar',
  pais: 'Chile',
  email: 'contacto@tuendpoint.cl',
  telefono: '+56 9 492 5337',
  web: 'https://tuendpoint.cl',
  habilidadMercadoPublico: {
    estado: 'HÁBIL',
    registro: 'Registro de Proveedores del Estado (ChileCompra)',
    detalles:
      'Habilitado para contratar con organismos del Estado (Hospitales, Municipalidades, Servicios Públicos, Ministerios).',
  },
  sii: {
    regimen: 'Facturación y Boleta Electrónica DTE',
    casaMatriz: 'Reñaca Norte 265 Of. 510 R, Viña del Mar',
  },
  banco: {
    titular: 'SOLUCIONES TUENDPOINT SPA',
    rut: '78.411.033-8',
    banco: 'Banco de Chile / Santander',
    tipoCuenta: 'Cuenta Corriente',
    email: 'contacto@tuendpoint.cl',
  },
};

export interface QuoteItem {
  id: string;
  codigo?: string;
  categoria: 'software' | 'hardware' | 'servicio' | 'soporte' | 'personalizado';
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad: 'Unidad' | 'Licencia' | 'Mes' | 'Servicio' | 'Hora' | 'Proyecto';
  precioUnitarioNeto: number;
}

export interface QuoteTemplate {
  id: string;
  nombre: string;
  tag: string;
  icono: string;
  descripcion: string;
  organismoSugerido: string;
  tipo: 'licitacion' | 'compra_agil' | 'privada';
  items: Omit<QuoteItem, 'id'>[];
  condiciones: {
    validezDias: number;
    plazoEntrega: string;
    garantia: string;
    formaPago: string;
  };
}

export const CATALOG_ITEMS: Omit<QuoteItem, 'id'>[] = [
  // --- GESTOR DE FILAS ---
  {
    codigo: 'FILAS-SW-01',
    categoria: 'software',
    nombre: 'Software Gestor de Filas Hospitalario / Atención Ciudadana',
    descripcion:
      'Plataforma web de turnos y filas con llamada por voz sintetizada en pantalla TV, módulos de prioridad Ley 20.584 (adulto mayor, embarazadas, movilidad reducida), panel de ventanillas y panel en vivo de métricas de espera y tiempos de atención.',
    cantidad: 1,
    unidad: 'Licencia',
    precioUnitarioNeto: 1850000,
  },
  {
    codigo: 'FILAS-TOTEM-HW',
    categoria: 'hardware',
    nombre: 'Tótem de Autoatención Táctil 21.5" + Impresora Térmica 80mm',
    descripcion:
      'Tótem metálico antivandálico con pantalla táctil capacitiva 21.5" Full HD, mini PC industrial incorporado, impresora térmica de tickets 80mm con autocorte y lector de código de barras/cédula de identidad (RUT).',
    cantidad: 1,
    unidad: 'Unidad',
    precioUnitarioNeto: 1450000,
  },
  {
    codigo: 'FILAS-PANTALLA-KIT',
    categoria: 'hardware',
    nombre: 'Kit Pantalla TV Smart 43" + Mini PC Receptor de Llamados',
    descripcion:
      'Pantalla 43" 4K UHD para sala de espera, soporte mural inclinable y micro receptor HDMI industrial con conexión Wi-Fi/Ethernet para reproducción de llamados por voz y multimedia informativa.',
    cantidad: 1,
    unidad: 'Unidad',
    precioUnitarioNeto: 420000,
  },

  // --- TICPANEL ---
  {
    codigo: 'TIC-SW-01',
    categoria: 'software',
    nombre: 'TICPanel — Mesa de Ayuda (HelpDesk) & Control de Inventario TIC',
    descripcion:
      'Sistema de tickets de soporte técnico con SLA de atención, asignación automática a técnicos, inventario con código QR y generación de Actas de Entrega/Devolución de equipos con firma digital.',
    cantidad: 1,
    unidad: 'Licencia',
    precioUnitarioNeto: 1600000,
  },
  {
    codigo: 'TIC-MNT-ANUAL',
    categoria: 'soporte',
    nombre: 'Soporte Técnico Especializado & Mantenimiento TICPanel (Anual)',
    descripcion:
      'Mesa de soporte nivel 2 y 3, respaldos automáticos diarios, actualizaciones normativas y de seguridad, con tiempo de respuesta garantizado menor a 2 horas para incidentes críticos.',
    cantidad: 12,
    unidad: 'Mes',
    precioUnitarioNeto: 180000,
  },

  // --- LOGÍSTICA TBA ---
  {
    codigo: 'TBA-SW-01',
    categoria: 'software',
    nombre: 'Logística TBA — Sistema Integral de Bodega, Solicitudes & Activos Fijos',
    descripcion:
      'Plataforma integral para gestión de inventario, stock crítico, solicitudes internas de insumos por departamento, órdenes de compra, control de pre-recepción y trazabilidad completa de activos institucionales.',
    cantidad: 1,
    unidad: 'Licencia',
    precioUnitarioNeto: 1950000,
  },

  // --- CAJAYA ---
  {
    codigo: 'CAJAYA-SW-01',
    categoria: 'software',
    nombre: 'CajaYA — Software POS Inteligente con Modo Offline + DTE SII',
    descripcion:
      'Punto de venta rápido que opera con o sin conexión a internet, control de turnos de caja con arqueo ciego, control de inventario en tiempo real e integración directa a Boletas y Facturas Electrónicas autorizadas por el SII.',
    cantidad: 1,
    unidad: 'Licencia',
    precioUnitarioNeto: 980000,
  },
  {
    codigo: 'CAJAYA-HW-KIT',
    categoria: 'hardware',
    nombre: 'Kit Terminal Punto de Venta (Impresora Térmica + Gaveta + Lector)',
    descripcion:
      'Impresora térmica de boletas 80mm USB/Red, gaveta de dinero reforzada automática 4 billetes / 8 monedas y lector de código de barras 2D láser omnidireccional.',
    cantidad: 1,
    unidad: 'Unidad',
    precioUnitarioNeto: 360000,
  },

  // --- PAGINAGO ---
  {
    codigo: 'PAGINAGO-COM',
    categoria: 'software',
    nombre: 'PaginaGo — Catálogo Web Transaccional Integrado a WhatsApp',
    descripcion:
      'Catálogo online ultrarrápido sin burocracia, optimizado para conversión móvil, sincronización de stock y recepción directa de pedidos confirmados en WhatsApp corporativo.',
    cantidad: 1,
    unidad: 'Licencia',
    precioUnitarioNeto: 480000,
  },

  // --- AUTOMATIZACIONES & DESARROLLO A MEDIDA ---
  {
    codigo: 'AUTO-RPA-01',
    categoria: 'software',
    nombre: 'Módulo de Automatización de Procesos (RPA & Integraciones API)',
    descripcion:
      'Desarrollo e implementación de bots y pipelines de sincronización automática entre sistemas legados, correo, planillas, ERP y servicios del Estado (SII, Tesorería o plataformas internas).',
    cantidad: 1,
    unidad: 'Servicio',
    precioUnitarioNeto: 1750000,
  },
  {
    codigo: 'DEV-MEDIDA-HORA',
    categoria: 'servicio',
    nombre: 'Desarrollo de Software a Medida / Horas de Ingeniería Senior',
    descripcion:
      'Paquete de horas de desarrollo fullstack, arquitectura de bases de datos, seguridad informática, pruebas QA y puesta en marcha con documentación técnica formal.',
    cantidad: 40,
    unidad: 'Hora',
    precioUnitarioNeto: 38000,
  },

  // --- SERVICIOS & CAPACITACIÓN ---
  {
    codigo: 'SRV-IMPL-01',
    categoria: 'servicio',
    nombre: 'Instalación, Despliegue en Servidores & Puesta en Marcha',
    descripcion:
      'Configuración de base de datos, aprovisionamiento de certificados SSL, parametrización de usuarios/roles, pruebas de estrés y puesta en producción.',
    cantidad: 1,
    unidad: 'Servicio',
    precioUnitarioNeto: 350000,
  },
  {
    codigo: 'SRV-CAPAC-01',
    categoria: 'servicio',
    nombre: 'Capacitación Certificada a Usuarios Operativos & Administradores',
    descripcion:
      'Sesiones teórico-prácticas presenciales o por videoconferencia para usuarios finales y administradores de sistema, con entrega de manuales en PDF y actas de capacitación.',
    cantidad: 1,
    unidad: 'Servicio',
    precioUnitarioNeto: 280000,
  },
];

export const QUOTATION_TEMPLATES: QuoteTemplate[] = [
  {
    id: 'hospital_filas',
    nombre: 'Gestor de Filas Hospitalario Completo',
    tag: 'Salud · Hospital / Cesfam',
    icono: '🏥',
    descripcion:
      'Solución integral para salas de espera y farmacia: Tótem táctil de autoatención, software de llamado con voz y pantalla TV.',
    organismoSugerido: 'Servicio de Salud / Hospital Clínico / Cesfam',
    tipo: 'licitacion',
    items: [
      {
        codigo: 'FILAS-SW-01',
        categoria: 'software',
        nombre: 'Software Gestor de Filas Hospitalario / Atención Ciudadana',
        descripcion:
          'Plataforma web de turnos y filas con llamada por voz sintetizada en pantalla TV, módulos de prioridad Ley 20.584 (adulto mayor, embarazadas, movilidad reducida), panel de ventanillas y panel en vivo de métricas de espera y tiempos de atención.',
        cantidad: 1,
        unidad: 'Licencia',
        precioUnitarioNeto: 1850000,
      },
      {
        codigo: 'FILAS-TOTEM-HW',
        categoria: 'hardware',
        nombre: 'Tótem de Autoatención Táctil 21.5" + Impresora Térmica 80mm',
        descripcion:
          'Tótem metálico antivandálico con pantalla táctil capacitiva 21.5" Full HD, mini PC industrial incorporado, impresora térmica de tickets 80mm con autocorte y lector de código de barras/cédula de identidad (RUT).',
        cantidad: 1,
        unidad: 'Unidad',
        precioUnitarioNeto: 1450000,
      },
      {
        codigo: 'FILAS-PANTALLA-KIT',
        categoria: 'hardware',
        nombre: 'Kit Pantalla TV Smart 43" + Mini PC Receptor de Llamados',
        descripcion:
          'Pantalla 43" 4K UHD para sala de espera, soporte mural inclinable y micro receptor HDMI industrial con conexión Wi-Fi/Ethernet para reproducción de llamados por voz y multimedia informativa.',
        cantidad: 2,
        unidad: 'Unidad',
        precioUnitarioNeto: 420000,
      },
      {
        codigo: 'SRV-IMPL-01',
        categoria: 'servicio',
        nombre: 'Instalación, Despliegue en Servidores & Puesta en Marcha',
        descripcion:
          'Configuración de base de datos, aprovisionamiento de certificados SSL, parametrización de usuarios/roles, pruebas de estrés y puesta en producción en red institucional.',
        cantidad: 1,
        unidad: 'Servicio',
        precioUnitarioNeto: 350000,
      },
      {
        codigo: 'SRV-CAPAC-01',
        categoria: 'servicio',
        nombre: 'Capacitación Certificada a Usuarios Operativos & Administradores',
        descripcion:
          'Sesiones presenciales para funcionarios de admisión, farmacia y jefaturas de servicio, con entrega de manuales en PDF y actas de capacitación conforme a bases.',
        cantidad: 1,
        unidad: 'Servicio',
        precioUnitarioNeto: 280000,
      },
    ],
    condiciones: {
      validezDias: 60,
      plazoEntrega: '15 a 20 días hábiles tras recepción de la Orden de Compra.',
      garantia: '12 meses de garantía técnica sobre software y componentes de hardware.',
      formaPago: '30 días contra recepción conforme y factura electrónica emitida.',
    },
  },
  {
    id: 'ticpanel_institucion',
    nombre: 'TICPanel — Mesa de Ayuda & Control de Activos TIC',
    tag: 'Educación / Institución',
    icono: '🎓',
    descripcion:
      'Sistema para soporte técnico institucional, gestión de tickets, actas digitales de entrega de equipos e inventario con código QR.',
    organismoSugerido: 'DAEM / Universidad / Servicio Público',
    tipo: 'licitacion',
    items: [
      {
        codigo: 'TIC-SW-01',
        categoria: 'software',
        nombre: 'TICPanel — Mesa de Ayuda (HelpDesk) & Control de Inventario TIC',
        descripcion:
          'Sistema de tickets de soporte técnico con SLA de atención, asignación automática a técnicos, inventario con código QR y generación de Actas de Entrega/Devolución de equipos con firma digital.',
        cantidad: 1,
        unidad: 'Licencia',
        precioUnitarioNeto: 1600000,
      },
      {
        codigo: 'SRV-IMPL-01',
        categoria: 'servicio',
        nombre: 'Instalación, Despliegue en Servidores & Puesta en Marcha',
        descripcion:
          'Instalación en infraestructura cloud o servidores locales de la institución, migración de base de datos inicial de equipos e integración con usuarios LDAP/Active Directory.',
        cantidad: 1,
        unidad: 'Servicio',
        precioUnitarioNeto: 350000,
      },
      {
        codigo: 'TIC-MNT-ANUAL',
        categoria: 'soporte',
        nombre: 'Soporte Técnico Especializado & Mantenimiento TICPanel (Anual)',
        descripcion:
          'Mesa de soporte nivel 2 y 3, respaldos automáticos diarios, actualizaciones normativas y de seguridad, con tiempo de respuesta garantizado menor a 2 horas.',
        cantidad: 12,
        unidad: 'Mes',
        precioUnitarioNeto: 180000,
      },
    ],
    condiciones: {
      validezDias: 45,
      plazoEntrega: '10 días hábiles a contar de la notificación formal de adjudicación.',
      garantia: '12 meses de garantía de soporte y actualizaciones.',
      formaPago: '30 días contra factura electrónica y recepción conforme de DAEM / Adquisiciones.',
    },
  },
  {
    id: 'cajaya_pos',
    nombre: 'CajaYA — Sistema Punto de Venta + Boleta Electrónica SII',
    tag: 'Retail / Comercio / Farmacia',
    icono: '🛒',
    descripcion:
      'Cajas rápidas con funcionamiento offline, arqueo ciego, turnos y emisión de documentos tributarios autorizados por el SII.',
    organismoSugerido: 'Empresa Privada / Corporación Municipal',
    tipo: 'compra_agil',
    items: [
      {
        codigo: 'CAJAYA-SW-01',
        categoria: 'software',
        nombre: 'CajaYA — Software POS Inteligente con Modo Offline + DTE SII',
        descripcion:
          'Punto de venta rápido que opera con o sin conexión a internet, control de turnos de caja con arqueo ciego, control de inventario en tiempo real e integración directa a Boletas y Facturas Electrónicas autorizadas por el SII.',
        cantidad: 1,
        unidad: 'Licencia',
        precioUnitarioNeto: 980000,
      },
      {
        codigo: 'CAJAYA-HW-KIT',
        categoria: 'hardware',
        nombre: 'Kit Terminal Punto de Venta (Impresora Térmica + Gaveta + Lector)',
        descripcion:
          'Impresora térmica de boletas 80mm USB/Red, gaveta de dinero reforzada automática 4 billetes / 8 monedas y lector de código de barras 2D láser omnidireccional.',
        cantidad: 1,
        unidad: 'Unidad',
        precioUnitarioNeto: 360000,
      },
      {
        codigo: 'SRV-IMPL-01',
        categoria: 'servicio',
        nombre: 'Puesta en Marcha & Certificación con Certificado Digital SII',
        descripcion:
          'Carga de certificado digital tributario, enrolamiento en el SII, pruebas de emisión DTE y capacitación al cajero y supervisor.',
        cantidad: 1,
        unidad: 'Servicio',
        precioUnitarioNeto: 250000,
      },
    ],
    condiciones: {
      validezDias: 30,
      plazoEntrega: '7 días hábiles tras emisión de orden de compra.',
      garantia: '12 meses sobre componentes de hardware y software.',
      formaPago: '50% anticipo y 50% contra entrega conforme y emisión de factura.',
    },
  },
  {
    id: 'automatizacion_a_medida',
    nombre: 'Automatización de Procesos & Conexión de Sistemas (RPA)',
    tag: 'Empresa / Operaciones',
    icono: '⚙️',
    descripcion:
      'Eliminación de tareas manuales repetitivas, cruce de planillas, integración entre ERP, correo y bases de datos.',
    organismoSugerido: 'Empresas Medianas y Grandes',
    tipo: 'privada',
    items: [
      {
        codigo: 'AUTO-RPA-01',
        categoria: 'software',
        nombre: 'Módulo de Automatización de Procesos (RPA & Integraciones API)',
        descripcion:
          'Desarrollo e implementación de bots y pipelines de sincronización automática entre sistemas legados, correo, planillas, ERP y servicios externos.',
        cantidad: 1,
        unidad: 'Servicio',
        precioUnitarioNeto: 1850000,
      },
      {
        codigo: 'DEV-MEDIDA-HORA',
        categoria: 'servicio',
        nombre: 'Ingeniería de Integración & Pruebas en Ambiente Real',
        descripcion:
          'Horas de desarrollo para adaptadores personalizados, tratamiento de excepciones, logs de auditoría y monitoreo de fallas.',
        cantidad: 30,
        unidad: 'Hora',
        precioUnitarioNeto: 38000,
      },
      {
        codigo: 'SRV-CAPAC-01',
        categoria: 'servicio',
        nombre: 'Entrega de Documentación de Arquitectura & Traspaso Técnico',
        descripcion:
          'Manual de administración, código documentado, diagramas de flujo y soporte de garantía durante el primer mes de operación.',
        cantidad: 1,
        unidad: 'Servicio',
        precioUnitarioNeto: 280000,
      },
    ],
    condiciones: {
      validezDias: 30,
      plazoEntrega: '20 días hábiles distribuidos en sprints quincenales.',
      garantia: '6 meses de garantía técnica post-entrega.',
      formaPago: 'Contra hitos de entrega aprobados.',
    },
  },
];

/**
 * Convierte un número entero a texto en español chileno formal para licitaciones.
 * Ej: 3570000 -> "Tres millones quinientos setenta mil pesos chilenos"
 */
export function numeroAPalabras(monto: number): string {
  const n = Math.floor(Math.abs(monto));
  if (n === 0) return 'Cero pesos chilenos';

  const unidades = [
    '',
    'un',
    'dos',
    'tres',
    'cuatro',
    'cinco',
    'seis',
    'siete',
    'ocho',
    'nueve',
  ];
  const especiales = [
    'diez',
    'once',
    'doce',
    'trece',
    'catorce',
    'quince',
    'dieciséis',
    'diecisiete',
    'dieciocho',
    'diecinueve',
  ];
  const decenas = [
    '',
    '',
    'veinte',
    'treinta',
    'cuarenta',
    'cincuenta',
    'sesenta',
    'setenta',
    'ochenta',
    'noventa',
  ];
  const centenas = [
    '',
    'ciento',
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos',
  ];

  function seccion(num: number): string {
    let out = '';
    const c = Math.floor(num / 100);
    const d = Math.floor((num % 100) / 10);
    const u = num % 10;

    if (num === 100) return 'cien';
    if (c > 0) out += centenas[c] + ' ';

    if (d === 1) {
      out += especiales[u] + ' ';
    } else if (d === 2) {
      if (u === 0) out += 'veinte ';
      else if (u === 1) out += 'veintiún ';
      else out += 'veinti' + unidades[u] + ' ';
    } else if (d > 2) {
      out += decenas[d];
      if (u > 0) out += ' y ' + unidades[u];
      out += ' ';
    } else if (u > 0) {
      out += unidades[u] + ' ';
    }

    return out.trim();
  }

  const millones = Math.floor(n / 1000000);
  const miles = Math.floor((n % 1000000) / 1000);
  const resto = n % 1000;

  let resultado = '';

  if (millones > 0) {
    if (millones === 1) resultado += 'un millón ';
    else resultado += seccion(millones) + ' millones ';
  }

  if (miles > 0) {
    if (miles === 1) resultado += 'mil ';
    else resultado += seccion(miles) + ' mil ';
  }

  if (resto > 0) {
    resultado += seccion(resto) + ' ';
  }

  const texto = resultado.trim() + ' pesos chilenos';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Formatea montos en pesos chilenos ($ 1.450.000) */
export function formatCLP(val: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(val);
}

/** Formatea fecha en español DD de Mes de YYYY */
export function formatFechaChile(isoString?: string): string {
  const d = isoString ? new Date(isoString) : new Date();
  return d.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
