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
import pathlib
import re
import sys
from html import unescape as html_unescape
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

# Assets are fetched to confirm they exist, but are not parsed for links.
ASSET_SUFFIXES = (
    ".xml", ".txt", ".ico", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".css", ".js",
    # Fonts reach the crawler through <link rel="preload" as="font"> hrefs.
    ".woff", ".woff2", ".ttf", ".otf", ".eot",
    ".pdf", ".json", ".map", ".mp4", ".webm",
)

# What a search engine actually renders before truncating.
MAX_TITLE = 65
MAX_DESCRIPTION = 165

# What is measured: the DECODED title, not the raw HTML (changed 2026-09-11).
#
# The title is read out of the served markup, so an ampersand arrives as
# `&amp;` and used to cost FOUR characters against a 65-character budget it
# does not actually occupy. That is a property of the transport encoding, not
# of the title: a search engine parses the entity back to `&` before it lays
# the text out, and it truncates on pixel width, so the string being
# approximated here is the decoded one.
#
# Measured across the 69 prerendered pages of the 2026-09-11 build: FOURTEEN
# titles carry an `&amp;` and were each being charged four characters they do
# not have. Decoding changes no page's verdict today — nothing flips from
# fail to pass — so this is a correction to the measurement, not a
# relaxation of the rule. It is worth making anyway, because those thirteen
# other pages sit between 45 and 57 characters with a false penalty already
# applied, and the first one to be edited up to the line would have failed for
# a reason no one could see in the copy.
#
# The alternative was to measure the SOURCE string in `src/lib/seo.ts`. That is
# rejected: the source is not what ships, a title can be composed at runtime
# from a template (`pageMetadata` does exactly that), and an audit that reads
# the source has stopped auditing the site and started auditing the intent.
# Decoding the served markup keeps the audit pointed at what was published
# while measuring it the way the consumer will.
#
# NOT changed here: MAX_DESCRIPTION is still measured against the raw HTML.
# The same artefact applies to it, and this is deliberate rather than an
# oversight. Descriptions on this site are written right up to the line — the
# longest is exactly 165 — and seven were rewritten on 2026-09-08 to come back
# inside it, measured against this script as it then was. Silently handing
# four characters back to copy that was calibrated against the old
# measurement is an unrequested relaxation of a check that is currently
# passing. Change it deliberately, with the copy re-measured, or not at all.


# The mandated-title exception.
#
# WHY THIS EXISTS. The homepage title is mandated verbatim by the founder's
# implementation handoff — `design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt`
# line 433, under "NAVIGATION, SERVICE PAGES & SEO > Homepage SEO" — and is held
# in `HOMEPAGE_SEO.title` (`src/lib/seo.ts`), which says in terms that the
# three strings there are copy, not code, and are not to be paraphrased or
# truncated in passing. It is 74 characters decoded, so it fails the
# 65-character rule, and it failed it on every run.
#
# WHO APPROVED IT, AND WHEN. The founder, on 2026-09-11. He was asked which of
# the two should give — the mandated title, or the audit rule — and chose to
# KEEP THE TITLE AND RELAX THE AUDIT. This is his call and not the auditor's:
# the title is approved commercial copy, and the 65 is an engineering
# heuristic about SERP truncation.
#
# WHY IT IS SHAPED LIKE THIS rather than as a bigger number. Raising MAX_TITLE
# to 78 would have bought the homepage its exception at the cost of the rule
# everywhere: every other page would silently gain thirteen characters, and a
# genuinely over-long title on any of the other 68 would then pass unnoticed.
# That trades a working check for one approved exception, which is the worst
# available deal. So the exception is: keyed BY PATH, so it covers one page;
# and matched on the EXACT approved string, so it covers one TITLE. Rewrite
# the homepage title to something else over-long and the exception stops
# applying and the audit fails again, which is the point — what is approved
# here is a specific sentence, not a licence for that route to run long.
#
# DO NOT TIDY THIS AWAY. An empty-looking dict entry is not dead code. If the
# entry ever stops matching the page it names, the audit says so in its
# "NOTES" section rather than failing, so a stale exception surfaces to a
# human instead of quietly protecting nothing — or, worse, quietly protecting
# something nobody approved.
#
# Keys are crawl paths. Values are the approved title as DECODED text, which
# is what the check compares against.
TITLE_EXCEPTIONS = {
    "/": "Pixelette Technologies | Software Engineering, AI & Automation, Blockchain",
}


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
        # Only HTML documents enter the SEO pass. A font, JSON or source map
        # reached through a preload link is not a page, and grading it for
        # <title>, canonical or <h1> produces failures that are always false.
        # The suffix list above is the first defence and will keep going stale
        # as new asset types appear; this content check is the one that holds,
        # because it asserts what the response actually IS rather than what its
        # extension suggests. A gate that cries wolf at launch cannot be used to
        # tell a real defect from noise.
        if "<html" not in html[:2000].lower():
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
    """Check the metadata every page needs to be indexed and quoted correctly.

    Returns (problems, notes, rows, faq_total). `notes` are non-failing: today
    they carry the health of TITLE_EXCEPTIONS, which is bookkeeping about the
    audit itself rather than a defect in the site.
    """
    problems, notes, rows, faq_total = [], [], [], 0

    def first(pattern, html):
        m = re.search(pattern, html, re.S)
        return m.group(1) if m else None

    for path, html in sorted(pages.items()):
        # Decoded before measuring: `&amp;` is four characters of transport
        # encoding standing in for one character of title. See MAX_TITLE above.
        title_raw = first(r"<title>(.*?)</title>", html)
        title = html_unescape(title_raw) if title_raw is not None else None
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
                # ------------------------------------------------------------
                # FAQ ANSWERS MUST BE VISIBLE, NOT MERELY MARKED UP.
                #
                # Added 2026-09-14 because this counter was the reason the
                # defect survived. It counted pairs out of the JSON-LD and
                # printed the number as a signal, so 33 pages emitting FAQPage
                # read as 33 healthy pages — while 89 of 103 answers were
                # published to machines and shown to nobody. A count of what
                # the graph says can never detect the graph saying more than
                # the page does.
                #
                # Google requires FAQPage markup to correspond to content
                # visible on the page; the exposure is a manual action, not a
                # lost rich result. So this is a `problem`, not a `note` — the
                # audit fails rather than warns.
                #
                # Strip EVERY script, not just ld+json. Next re-embeds the same
                # JSON, escaped, in the RSC flight payload, so stripping only
                # the ld+json blocks leaves a copy of every answer in the
                # haystack and each one is "found". That false negative is
                # exactly how the first attempt at this check certified a clean
                # result over a real breach.
                # ------------------------------------------------------------
                body = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
                body = re.sub(r"<style[\s\S]*?</style>", " ", body, flags=re.I)
                body = re.sub(r"\s+", " ", html_unescape(re.sub(r"<[^>]+>", " ", body)))
                if "acceptedAnswer" in body:
                    problems.append(
                        (path, "FAQ visibility check is broken - JSON survived stripping")
                    )
                else:
                    for question in data.get("mainEntity", []):
                        answer = (question.get("acceptedAnswer") or {}).get("text", "")
                        probe = re.sub(r"\s+", " ", html_unescape(answer)).strip()[:70]
                        if probe and probe not in body:
                            problems.append(
                                (
                                    path,
                                    "FAQ answer is in the structured data but not on the page: "
                                    + repr(probe[:48]),
                                )
                            )
        faq_total += faqs

        h1s = re.findall(r"<h1[^>]*>", html)

        # The mandated-title exception, resolved for this path. `approved` is
        # the title this path is allowed to run long with, and nothing else:
        # an over-long title that is not character-for-character the approved
        # string still fails, on this path as on every other.
        approved = TITLE_EXCEPTIONS.get(path)
        over_long = bool(title) and len(title) > MAX_TITLE
        excepted = approved is not None and title == approved
        if approved is not None and title != approved:
            notes.append(
                (
                    path,
                    "a title exception is recorded for this path but the title no longer matches it. "
                    "Either re-approve the new title and update TITLE_EXCEPTIONS in this script, or delete "
                    "the entry. It is protecting nothing as it stands.",
                )
            )

        checks = [
            (not title, "no <title>"),
            (
                over_long and not excepted,
                "title %d chars (>%d)%s"
                % (
                    len(title or ""),
                    MAX_TITLE,
                    ""
                    if approved is None
                    else " and it is NOT the approved exception for this path",
                ),
            ),
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

    # An exception naming a path the crawl never reached is stale in the
    # other direction: the route was renamed or removed and the entry was
    # left behind.
    for path in TITLE_EXCEPTIONS:
        if path not in pages:
            notes.append(
                (
                    path,
                    "a title exception is recorded for this path, but the crawl never reached it. "
                    "Remove the entry, or find out why the page is gone.",
                )
            )

    return problems, notes, rows, faq_total


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


def check_noindex(pages):
    """Is the site currently hidden from search engines?

    A forgotten `noindex` is the one defect that ships silently and costs
    everything: the site launches, every page works, and it ranks for nothing.
    Nothing else catches it — the build succeeds, links resolve, metadata is
    well-formed, and the tag is invisible to a human reading the page.

    So the audit refuses to pass while it is on. That converts the failure mode
    from silent to unmissable, which is the whole reason the flag is safe to use.
    """
    hidden = []
    for path, html in sorted(pages.items()):
        if re.search(r'<meta name="robots"[^>]*content="[^"]*noindex', html, re.I):
            hidden.append(path)
    return hidden


def check_slug_references():
    """Every hardcoded case-study slug in source must name a real case study.

    Guards a defect that shipped and survived four commits: renaming the slugs
    (ADR-0011) left the practice pages' hardcoded `featured` lists pointing at
    names that no longer existed, so `.filter()` matched nothing and
    /engineering and /blockchain rendered a heading and an "All work" link
    above empty space.

    Nothing else catches this. TypeScript cannot check a string literal against
    the data; the build succeeds because an empty array is valid; and the link
    and SEO checks pass because an empty section still has resolving links and
    well-formed metadata. It is only visible by looking at the page — so it is
    checked here instead.
    """
    root = pathlib.Path(__file__).resolve().parent.parent
    work = (root / "src" / "content" / "work.ts").read_text(encoding="utf-8")
    real = set(re.findall(r"^\s*slug: '([^']+)'", work, re.M))
    if not real:
        return [("src/content/work.ts", "could not read any slugs — check the file")]

    bad = []
    for path in sorted((root / "src").rglob("*.tsx")) + sorted((root / "src").rglob("*.ts")):
        if path.name == "work.ts":
            continue
        text = path.read_text(encoding="utf-8")
        # Slug references appear inside .includes([...]) lists and getCaseStudy('...').
        for chunk in re.findall(r"\.includes\(|getCaseStudy\(", text):
            pass
        for m in re.finditer(r"\[([^\]]*?)\]\.includes\(", text, re.S):
            for slug in re.findall(r"'([a-z0-9][a-z0-9-]{3,})'", m.group(1)):
                if slug not in real:
                    bad.append((str(path.relative_to(root)).replace("\\", "/"), slug))
        for slug in re.findall(r"getCaseStudy\('([^']+)'\)", text):
            if slug not in real:
                bad.append((str(path.relative_to(root)).replace("\\", "/"), slug))
    return bad


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
    problems, seo_notes, rows, faq_total = check_seo(pages)
    placeholders = check_placeholders(pages)
    stale_slugs = check_slug_references()
    hidden = check_noindex(pages)

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

    if stale_slugs:
        print("\nSLUG REFERENCES: %d stale — a hardcoded slug names no case study" % len(stale_slugs))
        print("  (this empties a section silently: the build and the link/SEO checks all pass)")
        for path, slug in sorted(set(stale_slugs)):
            print("  %-46s '%s'" % (path, slug))
    else:
        print("SLUG REFERENCES: ok — every hardcoded slug resolves to a real case study")

    if problems:
        print("\nSEO: %d problems" % len(problems))
        for path, why in problems:
            print("  %-46s %s" % (path, why))
    else:
        print("SEO: ok — no defects")

    # Non-failing. The audit reporting on the health of its own documented
    # exceptions is how one stops rotting quietly into a permanent hole.
    if seo_notes:
        print("\nNOTES: %d — no failure, but somebody should look" % len(seo_notes))
        for path, why in seo_notes:
            print("  %-46s %s" % (path, why))

    total = sum(len(v) for v in placeholders.values())
    print("\nPLACEHOLDERS: %d across %d pages (expected before go-live — see ADR-0003)" % (total, len(placeholders)))
    for path, items in placeholders.items():
        print("  %-46s %s" % (path, ", ".join(i[:40] for i in items[:3]) + (" …" if len(items) > 3 else "")))

    if args.checklist:
        path = write_checklist(placeholders, total)
        print("\nwrote %s" % path)

    if hidden:
        print("\n" + "!" * 74)
        print("NOINDEX IS ON — %d of %d pages are hidden from search engines." % (len(hidden), len(pages)))
        print("This is correct DURING DEVELOPMENT and catastrophic AT LAUNCH.")
        print("To go live: set SITE_IN_DEVELOPMENT = false in src/content/launch.ts,")
        print("rebuild, and run this audit again. It cannot pass until you do.")
        print("!" * 74)

    failed = bool(broken or problems or stale_slugs or hidden)
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
| Contact form | ⚠️ Still needs four variables at deploy — see standing tasks |

- [ ] Connect the contact form. **No longer launch-blocking** now that a real
      address is published, but until it is connected the form collects nothing
      and tells visitors so.

      **Corrected 2026-09-14.** This line used to read "Set `CONTACT_WEBHOOK_URL`
      in the deployment environment", and following it would have achieved
      nothing: commit a3745f0 replaced the webhook with Supabase storage and
      Resend delivery, and `CONTACT_WEBHOOK_URL` is now read by no code in this
      repository. The variables that matter are `SUPABASE_URL`,
      `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and
      `CONTACT_NOTIFICATION_FROM` — **all four**, because each pair gates one leg
      independently. `CONTACT-FORM-SETUP.md` is the procedure: it says where each
      value comes from, and it carries the two steps that are not variables at
      all, namely running the migration that creates the table and verifying a
      sending domain in Resend.

      Two things go with the switch-on, on the same day, or the site publishes a
      false statement about itself: flip `DELIVERY_CONNECTED` to `true` in both
      `src/app/privacy/page.tsx` and `src/app/security-and-data/page.tsx`, and
      redeploy. Both pages are statically prerendered, so setting the variables
      without a redeploy leaves both legal notices asserting that the path is not
      connected while it is.

The form is verified working: server-side validation rejects bad input with
per-field errors, and a valid submission with no endpoint configured fails
honestly rather than showing a false success, keeping what the visitor typed.
"""

STANDING_TASKS = """## Not placeholders — separate go-live tasks

- [ ] **Connect the contact form.** Until it is connected, the form tells
      visitors it is not connected rather than silently dropping enquiries — but
      it is still not collecting them.

      **Corrected 2026-09-14**, for the same reason as the row under "Contact
      routes" above: this said `CONTACT_WEBHOOK_URL`, and that variable is read
      by no code in this repository any more. The work is a Supabase project, a
      Resend account, the migration in
      `supabase/migrations/20260914120000_create_contact_enquiries.sql`, four
      environment variables, and flipping `DELIVERY_CONNECTED` in
      `src/app/privacy/page.tsx` and `src/app/security-and-data/page.tsx` on the
      same day. `CONTACT-FORM-SETUP.md` carries the procedure.

      **One of those steps cannot be undone.** A Supabase project's region is
      chosen when the project is created and cannot be changed afterwards — the
      only way to move it is a new project and a migration. Both legal notices
      name a residency position that is currently written around not yet knowing
      it, so the region chosen is the answer published on `/privacy` and
      `/security-and-data`. Choose it deliberately, and tell the department which
      region both providers ended up in; that is the last open privacy gap.
- [ ] Confirm the production domain matches `SITE_URL` in `src/content/company.ts`
      (currently `https://pixelettetech.com`). Canonicals, the sitemap and the
      OpenGraph URLs are all derived from it.
- [ ] **Founder decision: publish the Clutch aggregate, or leave it held.** Not
      an engineering task any more. Corrected 2026-09-08: the figures in
      `src/content/company.ts` were re-read off the live profile on **2026-09-03**
      (`clutch.lastVerified`), not 2026-06-01 as this line said. They render
      nowhere, because `clutch.published` is false and the `clutch-rating` row in
      `src/content/claims.ts` is HELD. To publish: re-read the profile
      immediately before launch, re-date `lastVerified`, set `clutch.published`,
      and move the register row the same day — printing the read date beside the
      score is what the 7 September legal review judged sound under the DMCCA
      fake-review provisions. The individual review cards are a separate claim
      and already render, each linking to the review it came from.
- [~] **Founder decision: produce the certificates, or the certification claim
      stays off the site.** Corrected 2026-09-08: this was written as a
      link-checking task, and it is not one. Every row in `certificationRegister`
      (`src/content/company.ts`) is `published: false`, so `certifications` is
      empty, the footer badge pills are gone and `VerificationTable` prints its
      no-certification paragraph instead of a table. The URLs are also not
      resolvable in the way this line asked for: IAF CertSearch and the IASME
      register are search boxes, not per-company pages, and the founder decided on
      2026-09-01 that certificate documents are held internally and not published.
      What actually unblocks it is the certificate number, the issuing body and
      the expiry date for **Pixelette Technologies Ltd**, printed beside the
      badge, and the `iso-cyber-essentials-badges` row moved to VERIFIED. The
      badge artwork is waiting in `design/held-assets/`, moved out of `public/` on
      2026-09-08 because everything under `public/` is served at a guessable URL
      and the claim in those two SVGs is machine-readable text.
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
- [ ] **Produce the sample Value Discovery output.** Board 11 specifies a
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
- [x] **Founder decision: the seven client names on the homepage — ANSWERED
      2026-09-11.** Raised 2026-09-08, when every row in
      `src/content/clients.ts` read `permission: 'UNCONFIRMED'` while
      `ClientLogos` rendered the names anyway on `/` and `/ai-engineering`,
      because it reads `clients` rather than the empty `approvedClients()`.
      The founder decided to KEEP the names: "Keep them — I'm confident we
      have the basis." All seven rows are now APPROVED, with the decision, its
      date and its limits recorded in that file. Two things it did NOT do, and
      both were settled later the same day. CORRECTED 2026-09-11: this item
      ended "Two things it did NOT do, and both are still open below." Neither
      is open. See the two closed items that follow; the history above stands
      as written.
- [x] **Move the `client-logos` row in `src/content/claims.ts` — ANSWERED
      2026-09-11, and the answer is that it does not move.** CORRECTED
      2026-09-11. This item read: "It still reads HELD with its APPROVAL GATE
      instruction, so the claims register now lags `src/content/clients.ts` by
      one decision. The decision of 2026-09-11 is what it needs recording
      against it." It is not a lag. ADR-0023 decided the row STAYS HELD: it
      governs a claim CLASS, the founder cleared seven names inside that class,
      and VERIFIED is not inert — it would print a "Named client logos and
      wordmarks" badge in the proof strip on `/` and under "Verified and
      published" on `/certifications`, which is the site advertising its own
      permission as a proof point. The decision of 2026-09-11 IS recorded
      against the row, in its evidence note, with the status deliberately
      unchanged. Nothing is owed here, and a reader auditing the register
      against the site should not "tidy" this row.
- [x] **Point `ClientLogos` at `approvedClients()` — DONE 2026-09-11.**
      CORRECTED 2026-09-11. This item read: "With all seven rows APPROVED the
      accessor and the raw array return the same seven names, so the switch
      `src/content/clients.ts` has always described is finally a safe one-line
      change in `src/components/sections.tsx`. Until it is made, the render
      still cannot be emptied by setting a row back to UNCONFIRMED." The switch
      was made the same day. `ClientLogos` reads `approvedClients()`; the
      rendered HTML of both pages is byte-identical across the change; and the
      render CAN now be emptied — with every row set back to UNCONFIRMED the
      whole client section disappears from `/` and `/ai-engineering`, measured
      by building it rather than assumed. Nothing is owed.
- [ ] **Akashic Knowing stays UNCONFIRMED.** The eighth row, in
      `additionalClients`, is imported by nothing and has never been published.
      The 2026-09-11 decision was put about the seven live names and is not
      blanket permission, so it was deliberately not swept in. Put it to the
      founder in its own right if that row is ever wanted on the page.

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
      displays law-ledger's. chain-legal has its own artwork in its own folder;
      smart-contractor has NO image folder at all (checked 2026-09-01 — an
      earlier version of this row wrongly said both had their own artwork).
- [ ] Beyorch's impact description is Lytics' text — "AI-driven news monitoring
      and sentiment analysis" on a DeFi investment platform (`caseStudiesData.ts`,
      beyorch impactStats.description; renders live). Found 2026-09-01.
- [ ] Life Optimizer's third impact box is LawLedger's text — "92% satisfaction
      rate among legal professionals ... managing transactions" on a wellness
      platform. Found 2026-09-01. Neither defect was carried to the new site's
      reinstated entries.
- [ ] life-optimizer-ai, ragnar-token and smart-contractor share one identical
      pasted techStack (python/TensorFlow/PyTorch/aws/postgresql/reactjs) — an
      ML stack on two blockchain builds. The new site keeps it only at its
      plausible home (Life Optimizer) and grounds the other two differently.
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
        "Do not count them with a recursive grep over `.next/`. Each placeholder is",
        "emitted into three artefacts — the prerendered `.html`, its `.rsc` flight",
        "payload and the route's `page.js` chunk — so the whole directory over-counts",
        "roughly threefold (199 hits against a true 64 on the 2026-09-08 build).",
        "Corrected 2026-09-08: this said the payload is inlined *into each HTML file*",
        "so every placeholder appears there twice, and it is not — a single",
        "prerendered `.html` contains each placeholder exactly once. Which matters,",
        'because searching `.next/server/app/**/*.html` for `data-placeholder="true"`',
        "is then a sound offline substitute for the crawl. It is a substitute, not a",
        "replacement: it sees only prerendered routes, so a dynamic one",
        "(`/case-studies`, which reads `searchParams`) is invisible to it and has to",
        "be checked in the source.",
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
