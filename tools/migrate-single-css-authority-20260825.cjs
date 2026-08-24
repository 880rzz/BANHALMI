const fs=require('node:fs');
const path=require('node:path');

const cssPath='assets/css/site.css';
let css=fs.readFileSync(cssPath,'utf8');
const START='/* APPLE-RESPONSIVE-CONTRACT-V1:START */';
const END='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
const a=css.indexOf(START), b=css.indexOf(END);
if(a<0||b<a) throw new Error('Apple responsive contract markers missing');
if(css.indexOf(START,a+1)!==-1||css.indexOf(END,b+1)!==-1) throw new Error('Apple responsive contract markers must be unique');

const contract=`${START}
/* SINGLE-CSS-AUTHORITY-20260825
   One final responsive design system for every BANHALMI page.
   No component or build-time CSS is allowed to override rules after this block. */
:root{
  --apple-page-max:1200px;
  --apple-reading-max:760px;
  --apple-wide-reading-max:900px;
  --apple-gutter:clamp(20px,4.2vw,56px);
  --apple-section-space:clamp(72px,7.6vw,112px);
  --apple-section-space-compact:clamp(56px,5.6vw,84px);
  --apple-block-gap:clamp(28px,3.2vw,44px);
  --apple-card-gap:clamp(18px,2.2vw,28px);
  --apple-radius:22px;
  --apple-radius-small:16px;
  --apple-text:#202530;
  --apple-muted:#646A74;
  --apple-surface:#FFFFFF;
  --apple-surface-soft:#F5F5F7;
  --apple-surface-dark:#202530;
  --apple-gold-text:#8A681F;
  --apple-gold-dark:#DCC56B;
  --apple-line:rgba(32,37,48,.09);
}

html{overflow-x:clip;background:var(--apple-surface-dark);}
body{
  margin:0!important;
  min-height:0!important;
  display:block!important;
  overflow-x:clip;
  background:var(--apple-surface)!important;
  color:var(--apple-text)!important;
  font-size:17px;
  line-height:1.62;
}
body>main,#main{display:block!important;min-height:0!important;flex:none!important;width:100%;min-width:0;}
body>.site-footer,.site-footer{height:auto!important;min-height:0!important;flex:none!important;margin-top:0!important;width:100%;}

/* Global horizontal geometry. */
.wrap,.container{
  width:min(100%,var(--apple-page-max))!important;
  max-width:var(--apple-page-max)!important;
  margin-inline:auto!important;
  padding-inline:var(--apple-gutter)!important;
  box-sizing:border-box!important;
}
main>section,body>main>section{padding-block:var(--apple-section-space)!important;margin-block:0!important;}
main>section+section{margin-top:0!important;}
section>p,section>h2{
  width:min(100%,var(--apple-page-max));
  max-width:var(--apple-page-max)!important;
  margin-inline:auto!important;
  padding-inline:var(--apple-gutter)!important;
  box-sizing:border-box!important;
}

/* One typography system. */
h1,h2,h3{font-family:var(--font-display)!important;text-wrap:balance;}
h1{font-size:clamp(2.55rem,5.2vw,4.45rem)!important;line-height:1.03!important;letter-spacing:-.035em!important;}
h2{font-size:clamp(1.95rem,3.35vw,3rem)!important;line-height:1.08!important;letter-spacing:-.028em!important;}
h3{font-size:clamp(1.15rem,1.55vw,1.38rem)!important;line-height:1.2!important;letter-spacing:-.018em!important;}
p,li{line-height:1.68!important;}
p{margin-top:0;}
.prose p,.structural-prose p,.about-longform p{margin-bottom:1.25em!important;}
.prose p:last-child,.structural-prose p:last-child,.about-longform p:last-child{margin-bottom:0!important;}
.lead{font-size:clamp(1.18rem,1.8vw,1.52rem)!important;line-height:1.48!important;}
.eyebrow,.section-head .eyebrow,.hero .eyebrow{font-size:.82rem!important;line-height:1.4!important;}

/* Reading blocks share one left edge. */
:is(.section-head,.prose,.legal,.form,.quote-intro,.quote-builder,.quote-step,.card,.step,
.timeline,.timeline-item,.project-summary,.amcham-benefit-box,.service-context-lead,
.about-longform,.professional-network,.contact-custom-quote,.budget-result,.custom-brief){text-align:left!important;}
:is(.section-head,.prose,.legal,.form,.quote-intro,.service-context-lead,.about-longform){margin-left:0!important;margin-right:auto!important;}
.section-head{width:min(100%,var(--apple-reading-max));max-width:var(--apple-reading-max)!important;margin-bottom:var(--apple-block-gap)!important;}
.prose,.legal,.form,.quote-intro,.about-longform{width:min(100%,var(--apple-reading-max));max-width:var(--apple-reading-max)!important;}
.service-context-lead,.professional-network .prose{width:min(100%,var(--apple-wide-reading-max));max-width:var(--apple-wide-reading-max)!important;}
:is(.card,.step,.quote-step,.project-summary,.amcham-benefit-box) :is(h2,h3,h4,p,li,dt,dd){text-align:left!important;}

/* Authored surface sequence is authoritative. */
.section-band{border-top:1px solid var(--apple-line)!important;border-bottom:1px solid var(--apple-line)!important;}
main>section.surface-white,main>section[data-surface="white"],.section-band.surface-white,.section-band[data-surface="white"]{background:var(--apple-surface)!important;}
main>section.surface-soft,main>section[data-surface="soft"],.section-band.surface-soft,.section-band[data-surface="soft"]{background:var(--apple-surface-soft)!important;}
main>section.surface-dark,main>section[data-surface="dark"],.section-band.surface-dark,.section-band[data-surface="dark"]{background:var(--apple-surface-dark)!important;color:#F5F5F7!important;}
main>section.section-band:not([data-surface]):not(.surface-white):not(.surface-soft):not(.surface-dark):nth-of-type(odd){background:var(--apple-surface)!important;}
main>section.section-band:not([data-surface]):not(.surface-white):not(.surface-soft):not(.surface-dark):nth-of-type(even){background:var(--apple-surface-soft)!important;}
[data-surface="dark"] :is(h1,h2,h3,p,.lead){color:#F5F5F7!important;}
[data-surface="dark"] :is(.eyebrow,.label,.kicker,.title-accent){color:var(--apple-gold-dark)!important;}
[data-surface="dark"] .btn-link{color:#F5F5F7!important;}

/* Hero: image-first pages meet the header; copy uses the global reading axis. */
.hero .wrap,.pf-intro .wrap{text-align:left!important;}
.hero :is(h1,.lead,.eyebrow){margin-left:0!important;margin-right:auto!important;text-align:left!important;}
.hero h1{max-width:16ch!important;}
.hero .lead{max-width:50ch!important;}
.hero-actions,.service-actions{justify-content:flex-start!important;}
main>section.hero.hero-image-first.hero-visual-only{padding:0!important;margin:0!important;}
main>section.hero.hero-image-first.hero-visual-only>.wrap{padding-top:0!important;padding-bottom:0!important;}
main>section.hero-copy-only{padding-top:var(--apple-section-space-compact)!important;}
main[data-homepage-redesign] .hero-image-first .hero-figure{margin-bottom:0!important;}
main[data-homepage-redesign] .hero-copy-only{margin-top:0!important;}

/* Intentional centred components only. */
:is(.cta-band,.statement,.editorial-statement,.text-center){text-align:center!important;}
:is(.cta-band,.statement,.editorial-statement,.text-center) :is(h1,h2,h3,p,.lead,.section-head,.prose){margin-left:auto!important;margin-right:auto!important;text-align:center!important;}
.cta-band .wrap{display:flex;flex-direction:column;align-items:center;}

/* Layout families use one gap scale. */
:is(.cards,.steps,.gallery,.split,.service-info-cards,.smart-quote-layout,.quote-layout,.grid-2,.grid-3,
.card-grid,.category-grid,.legal-grid,.fp-decision-grid){gap:var(--apple-card-gap)!important;row-gap:var(--apple-card-gap)!important;}
:is(.cards,.steps,.service-info-cards,.legal-grid){align-items:stretch!important;}
.card,.quote-step,.quote-summary-card,.amcham-benefit-box,.project-summary,.fp-choice{
  margin:0!important;
  border-radius:var(--apple-radius)!important;
  box-shadow:none!important;
}
.card{padding:clamp(24px,2.8vw,34px)!important;}
.card:hover{transform:none!important;box-shadow:none!important;}
.split{column-gap:clamp(36px,5vw,72px)!important;}
.timeline,.timeline-item,.steps,.ticks,.faq{width:100%;}
.timeline-item,.step{min-width:0;}
.faq summary{min-height:52px;display:flex;align-items:center;}

/* Homepage decision tail is a deliberate component, not loose text. */
.fp-decision-inner{width:min(100%,var(--apple-page-max))!important;max-width:var(--apple-page-max)!important;margin-inline:auto!important;padding-inline:var(--apple-gutter)!important;box-sizing:border-box!important;}
.fp-art-path,.fp-decision-actions{
  width:100%!important;
  margin-top:var(--apple-card-gap)!important;
  padding:clamp(20px,2.2vw,28px)!important;
  background:var(--apple-surface)!important;
  border:1px solid var(--apple-line)!important;
  border-radius:var(--apple-radius)!important;
  box-sizing:border-box!important;
  box-shadow:none!important;
}
.fp-art-path{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:16px 28px!important;flex-wrap:wrap!important;}
.fp-art-path>span{color:#3F4147!important;}
.fp-decision-actions{display:flex!important;justify-content:flex-start!important;align-items:center!important;gap:14px 24px!important;flex-wrap:wrap!important;}
.fp-decision-actions .btn{margin:0!important;}

/* Full-width drawers start on the same content axis as every other block. */
.project-framework-drawer>summary{width:min(100%,var(--apple-page-max))!important;margin-inline:auto!important;padding-left:var(--apple-gutter)!important;padding-right:var(--apple-gutter)!important;box-sizing:border-box!important;}
.project-framework-content>.section-band>.wrap,.project-framework-content>.section-band>.container{width:min(100%,var(--apple-page-max))!important;margin-inline:auto!important;}
.project-framework-content>.section-band{padding-top:var(--apple-section-space-compact)!important;padding-bottom:var(--apple-section-space-compact)!important;}

/* Contrast and accessible interaction. */
:is(.section-head .eyebrow,.price-card .price,.price-line,.card .more,.map-card-link,.brand-word,.location-card-linkable .map-card-link){color:var(--apple-gold-text)!important;}
:is(.card,.quote-builder,.quote-step,.quote-summary-card,.amcham-benefit-box,.project-summary,.fp-choice){background:var(--apple-surface)!important;}
.card p,.step p,.microcopy,.custom-brief p,.amcham-copy{color:var(--apple-muted)!important;}
:is(.btn,.nav-cta,.pf-filter,.menu-btn,button,input,select,textarea,summary){min-height:44px;}
.field input,.field select,.field textarea{font-size:16px;}
.form,.quote-builder,.check-grid,.category-grid,.option-stack{min-width:0;}
main :is(.section,.section-band) p a:not(.btn):not(.btn-link){text-decoration:underline!important;text-underline-offset:.18em!important;text-decoration-thickness:max(1px,.07em)!important;}
.site-header .menu-btn{min-width:44px!important;min-height:44px!important;align-items:center!important;justify-content:center!important;}

/* Menu: current/focus state is typographic, never a pill or framed control. */
.bn-mega-link.active,.bn-mega-link[aria-current="page"],.bn-mega-link:focus-visible{
  border:0!important;
  outline:0!important;
  outline-offset:0!important;
  box-shadow:none!important;
  background:transparent!important;
  border-radius:0!important;
  padding-left:0!important;
  padding-right:0!important;
  text-decoration-line:underline!important;
  text-decoration-thickness:2px!important;
  text-underline-offset:.24em!important;
  text-decoration-color:currentColor!important;
}

/* QUOTE-DENSITY-REMEDIATION-20260814:START */
@media(min-width:1024px){
  .smart-quote-layout{grid-template-columns:minmax(250px,.58fr) minmax(0,1.42fr)!important;gap:clamp(28px,3.6vw,48px)!important;align-items:start!important;}
  .smart-quote-layout>.form{max-width:none!important;width:100%!important;min-width:0!important;}
  .smart-quote-layout .quote-intro{max-width:34ch!important;}
  .smart-quote-layout .quote-step{padding:18px 20px!important;margin-bottom:14px!important;border-radius:14px!important;}
  .smart-quote-layout .quote-step h3{margin-bottom:13px!important;font-size:1.04rem!important;}
  .smart-quote-layout .category-grid{gap:9px!important;align-items:start!important;}
  .smart-quote-layout .option-stack{gap:8px!important;margin-bottom:12px!important;}
  .smart-quote-layout :is(.category-card,.option-row){padding:12px 14px!important;border-radius:12px!important;align-self:start!important;}
  .smart-quote-layout .quote-summary-card{padding:20px 22px!important;margin-top:22px!important;border-radius:16px!important;}
}
/* QUOTE-DENSITY-REMEDIATION-20260814:END */

/* DESKTOP-A11Y-REMEDIATION-20260814:START */
@media(max-width:480px){
  main :is(h1,h2,h3,p,li,a,strong,span,code){overflow-wrap:anywhere;}
  main :is(.legal,.prose,.card,.split,.grid-2,.grid-3){min-width:0;}
}
/* DESKTOP-A11Y-REMEDIATION-20260814:END */

/* Executive footer: content-height only; shared responsive grid. */
.site-footer{background:var(--apple-surface-dark)!important;color:#AEB4C2!important;padding:clamp(54px,6vw,76px) 0 30px!important;}
.site-footer .wrap{width:min(100%,var(--apple-page-max))!important;max-width:var(--apple-page-max)!important;}
.footer-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(170px,1fr))!important;gap:clamp(32px,4vw,56px)!important;align-items:start!important;text-align:left!important;}
.footer-brand-col{grid-column:span 2;max-width:360px!important;text-align:left!important;}
.site-footer :is(h3,li,p,a){text-align:left;}
.footer-bottom{justify-content:flex-start!important;gap:12px 24px!important;text-align:left!important;}

@media(max-width:1024px){
  :root{--apple-section-space:clamp(64px,7vw,88px);--apple-section-space-compact:clamp(52px,6vw,72px);--apple-gutter:clamp(22px,4.5vw,44px);}
  .footer-brand-col{grid-column:span 1;}
  .smart-quote-layout,.quote-layout{grid-template-columns:1fr!important;}
  .quote-intro{position:static!important;}
}
@media(max-width:768px){
  :root{--apple-section-space:64px;--apple-section-space-compact:52px;--apple-gutter:24px;--apple-card-gap:18px;}
  body{font-size:17px;}
  h1{font-size:clamp(2.3rem,9vw,3.35rem)!important;}
  h2{font-size:clamp(1.8rem,7vw,2.4rem)!important;}
  .hero:not(.hero-image-first){padding:64px 0 52px!important;}
  :is(.cards,.steps,.split,.service-info-cards,.smart-quote-layout,.quote-layout,.grid-2,.category-grid,.legal-grid){grid-template-columns:1fr!important;}
  .gallery{grid-template-columns:repeat(2,minmax(0,1fr))!important;}
  .ticks{columns:1!important;}
  .section-head,.prose,.legal,.form,.quote-intro,.about-longform,.service-context-lead{max-width:100%!important;}
  .footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;}
  .fp-art-path{align-items:flex-start!important;flex-direction:column!important;}
}
@media(max-width:560px){
  :root{--apple-section-space:56px;--apple-section-space-compact:46px;--apple-gutter:20px;--apple-card-gap:16px;}
  body{font-size:16px;line-height:1.58;}
  h1{font-size:clamp(2.1rem,11vw,3rem)!important;}
  h2{font-size:clamp(1.65rem,8vw,2.12rem)!important;}
  .hero:not(.hero-image-first){padding:56px 0 44px!important;}
  .hero-actions,.service-actions{display:grid!important;grid-template-columns:1fr!important;width:100%;}
  .hero-actions .btn,.service-actions .btn{width:100%;text-align:center;}
  .gallery{grid-template-columns:1fr!important;}
  .card,.quote-step,.quote-summary-card,.amcham-benefit-box,.project-summary,.fp-choice{border-radius:var(--apple-radius-small)!important;}
  .footer-grid{grid-template-columns:1fr!important;}
  .footer-brand-col{grid-column:auto;}
  .footer-bottom{display:grid!important;grid-template-columns:1fr!important;}
  .fp-art-path,.fp-decision-actions{padding:20px!important;}
  .fp-decision-actions{align-items:stretch!important;flex-direction:column!important;}
  .fp-decision-actions .btn,.fp-decision-actions .fp-text-action{width:100%!important;justify-content:center!important;text-align:center!important;}
}
@media(prefers-reduced-motion:reduce){.card,.btn,.menu-btn,.nav-links{transition:none!important;transform:none!important;}}
${END}`;

css=css.slice(0,a)+contract+css.slice(b+END.length);
fs.writeFileSync(cssPath,css);

// One stylesheet version everywhere; no per-page visual authority.
const skip=new Set(['.git','node_modules','_site','artifacts']);
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(skip.has(ent.name)) continue;const p=path.join(dir,ent.name);if(ent.isDirectory()) walk(p);else if(p.endsWith('.html')){let s=fs.readFileSync(p,'utf8');const n=s.replace(/\/assets\/css\/(?:site|home)\.css(?:\?v=[^\"'\s>]*)?/g,'/assets/css/site.css?v=20260825-single-authority-v1');if(n!==s) fs.writeFileSync(p,n);}}}
walk('.');

// Consolidate the final audit around the single authority contract.
const auditPath='tools/audit-apple-responsive-contract.mjs';
let audit=fs.readFileSync(auditPath,'utf8');
const oldNeedleStart='for (const needle of [';
const ns=audit.indexOf(oldNeedleStart);
const ne=ns>=0?audit.indexOf(']) if (!contract.includes(needle))',ns):-1;
if(ns>=0&&ne>ns){
  const replacement=`for (const needle of [\n  '--apple-page-max:1200px','--apple-reading-max:760px','--apple-gutter:',\n  '--apple-section-space:','--apple-card-gap:','text-align:left','min-height:44px',\n  '@media(max-width:1024px)','@media(max-width:768px)','@media(max-width:560px)',\n  '.section-head','.prose','.cards','.steps','.timeline','.faq','.form','.legal',\n  '.quote-step','.cta-band','.site-footer','.fp-art-path','.project-framework-drawer>summary',\n  'SINGLE-CSS-AUTHORITY-20260825','DESKTOP-A11Y-REMEDIATION-20260814:START','QUOTE-DENSITY-REMEDIATION-20260814:START',\n  '.bn-mega-link[aria-current="page"]','border-radius:0!important'\n`;
  audit=audit.slice(0,ns)+replacement+audit.slice(ne);
}
if(!audit.includes("site.css must remain the only production stylesheet")){
  const insert=`\nconst workflow = fs.readFileSync('.github/workflows/pages.yml','utf8');\nif (workflow.includes('home.css')) failures.push('site.css must remain the only production stylesheet; home.css generation detected');\nif (workflow.includes('purgecss')) failures.push('homepage PurgeCSS fork detected; single CSS authority must not be split');\n`;
  audit=audit.replace("if (failures.length){",insert+"\nif (failures.length){");
}
fs.writeFileSync(auditPath,audit);

// Remove the redundant visual-rhythm guard from npm test: the Apple contract is the only design authority audit.
const packagePath='package.json';
let pkg=fs.readFileSync(packagePath,'utf8');
pkg=pkg.replace(/ && node tools\/audit-visual-rhythm-regression-20260825\.mjs/g,'');
fs.writeFileSync(packagePath,pkg);

console.log('Single CSS authority migration staged.');
