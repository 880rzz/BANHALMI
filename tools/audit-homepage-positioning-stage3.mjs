import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const errors=[];
const pages={
'index.html':{h1:'Executive portraits and visual positioning for leaders and organisations.',services:['Executive Portraiture','Brand Photography','C-Level Event Photography','Fine Art Photography'],ctas:['See portrait work ›','See brand photography ›','See event coverage ›','Explore fine-art work ›']},
'hu/index.html':{h1:'Executive portrék és vizuális pozicionálás vezetőknek és szervezeteknek.',services:['executive portréfotózás','brandfotózás','C-level eseményfotózás','művészi fotográfia'],ctas:['Portrémunkák megtekintése ›','Brandfotózás megtekintése ›','Eseményfotózás megtekintése ›','Művészi munkák megtekintése ›']},
'de-at/index.html':{h1:'Executive-Porträts und visuelle Positionierung für Führungskräfte und Organisationen.',services:['Executive-Porträts','Brandfotografie','C-Level-Eventfotografie','Fine-Art-Fotografie'],ctas:['Porträtarbeiten ansehen ›','Brandfotografie ansehen ›','Eventreportagen ansehen ›','Fine-Art-Arbeiten ansehen ›']}
};
for(const [relative,c] of Object.entries(pages)){
 const html=fs.readFileSync(path.join(root,relative),'utf8');
 if(!html.includes(`<h1>${c.h1}</h1>`)) errors.push(`${relative}: clear homepage H1 missing`);
 for(const s of c.services) if(!html.includes(s)) errors.push(`${relative}: principal service missing ${s}`);
 for(const t of c.ctas) if(!html.includes(t)) errors.push(`${relative}: unique CTA missing ${t}`);
 const old=[...html.matchAll(/<span class="more">(?:Read the approach|A megközelítés|Zur Arbeitsweise) ›<\/span>/g)];
 if(old.length) errors.push(`${relative}: repeated generic service CTA remains`);
 const cards=(html.match(/<section id="services">[\s\S]*?<\/section>/)||[''])[0];
 if((cards.match(/<a class="card reveal"/g)||[]).length!==4) errors.push(`${relative}: service card count is not four`);
 if(!html.includes('strategic-positioning-summary')) errors.push(`${relative}: service hierarchy summary missing`);
}
const services=JSON.parse(fs.readFileSync(path.join(root,'services.json'),'utf8'));
if(services.numberOfItems!==4 || services.itemListElement?.length!==4) errors.push('services.json: principal service count is not four');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Stage-three homepage positioning audit passed: three languages, four principal services and unique service CTAs are aligned.');
