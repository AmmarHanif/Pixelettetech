/**
 * Company facts — the single source of truth.
 *
 * Rule for this file: nothing enters it that cannot be checked by a stranger.
 * Every certification carries the register you verify it on; every rating
 * carries the date it was last read off the source. If a fact is not yet
 * verifiable it belongs in `PLACEHOLDERS`, not here.
 */

/**
 * Apex, no `www` — deliberately. The live site's canonicals declare
 * `https://pixelettetech.com/...`, so that host is the indexed identity of every
 * preserved URL (ADR-0011). Keeping it makes the preservation complete at the
 * host level; `www` would have silently changed every "byte-identical" URL.
 * Verified against the live site's own metadata 2026-08-31.
 */
export const SITE_URL = 'https://pixelettetech.com';

export const company = {
  /** Exactly as registered at Companies House (checked 2026-09-01): LTD, not Limited. */
  legalName: 'Pixelette Technologies Ltd',
  name: 'Pixelette Technologies',
  shortName: 'Pixelette',
  crn: '11716825',
  incorporated: 2018,
  address: {
    street: '77 Fulham Palace Road',
    locality: 'London',
    postalCode: 'W6 8JA',
    country: 'GB',
    countryName: 'United Kingdom',
  },
  addressLine: '77 Fulham Palace Road, London W6 8JA',
  countriesDelivered: 13,
  tagline: 'Engineering that ships. Chains that hold. AI built into both.',
  description:
    'UK software engineering since 2018. Web, mobile and custom software, blockchain systems, and the AI we build into both.',
  linkedin: 'https://www.linkedin.com/company/pixelettetechnologies/',
} as const;

/**
 * Clutch aggregate rating.
 * Carried across from the live site's verified single source of truth
 * (src/data/clutchStats.ts), read off the Clutch profile on 2026-06-01.
 */
export const clutch = {
  ratingValue: 4.8,
  reviewCount: 24,
  profileUrl: 'https://clutch.co/profile/pixelette-technologies-0',
  /* Re-read off the Clutch profile 2026-09-03: still 4.8 from 24 reviews, so the
     figures are unchanged and only this date moved. Worth re-checking before
     launch — the site prints this date beside the rating, and a months-old
     "last verified" undercuts the point of publishing one at all. */
  lastVerified: '2026-09-03',
} as const;

export type Certification = {
  standard: string;
  status: 'Certified' | 'Group capability' | 'In progress';
  note?: string;
  verifyLabel: string;
  verifyUrl?: string;
  /** True when the certificate is held by Pixelette Certified, not by us. */
  heldByCertified?: boolean;
};

/**
 * The verification table. The design's rule is "every claim on this page
 * resolves to a link", and the ISO 42001 row exists specifically to say that
 * we do NOT hold it — Pixelette Certified does.
 */
export const certifications: Certification[] = [
  {
    standard: 'ISO 9001:2015',
    status: 'Certified',
    note: 'Quality management system',
    verifyLabel: 'IAF CertSearch',
    verifyUrl: 'https://www.iafcertsearch.org/',
  },
  {
    standard: 'ISO 27001:2022',
    status: 'Certified',
    note: 'Information security management system',
    /*
     * Founder decision 2026-09-01: certificate documents are held internally
     * and are NOT published on the site. This link was previously labelled
     * "Certificate" and pointed at /security-and-data, which hosts none — a
     * promise the page could not keep (audit finding C8). It now points at the
     * public register, labelled as what it is.
     */
    verifyLabel: 'IAF CertSearch',
    verifyUrl: 'https://www.iafcertsearch.org/',
  },
  {
    standard: 'Cyber Essentials Plus',
    status: 'Certified',
    note: 'Independently tested technical controls',
    verifyLabel: 'IASME register',
    verifyUrl: 'https://iasme.co.uk/cyber-essentials/ncsc-certificate-search/',
  },
  {
    standard: 'ISO/IEC 42001',
    status: 'Group capability',
    note: 'AI management systems. Delivered by Pixelette Certified, not held by Pixelette Technologies.',
    verifyLabel: 'Pixelette Certified',
    verifyUrl: 'https://pixelettecertified.com',
    heldByCertified: true,
  },
  {
    standard: 'AI DPS RM6200',
    status: 'In progress',
    note: 'Crown Commercial Service dynamic purchasing system',
    verifyLabel: 'Pending listing',
  },
];

/** Short badges used in headers, hero rows and the footer. */
export const trustBadges = ['ISO 9001', 'ISO 27001', 'Cyber Essentials Plus'] as const;

export const certified = {
  name: 'Pixelette Certified',
  url: 'https://pixelettecertified.com',
  blurb:
    'The group’s compliance and certification practice: ISO 27001, ISO/IEC 42001 for AI management systems, Cyber Essentials, GDPR and SOC 2, delivered by certified lead auditors.',
  /**
   * The certification standards, shown wherever Certified is introduced.
   * This is the set the design lists on the front page.
   */
  standards: ['ISO 27001', 'ISO 42001', 'Cyber Essentials', 'GDPR', 'SOC 2'],
  /**
   * The full service list, including the two retained-officer services. The
   * design shows these only on the Assurance page, where the reader has already
   * chosen to look at certification rather than at engineering.
   */
  services: [
    'ISO 27001',
    'ISO 42001',
    'Cyber Essentials',
    'GDPR',
    'SOC 2',
    'vCISO',
    'vDPO',
  ],
} as const;

/**
 * Contact routes.
 *
 * The design leaves these as [ENQUIRIES EMAIL] / [PRESS EMAIL]. Both were
 * carried as visible placeholders until confirmed, because an invented address
 * on a contact page loses enquiries rather than merely looking unfinished.
 *
 * Confirmed by the founder on 2026-08-31: `sales@pixelettetech.com`, the address
 * the current live site already hands out as its direct route. Press points at
 * the same inbox by decision — one monitored route beats two where one is not.
 */
export const contactEmail = 'sales@pixelettetech.com';
export const pressEmail = contactEmail;

/** Blockchain practice facts. Twenty-four in production use, named. */
export const chains = [
  'Ethereum',
  'Binance Smart Chain',
  'Polygon',
  'Solana',
  'Avalanche',
  'Cardano',
  'Polkadot',
  'Tezos',
  'Hyperledger Fabric',
  'Corda',
  'Stellar',
  'Hedera Hashgraph',
  'Algorand',
  'Cosmos',
  'Tron',
  'EOS',
  'Chainlink',
  'Arbitrum',
  'Optimism',
  'zkSync',
  'Near',
  'Aptos',
  'Sui',
  'VeChain',
] as const;

export const consensusAndCryptography = [
  'Proof of Work',
  'Proof of Stake',
  'Delegated PoS',
  'zk-SNARKs',
  'Multi-party computation',
  'Distributed ledger',
] as const;

export const blockchainSectors = [
  'Financial services',
  'Insurance',
  'Healthcare',
  'Retail',
  'Logistics',
  'Energy',
  'Manufacturing',
  'Public sector',
  'Telecom',
  'Hospitality',
  'Food & beverage',
  'Entertainment',
] as const;
