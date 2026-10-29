# BANHALMI ↔ BANHALMI-C route & image parity

Verified: 2026-10-25 (Europe/Budapest)

## Scope
- Source of truth for historical www.banhalmiphotography.com URLs: `880rzz/BANHALMI-C` @ `c989ace1984d84f524e0a2b826915b06359b2556`
- Current Professional repo: `880rzz/banhalmi` @ `10cdce915abab62442fff192c07cfa062f2434f2` (this branch)
- Baseline contract: `data/banhalmi-c-url-image-parity.json` (sourceTreeSha `c989ace1984d84f524e0a2b826915b06359b2556`)

## Result
- HTML historical routes: **100/100 present** in both trees (`html_ok=True`)
- Image path + Git blob SHA: **595/595 match**
- Failures: **0**
- Live HTML `<img src|/assets/img/...>` references in banhalmi: **1415/1415 resolve** on disk
- Extra files only in banhalmi `assets/img`: macOS `.DS_Store` noise only (not published assets)

## Policy preserved
Do not rename, delete or rewrite historical HTML routes or original image binaries. New voice/SEO edits must stay on copy/CSS/schema layers that keep the same public paths.

## Automated gate
`node tests/banhalmi-c-url-image-parity.test.mjs` remains release-blocking in `npm test`.
