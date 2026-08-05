import { cn } from '@/lib/utils/cn';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'display-xl' | 'display-l' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  id?: string;
}

export function Heading({
  children,
  className,
  as: Component = 'h2',
  size = 'h2',
  id,
}: HeadingProps) {
  const sizeClass = {
    'display-xl': 'display-xl',
    'display-l': 'display-l',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
  }[size];

  return (
    <Component id={id} className={cn(sizeClass, 'text-balance', className)}>
      {children}
    </Component>
  );
}
