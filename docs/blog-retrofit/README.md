# Blog editorial retrofit — blog.banhalmi.art

Typography / editorial-rhythm retrofit of all **537** published Wix Blog posts (179 HU–EN–DE translation groups), without changing BANHALMI identity, facts, IDs, URLs, or categories.

## Status (Batch 1)

| Gate | Result |
|------|--------|
| Published posts | **537** |
| HU / EN / DE | **179 / 179 / 179** |
| Complete translation groups | **179** |
| Category-less posts | **0** |
| Wrong-language categories | **0** |
| Translation category parity (by category `translationId`) | **0 mismatches** |
| Batch 1 structural drafts | **9 posts** draft-updated, **not published** |
| Batch 1 already compliant | **21 posts** untouched |
| Live auto-publish | **blocked pending human approval** |

## Files

- `00-inventory-audit.json` — full inventory gates
- `01-batch-plan.json` — 18-batch plan (max 10 groups / batch)
- `batch-01/change-ledger.json` — per-post ledger
- `batch-01/review-required.json` — human decisions
- `batch-01/regression-qa.json` — preservation + structural QA
- `../tools/blog-retrofit/ricos-transform.mjs` — idempotent Ricos transform

## Batch 1 scope

Fotótörténelem / Photography History / Fotogeschichte **#14–#23** (10 groups × 3 languages = 30 posts).

### Changed (draft only — live unchanged until publish)

- **#21** Atget (HU/EN/DE): `H2_FORMAT`
- **#22** Thomson (HU/EN/DE): `H2_FORMAT` + `IMAGE_SPACING` + `PARAGRAPH_RHYTHM`
- **#23** Johnston (HU/EN/DE): `H2_FORMAT` + `IMAGE_SPACING` + `PARAGRAPH_RHYTHM`

### Unchanged (already match reference rhythm)

- **#14–#20** (21 posts): spacing + H2 BOLD/ITALIC already present

## Codex review fixes (PR follow-up)

- Complete H2 decorations (`fontWeightValue: 700`, `italicData: true`) on draft writes
- Before-image spacing for non-opening images
- CAPTION child text for lead-image classification
- Fail-closed `firstPublishedDate` UNKNOWN; second-precision date compare
- Full 30-entry change ledger

## Safety notes

1. Writes used Draft Posts `PATCH` **without** `UPDATE_PUBLISH` (live stays as before).
2. Opening subject IMAGE with caption = `CONTENT_LEAD_IMAGE_OK` (not decorative hero; not deleted).
3. Preservation false-positive: draft API exposes `seoSlug`, live exposes `slug` — values match.
4. Next step after approval: `UPDATE_PUBLISH` for the 9 draft posts only, then Batch 2.
