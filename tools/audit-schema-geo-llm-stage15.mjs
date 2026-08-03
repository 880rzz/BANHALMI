import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const errors = [];
const policyPath = path.join(root, 'project-policy.json');
const schemaPath = path.join(root, 'project-policy.jsonld');

for (const file of [policyPath, schemaPath]) {
  if (!fs.existsSync(file)) errors.push(`${path.basename(file)} missing`);
  else {
    try { JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (error) { errors.push(`${path.basename(file)} invalid JSON: ${error.message}`); }
  }
}

if (fs.existsSync(policyPath)) {
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  const requiredTop = ['commercialInterpretation','licensing','workflow','peopleAndStudios','bookingAndContingency','confidentialityAndPublication','storageAndDeletion','accessibility','authoritativeHumanPages','interpretationRules'];
  for (const key of requiredTop) if (!policy[key]) errors.push(`project-policy.json missing ${key}`);
  for (const lang of ['en','hu-HU','de-AT']) if (!policy.languages?.includes(lang)) errors.push(`project-policy.json missing language ${lang}`);
  for (const lang of ['en','hu-HU','de-AT']) {
    const pages = policy.authoritativeHumanPages?.[lang];
    for (const key of ['faq','privacy','terms','quote']) if (!pages?.[key]?.startsWith('https://www.norbertbanhalmi.com/')) errors.push(`project-policy.json missing ${lang} ${key} page`);
  }
  const policyText = JSON.stringify(policy);
  for (const token of ['non-binding preliminary estimates','Copyright remains with the photographer','one authorised decision-maker','confidential by default','does not promise permanent archive storage','visible keyboard focus']) if (!policyText.includes(token)) errors.push(`project-policy.json missing policy token: ${token}`);
}

if (fs.existsSync(schemaPath)) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const graph = schema['@graph'];
  if (!Array.isArray(graph)) errors.push('project-policy.jsonld @graph missing');
  else {
    for (const type of ['DigitalDocument','Service','HowTo']) if (!graph.some(node => node['@type'] === type)) errors.push(`project-policy.jsonld missing ${type}`);
    if (!graph.some(node => node.provider?.['@id'] === 'https://www.norbertbanhalmi.com/#organization')) errors.push('project-policy.jsonld canonical provider missing');
    if (!graph.some(node => node.author?.['@id'] === 'https://www.norbertbanhalmi.com/about/')) errors.push('project-policy.jsonld canonical author missing');
  }
}

for (const relative of ['llms.txt','ai.txt']) {
  const text = fs.readFileSync(path.join(root, relative), 'utf8');
  if ((text.match(/<!-- PROJECT-POLICY-SYNC:START -->/g) || []).length !== 1) errors.push(`${relative} policy marker must appear once`);
  for (const token of ['project-policy.json','project-policy.jsonld','non-binding preliminary estimates','not automatically grant BANHALMI portfolio','Vienna and Budapest are two active bases']) if (!text.includes(token)) errors.push(`${relative} missing ${token}`);
}

const ecosystem = JSON.parse(fs.readFileSync(path.join(root, 'ecosystem.json'), 'utf8'));
for (const url of ['https://www.norbertbanhalmi.com/project-policy.json','https://www.norbertbanhalmi.com/project-policy.jsonld']) if (!ecosystem.authoritativeMachineReadableSources?.includes(url)) errors.push(`ecosystem.json missing ${url}`);
if (ecosystem.operationalPolicy?.canonicalData !== 'https://www.norbertbanhalmi.com/project-policy.json') errors.push('ecosystem.json operationalPolicy canonicalData mismatch');
if (ecosystem.schemaVersion !== '2026-08-03-v4') errors.push('ecosystem.json schemaVersion not updated');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Stage fifteen schema, GEO and LLM synchronization audit passed.');
