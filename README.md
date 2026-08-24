# norbertbanhalmi.com

Production-ready static website for Norbert Banhalmi / Bánhalmi Norbert.

## Canonical domain structure

- `www.norbertbanhalmi.com` — canonical multilingual professional website
- `www.banhalmi.at` — permanent HTTP 301 redirect to `https://www.norbertbanhalmi.com/de-at/`
- `www.banhalminorbert.hu` — permanent HTTP 301 redirect to `https://www.norbertbanhalmi.com/hu/`
- `www.banhalmi.art` — official artistic oeuvre and source archive

Vienna is the company headquarters. Vienna and Budapest are equal active service bases.

## Ecosystem and automation contract

- `norbertbanhalmi.com` is the professional service and enquiry site.
- `banhalmi.art` is the artistic source archive.
- The professional Oeuvre page remains a commercial-context overview; Gallery links directly to the language-matched `banhalmi.art/#works` destination.
- The canonical Person identifier is `https://www.norbertbanhalmi.com/about/`; its human-readable profile is `https://www.banhalmi.art/#about`.
- Permanent GitHub Actions are read-only. Historical rewrite/remediation workflows and broad source-mutating fixers were removed to prevent audited corrections from being reverted.

<!-- production deploy retrigger: 2026-08-24 -->
