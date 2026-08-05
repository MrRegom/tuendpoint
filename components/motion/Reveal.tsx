'use client';

import { cn } from '@/lib/utils/cn';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'article' | 'header';
}

/** Simple passthrough wrapper — sin animaciones para garantizar visibilidad */
export function Reveal({
  children,
  className,
  as: Component = 'div',
}: RevealProps) {
  return <Component className={cn(className)}>{children}</Component>;
}
