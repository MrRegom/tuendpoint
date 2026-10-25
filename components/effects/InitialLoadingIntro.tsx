'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playIntroBounceSound } from '@/lib/sound';

interface InitialLoadingIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

/**
 * Intro sobre fondo limpio:
 * 1) "tu" entra desde la izquierda y "Endpoınt" desde la derecha.
 * 2) El punto azul cae desde arriba rebotando exactamente sobre la "ı".
 * 3) Acompañado de sonido sutil acústico de rebote.
 */
export function InitialLoadingIntro({ onComplete, forceShow = false }: InitialLoadingIntroProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem('tuendpoint_intro_seen', 'true');
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!forceShow && sessionStorage.getItem('tuendpoint_intro_seen') === 'true') {
      setIsVisible(false);
      onComplete?.();
      return;
    }
    const finishTimer = setTimeout(handleDismiss, 2800);
    return () => clearTimeout(finishTimer);
  }, [forceShow, onComplete, handleDismiss]);

  // Sonido acústico sincronizado con los rebotes
  useEffect(() => {
    if (!isVisible) return;
    const cleanupSound = playIntroBounceSound();
    return () => cleanupSound();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleDismiss();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible, handleDismiss]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[70] flex cursor-pointer select-none items-center justify-center bg-[#f8fafc]/90 backdrop-blur-sm"
          role="img"
          aria-label="tuEndpoint"
        >
          <div
            aria-hidden
            className="relative flex items-baseline text-5xl font-semibold leading-none tracking-tight text-[#0f172a] sm:text-7xl md:text-8xl"
          >
            {/* "tu" entra desde la izquierda */}
            <motion.span
              initial={{ x: -84, opacity: 0, filter: 'blur(8px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              tu
            </motion.span>

            {/* "Endpoınt" entra desde la derecha */}
            <motion.span
              initial={{ x: 84, opacity: 0, filter: 'blur(8px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-baseline"
            >
              <span>Endpo</span>
              <span className="relative inline-flex justify-center">
                <span>{'\u0131'}</span>
                {/* Contenedor con ancho 100% y flex-center para que el punto quede milimétricamente centrado sin verse afectado por transformaciones inline */}
                <span className="pointer-events-none absolute inset-x-0 flex justify-center" style={{ top: '-0.02em' }}>
                  <motion.span
                    className="block rounded-full bg-[#0284c7]"
                    style={{
                      width: '0.145em',
                      height: '0.145em',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.5)',
                    }}
                    initial={{ y: -440, opacity: 0 }}
                    animate={{ y: [-440, 0, -68, 0, -24, 0, -6, 0], opacity: [0, 1, 1, 1, 1, 1, 1, 1] }}
                    transition={{
                      delay: 0.52,
                      duration: 1.55,
                      times: [0, 0.34, 0.5, 0.64, 0.76, 0.87, 0.94, 1],
                      ease: 'easeInOut',
                    }}
                  />
                </span>
              </span>
              <span>nt</span>
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

