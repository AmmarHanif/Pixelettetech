/**
 * ============================================================================
 *  THE ANALYTICS EVENT REGISTRY. ONE FILE. EVERY EVENT NAME LIVES HERE.
 * ============================================================================
 *
 * Implements checklist item 21 of `design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt`
 * ("Add analytics events for hero CTAs, buyer-trigger routes, case studies,
 * brief upload and booked conversations") and supplies the route dimension
 * item 22 needs ("measure conversion by route").
 *
 * WHY A REGISTRY RATHER THAN STRING LITERALS AT THE CALL SITE
 *
 * An analytics event name is a permanent identifier. Rename it after launch
 * and the history splits in two: the old name stops counting, the new one
 * starts from zero, and no dashboard joins them. A mistyped one is worse — it
 * produces an event nobody is counting and no error anywhere. So every name is
 * declared once, here, and every call site gets it from `analyticsAttrs()`,
 * which will not compile against a name that is not in this file.
 *
 * The vocabulary is the handoff's own. `BUYER_ROUTES` is section 03's six
 * routes; `VALUE_MODEL_BY_ROUTE` maps each one onto section 04's four words
 * (BUILD / AUTOMATE / DECENTRALISE / RUN), which is the exact breakdown item 22
 * asks for. Nothing here is a name invented for this file.
 *
 * This module is server-safe. It imports nothing, touches no browser API and
 * holds no dependency on `@vercel/analytics`, so a Server Component can import
 * it freely. Only `src/components/AnalyticsEvents.tsx` — the single client
 * component in this feature — reads the provider.
 */

/* ------------------------------------------------------------------------ *
 * THE MASTER SWITCH
 * ------------------------------------------------------------------------ */

/**
 * Whether any analytics runs at all. Nothing is loaded, requested or sent
 * while this is `false`: `src/app/layout.tsx` does not mount the Vercel
 * component, the delegated click listener is never attached, and the contact
 * form does not report its own success.
 *
 * IT IS DELIBERATELY A LITERAL, NOT DERIVED FROM ANYTHING.
 *
 * The obvious shortcut is `!SITE_IN_DEVELOPMENT` (see `src/content/launch.ts`),
 * so that measurement begins the moment the site is indexable. That is exactly
 * what must not happen here, because the two are off for two INDEPENDENT
 * reasons and only one of them is the launch flag:
 *
 *  1. MEASUREMENT QUALITY. The site is `noindex` and robots-disallowed today,
 *     so no buyer can reach it from a search engine. Every visit is the
 *     founder, an agent working on the build, or someone holding a preview
 *     link. Recording those as conversions seeds item 22's baseline with
 *     internal traffic, and Vercel Web Analytics has no retroactive filter to
 *     take them out again. A polluted denominator is worse than no denominator:
 *     the first post-launch comparison is then against a number nobody can
 *     trust, and the one thing item 22 exists to do — decide which buyer
 *     problems to promote — is decided on noise.
 *
 *  2. THE PRIVACY PAGE, WHICH IS THE BLOCKING ONE. `src/app/privacy/page.tsx`
 *     currently states, as published fact, that the site "loads no third-party
 *     fonts, trackers or advertising scripts", that it "sets no cookies … and
 *     loads no third-party script that could", and that "there is no consent
 *     banner because there is nothing to consent to". It then commits: "If that
 *     ever changes we will say so here first … We would do both on this page
 *     before setting anything." Those are UK GDPR Article 13 disclosures and a
 *     PECR/DUAA 2025 Schedule A1 statement, not marketing copy. Arming
 *     measurement before that page is updated publishes a false privacy
 *     statement. The engineering brief for this work was explicit that the
 *     privacy page is not to be edited to accommodate analytics, so this stays
 *     `false` until the founder decides. See `ANALYTICS.md` for the exact
 *     sentences and what has to be true before this flips.
 *
 * If reason 2 is resolved and the founder wants measurement to start with
 * launch rather than as a separate act, set this to `true` at that point. It is
 * one edit in one file, and every attribute in the markup is already in place.
 */
export const ANALYTICS_ENABLED: boolean = false;

/* ------------------------------------------------------------------------ *
 * EVENT NAMES
 * ------------------------------------------------------------------------ */

/**
 * Every event this site can emit.
 *
 * Named for what the visitor did, in the handoff's vocabulary, so the name is
 * still readable in a dashboard a year from now without this file open beside
 * it. Snake case because that is what reads cleanly in Vercel's event list.
 */
export const ANALYTICS_EVENTS = {
  /** Section 01 primary CTA: "Build a Product". */
  HERO_PRIMARY_CTA: 'hero_primary_cta',
  /** Section 01 secondary CTA: "Automate a Workflow". */
  HERO_SECONDARY_CTA: 'hero_secondary_cta',
  /** Section 01 specialist route: "Explore Blockchain Engineering". */
  HERO_SPECIALIST_ROUTE: 'hero_specialist_route',
  /** Section 01 low-friction route: "Tell us what needs to change." */
  HERO_LOW_FRICTION_ROUTE: 'hero_low_friction_route',
  /** Section 01 DESIGN NOTE route chips: Build Software / AI & Automation / Blockchain. */
  HERO_ROUTE_CHIP: 'hero_route_chip',

  /** Section 03 "Route" column: the visitor went to the capability page. */
  BUYER_TRIGGER_ROUTE: 'buyer_trigger_route',
  /** Section 03 "CTA" column: the visitor went to a conversation. The conversion step. */
  BUYER_TRIGGER_CTA: 'buyer_trigger_cta',

  /** A case study was opened. `detail` carries the slug. */
  CASE_STUDY_OPENED: 'case_study_opened',

  /**
   * The section 14 secondary CTA, "Send Us a Brief", was pressed.
   *
   * READ THIS BEFORE USING THE NUMBER. It counts a BUTTON PRESS AND NOTHING
   * ELSE. There is no upload control anywhere on this site and no file ever
   * reaches us: the contact form forwards a small JSON message and cannot carry
   * an attachment, and whether to build an upload at all is an open founder
   * decision (`../UPLOAD-FEASIBILITY-2026-09-11.md`). The name ends in
   * `_intent` for that reason. If an upload is ever built it gets its own,
   * separate event — this one must never be repurposed to mean a delivered
   * brief, because the history before that date would then be counting
   * something else entirely.
   */
  SEND_US_A_BRIEF_INTENT: 'send_us_a_brief_intent',

  /**
   * A booked-conversation CTA was pressed. `surface` says which, and it is the
   * only thing that can tell them apart: the header, the hero and every
   * page-level CTA all read "Book a conversation", while the homepage close
   * alone reads "Book an Engineering Conversation". That pair is a deliberate
   * ladder, so do not collapse the surfaces when reading this event.
   */
  BOOK_CONVERSATION_CTA: 'book_conversation_cta',

  /** The contact form was accepted by the server. The completed conversion. */
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',

  /**
   * Self-monitoring. Emitted when the delegated listener finds a
   * `data-pt-event` attribute whose value is not in this registry.
   *
   * A mistyped attribute would otherwise fail silently — a CTA that looks
   * instrumented, tracks nothing, and tells nobody. Reporting it as a real
   * event makes the mistake visible in the same dashboard the founder already
   * reads. If this ever appears there, the offending value is in `detail`.
   */
  UNKNOWN_EVENT: 'analytics_unknown_event',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Every declared name, for the runtime guard and the render tests. */
export const ANALYTICS_EVENT_NAMES: readonly AnalyticsEventName[] =
  Object.values(ANALYTICS_EVENTS);

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return (ANALYTICS_EVENT_NAMES as readonly string[]).includes(value);
}

/* ------------------------------------------------------------------------ *
 * THE ROUTE DIMENSION — handoff section 03
 * ------------------------------------------------------------------------ */

/**
 * The six buyer routes of section 03, "What are you trying to change?".
 *
 * These are the values checklist item 22 is measured on. They are slugs rather
 * than the display labels because a display label can be re-worded — "AI &
 * Automation" could become "AI and Automation" tomorrow — and a re-worded
 * dimension value orphans its own history exactly as a renamed event does.
 */
export const BUYER_ROUTES = {
  /** "We need a new platform, product or app" → Build Software. */
  BUILD_SOFTWARE: 'build-software',
  /** "A manual process needs automating" → AI & Automation. */
  AI_AUTOMATION: 'ai-automation',
  /** "We want AI inside an existing product" → AI Engineering. */
  AI_ENGINEERING: 'ai-engineering',
  /** "Our existing system needs modernising" → Modernise & Integrate. */
  MODERNISE_INTEGRATE: 'modernise-integrate',
  /** "We need tokenisation, smart contracts or a dApp" → Blockchain. */
  BLOCKCHAIN: 'blockchain',
  /** "We need someone to keep improving what exists" → Run & Improve. */
  RUN_IMPROVE: 'run-improve',
} as const;

export type BuyerRoute = (typeof BUYER_ROUTES)[keyof typeof BUYER_ROUTES];

export const BUYER_ROUTE_VALUES: readonly BuyerRoute[] = Object.values(BUYER_ROUTES);

export function isBuyerRoute(value: string): value is BuyerRoute {
  return (BUYER_ROUTE_VALUES as readonly string[]).includes(value);
}

/**
 * Section 04's four words, which is the breakdown item 22 names literally:
 * "measure conversion by route (Build / Automate / Blockchain / Run)".
 */
export const VALUE_MODEL = {
  BUILD: 'build',
  AUTOMATE: 'automate',
  DECENTRALISE: 'decentralise',
  RUN: 'run',
} as const;

export type ValueModel = (typeof VALUE_MODEL)[keyof typeof VALUE_MODEL];

/**
 * Section 03's six routes folded onto section 04's four.
 *
 * Taken from the handoff's own definitions, not assigned by preference.
 * Modernise & Integrate sits under BUILD because section 04's BUILD block
 * names its scope as "Custom software, SaaS, web and mobile products, APIs,
 * integrations, cloud architecture and modernisation" — modernisation is
 * inside BUILD by the document's own wording. AI Engineering sits under
 * AUTOMATE for the same reason: AUTOMATE is "AI agents, workflow
 * orchestration, model/LLM integration, RAG, predictive systems".
 *
 * Derived by the listener rather than written into the markup, so the two
 * dimensions can never disagree with each other: a page states the route, and
 * only this table decides the model.
 */
export const VALUE_MODEL_BY_ROUTE: Readonly<Record<BuyerRoute, ValueModel>> = {
  [BUYER_ROUTES.BUILD_SOFTWARE]: VALUE_MODEL.BUILD,
  [BUYER_ROUTES.AI_AUTOMATION]: VALUE_MODEL.AUTOMATE,
  [BUYER_ROUTES.AI_ENGINEERING]: VALUE_MODEL.AUTOMATE,
  [BUYER_ROUTES.MODERNISE_INTEGRATE]: VALUE_MODEL.BUILD,
  [BUYER_ROUTES.BLOCKCHAIN]: VALUE_MODEL.DECENTRALISE,
  [BUYER_ROUTES.RUN_IMPROVE]: VALUE_MODEL.RUN,
};

/* ------------------------------------------------------------------------ *
 * THE SURFACE DIMENSION — where on the site the click happened
 * ------------------------------------------------------------------------ */

/**
 * Which part of the site a click came from.
 *
 * Several events fire from more than one place — a booked-conversation CTA
 * exists in the header, in the homepage close, in the shared closing block and
 * on a case study — and "which of those is actually converting" is a question
 * the founder will ask on day one. Typed, for the same reason the event names
 * are: a free-text surface is a dimension that quietly fills up with variants
 * of the same word.
 */
export const ANALYTICS_SURFACES = {
  SITE_HEADER: 'site-header',
  SITE_HEADER_MOBILE: 'site-header-mobile',
  HOMEPAGE_HERO: 'homepage-hero',
  HOMEPAGE_BUYER_TRIGGERS: 'homepage-buyer-triggers',
  HOMEPAGE_SELECTED_WORK: 'homepage-selected-work',
  HOMEPAGE_CLOSE: 'homepage-close',
  WORK_INDEX_HERO: 'work-index-hero',
  WORK_INDEX: 'work-index',
  CASE_STUDY_ASIDE: 'case-study-aside',
  CASE_STUDY_RELATED: 'case-study-related',
  CLOSING_CTA: 'closing-cta',
  CONTACT_FORM: 'contact-form',
} as const;

export type AnalyticsSurface = (typeof ANALYTICS_SURFACES)[keyof typeof ANALYTICS_SURFACES];

export const ANALYTICS_SURFACE_VALUES: readonly AnalyticsSurface[] =
  Object.values(ANALYTICS_SURFACES);

export function isAnalyticsSurface(value: string): value is AnalyticsSurface {
  return (ANALYTICS_SURFACE_VALUES as readonly string[]).includes(value);
}

/* ------------------------------------------------------------------------ *
 * THE ATTRIBUTE CONTRACT
 * ------------------------------------------------------------------------ */

/**
 * The four attributes a server-rendered element carries.
 *
 * Exported as constants because the listener and the render tests read them
 * back out of the DOM, and a second hand-typed copy of `'data-pt-event'`
 * anywhere else is a drift waiting to happen. `pt` is Pixelette Technologies.
 */
export const EVENT_ATTRIBUTE = 'data-pt-event';
export const ROUTE_ATTRIBUTE = 'data-pt-route';
export const SURFACE_ATTRIBUTE = 'data-pt-surface';
export const DETAIL_ATTRIBUTE = 'data-pt-detail';

/** Longest `detail` value that will be sent. Anything longer is truncated. */
export const MAX_DETAIL_LENGTH = 64;

export type AnalyticsAttributes = {
  readonly 'data-pt-event': AnalyticsEventName;
  readonly 'data-pt-route'?: BuyerRoute;
  readonly 'data-pt-surface'?: AnalyticsSurface;
  readonly 'data-pt-detail'?: string;
};

/**
 * Build the attribute set for one tracked element.
 *
 * THIS IS THE ONLY SUPPORTED WAY TO INSTRUMENT SOMETHING. Spread the result
 * onto a link or a button:
 *
 *     <Link href="/contact" {...analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, {
 *       surface: ANALYTICS_SURFACES.SITE_HEADER,
 *     })}>
 *
 * The element stays server-rendered — these are plain HTML attributes, not
 * handlers — so instrumenting a page costs no client JavaScript and does not
 * turn it into a Client Component. The single listener in
 * `src/components/AnalyticsEvents.tsx` reads them back at click time.
 *
 * Every argument is a union of literals from this file, so a mistyped event
 * name, route or surface is a compile error rather than a silent gap in the
 * data. `detail` is the one free-text field, because it carries values that
 * live elsewhere (a case-study slug, from `src/content/work.ts`).
 */
export function analyticsAttrs(
  event: AnalyticsEventName,
  options: {
    route?: BuyerRoute;
    surface?: AnalyticsSurface;
    detail?: string;
  } = {},
): AnalyticsAttributes {
  const attributes: {
    'data-pt-event': AnalyticsEventName;
    'data-pt-route'?: BuyerRoute;
    'data-pt-surface'?: AnalyticsSurface;
    'data-pt-detail'?: string;
  } = { [EVENT_ATTRIBUTE]: event };

  if (options.route) attributes[ROUTE_ATTRIBUTE] = options.route;
  if (options.surface) attributes[SURFACE_ATTRIBUTE] = options.surface;
  if (options.detail) attributes[DETAIL_ATTRIBUTE] = options.detail.slice(0, MAX_DETAIL_LENGTH);

  return attributes;
}
