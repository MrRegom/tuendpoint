'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { brand } from '@/lib/config/brand';
import { AssistantBot } from '@/components/home/AssistantBot';
import { TextMorph } from '@/components/ui/text-morph';

/* ------------------------------------------------------------------ */
/* Datos y pantallas por producto                                      */
/* ------------------------------------------------------------------ */

type ScreenSpec =
  | { kind: 'img'; src: string; label: string; click?: [number, number] }
  | { kind: 'filas-tv'; label: string }
  | { kind: 'filas-totem'; label: string }
  | { kind: 'auto-monitor'; label: string }
  | { kind: 'auto-reglas'; label: string };

type Product = {
  id: string;
  name: string;
  line: string;
  tag: string;
  color: string;
  aspect: number;
  screens: ScreenSpec[];
  href?: string;
  cta: string;
};

const wa = (msg: string) =>
  `https://wa.me/${brand.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

const BRAND_BLUE = '#0284c7';

const PRODUCTS: Product[] = [
  {
    id: 'ticpanel',
    name: 'TICPanel',
    line: 'Inventario en vivo, mesa de ayuda y actas de todos tus equipos.',
    tag: 'En uso · Hospital',
    color: BRAND_BLUE,
    aspect: 1.6,
    screens: [
      { kind: 'img', src: '/shots/ticpanel-1.jpg', label: 'Panel', click: [0.015, 0.22] },
      { kind: 'img', src: '/shots/ticpanel-2.jpg', label: 'Tickets', click: [0.015, 0.27] },
      { kind: 'img', src: '/shots/ticpanel-3.jpg', label: 'Actas', click: [0.58, 0.56] },
      { kind: 'img', src: '/shots/ticpanel-4.jpg', label: 'Equipos', click: [0.015, 0.12] },
    ],
    cta: 'Pedir demo',
  },
  {
    id: 'filas',
    name: 'Gestor de Filas',
    line: 'Tótems, pantallas TV con voz y control de espera en tiempo real.',
    tag: 'En uso · Hospital',
    color: BRAND_BLUE,
    aspect: 1.6,
    screens: [
      { kind: 'filas-tv', label: 'TV Llamados' },
      { kind: 'filas-totem', label: 'Tótem' },
      { kind: 'img', src: '/shots/filas-1.jpg', label: 'En vivo', click: [0.055, 0.078] },
      { kind: 'img', src: '/shots/filas-2.jpg', label: 'Resumen', click: [0.055, 0.184] },
      { kind: 'img', src: '/shots/filas-3.jpg', label: 'Trazabilidad', click: [0.93, 0.115] },
    ],
    cta: 'Pedir demo',
  },
  {
    id: 'tba',
    name: 'Logística TBA',
    line: 'Solicitudes, bodega, órdenes de compra y activos fijos en un solo lugar.',
    tag: 'En uso · Educación',
    color: BRAND_BLUE,
    aspect: 1.6,
    screens: [
      { kind: 'img', src: '/shots/tba-1.jpg', label: 'Dashboard', click: [0.06, 0.25] },
      { kind: 'img', src: '/shots/tba-2.jpg', label: 'Bodega', click: [0.06, 0.21] },
      { kind: 'img', src: '/shots/tba-3.jpg', label: 'Reportes', click: [0.06, 0.128] },
      { kind: 'img', src: '/shots/tba-4.jpg', label: 'Módulos', click: [0.06, 0.17] },
    ],
    href: 'https://logisticatba.cloud',
    cta: 'Ver logisticatba.cloud',
  },
  {
    id: 'cajaya',
    name: 'CajaYA',
    line: 'Punto de venta rápido que funciona con o sin internet. Stock, turnos y SII.',
    tag: 'Retail · Offline + SII',
    color: BRAND_BLUE,
    aspect: 2.0,
    screens: [
      { kind: 'img', src: '/shots/cajaya-1.jpg', label: 'POS', click: [0.235, 0.34] },
      { kind: 'img', src: '/shots/cajaya-2.jpg', label: 'Inicio', click: [0.045, 0.29] },
      { kind: 'img', src: '/shots/cajaya-3.jpg', label: 'Mi turno', click: [0.72, 0.31] },
      { kind: 'img', src: '/shots/cajaya-4.jpg', label: 'Turnos', click: [0.045, 0.34] },
      { kind: 'img', src: '/shots/cajaya-5.jpg', label: 'Stock', click: [0.045, 0.23] },
      { kind: 'img', src: '/shots/cajaya-6.jpg', label: 'Ventas', click: [0.045, 0.17] },
    ],
    href: 'https://cajaya.cl',
    cta: 'Ver cajaya.cl',
  },
  {
    id: 'paginago',
    name: 'PaginaGo',
    line: 'Tu catálogo online en un link. Vende por WhatsApp sin burocracia.',
    tag: 'A la venta · paginago.com',
    color: BRAND_BLUE,
    aspect: 1.6,
    screens: [
      { kind: 'img', src: '/shots/paginago-1.jpg', label: 'Tienda', click: [0.79, 0.035] },
      { kind: 'img', src: '/shots/paginago-2.jpg', label: 'Cómo funciona', click: [0.68, 0.78] },
      { kind: 'img', src: '/shots/paginago-3.jpg', label: 'Ejemplos', click: [0.51, 0.035] },
      { kind: 'img', src: '/shots/paginago-4.jpg', label: 'Planes', click: [0.5, 0.78] },
    ],
    href: 'https://paginago.com',
    cta: 'Ir a paginago.com',
  },
  {
    id: 'auto',
    name: 'Automatizaciones',
    line: 'Conectamos tus sistemas y eliminamos lo que hoy haces a mano.',
    tag: 'A medida',
    color: BRAND_BLUE,
    aspect: 1.6,
    screens: [
      { kind: 'auto-monitor', label: 'Ejecuciones' },
      { kind: 'auto-reglas', label: 'Reglas' },
    ],
    cta: 'Cuéntanos tu proceso',
  },
];

const N = PRODUCTS.length;
const SECTIONS = N + 2; // hero + 6 productos + cierre
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
/* Texturas auxiliares y dibujado en vivo                              */
/* ------------------------------------------------------------------ */

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
  g.addColorStop(0.45, 'rgba(15, 23, 42, 0.07)');
  g.addColorStop(1, 'rgba(15, 23, 42, 0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.75)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function drawCursor(
  x: CanvasRenderingContext2D,
  px: number,
  py: number,
  color: string,
  ripple: number, // 0..1
) {
  if (ripple > 0 && ripple < 1) {
    const r = 10 + ripple * 44;
    x.save();
    x.strokeStyle = color;
    x.globalAlpha = (1 - ripple) * 0.9;
    x.lineWidth = 4;
    x.beginPath();
    x.arc(px, py, r, 0, Math.PI * 2);
    x.stroke();
    x.fillStyle = color;
    x.globalAlpha = (1 - ripple) * 0.28;
    x.beginPath();
    x.arc(px, py, r * 0.65, 0, Math.PI * 2);
    x.fill();
    x.restore();
  }
  x.save();
  x.translate(px, py);
  const press = ripple > 0 && ripple < 0.45 ? 0.88 : 1;
  x.scale(press, press);
  x.shadowColor = 'rgba(0,0,0,0.45)';
  x.shadowBlur = 12;
  x.shadowOffsetY = 4;
  x.fillStyle = '#0b1020';
  x.strokeStyle = '#ffffff';
  x.lineWidth = 3;
  x.beginPath();
  x.moveTo(0, 0);
  x.lineTo(0, 34);
  x.lineTo(9, 26);
  x.lineTo(16, 40);
  x.lineTo(22, 37);
  x.lineTo(15, 23);
  x.lineTo(26, 23);
  x.closePath();
  x.fill();
  x.stroke();
  x.restore();
}

const CALL_SEQ = [
  { cod: 'A-042', mod: 'Módulo 3', serv: 'Farmacia Ambulatoria', pref: false },
  { cod: 'P-019', mod: 'Módulo 1', serv: 'Atención Preferente', pref: true },
  { cod: 'F-105', mod: 'Módulo 2', serv: 'Entrega de Recetas', pref: false },
  { cod: 'A-043', mod: 'Módulo 4', serv: 'Farmacia Ambulatoria', pref: false },
];

/** Pantalla TV de sala de espera real de Gestor de Filas con llamados animados. */
function drawFilasTV(x: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cycle = 3.5;
  const step = Math.floor(t / cycle);
  const local = (t % cycle) / cycle; // 0..1
  const cur = CALL_SEQ[step % CALL_SEQ.length];
  const prev1 = CALL_SEQ[(step + CALL_SEQ.length - 1) % CALL_SEQ.length];
  const prev2 = CALL_SEQ[(step + CALL_SEQ.length - 2) % CALL_SEQ.length];
  const prev3 = CALL_SEQ[(step + CALL_SEQ.length - 3) % CALL_SEQ.length];

  const OSCURO = '#002A54';
  const OSCURO2 = '#0B3B70';
  const ACENTO = '#FAAF40';

  // Fondo marino institucional
  x.fillStyle = OSCURO;
  x.fillRect(0, 0, W, H);

  // Barra superior
  x.fillStyle = OSCURO;
  x.fillRect(0, 0, W, 108);
  x.fillStyle = ACENTO;
  x.fillRect(0, 104, W, 5);

  // Icono cruz/salud + nombre unidad
  x.fillStyle = ACENTO;
  x.beginPath();
  x.roundRect(36, 24, 58, 58, 14);
  x.fill();
  x.fillStyle = OSCURO;
  x.fillRect(59, 36, 12, 34);
  x.fillRect(48, 47, 34, 12);

  x.fillStyle = '#B9CCE6';
  x.font = '600 21px Inter, Segoe UI, sans-serif';
  x.fillText('Sala de Espera · Atención en vivo', 112, 46);
  x.fillStyle = '#ffffff';
  x.font = '700 38px Inter, Segoe UI, sans-serif';
  x.fillText('Farmacia CAE', 112, 85);

  // Hora derecha
  x.fillStyle = '#ffffff';
  x.font = '700 48px ui-monospace, Consolas, monospace';
  x.textAlign = 'right';
  x.fillText('16:42', W - 40, 64);
  x.fillStyle = '#B9CCE6';
  x.font = '500 20px Inter, Segoe UI, sans-serif';
  x.fillText('Sonido y voz activos', W - 40, 90);
  x.textAlign = 'left';

  // Panel izquierdo (escena + estado de módulos)
  const ex = 28, ey = 128, ew = 995, eh = 796;
  x.fillStyle = OSCURO2;
  x.beginPath();
  x.roundRect(ex, ey, ew, eh, 18);
  x.fill();

  x.fillStyle = ACENTO;
  x.font = '700 20px Inter, Segoe UI, sans-serif';
  x.fillText('ATENCIÓN AL PACIENTE', ex + 52, ey + 78);

  x.fillStyle = '#ffffff';
  x.font = '700 64px Inter, Segoe UI, sans-serif';
  x.fillText('Bienvenido', ex + 52, ey + 152);
  x.fillStyle = '#B9CCE6';
  x.font = '400 30px Inter, Segoe UI, sans-serif';
  x.fillText('Retire su número en el tótem y espere', ex + 52, ey + 206);
  x.fillText('su llamado con timbre y voz en pantalla.', ex + 52, ey + 246);

  // Tarjetas de estado de módulos en vivo
  const mods = [
    { m: 'Módulo 1', c: cur.mod === 'Módulo 1' ? cur.cod : prev1.cod, st: cur.mod === 'Módulo 1' ? 'Llamando' : 'Atendiendo' },
    { m: 'Módulo 2', c: cur.mod === 'Módulo 2' ? cur.cod : prev2.cod, st: cur.mod === 'Módulo 2' ? 'Llamando' : 'Atendiendo' },
    { m: 'Módulo 3', c: cur.mod === 'Módulo 3' ? cur.cod : prev3.cod, st: cur.mod === 'Módulo 3' ? 'Llamando' : 'Atendiendo' },
  ];
  mods.forEach((md, idx) => {
    const mx = ex + 52 + idx * 304;
    const my = ey + 320;
    const isCalling = md.st === 'Llamando';
    x.fillStyle = isCalling ? 'rgba(250,175,64,0.16)' : 'rgba(255,255,255,0.06)';
    x.strokeStyle = isCalling ? ACENTO : 'rgba(255,255,255,0.12)';
    x.lineWidth = 2;
    x.beginPath();
    x.roundRect(mx, my, 284, 185, 16);
    x.fill();
    x.stroke();

    x.fillStyle = isCalling ? ACENTO : '#34d399';
    x.beginPath();
    x.arc(mx + 28, my + 36, 7, 0, Math.PI * 2);
    x.fill();
    x.font = '700 20px Inter, Segoe UI, sans-serif';
    x.fillText(md.st.toUpperCase(), mx + 44, my + 43);

    x.fillStyle = '#ffffff';
    x.font = '700 46px ui-monospace, Consolas, monospace';
    x.fillText(md.c, mx + 24, my + 112);
    x.fillStyle = '#B9CCE6';
    x.font = '600 24px Inter, Segoe UI, sans-serif';
    x.fillText(md.m, mx + 24, my + 154);
  });

  // Indicador de onda de voz abajo a la izquierda
  x.fillStyle = 'rgba(255,255,255,0.07)';
  x.beginPath();
  x.roundRect(ex + 52, ey + 555, ew - 104, 175, 16);
  x.fill();
  x.fillStyle = '#B9CCE6';
  x.font = '600 22px Inter, Segoe UI, sans-serif';
  x.fillText('AVISO POR VOZ CHILENA', ex + 84, ey + 606);
  x.fillStyle = '#ffffff';
  x.font = '600 30px Inter, Segoe UI, sans-serif';
  x.fillText(`"Turno ${cur.cod.replace('-', ' ')}, dirigirse a ${cur.mod}"`, ex + 84, ey + 656);
  // Barras de audio animadas
  for (let b = 0; b < 18; b++) {
    const amp = local < 0.65 ? 0.3 + 0.7 * Math.abs(Math.sin(t * 9 + b * 0.7)) : 0.18;
    const bh = 10 + amp * 34;
    x.fillStyle = ACENTO;
    x.beginPath();
    x.roundRect(ex + 84 + b * 20, ey + 706 - bh, 11, bh, 4);
    x.fill();
  }

  // Panel derecho blanco de turnos (exacto a pantalla.html)
  const tx = 1046, ty = 128, tw = 526, th = 796;
  x.fillStyle = '#ffffff';
  x.beginPath();
  x.roundRect(tx, ty, tw, th, 18);
  x.fill();

  // Caja amarilla del llamado actual
  const pulse = local < 0.45 ? 1 + Math.sin(local * Math.PI * 4) * 0.015 : 1;
  x.save();
  x.translate(tx + tw / 2, ty + 145);
  x.scale(pulse, pulse);
  x.fillStyle = ACENTO;
  x.beginPath();
  x.roundRect(-tw / 2 + 24, -120, tw - 48, 240, 14);
  x.fill();
  x.fillStyle = OSCURO;
  x.font = '700 20px Inter, Segoe UI, sans-serif';
  x.fillText(cur.pref ? 'LLAMANDO · PREFERENTE' : 'LLAMANDO AHORA', -tw / 2 + 48, -80);
  x.font = '700 104px ui-monospace, Consolas, monospace';
  x.fillText(cur.cod, -tw / 2 + 44, 22);
  x.font = '700 36px Inter, Segoe UI, sans-serif';
  x.fillText(cur.mod, -tw / 2 + 48, 72);
  x.font = '600 21px Inter, Segoe UI, sans-serif';
  x.fillText(cur.serv, -tw / 2 + 48, 102);
  x.restore();

  // Llamados anteriores
  x.fillStyle = '#5F6B7D';
  x.font = '700 19px Inter, Segoe UI, sans-serif';
  x.fillText('LLAMADOS ANTERIORES', tx + 28, ty + 312);

  const hist = [prev1, prev2, prev3];
  const slideIn = smooth(clamp((local - 0.28) / 0.18));
  hist.forEach((h, idx) => {
    const ry = ty + 340 + idx * 112 + (idx === 0 ? (1 - slideIn) * -24 : 0);
    x.save();
    if (idx === 0) x.globalAlpha = slideIn;
    x.strokeStyle = '#D5DBE4';
    x.lineWidth = 1.5;
    x.beginPath();
    x.moveTo(tx + 26, ry + 96);
    x.lineTo(tx + tw - 26, ry + 96);
    x.stroke();

    x.fillStyle = '#0F1A2B';
    x.font = '700 46px ui-monospace, Consolas, monospace';
    x.fillText(h.cod, tx + 28, ry + 62);

    x.textAlign = 'right';
    x.fillStyle = '#2B3A52';
    x.font = '700 28px Inter, Segoe UI, sans-serif';
    x.fillText(h.mod, tx + tw - 28, ry + 50);
    x.fillStyle = '#5F6B7D';
    x.font = '500 19px Inter, Segoe UI, sans-serif';
    x.fillText(h.serv, tx + tw - 28, ry + 78);
    x.textAlign = 'left';
    x.restore();
  });

  // Pie de espera estimada
  x.fillStyle = '#EEF1F5';
  x.beginPath();
  x.roundRect(tx + 26, ty + 706, tw - 52, 62, 10);
  x.fill();
  x.fillStyle = '#2B3A52';
  x.font = '600 20px Inter, Segoe UI, sans-serif';
  x.fillText('Espera media:  General 4 min  ·  Preferente 1 min', tx + 44, ty + 744);

  // Marquesina inferior
  x.fillStyle = ACENTO;
  x.fillRect(0, H - 52, W, 52);
  x.fillStyle = OSCURO;
  x.font = '700 24px Inter, Segoe UI, sans-serif';
  const mq =
    'Retire su número en el tótem   ◆   Atención preferente para personas mayores, embarazadas y movilidad reducida   ◆   Esté atento a su llamado en pantalla   ◆   ';
  const mw = x.measureText(mq).width;
  const off = -((t * 95) % mw);
  x.fillText(mq + mq, off, H - 18);

  // Overlay amarillo de llamado a pantalla completa (primeros 0.28 del ciclo, igual que section.llamado en pantalla.html)
  if (local < 0.3) {
    const fade = local < 0.05 ? local / 0.05 : local > 0.24 ? (0.3 - local) / 0.06 : 1;
    x.save();
    x.globalAlpha = clamp(fade);
    x.fillStyle = ACENTO;
    x.fillRect(0, 0, W, H);
    x.fillStyle = OSCURO;
    x.font = '700 44px Inter, Segoe UI, sans-serif';
    x.fillText('Llamando ahora', 84, 118);

    // Pastilla servicio arriba derecha
    const badgeW = 430;
    x.fillStyle = OSCURO;
    x.beginPath();
    x.roundRect(W - badgeW - 84, 68, badgeW, 70, 14);
    x.fill();
    x.fillStyle = ACENTO;
    x.font = '700 30px Inter, Segoe UI, sans-serif';
    x.textAlign = 'center';
    x.fillText(cur.serv, W - badgeW / 2 - 84, 113);
    x.textAlign = 'left';

    // Código gigante
    x.fillStyle = OSCURO;
    x.font = '700 320px ui-monospace, Consolas, monospace';
    x.fillText(cur.cod, 78, 595);

    // Línea inferior + módulo
    x.fillRect(84, 735, W - 168, 5);
    x.font = '600 40px Inter, Segoe UI, sans-serif';
    x.fillText('Diríjase ahora a', 84, 845);
    x.textAlign = 'right';
    x.font = '700 108px Inter, Segoe UI, sans-serif';
    x.fillText(cur.mod, W - 84, 868);
    x.textAlign = 'left';
    x.restore();
  }
}

/** Tótem táctil real de Gestor de Filas emitiendo un ticket. */
function drawFilasTotem(x: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cycle = 4.4;
  const local = (t % cycle) / cycle;
  const OSCURO = '#002A54';
  const ACENTO = '#FAAF40';

  x.fillStyle = '#F4F5F7';
  x.fillRect(0, 0, W, H);

  // Cabecera
  x.fillStyle = OSCURO;
  x.fillRect(0, 0, W, 108);
  x.fillStyle = ACENTO;
  x.fillRect(0, 102, W, 6);
  x.fillStyle = '#ffffff';
  x.font = '700 34px Inter, Segoe UI, sans-serif';
  x.fillText('Tótem de Autoatención · Farmacia CAE', 56, 66);
  x.textAlign = 'right';
  x.font = '700 40px ui-monospace, Consolas, monospace';
  x.fillText('16:42', W - 56, 68);
  x.textAlign = 'left';

  if (local < 0.56) {
    x.fillStyle = '#4B5666';
    x.font = '700 24px Inter, Segoe UI, sans-serif';
    x.fillText('Paso 2 de 2 · RUT 16.233.406-9', 68, 185);
    x.fillStyle = '#0F1A2B';
    x.font = '700 66px Inter, Segoe UI, sans-serif';
    x.fillText('¿Qué trámite necesita?', 68, 262);

    const opts = [
      { l: 'A', name: 'Farmacia Ambulatoria', wait: '4 min espera' },
      { l: 'F', name: 'Entrega de Recetas Crónicas', wait: '6 min espera' },
      { l: 'P', name: 'Atención Preferente', wait: '1 min espera' },
      { l: 'C', name: 'Consultas e Informaciones', wait: 'Sin fila' },
    ];
    const tapped = local > 0.36;
    opts.forEach((op, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 68 + col * 744;
      const by = 320 + row * 210;
      const bw = 716, bh = 180;
      const active = idx === 0 && tapped;
      x.fillStyle = active ? ACENTO : '#ffffff';
      x.strokeStyle = active ? ACENTO : '#CDD3DC';
      x.lineWidth = 4;
      x.beginPath();
      x.roundRect(bx, by, bw, bh, 20);
      x.fill();
      x.stroke();

      x.fillStyle = OSCURO;
      x.beginPath();
      x.roundRect(bx + 28, by + 40, 96, 100, 14);
      x.fill();
      x.fillStyle = '#ffffff';
      x.font = '700 54px ui-monospace, Consolas, monospace';
      x.textAlign = 'center';
      x.fillText(op.l, bx + 76, by + 108);
      x.textAlign = 'left';

      x.fillStyle = '#0F1A2B';
      x.font = '700 34px Inter, Segoe UI, sans-serif';
      x.fillText(op.name, bx + 150, by + 84);
      x.fillStyle = '#4B5666';
      x.font = '600 23px Inter, Segoe UI, sans-serif';
      x.fillText(op.wait, bx + 150, by + 124);
    });

    const moveT = smooth(clamp(local / 0.36));
    const cx = 920 + (420 - 920) * moveT;
    const cy = 760 + (415 - 760) * moveT;
    const rip = local > 0.36 ? (local - 0.36) / 0.2 : 0;
    drawCursor(x, cx, cy, OSCURO, rip);
  } else {
    // Pantalla de ticket emitido (exacta a .capa.visible de totem.html)
    const appear = smooth(clamp((local - 0.56) / 0.1));
    x.save();
    x.globalAlpha = appear;
    x.fillStyle = OSCURO;
    x.fillRect(0, 0, W, H);
    x.fillStyle = '#B9CCE6';
    x.font = '600 32px Inter, Segoe UI, sans-serif';
    x.textAlign = 'center';
    x.fillText('Su número de atención es', W / 2, 230);

    x.fillStyle = ACENTO;
    x.beginPath();
    x.roundRect(W / 2 - 290, 280, 580, 250, 26);
    x.fill();
    x.fillStyle = OSCURO;
    x.font = '700 168px ui-monospace, Consolas, monospace';
    x.fillText('A-044', W / 2, 462);

    x.fillStyle = '#ffffff';
    x.font = '700 48px Inter, Segoe UI, sans-serif';
    x.fillText('Retire su comprobante impreso', W / 2, 640);
    x.fillStyle = '#B9CCE6';
    x.font = '500 30px Inter, Segoe UI, sans-serif';
    x.fillText('Farmacia Ambulatoria · 2 personas antes que usted', W / 2, 700);

    x.fillStyle = ACENTO;
    x.beginPath();
    x.roundRect(W / 2 - 170, 775, 340, 82, 18);
    x.fill();
    x.fillStyle = OSCURO;
    x.font = '700 32px Inter, Segoe UI, sans-serif';
    x.fillText('Listo ✓', W / 2, 827);
    x.textAlign = 'left';
    x.restore();
  }
}

const AUTO_LOGS = [
  { h: '17:38:14', ev: 'Venta POS #8941', dest: 'Factura Electrónica SII · Folio 48219', est: 'Aceptado SII', ms: '0,7 s' },
  { h: '17:38:02', ev: 'Orden #OC-204', dest: 'Recepción creada en Bodega Central', est: 'Sincronizado', ms: '1,1 s' },
  { h: '17:37:45', ev: 'Stock bajo mínimo', dest: 'Aviso enviado a encargado de compras', est: 'Entregado', ms: '0,4 s' },
  { h: '17:37:19', ev: 'Cartola bancaria', dest: 'Conciliación de 18 transferencias', est: 'Cuadrado', ms: '1,3 s' },
  { h: '17:36:50', ev: 'Acta firmada #309', dest: 'PDF respaldado y enviado por correo', est: 'Guardado', ms: '0,5 s' },
  { h: '17:36:12', ev: 'Pedido web #1108', dest: 'Guía de despacho + descuento de stock', est: 'Emitida', ms: '0,8 s' },
];

function drawAutoShell(x: CanvasRenderingContext2D, W: number, H: number, activeTab: 0 | 1) {
  x.fillStyle = '#F4F6F9';
  x.fillRect(0, 0, W, H);

  // Barra lateral sobria estilo consola empresarial real
  const sbW = 240;
  x.fillStyle = '#0F172A';
  x.fillRect(0, 0, sbW, H);

  x.fillStyle = '#FFFFFF';
  x.font = '700 24px Inter, Segoe UI, sans-serif';
  x.fillText('Integraciones', 28, 54);
  x.fillStyle = '#64748B';
  x.font = '500 15px Inter, Segoe UI, sans-serif';
  x.fillText('Consola operativa', 28, 78);

  const navItems = ['Ejecuciones', 'Reglas activas', 'Conectores', 'Alertas'];
  navItems.forEach((label, idx) => {
    const ny = 126 + idx * 54;
    const isSel = idx === activeTab;
    if (isSel) {
      x.fillStyle = '#1E293B';
      x.beginPath();
      x.roundRect(14, ny, sbW - 28, 44, 10);
      x.fill();
    }
    x.fillStyle = isSel ? '#FFFFFF' : '#94A3B8';
    x.font = `${isSel ? 600 : 500} 18px Inter, Segoe UI, sans-serif`;
    x.fillText(label, 32, ny + 28);
  });

  // Barra superior blanca limpia
  x.fillStyle = '#FFFFFF';
  x.fillRect(sbW, 0, W - sbW, 84);
  x.fillStyle = '#E2E8F0';
  x.fillRect(sbW, 83, W - sbW, 1);

  x.fillStyle = '#0F172A';
  x.font = '700 26px Inter, Segoe UI, sans-serif';
  x.fillText(activeTab === 0 ? 'Ejecuciones en tiempo real' : 'Reglas automáticas configuradas', sbW + 40, 52);

  // Estado sobrio a la derecha
  x.fillStyle = '#ECFDF5';
  x.beginPath();
  x.roundRect(W - 210, 24, 170, 36, 18);
  x.fill();
  x.fillStyle = '#10B981';
  x.beginPath();
  x.arc(W - 188, 42, 5, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = '#065F46';
  x.font = '600 15px Inter, Segoe UI, sans-serif';
  x.fillText('Operando 24/7', W - 172, 47);
}

/** Monitor limpio de integraciones reales (sin grillas ni neones estilo IA). */
function drawAutoMonitor(x: CanvasRenderingContext2D, W: number, H: number, t: number) {
  drawAutoShell(x, W, H, 0);
  const L = 280;

  const cycle = 3.2;
  const step = Math.floor(t / cycle);
  const local = (t % cycle) / cycle;

  // 3 KPIs limpios
  const kpis = [
    { label: 'EJECUCIONES HOY', val: String(1284 + (step % 12)), sub: 'Sin intervención manual' },
    { label: 'DOCUMENTOS SII', val: '312', sub: 'Boletas y facturas emitidas' },
    { label: 'ERRORES PENDIENTES', val: '0', sub: 'Reintento y aviso automático' },
  ];
  kpis.forEach((k, i) => {
    const kx = L + i * 432;
    const ky = 114;
    const kw = 412, kh = 142;
    x.fillStyle = '#FFFFFF';
    x.strokeStyle = '#E2E8F0';
    x.lineWidth = 1.5;
    x.beginPath();
    x.roundRect(kx, ky, kw, kh, 14);
    x.fill();
    x.stroke();

    x.fillStyle = '#64748B';
    x.font = '600 15px Inter, Segoe UI, sans-serif';
    x.fillText(k.label, kx + 26, ky + 38);
    x.fillStyle = '#0F172A';
    x.font = '700 44px Inter, Segoe UI, sans-serif';
    x.fillText(k.val, kx + 26, ky + 92);
    x.fillStyle = '#64748B';
    x.font = '400 16px Inter, Segoe UI, sans-serif';
    x.fillText(k.sub, kx + 26, ky + 122);
  });

  // Tabla de actividad reciente
  const tx = L, ty = 284, tw = 1276, th = 676;
  x.fillStyle = '#FFFFFF';
  x.strokeStyle = '#E2E8F0';
  x.lineWidth = 1.5;
  x.beginPath();
  x.roundRect(tx, ty, tw, th, 14);
  x.fill();
  x.stroke();

  // Encabezado tabla
  x.fillStyle = '#F8FAFC';
  x.beginPath();
  x.roundRect(tx + 1, ty + 1, tw - 2, 56, [14, 14, 0, 0]);
  x.fill();
  x.fillStyle = '#E2E8F0';
  x.fillRect(tx, ty + 57, tw, 1);

  x.fillStyle = '#64748B';
  x.font = '600 14px Inter, Segoe UI, sans-serif';
  x.fillText('HORA', tx + 28, ty + 35);
  x.fillText('ORIGEN', tx + 155, ty + 35);
  x.fillText('ACCIÓN AUTOMÁTICA', tx + 430, ty + 35);
  x.fillText('ESTADO', tx + 985, ty + 35);
  x.fillText('TIEMPO', tx + 1175, ty + 35);

  const slide = smooth(clamp(local / 0.22));
  for (let r = 0; r < 5; r++) {
    const item = AUTO_LOGS[(step + AUTO_LOGS.length - r) % AUTO_LOGS.length];
    const ry = ty + 62 + r * 118 + (r === 0 ? (1 - slide) * -22 : 0);
    x.save();
    if (r === 0) x.globalAlpha = slide;

    if (r < 4) {
      x.fillStyle = '#F1F5F9';
      x.fillRect(tx + 24, ry + 114, tw - 48, 1);
    }

    x.fillStyle = '#64748B';
    x.font = '500 18px ui-monospace, Consolas, monospace';
    x.fillText(item.h, tx + 28, ry + 64);

    x.fillStyle = '#0F172A';
    x.font = '600 20px Inter, Segoe UI, sans-serif';
    x.fillText(item.ev, tx + 155, ry + 64);

    x.fillStyle = '#334155';
    x.font = '400 20px Inter, Segoe UI, sans-serif';
    x.fillText(item.dest, tx + 430, ry + 64);

    x.fillStyle = '#ECFDF5';
    x.beginPath();
    x.roundRect(tx + 980, ry + 40, 152, 36, 18);
    x.fill();
    x.fillStyle = '#047857';
    x.font = '600 16px Inter, Segoe UI, sans-serif';
    x.fillText(item.est, tx + 1002, ry + 63);

    x.fillStyle = '#64748B';
    x.font = '500 18px ui-monospace, Consolas, monospace';
    x.fillText(item.ms, tx + 1175, ry + 64);
    x.restore();
  }

  // Cursor navegando hacia "Reglas activas" antes del cambio de vista
  const navPhase = (t % 4.5) / 4.5;
  if (navPhase > 0.45 && navPhase < 0.88) {
    const u = smooth(clamp((navPhase - 0.45) / 0.28));
    const cx = 760 + (110 - 760) * u;
    const cy = 520 + (202 - 520) * u;
    const rip = navPhase > 0.73 ? clamp((navPhase - 0.73) / 0.14) : 0;
    drawCursor(x, cx, cy, '#0EA5E9', rip);
  }
}

/** Segunda vista limpia: listado de reglas operativas reales. */
function drawAutoReglas(x: CanvasRenderingContext2D, W: number, H: number, t: number) {
  drawAutoShell(x, W, H, 1);
  const L = 280;

  const rules = [
    {
      from: 'CajaYA · Venta cerrada',
      arrow: 'Emite boleta o factura en SII y descuenta bodega',
      meta: 'Tiempo real · API SII + Inventario',
    },
    {
      from: 'Correo · Orden de compra PDF',
      arrow: 'Extrae ítems y crea pre-recepción en Bodega',
      meta: 'Cada 2 min · Correo → ERP',
    },
    {
      from: 'Banco · Cartola de movimientos',
      arrow: 'Cruza transferencias con facturas pendientes',
      meta: 'Diario 08:30 · Finanzas',
    },
    {
      from: 'Bodega · Stock bajo mínimo',
      arrow: 'Envía resumen de reposición al encargado',
      meta: 'Inmediato · WhatsApp corporativo',
    },
  ];

  rules.forEach((rl, i) => {
    const ry = 122 + i * 204;
    x.fillStyle = '#FFFFFF';
    x.strokeStyle = '#E2E8F0';
    x.lineWidth = 1.5;
    x.beginPath();
    x.roundRect(L, ry, 1276, 180, 14);
    x.fill();
    x.stroke();

    x.fillStyle = '#F1F5F9';
    x.beginPath();
    x.roundRect(L + 30, ry + 32, 320, 44, 10);
    x.fill();
    x.fillStyle = '#0F172A';
    x.font = '600 18px Inter, Segoe UI, sans-serif';
    x.fillText(rl.from, L + 48, ry + 60);

    x.fillStyle = '#94A3B8';
    x.font = '600 22px Inter, Segoe UI, sans-serif';
    x.fillText('→', L + 372, ry + 61);

    x.fillStyle = '#0F172A';
    x.font = '600 23px Inter, Segoe UI, sans-serif';
    x.fillText(rl.arrow, L + 412, ry + 61);

    x.fillStyle = '#64748B';
    x.font = '400 18px Inter, Segoe UI, sans-serif';
    x.fillText(rl.meta, L + 32, ry + 132);

    // Switch activo limpio
    x.fillStyle = '#10B981';
    x.beginPath();
    x.roundRect(L + 1170, ry + 40, 68, 36, 18);
    x.fill();
    x.fillStyle = '#FFFFFF';
    x.beginPath();
    x.arc(L + 1220, ry + 58, 13, 0, Math.PI * 2);
    x.fill();
  });

  const navPhase = (t % 4.5) / 4.5;
  if (navPhase > 0.45 && navPhase < 0.88) {
    const u = smooth(clamp((navPhase - 0.45) / 0.28));
    const cx = 820 + (110 - 820) * u;
    const cy = 480 + (148 - 480) * u;
    const rip = navPhase > 0.73 ? clamp((navPhase - 0.73) / 0.14) : 0;
    drawCursor(x, cx, cy, '#0EA5E9', rip);
  }
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

const TOPICS = ['Automatizar', 'A medida', 'Producto', 'Web 3D'] as const;

export function Immersive({ introDone = true }: { introDone?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [fallback, setFallback] = useState(false);

  // Índice de pantalla activa por producto (sincronizado entre UI y motor 3D)
  const [screenIdx, setScreenIdx] = useState<number[]>(() => PRODUCTS.map(() => 0));
  const manualRef = useRef<{ idx: number; until: number }[]>(PRODUCTS.map(() => ({ idx: 0, until: 0 })));
  const screenIdxRef = useRef<number[]>(PRODUCTS.map(() => 0));

  // Estado del formulario de contacto
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState<string>('Automatizar');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sentSummary, setSentSummary] = useState('');

  const productIndexById = useMemo(() => {
    const map: Record<string, number> = {};
    PRODUCTS.forEach((p, idx) => {
      map[p.id] = idx + 1;
    });
    return map;
  }, []);

  const goTo = useCallback((k: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (k / (SECTIONS - 1)) * max, behavior: 'smooth' });
  }, []);

  const selectScreen = useCallback((prodIdx: number, sIdx: number) => {
    manualRef.current[prodIdx] = { idx: sIdx, until: performance.now() / 1000 + 11 };
    screenIdxRef.current[prodIdx] = sIdx;
    setScreenIdx((prev) => {
      if (prev[prodIdx] === sIdx) return prev;
      const next = [...prev];
      next[prodIdx] = sIdx;
      return next;
    });
  }, []);

  const handlePrefillContact = useCallback((newTopic: string, draft: string) => {
    if (newTopic) setTopic(newTopic);
    if (draft) setMessage(draft);
    setFormState('idle');
  }, []);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || contact.trim().length < 4 || message.trim().length < 4) return;
    setFormState('sending');
    const summary = `Hola tuEndpoint, soy ${name.trim()} (${contact.trim()}). Tema: ${topic}. ${message.trim()}`;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, topic, message }),
      });
      if (!res.ok) throw new Error('err');
      setSentSummary(summary);
      setFormState('sent');
      setName('');
      setContact('');
      setMessage('');
    } catch {
      setSentSummary(summary);
      setFormState('sent');
    }
  };

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
    const BG = 0xf8fafc;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.014);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    /* ---- partículas discretas en espacio tridimensional claro ---- */
    const COUNT = 2600;
    const length = SPACING * (N + 2) + 80;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const cA = new THREE.Color('#94a3b8');
    const cB = new THREE.Color('#0ea5e9');
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 8.5 + Math.pow(Math.random(), 0.8) * 34;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.72;
      pos[i * 3 + 2] = 25 - Math.random() * length;
      const c = cA.clone().lerp(cB, Math.random() * 0.75);
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
        size: 0.38,
        map: dotTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    );
    const points = new THREE.Points(pg, pm);
    scene.add(points);

    /* ---- estelas arquitectónicas sutiles ---- */
    const STREAKS = 150;
    const sp = new Float32Array(STREAKS * 6);
    for (let i = 0; i < STREAKS; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 9.5 + Math.random() * 22;
      const z = 20 - Math.random() * length;
      const len = 3 + Math.random() * 8;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.72;
      sp.set([x, y, z, x, y, z - len], i * 6);
    }
    const sg = track(new THREE.BufferGeometry());
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const sm = track(new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.28 }));
    scene.add(new THREE.LineSegments(sg, sm));

    /* ---- precarga de capturas reales ---- */
    const imgCache = new Map<string, HTMLImageElement>();
    PRODUCTS.forEach((p) => {
      p.screens.forEach((sc) => {
        if (sc.kind === 'img' && !imgCache.has(sc.src)) {
          const im = new Image();
          im.decoding = 'async';
          im.src = sc.src;
          imgCache.set(sc.src, im);
        }
      });
    });

    /* ---- ventanas limpias con sombra arquitectónica de estudio ---- */
    const BAR_H = 42;
    type Portal = {
      group: THREE.Group;
      plane: THREE.Mesh;
      glow: THREE.Sprite;
      aspect: number;
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      tex: THREE.CanvasTexture;
      cw: number;
      ch: number;
      contentH: number;
    };

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const planeGeo = track(new THREE.PlaneGeometry(1, 1));
    const sharedShadowTex = track(shadowTexture());
    let isNarrowViewport = window.innerWidth < 768;

    const portals: Portal[] = PRODUCTS.map((p, i) => {
      const group = new THREE.Group();
      group.position.z = -SPACING * (i + 1);
      const cw = p.aspect > 1.8 ? 1920 : 1600;
      const contentH = p.aspect > 1.8 ? 960 : 1000;
      const ch = contentH + BAR_H;
      const c = document.createElement('canvas');
      c.width = cw;
      c.height = ch;
      const ctx = c.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const tex = track(new THREE.CanvasTexture(c));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;

      const mat = track(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true }));
      const plane = new THREE.Mesh(planeGeo, mat);
      const glow = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: sharedShadowTex,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
            blending: THREE.NormalBlending,
          }),
        ),
      );
      glow.position.z = -1.2;
      glow.position.y = -0.16;
      group.add(glow, plane);
      scene.add(group);

      return { group, plane, glow, aspect: cw / ch, canvas: c, ctx, tex, cw, ch, contentH };
    });

    /* ---- dibujo de un screen individual dentro del área útil de la ventana ---- */
    function renderScreenSpec(
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      spec: ScreenSpec,
      t: number,
      zoom = 1,
      focus: [number, number] = [0.5, 0.5],
    ): { ox: number; oy: number; scale: number } {
      if (spec.kind === 'filas-tv') {
        drawFilasTV(ctx, W, H, t);
        return { ox: 0, oy: 0, scale: 1 };
      }
      if (spec.kind === 'filas-totem') {
        drawFilasTotem(ctx, W, H, t);
        return { ox: 0, oy: 0, scale: 1 };
      }
      if (spec.kind === 'auto-monitor') {
        drawAutoMonitor(ctx, W, H, t);
        return { ox: 0, oy: 0, scale: 1 };
      }
      if (spec.kind === 'auto-reglas') {
        drawAutoReglas(ctx, W, H, t);
        return { ox: 0, oy: 0, scale: 1 };
      }
      const im = imgCache.get(spec.src);
      if (im && im.complete && im.naturalWidth > 0) {
        const ox = zoom > 1 ? clamp(W / 2 - focus[0] * W * zoom, W * (1 - zoom), 0) : 0;
        const oy = zoom > 1 ? clamp(H / 2 - focus[1] * H * zoom, H * (1 - zoom), 0) : 0;
        ctx.drawImage(im, ox, oy, W * zoom, H * zoom);
        return { ox, oy, scale: zoom };
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      return { ox: 0, oy: 0, scale: 1 };
    }

    function updatePortalCanvas(pt: Portal, prodIdx: number, t: number, nowSec: number) {
      const p = PRODUCTS[prodIdx];
      const total = p.screens.length;
      const { ctx, cw: W, ch: totalH, contentH: H } = pt;

      const man = manualRef.current[prodIdx];
      const stepDur = p.id === 'filas' ? 6.6 : 4.6;
      let curIdx = 0;
      let local = 0;
      const isManual = nowSec < man.until;

      if (total > 1) {
        if (isManual) {
          curIdx = man.idx;
          local = 0.25;
        } else {
          const cyc = (t + prodIdx * 1.1) / stepDur;
          curIdx = Math.floor(cyc) % total;
          local = cyc - Math.floor(cyc);
        }

        if (screenIdxRef.current[prodIdx] !== curIdx) {
          screenIdxRef.current[prodIdx] = curIdx;
          setScreenIdx((prev) => {
            if (prev[prodIdx] === curIdx) return prev;
            const next = [...prev];
            next[prodIdx] = curIdx;
            return next;
          });
        }
      }

      const curSpec = p.screens[curIdx];
      const nextSpec = p.screens[(curIdx + 1) % total];

      // Marco limpio con esquinas redondeadas
      const R = 22;
      ctx.clearRect(0, 0, W, totalH);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(2, 2, W - 4, totalH - 4, R);
      ctx.clip();

      // Barra superior estilo titanio claro para enmarcar la app limpiamente
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, W, BAR_H);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, BAR_H - 1, W, 1);

      for (let d = 0; d < 3; d++) {
        ctx.fillStyle = '#94A3B8';
        ctx.beginPath();
        ctx.arc(28 + d * 18, BAR_H / 2, 4.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#334155';
      ctx.font = '600 16px Inter, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${p.name}  ·  ${curSpec.label}`, W / 2, BAR_H / 2 + 6);
      ctx.textAlign = 'left';

      // Indicador discreto en azul
      ctx.fillStyle = BRAND_BLUE;
      ctx.beginPath();
      ctx.arc(W - 128, BAR_H / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.font = '500 14px Inter, Segoe UI, sans-serif';
      ctx.fillText(p.id === 'paginago' ? 'A la venta' : 'En vivo', W - 116, BAR_H / 2 + 5);

      // Área útil de la aplicación
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, BAR_H, W, H);
      ctx.clip();
      ctx.translate(0, BAR_H);

      const focusPt: [number, number] =
        curSpec.kind === 'img' && curSpec.click ? curSpec.click : [0.5, 0.45];
      // En celular acercamos suavemente hacia la acción activa para apreciar los detalles reales de cada pantalla
      const zoomAmp = isNarrowViewport ? 0.22 : 0.025;
      const zoom =
        !isManual && curSpec.kind === 'img'
          ? 1 + zoomAmp * Math.sin(clamp((local - 0.08) / 0.76) * Math.PI)
          : 1;

      const tf = renderScreenSpec(ctx, W, H, curSpec, t, zoom, focusPt);

      if (!isManual && total > 1) {
        if (curSpec.kind === 'img' && curSpec.click && local > 0.22 && local < 0.86) {
          const [tx, ty] = curSpec.click;
          const moveU = smooth(clamp((local - 0.22) / 0.34));
          const startX = W * 0.54;
          const startY = H * 0.58;
          const rawX = startX + (tx * W - startX) * moveU;
          const rawY = startY + (ty * H - startY) * moveU;
          const cx = tf.ox + rawX * tf.scale;
          const cy = tf.oy + rawY * tf.scale;
          const rip = local > 0.58 ? clamp((local - 0.58) / 0.22) : 0;
          drawCursor(ctx, cx, cy, BRAND_BLUE, rip);
        }

        if (local > 0.82) {
          const alpha = smooth((local - 0.82) / 0.18);
          ctx.save();
          ctx.globalAlpha = alpha;
          renderScreenSpec(ctx, W, H, nextSpec, t, 1);
          ctx.restore();
        }
      }

      ctx.restore(); // fin área útil
      ctx.restore(); // fin clip redondeado

      // Borde fino alrededor de la ventana
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(2, 2, W - 4, totalH - 4, R);
      ctx.stroke();

      pt.tex.needsUpdate = true;
    }

    /* ---- layout responsivo ---- */
    function layout() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      isNarrowViewport = w < 768;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visH = 2 * DWELL * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visW = visH * camera.aspect;
      const wide = camera.aspect > 1.18;
      portals.forEach((pt) => {
        const pw = wide
          ? Math.min(visW * 0.59, visH * 0.78 * pt.aspect)
          : Math.min(visW * 0.95, visH * 0.45 * pt.aspect);
        const ph = pw / pt.aspect;
        pt.plane.scale.set(pw, ph, 1);
        pt.group.position.x = wide ? visW * 0.145 : 0;
        pt.group.position.y = wide ? 0 : visH * 0.155;
        pt.glow.scale.set(pw * 1.35, ph * 1.45, 1);
        pt.group.rotation.y = wide ? -0.04 : 0;
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
      const nowSec = performance.now() / 1000;
      current += (target - current) * Math.min(1, dt * 4.5);
      const s = current * (SECTIONS - 1);

      const z = cameraZ(s);
      camera.position.set(mouse.x * 0.55, -mouse.y * 0.35, z);
      camera.lookAt(mouse.x * 0.22, -mouse.y * 0.14, z - 20);

      points.rotation.z = t * 0.008;
      portals.forEach((pt, i) => {
        const dist = z - pt.group.position.z;
        const o = dist < 0 ? 0 : smooth((DWELL + 24 - dist) / 24);
        pt.group.visible = o > 0.01;
        if (o > 0.02) {
          updatePortalCanvas(pt, i, t, nowSec);
        }
        (pt.plane.material as THREE.MeshBasicMaterial).opacity = o;
        pt.glow.material.opacity = 0.14 * o;
      });

      for (let k = 0; k < SECTIONS; k++) {
        const el = textRefs.current[k];
        if (!el) continue;
        const o = 1 - smooth((Math.abs(s - k) - 0.14) / 0.2);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 24 * (s > k ? -1 : 1)}px, 0)`;
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

  if (fallback) {
    return (
      <div className="immersive-root min-h-screen bg-[#05060b] px-6 py-24 text-white">
        <h1 className="text-4xl font-semibold tracking-tight">Automatizamos. Creamos a medida.</h1>
        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {PRODUCTS.map((p) => {
            const firstImg = p.screens.find((sc) => sc.kind === 'img');
            return (
              <li key={p.id}>
                {firstImg && firstImg.kind === 'img' && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={firstImg.src} alt={p.name} className="rounded-xl border border-white/10" />
                )}
                <h2 className="mt-3 text-2xl font-semibold">{p.name}</h2>
                <p className="text-white/60">{p.line}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="immersive-root relative bg-[#f8fafc] text-[#0f172a]">
      <canvas ref={canvasRef} className="fixed inset-0 h-screen w-screen" aria-hidden />

      <div className={`transition-opacity duration-700 ${introDone ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        {/* Navegación mínima */}
        <nav className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 md:px-10">
          <button type="button" onClick={() => goTo(0)} className="text-lg font-bold tracking-tight text-[#0f172a]" aria-label="Inicio">
            tuEndpoint<span className="text-[#0284c7]">.</span>
          </button>
          <div className="flex items-center gap-5 sm:gap-7 text-sm font-medium text-slate-600">
            <button type="button" onClick={() => goTo(1)} className="hidden transition-colors hover:text-[#0f172a] sm:block">
              Productos
            </button>
            <a
              href="https://paginago.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border-b border-[#0284c7]/60 pb-0.5 text-[#0284c7] transition-colors hover:border-[#0284c7] hover:text-[#0369a1]"
            >
              <span>PaginaGo</span>
              <span className="text-xs" aria-hidden>↗</span>
            </a>
            <Link
              href="/cotizador"
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-2.5 py-1 text-xs font-semibold text-sky-800 transition hover:border-sky-400 hover:bg-sky-100"
            >
              <span>Cotizador</span>
              <span className="rounded bg-sky-600 px-1 py-0.2 text-[9px] font-bold text-white uppercase">PDF</span>
            </Link>
            <button
              type="button"
              onClick={() => goTo(SECTIONS - 1)}
              className="border-b border-slate-300 pb-0.5 text-slate-700 transition-colors hover:border-slate-800 hover:text-[#0f172a]"
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
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  active === k ? 'scale-125 bg-[#0284c7]' : 'bg-slate-300 group-hover:bg-slate-500'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Hero */}
        <div
          ref={setRef(0)}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center px-5 text-center will-change-transform"
        >
          <h1 className="flex flex-col items-center text-[2.15rem] font-bold leading-[1.1] tracking-tight text-[#0f172a] sm:text-6xl md:text-8xl">
            <span className="whitespace-nowrap">
              Automatizamos<span className="text-[#0284c7]">.</span>
            </span>
            <span className="mt-1.5 flex min-h-[1.2em] max-w-[92vw] items-center justify-center text-slate-500 font-semibold">
              <TextMorph
                words={['Creamos a medida.', 'Conectamos sistemas.', 'Productos propios.', 'Webs interactivas.']}
                interval={2600}
                dotClassName="text-[#0284c7]"
              />
            </span>
          </h1>
          <p className="mt-6 max-w-sm text-base text-slate-600 sm:max-w-md sm:text-lg">
            Software propio y soluciones en producción.
          </p>
          <button
            type="button"
            onClick={() => goTo(1)}
            className="mt-14 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-slate-500 transition-colors hover:text-[#0f172a]"
          >
            Desliza
            <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-[#0284c7] via-slate-300 to-transparent" />
          </button>
        </div>

        {/* Productos */}
        {PRODUCTS.map((p, i) => (
          <div
            key={p.id}
            ref={setRef(i + 1)}
            className="fixed inset-x-0 bottom-0 z-10 px-5 pb-[6.5vh] will-change-transform md:inset-y-0 md:flex md:items-center md:px-[5.5vw] md:pb-0"
          >
            <div className="max-w-md md:max-w-[23.5rem]">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                <span className="font-mono font-semibold text-[#0284c7]">{String(i + 1).padStart(2, '0')}</span>
                <span className="h-px w-7 bg-slate-300" />
                <span>{p.tag}</span>
              </div>
              <h2 className="mt-2.5 text-3xl font-bold leading-none tracking-tight text-[#0f172a] sm:text-5xl md:text-6xl">
                {p.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{p.line}</p>

              {/* Selector minimalista de pantallas (solo texto + línea azul activa) */}
              {p.screens.length > 1 && (
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2" aria-label={`Vistas de ${p.name}`}>
                  {p.screens.map((sc, sIdx) => {
                    const isCur = screenIdx[i] === sIdx;
                    return (
                      <button
                        key={sc.label}
                        type="button"
                        onClick={() => selectScreen(i, sIdx)}
                        className={`relative pb-1.5 text-xs tracking-wide transition-colors sm:text-[13px] ${
                          isCur
                            ? 'font-semibold text-[#0f172a] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#0284c7]'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href={p.href ?? wa(`Hola, quiero ver una demo de ${p.name}.`)}
                  target={p.href ? '_blank' : undefined}
                  rel={p.href ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-2 border-b border-[#0284c7]/80 pb-1 text-sm font-semibold text-[#0284c7] transition-colors hover:border-[#0284c7] hover:text-[#0369a1]"
                >
                  <span>{p.cta}</span>
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                    {p.href ? '↗' : '→'}
                  </span>
                </a>

                {p.id === 'paginago' && (
                  <a
                    href={wa('Hola, quiero consultar por la contratación de PaginaGo.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border-b border-slate-300 pb-1 text-sm text-slate-600 transition-colors hover:border-slate-800 hover:text-[#0f172a]"
                  >
                    <span>Consultar por WhatsApp</span>
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Cierre + Formulario de contacto */}
        <div
          ref={setRef(SECTIONS - 1)}
          className="fixed inset-0 z-10 flex items-center justify-center px-5 py-16 will-change-transform md:px-[7vw]"
        >
          <div className="grid w-full max-w-5xl items-center gap-7 md:grid-cols-12 md:gap-12">
            <div className="text-center md:col-span-5 md:text-left">
              <h2 className="text-4xl font-bold tracking-tight text-[#0f172a] sm:text-6xl md:text-7xl">
                Hablemos<span className="text-[#0284c7]">.</span>
              </h2>
              <p className="mt-3 text-sm text-slate-600 sm:mt-4 sm:text-base">
                Cuéntanos qué quieres automatizar o construir. Respondemos en el día.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
                <a
                  href={wa(ctaMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-b border-[#0284c7] pb-1 text-sm font-semibold text-[#0284c7] transition-colors hover:text-[#0369a1]"
                >
                  <span>Escribir por WhatsApp</span>
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href={`mailto:${brand.email}`}
                  className="border-b border-slate-300 pb-1 text-sm text-slate-700 transition-colors hover:border-slate-800 hover:text-[#0f172a]"
                >
                  {brand.email}
                </a>
              </div>
              <div className="mt-8 hidden text-xs text-slate-500 md:block space-y-1">
                <p>© {new Date().getFullYear()} tuEndpoint · {brand.address}</p>
                <p>
                  Producto comercial:{' '}
                  <a href="https://paginago.com" target="_blank" rel="noopener noreferrer" className="text-[#0284c7] underline hover:text-[#0369a1]">
                    paginago.com
                  </a>
                  {' · '}
                  <Link href="/cotizador" className="text-slate-700 underline hover:text-[#0284c7]">
                    Cotizador Licitaciones (PDF)
                  </Link>
                </p>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="border border-slate-200/90 border-t-2 border-t-[#0284c7] bg-white/95 p-5 shadow-xl backdrop-blur-xl sm:p-7">
                {formState === 'sent' ? (
                  <div className="space-y-4 py-4 text-center md:text-left">
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#0284c7]">MENSAJE RECIBIDO</div>
                    <h3 className="text-xl font-bold text-[#0f172a]">Te responderemos a la brevedad</h3>
                    <p className="text-sm text-slate-600">
                      Si necesitas respuesta inmediata, puedes enviarnos también una copia directa por WhatsApp:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-2 md:justify-start">
                      <a
                        href={wa(sentSummary)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 border-b border-[#0284c7] pb-1 text-sm font-semibold text-[#0284c7] hover:text-[#0369a1]"
                      >
                        <span>Abrir en WhatsApp ahora</span>
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setFormState('idle')}
                        className="border-b border-slate-300 pb-1 text-xs text-slate-600 hover:text-slate-900"
                      >
                        Enviar otro mensaje
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submitForm} className="space-y-4">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-100 pb-2">
                      {TOPICS.map((tp) => (
                        <button
                          key={tp}
                          type="button"
                          onClick={() => setTopic(tp)}
                          className={`relative pb-1.5 text-xs tracking-wide transition-colors ${
                            topic === tp
                              ? 'font-semibold text-[#0f172a] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#0284c7]'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {tp}
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        minLength={2}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        aria-label="Tu nombre"
                        className="w-full border-b border-slate-200 bg-transparent py-2 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#0284c7] focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        minLength={4}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Correo o WhatsApp"
                        aria-label="Correo o WhatsApp"
                        className="w-full border-b border-slate-200 bg-transparent py-2 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#0284c7] focus:outline-none"
                      />
                    </div>

                    <textarea
                      rows={2}
                      required
                      minLength={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos en pocas palabras qué necesitas..."
                      aria-label="Mensaje"
                      className="w-full resize-none border-b border-slate-200 bg-transparent py-2 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#0284c7] focus:outline-none"
                    />

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <span className="text-xs text-slate-500">Diagnóstico sin costo.</span>
                      <button
                        type="submit"
                        disabled={formState === 'sending'}
                        className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b border-[#0284c7] pb-1 text-sm font-semibold text-[#0284c7] transition-colors hover:text-[#0369a1] disabled:opacity-50"
                      >
                        <span>{formState === 'sending' ? 'Enviando...' : 'Enviar mensaje'}</span>
                        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Guía directa minimalista */}
        <AssistantBot
          productIndexById={productIndexById}
          contactIndex={SECTIONS - 1}
          onNavigate={goTo}
          onPrefillContact={handlePrefillContact}
        />

        {/* Progreso */}
        <div className="fixed inset-x-0 bottom-0 z-20 h-[2px] bg-slate-200/80">
          <div ref={barRef} className="h-full origin-left bg-[#0284c7]" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      {/* Espaciador de scroll */}
      <div aria-hidden style={{ height: `${SECTIONS * 100}vh` }} />
    </div>
  );
}
