# Staged product mockups

Laptop mockups for products that have a design in the **Portfolio UI Designs**
Figma file but no case study on the site yet. They live here rather than in
`public/work/` on purpose: nothing references them, so shipping them would put
unused binaries in every deploy.

## What they are

Each is the product's own landing page composited into the same chassis the
eighteen live case-study images use — 675x420, screen rectangle (73,44)-(602,378),
the page's hero scaled to fill it at the screen's own aspect so nothing distorts.

| File | Product | Landing page headline |
| --- | --- | --- |
| `health-chain.png` | Health Chain | Securing Healthcare Data with Blockchain Technology |
| `finchain.png` | FinChain | Redefining Cross-Border Transactions with Blockchain Technology |
| `crypto-audit.png` | CryptoAudit | Transparent, Compliant, and Secure Financial Auditing |
| `legal-mind-ai.png` | Legal Mind AI | Revolutionising Legal Decision-Making with Artificial Intelligence |
| `juris-predict.png` | JurisPredict | Predicting Legal Outcomes with Precision |
| `medi-analyze-ai.png` | Medi Analyze AI | Medical Diagnostics with Artificial Intelligence |
| `health-predictor.png` | Health Predictor | Transforming Patient Care with Predictive Analytics |
| `credit-smart-ai.png` | Credit Smart AI | Revolutionising Credit Scoring with Artificial Intelligence |
| `transact-secure.png` | Transact Secure | Elevating Transaction Security with Artificial Intelligence |
| `success-path.png` | SuccessPath | Achieve Your Goals with Artificial Intelligence |

The five other products in that Figma file — ChainLegal, LawLedger,
SmartContractor, Mind Coach AI and LifeOptimizer — already have artwork in
`public/work/`, so they are not duplicated here.

## Promoting one into the site

1. `git mv design/mockups/<slug>.png public/work/<slug>.png`
2. Add the case study to `src/content/work.ts` with `image: '/work/<slug>.png'`.
3. `npm run build && npx next start -p 4100 && python scripts/audit.py --port 4100`

## What is missing

Artwork is not the blocker. These Figma frames are **product marketing pages**,
not case-study boards: they carry no problem, process, duration or measured
figure. The Sandoz and NEOM boards in the other file did, which is why those two
could be written. Nothing here should be turned into a case study until the
underlying engagement detail exists — inventing it is what this repo's content
rules exist to prevent.

## Known characteristic

Four pages have a hero shorter than the screen's 1.58:1, so the mockup shows the
first line or two of the following section: `health-chain`, `juris-predict`,
`medi-analyze-ai` and `success-path`. That reads as a normal browser screenshot
rather than a fault, and the alternative — cropping tighter to end at the hero —
would have trimmed the navigation bar's edges. Retune if you disagree.
