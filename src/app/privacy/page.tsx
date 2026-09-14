import Link from 'next/link';

import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company, contactEmail } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy',
  description:
    'What Pixelette Technologies collects through this website, why, and what rights you have under UK GDPR.',
  path: '/privacy',
});

/*
 * Scope of the 2026-09-07 revision: ONLY what a verified statutory provision
 * compels. Founder instruction was to change what the law requires and nothing
 * that is commercial judgment.
 *
 * Each section below names the provision it discharges. Every provision was
 * read at legislation.gov.uk on 2026-09-07 and is in force on that date.
 *
 *  - Art 13(1)(a)  controller identity AND contact details
 *  - Art 13(1)(c)  purposes and legal basis, for EVERY processing operation
 *                  (server request logs were previously undisclosed entirely)
 *  - Art 13(1)(d)  the legitimate interests pursued, where Art 6(1)(f) is relied on
 *  - Art 13(1)(e)  recipients OR CATEGORIES of recipients
 *  - Art 13(1)(f)  the fact of transfer out of the UK, and how to obtain the
 *                  safeguards. Previously absent altogether
 *  - Art 13(2)(a)  retention period OR THE CRITERIA used to determine it
 *  - Art 13(2)(b)  the rights, stated accurately. Art 20 portability does NOT
 *                  arise on Art 6(1)(f) processing; the page previously granted it
 *  - Art 13(2)(ca) the right to complain to the controller under DPA 2018 s.164A
 *                  (inserted by DUAA 2025; in force 19 June 2026)
 *  - Art 13(2)(d)  the right to complain to the Commissioner under s.165
 *  - Art 13(2)(e)  whether providing the data is a statutory or contractual
 *                  requirement, and the consequences of not providing it
 *  - DPA 2018 s.164A(2)-(4)  the controller MUST facilitate complaints, acknowledge
 *                  within 30 days, respond and report the outcome
 *
 * SECOND PASS, same day. The founder then widened the instruction from "only
 * what the law compels" to full legal protection across the site, so three
 * things left alone in the first pass were completed:
 *
 *  - the COOKIE section, closed from first-hand inspection of the served site
 *    and written against the PECR regime substituted on 5 February 2026 (see
 *    the note at that section);
 *  - the "last reviewed" date, now a real date because the page really was
 *    reviewed on it;
 *  - the ICO registration section, REMOVED rather than filled (see the note
 *    where it used to sit). Publishing it is not required, and the number held
 *    internally does not resolve on the ICO register.
 *
 * Art 13(1)(b), the DPO's contact details, applies only "where applicable" and
 * no designation is recorded, so it is still not asserted either way.
 *
 * ONE PLACEHOLDER REMAINS AND IS DELIBERATE: the per-provider transfer
 * mechanism. Art 13(1)(f) is discharged as to the FACT of transfer and the means
 * of obtaining the safeguards, which is what was missing entirely. Naming the
 * mechanism requires knowing what is actually in place with the hosting
 * provider, and that is not a fact this file may guess at.
 *
 * Where a required fact is genuinely unknown, the legally permitted alternative
 * is used: CRITERIA in place of a retention period, CATEGORIES in place of named
 * recipients. Nothing is invented to fill a gap.
 *
 * FIELD LIST RE-STATED 2026-09-11. "What this site collects" used to read: "The
 * contact form collects your name, company, work email address and the
 * description of the process you write. Nothing else is collected through it,
 * and none of the fields are optional-but-tracked." That was accurate until the
 * contact form was rewritten earlier the same day. "Which process is costing you
 * most?" was removed and replaced by the handoff’s four qualifying questions,
 * and Company became optional, so the disclosure was one form behind the thing it
 * describes. An Art 13(1)(c) enumeration has to be re-read every time the field
 * set moves; this one is now written from the code rather than from memory of it
 * — src/app/contact/ContactForm.tsx for the labels and requiredness, and
 * src/app/contact/actions.ts for what is validated and forwarded. As at this
 * date: REQUIRED are name, work email, and "What are you trying to build or
 * change?"; OPTIONAL are company, "What exists today?", "Is there a deadline?"
 * and "What would a successful result look like?". The hidden anti-spam control
 * is disclosed rather than left for a reader to find in the markup and wonder
 * about; a filled one causes the submission to be dropped, and it is never
 * forwarded.
 *
 * "Whether you have to give it to us" was amended in the same pass. Three of the
 * controls now carry `required`, so a paragraph saying nothing is required could
 * not stand unqualified: it now separates our operational minimum from a legal
 * one. Art 13(2)(e) itself is unchanged — the requirement is still neither
 * statutory nor contractual.
 *
 * Nothing else moved, and that was checked rather than assumed. The recipients,
 * retention and transfer sections were re-read against actions.ts on the same
 * date and already agree with it: the action POSTs the submission to an endpoint
 * read at runtime from the CONTACT_WEBHOOK_URL environment variable (variable
 * name only, never a value) and this site stores nothing itself, which is what
 * "the service that delivers contact form submissions to our inbox" already
 * describes in CATEGORY terms. No processor is named here because none is named
 * in the code either, and the transfer placeholder below stays open for the same
 * reason it was opened.
 *
 * REVIEW DATE CORRECTED 2026-09-11. What follows is a correction, not a
 * deletion.
 *
 * `lastReviewed` below used to read "7 September 2026", and it was still reading
 * it after the amendment recorded immediately above had gone live. That left a
 * published privacy notice telling a reader it was last reviewed on the 7th
 * while its Article 13(1)(c) enumeration had been rewritten on the 11th. The
 * date is the one thing a reader checks to decide whether the rest can be
 * trusted, so a notice whose own date predates its substance is inaccurate
 * about precisely the claim it is there to support.
 *
 * The value is a REVIEW date, not a modified date, and the difference decided
 * what it should say. `LegalPage` prints it as "Last reviewed:", and /terms
 * states the same thing in its own copy: "The date at the top is the date it was
 * last reviewed." A modified date only says the text changed; a review date says
 * someone read the document and confirmed it current on that day. A review date
 * may therefore sit LATER than the last edit, because reading a page and
 * changing nothing is still a review. It can never sit EARLIER than the content
 * it certifies. That ordering is the invariant that broke, which is why the date
 * moves rather than the wording.
 *
 * 11 September is asserted on evidence and is BOUNDED by what was actually done
 * that day: the field enumeration was re-read against ContactForm.tsx and
 * actions.ts and rewritten, "Whether you have to give it to us" was amended, and
 * the recipients, retention and transfer sections were re-read against actions.ts
 * and confirmed to still agree with it. The statutory provisions themselves were
 * read at legislation.gov.uk on 2026-09-07, as recorded at the top of this
 * comment, and this pass did not reopen them. Nothing here claims a fresh legal
 * sign-off; it claims a documented re-read of the page against the code it
 * describes, which is what "last reviewed" asserts.
 *
 * THE OPEN ITEM IS UNAFFECTED. The per-provider transfer mechanism below is
 * still a placeholder, still deliberate, and still raises the amber "not yet
 * finalised" notice through `containsPlaceholder` in LegalPage. Moving a review
 * date does not close a gap, and this one is not closed.
 *
 * ==========================================================================
 * REWRITTEN 2026-09-14, because the architecture underneath this notice moved
 * on the same day. What follows supersedes the 2026-09-11 note above; that
 * note is left standing because the reasoning it records is what changed.
 *
 * Commit a3745f0 replaced the contact form's delivery path. It used to POST to
 * `CONTACT_WEBHOOK_URL`, a variable that was never set in any environment, so
 * nothing was ever stored anywhere by anybody. It now inserts the enquiry into
 * a Supabase table (supabase/migrations/20260914120000_create_contact_enquiries.sql)
 * and sends a notification through Resend (src/lib/enquiries.ts).
 *
 * That falsified the sentence recorded above — "this site stores nothing
 * itself" — and with it the Article 13(1)(e) analysis that followed from it. A
 * RECIPIENT CATEGORY came into existence that the section had no entry for at
 * all: storage. The old copy named three categories — the platform that hosts
 * the site, the provider that carries our email, and the service that delivered
 * form submissions to our inbox — and not one of them is a database. That was
 * the real defect this pass had to close, and it was invisible from the
 * placeholder list.
 *
 * ---------------------------------------------------------------------------
 * THE TIMING PROBLEM, AND WHY THIS FILE ANSWERS IT THE WAY IT DOES
 *
 * The code is written; the accounts are not. `SUPABASE_URL`,
 * `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and `CONTACT_NOTIFICATION_FROM`
 * are all unset, so `deliverEnquiry` returns `unconfigured` for both legs and
 * the visitor is told the form is not connected and asked to email instead.
 * Nothing is stored anywhere. "We store your enquiry in our database" is
 * therefore NOT YET TRUE, and publishing it would be the same defect as an
 * analytics disclosure written for a tracker that was never armed.
 *
 * Three ways to write that. This file takes the third.
 *
 *  1. DESCRIBE THE DESIGNED PROCESSING IN THE PRESENT TENSE. Rejected outright.
 *     It publishes a description of processing that is not happening.
 *
 *  2. DERIVE THE COPY FROM THE ENVIRONMENT — read the four variables at render
 *     time and pick the wording from them. Rejected, and because it is the
 *     tempting option the reasons are written down rather than assumed:
 *
 *       (a) This page is STATICALLY PRERENDERED. A `process.env` read resolves
 *           when the build runs, so setting a variable in the hosting dashboard
 *           without redeploying would leave the published notice stale and
 *           CONFIDENTLY WRONG — worse than the problem it was meant to solve,
 *           and silent.
 *       (b) A legal notice that changes what it says with no diff and no date
 *           cannot be audited. A data subject asking what was disclosed, and
 *           when, would have no answer, and neither would we.
 *       (c) It turns a published page into an oracle for whether a credential
 *           is set.
 *       (d) The variables gate the DEPLOYMENT, not the design, and they can be
 *           half-set. The copy would have to handle four states and still would
 *           not have described the arrangement.
 *
 *  3. DESCRIBE THE ARRANGEMENT, AND STATE ITS CURRENT STATE AS A FACT THE
 *     READER CAN CHECK. What this file does. The notice sets out what happens
 *     to an enquiry, and then says plainly — in both places where a reader
 *     could otherwise form a false belief — that the delivery path is not
 *     connected yet and that submitting today returns an error instead of
 *     storing anything. That claim is FALSIFIABLE BY THE READER in a single
 *     submission, which is what makes it honest rather than hedged.
 *
 *     Disclosing ahead is also the safer direction of error. Switching this on
 *     is four variables pasted into a dashboard: no code review, no diff, no
 *     publication step. A notice that only becomes true when somebody remembers
 *     to rewrite it means personal data starts being stored in an overseas
 *     database with no published disclosure at all. Written this way, the only
 *     edit owed on switch-on day is one constant, and the failure mode of
 *     forgetting is that this page UNDERSTATES what we do — never overstates
 *     it.
 *
 * `DELIVERY_CONNECTED` below is that constant. Both branches are written out
 * rather than left to be composed under pressure on the day, and both were
 * rendered and read during verification rather than assumed to work.
 *
 * ITS TWIN IS IN src/app/security-and-data/page.tsx AND THE TWO MUST BE FLIPPED
 * TOGETHER. They are separate constants only because those two files were the
 * whole of the authorised scope for this change; one shared constant in
 * src/content/ is the right home and is recorded as owed.
 *
 * ---------------------------------------------------------------------------
 * RETENTION — the judgement in this pass that could most easily have become a
 * lie.
 *
 * The founder's decision is 24 months from LAST CONTACT, then deletion. Nothing
 * in the code deletes anything: the table has no TTL, there is no scheduled
 * job, there is no retention automation of any kind. Publishing "then deleted"
 * unqualified would commit the firm to a process that does not exist.
 *
 * So the period is published as A POLICY THE FIRM APPLIES, and the copy says in
 * terms that it is not a timer — because a reader who pictures automatic expiry
 * has been misled by omission just as surely as by a false sentence. Stating
 * that deletion is a human act is also what makes the promise auditable and
 * gives the reader a lever: if the date has passed, they can say so.
 *
 * The clock is stated explicitly, because 24 months from LAST CONTACT and 24
 * months from RECEIPT are different periods and a notice that does not say
 * which one it means has not disclosed a retention period at all.
 *
 * The automation remains OWED. It is an engineering item, not a disclosure: a
 * customer-facing notice is not the place to publish internal build state.
 *
 * One bound is deliberate. Work that comes out of an enquiry is excluded from
 * the 24 months, because without that exclusion this page would be publishing a
 * promise to destroy client engagement records at 24 months — a promise the
 * firm would not keep, which is the same defect pointing the other way.
 *
 * ---------------------------------------------------------------------------
 * TRANSFERS — the per-provider placeholder this file has carried since
 * 2026-09-07 is CLOSED.
 *
 * All three providers reach the same mechanism. Verified 2026-09-14 against
 * each provider's own published data processing agreement; the operative
 * wording of each is recorded here so the claim can be re-checked without
 * re-reading three documents:
 *
 *   Vercel   — "For data transfers from the United Kingdom, the UK IDTA will be
 *              deemed entered into (and incorporated into this Addendum by
 *              reference) together with the Standard Contractual Clauses."
 *   Supabase — a "UK Addendum" paragraph applying "to any transfer of Covered
 *              Data from Customer (as data exporter) to Supabase (as data
 *              importer)" where UK Data Protection Laws apply to the customer.
 *   Resend   — defines "UK SCCs" as "the EU SCCs, as amended by the UK
 *              Addendum", and states that "ex-UK Transfers are made pursuant to
 *              the UK SCCs, which are deemed entered into and incorporated into
 *              this DPA by reference".
 *
 * One route, so one paragraph. Three near-identical sentences would read as
 * three different answers.
 *
 * Three things the section deliberately does NOT say:
 *
 *   — It does not assert an ADEQUACY DECISION for any provider. None was
 *     verified, and Article 45A is not what any of the three relies on.
 *   — It does not claim we HOLD A SIGNED DOCUMENT. The whole point of all three
 *     quotations is that the terms are incorporated BY REFERENCE and nobody
 *     signs anything. "We will send you a copy of the safeguards" survives,
 *     because the clauses are published and pointing at them is what Article
 *     13(1)(f) asks for.
 *   — It does not sharpen the existing hedge "including in the United States"
 *     into "all three are established in the United States". The DPAs prove
 *     each is a data importer outside the UK; they do not prove where each is
 *     incorporated. Upgrading a safe hedge into an unverified fact is exactly
 *     the failure this file exists to avoid.
 *
 * ---------------------------------------------------------------------------
 * THE AMBER NOTICE ON THIS PAGE NOW STOPS FIRING, and that is correct rather
 * than a regression. `LegalPage.containsPlaceholder` raises it only while an
 * unfilled `<Placeholder>` remains, and the transfer mechanism was this page's
 * last one. `Placeholder` is therefore no longer imported here. The remaining
 * open item on this site — the hosting region — lives on /security-and-data,
 * is untouched, and still raises its own.
 *
 * `lastReviewed` moves to 14 September 2026, which is the date this content
 * changed. The invariant recorded on 2026-09-11 holds: a review date may sit
 * later than the last edit, never earlier than the content it certifies.
 */

/**
 * Is the contact form's delivery path actually connected?
 *
 * Set this to `true` only when all four of `SUPABASE_URL`,
 * `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and `CONTACT_NOTIFICATION_FROM`
 * are set in the production environment AND a real submission has been seen to
 * land. Variable names only; no value belongs in this repository.
 *
 * Flip the twin in src/app/security-and-data/page.tsx in the same commit.
 *
 * Typed `boolean` rather than left to infer the literal `false`, matching
 * `ANALYTICS_ENABLED` in src/lib/analytics.ts, so that the other branch is not
 * treated as dead code.
 */
const DELIVERY_CONNECTED: boolean = false;

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: '/privacy' },
        ])}
      />
      <LegalPage
        eyebrow="Privacy"
        title="What we collect, and what we do with it."
        intro="Short version: we use what you send us to reply to you. There is no marketing sequence, no mailing list, and nothing sold on."
        lastReviewed="14 September 2026"
        sections={[
          {
            heading: 'Who the controller is',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                {company.legalName}, registered in England and Wales under company number{' '}
                {company.crn}, at {company.addressLine}, is the data controller for personal data
                collected through this website. You can reach us at{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or through the{' '}
                <Link href="/contact">contact page</Link>.
              </p>
            ),
          },
          {
            heading: 'What this site collects',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  The contact form asks for your name and a work email address, so that there is
                  someone to reply to and somewhere to send the reply, and for a description of what
                  you are trying to build or change. It also asks four further things — your
                  company, what exists today, whether there is a deadline, and what a successful
                  result would look like — and none of those four are required. Leave one blank and
                  it is simply left out of what reaches us.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  One field on that form is hidden from you on purpose. It is a spam trap: people
                  never see it and automated scripts fill in every box they find, so if anything
                  arrives in it we drop the submission. It asks nothing about you and it records nothing about you.
                  Apart from that, the form collects nothing you have not typed into it, and no field
                  quietly tracks you.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  What happens to it next: your enquiry is saved as a record in a database we run,
                  and a copy is emailed to us so that a person sees it rather than a queue. Both of
                  those run on outside providers, and we name all of them further down this page.
                  Nothing else is done with it.
                </p>
                {DELIVERY_CONNECTED ? (
                  <p className="body" style={{ marginTop: 12 }}>
                    Both of those are connected and working today.
                  </p>
                ) : (
                  <p className="body" style={{ marginTop: 12 }}>
                    That is not switched on yet. The accounts behind it have not been set up, so at
                    the moment the form cannot deliver anything at all: send it and you will get a
                    message telling you it is not connected and asking you to email us instead, and
                    nothing you typed is kept anywhere. You can check that for yourself in one
                    submission. We have written this page for the arrangement as it will work rather
                    than adding it afterwards, because the day it is switched on should not also be
                    the day somebody has to remember to update the privacy notice.
                  </p>
                )}
                <p className="body" style={{ marginTop: 12 }}>
                  Separately, our hosting provider records the technical detail of every request made
                  to this site: the IP address it came from, the page requested, the browser used and
                  the time. That is how the site is served and kept secure. We do not use it to build
                  a profile of you, and we do not combine it with anything else.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  This site loads no third-party fonts, trackers or advertising scripts. Typefaces are
                  served from our own domain specifically so that visiting a page does not disclose
                  your IP address to a third party.
                </p>
              </>
            ),
          },
          {
            heading: 'Why we are allowed to hold it',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  We rely on legitimate interests, Article 6(1)(f) UK GDPR, for both. For the contact
                  form, the interest is replying to a business enquiry you chose to send us, and
                  keeping a record of what was asked and what we said for as long as that is of any
                  use to either of us. For the request records, it is delivering this site and
                  protecting it from abuse. In each case we have weighed that against your interests
                  and concluded that a reply you asked for, a record of it, and a site that stays up,
                  do not override them.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  You can object to either at any time, and we will stop unless we have compelling
                  legitimate grounds to continue.
                </p>
              </>
            ),
          },
          {
            heading: 'Whether you have to give it to us',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                No. Nothing on this site is a statutory or contractual requirement, and you are not
                obliged to provide any of it. The form itself will not send without a name, a work
                email address and a line about what you are trying to build or change, because
                without those there is no-one to reply to and nothing to reply about — but that is
                our own minimum, not a legal one, and everything else the form asks is optional. The
                only consequence of not completing it at all is that we cannot reply to you, so you
                may prefer to email us instead.
              </p>
            ),
          },
          {
            heading: 'How long we keep it',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  We keep an enquiry for 24 months and then delete it. The 24 months run from the
                  last time we were in contact with you about it, not from the day it arrived — so if
                  you write in and we exchange a few messages, the clock starts when that exchange
                  ends rather than when it began. If nothing follows your first message, it starts
                  there.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Deleting it is something we do, not something a machine does on a timer. We would
                  rather tell you that than leave you picturing an automatic expiry that does not
                  exist: the 24 months are a rule we hold ourselves to and act on. So if you think we
                  are still holding something past it, say so, and we will check and delete it.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  You do not have to wait for the 24 months either. Ask us to delete your enquiry at
                  any point and we will, and you do not have to give a reason.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  If an enquiry turns into a piece of work, the records of that work are kept under
                  the terms of that engagement rather than under this rule, which is about the
                  enquiry itself. Request records are kept for the rolling period our hosting
                  provider applies to them and are not separately retained by us.
                </p>
              </>
            ),
          },
          {
            heading: 'Who else handles it',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Your enquiry is handled by us, and by three outside providers, which we name rather
                  than describe: Vercel, which hosts and serves this website and holds the request
                  records described above; Supabase, which runs the database your enquiry is saved
                  into; and Resend, which sends us the notification that it has arrived. What each one
                  does, and what happens if we ever change that list, is set out on our{' '}
                  <Link href="/security-and-data">security and data page</Link>.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  {DELIVERY_CONNECTED
                    ? 'All three are in use today.'
                    : 'Vercel is in use today. Supabase and Resend are not connected yet, so nothing has reached either of them.'}{' '}
                  Once an enquiry reaches us, our own email is carried by our mailbox provider, in the
                  ordinary way that any business email is.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Each of them acts on our instructions and none of them may use your data for their
                  own purposes. We do not sell your data and we do not share it with anyone else. If
                  we ever add a provider or swap one out, we will publish it on that page and give 30
                  days&rsquo; notice before the change takes effect, so that you can object while it
                  is still a proposal.
                </p>
              </>
            ),
          },
          {
            heading: 'When it leaves the UK',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Those providers are established outside the United Kingdom, including in the United
                  States. Your data is therefore transferred out of the UK when it passes through
                  them.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  All three are protected in the same way, so there is one answer here rather than
                  three near-identical ones. Each provider&rsquo;s data processing terms bring in the
                  standard contractual clauses issued by the European Commission for transfers out of
                  the European Union, together with the UK Addendum that adapts those clauses for
                  transfers out of the United Kingdom. Those terms apply by reference: they are part
                  of the agreement that governs our use of each service and they take effect without
                  anyone signing a separate document. We are not relying on a UK adequacy decision for
                  any of them.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  You do not have to take our word for that. Each provider publishes those terms, so
                  if you email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> we will tell you
                  which country each provider is in, point you at where its clauses are published, and
                  send you a copy of the safeguards relied on.
                </p>
              </>
            ),
          },
          {
            /*
             * Closed from evidence 2026-09-07, not from assumption. The served
             * site was inspected directly: document.cookie empty, localStorage
             * and sessionStorage empty, no third-party script, stylesheet, image
             * or iframe, and every network request on the home, privacy and
             * terms pages first-party, fonts included.
             *
             * The second paragraph is written against the CURRENT rule, not the
             * old one. PECR reg. 6 was SUBSTITUTED on 5 February 2026 by the Data
             * (Use and Access) Act 2025 s.112(2) (S.I. 2026/82 reg. 2(w)), and a
             * new Schedule A1 was inserted carrying the consent gateway (para 2)
             * and the exceptions, including collection for statistical purposes
             * with a simple free means of objecting (para 5) and website
             * appearance or functionality (para 6). Anything drafted before that
             * date describes a regime that no longer exists.
             */
            heading: 'Cookies',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  This site sets no cookies. It stores nothing on your device, reads nothing from it,
                  and loads no third-party script that could. There is no consent banner because there
                  is nothing to consent to.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  If that ever changes we will say so here first. Under the rules that have applied
                  since 5 February 2026, some limited uses do not require your consent, such as
                  measuring how the site is used in order to improve it, or remembering a display
                  preference. They do still require us to tell you plainly what we are doing and to
                  give you a simple, free way of objecting. We would do both on this page before
                  setting anything.
                </p>
              </>
            ),
          },
          {
            heading: 'Your rights',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Under UK GDPR you have the right to ask us for a copy of the personal data we hold
                  about you, to have inaccurate data corrected, to have data erased, to have our use
                  of it restricted, and to object to our use of it.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Because we rely on legitimate interests rather than on your consent or on a
                  contract, the right to data portability under Article 20 does not apply to this
                  processing. We would rather tell you that than list a right you cannot use.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  To exercise any of these, email{' '}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or use the{' '}
                  <Link href="/contact">contact page</Link>. We will not charge you, and we will reply
                  within one month.
                </p>
              </>
            ),
          },
          {
            heading: 'If you want to complain to us',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  You have the right to complain to us directly if you think we have handled your
                  personal data wrongly. Tell us and we will deal with it, rather than sending you
                  elsewhere.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with &ldquo;Data
                  protection complaint&rdquo; in the subject line, or write to Data Protection
                  Complaints, {company.legalName}, {company.addressLine}. If you would rather not use
                  email or post, say so through the <Link href="/contact">contact page</Link> and we
                  will agree another route with you.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  We will acknowledge your complaint within 30 days of receiving it, look into it,
                  keep you posted on progress, and tell you the outcome. That is what section 164A of
                  the Data Protection Act 2018 requires of us, and we would do it anyway.
                </p>
              </>
            ),
          },
          {
            heading: 'If you want to complain to the regulator',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                You also have the right to complain to the Information Commissioner under section 165
                of the Data Protection Act 2018, at any time, at ico.org.uk, by telephone on 0303 123
                1113, or at Information Commissioner&rsquo;s Office, Wycliffe House, Water Lane,
                Wilmslow, Cheshire SK9 5AF. Complaining to us first is usually faster, and it does not
                affect your right to go to the Commissioner.
              </p>
            ),
          },
          /*
           * The "ICO registration" section was REMOVED on 2026-09-07 rather than
           * filled. Two reasons, in order of weight:
           *
           * 1. No provision requires a controller to publish its ICO registration
           *    number on its website. Paying the data protection fee under the
           *    Data Protection (Charges and Information) Regulations 2018 is a
           *    statutory obligation; advertising the number is not.
           *
           * 2. The number recorded internally for this company, ZB259622, DOES
           *    NOT RESOLVE on the ICO register of fee payers as at 2026-09-07.
           *    That negative is admissible: the register's reference search was
           *    first proved working against a known-good reference (ZC007349,
           *    which returned its entry), and only then did ZB259622 return no
           *    entry. Publishing a registration number that a reader cannot
           *    verify would be worse than publishing none, and is exactly the
           *    "verify link that does not resolve" defect flagged elsewhere on
           *    this site.
           *
           * The underlying registration question is a live matter for the
           * founder and is recorded outside this file. Nothing is asserted here
           * either way.
           */
        ]}
      />
    </>
  );
}
