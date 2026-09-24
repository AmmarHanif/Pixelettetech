/**
 * Block type for migrated archive articles.
 *
 * WHY BLOCKS RATHER THAN JSX. The 36 articles carried over from the previous
 * site run to roughly ninety thousand words. Hand-written JSX at that volume is
 * ninety thousand words of opportunity to introduce a typo into someone else's
 * published writing, and it cannot be regenerated when the source changes. Data
 * plus one renderer can be re-derived from the source at any time and is
 * verifiable by counting.
 *
 * DELIBERATELY NARROW. Four kinds, no inline marks, no images. The founder asked
 * for "only text only", so the migration carries the words and nothing else: no
 * figures, no captions, no embedded CTAs. A richer type would invite someone to
 * start hand-enriching individual articles, and the value of these pages is that
 * they are uniform and honest about being historical.
 */
export type ArchiveBlockKind = 'h2' | 'h3' | 'p' | 'li';

/** A tuple rather than an object: 36 files x ~120 blocks, so terseness is real. */
export type ArchiveBlock = [ArchiveBlockKind, string];
