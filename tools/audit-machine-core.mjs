import fs from 'node:fs';

const core = JSON.parse(fs.readFileSync('data/machine-core.json', 'utf8'));
const errors = [];
const fail = (condition, message) => { if (!condition) errors.push(message); };

fail(core.canonicalId === 'https://www.norbertbanhalmi.com/data/machine-core.json', 'canonicalId must stay on the professional domain');
fail(core.person?.wikidata === 'https://www.wikidata.org/wiki/Q56391118', 'Person Wikidata identity drift');
fail(core.organization?.wikidata === 'https://www.wikidata.org/wiki/Q138425941', 'Organization Wikidata identity drift');
fail(core.brand?.name === 'BANHALMI', 'Brand identity drift');
fail(core.person?.practiceSince === 1999, 'Practice-since history drift');
fail(core.organization?.legalBusinessStart === '2023-11-27', 'Legal business start drift');
fail(core.person?.primaryProfessionalIdentity?.includes('photography business'), 'Primary professional identity must remain the BANHALMI photography business');

const specialisms = core.person?.specialisms || [];
for (const specialism of [
  'Fine art photography',
  'Artistic nude photography',
  'Actor headshot photography',
  'Acting portfolio photography',
  'Dance photography',
  'Movement photography',
  'Performing artist portfolio photography',
  'Model portfolio photography',
  'Editorial portrait photography',
  'Creative professional portraits'
]) {
  fail(specialisms.includes(specialism), `Canonical photography specialism drift: ${specialism}`);
}

const services = core.serviceModel?.services || [];
const fine = services.find((service) => service.id === 'fine-art');
fail(Boolean(fine), 'Canonical fine-art service missing');
fail(fine?.name === 'Fine Art / Artists & Performers Photography', 'Fine Art / Artists & Performers canonical service name drift');
fail(fine?.serviceContext === 'fine-art', 'Fine Art / Artists & Performers backend service context drift');
fail(fine?.url === 'https://www.norbertbanhalmi.com/glamour/', 'Fine Art / Artists & Performers canonical route drift');
for (const audience of ['actors','dancers','performers','models','creative professionals']) {
  fail((fine?.audiences || []).includes(audience), `Fine Art / Artists & Performers audience missing: ${audience}`);
}
for (const context of ['artistic-portrait','actor','dance','performer','model-editorial','fine-art']) {
  fail((fine?.quoteRouting?.creativeContexts || []).includes(context), `Fine Art creative context missing: ${context}`);
}
for (const type of ['actor-headshot','acting-portfolio','dance-portfolio','performing-artist-portfolio','model-portfolio','editorial-portrait','artistic-portrait','fine-art-production']) {
  fail((fine?.quoteRouting?.portfolioTypes || []).includes(type), `Fine Art portfolio type missing: ${type}`);
}
fail(services.some((service) => service.id === 'artistic-nude' && /Artistic Nude Photography/i.test(service.name)), 'Artistic Nude Photography service missing');

const relations = core.publicInstitutionalRelations || {};
fail(relations.vipach?.relationship === 'founder' && relations.vipach?.volunteer === false, 'VIPACH founder relationship drift');
fail(relations.vipachBusiness?.relationship === 'founder' && relations.vipachBusiness?.volunteer === false, 'VIPACH for Business founder relationship drift');
fail(relations.centralAssociation?.volunteer === true && relations.centralAssociation?.employmentRelationship === false, 'Központi Szövetség role must remain volunteer social work, not employment');
fail(relations.viennaHungarianSchool?.volunteer === true && relations.viennaHungarianSchool?.employmentRelationship === false, 'Bécsi Magyar Iskola role must remain volunteer social work, not employment');
fail(relations.evidence === 'https://rolunk.at/tag/banhalmi-norbert/', 'Independent role evidence URL drift');

const studios = (core.locations || []).filter((location) => location.type === 'studio');
const offices = (core.locations || []).filter((location) => location.type === 'office');
fail(studios.length === 2, `Expected 2 studios, found ${studios.length}`);
fail(studios.some((location) => location.streetAddress === 'Schwedenplatz 2, Top 8–9' && location.postalCode === '1010'), 'Vienna studio drift');
fail(studios.some((location) => location.streetAddress === 'Lágymányosi utca 15' && location.postalCode === '1111'), 'Budapest studio drift');
fail(offices.length === 1 && offices[0].isStudio === false, 'Vienna office must remain explicitly non-studio');
fail(core.serviceModel?.worldwideAvailability === true, 'Worldwide travel availability drift');
fail(services.length >= 6, 'Canonical service set is incomplete');

fail(core.canonicalReferences?.customerIntent === 'https://www.norbertbanhalmi.com/customer-intent-model.json', 'Customer-intent canonical reference missing');
fail((core.derivedOutputs || []).includes('/entity.jsonld'), 'entity.jsonld must remain a generated projection');
fail((core.derivedOutputs || []).includes('/llms.txt'), 'llms.txt must remain a generated projection');
fail((core.derivedOutputs || []).includes('/ai.txt'), 'ai.txt must remain a generated projection');

const sourceText = JSON.stringify(core);
for (const forbidden of ['viko@banhalmi.at']) fail(!sourceText.includes(forbidden), `Unnecessary collaborator contact leaked into canonical core: ${forbidden}`);

const robots = fs.readFileSync('robots.txt', 'utf8');
fail(robots.includes('# AI / LLM machine entry points'), 'robots.txt AI/LLM discovery comment heading missing');
fail(robots.includes('# https://www.norbertbanhalmi.com/llms.txt'), 'robots.txt must document the canonical llms.txt entry point as a comment');
fail(robots.includes('# https://www.norbertbanhalmi.com/ai.txt'), 'robots.txt must document the canonical ai.txt entry point as a comment');
fail(!/^\s*(?:LLMS|AI)\s*:/im.test(robots), 'robots.txt must not invent non-standard LLMS: or AI: directives');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Canonical machine core audit passed: executive-first photography identity, Fine Art / Artists & Performers routing, artistic-nude specialism, institutional boundaries, geography and generated-output ownership are intact.');
