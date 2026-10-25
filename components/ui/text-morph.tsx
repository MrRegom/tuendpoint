'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type TextMorphProps = {
  words?: string[];
  interval?: number;
  className?: string;
  charClassName?: string;
  dotClassName?: string;
};

const defaultWords = ['engineer', 'developer', 'designer'];

export function TextMorph({
  words = defaultWords,
  interval = 2500,
  className,
  charClassName,
  dotClassName,
}: TextMorphProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  // Agrupamos por palabra para que en celular jamás se corte una palabra a la mitad
  const wordTokens = useMemo(() => {
    const phrase = words[index] ?? '';
    let globalIdx = 0;
    return phrase.split(' ').map((word) => {
      const chars = Array.from(word).map((char) => {
        const idx = globalIdx++;
        return { char, idx };
      });
      globalIdx++; // cuenta el espacio para mantener el ritmo de aparición
      return chars;
    });
  }, [index, words]);

  if (!words.length) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={index}
        className={`inline-flex flex-wrap items-baseline justify-center gap-x-[0.27em] gap-y-0.5 py-2 -my-2 ${className ?? ''}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.4 }}
      >
        {wordTokens.map((chars, wIdx) => (
          <span key={wIdx} className="inline-flex whitespace-nowrap">
            {chars.map(({ char, idx }) => {
              const isDot = char === '.' && dotClassName;
              return (
                <motion.span
                  key={idx}
                  className={isDot ? dotClassName : charClassName}
                  initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
                  transition={{
                    delay: idx * 0.028,
                    duration: 0.3,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}

export default TextMorph;
