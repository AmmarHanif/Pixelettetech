import { CertifiedHandoff, ClosingCta, VerificationTable } from '@/components/sections';
import {
  Eyebrow,
  FLink,
  JsonLd,
  Placeholder,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { certified, company } from '@/content/company';
import { DELIVERY_CONNECTED } from '@/content/launch';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Security and data',
  description:
    'Data handling, subprocessors, our AI governance position and what we do and do not publish about certification, given rather than sent on request.',
  path: '/security-and-data',
});

/*
 * Is the contact form's delivery path actually connected?
 *
 * IMPORTED FROM src/content/launch.ts, where the full reasoning lives. In
 * short: the code that writes an enquiry to Supabase and notifies through Resend
 * shipped on 2026-09-14, but `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
 * `RESEND_API_KEY` and `CONTACT_NOTIFICATION_FROM` are unset, so nothing has
 * reached either provider. A subprocessor register that lists a processor as
 * current when no data has ever flowed to it is the same defect as any other
 * unearned claim on this page.
 *
 * THE DEBT RECORDED HERE IS PAID, 2026-09-14. This used to be a local constant
 * with a twin in src/app/privacy/page.tsx, and this comment used to say the two
 * must be flipped together in one commit — which is an instruction to a human to
 * do something a compiler could guarantee. Flip one and miss the other, and this
 * page and /privacy contradict each other about whether personal data is being
 * stored. It is one constant now, in the file that already holds
 * `SITE_IN_DEVELOPMENT`, and it cannot half-flip.
 *
 * Both branches of this page are proven to render by
 * `verification/2026-09-14/delivery_connected_render.js`.
 */
const SUBPROCESSOR_STATE = DELIVERY_CONNECTED
  ? 'All three are in use today.'
  : 'Vercel is in use today; Supabase and Resend are not connected yet, so no enquiry data has reached either of them.';

/*
 * Residency, written on the founder's decision of 2026-09-14 and BEFORE the
 * Supabase project exists.
 *
 * The ordering is deliberate and it is his call: state the position, then create
 * the project in the region that matches it. That is better than the reverse. A
 * region picked under time pressure during setup, and then described afterwards,
 * is a decision made by whoever clicked fastest; a region published first is a
 * commitment the setup has to meet. The one thing it requires is that the setup
 * actually meets it — see the diary note at the end of this comment.
 *
 * WHY THIS IS THREE ANSWERS AND NOT ONE. "Where does our data sit" reads as a
 * single question and is three, and a single answer conceals the two it does not
 * cover. Static delivery, request processing and enquiry storage have different
 * answers here, and a reviewer who is told only the friendliest one has been
 * given a true sentence and a false impression.
 *
 * WHAT THIS PAGE WILL NOT SAY: that the arrangement is UK-only. The database can
 * be in London and the notification still cannot be, because Resend is
 * established in the United States — so an enquiry leaves the United Kingdom by
 * the email leg whatever region the database sits in. Writing "your data stays in
 * the UK" would be the kind of sentence that survives until the first reviewer
 * asks one more question. The transfer is disclosed here and the mechanism
 * covering it is set out on /privacy, which is where transfer mechanisms belong.
 *
 * The Vercel function region is stated as London because that is what
 * DEPLOY-RUNBOOK.md step 1 requires. That is a REQUIREMENT THIS SITE IMPOSES ON
 * ITS OWN DEPLOYMENT, not an observation read back from the dashboard — the
 * Vercel API returns 403 for this project (scope restriction recorded 2026-09-01)
 * so it cannot be verified from here. It is phrased as what we run on, which is
 * a commitment we control, rather than as a reading we have not taken.
 *
 * DIARY, and it is the whole risk of writing this first. Two settings must match
 * what is published above them: the Vercel function region must be London, and
 * the Supabase project must be created in London. A Supabase region is fixed at
 * creation and cannot be moved afterwards, so that one is answered once. If
 * either ends up elsewhere, this paragraph is wrong on the page a security
 * reviewer reads first, and the fix is to change the setting or change the text
 * the same day. Flipping DELIVERY_CONNECTED is the moment to check both.
 */
const RESIDENCY_STATE = DELIVERY_CONNECTED
  ? 'That is the arrangement in use today.'
  : 'The database and the notification path are not connected yet, so no enquiry has been stored or sent anywhere; the regions above are the ones they are being set up in.';

/*
 * Typed explicitly, and the reason is the commit that needed it.
 *
 * Filling the residency entry removed the LAST placeholder on this page, and
 * TypeScript promptly inferred the array element as `{ title, body: string }` and
 * rejected `p.placeholder` in the renderer below. The lazy fix is to delete the
 * placeholder branch, and that would quietly retire the mechanism this page's own
 * closing sentence promises: unfilled entries are shown, not hidden. The next
 * unanswered position would then render nothing, or someone would reinvent it.
 *
 * So the shape is declared rather than inferred. `body: string | null` with an
 * optional `placeholder` keeps the gap mechanism alive through a state where no
 * gap happens to exist, which is exactly when a capability gets deleted by
 * accident.
 */
type Position = {
  title: string;
  body: string | null;
  placeholder?: string;
};

const positions: Position[] = [
  {
    /*
     * Was: "We operate an ISO 27001:2022 certified information security
     * management system, and an ISO 9001:2015 quality management system, both
     * externally audited. Cyber Essentials Plus adds independently tested
     * technical controls."
     *
     * Withdrawn 2026-09-08. All three badges are HELD in the claims register
     * (claims.ts `iso-cyber-essentials-badges`): the handoff publishes a
     * certification "only with current certificate for exact legal entity,
     * scope and validity", and design/certificates/ is empty. "Externally
     * audited" made it worse by asserting a specific assurance activity.
     *
     * It becomes a visible placeholder rather than quieter prose because that
     * is this page's own stated policy, printed twelve lines below: unfilled
     * entries are shown rather than hidden, because a confident-sounding answer
     * we have not verified is worse to a security reviewer than a visible gap.
     * The page now applies that rule to itself.
     */
    /*
     * FILLED 2026-09-14, on evidence, and the placeholder above it is gone
     * rather than softened.
     *
     * The placeholder set its own release condition on 8 September 2026:
     * "published once the certificate number, issuing body and expiry date can
     * be shown for the exact legal entity". All three are below, plus the
     * scope, the issue date, the recertification date and the Statement of
     * Applicability version. The exact legal entity is named in full with the
     * registered office, because "for the exact legal entity" was the precise
     * thing the placeholder asked for and a company name without an address is
     * how a reviewer ends up checking the wrong Pixelette.
     *
     * Four things are deliberately absent and must not creep back in:
     *
     *  1. ANY CLAIM ABOUT WHAT THE ACCREDITATION IS RECOGNISED BY. The
     *     certificate says the issuing body is accredited by the United
     *     Accreditation Foundation; this paragraph says exactly that and stops.
     *     The founder has been told UAF's standing under the arrangements that
     *     followed the closure of the International Accreditation Forum is
     *     unverified, so nothing here says the accreditation is recognised,
     *     internationally recognised, or recognised by any scheme.
     *  2. A SURVEILLANCE SCHEDULE. The certificate supplies three dates and no
     *     audit programme. The three dates are printed and described; no annual
     *     audit, no surveillance interval and no maintenance condition is
     *     asserted, because none was supplied. Describing the dates is not the
     *     same as inventing the programme behind them.
     *  3. "EXTERNALLY AUDITED", the adjective the withdrawn version used. It
     *     asserts an activity this project cannot describe, and the certificate
     *     is the evidence without it.
     *  4. CYBER ESSENTIALS PLUS, in any form, including a denial. Still no
     *     certificate; still held (claims.ts `cyber-essentials-plus-certificate`).
     *     It is not mentioned even to say it is not published, because this
     *     array feeds nothing but human copy while the FAQ below feeds FAQPage
     *     JSON-LD, and ADR-0016's rule for a held claim is that it is dropped
     *     silently rather than shown as a near-miss. The place that instruction
     *     belongs is public/llms.txt, which tells crawlers not to attribute it.
     *
     * THE SCOPE IS QUOTED, NOT EDITED. It names AR/VR solutions and quantum
     * computing systems, which this site does not sell. It is introduced as
     * what the certificate covers and closed with a sentence saying in terms
     * that it is the certificate's wording rather than a menu, because a scope
     * trimmed to match the seller is not the certificate's scope and a reviewer
     * comparing the site to the document would find the edit.
     *
     * DIARY: this certificate expires 11 March 2027. The paragraph prints that
     * date, so no reader is left with a bare badge — but on or before that date
     * this is re-evidenced from the current certificate or it comes down.
     */
    title: 'Information security management',
    body:
      'Our information security management system is certified to ISO/IEC 27001:2022 under certificate AMER800409, held by Pixelette Technologies Ltd of 77 Fulham Palace Road, London W6 8JA. It was issued on 12 March 2026 by Americo Quality Standards Registech Pvt. Ltd, which the certificate records as accredited by the United Accreditation Foundation. It carries two further dates and we publish both, because either one alone would mislead you: the certificate expires on 11 March 2027, and its recertification date is 11 March 2029 — an expiry one year after issue, inside a cycle running three years from it. We are not publishing an audit schedule, because the certificate does not state one and we will not describe a programme we cannot show you. The certified scope, in the certificate\'s own words, is the “Information security management system for the design, development, deployment and support of AI solutions, blockchain applications, AR/VR solutions, web platforms, mobile applications, custom software products, UI/UX design services and quantum computing systems”. That is the scope as written on the certificate, quoted rather than trimmed to match this site, and it is not a list of what we sell. The Statement of Applicability is version 1.0, dated 15 January 2026. We do not publish the certificate document itself — ask and we will send the detail to your reviewer directly.',
  },
  {
    title: 'Where your data sits',
    body:
      'Three answers, because this is three questions and one answer would hide two of them. The site itself is static and served from a global content delivery network, so it is delivered from wherever you are — and that delivery carries no personal data at all, because there is none in a page. Personal data is collected in exactly one place, the contact form, and the only server-side code we run is the function that handles it. That function runs in London, so the United Kingdom is where an enquiry is processed. The enquiry is then written to our database, which is hosted in the United Kingdom, in the London region; a database region is fixed when the project is created and cannot be moved afterwards, so this is settled once rather than reviewed. The notification that tells us an enquiry has arrived is a different matter and we will not blur it: it is sent through Resend, which is established in the United States, so that copy of the enquiry leaves the United Kingdom. This arrangement is therefore not UK-only, and we do not describe it as such — the transfer mechanism that covers it is set out in our privacy notice. ' +
      RESIDENCY_STATE,
  },
  {
    /*
     * FILLED 2026-09-14. The list is read out of the code, not recalled, and
     * each name was traced to the call that reaches it:
     *
     *   Vercel   — the hosting platform. DEPENDENCIES.md names it as "the
     *              platform already hosting this site"; it therefore holds the
     *              server request logs the privacy notice describes.
     *   Supabase — src/lib/enquiries.ts `storeEnquiry` POSTs to
     *              `${SUPABASE_URL}/rest/v1/contact_enquiries`.
     *   Resend   — src/lib/enquiries.ts `sendNotification` POSTs to
     *              https://api.resend.com/emails.
     *
     * The negatives were checked rather than assumed, because "nothing else" is
     * the load-bearing half of a subprocessor register:
     *
     *   — Analytics is NOT armed. `ANALYTICS_ENABLED` in src/lib/analytics.ts is
     *     `false`, and src/app/layout.tsx renders `<Analytics />` and
     *     `<AnalyticsEvents />` only inside that gate, so no script is requested
     *     and no beacon is sent. The component is present in the codebase and
     *     switched off, and the copy says exactly that rather than "no
     *     analytics", because a reviewer reading package.json will find
     *     `@vercel/analytics` and is owed the precise answer.
     *   — Fonts are SELF-HOSTED. src/app/layout.tsx uses `next/font/google`,
     *     which downloads the files at build time and serves them from this
     *     origin. A grep across src/ finds no `fonts.googleapis.com`,
     *     `fonts.gstatic.com` or `@font-face` pointing off-domain.
     *   — No third-party script of any kind: no `next/script`, no tag manager,
     *     no embed.
     *
     * NOT LISTED, and deliberately: the mailbox provider that carries our own
     * email once an enquiry reaches us. The privacy notice discloses it as a
     * CATEGORY, which Article 13(1)(e) permits. It is absent here because this
     * register is scoped to the processors THIS WEBSITE sends data to, and
     * naming a provider that cannot be determined from this repository would be
     * inventing a fact. Identifying it is an open item for the founder, not a
     * gap this file may fill.
     *
     * THE 30 DAYS ARE THE FOUNDER'S DECISION. The copy spends its words on what
     * the period is FOR rather than on the number, because notice that only
     * informs is worth very little: the point a reader has to take away is that
     * the window exists so an objection can be made while the change is still a
     * proposal.
     */
    title: 'Subprocessors',
    body:
      'Three, and we name them rather than describe them. Vercel, Inc. hosts and serves this site, which also makes it the holder of the server request logs. Supabase provides the database that contact form enquiries are written to. Resend sends the notification email that tells us an enquiry has arrived. ' +
      SUBPROCESSOR_STATE +
      ' That is the whole list, and it was read out of the code rather than from memory. There is no third-party analytics or tracking: the hosting platform’s own analytics component sits in the codebase behind a single flag that is switched off, so no script is requested and no analytics provider receives anything. There are no advertising or tag-manager scripts, no embedded third-party content and no third-party font service — the typefaces are compiled into the build and served from this domain, so loading a page here does not disclose your visit to anybody else. Before we add a processor or replace one, we publish it here and then wait 30 days before the change takes effect. The wait is the point of the notice, not a formality: it is there so that you can object while the change is still a proposal, rather than be told afterwards that your data has already moved. Object inside those 30 days and we will deal with it before we proceed, and we will not pass your data to the new provider while it is unresolved. If you would rather we deleted what we hold than accept the change, ask and we will.',
  },
  {
    /*
     * FILLED 2026-09-14 with the founder's decision: 24 months from LAST
     * CONTACT, then deletion.
     *
     * THE DELETION SENTENCE IS THE WHOLE DIFFICULTY, so it is written down.
     * Nothing in this repository deletes anything. The table created by
     * supabase/migrations/20260914120000_create_contact_enquiries.sql has no
     * TTL and no expiry; there is no scheduled job, no cron, no retention
     * automation anywhere. An unqualified "then deleted" would commit the firm
     * to a process that does not exist, and it would read to a security
     * reviewer as an automated control they could rely on.
     *
     * So the period is published as A POLICY THE FIRM APPLIES, and the copy
     * states the mechanism in terms: it is not a timer in the database. That is
     * the honest answer, it is the answer a reviewer would extract in due
     * diligence anyway, and a false claim of automated deletion is exactly the
     * kind of thing that fails a diligence review rather than passing one. The
     * automation is OWED as an engineering item.
     *
     * THE CLOCK IS NAMED. 24 months from last contact and 24 months from
     * receipt are different periods; a schedule that does not say which it means
     * has not published a period at all.
     *
     * SCOPED TO ENQUIRIES HOWEVER THEY ARRIVE, which is also what makes it true
     * TODAY rather than only after the database exists: the policy is about
     * enquiries, not about a table. Work arising from an enquiry is excluded,
     * because otherwise this page would publish a promise to destroy client
     * engagement records at 24 months — a promise the firm would not keep.
     *
     * AGREES WITH /privacy. That page previously stated CRITERIA rather than a
     * period, which Article 13(2)(a) permits; it now states this same period,
     * this same clock and this same mechanism. One page saying "criteria" while
     * the other says "24 months" was the defect to avoid.
     */
    title: 'Retention and deletion',
    body: 'Enquiries are kept for 24 months and then deleted, whether they reached us through the contact form or by email, and the period covers the correspondence that follows as well as the first message. The 24 months run from our last contact with you about that enquiry, not from the date it arrived, so an enquiry that turns into a conversation is measured from the end of the conversation rather than the start. Anyone can ask us to delete theirs sooner, at any point, and we will. The mechanism matters and a reviewer should not have to guess at it: this is a policy we apply, not a timer in the database. There is no expiry on the table and no scheduled job that empties it, so deletion here is a deliberate act on our side rather than something that happens whether or not anybody does it. Work that comes out of an enquiry is retained under that engagement’s own terms rather than under this period. Server request logs sit with the hosting platform on its own rolling schedule and are not separately retained by us.',
  },
  {
    title: 'AI-specific handling',
    body: 'Client data is not used to train third-party foundation models. Where a model processes client data, the processing route, the retention posture of the provider and the entitlement boundary are documented per engagement and form part of the evaluation record.',
  },
  {
    title: 'Incident response',
    body: 'Defined severities with a named responder, a rollback procedure and a written post-incident note that goes into your audit trail. SEV-1 within one hour, SEV-2 within four hours, SEV-3 by the next working day.',
  },
];

const faqs = [
  {
    q: 'Does Pixelette Technologies use client data to train models?',
    a: 'No. Client data is not used to train third-party foundation models. Where a model processes client data, the processing route, the provider’s retention posture and the entitlement boundary are documented per engagement and form part of the evaluation record.',
  },
  /*
   * Was: "Which security certifications does Pixelette Technologies hold? —
   * ISO 9001:2015, ISO 27001:2022 and Cyber Essentials Plus, all externally
   * audited and independently verifiable. ISO/IEC 42001 ... delivered by
   * Pixelette Certified..."
   *
   * This one mattered more than the card above it, because `faqSchema` puts
   * every answer on this array into JSON-LD. A held claim in structured data
   * outlives its removal from the page: an answer engine goes on repeating it
   * long after the human-readable site stopped saying it. Rewritten 2026-09-08
   * to the claims register and the handoff's ACCREDITATION-SAFE RULE, which
   * also forbids saying a group company "delivers" a standard or audits anyone.
   */
  /*
   * REWRITTEN 2026-09-14. The answer opened "None at present", which stopped
   * being true the moment the paragraph above published, and this array is the
   * one on this page that is ALSO emitted as FAQPage JSON-LD. A stale answer
   * here is not a stale sentence — it is a contradiction handed to answer
   * engines in machine-readable form, which is the channel this project has
   * twice recorded as the hardest to retract.
   *
   * Two things it does that the human copy above does not have to:
   *
   *  - It answers the question that was ASKED. "Which SECURITY certifications"
   *    is answered with the 27001 certificate. ISO 9001 is named because it is
   *    published elsewhere on the site and a reviewer will see it, and it is
   *    named with the words "quality management" and an explicit statement that
   *    we do not offer it as security assurance. A quality certificate allowed
   *    to stand as an answer to a security question is a borrowed credential.
   *  - It closes the set. "Nothing else is published" is what makes this answer
   *    safe to hand to a crawler: it forecloses every badge this company has
   *    ever had attributed to it without naming any of them, so no held claim
   *    is put into structured data even inside a negation. An answer engine
   *    that drops a "no" from a sentence cannot drop one that is not there.
   */
  {
    q: 'Which security certifications does Pixelette Technologies publish?',
    a: 'One. ISO/IEC 27001:2022, certificate AMER800409, held by Pixelette Technologies Ltd and issued on 12 March 2026 by Americo Quality Standards Registech Pvt. Ltd, which the certificate records as accredited by the United Accreditation Foundation. The certificate expires on 11 March 2027 and its recertification date is 11 March 2029. We also publish ISO 9001, certificate AMER37046 from the same body, but that is a quality management standard and we do not offer it as security assurance. Nothing else is published: a certification appears on this site only with a current certificate for the exact legal entity, its scope and its validity, which is why the number, the issuing body and the dates are given here rather than a badge. The certificate documents stay internal — ask and we will send the detail to your reviewer. Where a programme needs formal governance, certification readiness, privacy or security-assurance support, Pixelette Certified can help scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment.',
  },
];

export default function SecurityDataPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Security & data', path: '/security-and-data' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Security & data</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            What a reviewer asks for, published before they ask.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Security review delays half of all enterprise deals. Rather than answer the same
            questionnaire forty times, we publish our position and let you check it. We also do not
            publish a badge you cannot check.
          </p>
          <SourceNote>G2 Buyer Behavior Report, July 2026</SourceNote>
        </div>
      </div>

      {/*
        The section states its own position in copy, then renders the table.
        Both halves matter, and the copy is not decoration: `certifications` is
        empty until a row carries a certificate for the exact legal entity, so
        a reviewer who arrives looking for a badge wall needs to be told why
        there is not one, in the same place they looked. Written to read
        correctly in both states — it describes the standard the table is held
        to, not the number of rows in it, so it stays true on the day the first
        row publishes. The table's own empty state is handled inside
        `VerificationTable`, not duplicated here.
      */}
      <Section labelledBy="verify-heading">
        <Eyebrow>Verification</Eyebrow>
        <h2 className="h2" id="verify-heading" style={{ marginTop: 18 }}>
          What we publish about certification, and what we hold back.
        </h2>
        {/*
          Written on 8 September 2026 to read correctly in both states — "it
          describes the standard the table is held to, not the number of rows in
          it, so it stays true on the day the first row publishes". That day was
          14 September 2026 and the sentence did survive it, which is the point
          of recording the intent. One clause did not and is replaced: "nothing
          is asserted either way in the meantime" described an empty table, and
          the table is no longer empty. The standard it states is unchanged.
        */}
        <p className="body" style={{ marginTop: 20, maxWidth: '68ch' }}>
          A certification appears on this site only with a current certificate for{' '}
          {company.legalName} — its scope, and its validity — set out so that you can check it
          rather than take it. Anything that does not clear that bar is held back rather than
          softened. What has cleared it is below, with the certificate number, the issuing body and
          the dates; about anything not listed, nothing is asserted either way.
        </p>
        <p style={{ marginTop: 16 }}>
          <FLink href="/certifications">
            The full register, standard by standard, and what would release each one
          </FLink>
        </p>
        {/* `withHeading={false}` zeroes the table's own top margin, on the
            assumption that it is the first thing in its section. It no longer
            is, so the spacing is restored here rather than by turning the
            component's heading back on and printing a second one. */}
        <div style={{ marginTop: 34 }}>
          <VerificationTable withHeading={false} />
        </div>
      </Section>

      <Section labelledBy="positions-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead title="How we handle your data" id="positions-heading" />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {positions.map(p => (
            <div className="card" key={p.title}>
              <h3 className="h4">{p.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {p.body ?? <Placeholder>{p.placeholder}</Placeholder>}
              </p>
            </div>
          ))}
        </div>
        {/*
          Written for both states, because on 2026-09-14 the last gap on this page
          was filled and the previous wording — "Unfilled entries are shown rather
          than hidden" — started describing entries that no longer exist. A
          reviewer would hunt for the amber gaps it advertises and find none, which
          makes the one sentence on the page whose job is to establish candour read
          as boilerplate. The policy is the same in both branches; only the tense
          moves.
        */}
        <p className="small" style={{ marginTop: 26, fontStyle: 'italic' }}>
          {positions.some(p => p.body === null)
            ? 'Unfilled entries are shown rather than hidden. This page is read by security reviewers, and a confident-sounding answer we have not verified is worse to them than a visible gap.'
            : 'Every entry above is answered. Where one is not, we show the gap rather than hide it — this page is read by security reviewers, and a confident-sounding answer we have not verified is worse to them than a visible gap.'}
        </p>
      </Section>

      <Section labelledBy="gov-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            {/*
              Was: title "We build it. We do not certify it.", and a body saying
              "Formal AI governance, ISO/IEC 42001 and audit are delivered by
              Pixelette Certified, a separate practice in the same group with
              its own lead auditors."

              Both breached the handoff's ACCREDITATION-SAFE RULE, which forbids
              saying a Pixelette company holds an accreditation, issues a
              certificate, performs an independent audit or has a named
              certified-practice status until the exact legal entity and status
              are verified (claims.ts `certified-cross-sell`). "We do not
              certify it" says Certified does; "its own lead auditors" is a
              named certified-practice status; "audit ... delivered by" is an
              independent-audit claim.

              The title is now the handoff's own section 12 replacement line,
              read from company.ts so it cannot drift from the other places it
              appears. The separation-of-duties point — the part that actually
              sells — is kept: it just says we will not assure our own build,
              rather than naming who audits.
            */}
            <SectionHead eyebrow="Governance" id="gov-heading" title={certified.positioningLine} />
            <p className="body" style={{ marginTop: 20 }}>
              {company.name} engineers and runs the system. Where a programme needs formal
              governance, certification readiness, privacy or security-assurance support,{' '}
              {certified.name} can help scope the requirement, coordinate appropriately credentialed
              specialists and support the route to independent assessment. Independent assurance
              stays independent: we will not assure our own build, and we will confirm that in
              writing if your procurement team asks.
            </p>
          </div>
          <CertifiedHandoff variant="compact" />
        </div>
      </Section>

      <ClosingCta title="Need something this page does not answer?">
        Send the questionnaire. If the answer is not published yet, we will tell you what it is and
        then publish it.
      </ClosingCta>
    </>
  );
}
