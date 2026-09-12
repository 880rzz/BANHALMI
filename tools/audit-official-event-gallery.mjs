import fs from 'node:fs';
import assert from 'node:assert/strict';

const gallery = JSON.parse(fs.readFileSync('official-event-gallery.json', 'utf8'));
const registry = JSON.parse(fs.readFileSync('audit-registry.json', 'utf8'));
const core = JSON.parse(fs.readFileSync('data/machine-core.json', 'utf8'));
const pagesWorkflow = fs.readFileSync('.github/workflows/pages.yml', 'utf8');
const hardener = fs.readFileSync('tools/harden-production-artifact.mjs', 'utf8');

assert.equal(gallery.name, 'BANHALMI Photography × VIPACH Official Event Gallery');
assert.equal(gallery.url, 'https://www.flickr.com/people/vipach/');
assert.equal(gallery.relationshipType, 'official shared event and community photography gallery');
assert.equal(gallery.professionalPhotography.brand, 'BANHALMI');
assert.equal(gallery.professionalPhotography.alternateName, 'BANHALMI Photography');
assert.equal(gallery.professionalPhotography.teamDescriptor, 'Photography Team');
assert.equal(gallery.community.name, 'Vienna Photo Art & Creative Hub – VIPACH');

const serialized = JSON.stringify(gallery).toLowerCase();
for (const required of [
  'not a layer-1 canonical banhalmi property',
  'does not prove a client contract',
  'do not infer that bánhalmi norbert personally created every image',
  'not a separate organization',
  'do not make flickr an art canonical archive',
  'no automatic propagation without a direct, verified relationship'
]) {
  assert.ok(serialized.includes(required), `Official event gallery missing guardrail: ${required}`);
}

assert.equal(gallery.canonicalBoundaries.professionalAuthority, 'https://www.norbertbanhalmi.com/');
assert.equal(gallery.canonicalBoundaries.artisticAuthority, 'https://www.banhalmi.art/');
assert.equal(gallery.canonicalBoundaries.editorialAuthority, 'https://blog.banhalmi.art/');
assert.equal(gallery.canonicalBoundaries.communityAuthority, 'https://www.vipach.at/');

const audit = registry.audits.find((item) => item.id === 'official-event-gallery');
assert.ok(audit, 'Official event gallery audit is not registered');
assert.equal(audit.requiredForRelease, true, 'Official event gallery audit must block release');
assert.equal(audit.source, 'official-event-gallery.json');

// Drift protection: the production projection/build pipeline regenerates machine files.
// The official gallery must therefore be anchored in the canonical machine core and
// required by the immutable Pages artifact + live production gate before release.
assert.equal(
  core.canonicalReferences?.officialEventGallery,
  'https://www.norbertbanhalmi.com/official-event-gallery.json',
  'Canonical machine core does not reference official-event-gallery.json; generated projections could silently omit the gallery.'
);
assert.ok(
  core.disambiguationRules?.some((rule) => rule.includes('Flickr') && rule.includes('VIPACH')),
  'Canonical machine core lacks the Flickr/VIPACH relationship boundary.'
);
assert.ok(
  pagesWorkflow.includes('_site/official-event-gallery.json'),
  'Pages immutable artifact does not require official-event-gallery.json.'
);
assert.ok(
  pagesWorkflow.includes('https://www.norbertbanhalmi.com/official-event-gallery.json'),
  'Production live gate does not verify official-event-gallery.json.'
);
assert.ok(
  hardener.includes("'official-event-gallery.json'"),
  'Production hardener does not protect official-event-gallery.json as a required public contract.'
);

console.log('official-event-gallery: OK');
