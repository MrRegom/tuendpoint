import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { SectorsGrid } from '@/components/sections/SectorsGrid';
import { Stats } from '@/components/sections/Stats';
import { Differentiators } from '@/components/sections/Differentiators';
import { Process } from '@/components/sections/Process';
import { CatalogPreview } from '@/components/sections/CatalogPreview';
import { Capabilities } from '@/components/sections/Capabilities';
import { ContactForm } from '@/components/sections/ContactForm';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <SectorsGrid />
      <Capabilities />
      <Differentiators />
      <Process />
      <ContactForm />
    </>
  );
}
