# BANHALMI — public claim and evidence register

Status: WORKING AUDIT · 2026-11-15. This file is an internal evidence-control document, not public-facing copy. Do not automatically publish or inject its entries into Schema.org.

## Identity and attribution

| Claim / relationship | Appropriate attribution | Current evidence | Publication gate |
| --- | --- | --- | --- |
| Norbert Bánhalmi — photographer / founder | Person; professional history | Wikidata Q56391118; existing about pages | Confirm current first-party biography and external reference |
| BANHALMI Photography — professional service brand | Organization / service provider | Wikidata Q138425941; current site schema | Verify legal entity and organization relationship |
| Vienna and Budapest service areas | Areas served, not necessarily staffed premises | Current HU/EN/DE service pages | Verify actual service availability and avoid invented addresses |
| VIPACH — creative community and talent pathway | Collaboration/community relationship, not client endorsement | First-party site mentions; public VIPACH material | Verify exact legal and organizational relationship before adding structured relation |
| OM SYSTEM — ambassador relationship | Individual/brand ambassador role, not blanket corporate sponsorship | First-party site mentions | Obtain dated public manufacturer confirmation and precise role wording |
| AmCham Austria — membership | Membership only, not testimonial or client | First-party site and AmCham members-list link | Confirm current membership listing |
| Studio access / HIPStudio | Facility used when agreed; not proof of ownership at every location | First-party service copy | Confirm booking, address and applicable facility relationship |
| Approx. 50 specialist photographers | Network size, not 50 employees or guaranteed simultaneous availability | First-party business description | Verify current number, engagement model and dated basis |
| Client photography and public event references | Commission, publication, documented event or client permission — distinguish each | Portfolio and external references | Verify image usage, credit, publication and client consent before citing |

## Publication and AI Trust rules

1. Distinguish founder, company, project, association, membership, partnership, ambassadorship, supplier, venue, commissioned client and public reference.
2. Never infer an endorsement, employment relationship, contract, sponsorship or client status from a link, mention or photo.
3. Use `sameAs` only for the same real-world entity; use semantically appropriate links and schema properties for other relationships.
4. Never invent `aggregateRating`, `reviewCount`, testimonials, service locations or image usage permissions.
5. Keep Professional (commercial), ART (artistic) and Fotótörténelem (editorial) intent distinct.
6. Preserve EN/HU/DE-AT parity and BANHALMI editorial voice: factual, quiet, precise, image-first.
7. Re-check each claim and source before public copy or structured-data changes; store verification date, evidence URL, exact wording and permission status.

## Measurement and release gate

Prior GSC audit (28 settled days ending 2026-11-13) showed homepage landing for several service-intent queries. Treat this as a measurement signal, not proof of indexing or internal-link defects. Track query → intended service page → actual landing page → CTR → conversion. Do not rewrite titles or add duplicate landing pages without corroboration.

Changes to public pages require: reproducible issue → branch → PR → CI → merge → live URL HTML/render verification. A green CI alone is not a production verification.

## Open verification work

- Independent proof and date for each external affiliation.
- End-to-end quote form delivery, consent, currency/tax scenarios, anti-spam and notification paths.
- Source/main SHA versus exact live HTML and rendered responsive site.
- Gallery licensing and public client-reference permissions, per asset.
