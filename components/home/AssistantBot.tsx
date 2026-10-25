'use client';

import React, { useEffect, useRef, useState } from 'react';
import { brand } from '@/lib/config/brand';

type ActionChip = {
  label: string;
  kind: 'step' | 'portal' | 'contact' | 'wa';
  value: string;
  draft?: string;
};

type Msg = {
  id: number;
  from: 'bot' | 'user';
  text: string;
  chips?: ActionChip[];
};

interface AssistantBotProps {
  productIndexById: Record<string, number>;
  contactIndex: number;
  onNavigate: (sectionIndex: number) => void;
  onPrefillContact: (topic: string, draft: string) => void;
}

const ROOT_CHIPS: ActionChip[] = [
  { label: '1. Ver productos listos', kind: 'step', value: 'productos' },
  { label: '2. Automatizar un proceso', kind: 'step', value: 'automatizar' },
  { label: '3. Software o web 3D a medida', kind: 'step', value: 'medida' },
  { label: '4. Precios y tiempos', kind: 'step', value: 'precios' },
];

function replyToStep(key: string, label: string): { userText: string; botText: string; chips: ActionChip[] } {
  switch (key) {
    case 'productos':
      return {
        userText: label,
        botText: 'Paso 2 de 2 · ¿En qué área operas?',
        chips: [
          { label: 'Salud o atención de público', kind: 'step', value: 'area_salud' },
          { label: 'Colegio, bodega o inventario', kind: 'step', value: 'area_bodega' },
          { label: 'Comercio, POS o catálogo', kind: 'step', value: 'area_comercio' },
        ],
      };
    case 'area_salud':
      return {
        userText: 'Salud o atención de público',
        botText:
          'Tenemos dos sistemas en producción hospitalaria: Gestor de Filas (tótem, TV de llamados con voz y métricas) y TICPanel (inventario TI con agente, soporte y actas).',
        chips: [
          { label: 'Ver Gestor de Filas', kind: 'portal', value: 'filas' },
          { label: 'Ver TICPanel', kind: 'portal', value: 'ticpanel' },
          {
            label: 'Pedir demo',
            kind: 'contact',
            value: 'Producto',
            draft: 'Hola, me interesa ver una demo de sus sistemas para atención de público / soporte TI.',
          },
        ],
      };
    case 'area_bodega':
      return {
        userText: 'Colegio, bodega o inventario',
        botText:
          'Operamos Logística TBA: solicitudes internas, órdenes de compra, bodega, activos fijos, bajas y auditoría completa.',
        chips: [
          { label: 'Ver Logística TBA', kind: 'portal', value: 'tba' },
          {
            label: 'Adaptarlo a mi institución',
            kind: 'contact',
            value: 'Producto',
            draft: 'Hola, quiero evaluar un sistema de bodega, compras e inventario tipo Logística TBA.',
          },
        ],
      };
    case 'area_comercio':
      return {
        userText: 'Comercio, POS o catálogo',
        botText:
          'Para punto de venta tenemos CajaYA (funciona con o sin internet, stock, turnos y DTE SII). Para vender rápido por link está PaginaGo con pedidos directo a WhatsApp.',
        chips: [
          { label: 'Ver CajaYA', kind: 'portal', value: 'cajaya' },
          { label: 'Ver PaginaGo', kind: 'portal', value: 'paginago' },
          {
            label: 'Consultar por mi negocio',
            kind: 'contact',
            value: 'Producto',
            draft: 'Hola, me interesa implementar CajaYA / PaginaGo en mi negocio.',
          },
        ],
      };
    case 'automatizar':
      return {
        userText: label,
        botText: 'Paso 2 de 2 · ¿Qué te quita más tiempo hoy?',
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
          ? 'Reemplazamos planillas sueltas por un flujo único que valida y registra sin volver a digitar.'
          : key === 'auto_sii'
            ? 'Conectamos tus ventas o sistema interno directo con SII, APIs y ERP de forma automática.'
            : 'Programamos la lectura de datos, envío de reportes y alertas en tiempo real cuando algo requiere atención.';
      return {
        userText: label,
        botText: `${detail} ¿Revisamos tu caso sin costo?`,
        chips: [
          { label: 'Ver flujo en 3D', kind: 'portal', value: 'auto' },
          {
            label: 'Dejar mi caso en el formulario',
            kind: 'contact',
            value: 'Automatizar',
            draft: `Hola, busco automatizar: ${label.toLowerCase()}.`,
          },
          { label: 'Hablar por WhatsApp', kind: 'wa', value: `Hola, quiero automatizar: ${label.toLowerCase()}.` },
        ],
      };
    }
    case 'medida':
      return {
        userText: label,
        botText: 'Paso 2 de 2 · ¿Qué necesitas construir?',
        chips: [
          { label: 'Sistema web a medida', kind: 'step', value: 'medida_sistema' },
          { label: 'Web interactiva 3D (como esta)', kind: 'step', value: 'medida_web' },
          { label: 'App para tótems o terreno', kind: 'step', value: 'medida_totem' },
        ],
      };
    case 'medida_sistema':
    case 'medida_web':
    case 'medida_totem': {
      const msg =
        key === 'medida_web'
          ? 'Diseñamos sitios inmersivos 3D rápidos, limpios y orientados a conversión (como este sitio o PaginaGo).'
          : key === 'medida_totem'
            ? 'Construimos interfaces táctiles para tótems, pantallas TV y apps que siguen operando aunque caiga internet.'
            : 'Desarrollamos plataformas completas a la medida de tu operación, con entregas visibles desde las primeras semanas.';
      return {
        userText: label,
        botText: msg,
        chips: [
          {
            label: 'Cotizar en formulario',
            kind: 'contact',
            value: key === 'medida_web' ? 'Web 3D' : 'Software a medida',
            draft: `Hola, me gustaría cotizar: ${label.toLowerCase()}.`,
          },
          { label: 'Escribir por WhatsApp', kind: 'wa', value: `Hola, quiero conversar sobre ${label.toLowerCase()}.` },
        ],
      };
    }
    case 'precios':
    default:
      return {
        userText: label,
        botText:
          'PaginaGo parte en $6.990/mes. Para nuestros sistemas (Filas, TICPanel, TBA, CajaYA) o desarrollos a medida, la evaluación inicial es gratis y cotizamos por alcance claro, sin letra chica.',
        chips: [
          {
            label: 'Pedir cotización gratis',
            kind: 'contact',
            value: 'Software a medida',
            draft: 'Hola, quiero evaluar costos y plazos para un proyecto.',
          },
          { label: 'WhatsApp directo', kind: 'wa', value: 'Hola, quiero consultar valores y plazos con tuEndpoint.' },
          { label: '← Volver al inicio', kind: 'step', value: 'inicio' },
        ],
      };
  }
}

function answerFreeText(q: string): { text: string; chips: ActionChip[] } {
  const s = q.toLowerCase();
  if (/fila|turno|totem|tótem|llamad|pantalla|tv/.test(s)) {
    return {
      text: 'Nuestro Gestor de Filas incluye tótem táctil (con o sin RUT), pantalla TV de llamados con timbre y voz, atención por módulo y trazabilidad completa.',
      chips: [
        { label: 'Ver Gestor de Filas animado', kind: 'portal', value: 'filas' },
        { label: 'Solicitar demo', kind: 'contact', value: 'Producto', draft: 'Hola, quiero ver una demo del Gestor de Filas.' },
      ],
    };
  }
  if (/caja|pos|sii|boleta|factura|dte|internet|offline|stock/.test(s)) {
    return {
      text: 'CajaYA es nuestro punto de venta inteligente: opera con o sin internet, controla turnos y stock, y se integra con productos y emisión DTE ante el SII.',
      chips: [
        { label: 'Ver pantallas de CajaYA', kind: 'portal', value: 'cajaya' },
        { label: 'Consultar por CajaYA', kind: 'contact', value: 'Producto', draft: 'Hola, me interesa CajaYA para mi negocio.' },
      ],
    };
  }
  if (/ticpanel|hospital|equipo|soporte|ticket|acta/.test(s)) {
    return {
      text: 'TICPanel gestiona casi 2.000 equipos en hospital: telemetría en vivo por agente, mesa de ayuda con SLA y actas de entrega firmadas.',
      chips: [
        { label: 'Ver TICPanel', kind: 'portal', value: 'ticpanel' },
        { label: 'Pedir demo', kind: 'contact', value: 'Producto', draft: 'Hola, quiero conocer TICPanel.' },
      ],
    };
  }
  if (/tba|colegio|bodega|compra|activo|inventario/.test(s)) {
    return {
      text: 'Logística TBA administra solicitudes internas, bodega, órdenes de compra, activos fijos y auditoría institucional en un solo lugar.',
      chips: [
        { label: 'Ver Logística TBA', kind: 'portal', value: 'tba' },
        { label: 'Consultar implementación', kind: 'contact', value: 'Producto', draft: 'Hola, me interesa un sistema como Logística TBA.' },
      ],
    };
  }
  if (/paginago|cat[aá]logo|tienda|whatsapp/.test(s)) {
    return {
      text: 'Con PaginaGo creas tu catálogo online en minutos, compartes un único link o QR y recibes los pedidos listos en tu WhatsApp.',
      chips: [
        { label: 'Ver PaginaGo', kind: 'portal', value: 'paginago' },
        { label: 'Ir al formulario', kind: 'contact', value: 'Producto', draft: 'Hola, quiero consultar por PaginaGo.' },
      ],
    };
  }
  if (/web|3d|p[aá]gina|sitio|dise[ñn]o/.test(s)) {
    return {
      text: 'Sí, creamos sitios web interactivos y experiencias 3D limpias como esta, pensadas para destacar tu marca y convertir visitas en clientes.',
      chips: [
        { label: 'Cotizar mi sitio web', kind: 'contact', value: 'Web 3D', draft: 'Hola, quiero cotizar una página web moderna / 3D para mi empresa.' },
        { label: 'Hablar por WhatsApp', kind: 'wa', value: 'Hola, quiero cotizar una página web interactiva con tuEndpoint.' },
      ],
    };
  }
  if (/precio|valor|cu[aá]nto|costo|cotiz|plazo|tiempo|demora/.test(s)) {
    return {
      text: 'Evaluamos tu idea gratis. Si partimos de uno de nuestros productos base toma pocos días; un sistema nuevo a medida se entrega por etapas funcionales desde las primeras semanas.',
      chips: [
        { label: 'Dejar datos para cotizar', kind: 'contact', value: 'Software a medida', draft: `Hola, mi consulta: ${q}` },
        { label: 'WhatsApp directo', kind: 'wa', value: `Hola, tengo esta consulta: ${q}` },
      ],
    };
  }
  if (/ubic|d[oó]nde|vi[ñn]a|chile|correo|tel[eé]fono|contacto|humano/.test(s)) {
    return {
      text: `Estamos en ${brand.address} y trabajamos con empresas e instituciones en todo Chile. Puedes escribirnos en el formulario o directo al ${brand.phone}.`,
      chips: [
        { label: 'Ir al formulario', kind: 'contact', value: 'Software a medida', draft: '' },
        { label: 'Abrir WhatsApp', kind: 'wa', value: 'Hola, quiero conversar con el equipo de tuEndpoint.' },
      ],
    };
  }
  return {
    text: 'Podemos ayudarte automatizando ese flujo o construyéndolo a medida. ¿Prefieres dejarnos el detalle en el formulario o hablar directo por WhatsApp?',
    chips: [
      { label: 'Usar formulario con mi consulta', kind: 'contact', value: 'Software a medida', draft: q },
      { label: 'Enviar por WhatsApp', kind: 'wa', value: `Hola tuEndpoint, quería consultar: ${q}` },
      { label: 'Ver opciones guiadas', kind: 'step', value: 'inicio' },
    ],
  };
}

export function AssistantBot({ productIndexById, contactIndex, onNavigate, onPrefillContact }: AssistantBotProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      from: 'bot',
      text: 'Hola 👋 Te guío en 2 pasos cortos o escribe tu pregunta abajo.',
      chips: ROOT_CHIPS,
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const resetFlow = () => {
    setMsgs([
      {
        id: nextId.current++,
        from: 'bot',
        text: 'Hola 👋 Te guío en 2 pasos cortos o escribe tu pregunta abajo.',
        chips: ROOT_CHIPS,
      },
    ]);
  };

  const handleChip = (c: ActionChip) => {
    if (c.kind === 'step') {
      if (c.value === 'inicio') {
        resetFlow();
        return;
      }
      const r = replyToStep(c.value, c.label);
      setMsgs((m) => [
        ...m,
        { id: nextId.current++, from: 'user', text: r.userText },
        { id: nextId.current++, from: 'bot', text: r.botText, chips: r.chips },
      ]);
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
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    const r = answerFreeText(q);
    setMsgs((m) => [
      ...m,
      { id: nextId.current++, from: 'user', text: q },
      { id: nextId.current++, from: 'bot', text: r.text, chips: r.chips },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end">
      {open && (
        <div
          role="dialog"
          aria-label="Asistente tuEndpoint"
          className="mb-3 flex max-h-[72vh] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#090d18]/95 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
              <span className="text-sm font-medium tracking-tight">Guía tuEndpoint</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <button type="button" onClick={resetFlow} className="transition-colors hover:text-white">
                Reiniciar
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar asistente"
                className="text-sm leading-none transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3.5 text-sm">
            {msgs.map((m) => (
              <div key={m.id} className={m.from === 'user' ? 'flex justify-end' : 'space-y-2'}>
                <div
                  className={
                    m.from === 'user'
                      ? 'max-w-[82%] rounded-2xl rounded-br-sm bg-[#38bdf8] px-3.5 py-2 text-xs font-medium text-[#05060b]'
                      : 'max-w-[92%] rounded-2xl rounded-bl-sm bg-white/[0.06] px-3.5 py-2.5 text-[13px] leading-relaxed text-white/90'
                  }
                >
                  {m.text}
                </div>
                {m.chips && m.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {m.chips.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => handleChip(c)}
                        className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-left text-xs text-white/85 transition-colors hover:border-[#38bdf8]/60 hover:bg-[#38bdf8]/15 hover:text-white"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe una pregunta..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-white/35 focus:border-[#38bdf8] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Enviar pregunta"
              className="rounded-xl bg-[#38bdf8] px-3 py-2 text-xs font-semibold text-[#05060b] transition-transform hover:scale-[1.03]"
            >
              →
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0b1020]/90 px-4 py-2.5 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all hover:border-[#38bdf8]/60 hover:bg-[#111933]"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38bdf8] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38bdf8]" />
        </span>
        <span>{open ? 'Cerrar guía' : '¿Dudas? Guía rápida'}</span>
      </button>
    </div>
  );
}
