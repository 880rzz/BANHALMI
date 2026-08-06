import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(root,relative),value);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const pages={
  'index.html':[
    {
      key:'portrait',href:'/portrait/',title:'Portrait Photography',cta:'See portrait work ›',
      old:'Executive, professional and lifestyle portraits—from a precise headshot to a complete visual position for a leader in public life.',
      next:'For leaders, founders and experts who need one credible visual identity across LinkedIn, company websites, press, speaking and internal communication—from a precise headshot to a complete public portrait system.'
    },
    {
      key:'brand',href:'/lifestyle/',title:'Brand Photography',cta:'See brand photography ›',
      old:'Founders, teams, workplaces and campaigns photographed as parts of the same recognisable organisation—not as unrelated image sets.',
      next:'For organisations that need founders, teams, workplaces and campaigns to read as one recognisable brand across recruitment, sales, media and corporate communication—not as unrelated image sets.'
    },
    {
      key:'event',href:'/event-photography/',title:'C-Level Event Photography',cta:'See event coverage ›',
      old:'Board meetings, leadership summits, conferences and diplomatic settings photographed quietly, with attention to the relationships and decisions in the room.',
      next:'For board meetings, leadership summits, conferences and diplomatic settings where discreet coverage must preserve the room’s relationships, decisions and atmosphere for press, internal communication and the institutional archive.'
    },
    {
      key:'fineArt',href:'/glamour/',title:'Fine Art Photography',cta:'Explore fine-art work ›',
      old:'Fine-art portraiture and nude art created through careful direction, exploring identity, biography and the body without spectacle.',
      next:'For people seeking an author-led personal work rather than a conventional portrait: fine-art portraiture and nude art exploring identity, biography and the body through respectful direction, consent and discretion.'
    }
  ],
  'hu/index.html':[
    {
      key:'portrait',href:'/hu/portre/',title:'Portréfotózás',cta:'Portrémunkák megtekintése ›',
      old:'Vezetői, üzleti és életmódportrék az egységes profilképtől egy vezető teljes nyilvános vizuális megjelenéséig.',
      next:'Vezetőknek, alapítóknak és szakértőknek, akiknek a LinkedInen, a vállalati weboldalon, a sajtóban, előadásokon és a belső kommunikációban is hiteles, egységes képi jelenlétre van szükségük — a pontos profilképtől a teljes nyilvános portrérendszerig.'
    },
    {
      key:'brand',href:'/hu/brand/',title:'Brandfotózás',cta:'Brandfotózás megtekintése ›',
      old:'Vezetők, csapatok, munkahelyzetek és kampányok egyetlen felismerhető képi rendszerben, egymást erősítő felvételekkel.',
      next:'Szervezeteknek, amelyek azt szeretnék, hogy a vezetők, csapatok, munkakörnyezetek és kampányok a toborzásban, az értékesítésben, a médiában és a vállalati kommunikációban is egyetlen felismerhető márkaként jelenjenek meg — ne különálló képsorozatokként.'
    },
    {
      key:'event',href:'/hu/rendezvenyfotozas/',title:'Felsővezetői eseményfotózás',cta:'Eseményfotózás megtekintése ›',
      old:'Vezetői ülések, vezetői konferenciák, diplomáciai és vállalati események diszkréten fényképezve, a teremben lévő kapcsolatokra és döntésekre figyelve.',
      next:'Vezetői ülésekhez, konferenciákhoz, csúcstalálkozókhoz és diplomáciai helyzetekhez, ahol a diszkrét dokumentáció a sajtó, a belső kommunikáció és az intézményi archívum számára is megőrzi a kapcsolatokat, a döntéseket és a terem hangulatát.'
    },
    {
      key:'fineArt',href:'/hu/muveszi-fotografia/',title:'Művészi fotográfia',cta:'Művészi munkák megtekintése ›',
      old:'Művészi portrék és aktfotók gondos vezetéssel, az identitásról, az élettörténetről és a testről — látványossá tétel nélkül.',
      next:'Azoknak, akik hagyományos portré helyett szerzői személyes művet keresnek: művészi portré és aktfotográfia az identitásról, az élettörténetről és a testről, tiszteletteljes vezetéssel, beleegyezéssel és diszkrécióval.'
    }
  ],
  'de-at/index.html':[
    {
      key:'portrait',href:'/de-at/portrait/',title:'Porträtfotografie',cta:'Porträtarbeiten ansehen ›',
      old:'Executive-, Business- und Lifestyle-Porträts – vom präzisen Headshot bis zur vollständigen öffentlichen visuellen Positionierung einer Führungspersönlichkeit.',
      next:'Für Führungskräfte, Gründer:innen und Expert:innen, die auf LinkedIn, der Unternehmenswebsite, in Presse, Vorträgen und interner Kommunikation eine glaubwürdige, konsistente visuelle Identität benötigen — vom präzisen Headshot bis zum vollständigen öffentlichen Porträtsystem.'
    },
    {
      key:'brand',href:'/de-at/brand/',title:'Brandfotografie',cta:'Brandfotografie ansehen ›',
      old:'Gründer:innen, Teams, Arbeitswelten und Kampagnen als Teile eines wiedererkennbaren Unternehmens — nicht als voneinander unabhängige Bildserien.',
      next:'Für Organisationen, deren Führungskräfte, Teams, Arbeitswelten und Kampagnen in Recruiting, Vertrieb, Medien und Unternehmenskommunikation als eine wiedererkennbare Marke erscheinen sollen — nicht als voneinander unabhängige Bildserien.'
    },
    {
      key:'event',href:'/de-at/eventfotografie/',title:'C-Level-Eventfotografie',cta:'Eventreportagen ansehen ›',
      old:'Board Meetings, Leadership Summits, Konferenzen und diplomatische Situationen ruhig fotografiert, mit Blick auf die Beziehungen und Entscheidungen im Raum.',
      next:'Für Board Meetings, Leadership Summits, Konferenzen und diplomatische Situationen, in denen diskrete Dokumentation Beziehungen, Entscheidungen und Atmosphäre für Presse, interne Kommunikation und institutionelles Archiv bewahren muss.'
    },
    {
      key:'fineArt',href:'/de-at/fine-art/',title:'Fine-Art-Fotografie',cta:'Fine-Art-Arbeiten ansehen ›',
      old:'Fine-Art-Porträts und künstlerischer Akt mit sorgfältiger Führung — über Identität, Biografie und Körper, ohne den Menschen zum Spektakel zu machen.',
      next:'Für Menschen, die statt eines konventionellen Porträts ein autorengeführtes persönliches Werk suchen: Fine-Art-Porträts und künstlerischer Akt über Identität, Biografie und Körper, mit respektvoller Führung, Einwilligung und Diskretion.'
    }
  ]
};

const manifest={
  migration:'BANHALMI service-card decision value — stage 4',
  executedAt:'2026-08-06T08:48:00+02:00',
  method:'Rewrite only the paragraph inside each of the four existing service cards. Preserve every card href, title, CTA, order and HTML wrapper exactly; store old and replacement descriptions and verify placeholder-normalised page identity.',
  pages:[]
};

for(const [file,cards] of Object.entries(pages)){
  const before=read(file);
  let after=before;
  const records=[];
  for(const card of cards){
    const oldCard=`<a class="card reveal" href="${card.href}"><h3>${card.title}</h3><p>${card.old}</p><span class="more">${card.cta}</span></a>`;
    const newCard=`<a class="card reveal" href="${card.href}"><h3>${card.title}</h3><p>${card.next}</p><span class="more">${card.cta}</span></a>`;
    const matches=after.split(oldCard).length-1;
    if(matches!==1)throw new Error(`${file}: expected one exact ${card.key} card, found ${matches}`);
    after=after.replace(oldCard,newCard);
    records.push({key:card.key,href:card.href,title:card.title,cta:card.cta,oldDescription:card.old,newDescription:card.next});
  }
  const serviceSection=(after.match(/<section id="services">[\s\S]*?<\/section>/)||[''])[0];
  if((serviceSection.match(/<a class="card reveal"/g)||[]).length!==4)throw new Error(`${file}: service card count changed`);
  for(const card of cards){
    for(const token of [`href="${card.href}"`,`<h3>${card.title}</h3>`,`<span class="more">${card.cta}</span>`]){
      if((serviceSection.split(token).length-1)!==1)throw new Error(`${file}: preserved structure token missing or duplicated: ${token}`);
    }
  }
  let beforeNormalised=before;
  let afterNormalised=after;
  cards.forEach((card,index)=>{
    const placeholder=`__SERVICE_DESCRIPTION_${index}__`;
    beforeNormalised=beforeNormalised.replace(card.old,placeholder);
    afterNormalised=afterNormalised.replace(card.next,placeholder);
  });
  if(beforeNormalised!==afterNormalised)throw new Error(`${file}: content outside service descriptions changed`);
  write(file,after);
  manifest.pages.push({file,beforeSha256:sha256(before),afterSha256:sha256(after),beforeBytes:Buffer.byteLength(before),afterBytes:Buffer.byteLength(after),cards:records,nonDescriptionContentPreservedExactly:true});
}

const services=JSON.parse(read('services.json'));
services.dateModified='2026-08-06T08:48:00+02:00';
const serviceDecisionData={
  1:{description:'Portrait photography for leaders, founders and experts who need a credible and reusable visual identity across LinkedIn, corporate websites, press, speaking and internal communication.',audienceType:'Leaders, founders and experts',serviceOutput:'A reusable portrait system, from a precise headshot to a complete public visual identity.'},
  2:{description:'Brand photography for organisations that need founders, teams, workplaces and campaigns to communicate as one recognisable brand across recruitment, sales, media and corporate communication.',audienceType:'Organisations, leadership teams and employer-branding teams',serviceOutput:'A coherent organisational image library for recruitment, sales, media and corporate communication.'},
  3:{description:'Discreet C-level event photography for board meetings, leadership summits, conferences and diplomatic settings, preserving relationships, decisions and atmosphere for press, internal communication and institutional archives.',audienceType:'Boards, leadership teams, conference organisers and institutions',serviceOutput:'Discreet editorial and institutional event coverage for immediate and long-term use.'},
  4:{description:'Author-led fine-art portraiture and nude art for people seeking a personal artistic work about identity, biography and the body, created with respectful direction, consent and discretion.',audienceType:'Private individuals seeking author-led fine-art portraiture or nude art',serviceOutput:'A personal fine-art portrait or nude-art series developed through respectful artistic direction.'}
};
for(const item of services.itemListElement){
  const data=serviceDecisionData[item.position];
  if(!data)throw new Error(`services.json: unexpected service position ${item.position}`);
  item.description=data.description;
  item.audience={"@type":"Audience",audienceType:data.audienceType};
  item.serviceOutput=data.serviceOutput;
}
write('services.json',JSON.stringify(services,null,2)+'\n');

const machineBlock=`<!-- SERVICE-DECISION-CARDS:START -->
## Four-service decision model
- Homepage service cards keep the same four routes, order, titles and calls to action; only their decision value is strengthened.
- Portrait Photography is the starting point for leaders, founders and experts who need a reusable public visual identity across profile, corporate, press, speaking and internal channels.
- Brand Photography is the starting point for organisations that need leadership, teams, workplaces and campaigns to communicate as one recognisable visual system.
- C-Level Event Photography is the starting point for discreet documentation of board, leadership, conference and diplomatic settings for press, internal communication and institutional archives.
- Fine Art Photography is the starting point for private, author-led personal work about identity, biography and the body, including fine-art portraiture and nude art created with consent and discretion.
- These decision criteria explain fit and intended use; they do not create additional service categories.
- Canonical structured service list: https://www.norbertbanhalmi.com/services.json
<!-- SERVICE-DECISION-CARDS:END -->`;
for(const file of ['ai.txt','llms.txt','llms-full.txt']){
  let text=read(file);
  const start='<!-- SERVICE-DECISION-CARDS:START -->';
  const end='<!-- SERVICE-DECISION-CARDS:END -->';
  const existing=text.indexOf(start);
  if(existing>=0){
    const close=text.indexOf(end,existing);
    if(close<0)throw new Error(`${file}: malformed service decision block`);
    text=text.slice(0,existing)+machineBlock+text.slice(close+end.length);
  }else{
    const anchor='<!-- HOMEPAGE-DECISION-PATH:END -->';
    const index=text.indexOf(anchor);
    if(index>=0){const position=index+anchor.length;text=text.slice(0,position)+'\n\n'+machineBlock+text.slice(position)}else{text=machineBlock+'\n\n'+text}
  }
  write(file,text);
}

const ecosystem=JSON.parse(read('ecosystem.json'));
ecosystem.serviceDecisionModel={
  canonicalSource:'https://www.norbertbanhalmi.com/services.json',
  preservesFourPrincipalServices:true,
  homepageCardContract:'The four homepage cards retain their routes, titles, order and calls to action. Each description states audience, use situation and intended output.',
  services:[
    {name:'Portrait Photography',bestFor:'Leaders, founders and experts',useContexts:['LinkedIn','corporate website','press','speaking','internal communication'],result:'Reusable public portrait system'},
    {name:'Brand Photography',bestFor:'Organisations and leadership teams',useContexts:['recruitment','sales','media','corporate communication'],result:'Coherent organisational image library'},
    {name:'C-Level Event Photography',bestFor:'Boards, leadership teams, conferences and institutions',useContexts:['press','internal communication','institutional archive'],result:'Discreet editorial and institutional documentation'},
    {name:'Fine Art Photography',bestFor:'Private individuals seeking author-led personal work',useContexts:['fine-art portraiture','nude art','personal artistic series'],result:'Personal fine-art work created with respectful direction, consent and discretion'}
  ]
};
write('ecosystem.json',JSON.stringify(ecosystem,null,2)+'\n');

let regression=read('tools/audit-regression.mjs');
const portraitReplacements={
  'Executive, professional and lifestyle portraits—from a precise headshot to a complete visual position for a leader in public life.':'For leaders, founders and experts who need one credible visual identity across LinkedIn, company websites, press, speaking and internal communication—from a precise headshot to a complete public portrait system.',
  'Vezetői, üzleti és életmódportrék az egységes profilképtől egy vezető teljes nyilvános vizuális megjelenéséig.':'Vezetőknek, alapítóknak és szakértőknek, akiknek a LinkedInen, a vállalati weboldalon, a sajtóban, előadásokon és a belső kommunikációban is hiteles, egységes képi jelenlétre van szükségük — a pontos profilképtől a teljes nyilvános portrérendszerig.',
  'Executive-, Business- und Lifestyle-Porträts – vom präzisen Headshot bis zur vollständigen öffentlichen visuellen Positionierung einer Führungspersönlichkeit.':'Für Führungskräfte, Gründer:innen und Expert:innen, die auf LinkedIn, der Unternehmenswebsite, in Presse, Vorträgen und interner Kommunikation eine glaubwürdige, konsistente visuelle Identität benötigen — vom präzisen Headshot bis zum vollständigen öffentlichen Porträtsystem.'
};
for(const [oldText,newText] of Object.entries(portraitReplacements)){
  if(!regression.includes(oldText))throw new Error(`audit-regression.mjs: protected portrait phrase not found: ${oldText}`);
  regression=regression.replace(oldText,newText);
}
write('tools/audit-regression.mjs',regression);

const audit=`import fs from 'node:fs';

const errors=[];
const expected={
  'index.html':[
    {href:'/portrait/',title:'Portrait Photography',cta:'See portrait work ›',description:'For leaders, founders and experts who need one credible visual identity across LinkedIn, company websites, press, speaking and internal communication—from a precise headshot to a complete public portrait system.',signals:['leaders','LinkedIn','press','portrait system']},
    {href:'/lifestyle/',title:'Brand Photography',cta:'See brand photography ›',description:'For organisations that need founders, teams, workplaces and campaigns to read as one recognisable brand across recruitment, sales, media and corporate communication—not as unrelated image sets.',signals:['organisations','recruitment','sales','recognisable brand']},
    {href:'/event-photography/',title:'C-Level Event Photography',cta:'See event coverage ›',description:'For board meetings, leadership summits, conferences and diplomatic settings where discreet coverage must preserve the room’s relationships, decisions and atmosphere for press, internal communication and the institutional archive.',signals:['board meetings','discreet','decisions','institutional archive']},
    {href:'/glamour/',title:'Fine Art Photography',cta:'Explore fine-art work ›',description:'For people seeking an author-led personal work rather than a conventional portrait: fine-art portraiture and nude art exploring identity, biography and the body through respectful direction, consent and discretion.',signals:['author-led','identity','consent','discretion']}
  ],
  'hu/index.html':[
    {href:'/hu/portre/',title:'Portréfotózás',cta:'Portrémunkák megtekintése ›',description:'Vezetőknek, alapítóknak és szakértőknek, akiknek a LinkedInen, a vállalati weboldalon, a sajtóban, előadásokon és a belső kommunikációban is hiteles, egységes képi jelenlétre van szükségük — a pontos profilképtől a teljes nyilvános portrérendszerig.',signals:['Vezetőknek','LinkedInen','sajtóban','portrérendszerig']},
    {href:'/hu/brand/',title:'Brandfotózás',cta:'Brandfotózás megtekintése ›',description:'Szervezeteknek, amelyek azt szeretnék, hogy a vezetők, csapatok, munkakörnyezetek és kampányok a toborzásban, az értékesítésben, a médiában és a vállalati kommunikációban is egyetlen felismerhető márkaként jelenjenek meg — ne különálló képsorozatokként.',signals:['Szervezeteknek','toborzásban','értékesítésben','felismerhető márkaként']},
    {href:'/hu/rendezvenyfotozas/',title:'Felsővezetői eseményfotózás',cta:'Eseményfotózás megtekintése ›',description:'Vezetői ülésekhez, konferenciákhoz, csúcstalálkozókhoz és diplomáciai helyzetekhez, ahol a diszkrét dokumentáció a sajtó, a belső kommunikáció és az intézményi archívum számára is megőrzi a kapcsolatokat, a döntéseket és a terem hangulatát.',signals:['Vezetői ülésekhez','diszkrét','döntéseket','intézményi archívum']},
    {href:'/hu/muveszi-fotografia/',title:'Művészi fotográfia',cta:'Művészi munkák megtekintése ›',description:'Azoknak, akik hagyományos portré helyett szerzői személyes művet keresnek: művészi portré és aktfotográfia az identitásról, az élettörténetről és a testről, tiszteletteljes vezetéssel, beleegyezéssel és diszkrécióval.',signals:['szerzői személyes művet','identitásról','beleegyezéssel','diszkrécióval']}
  ],
  'de-at/index.html':[
    {href:'/de-at/portrait/',title:'Porträtfotografie',cta:'Porträtarbeiten ansehen ›',description:'Für Führungskräfte, Gründer:innen und Expert:innen, die auf LinkedIn, der Unternehmenswebsite, in Presse, Vorträgen und interner Kommunikation eine glaubwürdige, konsistente visuelle Identität benötigen — vom präzisen Headshot bis zum vollständigen öffentlichen Porträtsystem.',signals:['Führungskräfte','LinkedIn','Presse','Porträtsystem']},
    {href:'/de-at/brand/',title:'Brandfotografie',cta:'Brandfotografie ansehen ›',description:'Für Organisationen, deren Führungskräfte, Teams, Arbeitswelten und Kampagnen in Recruiting, Vertrieb, Medien und Unternehmenskommunikation als eine wiedererkennbare Marke erscheinen sollen — nicht als voneinander unabhängige Bildserien.',signals:['Organisationen','Recruiting','Vertrieb','wiedererkennbare Marke']},
    {href:'/de-at/eventfotografie/',title:'C-Level-Eventfotografie',cta:'Eventreportagen ansehen ›',description:'Für Board Meetings, Leadership Summits, Konferenzen und diplomatische Situationen, in denen diskrete Dokumentation Beziehungen, Entscheidungen und Atmosphäre für Presse, interne Kommunikation und institutionelles Archiv bewahren muss.',signals:['Board Meetings','diskrete','Entscheidungen','institutionelles Archiv']},
    {href:'/de-at/fine-art/',title:'Fine-Art-Fotografie',cta:'Fine-Art-Arbeiten ansehen ›',description:'Für Menschen, die statt eines konventionellen Porträts ein autorengeführtes persönliches Werk suchen: Fine-Art-Porträts und künstlerischer Akt über Identität, Biografie und Körper, mit respektvoller Führung, Einwilligung und Diskretion.',signals:['autorengeführtes','Identität','Einwilligung','Diskretion']}
  ]
};
for(const [file,cards] of Object.entries(expected)){
  const html=fs.readFileSync(file,'utf8');
  const section=(html.match(/<section id="services">[\\s\\S]*?<\\/section>/)||[''])[0];
  if(!section)errors.push(file+': service section missing');
  if((section.match(/<a class="card reveal"/g)||[]).length!==4)errors.push(file+': card count changed');
  cards.forEach((card,index)=>{
    const exact='<a class="card reveal" href="'+card.href+'"><h3>'+card.title+'</h3><p>'+card.description+'</p><span class="more">'+card.cta+'</span></a>';
    if(!section.includes(exact))errors.push(file+': exact card contract missing at position '+(index+1)+' '+card.title);
    for(const signal of card.signals)if(!card.description.includes(signal))errors.push(file+': decision signal missing from '+card.title+' '+signal);
  });
}
const services=JSON.parse(fs.readFileSync('services.json','utf8'));
if(services.numberOfItems!==4||services.itemListElement?.length!==4)errors.push('services.json: four-service structure changed');
for(const service of services.itemListElement){
  if(!service.audience?.audienceType)errors.push('services.json: audience missing for '+service.name);
  if(!service.serviceOutput)errors.push('services.json: serviceOutput missing for '+service.name);
}
const ecosystem=JSON.parse(fs.readFileSync('ecosystem.json','utf8'));
if(ecosystem.serviceDecisionModel?.services?.length!==4||ecosystem.serviceDecisionModel?.preservesFourPrincipalServices!==true)errors.push('ecosystem.json: service decision model incomplete');
for(const file of ['ai.txt','llms.txt','llms-full.txt']){
  const text=fs.readFileSync(file,'utf8');
  if((text.split('<!-- SERVICE-DECISION-CARDS:START -->').length-1)!==1)errors.push(file+': service decision block missing or duplicated');
}
const manifest=JSON.parse(fs.readFileSync('docs/content-migrations/2026-08-06-service-card-decisions-stage4.json','utf8'));
if(manifest.pages?.length!==3||manifest.pages.some(page=>page.cards?.length!==4||page.nonDescriptionContentPreservedExactly!==true))errors.push('migration manifest: service-card preservation evidence incomplete');
if(errors.length){console.error(errors.join(String.fromCharCode(10)));process.exit(1)}
console.log('Service-card decision audit passed: three languages, four unchanged routes and audience-use-result copy are aligned.');
`;
write('tools/audit-service-card-decisions-stage19.mjs',audit);

const pkg=JSON.parse(read('package.json'));
if(!pkg.scripts.audit.includes('audit-service-card-decisions-stage19.mjs'))pkg.scripts.audit+=' && node tools/audit-service-card-decisions-stage19.mjs';
write('package.json',JSON.stringify(pkg,null,2)+'\n');

fs.mkdirSync(path.join(root,'docs/content-migrations'),{recursive:true});
write('docs/content-migrations/2026-08-06-service-card-decisions-stage4.json',JSON.stringify(manifest,null,2)+'\n');

for(const temporary of ['scripts/_migrate-service-card-decisions-stage4.mjs','.github/workflows/_service-card-decisions-stage4.yml']){
  const full=path.join(root,temporary);
  if(fs.existsSync(full))fs.unlinkSync(full);
}
console.log('Service-card decision migration applied in three languages; temporary writer files removed.');
