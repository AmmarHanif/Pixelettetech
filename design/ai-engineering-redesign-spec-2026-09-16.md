# /ai-engineering — next-iteration design specification

Date: 2026-09-16
Author: ui-ux-designer (design owner, pre-build)
Target file: `src/app/ai-engineering/page.tsx`
Status: SPECIFICATION. Nothing here is built. This is a handoff to `frontend-engineer`.

Read before implementing: `src/components/sections.tsx`, `src/components/ui.tsx`,
`src/app/globals.css`, `src/content/work.ts`, `src/content/sources.ts`,
`src/content/company.ts`.

---

## 0. Journey this page serves (named)

**Journey name: "The unconvinced AI buyer".** A senior operator who already owns AI
somewhere, is not seeing a return, and is deciding within about ninety seconds whether
this firm is a serious engineering supplier or another vendor. Entry is usually search or
the nav (`AI & Automation`), rarely the homepage. Exit is `/contact`, a capability
sub-page, or away.

The page must answer, in order: *do these people actually understand this* (capabilities +
layer diagram + principles) -> *would they understand MY problem* (where AI earns its
place) -> *has it worked once, for real* (Lytics) -> *are they a follower or a builder*
(private AI development) -> *how do I start* (closing).

Everything not serving that path is a candidate for removal, and section 1 below acts on
that.

---

## 1. (A) THE STRUCTURAL DECISION — the four existing blocks his flow does not mention

### 1.1 "The gap" section — **FOLD. Keep the figures, delete the prose.**

Decision: the section as a section goes. The two McKinsey figures and their `SourceNote`
survive, promoted to a thin evidence band sitting directly under the hero. The two
paragraphs ("Almost every organisation now has AI somewhere…" and "That gap is the whole
of our business.") are deleted outright.

Why fold rather than keep:
- The prose IS a genuine repeat, and it repeats in two directions at once. It restates the
  h1 in longer form ("very few can point at a line in the accounts"), and it pre-empts
  "Where AI earns its place", which is the new section about exactly the same subject:
  where AI does and does not pay off. His instruction 8 names this case.

Why fold rather than remove:
- The h1 — "Most companies have bought AI. Very few are getting paid for it." — is the
  strongest sentence on the page and it is a **claim about the market**. Those two figures
  are the only third-party citation on the page and the only thing that makes the h1
  evidenced rather than asserted. Deleting them leaves this site's boldest line as its
  least supported one, which is the precise failure mode `claims.ts`, `sources.ts` and
  `work.ts` exist to prevent. It would also be the one page change most likely to be
  quoted back by a procurement reviewer.
- 80% / 37% also appear in FAQ 1, which feeds FAQPage JSON-LD. Holding them visible keeps
  the machine-readable answer and the visible page in agreement, which `Faqs` was
  built to enforce.

Net effect: roughly 150px of prose removed, one whole `<Section>` (96px top and bottom
padding plus a border rule) removed, citation and evidence intact. This is the single
biggest "shorter and stronger" win on the page.

Implementation must keep the existing fail-closed guards: the `gapStats.length > 0`
condition, and the derived `gapSources()` attribution (never `gapStats[0]!.source` — that
shape has already taken a sibling page down).

### 1.2 "Where this sits" hub (`ValueModelCards`) — **KEEP, move to the foot, and absorb the "Came for a build?" card into it.**

Decision: keep the section and its current copy verbatim ("Automate is one of our four
services" / "Build, Decentralise and Run are the other three" / `current="AUTOMATE"`).
Move it from position 4 to position 9, immediately after Private AI development and before
the FAQs. Tint it `#F7FAFA`. **Delete the "Came for a build rather than for AI?" card
entirely.**

Why keep: it is the site's navigation spine, it is recent founder-directed copy, the h2 and
the `current` marker are coupled by an explicit warning in the source, and it is the only
thing on the page that tells a search-arrival reader which of four practices they are
standing in. Removing it would be a navigation regression, not a length win.

Why move: it is an orientation and exit device, not an argument. At position 4 it
interrupts the page mid-case, between "what we do" and "how we think", and asks the reader
to consider leaving before they have been given a reason to stay. At the foot it is an
exit ramp for a reader who has decided this is not their practice — which is what it is
for.

Why delete the build card: you flagged this correctly and it is a real duplication. The
"Came for a build rather than for AI?" card links to `/engineering`; the BUILD card in
`ValueModelCards` links to `/engineering`. Two doors, one destination, roughly 300px
apart, with two different sets of words for the same thing. The `ValueModelCards` version
is better (it is the canonical, drift-proof copy, and it names the destination the way the
nav names it), so the bespoke card is the one that goes.

Tint note: the source comment says this section was deliberately left untinted because
"The method" below it was tinted and two tinted bands in a row break the rhythm. That
constraint no longer holds — the method section was removed on 2026-09-16, and under the
new order this section is preceded by the dark Private AI band. Tinting is now correct.
Record that reasoning in the code comment when you change it, in the house style.

### 1.3 Testimonials — **REMOVE from this page.**

Decision: delete `<Testimonials heading="Voices" />` from `/ai-engineering`. Do not change
the component. It continues to render on `/about` ("What clients say") and `/engineering`
("What clients say"), so nothing is orphaned and no client voice leaves the site.

Why: `Testimonials` takes no filter and defaults to `featuredTestimonials`, a global
featured pair. There is no mechanism by which those two voices are AI clients. That is
**the identical defect the founder himself had removed from this page on 2026-09-16**,
when the client row came out on the grounds that "none of those names are AI clients" and
that the component "renders the WHOLE approved client list, so this page was showing seven
names because the component exists, not because any of them belong to the subject." Same
component-driven, subject-blind inclusion; same answer.

Second reason: it directly undercuts Lytics. The page's proof strategy is one deliberately
selected, named, in-production AI system. Bolting two unrelated quotes underneath it
converts specific proof into generic reassurance, and costs a full 96px section to do it.

If he wants a voice on this page later, the component already accepts `items`, so a single
AI-engagement testimonial can be passed into the Lytics block. Only do that if such a
testimonial genuinely exists. Do not repurpose a non-AI quote onto an AI page.

### 1.4 FAQs — **KEEP all four, rewrite one, move below the hub.**

Decision: keep the `<Faqs>` render and the `faqSchema(faqs)` JSON-LD. Keep four questions.
Rewrite the answer to Q3 (see §2.10). Position it second from the end, after the hub,
before the closing CTA.

Why keep:
- Real SEO/AEO value, as you say, and it is the page's only structured-data surface beyond
  Service and Breadcrumb.
- It is close to free in perceived length. `.faq` renders `<details>` collapsed by
  default, so four questions cost four ~66px rows. A page cannot be meaningfully
  "shorter" by deleting 260px of collapsed accordion, and it can be meaningfully weaker.
- Deleting the render while keeping the schema is not an option: `Faqs` exists precisely
  because 32 pages were emitting FAQPage markup with no visible answers, which is a Google
  structured-data policy breach with a manual-action exposure, and `scripts/audit.py` now
  fails the build on it. So it is keep both or lose both, and losing both is a pure
  subtraction of value.

Why rewrite Q3: its current answer states "a UK-headquartered business with £100m to £500m
revenue… sponsored by a COO or Head of Transformation, approved by a CFO and reviewed by a
CISO". That is audience defined by company size and geography — the exact thing the new
section 3 is instructed not to do — and it contradicts the objective that this page reads
for a broad range of organisations. Leaving it in the FAQ puts the banned framing into the
machine-readable data while the visible page refuses it. The "who this is not for"
qualifier itself is valuable and stays; only the profile goes.

### 1.5 Two further removals that fall out of the same rule

- **`CertifiedHandoff variant="compact"` — fold into one line.** See §2.4. It is a dark
  panel, and under this design the page has exactly one dark band and it is Private AI
  development. The boundary it carries is legally load-bearing and is preserved as a
  single composed line plus FAQ 4.
- **The "Who we work with" section** — replaced by "Where AI earns its place", as
  instructed. Note what leaves with it: two sourced figures (Thomson Reuters 78%/7%, Bank
  of England / FCA) and two links to `/industries/...`. The figures are safe to lose from
  this page; they are owned by the industry pages. **The two industry links are not
  currently replaced anywhere on this page.** Flagged in §7.

---

## 2. (B) SECTION-BY-SECTION FINAL COPY

Every string below is final copy to be pasted, not a description. UK English, sentence
case. No figure, percentage, metric or price is introduced anywhere.

### 2.1 Hero

- Eyebrow: `AI engineering · part of Automate`
  **This is a correction, not a preference.** It currently reads "part of Build", while
  `ValueModelCards current="AUTOMATE"` further down the same page marks this page as
  Automate and the nav calls it "AI & Automation". The page contradicts itself today.
- h1 (unchanged, `.h1`, `maxWidth: '21ch'`):
  `Most companies have bought AI. Very few are getting paid for it.`
- Lead (replaces a three-clause sentence carrying the Certified disclaimer):
  `We engineer AI into the systems an organisation already runs, measure what it changes, and keep it working in production.`
  What was cut and where it went: "UK mid-market businesses" is dropped because it is
  audience-by-geography-and-size and contradicts the broad-range objective; the whole
  Certified clause moves to the boundary line in §2.4 and stays in FAQ 4.
- CTAs (both unchanged):
  primary `Book a conversation` -> `/contact`; secondary `See a sample report` ->
  `/ai-engineering/support-and-run`.
  Do not re-word the secondary. Its label was set deliberately on 2026-09-16 to match the
  destination page's own button, and "sample" is load-bearing because the panel it points
  at is a captioned mock.

### 2.2 Evidence band (the folded gap figures)

No heading. No eyebrow. No prose. Two figures and one attribution line.

- `80%` / `of individual AI users report they are more productive`
- `37%` / `of organisations can attribute any EBIT impact to it, unchanged year on year`
- `McKinsey State of AI, August 2026, n=1,719`

All three strings come from `gapStats` and `gapSources()`. **Do not retype them into the
page.** Reuse the existing register and the existing derived attribution.

### 2.3 Core AI engineering capabilities

- Eyebrow: `What we do`
- h2: `Five things we engineer. One we deliberately do not.`
- Lead paragraph: **none.** This is deliberate. Five cards below carry the content; a
  paragraph introducing a list of five headed cards is the padding his rule bans.
- Right-aligned link beside the h2 (unchanged): `All AI services` -> `/ai-engineering/services`

Card bodies, cut to one line each (currently two to three sentences each):

| Tag | Title | New body | Link label | Href |
|---|---|---|---|---|
| Build | Production AI Systems | `AI inside a named workflow, with the workflow redesigned around it. Human in the loop by default.` | `See how we build` | `/ai-engineering/production-ai-systems` |
| Ready | Data & Integration | `Entitlement-aware access to your systems of record, and the context layer that makes them usable by a model.` | `What we build` | `/ai-engineering/data-and-integration` |
| Measure | Value Discovery | `Four weeks. We instrument the process, measure what it costs today, and write the business case.` | `What the four weeks covers` | `/ai-engineering/value-discovery` |
| Prove | Evaluation & Observability | `Test sets, regression checks and monitoring, so you see output quality move before your users do.` | `How we measure` | `/ai-engineering/evaluation-and-observability` |
| Run | Support & Run | `We keep it running, AI included, under contract, with a monthly report showing what changed.` | `From £1,500 / month` | `/ai-engineering/support-and-run` |

**PRICE: `From £1,500 / month` is retained exactly as it stands.** It is the only price
string on the site and the founder is actively deciding about it. Not removed, not moved
to a different card, not re-worded. Flagged again in §7.

"Agentic only where it earns it, and reversible when it does not" is deliberately cut from
the Production AI Systems card because it moves, near-verbatim, into principle 3 in §2.6.
That is a consolidation, not a loss.

### 2.4 The boundary line (replaces the Certified dark panel)

One line at the foot of the capabilities section, under the card grids. Not a card. Not a
panel. Not an icon.

Rendered text: `We engineer it. Certified helps you govern, evidence and prepare it for assurance.`
followed by an `FLink` labelled `Who does what` -> `/assurance`.

**That sentence must be composed from `certified.positioningLine` in
`src/content/company.ts`. Do not type it into the page as a literal.** It is
accreditation-safe wording with exactly one home, it replaced "we build it, Certified
proves it", and a hand-typed second copy is how that displaced claim comes back. If you
need the practice name in the sentence, use `certified.name`.

What is lost by dropping the panel: the outbound `pixelettecertified.com` link. It is
preserved on this page by the footer group band, and `/assurance` and `/certifications`
own the full handoff. FAQ 4 keeps the machine-readable version of the boundary.

### 2.5 Where AI earns its place

- Eyebrow: `Fit, not sector`
  This eyebrow does real work: it tells the reader before they read a word of the section
  that this is not an industry list, which is the entire point of the replacement.
- h2: `Where AI earns its place`
- One paragraph (his supplied copy, contractions expanded to house style):
  `We do not define a good AI opportunity by industry or company size. We look for work where better context, reasoning, coordination or automation can materially change the outcome.`
- Four items. **The one-line descriptions he supplied for each were not passed through to
  me.** The lines below are proposals written to his brief; if his own lines exist they
  take precedence verbatim and these are discarded. Flagged in §7.

| Label | Line |
|---|---|
| Fragmented knowledge | `The answer exists somewhere in your systems, and nobody can reach it in time to use it.` |
| Complex workflows | `Too many steps, too many handovers, and a decision that depends on all of them.` |
| Automation that stops too early | `The rules-based part was automated years ago. The part that needs judgement was not.` |
| New AI opportunities | `A product, service or revenue line that was not buildable before, and is now.` |

Nothing else in this section. No closing paragraph, no CTA, no links. His instruction was
explicit: do not add more audience narrative than this.

### 2.6 The model layer visual ("AI is more than the model")

- Eyebrow: `Anatomy`
- h2: `The model is one layer of five.`
  This is a rename of his working title. His phrase "AI is more than the model" is a
  statement of what the section argues; this one is a statement of what the diagram
  *shows*, which is what lets the visual replace the paragraph instead of illustrating it.
  Same meaning, fewer words, and it sets up "model agnostic" two sections later.
- One paragraph:
  `Most AI that disappoints is a good model wired into an unchanged process, with no way to tell whether the output is still right. The engineering is the other four layers.`
- The diagram. Five stacked bands, each a mono label plus three or four short chips. All
  labels are real text, per ADR-0009 — indexable, reflowable, readable by a screen reader.
  No image asset. No robot, brain, circuit board or humanoid figure anywhere near it.

| Order | Layer | Chips | Treatment |
|---|---|---|---|
| 1 | Workflow | `Steps` · `Handovers` · `Human review points` · `System of record` | ours |
| 2 | Context and data | `Entitlements` · `Retrieval` · `Semantic layer` · `Audit log` | ours |
| 3 | Model | `Prompting` · `Tools` · `Fine-tuning where it pays` | **supplied** |
| 4 | Control | `Guardrails` · `Fallbacks` · `Reversibility` · `Approval gates` | ours |
| 5 | Evidence | `Test sets` · `Regression checks` · `Drift` · `Cost telemetry` | ours |

Band 3 carries a small mono marker: `Supplied and swappable`.

No caption under the diagram. The "model agnostic" point is made by principle 2 in the
next section, and saying it twice is the repetition he asked to have removed.

### 2.7 How we approach AI engineering

- Eyebrow: `How we work`
- h2: `Opinionated in four places.`
- No paragraph. Four sentences is the section.

| # | Principle | Sentence |
|---|---|---|
| 01 | Problem first | `We start from the process and the number it moves, not from the model.` |
| 02 | Model agnostic | `No vendor loyalty. The model is a swappable component and we assume it will be swapped.` |
| 03 | Controlled autonomy | `Human in the loop by default. Agentic only where it earns it, and reversible where it does not.` |
| 04 | Measure what matters | `If we cannot measure the outcome before we start, that is the first thing we build.` |

### 2.8 Lytics

- Eyebrow: `Proof`
- h2: `One AI system, named, in production.`
  The current h2 is `Named clients. Named processes. No invented numbers.` — plural clients
  over a single study. It has to change.
- Selection line, directly under the h2, `.small`. This is the sentence that makes Lytics
  read chosen rather than sole:
  `We have other case studies. This is the one where the subject is AI, the system is in production, and the client is named.`
- Right-aligned link beside the h2 (unchanged): `Read the full case studies` -> `/case-studies`
- Three column labels, mono, uppercase: `Challenge` · `What we engineered` · `Outcome`
- Column bodies: **not authored here.** They are read from the publication accessors. See
  §4 for the exact mapping. Do not retype the narrative into the page; if a column reads
  too long, edit `src/content/work.ts` under its own comment conventions.

### 2.9 Private AI development

- Eyebrow: `Beyond client delivery`
- h2: `Not everything we build is for a client.`
- One paragraph:
  `Alongside client work, we fund and run our own AI development. It is where the engineering above gets tested on problems we own, on our own timeline. We do not discuss it publicly beyond naming the areas.`
  The last sentence is doing deliberate work. It closes the subject rather than teasing it,
  and it is the sentence that stops a reader waiting for a product name.
- Four development areas, one line each:

| Area | Line |
|---|---|
| Commercial intelligence | `Systems that understand a pipeline well enough to act on it.` |
| Marketing intelligence | `Reading a market continuously, rather than reporting on it monthly.` |
| Organisational intelligence | `Giving an organisation reliable memory of its own decisions.` |
| Professional workflow intelligence | `Bringing judgement-heavy professional work under the same engineering discipline.` |

- One CTA, his label: `Discuss a strategic AI opportunity` -> `/contact`

**Hard prohibitions for this section, restated so they cannot be lost in implementation:**
no screenshot, no mockup, no architecture diagram, no feature list, no price, no launch
date, no roadmap, no per-area link, no per-area CTA, no "coming soon", no "early access",
no "waitlist", no counts, no dates. No product codename anywhere — not in copy, not in
`alt`, not in `aria-label`, not in a comment, not in metadata, not in a CSS class name, not
in an analytics `detail` string.

### 2.10 FAQs — final four

1. Q `Why can so few organisations show a return on AI?`
   A — unchanged. It carries the 80%/37% figures and the McKinsey attribution and keeps the
   schema in step with the visible band at §2.2.
2. Q `What is a Value Discovery?`
   A — unchanged.
3. Q `Who is Pixelette Technologies AI engineering not for?`
   A — **rewritten**, profile removed:
   `Organisations looking for developers by the day, a first AI experiment with no budget line behind it, or a supplier who will build something and leave. We sell the running of it, and that only works when someone owns the outcome.`
4. Q `Does Pixelette Technologies audit or certify the AI it builds?`
   A — unchanged. This is now the machine-readable home of the boundary that the removed
   Certified panel used to carry visually, so it must not be cut.

### 2.11 Closing CTA

- Eyebrow `Start here`, title unchanged:
  `First we find out where you are, then we agree what is worth doing`
- Body, shortened from 46 words to 29:
  `We instrument two or three of your processes, measure what they cost today, and write the business case. If the numbers do not support going further, we say so.`
- Aside: unchanged. Keep the Value Discovery inclusions panel, the four `CheckList` items
  and `Four weeks · No procurement cycle required`. It is the only place the four weeks are
  itemised and it is the page's conversion surface.
- CTA label: `Book a conversation` (the `ClosingCta` default). Do not override.

---

## 3. (C) LAYOUT AND HIERARCHY

### 3.1 Visual weight ladder for the whole page

1. h1, serif, `clamp(38px, 5.2vw, 64px)`
2. The two figures, mono 44px in `--brand`
3. The Private AI band, the only full-bleed dark ground on the page
4. The Lytics media slot and its h3
5. Section h2s, serif `clamp(30px, 3.4vw, 42px)`

Everything else is `.body`, `.small` or `.mono` label scale. Nothing new is introduced
above `.h2` and no new type size is invented anywhere in this spec.

### 3.2 Per section

**Hero.** Unchanged structure: `.hero-glow` wrapper, `padding: '80px 0 64px'`, `.wrap`.
Whitespace does the work — three elements and a button row over a radial tint. Nothing
added. At 400px `.btn-row` already goes `flex-direction: column` with full-width buttons.

**Evidence band.** `<Section tight>` (64px, 48px on mobile), no heading. Two figures side
by side, then the attribution on its own line beneath both. Do **not** use `.card` here:
bordered, shadowed cards would make two statistics look like a product grid and would
re-import the visual weight the fold was meant to remove. Use bare figure blocks with a
left hairline in `--line` and 28px of horizontal padding. Wrap in the existing
`gapStats.length > 0` guard so an emptied register renders no band at all rather than an
empty rule. At 400px they stack, with the hairline becoming a top rule.

**Capabilities.** Keep the existing two-tier shape but change which cards are large.
`grid-2` of two `.card.service-card` at the top: **Production AI Systems and Data &
Integration**. `grid-3` of three below: Value Discovery, Evaluation & Observability,
Support & Run. Today the large pair is Support & Run and Production AI Systems, which
leads a page about engineering depth with a support retainer. The two that demonstrate
engineering are the two that get the size. It also moves the price string out of the
largest tile without removing it. Keep `.icon-slot--stacked` on the large cards, no icons
on the small three (as today), keep the `flexGrow` spacer so link labels bottom-align.
`.grid-2` and `.grid-3` both collapse to one column at 860px, so 400px is a single stack
of five.

**Boundary line.** Full width, `.small`, `maxWidth: '72ch'`, 32px above, separated from the
grid by an `<hr className="rule">`. A rule and a sentence, not a container. This is the
section where whitespace explicitly replaces a component.

**Where AI earns its place.** Tinted `#F7FAFA`. `.grid.grid-4`, and **no `.card`**. Each
item is a column with a 1px `--line` top rule, 20px of padding above the label, a mono
uppercase label in `--muted`, an `.h4` title and one `.body` line at 15px. Borderless is
the point: it follows a five-card grid, and a second boxed grid immediately after it makes
the page feel like a catalogue. `.grid-4` goes to 2-up at 1000px and 1-up at 560px; at
400px this reads as a clean rule-separated list, which is the best mobile form of this
content.

**The model layer visual.** Full width, white. Five stacked bands, `display: grid`, `gap:
10px`, `maxWidth: 940px`. Each band: `border: 1px solid var(--line-2)`, `border-radius:
8px`, `padding: 18px 22px`, mono uppercase label left at a fixed `flex: 0 0 150px`, chips
right in a `.pill-row`. The four "ours" bands take `border-left: 3px solid var(--brand)`.
Band 3 (Model) takes `border-left: 3px solid var(--line-4)`, `background: #f6f8fa`, and the
`Supplied and swappable` mono marker. **Colour is not the only signal** — the marker text
carries it too, which is required and is also the reason a screen-reader user gets the
point.
Semantics: an `<ol>` with an `aria-label` describing the stack, exactly as
`ReferenceArchitecture` does. It must not be a div stack.
At 900px and below the label moves above the chips (`flex-direction: column`), which keeps
every band readable at 400px without horizontal scroll.
**Do not reuse `ReferenceArchitecture` itself.** That component lives on
`/ai-engineering/data-and-integration` and re-rendering it here repeats the `LiveDiagram`
mistake the founder called out on 2026-09-16. Borrow the `--ours` idiom, not the diagram.

**Principles.** Tinted `#F7FAFA`. `.grid.grid-4`, no cards, no rules. `01`–`04` in the
existing `.step__n` mono treatment, `.h4` principle name, one `.body` line at 15px. This
is visually distinct from "Where AI earns its place" (which is tinted-plus-rules-no-numbers)
by being tinted-plus-numbers-no-rules. Different enough not to read as the same block
twice, similar enough to read as one family.

**Lytics.** White, and the only section allowed to spend real vertical space.
Structure top to bottom:
1. Section head row (h2 + `Read the full case studies` link), as today.
2. Selection line, `.small`, `maxWidth: '70ch'`.
3. Kicker (mono, `.work-card__kicker`) and `.h3` title.
4. `MediaSlot` at `ratio="16 / 7"`, full width of `.wrap`.
5. A mono meta line under the image: stack and duration.
6. `.grid.grid-3` with exactly three children: Challenge / What we engineered / Outcome.
7. `FLink` with the card CTA label.

**This fixes a live defect.** Today the proof section renders `className="grid grid-3"`
containing a single mapped child, so since the second study was removed on 2026-09-16 the
page's only piece of first-party evidence has been sitting in the left third of the
viewport with two empty grid tracks beside it. Whatever else is or is not accepted from
this specification, that needs fixing.

Metrics guard: `publishedMetrics(cs)` returns `[]` for Lytics today (all four figures are
`HELD`). Render the metrics row **only** when `.length > 0`, never an empty
`.work-card__metrics` flex container. The Outcome column already states in words that the
figures are held, so the absence is explained rather than merely empty.

**Private AI development.** See §4 (D) below.

**Hub.** Tinted `#F7FAFA`, `ValueModelCards current="AUTOMATE"` unchanged. `.grid-4` -> 2-up
at 1000px -> 1-up at 560px, already handled.

**FAQs.** White, unchanged, `maxWidth: '80ch'`.

**Closing.** White, `.split--cta` unchanged.

### 3.3 Motion

Nothing new. Existing `.service-card:hover { transform: translateY(-2px) }` stays on the
five capability cards and nowhere else. The borderless sections, the layer diagram and the
dark band get **no** hover transform, no reveal, no scroll animation, no counter. The
global `prefers-reduced-motion` block already neutralises transitions; do not add anything
that escapes it (no inline `requestAnimationFrame`, no IntersectionObserver reveals).

### 3.4 Band rhythm, top to bottom

glow -> white (tight) -> white -> tint -> white -> tint -> white -> **dark, full bleed** ->
tint -> white -> white.

The dark band arrives after seven light bands, which is what makes it land.

---

## 4. (D) MAKING "PRIVATE AI DEVELOPMENT" DISTINCT WITHOUT LOOKING LIKE A LAUNCH

This is the hardest section on the page and it fails in one of two directions: it either
disappears into the page, or it turns into a teaser. The design below is built so that the
teaser failure is structurally unavailable — there is nowhere to put a screenshot, nothing
to click per area, and no container that could become a product card.

**1. Full-bleed dark ground, not a panel.** The section runs edge to edge on
`var(--dark)` (`#27033b`) with `.wrap` inside it, `padding: 96px 0` (`64px` at 860px). It
is the only dark band on the page, which is exactly why the `CertifiedHandoff` compact
panel had to be folded away in §2.4.

**Use `var(--dark)`, not `.dark-panel`.** `.dark-panel` is a rounded, bordered, teal-black
gradient (`#04211f -> #080f0f`) left over from the pre-2026-09-03 teal palette. It reads as
a *component placed on* the page. `var(--dark)` is the same purple-black as the footer and
the `.dash` mock, so this band reads as *part of* the site's own dark system, and it sits
harmoniously above the footer rather than as a second, differently-coloured black. Add a
small class in `globals.css`, for example `.band-dark { background: var(--dark); color:
var(--dark-text); }`, alongside `.dark-panel` rather than modifying it — `.dark-panel`
renders on `/`, `/assurance` and `/certifications` and must not change.

**2. No containers at all.** Everything else on this page is inside a border: cards, tiles,
rules, bands. Here, nothing is. Four development areas are a rule-separated register, not
four boxes. A box is what makes something look like a product; the absence of one is the
single strongest "these are not products" signal available, and it costs no words.

**3. Asymmetric split, with the areas subordinate.** Use `.split--wide-left`
(`1.6fr / 0.9fr`):
- **Left (wide):** eyebrow in `--mint`, h2 in `--dark-head` at `.h2`, the one paragraph at
  16px/1.65 in `--dark-text` capped at `46ch`, then the CTA.
- **Right (narrow):** the four areas as a `<dl>`. Each row: `border-top: 1px solid
  var(--dark-line)` (first row included), `padding: 18px 0`. `<dt>` is mono, 11px,
  `letter-spacing: 0.14em`, uppercase, in `--mint`. `<dd>` is 15px/1.55 in `--dark-text`,
  `margin: 8px 0 0`, capped at `44ch`.

The asymmetry is the argument. The *position* gets the width; the *areas* get a narrow
column of hairlines. A product launch would do the reverse.

**4. No icons, no numbers, no order signal.** No `.icon-slot`, no `01`–`04`, no arrows, no
chevrons, no status chips. Numbering implies a sequence and therefore a roadmap. Icons
imply products. Both are banned here.

**5. One CTA, and it is a link, not a button.** `Discuss a strategic AI opportunity` ->
`/contact`, rendered as an `FLink`, not a `Cta`. A filled purple `.btn` on a dark ground at
the end of a section about unannounced work is the exact visual grammar of a launch page.
A single text link with an arrow is the grammar of a standing invitation.
- Contrast: add `.band-dark a.flink { color: var(--mint); }` to `globals.css`. `--brand`
  (`#661a8f`) on `#27033b` is unreadable; `--mint` (`#d9b8f0`) on `#27033b` is high
  contrast.
- Analytics: `ANALYTICS_SURFACES` has no entry for this section. Add
  `AI_PRIVATE_DEVELOPMENT: 'ai-private-development'` and pass
  `analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, { surface: ... })` through
  `FLink`'s existing `analytics` prop. Without this, the page's third conversion route is
  invisible while the other two are tracked, and the founder will read a false conversion
  picture.

**6. Typographic restraint, stated as rules.** No bold inside the paragraph. No italics. No
quotation marks. No superlatives ("world-class", "breakthrough", "next-generation",
"revolutionary"). No future tense that implies a release ("will launch", "is coming",
"shipping"). The only tense is present and the only claim is that the work exists.

**7. Accessibility.** `<Section labelledBy="private-heading">` with the h2 carrying
`id="private-heading"`. A `<dl>` is the correct element for term-and-description pairs; do
not fake it with styled `<div>`s. `--dark-text` `#ffffff` on `#27033b` and `--mint`
`#d9b8f0` on `#27033b` both pass AA comfortably at these sizes. Body text on the dark
ground is 15px minimum, never 13px.

### 4.1 Residual-inference risk, flagged rather than decided

Four internal codenames are banned and none appears here. But "Professional workflow
intelligence" described as "judgement-heavy professional work", sitting beside
"Commercial intelligence" described in pipeline terms, is specific enough that a reader who
already knows the estate can map the areas to the products. The founder supplied the four
area names, so the names stand; the *descriptive lines* are mine and can be made more
abstract if he wants the inference closed. This is his call, not mine, and it is raised
rather than silently resolved either way.

---

## 5. THE WORK.TS ACCESSOR CONTRACT FOR LYTICS

Every displayed element of the Lytics block, and which accessor it must come from.
`const cs = caseStudies.find(c => c.slug === 'lytics')`.

| Displayed element | Accessor / field | Value today | Why the gate matters |
|---|---|---|---|
| Client name, anywhere it is shown | `displayName(cs)` | `Lytics` | Returns `anonymisedName` if permission is ever withdrawn. Never read `cs.client`. |
| Kicker above the title | `displayKicker(cs)` | `Lytics · Media intelligence · Production system` | Same gate, same shape either way. Lytics is not `internal`, so the `cs.internal` branch on the current page is not needed here. |
| Image `src` | `publishedImage(cs)` | `/work/lytics.png` | Returns `undefined` while a name is gated, because a product screenshot carries the client's name inside the pixels. Never read `cs.image`. |
| Image `alt` | `` `${displayName(cs)} — ${cs.title}` `` | — | Composed from the gated name, so the alt text cannot leak a name the image is hiding. |
| Image placeholder label | `cs.imageLabel` | `Product screenshot · the actual interface` | Not gated; it describes the slot, not the client. |
| Figures | `publishedMetrics(cs)` | `[]` | All four are `HELD`. **Render the metrics row only when `.length > 0`.** |
| Title | `cs.title` | `Sentiment classification analysts stopped overriding` | Authored name-free, safe in either state. |
| Challenge column | `publishedDetail(cs)?.problem` | — | `publishedDetail` overlays `detail.anonymised` when gated. Never read `cs.detail` directly. |
| What we engineered column | `publishedDetail(cs)?.built` | — | as above |
| Outcome column | `publishedDetail(cs)?.measured` | — | Already ends "The figures behind each of those movements are held for evidence", which is why no extra sentence about the evidence gate is authored on this page. |
| Stack, in the meta line | `publishedDetail(cs)?.stack` | `Python, TensorFlow, React, Node.js, AWS` | Concrete engineering credibility for zero prose. Use it. |
| Duration, in the meta line | `publishedDetail(cs)?.duration` | `Six months` | Render the meta line only if at least one of stack/duration is present. |
| CTA label | `displayCardCta(cs)` | `Read the case study` | Falls back because Lytics has no `cardCta`. **If the founder wants "Read the Lytics case study", add a `cardCta` field to the Lytics entry in `work.ts`. Do not hardcode that string on the page** — hardcoding it bypasses the gate that suppresses a client name in a button. |
| `evidenceBasis` | deliberately **not rendered here** | ~80 words | It belongs to `/case-studies/lytics`, which owns it. Rendering it on this page reintroduces the prose block this redesign removes. |

`slice(0, 2)` on metrics can go: with an empty published list it does nothing, and if a
figure is ever released the Lytics block has room for more than two.

---

## 6. (E) FINAL ORDER, TOP TO BOTTOM

| # | Section | One-line rationale |
|---|---|---|
| 1 | Hero | The market claim, stated once, at full type weight. |
| 2 | Evidence band (80% / 37% / McKinsey) | The claim above is sourced immediately, so the page's boldest line is also its most evidenced. |
| 3 | Core AI engineering capabilities + boundary line | Objective (a): the fastest possible answer to "do these people do serious AI engineering", and the scope boundary in one line rather than a panel. |
| 4 | Where AI earns its place | Objective (b): the reader places their own problem without being filtered out by industry, size or geography. |
| 5 | The model is one layer of five | Depth shown, not written. The section that proves (a) rather than asserting it, and it costs one paragraph. |
| 6 | Opinionated in four places | Four sentences of judgement, arriving after the diagram has earned the right to make claims about how to build. |
| 7 | Lytics | It happened once, with a name on it. Evidence lands after the argument, never before it. |
| 8 | Private AI development | Objective (c): after the client-facing case is closed, so it reads as surplus capability rather than as the pitch. |
| 9 | Where this sits (hub) | The exit ramp for a reader who now knows this is not their practice — an orientation device, so it belongs after the argument. |
| 10 | FAQs | Objection handling plus the FAQPage graph, collapsed, so it costs almost nothing in perceived length. |
| 11 | Closing CTA + Value Discovery panel | One route, one label, one panel saying what four weeks buys. |

Sections removed from today's page: The gap (prose only; figures promoted to 2),
"Came for a build rather than for AI?" card, `CertifiedHandoff` compact panel (folded to a
line), "Who we work with", Testimonials.

---

## 7. FLAGS — things I think are mistakes, or that I cannot decide for him

Raised plainly because he has asked to be told and has rejected hedging before.

**F1. The hero eyebrow is factually wrong today.** It reads "part of Build"; the same page
marks itself as AUTOMATE in `ValueModelCards`. Fix regardless of whether anything else in
this spec is accepted.

**F2. The proof section is currently broken on screen.** One case study inside
`grid grid-3` leaves two empty tracks, so the page's only first-party evidence renders at
one-third width. Live since 2026-09-16.

**F3. I was not given his four one-line descriptions for "Where AI earns its place".** The
four lines in §2.5 are mine, written to his brief. If his exist, use his verbatim and
discard mine. I am not going to pretend I was working from his copy when I was not.

**F4. The price string.** `From £1,500 / month` is retained exactly as it stands, on the
Support & Run card, per instruction. It is now on a small card rather than a large one,
which is a placement change and not a copy change. Flagging that it is the only price on
the site and that the design does not depend on it either way: if he removes it, the card
needs a replacement link label such as `What running it covers`, and the card does not
otherwise change.

**F5. "Discuss a strategic AI opportunity" is a third CTA label into `/contact`.** The site's
ladder is "Book a conversation" everywhere. His label is distinct in intent, so I have kept
it — but it must be a text link, not a button (§4), and it must be instrumented with a new
analytics surface or it will be invisible in the data while the other two routes are
tracked.

**F6. Removing "Who we work with" drops the only links to `/industries/professional-services`
and `/industries/insurance-financial-services` from this page.** That is a navigation
consequence of the replacement, not a reason to keep the section. If those pages matter
commercially they need a route from somewhere — the nav, `/ai-engineering/services`, or a
one-line addition under the capabilities grid. I have deliberately **not** invented a
sector row on this page to solve it, because re-adding sector links is how "not by
industry" quietly becomes "by industry" again. Raise it and let him choose.

**F7. The hero's secondary CTA sends a first-time reader into a sub-page about Support &
Run.** On a page whose new job is "we understand serious AI engineering", that is a slightly
odd second door. I am **not** changing it: the label was set deliberately on 2026-09-16 to
match its destination's own button, and he is actively deciding about that page. Noted as a
watch item, not a change.

**F8. `.dark-panel` is teal-black while `--dark`, the footer and the dashboard mock are
purple-black.** That is a palette inconsistency predating this page, left over from the
teal palette swapped out on 2026-09-03. This spec routes around it rather than fixing it
(§4), because `.dark-panel` renders on three other pages and changing it is a site-wide
decision, not a page decision.

**F9. Disagreement with the brief, stated openly.** His flow omits the FAQs and the hub. I
have kept both, at the foot, and given the reasons in §1.2 and §1.4. The short version: the
FAQs are collapsed, so cutting them buys almost no length and loses the page's only
structured-data answer surface plus a Google policy constraint that makes "keep the schema,
drop the render" illegal; the hub is the navigation spine and the only thing that orients a
search arrival. If he still wants them gone after reading that, the hub is the one I would
cut first, because the nav can do its job — the FAQs I would fight for.

---

## 8. UX ACCEPTANCE CRITERIA

Binding. A build that fails any of these is not done.

**Content and claims**
1. No figure, percentage, metric, price or date appears on the page that is not already in
   `sources.ts`, `claims.ts` or `work.ts`, reached through an accessor. The only price is
   `From £1,500 / month`, unchanged.
2. A grep of the rendered HTML for `R-Core`, `BDOS`, `MarketNerve` and `Legal OS` returns
   zero hits, including in `alt`, `aria-label`, `title`, `data-*` and JSON-LD.
3. Every string in the Lytics block traces to the accessor named in §5. No client-derived
   string is typed as a literal on the page.
4. `certified.positioningLine` is composed from `company.ts`, not retyped.
5. Every `acceptedAnswer.text` in the FAQPage graph appears verbatim in the rendered body
   (`scripts/audit.py` asserts this and fails, not warns).

**Structure and accessibility**
6. Exactly one `<h1>`. Every `<Section labelledBy="x">` has a rendered element with
   `id="x"`. No dangling `aria-labelledby`.
7. The layer diagram is a list with an `aria-label`, and the Model band's
   "supplied and swappable" status is conveyed by text as well as by colour.
8. The four private-AI areas are a `<dl>`, not styled `<div>`s.
9. Every interactive target is at least 44px (`.flink`, `.btn` and `.nav` already are;
   anything new must be).
10. All text meets AA: `--mint` and `#ffffff` on `var(--dark)`; body text on the dark band
    is 15px minimum.

**Empty-state behaviour (this codebase's standing rule)**
11. `gapStats` empty -> the evidence band does not render at all. No orphan rule, no empty
    figure row, no stray `SourceNote`.
12. `publishedMetrics(cs)` empty -> no metrics container renders. No empty flex row.
13. `publishedImage(cs)` undefined -> `MediaSlot` renders its labelled box at the same
    aspect ratio and the layout is unchanged.
14. No grid is ever rendered with fewer children than tracks. Specifically: the Lytics
    Challenge/What/Outcome grid has exactly three children, and F2 does not recur.

**Responsive**
15. At 400px the page has no horizontal scroll and no element exceeds the viewport. Check
    the layer diagram's chip rows and the Lytics 16:7 media slot in particular.
16. At 400px every multi-column grid on the page is a single column, and the dark band's
    split has stacked with the four areas below the position.

**Length**
17. The rendered page is materially shorter than the current one. Measure it: sections drop
    from 9 to 11 blocks but four full `<Section>`s of content are removed and roughly 60% of
    the page's prose words are cut. If the word count has not fallen by at least a third,
    the copy rules in §2 were not applied.

**Motion**
18. No new animation, reveal, counter or scroll effect. `prefers-reduced-motion: reduce`
    produces a page with no movement at all.

---

## 9. OWNERSHIP AND LIMITS OF THIS DOCUMENT

Design artefact only. No production code is written here. Visual taste and brand sit with
`art-director` / `creative-director`; implementation sits with `frontend-engineer`;
post-build review sits with `ux-analyst`; the claims and evidence gates sit where they
already sit, in `claims.ts`, `sources.ts` and `work.ts`, and nothing in this specification
relaxes any of them. The founder's acceptance is the only thing that closes it.
