"""Minimal SVG path parser + flattener. No dependencies (stdlib only)."""
import re

NUM = re.compile(r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?')
CMD = re.compile(r'([MmZzLlHhVvCcSsQqTtAa])')


def tokenise(d):
    out = []
    for part in CMD.split(d):
        part = part.strip()
        if not part:
            continue
        if len(part) == 1 and part in 'MmZzLlHhVvCcSsQqTtAa':
            out.append(part)
        else:
            out.extend(float(x) for x in NUM.findall(part))
    return out


def bez3(p0, p1, p2, p3, n):
    pts = []
    for i in range(1, n + 1):
        t = i / n
        u = 1 - t
        x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]
        y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
        pts.append((x, y))
    return pts


def bez2(p0, p1, p2, n):
    pts = []
    for i in range(1, n + 1):
        t = i / n
        u = 1 - t
        x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0]
        y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]
        pts.append((x, y))
    return pts


def flatten(d, steps=24):
    """Return list of subpaths, each a list of (x, y). Handles M L H V C S Q T Z.

    Arc (A) is NOT implemented; raises so a silent wrong shape is impossible.
    """
    toks = tokenise(d)
    subpaths, cur = [], []
    i = 0
    cmd = None
    cx = cy = 0.0
    sx = sy = 0.0
    prev_c2 = None   # for S
    prev_q1 = None   # for T

    def take(n):
        nonlocal i
        vals = toks[i:i + n]
        if len(vals) != n or any(isinstance(v, str) for v in vals):
            raise ValueError('bad operand run for %r' % cmd)
        i += n
        return vals

    while i < len(toks):
        t = toks[i]
        if isinstance(t, str):
            cmd = t
            i += 1
            if cmd in 'Zz':
                if cur:
                    cur.append((sx, sy))
                    subpaths.append(cur)
                    cur = []
                cx, cy = sx, sy
                prev_c2 = prev_q1 = None
            continue
        if cmd is None:
            raise ValueError('operands before any command')
        implicit = cmd
        if cmd == 'M':
            implicit = 'L'
        elif cmd == 'm':
            implicit = 'l'

        if cmd in 'Mm':
            x, y = take(2)
            if cmd == 'm':
                x, y = cx + x, cy + y
            if cur:
                subpaths.append(cur)
            cur = [(x, y)]
            cx, cy = sx, sy = x, y
            cmd = implicit
            prev_c2 = prev_q1 = None
        elif cmd in 'Ll':
            x, y = take(2)
            if cmd == 'l':
                x, y = cx + x, cy + y
            cur.append((x, y))
            cx, cy = x, y
            prev_c2 = prev_q1 = None
        elif cmd in 'Hh':
            (x,) = take(1)
            if cmd == 'h':
                x = cx + x
            cur.append((x, cy))
            cx = x
            prev_c2 = prev_q1 = None
        elif cmd in 'Vv':
            (y,) = take(1)
            if cmd == 'v':
                y = cy + y
            cur.append((cx, y))
            cy = y
            prev_c2 = prev_q1 = None
        elif cmd in 'Cc':
            x1, y1, x2, y2, x, y = take(6)
            if cmd == 'c':
                x1, y1, x2, y2, x, y = cx + x1, cy + y1, cx + x2, cy + y2, cx + x, cy + y
            cur.extend(bez3((cx, cy), (x1, y1), (x2, y2), (x, y), steps))
            prev_c2 = (x2, y2)
            prev_q1 = None
            cx, cy = x, y
        elif cmd in 'Ss':
            x2, y2, x, y = take(4)
            if cmd == 's':
                x2, y2, x, y = cx + x2, cy + y2, cx + x, cy + y
            x1, y1 = (2 * cx - prev_c2[0], 2 * cy - prev_c2[1]) if prev_c2 else (cx, cy)
            cur.extend(bez3((cx, cy), (x1, y1), (x2, y2), (x, y), steps))
            prev_c2 = (x2, y2)
            prev_q1 = None
            cx, cy = x, y
        elif cmd in 'Qq':
            x1, y1, x, y = take(4)
            if cmd == 'q':
                x1, y1, x, y = cx + x1, cy + y1, cx + x, cy + y
            cur.extend(bez2((cx, cy), (x1, y1), (x, y), steps))
            prev_q1 = (x1, y1)
            prev_c2 = None
            cx, cy = x, y
        elif cmd in 'Tt':
            x, y = take(2)
            if cmd == 't':
                x, y = cx + x, cy + y
            x1, y1 = (2 * cx - prev_q1[0], 2 * cy - prev_q1[1]) if prev_q1 else (cx, cy)
            cur.extend(bez2((cx, cy), (x1, y1), (x, y), steps))
            prev_q1 = (x1, y1)
            prev_c2 = None
            cx, cy = x, y
        elif cmd in 'Aa':
            raise NotImplementedError('elliptical arc in path data')
        else:
            raise ValueError('unknown command %r' % cmd)
    if cur:
        subpaths.append(cur)
    return subpaths


PATH_RE = re.compile(r'<path\b([^>]*)/?>', re.S)
ATTR_RE = re.compile(r'([a-zA-Z-]+)\s*=\s*"([^"]*)"', re.S)


def parse_paths(svg_text):
    out = []
    for m in PATH_RE.finditer(svg_text):
        attrs = dict(ATTR_RE.findall(m.group(1)))
        if 'd' in attrs:
            out.append(attrs)
    return out


def bbox(subpaths):
    xs = [p[0] for sp in subpaths for p in sp]
    ys = [p[1] for sp in subpaths for p in sp]
    return min(xs), min(ys), max(xs), max(ys)
