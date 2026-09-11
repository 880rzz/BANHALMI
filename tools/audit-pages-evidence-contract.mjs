import fs from 'node:fs';

const workflow = fs.readFileSync('.github/workflows/pages.yml','utf8');
const overlay = JSON.parse(fs.readFileSync('llm-canonical-overlay.json','utf8'));

function requireContract(condition,message){if(!condition) throw new Error(message);}

const pressRef = overlay?.protectedReferences?.pressInstitutionalEvidence;
const externalRef = overlay?.protectedReferences?.externalPhotographyEvidence;
requireContract(pressRef === 'https://www.norbertbanhalmi.com/press-institutional-evidence.json','Canonical press evidence ref drift');
requireContract(externalRef === 'https://www.norbertbanhalmi.com/external-photography-evidence.json','Canonical external evidence ref drift');

for(const token of [
  '_site/external-photography-evidence.json',
  '_site/press-institutional-evidence.json',
  '_site/machine-manifest.json',
  'Press / Editorial Photography',
  'Institutional / Diplomatic Event Photography',
  'Bécsi Napló',
  'pressInstitutionalEvidence',
  'protectedPressInstitutionalEvidence',
  'https://www.norbertbanhalmi.com/external-photography-evidence.json',
  'https://www.norbertbanhalmi.com/press-institutional-evidence.json',
  'https://www.norbertbanhalmi.com/machine-manifest.json'
]) requireContract(workflow.includes(token),`Pages workflow lost protected evidence assertion/route: ${token}`);

requireContract(!workflow.includes('older projection code must not erase current commercial, geography, role or ecosystem semantics'),'Pages workflow still pins obsolete exact policy prose instead of semantic evidence keys');

console.log('Pages evidence deployment contract passed: external + press evidence routes and semantic manifest assertions are pinned without brittle policy-prose matching.');
