import fs from 'node:fs';
const css=fs.readFileSync('assets/css/site.css','utf8');
const design=JSON.parse(fs.readFileSync('data/design-authority.json','utf8'));
const fail=[];
const start='/* APPLE-RESPONSIVE-CONTRACT-V1:START */';
const end='/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
const a=css.indexOf(start), b=css.indexOf(end);
const contract=a>=0&&b>a?css.slice(a,b):'';
if(a<0||b<=a) fail.push('single Apple responsive compatibility contract missing');
if(css.indexOf(start,a+1)!==-1||css.indexOf(end,b+1)!==-1) fail.push('multiple Apple responsive compatibility authorities detected');
if(Number(design.pageMaxPx)!==1500) fail.push('machine executive page canvas drifted from 1500px: '+design.pageMaxPx);
if(Number(design.readingMaxPx)!==760) fail.push('machine reading measure drifted from 760px');
if(Number(design.wideReadingMaxPx)!==900) fail.push('machine wide reading measure drifted from 900px');
for(const needle of [
  '--apple-page-max:','--apple-reading-max:760px','--apple-gutter:',
  '--apple-section-space:','.section-head','.prose','.cards','.steps','.faq','.form','.site-footer'
]) if(!contract.includes(needle)) fail.push('committed compatibility baseline missing: '+needle);
for(const width of ['1024px','768px','560px']){
  const re=new RegExp(`@media\\s*\\(\\s*max-width\\s*:\\s*${width}\\s*\\)`);
  if(!re.test(contract)) fail.push('approved responsive breakpoint missing: '+width);
}
const compiler=fs.readFileSync('tools/restore-production-design-authority.mjs','utf8');
for(const token of ['data/design-authority.json','pageMaxPx','serviceProcessBottomMarginPx','CANONICAL-DESIGN-SYSTEM-20260827']) if(!compiler.includes(token)) fail.push('production design compiler contract missing: '+token);
if(/home\.css|visual-rhythm-20260825\.css/.test(css)) fail.push('secondary CSS authority reference returned');
const markerClose=b>=0?css.indexOf('*/',b+end.length):-1;
if(markerClose>=0&&css.slice(markerClose+2).trim()) fail.push('rules found after final committed Apple compatibility authority');
if(fail.length){console.error('Layout authority audit failed:\n- '+fail.join('\n- '));process.exit(1)}
console.log(`Layout authority audit passed: committed site.css is the compatibility template and ${design.version} is the machine production design authority (${design.pageMaxPx}px executive canvas).`);
