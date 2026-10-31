# BANHALMI final production closure — 2026-10-31 / 2026-11-01

Timezone: Europe/Budapest. Only checked results are marked VERIFIED.

## Exact-live

| Surface | Expected | Observed | Status |
|---|---|---|---|
| Professional `deployment-sha.txt` | `2951c6ec…` (#131 merge) | `2951c6ec6f4693e490b2ece8083a6a63a824da30` | **VERIFIED LIVE** |
| Professional main tip | same | `2951c6ec…` | Match |
| ART `deployment-sha.txt` | `208ea219…` (#328 merge tip) | `208ea219a233b2b79215573744d9e7ae7a9a747c` | **VERIFIED LIVE** (2026-11-01 ~00:36 CET) |
| ART main tip | `208ea219a233b2b79215573744d9e7ae7a9a747c` | match | Pages deploy `41249222601` **success** |
| ART deploy #327 (`81ddf89e`) | success | **cancelled** | Superseded by #328 merge deploy |

### Professional service titles/descriptions (live 2026-11-01 ~00:12 CET)

| Route | Title | Meta description |
|---|---|---|
| `/portrait/` | Executive Portrait & Headshots \| Vienna–Budapest \| BANHALMI | Professional and executive portrait photography… |
| `/hu/portre/` | Portréfotózás Budapest & Bécs \| Üzleti és executive \| BANHALMI | Portréfotózás Budapesten és Bécsben… |
| `/de-at/portrait/` | Portraitfotografie Wien & Budapest \| Executive & Headshots \| BANHALMI | Professionelle Portraitfotografie… |
| `/lifestyle/` | Personal Brand Photography \| Vienna–Budapest \| BANHALMI | Personal brand photography… |
| `/hu/brand/` | Brandfotózás Budapest & Bécs \| Személyes márka \| BANHALMI | Brandfotózás Budapesten és Bécsben… |
| `/de-at/brand/` | Personal Brand Fotografie Wien & Budapest \| BANHALMI | Personal Brand Fotografie… |
| `/event-photography/` | C-Level Event Photography \| … \| BANHALMI | Event photographer in Budapest and Vienna… |
| `/hu/rendezvenyfotozas/` | Rendezvényfotózás Budapest & Bécs \| … | Rendezvényfotózás… |
| `/de-at/eventfotografie/` | Eventfotografie Wien & Budapest \| … | Eventfotografie und Konferenzfotografie… |

**Status:** EN/HU/DE service-owner titles + descriptions **VERIFIED LIVE** on Professional for portrait / brand / event.

### ART slogan / presence voice (live 2026-11-01 ~00:36 CET)

| Locale | Lifelong slogan checked | Status |
|---|---|---|
| EN `/` | Searching for presence my whole life | **VERIFIED LIVE** |
| HU `/hu/` | Egész életemben a jelenlétet kerestem | **VERIFIED LIVE** |
| DE `/de-at/` | Ein Leben lang auf der Suche nach Präsenz | **VERIFIED LIVE** |

Archive “Anatomy of Presence” family wording may still appear as oeuvre/title context alongside the lifelong slogan — not treated as a deploy failure.

## GSC 28/90

Fresh Query×Page×Country export: **BLOCKED** (no GSC API/Wizard export in this agent). Prior settled matrix remains in `data/search-authority-master-matrix.json` and `docs/gsc-service-seo-priorities-20261031/`. No ranking improvement claimed.

## Image licence

- Professional samples: licence + acquireLicensePage present on audited samples (see entity-authority SCHEMA / EEAT reports).
- ART `#primaryimage` licence + acquireLicensePage: **OPEN** gap (EEAT Trustworthiness).
- Full inventory: `docs/ecosystem-closure-20261027/image-rights-20261027/`.

## GDPR — HUMAN LEGAL REVIEW

Not closed by agent. Open for human counsel:

1. Consent copy / storage / revoke UX parity EN/HU/DE
2. Privacy policy controller/processor completeness vs live processors (GA4, Clarity)
3. Cross-border transfer language (AT/HU + US processors)
4. ART vs Professional dual-site controller statements
5. Image publication / model-release vs promotional reuse wording

## Wix / Fotótörténelem → Ébredés

Sampled live:

- Category `aktfotozas-muveszi-szemmel`: multiple `banhalmi.art…ebredes` references (**VERIFIED LIVE**, contextual)
- EN post psychology of artistic nude: Ébredés refs present (**VERIFIED LIVE**)
- No auto-redirect of all akt essays to Ébredés (policy retained)

## Related open PRs (not required for this baseline)

- ART intimate entity #329, evidence graph #330, content-edge inset #331
- Professional evidence graph #136 (includes entity-authority pack); Vercel redirect aliases fail on build-rate-limit only
- Intimate Pro handoff #135; content-edge inset #137

## Blockers

1. **GSC measurement** blocked without export credentials.
2. **GDPR** requires human legal review.
3. **ART primaryimage licence metadata** still open.
