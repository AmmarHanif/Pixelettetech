import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'NLP, Speech & Vision',
  description:
    'Extraction, classification, sentiment, speech and image or video intelligence, built where the use case supports it and graded against a definition of correct.',
  path: '/ai-engineering/language-speech-vision',
});

const capabilities = [
  {
    title: 'Document extraction',
    body: 'Pulling structured fields out of invoices, forms, contracts, statements and correspondence, including the scanned, rotated and photographed versions that arrive in real post rooms.',
  },
  {
    title: 'Classification and routing',
    body: 'Deciding what a message, case or document is and where it should go. Usually the highest-value language task in a business, and the least glamorous.',
  },
  {
    title: 'Sentiment and theme analysis',
    body: 'What customers are actually saying across reviews, tickets and calls, aggregated into themes a team can act on rather than a single number nobody trusts.',
  },
  {
    title: 'Speech to text and voice interfaces',
    body: 'Transcription, diarisation, call summarisation and voice-driven interaction, with accent and audio-quality performance measured on your recordings rather than a vendor benchmark.',
  },
  {
    title: 'Image and video intelligence',
    body: 'Detection, classification, condition assessment and quality checking, where the visual task is defined tightly enough for a consistent answer to exist.',
  },
  {
    title: 'Multilingual handling',
    body: 'Detection, translation and language-specific behaviour, with the accuracy stated per language instead of averaged into a flattering headline.',
  },
];

const discipline = [
  {
    title: 'Define correct first',
    body: 'Two people labelling the same hundred documents will disagree. Where they disagree, no system can be graded, so the definition is settled before the build.',
  },
  {
    title: 'Confidence drives routing',
    body: 'High-confidence output flows through; low-confidence output goes to a person. That threshold is the main control you have, and it is yours to set.',
  },
  {
    title: 'Measured on your material',
    body: 'Performance on a public benchmark tells you very little about performance on your forms, your accents and your photographs.',
  },
  {
    title: 'Accuracy stated per class',
    body: 'An overall figure hides the category that matters. We report per class, including the rare ones, because that is where the cost of an error usually lives.',
  },
];

const faqs = [
  {
    q: 'What language, speech and vision work do you take on?',
    a: 'Document extraction, classification and routing, sentiment and theme analysis, speech to text with diarisation and summarisation, image and video intelligence, and multilingual handling. The qualifier that matters is whether the use case supports it: the task has to be defined tightly enough that a consistent correct answer exists.',
  },
  {
    q: 'How accurate will an extraction or classification system be?',
    a: 'That cannot honestly be answered before it is measured on your own material, because performance on public benchmarks says little about performance on your forms, accents and photographs. The engagement establishes accuracy per class against a labelled set built from real cases, and the confidence threshold that routes uncertain output to a person is set from those results.',
  },
  {
    q: 'What happens to the cases the system is unsure about?',
    a: 'They go to a person. Confidence-based routing is the primary control in this category: high-confidence output flows through, low-confidence output is queued for human review with the reason attached, and the volume in that queue is reported so the threshold can be tuned deliberately rather than discovered.',
  },
];

export default function LanguageSpeechVisionPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'NLP, Speech & Vision',
          description:
            'Document extraction, classification, sentiment and theme analysis, speech to text, image and video intelligence and multilingual handling.',
          path: '/ai-engineering/language-speech-vision',
          serviceType: 'Natural language, speech and computer vision engineering',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI & Automation', path: '/ai-engineering' },
          { name: 'NLP, Speech & Vision', path: '/ai-engineering/language-speech-vision' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Automate · Language, Speech &amp; Vision</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Reading, listening and looking, where the use case supports it
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Extraction, classification, sentiment, speech and image or video intelligence. That
            closing qualifier is doing real work: these systems are excellent at tasks with a
            consistent correct answer and unreliable at tasks without one.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            <Cta href="/ai-engineering" variant="secondary">
              All AI &amp; automation
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="lsv-build-heading">
        <SectionHead title="What we build" id="lsv-build-heading" />
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

      {/* ------------------------------------------------------- discipline */}
      <Section labelledBy="lsv-disc-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="How these are built responsibly"
          id="lsv-disc-heading"
          title="Four rules that decide whether it survives contact with real inputs"
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {discipline.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 30, maxWidth: '76ch' }}>
          None of this is exotic. It is the ordinary discipline of measuring a system against a
          labelled set built from real cases, and it is what separates a capability from a
          demonstration.
        </p>
      </Section>

      {/* ------------------------------------------------------------ limits */}
      <Section labelledBy="lsv-limits-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Where we say no"
              id="lsv-limits-heading"
              title="Some of these tasks should not be automated at all"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Inferring emotion, intent, character or truthfulness about a person from their voice,
              face or writing is a category we treat with considerable caution: the evidence base is
              weak, the failure modes fall unevenly across groups, and the consequences of being
              wrong land on an individual.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Sentiment about a product in a review is a different proposition from a judgement about
              a person in an interview, and we will draw that line explicitly rather than quietly
              build whatever was asked for.
            </p>
          </div>

          <div>
            <Eyebrow>Where it pays quickly</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              The reliable wins are unglamorous: extracting fields from documents that currently get
              typed in twice, classifying and routing inbound work that a person triages by hand, and
              summarising calls that otherwise generate a note nobody writes.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Each of those has a countable current cost, which means the value is provable rather
              than asserted.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering/value-discovery" variant="secondary">
                Start with the baseline
              </Cta>
            </div>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-engineering/evaluation-and-observability">
                How we grade output quality
              </FLink>
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a pile of documents, calls or images?">
        Send us a description of what is in it and what someone currently does with it by hand. We
        will tell you whether the task is well enough defined to automate.
      </ClosingCta>
    </>
  );
}
