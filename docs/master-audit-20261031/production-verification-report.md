# Production verification report

**Generated:** 2026-10-31 (Europe/Budapest)

## Live deployment SHAs (pre-merge of this audit branch)

| Surface | Probe | Observed |
|---|---|---|
| Professional | `https://www.banhalmiphotography.com/deployment-sha.txt` | `c36177d9fe075c36d8b3dd54d99d975784d13694` |
| ART | `https://www.banhalmi.art/deployment-sha.txt` | `868b3c3503de7f3ee15f1fa9071dbe5c4ab2f7e6` |
| Blog | Wix | Custom embed `entity` revision **69**; STATIC_PAGE `fnxak` SEO tags rewritten 2026-10-31 |

## Exact-live checks

| Check | Result |
|---|---|
| Sitemap URLs HTTP 200 (690) | PASS |
| Legacy `norbertbanhalmi.com` → photography path-to-path 308 | PASS (sample 40) |
| `/privacy/` after migration | **FAIL live** until this PR deploys. Root cause: photography.com is GitHub Pages (vercel.json alone does not rewrite). Fix: GH Pages `privacy/` stubs + vercel aliases. |
| Blog `/ai.txt` → photography `ai.txt` | PASS (301 → 200) |
| Email `hello@norbertbanhalmi.com` preserved | PASS on Professional policy pages |
| Fine-art Service nude categories removed | Pending deploy of this branch |
| `/muveszi-aktfotozas/` hard 301 | Pending deploy (stubs removed + vercel redirects) |
| Blog home dual Person `@id` | API rewritten; live cache re-check required |

## Open PR dependencies

- Prior BANHALMI PR #129 privacy-only branch is superseded/cherry-picked into `cursor/master-ecosystem-audit-1f48`.
- ART PR #327 ImgKG Person+ImageObject audit alignment — independent.

## Unresolved / external

- Fresh authenticated GSC 28/90-day query×page×country exports (**UNAVAILABLE** in this Cloud Agent).
- Asset-level Google Images licence URL verification for every photograph.
- Merge + deployment SHA tip sync after CI green.
