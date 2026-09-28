'use client';

/**
 * One capability: a tinted glass panel standing on a chrome plate.
 *
 * THE PANEL IS 3D AND THE TEXT IS NOT. The panel is geometry - it refracts,
 * catches the environment, casts a shadow and moves in perspective. Its title,
 * line and icon are DOM, drawn over it by the overlay and kept in register by
 * projecting this object's position every frame. The glass needs to be real to
 * look real; the words need to be real DOM to be crisp, selectable,
 * translatable, readable by a screen reader, and present if WebGL never starts.
 *
 * THE PANEL IS WIDER THAN IT LOOKS IT NEEDS TO BE, DELIBERATELY. The DOM label
 * drawn over it is 165px, and a rotated panel projects NARROWER than its own
 * width - 1.55 units at a 0.3rad yaw covered about 137px, so the text visibly
 * overhung the glass on both sides. The panel is now sized so the label sits
 * inside it at the scene's working scale.
 *
 * THE PLATE IS CHROME, AND THAT IS THE CONTRAST. The first build stood each
 * panel on a pale grey post barely distinguishable from the panel above it, and
 * the whole scene turned into one grey mass. A polished metal plate under white
 * glass is what separates the two and gives the environment something to
 * mirror.
 *
 * HOVER IS DRIVEN FROM OUTSIDE. The pointer target is the DOM anchor in the
 * overlay, because that also gives keyboard focus and a real link for free.
 */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { BRAND, BRAND_LIGHT } from './services';
import type { Service } from './services';

const CARD_W = 1.95;
const CARD_H = 1.12;
const CARD_D = 0.11;

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
  /** Reports the panel's world position each frame so the overlay can track it. */
  onAnchor: (id: string, v: THREE.Vector3) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const rim = useRef<THREE.Mesh>(null);
  const anchor = useMemo(() => new THREE.Vector3(), []);

  const slabGeo = useMemo(() => new RoundedBoxGeometry(CARD_W, CARD_H, CARD_D, 6, 0.075), []);
  /* The lit edge. THIN, and set BEHIND the panel so only a sliver shows around
     the outside. The first version made this as deep as the panel itself, so it
     wrapped the whole thing and the entire surface bloomed - that, not the
     bloom settings alone, is why the scene turned into a haze. A border has to
     be a border. */
  const rimGeo = useMemo(
    () => new RoundedBoxGeometry(CARD_W + 0.055, CARD_H + 0.055, 0.02, 6, 0.09),
    [],
  );
  const plateGeo = useMemo(() => new RoundedBoxGeometry(0.92, 0.055, 0.5, 4, 0.022), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;

    // Each panel drifts on its own phase, so they never pulse in unison.
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

    if (rim.current) {
      const m = rim.current.material as THREE.MeshStandardMaterial;
      // The EDGE lifts on hover rather than the whole surface brightening,
      // which keeps the white glass reading as white.
      const want = active ? 2.2 : 1.1;
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
      {/* the lit edge, behind the glass */}
      <mesh geometry={rimGeo} position={[0, 0, -CARD_D / 2 - 0.004]} ref={rim}>
        <meshStandardMaterial
          color={BRAND_LIGHT}
          emissive={BRAND_LIGHT}
          emissiveIntensity={1.1}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* the panel */}
      <mesh castShadow={quality === 'full'} geometry={slabGeo}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.07}
          color="#f2ecfb"
          envMapIntensity={1.7}
          ior={1.46}
          iridescence={0.25}
          iridescenceIOR={1.8}
          metalness={0}
          reflectivity={0.5}
          roughness={0.07}
          thickness={0.95}
          /* 0.55, not 0.82. The panel is the reading surface for the DOM title
             and line drawn over it; above about 0.6 the page behind came
             through strongly enough to wash out 11px muted text. */
          transmission={0.55}
          transparent
        />
      </mesh>

      {/* the stand: a short neck down to a polished plate */}
      <mesh position={[0, -CARD_H / 2 - 0.15, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.3, 12]} />
        <meshStandardMaterial color="#a49dba" metalness={1} roughness={0.1} />
      </mesh>
      <mesh
        castShadow={quality === 'full'}
        geometry={plateGeo}
        position={[0, -CARD_H / 2 - 0.32, 0]}
      >
        <meshStandardMaterial
          color="#9a93b0"
          envMapIntensity={2.6}
          metalness={1}
          roughness={0.06}
        />
      </mesh>

      {/* a small brand node where the conduit meets the panel */}
      <mesh position={[0, -CARD_H / 2 + 0.04, CARD_D / 2 + 0.02]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={BRAND}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export const CARD_SIZE = { w: CARD_W, h: CARD_H, d: CARD_D };
