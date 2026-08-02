import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const groups={
 en:{
  service:['portrait/index.html','lifestyle/index.html','event-photography/index.html'],
  detail:['requestaquote/index.html','faq/index.html','terms-conditions/index.html'],
  title:'What the project fee covers',
  intro:'The calculator provides a non-binding estimate. The final scope, fee and delivery schedule become binding only in the accepted written offer.',
  cards:[
   ['Defined production scope','Preparation, photography, agreed selection and retouching are listed separately in the written offer.'],
   ['Commercial usage included','The standard licence is unlimited in time and territory for the commissioning organisation and the agreed communication channels. Copyright remains with the photographer.'],
   ['Vienna and Budapest','On-site work in Vienna and Budapest is included. Travel or production costs outside these locations are confirmed before booking.'],
   ['Transparent totals','The quote shows net amount, VAT where applicable and gross total. Additional work is never added without written agreement.']
  ],
  quote:'/requestaquote/',terms:'/terms-conditions/',quoteLabel:'Configure a project',termsLabel:'Read the contractual details'
 },
 hu:{
  service:['hu/portre/index.html','hu/brand/index.html','hu/rendezvenyfotozas/index.html'],
  detail:['hu/ajanlatkeres/index.html','hu/gyik/index.html','hu/aszf/index.html'],
  title:'Mit tartalmaz a projekt díja?',
  intro:'A kalkulátor nem kötelező érvényű irányárat mutat. A végleges terjedelem, díj és átadási ütemezés az elfogadott írásos ajánlattal válik kötelezővé.',
  cards:[
   ['Meghatározott projektterjedelem','Az előkészítés, a fotózás, az egyeztetett válogatás és a retus külön szerepel az írásos ajánlatban.'],
   ['Kereskedelmi felhasználás','Az alaplicenc időben és területileg korlátlan az ajánlatkérő szervezet és az egyeztetett kommunikációs felületek számára. A szerzői jog a fotósnál marad.'],
   ['Bécs és Budapest','A bécsi és budapesti helyszíni munkavégzés benne van a díjban. Más helyszín utazási vagy gyártási költségét foglalás előtt rögzítjük.'],
   ['Átlátható végösszeg','Az ajánlat külön mutatja a nettó összeget, az alkalmazandó áfát és a bruttó végösszeget. További munka csak írásos jóváhagyással kerülhet bele.']
  ],
  quote:'/hu/ajanlatkeres/',terms:'/hu/aszf/',quoteLabel:'Projekt összeállítása',termsLabel:'Szerződéses részletek'
 },
 de:{
  service:['de-at/portrait/index.html','de-at/brand/index.html','de-at/eventfotografie/index.html'],
  detail:['de-at/anfrage/index.html','de-at/faq/index.html','de-at/agb/index.html'],
  title:'Was das Projekthonorar umfasst',
  intro:'Der Kalkulator zeigt eine unverbindliche Orientierung. Umfang, Honorar und Lieferplan werden erst mit dem angenommenen schriftlichen Angebot verbindlich.',
  cards:[
   ['Definierter Leistungsumfang','Vorbereitung, Fotografie, vereinbarte Auswahl und Retusche werden im schriftlichen Angebot getrennt ausgewiesen.'],
   ['Kommerzielle Nutzung inklusive','Die Standardlizenz gilt zeitlich und räumlich unbeschränkt für die beauftragende Organisation und die vereinbarten Kommunikationskanäle. Das Urheberrecht bleibt beim Fotografen.'],
   ['Wien und Budapest','Einsätze vor Ort in Wien und Budapest sind enthalten. Reise- oder Produktionskosten für andere Orte werden vor der Buchung bestätigt.'],
   ['Transparente Gesamtsumme','Das Angebot weist Nettobetrag, gegebenenfalls Umsatzsteuer und Bruttosumme getrennt aus. Zusatzleistungen erfolgen nur nach schriftlicher Freigabe.']
  ],
  quote:'/de-at/anfrage/',terms:'/de-at/agb/',quoteLabel:'Projekt konfigurieren',termsLabel:'Vertragsdetails lesen'
 }
};

function section(copy,compact=false){
 const cards=(compact?copy.cards.slice(0,3):copy.cards).map(([h,p])=>`<article class="card"><h3>${h}</h3><p>${p}</p></article>`).join('');
 return `<section class="section-band pricing-licensing-clarity" data-pricing-licensing="stage7"><div class="container"><div class="section-head"><p class="eyebrow">BANHALMI</p><h2>${copy.title}</h2><p>${copy.intro}</p></div><div class="card-grid">${cards}</div><p class="button-row"><a class="button" href="${copy.quote}">${copy.quoteLabel}</a><a class="button button-secondary" href="${copy.terms}">${copy.termsLabel}</a></p></div></section>`;
}

let changed=0;
for(const copy of Object.values(groups)){
 for(const [kind,files] of [['service',copy.service],['detail',copy.detail]]){
  for(const relative of files){
   const file=path.join(root,relative);
   let html=fs.readFileSync(file,'utf8');
   if(html.includes('data-pricing-licensing="stage7"')) continue;
   if(!html.includes('</main>')) throw new Error(`${relative}: </main> not found`);
   html=html.replace('</main>',`${section(copy,kind==='service')}</main>`);
   fs.writeFileSync(file,html);
   changed++;
  }
 }
}
console.log(`Stage-seven pricing and licensing clarity added to ${changed} pages.`);
