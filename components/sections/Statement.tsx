'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function Statement() {
  const t = useTranslations('home.statement');
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <section ref={ref} className="bg-paper py-section-y">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-ink" aria-hidden="true" />
          <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-muted">
            {t('eyebrow')}
          </span>
        </div>

        <motion.h2
          className="serif mt-10 max-w-5xl text-display-2xl italic text-ink text-balance"
          style={{ y: reduceMotion ? 0 : y }}
        >
          {t('title')}
        </motion.h2>

        <motion.p
          className="mt-8 max-w-xl text-body-m text-ink-soft text-pretty"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('body')}
        </motion.p>
      </div>
    </section>
  );
}
