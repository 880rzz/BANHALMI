import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const personId = 'https://www.norbertbanhalmi.com/about/';
const wkoRaw = 'partnerschaft-für-führungskräfte';
const wkoEncoded = 'partnerschaft-f%C3%BCr-f%C3%BChrungskr%C3%A4fte';

const titles = new Map(Object.entries({
  'index.html': 'BANHALMI | Executive Portrait & Brand Photography in Vienna',
  'portrait/index.html': 'Executive Portrait & Headshot Photography for Leaders | BANHALMI',
  'lifestyle/index.html': 'Brand Photography & Visual Positioning for Companies | BANHALMI',
  'event-photography/index.html': 'C-Level Event Photography for Boards & Leadership | BANHALMI',
  'glamour/index.html': 'Fine Art & Nude Art Photography in Vienna | BANHALMI',
  'hu/index.html': 'BANHALMI | Executive portré és brandfotózás Bécs–Budapest',
  'hu/portre/index.html': 'Executive portré és Headshot fotózás B2B vezetőkről | BANHALMI',
  'hu/brand/index.html': 'Brandfotózás és vizuális pozicionálás vállalatoknak | BANHALMI',
  'hu/rendezvenyfotozas/index.html': 'C-level rendezvényfotózás vezetőknek és cégeknek | BANHALMI',
  'hu/muveszi-fotografia/index.html': 'Művészi portré és aktfotózás galéria-minőségben | BANHALMI',
  'de-at/index.html': 'BANHALMI | Executive-Porträts & Brandfotografie in Wien',
  'de-at/portrait/index.html': 'Executive-Porträt & Headshot für Führungskräfte | BANHALMI',
  'de-at/brand/index.html': 'Brandfotografie & visuelle Positionierung | BANHALMI Wien',
  'de-at/eventfotografie/index.html': 'C-Level-Eventfotografie für Vorstände & Unternehmen | BANHALMI',
  'de-at/fine-art/index.html': 'Fine-Art- & Aktfotografie in Galerie-Qualität | BANHALMI Wien'
}));

const personDescriptions = {
  en: 'Strategic visual partnership for leaders and organisations. Executive portraiture, brand photography and C-level event imagery designed as one coherent system that builds visual trust.',
  hu: 'Stratégiai vizuális partnerség vezetőknek és szervezeteknek. Az executive portré, a brandfotózás és a C-level eseményfotózás egyetlen koherens rendszert alkot, amely vizuális bizalmat épít.',
  de: 'Strategische visuelle Partnerschaft für Führungskräfte und Organisationen. Executive-Porträts, Brandfotografie und C-Level-Eventbilder bilden ein kohärentes System, das visuelles Vertrauen aufbaut.'
};

const trustDescriptions = {
  'trust/index.html': 'BANHALMI Trust Center: privacy, GDPR, responsible AI, image licensing, security, accessibility and transparent project governance for professional photography.',
  'hu/bizalom/index.html': 'A BANHALMI Bizalmi Központja: GDPR-adatvédelem, felelős AI, képfelhasználási jogok, biztonság, akadálymentesség és átlátható projektműködés.',
  'de-at/vertrauen/index.html': 'BANHALMI Trust Center: DSGVO-Datenschutz, verantwortungsvolle KI, Bildlizenzen, Sicherheit, Barrierefreiheit und transparente Projektführung.'
};

function languageOf(html, rel) {
  const m = html.match(/<html\b[^>]*\blang=["']([^"']+)/i);
  const lang = (m?.[1] || '').toLowerCase();
  if (lang.startsWith('hu') || rel.startsWith('hu/')) return 'hu';
  if (lang.startsWith('de') || rel.startsWith('de-at/')) return 'de';
  return 'en';
}

function replaceMeta(html, key, value, attr = 'name') {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const re1 = new RegExp(`<meta\\b([^>]*?)${attr}=["']${key.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}["']([^>]*?)>`, 'i');
  const match = html.match(re1);
  if (match) {
    let tag = match[0];
    if (/\bcontent=["'][^"']*["']/i.test(tag)) tag = tag.replace(/\bcontent=["'][^"']*["']/i, `content="${escaped}"`);
    else tag = tag.replace(/>$/, ` content="${escaped}">`);
    return html.replace(match[0], tag);
  }
  return html.replace(/<\/head>/i, `<meta ${attr}="${key}" content="${escaped}">\n</head>`);
}

function replaceTitle(html, title) {
  const encoded = title.replaceAll('&', '&amp;');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${encoded}</title>`);
  html = replaceMeta(html, 'og:title', title, 'property');
  html = replaceMeta(html, 'twitter:title', title, 'name');
  return html;
}

function patchJsonLd(html, rel, title, trustDescription) {
  const lang = languageOf(html, rel);
  return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (full, raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return full; }
    const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('Person') && node['@id'] === personId) node.description = personDescriptions[lang];
      if (trustDescription && (types.includes('CollectionPage') || types.includes('WebPage'))) node.description = trustDescription;
      if (title && (types.includes('WebPage') || types.includes('CollectionPage') || types.includes('ProfilePage'))) {
        if (node.url || node['@id']?.includes('#webpage')) {
          node.name = title;
          if ('headline' in node) node.headline = title;
        }
      }
    }
    return full.replace(raw, JSON.stringify(data));
  });
}

const skipDirs = new Set(['.git','node_modules','dist','test-results','playwright-report']);
const textExt = new Set(['.html','.json','.jsonld','.txt','.md','.mjs','.js','.xml']);
const htmlFiles = [];
async function walk(dir) {
  for (const ent of await readdir(dir, {withFileTypes:true})) {
    if (skipDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { await walk(full); continue; }
    const rel = path.relative(root, full).replaceAll('\\','/');
    const ext = path.extname(ent.name).toLowerCase();
    if (textExt.has(ext)) {
      let src = await readFile(full, 'utf8');
      const normalized = src.replaceAll(wkoRaw, wkoEncoded);
      if (normalized !== src) { src = normalized; await writeFile(full, src, 'utf8'); }
    }
    if (ent.name.endsWith('.html')) htmlFiles.push(rel);
  }
}
await walk(root);

for (const rel of htmlFiles) {
  const full = path.join(root, rel);
  let html = await readFile(full, 'utf8');
  const title = titles.get(rel);
  const trustDescription = trustDescriptions[rel];
  if (title) html = replaceTitle(html, title);
  if (trustDescription) {
    html = replaceMeta(html, 'description', trustDescription, 'name');
    html = replaceMeta(html, 'og:description', trustDescription, 'property');
    html = replaceMeta(html, 'twitter:description', trustDescription, 'name');
  }
  html = patchJsonLd(html, rel, title, trustDescription);
  await writeFile(full, html, 'utf8');
}

const servicesPath = path.join(root, 'services.json');
const services = JSON.parse(await readFile(servicesPath, 'utf8'));
const portrait = services.itemListElement.find(s => s.position === 1);
const brand = services.itemListElement.find(s => s.position === 2);
for (const synonym of ['CEO portré','board of directors fotózás','PR headshot','Vorstandsporträt','Geschäftsführer Headshot','Pressefoto Führungskräfte']) {
  if (!portrait.alternateName.includes(synonym)) portrait.alternateName.push(synonym);
}
for (const synonym of ['sajtószoba vizuális tartalom','PR-Fotografie']) {
  if (!brand.alternateName.includes(synonym)) brand.alternateName.push(synonym);
}
services.dateModified = '2026-08-09T01:45:00+02:00';
await writeFile(servicesPath, JSON.stringify(services, null, 2) + '\n', 'utf8');

function faqItems(html, rel) {
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let data; try { data = JSON.parse(m[1]); } catch { continue; }
    const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
    const faq = nodes.find(n => n?.['@type'] === 'FAQPage');
    if (faq?.mainEntity?.length) return faq.mainEntity.map(x => ({q:x.name, a:x.acceptedAnswer?.text || ''}));
  }
  throw new Error(`${rel}: FAQPage mainEntity not found`);
}

const faqPages = [
  ['EN','faq/index.html'],
  ['HU','hu/gyik/index.html'],
  ['DE','de-at/faq/index.html']
];
let mirror = '## CANONICAL FAQ MIRROR — generated verbatim from FAQPage JSON-LD\n';
mirror += 'For legal, licensing, privacy and pricing interpretation, these answers mirror the public FAQ schema word for word. Project-specific written offers and contracts prevail where they add specific terms.\n';
for (const [label, rel] of faqPages) {
  const items = faqItems(await readFile(path.join(root, rel), 'utf8'), rel);
  if (items.length !== 19) throw new Error(`${rel}: expected 19 FAQ items, found ${items.length}`);
  mirror += `\n### ${label} FAQ (${items.length})\n`;
  items.forEach((x,i) => { mirror += `${i+1}. Q: ${x.q}\n   A: ${x.a}\n`; });
}
mirror += '## END CANONICAL FAQ MIRROR';
const aiPath = path.join(root, 'ai.txt');
let ai = await readFile(aiPath, 'utf8');
const blockRe = /## CANONICAL FAQ MIRROR — generated verbatim from FAQPage JSON-LD[\s\S]*?## END CANONICAL FAQ MIRROR/g;
ai = blockRe.test(ai) ? ai.replace(blockRe, mirror) : `${ai.trimEnd()}\n\n${mirror}\n`;
await writeFile(aiPath, ai, 'utf8');

const audit = `import assert from 'node:assert/strict';\nimport { readFile, readdir } from 'node:fs/promises';\nimport path from 'node:path';\n\nconst root=process.cwd();\nconst titles=${JSON.stringify(Object.fromEntries(titles))};\nfor (const [rel,title] of Object.entries(titles)){\n const html=await readFile(rel,'utf8');\n assert.ok(html.includes('<title>'+title.replaceAll('&','&amp;')+'</title>'),rel+' title');\n assert.ok(title.length>=45&&title.length<=68,rel+' title length '+title.length);\n}\nassert.equal(new Set(Object.values(titles)).size,Object.keys(titles).length,'titles must be unique');\nfor (const rel of ${JSON.stringify(Object.keys(trustDescriptions))}){const h=await readFile(rel,'utf8');assert.match(h,/name=[\\"']description[\\"'][^>]*content=|content=[\\"'][^\\"']+[\\"'][^>]*name=[\\"']description[\\"']/i,rel+' meta description');assert.match(h,/property=[\\"']og:description[\\"']/i,rel+' og description');assert.match(h,/\\"description\\":/i,rel+' schema description');}\nconst services=JSON.parse(await readFile('services.json','utf8'));const p=services.itemListElement.find(s=>s.position===1);const b=services.itemListElement.find(s=>s.position===2);for(const s of ['CEO portré','board of directors fotózás','PR headshot','Vorstandsporträt','Geschäftsführer Headshot','Pressefoto Führungskräfte'])assert.ok(p.alternateName.includes(s),'portrait synonym '+s);for(const s of ['sajtószoba vizuális tartalom','PR-Fotografie'])assert.ok(b.alternateName.includes(s),'brand synonym '+s);\nconst ai=await readFile('ai.txt','utf8');for(const rel of ['faq/index.html','hu/gyik/index.html','de-at/faq/index.html']){const h=await readFile(rel,'utf8');const blocks=[...h.matchAll(/<script\\b[^>]*type=[\\"']application\\/ld\\+json[\\"'][^>]*>([\\s\\S]*?)<\\/script>/gi)];let faq;for(const m of blocks){try{const d=JSON.parse(m[1]);const ns=Array.isArray(d?.['@graph'])?d['@graph']:[d];faq=ns.find(n=>n?.['@type']==='FAQPage')||faq;}catch{}}assert.equal(faq?.mainEntity?.length,19,rel+' 19 FAQ');for(const x of faq.mainEntity){assert.ok(ai.includes(x.name),rel+' Q mirrored');assert.ok(ai.includes(x.acceptedAnswer.text),rel+' A mirrored');}}\nconst files=[];async function walk(d){for(const e of await readdir(d,{withFileTypes:true})){if(['.git','node_modules','dist'].includes(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())await walk(f);else if(/\\.(html|json|jsonld|txt|md|mjs|js|xml)$/.test(e.name))files.push(f)}}await walk(root);for(const f of files){const s=await readFile(f,'utf8');assert.ok(!s.includes('partnerschaft-für-führungskräfte'),path.relative(root,f)+' raw WKO URL');}\nconst expected=${JSON.stringify(personDescriptions)};for(const rel of ['index.html','hu/index.html','de-at/index.html']){const h=await readFile(rel,'utf8');const lang=rel.startsWith('hu/')?'hu':rel.startsWith('de-at/')?'de':'en';assert.ok(h.includes(JSON.stringify(expected[lang]).slice(1,-1)),rel+' canonical Person description');}\nconsole.log('SEO/GEO/entity consistency stage59: OK');\n`;
await writeFile(path.join(root,'tools/audit-seo-entity-consistency-stage59.mjs'), audit, 'utf8');

const pkgPath = path.join(root,'package.json');
const pkg = JSON.parse(await readFile(pkgPath,'utf8'));
if(!pkg.scripts.audit.includes('audit-seo-entity-consistency-stage59.mjs')) pkg.scripts.audit += ' && node tools/audit-seo-entity-consistency-stage59.mjs';
pkg.scripts['audit:seo-entity-consistency']='node tools/audit-seo-entity-consistency-stage59.mjs';
await writeFile(pkgPath,JSON.stringify(pkg,null,2)+'\n','utf8');

console.log('Applied title, Trust Center, FAQ/ai.txt, services synonym, WKO URL and Person entity consistency fixes.');
