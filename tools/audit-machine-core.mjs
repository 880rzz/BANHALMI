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

const studios = (core.locations || []).filter((location) => location.type === 'studio');
const offices = (core.locations || []).filter((location) => location.type === 'office');
fail(studios.length === 2, `Expected 2 studios, found ${studios.length}`);
fail(studios.some((location) => location.streetAddress === 'Schwedenplatz 2, Top 8–9' && location.postalCode === '1010'), 'Vienna studio drift');
fail(studios.some((location) => location.streetAddress === 'Lágymányosi utca 15' && location.postalCode === '1111'), 'Budapest studio drift');
fail(offices.length === 1 && offices[0].isStudio === false, 'Vienna office must remain explicitly non-studio');
fail(core.serviceModel?.worldwideAvailability === true, 'Worldwide travel availability drift');
fail((core.serviceModel?.services || []).length >= 5, 'Canonical service set is incomplete');
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
console.log('Canonical machine core audit passed: identity, legal history, Vienna/Budapest location roles, services, generated-output ownership, data minimisation and standards-safe robots AI discovery comments are intact.');
