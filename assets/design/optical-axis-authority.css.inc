/* BANHALMI Optical Axis Authority 2026-08-26
   Screenshot-derived presentation contract.
   No content, metadata, schema, SEO/GEO, consent, analytics or routing changes. */

:root{
  --oa-cell-inset:clamp(22px,2.4vw,34px);
  --oa-block-gap:clamp(28px,3.4vw,48px);
  --oa-section-gap:clamp(64px,7vw,104px);
  --oa-section-pad:clamp(56px,6vw,88px);
  --oa-divider:rgba(17,17,17,.10);
  --oa-reading:68ch;
  --oa-reading-wide:78ch;
}

/* 1. One optical axis for linear editorial content. */
html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote,.prose,.feature-list,.service-list,.link-list,.plain-list,.editorial-list){margin-left:0!important;margin-right:auto!important}
html body main :is(.section-head,.section-intro,.service-intro,.content-intro)>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote){margin-left:0!important;margin-right:auto!important}
html body main :is(.prose,.section-head)>:is(h1,h2,h3,p,.lead,.meta,blockquote,ul,ol){margin-left:0!important;margin-right:auto!important}
html body main .section-head{margin-left:0!important;margin-right:auto!important}
html body main .section-head p,html body main .prose{margin-left:0!important;margin-right:auto!important}

/* 2. Long-form reading measure stays disciplined. */
html body main p.text-reveal{width:100%!important;max-width:var(--wide-textw,820px)!important;margin-left:0!important;margin-right:auto!important}
html body main :is(.prose,.section-copy,.content-copy,.section-head p,.section-intro p){max-width:min(100%,var(--oa-reading-wide))}

/* 3. No unjustified dead space. */
html body main>section:not(.hero):not(.hero-section):not(.immersive):not(.statement):not([data-layout="immersive"]){min-height:0!important;height:auto!important;padding-top:var(--oa-section-pad)!important;padding-bottom:var(--oa-section-pad)!important}
html body main>section:last-child:not(.hero):not(.hero-section):not(.immersive):not(.statement):not([data-layout="immersive"]){margin-bottom:0!important;padding-bottom:clamp(48px,5vw,76px)!important}
html body main>section+section{margin-top:0!important}
html body main+footer,html body .site-footer{margin-top:0!important}
html body .site-footer{min-height:0!important;height:auto!important;padding-top:clamp(44px,5vw,68px)!important;padding-bottom:clamp(28px,3vw,44px)!important}

/* 4. Text never touches a real cell wall. */
html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice){box-sizing:border-box!important;min-width:0!important;padding:var(--oa-cell-inset)!important}
html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice)>:is(h1,h2,h3,h4,p,.lead,.meta,ul,ol,blockquote,strong,span,em){max-width:100%;overflow-wrap:normal;word-break:normal}

/* 5. Typography may wrap, but never collapse into cramped columns. */
html body main p,html body main li{line-height:max(1.45,1.45em);text-wrap:pretty}
html body main :is(h1,h2,h3,h4){text-wrap:balance}

/* 6. Stable block and grid rhythm. */
html body main :is(.section-head,.section-intro,.service-intro,.content-intro){margin-bottom:var(--oa-block-gap)!important}
html body main :is(.cards,.steps,.process-grid,.process-steps,.workflow-grid,.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid,.fp-decision-grid){gap:clamp(14px,1.5vw,20px)!important}

/* 7. Divider restraint. */
html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice){border-width:1px!important;box-shadow:none!important}
html body main details>summary{border-top:1px solid var(--oa-divider)!important;border-bottom:0!important}
html body main details:last-of-type>summary{border-bottom:1px solid var(--oa-divider)!important}
html body main :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li{border-bottom:1px solid var(--oa-divider)!important}
html body main :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li:last-child{border-bottom:0!important}

/* 8. Unified primary + dropdown/mega navigation. */
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu) a{border-radius:0!important;box-shadow:none!important;font-weight:500;outline-offset:3px}
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu){gap:clamp(10px,1.4vw,20px)}
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu) a:is(.active,[aria-current="page"]){border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;font-weight:650}
html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu) :is(a,summary){min-height:44px;display:flex;align-items:center}
html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu){padding:clamp(14px,1.6vw,22px)!important}

/* 9. Mobile text-bearing grids become one readable column before text becomes cramped. */
@media(max-width:620px){
  :root{--oa-cell-inset:20px;--oa-block-gap:28px;--oa-section-pad:clamp(44px,12vw,64px)}
  html body main :is(.cards,.steps,.process-grid,.process-steps,.workflow-grid,.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid,.archive-grid,.results-grid,.fp-decision-grid){grid-template-columns:1fr!important}
  html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice){width:100%!important;max-width:none!important}
}

/* 10. Responsive gutters remain the single viewport-edge contract. */
@media(max-width:960px){html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap{padding-left:var(--dc-gutter)!important;padding-right:var(--dc-gutter)!important}}
