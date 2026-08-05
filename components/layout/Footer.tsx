import { useTranslations } from 'next-intl';
import { Linkedin } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/layout/Logo';
import { brand } from '@/lib/config/brand';
import { sectors } from '@/lib/data/sectors';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-container-wide px-5 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-body-m text-paper/70 text-pretty">
              {t('tagline')}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={brand.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-paper/15 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-eyebrow uppercase tracking-[0.14em] text-paper/50">
              {t('company')}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/nosotros" className="text-body-s text-paper/80 transition-colors hover:text-paper">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/proceso" className="text-body-s text-paper/80 transition-colors hover:text-paper">
                  {t('process')}
                </Link>
              </li>
              <li>
                <Link href="/soluciones" className="text-body-s text-paper/80 transition-colors hover:text-paper">
                  {t('solutions')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-eyebrow uppercase tracking-[0.14em] text-paper/50">
              {t('sectors')}
            </h3>
            <ul className="mt-5 space-y-3">
              {sectors.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={{ pathname: '/sectores/[sector]', params: { sector: s.id } } as any}
                    className="text-body-s text-paper/80 transition-colors hover:text-paper"
                  >
                    {s.name.es}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-eyebrow uppercase tracking-[0.14em] text-paper/50">
              {t('contact')}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="text-body-s text-paper/80 transition-colors hover:text-paper"
                >
                  {brand.email}
                </a>
              </li>
              <li>
                <span className="text-body-s text-paper/80">{brand.phone}</span>
              </li>
              <li>
                <span className="text-body-s text-paper/80">{brand.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-paper/10 pt-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <p className="serif text-display-m italic text-paper text-balance">
              {t('ctaTitle')}
            </p>
          </div>
          <div className="flex items-end md:col-span-4">
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-2 text-body-s font-medium text-paper transition-colors hover:text-paper/70"
            >
              <span className="border-b border-paper pb-0.5 transition-colors group-hover:border-paper/70">
                {t('ctaContact')}
              </span>
              <span className="transition-transform duration-400 ease-soft group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 md:flex-row md:items-center">
          <p className="text-body-xs text-paper/40">
            © {year} {brand.name}. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacidad" className="text-body-xs text-paper/40 transition-colors hover:text-paper">
              {t('privacy')}
            </Link>
            <Link href="/legal/terminos" className="text-body-xs text-paper/40 transition-colors hover:text-paper">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
