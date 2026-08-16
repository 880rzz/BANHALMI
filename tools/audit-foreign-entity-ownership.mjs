import fs from 'node:fs';

const ROOT = process.cwd();
const ENTITY_FILE = 'entity.jsonld';
const OWN_IDS = new Set([
  'https://www.norbertbanhalmi.com/about/',
  'https://www.norbertbanhalmi.com/#organization',
  'https://www.norbertbanhalmi.com/#brand',
  'https://www.norbertbanhalmi.com/#website',
  'https://www.banhalmi.art/#website',
  'https://www.norbertbanhalmi.com/speier-viko/#person',
  'https://www.norbertbanhalmi.com/#visual-trust-partnership'
]);
const SERVICE_TOKENS = [
  'visual strategic partnership',
  'leadership positioning',
  'executive portraiture',
  'employer branding',
  'event communication',
  'visual reputation'
];
const failures = [];
const data = JSON.parse(fs.readFileSync(`${ROOT}/${ENTITY_FILE}`, 'utf8'));

function types(node) {
  const value = node?.['@type'];
  return Array.isArray(value) ? value : value ? [value] : [];
}

function inspect(node, path = '$') {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item, index) => inspect(item, `${path}[${index}]`));
    return;
  }

  const isOrg = types(node).some((type) => ['Organization', 'EducationalOrganization', 'ArtGallery'].includes(type));
  const id = node['@id'];
  const url = typeof node.url === 'string' ? node.url : '';
  const isBanhalmiOwned = OWN_IDS.has(id) || url.includes('norbertbanhalmi.com') || url.includes('banhalmi.art');

  if (isOrg && !isBanhalmiOwned) {
    const text = JSON.stringify({ description: node.description, slogan: node.slogan, knowsAbout: node.knowsAbout }).toLowerCase();
    for (const token of SERVICE_TOKENS) {
      if (text.includes(token)) failures.push(`${path}: foreign entity ${node.name || id || url || '(unnamed)'} inherits BANHALMI service semantics (${token})`);
    }
  }

  for (const [key, value] of Object.entries(node)) inspect(value, `${path}.${key}`);
}

inspect(data);

if (failures.length) {
  console.error('Foreign entity ownership audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Foreign entity ownership audit passed: external organisations remain identity references and do not inherit BANHALMI service properties.');
