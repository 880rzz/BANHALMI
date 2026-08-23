import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '_site');
const forbidden = [
  '.gitignore', '.DS_Store', '.emergency-pages-deploy-trigger',
  'package.json', 'package-lock.json', 'README.md',
  'vercel.json', 'netlify.toml', 'middleware.js',
  'playwright.config.js', 'playwright.config.mjs',
  'lighthouserc.mobile.cjs', 'lighthouserc.desktop.cjs',
  'lighthouserc.production-mobile.cjs', 'lighthouserc.production-desktop.cjs',
  'tests', 'scripts', 'docs', 'reports'
];

for (const rel of forbidden) {
  fs.rmSync(path.join(root, rel), { recursive: true, force: true });
}

for (const rel of forbidden) {
  if (fs.existsSync(path.join(root, rel))) {
    throw new Error(`Production artifact leaked repository-only path: ${rel}`);
  }
}

const required = [
  'index.html', 'hu/index.html', 'de-at/index.html',
  'robots.txt', 'sitemap.xml', 'llms.txt', 'ai.txt',
  '.well-known/agent.json', 'api/v1/identity.json',
  'assets/css/site.css', 'assets/js/analytics.js', 'deployment-sha.txt'
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Production artifact lost required public file: ${rel}`);
}

console.log(`Production surface hardened: ${forbidden.length} repository-only paths are excluded and ${required.length} public contracts are present.`);
