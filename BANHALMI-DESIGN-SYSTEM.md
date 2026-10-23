# BANHALMI-C unified design system

This is the single UI/UX and typography authority for the Professional site.
It is intentionally small: a visitor should understand the offer, evidence and
next action without learning the interface.

## Decision path

Every public page follows this order when its content requires it:

1. **Position** — one clear H1 and one sentence explaining the outcome.
2. **Proof** — selected work, institutional evidence or a concise process.
3. **Fit** — who the service is for and what is included.
4. **Action** — one primary CTA, with a secondary text link only when it removes uncertainty.
5. **Trust** — privacy, image rights and legal disclosures close to the relevant action.

Do not add a block merely to fill space. Pricing is a decision aid, not a catalogue:
show the starting signal where it helps orientation, then offer the optional detailed
calculator or enquiry route.

## Block rules

| Block | Required behaviour |
| --- | --- |
| Header | One brand start axis, one primary navigation, one primary CTA, language switch as utility. No competing boxed links. |
| Hero | One H1, maximum two short supporting sentences, one primary action. H1 remains readable at 4K and does not become a paragraph. |
| Section | Full-width surface only when it communicates a change of context; content sits in `.wrap`. |
| Card | A card represents one real decision unit. Use equal visual height on desktop grids; use natural height on mobile. |
| Process | Three steps maximum in the first decision layer. Each step has a number, verb-led heading and one explanation. |
| Gallery | Image first, concise context second. Never let placeholder copy become the dominant element. |
| FAQ / disclosure | Native `details/summary`; gold plus/minus marker, same start axis and at least 44px touch height. |
| Form | Ask for the minimum viable enquiry first. Optional project details stay collapsed. |
| CTA band | One sentence and one primary action. No parallel sales pitch. |
| Footer | Compact primary grid, legal/footer row, ecosystem row. Semantic fields may wrap; atomic identifiers may not. |

## Tokens and responsive rules

- Spacing uses `8 / 12 / 16 / 24 / 40 / 64 / 96px`; exceptions require a reason in the component.
- Body text is 17px with 1.55 line-height; long prose stays within 60–62ch.
- H1/H2/H3 use the system display stack, restrained tracking and balanced wrapping.
- Interactive controls are at least 44px high on touch widths.
- Content gutters are 28px desktop and 20px mobile.
- Structured grids may widen on large screens; prose does not. No page may overflow horizontally.
- Breakpoints are semantic: 560px (single-column form/lists), 720px (cards/process), 820px (split content), 1040px (navigation), 1180px (desktop homepage composition).

## Content and trust guardrails

The three language versions preserve the same decision path and evidence. SEO, GEO,
Schema, LLM, E-E-A-T, GDPR, AI Trust and GSC routes are machine-readable contracts;
visual simplification must not remove or duplicate them. Professional and ART intent
remain separate.
