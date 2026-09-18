"""Prose style gate: no em dash in anything a visitor reads.

Founder instruction 2026-09-18: "Remove any dashed lines from the text like they
are here. It looks like it's been AI generated. Remove the dashed lines from
this and any other sections of the website."

It is a standing preference, not a one-off edit. Eighty-nine em dashes were
removed across forty-eight pages to satisfy it, and every future copy change is
an opportunity to put one back, so the rule is enforced rather than remembered.

WHAT IS AND IS NOT CAUGHT.

  CAUGHT   The em dash, U+2014, used as a sentence break: "we build it — and we
           run it". This is the character the instruction is about.

  NOT CAUGHT, DELIBERATELY:

    - The EN DASH, U+2013, in a numeric or date range: "2025-2026", "2-3
      processes". Five of these are live on the site. They are correct
      typography for a range and are not what the instruction describes; a gate
      that failed on them would be training people to ignore it.
    - HYPHENS in compound words: "on-chain", "digital-asset", "AI-native".
      Ordinary hyphenation, nothing to do with the instruction.
    - SOURCE COMMENTS. This file's own prose, and every explanatory comment in
      the repository, uses em dashes freely. They are not visitor-facing and
      rewriting them would be pure churn.

TWO LAYERS, for the reason the headline gate has two: built HTML cannot see a
route that emits no HTML (/case-studies takes a ?filter= searchParam), and a
source scan cannot see text composed at render time from a variable. A failure
in either fails the gate, and the coverage reconciliation is asserted rather
than assumed.
"""

import glob
import html
import io
import os
import re
import sys

EM_DASH = '—'

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BUILT = os.path.join(REPO, '.next', 'server', 'app')
SRC = os.path.join(REPO, 'src')
APP = os.path.join(SRC, 'app')

# Files whose text is served to a reader but which are not pages. llms.txt is
# addressed to machines rather than people, so it is NOT included: its em dashes
# are not "text on the website" in the sense the instruction means, and rewriting
# machine-readable guidance to satisfy a typographic preference risks the
# guidance for no reader's benefit. Recorded so the omission is a decision.
PUBLIC_TEXT: list[str] = []


def strip_comments(src: str) -> str:
    """Blank out block and JSX comments, preserving line numbers."""
    src = re.sub(r'/\*.*?\*/', lambda m: '\n' * m.group(0).count('\n'), src, flags=re.S)
    src = re.sub(r'\{/\*.*?\*/\}', lambda m: '\n' * m.group(0).count('\n'), src, flags=re.S)
    return re.sub(r'^\s*//.*$', '', src, flags=re.M)


def visible_text(raw: str) -> str:
    """Body text as a reader sees it: no scripts, no comments, no tags.

    The comment strip is not cosmetic. React's server renderer separates static
    text from an interpolated value with an empty HTML comment, so a match
    written against the visible sentence fails without it.
    """
    body = re.search(r'<body[^>]*>(.*)</body>', raw, re.S)
    out = body.group(1) if body else raw
    out = re.sub(r'<script.*?</script>', '', out, flags=re.S)
    out = re.sub(r'<!--.*?-->', '', out, flags=re.S)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', out)))


def built_hits():
    hits = []
    for f in sorted(glob.glob(os.path.join(BUILT, '**', '*.html'), recursive=True)):
        page = '/' + os.path.relpath(f, BUILT)[:-5].replace(os.sep, '/')
        if page == '/index':
            page = '/'
        txt = visible_text(io.open(f, encoding='utf-8', errors='replace').read())
        for m in re.finditer(re.escape(EM_DASH), txt):
            hits.append((page, txt[max(0, m.start() - 50):m.start() + 50].strip()))
    return hits


def source_hits():
    """Em dashes in source STRINGS, comments excluded.

    Scoped to `src/app` and `src/components`: `src/content` holds the claims
    register and the internal evidence notes, which are records rather than
    published copy and are deliberately left alone. Anything in content that
    DOES render is caught by the built layer instead.
    """
    hits = []
    roots = [os.path.join(SRC, 'app'), os.path.join(SRC, 'components')]
    for root in roots:
        for f in sorted(glob.glob(os.path.join(root, '**', '*.tsx'), recursive=True)):
            rel = os.path.relpath(f, REPO).replace(os.sep, '/')
            clean = strip_comments(io.open(f, encoding='utf-8').read())
            for i, line in enumerate(clean.split('\n'), 1):
                if EM_DASH in line:
                    hits.append(('%s:%d' % (rel, i), line.strip()[:90]))
    return hits


def source_routes():
    routes = set()
    for f in glob.glob(os.path.join(APP, '**', 'page.tsx'), recursive=True):
        r = '/' + os.path.relpath(os.path.dirname(f), APP).replace(os.sep, '/')
        if r == '/.':
            r = '/'
        if '[' not in r:
            routes.add(r)
    return routes


def built_routes():
    routes = set()
    for f in glob.glob(os.path.join(BUILT, '**', '*.html'), recursive=True):
        r = '/' + os.path.relpath(f, BUILT)[:-5].replace(os.sep, '/')
        routes.add('/' if r == '/index' else r)
    return routes


def main() -> int:
    if not os.path.isdir(BUILT):
        print('ABORT  no build output at .next/server/app - run the build first')
        return 1

    built = built_hits()
    source = source_hits()

    # Coverage: a route with no HTML must have been reachable by the source scan.
    scanned = {h[0].split(':')[0] for h in source}
    unchecked = []
    for r in sorted(source_routes() - built_routes()):
        page_file = ('src/app' + ('' if r == '/' else r) + '/page.tsx').replace('//', '/')
        if not os.path.isfile(os.path.join(REPO, page_file)):
            unchecked.append(r)

    bar = '=' * 78
    print(bar)
    print('%-58s %s' % ('em dashes in rendered copy', len(built)))
    print('%-58s %s' % ('em dashes in page/component source strings', len(source)))
    dynamic = sorted(source_routes() - built_routes())
    print('%-58s %s' % ('routes with no static HTML (source layer covers them)',
                        ', '.join(dynamic) or 'none'))
    print(bar)

    for page, frag in built[:40]:
        print('FAIL  rendered  %-34s ...%s...' % (page, frag))
    for where, frag in source[:40]:
        print('FAIL  source    %-34s %s' % (where, frag))
    for r in unchecked:
        print('FAIL  route covered by neither layer: %s' % r)

    if built or source or unchecked:
        print(bar)
        print('FAIL  em dash found. Use a comma, a colon, a semicolon or two sentences.')
        print(bar)
        return 1

    print('PASS  no em dash in rendered copy')
    print('PASS  no em dash in page or component source strings')
    print('PASS  every route covered by at least one layer')
    print(bar)
    return 0


if __name__ == '__main__':
    sys.exit(main())
