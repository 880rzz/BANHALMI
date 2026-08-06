import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(root,relative),value);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const pages={
  'portrait/index.html':{kicker:'Project framework',title:'Fees, delivery, rights and contingency',action:'Open details'},
  'lifestyle/index.html':{kicker:'Project framework',title:'Fees, delivery, rights and contingency',action:'Open details'},
  'event-photography/index.html':{kicker:'Project framework',title:'Fees, delivery, rights and contingency',action:'Open details'},
  'hu/portre/index.html':{kicker:'Projektkeretek',title:'Díjazás, átadás, jogok és rendkívüli helyzetek',action:'Részletek megnyitása'},
  'hu/brand/index.html':{kicker:'Projektkeretek',title:'Díjazás, átadás, jogok és rendkívüli helyzetek',action:'Részletek megnyitása'},
  'hu/rendezvenyfotozas/index.html':{kicker:'Projektkeretek',title:'Díjazás, átadás, jogok és rendkívüli helyzetek',action:'Részletek megnyitása'},
  'de-at/portrait/index.html':{kicker:'Projektrahmen',title:'Honorar, Lieferung, Rechte und Ausfallsicherheit',action:'Details öffnen'},
  'de-at/brand/index.html':{kicker:'Projektrahmen',title:'Honorar, Lieferung, Rechte und Ausfallsicherheit',action:'Details öffnen'},
  'de-at/eventfotografie/index.html':{kicker:'Projektrahmen',title:'Honorar, Lieferung, Rechte und Ausfallsicherheit',action:'Details öffnen'}
};

const sectionMarkers=[
  'data-pricing-licensing="stage7"',
  'data-delivery-system="stage9"',
  'data-data-retention="stage12"',
  'data-image-rights="stage13"',
  'data-governance-confidentiality="stage10"',
  'data-booking-contingency="stage11"'
];

const manifest={
  migration:'BANHALMI service-page project framework — stage 20',
  executedAt:'2026-08-06T09:55:00+02:00',
  method:'Move the six existing project-framework sections into one native, initially closed details disclosure on nine commercial service pages. Preserve every section byte-for-byte, retain order, keep all sections inside main and leave fine-art pages untouched.',
  pages:[]
};

for(const [relative,labels] of Object.entries(pages)){
  const before=read(relative);
  if(before.includes('data-project-framework="stage20"')) throw new Error(`${relative}: project framework already exists`);
  if((before.match(/<\/main>/g)||[]).length!==1) throw new Error(`${relative}: expected exactly one closing main`);

  const pricingStart=before.indexOf('<section class="section-band pricing-licensing-clarity"');
  const mainClose=before.indexOf('</main>');
  const footerStart=before.indexOf('<footer class="site-footer">',mainClose);
  if(pricingStart<0 || mainClose<0 || footerStart<0 || !(pricingStart<mainClose && mainClose<footerStart)){
    throw new Error(`${relative}: expected pricing → main close → footer order`);
  }

  const visibleFramework=before.slice(pricingStart,mainClose);
  const misplacedFramework=before.slice(mainClose+'</main>'.length,footerStart);
  const combinedFramework=visibleFramework+misplacedFramework;
  for(const marker of sectionMarkers){
    const count=combinedFramework.split(marker).length-1;
    if(count!==1) throw new Error(`${relative}: expected one preserved ${marker}, found ${count}`);
  }
  if(!misplacedFramework.includes('data-governance-confidentiality="stage10"') || !misplacedFramework.includes('data-booking-contingency="stage11"')){
    throw new Error(`${relative}: expected governance and booking outside main before migration`);
  }

  const sectionRecords=sectionMarkers.map(marker=>{
    const markerAt=combinedFramework.indexOf(marker);
    const sectionStart=combinedFramework.lastIndexOf('<section',markerAt);
    const sectionEnd=combinedFramework.indexOf('</section>',markerAt);
    if(sectionStart<0 || sectionEnd<0) throw new Error(`${relative}: cannot isolate ${marker}`);
    const html=combinedFramework.slice(sectionStart,sectionEnd+'</section>'.length);
    return {marker,sha256:sha256(html),bytes:Buffer.byteLength(html)};
  });

  const wrapperStart=`<details class="project-framework-drawer" data-project-framework="stage20"><summary><span class="project-framework-summary-copy"><small>${labels.kicker}</small><strong>${labels.title}</strong></span><span class="project-framework-action">${labels.action}</span><span aria-hidden="true" class="project-framework-toggle">+</span></summary><div class="project-framework-content">`;
  const wrapperEnd='</div></details>';
  const after=before.slice(0,pricingStart)+wrapperStart+combinedFramework+wrapperEnd+'</main>'+before.slice(footerStart);

  const drawerStart=after.indexOf('data-project-framework="stage20"');
  const drawerEnd=after.indexOf('</details>',drawerStart);
  const afterMainClose=after.indexOf('</main>',drawerEnd);
  const afterFooter=after.indexOf('<footer class="site-footer">',afterMainClose);
  if(!(drawerStart>=0 && drawerEnd>drawerStart && afterMainClose>drawerEnd && afterFooter>afterMainClose)){
    throw new Error(`${relative}: invalid drawer/main/footer order after migration`);
  }
  if(after.includes('<details class="project-framework-drawer" data-project-framework="stage20" open')){
    throw new Error(`${relative}: framework must be initially closed`);
  }
  for(const marker of sectionMarkers){
    const count=after.split(marker).length-1;
    const markerAt=after.indexOf(marker);
    if(count!==1 || markerAt<drawerStart || markerAt>drawerEnd || markerAt>afterMainClose){
      throw new Error(`${relative}: ${marker} not preserved inside drawer and main`);
    }
  }
  if(after.slice(0,pricingStart)!==before.slice(0,pricingStart)) throw new Error(`${relative}: content before framework changed`);
  if(after.slice(afterFooter)!==before.slice(footerStart)) throw new Error(`${relative}: footer and trailing content changed`);

  write(relative,after);
  manifest.pages.push({
    file:relative,
    beforeSha256:sha256(before),
    afterSha256:sha256(after),
    beforeBytes:Buffer.byteLength(before),
    afterBytes:Buffer.byteLength(after),
    preservedSections:sectionRecords,
    projectFrameworkInitiallyClosed:true,
    allFrameworkSectionsInsideMain:true,
    contentBeforeFrameworkPreservedExactly:true,
    footerAndTrailingContentPreservedExactly:true
  });
}

const cssMarkerStart='/* PROJECT-FRAMEWORK-DRAWER:START */';
const cssMarkerEnd='/* PROJECT-FRAMEWORK-DRAWER:END */';
let css=read('assets/css/style.css');
if(css.includes(cssMarkerStart)) throw new Error('assets/css/style.css: project framework CSS already exists');
const cssBlock=`

${cssMarkerStart}
.project-framework-drawer{
  margin:0;
  border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);
  background:var(--bg);
}
.project-framework-drawer > summary{
  list-style:none;
  cursor:pointer;
  max-width:var(--maxw);
  margin:0 auto;
  padding:30px 28px;
  display:grid;
  grid-template-columns:minmax(0,1fr) auto auto;
  align-items:center;
  gap:18px;
}
.project-framework-drawer > summary::-webkit-details-marker{display:none;}
.project-framework-summary-copy{display:grid;gap:4px;min-width:0;}
.project-framework-summary-copy small{
  color:var(--gold-deep);
  font-size:.76rem;
  font-weight:600;
  letter-spacing:.08em;
  text-transform:uppercase;
}
.project-framework-summary-copy strong{
  color:var(--navy);
  font-family:var(--font-display);
  font-size:clamp(1.1rem,2vw,1.35rem);
  line-height:1.22;
  letter-spacing:-.014em;
}
.project-framework-action{color:var(--muted);font-size:.9rem;white-space:nowrap;}
.project-framework-toggle{
  width:34px;
  height:34px;
  border:1px solid var(--line);
  border-radius:50%;
  display:grid;
  place-items:center;
  color:var(--navy);
  font-size:1.35rem;
  line-height:1;
  transition:transform .2s ease,border-color .2s ease;
}
.project-framework-drawer > summary:hover .project-framework-toggle{border-color:var(--gold-deep);}
.project-framework-drawer[open] > summary{border-bottom:1px solid var(--line);}
.project-framework-drawer[open] .project-framework-toggle{transform:rotate(45deg);}
.project-framework-content > .section-band{border-top:0;}
.project-framework-content > .section-band:nth-child(even){background:var(--bg);}
@media (max-width:720px){
  .project-framework-drawer > summary{grid-template-columns:minmax(0,1fr) auto;padding:24px 28px;}
  .project-framework-action{display:none;}
}
@media (max-width:480px){
  .project-framework-drawer > summary{padding-left:20px;padding-right:20px;gap:12px;}
  .project-framework-summary-copy strong{font-size:1.05rem;}
}
${cssMarkerEnd}`;
css+=cssBlock;
write('assets/css/style.css',css);

const audit=`import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const errors=[];
const pages={
  'portrait/index.html':['Project framework','Fees, delivery, rights and contingency'],
  'lifestyle/index.html':['Project framework','Fees, delivery, rights and contingency'],
  'event-photography/index.html':['Project framework','Fees, delivery, rights and contingency'],
  'hu/portre/index.html':['Projektkeretek','Díjazás, átadás, jogok és rendkívüli helyzetek'],
  'hu/brand/index.html':['Projektkeretek','Díjazás, átadás, jogok és rendkívüli helyzetek'],
  'hu/rendezvenyfotozas/index.html':['Projektkeretek','Díjazás, átadás, jogok és rendkívüli helyzetek'],
  'de-at/portrait/index.html':['Projektrahmen','Honorar, Lieferung, Rechte und Ausfallsicherheit'],
  'de-at/brand/index.html':['Projektrahmen','Honorar, Lieferung, Rechte und Ausfallsicherheit'],
  'de-at/eventfotografie/index.html':['Projektrahmen','Honorar, Lieferung, Rechte und Ausfallsicherheit']
};
const markers=${JSON.stringify(sectionMarkers,null,2)};
for(const [relative,labels] of Object.entries(pages)){
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  if((html.match(/data-project-framework="stage20"/g)||[]).length!==1) errors.push(relative+': framework drawer must appear exactly once');
  const start=html.indexOf('<details class="project-framework-drawer" data-project-framework="stage20">');
  const end=html.indexOf('</details>',start);
  const mainClose=html.indexOf('</main>',end);
  const footer=html.indexOf('<footer class="site-footer">',mainClose);
  if(!(start>=0&&end>start&&mainClose>end&&footer>mainClose)) errors.push(relative+': drawer/main/footer order is invalid');
  const drawer=start>=0&&end>start?html.slice(start,end+'</details>'.length):'';
  if(/<details class="project-framework-drawer"[^>]*\\sopen(?:\\s|>)/.test(drawer)) errors.push(relative+': framework must be initially closed');
  for(const label of labels) if(!drawer.includes(label)) errors.push(relative+': missing localized summary '+label);
  for(const marker of markers){
    if((html.split(marker).length-1)!==1) errors.push(relative+': expected one '+marker);
    if(!drawer.includes(marker)) errors.push(relative+': '+marker+' must be inside framework drawer');
    const markerAt=html.indexOf(marker);
    if(markerAt<start||markerAt>end||markerAt>mainClose) errors.push(relative+': '+marker+' must stay inside drawer and main');
  }
}
for(const relative of ['glamour/index.html','hu/muveszi-fotografia/index.html','de-at/fine-art/index.html']){
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  if(html.includes('data-project-framework="stage20"')) errors.push(relative+': corporate project framework must not appear on fine-art page');
}
const css=fs.readFileSync(path.join(root,'assets/css/style.css'),'utf8');
for(const token of ['PROJECT-FRAMEWORK-DRAWER:START','.project-framework-drawer > summary','.project-framework-content > .section-band','PROJECT-FRAMEWORK-DRAWER:END']) if(!css.includes(token)) errors.push('assets/css/style.css: missing '+token);
if(errors.length){console.error(errors.join('\\n'));process.exit(1)}
console.log('Stage-twenty service framework audit passed: nine commercial service pages use one closed, accessible project-framework drawer inside main.');
`;
write('tools/audit-service-framework-stage20.mjs',audit);

const browserTest=`import { test, expect } from '@playwright/test';

const routes=[
  ['/portrait/','Project framework'],
  ['/lifestyle/','Project framework'],
  ['/event-photography/','Project framework'],
  ['/hu/portre/','Projektkeretek'],
  ['/hu/brand/','Projektkeretek'],
  ['/hu/rendezvenyfotozas/','Projektkeretek'],
  ['/de-at/portrait/','Projektrahmen'],
  ['/de-at/brand/','Projektrahmen'],
  ['/de-at/eventfotografie/','Projektrahmen']
];

for(const [route,label] of routes){
  test(route+' keeps project details available without overwhelming the service page',async({page})=>{
    await page.goto(route);
    const drawer=page.locator('details[data-project-framework="stage20"]');
    await expect(drawer).toHaveCount(1);
    await expect(drawer).not.toHaveAttribute('open','');
    await expect(drawer.locator('summary')).toContainText(label);
    await drawer.locator('summary').click();
    await expect(drawer).toHaveAttribute('open','');
    for(const marker of ['stage7','stage9','stage12','stage13','stage10','stage11']){
      await expect(drawer.locator('[data-pricing-licensing="'+marker+'"], [data-delivery-system="'+marker+'"], [data-data-retention="'+marker+'"], [data-image-rights="'+marker+'"], [data-governance-confidentiality="'+marker+'"], [data-booking-contingency="'+marker+'"]')).toHaveCount(1);
    }
    const insideMain=await drawer.evaluate(node=>Boolean(node.closest('main')));
    expect(insideMain).toBe(true);
  });
}
`;
write('tests/service-framework.spec.mjs',browserTest);

let packageJson=read('package.json');
const auditNeedle='node tools/audit-service-card-decisions-stage19.mjs';
if(!packageJson.includes(auditNeedle)) throw new Error('package.json: stage19 audit anchor missing');
if(packageJson.includes('audit-service-framework-stage20.mjs')) throw new Error('package.json: stage20 audit already registered');
packageJson=packageJson.replace(auditNeedle,auditNeedle+' && node tools/audit-service-framework-stage20.mjs');
write('package.json',packageJson);

for(const auditFile of ['tools/audit-governance-confidentiality-stage10.mjs','tools/audit-booking-contingency-stage11.mjs']){
  let source=read(auditFile);
  if(source.includes('must stay inside main')) continue;
  const anchor=' if(!/third part|harmadik fél|Dritte/.test(section)) errors.push(`${relative}: third-party rule missing`);';
  const bookingAnchor=' if(!/replacement date|új időpont|Ersatztermin/.test(section)) errors.push(`${relative}: replacement-date rule missing`);';
  const selected=source.includes(anchor)?anchor:bookingAnchor;
  if(!source.includes(selected)) throw new Error(`${auditFile}: placement anchor missing`);
  const marker=auditFile.includes('governance')?'data-governance-confidentiality="stage10"':'data-booking-contingency="stage11"';
  const insertion=selected+`\n const marker=html.indexOf('${marker}');\n const mainClose=html.lastIndexOf('</main>');\n if(marker<0 || marker>mainClose) errors.push(\`${'${relative}'}: block must stay inside main\`);`;
  source=source.replace(selected,insertion);
  write(auditFile,source);
}

const ecosystem=JSON.parse(read('ecosystem.json'));
ecosystem.servicePageFramework={
  appliesTo:['Portrait Photography','Brand Photography','C-Level Event Photography'],
  presentation:'Commercial project terms remain fully available in one initially collapsed native details disclosure on each service page.',
  includes:['project fee and licensing','delivery system','file retention','image rights','governance and confidentiality','booking and contingency'],
  accessibility:'Native details and summary semantics support keyboard and assistive-technology access.',
  fineArtBoundary:'Fine Art Photography keeps its separate consent, privacy and artistic-process model rather than inheriting the corporate framework drawer.'
};
write('ecosystem.json',JSON.stringify(ecosystem,null,2)+'\n');

const machineBlock=`<!-- SERVICE-PAGE-FRAMEWORK:START -->
## Service-page project framework
- Portrait, Brand and C-Level Event service pages keep fee, delivery, file-retention, image-rights, confidentiality and contingency information fully available in one initially collapsed native details section.
- Collapsing the framework is a presentation choice to reduce decision fatigue; it does not remove or weaken any contractual, licensing, privacy or governance statement.
- All framework content remains inside the main page content and is readable by users, search engines and assistive technologies.
- Fine Art Photography retains a separate consent-led privacy and artistic-process model.
<!-- SERVICE-PAGE-FRAMEWORK:END -->`;
for(const relative of ['ai.txt','llms.txt','llms-full.txt']){
  let text=read(relative);
  const start='<!-- SERVICE-PAGE-FRAMEWORK:START -->';
  const end='<!-- SERVICE-PAGE-FRAMEWORK:END -->';
  const existing=text.indexOf(start);
  if(existing>=0){
    const close=text.indexOf(end,existing);
    if(close<0) throw new Error(`${relative}: malformed service framework block`);
    text=text.slice(0,existing)+machineBlock+text.slice(close+end.length);
  }else{
    text=machineBlock+'\n\n'+text;
  }
  write(relative,text);
}

manifest.css={file:'assets/css/style.css',markerStart:cssMarkerStart,markerEnd:cssMarkerEnd};
manifest.permanentAudit='tools/audit-service-framework-stage20.mjs';
manifest.browserRegression='tests/service-framework.spec.mjs';
manifest.machineReadable=['ecosystem.json','ai.txt','llms.txt','llms-full.txt'];
write('docs/content-migrations/2026-08-06-service-framework-stage5.json',JSON.stringify(manifest,null,2)+'\n');

console.log(`Service framework migration complete: ${Object.keys(pages).length} pages, six preserved sections per page.`);
