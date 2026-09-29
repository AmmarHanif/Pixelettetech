'use client';

/**
 * Scene contents: light, the office, the floor hotspots, and the camera.
 *
 * THE LIGHTING IS CHEAP ON PURPOSE. One shadow-casting directional standing in
 * for the window wall, a hemisphere for sky and bounce, and two dim fills so the
 * depth of the plan does not go black. The ceiling fittings are emissive
 * geometry and cast no light at all - nine real ceiling lights would look barely
 * different and cost a great deal more. The brief asks for high-quality
 * real-time product visualisation rather than offline architectural CGI, and
 * this is where that line actually gets drawn.
 *
 * HOTSPOTS ARE PART OF THE FLOOR. Flat rings lying on the carpet at the places
 * the visitor can move to, in restrained brand purple, brightening slightly on
 * hover. They are markers in the room, not badges floating over it.
 */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { CameraRig } from './CameraRig';
import type { PointerState } from './CameraRig';
import { Office } from './Office';
import type { Viewpoint } from './viewpoints';
import { VIEWPOINTS } from './viewpoints';

const BRAND = '#8b3fc0';

function Hotspot({
  at,
  active,
  still,
  onSelect,
  label,
}: {
  at: [number, number, number];
  active: boolean;
  still: boolean;
  onSelect: () => void;
  label: string;
}) {
  const [hover, setHover] = useState(false);
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const m = ring.current.material as THREE.MeshBasicMaterial;
    const base = active ? 0.62 : hover ? 0.55 : 0.3;
    // A slow breath, and only when motion is welcome.
    const pulse = still ? 0 : Math.sin(clock.elapsedTime * 1.6) * 0.06;
    m.opacity += (base + pulse - m.opacity) * 0.12;
  });

  return (
    <group position={at}>
      <mesh
        onClick={e => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOut={() => setHover(false)}
        onPointerOver={() => setHover(true)}
        ref={ring}
        rotation={[-Math.PI / 2, 0, 0]}
        userData={{ label }}
      >
        <ringGeometry args={[0.34, 0.46, 40]} />
        <meshBasicMaterial color={BRAND} opacity={0.3} side={THREE.DoubleSide} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.1, 20]} />
        <meshBasicMaterial color={BRAND} opacity={hover ? 0.7 : 0.45} transparent />
      </mesh>
    </group>
  );
}

export function Scene({
  viewpoint,
  setViewpoint,
  pointer,
  zoom,
  still,
  quality,
}: {
  viewpoint: Viewpoint;
  setViewpoint: (v: Viewpoint) => void;
  pointer: PointerState;
  zoom: { current: number };
  still: boolean;
  quality: 'full' | 'reduced';
}) {
  /* Where a visitor can move to. The overview is deliberately not a floor
     marker: it is a position above the room, so there is nowhere to stand. */
  const spots = useMemo(
    () =>
      VIEWPOINTS.filter(v => v.id !== 'overview').map(v => ({
        v,
        at: [v.position[0], 0.015, v.position[2]] as [number, number, number],
      })),
    [],
  );

  return (
    <>
      {/* Bright. The first pass was lit like a dusk interior: correct in
          physics, wrong for an office at 11am, which is what the reference
          shows. Sky and bounce do most of the work. */}
      <hemisphereLight args={['#f2f7ff', '#6a6a72', 1.45]} />
      {/* the window wall, standing in for daylight */}
      <directionalLight
        castShadow={quality === 'full'}
        intensity={2.4}
        position={[-14, 9, 4]}
        shadow-bias={-0.0012}
        shadow-camera-bottom={-10}
        shadow-camera-far={44}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={10}
        shadow-mapSize-height={quality === 'full' ? 1024 : 512}
        shadow-mapSize-width={quality === 'full' ? 1024 : 512}
      />
      <directionalLight intensity={0.5} position={[8, 6, 6]} />
      {/* Fill from the depth of the plan, so the far end does not fall away. */}
      <directionalLight intensity={0.3} position={[2, 4, -12]} />
      <ambientLight intensity={0.55} />

      <Office />

      {spots.map(s => (
        <Hotspot
          active={s.v.id === viewpoint.id}
          at={s.at}
          key={s.v.id}
          label={s.v.label}
          onSelect={() => setViewpoint(s.v)}
          still={still}
        />
      ))}

      <CameraRig pointer={pointer} still={still} viewpoint={viewpoint} zoom={zoom} />
    </>
  );
}
