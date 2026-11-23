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
- Initial read on 2026-11-23 found Wix `cookiePolicyRequirementApproved=false`. **After the site owner explicitly reported specialist legal approval and authorized configuration, the flag was set to `true`** via the documented Wix API and verified in HU/EN/DE. This is site-contributor acknowledgement, **not a counsel certificate.** The Wix API is replace-all in practice; a partial update initially and briefly disabled banner/app/Decline/Revisit switches, immediately detected and corrected with a full-state write, all four re-read TRUE.
- Base settings `privacyPolicyPageInfo` point to the Professional EN privacy-policy URL, while observed **rendered** native Wix banner links navigate to matching HU, EN and DE cookie-policy destinations in all 6 tested views. Preserve this distinction; do not 'fix' proven correct live localization by blindly changing a global field.
- GA4 first-party read of the linked property `properties/264560720` (`Két Évtized`) for 2026-10-24 to 2026-11-20: `blog.banhalmi.art` **68 sessions, 145 page views, 30 active users**. Historic host-scoped measurement **proves property receives data from this hostname**, but is not a fresh individually attributable post-consent event.
- Site owner attests analytics operates **only following affirmative analytics consent**. Treat as credible operational owner confirmation but not a substitute for controlled post-Accept server measurement evidence.

## 3. Truly remaining, non-fabricable closure conditions

**GATE-GA4-01 — attributable positive opt-in (P1, external vendor/measurement):** Generate a controlled genuine opt-in on the published Wix site; correlate a unique ethically permitted session, timestamp and the expected GA4 property without forged hits or disabling consent. Existing Chromium opt-in test clicked Accept in HU/EN/DE but found no classified **client** GA4 request: result `MEASUREMENT_UNVERIFIED_CLIENT_ONLY`; the native vendor may perform server-side transport. GA4 Realtime property aggregates cannot be causally attributed to one test visitor/session. Obtain Wix-native vendor telemetry or an appropriately scoped Google Analytics validation that demonstrates the connection. No need to rebuild good banner/SEO.

**GATE-GA4-02 — withdrawal with backend attribution (P1, external vendor/measurement):** Verify no further **server-side** GA4 data processing for a controlled test session after consent withdrawal (subject to prior lawful collection/retention). Browser UI/saved category and zero client requests after reload passed 3/3; the proprietary Wix server-side path is **not** exposed by the currently connected APIs. Seek Wix/platform attestation or independently attributable controlled vendor instrumentation; do not claim 'proved server revocation' from a negative client test.

**GATE-LEGAL-03 — specialist legal decision: OWNER-ATTESTED APPROVED (2026-11-23):** Site owner reports a legal specialist approved the cookie/GDPR arrangement and recommended Wix changes. This owner's attestation is accepted as evidence **that approval was reported**, not proof that the assistant inspected a signed legal opinion or knows its detailed scope. The contributor policy acknowledgement is now TRUE in Wix. For formal internal audits, the actual review scope, qualified adviser's signed or dated record, processor/transfer assessment and approved HU/EN/DE copy can be retained privately by the responsible controller, not in this public source repository. Do not ask again for an approval decision already reported by the owner; do not claim a separate legal certification.

Official legal interpretation and reference:
- Austrian Datenschutzbehörde: https://dsb.gv.at/faqs/datenschutz-cookies
- European Commission: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en
- Wix field definition: https://dev.wix.com/docs/api-reference/business-management/cookie-consent-policy/cookie-banner-settings/cookie-banner-settings-object

## 4. Bounded follow-up and final closure rules

- **Do not** alter the published native Wix GA4, user consent defaults, already-acknowledged legal policy flag or HTML tags speculatively. No fictitious analytics events, invented external-image licenses, guaranteed Google indexation, or legal certificates.
- Third-party artistic book-cover license claims should only be added if corresponding authority/permissions are supplied. Their absence is **not evidence** a different owner grants a BANHALMI license.
- The 555-published-post structural audit and 63 sampled browser observations are truthful scope limits; only real newly found material defects justify another patch. Temporary isolated static Wix SSR title/H1 warnings were not reproducible in [focused Chromium run](https://github.com/880rzz/BANHALMI/actions/runs/45221629845). Do not mass-rewrite good Wix SEO from a transient warning.
- SEO/GSC monitoring continues as normal operations, not an unresolved production release criterion. Do not resubmit 9 clean sitemaps without an actual URL inventory change or reported error.
- After documentation merge re-evaluate **new** Professional main SHA against the live custom domain in the GitHub Pages exact-live workflow. Merge is not deploy proof.
- Issue [#315](https://github.com/880rzz/BANHALMI/issues/315) remains open primarily for **two external Wix/GA4 measurement proof gates**, not for the fixed menu or the owner's reported legal decision. Full completion also requires passing post-mutation browser checks and latest exact-live SHA. The journal is retained, and no independent legal certificate is inferred from owner attestation.

## 5. Wix owner-authorized administrative change and production QA (2026-11-23)

- **Legal status:** the site owner reports the legal specialist has approved the proposed consent/GDPR arrangements and instructed implementing available Wix controls. No separate signed legal document was supplied to the assistant. Do not falsely label this a legal opinion issued by the assistant.
- **Change made:** Wix cookie banner `cookiePolicyRequirementApproved=true`, persisted in HU, EN, DE official GET. Banner/app enablement, Reject All, Revisit all `true` and preserved. Site's Wix `consentPolicy` remained `{essential:true,functional:false,analytics:false,advertising:false,dataToThirdParty:false}`.
- **Critical recovery transparently logged:** the Wix update API treated a partial setting body as replacement and temporarily disabled the banner, app, reject and revisit. These switches were immediately restored in a full-state update. Initial config readback exposed HU policy link reset to blank and 16 source-language strings changed back to English; native HU copy was faithfully re-localized and the correct `https://www.banhalmiphotography.com/hu/sutik/` link restored, while EN/DE localized values remained unchanged. The intermediate live browser policy test 45245554090 **attempt 2 FAILED** in HU (2/6 failures), validating the need for the correction. **Final Wix GET results**: 3/3 locales, five safe switches TRUE, 16 translation keys each, HU/EN/DE policy paths correct; browser reruns attempt 3 were initiated for independent post-change validation. No native analytics, custom code or the default consent policy modified.
- The previous consent-browser run 45173373254 attempt 2 returned 5/6 negative Decline PASS, one EN-desktop button not observed (inconclusive), 3/3 Client-Withdrawal PASS, and no classified preconsent/client withdrawal analytics leak. Its subsequent attempt 3 was started after final Wix localization. This distinction is important: never label an incomplete/inconclusive audit as full production proof.
- Official vendor reference: [Wix analytics consent behavior](https://support.wix.com/en/article/troubleshooting-google-analytics). No server-side event attribution or post-withdrawal suppression guarantee is invented from this documentation alone.
