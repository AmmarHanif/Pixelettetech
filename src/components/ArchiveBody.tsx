import type { ArchiveBlock } from '@/content/archive/types';

/**
 * Renders a migrated archive article from its blocks.
 *
 * ONE RENDERER FOR 36 ARTICLES. The alternative was 53,000 words of hand-written
 * JSX, which cannot be regenerated when the source changes and which puts every
 * one of those words one typo away from misquoting somebody else's published
 * writing. Data plus a renderer can be re-derived from the source and checked by
 * counting.
 *
 * CONSECUTIVE LIST ITEMS ARE GATHERED INTO ONE <ul>. The harvest records blocks
 * in document order, so a run of `li` is a list; emitting each as its own list
 * would be valid HTML that reads correctly to the eye and wrongly to a screen
 * reader, which announces the item count per list. Grouping them is the
 * difference between "list, 6 items" and six lists of one.
 *
 * NO IMAGES, BY INSTRUCTION. The founder asked for text only, so the migration
 * carries headings, paragraphs and list items. The harvester also drops the
 * "Source: X" captions that belonged to the removed figures, since a caption
 * with nothing to caption is worse than no caption.
 */
export function ArchiveBody({ blocks }: { blocks: ArchiveBlock[] }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: number) => {
    if (!list.length) return;
    out.push(
      <ul className="arc-list" key={`ul-${key}`}>
        {list.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  blocks.forEach(([kind, text], i) => {
    if (kind === 'li') {
      list.push(text);
      return;
    }
    flush(i);
    if (kind === 'h2') {
      out.push(
        <h2 className="h3" key={i}>
          {text}
        </h2>,
      );
    } else if (kind === 'h3') {
      out.push(
        <h3 className="h4" key={i}>
          {text}
        </h3>,
      );
    } else {
      out.push(
        <p className="body" key={i}>
          {text}
        </p>,
      );
    }
  });
  flush(blocks.length);

  return <div className="arc-body">{out}</div>;
}
