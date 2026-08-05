'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Logo } from '@/components/layout/Logo';

export function Differentiators() {
  const t = useTranslations('home.differentiators');

  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
  }));

  const imageUrl =
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=85';

  return (
    <section className="bg-paper py-section-y">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div
            className="relative flex items-center justify-center aspect-[4/5] overflow-hidden bg-ink lg:col-span-6 lg:aspect-auto lg:min-h-[600px] rounded-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85"
              alt="Technology Data"
              className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-luminosity transition-transform duration-[20s] hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0EA5E9]/30 to-transparent mix-blend-overlay" />
            <div className="absolute inset-0 border border-white/10 rounded-xl" />
            <div className="relative z-10 scale-125 sm:scale-150 p-8">
              <Logo variant="light" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-ink" aria-hidden="true" />
                <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-muted">
                  {t('eyebrow')}
                </span>
              </div>
              <h2 className="mt-6 text-display-xl text-ink text-balance">
                {t('title')}
              </h2>
            </Reveal>

            <ul className="mt-12">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="border-t border-border py-6 last:border-b"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-body-xs font-medium text-muted">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-h2 text-ink">{item.title}</h3>
                      <p className="mt-2 text-body-s text-ink-soft text-pretty">
                        {item.description}
                      </p>
                    </div>
                    <Check className="mt-1 h-3.5 w-3.5 flex-none text-ink" strokeWidth={1.5} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
