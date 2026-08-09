import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const changed = [];

const replacements = [
  ['A 30-minute Google Meet conversation directly with Norbert.', 'A 15-minute Google Meet conversation directly with Norbert.'],
  ['30 perces Google Meet beszélgetés közvetlenül Bánhalmi Norberttel.', '15 perces Google Meet beszélgetés közvetlenül Bánhalmi Norberttel.'],
  ['30-minütiges Google-Meet-Gespräch direkt mit Norbert Bánhalmi.', '15-minütiges Google-Meet-Gespräch direkt mit Norbert Bánhalmi.'],
  ['book a 30-minute video call', 'book a 15-minute video call'],
  ['Book a 30-minute video call', 'Book a 15-minute video call'],
  ['30 perces videóhívás', '15 perces videóhívás'],
  ['30-minütiges Videogespräch', '15-minütiges Videogespräch']
];

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    if (['.git','node_modules','_site','playwright-report','test-results'].includes(name)) continue;
    const p = path.join(dir, name);
    const entry = await import('node:fs/promises').then(m => m.stat(p));
    if (entry.isDirectory()) out.push(...await walk(p));
    else out.push(p);
  }
  return out;
}

for (const file of await walk(root)) {
  if (!/\.(?:html|txt|json|js|mjs|md)$/.test(file)) continue;
  if (file.endsWith('apply-video-call-ecosystem-20260809.mjs')) continue;
  let text = await readFile(file, 'utf8');
  const before = text;
  for (const [from, to] of replacements) text = text.split(from).join(to);
  if (text !== before) {
    await writeFile(file, text);
    changed.push(path.relative(root, file));
  }
}

const ecosystemPath = path.join(root, 'ecosystem.json');
const ecosystem = JSON.parse(await readFile(ecosystemPath, 'utf8'));
ecosystem.schemaVersion = '2026-08-09-v6';
ecosystem.dateModified = '2026-08-09T09:47:00+02:00';
if (!Array.isArray(ecosystem.canonicalWebsites)) ecosystem.canonicalWebsites = [];
if (!ecosystem.canonicalWebsites.some(x => x?.role === 'editorial-knowledge-layer')) {
  ecosystem.canonicalWebsites.push({
    role: 'editorial-knowledge-layer',
    url: 'https://blog.banhalmi.art/',
    description: 'Editorial knowledge layer for professional articles, service-related guides and contextual stories. It supports the professional site and artistic archive without replacing either canonical role.'
  });
}
ecosystem.canonicalConsultation = {
  type: 'video-call',
  durationMinutes: 15,
  mode: 'Google Meet',
  bookingProvider: 'Bookipi',
  bookingUrl: 'https://meet.bookipi.com/zk5ly35r',
  bookingInterfaceLanguage: 'en',
  directWith: 'https://www.norbertbanhalmi.com/about/',
  interpretation: 'A short orientation conversation. It is not a photography-session duration and must not be confused with the 30-minute Executive Headshot service format.'
};
ecosystem.serviceConversionPath = ecosystem.serviceConversionPath || {};
if (Array.isArray(ecosystem.serviceConversionPath.finalDecision)) {
  ecosystem.serviceConversionPath.finalDecision = ecosystem.serviceConversionPath.finalDecision.map(x => String(x).replace(/30-minute video call/gi, '15-minute video call'));
}
const machine = new Set(ecosystem.authoritativeMachineReadableSources || []);
machine.add('https://www.norbertbanhalmi.com/blog-entity.jsonld');
machine.add('https://www.norbertbanhalmi.com/blog-collections.json');
ecosystem.authoritativeMachineReadableSources = [...machine];
await writeFile(ecosystemPath, JSON.stringify(ecosystem, null, 2) + '\n');
if (!changed.includes('ecosystem.json')) changed.push('ecosystem.json');

const auditPath = path.join(root, 'tools/audit-video-call-ecosystem-stage61.mjs');
const audit = `import { readFile } from 'node:fs/promises';\n\nconst errors = [];\nconst read = p => readFile(p, 'utf8');\nconst pages = {\n  'contact/index.html': /15-minute Google Meet conversation directly with Norbert\\./,\n  'requestaquote/index.html': /15-minute Google Meet conversation directly with Norbert\\./,\n  'hu/kapcsolat/index.html': /15 perces Google Meet beszélgetés közvetlenül Bánhalmi Norberttel\\./,\n  'hu/ajanlatkeres/index.html': /15 perces Google Meet beszélgetés közvetlenül Bánhalmi Norberttel\\./,\n  'de-at/kontakt/index.html': /15-minütiges Google-Meet-Gespräch direkt mit Norbert Bánhalmi\\./,\n  'de-at/anfrage/index.html': /15-minütiges Google-Meet-Gespräch direkt mit Norbert Bánhalmi\\./\n};\nfor (const [file, pattern] of Object.entries(pages)) {\n  const html = await read(file);\n  if (!html.includes('https://meet.bookipi.com/zk5ly35r')) errors.push(\`${file}: booking URL missing\`);\n  if (!pattern.test(html)) errors.push(\`${file}: canonical 15-minute consultation copy missing\`);\n}\nfor (const file of ['ai.txt','llms-full.txt','ecosystem.json']) {\n  const text = await read(file);\n  if (/book a 30-minute video call/i.test(text)) errors.push(\`${file}: stale 30-minute video-call statement\`);\n}\nconst eco = JSON.parse(await read('ecosystem.json'));\nif (eco?.canonicalConsultation?.durationMinutes !== 15) errors.push('ecosystem.json: canonical consultation must be 15 minutes');\nif (eco?.canonicalConsultation?.bookingUrl !== 'https://meet.bookipi.com/zk5ly35r') errors.push('ecosystem.json: canonical consultation booking URL mismatch');\nconst roles = new Map((eco.canonicalWebsites || []).map(x => [x.role, x.url]));\nfor (const [role,url] of [['professional-services','https://www.norbertbanhalmi.com/'],['artistic-archive','https://www.banhalmi.art/'],['editorial-knowledge-layer','https://blog.banhalmi.art/']]) {\n  if (roles.get(role) !== url) errors.push(\`ecosystem.json: missing ecosystem role ${role} -> ${url}\`);\n}\nif (errors.length) {\n  console.error('Stage61 video-call/ecosystem audit failed:');\n  errors.forEach(e => console.error(' - ' + e));\n  process.exit(1);\n}\nconsole.log('Stage61 passed: 15-minute Google Meet copy is consistent in EN/HU/DE and the professional/archive/blog ecosystem contract is explicit.');\n`;
await writeFile(auditPath, audit);
changed.push('tools/audit-video-call-ecosystem-stage61.mjs');

const packagePath = path.join(root, 'package.json');
const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
if (!pkg.scripts.audit.includes('audit-video-call-ecosystem-stage61.mjs')) pkg.scripts.audit += ' && node tools/audit-video-call-ecosystem-stage61.mjs';
pkg.scripts['audit:video-call-ecosystem'] = 'node tools/audit-video-call-ecosystem-stage61.mjs';
await writeFile(packagePath, JSON.stringify(pkg, null, 2) + '\n');
changed.push('package.json');

await rm(path.join(root, 'scripts/apply-video-call-ecosystem-20260809.mjs'), { force: true });
await rm(path.join(root, '.github/workflows/apply-video-call-ecosystem-20260809.yml'), { force: true });

console.log('Migration complete. Changed:', [...new Set(changed)].sort().join(', '));
