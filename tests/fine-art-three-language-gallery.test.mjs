import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const pages=["fine-art/index.html","de-at/fine-art/index.html","hu/muveszi-fotografia/index.html"];
const expectedHero="/assets/img/fine-art/hero/fine-art-hero-960.webp";
const expectedImageCount=46;
const expectedRestrictedCount=16;
let baseline=null;
let restrictedBaseline=null;
for(const page of pages){
 const html=readFileSync(page,"utf8");
 const hero=html.match(/<img\b[^>]*fetchpriority="high"[^>]*>/i)?.[0]||"";
 assert.ok(hero.includes(expectedHero),page+": unexpected hero");
 assert.ok(existsSync(expectedHero.slice(1)),page+": missing hero asset");
 const section=html.match(/<section\b[^>]*class="[^"]*service-gallery-section[^"]*"[^>]*>[\s\S]*?<\/section>/i)?.[0]||"";
 assert.ok(section,page+": missing visible gallery section");
 const sources=[...section.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map(m=>m[1]);
 assert.equal(sources.length,expectedImageCount,page+": gallery image count regression");
 const buttons=[...section.matchAll(/<button\b[^>]*\bdata-lightbox-src="([^"]+)"[^>]*>/gi)];
 assert.equal(buttons.length,expectedImageCount,page+": gallery/lightbox trigger count mismatch");
 const restricted=buttons.filter(m=>/data-age-restricted="true"/.test(m[0]));
 assert.equal(restricted.length,expectedRestrictedCount,page+": age-gated count regression");
 for(const m of buttons){
  const src=m[1];
  if(src.startsWith("/"))assert.ok(existsSync(src.slice(1)),page+": missing full-resolution gallery image "+src);
 }
 for(const m of restricted){
  const src=m[1];
  assert.ok(!src.includes("/age-preview/"),page+": age-gated lightbox points to preview rather than full image");
 }
 const previewSources=sources.filter(src=>src.includes("/age-preview/"));
 assert.equal(previewSources.length,expectedRestrictedCount,page+": restricted previews missing");
 if(!restrictedBaseline)restrictedBaseline=restricted.map(m=>m[1]);
 else assert.deepEqual(restricted.map(m=>m[1]),restrictedBaseline,page+": age-gated full-image order differs across languages");
 for(const src of sources)if(src.startsWith("/"))assert.ok(existsSync(src.slice(1)),page+": missing gallery image "+src);
 if(!baseline)baseline=sources;
 else assert.deepEqual(sources,baseline,page+": gallery image order differs across languages");
 console.log(page+": gallery "+sources.length+" images, "+restricted.length+" age-gated, hero and parity verified");
}

// Ensure gallery navigation and keyboard shortcuts cannot bypass the 18+ gate.
const lightboxScript=readFileSync("assets/js/main.js","utf8");
assert.match(lightboxScript,/function requestOpen\(index,trigger\)[\s\S]*?isRestricted\(items\[index\]\)&&!ageVerified[\s\S]*?showAgeDialog\(index,trigger\|\|items\[index\]\)/,"restricted image must be gated before opening");
assert.match(lightboxScript,/universal-lightbox-next[^\n]*requestOpen\(current\+1\)/,"next control must pass through age gate");
assert.match(lightboxScript,/universal-lightbox-prev[^\n]*requestOpen\(current-1\)/,"previous control must pass through age gate");
assert.match(lightboxScript,/e\.key===\x27ArrowRight\x27\)requestOpen\(current\+1\)/,"keyboard next must pass through age gate");
assert.match(lightboxScript,/e\.key===\x27ArrowLeft\x27\)requestOpen\(current-1\)/,"keyboard previous must pass through age gate");
console.log("18+ gate and gallery navigation source contracts verified");
