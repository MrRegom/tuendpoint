import { setRequestLocale } from 'next-intl/server';
import { HomePageClient } from '@/components/home/HomePageClient';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <HomePageClient locale={locale} />;
}
