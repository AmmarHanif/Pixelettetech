# -*- coding: utf-8 -*-
"""
Site audit: links, SEO/AEO metadata, and the placeholder inventory.

Run it against a built, running site:

    npm run build && npm start -- -p 4000
    python scripts/audit.py --port 4000

Exit code is 0 when the link check and the SEO check both pass, 1 otherwise.
Outstanding placeholders do NOT fail the run — they are expected until go-live
(see ADR-0003) and are reported as an inventory.

Requires only the Python standard library.
"""

import argparse
import collections
import json
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

# Assets are fetched to confirm they exist, but are not parsed for links.
ASSET_SUFFIXES = (".xml", ".txt", ".ico", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".css", ".js")

# What a search engine actually renders before truncating.
MAX_TITLE = 65
MAX_DESCRIPTION = 165


def fetch(base, path, timeout=20):
    """Return (status, body). Status 0 means the request never completed."""
    try:
        with urlopen(Request(urljoin(base, path), headers={"User-Agent": "pixelette-audit"}), timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except HTTPError as e:
        return e.code, ""
    except URLError as e:
        return 0, str(e.reason)


def crawl(base):
    """Follow internal links from / and return {path: html} for every page reached."""
    seen, queue, pages, unreachable = set(), ["/"], {}, []
    while queue:
        path = queue.pop(0)
        if path in seen:
            continue
        seen.add(path)
        status, html = fetch(base, path)
        if status != 200:
            unreachable.append((path, status))
            continue
        pages[path] = html
        for href in re.findall(r'href="([^"]+)"', html):
            if href.startswith(("http://", "https://")):
                if urlparse(base).netloc not in href:
                    continue
                href = urlparse(href).path or "/"
            if href.startswith(("mailto:", "tel:", "data:", "#")):
                continue
            target = href.split("#")[0].split("?")[0]
            if target.startswith("/") and not target.endswith(ASSET_SUFFIXES) and target not in seen:
                queue.append(target)
    return pages, unreachable


def check_links(base, pages):
    """Verify every href and img src on every page, including in-page anchors."""
    broken, assets = [], {}
    anchors = {p: set(re.findall(r'id="([^"]+)"', h)) for p, h in pages.items()}

    def asset_ok(target):
        if target not in assets:
            assets[target] = fetch(base, target)[0]
        return assets[target] == 200

    for path, html in pages.items():
        for href in re.findall(r'href="([^"]+)"', html):
            if href.startswith(("mailto:", "tel:", "data:", "http://", "https://")):
                continue
            if href.startswith("#"):
                if href[1:] and href[1:] not in anchors[path]:
                    broken.append((path, href, "anchor target missing on this page"))
                continue
            target, _, frag = href.partition("#")
            target = target.split("?")[0]
            if not target.startswith("/"):
                broken.append((path, href, "relative href"))
            elif target.endswith(ASSET_SUFFIXES):
                if not asset_ok(target):
                    broken.append((path, href, "asset HTTP %s" % assets[target]))
            elif target not in pages:
                status = fetch(base, target)[0]
                if status != 200:
                    broken.append((path, href, "HTTP %s" % status))
            elif frag and frag not in anchors[target]:
                broken.append((path, href, "anchor #%s missing on %s" % (frag, target)))

        for src in re.findall(r'<img[^>]+src="([^"]+)"', html):
            if not src.startswith(("data:", "http")) and not asset_ok(src):
                broken.append((path, src, "image HTTP %s" % assets[src]))

    return broken, len(assets)


def check_seo(pages):
    """Check the metadata every page needs to be indexed and quoted correctly."""
    problems, rows, faq_total = [], [], 0

    def first(pattern, html):
        m = re.search(pattern, html, re.S)
        return m.group(1) if m else None

    for path, html in sorted(pages.items()):
        title = first(r"<title>(.*?)</title>", html)
        desc = first(r'<meta name="description" content="(.*?)"', html)
        types, faqs = [], 0
        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
            try:
                data = json.loads(block.replace("\\u003c", "<"))
            except ValueError:
                problems.append((path, "JSON-LD failed to parse"))
                continue
            types.append(data.get("@type"))
            if data.get("@type") == "FAQPage":
                faqs = len(data.get("mainEntity", []))
        faq_total += faqs

        h1s = re.findall(r"<h1[^>]*>", html)
        checks = [
            (not title, "no <title>"),
            (title and len(title) > MAX_TITLE, "title %d chars (>%d)" % (len(title or ""), MAX_TITLE)),
            (not desc, "no meta description"),
            (desc and len(desc) > MAX_DESCRIPTION, "description %d chars (>%d)" % (len(desc or ""), MAX_DESCRIPTION)),
            (not first(r'<link rel="canonical" href="(.*?)"', html), "no canonical"),
            (not first(r'<meta property="og:title" content="(.*?)"', html), "no og:title"),
            (not first(r'<meta property="og:image" content="(.*?)"', html), "no og:image"),
            (len(h1s) != 1, "%d <h1> tags (want exactly 1)" % len(h1s)),
            ("Organization" not in types, "no Organization schema"),
        ]
        for failed, message in checks:
            if failed:
                problems.append((path, message))

        rows.append((path, len(title or ""), len(desc or ""), len(h1s), faqs))

    return problems, rows, faq_total


def check_placeholders(pages):
    """Inventory unfilled content. Expected before go-live; see ADR-0003."""
    found = collections.OrderedDict()
    for path, html in sorted(pages.items()):
        items = [
            re.sub(r"<[^>]+>", "", raw).strip().replace("&amp;", "&").replace("&#x27;", "'")
            for raw in re.findall(r'data-placeholder="true">(.*?)</span>', html, re.S)
        ]
        if items:
            found[path] = items
    return found


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--port", type=int, default=3000, help="port the site is served on (default 3000)")
    parser.add_argument("--host", default="localhost", help="host the site is served on")
    parser.add_argument("--base", default=None, help="full base URL, overriding --host/--port")
    parser.add_argument("--table", action="store_true", help="print the per-page metadata table")
    parser.add_argument(
        "--checklist",
        action="store_true",
        help="regenerate GO-LIVE-CHECKLIST.md from the placeholders found",
    )
    args = parser.parse_args()

    base = args.base or ("http://%s:%d" % (args.host, args.port))

    print("Auditing %s\n" % base)
    pages, unreachable = crawl(base)
    if not pages:
        print("FAIL: could not reach %s — is the site running?" % base)
        return 1

    broken, asset_count = check_links(base, pages)
    broken += [(("<crawl>"), p, "HTTP %s" % s) for p, s in unreachable]
    problems, rows, faq_total = check_seo(pages)
    placeholders = check_placeholders(pages)

    print("Pages reached : %d" % len(pages))
    print("Assets checked: %d" % asset_count)
    print("FAQ Q&A pairs : %d\n" % faq_total)

    if args.table:
        print("%-50s %5s %5s %3s %4s" % ("PATH", "TTL", "DESC", "H1", "FAQ"))
        print("-" * 72)
        for row in rows:
            print("%-50s %5d %5d %3d %4d" % row)
        print()

    if broken:
        print("LINKS: %d broken" % len(broken))
        for src, href, why in sorted(set(broken)):
            print("  %-46s %-48s %s" % (src, href, why))
    else:
        print("LINKS: ok — every internal link, anchor and asset resolves")

    if problems:
        print("\nSEO: %d problems" % len(problems))
        for path, why in problems:
            print("  %-46s %s" % (path, why))
    else:
        print("SEO: ok — no defects")

    total = sum(len(v) for v in placeholders.values())
    print("\nPLACEHOLDERS: %d across %d pages (expected before go-live — see ADR-0003)" % (total, len(placeholders)))
    for path, items in placeholders.items():
        print("  %-46s %s" % (path, ", ".join(i[:40] for i in items[:3]) + (" …" if len(items) > 3 else "")))

    if args.checklist:
        path = write_checklist(placeholders, total)
        print("\nwrote %s" % path)

    failed = bool(broken or problems)
    print("\n%s" % ("FAIL" if failed else "PASS"))
    return 1 if failed else 0


# Grouping for the checklist: what blocks launch, hardest first. A page not
# listed here still appears, under "Other".
CHECKLIST_GROUPS = [
    (
        "Blocking — legal and regulatory",
        ["/privacy", "/terms", "/modern-slavery", "/assurance"],
        "These carry legal exposure. None should be published in its current state.",
    ),
    (
        "Blocking — contact routes",
        ["/contact"],
        "An invented address loses enquiries silently. These must be real before launch.",
    ),
    (
        "Blocking — security review answers",
        ["/security-and-data", "/certifications", "/ai-engineering"],
        "Read by procurement and security reviewers. A visible gap is safer than a guess, but neither wins a deal.",
    ),
    (
        "Content — case studies awaiting client sign-off",
        None,  # any /case-studies path
        "Each needs the client's written approval before the outstanding figures and quotes go up.",
    ),
    (
        "Content — sector proof",
        ["/industries/professional-services", "/industries/insurance-financial-services"],
        "Placeholder cards are deliberate. They stay until a real engagement fills them.",
    ),
    (
        "Content — insights",
        ["/insights"],
        "Dates and authors appear when each piece is written and signed off, not before.",
    ),
    (
        "Commercial",
        ["/ai-engineering/support-and-run"],
        "Pricing detail to confirm.",
    ),
]

LAUNCH_BLOCKER = """## ✅ Contact routes — blocker cleared 2026-08-31

The contact page previously offered no working way to reach the company: the form
was unconnected and both email addresses were placeholders, so the form's own
failure message pointed at an address that did not exist. Found by submitting the
form, not by reading it.

**Cleared.** The founder confirmed `sales@pixelettetech.com` — the address the
current live site already hands out — for both enquiries and press. Both now
render as live `mailto:` links, and the form's failure messages name it, so a
visitor always has a route that works.

| Route | State |
|---|---|
| Enquiries email | ✅ `sales@pixelettetech.com` |
| Press email | ✅ same inbox, by decision — one monitored route beats two where one is not |
| Postal address | ✅ Real |
| Contact form | ⚠️ Still needs `CONTACT_WEBHOOK_URL` at deploy — see standing tasks |

- [ ] Set `CONTACT_WEBHOOK_URL` in the deployment environment. **No longer
      launch-blocking** now that a real address is published, but until it is set
      the form collects nothing and tells visitors so.

The form is verified working: server-side validation rejects bad input with
per-field errors, and a valid submission with no endpoint configured fails
honestly rather than showing a false success, keeping what the visitor typed.
"""

STANDING_TASKS = """## Not placeholders — separate go-live tasks

- [ ] Set `CONTACT_WEBHOOK_URL` in the deployment environment. Until it is set,
      the contact form tells visitors it is not connected rather than silently
      dropping enquiries — but it is still not collecting them.
- [ ] Confirm the production domain matches `SITE_URL` in `src/content/company.ts`
      (currently `https://pixelettetech.com`). Canonicals, the sitemap and the
      OpenGraph URLs are all derived from it.
- [ ] Re-verify the Clutch rating and review count in `src/content/company.ts`;
      the committed figures were last checked 2026-06-01.
- [ ] Confirm each certification's verification URL resolves to this company's
      entry, not just to the register's home page (`src/content/company.ts`).
- [ ] Decide the redirect map from the current site's URLs to these routes. The
      information architecture has changed substantially — several existing
      service pages have no direct equivalent — so this needs a deliberate pass,
      not a wildcard.
- [ ] Submit `sitemap.xml` in Search Console once the domain is live.
- [ ] **Wire up the Insights "Subscribe" action.** Board 17 puts it beside the
      primary CTA. There is no mailing list, so it currently routes to the
      contact form — a subscription request a person can fulfil by hand. Replace
      with a real list or a dedicated field when one exists.
- [ ] **Give the Insights archive a destination.** Board 17 offers "Browse →" on
      the "blockchain and distributed systems, 2018-2025" card. That archive has
      no home in this build, so the destination renders as a visible placeholder
      rather than pointing at something that is not an archive.
- [ ] **Confirm the ML framework on the Lytics case study.** The design says
      PyTorch, the delivery record says TensorFlow, and the two are not
      independent — the old site renders that record directly. The build ships
      TensorFlow. Settle it from the Lytics repo (`import tensorflow` vs
      `import torch`, or its requirements file) or from whoever led delivery. If
      nobody can confirm it, drop the framework name: "Python, streaming ingest,
      AWS" is true either way and removes a checkable claim that buys nothing.
- [ ] **Produce the sample AI Value Baseline output.** Board 11 specifies a
      second hero CTA reading "Download a sample output". No such artefact
      exists, so the button currently reads "Request a sample output" and routes
      to the contact form — the design's function preserved without promising a
      download that would not happen. Once a redacted sample baseline exists,
      restore the board's wording and point it at the file.
- [ ] Optional: supply light-background client logo artwork if the "Trusted by"
      row should show marks rather than names. The existing files are
      white-on-transparent (built for the old dark site) and two of them are
      invisible on white, so the row renders client names as text — which is what
      the approved design specifies in any case.

## Fixes owed on the CURRENT live site, not this build

FOUNDER DECISION 2026-08-31 — "new site only". The live site is being replaced,
so fixing it is wasted effort. These are FINDINGS, NOT TASKS: no owner, no
deadline, no action. They are listed so the record is complete and so nothing is
rediscovered as new. All of them disappear when the new site launches.

- [ ] AdWatch's "Ad detection" metric reads "$20,000 per organization in
      recruitment costs due to better candidate matching" — a claim belonging to
      the AIA hiring tool, not an ad-blocker. A one-line fix was applied and then
      REVERTED under the new-site-only decision; repo/ is clean. Correct
      replacement if ever wanted, from AdWatch's own milestone: "Achieved up to
      98% accuracy in automated ad detection across live media streams."
- [ ] `chain-legal` displays ragnar-token's banner image; `smart-contractor`
      displays law-ledger's. Both have their own artwork in their own folders.
- [ ] AdWatch's entire "Testing and deployment" milestone — text naming "the
      AdWatch Engine into live media streams" — is live verbatim on **Fusio**
      (crypto portfolio management) and **Lytics** (news monitoring). Neither
      detects ads. Deleting the foreign text is safe; a replacement cannot be
      written without the real milestones. See OPEN-DECISIONS.md A2.
- [ ] Design board 05 attributes the £500,000 marketplace figures to Butter
      Smiles. They belong to the 'Stay Sane' NFT collection — see ADR-0006.
- [ ] Design board 06 states "170% retention at 3 months". The true figure is
      70% (`blockchainDevelopment.ts` lines 60-64). A rate above 100% invites
      exactly the scrutiny the new site is built to survive.
"""


def write_checklist(placeholders, total):
    """Regenerate GO-LIVE-CHECKLIST.md from what actually renders on the site."""
    import os

    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "GO-LIVE-CHECKLIST.md")
    L = [
        "# Go-live checklist",
        "",
        "Generated from the built site by `scripts/audit.py --checklist`, not maintained",
        "by hand. Every entry below is a placeholder that renders **visibly** on the page",
        'in amber monospace, carrying `data-placeholder="true"`.',
        "",
        "The design's rule, which this build follows without exception: *a placeholder",
        "stays visible until a real engagement fills it.* Nothing here was invented to",
        "make a section look finished. Fill them, do not delete them.",
        "",
        LAUNCH_BLOCKER,
        "",
        "**%d placeholders across %d pages.**" % (total, len(placeholders)),
        "",
        "To find them in a browser, on any page:",
        "",
        "```js",
        "document.querySelectorAll('[data-placeholder]')",
        "```",
        "",
        "Do not count them by grepping `.next/` — Next inlines the RSC flight payload",
        "into each HTML file, so every placeholder appears there twice.",
        "",
    ]

    seen = set()
    for heading, paths, note in CHECKLIST_GROUPS:
        if paths is None:
            rows = [(p, v) for p, v in placeholders.items() if p.startswith("/case-studies")]
        else:
            rows = [(p, placeholders[p]) for p in paths if p in placeholders]
        if not rows:
            continue
        L += ["## %s" % heading, "", note, ""]
        for p, items in rows:
            seen.add(p)
            L += ["**`%s`**" % p, ""]
            L += ["- [ ] `%s`" % i for i in items]
            L.append("")

    leftover = [(p, v) for p, v in placeholders.items() if p not in seen]
    if leftover:
        L += ["## Other", ""]
        for p, items in leftover:
            L += ["**`%s`**" % p, ""]
            L += ["- [ ] `%s`" % i for i in items]
            L.append("")

    L.append(STANDING_TASKS)

    with open(out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(L))
    return out


if __name__ == "__main__":
    sys.exit(main())
