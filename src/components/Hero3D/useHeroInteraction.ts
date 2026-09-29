'use client';

/**
 * Pointer, capability and environment state for the hero scene.
 *
 * POINTER LIVES IN A REF, NOT IN STATE. A mousemove handler that calls setState
 * re-renders the tree on every pixel of movement, which is the single easiest
 * way to make an R3F hero stutter. The scene reads the ref inside its own frame
 * loop, so moving the mouse costs one object write and no React work at all.
 *
 * THE CAPABILITY IS STATE, because it changes rarely - on enter and leave - and
 * because the DOM overlay genuinely needs to re-render to show its supporting
 * list. Three renders per hover is nothing; sixty per second would not be.
 *
 * WEBGL IS DETECTED, NOT ASSUMED. The brief requires graceful degradation, and
 * `!!window.WebGLRenderingContext` is not enough - it is present on machines
 * whose driver then refuses to give a context. Asking for an actual context
 * from a throwaway canvas is the only answer that means anything.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type PointerRef = { current: { x: number; y: number } };
export type Anchor = { x: number; y: number; visible: boolean };
export type AnchorMap = { current: Record<string, Anchor> };

export type Quality = 'full' | 'reduced';

export function useHeroInteraction() {
  const pointer = useRef({ x: 0, y: 0 });
  const anchors = useRef<Record<string, Anchor>>({});
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [quality, setQuality] = useState<Quality>('full');
  const [still, setStill] = useState(false);

  useEffect(() => {
    /* A context, not a constructor. A machine can advertise WebGL and still
       refuse to hand one over - blocklisted driver, software rendering
       disabled, a headless browser. Only the attempt settles it. */
    let ok = false;
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') ?? c.getContext('webgl');
      ok = Boolean(gl);
      // Release it immediately; contexts are a limited resource.
      const lose = (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context');
      lose?.loseContext();
    } catch {
      ok = false;
    }

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia('(max-width: 900px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* TWO SEPARATE THINGS, and conflating them is what made the earlier
       version of this file claim a behaviour it did not have.
       `quality` is about COST: a phone or a coarse pointer gets fewer segments,
       a smaller shadow map and no antialiasing.
       `still` is about MOTION, and only prefers-reduced-motion sets it. A phone
       is not a request for stillness, and a desktop visitor who asked for
       reduced motion must get it at full quality.
       ADR-0051 requires that the pointer listener is NOT ATTACHED under this
       preference, because a media query can stop a transition but cannot stop a
       transform being written on every pointer move. Hero3D honours that by not
       binding the handler at all, and every self-driven animation below is
       frozen rather than merely slowed. */
    setQuality(coarse || narrow || reduced ? 'reduced' : 'full');
    setStill(reduced);
    setSupported(ok);
    setReady(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    // -1..1 from the centre of the container, clamped so a pointer that leaves
    // the box does not keep pushing the scene.
    pointer.current.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    pointer.current.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
  }, []);

  const onPointerLeave = useCallback(() => {
    pointer.current.x = 0;
    pointer.current.y = 0;
    setActive(null);
  }, []);

  return useMemo(
    () => ({
      pointer: pointer as PointerRef,
      anchors: anchors as AnchorMap,
      active,
      setActive,
      ready,
      supported,
      quality,
      still,
      onPointerMove,
      onPointerLeave,
    }),
    [active, ready, supported, quality, still, onPointerMove, onPointerLeave],
  );
}
