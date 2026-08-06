import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(root,relative),value);

const pages={
  'index.html':{
    heading:'One visual discipline, four clear ways to work together.',
    oldFacts:['Four principal services:','Headshots, employer-branding imagery, press portraits and visual brand strategy','AmCham Austria','One practice, two forms','Memory, body, biography','does the image feel inhabited, or just arranged?'],
    newFacts:['Four principal services:','Executive Portraiture, Brand Photography, C-Level Event Photography and Fine Art Photography','Headshots, employer-branding imagery, press portraits and visual brand strategy','As a member of AmCham Austria','memory, the body and biography','does the image carry real presence, or is it only arranged?'],
    block:'<section class="section-band client-decision-bridge" aria-labelledby="client-decision-title"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">What this means in practice</span><h2 id="client-decision-title">One visual discipline, four clear ways to work together.</h2></div><div class="prose reveal structural-prose"><p><strong>Four principal services:</strong> Executive Portraiture, Brand Photography, C-Level Event Photography and Fine Art Photography. Headshots, employer-branding imagery, press portraits and visual brand strategy are tools within these areas—not extra categories you have to decode.</p><p>For a commission, I look for the image that makes a leader or organisation understandable before the first handshake. In autonomous series I slow down around memory, the body and biography. The purposes differ, but the test is the same: does the image carry real presence, or is it only arranged?</p><p>As a member of AmCham Austria, BANHALMI works within an international business community where credibility, professional presence and long-term trust matter in practice—not merely in presentation. <a href="https://amcham.at/members-list/" rel="external">View the public member list ↗</a></p><a class="btn-link" href="#services">Choose the relevant starting point ↓</a></div></div></section>'
  },
  'hu/index.html':{
    heading:'Egy vizuális szemlélet, négy egyértelmű együttműködési terület.',
    oldFacts:['Négy fő szolgáltatás:','Az üzleti portré, a munkáltatói márkaépítés, a sajtóportré és a vizuális márkastratégia','AmCham Austria','Egy gyakorlat, két forma','Emlékekből, testből és élettörténetekből','valódi jelenlétet látunk, vagy csupán gondosan elrendezett formát?'],
    newFacts:['Négy fő szolgáltatás:','vezetői portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia','Az üzleti portré, a munkáltatói márkaépítés, a sajtóportré és a vizuális márkastratégia','Az AmCham Austria tagjaként','emlékezet, a test és az élettörténet','valódi jelenlétet hordoz-e a kép, vagy csak gondosan elrendezett forma?'],
    block:'<section class="section-band client-decision-bridge" aria-labelledby="client-decision-title"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">Mit jelent ez a gyakorlatban?</span><h2 id="client-decision-title">Egy vizuális szemlélet, négy egyértelmű együttműködési terület.</h2></div><div class="prose reveal structural-prose"><p><strong>Négy fő szolgáltatás:</strong> vezetői portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia. Az üzleti portré, a munkáltatói márkaépítés, a sajtóportré és a vizuális márkastratégia egymást kiegészítő eszközök. A négy fő területen belül együtt építenek következetes képi rendszert, nem egymással versengő szolgáltatásként jelennek meg.</p><p>Amikor megbízásra dolgozom, azt a képet keresem, amely már az első kézfogás előtt érthetővé tesz egy vezetőt vagy egy szervezetet. A saját sorozatokban az emlékezet, a test és az élettörténet körül lassítom le a folyamatot. A cél eltérő, a mérce ugyanaz: valódi jelenlétet hordoz-e a kép, vagy csak gondosan elrendezett forma?</p><p>Az AmCham Austria tagjaként a BANHALMI olyan nemzetközi üzleti közösségben dolgozik, ahol a hitelesség, a professzionális jelenlét és a hosszú távú bizalom nem csupán kommunikációs ígéret, hanem mindennapi elvárás. <a href="https://amcham.at/members-list/" rel="external">Az AmCham Austria nyilvános taglistája ↗</a></p><a class="btn-link" href="#services">A megfelelő kiindulópont kiválasztása ↓</a></div></div></section>'
  },
  'de-at/index.html':{
    heading:'Eine visuelle Disziplin, vier klare Formen der Zusammenarbeit.',
    oldFacts:['Vier Hauptleistungen:','Headshots, Employer-Branding-Bilder, Presseporträts und visuelle Markenstrategie','AmCham Austria','Eine Praxis, zwei Formen','Erinnerung, Körper, Biografie','Ist im Bild Gegenwart — oder nur Anordnung?'],
    newFacts:['Vier Hauptleistungen:','Executive-Porträts, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie','Headshots, Employer-Branding-Bilder, Presseporträts und visuelle Markenstrategie','Als Mitglied von AmCham Austria','Erinnerung, Körper und Biografie','Trägt das Bild wirkliche Präsenz, oder ist es nur arrangiert?'],
    block:'<section class="section-band client-decision-bridge" aria-labelledby="client-decision-title"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">Was das in der Praxis bedeutet</span><h2 id="client-decision-title">Eine visuelle Disziplin, vier klare Formen der Zusammenarbeit.</h2></div><div class="prose reveal structural-prose"><p><strong>Vier Hauptleistungen:</strong> Executive-Porträts, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie. Headshots, Employer-Branding-Bilder, Presseporträts und visuelle Markenstrategie sind Werkzeuge innerhalb dieser Bereiche — keine zusätzlichen Kategorien, die zuerst entschlüsselt werden müssen.</p><p>Bei einem Auftrag suche ich das Bild, das eine Führungspersönlichkeit oder Organisation bereits vor dem ersten Händedruck verständlich macht. In freien Serien werde ich bei Erinnerung, Körper und Biografie langsamer. Die Zwecke unterscheiden sich, der Maßstab bleibt derselbe: Trägt das Bild wirkliche Präsenz, oder ist es nur arrangiert?</p><p>Als Mitglied von AmCham Austria arbeitet BANHALMI in einer internationalen Wirtschaftsgemeinschaft, in der Glaubwürdigkeit, professioneller Auftritt und langfristiges Vertrauen praktische Anforderungen sind — nicht nur Teil der Außendarstellung. <a href="https://amcham.at/members-list/" rel="external">Öffentliche Mitgliederliste ansehen ↗</a></p><a class="btn-link" href="#services">Den passenden Einstieg wählen ↓</a></div></div></section>'
  }
};

const manifest={
  migration:'BANHALMI homepage decision hierarchy — stage 3',
  executedAt:'2026-08-06T08:18:00+02:00',
  method:'Replace the two consecutive explanatory sections between the preserved presence thesis and the four service cards with one client-oriented decision bridge. Store the complete previous and replacement region and prove exact preservation outside the target range.',
  pages:[]
};

for(const [file,config] of Object.entries(pages)){
  const before=read(file);
  const startMarker='<section class="section-band strategic-positioning-summary">';
  const endMarker='<section id="services">';
  const start=before.indexOf(startMarker);
  const end=before.indexOf(endMarker,start);
  if(start<0||end<0||end<=start) throw new Error(`${file}: target hierarchy region not found`);
  if(before.indexOf(startMarker,start+1)>=0) throw new Error(`${file}: duplicate strategic summary found`);
  const oldRegion=before.slice(start,end);
  for(const fact of config.oldFacts){if(!oldRegion.includes(fact))throw new Error(`${file}: old fact missing before migration: ${fact}`)}
  for(const fact of config.newFacts){if(!config.block.includes(fact))throw new Error(`${file}: new block does not preserve fact: ${fact}`)}
  const after=before.slice(0,start)+config.block+'\n'+before.slice(end);
  if(after.includes('strategic-positioning-summary'))throw new Error(`${file}: old summary class remains`);
  if((after.match(/client-decision-bridge/g)||[]).length!==1)throw new Error(`${file}: expected one client decision bridge`);
  if(!after.includes(`<h2 id="client-decision-title">${config.heading}</h2>`))throw new Error(`${file}: new heading missing`);
  const afterStart=after.indexOf(config.block);
  const reconstructed=after.slice(0,afterStart)+after.slice(afterStart+config.block.length+1);
  const originalOutside=before.slice(0,start)+before.slice(end);
  if(reconstructed!==originalOutside)throw new Error(`${file}: content outside target range changed`);
  write(file,after);
  manifest.pages.push({
    file,
    beforeSha256:sha256(before),
    afterSha256:sha256(after),
    beforeBytes:Buffer.byteLength(before),
    afterBytes:Buffer.byteLength(after),
    oldRegion,
    newRegion:config.block,
    nonTargetContentPreservedExactly:true,
    preservedConcepts:config.newFacts
  });
}

const machineBlock=`<!-- HOMEPAGE-DECISION-PATH:START -->
## Homepage decision path
- The professional homepage sequence is intentional: current promise; lifelong presence thesis; one client decision bridge; four principal services; oeuvre evidence; artistic archive; client reviews; enquiry.
- The client decision bridge replaces two repetitive explanatory sections without removing their meaning.
- Four principal services remain: Portrait Photography, Brand Photography, C-Level Event Photography and Fine Art Photography.
- Headshots, employer branding, press portraits and visual brand strategy are supporting capabilities inside those four areas, not competing principal services.
- Commissioned and autonomous work have different purposes but share the same visual discipline and test of authentic presence.
- AmCham Austria membership supplies documented international business-network context; it is not presented as a client endorsement.
<!-- HOMEPAGE-DECISION-PATH:END -->`;

for(const file of ['ai.txt','llms.txt','llms-full.txt']){
  let text=read(file);
  const start='<!-- HOMEPAGE-DECISION-PATH:START -->';
  const end='<!-- HOMEPAGE-DECISION-PATH:END -->';
  const existingStart=text.indexOf(start);
  if(existingStart>=0){
    const existingEnd=text.indexOf(end,existingStart);
    if(existingEnd<0)throw new Error(`${file}: malformed homepage decision block`);
    text=text.slice(0,existingStart)+machineBlock+text.slice(existingEnd+end.length);
  }else{
    const presenceEnd='<!-- PRESENCE-THESIS:END -->';
    const insertAt=text.indexOf(presenceEnd);
    if(insertAt>=0){
      const pos=insertAt+presenceEnd.length;
      text=text.slice(0,pos)+'\n\n'+machineBlock+text.slice(pos);
    }else{
      text=machineBlock+'\n\n'+text;
    }
  }
  write(file,text);
}

const ecosystem=JSON.parse(read('ecosystem.json'));
ecosystem.homepageDecisionPath={
  canonicalPage:'https://www.norbertbanhalmi.com/',
  sequence:['current professional promise','lifelong presence thesis','client decision bridge','four principal services','oeuvre evidence','artistic archive','client reviews','enquiry'],
  principalServices:['Portrait Photography','Brand Photography','C-Level Event Photography','Fine Art Photography'],
  supportingCapabilities:['Headshots','Employer branding','Press portraits','Visual brand strategy'],
  interpretation:'The homepage uses one client-oriented bridge instead of two repetitive explanatory sections. Commissioned and autonomous work retain distinct purposes while sharing one visual discipline and an inquiry into authentic presence.',
  businessNetworkContext:{name:'AmCham Austria',relationship:'membership',interpretation:'International business-network context, not client endorsement.'}
};
write('ecosystem.json',JSON.stringify(ecosystem,null,2)+'\n');

let stage3=read('tools/audit-homepage-positioning-stage3.mjs');
stage3=stage3.replace("if(!html.includes('strategic-positioning-summary')) errors.push(`${relative}: service hierarchy summary missing`);","if(!html.includes('client-decision-bridge')) errors.push(`${relative}: client decision bridge missing`);\n if(html.includes('strategic-positioning-summary')) errors.push(`${relative}: obsolete strategic summary remains`);");
write('tools/audit-homepage-positioning-stage3.mjs',stage3);

let stage17=read('tools/audit-presence-thesis-stage17.mjs');
stage17=stage17.replace("const strategyIndex=html.indexOf('class=\"section-band strategic-positioning-summary\"');","const strategyIndex=html.indexOf('class=\"section-band client-decision-bridge\"');");
stage17=stage17.replace('presence thesis must precede strategic summary','presence thesis must precede client decision bridge');
write('tools/audit-presence-thesis-stage17.mjs',stage17);

const permanentAudit=`import fs from 'node:fs';

const errors=[];
const pages={
  'index.html':{heading:'One visual discipline, four clear ways to work together.',cta:'Choose the relevant starting point ↓',facts:['Four principal services:','Executive Portraiture, Brand Photography, C-Level Event Photography and Fine Art Photography','Headshots, employer-branding imagery, press portraits and visual brand strategy','As a member of AmCham Austria','memory, the body and biography']},
  'hu/index.html':{heading:'Egy vizuális szemlélet, négy egyértelmű együttműködési terület.',cta:'A megfelelő kiindulópont kiválasztása ↓',facts:['Négy fő szolgáltatás:','vezetői portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia','Az üzleti portré, a munkáltatói márkaépítés, a sajtóportré és a vizuális márkastratégia egymást kiegészítő eszközök.','Az AmCham Austria tagjaként','emlékezet, a test és az élettörténet']},
  'de-at/index.html':{heading:'Eine visuelle Disziplin, vier klare Formen der Zusammenarbeit.',cta:'Den passenden Einstieg wählen ↓',facts:['Vier Hauptleistungen:','Executive-Porträts, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie','Headshots, Employer-Branding-Bilder, Presseporträts und visuelle Markenstrategie','Als Mitglied von AmCham Austria','Erinnerung, Körper und Biografie']}
};
for(const [file,expected] of Object.entries(pages)){
  const html=fs.readFileSync(file,'utf8');
  const count=(html.match(/class=\"section-band client-decision-bridge\"/g)||[]).length;
  if(count!==1)errors.push(file+': expected one client decision bridge, found '+count);
  if(html.includes('strategic-positioning-summary'))errors.push(file+': obsolete strategic summary remains');
  if(!html.includes('<h2 id=\"client-decision-title\">'+expected.heading+'</h2>'))errors.push(file+': decision heading missing');
  if(!html.includes('href=\"#services\">'+expected.cta+'</a>'))errors.push(file+': service decision CTA missing');
  for(const fact of expected.facts)if(!html.includes(fact))errors.push(file+': preserved hierarchy fact missing '+fact);
  const presence=html.indexOf('class=\"section-band presence-thesis\"');
  const bridge=html.indexOf('class=\"section-band client-decision-bridge\"');
  const services=html.indexOf('<section id=\"services\">');
  if(!(presence>=0&&bridge>presence&&services>bridge))errors.push(file+': homepage decision order is incorrect');
  for(const old of ['One practice, two forms','Egy gyakorlat, két forma','Eine Praxis, zwei Formen'])if(html.includes(old))errors.push(file+': repetitive legacy heading remains '+old);
}
const ecosystem=JSON.parse(fs.readFileSync('ecosystem.json','utf8'));
if(ecosystem.homepageDecisionPath?.sequence?.length!==8)errors.push('ecosystem.json: decision sequence missing');
if(ecosystem.homepageDecisionPath?.principalServices?.length!==4)errors.push('ecosystem.json: principal services missing');
for(const file of ['ai.txt','llms.txt','llms-full.txt']){
  const text=fs.readFileSync(file,'utf8');
  if((text.split('<!-- HOMEPAGE-DECISION-PATH:START -->').length-1)!==1)errors.push(file+': homepage decision block missing or duplicated');
}
const manifest=JSON.parse(fs.readFileSync('docs/content-migrations/2026-08-06-homepage-hierarchy-stage3.json','utf8'));
if(manifest.pages?.length!==3||manifest.pages.some(page=>page.nonTargetContentPreservedExactly!==true||!page.oldRegion||!page.newRegion))errors.push('migration manifest: preservation evidence incomplete');
if(errors.length){console.error(errors.join(String.fromCharCode(10)));process.exit(1)}
console.log('Homepage hierarchy stage-three audit passed: one decision bridge, four services and exact non-target preservation are aligned.');
`;
write('tools/audit-homepage-hierarchy-stage18.mjs',permanentAudit);

const pkg=JSON.parse(read('package.json'));
if(!pkg.scripts.audit.includes('audit-homepage-hierarchy-stage18.mjs'))pkg.scripts.audit+=' && node tools/audit-homepage-hierarchy-stage18.mjs';
write('package.json',JSON.stringify(pkg,null,2)+'\n');

fs.mkdirSync(path.join(root,'docs/content-migrations'),{recursive:true});
write('docs/content-migrations/2026-08-06-homepage-hierarchy-stage3.json',JSON.stringify(manifest,null,2)+'\n');

for(const temporary of ['scripts/_migrate-homepage-hierarchy-stage3.mjs','.github/workflows/_homepage-hierarchy-stage3.yml']){
  const full=path.join(root,temporary);
  if(fs.existsSync(full))fs.unlinkSync(full);
}

console.log('Homepage hierarchy migration applied to three languages; temporary writer files removed.');
