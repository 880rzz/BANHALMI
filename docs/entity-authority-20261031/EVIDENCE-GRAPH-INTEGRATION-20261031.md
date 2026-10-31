# BANHALMI — Existing Evidence Graph Integration

Checked: 2026-10-31 (Europe/Budapest)  
Scope: reuse existing ART + Professional registries; no parallel evidence system.

## Architecture reused (not replaced)

| Layer | Canonical surfaces |
|---|---|
| Identity | Person `…/about/` + Q56391118; Org `#organization` + Q138425941; Brand `#brand` (no WD) |
| Professional evidence | `memberships.json`, `authority-evidence.json`, `press-institutional-evidence.json`, `external-photography-evidence.json`, `service-trust-evidence.json`, `partners.json`, `media-usage-evidence.json`, `transatlantic-evidence.json`, `customer-intent-*`, `data/evidence-routing-manifest.json` |
| ART evidence | `press-source-registry.json`, `master-source-database.json`, `archive-record-registry.json`, `deep-search-evidence.json`, `service-evidence-map.json`, `authority-bridge.json`, `ecosystem-bridge.json`, `data/image-knowledge-graph.jsonld`, `data/video-evidence.json`, EUFÓRIA provenance ledgers |
| Entity-authority pack | This directory (matrix, claim register, schema notes) — extended, not duplicated |

## Evidence inventory (checked counts)

| Type | Count | Source |
|---|---:|---|
| ART press records (×3 locales) | 35 × 3 | `press-source-registry.json` |
| ART archive ExhibitionEvent/Book records | 69 | `archive-record-registry.json` |
| ART master sources | 111 | `master-source-database.json` |
| ART deep-search verified / pending | 20 / 4 | `deep-search-evidence.json` |
| ART video evidence | 33 | `data/video-evidence.json` |
| ART Wikidata entity map | 50 | `wikidata-entity-registry.json` |
| ART IMGKG graph nodes | 6 | `data/image-knowledge-graph.jsonld` |
| Professional memberships | 7 | `memberships.json` |
| Professional partners list items | 29 | `partners.json` |
| Professional press/institutional rows | 11 | `press-institutional-evidence.json` |
| Professional external photography | 21 | `external-photography-evidence.json` |
| Professional newly verified external | 103 | `service-trust-evidence.json` |
| Professional pending candidates | 19 | `service-trust-evidence.json` |
| Professional moving-image | 18 | `service-trust-evidence.json` |
| Claim register rows (after extension) | 18 | `CLAIM-TO-EVIDENCE-REGISTER.csv` |

## Live URL verification (sample)

Automated fetch of **81** registry URLs on 2026-10-31:

| Result | Count |
|---|---:|
| OK (2xx/3xx) | 72 |
| Fail / blocked | 9 (unique issues below after locale de-dupe) |

### Checked OK (identity / authority cores)

Person Wikidata, Org Wikidata, Professional About, ART home, Ébredés, private photography, authority-evidence, authority-bridge, memberships, press-source-registry, service-evidence-map, service-trust-evidence, WKO `firmaid=12bd142c…`, AmCham members list, Commons EUFÓRIA category — all **200**.

### Failures / access notes (not inventing replacements)

| Item | Observation | Action taken |
|---|---|---|
| WKO firmaid `2ac00da5…` vs `12bd142c…` | Both resolve with browser UA; registries were split | Unified Professional references to canonical `12bd142c…` (matches partners/docs) |
| ART `press-09` mindennapkonyv.hu | Host unresolved (URLError) | `sourceQuality` → `archived-exact-source`; ART `#press-09` archive retained (EN/HU/DE) |
| ART `press-08` veol.hu | Automated fetch **403**; Wayback snapshot exists | Kept exact-source URL; publicationNote records bot-block + archive availability |
| deep-search `jazzy-dr-jazzy-2024` | jazzy.hu path **404** | Primary URL → live Podiverzum corroborating mirror; jazzy URL kept as corroborating |
| deep-search `magyarvelemeny-review-aggregation` | Automated **403** | Retained with existing review-aggregation guardrail + liveAccessNote |

## Relationship typing preserved

CLAIM → EVIDENCE → SOURCE → ENTITY → CANONICAL PAGE remains registry-driven (anchors / IDs), not a new claim graph product.

Distinctions enforced (unchanged policy):

- publication / photo credit ≠ client
- membership ≠ endorsement
- ambassadorship ≠ ordinary membership
- founder ≠ current ownership
- review aggregation ≠ editorial authority
- intimate / boudoir ≠ artistic nude enquiry owner
- ART oeuvre ≠ Professional executive service

## Positioning precision (existing systems)

| Intent | Owner | Evidence / route surface |
|---|---|---|
| Executive visual positioning / headshots / branding / C-level events | BANHALMI Photography | services + authority-evidence + service-trust |
| Fine-art nude / Ébredés | BANHALMI ART | Ébredés pages + artisticIntentProjection + deep-search classifications |
| Intimate portraiture / artistic boudoir | BANHALMI ART | private-photography pages + customer-intent routing + claim register additions |

`customer-intent-evidence.json` artisticPhotography answerRequirements updated to match intent-split ART routing (no mass Ébredés redirect; no corporate misclassification).

## Schema / sameAs

- No new JSON-LD blocks introduced.
- No blanket `sameAs` expansion.
- ART `authority-bridge` books pointer corrected from non-existent `/books.html` → `/#books`.

## HU / EN / DE

- ART press registry remains 35-record parity across EN/HU/DE; quality/notes for press-08/09 updated in all three locales.
- Intimate/nude/professional ownership claims added once in the claim register (language-neutral IDs) with EN publishable wording; localized page owners remain the three ART/Pro locale trees.

## Production exact-live

| Surface | Status at check |
|---|---|
| Professional identity / evidence JSON endpoints | Live 200 |
| ART authority / press / private / Ébredés | Live 200 |
| Intimate-entity ART PR #329 | Sitemap freshness fix pushed; CI re-check pending |
| This integration branch | Pending deploy after CI/merge |

Only items above with live or registry-verified status are marked VERIFIED. Bot-blocked or host-unresolved sources remain documented, not claimed as freshly live.

## Explicit non-done

- Full crawl of all 103 newlyVerifiedExternalEvidence URLs (sampled via related registries instead).
- Adding Azahriah IMGKG node without a verified image metadata ledger entry.
- Creating a new evidence database or claim graph product.
- Declaring GDPR legal review complete (remains human legal ownership).


## Follow-up from evidence + schema inventory (2026-11-01)

Open gaps recorded for later targeted remediation — **not** fixed in this PR (would require cross-page JSON-LD harden coordination):

1. **Person `sameAs` drift** — Professional HTML includes Cherrydeck; ART HTML uses Instagram/LinkedIn/Facebook/YouTube. Keep identity `sameAs` limited to true identity sources; social profiles should stay typed (e.g. `sameAs` vs `subjectOf` / contact authority) per existing contracts.
2. **Founder/affiliation graph asymmetry** — Professional home/about expand VIPACH (Q138416887), HIPStudio (Q138482177), Rege (Q138414682); ART pages currently affiliation OM SYSTEM only. Prefer shared harden projection over page-by-page duplication.
3. **`memberOf` placement tension** — HTML Person graphs list AmCham/WKO; some machine contracts assign chamber membership to Organization. Resolve in one authority pass; do not invent a second membership registry.
4. **Blog dual Person `@id`** — master-audit notes `norbertbanhalmi.com/about/` alongside photography about `@id` (blog property). Out of scope for ART/Professional HTML in this PR.
5. **Claim confidence corrections** — `C-1999-PRACTICE`, `C-VIPACH-FOUNDER`, `C-HIPSTUDIO` downgraded to PARTIALLY VERIFIED; `C-OM-SYSTEM` upgraded to VERIFIED with MILC Club / Bridges citations. Network ~50 remains PARTIALLY VERIFIED (first-party wording only).

No parallel evidence system was added.
