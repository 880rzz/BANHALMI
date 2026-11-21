import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Evidence-limited internal-link test, not a claim of Google or AI ranking gains.
// GSC 2026-10-22..2026-11-18: target commercial queries were shown on
// homepages. This preserves owners while clarifying anchor phrases.
const sites = [
  { path: 'index.html', labels: [
    ['/portrait/', 'Executive Portrait'],
    ['/lifestyle/', 'Brand Photography'],
    ['/event-photography/', 'Event Photography'],
    ['/fine-art/', 'Artists']
  ]},
  { path: 'hu/index.html', labels: [
    ['/hu/portre/', 'Üzleti portré'],
    ['/hu/brand/', 'Brandfotózás'],
    ['/hu/rendezvenyfotozas/', 'Rendezvényfotózás'],
    ['/hu/muveszi-fotografia/', 'Művészek']
  ]},
  { path: 'de-at/index.html', labels: [
    ['/de-at/portrait/', 'Businessporträt'],
    ['/de-at/brand/', 'Brandfotografie'],
    ['/de-at/eventfotografie/', 'Eventfotografie'],
    ['/de-at/fine-art/', 'Kunst']
  ]}
];
const protectedTitles = {
  'index.html':'BANHALMI | Portrait & brand photography | Vienna–Budapest',
  'hu/index.html':'BANHALMI | Portréfotózás és brandfotózás | Bécs–Budapest',
  'de-at/index.html':'BANHALMI | Porträt- & Brandfotografie | Wien–Budapest'
};
for(const site of sites) {
  const html=readFileSync(site.path,'utf8');
  const block=html.match(/<p class="eyebrow" data-service-owner-links="20261015">([\s\S]*?)<\/p>/)?.[1];
  assert.ok(block,site.path+': early service links missing');
  const links=[...block.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)];
  assert.equal(links.length,4,site.path+': must preserve four accessible service owners');
  assert.deepEqual(links.map(m=>[m[1],m[2]]),site.labels,site.path+': wrong localized semantic owner');
  assert.ok(block.replace(/<[^>]+>/g,'').length<=100,site.path+': desktop eyebrow too long');
  assert.match(html,/<h1\b[^>]*>[\s\S]*?<\/h1>/i,site.path+': hero missing');
  assert.ok(html.includes('<title>'+protectedTitles[site.path]+'</title>'),site.path+': protected title changed');
  assert.ok(html.includes('rel="canonical"'),site.path+': canonical missing');
  for(const [url] of site.labels) {
    const target=readFileSync('.'+url+'index.html','utf8');
    assert.ok(target.includes('https://www.banhalmiphotography.com'+url),url+': target canonical source missing');
  }
}
console.log('Search-intent link anchor parity PASS: 12 localized owners, unchanged protected homepage titles.');
