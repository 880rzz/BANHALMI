# GSC query/URL export status

**Date:** 2026-10-31 (Europe/Budapest)

Authenticated Google Search Console API access is **not available** in this Cloud Agent environment (no Search Console MCP/tooling detected).

Baselines in `gsc-baseline-28-90-days.csv` are seeded from **user-verified** GSC Wizard figures provided in the master prompt.

## Still required for full acceptance
- Fresh comparable 28-day and 90-day property totals for all four properties
- Query × page × country exports for:
  - Former professional domain (especially HU homepage high-impression/low-CTR diagnosis)
  - Blog query `bánhalmi norbert` cannibalisation (9 competing pages)
  - Artistic-nude / Ébredés commercial queries
- Latest settled date confirmation from GSC UI/API

Until imported, mark query-level CTR diagnosis as **MEASUREMENT PENDING**.

## Closure re-check — 2026-10-31 23:39 Europe/Budapest

Fresh authenticated GSC Wizard/API pull was attempted again during final execution. **Result: BLOCKED** (no Search Console MCP/API credentials in this Cloud Agent). No Query × Page × Country matrices were invented. See `docs/ecosystem-closure-20261031/CLOSURE-REPORT.md`.
