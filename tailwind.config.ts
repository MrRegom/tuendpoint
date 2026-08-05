import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        md: '2rem',
        lg: '3rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        ink: '#0A0A0A',
        'ink-soft': '#1F2937',
        'ink-muted': '#4B5563',
        paper: '#FFFFFF',
        bone: '#F5F5F4',
        surface: '#F5F7FA',
        accent: {
          DEFAULT: '#0067b8', // Azure blue
          hover: '#005da6',
        },
        azure: {
          DEFAULT: '#0067b8',
          light: '#e6f2fb',
          gradientStart: '#d1f1f9', // Light cyan
          gradientEnd: '#ffffff',
        },
        vibrant: {
          blue: '#27438B', // From reference (Desarrollo a medida)
          pink: '#E82A5D', // From reference (Transformación digital)
          lime: '#D2F314', // From reference (Automatización)
          purple: '#8442F6', // From reference (Desarrollo web)
          cyan: '#04B2D9', // From reference (Integración)
          orange: '#F97616', // From reference (Móviles)
        },
        muted: '#6B7280',
        border: '#E5E7EB',
        'border-soft': '#F0F0EE',
        success: '#047857',
      },
      backgroundImage: {
        'azure-hero': 'linear-gradient(135deg, #d1f1f9 0%, #ffffff 50%, #e8f4fc 100%)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.75rem, 5.5vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em', fontWeight: '500' }],
        'display-xl': ['clamp(2.25rem, 4.5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '500' }],
        'display-l': ['clamp(1.875rem, 3.5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '500' }],
        'display-m': ['clamp(1.625rem, 2.8vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '500' }],
        'h1': ['clamp(1.5rem, 2.4vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '500' }],
        'h2': ['clamp(1.25rem, 1.8vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        'h3': ['clamp(1.125rem, 1.4vw, 1.25rem)', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '500' }],
        'body-l': ['1.0625rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        'body-m': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-s': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'eyebrow': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.14em', fontWeight: '500' }],
        'stat': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.025em', fontWeight: '500' }],
        'stat-xl': ['clamp(3rem, 6.5vw, 6rem)', { lineHeight: '0.9', letterSpacing: '-0.03em', fontWeight: '500' }],
      },
      spacing: {
        'section-y': 'clamp(4rem, 7vw, 8rem)',
        'section-y-sm': 'clamp(2.5rem, 5vw, 4rem)',
        'gap-grid': '1rem',
        'gap-blocks': 'clamp(2rem, 3.5vw, 3.5rem)',
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.025em',
        tight: '-0.02em',
        tightish: '-0.015em',
      },
      maxWidth: {
        container: '1280px',
        'container-wide': '1440px',
        'container-narrow': '720px',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.7s ease forwards',
        'marquee': 'marquee 50s linear infinite',
        'marquee-reverse': 'marquee-reverse 50s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
