/**
 * Surface textures, drawn into canvases at load.
 *
 * WHY THESE EXIST. Without them every surface returns one flat colour, and a
 * room of flat colours reads as a model of an office rather than an office - it
 * was the single biggest thing separating the first build from the approved
 * reference. Carpet has fleck, timber has grain, a ceiling has a tile grid, and
 * the eye uses exactly those cues to decide whether it is looking at a material.
 *
 * DRAWN, NOT DOWNLOADED. No image files, so nothing to license, nothing to
 * fetch, and no bytes added to the page: a 256px canvas costs a few kilobytes of
 * memory and is generated once, then tiled.
 */

import * as THREE from 'three';

function canvas(size: number, draw: (c: CanvasRenderingContext2D, s: number) => void) {
  const el = document.createElement('canvas');
  el.width = size;
  el.height = size;
  const ctx = el.getContext('2d');
  if (ctx) draw(ctx, size);
  const t = new THREE.CanvasTexture(el);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Loop carpet: a dark base with fine lighter fleck. */
export function carpetTexture(repeat = 26) {
  const t = canvas(256, (c, s) => {
    c.fillStyle = '#5b5b66';
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 9000; i++) {
      const v = 70 + Math.random() * 60;
      c.fillStyle = `rgba(${v},${v},${v + 8},${0.06 + Math.random() * 0.12})`;
      c.fillRect(Math.random() * s, Math.random() * s, 1.6, 1.6);
    }
  });
  t.repeat.set(repeat, repeat);
  return t;
}

/** Engineered timber: plank joints with grain along them. */
export function timberTexture(repeat = 7) {
  const t = canvas(256, (c, s) => {
    c.fillStyle = '#b98f61';
    c.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 32) {
      c.fillStyle = `rgba(${140 + Math.random() * 30},${105 + Math.random() * 25},${70 + Math.random() * 20},0.5)`;
      c.fillRect(0, y, s, 31);
      c.strokeStyle = 'rgba(70,50,32,0.35)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(s, y);
      c.stroke();
      for (let g = 0; g < 26; g++) {
        c.strokeStyle = `rgba(90,65,40,${0.05 + Math.random() * 0.1})`;
        const gy = y + 3 + Math.random() * 26;
        c.beginPath();
        c.moveTo(0, gy);
        c.bezierCurveTo(s * 0.3, gy + 2, s * 0.6, gy - 2, s, gy);
        c.stroke();
      }
    }
  });
  t.repeat.set(repeat, repeat * 1.4);
  return t;
}

/** Suspended ceiling: a light grid on near-white tiles. */
export function ceilingTexture(repeat = 12) {
  const t = canvas(256, (c, s) => {
    c.fillStyle = '#f7f7f5';
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 2200; i++) {
      c.fillStyle = `rgba(210,210,206,${0.05 + Math.random() * 0.08})`;
      c.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    c.strokeStyle = 'rgba(196,196,192,0.9)';
    c.lineWidth = 3;
    c.strokeRect(0, 0, s, s);
  });
  t.repeat.set(repeat, repeat);
  return t;
}

/** Painted plasterboard: almost flat, with just enough variation to catch light. */
export function wallTexture(repeat = 6) {
  const t = canvas(128, (c, s) => {
    c.fillStyle = '#f0ede8';
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 1400; i++) {
      c.fillStyle = `rgba(222,218,210,${0.05 + Math.random() * 0.07})`;
      c.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
  });
  t.repeat.set(repeat, repeat);
  return t;
}
