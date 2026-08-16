import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PERSON_ID = 'https://www.norbertbanhalmi.com/about/';
const ORG_ID = 'https://www.norbertbanhalmi.com/#organization';
const BRAND_ID = 'https://www.norbertbanhalmi.com/#brand';
const SERVICE_ID = 'https://www.norbertbanhalmi.com/#visual-trust-partnership';
const LEGAL_NAME = 'Norbert Banhalmi e.U.';
let changedFiles = 0;

function types(node) {
  const value = node?.['@type'];
  return Array.isArray(value) ? value : value ? [value] : [];
}

function normalizeServed(value) {
  const items = Array.isArray(value) ? value.filter((item) => item !== 'Europe') : [];
  if (!items.includes('Worldwide')) items.push('Worldwide');
  return items;
}

function normalizeNodes(data) {
  const graph = Array.isArray(data?.['@graph']) ? data['@graph'] : null;
  const nodes = graph || [data];
  let changed = false;

  const person = nodes.find((n) => n?.['@id'] === PERSON_ID && types(n).includes('Person'));
  const org = nodes.find((n) => n?.['@id'] === ORG_ID && types(n).includes('Organization'));
  let brand = nodes.find((n) => n?.['@id'] === BRAND_ID && types(n).includes('Brand'));
  const service = nodes.find((n) => n?.['@id'] === SERVICE_ID && types(n).includes('Service'));

  if (person && Array.isArray(person.alternateName) && person.alternateName.includes('BANHALMI')) {
    person.alternateName = person.alternateName.filter((value) => value !== 'BANHALMI');
    changed = true;
  }

  if (org) {
    if (org.name !== LEGAL_NAME) { org.name = LEGAL_NAME; changed = true; }
    if (org.legalName !== LEGAL_NAME) { org.legalName = LEGAL_NAME; changed = true; }
    const desiredAlts = ['BANHALMI'];
    if (JSON.stringify(org.alternateName || []) !== JSON.stringify(desiredAlts)) { org.alternateName = desiredAlts; changed = true; }
    if (org.brand?.['@id'] !== BRAND_ID) { org.brand = { '@id': BRAND_ID }; changed = true; }
    const served = normalizeServed(org.areaServed);
    if (JSON.stringify(served) !== JSON.stringify(org.areaServed || [])) { org.areaServed = served; changed = true; }
  }

  if (person && org && graph && !brand) {
    brand = {
      '@type': 'Brand',
      '@id': BRAND_ID,
      name: 'BANHALMI',
      url: 'https://www.norbertbanhalmi.com/',
      owner: { '@id': ORG_ID },
      founder: { '@id': PERSON_ID }
    };
    const orgIndex = graph.indexOf(org);
    graph.splice(orgIndex + 1, 0, brand);
    changed = true;
  }

  if (service) {
    const served = normalizeServed(service.areaServed);
    if (JSON.stringify(served) !== JSON.stringify(service.areaServed || [])) { service.areaServed = served; changed = true; }
  }

  return changed;
}

function writeJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  if (!normalizeNodes(data)) return;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  changedFiles++;
}

function writeHtml(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const re = /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi;
  let fileChanged = false;
  const next = raw.replace(re, (whole, open, body, close) => {
    let data;
    try { data = JSON.parse(body); } catch { return whole; }
    if (!normalizeNodes(data)) return whole;
    fileChanged = true;
    return `${open}${JSON.stringify(data)}${close}`;
  });
  if (fileChanged) {
    fs.writeFileSync(file, next);
    changedFiles++;
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '_site', 'artifacts'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) writeHtml(full);
  }
}

walk(ROOT);
writeJson(path.join(ROOT, 'entity.jsonld'));
writeJson(path.join(ROOT, 'brand-positioning.jsonld'));
console.log(`Normalized canonical entity roles in ${changedFiles} file(s).`);
