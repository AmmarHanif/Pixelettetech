"""Composite a screenshot into the shared laptop mockup used by the case studies.

    python tools/frame-in-laptop.py <screenshot.png> <out.png> [template.png]

WHY THE TEMPLATE IS REUSED RATHER THAN REDRAWN. Twenty-four of the original
case-study mockups share a byte-identical laptop frame. Reusing it is the only
way a refreshed image matches the ones beside it; a redrawn frame is an
approximation and reads as one.

HOW THE SCREEN RECTANGLE WAS MEASURED, so nobody re-guesses it. Every pair of
same-size mockups was diffed and the differing regions unioned: the frame is
identical between them, so whatever differs IS the screen. On the 675x419
template that gives (79, 42, 593, 377), 514x335, aspect 1.534.

1.534 IS NOT 16:10. Capture at the screen's aspect rather than squeezing a 16:10
shot into it, or the page is visibly distorted inside the frame. With
tools/capture-page.py, that means a CSS viewport of 1440 x 939.

THE TRADE, which is real and worth knowing: the frame is upscaled about 3.3x to
reach 2220px and will be slightly soft. It is smooth metal gradient and rounded
corners, which survives upscaling far better than text does, while the screen
content, which is what a reader looks at, stays sharp.
"""
import os
import sys

from PIL import Image

SCREEN = (79, 42, 593, 377)   # measured on the 675x419 template; see docstring
TARGET_W = 2220               # the case-study hero slot at device pixel ratio 2

if len(sys.argv) < 3:
    raise SystemExit(__doc__)

shot_path, out_path = sys.argv[1], sys.argv[2]
repo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
template = (sys.argv[3] if len(sys.argv) > 3
            else os.path.join(repo, 'public', 'work', 'beyorch.png'))

tpl = Image.open(template).convert('RGBA')
scale = TARGET_W / tpl.size[0]
target = (TARGET_W, int(round(tpl.size[1] * scale)))
sx0, sy0, sx1, sy1 = [int(round(v * scale)) for v in SCREEN]
sw, sh = sx1 - sx0, sy1 - sy0

with Image.open(shot_path) as s:
    shot = s.convert('RGB').copy()

want = sw / sh
got = shot.size[0] / shot.size[1]
if abs(want - got) > 0.02:
    print('WARNING: screenshot aspect %.3f, screen aspect %.3f. It will be '
          'distorted. Recapture at %d x %d CSS.'
          % (got, want, 1440, int(round(1440 / want))))

frame = tpl.resize(target, Image.LANCZOS)
frame.paste(shot.resize((sw, sh), Image.LANCZOS), (sx0, sy0))
frame.save(out_path, optimize=True)
print('%s  %dx%d  %dKB'
      % (out_path, frame.size[0], frame.size[1],
         os.path.getsize(out_path) // 1024))
