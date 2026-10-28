import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/layout/Logo';
import { brand } from '@/lib/config/brand';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-[#86868b] border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <Logo variant="light" />
            <p className="mt-3 text-xs text-[#86868b] max-w-md">
              Soluciones tuEndpoint SpA · RUT 78.411.033-8 · Ingeniería de software para operaciones críticas, salud y el Estado de Chile.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-mono text-[#86868b]">
            <a
              href={`mailto:${brand.email}`}
              className="hover:text-white transition-colors"
            >
              {brand.email}
            </a>
            <a
              href="https://wa.me/5694925337"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {brand.phone}
            </a>
            <span>{brand.address}</span>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#86868b]">
          <p>
            © {year} Soluciones tuEndpoint SpA. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              href="/legal/privacidad"
              className="hover:text-white transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/legal/terminos"
              className="hover:text-white transition-colors"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
