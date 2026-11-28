import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../',import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const json = name => JSON.parse(read(name));
const { owners } = json('service-owner-routing.json');
const api = json('api/v1/services.json');
const registry = json('docs/search-intent-registry.json');
const base = 'https://www.banhalmiphotography.com';
const people = base+'/#organization';
const locales = { en: 'en', de: 'de-AT', hu: 'hu-HU' };
const cities = { vienna: { en: 'Vienna', de: 'Wien', hu: 'Bécs' }, budapest: { en: 'Budapest', de: 'Budapest', hu: 'Budapest' } };
const sitemap=read('sitemap.xml');
assert.equal(api.canonicalServiceOwnerSource, base+'/service-owner-routing.json');
assert.equal(owners.length,4);
assert.equal(Object.keys(api.canonicalServiceOwners).length,4);
assert.equal(registry.records.length,24);
assert.equal(new Set(registry.records.map(x=>x.intentId)).size,24);
const articles = ['llms.txt','ai.txt'].map(read).map(x => x.split('## Canonical service routing by language\n')[1].split('\n\n')[0]);
for (const service of owners) {
  for (const [code, locale] of Object.entries(locales)) {
    const route = service.routes[code];
    const url = base+route;
    assert.equal(api.canonicalServiceOwners[service.service][locale],url);
    for (const s of articles) assert.ok(s.includes(locale+' '+url+' '));
    const html=read(route.slice(1)+'index.html');
    const main=html.match(/<main\b[^>]*>([\s\S]+?)<\/main>/i)?.[1]||'';
    const text=main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ');
    const parts=[...html.matchAll(/<link\b[^>]*>/gi)].map(([tag])=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]])));
    const alternatives=Object.fromEntries(parts.filter(x=>x.hreflang).map(x=>[x.hreflang,x.href]));
    assert.deepEqual(parts.filter(x=>x.rel==='canonical').map(x=>x.href),[url]);
    assert.deepEqual(alternatives,{en:base+service.routes.en,'de-AT':base+service.routes.de,'hu-HU':base+service.routes.hu,'x-default':base+service.routes.en});
    assert.ok(sitemap.includes('<loc>'+url+'</loc>'));
    assert.doesNotMatch(html, /<meta[^>]+name="(?:googlebot|robots)"[^>]+content="[^"]*noindex/i);
    const nodes=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(x=>{const v=JSON.parse(x[1]);return v['@graph']||[v];});
    const svc=nodes.filter(o=>o['@type']==='Service'&&o['@id']===url+'#service');
    assert.equal(svc.length,1);
    assert.equal(svc[0].provider?.['@id'],people);
    for (const [market, labels] of Object.entries(cities)) {
      const id=(service.service==='fine-art'?'artists':service.service)+'.'+market+'.'+locale;
      const rec=registry.records.find(x=>x.intentId===id);
      assert.equal(rec?.primaryLandingPage,url);
      assert.equal(rec.city,labels[code]); assert.equal(rec.locale,locale); assert.equal(rec.desiredRankingUrl,url);
      assert.ok(text.toLowerCase().includes(labels[code].toLowerCase()),id+': visible city');
      const schemaArea=JSON.stringify(svc[0].areaServed).toLowerCase();
      assert.ok(market==='budapest'?schemaArea.includes('budapest'):/vienna|wien|bécs/.test(schemaArea),id+': schema city');
      const cta=new URL(rec.cta);
      assert.equal(cta.origin,base);
      assert.ok(fs.existsSync(fileURLToPath(new URL(cta.pathname.slice(1)+'index.html',root))),id+': CTA route');
      assert.ok(main.includes(rec.cta.slice(base.length).replaceAll('&','&amp;')),id+': visible CTA');
      assert.equal(rec.intentType,'commercial_service');
      assert.ok(rec.searchTermsAndSynonyms.length && rec.customerProblem && rec.verifiedReferences.length);
      if(rec.gsc.impressions===null) assert.equal(rec.gsc.status,'no_disclosed_classifiable_rows');
      else assert.ok(rec.gsc.matchingImpressions<=rec.gsc.impressions);
    }
  }
}
assert.doesNotMatch(articles.join('\n'),/\/fine-art\/ route is legacy/i);
console.log('PASS: 24/24 offline intent-location-language routes, live-compatible SEO contracts and supported CTA targets; no external AI result implied.');
