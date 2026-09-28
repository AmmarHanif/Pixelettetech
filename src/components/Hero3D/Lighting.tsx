'use client';

/**
 * The light rig, and the environment the glass actually reflects.
 *
 * WHY NOT RoomEnvironment. The first build used three's RoomEnvironment, which
 * is a neutral grey studio box. Glass has almost nothing to show except what is
 * around it, so a grey box produced grey glass - and that, more than any
 * material setting, is why the first attempt read as flat plastic. This builds
 * a small environment of its own: a warm source high on one side, a cool one
 * opposite, and a bright floor. The panels then carry a warm edge and a cool
 * one, which is what makes a curved glass edge legible at all.
 *
 * IT IS RENDERED ONCE, NOT EVERY FRAME. PMREMGenerator converts the little
 * scene into a prefiltered cube map at mount; the scene itself is thrown away
 * immediately and never rendered again.
 *
 * ACES ON THE RENDERER, APPLIED AT THE END. Tone mapping is set here but
 * performed by OutputPass at the end of the post chain, so bloom is mapped once
 * rather than twice.
 */

import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

import { BRAND, BRAND_LIGHT } from '@/content/hero-capabilities';

/** A few emissive planes, PMREM'd into a reflection map. */
function buildEnvironmentScene() {
  const scene = new THREE.Scene();
  const geo = new THREE.PlaneGeometry(1, 1);

  const panel = (
    colour: string,
    intensity: number,
    position: [number, number, number],
    scale: [number, number, number],
    lookAt: [number, number, number] = [0, 0, 0],
  ) => {
    const m = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: new THREE.Color(colour).multiplyScalar(intensity) }),
    );
    m.position.set(...position);
    m.scale.set(...scale);
    m.lookAt(new THREE.Vector3(...lookAt));
    scene.add(m);
    return m;
  };

  /* The room. A VERTICAL GRADIENT rather than a flat colour: a uniform box
     returns the same value from every angle, so curved glass edges have nothing
     to sweep through and the material reads as plastic. The gradient is what
     makes an edge travel from warm to cool as it curves. */
  const sky = document.createElement('canvas');
  sky.width = 4;
  sky.height = 64;
  const sctx = sky.getContext('2d');
  if (sctx) {
    const g = sctx.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, '#fffaf2');
    g.addColorStop(0.45, '#efeaf8');
    g.addColorStop(0.75, '#ded3ef');
    g.addColorStop(1, '#c9b4e0');
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 4, 64);
  }
  const skyTex = new THREE.CanvasTexture(sky);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  scene.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(14, 10, 14),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide }),
    ),
  );

  /* THESE VALUES WERE TAKEN TOO FAR ONCE AND THE SCENE BLEW OUT.
     At 7 / 14 / 5.5 the panels rendered near-white, the lattice inside the cube
     disappeared for the second time and the plinth became a flat purple wash -
     an environment bright enough to light glass beautifully is also bright
     enough to erase everything inside it. These are the values that hold
     structure. Raise them only against a rendered capture, never by eye. */
  // The warm key, high and to the right - the window in the reference.
  panel('#fff2dc', 4, [3.4, 3.2, 2.2], [5.5, 4.5, 1]);
  // A smaller, hotter source, which gives a highlight a hard core.
  panel('#ffffff', 6, [2.2, 3.6, 3], [1.4, 1.4, 1]);
  // The cool fill, opposite, so edges facing away are not dead grey.
  panel('#d6e4ff', 1.9, [-4, 2.2, -1.6], [5, 4, 1]);
  // A bright floor, which is what puts a highlight along the bottom of glass.
  panel('#ffffff', 1.3, [0, -2.6, 0], [9, 9, 1], [0, 10, 0]);
  // Brand bounce, low and behind, so the glass carries the palette.
  panel(BRAND_LIGHT, 2.6, [0, -0.4, -3.4], [7, 3.5, 1]);
  panel(BRAND, 1.8, [-2.6, -1, 1.6], [4, 3, 1]);

  return scene;
}

export function Lighting({ quality }: { quality: 'full' | 'reduced' }) {
  const { gl, scene } = useThree();

  const envMap = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const source = buildEnvironmentScene();
    const target = pmrem.fromScene(source, 0.03);
    pmrem.dispose();
    source.traverse(o => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) (m.material as THREE.Material).dispose();
    });
    return target.texture;
  }, [gl]);

  useEffect(() => {
    scene.environment = envMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    return () => {
      scene.environment = null;
      envMap.dispose();
    };
  }, [scene, gl, envMap]);

  return (
    <>
      {/* Low: the environment is doing most of the work now, and piling ambient
          on top of it is what flattens the shading. */}
      <ambientLight intensity={0.22} />

      {/* The key, and the only light that casts. */}
      <directionalLight
        castShadow={quality === 'full'}
        intensity={2.1}
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

      {/* A cool rim from behind, which separates white glass from a white page. */}
      <directionalLight intensity={0.75} position={[-4, 2.2, -3]} />

      {/* Brand accents. The first sits inside the centre and lights the cube
          from within; the second rims everything from behind. */}
      <pointLight color={BRAND_LIGHT} distance={7} intensity={11} position={[0, 0.25, 0.4]} />
      <pointLight color={BRAND_LIGHT} distance={8} intensity={7} position={[-0.4, 1, -2.4]} />
    </>
  );
}
