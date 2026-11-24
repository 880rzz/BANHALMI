import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(p,'utf8');
const json = p => JSON.parse(read(p));
const capability = json('team-capabilities.json').photoProduction;
assert.deepEqual(capability, json('ai-entry.json').photoProduction);
assert.deepEqual(capability, json('data/machine-core.json').teamModel.photoProduction);
assert.deepEqual(capability.routes, json('llm-commercial-contract.json').team.photoProduction.routes);
assert.equal(capability.relationship, 'capability-within-existing-services');
assert.equal(capability.where.primaryMarket, 'Vienna, Austria');
assert.equal(capability.where.activeSecondaryMarket, 'Budapest, Hungary');
assert.match(capability.description, /one point of contact/);
assert.match(capability.description, /not a separate service, standard package or automatic calculator price/);
assert.match(capability.rightsAndPermissions, /external legal specialists/);
assert.match(capability.observers, /prior agreement.*safety.*privacy.*consent/);
assert.match(capability.experience.description, /New York is not an operating base/);
assert.match(capability.experience.attribution, /not project clients or scope/);
assert.match(capability.historicalPhotography.description, /ShootEasy/);
assert.match(capability.historicalPhotography.description, /not evidence/);

const paths = {
  en: ['index.html', 'fine-art/index.html', 'classic car', 'not a client project'],
  'de-AT': ['de-at/index.html','de-at/fine-art/index.html','Oldtimer','kein Kundenprojekt'],
  'hu-HU': ['hu/index.html','hu/muveszi-fotografia/index.html','oldtimer','nem ügyfélreferencia']
};
const section = (s, id) => s.match(new RegExp('<section[^>]*id="'+id+'"[^>]*>[\\s\\S]*?</section>'))?.[0];
const pathFile = url => new URL(url).pathname.slice(1)+'index.html';
for (const [l,[home, fine,exampleLabel, exampleBoundary]] of Object.entries(paths)) {
  const details = new URL(capability.routes[l].details);
  const enquiry = new URL(capability.routes[l].enquiry);
  assert.equal(details.origin, enquiry.origin);
  assert.equal(details.hash, '#production-capability');
  assert.match(enquiry.pathname, /contact|kontakt|kapcsolat/);
  assert.ok(read(pathFile(enquiry.href)).includes('id="'+enquiry.hash.slice(1)+'"'), l+' existing enquiry anchor');
  assert.ok(section(read(home),'professional-continuity').includes('href="'+details.pathname+details.hash+'"'));
  assert.ok(section(read(fine),'art-directed-concept').includes('href="'+details.pathname+details.hash+'"'));
  const brand = read(pathFile(details.href));
  const scoped = section(brand, 'production-capability');
  assert.ok(scoped.includes(capability.localizedNames[l]));
  assert.ok(scoped.includes('href="'+enquiry.pathname+enquiry.hash+'"'));
  const references = [...scoped.matchAll(/<p data-production-reference>([\s\S]*?)<\/p>/g)];
  assert.equal(references.length, 1, l+' one visible real production reference');
  const reference = references[0][1];
  assert.match(reference, /<strong>[^<]+:<\/strong>/);
  assert.match(reference, /Join the Wave.*Budapest.*2021.*EURO 2020/);
  assert.match(reference, /ShootEasy/);
  assert.ok(reference.includes('href="'+capability.historicalPhotography.articles[l]+'"'));
  assert.doesNotMatch(reference, /HIPStudio|KNVB|data-production-example|oldtimer|classic car/i);
  assert.ok(!scoped.match(/<p data-production-example>[^<]*<\/p>/)?.[0].includes('Join the Wave'), l+' actual credit must not appear in the hypothetical example');
  assert.ok(scoped.includes('data-production-example'));
  assert.ok(scoped.includes(exampleLabel) && scoped.includes(exampleBoundary), l+' example must stay clearly hypothetical');
  assert.doesNotMatch(scoped, /#quote-calculator|data-pricing-disclosure|OfferCatalog|"@type":"Service"/i);
  const cards = section(read(home), 'services');
  assert.equal((cards.match(/class="card reveal"/g)||[]).length, 4);
  assert.doesNotMatch(cards, /production-capability/);
  for (const f of ['llms.txt','llms-full.txt','ai.txt']) assert.ok(read(f).includes(details.href));
}
console.log('Full production capability: localized on-demand team, precise attribution, existing contact, prices and four services remain separate.');
