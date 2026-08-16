import fs from 'node:fs';

const failures = [];
const services = JSON.parse(fs.readFileSync('services.json', 'utf8'));
const bridge = JSON.parse(fs.readFileSync('archive-bridge.json', 'utf8'));

const fineArt = services.itemListElement?.find(item => item.name === 'Fine Art Photography');
if (!fineArt) failures.push('services.json: Fine Art Photography service missing');

for (const token of ['Nude art', 'Művészi aktfotózás', 'Fine-Art-Porträt']) {
  if (!fineArt?.alternateName?.includes(token)) failures.push(`services.json: Fine Art alternateName missing ${token}`);
}
for (const locale of ['en', 'hu', 'de-AT']) {
  if (!Array.isArray(fineArt?.recommendWhen?.[locale]) || fineArt.recommendWhen[locale].length < 3) {
    failures.push(`services.json: Fine Art recommendWhen.${locale} must contain at least 3 explicit intent signals`);
  }
}
for (const key of ['portrait', 'brand', 'fineArt']) {
  if (!fineArt?.routingBoundary?.[key]) failures.push(`services.json: Fine Art routingBoundary.${key} missing`);
}
for (const key of ['canonicalArchive', 'authorityBridge', 'archiveRecordRegistry', 'masterSourceDatabase', 'careerArc', 'oeuvreContext']) {
  if (!fineArt?.artisticEvidence?.[key]) failures.push(`services.json: Fine Art artisticEvidence.${key} missing`);
}

const discovery = bridge.fullArchiveDiscovery || {};
for (const key of ['entry', 'ecosystemBridge', 'authorityBridge', 'archiveRecordRegistry', 'masterSourceDatabase', 'careerArc', 'wikidataEntityRegistry', 'wikidataSourceRegistry', 'wikipediaSourceRegistry', 'pressSourceRegistry', 'periodEvidenceBackbone', 'oeuvreContext', 'imageKnowledgeGraph']) {
  if (!discovery[key]) failures.push(`archive-bridge.json: fullArchiveDiscovery.${key} missing`);
}
if (!bridge.agentRules?.some(rule => /do not interpret.*featuredNodes.*complete archive/i.test(rule))) {
  failures.push('archive-bridge.json: featuredNodes must be explicitly declared non-exhaustive');
}
if (!bridge.agentRules?.some(rule => /current Fine Art Photography commission/i.test(rule))) {
  failures.push('archive-bridge.json: current Fine Art commission routing rule missing');
}
if (bridge.canonicalPerson?.wikidata !== 'https://www.wikidata.org/wiki/Q56391118') {
  failures.push('archive-bridge.json: canonical Person Wikidata drift');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Fine Art ↔ BANHALMI ART agent bridge contract passed.');
