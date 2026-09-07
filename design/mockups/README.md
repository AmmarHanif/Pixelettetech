# Product mockups

All fifteen products in the **Portfolio UI Designs** Figma file now have a
mockup in `public/work/`, referenced by a case study in `src/content/work.ts`.
Nothing is staged here any more; this directory keeps the build script and the
record of how the images were made.

## How the crop is chosen

`build.py` does the compositing. Two things it gets right that a naive crop does
not:

**The screen rectangle is derived, not eyeballed.** Two live mockups share one
chassis, so the pixels where they differ *are* the screen: (79,44)-(592,377).
An earlier pass used a rectangle 6px too wide on the left and 10px on the right,
which spilled page content over the bezel and squared off the corners.

**The cut avoids slicing text.** Cropping at the screen's aspect often lands
mid-sentence in the section below the hero. So the crop is pulled up to the hero
boundary where one exists, or to a gap between text lines, and the width is then
trimmed symmetrically to hold the aspect. The trim is capped at 55px per side,
measured against each page's own navigation margins, so it can never eat a logo
or a right-hand button. Where a hero is too short for even that, the crop goes
as tight as the nav allows, leaving a thin band rather than half a section.

Regenerate with `python design/mockups/build.py` driven from the page render, or
call `build(page, x0, x1, out_path)` directly.
