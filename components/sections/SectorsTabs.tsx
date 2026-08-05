'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { sectors } from '@/lib/data/sectors';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils/cn';

export function SectorsTabs() {
  const t = useTranslations('home.sectors');
  const locale = useLocale() as 'es' | 'en';
  const [active, setActive] = useState(sectors[0].id);
  const activeSector = sectors.find((s) => s.id === active) || sectors[0];

  return (
    <section id="main-content" className="bg-paper">
      <div className="mx-auto w-full max-w-container-wide px-6 py-section-y-sm md:px-12 md:py-section-y lg:px-20">
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading as="h2" size="h1" className="mt-4">
              {t('title')}
            </Heading>
            <Text size="body-l" muted className="mt-6">
              {t('subtitle')}
            </Text>
          </div>
        </Reveal>

        <div className="mt-16 overflow-x-auto no-scrollbar border-b border-border">
          <div className="flex min-w-max gap-8">
            {sectors.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  'relative -mb-px whitespace-nowrap py-4 body-m font-medium transition-colors',
                  active === s.id
                    ? 'text-ink'
                    : 'text-muted hover:text-ink-soft'
                )}
              >
                {s.name[locale]}
                {active === s.id && (
                  <motion.span
                    layoutId="sector-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-px bg-ink"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-bone lg:col-span-7 lg:aspect-[5/4]">
              <img
                src={activeSector.image}
                alt={activeSector.name[locale]}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col justify-center lg:col-span-5">
              <Eyebrow className="text-accent">{activeSector.name[locale]}</Eyebrow>
              <Heading as="h3" size="h3" className="mt-4">
                {activeSector.longDescription[locale]}
              </Heading>

              <ul className="mt-8 space-y-3">
                {activeSector.highlights[locale].map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3 body-m text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <Link
                href={{ pathname: '/sectores/[sector]', params: { sector: activeSector.id } } as any}
                className="mt-8 inline-flex items-center gap-2 body-s font-medium text-accent transition-all hover:gap-3"
              >
                {t('viewSector')}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
