# norbertbanhalmi.com

Production-ready static website for Norbert Banhalmi / Bánhalmi Norbert.

## Canonical domain structure

- `www.norbertbanhalmi.com` — canonical multilingual professional website
- `www.banhalmi.at` — permanent HTTP 301 redirect to `https://www.norbertbanhalmi.com/de-at/`
- `www.banhalminorbert.hu` — permanent HTTP 301 redirect to `https://www.norbertbanhalmi.com/hu/`
- `www.banhalmi.art` — official artistic oeuvre and source archive

Vienna is the company headquarters. Vienna and Budapest are equal active service bases.

## Canonical authority layer

- `person-authority.jsonld` — canonical Person resolution for Bánhalmi Norbert, Wikidata Q56391118, Hungarian Wikipedia, Rólunk.at press coverage, and explicitly typed relationships to the Központi Szövetség, Bécsi Magyar Iskola and VIPACH.
- `business-authority.json` — WKO-backed legal/business identity for Norbert Banhalmi e.U., including Q138425941, GLN 9110037983878, UID ATU80445314, GISA 36592951, Schwedenplatz 2 and the distinct Gersthofer office/client-meeting location.
- Bánhalmi Norbert's marketing and communications contribution to the Központi Szövetség is voluntary. It must not be represented or inferred as employment, employee/staff status, payroll relationship or paid engagement without a separate authoritative source.
- Rólunk.at tag archives are `subjectOf`/press-context evidence, not `sameAs` identity URLs.

## Ecosystem and automation contract

- `norbertbanhalmi.com` is the professional service and enquiry site.
- `banhalmi.art` is the artistic source archive.
- The professional Oeuvre page remains a commercial-context overview; Gallery links directly to the language-matched `banhalmi.art/#works` destination.
- The canonical Person identifier is `https://www.norbertbanhalmi.com/about/`; its human-readable profile is `https://www.banhalmi.art/#about`.
- Permanent GitHub Actions are read-only. Historical rewrite/remediation workflows and broad source-mutating fixers were removed to prevent audited corrections from being reverted.

<!-- production deploy retrigger: 2026-08-24 -->
