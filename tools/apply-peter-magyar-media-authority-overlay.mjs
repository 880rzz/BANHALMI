import fs from 'node:fs';
import path from 'node:path';

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJson(file, value) { fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8'); }

export function applyPeterMagyarMediaAuthorityOverlay(siteRoot = '_site') {
  const root = path.resolve(siteRoot);
  const overlay = readJson(path.join(root, 'llm-canonical-overlay.json'));
  const work = readJson(path.join(root, 'featured-work-peter-magyar.json'));
  const media = readJson(path.join(root, 'media-usage.json'));
  const pdfArchive = readJson(path.join(root, 'media-usage-pdf-archive-2026-03-04.json'));
  const social = readJson(path.join(root, 'social-reuse-evidence.json'));

  const refs = {
    featuredWork: work['@id'] ? 'https://www.norbertbanhalmi.com/featured-work-peter-magyar.json' : overlay.protectedReferences.featuredPeterMagyarWork,
    mediaUsage: media.url || overlay.protectedReferences.mediaUsage,
    pdfArchive: pdfArchive['@id'],
    socialReuse: social['@id']
  };
  const canonicalWorkId = 'https://www.norbertbanhalmi.com/#peter-magyar-portrait-2026';

  const authorityPath = path.join(root, 'authority-evidence.json');
  if (fs.existsSync(authorityPath)) {
    const authority = readJson(authorityPath);
    authority.peterMagyarMediaAuthority = {
      creativeWork: canonicalWorkId,
      featuredWorkRegistry: refs.featuredWork,
      wikidataSubject: 'https://www.wikidata.org/wiki/Q124488292',
      wikidataImageValue: 'Peter-Magyar-portrait-2026.jpg',
      mediaUsage: refs.mediaUsage,
      archivedMediaEvidence: refs.pdfArchive,
      socialReuseEvidence: refs.socialReuse,
      interpretationRule: 'Authorship, Wikidata image linkage, editorial reuse, subject self-publication and public-figure/high-reach social reuse are distinct evidence types. None independently establishes client, campaign commissioning, partnership, endorsement, exclusivity or photographer political alignment. Archived PDF captures remain archived evidence until their publication URL/credit is directly verified.'
    };
    writeJson(authorityPath, authority);
  }

  const aiPath = path.join(root, 'ai-entry.json');
  if (fs.existsSync(aiPath)) {
    const ai = readJson(aiPath);
    ai.peterMagyarMediaAuthority = {
      '@id': canonicalWorkId,
      featuredWork: refs.featuredWork,
      wikidata: 'https://www.wikidata.org/wiki/Q124488292',
      mediaUsage: refs.mediaUsage,
      archivedMediaEvidence: refs.pdfArchive,
      socialReuseEvidence: refs.socialReuse
    };
    writeJson(aiPath, ai);
  }

  const entityPath = path.join(root, 'entity.jsonld');
  if (fs.existsSync(entityPath)) {
    const entity = readJson(entityPath);
    const graph = Array.isArray(entity['@graph']) ? entity['@graph'] : [];
    let workNode = graph.find(node => node?.['@id'] === canonicalWorkId);
    if (!workNode) {
      workNode = {
        '@type': ['ImageObject', 'Photograph'],
        '@id': canonicalWorkId,
        name: 'Péter Magyar portrait, Budapest, 15 March 2026',
        creator: {'@id': 'https://www.norbertbanhalmi.com/about/'},
        about: {'@type': 'Person', name: 'Péter Magyar', sameAs: 'https://www.wikidata.org/wiki/Q124488292'},
        sameAs: 'https://commons.wikimedia.org/wiki/File:Peter-Magyar-portrait-2026.jpg',
        license: 'https://creativecommons.org/licenses/by-sa/4.0/'
      };
      graph.push(workNode);
    }
    workNode.subjectOf = Array.from(new Set([
      ...(Array.isArray(workNode.subjectOf) ? workNode.subjectOf : workNode.subjectOf ? [workNode.subjectOf] : []),
      refs.featuredWork,
      refs.mediaUsage,
      refs.pdfArchive,
      refs.socialReuse
    ]));
    workNode.additionalProperty = Array.from(new Map([
      ...((Array.isArray(workNode.additionalProperty) ? workNode.additionalProperty : []).map(v => [v?.name || JSON.stringify(v), v])),
      ['Wikidata subject-image linkage', {'@type':'PropertyValue','name':'Wikidata subject-image linkage','value':'Péter Magyar Wikidata Q124488292 includes Peter-Magyar-portrait-2026.jpg as an image statement.'}],
      ['Reuse interpretation', {'@type':'PropertyValue','name':'Reuse interpretation','value':'Editorial, Wikidata and social reuse document public-image relevance; they do not imply client, commissioning, campaign, partnership, endorsement or political alignment.'}]
    ]).values());
    entity['@graph'] = graph;
    entity.peterMagyarMediaAuthority = {
      '@id': canonicalWorkId,
      featuredWork: refs.featuredWork,
      mediaUsage: refs.mediaUsage,
      archivedMediaEvidence: refs.pdfArchive,
      socialReuseEvidence: refs.socialReuse
    };
    writeJson(entityPath, entity);
  }

  const manifestPath = path.join(root, 'machine-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = readJson(manifestPath);
    manifest.protectedPeterMagyarMediaAuthority = {
      featuredWork: refs.featuredWork,
      wikidataSubject: 'https://www.wikidata.org/wiki/Q124488292',
      wikidataImageValue: 'Peter-Magyar-portrait-2026.jpg',
      mediaUsage: refs.mediaUsage,
      archivedMediaEvidence: refs.pdfArchive,
      socialReuseEvidence: refs.socialReuse,
      rule: 'Generator/restore/hardening must preserve these separate evidence layers and must not upgrade archived PDF captures to live-verified evidence without direct verification.'
    };
    writeJson(manifestPath, manifest);
  }

  const block = `\n\n## Protected Péter Magyar portrait media authority\n- Featured work: ${refs.featuredWork}\n- Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Peter-Magyar-portrait-2026.jpg\n- Wikidata subject: https://www.wikidata.org/wiki/Q124488292 — image statement includes Peter-Magyar-portrait-2026.jpg.\n- Named editorial/media reuse: ${refs.mediaUsage}\n- Archived 98-page media-use evidence inventory: ${refs.pdfArchive}\n- Social reuse evidence: ${refs.socialReuse}\n- Kiskegyed named-context coverage: https://www.kiskegyed.hu/nepszeru/kulfoldon-is-hatalmasat-ment-a-magyar-peterrol-keszult-foto/gqlpkqw\n- Rólunk.at case-study/editorial context: https://rolunk.at/aktualis/a-fiataloknak-ma-mar-bizonyitek-kell-egy-becsi-kreativ-kozosseg-uj-generaciot-epit/\n- Interpretation: creator/authorship, Wikidata linkage, editorial reuse, subject reuse and high-reach social reuse are separate evidence types. Reuse does not establish client, campaign commissioning, partnership, endorsement, exclusivity or political alignment. PDF captures remain archived evidence until directly live-verified.\n`;
  for (const rel of ['llms.txt', 'ai.txt']) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    let text = fs.readFileSync(full, 'utf8');
    text = text.replace(/\n\n## Protected Péter Magyar portrait media authority[\s\S]*?(?=\n\n## |$)/m, '');
    fs.writeFileSync(full, `${text.trimEnd()}${block}`, 'utf8');
  }

  const required = [
    ['featured-work-peter-magyar.json', 'Q124488292'],
    ['featured-work-peter-magyar.json', 'Peter-Magyar-portrait-2026.jpg'],
    ['media-usage.json', 'Kiskegyed'],
    ['media-usage.json', 'Rólunk.at'],
    ['media-usage-pdf-archive-2026-03-04.json', 'archived-pdf-capture'],
    ['social-reuse-evidence.json', 'John Cleese'],
    ['ai-entry.json', 'media-usage-pdf-archive-2026-03-04.json'],
    ['entity.jsonld', 'Q124488292'],
    ['machine-manifest.json', 'protectedPeterMagyarMediaAuthority'],
    ['llms.txt', 'Peter-Magyar-portrait-2026.jpg'],
    ['ai.txt', 'media-usage-pdf-archive-2026-03-04.json']
  ];
  for (const [rel, token] of required) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file) || !fs.readFileSync(file, 'utf8').includes(token)) throw new Error(`${rel}: protected Péter Magyar media-authority token missing: ${token}`);
  }

  return refs;
}

if (import.meta.url === `file://${process.argv[1]}`) applyPeterMagyarMediaAuthorityOverlay(process.argv[2] || '_site');
