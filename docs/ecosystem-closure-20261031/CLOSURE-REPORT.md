# BANHALMI final production closure — 2026-10-31 / 2026-11-01

Timezone: Europe/Budapest. Only checked results are marked VERIFIED.

## Exact-live

| Surface | Expected | Observed | Status |
|---|---|---|---|
| Professional `deployment-sha.txt` | `2951c6ec…` (#131 merge) | `2951c6ec6f4693e490b2ece8083a6a63a824da30` | **VERIFIED LIVE** |
| Professional main tip | same | `2951c6ec…` | Match |
| ART `deployment-sha.txt` | `208ea219…` (#328 merge tip) | `868b3c3503de7f3ee15f1fa9071dbe5c4ab2f7e6` | **PENDING DEPLOY** (re-checked ~00:15 CET) |
| ART main tip | `208ea219a233b2b79215573744d9e7ae7a9a747c` | tip ahead of live | Pages deploy `41249222601` still `in_progress` (~35+ min; historical ~58 min) |
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

### ART slogan / presence voice

Live ART still on `868b3c35…`. Homepages currently show “Anatomy of Presence” family copy. Lifelong slogan from #328 requires deploy of `208ea219…` — **PENDING**.

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

- ART intimate entity #329, evidence graph #330
- Professional evidence graph #136 (includes entity-authority pack); Vercel redirect aliases fail on build-rate-limit only
- Intimate Pro handoff #135

## Blockers

1. **ART production deploy** of `208ea219…` still in progress / live SHA lag.
2. **GSC measurement** blocked without export credentials.
3. **GDPR** requires human legal review.
4. **ART primaryimage licence metadata** still open.
