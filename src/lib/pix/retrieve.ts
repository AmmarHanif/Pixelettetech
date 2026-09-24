import kb from '@/content/pix-kb.json';

/**
 * Local retrieval over this site's own published text. No model, no network.
 *
 * WHY RETRIEVAL AND NOT GENERATION. The instruction was to build this without an
 * LLM API key, and the honest way to do that is not to imitate a model badly. It
 * is to answer only with sentences that are already published on this site and
 * already approved. The assistant selects; it never composes. That makes the
 * whole class of "the chatbot said something we never agreed to" impossible
 * rather than unlikely.
 *
 * THE THRESHOLD IS THE SAFETY MECHANISM, not the ranking. A retrieval system
 * that always returns its best match is a system that answers every question
 * confidently, including the ones it has no answer to - and a confident wrong
 * answer from a company website is worse than no chatbot. So a match must clear
 * a floor, and below it the assistant says it does not know and routes to a
 * human. Tuning that floor is tuning how often it is wrong.
 *
 * COVERAGE, NOT JUST BM25. BM25 ranks well but its scores are unbounded and
 * corpus-relative, so there is no defensible number to compare against. Coverage
 * - how much of the visitor's own question is actually present in the matched
 * passage, each word weighted by how rare it is - is bounded, interpretable, and
 * is what "this passage is about what you asked" actually means. BM25 picks the
 * order; coverage decides whether anything is good enough to say. The IDF
 * weighting is load-bearing rather than a refinement: see the note in `search`.
 */

export type KbDoc = {
  kind: 'page' | 'faq' | 'pointer';
  title: string;
  /** Null on a pointer: the question is known, the answer text is not. */
  text: string | null;
  path: string | null;
  page?: string;
};

const DOCS = kb.docs as KbDoc[];

/*
 * Words carrying no topical signal. Deliberately short: an over-eager stop list
 * strips the meaning out of a short question, and most visitor questions here
 * are short. "How much does it cost" must keep "cost".
 */
const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this',
  'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
  'do', 'does', 'did', 'doing', 'have', 'has', 'had', 'having', 'i', 'you',
  'we', 'they', 'it', 'he', 'she', 'my', 'your', 'our', 'their', 'its',
  'of', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'as', 'about',
  'into', 'over', 'can', 'could', 'would', 'should', 'will', 'shall', 'may',
  'might', 'must', 'me', 'us', 'them', 'so', 'what', 'which', 'who', 'whom',
  'there', 'here', 'any', 'some', 'all', 'no', 'not', 'please', 'tell',
  /*
   * CONVERSATIONAL, NOT TOPICAL - a separate category from the grammar above,
   * and it was missing. "help" is genuinely RARE in this corpus, so the
   * distinctiveness test correctly judged it a rare word and wrongly concluded
   * it named a subject: typing "help" on its own returned a passage that
   * happened to contain the word. Rarity measures how much a word narrows the
   * corpus, not whether it means anything, and these words mean nothing here.
   * Removing them also improves real questions: "can you help with mobile apps"
   * reduces to the two words that matter.
   */
  'hello', 'hi', 'hey', 'help', 'thanks', 'thank', 'ok', 'okay', 'yes', 'yeah',
  'sure', 'greetings', 'stuff', 'things',
  /*
   * FILLER ADVERBS, and these cost a real answer before they were listed.
   * "What does Pixelette actually do?" reduced to `pixelette` + `actually`, and
   * because coverage is a share of the question, the filler counted as half of
   * what was being asked - so a question the site answers on its homepage fell
   * below the floor. A word that changes the tone and not the meaning should not
   * be able to veto a match.
   */
  'actually', 'really', 'just', 'basically', 'simply', 'exactly', 'quite',
  'very', 'also', 'even', 'still', 'well', 'like', 'want', 'need', 'looking',
]);

/**
 * Crude suffix stripping, applied identically to queries and documents.
 *
 * It is not linguistically correct and does not need to be. What matters is that
 * "integrations" and "integration" collapse to the same key on BOTH sides, so a
 * visitor's plural still finds the site's singular. A real stemmer would be a
 * dependency for a gain this corpus is too small to notice.
 */
function stem(word: string): string {
  let w = word;

  /* Plural first, so "evaluations" can then be reduced like "evaluation". */
  if (w.length > 4 && w.endsWith('ies')) w = `${w.slice(0, -3)}y`;
  else if (w.length > 4 && /(ses|xes|zes|ches|shes)$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);

  /*
   * THEN THE VERB/NOUN PAIRS, and this half was missing at first with a visible
   * consequence: "how do you evaluate an AI system" - one of the assistant's own
   * suggested questions - was refused, because the site says "evaluation" and the
   * visitor said "evaluate", and nothing collapsed the two. A visitor asks with
   * the verb and a website is written with the noun, so a stemmer that only
   * handles plurals fails on the most natural way to ask almost anything.
   */
  if (w.length > 6 && w.endsWith('ation')) return `${w.slice(0, -5)}at`;
  if (w.length > 4 && w.endsWith('ate')) return w.slice(0, -1);
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
  return w;
}

export function tokenise(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(w => w.length > 1 && !STOP.has(w))
    .map(stem);
}

/* ---- index, built once at module load over ~140 short documents ---------- */

type Indexed = { doc: KbDoc; titleTokens: string[]; bodyTokens: string[]; len: number };

const INDEX: Indexed[] = DOCS.map(doc => {
  const titleTokens = tokenise(doc.title);
  const bodyTokens = tokenise(doc.text ?? '');
  return { doc, titleTokens, bodyTokens, len: titleTokens.length + bodyTokens.length };
});

const AVG_LEN = INDEX.reduce((n, d) => n + d.len, 0) / Math.max(1, INDEX.length);

const DF = new Map<string, number>();
for (const d of INDEX) {
  for (const t of new Set([...d.titleTokens, ...d.bodyTokens])) {
    DF.set(t, (DF.get(t) ?? 0) + 1);
  }
}

const idf = (t: string) => {
  const df = DF.get(t) ?? 0;
  return Math.log(1 + (INDEX.length - df + 0.5) / (df + 0.5));
};

/* BM25 constants. k1 damps term repetition, b damps document length. */
const K1 = 1.2;
const B = 0.6;
/*
 * A hit in the TITLE counts treble. For an FAQ the title IS the question, so a
 * visitor's phrasing matching it is much stronger evidence than the same word
 * appearing somewhere in a long answer.
 */
const TITLE_WEIGHT = 3;

export type Match = {
  doc: KbDoc;
  score: number;
  /** IDF-weighted share of the query's meaning found in this document, 0..1. */
  coverage: number;
};

/**
 * A pointer carries no answer text, only a question and a page. Where a real
 * answer and a pointer both fit, the real answer should win, so pointers are
 * nudged down rather than excluded - they are still the right result when
 * nothing else matches.
 */
const POINTER_PENALTY = 0.8;

export function search(query: string, limit = 3): Match[] {
  const qTokens = tokenise(query);
  if (!qTokens.length) return [];
  const unique = [...new Set(qTokens)];
  const qSet = new Set(unique);

  /*
   * COVERAGE IS IDF-WEIGHTED, and this is the correction that stopped the
   * assistant answering "do you sell laptops".
   *
   * Counted as a plain fraction, that question scored 0.5 - one of its two
   * words matched - and sailed over the floor, because "sell" appears all over
   * a services website. But the word carrying the question's actual meaning,
   * "laptop", appears nowhere on this site, and plain coverage cannot tell the
   * difference between missing a common word and missing the only word that
   * mattered. Weighting each term by how rare it is means an unanswerable
   * question fails on the term that made it unanswerable.
   */
  const totalIdf = unique.reduce((n, t) => n + idf(t), 0) || 1;

  const scored = INDEX.map(d => {
    const counts = new Map<string, number>();
    for (const t of d.titleTokens) counts.set(t, (counts.get(t) ?? 0) + TITLE_WEIGHT);
    for (const t of d.bodyTokens) counts.set(t, (counts.get(t) ?? 0) + 1);

    let score = 0;
    let matchedIdf = 0;
    for (const t of unique) {
      const f = counts.get(t) ?? 0;
      if (!f) continue;
      matchedIdf += idf(t);
      const norm = 1 - B + (B * d.len) / (AVG_LEN || 1);
      score += idf(t) * ((f * (K1 + 1)) / (f + K1 * norm));
    }

    /*
     * ASKING A PUBLISHED QUESTION VERBATIM SHOULD RETURN THAT ANSWER. Without
     * this, a short question like "What is judge drift?" lost to a longer
     * passage that happened to use both words more often. Containment - how
     * much of the document's own title the visitor actually said - is a direct
     * measure of "this is that question", and it only ever promotes a document
     * whose title the visitor has substantially reproduced.
     */
    const titleSet = new Set(d.titleTokens);
    let titleHit = 0;
    for (const t of titleSet) if (qSet.has(t)) titleHit += 1;
    const containment = titleSet.size ? titleHit / titleSet.size : 0;
    if (containment >= 0.75) score *= 1 + containment;

    if (d.doc.kind === 'pointer') score *= POINTER_PENALTY;

    return { doc: d.doc, score, coverage: matchedIdf / totalIdf };
  });

  return scored
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
    .slice(0, limit);
}

/**
 * The confidence floor. Below this the assistant says it does not know.
 *
 * SET BY SWEEPING IT, NOT BY PICKING A ROUND NUMBER. `scripts/test-pix.cjs`
 * replays every indexed question, every suggested question, and a set of
 * plausible questions this site cannot answer. Run across candidate values, the
 * two failure modes bracket a usable window:
 *
 *   0.60  an off-corpus question ("do you offer accounting services") gets
 *         answered - a SAFETY failure
 *   0.65  everything passes
 *   0.70  everything passes
 *   0.75  a suggested question gets refused - a UTILITY failure
 *
 * 0.70 IS THE TOP OF THE SAFE BAND RATHER THAN ITS MIDDLE, deliberately. The two
 * edges are not equally bad: drifting below means confidently answering
 * something the site never said, and drifting above only means sending someone
 * to a human slightly too readily. Where the costs are asymmetric the margin
 * belongs on the expensive side.
 *
 * Moving this number without re-running that suite is how a chatbot quietly
 * starts answering questions it should refuse.
 */
export const MIN_COVERAGE = 0.7;

/**
 * Is there enough in this question to try to answer it at all?
 *
 * THIS REPLACES A WORD COUNT, which was wrong in a way only visible in use.
 * The rule was "fewer than two content words, ask for more", and "what is
 * tokenisation" reduces to the single token `tokenisation` - so one of the
 * clearest questions a visitor could ask about a page the site devotes a whole
 * section to was answered with "tell me a bit more".
 *
 * The count was never the thing that mattered. ONE RARE WORD IS A QUESTION;
 * ONE COMMON WORD IS NOT. "Tokenisation" names a subject. "Work" does not, and
 * answering it would mean picking one of a hundred passages that mention it.
 * So a single-word question is accepted when that word is distinctive enough to
 * point somewhere, measured against the corpus rather than guessed at.
 */
/*
 * Swept like the coverage floor. Below 0.05 real one-word subjects start being
 * refused ("tokenisation", "agentic"); at 0.2 the corpus is broad enough that
 * near-empty words slip through. 0.05 to 0.15 all behave identically on the
 * suite, so 0.1 is the middle of a flat band rather than an edge of it - which
 * is the one case where taking the midpoint is the defensible move.
 */
const SINGLE_TOKEN_MAX_DF = 0.1;

export function isDistinctive(token: string): boolean {
  const df = DF.get(token) ?? 0;
  return df > 0 && df <= INDEX.length * SINGLE_TOKEN_MAX_DF;
}

export function hasEnoughSignal(query: string): boolean {
  const tokens = [...new Set(tokenise(query))];
  if (!tokens.length) return false;
  if (tokens.length >= 2) return true;
  return isDistinctive(tokens[0]);
}

export const kbCounts = kb.counts as {
  pages: number;
  faqs: number;
  pointers: number;
};
