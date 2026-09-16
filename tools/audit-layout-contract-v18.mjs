import fs from 'node:fs';

const failures=[];
const css=fs.readFileSync('assets/css/layout-contract-v18.css','utf8');
const js=fs.readFileSync('assets/js/layout-contract-v18.js','utf8');
const boot=fs.readFileSync('assets/js/fluid-rhythm-boot.js','utf8');
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(css.includes('html body{\n  display:block !important;'),'document flow must remain natural and must not stretch a dark viewport floor');
must(css.includes('background:#fff !important;'),'document background must remain white outside the footer');
must(css.includes('details.footer-accordion > :not(summary){\n    display:block !important;'),'desktop footer content visibility override missing');
must(js.includes("window.matchMedia('(min-width:1180px)')"),'desktop footer disclosure breakpoint missing');
must(js.includes('details.open = query.matches;'),'footer disclosure state must track viewport');
must(css.includes('--desktop-hero-min:clamp(520px,62vh,680px) !important;'),'homepage hero crop contract missing');
must(css.includes('object-position:center 30% !important;'),'homepage hero crop position missing');
must(css.includes('.cards:not(.smart-quote-layout):not(.quote-layout) > .card'),'generic card equal-height selector missing');
must(css.includes('height:100% !important;')&&css.includes('flex-direction:column !important;'),'equal-height card flex contract missing');
must(css.includes('details.review-drawer > summary::after'),'review drawer arrow affordance missing');
must(css.includes('details.review-drawer[open] > summary::after'),'review drawer open-state arrow rotation missing');
must(boot.includes('/assets/css/layout-contract-v18.css?v=20260916-v18'),'layout v18 stylesheet loader missing');
must(boot.includes('/assets/js/layout-contract-v18.js?v=20260916-v18'),'layout v18 script loader missing');

if(failures.length){
  console.error(`BANHALMI layout contract v18 failed (${failures.length}):`);
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('BANHALMI layout contract v18 passed: natural document flow, visible desktop footer content, cropped homepage hero, equal-height reusable cards and review drawer arrow are protected.');
