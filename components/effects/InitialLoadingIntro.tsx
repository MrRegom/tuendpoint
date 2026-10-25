'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InitialLoadingIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

/** Intro minimalista: "tuEndpoint" y el punto de la i cae y rebota hasta su lugar. */
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
    const finishTimer = setTimeout(handleDismiss, 2800);
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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-white select-none cursor-pointer"
          aria-label="tuEndpoint"
        >
          <div className="relative flex items-baseline text-5xl sm:text-7xl font-semibold tracking-tight text-ink leading-none">
            <span>tuEndpo</span>
            <span className="relative inline-block">
              {/* "Ä±" sin punto + punto animado */}
              <span>Ä±</span>
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#0EA5E9]"
                style={{ top: '0.12em', width: '0.14em', height: '0.14em' }}
                initial={{ y: -420, opacity: 0 }}
                animate={{
                  y: [-420, 0, -70, 0, -22, 0, -6, 0],
                  opacity: 1,
                }}
                transition={{
                  duration: 1.7,
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

