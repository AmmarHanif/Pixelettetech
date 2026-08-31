/**
 * Cited research.
 *
 * Every statistic rendered on this site pulls its attribution from here, so a
 * figure and its source can never drift apart across pages. `Stat.source` is a
 * required field on purpose — an uncited number cannot be added to the site
 * without the type checker complaining.
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
};

/** The gap: adoption is universal, attributable value is not. */
export const gapStats: Stat[] = [
  {
    value: '80%',
    label: 'of individual AI users report they are more productive',
    source: 'McKinsey State of AI, August 2026, n=1,719',
  },
  {
    value: '37%',
    label: 'of organisations can attribute any EBIT impact to it, unchanged year on year',
    source: 'McKinsey State of AI, August 2026, n=1,719',
  },
];

/** Why LIVE insists on a named process before an engagement starts. */
export const productionConversionStats: Stat[] = [
  {
    value: '54% / 19%',
    label: 'Generic productivity cases: proof of concept against production',
    source: 'HFS Research, May 2026, n=979 use cases',
  },
  {
    value: '8% / 27%',
    label: 'Narrow process-performance cases: proof of concept against production',
    source: 'HFS Research, May 2026, n=979 use cases',
  },
];

/** Data readiness is the named blocker, not model capability. */
export const dataBarrierStats: Stat[] = [
  {
    value: '58%',
    label: 'name data readiness and access as their number one barrier',
    source: 'KPMG, 2026',
  },
  {
    value: '72%',
    label: 'cite data quality as the top obstacle',
    source: 'Deloitte Private, 2026',
  },
  {
    value: '3 in 4',
    label: 'UK professional services firms unready on data, orchestration and monitoring',
    source: 'GOV.UK, 2026',
  },
];

/** Why someone has to own the running of it. */
export const runStats: Stat[] = [
  {
    value: '54',
    label: 'AI agent incidents a year at the average organisation, 17% of them high severity',
    source: 'Industry incident survey, 2026',
  },
  {
    value: '85%',
    label: 'of technology executives lack real-time visibility of AI spend',
    source: 'Industry incident survey, 2026',
  },
  {
    value: '11%',
    label: 'feel prepared for the agent scale they expect by 2027',
    source: 'Industry incident survey, 2026',
  },
];

/** Professional and business services: the commercial pressure is client-side. */
export const professionalServicesStats: Stat[] = [
  {
    value: '78%',
    label: 'of UK corporate clients call AI-enabled quality improvement essential or very important',
    shortLabel: 'of UK corporate clients call it essential',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
  },
  {
    value: '7%',
    label: 'say their providers are actually delivering it',
    shortLabel: 'say providers deliver it',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
  },
  {
    value: '£20bn',
    label: 'of UK client revenue under active reconsideration',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
  },
  {
    value: '71%',
    label: 'report client pressure, against 22% in the US',
    source: 'Thomson Reuters Future of Professionals 2026, UK sample',
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
