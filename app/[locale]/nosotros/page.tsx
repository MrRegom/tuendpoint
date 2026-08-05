import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Check } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'nosotros' });
  return {
    title: `${t('title')} | Regom`,
    description: t('subtitle'),
  };
}

export default async function NosotrosPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('nosotros');

  const values = [0, 1, 2, 3].map((i) => ({
    title: t(`values.items.${i}.title`),
    description: t(`values.items.${i}.description`),
  }));

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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Eyebrow>{t('values.eyebrow')}</Eyebrow>
                <Heading as="h2" size="h2" className="mt-4">
                  {t('values.title')}
                </Heading>
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
                {values.map((item, idx) => (
                  <Reveal key={idx} delay={idx * 0.08} className="bg-bone">
                    <div className="flex flex-col p-8 md:p-10">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-paper">
                        <Check className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <h3 className="mt-6 h4 text-ink">{item.title}</h3>
                      <p className="mt-3 body-s text-ink-soft">{item.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
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
