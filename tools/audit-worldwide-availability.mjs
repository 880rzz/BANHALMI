import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const scanExtensions = new Set(['.html', '.json', '.jsonld', '.txt']);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '_site', 'artifacts'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && scanExtensions.has(path.extname(entry.name))) {
      const text = fs.readFileSync(full, 'utf8');
      if (/\bacross Europe\b/i.test(text)) failures.push(`${path.relative(root, full)}: legacy Europe-only availability wording remains`);
    }
  }
}

walk(root);

for (const file of ['ai-entry.json', 'entity-identity-contract.json', 'llms.txt']) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  if (!/worldwide/i.test(text)) failures.push(`${file}: documented worldwide project availability missing`);
}

if (failures.length) {
  console.error('Worldwide availability consistency audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Worldwide availability consistency passed: no Europe-only legacy wording remains in public machine/content sources.');
