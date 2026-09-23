/**
 * The LIVE method, as a diagram.
 *
 * Built from real elements rather than an exported image so it stays legible at
 * every breakpoint, reads as an ordered list to a screen reader, and is
 * indexable as text. The design draws this as an SVG; rendering the same
 * content as markup keeps every label in the HTML where it can be found.
 *
 * Two variants, matching the two boards that carry it:
 *
 *  - `compact` (board 04) — the four stages mapped to the service that
 *    delivers each, on a pilot-to-production rail.
 *  - `full` (board 08) — the same spine exploded into what each stage
 *    actually contains, plus the evidence layer and the measurement band.
 */

import { certified } from '@/content/company';

type Stage = {
  n: string;
  letter: string;
  name: string;
  /** The service that delivers this stage. Board 04 shows these. */
  service: string;
  /** One-line summary. */
  line: string;
  commercial: string;
  /** What the stage contains. Board 08 shows these. */
  items: string[];
};

const stages: Stage[] = [
  {
    n: '01',
    letter: 'L',
    name: 'Land',
    service: 'Value Discovery',
    line: 'Instrument two or three processes and measure the real current-state numbers.',
    commercial: 'Quoted before we start',
    items: ['CRM / ERP', 'Case management', 'Documents'],
  },
  {
    n: '02',
    letter: 'I',
    name: 'Integrate',
    service: 'Data & integration',
    line: 'Make the data reachable, permissioned and observable.',
    commercial: 'Fixed-scope phases',
    items: [
      'Entitlement-aware access',
      'Context layer · MCP',
      'Lineage & permissions',
      'Instrumentation',
    ],
  },
  {
    n: '03',
    letter: 'V',
    name: 'Verify',
    service: 'Production system',
    line: 'Build the system, redesign the workflow around it, prove it against thresholds.',
    commercial: 'Outcome-linked where evidenced',
    items: [
      'Redesigned workflow',
      'Model / agent layer',
      'Tools & deterministic steps',
      'Human review points',
    ],
  },
  {
    n: '04',
    letter: 'E',
    name: 'Evolve',
    /*
     * "Optional" added 2026-09-23 on founder instruction: as the last stage of
     * a numbered rail this read as the automatic end of every engagement.
     *
     * `service` is rendered by the COMPACT variant only, which is the homepage
     * sequence the instruction names. The full variant on /method/live renders
     * `commercial` instead and is deliberately not touched here.
     */
    service: 'Optional Support & Continuous Improvement',
    line: 'Run it, watch it, cost it, improve it.',
    /*
     * "Optional" added 2026-09-23 on founder instruction. This column asserted a
     * retainer as the commercial model of the final stage, which reads as the
     * default ending of every engagement rather than a choice.
     */
    commercial: 'Optional, retainer plus usage',
    items: [
      'Evaluation harness',
      'Drift & judge-drift watch',
      'Cost & incident control',
      'Quarterly improvement',
    ],
  },
];

const EVIDENCE_ARTEFACTS =
  'Model inventory · impact assessment · risk register · audit trail · human oversight procedure · incident response';

/**
 * The governance route, in the handoff's own accreditation-safe words.
 *
 * 2026-09-08. This diagram used to say "Certification of it sits with Pixelette
 * Certified" (compact) and label its evidence layer "certified separately by
 * Pixelette Certified" (full). Both assert that a Group company issues
 * certificates, which the handoff's ACCREDITATION-SAFE RULE forbids unless the
 * exact legal entity and status have been verified — and `claims.ts`
 * (`certified-cross-sell`) records that they have not been. Because this file
 * is rendered by /ai-automation and by /method/live, the unsafe form was
 * published on two pages from one string.
 *
 * Composed from `certified` in src/content/company.ts rather than retyped, so
 * the claim-bearing sentence is the same object the founder's section 12
 * wording lives in and the same one `CertifiedHandoff` renders. A page cannot
 * now drift back into an unsafe form on its own: there is one sentence, in one
 * place, imported twice.
 *
 * The leading clause names the entity in full because the diagram has to stand
 * on its own. /ai-automation introduces Pixelette Certified twice before this
 * point and /method/live never introduces it at all, and a component cannot see
 * the copy around it — writing the short form here and relying on the host page
 * to have explained it is exactly the coupling that leaves one page reading
 * correctly and another reading like a stray proper noun. The clause makes no
 * accreditation claim: it restates `certified.blurb`, which is already
 * published as it stands on /assurance and /certifications.
 */
const GOVERNANCE_ROUTE = `${certified.name} is the group’s governance practice. ${certified.positioningLine}`;

export function LiveDiagram({ variant = 'full' }: { variant?: 'compact' | 'full' }) {
  if (variant === 'compact') {
    return (
      <div className="live">
        <div className="live__rail" aria-hidden>
          <span>Pilot</span>
          <span className="live__rail-line" />
          <span>In production</span>
          <span className="live__rail-line live__rail-line--short" />
          <span>Ongoing</span>
        </div>

        <ol className="live__stages" aria-label="The four stages of the LIVE method">
          {stages.map((stage, i) => (
            <li className="live__stage" key={stage.n}>
              <span className="live__n mono">{stage.n}</span>
              <p className="live__name">{stage.name}</p>
              <p className="live__service">{stage.service}</p>
              {i < stages.length - 1 ? <span className="live__arrow" aria-hidden /> : null}
            </li>
          ))}
        </ol>

        <aside className="live__evidence">
          <span className="live__evidence-title mono">Evidence</span>
          <p>
            Measurement, evaluation, audit trail and human oversight at every stage.{' '}
            {GOVERNANCE_ROUTE}
          </p>
        </aside>
      </div>
    );
  }

  return (
    <div className="live">
      <ol className="live__stages live__stages--full" aria-label="The four stages of the LIVE method">
        {stages.map((stage, i) => (
          <li className="live__stage" key={stage.n}>
            <span className="live__letter" aria-hidden>
              {stage.letter}
            </span>
            <p className="live__name">
              {stage.name}
              {i === 0 ? <span className="live__qualifier"> · measured first</span> : null}
            </p>
            <ul className="live__items">
              {stage.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="live__commercial mono">{stage.commercial}</p>
            {i < stages.length - 1 ? <span className="live__arrow" aria-hidden /> : null}
          </li>
        ))}
      </ol>

      <p className="live__loop mono">Feedback loop: Evolve returns to Land</p>

      {/* The label is a 10px uppercase mono slot on one line, so it holds the
          layer name only and the route goes in the body beneath it, where
          there is room for it. It is also shorter than the line it replaces,
          so nothing that fitted before can overflow now. */}
      <aside className="live__evidence">
        <span className="live__evidence-title mono">Evidence layer</span>
        <p>{EVIDENCE_ARTEFACTS}</p>
        <p>{GOVERNANCE_ROUTE}</p>
      </aside>

      <aside className="live__evidence live__evidence--measure">
        <span className="live__evidence-title mono">Measured throughout</span>
        <p>
          Baseline established before anything is built · the same metric reported every month
          afterwards
        </p>
      </aside>
    </div>
  );
}
