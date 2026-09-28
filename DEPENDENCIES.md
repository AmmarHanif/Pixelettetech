# Dependencies and licences

Generated from the installed tree. Regenerate after any dependency change.

**48 packages installed** from 11 direct dependencies (6 runtime, 5 dev).

## Licence summary

| Licence | Packages |
|---|---|
| MIT | 35 |
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
transitive dependencies. LGPL obligations attach to modifying and redistributing
the library itself. This project neither modifies nor redistributes them — it
consumes them unmodified at build time on the server — so no source-disclosure
obligation arises. Worth knowing if the deployment ever vendors or patches them.

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

- `postcss`, bundled inside every current Next.js release, carries open
  advisories (GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q and related) concerning
  attacker-controlled CSS and sourceMappingURL handling. They affect build-time
  CSS processing only, no fix exists in any stable Next release, and all CSS in
  this project is authored in-repo, so there is no attacker-controlled input.
  Re-check on the next Next.js major.
- `next@15.1.6` (CVE-2025-66478) was superseded during the build; the project
  pins a patched release.

## Change log

### 2026-09-28 — `three`, `@react-three/fiber` and `@types/three` added (2 runtime, 1 dev)

Added to rebuild the homepage hero as a real WebGL scene rather than CSS
transforms, after the CSS version was judged not dimensional enough. The
founder's instruction was explicit: "go ahead without drei and try to achieve
similar results". `@react-three/drei` was therefore evaluated and **not added**.

| Check | Result |
|---|---|
| Registry | official npm registry |
| Versions | `three@0.186.1`, `@react-three/fiber@9.8.1`, `@types/three@0.186.0`, integrity pinned in `package-lock.json` |
| Licence | all three MIT — permissive, no new obligation |
| Strong copyleft introduced | **none**. Re-verified across the whole 48-package tree |
| Peer compatibility | R3F declares `react >=19 <19.4` and `three >=0.156` as REQUIRED peers; this project is react 19.0.0 and three 0.186.1, so both are satisfied. Its `expo*`, `react-native` and `react-dom` peers are all `optional: true`, read from the installed `peerDependenciesMeta`, not from documentation |
| Tree growth | 29 → **48 packages (+19)** |

**What the 19 packages actually are**, since the count matters more than the
three names. `three` itself has **zero** dependencies. The other 18 arrive
through the two wrappers:

- **Runtime (13).** `@react-three/fiber` pulls `@babel/runtime`, `@types/webxr`,
  `base64-js`, `buffer`, `its-fine`, `react-use-measure`, `suspend-react`,
  `use-sync-external-store` and `zustand`; `its-fine` adds
  `@types/react-reconciler` and `buffer` adds `ieee754`. (`scheduler` was
  already present.) Note `buffer` — a Node API polyfill — reaches the browser
  bundle, though only inside the deferred chunk, never `main-app`.
- **Dev only (6), and they never reach a browser.** `@types/three` pulls
  `@dimforge/rapier3d-compat`, `@tweenjs/tween.js`, `@types/stats.js`, `fflate`
  and `meshoptimizer` purely so the `three/examples/jsm` type declarations
  resolve. `@dimforge/rapier3d-compat` is the only Apache-2.0 addition of
  substance and it is a **types-only transitive**: it is not imported by any
  source file here and is not in any built chunk.

**The cost, stated plainly rather than buried.** The deferred 3D payload is
**916 kB raw / 241.8 kB gzipped** across four lazy chunks — more than twice the
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
