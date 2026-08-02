import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');

const variants={
  en:{
    heading:'Who leads what',
    intro:'One company, two working bases and clearly assigned responsibilities. The same brief and quality standard follow the project from first conversation to final delivery.',
    norbertTitle:'Norbert Banhalmi — creative and photographic lead',
    norbertText:'Norbert leads the visual strategy, executive and C-level photography, on-set direction, artistic decisions and final image approval. Vienna is the company headquarters and primary coordination base.',
    vikoTitle:'Viko Speier — Budapest studio and client coordination',
    vikoText:'Viko leads the Budapest studio, supports preparation and project coordination, and is the company contact for AmCham Austria. Norbert remains the photographer and creative lead for commissioned BANHALMI work.',
    studioTitle:'Vienna and Budapest — one project system',
    studioText:'Vienna and Budapest are working locations of the same professional system, not separate providers. Availability, location and production responsibilities are confirmed in the written offer.',
    norbertLink:'/about/', vikoLink:'/speier-viko/', contactLink:'/contact/',
    norbertCta:'Norbert’s professional profile', vikoCta:'Meet Viko Speier', contactCta:'Choose the right contact'
  },
  hu:{
    heading:'Ki mit vezet?',
    intro:'Egy vállalkozás, két aktív bázis és világosan kijelölt felelősségi körök. A projektet az első beszélgetéstől a végső átadásig ugyanaz a brief és minőségi rendszer tartja össze.',
    norbertTitle:'Bánhalmi Norbert — kreatív és fotográfiai vezető',
    norbertText:'Norbert vezeti a vizuális stratégiát, az executive és C-level fotózásokat, a helyszíni irányítást, a művészi döntéseket és a végleges képek jóváhagyását. Bécs a vállalkozás székhelye és elsődleges koordinációs bázisa.',
    vikoTitle:'Viko Speier — budapesti stúdió és ügyfélkoordináció',
    vikoText:'Viko vezeti a budapesti stúdiót, támogatja az előkészítést és a projektkoordinációt, valamint a cég AmCham Austria-kapcsolattartója. A megbízott BANHALMI-munkák fotográfiai és kreatív vezetője Norbert marad.',
    studioTitle:'Bécs és Budapest — egyetlen projektrendszer',
    studioText:'Bécs és Budapest ugyanannak a szakmai rendszernek a munkavégzési helyei, nem külön szolgáltatók. Az elérhetőséget, a helyszínt és a gyártási felelősségeket az írásos ajánlat rögzíti.',
    norbertLink:'/hu/eletmu/', vikoLink:'/hu/speier-viko/', contactLink:'/hu/kapcsolat/',
    norbertCta:'Norbert szakmai profilja', vikoCta:'Ismerje meg Vikót', contactCta:'Válassza ki a megfelelő kapcsolatot'
  },
  de:{
    heading:'Wer verantwortet welchen Bereich?',
    intro:'Ein Unternehmen, zwei aktive Arbeitsstandorte und klar zugeordnete Verantwortlichkeiten. Vom Erstgespräch bis zur finalen Übergabe gelten dasselbe Briefing und derselbe Qualitätsstandard.',
    norbertTitle:'Norbert Banhalmi — kreative und fotografische Leitung',
    norbertText:'Norbert verantwortet visuelle Strategie, Executive- und C-Level-Fotografie, Regie am Set, künstlerische Entscheidungen und die finale Bildfreigabe. Wien ist Unternehmenssitz und primärer Koordinationsstandort.',
    vikoTitle:'Viko Speier — Budapester Studio und Kundenkoordination',
    vikoText:'Viko leitet das Budapester Studio, unterstützt Vorbereitung und Projektkoordination und ist Ansprechpartnerin des Unternehmens für AmCham Austria. Fotografische und kreative Leitung beauftragter BANHALMI-Projekte bleibt bei Norbert.',
    studioTitle:'Wien und Budapest — ein Projektsystem',
    studioText:'Wien und Budapest sind Arbeitsstandorte desselben professionellen Systems, keine getrennten Anbieter. Verfügbarkeit, Standort und Produktionsverantwortung werden im schriftlichen Angebot festgehalten.',
    norbertLink:'/de-at/werk/', vikoLink:'/de-at/speier-viko/', contactLink:'/de-at/kontakt/',
    norbertCta:'Norberts professionelles Profil', vikoCta:'Viko Speier kennenlernen', contactCta:'Den richtigen Kontakt wählen'
  }
};

const pages=[
  ['about/index.html','en'],['contact/index.html','en'],['speier-viko/index.html','en'],['requestaquote/index.html','en'],
  ['hu/eletmu/index.html','hu'],['hu/kapcsolat/index.html','hu'],['hu/speier-viko/index.html','hu'],['hu/ajanlatkeres/index.html','hu'],
  ['de-at/werk/index.html','de'],['de-at/kontakt/index.html','de'],['de-at/speier-viko/index.html','de'],['de-at/anfrage/index.html','de']
];

for(const [relative,lang] of pages){
  const file=path.join(root,relative);
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-team-roles="stage8"')) continue;
  const v=variants[lang];
  const block=`<section class="section-band team-role-clarity" data-team-roles="stage8"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">BANHALMI team</span><h2>${v.heading}</h2><p>${v.intro}</p></div><div class="cards"><article class="card reveal"><h3>${v.norbertTitle}</h3><p>${v.norbertText}</p><a class="btn-link" href="${v.norbertLink}">${v.norbertCta} →</a></article><article class="card reveal"><h3>${v.vikoTitle}</h3><p>${v.vikoText}</p><a class="btn-link" href="${v.vikoLink}">${v.vikoCta} →</a></article><article class="card reveal"><h3>${v.studioTitle}</h3><p>${v.studioText}</p><a class="btn-link" href="${v.contactLink}">${v.contactCta} →</a></article></div></div></section>`;
  if(!html.includes('</main>')) throw new Error(`${relative}: </main> missing`);
  html=html.replace('</main>',`${block}</main>`);
  fs.writeFileSync(file,html);
}
console.log('Stage-eight team and studio role clarity applied to 12 pages.');
