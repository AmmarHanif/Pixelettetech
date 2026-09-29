'use client';

/**
 * The Spatial demonstration: a genuine 3D office the visitor can look around.
 *
 * THE CANVAS IS NEVER THE ONLY WAY IN. Every viewpoint is an ordinary button
 * outside the canvas, reachable and operable from the keyboard, and the active
 * viewpoint's written description sits beside the scene and is announced when it
 * changes. Someone who cannot see or cannot operate the canvas still gets the
 * four places, their names, and what is in each of them. That is the brief's
 * requirement and it is the reason the description lives in `viewpoints.ts`
 * rather than in a comment.
 *
 * ONE EXPERIENCE AT A TIME. This component only exists while Spatial is the
 * selected tab; the showcase unmounts it on switch, so no hidden canvas keeps a
 * WebGL context or a render loop alive behind another demonstration.
 *
 * POINTER STATE IS A REF. Dragging writes to a mutable ref that the render loop
 * reads, so turning to look never re-renders React. The only state that changes
 * per interaction is the viewpoint and the fullscreen flag, which change rarely.
 */

import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Scene } from './Scene';
import type { Viewpoint } from './viewpoints';
import { DEFAULT_VIEWPOINT, VIEWPOINTS } from './viewpoints';

export function SpatialDemo() {
  const [viewpoint, setViewpoint] = useState<Viewpoint>(DEFAULT_VIEWPOINT);
  const [full, setFull] = useState(false);
  const [still, setStill] = useState(false);
  const [quality, setQuality] = useState<'full' | 'reduced'>('full');

  const pointer = useRef({ x: 0, y: 0, active: false });
  const zoom = useRef(0);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const narrow = window.matchMedia('(max-width: 900px)');
    setStill(reduce.matches);
    setQuality(coarse.matches || narrow.matches ? 'reduced' : 'full');
  }, []);

  /* ---- looking around ---------------------------------------------------- */
  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, ox: pointer.current.x, oy: pointer.current.y };
    pointer.current.active = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const r = e.currentTarget.getBoundingClientRect();
    // Clamped to -1..1, so the look can never exceed the viewpoint's own range.
    pointer.current.x = Math.max(-1, Math.min(1, d.ox - ((e.clientX - d.x) / r.width) * 2.2));
    pointer.current.y = Math.max(-1, Math.min(1, d.oy - ((e.clientY - d.y) / r.height) * 1.8));
  }, []);

  const onUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    pointer.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // Deliberately NOT preventDefault: the page must still scroll past a
    // demonstration rather than trapping the visitor inside it.
    zoom.current = Math.max(-0.6, Math.min(0.85, zoom.current - e.deltaY * 0.0008));
  }, []);

  /* ---- selecting a viewpoint resets the look ----------------------------- */
  const go = useCallback((v: Viewpoint) => {
    pointer.current.x = 0;
    pointer.current.y = 0;
    zoom.current = 0;
    setViewpoint(v);
  }, []);

  /* ---- fullscreen -------------------------------------------------------- */
  const toggleFull = useCallback(() => {
    const el = host.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => setFull(f => !f));
    } else {
      // No Fullscreen API: fall back to an in-page expansion rather than
      // nothing, so the control is never a dead button.
      setFull(f => !f);
    }
  }, []);

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  return (
    <div className={`sp${full ? ' sp--full' : ''}`} ref={host}>
      <div
        className="sp__stage"
        onPointerCancel={onUp}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onWheel={onWheel}
      >
        <Canvas
          camera={{ fov: 62, near: 0.1, far: 90 }}
          dpr={quality === 'full' ? [1, 1.8] : [1, 1.4]}
          gl={{ antialias: quality === 'full', powerPreference: 'high-performance' }}
          shadows={quality === 'full' ? 'percentage' : false}
        >
          <Scene
            pointer={pointer}
            quality={quality}
            setViewpoint={go}
            still={still}
            viewpoint={viewpoint}
            zoom={zoom}
          />
        </Canvas>

        {/* The interaction cue from the approved reference. aria-hidden because
            the same instruction is given as real text in the controls below,
            where a screen reader will reach it in reading order. */}
        <p aria-hidden className="sp__cue">
          <svg className="sp__cue-icon" viewBox="0 0 24 24">
            <rect height="16" rx="5" width="11" x="6.5" y="4" />
            <path d="M12 8v3" />
          </svg>
          Click and drag to look around
        </p>

        <button
          aria-label={full ? 'Exit full screen' : 'View full screen'}
          className="sp__expand"
          onClick={toggleFull}
          type="button"
        >
          <svg aria-hidden viewBox="0 0 24 24">
            {full ? (
              <>
                <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
              </>
            ) : (
              <>
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </>
            )}
          </svg>
        </button>
      </div>

      <div className="sp__controls">
        <span className="sp__label" id="sp-vp">
          Viewpoint
        </span>
        <div aria-labelledby="sp-vp" className="sp__btns" role="group">
          {VIEWPOINTS.map(v => (
            <button
              aria-pressed={v.id === viewpoint.id}
              className={`sp__btn${v.id === viewpoint.id ? ' is-active' : ''}`}
              key={v.id}
              onClick={() => go(v)}
              type="button"
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="sp__hint">
          <span>Drag to explore</span>
          <span aria-hidden className="sp__sep" />
          <span>Scroll to zoom</span>
        </p>
      </div>

      {/* The scene in words. Live, so changing viewpoint is announced. */}
      <p aria-live="polite" className="sp__described">
        <span className="sp__described-vp">{viewpoint.label}.</span> {viewpoint.description}
      </p>
    </div>
  );
}

export default SpatialDemo;
