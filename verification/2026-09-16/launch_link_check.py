"""Launch gate: every internal link resolves to a real route.

    python verification/2026-09-16/launch_link_check.py

WHY IT DERIVES ROUTES FROM SOURCE, NOT FROM EMITTED HTML. The first version of
this check listed the prerendered .html files and called anything else broken. It
reported /case-studies - the Work index, linked from most of the site - as a dead
link. It is not: it takes a `filter` search param, so Next marks it DYNAMIC and
renders it on demand, emitting no static file. A release gate that cries wolf on
the main index is worse than no gate, because the next real finding gets waved
through with it.

So the route table is built from src/app/**/page.tsx, which is what actually
exists, and the redirect table is read from the build so a link to a legacy URL
that 308s is not reported as broken either.
"""
import glob
import io
import json
import os
import re
import sys

ROOT = r"C:/Users/Rana/Brain/CTO Vault/05_Projects/Pixelette_Tech_Website_001/rebuild-2026"
APP = os.path.join(ROOT, '.next/server/app')
SRC = os.path.join(ROOT, 'src/app')

# ---- routes that exist, from the source tree --------------------------------
static_routes = set()
dynamic_patterns = []
for f in glob.glob(os.path.join(SRC, '**/page.tsx'), recursive=True):
    rel = os.path.relpath(os.path.dirname(f), SRC).replace('\\', '/')
    route = '/' if rel == '.' else '/' + rel
    # Route groups like (marketing) do not appear in the URL.
    route = re.sub(r'/\([^)]+\)', '', route) or '/'
    if '[' in route:
        dynamic_patterns.append(re.compile('^' + re.sub(r'\[[^\]]+\]', r'[^/]+', route) + '$'))
    else:
        static_routes.add(route)

# ---- redirects registered by the build --------------------------------------
redirects = set()
rm = os.path.join(ROOT, '.next/routes-manifest.json')
if os.path.exists(rm):
    data = json.load(io.open(rm, encoding='utf-8'))
    for r in data.get('redirects', []):
        src = str(r.get('source', ''))
        if 'nextInternal' not in src:
            redirects.add(src.rstrip('/') or '/')

# Non-page routes that answer but have no page.tsx.
WELL_KNOWN = {'/robots.txt', '/sitemap.xml', '/opengraph-image'}


def resolves(target):
    if target in static_routes or target in redirects or target in WELL_KNOWN:
        return True
    return any(p.match(target) for p in dynamic_patterns)


broken = {}
checked = 0
for f in sorted(glob.glob(os.path.join(APP, '**/*.html'), recursive=True)):
    raw = io.open(f, encoding='utf-8', errors='replace').read()
    page = '/' + os.path.relpath(f, APP).replace('\\', '/')[:-5]
    for m in re.finditer(r'href="(/[^"]*)"', raw):
        href = m.group(1).split('#')[0].split('?')[0]
        if href.startswith('/_next'):
            continue
        target = href.rstrip('/') or '/'
        # A link to a real file under public/ is not a route.
        if re.search(r'\.[a-z0-9]{2,5}$', target, re.I) and target not in WELL_KNOWN:
            continue
        checked += 1
        if not resolves(target):
            broken.setdefault(target, set()).add(page)

# ---------------------------------------------------------------------------
# PUBLIC TEXT FILES, added 2026-09-17 after this check missed a live defect.
#
# /.well-known/security.txt carried a `Policy:` field pointing at
# /security-and-data, a page that had just been withdrawn. Nothing here looked
# at it, because this check walked rendered HTML and security.txt is a served
# machine-readable file that no page links to. llms.txt had the same exposure
# and two dead route references in it.
#
# The lesson is the one /case-studies already taught this repository: a check
# that reads only one KIND of artefact is blind to whatever is published in
# another. Absolute URLs on our own host are resolved as routes, because that
# is how these files are written.
# ---------------------------------------------------------------------------
PUBLIC_TEXT = sorted(glob.glob('public/*.txt') + glob.glob('public/.well-known/*'))
SELF_HOST = re.compile(r'https?://' + re.escape('pixelettetech.com') + r'(/[^\s\'"<>)\]]*)?')

for pf in PUBLIC_TEXT:
    raw_txt = io.open(pf, encoding='utf-8', errors='replace').read()
    where = pf.replace(os.sep, '/')
    for m in SELF_HOST.finditer(raw_txt):
        # Strip SENTENCE punctuation before the route is resolved. These files
        # are prose, so a URL is routinely followed by a full stop or a comma,
        # and the first run of this loop reported "/security-and-data." and
        # "/case-studies," as broken routes. That is the check misreading its
        # own input, not a defect on the site — and a check that cries wolf on
        # ordinary prose gets switched off, which would put the real blind spot
        # straight back.
        target = (m.group(1) or '/').split('#')[0].split('?')[0]
        target = target.rstrip('.,;:!').rstrip('/') or '/'
        if target.startswith('/_next'):
            continue
        if re.search(r'\.[a-z0-9]{2,5}$', target, re.I) and target not in WELL_KNOWN:
            continue
        checked += 1
        if not resolves(target):
            broken.setdefault(target, set()).add(where)

print('=' * 74)
if broken:
    for t, srcs in sorted(broken.items()):
        print('BROKEN  %-44s linked from %s' % (t, ', '.join(sorted(srcs)[:3])))
else:
    print('PASS  every internal link resolves')
print('=' * 74)
print('%d link(s) checked, %d static route(s), %d dynamic pattern(s), %d redirect(s), %d broken'
      % (checked, len(static_routes), len(dynamic_patterns), len(redirects), len(broken)))
sys.exit(1 if broken else 0)
