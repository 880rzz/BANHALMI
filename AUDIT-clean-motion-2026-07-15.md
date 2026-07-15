# BANHALMI clean motion audit — 2026-07-15

## Changes
- Removed all CSS blur() and backdrop blur effects from the site UI.
- Replaced the age-restricted preview blur with a dark brightness treatment, preserving content gating without visual blur.
- Rebuilt text entrance animation with opacity, translate and subtle scale only.
- Added responsive motion distances for desktop, tablet and mobile.
- Preserved prefers-reduced-motion accessibility behavior.
- Added restrained image hover zoom on pointer-capable devices.
- Extended image motion coverage to profile, AmCham, archive, oeuvre and image-open containers.
- Fixed the legacy Safari fallback so it no longer disables the new motion system after JavaScript initialization.
- Updated CSS and JavaScript cache versions to 20260715-clean-motion.

## Validation
- HTML files scanned: 71
- Active pages with stylesheet: 52
- Active pages with main JavaScript: 51
- JSON-LD blocks parsed: 194
- Invalid JSON-LD blocks: 0
- Remaining CSS blur() declarations: 0
- Remaining backdrop-filter blur declarations: 0
- main.js syntax check: passed
