'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Activity,
  Layers,
  ArrowRight,
  Terminal,
  FileCode,
  Building
} from 'lucide-react';
import { EnterpriseProduct } from '@/lib/data/enterpriseProducts';
import { Link } from '@/i18n/routing';

interface ProductModalProps {
  product: EnterpriseProduct;
  onClose: () => void;
  locale?: string;
}

export function ProductModal({ product, onClose, locale = 'es' }: ProductModalProps) {
  const isEs = locale !== 'en';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-white z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="pr-12">
            <div className="flex flex-wrap items-center gap-2.5 mb-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 font-semibold">
                {product.category}
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{product.code}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {product.provenIn.badge}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              {product.name}
            </h3>
            <p className="text-base sm:text-lg text-zinc-300 mt-2 font-medium">
              {isEs ? product.tagline.es : product.tagline.en}
            </p>
          </div>

          {/* Validation Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase">
                  {isEs ? 'Entorno de Validación Real' : 'Real-World Validation'}
                </div>
                <div className="text-sm font-semibold text-white">
                  {product.provenIn.name} — {product.provenIn.role}
                </div>
              </div>
            </div>

            {product.localPath && (
              <div className="font-mono text-xs text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-850">
                SRC: {product.localPath}
              </div>
            )}
          </div>

          {/* Metrics Row */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.metrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
                <div className="text-xs font-mono text-zinc-400 uppercase">
                  {isEs ? m.label.es : m.label.en}
                </div>
                <div 
                  className="text-2xl sm:text-3xl font-bold font-mono tracking-tight my-1"
                  style={{ color: product.themeColor }}
                >
                  {m.value}
                </div>
                <div className="text-[0.7rem] text-zinc-500">
                  {isEs ? m.hint.es : m.hint.en}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Description */}
          <div className="mt-8 space-y-3">
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              {isEs ? 'Arquitectura y Propósito Operativo' : 'Architecture & Operational Purpose'}
            </h4>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {isEs ? product.description.es : product.description.en}
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="mt-8">
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-4">
              {isEs ? 'Capacidades Técnicas & Módulos' : 'Technical Capabilities & Modules'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {product.capabilities.map((cap, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{isEs ? cap.title.es : cap.title.en}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                    {isEs ? cap.desc.es : cap.desc.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-8">
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-3">
              {isEs ? 'Stack Tecnológico' : 'Tech Stack'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-10 pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-zinc-500">
              {isEs ? 'Disponible para licenciamiento, personalización o consultoría dedicada.' : 'Available for licensing, tailoring, or dedicated engineering.'}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                {isEs ? 'Cerrar' : 'Close'}
              </button>
              
              <Link
                href="/contacto"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 transition-all shadow-lg shadow-cyan-950"
              >
                <span>{isEs ? 'Solicitar Demostración o Cotización' : 'Request Demo / Proposal'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
