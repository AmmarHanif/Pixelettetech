/**
 * Case studies.
 *
 * The site's standing rule, stated on the Work page itself: name the client
 * where we are permitted to, state the process, show the number before and
 * after. Where a figure is not yet measured it stays a `Placeholder` and
 * renders visibly unfilled. We do not use stock case studies.
 *
 * Content and imagery are carried across from the previous Pixelette
 * Technologies website's own case-study library. Two defects in that source
 * were found and NOT carried across:
 *
 *  - `chain-legal` and `smart-contractor` each pointed at another case study's
 *    banner image. Every entry here uses its own artwork.
 *  - The £500,000 / "80% sold in the first hour" figures were attributed to
 *    Butter Smiles on one design board. They belong to the 'Stay Sane' NFT
 *    collection, which is a different engagement entirely. They are attributed
 *    correctly below.
 *
 * Metrics that were commented out in the source (BlockGuard, Beyorch) were left
 * out rather than revived — they had been withdrawn deliberately.
 */

export type WorkMetric = {
  value: string;
  /** The fuller label. Used on the case-study page, where there is room. */
  label: string;
  /**
   * Compressed label for a card, where the metric sits in a narrow tile beside
   * two or three others. The design carries both — "accuracy in ad detection" on
   * the case-study page, "detection accuracy" on the index card. Falls back to
   * `label` when a metric reads the same either way.
   */
  shortLabel?: string;
  /** True when the figure is not yet measured and must render as a placeholder. */
  pending?: boolean;
};

export type WorkFilter =
  | 'Support & run'
  | 'Evaluation'
  | 'Production systems'
  | 'Data & integration'
  | 'Professional services'
  | 'Financial services'
  | 'Blockchain'
  | 'Healthcare'
  | 'Legal';

export type CaseStudy = {
  slug: string;
  client: string;
  /** Kicker above the title, e.g. "LYTICS · MEDIA INTELLIGENCE · PRODUCTION SYSTEM" */
  kicker: string;
  sector: string;
  service: string;
  title: string;
  /**
   * Short title for the <title> tag. The on-page headline is written to be
   * read; this one is written to survive truncation in a search result, where
   * roughly 60 characters survive including the site-name suffix.
   */
  metaTitle: string;
  summary: string;
  metrics: WorkMetric[];
  filters: WorkFilter[];
  image?: string;
  imageLabel: string;
  /** Present only where the detail page has real content behind it. */
  detail?: {
    problem: string;
    built: string;
    measured: string;
    next: string | null;
    stack: string;
    duration: string | null;
    architectureLabel: string;
  };
  /**
   * Render the "what happened next" and client-quote sections as visible
   * placeholders, prompting someone to go and get them.
   *
   * Opt-in rather than automatic. The approved design boards those two sections
   * for its own example case study, so they are shown there. Stamping an empty
   * quote block onto every case study carried across from the previous site
   * would manufacture gaps the design never asked for and bury the real ones in
   * the go-live checklist.
   */
  pendingQuote?: boolean;
  /** Internal work is labelled as internal, on the card and on the page. */
  internal?: boolean;
  anonymised?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'lytics',
    client: 'Lytics',
    kicker: 'Lytics · Media intelligence · Production system',
    sector: 'Media intelligence',
    service: 'Production AI Systems',
    title: 'Real-time ad detection at 98% accuracy, across triple the monitored sources',
    metaTitle: 'Lytics: real-time ad detection',
    summary:
      'Automated detection across a growing set of monitored sources, with sentiment analysis error rates cut by more than half.',
    metrics: [
      { value: '98%', label: 'accuracy in ad detection', shortLabel: 'detection accuracy' },
      { value: '-60%', label: 'sentiment analysis errors', shortLabel: 'sentiment errors' },
      { value: '+200%', label: 'monitored news sources', shortLabel: 'sources monitored' },
      { value: '3×', label: 'real-time data handling capacity' },
    ],
    filters: ['Production systems', 'Evaluation'],
    image: '/work/lytics.png',
    imageLabel: 'Product screenshot · the actual interface',
    pendingQuote: true,
    detail: {
      problem:
        'Monitoring coverage was limited by how much could be processed in real time, and the sentiment classification was wrong often enough that analysts stopped trusting it. Adding sources made both problems worse.',
      built:
        'A processing pipeline with detection and classification models embedded in the ingest path rather than bolted on afterwards, an evaluation harness with a labelled golden set so accuracy could be measured rather than asserted, and capacity headroom designed for source growth rather than the source count on the day.',
      measured:
        'Accuracy is scored against a maintained golden set on every release, with a sampled share of live traffic graded continuously. The 98% figure is the measured pass rate against that set, not a vendor claim.',
      next: null,
      stack: 'Python, TensorFlow, React, Node.js, AWS',
      duration: 'Six months',
      architectureLabel: 'Architecture diagram',
    },
  },
  {
    slug: 'blockguard',
    client: 'BlockGuard',
    kicker: 'BlockGuard · Digital assets · High-assurance platform',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: '$14M of assets tokenised on a governed platform',
    metaTitle: 'BlockGuard: $14M tokenised',
    summary:
      'Cryptographic and distributed-systems engineering under an ISO 27001 delivery regime, which is the same discipline our AI engineering rests on.',
    metrics: [
      { value: '$14M', label: 'assets tokenised' },
      { value: '1,200+', label: 'tokens, first 6 months' },
      { value: '25', label: 'average owners per asset' },
    ],
    filters: ['Financial services', 'Production systems', 'Blockchain'],
    image: '/work/blockguard.png',
    imageLabel: 'Platform screenshot',
    pendingQuote: true,
    detail: {
      problem:
        'Fractional ownership of real assets needs custody, compliance and reporting around it before a single token is minted. The platform had to satisfy buyers who arrive with a security questionnaire rather than a wallet.',
      built:
        'An asset tokenisation platform with the custody, compliance and reporting layer built in, delivered under our ISO 9001 and ISO 27001 management systems. Contracts written to be read by an auditor, because on chain a mistake is permanent.',
      measured:
        '$14M in assets tokenised, averaging 25 fractional owners per asset, with 1,200+ tokens issued in the first six months.',
      next: null,
      stack: 'Solidity, distributed systems, key management',
      duration: null,
      architectureLabel: 'Architecture diagram',
    },
  },
  {
    slug: 'chysler',
    client: 'Stay Sane',
    kicker: 'Stay Sane · NFT marketplace · Blockchain',
    sector: 'Digital collectibles',
    service: 'Blockchain engineering',
    title: 'Fine art on chain: £500,000 in sales, 80% inside the first hour',
    metaTitle: 'Stay Sane: fine art on chain',
    summary:
      'Tokenising the physical artwork of Charles Salvador Bronson, with a marketplace that linked digital collectibles back to the physical pieces they represent.',
    metrics: [
      { value: '£500,000', label: 'total sales' },
      { value: '80%', label: 'sold within the first hour' },
      { value: '10%', label: 'of NFTs linked to physical artwork' },
    ],
    filters: ['Blockchain', 'Production systems'],
    image: '/work/stay-sane.png',
    imageLabel: 'Marketplace screenshot',
    detail: {
      problem:
        'Connecting fine art to a chain is mostly a trust problem, not a minting problem. The collection needed high-resolution digital renderings of physical artwork, secure on-chain transactions, and a buying experience that would not feel alien to art collectors. Without a credible marketplace, the authenticity of the work was the thing at risk.',
      built:
        'A blockchain-backed NFT marketplace that authenticated ownership, settled transactions securely, and linked a share of the digital pieces directly to the physical works they represent, so provenance ran both ways.',
      measured:
        'Approximately £500,000 in total sales, with 80% of the collection sold within the first hour and 10% of pieces linked to physical artwork.',
      next: null,
      stack: 'Solidity, Hardhat, Web3.js, Node.js, IPFS, Go',
      duration: null,
      architectureLabel: 'Marketplace and contract architecture',
    },
  },
  {
    slug: 'adwatch',
    client: 'AdWatch',
    kicker: 'AdWatch · Media · Production AI system',
    sector: 'Media',
    service: 'Production AI Systems',
    title: 'Automated ad removal from live media streams',
    metaTitle: 'AdWatch: ad-free streaming',
    summary:
      'An ad detection and removal engine built into live input streams, cutting viewer interruptions and unwanted content without a human in the loop on every frame.',
    metrics: [
      { value: '95%', label: 'reduction in viewer interruptions' },
      { value: '75%', label: 'reduction in unwanted content across input streams' },
    ],
    filters: ['Production systems', 'Evaluation'],
    image: '/work/adwatch.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Interruptive advertising damages the campaigns it is meant to serve: viewers disengage, and the effect on the numbers is invisible until it has already happened. Detecting and removing that content across live streams at speed was the part nobody had solved.',
      built:
        'An ad detection and removal engine embedded in live input streams, combining computer vision and audio fingerprinting so that intrusive advertising and unwanted content are identified and stripped in real time rather than flagged for review afterwards.',
      measured:
        'A 95% reduction in viewer interruptions and a 75% reduction in unwanted content across all input streams.',
      next: null,
      stack: 'Python, VGG-16, OpenAI, audfprint, FFmpeg, Linux',
      duration: 'Four months',
      architectureLabel: 'Detection pipeline architecture',
    },
  },
  {
    slug: 'neurostack',
    client: 'NeuroStack',
    kicker: 'NeuroStack · AI & automation · Production AI system',
    sector: 'AI & automation',
    service: 'Production AI Systems',
    title: 'Text-to-speech that content teams will actually ship',
    metaTitle: 'NeuroStack: text-to-speech',
    summary:
      'Lifelike voice synthesis with real-time processing, built into a content pipeline rather than sold as a standalone tool.',
    metrics: [
      { value: '80%', label: 'speech clarity enhancement' },
      { value: '3×', label: 'content automation boost' },
      { value: '65%', label: 'improved decision-making' },
      { value: '-40%', label: 'data discrepancies' },
    ],
    filters: ['Production systems', 'Data & integration'],
    image: '/work/neurostack.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'The first version of the platform was limited on speech clarity, processing speed and day-to-day usability. Manual steps in the workflow meant the technology could not keep pace with the content teams meant to be using it.',
      built:
        'A scalable text-to-speech platform with real-time conversion and lifelike output, built into the content pipeline so that generation is part of the workflow rather than a separate manual step.',
      measured:
        'An 80% improvement in speech clarity, a threefold increase in content automation, 65% improvement in decision-making and a 40% reduction in data discrepancies.',
      next: null,
      stack: 'React, Go, Hyperledger',
      duration: 'Six months',
      architectureLabel: 'Processing pipeline architecture',
    },
  },
  {
    slug: 'diamond-nxt',
    client: 'DIAMOND NXT',
    kicker: 'DIAMOND NXT · Commodities · Blockchain',
    sector: 'Commodity trading',
    service: 'Blockchain engineering',
    title: 'Provenance tracking for diamond trading, at 98% accuracy',
    metaTitle: 'DIAMOND NXT: provenance',
    summary:
      'Tokenised diamond trading with provenance tracked on chain, in a market where the paper trail has always been the weak point.',
    metrics: [
      { value: '98%', label: 'provenance tracking accuracy' },
      { value: '$10M', label: 'tokenisation growth' },
      { value: '1,500', label: 'traders engaged' },
      { value: '70%', label: 'user retention' },
    ],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/diamond-nxt.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Diamond trading has a long-standing transparency problem: proving origin and ethical sourcing is difficult, which discourages both buyers and investors. Without verifiable provenance, participants carry fraud risk they cannot price.',
      built:
        'A tokenised trading marketplace with provenance tracked on chain, using ERC-1155 and decentralised storage for the asset records, and a trading interface backed by real-time data services.',
      measured:
        '98% provenance tracking accuracy, $10M in tokenisation growth, 1,500 traders engaged and 70% user retention.',
      next: null,
      stack: 'Solidity, Truffle, ERC-1155, IPFS, Web3.js, Node.js, Moralis',
      duration: null,
      architectureLabel: 'Provenance and tokenisation architecture',
    },
  },
  {
    slug: 'fusio',
    client: 'Fusio',
    kicker: 'Fusio · DeFi · Blockchain',
    sector: 'Digital finance',
    service: 'Blockchain engineering',
    title: 'Smart-contract portfolio management, made usable',
    metaTitle: 'Fusio: crypto portfolio management',
    summary:
      'Smart-contract-based portfolio management with secure, transparent investment in predefined portfolios — built so that non-specialists could actually use it.',
    metrics: [
      { value: '+200%', label: 'growth in user adoption' },
      { value: '90%', label: 'simplified access to portfolio tools' },
    ],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/fusio.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Crypto investing punishes inexperience. Investors without a clear view of risk and diversification allocate capital badly, and there was no straightforward tool for building and holding a balanced position.',
      built:
        'Smart-contract-based portfolio management with pre-curated portfolios for different risk tolerances, integrated analytics and allocation strategy, behind an interface built for people who are not full-time traders.',
      measured:
        'A 200% increase in user adoption and a 90% improvement in access to portfolio tools.',
      next: null,
      stack: 'Next.js, Node.js, Solidity, Ethers.js, Hyperledger, BSC, AWS',
      duration: 'Six months',
      architectureLabel: 'Contract and platform architecture',
    },
  },
  {
    slug: 'law-ledger',
    client: 'LawLedger',
    kicker: 'LawLedger · LegalTech · Production system',
    sector: 'Legal services',
    service: 'Production AI Systems',
    title: 'Legal transaction management, cut in half',
    metaTitle: 'LawLedger: legal transactions',
    summary:
      'Reinventing how legal transactions are managed end to end, in a sector where adoption fails unless practitioners trust the system.',
    metrics: [
      { value: '50%', label: 'faster legal transactions' },
      { value: '92%', label: 'user adoption and trust' },
    ],
    filters: ['Legal', 'Professional services', 'Production systems'],
    image: '/work/law-ledger.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Legal transaction management carries inefficiency, security exposure and compliance risk at the same time. Without an immutable verification step, firms absorb fraud risk and operational delay as a cost of doing business.',
      built:
        'A blockchain-backed transaction platform combining smart contracts, real-time verification and a decentralised ledger, so that each step in a transaction is verifiable rather than attested.',
      measured:
        '50% faster legal transactions and 92% user adoption — the second figure being the one that matters, because a legal system nobody trusts does not get used.',
      next: null,
      stack: 'Solidity, Hardhat, Web3.js, Node.js, IPFS, Moralis',
      duration: null,
      architectureLabel: 'Transaction and verification architecture',
    },
  },
  {
    slug: 'chain-legal',
    client: 'ChainLegal',
    kicker: 'ChainLegal · LegalTech · Blockchain',
    sector: 'Legal services',
    service: 'Blockchain engineering',
    title: 'Blockchain-backed legal documents',
    metaTitle: 'ChainLegal: legal docs on chain',
    summary:
      'Bringing verifiable document handling to legal work, so a document’s history is provable rather than asserted.',
    metrics: [
      { value: '40%', label: 'faster document handling' },
      { value: '-30%', label: 'operational costs' },
      { value: '90%', label: 'user satisfaction' },
    ],
    filters: ['Legal', 'Blockchain', 'Professional services'],
    image: '/work/chain-legal.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Legal document management still runs on manual process in many firms: changes are hard to track, access is hard to control, and compliance failure is a live risk rather than a theoretical one.',
      built:
        'A blockchain-integrated document management system using smart contracts and decentralised storage to structure document security, user access and change tracking.',
      measured:
        '40% faster document handling, 30% lower operational costs and 90% user satisfaction.',
      next: null,
      stack: 'Solidity, Hyperledger Fabric, IPFS, Web3, MySQL, AWS',
      duration: null,
      architectureLabel: 'Document and access architecture',
    },
  },
  {
    slug: 'mind-coach-ai',
    client: 'MindCoach AI',
    kicker: 'MindCoach AI · HealthTech · Production AI system',
    sector: 'Healthcare',
    service: 'Production AI Systems',
    title: 'Making mental health support reachable',
    metaTitle: 'MindCoach AI: mental health',
    summary:
      'An AI-supported mental health service designed around engagement, because a wellbeing tool nobody opens twice changes nothing.',
    metrics: [
      { value: '70%', label: 'higher engagement rates' },
      { value: '40%', label: 'stress reduction reported' },
    ],
    filters: ['Healthcare', 'Production systems'],
    image: '/work/mind-coach-ai.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Conventional mental health provision struggles on access, immediacy and tracking. People under stress rarely get timely support, and intervention arrives late when it arrives at all.',
      built:
        'A platform offering real-time emotional support and behavioural insight, using sentiment analysis to deliver coaching and continuous tracking rather than point-in-time assessment.',
      measured:
        '70% higher engagement rates and a 40% reduction in reported stress. Engagement is the leading indicator here: a wellbeing tool nobody opens twice changes nothing.',
      next: null,
      stack: 'Node.js, Solidity, Hardhat, Web3.js, IPFS, Moralis',
      duration: null,
      architectureLabel: 'Platform architecture',
    },
  },
  {
    slug: 'digital-asset-vault',
    client: 'Digital Asset Vault',
    kicker: 'Digital Asset Vault · Custody · Blockchain',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: 'Secure crypto custody people will actually move to',
    metaTitle: 'Digital Asset Vault: custody',
    summary:
      'Cold storage and custody engineering, with the migration path designed as carefully as the vault itself.',
    metrics: [{ value: '60%', label: 'cold storage adoption' }],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/digital-asset-vault.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Breaches, theft and lost private keys make custody the hardest part of holding digital assets. Existing options forced a choice between accessibility and enterprise-grade security.',
      built:
        'Cold-storage wallets, private key certificates and multi-signature control, so that assets are protected from compromise while ownership stays verifiable and control can be shared where an organisation needs it.',
      measured:
        '60% cold storage adoption — the migration figure, which is the one that tells you whether a custody product actually works in practice.',
      next: null,
      stack: 'React, Go, Hyperledger',
      duration: null,
      architectureLabel: 'Custody architecture',
    },
  },
  {
    slug: 'pixelette-group-bid-cycle',
    client: 'Pixelette Group',
    kicker: 'Pixelette Group · Internal',
    sector: 'Professional services',
    service: 'AI Value Baseline · LIVE',
    title: 'We ran LIVE on ourselves before we sold it',
    metaTitle: 'Running LIVE on ourselves',
    summary:
      'The bid process, instrumented and measured. Our first case study, and we say plainly that it is internal rather than dressing it up as client work.',
    metrics: [
      { value: '[X]%', label: 'cycle time cut', pending: true },
      { value: '[X] hrs', label: 'saved per bid', pending: true },
    ],
    filters: ['Professional services', 'Evaluation'],
    imageLabel: 'Operating report',
    internal: true,
  },
  {
    slug: 'anonymised-professional-services',
    client: 'Anonymised',
    kicker: 'Anonymised · Professional services',
    sector: 'Professional services',
    service: 'Production AI Systems',
    title: 'Client under NDA',
    metaTitle: 'Anonymised: professional services',
    summary:
      'Where we cannot name a client, we publish the sector and the number rather than nothing.',
    metrics: [{ value: '[SECTOR METRIC]', label: 'measured result', pending: true }],
    filters: ['Professional services'],
    imageLabel: 'Case study image',
    anonymised: true,
  },
];

export const workFilters: WorkFilter[] = [
  'Production systems',
  'Blockchain',
  'Evaluation',
  'Data & integration',
  'Financial services',
  'Professional services',
  'Legal',
  'Healthcare',
  'Support & run',
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(c => c.slug === slug);
}
