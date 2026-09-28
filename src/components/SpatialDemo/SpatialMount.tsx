'use client';

/**
 * The boundary that keeps three.js off every other page.
 *
 * TWO GATES, NOT ONE. `next/dynamic` with `ssr: false` keeps the 3D runtime out
 * of the server render and out of every other route's bundle; an
 * IntersectionObserver then holds the import back until the showcase is actually
 * approaching the viewport. A visitor who never scrolls this far downloads none
 * of it, and a visitor who lands on any other page never sees it at all.
 *
 * THE PLACEHOLDER IS THE SAME SHAPE AS THE SCENE, so the section does not jump
 * when the canvas arrives. It is not a spinner; a spinner that collapses to
 * nothing would trade a layout shift for a nicety.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const SpatialDemo = dynamic(() => import('./SpatialDemo'), {
  ssr: false,
  loading: () => <div className="sp sp--loading" />,
});

export function SpatialMount() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={host}>{near ? <SpatialDemo /> : <div className="sp sp--loading" />}</div>;
}

export default SpatialMount;
