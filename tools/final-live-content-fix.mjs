import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.github', 'test-results', 'playwright-report'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:html|json|jsonld|md|txt|mjs|js)$/i.test(entry.name)) files.push(full);
  }
}

const replacements = [
  [/Since 1999/giu, 'Since 1999'],
  [/1999 óta/giu, '1999 óta'],
  [/Seit 1999/giu, 'Seit 1999'],
  [/more\s+than\s+twenty[\s\u2010-\u2015-]*five\s+years/giu, 'since 1999'],
  [/twenty[\s\u2010-\u2015-]*five\s+years/giu, 'since 1999'],
  [/több\s+mint\s+huszonöt\s+év(?:es|e)?/giu, '1999 óta'],
  [/huszonöt\s+év(?:es|e)?/giu, '1999 óta'],
  [/mehr\s+als\s+fünfundzwanzig\s+Jahren/giu, 'seit 1999'],
  [/fünfundzwanzig\s+Jahren/giu, 'seit 1999']
];

await walk(root);
const changed = [];
for (const file of files) {
  const original = await readFile(file, 'utf8');
  let content = original;
  for (const [pattern, replacement] of replacements) content = content.replace(pattern, replacement);
  if (content !== original) {
    await writeFile(file, content, 'utf8');
    changed.push(path.relative(root, file).replaceAll(path.sep, '/'));
  }
}

for (const route of ['index.html', 'hu/index.html', 'de-at/index.html']) {
  const content = await readFile(path.join(root, route), 'utf8');
  if (/twenty[\s\u2010-\u2015-]*five\s+years|huszonöt\s+év|fünfundzwanzig\s+Jahren|more than since 1999|1999 óta|Seit 1999/iu.test(content)) {
    throw new Error(`${route}: stale or malformed duration copy remains`);
  }
}

console.log(JSON.stringify({ changed, total: changed.length }, null, 2));
