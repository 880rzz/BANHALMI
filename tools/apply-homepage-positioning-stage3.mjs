import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const configs = {
  'index.html': {
    eyebrow:'Executive portraiture · Brand photography · C-level events · Fine art',
    h1:'Executive portraits and visual positioning for leaders and organisations.',
    intro:'I create photographs that help a leader or an organisation be understood before the first conversation. The work ranges from precise executive portraits to coherent brand imagery, discreet C-level event coverage and author-led fine-art photography.',
    summary:'<p><strong>Four principal services:</strong> Executive Portraiture, Brand Photography, C-Level Event Photography and Fine Art Photography.</p><p>Headshots, employer-branding imagery, press portraits and visual brand strategy support these four services. They are tools within the work, not competing service categories.</p><p>As a member of AmCham Austria, BANHALMI participates in an international business community where credibility, professional presence and long-term trust are fundamental values.</p>',
    ctas:['See portrait work ›','See brand photography ›','See event coverage ›','Explore fine-art work ›']
  },
  'hu/index.html': {
    eyebrow:'Executive portré · Brandfotózás · C-level események · Művészi fotográfia',
    h1:'Executive portrék és vizuális pozicionálás vezetőknek és szervezeteknek.',
    intro:'Olyan fényképeket készítek, amelyek már az első beszélgetés előtt érthetővé tesznek egy vezetőt vagy egy szervezetet. A munka a pontos executive portrétól az egységes brandképeken és a diszkrét C-level eseményfotózáson át a szerzői művészi fotográfiáig terjed.',
    summary:'<p><strong>Négy fő szolgáltatás:</strong> executive portréfotózás, brandfotózás, C-level eseményfotózás és művészi fotográfia.</p><p>A headshot, az employer branding, a sajtóportré és a vizuális márkastratégia ezeket a területeket támogatja. Nem különálló, egymással versengő szolgáltatások.</p><p>Az AmCham Austria tagjaként a BANHALMI olyan nemzetközi üzleti közösség része, ahol a hitelesség, a professzionális megjelenés és a hosszú távú bizalom alapvető érték.</p>',
    ctas:['Portrémunkák megtekintése ›','Brandfotózás megtekintése ›','Eseményfotózás megtekintése ›','Művészi munkák megtekintése ›']
  },
  'de-at/index.html': {
    eyebrow:'Executive-Porträts · Brandfotografie · C-Level-Events · Fine-Art-Fotografie',
    h1:'Executive-Porträts und visuelle Positionierung für Führungskräfte und Organisationen.',
    intro:'Ich fotografiere so, dass eine Führungskraft oder Organisation bereits vor dem ersten Gespräch verständlich wird. Die Arbeit reicht von präzisen Executive-Porträts über konsistente Markenbilder und diskrete C-Level-Eventfotografie bis zu autorengeführter Fine-Art-Fotografie.',
    summary:'<p><strong>Vier Hauptleistungen:</strong> Executive-Porträts, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie.</p><p>Headshots, Employer-Branding-Bilder, Presseporträts und visuelle Markenstrategie unterstützen diese vier Bereiche. Sie sind Werkzeuge innerhalb der Arbeit, keine zusätzlichen konkurrierenden Leistungen.</p><p>Als Mitglied von AmCham Austria ist BANHALMI Teil einer internationalen Wirtschaftsgemeinschaft, in der Glaubwürdigkeit, professionelles Auftreten und langfristiges Vertrauen zentrale Werte sind.</p>',
    ctas:['Porträtarbeiten ansehen ›','Brandfotografie ansehen ›','Eventreportagen ansehen ›','Fine-Art-Arbeiten ansehen ›']
  }
};

for (const [relative,cfg] of Object.entries(configs)) {
  const file=path.join(root,relative); let html=fs.readFileSync(file,'utf8');
  html=html.replace(/(<figure class="hero-figure[\s\S]*?<\/figure>)<p class="eyebrow">[\s\S]*?<\/p><p class="hero-location-line">([\s\S]*?)<\/p><h1>[\s\S]*?<\/h1><p>[\s\S]*?<\/p>/, `$1<p class="eyebrow">${cfg.eyebrow}</p><p class="hero-location-line">$2</p><h1>${cfg.h1}</h1><p>${cfg.intro}</p>`);
  html=html.replace(/<section class="section-band strategic-positioning-summary"><div class="wrap"><div class="prose structural-prose">[\s\S]*?<\/div><\/div><\/section>/, `<section class="section-band strategic-positioning-summary"><div class="wrap"><div class="prose structural-prose">${cfg.summary}</div></div></section>`);
  let i=0; html=html.replace(/<span class="more">[^<]*<\/span>/g,(m)=> i<4?`<span class="more">${cfg.ctas[i++]}</span>`:m);
  fs.writeFileSync(file,html,'utf8');
}

const auditPath=path.join(root,'tools/audit-regression.mjs');
let audit=fs.readFileSync(auditPath,'utf8');
const replacements=[
  ['The photograph often speaks before you do.','Executive portraits and visual positioning for leaders and organisations.'],
  ['Four principal service areas:','Four principal services:'],
  ['A fénykép gyakran előbb beszél, mint Ön.','Executive portrék és vizuális pozicionálás vezetőknek és szervezeteknek.'],
  ['Négy fő szolgáltatási terület:','Négy fő szolgáltatás:'],
  ['Das Bild spricht oft, bevor Sie es tun.','Executive-Porträts und visuelle Positionierung für Führungskräfte und Organisationen.'],
  ['Vier zentrale Leistungsbereiche:','Vier Hauptleistungen:']
];
for(const [from,to] of replacements) audit=audit.replaceAll(from,to);
fs.writeFileSync(auditPath,audit,'utf8');

console.log('Stage-three homepage positioning migration updated EN, HU and DE-AT homepages and their regression contract.');
