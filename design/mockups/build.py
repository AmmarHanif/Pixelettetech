"""Composite a product landing page into the site's laptop chassis.

Screen rectangle: derived, not guessed. Two live mockups share one chassis, so
the pixels where they differ ARE the screen: (79,44)-(592,377), 513x333, square
corners. The first pass used a rectangle 6px too wide on the left and 10px on
the right, which spilled page content over the bezel.

Crop: the page is cropped from the top at the screen's aspect. Where the hero
section ends above that line, the crop is pulled up to the hero boundary and the
width trimmed symmetrically to keep the aspect, so the mockup shows the hero and
not a slice of the section beneath it. The trim is capped by the page's own
navigation margins, measured per page, so it can never eat the logo or the
right-hand button. Pages whose nav runs edge to edge simply keep the full-width
crop.
"""
from PIL import Image
import numpy as np

CHASSIS = 'public/work/chain-legal.png'
SCREEN = (79, 44, 592, 377)
SW, SH = SCREEN[2] - SCREEN[0], SCREEN[3] - SCREEN[1]
ASPECT = SW / SH
NAV_KEEP = 14          # px of clear space to leave beside nav content


def nav_margins(a, w):
    band = a[12:92].astype(int)
    g = np.abs(np.diff(band, axis=1)).sum(axis=2)
    idx = np.where((g > 45).any(axis=0))[0]
    if not len(idx):
        return w // 2, w // 2
    return int(idx.min()), int(w - 1 - idx.max())


def hero_bottom(a, lo=380, hi=900):
    rows = a.mean(axis=1)
    d = np.abs(np.diff(rows, axis=0)).sum(axis=1)
    hi = min(hi, len(d))
    return int(np.argmax(d[lo:hi]) + lo)


MAX_TRIM = 55          # px per side — measured to keep every nav bar intact


def ink_profile(a):
    """Per-row ink: how many pixels sit on a sharp horizontal edge (i.e. text)."""
    g = np.abs(np.diff(a.astype(int), axis=1)).sum(axis=2)
    return (g > 55).sum(axis=1)


def build(page, x0, x1, out_path):
    w = x1 - x0
    a = np.asarray(page.crop((x0, 0, x1, 1000)))
    ideal_h = round(w / ASPECT)
    hb = hero_bottom(a)
    ink = ink_profile(a)
    quiet = ink < max(6, int(0.006 * w))

    # Cut inside a text-free gap at least 10px tall, as low as possible without
    # trimming more than MAX_TRIM off each side.
    lowest = ideal_h
    while (w - round(lowest * ASPECT)) / 2 <= MAX_TRIM and lowest > 60:
        lowest -= 1
    lowest += 1

    chosen, why = ideal_h, 'full width'
    # A section boundary beats a text gap: at the foot of a hero the rows are
    # full of image edges, so the text test would reject the very cut we want.
    if hb < ideal_h and (w - round(hb * ASPECT)) / 2 <= MAX_TRIM:
        chosen, why = hb, 'hero boundary'
    else:
      for h in range(min(ideal_h, hb if hb < ideal_h else ideal_h), lowest - 1, -1):
        lo, hi = max(0, h - 5), min(len(quiet), h + 6)
        if quiet[lo:hi].all():
            chosen, why = h, 'gap between text lines'
            break
      else:
        # Hero shorter than the screen and no clean gap: crop as tight as the
        # nav allows, which keeps the bleed to a thin band under the hero
        # rather than half of the next section.
        if hb < ideal_h:
            chosen, why = lowest, 'tightest crop the nav allows'

    crop_w = min(w, round(chosen * ASPECT))
    left = (w - crop_w) // 2
    shot = page.crop((x0 + left, 0, x0 + left + crop_w, chosen)).resize((SW, SH), Image.LANCZOS)
    chassis = Image.open(CHASSIS).convert('RGBA')
    chassis.paste(shot, (SCREEN[0], SCREEN[1]))
    chassis.save(out_path)
    return dict(crop=(crop_w, chosen), ideal_h=ideal_h, hero=hb, trim=left, why=why)
