import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Trailing slashes off keeps one canonical URL shape per page, which matters
  // for both classic crawlers and answer engines resolving citations.
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  /*
   * ============================================================================
   *  LEGACY URL REDIRECTS.  READ THIS BEFORE LAUNCH — IT IS INCOMPLETE BY DESIGN.
   * ============================================================================
   *
   * Added 2026-09-14 after measuring the live site's own sitemap against this
   * build. It declares 62 URLs. Exactly TWO survive the cutover on their own
   * slug: `/` and `/case-studies`. The other 60 change address or cease to
   * exist, and until this block existed there was no redirect mechanism of any
   * kind — no `redirects`, no middleware, no vercel.json.
   *
   * THE PROJECT RECORD SAID THIS WAS CLOSED. OPEN-DECISIONS C5 read "zero
   * redirects needed; the redirect map is empty by construction". That was
   * reasoned from the 16 case-study URLs, was correct about them, and
   * generalised from 16 to the whole site without examining the other 46. C5 is
   * reopened; this block is the part of it that needs no decision.
   *
   * WHAT IS HERE: the nine legacy paths whose destination already exists, so
   * the mapping is a fact rather than a judgement. Each is `permanent: true`, a
   * 308, because these moves are permanent and a 307 asks search engines to keep
   * the old URL indexed.
   *
   * WHAT IS DELIBERATELY NOT HERE, and why launching on this block alone still
   * loses traffic:
   *
   *  - 41 BLOG URLS — 36 posts, 4 category pages and /blog itself. There is
   *    nowhere to send them: /insights is a bare index with no article routes.
   *    The options are to port the content, redirect them wholesale to /insights
   *    and accept the loss of per-page relevance, or let them go. That is a
   *    commercial decision and it should be taken against Search Console data,
   *    which this repository does not have. A sitemap proves what a site
   *    publishes, not what performs.
   *  - SEVEN PATHS WHOSE SERVICE WAS DROPPED — /ui-ux-design-services,
   *    /quantum-development-services, /ar-vr-development-services,
   *    /startup-funding, /clutch, /pixelette-research and
   *    /cancellation-refund-policy. Each needs a decision between the nearest
   *    honest destination and a deliberate 410 Gone. Redirecting a dropped
   *    service to a page that does not offer it is a worse answer than a clean
   *    404, so none is guessed here.
   *
   * Do not treat this block as the finished redirect map. It is the half that
   * could be written without asking anyone.
   */
  async redirects() {
    const moved: { from: string; to: string }[] = [
      // Service pages: the slug changed, the offer did not.
      { from: '/ai-development-services', to: '/ai-automation' },
      { from: '/blockchain-development-services', to: '/blockchain' },
      { from: '/custom-software-development-services', to: '/engineering/custom-software-saas' },
      { from: '/web-development-services', to: '/engineering/web-platforms' },
      { from: '/mobile-app-development-services', to: '/engineering/mobile-applications' },

      // Renamed 2026-09-15 on founder instruction: the offer did not change, the
      // name did. Unlike the legacy paths above this is not a judgement call --
      // the destination is the same document under a new URL. The old path
      // carries priority 0.9 in the sitemap, the second-highest on the site, so
      // shipping the rename without this would drop the strongest AI-section URL.
      { from: '/ai-engineering/ai-value-baseline', to: '/ai-automation/value-discovery' },
      /*
       * Support & Continuous Improvement: two moves, both landing on the final
       * top-level URL so neither old address becomes a redirect chain.
       *
       * 1. Managed Engineering became Support & Continuous Improvement on
       *    2026-09-22 (the document is the same at a new address).
       * 2. On 2026-09-23, on founder instruction, the page was promoted out of
       *    /engineering to the top level, /support-continuous-improvement.
       *
       * Both `from`s point straight at the final URL. `permanent` makes each a
       * 308 so the old URLs are dropped from the index rather than kept, and the
       * sitemap now carries only /support-continuous-improvement, so there is
       * exactly one indexable version.
       */
      {
        from: '/engineering/managed-engineering',
        to: '/support-continuous-improvement',
      },
      {
        from: '/engineering/support-continuous-improvement',
        to: '/support-continuous-improvement',
      },
      // Company and legal pages: same document, shorter path.
      { from: '/about-us', to: '/about' },
      { from: '/contact-us', to: '/contact' },
      { from: '/privacy-policy', to: '/privacy' },
      { from: '/terms-conditions', to: '/terms' },
    ];
    return [
      ...moved.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
      /*
       * /method had no index and returned 404, so trimming the last segment off
       * /method/live dead-ended. A redirect rather than an index page: an index
       * listing ONE child is padding, and /method/live is what the reader wants
       * anyway. NOT `permanent` - if a second method page is ever published,
       * /method becomes a real hub, and a 308 already cached by browsers would
       * be in the way of it.
       */
      { source: '/method', destination: '/method/live', permanent: false },
      /*
       * /ai-engineering became /ai-automation on founder instruction,
       * 2026-09-22, aligning the slug with the name the nav has always used.
       * Twelve routes moved together - the hub and eleven children - so one
       * wildcard covers them rather than twelve entries that could drift apart.
       *
       * ORDER MATTERS AND THIS MUST STAY LAST. Redirects are evaluated in
       * sequence, and `moved` above contains /ai-engineering/ai-value-baseline,
       * whose destination is value-discovery rather than the same slug under a
       * new parent. Hoist this wildcard above it and that entry never runs: the
       * wildcard would send it to /ai-automation/ai-value-baseline, which does
       * not exist.
       *
       * The parent needs its own line because `:path*` does not match the empty
       * remainder for a source with a trailing segment.
       */
      {
        source: '/ai-engineering',
        destination: '/ai-automation',
        permanent: true,
      },
      {
        source: '/ai-engineering/:path*',
        destination: '/ai-automation/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            // Extended 2026-09-14. A marketing site needs none of these, and a
            // denial costs nothing; the four that were here already are kept.
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), ' +
              'payment=(), usb=(), serial=(), midi=(), display-capture=()',
          },
          {
            /*
             * CONTENT SECURITY POLICY, added 2026-09-14.
             *
             * WHAT IT IS AND IS NOT. There is no live script-execution hole here
             * to patch: the only `dangerouslySetInnerHTML` on the site is the
             * JSON-LD block, and `jsonLd()` in src/lib/schema.ts escapes every
             * less-than sign to its unicode escape, which closes the closing-tag
             * break-out. (This sentence avoids writing that escape literally: a
             * previous version did, the sequence was interpreted rather than
             * stored as text, and the comment ended up claiming the character is
             * escaped to itself.) All content is
             * authored in this repository and there is no user-generated HTML.
             * So this is defence in depth, and it matters for two reasons: this
             * site is read by procurement and security reviewers — /security-and-data
             * invites exactly that check — and the first third-party script anyone
             * adds later would otherwise land on an origin with no policy at all.
             *
             * WHY STATIC AND NOT NONCE-BASED, which is the stronger option. A
             * nonce CSP in Next 15 needs a middleware to mint a per-request nonce,
             * which turns every page of an otherwise fully static site into a
             * middleware-processed request. That is a real architectural cost and
             * it is a separate decision, not one to smuggle in under a header
             * change. `script-src 'unsafe-inline'` is therefore weak, and that is
             * stated rather than disguised: what this policy genuinely closes is
             * clickjacking (frame-ancestors), base-tag injection (base-uri),
             * plugin content (object-src) and form-action hijack.
             *
             * va.vercel-scripts.com is pre-allowed although NOTHING LOADS IT
             * TODAY: `<Analytics />` is rendered only when ANALYTICS_ENABLED is
             * true in src/lib/analytics.ts, and it is false. Measured on the live
             * deployment: 18 requests, every one same-origin. It is allowed in
             * advance because the alternative is worse — arming analytics later
             * would otherwise fail silently against a policy nobody thought to
             * update, and a silent failure is the defect this repository keeps
             * finding. Remove it if analytics is abandoned for good.
             *
             * frame-src is 'none' deliberately: the site embeds nothing. If an
             * embed is ever added it will fail loudly here, which is the correct
             * way to find out that a policy decision is owed.
             */
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'none'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "frame-src 'none'",
              "form-action 'self'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
              "connect-src 'self' https://va.vercel-scripts.com",
              "manifest-src 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
      {
        // llms.txt is a plain-text answer-engine surface; keep it cacheable and
        // explicitly typed so agents fetching it do not get a download prompt.
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

export default nextConfig;
