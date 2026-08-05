import { cn } from '@/lib/utils/cn';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'body-l' | 'body-m' | 'body-s';
  muted?: boolean;
  as?: 'p' | 'span' | 'div';
}

export function Text({
  children,
  className,
  size = 'body-m',
  muted = false,
  as: Component = 'p',
}: TextProps) {
  const sizeClass = {
    'body-l': 'body-l',
    'body-m': 'body-m',
    'body-s': 'body-s',
  }[size];

  return (
    <Component
      className={cn(
        sizeClass,
        muted ? 'text-muted' : 'text-ink-soft',
        'text-pretty',
        className
      )}
    >
      {children}
    </Component>
  );
}
