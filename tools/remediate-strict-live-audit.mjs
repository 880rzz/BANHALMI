import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git','node_modules','.github','test-results','playwright-report'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:html|json|jsonld|md|txt)$/i.test(entry.name)) files.push(full);
  }
}

const replacements = [
  [/for\s+more\s+than\s+since\s+1999/giu, 'since 1999'],
  [/more\s+than\s+since\s+1999/giu, 'since 1999'],
  [/more\s+than\s+twenty[\s\u2010-\u2015-]*five\s+years/giu, 'since 1999'],
  [/twenty[\s\u2010-\u2015-]*five\s+years/giu, 'since 1999'],
  [/több\s+mint\s+1999\s+óta/giu, '1999 óta'],
  [/több\s+mint\s+huszonöt\s+év(?:es|e)?/giu, '1999 óta épülő'],
  [/huszonöt\s+év(?:es|e)?/giu, '1999 óta épülő'],
  [/seit\s+seit\s+1999/giu, 'seit 1999'],
  [/seit\s+einer\s+seit\s+1999\s+aufgebauten\s+Praxis/giu, 'seit 1999'],
  [/einer\s+seit\s+1999\s+aufgebauten\s+Praxis/giu, 'seit 1999'],
  [/mehr\s+als\s+fünfundzwanzig\s+Jahren/giu, 'seit 1999'],
  [/fünfundzwanzig\s+Jahren/giu, 'seit 1999'],
  [/Norbert Banhalmi e\.U\./g, 'Bánhalmi Norbert e.U.'],
  [/banhalmi_consent_v2/g, 'banhalmi_consent_v3'],
  [/Technikai megfelelőségi tervezet[^<.]*(?:\.|<)/giu, 'A tájékoztató a weboldal jelenlegi adatkezelési működését írja le.<'],
];

await walk(root);
const changed = [];
for (const file of files) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  const original = await readFile(file, 'utf8');
  let content = original;
  for (const [pattern, replacement] of replacements) content = content.replace(pattern, replacement);

  if (/^(?:requestaquote|hu\/ajanlatkeres|de-at\/anfrage)\/index\.html$/.test(rel)) {
    content = content
      .replace(/<label([^>]*for=["']name["'][^>]*)>\s*Name\s*<\/label>/i, '<label$1>Name <span aria-hidden="true">*</span></label>')
      .replace(/<label([^>]*for=["']name["'][^>]*)>\s*Név\s*<\/label>/i, '<label$1>Név <span aria-hidden="true">*</span></label>')
      .replace(/<input([^>]*\bname=["']name["'][^>]*)>/i, (m, attrs) => /\brequired\b/i.test(attrs) ? m : `<input${attrs} required>`);
  }

  content = content.replace(/<(p|div)([^>]*class=["'][^"']*(?:success|form-success|success-message)[^"']*["'][^>]*)>/gi, (m, tag, attrs) => /\bhidden\b/i.test(attrs) ? m : `<${tag}${attrs} hidden>`);
  content = content.replace(/<(p|div)([^>]*)>(\s*(?:Thank you\. Your enquiry has been sent|Köszönjük[^<]*elküldtük|Vielen Dank[^<]*gesendet)[^<]*)<\/(p|div)>/gi, (m, tag, attrs, text, closing) => /\bhidden\b/i.test(attrs) ? m : `<${tag}${attrs} hidden>${text}</${closing}>`);

  if (/^(?:privacy-policy|hu\/adatvedelem|de-at\/datenschutz)\/index\.html$/.test(rel)) {
    content = content.replace(/(?:Last updated|Utolsó frissítés|Letzte Aktualisierung):?\s*[^<]+/gi, (match) => {
      if (/Utolsó/i.test(match)) return 'Utolsó frissítés: 2026. július 26.';
      if (/Letzte/i.test(match)) return 'Letzte Aktualisierung: 26. Juli 2026';
      return 'Last updated: 26 July 2026';
    });
  }

  if (content !== original) {
    await writeFile(file, content, 'utf8');
    changed.push(rel);
  }
}
console.log(JSON.stringify({ changed, total: changed.length }, null, 2));
