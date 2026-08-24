const fs=require('node:fs');

const packagePath='package.json';
let pkg=fs.readFileSync(packagePath,'utf8');
pkg=pkg.replace(/ && node tools\/audit-visual-rhythm-regression(?:-20260825)?\.mjs/g,'');
fs.writeFileSync(packagePath,pkg);

const layoutAudit=`import fs from 'node:fs';
const css=fs.readFileSync('assets/css/site.css','utf8');
const fail=[];
const start='/* APPLE-RESPONSIVE-CONTRACT-V1:START */';
const end='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
const a=css.indexOf(start), b=css.indexOf(end);
const contract=a>=0&&b>a?css.slice(a,b):'';
if(a<0||b<=a) fail.push('single Apple responsive contract missing');
if(css.indexOf(start,a+1)!==-1||css.indexOf(end,b+1)!==-1) fail.push('multiple Apple responsive authorities detected');
if(!contract.includes('SINGLE-CSS-AUTHORITY-20260825')) fail.push('single CSS authority marker missing');
for(const needle of [
  '--apple-page-max:1200px','--apple-reading-max:760px','--apple-gutter:',
  '--apple-section-space:','--apple-card-gap:',
  'main>section,body>main>section{padding-block:var(--apple-section-space)!important',
  '.smart-quote-layout .category-grid{gap:9px!important;align-items:start!important;}',
  '.fp-art-path,.fp-decision-actions{',
  '.project-framework-drawer>summary{',
  '.bn-mega-link.active,.bn-mega-link[aria-current="page"],.bn-mega-link:focus-visible{',
  '@media(max-width:1024px)','@media(max-width:768px)','@media(max-width:560px)'
]) if(!contract.includes(needle)) fail.push('layout contract missing: '+needle);
if(/(^|[}\\s])section\\{padding:/m.test(contract)) fail.push('naked global section padding returned');
if(/home\\.css|visual-rhythm-20260825\\.css/.test(css)) fail.push('secondary CSS authority reference returned');
if(fail.length){console.error('Layout authority audit failed:\\n- '+fail.join('\\n- '));process.exit(1)}
console.log('Layout authority audit passed: one responsive CSS contract governs spacing, grids, menu, footer and desktop/tablet/mobile geometry.');
`;
fs.writeFileSync('tools/audit-layout-authority.mjs',layoutAudit);
console.log('Removed redundant visual rhythm audit hook and aligned layout audit to the single Apple CSS authority.');
