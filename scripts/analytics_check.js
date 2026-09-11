/**
 * Analytics instrumentation check.
 *
 *     node scripts/analytics_check.js
 *
 * Exit 0 when every tracked element on every instrumented page is correctly
 * attributed and the handoff's required coverage is present; exit 1 otherwise.
 *
 * WHY THIS EXISTS
 *
 * The failure this feature can ship with is silent by nature. A CTA carrying
 * `data-pt-event="hero_primry_cta"` looks instrumented in the source, renders
 * without complaint, passes `tsc` if it was hand-written rather than built by
 * `analyticsAttrs()`, and then counts nothing for ever. Nobody finds out,
 * because the symptom is an absence.
 *
 * So the pages are RENDERED — by `react-dom/server`, from the real page
 * modules, not by reading the source with a regular expression — and every
 * attribute in the resulting HTML is checked against the registry in
 * `src/lib/analytics.ts`. Then the coverage the 8 September 2026 handoff asks
 * for in checklist item 21 is asserted positively: the hero CTAs, all six
 * section 03 buyer routes, the case studies, the brief intent and the booked
 * conversations each have to be there.
 *
 * The run finishes with two falsifiability controls. A check that has never
 * been seen to fail is not evidence, so this one corrupts its own input and
 * requires itself to go red.
 *
 * Next-specific modules are stubbed, and only those: `next/link` becomes the
 * plain `<a>` it renders to, which is exactly the element the attributes have
 * to land on. Every component, content module and helper under `src/` is the
 * real one.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

const REPO = path.resolve(__dirname, '..');
const SRC = path.join(REPO, 'src');

/* ------------------------------------------------------------------ *
 * Loading the real modules
 * ------------------------------------------------------------------ */

/** `@/x` is the project's own path alias; resolve it the way tsconfig does. */
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) {
    const base = path.join(SRC, request.slice(2));
    for (const candidate of [
      base,
      base + '.ts',
      base + '.tsx',
      path.join(base, 'index.ts'),
      path.join(base, 'index.tsx'),
    ]) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }
  return originalResolve.call(this, request, ...rest);
};

/**
 * Stubs, and the justification for each.
 *
 *  - `next/link` renders an `<a>` with the props it was given. That is what it
 *    does in the real app too, and it is the element the `data-pt-*`
 *    attributes must reach, so substituting it tests the same thing.
 *  - `next/font/google` returns CSS-variable class names and has no bearing on
 *    any attribute here.
 *  - `next/navigation` is only reached on a 404 path this check never takes.
 *
 * Nothing under `src/` is stubbed. If it were, this would be testing itself.
 */
const STUBS = {
  'next/link': {
    __esModule: true,
    default: props => {
      const { children, ...rest } = props;
      return React.createElement('a', rest, children);
    },
  },
  'next/font/google': new Proxy(
    {},
    { get: () => () => ({ variable: 'stub-font', className: 'stub-font' }) },
  ),
  'next/navigation': {
    notFound: () => {
      throw new Error('notFound() reached');
    },
  },
};

const originalLoad = Module._load;
Module._load = function (request, ...rest) {
  if (Object.prototype.hasOwnProperty.call(STUBS, request)) return STUBS[request];
  if (request.endsWith('.css')) return {};
  return originalLoad.call(this, request, ...rest);
};

/** Compile TS/TSX on require, with the automatic JSX runtime. */
function compile(module_, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
  });
  module_._compile(outputText, filename);
}
Module._extensions['.ts'] = compile;
Module._extensions['.tsx'] = compile;

/* ------------------------------------------------------------------ *
 * The registry under test
 * ------------------------------------------------------------------ */

const analytics = require(path.join(SRC, 'lib', 'analytics.ts'));
const {
  ANALYTICS_ENABLED,
  ANALYTICS_EVENTS,
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_SURFACE_VALUES,
  BUYER_ROUTE_VALUES,
  DETAIL_ATTRIBUTE,
  EVENT_ATTRIBUTE,
  ROUTE_ATTRIBUTE,
  SURFACE_ATTRIBUTE,
} = analytics;

const failures = [];
const notes = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

/* ------------------------------------------------------------------ *
 * Render
 * ------------------------------------------------------------------ */

async function renderAll() {
  const HomePage = require(path.join(SRC, 'app', 'page.tsx')).default;
  const WorkIndex = require(path.join(SRC, 'app', 'case-studies', 'page.tsx')).default;
  const CaseStudy = require(path.join(SRC, 'app', 'case-studies', '[slug]', 'page.tsx')).default;
  const { SiteHeader } = require(path.join(SRC, 'components', 'SiteHeader.tsx'));
  const { ClosingCta } = require(path.join(SRC, 'components', 'sections.tsx'));
  const { caseStudies } = require(path.join(SRC, 'content', 'work.ts'));

  const slug = caseStudies[0].slug;

  // The two route pages are async Server Components, so their element tree is
  // awaited before it is rendered rather than rendered directly.
  const workIndexElement = await WorkIndex({ searchParams: Promise.resolve({}) });
  const caseStudyElement = await CaseStudy({ params: Promise.resolve({ slug }) });

  return {
    homepage: renderToStaticMarkup(React.createElement(HomePage)),
    'site header': renderToStaticMarkup(React.createElement(SiteHeader)),
    'work index': renderToStaticMarkup(workIndexElement),
    [`case study /${slug}`]: renderToStaticMarkup(caseStudyElement),
    'closing CTA (to /contact)': renderToStaticMarkup(
      React.createElement(ClosingCta, { title: 'Test' }),
    ),
    'closing CTA (elsewhere)': renderToStaticMarkup(
      React.createElement(ClosingCta, { title: 'Test', ctaHref: '/engineering' }),
    ),
  };
}

/* ------------------------------------------------------------------ *
 * Extraction and validation
 * ------------------------------------------------------------------ */

/** Every opening tag in the HTML that carries at least one `data-pt-*`. */
function trackedTags(html) {
  return (html.match(/<[a-zA-Z][^>]*\sdata-pt-[^>]*>/g) || []).map(tag => {
    const read = name => {
      const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
      return m ? m[1] : undefined;
    };
    return {
      tag,
      event: read(EVENT_ATTRIBUTE),
      route: read(ROUTE_ATTRIBUTE),
      surface: read(SURFACE_ATTRIBUTE),
      detail: read(DETAIL_ATTRIBUTE),
    };
  });
}

/**
 * The attribute-level rules. Returns a list of problems, so the falsifiability
 * controls below can run the identical logic over deliberately broken input.
 *
 * `expectTracked` is false for the one surface that is SUPPOSED to render
 * nothing — a closing CTA pointing away from /contact. Without it this rule
 * reports the negative control as a defect, which is the check misreading its
 * own design rather than finding one.
 */
function validate(label, html, expectTracked = true) {
  const problems = [];
  const tags = trackedTags(html);

  if (expectTracked && tags.length === 0) {
    problems.push(`${label}: nothing is instrumented at all`);
  }

  for (const t of tags) {
    if (!t.event) {
      problems.push(`${label}: an element carries data-pt-* dimensions but no ${EVENT_ATTRIBUTE}: ${t.tag}`);
      continue;
    }
    if (!ANALYTICS_EVENT_NAMES.includes(t.event)) {
      problems.push(`${label}: "${t.event}" is not a declared event name`);
    }
    if (t.route !== undefined && !BUYER_ROUTE_VALUES.includes(t.route)) {
      problems.push(`${label}: "${t.route}" is not a declared buyer route`);
    }
    if (t.surface !== undefined && !ANALYTICS_SURFACE_VALUES.includes(t.surface)) {
      problems.push(`${label}: "${t.surface}" is not a declared surface`);
    }
    if (t.detail !== undefined && !/^[a-z0-9][a-z0-9-]*$/.test(t.detail)) {
      problems.push(`${label}: detail "${t.detail}" is not a slug`);
    }
  }
  return problems;
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

(async () => {
  const rendered = await renderAll();
  const all = [];

  /** The surface that must render nothing: the negative control. */
  const EXPECT_EMPTY = new Set(['closing CTA (elsewhere)']);

  console.log('RENDERED SURFACES');
  for (const [label, html] of Object.entries(rendered)) {
    const tags = trackedTags(html);
    all.push(...tags.map(t => ({ ...t, label })));
    const expected = EXPECT_EMPTY.has(label) ? '(expected: none)' : '';
    console.log(
      `  ${label.padEnd(28)} ${String(tags.length).padStart(3)} tracked element(s) ${expected}`,
    );
    for (const p of validate(label, html, !EXPECT_EMPTY.has(label))) failures.push(p);
  }

  const eventsOn = label =>
    new Set(all.filter(t => t.label === label).map(t => t.event));
  const homepageEvents = eventsOn('homepage');

  console.log('\nCOVERAGE — handoff checklist item 21');

  // 1 — Hero CTAs (handoff section 01).
  for (const [name, what] of [
    [ANALYTICS_EVENTS.HERO_PRIMARY_CTA, 'primary CTA "Build a Product"'],
    [ANALYTICS_EVENTS.HERO_SECONDARY_CTA, 'secondary CTA "Automate a Workflow"'],
    [ANALYTICS_EVENTS.HERO_SPECIALIST_ROUTE, 'specialist route "Explore Blockchain Engineering"'],
    [ANALYTICS_EVENTS.HERO_LOW_FRICTION_ROUTE, 'low-friction route'],
    [ANALYTICS_EVENTS.HERO_ROUTE_CHIP, 'route chips'],
  ]) {
    const ok = homepageEvents.has(name);
    check(ok, `hero: ${what} is not instrumented (${name} absent from the homepage render)`);
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} hero — ${what}`);
  }
  const chips = all.filter(t => t.event === ANALYTICS_EVENTS.HERO_ROUTE_CHIP).length;
  check(chips === 3, `hero: expected 3 route chips, rendered ${chips}`);
  console.log(`  ${chips === 3 ? 'ok  ' : 'FAIL'} hero — 3 route chips (${chips})`);

  // 2 — All six section 03 buyer routes, on BOTH the route link and the CTA.
  for (const route of BUYER_ROUTE_VALUES) {
    const onRoute = all.some(
      t => t.event === ANALYTICS_EVENTS.BUYER_TRIGGER_ROUTE && t.route === route,
    );
    const onCta = all.some(
      t => t.event === ANALYTICS_EVENTS.BUYER_TRIGGER_CTA && t.route === route,
    );
    check(onRoute, `buyer trigger: route "${route}" has no ${ANALYTICS_EVENTS.BUYER_TRIGGER_ROUTE}`);
    check(onCta, `buyer trigger: route "${route}" has no ${ANALYTICS_EVENTS.BUYER_TRIGGER_CTA}`);
    console.log(`  ${onRoute && onCta ? 'ok  ' : 'FAIL'} buyer route — ${route} (route link + CTA)`);
  }

  // 3 — Case studies, on every surface that lists one, each naming its slug.
  const caseStudyTags = all.filter(t => t.event === ANALYTICS_EVENTS.CASE_STUDY_OPENED);
  const caseStudySurfaces = new Set(caseStudyTags.map(t => t.surface));
  for (const surface of ['homepage-selected-work', 'work-index', 'case-study-related']) {
    const ok = caseStudySurfaces.has(surface);
    check(ok, `case studies: no ${ANALYTICS_EVENTS.CASE_STUDY_OPENED} on surface "${surface}"`);
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} case study opened — ${surface}`);
  }
  const withoutSlug = caseStudyTags.filter(t => !t.detail).length;
  check(withoutSlug === 0, `case studies: ${withoutSlug} card(s) carry no slug in ${DETAIL_ATTRIBUTE}`);
  console.log(`  ${withoutSlug === 0 ? 'ok  ' : 'FAIL'} case study opened — every card names its slug`);

  // 4 — The brief. Intent only: there is no upload control anywhere on the site.
  const brief = all.filter(t => t.event === ANALYTICS_EVENTS.SEND_US_A_BRIEF_INTENT);
  check(brief.length === 1, `brief: expected exactly 1 "${ANALYTICS_EVENTS.SEND_US_A_BRIEF_INTENT}", found ${brief.length}`);
  console.log(`  ${brief.length === 1 ? 'ok  ' : 'FAIL'} brief intent — ${ANALYTICS_EVENTS.SEND_US_A_BRIEF_INTENT} (${brief.length})`);
  const uploadNamed = ANALYTICS_EVENT_NAMES.filter(n => /upload/i.test(n));
  check(
    uploadNamed.length === 0,
    `brief: an event name contains "upload" (${uploadNamed.join(', ')}). No upload exists; the name would misrepresent the data.`,
  );
  console.log(`  ${uploadNamed.length === 0 ? 'ok  ' : 'FAIL'} brief intent — no event name claims an upload`);

  // 5 — Booked conversations, on the header and the homepage close at minimum.
  const bookSurfaces = new Set(
    all.filter(t => t.event === ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA).map(t => t.surface),
  );
  for (const surface of ['site-header', 'site-header-mobile', 'homepage-close', 'closing-cta']) {
    const ok = bookSurfaces.has(surface);
    check(ok, `booked conversations: no ${ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA} on surface "${surface}"`);
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} book conversation — ${surface}`);
  }

  // The closing CTA must NOT claim a booked conversation when it points elsewhere.
  const strayClosing = trackedTags(rendered['closing CTA (elsewhere)']).filter(
    t => t.event === ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA,
  ).length;
  check(strayClosing === 0, 'closing CTA: a non-/contact destination is being counted as a booked conversation');
  console.log(`  ${strayClosing === 0 ? 'ok  ' : 'FAIL'} book conversation — not claimed when the CTA points elsewhere`);

  // 6 — The architecture held: attributes, not handlers.
  const handlers = Object.entries(rendered).filter(([, html]) => /\son[a-z]+=/i.test(html));
  check(handlers.length === 0, `inline event handlers rendered on: ${handlers.map(h => h[0]).join(', ')}`);
  console.log(`\n  ${handlers.length === 0 ? 'ok  ' : 'FAIL'} no inline event handler was rendered anywhere`);

  // 7 — The master switch is honoured: nothing is loaded while it is off.
  console.log(`  ---- ANALYTICS_ENABLED = ${ANALYTICS_ENABLED}`);
  const builtHtml = [];
  const appDir = path.join(REPO, '.next', 'server', 'app');
  if (fs.existsSync(appDir)) {
    const walk = dir => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.html')) builtHtml.push(full);
      }
    };
    walk(appDir);
  }
  if (builtHtml.length === 0) {
    notes.push('no built HTML found under .next/server/app — run `next build` first for the loaded-script check');
  } else {
    const leaking = builtHtml.filter(f => {
      const html = fs.readFileSync(f, 'utf8');
      return html.includes('_vercel/insights') || html.includes('va.vercel-scripts.com');
    });
    const expectLoaded = ANALYTICS_ENABLED;
    const ok = expectLoaded ? leaking.length > 0 : leaking.length === 0;
    check(
      ok,
      expectLoaded
        ? 'ANALYTICS_ENABLED is true but no built page references the Vercel script'
        : `ANALYTICS_ENABLED is false but ${leaking.length} built page(s) still reference a Vercel analytics script`,
    );
    console.log(
      `  ${ok ? 'ok  ' : 'FAIL'} ${builtHtml.length} built pages checked — Vercel script present on ${leaking.length}`,
    );
  }

  /* ---------------------------------------------------------------- *
   * Falsifiability controls
   * ---------------------------------------------------------------- */

  console.log('\nFALSIFIABILITY CONTROLS (each must FAIL)');

  // Control A — a mistyped event name must be rejected by the membership rule.
  const typo = rendered.homepage.replace('"hero_primary_cta"', '"hero_primry_cta"');
  const controlA = validate('control-A', typo);
  const aCaught = controlA.some(p => p.includes('hero_primry_cta'));
  console.log(`  ${aCaught ? 'ok  ' : 'FAIL'} A — mistyped event name detected: ${aCaught ? controlA.find(p => p.includes('hero_primry_cta')) : 'NOT DETECTED'}`);
  check(aCaught, 'control A did not fail: a mistyped event name would ship undetected');

  // Control B — an undeclared route value must be rejected.
  const badRoute = rendered.homepage.replace('"build-software"', '"build_software"');
  const controlB = validate('control-B', badRoute);
  const bCaught = controlB.some(p => p.includes('build_software'));
  console.log(`  ${bCaught ? 'ok  ' : 'FAIL'} B — undeclared route value detected`);
  check(bCaught, 'control B did not fail: an undeclared route value would ship undetected');

  // Control C — a dimension with its event attribute stripped must be rejected.
  const orphan = rendered.homepage.replace(/\sdata-pt-event="hero_primary_cta"/, '');
  const controlC = validate('control-C', orphan);
  const cCaught = controlC.some(p => p.includes('no data-pt-event'));
  console.log(`  ${cCaught ? 'ok  ' : 'FAIL'} C — orphaned dimension (no event attribute) detected`);
  check(cCaught, 'control C did not fail: an attribute set missing its event name would ship undetected');

  /* ---------------------------------------------------------------- */

  /* ---------------------------------------------------------------- *
   * Every declared event is accounted for
   *
   * A registry is only honest if nothing sits in it uncounted. Two events
   * correctly never appear as an attribute and both are named here rather
   * than left to look like a coverage gap:
   *
   *   contact_form_submitted  fires from a state transition in
   *                           `src/app/contact/ContactForm.tsx`, not a click,
   *                           so there is no element to attribute. Asserted
   *                           separately, below, against that file.
   *   analytics_unknown_event is the self-monitor. It exists to be emitted
   *                           only when something is already wrong.
   * ---------------------------------------------------------------- */
  const NOT_ATTRIBUTE_DRIVEN = [
    ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED,
    ANALYTICS_EVENTS.UNKNOWN_EVENT,
  ];
  const renderedEvents = new Set(all.map(t => t.event));
  const unaccounted = ANALYTICS_EVENT_NAMES.filter(
    n => !renderedEvents.has(n) && !NOT_ATTRIBUTE_DRIVEN.includes(n),
  );
  check(
    unaccounted.length === 0,
    `declared but never rendered and not explained: ${unaccounted.join(', ')}`,
  );
  console.log(`  ${unaccounted.length === 0 ? 'ok  ' : 'FAIL'} every declared event is rendered or explained`);

  // The one event raised in code rather than markup, asserted at its source.
  const formSource = fs.readFileSync(
    path.join(SRC, 'app', 'contact', 'ContactForm.tsx'),
    'utf8',
  );
  const formTracked =
    formSource.includes('ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED') &&
    formSource.includes("state.status !== 'success'") &&
    formSource.includes('reported.current');
  check(
    formTracked,
    'the contact form no longer reports CONTACT_FORM_SUBMITTED on server-confirmed success, once',
  );
  console.log(`  ${formTracked ? 'ok  ' : 'FAIL'} contact form reports success once, from the server's answer`);

  console.log('\nTOTALS');
  console.log(`  tracked elements rendered: ${all.length}`);
  console.log(`  distinct events rendered:  ${renderedEvents.size} of ${ANALYTICS_EVENT_NAMES.length} declared (${NOT_ATTRIBUTE_DRIVEN.length} are raised in code, not markup)`);
  for (const note of notes) console.log(`  note: ${note}`);

  if (failures.length) {
    console.log(`\nFAILED — ${failures.length} problem(s):`);
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
  console.log('\nPASSED');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
