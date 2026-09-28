'use client';

/**
 * One capability, as a glass slab standing on a small plinth.
 *
 * THE SLAB IS 3D AND THE TEXT IS NOT. The card here is geometry - it refracts,
 * catches the environment, casts a shadow and moves in perspective. Its title,
 * line and icon are DOM, drawn over it by the overlay and kept in register by
 * projecting this object's position every frame. That split is deliberate: the
 * glass needs to be real to look real, and the words need to be real DOM to be
 * crisp, selectable, translatable, readable by a screen reader, and present if
 * WebGL never starts.
 *
 * A STAND, NOT A HOVER. Each slab sits on a short post and a base pad, the way
 * the reference does. The earlier CSS attempt had panels floating at arbitrary
 * heights with nothing under them, which is most of why it read as cards on a
 * page rather than objects in a room.
 *
 * HOVER IS DRIVEN FROM OUTSIDE. The pointer target is the DOM anchor in the
 * overlay, because that also gives keyboard focus and a real link for free.
 * This component just receives `active` and animates toward it.
 */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import type { Service } from './services';

const CARD_W = 1.55;
const CARD_H = 0.92;
const CARD_D = 0.1;

export function ServiceCard({
  service,
  active,
  index,
  quality,
  still,
  onAnchor,
}: {
  service: Service;
  active: boolean;
  index: number;
  quality: 'full' | 'reduced';
  /** prefers-reduced-motion: the idle drift stops. The hover lift does not -
      that is a response to the visitor, not motion the page starts by itself. */
  still: boolean;
  /** Reports the slab's world position each frame so the overlay can track it. */
  onAnchor: (id: string, v: THREE.Vector3) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const slab = useRef<THREE.Mesh>(null);
  const anchor = useMemo(() => new THREE.Vector3(), []);

  const slabGeo = useMemo(() => new RoundedBoxGeometry(CARD_W, CARD_H, CARD_D, 5, 0.06), []);
  const padGeo = useMemo(() => new RoundedBoxGeometry(0.62, 0.05, 0.42, 3, 0.02), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;

    // Each card drifts on its own phase, so they never pulse in unison.
    const drift = still ? 0 : Math.sin(t * 0.5 + index * 1.9) * 0.035;
    const lift = active ? 0.13 : 0;
    const target = service.position[1] + drift + lift;
    group.current.position.y += (target - group.current.position.y) * 0.09;

    // Toward the viewer on hover, which is what the brief asks for, and small.
    const zTarget = service.position[2] + (active ? 0.22 : 0);
    group.current.position.z += (zTarget - group.current.position.z) * 0.09;

    const s = active ? 1.035 : 1;
    group.current.scale.x += (s - group.current.scale.x) * 0.12;
    group.current.scale.y += (s - group.current.scale.y) * 0.12;
    group.current.scale.z += (s - group.current.scale.z) * 0.12;

    if (slab.current) {
      const m = slab.current.material as THREE.MeshPhysicalMaterial;
      // The edge lifts on hover rather than the whole surface brightening,
      // which keeps the white reading as white.
      const want = active ? 0.34 : 0.1;
      m.emissiveIntensity += (want - m.emissiveIntensity) * 0.1;
    }

    group.current.getWorldPosition(anchor);
    onAnchor(service.id, anchor);
  });

  return (
    <group
      position={service.position}
      ref={group}
      rotation={[0, service.rotationY, 0]}
    >
      <mesh castShadow={quality === 'full'} geometry={slabGeo} ref={slab}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#ffffff"
          emissive="#8a3fbe"
          emissiveIntensity={0.1}
          envMapIntensity={1.25}
          ior={1.4}
          metalness={0}
          roughness={0.1}
          thickness={0.8}
          /* 0.6, not 0.82. The slab is the reading surface for the DOM title
             and line drawn over it, and at 0.82 the hero's own background came
             through strongly enough to wash out 11px muted text. This keeps the
             refraction and the clearcoat sheen while leaving something to read
             against. */
          transmission={0.6}
          transparent
        />
      </mesh>

      {/* the stand: a post down to a pad, so the slab is supported rather than
          suspended */}
      <mesh position={[0, -CARD_H / 2 - 0.16, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.3, 10]} />
        <meshStandardMaterial color="#e6e2ee" metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh
        castShadow={quality === 'full'}
        geometry={padGeo}
        position={[0, -CARD_H / 2 - 0.33, 0]}
      >
        <meshStandardMaterial color="#efedf4" metalness={0.8} roughness={0.26} />
      </mesh>
    </group>
  );
}

export const CARD_SIZE = { w: CARD_W, h: CARD_H, d: CARD_D };
