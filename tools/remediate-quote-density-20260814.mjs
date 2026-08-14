import fs from 'node:fs';
const file='assets/css/site.css';
let css=fs.readFileSync(file,'utf8');
const end='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
if(!css.includes(end)) throw new Error('Apple responsive contract END marker missing');
const patch=`
/* QUOTE-DENSITY-REMEDIATION-20260814:START */
@media(min-width:1024px){
  html body .quote-step{padding:18px 20px!important;margin-bottom:14px!important;border-radius:14px!important}
  html body .quote-step h3{margin-bottom:13px!important;font-size:1.04rem!important}
  html body .category-grid{gap:9px!important}
  html body .option-stack{gap:8px!important;margin-bottom:12px!important}
  html body :is(.category-card,.option-row){padding:11px 13px!important;border-radius:12px!important}
  html body .quote-summary-card{padding:20px 22px!important;margin-top:22px!important;border-radius:16px!important}
  html body .quote-decision-guide{margin-bottom:14px!important;padding:14px 16px!important}
  html body :is(.grid-2,.grid-3,.check-grid,.production-grid){row-gap:12px!important}
  html body .custom-brief{margin:12px 0 16px!important}
}
@media(max-width:1023px){
  html body .quote-step{padding:18px!important;border-radius:16px!important}
  html body :is(.category-card,.option-row){padding:13px!important;border-radius:13px!important}
}
/* QUOTE-DENSITY-REMEDIATION-20260814:END */
`;
if(css.includes('QUOTE-DENSITY-REMEDIATION-20260814:START')) css=css.replace(/\/\* QUOTE-DENSITY-REMEDIATION-20260814:START \*\/[\s\S]*?\/\* QUOTE-DENSITY-REMEDIATION-20260814:END \*\/\n?/,'');
css=css.replace(end,patch+end);
fs.writeFileSync(file,css);
console.log('Applied BANHALMI quote-density remediation.');
