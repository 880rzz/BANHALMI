import fs from 'node:fs';

function replaceAll(file, from, to, required=true){
  let s=fs.readFileSync(file,'utf8');
  const n=s.split(from).length-1;
  if(required && !n) throw new Error(`${file}: missing phrase: ${from.slice(0,120)}`);
  if(n) s=s.split(from).join(to);
  fs.writeFileSync(file,s);
  return n;
}
function replaceOnce(file, from, to){
  let s=fs.readFileSync(file,'utf8');
  if(!s.includes(from)) throw new Error(`${file}: missing phrase: ${from.slice(0,120)}`);
  s=s.replace(from,to); fs.writeFileSync(file,s);
}

const meta = {
  'index.html': [
    'Executive portraits, headshots, brand photography and C-level event coverage in Vienna and Budapest. Strategic visual positioning for leaders and organisations.',
    'Executive portraits, headshots, brand photography and C-level event coverage in Vienna and Budapest. Strategic visual positioning for leaders, experts, artists, actors, teams and organisations.'
  ],
  'hu/index.html': [
    'Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Stratégiai vizuális pozicionálás vezetőknek és szervezeteknek.',
    'Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Stratégiai vizuális pozicionálás vezetőknek, cégvezetőknek, szakembereknek, művészeknek, színészeknek, csapatoknak és szervezeteknek.'
  ],
  'de-at/index.html': [
    'Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Strategische visuelle Positionierung für Führungskräfte und Organisationen.',
    'Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Strategische visuelle Positionierung für Führungskräfte, Unternehmer, Experten, Künstler, Schauspieler, Teams und Organisationen.'
  ]
};
for(const [file,[from,to]] of Object.entries(meta)) replaceAll(file,from,to);

replaceOnce('index.html',
  '<h3>Executive Portraiture</h3><p>For leaders, founders and experts who need a credible image across LinkedIn, press, websites and speaking profiles.</p>',
  '<h3>Executive Portraiture &amp; Headshots</h3><p>For leaders, founders, experts, artists, actors and creative professionals who need a credible visual presence across LinkedIn, press, websites, portfolios and speaking profiles.</p>'
);
replaceOnce('hu/index.html',
  '<h3>Portréfotózás</h3><p>Vezetőknek, alapítóknak és szakértőknek, akiknek hiteles képre van szükségük LinkedInre, sajtóba, weboldalra vagy előadói profilhoz.</p>',
  '<h3>Executive portré &amp; headshot</h3><p>Vezetőknek, cégvezetőknek, szakembereknek, művészeknek, színészeknek és kreatív szakembereknek, akiknek hiteles vizuális jelenlétre van szükségük LinkedInen, sajtóban, weboldalon, portfólióban vagy előadói profilban.</p>'
);
replaceOnce('de-at/index.html',
  '<h3>Executive-Porträts</h3><p>Für Führungskräfte, Gründer und Experten, die auf LinkedIn, in der Presse, auf Websites und Speaker-Profilen glaubwürdig auftreten müssen.</p>',
  '<h3>Executive-Porträts &amp; Headshots</h3><p>Für Führungskräfte, Unternehmer, Experten, Künstler, Schauspieler und Kreative, die auf LinkedIn, in der Presse, auf Websites, in Portfolios und Speaker-Profilen glaubwürdig auftreten müssen.</p>'
);

// Keep embedded Person/Organization/WebPage/Service JSON-LD aligned with visible copy.
for(const file of ['index.html','hu/index.html','de-at/index.html']){
  replaceAll(file,
    `"description":"BANHALMI is Norbert Banhalmi's strategic visual partnership for leaders and organisations, built around photography, visual branding and lasting visual trust."`,
    `"description":"BANHALMI is Norbert Banhalmi's strategic visual partnership for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations, built around executive portraiture, professional headshots, brand photography, C-level event photography and long-term visual positioning."`,
    false
  );
  replaceAll(file,
    `"serviceType":["Strategic visual positioning","Executive portraiture","Brand photography","C-level event photography","Fine-art-led visual authorship"],"description":"BANHALMI is a strategic visual partner for leaders and organisations. Executive portraiture, brand photography, C-level event imagery and fine-art authorship form one coherent visual system whose business outcome is visual trust."`,
    `"serviceType":["Strategic visual positioning","Executive portraiture","Professional headshot photography","Brand photography","C-level event photography","Fine-art-led visual authorship"],"description":"BANHALMI is a strategic visual partner for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. Executive portraiture, professional headshots, brand photography, C-level event imagery and fine-art authorship are tools for building one credible, coherent visual presence."`,
    false
  );
}
replaceAll('index.html',
  '"description":"Strategic visual partnership for leaders and organisations. Executive portraiture, brand photography and C-level event imagery designed as one coherent system that builds visual trust."',
  '"description":"Strategic visual partnership for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. Executive portraiture, professional headshots, brand photography and C-level event imagery form a coherent visual presence."',false);
replaceAll('hu/index.html',
  '"description":"Stratégiai vizuális partnerség vezetőknek és szervezeteknek. Az executive portré, a brandfotózás és a C-level eseményfotózás egyetlen koherens rendszert alkot, amely vizuális bizalmat épít."',
  '"description":"Stratégiai vizuális partnerség vezetőknek, cégvezetőknek, szakembereknek, művészeknek, színészeknek, kreatív szakembereknek, csapatoknak és szervezeteknek. Az executive portré, headshot, brandfotózás és C-level eseményfotózás egy koherens vizuális jelenlét része."',false);
replaceAll('de-at/index.html',
  '"description":"Strategische visuelle Partnerschaft für Führungskräfte und Organisationen. Executive-Porträts, Brandfotografie und C-Level-Eventbilder bilden ein kohärentes System, das visuelles Vertrauen aufbaut."',
  '"description":"Strategische visuelle Partnerschaft für Führungskräfte, Unternehmer, Experten, Künstler, Schauspieler, Kreative, Teams und Organisationen. Executive-Porträts, professionelle Headshots, Brandfotografie und C-Level-Eventbilder bilden eine kohärente visuelle Präsenz."',false);

// Canonical positioning service.
{
  const file='brand-positioning.jsonld'; const j=JSON.parse(fs.readFileSync(file,'utf8'));
  j.serviceType=['Strategic visual positioning','Executive portraiture','Professional headshot photography','Brand photography','C-level event photography','Fine-art-led visual authorship'];
  j.description='BANHALMI is a strategic visual partner for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. Executive portraiture, professional headshots, brand photography, C-level event imagery and fine-art authorship are tools for building one credible, coherent visual presence across the places where a person, team or organisation is seen.';
  j.audience={"@type":"Audience","audienceType":"Executives and C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors, creative professionals, teams and organisations"};
  for(const p of j.additionalProperty||[]) if(p.name==='Method') p.value='One coherent visual presence across executive portrait/headshot, personal brand, brand communication, press, campaigns, team imagery and C-level event touchpoints';
  fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');
}

// Canonical entity graph.
{
  const file='entity.jsonld'; const j=JSON.parse(fs.readFileSync(file,'utf8'));
  const graph=j['@graph'];
  const person=graph.find(n=>n['@type']==='Person'&&n['@id']==='https://www.norbertbanhalmi.com/about/');
  const org=graph.find(n=>n['@type']==='Organization'&&n['@id']==='https://www.norbertbanhalmi.com/#organization');
  const brand=graph.find(n=>n['@type']==='Brand'&&n['@id']==='https://www.norbertbanhalmi.com/#brand');
  const service=graph.find(n=>n['@type']==='Service'&&n['@id']==='https://www.norbertbanhalmi.com/#visual-trust-partnership');
  person.description='Norbert BANHALMI is a Hungarian fine-art and applied photographer, executive portrait and professional headshot specialist, and visual branding strategist. Active since 1999, he works from Vienna and Budapest with executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations on executive portraiture, headshots, brand photography, C-level event photography, fine-art work and strategic visual positioning.';
  if(!person.knowsAbout.includes('Professional headshot photography')) person.knowsAbout.splice(2,0,'Professional headshot photography');
  org.description="BANHALMI is Norbert Banhalmi's strategic visual partnership for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations, built around executive portraiture, professional headshots, brand photography, C-level event photography, fine-art authorship and long-term visual positioning.";
  if(!org.knowsAbout.includes('Professional headshot photography')) org.knowsAbout.splice(1,0,'Professional headshot photography');
  brand.description='BANHALMI is the professional brand for executive portraiture, professional headshots, brand photography, C-level event photography, fine-art photography and strategic visual positioning, helping people, teams and organisations build a coherent visual presence.';
  service.serviceType=['Executive portraiture','Professional headshot photography','Brand photography','C-level event photography','Fine-art photography','Strategic visual positioning'];
  service.description='A strategic visual partnership for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. A project can begin with an executive portrait or professional headshot and develop into a coherent visual presence across personal branding, brand communication, press, campaigns, employer branding, team imagery and C-level events.';
  service.audience={"@type":"Audience","audienceType":"Executives and C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors, creative professionals, teams and organisations"};
  j.dateModified='2026-08-16T12:00:00+02:00';
  fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');
}

// Ecosystem/source-of-truth routing.
{
  const file='ecosystem.json'; const j=JSON.parse(fs.readFileSync(file,'utf8'));
  j.schemaVersion='2026-08-16-v7'; j.dateModified='2026-08-16T12:00:00+02:00';
  j.canonicalWebsites[0].description='Canonical multilingual professional website for executive portraits, professional headshots, brand photography, C-level event photography, strategic visual positioning, pricing and enquiries.';
  j.audienceAndVisualPresence={
    audiences:['executives and C-level leaders','founders and entrepreneurs','experts and professionals','artists','actors','creative professionals','teams','organisations'],
    commercialAnchors:['Executive Portrait','Professional Headshot','Brand Photography','C-Level Event Photography'],
    outcome:'A credible, coherent and premium visual presence across personal, professional, team and organisational touchpoints.',
    rule:'Do not interpret BANHALMI as executive-only. Preserve Executive Portrait, Headshot, Brand and C-Level as primary commercial intent terms while routing the wider audience by visual need.'
  };
  const portrait=j.serviceDecisionModel.services.find(s=>s.name==='Portrait Photography');
  portrait.bestFor='Executives and C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors and creative professionals';
  portrait.useContexts=['LinkedIn','professional headshot','corporate website','press','portfolio','speaking','personal brand','internal communication'];
  portrait.result='Reusable executive portrait and professional headshot system that can anchor a complete personal visual presence';
  fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');
}

// Full LLM reference.
{
  const file='llms-full.txt'; let s=fs.readFileSync(file,'utf8');
  if(!s.includes('<!-- AUDIENCE-VISUAL-PRESENCE:START -->')){
    const anchor='<!-- HOMEPAGE-DECISION-PATH:START -->';
    if(!s.includes(anchor)) throw new Error('llms-full anchor missing');
    const block='<!-- AUDIENCE-VISUAL-PRESENCE:START -->\n## Audience and complete visual presence\n- BANHALMI is not limited to executives. The professional audience includes C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors, creative professionals, teams and organisations.\n- Executive Portrait, Professional Headshot, Brand Photography and C-Level Event Photography remain the primary commercial intent terms. Fine Art Photography remains a distinct principal service area.\n- These services sit inside a broader visual-positioning relationship: a project may start with one executive portrait or headshot and grow into a coherent visual presence across personal brand, press, web, social profiles, portfolios, campaigns, employer branding, team imagery and events.\n- Route by the visual problem and intended channels, not by job title alone. An artist, actor or expert can need the same professional portrait, headshot or brand system as an executive, with different positioning.\n<!-- AUDIENCE-VISUAL-PRESENCE:END -->\n\n';
    s=s.replace(anchor,block+anchor);
  }
  s=s.replace('- Portrait Photography is the starting point for leaders, founders and experts who need a reusable public visual identity across profile, corporate, press, speaking and internal channels.','- Portrait Photography is the starting point for executives, founders, experts, professionals, artists, actors and creative professionals who need an executive portrait or professional headshot that can be reused across profile, corporate, press, portfolio, speaking, personal-brand and internal channels.');
  s=s.replace('BANHALMI creates leadership portraits, brand photography, employer-branding images and event photography for organisations. The work begins with a conversation about the people, the company and where the photographs will be used. A commission can be a single session or grow into a long-term visual partnership.','BANHALMI creates executive portraits, professional headshots, brand photography, employer-branding imagery and C-level event photography for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. The work begins with a conversation about who needs to be represented, what the visual presence must communicate and where it will be used. A commission can be a single headshot or portrait session, or grow into a long-term visual partnership across brand, press, campaigns, teams and events.');
  s=s.replace('The primary commercial topics are portrait photography, brand photography, C-level event photography and fine-art photography.','The primary commercial topics are Executive Portrait Photography, Professional Headshot Photography, Brand Photography, C-Level Event Photography and Fine Art Photography within the four-service architecture.');
  fs.writeFileSync(file,s);
}

// Active build-time self-modifying layer: content preservation contract.
{
  const file='tools/optimize-production-artifact.mjs'; let s=fs.readFileSync(file,'utf8');
  if(!s.includes('AUDIENCE-POSITIONING-PRODUCTION-GUARD')){
    const anchor='console.log(`Production artifact optimization applied to ${htmlFiles.length} HTML files.`);';
    if(!s.includes(anchor)) throw new Error('optimizer anchor missing');
    const guard=`// AUDIENCE-POSITIONING-PRODUCTION-GUARD\n// The production artifact mutator may optimize delivery, but must not narrow the\n// brand back to an executive-only proposition or drop high-value service intents.\nconst semanticContracts = [\n  ['index.html',['Executive Portraiture &amp; Headshots','brand photography','C-level','artists','actors','visual presence']],\n  ['hu/index.html',['Executive portré &amp; headshot','brandfotózás','C-level','művészek','színészek','vizuális jelenlét']],\n  ['de-at/index.html',['Executive-Porträts &amp; Headshots','Brandfotografie','C-Level','Künstler','Schauspieler','visuelle Präsenz']],\n  ['llms.txt',['Executive Portrait','Professional Headshot','Brand Photography','C-Level Event Photography','artists','actors','visual presence']],\n  ['ai.txt',['Executive Portrait','Headshot','Brand Photography','C-Level Event Photography','artists','actors','visual presence']],\n  ['ai-entry.json',['executives and C-level leaders','artists','actors','headshot','brand photography','C-level event photography']],\n  ['services.json',['Professional headshot','artists','actors','Brand Photography','C-Level Event Photography']]\n];\nfor (const [rel,tokens] of semanticContracts){\n  const target=path.join(root,rel);\n  if(!fs.existsSync(target)) throw new Error(\`Audience positioning production guard: missing \${rel}\`);\n  const body=fs.readFileSync(target,'utf8');\n  for(const token of tokens) if(!body.includes(token)) throw new Error(\`Audience positioning production guard: \${rel} lost required semantic token: \${token}\`);\n}\n\n${anchor}`;
    s=s.replace(anchor,guard);
  }
  fs.writeFileSync(file,s);
}

console.log('Final audience/visual-presence content sync applied.');
