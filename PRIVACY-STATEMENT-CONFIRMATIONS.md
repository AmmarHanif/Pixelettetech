# Privacy Statement — what needs management confirmation before publication

Companion to the Privacy Statement at `/privacy`, effective 17 September 2026,
version 2.0. The statement was written under the founder's rule that it must
**describe reality, not aspiration**, and everything in it was checked against
the codebase, the database migration or a live browser measurement.

This is the list of things that **could not be verified from the codebase** and
therefore need a person to confirm before this is published.

---

## A. The website assistant, Pix T, and enquiry scoring

**Corrected 2026-10-01.** This section was headed "THE ONE THING THAT BLOCKS
PUBLICATION" and said there was no assistant in this codebase and no enquiry
scoring. Both now exist. The assistant, Pix T (`src/components/SiteAssistant.tsx`,
first added in `c21d75b` on 24 September 2026), is mounted on every page by
`src/app/layout.tsx:216`. Since 29 September it asks for a name and email before
chatting and sends them to be stored, and it scores the enquiries sent through it
(`src/lib/lead-score.ts`; `submitAssistantEnquiry`,
`src/app/contact/actions.ts:219-229`). Contact-form enquiries are not scored.
The Statement's wording for that was approved and applied on 29 September in
`c3d647b`, including the scoring section under "How we prioritise enquiries from
Pix T" (`src/app/privacy/page.tsx:376-391`); see
PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md. This section previously listed three
ways to reconcile the Statement with a site that had no assistant; the first,
that the assistant ships and the section is checked against it, is what
happened, and the check is below.

Founder decision of 17 September 2026 replaced the AI section with wording that
opens: *"We use third-party AI and technology providers to operate our website
assistant and related functionality."* That wording is still on `/privacy`.

**What Pix T does, checked against the code on 2026-10-01:**

- It answers a visitor's own questions in the browser, from this site's pages.
  `SiteAssistant` calls `respond()` (`src/components/SiteAssistant.tsx:28`,
  `:277`), which imports only local modules and the site's own knowledge base
  (`src/lib/pix/respond.ts:1-3`, `src/lib/pix/retrieve.ts:1`). Nothing in `src`
  calls `/api/pix`. Its own answer to "are you an AI?" says it finds the
  relevant passage "rather than by generating an opinion"
  (`src/lib/pix/rules.ts:94`).
- It calls no AI provider. The server gateway behind `/api/pix` takes its model
  from `resolveProvider()` (`src/lib/pix/provider.ts:169-176`), which returns
  `UnconfiguredProvider`, a provider that refuses every call, unless
  `PIX_T_PROVIDER=mock` is set; no production adapter exists. No AI SDK is among
  the dependencies in `package.json`.
- What reaches Pixelette is the name and email given before chatting
  (`assistant_contacts`, through `startAssistantChat`,
  `src/app/contact/actions.ts:276-302`) and, if the visitor finishes, the
  enquiry with its lead score (`contact_enquiries`, and the notification email).
  Supabase and Resend handle both, as for the contact form. The rest of the chat
  is not stored (`src/components/SiteAssistant.tsx:519-520`).

**→ For management or Legal to confirm:**

1. **The AI-provider sentences.** `/privacy` says "We use third-party AI and
   technology providers to operate our website assistant" and "The assistant is
   an AI system and may make mistakes" (`src/app/privacy/page.tsx:351-358`). No
   AI provider operates Pix T today, and it generates no text with a model.
   "Technology providers" is still true: Supabase and Resend handle what a
   visitor gives it. Whether and how to change these sentences is a decision for
   management and Legal, not an engineering edit: `/privacy` is legal copy, and
   the build's privacy interlock guards it. PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md
   raised the same point on 29 September (change 5, "Optional, for accuracy
   today").
2. **The lead-score wording on email addresses.** `/privacy` says the score uses
   "whether your email address is at a company's own domain or a personal email
   provider" (`src/app/privacy/page.tsx:382-383`). The code decides only whether
   the address is at a listed personal email provider: anything not on the list
   is recorded as "Email not at a listed personal provider", and nothing checks
   that the domain belongs to a company (`src/lib/lead-score.ts:56-62`, `:118-123`,
   security review S4). The draft's later wording, "at a well-known personal
   email provider", matches the code; the published sentence came from the
   earlier draft. A wording item for Legal.

Also per instruction: **no AI provider is named**, and **no claim is made about
providers not using information for model training**. Both were removed, and
both are still absent from the rendered page.

---

## B. Claims that are commercially or contractually true or false, and I cannot tell

### 1. Business development and marketing — now permissive, and that is the decision

The restrictive wording is **gone** on founder instruction. Removed entirely:
"everything we hold about you came from you", "we do not buy personal
information", "we do not enrich from external databases or data brokers", and
"this website operates no mailing list… replying to your enquiry is the only
thing we do with it."

The statement now says business contact information may be **obtained from
appropriate public, professional or business sources**, processed under
data-protection and electronic-marketing requirements, with an absolute right to
object to direct marketing. **We do not sell personal information** is retained.

**→ Confirm:** that outbound practice actually matches this — in particular the
lawful basis relied on (normally legitimate interests for B2B), that PECR is
satisfied for electronic marketing, and that an objection genuinely stops
contact across every channel and list.

### 2. Provider roles and contractual terms

The statement says the three providers are "engaged to process this information
for us, for the purpose described, under that provider's data processing terms."

It deliberately does **not** claim each acts solely on our instructions and may
not use the data for its own purposes. That is a contractual position, not a
code fact.

**→ Confirm:** that a DPA is in force with **Vercel**, **Supabase** and
**Resend**; that each is a *processor* rather than an independent controller for
this purpose; and that SCCs plus the UK Addendum is the mechanism that actually
applies. If an AI provider is added, it joins this list.

### 3. The mailbox provider

Mentioned but not named, because it appears nowhere in the codebase.

**→ Confirm:** who carries Pixelette email and whether it should be named.

### 4. Recruitment and events

Now written conditionally — "if you apply", "if you register" — which is
accurate whether or not a programme exists, and does not imply one does.

**→ Confirm:** that applications are handled as described, including
pre-employment checks, and that a retention period for unsuccessful applicants
is decided. The statement does not state one.

### 5. Client-work processor position

**→ Confirm:** that client contracts contain the processor terms the "Work we do
for clients" section describes.

### 6. Whether to name the providers at all, or describe them by category

**Raised 2026-09-18** by the founder: "What's Vercel, Supabase, and Resend got
to do with this?" Underneath the factual question is a commercial choice that is
not a legal one.

Naming processors is the stronger position, is what enterprise procurement asks
for, and the statement promises it a paragraph earlier ("we name them rather
than describing them vaguely"). The lawful alternative is to describe them by
category, a hosting provider, a database provider, an email delivery provider,
and send the named list to a reviewer on request, which the document already
offers.

Cost of naming: it publishes the stack. Vercel is inferable from response
headers in any case; Supabase and Resend are not otherwise discoverable.

**CONFIRMED 2026-09-18 by the founder: keep the names as they are.** The
question was about understanding why those three appear in a privacy notice at
all, not an objection to naming them. No change to the document; the processors
table and the transfers paragraph both continue to name Vercel, Supabase and
Resend.

This item stays on the list rather than being deleted, because the decision is
worth having on record: if a future reviewer proposes moving to categories, the
answer is that naming was considered and kept. Both passages must still move
together if that is ever revisited; naming them in one and not the other is
worse than either choice.

---

## C. Operational commitments the statement makes on the company's behalf

These are promises to a reader that only a person can stand behind.

| Commitment | Needs confirming |
|---|---|
| Enquiries deleted **24 months from last contact** | Carried from the previous statement. Confirm it is still the rule and that someone actually does it — the statement is deliberately honest that this is a rule we act on, not an automatic timer. **OPEN (2026-10-01):** this document says the period was "Carried from the previous statement"; PROCUREMENT-PACK.md says it "was chosen when this change was made, not found". Commit `0f2324e` (2026-09-14) is where "24 months" first appears in `src/app/privacy/page.tsx`. The founder must decide which account is correct, and this note and its twin in that file should then be removed. |
| Pix T name and email, with no enquiry following, deleted **12 months from when given** | Decided with the Pix T wording on 29 September 2026 (`c3d647b`; `src/app/privacy/page.tsx:567-571`). Confirm someone does it: the migrations grant the website's database credential `INSERT` only (whether they are applied to the live project is unconfirmed), and nothing in `src` deletes rows, so deletion is a manual task. |
| On objection, the **lead score and its reasons are deleted** | Stated at `src/app/privacy/page.tsx:611-613`. Confirm there is a way to do it and someone who will. |
| Client records kept for the engagement **plus six years** | Standard for legal and tax purposes; confirm it matches actual practice. |
| Rights requests answered **within one month** | Standard statutory period; confirm capacity to meet it. |
| Complaints acknowledged **within 30 days** | Carried from the previous statement. |
| **No statutory DPO appointed** | Confirm that remains correct. |
| Breach notification to data subjects and the ICO where required | Confirm there is a process. |

---

## D. Technical items still open

1. **Supabase region.** The statement names no hosting region; it says the
   regions in which Vercel, Supabase and Resend process enquiries have not been
   restricted (`src/app/privacy/page.tsx:523-525`). The Supabase region is not
   yet recorded (CONTACT-FORM-SETUP.md section 4). `DEPLOY-RUNBOOK` requires
   London. Confirm the region now if the project already exists (Project
   Settings, General), or choose it at creation — a Supabase region is fixed at
   creation and cannot be moved.

   **OPEN (2026-10-01):** this item cites `DEPLOY-RUNBOOK`, which is not in this
   repository, as requiring a London region; `/privacy`
   (`src/app/privacy/page.tsx:523-525`) says the regions have not been
   restricted. The founder must decide which is correct, and this note should
   then be removed. PROCUREMENT-PACK.md carries the same note.
2. **Whether the contact form is connected is not recorded.**
   **Corrected 2026-10-01:** this item used to say the form is not connected and
   that no enquiry has reached Supabase or Resend. The code, including Pix T's
   lead capture, has been on Vercel Production since 2026-10-01 (`main` at
   `0e9a979`). No environment variable is in the repository, but whether the
   Vercel project has the four variables cannot be read from it, so whether any
   enquiry or chat contact has reached Supabase or Resend is unknown. Where they
   are unset, both delivery legs in `src/lib/enquiries.ts` return `unconfigured`
   and `actions.ts` shows the visitor an honest refusal rather than accepting the
   submission. Where they are set, storage also depends on the two migrations,
   whose state on the live project is unconfirmed (CONTACT-FORM-SETUP.md,
   "Applying the migrations — step by step").

   **Corrected 2026-09-18, twice over.** This item used to say
   `DELIVERY_CONNECTED` is `false` as though that flag were the mechanism. It is
   not: the flag is declared in `src/content/launch.ts` and referenced **nowhere
   else in `src`**. It reads like the control governing this and is wired to
   nothing. Wire it or delete it.

   This item also used to say the statement "describes the arrangement rather
   than claiming traffic, so it is accurate either way". **That judgement no
   longer holds.** Today's transfers rewrite asserts a present arrangement more
   strongly ("we have not restricted the regions in which Vercel, Supabase and
   Resend process this information"), and the processors table already tells a
   reader their enquiry *is* saved into a database. If the deployed form is not
   connected, the statement describes processing that does not occur, which
   inverts the instruction it was drafted under: describe reality, not
   aspiration.

   **-> Confirm:** whether the deployed contact form is connected. If it is,
   nothing changes. If it is not, the paragraph must say enquiries arrive by
   email until delivery is live, and switch over when it is. The same question
   now covers Pix T: `/privacy` says the name and email given to it are recorded
   as soon as they are given (`src/app/privacy/page.tsx:201-203`), which is true
   only once the database and the lead-capture migration are in place.
3. **Analytics.** None is running. If one is introduced, the Analytics section
   and the Cookies and analytics page both branch on `ANALYTICS_ENABLED`, so
   they update together — but the **provider must be named** before it runs.
4. **Vercel Analytics' data handling is unverified.** It is the only analytics
   dependency present and its documentation is outside this session's network
   allow-list. Do not switch it on until someone confirms it meets the
   statistical-purpose requirements.
5. **Sticky-nav scroll behaviour.** The CSS is confirmed applied
   (`position: sticky`, `scroll-margin-top: 64px`), but the browser tool used
   here could not drive page scroll, so the jump-to-section behaviour was not
   observed. Worth thirty seconds of a human scrolling the page.

6. **The statement says we link to LinkedIn. The site does not.** Found
   2026-09-22 when the founder asked where the social links were: there are
   **zero** clickable links to LinkedIn, or to any social network, across all 50
   built pages. `company.linkedin` exists and is used in exactly one place,
   `schema.ts`, which puts it in the Organization graph's `sameAs` array. That is
   machine-readable only: it tells a search engine the page belongs to Pixelette
   and gives a visitor nothing to click. It accounts for all 50 occurrences in
   the built HTML.

   The statement asserts the link twice, in the Social media section and again in
   the closing outbound-links paragraph: "We link to our LinkedIn page. That is
   an ordinary link: there is no social plug-in..."

   The direction of the error is benign — the statement describes MORE outbound
   contact with a social network than the site actually has, not less, so nobody
   is under-informed about tracking. It is still a factual statement in a legal
   document about something the site does not do, which is the same class as
   item 2 above.

   **RESOLVED the same day.** The founder chose to add the links, and named
   Facebook, Instagram and X as well. All four now render in the footer on 50 of
   50 pages, so both sentences in the statement are true as written: the site
   links to the LinkedIn page, as an ordinary link, with no plug-in and no
   social pixel. The Social media section needs no edit.

   The URLs were READ from the footer of the company's own live site rather
   than inferred from handle patterns, which is the rule `schema.ts` sets for
   its `sameAs` array. The LinkedIn value that read returned matched the one
   already in `company.ts` exactly, which is a useful check that the set is the
   real one. All four also joined `sameAs`.

   **One thing the statement may now understate.** It describes social media as
   "one outbound link to a LinkedIn page". There are four outbound links. The
   substance is unchanged — still ordinary links, still no plug-ins, still no
   pixels, so nothing about tracking has altered — but the wording counts one
   where there are four. A one-word fix whenever the statement is next opened;
   not urgent, because it understates rather than overstates.

   YouTube also exists on the live footer and was deliberately not added,
   because it was not asked for. Its URL is recorded in `company.ts`.

---

## E. One legal point, stated plainly

**This document has not had a legal review.** It is a legal document published
in the company's name, drafted to the UK GDPR Article 13/14 structure by an
engineer, not a solicitor. Everything factual in it was verified against the
implementation; that is a different thing from the drafting being legally
sufficient. It should be reviewed before it goes live.
