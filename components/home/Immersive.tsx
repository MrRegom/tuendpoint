'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Play,
  Pause,
  Tv,
  Smartphone,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Layers,
  Monitor,
  Printer,
  ChevronRight,
  X,
  Shield,
  Server,
  Cpu,
  CheckCircle,
  Maximize2,
  FileText,
  Activity,
  Terminal,
} from 'lucide-react';
import { brand } from '@/lib/config/brand';
import { TUENDPOINT_COMPANY } from '@/lib/cotizador/catalog';
import { AssistantBot } from '@/components/home/AssistantBot';
import { Typewriter } from '@/components/ui/typewriter';

/* ------------------------------------------------------------------ */
/* Tipos y Especificaciones de Producto                               */
/* ------------------------------------------------------------------ */

interface ProductHighlight {
  title: string;
  desc: string;
}

interface ScreenTab {
  id: string;
  label: string;
  type: 'img' | 'filas-tv' | 'filas-totem' | 'auto-monitor';
  src?: string;
  badge?: string;
  click?: [number, number]; // coordenadas normalizadas [x, y] de 0 a 1
  actionText?: string;
}

interface ProductShowcase {
  id: string;
  name: string;
  shortName: string;
  category: string;
  badge: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  architectureDetails: {
    title: string;
    description: string;
    points: string[];
  };
  highlights: ProductHighlight[];
  screens: ScreenTab[];
  externalUrl?: string;
  ctaText: string;
}

const PRODUCTS: ProductShowcase[] = [
  {
    id: 'filas',
    name: 'Gestor de Filas Hospitalario',
    shortName: 'Gestor de Filas',
    category: 'Salud Pública & Atención Presencial',
    badge: 'Ley 20.584 · Producción en Hospitales',
    tagline: 'Llamado por voz sintetizada en pantallas TV y tótems táctiles de autoatención con RUT',
    shortDescription:
      'Erradica las aglomeraciones caóticas en salas de espera y farmacias mediante pantallas informativas con audio de voz chilena y tótems táctiles de autoatención.',
    fullDescription:
      'Plataforma integral diseñada para erradicar las salas de espera caóticas en hospitales de alta demanda, centros de diagnóstico y farmacias ambulatorias. Integra pantallas informativas de alta visibilidad con audio sintetizado de acento chileno, tótems de autoatención con lector de cédula (RUT) y un panel de ventanilla que entrega tiempos de espera y trazabilidad en tiempo real.',
    architectureDetails: {
      title: 'Arquitectura de Sala y Despliegue Asistencial',
      description:
        'El sistema opera bajo un servidor central con sincronización instantánea vía WebSockets entre ventanillas, pantallas de llamado y tótems táctiles.',
      points: [
        'Prioridad garantizada por Ley 20.584 para adultos mayores, personas embarazadas y movilidad reducida.',
        'Sintetizador vocal en español chileno que vocaliza el turno y módulo sin requerir periféricos de audio complejos.',
        'Tótems 21.5" antivandálicos con corte térmico automático de ticket e interfaz simplificada para el paciente.',
        'Panel de control de ventanillas en vivo con métricas de tiempos de espera para auditorías y jefaturas médicas.',
      ],
    },
    highlights: [
      {
        title: 'Prioridad Ley 20.584',
        desc: 'Atención preferente estricta para adultos mayores, embarazadas y pacientes con movilidad reducida.',
      },
      {
        title: 'Audio Vocal Chileno',
        desc: 'Llamado audiovisual claro con pronunciación fonética chilena natural que indica paciente y módulo.',
      },
      {
        title: 'Tótems Táctiles 21.5"',
        desc: 'Terminales de autoatención con lector de cédula (RUT) y corte automático de ticket térmico.',
      },
      {
        title: 'Métricas en Tiempo Real',
        desc: 'Trazabilidad y cálculo de tiempos de atención y espera por módulo para auditorías ministeriales.',
      },
    ],
    screens: [
      {
        id: 'tv',
        label: 'TV Sala de Espera',
        type: 'filas-tv',
        badge: 'Llamado en Vivo con Voz',
        actionText: 'Llamando paciente a Módulo 3 por voz...',
      },
      {
        id: 'totem',
        label: 'Tótem Táctil 21.5"',
        type: 'filas-totem',
        badge: 'Autoatención con RUT',
        click: [0.5, 0.46],
        actionText: 'Emitiendo ticket para Farmacia Ambulatoria...',
      },
      {
        id: 'envivo',
        label: 'Panel de Módulos',
        type: 'img',
        src: '/shots/filas-1.jpg',
        badge: 'Panel Ventanillas',
        click: [0.055, 0.078],
        actionText: 'Operador llamando al siguiente paciente...',
      },
      {
        id: 'resumen',
        label: 'Tiempos de Espera',
        type: 'img',
        src: '/shots/filas-2.jpg',
        badge: 'Métricas Diarias',
        click: [0.055, 0.184],
        actionText: 'Calculando tiempo promedio de atención por módulo...',
      },
      {
        id: 'trazabilidad',
        label: 'Auditoría Ley 20.584',
        type: 'img',
        src: '/shots/filas-3.jpg',
        badge: 'Trazabilidad',
        click: [0.93, 0.115],
        actionText: 'Exportando informe de cumplimiento Ley 20.584...',
      },
    ],
    ctaText: 'Solicitar Demostración de Filas',
  },
  {
    id: 'ticpanel',
    name: 'TICPanel — Mesa de Ayuda & Actas TI',
    shortName: 'TICPanel',
    category: 'Infraestructura Tecnológica Institucional',
    badge: 'Agentes Silenciosos en Endpoints · Sector Salud',
    tagline: 'Monitoreo continuo mediante agentes instalados en cada equipo que reportan hardware y telemetría en tiempo real',
    shortDescription:
      'Control y trazabilidad total sobre el parque informático. Un agente ligero instalado en cada computador reporta hardware, seriales y estado en vivo, integrado a tickets con SLA y actas con firma digital.',
    fullDescription:
      'Diseñado para departamentos de informática en hospitales, clínicas y entidades públicas. TICPanel instala un agente silencioso y de bajo consumo en cada computador o endpoint de la red, recolectando automáticamente número de serie, hardware (CPU, RAM, discos), dirección IP, periféricos conectados y estado de salud operativa directamente al panel central. Permite atender incidentes bajo SLA estricto y formalizar actas de entrega/devolución con firma digital.',
    architectureDetails: {
      title: 'Agente Endpoint y Telemetría Automatizada',
      description:
        'El agente de TICPanel se despliega como servicio en segundo plano (Windows y Linux), eliminando inventarios manuales y auditorías ciegas.',
      points: [
        'Agente silencioso (.msi / daemon) que reporta automáticamente cambios de hardware o desconexiones sin interrumpir al usuario.',
        'Detección instantánea de número de serie, dirección MAC, marca, modelo y periféricos (impresoras, lectores de código de barras).',
        'Mesa de tickets con derivación inteligente por criticidad y tiempos máximos de respuesta (SLA).',
        'Generador de actas oficiales de entrega, cambio y devolución de equipamiento con firma digital integrada.',
      ],
    },
    highlights: [
      {
        title: 'Agente Silencioso en Endpoints',
        desc: 'Servicio ligero instalado en cada computador que recolecta hardware, componentes y telemetría en vivo.',
      },
      {
        title: 'Inventario & Seriales Automáticos',
        desc: 'Lectura automática de números de serie, direcciones MAC y periféricos sin intervención del usuario.',
      },
      {
        title: 'Mesa de Tickets con SLA',
        desc: 'Derivación inteligente por urgencia con control estricto de tiempos de respuesta conforme a estándares.',
      },
      {
        title: 'Actas con Firma Digital',
        desc: 'Emisión y archivo centralizado de actas de recepción y entrega de equipamiento válidas para auditorías.',
      },
    ],
    screens: [
      {
        id: 'panel',
        label: 'Dashboard General',
        type: 'img',
        src: '/shots/ticpanel-1.jpg',
        badge: 'Mesa de Control',
        click: [0.015, 0.22],
        actionText: 'Agentes reportando 142 equipos conectados...',
      },
      {
        id: 'tickets',
        label: 'Mesa de Tickets',
        type: 'img',
        src: '/shots/ticpanel-2.jpg',
        badge: 'SLA & Gestión',
        click: [0.015, 0.27],
        actionText: 'Asignando especialista según SLA hospitalario...',
      },
      {
        id: 'actas',
        label: 'Actas con Firma',
        type: 'img',
        src: '/shots/ticpanel-3.jpg',
        badge: 'Firma Digital',
        click: [0.58, 0.56],
        actionText: 'Registrando firma digital de entrega de equipo...',
      },
      {
        id: 'equipos',
        label: 'Control de Hardware',
        type: 'img',
        src: '/shots/ticpanel-4.jpg',
        badge: 'Inventario TI',
        click: [0.015, 0.12],
        actionText: 'Agente detectó nuevo monitor y memoria RAM...',
      },
    ],
    ctaText: 'Solicitar Demostración TICPanel',
  },
  {
    id: 'tba',
    name: 'Logística TBA — Solicitudes y Bodega',
    shortName: 'Logística TBA',
    category: 'Logística Institucional & Adquisiciones',
    badge: 'Producción Activa en logisticatba.cloud',
    tagline: 'Centralización de pedidos internos, control de existencias, órdenes de compra y activos fijos',
    shortDescription:
      'Digitaliza el flujo completo entre solicitantes, compras y almacén central. Kardex automatizado, existencias en tiempo real y flujo de aprobaciones sin papeles.',
    fullDescription:
      'La solución que conecta a los solicitantes departamentales con las unidades de adquisiciones y almacén central. Digitaliza el ciclo completo de requerimientos, cotizaciones, órdenes de compra, recepciones conformes y entregas, erradicando planillas Excel dispersas y asegurando que ningún insumo crítico quede sin control.',
    architectureDetails: {
      title: 'Control de Kardex y Trazabilidad de Adquisiciones',
      description:
        'Arquitectura cloud centralizada con perfiles de acceso estrictos para funcionarios solicitantes, jefaturas aprobadoras y personal de bodega.',
      points: [
        'Portal de solicitudes internas con flujo jerárquico de aprobaciones por departamento o centro de costo.',
        'Kardex de bodega en tiempo real con control de lotes, fecha de caducidad y alertas automáticas de stock mínimo.',
        'Vinculación directa entre órdenes de compra, proveedores y facturas comerciales registradas.',
        'Reportes de auditoría y valorización contable de existencias listos para balances institucionales.',
      ],
    },
    highlights: [
      {
        title: 'Solicitudes Internas Digitales',
        desc: 'Flujo de aprobaciones jerárquicas que erradica el papeleo y acelera la entrega de materiales.',
      },
      {
        title: 'Kardex Automatizado',
        desc: 'Control de inventario en tiempo real con alertas de stock mínimo y trazabilidad de lotes.',
      },
      {
        title: 'Órdenes de Compra y Recepción',
        desc: 'Vinculación directa entre adquisiciones, proveedores y recepción conforme de bodega.',
      },
      {
        title: 'Plataforma Cloud Segura',
        desc: 'Acceso centralizado desde cualquier navegador con perfiles y permisos diferenciados.',
      },
    ],
    screens: [
      {
        id: 'dash',
        label: 'Dashboard Bodega',
        type: 'img',
        src: '/shots/tba-1.jpg',
        badge: 'Métricas de Existencias',
        click: [0.06, 0.25],
        actionText: 'Revisando alertas de stock crítico en almacén...',
      },
      {
        id: 'bodega',
        label: 'Control de Almacén',
        type: 'img',
        src: '/shots/tba-2.jpg',
        badge: 'Kardex Digital',
        click: [0.06, 0.21],
        actionText: 'Aprobando solicitud interna de materiales...',
      },
      {
        id: 'reportes',
        label: 'Reportes & Auditoría',
        type: 'img',
        src: '/shots/tba-3.jpg',
        badge: 'Balances',
        click: [0.06, 0.128],
        actionText: 'Generando balance valorizado de inventario...',
      },
      {
        id: 'modulos',
        label: 'Centros de Costo',
        type: 'img',
        src: '/shots/tba-4.jpg',
        badge: 'Configuración',
        click: [0.06, 0.17],
        actionText: 'Asignando presupuesto por centro de costo...',
      },
    ],
    externalUrl: 'https://logisticatba.cloud',
    ctaText: 'Visitar logisticatba.cloud',
  },
  {
    id: 'cajaya',
    name: 'CajaYA — POS Offline + Boleta SII',
    shortName: 'CajaYA POS',
    category: 'Retail & Comercio de Alta Demanda',
    badge: '100% Offline + DTE Electrónico SII',
    tagline: 'Punto de venta ultra veloz que nunca se detiene, incluso ante caídas totales de internet',
    shortDescription:
      'Diseñado para locales y cajas rápidas donde parar no es una opción. Cobra e imprime con normalidad sin internet y sincroniza con el SII al volver la conexión.',
    fullDescription:
      'Construido para comercios y puntos de cobro intensivo donde la continuidad operacional es crítica. Si se corta la red o falla el proveedor de internet, CajaYA sigue operando con total normalidad, cobrando, imprimiendo comprobantes y gestionando turnos. Al reanudarse la señal, sincroniza automáticamente las boletas electrónicas con el SII en segundo plano.',
    architectureDetails: {
      title: 'Motor de Persistencia Local y Sincronización SII',
      description:
        'Combina almacenamiento local cifrado en la estación de cobro con sincronización resiliente bidireccional.',
      points: [
        'Operación continua sin internet: cobro, cálculo de vuelto, impresión de ticket y control de caja.',
        'Integración nativa con el SII para timbraje masivo y emisión de boletas y facturas electrónicas.',
        'Arqueo de turno ciego con cuadratura automática de efectivo, tarjetas y reporte Z de cierre.',
        'Catálogo táctil y soporte para lectores de código de barras para transacciones en menos de 3 segundos.',
      ],
    },
    highlights: [
      {
        title: 'Operación 100% Offline Garantizada',
        desc: 'Sigue vendiendo y cobrando sin interrupción ante caídas de enlace o fallas de internet.',
      },
      {
        title: 'Boleta y Factura Electrónica SII',
        desc: 'Timbraje y emisión inmediata con sincronización automática en segundo plano.',
      },
      {
        title: 'Arqueo Ciego y Reporte Z',
        desc: 'Cuadratura de turnos transparente con control estricto de mermas y caja chica.',
      },
      {
        title: 'Velocidad de Cobro Extrema',
        desc: 'Interfaz optimizada para atención veloz en locales con alta concurrencia de clientes.',
      },
    ],
    screens: [
      {
        id: 'pos',
        label: 'Punto de Venta',
        type: 'img',
        src: '/shots/cajaya-1.jpg',
        badge: 'Cobro Ultra Rápido',
        click: [0.235, 0.34],
        actionText: 'Cobrando venta y emitiendo boleta electrónica SII...',
      },
      {
        id: 'inicio',
        label: 'Apertura de Turno',
        type: 'img',
        src: '/shots/cajaya-2.jpg',
        badge: 'Turno Activo',
        click: [0.045, 0.29],
        actionText: 'Iniciando turno de cajero sin conexión a internet...',
      },
      {
        id: 'miturno',
        label: 'Arqueo de Turno',
        type: 'img',
        src: '/shots/cajaya-3.jpg',
        badge: 'Cuadratura Ciega',
        click: [0.72, 0.31],
        actionText: 'Verificando cuadratura automática de caja...',
      },
      {
        id: 'turnos',
        label: 'Cierres Z',
        type: 'img',
        src: '/shots/cajaya-4.jpg',
        badge: 'Historial Turnos',
        click: [0.045, 0.34],
        actionText: 'Generando reporte Z diario para contabilidad...',
      },
      {
        id: 'stock',
        label: 'Control de Stock',
        type: 'img',
        src: '/shots/cajaya-5.jpg',
        badge: 'Inventario',
        click: [0.045, 0.23],
        actionText: 'Descontando existencias por código de barras...',
      },
      {
        id: 'ventas',
        label: 'Registro DTE SII',
        type: 'img',
        src: '/shots/cajaya-6.jpg',
        badge: 'DTE SII',
        click: [0.045, 0.17],
        actionText: 'Sincronizando folios tributarios con el SII...',
      },
    ],
    externalUrl: 'https://cajaya.cl',
    ctaText: 'Conocer cajaya.cl',
  },
  {
    id: 'paginago',
    name: 'PaginaGo — Catálogo & Ventas WhatsApp',
    shortName: 'PaginaGo',
    category: 'Comercio Digital Directo',
    badge: 'A la Venta en paginago.com',
    tagline: 'Tu catálogo online en un enlace para recibir pedidos estructurados y calculados en WhatsApp',
    shortDescription:
      'Vende por internet sin comisiones por transacción. Catálogo autogestionable desde el celular que envía el pedido con lista, total y dirección al WhatsApp del negocio.',
    fullDescription:
      'La vía más directa y rentable para digitalizar ventas comerciales sin pagar comisiones por transacción ni depender de plataformas lentas. Permite crear catálogos visuales con precios, variantes y categorías, compartir un enlace exclusivo (paginago.com/tutienda) y recibir pedidos completamente estructurados directamente en el WhatsApp del negocio.',
    architectureDetails: {
      title: 'Plataforma Serverless y Enrutamiento a WhatsApp',
      description:
        'Carga ultrarrápida en redes móviles 4G/5G con integración nativa a la API de WhatsApp sin intermediarios de pago forzosos.',
      points: [
        '0% comisiones por venta: el 100% de la recaudación ingresa directo a la cuenta bancaria del negocio.',
        'Carrito de compras móvil que genera un mensaje pre-formateado con detalle de productos, total y datos de despacho.',
        'Panel autogestionable desde el navegador móvil para pausar stock, modificar precios y subir fotos en segundos.',
        'Plataforma activa y comercializada con soporte técnico continuo en paginago.com.',
      ],
    },
    highlights: [
      {
        title: '0% Comisiones por Venta',
        desc: 'Recaudación 100% íntegra para tu negocio sin comisiones porcentuales por transacción.',
      },
      {
        title: 'Pedido Calculado a WhatsApp',
        desc: 'El cliente arma su carrito y te envía la orden lista con dirección, teléfono y total.',
      },
      {
        title: 'Panel Móvil Autogestionable',
        desc: 'Controla existencias, precios y promociones directamente desde tu teléfono celular.',
      },
      {
        title: 'Enlace Único de Marca',
        desc: 'Tu tienda con link exclusivo lista para bio de Instagram, TikTok o volantes impresos.',
      },
    ],
    screens: [
      {
        id: 'tienda',
        label: 'Tienda Virtual',
        type: 'img',
        src: '/shots/paginago-1.jpg',
        badge: 'Catálogo Móvil',
        click: [0.79, 0.035],
        actionText: 'Explorando catálogo interactivo en celular...',
      },
      {
        id: 'como',
        label: 'Flujo a WhatsApp',
        type: 'img',
        src: '/shots/paginago-2.jpg',
        badge: 'Carrito a WhatsApp',
        click: [0.68, 0.78],
        actionText: 'Calculando pedido y transfiriendo directo a WhatsApp...',
      },
      {
        id: 'ejemplos',
        label: 'Tiendas Activas',
        type: 'img',
        src: '/shots/paginago-3.jpg',
        badge: 'Casos Reales',
        click: [0.51, 0.035],
        actionText: 'Viendo comercios vendiendo en vivo sin comisiones...',
      },
      {
        id: 'planes',
        label: 'Planes & Precios',
        type: 'img',
        src: '/shots/paginago-4.jpg',
        badge: 'Suscripción Plana',
        click: [0.5, 0.78],
        actionText: 'Activando catálogo con dominio propio...',
      },
    ],
    externalUrl: 'https://paginago.com',
    ctaText: 'Ir a paginago.com',
  },
  {
    id: 'auto',
    name: 'Automatizaciones & Bots RPA a Medida',
    shortName: 'Automatizaciones RPA',
    category: 'Integración de Sistemas & Eficiencia Operativa',
    badge: 'Desarrollo Especializado tuEndpoint',
    tagline: 'Conectamos sistemas desconectados y eliminamos tareas manuales repetitivas mediante software robot',
    shortDescription:
      'Robots de software (RPA) y conectores API dedicados que transfieren datos automáticamente entre ERPs, sistemas tributarios y portales institucionales.',
    fullDescription:
      'Soluciones a medida para empresas e instituciones que gastan cientos de horas digitando datos entre sistemas desconectados. Diseñamos bots de automatización robótica de procesos (RPA), scripts de conciliación masiva y microservicios API que sincronizan compras, facturación, kardex y planillas sin intervención humana.',
    architectureDetails: {
      title: 'Motor de Ejecución y Monitoreo de Procesos',
      description:
        'Robots ejecutados en entornos aislados con control de concurrencia, reintentos automáticos y registro de auditoría.',
      points: [
        'Extracción, validación y digitación automática en portales web públicos o sistemas ERP heredados.',
        'Conexión segura mediante APIs REST, webhooks e integraciones directas a bases de datos.',
        'Panel de control con registro de logs minuto a minuto y alertas instantáneas a Telegram/WhatsApp ante fallos.',
        'Ahorro comprobado en horas-hombre con retorno de inversión visible desde el primer mes.',
      ],
    },
    highlights: [
      {
        title: 'Robots de Software a Medida',
        desc: 'Extracción y carga automática de facturas, órdenes de compra y planillas sin errores humanos.',
      },
      {
        title: 'Conectores API & Sistemas Legacy',
        desc: 'Integración segura entre bases de datos heredadas y plataformas cloud modernas.',
      },
      {
        title: 'Monitor de Ejecución en Vivo',
        desc: 'Control de procesos con alertas en tiempo real ante discrepancias de información.',
      },
      {
        title: 'Ahorro Inmediato de Horas-Hombre',
        desc: 'Retorno de inversión medible desde las primeras semanas de automatización.',
      },
    ],
    screens: [
      {
        id: 'monitor',
        label: 'Monitor de Ejecuciones',
        type: 'auto-monitor',
        badge: 'Procesos en Vivo',
        actionText: 'Ejecutando robot RPA para conciliación automática...',
      },
    ],
    ctaText: 'Consultar Automatización',
  },
];

/* ------------------------------------------------------------------ */
/* Fondo Tecnológico Interactivo: Grid Cybernetico & Nodos de Datos   */
/* ------------------------------------------------------------------ */

function TechCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    // Nodos representando endpoints conectados
    const nodes = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1.2,
      pulse: Math.random() * Math.PI,
    }));

    let mouseX = width / 2;
    let mouseY = height / 3;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Resplandor sutil siguiendo cursor
      const radial = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 380);
      radial.addColorStop(0, 'rgba(2, 132, 199, 0.08)');
      radial.addColorStop(0.5, 'rgba(2, 132, 199, 0.025)');
      radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // 2. Malla / Grid fino de ingeniería
      const gridSize = 48;
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Conexiones entre endpoints
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        a.pulse += 0.03;

        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Dibujar nodo endpoint
        const currentR = a.radius + Math.sin(a.pulse) * 0.6;
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(a.x, a.y, Math.max(1, currentR), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Modal de Presentación Completa del Producto (Deep Dive)            */
/* ------------------------------------------------------------------ */

function AppPresentationModal({
  product,
  onClose,
  waUrl,
}: {
  product: ProductShowcase;
  onClose: () => void;
  waUrl: (msg: string) => string;
}) {
  const [activeTab, setActiveTab] = useState<'screens' | 'architecture' | 'specs'>('screens');
  const [selectedScreenId, setSelectedScreenId] = useState(product.screens[0].id);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const currentScreen = product.screens.find((s) => s.id === selectedScreenId) || product.screens[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {product.name}
                <span className="hidden sm:inline-block text-[11px] font-mono font-normal text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/80">
                  {product.badge}
                </span>
              </h3>
              <p className="text-xs text-slate-400 hidden sm:block">{product.tagline}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Cerrar ventana"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de Pestañas de la Presentación */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('screens')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'screens'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Pantallas Reales del Sistema</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Arquitectura & Agente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Especificaciones de Despliegue</span>
          </button>
        </div>

        {/* Contenido Dinámico del Modal */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PANTALLAS Y DEMO */}
          {activeTab === 'screens' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Selecciona una vista para inspeccionar en alta resolución:
                </span>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {product.screens.map((scr) => (
                    <button
                      key={scr.id}
                      type="button"
                      onClick={() => setSelectedScreenId(scr.id)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                        currentScreen.id === scr.id
                          ? 'bg-[#0284c7] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {scr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visor de Pantalla */}
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-2 sm:p-3 overflow-hidden shadow-inner">
                {currentScreen.type === 'filas-tv' && <FilasTVSimulator />}
                {currentScreen.type === 'filas-totem' && <FilasTotemSimulator />}
                {currentScreen.type === 'auto-monitor' && <AutoMonitorSimulator />}
                {currentScreen.type === 'img' && currentScreen.src && (
                  <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentScreen.src}
                      alt={`${product.name} — ${currentScreen.label}`}
                      className="w-full h-full object-cover object-top block"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{currentScreen.label}</span>
                  <span className="text-slate-500">{currentScreen.actionText || 'Captura verificada en producción.'}</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {currentScreen.badge || 'PRODUCCIÓN ACTIVA'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: ARQUITECTURA & AGENTES */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Cpu className="h-4 w-4" />
                  <span>{product.architectureDetails.title}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.architectureDetails.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Componentes Clave de la Arquitectura
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.architectureDetails.points.map((pt, i) => (
                    <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs space-y-1">
                      <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7]" />
                        Módulo 0{i + 1}
                      </span>
                      <p className="text-slate-600 leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-950 space-y-1">
                <strong className="block font-bold">Despliegue Asistido y Soporte</strong>
                <p className="text-sky-800 leading-relaxed">
                  Todos nuestros sistemas son instalados, configurados y capacitados directamente por el equipo de ingeniería
                  de <strong>Soluciones tuEndpoint SpA</strong>, garantizando compatibilidad con redes hospitalarias y corporativas.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ESPECIFICACIONES TÉCNICAS */}
          {activeTab === 'specs' && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-900 block text-sm">Modalidad de Despliegue</span>
                  <p className="text-slate-600 leading-relaxed">
                    Disponible en modalidad <strong>Cloud Dedicado</strong> (servidor en nube chilena de baja latencia) o{' '}
                    <strong>On-Premise</strong> (en servidores locales de la institución tras firewalls y redes privadas).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-900 block text-sm">Seguridad & Datos</span>
                  <p className="text-slate-600 leading-relaxed">
                    Cifrado en tránsito TLS 1.3, bases de datos PostgreSQL con replicación continua, backups automatizados y
                    cumplimiento de estándares de auditoría pública.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-900 block text-sm">Compatibilidad de Estaciones</span>
                  <p className="text-slate-600 leading-relaxed">
                    Acceso desde cualquier navegador moderno (Chrome, Edge, Firefox, Safari). Agentes de telemetría disponibles
                    para Windows 10/11 y distribuciones Linux institucionales.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-900 block text-sm">Soporte y Garantía</span>
                  <p className="text-slate-600 leading-relaxed">
                    Mesa de ayuda directa de lunes a viernes, soporte técnico con derivación prioritaria y mantenimiento correctivo
                    y evolutivo continuo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie de Acciones del Modal */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            ¿Deseas una presentación guiada por videollamada?
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Cerrar
            </button>

            {product.externalUrl ? (
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0284c7] px-5 py-2 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-xs"
              >
                <span>{product.ctaText}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <a
                href={waUrl(`Hola tuEndpoint, me gustaría agendar una demostración asistida de ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0284c7] px-5 py-2 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Pedir Demo con un Ingeniero</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador TV Sala de Espera Hospitalario (Canvas 2D Ultra Nítido)  */
/* ------------------------------------------------------------------ */

function FilasTVSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();

    const CALL_SEQ = [
      { cod: 'A-042', mod: 'Módulo 3', serv: 'Farmacia Ambulatoria', pref: false },
      { cod: 'P-019', mod: 'Módulo 1', serv: 'Atención Preferente Ley 20.584', pref: true },
      { cod: 'F-105', mod: 'Módulo 2', serv: 'Entrega de Recetas', pref: false },
      { cod: 'A-043', mod: 'Módulo 4', serv: 'Farmacia Ambulatoria', pref: false },
    ];

    const render = (time: number) => {
      const t = (time - startTime) / 1000;
      const W = canvas.width;
      const H = canvas.height;

      const cycle = 3.8;
      const step = Math.floor(t / cycle);
      const local = (t % cycle) / cycle;
      const cur = CALL_SEQ[step % CALL_SEQ.length];
      const prev1 = CALL_SEQ[(step + CALL_SEQ.length - 1) % CALL_SEQ.length];
      const prev2 = CALL_SEQ[(step + CALL_SEQ.length - 2) % CALL_SEQ.length];

      const OSCURO = '#002A54';
      const OSCURO2 = '#0B3B70';
      const ACENTO = '#FAAF40';

      // Fondo
      ctx.fillStyle = OSCURO;
      ctx.fillRect(0, 0, W, H);

      // Cabecera institucional
      ctx.fillStyle = OSCURO;
      ctx.fillRect(0, 0, W, 72);
      ctx.fillStyle = ACENTO;
      ctx.fillRect(0, 68, W, 4);

      // Cruz
      ctx.fillStyle = ACENTO;
      ctx.beginPath();
      ctx.roundRect(24, 16, 40, 40, 10);
      ctx.fill();
      ctx.fillStyle = OSCURO;
      ctx.fillRect(40, 24, 8, 24);
      ctx.fillRect(32, 32, 24, 8);

      // Nombre y sala
      ctx.fillStyle = '#B9CCE6';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('SALA DE ESPERA · ATENCIÓN EN VIVO', 76, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px Inter, sans-serif';
      ctx.fillText('Farmacia Central & CAE', 76, 56);

      // Hora
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 28px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('16:42', W - 24, 42);
      ctx.fillStyle = '#B9CCE6';
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillText('Sistema por Voz Activo', W - 24, 60);
      ctx.textAlign = 'left';

      // Panel principal izquierdo (Llamado actual)
      const ew = W * 0.62;
      const eh = H - 96;
      ctx.fillStyle = OSCURO2;
      ctx.beginPath();
      ctx.roundRect(20, 84, ew, eh, 12);
      ctx.fill();

      ctx.fillStyle = ACENTO;
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillText('NÚMERO LLAMADO EN VOZ', 40, 114);

      // Flash del llamado
      const isCalling = local < 0.28;
      if (isCalling) {
        ctx.strokeStyle = ACENTO;
        ctx.lineWidth = 3;
        ctx.strokeRect(22, 86, ew - 4, eh - 4);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 84px monospace';
      ctx.fillText(cur.cod, 40, 204);

      if (cur.pref) {
        ctx.fillStyle = ACENTO;
        ctx.beginPath();
        ctx.roundRect(40, 222, 230, 24, 6);
        ctx.fill();
        ctx.fillStyle = OSCURO;
        ctx.font = '700 11px Inter, sans-serif';
        ctx.fillText('★ ATENCIÓN PREFERENTE LEY 20.584', 48, 238);
      }

      // Destino / Módulo
      ctx.fillStyle = '#B9CCE6';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('DIRÍJASE A:', 40, 276);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px Inter, sans-serif';
      ctx.fillText(cur.mod, 40, 318);

      ctx.fillStyle = '#B9CCE6';
      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillText(cur.serv, 40, 344);

      // Panel derecho (Historial reciente)
      const rx = ew + 32;
      const rw = W - rx - 20;
      ctx.fillStyle = OSCURO2;
      ctx.beginPath();
      ctx.roundRect(rx, 84, rw, eh, 12);
      ctx.fill();

      ctx.fillStyle = ACENTO;
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillText('ÚLTIMOS LLAMADOS', rx + 16, 114);

      [prev1, prev2].forEach((item, idx) => {
        const iy = 144 + idx * 96;
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 34px monospace';
        ctx.fillText(item.cod, rx + 16, iy);

        ctx.fillStyle = ACENTO;
        ctx.font = '700 14px Inter, sans-serif';
        ctx.fillText(item.mod, rx + 16, iy + 24);

        ctx.fillStyle = '#B9CCE6';
        ctx.font = '400 11px Inter, sans-serif';
        ctx.fillText(item.serv, rx + 16, iy + 42);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {
      // Audio no permitido
    }
  };

  return (
    <div className="relative w-full aspect-[16/10] bg-[#002A54] rounded-lg overflow-hidden border border-slate-700 shadow-inner">
      <canvas ref={canvasRef} width={640} height={400} className="w-full h-full block" />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            playChime();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 hover:bg-black/80 text-[10px] font-bold text-white backdrop-blur border border-white/20 transition"
        >
          {soundEnabled ? <Volume2 className="h-3 w-3 text-amber-400" /> : <VolumeX className="h-3 w-3 text-slate-400" />}
          <span>{soundEnabled ? 'Timbre Activo' : 'Probar Timbre Hospital'}</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador Tótem Táctil Hospitalario 21.5"                          */
/* ------------------------------------------------------------------ */

function FilasTotemSimulator() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [ticketPrinted, setTicketPrinted] = useState<{ cod: string; serv: string } | null>(null);

  const services = [
    { id: 'farmacia', name: 'Farmacia Ambulatoria', cod: 'A-044', wait: '3 personas en espera', icon: '💊' },
    { id: 'preferente', name: 'Atención Preferente (Ley 20.584)', cod: 'P-020', wait: '1 persona en espera', icon: '⭐' },
    { id: 'recetas', name: 'Entrega de Recetas', cod: 'F-106', wait: '4 personas en espera', icon: '📋' },
    { id: 'informaciones', name: 'Informaciones & SOME', cod: 'I-012', wait: 'Sin espera', icon: 'ℹ️' },
  ];

  const handleSelect = (s: (typeof services)[0]) => {
    setSelectedService(s.id);
    setTimeout(() => {
      setTicketPrinted({ cod: s.cod, serv: s.name });
    }, 400);
  };

  return (
    <div className="w-full aspect-[16/10] bg-[#0F172A] p-4 sm:p-5 rounded-lg text-white flex flex-col justify-between border border-slate-800 shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
            21&quot;
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Tótem Autoatención Hospitalario</span>
            <span className="text-[10px] text-slate-400">Toque la pantalla o ingrese su RUT</span>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
          ● ONLINE · IMPRESORA OK
        </span>
      </div>

      {!ticketPrinted ? (
        <div className="py-2 space-y-2.5">
          <p className="text-xs font-semibold text-slate-300">Seleccione el servicio al que se dirige:</p>
          <div className="grid grid-cols-2 gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s)}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                  selectedService === s.id
                    ? 'border-amber-400 bg-amber-400/20'
                    : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-xs font-bold text-white leading-tight">{s.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">{s.wait}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-3 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-white text-slate-950 p-3.5 rounded shadow-xl w-48 text-center font-mono border-t-4 border-dashed border-slate-300">
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Hospital de Red Pública</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{ticketPrinted.serv}</span>
            <div className="my-1.5 border-y border-dashed border-slate-300 py-1.5">
              <span className="text-3xl font-black text-slate-950 block">{ticketPrinted.cod}</span>
              <span className="text-[9px] text-slate-500">SU NÚMERO DE ATENCIÓN</span>
            </div>
            <span className="text-[8px] text-slate-400 block">Esté atento al llamado en pantalla TV</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setTicketPrinted(null);
              setSelectedService(null);
            }}
            className="text-[11px] font-bold text-sky-400 hover:underline"
          >
            ← Imprimir otro turno
          </button>
        </div>
      )}

      <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span>Lector de Cédula de Identidad (RUT) Habilitado</span>
        <span>tuEndpoint. Hardware</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador Monitor RPA de Automatizaciones                          */
/* ------------------------------------------------------------------ */

function AutoMonitorSimulator() {
  const [logs, setLogs] = useState([
    { id: 1, time: '16:42:01', job: 'Sincronización DTE SII', status: 'OK', records: '48 boletas' },
    { id: 2, time: '16:42:15', job: 'Importación Órdenes Mercado Público', status: 'OK', records: '12 OC' },
    { id: 3, time: '16:42:30', job: 'Actualización Stock Kardex Bodega', status: 'OK', records: '320 ítems' },
    { id: 4, time: '16:42:48', job: 'Backup Automatizado Base de Datos', status: 'OK', records: 'Snapshot 1.2 GB' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toTimeString().split(' ')[0];
      const jobTypes = [
        { job: 'Conciliación Bancaria Automática', records: '8 transferencias' },
        { job: 'Envío Notificaciones WhatsApp', records: '15 mensajes' },
        { job: 'Auditoría Tickets Resueltos TICPanel', records: '6 tickets' },
      ];
      const pick = jobTypes[Math.floor(Math.random() * jobTypes.length)];
      setLogs((prev) => [
        { id: Date.now(), time: now, job: pick.job, status: 'OK', records: pick.records },
        ...prev.slice(0, 3),
      ]);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-[16/10] bg-[#0A0F1D] p-4 sm:p-5 rounded-lg text-white font-mono text-xs flex flex-col justify-between border border-slate-800 shadow-inner">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white text-xs">Monitor de Procesos RPA & Webhooks</span>
          </div>
          <span className="text-[10px] text-slate-400">0 Errores · 99.98% Uptime</span>
        </div>

        <div className="mt-3 space-y-2">
          {logs.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{l.time}</span>
                <span className="text-slate-200 font-semibold">{l.job}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 hidden sm:inline">{l.records}</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span>Conectores API Activos: SII · Mercado Público · Webhooks</span>
        <span>tuEndpoint. RPA Engine</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ventana de Aplicación con Animación de Uso Real (Cursor + Clic)    */
/* ------------------------------------------------------------------ */

function AnimatedAppWindow({
  product,
  activeScreenId,
  onSelectScreen,
  onOpenModal,
}: {
  product: ProductShowcase;
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
  onOpenModal: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [actionTooltip, setActionTooltip] = useState<string | null>(null);

  const screens = product.screens;
  const currentScreenIndex = Math.max(
    0,
    screens.findIndex((s) => s.id === activeScreenId)
  );
  const currentScreen = screens[currentScreenIndex] || screens[0];

  useEffect(() => {
    if (!isPlaying) return;

    let timeoutMove: NodeJS.Timeout;
    let timeoutClick: NodeJS.Timeout;
    let timeoutNext: NodeJS.Timeout;

    const target = currentScreen.click || [0.5, 0.45];
    const targetX = target[0] * 100;
    const targetY = target[1] * 100;

    setIsClicking(false);
    setShowRipple(false);
    setActionTooltip(null);

    timeoutMove = setTimeout(() => {
      setCursorPos({ x: targetX, y: targetY });
      if (currentScreen.actionText) {
        setActionTooltip(currentScreen.actionText);
      }
    }, 600);

    timeoutClick = setTimeout(() => {
      setIsClicking(true);
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
      setTimeout(() => setIsClicking(false), 260);
    }, 2100);

    timeoutNext = setTimeout(() => {
      const nextIndex = (currentScreenIndex + 1) % screens.length;
      onSelectScreen(screens[nextIndex].id);
    }, 4400);

    return () => {
      clearTimeout(timeoutMove);
      clearTimeout(timeoutClick);
      clearTimeout(timeoutNext);
    };
  }, [isPlaying, currentScreenIndex, currentScreen, screens, onSelectScreen]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden transition-all group">
      {/* Barra de Título Estilo macOS */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-slate-500 hidden sm:inline">
            tuendpoint.cl/{product.id}
          </span>
        </div>

        {/* Pestañas de pantallas con selector manual */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {screens.map((scr) => (
            <button
              key={scr.id}
              type="button"
              onClick={() => onSelectScreen(scr.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition shrink-0 ${
                currentScreen.id === scr.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {scr.label}
            </button>
          ))}
        </div>

        {/* Botón de Pantalla Completa / Modal y Play/Pause */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenModal}
            title="Abrir presentación detallada"
            className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200 transition"
          >
            <Maximize2 className="h-3 w-3" />
            <span className="hidden sm:inline">Ver Detalles</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pausar simulación' : 'Reanudar simulación'}
            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200 transition"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Área Útil de la Pantalla */}
      <div className="relative bg-slate-100 p-2 sm:p-4 overflow-hidden select-none">
        {currentScreen.type === 'filas-tv' && <FilasTVSimulator />}
        {currentScreen.type === 'filas-totem' && <FilasTotemSimulator />}
        {currentScreen.type === 'auto-monitor' && <AutoMonitorSimulator />}

        {currentScreen.type === 'img' && currentScreen.src && (
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 bg-white shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentScreen.src}
              alt={`${product.name} — ${currentScreen.label}`}
              className="w-full h-full object-cover object-top block"
              loading="eager"
            />
          </div>
        )}

        {/* Cursor animado simulando uso humano del software */}
        {isPlaying && currentScreen.type === 'img' && (
          <div
            className="pointer-events-none absolute z-30 transition-all duration-700 ease-out"
            style={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
              transform: `translate(-3px, -3px) scale(${isClicking ? 0.86 : 1})`,
            }}
          >
            {showRipple && (
              <span className="absolute -left-3 -top-3 h-10 w-10 rounded-full border-2 border-sky-400 bg-sky-400/30 animate-ping pointer-events-none" />
            )}

            <svg
              className="w-6 h-6 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] text-slate-900"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="#ffffff"
              strokeWidth="1.8"
            >
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>

            {actionTooltip && (
              <div className="absolute left-6 top-1 whitespace-nowrap rounded-md bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl border border-slate-700/80 flex items-center gap-1.5 animate-in fade-in duration-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{actionTooltip}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barra de Estado inferior de la ventana */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800">{currentScreen.badge || currentScreen.label}</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">Captura Real en Producción</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Componente Principal Home: Moderno, Minimalista y Sin Ruido        */
/* ------------------------------------------------------------------ */

export function Immersive({ introDone: _introDone }: { introDone?: boolean } = {}) {
  const [activeScreens, setActiveScreens] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    PRODUCTS.forEach((p) => {
      init[p.id] = p.screens[0].id;
    });
    return init;
  });

  const [modalProduct, setModalProduct] = useState<ProductShowcase | null>(null);

  const setProductScreen = (productId: string, screenId: string) => {
    setActiveScreens((prev) => ({ ...prev, [productId]: screenId }));
  };

  const waUrl = (text: string) =>
    `https://wa.me/5694925337?text=${encodeURIComponent(text)}`;

  return (
    <div className="immersive-root min-h-screen bg-white text-[#0F172A] selection:bg-[#0284c7] selection:text-white">
      {/* Modal de Presentación Interactiva si está activo */}
      {modalProduct && (
        <AppPresentationModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          waUrl={waUrl}
        />
      )}

      {/* =================================================================== */}
      {/* 1. NAVEGACIÓN SUPERIOR: MINIMALISTA Y ELEGANTE                      */}
      {/* =================================================================== */}
      <header className="modern-site-header sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-100 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logotipo tuEndpoint */}
          <Link href="/es" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tight text-[#0F172A] group-hover:text-[#0284c7] transition">
              tuEndpoint<span className="text-[#0284c7]">.</span>
            </span>
          </Link>

          {/* Menú de Soluciones */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#filas" className="hover:text-slate-900 transition">
              Gestor de Filas
            </a>
            <a href="#ticpanel" className="hover:text-slate-900 transition">
              TICPanel
            </a>
            <a href="#tba" className="hover:text-slate-900 transition">
              Logística TBA
            </a>
            <a href="#cajaya" className="hover:text-slate-900 transition">
              CajaYA POS
            </a>
            <a href="#paginago" className="hover:text-slate-900 transition">
              PaginaGo
            </a>
            <a href="#auto" className="hover:text-slate-900 transition">
              Automatizaciones
            </a>
          </nav>

          {/* Contacto Directo */}
          <div className="flex items-center gap-3">
            <a
              href={waUrl('Hola tuEndpoint, me gustaría consultar por sus soluciones de software.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Hablemos</span>
            </a>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. HERO PRINCIPAL: FONDO TECNOLÓGICO ÉPICO + TYPEWRITER             */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 border-b border-slate-100 bg-gradient-to-b from-[#F8FAFC] via-white to-white">
        {/* Fondo interactivo de nodos y grid de ingeniería */}
        <TechCanvasBackground />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          {/* Tag de Categoría */}
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#0284c7]">
            <span className="h-2 w-2 rounded-full bg-[#0284c7] animate-ping" />
            <span>SOFTWARE FACTORY & PLATAFORMAS EN PRODUCCIÓN</span>
          </div>

          {/* Titular Principal con Typewriter dinámico */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.12]">
            Software enterprise que resuelve{' '}
            <span className="text-[#0284c7] inline-block">
              <Typewriter
                words={[
                  'operaciones reales.',
                  'urgencias hospitalarias.',
                  'inventarios y bodegas.',
                  'ventas sin internet.',
                  'procesos manuales.',
                ]}
                speed={75}
                delayBetweenWords={2200}
                cursorChar="|"
                cursorClassName="text-[#0284c7]"
              />
            </span>
          </h1>

          {/* Subtítulo Claro y Directo */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Desarrollamos soluciones tecnológicas estables para{' '}
            <span className="font-semibold text-slate-800">salud pública, logística, retail y comercio</span> en Chile.
            Sistemas probados en terreno con soporte local directo y código de producción.
          </p>

          {/* Acciones de Portada */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#filas"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-[#0284c7] transition shadow-sm"
            >
              <span>Explorar Soluciones en Uso</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={waUrl('Hola tuEndpoint, me gustaría conversar con un ingeniero sobre un proyecto de software.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
            >
              <MessageSquare className="h-4 w-4 text-[#0284c7]" />
              <span>Hablar con un Ingeniero</span>
            </a>
          </div>

          {/* Frase sutil de respaldo */}
          <p className="pt-4 text-xs text-slate-400 font-medium">
            Plataformas activas en hospitales de red pública, almacenes logísticos y comercio digital en todo Chile.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. SHOWCASE DE PRODUCTOS: CADA UNO SE LUCE CON SU TEXTO Y SU DEMO   */}
      {/* =================================================================== */}
      <section className="py-20 sm:py-28 space-y-24 sm:space-y-36">
        {PRODUCTS.map((prod, index) => {
          const isReversed = index % 2 === 1;
          const currentScreenId = activeScreens[prod.id] || prod.screens[0].id;

          return (
            <div
              key={prod.id}
              id={prod.id}
              className="scroll-mt-24 mx-auto max-w-7xl px-4 sm:px-6"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* ---------------------------------------------------- */}
                {/* COLUMNA DE TEXTOS: EDITORIAL, CONCISA Y CON DOS CTAs */}
                {/* ---------------------------------------------------- */}
                <div className={`space-y-5 lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  {/* Número de sección y categoría */}
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                    <span className="font-bold text-[#0284c7]">0{index + 1}</span>
                    <span>/</span>
                    <span className="text-slate-600 font-semibold">{prod.category}</span>
                  </div>

                  {/* Nombre y Título del Producto */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
                      {prod.name}
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 leading-snug">
                      {prod.tagline}
                    </p>
                  </div>

                  {/* Descripción Breve y Directa */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prod.shortDescription}
                  </p>

                  {/* Pastillas de Capacidades Clave */}
                  <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                    {prod.highlights.slice(0, 3).map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 border border-slate-200/80 text-slate-800"
                      >
                        {h.title}
                      </span>
                    ))}
                  </div>

                  {/* DOS BOTONES: VER PRESENTACIÓN (MODAL) Y PEDIR DEMO */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setModalProduct(prod)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs cursor-pointer"
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
                      <span>Ver Presentación Completa</span>
                    </button>

                    {prod.externalUrl ? (
                      <a
                        href={prod.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                      >
                        <span>{prod.ctaText}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ) : (
                      <a
                        href={waUrl(`Hola tuEndpoint, me gustaría agendar una demo asistida de ${prod.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-[#0284c7]" />
                        <span>Pedir Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* COLUMNA DE VENTANA CON SIMULACIÓN DE USO REAL        */}
                {/* ---------------------------------------------------- */}
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <AnimatedAppWindow
                    product={prod}
                    activeScreenId={currentScreenId}
                    onSelectScreen={(sId) => setProductScreen(prod.id, sId)}
                    onOpenModal={() => setModalProduct(prod)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* =================================================================== */}
      {/* 4. FORMULARIO DE CONTACTO / HABLEMOS                                */}
      {/* =================================================================== */}
      <section id="contacto" className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">Hablemos de tu proyecto</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                ¿Tienes una necesidad técnica o proceso a implementar?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Escríbenos directamente o contáctanos por WhatsApp. Respondemos en minutos con propuestas claras y
                factibilidad técnica.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const nombre = data.get('nombre') || '';
                const email = data.get('email') || '';
                const fono = data.get('telefono') || '';
                const msg = data.get('mensaje') || '';
                const text = `Hola tuEndpoint, mi nombre es ${nombre} (${email}, ${fono}). Requerimiento: ${msg}`;
                window.open(waUrl(text), '_blank');
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre o Institución</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Ej: Hospital Dr. Gustavo Fricke / Juan Pérez"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="contacto@institucion.cl"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono o WhatsApp</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="+56 9 ..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Solución de Interés</label>
                <select
                  name="solucion"
                  aria-label="Solución de Interés"
                  defaultValue="filas"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                >
                  <option value="filas">Gestor de Filas Hospitalario</option>
                  <option value="ticpanel">TICPanel Mesa de Ayuda</option>
                  <option value="tba">Logística TBA Bodega</option>
                  <option value="cajaya">CajaYA POS Offline</option>
                  <option value="paginago">PaginaGo Catálogo</option>
                  <option value="auto">Automatizaciones RPA</option>
                  <option value="licitacion">Desarrollo Especializado</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Cuéntanos tu requerimiento o proceso</label>
                <textarea
                  name="mensaje"
                  rows={3}
                  required
                  placeholder="Describe brevemente el flujo, número de usuarios o requerimiento técnico..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  Email directo: <strong className="text-slate-800">contacto@tuendpoint.cl</strong> · WhatsApp:{' '}
                  <strong className="text-slate-800">+56 9 492 5337</strong>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar Consulta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. PIE DE PÁGINA CORPORATIVO                                        */}
      {/* =================================================================== */}
      <footer className="modern-site-footer border-t border-slate-200 bg-white py-12 text-xs text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="text-lg font-extrabold text-[#0F172A]">
                tuEndpoint<span className="text-[#0284c7]">.</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {TUENDPOINT_COMPANY.razonSocial}
                <br />
                RUT: {TUENDPOINT_COMPANY.rut}
                <br />
                Giro: {TUENDPOINT_COMPANY.giro}
              </p>
              <p className="text-[11px] text-slate-500">
                Casa Matriz: {TUENDPOINT_COMPANY.direccion}, {TUENDPOINT_COMPANY.ciudad}, Chile.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider block">Soluciones</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#filas" className="hover:text-slate-900 transition">Gestor de Filas Hospitalario</a></li>
                <li><a href="#ticpanel" className="hover:text-slate-900 transition">TICPanel Mesa de Ayuda</a></li>
                <li><a href="#tba" className="hover:text-slate-900 transition">Logística TBA Bodega</a></li>
                <li><a href="#cajaya" className="hover:text-slate-900 transition">CajaYA POS + SII</a></li>
                <li><a href="#paginago" className="hover:text-slate-900 transition">PaginaGo</a></li>
                <li><a href="#auto" className="hover:text-slate-900 transition">Automatizaciones RPA</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider block">Portales & Servicios</span>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="https://logisticatba.cloud" target="_blank" rel="noreferrer" className="hover:text-slate-900">logisticatba.cloud</a></li>
                <li><a href="https://cajaya.cl" target="_blank" rel="noreferrer" className="hover:text-slate-900">cajaya.cl</a></li>
                <li><a href="https://paginago.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">paginago.com</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider block">Contacto Directo</span>
              <p className="text-[11px]">
                WhatsApp: <a href={waUrl('Hola tuEndpoint')} className="font-bold text-[#0284c7]">{brand.phone}</a>
                <br />
                Correo: <a href="mailto:contacto@tuendpoint.cl" className="text-slate-700">contacto@tuendpoint.cl</a>
                <br />
                Soporte y Mesa de Ayuda: Lunes a Viernes 08:30 a 18:30 hrs.
              </p>
              <div className="pt-2">
                <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  ✔ PROVEEDOR DEL ESTADO HÁBIL
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-[11px] text-slate-400">
            © {new Date().getFullYear()} Soluciones tuEndpoint SpA. Todos los derechos reservados. Desarrollado en Chile.
          </div>
        </div>
      </footer>

      {/* Asistente interactivo flotante en esquina */}
      <AssistantBot
        productIndexById={{
          filas: 1,
          ticpanel: 2,
          tba: 3,
          cajaya: 4,
          paginago: 5,
          auto: 6,
        }}
        contactIndex={7}
        onNavigate={(idx) => {
          const ids = ['filas', 'ticpanel', 'tba', 'cajaya', 'paginago', 'auto', 'contacto'];
          const targetId = ids[idx - 1] || 'contacto';
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onPrefillContact={(_topic, draft) => {
          const el = document.getElementById('contacto');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          const textarea = document.querySelector<HTMLTextAreaElement>('textarea[name="mensaje"]');
          if (textarea) textarea.value = draft;
        }}
      />
    </div>
  );
}
