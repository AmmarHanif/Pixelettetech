/**
 * Cited research.
 *
 * Every statistic rendered on this site pulls its attribution from here, so a
 * figure and its source can never drift apart across pages. `Stat.source` is a
 * required field on purpose — an uncited number cannot be added to the site
 * without the type checker complaining.
 *
 * 2026-09-08. A required `source` turned out to be necessary but not
 * sufficient: three figures satisfied it with "Industry incident survey, 2026",
 * an attribution that names nobody and cannot be looked up. `Stat.published` is
 * the second half of the rule — a required, undefaulted decision about whether
 * the attribution is checkable — and `publishedStats()` is the filter a
 * register passes through before a page sees it. Same shape as the two
 * registers either side of this one: `claims.ts` for claims about Pixelette,
 * `work.ts` for case-study figures, this file for third-party research.
 */

export type Stat = {
  value: string;
  /** The precise claim, safe to render anywhere on its own. */
  label: string;
  /**
   * A compressed label for a small tile, used only where the full claim already
   * appears in prose immediately above it. `label` stays precise so the stat is
   * never reused in a shortened, less accurate form by accident.
   */
  shortLabel?: string;
  /** Attribution line rendered under or beside the figure. Required. */
  source: string;
  /**
   * Whether the attribution names a publisher a reader could actually go and
   * find. Required, and deliberately not defaulted: `source` being a non-empty
   * string only proves somebody typed something, and the one uncheckable
   * citation in this file ("Industry incident survey, 2026") satisfied the
   * required-`source` rule perfectly while naming nobody.
   *
   * `true` means: publisher, and enough of a title or date that the figure can
   * be traced. `false` means the figure does not render — it is held here with
   * an `attributionNote` saying what would release it.
   */
  published: boolean;
};

/** A figure held back because its attribution cannot be checked. */
export type UnattributedStat = Stat & {
  published: false;
  /** What must be established before this figure can be published. */
  attributionNote: string;
};

/**
 * The figures a page may render, from a register that may contain held ones.
 *
 * Fails closed by construction: a figure has to say `published: true` to
 * survive this filter, so a new statistic added without an attribution
 * decision renders nowhere rather than everywhere.
 */
function publishedStats(register: readonly Stat[]): Stat[] {
  return register.filter(stat => stat.published);
}

/** The gap: adoption is universal, attributable value is not. */
export const gapStats: Stat[] = [
  {
    value: '80%',
    label: 'of individual AI users report they are more productive',
    source: 'McKinsey State of AI, August 2026, n=1,719',
    published: true,
  },
  {
    value: '37%',
    label: 'of organisations can attribute any EBIT impact to it, unchanged year on year',
    source: 'McKinsey State of AI, August 2026, n=1,719',
    published: true,
  },
];

/** Why LIVE insists on a named process before an engagement starts. */
export const productionConversionStats: Stat[] = [
  {
    value: '54% / 19%',
    label: 'Generic productivity cases: proof of concept against production',
    source: 'HFS Research, May 2026, n=979 use cases',
    published: true,
  },
  {
    value: '8% / 27%',
    label: 'Narrow process-performance cases: proof of concept against production',
    source: 'HFS Research, May 2026, n=979 use cases',
    published: true,
  },
];

/** Data readiness is the named blocker, not model capability. */
export const dataBarrierStats: Stat[] = [
  {
    value: '58%',
    label: 'name data readiness and access as their number one barrier',
    source: 'KPMG, 2026',
    published: true,
  },
  {
    value: '72%',
    label: 'cite data quality as the top obstacle',
    source: 'Deloitte Private, 2026',
    published: true,
  },
  {
    value: '3 in 4',
    label: 'UK professional services firms unready on data, orchestration and monitoring',
    source: 'GOV.UK, 2026',
    published: true,
  },
];

/**
 * Why someone has to own the running of it.
 *
 * ---------------------------------------------------------------------------
 * 2026-09-08 (WP6 claims sweep). These three figures are now HELD and render
 * nowhere. `runStats` below is the published view of `runStatsRegister`, and
 * every row in that register is `published: false`, so the published view is
 * empty.
 *
 * Why. All three cited "Industry incident survey, 2026", which names no
 * publisher, no title and no sample. Unlike every other source in this file it
 * cannot be looked up, so a reader has no way to check a figure the site is
 * asserting. These are third-party research figures rather than claims about
 * Pixelette, so they sit outside the claims register in claims.ts — but the
 * handoff's rule that a published statistic must have evidence for the exact
 * claim reaches them all the same.
 *
 * What was tried before holding them. The whole project tree was searched for
 * the real publisher: design/handoff-2026-09-08/ (both the .txt and the .docx
 * handoff), design/mockups/, the parent project's certificates/ (empty),
 * content-gaps-2026-09-08/, LEGAL-REVIEW-2026-09-07.md, the ADRs and the
 * previous site's repo/. The strings "incident survey", "agent incidents",
 * "visibility of AI spend" and "agent scale" appear nowhere except in this
 * file. There is no publisher to name, so the only honest options were to hold
 * the figures or to invent an attribution, and inventing one is not an option.
 *
 * How to publish them again. Find the actual study, put its publisher, title
 * and date into `source`, and set `published: true`. Nothing else changes.
 * ---------------------------------------------------------------------------
 */
export const runStatsRegister: readonly UnattributedStat[] = [
  {
    value: '54',
    label: 'AI agent incidents a year at the average organisation, 17% of them high severity',
    source: 'Industry incident survey, 2026',
    published: false,
    attributionNote:
      'No publisher, title or sample size. Not traceable to any document in this repository or the parent project folder.',
  },
  {
    value: '85%',
    label: 'of technology executives lack real-time visibility of AI spend',
    source: 'Industry incident survey, 2026',
    published: false,
    attributionNote:
      'No publisher, title or sample size. Not traceable to any document in this repository or the parent project folder.',
  },
  {
    value: '11%',
    label: 'feel prepared for the agent scale they expect by 2027',
    source: 'Industry incident survey, 2026',
    published: false,
    attributionNote:
      'No publisher, title or sample size. Not traceable to any document in this repository or the parent project folder.',
  },
];

/**
 * The published view. Empty today, by decision rather than by omission.
 *
 * CONSUMER STATUS, 2026-09-08 (was "KNOWN CONSUMER BREAK", fixed the same day).
 * The single consumer, src/app/ai-automation/support-and-run/page.tsx, read
 * `runStats[0]!.source` and threw "TypeError: Cannot read properties of
 * undefined (reading 'source')" the moment this view emptied, with
 * `tsc --noEmit` green throughout — a non-null assertion is precisely a promise
 * not to check. It no longer indexes at all. It derives its attribution with
 * `Array.from(new Set(runStats.map(stat => stat.source)))` and gates the hero
 * tile grid on `runStats.length`, so an empty register renders no grid, no
 * attribution and no empty band, and a register whose figures come from two
 * studies names both instead of crediting the first for all of them.
 *
 * Verified 2026-09-08 by rendering that page with this view empty and with it
 * populated, not by reading the source. Nothing is outstanding against this
 * file. Two sibling pages carried the identical `[0]!` shape and were fixed the
 * same way on the same day: /ai-automation (`gapStats`) and
 * /industries/professional-services (`professionalServicesStats`).
 *
 * The rule this leaves behind: a register that can legitimately empty must not
 * be read by index anywhere. Derive from it, and gate its container on
 * `length`.
 */
export const runStats: Stat[] = publishedStats(runStatsRegister);

/** Professional and business services: the commercial pressure is client-side. */
export const professionalServicesStats: Stat[] = [
  {
    value: '78%',
    label: 'of UK corporate clients call AI-enabled quality improvement essential or very important',
    shortLabel: 'of UK corporate clients call it essential',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
    published: true,
  },
  {
    value: '7%',
    label: 'say their providers are actually delivering it',
    shortLabel: 'say providers deliver it',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
    published: true,
  },
  {
    value: '£20bn',
    label: 'of UK client revenue under active reconsideration',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
    published: true,
  },
  {
    value: '71%',
    label: 'report client pressure, against 22% in the US',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
    published: true,
  },
];

export const SOURCES = {
  mckinsey: 'McKinsey State of AI, August 2026, n=1,719',
  hfs: 'HFS Research, May 2026, n=979 use cases',
  thomsonReuters: 'Thomson Reuters Future of Professionals 2026',
  thomsonReutersRoi: 'Thomson Reuters, February 2026, n=1,500+',
  gartner: 'Gartner, 2025–2026',
  doraMetr: 'DORA 2026 and METR, 2025–2026',
  g2: 'G2 Buyer Behavior Report, July 2026',
  boeFca: 'Bank of England / FCA AI survey',
  kpmg: 'KPMG 2026',
  deloitte: 'Deloitte Private 2026',
  govuk: 'GOV.UK 2026',
} as const;
