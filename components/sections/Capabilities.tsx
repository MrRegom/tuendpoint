'use client';

import { useLocale } from 'next-intl';
import { capabilities } from '@/lib/data/capabilities';
import { Reveal } from '@/components/motion/Reveal';

export function Capabilities() {
  const locale = useLocale() as 'es' | 'en';

  return (
    <section className="bg-paper py-section-y relative z-10">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col md:items-center justify-center text-center gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0EA5E9] mb-2 block">
              ¿Qué hacemos?
            </span>
            <h2 className="text-display-m text-ink text-balance font-bold tracking-tight">
              Programas que se adaptan<br className="hidden md:block" /> a tu negocio.
            </h2>
            <p className="max-w-2xl text-body-m text-ink-soft text-pretty leading-relaxed">
              No vendemos software genérico. Desarrollamos soluciones a medida: desde un sistema de inventario simple, hasta una plataforma completa para hospitales o universidades. Si hoy lo haces manual, lo podemos automatizar.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <a
              key={cap.id}
            href={cap.link}
              className="group flex h-full flex-col bg-bone border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Imagen */}
              <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                <img
                  src={cap.image}
                  alt={cap.title[locale]}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Overlay oscuro sutil al hover */}
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-base font-bold tracking-tight mb-2 text-ink group-hover:text-ink">
                  {cap.title[locale]}
                </h3>
                <p className="text-sm leading-relaxed text-ink-soft text-pretty mb-6 flex-1">
                  {cap.description[locale]}
                </p>
                <div className="mt-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0EA5E9] border-b border-[#0EA5E9]/40 pb-0.5 transition-colors group-hover:border-[#0EA5E9]">
                    Ver soluciones
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
