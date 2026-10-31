# Ébredés keyword / intent ownership audit

**Audit date:** 2026-10-31  
**Scope:** BANHALMI ART (`banhalmi.art`), Professional (`banhalmiphotography.com`), blog (`blog.banhalmi.art`). Repos read: `/agent/repos/art`, `/agent/repos/banhalmi`. No git changes.

## 1) Ébredés exhibition URLs (live)

| Locale | URL | Live `<title>` | Canonical | Hreflang cluster |
|--------|-----|----------------|-----------|------------------|
| EN | https://www.banhalmi.art/exhibitions/ebredes.html | Fine-art nude photography — Awakening, book and oeuvre \| BANHALMI ART | Self | `en`, `de-AT`, `hu-HU`, `x-default` → EN URL |
| HU | https://www.banhalmi.art/hu/exhibitions/ebredes.html | Művészi aktfotózás — Ébredés, könyv és életmű \| BANHALMI ART | Self | Same cluster |
| DE | https://www.banhalmi.art/de-at/exhibitions/ebredes.html | Künstlerische Aktfotografie — Erwachen, Buch und Werk \| BANHALMI ART | Self | Same cluster |

**Assessment:** Trilingual cluster is coherent: each language edition self-canonicals; `x-default` points to EN; reciprocal alternates present on all three (verified via live fetch). Exhibition pages deliberately target **artistic nude / művészi akt / Aktfotografie** in titles and meta, with in-page `Service` schema `#artistic-nude-photography` for enquiries.

**Related (not exhibition essay, same project):** book URLs in sitemap (`/books/book-ebredes.html` + HU/DE). Legacy Hungarian path https://www.banhalmi.art/fotokiallitasok/ebredes returns a move stub whose canonical is the HU exhibition URL.

**Machine registry alignment:** `service-evidence-map.json`, `professional-llm-mirror.json`, and `services.json` `artisticNudeRoutes` all point EN/HU/DE exhibition URLs as owners.

---

## 2) Professional site — competing artistic-nude positioning

Policy in repo (`services.json`, `pricing-guide.json`, `requestaquote`) correctly states: **artistic nude enquiries → Ébredés on ART**; **boudoir/private → ART private photography**; **career portfolios → Professional fine-art**.

### URLs with competing or blurred signals

| URL | Snippet / signal | Competes with Ébredés? |
|-----|------------------|------------------------|
| https://www.banhalmiphotography.com/fine-art/ | Service JSON-LD: `"category":["Fine Art Photography","Nude Art",…]`, `"alternateName":["…","Artistic nude photography"]`; hero `service-search-context`: “Fine Art photography … for performers **and personal projects**”; gallery includes 18+ “body study” previews; `acquireLicensePage` → `/requestaquote/` | **Yes** — schema + commercial quote path on same URL as portfolio service |
| https://www.banhalmiphotography.com/fine-art/#private-conversation | CTA button text: “Private artistic photography on BANHALMI ART →” but **href** = `https://www.banhalmi.art/exhibitions/ebredes.html` | **Yes** — misroutes users and mixes private vs nude owner |
| https://www.banhalmiphotography.com/de-at/fine-art/ | Same CTA mismatch (German label → Ébredés URL) | **Yes** |
| https://www.banhalmiphotography.com/fine-art/#personal-fine-art | Correct explicit links: private photography + “Artistic nude? Enquire through the Ébredés exhibition →” | No (aligned) |
| https://www.banhalmiphotography.com/requestaquote/ | Artists & Performers tooltip: “For personal portrait, boudoir, lingerie or artistic nude, visit the Ébredés exhibition on BANHALMI ART.” | No (aligned) |
| https://www.banhalmiphotography.com/muveszi-aktfotozas/ | Stub: canonical + JS/meta refresh to HU Ébredés; HTTP **200** (not 301) | Partial — destination correct; status code weak for consolidation |

**Repo-only note:** `/agent/repos/banhalmi/muveszi-aktfotozas/index.html` matches live stub behavior.

---

## 3) Blog — artistic nude related content

**Category:** https://blog.banhalmi.art/blog/categories/aktfotozas-muveszi-szemmel  

**Posts (sitemap sample, HU-heavy):**

- https://blog.banhalmi.art/post/muveszi-aktfotozas — title theme: művészi aktfotózás és portfólió; **includes** `href="https://www.banhalmi.art/hu/exhibitions/ebredes.html"`.
- https://blog.banhalmi.art/post/aktfotózás-pszichológiája-avagy-hogy — psychology of akt; JSON-LD ties to Professional about/org; **no Ébredés link** in quick link scan.
- https://blog.banhalmi.art/post/első-igazi-művészi-aktfotózásom — first akt shoot narrative; **no Ébredés link** in quick link scan.
- EN/DE counterparts linked from ART private page:  
  - https://blog.banhalmi.art/en/post/my-first-and-last-nude-photo-shoot-taking-my-clothes-off-wasn-t-the-hard-part  
  - https://blog.banhalmi.art/de/post/mein-erstes-und-letztes-aktshooting-das-ausziehen-war-nicht-das-schwierige  
  - https://blog.banhalmi.art/en/post/the-psychology-of-artistic-nude-photography (referenced from live ART private-photography)

**Redirect policy:** Historical articles should **not** be redirected (user instruction). Editorial layer should **contextual-link** to Ébredés where posts discuss commissioning or current practice; coverage is **partial** (strong on `muveszi-aktfotozas`, weak on older HU posts and category hub).

---

## 4) Professional service keyword owners (portrait / brand / event)

From `service-owner-routing.json` and live canonical/hreflang:

| Service | Intent | EN owner | HU owner | DE owner |
|---------|--------|----------|----------|----------|
| Portrait / executive headshot | C-level & professional presence | https://www.banhalmiphotography.com/portrait/ | https://www.banhalmiphotography.com/hu/portre/ | https://www.banhalmiphotography.com/de-at/portrait/ |
| Brand / visual positioning | Personal & org brand imagery | https://www.banhalmiphotography.com/lifestyle/ | https://www.banhalmiphotography.com/hu/brand/ | https://www.banhalmiphotography.com/de-at/brand/ |
| Event | C-level / institutional events | https://www.banhalmiphotography.com/event-photography/ | https://www.banhalmiphotography.com/hu/rendezvenyfotozas/ | https://www.banhalmiphotography.com/de-at/eventfotografie/ |
| Artists & performers portfolio | Career-facing portfolio (priced on Professional) | https://www.banhalmiphotography.com/fine-art/ | https://www.banhalmiphotography.com/hu/muveszi-fotografia/ | https://www.banhalmiphotography.com/de-at/fine-art/ |

**Separate ART owners (not Professional service pages):**

| Intent | EN | HU | DE |
|--------|----|----|-----|
| Artistic nude commission / enquiry | `/exhibitions/ebredes.html` | `/hu/exhibitions/ebredes.html` | `/de-at/exhibitions/ebredes.html` |
| Boudoir / private portrait | `/private-photography.html` | `/hu/private-photography.html` | `/de-at/private-photography.html` |

ART `private-photography` live content correctly delegates **Artistic nude — Ébredés** to the exhibition page; menu line still mentions “artistic nude” in one navigation blurb (minor intent blur).

---

## 5) P0 recommendations

1. **Professional `/fine-art/` (EN/HU/DE):** Remove artistic-nude service claims from Service JSON-LD (`Nude Art`, `Artistic nude photography` alternateName) and from any structured data that maps 18+ archive images to `/requestaquote/`. Keep career portfolio semantics only; retain visible outbound links to localized Ébredés.
2. **Fix CTA mismatch** on `#private-conversation` (EN + DE at minimum): button label says private photography but targets Ébredés — split into two CTAs or fix href/label pairing.
3. **Tighten hero `service-search-context`** on fine-art: drop “personal projects” phrasing that overlaps ART private / Ébredés journeys (align with `service-owner-routing.json`: “Fine Art does not imply nudity”).
4. **Legacy Professional `/muveszi-aktfotozas/`:** Serve **301** to `https://www.banhalmi.art/hu/exhibitions/ebredes.html` at edge (replace 200+refresh stub) to consolidate HU akt intent.

---

## 6) P1 recommendations

1. **Blog:** Without redirecting historical URLs, add a standard “Current artistic nude enquiries → Ébredés” block on category `aktfotozas-muveszi-szemmel` and on older HU akt posts that lack the link.
2. **ART private-photography:** Align navigation description (“Personal portraits, boudoir and artistic nude”) with page body (Ébredés-first for nude) to avoid implying private page owns akt commissions.
3. **Monitor** legacy `/fotokiallitasok/ebredes` stub indexation; acceptable if canonical remains HU Ébredés.

---

## 7) Evidence sources

- Live HEAD/GET: `banhalmi.art` exhibition trio, `banhalmiphotography.com/fine-art/`, `muveszi-aktfotozas/`, `private-photography.html`
- Repos: `art/exhibitions/ebredes*.html`, `banhalmi/fine-art/index.html`, `banhalmi/service-owner-routing.json`, `banhalmi/services.json`, `banhalmi/requestaquote/index.html`
- Blog: `blog.banhalmi.art/blog-posts-sitemap.xml`, sample post fetches

CSV export: `/tmp/master-audit/keyword-intent-ownership.csv`
