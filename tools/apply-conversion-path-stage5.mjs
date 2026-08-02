import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const BOOKING='https://meet.bookipi.com/zk5ly35r';
const configs={
  en:{quote:'/requestaquote/',contact:'/contact/',title:'Choose the next step',intro:'Use the route that matches how clear the project already is.',cards:[['Build a package','You already know the service, scope or approximate timing. Configure the project and receive a non-binding estimate.'],['Send a message','The brief is still taking shape, several people are involved, or you would rather describe the situation first.'],['Book a video call','A 30-minute Google Meet conversation directly with Norbert. The booking interface is in English.']]},
  hu:{quote:'/hu/ajanlatkeres/',contact:'/hu/kapcsolat/',title:'Válassza ki a következő lépést',intro:'Azt az utat válassza, amelyik megfelel annak, mennyire állt már össze a projekt.',cards:[['Csomag összeállítása','Már ismert a szolgáltatás, a terjedelem vagy a hozzávetőleges időpont. Állítsa össze a projektet, és kapjon nem kötelező becslést.'],['Üzenet küldése','A brief még alakul, többen vesznek részt a döntésben, vagy előbb inkább leírná a helyzetet.'],['Videóhívás foglalása','30 perces Google Meet beszélgetés közvetlenül Bánhalmi Norberttel. A foglalási felület angol nyelvű.']]},
  de:{quote:'/de-at/anfrage/',contact:'/de-at/kontakt/',title:'Wählen Sie den nächsten Schritt',intro:'Wählen Sie den Weg danach, wie weit das Projekt bereits geklärt ist.',cards:[['Paket zusammenstellen','Leistung, Umfang oder ungefährer Termin stehen bereits fest. Stellen Sie das Projekt zusammen und erhalten Sie eine unverbindliche Schätzung.'],['Nachricht senden','Das Briefing entsteht noch, mehrere Personen entscheiden mit oder Sie möchten die Situation zuerst beschreiben.'],['Videogespräch buchen','30-minütiges Google-Meet-Gespräch direkt mit Norbert Bánhalmi. Die Buchungsoberfläche ist auf Englisch.']]}
};
const pages=[
 ['portrait/index.html','en'],['lifestyle/index.html','en'],['event-photography/index.html','en'],
 ['hu/portre/index.html','hu'],['hu/brand/index.html','hu'],['hu/rendezvenyfotozas/index.html','hu'],
 ['de-at/portrait/index.html','de'],['de-at/brand/index.html','de'],['de-at/eventfotografie/index.html','de'],
 ['contact/index.html','en'],['hu/kapcsolat/index.html','hu'],['de-at/kontakt/index.html','de']
];
for(const [relative,lang] of pages){
 const file=path.join(root,relative); let html=fs.readFileSync(file,'utf8'); const c=configs[lang];
 html=html.replace(/<section class="section-band next-step-selector"[\s\S]*?<\/section>/g,'');
 const labels=lang==='en'?['Configure the project','Write to us','Book Google Meet']:lang==='hu'?['Projekt összeállítása','Írjon nekünk','Google Meet foglalása']:['Projekt konfigurieren','Nachricht schreiben','Google Meet buchen'];
 const links=[c.quote,c.contact,BOOKING];
 const rel=['','','noopener noreferrer'];
 const target=['','',' target="_blank"'];
 const cards=c.cards.map((card,i)=>`<article class="card"><h3>${card[0]}</h3><p>${card[1]}</p><a class="btn-link" href="${links[i]}"${target[i]}${rel[i]?` rel="${rel[i]}"`:''}>${labels[i]} ›</a></article>`).join('');
 const section=`<section class="section-band next-step-selector" data-conversion-path="stage5"><div class="wrap"><div class="section-head"><span class="eyebrow">${lang==='en'?'Contact':lang==='hu'?'Kapcsolat':'Kontakt'}</span><h2>${c.title}</h2><p>${c.intro}</p></div><div class="cards">${cards}</div></div></section>`;
 html=html.replace('</main>',section+'</main>');
 fs.writeFileSync(file,html,'utf8');
}
console.log('Stage-five conversion path applied to nine service pages and three contact pages.');
