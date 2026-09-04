/**
 * The monthly operating view, as an interface mock.
 *
 * Every figure here is illustrative sample data and the page says so directly
 * beneath it. It is a mock of our own reporting format, not a screenshot of a
 * client system, and it must never be presented as one.
 */

const metrics = [
  { label: 'Pass rate', value: '94.2%', note: 'threshold 90% · +1.4pt', good: true },
  { label: 'Cases handled', value: '18,402', note: '+7% on prior period' },
  { label: 'Cost / case', value: '£0.031', note: 'budget £0.05 · caching on' },
  { label: 'Open incidents', value: '1', note: 'SEV-3 · drift on intake form v4' },
];

/** Thirty daily pass-rate readings against a 90% threshold. */
const series = [
  93.1, 93.4, 93.8, 94.0, 93.6, 94.2, 94.5, 94.1, 93.9, 94.4, 94.8, 94.6, 94.2, 93.7, 92.9, 91.4,
  89.8, 90.6, 93.2, 94.0, 94.3, 94.6, 94.9, 94.4, 94.1, 94.5, 94.7, 94.3, 94.0, 94.2,
];

const THRESHOLD = 90;
const MIN = 88;
const MAX = 96;

export function OperatingDashboard() {
  const w = 720;
  const h = 150;
  const step = w / (series.length - 1);
  const y = (v: number) => h - ((v - MIN) / (MAX - MIN)) * h;
  const path = series.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const thresholdY = y(THRESHOLD).toFixed(1);

  return (
    <div className="dash">
      <div className="dash__head">
        <span className="dash__id mono">claims-triage-prod</span>
        <span className="dash__badge">Healthy</span>
        <span className="dash__stamp mono">Last 30 days · updated 4 min ago</span>
      </div>

      <div className="dash__metrics">
        {metrics.map(m => (
          <div className="dash__metric" key={m.label}>
            <span className="dash__metric-label mono">{m.label}</span>
            <b className={m.good ? 'dash__metric-value dash__metric-value--good' : 'dash__metric-value'}>
              {m.value}
            </b>
            <span className="dash__metric-note">{m.note}</span>
          </div>
        ))}
      </div>

      <figure className="dash__chart">
        <figcaption className="dash__chart-title mono">
          Evaluation pass rate, 30 days
          <span className="dash__legend">
            <span className="dash__legend-key dash__legend-key--line" aria-hidden /> pass rate
            <span className="dash__legend-key dash__legend-key--threshold" aria-hidden /> threshold
          </span>
        </figcaption>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="dash__svg"
          role="img"
          aria-label="Evaluation pass rate over thirty days, staying above the ninety percent threshold apart from a dip on 18 August caused by a model version change that was rolled back in forty-one minutes."
        >
          <line
            x1="0"
            y1={thresholdY}
            x2={w}
            y2={thresholdY}
            stroke="#b3063c"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <path d={path} fill="none" stroke="#d9b8f0" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="dash__axis mono">
          <span>1 Aug</span>
          <span className="dash__event">18 Aug · model version change detected, rolled back in 41 min</span>
          <span>30 Aug</span>
        </div>
      </figure>
    </div>
  );
}
