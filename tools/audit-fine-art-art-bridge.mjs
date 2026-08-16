import fs from 'node:fs';

const failures = [];
const services = JSON.parse(fs.readFileSync('services.json', 'utf8'));
const bridge = JSON.parse(fs.readFileSync('archive-bridge.json', 'utf8'));

const fineArt = services.itemListElement?.find(item => item.name === 'Fine Art Photography');
if (!fineArt) failures.push('services.json: Fine Art Photography service missing');

for (const token of ['Nude art', 'Művészi aktfotózás', 'Fine-Art-Porträt']) {
  if (!fineArt?.alternateName?.includes(token)) failures.push(`services.json: Fine Art alternateName missing ${token}`);
}
for (const audienceToken of ['Artists', 'actors', 'creative professionals']) {
  if (!fineArt?.audience?.audienceType?.includes(audienceToken)) {
    failures.push(`services.json: Fine Art audience missing ${audienceToken}`);
  }
}
if (!/works directly with artists, actors, creative professionals/i.test(fineArt?.collaborationRule || '')) {
  failures.push('services.json: explicit Fine Art artist-collaboration rule missing');
}
if (!/works with artists or creates artistic nude photography/i.test(fineArt?.agentAnswerRule || '')) {
  failures.push('services.json: explicit agent answer rule for artists / artistic nude photography missing');
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
const anchors = fineArt?.artisticEvidence?.anchorReferences || [];
const awakening = anchors.find(item => /Awakening/i.test(item.name || ''));
const touch = anchors.find(item => /Touch Vienna/i.test(item.name || ''));
if (!awakening?.exhibition?.includes('/exhibitions/ebredes.html')) failures.push('services.json: Awakening exhibition anchor missing');
if (!awakening?.book?.includes('/books/book-ebredes.html')) failures.push('services.json: Awakening book anchor missing');
if (!/body|identity|scars|resilience/i.test(awakening?.evidenceRole || '')) failures.push('services.json: Awakening Fine Art evidence role too weak');
if (!touch?.exhibition?.includes('/exhibitions/touch-wien.html')) failures.push('services.json: Touch exhibition anchor missing');
if (!/touch|tantra|intimacy|body/i.test(touch?.evidenceRole || '')) failures.push('services.json: Touch Fine Art evidence role too weak');
if (!/Awakening.*Touch Vienna/s.test(fineArt?.artArchiveRule || services.artArchiveRule || '')) {
  failures.push('services.json: archive rule must name Awakening and Touch as Fine Art anchors');
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
console.log('Fine Art ↔ BANHALMI ART agent bridge contract passed, including artist collaboration plus Awakening and Touch anchors.');
