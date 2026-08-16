import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2);
if (!roots.length) {
  console.error('Usage: node tools/audit-lighthouse-all-runs.mjs <report-dir> [...]');
  process.exit(2);
}

const minimumScores = {
  performance: 0.99,
  accessibility: 1,
  'best-practices': 1,
  seo: 1
};
const quotePerformanceMinimum = 0.98;
const quotePaths = new Set([
  '/requestaquote/',
  '/hu/ajanlatkeres/',
  '/de-at/anfrage/'
]);
const reports = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.report.json')) reports.push(full);
  }
}

function pathnameFor(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
}

for (const root of roots) walk(root);

if (!reports.length) {
  console.error(`No Lighthouse .report.json files found under: ${roots.join(', ')}`);
  process.exit(1);
}

const failures = [];
for (const file of reports.sort()) {
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  const url = report.finalDisplayedUrl || report.finalUrl || report.requestedUrl || file;
  const pathname = pathnameFor(url);
  const isQuoteRoute = quotePaths.has(pathname);

  for (const [category, defaultMinimum] of Object.entries(minimumScores)) {
    const minimum = category === 'performance' && isQuoteRoute
      ? quotePerformanceMinimum
      : defaultMinimum;
    const score = report.categories?.[category]?.score;
    if (typeof score !== 'number' || score < minimum) {
      failures.push(`${url} :: ${category}=${score ?? 'missing'} (required >= ${minimum.toFixed(2)}) :: ${file}`);
    }
  }
}

if (failures.length) {
  console.error('Lighthouse per-run release gate failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Lighthouse per-run release gate passed: ${reports.length} reports; performance >= 0.99 generally, >= 0.98 on the three quote routes, and accessibility/best-practices/seo = 1.00.`);
