import Link from 'next/link';

import { Mail, Pin, Shield } from '@/components/Icons';
import { Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { company, contactEmail, pressEmail } from '@/content/company';
import { breadcrumbSchema, contactPageSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

import { ContactForm } from './ContactForm';

/*
 * "Four fields" was true of this form until 2026-09-11, when it was rebuilt
 * around the handoff's section 14 form qualifier — the four questions the
 * homepage close already published as its "What we will ask" card. The form now
 * asks those four, plus a name and a reply address, so the two descriptions of
 * it on this page changed with it. A page that describes its own form has to go
 * on describing it accurately.
 */
export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Four questions and a reply address. One of us replies, not a sequence. If Value Discovery is not the right next step we will say so on the call.',
  path: '/contact',
});

/*
 * Reworded 2026-09-08.
 *
 * The security-questionnaire answer said certificate documents were "verifiable
 * on the public registers". Three things were wrong with that in one sentence.
 *
 * SUPERSEDED 2026-09-17: /security-and-data and /certifications were both
 * WITHDRAWN on founder instruction, and the answer below no longer points at
 * either. Detailed security controls, ISO evidence and processor documentation
 * leave the marketing site and are supplied during enterprise procurement. The
 * history is kept because the failure it records is still live: an answer that
 * routes a security reviewer to something that is not there loses the deal the
 * answer exists to win. That is now true of a withdrawn page, not a placeholder.
 *
 *  1. It contradicted /certifications, which — rewritten the same day under the
 *     handoff's ACCREDITATION-SAFE RULE — says the opposite: we send what we can
 *     evidence direct to a reviewer "rather than pointing you at a register
 *     search that may not return us". IAF CertSearch needs an account and the
 *     IASME search sits behind bot protection, so the register route is not one
 *     this page can promise on the company's behalf.
 *
 *     THE IAF HALF OF THAT IS NOW WORSE, 2026-09-14, and it is recorded here
 *     because this comment is one of the four places in this repository that
 *     named IAF CertSearch as a route. The founder reports that the
 *     International Accreditation Forum ceased operations on 1 January 2026 and
 *     that iaf.nu now describes itself as a legacy archive. That report is NOT
 *     verified in the session that wrote this — raw network access was blocked,
 *     so neither iaf.nu nor iafcertsearch.org was loaded — and it is therefore
 *     asserted nowhere in rendered copy, here or anywhere else. The two IAF
 *     links themselves are gone from src/content/company.ts, and no successor
 *     register is named in their place because none has been checked. The
 *     effect on THIS page is nil: the answer below already routes a reviewer by
 *     asking rather than by linking, which is why it needed no rewording when
 *     two certificates published on 14 September 2026. It is the answer that
 *     was right for the wrong-sounding reason, and it stays.
 *  2. Saying a certificate is verifiable on a public register asserts that the
 *     certificate exists and is findable, which is the claim the register HOLDs
 *     (claims.ts `iso-cyber-essentials-badges`). An FAQ is not a lesser surface:
 *     this array is also emitted as FAQPage JSON-LD below, so the held claim was
 *     being handed to answer engines in machine-readable form.
 *  3. It promised published subprocessors and data residency. /security-and-data
 *     carries both as visible unfilled placeholders, by its own stated policy.
 *     Pointing a security reviewer at answers that are not there loses the deal
 *     the page exists to win.
 *
 * The replacement claims only what both pages actually do, and routes the
 * reviewer the way /certifications routes them.
 */
const faqs = [
  {
    q: 'How quickly does Pixelette Technologies reply to an enquiry?',
    a: 'Within one working day, from a person rather than an automated sequence. If Value Discovery is not the right next step, we say so on the call.',
  },
  {
    q: 'Where do I find answers for a security questionnaire?',
    a: 'Send us the questionnaire and we will complete it. Data handling, AI governance, incident response, control detail and certificate evidence go direct to your reviewer rather than being published on this site. Tell us what your review needs and who it should go to, and we will send what we can evidence.',
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            Tell us what you are trying to build or change
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Some people arrive knowing exactly what is broken. Others only know that something is.
            Both are worth the same conversation: what the problem really is, which route resolves
            it, and what has to happen first. Four questions and a reply address. One of us replies,
            not a sequence. If Value Discovery is not the right next step we will say so on the
            call.
          </p>
        </div>
      </div>

      <Section flush style={{ paddingTop: 48 }} labelledBy="contact-heading">
        <h2 className="visually-hidden-heading" id="contact-heading">
          Get in touch
        </h2>

        <div className="split split--wide-right">
          <div className="stack-24">
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} aria-hidden>
                <Pin size={20} />
              </span>
              <div>
                <b style={{ display: 'block', fontSize: 15 }}>{company.legalName}</b>
                <address className="small" style={{ fontStyle: 'normal', marginTop: 6 }}>
                  {company.address.street}
                  <br />
                  {company.address.locality} {company.address.postalCode}
                </address>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} aria-hidden>
                <Mail size={20} />
              </span>
              <div>
                <b style={{ display: 'block', fontSize: 15 }}>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </b>
                <span className="small" style={{ display: 'block', marginTop: 6 }}>
                  Replies within one working day
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} aria-hidden>
                <Shield size={20} />
              </span>
              <div>
                <b style={{ display: 'block', fontSize: 15 }}>Security questionnaires</b>
                <span className="small" style={{ display: 'block', marginTop: 6 }}>
                  Send yours over and we will complete it. Control detail and certificate
                  evidence go direct to your reviewer.
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 36 }}>
            <h3 className="h3">Start with what you know</h3>
            <p className="small" style={{ marginTop: 10 }}>
              Four questions. One of us replies within one working day.
            </p>
            <div style={{ marginTop: 28 }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="routes-heading">
        <h2 className="visually-hidden-heading" id="routes-heading">
          Other routes in
        </h2>
        <div className="grid grid-3">
          <div className="card">
            {/* Same correction as the FAQ above: this card listed subprocessors
                and data residency as published, and "certification status"
                beside them reads as a published certification. What is actually
                published is the data-handling position; what is actually
                offered is certificate detail direct to a reviewer. */}
            <h3 className="h4">Procurement and security</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              Data handling, AI governance, incident response, control detail and certificate
              evidence go direct to your reviewer. Tell us what your review needs and who it should
              go to.
            </p>
          </div>

          <div className="card">
            <h3 className="h4">Public sector</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              {/*
                DIRECT AWARD CLAIM REMOVED 2026-09-16 on founder instruction. A
                dynamic purchasing system operates by FURTHER COMPETITION among
                listed suppliers; "direct award available" was not a description
                of how RM6200 works. Do not reinstate it without authoritative
                Crown Commercial Service evidence.
              */}
              <b>AI DPS RM6200 registration in progress.</b> Once listed, Pixelette can be
              shortlisted through the DPS and invited into the relevant further competition.
            </p>
          </div>

          <div className="card">
            <h3 className="h4">Press and speaking</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              We publish our methodology and follow UK AI standards work closely. Happy to talk on the
              record.
            </p>
            <p style={{ marginTop: 16 }}>
              <a href={`mailto:${pressEmail}`}>{pressEmail}</a>
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>
    </>
  );
}
