import { readdir, readFile, writeFile, rm, stat } from 'node:fs/promises';
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
    const entry = await stat(p);
    if (entry.isDirectory()) out.push(...await walk(p)); else out.push(p);
  }
  return out;
}

for (const file of await walk(root)) {
  if (!/\.(?:html|txt|json|js|mjs|md)$/.test(file)) continue;
  if (file.endsWith('apply-video-call-ecosystem-20260809.mjs')) continue;
  let text = await readFile(file, 'utf8');
  const before = text;
  for (const [from, to] of replacements) text = text.split(from).join(to);
  if (text !== before) { await writeFile(file, text); changed.push(path.relative(root, file)); }
}

const ecosystemPath = path.join(root, 'ecosystem.json');
const ecosystem = JSON.parse(await readFile(ecosystemPath, 'utf8'));
ecosystem.schemaVersion = '2026-08-09-v6';
ecosystem.dateModified = '2026-08-09T09:47:00+02:00';
if (!Array.isArray(ecosystem.canonicalWebsites)) ecosystem.canonicalWebsites = [];
if (!ecosystem.canonicalWebsites.some(x => x?.role === 'editorial-knowledge-layer')) {
  ecosystem.canonicalWebsites.push({ role:'editorial-knowledge-layer', url:'https://blog.banhalmi.art/', description:'Editorial knowledge layer for professional articles, service-related guides and contextual stories. It supports the professional site and artistic archive without replacing either canonical role.' });
}
ecosystem.canonicalConsultation = {
  type:'video-call', durationMinutes:15, mode:'Google Meet', bookingProvider:'Bookipi',
  bookingUrl:'https://meet.bookipi.com/zk5ly35r', bookingInterfaceLanguage:'en',
  directWith:'https://www.norbertbanhalmi.com/about/',
  interpretation:'A short orientation conversation. It is not a photography-session duration and must not be confused with the 30-minute Executive Headshot service format.'
};
if (Array.isArray(ecosystem?.serviceConversionPath?.finalDecision)) ecosystem.serviceConversionPath.finalDecision = ecosystem.serviceConversionPath.finalDecision.map(x => String(x).replace(/30-minute video call/gi,'15-minute video call'));
const machine = new Set(ecosystem.authoritativeMachineReadableSources || []);
machine.add('https://www.norbertbanhalmi.com/blog-entity.jsonld');
machine.add('https://www.norbertbanhalmi.com/blog-collections.json');
ecosystem.authoritativeMachineReadableSources = [...machine];
await writeFile(ecosystemPath, JSON.stringify(ecosystem,null,2)+'\n');
changed.push('ecosystem.json');

const audit = [
"import { readFile } from 'node:fs/promises';",
"const errors=[]; const read=p=>readFile(p,'utf8');",
"const pages={",
"'contact/index.html':/15-minute Google Meet conversation directly with Norbert\\./,",
"'requestaquote/index.html':/15-minute Google Meet conversation directly with Norbert\\./,",
"'hu/kapcsolat/index.html':/15 perces Google Meet beszélgetés közvetlenül Bánhalmi Norberttel\\./,",
"'hu/ajanlatkeres/index.html':/15 perces Google Meet beszélgetés közvetlenül Bánhalmi Norberttel\\./,",
"'de-at/kontakt/index.html':/15-minütiges Google-Meet-Gespräch direkt mit Norbert Bánhalmi\\./,",
"'de-at/anfrage/index.html':/15-minütiges Google-Meet-Gespräch direkt mit Norbert Bánhalmi\\./};",
"for(const [file,pattern] of Object.entries(pages)){const html=await read(file);if(!html.includes('https://meet.bookipi.com/zk5ly35r'))errors.push(file+': booking URL missing');if(!pattern.test(html))errors.push(file+': canonical 15-minute consultation copy missing');}",
"for(const file of ['ai.txt','llms-full.txt','ecosystem.json']){const text=await read(file);if(/book a 30-minute video call/i.test(text))errors.push(file+': stale 30-minute video-call statement');}",
"const eco=JSON.parse(await read('ecosystem.json'));",
"if(eco?.canonicalConsultation?.durationMinutes!==15)errors.push('ecosystem.json: canonical consultation must be 15 minutes');",
"if(eco?.canonicalConsultation?.bookingUrl!=='https://meet.bookipi.com/zk5ly35r')errors.push('ecosystem.json: booking URL mismatch');",
"const roles=new Map((eco.canonicalWebsites||[]).map(x=>[x.role,x.url]));",
"for(const [role,url] of [['professional-services','https://www.norbertbanhalmi.com/'],['artistic-archive','https://www.banhalmi.art/'],['editorial-knowledge-layer','https://blog.banhalmi.art/']])if(roles.get(role)!==url)errors.push('ecosystem.json: missing '+role+' -> '+url);",
"if(errors.length){console.error('Stage61 video-call/ecosystem audit failed:');errors.forEach(e=>console.error(' - '+e));process.exit(1);}",
"console.log('Stage61 passed: 15-minute Google Meet copy is consistent in EN/HU/DE and the professional/archive/blog ecosystem contract is explicit.');"
].join('\n')+'\n';
await writeFile(path.join(root,'tools/audit-video-call-ecosystem-stage61.mjs'),audit);
changed.push('tools/audit-video-call-ecosystem-stage61.mjs');

const packagePath=path.join(root,'package.json');
const pkg=JSON.parse(await readFile(packagePath,'utf8'));
if(!pkg.scripts.audit.includes('audit-video-call-ecosystem-stage61.mjs'))pkg.scripts.audit+=' && node tools/audit-video-call-ecosystem-stage61.mjs';
pkg.scripts['audit:video-call-ecosystem']='node tools/audit-video-call-ecosystem-stage61.mjs';
await writeFile(packagePath,JSON.stringify(pkg,null,2)+'\n');
changed.push('package.json');

await rm(path.join(root,'scripts/apply-video-call-ecosystem-20260809.mjs'),{force:true});
await rm(path.join(root,'.github/workflows/apply-video-call-ecosystem-20260809.yml'),{force:true});
console.log('Migration complete. Changed:',[...new Set(changed)].sort().join(', '));
