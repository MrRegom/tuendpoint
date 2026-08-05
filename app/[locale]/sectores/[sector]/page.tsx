import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { sectors, getSector } from '@/lib/data/sectors';
import { getSolutionsBySector } from '@/lib/data/solutions';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Link } from '@/i18n/routing';
import { ArrowUpRight } from 'lucide-react';

export function generateStaticParams() {
  return sectors.map((s) => ({ sector: s.id }));
}

export async function generateMetadata({
  params: { locale, sector },
}: {
  params: { locale: string; sector: string };
}) {
  const sectorData = getSector(sector);
  if (!sectorData) return {};
  const t = await getTranslations({ locale, namespace: 'sectores' });
  return {
    title: `${sectorData.name[locale as 'es' | 'en']} — ${t('title')}`,
    description: sectorData.description[locale as 'es' | 'en'],
  };
}

export default async function SectorPage({
  params: { locale, sector },
}: {
  params: { locale: string; sector: string };
}) {
  setRequestLocale(locale);
  const sectorData = getSector(sector);
  if (!sectorData) notFound();

  const t = await getTranslations('sectores');
  const tHome = await getTranslations('home');
  const sectorSolutions = getSolutionsBySector(sectorData.id);

  return (
    <>
      {/* Thin Image Banner */}
      <section className="relative h-[40vh] min-h-[300px] w-full bg-ink overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={sectorData.image}
            alt={sectorData.name[locale as 'es' | 'en']}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-container-wide px-6 pb-12 md:px-12 lg:px-20">
            <Reveal>
              <Link
                href="/soluciones"
                className="inline-flex items-center gap-2 body-s text-paper/70 transition-colors hover:text-paper mb-6"
              >
                ← {t('title')}s
              </Link>
              <Eyebrow className="text-accent">{sectorData.name[locale as 'es' | 'en']}</Eyebrow>
              <h1 className="mt-4 text-display-l text-paper text-balance font-bold tracking-tight">
                {sectorData.name[locale as 'es' | 'en']}
              </h1>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Texts and Highlights Below */}
      <section className="bg-paper">
        <div className="mx-auto w-full max-w-container-wide px-6 py-section-y-sm md:px-12 md:py-section-y lg:px-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-6">
              <Heading as="h2" size="h2" className="mb-6 text-ink">
                {sectorData.longDescription[locale as 'es' | 'en']}
              </Heading>
              <Text size="body-l" muted>
                {sectorData.description[locale as 'es' | 'en']}
              </Text>
            </Reveal>

            <Reveal className="lg:col-span-6" delay={0.1}>
              <div className="bg-surface rounded-3xl p-8 border border-border-soft">
                <Eyebrow>{t('highlights')}</Eyebrow>
                <ul className="mt-8 space-y-6">
                  {sectorData.highlights[locale as 'es' | 'en'].map((highlight, idx) => (
                    <li key={idx} className="flex gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
                      <span className="font-mono text-body-s font-bold text-accent">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="body-m font-medium text-ink leading-relaxed">{highlight}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto w-full max-w-container-wide px-6 py-section-y-sm md:px-12 md:py-section-y lg:px-20">
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>{t('solutions')}</Eyebrow>
              <Heading as="h2" size="h2" className="mt-4">
                {sectorSolutions.length} {sectorData.name[locale as 'es' | 'en']}
              </Heading>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-px bg-border md:grid-cols-2">
            {sectorSolutions.map((solution, idx) => (
              <Reveal key={solution.id} delay={idx * 0.05}>
                <Link
                  href={`/soluciones#${solution.id}` as any}
                  className="group flex h-full flex-col bg-bone p-8 transition-colors hover:bg-paper md:p-10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-body-s font-medium ${
                        solution.origin === 'proven'
                          ? 'bg-accent text-paper'
                          : 'bg-paper text-ink-soft'
                      }`}
                    >
                      {tHome(`catalog.badge.${solution.origin}` as any)}
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 transition-transform duration-250 ease-soft group-hover:translate-x-1 group-hover:-translate-y-1"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="mt-4 h4 text-ink">{solution.name[locale as 'es' | 'en']}</h3>
                  <p className="mt-3 body-s text-ink-soft">{solution.shortDescription[locale as 'es' | 'en']}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
    </>
  );
}
