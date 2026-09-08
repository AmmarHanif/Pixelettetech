# Held assets

Artwork for a claim the site is not allowed to make yet. Nothing in this
directory is served: it sits under `design/`, outside `public/`, and no route,
component or stylesheet references it.

**Do not move anything here back into `public/` to "just use the image".** The
point of the move is that `public/` is a web root, not a folder. Everything in
it is served at a guessable URL whether or not a page links to it.

## Contents

| File | Claim it publishes | Register row |
|---|---|---|
| `iso-9001.svg` | A circular badge whose `<text>` elements read `CERTIFIED`, `ISO`, `9001:2015`, `COMPANY` | `iso-cyber-essentials-badges` |
| `iso-27001.svg` | The same badge reading `CERTIFIED`, `ISO`, `27001:2022`, `COMPANY` | `iso-cyber-essentials-badges` |

## Why they were moved, 8 September 2026

The row `iso-cyber-essentials-badges` in `src/content/claims.ts` is **HELD**:
no certificate for Pixelette Technologies Ltd is held anywhere in this project,
and the handoff’s instruction on that row is *"HOLD — Publish only with current
certificate for exact legal entity, scope and validity."*

Both files were at `public/certifications/iso-9001.svg` and
`public/certifications/iso-27001.svg`. No page had referenced them since the
`/certifications` page stopped rendering them earlier the same day — but
`public/` is served, so both were still retrievable at
`https://<host>/certifications/iso-9001.svg` by anyone who guessed the path.

That mattered more than ordinary orphaned artwork because the claim in these
files is **machine-readable text, not a picture of text**. The words sit in SVG
`<text>` elements, so a crawler, a scraper or an answer engine reads
`CERTIFIED`, `ISO`, `9001:2015` and `COMPANY` as characters. That put the site
in direct contradiction with `public/llms.txt`, which tells answer engines that
*"No certification badge is published by Pixelette Technologies"*.

They were moved rather than deleted. The artwork is wanted back the day the
claim is released, and a deleted file is a decision nobody can review.

## What releases them

All four, in order:

1. Hold the current certificate for **Pixelette Technologies Ltd** — the exact
   legal entity — with its scope and validity dates.
2. Record in the `iso-cyber-essentials-badges` `evidenceNote` in
   `src/content/claims.ts` the certificate number, the issuing certification
   body and the expiry date, then move that row’s `status` to `VERIFIED`.
   **That is the founder’s decision, not an engineering one.**
3. Publish the certificate number, the body and the expiry beside the badge.
   A badge on its own is the claim without the evidence.
4. Move the file back into `public/certifications/` and reconcile
   `public/llms.txt`, which currently states the opposite.

Until step 2 has happened, `isPublishable('iso-cyber-essentials-badges')`
returns `false` and every gated surface — the OpenGraph card in
`src/app/opengraph-image.tsx`, the footer pills, the certification table —
renders nothing. Restoring the file without moving the row would put the claim
back on the public surface while every gate in the codebase still says no.
