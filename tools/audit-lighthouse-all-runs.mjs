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
const reportFiles = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.report.json')) reportFiles.push(full);
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

if (!reportFiles.length) {
  console.error(`No Lighthouse .report.json files found under: ${roots.join(', ')}`);
  process.exit(1);
}

const reports = reportFiles.map((file) => {
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  const url = report.finalDisplayedUrl || report.finalUrl || report.requestedUrl || file;
  return { file, report, url, pathname: pathnameFor(url) };
});

const grouped = new Map();
for (const item of reports) {
  if (!grouped.has(item.url)) grouped.set(item.url, []);
  grouped.get(item.url).push(item);
}

function reportFailures(item) {
  const isQuoteRoute = quotePaths.has(item.pathname);
  const failures = [];
  for (const [category, defaultMinimum] of Object.entries(minimumScores)) {
    const minimum = category === 'performance' && isQuoteRoute
      ? quotePerformanceMinimum
      : defaultMinimum;
    const score = item.report.categories?.[category]?.score;
    if (typeof score !== 'number' || score < minimum) {
      failures.push(`${category}=${score ?? 'missing'} (required >= ${minimum.toFixed(2)})`);
    }
  }
  return failures;
}

const failures = [];
for (const [url, group] of grouped.entries()) {
  const evaluated = group.map((item) => ({ item, failures: reportFailures(item) }));
  const passing = evaluated.filter((entry) => entry.failures.length === 0);
  const requiredPasses = group.length >= 3 ? 2 : group.length;

  if (passing.length < requiredPasses) {
    failures.push(`${url} :: ${passing.length}/${group.length} Lighthouse runs passed; required ${requiredPasses}/${group.length}.`);
    for (const entry of evaluated) {
      if (!entry.failures.length) continue;
      failures.push(`  ${entry.item.file} :: ${entry.failures.join(', ')}`);
    }
  }
}

if (failures.length) {
  console.error('Lighthouse quorum release gate failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Lighthouse quorum release gate passed: ${reports.length} reports across ${grouped.size} URL(s); at least 2 of 3 runs per URL meet performance >= 0.99 generally, >= 0.98 on the three quote routes, with accessibility/best-practices/seo = 1.00.`);
