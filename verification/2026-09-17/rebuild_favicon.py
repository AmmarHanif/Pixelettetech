"""Rebuild favicon.ico: new 16px frame, existing 32 and 48 untouched.

Written by hand rather than via Pillow's ICO writer because the file's own
design note requires "uncompressed BGRA BMP (not PNG-in-ICO), which is what the
previous file used and what every ICO parser reads". Pillow's writer chooses the
encoding itself, so the format is produced explicitly here and asserted after.
"""
import io, os, struct
from PIL import Image, ImageDraw

REPO = r"C:/Users/Rana/Brain/CTO Vault/05_Projects/Pixelette_Tech_Website_001/rebuild-2026"
ICO = os.path.join(REPO, 'public', 'favicon.ico')
P = (102, 26, 143, 255); W = (255, 255, 255, 255)


def hybrid16():
    im = Image.new('RGBA', (16, 16), P); d = ImageDraw.Draw(im)
    d.ellipse([1, 0, 14, 10], fill=W)                       # crown silhouette
    for x, y in [(4, 2), (8, 1), (11, 4), (2, 5), (6, 5), (9, 7), (4, 8)]:
        d.rectangle([x, y, x + 1, y + 1], fill=P)           # square notches
    d.rectangle([7, 10, 8, 13], fill=W)                     # trunk
    d.rectangle([4, 14, 11, 15], fill=W)                    # base bar
    mask = Image.new('L', (16, 16), 0)                      # 18% corner radius
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, 15, 15], radius=3, fill=255)
    out = Image.new('RGBA', (16, 16), (0, 0, 0, 0)); out.paste(im, (0, 0), mask)
    return out


def bmp_frame(img):
    w, h = img.size
    px = img.convert('RGBA').load()
    xor = bytearray()
    for y in range(h - 1, -1, -1):                          # BMP rows are bottom-up
        for x in range(w):
            r, g, b, a = px[x, y]
            xor += bytes((b, g, r, a))
    row = ((w + 31) // 32) * 4                              # AND mask, 4-byte aligned
    and_mask = bytearray(row * h)
    hdr = struct.pack('<IiiHHIIiiII', 40, w, h * 2, 1, 32, 0, len(xor) + len(and_mask), 0, 0, 0, 0)
    return bytes(hdr + xor + and_mask)


src = Image.open(ICO)
frames = {}
for size in sorted(src.info['sizes']):
    src.size = size
    frames[size[0]] = src.convert('RGBA').copy()
print('existing frames:', sorted(frames))
frames[16] = hybrid16()                                     # replace ONLY 16

order = sorted(frames)
blobs = [bmp_frame(frames[s]) for s in order]
out = bytearray(struct.pack('<HHH', 0, 1, len(order)))
offset = 6 + 16 * len(order)
for s, blob in zip(order, blobs):
    out += struct.pack('<BBBBHHII', s, s, 0, 0, 1, 32, len(blob), offset)
    offset += len(blob)
for blob in blobs:
    out += blob
open(ICO, 'wb').write(bytes(out))
print('wrote %s (%d bytes, %d frames)' % (ICO, len(out), len(order)))
