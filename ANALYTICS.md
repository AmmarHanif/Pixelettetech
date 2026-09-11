# Analytics

What is measured on this site, what each number means, what is still switched off,
and how to add a tracked call to action without breaking the history.

Implements checklist items 21 and 22 of
`design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt`.

---

## 1. The state of it today, in one line

**Everything is built, verified and switched off.** No script is loaded, no request
is made and no event is sent, because `ANALYTICS_ENABLED` in `src/lib/analytics.ts`
is `false`. Two separate things have to be true before it goes to `true`, and one of
them is a decision only the founder can take. Both are in section 5.

Proven rather than asserted: `node scripts/analytics_check.js` renders the
instrumented pages and confirms that all 69 built pages reference no Vercel script.

---

## 2. Provider

| | |
|---|---|
| Provider | Vercel Web Analytics |
| Package | `@vercel/analytics` |
| Version | `2.0.1`, pinned exactly in `package.json` and locked with an integrity hash |
| Licence | MIT |
| Runtime dependencies it brings | **none** — it adds exactly one package to the tree |
| Chosen because | Vercel already hosts the site, so the beacon is first-party rather than a fourth-party domain |

In production the package injects a script from **`/_vercel/insights/script.js`** —
the site's own origin, served by the platform. There is no third-party domain in the
production path. In `next dev` it loads `https://va.vercel-scripts.com/v1/script.debug.js`
instead and logs to the console rather than sending; that is the only remote URL
anywhere in the package, and it is development-only.

The package itself contains no use of `document.cookie`, `localStorage`,
`sessionStorage` or `indexedDB`. That was read out of the installed files in
`node_modules/@vercel/analytics/dist`, not taken from documentation.

---

## 3. What is tracked

Every name below is declared once, in `src/lib/analytics.ts`, and nowhere else.
**Do not rename one after launch.** An event name is a permanent identifier: rename
it and the history splits into a dead series and a new one starting at zero.

### Events

| Event | Fires when | Dimensions |
|---|---|---|
| `hero_primary_cta` | The hero's primary CTA, "Build a Product", is clicked | route, surface |
| `hero_secondary_cta` | The hero's secondary CTA, "Automate a Workflow" | route, surface |
| `hero_specialist_route` | "Explore Blockchain Engineering" | route, surface |
| `hero_low_friction_route` | "Not sure which route fits? Tell us what needs to change." | surface only — see note |
| `hero_route_chip` | One of the three chips under the hero: Build Software, AI & Automation, Blockchain | route, surface |
| `buyer_trigger_route` | The **Route** column of section 03 — the visitor went to read the capability | route, surface |
| `buyer_trigger_cta` | The **Next step** column of section 03 — the visitor went to a conversation. The conversion step of the two | route, surface |
| `case_study_opened` | A case-study card was opened | surface, detail = the slug |
| `send_us_a_brief_intent` | The "Send Us a Brief" button was pressed. **Read section 4 before using this number** | surface |
| `book_conversation_cta` | Any booked-conversation CTA: the header, the homepage close, the shared closing block, a case-study aside | surface |
| `contact_form_submitted` | The contact form was **accepted by the server**. The completed conversion | surface |
| `analytics_unknown_event` | Self-monitoring. Something on the site carries an event name that is not declared. If this ever appears, `detail` holds the offending value and it is a bug | detail |

`hero_low_friction_route` deliberately carries **no route**. The whole point of that
line is that the visitor cannot yet name their route; attaching one would invent an
answer they have not given, and section 6's route breakdown would then be counting it.

### Dimensions

**`route`** — the six buyer triggers of handoff section 03, as stable slugs:

| Slug | Section 03 route | Rolls up to (section 04) |
|---|---|---|
| `build-software` | Build Software | `build` |
| `ai-automation` | AI & Automation | `automate` |
| `ai-engineering` | AI Engineering | `automate` |
| `modernise-integrate` | Modernise & Integrate | `build` |
| `blockchain` | Blockchain | `decentralise` |
| `run-improve` | Run & Improve | `run` |

**`model`** — `build` / `automate` / `decentralise` / `run`. Not written into any
page: it is derived from `route` by a single table in `src/lib/analytics.ts`, so the
two can never disagree. This is the exact breakdown item 22 names — "measure
conversion by route (Build / Automate / Blockchain / Run)" — while `route` keeps the
finer six-way detail underneath it.

**`surface`** — where on the site the click happened: `site-header`,
`site-header-mobile`, `homepage-hero`, `homepage-buyer-triggers`,
`homepage-selected-work`, `homepage-close`, `work-index-hero`, `work-index`,
`case-study-aside`, `case-study-related`, `closing-cta`, `contact-form`.

**`detail`** — free text, capped at 64 characters. Currently only a case-study slug.

### Pageviews

`<Analytics />` from `@vercel/analytics/next` is mounted in `src/app/layout.tsx`
and records pageviews for every route, including dynamic ones as `/case-studies/[slug]`
rather than as one row per case study.

---

## 4. The brief event means a button press. Nothing more.

`send_us_a_brief_intent` counts **a click on the "Send Us a Brief" button**.

**No file ever reaches us.** There is no upload control anywhere on this site. The
contact form forwards a small JSON message to a webhook and cannot carry an
attachment, and whether an upload is built at all is an open founder decision, set
out in `../UPLOAD-FEASIBILITY-2026-09-11.md`.

The name ends in `_intent` for exactly that reason, and `scripts/analytics_check.js`
fails the build check if any declared event name ever contains the word "upload". If
an upload is built later it gets its own, **new** event. This one must never be
repurposed to mean a delivered brief, because every count recorded before that day
would then be measuring something else.

---

## 5. What has to happen before this is switched on

### 5a. The founder must enable Web Analytics in the Vercel dashboard

**Code alone does not turn it on.** The package says so itself — when the script
fails to load it prints "Be sure to enable Web Analytics for your project and deploy
again."

1. Vercel dashboard → the `pixelette-technologies-website` project → **Analytics**.
2. Enable **Web Analytics**. That is what starts serving `/_vercel/insights/script.js`;
   until it is enabled the path 404s and no data is collected however the code is
   configured.
3. Confirm in the dashboard whether **custom events** are included on the project's
   current plan. Pageviews and custom events are billed differently on Vercel and the
   plan detail is not something this repository can read. If custom events are not
   included, the eleven events in section 3 will not appear and only pageviews will —
   worth knowing before drawing a conclusion from an empty chart.
4. Redeploy after enabling, so the built pages carry the script.

### 5b. The privacy page. This one is blocking, and it is not an engineering decision

**`src/app/privacy/page.tsx` currently publishes statements that arming analytics
would make untrue.** They were written from first-hand inspection of the served site
on 2026-09-07 and they are UK GDPR Article 13 disclosures, not marketing copy:

> "This site loads no third-party fonts, **trackers** or advertising scripts."

> "This site **sets no cookies**. It stores nothing on your device, reads nothing from
> it, and loads no third-party script that could. **There is no consent banner because
> there is nothing to consent to.**"

The same page then makes a commitment about precisely this situation:

> "**If that ever changes we will say so here first.** Under the rules that have
> applied since 5 February 2026, some limited uses do not require your consent, such
> as measuring how the site is used in order to improve it … They do still require us
> to tell you plainly what we are doing and to give you a **simple, free way of
> objecting**. **We would do both on this page before setting anything.**"

That is the site's own rule and it points one way. Three things follow:

1. **The privacy page has not been edited to accommodate analytics**, and should not
   be edited to make a feature fit. The brief for this work said so explicitly and it
   is the right instruction.
2. **What could not be verified here, and must be before the switch flips.** The npm
   package sets no cookie and writes no device storage — that was read out of the
   installed source. But the package only *loads* the script; the script itself is
   served by Vercel's platform at `/_vercel/insights/script.js` and could not be
   fetched from this environment to inspect. Vercel's position is that Web Analytics
   is cookieless, and the first-party path supports that, but **this repository has
   not proved it**. Whether a consent banner is needed turns on that fact, so it has
   to be established from Vercel's own current documentation before anything is armed.
3. **A free means of objecting.** Even on the most favourable reading — cookieless,
   statistical purposes only — the DUAA 2025 Schedule A1 exception the privacy page
   relies on carries an obligation to tell visitors plainly and give them a simple,
   free way to opt out. Today there is neither, because there is nothing to opt out
   of. Both would need to exist on the day measurement starts.

**None of that is a reason not to build this.** It is a reason the switch is `false`
and the decision sits with the founder, alongside legal input if he wants it.

### 5c. The site is still de-indexed, which is the second, independent reason

`SITE_IN_DEVELOPMENT` in `src/content/launch.ts` is `true`, so every page is
`noindex` and robots.txt disallows everything. No buyer can arrive from a search
engine. Every visit today is the founder, an agent working on the build, or someone
holding a preview link.

Recording those as conversions would seed item 22's baseline with internal traffic,
and Vercel Web Analytics has **no retroactive filter** to take them back out. A
polluted denominator is worse than no denominator: the first post-launch comparison
is then against a number nobody can trust, and the decision item 22 exists to support
— which buyer problems to promote — gets taken on noise.

The counter-argument is real and worth stating: you cannot confirm the wiring works
until something is switched on. The answer is that you can, locally — in `next dev`
the package resolves to `development` mode and logs every event to the browser
console instead of sending it, so the whole chain is observable without a single
production row.

### 5d. The switch itself

One line, one file:

```ts
// src/lib/analytics.ts
export const ANALYTICS_ENABLED: boolean = false;
```

It is deliberately **a literal, not `!SITE_IN_DEVELOPMENT`**. Deriving it from the
launch flag would mean that flipping the site to indexable silently arms a tracker
against a privacy page that forbids one, with nobody having decided it. The two are
separate decisions and the code keeps them separate.

Nothing else needs changing when it flips. Every `data-*` attribute is already in the
markup and is rendered today.

---

## 6. Answering item 22 — conversion by route

Item 22: *"After launch, measure conversion by route (Build / Automate / Blockchain /
Run) and promote the highest-performing buyer problems."*

In the Vercel dashboard, break `buyer_trigger_cta` down by the `model` property for
the four-way split the item names, or by `route` for the six-way split underneath it.
Compare against `buyer_trigger_route` on the same route to separate two different
behaviours: "this problem made them want to read about it" and "this problem made
them want to talk to us". The second is the one worth promoting.

**A limit, stated plainly.** Vercel Web Analytics counts events; it does not follow a
visitor from a route CTA through to a form submission. So `contact_form_submitted` is
a total, not a per-route figure, and "conversion by route" here means *the rate at
which each route's CTA is pressed*, not *the share of submissions attributable to
each route*. Per-visitor attribution would need a different class of tool, a session
identifier, and a different privacy position. That trade was not made.

---

## 7. How to add a tracked CTA

Three steps, and the compiler enforces two of them.

**1. Declare the event** in `src/lib/analytics.ts`, if it is genuinely new. Reuse an
existing name where the action is the same thing on a different surface — that is
what `surface` is for.

```ts
export const ANALYTICS_EVENTS = {
  // ...
  MY_NEW_CTA: 'my_new_cta',
} as const;
```

**2. Attach it** with `analyticsAttrs()`. Never hand-write the attribute.

```tsx
import { ANALYTICS_EVENTS, ANALYTICS_SURFACES, analyticsAttrs } from '@/lib/analytics';

// On the Cta / FLink primitives, via the `analytics` prop:
<Cta href="/contact" analytics={analyticsAttrs(ANALYTICS_EVENTS.MY_NEW_CTA, {
  surface: ANALYTICS_SURFACES.HOMEPAGE_CLOSE,
})}>
  Talk to us
</Cta>

// On a raw <Link> or <a>, spread it:
<Link href="/engineering" {...analyticsAttrs(ANALYTICS_EVENTS.MY_NEW_CTA, {
  route: BUYER_ROUTES.BUILD_SOFTWARE,
  surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
})}>
```

**The page stays a Server Component.** These are plain HTML attributes, not handlers.
Do not add an `onClick` and do not add `'use client'`.

**3. Run the check.**

```
node scripts/analytics_check.js
```

Why the compiler covers you: `analyticsAttrs()` takes union types, so
`ANALYTICS_EVENTS.MY_NEW_CTAA` is a **compile error**, not a silently dead attribute.
Proven — injecting a one-letter typo produces
`error TS2551: Property 'HERO_PRIMRY_CTA' does not exist on type …`.

Why the check covers the rest: hand-writing `data-pt-event="my_new_cta"` bypasses the
compiler entirely, so `scripts/analytics_check.js` renders the pages with
`react-dom/server` and rejects any attribute value that is not in the registry. It
finishes by corrupting its own input three ways and requiring itself to go red on
each, so a green run means something.

---

## 8. Architecture

One client component, mounted once.

```
src/lib/analytics.ts             the registry. No dependency, no browser API.
                                 Server Components import it freely.
src/components/AnalyticsEvents.tsx   'use client'. ONE delegated listener on the
                                 document. The whole client surface.
src/app/layout.tsx               mounts <Analytics /> and <AnalyticsEvents />,
                                 both behind ANALYTICS_ENABLED.
```

Server-rendered links carry `data-pt-event`, `data-pt-route`, `data-pt-surface` and
`data-pt-detail`. On a click the listener walks up from the click target with
`closest()`, reads the attributes off the nearest instrumented ancestor, validates
them, and calls Vercel's `track()`.

**Why not `onClick`.** Attaching a handler to a CTA makes its page a Client Component
and its parents with it. Instrumenting the handoff's five families that way would
have turned the homepage, the work index, the case-study template and the site header
into client components — trading this site's architecture, which deliberately ships
almost no client JavaScript and builds its navigation from native `<details>`
elements, for a measurement feature. Client components before this work: **1**. After:
**2**.

Two details in the listener that are not incidental:

- It listens in the **capture** phase, so the event is seen before anything could stop
  it propagating and before `next/link` starts a client-side navigation.
- It listens to **`auxclick`** as well as `click`, because a middle-click — "open this
  CTA in a new tab", which is an interested visitor — fires no `click` event at all.

The contact form is the one exception and it is the right one: it is already a Client
Component, and a successful submission is a state change rather than a click, so
there is no element for the listener to read. It reports from the **server's answer**,
not from the submit button, so a submission that fails validation or hits an unset
webhook is not counted as a conversion.

---

## 9. Verifying it

```
node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit --incremental false
node node_modules/next/dist/bin/next build
node scripts/analytics_check.js
```

The third renders the homepage, the site header, the work index, a case study and
both states of the shared closing CTA, then asserts the handoff's required coverage
element by element. It also confirms that no inline event handler is rendered
anywhere, which is the regression that would mean the architecture had quietly been
given away.
