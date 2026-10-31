# BANHALMI Ecosystem — Configuration Isolation & Production Closure Report

**Generated:** 2026-10-31 (Europe/Budapest)  
**Agent run:** https://cursor.com/agents/bc-d7d73b1e-886b-4b20-a843-00d6c94f1f48  
**Overall verdict:** **NOT CLOSED** — required code changes remain **CI PASSED — NOT MERGED**; production still serves pre-fix SHAs.

---

## 1. Active configurations and project isolation

### Workspace / repos (verified)

| Path / id | Role |
|---|---|
| `/agent/repos/banhalmi` → `github.com/880rzz/banhalmi` | Professional site source |
| `/agent/repos/art` → `github.com/880rzz/art` | ART site source |
| Cloud environment repos list | **Only** `art` + `banhalmi` (no third product repo mounted) |
| `/agent/repos/art/AGENTS.md` | ART EUFÓRIA gallery editing contract (canonical for ART edits) |
| Cloud Agents skill/plugin cache under `~/.cursor/plugins/cache/cursor-public/{407,649,761,45893413,45893414}/` | Generic Cursor/Wix/Vercel/Cloudflare skills — not product-specific editorial configs |
| `~/.cursor/plugins/.../761/.../agents/openai.yaml` (Wix skill scaffolding) | Skill-authoring helper only; **not** a BANHALMI or Bécsi Szelet site config |

### Bécsi Szelet check

| Check | Result |
|---|---|
| Bécsi Szelet project directory in workspace | **Absent** |
| Bécsi Szelet `openai.yaml` / editor rules loaded as project authority | **Not found** in workspace repos |
| String matches for “Bécsi Szelet” in BANHALMI/ART code | Only as **ORF evidence record** in `service-trust-evidence.json` (`orf-becsi-szelet-founder-2023`) — historical press context about the person, **not** an editor configuration |
| Personal `environment.json` full dump | **NOT VERIFIED** (owner-restricted / not exposed to this run) |
| Whether every injected Cursor system rule originates solely from BANHALMI | **NOT VERIFIED** at the platform injection layer; **verified** that the mounted git workspace contains only ART + BANHALMI and no Bécsi Szelet project tree |

**Isolation statement (bounded):** This run’s mounted repositories and product source trees are BANHALMI Photography + BANHALMI ART only. No Bécsi Szelet editor project files were present or edited. Full Cursor host rule-injection provenance beyond the mounted workspace is **NOT VERIFIED**.

---

## 2. PR status (head SHA, CI, merge)

| PR | Head SHA | CI | Merge | Status label |
|---|---|---|---|---|
| [BANHALMI #130](https://github.com/880rzz/BANHALMI/pull/130) master audit / privacy / Ébredés handoff | `7f97d7387cd9` | integrity + full-regression **SUCCESS** | **Not merged** | **CI PASSED — NOT MERGED** |
| [BANHALMI #131](https://github.com/880rzz/BANHALMI/pull/131) GSC service SEO priorities | `a01e32396c8f` | integrity + full-regression **SUCCESS** | **Not merged** | **CI PASSED — NOT MERGED** |
| [BANHALMI #129](https://github.com/880rzz/BANHALMI/pull/129) privacy alias only | `474c0540fcc8` | SUCCESS | **Not merged** | **CI PASSED — NOT MERGED** (redundant vs #130) |
| [ART #327](https://github.com/880rzz/ART/pull/327) ImgKG Person+ImageObject | `0bf62af7ad0f` | all required SUCCESS | **Not merged** | **CI PASSED — NOT MERGED** |
| [ART #328](https://github.com/880rzz/ART/pull/328) ART slogan presence | `426a090d4078` | mostly SUCCESS; desktop-regression was in progress at last full poll | **Not merged** | **CI PASSED — NOT MERGED** / confirm desktop-regression terminal before merge |

### #129 redundancy (verified)

- #129 changes: privacy/trust former-domain demotion + Vercel `/privacy` → `/privacy-policy` aliases.
- #130 **includes** those intents via cherry-pick **plus** GitHub Pages `privacy/` stubs (required because production is Pages, not Vercel), fine-art nude Service removal, aktfoto redirects, and the master-audit deliverable pack.
- **Recommendation:** close #129 as superseded after #130 merges. Do **not** merge both blindly (duplicate vercel alias noise).

### Merge capability this agent

- Direct `main` edits: forbidden.
- This Cloud Agent **cannot** merge GitHub PRs (read-only `gh`; ManagePullRequest has no merge action).
- **BLOCKED:** production closure awaits human (or authorized) merge of #130, #131, #327, #328.

### Main SHAs (pre-merge)

| Repo | `origin/main` SHA | Matches live tip? |
|---|---|---|
| BANHALMI | `c36177d9fe075c36d8b3dd54d99d975784d13694` | Yes (see §3) |
| ART | `868b3c3503de7f3ee15f1fa9071dbe5c4ab2f7e6` | Yes (see §3) |

---

## 3. Production SHA and exact-live results

| Surface | Probe | Live value | Status |
|---|---|---|---|
| Professional | `/deployment-sha.txt` | `c36177d9fe075c36d8b3dd54d99d975784d13694` | **VERIFIED LIVE** (old tip) |
| ART | `/deployment-sha.txt` | `868b3c3503de7f3ee15f1fa9071dbe5c4ab2f7e6` | **VERIFIED LIVE** (old tip) |
| Blog | Wix | Custom embed + STATIC_PAGE rewrite earlier | Entity `@id` **VERIFIED LIVE** (below) |

### Exact-live probes (2026-10-31 evening Europe/Budapest)

| Check | Result | Status |
|---|---|---|
| `norbertbanhalmi.com/privacy/` → photography `/privacy/` | 308 then **404** | **VERIFIED LIVE** defect (fix in #130, not deployed) |
| `banhalmiphotography.com/privacy/` | **404** | **VERIFIED LIVE** defect |
| `banhalmiphotography.com/privacy-policy/` | **200** Privacy Notice | **VERIFIED LIVE** OK |
| Professional `/fine-art/` Service `category` | Still includes **`Nude Art`** | **VERIFIED LIVE** defect (fix in #130/#131, not deployed) |
| ART hero slogan EN/HU/DE | Still “investigation of presence / A jelenlét kutatása / Die Erforschung der Präsenz” | **VERIFIED LIVE** old copy (#328 not deployed) |
| Ébredés EN/HU/DE | 200, self-canonical, nude exhibition titles | **VERIFIED LIVE** OK |
| Blog home Person/Org `@id` | `banhalmiphotography.com/about/` + `#organization` (+ hipstudio); **0** `norbertbanhalmi.com/about` | **VERIFIED LIVE** OK |
| Email `hello@norbertbanhalmi.com` | Preserved in Professional policy pages (prior audit); not required on blog home HTML | **VERIFIED LIVE** where checked |

Desktop/mobile visual hero/CSS regression suite: **NOT VERIFIED** in this closure pass (no browser matrix run in this turn). Treat visual QA as open until post-merge computer-use/browser verification.

---

## 4. Fixed vs open defects

### Fixed in branches / Wix (not all live)

| Item | Where | Live? |
|---|---|---|
| Privacy alias + Pages stubs | #130 | No |
| Fine-art Service nude removal + private CTA → private-photography | #130 / #131 | No |
| GSC service title/meta/alias strengthening | #131 | No |
| ART slogan EN/HU/DE | #328 | No |
| ImgKG Person nodes audit | #327 | No (test-only) |
| Blog entity dual `@id` | Wix API | **Yes** |
| Blog `/ai.txt` → photography | Wix redirect | **Yes** (prior verify) |

### Still open / blocked

1. Merge + deploy of #130, #131, #327, #328  
2. Post-deploy exact-live re-verify (privacy, fine-art LD, slogan, GSC titles)  
3. Fresh GSC query×page×country export for comparable 28d windows  
4. Asset-level image licence URL proof beyond catalog audit  
5. Optional contextual Ébredés links on older Fotótörténelem akt essays (no redirects)  
6. GDPR human legal review  

---

## 5. GSC service × language × city performance

**Sources used (verified files, not invented):**

- Wizard snapshot in `data/search-authority-master-matrix.json`: baseline **2026-09-24 → 2026-10-22**, settledThrough **2026-10-22**
- Routing pairs `docs/gsc-routing-audit-20261019.json`: **2026-09-19 → 2026-10-16**
- Keyword matrix on branch #131: `docs/gsc-service-seo-priorities-20261031/`

**Fresh Oct 1–28 / comparable prior-period API pull in this environment:** **NOT VERIFIED / UNAVAILABLE** (no Search Console MCP/API).

| Priority | Query examples | Baseline observed URL | Intended owner | Live SEO copy update |
|---|---|---|---|---|
| Vienna portrait DE/EN | portraitfotografie wien, executive portrait | often `/` or `/de-at/` | `/de-at/portrait/`, `/portrait/` | In #131 only |
| Budapest portrait HU | portré fotózás budapest (86 impr gap), portréfotózás budapest | `/hu/` | `/hu/portre/` | In #131 only |
| Vienna personal brand | personal brand fotografie wien, brand fotograf | `/de-at/` or `/` | `/de-at/brand/`, `/lifestyle/` | In #131 only |
| Events | event photographer budapest (pos ~25) | event or home | `/event-photography/` (+ HU/DE) | In #131 only |
| Artistic nude | aktfotózás | professional home | ART Ébredés | Schema handoff in #130; **no blog redirects** |

**Ranking improvement claims:** none. Re-measure after deploy against an equivalent settled window.

---

## 6. Image licensing audit status

| Layer | Status |
|---|---|
| Repo catalog audit (`npm run audit:image-licensing`) | Passes in CI on fix branches (154 catalog / HTML checks) — **CI PASSED** on those PRs |
| Owner assertion “all images licensed through Google” | **NOT VERIFIED** as a grant of use; Google Images badge ≠ licence |
| Per-asset `license` + `acquireLicensePage` proof for every published image | **NOT VERIFIED** / incomplete — requires asset-level evidence pack |
| Wix image-rights snapshot | Prior CI: exact-one counts pass; unknown/incomplete allowed without inventing Banhalmi copyright |

---

## 7. GDPR — human review points (do not invent compliance)

Flag for qualified human review (**BLOCKED** for “compliant” claims):

1. Full processor list parity (GA4, Clarity, Wix, Vercel, GitHub Pages, any GTM) across EN/HU/DE notices after domain migration  
2. Retention periods disclosed vs actual product settings  
3. International transfer / SCCs wording  
4. Consent withdrawal UX parity across languages  
5. Contact form recipient routing — do not change without production verification (`hello@norbertbanhalmi.com` preserved)

---

## 8. SEO / GEO / schema / LLM / E-E-A-T / AI Trust

| Area | Status |
|---|---|
| Sitemap inventory 690 URLs HTTP 200 | Prior audit **VERIFIED LIVE** |
| Entity Wikidata QIDs | **VERIFIED LIVE** (HTTP entity JSON) |
| Blog Person/Org `@id` photography.com | **VERIFIED LIVE** |
| Professional fine-art nude Service claim | **VERIFIED LIVE** still present → fix not live |
| ART slogan | **VERIFIED LIVE** old → #328 not live |
| `ai.txt` blog → photography | Prior **VERIFIED LIVE** |
| LLM answerability of three-site relationship | Improved in docs/schema on branches; **MERGED — LIVE NOT VERIFIED** N/A until merge |
| AI Trust / consent-first analytics | Documented; legal substance **NOT VERIFIED** as complete |

---

## 9. Remaining risks and next measurement

**Risks**

- Merging #129 after #130 causes redundant redirect entries  
- Shipping #131 before #130 leaves nude Service claim live while titles change  
- Soft privacy 404 continues to burn migration equity until #130 deploys  
- GSC homepage cannibalisation persists until service pages gain impressions post-deploy  

**Next measurement (after merges)**

1. Confirm live `deployment-sha.txt` equals merged main tips  
2. Re-run privacy / fine-art LD / slogan / service title probes  
3. Import GSC query×page×country for a settled 28-day window; compare to Wizard 2026-09-24→10-22 gaps  
4. Schedule +28 settled days for CTR/position movement — no early win claims  

---

## 10. Final acceptance question

### A BANHALMI ökoszisztéma összes érintett módosítása éles, ellenőrzött és regressziómentes?

**Nem.**

### Blokkoló tényezők

1. **BANHALMI #130, #131 nem merge-öltek** → privacy 404, nude Service schema, GSC title/meta változások nincsenek élesen (**CI PASSED — NOT MERGED**).  
2. **ART #327, #328 nem merge-öltek** → ImgKG teszt + új szlogen nincs élesen (**CI PASSED — NOT MERGED**).  
3. **Agent merge capability hiány** → production tip nem frissíthető ebből a futásból (**BLOCKED**).  
4. **Exact-live** bizonyítja a régi tipet (`c36177d9` / `868b3c35`) és a fenti hibákat (**VERIFIED LIVE** failures).  
5. **Friss GSC query export** és **asset-level képlicenc** még **NOT VERIFIED**.  
6. **Teljes desktop/mobile visual QA** post-merge **NOT VERIFIED** ebben a closure passben.

**Wix blog entity `@id` javítás:** ez az egy jelentős élő lezárt tétel (**VERIFIED LIVE**), de önmagában nem teszi az ökoszisztémát production-closed állapotúvá.
