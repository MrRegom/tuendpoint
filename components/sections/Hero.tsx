'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { LinkButton } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const SLIDES = [
  {
    id: 1,
    eyebrow: 'CONSULTORÍA Y DESARROLLO',
    title: 'Transformación Digital y Software a Medida.',
    subtitle: 'Desarrollamos ecosistemas tecnológicos que aceleran su operación y reducen costos. Expertos en salud, retail e integraciones críticas.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2400&q=80',
    primaryCta: 'Hablemos de tu proyecto',
    secondaryCta: 'Ver aceleradores digitales'
  },
  {
    id: 2,
    eyebrow: 'Misión Crítica',
    title: 'Arquitectura para operaciones que no pueden fallar.',
    subtitle: 'Con experiencia real en hospitales de alta complejidad. Diseñamos desde cero ecosistemas de gestión, sistemas de reservas, control de filas y activos críticos.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2400&q=80',
    primaryCta: 'Evaluemos su arquitectura',
    secondaryCta: 'Ver metodología'
  },
  {
    id: 3,
    eyebrow: 'Integraciones',
    title: 'Conectamos sus sistemas core y APIs.',
    subtitle: 'Integraciones con FONASA, SII, pasarelas de pago o sistemas legacy. Automatizamos flujos de datos para reducir el trabajo manual y mitigar riesgos operativos.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2400&q=80',
    primaryCta: 'Automatizar procesos',
    secondaryCta: 'Nuestras capacidades'
  }
];

export function Hero() {
  const t = useTranslations('home.hero');
  const reduceMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] w-full bg-ink overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image with minimal overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-105"
            style={{ backgroundImage: `url('${SLIDES[currentSlide].image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-container-wide px-5 md:px-8 lg:px-12">
              <div className="max-w-2xl">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#0EA5E9]">
                    {SLIDES[currentSlide].eyebrow}
                  </span>
                </motion.div>

                <motion.h1
                  className="mt-4 text-display-xl lg:text-display-2xl text-paper text-balance font-medium tracking-tight leading-[1.1]"
                  initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                  animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {SLIDES[currentSlide].title}
                </motion.h1>

                <motion.p
                  className="mt-6 text-body-m text-paper/80 text-pretty leading-relaxed"
                  initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                  animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {SLIDES[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center w-full sm:w-auto"
                  initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                  animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <LinkButton
                    href="/contacto"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto text-center"
                    withArrow
                  >
                    {SLIDES[currentSlide].primaryCta}
                  </LinkButton>
                  <Link
                    href="/soluciones"
                    className="group inline-flex items-center justify-center gap-2 h-[2.75rem] px-6 text-body-s font-medium text-paper transition-colors hover:text-[#0EA5E9] w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    <span>{SLIDES[currentSlide].secondaryCta}</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-400 ease-soft group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              "h-1 transition-all duration-500 ease-out rounded-full",
              currentSlide === idx ? "w-8 bg-[#0EA5E9]" : "w-4 bg-paper/30 hover:bg-paper/50"
            )}
            aria-label={`Ir a diapositiva ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
