"""Acceptance check: every founder instruction from the 14-15 September pass.

Run it from the repository root AFTER a build:

    node node_modules/next/dist/bin/next build
    python verification/2026-09-15/founder_instructions_check.py

WHY IT IS COMMITTED. The 86 render assertions cited in commit 0f2324e were
produced by a scratch script that was never committed, so no later reader could
re-run them - a gap this repository recorded against itself in VER-2602. This
file exists so the same thing is not true of the 18 checks that answered the
founder's question "verify that the things I have told you to do are completed".

WHAT IT READS. The BUILT HTML under .next/server/app, not the source. Several
defects fixed in this pass were invisible from source and only appeared in the
emitted output - 89 FAQ answers present in structured data and rendered nowhere,
two placeholder strings the page produced from a permission gate rather than from
a missing file. A check that reads the source would have passed over both.

WHAT IT DOES NOT COVER. Anything requiring the network or a founder decision:
whether the deployment is live, whether the legacy URLs actually redirect in
production, or any of the open items - audience, the A12 holdback, the blog
decision. Those are verified by hand against the live site or are not
engineering questions at all.
"""
import glob
import html as H
import io
import json
import os
import re

ROOT = r"C:/Users/Rana/Brain/CTO Vault/05_Projects/Pixelette_Tech_Website_001/rebuild-2026"
os.chdir(ROOT)
A = '.next/server/app/'


def visible(path):
    h = io.open(path, encoding='utf-8', errors='replace').read()
    s = re.sub(r'<script[\s\S]*?</script>', ' ', h, flags=re.I)
    s = re.sub(r'<style[\s\S]*?</style>', ' ', s, flags=re.I)
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', s))), h


home_txt, home_html = visible(A + 'index.html')
main_m = re.search(r'<main[^>]*>([\s\S]*?)</main>', home_html)
main_html = main_m.group(1) if main_m else home_html
main_txt = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ',
                  re.sub(r'<script[\s\S]*?</script>', ' ', main_html, flags=re.I))))

checks = []


def check(instruction, condition, detail=''):
    checks.append((bool(condition), instruction, detail))


# --- "Remove the Full Stops" (the H1) -------------------------------------
h1 = re.search(r'<h1[^>]*>([\s\S]*?)</h1>', home_html)
h1txt = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h1.group(1)))).strip() if h1 else ''
check('H1 full stops removed', '.' not in h1txt, h1txt)
og = io.open('src/app/opengraph-image.tsx', encoding='utf-8').read()
check('  ...and on the social card', 'Engineering that ships.' not in og)
seo = io.open('src/lib/seo.ts', encoding='utf-8').read()
co = io.open('src/content/company.ts', encoding='utf-8').read()
check('  ...and in the schema h1 + tagline',
      'AI built into both.' not in seo and 'AI built into both.' not in co)

# --- "Delete these sections from the home page" ----------------------------
check('Client row removed from homepage', 'gowalkies' not in main_txt)
check('Verified-proof section removed', 'Built for real operating environments' not in main_txt)
ai_txt, _ = visible(A + 'ai-engineering.html')
# INVERTED 2026-09-16, and the inversion is the record of a real consequence.
#
# This check was written on 2026-09-15 to prove that removing the client row
# from the HOMEPAGE withdrew nothing from the SITE: the same names still
# rendered on /ai-engineering, so the founder's instruction cost reach on one
# page rather than deleting the names.
#
# On 2026-09-16 he had them removed from /ai-engineering too, because none of
# them are AI clients. `ClientLogos` rendered in exactly one place, so THE SEVEN
# APPROVED CLIENT NAMES ARE NOW PUBLISHED NOWHERE ON THE SITE. That is his
# decision, taken knowingly after being told, and this assertion now guards the
# new intent instead of the old one.
check('Founder: client names withdrawn from /ai-engineering too', 'gowalkies' not in ai_txt)
cert_txt, _ = visible(A + 'certifications.html')
check('  ...certificates still published in full', 'AMER800409' in cert_txt)

# --- Homepage audit, its own acceptance table -----------------------------
sections = len(re.findall(r'<section[^>]*>', home_html))
words = len(main_txt.split())
check('Audit: sections at or under 12', sections <= 12, '%d sections' % sections)
check('Audit: body words under 1600', words < 1600, '%d words' % words)
check('Audit: zero visible placeholders',
      len(re.findall(r'\[\s*[A-Za-z][^\]]{2,60}\]', main_txt)) == 0)
check('Audit: one process model (six-step retired)', 'Discover. Design. Build' not in main_txt)
# INVERTED 2026-09-15 on founder instruction: the GBP6,000-12,000 figure is
# removed from the site entirely, so the original assertion is now the defect.
check('Founder: no price figure on the homepage', '6,000' not in main_txt and '12,000' not in main_txt)
check('Audit: third-party citation on the homepage', 'McKinsey' in main_txt)
faq_page = len(re.findall(r'<details', main_html))
faq_schema = 0
for b in re.findall(r'<script type="application/ld\+json"[^>]*>([\s\S]*?)</script>', home_html):
    try:
        j = json.loads(b)
    except ValueError:
        continue
    for it in (j if isinstance(j, list) else [j]):
        if isinstance(it, dict) and it.get('@type') == 'FAQPage':
            faq_schema = len(it.get('mainEntity', []))
check('Audit: FAQ page and schema both 5',
      faq_page == 5 and faq_schema == 5, 'page %d / schema %d' % (faq_page, faq_schema))

# --- Earlier session instructions -----------------------------------------
tot = hid = 0
for f in glob.glob(A + '**/*.html', recursive=True):
    txt, raw = visible(f)
    for b in re.findall(r'<script type="application/ld\+json"[^>]*>([\s\S]*?)</script>', raw):
        try:
            j = json.loads(b)
        except ValueError:
            continue
        for it in (j if isinstance(j, list) else [j]):
            if isinstance(it, dict) and it.get('@type') == 'FAQPage':
                for q in it.get('mainEntity', []) or []:
                    a = (q.get('acceptedAnswer') or {}).get('text', '')
                    p = re.sub(r'\s+', ' ', H.unescape(a)).strip()[:70]
                    tot += 1
                    if p and p not in txt:
                        hid += 1
check('FAQ answers all visible (was 89 hidden)', hid == 0, '%d hidden of %d' % (hid, tot))

ph = 0
for p in ['privacy', 'security-and-data', 'terms', 'modern-slavery', 'assurance']:
    f = A + p + '.html'
    if os.path.exists(f):
        ph += io.open(f, encoding='utf-8', errors='replace').read().count('data-placeholder')
check('Legal pages carry zero placeholders', ph == 0, '%d found' % ph)

rm = json.load(io.open('.next/routes-manifest.json', encoding='utf-8'))
reds = [r for r in rm.get('redirects', []) if 'nextInternal' not in str(r.get('source'))]
check('Legacy redirects registered', len(reds) >= 10, '%d redirects' % len(reds))
check('/industries exists', os.path.exists(A + 'industries.html'))


# --- "Remove prices from the whole website" (2026-09-16) -------------------
#
# A STANDING RULE, so it gets a standing guard rather than a memory of having
# done it once. His words: "remove prices from the whole website. I don't want
# prices on the website."
#
# FAIL-CLOSED BY DESIGN. It does not hunt for known price strings - it
# enumerates EVERY currency figure in the built output and requires each one to
# be on a named allowlist. A new price added later is therefore a failure by
# default, which is the opposite of the check that would have to be updated to
# notice it. The previous price sweep needed three passes precisely because it
# searched for what it already knew about.
ALLOWED_FIGURES = {
    # Third-party market stat, sourced to Thomson Reuters, owned by the
    # industry pages. Not a price.
    '£20bn',
    # The Modern Slavery Act 2015 section 54(2)(b) turnover threshold. A
    # statutory fact; removing it would break the legal page.
    '£36 m',
    # Cost per case in the SAMPLE operating dashboard - a client's inference
    # cost in an explicitly illustrative mock, not a price for our services.
    '£0.031', '£0.05',
}

price_failures = []
currency = re.compile(r'(?:£|GBP\s?)[0-9][0-9,.]*\s*(?:bn|m|million|k)?')
for f in glob.glob(A + '**/*.html', recursive=True) + ['public/llms.txt']:
    if not os.path.exists(f):
        continue
    raw = io.open(f, encoding='utf-8', errors='replace').read()
    for m in currency.finditer(raw):
        if m.group(0).strip() not in ALLOWED_FIGURES:
            price_failures.append('%s in %s' % (m.group(0).strip(), os.path.basename(f)))
    # A price can be machine-readable while invisible on the page. The
    # support-and-run Offer node published one for weeks with no figure in the
    # visible copy of several linking pages.
    if 'priceCurrency' in raw or '"price"' in raw:
        price_failures.append('JSON-LD price node in %s' % os.path.basename(f))
    low = raw.lower()
    for phrase in ['from £', 'priced on application', 'on application', '/mo<', 'per month']:
        if phrase in low:
            price_failures.append('price phrasing "%s" in %s' % (phrase, os.path.basename(f)))

check('Founder: no price anywhere on the site', not price_failures,
      '; '.join(sorted(set(price_failures))[:3]) if price_failures else 'incl. no JSON-LD Offer')

print('=' * 70)
for passed, instruction, detail in checks:
    print('%s  %-48s %s' % ('PASS' if passed else 'FAIL', instruction, detail))
print('=' * 70)
failed = [c for c in checks if not c[0]]
print('%d checks, %d failed' % (len(checks), len(failed)))
