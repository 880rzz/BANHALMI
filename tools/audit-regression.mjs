import fs from 'node:fs';
import path from 'node:path';

const fail=[];
const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
function assert(ok,msg){ if(!ok) fail.push(msg); }
function htmlFiles(dir='.'){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules'].includes(e.name)) continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory()) out.push(...htmlFiles(p));
    else if(e.name.endsWith('.html')) out.push(p.replace(/\\/g,'/'));
  }
  return out;
}
function links(html){ return [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({href:m[1],text:m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()})); }
const forbiddenPortraitSplitRoutes=['/headshot/','/headshots/','/executive-portrait/','/executive-portraits/','/c-level-business-photography/','/c-level-business/','/business-photography/','/visual-positioning/','/personal-visual-positioning/','/lifestyle-portrait/','/hu/headshot/','/hu/executive-portre/','/hu/c-level-uzleti-fotozas/','/hu/vizualis-pozicionalas/','/hu/lifestyle-portre/','/de-at/headshot/','/de-at/headshots/','/de-at/executive-portraet/','/de-at/c-level-businessfotografie/','/de-at/visuelle-positionierung/','/de-at/lifestyle-portraet/'];
const serviceMap={
  'index.html':['/portrait/','/lifestyle/','/event-photography/','/glamour/'],
  'hu/index.html':['/hu/portre/','/hu/brand/','/hu/rendezvenyfotozas/','/hu/muveszi-fotografia/'],
  'de-at/index.html':['/de-at/portrait/','/de-at/brand/','/de-at/eventfotografie/','/de-at/fine-art/']
};
for(const [file,expected] of Object.entries(serviceMap)){
  const h=read(file);
  assert(h.includes('nav-submenu'), `${file}: Services dropdown is required`);
  const serviceSection=(h.match(/<section id="services">[\s\S]*?<\/section>/)||[''])[0];
  const cardLinks=links(serviceSection).map(l=>l.href);
  assert(cardLinks.length===4, `${file}: home service section must expose exactly 4 cards, found ${cardLinks.length}`);
  for(const href of expected) assert(cardLinks.includes(href), `${file}: missing four-service card link ${href}`);
}
assert(read('index.html').includes('Professional, executive, C-level and lifestyle portraits, from precise headshots to strategic personal visual positioning.'), 'English portrait card must include consolidated portrait range');
assert(read('hu/index.html').includes('Professzionális, executive, C-level és lifestyle portrék a pontos headshottól a személyes vizuális pozicionálásig.'), 'Hungarian portrait card must include consolidated portrait range');
assert(read('de-at/index.html').includes('Professionelle, Executive-, C-Level- und Lifestyle-Porträts'), 'German portrait card must include consolidated portrait range');
for(const p of ['gallery/index.html','hu/gallery/index.html','de-at/gallery/index.html','de/portrait/index.html','de/brand/index.html','de/eventfotografie/index.html','de/fine-art/index.html','de-at/glamour/index.html','mybest/index.html','de-at/mybest/index.html']) assert(!exists(p), `${p}: deleted redundant page still exists`);
const routeText=htmlFiles().map(p=>read(p)).join('\n')+'\n'+['sitemap.xml','llms.txt','llms-full.txt','services.json'].filter(exists).map(read).join('\n');
for(const route of ['/de/portrait/','/de/brand/','/de/eventfotografie/','/de/fine-art/','/de-at/glamour/','/mybest/','/de-at/mybest/']) assert(!new RegExp(`(href="|https://www\.norbertbanhalmi\.com)${route.replaceAll('/','\/')}`).test(routeText), `redundant route reference remains: ${route}`);
for(const route of forbiddenPortraitSplitRoutes){
  const file=route.slice(1)+'index.html';
  assert(!exists(file), `${file}: portrait subservice route must not exist as standalone page`);
  assert(!new RegExp(`(href=\"|https://www\\.norbertbanhalmi\\.com)${route.replaceAll('/','\\/')}`).test(routeText), `portrait subservice route reference remains: ${route}`);
}


for(const p of ['assets/img/brand/teszt','assets/img/brand/gallery/tesz','assets/img/fine-art/t','assets/img/portraits/te','assets/img/portraits/service-gallery/tes']) assert(!exists(p), `${p}: temporary one-byte asset must not remain`);
for(const p of ['AUDIT-18plus-image-only-full-site-2026-07-15.md','AUDIT-QUOTE-SYSTEM-2026-07-16.md','AUDIT-clean-motion-2026-07-15.md','AUDIT-entity-harmonization-2026-07-14.md','AUDIT-event-team-positioning-2026-07-15.md','AUDIT-gsc-image-profile-fixes-2026-07-15.md','AUDIT-image-license-metadata-2026-07-15.md','AUDIT-schema-cleanup.md','AUDIT-seo-service-coverage-2026-07-15.md','AUDIT-seo-six-services-viko-2026-07-15.md']) assert(!exists(p), `${p}: obsolete root audit report must not remain in production root`);

const services=JSON.parse(read('services.json'));
assert(services.numberOfItems===4, 'services.json must declare four principal services');
assert(Array.isArray(services.itemListElement)&&services.itemListElement.length===4, 'services.json must contain exactly four Service nodes');
for(const name of ['Portrait Photography','Brand Photography','C-Level Event Photography','Fine Art Photography']) assert(JSON.stringify(services).includes(name), `services.json missing ${name}`);
const featuredWorks=JSON.parse(read('data/featured-works.json'));
const peterMagyarWork=featuredWorks.featuredWorks?.find(work=>work['@id']==='https://www.norbertbanhalmi.com/#peter-magyar-portrait-2026');
assert(Boolean(peterMagyarWork), 'featured work must include the verified Péter Magyar portrait');
if(peterMagyarWork){
  assert(peterMagyarWork.contentUrl==='https://www.norbertbanhalmi.com/assets/img/portraits/service-gallery/peter-magyar-portrait-2026-by-norbert-banhalmi.webp', 'Péter Magyar portrait must retain the production image URL');
  assert(peterMagyarWork.url==='https://commons.wikimedia.org/wiki/File:Peter-Magyar-portrait-2026.jpg', 'Péter Magyar portrait must retain the Wikimedia Commons source');
  assert(peterMagyarWork.creator?.['@id']==='https://www.banhalmi.art/norbert-banhalmi', 'Péter Magyar portrait must identify Bánhalmi Norbert as creator');
  assert(peterMagyarWork.about?.['@id']==='https://www.wikidata.org/wiki/Q124488292', 'Péter Magyar portrait must identify Péter Magyar through Wikidata Q124488292');
  assert(peterMagyarWork.isPartOf?.some(item=>item['@id']==='https://www.wikidata.org/wiki/Q138717398'), 'Péter Magyar portrait must remain linked to the EUFÓRIA Wikidata entity');
  assert(peterMagyarWork.identifier?.some(item=>item.propertyID==='Creator Wikidata'&&item.value==='Q56391118'), 'Péter Magyar portrait must retain Bánhalmi Norbert Wikidata Q56391118');
  const referenceArticle=peterMagyarWork.subjectOf;
  assert(['Article','NewsArticle'].includes(referenceArticle?.['@type']), 'verified reference must expose a separate Article or NewsArticle entity');
  for(const field of ['name','headline','datePublished','inLanguage','publisher','creditText']) assert(Boolean(referenceArticle?.[field]), `verified reference Article missing ${field}`);
}
for(const file of ['portrait/index.html','hu/portre/index.html','de-at/portrait/index.html']){
  const h=read(file);
  assert(h.includes('\"@type\":\"Article\",\"@id\":\"https://www.banhalmi.art/post/euforia#article\"'), `${file}: missing standalone EUFÓRIA Article schema entity`);
  for(const invariant of ['Q124488292','Q56391118','Q138717398','Peter-Magyar-portrait-2026.jpg','peter-magyar-portrait-2026-by-norbert-banhalmi.webp','supporting editorial evidence, not a political endorsement']){
    assert(h.includes(invariant), `${file}: Péter Magyar reference schema invariant missing ${invariant}`);
  }
}
const css=read('assets/css/style.css')+'\n'+read('css/style.css');
assert(/nav-submenu/.test(css), 'dropdown-specific CSS is required');
assert(!/(?:filter|backdrop-filter|-webkit-backdrop-filter)\s*:[^;{}]*blur\s*\((?!\s*0(?:px|rem|em|%)?\s*\))/i.test(css), 'production CSS must not contain non-zero blur effects');
assert(!/word-break\s*:\s*break-all/i.test(css), 'aggressive word breaking is forbidden');
const mainJs=read('assets/js/main.js')+'\n'+read('js/main.js');
assert(/nav-submenu/.test(mainJs), 'dropdown JavaScript is required');
assert(!/galleryLightbox|data-gallery-lightbox/.test(mainJs), 'deleted commercial gallery JavaScript remains');
const pricing=JSON.parse(read('pricing.json'));
for(const key of ['individualQuick30','headshotCvGross','brandFastOneHour','eventOneHour','travelPerVehicleGross']) assert(Number(pricing.priceComponentsGrossEUR[key])>0, `pricing.json: ${key} must be positive`);
const qjs=read('assets/js/quote-calculator.js');
assert(qjs.includes('function quoteRoot'), 'quote calculator must resolve an explicit quote root');
assert(!qjs.includes("root=(f.closest('[data-quote-root]')||f.closest('section')||document)"), 'quote calculator must not fall back to document for visible estimate');
assert(qjs.includes("root.querySelector('[data-estimate-gross]')"), 'quote calculator must paint visible gross estimate within quote root');
for(const file of ['/requestaquote/index.html','/hu/ajanlatkeres/index.html','/de-at/anfrage/index.html']){
  const p=file.slice(1); const h=read(p);
  assert((h.match(/data-quote-root/g)||[]).length===1, `${p}: must have exactly one shared data-quote-root`);
  for(const sel of ['data-estimate-gross','data-estimate-net','data-estimate-vat']) assert((h.match(new RegExp(sel+'=\"\"','g'))||[]).length===1, `${p}: ${sel} must exist exactly once in visible summary`);
  assert(h.includes('/assets/js/quote-calculator.js?v=20260717-four-services-root'), `${p}: quote calculator script must use current cache-busted asset`);
}
for(const file of htmlFiles()){
  const h=read(file);
  for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){ try{JSON.parse(m[1]);}catch(e){fail.push(`${file}: invalid JSON-LD ${e.message}`);} }
  const ids=[...h.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  const dup=ids.filter((id,i)=>ids.indexOf(id)!==i);
  assert(!dup.length, `${file}: duplicate id(s): ${[...new Set(dup)].join(', ')}`);
  for(const attr of ['href','src']) for(const m of h.matchAll(new RegExp(attr+'="([^"]+)"','g'))){
    const u=m[1]; if(/^(https?:|mailto:|tel:|sms:|javascript:|#|data:)/.test(u)) continue;
    const raw=u.split('#')[0].split('?')[0]; if(!raw) continue;
    let target=raw.startsWith('/')?raw.slice(1):path.relative('.',path.resolve(path.dirname(file),raw));
    if(raw.endsWith('/')||!path.extname(raw)) target=path.join(target,'index.html');
    assert(exists(target), `${file}: broken ${attr} ${u}`);
  }
}
const sitemap=read('sitemap.xml');
for(const route of ['/portrait/','/lifestyle/','/event-photography/','/glamour/','/hu/portre/','/hu/brand/','/hu/rendezvenyfotozas/','/hu/muveszi-fotografia/','/de-at/portrait/','/de-at/brand/','/de-at/eventfotografie/','/de-at/fine-art/']) assert(sitemap.includes(`https://www.norbertbanhalmi.com${route}`), `sitemap missing ${route}`);

// Machine-readable pricing and quote strategy invariants.
assert(pricing.currency==='EUR', 'pricing.json must declare EUR currency');
assert(pricing.priceBasis==='gross consumer-facing orientation prices', 'pricing.json must identify displayed values as gross orientation prices');
assert(pricing.pricingSemantics&&pricing.pricingSemantics.monetaryConvention.includes('gross EUR'), 'pricing.json must explain gross monetary semantics for machines');
assert(pricing.calculationRules&&pricing.calculationRules.tax&&pricing.calculationRules.tax.netFormula, 'pricing.json must publish explicit tax calculation rules');
for(const rule of ['individualPortrait','groupPortrait','brandPhotography','fineArtPhotography','cLevelEventPhotography']) assert(pricing.calculationRules&&pricing.calculationRules[rule]&&pricing.calculationRules[rule].formula, `pricing.json missing machine-readable formula: ${rule}`);
assert(Array.isArray(pricing.services)&&pricing.services.length===4, 'pricing.json must retain exactly four principal service groups');
const portraitPricing=pricing.services.find(x=>x.id==='portrait');
assert(portraitPricing&&portraitPricing.packages.some(x=>x.code==='headshotcv'&&x.grossEUR===pricing.priceComponentsGrossEUR.headshotCvGross), 'headshot package must map to canonical gross component');
assert(portraitPricing&&portraitPricing.groupPortraitPricing&&portraitPricing.groupPortraitPricing.setupGrossEUR===pricing.priceComponentsGrossEUR.groupSetupLaterRetouching, 'group portrait formula must map to canonical setup component');
const eventPricing=pricing.services.find(x=>x.id==='event');
assert(eventPricing&&eventPricing.name.en==='C-Level Event Photography', 'pricing event service must align with the four-service architecture');
const qjsMirror=read('js/quote-calculator.js');
assert(qjs===qjsMirror, 'quote calculator source mirrors must remain identical');
assert(qjs.includes("root.querySelector('[data-estimate-vat-note]')||root.querySelector('[data-vat-note]')"), 'quote calculator must update the rendered VAT note with backwards-compatible selectors');
for(const p of ['requestaquote/index.html','hu/ajanlatkeres/index.html','de-at/anfrage/index.html']) assert(read(p).includes('data-vat-note'), `${p}: visible VAT note is missing`);



// Strategic-positioning, Schema.org and Wikidata invariants.
const strategicCopy={
  'index.html':['first impression','Four principal service areas:','As a member of AmCham Austria'],
  'hu/index.html':['első benyomást','Négy fő szolgáltatási terület:','Az AmCham Austria tagjaként'],
  'de-at/index.html':['ersten Eindruck','Vier zentrale Leistungsbereiche:','Als Mitglied von AmCham Austria']
};
for(const [file,phrases] of Object.entries(strategicCopy)) for(const phrase of phrases) assert(read(file).includes(phrase), `${file}: missing strategic-positioning phrase ${phrase}`);
const entity=JSON.parse(read('entity.jsonld'));
const entityGraph=entity['@graph']||[];
const strategicMethod=entityGraph.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#visual-strategic-partnership-method');
assert(strategicMethod&&strategicMethod['@type']==='HowTo', 'entity.jsonld must expose the visual strategic partnership method as HowTo');
assert(strategicMethod&&Array.isArray(strategicMethod.step)&&strategicMethod.step.length===5, 'strategic partnership method must contain exactly five ordered steps');
const schemaOrg=entityGraph.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#organization');
assert(schemaOrg&&Array.isArray(schemaOrg.subjectOf)&&schemaOrg.subjectOf.some(x=>x['@id']==='https://www.norbertbanhalmi.com/#visual-strategic-partnership-method'), 'Organization schema must link to the strategic method');
const wikidataExpectations={
  'https://www.banhalmi.art/norbert-banhalmi':'https://www.wikidata.org/wiki/Q56391118',
  'https://www.norbertbanhalmi.com/#organization':'https://www.wikidata.org/wiki/Q138425941',
  'https://www.norbertbanhalmi.com/#amcham-austria':'https://www.wikidata.org/wiki/Q138413481'
};
for(const [id,wikidata] of Object.entries(wikidataExpectations)){
  const node=entityGraph.find(x=>x['@id']===id);
  assert(node&&Array.isArray(node.sameAs)&&node.sameAs.includes(wikidata), `entity.jsonld missing Wikidata sameAs for ${id}`);
}
for(const file of ['knowledge.json','entity-graph.json']){
  const data=JSON.parse(read(file));
  assert(data.visualStrategicPartnershipMethod&&data.visualStrategicPartnershipMethod.stages.length===5, `${file}: strategic method missing or incomplete`);
  assert(data.visualStrategicPartnershipMethod.businessTrustContext.wikidata==='https://www.wikidata.org/wiki/Q138413481', `${file}: AmCham Wikidata trust context missing`);
}
for(const file of ['ai.txt','llms.txt','llms-full.txt']) assert(read(file).includes('## Strategic positioning interpretation'), `${file}: strategic positioning guidance missing`);

if(fail.length){ console.error(fail.map(x=>'✗ '+x).join('\n')); process.exit(1); }
console.log('Production audit regression checks passed.');
