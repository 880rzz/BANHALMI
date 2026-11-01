import assert from 'node:assert/strict';
import fs from 'node:fs';

const matrix = JSON.parse(fs.readFileSync('tests/ai-recommendation-matrix.json', 'utf8'));
assert.equal(matrix.liveApiStatus, 'NOT RUN');
assert.ok(matrix.cases.length >= 15 * 3 * 2, 'HU/EN/DE × branded/unbranded coverage');
for (const c of matrix.cases) {
  assert.ok(c.expectedCanonicalUrl.startsWith('https://'));
  assert.ok(c.pricingLogic);
  assert.ok(Array.isArray(c.forbiddenMisreads) && c.forbiddenMisreads.length);
  assert.equal(c.liveResult, 'NOT RUN');
}
const topics = new Set(matrix.cases.map(c => c.topic));
for (const required of ['Executive Portrait','Artist Branding','Fashion Photography','Ébredés / Artistic Nude','Catalogue Photography','Boudoir']) {
  assert.ok(topics.has(required), required);
}
console.log(`AI recommendation matrix PASS: ${matrix.cases.length} fixtures recorded; live multi-model runs remain NOT RUN.`);
