import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd();
const failures=[];
const priority=[
  'index.html','about/index.html','portrait/index.html','lifestyle/index.html','event-photography/index.html','glamour/index.html','contact/index.html','faq/index.html','speier-viko/index.html',
  'de-at/index.html','de-at/werk/index.html','de-at/portrait/index.html','de-at/brand/index.html','de-at/eventfotografie/index.html','de-at/fine-art/index.html','de-at/kontakt/index.html','de-at/faq/index.html','de-at/speier-viko/index.html'
];
const banned=[
  'This is not only for companies.',
  'The result is not simply a folder of photographs',
  'not only by which frame looks strongest',
  'Strategic Visual Partnership',
  'Viko Speier — strategy that can be seen',
  'im Modell der strategischen visuellen Partnerschaft von BANHALMI',
  'Strategie für visuelles Vertrauen',
  'Vier fotografische Leistungen',
  'Vier Bereiche, verbunden durch eine Bildsprache'
];
function visible(h){return h.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<noscript\b[\s\S]*?<\/noscript>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')}
for(const rel of priority){
  const file=path.join(root,rel);
  if(!fs.existsSync(file)){failures.push(`${rel}: missing`);continue;}
  const text=visible(fs.readFileSync(file,'utf8'));
  for(const phrase of banned) if(text.includes(phrase)) failures.push(`${rel}: old templated phrase remains: ${phrase}`);
}
const required=[
  ['index.html','Photography for clear communication'],
  ['index.html','Four ways we can work together'],
  ['lifestyle/index.html','The same approach also works for individuals.'],
  ['speier-viko/index.html','Viko Speier — where strategy meets photography'],
  ['de-at/index.html','Fotografie für klare Kommunikation'],
  ['de-at/index.html','Vier Formen der Zusammenarbeit'],
  ['de-at/speier-viko/index.html','Viko Speier — wo Strategie und Fotografie zusammenkommen']
];
for(const [rel,phrase] of required){const h=fs.readFileSync(path.join(root,rel),'utf8');if(!h.includes(phrase))failures.push(`${rel}: approved human copy missing: ${phrase}`)}
for(const rel of ['.human-voice/homepage-rewrite.py','.human-voice/oeuvre-rewrite.py']){
  if(!fs.existsSync(path.join(root,rel))) continue;
  const src=fs.readFileSync(path.join(root,rel),'utf8');
  for(const phrase of banned) if(src.includes(phrase)) failures.push(`${rel}: old phrase remains in generator: ${phrase}`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`English/German human-voice audit passed across ${priority.length} priority pages and source generators.`);
