'use client';

/**
 * The camera: where it stands, where it looks, and how far the visitor may
 * turn it.
 *
 * IT TRAVELS, IT DOES NOT SPIN THE BUILDING. Changing viewpoint eases the
 * camera's POSITION and its TARGET from one place in the room to another over
 * about 800ms. The brief is explicit that the alternative - rotating the whole
 * model in front of a fixed eye - is what makes a scene read as a diagram
 * rather than a space, and it is also what the CSS version did.
 *
 * FREE LOOK IS CONSTRAINED, NOT FREE. Dragging turns the head within a few
 * tenths of a radian of the viewpoint's own heading and releases back toward
 * it. There is no walking, no flying, and no way to end up inside a wall, in
 * the ceiling, or outside the building - which is the difference between a
 * product demonstration and a game camera.
 *
 * REDUCED MOTION SWITCHES INSTEAD OF TRAVELLING. With the preference set the
 * camera arrives immediately and the idle drift is off. The viewpoint still
 * changes and the scene is still explorable; what stops is motion the visitor
 * did not ask for. The brief requires the demonstration to remain understandable
 * rather than to disappear.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { Viewpoint } from './viewpoints';

const TRANSITION_MS = 800;

/** Smooth in and out. Linear travel reads as a slide, not as walking. */
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export type PointerState = { current: { x: number; y: number; active: boolean } };

export function CameraRig({
  viewpoint,
  pointer,
  still,
  zoom,
}: {
  viewpoint: Viewpoint;
  pointer: PointerState;
  /** prefers-reduced-motion: arrive immediately, and do not drift. */
  still: boolean;
  /** -1..1, from the wheel. Nudges the camera along its own view axis only. */
  zoom: { current: number };
}) {
  const { camera } = useThree();

  const from = useMemo(
    () => ({ pos: new THREE.Vector3(), target: new THREE.Vector3() }),
    [],
  );
  const to = useMemo(
    () => ({ pos: new THREE.Vector3(), target: new THREE.Vector3() }),
    [],
  );
  const current = useMemo(
    () => ({ pos: new THREE.Vector3(), target: new THREE.Vector3() }),
    [],
  );
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const start = useRef<number | null>(null);
  const first = useRef(true);

  useEffect(() => {
    to.pos.set(...viewpoint.position);
    to.target.set(...viewpoint.target);
    if (first.current || still) {
      // No travel on the very first render, and none at all under the
      // reduced-motion preference.
      current.pos.copy(to.pos);
      current.target.copy(to.target);
      from.pos.copy(to.pos);
      from.target.copy(to.target);
      start.current = null;
      first.current = false;
      return;
    }
    from.pos.copy(current.pos);
    from.target.copy(current.target);
    start.current = performance.now();
  }, [viewpoint, still, from, to, current]);

  useFrame(() => {
    // 1. travel between viewpoints
    if (start.current !== null) {
      const t = Math.min(1, (performance.now() - start.current) / TRANSITION_MS);
      const e = easeInOut(t);
      current.pos.lerpVectors(from.pos, to.pos, e);
      current.target.lerpVectors(from.target, to.target, e);
      if (t >= 1) start.current = null;
    }

    // 2. the visitor's own look, within this viewpoint's limits
    const yaw = pointer.current.x * viewpoint.yawRange;
    const pitch = pointer.current.y * viewpoint.pitchRange;

    // Rotate the TARGET around the camera rather than moving the camera, so the
    // visitor turns their head and never leaves the spot they are standing on.
    scratch.copy(current.target).sub(current.pos);
    const radius = scratch.length();
    const baseYaw = Math.atan2(scratch.x, scratch.z);
    const basePitch = Math.asin(THREE.MathUtils.clamp(scratch.y / radius, -1, 1));

    const y = baseYaw + yaw;
    const p = THREE.MathUtils.clamp(basePitch + pitch, -0.85, 0.85);
    const r = radius * (1 - zoom.current * 0.35);

    scratch.set(
      Math.sin(y) * Math.cos(p) * r,
      Math.sin(p) * r,
      Math.cos(y) * Math.cos(p) * r,
    );

    camera.position.copy(current.pos);
    camera.lookAt(scratch.add(current.pos));
  });

  return null;
}

export { TRANSITION_MS };
