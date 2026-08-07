import fs from 'node:fs';

const file='assets/css/style.css';
let css=fs.readFileSync(file,'utf8');
const marker='/* Production v3 — editorial SEO/GEO and Platon-inspired language sections */';

const first=css.indexOf(marker);
const second=css.indexOf(marker,first+marker.length);
const third=css.indexOf(marker,second+marker.length);
if(first<0||second<0||third>=0) throw new Error(`Expected exactly two duplicate markers before cleanup; first=${first}, second=${second}, third=${third}`);

let lcp=0;
while(first+lcp<css.length && second+lcp<css.length && css[first+lcp]===css[second+lcp]) lcp++;
const common=css.slice(second,second+lcp);
const safeBrace=Math.max(common.lastIndexOf('\n}\n'),common.lastIndexOf('}\n\n'));
if(safeBrace<0) throw new Error('Could not find a safe closing-brace boundary inside duplicate range');
const safeEnd=safeBrace+2;
const duplicate=css.slice(second,second+safeEnd);
const original=css.slice(first,first+safeEnd);
if(duplicate!==original) throw new Error('Measured duplicate range is not byte-identical');
const lines=duplicate.split('\n').length-1;
if(safeEnd<8000||lines<250) throw new Error(`Duplicate range unexpectedly small: ${safeEnd} chars / ${lines} lines`);

const after=css.slice(second+safeEnd,second+safeEnd+180);
if(!/^\n@media \(min-width:1180px\)\{\n\s*\.menu-btn\{display:inline-flex;\}/.test(after)){
  throw new Error(`Unexpected content after duplicate boundary; refusing cleanup. Starts: ${JSON.stringify(after.slice(0,120))}`);
}

css=css.slice(0,second)+css.slice(second+safeEnd);
const count=css.split(marker).length-1;
if(count!==1) throw new Error(`Cleanup must leave exactly one Production v3 marker; got ${count}`);
for(const required of ['.footer-brand-col{','.menu-btn{display:inline-flex;}','/* STAGE43-INLINE-PRESENTATION:START */']){
  if(!css.includes(required)) throw new Error(`Required post-cleanup CSS contract missing: ${required}`);
}

fs.writeFileSync(file,css);
console.log(`Stage 45 removed one exact duplicate CSS block: ${safeEnd} chars / ${lines} lines.`);
