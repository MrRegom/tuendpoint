'use client';

import React, { useState } from 'react';
import { InitialLoadingIntro } from '@/components/effects/InitialLoadingIntro';
import { Hero } from '@/components/sections/Hero';
import { ThresholdPortal } from '@/components/portal/ThresholdPortal';
import { Capabilities } from '@/components/sections/Capabilities';
import { Differentiators } from '@/components/sections/Differentiators';
import { Process } from '@/components/sections/Process';
import { ContactForm } from '@/components/sections/ContactForm';

interface HomePageClientProps {
  locale: string;
}

export function HomePageClient({ locale }: HomePageClientProps) {
  const [forceIntro, setForceIntro] = useState(false);

  const handleReplayIntro = () => {
    setForceIntro(true);
  };

  return (
    <>
      {/* Cinematic Splash / Loading Intro with Bouncing Dot on the 'i' */}
      <InitialLoadingIntro 
        forceShow={forceIntro} 
        onComplete={() => setForceIntro(false)} 
      />

      {/* Enterprise Minimalist Hero */}
      <Hero onReplayIntro={handleReplayIntro} />

      {/* Threshold Immersive Scroll Portal for the 5 Enterprise Products */}
      <ThresholdPortal locale={locale} />

      {/* Core Engineering Capabilities */}
      <Capabilities />

      {/* Proven Differentiators (Real hospital & mission-critical validation) */}
      <Differentiators />

      {/* Enterprise Process & Methodology */}
      <Process />

      {/* Enterprise Contact & Consultation Form */}
      <ContactForm />
    </>
  );
}
