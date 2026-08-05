import { useTranslations } from 'next-intl';
import { LinkButton } from '@/components/ui/Button';

export function CTASection() {
  const t = useTranslations('home.cta');

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2400&q=85)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-ink/85" aria-hidden="true" />

      <div className="mx-auto w-full max-w-container-wide px-5 py-section-y md:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-paper/40" aria-hidden="true" />
            <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-paper/60">
              {t('eyebrow')}
            </span>
            <span className="h-px w-8 bg-paper/40" aria-hidden="true" />
          </div>
          <h2 className="mt-8 text-display-xl text-paper text-balance">
            {t('title')}
          </h2>
          <p className="mt-6 text-body-m text-paper/70 text-pretty">
            {t('subtitle')}
          </p>
          <div className="mt-10">
            <LinkButton
              href="/contacto"
              variant="inverted"
              size="md"
              withArrow
            >
              {t('button')}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
