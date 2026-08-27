import fs from 'node:fs';
import path from 'node:path';
import { generateMachineProjections } from './generate-machine-projections.mjs';

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

let skipLinksAdded = 0;
let buttonTypesAdded = 0;
for (const file of walkHtml(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const skip = ensureSkipLink(html);
  if (skip.changed && !/class=["'][^"']*\bskip-link\b/i.test(html)) skipLinksAdded += 1;
  html = skip.html;
  const buttons = addExplicitButtonTypes(html);
  buttonTypesAdded += buttons.changed;
  html = buttons.html;
  fs.writeFileSync(file, html);
}

generateMachineProjections(root);

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
  'data/machine-core.json', 'machine-manifest.json'
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Production artifact lost required public file: ${rel}`);
}

console.log(`Production surface hardened: ${forbidden.length} repository-only paths excluded; ${required.length} public contracts present; ${skipLinksAdded} missing skip links and ${buttonTypesAdded} non-form button types normalized.`);
