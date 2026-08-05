import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { processSteps } from '@/lib/data/process';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'proceso' });
  return {
    title: `${t('title')} | Regom`,
    description: t('subtitle'),
  };
}

export default async function ProcesoPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('proceso');

  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto w-full max-w-container-wide px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-20 lg:px-20">
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>{t('eyebrow')}</Eyebrow>
              <Heading as="h1" size="display-l" className="mt-4">
                {t('title')}
              </Heading>
              <Text size="body-l" muted className="mt-6">
                {t('subtitle')}
              </Text>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto w-full max-w-container-wide px-6 py-section-y-sm md:px-12 md:py-section-y lg:px-20">
          <div className="space-y-16">
            {processSteps.map((step, idx) => (
              <Reveal key={step.number} delay={idx * 0.05}>
                <div className="grid grid-cols-1 gap-8 border-t border-border pt-12 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-1">
                    <span className="font-mono text-stat text-muted">{step.number}</span>
                  </div>
                  <div className="lg:col-span-5">
                    <Heading as="h2" size="h2">
                      {step.title[locale as 'es' | 'en']}
                    </Heading>
                    <Text size="body-l" muted className="mt-4">
                      {step.description[locale as 'es' | 'en']}
                    </Text>
                  </div>
                  <div className="lg:col-span-6">
                    <h3 className="eyebrow text-muted">{t('details')}</h3>
                    <ul className="mt-6 space-y-4">
                      {step.details[locale as 'es' | 'en'].map((detail, didx) => (
                        <li key={didx} className="flex items-start gap-3 body-m text-ink">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" aria-hidden="true" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
