'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileCheck,
  Building2,
  Cpu,
  Send,
  Sparkles,
  PhoneCall,
  Mail,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Typewriter } from '@/components/ui/typewriter';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Datos de Productos para el Cinematic Showcase Stage                 */
/* ------------------------------------------------------------------ */

interface ShowcaseProduct {
  id: string;
  name: string;
  shortName: string;
  category: string;
  badge: string;
  description: string;
  image: string;
  actionType: 'external' | 'whatsapp';
  url: string;
  ctaText: string;
  ratingText: string;
}

const PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'filas',
    name: 'Gestor de Filas Hospitalario',
    shortName: 'Filas Hospital',
    category: 'Salud Pública',
    badge: 'Ley 20.584 · En Producción',
    description:
      'Llamado audiovisual por voz chilena en pantallas y tótems táctiles de autoatención con RUT para hospitales, clínicas y farmacias ambulatorias.',
    image: '/shots/filas-1.jpg',
    actionType: 'whatsapp',
    url: 'https://wa.me/5694925337?text=Hola%2C%20solicito%20una%20demostraci%C3%B3n%20en%20vivo%20del%20Gestor%20de%20Filas%20Hospitalario.',
    ctaText: 'Pedir Demostración en Vivo',
    ratingText: 'Norma Salud · Ley 20.584',
  },
  {
    id: 'ticpanel',
    name: 'TICPanel · Mesa de Ayuda TI',
    shortName: 'TICPanel',
    category: 'Infraestructura & Endpoints',
    badge: 'Agentes Silenciosos en Equipos',
    description:
      'Agentes ligeros instalados en computadores envían telemetría y métricas en vivo. Tickets Kanban, inventario de hardware y soporte remoto unificado.',
    image: '/shots/ticpanel-1.jpg',
    actionType: 'whatsapp',
    url: 'https://wa.me/5694925337?text=Hola%2C%20solicito%20una%20demostraci%C3%B3n%20en%20vivo%20de%20TICPanel%20y%20sus%20agentes%20en%20equipos.',
    ctaText: 'Pedir Demostración en Vivo',
    ratingText: 'Multi-Plataforma · Telemetría',
  },
  {
    id: 'tba',
    name: 'Logística TBA · WMS Bodega',
    shortName: 'Logística TBA',
    category: 'Cadena de Suministro',
    badge: 'SaaS Cloud · Multi-Bodega',
    description:
      'Control integral de inventario con Kardex FIFO, despachos con código QR, trazabilidad de pallets y sincronización multi-sucursal en tiempo real.',
    image: '/shots/tba-1.jpg',
    actionType: 'external',
    url: 'https://logisticatba.cloud',
    ctaText: 'Visitar logisticatba.cloud',
    ratingText: 'En vivo en logisticatba.cloud',
  },
  {
    id: 'cajaya',
    name: 'CajaYA · POS Offline + Boleta SII',
    shortName: 'CajaYA POS',
    category: 'Retail & Comercio',
    badge: '100% Offline · Boleta DTE',
    description:
      'Punto de venta diseñado para operar sin Internet en cortes de red. Emite boletas electrónicas válidas ante el SII, arqueos e impresión térmica ultra rápida.',
    image: '/shots/cajaya-1.jpg',
    actionType: 'external',
    url: 'https://cajaya.cl',
    ctaText: 'Ver más en cajaya.cl',
    ratingText: 'En vivo en cajaya.cl',
  },
  {
    id: 'paginago',
    name: 'PaginaGo · E-Commerce WhatsApp',
    shortName: 'PaginaGo',
    category: 'Comercio Digital',
    badge: 'Operativo en Producción',
    description:
      'Convierte el chat de WhatsApp en un catálogo interactivo con carrito, cobro Webpay y sincronización automática de pedidos e inventario.',
    image: '/shots/paginago-1.jpg',
    actionType: 'external',
    url: 'https://paginago.com',
    ctaText: 'Ver Demo en paginago.com',
    ratingText: 'Operativo en paginago.com',
  },
  {
    id: 'integraciones',
    name: 'RPA & Desarrollo a Medida',
    shortName: 'Desarrollo a Medida',
    category: 'Ingeniería de Software',
    badge: 'FirmaGob · ClaveÚnica · SII',
    description:
      'Conectamos sus sistemas existentes con FirmaGob, ClaveÚnica, SII, bancos y WhatsApp Business API sin rehacer su infraestructura técnica.',
    image: '/shots/ticpanel-2.jpg',
    actionType: 'whatsapp',
    url: 'https://wa.me/5694925337?text=Hola%2C%20quisiera%20cotizar%20un%20desarrollo%20a%20medida%20o%20integraci%C3%B3n%20cr%C3%ADtica.',
    ctaText: 'Consultar Factibilidad Técnica',
    ratingText: 'APIs & Conectores Oficiales',
  },
];

/* ------------------------------------------------------------------ */
/* Integraciones Oficiales de Chile                                    */
/* ------------------------------------------------------------------ */

interface IntegrationItem {
  name: string;
  entity: string;
  badge: string;
  description: string;
  tech: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    name: 'FirmaGob',
    entity: 'SEGPRES · Gobierno de Chile',
    badge: 'Firma Electrónica Avanzada',
    description:
      'Firma digital ministerial de documentos PDF con estampado cronológico oficial y verificación en línea de autenticidad.',
    tech: 'REST API · PKCS#7 · Token FEA',
  },
  {
    name: 'ClaveÚnica',
    entity: 'Gobierno Digital',
    badge: 'Identidad Ciudadana Oficial',
    description:
      'Autenticación ciudadana segura para portales públicos y trámites del Estado sin necesidad de almacenar credenciales privadas.',
    tech: 'OpenID Connect · OAuth 2.0',
  },
  {
    name: 'SII Facturación Electrónica',
    entity: 'Servicio de Impuestos Internos',
    badge: 'DTE Boleta & Factura XML',
    description:
      'Emisión, timbraje con CAF, firma digital XML y envío automático de boletas, facturas y guías de despacho ante el SII.',
    tech: 'SOAP / REST · XML DSig · CAF',
  },
  {
    name: 'WhatsApp Business API',
    entity: 'Meta Cloud API Oficial',
    badge: 'Mensajería Transaccional',
    description:
      'Notificaciones masivas certificadas, llamados a pacientes en filas, confirmación de pedidos y boletas enviadas al celular.',
    tech: 'Cloud API · Webhooks 24/7',
  },
  {
    name: 'Mercado Público',
    entity: 'Dirección ChileCompra',
    badge: 'Licitaciones & Convenio Marco',
    description:
      'Arquitectura de software adaptada a las normas de contratación del Estado (Ley 19.886) para salud y organismos públicos.',
    tech: 'Ley 19.886 · RUT 78.411.033-8',
  },
];

export function Immersive({ introDone: _introDone }: { introDone?: boolean }) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Formulario de Desarrollo a Medida
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    tipo: 'Integración FirmaGob / ClaveÚnica',
    mensaje: '',
  });
  const [formSent, setFormSent] = useState(false);

  // Sincronización de Thumbnails
  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
    return () => {
      mainApi.off('select', onSelect);
      mainApi.off('reInit', onSelect);
    };
  }, [mainApi, onSelect]);

  const currentProduct = PRODUCTS[selectedIndex] || PRODUCTS[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `*SOLICITUD DESARROLLO A MEDIDA / INTEGRACIÓN*\n\n` +
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
    <div className="relative min-h-screen bg-[#07090e] text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Luz ambiente superior sutil estilo iMac */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),transparent_70%)]" />

      {/* ------------------------------------------------------------ */}
      {/* 1. Header Minimalista & Headline con Typewriter              */}
      {/* ------------------------------------------------------------ */}
      <section className="relative pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-wider text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            SOLUCIONES TUENDPOINT · INGENIERÍA CHILENA
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Desarrollo de Software e Integraciones para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              <Typewriter
                words={[
                  'Salud y Hospitales',
                  'FirmaGob y ClaveÚnica',
                  'Boletas y Facturación SII',
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

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
            Plataformas de alta disponibilidad sin pantallas lentas ni plantillas genéricas. 
            Vea nuestros sistemas en operación real a continuación:
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 2. Hero Cinematic Showcase (Carousel a Pantalla Ancha)       */}
      {/* ------------------------------------------------------------ */}
      <section className="relative px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.9)]">
          {/* Main Stage Carousel */}
          <Carousel
            className="w-full"
            plugins={[
              Autoplay({
                delay: 6000,
                stopOnInteraction: true,
              }),
            ]}
            setApi={setMainApi}
          >
            <CarouselContent>
              {PRODUCTS.map((prod, index) => (
                <CarouselItem key={prod.id}>
                  <div className="relative aspect-[16/10] sm:aspect-video w-full overflow-hidden bg-zinc-950">
                    <Image
                      alt={prod.name}
                      className="object-cover object-top transition-transform duration-700 ease-out"
                      fill
                      priority={index === 0}
                      src={prod.image}
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                    {/* Viñeta sutil para contraste */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Flechas de navegación para desktop */}
          <button
            type="button"
            onClick={() => mainApi?.scrollPrev()}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 backdrop-blur-md border border-white/10 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => mainApi?.scrollNext()}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 backdrop-blur-md border border-white/10 transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Overlay Inferior (Thumbnails a la izquierda + Detalles y CTA a la derecha) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-4 sm:p-8 pt-12 transition-opacity duration-300">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
              {/* Izquierda: Filmstrip de Thumbnails */}
              <div className="relative w-full md:max-w-md order-2 md:order-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-2">
                  <span>Productos en Producción</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-emerald-400 font-semibold">
                    0{selectedIndex + 1} de 0{PRODUCTS.length}
                  </span>
                </div>
                <Carousel
                  className="w-full"
                  opts={{
                    containScroll: 'keepSnaps',
                    dragFree: true,
                  }}
                  setApi={setThumbApi}
                >
                  <CarouselContent className="-ml-2 flex-row items-end">
                    {PRODUCTS.map((prod, index) => (
                      <CarouselItem
                        className="basis-1/4 sm:basis-1/5 cursor-pointer pl-2"
                        key={prod.id}
                        onClick={() => onThumbClick(index)}
                      >
                        <div
                          className={cn(
                            'relative overflow-hidden rounded-lg transition-all duration-300 border',
                            index === selectedIndex
                              ? 'h-16 sm:h-20 border-emerald-400 opacity-100 ring-2 ring-emerald-400/40'
                              : 'h-12 sm:h-14 border-white/20 opacity-50 hover:opacity-80'
                          )}
                        >
                          <Image
                            alt={prod.shortName}
                            className="object-cover object-top h-full w-full"
                            fill
                            src={prod.image}
                            sizes="120px"
                          />
                          <div className="absolute inset-0 bg-black/30" />
                          <span className="absolute bottom-1 left-1.5 right-1 text-[9px] font-mono text-white truncate drop-shadow">
                            {prod.shortName}
                          </span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Derecha: Información del Producto Seleccionado & Botón */}
              <div className="flex max-w-xl flex-col items-start md:items-end gap-3 text-left md:text-right order-1 md:order-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {currentProduct.badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {currentProduct.category}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                  {currentProduct.name}
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-md">
                  {currentProduct.description}
                </p>

                {/* Botón de Acción con Subrayado Animado Minimalista */}
                <div className="pt-2">
                  {currentProduct.actionType === 'external' ? (
                    <a
                      href={currentProduct.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-2 overflow-hidden px-1 py-1 font-medium text-base text-white hover:text-emerald-400 transition-colors"
                    >
                      <span>{currentProduct.ctaText}</span>
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      <div className="absolute bottom-0 z-20 h-[2px] w-full bg-zinc-700" />
                      <div className="absolute bottom-0 z-30 h-[2px] w-full -translate-x-full bg-emerald-400 transition-transform duration-500 ease-in-out group-hover:translate-x-0" />
                    </a>
                  ) : (
                    <a
                      href={currentProduct.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-2 overflow-hidden px-1 py-1 font-medium text-base text-white hover:text-emerald-400 transition-colors"
                    >
                      <span>{currentProduct.ctaText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      <div className="absolute bottom-0 z-20 h-[2px] w-full bg-zinc-700" />
                      <div className="absolute bottom-0 z-30 h-[2px] w-full -translate-x-full bg-emerald-400 transition-transform duration-500 ease-in-out group-hover:translate-x-0" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Marca de Agua Minimalista Gigante */}
            <div className="pt-6 border-t border-white/10 mt-6 select-none pointer-events-none">
              <h1 className="text-center font-black text-3xl sm:text-6xl md:text-8xl text-white/[0.07] tracking-widest uppercase">
                TUENDPOINT + STUDIO
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 3. Integraciones Críticas de Chile (FirmaGob, ClaveÚnica...) */}
      {/* ------------------------------------------------------------ */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Infraestructura Digital de Chile</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Integraciones Oficiales con el Estado y la Empresa
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Desarrollamos conectores de alto rendimiento para interactuar con los servicios clave del ecosistema público y privado sin intermediarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.name}
              className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-emerald-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-300 border border-white/10">
                  {item.entity}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Protocolo</span>
                <span className="text-zinc-400">{item.tech}</span>
              </div>
            </div>
          ))}

          {/* Card de Capacidad Técnica Especial */}
          <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/[0.02] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
                <Cpu className="h-4 w-4" />
                <span>¿Requiere una API o Conector Específico?</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Conectamos Sistemas Heredados
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Transformamos bases de datos relacionales, sistemas legacy o webhooks privados en arquitecturas modernas y seguras.
              </p>
            </div>
            <a
              href="#formulario"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Consultar por mi requerimiento</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 4. Formulario de Desarrollo a Medida & Integraciones          */}
      {/* ------------------------------------------------------------ */}
      <section id="formulario" className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-16">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/90 p-6 sm:p-12 backdrop-blur-md">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              SOLICITUD DE INGENIERÍA
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              ¿Busca un Desarrollo a Medida o Integración?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Complete el formulario y nuestro equipo de ingenieros analizará la factibilidad técnica de su proyecto de forma directa.
            </p>
          </div>

          {formSent ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-semibold text-white">
                Requerimiento Enviado con Éxito
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                Hemos recibido los antecedentes de su solicitud. Un ingeniero se pondrá en contacto con usted en breve por WhatsApp o correo.
              </p>
              <button
                type="button"
                onClick={() => setFormSent(false)}
                className="mt-4 text-xs font-mono text-emerald-400 underline"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-2">
                    NOMBRE Y APELLIDO *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej. Carlos Valenzuela"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-2">
                    EMPRESA / INSTITUCIÓN *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.empresa}
                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                    placeholder="Ej. Clínica Santa María / Municipalidad..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-2">
                    TELÉFONO O WHATSAPP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="+56 9 1234 5678"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-2">
                    CORREO ELECTRÓNICO *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="carlos@empresa.cl"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-2">
                  TIPO DE REQUERIMIENTO *
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0c1017] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
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
                <label className="block text-xs font-mono text-zinc-300 mb-2">
                  DESCRIPCIÓN DEL PROYECTO O PREGUNTAS (OPCIONAL)
                </label>
                <textarea
                  rows={3}
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  placeholder="Detalle plazos, cantidad de usuarios, servidores o integraciones requeridas..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Respuesta técnica directa sin intermediarios comerciales</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-3 font-semibold text-sm text-black transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Enviar Requerimiento a Ingeniería</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 5. Franja Corporativa de Transparencia & Contacto            */}
      {/* ------------------------------------------------------------ */}
      <section className="border-t border-white/[0.08] bg-black/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="text-sm font-semibold text-white tracking-wide">
              SOLUCIONES TUENDPOINT SPA
            </div>
            <div className="text-xs font-mono text-zinc-400 mt-1">
              RUT: 78.411.033-8 · Viña del Mar, Región de Valparaíso, Chile
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs font-mono text-zinc-300">
            <a
              href="mailto:contacto@tuendpoint.cl"
              className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-emerald-400" />
              contacto@tuendpoint.cl
            </a>
            <a
              href="https://wa.me/5694925337"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
              +56 9 492 5337
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
