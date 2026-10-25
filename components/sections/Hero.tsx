'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Layers, 
  Cpu, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ENTERPRISE_PRODUCTS } from '@/lib/data/enterpriseProducts';

interface HeroProps {
  onReplayIntro?: () => void;
}

export function Hero({ onReplayIntro }: HeroProps) {
  const t = useTranslations('home.hero');
  const reduceMotion = useReducedMotion();
  const [activeMetricIndex, setActiveMetricIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetricIndex((prev) => (prev + 1) % ENTERPRISE_PRODUCTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentProduct = ENTERPRISE_PRODUCTS[activeMetricIndex];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center bg-[#05070E] text-white overflow-hidden pt-12 pb-20 border-b border-zinc-900">
      
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Cybernetic Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Eyebrow Badge & Replay Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">STATUS:</span>
            <span className="text-zinc-200 font-semibold tracking-wide">ENTERPRISE CORE V2.0</span>
            <span className="text-zinc-600">·</span>
            <span className="text-cyan-400">5 PRODUCTOS EN PRODUCCIÓN</span>
          </motion.div>

          {onReplayIntro && (
            <motion.button
              onClick={onReplayIntro}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? false : { opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-[0.72rem] font-mono text-zinc-400 hover:text-cyan-300 transition-all cursor-pointer"
              title="Volver a ver la animación de inicio con el punto rebotando"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Replay Intro tuEndpoint</span>
            </motion.button>
          )}
        </div>

        {/* Central Hero Statement */}
        <div className="max-w-4xl">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]"
          >
            Software de Misión Crítica &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Automatizaciones
            </span>{' '}
            de Alto Rendimiento.
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-3xl"
          >
            Diseñamos e implementamos ecosistemas digitales donde el fallo no está contemplado. 
            Probados en hospitales de alta complejidad, instituciones académicas y empresas que requieren 
            alta disponibilidad, trazabilidad inmutable y automatización inteligente.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            {/* Scroll into the Threshold Portal */}
            <a
              href="#portal-experience"
              className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-950/60 border border-cyan-400/30"
            >
              <Zap className="w-4 h-4 text-cyan-200 fill-cyan-200 group-hover:scale-110 transition-transform" />
              <span>Explorar Portal Inmersivo de Productos</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 transition-all backdrop-blur-md"
            >
              <span>Hablemos de su Proyecto</span>
            </Link>
          </motion.div>
        </div>

        {/* Live System Telemetry Strip (Showcasing all 5 products) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-16 sm:mt-20 pt-8 border-t border-zinc-900"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Ecosistema Operativo Verificado
            </span>
            <span className="font-mono text-xs text-zinc-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Rotación activa: <span className="text-zinc-300 font-semibold">{currentProduct.name}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ENTERPRISE_PRODUCTS.map((prod, index) => {
              const isHighlighted = index === activeMetricIndex;
              return (
                <a
                  key={prod.id}
                  href="#portal-experience"
                  className={`p-3.5 rounded-xl border transition-all duration-300 text-left ${
                    isHighlighted
                      ? 'bg-zinc-900 border-zinc-700 shadow-md shadow-cyan-500/5'
                      : 'bg-zinc-950/60 border-zinc-900/80 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[0.68rem] text-zinc-500 mb-1">
                    <span>{prod.code.split('//')[0]}</span>
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: prod.themeColor }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-white tracking-tight">
                    {prod.name}
                  </div>
                  <div className="text-[0.72rem] text-zinc-400 mt-1 truncate">
                    {prod.metrics[0].value} {prod.metrics[0].label.es}
                  </div>
                  <div className="text-[0.65rem] text-zinc-500 mt-0.5 truncate">
                    {prod.provenIn.name}
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
