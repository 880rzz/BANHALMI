# Entity Authority Matrix

Checked: 2026-10-31 (Europe/Budapest)

| Entity | Canonical URL / @id | Wikidata | Role | Must not be confused with | Status |
|---|---|---|---|---|---|
| Person — Bánhalmi Norbert / Norbert Banhalmi | `https://www.banhalmiphotography.com/about/` | Q56391118 | Photographer, fine-art author, founder of practice | Organization brand alone | **VERIFIED** |
| Organization — Banhalmi Norbert e.U. / BANHALMI Photography | `https://www.banhalmiphotography.com/#organization` | Q138425941 | Professional photography & visual positioning practice (Vienna–Budapest) | VIPACH, HIPStudio, ART archive | **VERIFIED** |
| Brand surface — BANHALMI Photography | `https://www.banhalmiphotography.com/` | (org-linked) | Commercial services site | ART / Blog | **VERIFIED** |
| Artistic oeuvre — BANHALMI ART | `https://www.banhalmi.art/` / `#website` | person-linked | Exhibitions, books, works, private art commissions | Professional services | **VERIFIED** |
| Editorial — Fotótörténelem / BANHALMI Blog | `https://blog.banhalmi.art/` / `#website` | person author `@id` → about/ | Photo-history & professional essays | Service landing pages | **VERIFIED** (Person `@id` single) |
| EUFÓRIA | ART exhibition page | Q138717398 | Artistic project | Commercial nude service | **VERIFIED** |
| VIPACH | `https://www.vipach.at/` | Q138416887 | Founded by Person; separate org / network hub | BANHALMI Photography | **VERIFIED** founder link |
| HIPStudio | `https://www.hipstudio.hu/` | Q138482177 | Founded by Person historically; distinct entity | Current BANHALMI ownership | **VERIFIED** with ownership guardrail |
| Rege Galéria | `https://www.regegaleria.hu/` | — | Founder/curator/photo-artist roles (evidence-bound) | BANHALMI Photography | **PARTIALLY VERIFIED** |
| OM SYSTEM | partners / about | — | Brand ambassadorship | `memberOf` employment | **PARTIALLY VERIFIED** (must not use `memberOf`) |
| AmCham Austria | yearbook / members-list | — | Business-network membership | Client/endorsement | **VERIFIED** |
| WKO Wien | firmen.wko.at listing | org sameAs | Chamber listing / guild context | Market leadership | **VERIFIED** |

## Service authority (Professional)

| Service | Owner URL EN | HU | DE-AT |
|---|---|---|---|
| Executive / professional portrait | `/portrait/` | `/hu/portre/` | `/de-at/portrait/` |
| Personal brand / visual positioning | `/lifestyle/` | `/hu/brand/` | `/de-at/brand/` |
| Corporate / C-level events | `/event-photography/` | `/hu/rendezvenyfotozas/` | `/de-at/eventfotografie/` |
| Artists & performers (career) | `/fine-art/` | `/hu/muveszi-fotografia/` | `/de-at/fine-art/` |
| Artistic nude enquiry ownership | ART Ébredés | ART HU Ébredés | ART DE Erwachen |

## Required action

1. Keep Person `@id` stable across Professional / ART / Blog.
2. Publish only claim wording from `CLAIM-TO-EVIDENCE-REGISTER.csv`.
3. Visible entity separation on About + `ai.txt` / `llms.txt` for Fotótörténelem (gap closed in this PR).