# Privacy Statement — what needs management confirmation before publication

Companion to the Privacy Statement at `/privacy`, effective 17 September 2026,
version 2.0. The statement was written under the founder's rule that it must
**describe reality, not aspiration**, and everything in it was checked against
the codebase, the database migration or a live browser measurement.

This is the list of things that **could not be verified from the codebase** and
therefore need a person to confirm before this is published.

---

## A. THE ONE THING THAT BLOCKS PUBLICATION

### The statement describes a website assistant. This build does not have one.

Founder decision of 17 September 2026 replaced the AI section with wording that
opens: *"We use third-party AI and technology providers to operate our website
assistant and related functionality."*

**There is no assistant in this codebase.** No chat widget, no conversational
interface, no model integration anywhere in `src/`. That was audited twice and
reported to the founder twice; the wording was issued with that knowledge, so it
is his decision and it has been implemented as given rather than argued with.

**The consequence, stated plainly:** as it stands, the Privacy Statement
describes functionality the site does not ship. A visitor reading it will look
for an assistant and not find one.

**→ Before this page goes live, one of these must be true:**

1. the assistant ships, and this section is checked against what it actually
   does — what it receives, whether conversations are retained, which provider;
   **or**
2. the assistant exists on another Pixelette property that this statement is
   also intended to cover, and the scope line at the top says so; **or**
3. the section is put back into the conditional form ("if we introduce an
   assistant…"), which is a one-paragraph change.

Related, and deliberately absent: **enquiry scoring**. The instruction says to
preserve the scoring explanation *"if that functionality remains part of the
website"*. It does not exist — the contact form asks four qualifying questions
and computes nothing — so no scoring text was written. If scoring is built, that
section is owed.

Also per instruction: **no AI provider is named**, and **no claim is made about
providers not using information for model training**. Both were removed.

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

**-> Confirm:** keep the names, or move to categories. Both the processors table
and the transfers paragraph must move together; naming them in one and not the
other is worse than either choice.

---

## C. Operational commitments the statement makes on the company's behalf

These are promises to a reader that only a person can stand behind.

| Commitment | Needs confirming |
|---|---|
| Enquiries deleted **24 months from last contact** | Carried from the previous statement. Confirm it is still the rule and that someone actually does it — the statement is deliberately honest that this is a rule we act on, not an automatic timer. |
| Client records kept for the engagement **plus six years** | Standard for legal and tax purposes; confirm it matches actual practice. |
| Rights requests answered **within one month** | Standard statutory period; confirm capacity to meet it. |
| Complaints acknowledged **within 30 days** | Carried from the previous statement. |
| **No statutory DPO appointed** | Confirm that remains correct. |
| Breach notification to data subjects and the ICO where required | Confirm there is a process. |

---

## D. Technical items still open

1. **Supabase region.** The statement does not name a hosting region, because
   the project does not exist yet. `DEPLOY-RUNBOOK` requires London. Confirm at
   creation — a Supabase region is fixed at creation and cannot be moved.
2. **The contact form is not connected.** The four environment variables are
   unset, so no enquiry has reached Supabase or Resend; both delivery legs in
   `src/lib/enquiries.ts` return `unconfigured` and `actions.ts` shows the
   visitor an honest refusal rather than accepting the submission. Whether the
   DEPLOYED site has those credentials cannot be read from the repository.

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
   email until delivery is live, and switch over when it is.
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

---

## E. One legal point, stated plainly

**This document has not had a legal review.** It is a legal document published
in the company's name, drafted to the UK GDPR Article 13/14 structure by an
engineer, not a solicitor. Everything factual in it was verified against the
implementation; that is a different thing from the drafting being legally
sufficient. It should be reviewed before it goes live.
