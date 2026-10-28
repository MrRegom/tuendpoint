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
            ? 'border-b border-white/10 bg-[#07090e]/90 backdrop-blur-xl shadow-lg shadow-black/40'
            : 'border-b border-white/5 bg-[#07090e]'
        )}
      >
        <nav
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
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
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
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
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-xs font-mono font-medium transition-all"
            >
              <span>Hablar con Ingeniería</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Toggle Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white md:hidden"
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
              className="overflow-hidden border-b border-white/10 bg-[#0c1017] px-5 py-6 md:hidden"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  item.href.includes('#') ? (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium text-zinc-300 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium text-zinc-300 hover:text-white"
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black"
                  >
                    <span>Hablar con Ingeniería</span>
                    <ArrowRight className="h-4 w-4" />
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
