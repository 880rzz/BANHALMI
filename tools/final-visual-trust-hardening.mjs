import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const write=(p,s)=>fs.writeFileSync(p,s);
const replaceIfPresent=(source,from,to)=>source.includes(from)?source.split(from).join(to):source;
const requireEither=(source,legacy,current,label)=>{
  if(!source.includes(legacy)&&!source.includes(current)) throw new Error(`Missing expected ${label}`);
  return replaceIfPresent(source,legacy,current);
};

// 1. Replace the obsolete wording assertion directly in the canonical regression audit.
{
  const file='tools/audit-regression.mjs';
  let s=read(file);
  const oldBlock=`const strategicCopy={
  'index.html':['first impression','Four principal service areas:','As a member of AmCham Austria'],
  'hu/index.html':['első benyomást','Négy fő szolgáltatási terület:','Az AmCham Austria tagjaként'],
  'de-at/index.html':['ersten Eindruck','Vier zentrale Leistungsbereiche:','Als Mitglied von AmCham Austria']
};`;
  const newBlock=`const strategicCopy={
  'index.html':['Visual Trust Strategy','builds visual trust','Four principal service areas:','As a member of AmCham Austria'],
  'hu/index.html':['Vizuális bizalomstratégia','vizuális bizalmat épít','Négy fő szolgáltatási terület:','Az AmCham Austria tagjaként'],
  'de-at/index.html':['Strategie für visuelles Vertrauen','visuelles Vertrauen aufbaut','Vier zentrale Leistungsbereiche:','Als Mitglied von AmCham Austria']
};`;
  s=requireEither(s,oldBlock,newBlock,'strategicCopy audit block');
  write(file,s);
}

// 2. Restore direct audit execution; the runtime wrapper is no longer needed.
{
  const file='package.json';
  let s=read(file);
  s=requireEither(s,'node tools/run-current-positioning-audit.mjs','node tools/audit-regression.mjs','package audit command');
  write(file,s);
}
{
  const file='.github/workflows/production-audit.yml';
  let s=read(file);
  s=requireEither(s,'node tools/run-current-positioning-audit.mjs','node tools/audit-regression.mjs','production workflow audit command');
  write(file,s);
}
if(fs.existsSync('tools/run-current-positioning-audit.mjs')) fs.rmSync('tools/run-current-positioning-audit.mjs');

// 3. Make the USP unmistakably visible on every homepage while preserving the current narrative structure.
const pages={
  'index.html':{
    signature:['One visual system. Built for trust.','Visual Trust Strategy'],
    heading:['A strong portrait speaks before the meeting begins.','We build visual trust before the meeting begins.'],
    intro:['A photograph can say a great deal about you. That you can be trusted. That you know where you are going. And that there are real people behind the company name. I create leadership portraits, brand photography and event images that tell the same story wherever they appear.','BANHALMI is a strategic visual partner for leaders and organisations. Executive portraiture, brand photography, C-level event imagery and fine-art authorship form one coherent system that builds visual trust wherever the images appear.']
  },
  'hu/index.html':{
    signature:['Egy vizuális rendszer. Bizalomra építve.','Vizuális bizalomstratégia'],
    heading:['A jó portré már az első találkozás előtt beszél.','Vizuális bizalmat építünk már az első találkozás előtt.'],
    intro:['Egy kép sok mindent elmondhat Önről. Azt, hogy lehet Önben bízni. Azt, hogy tudja, merre tart. És azt is, hogy milyen emberek állnak a vállalat mögött. Vezetői portrékat, brandfotókat és rendezvényképeket készítek, amelyek együtt is ugyanazt a történetet mesélik.','A BANHALMI stratégiai vizuális partner vezetőknek és szervezeteknek. Az executive portré, a brandfotózás, a C-level eseményfotózás és a képzőművészeti szerzőség egyetlen koherens rendszerben vizuális bizalmat épít minden megjelenési felületen.']
  },
  'de-at/index.html':{
    signature:['Ein visuelles System. Für Vertrauen gebaut.','Strategie für visuelles Vertrauen'],
    heading:['Ein starkes Porträt spricht schon vor der ersten Begegnung.','Wir schaffen visuelles Vertrauen vor der ersten Begegnung.'],
    intro:['Ein Bild kann viel über Sie erzählen. Dass man Ihnen vertrauen kann. Dass Sie wissen, wohin Sie wollen. Und dass hinter einem Unternehmen echte Menschen stehen. Ich fotografiere Führungskräfte, Marken und Veranstaltungen so, dass überall dieselbe Geschichte spürbar wird.','BANHALMI ist strategischer visueller Partner für Führungskräfte und Organisationen. Executive-Porträts, Markenfotografie, C-Level-Eventbilder und künstlerische Autorenschaft bilden ein kohärentes System, das an jedem Kontaktpunkt visuelles Vertrauen aufbaut.']
  }
};
for(const [file,c] of Object.entries(pages)){
  let s=read(file);
  for(const [from,to] of Object.values(c)) s=requireEither(s,from,to,`${file} visible USP copy`);
  write(file,s);
}

// 4. Connect the dedicated Service node into the canonical entity graph.
const service=JSON.parse(read('brand-positioning.jsonld'));
{
  const file='entity.jsonld';
  const data=JSON.parse(read(file));
  const graph=data['@graph']||[];
  if(!graph.some(x=>x['@id']===service['@id'])) graph.push(service);
  const org=graph.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#organization');
  if(!org) throw new Error('Organization node missing from entity.jsonld');
  org.subjectOf=Array.isArray(org.subjectOf)?org.subjectOf:org.subjectOf?[org.subjectOf]:[];
  if(!org.subjectOf.some(x=>x?.['@id']===service['@id'])) org.subjectOf.push({'@id':service['@id']});
  data['@graph']=graph;
  write(file,JSON.stringify(data,null,2)+'\n');
}

// 5. Add the Service node to each homepage JSON-LD graph.
for(const file of Object.keys(pages)){
  let s=read(file);
  let updated=false;
  s=s.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(full,json)=>{
    if(updated) return full;
    try{
      const data=JSON.parse(json);
      if(Array.isArray(data['@graph'])){
        if(!data['@graph'].some(x=>x['@id']===service['@id'])) data['@graph'].push(service);
        const org=data['@graph'].find(x=>x['@id']==='https://www.norbertbanhalmi.com/#organization');
        if(org){
          org.subjectOf=Array.isArray(org.subjectOf)?org.subjectOf:org.subjectOf?[org.subjectOf]:[];
          if(!org.subjectOf.some(x=>x?.['@id']===service['@id'])) org.subjectOf.push({'@id':service['@id']});
        }
        updated=true;
        return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
      }
    }catch{}
    return full;
  });
  if(!updated) throw new Error(`No homepage JSON-LD graph updated in ${file}`);
  write(file,s);
}

console.log('Final visual-trust hardening applied and verified as idempotent.');
