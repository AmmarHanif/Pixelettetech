import { HeroVideo } from '@/components/HeroVideo';
import { BuildProgression, ConnectedEngineering } from '@/components/ImmersiveVisuals';
import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * AR / VR & Immersive Applications.
 *
 * REBUILT 2026-09-24 to the founder's master brief, and repositioned: this is an
 * ENGINEERING capability, not a Pixelette business division. The page it
 * replaced opened with "Immersive work built to be used, not demonstrated" and
 * claimed delivery "across property, retail, heritage, healthcare and industry",
 * which asserts a sector record the site cannot evidence. Every sector on this
 * page is now framed as something we CAN build.
 *
 * THE PERMISSIONS RULE SHAPED THE WHOLE DESIGN. No legacy client imagery, no
 * third-party product, no branded environment. Searched before writing: no
 * reference to the previous site's client material exists anywhere in src or
 * public. Everything visual here is drawn from scratch out of coloured planes,
 * and every demonstration is a FICTIONAL object labelled "capability
 * demonstration" on its own panel rather than once at the top of the section.
 *
 * MORE INTERACTION THAN A NORMAL SERVICE PAGE, LESS THAN A TOY. The subject is
 * immersive software, so the page carries a spatial hero, four working
 * demonstrations and a receding build sequence. All of it is CSS 3D on the
 * site's existing tokens: no new dependency, no WebGL, no canvas that a screen
 * reader cannot enter, nothing that autoplays, and nothing that is hover-only.
 */

export const metadata = pageMetadata({
  /*
   * THE BRIEF SUGGESTED "AR / VR & Immersive Application Development | Pixelette
   * Technologies", which builds a 67-character title. The founder had six
   * over-long titles corrected earlier the same day, so this uses the short form
   * and lets pageMetadata append the brand in the site's own separator: 57
   * characters. The H1 below is the brief's heading, unchanged.
   */
  title: 'AR / VR & Immersive Applications',
  description:
    'AR, VR and immersive application engineering for training, simulation, visualisation, interactive products and spatial experiences.',
  path: '/ar-vr-development-services',
});

/** §5. Why immersive, before any mention of a device. */
const EARNS = [
  {
    t: 'Train',
    b: 'Practise procedures, environments and scenarios without recreating them physically every time.',
  },
  {
    t: 'Visualise',
    b: 'Explore products, spaces, designs or information before they exist in the real world.',
  },
  {
    t: 'Experience',
    b: 'Create interactive product, customer and brand experiences that go beyond a conventional screen.',
  },
  {
    t: 'Interact',
    b: 'Use spatial interfaces to work with information, objects or environments in a more natural way.',
  },
];

/** §8. What we build. */
const BUILD = [
  {
    t: 'AR applications',
    b: 'Overlay useful digital information, objects or interactions onto real-world environments through supported devices.',
  },
  {
    t: 'VR applications',
    b: 'Controlled virtual environments for training, simulation, demonstration and interactive experiences.',
  },
  {
    t: 'Training & simulation',
    b: 'Repeatable immersive environments for practising processes, scenarios and operational tasks.',
  },
  {
    t: 'Product & spatial visualisation',
    b: 'Let users explore products, environments, layouts or designs interactively before physical delivery.',
  },
  {
    t: 'Interactive 3D experiences',
    b: 'Web, mobile or device-based 3D experiences for the cases where a conventional interface is not enough.',
  },
  {
    t: 'Immersive AI',
    b: 'Where it is useful, combine immersive applications with AI, computer vision, conversational interfaces or intelligent assistance.',
  },
];

/**
 * §9. Sectors.
 *
 * EVERY ONE IS A POSSIBILITY, NOT A RECORD. The page this replaced asserted
 * delivery across five sectors; the claims rule forbids that without evidence,
 * and none is published. The heading and the note under the grid both say so,
 * so a reader cannot take the list as a client history.
 */
const SECTORS = [
  {
    t: 'Property & architecture',
    b: 'Interactive spaces, walkthroughs and visualisation before physical delivery.',
  },
  {
    t: 'Training & education',
    b: 'Immersive environments for practising, learning and simulation.',
  },
  {
    t: 'Retail & e-commerce',
    b: 'Interactive product exploration, virtual presentation and AR preview experiences.',
  },
  {
    t: 'Tourism, heritage & culture',
    b: 'Interactive places, exhibitions, cultural assets and virtual experiences.',
  },
  {
    t: 'Automotive & manufacturing',
    b: 'Product visualisation, training, simulation and complex 3D interaction.',
  },
  {
    t: 'Healthcare',
    b: 'Training and simulation applications where immersive technology is appropriate.',
  },
];

/** §10. The four ways in, as larger visual tiles rather than a second grid. */
const WAYS = [
  { t: 'Train & simulate', b: 'Practise environments, procedures and scenarios.', k: 'train' },
  { t: 'Visualise', b: 'Explore products, places and designs before they physically exist.', k: 'vis' },
  { t: 'Experience', b: 'Create interactive customer, cultural or brand experiences.', k: 'exp' },
  { t: 'Try & explore', b: 'Let people interact with products and possibilities in context.', k: 'try' },
];

/** §12. Environments, not an SDK list. */
const PLATFORMS = [
  'Mobile AR',
  'Headset-based VR',
  'Spatial computing',
  'Web-based 3D',
  'Desktop applications',
  'Connected devices',
];

/** §13. AI, kept optional throughout. */
const AI_ADDS = [
  { t: 'See', b: 'Computer vision can help an application understand objects, environments or activity.' },
  { t: 'Talk', b: 'Conversational AI can create more natural guidance and interaction.' },
  { t: 'Adapt', b: 'AI can adjust information or experiences according to context.' },
  { t: 'Assist', b: 'Intelligent assistance can support users while they work, train or explore.' },
];

const faqs = [
  {
    q: 'Do we need to know whether we need AR or VR?',
    a: 'No. Start with the experience or problem you want to solve. We can help determine whether AR, VR, interactive 3D or a conventional application is the more appropriate approach.',
  },
  {
    q: 'Can you build for existing headsets and devices?',
    a: 'Yes, where the required platform and use case are technically appropriate. The target devices are agreed during scoping.',
  },
  {
    q: 'Does an immersive application need AI?',
    a: 'No. AI is optional. We use it only where capabilities such as computer vision, conversational interaction or intelligent assistance genuinely improve the application.',
  },
  {
    q: 'Can AR or VR integrate with our existing systems?',
    a: 'Yes. Immersive applications can be engineered to work with existing APIs, data sources and business systems where required.',
  },
  {
    q: 'Can you build a prototype before the full application?',
    a: 'Yes. For many immersive projects, a focused prototype is a sensible way to validate the interaction, device choice and technical approach before committing to the complete build.',
  },
  {
    q: 'Do we have to retain Pixelette after launch?',
    a: 'No. We deliver the commissioned application to the agreed specification. Optional ongoing support, maintenance and improvement are available if you want us to remain involved.',
  },
];

export default function ImmersiveApplicationsPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'AR / VR & Immersive Applications',
          description:
            'AR, VR and immersive application engineering for training, simulation, visualisation, interactive products and spatial experiences.',
          path: '/ar-vr-development-services',
          serviceType: 'Immersive application engineering',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          { name: 'AR / VR & Immersive Applications', path: '/ar-vr-development-services' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ §4 hero */}
      <div className="hero-glow imm-hero">
        <div className="wrap">
          <div className="imm-hero__grid">
            <div>
              <Eyebrow>Engineering / AR / VR &amp; Immersive Applications</Eyebrow>
              <h1 className="h1" style={{ marginTop: 22, maxWidth: '17ch' }}>
                Build experiences people can step into
              </h1>
              <p className="lead" style={{ marginTop: 24, maxWidth: '58ch' }}>
                We design and engineer AR, VR and immersive applications for training,
                visualisation, customer experience and interactive products, built around a real
                use case rather than the technology for its own sake.
              </p>
              <div className="btn-row" style={{ marginTop: 32 }}>
                <Cta href="/contact">Discuss an immersive application</Cta>
                <Cta href="/engineering" variant="secondary">
                  Explore Engineering
                </Cta>
              </div>
              <p className="imm-hero__strip">
                AR <span aria-hidden>•</span> VR <span aria-hidden>•</span> Spatial experiences{' '}
                <span aria-hidden>•</span> Interactive 3D
              </p>
            </div>
            <div className="imm-hero__viz">
              <HeroVideo />
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------- §5 where it earns it */}
      <Section labelledBy="earns-heading">
        <SectionHead
          eyebrow="Where it earns its place"
          id="earns-heading"
          title="Some things are easier to experience than explain"
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '68ch' }}>
          Immersive technology is useful when seeing, practising or interacting with something
          creates more value than reading about it on a conventional screen. We start with that
          requirement and choose the appropriate technology around it.
        </p>
        <div className="grid grid-4 imm-earns" style={{ marginTop: 32 }}>
          {EARNS.map(e => (
            <div className="imm-earn" key={e.t}>
              <h3 className="h4">{e.t}</h3>
              <p className="body imm-earn__b">{e.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------- §6/§7 showcase */}
      {/*
        IMMERSIVE SHOWCASE - HIDDEN ON INSTRUCTION, NOT DELETED.

        The section and its four demonstrations are intact in
        `ImmersiveShowcase.tsx` and `SpatialDemo/`, including the WebGL Spatial
        build. It is commented out here rather than removed because it is
        expected back once Spatial meets the approved visual standard, and
        deleting it would throw away work that is finished apart from that.

        Restoring it is this block and the import, nothing else.
      */}
      {/*
      <Section labelledBy="showcase-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Immersive showcase"
          id="showcase-heading"
          title="Don't just read about immersive. Try it"
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '66ch' }}>
          Explore four capability demonstrations showing how immersive technology can be used to
          visualise, interact, practise and understand. These are demonstrations built for this
          page, not client work.
        </p>
        <div style={{ marginTop: 34 }}>
          <ImmersiveShowcase />
        </div>
      </Section>
      */}

      {/* ------------------------------------------------- §8 what we build */}
      <Section labelledBy="build-heading">
        <SectionHead
          eyebrow="Immersive engineering"
          id="build-heading"
          title="From concept to working application"
        />
        <div className="grid grid-3" style={{ marginTop: 32 }}>
          {BUILD.map(b => (
            <div className="card imm-cap" key={b.t}>
              <h3 className="h4">{b.t}</h3>
              <p className="body imm-cap__b">{b.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- §9 applications */}
      <Section labelledBy="apps-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Applications" id="apps-heading" title="Built around the use case" />
        <p className="body" style={{ marginTop: 18, maxWidth: '68ch' }}>
          These are applications we can engineer. They describe what immersive technology is
          suited to rather than a record of sectors already delivered.
        </p>
        <div className="grid grid-3" style={{ marginTop: 30 }}>
          {SECTORS.map(s => (
            <div className="imm-sector" key={s.t}>
              <h3 className="h4">{s.t}</h3>
              <p className="body imm-sector__b">{s.b}</p>
            </div>
          ))}
        </div>
        <p className="body imm-sector__note">
          Have a different use case? Start with the problem and we will determine whether immersive
          technology is the right approach.
        </p>
      </Section>

      {/* ------------------------------------------------- §10 use-case strip */}
      <Section labelledBy="ways-heading">
        <SectionHead id="ways-heading" title="Different ways to step inside the experience" />
        <div className="imm-ways" style={{ marginTop: 32 }}>
          {WAYS.map(w => (
            <div className={`imm-way imm-way--${w.k}`} key={w.t}>
              <div aria-hidden className="imm-way__art">
                <span />
                <span />
                <span />
              </div>
              <h3 className="h4 imm-way__t">{w.t}</h3>
              <p className="body imm-way__b">{w.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------- §11 how we build it */}
      <Section labelledBy="process-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Engineering first"
          id="process-heading"
          title="The experience is only useful if the product works"
        />
        <div style={{ marginTop: 34 }}>
          <BuildProgression />
        </div>
      </Section>

      {/* ---------------------------------------------------- §12 platforms */}
      <Section labelledBy="platform-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Built for the right environment"
              id="platform-heading"
              title="The platform follows the experience"
            />
            <p className="body" style={{ marginTop: 18 }}>
              The right technology depends on where and how the application will be used. We design
              around the use case and the target environment rather than forcing every project onto
              the same device or platform.
            </p>
          </div>
          <div>
            {/*
              A list of ENVIRONMENTS, not an SDK wall. The previous site carried a
              grid of engine and framework logos; the brief rules that out, and it
              was answering a question no buyer asks. Engine and framework choice
              is a scoping conversation, and saying so is more useful than a logo.
            */}
            <ul className="imm-platforms">
              {PLATFORMS.map(p => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="small imm-platforms__note">
              The specific engines, frameworks and device SDKs are chosen during scoping, against
              the target devices and the environment the application has to work in.
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ §13 when AI */}
      <Section labelledBy="ai-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="When AI adds something"
          id="ai-heading"
          title="Immersive applications can become intelligent too"
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '68ch' }}>
          Where the use case benefits from it, we can combine immersive applications with AI
          capabilities such as computer vision, conversational interfaces, intelligent guidance and
          adaptive workflows. It is an option, not a requirement: most immersive applications do
          not need any of it.
        </p>
        <div className="grid grid-4" style={{ marginTop: 30 }}>
          {AI_ADDS.map(a => (
            <div className="imm-earn" key={a.t}>
              <h3 className="h4">{a.t}</h3>
              <p className="body imm-earn__b">{a.b}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 28 }}>
          <FLink href="/ai-automation">Explore AI &amp; Automation</FLink>
        </p>
      </Section>

      {/* -------------------------------------------- §14 connected engineering */}
      <Section labelledBy="conn-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'center' }}>
          <div>
            <SectionHead
              eyebrow="Connected engineering"
              id="conn-heading"
              title="Immersive is part of the product, not a separate technology island"
            />
            <p className="body" style={{ marginTop: 18 }}>
              An immersive application can need the same foundations as any other digital product:
              software engineering, cloud infrastructure, APIs, data, security, integrations and
              ongoing support. Pixelette brings those pieces together around the experience.
            </p>
            {/*
              §15. The commercial position, stated in the section where a reader is
              already thinking about what happens after launch. Support is a
              separate top-level service and is linked as one, not folded into
              Engineering.
            */}
            <p className="body" style={{ marginTop: 18 }}>
              We deliver the commissioned application to the agreed specification. Optional ongoing{' '}
              <FLink href="/support-continuous-improvement">support, maintenance and improvement</FLink>{' '}
              are available afterwards if you want them, and the application is yours either way.
            </p>
          </div>
          <div>
            <ConnectedEngineering />
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------- §16 FAQ */}
      <Section labelledBy="faq-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      {/* ----------------------------------------------------- §17 final CTA */}
      <ClosingCta
        ctaLabel="Discuss an immersive application"
        eyebrow="Have an idea?"
        title="Make it something people can experience"
      >
        Tell us what you want people to see, practise, understand or interact with. We will help
        determine the right way to engineer it.
      </ClosingCta>
    </>
  );
}
