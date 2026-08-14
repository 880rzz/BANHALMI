import fs from 'node:fs';

const configs=[
  {file:'about/index.html',after:'professional-record',title:'The full artistic archive lives on BANHALMI ART',body:'Exhibitions, books, press records, moving-image documentation and the longer curatorial reading are maintained in the dedicated artistic archive. This page keeps the professional biography and commissioned-practice context concise.',links:[['https://www.banhalmi.art/','Explore the artistic archive'],['https://www.banhalmi.art/press.html','Browse press and moving-image records'],['https://www.banhalmi.art/curators.html','Read the curatorial dossier']]},
  {file:'hu/eletmu/index.html',after:'professional-record',title:'A teljes művészeti archívum a BANHALMI ART-on él',body:'A kiállítások, könyvek, sajtómegjelenések, mozgóképes dokumentáció és a részletes kurátori olvasat a külön művészeti archívumban található. Ezen az oldalon a szakmai életrajz és a megbízásos gyakorlat marad tömören, ellenőrizhetően.',links:[['https://www.banhalmi.art/hu/','Művészeti archívum megnyitása'],['https://www.banhalmi.art/hu/press.html','Sajtó- és mozgóképes források'],['https://www.banhalmi.art/hu/curators.html','Kurátori dosszié']]},
  {file:'de-at/werk/index.html',after:'professional-record',title:'Das vollständige künstlerische Archiv befindet sich auf BANHALMI ART',body:'Ausstellungen, Bücher, Pressebelege, Bewegtbild-Dokumentation und die ausführliche kuratorische Einordnung werden im eigenen Kunstarchiv gepflegt. Diese Seite konzentriert sich auf die professionelle Biografie und den Kontext der Auftragsarbeit.',links:[['https://www.banhalmi.art/de-at/','Künstlerisches Archiv öffnen'],['https://www.banhalmi.art/de-at/press.html','Presse- und Bewegtbildquellen'],['https://www.banhalmi.art/de-at/curators.html','Kuratorisches Dossier']]}
];
const removeIds=['exhibitions','permanent-exhibition','curatorial-programme','books','media','professional-articles','video-media'];
function removeSectionById(html,id){
  const re=new RegExp(`\\s*<section\\b[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?<\\/section>\\s*`,'i');
  return html.replace(re,'\n');
}
for(const c of configs){
  let html=fs.readFileSync(c.file,'utf8');
  for(const id of removeIds) html=removeSectionById(html,id);
  html=html.replace(/\s*<section\b[^>]*>\s*<[^>]*>\s*<[^>]*>\s*<p[^>]*class=["']label["'][^>]*>[^<]*(?:curator|kurátor|Kurator)[^<]*<\/p>[\s\S]*?<\/section>\s*/i,'\n');
  if(!html.includes(`id="${c.after}"`)&&!html.includes(`id='${c.after}'`)) throw new Error(`${c.file}: insertion anchor ${c.after} missing`);
  if(html.includes('commercial-art-bridge')) continue;
  const links=c.links.map(([href,label])=>`<a class="btn" href="${href}">${label}</a>`).join('');
  const bridge=`<section class="section-band commercial-art-bridge" aria-labelledby="art-bridge-title"><div class="wrap narrow"><p class="eyebrow">BANHALMI ART</p><h2 id="art-bridge-title">${c.title}</h2><p class="lead">${c.body}</p><div class="cta-row">${links}</div></div></section>`;
  const anchorRe=new RegExp(`(<section\\b[^>]*\\bid=["']${c.after}["'][^>]*>[\\s\\S]*?<\\/section>)`,'i');
  html=html.replace(anchorRe,`$1\n${bridge}`);
  fs.writeFileSync(c.file,html);
}
console.log('Simplified BANHALMI oeuvre/about pages and delegated full artistic records to BANHALMI ART.');
