'use client';

/**
 * The central glass cube: the focal point, and the thing the composition argues for.
 *
 * GLASS WITHOUT DREI. MeshPhysicalMaterial has carried `transmission` in core
 * three since r132, and with `thickness`, `ior` and `clearcoat` it is real
 * refraction rather than a transparency trick. Drei's MeshTransmissionMaterial
 * adds a separate render pass and looks slightly richer; for a restrained
 * hero - the brief says elegant and minimal, and not to overdo the glow - the
 * difference is not worth 48 extra packages.
 *
 * THREE NESTED PARTS, AND EACH DOES A JOB. The shell refracts. The lattice
 * inside is what makes it read as a volume rather than an empty box, and it is
 * INSIDE the shell so the refraction distorts it, which is the detail that sells
 * the glass. The core is the light source: an emissive sphere, so the glow comes
 * from within the object rather than from a lamp pointed at it.
 *
 * NO TEXT IN HERE. The label and the line are DOM, positioned over the cube by
 * the overlay. Text rendered into WebGL is blurry at small sizes, unselectable,
 * invisible to a screen reader, and gone entirely if the canvas fails - and the
 * brief says in terms not to put essential copy exclusively inside WebGL.
 */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { BRAND, BRAND_LIGHT, CENTRE } from './services';

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
  const lattice = useRef<THREE.LineSegments>(null);
  const anchor = useMemo(() => new THREE.Vector3(), []);

  const shell = useMemo(() => new RoundedBoxGeometry(1.5, 1.5, 1.5, 6, 0.14), []);

  /* A wireframe lattice, built once. Three divisions is enough to read as
     structure; more becomes a mesh of noise once refraction blurs it. */
  const latticeGeo = useMemo(() => {
    const box = new THREE.BoxGeometry(1.02, 1.02, 1.02, 3, 3, 3);
    const wire = new THREE.WireframeGeometry(box);
    box.dispose();
    return wire;
  }, []);

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
      const base = still ? 1.5 : 1.5 + Math.sin(t * 0.9) * 0.25;
      m.emissiveIntensity += ((active ? base * 2.1 : base) - m.emissiveIntensity) * 0.08;
    }
  });

  return (
    <group position={CENTRE.position} ref={group}>
      {/* the shell */}
      <mesh castShadow={quality === 'full'} geometry={shell}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.08}
          color="#ffffff"
          envMapIntensity={1.4}
          ior={1.42}
          metalness={0}
          reflectivity={0.42}
          roughness={0.06}
          specularIntensity={1}
          thickness={1.1}
          transmission={0.94}
          transparent
        />
      </mesh>

      {/* the structure inside it */}
      <lineSegments geometry={latticeGeo} ref={lattice}>
        <lineBasicMaterial color={BRAND_LIGHT} opacity={0.34} transparent />
      </lineSegments>

      {/* the light within */}
      <mesh ref={core}>
        <sphereGeometry args={[0.34, 20, 20]} />
        <meshStandardMaterial
          color={BRAND_LIGHT}
          emissive={BRAND}
          emissiveIntensity={1.5}
          roughness={1}
          toneMapped={false}
          transparent
          opacity={0.75}
        />
      </mesh>
    </group>
  );
}
