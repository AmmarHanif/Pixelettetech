'use client';

/**
 * The grid inside the cube, built from real bars.
 *
 * WHY NOT A WIREFRAME. Two attempts used WireframeGeometry and LineSegments and
 * both were invisible in the finished render. WebGL lines are one pixel wide and
 * `linewidth` is ignored by every desktop driver, so a wireframe cannot be made
 * to read through tinted glass no matter what colour it is - and seen through a
 * transmissive shell it blurs away entirely. The reference's cube has a solid,
 * lit internal structure, and the only way to get one is to build it from
 * geometry that has thickness.
 *
 * ONE DRAW CALL, NOT FORTY-EIGHT. An InstancedMesh draws every bar in a single
 * call, so a structure that would otherwise be dozens of meshes costs about the
 * same as one. The transforms are written once at mount.
 *
 * IT IS EMISSIVE AND EXCLUDED FROM TONE MAPPING, so it stays above the bloom
 * threshold and glows rather than being flattened with the rest of the scene.
 */

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { BRAND } from './services';

/** Grid lines per axis. 3 gives a 2x2x2 cell structure, which reads as a
    lattice; more turns to mush once the shell refracts it. */
const LINES = 3;

export function Lattice({ size = 0.96, bar = 0.016 }: { size?: number; bar?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const offsets = useMemo(() => {
    const o: number[] = [];
    for (let i = 0; i < LINES; i++) o.push((i / (LINES - 1) - 0.5) * size);
    return o;
  }, [size]);

  // Bars along each of the three axes, at every intersection of the other two.
  const count = 3 * offsets.length * offsets.length;

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    let i = 0;
    for (const a of offsets) {
      for (const b of offsets) {
        // along X
        dummy.position.set(0, a, b);
        dummy.rotation.set(0, 0, Math.PI / 2);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
        // along Y
        dummy.position.set(a, 0, b);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
        // along Z
        dummy.position.set(a, b, 0);
        dummy.rotation.set(Math.PI / 2, 0, 0);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, [offsets]);

  return (
    <instancedMesh args={[undefined, undefined, count]} ref={mesh}>
      <cylinderGeometry args={[bar, bar, size, 6]} />
      {/* Saturated, and bright. Seen through the shell the colour washes out,
          so a value that looks right in isolation arrives on screen as grey -
          at 1.15 this rendered as a white cage. The tint has to be pushed past
          what looks correct unlit. */}
      <meshStandardMaterial
        color={BRAND}
        emissive={BRAND}
        emissiveIntensity={2.6}
        metalness={0.2}
        roughness={0.3}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
