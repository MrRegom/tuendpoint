import { cn } from '@/lib/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'paper' | 'bone' | 'ink';
  containerSize?: 'default' | 'narrow' | 'wide';
  id?: string;
  as?: 'section' | 'div' | 'article' | 'main';
}

export function Section({
  children,
  className,
  containerClassName,
  background = 'paper',
  containerSize = 'default',
  id,
  as: Component = 'section',
}: SectionProps) {
  const bgClass = {
    paper: 'bg-paper text-ink',
    bone: 'bg-bone text-ink',
    ink: 'bg-ink text-paper',
  }[background];

  const sizeClass = {
    narrow: 'max-w-container-narrow',
    default: 'max-w-container',
    wide: 'max-w-container-wide',
  }[containerSize];

  return (
    <Component
      id={id}
      className={cn(bgClass, 'py-section-y-sm md:py-section-y', className)}
    >
      <div className={cn('mx-auto w-full px-6 md:px-12 lg:px-20', sizeClass, containerClassName)}>
        {children}
      </div>
    </Component>
  );
}
