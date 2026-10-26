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
} from 'lucide-react';
import { brand } from '@/lib/config/brand';
import { TUENDPOINT_COMPANY } from '@/lib/cotizador/catalog';
import { AssistantBot } from '@/components/home/AssistantBot';

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
  category: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: ProductHighlight[];
  screens: ScreenTab[];
  externalUrl?: string;
  ctaText: string;
}

const PRODUCTS: ProductShowcase[] = [
  {
    id: 'filas',
    name: 'Gestor de Filas Hospitalario',
    category: 'Salud Pública & Red Asistencial',
    badge: 'Producción en Hospitales Públicos',
    tagline: 'Llamado audiovisual por voz sintetizada en pantallas TV y tótems táctiles de autoatención',
    description:
      'Sistema integral de gestión de esperas diseñado para erradicar las aglomeraciones caóticas en salas de atención médica y farmacias. Integra pantallas informativas de alta visibilidad con audio de voz chilena, tótems de autoatención con lector de cédula y panel de ventanilla en tiempo real.',
    highlights: [
      {
        title: 'Prioridad Ley 20.584',
        desc: 'Cumplimiento normativo estricto con atención preferente para adultos mayores, personas embarazadas y con movilidad reducida.',
      },
      {
        title: 'Audio por Voz Sintetizada',
        desc: 'Llamado audiovisual claro con pronunciación chilena natural, indicando paciente y módulo asignado sin errores.',
      },
      {
        title: 'Tótems Táctiles 21.5"',
        desc: 'Terminales antivandálicos con corte automático de ticket, lector de cédula (RUT) y derivación inteligente por servicio.',
      },
      {
        title: 'Métricas de Espera Minuto a Minuto',
        desc: 'Control en vivo de tiempos de espera por ventanilla y módulo para jefaturas, auditorías y dirección asistencial.',
      },
    ],
    screens: [
      {
        id: 'tv',
        label: 'TV Sala de Espera',
        type: 'filas-tv',
        badge: 'Llamado Audiovisual en Vivo',
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
        badge: 'Panel en Ventanilla',
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
        actionText: 'Consultando promedio de atención por módulo...',
      },
      {
        id: 'trazabilidad',
        label: 'Auditoría Ley 20.584',
        type: 'img',
        src: '/shots/filas-3.jpg',
        badge: 'Trazabilidad',
        click: [0.93, 0.115],
        actionText: 'Exportando reporte oficial de tiempos y cumplimiento...',
      },
    ],
    ctaText: 'Solicitar Demostración de Filas',
  },
  {
    id: 'ticpanel',
    name: 'TICPanel — Mesa de Ayuda & Actas TI',
    category: 'Infraestructura Tecnológica',
    badge: 'Validado en Hospitales y Servicios de Salud',
    tagline: 'Gestión unificada de incidentes técnicos, inventario de hardware y actas con firma digital',
    description:
      'Control total sobre todo el parque informático de tu institución. Permite a los funcionarios ingresar solicitudes técnicas con derivación inmediata según criticidad, registrar la hoja de vida completa de cada computador o impresora y emitir actas oficiales de entrega y devolución válidas para auditorías.',
    highlights: [
      {
        title: 'Mesa de Tickets con SLA',
        desc: 'Derivación inteligente por especialidad, criticidad y plazos de respuesta estrictos conforme a estándares de servicio.',
      },
      {
        title: 'Actas con Firma Digital',
        desc: 'Generación y archivo centralizado de actas de entrega, recepción y devolución de equipamiento con firma electrónica.',
      },
      {
        title: 'Hoja de Vida de Hardware',
        desc: 'Inventario detallado con código de barras, especificaciones técnicas, ubicación física y funcionario responsable.',
      },
      {
        title: 'Conforme a Normativas de Auditoría',
        desc: 'Diseñado bajo requerimientos de auditoría interna y estándares de seguridad exigidos en el sector público.',
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
        actionText: 'Filtrando tickets por nivel de urgencia...',
      },
      {
        id: 'tickets',
        label: 'Mesa de Tickets',
        type: 'img',
        src: '/shots/ticpanel-2.jpg',
        badge: 'SLA & Gestión',
        click: [0.015, 0.27],
        actionText: 'Asignando especialista técnico según SLA...',
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
        actionText: 'Escaneando código de barras de computador asignado...',
      },
    ],
    ctaText: 'Solicitar Demostración TICPanel',
  },
  {
    id: 'tba',
    name: 'Logística TBA — Solicitudes y Bodega',
    category: 'Logística Institucional & Adquisiciones',
    badge: 'Producción Activa en logisticatba.cloud',
    tagline: 'Centralización de pedidos internos, control de existencias, órdenes de compra y activos fijos',
    description:
      'La solución que conecta a los solicitantes con los departamentos de adquisiciones y almacén central. Digitaliza el flujo completo de compras, recepciones conformes y entregas, eliminando planillas Excel dispersas y garantizando que ningún insumo crítico quede sin control.',
    highlights: [
      {
        title: 'Solicitudes Internas Digitales',
        desc: 'Portal de pedidos internos con flujo jerárquico de aprobaciones por departamento o centro de costo.',
      },
      {
        title: 'Kardex Automatizado',
        desc: 'Control de inventario en tiempo real con alertas de stock mínimo, trazabilidad de lotes y valorización contable.',
      },
      {
        title: 'Órdenes de Compra y Recepción',
        desc: 'Vinculación directa entre adquisiciones, proveedores, recepciones de bodega y facturas comerciales.',
      },
      {
        title: 'Acceso Cloud Seguro',
        desc: 'Plataforma en la nube con perfiles diferenciados para funcionarios, jefaturas, adquisiciones y bodegueros.',
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
        actionText: 'Revisando alertas de stock crítico en bodega...',
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
    category: 'Retail & Comercio de Alta Demanda',
    badge: '100% Offline + DTE Electrónico SII',
    tagline: 'Punto de venta ultra veloz que nunca se detiene, incluso sin conexión a internet',
    description:
      'Construido para locales comerciales y puntos de cobro donde detener la venta no es una opción. Si se corta la red o falla el proveedor de internet, CajaYA sigue operando con total normalidad, cobrando e imprimiendo comprobantes, y sincroniza automáticamente las boletas electrónicas con el SII al reanudarse la señal.',
    highlights: [
      {
        title: 'Operación 100% Offline Garantizada',
        desc: 'Sigue vendiendo y emitiendo comprobantes sin interrupción ante caídas de enlace o cortes de luz.',
      },
      {
        title: 'Boleta y Factura Electrónica SII',
        desc: 'Timbraje y emisión inmediata de documentos tributarios con sincronización automática en segundo plano.',
      },
      {
        title: 'Arqueo Ciego y Reporte Z',
        desc: 'Cuadratura de turnos transparente, control estricto de efectivo, tarjetas y reporte Z al instante.',
      },
      {
        title: 'Búsqueda Táctil y Código de Barras',
        desc: 'Interfaz optimizada para velocidad de atención en cajas con alta concurrencia de público.',
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
    category: 'Comercio Digital Directo',
    badge: 'A la Venta en paginago.com',
    tagline: 'Tu tienda online en un link para recibir pedidos listos y calculados en tu WhatsApp',
    description:
      'La forma más rápida y económica de vender por internet sin comisiones por transacción ni configuraciones engorrosas. Crea tu catálogo con fotos, precios y variantes, comparte tu link exclusivo (paginago.com/tutienda) y recibe los pedidos organizados con lista, dirección y total en tu WhatsApp.',
    highlights: [
      {
        title: '0% Comisiones por Venta',
        desc: 'El 100% de la recaudación va directo a tu cuenta bancaria sin retenciones ni comisiones porcentuales.',
      },
      {
        title: 'Pedido Estructurado a WhatsApp',
        desc: 'Carrito de compras integrado que envía la lista de productos, datos de entrega y total calculado en un mensaje.',
      },
      {
        title: 'Panel Móvil Autogestionable',
        desc: 'Carga productos, actualiza precios y pausa stock en segundos directamente desde tu teléfono.',
      },
      {
        title: 'Enlace Único de Marca',
        desc: 'Tu tienda con link exclusivo lista para colocar en el perfil de Instagram, TikTok o catálogos impresos.',
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
        actionText: 'Viendo comercios vendiendo en vivo sin intermediarios...',
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
    category: 'Integración de Sistemas & Eficiencia Operativa',
    badge: 'Desarrollo Especializado tuEndpoint',
    tagline: 'Conectamos sistemas desconectados y eliminamos tareas manuales repetitivas',
    description:
      'Desarrollamos robots de software (RPA) y conectores API dedicados que transfieren datos automáticamente entre ERPs, sistemas tributarios, plataformas web institucionales y planillas. Reduce horas de digitación manual, elimina errores humanos y acelera tus procesos operativos.',
    highlights: [
      {
        title: 'Robots de Software a Medida',
        desc: 'Extracción, validación y carga automática de facturas, órdenes de compra y registros en portales web.',
      },
      {
        title: 'Integración de APIs y Sistemas Legacy',
        desc: 'Conexión segura entre bases de datos heredadas, plataformas cloud y servidores institucionales.',
      },
      {
        title: 'Monitor de Ejecuciones en Tiempo Real',
        desc: 'Panel de control con registro de tareas, trazabilidad de logs y alertas automáticas ante fallos.',
      },
      {
        title: 'Retorno de Inversión Inmediato',
        desc: 'Ahorro directo y cuantificable en horas-hombre desde las primeras semanas de implementación.',
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
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18); // A5
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
}: {
  product: ProductShowcase;
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
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

    // Destino del cursor en esta pantalla
    const target = currentScreen.click || [0.5, 0.45];
    const targetX = target[0] * 100;
    const targetY = target[1] * 100;

    // Limpiar estados iniciales
    setIsClicking(false);
    setShowRipple(false);
    setActionTooltip(null);

    // 1. Mover cursor suavemente hacia el botón/acción y mostrar tooltip de lo que está haciendo
    timeoutMove = setTimeout(() => {
      setCursorPos({ x: targetX, y: targetY });
      if (currentScreen.actionText) {
        setActionTooltip(currentScreen.actionText);
      }
    }, 600);

    // 2. Simular clic con onda expansiva (ripple)
    timeoutClick = setTimeout(() => {
      setIsClicking(true);
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
      setTimeout(() => setIsClicking(false), 260);
    }, 2100);

    // 3. Pasar a la siguiente pantalla del flujo del sistema
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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden transition-all">
      {/* Barra de Título Estilo macOS */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Botones de ventana */}
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
              onClick={() => {
                onSelectScreen(scr.id);
                // Pausar brevemente o cambiar inmediatamente
              }}
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

        {/* Control de Reproducción / Pausa de la simulación */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pausar simulación automática' : 'Reanudar simulación de uso'}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-200/50 transition"
        >
          {isPlaying ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden md:inline">En uso</span>
              <Pause className="h-3 w-3" />
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="hidden md:inline">Pausado</span>
              <Play className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      {/* Área Útil de la Pantalla */}
      <div className="relative bg-slate-100 p-2 sm:p-4 overflow-hidden select-none">
        {/* Render del tipo de pantalla */}
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
            {/* Onda expansiva de clic (Ripple) */}
            {showRipple && (
              <span className="absolute -left-3 -top-3 h-10 w-10 rounded-full border-2 border-sky-400 bg-sky-400/30 animate-ping pointer-events-none" />
            )}

            {/* Puntero de ratón */}
            <svg
              className="w-6 h-6 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] text-slate-900"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="#ffffff"
              strokeWidth="1.8"
            >
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>

            {/* Tooltip de la acción que se está ejecutando */}
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

  const setProductScreen = (productId: string, screenId: string) => {
    setActiveScreens((prev) => ({ ...prev, [productId]: screenId }));
  };

  const waUrl = (text: string) =>
    `https://wa.me/5694925337?text=${encodeURIComponent(text)}`;

  return (
    <div className="immersive-root min-h-screen bg-white text-[#0F172A] selection:bg-[#0284c7] selection:text-white">
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
      {/* 2. HERO PRINCIPAL: LIMPIO, CONFIDENTE Y SIN CARDS TIPO IA           */}
      {/* =================================================================== */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-100 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          {/* Tag de Categoría */}
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0284c7]">
            <span>SOFTWARE FACTORY & PLATAFORMAS EN PRODUCCIÓN</span>
          </div>

          {/* Titular Principal */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.1]">
            Software enterprise que resuelve{' '}
            <span className="text-[#0284c7]">operaciones reales.</span>
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
          <p className="pt-6 text-xs text-slate-400 font-medium">
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
                {/* COLUMNA DE TEXTOS: EDITORIAL, ELEGANTE Y DIRECTA     */}
                {/* ---------------------------------------------------- */}
                <div className={`space-y-6 lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  {/* Número de sección y categoría */}
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                    <span className="font-bold text-[#0284c7]">0{index + 1}</span>
                    <span>/</span>
                    <span className="text-slate-600 font-semibold">{prod.category}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">{prod.badge}</span>
                  </div>

                  {/* Nombre y Título del Producto */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
                      {prod.name}
                    </h2>
                    <p className="text-base sm:text-lg font-medium text-slate-700 leading-snug">
                      {prod.tagline}
                    </p>
                  </div>

                  {/* Descripción Detallada */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Especificaciones Técnicas Clave (Grid Editorial Limpio) */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100">
                    {prod.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="space-y-1">
                        <span className="text-xs font-bold text-slate-900 block">{h.title}</span>
                        <span className="text-xs text-slate-500 leading-relaxed block">{h.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botón de Acción Específico */}
                  <div className="pt-3 flex items-center gap-3">
                    {prod.externalUrl ? (
                      <a
                        href={prod.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs"
                      >
                        <span>{prod.ctaText}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <a
                        href={waUrl(`Hola tuEndpoint, me gustaría agendar una demo de ${prod.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{prod.ctaText}</span>
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
                <li><Link href="/es/cotizador" className="hover:text-slate-900 text-slate-500">Cotizador Enterprise (PDF)</Link></li>
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
