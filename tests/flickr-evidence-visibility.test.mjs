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
  } else assert.match(record.attributionStatus, /team-level/);
  assert.match(record.relationshipGuardrail, /endorsement/);
}
for (const path of ["event-photography/index.html","hu/rendezvenyfotozas/index.html","de-at/eventfotografie/index.html"]) {
  const html = readFileSync(path, "utf8");
  assert.match(html, /href="#event-flickr-gallery"/);
  assert.match(html, /id="event-flickr-gallery"/);
  assert.match(html, /href="https:\/\/www\.flickr\.com\/photos\/vipach\/albums"/);
  assert.ok(html.includes("/albums/" + ids[0]),path + " must link the embassy-credit album");
  for (const id of ids.slice(1)) assert.ok(!html.includes("/albums/" + id), path + " must not expose unverified individual albums");
}
const llms = readFileSync("llms.txt", "utf8");
assert.match(llms, /flickrArchive\.selectedEventAlbums/);
const overlay = JSON.parse(readFileSync("llm-canonical-overlay.json", "utf8"));
assert.match(overlay.eventAlbumEvidenceRule, /five selected|Five selected/);
console.log("Flickr evidence, public UX, LLM routing: PASS");
