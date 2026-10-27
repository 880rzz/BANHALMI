# 29 fejezet — követelményállapot

Generálva: 2026-10-27T08:58:00+01:00 Europe/Budapest

Frissítés: ART #307 hasMap **PRODUCTION-ELLENŐRZÖTT**; Wix schema exact-one **513/513 PRODUCTION-ELLENŐRZÖTT**; GSC/Bing **MÉRÉS ALATT**; BMI **OUT_OF_SCOPE**; Wikidata/CSP **USER_DECISION**; Cover 1 family **INPUT-NEM-ELÉRHETŐ**; Native Safari **NOT RUN**.

| CH | Cím | Státusz | Megjegyzés |
| --- | --- | --- | --- |
| CH01 | Mission/scope/roles | **CLOSED** | Professional/ART/Blog; BMI excluded |
| CH02 | Ecosystem entities & URLs | **CLOSED** | LIVE inventory |
| CH03 | Version safety | **CLOSED** | PR→CI→merge |
| CH04 | ART sitemap P0 | **CLOSED** | LIVE 87 URLs |
| CH05 | Language/hreflang/canonical | **CLOSED** | Final integrity seoSampleOk |
| CH06 | Blog inventory & service links | **CLOSED** | Portrait/RGB/VIPACH/team/event LIVE links |
| CH07 | Service editorial ↔ blog | **CLOSED** | Tip FIX |
| CH08 | BMI related presentation | **OUT_OF_SCOPE** | BMI excluded — not an unresolved BANHALMI production defect |
| CH09 | VIPACH institutional boundary | **CLOSED** | Boundary tip |
| CH10 | Speier Vikó separation | **CLOSED** | Tip + blog links |
| CH11 | HIPStudio dates | **CLOSED** | Tip |
| CH12 | Ébredés routing | **CLOSED** | LIVE |
| CH13 | Wikidata / Rege P854 | **USER_DECISION_ACCEPTED** | További külső szerkesztés nem kért — felhasználói döntés. Nem agent által végrehajtott / függetlenül igazolt WD-javítás. Saját oldali WD-hivatkozások megőrizve. |
| CH14 | Maps three places | **CLOSED** | Három külön ellenőrzés: (1) contract googleBusinessProfile PASS; (2) látható Maps-link PASS; (3) Schema Place.hasMap korábban ABSENT → tip-branchban pótolva (BAN#65/ART#307), production deploy függő. Gersthofer nem stúdió. Bizonyíték: LOCATIONS_WEB_BINDING_VERIFY.json |
| CH15 | Social / LinkedIn | **CLOSED** | Tip |
| CH16 | Copy/voice | **CLOSED** | Tip |
| CH17 | Schema / semantic | **CLOSED** | Tip + LIVE places |
| CH18 | Technical SEO | **CLOSED** | Integrity pack PASS |
| CH19 | AI Trust | **CLOSED** | Trust locales LIVE |
| CH20 | Consent / GDPR | **CLOSED** | Final recheck allCritical PASS; settle may show brief Clarity/GA in-flight; 3P cookies residual ≠ active first-party tracking |
| CH21 | Photohistory hero disclosure | **AWAITING_CONTENT_APPROVAL** | #01–#04 kiállítótéri hero illusztráció-megjelölés; konkrét HU/EN/DE javaslat + jóváhagyási kérdés: PHOTOHISTORY_HERO_APPROVAL_PROPOSAL.json. #11 Fenton HU képhasználat már kész. |
| CH22 | GSC/Bing 7/14/28 | **PENDING_MEASUREMENT** | Első checkpoint 2026-11-02 Europe/Budapest; baseline ART/BAN tip SHA + Wix CH06 2026-10-26. Nincs lefutott mérés. |
| CH23 | Conversion funnels | **CLOSED** | CTA LIVE |
| CH24 | Visual collectors/dock | **CLOSED** | Chromium+WebKit visual PASS. Natív macOS Safari UI: ENVIRONMENT_NOT_RUN (külön jelölve; WebKit ≠ natív Safari). |
| CH25 | A11y keyboard | **CLOSED** | Chromium+WebKit keyboard PASS |
| CH26 | CI/deploy exact-live | **CLOSED** | ART/BAN tip=LIVE; CI success on tip |
| CH27 | CSP architecture | **USER_DECISION_ACCEPTED** | Felhasználói döntés: jelenlegi GitHub Pages architektúra marad. HTTP CSP továbbra is ABSENT (tény). Meta-CSP ≠ HTTP CSP. Nincs CF/DNS/migráció. Consent/tracking működése megőrizve. |
| CH28 | Docs/contracts | **CLOSED** | Preserved |
| CH29 | Final closure pack | **CLOSED** | Statuses remapped; evidence refreshed this run |

## Mezőtípusok
- Technikailag megvalósult és ellenőrzött: CLOSED
- Elfogadott architektúrakorlát / felhasználói döntéssel elhagyott módosítás: USER_DECISION_ACCEPTED (CH13 WD, CH27 CSP/Pages)
- Valódi fennmaradó tartalmi feladat: AWAITING_CONTENT_APPROVAL (CH21)
- Későbbi mérés: PENDING_MEASUREMENT (CH22)
- Környezeti okból nem futtatott: natív Safari UI (CH24 megjegyzés; WebKit PASS)
- OUT_OF_SCOPE: CH08 BMI
