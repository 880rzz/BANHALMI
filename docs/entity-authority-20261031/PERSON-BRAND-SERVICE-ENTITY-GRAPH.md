# Person–Brand–Service Entity Graph

Checked: 2026-10-31 (Europe/Budapest)

```
Person (Q56391118)
  @id https://www.banhalmiphotography.com/about/
  ├── worksFor → Organization (#organization, Q138425941)  [BANHALMI Photography]
  ├── founder → Organization (#organization)
  ├── founder → VIPACH (Q138416887)                        [separate]
  ├── founder → HIPStudio (Q138482177)                     [historical; ownership guardrail]
  ├── memberOf → AmCham Austria / WKO guild / MFVSZ / Pannon Fényképészkör
  ├── affiliation (NOT memberOf) → OM SYSTEM ambassadorship
  ├── creator → BANHALMI ART works / exhibitions / books
  ├── creator → EUFÓRIA (Q138717398)
  ├── creator → Péter Magyar portrait 2026 (Commons CC BY-SA 4.0)
  └── author → Fotótörténelem BlogPosting nodes

Organization (#organization)
  ├── offers → Service nodes on /portrait /lifestyle /event-photography /fine-art
  ├── areaServed → Vienna, Budapest (+ agreed worldwide)
  └── sameAs → Wikidata Q138425941, WKO, company LinkedIn, domain aliases

BANHALMI ART WebSite
  ├── about → Person
  ├── mainEntity → artistic archive
  └── bridges → Professional only where commercial routing is intentional

Fotótörténelem WebSite
  ├── author/Person @id → Professional about/
  └── editorial independence preserved (no mass service redirects)
```

## Relationship vocabulary (non-interchangeable)

| Relation | Use when | Example |
|---|---|---|
| `founder` | Entity creation by Person | VIPACH, HIPStudio, Banhalmi Norbert e.U. |
| `memberOf` | Formal membership | AmCham, WKO guild, MFVSZ |
| `worksFor` | Employment / practice role | Person → Organization |
| `creator` / photographer | Authorship of work | Portrait, exhibitions |
| `collaborator` / partner | Non-ownership cooperation | Partner photographers, Viko Speier liaison |
| `curator` | Exhibition curation | Rege Galéria (evidence-bound) |
| `publisher` | Publishing of editorial | Blog / books |

## Schema observations (live Professional tip `2951c6ec`)

- Person `@id` consistent on Professional, ART, Blog home.
- Organization founder correctly points to Person.
- VIPACH founder node present with Wikidata `@id`.
- OM SYSTEM appears as Organization node / partner evidence — **must not** be serialized as Person `memberOf` (enforced by `audit-musk-ecosystem-stage39.mjs`).
- Blog still emits a secondary Wix `LocalBusiness` block alongside canonical graph — monitored; do not invent a second Person `@id`.