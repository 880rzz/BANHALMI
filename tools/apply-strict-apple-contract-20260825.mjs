import fs from 'node:fs';

const cssFile='assets/css/site.css';
let css=fs.readFileSync(cssFile,'utf8');
const start='/* STRICT-APPLE-WEB-CONTRACT-20260825:START */';
const end='/* STRICT-APPLE-WEB-CONTRACT-20260825:END */';
const block=`${start}
/* Release-blocking Apple visual authority: restrained display tracking, readable prose and full-bleed surfaces. */
body main h1,
body header h1{
  letter-spacing:-.015em!important;
}
body main p:not(.lead):not(.microcopy):not(.form-data-note):not(.field-help):not(.form-submit-wait-note):not(.quote-disclaimer),
body main li:not(.microcopy):not(.field-help){
  font-size:max(1rem,1em)!important;
}
body main p:not(.lead):not(.microcopy):not(.form-data-note):not(.field-help):not(.form-submit-wait-note):not(.quote-disclaimer){
  line-height:1.55!important;
}
body main h3 + p{
  margin-top:.75rem!important;
}
body main .wrap,
body main .container,
body main .content-wrap{
  max-width:1280px!important;
}
body main > section.section-band,
body main > section.next-step-selector{
  position:relative!important;
  isolation:isolate;
}
body main > section.section-band::before,
body main > section.next-step-selector::before{
  content:"";
  position:absolute;
  z-index:-1;
  inset-block:0;
  left:50%;
  width:100vw;
  transform:translateX(-50%);
  background:inherit;
  pointer-events:none;
}
body main .card,
body main .service-card,
body main .case-card,
body main .fact-card,
body main .quote-step,
body main .category-card,
body main .option-row,
body main .quote-summary-card{
  padding-inline:max(1.25rem,3vw)!important;
}
${end}`;
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const re=new RegExp(esc(start)+'[\\s\\S]*?'+esc(end));
if(re.test(css)) css=css.replace(re,block);
else {
  const marker='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
  const i=css.lastIndexOf(marker);
  if(i<0) throw new Error('Final Apple CSS marker not found');
  css=css.slice(0,i)+block+'\n\n'+css.slice(i);
}
fs.writeFileSync(cssFile,css);

const auditFile='tools/audit-apple-visual-quality.mjs';
let audit=fs.readFileSync(auditFile,'utf8');
audit=audit.replace("if(fs&&abs(ls/fs)>0.035)issues.push(`${name(h)} heading tracking ${(ls/fs).toFixed(3)}em too strong`);","if(fs&&abs(ls/fs)>0.025)issues.push(`${name(h)} heading tracking ${(ls/fs).toFixed(3)}em too strong`);");
audit=audit.replace("if(colored&&r.width<w-2)issues.push(`${name(sec)} colored top-level section not full viewport (${r.width.toFixed(0)}/${w})`);","if(colored&&r.width<w-2){const before=getComputedStyle(sec,'::before'),bw=px(before.width),bbg=before.backgroundColor;const visualBleed=before.content!=='none'&&bw>=w-2&&bbg!=='rgba(0, 0, 0, 0)';if(!visualBleed)issues.push(`${name(sec)} colored top-level section not visually full viewport (${r.width.toFixed(0)}/${w})`);}");
fs.writeFileSync(auditFile,audit);
console.log('BANHALMI strict Apple CSS and audit contract remediation staged.');
