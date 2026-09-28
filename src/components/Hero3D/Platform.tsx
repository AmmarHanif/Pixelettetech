'use client';

/**
 * The plinth the scene stands on.
 *
 * IT IS MUCH SMALLER THAN IT WAS, AND THAT IS THE POINT. The first build made
 * the base 4.6 units against 1.55-unit panels, so a pale grey slab occupied the
 * bottom half of the widget and the actual subject sat above it like an
 * afterthought. The plinth exists to give the objects somewhere to stand; when
 * it is the biggest thing in frame the composition is upside down.
 *
 * POLISHED, NOT MATT. Metal at low roughness mirrors the environment and the
 * lit panels above it, which is where the scene gets its sense of a floor.
 * A matt base returns the same flat grey from every angle - most of why the
 * first attempt looked like paper cut-outs.
 *
 * THE ENGRAVED LINE IS A TEXTURE, NOT GEOMETRY AND NOT DOM. It is drawn once
 * into a canvas and laid flat on the top face. As DOM it could not sit in the
 * surface's perspective; as geometry it would be thousands of triangles for
 * four words.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const TIERS = [
  { w: 3.5, d: 2.5, h: 0.12, y: -1.62 },
  { w: 2.75, d: 1.95, h: 0.11, y: -1.5 },
  { w: 2.05, d: 1.45, h: 0.1, y: -1.39 },
];

/** The engraved line, drawn once into a canvas. */
function useEngravedLabel() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 128;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(92, 78, 112, 0.55)';
    ctx.font = '600 38px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '8px';
    ctx.fillText('IDEAS · TECHNOLOGY · REAL-WORLD IMPACT', c.width / 2, c.height / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

export function Platform({ quality }: { quality: 'full' | 'reduced' }) {
  const geometries = useMemo(
    () => TIERS.map(t => new RoundedBoxGeometry(t.w, t.h, t.d, 4, 0.03)),
    [],
  );
  const label = useEngravedLabel();

  return (
    <group>
      {TIERS.map((t, i) => (
        <mesh
          castShadow={quality === 'full' && i === 0}
          geometry={geometries[i]}
          key={t.y}
          position={[0, t.y, 0]}
          receiveShadow={quality === 'full'}
        >
          {/* Polished, and progressively brighter toward the top so the stack
              reads as separate plates rather than one block. */}
          {/* Darker than it looks it should be. Polished metal is almost
              entirely its own reflections, and in a bright environment a light
              base colour returns white from every angle - which is how the
              first version rendered as flat pale card rather than chrome. */}
          <meshStandardMaterial
            color={i === 0 ? '#8d86a3' : i === 1 ? '#a09ab4' : '#b3aec5'}
            envMapIntensity={2.6}
            metalness={1}
            roughness={0.05 + i * 0.02}
          />
        </mesh>
      ))}

      {/* the engraved line, lying on the front shelf of the base tier */}
      {label ? (
        <mesh
          position={[0, TIERS[0].y + TIERS[0].h / 2 + 0.002, TIERS[0].d / 2 - 0.26]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[3.1, 0.39]} />
          <meshBasicMaterial map={label} opacity={0.75} transparent />
        </mesh>
      ) : null}
    </group>
  );
}
