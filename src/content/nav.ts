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
 * The order is the one set by the 8 September 2026 implementation handoff:
 * Engineering | AI & Automation | Blockchain | Work | Insights | About, with
 * "Book an Engineering Conversation" as the call to action. Two things changed
 * from the previous version and both were deliberate. AI moved to second and
 * is now labelled "AI & Automation", because the handoff makes it a first-class
 * buying route rather than something hidden inside Engineering or Blockchain.
 * Blockchain stays visible but sits after it, as specialist depth rather than
 * half the proposition. Insights was already a real page and was already in the
 * footer; it is in the header now because publishing it and not linking it from
 * the top of the site was simply an omission.
 *
 * Deliberately no Pixelette Certified link here. The header is for this
 * company's own practices; the group sits in the footer, where all four
 * entities are presented together rather than one of them being promoted
 * above the others.
 */
export const primaryNav: NavItem[] = [
  { href: '/engineering', label: 'Engineering' },
  { href: '/ai-engineering', label: 'AI & Automation' },
  { href: '/blockchain', label: 'Blockchain' },
  { href: '/case-studies', label: 'Work' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export const primaryCta = {
  href: '/contact',
  label: 'Book an Engineering Conversation',
} as const;

/**
 * The three capability sections, with their sub-pages.
 *
 * One structure for both the header dropdowns and the footer, so a menu and a
 * footer column can never describe the site differently. `summary` is the
 * handoff's own BUILD / AUTOMATE / DECENTRALISE wording, quoted rather than
 * rewritten.
 *
 * The rule at the top of this file applies here with force: every href must
 * resolve. `items` therefore holds the handoff's dropdown entries that have a
 * real target today — a dedicated page where one exists, otherwise the matching
 * section anchor on the practice's own landing page — followed by that
 * section's other live pages. The handoff pages that have not been built are in
 * `PENDING_SPEC_PAGES` below, where nothing renders them.
 */
export type SectionLink = NavItem & {
  /**
   * Set where `href` points at a section anchor but the handoff asks for a
   * dedicated page. When that page ships, move this value into `href` and
   * delete the field; nothing else has to change.
   */
  plannedPath?: string;
};

export type NavSection = {
  /** The section's landing page. Always a real route. */
  href: string;
  label: string;
  /** One line on what the section covers, quoted from the handoff. */
  summary: string;
  items: SectionLink[];
};

export const engineeringSection: NavSection = {
  href: '/engineering',
  label: 'Engineering',
  summary:
    'Custom software, SaaS, web and mobile products, APIs, integrations, cloud architecture and modernisation.',
  items: [
    { href: '/engineering/custom-software-saas', label: 'Custom Software & SaaS' },
    { href: '/engineering/web-platforms', label: 'Web Platforms' },
    { href: '/engineering/mobile-applications', label: 'Mobile Applications' },
    { href: '/engineering/modernisation-integration', label: 'Modernisation & Integration' },
    { href: '/engineering/cloud-data-engineering', label: 'Cloud & Data Engineering' },
    { href: '/engineering/managed-engineering', label: 'Managed Engineering / Support' },
  ],
};

export const aiAutomationSection: NavSection = {
  href: '/ai-engineering',
  label: 'AI & Automation',
  summary:
    'AI agents, workflow orchestration, model/LLM integration, RAG, predictive systems and intelligent automation.',
  items: [
    { href: '/ai-engineering/agentic-ai-multi-agent', label: 'Agentic AI & Multi-Agent Systems' },
    { href: '/ai-engineering/workflow-automation', label: 'AI Agents & Workflow Automation' },
    { href: '/ai-engineering/llm-integration-rag', label: 'LLM Integration & RAG' },
    { href: '/ai-engineering/predictive-intelligence', label: 'Predictive Intelligence' },
    { href: '/ai-engineering/language-speech-vision', label: 'NLP / Speech / Vision' },
    {
      href: '/ai-engineering/evaluation-and-observability',
      label: 'AI Integration, Evaluation & Observability',
    },
  ],
};

export const blockchainSection: NavSection = {
  href: '/blockchain',
  label: 'Blockchain',
  summary:
    'Tokenisation, smart contracts, dApps, wallets and blockchain infrastructure where decentralisation solves a real problem.',
  items: [
    { href: '/blockchain/tokenisation', label: 'Tokenisation' },
    { href: '/blockchain/smart-contracts-dapps', label: 'Smart Contracts & dApps' },
    { href: '/blockchain/wallets-digital-assets', label: 'Wallets & Digital-Asset Products' },
    { href: '/blockchain/integration', label: 'Blockchain Integration' },
    {
      href: '/blockchain/protocol-engineering',
      label: 'Layer 1 / Layer 2 & Protocol Engineering',
    },
  ],
};

/** The three capability sections, in navigation order. */
export const navSections: NavSection[] = [
  engineeringSection,
  aiAutomationSection,
  blockchainSection,
];

/**
 * TODO — handoff pages that do not exist yet.
 *
 * NOT RENDERED, NOT LINKED, and deliberately NOT in `routes`, because
 * everything in `routes` is published in the sitemap and a sitemap entry for a
 * page that does not exist is a dead link with a wider audience.
 *
 * `suggestedPath` is a proposal for whoever builds the page, not a promise that
 * the path exists — the paths that shipped on 8 September used different slugs
 * from the ones proposed here, and the links were repointed at the real ones
 * rather than the other way round. When a page becomes real, add it to `routes`
 * and point the matching item's `href` at it.
 *
 * A page listed here may still have a live dropdown entry if the handoff's
 * capability has a real section anchor to point at in the meantime; that item
 * carries `plannedPath`, and this list is what says the page itself is owed.
 */
export type PendingPage = {
  /** Which section it belongs under. */
  section: 'Engineering' | 'AI & Automation' | 'Blockchain';
  /** The handoff's own label for the page. */
  label: string;
  suggestedPath: string;
};

/**
 * Empty as at 8 September 2026: every dropdown page the handoff asks for now
 * exists and is linked. Kept, rather than deleted, because the next handoff
 * will name pages that do not exist yet and this is where they go — the
 * alternative, historically, was linking them anyway and shipping dead links.
 */
export const PENDING_SPEC_PAGES: PendingPage[] = [];

export const footerColumns: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'AI & Automation',
    items: [
      { href: '/ai-engineering/agentic-ai-multi-agent', label: 'Agentic AI & multi-agent systems' },
      { href: '/ai-engineering/workflow-automation', label: 'AI agents & workflow automation' },
      { href: '/ai-engineering/llm-integration-rag', label: 'LLM integration & RAG' },
      { href: '/ai-engineering/predictive-intelligence', label: 'Predictive intelligence' },
      { href: '/ai-engineering/production-ai-systems', label: 'Production AI Systems' },
      { href: '/ai-engineering/data-and-integration', label: 'Data & Integration' },
      { href: '/ai-engineering/ai-value-baseline', label: 'AI Value Baseline' },
      {
        href: '/ai-engineering/evaluation-and-observability',
        label: 'Evaluation & observability',
      },
      { href: '/ai-engineering/services', label: 'All AI services' },
      { href: '/ai-engineering/support-and-run', label: 'Support & run' },
      { href: '/assurance', label: 'Assurance · who does what' },
    ],
  },
  {
    heading: 'Engineering',
    /* Repointed 2026-09-08 from section anchors to the dedicated service pages
       the handoff asks for, now that those pages exist. Product design keeps
       its anchor because it has no page of its own and the handoff does not
       ask for one. The pages the dropdowns use and the pages the footer uses
       are now the same pages. */
    items: [
      { href: '/engineering/custom-software-saas', label: 'Custom Software & SaaS' },
      { href: '/engineering/web-platforms', label: 'Web platforms' },
      { href: '/engineering/mobile-applications', label: 'Mobile applications' },
      { href: '/engineering/modernisation-integration', label: 'Modernisation & integration' },
      { href: '/engineering/cloud-data-engineering', label: 'Cloud & data engineering' },
      { href: '/engineering/managed-engineering', label: 'Managed engineering / support' },
      { href: '/engineering#product-design', label: 'Product design' },
    ],
  },
  {
    heading: 'Blockchain',
    items: [
      { href: '/blockchain/tokenisation', label: 'Tokenisation' },
      /* Not "smart contracts & audit". The claims register holds the word
         "audit" (claims.ts `smart-contract-audit`) until the precise audit
         competence and scope is evidenced; "dApps" is the handoff's own label
         for this page. */
      { href: '/blockchain/smart-contracts-dapps', label: 'Smart contracts & dApps' },
      { href: '/blockchain/wallets-digital-assets', label: 'Wallets & digital-asset products' },
      { href: '/blockchain/integration', label: 'Blockchain integration' },
      { href: '/blockchain/protocol-engineering', label: 'Layer 1, Layer 2 & protocol engineering' },
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
 * The four operating companies, presented together in the footer. Structure and
 * domains are taken from the canonical group record in the Brain Main Vault
 * (`Topics/pixelette-group.md`), not invented here.
 *
 * `role` and `what` are the four-company architecture as the 8 September 2026
 * handoff sets it out in section 13: Holdings partner and venture, Technologies
 * build and automate, Marketing grow and convert, Certified govern and assure.
 * The wording of each `what` line is the handoff's, so the group is described
 * the same way here as in the copy deck.
 *
 * The order runs Technologies first — this is its website — then the rest of
 * the group, which is a rendering decision rather than a change to the
 * architecture. Each entity gets one line saying what it actually does, because
 * the point of the block is that a visitor who landed in the wrong place can
 * find the right one.
 *
 * The Certified line is the accreditation-safe one. It does not say Certified
 * holds a standard, issues a certificate or audits anyone: under the handoff's
 * ACCREDITATION-SAFE RULE that claim cannot be published unless the exact legal
 * entity and status are verified, and they are not (claims.ts
 * `certified-cross-sell`). Readiness, governance and support toward independent
 * assessment is what can be said, so it is what is said.
 */
export type GroupEntity = {
  name: string;
  /** The group role, per the handoff section 13: PARTNER & VENTURE, etc. */
  role: string;
  what: string;
  href: string;
  /** True for the company whose site this is; rendered as the current entity. */
  isThisEntity?: boolean;
};

export const groupEntities: GroupEntity[] = [
  {
    name: 'Pixelette Technologies',
    role: 'BUILD & AUTOMATE',
    what: 'Software engineering, AI & automation, blockchain and ongoing product engineering.',
    href: 'https://pixelettetech.com',
    isThisEntity: true,
  },
  {
    name: 'Pixelette Holdings',
    role: 'PARTNER & VENTURE',
    what: 'Group-level venture partnerships, HSE/equity structures, portfolio and strategic relationships.',
    href: 'https://pixeletteholdings.com',
  },
  {
    name: 'Pixelette Marketing',
    role: 'GROW & CONVERT',
    what: 'Demand, pipeline, conversion, revenue and accountable growth systems.',
    href: 'https://pixelettemarketing.com',
  },
  {
    name: 'Pixelette Certified',
    role: 'GOVERN & ASSURE',
    what: 'Compliance readiness, cyber assurance, privacy, AI governance and ongoing compliance support.',
    href: 'https://pixelettecertified.com',
  },
];

/**
 * The group line.
 *
 * Two claims came out of this sentence on 8 September 2026 and neither is
 * coming back without evidence. "Operating across thirteen countries" is a
 * geography count, which the handoff holds outright and the 7 September legal
 * review lists among the claims it could not verify (claims.ts
 * `geography-count`). "The firm that builds your system is never the one that
 * certifies it" was a good separation-of-duties point expressed as an
 * accreditation claim: it says Certified certifies. The replacement makes the
 * same commercial point in the handoff's own approved words.
 */
export const groupBlurb =
  'Pixelette Technologies is one of four companies in Pixelette Group, a UK technology group. Each company is engaged separately and none is a condition of another: we engineer it, and Certified helps you govern, evidence and prepare it for independent assessment.';

export const legalNav: NavItem[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/modern-slavery', label: 'Modern slavery' },
  { href: '/accessibility', label: 'Accessibility' },
];

/**
 * Every indexable route, with its sitemap weighting. The sitemap route reads
 * this directly, so adding a page here is the only step needed to publish it.
 */
export const routes: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/engineering', priority: 0.9, changeFrequency: 'monthly' },
  /* The handoff's Engineering service pages, added 2026-09-08 once each page
     existed on disk. Everything in this array is published in the sitemap, so a
     path goes in only when the page is real; the two the handoff asks for that
     have not been built are in PENDING_SPEC_PAGES above, linked from nowhere. */
  { path: '/engineering/custom-software-saas', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/engineering/web-platforms', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/engineering/mobile-applications', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/engineering/modernisation-integration', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/engineering/cloud-data-engineering', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/engineering/managed-engineering', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blockchain', priority: 0.9, changeFrequency: 'monthly' },
  /* The handoff's Blockchain service pages, same rule. */
  { path: '/blockchain/tokenisation', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blockchain/smart-contracts-dapps', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blockchain/wallets-digital-assets', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blockchain/integration', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blockchain/protocol-engineering', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering', priority: 0.9, changeFrequency: 'monthly' },
  /* The handoff's AI & Automation service pages, same rule. */
  { path: '/ai-engineering/agentic-ai-multi-agent', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/workflow-automation', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/llm-integration-rag', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/predictive-intelligence', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ai-engineering/language-speech-vision', priority: 0.8, changeFrequency: 'monthly' },
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
  { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' },
];
