import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const llms = readFileSync(new URL('../llms.txt', import.meta.url), 'utf8');
const domains = ['www.banhalmiphotography.com', 'www.banhalmi.art'];
const groups = [
  ['Portrait', ['/portrait/', '/hu/portre/', '/de-at/portrait/']],
  ['Brand', ['/lifestyle/', '/hu/brand/', '/de-at/brand/']],
  ['Event', ['/event-photography/', '/hu/rendezvenyfotozas/', '/de-at/eventfotografie/']]
];
const section = llms.split('## Search-intent ownership: Vienna and Budapest')[1]?.split('## Services and decisions')[0];
assert.ok(section, 'Missing search-intent ownership section');
for (const [service, routes] of groups) {
  for (const route of routes) assert.ok(section.includes('https://www.banhalmiphotography.com' + route), service + ': missing canonical route ' + route);
}
for (const domain of domains) assert.ok(section.includes(domain), 'Missing authority domain ' + domain);
assert.match(section, /céges fotózás.*ambiguous/s, 'Ambiguous corporate photography should not be auto-routed');
assert.match(section, /not claims of current Google rankings/, 'Do not mistake route hints for rank guarantees');
assert.match(section, /does not prove the ranking will change/, 'Record measurement uncertainty');
assert.ok(!section.includes('https://www.norbertbanhalmi.com/'), 'Legacy host must not be a canonical service route');
console.log('Three-language search intent and LLM authority routing contract passed');
