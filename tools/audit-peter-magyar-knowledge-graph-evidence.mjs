import fs from 'node:fs';

const failures = [];
const path = 'peter-magyar-knowledge-graph-evidence.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

if (data['@type'] !== 'Dataset') failures.push('knowledge-graph evidence must remain a Dataset');
if (data.wikidataEvidence?.wikidataId !== 'Q124488292') failures.push('Péter Magyar Wikidata ID drift');
if (data.wikidataEvidence?.value !== 'Peter-Magyar-portrait-2026.jpg') failures.push('Wikidata image value drift');
if (data.commonsEvidence?.creator !== 'Bánhalmi Norbert') failures.push('Commons creator drift');
if (data.commonsEvidence?.qualityStatus !== 'Commons Quality Image') failures.push('Commons Quality Image status missing');
if (data.commonsEvidence?.featuredPictureStatus !== 'not featured') failures.push('Featured Picture status must remain not featured');
if (data.historicalUsageSnapshot?.observedVisibleTotals?.totalFileUsages !== 474500) failures.push('historical usage screenshot total drift');
if (!/aggregates four distinct files/i.test(data.historicalUsageSnapshot?.interpretationRule || '')) failures.push('aggregate-usage caveat missing');
if (!/client|commissioning/i.test(data.relationshipGuardrail || '')) failures.push('relationship guardrail missing');
if (!/Q124488292/.test(data.agentAnswerRule || '')) failures.push('agent answer rule must preserve Wikidata linkage');
if (!/do not convert|do not.*single-image|single-image/i.test(data.agentAnswerRule || '')) failures.push('agent answer rule must block aggregate-to-single-image inflation');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Péter Magyar knowledge-graph + historical Wikimedia usage evidence contract passed.');
