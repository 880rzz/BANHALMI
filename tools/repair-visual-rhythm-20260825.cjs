const fs = require('node:fs');
const path = require('node:path');

const cssPath = 'assets/css/site.css';
let css = fs.readFileSync(cssPath, 'utf8');
const endMarker = '/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
if (!css.includes(endMarker)) throw new Error('Final Apple contract END marker missing');

const start = '/* BANHALMI-VISUAL-RHYTHM-20260825:START */';
const end = '/* BANHALMI-VISUAL-RHYTHM-20260825:END */';
const esc = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
css = css.replace(new RegExp(esc(start) + '[\\s\\S]*?' + esc(end) + '\\n?', 'g'), '');

const block = `
${start}
/* Restores the approved BANHALMI editorial rhythm without changing content,
   schema, routing or the established component architecture. */
:root{
  --rhythm-section:clamp(76px,7.4vw,112px);
  --rhythm-section-compact:clamp(56px,5.4vw,82px);
  --rhythm-block-gap:clamp(24px,3vw,38px);
  --rhythm-soft:#F5F5F7;
  --rhythm-white:#FFFFFF;
  --rhythm-dark:#202530;
}

/* One typography scale and a consistent, breathable reading rhythm. */
html body{line-height:1.62;}
html body p,html body li{line-height:1.68;}
html body .prose p,
html body .structural-prose p,
html body .about-longform p,
html body .section-head + p,
html body .card p,
html body .fp-choice span{line-height:1.68;}
html body .prose p + p,
html body .structural-prose p + p,
html body .about-longform p + p{margin-top:.4em;}
html body h1{font-size:clamp(2.55rem,5vw,4.2rem);line-height:1.04;letter-spacing:-.035em;}
html body h2{font-size:clamp(2rem,3.45vw,3.05rem);line-height:1.08;letter-spacing:-.029em;}
html body h3{font-size:clamp(1.18rem,1.55vw,1.42rem);line-height:1.18;letter-spacing:-.02em;}
html body .eyebrow,html body .section-head .eyebrow{font-size:.82rem;line-height:1.4;}

/* Sections retain generous internal space. Disable the false Safari blank bands
   introduced by below-fold intrinsic placeholders. */
html body main>section{
  padding-top:var(--rhythm-section)!important;
  padding-bottom:var(--rhythm-section)!important;
  content-visibility:visible!important;
  contain-intrinsic-size:none!important;
}
html body main>section.hero-image-first{padding-top:0!important;padding-bottom:0!important;}
html body main>section.hero-copy-only{padding-top:var(--rhythm-section-compact)!important;padding-bottom:var(--rhythm-section)!important;}
html body .section-head{margin-bottom:clamp(34px,4vw,54px)!important;}
html body :is(.cards,.steps,.grid-3,.grid-2,.fp-decision-grid){gap:var(--rhythm-block-gap)!important;row-gap:var(--rhythm-block-gap)!important;}

/* Restore the explicit white / soft / dark surface alternation. */
html body main>section.surface-white,
html body main>section[data-surface="white"],
html body .section-band.surface-white,
html body .section-band[data-surface="white"]{background:var(--rhythm-white)!important;}
html body main>section.surface-soft,
html body main>section[data-surface="soft"],
html body .section-band.surface-soft,
html body .section-band[data-surface="soft"]{background:var(--rhythm-soft)!important;}
html body main>section.surface-dark,
html body main>section[data-surface="dark"],
html body .section-band.surface-dark,
html body .section-band[data-surface="dark"]{background:var(--rhythm-dark)!important;}
html body main>section.section-band:not([data-surface]):nth-of-type(odd){background:var(--rhythm-white)!important;}
html body main>section.section-band:not([data-surface]):nth-of-type(even){background:var(--rhythm-soft)!important;}
html body .section-band{border-top-color:rgba(32,37,48,.06)!important;border-bottom-color:rgba(32,37,48,.06)!important;}

/* Homepage hero and decision tail. */
html body main[data-homepage-redesign] .hero-image-first .wrap{padding-bottom:0!important;}
html body main[data-homepage-redesign] .hero-image-first .hero-figure{margin-bottom:0!important;}
html body main[data-homepage-redesign] .hero-copy-only{margin-top:0!important;}
html body .fp-decision-system{padding-top:var(--rhythm-section)!important;padding-bottom:var(--rhythm-section)!important;}
html body .fp-decision-inner{width:min(var(--apple-page-max),calc(100% - (2 * var(--apple-gutter))));margin-inline:auto;}
html body .fp-art-path,
html body .fp-decision-actions{
  width:100%;
  margin-top:clamp(18px,2.2vw,28px)!important;
  padding:clamp(20px,2.2vw,28px)!important;
  background:#fff;
  border:1px solid rgba(32,37,48,.10);
  border-radius:22px;
  align-items:center;
  box-shadow:none;
}
html body .fp-art-path{display:flex;justify-content:space-between;gap:18px 28px;flex-wrap:wrap;}
html body .fp-art-path span{color:#5f6570;}
html body .fp-decision-actions{display:flex;justify-content:flex-start;gap:14px 24px;flex-wrap:wrap;}
html body .fp-decision-actions .btn{min-width:0;}

/* Drawers and accordions use exactly the same left edge as page content. */
html body .project-framework-drawer>summary{
  width:min(var(--apple-page-max),100%);
  margin-inline:auto!important;
  padding-left:var(--apple-gutter)!important;
  padding-right:var(--apple-gutter)!important;
}
html body .project-framework-content>.section-band>.wrap,
html body .project-framework-content>.section-band>.container{width:min(var(--apple-page-max),100%);margin-inline:auto;}
html body .project-framework-content>.section-band{padding-top:var(--rhythm-section-compact)!important;padding-bottom:var(--rhythm-section-compact)!important;}
html body .project-framework-content>.section-band + .section-band{margin-top:0!important;}

/* Card groups never visually touch. */
html body :is(.card,.quote-step,.trust-proof .grid-3>.card,.fp-choice){margin:0!important;}
html body .trust-proof .grid-3{gap:var(--rhythm-block-gap)!important;row-gap:var(--rhythm-block-gap)!important;}

/* No framed active item in the fullscreen menu. Keyboard focus remains visible
   as an editorial underline instead of a pill/box. */
html body .bn-mega-link.active,
html body .bn-mega-link[aria-current="page"],
html body .bn-mega-link:focus-visible{
  border:0!important;
  border-radius:0!important;
  outline:0!important;
  box-shadow:none!important;
  background:transparent!important;
  padding-left:0!important;
  padding-right:0!important;
  text-decoration-line:underline!important;
  text-decoration-thickness:2px!important;
  text-underline-offset:.24em!important;
  text-decoration-color:currentColor!important;
}

/* Footer follows real content height instead of a flex-generated empty tail. */
html body{display:block!important;min-height:0!important;}
html body>main,html body #main{display:block!important;min-height:0!important;flex:none!important;}
html body>.site-footer,html body .site-footer{height:auto!important;min-height:0!important;flex:none!important;margin-top:0!important;}

@media(max-width:768px){
  :root{--rhythm-section:clamp(58px,11vw,82px);--rhythm-section-compact:clamp(46px,9vw,66px);--rhythm-block-gap:18px;}
  html body h1{font-size:clamp(2.25rem,10.5vw,3.55rem);}
  html body h2{font-size:clamp(1.8rem,8vw,2.65rem);}
  html body .fp-art-path,html body .fp-decision-actions{padding:20px!important;}
  html body .fp-art-path{align-items:flex-start;flex-direction:column;}
}
${end}
`;

css = css.replace(endMarker, block + '\n' + endMarker);
fs.writeFileSync(cssPath, css);

/* Cache-bust every HTML reference to the shared stylesheet. */
const skip = new Set(['.git','node_modules','_site']);
function walk(dir){
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if (skip.has(ent.name)) continue;
    const p = path.join(dir,ent.name);
    if (ent.isDirectory()) walk(p);
    else if (p.endsWith('.html')){
      const source = fs.readFileSync(p,'utf8');
      const next = source.replace(/\/assets\/css\/site\.css\?v=[^\"'\s>]+/g,'/assets/css/site.css?v=20260825-rhythm-v1');
      if (next !== source) fs.writeFileSync(p,next);
    }
  }
}
walk('.');

/* Make the existing mandatory Apple audit guard this repair permanently. */
const auditPath = 'tools/audit-apple-responsive-contract.mjs';
let audit = fs.readFileSync(auditPath,'utf8');
const guardStart = '// VISUAL-RHYTHM-REGRESSION-GUARD-20260825:START';
const guardEnd = '// VISUAL-RHYTHM-REGRESSION-GUARD-20260825:END';
audit = audit.replace(new RegExp(esc(guardStart) + '[\\s\\S]*?' + esc(guardEnd) + '\\n?', 'g'),'');
const guard = `${guardStart}\nfor (const needle of [\n  'BANHALMI-VISUAL-RHYTHM-20260825:START',\n  '--rhythm-section:',\n  'content-visibility:visible!important',\n  '.section-band.surface-white',\n  '.section-band.surface-soft',\n  '.section-band.surface-dark',\n  '.bn-mega-link:focus-visible',\n  'body>.site-footer'\n]) if (!contract.includes(needle)) failures.push(\`visual rhythm guard missing: \${needle}\`);\n${guardEnd}\n\n`;
audit = audit.replace('if (failures.length){', guard + 'if (failures.length){');
fs.writeFileSync(auditPath,audit);
