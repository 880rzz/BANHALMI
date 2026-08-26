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
  --oa-h1-size:clamp(2.75rem,5vw,4.5rem);
  --oa-h2-size:clamp(1.875rem,3.2vw,3rem);
  --oa-h3-size:clamp(1.25rem,1.8vw,1.625rem);
  --oa-lead-size:clamp(1.0625rem,1.35vw,1.3125rem);
  --oa-body-size:clamp(1rem,.35vw + .94rem,1.125rem);
  --oa-heading-description-gap:clamp(14px,1.4vw,22px);
}

html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote,.prose,.feature-list,.service-list,.link-list,.plain-list,.editorial-list){margin-left:0!important;margin-right:auto!important}
html body main :is(.section-head,.section-intro,.service-intro,.content-intro)>
:is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"],h1,h2,h3,p,.lead,.meta,blockquote){margin-left:0!important;margin-right:auto!important}
html body main :is(.prose,.section-head)>:is(h1,h2,h3,p,.lead,.meta,blockquote,ul,ol){margin-left:0!important;margin-right:auto!important}
html body main .section-head{margin-left:0!important;margin-right:auto!important}
html body main .section-head p,html body main .prose{margin-left:0!important;margin-right:auto!important}

html body main p.text-reveal{width:100%!important;max-width:var(--wide-textw,820px)!important;margin-left:0!important;margin-right:auto!important}
html body main :is(.prose,.section-copy,.content-copy,.section-head p,.section-intro p){max-width:min(100%,var(--oa-reading-wide))}

html body main>section:not(.hero):not(.hero-section):not(.immersive):not(.statement):not([data-layout="immersive"]){min-height:0!important;height:auto!important;padding-top:var(--oa-section-pad)!important;padding-bottom:var(--oa-section-pad)!important}
html body main>section:last-child:not(.hero):not(.hero-section):not(.immersive):not(.statement):not([data-layout="immersive"]){margin-bottom:0!important;padding-bottom:clamp(48px,5vw,76px)!important}
html body main>section+section{margin-top:0!important}
html body main+footer,html body .site-footer{margin-top:0!important}
html body .site-footer{min-height:0!important;height:auto!important;padding-top:clamp(44px,5vw,68px)!important;padding-bottom:clamp(28px,3vw,44px)!important}

html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice){box-sizing:border-box!important;min-width:0!important;padding:var(--oa-cell-inset)!important}
html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice)>:is(h1,h2,h3,h4,p,.lead,.meta,ul,ol,blockquote,strong,span,em){max-width:100%;overflow-wrap:normal;word-break:normal}

html body main p,html body main li{line-height:max(1.45,1.45em);text-wrap:pretty}
html body main :is(h1,h2,h3,h4){text-wrap:balance}

html body main :is(.section-head,.section-intro,.service-intro,.content-intro){margin-bottom:var(--oa-block-gap)!important}
html body main :is(.cards,.steps,.process-grid,.process-steps,.workflow-grid,.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid,.fp-decision-grid){gap:clamp(14px,1.5vw,20px)!important}

html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice){border-width:1px!important;box-shadow:none!important}
html body main details>summary{border-top:1px solid var(--oa-divider)!important;border-bottom:0!important}
html body main details:last-of-type>summary{border-bottom:1px solid var(--oa-divider)!important}
html body main :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li{border-bottom:1px solid var(--oa-divider)!important}
html body main :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li:last-child{border-bottom:0!important}

html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu) a{border-radius:0!important;box-shadow:none!important;font-weight:500;outline-offset:3px}
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu){gap:clamp(10px,1.4vw,20px)}
html body .site-header :is(.nav-links,.lang-switch,.mega-menu,.mega-panel,.partners-menu,.service-menu) a:is(.active,[aria-current="page"]){border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;font-weight:650}
html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu) :is(a,summary){min-height:44px;display:flex;align-items:center}
html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu){padding:clamp(14px,1.6vw,22px)!important}

@media(max-width:620px){
  :root{--oa-cell-inset:20px;--oa-block-gap:28px;--oa-section-pad:clamp(44px,12vw,64px);--oa-h1-size:clamp(2.125rem,10vw,3.125rem);--oa-h2-size:clamp(1.75rem,7vw,2.375rem);--oa-h3-size:clamp(1.2rem,5vw,1.5rem);--oa-heading-description-gap:14px}
  html body main :is(.cards,.steps,.process-grid,.process-steps,.workflow-grid,.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid,.archive-grid,.results-grid,.fp-decision-grid){grid-template-columns:1fr!important}
  html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice){width:100%!important;max-width:none!important}
}

@media(max-width:960px){html body main>section:not(.hero):not(.center):not(.centered):not([data-align="center"])>.wrap{padding-left:var(--dc-gutter)!important;padding-right:var(--dc-gutter)!important}}

html body main h1{font-size:var(--oa-h1-size)!important;line-height:1.02!important;letter-spacing:-.024em!important}
html body main h2{font-size:var(--oa-h2-size)!important;line-height:1.08!important;letter-spacing:-.022em!important}
html body main h3{font-size:var(--oa-h3-size)!important;line-height:1.16!important;letter-spacing:-.018em!important}
html body main :is(.lead,.description,.section-description,.hero-description,.service-description){font-size:var(--oa-lead-size)!important;line-height:1.5!important}
html body main :is(p,li){font-size:var(--oa-body-size)}
html body main :is(h1,h2,h3)+:is(.lead,.description,.section-description,.hero-description,.service-description,p){margin-top:var(--oa-heading-description-gap)!important}

html body main :is(.card,.step,.process-card,.process-step,.workflow-card,.service-card,.evidence-card,.trust-card,.panel,.cell,.fp-choice){padding-top:var(--oa-cell-inset)!important;padding-right:var(--oa-cell-inset)!important;padding-bottom:var(--oa-cell-inset)!important;padding-left:var(--oa-cell-inset)!important}

/* Final computed authority: legacy reveal and page-family selectors must not alter the shared type scale or heading rhythm. */
html body:not([data-oa-never]):not([data-oa-never-2]):not([data-oa-never-3]) main h1{font-size:var(--oa-h1-size)!important;line-height:1.02!important}
html body:not([data-oa-never]):not([data-oa-never-2]):not([data-oa-never-3]) main h2{font-size:var(--oa-h2-size)!important;line-height:1.08!important}
html body:not([data-oa-never]):not([data-oa-never-2]):not([data-oa-never-3]) main h3{font-size:var(--oa-h3-size)!important;line-height:1.16!important}
html body:not([data-oa-never]):not([data-oa-never-2]):not([data-oa-never-3]) main :is(h1,h2,h3):has(+ :is(.lead,.description,.section-description,.hero-description,.service-description,p)){margin-bottom:0!important}
html body:not([data-oa-never]):not([data-oa-never-2]):not([data-oa-never-3]) main :is(h1,h2,h3)+:is(.lead,.description,.section-description,.hero-description,.service-description,p){margin-top:var(--oa-heading-description-gap)!important}
