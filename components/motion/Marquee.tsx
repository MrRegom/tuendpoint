'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: number;
  fade?: boolean;
}

export function Marquee({
  children,
  className,
  reverse = false,
  duration = 40,
  fade = true,
}: MarqueeProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={cn('overflow-hidden', fade && 'marquee-fade', className)}>
        <div className="flex">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden',
        fade && 'marquee-fade',
        className
      )}
    >
      <div
        className={cn(
          'flex w-max gap-8 whitespace-nowrap',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
