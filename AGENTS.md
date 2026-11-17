# BANHALMI development and production rules

## Hosting ownership — mandatory

- **GitHub Pages is the only canonical hosting and publishing surface** for the BANHALMI Professional website: `https://www.banhalmiphotography.com/` (EN root, HU `/hu/`, DE-AT `/de-at/`). The `880rzz/BANHALMI` repository, its `main` commit SHA, verified Pages artifact and the live canonical domain define production state.
- **Vercel is REDIRECT-ONLY infrastructure.** It serves permanent redirects from historical or language-entry domains, including `norbertbanhalmi.com`, `www.norbertbanhalmi.com`, `banhalmi.at`, `www.banhalmi.at`, `banhalminorbert.hu`, and `www.banhalminorbert.hu`, where those domains are assigned to the appropriate redirect project. It must never be treated as the primary website host, canonical SEO property, sitemap authority, or source of truth for page content.
- Never promote a Vercel preview/deployment URL to a canonical URL, `sameAs`, `hreflang`, schema `url`, sitemap `loc`, or public service CTA. The professional site's canonical URLs always use `www.banhalmiphotography.com`.
- Validate legacy redirects separately: HTTP 301/308, path preservation where an equivalent route exists, query preservation, localized route mapping, no chains, and canonical destination HTTP 200. A `READY` Vercel build or matching SHA does **not** prove the live redirect response.
- If a GitHub Pages release is pending, failed, or serves a different SHA, investigate **GitHub Pages**. Do **not** deploy website content on Vercel as a workaround. If a redirect fails, investigate the **relevant Vercel redirect project** without changing canonical hosting.
- Vercel redirect projects may depend on repository Git commits and contain middleware. A redirect-only production deployment can therefore have its own SHA gate, but that is separate from the site's GitHub Pages production gate. Avoid unnecessary Vercel deployments and obey account limits.
- Work on a branch → PR → CI → merge → exact SHA deploy → live HTTP/content verification. Clearly distinguish `JAVÍTOTT`, `CI-ELLENŐRZÖTT`, and `PRODUCTION-ELLENŐRZÖTT`.

## Search and AI visibility

- Prioritize Search Console query → intent → canonical language-specific service landing page → indexed status → referral/lead performance.
- Keep canonical, hreflang, sitemap, Person/Organization/Service schema, `llms.txt`, `ai.txt` and evidence links grounded on the GitHub Pages professional domain, never on redirect endpoints.
- Keep BANHALMI Professional (`banhalmiphotography.com`), BANHALMI ART (`banhalmi.art`) and the editorial blog (`blog.banhalmi.art`) as distinct authority/intent owners.
