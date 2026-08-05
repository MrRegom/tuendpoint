'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { solutions } from '@/lib/data/solutions';
import { sectors } from '@/lib/data/sectors';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils/cn';

export function CatalogPreview() {
  const t = useTranslations('home.catalog');
  const locale = useLocale() as 'es' | 'en';
  const reduceMotion = useReducedMotion();

  const hero = solutions[0];
  const rest = solutions.slice(1, 5);
  const heroSector = sectors.find((s) => s.id === hero.sector);

  return (
    <section className="bg-paper py-section-y border-b border-border">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#0EA5E9]" aria-hidden="true" />
                <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-[#0EA5E9]">
                  {t('eyebrow')}
                </span>
              </div>
              <h2 className="mt-6 text-display-xl text-ink text-balance font-bold tracking-tight">
                {t('title')}
              </h2>
              <p className="mt-6 max-w-xl text-body-m text-ink-soft text-pretty leading-relaxed">
                {t('subtitle')}
              </p>
            </div>
            <LinkButton
              href="/soluciones"
              variant="outline"
              withArrow
              size="md"
              className="self-start md:self-auto"
            >
              {t('viewAll')}
            </LinkButton>
          </div>
        </Reveal>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <Link
            href={{ pathname: '/soluciones', hash: hero.id } as any}
            className="group relative block aspect-[4/3] overflow-hidden bg-bone md:aspect-[21/9]"
          >
            <img
              src={hero.image}
              alt={hero.name[locale]}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-soft group-hover:scale-105 opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" aria-hidden="true" />

            <div className="absolute inset-0 flex flex-col justify-between p-6 text-paper md:p-12">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'inline-flex items-center font-mono text-eyebrow uppercase tracking-[0.12em] px-3 py-1',
                    hero.origin === 'proven'
                      ? 'bg-[#0EA5E9] text-white font-bold'
                      : 'border border-paper/30 text-paper backdrop-blur'
                  )}
                >
                  {t(`badge.${hero.origin}` as any)}
                </span>
                <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-paper/70">
                  {heroSector?.name[locale]}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h3 className="max-w-3xl text-h2 text-paper text-balance font-bold md:text-display-m">
                    {hero.name[locale]}
                  </h3>
                  <p className="mt-4 max-w-xl text-body-m text-paper/80 text-pretty">
                    {hero.shortDescription[locale]}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2 max-w-2xl">
                    {hero.features[locale].map((feature, idx) => (
                      <li key={idx} className="bg-paper/10 backdrop-blur border border-paper/20 px-3 py-1.5 text-xs font-medium text-paper rounded-sm">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="inline-flex items-center gap-1.5 text-body-s font-medium text-[#0EA5E9] whitespace-nowrap bg-white/10 px-4 py-2 rounded-full backdrop-blur border border-white/20 transition-colors group-hover:bg-white/20">
                  <span>{t('viewSolution')}</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-400 ease-soft group-hover:translate-x-1 group-hover:-translate-y-1"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((solution, idx) => {
            const sector = sectors.find((s) => s.id === solution.sector);
            return (
              <motion.div
                key={solution.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link
                  href={{ pathname: '/soluciones', hash: solution.id } as any}
                  className="group flex h-full flex-col bg-bone transition-colors hover:bg-ink hover:text-paper border border-border hover:border-ink"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-bone">
                    <img
                      src={solution.image}
                      alt={solution.name[locale]}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-soft group-hover:scale-105 opacity-90 group-hover:opacity-70"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={cn(
                          'font-mono text-[0.65rem] uppercase tracking-[0.12em] px-2 py-0.5',
                          solution.origin === 'proven' 
                            ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white' 
                            : 'bg-black/5 text-ink-soft group-hover:bg-white/10 group-hover:text-white/70'
                        )}
                      >
                        {t(`badge.${solution.origin}` as any)}
                      </span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-soft group-hover:text-paper/70">
                        {sector?.name[locale]}
                      </span>
                    </div>
                    <h3 className="text-h4 font-bold tracking-tight mb-2 group-hover:text-paper">{solution.name[locale]}</h3>
                    <p className="text-body-xs leading-relaxed text-ink-soft text-pretty group-hover:text-paper/80 mb-6">
                      {solution.shortDescription[locale]}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0EA5E9] group-hover:text-[#38bdf8]">
                        {t('viewSolution')}
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
