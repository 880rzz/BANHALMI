import fs from 'node:fs';

const registry=JSON.parse(fs.readFileSync('processors.json','utf8'));
if(registry.documentType!=='BANHALMI service-provider and processor registry') throw new Error('processors.json: unexpected document type');
const providers=new Map(registry.providers.map(p=>[p.id,p]));
for(const id of ['github-pages','cloudflare-workers','google-workspace-apps-script','google-analytics-4','trustindex','elfsight','vercel-legacy-redirects']){
  if(!providers.has(id)) throw new Error(`processors.json: missing provider ${id}`);
}
for(const id of ['google-analytics-4','trustindex','elfsight']){
  if(providers.get(id).consentRequired!==true) throw new Error(`${id}: optional provider must remain consent-gated`);
}
for(const id of ['github-pages','cloudflare-workers','google-workspace-apps-script','vercel-legacy-redirects']){
  if(providers.get(id).consentRequired!==false) throw new Error(`${id}: necessary/request-driven infrastructure must not be mislabeled as optional consent storage`);
}
const legacy=providers.get('vercel-legacy-redirects');
for(const host of ['banhalmi.at','www.banhalmi.at','banhalminorbert.hu','www.banhalminorbert.hu']){
  if(!legacy.scope.includes(host)) throw new Error(`Vercel legacy scope missing ${host}`);
}
const pages={
  en:fs.readFileSync('privacy-policy/index.html','utf8'),
  hu:fs.readFileSync('hu/adatvedelem/index.html','utf8'),
  de:fs.readFileSync('de-at/datenschutz/index.html','utf8')
};
for(const [lang,text] of Object.entries(pages)){
  for(const needle of ['GitHub Pages','Cloudflare','Google Apps Script','Trustindex','Elfsight','Vercel']){
    if(!text.includes(needle)) throw new Error(`${lang} privacy: missing provider disclosure ${needle}`);
  }
  if(/Wix/i.test(text)) throw new Error(`${lang} privacy: legacy Wix disclosure must not remain`);
}
const trust=fs.readFileSync('trust/index.html','utf8');
if(!trust.includes('/privacy-policy/#processors') && !trust.includes('/privacy-policy#processors')){
  throw new Error('Trust Center must keep a direct provider/processors path into the privacy notice');
}
console.log('Stage 40 processor/trust audit passed: provider registry, consent gating, legacy redirects and privacy disclosures are aligned.');
