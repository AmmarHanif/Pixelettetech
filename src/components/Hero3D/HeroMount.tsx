'use client';

/**
 * The client boundary that lets the 3D hero be loaded after hydration.
 *
 * WHY THIS FILE EXISTS AT ALL. `next/dynamic` with `ssr: false` is refused
 * inside a Server Component in the App Router, and the homepage is one. Rather
 * than make the whole page a client component - which would ship every one of
 * its sections to the browser to solve a problem in one corner of it - the
 * boundary is drawn here, around the smallest thing that needs it.
 *
 * WHAT IT BUYS. three.js never enters the server render and never enters any
 * other route's bundle. The headline, the lead and both calls to action are
 * still server-rendered, so the largest contentful paint is unaffected by a
 * scene that arrives a moment later.
 *
 * THE PLACEHOLDER IS SIZED, NOT EMPTY. It reserves the widget's own aspect
 * ratio so the hero does not shift when the canvas mounts - a loading spinner
 * that collapses to nothing would trade a layout shift for a nicety.
 */

import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => <div className="h3" />,
});

export function HeroMount() {
  return <Hero3D />;
}

export default HeroMount;
