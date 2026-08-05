'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { solutions } from '@/lib/data/solutions';
import { sectors } from '@/lib/data/sectors';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils/cn';

export function CatalogGrid() {
  const t = useTranslations('soluciones');
  const locale = useLocale() as 'es' | 'en';
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return solutions;
    return solutions.filter((s) => s.sector === filter);
  }, [filter]);

  return (
    <section className="bg-paper">
      <div className="mx-auto w-full max-w-container-wide px-6 py-section-y-sm md:px-12 md:py-section-y lg:px-20">
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading as="h1" size="h1" className="mt-4">
              {t('title')}
            </Heading>
            <Text size="body-l" muted className="mt-6">
              {t('subtitle')}
            </Text>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-2 border-b border-border pb-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-md px-4 py-2 body-s font-medium transition-colors',
                filter === 'all' ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
              )}
            >
              {t('filter.all')}
            </button>
            {sectors.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilter(s.id)}
                className={cn(
                  'rounded-md px-4 py-2 body-s font-medium transition-colors',
                  filter === s.id ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                )}
              >
                {s.name[locale]}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((solution) => {
              const sector = sectors.find((s) => s.id === solution.sector);
              return (
                <div
                  key={solution.id}
                  id={solution.id}
                  className="group flex flex-col overflow-hidden bg-bone transition-colors hover:bg-paper hover:shadow-sm"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-bone">
                    <img
                      src={solution.image}
                      alt={solution.name[locale]}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 ease-soft group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-3 py-1 text-body-s font-medium',
                          solution.origin === 'proven'
                            ? 'bg-accent text-paper'
                            : 'bg-bone text-ink-soft'
                        )}
                      >
                        {t(`badge.${solution.origin}` as any)}
                      </span>
                      <span className="body-s text-muted">{sector?.name[locale]}</span>
                    </div>
                    <h3 className="mt-4 h4 text-ink">{solution.name[locale]}</h3>
                    <p className="mt-3 body-s text-ink-soft">{solution.shortDescription[locale]}</p>

                    <ul className="mt-6 space-y-2">
                      {solution.features[locale].slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 body-s text-ink-soft">
                          <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-muted" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="mt-12 text-center body-m text-muted">{t('empty')}</div>
        )}
      </div>

      <section className="bg-ink">
        <div className="mx-auto w-full max-w-container-wide px-6 py-section-y-sm md:px-12 md:py-section-y lg:px-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display-l text-paper text-balance">{t('cta.title')}</h2>
            <p className="mt-8 body-l text-paper/70 text-pretty">{t('cta.subtitle')}</p>
            <div className="mt-12">
              <LinkButton href="/contacto" variant="inverted" size="lg" withArrow>
                {t('cta.button')}
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
