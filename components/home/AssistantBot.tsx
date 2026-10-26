'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { brand } from '@/lib/config/brand';

type ActionChip = {
  label: string;
  kind: 'step' | 'portal' | 'contact' | 'wa' | 'link';
  value: string;
  draft?: string;
};

type GuideState = {
  id: string;
  eyebrow?: string;
  title: string;
  detail?: string;
  chips: ActionChip[];
};

interface AssistantBotProps {
  productIndexById: Record<string, number>;
  contactIndex: number;
  onNavigate: (sectionIndex: number) => void;
  onPrefillContact: (topic: string, draft: string) => void;
}

const ROOT_STATE: GuideState = {
  id: 'root',
  eyebrow: 'NAVEGACIÓN DIRECTA',
  title: '¿Qué necesitas resolver?',
  chips: [
    { label: 'Productos listos en operación', kind: 'step', value: 'productos' },
    { label: 'Cotizador Licitaciones (Generar PDF) 📋', kind: 'link', value: '/es/cotizador' },
    { label: 'Catálogos online (PaginaGo ya a la venta)', kind: 'link', value: 'https://paginago.com' },
    { label: 'Automatizar un proceso manual', kind: 'step', value: 'automatizar' },
    { label: 'Software o web 3D a medida', kind: 'step', value: 'medida' },
    { label: 'Plazos y modalidad de trabajo', kind: 'step', value: 'precios' },
  ],
};

function resolveStep(key: string, label: string): GuideState {
  switch (key) {
    case 'productos':
      return {
        id: key,
        eyebrow: 'PRODUCTOS PROPIOS',
        title: '¿En qué sector operas?',
        chips: [
          { label: 'Salud o atención de público (Hospital)', kind: 'step', value: 'area_salud' },
          { label: 'Educación, bodega o inventario', kind: 'step', value: 'area_bodega' },
          { label: 'Comercio, POS o catálogo WhatsApp', kind: 'step', value: 'area_comercio' },
        ],
      };
    case 'area_salud':
      return {
        id: key,
        eyebrow: 'SALUD · EN PRODUCCIÓN',
        title: 'Sistemas operando en hospital',
        detail:
          'Gestor de Filas (tótem táctil, TV de llamados con voz y métricas) y TICPanel (inventario TI con agente, tickets y actas).',
        chips: [
          { label: 'Ir a Gestor de Filas', kind: 'portal', value: 'filas' },
          { label: 'Ir a TICPanel', kind: 'portal', value: 'ticpanel' },
          {
            label: 'Solicitar una demo',
            kind: 'contact',
            value: 'Producto',
            draft: 'Hola, me interesa ver una demo de sus sistemas para atención de público / soporte TI.',
          },
        ],
      };
    case 'area_bodega':
      return {
        id: key,
        eyebrow: 'LOGÍSTICA E INVENTARIO',
        title: 'Logística TBA',
        detail:
          'Solicitudes internas, órdenes de compra, control de bodega, activos fijos, bajas y auditoría en una sola plataforma.',
        chips: [
          { label: 'Ir a Logística TBA', kind: 'portal', value: 'tba' },
          {
            label: 'Evaluar para mi institución',
            kind: 'contact',
            value: 'Producto',
            draft: 'Hola, quiero evaluar un sistema de bodega, compras e inventario tipo Logística TBA.',
          },
        ],
      };
    case 'area_comercio':
      return {
        id: key,
        eyebrow: 'RETAIL Y VENTAS ONLINE',
        title: 'PaginaGo y CajaYA',
        detail:
          'PaginaGo ya está disponible a la venta: crea catálogos rápidos integrados a WhatsApp. CajaYA es punto de venta con o sin internet, stock y SII.',
        chips: [
          { label: 'Abrir paginago.com (A la venta hoy)', kind: 'link', value: 'https://paginago.com' },
          { label: 'Ver PaginaGo en esta página', kind: 'portal', value: 'paginago' },
          { label: 'Ver CajaYA (POS + SII)', kind: 'portal', value: 'cajaya' },
          {
            label: 'Consultar para mi negocio',
            kind: 'contact',
            value: 'Producto',
            draft: 'Hola, me interesa implementar PaginaGo / CajaYA en mi negocio.',
          },
        ],
      };
    case 'automatizar':
      return {
        id: key,
        eyebrow: 'AUTOMATIZACIONES',
        title: '¿Dónde se pierde más tiempo hoy?',
        chips: [
          { label: 'Planillas Excel y doble digitación', kind: 'step', value: 'auto_excel' },
          { label: 'Facturación SII o conectar sistemas', kind: 'step', value: 'auto_sii' },
          { label: 'Reportes, alertas o correos manuales', kind: 'step', value: 'auto_reportes' },
        ],
      };
    case 'auto_excel':
    case 'auto_sii':
    case 'auto_reportes': {
      const detail =
        key === 'auto_excel'
          ? 'Reemplazamos planillas sueltas por un flujo único que valida y registra datos sin volver a digitar.'
          : key === 'auto_sii'
            ? 'Conectamos tus ventas o sistema interno directo con SII, APIs y bodega de forma automática.'
            : 'Programamos lectura de datos, generación de reportes y alertas en tiempo real.';
      return {
        id: key,
        eyebrow: 'SOLUCIÓN A MEDIDA',
        title: label,
        detail,
        chips: [
          { label: 'Ver consola de Automatizaciones', kind: 'portal', value: 'auto' },
          {
            label: 'Dejar mi caso en el formulario',
            kind: 'contact',
            value: 'Automatizar',
            draft: `Hola, busco automatizar: ${label.toLowerCase()}.`,
          },
          { label: 'Conversar por WhatsApp', kind: 'wa', value: `Hola, quiero automatizar: ${label.toLowerCase()}.` },
        ],
      };
    }
    case 'medida':
      return {
        id: key,
        eyebrow: 'INGENIERÍA A MEDIDA',
        title: '¿Qué buscas construir?',
        chips: [
          { label: 'Plataforma o sistema interno', kind: 'step', value: 'medida_sistema' },
          { label: 'Sitio web interactivo 3D (como este)', kind: 'step', value: 'medida_web' },
          { label: 'Interfaz para tótems o pantallas TV', kind: 'step', value: 'medida_totem' },
        ],
      };
    case 'medida_sistema':
    case 'medida_web':
    case 'medida_totem': {
      const detail =
        key === 'medida_web'
          ? 'Diseñamos sitios inmersivos 3D rápidos, limpios y pensados para diferenciar tu empresa.'
          : key === 'medida_totem'
            ? 'Construimos interfaces táctiles para tótems, salas de espera y operación continua con o sin internet.'
            : 'Desarrollamos software completo a la medida de tu operación, con entregas funcionales por etapas.';
      return {
        id: key,
        eyebrow: 'DESARROLLO',
        title: label,
        detail,
        chips: [
          {
            label: 'Cotizar en formulario',
            kind: 'contact',
            value: key === 'medida_web' ? 'Web 3D' : 'A medida',
            draft: `Hola, me gustaría cotizar: ${label.toLowerCase()}.`,
          },
          { label: 'Hablar directo por WhatsApp', kind: 'wa', value: `Hola, quiero conversar sobre ${label.toLowerCase()}.` },
        ],
      };
    }
    case 'precios':
    default:
      return {
        id: 'precios',
        eyebrow: 'ALCANCE Y TIEMPOS',
        title: 'Evaluación inicial sin costo',
        detail:
          'PaginaGo parte en $6.990/mes y ya está a la venta en paginago.com. Para nuestros sistemas hospitalarios o desarrollos a medida cotizamos por alcance cerrado.',
        chips: [
          { label: 'Ver planes en paginago.com', kind: 'link', value: 'https://paginago.com' },
          {
            label: 'Solicitar propuesta a medida',
            kind: 'contact',
            value: 'A medida',
            draft: 'Hola, quiero evaluar alcance, costos y plazos para un proyecto.',
          },
          { label: 'Consultar por WhatsApp', kind: 'wa', value: 'Hola, quiero consultar valores y plazos con tuEndpoint.' },
        ],
      };
  }
}

function answerFreeText(q: string): GuideState {
  const s = q.toLowerCase();
  const shortQ = q.length > 34 ? `${q.slice(0, 34)}…` : q;

  if (/licita|mercado\s*p[uú]blico|chilecompra|h[aá]bil|cotizador|adjudica|bases/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `MERCADO PÚBLICO · CHILECOMPRA`,
      title: 'Cotizador Oficial para Licitaciones',
      detail:
        'Soluciones tuEndpoint SpA (RUT 78.411.033-8) es Proveedor del Estado HÁBIL en Mercado Público. Puedes estructurar tu propuesta técnica, calcular IVA (19%) y descargar el PDF formal.',
      chips: [
        { label: 'Abrir Cotizador Oficial (PDF) ↗', kind: 'link', value: '/es/cotizador' },
        {
          label: 'Cotizar con un ejecutivo',
          kind: 'contact',
          value: 'Producto',
          draft: 'Hola, tengo una licitación en curso y requiero cotizar formalmente con tuEndpoint.',
        },
        { label: 'Consultar por WhatsApp', kind: 'wa', value: 'Hola, quiero cotizar para una licitación de Mercado Público.' },
      ],
    };
  }
  if (/paginago|cat[aá]logo|tienda|whatsapp/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `PAGINAGO · A LA VENTA HOY`,
      title: 'PaginaGo.com',
      detail: 'Tu catálogo online listo en minutos para vender directo por WhatsApp. Producto disponible a la venta hoy.',
      chips: [
        { label: 'Abrir paginago.com ahora', kind: 'link', value: 'https://paginago.com' },
        { label: 'Ver demostración en la página', kind: 'portal', value: 'paginago' },
        { label: 'Consultar contratación por WhatsApp', kind: 'wa', value: 'Hola, quiero contratar PaginaGo.' },
      ],
    };
  }
  if (/fila|turno|totem|tótem|llamad|pantalla|tv/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `CONSULTA · ${shortQ}`,
      title: 'Gestor de Filas',
      detail: 'Incluye tótem táctil, pantalla TV de llamados con timbre y voz, atención por módulo y métricas en vivo.',
      chips: [
        { label: 'Ir a Gestor de Filas', kind: 'portal', value: 'filas' },
        { label: 'Solicitar demo', kind: 'contact', value: 'Producto', draft: 'Hola, quiero ver una demo del Gestor de Filas.' },
      ],
    };
  }
  if (/caja|pos|sii|boleta|factura|dte|internet|offline|stock/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `CONSULTA · ${shortQ}`,
      title: 'CajaYA · POS + SII',
      detail: 'Opera con o sin internet, controla turnos y stock, y emite boletas y facturas electrónicas ante el SII.',
      chips: [
        { label: 'Ir a CajaYA', kind: 'portal', value: 'cajaya' },
        { label: 'Consultar implementación', kind: 'contact', value: 'Producto', draft: 'Hola, me interesa CajaYA para mi negocio.' },
      ],
    };
  }
  if (/ticpanel|hospital|equipo|soporte|ticket|acta/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `CONSULTA · ${shortQ}`,
      title: 'TICPanel',
      detail: 'Gestiona casi 2.000 equipos en hospital: telemetría en vivo por agente, mesa de ayuda y actas firmadas.',
      chips: [
        { label: 'Ir a TICPanel', kind: 'portal', value: 'ticpanel' },
        { label: 'Pedir demo', kind: 'contact', value: 'Producto', draft: 'Hola, quiero conocer TICPanel.' },
      ],
    };
  }
  if (/tba|colegio|bodega|compra|activo|inventario/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `CONSULTA · ${shortQ}`,
      title: 'Logística TBA',
      detail: 'Administra solicitudes internas, bodega, órdenes de compra, activos fijos y auditoría institucional.',
      chips: [
        { label: 'Ir a Logística TBA', kind: 'portal', value: 'tba' },
        { label: 'Evaluar para mi organización', kind: 'contact', value: 'Producto', draft: 'Hola, me interesa un sistema como Logística TBA.' },
      ],
    };
  }
  if (/web|3d|p[aá]gina|sitio|dise[ñn]o/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `CONSULTA · ${shortQ}`,
      title: 'Webs interactivas 3D',
      detail: 'Diseñamos sitios limpios, rápidos y distintos a cualquier plantilla para posicionar tu empresa.',
      chips: [
        { label: 'Cotizar mi sitio web', kind: 'contact', value: 'Web 3D', draft: 'Hola, quiero cotizar una página web moderna para mi empresa.' },
        { label: 'Hablar por WhatsApp', kind: 'wa', value: 'Hola, quiero cotizar una página web interactiva con tuEndpoint.' },
      ],
    };
  }
  if (/precio|valor|cu[aá]nto|costo|cotiz|plazo|tiempo|demora/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: `CONSULTA · ${shortQ}`,
      title: 'Diagnóstico sin costo',
      detail: 'Sobre nuestros productos base implementamos en pocos días; un desarrollo nuevo se entrega por etapas cerradas.',
      chips: [
        { label: 'Dejar datos para cotizar', kind: 'contact', value: 'A medida', draft: `Hola, mi consulta: ${q}` },
        { label: 'WhatsApp directo', kind: 'wa', value: `Hola, tengo esta consulta: ${q}` },
      ],
    };
  }
  if (/ubic|d[oó]nde|vi[ñn]a|chile|correo|tel[eé]fono|contacto|humano/.test(s)) {
    return {
      id: `q-${Date.now()}`,
      eyebrow: 'CONTACTO DIRECTO',
      title: brand.address,
      detail: `Trabajamos con empresas en todo Chile. Escríbenos a ${brand.email} o conversemos directo.`,
      chips: [
        { label: 'Ir al formulario', kind: 'contact', value: 'A medida', draft: '' },
        { label: 'Abrir WhatsApp', kind: 'wa', value: 'Hola, quiero conversar con el equipo de tuEndpoint.' },
      ],
    };
  }
  return {
    id: `q-${Date.now()}`,
    eyebrow: `CONSULTA · ${shortQ}`,
    title: 'Lo revisamos contigo',
    detail: 'Podemos automatizar ese flujo o construirlo a medida. Elige cómo prefieres continuar:',
    chips: [
      { label: 'Enviar detalle en formulario', kind: 'contact', value: 'A medida', draft: q },
      { label: 'Conversar por WhatsApp', kind: 'wa', value: `Hola tuEndpoint, quería consultar: ${q}` },
    ],
  };
}

export function AssistantBot({ productIndexById, contactIndex, onNavigate, onPrefillContact }: AssistantBotProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuideState[]>([]);
  const [current, setCurrent] = useState<GuideState>(ROOT_STATE);

  const goBack = () => {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setCurrent(last);
      return next;
    });
  };

  const resetRoot = () => {
    setHistory([]);
    setCurrent(ROOT_STATE);
  };

  const handleChip = (c: ActionChip) => {
    if (c.kind === 'step') {
      if (c.value === 'inicio') {
        resetRoot();
        return;
      }
      const next = resolveStep(c.value, c.label);
      setHistory((h) => [...h, current]);
      setCurrent(next);
      return;
    }
    if (c.kind === 'portal') {
      const idx = productIndexById[c.value];
      if (typeof idx === 'number') onNavigate(idx);
      setOpen(false);
      return;
    }
    if (c.kind === 'contact') {
      onPrefillContact(c.value, c.draft ?? '');
      onNavigate(contactIndex);
      setOpen(false);
      return;
    }
    if (c.kind === 'wa') {
      const url = `https://wa.me/${brand.phone.replace(/\D/g, '')}?text=${encodeURIComponent(c.value)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (c.kind === 'link') {
      window.open(c.value, '_blank', 'noopener,noreferrer');
      return;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    const next = answerFreeText(q);
    setHistory((h) => [...h, current]);
    setCurrent(next);
  };

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            key="concierge-sheet"
            role="dialog"
            aria-label="Índice interactivo tuEndpoint"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-[min(92vw,356px)] border border-slate-200/90 border-t-[#0284c7] bg-white/95 px-5 py-4 text-[#0f172a] shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
          >
            {/* Cabecera editorial mínima */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              {history.length > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-[#0284c7]"
                >
                  <span aria-hidden>←</span>
                  <span>Volver</span>
                </button>
              ) : (
                <span className="text-xs font-semibold tracking-tight text-[#0f172a]">
                  tuEndpoint<span className="text-[#0284c7]">.</span>
                </span>
              )}

              <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={resetRoot}
                    className="text-[11px] uppercase tracking-[0.16em] text-slate-400 transition-colors hover:text-slate-800"
                  >
                    Inicio
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="text-slate-400 transition-colors hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Vista activa en el mismo plano (sin burbujas de chat IA) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="pt-4"
              >
                {current.eyebrow && (
                  <div className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-[#0284c7]">
                    {current.eyebrow}
                  </div>
                )}
                <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-[#0f172a]">
                  {current.title}
                </h3>
                {current.detail && (
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                    {current.detail}
                  </p>
                )}

                {/* Filas editoriales numeradas con línea inferior */}
                <div className="mt-3.5 divide-y divide-slate-100 border-t border-slate-100">
                  {current.chips.map((c, idx) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => handleChip(c)}
                      className="group relative flex w-full items-center justify-between gap-3 py-2.5 text-left transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-[#0284c7] after:transition-transform after:duration-200 hover:after:scale-x-100"
                    >
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span className="font-mono text-[11px] text-slate-400 transition-colors group-hover:text-[#0284c7]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate text-[13px] text-slate-700 transition-colors group-hover:text-[#0f172a]">
                          {c.label}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="shrink-0 text-xs text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0284c7]"
                      >
                        {c.kind === 'wa' || c.kind === 'link' ? '↗' : '→'}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Línea de consulta directa minimalista */}
            <form
              onSubmit={onSubmit}
              className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-1.5 transition-colors focus-within:border-[#0284c7]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="O escribe tu consulta aquí..."
                aria-label="Escribe tu consulta"
                className="min-w-0 flex-1 bg-transparent text-xs text-[#0f172a] placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Consultar"
                className="text-xs font-semibold text-[#0284c7] transition-transform hover:translate-x-0.5"
              >
                →
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar guía' : 'Abrir guía'}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition-all hover:border-[#0284c7] hover:text-[#0284c7]"
      >
        {open ? (
          <X className="h-[17px] w-[17px]" strokeWidth={1.8} />
        ) : (
          <MessageSquare className="h-[16px] w-[16px]" strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}
