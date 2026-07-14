# BANHALMI entity harmonization — 2026-07-14

## Canonical model

- Person: `https://www.banhalmi.art/norbert-banhalmi`
- ProfilePage: `https://www.banhalmi.art/norbert-banhalmi#webpage`
- Professional Organization: `https://www.norbertbanhalmi.com/#organization`
- Professional WebSite: `https://www.norbertbanhalmi.com/#website`
- Artistic archive WebSite: `https://www.banhalmi.art/#website`
- BANHALMI Brand: `https://www.norbertbanhalmi.com/#brand`

## Language entry domains

- `banhalmi.at` must permanently redirect to `https://www.norbertbanhalmi.com/de-at/`.
- `banhalminorbert.hu` must permanently redirect to `https://www.norbertbanhalmi.com/hu/`.
- These domains are not independent Person, Organization or WebSite entities.

## Applied corrections

- Unified the primary Person name as **Bánhalmi Norbert** while retaining international aliases.
- Unified `familyName` as **Bánhalmi**.
- Preserved the same canonical Person `@id` across all languages and both websites.
- Removed deprecated `ProfessionalService` typing.
- Removed redirect domains from Organization `sameAs` arrays.
- Recorded the legal entity founding date as `2023-11-27`; the BANHALMI creative practice remains described as active since 1999.
- Harmonized the banhalmi.art WebSite node as the official artistic oeuvre and archive.
- Preserved language-specific canonical and hreflang URLs on the professional website.
