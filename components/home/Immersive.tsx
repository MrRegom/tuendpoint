'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ExternalLink,
  Send,
  CheckCircle2,
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
/* Modelos y Datos de Productos para el Escenario Pantalla Completa   */
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
}

const PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'filas',
    name: 'Gestor de Filas Hospitalario',
    shortName: 'Filas Hospital',
    category: 'Salud Pública',
    badge: 'Ley 20.584 · En Producción',
    description:
      'Llamado audiovisual por voz sintetizada en pantallas y tótems táctiles de autoatención con cédula de identidad para hospitales y farmacias ambulatorias.',
    image: '/shots/filas-1.jpg',
    actionType: 'whatsapp',
    url: 'https://wa.me/5694925337?text=Hola%2C%20solicito%20una%20demostraci%C3%B3n%20en%20vivo%20del%20Gestor%20de%20Filas%20Hospitalario.',
    ctaText: 'Pedir Demo en Vivo',
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
    ctaText: 'Pedir Demo en Vivo',
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
    ctaText: 'Consultar Factibilidad',
  },
];

/* ------------------------------------------------------------------ */
/* Integraciones Oficiales de Chile (Estilo Tipográfico Editorial)    */
/* ------------------------------------------------------------------ */

interface IntegrationItem {
  name: string;
  entity: string;
  description: string;
  tech: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    name: 'FirmaGob',
    entity: 'SEGPRES · Gobierno de Chile',
    description:
      'Firma digital ministerial de documentos PDF con estampado cronológico oficial y verificación en línea de autenticidad.',
    tech: 'REST API · PKCS#7 · Token FEA',
  },
  {
    name: 'ClaveÚnica',
    entity: 'Gobierno Digital',
    description:
      'Autenticación ciudadana oficial para portales públicos y trámites del Estado sin necesidad de almacenar credenciales privadas.',
    tech: 'OpenID Connect · OAuth 2.0',
  },
  {
    name: 'SII Facturación Electrónica',
    entity: 'Servicio de Impuestos Internos',
    description:
      'Emisión, timbraje con CAF, firma digital XML y envío automático de boletas, facturas y guías de despacho ante el SII.',
    tech: 'SOAP / REST · XML DSig · CAF',
  },
  {
    name: 'WhatsApp Business API',
    entity: 'Meta Cloud API Oficial',
    description:
      'Notificaciones masivas certificadas, llamados a pacientes en filas, confirmación de pedidos y boletas enviadas al celular.',
    tech: 'Cloud API · Webhooks 24/7',
  },
  {
    name: 'Mercado Público',
    entity: 'Dirección ChileCompra',
    description:
      'Arquitectura de software adaptada a las normas de contratación del Estado (Ley 19.886) para salud y organismos públicos.',
    tech: 'Ley 19.886 · RUT 78.411.033-8',
  },
];

export function Immersive({ introDone: _introDone }: { introDone?: boolean }) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Formulario a medida minimalista
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
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* ------------------------------------------------------------ */}
      {/* 1. Escenario Cinemático que OCUPA TODA LA PANTALLA           */}
      {/* ------------------------------------------------------------ */}
      <section
        id="productos"
        className="relative w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] min-h-[660px] overflow-hidden bg-black"
      >
        {/* Carrusel de Fondo a Pantalla Completa (Full Bleed 100vw x 100vh) */}
        <Carousel
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: 6000,
              stopOnInteraction: true,
            }),
          ]}
          setApi={setMainApi}
        >
          <CarouselContent className="h-full -ml-0">
            {PRODUCTS.map((prod, index) => (
              <CarouselItem
                key={prod.id}
                className="relative w-full h-full pl-0 shrink-0 select-none"
              >
                <div className="relative w-full h-full overflow-hidden bg-black">
                  <Image
                    alt={prod.name}
                    className="object-cover object-top brightness-75 transition-transform duration-700 ease-out"
                    fill
                    priority={index === 0}
                    src={prod.image}
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Flechas de Navegación Discretas */}
        <button
          type="button"
          onClick={() => mainApi?.scrollPrev()}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => mainApi?.scrollNext()}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Encabezado Superior Integrado sobre el Fondo */}
        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black via-black/80 via-55% to-transparent pt-6 sm:pt-10 pb-20 px-6 text-center pointer-events-none">
          <div className="max-w-4xl mx-auto space-y-2 pointer-events-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-none">
              tuEndpoint<span className="text-[#0EA5E9]">.</span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl font-normal text-zinc-200 tracking-tight">
              Software para{' '}
              <span className="text-white font-medium">
                <Typewriter
                  words={[
                    'Salud y Hospitales',
                    'FirmaGob y ClaveÚnica',
                    'Facturación SII y Boletas',
                    'Bodegas y WMS Logístico',
                    'Puntos de Venta Offline',
                    'Agentes en Equipos 24/7',
                  ]}
                  speed={70}
                  delayBetweenWords={2000}
                  cursorChar="|"
                />
              </span>
            </p>

            <p className="text-xs sm:text-sm text-[#86868b] max-w-xl mx-auto font-normal">
              Plataformas en producción real diseñadas para alta disponibilidad en Chile.
            </p>
          </div>
        </div>

        {/* Overlay Inferior a Pantalla Completa (Solid Black Base + Filmstrip + Controles) */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black from-30% via-black/85 via-60% to-transparent pt-36 pb-6 px-6 sm:px-12 transition-opacity duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6">
            {/* Izquierda: Filmstrip de Miniaturas Interactivas */}
            <div className="relative w-full md:max-w-md order-2 md:order-1">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#86868b] mb-2.5 flex items-center gap-2">
                <span>0{selectedIndex + 1} de 0{PRODUCTS.length}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-white font-medium">{currentProduct.shortName}</span>
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
                          'relative overflow-hidden transition-all duration-300 rounded',
                          index === selectedIndex
                            ? 'h-16 sm:h-20 opacity-100 ring-2 ring-white shadow-lg'
                            : 'h-11 sm:h-13 opacity-40 hover:opacity-80'
                        )}
                      >
                        <Image
                          alt={prod.shortName}
                          className="object-cover object-top h-full w-full"
                          fill
                          src={prod.image}
                          sizes="120px"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Derecha: Información del Producto Seleccionado & Botón */}
            <div className="flex max-w-lg flex-col items-start md:items-end gap-2.5 text-left md:text-right order-1 md:order-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#86868b]">
                {currentProduct.badge}
              </span>

              <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                {currentProduct.name}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md">
                {currentProduct.description}
              </p>

              {/* Botón de Acción con Subrayado Animado Estilo Flow Studio */}
              <div className="pt-1.5">
                {currentProduct.actionType === 'external' ? (
                  <a
                    href={currentProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 overflow-hidden px-2 py-1 font-normal text-sm sm:text-base text-white hover:text-white transition-colors"
                  >
                    <span>{currentProduct.ctaText}</span>
                    <ExternalLink className="h-4 w-4" />
                    <div className="absolute bottom-0 z-20 h-px w-full bg-zinc-600" />
                    <div className="absolute bottom-0 z-30 h-px w-full -translate-x-full bg-white transition-all duration-700 ease-in-out group-hover:translate-x-0" />
                  </a>
                ) : (
                  <a
                    href={currentProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 overflow-hidden px-2 py-1 font-normal text-sm sm:text-base text-white hover:text-white transition-colors"
                  >
                    <span>{currentProduct.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                    <div className="absolute bottom-0 z-20 h-px w-full bg-zinc-600" />
                    <div className="absolute bottom-0 z-30 h-px w-full -translate-x-full bg-white transition-all duration-700 ease-in-out group-hover:translate-x-0" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Marca de Agua Gigante Flow Studio */}
          <div className="pt-6 select-none pointer-events-none">
            <h1 className="text-center font-semibold text-4xl sm:text-7xl md:text-8xl text-white/10 tracking-widest uppercase">
              TUENDPOINT + STUDIO
            </h1>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 2. Integraciones Oficiales de Chile (Estilo Tipográfico)     */}
      {/* ------------------------------------------------------------ */}
      <section id="integraciones" className="px-6 sm:px-8 max-w-5xl mx-auto py-24 border-t border-white/10">
        <div className="max-w-2xl mb-14 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-[#86868b]">
            Infraestructura Digital de Chile
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Integraciones oficiales con el Estado y la empresa.
          </h2>
          <p className="text-base text-[#86868b] leading-relaxed">
            Conectores directos sin intermediarios para operar con los estándares oficiales de Chile.
          </p>
        </div>

        {/* Lista Editorial Limpia (Sin Cards) */}
        <div className="divide-y divide-white/10">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.name}
              className="py-7 flex flex-col md:flex-row md:items-baseline justify-between gap-4 group"
            >
              <div className="md:w-1/3">
                <span className="text-[11px] font-mono text-[#86868b] uppercase tracking-wider block">
                  {item.entity}
                </span>
                <span className="text-lg font-medium text-white group-hover:text-[#0EA5E9] transition-colors">
                  {item.name}
                </span>
              </div>

              <div className="md:w-1/2 text-sm text-zinc-400 leading-relaxed">
                {item.description}
              </div>

              <div className="md:w-1/6 md:text-right text-xs font-mono text-zinc-500">
                {item.tech}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 3. Solicitud de Desarrollo a Medida (Limpio y Espacioso)     */}
      {/* ------------------------------------------------------------ */}
      <section id="formulario" className="px-6 sm:px-8 max-w-4xl mx-auto py-24 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-[#86868b]">
            Ingeniería de Software
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            ¿Busca un desarrollo a medida?
          </h2>
          <p className="text-base text-[#86868b] leading-relaxed">
            Diseñamos sistemas críticos, APIs seguras y módulos específicos. Cuéntenos su requerimiento técnico.
          </p>
        </div>

        {formSent ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-white mx-auto" />
            <h3 className="text-xl font-medium text-white">
              Requerimiento enviado con éxito.
            </h3>
            <p className="text-sm text-[#86868b] max-w-md mx-auto">
              Un ingeniero analizará la factibilidad de su proyecto y le responderá a la brevedad.
            </p>
            <button
              type="button"
              onClick={() => setFormSent(false)}
              className="text-xs font-mono text-white underline pt-4 cursor-pointer"
            >
              Enviar otra consulta
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-mono text-[#86868b] mb-2 uppercase tracking-wider">
                  Nombre y Apellido
                </label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Carlos Valenzuela"
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#86868b] mb-2 uppercase tracking-wider">
                  Empresa o Institución
                </label>
                <input
                  type="text"
                  required
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  placeholder="Clínica / Empresa / Organismo..."
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#86868b] mb-2 uppercase tracking-wider">
                  Teléfono o WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="+56 9 1234 5678"
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#86868b] mb-2 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="carlos@empresa.cl"
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#86868b] mb-2 uppercase tracking-wider">
                Tipo de Requerimiento
              </label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:border-white focus:outline-none transition-colors"
              >
                <option value="Integración FirmaGob / ClaveÚnica" className="bg-black text-white">
                  Integración FirmaGob (SEGPRES) / ClaveÚnica
                </option>
                <option value="Facturación Electrónica SII (DTE XML)" className="bg-black text-white">
                  Facturación Electrónica SII (Boletas / Facturas DTE)
                </option>
                <option value="Gestor de Filas Hospitalario / Tótems" className="bg-black text-white">
                  Gestor de Filas Hospitalario / Tótems de Autoatención
                </option>
                <option value="TICPanel & Agentes en Equipos" className="bg-black text-white">
                  TICPanel & Agentes Silenciosos en Endpoints
                </option>
                <option value="Logística TBA / WMS Bodegas" className="bg-black text-white">
                  Logística TBA / Control de Stock WMS
                </option>
                <option value="CajaYA POS Offline" className="bg-black text-white">
                  CajaYA POS Offline para Comercio o Retail
                </option>
                <option value="Desarrollo de Software Nuevo desde Cero" className="bg-black text-white">
                  Desarrollo de Software Nuevo desde Cero
                </option>
                <option value="Licitación Mercado Público" className="bg-black text-white">
                  Licitación Mercado Público (Ley 19.886)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#86868b] mb-2 uppercase tracking-wider">
                Breve descripción del requerimiento
              </label>
              <textarea
                rows={2}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Indique usuarios, plazos o especificaciones requeridas..."
                className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="text-xs text-[#86868b]">
                Respuesta directa por equipo de ingeniería. Sin intermediarios comerciales.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto rounded-full bg-white text-black hover:bg-zinc-200 px-8 py-3 text-sm font-medium transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Enviar Requerimiento</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
