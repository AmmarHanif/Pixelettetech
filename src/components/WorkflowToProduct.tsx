/**
 * "From workflow to software" — the Custom Software & SaaS explanatory visual.
 *
 * BUILT NATIVELY RATHER THAN EMBEDDED AS THE SUPPLIED MP4, which the brief asks
 * to be assessed rather than assumed (§6). Native won on its own terms - real
 * text, responsive, reduced-motion control, a fraction of the bytes - but the
 * supplied film also settled it: its baked lettering reads "Delivery" twice in a
 * six-stage workflow, and "APIs" twice with one spelt "APIS". Embedding it would
 * publish those. Every label here is HTML, so it is correct, sharp at any zoom,
 * translatable and readable by a screen reader (§15).
 *
 * THE SHAPE IS THE ARGUMENT: MANY BECOME ONE. Six illustrative business stages
 * run across the top, each drops a connector into a single rail, and the rail
 * feeds one product. Underneath it, the foundations that product rests on. That
 * is deliberately NOT the shape of the Web Platforms visual, which is a round
 * trip out from a centre and back (§10) - the two must not normalise into one
 * component with different labels, so they are separate files with separate
 * layouts and separate stylesheets.
 *
 * NOTHING HERE CLAIMS A CLIENT SYSTEM (§4). The stages are introduced in the
 * copy as illustrative, and the component renders no company, sector or logo.
 *
 * NO JAVASCRIPT AND NO ANIMATION LIBRARY (§18). It is a server component: CSS
 * keyframes for the sequence, CSS :hover for the restrained emphasis in §14.
 * The animation is ADDITIVE - the static composition is the finished state, and
 * motion is layered on only under `prefers-reduced-motion: no-preference`, so
 * reduced motion gets the complete picture rather than a stripped one (§17).
 */

const STAGES = [
  { t: 'Enquiry', d: 'Someone asks' },
  { t: 'Quote', d: 'Priced and sent' },
  { t: 'Approval', d: 'Signed off' },
  { t: 'Delivery', d: 'Work happens' },
  { t: 'Customer', d: 'Kept informed' },
  { t: 'Reporting', d: 'What it tells you' },
];

const FOUNDATIONS = ['Permissions', 'APIs', 'Integrations', 'Data'];

export function WorkflowToProduct() {
  return (
    <figure className="wtp">
      {/* The one description a screen reader needs, in place of the decorative
          geometry. The labels themselves are real text and are read normally. */}
      <p className="visually-hidden">
        An illustrative business workflow moves from enquiry through delivery and reporting before
        converging into a bespoke software product supported by permissions, APIs, integrations and
        data.
      </p>

      <ol className="wtp__stages">
        {STAGES.map((s, i) => (
          <li className="wtp__stage" key={s.t} style={{ '--i': i } as React.CSSProperties}>
            <span className="wtp__stage-t">{s.t}</span>
            <span className="wtp__stage-d">{s.d}</span>
            <span aria-hidden className="wtp__drop" />
          </li>
        ))}
      </ol>

      <div aria-hidden className="wtp__rail">
        <span className="wtp__rail-run" />
      </div>

      <div aria-hidden className="wtp__feed" />

      <div className="wtp__product">
        <span aria-hidden className="wtp__layer wtp__layer--c" />
        <span aria-hidden className="wtp__layer wtp__layer--b" />
        <span className="wtp__layer wtp__layer--a">
          <span className="wtp__product-t">One product, built to fit</span>
        </span>
      </div>

      <ul className="wtp__foundations">
        {FOUNDATIONS.map((f, i) => (
          <li className="wtp__foundation" key={f} style={{ '--i': i } as React.CSSProperties}>
            {f}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default WorkflowToProduct;
