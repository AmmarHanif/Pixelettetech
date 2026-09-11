"""Dependency-free scanline rasteriser + PNG writer (stdlib only).

Vertical supersampling with exact horizontal coverage, nonzero winding
(the SVG default fill-rule). No Pillow, no cairo, no new package.
"""
import struct
import zlib


class Canvas:
    def __init__(self, w, h, bg=(255, 255, 255, 0)):
        self.w, self.h = w, h
        self.px = bytearray(bytes(bg) * (w * h))

    def blend(self, x, y, rgb, a):
        """Source-over blend of `rgb` at coverage `a` (0..1)."""
        if a <= 0:
            return
        if a > 1:
            a = 1.0
        i = (y * self.w + x) * 4
        p = self.px
        da = p[i + 3] / 255.0
        oa = a + da * (1 - a)
        if oa <= 0:
            return
        for c in range(3):
            sc = rgb[c] / 255.0
            dc = p[i + c] / 255.0
            p[i + c] = int(round(((sc * a + dc * da * (1 - a)) / oa) * 255))
        p[i + 3] = int(round(oa * 255))


def fill(canvas, subpaths, rgb, ss=16):
    """Fill flattened subpaths (device coords) into canvas with colour rgb."""
    edges = []
    for sp in subpaths:
        n = len(sp)
        if n < 2:
            continue
        pts = list(sp)
        if pts[0] != pts[-1]:
            pts.append(pts[0])          # implicit close for filling
        for j in range(len(pts) - 1):
            x0, y0 = pts[j]
            x1, y1 = pts[j + 1]
            if y0 == y1:
                continue
            edges.append((y0, y1, x0, x1))
    if not edges:
        return
    ymin = max(0, int(min(min(e[0], e[1]) for e in edges)))
    ymax = min(canvas.h - 1, int(max(max(e[0], e[1]) for e in edges)) + 1)

    for py in range(ymin, ymax + 1):
        cov = [0.0] * canvas.w
        for s in range(ss):
            sy = py + (s + 0.5) / ss
            xs = []
            for (y0, y1, x0, x1) in edges:
                if (y0 <= sy < y1) or (y1 <= sy < y0):
                    t = (sy - y0) / (y1 - y0)
                    xs.append((x0 + t * (x1 - x0), 1 if y1 > y0 else -1))
            if not xs:
                continue
            xs.sort()
            wind = 0
            start = 0.0
            for (x, d) in xs:
                if wind != 0:
                    _span(cov, start, x, 1.0 / ss, canvas.w)
                wind += d
                if wind != 0 and (wind - d) == 0:
                    start = x
        for px in range(canvas.w):
            if cov[px] > 0:
                canvas.blend(px, py, rgb, cov[px])


def _span(cov, xa, xb, weight, w):
    """Add `weight` coverage over [xa, xb) with exact fractional ends."""
    if xb <= xa:
        return
    xa = max(xa, 0.0)
    xb = min(xb, float(w))
    if xb <= xa:
        return
    ia, ib = int(xa), int(xb)
    if ia == ib:
        if ia < w:
            cov[ia] += (xb - xa) * weight
        return
    if ia < w:
        cov[ia] += (ia + 1 - xa) * weight
    for i in range(ia + 1, min(ib, w)):
        cov[i] += weight
    if ib < w:
        cov[ib] += (xb - ib) * weight


def rounded_rect(w, h, r, steps=64):
    """Subpath for a rounded rectangle covering (0,0)-(w,h)."""
    import math
    pts = []
    corners = [(w - r, h - r, 0), (r, h - r, 90), (r, r, 180), (w - r, r, 270)]
    for (cx, cy, a0) in corners:
        for i in range(steps + 1):
            a = math.radians(a0 + 90 * i / steps)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return [pts]


def write_png(path, canvas):
    raw = bytearray()
    stride = canvas.w * 4
    for y in range(canvas.h):
        raw.append(0)
        raw += canvas.px[y * stride:(y + 1) * stride]
    comp = zlib.compress(bytes(raw), 9)

    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', canvas.w, canvas.h, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', comp)
    png += chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)
    return len(png)


def png_bytes(canvas):
    import io
    buf = io.BytesIO()
    raw = bytearray()
    stride = canvas.w * 4
    for y in range(canvas.h):
        raw.append(0)
        raw += canvas.px[y * stride:(y + 1) * stride]
    comp = zlib.compress(bytes(raw), 9)

    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    buf.write(b'\x89PNG\r\n\x1a\n')
    buf.write(chunk(b'IHDR', struct.pack('>IIBBBBB', canvas.w, canvas.h, 8, 6, 0, 0, 0)))
    buf.write(chunk(b'IDAT', comp))
    buf.write(chunk(b'IEND', b''))
    return buf.getvalue()
