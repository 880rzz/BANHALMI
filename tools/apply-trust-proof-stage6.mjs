import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const wko='https://firmen.wko.at/norbert-banhalmi-visuelle-strategische-partnerschaft-f%C3%BCr-f%C3%BChrungskr%C3%A4fte/wien/?firmaid=12bd142c-5fcf-4457-9a90-47fbff162b40';
const amcham='https://amcham.at/members-list/';
const om='https://www.milcclub.com/ambassadors';
const commons='https://commons.wikimedia.org/wiki/File:Peter-Magyar-portrait-2026.jpg';

const pages={
  'portrait/index.html':{lang:'en',kind:'portrait'},
  'lifestyle/index.html':{lang:'en',kind:'brand'},
  'event-photography/index.html':{lang:'en',kind:'event'},
  'hu/portre/index.html':{lang:'hu',kind:'portrait'},
  'hu/brand/index.html':{lang:'hu',kind:'brand'},
  'hu/rendezvenyfotozas/index.html':{lang:'hu',kind:'event'},
  'de-at/portrait/index.html':{lang:'de',kind:'portrait'},
  'de-at/brand/index.html':{lang:'de',kind:'brand'},
  'de-at/eventfotografie/index.html':{lang:'de',kind:'event'}
};

const copy={
  en:{
    title:'Evidence behind the work',
    intro:'Trust should rest on verifiable work, professional standing and documented collaborations—not on adjectives.',
    portrait:[
      ['Published portrait reference',`The 2026 Péter Magyar portrait is documented on Wikimedia Commons and linked to the EUFÓRIA archive record.`,`<a href="${commons}" rel="noopener" target="_blank">View the Wikimedia record ›</a>`],
      ['Professional standing',`Bánhalmi Norbert e.U. is listed through WKO Wien and is a member of AmCham Austria.`,`<a href="${wko}" rel="noopener" target="_blank">WKO listing ›</a> · <a href="${amcham}" rel="noopener" target="_blank">AmCham directory ›</a>`],
      ['Documented client history',`Selected organisations and brands are listed on the partners page. The list records working history; it does not imply endorsement.`,`<a href="/partners/">View documented organisations ›</a>`]
    ],
    brand:[
      ['Documented organisations',`The partners register presents selected organisations and brands connected to completed work. It records working history; it does not imply endorsement.`,`<a href="/partners/">View documented organisations ›</a>`],
      ['Long-term industry role',`Norbert Bánhalmi has worked as an OM SYSTEM ambassador since 2018, alongside his independent commercial and author-led practice.`,`<a href="${om}" rel="noopener" target="_blank">View ambassador listing ›</a>`],
      ['Professional standing',`The Vienna business is listed through WKO Wien and participates in the AmCham Austria business network.`,`<a href="${wko}" rel="noopener" target="_blank">WKO listing ›</a> · <a href="${amcham}" rel="noopener" target="_blank">AmCham directory ›</a>`]
    ],
    event:[
      ['Business-network context',`Bánhalmi Norbert e.U. is a member of AmCham Austria, supporting work in international business and diplomatic environments.`,`<a href="${amcham}" rel="noopener" target="_blank">View the member directory ›</a>`],
      ['Professional registration',`The Vienna operation is documented through the WKO Wien professional listing.`,`<a href="${wko}" rel="noopener" target="_blank">View the WKO listing ›</a>`],
      ['Documented organisations',`The partners register shows selected organisations and brands connected to completed assignments. It is a work record, not an endorsement list.`,`<a href="/partners/">View documented organisations ›</a>`]
    ]
  },
  hu:{
    title:'A munka mögötti bizonyítékok',
    intro:'A bizalom alapja ellenőrizhető munka, szakmai státusz és dokumentált együttműködés – nem néhány hangzatos jelző.',
    portrait:[
      ['Publikált portréreferencia',`A 2026-os Magyar Péter-portré a Wikimedia Commonson dokumentált, és kapcsolódik az EUFÓRIA archív rekordjához.`,`<a href="${commons}" rel="noopener" target="_blank">Wikimedia-rekord megtekintése ›</a>`],
      ['Szakmai háttér',`A Bánhalmi Norbert e.U. szerepel a WKO Wien nyilvántartásában, és az AmCham Austria tagja.`,`<a href="${wko}" rel="noopener" target="_blank">WKO-adatlap ›</a> · <a href="${amcham}" rel="noopener" target="_blank">AmCham-taglista ›</a>`],
      ['Dokumentált ügyfélmúlt',`A partnerek oldala válogatott szervezeteket és márkákat sorol fel. A lista munkakapcsolatot dokumentál, nem támogatói nyilatkozat.`,`<a href="/hu/partnerek/">Dokumentált szervezetek ›</a>`]
    ],
    brand:[
      ['Dokumentált szervezetek',`A partnerjegyzék elkészült munkákhoz kapcsolódó válogatott szervezeteket és márkákat mutat be. A lista nem jelent ajánlást vagy támogatást.`,`<a href="/hu/partnerek/">Dokumentált szervezetek ›</a>`],
      ['Hosszú távú szakmai szerep',`Bánhalmi Norbert 2018 óta OM SYSTEM márkanagykövet, független alkalmazott és szerzői fotográfiai munkája mellett.`,`<a href="${om}" rel="noopener" target="_blank">Márkanagyköveti lista ›</a>`],
      ['Szakmai háttér',`A bécsi vállalkozás szerepel a WKO Wien nyilvántartásában, és részt vesz az AmCham Austria üzleti közösségében.`,`<a href="${wko}" rel="noopener" target="_blank">WKO-adatlap ›</a> · <a href="${amcham}" rel="noopener" target="_blank">AmCham-taglista ›</a>`]
    ],
    event:[
      ['Nemzetközi üzleti közeg',`A Bánhalmi Norbert e.U. az AmCham Austria tagja, ami releváns hátteret ad nemzetközi üzleti és diplomáciai események dokumentálásához.`,`<a href="${amcham}" rel="noopener" target="_blank">AmCham-taglista ›</a>`],
      ['Szakmai nyilvántartás',`A bécsi működés a WKO Wien hivatalos szakmai adatlapján ellenőrizhető.`,`<a href="${wko}" rel="noopener" target="_blank">WKO-adatlap ›</a>`],
      ['Dokumentált szervezetek',`A partnerjegyzék elkészült megbízásokhoz kapcsolódó válogatott szervezeteket és márkákat mutat. Ez munkarekord, nem ajánlási lista.`,`<a href="/hu/partnerek/">Dokumentált szervezetek ›</a>`]
    ]
  },
  de:{
    title:'Nachweise hinter der Arbeit',
    intro:'Vertrauen sollte auf überprüfbarer Arbeit, beruflichem Status und dokumentierten Kooperationen beruhen – nicht auf werblichen Adjektiven.',
    portrait:[
      ['Veröffentlichte Porträtreferenz',`Das Porträt von Péter Magyar aus dem Jahr 2026 ist auf Wikimedia Commons dokumentiert und mit dem EUFÓRIA-Archivdatensatz verknüpft.`,`<a href="${commons}" rel="noopener" target="_blank">Wikimedia-Eintrag ansehen ›</a>`],
      ['Beruflicher Status',`Bánhalmi Norbert e.U. ist bei der WKO Wien gelistet und Mitglied der AmCham Austria.`,`<a href="${wko}" rel="noopener" target="_blank">WKO-Eintrag ›</a> · <a href="${amcham}" rel="noopener" target="_blank">AmCham-Mitgliederverzeichnis ›</a>`],
      ['Dokumentierte Kundenhistorie',`Die Partnerseite nennt ausgewählte Organisationen und Marken. Die Liste dokumentiert Zusammenarbeit und stellt keine Empfehlung dar.`,`<a href="/de-at/partner/">Dokumentierte Organisationen ›</a>`]
    ],
    brand:[
      ['Dokumentierte Organisationen',`Das Partnerverzeichnis zeigt ausgewählte Organisationen und Marken aus abgeschlossenen Arbeiten. Die Liste stellt keine Empfehlung oder Unterstützung dar.`,`<a href="/de-at/partner/">Dokumentierte Organisationen ›</a>`],
      ['Langfristige Branchenrolle',`Norbert Bánhalmi ist seit 2018 OM SYSTEM Ambassador – parallel zu seiner unabhängigen kommerziellen und autorengeführten Arbeit.`,`<a href="${om}" rel="noopener" target="_blank">Ambassador-Verzeichnis ›</a>`],
      ['Beruflicher Status',`Das Wiener Unternehmen ist bei der WKO Wien gelistet und Teil des Wirtschaftsnetzwerks der AmCham Austria.`,`<a href="${wko}" rel="noopener" target="_blank">WKO-Eintrag ›</a> · <a href="${amcham}" rel="noopener" target="_blank">AmCham-Mitgliederverzeichnis ›</a>`]
    ],
    event:[
      ['Internationales Wirtschaftsumfeld',`Bánhalmi Norbert e.U. ist Mitglied der AmCham Austria – ein relevanter Kontext für internationale Wirtschafts- und diplomatische Veranstaltungen.`,`<a href="${amcham}" rel="noopener" target="_blank">Mitgliederverzeichnis ansehen ›</a>`],
      ['Berufliche Registrierung',`Der Wiener Betrieb ist über den offiziellen WKO-Wien-Eintrag überprüfbar.`,`<a href="${wko}" rel="noopener" target="_blank">WKO-Eintrag ansehen ›</a>`],
      ['Dokumentierte Organisationen',`Das Partnerverzeichnis zeigt ausgewählte Organisationen und Marken aus abgeschlossenen Aufträgen. Es ist ein Arbeitsnachweis, keine Empfehlungsliste.`,`<a href="/de-at/partner/">Dokumentierte Organisationen ›</a>`]
    ]
  }
};

for(const [relative,cfg] of Object.entries(pages)){
  const file=path.join(root,relative);
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-trust-proof="stage6"')) continue;
  const c=copy[cfg.lang];
  const cards=c[cfg.kind].map(([title,text,link])=>`<article class="card"><h3>${title}</h3><p>${text}</p><p class="more">${link}</p></article>`).join('');
  const section=`<section class="section-band trust-proof" data-trust-proof="stage6"><div class="wrap"><div class="section-head"><p class="eyebrow">BANHALMI · VERIFIED CONTEXT</p><h2>${c.title}</h2><p>${c.intro}</p></div><div class="grid-3">${cards}</div></div></section>`;
  const anchor='<section class="section-band next-step-selector"';
  if(!html.includes(anchor)) throw new Error(`${relative}: next-step selector anchor missing`);
  html=html.replace(anchor,section+anchor);
  fs.writeFileSync(file,html,'utf8');
}
console.log('Stage-six trust proof blocks added to nine service pages.');
