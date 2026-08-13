import fs from 'node:fs';

const errors=[];
const homepages=[
  {file:'index.html', marker:'data-first-principles-path="stage68"', heading:'What do you need right now?', labels:['New executive portrait','Consistent leadership portraits','Stronger personal brand','Brand photography for a company or campaign','C-level event coverage','I am not sure yet']},
  {file:'hu/index.html', marker:'data-first-principles-path="stage68"', heading:'Mire van most szüksége?', labels:['Új vezetői portréra','Egységes vezetői portrékra','Erősebb személyes márkára','Céges vagy kampány brandfotókra','Vezetői esemény dokumentálására','Még nem vagyok biztos benne']},
  {file:'de-at/index.html', marker:'data-first-principles-path="stage68"', heading:'Was brauchen Sie jetzt?', labels:['Ein neues Executive-Porträt','Einheitliche Führungskräfteporträts','Eine stärkere persönliche Marke','Brandfotografie für Unternehmen oder Kampagnen','Dokumentation eines Führungskräfte-Events','Ich bin noch nicht sicher']}
];
for(const page of homepages){
  const html=fs.readFileSync(page.file,'utf8');
  if(!html.includes(page.marker)) errors.push(`${page.file}: first-principles decision layer missing`);
  if(!html.includes(page.heading)) errors.push(`${page.file}: decision heading missing`);
  for(const label of page.labels) if(!html.includes(label)) errors.push(`${page.file}: decision option missing: ${label}`);
  const section=(html.match(/<section[^>]+data-first-principles-path="stage68"[\s\S]*?<\/section>/)||[''])[0];
  if((section.match(/class="fp-choice/g)||[]).length!==6) errors.push(`${page.file}: decision layer must contain exactly six choices`);
  if(!/meet\.bookipi\.com\/zk5ly35r/.test(section)) errors.push(`${page.file}: uncertain path must lead to canonical consultation`);
}

const css=fs.readFileSync('assets/css/style.css','utf8');
for(const token of ['STAGE68-FIRST-PRINCIPLES-APPLE:START','.fp-decision-system','.fp-choice','.next-step-selector']){
  if(!css.includes(token)) errors.push(`style.css: missing stage68 design authority token ${token}`);
}
if(!css.includes('text-wrap:balance')) errors.push('style.css: balanced display typography guard missing');
if(!css.includes('border-radius:999px')) errors.push('style.css: pill CTA authority missing');
if(!css.includes('max-width:68ch')) errors.push('style.css: readable text measure guard missing');

if(errors.length){
  console.error('Stage68 first-principles Apple audit failed:');
  for(const e of errors) console.error(' - '+e);
  process.exit(1);
}
console.log('Stage68 passed: EN/HU/DE homepages start from customer problems, uncertain visitors reach consultation, and the shared Apple-style decision hierarchy remains globally guarded.');
