# Production Verification Report — Entity Authority pass

Generated: 2026-10-31 (Europe/Budapest)

## Baseline before this PR’s deploy

| Surface | SHA / ID | Status |
|---|---|---|
| Professional | `2951c6ec6f4693e490b2ece8083a6a63a824da30` | **VERIFIED LIVE** at start |
| ART | `868b3c3503de7f3ee15f1fa9071dbe5c4ab2f7e6` | Behind main `208ea219…` — **MERGED — LIVE NOT VERIFIED** for slogan/#327+#328 |
| Blog | Wix | Person `@id` single — **VERIFIED LIVE** |

## Exact-live checks (pre-change baseline)

| URL | Check | Result | Status |
|---|---|---|---|
| `/about/` | Person schema Q56391118, memberships, VIPACH founder | Present | **VERIFIED LIVE** |
| `/portrait/` | Service + titles from #131 | Present | **VERIFIED LIVE** |
| `/lifestyle/` | Visual positioning methodology steps | Present | **VERIFIED LIVE** |
| `/fine-art/` | No Nude Art in Service | Pass | **VERIFIED LIVE** |
| ART `/exhibitions/ebredes.html` | 200 + Person bridge | Pass | **VERIFIED LIVE** |
| Blog akt tag posts | Ébredés hrefs | 10/10 | **VERIFIED LIVE** |

## Post-merge requirement

After this branch deploys, re-check:

1. Professional `deployment-sha.txt` equals merge commit.
2. Portrait EN/HU/DE contain problem-framing section.
3. About / ai.txt / llms.txt mention Fotótörténelem entity separation.
4. No Nude Art regression; no second Person `@id` on blog.

## GSC

Fresh 28/90 measurement: **BLOCKED** (no API).