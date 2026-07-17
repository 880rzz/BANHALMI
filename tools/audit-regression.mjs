import fs from 'node:fs';
import path from 'node:path';

const fail=[];
const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
function assert(ok,msg){ if(!ok) fail.push(msg); }

function webpSize(file){
  const b=fs.readFileSync(file);
  assert(b.subarray(0,4).toString()==='RIFF' && b.subarray(8,12).toString()==='WEBP', `${file}: not a WEBP file`);
  let i=12;
  while(i+8<=b.length){
    const four=b.subarray(i,i+4).toString();
    const size=b.readUInt32LE(i+4); const d=i+8;
    if(four==='VP8X') return [1+b.readUIntLE(d+4,3),1+b.readUIntLE(d+7,3)];
    if(four==='VP8 ') return [b.readUInt16LE(d+6)&0x3fff,b.readUInt16LE(d+8)&0x3fff];
    if(four==='VP8L'){ const v=b.readUInt32LE(d+1); return [(v&0x3fff)+1,((v>>14)&0x3fff)+1]; }
    i=d+size+(size%2);
  }
  throw new Error(`${file}: WEBP dimensions not found`);
}
function links(html){ return [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({href:m[1],text:m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()})); }
const langs=[['en','index.html','/gallery/'],['hu','hu/index.html','/hu/gallery/'],['de','de-at/index.html','/de-at/gallery/']];
for (const [lang,file,gallery] of langs){
  const html=read(file);
  const serviceMenu=(html.match(/<li class="nav-services">[\s\S]*?<\/li><li><a href="\/[^>]*gallery/g)||[])[0]||'';
  const serviceLinks=[...serviceMenu.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
  assert(serviceLinks.length===6, `${file}: service submenu must contain exactly 6 links, found ${serviceLinks.length}`);
  assert(html.includes(`href="${gallery}"`), `${file}: gallery link missing from navigation`);
  const cardLinks=links(html).filter(l=>/Read the approach|A megközelítés|Zur Arbeitsweise/.test(l.text)).map(l=>l.href);
  for (const href of cardLinks) assert(serviceLinks.includes(href), `${file}: home service card link not present in Services submenu: ${href}`);
}
const pricing=JSON.parse(read('pricing.json'));
for (const key of ['individualQuick30','headshotCvGross','brandFastOneHour','eventOneHour','travelPerVehicleGross']) {
  assert(Number(pricing.priceComponentsGrossEUR[key])>0, `pricing.json: ${key} must be positive`);
}
const qjs=read('assets/js/quote-calculator.js');
assert(qjs.includes('window.BANHALMI_PRICING_DATA'), 'quote calculator must use embedded pricing fallback');
assert(qjs.includes("root.querySelector('[data-estimate-gross]')"), 'quote calculator must paint summary outside the form scope');
assert(!/return\{gross:0[\s\S]*pricingReady:true/.test(qjs), 'quote calculator must not report ready with zero pricing');
const css=read('assets/css/style.css');
assert(!/input[^{}]*\{[^}]*position\s*:\s*absolute/i.test(css), 'checkbox/radio inputs must not be absolutely positioned');
assert(/\.option-row,[\s\S]*\.category-card\{display:grid/.test(css), 'option rows must use grid alignment');
assert(!/word-break\s*:\s*break-all/i.test(css), 'global aggressive word breaking is forbidden');
assert(!/(?:filter|backdrop-filter|-webkit-backdrop-filter)\s*:[^;{}]*blur\s*\((?!\s*0(?:px|rem|em|%)?\s*\))/i.test(css), 'production CSS must not contain non-zero blur effects');
if (read('assets/js/main.js').includes('info-modal')) {
  for (const cls of ['info-modal','info-modal-panel','info-modal-header','info-modal-close','info-modal-content']) {
    assert(css.includes(`.${cls}`), `main.js references .info-modal but CSS is missing .${cls}`);
  }
}
const processFiles=[];
function walk(dir){ for(const e of fs.readdirSync(dir,{withFileTypes:true})){ if(['.git','node_modules'].includes(e.name)) continue; const p=path.join(dir,e.name); if(e.isDirectory()) walk(p); else if(e.name.endsWith('.html') && read(p).includes('strategic-partnership-section')) processFiles.push(p.replace(/\\/g,'/')); }}
walk('.');
const allowed=new Set(['index.html','hu/index.html','de-at/index.html','about/index.html','lifestyle/index.html','hu/brand/index.html','de-at/brand/index.html']);
for (const p of processFiles) assert(allowed.has(p.replace(/^\.\//,'')), `process block appears on non-approved page: ${p}`);
for (const p of ['gallery/index.html','hu/gallery/index.html','de-at/gallery/index.html']){
  assert(exists(p), `${p}: gallery page missing`);
  const h=read(p);
  const imgs=[...h.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]).filter(src=>!src.includes('banhalmi-logo'));
  assert(new Set(imgs).size===imgs.length, `${p}: duplicate gallery image`);
  for(const src of imgs) assert(exists(src.replace(/^\//,'')), `${p}: missing gallery image ${src}`);
  assert(h.includes('rel="canonical"') && h.includes('hreflang="x-default"'), `${p}: SEO canonical/hreflang missing`);
  assert(h.includes('application/ld+json') && h.includes('CollectionPage') && h.includes('BreadcrumbList') && h.includes('ImageObject'), `${p}: gallery structured data missing`);
  const imgTags=[...h.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*width="(\d+)"[^>]*height="(\d+)"/g)];
  for(const m of imgTags){
    const local=m[1].replace(/^\//,''); const declared=[Number(m[2]),Number(m[3])]; const actual=webpSize(local);
    assert(declared[0]>0 && declared[1]>0, `${p}: ${m[1]} width/height must be positive`);
    assert(declared[0]===actual[0] && declared[1]===actual[1], `${p}: ${m[1]} declared ${declared.join('x')} != actual ${actual.join('x')}`);
    assert((declared[0]>=declared[1])===(actual[0]>=actual[1]), `${p}: ${m[1]} orientation mismatch`);
  }
  assert(h.includes('lightbox-prev') && h.includes('lightbox-next') && h.includes('aria-modal="true"'), `${p}: accessible gallery lightbox controls missing`);
}
const sitemap=read('sitemap.xml');
for(const u of ['/gallery/','/hu/gallery/','/de-at/gallery/']) assert(sitemap.includes(`https://www.norbertbanhalmi.com${u}`), `sitemap missing ${u}`);
if(fail.length){ console.error(fail.map(x=>'✗ '+x).join('\n')); process.exit(1); }
console.log('Production audit regression checks passed.');
