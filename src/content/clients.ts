/**
 * Named clients we are permitted to reference.
 *
 * Rendered as text wordmarks, which is what the approved design specifies.
 *
 * On the logo files: `logo` points at the artwork carried across from the
 * current site's asset library, and it is NOT currently rendered. Those files
 * are white-on-transparent, drawn for the old dark-themed site — SIB360 and
 * CAST Perimeter are invisible on a white background, and gowalkies is a mid
 * grey that no single CSS filter can correct alongside them. The similarly
 * named SVGs in that library are worse: unfinished exports that are solid black
 * rectangles.
 *
 * Switching this row to images needs light-background artwork per client. The
 * paths are kept so that swap is a one-line change when the assets arrive.
 */

/**
 * The approval gate (raised 2026-09-08, ANSWERED by the founder 2026-09-11).
 *
 * The founder's implementation handoff puts client logos and names behind an
 * approval gate rather than a hold: "Confirm genuine engagement + public-use
 * permission/legitimate basis", and "never use a logo purely because it appears
 * in an old deck". `permission` records where each name stands, and it is a
 * required field for the same reason `Stat.source` is required in sources.ts —
 * a name cannot be added to this file without someone stating the basis on
 * which it can be published.
 *
 * THE QUESTION AS IT WAS PUT (this file, 2026-09-08, kept word for word,
 * because an answer only means something beside the question it answers):
 *
 *   "Every row is UNCONFIRMED today. That is a statement about the paperwork,
 *   not about the engagements: nothing in this repository records the
 *   permission, and this file is not the place to assert one. The names are
 *   still rendered, because the handoff asks for the proof row and the founder
 *   has not been asked this question yet; taking seven clients off the homepage
 *   is his decision to make, not one to take silently on his behalf. It is
 *   raised as an open gate."
 *
 * THE DECISION.
 *
 *   Approved by : THE FOUNDER. Not the engineer who edited this file, and not
 *                 an inference from the fact that the names were already
 *                 rendering. The 2026-09-08 note above records that this was
 *                 his call and nobody else's; he has now made it.
 *   Approved on : 2026-09-11.
 *   Question    : should the seven names that render with no recorded
 *                 permission be hidden, or kept?
 *   Answer      : KEEP THEM — "Keep them — I'm confident we have the basis."
 *
 *   The seven rows of `clients` below are therefore APPROVED. That makes this
 *   register say what the site has actually been doing: since 2026-09-08 the
 *   build published seven names while the register called all seven
 *   UNCONFIRMED, and a register that contradicts the render protects nobody.
 *   The contradiction is resolved in the direction the founder chose, which is
 *   to keep the names up — not by quietly taking them down.
 *
 * WHAT "APPROVED" MEANS HERE, AND WHAT IT DOES NOT. Read this before relying
 * on it, and do not upgrade it by paraphrase.
 *
 *   It MEANS: the founder, on 2026-09-11, stated that he is confident the basis
 *   exists and directed that these names stay published. His decision is the
 *   approval, and it is attributed here because an approval nobody can put a
 *   name and a date against is not an approval at all.
 *
 *   It does NOT mean a per-client permission document has been filed anywhere
 *   in this repository. None has, and this file still is not the place to
 *   assert one. If the basis for a particular name is ever challenged, what
 *   exists to answer with is the founder's decision of 2026-09-11 — not a
 *   signed release from that client. Anyone who later obtains the per-client
 *   evidence should record it against the row it belongs to, rather than assume
 *   these lines already cover it.
 *
 * DELIBERATELY NOT CHANGED BY THIS DECISION, and each is somebody's next job:
 *
 *   - The `client-logos` row in `src/content/claims.ts` still reads HELD, with
 *     its "APPROVAL GATE — Confirm genuine engagement + public-use
 *     permission/legitimate basis" instruction. That register is the record of
 *     record for this claim class, and it now lags this file by one decision.
 *     Moving it is a claims-register change and is left to whoever owns that
 *     file; it is flagged here rather than swept in.
 *   - `ClientLogos` (`src/components/sections.tsx`) still reads `clients`, not
 *     `approvedClients()`. With all seven rows APPROVED those two now return
 *     the same seven names, so the switch that file describes is finally safe
 *     and is a genuine one-liner — but it is a change to another file and is
 *     left to whoever makes it.
 *
 * If permission is ever refused for a name, delete the row: the handoff
 * supports anonymised presentation without changing the layout, so a shorter
 * row is not a broken one.
 */
export type ClientPermission = 'APPROVED' | 'UNCONFIRMED';

export type Client = {
  name: string;
  /** Not yet rendered — see the note above. */
  logo: string;
  /** Whether the engagement and the right to name it publicly are confirmed. */
  permission: ClientPermission;
};

/**
 * The seven names the founder kept on 2026-09-11.
 *
 * These are the rows that render, through `ClientLogos` on `/` and
 * `/ai-engineering`. Every one of them is covered by that decision, and by
 * nothing else — see the gate note above for what that does and does not buy.
 */
export const clients: Client[] = [
  { name: 'gowalkies', logo: '/logos/gowalkies.png', permission: 'APPROVED' },
  { name: 'SIB360', logo: '/logos/sib360.png', permission: 'APPROVED' },
  { name: 'One-Stop CCTV', logo: '/logos/onestop-cctv.png', permission: 'APPROVED' },
  { name: 'Butter Smiles', logo: '/logos/buttersmiles.png', permission: 'APPROVED' },
  { name: 'Beowulf', logo: '/logos/beowulf.png', permission: 'APPROVED' },
  { name: 'CAST Perimeter', logo: '/logos/cast-perimeter.png', permission: 'APPROVED' },
  { name: 'Lytics', logo: '/logos/lytics.png', permission: 'APPROVED' },
];

/**
 * The eighth row — held back from the render, and NOT swept in with the seven.
 *
 * Nothing imports this array. `ClientLogos` reads `clients` alone, so this name
 * has never been published by this build; it sits out because the approved
 * design's "Trusted by" row shows seven names.
 *
 * It therefore stays UNCONFIRMED. The founder's decision of 2026-09-11 was put
 * to him about the seven names that were live and visible on the homepage, and
 * it is not blanket permission: a name he was not asked about cannot be
 * approved by an answer he gave about different names. Marking it APPROVED on
 * the strength of that decision would be manufacturing a permission, which is
 * the exact failure this file exists to prevent. Put it to him in its own right
 * and it can move — and until someone does, this row is also what stops the
 * name publishing by accident if it is ever added to the rendered list.
 *
 * Corrected 2026-09-11: this comment previously read "Also cleared, held back
 * only because the design's row shows seven." Nothing in this repository
 * evidences that clearance, and it sat directly above a row whose own field
 * said UNCONFIRMED. The field is the record; the adjective was not, and it is
 * removed rather than left to be quoted back later as a permission.
 */
export const additionalClients: Client[] = [
  { name: 'Akashic Knowing', logo: '/logos/akashic.png', permission: 'UNCONFIRMED' },
];

/**
 * The names whose public-use basis is confirmed.
 *
 * As at 2026-09-11 this returns all seven rows of `clients`, because the
 * founder's decision of that date moved every one of them to APPROVED. That is
 * a fact about today's data and not a guarantee: the filter is the whole point,
 * so a row set back to UNCONFIRMED drops out of here with nobody editing this
 * function.
 *
 * A component that maps over it must still render nothing rather than an empty
 * "Trusted by" frame. This can return an empty array again, and the zero guard
 * in `ClientLogos` is what makes that safe.
 */
export function approvedClients(): Client[] {
  return clients.filter(client => client.permission === 'APPROVED');
}
