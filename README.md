# Pixelette Technologies — 2026 website

A complete Next.js 15 (App Router) implementation of the approved twenty-page
2026 design, "Pixelette Website 2026 · all pages tobedevelopedforgolive".

The architecture the design sets out: **two doors, not three.** Build and
Blockchain are the practices. AI runs through both as engineering. Assurance,
governance and ISO 42001 hand off to Pixelette Certified.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
npm run check-types  # tsc --noEmit
```

Node 18.18+ (Node 20 LTS recommended).

## Verifying it

Two audits ship with the project. Both found real defects during the build —
they are not decoration.

```bash
npm run build && npm start -- -p 4000
python scripts/audit.py --port 4000 --table --checklist
```

`scripts/audit.py` crawls the running site and checks three things: that every
internal link, in-page anchor and asset resolves; that every page has a
canonical, a title and description within what search engines render, exactly
one `<h1>`, an OpenGraph image and Organization schema; and it inventories the
outstanding placeholders. It exits non-zero if links or SEO fail. Standard
library only.

`--checklist` regenerates `GO-LIVE-CHECKLIST.md` from the same crawl, so the
checklist can never drift from what the site actually renders. Run it after
filling any placeholder.

`scripts/responsive.js` runs in the browser console on the running site. It
loads every page at 360/390/768/1024/1440px, reports any horizontal overflow
with the offending element named, and confirms the navigation switches at the
860px breakpoint.

Dependency licences are recorded in `DEPENDENCIES.md`; regenerate it after any
dependency change.

## Stack

Next.js 15.5, React 19, TypeScript, hand-written CSS. **Three runtime
dependencies** (`next`, `react`, `react-dom`) and no CSS framework — the design
is small and specific enough that hand-written CSS is smaller and faster than a
utility framework, and it removes a whole class of build-tooling risk.

Fonts (Outfit, Newsreader, IBM Plex Mono) are self-hosted through `next/font`,
not linked to Google's CDN. That removes a render-blocking third-party request,
eliminates the layout shift the linked version causes, and keeps visitor IP
addresses off a third party — which the security-and-data page has to be able to
state truthfully.

Every page is a Server Component. The only client-side JavaScript on the whole
site is the contact form (~1.3 kB). The mobile menu is a native
`<details>`/`<summary>` disclosure, so it works before hydration and with
JavaScript disabled.

## Layout

```
src/
  app/                      one folder per route
    globals.css             the entire design system
    layout.tsx              shell, fonts, Organization + WebSite schema
    opengraph-image.tsx     social card, generated at build time
    sitemap.ts robots.ts    generated from src/content/nav.ts
  components/               header, footer, shared sections, UI primitives
  content/                  ALL copy and facts live here, not in pages
  lib/
    seo.ts                  per-page metadata builder
    schema.ts               JSON-LD builders
public/
  logos/ work/ team/        real client logos, case-study art, portraits
  llms.txt                  plain-text brief for answer engines
```

### Why the content layer exists

`src/content/` is the single source of truth for every fact on the site. The
Clutch rating is defined once; the certification table is defined once; the
footer, the sitemap and the navigation are all generated from one `routes` list.
The previous site shipped a broken footer because those lists were maintained
separately — here they cannot drift apart.

## The placeholder rule

The design states it plainly: *"Placeholders stay visible until a real
engagement fills them. We do not use stock case studies."*

Anything not yet verified renders through the `<Placeholder>` component as
amber monospace text in square brackets — `[CLIENT]`, `[ENQUIRIES EMAIL]`,
`[RETENTION SCHEDULE]`. They are deliberately conspicuous, carry a
`data-placeholder="true"` attribute so they can be found programmatically, and
must be filled before go-live.

**There are 75 of them. `GO-LIVE-CHECKLIST.md` lists every one, grouped by what
blocks launch, and is generated from the rendered pages rather than maintained
by hand.**

To find them in a browser, `document.querySelectorAll('[data-placeholder]')` on
any page. Do not count them by grepping `.next/` — Next inlines the RSC flight
payload into each HTML file, so every placeholder appears there twice.

Nothing was invented to make a section look finished. No fabricated client
names, no estimated percentages, no made-up email addresses, no invented legal
wording.

## SEO, GEO and AEO

**Classic SEO.** Per-page title and meta description sized to what search
engines actually render (titles ≤ 65 characters including the site-name suffix,
descriptions ≤ 160). Canonical URL on every page. Generated `sitemap.xml` and
`robots.txt`. Semantic HTML with exactly one `<h1>` per page and a correct
heading hierarchy. Generated OpenGraph card. `/work` filters are real server-
rendered URLs rather than client-side state, so each filtered view is crawlable
and links to `/work` as its canonical.

**Structured data.** `Organization` (with `aggregateRating` from the verified
Clutch figures and `hasCredential` listing *only* the certificates this legal
entity actually holds), `WebSite`, `BreadcrumbList`, `Service` with published
price bands, `Article` on case studies, `ContactPage`, and `FAQPage` on
seventeen pages.

**AEO / GEO.** Fifty question-and-answer pairs across the site, each written so
the answer stands alone when lifted out of the page — the unit an answer engine
quotes. `public/llms.txt` gives crawlers a plain-text brief of the entity, the
services, the prices and the named results. AI crawlers are allowed
deliberately: the site's commercial strategy is that the methodology is public
so a buyer can judge the work before paying for it, and buyers increasingly do
that judging through an answer engine.

`llms.txt` also tells answer engines two things explicitly, because getting
either wrong would be commercially damaging: that ISO/IEC 42001 belongs to
Pixelette Certified and must not be attributed to Pixelette Technologies, and
that a bracketed placeholder is not a measured result and must not be filled in.

## Accessibility

Skip link, visible focus rings throughout, 44px minimum interactive targets,
`aria-current` on active navigation, live-region feedback on the contact form,
`prefers-reduced-motion` honoured, and every decorative SVG hidden from
assistive technology. Wide tables scroll inside their own container so the page
body never scrolls horizontally.

Verified with no horizontal overflow at 360px, 390px, 768px, 1024px and 1440px.

## Contact form

Posts through a Server Action, so it submits with JavaScript disabled.
Validation is server-side, with a honeypot field for bots.

Delivery has two legs, changed 2026-09-14 in commit `a3745f0`. The enquiry is
written to a **Supabase** table and a notification is sent through **Resend**.
Neither SDK is installed — both are plain HTTP calls, so the dependency count is
unchanged. The legs fail independently and both always run: success is returned
only if at least one landed, because an enquiry that is stored is in the record
and one that is emailed is in front of a person, and either beats losing it.

Four variables configure it: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`RESEND_API_KEY`, `CONTACT_NOTIFICATION_FROM`. **No secret is committed** — only
the variable names appear in source. If nothing is configured, or both legs fail,
the visitor is told plainly and given the fallback route rather than shown a
success message for an enquiry that went nowhere. See `CONTACT-FORM-SETUP.md`.

This paragraph previously said delivery went "to whatever endpoint
`CONTACT_WEBHOOK_URL` names". That variable is read by no code here any more.

## Known items

- **Client logo artwork is unusable on a light background.** The "Trusted by"
  row renders client names as text, which is what the design specifies — but it
  is also the only workable option: the logo files in the current asset library
  are white-on-transparent, drawn for the old dark-themed site. SIB360 and CAST
  Perimeter are invisible on white, gowalkies is a mid grey, and no single CSS
  filter corrects both. The similarly named SVGs in that library are unfinished
  exports — solid black rectangles. Switching to an image row needs
  light-background artwork per client; `src/content/clients.ts` keeps the paths
  so the swap is a one-line change.
- `postcss`, bundled inside every current Next.js release, carries an open
  advisory (GHSA-qx2v-qp2m-jg93 and related). It affects build-time CSS
  processing only, no fix exists in any stable Next release, and all CSS here is
  authored in-repo, so there is no attacker-controlled input. Re-check on the
  next Next.js major.
- Twelve of the design's twenty boards are pages; three are alternates or mobile
  renderings of boards already built (front page split-screen, front page 390px,
  AI landing 390px) and are implemented as responsive behaviour rather than
  separate routes. Two routes were added that the design references but does not
  board: `/ai-engineering/evaluation-and-observability` and
  `/industries/insurance-financial-services`, both of which the design links to.
