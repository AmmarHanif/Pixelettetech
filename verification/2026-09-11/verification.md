# Verification â€” 2026-09-11 â€” conformance fixes

Typecheck EXIT=0 (zero diagnostics). next build EXIT=0, 75/75 static pages.

## Audit against the rebuilt running site
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
