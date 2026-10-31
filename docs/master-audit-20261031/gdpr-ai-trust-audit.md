# GDPR and AI Trust Audit — BANHALMI ecosystem

**Date:** 2026-10-31 (Europe/Budapest)  
**Scope:** Professional (`banhalmiphotography.com`), ART (`banhalmi.art`), Blog (`blog.banhalmi.art`)

## Contact identity (non-negotiable)

- Business email remains **`hello@norbertbanhalmi.com`**.
- Do not change form endpoints or recipient routing without production verification.

## Findings

| Severity | Finding | Evidence | Status |
|---|---|---|---|
| P1 | Consent-first analytics must remain ahead of GA4/Clarity firing | Blog embeds: Analytics GA4 + Clarity enabled; Professional/ART consent layers present historically | Documented — human legal review for cross-border processors |
| P2 | AI referral observability limited | Blog GA4: ChatGPT-referred sessions reported in user baseline (4 / 4.26% AI share in provided window) | Measurement only; not proof of citation quality |
| P2 | `llms.txt` / `ai.txt` | Blog `/ai.txt` now 301 → `https://www.banhalmiphotography.com/ai.txt` (200) | Verified live |
| P3 | AI-generated content disclosures | Editorial blog may contain AI-assisted pieces historically | Flag for qualified human review; do not invent disclosures |

## Legal decisions requiring human review

1. Processor list completeness (GA4, GTM, Clarity, Wix, Vercel, GitHub Pages).
2. Retention periods disclosed on privacy notices after domain migration.
3. Consent withdrawal UX parity across HU/EN/DE.

## Not changed in this pass

Form endpoints, email routing, consent copy legal substance.
