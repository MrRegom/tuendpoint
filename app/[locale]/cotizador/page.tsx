import { setRequestLocale } from 'next-intl/server';
import { CotizadorClient } from '@/components/cotizador/CotizadorClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cotizador Oficial para Licitaciones y Empresas — tuEndpoint',
  description:
    'Generador oficial de cotizaciones y propuestas técnicas para Mercado Público (ChileCompra) y empresas privadas. Soluciones tuEndpoint SpA, Proveedor del Estado Hábil.',
};

export default function CotizadorPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <div className="cotizador-root">
      <CotizadorClient />
    </div>
  );
}
