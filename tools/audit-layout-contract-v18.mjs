import fs from 'node:fs';

const failures=[];
const boot=fs.readFileSync('assets/js/fluid-rhythm-boot.js','utf8');
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(boot.includes("html{background:#fff!important}"),'document background recovery missing');
must(boot.includes('display:block!important;min-height:0!important;background:#fff!important'),'natural document flow recovery missing');
must(boot.includes('details.footer-accordion>:not(summary){display:block!important}'),'desktop footer content visibility override missing');
must(boot.includes("window.matchMedia('(min-width:1180px)')"),'desktop footer disclosure breakpoint missing');
must(boot.includes('details.open = query.matches;'),'footer disclosure state must track viewport');
must(boot.includes('--desktop-hero-min:clamp(520px,62vh,680px)!important'),'homepage hero crop contract missing');
must(boot.includes('object-position:center 30%!important'),'homepage hero crop position missing');
must(boot.includes('.cards:not(.smart-quote-layout):not(.quote-layout)>.card'),'generic card equal-height selector missing');
must(boot.includes('height:100%!important;min-height:100%!important;display:flex!important;flex-direction:column!important'),'equal-height card flex contract missing');
must(boot.includes('details.review-drawer>summary::after'),'review drawer arrow affordance missing');
must(boot.includes('details.review-drawer[open]>summary::after'),'review drawer open-state arrow rotation missing');
must(!fs.existsSync('assets/css/layout-contract-v18.css'),'layout recovery must not introduce a third stylesheet authority');
must(!fs.existsSync('assets/js/layout-contract-v18.js'),'layout recovery helper must remain folded into the existing rhythm runtime');

if(failures.length){
  console.error(`BANHALMI layout contract v18 failed (${failures.length}):`);
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('BANHALMI layout contract v18 passed: natural document flow, visible desktop footer content, cropped homepage hero, equal-height reusable cards and review drawer arrow are protected inside the existing runtime authority.');
