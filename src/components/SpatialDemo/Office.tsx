'use client';

/**
 * The office, built from original geometry.
 *
 * WHY IT IS MODELLED HERE RATHER THAN LOADED AS A GLB. The brief allows an
 * optimised glTF environment and also rules that an asset whose commercial-use
 * rights cannot be established must not be used. Asset hosts are unreachable
 * from this environment - tested, not assumed: a fetch of a model library
 * returns a blocked-host refusal - so no third-party licence can be read, let
 * alone recorded. Geometry authored here is original work with no licence
 * question at all, which is the only route that satisfies both rules.
 *
 * IT IS AN ORDINARY OFFICE ON PURPOSE. The brief rules out the billionaire
 * penthouse, the laboratory and the architectural showroom. So: a 18m x 14m
 * floor plate, 2.9m ceiling, bench desks with task chairs, a glazed meeting
 * room, a tea point, storage, plants, and a glazed elevation on one side.
 * Proportions are in metres and are the ones a real fit-out would use - 720mm
 * desk height, 450mm seat height, 2.1m door height - because that is most of
 * what makes an interior read as believable rather than as a toy.
 *
 * REPEATED ITEMS ARE INSTANCED. Chairs, monitors, desk legs and ceiling
 * fittings are drawn as instanced meshes, so twenty chairs cost one draw call
 * rather than twenty. Geometries and materials are created once and shared.
 *
 * NOTHING IN HERE IS BRANDED, AND NOTHING SPELLS ANYTHING. No posters, no
 * screens with fake interfaces, no logos, no text of any kind. The brief asks
 * for a demonstration of spatial experience, and lettering generated into a
 * scene is exactly what makes an environment look synthetic.
 */

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { carpetTexture, ceilingTexture, timberTexture, wallTexture } from './textures';

/* Dimensions, in metres. Everything else is derived from these. */
const ROOM = { x: 9, z: 7, h: 2.9 };
const DESK_H = 0.72;
const SEAT_H = 0.45;

/* ------------------------------------------------------------- materials -- */

function useMaterials() {
  return useMemo(() => {
    const m = {
      carpet: new THREE.MeshStandardMaterial({ map: carpetTexture(), roughness: 0.96 }),
      timber: new THREE.MeshStandardMaterial({ map: timberTexture(), roughness: 0.5 }),
      wall: new THREE.MeshStandardMaterial({ map: wallTexture(), roughness: 0.92 }),
      /* A LITTLE EMISSIVE, DELIBERATELY. A ceiling is the brightest surface in a
         real office, but the only strong light here stands outside the window
         wall and cannot reach the underside of a ceiling plane - so it rendered
         dark grey, which is the single thing that most made the first build read
         as a model rather than a room. This floors it at near-white without
         adding a light. */
      ceiling: new THREE.MeshStandardMaterial({
        map: ceilingTexture(),
        roughness: 1,
        emissive: '#ffffff',
        emissiveIntensity: 0.38,
      }),
      deskTop: new THREE.MeshStandardMaterial({ color: '#d3b085', roughness: 0.55 }),
      frame: new THREE.MeshStandardMaterial({ color: '#33333a', roughness: 0.5, metalness: 0.35 }),
      fabric: new THREE.MeshStandardMaterial({ color: '#41424a', roughness: 0.95 }),
      screen: new THREE.MeshStandardMaterial({ color: '#1d1e23', roughness: 0.35 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#dfe7ea',
        roughness: 0.04,
        metalness: 0,
        transmission: 0.92,
        thickness: 0.02,
        transparent: true,
        opacity: 0.35,
      }),
      leaf: new THREE.MeshStandardMaterial({ color: '#4f7a4a', roughness: 0.85 }),
      pot: new THREE.MeshStandardMaterial({ color: '#cfc9c0', roughness: 0.8 }),
      light: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#fffaf0',
        emissiveIntensity: 1.6,
        toneMapped: false,
      }),
      steel: new THREE.MeshStandardMaterial({ color: '#b9bcc2', roughness: 0.3, metalness: 0.8 }),
      worktop: new THREE.MeshStandardMaterial({ color: '#3b3d42', roughness: 0.4 }),
    };
    return m;
  }, []);
}

/* --------------------------------------------------------------- shell ---- */

function Shell({ mat }: { mat: ReturnType<typeof useMaterials> }) {
  return (
    <group>
      {/* carpet over the working floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0, 0]}>
        <planeGeometry args={[13.5, ROOM.z * 2]} />
        <primitive attach="material" object={mat.carpet} />
      </mesh>
      {/* timber circulation strip down the right-hand side */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[6.3, 0.001, 0]}>
        <planeGeometry args={[5.4, ROOM.z * 2]} />
        <primitive attach="material" object={mat.timber} />
      </mesh>

      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.h, 0]}>
        <planeGeometry args={[ROOM.x * 2, ROOM.z * 2]} />
        <primitive attach="material" object={mat.ceiling} />
      </mesh>

      {/* back wall, right wall, entrance wall */}
      <mesh receiveShadow position={[0, ROOM.h / 2, -ROOM.z]}>
        <boxGeometry args={[ROOM.x * 2, ROOM.h, 0.12]} />
        <primitive attach="material" object={mat.wall} />
      </mesh>
      <mesh receiveShadow position={[ROOM.x, ROOM.h / 2, 0]}>
        <boxGeometry args={[0.12, ROOM.h, ROOM.z * 2]} />
        <primitive attach="material" object={mat.wall} />
      </mesh>
      <mesh position={[0, ROOM.h / 2, ROOM.z]}>
        <boxGeometry args={[ROOM.x * 2, ROOM.h, 0.12]} />
        <primitive attach="material" object={mat.wall} />
      </mesh>

      {/* Beyond the glass: a bright plane standing in for outside. Without it
          the window returns flat grey and the room looks lit from nowhere. It is
          plain sky rather than a painted skyline, because a generated cityscape
          is exactly the kind of detail that starts looking synthetic. */}
      <mesh position={[-ROOM.x - 2.2, ROOM.h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM.z * 2.6, ROOM.h * 2.4]} />
        <meshBasicMaterial color="#eef4fb" toneMapped={false} />
      </mesh>

      {/* the glazed elevation: mullions with glass between, which is what makes
          the daylight read as coming from a window wall rather than nowhere */}
      <group position={[-ROOM.x, 0, 0]}>
        <mesh position={[0, ROOM.h / 2, 0]}>
          <boxGeometry args={[0.06, ROOM.h, ROOM.z * 2]} />
          <primitive attach="material" object={mat.glass} />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0.02, ROOM.h / 2, -ROOM.z + 0.2 + i * 1.7]}>
            <boxGeometry args={[0.1, ROOM.h, 0.07]} />
            <primitive attach="material" object={mat.frame} />
          </mesh>
        ))}
        {/* cill and head rails */}
        <mesh position={[0.02, 0.42, 0]}>
          <boxGeometry args={[0.14, 0.06, ROOM.z * 2]} />
          <primitive attach="material" object={mat.frame} />
        </mesh>
        <mesh position={[0.02, ROOM.h - 0.05, 0]}>
          <boxGeometry args={[0.14, 0.08, ROOM.z * 2]} />
          <primitive attach="material" object={mat.frame} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------ furniture --- */

/** One bench run: a shared top on a steel frame, with returns. */
function Bench({
  mat,
  position,
  length,
}: {
  mat: ReturnType<typeof useMaterials>;
  position: [number, number, number];
  length: number;
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, DESK_H, 0]}>
        <boxGeometry args={[length, 0.035, 1.6]} />
        <primitive attach="material" object={mat.deskTop} />
      </mesh>
      {/* modesty panel down the spine */}
      <mesh position={[0, DESK_H - 0.18, 0]}>
        <boxGeometry args={[length - 0.3, 0.3, 0.02]} />
        <primitive attach="material" object={mat.frame} />
      </mesh>
      {[-length / 2 + 0.25, 0, length / 2 - 0.25].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, DESK_H / 2, 0]}>
            <boxGeometry args={[0.06, DESK_H, 0.06]} />
            <primitive attach="material" object={mat.frame} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.07, 0.04, 1.5]} />
            <primitive attach="material" object={mat.frame} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A task chair, correct enough in proportion to read as one. */
function chairGroup(mat: ReturnType<typeof useMaterials>) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.07, 0.46), mat.fabric);
  seat.position.y = SEAT_H;
  seat.castShadow = true;
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.5, 0.06), mat.fabric);
  back.position.set(0, SEAT_H + 0.29, -0.21);
  back.rotation.x = -0.12;
  back.castShadow = true;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, SEAT_H - 0.1, 8), mat.frame);
  stem.position.y = (SEAT_H - 0.1) / 2 + 0.06;
  g.add(seat, back, stem);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.05), mat.frame);
    leg.position.set(Math.cos(a) * 0.15, 0.05, Math.sin(a) * 0.15);
    leg.rotation.y = -a;
    g.add(leg);
  }
  return g;
}

/** Monitor on a stand. */
function monitorGroup(mat: ReturnType<typeof useMaterials>) {
  const g = new THREE.Group();
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.35, 0.02), mat.screen);
  panel.position.y = 0.34;
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.05), mat.frame);
  neck.position.y = 0.09;
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.16), mat.frame);
  foot.position.y = 0.01;
  g.add(panel, neck, foot);
  return g;
}

/** An open laptop. */
function laptopGroup(mat: ReturnType<typeof useMaterials>) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.015, 0.23), mat.steel);
  base.position.y = 0.008;
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.22, 0.012), mat.screen);
  lid.position.set(0, 0.11, -0.11);
  lid.rotation.x = -0.18;
  g.add(base, lid);
  return g;
}

/** A planter. Three offset spheres read as foliage without looking like a ball. */
function plantGroup(mat: ReturnType<typeof useMaterials>) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.36, 12), mat.pot);
  pot.position.y = 0.18;
  pot.castShadow = true;
  g.add(pot);
  const pts: [number, number, number][] = [
    [0, 0.62, 0],
    [0.14, 0.52, 0.08],
    [-0.12, 0.55, -0.07],
  ];
  pts.forEach((p, i) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.2 - i * 0.03, 10, 8), mat.leaf);
    s.position.set(...p);
    s.scale.y = 1.25;
    s.castShadow = true;
    g.add(s);
  });
  return g;
}

/** Repeated furniture drawn as one object each, placed by matrix. */
function Instanced({
  build,
  placements,
}: {
  build: () => THREE.Group;
  placements: { position: [number, number, number]; rotationY?: number }[];
}) {
  const ref = useRef<THREE.Group>(null);
  const template = useMemo(build, [build]);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.clear();
    for (const p of placements) {
      const c = template.clone();
      c.position.set(...p.position);
      c.rotation.y = p.rotationY ?? 0;
      host.add(c);
    }
  }, [template, placements]);
  return <group ref={ref} />;
}

/* ------------------------------------------------------------- the room --- */

export function Office() {
  const mat = useMaterials();

  const chairs = useMemo(
    () => [
      // open floor, two bench runs facing each other
      { position: [-6.6, 0, -2.6] as [number, number, number], rotationY: 0 },
      { position: [-5.2, 0, -2.6] as [number, number, number], rotationY: 0.1 },
      { position: [-3.8, 0, -2.6] as [number, number, number], rotationY: -0.08 },
      { position: [-6.6, 0, -0.6] as [number, number, number], rotationY: Math.PI },
      { position: [-5.2, 0, -0.6] as [number, number, number], rotationY: Math.PI - 0.12 },
      { position: [-3.8, 0, -0.6] as [number, number, number], rotationY: Math.PI },
      { position: [-6.6, 0, 2.4] as [number, number, number], rotationY: 0.05 },
      { position: [-5.2, 0, 2.4] as [number, number, number], rotationY: 0 },
      { position: [-3.8, 0, 2.4] as [number, number, number], rotationY: -0.1 },
      { position: [-6.6, 0, 4.4] as [number, number, number], rotationY: Math.PI },
      { position: [-5.2, 0, 4.4] as [number, number, number], rotationY: Math.PI + 0.1 },
      { position: [-3.8, 0, 4.4] as [number, number, number], rotationY: Math.PI },
      // meeting room
      { position: [3.6, 0, -3.9] as [number, number, number], rotationY: 0.2 },
      { position: [4.6, 0, -3.9] as [number, number, number], rotationY: 0 },
      { position: [5.6, 0, -3.9] as [number, number, number], rotationY: -0.2 },
      { position: [3.6, 0, -2.3] as [number, number, number], rotationY: Math.PI - 0.15 },
      { position: [4.6, 0, -2.3] as [number, number, number], rotationY: Math.PI },
      { position: [5.6, 0, -2.3] as [number, number, number], rotationY: Math.PI + 0.15 },
    ],
    [],
  );

  const monitors = useMemo(
    () => [
      { position: [-6.4, DESK_H + 0.02, -1.9] as [number, number, number], rotationY: 0.05 },
      { position: [-5.0, DESK_H + 0.02, -1.9] as [number, number, number], rotationY: 0 },
      { position: [-6.4, DESK_H + 0.02, -1.3] as [number, number, number], rotationY: Math.PI },
      { position: [-3.7, DESK_H + 0.02, -1.3] as [number, number, number], rotationY: Math.PI },
      { position: [-6.4, DESK_H + 0.02, 3.1] as [number, number, number], rotationY: 0 },
      { position: [-4.9, DESK_H + 0.02, 3.7] as [number, number, number], rotationY: Math.PI },
    ],
    [],
  );

  const laptops = useMemo(
    () => [
      { position: [-3.9, DESK_H + 0.02, -2.0] as [number, number, number], rotationY: 0.2 },
      { position: [-5.4, DESK_H + 0.02, -1.25] as [number, number, number], rotationY: Math.PI - 0.2 },
      { position: [-3.6, DESK_H + 0.02, 3.2] as [number, number, number], rotationY: -0.1 },
      { position: [-6.2, DESK_H + 0.02, 3.75] as [number, number, number], rotationY: Math.PI },
    ],
    [],
  );

  const plants = useMemo(
    () => [
      { position: [-8.2, 0, 5.6] as [number, number, number] },
      { position: [-8.2, 0, -5.4] as [number, number, number] },
      { position: [1.1, 0, -1.2] as [number, number, number] },
      { position: [1.1, 0, 2.6] as [number, number, number] },
      { position: [8.2, 0, -5.6] as [number, number, number] },
      { position: [-1.4, 0, 6.2] as [number, number, number] },
    ],
    [],
  );

  return (
    <group>
      <Shell mat={mat} />

      {/* two bench runs on the open floor */}
      <Bench length={4.6} mat={mat} position={[-5.2, 0, -1.6]} />
      <Bench length={4.6} mat={mat} position={[-5.2, 0, 3.4]} />

      {/* the meeting room: a glazed box with a table inside */}
      <group>
        {/* front glazing, with a gap for the door */}
        <mesh position={[2.6, ROOM.h / 2, -1.6]}>
          <boxGeometry args={[2.2, ROOM.h, 0.05]} />
          <primitive attach="material" object={mat.glass} />
        </mesh>
        <mesh position={[6.4, ROOM.h / 2, -1.6]}>
          <boxGeometry args={[2.6, ROOM.h, 0.05]} />
          <primitive attach="material" object={mat.glass} />
        </mesh>
        {/* side glazing */}
        <mesh position={[1.55, ROOM.h / 2, -4.3]}>
          <boxGeometry args={[0.05, ROOM.h, 5.4]} />
          <primitive attach="material" object={mat.glass} />
        </mesh>
        {/* frames */}
        {[
          [1.55, -1.6],
          [3.7, -1.6],
          [5.1, -1.6],
          [7.7, -1.6],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x!, ROOM.h / 2, z!]}>
            <boxGeometry args={[0.07, ROOM.h, 0.09]} />
            <primitive attach="material" object={mat.frame} />
          </mesh>
        ))}
        <mesh position={[4.6, ROOM.h - 0.04, -1.6]}>
          <boxGeometry args={[6.4, 0.08, 0.1]} />
          <primitive attach="material" object={mat.frame} />
        </mesh>

        {/* table */}
        <mesh castShadow receiveShadow position={[4.6, 0.74, -3.1]}>
          <boxGeometry args={[2.6, 0.05, 1.2]} />
          <primitive attach="material" object={mat.deskTop} />
        </mesh>
        {[
          [-1.1, -0.45],
          [1.1, -0.45],
          [-1.1, 0.45],
          [1.1, 0.45],
        ].map(([dx, dz], i) => (
          <mesh key={i} position={[4.6 + dx!, 0.37, -3.1 + dz!]}>
            <boxGeometry args={[0.06, 0.74, 0.06]} />
            <primitive attach="material" object={mat.frame} />
          </mesh>
        ))}
        {/* a plain screen on the end wall - dark glass, nothing on it */}
        <mesh position={[8.8, 1.55, -3.1]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[1.5, 0.86, 0.05]} />
          <primitive attach="material" object={mat.screen} />
        </mesh>
      </group>

      {/* tea point along the right-hand side */}
      <group position={[7.6, 0, 3.4]}>
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[1.1, 0.9, 3.4]} />
          <primitive attach="material" object={mat.frame} />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[1.18, 0.05, 3.5]} />
          <primitive attach="material" object={mat.worktop} />
        </mesh>
        {/* upstand */}
        <mesh position={[0.56, 1.35, 0]}>
          <boxGeometry args={[0.06, 0.8, 3.5]} />
          <primitive attach="material" object={mat.wall} />
        </mesh>
      </group>
      {/* stools at a poseur ledge */}
      {[2.2, 3.4, 4.6].map((z, i) => (
        <group key={i} position={[6.4, 0, z]}>
          <mesh castShadow position={[0, 0.66, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.05, 12]} />
            <primitive attach="material" object={mat.frame} />
          </mesh>
          <mesh position={[0, 0.33, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.66, 8]} />
            <primitive attach="material" object={mat.steel} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.03, 12]} />
            <primitive attach="material" object={mat.steel} />
          </mesh>
        </group>
      ))}

      {/* low storage against the back wall */}
      {[-7, -5.4, -3.8].map((x, i) => (
        <mesh castShadow key={i} position={[x, 0.36, -6.4]} receiveShadow>
          <boxGeometry args={[1.4, 0.72, 0.45]} />
          <primitive attach="material" object={mat.frame} />
        </mesh>
      ))}

      {/* ceiling fittings: linear strips, emissive only - no light cost */}
      {[-6.2, -3.4, -0.6].map(x =>
        [-4.4, -0.6, 3.2].map(z => (
          <mesh key={`${x}:${z}`} position={[x, ROOM.h - 0.06, z]}>
            <boxGeometry args={[0.14, 0.04, 2.4]} />
            <primitive attach="material" object={mat.light} />
          </mesh>
        )),
      )}

      <Instanced build={() => chairGroup(mat)} placements={chairs} />
      <Instanced build={() => monitorGroup(mat)} placements={monitors} />
      <Instanced build={() => laptopGroup(mat)} placements={laptops} />
      <Instanced build={() => plantGroup(mat)} placements={plants} />
    </group>
  );
}
