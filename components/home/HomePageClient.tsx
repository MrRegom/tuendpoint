'use client';

import React, { useState } from 'react';
import { InitialLoadingIntro } from '@/components/effects/InitialLoadingIntro';
import { Immersive } from '@/components/home/Immersive';

export function HomePageClient({ locale: _locale }: { locale: string }) {
  const [forceIntro, setForceIntro] = useState(false);

  return (
    <>
      <InitialLoadingIntro forceShow={forceIntro} onComplete={() => setForceIntro(false)} />
      <Immersive />
    </>
  );
}
