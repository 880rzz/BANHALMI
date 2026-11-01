# C2PA / Content Credentials readiness — BANHALMI Photography

**Status: NOT READY**

Date: 2026-11-01 (Europe/Budapest)

## Current state

- Professional HTML ImageObjects carry Google-supported licensing fields: `license`, `acquireLicensePage`, `creator`, `copyrightHolder`, `creditText`, `copyrightNotice`.
- `data/image-catalog.json` and fine-art archive records already enforce licensing completeness via `tools/audit-image-licensing.mjs`.
- Optimized web derivatives in this repository do **not** embed verifiable C2PA manifests.
- Local audit environment has no `exiftool` / Pillow IPTC writer in the default toolchain; binary IPTC tagging remains out of scope per prior content-audit decisions unless a controlled, privacy-safe pipeline is added.

## Privacy boundary

Do **not** re-introduce:

- GPS coordinates
- private addresses beyond published studio Places
- camera serial numbers
- other sensitive EXIF

Provenance for the public web is expressed through schema + first-party pages, not raw EXIF dumps.

## Missing technical links

1. Camera / RAW capture with C2PA-capable firmware or importer
2. Signed export step before WebP/AVIF packaging
3. Manifest survival across `package-pages-artifact` / compression
4. Public verification endpoint or UI gated on real validation
5. Separate handling for any future AI-modified derivatives

## Interim trust model (implemented)

- Documented creator: Norbert Banhalmi (`/about/`)
- Documented rights holder + license targets (`/terms-conditions/`, `/requestaquote/`)
- Project / service page context via page-level ImageObject `representativeOfPage` and catalog records
- No fabricated “human-made” machine fields

## Decision

**C2PA: NOT READY** — keep machine-readable licensing and provenance; do not add decorative Content Credentials until signing is real.
