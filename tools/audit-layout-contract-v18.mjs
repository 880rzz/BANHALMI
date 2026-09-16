import fs from 'node:fs';

const failures=[];
const boot=fs.readFileSync('assets/js/fluid-rhythm-boot.js','utf8');
const fluid=fs.readFileSync('assets/css/fluid-4k-rhythm.css','utf8');
const authority=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const must=(ok,msg)=>{if(!ok)failures.push(msg)};

must(boot.includes('/assets/css/fluid-4k-rhythm.css?v=20260916-live-pixel-v18'),'live-pixel cache token missing');
must(boot.includes("window.matchMedia('(min-width:1180px)')"),'desktop footer disclosure breakpoint missing');
must(boot.includes('details.open = query.matches;'),'footer disclosure state must track viewport');
must(!boot.includes('style.textContent'),'runtime must not inject layout CSS');
must(!boot.includes('--desktop-hero-min'),'runtime must not own hero geometry');
must(!boot.includes('object-position:center 30%'),'runtime must not own image crop geometry');
must(authority.visualGeometry?.runtimeGeometryOverridesAllowed===false,'canonical authority must prohibit runtime geometry overrides');
must(fluid.includes('LIVE-PIXEL-GEOMETRY-V18'),'canonical live-pixel stylesheet marker missing');
must(fluid.includes('--desktop-hero-min:clamp(740px,42vw,880px)'),'canonical homepage hero geometry missing');
must(fluid.includes('--desktop-copy:clamp(560px,38vw,680px)'),'canonical homepage copy-panel geometry missing');
must(fluid.includes('grid-template-columns:repeat(4,minmax(0,1fr))')||fluid.includes('repeat(4,minmax(0,1fr))'),'1440 portrait gallery density contract missing');
must(fluid.includes('@media (min-width:1920px)')||fluid.includes('@media(min-width:1920px)'),'1920 desktop breakpoint missing');
must(fluid.includes('@media (min-width:2560px)')||fluid.includes('@media(min-width:2560px)'),'2560 desktop breakpoint missing');
must(!fs.existsSync('assets/css/layout-contract-v18.css'),'layout recovery must not introduce a third stylesheet authority');
must(!fs.existsSync('assets/js/layout-contract-v18.js'),'layout recovery must not introduce a second geometry runtime');

if(failures.length){
  console.error(`BANHALMI layout contract v18 failed (${failures.length}):`);
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('BANHALMI layout contract v18 passed: pixel geometry is canonical CSS authority, runtime only loads CSS and synchronizes disclosure state, and desktop/4K breakpoints are protected.');
