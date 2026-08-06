import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(root,relative),value);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const pages={
  'portrait/index.html':{secondary:'View selected work'},
  'lifestyle/index.html':{secondary:'View selected work'},
  'event-photography/index.html':{secondary:'View selected work'},
  'hu/portre/index.html':{secondary:'Válogatott munkák megtekintése'},
  'hu/brand/index.html':{secondary:'Válogatott munkák megtekintése'},
  'hu/rendezvenyfotozas/index.html':{secondary:'Válogatott munkák megtekintése'},
  'de-at/portrait/index.html':{secondary:'Ausgewählte Arbeiten ansehen'},
  'de-at/brand/index.html':{secondary:'Ausgewählte Arbeiten ansehen'},
  'de-at/eventfotografie/index.html':{secondary:'Ausgewählte Arbeiten ansehen'}
};

const manifest={
  migration:'BANHALMI service-page conversion path — stage 22',
  executedAt:'2026-08-06T10:22:00+02:00',
  method:'Remove the duplicate one-button CTA below each commercial service gallery, reuse its service-specific button label as a non-forcing hero anchor to the existing three-way selector, add a second hero anchor to selected work, and preserve all gallery, review, trust, selector, lightbox and project-framework content unchanged.',
  pages:[]
};

for(const [relative,labels] of Object.entries(pages)){
  const before=read(relative);
  if(before.includes('data-service-hero-actions="stage22"')) throw new Error(`${relative}: stage22 hero actions already exist`);
  if(before.includes('id="selected-work"') || before.includes('id="next-step"')) throw new Error(`${relative}: stage22 anchor IDs already exist`);

  const ctaMatches=[...before.matchAll(/<section class="cta-band">[\s\S]*?<\/section>/g)];
  if(ctaMatches.length!==1) throw new Error(`${relative}: expected one duplicate CTA band, found ${ctaMatches.length}`);
  const oldCta=ctaMatches[0][0];
  const ctaHeading=(oldCta.match(/<h2>([\s\S]*?)<\/h2>/)||[])[1];
  const ctaButton=(oldCta.match(/<a class="btn btn-primary" href="([^"]+)">([\s\S]*?)<\/a>/)||[]);
  if(!ctaHeading || !ctaButton[1] || !ctaButton[2]) throw new Error(`${relative}: cannot parse existing CTA contract`);

  const heroStart=before.indexOf('<section class="hero service-hero service-editorial-hero">');
  const heroEnd=before.indexOf('</section>',heroStart);
  if(heroStart<0 || heroEnd<0) throw new Error(`${relative}: service hero not found`);
  const hero=before.slice(heroStart,heroEnd+'</section>'.length);
  const figureStart=hero.indexOf('<figure class="service-hero-image');
  if(figureStart<0) throw new Error(`${relative}: hero figure not found`);
  const actions=`<div class="hero-actions service-hero-actions" data-service-hero-actions="stage22"><a class="btn btn-primary" href="#next-step">${ctaButton[2]}</a><a class="btn-link" href="#selected-work">${labels.secondary}</a></div>`;
  const newHero=hero.slice(0,figureStart)+actions+hero.slice(figureStart);

  let after=before.replace(hero,newHero);
  const galleryOpening='<section class="service-gallery-section">';
  if((after.split(galleryOpening).length-1)!==1) throw new Error(`${relative}: expected one service gallery opening`);
  after=after.replace(galleryOpening,'<section class="service-gallery-section" id="selected-work">');

  const selectorOpening='<section class="section-band next-step-selector" data-conversion-path="stage5">';
  if((after.split(selectorOpening).length-1)!==1) throw new Error(`${relative}: expected one conversion selector opening`);
  after=after.replace(selectorOpening,'<section class="section-band next-step-selector" data-conversion-path="stage5" id="next-step">');

  if((after.split(oldCta).length-1)!==1) throw new Error(`${relative}: duplicate CTA moved unexpectedly`);
  after=after.replace(oldCta,'');

  const positions={
    heroActions:after.indexOf('data-service-hero-actions="stage22"'),
    selectedWork:after.indexOf('id="selected-work"'),
    reviews:after.indexOf('data-third-party-reviews="true"'),
    trust:after.indexOf('data-trust-proof="stage6"'),
    nextStep:after.indexOf('id="next-step"'),
    framework:after.indexOf('data-project-framework="stage20"'),
    mainClose:after.indexOf('</main>')
  };
  const ordered=[positions.heroActions,positions.selectedWork,positions.reviews,positions.trust,positions.nextStep,positions.framework,positions.mainClose];
  if(ordered.some(value=>value<0) || ordered.some((value,index)=>index>0&&value<=ordered[index-1])){
    throw new Error(`${relative}: service conversion sequence is invalid: ${JSON.stringify(positions)}`);
  }
  if((after.match(/<section class="cta-band">/g)||[]).length!==0) throw new Error(`${relative}: duplicate CTA band remains`);
  if((after.match(/data-service-hero-actions="stage22"/g)||[]).length!==1) throw new Error(`${relative}: hero action count changed`);
  if((after.match(/id="selected-work"/g)||[]).length!==1 || (after.match(/id="next-step"/g)||[]).length!==1) throw new Error(`${relative}: anchor ID count changed`);

  const beforeWithoutCta=before.replace(oldCta,'');
  let afterNormalised=after.replace(actions,'');
  afterNormalised=afterNormalised.replace(' class="service-gallery-section" id="selected-work"',' class="service-gallery-section"');
  afterNormalised=afterNormalised.replace(' data-conversion-path="stage5" id="next-step"',' data-conversion-path="stage5"');
  if(afterNormalised!==beforeWithoutCta) throw new Error(`${relative}: content outside the intended conversion changes was modified`);

  write(relative,after);
  manifest.pages.push({
    file:relative,
    beforeSha256:sha256(before),
    afterSha256:sha256(after),
    beforeBytes:Buffer.byteLength(before),
    afterBytes:Buffer.byteLength(after),
    removedDuplicateCta:{
      sha256:sha256(oldCta),
      bytes:Buffer.byteLength(oldCta),
      heading:ctaHeading,
      originalHref:ctaButton[1],
      buttonLabel:ctaButton[2]
    },
    heroPrimaryLabelPreservedFromRemovedCta:true,
    heroPrimaryTarget:'#next-step',
    heroSecondaryLabel:labels.secondary,
    heroSecondaryTarget:'#selected-work',
    galleryReviewsTrustSelectorFrameworkPreservedExactly:true
  });
}

const cssStart='/* SERVICE-CONVERSION-PATH:START */';
const cssEnd='/* SERVICE-CONVERSION-PATH:END */';
let css=read('assets/css/style.css');
if(css.includes(cssStart)) throw new Error('assets/css/style.css: stage22 CSS already exists');
css+=`\n\n${cssStart}\n.service-hero-actions{margin:28px 0 32px;}\n#selected-work,#next-step{scroll-margin-top:92px;}\n@media (max-width:640px){.service-hero-actions{align-items:flex-start;margin-top:24px;margin-bottom:28px;}}\n${cssEnd}`;
write('assets/css/style.css',css);

const audit=`import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const errors=[];
const pages=${JSON.stringify(pages,null,2)};
for(const [relative,labels] of Object.entries(pages)){
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  if((html.match(/data-service-hero-actions="stage22"/g)||[]).length!==1) errors.push(relative+': stage22 hero actions must appear exactly once');
  const actions=(html.match(/<div class="hero-actions service-hero-actions"[\\s\\S]*?<\\/div>/)||[''])[0];
  if(!actions.includes('href="#next-step"')) errors.push(relative+': hero primary action must target #next-step');
  if(!actions.includes('href="#selected-work"')) errors.push(relative+': hero secondary action must target #selected-work');
  if(!actions.includes(labels.secondary)) errors.push(relative+': localized selected-work label missing');
  if((html.match(/id="selected-work"/g)||[]).length!==1) errors.push(relative+': selected-work ID must appear exactly once');
  if((html.match(/id="next-step"/g)||[]).length!==1) errors.push(relative+': next-step ID must appear exactly once');
  if((html.match(/<section class="cta-band">/g)||[]).length!==0) errors.push(relative+': duplicate one-button CTA band must not remain');
  const positions=[
    html.indexOf('data-service-hero-actions="stage22"'),
    html.indexOf('id="selected-work"'),
    html.indexOf('data-third-party-reviews="true"'),
    html.indexOf('data-trust-proof="stage6"'),
    html.indexOf('id="next-step"'),
    html.indexOf('data-project-framework="stage20"'),
    html.indexOf('</main>')
  ];
  if(positions.some(value=>value<0)||positions.some((value,index)=>index>0&&value<=positions[index-1])) errors.push(relative+': hero → work → reviews → trust → selector → framework order is invalid');
  const selector=(html.match(/<section class="section-band next-step-selector"[\\s\\S]*?<\\/section>/)||[''])[0];
  if((selector.match(/<article class="card">/g)||[]).length!==3) errors.push(relative+': the final selector must retain exactly three choices');
}
for(const relative of ['glamour/index.html','hu/muveszi-fotografia/index.html','de-at/fine-art/index.html']){
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  if(html.includes('data-service-hero-actions="stage22"')) errors.push(relative+': commercial stage22 actions must not appear on fine-art pages');
}
const css=fs.readFileSync(path.join(root,'assets/css/style.css'),'utf8');
for(const token of ['SERVICE-CONVERSION-PATH:START','.service-hero-actions','#selected-work,#next-step','SERVICE-CONVERSION-PATH:END']) if(!css.includes(token)) errors.push('assets/css/style.css: missing '+token);
if(errors.length){console.error(errors.join('\\n'));process.exit(1)}
console.log('Stage-twenty-two service conversion audit passed: nine pages use one early anchor pair and one final three-way selector without duplicate CTA bands.');
`;
write('tools/audit-service-conversion-stage22.mjs',audit);

const browser=`import { test, expect } from '@playwright/test';

const routes=${JSON.stringify(Object.keys(pages),null,2)}.map(file=>file==='index.html'?'/':'/'+file.replace(/index\\.html$/,''));
for(const route of routes){
  test(route+' exposes one coherent service conversion path',async({page})=>{
    await page.goto(route);
    const actions=page.locator('[data-service-hero-actions="stage22"]');
    await expect(actions).toHaveCount(1);
    await expect(page.locator('section.cta-band')).toHaveCount(0);
    await expect(page.locator('#selected-work')).toHaveCount(1);
    await expect(page.locator('#next-step')).toHaveCount(1);
    await actions.locator('a[href="#next-step"]').click();
    await expect(page).toHaveURL(/#next-step$/);
    await expect(page.locator('#next-step')).toBeVisible();
    await page.goto(route);
    await page.locator('[data-service-hero-actions="stage22"] a[href="#selected-work"]').click();
    await expect(page).toHaveURL(/#selected-work$/);
    await expect(page.locator('#selected-work')).toBeVisible();
    await expect(page.locator('#next-step article.card')).toHaveCount(3);
  });
}
`;
write('tests/service-conversion.spec.mjs',browser);

let packageJson=read('package.json');
const packageAnchor='node tools/audit-main-semantics-stage21.mjs';
if(!packageJson.includes(packageAnchor)) throw new Error('package.json: stage21 audit anchor missing');
if(packageJson.includes('audit-service-conversion-stage22.mjs')) throw new Error('package.json: stage22 audit already registered');
packageJson=packageJson.replace(packageAnchor,packageAnchor+' && node tools/audit-service-conversion-stage22.mjs');
write('package.json',packageJson);

const ecosystem=JSON.parse(read('ecosystem.json'));
ecosystem.serviceConversionPath={
  appliesTo:['Portrait Photography','Brand Photography','C-Level Event Photography'],
  earlyChoice:{
    primary:'Service-specific invitation linking to the final three-way next-step selector.',
    secondary:'Anchor link to selected work on the same page.'
  },
  evidenceSequence:['selected work','client reviews','verified professional context'],
  finalDecision:['configure a non-binding package','send a message','book a 30-minute video call'],
  duplicateCtaRemoved:true,
  principle:'The page invites orientation early, provides evidence before commitment and asks for one final decision only.'
};
write('ecosystem.json',JSON.stringify(ecosystem,null,2)+'\n');

const machineBlock=`<!-- SERVICE-CONVERSION-PATH:START -->
## Commercial service conversion path
- Portrait, Brand and C-Level Event pages offer two early orientation links: the service-specific conversation label opens the final next-step selector, while the second link jumps to selected work.
- The reader sees selected work, client reviews and verified professional context before the final decision block.
- The final selector retains three routes: configure a non-binding package, send a message, or book a 30-minute video call.
- The former one-button CTA below each gallery was removed because it duplicated and pre-empted the more precise three-way selector.
- Fine Art Photography retains its separate consent-led enquiry path.
<!-- SERVICE-CONVERSION-PATH:END -->`;
for(const relative of ['ai.txt','llms.txt','llms-full.txt']){
  let text=read(relative);
  const start='<!-- SERVICE-CONVERSION-PATH:START -->';
  const end='<!-- SERVICE-CONVERSION-PATH:END -->';
  const existing=text.indexOf(start);
  if(existing>=0){
    const close=text.indexOf(end,existing);
    if(close<0) throw new Error(`${relative}: malformed service conversion block`);
    text=text.slice(0,existing)+machineBlock+text.slice(close+end.length);
  }else{
    const anchor='<!-- SERVICE-PAGE-FRAMEWORK:END -->';
    const index=text.indexOf(anchor);
    if(index>=0){
      const position=index+anchor.length;
      text=text.slice(0,position)+'\n\n'+machineBlock+text.slice(position);
    }else{
      text=machineBlock+'\n\n'+text;
    }
  }
  write(relative,text);
}

manifest.css={file:'assets/css/style.css',markerStart:cssStart,markerEnd:cssEnd};
manifest.permanentAudit='tools/audit-service-conversion-stage22.mjs';
manifest.browserRegression='tests/service-conversion.spec.mjs';
manifest.machineReadable=['ecosystem.json','ai.txt','llms.txt','llms-full.txt'];
write('docs/content-migrations/2026-08-06-service-conversion-stage6.json',JSON.stringify(manifest,null,2)+'\n');

console.log(`Service conversion migration complete: ${Object.keys(pages).length} pages.`);
