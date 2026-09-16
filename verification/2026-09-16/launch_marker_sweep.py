"""Launch gate: no staging or internal marker may be publicly visible.

    python verification/2026-09-16/launch_marker_sweep.py

WHY IT EXISTS. The founder's launch instruction lists the markers by hand. A
hand-run grep found ten pages and missed the worst one, because the placeholder
component renders `[DATE]` as `[ DATE ]` with spaces inside the brackets and an
exact-string search does not match it. A sweep that can miss the thing it was
written to find is worse than none, so this normalises whitespace first.

WHAT IT READS. The built output under .next/server/app: visible text, the
`<head>` metadata, and the JSON-LD blocks. All three are public surfaces. A
marker can reach a reader through a meta description or a structured-data blob
without ever appearing in visible copy - that has already happened on this site
three times, with a price in an Offer node, a chain list in an FAQ and a research
caveat in another FAQ.
"""
import glob
import html as H
import io
import os
import re
import sys

ROOT = r"C:/Users/Rana/Brain/CTO Vault/05_Projects/Pixelette_Tech_Website_001/rebuild-2026"
APP = os.path.join(ROOT, '.next/server/app')

# Each entry is a regex run against WHITESPACE-NORMALISED text, so `[ DATE ]`
# and `[DATE]` both match. Bracketed tokens allow internal spaces on purpose.
MARKERS = [
    ('bracketed DATE',        r'\[\s*DATE\s*\]'),
    ('bracketed AUTHOR',      r'\[\s*AUTHOR\s*\]'),
    ('bracketed PLANNED',     r'\[\s*PLANNED'),
    ('bracketed ARCHIVE',     r'\[\s*ARCHIVE'),
    ('bracketed MEASURED',    r'\[\s*MEASURED\s+RESULT\s*\]'),
    ('pending write-up',      r'pending\s+write-?up'),
    ('HOLD marker',           r'\bHOLD\b'),
    ('TODO',                  r'\bTODO\b'),
    ('TBC',                   r'\bTBC\b'),
    ('placeholder',           r'\bplaceholders?\b'),
    ('claims register',       r'claims\s+register'),
    ('data-placeholder attr', r'data-placeholder'),
]

# Pages the founder has explicitly withdrawn from launch. They are noindexed and
# unlinked, so their contents are not a launch blocker - but they are listed, not
# silently skipped, because "excluded" and "clean" are different states.
WITHDRAWN = {'insights'}

findings = []
withdrawn_hits = []
pages = 0

for f in sorted(glob.glob(os.path.join(APP, '**/*.html'), recursive=True)):
    raw = io.open(f, encoding='utf-8', errors='replace').read()
    page = os.path.relpath(f, APP).replace('\\', '/')[:-5]
    pages += 1

    # Visible text, with JSON-LD folded back in rather than stripped: it is a
    # public surface even though no reader sees it rendered.
    body = re.sub(r'<script type="application/ld\+json"[^>]*>([\s\S]*?)</script>', r' \1 ', raw)
    body = re.sub(r'<script[\s\S]*?</script>', ' ', body, flags=re.I)
    body = re.sub(r'<style[\s\S]*?</style>', ' ', body, flags=re.I)
    visible = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', body)))

    head = re.search(r'<head[^>]*>([\s\S]*?)</head>', raw)
    meta = re.sub(r'\s+', ' ', H.unescape(head.group(1))) if head else ''

    for label, pattern in MARKERS:
        where = []
        if re.search(pattern, visible):
            where.append('visible')
        if re.search(pattern, meta):
            where.append('metadata')
        # The attribute form only exists in raw markup.
        if label.endswith('attr') and re.search(pattern, raw):
            where = ['markup']
        if where:
            row = '%-38s %-24s %s' % (page, label, '+'.join(sorted(set(where))))
            (withdrawn_hits if page in WITHDRAWN else findings).append(row)

print('=' * 78)
for r in findings:
    print('FAIL  ' + r)
for r in withdrawn_hits:
    print('note  ' + r + '   (page withdrawn from launch: noindexed, unlinked)')
if not findings:
    print('PASS  no staging or internal marker on any launched page')
print('=' * 78)
print('%d pages scanned, %d finding(s) on launched pages, %d on withdrawn pages'
      % (pages, len(findings), len(withdrawn_hits)))
sys.exit(1 if findings else 0)
