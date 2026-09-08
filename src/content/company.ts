/**
 * Company facts — the single source of truth.
 *
 * Rule for this file: nothing enters it that cannot be checked by a stranger.
 * Every certification carries the register you verify it on; every rating
 * carries the date it was last read off the source. If a fact is not yet
 * verifiable it belongs in `PLACEHOLDERS`, not here.
 *
 * As of 8 September 2026 that rule has teeth. The founder's implementation
 * handoff holds every badge, rating, award and count until there is evidence
 * for the exact claim, and `src/content/claims.ts` is the register that records
 * each one's status. A fact whose row in that register says HELD does not
 * render, whatever this file happens to contain: where a value is kept here for
 * an internal record, it is kept behind a name that says so.
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
  /**
   * VAT registration number.
   *
   * Verified at HMRC's "Check a UK VAT number" service on 2026-09-07: 432237717
   * returns "Valid UK VAT number" for PIXELETTE TECHNOLOGIES LTD.
   *
   * Publishing this is NOT optional. The Electronic Commerce (EC Directive)
   * Regulations 2002 reg. 6(1)(g) and the Provision of Services Regulations 2009
   * reg. 8(1)(g) both require the VAT identification number to be given where the
   * provider undertakes an activity subject to VAT.
   *
   * NOTE for whoever reads this next: HMRC's VAT record still shows the OLD
   * registered address (71-75 Shelton Street, WC2H 9JQ). Companies House was
   * updated to Fulham Palace Road on 15 January 2026. HMRC has not been. That is
   * a separate matter from the website and is flagged to the founder.
   */
  vat: 'GB 432 2377 17',
  /**
   * HELD CLAIM — do not render, and do not put a number back here.
   *
   * "Thirteen countries" is a geography count. The 8 September 2026 handoff
   * holds "13 countries or any other geography count" outright, and the legal
   * review of 7 September lists it among the claims that could not be verified
   * and says the figure needs a source (claims.ts `geography-count`).
   *
   * The key survives, empty, only so that the pages still printing this tile
   * keep compiling; an empty string renders nothing rather than an unverified
   * number. Those call sites should drop the tile:
   * about/page.tsx, engineering/page.tsx, ai-engineering/page.tsx and the
   * TrustStrip in components/sections.tsx. To publish a figure again, name the
   * countries and the engagements that put the company in them, then move the
   * register row to VERIFIED.
   */
  countriesDelivered: '',
  tagline: 'Engineering that ships. Chains that hold. AI built into both.',
  description:
    'UK software engineering since 2018. Web, mobile and custom software, blockchain systems, and the AI we build into both.',
  linkedin: 'https://www.linkedin.com/company/pixelettetechnologies/',
} as const;

/**
 * Clutch aggregate rating.
 *
 * Carried across from the live site's verified single source of truth
 * (src/data/clutchStats.ts), read off the Clutch profile on 2026-06-01 and
 * re-read on 2026-09-03: still 4.8 from 24 reviews, so the figures are
 * unchanged and only the date moved.
 *
 * HELD FOR EVIDENCE until launch day. The handoff's register says "HOLD —
 * Verify live profile, current score and review count" (claims.ts
 * `clutch-rating`). The figures are kept here rather than deleted because they
 * are a genuine third-party aggregate, accurately reproduced and dated, and the
 * 7 September legal review judged printing the verification date to be exactly
 * the right practice under the DMCCA fake-review provisions. What is missing is
 * recency: a rating published from a months-old read is the thing the register
 * is guarding against.
 *
 * `published` is the gate. It goes true on the day someone re-reads the live
 * profile, updates `lastVerified`, and moves the register row to VERIFIED. Any
 * component rendering these figures must check it — today it renders nothing.
 */
export const clutch = {
  ratingValue: 4.8,
  reviewCount: 24,
  profileUrl: 'https://clutch.co/profile/pixelette-technologies-0',
  lastVerified: '2026-09-03',
  published: false,
} as const;

export type Certification = {
  standard: string;
  status: 'Certified' | 'Group capability' | 'In progress';
  note?: string;
  verifyLabel: string;
  verifyUrl?: string;
  /** True when the certificate is held by Pixelette Certified, not by us. */
  heldByCertified?: boolean;
  /**
   * Renders only when true. Set it when the certificate number, the issuing
   * certification body and the expiry date are in hand for this exact legal
   * entity — not before. See claims.ts `iso-cyber-essentials-badges`.
   */
  published?: boolean;
};

/**
 * The internal certification record.
 *
 * The design's rule is "every claim on this page resolves to a link", and the
 * ISO 42001 row exists specifically to say that we do NOT hold it. The rule
 * turned out to be one the page could not keep: the 7 September 2026 legal
 * review tried to resolve all three certificate links and could not, because
 * IAF CertSearch requires an account and the IASME search sits behind bot
 * protection. Its finding was precise, and is worth repeating rather than
 * softening: not doubted, not verified. design/certificates/ is empty.
 *
 * So every row here is unpublished. This is the internal record, kept so the
 * work is not lost and so the missing evidence is named; `certifications` below
 * is what the site may render.
 */
export const certificationRegister: Certification[] = [
  {
    standard: 'ISO 9001:2015',
    status: 'Certified',
    note: 'Quality management system',
    verifyLabel: 'IAF CertSearch',
    verifyUrl: 'https://www.iafcertsearch.org/',
    published: false,
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
     * public register, labelled as what it is. The register is still not a
     * resolution: it is a search box. Publishing the certificate number, the
     * issuing body and the expiry date is what would let a stranger check.
     */
    verifyLabel: 'IAF CertSearch',
    verifyUrl: 'https://www.iafcertsearch.org/',
    published: false,
  },
  {
    standard: 'Cyber Essentials Plus',
    status: 'Certified',
    note: 'Independently tested technical controls',
    verifyLabel: 'IASME register',
    verifyUrl: 'https://iasme.co.uk/cyber-essentials/ncsc-certificate-search/',
    published: false,
  },
  {
    standard: 'ISO/IEC 42001',
    status: 'Group capability',
    /* Reworded 2026-09-08 under the handoff's ACCREDITATION-SAFE RULE, which
       forbids saying a group company holds a standard until the exact legal
       entity and status are verified. The row said Certified delivers ISO 42001;
       it now says what can be evidenced, which is the route. */
    note: 'AI management systems. Pixelette Technologies does not hold this standard; Pixelette Certified supports readiness and the route to independent assessment.',
    verifyLabel: 'Pixelette Certified',
    verifyUrl: 'https://pixelettecertified.com',
    heldByCertified: true,
    published: false,
  },
  {
    standard: 'AI DPS RM6200',
    status: 'In progress',
    note: 'Crown Commercial Service dynamic purchasing system',
    /* Unpublished for a different reason from the rows above: there is no
       listing to point at yet, so "in progress" is a status a reader cannot
       check. It publishes the day the listing exists. */
    verifyLabel: 'Pending listing',
    published: false,
  },
];

/**
 * What the site may render. Empty until a row above is evidenced and marked
 * published, which is the intended state and not an oversight: the handoff is
 * explicit that a first release is strong on client work and case studies
 * alone, and that a missing badge must never leave a broken layout. Any
 * component mapping over this has to render nothing when it is empty.
 */
export const certifications: Certification[] = certificationRegister.filter(
  cert => cert.published === true,
);

/**
 * Short badges used in headers, hero rows and the footer.
 *
 * Emptied 2026-09-08. These were "ISO 9001", "ISO 27001" and "Cyber Essentials
 * Plus" printed as bare pills on every page of the site — the badge wall the
 * handoff holds until there is a current certificate for the exact legal
 * entity, and the presentation that carries the most risk under DMCCA 2024
 * s.226 because a pill asserts everything and evidences nothing. It refills
 * from `certificationRegister` once those rows are published.
 */
export const trustBadges: readonly string[] = [];

/**
 * The Pixelette Certified cross-sell.
 *
 * Rewritten 2026-09-08 to the handoff's section 12 wording. The previous blurb
 * said Certified delivers ISO 27001, ISO/IEC 42001, Cyber Essentials, GDPR and
 * SOC 2 "by certified lead auditors" — a named certified-practice status, which
 * the ACCREDITATION-SAFE RULE forbids unless the exact legal entity and status
 * have been verified. They have not been (claims.ts `certified-cross-sell`).
 *
 * Nothing commercial is lost by the change. The route is the sell: a client who
 * needs governance around a build wants to know someone can scope it,
 * coordinate the right specialists and get them to independent assessment. That
 * is a stronger and more honest proposition than a builder implying it grades
 * its own homework, which is the impression the old line created.
 */
export const certified = {
  name: 'Pixelette Certified',
  url: 'https://pixelettecertified.com',
  blurb:
    'The group’s specialist compliance, cyber-assurance and AI-governance business. Where a technology programme needs formal governance, certification readiness, privacy or security-assurance support, Certified can help scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment where required.',
  /**
   * The one-line positioning, quoted from the handoff. It replaces "we build
   * it, Certified proves it" and every variant of it — including "We build the
   * AI. Certified certifies it." — wherever those still appear.
   */
  positioningLine:
    'We engineer it. Certified helps you govern, evidence and prepare it for assurance.',
  /**
   * The standards Certified helps clients prepare for, shown wherever Certified
   * is introduced. These are areas of support, not accreditations held by any
   * Pixelette company: independent assurance stays independent, and the copy
   * around this list must not turn readiness into a certificate.
   */
  standards: ['ISO 27001', 'ISO 42001', 'Cyber Essentials', 'GDPR', 'SOC 2'],
  /**
   * The full service list, including the two retained-officer services. The
   * design shows these only on the Assurance page, where the reader has already
   * chosen to look at certification rather than at engineering. Same rule: a
   * service Certified provides, not a status it holds.
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

/**
 * The chains and protocols the blockchain practice works with.
 *
 * A capability list, and it must stay one. The comment here used to read
 * "Twenty-four in production use, named", and the count is the claim: the
 * handoff holds the number of live chains or protocols, production counts,
 * transaction volumes and value tokenised until there is production evidence
 * and a definition of what counts as production (claims.ts
 * `blockchain-volumes-and-chain-counts`). Naming what the practice can work
 * with is fine. Counting them and calling it production is not.
 */
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
