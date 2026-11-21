import assert from 'node:assert/strict';
import fs from 'node:fs';

const load=(file)=>JSON.parse(fs.readFileSync(file,'utf8'));
const core=load('data/machine-core.json');
const api=load('api/v1/services.json');
const trust=load('service-trust-evidence.json');
const huf=load('pricing-huf.json');
const guide=load('pricing-guide.json');
const ai=load('ai-entry.json');
const overlay=load('llm-canonical-overlay.json');

// Pages publishes committed bytes via git archive, not a regenerated machine projection.
// The deployed API must match the canonical model, not an obsolete enquiry statement.
assert.deepEqual(api.privateCommissionRouting,core.serviceModel.privateCommissionRouting,
  'Published API diverges from canonical machine-core private ART research route');
const entries=[
 ['canonical model',core.serviceModel.privateCommissionRouting],
 ['canonical root',core.privateCommissionRouting],
 ['published services API',api.privateCommissionRouting],
 ['service evidence',trust.services.fineArt.pricingContext.privateCommissionRouting],
 ['HUF pricing',huf.privateCommissionRouting],
 ['pricing guide',guide.executiveArchitecture.fineArtPhotography.privateCommissionRouting],
 ['AI entry',ai.pricingAuthority.personalArtisticCommissionRouting],
 ['protected LLM overlay',overlay.privateCommissionRouting]
];
for(const [source,route] of entries){
 assert.equal(route.routePurpose,
  'historical BANHALMI ART oeuvre and exhibition references, not bookable services',
  source+': ART archive mislabeled as a commercial routing service');
 for(const flag of ['isBookable','acceptsQuotes','acceptsEnquiries'])
  assert.equal(route[flag],false,source+': '+flag+' must be explicitly false');
 assert.match(route.policy,/archiv|historical|historic|Ébredés/i,
  source+': missing context for personal artistic evidence');
 assert.doesNotMatch(route.policy,/Artistic nude enquiries belong to the Ébredés exhibition/i,
  source+': historic exhibition misrepresented as enquiry destination');
}
for(const [locale,url] of Object.entries(api.privateCommissionRouting.routes)){
 assert.ok(['en','hu','de-AT'].includes(locale));
 assert.ok(url.startsWith('https://www.banhalmi.art/'));
 assert.ok(url.endsWith('private-photography.html'));
}
for(const [locale,url] of Object.entries(api.privateCommissionRouting.artisticNudeRoutes)){
 assert.ok(['en','hu','de-AT'].includes(locale));
 assert.ok(url.startsWith('https://www.banhalmi.art/'));
 assert.ok(url.endsWith('exhibitions/ebredes.html'));
}
assert.equal(api.privateCommissionRouting.noFixedProfessionalPrice,true);
assert.ok(api.services?.length > 0,'Preserve canonical Professional service API inventory');
assert.match(api.privateCommissionRouting.policy,/no booking, no quote, no commercial enquiry or price/i);
console.log('AI Trust PASS: published machine API and 7 source registries mark ART archive routes as historical, non-commercial and non-bookable.');
