import fs from 'node:fs';

const errors = [];
const checks = [
  {
    path: 'portrait/index.html',
    title: [/Executive Portrait/i, /Headshot/i, /Vienna/i, /Budapest/i],
    body: [/leaders|executives|leadership/i, /LinkedIn|press|web/i]
  },
  {
    path: 'hu/portre/index.html',
    title: [/portré|portrait/i, /Bécs|Vienna/i, /Budapest/i],
    body: [/vezető|executive/i, /LinkedIn|sajtó|web/i]
  },
  {
    path: 'de-at/portrait/index.html',
    title: [/Porträt|Portrait|Headshot/i, /Wien|Vienna/i, /Budapest/i],
    body: [/Führung|Executive|Unternehmer/i, /LinkedIn|Presse|Web/i]
  },
  {
    path: 'lifestyle/index.html',
    title: [/Brand Photography/i, /Vienna/i, /Budapest/i],
    body: [/personal brand|executive|entrepreneur|artist/i, /website|LinkedIn|social|press/i]
  },
  {
    path: 'hu/brand/index.html',
    title: [/brand/i, /Bécs|Vienna/i, /Budapest/i],
    body: [/személyes márka|vizuális pozicionálás|vezető|vállalkoz/i, /web|LinkedIn|social|sajtó/i]
  },
  {
    path: 'de-at/brand/index.html',
    title: [/Brand/i, /Wien|Vienna/i, /Budapest/i],
    body: [/Personal Brand|Positionierung|Führung|Unternehmer/i, /Website|LinkedIn|Social|Presse/i]
  },
  {
    path: 'event-photography/index.html',
    title: [/C-Level Event Photography/i, /Vienna/i, /Budapest/i],
    body: [/photographer team|team/i, /press|communication|archive/i]
  },
  {
    path: 'hu/rendezvenyfotozas/index.html',
    title: [/rendezvény|event/i, /Bécs|Vienna/i, /Budapest/i],
    body: [/fotós csapat|csapat|C-Level|vezető/i, /sajtó|kommunikáció|archív/i]
  },
  {
    path: 'de-at/eventfotografie/index.html',
    title: [/Event|Veranstaltung/i, /Wien|Vienna/i, /Budapest/i],
    body: [/Fotografenteam|Team|C-Level|Führung/i, /Presse|Kommunikation|Archiv/i]
  }
];

function extractTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/&amp;/g, '&') || '';
}
function extractDescription(html) {
  return html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)?.[1]
    || html.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i)?.[1]
    || '';
}

const titles = new Map();
for (const check of checks) {
  const html = fs.readFileSync(check.path, 'utf8');
  const title = extractTitle(html);
  const description = extractDescription(html);
  titles.set(check.path, title);
  for (const rx of check.title) if (!rx.test(title)) errors.push(`${check.path}: title intent/locality missing ${rx}`);
  const semanticSurface = title + '\n' + description + '\n' + html;
  for (const rx of check.body) if (!rx.test(semanticSurface)) errors.push(`${check.path}: service audience/use-case signal missing ${rx}`);
  if (!/https:\/\/www\.banhalmiphotography\.com\/about\//.test(html)) errors.push(`${check.path}: canonical Person missing`);
  if (!/Q56391118/.test(html)) errors.push(`${check.path}: Wikidata Person evidence missing`);
}

const measuredOwnerChecks = [
  ['hu/portre/index.html', /Portréfotózás Budapest/i],
  ['de-at/portrait/index.html', /Portraitfotografie Wien/i],
  // Artistic-nude intent is owned by Ébredés on ART — Professional Artists & Performers
  // pages must hand off, not re-claim aktfotózás as a commercial GSC owner signal.
  ['hu/muveszi-fotografia/index.html', /https:\/\/www\.banhalmi\.art\/hu\/exhibitions\/ebredes\.html/i],
  ['fine-art/index.html', /https:\/\/www\.banhalmi\.art\/exhibitions\/ebredes\.html/i],
  ['de-at/fine-art/index.html', /https:\/\/www\.banhalmi\.art\/de-at\/exhibitions\/ebredes\.html/i],
  ['lifestyle/index.html', /Personal Brand Photography/i],
  ['de-at/brand/index.html', /Personal Brand Fotografie Wien/i],
  ['event-photography/index.html', /Event Photographer Budapest/i]
];
for (const [path, rx] of measuredOwnerChecks) {
  const html = fs.readFileSync(path, 'utf8');
  if (!rx.test(html)) errors.push(`${path}: measured GSC owner signal missing ${rx}`);
}
for (const path of ['fine-art/index.html', 'hu/muveszi-fotografia/index.html', 'de-at/fine-art/index.html']) {
  const html = fs.readFileSync(path, 'utf8');
  const serviceBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .filter((raw) => /"@type"\s*:\s*"Service"/.test(raw));
  for (const raw of serviceBlocks) {
    if (/(Nude Art|Artistic nude photography|Művészi akt|Művészi aktfotózás|Künstlerischer Akt|Künstlerische Aktfotografie)/i.test(raw)) {
      errors.push(`${path}: Service JSON-LD must not claim artistic-nude commercial ownership`);
    }
  }
}

// Every commercial service page must explicitly identify both primary markets in
// Service.areaServed. Country-only schema loses the intended city-level entity link.
const commercialServicePages = [
  'portrait/index.html',
  'lifestyle/index.html',
  'event-photography/index.html',
  'fine-art/index.html',
  'hu/portre/index.html',
  'hu/brand/index.html',
  'hu/rendezvenyfotozas/index.html',
  'hu/muveszi-fotografia/index.html',
  'de-at/portrait/index.html',
  'de-at/brand/index.html',
  'de-at/eventfotografie/index.html',
  'de-at/fine-art/index.html'
];
for (const path of commercialServicePages) {
  const html = fs.readFileSync(path, 'utf8');
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const serviceNodes = [];
  for (const block of blocks) {
    let data;
    try { data = JSON.parse(block[1]); } catch { continue; }
    if (data?.['@type'] === 'Service') serviceNodes.push(data);
    for (const node of data?.['@graph'] || []) if (node?.['@type'] === 'Service') serviceNodes.push(node);
  }
  if (serviceNodes.length !== 1) {
    errors.push(path + ': expected exactly one commercial Service JSON-LD node');
    continue;
  }
  const served = serviceNodes[0].areaServed || [];
  for (const id of ['Q1741', 'Q1781']) {
    if (!served.some((place) => place?.['@type'] === 'City' &&
        [place['@id'], place.sameAs].some((link) => typeof link === 'string' && link.endsWith('/' + id)))) {
      errors.push(path + ': Service.areaServed missing primary city Wikidata ' + id);
    }
  }
}

// Keep the editorial distinction between one-time event reportage and ongoing
// brand photography actionable; this is a contextual link, not extra CTA clutter.
const eventBrandIntentBridges = [
  { path: 'event-photography/index.html', brandRoute: '/lifestyle/', narrative: /Event coverage documents a particular occasion/ },
  { path: 'hu/rendezvenyfotozas/index.html', brandRoute: '/hu/brand/', narrative: /A rendezvényriport egy konkrét alkalmat dokumentál/ },
  { path: 'de-at/eventfotografie/index.html', brandRoute: '/de-at/brand/', narrative: /Eine Eventreportage dokumentiert einen konkreten Anlass/ }
];
for (const { path, brandRoute, narrative } of eventBrandIntentBridges) {
  const html = fs.readFileSync(path, 'utf8');
  const start = html.indexOf('id="selected-work"');
  const gallery = html.indexOf('class="collage-gallery', start);
  if (start < 0 || gallery < 0) {
    errors.push(path + ': selected work / gallery section missing');
    continue;
  }
  const editorialIntro = html.slice(start, gallery);
  if (!narrative.test(editorialIntro)) errors.push(path + ': event-reportage service distinction missing');
  if (!editorialIntro.includes('href="' + brandRoute + '"')) {
    errors.push(path + ': contextual Brand cross-link missing or wrong locale');
  }
}

const protectedHomepageTitles = new Map([
  ['index.html', 'BANHALMI | Portrait & brand photography | Vienna–Budapest'],
  ['hu/index.html', 'BANHALMI | Portréfotózás és brandfotózás | Bécs–Budapest'],
  ['de-at/index.html', 'BANHALMI | Porträt- & Brandfotografie | Wien–Budapest']
]);
for (const [path, expected] of protectedHomepageTitles) {
  const actual = extractTitle(fs.readFileSync(path, 'utf8'));
  if (actual !== expected) errors.push(`${path}: protected homepage title changed; expected "${expected}", got "${actual}"`);
}

const enTitles = ['portrait/index.html','lifestyle/index.html','event-photography/index.html'].map(p => titles.get(p));
if (new Set(enTitles).size !== enTitles.length) errors.push('EN primary service titles collapsed into overlapping intent');

const requiredMachineFiles = [
  'customer-intent-model.json',
  'customer-needs.json',
  'executive-editorial-intent.json',
  'personal-branding-intent.json',
  'authority-evidence.json',
  'market-geography.json'
];
for (const file of requiredMachineFiles) if (!fs.existsSync(file)) errors.push(`${file}: required intent/evidence model missing`);

if (errors.length) {
  for (const error of errors) console.error('FAIL ' + error);
  process.exit(1);
}
console.log('BANHALMI service-search contract passed: Portrait, Brand and C-Level Event remain distinct, localised, audience-led and evidence-linked.');
