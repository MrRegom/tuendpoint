'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { brand } from '@/lib/config/brand';

export function WhatsAppButton() {
  const phoneNumber = brand.phone.replace(/\D/g, '');
  const message = encodeURIComponent(
    'Hola, quiero conversar sobre un proyecto con tuEndpoint.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
}
