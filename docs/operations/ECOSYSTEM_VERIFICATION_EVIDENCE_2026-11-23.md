> **ARCHIVÁLT RÉSZJELENTÉS — 2026-11-23.** A korábbi FÜGGŐ bejegyzések történeti állapotot rögzítenek. A teljes háromoldalas javítási folyamat aktuális, tartós zárójelentése: [ECOSYSTEM_FINAL_CLOSURE_2026-11-23.md](./ECOSYSTEM_FINAL_CLOSURE_2026-11-23.md). A #315-ös GA4-ügy a tulajdonos elfogadott tesztjei alapján lezárt; a 555/555 Wix-cikk teljes URL-szintű böngészős ellenőrzése a 37 Wix HTTP429 miatti kímélő ismétléssel együtt sikeres. A bizonyítatlan opcionális Google-/képjogi mezőket változatlanul hagytuk. A végső main SHA pontos élesítése külön Github Actions kiadási kapu, nem feltételezzük a merge-ből.

# BANHALMI ecosystem — verification evidence and remaining gates
2026-11-23 · Audit scope: Professional / ART / Fotótörténelem Wix Blog · HU/EN/DE-AT

## A. Source-of-truth and exact-live evidence

- Professional canonical: https://www.banhalmiphotography.com/; source `880rzz/BANHALMI`.
- ART canonical: https://www.banhalmi.art/; source `880rzz/ART`.
- Editorial canonical: https://blog.banhalmi.art/; Wix site `5bfb58f7-cf3f-4eee-acbd-b8fcac6b217b`.
- Professional exact-live-verified earlier releases include `6ccfd49a77b305ec31736bc4c2b9fc428597ff66` (https://github.com/880rzz/BANHALMI/actions/runs/45203563647 SUCCESS). The latest examined documentation-only main is `a030d911dbef16bea10ac99993b6015825224ccf`; its exact-live deployment must be verified separately. A prior production run for `bc5102e59b6f5655486669c7c062c0360c458b92` was cancelled after a superseding main commit; neither cancellation nor merge proves its live marker.
- ART exact-live-verified `fd0854ed9946f114291de0850d76a7d292712b47`: https://github.com/880rzz/ART/actions/runs/45147036504 (SUCCESS).
- Complete route matrix: all 57 Professional and 93 ART canonical production HTML URLs returned HTTP 200 with expected canonical, title, H1, language, hreflang and parseable JSON-LD in https://github.com/880rzz/BANHALMI/actions/runs/45200021109 . This is technical metadata evidence, not proof of all semantic claims.
- All 21 Wix categories in 7 complete trilingual groups passed 54 production Chromium viewport checks (mobile + desktop) in the same run.

## B. Wix published inventory and semantic cross-brand linking

- Official Wix Posts API: **555 / 555** published URLs, 185 HU + 185 EN + 185 DE, each distinct, with 2,229 embedded IMAGE/GALLERY nodes; **21** posts have no IMAGE/GALLERY node, some are intentionally VIDEO-centric. No images are fabricated.
- 555 / 555 BlogPosting resolved SEO item tags had one active Article/BlogPosting node, no missing/duplicated/malformed Article JSON-LD. `inLanguage` absent from 525 inherited nodes: optional editorial enrichment, not a diagnosed P0/P1.
- Prior retired `/mybest` links in three 1956/AI translations were minimally replaced with accurate **related historical context** in the matching ART language. Wix published API readback and full 555-article scan confirmed zero remaining `/mybest` and zero detected wrong-locale Professional/ART crosslinks.
- The 36 distinct in-article ART/Professional destination hrefs were identified; 30 distinct URLs remain when ignoring fragment identifiers. Press fragment anchors `#press-07`, `#press-08` and `#press-22` were present in each HU/EN/DE ART press source. PR #321 **merged**; the passing final read-only audit https://github.com/880rzz/BANHALMI/actions/runs/45216504877 confirmed 555/555 Wix article HTTP 200, 30/30 destination HTTP 200 and 63 actual device-appropriate browser renders.
- The initial 768px desktop-user-agent audit recorded nine overflows and correctly FAILED. The final PR #321 run https://github.com/880rzz/BANHALMI/actions/runs/45216504877 used actual iPad emulation at 768px and returned **0 overflow failures** across its sampled views; the desktop-UA-only narrow-resize observation is not proof of a real iPad defect. All 63 sampled browser renders across seven widths passed. This is **not** exhaustive visual verification of all 555 distinct Wix articles. The three intermittent Wix static SSR title/H1 warnings were not reproduced in PR #324 focused run https://github.com/880rzz/BANHALMI/actions/runs/45221629845, which passed repeated public HTML checks and six actual device renders.

## C. Wix cookie consent and GDPR boundaries

- Wix native `GOOGLE_ANALYTICS` enabled for `blog.banhalmi.art`, ID `G-EY91Q4QSVF`; old custom HEAD GA4 and Clarity embeds remain disabled, consent defaults remain fail-closed. No speculative duplicate analytics tag or forced consent is permitted.
- Browser pre-consent and Decline traffic passed 6/6, and user-visible optional-category withdrawal passed 3/3 in https://github.com/880rzz/BANHALMI/actions/runs/45173373254 . These are **client-side**, not server-side proofs.
- Wix multilingual policy URL production check **passed 6/6 real clicks**, HU/EN/DE at 390 and 1440px. Link destinations are respectively `/hu/sutik/`, `/cookie-policy/`, `/de-at/cookies/` on the Professional site. No warnings/failures. PR #322 merged, verified run https://github.com/880rzz/BANHALMI/actions/runs/45216751688; evidence https://github.com/880rzz/BANHALMI/actions/runs/45216751688/artifacts/14839426217 .
- The site owner corrected the separate legacy Wix mobile-menu privacy link in Classic Editor. Fresh independent six-view HU/EN/DE 390/1440px browser check https://github.com/880rzz/BANHALMI/actions/runs/45245554090 (test-only PR #327, merged) found **zero** obsolete `www.norbertbanhalmi.com/privacy-policy` anchors in rendered Wix frames and **6/6** matching native cookie-policy click destinations, 0 warnings/errors. This bounds the live repair proof to tested views, not every article/menu route.
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
3. Review any residual responsive overflow and remaining editorial visual/content/media coverage beyond the sampled 63 renders; the previously noted separate Wix legacy navigation href was independently cleared in six tested live views (run 45245554090).
4. Reconcile live deploy and source SHA after all current PRs, finish reverse audit with **zero unacknowledged P0/P1**, and write immutable final closure decision.
5. Retain `docs/operations/ACTIVE_ECOSYSTEM_REMEDIATION_JOURNAL_2026-11-23.md` until the master prompt's own deletion gates ALL pass. The presence of a merged PR or an administratively closed issue does not waive mandatory evidence.

This report is not itself an auditor's certification, legal opinion or SEO traffic guarantee.

## F. Latest readback (2026-11-23)
- Professional main `88e67cbb92f8bbdcb8bd02e81513b9a3a1411587` after merging test-only PR #327; prior `e8746540ff5620f35412bc51f321df29c1c928f8` was exact-live proven at https://github.com/880rzz/BANHALMI/actions/runs/45223600256 . Verify exact custom-domain release SHA again after any main change.
- User attests analytics starts only on affirmative analytics consent. That aligns with existing six negative preconsent/Decline network browser tests and three withdrawal UI tests; no fresh attributed post-Accept GA4 event or server-side revocation proof yet. Qualified legal signoff remains open in issue #315. Do not change safe native Wix consent settings.
