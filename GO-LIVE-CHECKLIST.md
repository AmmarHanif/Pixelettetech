# Go-live checklist

Generated from the built site by `scripts/audit.py --checklist`, not maintained
by hand. Every entry below is a placeholder that renders **visibly** on the page
in amber monospace, carrying `data-placeholder="true"`.

The design's rule, which this build follows without exception: *a placeholder
stays visible until a real engagement fills it.* Nothing here was invented to
make a section look finished. Fill them, do not delete them.

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


**77 placeholders across 27 pages.**

To find them in a browser, on any page:

```js
document.querySelectorAll('[data-placeholder]')
```

Do not count them by grepping `.next/` — Next inlines the RSC flight payload
into each HTML file, so every placeholder appears there twice.

## Blocking — legal and regulatory

These carry legal exposure. None should be published in its current state.

**`/privacy`**

- [ ] `[DATE — set at legal sign-off]`
- [ ] `[RETENTION SCHEDULE — confirm periods per data class with the DPO]`
- [ ] `[SUBPROCESSOR REGISTER — hosting, email and CRM processors, with locations]`
- [ ] `[COOKIE POSITION — confirm whether any non-essential cookies are set before publication]`
- [ ] `[ICO REGISTRATION NUMBER]`

**`/terms`**

- [ ] `[DATE — set at legal sign-off]`
- [ ] `[LIABILITY WORDING — requires legal review before publication]`
- [ ] `[GOVERNING LAW AND JURISDICTION CLAUSE — confirm with legal]`

**`/modern-slavery`**

- [ ] `[DATE — set at legal sign-off]`
- [ ] `[POLICY SET AND SUPPLIER DUE-DILIGENCE PROCESS — confirm before publication]`
- [ ] `[RISK ASSESSMENT AND THE CONTROLS THAT FOLLOW FROM IT]`
- [ ] `[STAFF TRAINING POSITION]`
- [ ] `[BOARD APPROVAL, SIGNATORY AND FINANCIAL YEAR COVERED]`

**`/assurance`**

- [ ] `[VERIFY: ISO/IEC 42006 accreditation wording before publication]`

## Blocking — contact routes

An invented address loses enquiries silently. These must be real before launch.

**`/contact`**

- [ ] `[AI DPS RM6200 REGISTRATION IN PROGRESS]`

## Blocking — security review answers

Read by procurement and security reviewers. A visible gap is safer than a guess, but neither wins a deal.

**`/security-and-data`**

- [ ] `[REGISTRATION IN PROGRESS]`
- [ ] `[DATA RESIDENCY AND HOSTING REGIONS — confirm per environment before publication]`
- [ ] `[SUBPROCESSOR REGISTER — publish the current list and the notification period]`
- [ ] `[RETENTION SCHEDULE BY DATA CLASS — confirm with the DPO before publication]`

**`/certifications`**

- [ ] `[REGISTRATION IN PROGRESS]`
- [ ] `[REGISTRATION IN PROGRESS]`

**`/ai-engineering`**

- [ ] `[REGISTRATION IN PROGRESS]`

## Content — case studies awaiting client sign-off

Each needs the client's written approval before the outstanding figures and quotes go up.

**`/case-studies`**

- [ ] `[YOUR ENGAGEMENT HERE]`

**`/case-studies/anonymised-professional-services`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[MONTHS]`
- [ ] `[STACK]`

**`/case-studies/beyorch`**

- [ ] `[MONTHS]`

**`/case-studies/blockguard`**

- [ ] `[RUN CONTRACT STATUS, OR WHAT THE CLIENT DID AFTERWARDS]`
- [ ] `[CLIENT QUOTE, WITH SIGN-OFF]`
- [ ] `[NAME]`
- [ ] `[ROLE]`
- [ ] `[MONTHS]`

**`/case-studies/chain-legal`**

- [ ] `[MONTHS]`

**`/case-studies/chysler`**

- [ ] `[MONTHS]`

**`/case-studies/diamond-nxt`**

- [ ] `[MONTHS]`

**`/case-studies/digital-asset-vault`**

- [ ] `[MONTHS]`

**`/case-studies/law-ledger`**

- [ ] `[MONTHS]`

**`/case-studies/life-optimizer-ai`**

- [ ] `[MONTHS]`

**`/case-studies/lytics`**

- [ ] `[RUN CONTRACT STATUS, OR WHAT THE CLIENT DID AFTERWARDS]`
- [ ] `[CLIENT QUOTE, WITH SIGN-OFF]`
- [ ] `[NAME]`
- [ ] `[ROLE]`

**`/case-studies/mind-coach-ai`**

- [ ] `[MONTHS]`

**`/case-studies/pixelette-group-bid-cycle`**

- [ ] `[FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured]`
- [ ] `[MONTHS]`
- [ ] `[STACK]`

**`/case-studies/ragnar-token`**

- [ ] `[MONTHS]`

**`/case-studies/smart-contractor`**

- [ ] `[MONTHS]`

## Content — sector proof

Placeholder cards are deliberate. They stay until a real engagement fills them.

**`/industries/professional-services`**

- [ ] `[X]`
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
- [ ] Re-verify the Clutch rating and review count in `src/content/company.ts`;
      the committed figures were last checked 2026-06-01.
- [ ] Confirm each certification's verification URL resolves to this company's
      entry, not just to the register's home page (`src/content/company.ts`).
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
