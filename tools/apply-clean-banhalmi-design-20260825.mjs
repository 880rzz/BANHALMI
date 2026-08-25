import fs from 'node:fs';

const cssPath='assets/css/site.css';
let css=fs.readFileSync(cssPath,'utf8');
const START='/* CLEAN-BANHALMI-DESIGN-AUTHORITY-20260825:START */';
const END='/* CLEAN-BANHALMI-DESIGN-AUTHORITY-20260825:END */';
const appleEnd='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
css=css.replace(new RegExp(esc(START)+'[\\s\\S]*?'+esc(END)+'\\s*','g'),'');
if(!css.includes(appleEnd)) throw new Error('BANHALMI Apple responsive END marker missing');
const block=`${START}
/* Final visual source of truth for current markup. The approved Apple baseline stays intact; this compatibility layer only maps newer components onto its geometry, surfaces and interaction rules. */
:root{
  --clean-page:1200px;
  --clean-editorial:900px;
  --clean-reading:760px;
  --clean-gutter:clamp(20px,4vw,56px);
  --clean-section:clamp(68px,7vw,108px);
  --clean-gap:clamp(18px,2.2vw,30px);
}
html,body{max-width:100%;overflow-x:clip}
body{display:block!important;min-height:0!important;background:#fff;color:#202530;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif;font-size:17px;line-height:1.62;letter-spacing:-.018em}
body>main,#main{display:block!important;flex:none!important;min-height:0!important;width:100%;min-width:0;overflow:visible}
.wrap{box-sizing:border-box;width:100%;max-width:var(--clean-page)!important;margin-inline:auto!important;padding-inline:var(--clean-gutter)!important}
.prose,.structural-prose{max-width:var(--clean-reading)!important;margin-left:0!important;margin-right:auto!important}
.section-head{max-width:var(--clean-editorial)!important;margin-left:0!important;margin-right:auto!important}
.section-head>p,.section-head .lead,.prose>p{max-width:var(--clean-reading)!important}
main>section{content-visibility:visible!important;contain-intrinsic-size:none!important}
main>section:not(.hero){padding-block:var(--clean-section)}
main>section[data-surface="white"],.surface-white{background:#fff!important;color:#202530}
main>section[data-surface="soft"],.surface-soft{background:#f5f5f7!important;color:#202530}
main>section[data-surface="dark"],.surface-dark{background:#202530!important;color:#fff}
.surface-dark h1,.surface-dark h2,.surface-dark h3,.surface-dark strong{color:#fff}
.surface-dark p,.surface-dark li{color:#d7dde5}
.surface-dark .eyebrow,.surface-dark .title-accent,.surface-dark .bn-heading-accent{color:#CBB45F!important}
h1,h2,h3{text-wrap:balance;transform:none}
h1{font-size:clamp(2.55rem,5.4vw,4.9rem);line-height:1.03;letter-spacing:-.046em}
h2{font-size:clamp(1.85rem,3.3vw,3rem);line-height:1.08;letter-spacing:-.038em}
h3{font-size:clamp(1.28rem,2vw,1.68rem);line-height:1.18;letter-spacing:-.026em}
p,li{max-width:var(--clean-reading)}
.eyebrow{font-size:.78rem;line-height:1.35;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:#8A681F}
.site-header{position:sticky;top:0;z-index:1000;background:rgba(255,255,255,.97);border-bottom:1px solid rgba(32,37,48,.11);box-shadow:none!important}
.site-header .wrap{max-width:var(--clean-page)!important}
.site-header .nav{min-height:68px;display:flex;align-items:center;gap:20px}
.site-header .brand,.site-header .nav-links a,.site-header summary{border-radius:0!important;box-shadow:none!important}
.site-header .nav-links a[aria-current="page"],.site-header .nav-links a.active,.site-header .nav-links a:focus-visible,.bn-mega-link.active,.bn-mega-link[aria-current="page"],.bn-mega-link:focus-visible{outline:0!important;border:0!important;border-radius:0!important;box-shadow:inset 0 -2px 0 #8A681F!important;background:transparent!important}
.hero-image-first{padding:0!important;background:#fff!important}
.hero-image-first>.wrap{max-width:none!important;padding:0!important}
.hero-figure{margin:0!important;position:relative;overflow:hidden;background:#f5f5f7}
.hero-figure picture,.hero-figure picture img{display:block;width:100%;height:auto}
.hero-copy-only{padding:clamp(64px,7vw,108px) 0!important;background:#fff!important}
.hero-copy-only>.wrap{max-width:var(--clean-page)!important}
.hero-copy-only h1{max-width:17ch;margin:14px 0 24px}
.hero-copy-only> .wrap>p:not(.eyebrow):not(.hero-location-line){max-width:var(--clean-reading);font-size:clamp(1.05rem,1.35vw,1.2rem)}
.hero-actions{display:flex;flex-wrap:wrap;align-items:flex-start;gap:14px 22px;margin-top:28px}
.btn,.btn-primary,.nav-cta{border-radius:999px}
.fp-decision-system{padding:var(--clean-section) 0!important}
.fp-decision-inner{box-sizing:border-box;width:100%;max-width:var(--clean-page);margin-inline:auto;padding-inline:var(--clean-gutter)}
.fp-decision-inner>h2,.fp-decision-lead{max-width:var(--clean-editorial);margin-left:0;margin-right:auto}
.fp-decision-lead{max-width:var(--clean-reading)}
.fp-decision-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:rgba(32,37,48,.12);border:1px solid rgba(32,37,48,.12);margin-top:36px}
.fp-choice{display:flex;flex-direction:column;gap:10px;min-height:190px;padding:clamp(24px,3vw,36px);background:#fff;border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important}
.fp-choice strong{font-size:clamp(1.18rem,1.8vw,1.45rem);line-height:1.2;color:#202530}
.fp-choice span{color:#5f6368;line-height:1.55}
.fp-choice em{margin-top:auto;color:#8A681F;font-style:normal;font-weight:600}
.fp-art-path,.fp-decision-actions{max-width:var(--clean-editorial);margin-left:0!important;margin-right:auto!important}
.section-band{padding:var(--clean-section) 0!important}
.cards,.steps,.card-grid,.project-grid,.category-grid{gap:var(--clean-gap)!important}
.card,.cards>*,.card-grid>*{box-shadow:none!important;transform:none!important}
.site-footer{display:block!important;flex:none!important;min-height:0!important;height:auto!important;background:#202530;color:#fff;padding:clamp(54px,6vw,84px) 0 28px}
.site-footer .wrap{max-width:var(--clean-page)!important}
.site-footer .footer-bottom{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-top:34px;padding-top:20px;border-top:1px solid rgba(255,255,255,.14)}

/* Smart quote: information controls remain inside normal card flow; modal behaviour belongs to runtime, not absolute positioning. */
.smart-quote-layout .category-card{position:relative;display:grid;grid-template-columns:auto 1fr;align-items:start;column-gap:12px;row-gap:7px;min-height:0!important;padding:18px!important}
.smart-quote-layout .category-card>input{grid-column:1;grid-row:1}
.smart-quote-layout .category-card>strong,.smart-quote-layout .category-card>em{grid-column:2}
.smart-quote-layout .category-card>.info-tip[data-tooltip],
.smart-quote-layout .option-row .info-tip[data-tooltip]{position:static!important;inset:auto!important;transform:none!important;float:none!important;margin:0!important}
.smart-quote-layout .category-card>.info-tip[data-tooltip]{grid-column:2;justify-self:end;align-self:start;grid-row:1 / span 2}
.smart-quote-layout .option-row{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;align-items:center!important;gap:12px!important}
.smart-quote-layout .option-row>span{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;min-width:0;width:100%}
.smart-quote-layout .option-row .info-tip[data-tooltip]{justify-self:end!important}

/* Full-screen descriptive menu uses editorial lines, never floating rounded cards. */
#bn-mega-menu{background:#202530!important;color:#fff!important}
#bn-mega-menu .bn-mega-shell{max-width:var(--clean-page)!important;margin-inline:auto!important;padding-inline:var(--clean-gutter)!important}
#bn-mega-menu a,#bn-mega-menu summary{border-radius:0!important;box-shadow:none!important}
#bn-mega-menu .bn-mega-link{background:transparent!important;border:0!important;padding-block:10px!important}

@media(max-width:1024px){
  .fp-decision-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:768px){
  body{font-size:16px}
  .wrap,.fp-decision-inner{padding-inline:24px!important}
  main>section:not(.hero){padding-block:clamp(56px,9vw,82px)}
  .fp-decision-grid{grid-template-columns:1fr}
  .fp-choice{min-height:0}
  .site-footer .footer-bottom{display:block}
  .site-footer .footer-bottom>*+*{display:block;margin-top:12px}
}
@media(max-width:560px){
  .wrap,.fp-decision-inner{padding-inline:20px!important}
  h1{font-size:clamp(2.2rem,11vw,3.35rem)}
  .hero-actions{display:grid;grid-template-columns:1fr;width:100%}
  .hero-actions .btn,.hero-actions .btn-primary{width:100%;justify-content:center;text-align:center}
}
${END}`;
css=css.replace(appleEnd,`${block}\n\n${appleEnd}`);
fs.writeFileSync(cssPath,css,'utf8');

const wfPath='.github/workflows/pages.yml';
let wf=fs.readFileSync(wfPath,'utf8');
if(!wf.includes('node tools/restore-production-design-authority.mjs _site')) wf=wf.replace('node tools/optimize-production-artifact.mjs _site','node tools/optimize-production-artifact.mjs _site\n          node tools/restore-production-design-authority.mjs _site');
if(!wf.includes('node tools/audit-all-pages-design.mjs')) wf=wf.replace('AUDIT_BASE_URL=http://127.0.0.1:4173 AUDIT_SITE_DIR=_site node tools/audit-first-principles-layout.mjs','AUDIT_BASE_URL=http://127.0.0.1:4173 AUDIT_SITE_DIR=_site node tools/audit-first-principles-layout.mjs\n          AUDIT_BASE_URL=http://127.0.0.1:4173 AUDIT_SITE_DIR=_site node tools/audit-all-pages-design.mjs');
fs.writeFileSync(wfPath,wf,'utf8');
console.log('BANHALMI clean design authority applied; production CSS mutation neutralized and exhaustive render audit wired.');
