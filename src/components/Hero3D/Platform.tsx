'use client';

/**
 * The layered platform the composition stands on.
 *
 * WHY IT MATTERS MORE THAN IT LOOKS. Without a floor the cube and the cards
 * float at arbitrary heights and the eye has nothing to measure them against -
 * which is precisely how the earlier CSS attempt read as cards rather than
 * objects. Three tiers give the scene a ground, a sense of scale, and somewhere
 * for the one shadow to land.
 *
 * ROUNDED, NOT SHARP. RoundedBoxGeometry is used everywhere in this scene
 * rather than BoxGeometry: a hard 90-degree edge catches no highlight, so it
 * reads as flat shading no matter how good the environment is. The bevel is
 * what makes a silver surface look milled. It ships with three; confirmed in
 * the installed package before use.
 *
 * NOT A HARDWARE PRODUCT. The previous brief was explicit that this must not
 * resemble a device, a server or an appliance, so the tiers are a plinth: wide,
 * shallow, unbranded, with no panel lines, vents or seams.
 */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

type Tier = { w: number; h: number; d: number; y: number };

const TIERS: Tier[] = [
  { w: 4.6, h: 0.26, d: 3.0, y: -1.62 },
  { w: 3.7, h: 0.22, d: 2.4, y: -1.38 },
  { w: 2.75, h: 0.2, d: 1.8, y: -1.17 },
];

export function Platform({ quality }: { quality: 'full' | 'reduced' }) {
  const group = useRef<THREE.Group>(null);

  const geometries = useMemo(
    () => TIERS.map(t => new RoundedBoxGeometry(t.w, t.h, t.d, 4, 0.055)),
    [],
  );

  /* Extremely subtle: the brief allows the platform to move, and anything more
     than this reads as drifting rather than as life. */
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.012;
  });

  return (
    <group ref={group}>
      {TIERS.map((t, i) => (
        <mesh
          castShadow={quality === 'full' && i === TIERS.length - 1}
          geometry={geometries[i]}
          key={t.y}
          position={[0, t.y, 0]}
          receiveShadow={quality === 'full'}
        >
          {/* Brushed silver: metal enough to catch the environment, rough
              enough not to mirror it. A polished platform would compete with
              the glass above it. */}
          <meshStandardMaterial
            color="#e4e0ec"
            envMapIntensity={1.3}
            metalness={0.86}
            roughness={0.2 + i * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}
