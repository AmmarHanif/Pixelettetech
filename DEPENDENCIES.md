# Dependencies and licences

Generated from the installed tree. Regenerate after any dependency change.

**49 packages installed** from 11 direct dependencies (6 runtime, 5 dev). That
is 48 distinct names: `scheduler` is installed twice, 0.25.0 at the top level for
`react-dom` and 0.28.0 nested under `@react-three/fiber`. Counted from
`node_modules/.package-lock.json` on a Windows x64 install. `package-lock.json`
itself holds 80 package entries (81 with the root project entry), because it
also records 31 optional `@img/sharp-*` and `@next/swc-*` binaries for other
platforms; a build machine installs only its own.

*(Corrected 2026-10-01. This read "48 packages installed" and the summary below
read "MIT | 35"; both missed the nested `scheduler@0.28.0`. The dependency set
has not changed since 50c97bc on 2026-09-28: later edits to `package.json` touched
`scripts` only, and `package-lock.json` was last changed in 50c97bc.)*

## Licence summary

| Licence | Packages |
|---|---|
| MIT | 36 |
| Apache-2.0 | 5 |
| BSD-3-Clause | 2 |
| ISC | 2 |
| Apache-2.0 AND LGPL-3.0-or-later AND MIT | 1 |
| Apache-2.0 AND LGPL-3.0-or-later | 1 |
| CC-BY-4.0 | 1 |
| 0BSD | 1 |

**No strong-copyleft (GPL/AGPL/SSPL) licences present.**

### Weak copyleft (LGPL) — noted, not a constraint here

- `@img/sharp-wasm32@0.35.4` — Apache-2.0 AND LGPL-3.0-or-later AND MIT (transitive)
- `@img/sharp-win32-x64@0.35.4` — Apache-2.0 AND LGPL-3.0-or-later (transitive)

These are Next.js's optional `sharp` image-processing binaries, pulled in as
transitive dependencies. Since 2026-09-30 the project's own build scripts also
import `sharp` (see "Direct dependencies" below). LGPL obligations attach to
modifying and redistributing the library itself. This project neither modifies
nor redistributes them — it consumes them unmodified at build time on the server
— so no source-disclosure obligation arises. Worth knowing if the deployment ever
vendors or patches them.

`@img/sharp-win32-x64` is the Windows x64 binary, installed because this tree
was counted on Windows. The lockfile also records the binaries for other
platforms, including `@img/sharp-libvips-*` (LGPL-3.0-or-later) for Linux and
macOS, so a Linux build host installs Linux variants in its place. The same
reasoning applies to them.

## Direct dependencies

| Package | Version | Licence | Type |
|---|---|---|---|
| `@react-three/fiber` | 9.8.1 | MIT | runtime |
| `@types/node` | 22.10.7 | MIT | dev |
| `@types/react` | 19.0.7 | MIT | dev |
| `@types/react-dom` | 19.0.3 | MIT | dev |
| `@types/three` | 0.186.0 | MIT | dev |
| `@vercel/analytics` | 2.0.1 | MIT | runtime |
| `next` | 15.5.24 | MIT | runtime |
| `react` | 19.0.0 | MIT | runtime |
| `react-dom` | 19.0.0 | MIT | runtime |
| `three` | 0.186.1 | MIT | runtime |
| `typescript` | 5.7.3 | Apache-2.0 | dev |

Two declaration gaps in `package.json`, recorded 2026-10-01 and not changed:

- **Three of these are ranges, not pins.** `@react-three/fiber` (`^9.8.1`),
  `three` (`^0.186.1`) and `@types/three` (`^0.186.0`) are declared with caret
  ranges (`package.json:25`, `:30`, `:36`). Every other direct dependency is
  pinned exactly. The versions in the table are what `package-lock.json`
  resolves; `npm update`, or an install without the lockfile, can move those
  three within their ranges.
- **`sharp` is used directly but is not declared.** `scripts/build-work-images.mjs:45`
  and `scripts/build-app-icons.mjs:30` both `import sharp from 'sharp'` at the
  top level, and `npm run build` runs both (with `--check`) before `next build`
  (`package.json:8`). `package.json` does not list `sharp`. It is installed only
  as an optional dependency of `next` (`"sharp": "^0.34.3 || ^0.35.3"`,
  `package-lock.json:1044`; `node_modules/sharp` 0.35.4 is `"optional": true`,
  `:1160-1165`). An install that omits optional dependencies, or a platform where
  sharp's binary does not install, stops `npm run build` at its first step.
  sharp 0.35.4 also declares `engines.node >=20.9.0` (`package-lock.json:1172`),
  a higher floor than `next`'s own `^18.18.0 || ^19.8.0 || >= 20.0.0`.

## Full installed tree

| Package | Version | Licence |
|---|---|---|
| `@babel/runtime` | 7.29.7 | MIT |
| `@dimforge/rapier3d-compat` | 0.12.0 | Apache-2.0 |
| `@emnapi/runtime` | 1.11.3 | MIT |
| `@img/colour` | 1.1.0 | MIT |
| `@img/sharp-wasm32` | 0.35.4 | Apache-2.0 AND LGPL-3.0-or-later AND MIT |
| `@img/sharp-win32-x64` | 0.35.4 | Apache-2.0 AND LGPL-3.0-or-later |
| `@next/env` | 15.5.24 | MIT |
| `@next/swc-win32-x64-msvc` | 15.5.24 | MIT |
| `@react-three/fiber` | 9.8.1 | MIT |
| `@swc/helpers` | 0.5.15 | Apache-2.0 |
| `@tweenjs/tween.js` | 23.1.3 | MIT |
| `@types/node` | 22.10.7 | MIT |
| `@types/react` | 19.0.7 | MIT |
| `@types/react-dom` | 19.0.3 | MIT |
| `@types/react-reconciler` | 0.28.9 | MIT |
| `@types/stats.js` | 0.17.4 | MIT |
| `@types/three` | 0.186.0 | MIT |
| `@types/webxr` | 0.5.24 | MIT |
| `@vercel/analytics` | 2.0.1 | MIT |
| `base64-js` | 1.5.1 | MIT |
| `buffer` | 6.0.3 | MIT |
| `caniuse-lite` | 1.0.30001810 | CC-BY-4.0 |
| `client-only` | 0.0.1 | MIT |
| `csstype` | 3.2.3 | MIT |
| `detect-libc` | 2.1.2 | Apache-2.0 |
| `fflate` | 0.8.3 | MIT |
| `ieee754` | 1.2.1 | BSD-3-Clause |
| `its-fine` | 2.1.1 | MIT |
| `meshoptimizer` | 1.1.1 | MIT |
| `nanoid` | 3.3.18 | MIT |
| `next` | 15.5.24 | MIT |
| `picocolors` | 1.1.1 | ISC |
| `postcss` | 8.4.31 | MIT |
| `react` | 19.0.0 | MIT |
| `react-dom` | 19.0.0 | MIT |
| `react-use-measure` | 2.1.7 | MIT |
| `scheduler` | 0.25.0 | MIT |
| `scheduler` (nested under `@react-three/fiber`) | 0.28.0 | MIT |
| `semver` | 7.8.5 | ISC |
| `sharp` | 0.35.4 | Apache-2.0 |
| `source-map-js` | 1.2.1 | BSD-3-Clause |
| `styled-jsx` | 5.1.6 | MIT |
| `suspend-react` | 0.1.3 | MIT |
| `three` | 0.186.1 | MIT |
| `tslib` | 2.8.1 | 0BSD |
| `typescript` | 5.7.3 | Apache-2.0 |
| `undici-types` | 6.20.0 | MIT |
| `use-sync-external-store` | 1.7.0 | MIT |
| `zustand` | 5.0.15 | MIT |

## Known advisories

- `postcss` 8.4.31, which `next` 15.5.24 pins exactly (`package-lock.json`,
  `next` dependencies), carries open advisories (GHSA-qx2v-qp2m-jg93,
  GHSA-6g55-p6wh-862q and related) concerning attacker-controlled CSS and
  sourceMappingURL handling. They affect build-time CSS processing only, and all
  CSS in this project is authored in-repo, so there is no attacker-controlled
  input. `npm audit --package-lock-only`, run 2026-10-01, lists four postcss
  advisories (the two above, GHSA-r28c-9q8g-f849 and GHSA-fxqj-rqcc-2cmp), gives
  the affected `next` range as running to 16.3.0-preview.10, and offers
  `next@16.3.8`, a semver-major upgrade, as the only fix. No Next 15 release
  clears them. Whether to take the upgrade is a separate decision, not made here.
  *(Corrected 2026-10-01. This said postcss is "bundled inside every current
  Next.js release", that "no fix exists in any stable Next release", and to
  "Re-check on the next Next.js major". The audit now names a Next 16 release as
  the fix.)*
- `next@15.1.6` (CVE-2025-66478) was superseded during the build; the project
  pins a patched release.

## Change log

### 2026-10-01 — hero films and stills added on 2026-09-29/30, recorded after the fact

Six commits on 2026-09-29 and 2026-09-30 added or replaced hero media in
`public/hero` and `public/video` without an entry here. They are listed from
`git log` and the commit messages. Where a commit does not say how an asset was
made, the table says so rather than guess.

| Commit | File(s) | What it is, per the commit | Bytes | Rendered on | Licence |
|---|---|---|---|---|---|
| aef3d3c (09-29) | `public/video/arvr-hero.mp4`, `arvr-hero-poster.webp` | The AR/VR film recorded below, re-cut square. Not a new asset; its entry below is corrected | 2,473,555 / 24,790 | `/ar-vr-development-services` | **NOT VERIFIED — OPEN** (entry below) |
| 5aeec0b (09-30) | `public/hero/mobile-app-{820,1240,1536}.webp` | A "composite render" the founder supplied on 2026-09-30, a transparent cut-out, emitted at three widths. How it was produced is not recorded | 64,066 / 115,220 / 166,988 | `/engineering/mobile-applications` | **UNVERIFIED — OPEN** (already deployed; see the note below) |
| 5aeec0b (09-30) | `public/video/modernisation-hero.mp4`, `modernisation-hero-poster.webp` | A "motion-graphic film" the founder supplied on 2026-09-30, cropped here to remove a dark edge and re-encoded; poster cut from the clip. How it was produced is not recorded | 521,366 / 33,516 | `/engineering/modernisation-integration` | **UNVERIFIED — OPEN** (already deployed; see the note below) |
| 4392e4e, replaced in 779a63f (09-30) | `public/video/engineering-hero.mp4`, `engineering-hero-poster.webp` | A composite render the founder supplied, animated through Higgsfield (4392e4e). 779a63f replaced it with a film generated from a white-background redraw of that artwork, supplied as H.265 and re-encoded here to H.264; poster cut from the film. Who made the render and the redraw is not recorded | 1,148,321 / 55,384 | `/engineering` | **UNVERIFIED — OPEN** (already deployed; see the note below) |
| 653333b (09-30) | `public/hero/support-lifecycle-{820,1240,1536}.webp` | "The approved render", used as supplied on founder instruction; shown above 900px only, with the built lifecycle below that. How it was produced is not recorded | 28,672 / 49,388 / 73,102 | `/support-continuous-improvement` | **UNVERIFIED — OPEN** (already deployed; see the note below) |
| 0e9a979 (09-30) | `public/video/custom-software-hero.mp4`, `custom-software-hero-poster.webp` | One of "the two approved films", supplied as silent H.264 and re-encoded here, with a WebP poster. How it was produced is not recorded | 554,416 / 10,424 | `/engineering/custom-software-saas` | **UNVERIFIED — OPEN** (already deployed; see the note below) |
| 0e9a979 (09-30) | `public/video/web-platforms-hero.mp4`, `web-platforms-hero-poster.webp` | The other approved film, handled the same way | 261,238 / 17,858 | `/engineering/web-platforms` | **UNVERIFIED — OPEN** (already deployed; see the note below) |

Every film is H.264 with no audio stream, checked with ffprobe on 2026-10-01:
AR/VR 720x720, about 23 s; Engineering 1920x1080, about 6 s; Modernisation
1280x720, about 6 s; Custom Software and Web Platforms 1280x720, about 7 s.

Content faults baked into the pixels, which the commits record as exceptions the
founder chose: the Custom Software film shows "Delivery" twice and "APIs" twice,
once spelled "APIS", and the Web Platforms film has generated gibberish above
every label (0e9a979); the support artwork carries dashboard figures (99.99%
uptime, 24,593 users, 1.2M transactions, a 120 ms response time) that no
claims-register entry supports (653333b). None of this is visible to the
repository's text-based checks.

Not listed: the `public/work/*.webp` files added in 547b5c4 are WebP encodes of
the existing case-study PNGs, made by `scripts/build-work-images.mjs`, not new
imagery. This file does not record those PNGs' position.

No npm package was added for any of this.

**OPEN (2026-10-01):** this file says the generated and supplied hero assets
must not be published until their licences are cleared (the AR/VR film and
homepage artwork entries below). main @ 0e9a979, which contains every asset above
and the homepage artwork, was deployed to Vercel Production on 2026-10-01.
`SITE_IN_DEVELOPMENT` (`src/content/launch.ts:26`) only keeps pages out of search
indexes (`src/lib/seo.ts:105-107`, `src/app/robots.ts:19`); it does not stop them
being served. Whether that deployment is publicly reachable is not recorded in
the repository. The founder must decide whether these assets may stay in it, and
this note should then be removed.

### 2026-09-28 (evening) — a GENERATED VIDEO now ships in a page hero

The AR/VR page hero is a 23-second generated film in place of its
illustration. This is a materially bigger commitment than the still images
recorded below: it is 2,473,555 bytes, it plays automatically, and it is the first
thing a visitor to that page sees.

| | |
|---|---|
| Asset | `public/video/arvr-hero.mp4` (2,473,555 bytes) + `arvr-hero-poster.webp` (24,790 bytes) |
| Origin | Two 12-second FLUX 3 Video renders via Higgsfield, joined with a 0.7s cross-dissolve in ffmpeg |
| Encode | 720x720 (centre crop of the 16:9 film), H.264, CRF 30, **no audio stream at all** |
| Cost | 216 credits (2 x 108). A third render failed and was not charged |
| Masters | `05_Projects/.../generated-imagery/2026-09-28_arvr-showcase-video/` — 1080p master, 720p, and both source clips |
| Licence | **NOT VERIFIED — OPEN, and now higher stakes** |

*(Corrected 2026-10-01. This entry gave the film as 3.7 MB at 1280x720 and the
poster as 22 kB. aef3d3c re-cut both square on 2026-09-29: the film is now
720x720, still H.264 at CRF 30 with no audio stream (ffprobe), and the poster was
re-cut from the 9-second frame. The commit leaves the licence and the
bare-shouldered opening open.)*

**The commercial-use question is the same one as for the still images and it
matters more here.** A hero film that autoplays on a services page is the
most prominent generated asset on the site. What the Higgsfield plan grants
for commercial use of generated output must be read from their terms before
this is published, not assumed.

**A second, separate issue to settle before publication:** in roughly the
first three seconds the figure wearing the headset is rendered bare-
shouldered. In a standalone film that is a detail; in a looping page hero it
is the opening frame. Regenerating that clip with clothing specified is 108
credits and has not been done.

No npm package was added. ffmpeg is a local tool and ships nothing.

### 2026-09-28 (later still) — a 3D office, and NO external 3D asset

*(2026-10-01: the showcase was hidden from the page later the same day, in
7c0d3f2. See the correction in the next entry.)*

The Immersive Showcase's Spatial demonstration became a genuine WebGL scene.
**No third-party 3D asset was introduced, and that was forced rather than
chosen.** The instruction permits an optimised glTF environment and also rules
that an asset whose commercial-use rights cannot be established must not be
used. Asset hosts are unreachable from this environment — tested, not assumed:
a fetch of a model library returns a blocked-host refusal — so no licence could
be read, let alone recorded.

| | |
|---|---|
| External 3D assets | **none** |
| Office geometry | original, authored in `src/components/SpatialDemo/Office.tsx` |
| Textures | original, drawn into canvases at load — no image files, nothing to license, no bytes added |
| New npm packages | **none** — `three` and `@react-three/fiber` were already installed |
| Licence risk | none introduced |

If a licensed office model is supplied later, record its source and licence
here before it is used.

### 2026-09-28 (later) — the WebGL hero was replaced, and a GENERATED IMAGE now ships

The homepage hero is no longer the three.js scene described in the entry below.
It is a still generated with Higgsfield (`gpt_image_2_5`) with the wording laid
over it as live HTML. See ADR-0053, which supersedes ADR-0052. (Neither ADR is
in this repository.)

**The dependency position changed, and the entry below is now historical.**

| | as recorded below | actual, measured |
|---|---|---|
| Deferred 3D payload | 948 kB raw / 250.8 kB gz | **nothing — three.js is in no chunk any page fetches** |
| Extra chunks for the hero | 5 | **0** (the homepage fetches the same 9 chunks as a page with no hero) |
| Homepage First Load JS | 107 kB | **106 kB** |

**`three`, `@react-three/fiber` and `@types/three` ARE INSTALLED BUT SHIP ON NO
RENDERED ROUTE. Do not remove them until the founder decides — see below.**

*(Corrected 2026-10-01. This line read "ARE IN USE AGAIN — DO NOT REMOVE THEM".
That was true when it was written (a626598, 2026-09-28 15:25) and false 35
minutes later, when 7c0d3f2 (16:00) hid the Immersive Showcase.
`<ImmersiveShowcase />` now sits inside a JSX comment at
`src/app/ar-vr-development-services/page.tsx:279-295`, and the page no longer
imports it.)*

*(Corrected the same day. This entry read "now UNUSED ... pending a founder
decision to remove them", which was true for about four hours and is now
false. The homepage hero moved to a rendered still, which freed them; the
AR/VR page's Immersive Showcase then replaced its CSS Spatial demonstration
with a genuine WebGL office, which needs them. Deleting them on the strength
of the earlier paragraph would have broken that page.)*

Last rendered use: `src/components/SpatialDemo/` on
`/ar-vr-development-services`, until 7c0d3f2. While the showcase rendered it was
lazy-loaded behind a client boundary AND an IntersectionObserver, so no other
route fetched them and a visitor who did not scroll to the showcase downloaded
none of it — measured at 13 chunks / 152 kB before the section was approached,
+249 kB transferred on approach.

Today the only files that import `three` or `@react-three/fiber` are under
`src/components/SpatialDemo/` and `src/components/Hero3D/`. `SpatialDemo/` is
reached two ways: through `ImmersiveShowcase.tsx` (its `SpatialMount` import,
line 5), which no page renders, and through `src/app/globals.css:4`, which
imports `SpatialDemo/spatial.css`. That `@import` was added by 69c904c and left in
place when 7c0d3f2 hid the showcase. `globals.css` is loaded by the root layout
(`src/app/layout.tsx:21`), so the Spatial stylesheet is still in the global CSS
that every page loads, although the showcase is hidden. `Hero3D/` is reached
only through `HeroMount`, which nothing imports. Both folders are still
type-checked, because `tsconfig.json:21` includes every `.ts` and `.tsx` file, so
uninstalling the packages without also deleting those folders and
`ImmersiveShowcase.tsx` would break `check-types` and the build. Deleting
`SpatialDemo/` without also dropping the `spatial.css` `@import` from
`globals.css` breaks the build as well, because the import no longer resolves.
The comment above the hidden block (`page.tsx:265-278`) says the
showcase is hidden, not deleted, and is expected back once Spatial meets the
approved visual standard. **Whether to remove the packages or re-enable the
showcase is a decision for the founder.** Until it is made, leave them installed.

`src/components/Hero3D/` is still on disk, still unreferenced, and is safe to
delete on its own — but `@types/three` and the two runtime packages must stay
while `SpatialDemo/` and `ImmersiveShowcase.tsx` are kept.

**A NEW THIRD-PARTY ASSET NOW SHIPS, AND ITS LICENCE IS NOT YET CLEARED.**

| | |
|---|---|
| Asset | `public/hero/experience-layer-{820,1240,1860}.webp` |
| Size | 54.1 / 101.7 / 182.4 kB, transparent (`hasAlpha=true`, verified with sharp) |
| Origin | Generated by OpenAI `gpt_image_2_5` through the founder's Higgsfield account, from his own uploaded reference image, plus Higgsfield's background remover |
| Cost | 2.75 credits per generation; 11 credits spent across four candidates |
| Licence | **NOT VERIFIED — OPEN** |

*(2026-09-28, later: this asset was briefly replaced by artwork the founder
supplied with the wording baked in, then reverted when that wording measured
7–8px at the hero's render size. The files listed above are what ships. See the
ADR-0053 addendum.)*

> **SUPERSEDED THE SAME DAY, TWICE OVER — the line above saying "the files
> listed above are what ships" IS NO LONGER TRUE.** Corrected here rather than
> edited in place, so the drift is visible rather than quietly tidied away.
>
> 1. **The `experience-layer-*` BYTES WERE REPLACED.** They now hold a
>    different `gpt_image_2_5` render (a blank-tile scene made to the founder's
>    reference), encoded at quality 80 / alphaQuality 80 — settings chosen by
>    isolating one knob at a time, since below alphaQuality ~80 the faint halo
>    goes blotchy against the hero's tinted background. 75.3 / 146.2 / 293.6 kB.
>    The row above describes sizes and a provenance that no longer match the
>    file contents.
> 2. **NOTHING ON THE PAGE REFERENCES THEM ANY MORE.** The homepage hero now
>    renders `HeroArtwork`, not `HeroVisual`. `experience-layer-*` are modified
>    but unused; `HeroVisual` is kept deliberately as the one-line way back.
>
> **THE ASSET THAT ACTUALLY SHIPS, AND ITS LICENCE POSITION IS DIFFERENT:**
>
> | | |
> |---|---|
> | Asset | `public/hero/hero-artwork-{820,1240,1774}.webp` |
> | Size | 57.6 / 98.3 / 108.2 kB, transparent (`isOpaque=false`, verified with sharp) |
> | Origin | **Supplied by the founder on 2026-09-28.** Delivered opaque on white at 1774x887; the white was removed here by a border flood fill (53.5% of the canvas cleared) because the hero band is a radial gradient measuring rgb(248,243,251) behind the figure, against which an opaque white rectangle would have been plainly visible |
> | Licence | **UNKNOWN — and NOT the same question as the Higgsfield assets.** How this artwork was produced has not been stated: commissioned, made in-house, or generated on some other service are all consistent with what was supplied. It must not be assumed to carry the founder's own rights merely because he supplied it, and it must not be assumed to carry the Higgsfield question either. **ASK BEFORE PUBLICATION.** |
> | Known cost | its wording is BAKED IN at about 23px against a 1774px width, so it lands at 6.9px in the shipped 50/50 column and is unreadable. Mitigated, not solved: the same wording is carried as screen-reader text and the three tile links are preserved, so machines and keyboard users still get it |

This is a deliberate gap, not an oversight. The asset is destined for a company
website, so what the Higgsfield plan grants for **commercial use** of generated
output has to be read from their terms rather than assumed, and that is the
founder's to confirm. Two further questions belong with it: whether the output
carries any attribution requirement, and whether the founder's uploaded
reference was itself his to use as a generation input.

**Until that is confirmed this asset must not be published.** `SITE_IN_DEVELOPMENT`
is still `true`, but it does not stop pages being served. Record the answer here
when it is known.

*(Corrected 2026-10-01. This read "`SITE_IN_DEVELOPMENT` is `true` and nothing
is live, so nothing turns on it today." The flag (`src/content/launch.ts:26`)
only sets noindex and disallows crawling (`src/lib/seo.ts:105-107`,
`src/app/robots.ts:19`). main @ 0e9a979, which renders `HeroArtwork` on the
homepage (`src/app/page.tsx:426`) and contains the `experience-layer-*` files,
was deployed to Vercel Production on 2026-10-01. See the OPEN note in the
2026-10-01 entry above.)*

No new npm package was added for any of this. The image was produced through an
MCP tool already connected to the session, resized and re-encoded in the browser,
and written out as a static file; `sharp`, already a Next.js dependency, is used
only to verify the result.

### 2026-09-28 — `three`, `@react-three/fiber` and `@types/three` added (2 runtime, 1 dev)

Added to rebuild the homepage hero as a real WebGL scene rather than CSS
transforms, after the CSS version was judged not dimensional enough. The
founder's instruction was explicit: "go ahead without drei and try to achieve
similar results". `@react-three/drei` was therefore evaluated and **not added**.

| Check | Result |
|---|---|
| Registry | official npm registry |
| Versions | `three@0.186.1`, `@react-three/fiber@9.8.1`, `@types/three@0.186.0`, integrity pinned in `package-lock.json`. **`package.json` declares all three as caret ranges** (`^0.186.1`, `^9.8.1`, `^0.186.0`), unlike every other direct dependency, so only the lockfile pins them |
| Licence | all three MIT — permissive, no new obligation |
| Strong copyleft introduced | **none**. Re-verified across the whole 49-package tree |
| Peer compatibility | R3F declares `react >=19 <19.4` and `three >=0.156` as REQUIRED peers; this project is react 19.0.0 and three 0.186.1, so both are satisfied. Its `expo*`, `react-native` and `react-dom` peers are all `optional: true`, read from the installed `peerDependenciesMeta`, not from documentation |
| Tree growth | 29 → **49 packages (+20)** |

**What the 20 packages actually are**, since the count matters more than the
three names. `three` itself has **zero** dependencies. The other 19 arrive
through the two wrappers:

- **Runtime (14).** `@react-three/fiber` pulls `@babel/runtime`, `@types/webxr`,
  `base64-js`, `buffer`, `its-fine`, `react-use-measure`, `suspend-react`,
  `use-sync-external-store` and `zustand`; `its-fine` adds
  `@types/react-reconciler` and `buffer` adds `ieee754`. It also gets its own
  `scheduler@0.28.0`, nested under `node_modules/@react-three/fiber/`, because
  the top-level `scheduler@0.25.0` that `react-dom` needs does not satisfy its
  `^0.28.0`. Note `buffer` — a Node API polyfill — reaches the browser
  bundle, though only inside the deferred chunk, never `main-app`.
- **Dev only (6), and they never reach a browser.** `@types/three` pulls
  `@dimforge/rapier3d-compat`, `@tweenjs/tween.js`, `@types/stats.js`, `fflate`
  and `meshoptimizer` purely so the `three/examples/jsm` type declarations
  resolve. `@dimforge/rapier3d-compat` is the only Apache-2.0 addition of
  substance and it is a **types-only transitive**: it is not imported by any
  source file here and is not in any built chunk.

*(Corrected 2026-10-01. This entry read "48-package tree", "29 → 48 packages
(+19)", "What the 19 packages", "The other 18", "Runtime (13)" and "(`scheduler`
was already present.)". Diffing `package-lock.json` at 83f4bf0 against 50c97bc
shows 20 entries added, the nested `scheduler@0.28.0` among them.)*

**The cost, stated plainly rather than buried.** The deferred 3D payload is
**948 kB raw / 250.8 kB gzipped** across five lazy chunks (916 kB / 241.8 kB
before the bloom post-processing chain was added the same day) — more than twice the
entire 103 kB shared First Load. Measured, not estimated. It does not touch the
homepage's First Load JS, which is **unchanged at 107 kB**, because the scene is
behind a client boundary with `ssr: false` and `main-app` and `layout` contain
zero references to three. So it costs nothing to first paint, nothing to any
other route, and nothing at all to a visitor whose browser never starts WebGL —
but a visitor who does get the scene downloads 242 kB for it. That is the real
trade and it is the one argument for keeping the CSS hero.

**Why not drei**, beyond the instruction. Everything drei would have supplied
here already ships inside `three`: `RoundedBoxGeometry`, `RoomEnvironment` and
`PMREMGenerator` all live under `three/examples/jsm`, and `MeshPhysicalMaterial`
with `transmission`/`thickness`/`ior`/`clearcoat` is real glass in core three.
Adding drei would have grown the tree substantially for helpers this scene does
not use.

**To reverse.** `HeroExperience.tsx` is still on disk and unreferenced. Point
`src/app/page.tsx` back at it, delete `src/components/Hero3D/`, drop the
`@import` at the top of `globals.css`, and `npm uninstall three
@react-three/fiber @types/three`. Nothing else imports any of the three.

*(Corrected 2026-10-01. Two parts of this no longer hold. The `@import` this
meant, `hero3d.css`, was removed from `globals.css` by 42f7edf the same day. The
`@import` lines now at the top of `globals.css` are other stylesheets, and only
one of them belongs to the 3D work: `SpatialDemo/spatial.css` (`globals.css:4`,
added by 69c904c), which must be dropped as well if `SpatialDemo/` is removed,
or the build fails to resolve it. The other three belong to other components
and are not part of this reversal. And `src/components/SpatialDemo/` now imports
`three` and `@react-three/fiber` too, so the uninstall also needs `SpatialDemo/`
and `ImmersiveShowcase.tsx` removed. See the correction in the entry above; that
removal is the founder's decision.)*

### 2026-09-11 — `@vercel/analytics@2.0.1` added (runtime)

Added for the analytics instrumentation of implementation-checklist items 21
and 22. Provider chosen by the founder over Plausible, Fathom and Google
Analytics. See `ANALYTICS.md`.

| Check | Result |
|---|---|
| Registry | official npm registry |
| Version | `2.0.1`, pinned exactly, integrity `sha512-MTQG6V9qQrt1ts…` in `package-lock.json` |
| Licence | MIT — permissive, no new obligation |
| Runtime dependencies | **none**. Tree grows by exactly one package, 28 to 29 |
| Peer compatibility | declares `react: ^18 \|\| ^19 \|\| ^19.0.0-rc` and `next: >= 13`; this project is react 19.0.0 and next 15.5.24, so both are satisfied. Every peer is optional |
| Network surface | production loads the FIRST-PARTY path `/_vercel/insights/script.js`. The only remote URL anywhere in the package is `va.vercel-scripts.com/v1/script.debug.js`, used in development mode only |
| Device storage | the package uses no `document.cookie`, `localStorage`, `sessionStorage` or `indexedDB`. Read from the installed `dist`, not from documentation |
| Publisher | Vercel, the platform already hosting this site |

Not verified here, and recorded rather than glossed: the behaviour of the
script the package *loads* could not be inspected from the build environment,
because it is served by the Vercel platform at deploy time. That is why
`ANALYTICS_ENABLED` ships `false` and why `ANALYTICS.md` §5b makes it a
precondition rather than an assumption.

### 2026-09-14 — `@supabase/supabase-js` and `resend` evaluated, and NOT added

The contact form's delivery path was rebuilt onto Supabase storage and Resend
email (`CONTACT-FORM-SETUP.md`). The founder authorised these two packages, and
only these two, for that work. Both were evaluated against the gate. **Neither
was added, and the installed tree is unchanged at 29 packages.** The reasons are
below, together with everything needed to reverse the decision in one step.

**The versions and licences, as required — read from the npm registry
2026-09-14, not from the sibling repo's pins.**

| Package | Current | Licence | Runtime deps | Engines | Peers |
|---|---|---|---|---|---|
| `@supabase/supabase-js` | 2.116.0 | MIT | 5 (`auth-js`, `storage-js`, `realtime-js`, `functions-js`, `postgrest-js`, all 2.116.0) | `node >=22.0.0` | `@opentelemetry/api` — optional |
| `resend` | 6.28.0 | MIT | 2 (`postal-mime@2.7.5`, `standardwebhooks@1.0.0`) | `node >=20` | `@react-email/render` — optional |

Both are MIT, so neither adds a licence obligation. Neither declares a `react`
or `next` peer, so neither can conflict with Next 15.5.24 or React 19 — the
compatibility question for these two is **Node**, not React. Note that
`@supabase/supabase-js` has moved its floor since the sibling repo pinned it:
the sibling's `^2.103.0` declares `node >=20.0.0`, current declares
`node >=22.0.0`. This project pins no `engines` and ships no `vercel.json`, so
it would inherit whatever Node version the Vercel project is set to. That would
have to be confirmed as 22.x before adopting current `supabase-js`.

**Why they were not added.**

1. **The install could not be performed here, and routing around the gate was
   not an option.** `npm install` is refused in this environment by the R14
   dependency gate. Adding the two names to `package.json` by hand would have
   declared a tree that does not exist on disk, left `package-lock.json`
   inconsistent with it, and — because nothing can be compiled against a package
   that is not installed — made it impossible to type-check or build the very
   code that imports them. That was measured, not assumed: a probe importing
   both packages fails with `TS2307: Cannot find module`, exit 2.
2. **Shipping unbuildable code is worse than shipping no code.** The founder
   asked for something ready to test on the day credentials arrive. With the
   SDKs, "ready" would still have required a successful dependency install
   first. Without them it requires only environment variables and a migration.
3. **What the SDKs were wanted for is two HTTP calls.** One `INSERT` through
   PostgREST and one `POST /emails`. `supabase-js` brings realtime, auth,
   storage and functions clients — five packages of surface — to perform a
   single insert, and every one of them would sit in the same process as a
   service-role credential. Fewer moving parts around that credential is the
   better security position, and it keeps the "no strong copyleft, 29 packages"
   record in this file true.

This is a deviation from the letter of the authorisation and it is recorded as
one. The authorisation was a ceiling — "these two only… no other dependency" —
and using neither stays inside it, but the intent was plainly to use them, so
the decision belongs to the founder if he disagrees.

**To adopt them instead**, nothing needs designing: run
`npm install --save-exact @supabase/supabase-js@2.116.0 resend@6.28.0` from an
interactive session that can clear the gate, confirm the Vercel project runs
Node 22.x, and replace the two `fetch` calls in `src/lib/enquiries.ts` with the
SDK equivalents. The module boundary was drawn so that this is the only file
that changes: `deliverEnquiry` is the whole interface, and the server action
neither knows nor cares how the transport works. The behavioural suite at
`verification/2026-09-14/contact_action_test.js` stubs `fetch`, so it would need
its stubs re-pointed at the SDKs, and it is the thing that tells you the swap
was faithful.
