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
             * JSON-LD block, and `jsonLd()` in src/lib/schema.ts escapes `<` to
             * <, which closes the </script> break-out. All content is
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
