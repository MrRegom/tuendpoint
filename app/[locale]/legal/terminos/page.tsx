import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Text } from '@/components/ui/Text';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  return { title: t('title') };
}

export default async function TerminosPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('legal.terms');

  return (
    <section className="bg-paper">
      <div className="mx-auto w-full max-w-container-narrow px-6 py-section-y-sm md:px-12 md:py-section-y lg:px-20">
        <Eyebrow>{t('lastUpdated')}</Eyebrow>
        <h1 className="h1 mt-4 text-balance">{t('title')}</h1>

        <div className="mt-12 space-y-8">
          <Text>
            La información de este sitio web es referencial. Los servicios específicos se formalizan mediante acuerdo comercial.
          </Text>
          <Text>
            Regom se reserva el derecho de modificar el contenido de este sitio sin previo aviso.
          </Text>
        </div>
      </div>
    </section>
  );
}
