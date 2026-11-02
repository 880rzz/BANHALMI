import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const report = path.join(ROOT, 'docs/C2PA-READINESS-REPORT-20261101.md');
const errors = [];

if (!fs.existsSync(report)) {
  errors.push('missing docs/C2PA-READINESS-REPORT-20261101.md');
} else {
  const text = fs.readFileSync(report, 'utf8');
  if (!/\*\*Status:\s*NOT READY\*\*/i.test(text) && !/^Status:\s*NOT READY/im.test(text)) {
    errors.push('C2PA readiness report must declare Status: NOT READY');
  }
  if (!/Do\s+\*\*not\*\*|do not add decorative|intentionally/i.test(text)) {
    errors.push('C2PA readiness report must document the no-decorative-credentials decision');
  }
}

const skip = new Set(['.git', 'node_modules', '_site', 'artifacts', 'dist', 'build', 'coverage', '.next', 'out']);
const forbidden = /content credentials verified|c2pa verified|cryptographically verified|human-made photograph|not ai-generated|aiGenerated:\s*false|"c2pa"\s*:\s*"verified"/i;
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(ROOT);

for (const file of htmlFiles) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  if (forbidden.test(html)) errors.push(`${rel}: forbidden unverified C2PA / human-made claim`);
}

if (errors.length) {
  console.error('Pro C2PA no-fake-claims audit failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log(`Pro C2PA no-fake-claims audit passed: report NOT READY; ${htmlFiles.length} HTML files free of unverified Content Credentials claims.`);
