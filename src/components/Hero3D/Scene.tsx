'use client';

/**
 * The scene root: composition, parallax, entrance, and the bridge to the overlay.
 *
 * PARALLAX IS ON THE WHOLE SCENE, NOT THE CAMERA. Moving the camera changes the
 * projection, which would drag the DOM labels around independently of their
 * slabs and make the register visibly slip. Rotating the scene group keeps the
 * projection stable and every label locked to its object. The travel is about
 * ten degrees of yaw corner to corner - enough to be seen, far short of
 * following the cursor.
 *
 * THE OVERLAY BRIDGE IS A REF, NOT STATE. Card positions change every frame; if
 * they went through React the whole tree would re-render sixty times a second
 * for no reason. Each card writes its projected screen position into a shared
 * mutable map, and the overlay reads it in its own frame callback and writes
 * straight to element.style. No re-render at all while the scene animates.
 *
 * ENTRANCE IS A CLOCK, NOT A LIBRARY. Platform, cube, cards and connections
 * appear in sequence over about 1.2 seconds using elapsed time and an ease.
 * GSAP would do the same thing and the brief only permits it if already
 * installed, which it is not.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { Connection } from './Connection';
import { ExperienceCube } from './ExperienceCube';
import { Lighting } from './Lighting';
import { Platform } from './Platform';
import { Post } from './Post';
import { ServiceCard } from './ServiceCard';
import { CENTRE, SERVICES } from '@/content/hero-capabilities';
import type { AnchorMap, PointerRef } from './useHeroInteraction';

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

/* Must stay in step with `.h3-card { width: min(165px, 33cqi) }` in hero3d.css. */
const LABEL_MAX = 165;
const LABEL_CQI = 0.33;
/* Clearance left either side of the outermost label. */
const GUTTER = 24;
/* Outermost label travel as a fraction of canvas height at scale 1, measured. */
const SPREAD = 0.81;

export function Scene({
  active,
  pointer,
  anchors,
  quality,
  still,
}: {
  active: string | null;
  pointer: PointerRef;
  anchors: AnchorMap;
  quality: 'full' | 'reduced';
  /** prefers-reduced-motion. Every self-driven animation is frozen, not slowed;
      responses to hover and focus remain, because those are the visitor's own
      actions rather than something the page does at them. */
  still: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const started = useRef<number | null>(null);
  const { camera, size } = useThree();
  const scratch = useMemo(() => new THREE.Vector3(), []);

  /* Each card reports its world position; this projects it to screen space and
     leaves it where the overlay can find it. Nothing here touches React. */
  const report = (id: string, world: THREE.Vector3) => {
    scratch.copy(world).project(camera);
    const entry = anchors.current[id] ?? { x: 0, y: 0, visible: true };
    entry.x = (scratch.x * 0.5 + 0.5) * size.width;
    entry.y = (-scratch.y * 0.5 + 0.5) * size.height;
    entry.visible = scratch.z < 1;
    anchors.current[id] = entry;
  };

  useFrame(({ clock }) => {
    if (started.current === null) started.current = clock.elapsedTime;
    const age = clock.elapsedTime - started.current;

    if (root.current) {
      // Entrance: the group settles up into place. Under reduced motion it is
      // already there on the first frame rather than travelling to it.
      const intro = still ? 1 : easeOut(age / 1.2);
      root.current.position.y = -0.55 * (1 - intro);

      /* The scene is scaled to fit its labels, not to a breakpoint.
         The labels are DOM, centred on their slabs' PROJECTED positions, so
         what can overhang the widget is half a label's width while the
         projection spread is fixed in world units.
         The spread is proportional to the canvas HEIGHT, not its width: the
         camera's fov is vertical, and the horizontal extent is derived from it
         through the aspect, so pixels-per-world-unit falls out of height alone.
         Scaling by width instead under-corrects any box squarer than the
         desktop 5:4 - measured as a 1px overflow at 768, where the box is
         460x460. SPREAD is the outermost label's full travel as a fraction of
         canvas height at scale 1, measured off the built page: 164.5px at a
         408px height. LABEL_MAX/LABEL_CQI mirror the card's CSS width rule and
         must be changed with it. */
      const labelW = Math.min(LABEL_MAX, LABEL_CQI * size.width);
      root.current.scale.setScalar(
        Math.min(1, (size.width - labelW - GUTTER) / (SPREAD * size.height)),
      );

      /* Parallax, damped so a fast mouse does not snap the scene.
         The travel is +/-0.09rad of yaw and +/-0.06rad of pitch, about 10 and 7
         degrees corner to corner. It began at half that and measured a 3px
         shift across the full width of the widget - technically responding and
         visually nothing. This is still restrained: it reads as the scene
         acknowledging the pointer, not following it. */
      // Belt and braces: Hero3D does not bind the pointer handler when `still`,
      // so `pointer` stays at the origin - but the parallax is skipped outright
      // rather than relying on that.
      if (!still) {
        const px = pointer.current.x;
        const py = pointer.current.y;
        const ry = px * 0.09;
        const rx = py * 0.06;
        root.current.rotation.y += (ry - root.current.rotation.y) * 0.07;
        root.current.rotation.x += (rx - root.current.rotation.x) * 0.07;
      }
    }

  });

  return (
    <>
      <Lighting quality={quality} />
      <Post quality={quality} />
      <group ref={root}>
        <Platform quality={quality} />
        <ExperienceCube
          active={active === 'centre' || active !== null}
          onAnchor={report}
          quality={quality}
          still={still}
        />

        {SERVICES.map((s, i) => (
          <ServiceCard
            active={active === s.id}
            index={i}
            key={s.id}
            onAnchor={report}
            quality={quality}
            service={s}
            still={still}
          />
        ))}

        {SERVICES.map((s, i) => (
          <Connection
            active={active === s.id || active === 'centre'}
            from={s.position}
            key={s.id}
            phase={i * 0.33}
            quality={quality}
            still={still}
            to={[CENTRE.position[0], CENTRE.position[1], CENTRE.position[2]]}
          />
        ))}
      </group>
    </>
  );
}
