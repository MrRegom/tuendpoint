import { cn } from '@/lib/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
}

export function Container({
  children,
  className,
  size = 'default',
  as: Component = 'div',
}: ContainerProps) {
  const sizeClass = {
    narrow: 'max-w-container-narrow',
    default: 'max-w-container',
    wide: 'max-w-container-wide',
  }[size];

  return (
    <Component className={cn('mx-auto w-full px-6 md:px-12 lg:px-20', sizeClass, className)}>
      {children}
    </Component>
  );
}
