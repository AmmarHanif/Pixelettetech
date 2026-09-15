# -*- coding: utf-8 -*-
"""Scan every design board for text held inside SVG, which the board diff strips."""
import io, re, glob, sys, html as H
from urllib.request import urlopen, Request

# Force UTF-8 output. The design's labels use middots and ampersands that a
# cp1252 console cannot encode, which would kill the report mid-run.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

p = glob.glob(r"C:\Users\Rana\OneDrive\GA\Pixelette Website 2026*tobedevelopedforgolive.html")[0]
doc = io.open(p, encoding="utf-8", errors="replace").read()

BOARD_TO_PATH = {
    "p0": "/", "p3": "/ai-engineering", "p4": "/engineering", "p5": "/blockchain",
    "p6": "/ai-engineering/services", "p7": "/method/live", "p8": "/ai-engineering/support-and-run",
    "p9": "/assurance", "p10": "/ai-engineering/value-discovery",
    "p11": "/ai-engineering/data-and-integration", "p12": "/ai-engineering/production-ai-systems",
    "p13": "/industries/professional-services", "p14": "/case-studies",
    "p15": "/case-studies/lytics", "p16": "/insights", "p17": "/about",
    "p18": "/contact",
}

boards = [(m.group(1), m.start()) for m in re.finditer(r'<section id="(p\d+)"', doc)]
cache = {}

def built_text(path):
    if path not in cache:
        try:
            raw = urlopen(Request("http://localhost:3000" + path, headers={"User-Agent": "svgscan"}), timeout=25).read().decode("utf-8", "replace")
            body = raw.split("<body", 1)[1]
            body = re.sub(r"<script.*?</script>", " ", body, flags=re.S)
            t = H.unescape(re.sub(r"<[^>]+>", " ", body))
            cache[path] = " ".join(re.sub(r"[^a-z0-9]+", " ", t.lower()).split())
        except Exception as ex:
            cache[path] = None
    return cache[path]

def norm(s):
    s = H.unescape(s)
    for a, b in (("\u2019","'"),("\u00b7","-"),("\u2014","-"),("\u2013","-")):
        s = s.replace(a, b)
    return " ".join(re.sub(r"[^a-z0-9]+", " ", s.lower()).split())

total_labels = 0
total_missing = 0
for i, (bid, start) in enumerate(boards):
    end = boards[i + 1][1] if i + 1 < len(boards) else len(doc)
    seg = doc[start:end]
    title = re.search(r'class="t">([^<]+)<', seg)
    labels = []
    for sv in re.findall(r"<svg.*?</svg>", seg, re.S):
        for t in re.findall(r"<text[^>]*>(.*?)</text>", sv, re.S):
            t = re.sub(r"<[^>]+>", "", t).strip()
            if len(t) > 2:
                labels.append(t)
    if not labels:
        continue
    total_labels += len(labels)
    path = BOARD_TO_PATH.get(bid)
    bt = built_text(path) if path else None
    missing = [l for l in labels if bt is not None and norm(l) and norm(l) not in bt]
    total_missing += len(missing)
    print("%-4s %-34s svg labels=%-3d  path=%-38s missing=%d" % (bid, (title.group(1) if title else "?")[:34], len(labels), path or "(no page)", len(missing)))
    for m in missing:
        print("        MISSING: %s" % H.unescape(m)[:104])

print()
print("TOTAL svg text labels across design: %d" % total_labels)
print("TOTAL not present on built pages   : %d" % total_missing)
