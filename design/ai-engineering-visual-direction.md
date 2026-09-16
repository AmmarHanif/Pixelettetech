# /ai-engineering — visual direction

**Status:** direction, not a build. Author: Creative Director. Date: 2026-09-16.
**Scope:** one page. No rebrand. Every value below resolves against tokens that already exist in
`src/app/globals.css`, except one page-scoped neutral named and justified in §2.4.
**Authority:** on-spec is the most this document claims. Whether it is *good* is the founder's call,
and §4 is the part he should look at built before anything else.

---

## 0. The diagnosis, before the prescription

The page does not read as service copy because of its words. It reads as service copy because of
its geometry. Counted in the current file:

| Device | Count on this page |
|---|---|
| `.card` (12px radius, 1px border, `--shadow-card`) | ~16 |
| `.sec` bands at identical `96px 0` padding | 9 |
| `border-top: 1px solid var(--line)` hairlines between bands | 9 |
| Distinct heading sizes between hero and footer | **1** (`.h2`, used 8 times) |
| Grid gap values | 1 (`18px`) |

Sixteen identical rectangles, nine identical intervals, one heading size. That is a uniform texture,
and uniform texture is what "flat" means. Emphasis is relative — if every band is 96px, nothing is
emphasised; if every block is a bordered card, a 44% statistic and a one-line disclaimer carry equal
weight.

**So the single highest-value move on this page is subtraction, not addition.** Removing the card
treatment from four sections and the hairline from five will do more for "restrained and premium"
than the diagram will. The diagram matters; it is second. Sequence the build that way.

---

## 1. Typographic hierarchy

### 1.1 The problem with the current scale usage

The scale in `globals.css` is good and under-used. `.h1p` (`clamp(34px, 4.4vw, 52px)`, Newsreader
300) exists and this page never calls it. So the page's entire amplitude is 64 → 42 → 25 → 18 → 16
→ 11.5, with 42 repeated eight times. Nothing invents a new step. The fix is to **rank the section
headings into three tiers using steps that already exist**, so the page descends and rises instead
of running level.

### 1.2 Heading ranks — assignment is fixed, do not improvise

| Rank | Class used as the `<h2>` | Rendered size | Sections |
|---|---|---|---|
| **A — the page's two arguments** | `.h1p` | 34→52px, serif 300 | "AI is more than the model" (diagram); the Lytics case study |
| **B — normal sections** | `.h2` | 30→42px, serif 300 | Capabilities; Where AI earns its place; Where this sits; Who we work with; FAQs; closing CTA |
| **C — the withheld section** | `.h3` | 21→25px, serif 400 | **Private AI development, and nothing else** |

Rank C is deliberate under-scaling and it is the mechanism of §4. Read §4 before implementing it.

`SectionHead` renders `title` in `.h2` when `level={2}`. Rank A and rank C therefore need the
heading rendered directly rather than through `SectionHead`'s default, keeping the `id` on the `h2`
element so `aria-labelledby` still resolves. **The element stays `<h2>` in all three ranks** — the
rank is a visual size, never a document-outline change. Do not demote Private AI to an `<h3>` in the
markup.

### 1.3 Full assignment with measures

| Role | Class | Size | `max-width` | Notes |
|---|---|---|---|---|
| Eyebrow | `.eyebrow` | mono 11 / 0.18em / `--brand` | — | 9.9:1 on white. One exception, §4. |
| Hero h1 | `.h1` | 38→64 | **19ch** | currently 21ch |
| Hero lead | `.lead` | 17→20 | **46ch** | currently 62ch — see §1.5 |
| Rank-A h2 | `.h1p` | 34→52 | **16ch** | short display lines, `text-wrap: balance` already on the class |
| Rank-A lead | `.lead` | 17→20 | **46ch** | |
| Rank-B h2 | `.h2` | 30→42 | **20ch** | |
| Rank-B lead | `.lead` | 17→20 | **54ch** | |
| Rank-C h2 | `.h3` | 21→25 | **24ch** | |
| Rank-C intro | `.body` | 16 | **54ch** | deliberately body, not lead |
| Standalone prose | `.body` | 16 | 66ch (token default) | the gap section's two paragraphs |
| Row / card body | `.body` at `fontSize: 15` | 15 | **46ch** | see §1.4 |
| Concept item line | `.body` at `fontSize: 15` | 15 | **34ch** | |
| Principle line | `.body` at `fontSize: 15` | 15 | **40ch** | |
| Register line (§4) | `.body` at `fontSize: 15` | 15 | **52ch** | |
| Row / card title | `.h3` | 21→25 | 20ch | capability rows |
| Concept title | `.h4` | 18 / 600 sans | — | sans on purpose — see §1.6 |
| Mono label / tag | `.step__n` or `.src` | 11–11.5 mono | — | |
| Figure caption | `.small` | 14 / `--muted` | **72ch** | §3.4 |
| Source note | `.src` | 11.5 mono / `--muted-2` | — | unchanged, it is already right |

### 1.4 Card and row body measure — the invisible defect

`.body` carries `max-width: 66ch`, but inside a two-up grid track the measure is set by the track,
not the token. At 1160px wrap with an 18px gap, a two-up `.card` gives roughly a 500px text column;
at 15px that is about **68 characters per line inside a card**. Card copy is read in glances and 68ch
is a paragraph measure. Cap every in-card and in-row body at **46ch**. This also cuts card height by
roughly a third, which buys back vertical air at zero cost.

### 1.5 The hero lead — a copy consequence I am flagging, not deciding

The current hero lead is three clauses and ends on the Pixelette Certified governance hand-off. That
sentence is necessary and it is commercially inert, and it is currently occupying the second-most
valuable line on the page, directly beneath a 64px headline, at a 62ch measure that makes it read as
body rather than as a sub-display line.

**Visually the hero cannot carry it.** Move the Certified sentence down to the capabilities section,
where the `CertifiedHandoff` panel already sits — it belongs beside the thing it describes. The hero
lead then holds to 46ch and reads as one idea. That is a copy edit with a copy owner; I am naming
the visual requirement (46ch, one idea) and the founder decides whether the sentence moves or the
hero stays compromised.

### 1.6 Where the contrast is deliberate

Three size events on the page, and exactly one anti-event:

1. Hero `.h1` at 64.
2. The diagram's `.h1p` at 52 — the page's intellectual centre.
3. The case study's `.h1p` at 52 — the page's evidence.
4. **Private AI at `.h3` 25** — the smallest section heading on a page whose other headings run
   42 and 52. The drop is the point.

Serif (Newsreader 300) carries every section heading. Sans (Outfit 600) carries every sub-title
inside a section — concept titles, principle titles, register names. Mono (IBM Plex Mono) carries
**labelling only and never prose**: eyebrows, tags, the register's status mark, source notes, the
hero glance rows. Mono used as labelling is the cheapest credible engineering signal in the kit and
it is already installed. Lean on it harder than the page currently does.

---

## 2. Whitespace and rhythm

### 2.1 Implement rhythm as classes, never as inline padding

`globals.css:216–221` already records this lesson in the codebase's own words: *"an inline style
cannot be overridden by a media query, so an inline split never collapses on a phone."* The same
trap applies to padding. `@media (max-width: 860px) .sec { padding: 64px 0 }` cannot override
`style={{ padding: ... }}`, so any section given inline padding keeps desktop padding at 400px.

Add three modifier classes after the existing `.sec` rules, with their mobile overrides placed
**after** the existing `@media (max-width: 860px)` block:

```css
.sec--breath   { padding: 160px 0; }        /* the diagram */
.sec--hold     { padding: 160px 0 112px; }  /* the case study */
.sec--withhold { padding: 144px 0 160px; }  /* private AI development */

@media (max-width: 860px) {
  .sec--breath   { padding: 96px 0; }
  .sec--hold     { padding: 96px 0 72px; }
  .sec--withhold { padding: 88px 0 96px; }
}
```

Tier 2 is the existing `.sec` (96/64). Tier 3 is the existing `.sec--tight` (64/48). Rules are
removed with the existing `flush` prop on `<Section>`, which applies `.sec--flush`. **Three new
declarations total.**

### 2.2 The rhythm, section by section

| # | Section | Tier | Padding (≥861 / ≤860) | Ground | Rule above |
|---|---|---|---|---|---|
| 1 | Hero | — | 112/96 → 72/64 | left-anchored glow | none |
| 2 | The gap | 3 | 64/64 → 48/48 | tint `#F7F5F9` | none |
| 3 | Capabilities | 2 | 96/96 → 64/64 | white | none |
| 4 | Where this sits (value model) | 3 | 64/64 → 48/48 | white | 1px `--line` |
| 5 | Where AI earns its place | 2 | 96/96 → 64/64 | white | 1px `--line` |
| 6 | **AI is more than the model** | **1** | **160/160 → 96/96** | tint `#F7F5F9` | none |
| 7 | How we approach AI engineering | 3 | 64/64 → 48/48 | white | none |
| 8 | Who we work with | 2 | 96/96 → 64/64 | white | 1px `--line` |
| 9 | FAQs | 2 | 96/96 → 64/64 | white | 1px `--line` |
| 10 | **Lytics** | **1** | **160/112 → 96/72** | white | none |
| 11 | **Private AI development** | **1** | **144/160 → 88/96** | white | none |
| 12 | Closing CTA | 2 | 96/96 → 64/64 | white | 1px `--line` |

Hairlines fall from 9 to 4. Tints fall from 3 to 2. Three Tier-1 breaths, all in the back half.

**The seam between 10 and 11 is 256px of white at desktop** (112 + 144) with no rule, no tint and no
device. It is the largest interval on the page and it is doing narrative work: it is the pause
between "here is our proof" and "here is what we are not going to show you". Do not let a later pass
close it up because it looks empty. It is meant to.

### 2.3 Gaps and intervals

| Interval | Value |
|---|---|
| Section head → content, Tier 1 | 64px |
| Section head → content, Tier 2 | 48px |
| Section head → content, Tier 3 | 32px |
| Eyebrow → heading | 18px (`SectionHead` default — keep) |
| Heading → lead | 20px (`SectionHead` default — keep) |
| Capability rows | 0 gap; 28px vertical padding per row; hairlines separate |
| Concept items | 40px column, 40px row |
| Principles (2×2) | 56px column, 44px row |
| Register rows (§4) | 0 gap; 22px vertical padding; hairlines separate |
| Gap-section figures | 32px, one hairline between |
| Case-study split | `.split` default 56px, collapsing to 40px at ≤900 |
| Diagram head → diagram | 64px |
| Diagram → caption rule | 20px; rule → caption text 20px |

The site-wide `.grid { gap: 18px }` stays untouched. Note that 18px between shadowed 12px-radius
cards is exactly what makes a grid read as a control panel — which is why most of this page stops
using cards rather than re-tuning the gap.

### 2.4 The one new value — a page-scoped neutral, not a brand colour

The page currently tints with `#F7FAFA` (R247 G250 B250) — a cyan-cast near-white. It is a survivor
of the retired teal identity; the brand is `--brand: #661a8f`, swapped to purple on 2026-09-03. A
cyan-grey ground under purple eyebrows and purple 44px numerals reads as an accident, not a choice.

Use **`#F7F5F9`** — a purple-cast off-white in the same family as the existing `--brand-tint:
#eadcf2`. Declare it **page-scoped**, on the page wrapper, not as a global token:

```css
/* scoped to /ai-engineering only */
--tint: #F7F5F9;
```

This is not a new brand colour and not an accent. It is a neutral replacing a mismatched neutral, on
one page, reversibly. Measured contrast on that ground:

| Foreground | Ratio on `#F7F5F9` | Verdict |
|---|---|---|
| `--brand` `#661a8f` | 9.19:1 | pass |
| `--ink` `#0a0a0a` | ~18:1 | pass |
| `--body` `#414d5c` | 7.94:1 | pass |
| `--muted` `#5d6b7d` | 5.02:1 | pass AA |
| `--muted-2` `#62707f` | **4.68:1** | pass AA — **this is the floor** |

`.src` uses `--muted-2`, so on the tint it sits at 4.68:1. **Nothing lighter than `--muted-2` may be
placed on the tint, at any size.** If a lighter grey is ever wanted there, the tint has to darken
first.

Two other off-palette values on the page go with it — see §7, items 10 and 11.

### 2.5 Do not break out of the wrap

There will be a temptation to full-bleed the diagram or the case-study image past `--wrap: 1160px`.
**Do not.** A break-out is the single most common source of horizontal scroll at 400px and the
constraint here is explicit. The "wide" moment is bought instead by *removing the container* from
the diagram so it occupies the full 1160 rather than a card's 1104 inner — same effect, no risk.
Everything on this page stays inside `.wrap`.

---

## 3. Section treatments

### 3.1 Hero

- Padding `112px 0 96px` (72/64 at ≤860). No border. No rule beneath — the tinted section below
  does the separating.
- **The glow moves off-centre.** `.hero-glow` is `radial-gradient(1200px 560px at 50% -20%, …)`: a
  symmetric wash centred under left-aligned type. Symmetric light under asymmetric type is a
  landing-page device. Page-scoped override:
  `radial-gradient(900px 480px at 18% -30%, var(--brand-tint) 0%, #ffffff 62%)` — smaller, weaker,
  anchored where the type starts, so the light falls on the headline rather than on nothing.
- Composition: type holds a left field of roughly 7 of 12 columns. The right third is currently
  dead — that is not generous whitespace, it is an unused column, because nothing counterweights it.
- **Add one quiet counterweight, bottom-right of the hero: a three-row `.glance` definition list.**
  The primitive already exists (`glance dt` = mono 10.5 uppercase `--muted`; `glance dd` = 14.5
  `--body`). Three rows, each a short factual label and a short factual value. I am specifying the
  slot and its treatment; the words belong to the founder and the consultant. What it must not
  contain: any figure, any claim, any superlative. Three mono labels over three short values reads
  as a spec sheet, which is precisely the "technically sophisticated, commercially credible"
  register and is the opposite of service copy.
- At ≤900px the glance stacks beneath the button row with 40px above it.
- The badge row that used to sit here is gone and stays gone.

### 3.2 Core AI engineering capabilities — kill the cards

Currently 5 `.card`s (2 large + 3 small) plus 2 more cards below. Seven cards in one section. This
is the worst block on the page.

**Replace with a five-row hairline-ruled schedule.** Each row is the whole link:

```
a.cap-row {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 7fr);
  gap: 40px;
  padding: 28px 0;
  border-top: 1px solid var(--line);
  text-decoration: none;
  color: var(--ink);
}
a.cap-row:last-of-type { border-bottom: 1px solid var(--line); }
@media (max-width: 760px) {
  a.cap-row { grid-template-columns: minmax(0, 1fr); gap: 12px; padding: 24px 0; }
}
```

- **Left cell:** the tag in `.step__n` (mono 11, 0.16em, `--brand`), then the title in `.h3` (serif
  21→25, weight 400), `max-width: 20ch`.
- **Right cell:** the body at 15px, `max-width: 46ch`, `--body`; then the link label as a `.flink`
  in `--brand` with the existing `ArrowRight`.
- **No border radius, no shadow, no background, no icon.**

Why a schedule: five ruled rows read as a capability *scope document* — the visual language of a
professional-services firm — not as an agency's service grid. It removes five borders, five shadows
and five radii in one edit, and it makes the section read taller and quieter, which is what
"generous" actually means here.

**Drop the `large: true` flag.** Two of five services are currently given double width for no stated
reason; the reader is told two things matter more and never told why. A schedule has no size
hierarchy to express it in, and it does not need one.

**The two cross-link blocks below:** keep the `CertifiedHandoff variant="compact"` dark panel
exactly as it is — it is the only dark object on the page and it earns its distinctness. But the
"Came for a build rather than for AI?" `.card` beside it becomes an **unframed text block with a
`border-top: 1px solid var(--line)` and 28px top padding**. One dark panel beside an unframed text
block is a composition; two cards, one dark and one white, is a mismatch.

The `FLink href="/ai-engineering/services"` currently floats to the right of the section heading in
a flex row. **Move it to the foot of the schedule**, left-aligned, 32px below the last row. A
"see all" escape hatch placed beside the heading, before the reader has seen anything, is a
blog-index device; at ≤700px it also wraps into an orphaned link under the lead and looks accidental.

### 3.3 "Where AI earns its place" — four concept items

**They must not be cards, and I am rejecting the word.** Four bordered boxes here would reinstate
exactly what §3.2 just removed, two sections later, and these are *problem statements* — the
lightest content on the page. The heavier the frame, the more they read as a product menu.

Treatment — no card, no tint, no container, no shadow:

```
.concept {
  border-left: 1px solid var(--line);
  padding-left: 20px;
}
```

Four of them in `grid grid-4` at ≥1001px, `grid-2` at ≤1000, single column at ≤560 (the existing
`.grid-4` responsive rules already do this — no new media queries).

Each item, top to bottom:

1. A mono numeral, `01`–`04`, styled as `.step__n` (mono 11, 0.16em, `--brand`).
2. Title in `.h4` (18 / 600, **sans**). Sans here on purpose: serif would compete with the serif
   section heading directly above it.
3. One sentence at 15px, `--body`, `max-width: 34ch`.

**No icons.** Reasoning in §6.

Section ground: **white, rule above, Tier 2.** It sits between the tinted gap section and the tinted
diagram band; a third tint in that run would turn the page to soup.

### 3.4 "AI is more than the model" — how the diagram sits

This is the centre of the page and it gets the page's biggest treatment.

- **Tier 1: `.sec--breath`, 160px top and bottom (96 at ≤860). `flush` — no rule.**
- **Ground: the tint, full-band.** `<Section>` already paints the `<section>` element edge to edge
  while content stays inside `.wrap`, so there is no horizontal-scroll exposure.
- **No card around the diagram.** The tint *is* the container. A white card inside a tinted band
  inside a page is three nested rectangles and it shrinks the diagram for nothing. The diagram sits
  directly on the tint at the full 1160 wrap width.
- Heading block: rank A — `.h1p` as the `<h2>`, `max-width: 16ch`; lead at 46ch directly beneath;
  **64px** from the lead to the diagram.
- **The diagram must be an inline `<svg>` with a `viewBox` and `width: 100%`, never a raster, never
  a fixed pixel width.** It scales to 400px without scroll and stays crisp at 2×. No external
  asset, no CDN, no paid licence — it is code.
- **Accessibility is structural, not a wrapper.** `role="img"`, a `<title>` and a `<desc>` inside
  the SVG, and a **visible caption below it.** A diagram must never be the only carrier of its
  meaning, and this one is the page's core argument.
- **Caption treatment:** a `border-top: 1px solid var(--line-3)` spanning the full diagram width,
  20px below the diagram; then 20px below the rule, the caption in `.small` (14px, `--muted`,
  `max-width: 72ch`). No italics. No "Figure 1." No parentheses. The rule-plus-caption is the plate
  convention and it is the one ornament this section gets.
- **Responsive boundary, and this is an instruction for whoever authors the diagram:** a four-column
  horizontal flow is illegible at 400px at *any* scale, and shrinking it is not a solution. The
  diagram must ship a **stacked vertical variant** below 700px — two `<g>` groups toggled by a media
  query inside the SVG, or two SVGs with one hidden. Shrink-to-fit is a defect, not a fallback.
- Colour inside the diagram: `--brand` for the layer that is our work, `--line-4` and `--muted` for
  everything else, `--body` for labels. One accent, one neutral family. No gradients inside the
  diagram, no glows, no drop shadows.

### 3.5 "How we approach AI engineering" — four principles

**Tier 3, compressed: `.sec--tight` (64/48), white, no rule, no tint.** Placed immediately after the
loudest section on the page. The compression next to 160px of breath *is* the rhythm — a tight band
after a wide one reads as a deliberate change of pace, and compression signals as strongly as air.

- **2×2 at desktop, not 4-across.** Four one-sentence items across 1160px gives ~260px tracks, and
  an 18-word sentence becomes four ragged lines. 2×2 gives a 40ch measure that reads properly.
  Column gap 56px, row gap 44px. Single column at ≤700px.
- Each item: title in `.h4` (18/600 sans), one sentence in `.body` at 15px, `max-width: 40ch`.
- **No numerals, no icons, no rules, no boxes, no background.** Nothing at all. This is the page's
  quiet passage and the restraint has to be visible somewhere before §4 asks the reader to believe
  in it.
- Section head: `.h2` (rank B), **no lead.** The four sentences are the lead.

### 3.6 Lytics — prominence without figures

**A constraint that changes the design, and it has to be said plainly.** `src/content/work.ts` gives
Lytics `metrics: []`, with all four figures HELD in `internalEvidence.heldMetrics`. **There are no
publishable numbers.** So the obvious prominence move — a large card with three big mono figures —
is unavailable, and any layout that reserves a metric slot will render a hole. Prominence has to
come from scale and composition instead.

Second, a live bug, not a taste note: `proof` currently resolves to exactly **one** item and is
rendered inside `<div className="grid grid-3">`. One `work-card` occupies the first of three 1fr
tracks and roughly 760px sits empty to its right. This is the same fail-open pattern the file's own
comments guard against elsewhere (`gapStats.length > 0 ? 'grid grid-2' : 'grid'`). **Delete the
`grid-3`.**

Treatment:

- **Tier 1: `.sec--hold`, 160px top / 112px bottom (96/72 mobile). White — not tinted.** The
  diagram band above already used the tint; this section earns prominence by scale, and a second
  tint would flatten the difference between them.
- **`.split .split--wide-left`** (existing: `minmax(0,1.6fr) minmax(0,0.9fr)`, 56px gap), with the
  **figure as the first child** — image left at ~680px, text right at ~384px (~48ch). Reversing the
  site's habitual text-left order is itself the "deliberately selected" signal, and it puts the
  largest image on the page where the eye lands first after 160px of air. `.split` already collapses
  to one column at ≤900px with the image on top, which is the right mobile order.
- **The image is a plate, not a card.** `MediaSlot` with `ratio="16 / 10"`, `priority={false}` (it
  is below the fold — do not set `priority`). Override `.slot--media` on this instance to
  `border: 1px solid var(--line-3)`, `border-radius: 4px` (the `.tile` radius, not the `.card`
  radius), **no shadow**, and drop the `#eef2f5` fill. The asset exists on disk at
  `public/work/lytics.png` — verified, not assumed.
- **Right column, in order:** eyebrow (mono 11, `--brand`) → heading in `.h1p` at 16ch (rank A) →
  the study's kicker line in `.src` (mono 11.5, `--muted-2`) → two to three sentences in `.body` at
  46ch → `<hr className="rule">` at 24px above / 18px below → **one line in `.small` stating why
  this study is on this page** → then, at the foot, `Cta variant="secondary"` to the full study and
  an `FLink` to `/case-studies`.
- **The `FLink href="/case-studies"` moves out of the section head** (same reasoning as §3.2) to the
  foot of the right column.

**The part a visual cannot fix.** A single case study given a full-width set-piece will read as "the
only one we have" unless the copy says why it is the one shown. That is what the `.small` line above
the CTA is for, and it is the one sentence on this page that is load-bearing for the design's
credibility. Without it, scale alone reads as thinness. The founder or the consultant owns the
words; I am naming the slot and what it must achieve.

### 3.7 Private AI development — see §4

### 3.8 Closing CTA

- Tier 2 (96/64). **Keep the `border-top` hairline here** — it is one of the four that survive, and
  it is right: the CTA is a genuinely different register, and it follows a section (§4) that has no
  closing device of its own.
- `.h2`, rank B. **Not rank A.** A call to action is not an argument, and giving it 52px would put it
  level with the diagram and the case study.
- **The aside `.card` drops to `.tile` weight:** `border-radius: 4px`, `box-shadow:
  var(--shadow-tile)`, `padding: 28px`. Keep the `CheckList` and the `.rule`. The last object on the
  page must not be the heaviest object on the page, which is what it currently is.
- `split--cta` unchanged; it already collapses at ≤900.

### 3.9 Sections not in the brief, for completeness

- **The gap section (#2).** The two 44px mono figures are right. The `.card`s around them are wrong —
  two bordered, shadowed boxes each holding one number is a dashboard widget. Drop the cards: the
  figures sit directly on the tint, no border, no shadow, with a **single `1px solid var(--line-3)`
  hairline between them** and 32px either side of it. Figure in mono 44px `--brand`; label at 15px
  `--body` at 34ch; the `.src` line once, beneath both. Tier 3.
- **Where this sits (#4).** `ValueModelCards` is shared across four pages and must not be restyled
  from here. Contain it instead: Tier 3 (`.sec--tight`), white, rule above. Noted honestly — four
  `.card`s survive on the page because the component is shared, and that is the one place the card
  monoculture is not fully removed.
- **Who we work with (#8).** Tier 2, white, rule above. Remove the two off-palette values on the
  third card (§7, item 11).

---

## 4. Private AI development — making "we are not showing you this" read as strength

### 4.1 The actual problem

Restraint and emptiness look **identical** unless the restraint is structured. Emptiness is a small
amount of content floating in a large default container. Restraint is a precisely-built structure
that is deliberately sparse. The difference the eye reads is whether **the space has been measured**.

There is a second trap, and it is the one the founder named. Teaser marketing has a fixed vocabulary
of *concealment devices*: blur, lock glyphs, redaction bars, silhouettes, greyed thumbnails, `•••`,
"coming soon", a countdown, a waitlist field. **Every one of those is a promise of a reveal.** Use
any of them and the section becomes a launch, whatever the copy says.

The answer is to swap vocabularies entirely. Use *documentary* devices instead: a ruled register, a
repeated classification mark, a fixed measure, no link, no date. **A register is a record of things
that exist. A teaser is an announcement of things that are coming.** That sentence is the whole
brief for this section, and it is the test to hold the build against.

### 4.2 The build

**Section container**

- `.sec--withhold`: **144px top / 160px bottom** (88/96 at ≤860). `flush` — no rule.
- **White. No tint. No container. No border. Nothing.** It is the only section on the page with no
  ground treatment at all, and it has the most padding. That combination — maximum space, minimum
  furniture — is what signals that the emptiness is bought, not left over.
- It follows the case study across the 256px seam (§2.2) and is the last content before the CTA.

**Heading — under-scale it**

- The `<h2>` renders in **`.h3`** (serif 21→25, weight 400), `max-width: 24ch`. The smallest section
  heading on a page whose others run 42 and 52.
- **Why:** every other section on this page raises its voice because it wants something from the
  reader. This one wants nothing. A reader does not consciously measure the drop, but they feel it —
  under-scaling is how confidence reads, and it is free.
- **The eyebrow loses the brand colour.** `.eyebrow` hardcodes `color: var(--brand)`; override to
  `var(--muted)` on this instance only. Purple is this page's "look here" signal, and withholding it
  from the one section that is withholding is the same move as under-scaling the heading. `#5d6b7d`
  on white is 5.43:1 — passes AA at 11px.
- One sentence beneath, in `.body` at 16px / **54ch** — deliberately `.body`, not `.lead`. A 20px
  lead here would be the section leaning forward.
- **64px** from that sentence to the register.

**The register — four ruled rows, not four cards**

```
.reg-row {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: 32px;
  padding: 22px 0;
  border-top: 1px solid var(--line-3);
}
.reg-row:last-child { border-bottom: 1px solid var(--line-3); }
@media (max-width: 700px) {
  .reg-row { grid-template-columns: minmax(0, 1fr); gap: 10px; padding: 20px 0; }
}
```

- **Left cell:** the area name in `.h4` (18/600 sans) — *Commercial intelligence*, *Marketing
  intelligence*, *Organisational intelligence*, *Professional workflow intelligence*. Directly
  beneath it, 6px down, a **mono status mark**: `.src` treatment (11.5, `--muted-2`, 5.07:1 on
  white) set `text-transform: uppercase; letter-spacing: 0.14em`.
- **Right cell:** the one line, `.body` at 15px, `--body`, `max-width: 52ch`.
- **The status mark is IDENTICAL on all four rows.** One word, from a closed set the founder
  approves — something factual and non-promissory, such as `INTERNAL`. This is the single most
  powerful device in the section and the reason is worth stating: **four different statuses would
  invite the reader to rank them and start a launch narrative.** One repeated word reads as a
  classification — a document marking, not a status board. It says these things are *categorised*,
  which implies they are real, without saying anything about them at all.
- Forbidden in that mark, absolutely: any tense ("in development", "building"), any futurity
  ("soon", "yet", "upcoming"), any date, any progress notion ("phase", "alpha", "beta", "%").
- **No numerals on the rows.** `01`–`04` would imply a roadmap order.
- **No icons.** There is no honest glyph for "organisational intelligence"; anything drawn would be
  a metaphor, and a metaphor here is a hint.

**The closing device — the absence of one**

- **No link anywhere in this section. Not one.** No `FLink`, no `Cta`, no arrow, no "learn more", no
  anchor. Every other block on this page ends in a purple arrow. This one ends in a full stop, and
  the reader feels the difference in their hand before they notice it with their eye. It is the
  visual equivalent of *and that is all I am going to say*.
- Below the closing hairline, 32px down, **one line in `.small` / `--muted` at 64ch** stating the
  policy — that these are built for the group's own use and are not being offered or announced. I
  own the slot; the founder owns the words. What it must not do: no future tense, no "yet", no
  "watch this space", no date, no invitation of any kind.

**Motion:** the register fades in on opacity only — **no translate**, 400ms. It appears; it does not
arrive. See §5.2.

### 4.3 Why this does not read as thin, and the one risk

It does not read as thin because the container is **bespoke and precisely proportioned**: 4fr/8fr
columns, a 32px gutter, 22px row padding, a 52ch measure, hairlines top and bottom closing the set,
144px of air above. Thinness reads when a small amount of content sits in a **default** container —
a half-filled card, a two-item grid built for four. Nothing here is a default. Every measurement in
this section was chosen, and chosen measurements are legible as intent even to a reader who could
not name what they are seeing.

**The honest risk, stated rather than buried:** four one-line rows with no link is the sparsest thing
on the page, and whether it lands as confidence or as an unfinished section is a taste judgement
that I cannot make and the swarm cannot grade. **This is the section the founder should look at
built before anything else on the page.** If it fails, it fails on the status mark and the closing
line — those two elements carry the whole tonal load, and they are the cheapest things to iterate.

---

## 5. Motion

### 5.1 What moves — exhaustive

| # | Element | Trigger | Property | Duration | Easing |
|---|---|---|---|---|---|
| 1 | The diagram block | first scroll into view, once | `opacity 0→1` + `translateY(12px→0)` | 520ms | `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| 2 | The case-study figure | first scroll into view, once | `opacity 0→1` + `translateY(12px→0)` | 520ms | `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| 3 | The §4 register block | first scroll into view, once | **`opacity 0→1` only** | 400ms | `ease-out` |
| 4 | Capability row hover/focus | `:hover`, `:focus-visible` | title `--ink → --brand`; arrow `translateX(0→3px)` | 150ms | `ease` |
| 5 | One flow marker inside the diagram | on visibility | `stroke-dashoffset` | 4000ms | `linear`, **`iteration-count: 3`** |

That is the complete list. Five things.

Notes that are not optional:

- **12px, not 24 or 40.** Above roughly 16px the movement becomes the message.
- **`threshold: 0.15`, `rootMargin: '0px 0px -10% 0px'`, and `unobserve()` after the first fire.**
  An element that re-animates on every scroll-past is a page that will not settle.
- **No stagger on the four register rows.** Stagger is a reveal device and §4 must not reveal. The
  block fades as one object.
- **#3 has no translate, deliberately.** It appears rather than arrives — the motion equivalent of
  the under-scaled heading.
- **#5 is linear on purpose**, and it is the one place linear is correct: easing implies a beginning
  and an end, and a flow marker represents continuous movement. 4s is slow enough to be ambient.
  **It stops after three cycles** — an infinite loop inside the viewport is a permanent attention
  magnet on a page whose whole claim is sobriety.
- **#5 must be designed so its final frame is the correct static frame.** This is the cleanest
  degradation rule available and the mechanism is already installed: `globals.css:65–76` forces
  `animation-duration: 0.01ms` and `animation-iteration-count: 1` under reduced motion, which snaps
  any animation straight to its end state. If the end state reads correctly, reduced motion is
  handled by CSS that already ships.
- Every hover state in #4 has a matching `:focus-visible` state. The existing focus outline
  (`globals.css:128–137`) is never transitioned and never removed.

### 5.2 The reduced-motion trap in the observer pattern — read this before implementing

The global `@media (prefers-reduced-motion: reduce)` block kills *durations*. It does **not** stop
JavaScript from applying an initial `opacity: 0`.

**Therefore: the hidden initial state must be applied by JavaScript, never by CSS.** The element
ships visible in the server-rendered HTML; the client component hides it and schedules the reveal in
the same frame. If the script never runs — JS disabled, hydration failure, a CSP block — the content
is simply visible, which is the correct failure. A CSS-authored `opacity: 0` awaiting a script is a
page that can render blank.

And guard the whole thing:

```js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
// no observer, nothing hidden, nothing animated
```

This needs one small client component. The page is otherwise a server component and must stay one —
do not make the page a client component to get three fades.

### 5.3 What must NOT move — equally binding

- **The `<h1>`.** No typewriter, no word-by-word, no character stagger, no gradient sweep, no mask
  reveal. Nothing.
- **Nothing in the hero at all.** Animating content that is already in the viewport at load is not
  an effect, it is a delay.
- **No count-up on the 80% / 37% figures.** A statistic that performs is a statistic staged, and
  this page's entire credibility argument is that its figures are sourced rather than dramatised.
  This one is non-negotiable.
- **No parallax, anywhere.** It janks at 400px and it is the single loudest "AI agency" tell.
- **No card lift.** The existing `.service-card:hover { transform: translateY(-2px) }` and
  `.door:hover` lift leave the page with the cards.
- No scroll-linked progress bar. No sticky in-page section nav. No scroll-jacking. No change to
  `scroll-behavior`. No auto-rotating anything. No cursor-following anything. No particles. No
  canvas. No WebGL.
- No hover-only affordance: nothing may be discoverable by hover alone.

---

## 6. Iconography

### 6.1 The decision

**Icons come off the capability rows. They are not added to the concept items or the principles.
They survive in exactly two places on this page, unchanged:** the four `ValueModelCards` practice
marks (shared component, same four across the whole site) and the `Shield` in `CertifiedHandoff`.

Net change on this page: from 8 icons to 5, all of which are navigational.

### 6.2 Reconciling this with the founder's earlier instruction

He previously asked to keep icons and move from heavy cards to lighter tiles elsewhere on the site.
**That instruction is being honoured, not overturden — it was about tiles.** A tile is a
navigational object, and an icon helps you pick one out of a set at a glance. The four practice
tiles keep their icons for exactly that reason.

A **row in a ruled schedule is not a navigational object.** It is a line in a document, and an icon
on a document line is decoration.

More concretely: `Gauge`, `AiMark`, `Measure`, `Database` and `TrendChart` are five generic outline
glyphs that do not distinguish "Value Discovery" from "Evaluation & Observability" to any reader
alive. They carry no information. They cost 32px of vertical space and a purple accent each, five
times, and return nothing — and five purple marks stacked in a column create a false vertical rhythm
that fights the rules that are doing the real work.

### 6.3 Concept items and principles — no, and why

- **Concept items** are *problems*: fragmented knowledge, complex workflows, automation that stops
  too early, new AI opportunities. There is no honest outline glyph for "automation that stops too
  early". Anything drawn for it is a metaphor, and metaphor icons are a cliché generator — which is
  precisely what the ban list is guarding against. **The mono numeral is the marker.** It is already
  a page idiom (`.step__n`) and it carries real information: there are four, and this is the second.
- **Principles** get nothing at all. No icon, no numeral, no rule, no box. Four sentences and air.
  The page needs one place where the restraint is unmistakable, and this is it.

### 6.4 If an icon is ever added anywhere new on this page

24px, not 32. `--muted`, not `--brand`. `strokeWidth="1.6"` to match the existing set. Never inside
a circle, a chip, a tinted square or a bordered slot. `aria-hidden` always, and never the only
carrier of a distinction.

`.icon-slot` and `.icon-slot--stacked` become unused **on this page**. Do not delete them from
`globals.css` — other pages use them.

---

## 7. Delete on sight

| # | Device | Why it is pulling quality down |
|---|---|---|
| 1 | `.card` on all five service entries | Seven cards in one section. The card treatment is an equaliser — it gives a 44px statistic and a one-line disclaimer the same weight. → ruled schedule, §3.2 |
| 2 | `grid grid-3` on the proof section | **Live layout bug.** One item in a three-track grid: a ~355px card with ~760px of dead space beside it. Same fail-open pattern the file's own comments guard against elsewhere. |
| 3 | `<Testimonials heading="Voices" />` | Two Clutch review cards with five-star rows, none of them about AI work. Five-star rows are the most "agency" device available. Identical reasoning to the client strip and the verification table, both removed 2026-09-16 for being not-about-AI. |
| 4 | `.card` around the `ClosingCta` aside | The heaviest box on the page is currently the last thing on it. → `.tile` weight, §3.8 |
| 5 | The two `.card`s around the gap-section figures | One number inside a bordered, shadowed box, twice, is a dashboard widget. The figures are right; the frames are not. → §3.9 |
| 6 | Five of the nine `.sec` `border-top` hairlines | Nine rules down one page is the "list of services" texture in its purest form. Four survive, named in §2.2. |
| 7 | The centred symmetric `hero-glow` | Symmetric light under asymmetric type is a landing-page device. → left-anchored and weaker, §3.1 |
| 8 | Both `<div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>` heading-plus-link rows | A blog-index device. At ≤700px it wraps into an orphaned left-aligned link under the lead and looks accidental. Both links move to the foot of their sections. |
| 9 | `box-shadow: var(--shadow-card)` anywhere on this page | Shadow is the least sophisticated depth cue there is, and this page has ~16 instances. After these changes the only cards left are the shared `ValueModelCards`. Anything new uses `--shadow-tile` or nothing. |
| 10 | `#F7FAFA` as the tint | Cyan-cast grey, a survivor of the retired teal identity, sitting under a purple brand. → `#F7F5F9`, page-scoped, §2.4 |
| 11 | `background: '#FBF8F4'` + `borderColor: '#edd8de'` on the "Who this is not for" card | Two off-palette values — a warm cream with a pink border — in a row with two neutral cards. It reads as a warning callout, which is not what "this is not for you" means. Distinguish it instead with `border-top: 2px solid var(--line-4)` and the heading in `--muted`. |
| 12 | `large: true` on two of five services | A visual weighting with no stated basis. The schedule has no size hierarchy to express it in and does not need one. |

---

## 8. Imagery — the decision, and a refusal

**This page gets exactly two pieces of imagery:**

1. **The diagram** (§3.4) — inline SVG, authored, no external asset.
2. **The Lytics product screenshot** — `public/work/lytics.png`, verified present on disk.

**And nothing else. No abstract AI imagery at all, and I am declining the brief on that point.**

The founder asked for "sophisticated abstract AI imagery". Under the stated constraints — no paid
stock licence, no external CDN — the only available sources are hand-authored abstract SVG or
generated artwork. Both produce decoration. And the ban list he wrote (no robots, no glowing brains,
no circuit boards, no humanoid figures, no "future AI") is not really a list of forbidden subjects:
it is a rule against **illustration standing in for evidence**. Abstract node-graphs and gradient
meshes fail that rule in a quieter accent than a robot does, but they fail it.

**Two images that carry information beat six that carry mood.** A real diagram and a real screenshot
are the only two objects on this page that a technically knowledgeable buyer will actually read, and
putting decorative artwork beside them lowers both by association.

If a third visual moment is wanted later, it should be a **second diagram, not an image**, and the
capabilities section is where it goes — a small schematic showing what "in production" means as
distinct from a pilot. That is a future slot with a defined subject, not something that exists.
Nothing on this page has been generated or rendered; everything above is direction.

---

## 9. Compliance checks

### 9.1 400px viewport — no horizontal scroll at any width

| Element | Behaviour at ≤560px |
|---|---|
| Capability rows (3fr/7fr) | collapse to 1 column at ≤760px |
| Concept items | `.grid-4` → 2-up at ≤1000 → 1-up at ≤560 (existing rules, no new media queries) |
| Principles (2×2) | 1 column at ≤700 |
| Register rows (4fr/8fr) | 1 column at ≤700, hairlines retained |
| Case-study split | `.split` collapses at ≤900, image first |
| Diagram | `width: 100%` + `viewBox`; **stacked variant below 700px**, not shrink-to-fit |
| Hero glance | stacks below the button row, 40px above |
| Rank-A `.h1p` at 16ch | ~272px at the 34px floor — fits 360px of content width |
| All grids | `minmax(0, …)` floors throughout — a bare `fr` refuses to shrink below min-content and is what pushed a page 324px past a 390px viewport before (`globals.css:216–221`) |
| Everything | stays inside `.wrap`; **no break-outs**, §2.5 |

### 9.2 Contrast — measured, not assumed

On white: `--brand` 9.95:1 · `--body` ~12:1 · `--muted` 5.43:1 · `--muted-2` 5.07:1 · `--ink` ~20:1.
On `#F7F5F9`: `--brand` 9.19:1 · `--body` 7.94:1 · `--muted` 5.02:1 · `--muted-2` **4.68:1 (floor)**.

**Nothing lighter than `--muted-2` may sit on the tint at any size.** `.src` is the binding case.

### 9.3 Never the only carrier

1. The §4 status mark is **real text**, never a border colour or a background.
2. The diagram carries `role="img"`, `<title>`, `<desc>` **and** a visible caption.
3. Capability-row hover changes colour **and** translates an arrow that is already present at rest —
   colour is not the sole signal.
4. The three Tier-1 sections are distinguished by heading rank and content, not by padding alone.
5. `aria-current="page"` on `ValueModelCards` already carries the text "THIS PAGE" — leave it.
6. Every heading stays an `<h2>` regardless of visual rank; the document outline does not move.

### 9.4 Confidentiality — binding

**R-Core, BDOS, MarketNerve and Legal OS appear nowhere:** not in rendered copy, not in alt text, not
in an SVG `<title>` or `<desc>`, not in a caption, not in a code comment, not in a `data-` attribute,
not in a CSS class name, and not in any asset filename. §4's four areas use the founder's own labels
and contain no codename. **This binds the diagram author as well** — asset and layer names must be
generic and descriptive of the drawing, never of an internal system.

### 9.5 Runtime assets

Nothing above requires an external CDN, a paid licence, a web font beyond the three already loaded
by `next/font`, or any runtime asset fetch. The diagram is code; the screenshot is already in
`public/`. CSP and the dependency rule are both satisfied by construction.

---

## 10. Build order

1. **Subtraction first** (§7, items 1–9). The page improves most, and measurably, before a single
   new thing is built.
2. **Rhythm** (§2) — three new CSS classes, applied as classes, never inline.
3. **Type ranks** (§1) — assign `.h1p` / `.h2` / `.h3`, set the measures.
4. **§4, the register.** Build it early despite sitting late on the page, because it is the one
   element whose success is a pure taste call and it needs the founder's eye soonest.
5. The capability schedule, concept items, principles, case study.
6. The diagram lands last, into a section already shaped to hold it.
7. Motion last of all (§5). If it is built first it will be over-built.

---

## 11. Gate

This is direction. Nothing here has been built, rendered or generated, and no asset has been
produced. The founder's taste gate is permanent and is not closed by this document: the most any
review can report is **on-spec**, against the checklist in §§1–9. Whether it is *good* — and in
particular whether §4 reads as confidence or as an unfinished section — is his call and only his.
