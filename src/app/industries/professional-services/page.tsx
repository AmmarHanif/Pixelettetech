import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  Faqs,
  JsonLd,
  MediaSlot,
  Placeholder,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { professionalServicesStats } from '@/content/sources';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Two dead imports removed 2026-09-08: `next/link` and `caseStudies`.
 *
 * `caseStudies` is the one worth recording. This page used to render the
 * internal `pixelette-group-bid-cycle` study ("We ran LIVE on ourselves before
 * we sold it") as its sector proof; that study was withdrawn on 7 September
 * 2026 (commit 738be7c), the render was taken out, and the import was left
 * behind. An import that nothing reads is how a removed claim keeps looking
 * supported: the file still appeared to depend on the case-study data. The
 * copy that outlived the study is corrected below.
 */

export const metadata = pageMetadata({
  title: 'AI for professional services',
  description:
    '78% of UK corporate clients call AI-enabled quality improvement essential. 7% say providers deliver it. We close that gap and give you the evidence.',
  path: '/industries/professional-services',
});

const opportunities = [
  {
    title: 'Client reporting and deliverable production',
    body: 'Where the hours go, and the easiest place to show a client a measured improvement.',
  },
  /*
   * Was: "The process we ran on ourselves first, which is why we can show you
   * the working."
   *
   * The working could no longer be shown. That sentence was written against the
   * internal case study `pixelette-group-bid-cycle` — "We ran LIVE on ourselves
   * before we sold it" — which was withdrawn from publication on 7 September
   * 2026 (commit 738be7c, alongside the anonymised professional-services study
   * that was this page's other proof point). The claim survived its evidence by
   * a day and pointed at nothing: a reader who accepted the invitation and went
   * looking for the working would find no such case study anywhere on the site.
   *
   * Not repointed, because there is nothing to repoint it at: no remaining case
   * study covers a bid or proposal cycle, and re-asserting "we ran it on
   * ourselves" in prose would republish a withdrawn claim through a side door
   * while the study itself stays unpublished. The promise is removed instead.
   * What replaces it says why this process is a good first target, which is the
   * job the card is actually doing in a list of four opportunities.
   */
  {
    title: 'Bid and proposal cycle',
    body: 'Repetitive assembly against a deadline, with a win-rate already attached to it — which makes the before and after unusually easy to measure.',
  },
  {
    title: 'Knowledge and precedent retrieval',
    body: 'With entitlements respected, which is the part that stops most firms rolling it out.',
  },
  {
    /* "Formal certification of it runs through Pixelette Certified" said a
       Pixelette company certifies, which the handoff's ACCREDITATION-SAFE RULE
       forbids until the exact legal entity and status are verified (claims.ts
       `certified-cross-sell`). The route is what can be described, so it is. */
    title: 'Client-facing AI evidence pack',
    body: 'The technical evidence a client asks for when they want to know how AI touched their matter. Where that has to become a formal assurance position, Pixelette Certified can scope the route to independent assessment.',
  },
];

const faqs = [
  {
    q: 'Why are professional services clients asking what AI has done for them?',
    /*
     * "One in five is prepared to move within twelve months" was removed from
     * this answer on 2026-09-08, along with its copy in the hero lead below.
     *
     * It was not attributed anywhere. It is not a row in
     * `professionalServicesStats`, which holds exactly four figures — 78%, 7%,
     * £20bn and 71% — and it is in no other register in src/content/sources.ts
     * either. It appears nowhere in the founder's handoff
     * (design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt): "one in five",
     * "twelve months", "Thomson Reuters", "78%" and "20bn" all return nothing
     * against that file. Its entire support was sharing a sentence with two
     * figures that ARE attributed, and sitting next to a citation is not being
     * cited.
     *
     * It was removed rather than credited to Thomson Reuters, because crediting
     * it would have been inventing an attribution — and this answer is emitted
     * as FAQPage JSON-LD, so an invented one would be published
     * machine-readably as well as visibly. The other "one in five" in this
     * codebase is not the same claim and does not rescue it: it is "fewer than
     * one in five organisations tracks ROI on AI" on
     * /ai-engineering/ai-value-baseline, from a different Thomson Reuters study
     * (February 2026, n=1,500+).
     *
     * To restore it: add it to `professionalServicesStats` with the study,
     * table and sample it comes from, and it can be stated here again.
     *
     * The three figures that remain are all registered rows carrying that exact
     * source, so the parenthetical attribution is now true of every number in
     * the answer rather than of two of the three.
     */
    a: '78% of UK corporate clients say AI-enabled quality improvement is essential or very important, while only 7% say their providers are actually delivering it. Around £20bn of UK client revenue is under active reconsideration (Thomson Reuters Future of Professionals 2026, UK sample).',
  },
  {
    q: 'What separates firms that get value from AI from those that do not?',
    a: 'A named strategy. Firms with one reach their expected value 66% of the time; firms without one, 22% (Thomson Reuters Future of Professionals 2026). The gap in this sector is not adoption — most firms have bought the tools — it is being able to walk a client through what changed, with a number.',
  },
];

/**
 * The attribution under the hero tiles, derived and counted rather than typed.
 *
 * 2026-09-08 (WP13). Two faults in one line, `All four figures:
 * {professionalServicesStats[0]!.source}`.
 *
 * The crash. `[0]!` asserts to the compiler that the register has a first
 * element. It does not have to: `professionalServicesStats` is a register that
 * holds figures back, and an empty one throws "TypeError: Cannot read
 * properties of undefined (reading 'source')" at render while `tsc --noEmit`
 * stays green, because a non-null assertion is exactly a promise not to check.
 * The same line on /ai-engineering/support-and-run took that page down this
 * morning when its three figures were held for an unnameable publisher.
 *
 * The false statement. "four" was typed into the copy. Hold any one of the
 * four — which is one `published: false` away — and the page prints three
 * tiles under a note that says all four are attributed. A count in prose that
 * counts nothing is a claim about evidence that the evidence does not support,
 * which is the whole thing the registers exist to stop. Counting the array
 * cannot drift from it.
 *
 * Sources are de-duplicated rather than indexed for the same reason as
 * elsewhere in the estate: if the figures ever come from two studies, `[0]`
 * would silently attribute all of them to whichever sat first. All four cite
 * Thomson Reuters today, so the set is one string and the rendered line is
 * character-for-character what it was.
 */
const FIGURE_COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/**
 * Returns the credit prefix, including its trailing space.
 *
 * The space belongs to the prefix so that the note keeps the two text children
 * it has always had. React inserts a separator between adjacent text nodes in
 * the server render, so collapsing the line into a single string would change
 * the shipped HTML for the sake of tidiness — the fix is meant to be invisible
 * while the data is intact.
 */
function figureCredit(count: number): string {
  if (count === 1) return 'The figure above: ';
  if (count === 2) return 'Both figures: ';
  const word = FIGURE_COUNT_WORDS[count] ?? String(count);
  return `All ${word} figures: `;
}

function heroSources(): string[] {
  return Array.from(new Set(professionalServicesStats.map(stat => stat.source)));
}

export default function ProfessionalServicesPage() {
  const sources = heroSources();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          /* Was '/industries/professional-services', making positions 2 and 3
             identical URLs in one trail. /industries now exists. */
          { name: 'Industries', path: '/industries' },
          { name: 'Professional & business services', path: '/industries/professional-services' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Industries · Professional & business services</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            Your clients have started asking what AI has done for them
          </h1>
          {/* Third sentence removed 2026-09-08 — see the note on `faqs[0]` above
              for why "one in five is prepared to move within twelve months" could
              not be attributed and was not guessed at.

              The two figures that remain are gated on the register that carries
              them. Their attribution is the SourceNote under the tile row below,
              and that note is gated on `professionalServicesStats` being
              non-empty — so without this gate, holding either row would leave
              the prose asserting 78% and 7% with no attribution anywhere on the
              page. A figure outliving its citation is the defect the register
              exists to prevent, and it had a way in through the lead.

              With the register intact the sentence renders character-for-
              character as before: JSX collapses the wrapped literal it replaces
              into the same single text node. The empty branch states the same
              commercial pressure without a number, so the hero does not lose its
              lead paragraph.

              The FAQ answer above is deliberately NOT gated the same way. It
              names Thomson Reuters inline, so its figures stay attributed in the
              text itself whatever the register does; this paragraph does not,
              which is exactly the difference. */}
          <p className="lead" style={{ marginTop: 24 }}>
            {professionalServicesStats.length > 0
              ? '78% of UK corporate clients say AI-enabled quality improvement is essential or very important. 7% say their providers are actually delivering it.'
              : 'UK corporate clients have started treating AI-enabled quality improvement as essential, and far fewer of them say their providers are delivering it.'}
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            <Cta href="/industries/insurance-financial-services" variant="secondary">
              Insurance & specialist FS
            </Cta>
          </div>

          {/* Tiles use the compressed label where the board has one: the first
              two claims are stated in full in the lead directly above, so
              repeating them verbatim reads as padding and crowds the tile.

              The tile row and its attribution are one unit and are gated
              together: an empty `.grid.grid-4` is a 48px band of nothing
              under the CTAs, not a neutral no-op, and an attribution with no
              figures above it credits a study for nothing. With the register
              intact the hero is unchanged; with it empty the hero ends on its
              CTA row, which is the DEVELOPER RULE's "absence must not leave a
              broken layout". */}
          {professionalServicesStats.length > 0 ? (
            <>
              <div className="grid grid-4" style={{ marginTop: 48 }}>
                {professionalServicesStats.map(stat => (
                  <div className="tile" key={stat.value + stat.label}>
                    <b>{stat.value}</b>
                    <span>{stat.shortLabel ?? stat.label}</span>
                  </div>
                ))}
              </div>
              {sources.length > 0 ? (
                <SourceNote>
                  {figureCredit(professionalServicesStats.length)}
                  {sources.join(' · ')}
                </SourceNote>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------------- gap */}
      <Section labelledBy="ps-gap-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead title="The gap is not adoption. It is evidence." id="ps-gap-heading" />
            <p className="body" style={{ marginTop: 20 }}>
              Most firms in this sector have bought AI tools. Very few can walk a client through what
              changed, with a number. That is now a commercial risk rather than a technology one, and
              it is fixable in a quarter.
            </p>
          </div>
          <div className="card">
            <p className="quote">
              Firms with a named AI strategy reach their expected value 66% of the time. Firms without
              one, 22%.
            </p>
            <SourceNote>Thomson Reuters Future of Professionals 2026</SourceNote>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginTop: 44 }}>
          {opportunities.map(o => (
            <div className="card" key={o.title}>
              <h3 className="h4">{o.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 14.5 }}>
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ sector work */}
      <Section labelledBy="ps-work-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Sector work" id="ps-work-heading" title="Published as it is measured" />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {[0, 1, 2].map(i => (
            <div className="work-card work-card--empty" key={i}>
              <MediaSlot label="Case study image" />
              <span className="mono work-card__kicker">
                <Placeholder>CLIENT</Placeholder>
              </span>
              <h3 className="h4" style={{ marginTop: 10 }}>
                <Placeholder>NAMED PROCESS AND RESULT</Placeholder>
              </h3>
              <p className="small" style={{ marginTop: 10 }}>
                <Placeholder>MEASURED FIGURE</Placeholder>
              </p>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 24, fontStyle: 'italic' }}>
          Placeholders stay visible until a real engagement fills them. We do not use stock case
          studies.
        </p>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Being asked by clients what AI has done for them?">
        The baseline gives you the answer in four weeks, with the measurement to back it.
      </ClosingCta>
    </>
  );
}
