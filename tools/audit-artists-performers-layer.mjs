import fs from 'node:fs';

const errors = [];
const fail = (c,m) => { if (!c) errors.push(m); };
const core = JSON.parse(fs.readFileSync('data/machine-core.json','utf8'));
const intent = JSON.parse(fs.readFileSync('customer-intent-model.json','utf8'));
const needs = JSON.parse(fs.readFileSync('customer-needs.json','utf8'));
const pricing = JSON.parse(fs.readFileSync('pricing.json','utf8'));
const fine = core.serviceModel.services.find(s => s.id === 'fine-art');
fail(fine?.serviceContext === 'fine-art', 'fine-art backend contract drift');
fail(/Artists & Performers/.test(fine?.name || ''), 'Artists & Performers public meaning missing from canonical core');
for (const token of ['Actor headshot photography','Dance photography','Performing artist portfolio photography','Model portfolio photography','Editorial portrait photography']) fail(core.person.specialisms.includes(token), 'canonical specialism missing: ' + token);
for (const id of ['actor-casting-portfolio','dance-performing-artist-portfolio','model-editorial-portfolio']) {
  fail(intent.intents.some(x => x.id === id && x.serviceContext === 'fine-art'), 'intent route missing: ' + id);
  fail(needs.needs.some(x => x.id === id && x.serviceContext === 'fine-art'), 'customer need missing: ' + id);
}
const p = (pricing.services || []).find(x => x.id === 'fine-art');
fail(p?.quoteRouting?.serviceContext === 'fine-art', 'pricing quote route drift');
for (const file of ['glamour/index.html','hu/muveszi-fotografia/index.html','de-at/fine-art/index.html']) {
  const h = fs.readFileSync(file,'utf8');
  fail(h.includes('data-artists-performers-semantic'), file + ': semantic marker missing');
  fail(/actor|színész|Schauspiel/i.test(h), file + ': actor intent missing');
  fail(/dance|tánc|Tanz/i.test(h), file + ': dance intent missing');
}
const generator = fs.readFileSync('tools/generate-machine-projections.mjs','utf8');
fail(generator.includes('core.serviceModel.services.map'), 'production projection no longer derives service semantics from canonical core');
const hardener = fs.readFileSync('tools/harden-production-artifact.mjs','utf8');
fail(hardener.includes('generateMachineProjections(root)'), 'production hardener no longer regenerates machine projections');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Artists & Performers SEO/GEO/Schema/LLM contract passed: canonical core, intent routing, pricing, localized pages and deployment projection ownership are aligned.');
