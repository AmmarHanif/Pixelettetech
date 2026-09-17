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
  /**
   * The PART OF THE UNITED KINGDOM in which the company is registered.
   *
   * Not decoration, and not a synonym for "England". S.I. 2015/17 reg. 25(2)(a)
   * requires a company to disclose on its websites "the part of the United
   * Kingdom in which it is registered", and the Companies Act 2006 offers
   * exactly four: England and Wales, Wales, Scotland, and Northern Ireland.
   *
   * There is no "England" option. England and Wales is ONE legal jurisdiction,
   * and Wales appears separately only because a company whose registered office
   * is in Wales may elect to be registered as "Wales" specifically. This
   * company's registered office is in London, so the part is England and Wales.
   *
   * It lives here because it was previously hand-typed into three files, which
   * is three chances for someone to "correct" it to England.
   */
  registeredIn: 'England and Wales',
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
  tagline: 'Software engineered to last · AI built to work · Blockchain used where it counts',
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
  /**
   * The claims-register row this certificate publishes under, added 2026-09-17.
   *
   * PER-ROW GATING, not one gate for the set. The footer ledger used to hang
   * off a single compound id covering ISO 9001, ISO 27001 AND Cyber Essentials
   * Plus, so it was all-or-nothing: the two evidenced certificates could not
   * reach the footer without the unevidenced third coming with them, which is
   * why the pills were empty. Naming the row per certificate lets each one
   * publish on its own evidence and keeps the gate fail-closed for the next.
   */
  claimId?: string;
  /** True when the certificate is held by Pixelette Certified, not by us. */
  heldByCertified?: boolean;
  /*
   * The certificate's own facts, added 2026-09-14.
   *
   * `VerificationTable`'s empty-state paragraph has named these as the
   * condition for publishing anything since 8 September 2026 — "the certificate
   * number, the issuing certification body and the expiry date, against
   * Pixelette Technologies Ltd as the named entity" — and until now the type
   * had nowhere to put them, so the promise was one the table could not have
   * kept even with the evidence in hand. It can now.
   *
   * All three of `certificateNumber`, `issuingBody` and `validTo`, or none.
   * `VerificationTable` guards them as a single unit for that reason: a row
   * published with a number and no expiry is the badge problem again in
   * smaller type, and a reader who is given two of the three facts cannot tell
   * whether the third is missing or simply not applicable.
   */
  /** As printed on the certificate. */
  certificateNumber?: string;
  /**
   * The certification body, and its accreditation exactly as the certificate
   * states it — no more. Nothing here asserts what that accreditation is
   * recognised BY: see claims.ts `iso-27001-certificate`, which records that
   * the standing of the accreditation body under any recognition arrangement
   * is unverified and is deliberately not claimed anywhere on this site.
   */
  issuingBody?: string;
  /** Issue date on the certificate. */
  issued?: string;
  /** Expiry date on the certificate. */
  validTo?: string;
  /**
   * Recertification date on the certificate, where it states one.
   *
   * Published alongside `validTo` rather than instead of it, because either
   * date alone misleads: the expiry read on its own suggests the certification
   * ends there, and the recertification date read on its own suggests a
   * three-year run with no dated checkpoint in it. No audit programme is
   * recorded in this type, because no audit programme was supplied with the
   * certificates and this project does not describe schedules it has not seen.
   */
  recertification?: string;
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
 * UPDATED 2026-09-14, and two things changed at once.
 *
 * FIRST, THE ROWS. "So every row here is unpublished" is no longer true. The
 * founder supplied certificate detail for ISO/IEC 27001:2022 (AMER800409) and
 * ISO 9001 (AMER37046), both for Pixelette Technologies Ltd, and those two rows
 * are published with the number, the issuing body and the dates printed beside
 * them. Nothing was supplied for Cyber Essentials Plus and that row is
 * unchanged; ISO 42001 is still not ours to claim and RM6200 still has no
 * listing to point at. See claims.ts `iso-27001-certificate`,
 * `iso-9001-certificate` and `cyber-essentials-plus-certificate`, and ADR-0029.
 *
 * SECOND, THE LINKS — and this one is the reason the rule above could never
 * have been kept. The two ISO rows pointed at IAF CertSearch. **The
 * International Accreditation Forum ceased operations on 1 January 2026.** The
 * founder read iaf.nu on 14 September 2026 and reports that it now describes
 * itself as a legacy archival site and names a successor body, Global
 * Accreditation Cooperation. That report could NOT be verified from this
 * session: raw network access is blocked here, so neither iaf.nu nor
 * iafcertsearch.org was loaded, and whether iafcertsearch.org itself still
 * resolves is unknown rather than established. It does not need to be known for
 * the decision. Publishing a certificate while sending the reader to a register
 * run by a body that has ceased operations undercuts the certificate, and a
 * dead verification route is worse than none because the reader concludes the
 * claim is empty rather than unlinked. No successor URL is invented here — the
 * successor body is named in this comment and NOWHERE in rendered copy, because
 * nobody in this project has loaded its register or confirmed it holds these
 * certificates. So the links are removed and the verification route is the one
 * ADR-0012 and /certifications already give: the certificate number and the
 * issuing body are printed so a reviewer can go to the body direct, and the
 * detail is sent to a reviewer who asks. The IASME link on the Cyber Essentials
 * Plus row is untouched and renders nowhere, because that row is unpublished.
 *
 * This is still the internal record, kept so the work is not lost and so the
 * missing evidence is named; `certifications` below is what the site may render.
 */
export const certificationRegister: Certification[] = [
  {
    standard: 'ISO 9001:2015',
    status: 'Certified',
    note: 'Quality management system',
    certificateNumber: 'AMER37046',
    issuingBody:
      'Americo Quality Standards Registech Pvt. Ltd, which the certificate records as accredited by the United Accreditation Foundation',
    issued: '2 January 2026',
    validTo: '1 January 2027',
    recertification: '1 January 2029',
    /* Label without a URL was the old idiom for "no route"; this is a route,
       and it is the one ADR-0012 chose. /certifications is the page that says
       what is published, what is not, and how to ask for the document. It
       promises a page that exists rather than a register search that does
       not. */
    /* verifyUrl removed 2026-09-17: /certifications was withdrawn on founder
       instruction, and a label with no URL is this file's existing idiom for
       "no public route". The detail is supplied during procurement. */
    verifyLabel: 'Detail on request',
    claimId: 'iso-9001-certificate',
    published: true,
  },
  {
    standard: 'ISO 27001:2022',
    status: 'Certified',
    note: 'Information security management system',
    /*
     * Founder decision 2026-09-01: certificate documents are held internally
     * and are NOT published on the site. This link was previously labelled
     * "Certificate" and pointed at /security-and-data, which hosts none — a
     * promise the page could not keep (audit finding C8). It then pointed at
     * the public register, labelled as what it was: a search box, not a
     * resolution. The comment that replaced it said "publishing the certificate
     * number, the issuing body and the expiry date is what would let a stranger
     * check", and that is now done, in the fields below.
     *
     * The register link is gone for the separate reason recorded above this
     * array: IAF ceased operations on 1 January 2026. The last sentence of that
     * old comment turned out to be the whole answer — the facts, not the link,
     * are what let a stranger check.
     */
    certificateNumber: 'AMER800409',
    issuingBody:
      'Americo Quality Standards Registech Pvt. Ltd, which the certificate records as accredited by the United Accreditation Foundation',
    issued: '12 March 2026',
    validTo: '11 March 2027',
    recertification: '11 March 2029',
    /* verifyUrl removed 2026-09-17, same reason as the row above. */
    verifyLabel: 'Detail on request',
    claimId: 'iso-27001-certificate',
    published: true,
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
 * What the site may render.
 *
 * This was empty from 8 September 2026 until 14 September 2026, and the comment
 * here recorded that as the intended state rather than an oversight. It now
 * holds exactly two rows, ISO 9001:2015 and ISO 27001:2022, and the design
 * requirement it records has NOT lapsed with them: a missing badge must never
 * leave a broken layout, so any component mapping over this still has to render
 * nothing when it is empty, and `VerificationTable` still carries the
 * no-certification paragraph it would print if these rows came back down. That
 * path is not dead code — it is what runs on the day a certificate expires and
 * is not renewed, which for these two is 1 January 2027 and 11 March 2027.
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
 * s.226 because a pill asserts everything and evidences nothing.
 *
 * STILL EMPTY, deliberately, 2026-09-14. The sentence that used to close this
 * comment — "It refills from `certificationRegister` once those rows are
 * published" — was wrong and is withdrawn rather than quietly deleted, because
 * the trigger it named has now happened and nothing refilled. Two rows in
 * `certificationRegister` ARE published, and these pills stay empty on purpose:
 *
 *  - A pill is the one presentation this register singles out as highest risk,
 *    and publishing a certificate does not make a bare "ISO 27001" on every
 *    page of the site any more checkable than it was. What was published is the
 *    number, the body and the dates; a pill carries none of them, and it is the
 *    footer, which appears on all twenty-odd routes with no room for any of it.
 *  - One of the three strings was "Cyber Essentials Plus", for which there is
 *    still no certificate at all.
 *
 * `SiteFooter` double-gates on this array AND on the claims-register row
 * `iso-cyber-essentials-badges`, which remains HELD, so refilling this array
 * alone would not put the pills back either. Both gates are shut, and the
 * second one is shut for the Cyber Essentials reason above.
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
   * is introduced. These are areas of support, and the copy around this list
   * must not turn readiness into a certificate: independent assurance stays
   * independent.
   *
   * This comment used to add "not accreditations held by any Pixelette
   * company", and `CertifiedHandoff` printed that clause to the reader. It
   * stopped being true on 14 September 2026, when Pixelette Technologies Ltd
   * published an ISO/IEC 27001:2022 certificate — and ISO 27001 is the first
   * entry in this array. The rule that clause existed to serve is unchanged and
   * is restated without the false half: THIS LIST IS NOT A STATEMENT ABOUT WHAT
   * ANY PIXELETTE COMPANY HOLDS, in either direction. Copy near it must not
   * imply these are held, and must not deny it either, because one of them now
   * is. What is held is published in `certificationRegister` above, with
   * certificate numbers and dates.
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
/**
 * PUBLISHED, as a CAPABILITY list and not a delivery record. Read the
 * distinction before editing either this array or the FAQ that renders it.
 *
 * The pill row that displayed these under the heading "The networks we work
 * with" was removed on 2026-09-16: that heading asserted PAST DELIVERY, and
 * checked against the `stack:` field of every published case study only three
 * are evidenced - Hyperledger Fabric, Polkadot and Solidity/EVM work.
 *
 * The FAQ KEPT the list on founder instruction the same day - "so people know
 * what we can work with" - and he was drawing a real distinction I had
 * collapsed. What a practice CAN build on is a statement about competence, on
 * which he is the authority. What it HAS delivered is a claim about engagements,
 * which needs an engagement behind each name. The FAQ wording makes that
 * explicit so a reader cannot take the list as a delivery record.
 *
 * SO: adding a chain here is a claim about capability, and it publishes
 * immediately through the FAQ and its FAQPage JSON-LD. What was actually built
 * where stays on the case studies - beyorch, chain-legal, fusio and
 * smart-contractor all name their own stack.
 *
 * DO NOT RETYPE THIS LIST ANYWHERE. It was retyped once and the copies drifted:
 * twenty-four names here against nineteen in the FAQ. The FAQ now composes its
 * sentence from this array. And do NOT publish a COUNT of them - "Twenty-four
 * chains and protocols in production use" was withdrawn from /blockchain as
 * unevidenced, and a correct number reinstates the same claim.
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

/**
 * UNPUBLISHED SINCE 2026-09-16, and deliberately kept rather than deleted.
 *
 * These twelve rendered on /blockchain under the heading "Sectors we have
 * delivered into". Checked against every case study in src/content/work.ts,
 * TEN OF THE TWELVE have no supporting engagement anywhere in this repository,
 * and the two that are arguable - financial services and healthcare - are
 * arguable as engineering work rather than as blockchain delivery, which is
 * what that heading asserted.
 *
 * WHY THE GATE DID NOT CATCH IT. src/content/claims.ts has no sector row, so
 * this was never assessed at all. The register is built around figures, and a
 * list of twelve nouns carries no digit - the same blind spot that lets a
 * market claim sit unnoticed in a heading.
 *
 * The founder raised it himself and proposed the remedy: "if that can't be
 * verified, is it better we just take this section out?" It cannot be verified
 * from anything here, so it is out.
 *
 * NOTHING IMPORTS THIS ARRAY NOW. It stays because the list may well be TRUE -
 * absence of evidence in this repository is not evidence of absence - and
 * re-typing it later from memory would be worse than keeping it here with its
 * status attached. THE ROUTE BACK IS EVIDENCE PER SECTOR, registered in
 * claims.ts, not a shorter list published on the same basis as this one.
 */
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
