# BANHALMI reference portfolio PDF — canonical source

## Source and migration (2026-11-15)

- The original root file `BANHALMI_Editorial_Collage_24_Photos_Compressed.pdf` was relocated to `references/portfolio.pdf` with its original Git blob bytes unchanged.
- The previous 786 KB copy at the canonical path was replaced by the original 1,663,340-byte PDF.
- The redundant root path was removed to avoid two competing reference files.
- Canonical public URL: https://www.banhalmiphotography.com/references/portfolio.pdf
- Canonical name: BANHALMI Executive Portrait & Personal Branding Photography Portfolio

## Discovery and rights

- Six existing service pages link the PDF from their hero sections (EN/HU/DE, Portrait/Brand).
- Their Service JSON-LD nodes point to the PDF DigitalDocument; metadata is also hosted at https://www.banhalmiphotography.com/references/portfolio.jsonld.
- Sitemap and LLM discovery reference the one canonical PDF URL.
- The document is a reference for executive portraits, CV/LinkedIn headshots, personal branding and lifestyle photography; it does not grant reproduction, redistribution, commercial reuse or model-training rights.
- Creator: Norbert Bánhalmi (Wikidata Q56391118); copyright remains with Norbert Bánhalmi / BANHALMI.

## Release requirements

- Publish only after the Pages artifact contains `references/portfolio.pdf`.
- Production gate must prove HTTP 200 on the exact public URL and byte equality with the committed PDF.
- Post-deploy inspect the PDF URL and resubmit the sitemap in Google Search Console. Indexing is controlled by Google, not guaranteed by sitemap submission.

## Previous intermediate work

- Three short-lived standalone reference landing pages were removed. Their URLs must not be recreated.
- Brand and CV imagery belongs to the existing service galleries, not additional reference pages.
