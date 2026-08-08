# Mobile PageSpeed round — 2026-08-08

This change applies to the shared EN / HU / DE runtime.

- Keeps navigation and consent fail-closed behavior synchronous.
- Skips the decorative Apple motion full-DOM enhancement on compact viewports (<= 680px), so mobile receives final visible content without startup animation work.
- Keeps the desktop motion system unchanged.
- Builds the 18+ gallery age-verification dialog only on actual restricted-image interaction instead of at page startup.
- Cache-busts `main.js` across all HTML language routes as `20260808-mobile100-v2`.

Release criterion: production audit, full browser regression and palette checks must pass before merge. After exact-SHA deployment, live mobile Lighthouse must be re-measured on EN, HU and DE entry points.