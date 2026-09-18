import Link from 'next/link';

import { ClosingCta, Testimonials, valueModel } from '@/components/sections';
import { Cta, Eyebrow, JsonLd, Section, SectionHead } from '@/components/ui';
import { company } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Rebuilt 2026-09-18 to the founder's About brief. The page answers four things
 * quickly - who the company is, how it has evolved since 2018, how it thinks
 * about engineering, and what it builds today - and lets structure carry the
 * load rather than prose. It is materially shorter than what it replaces.
 *
 * ONE SECTION CARRIES BOX CHROME, and it is "What we build today", because it
 * is the only grouping whose items are links. On this site a bordered box is a
 * link target. The glance strip separates with vertical hairlines, the
 * principles with horizontal top rules, the testimonials with nothing. That one
 * rule is what stops four groupings in a row reading as four card grids, which
 * the brief rules out.
 *
 * WHAT CAME OUT, and why, so nobody restores it by accident.
 *
 *   "Why an engineering firm measures everything". Removed on instruction. Its
 *   argument turned on a comparison - that running a QMS and an ISMS teaches
 *   "something most AI specialists have never had to learn" - and the brief
 *   rules out language positioning Pixelette against "most AI specialists" in
 *   either direction. Its successor is the "Measure what matters" principle. If
 *   the site is ever said to have gone vague about WHY an engineering firm
 *   measures, this cut is the cause and that principle is where the fix goes.
 *
 *   The FAQ block, and with it this page's FAQPage JSON-LD. The brief said
 *   remove it unless the questions held information not covered elsewhere.
 *   Checked against the BUILT page rather than assumed: question one gave the
 *   company number, the registered address and "England and Wales", and all
 *   four strings already render in the footer of every page, with foundingDate,
 *   identifier and address also in the Organization graph emitted site-wide.
 *   Question two restated the Big Innovation Centre paragraph almost verbatim.
 *   Neither was carrying anything. /assurance still emits FAQPage, so the site
 *   has not lost the type.
 *
 *   The Clutch stat tile, which was gated behind `clutch.published` and that
 *   flag is still false, so it was rendering nothing.
 *
 * ONE DEPARTURE FROM THE BRIEF, flagged to the founder rather than taken
 * silently: the hero headline is written without its closing full stop. The
 * brief punctuates it "Engineering technology built to last." but a standing
 * instruction from 2026-09-17 removed trailing full stops from headlines
 * site-wide and headline_style_check.py enforces it. Restoring one here would
 * fail that gate and reopen a decision already made.
 */
export const metadata = pageMetadata({
  title: 'About the firm',
  description:
    'Since 2018, Pixelette Technologies has designed and built production software, digital platforms and increasingly sophisticated AI systems for organisations that need technology to work beyond the demo.',
  path: '/about',
});

const glance = [
  { k: 'Established', v: String(company.incorporated) },
  { k: 'Headquartered', v: 'United Kingdom' },
  { k: 'Core engineering capability', v: 'Software, AI, automation, blockchain' },
  { k: 'How we build', v: 'Client and proprietary development' },
];

/**
 * The evolution sequence.
 *
 * NO INVENTED YEARS. Only the first row carries a date, because 2018 is the
 * only one this company can evidence. The middle three are disciplines, not
 * dates, and evening up that column by guessing when each capability arrived
 * would be a claim nobody could support. The ragged marker column is correct.
 *
 * `mark` fills the node. 2018 and Now are the only rows that are points in
 * time, so the fill shows where the sequence starts and where it has reached.
 * Note that the last row is "Now" and not "Run": the capability model has four
 * entries and this has five, and the mismatch is deliberate. This is a history,
 * not a product list.
 */
const evolution = [
  { label: '2018', line: 'Software engineering foundation', mark: true },
  { label: 'Build', line: 'Web platforms, mobile products and custom systems' },
  { label: 'Automate', line: 'AI, agents and intelligent workflows' },
  { label: 'Decentralise', line: 'Blockchain and distributed technology' },
  { label: 'Now', line: 'Client engineering alongside proprietary AI R&D', mark: true },
];

const principles = [
  { title: 'Build deliberately', body: 'Architecture before unnecessary complexity.' },
  { title: 'Measure what matters', body: 'Evidence over assumption.' },
  { title: 'Stay accountable', body: 'We build for what happens after launch.' },
];

/*
 * What we build today.
 *
 * The COPY is the founder's, from the brief, and is deliberately terser than
 * `valueModel`'s: that block is a routing device written in a buyer's language
 * and this is a capability summary on a page that has to stay short.
 *
 * The ROUTES are not retyped. They are read off `valueModel`, the canonical
 * BUILD / AUTOMATE / DECENTRALISE / RUN model used by the homepage and all
 * three practice hubs, so the order and the destinations cannot drift from the
 * rest of the site even though the wording differs on purpose. A fifth
 * hand-typed copy of four hrefs is a fifth place for them to rot.
 */
const TODAY_COPY: Record<string, string> = {
  BUILD: 'Custom software and digital products.',
  AUTOMATE: 'AI systems, agents and workflow automation.',
  DECENTRALISE: 'Blockchain and distributed systems.',
  RUN: 'Engineering, integration and ongoing evolution.',
};

const today = valueModel.map(entry => ({
  key: entry.key,
  title: entry.key.charAt(0) + entry.key.slice(1).toLowerCase(),
  body: TODAY_COPY[entry.key],
  href: entry.href,
}));

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>About</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '18ch' }}>
            Engineering technology built to last
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Since {company.incorporated}, {company.name} has designed and built production software,
            digital platforms and increasingly sophisticated AI systems for organisations that need
            technology to work beyond the demo.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/case-studies">See our work</Cta>
            <Cta href="/contact" variant="secondary">
              Start a conversation
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------- company at a glance */}
      {/* `flush` removes the section's top border so the strip reads as the tail
          of the hero rather than as the page's first content section. It is the
          only section here with no top boundary, and that is what makes it a
          proof strip. The heading is present for the accessible name and hidden
          visually, because a visible one over four short facts doubles the
          block's height and its apparent importance. */}
      <Section flush tight labelledBy="glance-heading">
        <h2 className="visually-hidden-heading" id="glance-heading">
          Company at a glance
        </h2>
        <dl className="glance about-glance">
          {glance.map(item => (
            <div className="about-glance__pair" key={item.k}>
              <dt>{item.k}</dt>
              <dd>{item.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ------------------------------------------------------- evolution */}
      <Section
        className="about-evolution"
        labelledBy="evolution-heading"
        style={{ background: '#F7FAFA' }}
      >
        <div className="split split--wide-right">
          {/* "Our evolution" is the heading the brief names, so it is the h2
              rather than an eyebrow over an invented one. No lead either: the
              brief says keep the copy minimal here, and this section is made
              the strongest on the page by space and by the timeline itself,
              not by more words in front of it. */}
          <SectionHead id="evolution-heading" title="Our evolution" />
          {/*
            An ordered list, because the order IS the argument: the page is
            claiming accumulation, and <ol> is the only structure that puts that
            in the accessibility tree as "item 3 of 5".

            role="list" is load-bearing, not belt and braces. `list-style: none`
            strips list semantics in WebKit and VoiceOver, so without it the
            item count disappears for exactly the readers who cannot see the
            rail that conveys it visually.

            Headings were considered and refused: five more h3s would bury the
            page outline under one-word labels, and the section's own h2 is
            already the correct outline entry.

            The rail and the nodes are pseudo-elements with empty content, so
            they generate no accessible text at all, which is why they are not
            spans anyone could forget to hide. They carry nothing the text does
            not, so they are decorative and outside WCAG 1.4.11. Do not "repair"
            a hairline to a 3:1 contrast obligation.
          */}
          <ol className="evo" role="list">
            {evolution.map(stage => (
              <li className="evo__row" key={stage.label}>
                <span className="evo__label">{stage.label}</span>
                <p className="h3 evo__line">{stage.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ------------------------------------------ how we think about it */}
      {/* No eyebrow here. It is spent on the two sections either side, and
          withholding it is one of the ways the evolution section stays on top
          of the page's hierarchy. */}
      <Section labelledBy="production-heading">
        <SectionHead
          id="production-heading"
          title="Built for production, not presentation"
          lead="We approach software and AI as engineering disciplines: define the problem, build for the real environment, measure what works and remain accountable for what goes into service."
        />
        <div className="grid grid-3" style={{ marginTop: 44 }}>
          {principles.map(p => (
            <div className="about-principle" key={p.title}>
              <h3 className="h4">{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
        {/* Nothing renders beneath the three principles. The brief is explicit
            and it is right: a closing paragraph here would be the methodology
            copy this section exists to replace. */}
      </Section>

      {/* -------------------------------------------- what we build today */}
      <Section labelledBy="today-heading" style={{ background: '#F7FAFA' }}>
        {/* "What we build today" collided with the first card. The heading used
            "build" as the verb covering all four, and then the first of four
            peers claimed it as its own name, two inches below. Founder spotted
            it on review 2026-09-18. One word changed, so the sentence shape and
            the rhythm against "Our evolution" are untouched. */}
        <SectionHead eyebrow="Capability" id="today-heading" title="What we do today" />
        <div className="grid grid-4" style={{ marginTop: 40 }}>
          {today.map(t => (
            <Link className="card" href={t.href} key={t.key}>
              <h3 className="h4">{t.title}</h3>
              <p className="body" style={{ marginTop: 10, fontSize: 15 }}>
                {t.body}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Testimonials heading="What clients say" variant="plain" />

      {/* ----------------------------------------------- industry engagement */}
      {/*
        Reduced 2026-09-18 on instruction. It used to headline "A shareholding
        in Big Innovation Centre" under an eyebrow reading "Policy exposure",
        across a two-column section as wide as the company story, which gave a
        shareholding the visual weight of a capability. It now sits after the
        client evidence rather than before it: a credential would be placed
        ahead of the proof, a piece of context is placed after it.

        "That gives us visibility of UK AI policy as it forms" is gone. The
        shareholding is a fact; the benefit inferred from it was a claim, and the
        brief removes it. The disclaimer is the load-bearing part of the section
        and it is now more specific than the sentence it replaces, naming both
        Parliament and the APPG.

        WORDING GATE. `claims.ts` holds `appg-parliament-reference` with the
        instruction to use only the exact substantiated relationship and not to
        imply Parliamentary endorsement. The relationship sentence below is
        unchanged from the one that cleared that gate. Any edit here has to be
        re-checked against the register.

        A heading demoted in TYPE but not in LEVEL: it is an h2 because it is a
        peer region in the document outline, wearing .h4 because it must not
        compete with the company story. Demoting the level would leave a level-3
        heading with no level-2 parent at the end of the page.
      */}
      <Section tight labelledBy="industry-heading">
        <div className="about-industry">
          <h2 className="h4" id="industry-heading">
            Industry engagement
          </h2>
          <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
            Pixelette&rsquo;s founder holds a shareholding in Big Innovation Centre, which acts as
            Secretariat to the All-Party Parliamentary Group on Artificial Intelligence.
          </p>
          <p className="about-industry__q">
            This relationship is not an accreditation, endorsement or partnership with Parliament or
            the APPG.
          </p>
        </div>
      </Section>

      <ClosingCta title="Have something difficult to build?" ctaLabel="Start a conversation">
        Talk to us about the problem, product or system you are trying to create.
      </ClosingCta>
    </>
  );
}
