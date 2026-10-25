'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/layout/Logo';
import { LinkButton } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { key: 'portal', href: '/#portal-experience' },
    { key: 'solutions', href: '/soluciones' },
    { key: 'sectors', href: '/#sectores' },
    { key: 'process', href: '/proceso' },
    { key: 'about', href: '/nosotros' },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('skipToContent')}
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-400 ease-soft',
          scrolled
            ? 'border-b border-border bg-paper/95 backdrop-blur-md'
            : 'border-b border-transparent bg-paper'
        )}
      >
        <nav
          className="mx-auto flex h-14 w-full max-w-container-wide items-center justify-between px-5 md:px-8 md:h-20 lg:px-12"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="flex items-center"
            aria-label="Regom"
          >
            <Logo variant="dark" />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              item.href.includes('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-body-s font-medium transition-colors text-ink-soft hover:text-ink'
                  )}
                >
                  {t(item.key)}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={cn(
                    'text-body-s font-medium transition-colors text-ink-soft hover:text-ink'
                  )}
                >
                  {t(item.key)}
                </Link>
              )
            ))}
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <LinkButton
              href="/contacto"
              variant="primary"
              size="md"
              withArrow
            >
              {t('contact')}
            </LinkButton>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center lg:hidden text-ink"
            aria-label={isOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden border-t border-border bg-paper lg:hidden"
            >
              <div className="flex flex-col gap-4 px-5 py-6">
                {navItems.map((item) => (
                  item.href.includes('#') ? (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-h3 font-medium text-ink transition-colors hover:text-ink-soft"
                    >
                      {t(item.key)}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      onClick={() => setIsOpen(false)}
                      className="text-h3 font-medium text-ink transition-colors hover:text-ink-soft"
                    >
                      {t(item.key)}
                    </Link>
                  )
                ))}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <LinkButton
                    href="/contacto"
                    variant="primary"
                    size="md"
                    withArrow
                    className="flex-1"
                  >
                    {t('contact')}
                  </LinkButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
