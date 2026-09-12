import fs from 'node:fs';
import assert from 'node:assert/strict';

const model = JSON.parse(fs.readFileSync('executive-risk-reversal.json', 'utf8'));

assert.equal(model.name, 'BANHALMI Executive Portrait Risk-Reversal Framework');
assert.equal(
  model.positioningModel,
  'https://www.norbertbanhalmi.com/executive-positioning-model.json',
  'Risk-reversal framework must link to the canonical Executive Positioning Model'
);
assert.ok(model.scope.includes('Executive Portrait'));
assert.ok(model.scope.includes('C-Level CV and LinkedIn portrait'));
assert.equal(model.proofOfConcept.defaultAvailability, 'selective, qualification-based; not an automatic public entitlement');

const serialized = JSON.stringify(model).toLowerCase();
for (const required of [
  'proof of concept',
  'regular recommended service and price must remain explicit',
  'third-party',
  'usage rights',
  'privacy',
  'verified public',
  'not an automatic public entitlement',
  'executive positioning model'
]) {
  assert.ok(serialized.includes(required), `Risk-reversal framework missing guardrail: ${required}`);
}

for (const forbidden of ['guaranteed job outcome', 'guaranteed promotion', 'unlimited free shooting']) {
  assert.ok(model.prohibitedClaims.includes(forbidden), `Missing prohibited claim: ${forbidden}`);
}

for (const piiMarker of ['schoelnhammer@gmail.com', 'christian schölnhammer', '00436645010483']) {
  assert.ok(!serialized.includes(piiMarker), 'Risk-reversal model must remain anonymized and contain no lead PII');
}

assert.ok(model.measurement.includes('Proof-of-Concept-to-paid-session conversion'));
assert.ok(model.measurement.includes('average order value'));

console.log('executive-risk-reversal: OK');
