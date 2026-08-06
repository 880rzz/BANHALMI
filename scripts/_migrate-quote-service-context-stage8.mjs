import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(root,relative),value);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const servicePages={
  'portrait/index.html':{service:'portrait',category:'individual',quote:'/requestaquote/',kind:'commercial'},
  'lifestyle/index.html':{service:'brand',category:'brand',quote:'/requestaquote/',kind:'commercial'},
  'event-photography/index.html':{service:'event',category:'event',quote:'/requestaquote/',kind:'commercial'},
  'hu/portre/index.html':{service:'portrait',category:'individual',quote:'/hu/ajanlatkeres/',kind:'commercial'},
  'hu/brand/index.html':{service:'brand',category:'brand',quote:'/hu/ajanlatkeres/',kind:'commercial'},
  'hu/rendezvenyfotozas/index.html':{service:'event',category:'event',quote:'/hu/ajanlatkeres/',kind:'commercial'},
  'de-at/portrait/index.html':{service:'portrait',category:'individual',quote:'/de-at/anfrage/',kind:'commercial'},
  'de-at/brand/index.html':{service:'brand',category:'brand',quote:'/de-at/anfrage/',kind:'commercial'},
  'de-at/eventfotografie/index.html':{service:'event',category:'event',quote:'/de-at/anfrage/',kind:'commercial'},
  'glamour/index.html':{service:'fine-art',category:'art',quote:'/requestaquote/',kind:'fine-art'},
  'hu/muveszi-fotografia/index.html':{service:'fine-art',category:'art',quote:'/hu/ajanlatkeres/',kind:'fine-art'},
  'de-at/fine-art/index.html':{service:'fine-art',category:'art',quote:'/de-at/anfrage/',kind:'fine-art'}
};
const quotePages=['requestaquote/index.html','hu/ajanlatkeres/index.html','de-at/anfrage/index.html'];
const oldAsset='/assets/js/quote-calculator.js?v=20260717-four-services-root';
const newAsset='/assets/js/quote-calculator.js?v=20260806-service-context';
const manifest={
  migration:'BANHALMI service-to-quote context — stage 24',
  executedAt:'2026-08-06T11:12:00+02:00',
  method:'Add an allowlisted public service query to only the service-specific quote links, map it to the existing internal quote category before the first calculator paint, preserve it across quote-page language switching and explicit category changes, and leave generic navigation, footer, canonical and hreflang URLs query-free.',
  publicToInternal:{portrait:'individual',brand:'brand',event:'event','fine-art':'art'},
  pages:[],
  quotePages:[]
};

function replaceOnce(source,oldValue,newValue,label){
  const count=source.split(oldValue).length-1;
  if(count!==1) throw new Error(`${label}: expected one exact match, found ${count}`);
  return source.replace(oldValue,newValue);
}
function sectionBy(source,startToken,endToken,label){
  const start=source.indexOf(startToken);
  if(start<0) throw new Error(`${label}: start token missing`);
  const end=source.indexOf(endToken,start);
  if(end<0) throw new Error(`${label}: end token missing`);
  return {start,end:end+endToken.length,html:source.slice(start,end+endToken.length)};
}

for(const [relative,config] of Object.entries(servicePages)){
  const before=read(relative);
  const contextual=config.quote+'?service='+config.service;
  if(before.includes(contextual)) throw new Error(`${relative}: contextual quote link already exists`);
  let after=before;
  const mutations=[];
  if(config.kind==='commercial'){
    const selector=sectionBy(after,'<section class="section-band next-step-selector"','</section>',`${relative}: next-step selector`);
    const oldSelectorHref=`href="${config.quote}"`;
    const newSelectorHref=`href="${contextual}"`;
    const newSelector=replaceOnce(selector.html,oldSelectorHref,newSelectorHref,`${relative}: final package link`);
    after=after.slice(0,selector.start)+newSelector+after.slice(selector.end);
    mutations.push({location:'final three-way selector',oldHref:config.quote,newHref:contextual,beforeSha256:sha256(selector.html),afterSha256:sha256(newSelector)});

    const framework=sectionBy(after,'<details class="project-framework-drawer"','</details>',`${relative}: project framework`);
    const newFramework=replaceOnce(framework.html,oldSelectorHref,newSelectorHref,`${relative}: project-framework quote link`);
    after=after.slice(0,framework.start)+newFramework+after.slice(framework.end);
    mutations.push({location:'project framework',oldHref:config.quote,newHref:contextual,beforeSha256:sha256(framework.html),afterSha256:sha256(newFramework)});
  }else{
    const privateCta=sectionBy(after,'<section class="cta-band" id="private-conversation">','</section>',`${relative}: private conversation CTA`);
    const oldHref=`href="${config.quote}"`;
    const newHref=`href="${contextual}"`;
    const newCta=replaceOnce(privateCta.html,oldHref,newHref,`${relative}: Fine Art quote link`);
    after=after.slice(0,privateCta.start)+newCta+after.slice(privateCta.end);
    mutations.push({location:'private conversation CTA',oldHref:config.quote,newHref:contextual,beforeSha256:sha256(privateCta.html),afterSha256:sha256(newCta)});
  }

  const expectedCount=config.kind==='commercial'?2:1;
  if((after.split(`href="${contextual}"`).length-1)!==expectedCount) throw new Error(`${relative}: expected ${expectedCount} contextual links`);
  const footerStart=after.indexOf('<footer class="site-footer">');
  if(footerStart<0) throw new Error(`${relative}: footer missing`);
  const footer=after.slice(footerStart);
  if(!footer.includes(`href="${config.quote}"`)) throw new Error(`${relative}: generic footer quote link was lost`);
  if(footer.includes('?service=')) throw new Error(`${relative}: service query leaked into footer`);
  const headEnd=after.indexOf('</head>');
  if(headEnd<0) throw new Error(`${relative}: head missing`);
  if(after.slice(0,headEnd).includes('?service=')) throw new Error(`${relative}: service query leaked into metadata`);

  let normalized=after;
  for(const mutation of mutations) normalized=normalized.replaceAll(`href="${mutation.newHref}"`,`href="${mutation.oldHref}"`);
  if(normalized!==before) throw new Error(`${relative}: content outside scoped quote links changed`);
  write(relative,after);
  manifest.pages.push({file:relative,...config,contextualHref:contextual,beforeSha256:sha256(before),afterSha256:sha256(after),beforeBytes:Buffer.byteLength(before),afterBytes:Buffer.byteLength(after),mutations,genericFooterLinkPreserved:true,metadataQueryFree:true});
}

let engine=read('assets/js/quote-calculator.js');
const engineBefore=engine;
const helperAnchor='  function val(f,n,d){';
if(!engine.includes(helperAnchor)) throw new Error('quote-calculator.js: helper insertion anchor missing');
if(engine.includes('serviceContextToCategory')) throw new Error('quote-calculator.js: service context already exists');
const helpers=`  var serviceContextToCategory={portrait:'individual',brand:'brand',event:'event','fine-art':'art'};\n  var categoryToServiceContext={individual:'portrait',group:'portrait',brand:'brand',event:'event',art:'fine-art'};\n  var quoteContextPaths=['/requestaquote/','/hu/ajanlatkeres/','/de-at/anfrage/'];\n  function requestedServiceContext(){try{var raw=(new URLSearchParams(window.location.search).get('service')||'').trim().toLowerCase();return Object.prototype.hasOwnProperty.call(serviceContextToCategory,raw)?raw:'';}catch(_){return '';}}\n  function serviceContextField(f){var field=f.querySelector('input[name="service_context"]');if(field)return field;field=document.createElement('input');field.type='hidden';field.name='service_context';f.appendChild(field);return field;}\n  function updateServiceContextLanguageLinks(service){document.querySelectorAll('.lang-switch a[hreflang]').forEach(function(link){try{var url=new URL(link.getAttribute('href'),window.location.origin);if(url.origin!==window.location.origin||quoteContextPaths.indexOf(url.pathname)<0)return;url.searchParams.set('service',service);link.setAttribute('href',url.pathname+url.search+url.hash);}catch(_){}});}\n  function storeServiceContext(f,service,source,replaceUrl){if(!service||!Object.prototype.hasOwnProperty.call(serviceContextToCategory,service))return '';f.setAttribute('data-service-context',service);f.setAttribute('data-service-context-source',source||'selection');serviceContextField(f).value=service;updateServiceContextLanguageLinks(service);if(replaceUrl){try{var url=new URL(window.location.href);if(quoteContextPaths.indexOf(url.pathname)>=0){url.searchParams.set('service',service);window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);}}catch(_){}}return service;}\n  function applyRequestedServiceContext(f){var service=requestedServiceContext();if(!service)return '';var category=serviceContextToCategory[service],field=f.querySelector('[name="category"][value="'+category+'"]');if(!field)return '';field.checked=true;return storeServiceContext(f,service,'url',false);}\n  function syncServiceContextFromCategory(f,replaceUrl){var field=f.querySelector('[name="category"]:checked');if(!field)return '';var service=categoryToServiceContext[field.value]||'';return storeServiceContext(f,service,'selection',!!replaceUrl);}\n`;
engine=engine.replace(helperAnchor,helpers+helperAnchor);
const oldInit="  function init(f){setDateMins(f);updatePanels(f);f.addEventListener('change',function(){updatePanels(f);paint(f);});f.addEventListener('input',function(){paint(f);});paint(f);}";
const newInit="  function init(f){applyRequestedServiceContext(f);setDateMins(f);updatePanels(f);f.addEventListener('change',function(event){if(event&&event.target&&event.target.name==='category')syncServiceContextFromCategory(f,true);updatePanels(f);paint(f);});f.addEventListener('input',function(){paint(f);});paint(f);}";
engine=replaceOnce(engine,oldInit,newInit,'quote-calculator.js: init contract');
const oldExport="pricingError:function(){return pricingError;}};";
const newExport="pricingError:function(){return pricingError;},requestedServiceContext:requestedServiceContext,applyRequestedServiceContext:applyRequestedServiceContext,syncServiceContextFromCategory:syncServiceContextFromCategory};";
engine=replaceOnce(engine,oldExport,newExport,'quote-calculator.js: public test API');
write('assets/js/quote-calculator.js',engine);
manifest.quoteEngine={file:'assets/js/quote-calculator.js',beforeSha256:sha256(engineBefore),afterSha256:sha256(engine),beforeBytes:Buffer.byteLength(engineBefore),afterBytes:Buffer.byteLength(engine),allowlist:manifest.publicToInternal,missingOrUnknownFallback:'Existing checked individual portrait category remains unchanged.',languageSwitchPreservesValidContext:true,manualCategoryChangeSynchronizesUrl:true,submissionField:'service_context'};

for(const relative of quotePages){
  const before=read(relative);
  let after=replaceOnce(before,oldAsset,newAsset,`${relative}: quote engine cache version`);
  const head=(after.match(/<head>[\s\S]*?<\/head>/)||[''])[0];
  if(!head) throw new Error(`${relative}: head missing`);
  if(/(?:canonical|hreflang)[^>]+\?service=/.test(head)||head.includes('?service=')) throw new Error(`${relative}: service query leaked into source metadata`);
  const switchMatch=after.match(/<div aria-label="[^"]+" class="lang-switch"[\s\S]*?<\/div>/);
  if(!switchMatch) throw new Error(`${relative}: language switch missing`);
  if(switchMatch[0].includes('?service=')) throw new Error(`${relative}: source language switch must stay query-free`);
  write(relative,after);
  manifest.quotePages.push({file:relative,beforeSha256:sha256(before),afterSha256:sha256(after),assetBefore:oldAsset,assetAfter:newAsset,sourceMetadataQueryFree:true,sourceLanguageSwitchQueryFree:true});
}

let regression=read('tools/audit-regression.mjs');
regression=replaceOnce(regression,oldAsset,newAsset,'tools/audit-regression.mjs: quote cache contract');
write('tools/audit-regression.mjs',regression);

const audit=`import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const errors=[];
const pages=${JSON.stringify(servicePages,null,2)};
const quotePages=${JSON.stringify(quotePages)};
const allowed={portrait:'individual',brand:'brand',event:'event','fine-art':'art'};
const contextualOccurrences=[];
for(const [relative,config] of Object.entries(pages)){
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  const expected=config.quote+'?service='+config.service;
  const expectedCount=config.kind==='commercial'?2:1;
  if((html.split('href="'+expected+'"').length-1)!==expectedCount) errors.push(relative+': expected '+expectedCount+' service-context quote links');
  const footer=html.slice(html.indexOf('<footer class="site-footer">'));
  if(!footer.includes('href="'+config.quote+'"')) errors.push(relative+': generic footer quote link missing');
  if(footer.includes('?service=')) errors.push(relative+': service query leaked into footer');
  const head=html.slice(0,html.indexOf('</head>'));
  if(head.includes('?service=')) errors.push(relative+': service query leaked into metadata');
  if(config.kind==='commercial'){
    const selector=(html.match(/<section class="section-band next-step-selector"[\\s\\S]*?<\\/section>/)||[''])[0];
    const framework=(html.match(/<details class="project-framework-drawer"[\\s\\S]*?<\\/details>/)||[''])[0];
    if(!selector.includes('href="'+expected+'"')) errors.push(relative+': final package link lacks service context');
    if(!framework.includes('href="'+expected+'"')) errors.push(relative+': project-framework link lacks service context');
  }else{
    const cta=(html.match(/<section class="cta-band" id="private-conversation">[\\s\\S]*?<\\/section>/)||[''])[0];
    if(!cta.includes('href="'+expected+'"')) errors.push(relative+': Fine Art private CTA lacks service context');
  }
  for(const match of html.matchAll(/href="([^"]+\\?service=([^"]+))"/g)) contextualOccurrences.push({file:relative,href:match[1],service:match[2]});
}
if(contextualOccurrences.length!==21) errors.push('expected exactly 21 scoped service-context links, found '+contextualOccurrences.length);
for(const item of contextualOccurrences) if(!Object.prototype.hasOwnProperty.call(allowed,item.service)) errors.push(item.file+': unsupported public service context '+item.service);
const engine=fs.readFileSync(path.join(root,'assets/js/quote-calculator.js'),'utf8');
for(const token of ['serviceContextToCategory','categoryToServiceContext','new URLSearchParams(window.location.search)','Object.prototype.hasOwnProperty.call(serviceContextToCategory','applyRequestedServiceContext(f)','syncServiceContextFromCategory(f,true)','input[name="service_context"]','updateServiceContextLanguageLinks','window.history.replaceState']) if(!engine.includes(token)) errors.push('quote-calculator.js: missing '+token);
for(const [service,category] of Object.entries(allowed)) if(!engine.includes((service.includes('-')?"'"+service+"'":service)+":'"+category+"'")) errors.push('quote-calculator.js: missing allowlist mapping '+service+' → '+category);
for(const relative of quotePages){
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  if(!html.includes('${newAsset}')) errors.push(relative+': current quote engine version missing');
  const head=(html.match(/<head>[\\s\\S]*?<\\/head>/)||[''])[0];
  if(head.includes('?service=')) errors.push(relative+': source metadata must stay query-free');
  const switcher=(html.match(/<div aria-label="[^"]+" class="lang-switch"[\\s\\S]*?<\\/div>/)||[''])[0];
  if(!switcher||switcher.includes('?service=')) errors.push(relative+': source language switch must stay query-free');
  if((html.match(/name="category"[^>]*value="individual"|value="individual"[^>]*name="category"/g)||[]).length<1) errors.push(relative+': individual fallback category missing');
}
const regression=fs.readFileSync(path.join(root,'tools/audit-regression.mjs'),'utf8');
if(!regression.includes('${newAsset}')) errors.push('audit-regression.mjs: current quote engine cache contract missing');
if(errors.length){console.error(errors.join('\\n'));process.exit(1)}
console.log('Stage-twenty-four quote service-context audit passed: 21 scoped links map four public services safely across three localized quote builders.');
`;
write('tools/audit-quote-service-context-stage24.mjs',audit);

const directContexts=[
  {service:'portrait',category:'individual',panel:'individual'},
  {service:'brand',category:'brand',panel:'brand'},
  {service:'event',category:'event',panel:'event'},
  {service:'fine-art',category:'art',panel:'art'}
];
const serviceRouteTests=Object.entries(servicePages).map(([file,config])=>({route:'/'+file.replace(/index\\.html$/,''),service:config.service,category:config.category,kind:config.kind}));
const browser=`import { test, expect } from '@playwright/test';

const quoteRoutes=['/requestaquote/','/hu/ajanlatkeres/','/de-at/anfrage/'];
const contexts=${JSON.stringify(directContexts,null,2)};
function amount(text){const cleaned=String(text).replace(/[^0-9,.-]/g,'').replace(/\\.(?=\\d{3})/g,'').replace(',','.');return Number.parseFloat(cleaned);}
for(const quoteRoute of quoteRoutes){
  for(const context of contexts){
    test(quoteRoute+' applies '+context.service+' before the first estimate',async({page})=>{
      await page.goto(quoteRoute+'?service='+context.service);
      await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1,{timeout:10000});
      const form=page.locator('[data-smart-quote]');
      await expect(form).toHaveAttribute('data-service-context',context.service);
      await expect(form).toHaveAttribute('data-service-context-source','url');
      await expect(form.locator('input[name="service_context"]')).toHaveValue(context.service);
      await expect(form.locator('input[name="category"][value="'+context.category+'"]').first()).toBeChecked();
      await expect(form.locator('[data-panel="'+context.panel+'"]').first()).toBeVisible();
      const gross=amount(await page.locator('[data-estimate-gross]').textContent());
      expect(gross).toBeGreaterThan(0);
      const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).not.toContain('?service=');
      const switchHrefs=await page.locator('.lang-switch a[hreflang]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
      expect(switchHrefs.length).toBe(3);
      for(const href of switchHrefs) expect(href).toContain('service='+context.service);
    });
  }
  test(quoteRoute+' ignores missing or unsupported service context safely',async({page})=>{
    await page.goto(quoteRoute+'?service=unsupported');
    await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1,{timeout:10000});
    const form=page.locator('[data-smart-quote]');
    await expect(form.locator('input[name="category"][value="individual"]').first()).toBeChecked();
    await expect(form).not.toHaveAttribute('data-service-context');
    await expect(form.locator('input[name="service_context"]')).toHaveCount(0);
  });
}

test('manual category change synchronizes the public URL and localized language links',async({page})=>{
  await page.goto('/requestaquote/?service=brand');
  await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1,{timeout:10000});
  await page.locator('input[name="category"][value="event"]').check();
  await expect(page).toHaveURL(/service=event/);
  await expect(page.locator('[data-smart-quote] input[name="service_context"]')).toHaveValue('event');
  for(const link of await page.locator('.lang-switch a[hreflang]').all()) await expect(link).toHaveAttribute('href',/service=event/);
});

const serviceRoutes=${JSON.stringify(serviceRouteTests,null,2)};
for(const item of serviceRoutes){
  test(item.route+' carries its service into the localized quote builder',async({page})=>{
    await page.goto(item.route);
    const selector=item.kind==='commercial'?'#next-step article.card:first-child a.btn-link':'#private-conversation a.btn-primary';
    const link=page.locator(selector).first();
    await expect(link).toHaveAttribute('href',new RegExp('\\\\?service='+item.service+'$'));
    await link.click();
    await expect(page).toHaveURL(new RegExp('service='+item.service));
    await expect(page.locator('[data-pricing-ready="true"]')).toHaveCount(1,{timeout:10000});
    await expect(page.locator('input[name="category"][value="'+item.category+'"]').first()).toBeChecked();
    await expect(page.locator('[data-smart-quote] input[name="service_context"]')).toHaveValue(item.service);
  });
}
`;
write('tests/quote-service-context.spec.mjs',browser);

let packageJson=read('package.json');
const packageAnchor='node tools/audit-fine-art-private-journey-stage23.mjs';
if(!packageJson.includes(packageAnchor)) throw new Error('package.json: stage23 audit anchor missing');
if(packageJson.includes('audit-quote-service-context-stage24.mjs')) throw new Error('package.json: stage24 audit already registered');
packageJson=packageJson.replace(packageAnchor,packageAnchor+' && node tools/audit-quote-service-context-stage24.mjs');
write('package.json',packageJson);

const ecosystem=JSON.parse(read('ecosystem.json'));
ecosystem.quoteServiceContext={
  publicParameter:'service',
  allowlist:manifest.publicToInternal,
  sourcePages:Object.keys(servicePages),
  scopedLinks:21,
  behavior:'The allowlisted service context selects the matching existing quote category before the first calculator paint. Unknown or missing values leave the existing individual-portrait default unchanged.',
  continuity:['localized quote-page language switching','explicit category changes','submitted service_context field'],
  seoBoundary:'Canonical, hreflang, source language-switch and generic navigation/footer URLs remain query-free.'
};
write('ecosystem.json',JSON.stringify(ecosystem,null,2)+'\n');

const machineBlock=`<!-- QUOTE-SERVICE-CONTEXT:START -->
## Service-to-quote context
- Service-specific quote links use one allowlisted public query parameter: portrait, brand, event or fine-art.
- The quote engine maps these values before its first calculation: portrait → individual, brand → brand, event → event and fine-art → art.
- Missing or unsupported values do not override the existing individual-portrait default.
- Valid context is preserved across quote-page language switching, explicit category changes and the submitted service_context field.
- Only scoped service-page links carry the parameter. Generic navigation and footer links, canonical URLs, hreflang URLs and source language-switch links remain query-free.
<!-- QUOTE-SERVICE-CONTEXT:END -->`;
for(const relative of ['ai.txt','llms.txt','llms-full.txt']){
  let text=read(relative);
  const start='<!-- QUOTE-SERVICE-CONTEXT:START -->';
  const end='<!-- QUOTE-SERVICE-CONTEXT:END -->';
  const existing=text.indexOf(start);
  if(existing>=0){
    const close=text.indexOf(end,existing);
    if(close<0) throw new Error(`${relative}: malformed quote service context block`);
    text=text.slice(0,existing)+machineBlock+text.slice(close+end.length);
  }else{
    text=machineBlock+'\n\n'+text;
  }
  write(relative,text);
}

manifest.permanentAudit='tools/audit-quote-service-context-stage24.mjs';
manifest.browserRegression='tests/quote-service-context.spec.mjs';
manifest.machineReadable=['ecosystem.json','ai.txt','llms.txt','llms-full.txt'];
write('docs/content-migrations/2026-08-06-quote-service-context-stage8.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Quote service-context migration complete: ${Object.keys(servicePages).length} service pages, 21 scoped links and ${quotePages.length} localized quote builders.`);
