import fs from 'node:fs';

const file='tools/audit-regression.mjs';
let source=fs.readFileSync(file,'utf8');
const oldBlock=`const strategicCopy={
  'index.html':['first impression','Four principal service areas:','As a member of AmCham Austria'],
  'hu/index.html':['első benyomást','Négy fő szolgáltatási terület:','Az AmCham Austria tagjaként'],
  'de-at/index.html':['ersten Eindruck','Vier zentrale Leistungsbereiche:','Als Mitglied von AmCham Austria']
};`;
const newBlock=`const strategicCopy={
  'index.html':['Visual Trust Strategy','builds visual trust','Four principal service areas:','As a member of AmCham Austria'],
  'hu/index.html':['Vizuális bizalomstratégia','vizuális bizalmat épít','Négy fő szolgáltatási terület:','Az AmCham Austria tagjaként'],
  'de-at/index.html':['Strategie für visuelles Vertrauen','visuelles Vertrauen aufbaut','Vier zentrale Leistungsbereiche:','Als Mitglied von AmCham Austria']
};`;
if(!source.includes(oldBlock)) throw new Error('Expected legacy strategicCopy block not found');
source=source.replace(oldBlock,newBlock);
fs.writeFileSync(file,source);
console.log('Updated regression assertions for visual-trust positioning.');
