import fs from 'node:fs';
const js=fs.readFileSync('assets/js/mega-menu.js','utf8');
const errors=[];
const tokens=['Services','Work','About · Pricing · Contact','Executive Portraits','Selected Work','Art Archive','Szolgáltatások','Munkák','Rólam · Árak · Kapcsolat','Executive portré','Válogatott munkák','Művészeti archívum','Leistungen','Arbeiten','Über BANHALMI · Preise · Kontakt','Executive-Porträts','Ausgewählte Arbeiten','Kunstarchiv',"grid.append(svc,main,foot)","foot.append(node([q,t.cta,t.ctaDesc],'bn-mega-pricing'))"];
for(const token of tokens)if(!js.includes(token))errors.push('mega-menu.js missing navigation token: '+token);
for(const oldToken of ["['/about/','Oeuvre'","['/hu/eletmu/','Életmű'","['/de-at/werk/','Werk'"])if(js.includes(oldToken))errors.push('legacy top-level label remains: '+oldToken);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Navigation ecosystem audit passed: multilingual service-first hierarchy is present.');
