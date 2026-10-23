import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const ledger=JSON.parse(readFileSync(".github/internal-evidence/authority-evidence-audit-ledger-20261010.json","utf8"));
const routing=JSON.parse(readFileSync("data/evidence-routing-manifest.json","utf8"));
assert.equal(ledger.records.length,323);
assert.equal(ledger.rowCount,routing.sourceRowCount);
assert.deepEqual(ledger.rowCountByGroup,routing.sourceGroupCounts);
assert.equal(ledger.distinctNonemptySourceUrls,routing.sourceDistinctUrls);
for(const row of ledger.records){
 assert.ok(row.id && row.registryGroup && row.sourceRegistry,row.id);
 assert.ok(routing.canonicalRouting[row.registryGroup],row.id);
}
assert.ok(existsSync("post/amikor-csak-egy-táncpartnered-van-egész-estére/index.html"),"NFD legacy URL must survive");
assert.ok(existsSync("post/amikor-csak-egy-táncpartnered-van-egész-estére/index.html"),"NFC legacy URL must survive");
console.log("Legacy evidence and Unicode URL preservation: PASS");
