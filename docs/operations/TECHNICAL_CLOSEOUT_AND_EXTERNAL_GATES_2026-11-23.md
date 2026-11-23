# BANHALMI / ART / Fotótörténelem — technical closeout and external signoff gates

Date: 2026-11-23 (Europe/Vienna) · Status: **TECHNICAL BASELINE VERIFIED; EXTERNAL GDPR EVIDENCE PENDING**

This file is a precise closing record, **not** an Austrian legal certificate, privacy opinion or automatic waiver of unverified third-party processing. It is intended to prevent repeated SEO/UX patches and preserve the remaining owner/vendor dependencies. Do not delete the ACTIVE remediation journal until every external signoff is supported by attributable evidence.

## 1. Closed technical work, bounded evidence

| Scope | Observed proof | Result |
| --- | --- | --- |
| BANHALMI Professional | 57/57 live URLs: status/title/H1/canonical/hreflang/JSON-LD checks in [three-site run](https://github.com/880rzz/BANHALMI/actions/runs/45200021109). Earlier exact-live source SHA `e8746540ff5620f35412bc51f321df29c1c928f8` [deployed successfully](https://github.com/880rzz/BANHALMI/actions/runs/45223600256). | Closed for tested baseline; re-prove each subsequent main SHA |
| BANHALMI ART | 93/93 live URLs, HU/EN/DE artistic-link and page coverage, latest verified `fd0854ed9946f114291de0850d76a7d292712b47` [Pages run](https://github.com/880rzz/ART/actions/runs/45147036504). | Production-verified |
| Wix editorial | 555/555 published blog URLs HTTP 200, 185 each HU/EN/DE, 21 trilingual category entries; 63 sampled browser views incl. 768px iPad; 30/30 distinct in-article ART/Professional link destinations HTTP 200 in [Wix audit](https://github.com/880rzz/BANHALMI/actions/runs/45216504877). | Bounded route/readback and representative visual tests passed; not 555 individually screenshot-audited |
| Wix legacy mobile menu | Owner updated Classic Editor; independent live HU/EN/DE × 390px /1440px Chromium [test](https://github.com/880rzz/BANHALMI/actions/runs/45245554090) found no obsolete `www.norbertbanhalmi.com/privacy-policy` rendered anchor; native cookie-policy links clicked and routed correctly (6/6, 0 errors). | Production-verified for six views |
| Client consent boundary | [Controlled browser workflow](https://github.com/880rzz/BANHALMI/actions/runs/45173373254): 6/6 no classified GA4/Clarity/TWIPLA requests pre-consent or on Decline, 3/3 cookie preferences persist after UI withdrawal. | Client-side pass only; does not assert backend attribution |
| Search Console | On 2026-11-23 first-party GSC Wizard listed **1 Professional + 2 ART + 6 Wix** submitted/downloaded sitemaps, all 0 errors/0 warnings; 36 newer Wix URLs added to index monitoring (14 indexed, 2 discovered-not-indexed, 20 URL unknown at inspection). | Sitemap technical gate closed; indexing remains measurement, not a deploy failure |

## 2. Independently read Wix native settings (2026-11-23)

Official site ID `5bfb58f7-cf3f-4eee-acbd-b8fcac6b217b`, published canonical `https://blog.banhalmi.art/`. Source: connected Wix REST APIs [List Marketing Tags](https://dev.wix.com/docs/api-reference/business-management/marketing/marketing-tags/list-marketing-tags) and [Get Cookie Banner Settings](https://dev.wix.com/docs/api-reference/business-management/cookie-consent-policy/cookie-banner-settings/get-cookie-banner-settings).

- Native `GOOGLE_ANALYTICS`: **enabled** for `blog.banhalmi.art` with measurement ID `G-EY91Q4QSVF`.
- `GOOGLE_TAG_MANAGER` and `FACEBOOK_PIXEL`: **disabled**. No duplicate custom analytics embed should be added.
- Wix cookie banner `enabled=true`, `declineAllConfig.enabled=true`, `revisitSettingsConfig.enabled=true` in HU/EN/DE official reads. All three locale-config reads returned 16 translated text keys.
- Wix `cookiePolicyRequirementApproved=false` in each language read. Wix documentation describes this field as **site contributor acknowledgement of consent-policy requirements**, **not** a legal GDPR compliance opinion. It requires a responsible owner to review its intended significance and acknowledge only with appropriate authorization; do **not** flip this flag automatically to fabricate signoff.
- Base settings `privacyPolicyPageInfo` point to the Professional EN privacy-policy URL, while observed **rendered** native Wix banner links navigate to matching HU, EN and DE cookie-policy destinations in all 6 tested views. Preserve this distinction; do not 'fix' proven correct live localization by blindly changing a global field.
- GA4 first-party read of the linked property `properties/264560720` (`Két Évtized`) for 2026-10-24 to 2026-11-20: `blog.banhalmi.art` **68 sessions, 145 page views, 30 active users**. Historic host-scoped measurement **proves property receives data from this hostname**, but is not a fresh individually attributable post-consent event.
- Site owner attests analytics operates **only following affirmative analytics consent**. Treat as credible operational owner confirmation but not a substitute for controlled post-Accept server measurement evidence.

## 3. Truly remaining, non-fabricable closure conditions

**GATE-GA4-01 — attributable positive opt-in (P1, external vendor/measurement):** Generate a controlled genuine opt-in on the published Wix site; correlate a unique ethically permitted session, timestamp and the expected GA4 property without forged hits or disabling consent. Existing Chromium opt-in test clicked Accept in HU/EN/DE but found no classified **client** GA4 request: result `MEASUREMENT_UNVERIFIED_CLIENT_ONLY`; the native vendor may perform server-side transport. GA4 Realtime property aggregates cannot be causally attributed to one test visitor/session. Obtain Wix-native vendor telemetry or an appropriately scoped Google Analytics validation that demonstrates the connection. No need to rebuild good banner/SEO.

**GATE-GA4-02 — withdrawal with backend attribution (P1, external vendor/measurement):** Verify no further **server-side** GA4 data processing for a controlled test session after consent withdrawal (subject to prior lawful collection/retention). Browser UI/saved category and zero client requests after reload passed 3/3; the proprietary Wix server-side path is **not** exposed by the currently connected APIs. Seek Wix/platform attestation or independently attributable controlled vendor instrumentation; do not claim 'proved server revocation' from a negative client test.

**GATE-LEGAL-03 — controller or qualified Austrian/EU counsel decision (P1, human authority):** Validate full 3-language notices, Wix/Google processor roles and DPA, international data transfer mechanism, actual consent collection/retention records, withdrawal procedure, TKG 2021 §165(3) and GDPR Art. 4(11)/7. Record dated approver name/role, reviewed policy URLs and approval scope or exception rationale in an authorized private governance system; this public repo must **not** contain names/signatures/private contracts. Also review the Wix `cookiePolicyRequirementApproved=false` contributor acknowledgement without using that boolean as a substitute for legal review.

Official legal interpretation and reference:
- Austrian Datenschutzbehörde: https://dsb.gv.at/faqs/datenschutz-cookies
- European Commission: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en
- Wix field definition: https://dev.wix.com/docs/api-reference/business-management/cookie-consent-policy/cookie-banner-settings/cookie-banner-settings-object

## 4. Bounded follow-up and final closure rules

- **Do not** alter the published native Wix GA4, user consent defaults, legal checkbox acknowledgments or HTML tags speculatively. No fictitious analytics events, invented external-image licenses, guaranteed Google indexation, or legal certificates.
- Third-party artistic book-cover license claims should only be added if corresponding authority/permissions are supplied. Their absence is **not evidence** a different owner grants a BANHALMI license.
- The 555-published-post structural audit and 63 sampled browser observations are truthful scope limits; only real newly found material defects justify another patch. Temporary isolated static Wix SSR title/H1 warnings were not reproducible in [focused Chromium run](https://github.com/880rzz/BANHALMI/actions/runs/45221629845). Do not mass-rewrite good Wix SEO from a transient warning.
- SEO/GSC monitoring continues as normal operations, not an unresolved production release criterion. Do not resubmit 9 clean sitemaps without an actual URL inventory change or reported error.
- After documentation merge re-evaluate **new** Professional main SHA against the live custom domain in the GitHub Pages exact-live workflow. Merge is not deploy proof.
- Issue [#315](https://github.com/880rzz/BANHALMI/issues/315) remains open for the 3 external evidence gates, not for the already fixed Wix menu. **Only** after all hard gates have defensible attributable evidence and signed approval may the owner approve full-project closure; then update issue, record final source/live proof and delete the ACTIVE remediation journal per the original master prompt.
