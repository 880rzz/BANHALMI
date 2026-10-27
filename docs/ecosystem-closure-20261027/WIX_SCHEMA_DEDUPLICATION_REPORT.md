# WIX_SCHEMA_DEDUPLICATION_REPORT

Generálva: 2026-10-27T08:58:00+01:00 Europe/Budapest  
Site: Bánhalmi Norbert (`5bfb58f7-cf3f-4eee-acbd-b8fcac6b217b`)  
Host: https://blog.banhalmi.art/

## Cél
Minden published poston **pontosan 1** enabled primary `Article`/`BlogPosting` (resolvedTags, `disabled !== true`).

## Before
| Enabled primary count | Posts |
| ---: | ---: |
| 1 | 44 |
| 2 | 451 |
| 3 | 18 |
| **Összesen** | **513** |

## Root cause
1. Wix default BLOG_POST pattern → BlogPosting  
2. Item-level custom `#article` BlogPosting (enrichment)  
3. Néhány authority bridge hibásan BlogPosting típussal → 3 primary  

## Stratégia (empirikus, canary PASS)
**`item_disabled_suppressor_for_pattern_BlogPosting`**

- Megtartani az item `#article` BlogPosting enrichmentet  
- Item-szinten hozzáadni a pattern BlogPosting másolatát: `disabled: true` + `meta.schemaType: "blog-post-blog-posting-preset"`  
- Ez elnyomja a pattern primaryt az adott oldalon; a `#article` marad az egyetlen enabled primary  

### Elutasított
- Item BlogPosting törlése → `inLanguage` elveszett (rollback)  
- Globális default pattern kikapcsolás → a default-only postok 0 primaryra estek volna  
- Pattern Set WebSite override → default BlogPosting megmaradt  

### Kritikus szabály
A élő `#article` node **nem** kaphat `schemaType: blog-post-blog-posting-preset`-et. Ha igen, a disabled suppressor a resolved rétegen kinullázza (Vivian Maier HU).

## Canary
Family **06.17** / translationId `57426458-abfc-47ac-9cc4-15b71c009251`  
Evidence: `WIX_SCHEMA_CANARY_0617_BEFORE.json`, `WIX_SCHEMA_CANARY_0617_RESULT.json`  
API + live HTML HU/EN/DE: primaryCount=1, title/canonical/hreflang/OG megőrizve.

## Bulk
- Chunk ≤ 20 (BLOG_POST bulk limit)  
- Minden entry: GET teljes tags → modify → SET teljes megtartandó készlet  
- A-default-only (korábban 14): előbb item BlogPosting, aztán suppressor  
- Fireworks HU/EN: MAX_TAG_BYTES → minimal suppressor + HowTo drop ahol szükséges  

## Outlier fix (lezáró)
| Post | Before | After | Fix |
| --- | ---: | ---: | --- |
| Vivian Maier HU `80eb6cd7-790c-40a5-9378-baba03b1bfdd` | 0 | 1 | strip preset schemaType from `#article` |

Live HTML primary count: HU=1, EN=1, DE=1.

## After (List Item SEO Tags, 513/513)
| Metric | Count |
| --- | ---: |
| enabled primary = 1 | **513** |
| enabled primary ≠ 1 | **0** |
| resolved title | 513 |
| resolved description | 513 |
| resolved canonical | 513 |
| resolved OG title | 513 |
| resolved OG description | 513 |
| resolved OG image | 513 |
| hreflang HU/EN/DE/x-default | 513 |
| published posts | 513 |
| translation families | 171 |
| incomplete families | 0 |
| unpublished changes | 0 |

## Cover / image P2
1 translation family (3 post) saját cover/rich image nélkül; OG site-level fallback assetre mutat.

- HU/EN/DE: „Van mikor semmi nem úgy alakul…” family (`03b9e532-4182-4d72-a846-8f3fde494e6c`)  
- Státusz: **INPUT-NEM-ELÉRHETŐ** (nincs bizonyított saját asset; nem inventálunk képet)  
- Nem blokkolja a schema P1 lezárást.

## Státusz
**PRODUCTION-ELLENŐRZÖTT** — schema exact-one 513/513 resolved + Vivian live HTML.
