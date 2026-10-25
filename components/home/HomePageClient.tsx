'use client';

import React, { useState } from 'react';
import { InitialLoadingIntro } from '@/components/effects/InitialLoadingIntro';
import { Immersive } from '@/components/home/Immersive';

export function HomePageClient({ locale: _locale }: { locale: string }) {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <InitialLoadingIntro onComplete={() => setIntroDone(true)} />
      <Immersive introDone={introDone} />
    </>
  );
}
