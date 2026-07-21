import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

const replacements = [
  [
    'Technikai megfelelőségi tervezet, amelyet az aktív szolgáltatói szerződések és az osztrák jog alapján véglegesíteni szükséges.',
    'Ez a tájékoztató a weboldalon jelenleg alkalmazott adatkezelési folyamatokat ismerteti.'
  ],
  [
    'I have read the Privacy Policy and agree that my details may be used to respond to my enquiry.',
    'I have read and acknowledge the Privacy Policy.'
  ],
  [
    'Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Beantwortung meiner Anfrage verwendet werden.',
    'Ich habe die Datenschutzerklärung gelesen und zur Kenntnis genommen.'
  ]
];

walk(root);
let changed = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  for (const [from, to] of replacements) html = html.replaceAll(from, to);
  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`Compliance wording normalized in ${changed} HTML file(s).`);
