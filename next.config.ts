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
   *  - ONE PATH WHOSE SERVICE WAS DROPPED AND IS STILL UNDECIDED:
   *    /quantum-development-services. It needs a decision between the nearest
   *    honest destination and a deliberate 410 Gone, and that decision is
   *    whether quantum is still sold at all. Redirecting a dropped service to a
   *    page that does not offer it is a worse answer than a clean 404, so it is
   *    not guessed here.
   *
   *    WAS SEVEN, THEN SIX, NOW ONE. /ar-vr-development-services left the list
   *    on 2026-09-24 when the service was migrated back. The other five left it
   *    the same day when the founder gave a destination for each; they are in
   *    the `moved` table below. The count is corrected each time rather than
   *    left standing, because a stale count is trusted without recounting.
   *
   *    WAS SEVEN. /ar-vr-development-services LEFT THIS LIST 2026-09-24: the
   *    founder had the service migrated back from the previous site, at that
   *    same path, so it resolves again and needs no redirect and no 410. The
   *    count is corrected here rather than left reading seven with six names
   *    under it, because a stale count is the kind of thing a later reader
   *    trusts without recounting.
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
      { from: '/contact-us', to: '/contact' },
      { from: '/privacy-policy', to: '/privacy' },
      /*
       * REVERSED 2026-09-24 on founder instruction. These two pages MOVED to the
       * previous site's own paths, so the entries that used to point at the short
       * paths now point the other way; left as they were they would have been
       * self-referential loops.
       *
       * The short paths get the redirect because they have been live on the
       * preview and may be linked from anywhere it was shared.
       *
       * Terms sits at /terms-conditions, the PLURAL - the previous site's real
       * URL and the one carrying inbound history.
       *
       * IT BRIEFLY SAT AT THE SINGULAR. The founder first asked for
       * /terms-condition, which is a misspelling the old domain itself
       * redirected rather than a page it published; he was shown both with the
       * consequence stated, chose the singular, then corrected himself within
       * the hour. The singular is now a SOURCE rather than a destination, so
       * both old spellings still land on one canonical page - the same property
       * the first arrangement had, pointing the other way.
       */
      { from: '/about', to: '/about-us' },
      { from: '/terms', to: '/terms-conditions' },
      { from: '/terms-condition', to: '/terms-conditions' },
      /*
       * ARTICLES LIVE AT /blog/<slug>, THE HUB AT /insights. Founder decision
       * 2026-09-24, and the split is deliberate rather than an inconsistency
       * nobody noticed.
       *
       * The previous site published its posts at /blog/<slug>. Keeping that path
       * means each of the 36 archived posts republishes onto its ORIGINAL URL:
       * no redirect for any of them, and every inbound link resolves with no
       * hop. Filing them under /insights/<slug> would have cost 36 redirects for
       * a tidier path nobody searches for.
       *
       * /blog was the previous site's INDEX, and its counterpart here is the
       * hub, so it points there. It cannot be a page in its own right while
       * /blog/[slug] exists without becoming a second index competing with
       * /insights for the same content.
       */
      { from: '/blog', to: '/insights' },
      /*
       * The previous site's dropped services and orphaned pages, destinations
       * given by the founder 2026-09-24. Each is `permanent` like the rest, so
       * the old URL is dropped from the index rather than kept alive.
       *
       * The three engagement-model paths are the ones the comment above never
       * listed: an audit found nine dropped paths where next.config named six.
       * Outsourcing maps to Fixed-scope build and dedicated teams to Product
       * team, both of which live on /engineering, and staff augmentation is the
       * offer the site now explicitly declines - "we do not sell developers by
       * the day" - so /engineering is where a reader of that old page should
       * land to find out what is sold instead.
       */
      { from: '/dedicated-team-services', to: '/engineering' },
      { from: '/it-outsourcing-services', to: '/engineering' },
      { from: '/staff-augmentation-services', to: '/engineering' },
      { from: '/ui-ux-design-services', to: '/engineering' },
      { from: '/cancellation-refund-policy', to: '/terms-conditions' },
      /*
       * SECOND OPTION TAKEN, on his own wording, and cheap to change now.
       * He wrote "rebuild, or /contact" for /clutch and "Holdings site, or
       * /contact" for /startup-funding. The rebuild is item 17 and open; no
       * Holdings URL has been supplied or verified and inventing one would be
       * the kind of unchecked claim this project refuses. Both point at
       * /contact until either is settled.
       */
      { from: '/clutch', to: '/contact' },
      { from: '/startup-funding', to: '/contact' },
      /*
       * /insights currently carries noIndex, so this passes nothing to search -
       * but a 404 passes nothing either, and a redirect is strictly better for
       * a human following an old link to the research page. It improves on its
       * own the day the first article ships and the noIndex comes off.
       */
      { from: '/pixelette-research', to: '/insights' },
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
