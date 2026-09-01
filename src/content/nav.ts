/**
 * Navigation and footer.
 *
 * Every href here must resolve to a real page or a real anchor on one. The
 * previous site shipped broken footer links; the sitemap and the footer are
 * both generated from `routes` below so they cannot fall out of step again.
 */

export type NavItem = {
  href: string;
  label: string;
  /** Renders the outbound arrow and adds rel/target. */
  external?: boolean;
};

/**
 * Top navigation.
 *
 * Deliberately no Pixelette Certified link here. The header is for this
 * company's own practices; the group sits in the footer, where all four
 * entities are presented together rather than one of them being promoted
 * above the others.
 */
export const primaryNav: NavItem[] = [
  { href: '/engineering', label: 'Engineering' },
  { href: '/blockchain', label: 'Blockchain' },
  { href: '/ai-engineering', label: 'AI' },
  { href: '/case-studies', label: 'Work' },
  { href: '/about', label: 'About' },
];

export const primaryCta = {
  href: '/contact',
  label: 'Book a value baseline',
} as const;

export const footerColumns: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'AI engineering',
    items: [
      { href: '/ai-engineering/production-ai-systems', label: 'Production AI Systems' },
      { href: '/ai-engineering/data-and-integration', label: 'Data & Integration' },
      { href: '/ai-engineering/ai-value-baseline', label: 'AI Value Baseline' },
      {
        href: '/ai-engineering/evaluation-and-observability',
        label: 'Evaluation & observability',
      },
      { href: '/ai-engineering/services', label: 'All AI services' },
      { href: '/assurance', label: 'Assurance · who does what' },
    ],
  },
  {
    heading: 'Engineering',
    items: [
      { href: '/engineering#web-platforms', label: 'Web platforms' },
      { href: '/engineering#mobile-applications', label: 'Mobile applications' },
      { href: '/engineering#custom-software', label: 'Custom software' },
      { href: '/engineering#product-design', label: 'Product design' },
      { href: '/engineering#cloud-modernisation', label: 'Cloud & modernisation' },
      { href: '/ai-engineering/support-and-run', label: 'Support & run' },
    ],
  },
  {
    heading: 'Blockchain',
    items: [
      { href: '/blockchain#asset-tokenisation', label: 'Asset tokenisation' },
      { href: '/blockchain#smart-contracts', label: 'Smart contracts & audit' },
      { href: '/blockchain#wallets-exchanges', label: 'Wallets & exchanges' },
      { href: '/blockchain#dapps-defi', label: 'dApps & DeFi' },
      { href: '/blockchain#layers-daos', label: 'Layer 1, Layer 2 & DAOs' },
    ],
  },
  {
    heading: 'Company & trust',
    items: [
      { href: '/about', label: 'About' },
      { href: '/case-studies', label: 'Work' },
      { href: '/insights', label: 'Insights' },
      { href: '/security-and-data', label: 'Security & data' },
      { href: '/certifications', label: 'Certifications' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

/**
 * Pixelette Group.
 *
 * The four operating companies, presented together in the footer. Structure,
 * domains and the group footprint are taken from the canonical group record in
 * the Brain Main Vault (`Topics/pixelette-group.md`), not invented here.
 *
 * The order runs Technologies first — this is its website — then the rest of
 * the group. Each entity gets one line saying what it actually does, because
 * the point of the block is that a visitor who landed in the wrong place can
 * find the right one.
 */
export type GroupEntity = {
  name: string;
  what: string;
  href: string;
  /** True for the company whose site this is; rendered as the current entity. */
  isThisEntity?: boolean;
};

export const groupEntities: GroupEntity[] = [
  {
    name: 'Pixelette Technologies',
    what: 'Software engineering, blockchain systems, and the AI built into both.',
    href: 'https://pixelettetech.com',
    isThisEntity: true,
  },
  {
    name: 'Pixelette Holdings',
    what: 'The group’s accelerator and investment arm, backing founders through services-for-equity partnerships.',
    href: 'https://pixeletteholdings.com',
  },
  {
    name: 'Pixelette Marketing',
    what: 'Brand, content, SEO, social and campaign delivery for clients across the group.',
    href: 'https://pixelettemarketing.com',
  },
  {
    name: 'Pixelette Certified',
    what: 'Compliance and certification: ISO 27001, ISO/IEC 42001, Cyber Essentials, GDPR and SOC 2, by certified lead auditors.',
    href: 'https://pixelettecertified.com',
  },
];

export const groupBlurb =
  'Pixelette Technologies is one of four companies in Pixelette Group, a UK technology group operating across thirteen countries. Each company is engaged separately and none is a condition of another — which is why the firm that builds your system is never the one that certifies it.';

export const legalNav: NavItem[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/modern-slavery', label: 'Modern slavery' },
];

/**
 * Every indexable route, with its sitemap weighting. The sitemap route reads
 * this directly, so adding a page here is the only step needed to publish it.
 */
export const routes: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/engineering', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/blockchain', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/ai-engineering', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/ai-engineering/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/ai-value-baseline', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/ai-engineering/data-and-integration', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/production-ai-systems', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/support-and-run', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/evaluation-and-observability', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/method/live', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/assurance', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/industries/professional-services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/industries/insurance-financial-services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/case-studies', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/insights', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/security-and-data', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/certifications', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/modern-slavery', priority: 0.3, changeFrequency: 'yearly' },
];
