'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Monitor,
  Printer,
  Server,
  Cpu,
  Layers,
  Terminal,
  Activity,
  CheckCircle2,
  HardDrive,
  Laptop,
  ChevronRight,
} from 'lucide-react';
import { brand } from '@/lib/config/brand';
import { TUENDPOINT_COMPANY } from '@/lib/cotizador/catalog';
import { AssistantBot } from '@/components/home/AssistantBot';
import { Typewriter } from '@/components/ui/typewriter';

/* ------------------------------------------------------------------ */
/* Datos Oficiales de Productos y Pantallas                           */
/* ------------------------------------------------------------------ */

interface ScreenTab {
  id: string;
  label: string;
  type: 'img' | 'filas-tv' | 'filas-totem' | 'ticpanel-agents' | 'auto-monitor';
  src?: string;
  badge?: string;
  click?: [number, number];
  actionText?: string;
}

interface ProductShowcase {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  badge: string;
  oneLiner: string;
  techSpecs: string[];
  screens: ScreenTab[];
  externalUrl?: string;
  ctaText: string;
}

const PRODUCTS: ProductShowcase[] = [
  {
    id: 'filas',
    name: 'Gestor de Filas Hospitalario',
    shortName: 'Filas Hospital',
    category: 'Salud Pública',
    badge: 'Ley 20.584 · En Producción',
    tagline: 'Llamado por voz sintetizada en TV y tótems de autoatención con RUT.',
    oneLiner:
      'Erradica el desorden en salas de espera y farmacias con llamado audiovisual en vivo, atención preferente garantizada y métricas de espera en tiempo real.',
    techSpecs: [
      'Prioridad estricta para adultos mayores y personas con movilidad reducida (Ley 20.584).',
      'Voz fonética chilena natural que indica paciente y módulo por audio.',
      'Tótem táctil 21.5" con corte automático de ticket e ingreso por cédula de identidad.',
    ],
    screens: [
      {
        id: 'tv',
        label: 'TV Sala de Espera',
        type: 'filas-tv',
        badge: 'Llamado por Voz',
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
        label: 'Panel Ventanilla',
        type: 'img',
        src: '/shots/filas-1.jpg',
        badge: 'Ventanillas en Vivo',
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
        actionText: 'Calculando promedio de atención...',
      },
      {
        id: 'trazabilidad',
        label: 'Auditoría Ley 20.584',
        type: 'img',
        src: '/shots/filas-3.jpg',
        badge: 'Trazabilidad',
        click: [0.93, 0.115],
        actionText: 'Exportando informe oficial ministerial...',
      },
    ],
    ctaText: 'Pedir Demo de Filas',
  },
  {
    id: 'ticpanel',
    name: 'TICPanel — Mesa de Ayuda & TI',
    shortName: 'TICPanel',
    category: 'Infraestructura TI',
    badge: 'Agentes Silenciosos en Endpoints',
    tagline: 'Agentes instalados en cada equipo que reportan hardware y telemetría en tiempo real.',
    oneLiner:
      'Control total del parque informático. Un agente ligero en segundo plano reporta CPU, RAM, discos, seriales y estado sin intervención del usuario, integrado a tickets con SLA y actas con firma digital.',
    techSpecs: [
      'Agente silencioso (Windows / Linux) que transmite telemetría y periféricos al servidor central.',
      'Detección automática de números de serie, direcciones MAC y hardware para control patrimonial.',
      'Mesa de tickets con derivación inteligente por criticidad y actas oficiales con firma digital.',
    ],
    screens: [
      {
        id: 'agents',
        label: 'Agentes en Endpoints',
        type: 'ticpanel-agents',
        badge: 'Telemetría en Vivo',
        actionText: 'Agentes reportando telemetría de 142 equipos...',
      },
      {
        id: 'tickets',
        label: 'Mesa de Tickets',
        type: 'img',
        src: '/shots/ticpanel-2.jpg',
        badge: 'SLA Hospitalario',
        click: [0.015, 0.27],
        actionText: 'Asignando especialista según SLA...',
      },
      {
        id: 'actas',
        label: 'Actas con Firma',
        type: 'img',
        src: '/shots/ticpanel-3.jpg',
        badge: 'Firma Digital',
        click: [0.58, 0.56],
        actionText: 'Registrando firma digital de entrega...',
      },
      {
        id: 'equipos',
        label: 'Control de Hardware',
        type: 'img',
        src: '/shots/ticpanel-4.jpg',
        badge: 'Inventario TI',
        click: [0.015, 0.12],
        actionText: 'Escaneando código de barras de equipo...',
      },
      {
        id: 'panel',
        label: 'Dashboard General',
        type: 'img',
        src: '/shots/ticpanel-1.jpg',
        badge: 'Mesa de Control',
        click: [0.015, 0.22],
        actionText: 'Revisando estado general de infraestructura...',
      },
    ],
    ctaText: 'Pedir Demo de TICPanel',
  },
  {
    id: 'tba',
    name: 'Logística TBA — Solicitudes y Bodega',
    shortName: 'Logística TBA',
    category: 'Logística & Compras',
    badge: 'Producción en logisticatba.cloud',
    tagline: 'Kardex digital y flujo de solicitudes internas sin planillas Excel.',
    oneLiner:
      'Centraliza pedidos internos con aprobaciones jerárquicas por departamento, control de existencias en tiempo real y vinculación directa con órdenes de compra y facturas.',
    techSpecs: [
      'Portal de pedidos con flujo jerárquico de aprobaciones por departamento o centro de costo.',
      'Kardex de bodega en tiempo real con alertas de stock mínimo, control de lotes y valorización.',
      'Trazabilidad completa con órdenes de compra, proveedores y recepciones conformes de almacén.',
    ],
    screens: [
      {
        id: 'dash',
        label: 'Dashboard Bodega',
        type: 'img',
        src: '/shots/tba-1.jpg',
        badge: 'Métricas de Stock',
        click: [0.06, 0.25],
        actionText: 'Revisando alertas de stock crítico...',
      },
      {
        id: 'bodega',
        label: 'Kardex Digital',
        type: 'img',
        src: '/shots/tba-2.jpg',
        badge: 'Control Almacén',
        click: [0.06, 0.21],
        actionText: 'Aprobando solicitud interna de materiales...',
      },
      {
        id: 'reportes',
        label: 'Reportes & Balances',
        type: 'img',
        src: '/shots/tba-3.jpg',
        badge: 'Auditoría',
        click: [0.06, 0.128],
        actionText: 'Generando balance valorizado de inventario...',
      },
      {
        id: 'modulos',
        label: 'Centros de Costo',
        type: 'img',
        src: '/shots/tba-4.jpg',
        badge: 'Presupuestos',
        click: [0.06, 0.17],
        actionText: 'Asignando presupuesto departamental...',
      },
    ],
    externalUrl: 'https://logisticatba.cloud',
    ctaText: 'Visitar logisticatba.cloud',
  },
  {
    id: 'cajaya',
    name: 'CajaYA — POS Offline + Boleta SII',
    shortName: 'CajaYA POS',
    category: 'Retail & Comercio',
    badge: '100% Offline + DTE Electrónico SII',
    tagline: 'Punto de venta ultra rápido que cobra sin internet y sincroniza con el SII.',
    oneLiner:
      'Construido para locales de alta concurrencia. Sigue vendiendo, cobrando e imprimiendo comprobantes ante caídas de internet y sincroniza las boletas electrónicas al volver la señal.',
    techSpecs: [
      'Operación 100% offline garantizada: nunca detengas la venta ante cortes de red o luz.',
      'Integración nativa con el SII para timbraje y emisión inmediata de boletas y facturas electrónicas.',
      'Arqueo ciego con cuadratura automática de turnos, control estricto de caja y reporte Z al instante.',
    ],
    screens: [
      {
        id: 'pos',
        label: 'Punto de Venta',
        type: 'img',
        src: '/shots/cajaya-1.jpg',
        badge: 'Cobro en 3s',
        click: [0.235, 0.34],
        actionText: 'Cobrando y emitiendo boleta SII...',
      },
      {
        id: 'inicio',
        label: 'Apertura de Turno',
        type: 'img',
        src: '/shots/cajaya-2.jpg',
        badge: 'Turno Offline',
        click: [0.045, 0.29],
        actionText: 'Iniciando turno de cajero sin internet...',
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
        badge: 'Reporte Z',
        click: [0.045, 0.34],
        actionText: 'Generando reporte Z diario...',
      },
      {
        id: 'stock',
        label: 'Control de Stock',
        type: 'img',
        src: '/shots/cajaya-5.jpg',
        badge: 'Inventario',
        click: [0.045, 0.23],
        actionText: 'Descontando stock por código de barras...',
      },
      {
        id: 'ventas',
        label: 'Registro DTE SII',
        type: 'img',
        src: '/shots/cajaya-6.jpg',
        badge: 'DTE SII',
        click: [0.045, 0.17],
        actionText: 'Sincronizando comprobantes con el SII...',
      },
    ],
    externalUrl: 'https://cajaya.cl',
    ctaText: 'Conocer cajaya.cl',
  },
  {
    id: 'paginago',
    name: 'PaginaGo — Catálogo WhatsApp',
    shortName: 'PaginaGo',
    category: 'Comercio Digital',
    badge: 'A la Venta en paginago.com',
    tagline: 'Tu tienda online en un enlace para recibir pedidos directos sin comisiones.',
    oneLiner:
      'La vía más rápida de vender por internet. El cliente arma su carrito en el celular y te envía la orden lista con lista, dirección y total calculado directamente a tu WhatsApp.',
    techSpecs: [
      '0% comisiones por venta: el 100% del dinero ingresa directo a tu cuenta bancaria.',
      'Carrito de compras integrado que genera el mensaje estructurado con datos de despacho.',
      'Panel autogestionable desde el celular para cargar productos, pausar stock y modificar precios.',
    ],
    screens: [
      {
        id: 'tienda',
        label: 'Tienda Virtual',
        type: 'img',
        src: '/shots/paginago-1.jpg',
        badge: 'Catálogo Móvil',
        click: [0.79, 0.035],
        actionText: 'Explorando catálogo en celular...',
      },
      {
        id: 'como',
        label: 'Flujo a WhatsApp',
        type: 'img',
        src: '/shots/paginago-2.jpg',
        badge: 'Carrito a WhatsApp',
        click: [0.68, 0.78],
        actionText: 'Transfiriendo pedido directo a WhatsApp...',
      },
      {
        id: 'ejemplos',
        label: 'Tiendas Activas',
        type: 'img',
        src: '/shots/paginago-3.jpg',
        badge: 'Casos Reales',
        click: [0.51, 0.035],
        actionText: 'Viendo comercios vendiendo sin comisiones...',
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
    name: 'Automatizaciones & Bots RPA',
    shortName: 'Automatizaciones',
    category: 'Integración de Sistemas',
    badge: 'Desarrollo Especializado',
    tagline: 'Robots de software que conectan sistemas y eliminan tareas repetitivas.',
    oneLiner:
      'Desarrollamos bots RPA y conectores API que extraen, concilian y cargan datos automáticamente entre ERPs, sistemas tributarios y planillas sin errores humanos.',
    techSpecs: [
      'Robots RPA a medida para extracción y carga automática de facturas y órdenes de compra.',
      'Conectores seguros entre bases de datos heredadas y plataformas cloud modernas.',
      'Monitor de ejecución en tiempo real con alertas inmediatas a Telegram o WhatsApp ante fallos.',
    ],
    screens: [
      {
        id: 'monitor',
        label: 'Monitor de Ejecuciones',
        type: 'auto-monitor',
        badge: 'Bots en Vivo',
        actionText: 'Ejecutando robot RPA para conciliación...',
      },
    ],
    ctaText: 'Consultar Automatización',
  },
];

/* ------------------------------------------------------------------ */
/* Simulador de Telemetría de Agentes TICPanel (Pura Ingeniería)      */
/* ------------------------------------------------------------------ */

function TICPanelAgentsSimulator() {
  const [agents, setAgents] = useState([
    { id: 'PC-FARMACIA-01', os: 'Win 11', cpu: '14%', ram: '8GB / 16GB', ip: '10.12.4.18', status: 'ONLINE', ping: '12ms' },
    { id: 'PC-URGENCIAS-03', os: 'Win 10', cpu: '28%', ram: '12GB / 16GB', ip: '10.12.4.45', status: 'ONLINE', ping: '8ms' },
    { id: 'PC-SOME-02', os: 'Linux', cpu: '6%', ram: '4GB / 8GB', ip: '10.12.5.10', status: 'ONLINE', ping: '15ms' },
    { id: 'PC-DIRECCION-01', os: 'Win 11', cpu: '19%', ram: '14GB / 32GB', ip: '10.12.1.2', status: 'ONLINE', ping: '9ms' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          cpu: `${Math.floor(Math.random() * 25 + 8)}%`,
          ping: `${Math.floor(Math.random() * 12 + 6)}ms`,
        }))
      );
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-[16/10] bg-[#0A0F1D] p-3 sm:p-5 rounded-2xl text-white font-mono text-xs flex flex-col justify-between border border-slate-800 shadow-inner">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-xs">Agente Silencioso tuEndpoint · Telemetría en Vivo</span>
          </div>
          <span className="text-[10px] text-sky-400 font-semibold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/80">
            142 Endpoints Conectados
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {agents.map((ag) => (
            <div
              key={ag.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px]"
            >
              <div className="flex items-center gap-2.5">
                <Laptop className="h-3.5 w-3.5 text-sky-400" />
                <span className="font-bold text-slate-100">{ag.id}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({ag.os})</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 hidden md:inline">IP: {ag.ip}</span>
                <span className="text-slate-300">CPU: <strong className="text-emerald-400">{ag.cpu}</strong></span>
                <span className="text-slate-400 hidden sm:inline">RAM: {ag.ram}</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-800">
                  {ag.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span>Agente desplegado como servicio en segundo plano (0% uso de pantalla)</span>
        <span className="text-emerald-400">● Cifrado TLS 1.3 Activo</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador TV Sala de Espera Hospitalario (Canvas 2D)               */
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

      ctx.fillStyle = OSCURO;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = OSCURO;
      ctx.fillRect(0, 0, W, 72);
      ctx.fillStyle = ACENTO;
      ctx.fillRect(0, 68, W, 4);

      ctx.fillStyle = ACENTO;
      ctx.beginPath();
      ctx.roundRect(24, 16, 40, 40, 10);
      ctx.fill();
      ctx.fillStyle = OSCURO;
      ctx.fillRect(40, 24, 8, 24);
      ctx.fillRect(32, 32, 24, 8);

      ctx.fillStyle = '#B9CCE6';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('SALA DE ESPERA · ATENCIÓN EN VIVO', 76, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px Inter, sans-serif';
      ctx.fillText('Farmacia Central & CAE', 76, 56);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 28px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('16:42', W - 24, 42);
      ctx.fillStyle = '#B9CCE6';
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillText('Sistema por Voz Activo', W - 24, 60);
      ctx.textAlign = 'left';

      const ew = W * 0.62;
      const eh = H - 96;
      ctx.fillStyle = OSCURO2;
      ctx.beginPath();
      ctx.roundRect(20, 84, ew, eh, 12);
      ctx.fill();

      ctx.fillStyle = ACENTO;
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillText('NÚMERO LLAMADO EN VOZ', 40, 114);

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

      ctx.fillStyle = '#B9CCE6';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('DIRÍJASE A:', 40, 276);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px Inter, sans-serif';
      ctx.fillText(cur.mod, 40, 318);

      ctx.fillStyle = '#B9CCE6';
      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillText(cur.serv, 40, 344);

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
    <div className="relative w-full aspect-[16/10] bg-[#002A54] rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
      <canvas ref={canvasRef} width={640} height={400} className="w-full h-full block" />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            playChime();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-[10px] font-bold text-white backdrop-blur border border-white/20 transition cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="h-3 w-3 text-amber-400" /> : <VolumeX className="h-3 w-3 text-slate-400" />}
          <span>{soundEnabled ? 'Timbre Activo' : 'Probar Timbre'}</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador Tótem Táctil 21.5"                                       */
/* ------------------------------------------------------------------ */

function FilasTotemSimulator() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [ticketPrinted, setTicketPrinted] = useState<{ cod: string; serv: string } | null>(null);

  const services = [
    { id: 'farmacia', name: 'Farmacia Ambulatoria', cod: 'A-044', wait: '3 en espera', icon: '💊' },
    { id: 'preferente', name: 'Atención Preferente (Ley 20.584)', cod: 'P-020', wait: '1 en espera', icon: '⭐' },
    { id: 'recetas', name: 'Entrega de Recetas', cod: 'F-106', wait: '4 en espera', icon: '📋' },
    { id: 'informaciones', name: 'Informaciones & SOME', cod: 'I-012', wait: 'Sin espera', icon: 'ℹ️' },
  ];

  const handleSelect = (s: (typeof services)[0]) => {
    setSelectedService(s.id);
    setTimeout(() => {
      setTicketPrinted({ cod: s.cod, serv: s.name });
    }, 400);
  };

  return (
    <div className="w-full aspect-[16/10] bg-[#0F172A] p-4 rounded-2xl text-white flex flex-col justify-between border border-slate-800 shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs font-bold text-white">Tótem Autoatención Hospitalario 21&quot;</span>
        <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
          ● ONLINE · IMPRESORA OK
        </span>
      </div>

      {!ticketPrinted ? (
        <div className="py-2 space-y-2">
          <p className="text-[11px] text-slate-400">Toque el servicio al que se dirige:</p>
          <div className="grid grid-cols-2 gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedService === s.id
                    ? 'border-amber-400 bg-amber-400/20'
                    : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-xs font-bold text-white leading-tight">{s.name}</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">{s.wait}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-2 flex flex-col items-center justify-center space-y-2">
          <div className="bg-white text-slate-950 p-3 rounded shadow-xl w-44 text-center font-mono border-t-2 border-dashed border-slate-300">
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Hospital de Red</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{ticketPrinted.serv}</span>
            <div className="my-1 border-y border-dashed border-slate-300 py-1">
              <span className="text-2xl font-black text-slate-950 block">{ticketPrinted.cod}</span>
              <span className="text-[8px] text-slate-500">SU NÚMERO DE ATENCIÓN</span>
            </div>
            <span className="text-[8px] text-slate-400 block">Atento al llamado en TV</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setTicketPrinted(null);
              setSelectedService(null);
            }}
            className="text-[11px] font-bold text-sky-400 hover:underline cursor-pointer"
          >
            ← Imprimir otro turno
          </button>
        </div>
      )}

      <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between text-[9px] text-slate-500">
        <span>Lector de Cédula (RUT) Habilitado</span>
        <span>tuEndpoint. Hardware</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador Monitor RPA                                              */
/* ------------------------------------------------------------------ */

function AutoMonitorSimulator() {
  const [logs, setLogs] = useState([
    { id: 1, time: '16:42:01', job: 'Sincronización DTE SII', status: 'OK', records: '48 boletas' },
    { id: 2, time: '16:42:15', job: 'Importación Mercado Público', status: 'OK', records: '12 OC' },
    { id: 3, time: '16:42:30', job: 'Actualización Stock Kardex', status: 'OK', records: '320 ítems' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toTimeString().split(' ')[0];
      const jobTypes = [
        { job: 'Conciliación Bancaria Automática', records: '8 transferencias' },
        { job: 'Envío Notificaciones WhatsApp', records: '15 mensajes' },
        { job: 'Auditoría Tickets Resueltos', records: '6 tickets' },
      ];
      const pick = jobTypes[Math.floor(Math.random() * jobTypes.length)];
      setLogs((prev) => [
        { id: Date.now(), time: now, job: pick.job, status: 'OK', records: pick.records },
        ...prev.slice(0, 2),
      ]);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-[16/10] bg-[#0A0F1D] p-4 rounded-2xl text-white font-mono text-xs flex flex-col justify-between border border-slate-800 shadow-inner">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white text-xs">Monitor de Procesos RPA</span>
          </div>
          <span className="text-[10px] text-slate-400">0 Errores · 99.98% Uptime</span>
        </div>

        <div className="mt-3 space-y-2">
          {logs.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{l.time}</span>
                <span className="text-slate-200 font-semibold">{l.job}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 hidden sm:inline">{l.records}</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-800">
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between text-[9px] text-slate-500">
        <span>Conectores API Activos: SII · Mercado Público</span>
        <span>tuEndpoint. RPA Engine</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ventana iMac Studio Display (Sin Modals Clumsy, 100% Visual)       */
/* ------------------------------------------------------------------ */

function IMacDisplayStage({
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
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden transition-all">
      {/* Barra de Título iMac Minimalista */}
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
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

        {/* Pestañas limpias estilo macOS */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {screens.map((scr) => (
            <button
              key={scr.id}
              type="button"
              onClick={() => onSelectScreen(scr.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                currentScreen.id === scr.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {scr.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          title={isPlaying ? 'Pausar simulación' : 'Reanudar'}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Pantalla del Software en Alta Definición */}
      <div className="relative bg-slate-100 p-2 sm:p-4 overflow-hidden select-none">
        {currentScreen.type === 'filas-tv' && <FilasTVSimulator />}
        {currentScreen.type === 'filas-totem' && <FilasTotemSimulator />}
        {currentScreen.type === 'ticpanel-agents' && <TICPanelAgentsSimulator />}
        {currentScreen.type === 'auto-monitor' && <AutoMonitorSimulator />}

        {currentScreen.type === 'img' && currentScreen.src && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentScreen.src}
              alt={`${product.name} — ${currentScreen.label}`}
              className="w-full h-full object-cover object-top block"
              loading="eager"
            />
          </div>
        )}

        {/* Cursor animado simulando uso humano */}
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

      {/* Barra de Estado inferior minimalista */}
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
/* Componente Principal Home: Minimalista, Inteligente y Wow          */
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
      {/* 1. NAVEGACIÓN SUPERIOR MINIMALISTA                                  */}
      {/* =================================================================== */}
      <header className="modern-site-header sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-100 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/es" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tight text-[#0F172A] group-hover:text-[#0284c7] transition">
              tuEndpoint<span className="text-[#0284c7]">.</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#filas" className="hover:text-slate-900 transition">Gestor de Filas</a>
            <a href="#ticpanel" className="hover:text-slate-900 transition">TICPanel</a>
            <a href="#tba" className="hover:text-slate-900 transition">Logística TBA</a>
            <a href="#cajaya" className="hover:text-slate-900 transition">CajaYA POS</a>
            <a href="#paginago" className="hover:text-slate-900 transition">PaginaGo</a>
            <a href="#auto" className="hover:text-slate-900 transition">Automatizaciones</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={waUrl('Hola tuEndpoint, me gustaría consultar por sus soluciones de software.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Hablemos</span>
            </a>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. HERO: ILUMINACIÓN STUDIO APPLE (CERO CUADRADOS DE IA)            */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28 border-b border-slate-100 bg-white">
        {/* Iluminación de estudio suave sin cuadrados */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-sky-100/50 via-sky-50/20 to-transparent blur-3xl opacity-80" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#0284c7]">
            <span>SOFTWARE FACTORY & PLATAFORMAS EN PRODUCCIÓN</span>
          </div>

          {/* Titular con Typewriter */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0F172A] leading-[1.08]">
            Software enterprise que resuelve{' '}
            <span className="text-[#0284c7] inline-block">
              <Typewriter
                words={[
                  'operaciones reales.',
                  'urgencias médicas.',
                  'inventarios críticos.',
                  'ventas sin internet.',
                  'tareas manuales.',
                ]}
                speed={70}
                delayBetweenWords={2400}
                cursorChar="|"
                cursorClassName="text-[#0284c7]"
              />
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
            Plataformas críticas en producción para salud, logística y retail en Chile.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#filas"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-sm"
            >
              <span>Explorar Soluciones ↓</span>
            </a>

            <a
              href={waUrl('Hola tuEndpoint, me gustaría conversar con un ingeniero sobre un proyecto de software.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#0284c7]" />
              <span>Hablar con un Ingeniero</span>
            </a>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. SHOWCASE IMAC: VISUAL, PRECISO Y SIN MODALS APILADOS             */}
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
                {/* COLUMNA DE TEXTOS: CORTA, PRECISA Y DIRECTA          */}
                {/* ---------------------------------------------------- */}
                <div className={`space-y-4 lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                    <span className="font-bold text-[#0284c7]">0{index + 1}</span>
                    <span>/</span>
                    <span className="text-slate-600 font-semibold">{prod.category}</span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
                      {prod.name}
                    </h2>
                    <p className="text-base font-semibold text-slate-700 leading-snug">
                      {prod.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    {prod.oneLiner}
                  </p>

                  {/* 3 Puntos Técnicos Rápidos */}
                  <div className="pt-2 space-y-2 text-xs text-slate-600">
                    {prod.techSpecs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* BOTÓN ÚNICO Y DIRECTO: PEDIR DEMO */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {prod.externalUrl ? (
                      <a
                        href={prod.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs"
                      >
                        <span>{prod.ctaText}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <a
                        href={waUrl(`Hola tuEndpoint, me gustaría agendar una demo en vivo de ${prod.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
                        <span>Pedir Demostración en Vivo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* COLUMNA VISUAL: PANTALLA IMAC EN VIVO                */}
                {/* ---------------------------------------------------- */}
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <IMacDisplayStage
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
      {/* 4. FORMULARIO DE CONTACTO DIRECTO                                   */}
      {/* =================================================================== */}
      <section id="contacto" className="py-20 bg-[#F8FAFC] border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">Hablemos de tu proyecto</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                ¿Tienes una necesidad técnica o proceso a implementar?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                Escríbenos directamente o contáctanos por WhatsApp. Respondemos con propuestas claras y factibilidad técnica.
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
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="contacto@institucion.cl"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono o WhatsApp</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="+56 9 ..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Solución de Interés</label>
                <select
                  name="solucion"
                  aria-label="Solución de Interés"
                  defaultValue="filas"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:border-[#0284c7] focus:outline-none"
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
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:border-[#0284c7] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  Email directo: <strong className="text-slate-800">contacto@tuendpoint.cl</strong> · WhatsApp:{' '}
                  <strong className="text-slate-800">+56 9 492 5337</strong>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs font-bold text-white hover:bg-[#0284c7] transition shadow-xs cursor-pointer"
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
