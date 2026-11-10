import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const evidence = JSON.parse(readFileSync("external-photography-evidence.json", "utf8"));
const ids = ["72177720336279769","72177720336267626","72177720336284361","72177720336290536","72177720336292582"];
const records = evidence.flickrArchive?.selectedEventAlbums ?? [];
assert.equal(records.length, 5, "exactly five structured Flickr evidence albums");
assert.deepEqual(records.map(record => record.url), ids.map(id => "https://www.flickr.com/photos/vipach/albums/" + id));
assert.equal(evidence.flickrArchive.url, "https://www.flickr.com/photos/vipach/albums");
for (const [index,record] of records.entries()) {
  if (index === 0) {
    assert.match(record.attributionStatus, /credited by the embassy/);
    assert.match(record.independentPhotoCredit, /facebook\.com\/HunEmbassy\.Becs\/posts\//);
  } else if (index === 1) {
    assert.match(record.attributionStatus, /credited by AMAPED/);
    assert.match(record.independentPhotoCredit, /story_fbid=pfbid0FqThBkyrTS3sxkhAYt3YxoiuzYEYPpRRGU2j22QmcxAVpYVJj6HkWbvrdfNtCQnhl/);
    assert.match(record.name, /70 Years of Remembrance/);
  } else assert.match(record.attributionStatus, /team-level/);
  assert.match(record.relationshipGuardrail, /endorsement/);
}
for (const path of ["event-photography/index.html","hu/rendezvenyfotozas/index.html","de-at/eventfotografie/index.html"]) {
  const html = readFileSync(path, "utf8");
  assert.doesNotMatch(html, /id="event-flickr-gallery"/);
  assert.doesNotMatch(html, /href="#event-flickr-gallery"/);
  assert.doesNotMatch(html, /external-proof-card/);
  assert.match(
    html,
    /data-service-hero-actions="stage22"><a class="btn btn-ghost" href="https:\/\/www\.flickr\.com\/photos\/vipach\/albums"/
  );
  assert.doesNotMatch(html, /data-service-hero-actions="stage22"[\s\S]*?href="#selected-work"/);
  assert.match(html, /href="https:\/\/www\.flickr\.com\/photos\/vipach\/albums"/);
  assert.ok(html.includes("/albums/" + ids[0]), path + " must link the embassy-credit album");
  assert.ok(html.includes("/albums/" + ids[1]), path + " must link the AMAPED-credit album");
  for (const id of ids.slice(2)) assert.ok(!html.includes("/albums/" + id), path + " must not expose unverified individual albums");
}
const llms = readFileSync("llms.txt", "utf8");
assert.match(llms, /flickrArchive\.selectedEventAlbums/);
const overlay = JSON.parse(readFileSync("llm-canonical-overlay.json", "utf8"));
assert.match(overlay.eventAlbumEvidenceRule, /five selected|Five selected/);
console.log("Flickr evidence, public UX, LLM routing: PASS");
