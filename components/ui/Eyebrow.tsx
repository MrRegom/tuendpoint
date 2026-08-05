import { cn } from '@/lib/utils/cn';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

export function Eyebrow({ children, className, as: Component = 'span' }: EyebrowProps) {
  return (
    <Component className={cn('eyebrow', className)}>
      {children}
    </Component>
  );
}
