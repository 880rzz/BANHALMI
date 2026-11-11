#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';

const LINKEDIN = 'https://www.linkedin.com/feed/update/urn:li:activity:7526215563845570561';
const VIPACH = 'https://www.vipach.at/';
const FLICKR = 'https://www.flickr.com/photos/vipach/albums';

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
}

if (failures.length) {
  console.error('VIPACH–BANHALMI relationship audit FAILED:');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
console.log('VIPACH–BANHALMI relationship + Flickr archive audit passed: visible EN/HU/DE parity, LinkedIn provenance, shared archive semantics, no employment/sameAs overclaim.');
