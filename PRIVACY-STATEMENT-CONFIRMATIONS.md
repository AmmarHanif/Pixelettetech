# Privacy Statement — what needs management confirmation before publication

Companion to the Privacy Statement at `/privacy`, effective 17 September 2026,
version 2.0. The statement was written under the founder's rule that it must
**describe reality, not aspiration**, and everything in it was checked against
the codebase, the database migration or a live browser measurement.

This is the list of things that **could not be verified from the codebase** and
therefore need a person to confirm before this is published.

---

## A. Things the brief asked for that DO NOT EXIST on this site

The brief specifies sections on an AI assistant, enquiry scoring, recruitment
and subscriptions. **None of them exist in this codebase**, so the statement
says so rather than describing them.

| Asked for | What the audit found |
|---|---|
| Website AI assistant / LLM | **None.** No chat widget, assistant or model integration anywhere in `src/`. The only matches for "assistant" are marketing copy about AI we build for clients. |
| AI conversation retention | **Not applicable** — there are no conversations. |
| AI provider, and model-training terms | **No provider.** The brief says not to claim anything about training without verifying the contract; there is no contract because there is no provider. |
| Enquiry scoring / prioritisation / profiling | **None.** The form asks four qualifying *questions*; no score is computed, stored or acted on, and `contact_enquiries` has no score column. |
| Recruitment via the website | **No careers route** and no application form. |
| Subscriptions / mailing list | **None.** The Subscribe CTA was removed on 16 September 2026 because nothing was wired up behind it. |
| Events / webinars | **None.** |

**→ Confirm:** if any of these exist *elsewhere* — on the live WordPress site at
pixelettetech.com, on another Group property, or as something about to launch —
the statement needs a section for it and I need the details. As written, it
describes this website only.

---

## B. Claims that are commercially or contractually true or false, and I cannot tell

### 1. Outbound marketing — flagged in the brief, and it matters

The brief specifically asks whether "We do not send marketing to people who have
not asked for it" would contradict actual business practice.

**The statement does not make that claim.** What it says is scoped to this
website: no mailing list, no subscription, no automated marketing sequence, and
"replying to your enquiry is the only thing we do with it." That is verified
true of the website.

**→ Confirm:** does Pixelette Technologies conduct B2B outbound marketing —
LinkedIn outreach, cold email, purchased or scraped contact data? If so, the
statement needs a section covering it: the lawful basis (normally legitimate
interests for B2B), where the data comes from, and the objection route. Leaving
it silent is defensible for a *website* statement, but not if a recipient of
outbound marketing is pointed at this page.

### 2. Provider roles and contractual terms

The statement says the three providers are "engaged to process this information
for us, for the purpose described, under that provider's data processing terms."

**It deliberately does NOT say** — as the previous version did — that each acts
solely on our instructions and may not use the data for their own purposes.
That is a **contractual** position, not a code fact, and the brief says not to
preserve it unless it is supported.

**→ Confirm:** that a DPA is actually in force with **Vercel**, **Supabase** and
**Resend**; that each is engaged as a *processor* rather than an independent
controller for this purpose; and that the transfer mechanism named (SCCs plus UK
Addendum) is the one that actually applies to each.

### 3. The mailbox provider

The statement mentions "our mailbox provider" without naming it, because it
appears nowhere in the codebase.

**→ Confirm:** who carries Pixelette email, where it is hosted, and whether it
should be named alongside the other three.

### 4. Data sources

The statement says: "For this website, everything we hold about you came from
you. We do not buy personal information for it, and we do not enrich what you
send us from external databases or data brokers." The scoping to *this website*
is deliberate.

**→ Confirm:** whether the business more broadly acquires contact data from
Sales Navigator, lead vendors, scraped sources or enrichment tools. If it does,
the wording needs widening honestly rather than left to imply otherwise.

### 5. Client-work processor position

Section "Work we do for clients" states the client is controller and Pixelette
is processor, acting on documented instructions under the DPA in the contract.

**→ Confirm:** that client contracts actually contain those processor terms. The
distinction is correct in principle and was in the previous statement, but I
cannot see a contract.

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
2. **The contact form is not connected.** `DELIVERY_CONNECTED` is `false` and
   the four environment variables are unset, so no enquiry has reached Supabase
   or Resend. The statement describes the arrangement rather than claiming
   traffic, so it is accurate either way — but it describes processing that has
   not yet happened.
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
