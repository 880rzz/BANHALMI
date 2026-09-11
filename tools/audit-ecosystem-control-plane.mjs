import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const policy = readJson('ecosystem-policy.json');
const registry = readJson('audit-registry.json');
const state = readJson('ecosystem-state.json');
const research = readJson('trust-signal-research.json');
const core = readJson('data/machine-core.json');

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(policy.authority === 'BANHALMI Ecosystem Chief Steward', 'Chief Steward authority missing');
assert(policy.identity?.primaryBrand === core.brand?.name, 'Policy primary brand must match machine core');
assert(policy.identity?.alternateCommercialBrand === core.brand?.alternateName?.[0], 'Policy alternate brand must match machine core');
assert(policy.identity?.teamDescriptor === core.brand?.positioning, 'Policy team descriptor must match machine core');
assert(policy.identity?.legalEntity === core.organization?.legalName, 'Policy legal entity must match machine core');
assert(policy.selfHealing?.directMainWrite === false, 'Direct main write must remain forbidden');
assert(policy.selfHealing?.thresholdWeakening === false, 'Threshold weakening must remain forbidden');
assert(policy.dailyPublicTrustResearch?.enabled === true, 'Daily public trust research must remain enabled');
assert(Array.isArray(policy.dailyPublicTrustResearch?.neverInfer) && policy.dailyPublicTrustResearch.neverInfer.includes('client'), 'Trust research must forbid client inference');
assert(policy.protectedEvidenceLayers?.includes('external-photography-evidence.json'), 'External photography evidence protection missing');
assert(policy.protectedEvidenceLayers?.includes('press-institutional-evidence.json'), 'Press/institutional evidence protection missing');
assert(policy.protectedEvidenceLayers?.includes('media-usage-evidence.json'), 'Media usage evidence protection missing');

assert(registry.chiefOrchestrator === 'BANHALMI Ecosystem Steward', 'Audit registry must name the Chief Steward');
assert(registry.rules?.singleOrchestrationAuthority === true, 'Single orchestration authority contract missing');
assert(registry.audits?.some((a) => a.id === 'daily-public-trust-research' && a.authority === 'candidate-only'), 'Daily trust research must be candidate-only');
assert(Array.isArray(registry.requiredMutationFlow) && registry.requiredMutationFlow.includes('PR') && registry.requiredMutationFlow.includes('exact-live'), 'Mutation flow must require PR and exact-live');

assert(state.mainSha === '00cf18fead075d66f06d01ab21a45ed9db96aa2f', 'State baseline SHA changed without explicit state refresh');
assert(state.production?.exactLive === 'success', 'State baseline must record exact-live success');
assert(Array.isArray(state.knownOpportunities) && state.knownOpportunities.length >= 5, 'Opportunity backlog unexpectedly empty');

assert(research.purpose?.includes('intake registry'), 'Trust research must remain an intake registry, not a claim registry');
assert(research.searchPlan?.cadence === 'daily', 'Trust research cadence must remain daily');
assert(Array.isArray(research.candidates), 'Trust research candidates must be an array');
assert(research.qualityRules?.some((r) => r.includes('not a client')), 'Relationship inflation guard missing from trust research');
assert(research.promotionPolicy?.verified, 'Verified promotion state missing');

if (errors.length) {
  console.error('Ecosystem control-plane audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Ecosystem control-plane audit passed: policy, audit registry, state baseline and daily trust research are coherent.');
