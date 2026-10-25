'use client';

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (sharedCtx) return sharedCtx;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    sharedCtx = new Ctor();
    return sharedCtx;
  } catch {
    return null;
  }
}

/**
 * Emite un toque acústico limpio tipo gota/marimba sobre cristal.
 */
function triggerBounceNote(ctx: AudioContext, when: number, freq: number, gainPeak: number, dur: number) {
  if (when < ctx.currentTime - 0.02) return;
  const t0 = Math.max(ctx.currentTime, when);

  // Fundamental cálida (sine con caída rápida de tono inicial para dar golpe físico suave)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.18, t0);
  osc.frequency.exponentialRampToValueAtTime(freq, t0 + 0.022);

  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);

  // Armónico cristalino sutil una octava arriba
  const over = ctx.createOscillator();
  const overGain = ctx.createGain();
  over.type = 'triangle';
  over.frequency.setValueAtTime(freq * 2, t0);

  overGain.gain.setValueAtTime(0.0001, t0);
  overGain.gain.linearRampToValueAtTime(gainPeak * 0.22, t0 + 0.004);
  overGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.55);

  over.connect(overGain);
  overGain.connect(ctx.destination);
  over.start(t0);
  over.stop(t0 + dur * 0.6 + 0.02);
}

/**
 * Programa la secuencia sonora exacta del intro de tuEndpoint:
 * - Unión suave de "tu" + "Endpoınt"
 * - 4 rebotes físicos del punto azul cayendo sobre la "ı" (delay 0.52s + times [0.34, 0.64, 0.87, 1.0] * 1.55s)
 */
export function playIntroBounceSound(): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const mountWallMs = performance.now();
  let scheduled = false;
  const timers: number[] = [];

  const impacts = [
    { sec: 0.52 + 1.55 * 0.34, freq: 523.25, gain: 0.16, dur: 0.13 }, // C5 - primer rebote
    { sec: 0.52 + 1.55 * 0.64, freq: 659.25, gain: 0.1, dur: 0.1 },   // E5 - segundo rebote
    { sec: 0.52 + 1.55 * 0.87, freq: 783.99, gain: 0.058, dur: 0.08 }, // G5 - tercer rebote
    { sec: 0.52 + 1.55 * 1.0, freq: 1046.5, gain: 0.036, dur: 0.12 },  // C6 - asentamiento final
  ];

  const scheduleRemaining = () => {
    if (scheduled || ctx.state !== 'running') return;
    scheduled = true;
    const elapsedSec = (performance.now() - mountWallMs) / 1000;
    const nowAudio = ctx.currentTime;

    for (const imp of impacts) {
      const delta = imp.sec - elapsedSec;
      if (delta >= -0.03) {
        triggerBounceNote(ctx, nowAudio + Math.max(0, delta), imp.freq, imp.gain, imp.dur);
      }
    }
  };

  const tryUnlock = () => {
    if (ctx.state === 'running') {
      scheduleRemaining();
      return;
    }
    ctx
      .resume()
      .then(() => {
        if (ctx.state === 'running') {
          scheduleRemaining();
        }
      })
      .catch(() => {});
  };

  tryUnlock();

  const events = ['pointerdown', 'touchstart', 'keydown'] as const;
  events.forEach((ev) => window.addEventListener(ev, tryUnlock, { passive: true }));

  return () => {
    scheduled = true;
    timers.forEach((id) => window.clearTimeout(id));
    events.forEach((ev) => window.removeEventListener(ev, tryUnlock));
  };
}
