/**
 * Builds the assistant's knowledge base from THIS SITE'S OWN PAGES.
 *
 * WHY THIS SCRIPT EXISTS AT ALL. The assistant must not have a second, private
 * account of what Pixelette does. Every answer it gives is a passage that is
 * already published on this site and already approved, so "is the chatbot
 * saying the right thing" reduces to "is the page saying the right thing" - one
 * question instead of two. The failure mode this rules out is the one the
 * previous site's assistant had: a hand-written system prompt asserting facts
 * the site itself no longer stands behind.
 *
 * PARSED WITH THE TYPESCRIPT COMPILER, NOT A REGEX. The answers are string
 * literals inside TSX, some of them template literals, many containing
 * apostrophes and commas. A regex over that gets it subtly wrong - a truncated
 * answer is worse than a missing one, because it still reads like a sentence.
 * `typescript` is already a devDependency, so this adds nothing to install.
 *
 * ANY ANSWER IT CANNOT READ EXACTLY IS NEVER GUESSED AT. A template literal
 * with a ${substitution} cannot be resolved without running the module, so the
 * question is indexed as a POINTER instead: the assistant still matches it and
 * sends the visitor to the page that answers it, but does not put words on the
 * site's behalf. Dropping it would make a real question unanswerable; filling
 * in the substitution would be the assistant inventing site copy.
 *
 * RE-RUN THIS WHENEVER PAGE CONTENT CHANGES:
 *     node scripts/build-pix-kb.mjs
 * `node scripts/check-pix-kb.mjs` fails if the committed KB is stale, so drift
 * is loud rather than silent.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import ts from 'typescript';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const APP = path.join(ROOT, 'src', 'app');
// PIX_KB_OUT lets check-pix-kb.mjs regenerate to a scratch path and diff,
// so the staleness check runs the REAL builder rather than a copy of its logic.
const OUT = process.env.PIX_KB_OUT || path.join(ROOT, 'src', 'content', 'pix-kb.json');

const skipped = [];
const pointers = [];

/** Every page.tsx under src/app, as [absolutePath, routePath]. */
function pageFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) pageFiles(p, out);
    else if (entry.name === 'page.tsx') out.push(p);
  }
  return out;
}

/** src/app/blockchain/tokenisation/page.tsx -> /blockchain/tokenisation */
function routeOf(file) {
  const rel = path.relative(APP, file).replace(/\\/g, '/').replace(/\/page\.tsx$/, '');
  if (!rel || rel === 'page.tsx') return '/';
  // A dynamic segment cannot be a fixed route, so those pages contribute
  // metadata under their literal path and are not linked by the assistant.
  return '/' + rel;
}

/**
 * A readable name for a route whose title cannot be read from source.
 *
 * The homepage sets its metadata through `homepageMetadata()`, a call with no
 * literal arguments, so there is no title to extract. Without this its five FAQs
 * were labelled "/" in the assistant, and a visitor being told an answer came
 * from "/" is being told nothing.
 */
function labelOf(route) {
  if (route === '/') return 'Home';
  const last = route.split('/').filter(Boolean).pop() ?? route;
  return last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** A string literal or a template literal with no substitutions. Otherwise null. */
function literal(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function propOf(objectLiteral, name) {
  for (const prop of objectLiteral.properties) {
    if (ts.isPropertyAssignment(prop) && prop.name && prop.name.getText() === name) {
      return prop.initializer;
    }
  }
  return null;
}

function parse(file) {
  const src = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const route = routeOf(file);
  const faqs = [];
  const sections = [];
  let meta = null;

  const visit = node => {
    // const faqs = [ { q, a }, ... ]
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText() === 'faqs' &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const el of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(el)) continue;
        const q = literal(propOf(el, 'q'));
        const a = literal(propOf(el, 'a'));
        if (q && a) {
          faqs.push({ q, a });
        } else if (q) {
          /*
           * The QUESTION is readable but the ANSWER interpolates a value that
           * cannot be resolved without running the module (e.g. `${certified.name}`).
           *
           * INDEXED AS A POINTER RATHER THAN DROPPED OR GUESSED. Dropping it
           * would make a real question unanswerable; guessing the substitution
           * would put words on the site's behalf that the site does not say.
           * A pointer does neither: the assistant can match the question and
           * send the visitor to the page that answers it, which is true, useful,
           * and cannot be wrong.
           */
          faqs.push({ q, a: null });
          pointers.push(`${route}: ${q}`);
        } else {
          // Loud, not silent. A half-read answer would still look like prose.
          const raw = el.getText().replace(/\s+/g, ' ').slice(0, 70);
          skipped.push(`${route}: unreadable q/a (${raw}...)`);
        }
      }
    }

    /*
     * SECTIONS, added 2026-10-02 (founder: "train Pix T on the website"). Two
     * shapes carry most of a page's substance besides its FAQs:
     *   <SectionHead title="..." lead="..." />   a section and what it says
     *   { title|t|label: '...', body|b|line: '...' }   a card, step or route
     * Only exact string literals are taken, as for FAQs, so nothing is guessed.
     */
    if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText() === 'SectionHead') {
      const attr = name => {
        const a = node.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText() === name);
        if (!a || !a.initializer) return null;
        if (ts.isStringLiteral(a.initializer)) return a.initializer.text;
        if (ts.isJsxExpression(a.initializer) && a.initializer.expression) return literal(a.initializer.expression);
        return null;
      };
      const title = attr('title');
      const lead = attr('lead');
      if (title && lead) sections.push({ title, text: lead });
    }
    if (ts.isObjectLiteralExpression(node)) {
      const title = literal(propOf(node, 'title')) || literal(propOf(node, 't')) || literal(propOf(node, 'label'));
      const body = literal(propOf(node, 'body')) || literal(propOf(node, 'b')) || literal(propOf(node, 'line'));
      if (title && body && body.length >= 40 && !propOf(node, 'q')) sections.push({ title, text: body });
    }

    // pageMetadata({ title, description, path })
    if (
      ts.isCallExpression(node) &&
      node.expression.getText() === 'pageMetadata' &&
      node.arguments.length &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const arg = node.arguments[0];
      const title = literal(propOf(arg, 'title'));
      const description = literal(propOf(arg, 'description'));
      const declared = literal(propOf(arg, 'path'));
      if (title && description) {
        meta = { title, description, path: declared || route };
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(src);

  return { route, faqs, sections, meta };
}

const docs = [];
const files = pageFiles(APP).sort();

for (const file of files) {
  const { route, faqs, sections, meta } = parse(file);
  const pageTitle = meta?.title || labelOf(route);
  const pagePath = meta?.path || route;

  // A dynamic route cannot be linked to as a fixed URL.
  const linkable = !pagePath.includes('[');

  if (meta && linkable) {
    docs.push({
      kind: 'page',
      title: meta.title,
      text: meta.description,
      path: pagePath,
    });
  }

  for (const sct of sections) {
    docs.push({
      kind: 'section',
      title: sct.title,
      text: sct.text,
      path: linkable ? pagePath : null,
      page: pageTitle,
    });
  }

  for (const f of faqs) {
    docs.push({
      // A pointer carries the question but no answer text: the assistant
      // matches on it and routes to the page, rather than answering on the
      // site's behalf.
      kind: f.a === null ? 'pointer' : 'faq',
      title: f.q,
      text: f.a,
      path: linkable ? pagePath : null,
      page: pageTitle,
    });
  }
}

/*
 * THE QUESTION DATASET (src/content/pix-questions.json, founder 2026-10-02).
 * Each phrasing becomes an FAQ whose answer is COPIED from the page or FAQ it
 * points at, so the dataset adds ways of asking, never new things to say. A
 * pointer to an answer that does not exist stops the build.
 */
const DATASET = path.join(ROOT, 'src', 'content', 'pix-questions.json');
if (fs.existsSync(DATASET)) {
  const { entries } = JSON.parse(fs.readFileSync(DATASET, 'utf8'));
  const missing = [];
  for (const e of entries) {
    const target = docs.find(
      d => (d.kind === 'faq' || d.kind === 'page') && d.path === e.answer.path && d.title === e.answer.title && d.text,
    );
    if (!target) {
      missing.push(`${e.answer.path} | ${e.answer.title}`);
      continue;
    }
    for (const ask of e.ask) {
      docs.push({
        kind: 'faq',
        title: ask,
        text: target.text,
        path: target.path,
        page: target.kind === 'faq' ? target.page : target.title,
      });
    }
  }
  if (missing.length) {
    process.stderr.write(`pix-questions.json points at answers that do not exist:\n${missing.map(m => '  - ' + m).join('\n')}\n`);
    process.exit(1);
  }
}

const kb = {
  /*
   * Generated. `builtFrom` records the shape of the source so a reader of the
   * JSON can tell what it was derived from without running anything. There is
   * deliberately NO build timestamp: it would change on every run and turn a
   * staleness check into noise, the same reasoning the sitemap applies to
   * `lastModified`.
   */
  builtFrom: 'src/app/**/page.tsx',
  counts: {
    pages: docs.filter(d => d.kind === 'page').length,
    faqs: docs.filter(d => d.kind === 'faq').length,
    pointers: docs.filter(d => d.kind === 'pointer').length,
    sections: docs.filter(d => d.kind === 'section').length,
  },
  docs,
};

fs.writeFileSync(OUT, JSON.stringify(kb, null, 1) + '\n', 'utf8');

process.stdout.write(`page files scanned : ${files.length}\n`);
process.stdout.write(`pages indexed      : ${kb.counts.pages}\n`);
process.stdout.write(`faq pairs indexed  : ${kb.counts.faqs}\n`);
process.stdout.write(`pointers indexed   : ${kb.counts.pointers}\n`);
process.stdout.write(`written            : ${path.relative(ROOT, OUT)}\n`);
if (pointers.length) {
  process.stdout.write(`\nINDEXED AS POINTERS (question matched, page linked, answer not invented):\n`);
  for (const p of pointers) process.stdout.write(`  - ${p}\n`);
}
if (skipped.length) {
  process.stdout.write(`\nSKIPPED (not guessed at):\n`);
  for (const s of skipped) process.stdout.write(`  - ${s}\n`);
}
