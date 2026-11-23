# BANHALMI ecosystem — verification evidence and remaining gates
2026-11-23 · Audit scope: Professional / ART / Fotótörténelem Wix Blog · HU/EN/DE-AT

## A. Source-of-truth and exact-live evidence

- Professional canonical: https://www.banhalmiphotography.com/; source `880rzz/BANHALMI`.
- ART canonical: https://www.banhalmi.art/; source `880rzz/ART`.
- Editorial canonical: https://blog.banhalmi.art/; Wix site `5bfb58f7-cf3f-4eee-acbd-b8fcac6b217b`.
- Professional **previously exact-live-verified** `ee13d37d037f64b410c9b60c19730790b63c2e0a`: https://github.com/880rzz/BANHALMI/actions/runs/45207703313 (SUCCESS). A later **read-only audit tooling** merge PR #322 created `4b2832ac627d9e7d157d1c4cca719c55da546714`. Latest exact live marker for that SHA must be checked independently and is not inferred from the merge.
- ART exact-live-verified `fd0854ed9946f114291de0850d76a7d292712b47`: https://github.com/880rzz/ART/actions/runs/45147036504 (SUCCESS).
- Complete route matrix: all 57 Professional and 93 ART canonical production HTML URLs returned HTTP 200 with expected canonical, title, H1, language, hreflang and parseable JSON-LD in https://github.com/880rzz/BANHALMI/actions/runs/45200021109 . This is technical metadata evidence, not proof of all semantic claims.
- All 21 Wix categories in 7 complete trilingual groups passed 54 production Chromium viewport checks (mobile + desktop) in the same run.

## B. Wix published inventory and semantic cross-brand linking

- Official Wix Posts API: **555 / 555** published URLs, 185 HU + 185 EN + 185 DE, each distinct, with 2,229 embedded IMAGE/GALLERY nodes; **21** posts have no IMAGE/GALLERY node, some are intentionally VIDEO-centric. No images are fabricated.
- 555 / 555 BlogPosting resolved SEO item tags had one active Article/BlogPosting node, no missing/duplicated/malformed Article JSON-LD. `inLanguage` absent from 525 inherited nodes: optional editorial enrichment, not a diagnosed P0/P1.
- Prior retired `/mybest` links in three 1956/AI translations were minimally replaced with accurate **related historical context** in the matching ART language. Wix published API readback and full 555-article scan confirmed zero remaining `/mybest` and zero detected wrong-locale Professional/ART crosslinks.
- The 36 distinct in-article ART/Professional destination hrefs were identified; 30 distinct URLs remain when ignoring fragment identifiers. Press fragment anchors `#press-07`, `#press-08` and `#press-22` were present in each HU/EN/DE ART press source. Latest read-only audit https://github.com/880rzz/BANHALMI/pull/321 covered 30/30 HTTP 200 targets and 555/555 Wix published article HTTP 200 responses in first run https://github.com/880rzz/BANHALMI/actions/runs/45213143959 .
- The same initial audit identified **nine** 768px horizontal overflow cases when using a desktop user-agent with narrow viewport. Other widths (375, 390, 1024, 1280, 1440, 1920) passed. The first run therefore correctly FAILED. A separate re-run with actual iPad emulation at 768px is **in progress** on PR #321; neither real tablet rendering nor the desktop-UA resize case may be claimed resolved until its result is reviewed. If unresolved, keep a non-green finding rather than masking with overflow CSS.

## C. Wix cookie consent and GDPR boundaries

- Wix native `GOOGLE_ANALYTICS` enabled for `blog.banhalmi.art`, ID `G-EY91Q4QSVF`; old custom HEAD GA4 and Clarity embeds remain disabled, consent defaults remain fail-closed. No speculative duplicate analytics tag or forced consent is permitted.
- Browser pre-consent and Decline traffic passed 6/6, and user-visible optional-category withdrawal passed 3/3 in https://github.com/880rzz/BANHALMI/actions/runs/45173373254 . These are **client-side**, not server-side proofs.
- Wix multilingual policy URL production check **passed 6/6 real clicks**, HU/EN/DE at 390 and 1440px. Link destinations are respectively `/hu/sutik/`, `/cookie-policy/`, `/de-at/cookies/` on the Professional site. No warnings/failures. PR #322 merged, verified run https://github.com/880rzz/BANHALMI/actions/runs/45216751688; evidence https://github.com/880rzz/BANHALMI/actions/runs/45216751688/artifacts/14839426217 .
- Some Wix mobile DOM samples also contained a legacy `https://www.norbertbanhalmi.com/privacy-policy` navigation href, distinct from the **correct** native consent-banner policy link. Its effective visibility/clickability and Wix Editor ownership were not established; this is a separately scoped follow-up, not proof the native cookie-policy link is wrong.
- P1 **OPEN** https://github.com/880rzz/BANHALMI/issues/315 : no individually attributable, post-Accept native Wix GA4 event in a controlled test; no independent **server-side** post-withdrawal proof; no signed Austrian/EU controller or counsel review of processor/vendor/transfer disclosures. Historic GA4 hostName metrics are not causally attributable to the controlled test. Closing as `not_planned` previously did not satisfy legal signoff.
- Do **not** declare GDPR compliance or delete the remediation journal without the recorded signoff or an explicitly documented lawful alternative. Existing public legal notice and cookie disclosure updates remain as shipped.

## D. Google Search Console evidence, 28/90 days

- GSC Wizard connected account `link_6aaa674313ac8191bf9b827c9382e46c`, active site-owner access for Blog; canonical blog home URL Inspection: PASS, Submitted and indexed, canonical self-referential, robots allowed. Property-scoped verification annotation dated 2026-11-23 ID `98f69b14-4ad5-4eec-9725-9063a85bb9db`.
- Final **nine sitemaps**, 1 Professional + 2 ART + 6 Wix, each submitted/downloaded, 0 parse errors and 0 warnings; no blind resubmission required. Wix localized blog-post sitemaps list 185 articles each, 555 total.
- GSC 28-day settled report Oct 24 – Nov 20:
  - Professional: 25 clicks, 17,542 impressions, 0.1425% CTR; service-specific click-through remains a strategic opportunity.
  - ART: 112 clicks, 1,439 impressions, 7.78% CTR.
  - Blog: 6 clicks, 295 impressions, 2.03% CTR.
- GSC 90-day reports Aug 23 – Nov 20:
  - Professional: 25 clicks / 17,542 impressions (the current canonical property lacks meaningful older baseline; **do not** report previous-period zero as organic growth).
  - ART: 222 clicks / 3,055 impressions compared with 546 clicks / 11,034 impressions in the previous 90 days; ranking mix should be analyzed before changing editorial intent.
  - Blog: 20 clicks / 885 impressions vs 1 click / 28 impressions in the preceding 90 days. Sample sizes remain small.
- 2026-11-23 GSC Wizard 552 tracked blog URLs before patch: 307 indexed, 245 not-indexed, 10 prior deindexed warnings, 2 previously crawled 5xx (German `/de/post/von-oben-geführt`, Hungarian `/post/william-henry-fox-talbot-the-open-door-1844`), as historical Google inspection results. Both source posts existed with rich text/image and the following GitHub Actions all-article HTTP audit returned live 200: **do not mislabel a historical 5xx as current downtime**.
- **36 / 36** newly published Fotótörténelem series URLs not yet present in GSC Wizard's indexing watchlist were added to the tracker on 2026-11-23, no skipped/cap hits. All 36 URL Inspection API calls completed: 14 Submitted and indexed, 2 Discovered – currently not indexed, 20 URL unknown to Google. This is measurement, **not** a guarantee of future indexing. Tracker now has 588 entries and will inspect pending new URLs.

## E. Unresolved final closure gates

1. Independent Wix server-side opt-in and post-withdrawal GA4 attribution with valid consent — owner/Wix/vendor diagnostics; no fabricated proof.
2. Qualified Austrian/EU controller or counsel legal review/signoff for processor, transfer and privacy-policy statements.
3. Review any residual responsive overflow, Wix legacy mobile navigation href and remaining editorial visual/content/media coverage beyond the sampled 63 renders.
4. Reconcile live deploy and source SHA after all current PRs, finish reverse audit with **zero unacknowledged P0/P1**, and write immutable final closure decision.
5. Retain `docs/operations/ACTIVE_ECOSYSTEM_REMEDIATION_JOURNAL_2026-11-23.md` until the master prompt's own deletion gates ALL pass. The presence of a merged PR or an administratively closed issue does not waive mandatory evidence.

This report is not itself an auditor's certification, legal opinion or SEO traffic guarantee.
