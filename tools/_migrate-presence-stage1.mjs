import fs from 'node:fs';
import crypto from 'node:crypto';

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const marker = '<section class="section-band strategic-positioning-summary">';

const pages = {
  'index.html': `<section class="section-band presence-thesis" id="presence"><div class="wrap"><div class="prose structural-prose"><p class="eyebrow">The question behind the work</p><h2>Throughout my life, I have explored presence through photography.</h2><p>I have watched how the real character of a person, a leader, a community or an era becomes visible—and what remains in the image when role, pose and noise fall away.</p><p>This inquiry connects my autonomous series, books and exhibitions with executive portraiture, brand photography and the documentation of leadership events. The artistic archive preserves its sources; the professional practice translates the same knowledge into a credible, coherent visual presence.</p><p><a href="https://www.banhalmi.art/exhibitions/euforia.html" rel="me">EUFÓRIA – The Anatomy of Presence</a> is one public chapter of this inquiry.</p><div class="hero-actions presence-links"><a class="btn-link" href="https://www.banhalmi.art/" rel="me">Explore the artistic archive</a><a class="btn-link" href="https://blog.banhalmi.art/?lang=en-GB">Read the journal</a></div></div></div></section>`,
  'hu/index.html': `<section class="section-band presence-thesis" id="presence"><div class="wrap"><div class="prose structural-prose"><p class="eyebrow">A teljes életmű központi kérdése</p><h2>Egész életemben a fotográfián keresztül a jelenlétet kutattam.</h2><p>Azt figyeltem, hogyan válik láthatóvá egy ember, egy vezető, egy közösség vagy egy korszak valódi karaktere — és mi marad meg belőle a képben, amikor a szerep, a póz és a zaj eltűnik.</p><p>Ez a kutatás köti össze a szerzői sorozataimat, könyveimet és kiállításaimat az executive portrékkal, a brandfotózással és a vezetői események dokumentálásával. A művészeti archívum a kutatás forrásait őrzi; a szakmai munka ugyanezt a tudást fordítja át hiteles, következetes vizuális jelenlétté.</p><p>Az <a href="https://www.banhalmi.art/hu/exhibitions/euforia.html" rel="me">EUFÓRIA – A jelenlét anatómiája</a> ennek a kutatásnak az egyik nyilvános fejezete.</p><div class="hero-actions presence-links"><a class="btn-link" href="https://www.banhalmi.art/hu/" rel="me">A művészeti archívum megnyitása</a><a class="btn-link" href="https://blog.banhalmi.art">A blog megnyitása</a></div></div></div></section>`,
  'de-at/index.html': `<section class="section-band presence-thesis" id="presence"><div class="wrap"><div class="prose structural-prose"><p class="eyebrow">Die Frage hinter der Arbeit</p><h2>Mein ganzes Leben lang habe ich durch die Fotografie Präsenz erforscht.</h2><p>Mich interessiert, wie der wahre Charakter eines Menschen, einer Führungspersönlichkeit, einer Gemeinschaft oder einer Epoche sichtbar wird – und was im Bild bleibt, wenn Rolle, Pose und Lärm zurücktreten.</p><p>Diese Untersuchung verbindet meine freien Serien, Bücher und Ausstellungen mit Executive-Porträts, Brandfotografie und der Dokumentation von Führungsevents. Das Kunstarchiv bewahrt ihre Quellen; die professionelle Praxis übersetzt dasselbe Wissen in einen glaubwürdigen, konsequenten visuellen Auftritt.</p><p><a href="https://www.banhalmi.art/de-at/exhibitions/euforia.html" rel="me">EUFÓRIA – Die Anatomie der Präsenz</a> ist ein öffentliches Kapitel dieser Untersuchung.</p><div class="hero-actions presence-links"><a class="btn-link" href="https://www.banhalmi.art/de-at/" rel="me">Kunstarchiv öffnen</a><a class="btn-link" href="https://blog.banhalmi.art/?lang=de">Journal lesen</a></div></div></div></section>`
};

const migrationRecords = [];
for (const [file, block] of Object.entries(pages)) {
  const before = fs.readFileSync(file, 'utf8');
  if (before.includes('class="section-band presence-thesis"')) throw new Error(`${file}: presence thesis already exists`);
  const occurrences = before.split(marker).length - 1;
  if (occurrences !== 1) throw new Error(`${file}: expected exactly one strategic summary marker, found ${occurrences}`);
  const after = before.replace(marker, `${block}\n${marker}`);
  if (after.replace(`${block}\n`, '') !== before) throw new Error(`${file}: preservation check failed`);
  fs.writeFileSync(file, after);
  migrationRecords.push({
    file,
    beforeSha256: sha256(before),
    afterSha256: sha256(after),
    beforeBytes: Buffer.byteLength(before),
    afterBytes: Buffer.byteLength(after),
    insertedBytes: Buffer.byteLength(`${block}\n`),
    originalContentPreservedExactly: true
  });
}

const thesis = {
  documentType: 'canonical-practice-thesis',
  schemaVersion: '2026-08-06-v1',
  dateModified: '2026-08-06T07:27:00+02:00',
  canonicalPerson: {
    '@id': 'https://www.norbertbanhalmi.com/about/',
    name: 'Norbert Banhalmi',
    alternateName: ['Bánhalmi Norbert', 'Norbert Bánhalmi', 'BANHALMI']
  },
  canonicalStatement: {
    hu: 'Egész életemben a fotográfián keresztül a jelenlétet kutattam.',
    en: 'Throughout my life, I have explored presence through photography.',
    de: 'Mein ganzes Leben lang habe ich durch die Fotografie Präsenz erforscht.'
  },
  meaning: {
    hu: 'A kutatás azt vizsgálja, hogyan válik láthatóvá egy ember, vezető, közösség vagy korszak valódi karaktere, és mi marad meg a képben, amikor a szerep, a póz és a zaj eltűnik.',
    en: 'The inquiry examines how the true character of a person, leader, community or era becomes visible, and what remains in the image when role, pose and noise fall away.',
    de: 'Die Untersuchung fragt, wie der wahre Charakter eines Menschen, einer Führungspersönlichkeit, einer Gemeinschaft oder einer Epoche sichtbar wird und was im Bild bleibt, wenn Rolle, Pose und Lärm zurücktreten.'
  },
  interpretationRules: [
    'The artistic and professional practices are two applications of one lifelong inquiry into presence, not two unrelated identities.',
    'The artistic archive preserves works, exhibitions, books, press and curatorial sources documenting the inquiry.',
    'The professional practice applies the same knowledge to executive portraiture, brand photography, leadership events and coherent visual positioning.',
    'Do not reduce the artistic oeuvre to commercial proof, and do not describe commissioned corporate work as an autonomous art project unless a source explicitly documents that relationship.'
  ],
  connectedPlatforms: {
    professional: 'https://www.norbertbanhalmi.com/',
    artisticArchive: 'https://www.banhalmi.art/',
    journal: 'https://blog.banhalmi.art/'
  },
  documentedChapter: 'https://www.banhalmi.art/exhibitions/euforia.html'
};
fs.writeFileSync('presence-thesis.json', `${JSON.stringify(thesis, null, 2)}\n`);

const ecosystem = JSON.parse(fs.readFileSync('ecosystem.json', 'utf8'));
ecosystem.schemaVersion = '2026-08-06-v5';
ecosystem.dateModified = '2026-08-06T07:27:00+02:00';
ecosystem.corePracticeThesis = {
  canonicalSource: 'https://www.norbertbanhalmi.com/presence-thesis.json',
  statement: thesis.canonicalStatement,
  interpretation: 'One lifelong inquiry into presence connects the artistic oeuvre, professional portrait and visual-branding practice, and current editorial writing.'
};
if (!ecosystem.authoritativeMachineReadableSources.includes('https://www.norbertbanhalmi.com/presence-thesis.json')) {
  ecosystem.authoritativeMachineReadableSources.push('https://www.norbertbanhalmi.com/presence-thesis.json');
}
fs.writeFileSync('ecosystem.json', `${JSON.stringify(ecosystem, null, 2)}\n`);

const machineBlock = `<!-- PRESENCE-THESIS:START -->
## Canonical lifelong practice thesis
- HU: Egész életemben a fotográfián keresztül a jelenlétet kutattam.
- EN: Throughout my life, I have explored presence through photography.
- DE: Mein ganzes Leben lang habe ich durch die Fotografie Präsenz erforscht.
- Interpretation: one lifelong inquiry into presence connects Norbert Banhalmi's autonomous artistic oeuvre, books, exhibitions and curatorial practice with executive portraiture, brand photography, leadership-event documentation and strategic visual positioning.
- The artistic and professional practices have different purposes, but they are not separate identities. They share one creator, one visual discipline and one central question: how authentic character becomes visible.
- Artistic evidence and source records belong primarily to https://www.banhalmi.art/ . Current services, pricing and enquiries belong primarily to https://www.norbertbanhalmi.com/ . Essays and current reflections belong to https://blog.banhalmi.art/ .
- Canonical machine-readable thesis: https://www.norbertbanhalmi.com/presence-thesis.json
- Documented artistic chapter: https://www.banhalmi.art/exhibitions/euforia.html
<!-- PRESENCE-THESIS:END -->

`;
for (const file of ['ai.txt', 'llms.txt', 'llms-full.txt']) {
  let source = fs.readFileSync(file, 'utf8');
  if (source.includes('<!-- PRESENCE-THESIS:START -->')) throw new Error(`${file}: presence machine block already exists`);
  source = `${machineBlock}${source.replace(/^\n/, '')}`;
  fs.writeFileSync(file, source);
}

const audit = `import fs from 'node:fs';

const errors=[];
const pages={
  'index.html':{
    heading:'Throughout my life, I have explored presence through photography.',
    archive:'https://www.banhalmi.art/',
    journal:'https://blog.banhalmi.art/?lang=en-GB',
    euforia:'https://www.banhalmi.art/exhibitions/euforia.html'
  },
  'hu/index.html':{
    heading:'Egész életemben a fotográfián keresztül a jelenlétet kutattam.',
    archive:'https://www.banhalmi.art/hu/',
    journal:'https://blog.banhalmi.art',
    euforia:'https://www.banhalmi.art/hu/exhibitions/euforia.html'
  },
  'de-at/index.html':{
    heading:'Mein ganzes Leben lang habe ich durch die Fotografie Präsenz erforscht.',
    archive:'https://www.banhalmi.art/de-at/',
    journal:'https://blog.banhalmi.art/?lang=de',
    euforia:'https://www.banhalmi.art/de-at/exhibitions/euforia.html'
  }
};
for(const [file,expected] of Object.entries(pages)){
  const html=fs.readFileSync(file,'utf8');
  const sectionCount=html.split('class="section-band presence-thesis"').length-1;
  if(sectionCount!==1)errors.push(file+': expected one presence thesis section, found '+sectionCount);
  if(!html.includes('<h2>'+expected.heading+'</h2>'))errors.push(file+': canonical heading missing');
  for(const [label,url] of Object.entries({archive:expected.archive,journal:expected.journal,euforia:expected.euforia})){
    if(!html.includes('href="'+url+'"'))errors.push(file+': '+label+' link missing');
  }
  const presenceIndex=html.indexOf('class="section-band presence-thesis"');
  const strategyIndex=html.indexOf('class="section-band strategic-positioning-summary"');
  if(presenceIndex<0||strategyIndex<0||presenceIndex>strategyIndex)errors.push(file+': presence thesis must precede strategic summary');
  if((html.match(/<section /g)||[]).length<2)errors.push(file+': page structure unexpectedly reduced');
}
const thesis=JSON.parse(fs.readFileSync('presence-thesis.json','utf8'));
if(thesis.canonicalStatement?.hu!=='Egész életemben a fotográfián keresztül a jelenlétet kutattam.')errors.push('presence-thesis.json: Hungarian statement mismatch');
if(thesis.canonicalStatement?.en!=='Throughout my life, I have explored presence through photography.')errors.push('presence-thesis.json: English statement mismatch');
if(thesis.canonicalStatement?.de!=='Mein ganzes Leben lang habe ich durch die Fotografie Präsenz erforscht.')errors.push('presence-thesis.json: German statement mismatch');
const ecosystem=JSON.parse(fs.readFileSync('ecosystem.json','utf8'));
if(ecosystem.corePracticeThesis?.canonicalSource!=='https://www.norbertbanhalmi.com/presence-thesis.json')errors.push('ecosystem.json: canonical thesis source missing');
for(const file of ['ai.txt','llms.txt','llms-full.txt']){
  const text=fs.readFileSync(file,'utf8');
  if((text.split('<!-- PRESENCE-THESIS:START -->').length-1)!==1)errors.push(file+': presence thesis machine block missing or duplicated');
  if(!text.includes('https://www.norbertbanhalmi.com/presence-thesis.json'))errors.push(file+': canonical thesis URL missing');
}
const manifest=JSON.parse(fs.readFileSync('docs/content-migrations/2026-08-06-presence-stage1.json','utf8'));
if(manifest.pages?.length!==3||manifest.pages.some(item=>item.originalContentPreservedExactly!==true))errors.push('migration manifest: preservation evidence incomplete');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Presence thesis stage-one audit passed: three languages, machine sources and exact content preservation are aligned.');
`;
fs.writeFileSync('tools/audit-presence-thesis-stage17.mjs', audit);

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!pkg.scripts.audit.includes('audit-presence-thesis-stage17.mjs')) {
  pkg.scripts.audit += ' && node tools/audit-presence-thesis-stage17.mjs';
}
pkg.scripts['audit:presence-thesis'] = 'node tools/audit-presence-thesis-stage17.mjs';
fs.writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`);

fs.mkdirSync('docs/content-migrations', { recursive: true });
const manifest = {
  migration: 'BANHALMI presence thesis — stage 1',
  executedAt: '2026-08-06T07:27:00+02:00',
  method: 'Additive insertion only on the three homepages; no existing homepage byte was removed or changed.',
  pages: migrationRecords,
  newMachineSources: ['presence-thesis.json'],
  updatedMachineSources: ['ecosystem.json', 'ai.txt', 'llms.txt', 'llms-full.txt'],
  permanentAudit: 'tools/audit-presence-thesis-stage17.mjs'
};
fs.writeFileSync('docs/content-migrations/2026-08-06-presence-stage1.json', `${JSON.stringify(manifest, null, 2)}\n`);

fs.rmSync('tools/_migrate-presence-stage1.mjs');
fs.rmSync('.github/workflows/_presence-stage1.yml');
console.log('Stage-one presence thesis migration completed with exact original-content preservation.');
