# 29 fejezet — követelményállapot

Generálva: 2026-10-27T09:34:57+01:00 Europe/Budapest

**BAN** live/main `328060b76a6511fa79dbaffac17a234454f40464` · **ART** live/main `95a43d602079347c173981e0866fc0a8a641c9d7` · **BLOG** schema exact-one 513/513

Státuszszótár (kizárólag): PRODUCTION-ELLENŐRZÖTT · CI-ELLENŐRZÖTT · JAVÍTOTT · MÉRÉS ALATT · INPUT-NEM-ELÉRHETŐ · OUT_OF_SCOPE · NOT RUN — ENVIRONMENT LIMITATION

| CH | Cím | Státusz | Megjegyzés |
| --- | --- | --- | --- |
| CH01 | Mission/scope/roles | **PRODUCTION-ELLENŐRZÖTT** | Professional / ART / Blog intent ownership élő; BMI kizárva |
| CH02 | Ecosystem entities & URLs | **PRODUCTION-ELLENŐRZÖTT** | BAN/ART/Blog LIVE URL + entity inventory |
| CH03 | Version safety | **PRODUCTION-ELLENŐRZÖTT** | PR→CI→merge→deploy→exact-live lánc ART#307 + BAN tip |
| CH04 | ART sitemap P0 | **PRODUCTION-ELLENŐRZÖTT** | ART sitemap LIVE |
| CH05 | Language/hreflang/canonical | **PRODUCTION-ELLENŐRZÖTT** | BAN+ART+Blog hreflang/canonical PASS |
| CH06 | Blog inventory & service links | **PRODUCTION-ELLENŐRZÖTT** | 513 published; 171 families; service links LIVE; schema exact-one |
| CH07 | Service editorial ↔ blog | **PRODUCTION-ELLENŐRZÖTT** | Editorial↔service routing LIVE |
| CH08 | BMI related presentation | **OUT_OF_SCOPE** | USER_DECISION — BMI nem BANHALMI production feladat |
| CH09 | VIPACH institutional boundary | **PRODUCTION-ELLENŐRZÖTT** | Boundary tip LIVE |
| CH10 | Speier Vikó separation | **PRODUCTION-ELLENŐRZÖTT** | Tip + blog links LIVE |
| CH11 | HIPStudio dates | **PRODUCTION-ELLENŐRZÖTT** | Date boundary tip LIVE |
| CH12 | Ébredés routing | **PRODUCTION-ELLENŐRZÖTT** | exhibitions/ebredes + private-photography LIVE |
| CH13 | Wikidata / Rege P854 | **OUT_OF_SCOPE** | USER_DECISION — további Wikidata szerkesztés nem kért |
| CH14 | Maps three places | **PRODUCTION-ELLENŐRZÖTT** | BAN+ART Place.hasMap 3/3 LIVE; Gersthofer=OFFICE; GBP owner NOT REQUIRED |
| CH15 | Social / LinkedIn | **PRODUCTION-ELLENŐRZÖTT** | Tip LIVE |
| CH16 | Copy/voice | **PRODUCTION-ELLENŐRZÖTT** | Human voice tip LIVE |
| CH17 | Schema / semantic | **PRODUCTION-ELLENŐRZÖTT** | ART Place schema + Wix Blog exact-one 513/513 |
| CH18 | Technical SEO | **PRODUCTION-ELLENŐRZÖTT** | sitemap/robots/canonical/hreflang/OG PASS |
| CH19 | AI Trust | **PRODUCTION-ELLENŐRZÖTT** | Trust locales LIVE |
| CH20 | Consent / GDPR | **PRODUCTION-ELLENŐRZÖTT** | Consent settle PASS; first-party controllable vs 3P platform limitation elkülönítve |
| CH21 | Photohistory hero disclosure | **PRODUCTION-ELLENŐRZÖTT** | #01–#04 hero disclosure 12/12 PASS; #11 Fenton érintetlen; 1 cover family külön INPUT-NEM-ELÉRHETŐ (nem CH21 blocker) |
| CH22 | GSC/Bing 7/14/28 | **MÉRÉS ALATT** | Első checkpoint 2026-11-02 Europe/Budapest; baseline rögzítve; change freeze aktív |
| CH23 | Conversion funnels | **PRODUCTION-ELLENŐRZÖTT** | CTA routing LIVE |
| CH24 | Visual collectors/dock | **PRODUCTION-ELLENŐRZÖTT** | BAN 58×7 + ART visual/CI desktop regression PASS; natív Safari külön: NOT RUN — ENVIRONMENT LIMITATION |
| CH25 | A11y keyboard | **PRODUCTION-ELLENŐRZÖTT** | Keyboard/privacy smoke PASS |
| CH26 | CI/deploy exact-live | **PRODUCTION-ELLENŐRZÖTT** | BAN 328060b76a65… ART 95a43d602079… exact-live PASS |
| CH27 | CSP architecture | **OUT_OF_SCOPE** | USER_DECISION — GitHub Pages accepted; HTTP CSP ABSENT; no CF/DNS |
| CH28 | Docs/contracts | **PRODUCTION-ELLENŐRZÖTT** | Closure docs + evidence pack; PR #66 |
| CH29 | Final closure pack | **PRODUCTION-ELLENŐRZÖTT** | 0 végrehajtható P0/P1; egyetlen aktív ág: GSC/Bing mérés |

## Fejezet-számláló
| Státusz | Darab |
| --- | ---: |
| PRODUCTION-ELLENŐRZÖTT | 25 |
| MÉRÉS ALATT | 1 |
| OUT_OF_SCOPE | 3 |
| INPUT-NEM-ELÉRHETŐ | 0 |
| NOT RUN — ENVIRONMENT LIMITATION | 0 |
| CI-ELLENŐRZÖTT | 0 |
| JAVÍTOTT | 0 |

## Nem fejezet-szintű fennmaradók
| Tétel | Státusz | Indok |
| --- | --- | --- |
| Cover family (1× HU/EN/DE, translationId `03b9e532-…`) | **INPUT-NEM-ELÉRHETŐ** | Nincs bizonyított saját cover/rich asset; site-level OG fallback; ne inventáljunk képet |
| Natív macOS Safari UI | **NOT RUN — ENVIRONMENT LIMITATION** | Nincs macOS Safari host; WebKit PASS ≠ natív Safari PASS |

## Mezőtípusok
- Technikailag teljesített production feladat → PRODUCTION-ELLENŐRZÖTT
- Felhasználói döntéssel lezárt → OUT_OF_SCOPE (CH08/CH13/CH27)
- Időalapú mérés → MÉRÉS ALATT (CH22)
- Input hiány P2 → INPUT-NEM-ELÉRHETŐ (cover family)
- Környezeti okból nem futtatott → NOT RUN — ENVIRONMENT LIMITATION (natív Safari)
