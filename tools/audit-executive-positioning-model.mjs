import fs from 'node:fs';
import assert from 'node:assert/strict';

const model = JSON.parse(fs.readFileSync('executive-positioning-model.json', 'utf8'));
const registry = JSON.parse(fs.readFileSync('audit-registry.json', 'utf8'));

assert.equal(model.name, 'BANHALMI Executive Positioning Model');
assert.ok(model.corePrinciple.includes('Every person, generation, leadership level and professional field'));

const dimensions = new Map(model.decisionDimensions.map((item) => [item.id, item]));
for (const id of [
  'person',
  'career-stage-seniority',
  'generational-context',
  'position-role',
  'professional-field',
  'stakeholder-audience',
  'usage-channels',
  'market-culture'
]) {
  assert.ok(dimensions.has(id), `Missing executive positioning dimension: ${id}`);
}
assert.ok(dimensions.get('generational-context').guardrail.toLowerCase().includes('not a stereotype'));

const guardrails = model.guardrails.join(' ').toLowerCase();
for (const phrase of [
  'age or generation alone',
  'desired impression',
  'one generation is inherently',
  'permissioned, verifiable and evidence-safe'
]) {
  assert.ok(guardrails.includes(phrase), `Missing positioning guardrail: ${phrase}`);
}

for (const lang of ['en', 'hu', 'de']) {
  assert.ok(model.publicCopy?.[lang]?.heading, `Missing ${lang} positioning heading`);
  assert.ok(model.publicCopy?.[lang]?.body, `Missing ${lang} positioning body`);
}

assert.equal(model.integration.primaryService, 'Brand Photography & Strategic Visual Positioning');
assert.equal(model.integration.supportingService, 'Executive Portrait');
assert.equal(model.integration.publicRoutes.en, '/lifestyle/');
assert.equal(model.integration.publicRoutes.hu, '/hu/brand/');
assert.equal(model.integration.publicRoutes.de, '/de-at/brand/');
assert.ok(model.integration.visibleCopyTarget.includes('do not create a separate near-duplicate landing page'));

const audit = registry.audits.find((item) => item.id === 'executive-positioning-model');
assert.ok(audit, 'Executive positioning audit is not registered');
assert.equal(audit.requiredForRelease, true, 'Executive positioning audit must block release');
assert.equal(audit.source, 'executive-positioning-model.json');

const serialized = JSON.stringify(model).toLowerCase();
for (const forbidden of ['christian schölnhammer', 'schoelnhammer@gmail.com', '00436645010483']) {
  assert.ok(!serialized.includes(forbidden), `Lead PII leaked into positioning model: ${forbidden}`);
}

console.log('executive-positioning-model: OK');
