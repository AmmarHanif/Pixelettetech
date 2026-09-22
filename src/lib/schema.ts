import { SITE_URL, clutch, company, contactEmail } from '@/content/company';
import { groupEntities } from '@/content/nav';
import { publishedDetail, publishedImage, type CaseStudy } from '@/content/work';
import { HOMEPAGE_SEO } from '@/lib/seo';

/**
 * JSON-LD builders.
 *
 * These carry most of the GEO/AEO weight on this site. An answer engine that
 * cannot parse a page still reads the graph, so the graph has to state exactly
 * what the prose states — no more.
 *
 * That last clause is the whole discipline of this file. Structured data is
 * where a corrected page quietly keeps making the old claim: a rating removed
 * from the copy survives in `aggregateRating`, a badge pulled from a page
 * survives in `hasCredential`, and an answer engine goes on repeating both
 * long after the human-readable site stopped saying them. So no ratings,
 * review counts, awards, certifications or project counts are emitted here
 * unless the claims register marks them VERIFIED and the caller passes them in.
 * The default is silence, which is the only default that cannot overclaim.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/**
 * Evidence-gated assertions, supplied by the caller from the claims register.
 *
 * Nothing in this object is emitted by default. As at the 8 September 2026
 * handoff the register holds BOTH of these: the Clutch rating and review count
 * are "HOLD — verify live profile, current score and review count", and the
 * corporate ISO / Cyber Essentials badges are "HOLD — publish only with current
 * certificate for exact legal entity, scope and validity". When the founder
 * closes either gate, the switch is one argument at the call site rather than
 * an edit to this file.
 *
 * ONE OF THOSE GATES CLOSED ON 14 SEPTEMBER 2026, AND `credentials` IS STILL
 * NOT PASSED. That is a decision, not an oversight, and it is recorded here
 * because the next reader will otherwise treat it as a loose end.
 *
 * SUPERSEDED 2026-09-17: /security-and-data and /certifications were withdrawn
 * and the verification table with them. What is published in human copy is now
 * the footer ledger — standard plus expiry date — and public/llms.txt. The
 * paragraph below describes the position as it stood on 14 September: ISO/IEC
 * 27001:2022 (AMER800409) and ISO 9001 (AMER37046). No caller passes them into
 * `hasCredential`, for the reason this file's own header gives about retracted
 * claims surviving in machine-readable markup. These certificates carry dated
 * expiries — 11 March 2027 and 1 January 2027 — so the question is not whether
 * this claim will ever need retracting but when, and `hasCredential` emits a
 * bare standard name with no number and no expiry beside it. That is the one
 * presentation the register refuses in human copy; emitting it here would be
 * that presentation in the channel that is hardest to take back.
 *
 * The published surfaces all print the certificate number, the issuing body and
 * the expiry date, and public/llms.txt instructs crawlers not to restate a
 * certificate without them. That is a deliberately better answer for machine
 * readers than `hasCredential` gives, and it is retractable in one edit.
 *
 * If this is ever revisited, the thing to change is the shape, not the switch:
 * `credentials` takes standard names only, and what would make it safe is a
 * type that cannot express a credential without its identifier and validity.
 */
export type PublishedOrgClaims = {
  /** Only from a re-verified live profile. */
  aggregateRating?: { ratingValue: number; reviewCount: number; url: string };
  /** Standard names only, and only for THIS legal entity. */
  credentials?: readonly string[];
};

export function organizationSchema(published: PublishedOrgClaims = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    // The company's machine-readable identity image. Until 8 September 2026
    // this pointed at /apple-touch-icon.png, and that file was ANOTHER
    // COMPANY'S mark — a blue rounded square with a serif "A" — so the graph
    // asserted a foreign logo as Pixelette's own identity to Google and to
    // every answer engine that reads this block. A wrong favicon is
    // embarrassing; a wrong Organization.logo is an identity claim.
    //
    // It now points at a raster of the real lockup, generated from
    // public/pixelette-logo.svg at the SVG's own viewBox framing:
    // 1024x285, opaque, on the white ground the colour artwork is drawn for.
    //
    // Raster rather than the SVG on purpose. Whether a consumer accepts an SVG
    // here could not be verified from a primary source in the session that made
    // this change (no network), and the artwork carries no intrinsic width or
    // height for a minimum-dimension check to read. A PNG is accepted under
    // every reading of the guidance, so it is the option that cannot be
    // silently ignored. It is deliberately NOT the icon file: an icon is a
    // 180px tile, and this is the lockup that carries the company name.
    logo: `${SITE_URL}/pixelette-logo-1024.png`,
    description: HOMEPAGE_SEO.description,
    foundingDate: String(company.incorporated),
    identifier: {
      '@type': 'PropertyValue',
      name: 'Company Registration Number',
      value: company.crn,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.locality,
      postalCode: company.address.postalCode,
      addressCountry: company.address.country,
    },
    /*
     * A profile link is an identity signal, not a rating assertion, so it is
     * safe while the score itself sits behind the evidence gate.
     *
     * EXTENDED 2026-09-14 from two entries to six, on an external audit: an
     * answer engine resolving "is this a real company" wants independent
     * anchors for the same entity, and it had only LinkedIn and Clutch.
     *
     * The Companies House URL was VERIFIED AT SOURCE before being published
     * rather than constructed from the number and assumed. Loaded on
     * 2026-09-14: it returns PIXELETTE TECHNOLOGIES LTD, company number
     * 11716825, status Active, registered office 77 Fulham Palace Road, London
     * W6 8JA — which matches `company.address` here — and incorporated 7
     * December 2018, which matches `company.incorporated`. A `sameAs` is an
     * assertion that this URL is this entity, so a guessed URL pattern would be
     * exactly the kind of unchecked claim this file exists to refuse.
     *
     * The three group domains are identity anchors for the RELATIONSHIP already
     * asserted in `subOrganization` below, taken from `groupEntities` rather
     * than retyped so a changed domain moves in one place.
     */
    sameAs: [
      company.linkedin,
      /* Added 2026-09-22 with the footer social links. These satisfy this
         array's own rule rather than bending it: each was READ from the footer
         of the company's own live site, not inferred from a handle pattern, and
         the LinkedIn value that read returned matched the one above exactly. */
      company.social.facebook,
      company.social.instagram,
      company.social.x,
      clutch.profileUrl,
      `https://find-and-update.company-information.service.gov.uk/company/${company.crn}`,
      ...groupEntities.filter(entity => !entity.isThisEntity).map(entity => entity.href),
    ],
    /*
     * Where the work is sold. GB rather than a list of cities.
     *
     * The justification here USED TO BE that the published client profile was
     * UK-headquartered organisations. That profile was removed sitewide on
     * 2026-09-16, so that reasoning is gone and this value now rests on a
     * plainer one: this is a UK company selling in the UK, and widening it
     * would be asserting a commercial fact nobody has established.
     *
     * FLAGGED, because it is the last geographic constraint left on the site
     * and it is machine-readable. If the firm does sell outside the UK, this is
     * the line to change - but that is a commercial statement and the founder's
     * to make, not a tidy-up.
     */
    areaServed: 'GB',
    /*
     * THE GROUP RELATIONSHIP, added 2026-09-14.
     *
     * ADR-0005 names entity conflation — a reader or an answer engine treating
     * Pixelette Technologies and Pixelette Certified as one company — as the
     * single most damaging error available on this site. The prose carries the
     * distinction, the footer publishes "Part of Pixelette Group" with all four
     * companies, and llms.txt sets it out. The GRAPH said nothing at all, which
     * is the layer that survives when a page is summarised rather than read.
     *
     * This asserts a RELATIONSHIP, not a credential, which is why it does not
     * touch the claims gate: it says these four companies are part of one group
     * and that this one is Technologies. It says nothing about what any of them
     * holds or is accredited for. `hasCredential` above remains the only place a
     * certification can enter, and it remains conditional.
     *
     * Built from `groupEntities` rather than retyped, so the footer and the
     * graph cannot drift. The current entity is excluded from its own sibling
     * list — an organisation is not its own subOrganization.
     */
    parentOrganization: {
      '@type': 'Organization',
      name: 'Pixelette Group',
    },
    subOrganization: groupEntities
      .filter(entity => !entity.isThisEntity)
      .map(entity => ({
        '@type': 'Organization',
        name: entity.name,
        url: entity.href,
        description: entity.what,
      })),
    /*
     * Contact and identity facts that were already published in prose and were
     * missing from the graph. "How do I contact them" and "is this a real
     * registered company" are two of the highest-frequency questions an answer
     * engine resolves about a firm, and both answers were sitting in company.ts
     * unexposed. The CRN was already emitted above as an identifier; the VAT
     * number has its own schema.org property and was not.
     *
     * No new claim: every value here renders somewhere on the site already.
     */
    email: contactEmail,
    vatID: company.vat,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: contactEmail,
      areaServed: 'GB',
      availableLanguage: 'English',
    },
    ...(published.aggregateRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: published.aggregateRating.ratingValue,
            reviewCount: published.aggregateRating.reviewCount,
            bestRating: 5,
            worstRating: 1,
            url: published.aggregateRating.url,
          },
        }
      : {}),
    ...(published.credentials && published.credentials.length > 0
      ? {
          hasCredential: published.credentials.map(name => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'certification',
            name,
          })),
        }
      : {}),
    knowsAbout: [
      'Software engineering',
      'Web platform development',
      'Mobile application development',
      'Blockchain engineering',
      'Asset tokenisation',
      'Smart contract development',
      'Production AI systems',
      'Retrieval-augmented generation',
      'AI evaluation and observability',
      'Data and systems integration',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: company.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-GB',
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/**
 * An ordered list of things this page links to.
 *
 * Added 2026-09-15 for /case-studies and /insights, which emitted a
 * BreadcrumbList and nothing else. A listing page whose only structured data is
 * its own position in the hierarchy tells an answer engine where the page sits
 * and nothing about what is on it — so 29 case studies and a set of articles
 * were invisible to anything that did not parse the full HTML.
 *
 * FAIL-CLOSED, like every other builder in this file: an empty list returns null
 * and `JsonLd` then renders nothing, rather than emitting an ItemList with zero
 * items. A graph asserting "here is a collection" over an empty collection is
 * the same defect class as a badge with no certificate behind it.
 *
 * Takes names and paths only. It deliberately cannot carry a description, a
 * figure or an image: this is a table of contents, and every claim about the
 * things in it already has a gate of its own elsewhere.
 */
export function itemListSchema(
  items: { name: string; path: string }[],
): Record<string, unknown> | null {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  /** Price band, where it is published. */
  price?: { low: number; high?: number; currency: string; unit?: string };
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? input.name,
    url: `${SITE_URL}${input.path}`,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    ...(input.price
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: input.price.currency,
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: input.price.low,
              ...(input.price.high ? { maxPrice: input.price.high } : {}),
              priceCurrency: input.price.currency,
              ...(input.price.unit ? { unitText: input.price.unit } : {}),
            },
          },
        }
      : {}),
  };
}

/**
 * The homepage Service graph.
 *
 * The handoff's Homepage SEO block mandates "Organisation + WebSite + Service".
 * Organisation and WebSite are emitted once in the root layout; this is the
 * third. The description is the approved meta description verbatim, and the
 * three offerings are the handoff's own core-offer wording — Build, Automate,
 * Decentralise, with Run beneath all three.
 *
 * Nothing here asserts a count, a rating or a credential, so it needs no
 * evidence gate.
 */
export function homepageServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Software engineering, AI and automation, and blockchain engineering',
    description: HOMEPAGE_SEO.description,
    serviceType: 'Custom software engineering',
    url: SITE_URL,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Build • Automate • Decentralise • Run',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Build',
            description:
              'Custom software, SaaS, web and mobile products, APIs, integrations, cloud architecture and modernisation.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Automate',
            description:
              'AI agents, workflow orchestration, model and LLM integration, RAG, predictive systems and intelligent automation.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Decentralise',
            description:
              'Tokenisation, smart contracts, dApps, wallets and blockchain infrastructure where decentralisation solves a real problem.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Run',
            description:
              'Operate, monitor, support and continually improve products and workflows after launch.',
          },
        },
      ],
    },
  };
}

/**
 * FAQPage. This is the single highest-leverage schema for answer engines:
 * a question with a self-contained answer is exactly the unit they quote.
 */
export function faqSchema(qas: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/**
 * Article schema for a case study — or `null` where the page does not earn one.
 *
 * The handoff is explicit: "Add CaseStudy/Article schema only where the
 * published page genuinely supports it." A publishable narrative is the honest
 * test of that, and `publishedDetail()` is what answers it: it returns the
 * narrative as it may be published, and `undefined` where there is none. A
 * card-only entry rendered as an Article tells an answer engine there is a
 * written piece to quote when there is not, and invites it to quote the card's
 * headline as if it were the article.
 *
 * THE PUBLICATION GATE APPLIES HERE, AND IT IS EASIER TO FORGET HERE THAN
 * ANYWHERE ELSE, because nothing in this function renders visibly. Two rules,
 * both structural rather than advisory:
 *
 *  1. `image` comes from `publishedImage(cs)`, never from `cs.image`. A product
 *     screenshot generally carries the client's name and logo inside the image,
 *     so emitting its URL for a study whose name is not cleared defeats the
 *     anonymisation — and does it in the one channel a reviewer reading the
 *     rendered page would never see. `publishedImage` returns `undefined` while
 *     `namePermission` is 'PENDING', so a gated study emits no `image` key at
 *     all. This used to read `cs.image`, and exactly one call site had noticed
 *     and defended itself; the fix is here so that every caller is covered.
 *  2. `cs.client` is never emitted, in any field, in any state. There is no
 *     `name`, `author.name`, `sourceOrganization` or `mentions` on this graph
 *     and none is to be added: `displayName()` exists for copy, and a graph
 *     does not need the client's identity to be useful. `headline`,
 *     `description` and `about` are `cs.title`, `cs.summary` and `cs.sector`,
 *     which `assertPublicationInvariants` in work.ts checks against every gated
 *     name at module load and fails the build over.
 *
 * KNOWN RESIDUAL, recorded rather than assumed away: `url` contains `cs.slug`,
 * and the slugs of the four gated studies are derived from their client names
 * (`/case-studies/2connect`). Those are the previous site's live URLs, kept so
 * that nothing needs a redirect (founder decision, 2026-09-01), and work.ts
 * documents the same gap. It is a founder call, not one this file can make: the
 * graph's `url` must be the page's real URL or the graph is wrong. Nothing else
 * in the graph carries the name.
 *
 * Returning `null` is safe at every current call site: `jsonLd()` serialises a
 * null graph to an empty string, so the script element renders empty rather
 * than emitting the literal `null`. A caller that wants to drop the element
 * entirely should guard on the return value.
 */
export function caseStudySchema(cs: CaseStudy) {
  // The gate, not the record. `publishedDetail` is both the "does this page
  // earn an Article" test and the name-permission-aware view of the narrative.
  if (!publishedDetail(cs)) return null;

  const image = publishedImage(cs);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    description: cs.summary,
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: cs.sector,
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
  };
}

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${SITE_URL}/contact`,
    about: { '@id': ORG_ID },
  };
}

/** Serialises a graph safely for injection into a <script type="application/ld+json">. */
export function jsonLd(data: unknown): string {
  // A withheld graph serialises to nothing at all. `JSON.stringify(null)`
  // returns the string "null", which would put a literal `null` inside a
  // ld+json block — invalid structured data, and worse than an empty element.
  // Builders that decline to assert something return null for exactly this
  // reason, so the empty case has to be handled here rather than at each caller.
  if (data === null || data === undefined) return '';

  // Escaping `<` prevents a nested "</script>" in any string field from
  // terminating the block early.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
