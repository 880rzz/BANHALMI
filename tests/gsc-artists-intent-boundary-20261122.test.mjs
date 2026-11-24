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
// A custom creative brief and a career portfolio share the existing fourth
// canonical, but an enquiry for logos/crops may not route to the career calculator.
const customCases = [
  ['fine-art/index.html','index.html','lifestyle/index.html','en','/fine-art/','/contact/#contact-form','headline or logo','The published portfolio packages'],
  ['hu/muveszi-fotografia/index.html','hu/index.html','hu/brand/index.html','hu','/hu/muveszi-fotografia/','/hu/kapcsolat/#kapcsolatfelveteli-urlap','címsornak vagy a logónak','Az alábbi árak és az árkalkulátor'],
  ['de-at/fine-art/index.html','de-at/index.html','de-at/brand/index.html','de-AT','/de-at/fine-art/','/de-at/kontakt/#kontaktformular','Überschrift oder ein Logo','Die unten genannten Preise und der Kalkulator']
];
const host='https://www.banhalmiphotography.com';
const structured=JSON.parse(readFileSync('services.json','utf8')).itemListElement.find(e=>e.position===4).artDirectedConcept;
const api=JSON.parse(readFileSync('api/v1/services.json','utf8')).artDirectedConcept;
const core=JSON.parse(readFileSync('data/machine-core.json','utf8')).serviceModel.services.find(e=>e.id==='fine-art').artDirectedConcept;
assert.deepEqual(api,structured);
assert.deepEqual(core,structured);
for(const [file,home,brand,lg,route,contact,space,priceScope] of customCases){
  const html=readFileSync(file,'utf8');
  const concept=html.match(/<section[^>]*id="art-directed-concept"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(concept,file+': bespoke concept is missing');
  assert.ok(concept.includes(space)&&concept.includes(priceScope),file+': practical design/price boundary absent');
  assert.ok(concept.includes('href="'+contact+'"')&&concept.includes('href="#selected-artistic-work"'),file+': two options cannot be selected');
  assert.ok(!/art_type=|quote-calculator|banhalmi\.art|(?:€|\bFt\b)/.test(concept.replace(priceScope,'')),file+': custom quote mis-routed or fixed fee invented');
  assert.equal((html.match(/id="selected-artistic-work"/g)||[]).length,1,file+': accessible portfolio anchor missing or duplicated');
  const price=html.match(/<details[^>]+data-pricing-disclosure="service"[^>]*>[\s\S]*?<\/details>/)?.[0];
  assert.ok(price?.includes('art_type=performer#quote-calculator')&&/690/.test(price),file+': portfolio price or calculator regressed');
  assert.ok(readFileSync(home,'utf8').includes('class="card reveal" href="'+route+'"'),home+': canonical fourth card lost');
  assert.ok(readFileSync(brand,'utf8').includes('href="'+route+'#art-directed-concept"'),brand+': custom brief cross-link lost');
  assert.equal(structured.routes[lg],host+route+'#art-directed-concept');
  assert.equal(structured.enquiryRoutes[lg],host+contact);
}
console.log('GSC fourth Professional service + separate ART authority contract PASS');
