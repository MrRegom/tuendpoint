'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';

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
    { label: 'Productos', href: '/#productos' },
    { label: 'Integraciones', href: '/#integraciones' },
    { label: 'Desarrollo a Medida', href: '/#formulario' },
    { label: 'Nosotros', href: '/nosotros' },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-black focus:text-white"
      >
        {t('skipToContent')}
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/10 bg-black/85 backdrop-blur-xl shadow-lg shadow-black/60'
            : 'border-b border-white/5 bg-black'
        )}
      >
        <nav
          className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8"
          aria-label="Primary"
        >
          <Link href="/" className="flex items-center" aria-label="tuEndpoint">
            <Logo variant="light" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              item.href.includes('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs font-normal text-[#86868b] hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className="text-xs font-normal text-[#86868b] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href="https://wa.me/5694925337?text=Hola%2C%20quisiera%20consultar%20por%20servicios%20de%20desarrollo%20e%20ingenier%C3%ADa."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white text-black hover:bg-zinc-200 px-4 py-1.5 text-xs font-medium transition-colors"
            >
              Contactar
            </a>
          </div>

          {/* Toggle Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#86868b] hover:text-white md:hidden"
            aria-label={isOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Drawer Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b border-white/10 bg-black px-6 py-6 md:hidden"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  item.href.includes('#') ? (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-normal text-[#86868b] hover:text-white"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-normal text-[#86868b] hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )
                ))}

                <div className="pt-4 border-t border-white/10">
                  <a
                    href="https://wa.me/5694925337?text=Hola%2C%20quisiera%20consultar%20por%20servicios%20de%20desarrollo%20e%20ingenier%C3%ADa."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-medium text-black"
                  >
                    Contactar
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
