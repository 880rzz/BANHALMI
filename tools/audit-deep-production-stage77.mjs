import fs from 'node:fs';

const fail=[];
const need=(ok,msg)=>{if(!ok)fail.push(msg)};

const entry=JSON.parse(fs.readFileSync('ai-entry.json','utf8'));
need(entry.version==='2026-08-14-v8','ai-entry version is not the deep-audit release');
const loc=entry.identity?.locations||[];
const bp=loc.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#budapest-studio');
const vi=loc.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#vienna-studio');
const of=loc.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#vienna-gersthofer-office');
need(bp?.streetAddress==='Lágymányosi u. 15'&&bp?.postalCode==='1111','Budapest public studio address incomplete');
need(vi?.streetAddress==='Schwedenplatz 2, Top 8–9'&&vi?.postalCode==='1010','Vienna public studio address incomplete');
need(of?.isStudio===false,'Gersthofer client office must remain explicitly non-studio');
const contact=entry.identity?.publicCustomerContacts||{};
need(contact.email==='hello@norbertbanhalmi.com','canonical public email missing');
need(contact.viennaTelephone==='+43 677 616 55592','canonical Vienna public phone missing');
need(contact.budapestTelephone==='+36 70 469 8397','canonical Budapest public phone missing');
const rules=(entry.answerRules||[]).join('\n');
for(const t of ['Do not substitute a staff-specific or relationship-specific telephone number','do not interpret this as worldwide offices or studios','Treat service areas as areaServed coverage only']) need(rules.includes(t),`agent answer rule missing: ${t}`);
need(entry.identity?.geographicServiceModel?.worldwideAvailability===true,'worldwide project-travel rule missing');
need((entry.identity?.principalServices||[]).length===4,'AI entry must expose exactly four principal services');

const services=JSON.parse(fs.readFileSync('services.json','utf8'));
need(services.numberOfItems===4&&(services.itemListElement||[]).length===4,'services.json must expose exactly four principal services');
for(const s of services.itemListElement||[])for(const a of ['Vienna','Budapest','Austria','Hungary','Europe'])need((s.areaServed||[]).includes(a),`${s.name}: primary areaServed missing ${a}`);

const robots=fs.readFileSync('robots.txt','utf8');
need(/User-agent:\s*\*[\s\S]*Allow:\s*\//i.test(robots),'robots wildcard public crawl allow missing');
need(!/User-agent:\s*OAI-SearchBot[\s\S]*Disallow:\s*\//i.test(robots),'OAI-SearchBot is blocked');
need(robots.includes('Sitemap: https://www.norbertbanhalmi.com/sitemap.xml'),'canonical sitemap missing from robots');

const analytics=fs.readFileSync('assets/js/analytics.js','utf8');
for(const t of ['analytics_storage: "denied"','ad_storage: "denied"','ad_user_data: "denied"','ad_personalization: "denied"','if (validStoredConsent()) load()'])need(analytics.includes(t),`analytics consent-first guard missing: ${t}`);
const main=fs.readFileSync('assets/js/main.js','utf8');
for(const t of ['readChoice() === "all"','elfsightcdn.com/platform.js','revokeThirdPartyScripts','openCookieSettings'])need(main.includes(t),`optional review/consent guard missing: ${t}`);

const trust=fs.readFileSync('trust/index.html','utf8');
for(const t of ['Article 50','Human oversight'])need(trust.includes(t),`Trust Center AI-transparency signal missing: ${t}`);
for(const r of ['/privacy-policy/','/cookie-policy/','/terms-conditions/'])need(trust.includes(`href="${r}"`),`Trust Center canonical legal route missing: ${r}`);

const optimizer=fs.readFileSync('tools/optimize-service-first-principles.mjs','utf8');
for(const t of ['service-framework-compact','data-strategic-partnership="concrete"','Private and family occasions','Privát és családi alkalmak','Private und familiäre Anlässe','changed!==9','removedPrivate!==3'])need(optimizer.includes(t),`service first-principles optimizer missing: ${t}`);
const composer=fs.readFileSync('tools/minify-pages-css.mjs','utf8');
need(composer.includes('optimizeServicePages(siteRoot)'),'production build does not invoke service first-principles optimizer');

for(const f of ['portrait/index.html','lifestyle/index.html','event-photography/index.html','glamour/index.html']){
  const h=fs.readFileSync(f,'utf8');
  need(/<link[^>]+rel="canonical"/i.test(h),`${f}: canonical missing`);
  need(/hreflang="(?:en|hu-HU|de-AT|x-default)"/i.test(h),`${f}: hreflang cluster missing`);
  need(/"@type":"Service"/.test(h),`${f}: Service JSON-LD missing`);
}

if(fail.length){console.error('STAGE 77 DEEP PRODUCTION / AGENT AUDIT FAILED');for(const x of fail)console.error('-',x);process.exit(1)}
console.log('Stage 77 deep production/agent audit passed: exact studio/contact GEO, consent-first analytics/reviews, Trust routes, crawler discovery, four-service entity model and first-principles production optimizer are aligned.');
