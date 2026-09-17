import Link from 'next/link';

import { JsonLd } from '@/components/ui';
import { company, contactEmail } from '@/content/company';
import { ANALYTICS_ENABLED } from '@/lib/analytics';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy at Pixelette',
  description:
    'How Pixelette Technologies uses, protects and manages personal information across our technology, services and business.',
  path: '/privacy',
});

/*
 * THE PRIVACY STATEMENT. Rewritten 2026-09-17 to the founder's structure, and
 * governed by the closing rule of his brief: "The policy must describe reality,
 * not aspiration. Verify every factual statement against the website/code/
 * configuration before preserving it."
 *
 * SUPERSEDED IN PART, 2026-09-17, by three FINAL DRAFTING DECISIONS from the
 * founder. The audit below still records what the codebase contains, and it has
 * not changed — but the page no longer describes only that, and the difference
 * is his decision rather than an oversight:
 *
 *   - RECRUITMENT AND EVENTS are now covered in conditional terms ("if you
 *     apply", "if you register"). That is accurate whether or not a programme
 *     exists, and his instruction forbids implying that one does.
 *   - BUSINESS DEVELOPMENT wording now permits business contact information
 *     obtained from public, professional or business sources. The previous
 *     draft's "everything we hold about you came from you" was removed on his
 *     explicit instruction. DO NOT REINSTATE IT.
 *   - THE AI SECTION NOW DESCRIBES A WEBSITE ASSISTANT. **There is no assistant
 *     in this codebase** — see the audit below, which was run twice and reported
 *     to him twice. He issued the wording knowing that. The statement therefore
 *     describes functionality this build does not ship, and must not go live
 *     before the assistant does. Recorded in
 *     PRIVACY-STATEMENT-CONFIRMATIONS.md as the first item.
 *
 * His instruction was not to reopen these "unless required to remove a direct
 * contradiction elsewhere in the document", so the old absolute statements were
 * removed rather than argued with.
 *
 * THE AUDIT AS RUN. The brief originally asked for sections on an AI assistant,
 * enquiry scoring, recruitment and subscriptions. AT THE TIME OF THE AUDIT NONE
 * OF THOSE EXISTED ON THIS SITE:
 *
 *   - No chat widget, assistant or LLM integration anywhere in `src/`. The only
 *     matches for "assistant" are marketing copy about AI we BUILD for clients.
 *   - No enquiry scoring. The form asks four qualifying QUESTIONS; no score is
 *     computed, stored or acted on, and `contact_enquiries` has no score column.
 *   - No careers or recruitment route.
 *   - No mailing list. The Subscribe CTA was removed on 2026-09-16 precisely
 *     because nothing was wired up behind it.
 *   - No events or webinars.
 *   - Social media is one outbound link to a LinkedIn page. No embeds, no
 *     social pixels.
 *
 * The AI section is KEPT, because the founder is right that it is the section a
 * reader of an AI company's privacy statement looks for. It says what is true:
 * this website runs no assistant and makes no automated decisions. A section
 * describing a system that does not exist is the exact failure the brief's
 * closing rule names.
 *
 * VERIFIED IN CODE BEFORE BEING WRITTEN HERE:
 *   - Storage and analytics: browser-measured. No cookies, no third-party
 *     requests. One first-party key, `pt-analytics`. verification/2026-09-17/.
 *   - Enquiry record: supabase/migrations/20260914120000 — name, company,
 *     email, four answers, timestamp, source. Its own comment reads: "No IP
 *     address, no user agent, no fingerprint of any kind."
 *   - Providers: exactly three — Supabase and Resend by env var, Vercel as
 *     host. No others anywhere in the repository.
 *   - Retention: 24 months from last contact, carried from the previous
 *     statement together with its admission that deletion is a rule we act on
 *     rather than an automatic timer. That honesty is preserved deliberately.
 *
 * DELIBERATELY NOT ASSERTED, because the brief says not to preserve a claim
 * merely because it appeared before:
 *   - That every provider acts solely on our instructions and may not use the
 *     data for its own purposes. That is a CONTRACTUAL position, not a code
 *     fact. The previous statement asserted it flatly; this one states the role
 *     they are engaged in and offers the terms, which is true either way.
 *   - Any absolute claim about outbound marketing. What is claimed is scoped to
 *     this website, which sends none. Whether the business markets outbound
 *     elsewhere is not knowable from here and is flagged to the founder.
 *   - Anything about AI providers and model training. There is no AI provider.
 *
 * Recorded as ADR-0038, which also names the shelf life of the scoping choice:
 * the statement is accurate about the WEBSITE and silent about the BUSINESS,
 * and the first outbound marketing campaign that points at this page
 * invalidates that silence.
 *
 * LAYOUT. Nothing is collapsed behind a control. The brief permits expandable
 * subsections on mobile but makes "the complete legal information must remain
 * readily accessible" the overriding constraint, and collapsed legal text
 * defeats find-in-page. The sticky section nav does the wayfinding instead and
 * needs no JavaScript.
 */

const EFFECTIVE_DATE = '17 September 2026';
const VERSION = '2.0';

const NAV = [
  { href: '#your-information', label: 'Your information' },
  { href: '#ai-automation', label: 'AI & automation' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#sharing-security', label: 'Sharing & security' },
  { href: '#your-rights', label: 'Your rights' },
  { href: '#contact', label: 'Contact' },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy at Pixelette', path: '/privacy' },
        ])}
      />

      <div className="hero-glow" style={{ padding: '72px 0 40px' }}>
        <div className="wrap">
          <h1 className="h1p" style={{ maxWidth: '18ch' }}>
            Privacy at Pixelette
          </h1>
          <p className="lead" style={{ marginTop: 20, maxWidth: '54ch' }}>
            How we use, protect and manage personal information across our technology, services and
            business.
          </p>
          <p className="small" style={{ marginTop: 22 }}>
            Privacy Statement · Effective {EFFECTIVE_DATE} · Version {VERSION}
          </p>
        </div>
      </div>

      <nav className="privacy-nav" aria-label="Privacy statement sections">
        <div className="wrap">
          <ul>
            {NAV.map(item => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="wrap">
        <div className="privacy-doc">
        <section id="your-information">
          <h2 className="h3">About this statement, and about us</h2>
          <p className="body">
            This statement explains what {company.name} does with personal information: what we
            collect, why we are allowed to hold it, who else touches it, how long we keep it and
            what you can require of us. It covers this website and the ordinary course of dealing
            with us as a client, supplier or contact.
          </p>
          <p className="body">
            {company.legalName} is the controller for the information described here. We are
            registered in {company.registeredIn} at Companies House under company number{' '}
            {company.crn}, with our registered office at {company.addressLine}. Our VAT registration
            number is {company.vat}.
          </p>
          <p className="body">
            For anything in this statement, or about your information generally, write to{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. A person reads that address.
          </p>
          <p className="body">
            One thing this statement does not cover: where we build or run a system for a client and
            handle information on their behalf, the client decides what happens to it and we act on
            their instructions. That arrangement is described in{' '}
            <a href="#for-clients">work we do for clients</a> below.
          </p>

          <h2 className="h3">Information we collect</h2>
          <p className="body">
            We would rather hold less than more. The list below is short because the site is built
            that way, not because it has been summarised.
          </p>

          <h3 className="h4">What you give us</h3>
          <p className="body">
            If you complete the enquiry form we receive your name, your company name if you give
            one, your work email address, and your answers to four questions: what you are trying to
            build or change, what exists today, whether there is a deadline, and what a successful
            result would look like. If you email or call us instead, we have whatever you put in
            that message and whatever follows in the conversation.
          </p>
          <p className="body">
            As a client or supplier, we hold the business-contact details and correspondence needed
            to run the engagement — the people we deal with, what was agreed, invoices and the
            ordinary record of the work.
          </p>

          <h3 className="h4">What the site generates</h3>
          <p className="body">
            Serving a web page necessarily involves your device asking our host for it, and our host
            keeps short-lived operational records of those requests in order to serve the site and
            defend it from abuse. We do not build those records into a profile and we do not connect
            them to an enquiry.
          </p>
          <p className="body">
            Your enquiry is stored with the date it arrived and nothing else about your device.{' '}
            <strong>
              We do not record your IP address, your browser, your device or any fingerprint of it
              alongside your enquiry.
            </strong>{' '}
            That is a property of how the form is built, not a policy we could quietly relax.
          </p>

          <h3 className="h4">Please do not send more than you need to</h3>
          <p className="body">
            An enquiry form is for telling us what you want built. Please do not use it to send
            confidential material, credentials, health or other special-category information, or
            personal information about other people who are not expecting it. If a conversation
            genuinely needs that material, we will agree a proper route for it first.
          </p>

          <h3 className="h4">Recruitment and events</h3>
          <p className="body">
            If you apply for a role with {company.name}, we may process the information you provide
            as part of your application, together with information reasonably required to assess
            your application and, where relevant, complete pre-employment checks.
          </p>
          <p className="body">
            If you register for an event, webinar, briefing or other session we organise, we may
            process your registration details and, where relevant, information about your
            attendance.
          </p>

          <h3 className="h4">Social media</h3>
          <p className="body">
            We link to our LinkedIn page. That is an ordinary link: there is no social plug-in,
            embed, share button or pixel anywhere on this site, so visiting a page here tells no
            social network anything about you. If you follow that link and interact with us there,
            that platform&rsquo;s own terms and privacy notice apply and we see only what the
            platform shows us.
          </p>

          <h3 className="h4">Business development and marketing</h3>
          <p className="body">
            We may use business contact information provided directly to us, or obtained from
            appropriate public, professional or business sources, to identify organisations and
            individuals who may have a legitimate interest in our services.
          </p>
          <p className="body">
            Where personal information is involved, we process it in accordance with applicable
            data-protection and electronic-marketing requirements.{' '}
            <strong>You can object to direct marketing at any time and we will respect that
            request.</strong>{' '}
            <strong>We do not sell personal information</strong>, and we do not share it with third
            parties for their own marketing.
          </p>

          <h2 className="h3">How and why we use information</h2>
          <div className="table-scroll" style={{ marginTop: 16 }}>
            <table>
              <thead>
                <tr>
                  <th scope="col">What we do</th>
                  <th scope="col">Why we are allowed to</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Read and answer your enquiry</td>
                  <td>
                    Our legitimate interests in replying to a business enquiry you chose to send us
                  </td>
                </tr>
                <tr>
                  <td>Scope work and take steps towards a contract at your request</td>
                  <td>Steps taken before entering into a contract</td>
                </tr>
                <tr>
                  <td>Deliver and administer an engagement, including invoicing</td>
                  <td>Performance of our contract with you or your organisation</td>
                </tr>
                <tr>
                  <td>Keep a record of what was asked and what we answered</td>
                  <td>Our legitimate interests in an accurate record of our business dealings</td>
                </tr>
                <tr>
                  <td>Keep the website available and prevent abuse of the form</td>
                  <td>Our legitimate interests in the security of our own systems</td>
                </tr>
                <tr>
                  <td>Meet tax, accounting and other legal obligations</td>
                  <td>Compliance with a legal obligation</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="body" style={{ marginTop: 16 }}>
            Where we rely on legitimate interests we have weighed them against your interests, and
            you can object — see <a href="#your-rights">your rights</a>.
          </p>
          <p className="body">
            Business development and marketing, including where business contact information is
            obtained from public or professional sources, is described under{' '}
            <a href="#your-information">information we collect</a> rather than repeated here.
          </p>
        </section>

        <section id="ai-automation">
          <h2 className="h3">AI and technology providers</h2>
          <p className="body">
            We use third-party AI and technology providers to operate our website assistant and
            related functionality. Information submitted through the assistant may be processed by
            those providers where necessary to deliver the service, subject to our applicable
            service arrangements and data-protection obligations.
          </p>
          <p className="body">
            The assistant is an AI system and may make mistakes. Its responses do not constitute
            professional advice, a binding quotation, an offer or a commitment by {company.name}.{' '}
            <strong>Material commercial commitments are confirmed by a person.</strong>
          </p>
          <p className="body">
            <strong>
              No decision producing legal effects, or similarly significant effects, is made about
              you by automated means.
            </strong>{' '}
            Whether we reply, what we say, and whether we propose working together are decisions
            made by people.
          </p>
          <p className="body">
            Separately: the AI systems we design and build for clients run in those clients&rsquo;
            environments under their control, not here. Where we handle personal information in the
            course of that work, see <a href="#for-clients">work we do for clients</a>.
          </p>
        </section>

        <section id="analytics">
          <h2 className="h3">Analytics, cookies and your privacy choices</h2>
          <p className="body">
            <strong>This website sets no cookies.</strong> You are not shown a cookie banner because
            there is nothing to consent to. We load no third-party scripts, fonts, images or
            embedded content — every file the site requests comes from our own domain.
          </p>
          <p className="body">
            We run <strong>no advertising or remarketing technology, no cross-site tracking, no
            session recording or heatmaps, and no profiling of individual visitors</strong>. We do
            not share visitor data with advertising platforms and we do not match website behaviour
            to a person or to a CRM record.
          </p>
          {ANALYTICS_ENABLED ? (
            <p className="body">
              We use limited analytics to produce aggregate statistics about how this website is
              used, so that we can improve its performance and content. It is used for that and
              nothing else.
            </p>
          ) : (
            <p className="body">
              <strong>No analytics are running on this website at present.</strong> No analytics
              provider is loaded and no measurement is collected or sent. When we introduce
              analytics it will be limited to aggregate statistics that help us understand and
              improve this site, and this statement will name what is running before it runs.
            </p>
          )}

          <h3 className="h4">Your privacy choices</h3>
          <p className="body">
            <strong>Privacy choices</strong> appears in the footer of every page. It opens only when
            you select it — never on arrival — and lets you switch website analytics off, and back
            on, whenever you like. Switching it off stops any further analytics immediately, for the
            rest of that visit and on every visit afterwards.
          </p>
          <p className="body">
            So that we can respect that choice we store one preference in your browser:{' '}
            <code>pt-analytics</code>, holding either <code>on</code> or <code>off</code>. It is
            written only if you use the control. It contains no identifier, no date and nothing
            derived from you, and it is never sent to us — two visitors who both object store
            exactly the same value, so it cannot be used to tell them apart. That is the only thing
            this site stores on your device. Our <Link href="/cookies">Cookies and analytics</Link>{' '}
            page lists it, what it is for and how long it lasts.
          </p>
        </section>

        <section id="sharing-security">
          <h2 className="h3">Who else handles it, and where it goes</h2>
          <p className="body">
            Your enquiry is read by the people here who need to answer it. Beyond that, three
            providers are involved, and we name them rather than describing them vaguely:
          </p>
          <div className="table-scroll" style={{ marginTop: 16 }}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Provider</th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vercel</td>
                  <td>Hosts and serves this website, and processes the form submission</td>
                </tr>
                <tr>
                  <td>Supabase</td>
                  <td>Runs the database the enquiry is saved into</td>
                </tr>
                <tr>
                  <td>Resend</td>
                  <td>Sends us the notification that an enquiry has arrived</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="body" style={{ marginTop: 16 }}>
            Once an enquiry reaches us, our own email is carried by our mailbox provider in the
            ordinary way of any business correspondence. We also share information with our
            professional advisers, and with a regulator or other body where the law requires it.
          </p>
          <p className="body">
            Each of the three above is engaged to process this information for us, for the purpose
            described, under that provider&rsquo;s data processing terms. If you are assessing us as
            a supplier and need the contractual position, the transfer safeguards or the current
            list in writing, ask and we will send it to your reviewer.
          </p>

          <h3 className="h4">Transfers out of the United Kingdom</h3>
          <p className="body">
            Those providers are established outside the United Kingdom, including in the United
            States, so your information is transferred out of the UK when it passes through them.
            Their data processing terms bring in the European Commission&rsquo;s standard
            contractual clauses together with the UK Addendum that adapts those clauses for UK
            transfers, and those terms apply as part of the agreement governing our use of each
            service. We are not relying on an adequacy decision for any of them. Ask and we will
            tell you which mechanism applies to which provider.
          </p>

          <h3 className="h4">Security</h3>
          <p className="body">
            The site is served over an encrypted connection, enquiry data is encrypted in transit
            and at rest by the providers above, and access is limited to the people who need it. The
            database credential the website uses is scoped so that the site can add an enquiry and
            cannot read the others back. We hold an ISO/IEC 27001 certified information security
            management system; the standards and their validity dates are in the footer of every
            page, and the certificate detail goes to a reviewer on request.
          </p>
          <p className="body">
            Nobody can promise a system is impossible to break into, and we are not going to. What
            we can tell you is what we do, which is above, and that if something did go wrong and
            your information were affected we would tell you and the regulator where the law
            requires it.
          </p>

          <h3 className="h4">How long we keep it</h3>
          <p className="body">
            We keep an enquiry for{' '}
            <strong>24 months from the last time we were in contact with you about it</strong>, and
            then delete it. If nothing follows your first message, the clock starts there. Deleting
            is something we do, not something a machine does on a timer — we would rather tell you
            that than leave you picturing an automatic expiry that does not exist. If you think we
            are holding something past it, say so and we will check.
          </p>
          <p className="body">
            You do not have to wait. Ask us to delete your enquiry at any point and we will, without
            asking why. Where we have worked together, the record becomes part of the client file
            and is kept for the engagement and for six years afterwards, which is the period we may
            need it for legal and tax purposes.
          </p>
        </section>

        <section id="for-clients">
          <h2 className="h3">Work we do for clients</h2>
          <p className="body">
            Much of what we build handles personal information belonging to our clients&rsquo; own
            customers, staff or users. In that work{' '}
            <strong>the client is the controller and we are the processor</strong>: they decide what
            the information is for and what may be done with it, and we act on their documented
            instructions under the data processing terms in our contract with them.
          </p>
          <p className="body">
            This statement does not govern that information and we are not the right people to ask
            about it. If you are a customer or user of one of our clients and want to know what is
            held about you, or to exercise a right over it, approach that organisation. If a request
            reaches us instead we will pass it to them rather than act on it ourselves, because
            acting on it is exactly what a processor must not do.
          </p>
        </section>

        <section id="your-rights">
          <h2 className="h3">Your rights</h2>
          <p className="body">
            Under UK data protection law you may ask us for a copy of the personal information we
            hold about you, have inaccurate information corrected, have information deleted, ask us
            to restrict how we use it, and receive it in a portable form where that applies.
          </p>
          <p className="body">
            Where we rely on our legitimate interests you have the right to object, and we will stop
            unless we have compelling grounds to continue. Where we rely on your consent you can
            withdraw it at any time, which does not affect anything done before you did. The right
            to object to direct marketing is absolute and is set out under{' '}
            <a href="#your-information">business development and marketing</a>.
          </p>
          <p className="body">
            To exercise any of these, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            We will respond within one month. There is no charge. We may ask you to confirm who you
            are before we release information, which protects you rather than us.
          </p>

          <h3 className="h4">Complaints</h3>
          <p className="body">
            If you are unhappy with how we have handled your information, tell us first at{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a> so that we can put it right. We
            will acknowledge within 30 days, look into it and report the outcome.
          </p>
          <p className="body">
            You also have the right to complain to the Information Commissioner&rsquo;s Office, the
            UK supervisory authority, at{' '}
            <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>{' '}
            or on 0303 123 1113. You do not have to come to us first, though we would rather you
            did.
          </p>

          <h3 className="h4">Children</h3>
          <p className="body">
            This is a business website and our services are sold to organisations. It is not
            directed at children and we do not knowingly collect information about them. If you
            believe a child has sent us something, tell us and we will delete it.
          </p>

          <h3 className="h4">Links to other sites</h3>
          <p className="body">
            Where we link out — to the other Pixelette Group companies, to our LinkedIn page, or to
            a source we have cited — those sites have their own privacy practices and this statement
            does not extend to them.
          </p>

          <h3 className="h4">Changes to this statement</h3>
          <p className="body">
            We review this statement when what we do with personal information changes, and at least
            once a year. The effective date and version are at the top of this page. Where a change
            materially affects you we will say so, rather than leaving you to notice a new date.
          </p>
        </section>

        <section id="contact">
          <h2 className="h3">Contact</h2>
          <p className="body">
            {company.legalName}
            <br />
            {company.addressLine}
            <br />
            Registered in {company.registeredIn}, company number {company.crn}
            <br />
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
          <p className="body">
            We have not appointed a statutory data protection officer, because we are not required
            to. Privacy questions go to the address above and are answered by a person.
          </p>
          </section>
        </div>
      </div>
    </>
  );
}
