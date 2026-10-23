import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const pages=["fine-art/index.html","de-at/fine-art/index.html","hu/muveszi-fotografia/index.html"];
const expectedHero="/assets/img/fine-art/hero/fine-art-hero-960.webp";
let baseline=null;
for(const page of pages){
 const html=readFileSync(page,"utf8");
 const hero=html.match(/<img\b[^>]*fetchpriority="high"[^>]*>/i)?.[0]||"";
 assert.ok(hero.includes(expectedHero),page+": unexpected hero");
 assert.ok(existsSync(expectedHero.slice(1)),page+": missing hero asset");
 const section=html.match(/<section\b[^>]*class="[^"]*service-gallery-section[^"]*"[^>]*>[\s\S]*?<\/section>/i)?.[0]||"";
 assert.ok(section,page+": missing visible gallery section");
 const sources=[...section.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map(m=>m[1]);
 assert.ok(sources.length>=5,page+": gallery has fewer than five images");
 for(const src of sources)if(src.startsWith("/"))assert.ok(existsSync(src.slice(1)),page+": missing gallery image "+src);
 if(!baseline)baseline=sources;
 else assert.deepEqual(sources,baseline,page+": gallery image order differs across languages");
 console.log(page+": gallery "+sources.length+" images, same hero and parity");
}
