import fs from 'node:fs';
import path from 'node:path';

const failures = [];
const read = (file) => fs.readFileSync(file, 'utf8');
const assert = (condition, message) => { if (!condition) failures.push(message); };

function htmlFiles(dir = '.') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'playwright-report', 'test-results'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(file));
    else if (entry.name.endsWith('.html')) out.push(file.replaceAll('\\', '/'));
  }
  return out;
}

const corpusFiles = [
  ...htmlFiles(),
  'entity.jsonld',
  'entity-graph.json',
  'knowledge.json',
  'services.json',
  'brand-positioning.jsonld',
  'ai.txt',
  'llms.txt',
  'llms-full.txt'
].filter((file) => fs.existsSync(file));
const corpus = corpusFiles.map(read).join('\n');

const canonicalPersonId = 'https://www.norbertbanhalmi.com/about/';
const canonicalServiceId = 'https://www.norbertbanhalmi.com/#visual-trust-partnership';
assert(corpus.includes(canonicalPersonId), `canonical Person ID missing: ${canonicalPersonId}`);
assert(!corpus.includes('https://www.banhalmi.art/norbert-banhalmi'), 'obsolete BANHALMI ART Person ID remains');

const requiredHomepageCopy = {
  'index.html': ['Visual Trust Strategy', 'We build visual trust before the meeting begins.'],
  'hu/index.html': ['Vizuális bizalomstratégia', 'Vizuális bizalmat építünk már az első találkozás előtt.'],
  'de-at/index.html': ['Strategie für visuelles Vertrauen', 'Wir schaffen visuelles Vertrauen vor der ersten Begegnung.']
};
for (const [file, phrases] of Object.entries(requiredHomepageCopy)) {
  const html = read(file);
  for (const phrase of phrases) assert(html.includes(phrase), `${file}: required positioning copy missing: ${phrase}`);
}

const forbiddenLegacyText = [
  'Technikai megfelelőségi tervezet, amelyet az aktív szolgáltatói szerződések és az osztrák jog alapján véglegesíteni szükséges.',
  'I have read the Privacy Policy and agree that my details may be used to respond to my enquiry.',
  'Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Beantwortung meiner Anfrage verwendet werden.',
  'https://www.milcclub.com/post/amikor-csak-egy-t%C3%A1ncpartnered-van-eg%C3%A9sz-est%C3%A9reambassadors'
];
for (const legacy of forbiddenLegacyText) assert(!corpus.includes(legacy), `legacy compliance or link text remains: ${legacy}`);

const entity = JSON.parse(read('entity.jsonld'));
const graph = entity['@graph'] || [];
const person = graph.find((node) => node['@id'] === canonicalPersonId);
const organization = graph.find((node) => node['@id'] === 'https://www.norbertbanhalmi.com/#organization');
const service = graph.find((node) => node['@id'] === canonicalServiceId);
assert(person?.['@type'] === 'Person', 'canonical Person node missing from entity.jsonld');
assert(organization?.['@type'] === 'Organization', 'Organization node missing from entity.jsonld');
assert(service?.['@type'] === 'Service', 'Visual Trust Strategy Service node missing from entity.jsonld');
assert(Array.isArray(organization?.subjectOf) && organization.subjectOf.some((item) => item?.['@id'] === canonicalServiceId), 'Organization must link to Visual Trust Strategy Service');

for (const file of ['index.html', 'hu/index.html', 'de-at/index.html']) {
  const html = read(file);
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const homepageGraph = jsonLdBlocks.find((block) => Array.isArray(block['@graph']))?.['@graph'] || [];
  assert(homepageGraph.some((node) => node['@id'] === canonicalPersonId), `${file}: canonical Person node/reference missing from homepage graph`);
  assert(homepageGraph.some((node) => node['@id'] === canonicalServiceId), `${file}: Visual Trust Strategy Service missing from homepage graph`);
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}
console.log(`Static source integrity audit passed for ${corpusFiles.length} files.`);
