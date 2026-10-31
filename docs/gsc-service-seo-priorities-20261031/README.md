# GSC-driven service SEO priorities — keyword report

**Date:** 2026-10-31 (Europe/Budapest)  
**Branch:** `cursor/gsc-service-seo-priorities-1f48`

## Baseline evidence (verified, not invented)

| Source | Window | Role |
|---|---|---|
| `data/search-authority-master-matrix.json` → `latestWizardSnapshot` | **2026-09-24 → 2026-10-22** (settledThrough 2026-10-22) | Canonical owner gaps + protected homepage winners |
| `docs/gsc-routing-audit-20261019.json` | **2026-09-19 → 2026-10-16** | Query→page pairs (618 rows) |
| User master prompt property totals | **2026-10-01 → 2026-10-28** (norbert / ART) | Property-level context only — **not** used as query export |

Exact Oct 1–28 query×page export was **not** freshly available in this Cloud Agent. Closest verified query evidence above is used. **No ranking improvement is claimed.** Re-measure after deploy against an equivalent settled GSC window.

## Policy locks preserved

- Homepage titles EN/HU/DE unchanged (protected generic winners).
- No doorway pages, no auto-redirect of Fotótörténelem akt essays to Ébredés.
- Artistic nude → Ébredés; boudoir/private → ART private-photography; commercial services → Professional owners.

## Changes implemented (this PR)

1. **P1 Vienna portrait EN/DE** — meta/Service aliases for executive & professional portrait; DE title keeps `Portraitfotografie Wien`, adds Executive & Headshots.
2. **P2 Budapest HU portrait** — title/meta/aliases prioritise `Portréfotózás Budapest` + `üzleti portré` forms on `/hu/portre/`.
3. **P3 Vienna personal branding** — EN title `Personal Brand Photography`; DE title `Personal Brand Fotografie Wien & Budapest`; aliases for personal brand fotograf/fotografie/portraits.
4. **P4 Events** — EN title includes `Event Photographer Budapest & Vienna`; DE/HU conference/C-level aliases.
5. **P5 Artistic nude** — Professional fine-art Service JSON-LD no longer claims Nude Art / akt; private CTA → private-photography; Ébredés links kept for nude intent.

## Verified results

| Check | Status |
|---|---|
| Local `npm test` functional audits | PASS (commit gate includes clean tree) |
| Exact-live production SHA tip | Pending merge + Pages deploy |
| Post-deploy GSC re-measure | **PENDING** — compare next settled 28d to baseline windows above |

See `keyword-by-keyword-report.csv` for the full matrix.
