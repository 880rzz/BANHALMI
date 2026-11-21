import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ART_PERSON = 'https://www.banhalmi.art/#about';
const BUSINESS_ABOUT = 'https://www.banhalmiphotography.com/about/';
const BUSINESS_ORG = 'https://www.banhalmiphotography.com/#organization';
const WIKIDATA = 'https://www.wikidata.org/wiki/Q56391118';

const entity = JSON.parse(fs.readFileSync('entity-identity-contract.json','utf8'));
assert.equal(entity.canonicalPerson['@id'], ART_PERSON);
assert.equal(entity.canonicalOrganization['@id'], BUSINESS_ORG);
assert.equal(JSON.parse(fs.readFileSync('data/machine-core.json','utf8')).person.id, ART_PERSON);
const authority = JSON.parse(fs.readFileSync('person-authority.jsonld','utf8'))['@graph'];
const person = authority.find(node=>node['@type']==='Person' && /Bánhalmi|Banhalmi/.test(node.name||''));
assert.equal(person?.['@id'], ART_PERSON);
assert.ok(person?.sameAs?.includes(WIKIDATA));
assert.ok(authority.some(node=>node['@type']==='Organization' && node['@id']===BUSINESS_ORG));

// The professional /about URL remains a real canonical business-facing
// WebPage; it is no longer the cross-site Person identifier.
const about = fs.readFileSync('about/index.html','utf8');
assert.match(about, /<link\b[^>]+href="https:\/\/www\.banhalmiphotography\.com\/about\/"[^>]+rel="canonical"/);
// Business About remains its own ProfilePage, not an ART-hosted page.
// Only mainEntity changes ownership to the shared ART Person node.
const profileBlocks=[...about.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map(m=>JSON.parse(m[1]));
const businessProfile=profileBlocks.flatMap(j=>j['@graph']||[j]).find(j=>j['@type']==='ProfilePage');
assert.equal(businessProfile?.url,BUSINESS_ABOUT,'business profile url must match business canonical');
assert.equal(businessProfile?.['@id'],BUSINESS_ABOUT+'#webpage','business ProfilePage id must stay local');
assert.equal(businessProfile?.primaryImageOfPage?.['@id'],BUSINESS_ABOUT+'#primaryimage');
assert.equal(businessProfile?.mainEntity?.['@id'],ART_PERSON,'profile page describes the shared ART Person');

const files = [];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name.startsWith('.')||['node_modules','tests','docs','tools','assets','.github'].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.isFile()&&entry.name==='index.html')files.push(full);
  }
}
walk('.');
let count=0;
for(const file of files) {
  const html=fs.readFileSync(file,'utf8');
  for(const block of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    const graph=JSON.parse(block[1])['@graph']||[];
    for(const node of graph){
      const types=Array.isArray(node['@type'])?node['@type']:[node['@type']];
      if(types.includes('Person') && /Bánhalmi|Banhalmi/i.test(node.name||'')){
        assert.equal(node['@id'],ART_PERSON,file+': business must reference the ART-owned Person node');
        assert.notEqual(node.url,BUSINESS_ABOUT,file+': Person URL should be artistic profile');
        assert.ok((node.sameAs||[]).includes(WIKIDATA),file+': preserve the same human Wikidata identity');
        count++;
      }
    }
  }
}
assert.ok(count>=24,'Expected founder Person definitions across multilingual Professional pages');
console.log('Professional ART-owned founder Person schema PASS: '+count+' Person definitions and separate business WebPage/Organization boundaries');
