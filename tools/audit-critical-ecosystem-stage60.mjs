import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const walk = async (dir) => {
  const out = [];
  for (const name of await readdir(dir)) {
    if (['.git','node_modules','_site','playwright-report','test-results'].includes(name)) continue;
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...await walk(p));
    else out.push(p);
  }
  return out;
};
const rel = p => path.relative(root,p).replaceAll('\\','/');
const text = async p => readFile(p,'utf8');
const files = await walk(root);
const htmlFiles = files.filter(p => p.endsWith('.html'));
const indexable = [];
const redirects = [];
const titles = new Map();
const descriptions = new Map();

for (const p of htmlFiles) {
  const r = rel(p); const h = await text(p);
  const isRedirect = /http-equiv=["']refresh["']|location\.(?:href|replace)|window\.location/i.test(h);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(h) || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots/i.test(h);
  if (isRedirect) { redirects.push(r); continue; }
  if (noindex || /404\.html$/.test(r)) continue;
  indexable.push(r);
  const lang = h.match(/<html[^>]+lang=["']([^"']+)/i)?.[1];
  const title = h.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const desc = h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1]?.trim() || h.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1]?.trim();
  const canonical = h.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1];
  if (!lang) errors.push(`${r}: missing html lang`);
  if (!title) errors.push(`${r}: missing title`);
  if (!desc) errors.push(`${r}: missing meta description`);
  if (!canonical) errors.push(`${r}: missing canonical`);
  if (!/<h1\b/i.test(h)) errors.push(`${r}: missing H1`);
  if (title) { const a=titles.get(title)||[]; a.push(r); titles.set(title,a); }
  if (desc) { const a=descriptions.get(desc)||[]; a.push(r); descriptions.set(desc,a); }
  for (const m of h.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch { errors.push(`${r}: invalid JSON-LD`); }
  }
}

for (const [v, rs] of titles) if (rs.length > 1 && rs.every(x => !/case-studies|esettanulmanyok|fallstudien/.test(x))) errors.push(`duplicate indexable title: ${v} :: ${rs.join(', ')}`);
for (const [v, rs] of descriptions) if (rs.length > 2) errors.push(`description reused ${rs.length}x: ${v.slice(0,80)}… :: ${rs.join(', ')}`);

const strategic = {
  'portrait/index.html': ['executive','headshot','cv','dating profile','artist portfolio','Budapest','Vienna'],
  'hu/portre/index.html': ['executive','headshot','önéletrajz','társkereső','művész','Budapest','Bécs'],
  'de-at/portrait/index.html': ['Executive','Headshot','Bewerbungs','Dating','Künstler','Budapest','Wien']
};
for (const [r, needles] of Object.entries(strategic)) {
  const h = await text(path.join(root,r));
  for (const n of needles) if (!h.toLocaleLowerCase().includes(n.toLocaleLowerCase())) errors.push(`${r}: missing strategic intent “${n}”`);
  if (!h.includes('Q56391118') || !h.includes('https://www.norbertbanhalmi.com/about/')) errors.push(`${r}: Wikidata-first Person contract incomplete`);
  if (!/peter-magyar-portrait-2026|magyar-peter-portre-2026|peter-magyar-portraet-2026/.test(h)) errors.push(`${r}: flagship Magyar/Peter portrait evidence not linked`);
}

for (const r of ['case-studies/peter-magyar-portrait-2026/index.html','hu/esettanulmanyok/magyar-peter-portre-2026/index.html','de-at/fallstudien/peter-magyar-portraet-2026/index.html']) {
  const h = await text(path.join(root,r));
  if (!h.includes('Q56391118')) errors.push(`${r}: flagship case study missing Wikidata Person evidence`);
}

for (const p of files.filter(p => p.endsWith('.json'))) {
  try { JSON.parse(await text(p)); } catch { errors.push(`${rel(p)}: invalid JSON`); }
}
const ai = await text(path.join(root,'ai.txt'));
for (const n of ['Executive portrait','Headshot','CV / resume','dating profile','artist portfolio','Budapest','Vienna','Q56391118']) if (!ai.toLowerCase().includes(n.toLowerCase())) errors.push(`ai.txt: missing intent/entity “${n}”`);
const llms = await text(path.join(root,'llms.txt'));
if (!/ai\.txt|knowledge|services/i.test(llms)) errors.push('llms.txt: missing machine-readable discovery bridge');

if (errors.length) {
  console.error(`Stage60 critical ecosystem audit failed with ${errors.length} issue(s):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log(`Stage60 critical ecosystem audit passed: ${htmlFiles.length} HTML, ${indexable.length} indexable candidates, ${redirects.length} redirect surfaces inventoried; canonical redirect behavior remains enforced by the dedicated redirect/routing audits; all JSON parseable, strategic EN/HU/DE intent and Wikidata-first evidence locked.`);
