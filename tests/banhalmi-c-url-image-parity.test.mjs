import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
const baseline=JSON.parse(readFileSync("data/banhalmi-c-url-image-parity.json","utf8"));
assert.equal(baseline.htmlPaths.length,100);
assert.equal(Object.keys(baseline.imageBlobs).length,595);
for(const path of baseline.htmlPaths)assert.ok(existsSync(path),"Historical URL missing: "+path);
for(const [path,expected] of Object.entries(baseline.imageBlobs)){
 assert.ok(existsSync(path),"Historical image missing: "+path);
 const content=readFileSync(path);
 const actual=createHash("sha1").update(Buffer.from("blob "+content.length)).update(Buffer.from([0])).update(content).digest("hex");
 assert.equal(actual,expected,"Historical image changed: "+path);
}
console.log("BANHALMI-C historical 100 routes and 595 original images: PASS");
