import fs from 'node:fs';
const p='assets/css/site.css';
let css=fs.readFileSync(p,'utf8');
const end='/* CLEAN-BANHALMI-DESIGN-AUTHORITY-20260825:END */';
if(!css.includes(end)) throw new Error('Clean BANHALMI authority marker missing.');
const marker='/* CLEAN-QUOTE-OPTION-ALIGNMENT-20260825:START */';
if(css.includes(marker)){console.log('Quote option alignment correction already present.');process.exit(0);}
const block=`${marker}
/* The option info control remains in document flow and aligns with the card's bottom-right inset. */
html body .smart-quote-layout.smart-quote-layout .option-row.option-row{
  display:flex!important;align-items:center!important;gap:12px!important;padding:14px!important;min-height:72px!important;
}
html body .smart-quote-layout.smart-quote-layout .option-row.option-row>input{
  flex:0 0 auto!important;margin:0!important;
}
html body .smart-quote-layout.smart-quote-layout .option-row.option-row>span{
  display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;
  flex:1 1 auto!important;width:auto!important;min-width:0!important;
}
html body .smart-quote-layout.smart-quote-layout .option-row.option-row .info-tip[data-tooltip]{
  position:static!important;inset:auto!important;transform:none!important;float:none!important;
  flex:0 0 44px!important;width:44px!important;min-width:44px!important;max-width:44px!important;
  height:44px!important;min-height:44px!important;max-height:44px!important;
  margin:0 0 0 auto!important;align-self:center!important;justify-self:auto!important;
}
/* CLEAN-QUOTE-OPTION-ALIGNMENT-20260825:END */`;
css=css.replace(end,`${block}\n${end}`);
fs.writeFileSync(p,css,'utf8');
console.log('BANHALMI quote option info controls aligned to the card edge while staying static/in-flow.');
