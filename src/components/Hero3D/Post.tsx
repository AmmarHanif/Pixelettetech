'use client';

/**
 * Bloom. The single thing whose absence made the first build look flat.
 *
 * WHY THIS IS NOT DECORATION. An emissive material is only a bright colour:
 * three renders it and stops. What makes light read AS light is the halo it
 * throws into the pixels around it, and nothing in the base renderer does that.
 * The first version of this hero had a glowing core and glowing conduits and
 * neither of them glowed, because there was no post-processing at all.
 *
 * IT MUST NOT COST THE TRANSPARENT CANVAS. The hero sits on the page's own
 * background and that is load-bearing, so the whole chain was checked before it
 * was wired: EffectComposer's render target is RGBA half-float, RenderPass
 * honours an explicit clearAlpha, and UnrealBloomPass composites additively -
 * so alpha survives, and rises only where there is actually glow. Read from
 * three's own source, then measured on the built page.
 *
 * IT TAKES OVER THE RENDER LOOP. useFrame at priority 1 stops R3F rendering the
 * scene itself, so the composer is the only thing drawing. Without the priority
 * the scene would be drawn twice per frame and the bloom would be overwritten.
 *
 * NO NEW DEPENDENCY. EffectComposer, RenderPass, UnrealBloomPass and OutputPass
 * all ship inside `three` under examples/jsm.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function Post({ quality }: { quality: 'full' | 'reduced' }) {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const c = new EffectComposer(gl);

    // clearAlpha 0 explicitly rather than inheriting: this is the pass that
    // decides whether the empty parts of the scene are transparent.
    const render = new RenderPass(scene, camera);
    render.clearAlpha = 0;
    c.addPass(render);

    /* strength / radius / threshold.
       THE THRESHOLD IS THE WHOLE SETTING. At 0.78 with strength 0.85 this
       washed the scene out completely: every untonemapped material cleared the
       threshold, so the panels, the plinth and the cube all bloomed and the
       result was a soft-focus blur with no structure left in it. Glow has to be
       something only a few things do. At 0.95 the only things above the line
       are the core, the conduits, the connector nodes and the panel edges -
       which is exactly the list that should glow. */
    c.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        quality === 'full' ? 0.5 : 0.34,
        0.32,
        0.95,
      ),
    );

    // Tone mapping and colour-space conversion belong at the END of the chain,
    // not on the renderer, or the bloom would be mapped twice.
    c.addPass(new OutputPass());

    return c;
    // `size` is deliberately absent: resizing is handled below rather than by
    // rebuilding the whole chain on every resize frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera, quality]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);

  useEffect(() => () => composer.dispose(), [composer]);

  useFrame(() => {
    composer.render();
  }, 1);

  return null;
}
