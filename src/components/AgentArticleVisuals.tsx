/**
 * The two diagrams for "Where should AI agents actually work?"
 *
 * BOTH ARE CONCEPTUAL AND NEITHER IS A PIXELETTE PROJECT. The article uses a
 * customer enquiry and a game companion as illustrative settings, so the visuals
 * have to carry that framing themselves: a reader who looks at the pictures and
 * not the prose must not come away thinking either is client work. Nothing here
 * depicts a real product, a real studio's characters or a real customer.
 *
 * THE GAME HALF IS DELIBERATELY GENERIC. The article cites Ubisoft's Teammates
 * as somebody else's playable experiment; the illustration must not borrow its
 * characters, artwork or branding. What is drawn is terrain, a player marker and
 * a companion marker - the shape of the idea, not the shape of anyone's game.
 *
 * VISUAL 2 IS HTML AND CSS, NOT ONE WIDE SVG. Its labels are the content, and
 * real text reflows on a phone, scales with the reader's type size and is read
 * in order by a screen reader. A single fixed-width SVG would have needed a
 * separate text alternative saying the same thing twice.
 */

/* ------------------------------------------------- visual 1: two outcomes -- */

/** An enquiry arriving, information scattered across systems, a draft held for review. */
function ServiceScene() {
  return (
    <svg
      aria-hidden
      className="tw__art"
      viewBox="0 0 260 170"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* the incoming enquiry */}
      <rect className="tw__card" x="14" y="16" width="86" height="40" rx="6" />
      <line className="tw__rule" x1="24" y1="30" x2="76" y2="30" />
      <line className="tw__rule" x1="24" y1="40" x2="62" y2="40" />
      <path className="tw__flow" d="M100 36 H132" />
      <path className="tw__tip" d="M126 31 L132 36 L126 41" />

      {/* scattered customer information: four fragments, deliberately unaligned */}
      <rect className="tw__frag" x="140" y="10" width="44" height="18" rx="4" />
      <rect className="tw__frag" x="196" y="22" width="36" height="18" rx="4" />
      <rect className="tw__frag" x="146" y="40" width="52" height="18" rx="4" />
      <rect className="tw__frag" x="206" y="52" width="30" height="18" rx="4" />

      {/* gathered into one draft */}
      <path className="tw__flow" d="M186 78 C186 96 130 92 130 106" />
      <rect className="tw__draft" x="62" y="106" width="136" height="48" rx="7" />
      <line className="tw__rule" x1="76" y1="122" x2="168" y2="122" />
      <line className="tw__rule" x1="76" y1="132" x2="146" y2="132" />
      {/* held for a person: the tick is outlined, not filled - nothing is sent yet */}
      <circle className="tw__check" cx="182" cy="140" r="9" />
      <path className="tw__tick" d="M177.5 140 l3 3 l6 -6.5" />
    </svg>
  );
}

/** A player and a companion in a stylised environment, responding to each other. */
function GameScene() {
  return (
    <svg
      aria-hidden
      className="tw__art"
      viewBox="0 0 260 170"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* terrain: three receding ridges, nobody's landscape in particular */}
      <path className="tw__ridge tw__ridge--far" d="M0 96 L54 62 L104 92 L150 56 L206 90 L260 64 L260 170 L0 170 Z" />
      <path className="tw__ridge tw__ridge--mid" d="M0 118 L48 94 L108 122 L164 96 L218 120 L260 100 L260 170 L0 170 Z" />
      <path className="tw__ridge tw__ridge--near" d="M0 142 L70 126 L132 146 L196 128 L260 144 L260 170 L0 170 Z" />

      {/* the player and the companion, as markers rather than characters */}
      <circle className="tw__player" cx="92" cy="134" r="8" />
      <path className="tw__base" d="M78 150 h28" />
      <circle className="tw__mate" cx="146" cy="130" r="8" />
      <path className="tw__base" d="M132 146 h28" />

      {/* an exchange between them, not a broadcast at the player */}
      <rect className="tw__bubble" x="96" y="88" width="46" height="24" rx="8" />
      <path className="tw__bubbleTail" d="M112 112 l6 8 l6 -8" />
      <rect className="tw__bubble tw__bubble--mate" x="152" y="76" width="56" height="26" rx="8" />
      <path className="tw__bubbleTail tw__bubbleTail--mate" d="M166 102 l-6 8 l12 -3" />
      <circle className="tw__dot" cx="108" cy="100" r="2.2" />
      <circle className="tw__dot" cx="118" cy="100" r="2.2" />
      <circle className="tw__dot" cx="128" cy="100" r="2.2" />
    </svg>
  );
}

export function TwoOutcomes() {
  return (
    <figure className="tw">
      <div className="tw__grid">
        <div className="tw__half">
          <p className="tw__kicker">Customer enquiry</p>
          <ServiceScene />
          <p className="tw__label">A better service experience</p>
          <p className="tw__note">
            A quicker, more useful reply with fewer handoffs, and a draft a person still
            approves
          </p>
        </div>
        <div className="tw__half tw__half--game">
          <p className="tw__kicker">Game companion</p>
          <GameScene />
          <p className="tw__label">A better player experience</p>
          <p className="tw__note">
            A companion that responds to what the player does, inside the story the writers
            set
          </p>
        </div>
      </div>
      <figcaption className="tw__caption">
        Different settings, same starting point: define the experience you want to improve
      </figcaption>
      {/*
        One description for both halves, written for someone who cannot see them.
        It describes the RELATIONSHIP the picture is making, not the shapes: the
        point is that two unrelated settings share a starting question.
      */}
      <p className="visually-hidden-heading">
        Two settings side by side. On the left, a customer enquiry arrives, information
        about the customer is scattered across several systems, and it is gathered into a
        single suggested reply that waits for a person to approve it. On the right, a
        player and a companion character exchange dialogue in a stylised landscape. Both
        begin with the same question: what experience are you trying to improve?
      </p>
    </figure>
  );
}

/* --------------------------------------------- visual 2: how it is decided -- */

const STAGES = [
  { n: '01', t: 'Problem' },
  { n: '02', t: 'Desired outcome' },
  { n: '03', t: 'Understand the task' },
  { n: '04', t: 'Choose the approach' },
  { n: '05', t: 'Evaluate the result' },
];

const ROUTES = [
  { t: 'Software integration', b: 'Stop moving the same data by hand' },
  { t: 'Fixed automation', b: 'Apply a rule that does not change' },
  { t: 'AI agent', b: 'Interpret, gather and propose a next step' },
];

/**
 * Problem to evaluation, with three alternative routes hanging off stage 04.
 *
 * THE ROUTES ARE NOT A SIXTH STAGE AND THE LAYOUT HAS TO SAY SO. An earlier
 * version put them inside stage 04, which made that one column three times the
 * height of its neighbours and squeezed five columns into the article measure
 * until every label wrapped. Moving them to their own band below does three
 * things at once: the five stages get room to read as one line, the routes get
 * width enough to say what they are for, and the relationship stays explicit
 * because the band is introduced by its own sentence and is tied back to 04.
 *
 * They are alternatives, not steps: chosen according to the task, and often only
 * one is needed. That is why the band is a <ul> introduced by "one of these",
 * rather than three more numbered boxes in the flow.
 */
export function DecisionFlow() {
  return (
    <figure className="df">
      <ol className="df__line">
        {STAGES.map(s => (
          <li
            className={`df__stage${s.n === '04' ? ' df__stage--branch' : ''}`}
            key={s.n}
          >
            <span className="df__n">{s.n}</span>
            <span className="df__t">{s.t}</span>
          </li>
        ))}
      </ol>

      <div className="df__branch">
        <p className="df__branchLead">
          At stage 04, one of these, according to the task
        </p>
        <ul className="df__routes">
          {ROUTES.map(r => (
            <li className="df__route" key={r.t}>
              <span className="df__routeT">{r.t}</span>
              <span className="df__routeB">{r.b}</span>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="df__caption">
        Choose the technology after defining what needs to change
      </figcaption>
    </figure>
  );
}
