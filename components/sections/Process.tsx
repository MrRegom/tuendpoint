'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { processSteps } from '@/lib/data/process';
import { Reveal } from '@/components/motion/Reveal';

export function Process() {
  const t = useTranslations('home.process');
  const locale = useLocale() as 'es' | 'en';

  return (
    <section className="relative z-10 bg-surface">
      {/* Top half dark background */}
      <div className="absolute top-0 left-0 right-0 h-[60%] lg:h-[70%] bg-[#0B1120] rounded-b-[3rem] z-0" />
      
      <div className="relative mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12 py-section-y z-10">
        <Reveal>
          <div className="flex flex-col items-center justify-center text-center gap-4 mb-16">
            <div className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-2 w-max border border-white/20">
              {t('eyebrow')}
            </div>
            <h2 className="text-display-m text-white text-balance font-bold tracking-tight">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-3xl text-body-m text-white/70 text-pretty leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-12">
          {processSteps.map((step, idx) => (
            <div
              key={step.number}
              className="group bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-border-soft flex flex-col h-full cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="text-4xl font-bold text-[#0EA5E9] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  {step.number}
                </div>
                <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-[#0EA5E9] transition-colors duration-300">
                  <span className="text-ink group-hover:text-white transition-colors">↓</span>
                </div>
              </div>
              <h3 className="text-h3 font-bold text-ink text-balance mb-4 group-hover:text-[#0EA5E9] transition-colors duration-300">
                {step.title[locale]}
              </h3>
              <p className="text-body-s text-ink-soft text-pretty leading-relaxed mb-6">
                {step.description[locale]}
              </p>
              
              <div className="mt-auto overflow-hidden h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                <ul className="space-y-3 pt-6 border-t border-border-soft">
                  {step.details[locale].map((detail, didx) => (
                    <li
                      key={didx}
                      className="flex items-start gap-3 text-sm font-medium text-ink-soft"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#0EA5E9]" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
