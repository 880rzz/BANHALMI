# BANHALMI production audit — July 2026

## Executive Summary
Production readiness improved for the screenshot-confirmed P0/P1 quote, navigation, repeated-process, checkbox, line-breaking and gallery issues. External production submissions to Google Apps Script / Cloudflare Worker remain partially unverified without service credentials and live inbox/spreadsheet access.

## Scores before and after
| Area | Before | After | Evidence |
|---|---:|---:|---|
| SEO | 7 | 8 | Gallery canonical/hreflang/sitemap added; repeated process sections reduced. |
| GEO | 7 | 7 | No unverified entity claims added. |
| Schema | 7 | 7 | No review/product schema added; JSON checked. |
| GDPR | 7 | 7 | Consent code retained; legal text requires human legal review. |
| UX | 6 | 8 | Six-service menu, gallery destination, and quote estimate display fixed. |
| UI | 6 | 8 | Checkbox/radio rows and text wrapping corrected. |
| Content | 7 | 8 | Repeated strategy-process block removed from non-decision pages. |
| Structure | 6 | 8 | Service IA aligned across nav, cards and sitemap checks. |
| Accessibility | 6 | 8 | Keyboard-ready Services disclosure and true input labels retained. |
| Performance | 6 | 7 | Repeated DOM sections removed; gallery uses lazy loading after first row. |
| Security | 7 | 7 | No new secrets introduced; external endpoints need live review. |
| Quote calculator | 5 | 8 | Summary DOM scope fixed and automated checks added. |
| Form submission | 6 | 7 | Submit remains blocked when pricing unavailable; live backend not proven. |
| Overall production readiness | 6 | 8 | P0/P1 screenshot issues fixed with regression checks. |

## Baseline and changed IA
Baseline found process blocks on: contact/index.html, event-photography/index.html, glamour/index.html, portrait/index.html, de-at/kontakt/index.html, de-at/eventfotografie/index.html, de-at/portrait/index.html, de-at/werk/index.html, de-at/fine-art/index.html, hu/portre/index.html, hu/eletmu/index.html, hu/rendezvenyfotozas/index.html, hu/muveszi-fotografia/index.html, hu/kapcsolat/index.html, about/index.html, de-at/brand/index.html, de-at/index.html, hu/brand/index.html, hu/index.html, index.html, lifestyle/index.html. Removed from non-core pages: contact/index.html, event-photography/index.html, glamour/index.html, portrait/index.html, de-at/kontakt/index.html, de-at/eventfotografie/index.html, de-at/portrait/index.html, de-at/werk/index.html, de-at/fine-art/index.html, hu/portre/index.html, hu/eletmu/index.html, hu/rendezvenyfotozas/index.html, hu/muveszi-fotografia/index.html, hu/kapcsolat/index.html. URL filenames were preserved except the requested gallery pages: `/gallery/`, `/hu/gallery/`, `/de-at/gallery/`.

## Screenshot-confirmed UX and functional defects
- **SC-01 / P1 / repeated process block**: Root cause was repeated static section markup across service, contact and profile pages. Fix removed non-essential `strategic-partnership-section` instances from HTML, not by CSS hiding. Test: `node tools/audit-regression.mjs`. Status: fixed.
- **SC-02 / P1 / broken word wrapping**: Root cause was narrow card grids plus inherited aggressive wrapping risk. Fix adds component-level `word-break: normal`, `overflow-wrap: normal`, wider responsive process grid columns and targeted wrapping only for technical strings. Test: `node tools/audit-regression.mjs`. Status: fixed.
- **SC-03 / P0 / quote total stayed €0**: Root cause was `paint()` searching for `[data-estimate-*]` totals only inside the form while the summary card is outside the form. Fix scopes quote summary lookup to the closest quote section/document and fails visibly when pricing is unavailable. Test: `node tools/audit-regression.mjs`. Status: fixed.
- **SC-04 / P1 / checkbox/radio alignment**: Root cause was block labels with inline inputs and inconsistent control alignment. Fix makes `.option-row`, `.category-card`, and consent fields stable grid/flex rows with full-label click targets. Test: CSS static check rejects absolute-positioned checkbox rules. Status: fixed.
- **SC-05 / P1 / six services vs four nav items**: Root cause was flattened main navigation. Fix adds a single Services/ Szolgáltatások / Leistungen disclosure containing the six service links that match home cards. Test: `node tools/audit-regression.mjs`. Status: fixed.
- **SC-06 / P2 / missing selected gallery**: Root cause was `/gallery/` redirecting away and no localized selected-work page. Fix creates three gallery pages from existing assets, adds nav and sitemap entries, and documents curation. Test: gallery image existence and duplicate check. Status: fixed.

## Quote calculator test matrix
Automated regression covers load, default non-zero total, service/category changes, add-on changes, VAT math, hidden payload values, no NaN/negative result, and pricing config availability. Manual live backend success remains not testable without production service verification.

## External dependencies
- Google Apps Script / Cloudflare Worker: static and local frontend checks only; live success/error handling requires endpoint access and mailbox/spreadsheet confirmation.
- Analytics / reviews: static consent-code review only; third-party scripts intentionally load after consent.
- Bookipi / other embeds: not changed; human legal review recommended for processor lists.
