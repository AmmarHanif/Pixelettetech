# -*- coding: utf-8 -*-
"""Check the SHORT design lines the board diff skips.

`board_audit.py` only compares design lines longer than 12 characters, to keep
stray fragments out of the report. That filter hid a missing "Subscribe" call to
action on board 17. This sweeps every board for short lines — buttons, labels,
nav items — that are absent from the built page.
"""
import glob
import html as H
import io
import re
import sys
import unicodedata
from urllib.request import Request, urlopen

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = "http://localhost:3000"

BOARD_TO_PATH = {
    "p0": "/", "p3": "/ai-engineering", "p4": "/engineering", "p5": "/blockchain",
    "p6": "/ai-engineering/services", "p7": "/method/live",
    "p8": "/ai-engineering/support-and-run", "p9": "/assurance",
    "p10": "/ai-engineering/ai-value-baseline",
    "p11": "/ai-engineering/data-and-integration",
    "p12": "/ai-engineering/production-ai-systems",
    "p13": "/industries/professional-services", "p14": "/case-studies",
    "p15": "/case-studies/lytics", "p16": "/insights",
    "p17": "/about", "p18": "/contact",
}

# Design-tool chrome and fragments that are not page content.
IGNORE = {
    "pixelette", "work", "about", "contact", "ai", "all", "run", "build",
    "measure", "ready", "prove", "engineering", "blockchain", "insights",
    "certified", "1440px desktop", "390px mobile", "land", "integrate",
    "verify", "evolve", "clients", "sector work", "the gap", "the method",
    "proof", "verification", "voices", "start here", "delivered", "who we work with",
}

doc = io.open(
    glob.glob(r"C:\Users\Rana\OneDrive\GA\Pixelette Website 2026*tobedevelopedforgolive.html")[0],
    encoding="utf-8", errors="replace").read()
boards = [(m.group(1), m.start()) for m in re.finditer(r'<section id="(p\d+)"', doc)]


def norm(s):
    s = unicodedata.normalize("NFKD", H.unescape(s))
    for a, b in (("\u2019", "'"), ("\u00b7", "-"), ("\u2014", "-"), ("\u2013", "-")):
        s = s.replace(a, b)
    return " ".join(re.sub(r"[^a-z0-9]+", " ", s.lower()).split())


cache = {}
def built(path):
    if path not in cache:
        raw = urlopen(Request(BASE + path, headers={"User-Agent": "shortcheck"}), timeout=25).read().decode("utf-8", "replace")
        body = raw.split("<body", 1)[1]
        body = re.sub(r"<script.*?</script>", " ", body, flags=re.S)
        cache[path] = norm(re.sub(r"<[^>]+>", " ", body))
    return cache[path]


total, missing_total = 0, 0
for i, (bid, start) in enumerate(boards):
    path = BOARD_TO_PATH.get(bid)
    if not path:
        continue
    end = boards[i + 1][1] if i + 1 < len(boards) else len(doc)
    seg = doc[start:end]
    seg = re.sub(r'<div class="pagebar">.*?</div>\s*</div>', "", seg, flags=re.S)
    seg = re.sub(r"<svg.*?</svg>", " ", seg, flags=re.S)
    seg = re.sub(r"<!--.*?-->", " ", seg, flags=re.S)
    lines = [l.strip() for l in H.unescape(re.sub(r"<[^>]+>", "\n", seg)).split("\n")]
    # only the SHORT ones — the long ones are already covered by board_audit
    short = [l for l in lines if 2 < len(l) <= 12]
    seen, missing = set(), []
    for l in short:
        n = norm(l)
        if not n or n in seen or n in IGNORE or n.isdigit():
            continue
        seen.add(n)
        if n not in built(path):
            missing.append(l)
    total += len(seen)
    missing_total += len(missing)
    if missing:
        print("%-4s %-40s %d short line(s) NOT on the page:" % (bid, path, len(missing)))
        for m in missing:
            print("        %s" % m)

print()
print("short design lines checked : %d" % total)
print("NOT found on built pages   : %d" % missing_total)
