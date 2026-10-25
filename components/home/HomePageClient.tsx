'use client';

import React, { useState } from 'react';
import { InitialLoadingIntro } from '@/components/effects/InitialLoadingIntro';
import { FrameSequenceHero, type FrameSequenceStep } from '@/components/ui/mac-book-neo-hero';
import { ContactForm } from '@/components/sections/ContactForm';

/** Cada producto ocupa FRAMES_PER_SHOT frames consecutivos de la secuencia. */
const SHOTS = 5;
const FRAMES_PER_SHOT = 12;
const FRAME_COUNT = SHOTS * FRAMES_PER_SHOT;

// Reemplaza public/shots/pN.svg por capturas reales (pN.png) y cambia la extensión aquí.
const framePath = (i: number) => {
  const shot = Math.min(SHOTS, Math.floor((i - 1) / FRAMES_PER_SHOT) + 1);
  return `/shots/p${shot}.svg`;
};

const steps: FrameSequenceStep[] = [
  { from: 0.0, to: 0.2, color: '#0ea5e9', num: '01', total: '05', title: 'TICPanel',
    description: 'Monitoreo y soporte de equipos de un hospital.', label: 'Salud' },
  { from: 0.2, to: 0.4, color: '#2563eb', num: '02', total: '05', title: 'Gestor de Filas',
    description: 'Turnos, tótems y llamados en pantalla en tiempo real.', label: 'Atención' },
  { from: 0.4, to: 0.6, color: '#10b981', num: '03', total: '05', title: 'Logística TBA',
    description: 'Inventario, compras y activos de un colegio.', label: 'Educación' },
  { from: 0.6, to: 0.8, color: '#db2777', num: '04', total: '05', title: 'PaginaGo',
    description: 'Catálogos rápidos para pymes, con pedidos por WhatsApp.', label: 'Comercio' },
  { from: 0.8, to: 1.01, color: '#7c3aed', num: '05', total: '05', title: 'Automatizaciones',
    description: 'Conectamos tus sistemas y eliminamos el trabajo manual.', label: 'Procesos' },
];

export function HomePageClient({ locale: _locale }: { locale: string }) {
  const [forceIntro, setForceIntro] = useState(false);

  return (
    <>
      <InitialLoadingIntro forceShow={forceIntro} onComplete={() => setForceIntro(false)} />

      <div id="productos">
        <FrameSequenceHero
          frameCount={FRAME_COUNT}
          framePath={framePath}
          eagerCount={FRAME_COUNT}
          scrollHeight="450vh"
          title="Software a medida, ya en producción."
          subtitle="Desliza para ver lo que hacemos."
          steps={steps}
        />
      </div>

      <ContactForm />
    </>
  );
}
