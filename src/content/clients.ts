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
 * The approval gate (added 2026-09-08).
 *
 * The founder's implementation handoff puts client logos and names behind an
 * approval gate rather than a hold: "Confirm genuine engagement + public-use
 * permission/legitimate basis", and "never use a logo purely because it appears
 * in an old deck". `permission` records where each name stands, and it is a
 * required field for the same reason `Stat.source` is required in sources.ts —
 * a name cannot be added to this file without someone stating the basis on
 * which it can be published.
 *
 * Every row is UNCONFIRMED today. That is a statement about the paperwork, not
 * about the engagements: nothing in this repository records the permission, and
 * this file is not the place to assert one. The names are still rendered,
 * because the handoff asks for the proof row and the founder has not been asked
 * this question yet; taking seven clients off the homepage is his decision to
 * make, not one to take silently on his behalf. It is raised as an open gate.
 *
 * When the answer comes back, mark the confirmed rows APPROVED and switch the
 * render to `approvedClients()`. If permission is refused for a name, delete
 * the row: the handoff supports anonymised presentation without changing the
 * layout, so a shorter row is not a broken one.
 */
export type ClientPermission = 'APPROVED' | 'UNCONFIRMED';

export type Client = {
  name: string;
  /** Not yet rendered — see the note above. */
  logo: string;
  /** Whether the engagement and the right to name it publicly are confirmed. */
  permission: ClientPermission;
};

export const clients: Client[] = [
  { name: 'gowalkies', logo: '/logos/gowalkies.png', permission: 'UNCONFIRMED' },
  { name: 'SIB360', logo: '/logos/sib360.png', permission: 'UNCONFIRMED' },
  { name: 'One-Stop CCTV', logo: '/logos/onestop-cctv.png', permission: 'UNCONFIRMED' },
  { name: 'Butter Smiles', logo: '/logos/buttersmiles.png', permission: 'UNCONFIRMED' },
  { name: 'Beowulf', logo: '/logos/beowulf.png', permission: 'UNCONFIRMED' },
  { name: 'CAST Perimeter', logo: '/logos/cast-perimeter.png', permission: 'UNCONFIRMED' },
  { name: 'Lytics', logo: '/logos/lytics.png', permission: 'UNCONFIRMED' },
];

/** Also cleared, held back only because the design's row shows seven. */
export const additionalClients: Client[] = [
  { name: 'Akashic Knowing', logo: '/logos/akashic.png', permission: 'UNCONFIRMED' },
];

/**
 * The names whose public-use basis is confirmed. Empty until the gate above is
 * answered; a component that maps over it must render nothing rather than an
 * empty "Trusted by" frame.
 */
export function approvedClients(): Client[] {
  return clients.filter(client => client.permission === 'APPROVED');
}
