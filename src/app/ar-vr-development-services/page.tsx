import { HeroVideo } from '@/components/HeroVideo';
import { BuildProgression } from '@/components/ImmersiveVisuals';
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
 * which asserts a sector record the site cannot evidence. Every application on
 * this page is still framed as something we CAN build.
 *
 * CONSOLIDATED 2026-09-30 to the founder's structural brief. The page carried
 * TEN visible content sections and several of them answered the same customer
 * question in different words: "From concept to working application", "Built
 * around the use case" and "Different ways to step inside the experience" all
 * restated the breadth of what immersive can do, and "The platform follows the
 * experience" and "Immersive applications can become intelligent too" both
 * answered "what will you build it with". It is now SIX, and each answers one
 * distinct question:
 *
 *   01 Hero .................. what is this service
 *   02 Why immersive ......... why would it be useful     (the ONLY place)
 *   03 Immersive showcase .... prove it                   (hidden, see below)
 *   04 What could you build .. how broad is it
 *   05 How we build it ....... will the product work
 *   06 Technology follows .... what will you build it with
 *   07 FAQ + closing CTA ..... residual buying questions
 *
 * The brief was explicit that this is STRUCTURE, not a visual redesign: the hero
 * video is untouched, the showcase is untouched, no image asset was added, and
 * every treatment below already existed in the stylesheet.
 *
 * THE PERMISSIONS RULE STILL SHAPES THE PAGE. No legacy client imagery, no
 * third-party product, no branded environment, and no assertion of a sector
 * record that the site cannot evidence.
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

/**
 * §02. Why immersive - the ONLY section on the page whose job is to explain why
 * immersive technology can be useful.
 *
 * These four replaced Train / Visualise / Experience / Interact on 2026-09-30.
 * The old four were not wrong, but "Experience" restated the page title and the
 * set overlapped the four use-case tiles further down and the four showcase
 * demonstrations. One set now carries the idea, and nothing below repeats it.
 */
const WHY = [
  { t: 'See', b: 'Explore something before it physically exists.' },
  { t: 'Practise', b: 'Learn or rehearse without recreating the real situation.' },
  { t: 'Interact', b: 'Work with products, information and environments spatially.' },
  { t: 'Understand', b: 'Make complex things easier to explore from different perspectives.' },
];

/**
 * §04. What could you build - the consolidation of two deleted sections.
 *
 * "From concept to working application" listed six CAPABILITIES (AR apps, VR
 * apps, training, visualisation, 3D, immersive AI) and "Built around the use
 * case" listed six SECTORS. Those are two cuts of the same answer, so they are
 * one list now, cut by what the application is FOR.
 *
 * EVERY ENTRY IS A POSSIBILITY, NOT A RECORD. The deleted sector section carried
 * an explicit note saying so, because the page it replaced asserted delivery
 * across five sectors and the claims rule forbids that without published
 * evidence. The guard is now carried by the framing itself: the heading asks
 * what YOU could build, the supporting copy starts from what you want someone to
 * experience, and no entry below describes anything as delivered.
 */
const APPLICATIONS = [
  {
    t: 'Gaming & interactive worlds',
    b: 'Immersive games, interactive environments and virtual experiences.',
  },
  {
    t: 'Training & simulation',
    b: 'Practise scenarios, processes and skills safely and repeatedly.',
  },
  {
    t: 'Products & commerce',
    b: 'Let people explore, configure and experience products in context.',
  },
  {
    t: 'Property & spaces',
    b: 'Walk through spaces, layouts and environments before physical delivery.',
  },
  {
    t: 'Learning & culture',
    b: 'Use immersive environments for education, exhibitions, heritage and interactive storytelling.',
  },
  {
    t: 'Industry & healthcare',
    b: 'Use immersive visualisation and simulation to understand, practise and communicate complex tasks.',
  },
];

/** §06, left column. Environments, not an SDK list. */
const PLATFORMS = [
  'Mobile AR',
  'Headset-based VR',
  'Spatial computing',
  'Web-based 3D',
  'Desktop applications',
  'Connected devices',
];

/**
 * §06, right column. AI, kept optional.
 *
 * This was a full-width section of its own - "Immersive applications can become
 * intelligent too" - with four explained cards. Beside the platform list it says
 * the same thing in two or three words each, and sitting in the same section as
 * the platforms is what makes AI read as one capability among several rather
 * than as a second half of the offer.
 */
const AI_ADDS = [
  'Computer vision',
  'Conversational interaction',
  'Adaptive experiences',
  'Intelligent assistance',
];

/**
 * §07. Reviewed against the consolidated page on 2026-09-30.
 *
 * "Does an immersive application need AI?" was REMOVED. Its answer was "AI is
 * optional. We use it only where capabilities such as computer vision,
 * conversational interaction or intelligent assistance genuinely improve the
 * application" - which is now stated almost word for word in section 06, a
 * couple of screens above, beside the list of those same capabilities. An FAQ
 * that repeats the section above it is the duplication this consolidation exists
 * to remove.
 *
 * The support question was SHORTENED for the same reason: section 05 now carries
 * the commercial position, so the answer here keeps only the part that section
 * does not state, which is that the application is yours either way.
 *
 * The remaining five are genuine residual buying questions and none of them is
 * answered above.
 */
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
    q: 'Can AR or VR integrate with our existing systems?',
    a: 'Yes. Immersive applications can be engineered to work with existing APIs, data sources and business systems where required.',
  },
  {
    q: 'Can you build a prototype before the full application?',
    a: 'Yes. For many immersive projects, a focused prototype is a sensible way to validate the interaction, device choice and technical approach before committing to the complete build.',
  },
  {
    q: 'Do we have to retain Pixelette after launch?',
    a: 'No. The application is yours. Optional ongoing support, maintenance and improvement are available afterwards if you want them.',
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

      {/* ------------------------------------------------------------- 01 hero */}
      {/* PRESERVED EXACTLY. Eyebrow, headline, proposition, both CTAs, the
          format strip and the hero VIDEO are unchanged by the consolidation. */}
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

      {/* --------------------------------------------------- 02 why immersive */}
      {/*
        The lead deliberately does NOT say "and we choose the technology around
        it". That is section 06's job, and saying it here as well is one of the
        repetitions this consolidation removed.
      */}
      <Section labelledBy="why-heading">
        <SectionHead
          eyebrow="Where it earns its place"
          id="why-heading"
          title="Some things are easier to experience than explain"
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '66ch' }}>
          Immersive technology earns its place when experiencing something creates more value than
          reading about it on a conventional screen.
        </p>
        <div className="grid grid-4 imm-earns" style={{ marginTop: 32 }}>
          {WHY.map(w => (
            <div className="imm-earn" key={w.t}>
              <h3 className="h4">{w.t}</h3>
              <p className="body imm-earn__b">{w.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------- 03 immersive showcase */}
      {/*
        IMMERSIVE SHOWCASE - HIDDEN ON INSTRUCTION, NOT DELETED.

        The section and its four demonstrations are intact in
        `ImmersiveShowcase.tsx` and `SpatialDemo/`, including the WebGL Spatial
        build. It is commented out here rather than removed because it is
        expected back once Spatial meets the approved visual standard, and
        deleting it would throw away work that is finished apart from that.

        UNTOUCHED BY THE 2026-09-30 CONSOLIDATION, which was explicit that this
        section is preserved and not restructured. Restoring it is this block and
        the import, plus removing the background from section 04 below so the
        light and tinted sections still alternate.
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

      {/* --------------------------------------------- 04 what could you build */}
      <Section labelledBy="apps-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Immersive applications"
          id="apps-heading"
          title="What could you build with immersive technology?"
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '68ch' }}>
          From interactive worlds and product experiences to training, learning and spatial
          applications, the starting point is what you want someone to experience.
        </p>
        <div className="grid grid-3" style={{ marginTop: 30 }}>
          {APPLICATIONS.map(a => (
            <div className="imm-sector" key={a.t}>
              <h3 className="h4">{a.t}</h3>
              <p className="body imm-sector__b">{a.b}</p>
            </div>
          ))}
        </div>
        <p className="body imm-sector__note">
          Something else in mind? Start with the experience you want to create.
        </p>
      </Section>

      {/* -------------------------------------------------- 05 how we build it */}
      {/*
        THE ONE ENGINEERING AND DELIVERY SECTION. It absorbed "Immersive is part
        of the product, not a separate technology island", which was a full-width
        section making a point that belongs next to the build sequence: the two
        together answer "will the thing actually work", which is one question.
      */}
      <Section labelledBy="process-heading">
        <SectionHead
          eyebrow="Engineering first"
          id="process-heading"
          title="The experience is only useful if the product works"
        />
        <div style={{ marginTop: 34 }}>
          <BuildProgression />
        </div>
        <div className="imm-found">
          <p className="body">
            Immersive applications can rely on the same foundations as any other digital product:
            software engineering, APIs, cloud infrastructure, data, security and integrations. We
            bring those pieces together around the experience, as part of{' '}
            <FLink href="/engineering">Engineering</FLink>.
          </p>
          <p className="body" style={{ marginTop: 16 }}>
            We deliver the commissioned application to the agreed specification. Optional ongoing{' '}
            <FLink href="/support-continuous-improvement">support, maintenance and improvement</FLink>{' '}
            are available afterwards if you want them.
          </p>
        </div>
      </Section>

      {/* ------------------------------- 06 the technology follows the experience */}
      {/*
        THE MERGE OF TWO SECTIONS. "The platform follows the experience" and
        "Immersive applications can become intelligent too" were both answering
        "what will you build it with", one for the environment and one for AI, and
        each took a full-width section to do it. Side by side they take one, and
        AI reads as one option among several rather than as a second offer.
      */}
      <Section labelledBy="tech-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Built for the use case"
          id="tech-heading"
          title="The technology follows the experience"
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '68ch' }}>
          We choose the platform and capabilities around what the experience needs to do, rather
          than forcing every project onto the same technology.
        </p>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start', marginTop: 34 }}>
          <div>
            <h3 className="h4">Where it lives</h3>
            {/*
              A list of ENVIRONMENTS, not an SDK wall. The previous site carried a
              grid of engine and framework logos; the brief rules that out, and it
              was answering a question no buyer asks. Engine and framework choice
              is a scoping conversation, and saying so is more useful than a logo.
            */}
            <ul className="imm-platforms" style={{ marginTop: 16 }}>
              {PLATFORMS.map(p => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="small imm-platforms__note">
              The specific engines, frameworks and device SDKs are chosen during scoping, against
              the target devices and the environment the application has to work in.
            </p>
          </div>
          <div>
            <h3 className="h4">When AI adds value</h3>
            <ul className="imm-platforms" style={{ marginTop: 16 }}>
              {AI_ADDS.map(a => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p className="small imm-platforms__note">
              AI is optional. We use it where it materially improves the experience, not because
              every immersive application needs it.
            </p>
            <p style={{ marginTop: 22 }}>
              <FLink href="/ai-automation">Explore AI &amp; Automation</FLink>
            </p>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- 07 FAQ */}
      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      {/* -------------------------------------------------------- closing CTA */}
      {/* PRESERVED. No summary of the page before it, as the brief requires. */}
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
