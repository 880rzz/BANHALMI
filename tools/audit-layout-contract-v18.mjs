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
must(boot.includes('>.hero-visual-only{display:flex!important'),'hero visual cell must stretch with the copy cell');
must(boot.includes('>.hero-visual-only>.wrap{display:flex!important;flex:1 1 auto!important'),'hero visual wrap must fill the grid row');
must(boot.includes('.hero-visual-only .hero-figure{position:relative!important;display:block!important;flex:1 1 auto!important'),'hero figure stretch contract missing');
must(boot.includes('.hero-visual-only .hero-figure picture{position:absolute!important;inset:0!important'),'hero picture must absolutely fill the visual cell');
must(boot.includes('object-position:center 30%!important'),'homepage hero crop position missing');
must(boot.includes('>.hero-copy-only h1{max-width:15ch!important;text-wrap:pretty!important}'),'homepage hero heading width contract missing');
must(boot.includes('-webkit-text-fill-color:#8A681F!important;color:#8A681F!important'),'homepage hero gold accent contract missing');
must(boot.includes('display:inline!important;margin-top:0!important;background:none!important'),'homepage hero accent must not force a line break or gradient');
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
console.log('BANHALMI layout contract v18 passed: natural document flow, visible desktop footer content, true full-height hero image fill, gold inline hero accent, equal-height reusable cards and review drawer arrow are protected inside the existing runtime authority.');
