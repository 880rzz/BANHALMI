/* BANHALMI Optical Axis Authority 2026-08-26
   Presentation-only alignment and spacing contract.
   No content, metadata, schema, SEO/GEO, consent, analytics or routing changes. */

:root{
  --oa-cell-inset:clamp(22px,2.4vw,34px);
  --oa-block-gap:clamp(28px,3.4vw,48px);
  --oa-section-gap:clamp(64px,7vw,104px);
  --oa-divider:rgba(17,17,17,.10);
}

/* Linear editorial blocks use one left optical axis. */
html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote,.prose,.feature-list,.service-list,.link-list,.plain-list,.editorial-list){margin-left:0!important;margin-right:auto!important}
html body main :is(.section-head,.section-intro,.service-intro,.content-intro)>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote){margin-left:0!important;margin-right:auto!important}
html body main :is(.prose,.section-head)>:is(h1,h2,h3,p,.lead,.meta,blockquote,ul,ol){margin-left:0!important;margin-right:auto!important}
html body main .section-head{margin-left:0!important;margin-right:auto!important}
html body main .section-head p,html body main .prose{margin-left:0!important;margin-right:auto!important}

/* Preserve a disciplined editorial reading measure on long service-page reveal copy.
   The optical-axis rule may change x-position, but must never turn long-form prose into a near full-shell line length. */
html body main p.text-reveal{
  width:100%!important;
  max-width:var(--wide-textw,820px)!important;
  margin-left:0!important;
  margin-right:auto!important;
}

/* Text never touches a cell wall. Cards/panels use one protected inset system. */
html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell){
  box-sizing:border-box!important;min-width:0!important;padding:var(--oa-cell-inset)!important;
}
html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell)>
:is(h1,h2,h3,h4,p,.lead,.meta,ul,ol,blockquote){max-width:100%;overflow-wrap:normal;word-break:normal}

/* Vertical rhythm: whitespace is the primary separator. */
html body main :is(.section-head,.section-intro,.service-intro,.content-intro){margin-bottom:var(--oa-block-gap)!important}
html body main :is(.cards,.steps,.process-grid,.process-steps,.workflow-grid,.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid){gap:clamp(14px,1.5vw,20px)!important}

/* Divider restraint: avoid decorative/double rules. One structural line is enough. */
html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell){border-width:1px!important;box-shadow:none!important}
html body main details>summary{border-top:1px solid var(--oa-divider)!important;border-bottom:0!important}
html body main details:last-of-type>summary{border-bottom:1px solid var(--oa-divider)!important}
html body main :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li{border-bottom:1px solid var(--oa-divider)!important}
html body main :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li:last-child{border-bottom:0!important}

/* Unified primary + dropdown/mega navigation visual system. */
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu) a{
  border-radius:0!important;box-shadow:none!important;font-weight:500;outline-offset:3px;
}
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu){gap:clamp(10px,1.4vw,20px)}
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu) a:is(.active,[aria-current="page"]){
  border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;font-weight:650;
}
html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu) :is(a,summary){min-height:44px;display:flex;align-items:center}
html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu){padding:clamp(14px,1.6vw,22px)!important}

/* Responsive gutters remain the single viewport-edge contract. */
@media(max-width:960px){html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap{padding-left:var(--dc-gutter)!important;padding-right:var(--dc-gutter)!important}}
@media(max-width:620px){:root{--oa-cell-inset:20px;--oa-block-gap:28px}}
