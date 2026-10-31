# Executive summary — BANHALMI Master Audit 2026-10-31

## Verdict

The three-surface ecosystem is **technically indexable** (690 sitemap URLs return HTTP 200 with canonicals). The new professional domain still shows **zero GSC clicks/impressions** in the provided migration window — expected after Change of Address / domain cutover, not proof of a crawl block.

Primary production defects found and addressed in this cycle:

1. **P0 — Broken privacy equity path:** `norbertbanhalmi.com/privacy/` → `banhalmiphotography.com/privacy/` **404**. Fix: permanent aliases to `/privacy-policy/` (+ HU/DE).
2. **P0 — Blog entity dual `@id`:** home STATIC_PAGE SEO still declared Person/Organization on `norbertbanhalmi.com`. Fix: Wix API rewrite to `banhalmiphotography.com` (email unchanged).
3. **P1 — Artistic nude intent leakage on Professional `/fine-art/`:** Service JSON-LD categories/alternateNames claimed nude/akt photography; private CTA labelled private but linked to Ébredés. Fix: remove nude from Service schema; private CTA → ART private-photography; retain contextual Ébredés links for artistic-nude intent.
4. **P1 — Soft redirect `/muveszi-aktfotozas/`:** HTTP 200 meta-refresh. Fix: hard 301 (with and without trailing slash) + remove stubs.

## Intent ownership (authoritative)

| Intent | Owner |
|---|---|
| Artistic nude (HU/EN/DE terms listed in master prompt) | Ébredés on **banhalmi.art** (language-matched) |
| Historical artistic-nude essays | **Fotótörténelem** posts (keep; contextual link to Ébredés — no auto-redirect) |
| Commercial portrait / brand / event | Professional service pages |
| Private / boudoir artistic projects | ART `private-photography` |

## Measurement gap

Comparable query-level GSC matrices for HU low-CTR diagnosis and blog `bánhalmi norbert` cannibalisation are **not freshly pullable** here. Baselines are recorded from user-verified Wizard figures; see `gsc-query-export-status.md`.

## Next merge gate

Deploy this branch → verify live SHA → re-check `/privacy/`, `/muveszi-aktfotozas/`, fine-art Service LD, blog home Person `@id` → import GSC exports → re-measure.
