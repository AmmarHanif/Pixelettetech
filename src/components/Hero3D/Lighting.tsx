'use client';

/**
 * Studio lighting, and the environment that makes glass look like glass.
 *
 * THE ENVIRONMENT IS THE IMPORTANT PART, not the lights. A transmissive
 * material refracts whatever is around it, so with nothing around it a glass
 * cube renders as a grey lump however many lamps you point at it. RoomEnvironment
 * builds a small studio - bright panels above, softer walls around - and
 * PMREMGenerator turns it into the pre-filtered map the material samples. That
 * is where the white-and-silver product-render look actually comes from.
 *
 * IT SHIPS WITH THREE AND COSTS NO DOWNLOAD. RoomEnvironment is procedural
 * geometry, not an HDR file, so there is no texture to fetch, nothing to block
 * the hero, and no large asset in the bundle. Confirmed present in the
 * installed package before this was written rather than assumed.
 *
 * ONE SHADOW-CASTING LIGHT, DELIBERATELY. Real-time shadows are the most
 * expensive thing in a scene this size and the brief rules out expensive ones.
 * A single directional light casts onto the platform, at a small map size,
 * which is enough for the soft contact shadow under the cube and nothing more.
 */

import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { BRAND_LIGHT } from './services';

export function Lighting({ quality }: { quality: 'full' | 'reduced' }) {
  const { gl, scene } = useThree();

  const envMap = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    return env.texture;
  }, [gl]);

  useEffect(() => {
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
    };
  }, [scene, envMap]);

  return (
    <>
      {/* Fill, so nothing reads as black in the shadowed faces - but 0.4, not
          the 0.55 this started at. The scene is white geometry on a white page,
          and generous fill is exactly what flattens it: every face lands within
          a few percent of every other and the silhouette stops reading as
          solid. Contrast is what makes it look three-dimensional. */}
      <ambientLight intensity={0.4} />

      {/* The key. The only light that casts, and onto a small map. */}
      <directionalLight
        castShadow={quality === 'full'}
        intensity={1.9}
        position={[3.2, 5.4, 3.6]}
        shadow-bias={-0.0015}
        shadow-camera-bottom={-4}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-mapSize-height={quality === 'full' ? 1024 : 512}
        shadow-mapSize-width={quality === 'full' ? 1024 : 512}
      />

      {/* A cool rim from behind, which is what separates white glass from a
          white background without adding any glow. */}
      <directionalLight intensity={0.6} position={[-4, 2.2, -3]} />

      {/* The accent, and the only coloured light in the scene. Low intensity:
          purple is an accent here, not a wash. */}
      <pointLight color={BRAND_LIGHT} distance={9} intensity={9} position={[0, 0.2, 1.1]} />

      {/* A second accent BEHIND the centre, which rims the glass edges in brand
          colour from the far side. This is the one that makes the cube read as
          an object with a back to it rather than a pale square. */}
      <pointLight color={BRAND_LIGHT} distance={7} intensity={6} position={[-0.4, 0.9, -2.2]} />
    </>
  );
}
