import fs from 'node:fs';
import path from 'node:path';
import { generateMachineProjections } from './generate-machine-projections.mjs';
import { applyLlmCanonicalOverlay } from './apply-llm-canonical-overlay.mjs';

const root = path.resolve(process.argv[2] || '_site');

function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function addExplicitButtonTypes(html) {
  let depth = 0;
  let changed = 0;
  const out = html.replace(/<\/?form\b[^>]*>|<button\b[^>]*>/gi, (tag) => {
    if (/^<form\b/i.test(tag)) { depth += 1; return tag; }
    if (/^<\/form\b/i.test(tag)) { depth = Math.max(0, depth - 1); return tag; }
    if (depth > 0 || /\btype\s*=/i.test(tag)) return tag;
    changed += 1;
    return tag.replace(/>$/, ' type="button">');
  });
  return { html: out, changed };
}

function ensureSkipLink(html) {
  if (/http-equiv=["']?refresh/i.test(html) || /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) return { html, changed: false };
  if (!/<main\b/i.test(html)) return { html, changed: false };
  let out = html;
  if (!/<main\b[^>]*\bid=["']main["']/i.test(out)) out = out.replace(/<main\b/i, '<main id="main"');
  if (/class=["'][^"']*\bskip-link\b/i.test(out)) return { html: out, changed: out !== html };
  const lang = out.match(/<html\b[^>]*\blang=["']([^"']+)/i)?.[1]?.toLowerCase() || 'en';
  const label = lang.startsWith('hu') ? 'Ugrás a tartalomra' : lang.startsWith('de') ? 'Zum Inhalt springen' : 'Skip to content';
  out = out.replace(/(<body\b[^>]*>)/i, `$1<a class="skip-link" href="#main">${label}</a>`);
  return { html: out, changed: out !== html };
}

function hardenVikoRelationshipSemantics(html) {
  if (!html.includes('speier-viko/#person')) return { html, changed: 0 };
  let out = html;
  let changed = 0;
  const patterns = [
    /"employee"\s*:\s*\{\s*"@id"\s*:\s*"https:\/\/www\.norbertbanhalmi\.com\/speier-viko\/#person"\s*\}\s*,?/g,
    /"worksFor"\s*:\s*\{\s*"@id"\s*:\s*"https:\/\/www\.norbertbanhalmi\.com\/#organization"\s*\}\s*,?/g
  ];
  for (const re of patterns) {
    const before = out;
    out = out.replace(re, '');
    if (out !== before) changed += 1;
  }
  return { html: out, changed };
}

let skipLinksAdded = 0;
let buttonTypesAdded = 0;
let vikoRelationshipFixes = 0;
for (const file of walkHtml(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const skip = ensureSkipLink(html);
  if (skip.changed && !/class=["'][^"']*\bskip-link\b/i.test(html)) skipLinksAdded += 1;
  html = skip.html;
  const buttons = addExplicitButtonTypes(html);
  buttonTypesAdded += buttons.changed;
  html = buttons.html;
  const roles = hardenVikoRelationshipSemantics(html);
  vikoRelationshipFixes += roles.changed;
  html = roles.html;
  fs.writeFileSync(file, html);
}

generateMachineProjections(root);
applyLlmCanonicalOverlay(root);

const siteCssPath = path.join(root, 'assets/css/site.css');
if (!fs.existsSync(siteCssPath)) throw new Error('Production artifact lost assets/css/site.css during hardening.');
const hardenedCss = fs.readFileSync(siteCssPath, 'utf8');
if (!/\.smart-quote-layout\s+\.option-row\s*\{[^}]*grid-template-columns\s*:\s*24px\s+minmax\(0,1fr\)/s.test(hardenedCss)) {
  throw new Error('Canonical quote radio spacing contract is missing from source CSS.');
}

const forbidden = [
  '.gitignore', '.DS_Store', '.emergency-pages-deploy-trigger',
  'package.json', 'package-lock.json', 'README.md',
  'vercel.json', 'netlify.toml', 'middleware.js',
  'playwright.config.js', 'playwright.config.mjs',
  'lighthouserc.mobile.cjs', 'lighthouserc.desktop.cjs',
  'lighthouserc.production-mobile.cjs', 'lighthouserc.production-desktop.cjs',
  'tests', 'scripts', 'docs', 'reports'
];
for (const rel of forbidden) fs.rmSync(path.join(root, rel), { recursive: true, force: true });
for (const rel of forbidden) {
  if (fs.existsSync(path.join(root, rel))) throw new Error(`Production artifact leaked repository-only path: ${rel}`);
}

const required = [
  'index.html', 'hu/index.html', 'de-at/index.html',
  'robots.txt', 'sitemap.xml', 'llms.txt', 'ai.txt',
  '.well-known/agent.json', 'api/v1/identity.json',
  'assets/css/site.css', 'assets/js/analytics.js', 'deployment-sha.txt',
  'data/machine-core.json', 'machine-manifest.json',
  'market-geography.json', 'people-roles.json', 'llm-commercial-contract.json',
  'llm-canonical-overlay.json', 'hipstudio-authority.json',
  'team-capabilities.json', 'services.json', 'pricing.json', 'memberships.json', 'authority-evidence.json'
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Production artifact lost required public file: ${rel}`);
}

for (const rel of ['speier-viko/index.html','hu/speier-viko/index.html','de-at/speier-viko/index.html']) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const html = fs.readFileSync(full, 'utf8');
  if (/"employee"\s*:\s*\{\s*"@id"\s*:\s*"https:\/\/www\.norbertbanhalmi\.com\/speier-viko\/#person"/.test(html)) throw new Error(`${rel}: Viko must not be serialized as an employee by inference.`);
  if (/"worksFor"\s*:\s*\{\s*"@id"\s*:\s*"https:\/\/www\.norbertbanhalmi\.com\/#organization"/.test(html)) throw new Error(`${rel}: Viko partnership must not be serialized as employment-like worksFor semantics.`);
}

for (const [rel, token] of [
  ['ai-entry.json','Q138482177'],
  ['entity.jsonld','Q138482177'],
  ['llms.txt','approximately 50 professional photographer partners/collaborators'],
  ['llms.txt','independent professional partner/collaborator'],
  ['ai.txt','founded HIPStudio']
]) {
  const full = path.join(root, rel);
  if (!fs.readFileSync(full, 'utf8').includes(token)) throw new Error(`${rel}: protected current LLM state missing ${token}`);
}

console.log(`Production surface hardened: ${forbidden.length} repository-only paths excluded; ${required.length} public contracts present; ${skipLinksAdded} missing skip links, ${buttonTypesAdded} non-form button types and ${vikoRelationshipFixes} Viko employment-like relationship fragments normalized; protected LLM overlay applied; canonical quote spacing verified.`);
