'use client';

/**
 * The hero widget: a transparent WebGL scene with a DOM layer over it.
 *
 * THE CANVAS IS TRANSPARENT AND THAT IS LOAD-BEARING. `alpha: true` on the
 * renderer and no scene.background, so the page's own hero-glow shows through
 * rather than being covered by a white rectangle. The brief calls this VERY
 * IMPORTANT and it is the difference between a widget sitting in the page and
 * one pasted on top of it.
 *
 * NOTHING RENDERS UNTIL IT IS SEEN. The Canvas mounts only when the container
 * enters the viewport, and `frameloop` stops when it leaves. A hero that keeps
 * a render loop running while the visitor reads the rest of the page is burning
 * their battery to animate something behind them.
 *
 * THE OVERLAY IS THE FALLBACK, not a copy of it. With no WebGL - refused
 * context, blocklisted driver, reduced-motion on a phone - the same DOM renders
 * in a stacked layout and every word and link is still there. There is no
 * second implementation to drift out of step.
 */

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import { Overlay } from './Overlay';
import { Scene } from './Scene';
import { useHeroInteraction } from './useHeroInteraction';

export function Hero3D() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const {
    pointer,
    anchors,
    active,
    setActive,
    ready,
    supported,
    quality,
    onPointerMove,
    onPointerLeave,
  } = useHeroInteraction();

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      entries => setVisible(entries.some(e => e.isIntersecting)),
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const live = ready && supported === true;

  return (
    <div
      className={`h3${live ? ' h3--live' : ''}`}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      ref={host}
    >
      {live ? (
        <Canvas
          camera={{ fov: 34, position: [0.35, 1.25, 7.4] }}
          /* Capped at 2: beyond that the cost doubles for a difference nobody
             can see on a hero this size, and phones suffer most. */
          dpr={quality === 'full' ? [1, 2] : [1, 1.5]}
          frameloop={visible ? 'always' : 'never'}
          gl={{
            alpha: true,
            antialias: quality === 'full',
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.setClearAlpha(0);
          }}
          /* `percentage` (PCFShadowMap), not the `true` default. `true` asks
             for PCFSoftShadowMap, which three 0.186 has REMOVED - it warns and
             silently falls back to exactly this. Naming it keeps the console
             clean and stops the renderer choosing on our behalf. */
          shadows={quality === 'full' ? 'percentage' : false}
          style={{ background: 'transparent' }}
        >
          <Scene active={active} anchors={anchors} pointer={pointer} quality={quality} />
        </Canvas>
      ) : null}

      <Overlay active={active} anchors={anchors} live={live} setActive={setActive} />
    </div>
  );
}

export default Hero3D;
