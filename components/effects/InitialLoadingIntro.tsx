'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InitialLoadingIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

/**
 * Intro sobre el mismo fondo espacial:
 * 1) "tu" entra desde la izquierda y "Endpoınt" desde la derecha.
 * 2) Una vez unidos, el punto cae desde arriba y rebota quedando claramente sobre la "ı".
 */
export function InitialLoadingIntro({ onComplete, forceShow = false }: InitialLoadingIntroProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem('tuendpoint_intro_seen', 'true');
    setIsVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!forceShow && sessionStorage.getItem('tuendpoint_intro_seen') === 'true') {
      setIsVisible(false);
      onComplete?.();
      return;
    }
    const finishTimer = setTimeout(handleDismiss, 2900);
    return () => clearTimeout(finishTimer);
  }, [forceShow, onComplete, handleDismiss]);

  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleDismiss();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible, handleDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[70] flex cursor-pointer select-none items-center justify-center bg-transparent"
          role="img"
          aria-label="tuEndpoint"
        >
          <div
            aria-hidden
            className="relative flex items-baseline text-5xl font-semibold leading-none tracking-tight text-white sm:text-7xl md:text-8xl"
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
              <span className="relative inline-block">
                <span>{'\u0131'}</span>
                <motion.span
                  className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#38bdf8]"
                  style={{
                    top: '-0.02em',
                    width: '0.145em',
                    height: '0.145em',
                    boxShadow: '0 0 14px rgba(56, 189, 248, 0.75)',
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
              <span>nt</span>
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
