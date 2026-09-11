# Verification run â€” 2026-09-08 â€” 10/10 content rebuild lane (VER-2444)

## 1. Typecheck
```
EXIT=0   (no output above = zero diagnostics)
```

## 2. Production build
```
 âœ“ Compiled successfully in 1517ms
 âœ“ Generating static pages (75/75)
   Finalizing page optimization ...
EXIT=0
```

## 3. Project audit (scripts/audit.py) against the built running site
```
Auditing http://localhost:4000

Pages reached : 69
Assets checked: 31
FAQ Q&A pairs : 103

LINKS: ok — every internal link, anchor and asset resolves
SLUG REFERENCES: ok — every hardcoded slug resolves to a real case study

SEO: 1 problems
  /                                              title 78 chars (>65)

PLACEHOLDERS: 64 across 19 pages (expected before go-live — see ADR-0003)
  /ai-engineering/support-and-run                [ON APPLICATION]
  /case-studies/2connect                         [STACK]
  /case-studies/ayni-gold                        [STACK]
  /case-studies/blockguard                       [RUN CONTRACT STATUS, OR WHAT THE CLIENT, [CLIENT QUOTE, WITH SIGN-OFF], [NAME] …
  /case-studies/credit-smart-ai                  [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/crypto-audit                     [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/finchain                         [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/health-chain                     [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/health-predictor                 [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/juris-predict                    [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/legal-mind-ai                    [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/lytics                           [RUN CONTRACT STATUS, OR WHAT THE CLIENT, [CLIENT QUOTE, WITH SIGN-OFF], [NAME] …
  /case-studies/medi-analyze-ai                  [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /case-studies/transact-secure                  [FULL WRITE-UP PENDING CLIENT SIGN-OFF —, [STACK]
  /industries/insurance-financial-services       [CLIENT], [NAMED PROCESS AND RESULT], [MEASURED FIGURE] …
  /industries/professional-services              [CLIENT], [NAMED PROCESS AND RESULT], [MEASURED FIGURE] …
  /insights                                      [DATE], [PLANNED: our eval in inspect_evals], [DATE] …
  /privacy                                       [TRANSFER MECHANISM PER PROVIDER — confi
  /security-and-data                             [ISMS SCOPE AND CERTIFICATION EVIDENCE —, [DATA RESIDENCY AND HOSTING REGIONS — co, [SUBPROCESSOR REGISTER — publish the cur …

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
NOINDEX IS ON — 69 of 69 pages are hidden from search engines.
This is correct DURING DEVELOPMENT and catastrophic AT LAUNCH.
To go live: set SITE_IN_DEVELOPMENT = false in src/content/launch.ts,
rebuild, and run this audit again. It cannot pass until you do.
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

FAIL
EXIT=1
```

EXIT 1 is expected pre-launch: noindex is on by design (SITE_IN_DEVELOPMENT=true) and the audit cannot pass until launch. The single SEO failure is the homepage title, mandated verbatim by the 8 Sep handoff at 74 chars against the audit's 65-char cap â€” a founder decision, recorded open.
