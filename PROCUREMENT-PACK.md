# Procurement pack — what left the website, and what has to exist to replace it

Founder instruction, 17 September 2026:

> Keep detailed security controls, ISO evidence, processor/subprocessor
> documentation and DPAs outside the primary website experience. These can be
> supplied during enterprise procurement when required.

This file is the record of what was withdrawn from the public site on that
instruction, so that the material is not merely deleted and forgotten. **It is
not the pack itself.** Building the pack is a founder action and has not been
done.

## Why this file exists rather than a folder of evidence

The website used to answer a security questionnaire by pointing at two public
pages. Those pages are gone, and three surfaces now promise a reviewer that
detail will be sent directly instead:

| Surface | What it now promises |
|---|---|
| `/contact` — security questionnaire FAQ | "Send us the questionnaire and we will complete it… go direct to your reviewer" |
| `/contact` — Procurement and security card | Data handling, AI governance, incident response, control detail and certificate evidence go direct to your reviewer |
| `/privacy` — Who we share it with | Named providers, contractual terms and transfer safeguards available on request |

**Those are commitments made to a prospect in writing.** If the pack does not
exist when a reviewer asks, the site has made a promise the company cannot
keep — which is the same defect the old pages were criticised for, moved one
step further away from view. That is the whole risk of this change and it is
recorded here rather than assumed away.

## What was withdrawn from the public site

All of this was published somewhere on the site until 17 September 2026. It is
still in the repository's own records (`src/content/company.ts`,
`src/content/claims.ts`) and in git history; it simply no longer renders.

### ISO certificates

| | ISO/IEC 27001:2022 | ISO 9001:2015 |
|---|---|---|
| Certificate number | AMER800409 | AMER37046 |
| Issued | 12 March 2026 | 2 January 2026 |
| Expires | 11 March 2027 | 1 January 2027 |
| Recertification | 11 March 2029 | 1 January 2029 |
| Issuing body | Americo Quality Standards Registech Pvt. Ltd | Americo Quality Standards Registech Pvt. Ltd |
| Statement of Applicability | v1.0, 15 January 2026 | not supplied |
| Certified scope | published verbatim until 17 Sept; see `claims.ts` | none supplied |

**Still published on the site:** the two standards and their expiry dates, in
the footer ledger, and nothing else.

**Two constraints carried over, and they did not change with the page:**

1. Nothing is asserted about the standing of the United Accreditation
   Foundation, which the certificates record as accrediting the issuer. UAF's
   position following the closure of the International Accreditation Forum on
   1 January 2026 is unverified.
2. No surveillance or audit programme is claimed. The certificates supply three
   dates and no programme.

### Processors

Named in the repository, deliberately not named on the site — `/privacy` gives
categories of recipient instead, which is what UK GDPR Art. 13(1)(e) permits.

| Provider | Role | Note |
|---|---|---|
| Vercel | Hosting, CDN, form request handling | US-established |
| Supabase | Enquiry storage | London region required — see `DEPLOY-RUNBOOK` |
| Resend | Enquiry notification email | US-established |

### Documents that do not exist yet

- **DPAs with each of the three processors.** `/privacy` states each acts under
  a written contract. Confirm each one is actually executed.
- **Transfer mechanism per provider.** `/privacy` says the UK IDTA or the UK
  Addendum to the EU SCCs applies. Confirm which, per provider.
- **A controls summary** answering a standard security questionnaire.
- **Retention.** `/privacy` now states 24 months from last contact for an
  unconverted enquiry, and six years after an engagement ends. **That period was
  chosen when this change was made, not found** — nothing in the repository had
  ever recorded one, because the only statement of it lived on the page that was
  withdrawn. It is defensible and it is a founder decision to confirm or change.

## Before any of this is sent

The Privacy Notice at `/privacy` was drafted to the UK GDPR Article 13
structure and **has not had a legal review**. It is a legal document published
in the company's name. Review it before launch.
