import fs from 'node:fs';

const errors=[];
const homepages=[
  {file:'index.html', marker:'data-first-principles-path="stage68"', heading:'What do you need right now?', contact:'/contact/', fineArt:'/glamour/', fineArtLabel:'Explore fine-art photography', labels:['New executive portrait','Consistent leadership portraits','Stronger personal brand','Brand photography for a company or campaign','C-level event coverage','I am not sure yet']},
  {file:'hu/index.html', marker:'data-first-principles-path="stage68"', heading:'Mire van most szüksége?', contact:'/hu/kapcsolat/', fineArt:'/hu/muveszi-fotografia/', fineArtLabel:'Művészi fotográfia', labels:['Új vezetői portréra','Egységes vezetői portrékra','Erősebb személyes márkára','Céges vagy kampány brandfotókra','Vezetői esemény dokumentálására','Még nem vagyok biztos benne']},
  {file:'de-at/index.html', marker:'data-first-principles-path="stage68"', heading:'Was brauchen Sie jetzt?', contact:'/de-at/kontakt/', fineArt:'/de-at/fine-art/', fineArtLabel:'Fine-Art-Fotografie', labels:['Ein neues Executive-Porträt','Einheitliche Führungskräfteporträts','Eine stärkere persönliche Marke','Brandfotografie für Unternehmen oder Kampagnen','Dokumentation eines Führungskräfte-Events','Ich bin noch nicht sicher']}
];
for(const page of homepages){
  const html=fs.readFileSync(page.file,'utf8');
  if(!html.includes(page.marker)) errors.push(`${page.file}: first-principles decision layer missing`);
  if(!html.includes(page.heading)) errors.push(`${page.file}: decision heading missing`);
  for(const label of page.labels) if(!html.includes(label)) errors.push(`${page.file}: decision option missing: ${label}`);
  const section=(html.match(/<section[^>]+data-first-principles-path="stage68"[\s\S]*?<\/section>/)||[''])[0];
  if((section.match(/class="fp-choice/g)||[]).length!==6) errors.push(`${page.file}: decision layer must contain exactly six primary choices`);
  if(!section.includes(`href="${page.contact}"`)) errors.push(`${page.file}: uncertain path must lead to the localized contact choice page`);
  if(/meet\.bookipi\.com\/zk5ly35r/.test(section)) errors.push(`${page.file}: decision layer must not duplicate the canonical direct booking CTA`);
  if(!section.includes('class="fp-art-path"')) errors.push(`${page.file}: fine-art secondary path missing`);
  if(!section.includes(`href="${page.fineArt}"`)) errors.push(`${page.file}: canonical fine-art route missing from decision layer`);
  if(!section.includes(page.fineArtLabel)) errors.push(`${page.file}: localized fine-art decision label missing`);
  if(!html.includes('<section class="hero hero-image-first"><div class="wrap"><figure class="hero-figure editorial-hero reveal">')) errors.push(`${page.file}: canonical source hero visual missing`);
}

const css=fs.readFileSync('assets/css/style.css','utf8');
for(const token of ['STAGE68-FIRST-PRINCIPLES-APPLE:START','.fp-decision-system','.fp-choice','.next-step-selector','STAGE69-FINE-ART-PATH:START','.fp-art-path']){
  if(!css.includes(token)) errors.push(`style.css: missing decision design authority token ${token}`);
}
if(!css.includes('text-wrap:balance')) errors.push('style.css: balanced display typography guard missing');
if(!css.includes('border-radius:999px')) errors.push('style.css: pill CTA authority missing');
if(!css.includes('max-width:68ch')) errors.push('style.css: readable text measure guard missing');

const apple=fs.readFileSync('assets/css/apple-authority-stage70.css','utf8');
for(const token of [
  'STAGE70-APPLE-DESIGN-AUTHORITY:START','STAGE70-APPLE-DESIGN-AUTHORITY:END','--bn-section-space',
  '.hero-visual-only','.hero-copy-only','.hero-visual-only+.fp-decision-system','.fp-decision-system+.hero-copy-only','box-shadow:none',
  'main .prose{max-width:var(--bn-reading);text-align:left','main .section-head{max-width:var(--bn-reading);margin:0 0 44px;text-align:left',
  '.next-step-selector{max-width:none;margin-inline:0;text-align:left}',
  '.next-step-selector .cards{grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}',
  '.trust-proof .grid-3{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch',
  '.review-drawer{padding:0;border:0;border-radius:0;background:transparent;text-align:left}',
  '.fp-decision-actions .fp-primary-action','.fp-decision-actions .fp-text-action'
]){
  if(!apple.includes(token)) errors.push(`Stage70/71/72 Apple authority missing ${token}`);
}
for(const forbidden of ['main>section:nth-of-type(even)', '.card,.next-step-selector,main details', 'main .section-head{margin-inline:auto;text-align:center}']){
  if(apple.includes(forbidden)) errors.push(`Stage72 visual layout regression: broad global selector must not return: ${forbidden}`);
}

const minifier=fs.readFileSync('tools/minify-pages-css.mjs','utf8');
for(const token of ['apple-authority-stage70.css','STAGE70-APPLE-DESIGN-AUTHORITY:START','fs.writeFileSync(sharedStyle','fs.unlinkSync(authority)','Stage70 authority did not survive production CSS composition/minification']){
  if(!minifier.includes(token)) errors.push(`production CSS composer missing ${token}`);
}
const optimizer=fs.readFileSync('tools/optimize-homepage-critical-path.mjs','utf8');
for(const token of ['data-hero-position="header-first"','data-hero-copy="stage70"','hero-visual-only','hero-copy-only','style.css?v=20260813-apple-authority-v70','header -> hero visual -> decision -> hero copy']){
  if(!optimizer.includes(token)) errors.push(`production homepage authority missing ${token}`);
}
const pagesWorkflow=fs.readFileSync('.github/workflows/pages.yml','utf8');
const minifyPos=pagesWorkflow.indexOf('Minify production CSS conservatively');
const hardenPos=pagesWorkflow.indexOf('Harden EN HU DE homepage critical path');
const productionBrowserPos=pagesWorkflow.indexOf('Run browser regressions against production artifact');
if(!(minifyPos>=0&&hardenPos>minifyPos&&productionBrowserPos>hardenPos)) errors.push('Pages workflow must compose CSS, harden hero hierarchy, then browser-test the exact artifact');

const runtime=fs.readFileSync('assets/js/main.js','utf8')+fs.readFileSync('assets/js/site-config.js','utf8');
if(runtime.includes('hero-visual-only')||runtime.includes('data-hero-position="header-first"')) errors.push('Stage70 hierarchy must be build-time, not runtime self-healing JavaScript');

if(errors.length){
  console.error('Stage68/70/71/72 first-principles Apple audit failed:');
  for(const e of errors) console.error(' - '+e);
  process.exit(1);
}
console.log('Stage68/70/71/72 passed: hero-first production hierarchy is deterministic; reading content stays left aligned; trust proof and next-step use deliberate 3-column desktop grids; review content is not wrapped in an accidental giant card; and the shared authority cannot globally repaint the page.');