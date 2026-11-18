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

// Remaining canonical source owners must also agree with the immutable
// art-only visitor contract; generated machine entries are included here.
const services=JSON.parse(read('services.json'));
const fineArt=services.itemListElement.find(x=>x.name==='Fine Art Photography');
const overlay=JSON.parse(read('llm-canonical-overlay.json'));
const intent=JSON.parse(read('customer-intent-model.json'));
const machineEntry=JSON.parse(read('ai-entry.json'));
for(const [label,value] of [
 ['Artists & Performers answer',fineArt?.agentAnswerRule],
 ['Professional/ART intent separation',fineArt?.clientIntentSeparation],
 ['Artistic nude archive route',fineArt?.routingBoundary?.artisticNude],
 ['Protected LLM route policy',overlay.privateCommissionRouting?.policy],
 ['Human customer-intent route policy',intent.privateCommissionRouting?.policy]
]){
 assert.equal(typeof value,'string',label+' missing');
 assert.doesNotMatch(value,/artistic nude service and enquiries belong|current artistic-nude enquiries|tailored[- ]quote|personal ART commissions/i,label+': commercial ART path returned');
 assert.match(value,/historical|historic|archive|archival|exhibition|research/i,label+': must present an artistic archive rather than a service');
}
const fullMachineText=JSON.stringify(machineEntry);
assert.match(fullMachineText,/Ébredés|Awakening/,'AI entry lost historical artistic-nude reference');
assert.doesNotMatch(fullMachineText,/artistic nude service and enquiries belong|current artistic-nude enquiries belong/i,'AI entry reintroduced commercial art offering');
assert.match(JSON.stringify(overlay.privateCommissionRouting),/BANHALMI ART/,'Protected source lost ART-only identity');

console.log('ART/Professional boundary passed: archive-only Ébredés in three languages; paid business portfolios remain on Professional.');
