import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * AR/VR, migrated from the previous site on founder instruction 2026-09-24.
 *
 * THE PATH IS THE OLD ONE, DELIBERATELY. /ar-vr-development-services is what the
 * previous site published and what any inbound link still points at, and the
 * founder chose to keep it rather than take a redirect hop to a new slug. It is
 * the only top-level service path on this site for that reason; it is not a
 * pattern to copy for anything new.
 *
 * `next.config.ts` lists this path among "SEVEN PATHS WHOSE SERVICE WAS DROPPED"
 * and says each needs a decision between an honest destination and a deliberate
 * 410. That decision is now made: the service is offered again, so the path
 * resolves again and no redirect is required. The note there has been updated
 * rather than left contradicting this file.
 *
 * WHAT WAS DELIBERATELY NOT MIGRATED, and why, because the next person to open
 * the old file will wonder where it went:
 *
 *  - THE PERFORMANCE FIGURES. The old page carried a `commitmentData` block
 *    reading 80%, 85%, 60%, 200%, 70%, 3X, 90%, 95%. They are unevidenced, and
 *    they are also visibly not this service's: the captions describe
 *    "Reduction in review analysis time", "Text-to-speech accuracy" and
 *    "Satisfaction with speech quality" on an AR/VR page. That is the exact
 *    defect GO-LIVE-CHECKLIST.md records for the previous site, one
 *    engagement's figures appearing on another engagement's page. Nothing here
 *    would have caught them either: FIGURE_PATTERNS in content/work.ts scans
 *    CASE STUDIES only, so a percentage on a service page passes the build
 *    silently. Reported to the founder rather than quietly imported.
 *
 *  - "6 to 12 weeks". The old FAQ answered the timeline question with that
 *    range. Durations were stripped from this site on 2026-09-01 (OPEN-DECISIONS
 *    C7) because "the numbers are not on record", so reintroducing one here
 *    through a migration would reverse that decision sideways. The question is
 *    still answered, with what actually drives the timeline instead of a figure
 *    nobody can stand behind.
 *
 * The capability set, the platform list and the four questions are the old
 * page's own substance, rewritten into this site's register: British spelling,
 * no "we specialise in", and no claim that an immersive experience transforms
 * anything by existing.
 */

export const metadata = pageMetadata({
  title: 'AR and VR Development',
  description:
    'Augmented and virtual reality built as products rather than demonstrations: interactive 3D environments, training simulations and spatial interfaces for web, mobile and headset.',
  path: '/ar-vr-development-services',
});

const capabilities = [
  {
    title: 'Design and storyboarding',
    body: 'The concept, the spatial layout and the sequence a user actually moves through, settled before anything is modelled. Immersive work fails at this stage more often than at the engineering one.',
  },
  {
    title: 'Application development',
    body: 'Full-cycle builds for web, mobile and headset, with the performance budget treated as a requirement rather than something discovered at the end.',
  },
  {
    title: '3D modelling and asset creation',
    body: 'Environments, textures and spatially accurate objects, built at a fidelity the target device can actually render at frame rate.',
  },
  {
    title: 'Integration and deployment',
    body: 'Connecting the experience to the systems behind it — catalogue, booking, learning record, identity — so it is part of the business rather than a standalone exhibit.',
  },
  {
    title: 'Training and simulation',
    body: 'Procedural and skills-based simulation where the point is competence rather than novelty, including what gets recorded about who completed what.',
  },
  {
    title: 'Support and continuous improvement',
    body: 'Device firmware, SDK versions and store requirements move underneath an immersive product faster than most. Ongoing maintenance is available where required.',
  },
];

const decisions = [
  {
    label: 'Choose AR when',
    body: 'The value is in the real place — seeing the product in the room, the machine annotated while you stand at it, the building shown on the site it will occupy. The user keeps their context.',
  },
  {
    label: 'Choose VR when',
    body: 'The real environment is unavailable, unsafe or expensive to reproduce. Training for a rare failure, walking a building that does not exist yet, rehearsing something you cannot rehearse live.',
  },
  {
    label: 'Choose neither when',
    body: 'A video, a configurator or a well-built web page would do the job. Most immersive projects that go unused were answering a question that did not need three dimensions.',
  },
];

/*
 * The real platform list from the previous page, trimmed to what a reader can
 * act on. The old page rendered twenty-four logos in one row and eighteen in
 * another, which tells a buyer nothing except that a list exists.
 */
const platforms = [
  'Unity',
  'Unreal Engine',
  'ARKit',
  'ARCore',
  'WebXR',
  'Three.js',
  'Babylon.js',
  'Blender',
];

const faqs = [
  {
    q: 'Do these experiences run in a browser, or only in a headset?',
    a: 'Both, and the target is chosen before anything is built rather than after. WebXR and browser-based 3D reach the widest audience with no install and no hardware, and suit anything a customer should be able to open from a link. Headset builds suit training and simulation, where the user is expected to arrive at the equipment. Mobile AR sits between the two and uses the device most people already carry.',
  },
  {
    q: 'Do you handle both the design and the development?',
    a: 'Yes. Concept, storyboarding, 3D modelling, interaction design, engineering and deployment are one engagement rather than a design phase handed to a separate build team. Immersive work suffers particularly badly from that split, because a layout that reads well on a board can be unusable once you are standing inside it.',
  },
  {
    q: 'How long does an AR or VR build take?',
    a: 'It depends on how much of the world has to be built rather than reused, how many systems it has to talk to, and whether the target is a browser, a phone or a headset. Asset creation is usually the long pole and is the part most often underestimated. We give a date at scoping, against a defined scope, rather than quoting a range before anyone has seen what is required.',
  },
  {
    q: 'Can an immersive experience connect to our existing systems?',
    a: 'Yes, and it usually should. A product configurator that does not read the live catalogue, or a training simulation that does not record completion against the learning record, becomes a demonstration nobody maintains. The integration work is part of the build.',
  },
];

export default function ArVrDevelopmentPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'AR and VR Development',
          description:
            'Augmented and virtual reality development: interactive 3D environments, training simulations and spatial interfaces for web, mobile and headset.',
          path: '/ar-vr-development-services',
          serviceType: 'Augmented and virtual reality development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AR and VR Development', path: '/ar-vr-development-services' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Build · AR and VR</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Immersive work built to be used, not demonstrated
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Interactive 3D environments, training simulations and spatial interfaces for web, mobile
            and headset, across property, retail, heritage, healthcare and industry. The measure of
            an immersive product is whether anyone opens it twice.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope a build</Cta>
            <Cta href="/engineering" variant="secondary">
              All engineering
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="arvr-build-heading">
        <SectionHead title="What we build" id="arvr-build-heading" />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {capabilities.map(cap => (
            <div className="card" key={cap.title}>
              <h3 className="h4">{cap.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------- the decision */}
      <Section labelledBy="arvr-choice-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="AR, VR or neither"
              id="arvr-choice-heading"
              title="Immersive is a medium, not an objective"
            />
            <p className="body" style={{ marginTop: 20 }}>
              The failure mode in this field is not technical. It is a well-built experience
              answering a question that never needed three dimensions, commissioned because the
              technology was interesting rather than because the problem called for it.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              So the first conversation is about what the user is trying to do and where they will
              be standing when they do it. If a video or a configurator would serve them better, we
              will say so before the budget is committed rather than after it is spent.
            </p>
          </div>

          <div className="grid" style={{ gap: 16 }}>
            {decisions.map(d => (
              <div
                className="card"
                key={d.label}
                style={
                  d.label === 'Choose neither when'
                    ? { background: '#FBF8F4', borderColor: '#edd8de' }
                    : undefined
                }
              >
                <span
                  className="step__n"
                  style={
                    d.label === 'Choose neither when' ? { color: 'var(--amber-ink)' } : undefined
                  }
                >
                  {d.label}
                </span>
                <p className="body" style={{ marginTop: 4, fontSize: 15 }}>
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------- platforms/after */}
      <Section labelledBy="arvr-platforms-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Platforms and tooling"
              id="arvr-platforms-heading"
              title="Chosen for the target, not for the CV"
            />
            <p className="body" style={{ marginTop: 20 }}>
              A browser experience, a mobile AR feature and a headset simulation are three different
              engineering problems, and the right engine for one is the wrong engine for another.
              The target decides the stack.
            </p>
            <ul className="body" style={{ marginTop: 20, fontSize: 15 }}>
              {platforms.map(p => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow>After the first release</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Device firmware, SDK versions and store requirements move underneath an immersive
              product faster than they do under most software, and an experience that ran perfectly
              at launch can fail on a headset update nobody asked for. Ongoing maintenance is
              available where required; it is not automatic and the product is yours either way.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/support-continuous-improvement">
                Support &amp; Continuous Improvement
              </FLink>
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have something that belongs in three dimensions?" ctaLabel="Scope a build">
        Tell us what the user is trying to do and where they will be standing when they do it. We
        will tell you whether it needs AR, VR, or neither.
      </ClosingCta>
    </>
  );
}
