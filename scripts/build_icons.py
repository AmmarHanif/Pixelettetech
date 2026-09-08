"""Generate the Pixelette Technologies icon set from the repo's own logo artwork.

USAGE
    py -3.12 -B scripts/build_icons.py           # write the three files
    py -3.12 -B scripts/build_icons.py --check   # hash-compare, write nothing

    `-B` because scripts/ has a __pycache__ tracked in git; do not add to it.
    Run it from anywhere: every path is derived from this file's location, not
    from the working directory.

WHY THIS EXISTS
    The site shipped `public/favicon.ico` and `public/apple-touch-icon.png`
    carrying ANOTHER COMPANY'S mark (a blue rounded square with a serif "A"),
    and `Organization.logo` in the JSON-LD pointed at the apple-touch icon, so
    the company was asserting a foreign mark as its machine-readable identity.

    It also exists so those three binaries are not orphans. A committed binary
    that nothing in the repo can regenerate is a fact nobody can check: the next
    person to touch the brand has to reverse-engineer it or redraw it. This is
    the derivation, in the repo, next to the artwork it derives from.

SOURCE OF TRUTH
    `public/pixelette-logo.svg` and `public/pixelette-logo-white.svg` - the two
    artworks already in the repo. Nothing here draws a glyph: every shape is a
    path lifted verbatim from those files. The only additions are a flat colour
    plate behind the reversed lockup (the treatment `src/components/BrandLogo.tsx`
    already documents for a dark ground) and the choice of raster size.

NO NEW DEPENDENCY (R14)
    Rasterising is done by `raster.py`, ~150 lines of stdlib Python (scanline
    fill, nonzero winding, 16x vertical supersampling with exact horizontal
    coverage; PNG via zlib). When these icons were generated on 2026-09-08 it
    was checked against librsvg 2.62.91 - mean absolute channel delta 0.176/255
    over 155,584 pixels, 0.038% of pixels differing by more than 32 - so the
    output is a real rasterisation, not an approximation. That comparison needs
    librsvg and is NOT re-run by this script; `--check` is the check that runs
    here, and it is the stronger one for this purpose.

WHAT IT WRITES
    public/pixelette-logo-1024.png   1024x285  full colour lockup on white.
                                     The Organization.logo target: raster (so
                                     no consumer has to support SVG), well over
                                     any 112px minimum, and drawn on the white
                                     ground the colour artwork is designed for.
    public/apple-touch-icon.png      180x180   reversed lockup, brand purple,
                                     FULL BLEED and fully opaque: iOS applies
                                     its own corner mask and renders alpha as
                                     black, so rounded corners or transparency
                                     here produce black wedges on a home screen.
    public/favicon.ico               16/32/48  same tile with an 18% corner
                                     radius, three uncompressed BGRA BMP entries
                                     (not PNG-in-ICO) so that even a naive ICO
                                     parser can read it.

REPRODUCIBILITY
    `--check` regenerates in memory and compares SHA-256 against what is on
    disk, so "this script produced the committed files" is a claim you can test
    rather than one you have to believe. It exits non-zero on any mismatch.
    The PNG bytes depend on zlib's deflate output at level 9, which is stable
    for a given zlib build but is not guaranteed across builds; if `--check`
    ever reports DIFFERS while the images look identical, compare the decoded
    pixels before assuming the artwork moved.

THE 16px LIMIT, STATED HONESTLY
    The mark is a canopy of ~19 detached squares over a trunk. At 16px those
    squares are sub-pixel and anti-alias to a light haze; the tree silhouette is
    discernible but the individual squares are not, in ANY treatment. The plate
    is what stops that haze becoming mush: at 16px the icon reads as a brand-
    purple tile with a pale tree on it, on both light and dark tab strips. The
    alternative (colour mark on white) measured worse - see the report.
"""
import hashlib
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import raster as R      # noqa: E402  (sibling module, needs the path above)
import svgpath as S     # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(REPO, 'public')
LOGO_COLOUR = os.path.join(PUBLIC, 'pixelette-logo.svg')
LOGO_WHITE = os.path.join(PUBLIC, 'pixelette-logo-white.svg')

# --brand in src/app/globals.css, and `themeColor` in src/app/layout.tsx.
BRAND = (0x66, 0x1a, 0x8f)

# Paths 0-19 of the artwork are the tree device (19 purple canopy squares plus
# the crimson trunk); 20-40 are the "PIXELETTE Technologies" wordmark. Derived
# from per-path bounding boxes, not assumed: the wordmark glyphs all sit at
# x > 42 and the device at x < 37.
DEVICE = range(0, 20)


def load(svg_path):
    with open(svg_path, encoding='utf-8') as fh:
        text = fh.read()
    return [(S.flatten(p['d'], steps=32), p['fill']) for p in S.parse_paths(text)]


def viewbox(svg_path):
    import re
    with open(svg_path, encoding='utf-8') as fh:
        text = fh.read()
    return [float(v) for v in re.search(r'viewBox="([^"]+)"', text).group(1).split()]


def rgb_of(fill):
    return tuple(int(fill[k:k + 2], 16) for k in (1, 3, 5))


def bounds(sel):
    xs = [q[0] for f, _ in sel for sp in f for q in sp]
    ys = [q[1] for f, _ in sel for sp in f for q in sp]
    return min(xs), min(ys), max(xs), max(ys)


def tile(size, pad_frac, radius_frac):
    """A brand-purple tile carrying the reversed tree device."""
    art = load(LOGO_WHITE)
    sel = [art[i] for i in DEVICE]
    x0, y0, x1, y1 = bounds(sel)
    w, h = x1 - x0, y1 - y0
    pad = size * pad_frac
    sc = (size - 2 * pad) / max(w, h)
    ox = (size - w * sc) / 2 - x0 * sc
    oy = (size - h * sc) / 2 - y0 * sc

    c = R.Canvas(size, size, (0, 0, 0, 0))
    if radius_frac > 0:
        R.fill(c, R.rounded_rect(size, size, size * radius_frac), BRAND)
    else:
        R.fill(c, [[(0, 0), (size, 0), (size, size), (0, size)]], BRAND)
    for f, fill in sel:
        dev = [[(qx * sc + ox, qy * sc + oy) for qx, qy in sp] for sp in f]
        R.fill(c, dev, rgb_of(fill))
    return c


def lockup(width):
    """The full colour lockup on an opaque white ground, at its own aspect."""
    vx, vy, vw, vh = viewbox(LOGO_COLOUR)
    sc = width / vw
    height = int(round(vh * sc))
    c = R.Canvas(width, height, (255, 255, 255, 255))
    for f, fill in load(LOGO_COLOUR):
        dev = [[((x - vx) * sc, (y - vy) * sc) for x, y in sp] for sp in f]
        R.fill(c, dev, rgb_of(fill))
    return c


def ico(canvases):
    """Multi-size .ico with uncompressed 32-bit BGRA BMP entries."""
    entries, blobs, offset = [], [], 6 + 16 * len(canvases)
    for c in canvases:
        w, h = c.w, c.h
        hdr = struct.pack('<IiiHHIIiiII', 40, w, h * 2, 1, 32, 0, w * h * 4, 0, 0, 0, 0)
        xor = bytearray()
        for y in range(h - 1, -1, -1):            # BMP rows are bottom-up
            for x in range(w):
                i = (y * w + x) * 4
                r, g, b, a = c.px[i:i + 4]
                xor += bytes((b, g, r, a))
        # The legacy 1bpp AND mask, bottom-up, rows padded to 4 bytes. A 32bpp
        # entry carries real alpha and every current renderer uses it, but a
        # renderer that only understands the mask must not be told the rounded
        # corners are opaque - it would paint them the corner pixels' colour,
        # which is transparent black. Bit set = show through.
        mask_stride = ((w + 31) // 32) * 4
        and_mask = bytearray()
        for y in range(h - 1, -1, -1):
            row = bytearray(mask_stride)
            for x in range(w):
                if c.px[(y * w + x) * 4 + 3] < 128:
                    row[x >> 3] |= 0x80 >> (x & 7)
            and_mask += row
        and_mask = bytes(and_mask)
        blob = hdr + bytes(xor) + and_mask
        entries.append(struct.pack('<BBBBHHII', w if w < 256 else 0,
                                   h if h < 256 else 0, 0, 0, 1, 32,
                                   len(blob), offset))
        blobs.append(blob)
        offset += len(blob)
    return (struct.pack('<HHH', 0, 1, len(canvases)) + b''.join(entries)
            + b''.join(blobs))


def emit(name, data, check):
    """Write `data` to public/<name>, or in --check mode compare and report."""
    path = os.path.join(PUBLIC, name)
    digest = hashlib.sha256(data).hexdigest()
    if not check:
        with open(path, 'wb') as fh:
            fh.write(data)
        print('wrote   public/%-24s %7d bytes  %s' % (name, len(data), digest))
        return True
    if not os.path.exists(path):
        print('MISSING public/%-24s expected %s' % (name, digest))
        return False
    on_disk = hashlib.sha256(open(path, 'rb').read()).hexdigest()
    ok = on_disk == digest
    print('%s public/%-24s %s' % ('MATCH  ' if ok else 'DIFFERS', name, digest))
    if not ok:
        print('        on disk:%s' % on_disk)
    return ok


def main(argv):
    check = '--check' in argv[1:]
    ok = True

    ok &= emit('pixelette-logo-1024.png', R.png_bytes(lockup(1024)), check)
    ok &= emit('apple-touch-icon.png',
               R.png_bytes(tile(180, pad_frac=0.11, radius_frac=0.0)), check)

    # Ascending, which is the order the previous (wrong-brand) favicon.ico used.
    # Order is not significant to the spec, but a naive reader that takes the
    # first entry then gets the 16px tab icon it is expecting.
    sizes = [(16, 0.03), (32, 0.05), (48, 0.06)]
    ok &= emit('favicon.ico',
               ico([tile(s, pad_frac=p, radius_frac=0.18) for s, p in sizes]), check)

    if check:
        print('CHECK %s' % ('PASS - the committed binaries are what this script '
                            'produces' if ok else 'FAIL'))
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv))
