import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://regom.cl'),
  title: {
    default: 'Regom — Catálogo inteligente de soluciones digitales',
    template: '%s | Regom',
  },
  description:
    'Software especializado en salud, educación, retail y operaciones críticas. Adaptable. En producción.',
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    alternateLocale: 'en_US',
    siteName: 'Regom',
    title: 'Regom — Catálogo inteligente de soluciones digitales',
    description:
      'Software especializado en salud, educación, retail y operaciones críticas. Adaptable. En producción.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regom — Catálogo inteligente de soluciones digitales',
    description:
      'Software especializado en salud, educación, retail y operaciones críticas. Adaptable. En producción.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
