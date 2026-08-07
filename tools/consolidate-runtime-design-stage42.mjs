import fs from 'node:fs';

const jsPath='assets/js/site-config.js';
const cssPath='assets/css/accessibility-stage14.css';
let js=fs.readFileSync(jsPath,'utf8');
let css=fs.readFileSync(cssPath,'utf8');

const start='  function injectValidationStyles(){';
const end='\n\n  function fieldContainer(field){';
const a=js.indexOf(start);
const b=js.indexOf(end,a);
if(a<0||b<0) throw new Error('Runtime validation-style injection block not found');
js=js.slice(0,a)+js.slice(b+2);
js=js.replace('    injectValidationStyles();\n','');
if(js.includes("document.createElement('style')")||js.includes('banhalmi-validation-styles')){
  throw new Error('Runtime style injection remains after consolidation');
}

const marker='/* STAGE42-STATIC-VALIDATION:START */';
if(!css.includes(marker)){
  css += `\n\n${marker}\n.quote-validation-summary{margin:0 0 28px;padding:20px 22px;border:2px solid #a32020;border-radius:14px;background:#fff4f3;color:#541010;box-shadow:0 10px 30px rgba(112,16,16,.12)}\n.quote-validation-summary[hidden]{display:none!important}\n.quote-validation-summary h2{margin:0 0 8px;font-size:clamp(1.15rem,2vw,1.45rem);line-height:1.25;color:#7b1111}\n.quote-validation-summary p{margin:0 0 12px;color:#541010}\n.quote-validation-summary ul{margin:0 0 14px;padding-left:1.25rem}\n.quote-validation-summary a{color:#7b1111;font-weight:700;text-decoration:underline;text-underline-offset:3px}\n.quote-validation-summary button{min-height:44px}\n[data-smart-quote] .is-invalid-field{border-color:#a32020!important;outline:3px solid rgba(163,32,32,.18)!important;outline-offset:2px;background-color:#fff8f7!important}\n[data-smart-quote] .is-invalid-group{border:2px solid #a32020!important;border-radius:14px!important;box-shadow:0 0 0 4px rgba(163,32,32,.10)!important}\n[data-smart-quote] .field-error-message{display:block;margin-top:8px;color:#7b1111;font-size:.95rem;font-weight:700;line-height:1.4}\n[data-smart-quote] [aria-invalid="true"]+label,[data-smart-quote] .is-invalid-group legend{color:#7b1111!important}\n@media(max-width:680px){.quote-validation-summary{padding:18px 16px;margin-bottom:22px}.quote-validation-summary button{width:100%}}\n/* STAGE42-STATIC-VALIDATION:END */\n`;
}

fs.writeFileSync(jsPath,js);
fs.writeFileSync(cssPath,css);
console.log('Stage 42 consolidation: validation presentation moved from runtime JS into static accessibility CSS.');
