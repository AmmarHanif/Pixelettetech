'use client';

/**
 * The AR/VR hero visual: a looping showcase film.
 *
 * REDUCED MOTION GETS THE POSTER, NOT THE FILM. A hero that plays by itself is
 * exactly the kind of unrequested movement the preference exists to stop, so
 * when it is set the video never loads at all - the poster image is rendered on
 * its own and no megabytes are fetched. That is checked in JavaScript rather
 * than with a media query, because CSS can stop an animation but cannot stop a
 * video element downloading and playing.
 *
 * IT IS MUTED, LOOPED, INLINE, AND HAS NO AUDIO TRACK AT ALL. Muted and
 * playsInline are what browsers require before they will autoplay anything; an
 * encode with no audio stream means there is nothing that could ever be
 * unmuted, which is the honest version of "this will not make a noise at
 * someone".
 *
 * THE POSTER IS THE FIRST PAINT. It is 22 kB against the film's 3.7 MB, so the
 * hero has its final appearance immediately and the video arrives underneath it
 * rather than leaving a hole.
 *
 * IT CARRIES NO MEANING, DELIBERATELY. Every word on this hero is real text
 * beside it. The film is decorative, so it is aria-hidden - a screen reader
 * announcing a description of it would be repeating what the heading and lead
 * already say.
 */

import { useEffect, useState } from 'react';

export function HeroVideo() {
  const [motionOk, setMotionOk] = useState<boolean | null>(null);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionOk(!m.matches);
    const onChange = () => setMotionOk(!m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  // Until the preference is known, show the poster. Server and first client
  // render then agree, and nothing starts playing before we know it is wanted.
  if (motionOk !== true) {
    return (
      <div className="hv-video">
        <img
          alt=""
          aria-hidden
          className="hv-video__el"
          height={720}
          src="/video/arvr-hero-poster.webp"
          width={720}
        />
      </div>
    );
  }

  return (
    <div className="hv-video">
      <video
        aria-hidden
        autoPlay
        className="hv-video__el"
        height={720}
        loop
        muted
        playsInline
        poster="/video/arvr-hero-poster.webp"
        preload="metadata"
        width={720}
      >
        <source src="/video/arvr-hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default HeroVideo;
