import fs from 'node:fs';
const file='assets/css/site.css';
let css=fs.readFileSync(file,'utf8');
const end='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
if(!css.includes(end)) throw new Error('Apple responsive contract END marker missing');
const patch=`
/* DESKTOP-A11Y-REMEDIATION-20260814:START */
/* Lighthouse-confirmed contrast/link distinctions on portrait and shared footer. */
html body [data-surface="dark"] .section-head :is(h1,h2,h3){color:#F5F5F7!important;}
html body [data-surface="dark"] .section-head :is(.eyebrow,.label,.kicker){color:#DCC56B!important;}
html body .site-footer .brand .brand-word{color:#DCC56B!important;}
html body main :is(.section,.section-band) p a:not(.btn):not(.btn-link){
  text-decoration:underline!important;
  text-underline-offset:.18em!important;
  text-decoration-thickness:max(1px,.07em)!important;
}
/* DESKTOP-A11Y-REMEDIATION-20260814:END */
`;
if(css.includes('DESKTOP-A11Y-REMEDIATION-20260814:START')) css=css.replace(/\/\* DESKTOP-A11Y-REMEDIATION-20260814:START \*\/[\s\S]*?\/\* DESKTOP-A11Y-REMEDIATION-20260814:END \*\/\n?/,'');
css=css.replace(end,patch+end);
fs.writeFileSync(file,css);
console.log('Applied BANHALMI Lighthouse accessibility remediation.');
