import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";

const baseline=JSON.parse(readFileSync("data/banhalmi-c-url-image-parity.json","utf8"));
assert.equal(baseline.htmlPaths.length,100);
assert.equal(Object.keys(baseline.imageBlobs).length,595);
const originalGitBlobSha=content => createHash("sha1").update(Buffer.from("blob "+content.length))
 .update(Buffer.from([0])).update(content).digest("hex");

// October 2026 BANHALMI-C evidence hashes describe the ORIGINAL compressed
// pixel files. The 19 first-party service hero WebPs now wrap the very same
// compressed VP8 chunk in a VP8X container with *only* rights XMP. Reconstruct
// and hash the original RIFF from that VP8 chunk to prove the exact historical
// pixels are preserved. The immutable Pages packaging still compares full
// source/deployed bytes without exceptions.
const LICENSE="https://www.banhalmiphotography.com/terms-conditions/";
const CREATOR="Bánhalmi Norbert";
function recoverOriginalWebP(content, path) {
 assert.match(path, /^assets\/img\/(portraits|brand|events|fine-art)\/hero\/[A-Za-z0-9._-]+\.webp$/,
  "Non-hero historical bytes must remain unchanged");
 assert.equal(content.toString("ascii",0,4),"RIFF");
 assert.equal(content.toString("ascii",8,12),"WEBP");
 assert.equal(content.readUInt32LE(4),content.length-8);
 const parts=[];
 for(let p=12;p+8<=content.length;){
  const type=content.toString("ascii",p,p+4);
  const bytes=content.readUInt32LE(p+4), end=p+8+bytes+(bytes&1);
  assert.ok(end<=content.length, path+": damaged RIFF chunk");
  parts.push({type,bytes,p,end});
  p=end;
 }
 assert.deepEqual(parts.map(x=>x.type), ["VP8X","VP8 ","XMP "],
  path+": only VP8X+original pixel VP8+owner XMP are allowed");
 assert.equal(parts[0].bytes,10);
 assert.ok(content[parts[0].p+8]&0x04,path+": XMP feature flag not set");
 const packet=content.toString("utf8",parts[2].p+8,parts[2].p+8+parts[2].bytes);
 assert.ok(packet.includes("<xmpRights:WebStatement>"+LICENSE+"</xmpRights:WebStatement>"),
  path+": licensing source must be exact");
 assert.ok(packet.includes("<rdf:li>"+CREATOR+"</rdf:li>"),
  path+": owner credit missing");
 assert.ok(packet.includes("<photoshop:Credit>"),
  path+": photographer credit missing");
 // Rebuild the historical RIFF exactly: an unextended WebP with ONE VP8 chunk.
 const vp8=content.subarray(parts[1].p,parts[1].end);
 const original=Buffer.alloc(12+vp8.length);
 original.write("RIFF",0,"ascii");
 original.writeUInt32LE(original.length-8,4);
 original.write("WEBP",8,"ascii");
 vp8.copy(original,12);
 return original;
}
for(const path of baseline.htmlPaths)
 assert.ok(existsSync(path),"Historical URL missing: "+path);
let rightsOnlyWrappers=0;
for(const [path,expected] of Object.entries(baseline.imageBlobs)){
 assert.ok(existsSync(path),"Historical image missing: "+path);
 const content=readFileSync(path);
 let actual=originalGitBlobSha(content);
 if(actual!==expected){
  // This is NOT a baseline update. A reconstructed exact historical SHA-1
  // mismatch fails CI, protecting every compressed pixel byte from edits.
  const original=recoverOriginalWebP(content,path);
  actual=originalGitBlobSha(original);
  rightsOnlyWrappers++;
 }
 assert.equal(actual,expected,"Historical image pixels changed: "+path);
}
assert.equal(rightsOnlyWrappers,19,"Expected exactly 19 licensed hero wrappers, no other historical image drift");
console.log("BANHALMI-C historical 100 routes / 595 original image pixels preserved; 19 rights-only WebP wrappers: PASS");
