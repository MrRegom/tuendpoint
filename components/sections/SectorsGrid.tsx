'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { sectors } from '@/lib/data/sectors';
import { Reveal } from '@/components/motion/Reveal';

export function SectorsGrid() {
  const t = useTranslations('home.sectors');
  const locale = useLocale() as 'es' | 'en';

  return (
    <section id="sectores" className="bg-paper py-section-y relative z-10 scroll-mt-20">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-display-m text-ink text-balance font-bold tracking-tight">
                Soluciones de software para operaciones empresariales.
              </h2>
              <p className="mt-6 text-body-m text-ink-soft text-pretty leading-relaxed">
                Diseñamos e implementamos soluciones tecnológicas orientadas a empresas que requieren estructurar, automatizar e integrar procesos operacionales.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-2 gap-4 px-5 pb-8 md:grid-cols-3 lg:grid-cols-5 md:gap-6 md:px-8 lg:px-12">
          {sectors.map((sector, idx) => (
            <div key={sector.id}>
              <a
                href={`/${locale}/sectores/${sector.id}`}
                className="group block w-full"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-surface">
                  <img
                    src={sector.image}
                    alt={sector.name[locale]}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-body-m font-bold text-ink">{sector.name[locale]}</h3>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

