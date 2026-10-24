import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest=JSON.parse(fs.readFileSync('tools/content/professional-journeys-20261018.json','utf8'));
for(const [locale,data] of Object.entries(manifest.locales)){
 const html=fs.readFileSync(data.home,'utf8');
 const section=html.match(/<section\b[^>]*\bid="services"[^>]*>[\s\S]*?<\/section>/i)?.[0]||'';
 assert.ok(section,locale+': missing four-service decision section');
 const links=[...section.matchAll(/<a\b[^>]*class="card reveal"[^>]*href="([^"]+)"[^>]*>/gi)].map(m=>m[1]);
 assert.equal(links.length,4,locale+': exactly four primary service cards');
 for(const service of data.services)assert.ok(links.includes(service.url.split('#')[0]),locale+': missing primary service '+service.id+' '+service.url);
 assert.equal(new Set(links).size,4,locale+': duplicate primary service destination');
 const hero=html.match(/<section class="hero hero-copy-only\b[\s\S]*?<\/section>/)?.[0]||'';
 assert.ok(hero,locale+': hero missing');
 assert.ok(html.includes('href="'+data.mainEnquiry+'"'),locale+': enquiry link missing');
 const [pageRoute,anchor]=data.mainEnquiry.split('#');
 assert.ok(fs.readFileSync(pageRoute.slice(1)+'index.html','utf8').includes('id="'+anchor+'"'),locale+': enquiry anchor missing');
}
console.log('Professional journeys: four primary service cards and enquiry links verified in HU/EN/DE.');
