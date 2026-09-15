# BANHALMI Apple Design Contract

## Canonical production design authority

The production site uses a single compiled visual system. `assets/css/site.css` remains the base compiled design layer; `assets/css/fluid-4k-rhythm.css` is the late-loading canonical responsive/rhythm authority for production-safe viewport corrections and the homepage desktop editorial composition.

## Desktop Visual Redesign v2 — 2026-09-15

The homepage desktop composition is intentionally distinct from the mobile/tablet presentation.

### Scope

- Applies only to the multilingual homepage marker `main[data-homepage-redesign="stage76"]`.
- Starts at `min-width:1180px`.
- Mobile and tablet layout remain owned by the existing base design system.
- Content, canonical URLs, hreflang, Schema, machine-readable evidence and trust relationships are not presentation concerns and must not be changed by the desktop design layer.

### Desktop composition

- Hero becomes an editorial split composition: image-led left field and constrained positioning copy on the right.
- Desktop hero must remain visually restrained: controlled H1 size, strong negative space, limited CTA emphasis and no SaaS-style card treatment.
- Decision paths become a three-column editorial grid on desktop.
- Principal services become a two-column editorial grid with rule-based separation rather than elevated cards.
- Oeuvre teaser uses an asymmetric copy/image composition.
- Presence/thesis sections use deliberate negative space and constrained reading measure.
- 2560px and 4K widths may widen structured canvases but must not stretch prose.

### Protected existing contracts

- Footer geometry remains intrinsic-height and must not stretch on short pages.
- Review spacing remains the current canonical rhythm.
- Navigation remains the current deterministic multilingual Work/Services structure with no selected-pill regression.
- Existing authority evidence, including U.S. Embassy in Austria / SelectUSA / AmCham contexts and ART ↔ Blog ↔ Professional intent separation, must not be weakened or reinterpreted by design work.
- No endorsement, client, partnership or exclusivity claim may be inferred from event/publication evidence.

### Cache contract

`assets/js/fluid-rhythm-boot.js` must load the current versioned `fluid-4k-rhythm.css` URL. A redesign is not considered shipped if the production loader still points to a prior rhythm token.

### Definition of done

Desktop is complete only when 1440, 1920 and 2560px viewports show a materially different, intentional editorial composition while mobile remains regression-free and the evidence/entity/SEO layers remain unchanged.
