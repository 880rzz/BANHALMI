import fs from 'node:fs';
const p='tools/audit-regression.mjs';
let s=fs.readFileSync(p,'utf8');
const old="'index.html':['Photography for clear communication','builds visual trust','Four principal services:','As a member of AmCham Austria']";
const next="'index.html':['Photography for clear communication','I photograph leaders and organisations for the places where their images actually need to work.','Four principal services:','As a member of AmCham Austria']";
if((s.split(old).length-1)!==1) throw new Error('English strategic-copy anchor missing or duplicated');
s=s.replace(old,next);
fs.writeFileSync(p,s);
console.log('English strategic positioning regression guard aligned with current visible copy.');
