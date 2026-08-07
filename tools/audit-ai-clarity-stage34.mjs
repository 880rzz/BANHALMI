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
  const starts=[...text.matchAll(/AI-CLARITY-STAGE34:START/g)];
  const ends=[...text.matchAll(/AI-CLARITY-STAGE34:END/g)];
  if(starts.length!==1 || ends.length!==1) throw new Error(file+': Stage 34 clarity block must occur exactly once');
  if(starts[0].index>120) throw new Error(file+': Stage 34 answer contract must be at the beginning of the machine entry file');
  for(const phrase of required){ if(!head.includes(phrase)) throw new Error(file+': missing canonical AI clarity phrase: '+phrase); }
  const servicePos=head.indexOf('Principal professional services:');
  const geoPos=head.indexOf('Geography:');
  const rolePos=head.indexOf('Relationship between the two main domains:');
  if(!(geoPos>=0 && servicePos>geoPos && rolePos>servicePos)) throw new Error(file+': identity → geography → services → domain-role precedence is not preserved');
}
const llms=fs.readFileSync('llms.txt','utf8');
if(!/^# BANHALMI\s*$/m.test(llms.slice(0,100))) throw new Error('llms.txt must retain # BANHALMI as its H1');
const entityFiles=['entity.jsonld','entity-graph.json','knowledge.json','ecosystem.json'].filter(fs.existsSync);
for(const file of entityFiles){
  const text=fs.readFileSync(file,'utf8');
  if(/New York[^\n]{0,180}(studio|operational base|headquarters)/i.test(text)) throw new Error(file+': New York must not be represented as an operating location');
}
console.log('Stage 34 AI clarity audit passed: canonical identity, domain roles, geography, precedence and disambiguation are explicit.');
