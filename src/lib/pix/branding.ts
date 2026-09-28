/**
 * The customer-facing name, in the one place both halves can safely read it.
 *
 * WHY THIS IS NOT IN config.ts. The obvious home for the name is the config
 * module, and that was the first attempt. It is wrong: config.ts reads
 * process.env for budgets, limits and model names, and SiteAssistant is a
 * client component - so importing it there would pull the whole operating
 * configuration into the browser bundle. Next would resolve the non-public
 * variables to undefined, so the values would silently be defaults rather than
 * the deployed ones, and the shape of Pixelette's limits and model names would
 * be sitting in public JavaScript for no reason.
 *
 * So the name lives here, with no environment access and nothing to leak, and
 * config.ts imports it. One source of truth, and the boundary stays intact.
 *
 * SPELLING IS LOAD-BEARING. The brief is explicit: "Pix T" in customer-facing
 * prose, never Pix, PixT, Pix-T, Pixie, Pix AI, Pixelette AI or Pixelette
 * Assistant. Internal identifiers may differ; anything a visitor reads comes
 * from here.
 */

export const PIX_T_NAME = 'Pix T';
export const PIX_T_DESCRIPTOR = 'AI assistant';
