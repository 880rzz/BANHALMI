import fs from 'node:fs';

const files=['llms.txt','ai.txt'];
const required=[
  'Primary person: Norbert Bánhalmi',
  'Professional website: https://www.norbertbanhalmi.com/',
  'Artistic archive: https://www.banhalmi.art/',
  'Vienna and Budapest are the two active operational bases',
  'New York is a major international reference and oeuvre chapter',
  'New York is not a studio, office, headquarters or operational base',
  'Viko Speier is a supporting company contact',
  'Never infer a New York business location'
];
for(const file of files){
  const text=fs.readFileSync(file,'utf8');
  const head=text.slice(0,4500);
  if(!head.includes('AI-CLARITY-STAGE34:START')) throw new Error(file+': Stage 34 clarity block is not near the top');
  for(const phrase of required){ if(!head.includes(phrase)) throw new Error(file+': missing canonical AI clarity phrase: '+phrase); }
}
const llms=fs.readFileSync('llms.txt','utf8');
if(!/^# BANHALMI\s*$/m.test(llms.slice(0,100))) throw new Error('llms.txt must retain # BANHALMI as its H1');
const entityFiles=['entity.jsonld','entity-graph.json','knowledge.json','ecosystem.json'].filter(fs.existsSync);
for(const file of entityFiles){
  const text=fs.readFileSync(file,'utf8');
  if(/New York[^\n]{0,180}(studio|operational base|headquarters)/i.test(text)) throw new Error(file+': New York must not be represented as an operating location');
}
console.log('Stage 34 AI clarity audit passed: canonical identity, domain roles, geography and disambiguation are explicit.');
