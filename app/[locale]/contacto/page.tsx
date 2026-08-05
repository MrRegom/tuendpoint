import { setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/sections/ContactForm';

export default function ContactoPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <ContactForm />;
}
