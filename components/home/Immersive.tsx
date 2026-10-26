'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Monitor,
  Printer,
  Sparkles,
  ArrowRight,
  Tv,
  Smartphone,
  Layers,
  Database,
  Users,
  Check,
  Send,
  MessageSquare,
  Building2,
  Zap,
  ShoppingBag,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { brand } from '@/lib/config/brand';
import { TUENDPOINT_COMPANY } from '@/lib/cotizador/catalog';
import { AssistantBot } from '@/components/home/AssistantBot';
import { TextMorph } from '@/components/ui/text-morph';

/* ------------------------------------------------------------------ */
/* Datos oficiales de productos y pantallas                           */
/* ------------------------------------------------------------------ */

interface ScreenTab {
  id: string;
  label: string;
  type: 'img' | 'filas-tv' | 'filas-totem' | 'auto-monitor';
  src?: string;
  badge?: string;
  description?: string;
}

interface ProductShowcase {
  id: string;
  name: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  screens: ScreenTab[];
  externalUrl?: string;
  ctaText: string;
  ctaAction?: 'demo' | 'cotizador' | 'external';
  accentColor: string;
}

const PRODUCTS: ProductShowcase[] = [
  {
    id: 'filas',
    name: 'Gestor de Filas Hospitalario',
    category: 'Salud Pública & Atención Presencial',
    badge: 'Ley 20.584 · En Producción en Hospitales',
    tagline: 'Llamado por voz sintetizada en pantallas TV y tótems táctiles de autoatención',
    description:
      'Plataforma integral diseñada para erradicar las salas de espera caóticas. Combina pantallas informativas de alta visibilidad con audio de voz chilena, tótems táctiles de autoatención con lector de cédula (RUT) y un panel de ventanilla que entrega trazabilidad y tiempos de espera en tiempo real.',
    features: [
      'Pantalla TV de llamado audiovisual con voz sintetizada natural e indicación clara de módulo.',
      'Tótems táctiles 21.5" antivandálicos con corte automático de ticket e ingreso por cédula de identidad.',
      'Prioridad garantizada por Ley 20.584 (adulto mayor, embarazadas y personas con movilidad reducida).',
      'Panel de control de ventanillas en vivo con métricas de tiempos de espera para jefaturas y dirección médica.',
    ],
    screens: [
      { id: 'tv', label: 'TV Sala de Espera', type: 'filas-tv', badge: 'Llamados en Vivo' },
      { id: 'totem', label: 'Tótem Táctil 21.5"', type: 'filas-totem', badge: 'Autoatención' },
      { id: 'envivo', label: 'Panel en Vivo', type: 'img', src: '/shots/filas-1.jpg', badge: 'Panel Módulos' },
      { id: 'resumen', label: 'Resumen Diario', type: 'img', src: '/shots/filas-2.jpg', badge: 'Métricas' },
      { id: 'trazabilidad', label: 'Trazabilidad', type: 'img', src: '/shots/filas-3.jpg', badge: 'Auditoría' },
    ],
    ctaText: 'Pedir Demo de Filas',
    ctaAction: 'demo',
    accentColor: '#0284c7',
  },
  {
    id: 'ticpanel',
    name: 'TICPanel — Mesa de Ayuda & Actas TI',
    category: 'Infraestructura Tecnológica Institucional',
    badge: 'Validado en Redes de Salud Pública',
    tagline: 'Gestión unificada de incidentes técnicos, inventario de hardware y actas con firma digital',
    description:
      'Control total sobre todo el parque informático de tu institución. Permite a los funcionarios ingresar solicitudes técnicas con derivación inmediata según criticidad, registrar la hoja de vida completa de cada computador o impresora y emitir actas oficiales de entrega y devolución válidas para auditorías.',
    features: [
      'Mesa de tickets multicanal con derivación inteligente por especialidad, urgencia y tiempos de respuesta (SLA).',
      'Inventario detallado con lectura de código de barras, ubicación física, especificaciones y responsable.',
      'Generación y almacenamiento de actas de recepción y entrega de equipamiento con firma digital.',
      'Diseñado conforme a exigencias de auditoría interna y estándares de seguridad para el sector público.',
    ],
    screens: [
      { id: 'panel', label: 'Panel General', type: 'img', src: '/shots/ticpanel-1.jpg', badge: 'Dashboard' },
      { id: 'tickets', label: 'Mesa de Tickets', type: 'img', src: '/shots/ticpanel-2.jpg', badge: 'SLA & Gestión' },
      { id: 'actas', label: 'Actas Digitales', type: 'img', src: '/shots/ticpanel-3.jpg', badge: 'Firmas' },
      { id: 'equipos', label: 'Control de Hardware', type: 'img', src: '/shots/ticpanel-4.jpg', badge: 'Inventario' },
    ],
    ctaText: 'Solicitar Demostración TICPanel',
    ctaAction: 'demo',
    accentColor: '#0284c7',
  },
  {
    id: 'tba',
    name: 'Logística TBA — Solicitudes y Bodega',
    category: 'Educación & Logística Institucional',
    badge: 'En Producción Activa · logisticatba.cloud',
    tagline: 'Centralización de pedidos internos, control de existencias, órdenes de compra y activos fijos',
    description:
      'La solución que conecta a los solicitantes con los departamentos de adquisiciones y almacén central. Digitaliza el flujo completo de compras, recepciones conformes y entregas, eliminando planillas Excel dispersas y garantizando que ningún insumo crítico quede sin control.',
    features: [
      'Portal de solicitudes internas con flujo jerárquico de aprobaciones por departamento o centro de costo.',
      'Kardex de bodega automatizado con control de lotes, existencias en tiempo real y alertas de stock mínimo.',
      'Trazabilidad directa con vinculación a órdenes de compra, proveedores y facturas comerciales.',
      'Acceso en la nube seguro con perfiles diferenciados para funcionarios, jefaturas y bodegueros.',
    ],
    screens: [
      { id: 'dash', label: 'Dashboard Operativo', type: 'img', src: '/shots/tba-1.jpg', badge: 'Métricas Bodega' },
      { id: 'bodega', label: 'Control de Almacén', type: 'img', src: '/shots/tba-2.jpg', badge: 'Kardex Digital' },
      { id: 'reportes', label: 'Reportes & Auditoría', type: 'img', src: '/shots/tba-3.jpg', badge: 'Exportación' },
      { id: 'modulos', label: 'Módulos Institucionales', type: 'img', src: '/shots/tba-4.jpg', badge: 'Configuración' },
    ],
    externalUrl: 'https://logisticatba.cloud',
    ctaText: 'Ir a logisticatba.cloud',
    ctaAction: 'external',
    accentColor: '#0284c7',
  },
  {
    id: 'cajaya',
    name: 'CajaYA — POS Offline + Boleta SII',
    category: 'Retail & Comercio de Alta Demanda',
    badge: 'Resiliente a Caídas de Internet + DTE SII',
    tagline: 'Punto de venta ultra veloz que nunca se detiene, incluso sin conexión a internet',
    description:
      'Construido para locales comerciales y puntos de cobro donde detener la venta no es una opción. Si se corta la red o falla el proveedor de internet, CajaYA sigue operando con total normalidad, cobrando e imprimiendo comprobantes, y sincroniza automáticamente las boletas electrónicas con el SII al reanudarse la señal.',
    features: [
      'Operación 100% offline garantizada: sigue vendiendo sin interrupción ante cortes de luz o de internet.',
      'Integración nativa con el SII para timbraje y emisión inmediata de boletas y facturas electrónicas.',
      'Control de turnos y cajeros con arqueo ciego, cuadratura de caja y reporte Z al instante.',
      'Catálogo con búsqueda predictiva por código de barras o pantalla táctil optimizada para velocidad.',
    ],
    screens: [
      { id: 'pos', label: 'Punto de Venta', type: 'img', src: '/shots/cajaya-1.jpg', badge: 'Pantalla Cobro' },
      { id: 'inicio', label: 'Vista Inicio', type: 'img', src: '/shots/cajaya-2.jpg', badge: 'Turno Activo' },
      { id: 'miturno', label: 'Arqueo de Turno', type: 'img', src: '/shots/cajaya-3.jpg', badge: 'Cuadratura' },
      { id: 'turnos', label: 'Historial Turnos', type: 'img', src: '/shots/cajaya-4.jpg', badge: 'Cierres Z' },
      { id: 'stock', label: 'Control de Stock', type: 'img', src: '/shots/cajaya-5.jpg', badge: 'Inventario' },
      { id: 'ventas', label: 'Registro de Ventas', type: 'img', src: '/shots/cajaya-6.jpg', badge: 'DTE SII' },
    ],
    externalUrl: 'https://cajaya.cl',
    ctaText: 'Conocer cajaya.cl',
    ctaAction: 'external',
    accentColor: '#0284c7',
  },
  {
    id: 'paginago',
    name: 'PaginaGo — Catálogo & Ventas WhatsApp',
    category: 'Comercio Digital & Emprendimientos',
    badge: 'Producto a la Venta · paginago.com',
    tagline: 'Tu tienda online en un link para recibir pedidos listos y calculados en tu WhatsApp',
    description:
      'La forma más rápida y económica de vender por internet sin comisiones por transacción ni configuraciones engorrosas. Crea tu catálogo con fotos, precios y variantes, comparte tu link exclusivo (paginago.com/tutienda) y recibe los pedidos organizados con lista, dirección y total en tu WhatsApp.',
    features: [
      'Sin comisiones por venta: el 100% de la recaudación es para tu negocio.',
      'Carrito de compras integrado que envía el pedido estructurado con datos de entrega directo a WhatsApp.',
      'Panel autogestionable desde el celular para cargar productos, pausar stock y modificar precios en segundos.',
      'Plataforma activa y comercializada con soporte directo en [paginago.com](https://paginago.com).',
    ],
    screens: [
      { id: 'tienda', label: 'Tienda Virtual', type: 'img', src: '/shots/paginago-1.jpg', badge: 'Catálogo Móvil' },
      { id: 'como', label: 'Flujo de Compra', type: 'img', src: '/shots/paginago-2.jpg', badge: 'A WhatsApp' },
      { id: 'ejemplos', label: 'Tiendas Reales', type: 'img', src: '/shots/paginago-3.jpg', badge: 'Casos Éxito' },
      { id: 'planes', label: 'Planes & Precios', type: 'img', src: '/shots/paginago-4.jpg', badge: 'Suscripción' },
    ],
    externalUrl: 'https://paginago.com',
    ctaText: 'Ir a paginago.com',
    ctaAction: 'external',
    accentColor: '#0284c7',
  },
  {
    id: 'auto',
    name: 'Automatizaciones & Bots RPA a Medida',
    category: 'Integración de Sistemas & Eficiencia Operativa',
    badge: 'Desarrollo Especializado tuEndpoint',
    tagline: 'Conectamos sistemas desconectados y eliminamos tareas manuales repetitivas',
    description:
      'Desarrollamos robots de software (RPA) y conectores API dedicados que transfieren datos automáticamente entre ERPs, sistemas tributarios, plataformas web institucionales y planillas. Reduce horas de digitación manual, elimina errores humanos y acelera tus procesos operativos.',
    features: [
      'Bots RPA para extracción y carga automática de facturas, órdenes de compra y registros en portales web.',
      'Desarrollo de APIs e integraciones seguras entre bases de datos heredadas (legacy) y sistemas cloud.',
      'Panel de monitoreo de ejecuciones con alertas automáticas ante fallos o discrepancias de datos.',
      'Retorno de inversión medible desde el primer mes mediante ahorro directo en horas-hombre.',
    ],
    screens: [
      { id: 'monitor', label: 'Monitor de Ejecuciones', type: 'auto-monitor', badge: 'Procesos en Vivo' },
    ],
    ctaText: 'Cuéntanos tu Proceso',
    ctaAction: 'demo',
    accentColor: '#0284c7',
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
    let startTime = performance.now();

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

      // Panel principal izquierdo
      const ew = W * 0.62;
      const eh = H - 96;
      ctx.fillStyle = OSCURO2;
      ctx.beginPath();
      ctx.roundRect(20, 84, ew, eh, 12);
      ctx.fill();

      ctx.fillStyle = ACENTO;
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillText('ATENCIÓN A USUARIOS', 40, 116);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 32px Inter, sans-serif';
      ctx.fillText('Bienvenido', 40, 156);
      ctx.fillStyle = '#B9CCE6';
      ctx.font = '400 15px Inter, sans-serif';
      ctx.fillText('Retire su número en el tótem y espere su llamado en pantalla.', 40, 186);

      // Módulos en vivo
      const mods = [
        { m: 'Módulo 1', c: cur.mod === 'Módulo 1' ? cur.cod : prev1.cod, st: cur.mod === 'Módulo 1' ? 'Llamando' : 'Atendiendo' },
        { m: 'Módulo 2', c: cur.mod === 'Módulo 2' ? cur.cod : prev2.cod, st: cur.mod === 'Módulo 2' ? 'Llamando' : 'Atendiendo' },
      ];
      mods.forEach((md, idx) => {
        const mx = 40 + idx * (ew * 0.46);
        const my = 220;
        const mw = ew * 0.43;
        const mh = 110;
        const isCalling = md.st === 'Llamando';

        ctx.fillStyle = isCalling ? 'rgba(250,175,64,0.18)' : 'rgba(255,255,255,0.06)';
        ctx.strokeStyle = isCalling ? ACENTO : 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(mx, my, mw, mh, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isCalling ? ACENTO : '#34d399';
        ctx.beginPath();
        ctx.arc(mx + 16, my + 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '700 11px Inter, sans-serif';
        ctx.fillText(md.st.toUpperCase(), mx + 26, my + 24);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 28px monospace';
        ctx.fillText(md.c, mx + 16, my + 68);
        ctx.fillStyle = '#B9CCE6';
        ctx.font = '600 14px Inter, sans-serif';
        ctx.fillText(md.m, mx + 16, my + 94);
      });

      // Onda de audio voz
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.beginPath();
      ctx.roundRect(40, 350, ew - 60, 80, 10);
      ctx.fill();
      ctx.fillStyle = '#B9CCE6';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText('AVISO POR VOZ SINTETIZADA', 56, 376);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 15px Inter, sans-serif';
      ctx.fillText(`"Turno ${cur.cod}, dirigirse a ${cur.mod}"`, 56, 404);

      // Panel derecho (Turno actual destacado)
      const rx = ew + 32;
      const rw = W - rx - 20;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(rx, 84, rw, eh, 12);
      ctx.fill();

      // Recuadro del llamado
      ctx.fillStyle = ACENTO;
      ctx.beginPath();
      ctx.roundRect(rx + 16, 104, rw - 32, 180, 10);
      ctx.fill();

      ctx.fillStyle = OSCURO;
      ctx.font = '700 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cur.pref ? '★ ATENCIÓN PREFERENTE' : 'TURNO LLAMADO', rx + rw / 2, 136);

      ctx.font = '900 54px monospace';
      ctx.fillText(cur.cod, rx + rw / 2, 206);

      ctx.font = '700 20px Inter, sans-serif';
      ctx.fillText(cur.mod, rx + rw / 2, 252);

      // Turnos anteriores
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillText('TURNOS ANTERIORES', rx + 20, 320);

      [prev1, prev2].forEach((p, i) => {
        const py = 345 + i * 44;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(rx + 16, py, rw - 32, 36, 6);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 14px monospace';
        ctx.fillText(p.cod, rx + 28, py + 23);
        ctx.fillStyle = '#64748b';
        ctx.font = '500 12px Inter, sans-serif';
        ctx.fillText(p.mod, rx + 100, py + 23);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full aspect-[16/10] bg-[#002A54] rounded-lg overflow-hidden shadow-inner border border-slate-700">
      <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white font-mono">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>SIMULACIÓN EN VIVO</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulador Tótem Táctil 21.5" con corte de ticket                   */
/* ------------------------------------------------------------------ */

function FilasTotemSimulator() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [ticketPrinted, setTicketPrinted] = useState<{ cod: string; serv: string } | null>(null);

  const services = [
    { id: 'farmacia', name: 'Farmacia CAE', icon: '💊', wait: '3 personas en espera', prefix: 'A' },
    { id: 'preferente', name: 'Atención Preferente', icon: '★', wait: 'Ley 20.584 · Prioridad', prefix: 'P' },
    { id: 'recetas', name: 'Entrega de Recetas', icon: '📋', wait: '1 persona en espera', prefix: 'F' },
    { id: 'informaciones', name: 'Orientación & OIRS', icon: 'ℹ️', wait: 'Sin espera', prefix: 'O' },
  ];

  const handleSelect = (serv: (typeof services)[0]) => {
    setSelectedService(serv.id);
    const num = Math.floor(Math.random() * 50) + 10;
    const cod = `${serv.prefix}-${num}`;
    setTimeout(() => {
      setTicketPrinted({ cod, serv: serv.name });
    }, 400);
  };

  return (
    <div className="w-full aspect-[16/10] bg-slate-950 p-4 sm:p-6 rounded-lg text-white flex flex-col justify-between border border-slate-800 relative overflow-hidden">
      {/* Header del Tótem */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#FAAF40] text-slate-950 font-black text-xs flex items-center justify-center">
            +
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Tótem Autoatención Hospitalario</span>
            <span className="text-[10px] text-slate-400">Toque la pantalla para retirar su turno</span>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
          ● ONLINE · IMPRESORA OK
        </span>
      </div>

      {/* Pantalla interactiva del Tótem */}
      {!ticketPrinted ? (
        <div className="py-3 space-y-3">
          <p className="text-xs font-bold text-slate-300">Seleccione el servicio al que se dirige:</p>
          <div className="grid grid-cols-2 gap-2.5">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s)}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  selectedService === s.id
                    ? 'border-amber-400 bg-amber-400/20'
                    : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <span className="text-xs font-bold text-white">{s.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">{s.wait}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Ticket impreso */
        <div className="py-4 flex flex-col items-center justify-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white text-slate-950 p-4 rounded shadow-2xl w-48 text-center font-mono border-t-4 border-dashed border-slate-300">
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Hospital de Red</span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">{ticketPrinted.serv}</span>
            <div className="my-2 border-y border-dashed border-slate-300 py-2">
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
            className="text-[11px] font-bold text-amber-400 hover:underline"
          >
            ← Imprimir otro turno
          </button>
        </div>
      )}

      {/* Footer del Tótem */}
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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-[16/10] bg-[#0A0F1D] p-5 rounded-lg text-white font-mono text-xs flex flex-col justify-between border border-slate-800 shadow-inner">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white text-xs">Monitor de Procesos RPA & Webhooks</span>
          </div>
          <span className="text-[10px] text-slate-400">0 Errores · 99.98% Uptime</span>
        </div>

        <div className="mt-4 space-y-2">
          {logs.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500">{l.time}</span>
                <span className="text-slate-200 font-semibold">{l.job}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{l.records}</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
        <span>Conectores API REST · Webhooks · Bots Puppeteer · Cronjobs</span>
        <span className="text-emerald-400 font-bold">Activo 24/7</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COMPONENTE PRINCIPAL: WEB MINIMALISTA Y MODERNA                    */
/* ------------------------------------------------------------------ */

export function Immersive({ introDone: _introDone }: { introDone: boolean }) {
  // Estado de pantalla activa por cada producto
  const [activeScreens, setActiveScreens] = useState<Record<string, string>>({
    filas: 'tv',
    ticpanel: 'panel',
    tba: 'dash',
    cajaya: 'pos',
    paginago: 'tienda',
    auto: 'monitor',
  });

  const setProductScreen = (productId: string, screenId: string) => {
    setActiveScreens((prev) => ({ ...prev, [productId]: screenId }));
  };

  // WhatsApp click handler
  const waUrl = (msg: string) =>
    `https://wa.me/${brand.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="immersive-root min-h-screen bg-white text-[#0F172A] font-sans antialiased selection:bg-[#0284c7] selection:text-white">
      {/* =================================================================== */}
      {/* 1. NAVEGACIÓN PRINCIPAL STICKY                                      */}
      {/* =================================================================== */}
      <header className="modern-site-header sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-extrabold tracking-tight text-[#0F172A] group-hover:text-[#0284c7] transition-colors">
              tuEndpoint<span className="text-[#0284c7]">.</span>
            </span>
          </Link>

          {/* Enlaces de Productos */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <a href="#filas" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-slate-50 transition">
              Gestor de Filas
            </a>
            <a href="#ticpanel" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-slate-50 transition">
              TICPanel
            </a>
            <a href="#tba" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-slate-50 transition">
              Logística TBA
            </a>
            <a href="#cajaya" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-slate-50 transition">
              CajaYA POS
            </a>
            <a href="#paginago" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-slate-50 transition">
              PaginaGo
            </a>
            <a href="#auto" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-slate-50 transition">
              Automatizaciones
            </a>
          </nav>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/es/cotizador"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-600" />
              <span>Cotizador PDF</span>
            </Link>

            <a
              href={waUrl('Hola tuEndpoint, me gustaría consultar por sus soluciones de software.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0284c7] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Hablemos</span>
            </a>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. HERO PRINCIPAL: MINIMALISTA, ELEGANTE Y DIRECTO                  */}
      {/* =================================================================== */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
          {/* Badge de acreditación */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>PROVEEDOR DEL ESTADO HÁBIL · MERCADO PÚBLICO / CHILECOMPRA</span>
          </div>

          {/* Titular Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.12]">
            Software enterprise y plataformas críticas que resuelven{' '}
            <span className="text-[#0284c7]">operaciones reales.</span>
          </h1>

          {/* Subtítulo dinámico y beneficio directo */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Desarrollamos soluciones tecnológicas estables para{' '}
            <span className="font-semibold text-slate-800">hospitales, educación, retail y empresas</span> en Chile.
            Sistemas probados en terreno, con soporte técnico local y facturación electrónica inmediata.
          </p>

          {/* Botones de Acción de Portada */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#filas"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition shadow-sm"
            >
              <span>Ver Soluciones en Uso</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              href="/es/cotizador"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
            >
              <FileText className="h-4 w-4 text-[#0284c7]" />
              <span>Cotizador de Licitaciones (PDF)</span>
            </Link>

            <a
              href={waUrl('Hola tuEndpoint, necesito información para implementar software en mi institución.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
            >
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span>+56 9 492 5337</span>
            </a>
          </div>

          {/* Barra de Acreditaciones y Respaldo Institucional */}
          <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-3 rounded-lg bg-white border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Soluciones Propias</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">6 Plataformas Activas</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Mercado Público</span>
              <span className="text-sm font-black text-emerald-700 mt-0.5 block">Habilitado Ley 19.886</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Facturación SII</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">RUT: 78.411.033-8</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-100 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Casa Matriz</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">Viña del Mar, Chile</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. SHOWCASE DE PRODUCTOS: CADA UNO SE LUCE CON SU TEXTO Y CAPTURA    */}
      {/* =================================================================== */}
      <section className="py-16 sm:py-24 space-y-20 sm:space-y-32">
        {PRODUCTS.map((prod, index) => {
          const isReversed = index % 2 === 1;
          const currentScreenId = activeScreens[prod.id] || prod.screens[0].id;
          const currentScreen = prod.screens.find((s) => s.id === currentScreenId) || prod.screens[0];

          return (
            <div
              key={prod.id}
              id={prod.id}
              className="scroll-mt-24 mx-auto max-w-7xl px-4 sm:px-6"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* ---------------------------------------------------- */}
                {/* COLUMNA DE TEXTOS Y BENEFICIOS                       */}
                {/* ---------------------------------------------------- */}
                <div className={`space-y-5 lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  {/* Categoría y Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800 border border-sky-200">
                      {prod.category}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                      {prod.badge}
                    </span>
                  </div>

                  {/* Nombre y Título del Producto */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                      {prod.name}
                    </h2>
                    <p className="mt-1.5 text-base sm:text-lg font-bold text-[#0284c7] leading-snug">
                      {prod.tagline}
                    </p>
                  </div>

                  {/* Descripción Detallada */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Lista de Capacidades Técnicas */}
                  <div className="space-y-2.5 pt-1">
                    {prod.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="mt-0.5 rounded-full bg-emerald-100 text-emerald-700 p-0.5 shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botones de Acción Específicos */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {prod.externalUrl ? (
                      <a
                        href={prod.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0284c7] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-xs"
                      >
                        <span>{prod.ctaText}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <a
                        href={waUrl(`Hola tuEndpoint, me gustaría agendar una demo de ${prod.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0284c7] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{prod.ctaText}</span>
                      </a>
                    )}

                    <Link
                      href="/es/cotizador"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      <span>Cotizar Sistema</span>
                    </Link>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* COLUMNA DE VENTANA DE LA APLICACIÓN / CAPTURA REAL    */}
                {/* ---------------------------------------------------- */}
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="rounded-2xl border border-slate-200/90 bg-white shadow-lg overflow-hidden transition-all">
                    {/* Barra de Título Estilo macOS / App Browser */}
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                      {/* Botones ventana */}
                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-rose-400" />
                        <span className="h-3 w-3 rounded-full bg-amber-400" />
                        <span className="h-3 w-3 rounded-full bg-emerald-400" />
                        <span className="ml-2 font-mono text-[11px] text-slate-500 hidden sm:inline">
                          tuendpoint.cl/{prod.id}
                        </span>
                      </div>

                      {/* Selector de Pantallas / Pestañas de la App */}
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {prod.screens.map((scr) => (
                          <button
                            key={scr.id}
                            type="button"
                            onClick={() => setProductScreen(prod.id, scr.id)}
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
                    </div>

                    {/* Contenedor de la Pantalla / Captura */}
                    <div className="bg-slate-100 p-2 sm:p-4">
                      {/* Render según tipo de pantalla */}
                      {currentScreen.type === 'filas-tv' && <FilasTVSimulator />}

                      {currentScreen.type === 'filas-totem' && <FilasTotemSimulator />}

                      {currentScreen.type === 'auto-monitor' && <AutoMonitorSimulator />}

                      {currentScreen.type === 'img' && currentScreen.src && (
                        <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 bg-white shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={currentScreen.src}
                            alt={`${prod.name} — ${currentScreen.label}`}
                            className="w-full h-full object-cover object-top block"
                            loading="eager"
                          />
                        </div>
                      )}
                    </div>

                    {/* Barra de Estado inferior de la ventana */}
                    <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-700">{currentScreen.badge || currentScreen.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">Captura Real en Producción</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* =================================================================== */}
      {/* 4. BLOQUE INSTITUCIONAL MERCADO PÚBLICO & CHILECOMPRA               */}
      {/* =================================================================== */}
      <section className="py-16 bg-[#001E3D] text-white border-y border-slate-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="h-4 w-4" />
                <span>CHILECOMPRA · PROVEEDOR DEL ESTADO HÁBIL</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Contratación directa y licitaciones bajo Ley 19.886
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>SOLUCIONES TUENDPOINT SPA</strong> (RUT <strong>78.411.033-8</strong>) se encuentra plenamente
                habilitada para contratar con hospitales, municipalidades, servicios de salud, universidades y ministerios
                en todo Chile. Emisión de propuestas técnicas formales con IVA 19% y montos legales en palabras.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                href="/es/cotizador"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-xs font-bold text-slate-950 transition shadow-sm text-center"
              >
                <FileText className="h-4 w-4" />
                <span>Generar Cotización en PDF</span>
              </Link>
              <a
                href={waUrl('Estimados, necesito cotización formal de Soluciones tuEndpoint SpA para licitación.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition text-center"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. FORMULARIO DE CONTACTO / HABLEMOS                                */}
      {/* =================================================================== */}
      <section id="contacto" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-10 shadow-xs space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">Hablemos de tu proyecto</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                ¿Tienes una necesidad técnica o licitación en curso?
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
                  <option value="licitacion">Licitación Mercado Público</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Cuéntanos tu requerimiento o proceso</label>
                <textarea
                  name="mensaje"
                  rows={3}
                  required
                  placeholder="Describe brevemente el flujo, número de usuarios o requerimiento de licitación..."
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
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0284c7] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-xs"
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
      {/* 6. PIE DE PÁGINA CORPORATIVO                                        */}
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
                <li><Link href="/es/cotizador" className="hover:text-slate-900 font-semibold text-[#0284c7]">Cotizador Enterprise (PDF)</Link></li>
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
