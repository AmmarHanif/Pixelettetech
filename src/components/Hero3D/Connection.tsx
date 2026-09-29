'use client';

/**
 * A curved conduit from a card into the centre, with light travelling along it.
 *
 * A TUBE, NOT A LINE. Three's basic lines are one pixel wide whatever the
 * distance, which reads as a diagram overlay rather than as something in the
 * scene. A TubeGeometry along a quadratic curve has volume: it catches the
 * light, it goes behind the cube, and it gets thinner as it recedes. The brief
 * rules out flat CSS lines for exactly this reason.
 *
 * THE CURVE BOWS DOWNWARD ON PURPOSE. A straight run between two points reads
 * as a wire. Lifting the control point below the midline makes it fall toward
 * the platform and rise into the cube, which is the shape the reference has and
 * is what makes three of them read as converging rather than as spokes.
 *
 * THE TRAVELLING LIGHT IS A SMALL SPHERE ON THE CURVE, not a shader. One mesh
 * whose position is sampled from the curve each frame costs nothing, needs no
 * custom material, and cannot go wrong on a driver that dislikes something
 * clever. Its speed lifts when the card is engaged, which is the "increase
 * activity" the brief asks for.
 */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { BRAND, BRAND_LIGHT } from '@/content/hero-capabilities';

export function Connection({
  from,
  to,
  active,
  phase,
  quality,
  still,
}: {
  from: [number, number, number];
  to: [number, number, number];
  active: boolean;
  phase: number;
  quality: 'full' | 'reduced';
  /** prefers-reduced-motion: the travelling light stops dead at its own phase
      rather than slowing down. ADR-0051 names travelling lights specifically. */
  still: boolean;
}) {
  const pulse = useRef<THREE.Mesh>(null);
  const tube = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    // Below the straight line, and pulled slightly toward the viewer so the
    // conduit passes in front of the platform rather than through it.
    mid.y -= 0.42;
    mid.z += 0.35;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to]);

  const geo = useMemo(
    () => new THREE.TubeGeometry(curve, quality === 'full' ? 44 : 24, 0.03, 8, false),
    [curve, quality],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (pulse.current) {
      const speed = active ? 0.42 : 0.2;
      const u = still ? phase % 1 : (t * speed + phase) % 1;
      curve.getPointAt(u, pulse.current.position);
      const s = active ? 1.5 : 1;
      pulse.current.scale.setScalar(s);
    }
    if (tube.current) {
      const m = tube.current.material as THREE.MeshStandardMaterial;
      const want = active ? 1 : 0.85;
      m.opacity += (want - m.opacity) * 0.1;
      const e = active ? 5.2 : 3.6;
      m.emissiveIntensity += (e - m.emissiveIntensity) * 0.1;
    }
  });

  return (
    <group>
      <mesh geometry={geo} ref={tube}>
        <meshStandardMaterial
          color={BRAND_LIGHT}
          emissive={BRAND}
          emissiveIntensity={1.1}
          opacity={0.85}
          roughness={0.5}
          toneMapped={false}
          transparent
        />
      </mesh>

      <mesh ref={pulse}>
        <sphereGeometry args={[0.052, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={BRAND_LIGHT}
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
