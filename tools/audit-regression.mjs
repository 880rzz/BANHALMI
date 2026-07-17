import fs from 'node:fs';
import path from 'node:path';

const fail=[];
const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
function assert(ok,msg){ if(!ok) fail.push(msg); }
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
}
const sitemap=read('sitemap.xml');
for(const u of ['/gallery/','/hu/gallery/','/de-at/gallery/']) assert(sitemap.includes(`https://www.norbertbanhalmi.com${u}`), `sitemap missing ${u}`);
if(fail.length){ console.error(fail.map(x=>'✗ '+x).join('\n')); process.exit(1); }
console.log('Production audit regression checks passed.');
