import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(root,relative),value);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const pages={
  'glamour/index.html':{
    route:'/glamour/',
    secondary:'View selected work',
    oldHeader:['Selected work · extended archive','Fine art and visual studies','This selection brings together body studies, portraits, urban observations, architecture and travel work from the artistic archive. Each image opens separately at its original proportion.'],
    newHeader:['Selected personal work','Fine-art portraits and studies of the body','The visible selection focuses on personal work about identity, biography and the body. A broader artistic archive remains available below.'],
    archive:['Extended artistic archive','Urban, architectural and travel studies','Open archive'],
    resourceGroup:'Further resources',
    resources:[
      {role:'press',label:'Press',url:'https://www.banhalmi.art/press.html'},
      {role:'blog',label:'Blog',url:'https://blog.banhalmi.art/?lang=en-GB'}
    ]
  },
  'hu/muveszi-fotografia/index.html':{
    route:'/hu/muveszi-fotografia/',
    secondary:'Válogatott munkák megtekintése',
    oldHeader:['Válogatott munkák · bővített archívum','Művészeti és vizuális tanulmányok','Bővített válogatás az alkotói archívumból: testtanulmányok, portrék, városi megfigyelések, építészet és utazás. A képek eredeti arányban jelennek meg, és mindegyik középre nyíló nagyításban tekinthető meg.'],
    newHeader:['Válogatott személyes munkák','Művészi portrék és testtanulmányok','A látható válogatás az identitásról, az élettörténetről és a testről szóló személyes munkákra összpontosít. A tágabb művészeti archívum külön nyitható meg alatta.'],
    archive:['Bővített művészeti archívum','Városi, építészeti és utazási tanulmányok','Archívum megnyitása'],
    resourceGroup:'További tartalmak',
    resources:[
      {role:'press',label:'Sajtó',url:'https://www.banhalmi.art/hu/press.html'},
      {role:'blog',label:'Blog',url:'https://blog.banhalmi.art'}
    ]
  },
  'de-at/fine-art/index.html':{
    route:'/de-at/fine-art/',
    secondary:'Ausgewählte Arbeiten ansehen',
    oldHeader:['Ausgewählte Arbeiten · erweitertes Archiv','Künstlerische und visuelle Studien','Die Auswahl verbindet Körperstudien, Porträts, urbane Beobachtungen, Architektur und Reisebilder aus dem künstlerischen Archiv. Jedes Werk lässt sich separat im ursprünglichen Format öffnen.'],
    newHeader:['Ausgewählte persönliche Arbeiten','Fine-Art-Porträts und Studien des Körpers','Die sichtbare Auswahl konzentriert sich auf persönliche Arbeiten über Identität, Biografie und den Körper. Ein breiteres Kunstarchiv lässt sich darunter separat öffnen.'],
    archive:['Erweitertes Kunstarchiv','Urbane, architektonische und Reise-Studien','Archiv öffnen'],
    resourceGroup:'Weitere Inhalte',
    resources:[
      {role:'press',label:'Presse',url:'https://www.banhalmi.art/de-at/press.html'},
      {role:'blog',label:'Blog',url:'https://blog.banhalmi.art/?lang=de'}
    ]
  }
};

const manifest={
  migration:'BANHALMI Fine Art private-client journey — stage 23',
  executedAt:'2026-08-06T10:42:00+02:00',
  method:'Give the consent-led private commission the primary hero path, retain the exact existing Press and Blog group inside the archive-reference section, keep the personal Fine Art selection visible, and move only the existing contiguous data-archive-extended figures into one initially closed native archive disclosure. Every gallery figure remains byte-identical and in original order.',
  pages:[]
};

function replaceExactly(source,oldValue,newValue,label){
  const count=source.split(oldValue).length-1;
  if(count!==1) throw new Error(`${label}: expected one exact match, found ${count}`);
  return source.replace(oldValue,newValue);
}

for(const [relative,config] of Object.entries(pages)){
  const before=read(relative);
  if(before.includes('data-fine-art-private-journey="stage23"')) throw new Error(`${relative}: stage23 already exists`);
  if(before.includes('data-fine-art-archive="stage23"')) throw new Error(`${relative}: stage23 archive already exists`);
  if(before.includes('id="fine-art-selected-work"') || before.includes('id="private-conversation"')) throw new Error(`${relative}: stage23 IDs already exist`);

  const heroStart=before.indexOf('<section class="hero service-hero service-editorial-hero">');
  const heroEnd=before.indexOf('</section>',heroStart);
  if(heroStart<0 || heroEnd<0) throw new Error(`${relative}: hero not found`);
  const hero=before.slice(heroStart,heroEnd+'</section>'.length);
  const resourceMatch=hero.match(/<div class="hero-actions fine-art-resource-actions reveal"[\s\S]*?<\/div>/);
  if(!resourceMatch) throw new Error(`${relative}: Fine Art resource group not found in hero`);
  const resourceGroup=resourceMatch[0];
  const resourceLinks=[...resourceGroup.matchAll(/<a class="([^"]+)" data-fine-art-resource="(press|blog)" href="([^"]+)" target="_blank" rel="noopener noreferrer" aria-label="[^"]+">([^<]+)<\/a>/g)];
  if(resourceLinks.length!==2) throw new Error(`${relative}: expected two exact resource links`);
  resourceLinks.forEach((match,index)=>{
    const expected=config.resources[index];
    if(match[2]!==expected.role || match[3]!==expected.url || match[4]!==expected.label) throw new Error(`${relative}: resource contract mismatch at ${index+1}`);
  });
  if(!resourceGroup.includes(`aria-label="${config.resourceGroup}"`)) throw new Error(`${relative}: localized resource group label mismatch`);

  const ctaMatch=before.match(/<section class="cta-band"><div class="wrap"><h2>([\s\S]*?)<\/h2><a class="btn btn-primary" href="([^"]+)">([^<]+)<\/a><\/div><\/section>/);
  if(!ctaMatch) throw new Error(`${relative}: private CTA not found`);
  const privateCta=ctaMatch[0];
  const privateCtaHeading=ctaMatch[1];
  const privateCtaHref=ctaMatch[2];
  const privateCtaLabel=ctaMatch[3];

  const figurePos=hero.indexOf('<figure class="service-hero-image');
  if(figurePos<0) throw new Error(`${relative}: hero image not found`);
  const heroWithoutResources=hero.replace(resourceGroup,'');
  const newFigurePos=heroWithoutResources.indexOf('<figure class="service-hero-image');
  const privateActions=`<div class="hero-actions fine-art-private-actions reveal" data-fine-art-private-journey="stage23"><a class="btn btn-primary" href="#private-conversation">${privateCtaLabel}</a><a class="btn-link" href="#fine-art-selected-work">${config.secondary}</a></div>`;
  const newHero=heroWithoutResources.slice(0,newFigurePos)+privateActions+heroWithoutResources.slice(newFigurePos);

  const galleryStart=before.indexOf('<section class="service-gallery-section">');
  const galleryEnd=before.indexOf('</section>',galleryStart);
  if(galleryStart<0 || galleryEnd<0) throw new Error(`${relative}: gallery section not found`);
  const gallerySection=before.slice(galleryStart,galleryEnd+'</section>'.length);
  const gridOpen='<div class="collage-gallery lightbox-gallery" data-universal-gallery="">';
  const gridStart=gallerySection.indexOf(gridOpen);
  const gridSuffix='</div></div></section>';
  const gridEnd=gallerySection.lastIndexOf(gridSuffix);
  if(gridStart<0 || gridEnd<0 || gridEnd<=gridStart) throw new Error(`${relative}: gallery grid boundaries not found`);
  const galleryPrefix=gallerySection.slice(0,gridStart);
  const galleryFiguresHtml=gallerySection.slice(gridStart+gridOpen.length,gridEnd);
  const figures=[...galleryFiguresHtml.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map(match=>match[0]);
  if(!figures.length) throw new Error(`${relative}: gallery figures not found`);
  const residue=galleryFiguresHtml.replace(/<figure\b[\s\S]*?<\/figure>/g,'');
  if(residue.trim()) throw new Error(`${relative}: non-figure content found inside gallery grid`);
  const firstExtended=figures.findIndex(figure=>figure.includes('data-archive-extended=""'));
  if(firstExtended<=0 || firstExtended>=figures.length) throw new Error(`${relative}: extended archive split point is invalid`);
  const coreFigures=figures.slice(0,firstExtended);
  const extendedFigures=figures.slice(firstExtended);
  if(coreFigures.some(figure=>figure.includes('data-archive-extended=""'))) throw new Error(`${relative}: core selection contains extended archive item`);
  if(extendedFigures.some(figure=>!figure.includes('data-archive-extended=""'))) throw new Error(`${relative}: extended archive is not contiguous`);

  let newGalleryPrefix=galleryPrefix;
  newGalleryPrefix=replaceExactly(newGalleryPrefix,'<section class="service-gallery-section">','<section class="service-gallery-section" id="fine-art-selected-work">',`${relative}: gallery section ID`);
  config.oldHeader.forEach((oldValue,index)=>{
    newGalleryPrefix=replaceExactly(newGalleryPrefix,oldValue,config.newHeader[index],`${relative}: gallery header ${index+1}`);
  });
  const archiveDetails=`<details class="fine-art-archive-drawer" data-fine-art-archive="stage23"><summary><span class="fine-art-archive-summary-copy"><small>${config.archive[0]}</small><strong>${config.archive[1]}</strong></span><span class="fine-art-archive-action">${config.archive[2]}</span><span aria-hidden="true" class="fine-art-archive-toggle">+</span></summary><div class="fine-art-archive-content"><div class="collage-gallery lightbox-gallery fine-art-extended-grid" data-universal-gallery="">${extendedFigures.join('')}</div></div></details>`;
  const newGallerySection=newGalleryPrefix+gridOpen+coreFigures.join('')+'</div>'+archiveDetails+'</div></section>';

  const archiveStart=before.indexOf('<section class="section-band" id="archive-references">');
  const archiveEnd=before.indexOf('</section>',archiveStart);
  if(archiveStart<0 || archiveEnd<0) throw new Error(`${relative}: archive-reference section not found`);
  const archiveSection=before.slice(archiveStart,archiveEnd+'</section>'.length);
  const cardGridStart=archiveSection.indexOf('<div class="card-grid">');
  const cardGridEnd=archiveSection.indexOf('</div>',cardGridStart);
  if(cardGridStart<0 || cardGridEnd<0) throw new Error(`${relative}: archive card grid not found`);
  if(archiveSection.includes('fine-art-resource-actions')) throw new Error(`${relative}: resource group already exists in archive section`);
  const newArchiveSection=archiveSection.slice(0,cardGridEnd+'</div>'.length)+resourceGroup+archiveSection.slice(cardGridEnd+'</div>'.length);

  const newPrivateCta=privateCta.replace('<section class="cta-band">','<section class="cta-band" id="private-conversation">');
  let after=before;
  after=replaceExactly(after,hero,newHero,`${relative}: hero replacement`);
  after=replaceExactly(after,gallerySection,newGallerySection,`${relative}: gallery replacement`);
  after=replaceExactly(after,archiveSection,newArchiveSection,`${relative}: archive resource move`);
  after=replaceExactly(after,privateCta,newPrivateCta,`${relative}: private CTA ID`);

  const heroAfter=after.slice(after.indexOf('<section class="hero service-hero service-editorial-hero">'),after.indexOf('</section>',after.indexOf('<section class="hero service-hero service-editorial-hero">'))+'</section>'.length);
  if(heroAfter.includes('data-fine-art-resource=')) throw new Error(`${relative}: Press or Blog remains in hero`);
  if(!heroAfter.includes('href="#private-conversation"') || !heroAfter.includes('href="#fine-art-selected-work"')) throw new Error(`${relative}: private hero anchors missing`);
  const archiveAfterStart=after.indexOf('<section class="section-band" id="archive-references">');
  const archiveAfterEnd=after.indexOf('</section>',archiveAfterStart);
  const archiveAfter=after.slice(archiveAfterStart,archiveAfterEnd+'</section>'.length);
  if((archiveAfter.split(resourceGroup).length-1)!==1) throw new Error(`${relative}: resource group not preserved exactly in archive`);
  const detailsStart=after.indexOf('<details class="fine-art-archive-drawer" data-fine-art-archive="stage23">');
  const detailsEnd=after.indexOf('</details>',detailsStart);
  if(detailsStart<0 || detailsEnd<0) throw new Error(`${relative}: archive details missing`);
  const detailsHtml=after.slice(detailsStart,detailsEnd+'</details>'.length);
  if(/<details class="fine-art-archive-drawer"[^>]*\sopen(?:\s|>)/.test(detailsHtml)) throw new Error(`${relative}: archive details must be initially closed`);
  if((detailsHtml.match(/data-archive-extended=""/g)||[]).length!==extendedFigures.length) throw new Error(`${relative}: extended archive figure count changed`);
  if((after.slice(after.indexOf('id="fine-art-selected-work"'),detailsStart).match(/data-archive-extended=""/g)||[]).length!==0) throw new Error(`${relative}: extended archive item remains visible outside drawer`);
  if((after.match(/id="fine-art-selected-work"/g)||[]).length!==1 || (after.match(/id="private-conversation"/g)||[]).length!==1) throw new Error(`${relative}: stage23 ID count invalid`);

  write(relative,after);
  manifest.pages.push({
    file:relative,
    route:config.route,
    beforeSha256:sha256(before),
    afterSha256:sha256(after),
    beforeBytes:Buffer.byteLength(before),
    afterBytes:Buffer.byteLength(after),
    privateCta:{heading:privateCtaHeading,href:privateCtaHref,label:privateCtaLabel,sha256:sha256(privateCta)},
    resourceGroup:{ariaLabel:config.resourceGroup,sha256:sha256(resourceGroup),bytes:Buffer.byteLength(resourceGroup),resources:config.resources},
    gallery:{
      totalFigures:figures.length,
      coreFigures:coreFigures.length,
      extendedFigures:extendedFigures.length,
      ageRestrictedFigures:figures.filter(figure=>figure.includes('data-age-restricted="true"')).length,
      originalFigureHashes:figures.map(figure=>sha256(figure)),
      allFiguresPreservedByteForByte:true,
      originalOrderPreserved:true
    },
    heroPrimaryTarget:'#private-conversation',
    heroSecondaryTarget:'#fine-art-selected-work',
    archiveInitiallyClosed:true
  });
}

const resourceAudit=`// Permanent regression guard for the localized Fine Art press and blog buttons.
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const failures=[];
const pages=${JSON.stringify(Object.entries(pages).map(([file,config])=>({file,labels:config.resources.map(item=>item.label),urls:config.resources.map(item=>item.url),group:config.resourceGroup})),null,2)};

for(const page of pages){
  const html=fs.readFileSync(path.join(root,page.file),'utf8');
  const blocks=html.match(/<div class="hero-actions fine-art-resource-actions reveal"[\\s\\S]*?<\\/div>/g)||[];
  if(blocks.length!==1){
    failures.push(page.file+': expected one fine-art resource button group, found '+blocks.length);
    continue;
  }
  const block=blocks[0];
  if(!block.includes('aria-label="'+page.group+'"')) failures.push(page.file+': localized group label missing');
  const links=[...block.matchAll(/<a class="([^"]+)" data-fine-art-resource="(press|blog)" href="([^"]+)" target="_blank" rel="noopener noreferrer" aria-label="[^"]+">([^<]+)<\\/a>/g)];
  if(links.length!==2){
    failures.push(page.file+': expected two resource buttons, found '+links.length);
  }else{
    const expectedRoles=['press','blog'];
    const expectedClasses=['btn btn-primary','btn btn-ghost'];
    links.forEach((match,index)=>{
      if(match[1]!==expectedClasses[index]) failures.push(page.file+': wrong button style for '+expectedRoles[index]);
      if(match[2]!==expectedRoles[index]) failures.push(page.file+': wrong resource order at '+(index+1));
      if(match[3]!==page.urls[index]) failures.push(page.file+': wrong '+expectedRoles[index]+' URL '+match[3]);
      if(match[4]!==page.labels[index]) failures.push(page.file+': wrong localized label '+match[4]);
    });
  }
  const heroStart=html.indexOf('<section class="hero service-hero service-editorial-hero">');
  const heroEnd=html.indexOf('</section>',heroStart);
  const hero=html.slice(heroStart,heroEnd+'</section>'.length);
  if(hero.includes('data-fine-art-resource=')) failures.push(page.file+': archive resource buttons must not remain in hero');
  const archiveStart=html.indexOf('<section class="section-band" id="archive-references">');
  const archiveEnd=html.indexOf('</section>',archiveStart);
  const archive=html.slice(archiveStart,archiveEnd+'</section>'.length);
  const cardGridEnd=archive.indexOf('</div>',archive.indexOf('<div class="card-grid">'));
  const blockPos=archive.indexOf(block);
  if(archiveStart<0||archiveEnd<0||cardGridEnd<0||blockPos<cardGridEnd) failures.push(page.file+': resource buttons must follow archive cards inside archive-references');
}

if(failures.length){console.error(failures.join('\\n'));process.exit(1)}
console.log('Fine-art press and blog CTA audit passed in English, Hungarian and German at the archive-reference location.');
`;
write('tools/audit-fine-art-press-blog-ctas.mjs',resourceAudit);

const privateJourneyAudit=`import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const errors=[];
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/content-migrations/2026-08-06-fine-art-private-journey-stage7.json'),'utf8'));
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const pageConfig=${JSON.stringify(Object.fromEntries(Object.entries(pages).map(([file,config])=>[file,{secondary:config.secondary,newHeader:config.newHeader,archive:config.archive}])),null,2)};
for(const record of manifest.pages){
  const relative=record.file;
  const config=pageConfig[relative];
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  const heroStart=html.indexOf('<section class="hero service-hero service-editorial-hero">');
  const heroEnd=html.indexOf('</section>',heroStart);
  const hero=html.slice(heroStart,heroEnd+'</section>'.length);
  if((hero.match(/data-fine-art-private-journey="stage23"/g)||[]).length!==1) errors.push(relative+': private hero actions must appear exactly once');
  if(!hero.includes('href="#private-conversation"')) errors.push(relative+': hero primary anchor missing');
  if(!hero.includes('href="#fine-art-selected-work"')) errors.push(relative+': hero selected-work anchor missing');
  if(!hero.includes(record.privateCta.label)) errors.push(relative+': existing private CTA label not reused in hero');
  if(!hero.includes(config.secondary)) errors.push(relative+': localized selected-work label missing');
  if(hero.includes('data-fine-art-resource=')) errors.push(relative+': Press or Blog remains in hero');
  if((html.match(/id="fine-art-selected-work"/g)||[]).length!==1) errors.push(relative+': selected-work ID must appear exactly once');
  if((html.match(/id="private-conversation"/g)||[]).length!==1) errors.push(relative+': private-conversation ID must appear exactly once');
  for(const value of config.newHeader) if(!html.includes(value)) errors.push(relative+': new gallery framing missing '+value);
  const detailsMatch=html.match(/<details class="fine-art-archive-drawer" data-fine-art-archive="stage23">[\\s\\S]*?<\\/details>/);
  if(!detailsMatch){errors.push(relative+': extended archive drawer missing');continue;}
  const details=detailsMatch[0];
  if(/<details class="fine-art-archive-drawer"[^>]*\\sopen(?:\\s|>)/.test(details)) errors.push(relative+': archive drawer must be initially closed');
  for(const value of config.archive) if(!details.includes(value)) errors.push(relative+': localized archive summary missing '+value);
  const allFigures=[...html.matchAll(/<figure class="editorial-image gallery-lightbox-item[\\s\\S]*?<\\/figure>/g)].map(match=>match[0]);
  const hashes=allFigures.map(sha256);
  if(JSON.stringify(hashes)!==JSON.stringify(record.gallery.originalFigureHashes)) errors.push(relative+': gallery figure bytes or order changed');
  if(allFigures.length!==record.gallery.totalFigures) errors.push(relative+': total gallery figure count changed');
  const extended=[...details.matchAll(/<figure class="editorial-image gallery-lightbox-item[\\s\\S]*?<\\/figure>/g)].map(match=>match[0]);
  if(extended.length!==record.gallery.extendedFigures) errors.push(relative+': extended archive figure count changed');
  if(extended.some(figure=>!figure.includes('data-archive-extended=""'))) errors.push(relative+': non-archive figure entered extended drawer');
  const galleryStart=html.indexOf('id="fine-art-selected-work"');
  const detailsStart=html.indexOf('data-fine-art-archive="stage23"',galleryStart);
  if((html.slice(galleryStart,detailsStart).match(/data-archive-extended=""/g)||[]).length) errors.push(relative+': extended archive figure remains in visible core selection');
  const ageRestricted=(html.match(/data-age-restricted="true"/g)||[]).length;
  const agePreview=(html.match(/class="age-restricted-preview"/g)||[]).length;
  if(agePreview!==record.gallery.ageRestrictedFigures) errors.push(relative+': age-restricted preview count changed');
  if(ageRestricted<agePreview*2) errors.push(relative+': age-restricted item/button contract weakened');
  const archiveStart=html.indexOf('<section class="section-band" id="archive-references">');
  const archiveEnd=html.indexOf('</section>',archiveStart);
  const archive=html.slice(archiveStart,archiveEnd+'</section>'.length);
  const resourceMatch=archive.match(/<div class="hero-actions fine-art-resource-actions reveal"[\\s\\S]*?<\\/div>/);
  if(!resourceMatch||sha256(resourceMatch[0])!==record.resourceGroup.sha256) errors.push(relative+': Press/Blog group was not preserved byte-for-byte');
  const sequence=[html.indexOf('data-fine-art-private-journey="stage23"'),html.indexOf('id="fine-art-selected-work"'),html.indexOf('data-fine-art-archive="stage23"'),archiveStart,html.indexOf('id="reviews"'),html.indexOf('id="private-conversation"'),html.indexOf('</main>')];
  if(sequence.some(value=>value<0)||sequence.some((value,index)=>index>0&&value<=sequence[index-1])) errors.push(relative+': private-client journey order is invalid');
}
const css=fs.readFileSync(path.join(root,'assets/css/style.css'),'utf8');
for(const token of ['FINE-ART-PRIVATE-JOURNEY:START','.fine-art-private-actions','.fine-art-archive-drawer > summary','.fine-art-extended-grid','FINE-ART-PRIVATE-JOURNEY:END']) if(!css.includes(token)) errors.push('assets/css/style.css: missing '+token);
if(errors.length){console.error(errors.join('\\n'));process.exit(1)}
console.log('Stage-twenty-three Fine Art private journey audit passed: three localized pages preserve every image, age gate and archive resource while prioritizing the private conversation.');
`;
write('tools/audit-fine-art-private-journey-stage23.mjs',privateJourneyAudit);

const browserTest=`import { test, expect } from '@playwright/test';

const routes=${JSON.stringify(Object.values(pages).map(config=>config.route),null,2)};
for(const route of routes){
  test(route+' keeps the private Fine Art journey focused and complete',async({page})=>{
    await page.addInitScript(()=>{
      const now=Date.now();
      localStorage.setItem('banhalmi_consent_v3',JSON.stringify({choice:'essential',version:'3.0',savedAt:now,expiresAt:now+180*24*60*60*1000}));
    });
    await page.goto(route);
    const hero=page.locator('[data-fine-art-private-journey="stage23"]');
    await expect(hero).toHaveCount(1);
    await expect(page.locator('.hero.service-hero [data-fine-art-resource]')).toHaveCount(0);
    await expect(page.locator('#archive-references [data-fine-art-resource]')).toHaveCount(2);
    await hero.locator('a[href="#fine-art-selected-work"]').click({force:true});
    await expect(page).toHaveURL(/#fine-art-selected-work$/);
    await expect(page.locator('#fine-art-selected-work')).toBeVisible();
    await page.goto(route);
    await page.locator('[data-fine-art-private-journey="stage23"] a[href="#private-conversation"]').click({force:true});
    await expect(page).toHaveURL(/#private-conversation$/);
    await expect(page.locator('#private-conversation')).toBeVisible();
    await page.goto(route);
    const drawer=page.locator('details[data-fine-art-archive="stage23"]');
    await expect(drawer).toHaveCount(1);
    await expect(drawer).not.toHaveAttribute('open','');
    const extendedCount=await page.locator('[data-archive-extended]').count();
    expect(extendedCount).toBeGreaterThan(0);
    await expect(drawer.locator('[data-archive-extended]')).toHaveCount(extendedCount);
    const restrictedCount=await page.locator('figure[data-age-restricted="true"]').count();
    expect(restrictedCount).toBeGreaterThan(0);
    await expect(page.locator('figure[data-age-restricted="true"] img.age-restricted-preview')).toHaveCount(restrictedCount);
    const coreButton=page.locator('#fine-art-selected-work > .wrap > .collage-gallery > figure:not([data-age-restricted]) button[data-lightbox-src]').first();
    await coreButton.click({force:true});
    await expect(page.locator('[data-universal-lightbox]')).toHaveClass(/open/);
    await page.locator('.universal-lightbox-close').click({force:true});
    await drawer.locator('summary').click({force:true});
    await expect(drawer).toHaveAttribute('open','');
    const archiveButton=drawer.locator('figure:not([data-age-restricted]) button[data-lightbox-src]').first();
    await archiveButton.click({force:true});
    await expect(page.locator('[data-universal-lightbox]')).toHaveClass(/open/);
    await expect(page.locator('[data-universal-lightbox]')).toHaveAttribute('aria-hidden','false');
  });
}
`;
write('tests/fine-art-private-journey.spec.mjs',browserTest);

const cssStart='/* FINE-ART-PRIVATE-JOURNEY:START */';
const cssEnd='/* FINE-ART-PRIVATE-JOURNEY:END */';
let css=read('assets/css/style.css');
if(css.includes(cssStart)) throw new Error('assets/css/style.css: stage23 CSS already exists');
css+=`\n\n${cssStart}\n.fine-art-private-actions{margin:28px 0 32px;}\n#fine-art-selected-work,#private-conversation{scroll-margin-top:92px;}\n.fine-art-archive-drawer{margin:42px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);}\n.fine-art-archive-drawer > summary{list-style:none;cursor:pointer;padding:25px 0;display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:18px;}\n.fine-art-archive-drawer > summary::-webkit-details-marker{display:none;}\n.fine-art-archive-summary-copy{display:grid;gap:4px;min-width:0;}\n.fine-art-archive-summary-copy small{color:var(--gold-deep);font-size:.76rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;}\n.fine-art-archive-summary-copy strong{color:var(--navy);font-family:var(--font-display);font-size:clamp(1.08rem,2vw,1.34rem);line-height:1.22;letter-spacing:-.014em;}\n.fine-art-archive-action{color:var(--muted);font-size:.9rem;white-space:nowrap;}\n.fine-art-archive-toggle{width:34px;height:34px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;color:var(--navy);font-size:1.35rem;line-height:1;transition:transform .2s ease,border-color .2s ease;}\n.fine-art-archive-drawer > summary:hover .fine-art-archive-toggle{border-color:var(--gold-deep);}\n.fine-art-archive-drawer[open] > summary{border-bottom:1px solid var(--line);}\n.fine-art-archive-drawer[open] .fine-art-archive-toggle{transform:rotate(45deg);}\n.fine-art-archive-content{padding:34px 0 8px;}\n.fine-art-extended-grid{margin-top:0;}\n#archive-references .fine-art-resource-actions{margin-top:30px;}\n@media (max-width:720px){.fine-art-archive-drawer > summary{grid-template-columns:minmax(0,1fr) auto;}.fine-art-archive-action{display:none;}}\n@media (max-width:640px){.fine-art-private-actions{align-items:flex-start;margin-top:24px;margin-bottom:28px;}}\n${cssEnd}`;
write('assets/css/style.css',css);

let packageJson=read('package.json');
const packageAnchor='node tools/audit-service-conversion-stage22.mjs';
if(!packageJson.includes(packageAnchor)) throw new Error('package.json: stage22 audit anchor missing');
if(packageJson.includes('audit-fine-art-private-journey-stage23.mjs')) throw new Error('package.json: stage23 audit already registered');
packageJson=packageJson.replace(packageAnchor,packageAnchor+' && node tools/audit-fine-art-private-journey-stage23.mjs');
write('package.json',packageJson);

const ecosystem=JSON.parse(read('ecosystem.json'));
ecosystem.fineArtPrivateJourney={
  appliesTo:'Fine Art Photography',
  principle:'A consent-led private commission is the primary service path; public archive resources remain available as supporting context rather than replacing the enquiry route.',
  heroChoice:{primary:'Anchor to the existing private-conversation CTA',secondary:'Anchor to selected personal work'},
  visibleSelection:'Fine-art portraits and studies of identity, biography and the body remain visible.',
  extendedArchive:'Existing urban, architectural and travel studies remain complete, searchable and lightbox-enabled inside one initially closed native disclosure.',
  archiveResources:['localized Press archive','localized BANHALMI journal'],
  safeguards:['clear boundaries','consent','privacy','joint image selection','18+ self-declaration gate for intimate previews'],
  commercialFrameworkBoundary:'Fine Art retains its own privacy and consent path rather than inheriting the corporate three-way selector or project-framework drawer.'
};
write('ecosystem.json',JSON.stringify(ecosystem,null,2)+'\n');

const machineBlock=`<!-- FINE-ART-PRIVATE-JOURNEY:START -->
## Fine Art private-client journey
- Fine Art Photography is a separate consent-led service path for personal work about identity, biography and the body.
- The hero first offers the existing private-conversation route and a link to selected personal work.
- Fine-art portraits and body studies remain visible; the broader urban, architectural and travel archive remains complete inside an initially collapsed native archive section.
- Every original gallery image, description, order, 18+ preview and lightbox function is preserved.
- Localized Press and Blog links remain exact supporting archive resources inside the archive-reference section, not substitutes for private contact.
- Publication is never automatic; boundaries, consent, privacy and image selection remain part of the process.
<!-- FINE-ART-PRIVATE-JOURNEY:END -->`;
for(const relative of ['ai.txt','llms.txt','llms-full.txt']){
  let text=read(relative);
  const start='<!-- FINE-ART-PRIVATE-JOURNEY:START -->';
  const end='<!-- FINE-ART-PRIVATE-JOURNEY:END -->';
  const existing=text.indexOf(start);
  if(existing>=0){
    const close=text.indexOf(end,existing);
    if(close<0) throw new Error(`${relative}: malformed Fine Art journey block`);
    text=text.slice(0,existing)+machineBlock+text.slice(close+end.length);
  }else{
    text=machineBlock+'\n\n'+text;
  }
  write(relative,text);
}

manifest.css={file:'assets/css/style.css',markerStart:cssStart,markerEnd:cssEnd};
manifest.updatedAudit='tools/audit-fine-art-press-blog-ctas.mjs';
manifest.permanentAudit='tools/audit-fine-art-private-journey-stage23.mjs';
manifest.browserRegression='tests/fine-art-private-journey.spec.mjs';
manifest.machineReadable=['ecosystem.json','ai.txt','llms.txt','llms-full.txt'];
write('docs/content-migrations/2026-08-06-fine-art-private-journey-stage7.json',JSON.stringify(manifest,null,2)+'\n');

console.log(`Fine Art private journey migration complete: ${Object.keys(pages).length} localized pages.`);
