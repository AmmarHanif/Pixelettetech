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

**Still published on the site:** the two standards' names, in the footer
ledger, and nothing else about the certificates. The footer has shown the
standard only since 22 September 2026, on founder instruction: no expiry date is
published (`src/components/SiteFooter.tsx:240-248`). The expiry still decides
whether a row renders at all (`publishedCertifications`, `SiteFooter.tsx:169-178`).

**Two constraints carried over, and they did not change with the page:**

1. Nothing is asserted about the standing of the United Accreditation
   Foundation, which the certificates record as accrediting the issuer. UAF's
   position following the closure of the International Accreditation Forum on
   1 January 2026 is unverified.
2. No surveillance or audit programme is claimed. The certificates supply three
   dates and no programme.

### Processors

Named on the site as well as here. `/privacy` names all three, in its
processors table and in its transfers paragraph
(`src/app/privacy/page.tsx:463-471` and `:523`), and the founder confirmed on
18 September 2026 that the names stay (PRIVACY-STATEMENT-CONFIRMATIONS.md, B6).

| Provider | Role | Note |
|---|---|---|
| Vercel | Hosting, CDN, form request handling | US-established |
| Supabase | Enquiry storage, and the name and email given to Pix T (`assistant_contacts`) | London region required — see `DEPLOY-RUNBOOK` |
| Resend | Enquiry notification email | US-established |

**OPEN (2026-10-01):** this document says a London region is required for
Supabase, citing `DEPLOY-RUNBOOK`, which is not in this repository. `/privacy`
(`src/app/privacy/page.tsx:523-525`) says "We have not restricted the regions in
which Vercel, Supabase and Resend process this information", and
CONTACT-FORM-SETUP.md section 4 records the Supabase region as not yet recorded.
The founder must decide which is correct, and this line should then be removed.

**OPEN (2026-10-01):** this table describes Vercel and Resend as US-established.
That is unverified. `/privacy` removed the same claim on 18 September 2026 as
unverified, noting that at least one of the three providers has contracted
through a Singapore entity in the past (`src/app/privacy/page.tsx:512-519`).
The founder must confirm each provider's contracting entity before this pack is
sent, and this note should then be removed.

### Documents that do not exist yet

- **DPAs with each of the three processors.** `/privacy` states each is engaged
  "under that provider's data processing terms"
  (`src/app/privacy/page.tsx:483-484`). Confirm each one is actually executed.
- **Transfer mechanism per provider.** `/privacy` says the safeguard is the
  European Commission's standard contractual clauses together with the UK
  Addendum, in each provider's data processing terms, and that no adequacy
  decision is relied on (`src/app/privacy/page.tsx:523-529`). Confirm that is
  the mechanism, per provider.
- **A controls summary** answering a standard security questionnaire.
- **Retention.** `/privacy` now states 24 months from last contact for an
  unconverted enquiry, 12 months for a name and email given to Pix T with no
  enquiry following (applied in commit `c3d647b`, 29 September 2026), and six
  years after an engagement ends (`src/app/privacy/page.tsx:557-577`). **The
  24-month period was chosen when this change was made, not found** — nothing in the
  repository had ever recorded one, because the only statement of it lived on
  the page that was withdrawn. It is defensible and it is a founder decision to
  confirm or change.

  **OPEN (2026-10-01):** this document says the 24-month period "was chosen when
  this change was made, not found"; PRIVACY-STATEMENT-CONFIRMATIONS.md section C
  says it was "Carried from the previous statement". Commit `0f2324e`
  (2026-09-14) is where "24 months" first appears in `src/app/privacy/page.tsx`.
  The founder must decide which account is correct, and this note and its twin
  in that file should then be removed.

## Before any of this is sent

The Privacy Notice at `/privacy` was drafted to the UK GDPR Article 13
structure and **has not had a legal review**. It is a legal document published
in the company's name. Review it before launch.
