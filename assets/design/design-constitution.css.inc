/* BANHALMI — Design Constitution 2026-08-25
   Apple-like visual discipline for the professional site.
   This fragment is deterministically merged into the production site.css after optimization.
   Presentation only: no content, schema, SEO/GEO, consent, analytics or routing changes. */
:root{--dc-shell:1180px;--dc-reading:720px;--dc-reading-wide:880px;--dc-gutter:clamp(24px,4.6vw,64px);--dc-section:clamp(76px,8vw,112px);--dc-section-tight:clamp(52px,5.5vw,76px);--dc-radius:20px;--dc-radius-small:14px;--dc-line:rgba(0,0,0,.09);--dc-dark-line:rgba(255,255,255,.12)}
html body .wrap{width:min(100%,var(--dc-shell));max-width:var(--dc-shell);margin-inline:auto;padding-inline:var(--dc-gutter)}
html body main{overflow:clip;position:relative;z-index:1}
html body .site-header{min-height:64px;box-shadow:none;z-index:1000}
html body .site-header .nav{height:64px}html body .site-header .brand{letter-spacing:.12em}html body .site-header :is(.nav-links a,.lang-switch a){font-weight:500}
html body h1{max-width:17ch;font-size:clamp(2.7rem,5.1vw,4.75rem);line-height:1.01;letter-spacing:-.024em}
html body h2{max-width:20ch;font-size:clamp(1.875rem,3.2vw,3rem);line-height:1.04;letter-spacing:-.024em}
html body h3{font-size:clamp(1.2rem,1.6vw,1.5rem);line-height:1.16;letter-spacing:-.022em}
html body p,html body li{text-wrap:pretty}
html body .lead{max-width:58ch;font-size:clamp(1.1875rem,1.5vw,1.4rem);line-height:1.48}
html body :is(.eyebrow,.label,.kicker,[class*="eyebrow"],[class*="kicker"]){letter-spacing:.08em;font-weight:650}
html body main>section:not(.hero){padding-block:var(--dc-section)}
html body .section-band{border-top:0;border-bottom:0}
html body .section-head{max-width:var(--dc-reading-wide);margin-bottom:clamp(32px,3.8vw,52px)}
html body .prose,html body .section-head p{max-width:var(--dc-reading)}
html body .service-deep-dive-content>section{padding-block:var(--dc-section-tight)}
html body .cards{gap:16px}
html body .card{border:1px solid var(--dc-line);border-radius:var(--dc-radius);padding:clamp(28px,3vw,42px);box-shadow:none;transform:none}
html body .card:hover{transform:none;box-shadow:none}html body .card p{line-height:1.55}
html body .service-process-grid{grid-template-columns:repeat(4,minmax(0,1fr));align-items:stretch}
html body .service-process-grid>.card{height:100%}
html body :is(.steps,.process-grid,.process-steps,.workflow-grid){gap:16px}
html body :is(.step,.process-card,.process-step,.workflow-card){border:1px solid var(--dc-line);border-radius:var(--dc-radius-small);padding:clamp(26px,2.6vw,38px);background:#fff}
html body .step{border-top:1px solid var(--dc-line)}
html body :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li{padding-block:18px;border-bottom:1px solid var(--dc-line)}html body :is(.feature-list,.service-list,.link-list,.plain-list,.editorial-list)>li:last-child{border-bottom:0}
html body :is(.dark,.dark-section,.section-dark,.navy-section,.trust-section,.evidence-section,.trust-proof){border-top:0;border-bottom:0}
html body :is(.dark,.dark-section,.section-dark,.navy-section,.trust-section,.evidence-section,.trust-proof) .wrap{max-width:var(--dc-shell)}
html body :is(.dark,.dark-section,.section-dark,.navy-section,.trust-section,.evidence-section,.trust-proof) :is(p,.lead){max-width:var(--dc-reading)}
html body .trust-proof .cards{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
html body .trust-proof .card{border-radius:var(--dc-radius);box-shadow:none}
html body main :is(.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid){width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
html body main :is(.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid)>*{min-width:0;border:1px solid var(--dc-line);border-radius:var(--dc-radius);box-shadow:none}
html body main :is(.cards,.steps,.process-grid,.process-steps,.service-grid,.services-grid,.evidence-grid,.trust-grid){margin-bottom:clamp(18px,2vw,30px)}
html body details>summary{border-radius:0}html body main details>summary{min-height:60px;padding-block:18px;border-top:1px solid var(--dc-line);border-bottom:0}html body main details:last-of-type>summary{border-bottom:1px solid var(--dc-line)}
html body .service-deep-dive>summary{padding-inline:var(--dc-gutter);font-weight:600}
html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu){box-shadow:none}html body :is(.mega-menu,.mega-panel,.partners-menu,.service-menu) a{border-radius:0}
html body footer,html body .site-footer{padding-block:clamp(54px,6vw,82px);position:relative;z-index:1}
html body footer .wrap,html body .site-footer .wrap{max-width:var(--dc-shell)}
html body footer :is(p,a,small,li),html body .site-footer :is(p,a,small,li){font-size:clamp(.76rem,.74vw,.86rem);line-height:1.45}
html body footer h2,html body footer h3,html body .site-footer h2,html body .site-footer h3{font-size:1rem;letter-spacing:-.01em}
html body [id]{scroll-margin-top:88px}
@media(max-width:1100px){html body main .cards{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:960px){:root{--dc-gutter:clamp(22px,5vw,40px);--dc-section:clamp(68px,9vw,92px)}html body .service-process-grid{grid-template-columns:repeat(2,minmax(0,1fr))}html body .trust-proof .cards,html body main :is(.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid){grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){:root{--dc-gutter:20px;--dc-section:58px;--dc-section-tight:42px;--dc-radius:18px}html body h1{font-size:clamp(2.35rem,11vw,3.125rem)}html body h2{font-size:clamp(1.8rem,8.5vw,2.5rem)}html body .cards,html body .service-process-grid,html body .trust-proof .cards,html body :is(.steps,.process-grid,.process-steps,.workflow-grid),html body main :is(.service-grid,.services-grid,.offer-grid,.evidence-grid,.trust-grid){grid-template-columns:1fr!important}html body .card,html body :is(.step,.process-card,.process-step,.workflow-card){padding:24px}html body footer,html body .site-footer{padding-block:48px}}

/* Final computed-style authority. Older page-specific selectors cannot reintroduce
   the former mixed spacing/typography once the production bundle is built. */
html body main :is(.wrap,.container,.content-wrap){box-sizing:border-box!important;max-width:var(--dc-shell)!important;margin-inline:auto!important}
html body main .wrap{width:min(100%,var(--dc-shell))!important;padding-inline:var(--dc-gutter)!important}
html body main h1{letter-spacing:-.022em!important;line-height:1.01!important}
html body main h2{letter-spacing:-.022em!important;line-height:1.04!important}
html body main h3{letter-spacing:-.018em!important;line-height:1.16!important}
html body main .lead{line-height:1.48!important}
html body main :is(h1,h2,h3)+:is(p,.lead,ul,ol,blockquote){margin-top:12px!important}

/* Quote-builder controls stay compact enough to read as choices rather than
   oversized cards while preserving their native 44px interaction targets. */
html body main .smart-quote-layout :is(label.category-card,label.option-row){padding:13px!important}
html body main .smart-quote-layout h3{font-size:max(1.125rem,clamp(1.125rem,1.6vw,1.5rem))!important}

/* Breadcrumbs are navigation inside the hero rhythm, not an extra page band.
   Their wrapper has zero flow height; the breadcrumb sits in the hero's existing
   top whitespace, so the hero begins directly after the sticky header on every viewport. */
html body main>.wrap:has(>.crumb){height:0!important;min-height:0!important;position:relative!important;z-index:3!important;padding-block:0!important;overflow:visible!important}
html body main>.wrap:has(>.crumb)>.crumb{position:absolute!important;top:0!important;left:var(--dc-gutter)!important;right:var(--dc-gutter)!important;padding-top:18px!important;margin:0!important;z-index:3!important}
html body main>.wrap:has(>.crumb)+.hero{margin-top:0!important;padding-top:clamp(96px,9vw,128px)!important}
