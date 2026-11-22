import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const policy = read('data/image-rights-owner-policy.json');
assert.equal(policy.declarationBasis, 'first-party-owner-statement');
assert.equal(policy.copyrightHolder.legalName, 'Bánhalmi Norbert');
assert.equal(policy.copyrightHolder.internationalName, 'Norbert Banhalmi');
assert.equal(policy.copyrightHolder.brand, 'BANHALMI');
assert.equal(policy.copyrightHolder.personId, 'https://www.banhalmi.art/#about');
assert.equal(policy.verification.perAssetBinaryMetadataVerified, false);
assert.equal(policy.verification.googleLicensableBadgeObserved, false);
assert.ok(policy.exceptions.some(text => /CC BY-SA 4\.0/.test(text)));
assert.ok(policy.exceptions.some(text => /Third-party creators/.test(text)));

const catalog = read('data/image-catalog.json');
const images = (catalog.dataFeedElement ?? []).map(entry => entry.item).filter(Boolean);
assert.ok(images.length > 100, 'Professional catalog unexpectedly empty');
for (const [i, photo] of images.entries()) {
  assert.equal(photo.copyrightHolder?.['@id'], policy.copyrightHolder.personId,
    'Professionally licensed photo must retain canonical person copyright holder at entry ' + i);
  assert.ok(photo.license && photo.creditText, 'Missing image rights evidence at entry ' + i);
}
const archive = read('data/fine-art-archive.json');
assert.ok(Array.isArray(archive.associatedMedia));
for (const [i, image] of archive.associatedMedia.entries()) {
  assert.equal(image.copyrightHolder?.['@id'], policy.copyrightHolder.personId,
    'Fine art archive creator/owner identity drift at entry ' + i);
}
console.log('Professional owner declaration and catalog copyright identity contract passed.');
