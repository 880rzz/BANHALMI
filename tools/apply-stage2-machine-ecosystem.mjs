import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const blogUrl = 'https://blog.banhalmi.art/';
const files = ['entity.jsonld', 'entity-graph.json', 'knowledge.json', 'ecosystem.json'];

for (const relative of files) {
  const file = path.join(root, relative);
  const data = JSON.parse(await readFile(file, 'utf8'));
  if (Array.isArray(data['@graph'])) {
    if (!data['@graph'].some((node) => node?.url === blogUrl || node?.['@id'] === `${blogUrl}#website`)) {
      data['@graph'].push({
        '@type': 'Blog',
        '@id': `${blogUrl}#website`,
        url: blogUrl,
        name: 'BANHALMI Blog',
        about: { '@id': 'https://www.norbertbanhalmi.com/about/' },
        publisher: { '@id': 'https://www.norbertbanhalmi.com/#organization' }
      });
    }
  } else {
    data.officialSites = {
      professional: 'https://www.norbertbanhalmi.com/',
      archive: 'https://www.banhalmi.art/',
      blog: blogUrl
    };
  }
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

console.log('Final machine-readable ecosystem migration completed for four files.');
