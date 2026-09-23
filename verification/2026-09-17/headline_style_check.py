"""Headline style gate: no closing full stop, and no NEW Title Case headings.

Founder instruction 2026-09-17: "You've reverted back to full stops at the end
of headlines unnecessarily. I want sentence case for headlines."

The word "reverted" is the important part. A homepage-only h1 check already
existed in founder_instructions_check.py and it was green the whole time the
site carried twelve full-stopped headings on other pages, because it only ever
looked at one heading. A check that passes while the thing it is named after is
false is worse than no check. This one looks at every heading on every route.

TWO LAYERS, BECAUSE EACH ONE HAS A BLIND SPOT THE OTHER COVERS.

  BUILT HTML   catches headings whose text is COMPOSED at render time rather
               than written as a literal - `certified.positioningLine` reaches
               two headings through a variable and no source scan for quoted
               strings will ever see it.

  SOURCE       catches routes that emit no static HTML. /case-studies takes a
               `?filter=` searchParam, so Next renders it on demand and writes
               no .html file. Every check in this repository that walks the
               built output silently skips it - which is exactly where the
               founder found a heading none of them had reported.

Neither layer alone is sufficient, so a failure in either fails the gate, and
the coverage reconciliation at the end is asserted rather than assumed: if a
source route has no built HTML AND no literal heading was extracted from it,
that route is unchecked and the gate says so instead of passing quietly.
"""

import glob
import html
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BUILT = os.path.join(REPO, '.next', 'server', 'app')
SRC = os.path.join(REPO, 'src')
APP = os.path.join(SRC, 'app')

# Heading-shaped props on the section components. `title=` is by far the most
# common way a heading reaches the page without being inside an <h1>.
HEAD_PROPS = ('title', 'heading', 'h1', 'h2')

# ---------------------------------------------------------------------------
# Headings that are allowed to read as Title Case, each with the reason.
#
# ENUMERATE AND ALLOWLIST, rather than hunting for known-bad strings: anything
# not named here fails, so a new Title Case heading is loud on the day it lands
# instead of being found in a screenshot months later.
# ---------------------------------------------------------------------------
TITLE_CASE_ALLOWED = {
    # Proper nouns: entities, named frameworks, named stages and named offers.
    'Part of Pixelette Group': 'group entity name',
    'A shareholding in Big Innovation Centre': 'organisation name',
    # Client names, which became HEADINGS on 2026-09-18 when the homepage work
    # cards were rebuilt. They are proper nouns and they publish under a name
    # permission recorded in work.ts - ADR-0036. Expect this list to grow by one
    # entry each time a client is named; that is the gate working, not drift.
    'Fusio Wallet': 'client name, published under a recorded permission',
    'Ayni Gold': 'client name, published under a recorded permission',
    'AI DPS RM6200': 'Crown Commercial framework name',
    'Start at LAND': 'LAND is a named delivery stage',
    'Start with Value Discovery': 'Value Discovery is the named offer',
    'Value Discovery': 'named offer',
    'dApps and DeFi': 'proper nouns',
    'Layer 1, Layer 2 and DAOs': 'proper nouns',
    'Privacy at Pixelette': 'document title carrying the company name, not a headline',
    'Built by Pixelette': 'Support & Continuous Improvement card, carries the company name',
    # A mono design label plus its small badge, which the text extractor glues
    # together ("AUTOMATE" + "THIS PAGE"). Uppercase by design, not a headline.
    'AUTOMATETHIS PAGE': 'mono section label, not a heading',
    'BUILDTHIS PAGE': 'mono section label, not a heading',
    'DECENTRALISETHIS PAGE': 'mono section label, not a heading',
    # ---------------------------------------------------------------------
    # SERVICE NAMES - PENDING A FOUNDER DECISION, recorded 2026-09-17.
    #
    # These are Title Case because they are treated as the names of service
    # lines, and they are carried in nav labels, breadcrumbs, JSON-LD `name`
    # fields and the `service` field in work.ts - so lowering them is a naming
    # and structured-data change, not a typographic one, and it is his call.
    #
    # They are NOT internally consistent today, which is the argument for
    # making the decision: /ai-engineering renders "Production AI systems" in
    # its prose and "Production AI Systems" as a heading, and the LIVE diagram
    # says "Data & integration" and "Support & run" while the service cards say
    # "Data & Integration" and "Support & Run".
    # ---------------------------------------------------------------------
    'Production AI Systems': 'service name - founder decision pending',
    'Data & Integration': 'service name - founder decision pending',
    'Evaluation & Observability': 'service name - founder decision pending',
    'Support & Run': 'service name - founder decision pending',
}

SMALL_WORDS = {
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'is', 'it',
    'not', 'of', 'on', 'or', 'the', 'to', 'we', 'with', 'you', 'your',
}


def strip_block_comments(src):
    """Blank out /* ... */ so prose inside a comment is never read as a heading.

    Newlines are preserved so reported line numbers stay true.
    """
    return re.sub(r'/\*.*?\*/', lambda m: '\n' * m.group(0).count('\n'), src, flags=re.S)


def text_of(inner):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', inner))).strip()


def headings_from_built():
    out = []
    for f in sorted(glob.glob(os.path.join(BUILT, '**', '*.html'), recursive=True)):
        page = '/' + os.path.relpath(f, BUILT)[:-5].replace(os.sep, '/')
        if page == '/index':
            page = '/'
        src = open(f, encoding='utf-8', errors='replace').read()
        for m in re.finditer(r'<(h[1-3])\b[^>]*>(.*?)</\1>', src, re.S):
            t = text_of(m.group(2))
            if t:
                out.append((page, m.group(1), t))
    return out


def headings_from_source():
    out = []
    for f in sorted(glob.glob(os.path.join(SRC, '**', '*.tsx'), recursive=True)):
        rel = os.path.relpath(f, REPO).replace(os.sep, '/')
        clean = strip_block_comments(open(f, encoding='utf-8').read())
        for m in re.finditer(r'<(h[1-3])\b[^>]*>(.*?)</\1>', clean, re.S):
            t = text_of(m.group(2))
            # Skip anything still holding a JSX expression: its value is not
            # knowable from source, and the built layer covers it.
            if t and '{' not in t:
                out.append((rel, m.group(1), t))
        for prop in HEAD_PROPS:
            for m in re.finditer(prop + r'="([^"]{6,})"', clean):
                out.append((rel, prop, text_of(m.group(1))))
    return out


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


def is_title_case(text):
    words = re.findall(r"[A-Za-z][A-Za-z'-]*", text)
    if len(words) < 2:
        return False
    rest = [w for w in words[1:] if w.lower() not in SMALL_WORDS]
    return bool(rest) and all(w[0].isupper() for w in rest)


def main():
    if not os.path.isdir(BUILT):
        print('ABORT  no build output at .next/server/app - run the build first')
        return 1

    built = headings_from_built()
    source = headings_from_source()
    failures = []

    # -- 1. No heading ends in a full stop ---------------------------------
    stops = []
    seen = set()
    for where, kind, text in built + source:
        if text.endswith('.') and not text.endswith('..') and text not in seen:
            seen.add(text)
            stops.append((where, kind, text))
    if stops:
        failures.append('%d heading(s) end in a full stop' % len(stops))

    # -- 2. No Title Case heading outside the allowlist ---------------------
    tc = []
    seen = set()
    for where, kind, text in built + source:
        if text in TITLE_CASE_ALLOWED or text in seen:
            continue
        if is_title_case(text):
            seen.add(text)
            tc.append((where, kind, text))
    if tc:
        failures.append('%d Title Case heading(s) not in the allowlist' % len(tc))

    # -- 3. Coverage: every route reached one of the two layers -------------
    scanned_files = {w for w, _, _ in source}
    unchecked = []
    for r in sorted(source_routes() - built_routes()):
        page_file = ('src/app' + ('' if r == '/' else r) + '/page.tsx').replace('//', '/')
        if page_file not in scanned_files:
            unchecked.append(r)
    if unchecked:
        failures.append('%d route(s) checked by NEITHER layer' % len(unchecked))

    # -- report -------------------------------------------------------------
    bar = '=' * 78
    print(bar)
    print('%-58s %s' % ('headings scanned in built HTML', len(built)))
    print('%-58s %s' % ('heading strings scanned in source', len(source)))
    dynamic = sorted(source_routes() - built_routes())
    print('%-58s %s' % ('routes with no static HTML (source layer covers them)',
                        ', '.join(dynamic) or 'none'))
    print(bar)

    for where, kind, text in stops:
        print('FAIL  full stop   %-6s %-40s %s' % (kind, where[-40:], text[:60]))
    for where, kind, text in tc:
        print('FAIL  title case  %-6s %-40s %s' % (kind, where[-40:], text[:60]))
    for r in unchecked:
        print('FAIL  unchecked route: %s' % r)

    if failures:
        print(bar)
        for f in failures:
            print('FAIL  ' + f)
        print(bar)
        return 1

    print('PASS  no heading ends in a full stop')
    print('PASS  no Title Case heading outside the allowlist (%d allowed)'
          % len(TITLE_CASE_ALLOWED))
    print('PASS  every route covered by at least one layer')
    print(bar)
    return 0


if __name__ == '__main__':
    sys.exit(main())
