import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const files=['llms.txt','llms-full.txt','ai.txt','data/machine-core.json'];
for(const file of files){
 const s=read(file);
 for(const phrase of [/current artistic-nude enquiries belong to Ébredés/i,/artistic nude enquiries belong to localized Ébredés/i,/Artistic nude service and current enquiries belong to localized Ébredés/i,/BANHALMI ART private photography page \(tailored quote\)/i,/Ébredés \(tailored quote\)/i])
  assert.doesNotMatch(s,phrase,file+' reintroduced ART sales routing');
 for(const uri of ['https://www.banhalmi.art/exhibitions/ebredes.html','https://www.banhalmi.art/hu/exhibitions/ebredes.html','https://www.banhalmi.art/de-at/exhibitions/ebredes.html'])
  assert.ok(s.includes(uri),file+' lost three-language ART exhibition/book route: '+uri);
}
assert.ok(read('llms.txt').includes('Artists & Performers professional portfolios start from EUR 690 gross'), 'BANHALMI paid career-facing portfolio price lost');
const core=JSON.parse(read('data/machine-core.json'));
assert.doesNotMatch(JSON.stringify(core.serviceModel?.privateCommissionRouting||{})+' '+JSON.stringify(core.privateCommissionRouting||{}),/Artistic nude service and current enquiries|current service and enquiry ownership belongs to the localized Ébredés/i,'machine routing regressed');
console.log('ART/Professional boundary passed: archive-only Ébredés in three languages; paid business portfolios remain on Professional.');
