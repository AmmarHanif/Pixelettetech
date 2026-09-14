# -*- coding: utf-8 -*-
"""Check what the built site publishes about certification.

Run AFTER `next build`, against the prerendered HTML in `.next/server/app/`,
never against source. The defect class this guards is the one ADR-0012 recorded
and ADR-0029 hit again: a sentence that a later decision made false, which no
grep for the changed wording will find, because the sentence that has to change
is the one nobody thought to look at.

    node node_modules/next/dist/bin/next build
    python scripts/certification_claims_check.py

Exit 0 means every check passed. What it asserts, and why each one is here:

  * /security-and-data carries the ISO/IEC 27001:2022 evidence in full --
    certificate number, issuing body, accreditation as the certificate states
    it, legal entity, registered office, all three dates, the Statement of
    Applicability, and the certified scope VERBATIM.
  * The ISMS placeholder is gone and the other three placeholders on that page
    are still there. Closing the gap we had evidence for must not quietly close
    the three we did not (ADR-0003), so the `data-placeholder` count is asserted
    as a number, not eyeballed.
  * /certifications carries both certificates and both proof badges.
  * Across EVERY rendered page: no dead IAF verification route, and every
    occurrence of "cyber essentials" falls into one of four enumerated
    non-claim shapes. No evidence exists for Cyber Essentials Plus, so the
    string may appear only as a hold, a register key, or a description of what
    Pixelette Certified helps clients with -- never as a credential.
  * No date dangles off the accreditation body. That is a real defect this row
    shipped once, through string concatenation rather than through anyone
    deciding it.

The battery is also run against /about, which must FAIL it. A substring search
reading the wrong file, or neutered by a typo, passes exactly as loudly as one
that works; the control is what separates the two.
"""

import glob
import html as htmllib
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, ".next", "server", "app")

fails = []
checks = 0


def load(name):
    with open(os.path.join(APP, name), encoding="utf-8") as fh:
        raw = fh.read()
    text = re.sub(r"<script[^>]*>.*?</script>", " ", raw, flags=re.S)
    text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.S)
    # React separates adjacent text nodes with an EMPTY comment. It is invisible
    # to a reader and occupies no width, so it must collapse to nothing, not to
    # a space — otherwise every interpolated value reads with a stray gap before
    # the punctuation that follows it and no assertion over real sentences can
    # match. Removed BEFORE the generic tag strip, which does insert a space.
    text = text.replace("<!-- -->", "")
    text = re.sub(r"<[^>]+>", " ", text)
    text = htmllib.unescape(text)
    text = re.sub(r"\s+", " ", text)
    return raw, text


def check(label, cond):
    global checks
    checks += 1
    status = "PASS" if cond else "FAIL"
    print(f"  [{status}] {label}")
    if not cond:
        fails.append(label)
    return cond


SCOPE = (
    "Information security management system for the design, development, deployment and support "
    "of AI solutions, blockchain applications, AR/VR solutions, web platforms, mobile "
    "applications, custom software products, UI/UX design services and quantum computing systems"
)

# `isms_only=False` marks a needle that is a general company-identity fact and
# is legitimately present on other pages (the About page names the entity and
# its registered office). Those are excluded from the control battery below,
# because a control that demands the company's own name be absent from /about
# tests nothing about the ISMS work.
PRESENT_SD = [
    ("ISO 27001 certificate number", "AMER800409", True),
    ("issuing body", "Americo Quality Standards Registech Pvt. Ltd", True),
    ("accreditation body as the certificate states it", "United Accreditation Foundation", True),
    ("exact legal entity", "Pixelette Technologies Ltd", False),
    ("registered office", "77 Fulham Palace Road, London W6 8JA", False),
    ("standard and version", "ISO/IEC 27001:2022", True),
    ("issue date", "12 March 2026", True),
    ("expiry date", "11 March 2027", True),
    ("recertification date", "11 March 2029", True),
    ("Statement of Applicability", "Statement of Applicability is version 1.0, dated 15 January 2026", True),
    ("verbatim certificate scope", SCOPE, True),
    ("scope is flagged as not a services list", "not a list of what we sell", True),
    ("no audit schedule invented", "not publishing an audit schedule", True),
    ("ADR-0012 offer to send detail", "ask and we will send the detail to your reviewer", True),
]

REMAINING_PLACEHOLDERS = [
    "DATA RESIDENCY AND HOSTING REGIONS",
    "SUBPROCESSOR REGISTER",
    "RETENTION SCHEDULE BY DATA CLASS",
]


def run(page_label, filename, expect_isms):
    print(f"\n=== {page_label} ({filename}) ===")
    raw, text = load(filename)

    for label, needle, _isms in PRESENT_SD:
        got = needle in text
        check(f"{page_label}: {label} -> {needle[:58]!r}", got == expect_isms)

    check(
        f"{page_label}: ISMS placeholder GONE",
        ("ISMS SCOPE AND CERTIFICATION EVIDENCE" in text) is not expect_isms,
    )
    return raw, text


# ---------------------------------------------------------------- main page
raw_sd, text_sd = run("/security-and-data", "security-and-data.html", expect_isms=True)

print("\n--- /security-and-data: the three gaps we were given NO evidence for ---")
for ph in REMAINING_PLACEHOLDERS:
    check(f"/security-and-data: placeholder STILL renders -> {ph}", ph in text_sd)

n_ph = len(re.findall(r'data-placeholder="true"', raw_sd))
check(f"/security-and-data: exactly 3 data-placeholder nodes remain (found {n_ph})", n_ph == 3)

print("\n--- /security-and-data: Cyber Essentials must not appear at all ---")
check(
    "/security-and-data: no 'cyber essentials' in rendered text",
    re.search(r"cyber[\s\-]essentials", text_sd, re.I) is None,
)

# --------------------------------------------------------- /certifications
print("\n=== /certifications (certifications.html) ===")
raw_c, text_c = load("certifications.html")
for label, needle in [
    ("27001 certificate number", "AMER800409"),
    ("9001 certificate number", "AMER37046"),
    ("issuing body", "Americo Quality Standards Registech Pvt. Ltd"),
    ("accreditation body", "United Accreditation Foundation"),
    ("legal entity", "Pixelette Technologies Ltd"),
    ("27001 proof badge label", "ISO/IEC 27001:2022 certified information security management system"),
    ("9001 proof badge label", "ISO 9001:2015 certified quality management system"),
    ("proof strip heading now renders", "Verified and published"),
    ("published gate cell names the certificate", "The document itself goes to your reviewer on request"),
    ("ask-route retained", "ask and we will send what we can evidence direct to your reviewer"),
]:
    check(f"/certifications: {label}", needle in text_c)

# The only four shapes in which the string may legitimately appear anywhere on
# the site. Each one is a context in which Cyber Essentials is explicitly NOT
# asserted as a credential held by Pixelette Technologies.
ALLOWED_CE_CONTEXTS = {
    "register table row, held": "Held pending evidence",
    "claims-register key, quoted with its HOLD instruction": "Claims register, iso-cyber-essentials-badges",
    "Pixelette Certified support-areas pill row, disclaimed": "not a claim that",
    "Pixelette Certified service description on /assurance": "certification readiness",
}


def ce_context(ctx):
    for name, marker in ALLOWED_CE_CONTEXTS.items():
        if marker in ctx:
            return name
    return None


print("\n--- /certifications: every 'Cyber Essentials' occurrence must be a non-claim ---")
occ = list(re.finditer(r"cyber[\s\-]essentials", text_c, re.I))
check(f"/certifications: occurrences found = {len(occ)} (expected > 0, they are the hold record)", len(occ) > 0)
for m in occ:
    ctx = text_c[max(0, m.start() - 300) : m.end() + 300]
    name = ce_context(ctx)
    check(f"/certifications: occurrence at {m.start()} is a non-claim [{name}]", name is not None)
check(
    "/certifications: the phrase 'Cyber Essentials Plus' is never adjacent to 'Published'",
    not re.search(r"Cyber Essentials Plus\s*Published", text_c),
)

# The concatenation defect this row actually shipped once: appending the issue
# date after the issuing-body string dated the ACCREDITATION rather than the
# certificate. Asserted as a shape, so any future field added after
# `issuingBody` re-triggers it.
for _lbl, _txt in (("/security-and-data", text_sd), ("/certifications", text_c)):
    check(
        f"{_lbl}: no date is left dangling off the accreditation body",
        re.search(r"United Accreditation Foundation\s+on\s+\d", _txt) is None,
    )
check(
    "/security-and-data: the issue date attaches to the certificate in the table row",
    "Certificate AMER800409, issued 12 March 2026 by Americo" in text_sd,
)

# ------------------------------------------------------- site-wide sweeps
print("\n=== SITE-WIDE over every prerendered .html ===")
pages = sorted(glob.glob(os.path.join(APP, "**", "*.html"), recursive=True))
print(f"  ({len(pages)} rendered pages)")

dead = []
ce_bad = []
stale_disclaimer = []
ce_kinds = {}
for pth in pages:
    with open(pth, encoding="utf-8") as fh:
        raw = fh.read()
    rel = os.path.relpath(pth, APP).replace("\\", "/")
    if re.search(r"iafcertsearch|iaf\.nu|iaf\.org", raw, re.I):
        dead.append(rel)
    txt = re.sub(r"<script[^>]*>.*?</script>", " ", raw, flags=re.S).replace("<!-- -->", "")
    txt = re.sub(r"<[^>]+>", " ", txt)
    txt = re.sub(r"\s+", " ", htmllib.unescape(txt))
    if "not accreditations held by any Pixelette company" in txt:
        stale_disclaimer.append(rel)
    for m in re.finditer(r"cyber[\s\-]essentials", txt, re.I):
        ctx = txt[max(0, m.start() - 300) : m.end() + 300]
        name = ce_context(ctx)
        if name is None:
            ce_bad.append((rel, ctx[250:450]))
        else:
            ce_kinds[name] = ce_kinds.get(name, 0) + 1

check(f"no rendered page links or mentions a dead IAF route (found {dead})", not dead)
check(f"no rendered page carries Cyber Essentials as a claim (found {ce_bad})", not ce_bad)
print(f"  Cyber Essentials occurrences by permitted shape: {ce_kinds}")
check(
    f"the disclaimer falsified by publishing ISO 27001 is gone everywhere (found {stale_disclaimer})",
    not stale_disclaimer,
)

amer = [os.path.relpath(p_, APP).replace("\\", "/") for p_ in pages if "AMER800409" in open(p_, encoding="utf-8").read()]
print(f"  pages carrying AMER800409: {amer}")
check("AMER800409 reaches at least /security-and-data and /certifications",
      any("security-and-data" in a for a in amer) and any("certifications" in a for a in amer))

# --------------------------------------------------- FALSIFIABILITY CONTROL
#
# Every assertion above is a substring search, and a substring search that is
# silently reading the wrong file, or that has been neutered by a typo, passes
# just as loudly as one that is working. So the same PRESENT_SD battery is run
# against a page that must NOT carry the ISMS evidence. If those checks pass
# there too, the battery is not measuring what it claims to measure and the
# green above is worthless.
print("\n=== FALSIFIABILITY CONTROL: /about must NOT satisfy the ISMS battery ===")
_, text_about = load("about.html")
isms_only = [(l, n) for l, n, i in PRESENT_SD if i]
control_hits = [label for label, needle in isms_only if needle in text_about]
print(f"  ISMS-evidence needles found on /about: {len(control_hits)} of {len(isms_only)} (expected 0)")
for label in control_hits:
    print(f"    unexpectedly present: {label}")
check(
    "control: the ISMS battery FAILS on /about, so it is reading real content",
    len(control_hits) == 0,
)
check(
    "control: /about does not carry the certificate number",
    "AMER800409" not in text_about,
)
# And the inverse: a needle that is deliberately absent everywhere must not be
# found, proving the matcher can return False at all.
check(
    "control: a deliberately absent needle is reported absent",
    "AMER000000" not in text_sd and "AMER000000" not in text_c,
)

print(f"\n{checks} checks, {len(fails)} failed")
for f in fails:
    print(f"  FAILED: {f}")
sys.exit(1 if fails else 0)
