/**
 * Fails if "trust" in any form reaches text a visitor can read.
 *
 * THE RULE, given by the founder on 2026-10-02: do not use "trust", "trusted",
 * "trustworthy" or "AI you can trust" anywhere in customer-facing copy, visual
 * text, alt text, metadata or CTAs. The site's AI proposition is evidence-led
 * (Evaluation & Observability: measure it, then show the measurement), and
 * "trust" asks the reader to take on faith the very thing the page says it
 * will prove. The prompt was a generated reference visual whose CTA read
 * "Build AI you can trust"; a supplied visual is a design reference only and
 * its wording is not approved by being in it. Use "See how we evaluate AI" or
 * "Build AI you can verify" for that CTA, and "reliable", "relied on",
 * "verifiable" or "safe" for the rest.
 *
 * WHAT IS SEARCHED: every string literal, template literal and piece of JSX
 * text under src/ (which covers copy, alt text, metadata, JSON-LD, CTA labels,
 * Pix T's rules and the migrated archive), src/content/pix-kb.json, and
 * public/llms.txt. Comments and identifiers are not text a visitor reads, so a
 * component named `TrustStrip` or a comment about trust is not a hit.
 *
 * WHAT IS NOT SEARCHED, stated rather than discovered later: words baked into
 * images and video frames. On 2026-10-02 the hero stills in public/hero and
 * the five video posters were checked by eye and none carries the word; the
 * case-study screenshots in public/work and the full video frames were not.
 * A new visual has to be checked the same way, because no script reads pixels.
 *
 *     node scripts/check-banned-words.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import ts from 'typescript';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const BANNED = /trust/i;

const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|mts)$/.test(entry.name)) scanSource(full);
  }
}

/*
 * The claims register's and the case studies' internal notes are never
 * served: check-public-output.mjs fails the build if one reaches anything a
 * visitor can fetch. They name code identifiers such as `trustBadges`, so they
 * are skipped here rather than reworded around the code.
 */
const INTERNAL_FIELDS = new Set(['evidenceNote', 'publicationInstruction']);

function isInternal(node) {
  let n = node.parent;
  while (n && (ts.isBinaryExpression(n) || ts.isParenthesizedExpression(n) || ts.isTemplateSpan(n) || ts.isTemplateExpression(n))) {
    n = n.parent;
  }
  return !!n && ts.isPropertyAssignment(n) && INTERNAL_FIELDS.has(n.name.getText());
}

function scanSource(file) {
  const text = fs.readFileSync(file, 'utf8');
  if (!BANNED.test(text)) return;
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  const visit = (node) => {
    let value = null;
    if (ts.isStringLiteralLike(node) || ts.isJsxText(node)) value = node.text;
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) value = node.text;
    // An import path is not copy, and nor is an internal register note.
    if (value !== null && !ts.isImportDeclaration(node.parent) && !isInternal(node) && BANNED.test(value)) {
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
      hits.push(`${path.relative(ROOT, file)}:${line + 1}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

function scanPlain(rel) {
  const file = path.join(ROOT, rel);
  fs.readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (BANNED.test(line)) hits.push(`${rel}:${i + 1}`);
    });
}

walk(path.join(ROOT, 'src'));
scanPlain('src/content/pix-kb.json');
scanPlain('public/llms.txt');

if (hits.length) {
  process.stdout.write(
    `"trust" in customer-facing text (${hits.length}). Rephrase with evidence-led wording; see the note at the top of scripts/check-banned-words.mjs.\n` +
      hits.map((h) => `  ${h}`).join('\n') +
      '\n',
  );
  process.exit(1);
}
process.stdout.write('check-banned-words: no "trust" in customer-facing text.\n');
