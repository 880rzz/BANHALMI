# BANHALMI-C — strict simplification pass

This package contains a presentation-focused simplification of the Professional site.

## Changed

- Unified homepage heading scale and readable text widths for desktop, 4K and mobile layouts.
- Reduced oversized heading wrapping with balanced line lengths.
- Removed homepage price emphasis from the visual decision surface; authoritative pricing remains in the HTML data and JSON-LD layers.
- Kept all canonical routes, localized service owners, GSC routing, structured data, legal/trust content and machine-readable pricing intact.
- Kept the Professional / BANHALMI ART boundary intact.
- Removed all `!important` declarations from the canonical stylesheet and converted the remaining cascade dependencies to scoped, ordered selectors.

## Verification

Passed locally: homepage five-second clarity, design contract, Google Search contract, schema/GEO/LLM synchronization, GSC owner routing, pricing clarity, service price density, pricing disclosure, render stability, service-search routing, privacy contract, footer, layout, typography, workflow safety and image licensing checks.

The full repository test suite cannot reproduce GitHub's deterministic commit-date projection inside a source ZIP because the ZIP has no `.git` history. The failing check is `tools/generate-machine-projections.mjs` resolving the commit date for `data/machine-core.json`; this is packaging metadata, not a page or SEO failure. All checks before that projection step passed.
