/**
 * The continuous support cycle: Observe, Prioritise, Improve, Release, Verify,
 * Learn, around a live product.
 *
 * RECREATED, NOT EMBEDDED. The approved reference is a raster render; this is
 * HTML, CSS and one inline SVG ring, so every stage name is real selectable
 * text - indexable, translatable, readable by a screen reader and sharp at any
 * zoom. No image, no video, no animation library, no JavaScript at all: it is a
 * server component and the motion is CSS keyframes.
 *
 * THE DASHBOARD CARRIES NO NUMBERS, DELIBERATELY. The reference shows 99.99%
 * uptime, 24,593 users, 1.2M transactions, a 120ms response time and three
 * percentage deltas. Those are placeholders in a mock, and the brief is explicit
 * that they must not be published as service claims - rendering them here would
 * put an uptime commitment and a response-time promise on a page that offers
 * neither. The panel shows the SHAPE of a product being watched: a nav, a trend
 * line, and three unlabelled readings. Nothing that could be read as an SLA.
 *
 * THE STILL STATE IS THE FINISHED STATE. Everything renders complete with no
 * animation; motion is added only inside `prefers-reduced-motion: no-preference`.
 * Reduced motion therefore gets the whole composition rather than a stripped one,
 * and the cycle is understandable without ever seeing it move.
 *
 * ORDER IS THE ARGUMENT. The six stages are placed clockwise from the top -
 * Observe, Prioritise, Improve, Release, Verify, Learn - in a three-by-three
 * grid with the product in the middle. On a phone that grid becomes one column
 * in the same reading order, with the product first, because a six-item orbit at
 * 390px is unreadable and shrinking it would be the failure the brief names.
 */

const STAGES = [
  { k: 'observe', t: 'Observe', b: 'Monitoring, alerts and user feedback' },
  { k: 'prioritise', t: 'Prioritise', b: 'Severity, risk and value' },
  { k: 'improve', t: 'Improve', b: 'Fix, enhance and automate' },
  { k: 'release', t: 'Release', b: 'Test and deploy with confidence' },
  { k: 'verify', t: 'Verify', b: 'Is it better? Measure the result' },
  { k: 'learn', t: 'Learn', b: 'Feed insights into the next cycle' },
];

export function SupportLifecycle() {
  return (
    <figure className="slc">
      <p className="visually-hidden">
        A continuous product-support cycle moves from monitoring and prioritisation through
        improvement, release and verification before feeding what was learned into the next cycle.
      </p>

      {/* The ring sits behind everything and is decoration: the order is carried
          by the stage text and by the reading order of the grid, not by this. */}
      <svg aria-hidden className="slc__ring" viewBox="0 0 100 100" preserveAspectRatio="none">
        <ellipse cx="50" cy="50" rx="47" ry="42" />
      </svg>

      {STAGES.map((s, i) => (
        <div
          className={`slc__stage slc__stage--${s.k}`}
          key={s.k}
          style={{ '--i': i } as React.CSSProperties}
        >
          <span aria-hidden className="slc__dot" />
          <b className="slc__t">{s.t}</b>
          <span className="slc__b">{s.b}</span>
        </div>
      ))}

      {/* The product under care. Neutral by construction - see the note above on
          why there is not a single figure in here. */}
      <div className="slc__product">
        <div className="slc__chrome">
          <span className="slc__name">Your product</span>
          <span className="slc__live">Live</span>
        </div>
        <div className="slc__body">
          <ul aria-hidden className="slc__nav">
            <li className="is-on">Overview</li>
            <li>Users</li>
            <li>Activity</li>
            <li>Performance</li>
            <li>Releases</li>
          </ul>
          <div className="slc__panel">
            <svg aria-hidden className="slc__trend" viewBox="0 0 200 60" preserveAspectRatio="none">
              <polyline points="0,46 18,42 36,47 54,36 72,39 90,30 108,33 126,22 144,26 162,16 180,12 200,6" />
            </svg>
            <div aria-hidden className="slc__readings">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

export default SupportLifecycle;
