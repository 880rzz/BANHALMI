import assert from 'node:assert/strict';
import fs from 'node:fs';

const evidence = JSON.parse(fs.readFileSync('external-photography-evidence.json', 'utf8'));
const trust = JSON.parse(fs.readFileSync('service-trust-evidence.json', 'utf8'));
const press = JSON.parse(fs.readFileSync('press-institutional-evidence.json', 'utf8'));
const id = 'facebook-amaped-collegium-hungaricum-1956-20261022';
const pressId = 'amaped-collegium-hungaricum-1956-2026';
const url = 'https://www.facebook.com/permalink.php?story_fbid=pfbid0FqThBkyrTS3sxkhAYt3YxoiuzYEYPpRRGU2j22QmcxAVpYVJj6HkWbvrdfNtCQnhl&id=100076361554158';
const album = 'https://www.flickr.com/photos/vipach/albums/72177720336267626/';
const albumBare = album.replace(/\/$/, '');
const record = evidence.records.find((item) => item.id === id);
assert.ok(record, 'AMAPED event photo-credit record is missing');
assert.equal(record.url, url, 'AMAPED Facebook source URL drift');
assert.equal(record.publicationDate, '2026-10-22', 'Post date must remain the publication date');
assert.equal(record.evidenceStatus, 'owner-confirmed-screenshot-publication-credit');
assert.equal(record.screenshotEvidence?.fileName, 'amaped-collegium-hungaricum-1956-facebook-20261022.jpg');
assert.equal(record.screenshotEvidence?.directPublicReadback, false);
assert.match(record.creditContext, /Foto \(c\) Norbert Bánhalmi \/ BANHALMI Photography/);
assert.match(record.interpretationRule, /Do not infer a testimonial, endorsement, recommendation, client contract, ongoing relationship, partnership, exclusivity or official-photographer status/i);
assert.ok(trust.services.event.externalEvidenceIds.includes(id), 'AMAPED credit must be attached to event service evidence');

const flickrAlbum = evidence.flickrArchive.selectedEventAlbums.find((item) => item.url === albumBare);
assert.ok(flickrAlbum, 'AMAPED Flickr album missing from selectedEventAlbums');
assert.match(flickrAlbum.attributionStatus, /credited by AMAPED/);
assert.equal(flickrAlbum.independentPhotoCredit, url);

const pressRecord = press.evidence.find((item) => item.id === pressId);
assert.ok(pressRecord, 'AMAPED press/institutional evidence missing');
assert.equal(pressRecord.officialPost, url);
assert.equal(pressRecord.flickrAlbum, album);
assert.equal(pressRecord.eventDate, '2026-10-22');
assert.equal(pressRecord.photographer, 'Bánhalmi Norbert');
assert.match(pressRecord.guardrail, /do not establish commission.*client.*partnership.*endorsement/i);

const pages = [
  [
    'event-photography/index.html',
    'The screenshot of the AMAPED post dated 22 October 2026',
    'Foto (c) Norbert Bánhalmi / BANHALMI Photography',
    'joint 1956 commemorative programme at Collegium Hungaricum',
  ],
  [
    'hu/rendezvenyfotozas/index.html',
    '2026. október 22-i AMAPED-bejegyzés',
    'Foto (c) Norbert Bánhalmi / BANHALMI Photography',
    'Collegium Hungaricumban tartott közös 1956-os megemlékező programot',
  ],
  [
    'de-at/eventfotografie/index.html',
    'Screenshot des AMAPED-Beitrags vom 22. Oktober 2026',
    'Foto (c) Norbert Bánhalmi / BANHALMI Photography',
    'gemeinsames 1956er Gedenkprogramm im Collegium Hungaricum',
  ],
];
for (const [path, ...requiredText] of pages) {
  const html = fs.readFileSync(path, 'utf8');
  assert.ok(html.includes(url), path + ': source URL missing from visible block / ItemList');
  assert.ok(html.includes(album), path + ': Flickr album missing from visible block');
  for (const text of requiredText) assert.ok(html.includes(text), path + ': visible evidence text mismatch: ' + text);
  const section = html.match(/<section class="section-band service-evidence-ssr"[\s\S]*?<\/section>/)?.[0] || '';
  assert.ok(section.includes(url) && section.includes(album), path + ': AMAPED sources absent from published event references');
  assert.ok(!section.includes('<iframe'), path + ': third-party iframe must not be embedded');
  const marker = html.indexOf('data-banhalmi-event-proof="true"');
  assert.ok(marker >= 0, path + ': ItemList marker missing');
  const bodyStart = html.indexOf('>', marker) + 1;
  const bodyEnd = html.indexOf('</script>', bodyStart);
  assert.ok(bodyEnd > bodyStart, path + ': ItemList script is malformed');
  const itemList = JSON.parse(html.slice(bodyStart, bodyEnd));
  const fbItem = itemList.itemListElement.find((entry) => entry.url === url);
  const albumItem = itemList.itemListElement.find((entry) => entry.url === albumBare || entry.url === album);
  assert.ok(fbItem, path + ': ItemList Facebook source missing');
  assert.ok(albumItem, path + ': ItemList Flickr album missing');
  assert.equal(fbItem.position, 7, path + ': Facebook ItemList position drift');
  assert.equal(albumItem.position, 8, path + ': Flickr ItemList position drift');
}
console.log('AMAPED event photo-credit evidence audit passed: screenshot provenance, publication date, Flickr match, guardrails, service binding, 3-language visible copy and ItemList parity.');
