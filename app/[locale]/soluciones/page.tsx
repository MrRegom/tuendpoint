import { setRequestLocale } from 'next-intl/server';
import { CatalogGrid } from '@/components/sections/CatalogGrid';

export default function SolucionesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <CatalogGrid />;
}
