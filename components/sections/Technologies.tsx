'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { technologies } from '@/lib/data/technologies';
import { Reveal } from '@/components/motion/Reveal';

const categoryLabels: Record<string, { label: string; sub: string }> = {
  language: { label: 'Lenguajes', sub: 'Core' },
  framework: { label: 'Frameworks', sub: 'Construimos sobre' },
  database: { label: 'Datos', sub: 'Persistencia' },
  infrastructure: { label: 'Infraestructura', sub: 'Operación' },
  protocol: { label: 'Protocolos', sub: 'Integración' },
};

export function Technologies() {
  const t = useTranslations('home.technologies');
  const reduceMotion = useReducedMotion();

  const grouped = technologies.reduce<Record<string, typeof technologies>>((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  return (
    <section className="bg-paper py-section-y">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-ink" aria-hidden="true" />
            <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-muted">
              {t('eyebrow')}
            </span>
          </div>
          <h2 className="mt-6 max-w-3xl text-display-xl text-ink text-balance">
            {t('title')}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-5">
          {Object.entries(grouped).map(([category, items], catIdx) => (
            <motion.div
              key={category}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: catIdx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-border pt-6"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-h3 text-ink">{categoryLabels[category].label}</h3>
                <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-muted">
                  {categoryLabels[category].sub}
                </span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {items.map((tech) => (
                  <li
                    key={tech.name}
                    className="inline-flex items-center border border-border px-3 py-1.5 text-body-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    {tech.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
