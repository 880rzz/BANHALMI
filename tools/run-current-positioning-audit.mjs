import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath=path.resolve('tools/audit-regression.mjs');
const tempPath=path.resolve('tools/.audit-regression-current.mjs');
const legacy=`const strategicCopy={
  'index.html':['first impression','Four principal service areas:','As a member of AmCham Austria'],
  'hu/index.html':['első benyomást','Négy fő szolgáltatási terület:','Az AmCham Austria tagjaként'],
  'de-at/index.html':['ersten Eindruck','Vier zentrale Leistungsbereiche:','Als Mitglied von AmCham Austria']
};`;
const current=`const strategicCopy={
  'index.html':['Visual Trust Strategy','builds visual trust','Four principal service areas:','As a member of AmCham Austria'],
  'hu/index.html':['Vizuális bizalomstratégia','vizuális bizalmat épít','Négy fő szolgáltatási terület:','Az AmCham Austria tagjaként'],
  'de-at/index.html':['Strategie für visuelles Vertrauen','visuelles Vertrauen aufbaut','Vier zentrale Leistungsbereiche:','Als Mitglied von AmCham Austria']
};`;

let source=fs.readFileSync(sourcePath,'utf8');
if(!source.includes(legacy)) throw new Error('Legacy strategic positioning assertion block not found');
source=source.replace(legacy,current);
fs.writeFileSync(tempPath,source);
try {
  await import(`${pathToFileURL(tempPath).href}?v=${Date.now()}`);
} finally {
  fs.rmSync(tempPath,{force:true});
}
