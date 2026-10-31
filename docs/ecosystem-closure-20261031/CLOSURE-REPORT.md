# BANHALMI ecosystem — final execution & production closure

**Generated:** 2026-10-31 23:39 Europe/Budapest  
**Scope:** `880rzz/BANHALMI`, `880rzz/ART` · Professional / ART / Fotótörténelem  
**Method:** Re-verified against live production and GitHub; no re-audit of completed inventory work.  
**Isolation:** Workspace limited to BANHALMI + ART; Bécsi Szelet editor config / skills / `openai.yaml` not used.

---

## 1. PR final states

| Repo | PR | State | Merge / head SHA | Notes |
|---|---|---|---|---|
| BANHALMI | [#130](https://github.com/880rzz/BANHALMI/pull/130) | **MERGED** | `3079cca848f0d3b2900a14cb5e8fa3556e90aaaf` | Privacy stubs, Ébredés intent ownership, evidence pack |
| BANHALMI | [#131](https://github.com/880rzz/BANHALMI/pull/131) | **MERGED** | `2951c6ec6f4693e490b2ece8083a6a63a824da30` | GSC service SEO titles/meta, Ébredés handoff contract |
| BANHALMI | [#129](https://github.com/880rzz/BANHALMI/pull/129) | **CLOSED** | — | Superseded by #130 (privacy equity included there) |
| ART | [#327](https://github.com/880rzz/ART/pull/327) | **MERGED** | `81ddf89e158022aeed83420082fd55661bdbcff4` | ImgKG Person + ImageObject audit alignment |
| ART | [#328](https://github.com/880rzz/ART/pull/328) | **MERGED** | `208ea219a233b2b79215573744d9e7ae7a9a747c` | Slogan EN/HU/DE; required CI green including desktop-regression |

**Main tips (git):**

- BANHALMI `main`: `2951c6ec6f4693e490b2ece8083a6a63a824da30`
- ART `main`: `208ea219a233b2b79215573744d9e7ae7a9a747c`

---

## 2. Required CI (merge-relevant)

| Surface | Evidence | Result |
|---|---|---|
| BANHALMI #130 / #131 | Wikidata + migration integrity, event gallery integrity, Vercel redirect statuses | **SUCCESS** |
| BANHALMI #131 deploy | Actions run `41247984373` → **success** | **SUCCESS** |
| ART #327 | Audit / live-links / palette / PageSpeed on merge | **SUCCESS** (deploy still in progress at report time) |
| ART #328 | audit, live-links, lighthouse-mobile, desktop-regression all **pass** (desktop ~41m) before merge | **SUCCESS** → merged |

No merge performed on failing CI. No direct `main` commits.

---

## 3. Production deployment SHAs

| Surface | Probe | Observed SHA | vs main tip | Status |
|---|---|---|---|---|
| Professional | `https://www.banhalmiphotography.com/deployment-sha.txt` | `2951c6ec6f4693e490b2ece8083a6a63a824da30` | matches #131 merge | **VERIFIED LIVE** |
| ART | `https://www.banhalmi.art/deployment-sha.txt` | `868b3c3503de7f3ee15f1fa9071dbe5c4ab2f7e6` (pre-#327/#328 at first probe) | behind `208ea219…` | **MERGED — LIVE NOT VERIFIED** until Pages deploy for #327+#328 tip |
| Blog | Wix | N/A (not git SHA) | — | Entity / Ébredés link regression below |

Earlier reported SHAs (`c36177d9`, `868b3c35`) treated as historical only. Professional tip moved; ART tip still on pre-#327 until deploy finishes.

---

## 4. Exact-live URL checks (Professional @ `2951c6ec`)

| URL | HTTP | Checked | Result | Status |
|---|---|---|---|---|
| `/deployment-sha.txt` | 200 | SHA == `2951c6ec…` | match | **VERIFIED LIVE** |
| `/privacy/` | 200 | Stub + canonical → `/privacy-policy/` | present | **VERIFIED LIVE** |
| `/privacy-policy/` | 200 | Privacy content; `hello@norbertbanhalmi.com`; hreflang EN/DE-AT/HU | ok | **VERIFIED LIVE** |
| `/hu/adatvedelem/` | 200 | HU privacy + hreflang | ok | **VERIFIED LIVE** |
| `/de-at/datenschutz/` | 200 | DE privacy + hreflang | ok | **VERIFIED LIVE** |
| `/fine-art/` (+ HU/DE) | 200 | Service JSON-LD; **no Nude Art** category | nude=false | **VERIFIED LIVE** |
| `/portrait/` | 200 | Title *Executive Portrait & Headshots…*; meta; canonical; hreflang | ok | **VERIFIED LIVE** |
| `/hu/portre/` | 200 | *Portréfotózás… Üzleti és executive*; meta; hreflang | ok | **VERIFIED LIVE** |
| `/de-at/portrait/` | 200 | *Portraitfotografie… Executive & Headshots*; meta | ok | **VERIFIED LIVE** |
| `/lifestyle/` | 200 | *Personal Brand Photography…* | ok | **VERIFIED LIVE** |
| `/hu/brand/` | 200 | *Brandfotózás… Személyes márka* | ok | **VERIFIED LIVE** |
| `/de-at/brand/` | 200 | *Personal Brand Fotografie…* | ok | **VERIFIED LIVE** |
| `/event-photography/` | 200 | *C-Level Event Photography…* | ok | **VERIFIED LIVE** |
| `/hu/rendezvenyfotozas/` | 200 | *Rendezvényfotózás… C-Level* | ok | **VERIFIED LIVE** |
| `/de-at/eventfotografie/` | 200 | *Eventfotografie… C-Level* | ok | **VERIFIED LIVE** |
| `norbertbanhalmi.com/privacy/` | 308→200 | path-to-path → photography `/privacy/` | ok | **VERIFIED LIVE** |
| `norbertbanhalmi.com/portrait/` | 308→200 | → `/portrait/` | ok | **VERIFIED LIVE** |
| `norbertbanhalmi.com/fine-art/` | 308→200 | → `/fine-art/` | ok | **VERIFIED LIVE** |
| `banhalminorbert.hu/hu/portre/` | 308→200 | → `/hu/portre/` | ok | **VERIFIED LIVE** |

Mobile/desktop layout: covered by production deploy exhaustive browser QA + Lighthouse gates on #131 (run `41247984373` success). Spot HTTP checks above; full visual matrix **NOT VERIFIED** in this agent session beyond deploy gate.

---

## 5. Exact-live URL checks (ART — current tip `868b3c35`)

| URL | HTTP | Checked | Result | Status |
|---|---|---|---|---|
| `/deployment-sha.txt` | 200 | still `868b3c35…` | behind main | **MERGED — LIVE NOT VERIFIED** for #327 |
| `/`, `/hu/`, `/de-at/` | 200 | canonical + hreflang; professional bridge links | ok | **VERIFIED LIVE** (pre-slogan tip) |
| Hero slogan EN/HU/DE | — | expected after #328 deploy (`Searching for presence…` / `Egész életemben a jelenlétet kerestem…` / `Ein Leben lang auf der Suche nach Präsenz…`) | not on live tip yet | **MERGED — LIVE NOT VERIFIED** |
| `/exhibitions/ebredes.html` (+ HU/DE) | 200 | Ébredés pages; schema presence; pro links | ok | **VERIFIED LIVE** |
| `/private-photography.html` (+ HU/DE) | 200 | ART ownership surface | ok | **VERIFIED LIVE** |

---

## 6. GSC 28 / 90 day measurement

| Item | Status |
|---|---|
| Fresh Query × Page × Country export (28d + prior) | **BLOCKED** — no Search Console API / Wizard access in this Cloud Agent |
| Fresh Query × Page × Country export (90d + prior) | **BLOCKED** |
| Properties: new Professional, old Professional, ART, Blog | **BLOCKED** for fresh pull |
| Prior user-verified baselines | Recorded in `docs/master-audit-20261031/gsc-baseline-28-90-days.csv` — **not** treated as fresh 2026-10-31 re-measure |
| Ranking improvement claim | **None** — explicitly not asserted |

Missing exports (exact):

1. `sc-domain:banhalmiphotography.com` — 28d + 90d + comparable prior windows, Query×Page×Country  
2. Former Professional (`norbertbanhalmi.com` / property as configured) — same  
3. `https://www.banhalmi.art/` — same  
4. `https://blog.banhalmi.art/` — same  
5. Service-intent slices for Vienna DE/EN and Budapest HU/EN targets listed in the execution brief  

---

## 7. Vienna / Budapest service SEO status

| Market | Intent | Live URL (tip `2951c6ec`) | Title / meta signal | Status |
|---|---|---|---|---|
| Vienna EN | Executive / Professional Portrait | `/portrait/` | Executive Portrait & Headshots \| Vienna–Budapest | **VERIFIED LIVE** (on-page) |
| Vienna DE | Executive Portrait | `/de-at/portrait/` | Portraitfotografie Wien & Budapest \| Executive & Headshots | **VERIFIED LIVE** (on-page) |
| Vienna EN/DE | Personal Branding | `/lifestyle/`, `/de-at/brand/` | Personal Brand… | **VERIFIED LIVE** (on-page) |
| Vienna EN/DE | Corporate / C-Level Event | `/event-photography/`, `/de-at/eventfotografie/` | C-Level Event… | **VERIFIED LIVE** (on-page) |
| Budapest HU | Portréfotózás / Üzleti portré | `/hu/portre/` | Portréfotózás… Üzleti és executive | **VERIFIED LIVE** (on-page) |
| Budapest HU/EN | Personal Branding | `/hu/brand/`, `/lifestyle/` | Brandfotózás / Personal Brand | **VERIFIED LIVE** (on-page) |
| Budapest HU/EN | Corporate / C-Level Event | `/hu/rendezvenyfotozas/`, `/event-photography/` | C-Level… | **VERIFIED LIVE** (on-page) |
| Rank / CTR top-5 preservation | — | Requires fresh GSC | — | **BLOCKED** / **NOT VERIFIED** |

No unnecessary URL or canonical changes beyond already-merged #131 copy.

---

## 8. Image licence audit

| Scope | Finding | Status |
|---|---|---|
| Professional live sample (`/`, `/portrait/`, `/fine-art/`) | ImageObject nodes checked carry `license` + `acquireLicensePage` + credit/copyright | **VERIFIED LIVE** (sample) |
| Professional inventory (prior freeze) | Catalog 154/154, fine-art 25/25, page JSON-LD 495/495 Google-complete | Documented PASS — re-sample above supports tip |
| ART gallery ImageObjects | Complete nodes use `#copyright` + contact acquire page | **VERIFIED LIVE** (sample) |
| ART `#primaryimage` + embedded Professional logo/portrait `@id`s on ART pages | Missing `license` / `acquireLicensePage` on some nodes while credit/copyright may be present | **NOT VERIFIED** as Google-complete; **do not invent** licence text — optional metadata alignment PR after #328 |
| Blog covers | Out of Google Image Licensable freeze scope | **NOT IN SCOPE** |
| Google Images badge ≠ legal grant | Affirmed | Policy held |

Missing legal proof list (no fabrication):

- Any blog editorial cover without provenance record (prior count ~459) — editorial backlog only  
- ART incomplete cross-site Person/logo ImageObject projections — metadata hygiene, not new rights claims  

---

## 9. GDPR — technical vs legal

| Topic | Observation | Status |
|---|---|---|
| Privacy pages EN/HU/DE live | Content + email `hello@norbertbanhalmi.com` | **VERIFIED LIVE** |
| Processors named in EN notice | GitHub, Google, Vercel/Cloudflare signals present; retention language present (~12 months enquiries) | Technical read |
| Processor list completeness (GA4, GTM, Clarity, Wix, …) | Needs counsel confirmation | **HUMAN LEGAL REVIEW** |
| Cross-border transfers adequacy | Policy language present; legal adequacy not certified here | **HUMAN LEGAL REVIEW** |
| Consent withdrawal UX parity HU/EN/DE | Not fully re-tested as legal UX audit | **HUMAN LEGAL REVIEW** |
| Form endpoints / email routing | Unchanged by design | Regression: email preserved on policy pages |
| Full GDPR compliance claim | **Not asserted** | — |

---

## 10. Fotótörténelem / Wix

| Check | Result | Status |
|---|---|---|
| Tag `muveszi-akt-fotozas` posts (10) | Each 200; contextual `https://www.banhalmi.art/hu/exhibitions/ebredes.html` href present | **VERIFIED LIVE** |
| Mass redirects | Not performed | Policy held |
| Irrelevant posts | Not edited | Policy held |
| Blog home Person `@id` | Single Person `@id` = `https://www.banhalmiphotography.com/about/` | **VERIFIED LIVE** |
| Additional Wix mutations this pass | None required | — |

---

## 11. Open blockers

1. **ART production tip** — #327+#328 merged to `208ea219…`; wait for Pages deploy → exact-live SHA + slogan EN/HU/DE.  
2. **GSC fresh 28/90 exports** — **BLOCKED** without Wizard/API credentials.  
3. **HUMAN LEGAL REVIEW** — GDPR processor/transfer/consent parity list above.  
4. Optional: ART `#primaryimage` licence URL alignment (proven ownership already on node; no invented rights).

---

## Verdict

| Layer | Status |
|---|---|
| BANHALMI required PRs #130/#131 | **MERGED** + Professional tip **VERIFIED LIVE** at `2951c6ec…` |
| BANHALMI #129 | **CLOSED** (superseded) |
| ART #327 + #328 | **MERGED** to `208ea219…` — production SHA **LIVE NOT VERIFIED** pending Pages deploy |
| GSC fresh measure | **BLOCKED** |
| Image licence (Professional sample) | **VERIFIED LIVE** |
| GDPR full compliance | **HUMAN LEGAL REVIEW** (technical privacy pages live) |
| Wix Ébredés contextual links | **VERIFIED LIVE** |

**Technical closure is partial:** Professional merge+deploy+exact-live for #130/#131 is complete; all listed ART PRs are merged. Full ecosystem technical closure requires ART deploy tip sync + slogan exact-live verification. Legal and GSC items remain explicitly outside “done”.
