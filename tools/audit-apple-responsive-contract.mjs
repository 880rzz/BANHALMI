import fs from 'node:fs';

const css = fs.readFileSync('assets/css/site.css','utf8');
const failures = [];
const start = 'APPLE-RESPONSIVE-CONTRACT-V1:START';
const end = 'APPLE-RESPONSIVE-CONTRACT-V1:END';
const a = css.lastIndexOf(start);
const b = css.lastIndexOf(end);
if (a < 0 || b <= a) failures.push('Apple responsive contract marker missing');
if (a >= 0 && css.indexOf(start) !== a) failures.push('Apple responsive contract START marker must appear exactly once');
if (b >= 0 && css.indexOf(end) !== b) failures.push('Apple responsive contract END marker must appear exactly once');
if (b >= 0) {
  const markerClose = css.indexOf('*/', b + end.length);
  if (markerClose < 0) failures.push('Apple responsive contract END comment is not closed');
  else if (css.slice(markerClose + 2).trim()) failures.push('Apple responsive contract must be the final CSS authority; rules found after END marker');
}
const contract = a >= 0 && b > a ? css.slice(a,b) : '';

for (const needle of [
  '--apple-page-max:1200px','--apple-reading-max:760px','--apple-gutter:',
  '--apple-section-space:','text-align:left','min-height:44px',
  '@media (max-width:1024px)','@media (max-width:768px)','@media (max-width:560px)',
  '.section-head','.prose','.cards','.steps','.timeline','.faq','.form','.legal',
  '.quote-step','.cta-band','.site-footer',
  'DESKTOP-A11Y-REMEDIATION-20260814:START','QUOTE-DENSITY-REMEDIATION-20260814:START',
  '.category-card','.option-row','.quote-summary-card','text-decoration:underline'
]) if (!contract.includes(needle)) failures.push(`contract missing: ${needle}`);

function rgb(hex){const v=hex.replace('#','');return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16)/255)}
function channel(v){return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}
function luminance(hex){const [r,g,b]=rgb(hex).map(channel);return .2126*r+.7152*g+.0722*b}
function contrast(x,y){const [hi,lo]=[luminance(x),luminance(y)].sort((m,n)=>n-m);return (hi+.05)/(lo+.05)}
for (const [fg,bg,min,label] of [
  ['#202530','#FFFFFF',7,'primary text / light'],
  ['#6E6E73','#FFFFFF',4.5,'muted text / light'],
  ['#8A681F','#FFFFFF',4.5,'gold text / light'],
  ['#FFFFFF','#202530',7,'white text / dark'],
  ['#DCC56B','#202530',4.5,'light gold / dark']
]) if (contrast(fg,bg) < min) failures.push(`${label} contrast ${contrast(fg,bg).toFixed(2)} < ${min}`);
if (contrast('#B79C44','#FFFFFF') >= 4.5) failures.push('brand gold contrast assumption changed; review accent policy');
if (/color\s*:\s*#?B79C44/i.test(contract)) failures.push('#B79C44 may not be used as light-background text in the final contract');

const htmlFiles = [];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules','_site'].includes(e.name)) continue; const p=`${dir}/${e.name}`.replace(/^\.\//,''); if(e.isDirectory()) walk(p); else if(p.endsWith('.html')) htmlFiles.push(p)}}
walk('.');
const realPages = htmlFiles.filter(p=>!p.startsWith('redirects/'));
if (realPages.length < 50) failures.push(`unexpectedly low HTML coverage: ${realPages.length}`);

if (failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Apple responsive contract passed for BANHALMI: ${realPages.length} HTML files; final CSS authority includes quote density, accessibility, palette and desktop/tablet/mobile guards.`);
