'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { stats } from '@/lib/data/technologies';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function Stats() {
  const t = useTranslations('home.stats');
  const locale = useLocale() as 'es' | 'en';
  const reduceMotion = useReducedMotion();

  // Replacing with hardcoded stats to match the mockup specifically, 
  // or use data from stats if it fits. The mockup has 4 specific stats:
  const items = [
    { value: '+10', label: 'Años de exp. sector Salud y Retail' },
    { value: 'HL7/FHIR', label: 'Integraciones clínicas y FONASA' },
    { value: '100%', label: 'Soluciones modulares adaptables' },
    { value: '24/7', label: 'Operaciones de misión crítica' },
  ];

  return (
    <section className="bg-paper py-8 border-y border-border">
      <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0"
          >
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#0A2540] max-w-[120px] block leading-relaxed">
              CONFIANZA QUE<br/>NOS RESPALDA
            </span>
          </motion.div>

          <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-start xl:justify-items-center">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3"
              >
                <div className="text-display-m font-bold text-ink tracking-tight">{item.value}</div>
                <p className="max-w-[14ch] text-xs leading-tight text-ink-soft">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 flex justify-end"
          >
            <Link
              href="/nosotros"
              className="group inline-flex items-center gap-2 text-body-xs font-semibold text-[#0EA5E9] transition-colors hover:text-blue-600"
            >
              <span>Conoce más sobre nosotros</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-400 ease-soft group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
