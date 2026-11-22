import assert from 'node:assert/strict';
import fs from 'node:fs';
const routes=["portrait/index.html","hu/portre/index.html","de-at/portrait/index.html","lifestyle/index.html","hu/brand/index.html","de-at/brand/index.html","fine-art/index.html","hu/muveszi-fotografia/index.html","de-at/fine-art/index.html","event-photography/index.html","hu/rendezvenyfotozas/index.html","de-at/eventfotografie/index.html"];
for(const rel of routes){
 const html=fs.readFileSync(rel,'utf8');
 const valid=new Set();
 for(const s of html.matchAll(/<script\\b[^>]*type=["']application\\/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>/gi)){
  const walk=v=>{if(Array.isArray(v))return v.forEach(walk);if(v&&typeof v==='object'){if((v['@type']==='ImageObject'||Array.isArray(v['@type'])&&v['@type'].includes('ImageObject'))&&v.license&&v.contentUrl)valid.add(v.contentUrl.replace('https://www.banhalmiphotography.com',''));for(const [k,x] of Object.entries(v))if(k!=='@context')walk(x)}};
  try{walk(JSON.parse(s[1]))}catch{}
 }
 let matched=0;
 for(const m of html.matchAll(/<img\\b[^>]*>/g)){
  const tag=m[0];const src=tag.match(/\\bsrc="([^"]+)"/)?.[1]||'';const srcset=tag.match(/\\bsrcset="([^"]+)"/)?.[1]||'';
  if(!srcset||!src.startsWith('/assets/img/'))continue;
  if(src.endsWith('-480w.webp')){
   const ori=src.replace(/-480w\\.webp$/,'.webp');
   assert.ok(!valid.has(ori),rel+': licensed original must be src fallback instead of -480w variant '+src);
  }
  if(valid.has(src)&&srcset.includes(src+' '))matched++;
 }
 assert.ok(matched>=3,rel+': source/schema/srcset parity lost');
}
console.log('Professional 12/12 licensed canonical image fallback / responsive srcset source parity PASS');
