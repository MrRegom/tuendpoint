'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InitialLoadingIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function InitialLoadingIntro({ onComplete, forceShow = false }: InitialLoadingIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [bounced, setBounced] = useState(false);
  const [shockwave, setShockwave] = useState(false);

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem('tuendpoint_intro_seen', 'true');
    setIsVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // Check if user already saw the intro during this session unless forceShow
    if (!forceShow) {
      const alreadySeen = sessionStorage.getItem('tuendpoint_intro_seen');
      if (alreadySeen === 'true') {
        setIsVisible(false);
        onComplete?.();
        return;
      }
    }

    // Schedule shockwave trigger exactly when the dot lands on the 'i'
    // Sequence: drop (0ms -> 600ms), 1st bounce (600ms -> 1100ms), 2nd bounce (1100ms -> 1500ms), settle (1700ms)
    const settleTimer = setTimeout(() => {
      setBounced(true);
      setShockwave(true);
    }, 1650);

    // Auto dismiss and finish after full cinematic reveals
    const finishTimer = setTimeout(() => {
      handleDismiss();
    }, 3400);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(finishTimer);
    };
  }, [forceShow, onComplete, handleDismiss]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="tuendpoint-intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070D] text-white overflow-hidden select-none"
      >
        {/* Subtle background tech grid */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Ambient radial glow from center */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

        {/* Skip button in corner */}
        <button
          onClick={handleDismiss}
          className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 transition-all backdrop-blur-md cursor-pointer z-10"
        >
          Saltar intro [ESC]
        </button>

        {/* Main Brand Stage */}
        <div className="relative flex flex-col items-center">
          
          {/* Shockwave ripple expanding from the 'i' */}
          <AnimatePresence>
            {shockwave && (
              <>
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.9 }}
                  animate={{ scale: 4.5, opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute left-[69%] top-[34px] w-24 h-24 -ml-12 -mt-12 rounded-full border border-cyan-400/80 pointer-events-none"
                />
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.6 }}
                  animate={{ scale: 7, opacity: 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
                  className="absolute left-[69%] top-[34px] w-24 h-24 -ml-12 -mt-12 rounded-full border border-sky-500/40 pointer-events-none"
                />
              </>
            )}
          </AnimatePresence>

          {/* Logo Typography Container */}
          <div className="relative flex items-baseline font-sans text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight">
            {/* "tu endpo" */}
            <span className="text-zinc-100 tracking-tight">tu endpo</span>

            {/* Custom letter 'i' container with dot drop animation */}
            <span className="relative inline-block w-[0.32em] mx-[0.02em] h-[1em]">
              {/* Bouncing Dot on the 'i' */}
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 w-[0.24em] h-[0.24em] rounded-full bg-gradient-to-tr from-cyan-400 to-sky-300 shadow-[0_0_18px_#38bdf8]"
                initial={{ y: -380, opacity: 0, scaleY: 1.4 }}
                animate={{
                  y: [-380, 0, -95, 0, -32, 0, -10, 0],
                  opacity: [0, 1, 1, 1, 1, 1, 1, 1],
                  scaleY: [1.4, 0.7, 1.2, 0.85, 1.05, 0.95, 1, 1],
                  scaleX: [0.8, 1.3, 0.9, 1.15, 0.98, 1.05, 1, 1],
                }}
                transition={{
                  duration: 1.7,
                  times: [0, 0.35, 0.52, 0.68, 0.8, 0.89, 0.95, 1],
                  ease: 'easeInOut',
                }}
                style={{ top: '0.12em' }}
              />

              {/* Stem of the 'i' (lowercase without native dot) */}
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-[0.06em] w-[0.22em] rounded-sm bg-zinc-100"
                style={{ height: '0.54em' }}
              />
            </span>

            {/* "nt" */}
            <span className="text-zinc-100 tracking-tight">nt</span>

            {/* Trailing accent dot */}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={bounced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-cyan-400 font-black ml-0.5 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]"
            >
              .
            </motion.span>
          </div>

          {/* Subtitle & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={bounced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-zinc-700" />
              <span className="font-mono text-[0.65rem] sm:text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold">
                Enterprise Digital Architecture
              </span>
              <span className="h-[1px] w-6 bg-zinc-700" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-1 max-w-sm text-center">
              Soluciones de misión crítica, ingeniería inteligente y automatización.
            </p>
          </motion.div>

          {/* Bottom Telemetry HUD */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={bounced ? { opacity: 0.6 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex items-center gap-4 text-[0.65rem] font-mono text-zinc-400"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CORE ONLINE
            </span>
            <span>·</span>
            <span>5 SUITES ACTIVAS</span>
            <span>·</span>
            <span>SLA 99.99%</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
