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
