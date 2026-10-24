# BANHALMI PR #4 — release gate, 2026-10-24

Status: **NO-GO / draft**. This branch does not contain the full local ZIP remediation.

## Verified locally against the available remediation workspace
- `node tests/wikidata-first-contract.test.mjs`: PASS
- `node tests/banhalmi-c-url-image-parity.test.mjs`: PASS (100 routes, 595 images)
- `node tests/fine-art-three-language-gallery.test.mjs`: PASS (46 gallery images, 16 gated per language)
- `node tests/footer-disclosure-contract.test.mjs`: PASS
- Primary domain CNAME is `www.norbertbanhalmi.com`.
- The available `vercel.json` includes host-specific root redirects from `banhalmi.at` to `/de-at/` and `banhalminorbert.hu` to `/hu/`.

## Release blockers
1. Reconcile the complete remediation ZIP against the latest GitHub main; do not replace main wholesale.
2. Restore the correct GitHub Pages publishing workflow from an authoritative source. The current repository tree lacks `.github/workflows/pages.yml`, `emergency-pages-deploy.yml`, and `live-production-probe.yml`, while source audits still require them.
3. Resolve `npm test` and all PR checks; inspect actual GitHub Actions logs.
4. Run Playwright, responsive QA, privacy/SEO/schema and production exact-live SHA verification.
5. Only then mark the PR ready for review and consider merge.

No production deploy or main merge has been performed by this PR.
