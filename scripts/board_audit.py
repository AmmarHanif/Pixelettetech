# -*- coding: utf-8 -*-
"""Audit one design board against its built page.

    python board_audit.py <boardId> <sitePath>
    python board_audit.py p3 /ai-engineering
"""
import glob
import html as H
import io
import re
import sys
import unicodedata
from urllib.request import Request, urlopen

# The design and the site are full of typographic punctuation. On a Windows
# console defaulting to cp1252 an arrow or a middot kills the run mid-report,
# so force UTF-8 rather than depending on the caller passing -X utf8.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = "http://localhost:3000"
board_id, site_path = sys.argv[1], sys.argv[2]
# Git Bash rewrites a leading-slash argument into a Windows path, so callers
# pass the route without one and it is restored here.
site_path = "/" + site_path.lstrip("/")

design_file = glob.glob(r"C:\Users\Rana\OneDrive\GA\Pixelette Website 2026*tobedevelopedforgolive.html")[0]
doc = io.open(design_file, encoding="utf-8", errors="replace").read()

# --- isolate the board, dropping the design tool's own chrome bar
start = doc.find('<section id="%s"' % board_id)
after = re.search(r'<section id="p\d+"', doc[start + 10:])
board = doc[start: start + 10 + after.start()] if after else doc[start:]
title = re.search(r'class="t">([^<]+)<', board)
board_title = title.group(1) if title else board_id
board = re.sub(r'<div class="pagebar">.*?</div>\s*</div>', "", board, flags=re.S)

# --- built page
built_raw = urlopen(Request(BASE + site_path, headers={"User-Agent": "audit"}), timeout=25).read().decode("utf-8", "replace")
built_body = built_raw.split("<body", 1)[1]
built_body = re.sub(r"<script.*?</script>", " ", built_body, flags=re.S)


def visible(markup):
    t = re.sub(r"<svg.*?</svg>", " ", markup, flags=re.S)
    t = re.sub(r"<!--.*?-->", " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", "\n", t)
    return H.unescape(t)


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    for a, b in (("\u2019", "'"), ("\u2018", "'"), ("\u201c", '"'), ("\u201d", '"'),
                 ("\u2014", "-"), ("\u2013", "-"), ("\u00b7", "-"), ("\u00d7", "x")):
        s = s.replace(a, b)
    return " ".join(re.sub(r"[^a-z0-9]+", " ", s.lower()).split())


built_flat = norm(visible(built_body))

print("=" * 76)
print("BOARD %s — %s   vs   %s" % (board_id, board_title, site_path))
print("=" * 76)

# --- content diff
lines = [l.strip() for l in visible(board).split("\n")]
lines = [l for l in lines if len(l) > 12]
missing = [l for l in lines if norm(l) and norm(l) not in built_flat]
print("\nCONTENT")
print("  design lines checked : %d" % len(lines))
print("  found on built page  : %d" % (len(lines) - len(missing)))
print("  NOT found            : %d" % len(missing))
for m in missing:
    print("     - %s" % m[:145])

# --- slots the design asks for
print("\nMEDIA SLOTS THE DESIGN SPECIFIES")
slots = re.findall(r"\[\s*([A-Z][A-Z0-9 \u00b7&/,'-]{3,60})\s*\]", visible(board))
if not slots:
    print("  none")
for s in dict.fromkeys(slots):
    print("  [ %s ]" % s.strip())

# --- what the built page actually has
print("\nBUILT PAGE")
imgs = re.findall(r"<img[^>]*>", built_body)
print("  images rendered      : %d" % len(imgs))
for tag in imgs:
    src = re.search(r'src="([^"]*)"', tag)
    alt = re.search(r'alt="([^"]*)"', tag)
    print("     %-34s alt=%s" % (src.group(1) if src else "?", alt.group(1) if alt else "MISSING"))
unfilled = re.findall(r'<div class="slot"[^>]*>(.*?)</div>', built_body, re.S)
print("  unfilled media slots : %d" % len(unfilled))
for u in unfilled:
    print("     %s" % re.sub(r"<[^>]+>", "", u).strip()[:60])
phs = re.findall(r'data-placeholder="true">(.*?)</span>', built_body, re.S)
print("  visible placeholders : %d" % len(phs))
for p in phs:
    print("     %s" % re.sub(r"<[^>]+>", "", p).strip()[:70])

# --- heading comparison
def heads(markup):
    return [(t.lower(), re.sub(r"<[^>]+>", "", x).strip())
            for t, x in re.findall(r"<(h[1-4])[^>]*>(.*?)</\1>", markup, re.S)]

print("\nHEADINGS")
db = heads(board)
bb = heads(built_body)
print("  design: %s" % ({t: sum(1 for x, _ in db if x == t) for t in ("h1", "h2", "h3", "h4")}))
print("  built : %s" % ({t: sum(1 for x, _ in bb if x == t) for t in ("h1", "h2", "h3", "h4")}))
