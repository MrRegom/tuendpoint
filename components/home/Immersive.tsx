'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Send,
  PhoneCall,
  Mail,
  Layers,
  Activity,
  HardDrive,
  Users,
  Building,
  Check,
} from 'lucide-react';
import { Typewriter } from '@/components/ui/typewriter';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Modelos de Datos                                                   */
/* ------------------------------------------------------------------ */

interface ProductData {
  id: string;
  tabLabel: string;
  name: string;
  tagline: string;
  category: string;
  badge: string;
  description: string;
  image: string;
  urlPath: string;
  bullets: string[];
  actionType: 'external' | 'whatsapp';
  actionUrl: string;
  actionText: string;
}

const PRODUCTS: ProductData[] = [
  {
    id: 'filas',
    tabLabel: '🏥 Gestor de Filas',
    name: 'Gestor de Filas Hospitalario',
    tagline: 'Llamado audiovisual por voz y autoatención con cédula de identidad',
    category: 'Salud Pública · Hospitales y CESFAM',
    badge: 'Ley 20.584 · En Producción',
    description:
      'Erradica el desorden en salas de espera y farmacias ambulatorias. Llamado por voz sintetizada fonética en pantallas de TV y tótems táctiles de 21.5" con corte automático de ticket e ingreso por RUT.',
    image: '/shots/filas-1.jpg',
    urlPath: 'filas.tuendpoint.cl/operacion/en-vivo',
    bullets: [
      'Prioridad estricta para adultos mayores y personas con movilidad reducida (Ley 20.584).',
      'Voz fonética chilena que indica módulo y paciente por audio en sala.',
      'Tótem táctil de autoatención con lector de cédula e impresora térmica integrada.',
    ],
    actionType: 'whatsapp',
    actionUrl:
      'https://wa.me/5694925337?text=Hola%2C%20solicito%20una%20demostraci%C3%B3n%20en%20vivo%20del%20Gestor%20de%20Filas%20Hospitalario.',
    actionText: 'Pedir Demo en Vivo',
  },
  {
    id: 'ticpanel',
    tabLabel: '🖥️ TICPanel TI',
    name: 'TICPanel · Mesa de Ayuda & Agentes TI',
    tagline: 'Telemetría de hardware en vivo con agentes instalados en equipos',
    category: 'Infraestructura & Operaciones TI',
    badge: 'Agentes Silenciosos en Endpoints',
    description:
      'Control total del parque tecnológico. Agentes ligeros instalados en computadores envían telemetría y métricas de rendimiento en vivo a un panel central con tickets Kanban, inventario y soporte remoto.',
    image: '/shots/ticpanel-1.jpg',
    urlPath: 'ticpanel.tuendpoint.cl/dashboard/telemetria',
    bullets: [
      'Agentes silenciosos para Windows y Linux con monitoreo de CPU, RAM y almacenamiento.',
      'Mesa de ayuda con tickets Kanban, actas digitales de entrega y SLA de soporte.',
      'Inventario de hardware automático y detección proactiva de fallas en red.',
    ],
    actionType: 'whatsapp',
    actionUrl:
      'https://wa.me/5694925337?text=Hola%2C%20solicito%20una%20demostraci%C3%B3n%20de%20TICPanel%20y%20sus%20agentes%20en%20equipos.',
    actionText: 'Pedir Demo en Vivo',
  },
  {
    id: 'tba',
    tabLabel: '📦 Logística TBA',
    name: 'Logística TBA · WMS Bodega',
    tagline: 'Control de inventario, Kardex FIFO y despachos con código QR',
    category: 'Cadena de Suministro · Cloud',
    badge: 'Multi-Sucursal · En Vivo',
    description:
      'Software de gestión logística y bodegas diseñado para operar con precisión. Trazabilidad completa de stock, transferencias entre sucursales, despacho con escáner QR y control de mermas.',
    image: '/shots/tba-1.jpg',
    urlPath: 'logisticatba.cloud/inventario/kardex',
    bullets: [
      'Kardex automático con cálculo FIFO y alertas de reposición de stock mínimo.',
      'Despachos y recepción de mercadería mediante pistolas o celulares con lectura QR.',
      'Arquitectura cloud sincronizada en tiempo real para múltiples bodegas.',
    ],
    actionType: 'external',
    actionUrl: 'https://logisticatba.cloud',
    actionText: 'Visitar logisticatba.cloud',
  },
  {
    id: 'cajaya',
    tabLabel: '💳 CajaYA POS',
    name: 'CajaYA · Punto de Venta Offline',
    tagline: 'Punto de venta 100% operativo sin Internet con boleta SII',
    category: 'Retail & Comercio',
    badge: '100% Offline · Boleta DTE',
    description:
      'Punto de venta diseñado para no detener nunca las ventas. Opera de forma 100% autónoma ante cortes de Internet o caídas de red, sincronizando las boletas electrónicas con el SII al restablecer la conexión.',
    image: '/shots/cajaya-1.jpg',
    urlPath: 'cajaya.cl/pos/ventas',
    bullets: [
      'Funcionamiento continuo sin conexión: arqueos, cobranza e impresión térmica veloz.',
      'Emisión directa de boletas electrónicas DTE ante el Servicio de Impuestos Internos.',
      'Control de cajas por turnos, reporte diario de ventas y stock por código de barras.',
    ],
    actionType: 'external',
    actionUrl: 'https://cajaya.cl',
    actionText: 'Ver más en cajaya.cl',
  },
  {
    id: 'paginago',
    tabLabel: '🛒 PaginaGo',
    name: 'PaginaGo · E-Commerce WhatsApp',
    tagline: 'Convierte el chat de WhatsApp en un canal de venta interactivo',
    category: 'Comercio Digital & Pagos',
    badge: 'Operativo en Producción',
    description:
      'Plataforma de comercio conversacional que transforma catálogos en carritos interactivos dentro de WhatsApp, con cobros online mediante Webpay/Flow y sincronización automática de pedidos.',
    image: '/shots/paginago-1.jpg',
    urlPath: 'paginago.com/demo/tienda',
    bullets: [
      'Catálogo visual e interactivo enviado automáticamente por mensaje de WhatsApp.',
      'Cobro con tarjetas de crédito/débito vía Webpay Plus y confirmación instantánea.',
      'Sincronización de pedidos y stock en tiempo real con panel de administración.',
    ],
    actionType: 'external',
    actionUrl: 'https://paginago.com',
    actionText: 'Ver Demo en paginago.com',
  },
];

interface IntegrationData {
  title: string;
  entity: string;
  badge: string;
  summary: string;
  specs: string;
}

const INTEGRATIONS: IntegrationData[] = [
  {
    title: 'FirmaGob',
    entity: 'SEGPRES · Ministerio Secretaría General de la Presidencia',
    badge: 'Firma Electrónica Avanzada (FEA)',
    summary:
      'Firma digital oficial para decretos, convenios y recetas médicas en formato PDF con estampado cronológico y validación ministerial en línea.',
    specs: 'API REST · Certificado PKCS#7 · Token FEA SEGPRES',
  },
  {
    title: 'ClaveÚnica',
    entity: 'División de Gobierno Digital',
    badge: 'Identidad Digital Ciudadana',
    summary:
      'Autenticación e inicio de sesión seguro para portales ciudadanos y aplicaciones del Estado sin almacenar ni gestionar claves privadas.',
    specs: 'OpenID Connect · OAuth 2.0 · JWT con firma RS256',
  },
  {
    title: 'SII Facturación Electrónica',
    entity: 'Servicio de Impuestos Internos',
    badge: 'DTE Boleta & Factura XML',
    summary:
      'Emisión masiva, timbraje automático con CAF, firma digital XML y envío de documentos tributarios (boletas, facturas, guías) ante el SII.',
    specs: 'Protocolo SOAP / REST · XML DSig · CAF oficial',
  },
  {
    title: 'WhatsApp Business API',
    entity: 'Meta Cloud API Oficial',
    badge: 'Mensajería Transaccional Masiva',
    summary:
      'Notificaciones automáticas certificadas para llamado a pacientes en sala, confirmación de pedidos, boletas en PDF y alertas críticas.',
    specs: 'Meta Graph API · Webhooks 24/7 · Plantillas Verificadas',
  },
  {
    title: 'Mercado Público',
    entity: 'Dirección ChileCompra',
    badge: 'Licitaciones & Compras Públicas',
    summary:
      'Arquitectura de software y soporte técnico estructurado bajo los requisitos de contratación pública (Ley 19.886) para salud y municipios.',
    specs: 'Ley 19.886 · Proveedor Constituido · RUT 78.411.033-8',
  },
];

export function Immersive({ introDone: _introDone }: { introDone?: boolean }) {
  const [activeTab, setActiveTab] = useState(0);
  const current = PRODUCTS[activeTab] || PRODUCTS[0];

  // Formulario a medida
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    tipo: 'Integración FirmaGob / ClaveÚnica',
    mensaje: '',
  });
  const [formSent, setFormSent] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `*SOLICITUD DE DESARROLLO / INTEGRACIÓN*\n\n` +
        `*Nombre:* ${form.nombre}\n` +
        `*Empresa / Institución:* ${form.empresa}\n` +
        `*Teléfono:* ${form.telefono}\n` +
        `*Email:* ${form.email}\n` +
        `*Tipo de Requerimiento:* ${form.tipo}\n` +
        `*Detalles:* ${form.mensaje || 'Sin detalles adicionales'}`
    );
    window.open(`https://wa.me/5694925337?text=${text}`, '_blank');
    setFormSent(true);
  };

  return (
    <div className="relative min-h-screen bg-[#06080d] text-white selection:bg-sky-500/30 selection:text-sky-200">
      {/* ------------------------------------------------------------ */}
      {/* 1. Hero Corporativo (Limpio, Moderno y Enfocado en Negocio)  */}
      {/* ------------------------------------------------------------ */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Glow sutil de fondo */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.12),transparent_70%)]" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span>SOLUCIONES TUENDPOINT SPA · INGENIERÍA DE SOFTWARE EN CHILE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
            Software e Integraciones para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
              <Typewriter
                words={[
                  'Salud y Hospitales',
                  'FirmaGob y ClaveÚnica',
                  'Facturación SII y Boletas',
                  'Bodegas y WMS Logístico',
                  'Puntos de Venta Offline',
                  'Agentes Endpoint 24/7',
                ]}
                speed={70}
                delayBetweenWords={2000}
                cursorChar="|"
              />
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Diseñamos y operamos plataformas de alta disponibilidad para el sector público y privado. 
            Sistemas tolerantes a fallos con conectividad nativa a los estándares clave de Chile.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/5694925337?text=Hola%2C%20quisiera%20conversar%20sobre%20un%20proyecto%20o%20integraci%C3%B3n%20con%20tuEndpoint."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-black hover:bg-zinc-200 px-8 py-3.5 text-sm font-semibold transition-all shadow-lg shadow-white/10"
            >
              <span>Solicitar Demostración en Vivo</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#productos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/15 px-7 py-3.5 text-sm font-medium transition-all"
            >
              <span>Explorar Catálogo de Productos</span>
            </a>
          </div>

          {/* Franja de Credenciales Corporativas */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-zinc-500 border-t border-white/[0.08] max-w-4xl mx-auto">
            <span>✓ RUT 78.411.033-8</span>
            <span>✓ Conectores FirmaGob & ClaveÚnica</span>
            <span>✓ Boleta Electrónica SII</span>
            <span>✓ Soporte Local 24/7 en Chile</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 2. Escenario Interactivo: Ventana de Aplicación (Mac Stage)   */}
      {/* ------------------------------------------------------------ */}
      <section id="productos" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 pt-4">
        {/* Selector de Pestañas de Productos */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
          {PRODUCTS.map((prod, index) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => setActiveTab(index)}
              className={cn(
                'shrink-0 rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer',
                index === activeTab
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
              )}
            >
              {prod.tabLabel}
            </button>
          ))}
        </div>

        {/* Marco de Ventana de Software Profesional (Estilo Mac / Browser) */}
        <div className="rounded-2xl border border-white/15 bg-[#0b0e14] shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Barra Superior de la Ventana */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f131a] border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>

            {/* Barra de URL Simulada */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-md bg-black/40 border border-white/10 text-xs font-mono text-zinc-400 w-80 justify-center">
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>https://{current.urlPath}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-zinc-400">En Producción 24/7</span>
            </div>
          </div>

          {/* Captura Real del Software en Alta Resolución (Totalmente Visible y Nítida) */}
          <div className="relative aspect-[16/10] sm:aspect-video w-full bg-black overflow-hidden">
            <Image
              key={current.id}
              alt={current.name}
              className="object-cover object-top transition-opacity duration-300"
              fill
              priority
              src={current.image}
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>

          {/* Ficha Descriptiva del Producto en la Base de la Ventana */}
          <div className="p-6 sm:p-10 bg-[#0c1017] border-t border-white/10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#0EA5E9]/15 text-sky-400 border border-[#0EA5E9]/30">
                    {current.badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {current.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {current.name}
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {current.description}
                </p>

                {/* Bullets de Valor Técnico */}
                <ul className="pt-2 space-y-1.5 text-xs sm:text-sm text-zinc-400">
                  {current.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón de Acción Directo */}
              <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
                {current.actionType === 'external' ? (
                  <a
                    href={current.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full lg:w-auto rounded-full bg-white text-black hover:bg-zinc-200 px-8 py-3.5 text-sm font-semibold transition-all shadow-md"
                  >
                    <span>{current.actionText}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={current.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full lg:w-auto rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3.5 text-sm font-semibold transition-all shadow-md shadow-emerald-500/20"
                  >
                    <span>{current.actionText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 3. Integraciones Oficiales de Chile (La Infraestructura)     */}
      {/* ------------------------------------------------------------ */}
      <section id="integraciones" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 border-t border-white/10">
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Infraestructura Digital de Chile</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Integraciones oficiales con el Estado y la empresa.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Conectores nativos de alto rendimiento diseñados para operar directamente con las entidades oficiales del país sin intermediarios.
          </p>
        </div>

        {/* Grilla Corporativa de Integraciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#0b0e14] p-7 hover:border-sky-500/40 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    {item.entity}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-sky-400 border border-white/10">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 text-xs font-mono text-zinc-500">
                <span className="text-zinc-400">{item.specs}</span>
              </div>
            </div>
          ))}

          {/* Tarjeta de Conectividad para Sistemas Legados */}
          <div className="rounded-2xl border border-dashed border-sky-500/30 bg-sky-500/[0.03] p-7 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider">
                <Cpu className="h-4 w-4" />
                <span>¿Requiere una API o Conector Específico?</span>
              </div>

              <h3 className="text-xl font-bold text-white">
                Modernización de Sistemas Legados
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Interconectamos bases de datos relacionales (SQL Server, Oracle, PostgreSQL), ERPs heredados y webhooks privados sin necesidad de rehacer toda su infraestructura tecnológica.
              </p>
            </div>

            <a
              href="#formulario"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Consultar factibilidad técnica</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 4. ¿Por qué TuEndpoint? (Factores de Confianza & Solidez)    */}
      {/* ------------------------------------------------------------ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
            Garantía Técnica
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Ingeniería de software seria y confiable.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Nuestros clientes confían en nosotros porque construimos plataformas robustas que no se caen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-white/10 bg-[#0b0e14] p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Operación Offline</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Sistemas diseñados con tolerancia a fallos que continúan operando sin interrupción ante cortes de red o Internet.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0b0e14] p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Soporte Local 24/7</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Equipo de ingenieros con base en Chile (Viña del Mar). Respuesta técnica presencial y remota directa sin robots.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0b0e14] p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Código Propio</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Arquitecturas propietarias sin proveedores cautivos. Control completo sobre las bases de datos y la seguridad.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0b0e14] p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Building className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Empresa Formal</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Soluciones tuEndpoint SpA · RUT 78.411.033-8. Facturación electrónica formal para licitaciones y compras públicas.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 5. Solicitud de Desarrollo a Medida & Licitaciones            */}
      {/* ------------------------------------------------------------ */}
      <section id="formulario" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
            Contacto Directo con Ingeniería
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            ¿Busca un desarrollo a medida o una integración?
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            Conversemos directamente sobre su proyecto. Evaluamos la factibilidad técnica, arquitectura y plazos sin compromiso.
          </p>
        </div>

        {formSent ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-10 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">
              Requerimiento Recibido con Éxito
            </h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Un ingeniero revisará los antecedentes técnicos de su solicitud y se pondrá en contacto directo con usted a la brevedad.
            </p>
            <button
              type="button"
              onClick={() => setFormSent(false)}
              className="mt-4 text-xs font-mono text-emerald-400 underline cursor-pointer"
            >
              Enviar otra consulta
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            className="rounded-2xl border border-white/10 bg-[#0b0e14] p-8 sm:p-12 space-y-8 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-2 uppercase tracking-wider">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Carlos Valenzuela"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-2 uppercase tracking-wider">
                  Empresa o Institución *
                </label>
                <input
                  type="text"
                  required
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  placeholder="Ej. Clínica Santa María / Municipalidad..."
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-2 uppercase tracking-wider">
                  Teléfono o WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="+56 9 1234 5678"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-2 uppercase tracking-wider">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="carlos@empresa.cl"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-2 uppercase tracking-wider">
                Tipo de Requerimiento *
              </label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#07090e] px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none transition-colors"
              >
                <option value="Integración FirmaGob / ClaveÚnica">
                  Integración FirmaGob (SEGPRES) / ClaveÚnica
                </option>
                <option value="Facturación Electrónica SII (DTE XML)">
                  Facturación Electrónica SII (Boletas / Facturas DTE)
                </option>
                <option value="Gestor de Filas Hospitalario / Tótems">
                  Gestor de Filas Hospitalario / Tótems de Autoatención
                </option>
                <option value="TICPanel & Agentes en Equipos">
                  TICPanel & Agentes Silenciosos en Endpoints
                </option>
                <option value="Logística TBA / WMS Bodegas">
                  Logística TBA / Control de Stock WMS
                </option>
                <option value="CajaYA POS Offline">
                  CajaYA POS Offline para Comercio o Retail
                </option>
                <option value="Desarrollo de Software Nuevo desde Cero">
                  Desarrollo de Software Nuevo desde Cero
                </option>
                <option value="Licitación Mercado Público">
                  Licitación Mercado Público (Ley 19.886)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-2 uppercase tracking-wider">
                Detalles del Requerimiento Técnico
              </label>
              <textarea
                rows={3}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Indique cantidad aproximada de usuarios, servidores, bases de datos o plazos esperados..."
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="text-xs text-zinc-400">
                Respuesta técnica directa por ingenieros. Sin intermediarios comerciales.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-black hover:bg-zinc-200 px-8 py-3.5 text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                <span>Enviar Requerimiento a Ingeniería</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
