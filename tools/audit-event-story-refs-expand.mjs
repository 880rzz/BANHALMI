import assert from 'node:assert/strict';
import fs from 'node:fs';

const evidence = JSON.parse(fs.readFileSync('external-photography-evidence.json', 'utf8'));
const trust = JSON.parse(fs.readFileSync('service-trust-evidence.json', 'utf8'));
const id = 'facebook-hunembassy-freiheit-1956-report-20261028';
const report = 'https://www.facebook.com/HunEmbassy.Becs/posts/pfbid02Me9xLbZy2eBJiPVTFyicCavQJdYVvmvhtNV2uaekFZaQnPT326mUjfnxG514Dc3Hl';
const album = 'https://www.flickr.com/photos/vipach/albums/72177720336279769/';
const record = evidence.records.find((item) => item.id === id);
assert.ok(record, 'Embassy report evidence record missing');
assert.equal(record.url, report);
assert.equal(record.publicationDate, '2026-10-28');
assert.equal(record.eventDate, '2026-10-20');
assert.equal(record.screenshotEvidence?.fileName, 'hunembassy-freiheit-1956-report-20261028.jpg');
assert.match(record.creditContext, /📷: Bánhalmi Norbert/);
assert.ok(trust.services.event.externalEvidenceIds.includes(id));

const pages = [
  'event-photography/index.html',
  'hu/rendezvenyfotozas/index.html',
  'de-at/eventfotografie/index.html',
];
for (const path of pages) {
  const html = fs.readFileSync(path, 'utf8');
  for (const marker of [
    'data-event-evidence="hunembassy-freiheit-1956-report"',
    'data-event-evidence="us-embassy-destination-usa"',
    'data-event-evidence="honvedelem-tekerj-a-sereggel"',
    report,
    album,
    'https://www.linkedin.com/posts/us-embassy-vienna_thank-you-to-everyone-who-joined-activity-7422226435219607553-sk0f',
    'https://www.flickr.com/photos/vipach/albums/72177720331699246/',
    'https://honvedelem.hu/hirek/ismet-tekert-a-sereg.html',
    'https://www.flickr.com/photos/vipach/albums/72177720334092675/',
  ]) {
    assert.ok(html.includes(marker), path + ' missing ' + marker);
  }
  assert.ok(!html.includes('<iframe src="https://www.facebook.com/plugins/post.php'), path + ' must not embed Facebook iframe');
}
console.log('Event story refs expand audit passed: embassy report, U.S. Embassy Destination USA, Hungarian Defence Forces cycling tour.');
