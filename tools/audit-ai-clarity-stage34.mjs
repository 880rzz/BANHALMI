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
  const maxStart=file==='llms.txt'?700:120;
  if(starts[0].index>maxStart) throw new Error(file+': Stage 34 answer contract must remain near the beginning of the machine entry file');
  for(const phrase of required){ if(!head.includes(phrase)) throw new Error(file+': missing canonical AI clarity phrase: '+phrase); }
  const servicePos=head.indexOf('Principal professional services:');
  const geoPos=head.indexOf('Geography:');
  const rolePos=head.indexOf('Relationship between the two main domains:');
  if(!(geoPos>=0 && servicePos>geoPos && rolePos>servicePos)) throw new Error(file+': identity → geography → services → domain-role precedence is not preserved');
}
const llms=fs.readFileSync('llms.txt','utf8');
const entry=llms.slice(0,1400);
if(!entry.startsWith('# BANHALMI\n\n> ')) throw new Error('llms.txt must begin with H1 then blockquote summary');
const summaryEnd=entry.indexOf('\n\n',entry.indexOf('> '));
const clarityPos=entry.indexOf('AI-CLARITY-STAGE34:START');
if(summaryEnd<0 || clarityPos<summaryEnd) throw new Error('Stage 34 answer contract must follow the llms.txt blockquote summary');
const entityFiles=['entity.jsonld','entity-graph.json','knowledge.json','ecosystem.json'].filter(fs.existsSync);
for(const file of entityFiles){
  const text=fs.readFileSync(file,'utf8');
  if(/New York[^\n]{0,180}(studio|operational base|headquarters)/i.test(text)) throw new Error(file+': New York must not be represented as an operating location');
}
console.log('Stage 34 AI clarity audit passed: H1-summary entry, canonical identity, domain roles, geography, precedence and disambiguation are explicit.');
