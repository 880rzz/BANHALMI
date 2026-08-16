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
  const fetchTime = Date.parse(report.fetchTime || '') || 0;
  return { file, report, url, pathname: pathnameFor(url), fetchTime };
});

// Mobile CI intentionally collects three runs per URL. The first run is a
// deterministic browser/runner warm-up and is not a release measurement; the
// following two runs remain strict per-run gates. Desktop currently collects two
// runs, so both desktop reports remain measured and no warm-up is discarded.
const grouped = new Map();
for (const item of reports) {
  const key = item.url;
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(item);
}

const measuredReports = [];
let warmupCount = 0;
for (const group of grouped.values()) {
  group.sort((a, b) => a.fetchTime - b.fetchTime || a.file.localeCompare(b.file));
  if (group.length >= 3) {
    warmupCount += 1;
    measuredReports.push(...group.slice(1));
  } else {
    measuredReports.push(...group);
  }
}

const failures = [];
for (const { file, report, url, pathname } of measuredReports) {
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
  console.error('Lighthouse measured-run release gate failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Lighthouse measured-run release gate passed: ${measuredReports.length} measured reports${warmupCount ? ` after ${warmupCount} per-URL warm-up run(s)` : ''}; performance >= 0.99 generally, >= 0.98 on the three quote routes, and accessibility/best-practices/seo = 1.00.`);
