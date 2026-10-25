'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Activity, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  Server, 
  ExternalLink, 
  ChevronRight, 
  Cpu, 
  Radio, 
  Database,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { ENTERPRISE_PRODUCTS, EnterpriseProduct } from '@/lib/data/enterpriseProducts';
import { ProductModal } from './ProductModal';

interface ThresholdPortalProps {
  locale?: string;
}

export function ThresholdPortal({ locale = 'es' }: ThresholdPortalProps) {
  const [activeProductId, setActiveProductId] = useState<string>('ticpanel');
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'metrics'>('overview');
  const [selectedProductForModal, setSelectedProductForModal] = useState<EnterpriseProduct | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeProduct = ENTERPRISE_PRODUCTS.find((p) => p.id === activeProductId) || ENTERPRISE_PRODUCTS[0];

  // Scroll animations for the portal zoom sensation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const portalScale = useTransform(scrollYProgress, [0, 0.45, 0.9], [0.92, 1, 1.05]);
  const portalRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -3]);

  // Track mouse coordinates for interactive 3D perspective tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Ambient interactive canvas particles & warp lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint perspective grid lines converging to center
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * width, centerY + Math.sin(angle) * height);
        ctx.stroke();
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(186, 230, 253, ${p.opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeProductId]);

  const isEs = locale !== 'en';

  return (
    <section 
      ref={containerRef}
      id="portal-experience"
      className="relative min-h-screen py-24 sm:py-32 bg-[#05070E] text-zinc-100 overflow-hidden"
    >
      {/* Background canvas for portal depth */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Atmospheric radial glow keyed to active product */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 opacity-20"
        style={{ backgroundColor: activeProduct.themeColor }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Eyebrow & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-300">
              {isEs ? 'Portal Inmersivo · Ecosistema de Software' : 'Immersive Portal · Software Ecosystem'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white"
          >
            {isEs ? (
              <>
                Nuestras Soluciones en <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">Producción Real</span>.
              </>
            ) : (
              <>
                Our Software in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">Live Production</span>.
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            {isEs 
              ? 'Atraviese el portal interactivo y explore los 5 sistemas empresariales que hemos diseñado, desplegado y mantenido con estándares de misión crítica.' 
              : 'Step through the interactive portal and explore the 5 enterprise systems engineered, deployed, and supported with mission-critical standards.'}
          </motion.p>
        </div>

        {/* Portal Dimension Selector Buttons (5 Products) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {ENTERPRISE_PRODUCTS.map((prod) => {
            const isCurrent = prod.id === activeProductId;
            return (
              <button
                key={prod.id}
                onClick={() => {
                  setActiveProductId(prod.id);
                  setActiveTab('overview');
                }}
                className={`group relative px-4 py-2.5 rounded-xl font-mono text-xs transition-all duration-300 flex items-center gap-2.5 border ${
                  isCurrent
                    ? 'bg-zinc-900 text-white border-zinc-700 shadow-lg shadow-cyan-500/10'
                    : 'bg-zinc-950/60 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {/* Active indicator bar */}
                {isCurrent && (
                  <motion.div
                    layoutId="activePortalIndicator"
                    className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                    style={{ borderColor: prod.themeColor }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span 
                  className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: prod.themeColor }}
                />
                <span className="font-semibold tracking-wide">{prod.name}</span>
                <span className="hidden md:inline text-[0.65rem] text-zinc-500">
                  {prod.code.split('//')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* The 3D Perspective Portal Gateway Chamber */}
        <motion.div
          style={{
            scale: portalScale,
            rotateX: portalRotateX,
            transformPerspective: 1200,
          }}
          className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl shadow-black/80 p-5 sm:p-8 lg:p-10 overflow-hidden"
        >
          {/* Subtle Portal Concentric Rings HUD */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-zinc-800/40 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full border border-dashed border-zinc-800/40 pointer-events-none animate-spin-slow" />
          
          {/* Top Telemetry Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-900 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{activeProduct.portalView.hudStatus}</span>
              </span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-500">{activeProduct.code}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[0.7rem] text-zinc-300">
                {activeProduct.provenIn.badge}
              </span>
              <button
                onClick={() => setSelectedProductForModal(activeProduct)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 text-xs transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{isEs ? 'Ficha Técnica Completa' : 'Full Tech Specs'}</span>
              </button>
            </div>
          </div>

          {/* Main Stage Grid: Left = Product Deep Dive, Right = Interactive Architecture Viewport */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Content & Tabs) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-medium tracking-wider text-cyan-400 uppercase">
                    {activeProduct.category}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs text-zinc-400">
                    {activeProduct.provenIn.name}
                  </span>
                </div>

                {/* Big Title */}
                <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                  {activeProduct.name}
                </h3>

                {/* Tagline */}
                <p className="text-base sm:text-lg font-medium text-zinc-300 mb-6 leading-snug">
                  {isEs ? activeProduct.tagline.es : activeProduct.tagline.en}
                </p>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-zinc-900 mb-6 font-mono text-xs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2.5 px-1 font-medium transition-colors border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-cyan-400 text-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {isEs ? '01. Visión & Caso Real' : '01. Overview & Case'}
                  </button>
                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`pb-2.5 px-1 font-medium transition-colors border-b-2 ${
                      activeTab === 'architecture'
                        ? 'border-cyan-400 text-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {isEs ? '02. Módulos & Capacidades' : '02. Modules & Capabilities'}
                  </button>
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`pb-2.5 px-1 font-medium transition-colors border-b-2 ${
                      activeTab === 'metrics'
                        ? 'border-cyan-400 text-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {isEs ? '03. Métricas en Vivo' : '03. Live Metrics'}
                  </button>
                </div>

                {/* Tab 1: Overview */}
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="tab-overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                        {isEs ? activeProduct.description.es : activeProduct.description.en}
                      </p>

                      {/* Client / Proven In Highlight Callout */}
                      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3.5">
                        <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                            {isEs ? 'Validado en Producción Crítica' : 'Validated in Critical Production'}
                          </div>
                          <div className="text-sm font-semibold text-white mt-0.5">
                            {activeProduct.provenIn.name} — {activeProduct.provenIn.role}
                          </div>
                          <div className="text-xs text-zinc-400 mt-1">
                            {isEs ? activeProduct.summary.es : activeProduct.summary.en}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: Architecture & Capabilities */}
                  {activeTab === 'architecture' && (
                    <motion.div
                      key="tab-architecture"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {activeProduct.capabilities.map((cap, i) => (
                        <div 
                          key={i}
                          className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-xs font-semibold text-white">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{isEs ? cap.title.es : cap.title.en}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                            {isEs ? cap.desc.es : cap.desc.en}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Tab 3: Metrics */}
                  {activeTab === 'metrics' && (
                    <motion.div
                      key="tab-metrics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      {activeProduct.metrics.map((m, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between"
                        >
                          <div className="text-xs font-mono text-zinc-400 uppercase">
                            {isEs ? m.label.es : m.label.en}
                          </div>
                          <div 
                            className="text-3xl font-bold font-mono tracking-tight my-2"
                            style={{ color: activeProduct.themeColor }}
                          >
                            {m.value}
                          </div>
                          <div className="text-[0.7rem] text-zinc-500">
                            {isEs ? m.hint.es : m.hint.en}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons & Tech Stack Pills */}
              <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {activeProduct.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-[0.68rem] text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProductForModal(activeProduct)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 transition-all shadow-md shadow-cyan-900/30"
                >
                  <span>{isEs ? 'Explorar Arquitectura' : 'Explore Architecture'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Holographic Terminal & Live Architecture Viewport */}
            <div className="lg:col-span-5">
              <div 
                className="relative rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-xl overflow-hidden"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 2.5}deg) rotateX(${-mousePos.y * 2.5}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {/* Terminal Header */}
                <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between font-mono text-[0.7rem] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-zinc-300">telemetry_terminal.sh</span>
                  </div>
                  <span className="text-zinc-600">SYS_V2.4</span>
                </div>

                {/* Terminal Body */}
                <div className="p-4 font-mono text-xs text-zinc-300 space-y-3 min-h-[300px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-zinc-500 flex items-center gap-2">
                      <span className="text-cyan-400">$</span>
                      <span className="text-zinc-200">{activeProduct.portalView.terminalCommand}</span>
                    </div>

                    <div className="text-[0.72rem] text-zinc-400 pl-4 border-l border-zinc-800 space-y-1">
                      <div className="text-emerald-400">✓ Connection established with cluster gateway</div>
                      <div>→ Architecture: {activeProduct.portalView.architectureType}</div>
                      <div>→ Status: <span className="text-white font-semibold">{activeProduct.portalView.hudStatus}</span></div>
                      <div>→ Enterprise validation: <span className="text-cyan-300">{activeProduct.provenIn.name}</span></div>
                    </div>
                  </div>

                  {/* Dynamic Visual Schema Card */}
                  <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800/80 font-mono text-[0.68rem] text-zinc-400 space-y-2">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>DATAPATH_TOPOLOGY</span>
                      <span className="text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-zinc-850">
                      <span>Target Node</span>
                      <span className="text-zinc-200">{activeProduct.name} Core</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-zinc-850">
                      <span>Failover Protocol</span>
                      <span className="text-zinc-200">Autonomous Degraded Mode</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-zinc-850">
                      <span>Audit Integrity</span>
                      <span className="text-zinc-200">Append-only Inmutable</span>
                    </div>
                  </div>

                  {/* Terminal Footer Prompt */}
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[0.7rem] text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      LISTENING ON PORT 443
                    </span>
                    <span>TUENDPOINT INFRA</span>
                  </div>
                </div>
              </div>

              {/* Fast switch indicator below */}
              <div className="mt-3 flex items-center justify-between text-[0.7rem] font-mono text-zinc-500 px-2">
                <span>{isEs ? '5 de 5 módulos verificados' : '5 of 5 verified modules'}</span>
                <span>CHILE · LATAM</span>
              </div>
            </div>

          </div>

        </motion.div>

      </div>

      {/* Detail Modal if open */}
      {selectedProductForModal && (
        <ProductModal 
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          locale={locale}
        />
      )}
    </section>
  );
}
