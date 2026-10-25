'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InitialLoadingIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

/**
 * Intro: "tuEndpoint" y el punto de la "i" cae desde arriba y rebota hasta su lugar.
 * La "i" se escribe sin punto (U+0131) y el punto es un elemento animado aparte.
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
    const finishTimer = setTimeout(handleDismiss, 3000);
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
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[70] flex cursor-pointer select-none items-center justify-center bg-[#05060b]"
          role="img"
          aria-label="tuEndpoint"
        >
          <div
            aria-hidden
            className="relative flex items-baseline text-5xl font-semibold leading-none tracking-tight text-white sm:text-7xl"
          >
            <span>tuEndpo</span>
            <span className="relative inline-block">
              <span>{'\u0131'}</span>
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#38bdf8]"
                style={{ top: '0.12em', width: '0.14em', height: '0.14em', boxShadow: '0 0 18px #38bdf8' }}
                initial={{ y: -520, opacity: 0 }}
                animate={{ y: [-520, 0, -80, 0, -26, 0, -7, 0], opacity: 1 }}
                transition={{
                  duration: 1.8,
                  times: [0, 0.34, 0.5, 0.64, 0.76, 0.86, 0.94, 1],
                  ease: 'easeInOut',
                  opacity: { duration: 0.15 },
                }}
              />
            </span>
            <span>nt</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
