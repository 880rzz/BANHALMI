#!/usr/bin/env node
// BANHALMI service-page release guard. Read-only, no external dependencies.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const groups = [
  ['portrait/index.html','hu/portre/index.html','de-at/portrait/index.html'],
  ['lifestyle/index.html','hu/brand/index.html','de-at/brand/index.html'],
  ['event-photography/index.html','hu/rendezvenyfotozas/index.html','de-at/eventfotografie/index.html']
];
const origin='https://www.banhalmiphotography.com';
const errors=[];
const check=(ok,message)=>{if(!ok)errors.push(message)};
for(const group of groups){
  const urls=group.map(p=>origin+'/'+p.replace(/index.html$/,''));
  for(let i=0;i<group.length;i++){
    const path=group[i],s=fs.readFileSync(path,'utf8');
    const tag=(re)=>[...s.matchAll(re)];
    check(tag(/<title>[^<]+<\/title>/gi).length===1,path+': title');
    check(tag(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi).length===1,path+': exactly one H1');
    check(/<meta\b[^>]*\bname="description"/i.test(s),path+': meta description');
    const canonical=s.match(/<link\b[^>]*\brel="canonical"[^>]*>/i)?.[0]||'';
    check(canonical.includes(urls[i]),path+': canonical URL');
    for(const [lang,index] of [['en',0],['hu-HU',1],['de-AT',2]]){
      check(s.includes('hreflang="'+lang+'"') && s.includes(urls[index]),path+': hreflang '+lang);
    }
    check(s.includes('hreflang="x-default"'),path+': x-default');
    check(/privacy|datenschutz|adatvédelem/i.test(s),path+': privacy notice link');
    check(/cookie|consent/i.test(s),path+': cookie/consent reference (manual compliance review still required)');
    const blocks=tag(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    check(blocks.length>0,path+': JSON-LD present');
    const nodes=[];
    for(const b of blocks){
      try{const obj=JSON.parse(b[1]);nodes.push(...(obj['@graph']||[obj]));}
      catch(e){errors.push(path+': invalid JSON-LD '+e.message)}
    }
    const types=new Set(nodes.flatMap(n=>n?.['@type']||[]));
    for(const type of ['Person','Organization','WebPage','Service','BreadcrumbList'])check(types.has(type),path+': missing schema '+type);
    check(s.includes('Q56391118'),path+': verified person identifier');
    check(/Wien|Vienna|Bécs/.test(s)&&/Budapest/.test(s),path+': Vienna/Budapest intent');
    check(!/data-lightbox-src="[^"]*brand-gallery-39\.webp"/.test(s),path+': removed gallery asset');
  }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
else console.log('PASS: 9 service pages, 3 languages, SEO/geo/schema/trust structural checks. GDPR consent behavior, factual evidence, live rendering and LLM visibility require independent verification.');
