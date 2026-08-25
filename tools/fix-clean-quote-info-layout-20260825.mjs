import fs from 'node:fs';
const p='assets/css/site.css';
let css=fs.readFileSync(p,'utf8');
const anchor='.smart-quote-layout .category-card>.info-tip[data-tooltip],\n.smart-quote-layout .option-row .info-tip[data-tooltip]{position:static!important;inset:auto!important;transform:none!important;float:none!important;margin:0!important}';
if(!css.includes(anchor)) throw new Error('Clean quote info-tip anchor missing.');
const replacement='.smart-quote-layout .info-tip[data-tooltip]{position:static!important;inset:auto!important;right:auto!important;bottom:auto!important;top:auto!important;left:auto!important;transform:none!important;float:none!important;margin:0!important;flex:0 0 44px!important}\n.smart-quote-layout .category-card>span{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto auto!important;align-items:start!important;gap:6px 10px!important;min-width:0!important;width:100%!important}\n.smart-quote-layout .category-card>span>strong,.smart-quote-layout .category-card>span>em{grid-column:1!important;min-width:0!important}\n.smart-quote-layout .category-card>span>.info-tip[data-tooltip]{grid-column:2!important;grid-row:1 / span 2!important;justify-self:end!important;align-self:end!important}\n.smart-quote-layout .option-row>span{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;min-width:0!important;width:100%!important}\n.smart-quote-layout .option-row .info-tip[data-tooltip]{margin-left:auto!important;align-self:center!important}';
css=css.replace(anchor,replacement);
// Remove now-obsolete direct-child category placement rule; the button lives inside the card span.
css=css.replace(/\n\.smart-quote-layout \.category-card>\.info-tip\[data-tooltip\]\{[^}]*\}/,'');
fs.writeFileSync(p,css,'utf8');
console.log('BANHALMI quote info controls corrected to normal card flow for current HTML structure.');
