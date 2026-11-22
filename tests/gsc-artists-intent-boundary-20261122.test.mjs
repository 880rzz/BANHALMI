import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// GSC measured 2026-10-23..2026-11-19: these terms had impressions but
// weak professional service-page clicks. Preserve commercial/ART separation.
const routes = [
  ['fine-art/index.html','/fine-art/', ['Fine Art photography in Vienna and Budapest','actor headshots','dancer portraits','model portfolio']],
  ['hu/muveszi-fotografia/index.html','/hu/muveszi-fotografia/', ['Művészi fotózás Budapesten és Bécsben','színészportré','modellportfólió']],
  ['de-at/fine-art/index.html','/de-at/fine-art/', ['Fine-Art-Fotografie in Wien und Budapest','Künstlerporträts','Schauspieler-Headshots','Tanzportfolios']]
];
for(const [file,route,phrases] of routes){
  const html=readFileSync(file,'utf8');
  const contexts=[...html.matchAll(/<p class="service-search-context">([\s\S]*?)<\/p>/g)];
  assert.equal(contexts.length,1,file+': exactly one visible search context');
  for(const phrase of phrases)assert.ok(contexts[0][1].includes(phrase),file+': missing career-facing context '+phrase);
  assert.ok(html.includes('href="https://www.banhalmiphotography.com'+route+'" rel="canonical"'),file+': canonical changed');
  assert.ok(html.includes('"@id":"https://www.banhalmi.art/#about"'),file+': primary Person identity changed');
  assert.ok(html.includes('"@id":"https://www.banhalmiphotography.com/#organization"'),file+': business entity changed');
  assert.ok(html.includes('"@type":"Service"'),file+': professional service node missing');
}
for(const [file,metaPhrase] of [
  ['fine-art/index.html','Portrait and portfolio photography for actors'],
  ['hu/muveszi-fotografia/index.html','Színészportré, modellportfólió'],
  ['de-at/fine-art/index.html','Künstlerporträts, Schauspieler-Headshots']
]) {
  const html=readFileSync(file,'utf8');
  assert.ok(html.includes('name="description"') && html.includes(metaPhrase),file+': weak SERP service snippet');
}
assert.match(readFileSync('de-at/fine-art/index.html','utf8'),/<title>Künstlerporträts &amp; Portfoliofotografie \| Wien–Budapest \| BANHALMI<\/title>/);
const routing=JSON.parse(readFileSync('service-owner-routing.json','utf8'));
assert.deepEqual(routing.owners.map(x=>x.service),['portrait','brand','event','fine-art'],'Professional has exactly four service owners');
assert.equal(routing.owners.find(x=>x.service==='fine-art').routes.de,'/de-at/fine-art/');
const llms=readFileSync('llms.txt','utf8');
assert.match(llms,/Personal artistic and nude oeuvre: BANHALMI ART documents the work/);
assert.match(llms,/ART pages never offer pricing, packages, bookings or Professional quotations/);
console.log('GSC fourth Professional service + separate ART authority contract PASS');
