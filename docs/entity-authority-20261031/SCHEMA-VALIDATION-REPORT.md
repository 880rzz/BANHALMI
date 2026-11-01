# Schema Validation Report

Checked: 2026-10-31 (Europe/Budapest)  
Live Professional SHA: `2951c6ec6f4693e490b2ece8083a6a63a824da30`

## Distinction

| Layer | Meaning | This pass |
|---|---|---|
| Schema.org structural validity | Types/properties match content; stable `@id`; no contradictions | **PASS** on sampled Professional/ART/Blog graphs |
| Google Rich Results eligibility | Subset of schema that may unlock UI enhancements | **NOT VERIFIED** via Rich Results Test UI in this agent — no fabricated PASS |

## Sampled live nodes

| Page | Types observed | Notes | Status |
|---|---|---|---|
| `/` + `/about/` | Person, Organization, WebSite, membership Orgs, VIPACH founder | Person `@id` stable; Wikidata sameAs present | **VERIFIED LIVE** |
| `/portrait/` | Person, Organization, Service | Service names include Executive / C-Level — no Nude Art | **VERIFIED LIVE** |
| `/fine-art/` | Service Artists & Performers | Nude Art removed (prior #130/#131) | **VERIFIED LIVE** |
| `banhalmi.art/` | Person, Organization, WebSite | Person points to Professional about/ | **VERIFIED LIVE** (pre-#328 tip) |
| `blog.banhalmi.art/` | Person, Organization, WebSite (+ Wix LocalBusiness) | Single Person `@id` | **VERIFIED LIVE** |

## Required / optional types

| Type | Use | Finding |
|---|---|---|
| Person | Required | Present, stable `@id` |
| Organization | Required | Present, founder → Person |
| Service | Required on service pages | Present |
| ProfessionalService / LocalBusiness | Only if true | Studio locations via machine-core projections; Blog Wix LocalBusiness residual |
| ProfilePage / AboutPage | Where page is about Person | About page content + Person mainEntity pattern — keep consistent |
| VisualArtwork / ExhibitionEvent | ART only when factual | EUFÓRIA / Ébredés pages — do not mark commercial Service as ExhibitionEvent |
| AggregateRating / Review | Forbidden without evidence | **Not invented** |
| ImageObject | licence + acquireLicensePage | Professional samples complete; ART `#primaryimage` incomplete — see EEAT gaps |

## Actions in this PR

- Documentation of graph + gaps.
- No mass JSON-LD rewrite (avoids conflict with open closure PRs and authority audits).
- Visible copy + LLM surfaces updated for entity separation / methodology (human-readable, not hidden).