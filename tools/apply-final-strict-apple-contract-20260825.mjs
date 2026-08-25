import fs from 'node:fs';
const file='assets/css/site.css';
let css=fs.readFileSync(file,'utf8');
const start='/* STRICT-APPLE-WEB-CONTRACT-20260825:START */';
const end='/* STRICT-APPLE-WEB-CONTRACT-20260825:END */';
const block=`${start}
/* Final strict Apple visual authority. High-specificity selectors override legacy component rules while preserving the single-design-authority architecture. */
html body main h1,
html body header h1{
  letter-spacing:-.015em!important;
}
html body main h2{
  letter-spacing:-.01em!important;
}
html body main h3{
  font-size:max(18px,1em)!important;
  letter-spacing:-.005em!important;
}
html body main p.lead{
  font-size:max(19px,1em)!important;
  line-height:1.48!important;
}
html body main p:not(.lead):not(.microcopy):not(.form-data-note):not(.field-help):not(.form-submit-wait-note):not(.quote-disclaimer),
html body main li:not(.microcopy):not(.field-help){
  font-size:max(1rem,1em)!important;
}
html body main p:not(.lead):not(.microcopy):not(.form-data-note):not(.field-help):not(.form-submit-wait-note):not(.quote-disclaimer){
  line-height:1.55!important;
}
html body main h3 + p,
html body main h3 + .lead{
  margin-top:.75rem!important;
}
html body main .wrap,
html body main .container,
html body main .content-wrap{
  box-sizing:border-box!important;
  width:min(1200px,calc(100% - 2.5rem))!important;
  max-width:1200px!important;
  margin-inline:auto!important;
}
html body main > section.section-band,
html body main > section.next-step-selector{
  position:relative!important;
  isolation:isolate!important;
}
html body main > section.section-band::before,
html body main > section.next-step-selector::before{
  content:""!important;
  display:block!important;
  position:absolute!important;
  z-index:-1!important;
  inset-block:0!important;
  left:50%!important;
  width:100vw!important;
  max-width:none!important;
  transform:translateX(-50%)!important;
  background-color:inherit!important;
  background-image:inherit!important;
  pointer-events:none!important;
}
html body main .card,
html body main .service-card,
html body main .case-card,
html body main .fact-card,
html body main .quote-step,
html body main .category-card,
html body main .option-row,
html body main .quote-summary-card,
html body main label.category-card,
html body main label.option-row,
html body main label.date-coordination-option{
  padding-inline:max(20px,3vw)!important;
}
@media(max-width:768px){
  html body main .wrap,
  html body main .container,
  html body main .content-wrap{
    width:calc(100% - 2rem)!important;
  }
  html body main > section.section-band > h2,
  html body main > section.next-step-selector > h2{
    box-sizing:border-box!important;
    padding-inline:20px!important;
  }
}
${end}`;
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const re=new RegExp(esc(start)+'[\\s\\S]*?'+esc(end));
if(!re.test(css)) throw new Error('Strict Apple contract block not found');
css=css.replace(re,block);
fs.writeFileSync(file,css);
console.log('BANHALMI final strict Apple contract authority updated.');
