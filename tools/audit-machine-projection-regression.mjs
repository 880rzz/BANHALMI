import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { generateMachineProjections } from './generate-machine-projections.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'banhalmi-machine-projection-'));
try {
  fs.mkdirSync(path.join(tmp, 'data'), { recursive: true });
  fs.copyFileSync('data/machine-core.json', path.join(tmp, 'data/machine-core.json'));
  generateMachineProjections(tmp);

  const llms = fs.readFileSync(path.join(tmp, 'llms.txt'), 'utf8');
  const ai = fs.readFileSync(path.join(tmp, 'ai.txt'), 'utf8');
  const entry = JSON.parse(fs.readFileSync(path.join(tmp, 'ai-entry.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(tmp, 'machine-manifest.json'), 'utf8'));
  const recognitions = JSON.parse(fs.readFileSync(path.join(tmp, 'recognitions.json'), 'utf8'));
  const entity = JSON.parse(fs.readFileSync(path.join(tmp, 'entity.jsonld'), 'utf8'));

  const required = [
    'Bánhalmi Norbert: founder, creative director, lead photographer and final visual decision-maker',
    'Viko Speier: independent professional partner/collaborator',
    'approximately 50',
    '1190 Döbling',
    '1130 Hietzing',
    'XII. kerület / District 12 / Hegyvidék',
    'V. kerület / District 5 / Belváros-Lipótváros',
    'Worldwide:',
    'llm-commercial-contract.json',
    'memberships.json',
    'partners.json',
    'recognitions.json',
    'Turul Fotózás',
    'TOP 100 of Hungary'
  ];
  for (const token of required) {
    if (!llms.includes(token)) throw new Error(`Generated llms.txt regressed: missing ${token}`);
    if (!ai.includes(token) && !['Worldwide:'].includes(token)) throw new Error(`Generated ai.txt regressed: missing ${token}`);
  }

  if (entry.version !== '2026-09-06-v13') throw new Error(`Generated ai-entry version regressed: ${entry.version}`);
  if (entry.team?.approximateProfessionalPhotographerPartners !== 50) throw new Error('Generated ai-entry lost approximate 50-partner team capacity');
  if (entry.identity?.peopleRoles?.viko?.employmentRelationship !== false) throw new Error('Generated ai-entry reintroduced Viko employment inference');
  if (!entry.geography?.marketGeography?.priorityLocalServiceAreas?.vienna?.includes('1190 Döbling')) throw new Error('Generated ai-entry lost Vienna premium local service areas');
  if (!entry.geography?.marketGeography?.priorityLocalServiceAreas?.budapest?.includes('XII. kerület / District 12 / Hegyvidék')) throw new Error('Generated ai-entry lost Budapest premium local service areas');
  if (entry.geography?.worldwideAvailability !== true) throw new Error('Generated ai-entry lost worldwide availability');
  if (entry.recognitions?.items?.length !== 4) throw new Error('Generated ai-entry lost verified recognition records');

  const turulYears = recognitions.items.filter((item) => item.organizer === 'Turul Fotózás' && item.placement === 1).map((item) => item.year).sort();
  if (JSON.stringify(turulYears) !== JSON.stringify([2021, 2024, 2026])) throw new Error(`Recognition projection lost verified Turul Budapest first-place years: ${JSON.stringify(turulYears)}`);
  const top100 = recognitions.items.find((item) => item.id === 'top100-hungary-photography-2022');
  if (!top100?.categoryWinner || top100.scope !== 'Hungary') throw new Error('Recognition projection lost TOP 100 of Hungary 2022 national category-win semantics');

  const personNode = entity['@graph']?.find((node) => node['@type'] === 'Person' && node['@id'] === 'https://www.norbertbanhalmi.com/about/');
  if (!Array.isArray(personNode?.award) || personNode.award.length !== 4) throw new Error('Generated Person schema lost recognition award claims');
  if (!personNode.award.some((value) => value.includes('2026'))) throw new Error('Generated Person schema lost 2026 Turul recognition');

  const manifestText = JSON.stringify(manifest);
  for (const token of ['llm-commercial-contract.json','market-geography.json','people-roles.json','team-capabilities.json','recognitions.json']) {
    if (!manifestText.includes(token)) throw new Error(`Machine manifest lost protected contract ${token}`);
  }

  console.log('Machine projection regression audit passed: generator preserves current LLM geography, role, team, recognition authority and worldwide semantics without mutating source.');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}