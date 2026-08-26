/* BANHALMI Optical Axis Authority 2026-08-26
   Presentation-only alignment contract.
   No content, metadata, schema, SEO/GEO, consent, analytics or routing changes. */

/* Linear editorial blocks use one left optical axis. Headline, description,
   supporting copy and lists may have different readable max-widths, but their
   starting x-coordinate is shared. Deliberately centred and true split/grid
   compositions are excluded. */
html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote,.prose,.feature-list,.service-list,.link-list,.plain-list,.editorial-list){
  margin-left:0!important;
  margin-right:auto!important;
}

html body main :is(.section-head,.section-intro,.service-intro,.content-intro)>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote){
  margin-left:0!important;
  margin-right:auto!important;
}

html body main :is(.prose,.section-head)>
:is(h1,h2,h3,p,.lead,.meta,blockquote,ul,ol){
  margin-left:0!important;
  margin-right:auto!important;
}

/* Preserve intentional readable measures without recentring individual children. */
html body main .section-head{margin-left:0!important;margin-right:auto!important}
html body main .section-head p,
html body main .prose{margin-left:0!important;margin-right:auto!important}

/* Responsive gutters remain the single viewport-edge contract. */
@media(max-width:960px){
  html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap{
    padding-left:var(--dc-gutter)!important;
    padding-right:var(--dc-gutter)!important;
  }
}
