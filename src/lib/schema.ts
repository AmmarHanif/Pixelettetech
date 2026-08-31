import { SITE_URL, certifications, clutch, company } from '@/content/company';
import type { CaseStudy } from '@/content/work';

/**
 * JSON-LD builders.
 *
 * These carry most of the GEO/AEO weight on this site. An answer engine that
 * cannot parse a page still reads the graph, so the graph states the same
 * facts the prose does: who we are, what we sell, what we are certified for,
 * and — importantly — which certificate we do NOT hold.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    description: company.description,
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
    sameAs: [company.linkedin, clutch.profileUrl],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: clutch.ratingValue,
      reviewCount: clutch.reviewCount,
      bestRating: 5,
      worstRating: 1,
      url: clutch.profileUrl,
    },
    // Only certificates actually held by this legal entity are asserted here.
    hasCredential: certifications
      .filter(c => c.status === 'Certified' && !c.heldByCertified)
      .map(c => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: c.standard,
      })),
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

export function caseStudySchema(cs: CaseStudy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    description: cs.summary,
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: cs.sector,
    ...(cs.image ? { image: `${SITE_URL}${cs.image}` } : {}),
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
  // Escaping `<` prevents a nested "</script>" in any string field from
  // terminating the block early.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
