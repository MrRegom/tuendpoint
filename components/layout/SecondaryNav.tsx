'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

export function SecondaryNav() {
  const items = [
    { key: 'Plataformas Clínicas (Salud)', href: '/sectores/salud' },
    { key: 'Desarrollo a Medida', href: '/sectores/empresas' },
    { key: 'Automatización de Procesos', href: '/sectores/empresas' },
    { key: 'Integración de Sistemas', href: '/sectores/empresas' },
    { key: 'Casos de Éxito', href: '#casos' },
  ];

  return (
    <div className="sticky top-14 md:top-20 z-40 w-full bg-paper border-b border-border shadow-sm">
      <div className="mx-auto flex h-14 w-full max-w-container-wide items-center justify-between px-5 md:px-8 lg:px-12">
        <nav className="hidden lg:flex items-center gap-6 overflow-x-auto no-scrollbar" aria-label="Secondary">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href as any}
              className="text-[0.8rem] font-semibold text-ink transition-colors hover:text-accent whitespace-nowrap"
            >
              {item.key}
            </Link>
          ))}
        </nav>
        
        {/* Mobile secondary nav scrollable */}
        <nav className="flex lg:hidden items-center gap-5 overflow-x-auto no-scrollbar w-full" aria-label="Secondary Mobile">
           {items.map((item) => (
            <Link
              key={item.key}
              href={item.href as any}
              className="text-[0.8rem] font-semibold text-ink transition-colors hover:text-accent whitespace-nowrap"
            >
              {item.key}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center ml-8">
          <Link
            href={"/introduccion" as any}
            className="inline-flex items-center justify-center h-8 px-4 text-[0.75rem] font-semibold text-paper bg-[#0067b8] hover:bg-[#005da6] rounded-[4px] transition-colors whitespace-nowrap"
          >
            Introducción a Azure
          </Link>
        </div>
      </div>
    </div>
  );
}
