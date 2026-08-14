import fs from 'node:fs';
const file='assets/css/site.css';
let css=fs.readFileSync(file,'utf8');
const end='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
if(!css.includes(end)) throw new Error('Apple responsive contract END marker missing');
const patch=`
/* DESKTOP-A11Y-REMEDIATION-20260814:START */
/* Lighthouse/browser-confirmed contrast, touch-target, wrapping and link distinctions. */
html body [data-surface="dark"] .section-head :is(h1,h2,h3){color:#F5F5F7!important;}
html body [data-surface="dark"] .section-head :is(.eyebrow,.label,.kicker){color:#DCC56B!important;}
html body .site-footer .brand .brand-word{color:#DCC56B!important;}
html body main :is(.section,.section-band) p a:not(.btn):not(.btn-link){
  text-decoration:underline!important;
  text-underline-offset:.18em!important;
  text-decoration-thickness:max(1px,.07em)!important;
}
/* The full-screen menu is the only navigation at <=1040px. Keep the visible
   hamburger icon unchanged while giving its interactive target the WCAG-sized box. */
html body .site-header .menu-btn{
  min-width:44px!important;
  min-height:44px!important;
  align-items:center!important;
  justify-content:center!important;
}
/* The homepage principle band is intentionally dark. Generic heading/prose rules
   previously overrode the surface semantics and rendered dark ink on dark navy. */
html body .presence-thesis[data-surface="dark"]{
  background:#202530!important;
  color:#F5F5F7!important;
}
html body .presence-thesis[data-surface="dark"] :is(h1,h2,h3,p){color:#F5F5F7!important;}
html body .presence-thesis[data-surface="dark"] :is(.eyebrow,.title-accent){color:#DCC56B!important;}
html body .presence-thesis[data-surface="dark"] .btn-link{color:#F5F5F7!important;}
html body .presence-thesis[data-surface="dark"] .btn-link:hover,
html body .presence-thesis[data-surface="dark"] .btn-link:focus-visible{color:#DCC56B!important;}
/* Legal/privacy/profile copy contains long Austrian/German compound words and URLs.
   Allow only genuinely unbreakable tokens to wrap; normal prose rhythm is unchanged. */
@media (max-width:480px){
  html body main :is(p,li,a,strong,span,code){overflow-wrap:anywhere;}
  html body main :is(.legal,.prose,.card,.split,.grid-2,.grid-3){min-width:0;}
}
/* DESKTOP-A11Y-REMEDIATION-20260814:END */
`;
if(css.includes('DESKTOP-A11Y-REMEDIATION-20260814:START')) css=css.replace(/\/\* DESKTOP-A11Y-REMEDIATION-20260814:START \*\/[\s\S]*?\/\* DESKTOP-A11Y-REMEDIATION-20260814:END \*\/\n?/,'');
css=css.replace(end,patch+end);
fs.writeFileSync(file,css);
console.log('Applied BANHALMI browser/Lighthouse accessibility remediation.');
