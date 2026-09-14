# Design conformance audit

Board-by-board check of the build against the approved design,
`Pixelette Website 2026 · all pages tobedevelopedforgolive.html`.

Method for each board: machine-diff every content line of the design board
against the rendered page; **separately extract every text label held inside the
design's SVGs and check each against the built page**; list every image,
unfilled media slot and visible placeholder; check the heading outline for
skipped levels; then record deviations, whether deliberate or not.

> ### Method correction — 2026-08-31, at board 08
>
> The SVG check above was **added at board 08 and did not exist for boards
> 01-07.** The original diff stripped `<svg>` from both sides before comparing,
> so any content the design placed inside a diagram was invisible to it.
>
> That was not cosmetic. **51 pieces of real content across three boards were
> missing from the build and the audit could not see them** — most of the LIVE
> method diagram and most of the Data & Integration reference architecture.
> **Board 04 had already been signed off as complete while 9 of its labels were
> missing.** It was re-opened and fixed.
>
> Full sweep run across all 20 boards: **65 SVG text labels exist in the design**,
> on boards 04, 08 and 12 only.
>
> **Closed at board 12 — all 65 are now present on the site**, all three boards
> at zero missing.
>
> The check is committed tooling — `scripts/svg_text_check.py` — so it runs on
> every board and cannot be forgotten again. Boards 01-03 and 05-07 carry no SVG
> text and were unaffected by the gap.

> ### Second method correction — 2026-08-31, at board 17
>
> `board_audit.py` only compares design lines **longer than 12 characters**, a
> filter meant to keep stray fragments out of the report. It also hid every short
> label: buttons, links, nav items.
>
> Caught when board 17 reported 46 of 47 lines found — apparently clean — while
> the board's **"Subscribe"** call to action (9 characters) was absent from the
> page entirely.
>
> A sweep of all 20 boards found **210 short design lines, 6 absent from the
> build**. Four were already-documented deliberate deviations: board 06's
> withdrawn "TOKEN LAUNCH" card and a `£500k+`/`£500,000` format difference, and
> board 18's `[ PHOTO ]`/`[NAME]` slots removed by founder instruction
> (ADR-0007). **Two were genuine misses, both on board 17** — the board being
> audited when the gap was found.
>
> Now committed as `scripts/short_line_check.py` and run alongside the other
> checks. **Boards 01-16 were re-swept and are clear**, so no earlier sign-off
> needs revisiting on this account.

> ## ⚠️ Defects found elsewhere — these need fixing outside this project
>
> None of these are on the new site; each was caught and corrected here. They are
> listed together because they are **live on the current pixelettetech.com or
> sitting in the approved design**, and whoever maintains those needs them in one
> place rather than scattered through this audit.
>
> | # | Defect | Where it is live | Evidence |
> |---|---|---|---|
> | 1 | **"170% retention at 3 months"** — the true figure is **70%**. A retention rate above 100% invites exactly the scrutiny this site is built to survive. | Design board 06, and anything reusing it | `blockchainDevelopment.ts` lines 60-64 state `70%` "retention rate after 3 months". Zero occurrences of "170" in the case-study dataset. |
> | 2 | ⛔ **NOT FIXED — deliberately.** **AdWatch's "Ad detection" metric is a recruitment claim** — "$20,000 per organization in recruitment costs due to better candidate matching". That belongs to the AIA hiring tool, not an ad-blocker. A one-line fix was applied on 2026-08-31 and then **reverted** under the founder's *new site only* decision; `repo/` is clean and untouched. The correct replacement, if ever wanted, is AdWatch's own figure from its own milestone on the same page: *"Achieved up to 98% accuracy in automated ad detection across live media streams."* The $20,000 claim is correctly placed at its true home (AIA `impactBoxes`, "Cost efficiency", line 26) — it was misplaced, not false. | **Current live site — remains live** | `caseStudiesData.ts` line 63, AdWatch `impactBoxes`. Source figure: AdWatch `milestones` line 70. |
> | 3 | **£500,000 / "80% sold in the first hour" attributed to Butter Smiles.** Those figures belong to the 'Stay Sane' NFT collection — a different engagement. | Design board 05 | Source records assign both to `chysler` (Stay Sane); see ADR-0006 |
> | 4 | **Two case studies display another case study's banner image** — `chain-legal` shows ragnar-token's, `smart-contractor` shows law-ledger's. Both have their own unused artwork in their own folders. | **Current live site** | `caseStudiesData.ts` lines 563, 605 |
> | 5 | 🔶 **OPEN — Lytics' ML framework is unconfirmed.** Design board 16 says **PyTorch**; the delivery record says **TensorFlow**. Different frameworks, on a checkable claim about a named client. The build ships TensorFlow as the better-evidenced of the two, but **neither has been confirmed first-hand** — and the two artefacts are one source, not two: the old site's case-study page renders `techStack` directly from that file (`case-studies/[slug]/page.tsx`). **Founder decision, 2026-08-31: leave open.** | Design board 16 vs `caseStudiesData.ts` | Lytics `techStack`: `python, tensorflow, Reactjs, nodejs, aws`. Three other case studies (life-optimizer-ai, ragnar-token, smart-contractor) list TensorFlow **and** Pytorch together — a plausible route for PyTorch to have been carried onto Lytics in the design. |
> | 6 | 🔴 **THE ONE THAT REACHED THE NEW SITE — AdWatch's 98% ad-detection figure is Lytics' headline.** Lytics is a news-monitoring and sentiment-analysis platform; it does not detect ads. Its four genuine outcomes are −60% sentiment errors, +200% monitored sources, **+70% AI scraping efficiency** and 3× real-time capacity. On the new build the 98% figure was Lytics' **slug, SEO title, H1 and lead metric**, the +70% metric was **absent**, and AdWatch — the figure's real owner — did not carry it at all. ✅ **FULLY RESOLVED 2026-08-31.** The slug went first (ADR-0011); the founder then approved the content repair. Lytics now leads on its own strongest figure — H1 *"Sentiment errors cut by 60%, across triple the monitored sources"*, `metaTitle` *"Lytics: real-time news monitoring"*, and its four genuine metrics with **+70% AI scraping efficiency restored**. The unevidenced "golden set" methodology sentence was removed rather than re-pointed at sentiment — no record supports it. **Two further residuals were found during the repair and fixed:** `public/llms.txt` still carried *"98% ad-detection accuracy measured against a maintained golden set"* for Lytics, and — unrelated to this defect — still attributed the £500,000 figures to **Butter Smiles**, meaning the **ADR-0006 correction had never reached that file** (see defect #3). Verified against the served page: no "ad detection", no "98%", no "golden set", +70% present, and AdWatch's own page still coherent. | **Current live site AND the approved design AND the new build** | **Route proven, three links.** (a) AdWatch's whole "Testing and deployment" milestone, which names *"the AdWatch Engine into live media streams"*, appears verbatim at `caseStudiesData.ts` lines **70 (adwatch, native), 108 (fusio), 145 (lytics)** — text naming AdWatch cannot be native to a crypto or a news product, so the copy travelled outward. (b) Lytics' own `impactBoxes` (lines 137-140) list four metrics and **98% is not among them**. (c) The design file carries it at lines **625, 2184, 2290, 2310** — card, index, H1, and a paragraph defending the figure — which is how it entered the build. |
>
> Defects 2 and 4 are on the site serving customers today; **2 is now fixed in the
> working tree**, 4 is not. **Defect 5 is open** and needs someone who was on the
> Lytics engagement, not another document — the repo's imports
> (`import tensorflow` vs `import torch`) or a `requirements.txt` would settle it
> in seconds.
>
> **Defect 6 is the most consequential of the six and the only one that reached
> the new site.** It is not a build error: the build followed the approved design
> faithfully, and the design had inherited the error from the live site's
> copy-paste. That is precisely why it survived — every downstream check compared
> the build against a design that was already wrong. Corrected metrics are known
> and require no invention (Lytics' own impact data supplies all four), but the
> repair changes a **founder-approved headline, a URL slug and an SEO title**, so
> it is held at a founder gate rather than applied. The slug has never been
> published, so changing it now is free and after launch is not.
>
> A seventh item, related and **not yet decided**: the same AdWatch paragraph is
> live on **Fusio** (crypto portfolio management) and **Lytics**, both of which
> currently tell readers about integrating the AdWatch Engine into live media
> streams. Deleting the foreign text is safe; **writing a replacement is not** —
> no record of those projects' real testing milestones has been located, and
> inventing one is barred under R41/R0.

**Status: 20 of 20 boards audited — COMPLETE.**

| # | Board | Status |
|---|---|---|
| 01 | Front page (recommended) | ✅ Complete — 2 fidelity slips found and fixed |
| 02 | Front page · split-screen option | ⛔ **CLOSED** — founder decision, 2026-08-31 |
| 03 | Front page · mobile 390px | ✅ Resolved — full copy retained, founder decision |
| 04 | AI engineering landing | ✅ Complete — **re-opened at board 08**: 9 diagram labels were missing; fixed |
| 05 | Build landing | ✅ Complete — wrong work featured, found and fixed |
| 06 | Blockchain landing | ✅ Complete — **inflated figure found in the design**, not carried across |
| 07 | AI engineering index | ✅ Complete — design's own four/five contradiction resolved |
| 08 | LIVE (method) | ✅ Complete — **19 diagram labels were missing**; diagram rebuilt |
| 09 | Support & Run | ✅ Complete — no defects found |
| 10 | Assurance · hand-off to Certified | ✅ Complete — board's own Certified copy restored |
| 11 | AI Value Baseline | ✅ Complete — a missing hero CTA found and added |
| 12 | Data & Integration | ✅ Complete — reference architecture rebuilt; **all 65 SVG labels site-wide now present** |
| 13 | Production AI Systems | ✅ Complete — four card titles were outside the heading outline; fixed |
| 14 | Industries · professional services | ✅ Complete — duplicated stat wording corrected |
| 15 | Work (index) | ✅ Complete — missing filter affordance added; ADR-0010 applied |
| 16 | Case study detail | ✅ Complete — metric labels corrected; **a technical claim conflict found in the design** |
| 17 | Insights | ✅ Complete — **two missing CTAs found by a new check**; second method gap closed |
| 18 | About | ✅ Complete — conformant; every absence is the founder's team removal |
| 19 | Contact | ✅ Complete — conformant; form tested working, **launch blocker found** |
| 20 | AI landing · mobile 390px | ✅ Complete — mobile copy per ADR-0008; full-site responsive sweep clean |

## Audit outcome — 20 of 20 boards, closed 2026-08-31

**Every board checked against the approved design.** Three checks per board:
content diff, SVG text extraction, short-line sweep; plus heading outline,
images, media slots, placeholders, and responsive behaviour.

### What was found

| | Count |
|---|---|
| Defects in the build, found and fixed | **20** |
| Defects in the audit method itself | **2** — both closed with standing tooling |
| Defects in the source material or approved design | **6** — four remain live on pixelettetech.com by founder decision (*new site only*, 2026-08-31), one open, and **one that reached the new site** |
| Launch blockers | **1**, since **CLEARED** — the contact page had no working route; `sales@pixelettetech.com` confirmed by the founder 2026-08-31 |
| Boards clean on first pass | 2 of 20 |
| Founder decisions recorded | ADR-0008, ADR-0009, ADR-0010 |

### The four findings that mattered most

1. **The contact page had no working route to the company — now cleared.** The
   form was unconnected, both email addresses were placeholders, and the form's
   own failure message pointed at one of them. Found by submitting the form, not
   by reading it. Cleared the same day: the founder confirmed
   `sales@pixelettetech.com` — the address the live site already hands out — for
   both enquiries and press, and the form's failure messages now name it.
   `CONTACT_WEBHOOK_URL` remains a deploy-time setting but is no longer blocking,
   because a visitor always has a route that works. *(Superseded 2026-09-14: that
   variable is read by no code any more. The deploy-time step is now a Supabase
   project, a migration, a Resend sending domain and four variables — see
   `CONTACT-FORM-SETUP.md`. Still not blocking, for the same reason. The two
   later mentions in this document are findings from the audit run and are left
   as recorded.)*
2. **The audit method was wrong twice**, both times reporting a board as clean
   while content was missing — 51 pieces of diagram text hidden by stripping
   SVGs, then short labels hidden by a 12-character filter. Both now guarded by
   committed scripts, and every earlier board re-swept.
3. **Six claim defects in the source material**, including an inflated "170%
   retention" (true figure 70%), a recruitment claim presented as an ad-detection
   metric, and figures attributed to the wrong client. Two were live on the
   current site today; one is now fixed in the working tree.
4. **One of those six reached the new site, and the audit method could not have
   caught it.** AdWatch's 98% ad-detection figure is Lytics' slug, SEO title, H1
   and lead metric — while Lytics' own +70% scraping-efficiency metric is absent
   and AdWatch, the figure's owner, does not carry it. Every conformance check in
   this document compares the build against the design; this error was **in** the
   design, inherited from a copy-paste on the live site, so perfect conformance
   reproduced it perfectly. **A board can be 100% conforming and still be wrong.**
   Found only by tracing a figure back to its origin rather than matching it
   across two documents — which is the check this audit did not have, and the
   reason defects 1-6 are listed above the board-by-board record rather than
   inside it.

### Standing checks

    npm run build && npm start
    python scripts/audit.py --port 3000 --checklist   # links, SEO, placeholders
    python scripts/board_audit.py <board> <route>     # one board vs one page
    python scripts/svg_text_check.py                  # text inside design SVGs
    python scripts/short_line_check.py                # labels under 12 chars

### Final state

Build green at 42 pages. Site audit **PASS** — 36 pages reached, every internal
link, anchor and asset resolving, zero SEO defects, 50 FAQ pairs. Responsive
clean across 75 page/width combinations. One `h1` and no skipped heading levels
on every page audited. **75 placeholders across 23 pages**, all deliberate per
ADR-0003 and enumerated in `GO-LIVE-CHECKLIST.md`.

Nothing deployed or pushed. No Band 3/4 action taken at any point.

---

## Open cross-board questions

Decisions that affect more than one board, carried forward until settled. They
are recorded here so they are not lost between boards; each is also written up
where it was first found.

| # | Question | Status |
|---|---|---|
| A | **One canonical title per case study, or the design's per-page framing?** | ✅ **SETTLED — founder, 2026-08-31: "One title everywhere."** Recorded as **ADR-0010**. The build's existing behaviour is confirmed correct; no rework needed. The diff will keep reporting the design's alternate titles as absent on boards 05, 06, 12, 15 and 16 — each a deliberate deviation, not a miss. Per-page emphasis is carried by *which* work is featured, never by renaming it. |
| B | **`h3` versus the design's `h4` for card titles.** The design goes `h1 → h2 → h4`, skipping `h3`; the build goes `h1 → h2 → h3`. A skipped heading level is an accessibility fault, so the build is the more correct of the two. Recurs on every board with card grids. | **Settled by the build** — deviation is deliberate and will not be corrected back. Raised for visibility, no decision needed unless the founder objects. |

---

## Standing finding: the design uses no photographs at all

Checked across the whole design file, not per board:

- **Zero `<img>` tags in all 20 boards.** Every one of the 103 visuals is an
  inline SVG icon or a labelled `[ SLOT ]` box.
- The only four `[PHOTO]` slots in the entire design are the About team
  portraits on board 18, which the founder removed on 2026-08-31 (ADR-0007).

So "an image is missing" is not a defect class this design can produce, except
where a labelled slot is unfilled. Those are tracked in `GO-LIVE-CHECKLIST.md`.

### Testimonial author images — resolved, nothing missing

Three independent checks:

1. The old site's `testimonialData.js` points each review at
   `t_one.svg`…`t_four.svg`. Opened: each is a 60×60 white circle with letterform
   paths — a **monogram avatar**, 363–1,665 bytes. No `<image>`, no photograph.
2. The design renders the testimonial authors as initials — literally `DE` and
   `AB` on board 04.
3. No `[PHOTO]` slot appears against any testimonial on any board.

The build uses initials avatars, matching all three. **No client photographs
exist to be missing.**

Note: the old site's avatar mapping is unreliable — `t_three.svg` is served for
**three different people** (two Anonymous reviewers and Julien Braun). The build
derives initials from the actual name, so it is more accurate than the original.

---

## Board 01 — Front page ✅

**Content:** 93 design content lines checked, **90 found on the page**. The three
not found are two design-tool board labels ("Front page (recommended)",
"1440px · desktop") and `AI governance · Certified ↗`, the footer link the
founder moved to the group band. **Nothing missing.**

**Images:** none on the page, and none in the board — this page is 19 inline SVG
icons and typography. No unfilled slots, no placeholders.

**Two fidelity slips found and fixed:**

- Certified pills rendered 7 (`…vCISO, vDPO`); board 01 shows 5. The shared
  component was using the Assurance board's fuller list everywhere. Now 5 on the
  front page, 7 on Assurance, matching both boards.
- Door headings were `h3` beneath a hidden "The two practices" heading; the board
  has them at `h2`. Hidden heading removed, doors promoted, outline now matches.

**Deliberate additions beyond the board**, all founder-directed or previously
recorded: the FAQ block (added for answer-engine reach), the Pixelette Group
footer band, the revised top navigation, and two links added to resolve orphan
pages ("Who does what →", "More about the firm").

---

## Board 02 — Front page, split-screen option ⏸️ DECISION OPEN

**This is not a missing page.** It is an alternative layout of the same front
page: two large split panels for Build and Blockchain, a Certified panel, and a
trust strip. The design rail labels board 01 "Front page **(recommended)**" and
board 02 "Front page · split-screen **option**".

Board 01 was built. Nothing is missing from board 02 — it was a choice, and 01
carried it.

**Measured comparison of the two boards** (page content only, board chrome
excluded):

| | Board 01 (built) | Board 02 (option) |
|---|---|---|
| `<h1>` | 1 | **0** |
| `<h2>` | 4 | **0** |
| `<h3>` | 1 | **0** |
| Word count | 821 | **78** |

Board 02 carries **no heading element of any kind** and 9.5% of board 01's copy.
It has no hero headline, no AI section, no client proof, no company story and no
FAQ — it is a signpost page, two doors and a logo.

**Recommendation: close it out.** Two reasons, both structural rather than
aesthetic. Commercially, the site's entire proposition is that it argues from
evidence, and board 02 does no arguing. For search, a homepage with no `<h1>` and
78 words is close to invisible — which works directly against the SEO objective
this build was commissioned under. The designer's own "recommended" label on
board 01 agrees.

> **DECISION TAKEN — 2026-08-31, founder: close board 02 out.** The split-screen
> layout will not be built. Board 01 is the front page. No further work is owed
> and this board requires no revisit.

---

## Board 03 — Front page at 390px ⚠️ DECISION OPEN

Board 03 is **not** a reflow of board 01. It specifies materially shortened,
art-directed mobile copy. Measured against the build at 390×844:

| | Board 03 | Built |
|---|---|---|
| Brand | "Pixelette" | "Pixelette Technologies" |
| Lead | "Two practices, one firm. AI runs through both." | Full sentence |
| Trust pills | 3 | 5 |
| Build door title | "Software built and kept working" | "Software built, shipped and kept working" |
| AI band items | One-line labels | Full paragraphs |
| Clients listed | 4 | 7 |
| Page height | — | 9,453px · **11.2 screens** · 1,047 words |

The build renders correctly at 390px — no horizontal overflow, navigation
switches at the breakpoint, typography holds. The deviation is that it reflows
the full desktop copy rather than serving the board's shorter mobile copy.

**Recommendation: keep the full copy, and change nothing else.** Google judges a
site by its mobile rendering under mobile-first indexing, so serving roughly 40%
less copy on mobile means 40% less of the argument is indexed — working directly
against the objective this build was commissioned under. Shortening copy on a
mobile mockup is a normal design instinct for visual balance, but a mockup is not
what gets indexed.

**Correction to an earlier draft of this audit:** the 11.2-screen scroll length
was flagged as a concern. It is not one — 8 to 15 screens is normal for a
content-rich B2B homepage, so the build sits inside the usual range. The
progressive-disclosure option previously suggested here was a fix for an
overstated problem and is withdrawn; adding it would be complexity without a
justifying cause.

> **DECISION TAKEN — 2026-08-31, founder: keep the full copy.** The build stands
> as-is at every breakpoint. No progressive disclosure, no shortened mobile copy.

---

## Board 04 — AI engineering landing ✅

**Content:** 129 design lines checked, **121 found**. The 8 not found are all
accounted for — none is missing content:

| Not found | Why |
|---|---|
| `[ PRODUCT SCREENSHOT ]`, `[ ARCHITECTURE DIAGRAM ]` | Design slots, now **filled with the real Lytics and BlockGuard artwork** — better than the board |
| "tokens in 6 months" | Renders as "tokens, first 6 months" — same fact, different word order |
| "We ran our own bid process through LIVE first" | The design gives this case study a different title on board 15 ("We ran LIVE on ourselves before we sold it"); the build uses one title consistently |
| "per bid saved" | Renders as "saved per bid" |
| "Group capability. Delivered by Pixelette Certified, not held by Pixelette Technologies" | Present, split across the verification table's Status and note columns |
| "CEO, BlockGuard" | Renders as "CEO, The BlockGuard Technologies" — the exact wording of the Clutch review, verified against source |
| `AI governance · Certified ↗` | Footer link moved to the group band, founder instruction |

**Images:** 2 rendered (Lytics, BlockGuard), both with descriptive alt text. One
unfilled slot remains — `[ Operating report ]` for the internal case study — and
one placeholder, `[REGISTRATION IN PROGRESS]` for AI DPS RM6200. Both tracked in
`GO-LIVE-CHECKLIST.md`.

**One slip found and fixed:** the internal Pixelette Group proof card rendered
its kicker as "Pixelette Group · Professional services", dropping the "Internal"
label the board carries deliberately. The design discloses that this case study
is the firm's own work; falling back to the sector quietly removed that
disclosure. Now renders "Pixelette Group · Internal", matching the board.

**Headings:** design uses `h1 → h2 → h4`, skipping `h3`. The build uses
`h1 → h2 → h3`. Verified: exactly one `h1` and **no skipped levels**. The build's
structure is the more correct of the two — a skipped heading level is an
accessibility fault, so this deviation is deliberate and is not corrected back.

---

## Board 05 — Build landing ✅

**One real defect found: the wrong work was featured.**

The board's "Selected builds — Named clients, shipped systems" section shows a
platform build (BlockGuard, "Tokenisation platform handling $14M of assets"), a
marketplace build (labelled Butter Smiles, "£500,000+ sales volume"), and one
empty `[CLIENT]` card.

The build was featuring **AdWatch, NeuroStack and LawLedger** — all AI systems,
none of them conventional software builds. This is a knock-on from ADR-0006:
when Butter Smiles was replaced by Stay Sane, the Engineering page's featured
list had to change and the replacements were chosen arbitrarily rather than by
category. The result was a Build page whose proof was AI work.

**Fixed.** The section now features:

| Slot | Case study | Why |
|---|---|---|
| Platform | BlockGuard — $14M tokenised | Exactly what the board specifies |
| Marketplace | Stay Sane — £500,000, 80% in the first hour | The board's marketplace slot; those figures are Stay Sane's, not Butter Smiles' (ADR-0006) |
| Third card | LawLedger — 50% faster legal transactions | Real custom-software work in a non-crypto sector, filling the board's empty `[CLIENT]` card |

**Content:** 90 design lines checked, 78 found. All 12 absences accounted for —
four are `[ SLOT ]` labels now filled with real artwork, two are the removed
empty placeholder card (real work shown instead), one is the founder's footer
change, and five are the board's build-specific framing of cards that are
present under their canonical titles (see below).

**Accepted deviation — one title per case study.** The design reframes the same
case study per practice page: BlockGuard appears as "BLOCKGUARD · PLATFORM /
Tokenisation platform handling $14M of assets" on the Build board, and under a
blockchain framing elsewhere. The build gives each case study one canonical
kicker and title used everywhere. Same client, same facts, same figures. Per-page
framing was rejected deliberately: describing identical work two different ways
invites the descriptions to drift apart, which is the failure mode this site is
built to avoid.

**Images:** 3 rendered, all with descriptive alt text. **No unfilled slots and no
placeholders on this page.**

**Headings:** one `h1`, no skipped levels — same `h3`-versus-`h4` deviation as
board 04, and deliberate for the same reason.

---

## Board 06 — Blockchain landing ✅

### ⚠️ An inflated figure in the approved design — do not publish it

The board's third "Delivered" card reads **"170% retention at 3 months"**.

The source is the previous site's blockchain services page
(`src/data/services/blockchainDevelopment.ts`, lines 60-64), which states:

> `value1: '70%'` — *"retention rate after 3 months"*

The figure is **70%**, and it sits against the diamond icon, i.e. DIAMOND NXT.
The board shows **170%**. A search of the entire case-study dataset returns
**zero** occurrences of "170".

A retention rate above 100% is not merely wrong, it is the kind of number a
technical buyer stops to query — and this site's whole position is that every
claim resolves to a source. It is not carried across. The build's third card is
DIAMOND NXT carrying the sourced **70% user retention**.

**This is still in the design, and in anything reusing that board.**

### The third card: DIAMOND NXT rather than a token launch

The board's third card is "TOKEN LAUNCH — Token design and distribution", with
"1,200+ tokens, first 6 months" and the 170% figure above. Two problems: the
1,200+ figure is BlockGuard's — the board's own first card and front page both
attribute it there — so a separate token-launch card would restate a figure
already shown; and its second metric is the corrupted one.

The build features **DIAMOND NXT** instead: a genuine tokenisation engagement
with four independently sourced metrics (98% provenance accuracy, $10M
tokenisation growth, 1,500 traders, 70% retention). The alternative in the
library, Ragnar Token, has no headline figure stronger than a 12% conversion
rate.

**Content:** 85 design lines checked, 75 found. All 10 absences accounted for —
three are `[ PLATFORM SCREENSHOT ]` labels now filled with real artwork, three
belong to the withdrawn token-launch card, two are word variants ("avg owners"
→ "average owners per asset", "sold within 1 hour" → "sold within the first
hour"), one is the canonical-title question (cross-board question A), and one is
the founder's footer change.

**Images:** 3 rendered — BlockGuard, Stay Sane, DIAMOND NXT — all with
descriptive alt text. **No unfilled slots and no placeholders on this page.**

**Headings:** one `h1`, no skipped levels. Cross-board question B applies.

---

## Board 07 — AI engineering index ✅

**The design contradicts itself on how many services there are.** Counting
across the whole design:

| Says | Where |
|---|---|
| "**Five** things we do, and one we deliberately do not" | Board 04 |
| "**Five** things we do, and one we deliberately do not" | Board 20 (AI landing, mobile) |
| "the **five** services above" | Board 07 |
| "Not sure which of the **five** you need?" | Board 07 |
| "**Four** services delivered by the same engineers…" | Board 07, opening line |

Four statements say five; one says four. The odd one out is board 07's own
opening line — and the cause is visible in the board's layout: it numbers its
services 01-04 and **omits Evaluation & Observability**, which board 04 lists as
the fifth ("Prove"). The footer links to it, so it exists.

*(Board 07's "which of the other four is worth paying for" is not a fifth
contradiction — start with the baseline and four remain. That line is correct
under a count of five.)*

**Resolved as five.** The build ships five services numbered 01-05 — the
design's own 01-04 order with Evaluation & Observability appended — and the
copy now reads "Five services delivered by…", matching boards 04 and 20 and
board 07's own later sentences.

**A correction to an earlier choice.** When this page was first built the counts
were quietly neutralised — "Services delivered by…", "which of these you need?"
— to avoid asserting a number the design disagreed with itself on. That was the
weaker option: it produced vaguer copy than the design intended and hid the
contradiction rather than settling it. The design's exact sentences are now
restored with the correct number.

**Content:** 62 design lines checked, 60 found. Both absences are deliberate —
the "Four services" line above, and the founder's footer change.

**Images:** none, and none specified — this board has no media slots. **No
unfilled slots and no placeholders on this page.**

**Headings:** one `h1`, no skipped levels.

---

## Board 08 — LIVE (method) ✅

**The prose matched almost exactly — and that was misleading.** 48 design lines
checked, 47 found, the single absence being the founder's footer change. On the
old method this board would have passed as flawless.

**It was not.** The board's diagram is an SVG carrying **24 text labels**, of
which **19 were absent from the build**. The page had the four stage names and a
one-line summary each; the design specifies what each stage actually contains:

| Land · measured first | Integrate | Verify | Evolve |
|---|---|---|---|
| CRM / ERP | Entitlement-aware access | Redesigned workflow | Evaluation harness |
| Case management | Context layer · MCP | Model / agent layer | Drift & judge-drift watch |
| Documents | Lineage & permissions | Tools & deterministic steps | Cost & incident control |
| | Instrumentation | Human review points | Quarterly improvement |

…plus a **feedback loop** from Evolve back to Land, an **evidence layer**
("certified separately by Pixelette Certified": model inventory, impact
assessment, risk register, audit trail, human oversight procedure, incident
response), and a **measured-throughout** band ("baseline established before
anything is built · the same metric reported every month afterwards").

That is the substance of the method, and none of it was on the page.

**Fixed.** The diagram is rebuilt with every label, in two variants matching the
two boards that carry it — `compact` for board 04 (stages mapped to the service
that delivers each, on a pilot-to-production rail) and `full` for board 08. Both
now sit at zero missing labels.

**Still rendered as markup, not an exported image.** That was the right original
call and it stands: the labels are indexable text, the diagram reflows on a
phone, and a screen reader gets an ordered list. Exporting the design's SVG
would have hidden 24 labels from search and from answer engines.

**One regression introduced and caught.** Making the stage names `h3` created a
skipped level on this page — the diagram sits directly under the `h1`, with the
first `h2` below it. They are list labels inside a labelled ordered list, not
document sections, so they are no longer headings. Both affected pages verified:
one `h1`, no skipped levels.

---

## Board 09 — Support & Run ✅

**No defects.** The first board to come through clean on the first pass.

**Content:** 67 design lines checked, **66 found**. The single absence is the
founder's footer change. Every figure in the operating dashboard mock is
present — `claims-triage-prod`, the 94.2% pass rate against a 90% threshold,
18,402 cases, £0.031 per case, the SEV-3 drift incident — as are the three
pricing tiers (£1,500 Watch, £3,000 Operate, Estate on application) and the
severity response times.

**SVG check:** this board carries no text inside SVG, so the gap found at board
08 does not apply here.

**Placeholder:** one, `[ON APPLICATION]` for the Estate tier — which is exactly
what the board specifies, not an unfilled gap.

**The dashboard mock carries its disclaimer.** "Interface mock. Figures are
illustrative sample data, not a client system." sits directly beneath it, as the
design requires. The chart is generated from a sample series rather than an
exported image, and its accessible description matches the board's own
annotation — the 18 August dip caused by a model version change, rolled back in
41 minutes.

**Headings:** one `h1`, no skipped levels.

---

## Board 10 — Assurance · hand-off to Certified ✅

**The Certified block carries different copy on this board, and the build was
showing the front page's version.**

The same component appears on both boards doing two different jobs:

| | Board 01 (front page) | Board 10 (Assurance) |
|---|---|---|
| Eyebrow | Part of Pixelette Group · a separate practice | Pixelette Certified |
| Heading | Came for the certificate rather than the build? | Compliance, governance and cyber trust. |
| Blurb | "…If the question is whether your AI will survive a security review or a board, that is their work rather than ours, and we will hand you straight over." | "…delivered on a fixed fee by certified lead auditors. If your next enterprise deal is waiting on a certificate, that is the practice you want." |
| Pills | 5 standards | 7, adding vCISO and vDPO |

That difference is deliberate on the design's part, and correct. On the front
page the block **interrupts** someone who has landed on the wrong site. On the
Assurance page it **closes** a reader who has already worked through the
who-does-what comparison, so it states what Certified sells rather than asking
whether they are in the right place.

**Fixed** by giving the component optional `eyebrow`, `title` and `blurb` props
defaulting to the front page's wording, with the Assurance page passing board
10's. Board 01 re-audited afterwards and is unchanged at 89 of 90.

**Note this is not cross-board question A.** There the risk is the same factual
claim drifting into two descriptions. Here the facts — the standards, the lead
auditors, the fixed fee — are identical in both; only the framing sentence
differs, which is a rhetorical job, not a claim. A prop is the right mechanism;
a second component would not be.

**Content:** 59 design lines checked, **58 found**. The single absence is the
founder's footer change.

**Placeholder:** one, `[VERIFY: ISO/IEC 42006 accreditation wording before
publication]` — carried from the design, which flags it for the same reason.
Accreditation wording is legally load-bearing and stays unfilled until checked.

**Images:** none, and none specified. **No unfilled slots.** No SVG text on this
board.

**Headings:** one `h1`, no skipped levels.

---

## Board 11 — AI Value Baseline ✅

**A whole call-to-action was missing.** The board's hero carries two buttons —
"Book a value baseline" and, beside it, **"Download a sample output"**. The build
had only the first.

That is a conversion path, not decoration. The primary CTA asks someone to
commit to a £6,000-£12,000 engagement; the second gives a reader who is not
ready a way to stay in the conversation. Dropping it silently removes the only
low-commitment action on the page.

**Added — with the wording changed, deliberately.** No sample baseline output
exists. A button labelled "Download" that does not download is a worse promise
than no button at all, and on a site whose position is that every claim resolves
to something real it would be the wrong kind of wrong. The button reads
**"Request a sample output"** and routes to the contact form: the design's
function preserved, nothing promised that will not happen.

This is logged in `GO-LIVE-CHECKLIST.md` under standing tasks. Once a redacted
sample baseline exists, the board's exact wording is restored and the button
points at the file.

**The diff still reports "Download a sample output" as absent, and should.** It
is a real deviation from the board, deliberate and recorded, not a silent
substitution.

**Content:** 51 design lines checked, **49 found**. The two absences are the CTA
wording above and the founder's footer change.

**Images:** none, and none specified. **No unfilled slots, no placeholders, no
SVG text on this board.**

**Headings:** one `h1`, no skipped levels.

---

## Board 12 — Data & Integration ✅

**The prose was clean; the diagram was hollow.** 50 design lines checked, 49
found, the single absence being the founder's footer change. But the board's
reference architecture is an SVG carrying **28 labels, of which 23 were absent** —
the largest single gap found in the audit, and one the old method could not see.

The build had a generic four-layer stack. The design specifies named systems and
the actual contents of each layer:

| Systems of record | Access layer · **what we build** | Application | Evaluation & ops |
|---|---|---|---|
| Salesforce | Identity & entitlements | Workflow | Trace collection |
| SAP / NetSuite | MCP connectors | Model / agent layer | Golden datasets |
| SharePoint | Context & semantic layer | Deterministic steps | Judge pipeline, sampled |
| Case management | Audit log | Tool calls | Drift detection |
| Internal APIs | | Human review point | Cost telemetry |
| | | Output to system of record | Incident alerting |
| | | | Monthly report |

…plus a **regression gate** and the closing line: "Open standards throughout, so
the observability backend can be swapped without re-instrumenting anything."

**The most important thing the build was losing was the second column's label.**
The design marks the access layer **"what we build"**, and that distinction is the
commercial argument of the whole page: the systems of record already exist and
are the client's; the access layer is the part that does not exist yet and is
what Pixelette sells. A generic diagram makes the page describe a category. The
design's diagram makes it describe a purchase.

**Rebuilt** as four columns with every label, the access-layer column styled to
stand out, the regression gate and the open-standards line restored. Built as
markup per ADR-0009.

**Verified:** 22 items across four columns matching the board exactly; the
access-layer column carries its "what we build" marker; responsive 4 → 2 → 1
columns at 1440/768/390 with zero overflow at 360, 390, 768, 1024 and 1440px;
one `h1`, no skipped levels.

### The SVG gap is now fully closed

**All 65 SVG text labels across the entire design are present on the site.** The
three boards that carry diagram text — 04, 08 and 12 — are each at zero missing.
`scripts/svg_text_check.py` is the standing guard.

---

## Board 13 — Production AI Systems ✅

**Content clean at 59 of 60** — the single absence being the founder's footer
change. The defect was structural, and the heading counts exposed it: the board
carries **10 card headings, the build had 6**.

The page has two card grids. "Processes we have built into" rendered its six
titles as headings. "Every build ships with its own evidence" rendered its four
— **Evaluation suite, Acceptance thresholds, Escalation design, Runbook** — as
bold text.

Same page, same visual pattern, two different markups. The consequence was not
cosmetic: those four sat **outside the document outline entirely**, so a
screen-reader user navigating by heading skipped the four things that ship with
every build, and the page's structure understated itself to search.

**Fixed.** Card titles are headings, matching the board and the sibling grid.
Built now reports 10 card headings against the design's 10.

**Checked whether the pattern repeated.** Three other places render a label as
bold rather than a heading:

| Location | Verdict |
|---|---|
| `engineering` — "a typical path" steps | **Correct as-is.** The design marks these as plain text, and they sit in an ordered list that already carries the structure. |
| `page.tsx` — "how clients usually arrive" steps | **Correct as-is.** Same: ordered list, no heading in the design. |
| `ai-engineering/services` — tech stack tiles | **Correct as-is.** Label/value pairs, not headings in the design. |

Only board 13's evidence grid was a genuine mismatch — the design explicitly
marks those four as `h4` and the sibling grid on the same page as headings too.

**Images:** none, and none specified. **No unfilled slots, no placeholders, no
SVG text on this board.**

**Headings:** one `h1`, no skipped levels.

**One self-inflicted build break, caught immediately.** The first edit put a JSX
comment inside a `.map()` callback ahead of the returned element, which makes two
expressions where one is allowed. Typecheck failed, the comment moved above the
grid, build green.

---

## Board 14 — Industries · professional services ✅

**The board deliberately says the same thing twice, differently, and the build
was saying it twice identically.**

The lead states the claim in full:

> "78% of UK corporate clients say AI-enabled quality improvement is essential or
> very important. 7% say their providers are actually delivering it."

The stat tiles directly beneath it then compress:

| Tile | Board's label | Build was showing |
|---|---|---|
| 78% | of UK corporate clients call it essential | of UK corporate clients call AI-enabled quality improvement essential or very important |
| 7% | say providers deliver it | say their providers are actually delivering it |

Repeating the full sentence inches below itself reads as padding and crowds a
small tile. The other two tiles already matched, because those claims are not in
the lead.

**Fixed with a `shortLabel` field rather than by shortening the data.** The
compressed wording drops a real distinction — "call it essential" loses "or very
important", which is the survey's combined response — and that is fine beside a
lead carrying the full claim, but wrong if the stat were ever reused elsewhere on
its own. `label` stays precise; `shortLabel` is used only where the board
compresses. Rendering falls back to `label` when no short form exists, so a
future stat cannot silently lose precision by omission.

**Content:** 59 design lines checked, **58 found**. The single absence is the
founder's footer change.

**Slots and placeholders match the board.** Three unfilled case-study slots and
seven placeholders — `[X]%` on the internal bid-cycle card, then `[CLIENT]`,
`[NAMED PROCESS AND RESULT]` and `[MEASURED FIGURE]` twice. The board specifies
exactly these, and carries its own note that "placeholders stay visible until a
real engagement fills them. We do not use stock case studies." The build repeats
that note verbatim.

One difference: the first slot reads `[ Operating report ]` where the board says
`[ CASE STUDY IMAGE ]`. The build pulls the label from the case study's own
record, which is more specific about what belongs there. Kept.

**Headings:** one `h1`, no skipped levels.

---

## Board 15 — Work (index) ✅

**First board audited after ADR-0010**, which the founder settled on 2026-08-31:
one canonical title per case study, used everywhere.

**A missing affordance, found and added.** The board pairs the hero's primary CTA
with a visible **"Filter by sector"** control. The build had the filter chips but
no visible label — the list announced itself as filterable only to screen
readers, so a sighted visitor had nothing telling them the chips were controls
rather than tags. Added as a secondary action anchoring to the filter row.

**Content:** 58 design lines checked, **53 found**. All five absences accounted
for:

| Not found | Why |
|---|---|
| `[ PRODUCT SCREENSHOT ]`, `[ ARCHITECTURE DIAGRAM ]` | Board slots, **filled with the real Lytics and BlockGuard artwork** |
| "Real-time ad detection and sentiment at scale" | The board's Work-index title for Lytics. **ADR-0010** — one canonical title everywhere; the build uses "Real-time ad detection at 98% accuracy, across triple the monitored sources". Deliberate. |
| `[SECTOR METRIC, CLIENT UNDER NDA]` | See below |
| `AI governance · Certified ↗` | Founder's footer change |

**The anonymised card — a deliberate difference.** The board makes the whole
headline a placeholder: `[SECTOR METRIC, CLIENT UNDER NDA]`. The build titles it
"Client under NDA" and marks the *metric* as pending instead.

Same information, split differently — and the split matters. `title` feeds the
page `<title>`, the `metaTitle`, the image alt text and the Article schema.
Rendering a bracketed placeholder as the headline would put it in all four,
which is a genuine SEO and structured-data defect. The card is still visibly
unfilled: its metric renders as a placeholder and its summary states the policy
("Where we cannot name a client, we publish the sector and the number rather
than nothing"). Kept as built.

**Images:** **11 rendered**, all with descriptive alt text — against the board's
five cards. This is the founder's instruction of 2026-08-31 to use the previous
site's case-study library as the Work section, not a deviation from intent.

**Slots and placeholders:** three unfilled slots (the internal operating report,
the anonymised card, the "next case study" slot) and one placeholder,
`[YOUR ENGAGEMENT HERE]` — matching the board's own `[ NEXT CASE STUDY ]` card.

**Headings:** one `h1`, no skipped levels.

---

## Board 16 — Case study detail ✅

### A technical claim in the design that the delivery record contradicts

The board gives Lytics' stack as **"Python, PyTorch, streaming ingest"**. The
case study's own record lists **`python, tensorflow, Reactjs, nodejs, aws`** —
TensorFlow, not PyTorch.

This is not a naming quibble: they are different frameworks. Three other case
studies in the library *do* use PyTorch (life-optimizer-ai, ragnar-token,
smart-contractor); Lytics is not among them.

The build uses the delivery record. A structured `techStack` with per-tool icon
paths is a delivery artefact; a line of prose in a mockup is not. But the page is
written for engineers and risk officers who check things, so the conflict is
**recorded as defect #5** rather than silently resolved.

### Metric labels: the design compresses on cards and expands on the page

Same pattern as board 14's stat tiles, and the build had only the short form:

| | Card (boards 04, 15) | Case-study page (board 16) |
|---|---|---|
| 98% | detection accuracy | **accuracy in ad detection** |
| -60% | sentiment errors | **sentiment analysis errors** |
| +200% | sources monitored | **monitored news sources** |
| 3× | real-time data handling capacity | real-time data handling capacity |

Fixed with `shortLabel` on `WorkMetric`, mirroring the `Stat` precedent: `label`
is the fuller form used on the case-study page, `shortLabel` the compressed form
used in cards, falling back to `label` where a metric reads the same either way.
All four card render sites were updated; board 15 was re-audited afterwards and
is unchanged, confirming cards kept their short labels.

**Content:** 46 design lines checked, **42 found** (from 39 before the fix). The
four absences:

| Not found | Why |
|---|---|
| `[ PRODUCT SCREENSHOT · THE ACTUAL INTERFACE ]` | Board slot, **filled with the real Lytics interface** |
| "Python, PyTorch, streaming ingest" | The claim conflict above — build uses the delivery record |
| "Lytics · Production system" | The build's eyebrow reads "Lytics · Production AI Systems", the actual service name, which ties the case study to the service it was delivered under. Deliberate. |
| `AI governance · Certified ↗` | Founder's footer change |

**Images:** 3 rendered — the Lytics interface, plus BlockGuard and Stay Sane in
"More work" — all with descriptive alt text.

**Slots and placeholders match the board:** one unfilled architecture diagram,
and four placeholders (`[RUN CONTRACT STATUS…]`, `[CLIENT QUOTE, WITH SIGN-OFF]`,
`[NAME]`, `[ROLE]`) — exactly what board 16 specifies, and gated behind
`pendingQuote` so they appear only on the two case studies the design boards.

**Headings:** one `h1`, no skipped levels.

---

## Board 17 — Insights ✅

**The board reported 46 of 47 lines found and looked clean. It was not** — and
this is the board that exposed the audit's second method gap (see the note at the
top). Two calls to action were absent from the page and too short for the diff to
compare.

**"Subscribe"** — the board pairs it with the primary CTA. There is no mailing
list wired up, so it routes to the contact form. Unlike a "Download" button with
no file behind it (board 11), a subscription request is something a person can
actually fulfil by hand, so the board's own label is kept rather than softened.
Logged as a standing task to replace with a real list.

**"Browse →"** — the board offers this on the "blockchain and distributed
systems, 2018-2025" archive card. That archive has no home in this build, so the
destination renders as a visible placeholder rather than pointing at something
which is not an archive. Also logged as a standing task.

**Content:** 47 design lines checked, **46 found**; the single absence is the
founder's footer change. Short-line sweep now clear on this board.

**Placeholders: 11, matching the board exactly** — one `[DATE]` on the featured
methodology card, `[PLANNED: our eval in inspect_evals]`, three
`[DATE] · [AUTHOR]` pairs on the lead articles, and three `[DATE]`s on the
secondary list. Plus the new archive-destination placeholder, taking the site
total to 75.

That count is the point of this page: the board lists articles that have not been
written. Every date and byline stays visibly unfilled rather than being invented,
and the page says so in its own words — "Articles are listed as they are
commissioned. A piece appears here with its date and author filled in once it is
written and signed off, not before."

**Images:** none, and none specified. **No unfilled media slots. No SVG text on
this board.**

**Headings:** one `h1`, no skipped levels.

---

## Board 18 — About ✅

**No defects. Every absence traces to one founder instruction.**

**Content:** 50 design lines checked, **43 found**. All seven absences are the
team section removed on 2026-08-31 under ADR-0007:

- "The people who will actually be on your engagement" — the section heading
- "Founder & CEO", "Head of AI Engineering", "Head of Blockchain",
  "Delivery Lead" — the four role labels
- "Real names and roles go here, not stock portraits. If someone is on your
  account, their name belongs on this page." — the section's own note
- `AI governance · Certified ↗` — the founder's footer change

The board's `[ PHOTO ]` and `[ NAME ]` slots are correspondingly absent, which
the short-line sweep confirms.

**Independently verified the removal is complete on this page:** zero `<img>`
tags, zero `/team/` references, and no occurrence of any team member's name or
of the four role titles.

**Structure:** the design carries `h1` plus four `h2` sections; the build carries
`h1` plus three. The missing one is exactly the team section — no other section
was lost. One `h1`, no skipped levels.

**No SVG text, no unfilled slots, no placeholders on this page.**

### An observation for the founder, not a defect

The About page is now the design's four sections minus one, and the one removed
was the only section about people. What remains is the firm's method, its
certifications, its policy exposure and its client quotes — all of it about the
organisation rather than anyone in it.

That was the instruction and it has been followed exactly. It is worth a look
with fresh eyes now that it is real, because an About page that never mentions a
person reads differently from one that simply lacks photographs. If something is
wanted in that space, group-level facts would fill it without displaying any
individual — the canonical group record puts the group at 200+ people across
thirteen countries. **Not built: the instruction was to take the team off, and
adding people-adjacent content back is the founder's call, not an assumption to
make.**

---

## Board 19 — Contact ✅ — and the audit's one launch blocker

**Conformance is clean.** 47 design lines checked, **46 found**; the single
absence is the founder's footer change. Three placeholders —
`[ENQUIRIES EMAIL]`, `[AI DPS RM6200 REGISTRATION IN PROGRESS]`,
`[PRESS EMAIL]` — matching the board exactly. One `h1`, no skipped levels, no
SVG text, no unfilled media slots.

### The form was exercised, not just read

This is the site's only interactive component and the endpoint of every "Book a
value baseline" button on every page. It had never been run.

**Structure** matches the board: four fields (Name, Company, Work email, "Which
process is costing you most?"), a "Send" button, a hidden honeypot, `novalidate`
so server-side validation is authoritative, and an `aria-live` region.

**Empty submission** — server rejected it, returned four per-field messages, set
`aria-invalid` on all four inputs and announced "Please check the highlighted
fields." in the live region.

**Valid submission with no endpoint configured** — validation passed, the action
detected the missing `CONTACT_WEBHOOK_URL` and returned *"Our contact form is not
currently connected. Please email us directly so your enquiry reaches a person."*
The form stayed populated. **It failed loudly rather than showing a false
success**, which is the behaviour it was built for and had never been proven.

### 🚫 The blocker that testing exposed

Reading the code would not have surfaced this. The failure message tells a
visitor to **email directly** — and the enquiries address on the same page
renders as `[ENQUIRIES EMAIL]`.

| Route | State |
|---|---|
| Contact form | Not connected |
| Enquiries email | Placeholder |
| Press email | Placeholder |
| Postal address | **Real — and the only working route** |

Three separately-tracked placeholders whose *combination* is the problem: today
a visitor who wants to reach the company has a postal address and nothing else,
at the page where the entire funnel terminates.

Promoted to a **launch blocker** at the top of `GO-LIVE-CHECKLIST.md`. Either
setting `CONTACT_WEBHOOK_URL` or publishing a real enquiries address clears it;
neither is present now.

---

## Board 20 — AI landing · mobile 390px ✅

The mobile rendering of board 04, so this was a responsive check rather than a
new page.

**All nine content absences are the design's mobile-specific copy**, which
ADR-0008 settled at board 03: the build serves full copy at every breakpoint
because Google indexes the mobile rendering, and shortening it there would
remove 40% of the argument from the version that decides rankings.

Six are straightforwardly shortened — the lead, three stat-tile labels, the gap
paragraph, the Support & Run card. **Three needed checking rather than
assuming**: board 20 presents the Certified hand-off as a card
("NOT US · PIXELETTE CERTIFIED / AI Assurance & Governance"), where board 04
presents it as a panel ("The one we do not do: certify it"). Compared side by
side, both say the same thing — ISO/IEC 42001 and security review sit with
Pixelette Certified, not with this firm, with a link. The build carries board
04's fuller wording. **Substance present, presentation differs.**

**Mobile behaviour at 390px, verified on the site's largest page:** no horizontal
overflow, no element wider than the viewport, desktop nav hidden and mobile
disclosure shown, stat tiles / LIVE diagram / service cards all collapsed to one
column, Certified panel present, and **no interactive control under the 44px
touch minimum**.

The page runs 17.4 screens on a phone. That is long, and it is the deliberate
consequence of ADR-0008 — the alternative was cutting indexed content.

### Closing sweep

With the last board audited, the whole site was re-checked rather than trusting
per-page results: **25 pages × 3 widths (360, 390, 768px) = 75 combinations,
zero horizontal overflow.**

## How to re-run this audit

With the site built and running:

```bash
python scripts/audit.py --port 3000 --table
```

That covers links, metadata and the placeholder inventory site-wide. The
board-by-board content diff is a manual comparison against the design file; the
method is described at the top of this document.
