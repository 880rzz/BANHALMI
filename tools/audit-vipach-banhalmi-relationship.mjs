#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';

const LINKEDIN = 'https://www.linkedin.com/feed/update/urn:li:activity:7526215563845570561';
const VIPACH = 'https://www.vipach.at/';
const FLICKR = 'https://www.flickr.com/photos/vipach/albums';
const VIPACH_WIKIDATA = 'https://www.wikidata.org/wiki/Q138416887';
const NORBERT_WIKIDATA = 'https://www.wikidata.org/wiki/Q56391118';
const VIPACH_WIKIPEDIA = 'https://hu.wikipedia.org/wiki/VIPACH';
const FOUNDER_STATEMENT = 'Q138416887 → founder (P112) → Q56391118';

const aboutPages = [
  ['about/index.html', 'talent-development'],
  ['hu/eletmu/index.html', 'talent-development'],
  ['de-at/werk/index.html', 'talent-development'],
];
const homePages = [
  'index.html',
  'hu/index.html',
  'de-at/index.html',
];
const trustPages = [
  'trust/index.html',
  'hu/bizalom/index.html',
  'de-at/vertrauen/index.html',
];
const eventPages = [
  ['event-photography/index.html', 'VIPACH × BANHALMI archive'],
  ['hu/rendezvenyfotozas/index.html', 'VIPACH × BANHALMI eseményarchívum'],
  ['de-at/eventfotografie/index.html', 'VIPACH × BANHALMI Event-Archiv'],
];

const failures = [];

for (const [path, marker] of aboutPages) {
  const html = fs.readFileSync(path, 'utf8');
  if (!html.includes(`data-vipach-relationship="${marker}"`)) failures.push(`${path}: missing talent-development section`);
  if (!html.includes(VIPACH)) failures.push(`${path}: missing VIPACH organisational URL`);
  if (!/does not imply employment|nem jelent foglalkoztatást|bedeutet nicht automatisch Anstellung/i.test(html)) {
    failures.push(`${path}: missing non-employment clarification`);
  }
  if (/parentOrganization|subsidiary of BANHALMI|BANHALMI academy|sameAs":"https:\/\/www\.vipach\.at/i.test(html)) {
    failures.push(`${path}: forbidden overclaim/sameAs pattern`);
  }
}

for (const path of homePages) {
  const html = fs.readFileSync(path, 'utf8');
  if (!html.includes('data-vipach-relationship="talent-development-home"')) failures.push(`${path}: missing home continuity section`);
  if (!html.includes(VIPACH)) failures.push(`${path}: missing VIPACH URL`);
}

for (const path of trustPages) {
  const html = fs.readFileSync(path, 'utf8');
  if (!html.includes('data-vipach-relationship="evidence"')) failures.push(`${path}: missing trust evidence section`);
  if (!html.includes(LINKEDIN)) failures.push(`${path}: missing LinkedIn provenance`);
  if (!html.includes(FLICKR)) failures.push(`${path}: missing Flickr archive link`);
  if (!/VIPACH × BANHALMI/.test(html)) failures.push(`${path}: missing VIPACH × BANHALMI archive naming`);
  if (!/rel="noopener noreferrer"/.test(html)) failures.push(`${path}: missing safe external-link attributes`);
}

for (const [path, cta] of eventPages) {
  const html = fs.readFileSync(path, 'utf8');
  if (!html.includes(cta)) failures.push(`${path}: missing clarified Flickr CTA (${cta})`);
  if (!html.includes(`href="${FLICKR}"`)) failures.push(`${path}: Flickr albums URL missing`);
  if (!/VIPACH × BANHALMI/.test(html)) failures.push(`${path}: missing VIPACH × BANHALMI naming`);
  if (!/separate entit|külön entitás|getrennte Entit/i.test(html)) failures.push(`${path}: missing separate-entity clarification`);
  if (/iframe[^>]+flickr|platform\.twitter|linkedin\.com\/embed/i.test(html)) failures.push(`${path}: forbidden embed detected`);
}

const ste = JSON.parse(fs.readFileSync('service-trust-evidence.json', 'utf8'));
const rel = (ste.verifiedRelationshipEvidence || []).find((r) => r.id === 'banhalmi-linkedin-vipach-talent-development-2025');
if (!rel) failures.push('service-trust-evidence: LinkedIn VIPACH relationship record missing');
else {
  if (rel.url !== LINKEDIN) failures.push('service-trust-evidence: LinkedIn URL drift');
  if (!/talent development/i.test(rel.relationshipType || '')) failures.push('service-trust-evidence: relationshipType drift');
  if (!Array.isArray(rel.notProvenByThisSourceAlone) || !rel.notProvenByThisSourceAlone.includes('automatic employment')) {
    failures.push('service-trust-evidence: notProven guardrails incomplete');
  }
}

const knowledge = JSON.parse(fs.readFileSync('knowledge.json', 'utf8'));
if (knowledge.vipachFounderRelationship?.wikidataStatement !== FOUNDER_STATEMENT) failures.push('knowledge.json: exact VIPACH founder Wikidata statement missing/drift');
if (knowledge.vipachFounderRelationship?.subject?.wikidata !== VIPACH_WIKIDATA) failures.push('knowledge.json: VIPACH Wikidata identity missing/drift');
if (knowledge.vipachFounderRelationship?.founder?.wikidata !== NORBERT_WIKIDATA) failures.push('knowledge.json: Norbert Wikidata identity missing/drift');
if (!(knowledge.vipachFounderRelationship?.evidence || []).some((e) => e.url === VIPACH_WIKIPEDIA)) failures.push('knowledge.json: VIPACH Wikipedia founder provenance missing');

const founderEvidence = (ste.verifiedRelationshipEvidence || []).find((r) => r.id === 'vipach-founder-wikidata-wikipedia-verified');
if (!founderEvidence) failures.push('service-trust-evidence: VIPACH founder evidence record missing');
else {
  if (founderEvidence.exactWikidataStatement !== FOUNDER_STATEMENT) failures.push('service-trust-evidence: founder statement drift');
  if (!founderEvidence.evidence?.includes(VIPACH_WIKIDATA)) failures.push('service-trust-evidence: VIPACH Wikidata evidence missing');
  if (!founderEvidence.evidence?.includes(VIPACH_WIKIPEDIA)) failures.push('service-trust-evidence: VIPACH Wikipedia evidence missing');
}

const gallery = JSON.parse(fs.readFileSync('official-event-gallery.json', 'utf8'));
if (!/shared public Flickr archive|VIPACH × BANHALMI/i.test(gallery.description || '')) {
  failures.push('official-event-gallery: missing shared-archive description');
}
if (!gallery.sharedArchiveSemantics || gallery.sharedArchiveSemantics.browseUrl !== FLICKR) {
  failures.push('official-event-gallery: sharedArchiveSemantics missing/drift');
}

const evidence = JSON.parse(fs.readFileSync('external-photography-evidence.json', 'utf8'));
if (evidence.flickrArchive?.label !== 'VIPACH × BANHALMI') failures.push('external-photography-evidence: flickrArchive.label drift');
if (!/separate organisations|sameAs/i.test(evidence.flickrArchive?.entitySeparation || '')) {
  failures.push('external-photography-evidence: entitySeparation missing');
}

for (const path of ['llms.txt', 'ai.txt']) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(LINKEDIN)) failures.push(`${path}: LinkedIn provenance missing`);
  if (!/VIPACH × BANHALMI/.test(text)) failures.push(`${path}: VIPACH × BANHALMI naming missing`);
  if (!/does not imply employment/i.test(text)) failures.push(`${path}: non-employment clarification missing`);
  if (path === 'ai.txt' && !text.includes(FOUNDER_STATEMENT)) failures.push('ai.txt: exact VIPACH founder statement missing');
}

if (failures.length) {
  console.error('VIPACH–BANHALMI relationship audit FAILED:');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
const llmsFull = fs.readFileSync('llms-full.txt', 'utf8');
if (!llmsFull.includes(FOUNDER_STATEMENT)) {
  console.error('VIPACH–BANHALMI relationship audit FAILED:');
  console.error(' - llms-full.txt: exact VIPACH founder statement missing');
  process.exit(1);
}
console.log('VIPACH–BANHALMI relationship + founder provenance + Flickr archive audit passed: EN/HU/DE parity, LinkedIn provenance, Q138416887 → founder/P112 → Q56391118, shared archive semantics, no employment/sameAs overclaim.');
