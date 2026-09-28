/**
 * What the site assistant is allowed to know, and nothing else.
 *
 * WHY THIS EXISTS. The assistant runs in the browser, so every module it imports
 * is shipped to every visitor. From 24 to 28 September 2026 it imported the
 * claims register and the company record directly, and a browser bundle cannot
 * take half a module: the WHOLE of both went into the public JavaScript loaded
 * by every page - each HELD claim with its hold instruction, every internal
 * evidence note, and the certification rows the site deliberately does not
 * publish. The assistant needed a handful of verdicts and a few public company
 * facts. The browser was sent the lot.
 *
 * So the registers are now read on the SERVER (`server-context.ts`, called from
 * the root layout) and reduced to this shape before anything crosses to the
 * browser. The assistant still answers from the register - releasing or
 * withholding a claim there changes what it says at the next build, with no
 * second list to keep in step - but only the verdicts travel, never the rows.
 *
 * TYPES ONLY. This file must never gain a runtime import: browser code imports
 * it. `scripts/test-pix.cjs` fails if any 'use client' module can reach a
 * register, and `scripts/check-public-output.mjs` fails the build if register
 * text appears in anything a visitor can download.
 */
export type PixContext = {
  /** The enquiries address the assistant hands out. */
  contactEmail: string;
  /** Identity facts for "what is Pixelette" - the same ones the site footer prints. */
  company: {
    name: string;
    legalName: string;
    incorporated: number;
    registeredIn: string;
    crn: string;
  };
  /** The Clutch aggregate, present only while the company record publishes it. */
  clutch: { ratingValue: number; reviewCount: number } | null;
  /**
   * The register ids the assistant consults that are currently VERIFIED.
   *
   * A LIST OF WHAT MAY BE SAID, not a map of every consulted row and its
   * status. An id missing from it is withheld, so every lookup fails closed: a
   * typo and a row that does not exist both mean "do not state it", never
   * "state it". The context itself is required - TypeScript enforces it at the
   * one call site - and without one the assistant errors rather than answers.
   */
  publishable: readonly string[];
};
