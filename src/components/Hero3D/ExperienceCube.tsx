'use client';

/**
 * The centre: a glass cube with a lit lattice inside it.
 *
 * THE LATTICE HAS TO BE SEEN THROUGH THE SHELL, which is the whole difficulty.
 * The first build had one and it was invisible: thin lines at 0.34 opacity,
 * behind a shell at 0.94 transmission, with no bloom to carry them. It read as
 * a frosted box. Three things fix it and all three are needed - the lines are
 * emissive and excluded from tone mapping so they stay bright, a second inner
 * cage gives the structure depth rather than a single wireframe, and the bloom
 * pass throws a halo that survives the refraction.
 *
 * THE CORE IS A LIGHT, NOT A BALL. It is emissive, untonemapped, and a real
 * pointLight sits inside it in the rig, so the cube is lit from within and the
 * surrounding glass picks the colour up.
 *
 * THE WORDS ARE NOT IN HERE. "Experience" and its line are DOM in the overlay.
 * Text rendered into WebGL is blurry at this size, unselectable, invisible to a
 * screen reader, and gone if the canvas fails.
 */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { Lattice } from './Lattice';
import { BRAND_LIGHT, CENTRE } from './services';

const SIZE = 1.42;

export function ExperienceCube({
  active,
  quality,
  still,
  onAnchor,
}: {
  active: boolean;
  quality: 'full' | 'reduced';
  /** prefers-reduced-motion: the float, the lattice spin and the core's breath
      all stop. The lift on hover stays, being the visitor's own doing. */
  still: boolean;
  /** Reports the cube's real world position each frame, exactly as the cards
      do. Reporting the constant it was declared at instead leaves the label
      still while the cube floats beneath it, and the register visibly slips. */
  onAnchor: (id: string, v: THREE.Vector3) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const lattice = useRef<THREE.Group>(null);
  const anchor = useMemo(() => new THREE.Vector3(), []);

  const shell = useMemo(() => new RoundedBoxGeometry(SIZE, SIZE, SIZE, 6, 0.13), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      // The float. Slow, small, and never enough to break the silhouette.
      group.current.position.y =
        CENTRE.position[1] + (still ? 0 : Math.sin(t * 0.55) * 0.055);
      group.current.rotation.y = still ? 0 : Math.sin(t * 0.22) * 0.06;
      group.current.getWorldPosition(anchor);
      onAnchor('centre', anchor);
    }
    if (lattice.current) lattice.current.rotation.y = still ? 0 : t * 0.09;
    if (core.current) {
      const m = core.current.material as THREE.MeshStandardMaterial;
      // Breathes, and lifts when a capability is engaged: the centre responds
      // to the edge, which is the relationship the whole scene is about.
      const base = still ? 1.9 : 1.9 + Math.sin(t * 0.9) * 0.35;
      m.emissiveIntensity += ((active ? base * 1.7 : base) - m.emissiveIntensity) * 0.08;
    }
  });

  return (
    <group position={CENTRE.position} ref={group}>
      {/* the shell */}
      <mesh castShadow={quality === 'full'} geometry={shell}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.06}
          /* Tinted, not white. White glass in a white scene has nothing to
             show; the tint is what makes it read as a material. */
          color="#e8dcf8"
          envMapIntensity={1.9}
          ior={1.32}
          iridescence={0.4}
          iridescenceIOR={1.9}
          metalness={0}
          reflectivity={0.45}
          roughness={0.04}
          specularIntensity={1}
          /* Thin and only partly transmissive ON PURPOSE. At thickness 1.4 and
             transmission 0.92 the refraction smeared the interior into a pale
             blob and the lattice inside it simply disappeared. Glass you cannot
             see into is just a frosted box. */
          thickness={0.36}
          transmission={0.52}
          transparent
        />
      </mesh>

      {/* the structure inside it, as real bars - see Lattice.tsx for why a
          wireframe could not work here */}
      <group ref={lattice}>
        <Lattice />
      </group>

      {/* the light within */}
      <mesh ref={core}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={BRAND_LIGHT}
          emissiveIntensity={2.6}
          roughness={1}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
