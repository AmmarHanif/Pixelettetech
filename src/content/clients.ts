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

export type Client = {
  name: string;
  /** Not yet rendered — see the note above. */
  logo: string;
};

export const clients: Client[] = [
  { name: 'gowalkies', logo: '/logos/gowalkies.png' },
  { name: 'SIB360', logo: '/logos/sib360.png' },
  { name: 'One-Stop CCTV', logo: '/logos/onestop-cctv.png' },
  { name: 'Butter Smiles', logo: '/logos/buttersmiles.png' },
  { name: 'Beowulf', logo: '/logos/beowulf.png' },
  { name: 'CAST Perimeter', logo: '/logos/cast-perimeter.png' },
  { name: 'Lytics', logo: '/logos/lytics.png' },
];

/** Also cleared, held back only because the design's row shows seven. */
export const additionalClients: Client[] = [
  { name: 'Akashic Knowing', logo: '/logos/akashic.png' },
];
