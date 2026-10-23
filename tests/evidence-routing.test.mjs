import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const m=JSON.parse(readFileSync("data/evidence-routing-manifest.json","utf8"));
assert.equal(m.sourceRowCount,323);
assert.equal(m.sourceDistinctUrls,233);
assert.equal(Object.values(m.sourceGroupCounts).reduce((a,b)=>a+b,0),323);
assert.equal(Object.keys(m.canonicalRouting).length,8);
for(const [group,rule] of Object.entries(m.canonicalRouting)){
 assert.ok(rule.registry && rule.site && rule.schema,group);
 assert.equal(rule.site.includes("banhalmi.art"),group.startsWith("art"),group);
}
assert.equal(m.sourceRegistries.length,6);
const a=JSON.parse(readFileSync("ai-entry.json","utf8"));
const l=JSON.parse(readFileSync("llm-canonical-overlay.json","utf8"));
assert.match(a.reference.legacyEvidenceRouting,/evidence-routing-manifest/);
assert.match(l.protectedReferences.legacyEvidenceRouting,/evidence-routing-manifest/);
console.log("Evidence routing contracts: PASS");
