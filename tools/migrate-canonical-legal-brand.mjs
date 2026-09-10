import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const allowedExt = new Set(['.html','.json','.jsonld','.txt','.md','.mjs','.js','.cjs','.yml','.yaml','.xml']);
const skipDirs = new Set(['.git','node_modules']);
const selfRel = 'tools/migrate-canonical-legal-brand.mjs';
const canonicalLegal = 'Banhalmi Norbert e.U.';
const oldLegal = ['Norbert','Banhalmi','e.U.'].join(' ');
const oldLegalAccented = ['Bánhalmi','Norbert','e.U.'].join(' ');
const primaryBrand = 'BANHALMI';
const secondaryBrand = 'BANHALMI Photography';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && allowedExt.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function normalizeFooter(html) {
  return html.replace(/<footer\b[\s\S]*?<\/footer>/gi, footer => {
    let out = footer;
    out = out.replace(/(<(?:div|p|span|strong|a)[^>]*class=["'][^"']*footer-brand[^"']*["'][^>]*>\s*)BANHALMI(\s*<\/)/gi, `$1${secondaryBrand}$2`);
    out = out.replace(/©\s*BANHALMI(?!\s+Photography)/g, `© ${secondaryBrand}`);
    return out;
  });
}

let changedFiles = 0;
let changedLegalTokens = 0;
for (const file of walk(root)) {
  const rel = path.relative(root, file).replaceAll('\\','/');
  if (rel === selfRel) continue;
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  const oldCount = text.split(oldLegal).length - 1;
  const oldAccentedCount = text.split(oldLegalAccented).length - 1;
  changedLegalTokens += oldCount + oldAccentedCount;
  text = text.replaceAll(oldLegal, canonicalLegal).replaceAll(oldLegalAccented, canonicalLegal);
  text = text.replace(/Norbert Banhalmi\s*[–-]\s*[^<\n"]{1,140}?e\.U\./g, canonicalLegal);
  if (path.extname(file).toLowerCase() === '.html') text = normalizeFooter(text);
  if (text !== before) {
    fs.writeFileSync(file, text, 'utf8');
    changedFiles += 1;
  }
}

function updateJson(rel, updater) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(obj);
  fs.writeFileSync(file, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

updateJson('data/machine-core.json', core => {
  core.organization.name = canonicalLegal;
  core.organization.legalName = canonicalLegal;
  core.brand.name = primaryBrand;
  core.brand.alternateName = [secondaryBrand];
  core.brand.namingRule = `${primaryBrand} is the primary brand. ${secondaryBrand} is the secondary/commercial photography brand name of the same brand and is not a separate company or Organization.`;
  core.disambiguationRules = Array.isArray(core.disambiguationRules) ? core.disambiguationRules : [];
  const rule = `${secondaryBrand} is a secondary/commercial brand name of ${primaryBrand}; never model it as a separate company, Organization or legal entity.`;
  if (!core.disambiguationRules.includes(rule)) core.disambiguationRules.push(rule);
});

updateJson('entity-identity-contract.json', contract => {
  contract.version = '2026-09-10-v5';
  contract.dateModified = '2026-09-10T07:00:00+02:00';
  contract.canonicalOrganization.name = canonicalLegal;
  contract.canonicalOrganization.legalName = canonicalLegal;
  delete contract.canonicalOrganization.alternateName;
  contract.canonicalBrand.name = primaryBrand;
  contract.canonicalBrand.alternateName = [secondaryBrand];
  contract.canonicalBrand.namingPriority = { primary: primaryBrand, secondary: secondaryBrand };
  contract.rules = Array.isArray(contract.rules) ? contract.rules : [];
  const rule = `${secondaryBrand} is the secondary/commercial photography brand name of ${primaryBrand}; it is not a separate company, Organization or legal entity.`;
  if (!contract.rules.includes(rule)) contract.rules.push(rule);
});

const generatorPath = path.join(root, 'tools/generate-machine-projections.mjs');
if (fs.existsSync(generatorPath)) {
  let g = fs.readFileSync(generatorPath, 'utf8');
  g = g.replace("graph.push({ '@type': 'Brand', '@id': core.brand.id, name: core.brand.name, url: core.canonicalUrl, owner: reference(core.organization.id), founder: reference(core.person.id), description: core.brand.positioning, dateModified });",
    "graph.push({ '@type': 'Brand', '@id': core.brand.id, name: core.brand.name, alternateName: core.brand.alternateName, url: core.canonicalUrl, owner: reference(core.organization.id), founder: reference(core.person.id), description: core.brand.positioning, dateModified });");
  g = g.replace("- ${canonicalLegal}: canonical legal company entity. Wikidata Q138425941.\\n- Viko Speier:",
    "- ${canonicalLegal}: canonical legal company entity. Wikidata Q138425941.\\n- ${secondaryBrand}: secondary/commercial photography brand name of ${primaryBrand}; not a separate company or Organization.\\n- Viko Speier:");
  fs.writeFileSync(generatorPath, g, 'utf8');
}

console.log(`Canonical identity migration complete: ${changedFiles} text files normalized; ${changedLegalTokens} legacy legal-name tokens replaced.`);
