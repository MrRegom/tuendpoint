'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, localeNames, type Locale } from '@/lib/config/locale';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface LocaleSwitcherProps {
  variant?: 'dark' | 'light';
}

export function LocaleSwitcher({ variant = 'dark' }: LocaleSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const switchTo = (locale: Locale) => {
    setOpen(false);
    router.replace(pathname as any, { locale });
  };

  const textColor = variant === 'dark' ? 'text-ink-soft hover:text-ink' : 'text-paper/80 hover:text-paper';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-body-s font-medium transition-colors',
          textColor
        )}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" strokeWidth={1.5} />
        <span className="uppercase">{currentLocale}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 min-w-[140px] overflow-hidden rounded-md border border-border bg-paper shadow-lg">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => switchTo(locale)}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2.5 text-body-s text-ink-soft transition-colors hover:bg-bone',
                locale === currentLocale && 'bg-bone font-medium text-ink'
              )}
            >
              <span>{localeNames[locale]}</span>
              <span className="text-muted uppercase text-eyebrow tracking-[0.12em]">{locale}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
