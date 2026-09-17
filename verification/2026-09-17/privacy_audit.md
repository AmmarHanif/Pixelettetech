# Privacy and analytics audit — 17 September 2026

Founder instruction: audit the existing site before changing anything, then
implement a privacy-choices control with no cookie banner. Closing line of the
brief, which governs this document: **"Do not claim compliance or functionality
that has not been technically verified."**

Everything below was measured. Where something could not be verified, it says so.

---

## 1. What the site actually does — the audit

### Measured in a browser against the built site

Homepage, `/contact`, and a case study:

| Probe | Result |
|---|---|
| `document.cookie` | empty |
| `localStorage` | empty on arrival |
| `sessionStorage` | empty |
| `indexedDB.databases()` | empty |
| Third-party resource requests | **zero** — fonts served from our own domain |
| `window.dataLayer` | undefined |
| `window.gtag` | undefined |
| `window.va` | undefined |

### Found in the source

| Looked for | Found |
|---|---|
| Google Analytics, Google Tag Manager, any tag container | none |
| Ahrefs analytics | none |
| Hotjar, Clarity, session recording, heatmaps | none |
| Advertising / remarketing / conversion pixels (Meta, LinkedIn, DoubleClick) | none |
| Cloudflare, Turnstile, reCAPTCHA | none |
| `<iframe>`, third-party `<img>`, third-party `<script src>` | none |
| `document.cookie`, `localStorage`, `sessionStorage`, `indexedDB` in `src/` | none |
| Server-set cookies, middleware | none — there is no `middleware.ts` |
| Tracking dependencies in `package.json` | **`@vercel/analytics` only** |
| Outbound third-party calls | one, **server-side**: `api.resend.com`, the contact-form notification. Not a browser request and not analytics. |

**Conclusion:** the site had no cookies, no storage and no analytics running.
`@vercel/analytics` is present as a dependency but gated behind
`ANALYTICS_ENABLED`, which is `false`, so nothing mounted.

---

## 2. Inventory of storage after this change

| Item | Type | Purpose | Set when | Retention |
|---|---|---|---|---|
| `pt-analytics` | First-party `localStorage` | Remembers the visitor's analytics choice so an objection is respected on later visits | Only when the visitor uses the control | Until the visitor clears browser storage or changes the choice |

That is the complete list. The value is one of two literals (`on` / `off`). It
carries no identifier, no timestamp and nothing derived from the visitor, it is
never transmitted, and two visitors who both object store byte-identical values
— so it cannot be used to distinguish them.

No cookies are set by this site.

---

## 3. The gate — proven, and it failed its first test

Requirement: *"Verify the analytics OFF state actually prevents analytics
transmission."*

This could not be proved with analytics disabled, because nothing sends in that
state. `ANALYTICS_ENABLED` was therefore set to `true` **temporarily**, both
states were measured, and the flag was reverted.

### The first attempt was incomplete, and measuring is the only reason it is known

Gating every `track()` call site in the repository stopped the custom events.
It did **not** stop this:

```
["pageview", { route: "/contact", path: "/contact" }]
```

`<Analytics />` emits pageviews itself, on navigation, without passing through
any `track()` in this codebase. **A visitor who had objected was still being
counted on every page they opened.** Gating the calls I wrote left the
provider's own traffic untouched.

### The fix, and the result

`src/components/GatedAnalytics.tsx` applies the objection at the provider's
`beforeSend` hook, which sees everything the provider sends — including traffic
this codebase never initiates. The call-site gates stay as defence in depth.

| State | Result |
|---|---|
| Analytics **ON** | `event`, `beforeSend`, `pageview` — normal operation |
| Analytics **OFF** | **zero** outbound analytics: no `fetch`, no `sendBeacon`, no event, no pageview |

---

## 4. The control

| Requirement | Verified |
|---|---|
| No banner, no consent wall, no automatic pop-up | Panel `open` is `false` on arrival; storage empty until the visitor acts |
| Opens only when chosen | Only the footer button's click handler opens it |
| Keyboard accessible | Escape closes it; focus returns to the trigger |
| Persists across visits | `off` survived navigation; one key only |
| Footer on every route | 69 static pages: **all** carry the footer and the trigger |

---

## 5. Not done, and owed

- **Self-hosted Matomo is not implemented.** It needs a server, a database and a
  deployment — infrastructure that is a founder decision, not something that can
  be provisioned from here. The gate is provider-agnostic, so whatever is chosen
  plugs in behind a control that is already proven.
- **No analytics provider is running at all.** `ANALYTICS_ENABLED` is `false`.
  The Cookies and analytics page says so in those words rather than describing
  an aspiration.
- **Vercel Analytics' own data handling is not verified.** It is the only
  analytics dependency present, and whether it satisfies the statistical-purpose
  requirements cannot be confirmed from here — the provider's documentation is
  outside the network allow-list. **It must not be switched on until someone has
  checked that.**
- **The audit was run against a local production build**, not the deployed host.
  Platform features can set their own cookies, preview deployments especially.
  Re-run this before launch and correct the Cookies and analytics page if the
  live host differs.
