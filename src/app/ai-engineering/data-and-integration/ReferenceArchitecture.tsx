/**
 * Reference architecture, built as markup rather than an exported image
 * (ADR-0009), so every label is indexable text, reflows on a phone, and reaches
 * a screen reader as structured lists.
 *
 * Four columns, left to right, as the design draws them. The second is marked
 * "what we build" on the board and is styled to stand out, because the
 * distinction is the commercial point of the page: the systems of record are
 * already yours, and the access layer is the part that does not exist yet.
 */

type Column = {
  name: string;
  /** Set on the column the design labels as Pixelette's own work. */
  ours?: boolean;
  note?: string;
  items: string[];
};

const columns: Column[] = [
  {
    name: 'Systems of record',
    items: ['Salesforce', 'SAP / NetSuite', 'SharePoint', 'Case management', 'Internal APIs'],
  },
  {
    name: 'Access layer',
    ours: true,
    note: 'What we build',
    items: ['Identity & entitlements', 'MCP connectors', 'Context & semantic layer', 'Audit log'],
  },
  {
    name: 'Application',
    items: [
      'Workflow',
      'Model / agent layer',
      'Deterministic steps',
      'Tool calls',
      'Human review point',
      'Output to system of record',
    ],
  },
  {
    name: 'Evaluation & ops',
    items: [
      'Trace collection',
      'Golden datasets',
      'Judge pipeline, sampled',
      'Drift detection',
      'Cost telemetry',
      'Incident alerting',
      'Monthly report',
    ],
  },
];

export function ReferenceArchitecture() {
  return (
    <div className="arch">
      <ol className="arch__cols" aria-label="Reference architecture, from systems of record through to evaluation and operations">
        {columns.map((col, i) => (
          <li className={`arch__col${col.ours ? ' arch__col--ours' : ''}`} key={col.name}>
            <p className="arch__col-name mono">
              {col.name}
              {col.note ? <span className="arch__col-note"> · {col.note}</span> : null}
            </p>
            <ul className="arch__items">
              {col.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {i < columns.length - 1 ? <span className="arch__flow" aria-hidden /> : null}
          </li>
        ))}
      </ol>

      <p className="arch__gate mono">Regression gate</p>

      <p className="arch__note">
        Open standards throughout, so the observability backend can be swapped without
        re-instrumenting anything.
      </p>
    </div>
  );
}
