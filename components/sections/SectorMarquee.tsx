'use client';

import { useTranslations } from 'next-intl';
import { Marquee } from '@/components/motion/Marquee';

const separator = (
  <span aria-hidden="true" className="font-mono text-eyebrow uppercase tracking-[0.14em] text-muted/40">
    —
  </span>
);

export function SectorMarquee() {
  const t = useTranslations('home.marquee');
  const items = t('sectors').split(' · ');

  return (
    <section className="border-y border-border bg-bone py-3.5">
      <Marquee duration={50} className="font-mono text-eyebrow uppercase tracking-[0.14em] text-muted">
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center gap-8">
            {item}
            {separator}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
