import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(root,relative),value);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const pages=[
  'faq/index.html',
  'terms-conditions/index.html',
  'hu/gyik/index.html',
  'hu/aszf/index.html',
  'de-at/faq/index.html',
  'de-at/agb/index.html'
];
const markers=['data-governance-confidentiality="stage10"','data-booking-contingency="stage11"'];
const manifest={
  migration:'BANHALMI main-element semantic repair — stage 5 continuation',
  executedAt:'2026-08-06T10:05:00+02:00',
  method:'Move the existing closing main tag after the governance and booking sections on localized FAQ and terms pages. Preserve every moved section and all footer/trailing content byte-for-byte.',
  pages:[]
};

for(const relative of pages){
  const before=read(relative);
  if((before.match(/<\/main>/g)||[]).length!==1) throw new Error(`${relative}: expected exactly one closing main`);
  const mainClose=before.indexOf('</main>');
  const footerStart=before.indexOf('<footer class="site-footer">',mainClose);
  if(mainClose<0 || footerStart<0 || mainClose>footerStart) throw new Error(`${relative}: invalid main/footer order`);
  const misplaced=before.slice(mainClose+'</main>'.length,footerStart);
  for(const marker of markers){
    const count=misplaced.split(marker).length-1;
    if(count!==1) throw new Error(`${relative}: expected one misplaced ${marker}, found ${count}`);
  }
  const movedSections=markers.map(marker=>{
    const markerAt=misplaced.indexOf(marker);
    const sectionStart=misplaced.lastIndexOf('<section',markerAt);
    const sectionEnd=misplaced.indexOf('</section>',markerAt);
    if(sectionStart<0 || sectionEnd<0) throw new Error(`${relative}: cannot isolate ${marker}`);
    const html=misplaced.slice(sectionStart,sectionEnd+'</section>'.length);
    return {marker,sha256:sha256(html),bytes:Buffer.byteLength(html)};
  });
  const after=before.slice(0,mainClose)+misplaced+'</main>'+before.slice(footerStart);
  const afterMainClose=after.indexOf('</main>');
  const afterFooter=after.indexOf('<footer class="site-footer">',afterMainClose);
  for(const marker of markers){
    const markerAt=after.indexOf(marker);
    if((after.split(marker).length-1)!==1 || markerAt<0 || markerAt>afterMainClose) throw new Error(`${relative}: ${marker} must move inside main`);
  }
  if(after.slice(0,mainClose)!==before.slice(0,mainClose)) throw new Error(`${relative}: content before old main close changed`);
  if(after.slice(afterFooter)!==before.slice(footerStart)) throw new Error(`${relative}: footer and trailing content changed`);
  write(relative,after);
  manifest.pages.push({
    file:relative,
    beforeSha256:sha256(before),
    afterSha256:sha256(after),
    beforeBytes:Buffer.byteLength(before),
    afterBytes:Buffer.byteLength(after),
    movedSections,
    movedContentPreservedExactly:true,
    footerAndTrailingContentPreservedExactly:true,
    allGovernanceAndBookingContentInsideMain:true
  });
}

const permanentAudit=`import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const errors=[];
const pages=${JSON.stringify(pages,null,2)};
const markers=${JSON.stringify(markers,null,2)};
for(const relative of pages){
  const html=fs.readFileSync(path.join(root,relative),'utf8');
  const mainClose=html.indexOf('</main>');
  const footer=html.indexOf('<footer class="site-footer">',mainClose);
  if(!(mainClose>=0&&footer>mainClose)) errors.push(relative+': main/footer order is invalid');
  for(const marker of markers){
    const markerAt=html.indexOf(marker);
    if((html.split(marker).length-1)!==1) errors.push(relative+': expected one '+marker);
    if(markerAt<0||markerAt>mainClose) errors.push(relative+': '+marker+' must stay inside main');
  }
}
if(errors.length){console.error(errors.join('\\n'));process.exit(1)}
console.log('Stage-twenty-one main semantics audit passed: governance and booking remain inside main on localized FAQ and terms pages.');
`;
write('tools/audit-main-semantics-stage21.mjs',permanentAudit);

let packageJson=read('package.json');
const anchor='node tools/audit-service-framework-stage20.mjs';
if(!packageJson.includes(anchor)) throw new Error('package.json: stage20 audit anchor missing');
if(packageJson.includes('audit-main-semantics-stage21.mjs')) throw new Error('package.json: stage21 audit already registered');
packageJson=packageJson.replace(anchor,anchor+' && node tools/audit-main-semantics-stage21.mjs');
write('package.json',packageJson);

const ecosystem=JSON.parse(read('ecosystem.json'));
ecosystem.servicePageFramework={
  ...(ecosystem.servicePageFramework||{}),
  semanticRepairs:{
    pages,
    rule:'Governance and booking sections remain inside the main content element on service, FAQ and terms pages.'
  }
};
write('ecosystem.json',JSON.stringify(ecosystem,null,2)+'\n');

manifest.permanentAudit='tools/audit-main-semantics-stage21.mjs';
write('docs/content-migrations/2026-08-06-main-semantics-stage5.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Main semantics repair complete: ${pages.length} pages.`);
