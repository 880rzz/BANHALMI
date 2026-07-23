import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = [
  'de-at/index.html',
  'de-at/eventfotografie/index.html'
];
const before = 'diplomatische geschäftliche und diplomatische Situationen';
const after = 'diplomatische und geschäftliche Situationen';
let replacements = 0;

for (const relative of files) {
  const file = path.join(root, relative);
  const input = fs.readFileSync(file, 'utf8');
  const count = input.split(before).length - 1;
  if (count > 0) {
    fs.writeFileSync(file, input.split(before).join(after));
    replacements += count;
    console.log(`Fixed ${count} occurrence(s) in ${relative}`);
  }
}

if (replacements === 0) {
  throw new Error('No duplicated German copy was found to correct');
}
console.log(`Corrected ${replacements} duplicated German copy occurrence(s).`);
