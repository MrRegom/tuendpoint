'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { brand } from '@/lib/config/brand';

/* ------------------------------------------------------------------ */
/* Datos                                                               */
/* ------------------------------------------------------------------ */

type Product = {
  id: string;
  name: string;
  line: string;
  tag: string;
  color: string;
  img: string | null; // null = textura dibujada (automatizaciones)
  aspect: number;
  href?: string;
  cta: string;
};

const wa = (msg: string) =>
  `https://wa.me/${brand.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

const PRODUCTS: Product[] = [
  {
    id: 'ticpanel',
    name: 'TICPanel',
    line: 'Inventario, monitoreo y soporte de todos los equipos.',
    tag: 'En uso · Hospital',
    color: '#38bdf8',
    img: '/shots/ticpanel.jpg',
    aspect: 1.6,
    cta: 'Pedir demo',
  },
  {
    id: 'filas',
    name: 'Gestor de Filas',
    line: 'Turnos, tótems y pantallas de llamado en tiempo real.',
    tag: 'En uso · Hospital',
    color: '#818cf8',
    img: '/shots/filas.jpg',
    aspect: 1.6,
    cta: 'Pedir demo',
  },
  {
    id: 'cajaya',
    name: 'CajaYA',
    line: 'Punto de venta que funciona con o sin internet. Boleta y factura SII.',
    tag: 'Retail · Próximamente',
    color: '#a78bfa',
    img: '/shots/cajaya.jpg',
    aspect: 2048 / 1080,
    href: 'https://cajaya.cl',
    cta: 'Ver cajaya.cl',
  },
  {
    id: 'paginago',
    name: 'PaginaGo',
    line: 'Tu tienda en un link. Los pedidos te llegan ordenados por WhatsApp.',
    tag: 'Catálogos · Disponible',
    color: '#facc15',
    img: '/shots/paginago.jpg',
    aspect: 1.6,
    href: 'https://paginago.com',
    cta: 'Visitar paginago.com',
  },
  {
    id: 'auto',
    name: 'Automatizaciones',
    line: 'Conectamos tus sistemas y eliminamos lo que hoy haces a mano.',
    tag: 'A medida',
    color: '#34d399',
    img: null,
    aspect: 1.6,
    cta: 'Cuéntanos tu proceso',
  },
];

const N = PRODUCTS.length;
const SECTIONS = N + 2; // hero + productos + cierre
const SPACING = 34;
const DWELL = 12;
const END_Z = -SPACING * (N + 1) - 6;
const STOPS = [0, ...PRODUCTS.map((_, i) => -SPACING * (i + 1) + DWELL), END_Z + 24];
const HOLD = 0.17;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

function cameraZ(s: number) {
  const k = Math.min(SECTIONS - 2, Math.max(0, Math.floor(s)));
  const local = s - k;
  if (local < HOLD) return STOPS[k];
  if (local > 1 - HOLD) return STOPS[k + 1];
  const t = smooth((local - HOLD) / (1 - 2 * HOLD));
  return STOPS[k] + (STOPS[k + 1] - STOPS[k]) * t;
}

/* ------------------------------------------------------------------ */
/* Texturas auxiliares                                                 */
/* ------------------------------------------------------------------ */

function glowTexture(color: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color + '55');
  g.addColorStop(1, color + '00');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.4, '#ffffffaa');
  g.addColorStop(1, '#ffffff00');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/** Diagrama de flujo dibujado para "Automatizaciones" (no hay una app que capturar). */
function automationTexture(color: string) {
  const W = 1600;
  const H = 1000;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d')!;
  const bg = x.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0a0f1c');
  bg.addColorStop(1, '#0d1626');
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(255,255,255,0.05)';
  x.lineWidth = 1;
  for (let i = 0; i <= W; i += 50) {
    x.beginPath();
    x.moveTo(i, 0);
    x.lineTo(i, H);
    x.stroke();
  }
  for (let j = 0; j <= H; j += 50) {
    x.beginPath();
    x.moveTo(0, j);
    x.lineTo(W, j);
    x.stroke();
  }
  const nodes = [
    { t: 'Correo o formulario', s: 'Llega un documento', px: 130, py: 190 },
    { t: 'Lee y extrae datos', s: 'IA + reglas', px: 620, py: 190 },
    { t: 'Valida', s: 'Contra tu sistema', px: 1110, py: 190 },
    { t: 'SII · APIs · ERP', s: 'Se conecta solo', px: 375, py: 560 },
    { t: 'Registra', s: 'Sin digitar', px: 865, py: 560 },
  ];
  const nw = 360;
  const nh = 150;
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  x.lineWidth = 3;
  x.strokeStyle = color + 'aa';
  x.setLineDash([12, 10]);
  for (const [a, b] of links) {
    const A = nodes[a];
    const B = nodes[b];
    const sameRow = A.py === B.py;
    x.beginPath();
    if (sameRow) {
      x.moveTo(A.px + nw, A.py + nh / 2);
      x.lineTo(B.px, B.py + nh / 2);
    } else {
      x.moveTo(A.px + nw / 2, A.py + nh);
      x.bezierCurveTo(A.px + nw / 2, A.py + nh + 120, B.px + nw / 2, B.py - 120, B.px + nw / 2, B.py);
    }
    x.stroke();
  }
  x.setLineDash([]);
  nodes.forEach((n, i) => {
    x.fillStyle = '#111a2c';
    x.strokeStyle = color;
    x.lineWidth = 2.5;
    x.beginPath();
    x.roundRect(n.px, n.py, nw, nh, 22);
    x.fill();
    x.stroke();
    x.fillStyle = color;
    x.beginPath();
    x.arc(n.px + 44, n.py + nh / 2, 14, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#ffffff';
    x.font = '600 30px Inter, Segoe UI, Arial, sans-serif';
    x.fillText(n.t, n.px + 76, n.py + 66);
    x.fillStyle = '#8b97ad';
    x.font = '400 24px Inter, Segoe UI, Arial, sans-serif';
    x.fillText(n.s, n.px + 76, n.py + 104);
    x.fillStyle = color + '33';
    x.font = '700 70px Inter, Segoe UI, Arial, sans-serif';
    x.fillText(String(i + 1), n.px + nw - 70, n.py + 60);
  });
  x.fillStyle = '#ffffff';
  x.font = '600 44px Inter, Segoe UI, Arial, sans-serif';
  x.fillText('Del trabajo manual al flujo automático', 130, 860);
  x.fillStyle = '#8b97ad';
  x.font = '400 28px Inter, Segoe UI, Arial, sans-serif';
  x.fillText('Cada paso queda registrado y se avisa si algo falla.', 130, 910);
  const t = new THREE.CanvasTexture(c);
  return t;
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export function Immersive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [fallback, setFallback] = useState(false);

  const goTo = useCallback((k: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (k / (SECTIONS - 1)) * max, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setFallback(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const BG = 0x05060b;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.017);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    /* ---- partículas ---- */
    const COUNT = 4500;
    const length = SPACING * (N + 2) + 80;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const cA = new THREE.Color('#9fb4ff');
    const cB = new THREE.Color('#38bdf8');
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 5 + Math.pow(Math.random(), 0.75) * 34;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.7;
      pos[i * 3 + 2] = 25 - Math.random() * length;
      const c = cA.clone().lerp(cB, Math.random());
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const pg = track(new THREE.BufferGeometry());
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const dotTex = track(dotTexture());
    const pm = track(
      new THREE.PointsMaterial({
        size: 0.5,
        map: dotTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const points = new THREE.Points(pg, pm);
    scene.add(points);

    /* ---- estelas de velocidad ---- */
    const STREAKS = 260;
    const sp = new Float32Array(STREAKS * 6);
    for (let i = 0; i < STREAKS; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 22;
      const z = 20 - Math.random() * length;
      const len = 3 + Math.random() * 9;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.7;
      sp.set([x, y, z, x, y, z - len], i * 6);
    }
    const sg = track(new THREE.BufferGeometry());
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const sm = track(new THREE.LineBasicMaterial({ color: 0x6f8cff, transparent: true, opacity: 0.25 }));
    scene.add(new THREE.LineSegments(sg, sm));

    /* ---- portales ---- */
    type Portal = {
      group: THREE.Group;
      plane: THREE.Mesh;
      glow: THREE.Sprite;
      ring1: THREE.Mesh;
      ring2: THREE.Mesh;
      aspect: number;
    };
    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const ringGeo = track(new THREE.TorusGeometry(1, 0.0032, 8, 160));
    const planeGeo = track(new THREE.PlaneGeometry(1, 1));
    const portals: Portal[] = PRODUCTS.map((p, i) => {
      const group = new THREE.Group();
      group.position.z = -SPACING * (i + 1);
      let tex: THREE.Texture;
      if (p.img) {
        tex = loader.load(p.img, (t) => {
          const im = t.image as HTMLImageElement;
          portal.aspect = im.width / im.height;
          layout();
        });
      } else {
        tex = automationTexture(p.color);
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      track(tex);
      const mat = track(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true }));
      const plane = new THREE.Mesh(planeGeo, mat);
      const gt = track(glowTexture(p.color));
      const glow = new THREE.Sprite(
        track(new THREE.SpriteMaterial({ map: gt, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })),
      );
      glow.position.z = -3;
      const rm1 = track(new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.9 }));
      const rm2 = track(new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.35 }));
      const ring1 = new THREE.Mesh(ringGeo, rm1);
      const ring2 = new THREE.Mesh(ringGeo, rm2);
      ring2.position.z = -2.5;
      group.add(glow, plane, ring1, ring2);
      scene.add(group);
      const portal: Portal = { group, plane, glow, ring1, ring2, aspect: p.aspect };
      return portal;
    });

    /* ---- endpoint final ---- */
    const end = new THREE.Group();
    end.position.z = END_Z;
    const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.5, 32, 32)), track(new THREE.MeshBasicMaterial({ color: 0xffffff })));
    const wire = new THREE.Mesh(
      track(new THREE.IcosahedronGeometry(2.6, 1)),
      track(new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.5 })),
    );
    const eg = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: track(glowTexture('#38bdf8')), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending })),
    );
    eg.scale.setScalar(14);
    const pulses = [0, 1, 2].map(() => {
      const m = track(new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 }));
      const r = new THREE.Mesh(ringGeo, m);
      end.add(r);
      return r;
    });
    end.add(eg, core, wire);
    scene.add(end);

    /* ---- layout responsivo ---- */
    function layout() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visH = 2 * DWELL * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visW = visH * camera.aspect;
      const wide = camera.aspect > 1.25;
      portals.forEach((pt) => {
        const pw = wide ? Math.min(visW * 0.56, visH * 0.72 * pt.aspect) : Math.min(visW * 0.92, visH * 0.4 * pt.aspect);
        const ph = pw / pt.aspect;
        pt.plane.scale.set(pw, ph, 1);
        pt.group.position.x = wide ? visW * 0.19 : 0;
        pt.group.position.y = wide ? 0 : visH * 0.16;
        pt.glow.scale.set(pw * 1.7, ph * 1.9, 1);
        const R = Math.hypot(pw, ph) * 0.6;
        pt.ring1.scale.setScalar(R);
        pt.ring2.scale.setScalar(R * 1.28);
        pt.group.rotation.y = wide ? -0.1 : 0;
      });
    }
    layout();
    window.addEventListener('resize', layout);

    /* ---- interacción ---- */
    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);

    let target = 0;
    let current = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? clamp(window.scrollY / max) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    current = target;

    /* ---- bucle ---- */
    const clock = new THREE.Clock();
    let raf = 0;
    let lastActive = -1;
    let alive = true;
    const loop = () => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      current += (target - current) * Math.min(1, dt * 4.5);
      const s = current * (SECTIONS - 1);

      const z = cameraZ(s);
      camera.position.set(mouse.x * 0.9, -mouse.y * 0.55, z);
      camera.lookAt(mouse.x * 0.4, -mouse.y * 0.25, z - 20);

      points.rotation.z = t * 0.012;
      portals.forEach((pt, i) => {
        pt.ring1.rotation.z = t * 0.15 * (i % 2 ? -1 : 1);
        pt.ring2.rotation.z = -t * 0.1;
        // aparece al acercarse; desaparece al atravesarlo
        const dist = z - pt.group.position.z;
        const o = dist < 0 ? 0 : smooth((DWELL + 24 - dist) / 24);
        pt.group.visible = o > 0.01;
        (pt.plane.material as THREE.MeshBasicMaterial).opacity = o;
        pt.glow.material.opacity = 0.55 * o;
        (pt.ring1.material as THREE.MeshBasicMaterial).opacity = 0.9 * o;
        (pt.ring2.material as THREE.MeshBasicMaterial).opacity = 0.35 * o;
      });
      wire.rotation.x = t * 0.2;
      wire.rotation.y = t * 0.3;
      pulses.forEach((r, i) => {
        const k = (t * 0.35 + i / 3) % 1;
        r.scale.setScalar(2 + k * 16);
        (r.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.5;
      });
      core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);

      // textos
      for (let k = 0; k < SECTIONS; k++) {
        const el = textRefs.current[k];
        if (!el) continue;
        const o = 1 - smooth((Math.abs(s - k) - 0.14) / 0.2);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 26 * (s > k ? -1 : 1)}px, 0)`;
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`;
      const a = Math.round(s);
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', layout);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    textRefs.current[i] = el;
  };

  const ctaMsg = 'Hola, quiero conversar sobre un proyecto con tuEndpoint.';

  /* Sin WebGL: lista simple, sin 3D */
  if (fallback) {
    return (
      <div className="immersive-root min-h-screen bg-[#05060b] text-white px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight">Automatizamos. Creamos a medida.</h1>
        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {PRODUCTS.map((p) => (
            <li key={p.id}>
              {p.img && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.img} alt={p.name} className="rounded-xl border border-white/10" />}
              <h2 className="mt-3 text-2xl font-semibold">{p.name}</h2>
              <p className="text-white/60">{p.line}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="immersive-root relative bg-[#05060b] text-white">
      <canvas ref={canvasRef} className="fixed inset-0 h-screen w-screen" aria-hidden />

      {/* Navegación mínima */}
      <nav className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <button type="button" onClick={() => goTo(0)} className="text-lg font-semibold tracking-tight" aria-label="Inicio">
          tuEndpoint<span className="text-[#38bdf8]">.</span>
        </button>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <button type="button" onClick={() => goTo(1)} className="hidden transition-colors hover:text-white sm:block">
            Productos
          </button>
          <button
            type="button"
            onClick={() => goTo(SECTIONS - 1)}
            className="rounded-full border border-white/20 px-4 py-1.5 text-white transition-colors hover:bg-white hover:text-black"
          >
            Hablemos
          </button>
        </div>
      </nav>

      {/* Puntos de navegación */}
      <div className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex" aria-label="Secciones">
        {Array.from({ length: SECTIONS }).map((_, k) => (
          <button
            key={k}
            type="button"
            onClick={() => goTo(k)}
            aria-label={k === 0 ? 'Inicio' : k === SECTIONS - 1 ? 'Contacto' : PRODUCTS[k - 1].name}
            className="group relative h-2.5 w-2.5"
          >
            <span
              className={`absolute inset-0 rounded-full transition-all duration-300 ${active === k ? 'scale-125 bg-white' : 'bg-white/25 group-hover:bg-white/60'}`}
            />
          </button>
        ))}
      </div>

      {/* Hero */}
      <div
        ref={setRef(0)}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center will-change-transform"
      >
        <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl md:text-8xl">
          Automatizamos.
          <br />
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#a78bfa] to-[#facc15] bg-clip-text text-transparent">
            Creamos a medida.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-white/60">Software propio y productos que ya funcionan.</p>
        <button
          type="button"
          onClick={() => goTo(1)}
          className="mt-14 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-white"
        >
          Desliza
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
        </button>
      </div>

      {/* Productos */}
      {PRODUCTS.map((p, i) => (
        <div
          key={p.id}
          ref={setRef(i + 1)}
          className="fixed inset-x-0 bottom-0 z-10 px-6 pb-[7vh] will-change-transform md:inset-y-0 md:flex md:items-center md:px-[6vw] md:pb-0"
        >
          <div className="max-w-md md:max-w-[26rem]">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
              <span style={{ color: p.color }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="h-px w-8 bg-white/25" />
              <span>{p.tag}</span>
            </div>
            <h2 className="mt-4 text-5xl font-semibold leading-none tracking-tight md:text-6xl">{p.name}</h2>
            <p className="mt-4 text-lg leading-snug text-white/65">{p.line}</p>
            <a
              href={p.href ?? wa(`Hola, quiero ver una demo de ${p.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: p.color }}
            >
              {p.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      ))}

      {/* Cierre */}
      <div
        ref={setRef(SECTIONS - 1)}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center will-change-transform"
      >
        <h2 className="text-6xl font-semibold tracking-tight sm:text-8xl">Hablemos.</h2>
        <p className="mt-5 max-w-md text-lg text-white/60">Cuéntanos qué proceso quieres dejar de hacer a mano.</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={wa(ctaMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
          >
            Escribir por WhatsApp
          </a>
          <a
            href={`mailto:${brand.email}`}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
          >
            {brand.email}
          </a>
        </div>
        <p className="absolute bottom-6 text-xs text-white/35">
          © {new Date().getFullYear()} tuEndpoint · {brand.address}
        </p>
      </div>

      {/* Progreso */}
      <div className="fixed inset-x-0 bottom-0 z-20 h-[2px] bg-white/5">
        <div ref={barRef} className="h-full origin-left bg-white/70" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* Espaciador de scroll */}
      <div aria-hidden style={{ height: `${SECTIONS * 100}vh` }} />
    </div>
  );
}
