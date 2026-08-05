'use client';

import { forwardRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'inverted';
type Size = 'md' | 'lg';

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  arrowExternal?: boolean;
  children: React.ReactNode;
  className?: string;
}

type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#0EA5E9] text-white hover:bg-[#0284c7] border border-transparent shadow-sm rounded-sm',
  secondary:
    'bg-paper text-ink border border-ink hover:bg-ink hover:text-paper rounded-sm',
  ghost: 'bg-transparent text-ink hover:bg-bone rounded-sm',
  outline:
    'bg-transparent text-ink border border-border hover:border-ink rounded-sm',
  inverted:
    'bg-paper text-ink hover:bg-bone border border-paper rounded-sm',
};

const sizeClasses: Record<Size, string> = {
  md: 'h-11 px-5 text-body-s',
  lg: 'h-14 px-7 text-body-m',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      withArrow = false,
      arrowExternal = false,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const ArrowIcon = arrowExternal ? ArrowUpRight : ArrowRight;
    return (
      <button
        ref={ref}
        className={cn(
          'group inline-flex items-center justify-center gap-2 font-medium transition-all duration-250 ease-soft',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        <span>{children}</span>
        {withArrow && (
          <ArrowIcon
            className="h-4 w-4 transition-transform duration-250 ease-soft group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

type LinkButtonProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      withArrow = false,
      arrowExternal = false,
      children,
      className,
      href,
      ...rest
    },
    ref
  ) => {
    const ArrowIcon = arrowExternal ? ArrowUpRight : ArrowRight;
    const isExternal = href.startsWith('http') || href.startsWith('mailto:');
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'group inline-flex items-center justify-center gap-2 font-medium transition-all duration-250 ease-soft',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span>{children}</span>
        {withArrow && (
          <ArrowIcon
            className="h-4 w-4 transition-transform duration-250 ease-soft group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        )}
      </a>
    );
  }
);

LinkButton.displayName = 'LinkButton';
