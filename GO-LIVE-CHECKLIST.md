# Go-live checklist

Generated from the built site by `scripts/audit.py --checklist`, not maintained
by hand. Every entry below is a placeholder that renders **visibly** on the page
in amber monospace, carrying `data-placeholder="true"`.

The design's rule, which this build follows without exception: *a placeholder
stays visible until a real engagement fills it.* Nothing here was invented to
make a section look finished. Fill them, do not delete them.

> **Reconciled by hand, 2026-09-08.** Thirteen work packages landed that day and
> falsified parts of this file. The inventory below was re-derived from the
> HTML the 2026-09-08 21:00 build emitted — the same documents the audit reads
> off the running server, matched with the same `data-placeholder="true"`
> pattern — rather than re-crawled, because that pass could not run the audit
> against a live server. **Re-run `python scripts/audit.py --port 4000
> --checklist` against a fresh build to confirm it.**
>
> Two things a later reader needs to know.
>
> **First, `--checklist` rewrites this file end to end, so not every
> correction here is durable.** The launch-blocker section and every standing
> task are string constants in `scripts/audit.py` (`LAUNCH_BLOCKER`,
> `STANDING_TASKS`); those corrections were therefore made in **both** places
> and survive regeneration. The per-page explanatory prose — why each
> `/privacy` item closed, why `/assurance` cleared by removal rather than by
> verification, why 2Connect's `[STACK]` is deliberate — has no home in the
> generator and **will be lost the next time the audit runs.** That was
> measured, not assumed: regenerating this file from the corrected
> `scripts/audit.py` and the inventory below reproduces the whole skeleton
> exactly — same count, same headings, same items, same standing tasks — and
> drops 89 lines, all of them prose. If that reasoning is worth keeping,
> `write_checklist` needs a per-page notes hook; that is a code change, and
> this pass did not make it.
>
> **Second, nothing below is ticked that was not read in the code.** Where an
> item is now waiting on the founder rather than on engineering, it says so
> and names the decision.

## ✅ Contact routes — blocker cleared 2026-08-31

The contact page previously offered no working way to reach the company: the form
was unconnected and both email addresses were placeholders, so the form's own
failure message pointed at an address that did not exist. Found by submitting the
form, not by reading it.

**Cleared.** The founder confirmed `sales@pixelettetech.com` — the address the
current live site already hands out — for both enquiries and press. Both now
render as live `mailto:` links, and the form's failure messages name it, so a
visitor always has a route that works.

| Route | State |
|---|---|
| Enquiries email | ✅ `sales@pixelettetech.com` |
| Press email | ✅ same inbox, by decision — one monitored route beats two where one is not |
| Postal address | ✅ Real |
| Contact form | ⚠️ Still needs `CONTACT_WEBHOOK_URL` at deploy — see standing tasks |

- [ ] Set `CONTACT_WEBHOOK_URL` in the deployment environment. **No longer
      launch-blocking** now that a real address is published, but until it is set
      the form collects nothing and tells visitors so.

The form is verified working: server-side validation rejects bad input with
per-field errors, and a valid submission with no endpoint configured fails
honestly rather than showing a false success, keeping what the visitor typed.


**64 placeholders across 19 pages.** (Was 73 across 21 before the 2026-09-08
work packages: `/terms` and `/assurance` are now clear, `/privacy` went from
five to one, `/security-and-data` gained one, and two case studies lost their
full-write-up placeholder.)

To find them in a browser, on any page:

```js
document.querySelectorAll('[data-placeholder]')
```

Do not count them with a recursive grep over `.next/`. Each placeholder is
emitted into three artefacts — the prerendered `.html`, its `.rsc` flight
payload and the route's `page.js` chunk — so the whole directory over-counts
roughly threefold (199 hits against a true 64 on the 2026-09-08 build).
Corrected 2026-09-08: this said the payload is inlined *into each HTML file*
so every placeholder appears there twice, and it is not — a single
prerendered `.html` contains each placeholder exactly once. Which matters,
because searching `.next/server/app/**/*.html` for `data-placeholder="true"`
is then a sound offline substitute for the crawl, and it is how the inventory
below was reconciled. It is a substitute, not a replacement: it sees only
prerendered routes, so a dynamic one (`/case-studies`, which reads
`searchParams`) is invisible to it and has to be checked in the source.

## Blocking — legal and regulatory

These carry legal exposure. None should be published in its current state.

**`/privacy`**

- [ ] `[TRANSFER MECHANISM PER PROVIDER — confirm UK adequacy regulations (Article 45A) or the International Data Transfer Addendum, and name it here]`

The other four are closed, and how each closed matters more than that it did
(all read in `src/app/privacy/page.tsx` on 2026-09-08):

- `[DATE — set at legal sign-off]` — filled. The page carries a real
  `lastReviewed="7 September 2026"`, because it really was reviewed that day.
- `[RETENTION SCHEDULE …]` — answered the way Article 13(2)(a) permits when a
  period is genuinely not fixed: by publishing the **criteria**. Same for named
  recipients, published as **categories**.
- `[COOKIE POSITION …]` — closed from first-hand inspection of the served site,
  written against the PECR regime substituted on 5 February 2026.
- `[ICO REGISTRATION NUMBER]` — the section was **removed rather than filled**,
  on two recorded grounds: no provision requires a controller to publish it,
  and the number held internally did not resolve on the ICO register of fee
  payers when checked on 2026-09-07. That is a deliberate decision, not a gap.

The one that remains is deliberate too. Article 13(1)(f) is discharged as to
the fact of transfer and how to obtain the safeguards; naming the mechanism
requires knowing what is actually in place with the hosting provider, and that
is not a fact the page may guess at.

**`/terms`** — ✅ clear. All three are filled, and the page renders no
placeholder at all in the current build. The liability and governing-law
wording was drafted on 2026-09-07 on the founder's express instruction, with
the heads of loss named rather than left to the phrase "consequential loss",
and the authorities read at source (the drafting note in
`src/app/terms/page.tsx` records a correction to a mis-cited one). The page
carries `lastReviewed="7 September 2026"`. **Still owed:** a human legal
review before publication — completing the wording is not the same as having
it signed off, and this checklist does not claim it is.

**`/assurance`** — ✅ clear, by removal rather than by verification, and the
difference is the point. The page was rewritten on 2026-09-08 to the handoff's
ACCREDITATION-SAFE RULE, and "ISO/IEC 42006" now appears **nowhere in `src/`**.
There was no accreditation wording left to verify, so the placeholder went with
the claim. What the page says instead is the route: Pixelette Certified helps
scope the requirement, prepare the evidence and coordinate the path to an
independent assessment, which stays independent.

## Blocking — security review answers

Read by procurement and security reviewers. A visible gap is safer than a guess, but neither wins a deal.

**`/security-and-data`**

- [ ] `[ISMS SCOPE AND CERTIFICATION EVIDENCE — published once the certificate number, issuing body and expiry date can be shown for the exact legal entity]`
- [ ] `[DATA RESIDENCY AND HOSTING REGIONS — confirm per environment before publication]`
- [ ] `[SUBPROCESSOR REGISTER — publish the current list and the notification period]`
- [ ] `[RETENTION SCHEDULE BY DATA CLASS — confirm with the DPO before publication]`

The first one is **new on 2026-09-08 and is not a regression.** The section
previously asserted a certified, externally audited ISMS; no certificate for
the exact legal entity exists in this project, so the claim was downgraded to a
visible gap — which is this page's own published policy applied to itself.
**Blocked on the founder, not on engineering:** it needs the certificate
number, the issuing body and the expiry date for Pixelette Technologies Ltd,
and the `iso-cyber-essentials-badges` row in `src/content/claims.ts` moved to
VERIFIED. That is the same decision that releases the badge artwork now held in
`design/held-assets/`.

## Content — case studies awaiting client sign-off

Each needs the client's written approval before the outstanding figures and quotes go up.

**`/case-studies/2connect`**

- [ ] `[STACK]`

The full write-up now exists — problem, what was built, the delivery route and
a non-quantified result — so that placeholder is gone. The stack stays unfilled
**on purpose**: the handoff describes the LLM/NLP and compatibility logic
without naming the technologies, and naming them from memory would be inventing
a fact into a case study. Two things still sit above this study and neither is
an engineering task: the client name is `namePermission: 'PENDING'`, so the
page runs anonymised until public-use permission is confirmed, and the
`case-study-outcome-percentages` row is NOT_PUBLISHED — there is no metric
basis to gather, so the narrative ships without numbers.

**`/case-studies/ayni-gold`**

- [ ] `[STACK]`

The full write-up now exists, so that placeholder is gone. **Blocked on the
founder, not on engineering:** the client is `namePermission: 'PENDING'`, and
the investment-return, token-value and mining-output figures are held in
`internalEvidence.heldMetrics` — some of them because they are the mine's
results rather than the engineering's.

**`/case-studies/blockguard`**

- [ ] `[RUN CONTRACT STATUS, OR WHAT THE CLIENT DID AFTERWARDS]`
- [ ] `[CLIENT QUOTE, WITH SIGN-OFF]`
- [ ] `[NAME]`
- [ ] `[ROLE]`

**`/case-studies/credit-smart-ai`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/crypto-audit`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/finchain`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/health-chain`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/health-predictor`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/juris-predict`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/legal-mind-ai`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/lytics`**

- [ ] `[RUN CONTRACT STATUS, OR WHAT THE CLIENT DID AFTERWARDS]`
- [ ] `[CLIENT QUOTE, WITH SIGN-OFF]`
- [ ] `[NAME]`
- [ ] `[ROLE]`

**`/case-studies/medi-analyze-ai`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

**`/case-studies/transact-secure`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[STACK]`

## Content — sector proof

Placeholder cards are deliberate. They stay until a real engagement fills them.

**`/industries/professional-services`**

- [ ] `[CLIENT]`
- [ ] `[NAMED PROCESS AND RESULT]`
- [ ] `[MEASURED FIGURE]`
- [ ] `[CLIENT]`
- [ ] `[NAMED PROCESS AND RESULT]`
- [ ] `[MEASURED FIGURE]`
- [ ] `[CLIENT]`
- [ ] `[NAMED PROCESS AND RESULT]`
- [ ] `[MEASURED FIGURE]`

**`/industries/insurance-financial-services`**

- [ ] `[CLIENT]`
- [ ] `[NAMED PROCESS AND RESULT]`
- [ ] `[MEASURED FIGURE]`
- [ ] `[CLIENT]`
- [ ] `[NAMED PROCESS AND RESULT]`
- [ ] `[MEASURED FIGURE]`
- [ ] `[CLIENT]`
- [ ] `[NAMED PROCESS AND RESULT]`
- [ ] `[MEASURED FIGURE]`

## Content — insights

Dates and authors appear when each piece is written and signed off, not before.

**`/insights`**

- [ ] `[DATE]`
- [ ] `[PLANNED: our eval in inspect_evals]`
- [ ] `[DATE]`
- [ ] `[AUTHOR]`
- [ ] `[DATE]`
- [ ] `[AUTHOR]`
- [ ] `[DATE]`
- [ ] `[AUTHOR]`
- [ ] `[DATE]`
- [ ] `[DATE]`
- [ ] `[DATE]`
- [ ] `[ARCHIVE DESTINATION]`

## Commercial

Pricing detail to confirm.

**`/ai-engineering/support-and-run`**

- [ ] `[ON APPLICATION]`

## Not placeholders — separate go-live tasks

- [ ] Set `CONTACT_WEBHOOK_URL` in the deployment environment. Until it is set,
      the contact form tells visitors it is not connected rather than silently
      dropping enquiries — but it is still not collecting them.
- [ ] Confirm the production domain matches `SITE_URL` in `src/content/company.ts`
      (currently `https://pixelettetech.com`). Canonicals, the sitemap and the
      OpenGraph URLs are all derived from it.
- [ ] **Founder decision: publish the Clutch aggregate, or leave it held.** Not
      an engineering task any more. Corrected 2026-09-08: the figures in
      `src/content/company.ts` were re-read off the live profile on **2026-09-03**
      (`clutch.lastVerified`), not 2026-06-01 as this line said. They render
      nowhere, because `clutch.published` is false and the `clutch-rating` row in
      `src/content/claims.ts` is HELD. To publish: re-read the profile
      immediately before launch, re-date `lastVerified`, set `clutch.published`,
      and move the register row the same day — printing the read date beside the
      score is what the 7 September legal review judged sound under the DMCCA
      fake-review provisions. The individual review cards are a separate claim
      and already render, each linking to the review it came from.
- [ ] **Founder decision: produce the certificates, or the certification claim
      stays off the site.** Corrected 2026-09-08: this was written as a
      link-checking task, and it is not one. Every row in `certificationRegister`
      (`src/content/company.ts`) is `published: false`, so `certifications` is
      empty, the footer badge pills are gone and `VerificationTable` prints its
      no-certification paragraph instead of a table. The URLs are also not
      resolvable in the way this line asked for: IAF CertSearch and the IASME
      register are search boxes, not per-company pages, and the founder decided on
      2026-09-01 that certificate documents are held internally and not published.
      What actually unblocks it is the certificate number, the issuing body and
      the expiry date for **Pixelette Technologies Ltd**, printed beside the
      badge, and the `iso-cyber-essentials-badges` row moved to VERIFIED. The
      badge artwork is waiting in `design/held-assets/`, moved out of `public/` on
      2026-09-08 because everything under `public/` is served at a guessable URL
      and the claim in those two SVGs is machine-readable text.
- [ ] Decide the redirect map from the current site's URLs to these routes. The
      information architecture has changed substantially — several existing
      service pages have no direct equivalent — so this needs a deliberate pass,
      not a wildcard.
- [ ] Submit `sitemap.xml` in Search Console once the domain is live.
- [ ] **Wire up the Insights "Subscribe" action.** Board 17 puts it beside the
      primary CTA. There is no mailing list, so it currently routes to the
      contact form — a subscription request a person can fulfil by hand. Replace
      with a real list or a dedicated field when one exists.
- [ ] **Give the Insights archive a destination.** Board 17 offers "Browse →" on
      the "blockchain and distributed systems, 2018-2025" card. That archive has
      no home in this build, so the destination renders as a visible placeholder
      rather than pointing at something that is not an archive.
- [ ] **Confirm the ML framework on the Lytics case study.** The design says
      PyTorch, the delivery record says TensorFlow, and the two are not
      independent — the old site renders that record directly. The build ships
      TensorFlow. Settle it from the Lytics repo (`import tensorflow` vs
      `import torch`, or its requirements file) or from whoever led delivery. If
      nobody can confirm it, drop the framework name: "Python, streaming ingest,
      AWS" is true either way and removes a checkable claim that buys nothing.
- [ ] **Produce the sample AI Value Baseline output.** Board 11 specifies a
      second hero CTA reading "Download a sample output". No such artefact
      exists, so the button currently reads "Request a sample output" and routes
      to the contact form — the design's function preserved without promising a
      download that would not happen. Once a redacted sample baseline exists,
      restore the board's wording and point it at the file.
- [ ] Optional: supply light-background client logo artwork if the "Trusted by"
      row should show marks rather than names. The existing files are
      white-on-transparent (built for the old dark site) and two of them are
      invisible on white, so the row renders client names as text — which is what
      the approved design specifies in any case.
- [x] **Founder decision: the seven client names on the homepage — ANSWERED
      2026-09-11.** Raised 2026-09-08, when every row in
      `src/content/clients.ts` read `permission: 'UNCONFIRMED'` while
      `ClientLogos` rendered the names anyway on `/` and `/ai-engineering`,
      because it reads `clients` rather than the empty `approvedClients()`.
      The founder decided to KEEP the names: "Keep them — I'm confident we
      have the basis." All seven rows are now APPROVED, with the decision, its
      date and its limits recorded in that file. Two things it did NOT do, and
      both were settled later the same day. CORRECTED 2026-09-11: this item
      ended "Two things it did NOT do, and both are still open below." Neither
      is open. See the two closed items that follow; the history above stands
      as written.
- [x] **Move the `client-logos` row in `src/content/claims.ts` — ANSWERED
      2026-09-11, and the answer is that it does not move.** CORRECTED
      2026-09-11. This item read: "It still reads HELD with its APPROVAL GATE
      instruction, so the claims register now lags `src/content/clients.ts` by
      one decision. The decision of 2026-09-11 is what it needs recording
      against it." It is not a lag. ADR-0023 decided the row STAYS HELD: it
      governs a claim CLASS, the founder cleared seven names inside that class,
      and VERIFIED is not inert — it would print a "Named client logos and
      wordmarks" badge in the proof strip on `/` and under "Verified and
      published" on `/certifications`, which is the site advertising its own
      permission as a proof point. The decision of 2026-09-11 IS recorded
      against the row, in its evidence note, with the status deliberately
      unchanged. Nothing is owed here, and a reader auditing the register
      against the site should not "tidy" this row.
- [x] **Point `ClientLogos` at `approvedClients()` — DONE 2026-09-11.**
      CORRECTED 2026-09-11. This item read: "With all seven rows APPROVED the
      accessor and the raw array return the same seven names, so the switch
      `src/content/clients.ts` has always described is finally a safe one-line
      change in `src/components/sections.tsx`. Until it is made, the render
      still cannot be emptied by setting a row back to UNCONFIRMED." The switch
      was made the same day. `ClientLogos` reads `approvedClients()`; the
      rendered HTML of both pages is byte-identical across the change; and the
      render CAN now be emptied — with every row set back to UNCONFIRMED the
      whole client section disappears from `/` and `/ai-engineering`, measured
      by building it rather than assumed. Nothing is owed.
- [ ] **Akashic Knowing stays UNCONFIRMED.** The eighth row, in
      `additionalClients`, is imported by nothing and has never been published.
      The 2026-09-11 decision was put about the seven live names and is not
      blanket permission, so it was deliberately not swept in. Put it to the
      founder in its own right if that row is ever wanted on the page.

## Fixes owed on the CURRENT live site, not this build

FOUNDER DECISION 2026-08-31 — "new site only". The live site is being replaced,
so fixing it is wasted effort. These are FINDINGS, NOT TASKS: no owner, no
deadline, no action. They are listed so the record is complete and so nothing is
rediscovered as new. All of them disappear when the new site launches.

- [ ] AdWatch's "Ad detection" metric reads "$20,000 per organization in
      recruitment costs due to better candidate matching" — a claim belonging to
      the AIA hiring tool, not an ad-blocker. A one-line fix was applied and then
      REVERTED under the new-site-only decision; repo/ is clean. Correct
      replacement if ever wanted, from AdWatch's own milestone: "Achieved up to
      98% accuracy in automated ad detection across live media streams."
- [ ] `chain-legal` displays ragnar-token's banner image; `smart-contractor`
      displays law-ledger's. chain-legal has its own artwork in its own folder;
      smart-contractor has NO image folder at all (checked 2026-09-01 — an
      earlier version of this row wrongly said both had their own artwork).
- [ ] Beyorch's impact description is Lytics' text — "AI-driven news monitoring
      and sentiment analysis" on a DeFi investment platform (`caseStudiesData.ts`,
      beyorch impactStats.description; renders live). Found 2026-09-01.
- [ ] Life Optimizer's third impact box is LawLedger's text — "92% satisfaction
      rate among legal professionals ... managing transactions" on a wellness
      platform. Found 2026-09-01. Neither defect was carried to the new site's
      reinstated entries.
- [ ] life-optimizer-ai, ragnar-token and smart-contractor share one identical
      pasted techStack (python/TensorFlow/PyTorch/aws/postgresql/reactjs) — an
      ML stack on two blockchain builds. The new site keeps it only at its
      plausible home (Life Optimizer) and grounds the other two differently.
- [ ] AdWatch's entire "Testing and deployment" milestone — text naming "the
      AdWatch Engine into live media streams" — is live verbatim on **Fusio**
      (crypto portfolio management) and **Lytics** (news monitoring). Neither
      detects ads. Deleting the foreign text is safe; a replacement cannot be
      written without the real milestones. See OPEN-DECISIONS.md A2.
- [ ] Design board 05 attributes the £500,000 marketplace figures to Butter
      Smiles. They belong to the 'Stay Sane' NFT collection — see ADR-0006.
- [ ] Design board 06 states "170% retention at 3 months". The true figure is
      70% (`blockchainDevelopment.ts` lines 60-64). A rate above 100% invites
      exactly the scrutiny the new site is built to survive.
