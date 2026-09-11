# Dependencies and licences

Generated from the installed tree. Regenerate after any dependency change.

**29 packages installed** from 8 direct dependencies (4 runtime, 4 dev).

## Licence summary

| Licence | Packages |
|---|---|
| MIT | 18 |
| Apache-2.0 | 4 |
| ISC | 2 |
| Apache-2.0 AND LGPL-3.0-or-later AND MIT | 1 |
| Apache-2.0 AND LGPL-3.0-or-later | 1 |
| CC-BY-4.0 | 1 |
| BSD-3-Clause | 1 |
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
| `@types/node` | 22.10.7 | MIT | dev |
| `@types/react` | 19.0.7 | MIT | dev |
| `@types/react-dom` | 19.0.3 | MIT | dev |
| `@vercel/analytics` | 2.0.1 | MIT | runtime |
| `next` | 15.5.24 | MIT | runtime |
| `react` | 19.0.0 | MIT | runtime |
| `react-dom` | 19.0.0 | MIT | runtime |
| `typescript` | 5.7.3 | Apache-2.0 | dev |

## Full installed tree

| Package | Version | Licence |
|---|---|---|
| `@emnapi/runtime` | 1.11.3 | MIT |
| `@img/colour` | 1.1.0 | MIT |
| `@img/sharp-wasm32` | 0.35.4 | Apache-2.0 AND LGPL-3.0-or-later AND MIT |
| `@img/sharp-win32-x64` | 0.35.4 | Apache-2.0 AND LGPL-3.0-or-later |
| `@next/env` | 15.5.24 | MIT |
| `@next/swc-win32-x64-msvc` | 15.5.24 | MIT |
| `@swc/helpers` | 0.5.15 | Apache-2.0 |
| `@types/node` | 22.10.7 | MIT |
| `@types/react` | 19.0.7 | MIT |
| `@types/react-dom` | 19.0.3 | MIT |
| `@vercel/analytics` | 2.0.1 | MIT |
| `caniuse-lite` | 1.0.30001810 | CC-BY-4.0 |
| `client-only` | 0.0.1 | MIT |
| `csstype` | 3.2.3 | MIT |
| `detect-libc` | 2.1.2 | Apache-2.0 |
| `nanoid` | 3.3.18 | MIT |
| `next` | 15.5.24 | MIT |
| `picocolors` | 1.1.1 | ISC |
| `postcss` | 8.4.31 | MIT |
| `react` | 19.0.0 | MIT |
| `react-dom` | 19.0.0 | MIT |
| `scheduler` | 0.25.0 | MIT |
| `semver` | 7.8.5 | ISC |
| `sharp` | 0.35.4 | Apache-2.0 |
| `source-map-js` | 1.2.1 | BSD-3-Clause |
| `styled-jsx` | 5.1.6 | MIT |
| `tslib` | 2.8.1 | 0BSD |
| `typescript` | 5.7.3 | Apache-2.0 |
| `undici-types` | 6.20.0 | MIT |

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
