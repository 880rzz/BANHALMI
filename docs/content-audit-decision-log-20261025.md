# Content audit decision log — 2026-10-25

Source brief: `docs/BANHALMI_VOICE_AND_CONTENT_AUDIT_2026-10-25.md`  
Diff inventory: `docs/content-audit-before-after.csv`

## Decisions (Professional)

| Change | Decision | Why |
|---|---|---|
| Homepage `.services-quote-cta` | **Remove** | Screenshot-marked filler; quote already in hero + final CTA |
| Homepage `.client-decision-bridge` | **Remove** | Repeats hero usage thesis before the four services |
| Homepage `.presence-thesis` | **Remove from Professional home** | Artistic method copy belongs on ART; thesis JSON/machine layer retained |
| Services eyebrow “Four clear doors” | **Replace** with “Services” / “Szolgáltatások” / “Leistungen” | Less slogan, more scan |
| Final CTA band | **Soften** to “what do you need” / “Egyeztessünk” | Human, not agency pitch |
| Soft section hairlines | **Collapse** same-surface stacked borders | Removes empty visual “lines” between soft blocks |
| Meta title/description | **Align** to concrete who/what/where | Drop “choose a path then request a quote” marketing meta |

## Deferred

- Full service-page H1 rewrite to every candidate in the brief: keep until page-by-page review; this pass prioritises homepage clarity.
- IPTC binary image tagging: out of scope.

## Follow-up 2026-10-25 evening

| Change | Decision | SEO / EEAT note |
|---|---|---|
| BANHALMI-C parity | **Verified 100/100 routes, 595/595 image blobs** vs `880rzz/BANHALMI-C@c989ace` | Paths untouched; report in `docs/banhalmi-c-parity-verification-20261025.md` |
| Contact H1 EN/HU/DE | **Aligned** to voice brief (“what you need”) | WebPage `headline` synced; page `name`/title kept for search intent |
| Next-step cards | Softened “Build a package” → “Request a quote” / “Ajánlatot kérek” | CTA destinations unchanged (`/requestaquote/`, contact, Meet) |
| “Premium” UI wording | Softened to professional / leadership coverage | Prices, Offer amounts, trust-proof evidence blocks unchanged |
| Portrait H1 | **Kept locked** measured owners | Do not rewrite without GSC owner re-approval |
| ART homepage titles/meta | **Left on locked SEO strings** | Presence lean from earlier commit retained; entity/meta parity preserved |
| Trust-proof / schema / llms | **Not stripped** | EEAT evidence sections remain |

## Completion matrix (honest status)

| Surface | Status | Notes |
|---|---|---|
| Professional homepage structure + filler | **Done** | Quote strip, presence, bridge removed |
| Professional contact + next-step CTAs | **Done** | Voice-aligned |
| BANHALMI-C URL/image parity | **Done** | 100/100 + 595/595 |
| Premium marketing vocabulary (visible) | **Done** | Legal/factual leftovers only |
| Measured portrait / brand H1s | **Locked keep** | GSC owner contract |
| Full service-page H1 rewrite to every brief candidate | **Not done** | Would fight measured SEO owners; needs explicit approve |
| About biography depth | **Keep** | Human narrative, not marketing; ART archive bridged |
| ART homepage lean + separators | **Done** | Thesis kept, catalogue trimmed |
| Fine-art trust-proof EN/DE/HU | **Done (this pass)** | Typo + “artistic work” → personal commissions |
| ART private photography H1 | **Done (sibling repo)** | Slogan → factual category |
| ART exhibition factual “luxury/exclusive” strings | **Keep** | Alt text / source URLs, not marketing claims |
| IPTC binary tagging | **Out of scope** | |

**Verdict:** entry surfaces and structural fluff cleanup are complete on both repos for this voice/first-principles pass. A separate, approved SEO-owner rewrite would be required for every remaining service H1 candidate in the brief.
