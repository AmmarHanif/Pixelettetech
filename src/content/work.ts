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
   * two or three others. For example "sentiment analysis errors" on the
   * case-study page, "sentiment errors" on the index card. Falls back to
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
    title: 'Sentiment errors cut by 60%, across triple the monitored sources',
    metaTitle: 'Lytics: real-time news monitoring',
    summary:
      'Real-time news monitoring with sentiment classification analysts could trust again — error rates cut by more than half, across triple the sources.',
    metrics: [
      { value: '-60%', label: 'sentiment analysis errors', shortLabel: 'sentiment errors' },
      { value: '+200%', label: 'monitored news sources', shortLabel: 'sources monitored' },
      { value: '+70%', label: 'AI scraping efficiency', shortLabel: 'scraping efficiency' },
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
        'A scraping and classification pipeline rebuilt for real-time throughput, with the sentiment models moved into the ingest path rather than bolted on afterwards, and capacity headroom designed for source growth rather than the source count on the day.',
      measured:
        'Sentiment analysis errors fell by 60% and AI-based scraping efficiency improved by 70%. Monitored news sources grew by 200% and real-time data handling capacity tripled — enough headroom to keep adding sources without trading away responsiveness.',
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
      /* Corrected against the design board's tech stack row, which shows PHP,
         Laravel, CodeIgniter, Go and C++. The previous value named React and
         Hyperledger, neither of which appears on the board, and omitted four
         that do. Go was the only overlap. */
      stack: 'PHP, Laravel, CodeIgniter, Go, C++',
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
    /* All three come from the design board's own "Our impact" section. Only the
       adoption figure had been carried across; the other two were dropped. */
    metrics: [
      { value: '0', label: 'reported security incidents in the first year', shortLabel: 'security incidents' },
      { value: '60%', label: 'of active users moved to cold storage', shortLabel: 'cold storage adoption' },
      { value: '100+', label: 'businesses onboarded in the first six months', shortLabel: 'businesses onboarded' },
    ],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/digital-asset-vault.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Breaches, theft and lost private keys make custody the hardest part of holding digital assets. Existing options forced a choice between accessibility and enterprise-grade security.',
      built:
        'Cold-storage wallets, private key certificates and multi-signature control, so that assets are protected from compromise while ownership stays verifiable and control can be shared where an organisation needs it.',
      measured:
        'Zero reported security incidents in the first year, 60% of active users moved to cold storage, and over 100 businesses onboarded in the first six months. The adoption figure is the one that tells you whether a custody product works in practice: a vault nobody migrates to protects nothing.',
      next: null,
      /* Corrected against the design board's tech stack row, which shows PHP,
         Laravel, CodeIgniter, Go and C++. The previous value named React and
         Hyperledger, neither of which appears on the board, and omitted four
         that do. Go was the only overlap. */
      stack: 'PHP, Laravel, CodeIgniter, Go, C++',
      /* Stays null. The live record's only "6 months" here is "100+ businesses
         onboarded within the first 6 months" — an adoption window, not how long
         the build took. Founder-supplied duration only. */
      duration: null,
      architectureLabel: 'Custody architecture',
    },
  },
  /*
   * The five below were reinstated by founder decision on 2026-09-01 ("new site
   * have these case studies"), which closed the redirect question outright:
   * all 16 live URLs now exist here, zero redirects needed. Content was carried
   * from the live records with the known copy-paste defects stripped, not
   * repeated: Life Optimizer's "92% among legal professionals" box (LawLedger's),
   * Beyorch's impact description (Lytics'), Smart Contractor's banner
   * (law-ledger's — it has no artwork of its own, so it ships without an image),
   * and the identical ML stack pasted across three unrelated projects (kept only
   * at its natural home, Life Optimizer; Smart Contractor uses the stack its own
   * live page publishes; Ragnar keeps only what its narrative grounds). Beyorch's
   * metrics were commented out in the source — withdrawn deliberately — so none
   * are shown rather than revived.
   */
  {
    slug: 'accessible-intelligence-assessment',
    client: 'AIA',
    kicker: 'AIA · Inclusive hiring · Production AI system',
    sector: 'HR technology',
    service: 'Production AI Systems',
    title: 'Gamified cognitive assessment for inclusive hiring',
    metaTitle: 'AIA: inclusive hiring assessment',
    summary:
      'A science-backed assessment tool for candidates with auditory, visual or dual impairments — meeting diversity hiring quotas with evidence.',
    metrics: [
      { value: '$20k', label: 'average recruitment cost saving per organisation', shortLabel: 'saved per organisation' },
      { value: '98%', label: 'successful integration with existing ATS tooling', shortLabel: 'ATS integration' },
      { value: '4.7/5', label: 'post-assessment satisfaction rating' },
    ],
    filters: ['Production systems'],
    image: '/work/aia.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Organisations struggle to meet mandated hiring quotas for people with disabilities: assessing candidates with sensory, physical or intellectual impairments fairly is hard, and the compliance requirement makes getting it wrong expensive in both directions.',
      built:
        'AIA, a gamified cognitive mapping tool for DiverSCInnova that assesses up to ten cognitive skills — focus, attention, logical reasoning among them — and produces detailed reports for inclusive hiring, role alignment and vocational guidance.',
      measured:
        'An estimated $20,000 saved per organisation in recruitment costs through better candidate matching, 98% successful integration with existing recruitment tools, and a 4.7/5 satisfaction rating on post-assessment surveys.',
      next: null,
      stack: 'React, Node.js, MongoDB, Stripe, OpenAI',
      duration: 'Seven months',
      architectureLabel: 'Assessment pipeline',
    },
  },
  {
    slug: 'beyorch',
    client: 'Beyorch',
    kicker: 'Beyorch · Digital assets · Blockchain',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: 'A decentralised investment platform built for transparency',
    metaTitle: 'Beyorch: DeFi investment platform',
    summary:
      'Smart contracts, automated financial processes and secure tokenomics for an investment ecosystem that reduces reliance on intermediaries.',
    // Beyorch's outcome figures were withdrawn in the source record (commented
    // out, deliberately). None are shown here rather than revived — a withdrawn
    // figure is not a pending one.
    metrics: [],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/beyorch.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Traditional financial systems make it hard for investors to track assets and act quickly: manual processes, intermediaries and limited transparency all raise risk exposure and erode confidence.',
      built:
        'A blockchain-powered investment platform integrating smart contracts, automated financial processes and secure tokenomics — real-time asset tracking, instant transactions, and security designed in rather than added on.',
      measured:
        'The engagement’s outcome figures were withdrawn from publication and are not repeated here.',
      next: null,
      stack: 'Polkadot, Hyperledger, Go, C++, React',
      duration: null,
      architectureLabel: 'Platform architecture',
    },
  },
  {
    slug: 'life-optimizer-ai',
    client: 'LifeOptimizer AI',
    kicker: 'LifeOptimizer AI · HealthTech · Production AI system',
    sector: 'HealthTech',
    service: 'Production AI Systems',
    title: 'Wellness plans people still follow six months later',
    metaTitle: 'LifeOptimizer: AI wellness platform',
    summary:
      'Personalised fitness, nutrition and stress management driven by behavioural analysis — measured on whether people keep using it, not whether they sign up.',
    metrics: [
      { value: '+75%', label: 'user engagement', shortLabel: 'engagement' },
      { value: '60%', label: 'of users maintained routines beyond six months', shortLabel: 'six-month retention' },
      { value: '-40%', label: 'reported anxiety levels', shortLabel: 'anxiety levels' },
    ],
    filters: ['Production systems', 'Healthcare'],
    image: '/work/life-optimizer-ai.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Generic wellness programmes fail because they do not adapt: without personalised guidance, motivation fades and progress tracking becomes a chore rather than a habit.',
      built:
        'An AI-powered wellness platform that adapts to each user’s health goals and daily routines — machine learning over health data with real-time feedback, delivering customised fitness, nutrition and mental wellbeing plans with AI-driven coaching.',
      measured:
        'Engagement up 75%, driven by interactive tracking and personalised recommendations. 60% of users maintained their wellness routines beyond six months, and stress-management features cut reported anxiety levels by 40%.',
      next: null,
      stack: 'Python, TensorFlow, PyTorch, AWS, PostgreSQL, React',
      /* Stays null. The live record's only "six months" here is "60% of users
         maintained their wellness routines for over six months" — a retention
         window, not a build duration. Founder-supplied duration only. */
      duration: null,
      architectureLabel: 'Platform architecture',
    },
  },
  {
    slug: 'ragnar-token',
    client: 'Ragnar Token',
    kicker: 'Ragnar Token · Digital assets · Blockchain',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: 'A token and platform connecting banking with crypto',
    metaTitle: 'Ragnar Token: banking meets crypto',
    summary:
      'An ERC-20 token and its platform built end to end for Ragnar Trading Limited — buying, swapping and managing tokens as familiar as online banking.',
    metrics: [
      { value: '12%', label: 'of visitors became token holders', shortLabel: 'visitor conversion' },
      { value: '<1 min', label: 'to buy or swap a token' },
    ],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/ragnar-token.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Ragnar Trading Limited needed an entire ecosystem from scratch: a token transaction system that worked efficiently, and a platform intuitive enough that people new to digital assets could adopt it without a learning curve.',
      built:
        'Ragnar Token ($RAG), an ERC-20 token on Ethereum designed for transactions and capital raising, alongside a web platform with real-time price tracking and transaction history — the familiarity of traditional banking with the flexibility of crypto.',
      measured:
        '12% of platform visitors became token holders, and buying or swapping the token takes under a minute end to end.',
      next: null,
      stack: 'Ethereum (ERC-20), web platform',
      duration: null,
      architectureLabel: 'Token and platform architecture',
    },
  },
  {
    slug: 'smart-contractor',
    client: 'SmartContractor',
    kicker: 'SmartContractor · LegalTech · Blockchain',
    sector: 'LegalTech',
    service: 'Blockchain engineering',
    title: 'Contract execution time cut by 60%',
    metaTitle: 'SmartContractor: automated contracts',
    summary:
      'Blockchain-backed contract management that automates execution and validation — with the audit trail built in rather than reconstructed afterwards.',
    metrics: [
      { value: '-60%', label: 'contract execution time', shortLabel: 'execution time' },
      { value: '95%', label: 'of manual processing errors eliminated', shortLabel: 'errors eliminated' },
      { value: '-40%', label: 'contract management costs', shortLabel: 'management costs' },
      { value: '94%', label: 'adoption among legal professionals', shortLabel: 'adoption' },
    ],
    filters: ['Blockchain', 'Legal'],
    image: '/work/smart-contractor.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Manual contract processes meant delays, human error and compliance risk: contracts needed continuous oversight, costs rose with every intermediary, and enforcement depended on records that could be disputed.',
      built:
        'A blockchain-integrated smart contract management system that automates execution with real-time tracking and tamper-proof records — contracts created, executed and monitored with complete transparency, and automated validation replacing manual checking.',
      measured:
        'Contract execution time down 60%, 95% of manual processing errors eliminated through automated validation, management costs down 40%, and a 94% adoption rate among legal professionals — with automated audit trails supporting regulatory compliance.',
      next: null,
      stack: 'Solidity, Hyperledger Fabric, Web3.js, IPFS, PostgreSQL, AWS',
      duration: null,
      architectureLabel: 'Contract lifecycle architecture',
    },
  },
  /*
   * Sandoz and NEOM are carried across from the 2026 design file's case-study
   * board ("Case Studies (moved to dev)"), which held sixteen studies against
   * the eighteen already here. Every claim below is that board's own copy.
   *
   * Hero artwork for both was exported from those Figma frames. The exports
   * are 512x287 (1.78:1) against the media slot's 16/10, so each is padded to
   * 512x320 on the transparent ground the mockups already carry — `cover`
   * would otherwise clip the laptop's edges, the same class of framing fault
   * fixed in "Stop cropping every case-study mockup".
   *
   * Neither carries a quote. The design shows a client testimonial on both,
   * but it is the same Anthony Bevan / BlockGuard block pasted onto every
   * board, and the Figma layer is still named after a third client's quote
   * about Ehya. Attributing one client's praise to another is not a gap to
   * fill, it is a claim not to make.
   */
  {
    slug: 'sandoz',
    client: 'Sandoz',
    kicker: 'Sandoz · Pharmaceuticals · Production system',
    sector: 'Pharmaceuticals',
    service: 'Production AI Systems',
    title: 'Decision-making 40% faster on one dashboard instead of silos',
    metaTitle: 'Sandoz: centralised analytics dashboard',
    summary:
      'Campaign data spread across systems that did not talk to each other, consolidated into one real-time dashboard — decisions 40% faster, revenue up 20%.',
    metrics: [
      { value: '+40%', label: 'decision-making speed', shortLabel: 'decision speed' },
      { value: '+20%', label: 'revenue in the pharmaceutical market', shortLabel: 'revenue' },
    ],
    filters: ['Data & integration', 'Production systems', 'Healthcare'],
    image: '/work/sandoz.png',
    imageLabel: 'Analytics dashboard screenshot',
    detail: {
      problem:
        'Sandoz had no integrated way to compile and analyse real-time business data. The existing platforms ran in silos, which made campaign performance hard to track and insight hard to extract, and it held back operational efficiency and scalability in the South African market.',
      built:
        'A real-time analytics dashboard built to Sandoz’s operational needs, consolidating campaign data into a single interface with visualisation tools over the top, so the reporting and the decisions came off the same source rather than off whichever system was asked.',
      measured:
        'A 40% improvement in decision-making speed and a 20% increase in revenue, both attributed to the move to real-time analytics.',
      next: null,
      stack: 'Datorama, Moqups',
      duration: 'Four months',
      architectureLabel: 'Analytics pipeline',
    },
  },
  {
    slug: 'neom',
    client: 'NEOM',
    kicker: 'NEOM · Marketing technology · Data & integration',
    sector: 'Marketing technology',
    service: 'Production AI Systems',
    title: 'Ad analytics reporting cut by 75% by removing the manual step',
    metaTitle: 'NEOM: automated ad analytics pipeline',
    summary:
      'Ad data from TikTok, Snapchat and Facebook aggregated by hand, replaced with an automated pipeline — 70% less time compiling it, 75% less reporting on it.',
    metrics: [
      { value: '-70%', label: 'time spent manually aggregating ad analytics data', shortLabel: 'manual aggregation' },
      { value: '-75%', label: 'time required for ad analytics reporting', shortLabel: 'reporting time' },
    ],
    filters: ['Data & integration', 'Production systems'],
    image: '/work/neom.png',
    imageLabel: 'Data pipeline screenshot',
    detail: {
      problem:
        'Collecting, processing and visualising ad analytics across TikTok, Snapchat and Facebook was inefficient. Compiling the data by hand consumed the time that should have gone into acting on it, delayed insight and cost reporting accuracy, and left the workflow fragmented.',
      built:
        'An automated data processing system on Azure Databricks and Azure Blobs, with Datorama over the top for visualisation. Data retrieval and compilation run without a person in the loop, so analytics are centralised and the repetitive step is gone rather than reassigned.',
      measured:
        'A 70% decrease in time spent manually aggregating ad analytics data, and a 75% reduction in the time required to report on it.',
      next: null,
      stack: 'Azure Databricks, Azure Blob Storage, Datorama',
      duration: 'Three months',
      architectureLabel: 'Data processing pipeline',
    },
  },
  /*
   * Ayni Gold and 2Connect are written from published sources only, not from
   * the engagement paperwork sitting alongside them. Ayni Gold's description
   * comes from ayni.gold; 2Connect's comes from 2connect.ai and from Pixelette
   * Holdings' own portfolio page for the venture. The invoices, SLAs, internal
   * estimates and change requests for both were deliberately left unread:
   * commercial terms are not case-study copy.
   *
   * Neither sets `detail`. The Holdings page says what was delivered for
   * 2Connect, but neither source publishes a measured before and after, and
   * this file's rule is that a figure is shown when it is measured and marked
   * pending when it is not. Ayni Gold's own headline numbers — grams extracted,
   * dollars distributed — are the client's production results, not the result
   * of the engineering, and putting them in a metric tile would claim credit
   * for a gold mine.
   *
   * Screenshots were taken from the live sites, so the artwork is current
   * rather than a design-file render.
   */
  {
    slug: 'ayni-gold',
    client: 'Ayni Gold',
    kicker: 'Ayni Gold · Commodities · Blockchain',
    sector: 'Gold and commodities',
    service: 'Blockchain engineering',
    title: 'Gold production, tokenised and made checkable',
    metaTitle: 'Ayni Gold: tokenised gold production',
    summary:
      'A participation platform tied to a licensed Peruvian gold concession, where the licence, the geology, the extraction and the on-chain trail can each be checked.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/ayni.png',
    imageLabel: 'Platform screenshot',
  },
  {
    slug: '2connect',
    client: '2Connect',
    kicker: '2Connect · Agentic AI · Production AI system',
    sector: 'Professional networking',
    service: 'Production AI Systems',
    title: 'An agent that surfaces a match only when both sides say yes',
    metaTitle: '2Connect: agentic AI matching',
    summary:
      'You brief the agent once. It retrieves candidates, scores the fit in both directions and explains why — taken from concept to live on the web and both app stores.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Production systems', 'Data & integration'],
    image: '/work/2connect.png',
    imageLabel: 'Product screenshot',
  },
  /*
   * The nine below come from the Portfolio UI Designs Figma file, which
   * holds fifteen product landing pages. Five of those products already had
   * case studies here. SuccessPath was added alongside these and then
   * withdrawn; its mockup is kept in design/mockups/ rather than deleted.
   *
   * Read what is and is not claimed. Client, sector and what the product does
   * are taken from each product's own landing page. Nothing else is: those
   * frames are product marketing, not case-study boards, so unlike Sandoz and
   * NEOM they carry no problem, no process, no duration and no measured figure.
   *
   * So none of them sets `detail`, which makes the page render its "FULL
   * WRITE-UP PENDING CLIENT SIGN-OFF" placeholder, and every metric is
   * `pending`. The gaps are deliberate and visible, and the audit lists them.
   * Filling them needs the engagement detail, not more design files.
   */
  {
    slug: 'health-chain',
    client: 'Health Chain',
    kicker: 'Health Chain · Healthcare · Blockchain',
    sector: 'Healthcare',
    service: 'Blockchain engineering',
    title: 'Healthcare records secured on a chain',
    metaTitle: 'Health Chain: health data on-chain',
    summary:
      'Patient and clinical data exchanged over blockchain infrastructure, so records move between parties without the custody of each transfer being taken on trust.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Blockchain', 'Healthcare'],
    image: '/work/health-chain.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'finchain',
    client: 'FinChain',
    kicker: 'FinChain · Financial services · Blockchain',
    sector: 'Cross-border payments',
    service: 'Blockchain engineering',
    title: 'Cross-border transactions settled on-chain',
    metaTitle: 'FinChain: cross-border settlement',
    summary:
      'Cross-border payment infrastructure built on blockchain rails, with the transfer, the settlement and the reporting of each transaction handled in one system.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/finchain.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'crypto-audit',
    client: 'CryptoAudit',
    kicker: 'CryptoAudit · Financial services · Blockchain',
    sector: 'Digital asset audit',
    service: 'Blockchain engineering',
    title: 'Auditing digital assets against a compliance standard',
    metaTitle: 'CryptoAudit: digital asset auditing',
    summary:
      'Financial auditing for digital assets, built so that what a holding is worth and where it came from can both be evidenced rather than asserted.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/crypto-audit.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'legal-mind-ai',
    client: 'Legal Mind AI',
    kicker: 'Legal Mind AI · LegalTech · Production AI system',
    sector: 'LegalTech',
    service: 'Production AI Systems',
    title: 'AI brought into legal decision-making',
    metaTitle: 'Legal Mind AI: legal decision support',
    summary:
      'Decision support for legal teams, with the model set inside the work of reaching a position rather than bolted on as a search box beside it.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Production systems', 'Legal'],
    image: '/work/legal-mind-ai.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'juris-predict',
    client: 'JurisPredict',
    kicker: 'JurisPredict · LegalTech · Production AI system',
    sector: 'LegalTech',
    service: 'Production AI Systems',
    title: 'Predicting the outcome of a legal matter',
    metaTitle: 'JurisPredict: legal outcomes',
    summary:
      'Outcome prediction for legal matters, so a case can be weighed against what comparable ones actually did rather than against instinct alone.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Production systems', 'Legal'],
    image: '/work/juris-predict.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'medi-analyze-ai',
    client: 'Medi Analyze AI',
    kicker: 'Medi Analyze AI · Healthcare · Production AI system',
    sector: 'Medical diagnostics',
    service: 'Production AI Systems',
    title: 'Diagnostic imaging read with a model in the loop',
    metaTitle: 'Medi Analyze AI: diagnostic imaging',
    summary:
      'Medical diagnostics with AI in the reading path, built for the setting where a clinician stays accountable for what the model proposes.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Production systems', 'Healthcare'],
    image: '/work/medi-analyze-ai.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'health-predictor',
    client: 'Health Predictor',
    kicker: 'Health Predictor · Healthcare · Production AI system',
    sector: 'Healthcare',
    service: 'Production AI Systems',
    title: 'Patient care planned on predicted risk',
    metaTitle: 'Health Predictor: predictive care',
    summary:
      'Predictive analytics over patient data, so care can be planned against where a patient is heading rather than only where they are today.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Production systems', 'Healthcare'],
    image: '/work/health-predictor.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'credit-smart-ai',
    client: 'Credit Smart AI',
    kicker: 'Credit Smart AI · Financial services · Production AI system',
    sector: 'Credit risk',
    service: 'Production AI Systems',
    title: 'Credit scored by model rather than by rulebook',
    metaTitle: 'Credit Smart AI: AI credit scoring',
    summary:
      'Credit scoring driven by a model, in a domain where the reason for a decision has to be defensible to the applicant and to a regulator.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Production systems', 'Financial services'],
    image: '/work/credit-smart-ai.png',
    imageLabel: 'Product screenshot',
  },

  {
    slug: 'transact-secure',
    client: 'Transact Secure',
    kicker: 'Transact Secure · Financial services · Production AI system',
    sector: 'Payments security',
    service: 'Production AI Systems',
    title: 'Transaction fraud caught while the payment is live',
    metaTitle: 'Transact Secure: AI payment security',
    summary:
      'Transaction security with AI in the authorisation path, where a decision has to be reached inside the window a payment stays open.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', pending: true }],
    filters: ['Production systems', 'Financial services'],
    image: '/work/transact-secure.png',
    imageLabel: 'Product screenshot',
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
