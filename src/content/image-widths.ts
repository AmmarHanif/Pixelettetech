/**
 * Intrinsic pixel width of every case-study image, measured from the files.
 *
 * WHY THIS EXISTS. The case-study hero renders at 1110 CSS px. The images are
 * 346 to 699 px wide, so the hero was upscaling every one of them, by 1.64x for
 * the 675px pack and 3.21x for aia. Blowing a raster up past its own resolution
 * is the whole reason the case-study imagery reads as soft; every other surface
 * on the site renders these DOWN and is genuinely sharp.
 *
 * `heroMaxWidth` below turns each width into the widest the hero may render it,
 * so no image is ever stretched past its own resolution.
 *
 * REGENERATE THIS FILE whenever an image in public/work is added or replaced.
 * It is a measurement with a date on it, not a constant: if a file is swapped
 * for a larger one and this map is not updated, the hero will keep rendering it
 * small, which fails quietly in the safe direction but still fails.
 *
 * Measured 2026-09-18 from public/work/*.png.
 */
export const imageWidths: Record<string, number> = {
  '/work/2connect.png': 675,
  '/work/adwatch.png': 675,
  '/work/aia.png': 346,
  '/work/ayni.png': 675,
  '/work/beyorch.png': 675,
  '/work/blockguard.png': 675,
  '/work/chain-legal.png': 675,
  '/work/credit-smart-ai.png': 675,
  '/work/crypto-audit.png': 675,
  '/work/diamond-nxt.png': 675,
  '/work/digital-asset-vault.png': 671,
  '/work/finchain.png': 675,
  '/work/fusio.png': 675,
  '/work/health-chain.png': 675,
  '/work/health-predictor.png': 675,
  '/work/juris-predict.png': 675,
  '/work/law-ledger.png': 675,
  '/work/legal-mind-ai.png': 675,
  '/work/life-optimizer-ai.png': 675,
  '/work/lytics.png': 699,
  '/work/medi-analyze-ai.png': 675,
  '/work/mind-coach-ai.png': 675,
  '/work/neom.png': 512,
  '/work/neurostack.png': 675,
  '/work/ragnar-token.png': 675,
  '/work/sandoz.png': 512,
  '/work/smart-contractor.png': 675,
  '/work/stay-sane.png': 675,
  '/work/transact-secure.png': 675,
};

/**
 * The widest the case-study hero may render an image, in CSS px.
 *
 * 1.0, changed from 1.2 on 2026-09-18 after the founder asked for a clear
 * recommendation. 1.2 was a tolerance borrowed from advice, and a tolerance is
 * the right shape when you are trading sharpness for presence. Here there is
 * nothing to trade: the founder has ruled out re-capture and fresh consent, so
 * these files are final, and the only question left is whether the site renders
 * them as well as they can be rendered. 1.0 is that. Anything above it is
 * choosing avoidable softness on the page whose job is evidence.
 *
 * Returns undefined for an unknown src, which lets the hero fall back to the
 * full column rather than collapsing to nothing. An unmeasured image rendering
 * soft is a smaller failure than one rendering at zero width.
 *
 * THIS BUYS DPR 1 ONLY. On a retina display a natively capped hero is still
 * short of the 2220px the slot wants. Mitigation, not the fix.
 */
export function heroMaxWidth(src: string | undefined): number | undefined {
  if (!src) return undefined;
  const intrinsic = imageWidths[src];
  return intrinsic === undefined ? undefined : intrinsic;
}
