# BANHALMI ecosystem — schema / identity audit (live)

**Audited:** 2026-10-31 (UTC) · **Method:** HTTP fetch of public HTML, `application/ld+json` parse · **Repos:** not modified

## Scope

Live JSON-LD on:

- `banhalmiphotography.com` (/, `/about/`, `/portrait/`)
- `banhalmi.art` (/, `exhibitions/ebredes.html`, HU + DE-AT ebredes)
- `blog.banhalmi.art` (home + EN post sample)
- `norbertbanhalmi.com` (/, `/about/`) — cross-domain Person `@id` check

Machine-readable graph: `/tmp/master-audit/schema-entity-graph.json`

---

## Wikidata verification (requested Q IDs)

| Q ID | Live entity JSON | EN label (sample) | Status |
|------|------------------|-------------------|--------|
| Q56391118 | OK | Norbert Banhalmi | **Verified** |
| Q138425941 | OK | Norbert Banhalmi e.U. | **Verified** |
| Q138717398 | OK | Euphoria – The Anatomy of Presence | **Verified** |

All three return labels/descriptions via `Special:EntityData/*.json`.

**Placement note:** Q138717398 appears in live schema as `sameAs` on `VisualArtwork` at `banhalmi.art/exhibitions/euforia.html#artwork`, not on the three `ebredes` `ExhibitionEvent` nodes (no `sameAs` there).

---

## Entity spine (condensed)

| Type | Primary `@id` | `name` | `sameAs` (high level) | `email` |
|------|---------------|--------|------------------------|---------|
| **Person** | `https://www.banhalmiphotography.com/about/` (dominant) | Bánhalmi Norbert | Q56391118 + hu.wikipedia (+ social set varies) | `mailto:hello@norbertbanhalmi.com` |
| **Person (alt)** | `https://www.norbertbanhalmi.com/about/` | Bánhalmi Norbert | Q56391118 + hu.wikipedia | (often omitted on blog) |
| **Organization** | `https://www.banhalmiphotography.com/#organization` | Banhalmi / Bánhalmi Norbert e.U. | Q138425941 (+ WKO on some pages) | `hello@norbertbanhalmi.com` on some graphs |
| **Organization (alt)** | `https://www.norbertbanhalmi.com/#organization` | BANHALMI | Q138425941 on blog block | — |
| **WebSite** | `…/banhalmiphotography.com/#website` | BANHALMI \| Norbert Banhalmi | — | — |
| **WebSite** | `…/banhalmi.art/#website` | BANHALMI ART | — | — |
| **WebSite** | `…/blog.banhalmi.art/#website` | BANHALMI Blog | — | — |
| **ExhibitionEvent** | locale `…/ebredes.html#exhibition` | localized “Awakening / Ébredés / Erwachen” titles | **none** | — |
| **VisualArtwork** | `…/euforia.html#artwork` | EUFÓRIA — The Anatomy of Presence | **Q138717398** | — |
| **Service** | portrait fragments + ebredes `#artistic-nude-photography` | localized service names | — | — |

---

## P0 — fix immediately (identity)

1. **Dual Person `@id` on blog home** — `blog.banhalmi.art` publishes both `https://www.banhalmiphotography.com/about/` and `https://www.norbertbanhalmi.com/about/` as `Person` for the same individual (Q56391118).
2. **Duplicate Organization `@id` for one business** — Same blog page ties Q138425941 to both `banhalmiphotography.com/#organization` (legal e.U. name) and `norbertbanhalmi.com/#organization` (brand “BANHALMI”).

## P1 — high priority (identity closure)

1. **norbertbanhalmi.com does not own Person `@id`** — Live pages on `norbertbanhalmi.com` still canonicalize the person to `banhalmiphotography.com/about/` (only blog uses the local `/about/` URI as a second node).
2. **`sameAs` drift** — Social and portfolio links differ between art/ebredes (full set), photography hub (cherrydeck), and blog (minimal).
3. **Organization naming / email format** — “Banhalmi” vs “Bánhalmi” e.U.; mixed `mailto:` vs bare email on Organization.
4. **Q138717398 vs ebredes** — Verified Wikidata item not linked from ebredes exhibition JSON-LD; linked only from euforia artwork (confirm whether ebredes needs its own Q ID or should reference Q138717398).

## P2 — medium

- Blog homepage: **6** JSON-LD blocks with overlapping WebSite/Person/Organization declarations.
- `/portrait/` includes **Person** node for Q124488292 (Péter Magyar) — valid as subject/testimonial but adds a third Person `@id` on that URL.

## P3 — low

- Multiple JSON-LD scripts on commercial homepages (payload / maintenance, not invalidity).

---

## Cross-site Person `@id` verdict

| Host | Person `@id` in JSON-LD |
|------|-------------------------|
| banhalmiphotography.com | `https://www.banhalmiphotography.com/about/` |
| banhalmi.art (+ ebredes locales) | `https://www.banhalmiphotography.com/about/` |
| norbertbanhalmi.com | `https://www.banhalmiphotography.com/about/` (not local domain) |
| blog.banhalmi.art | **Both** photography and norbertbanhalmi `/about/` URIs |

**Conflict:** Yes — blog introduces a split; otherwise ecosystem consistently points at the photography `/about/` URI even when served from `norbertbanhalmi.com`.


## Inventory snapshot (2026-10-31)

- Professional sitemap: 57 URLs — all HTTP 200
- ART sitemap: 87 URLs — all HTTP 200
- Blog nested sitemaps: 546 URLs — all HTTP 200
- Total inventoried: **690**

## Domain migration

- Apex `banhalmiphotography.com` → www 301
- Former `norbertbanhalmi.com` → photography path 308 (sample)
- **P0:** `/privacy/` destination 404 until alias PR deploys
- Blog `/ai.txt` 301 → photography `/ai.txt` 200

## Schema / entity

- Wikidata Q56391118, Q138425941, Q138717398 verified live
- Professional Person `@id` = `https://www.banhalmiphotography.com/about/`
- Blog home dual Person/Org `@id` remediated via STATIC_PAGE SEO tags (live cache pending)

## Artistic nude ownership

- Ébredés EN/HU/DE self-canonical with reciprocal hreflang
- Professional fine-art Service schema nude categories removed in audit branch
- Do **not** 301 historical Fotótörténelem akt essays to Ébredés
