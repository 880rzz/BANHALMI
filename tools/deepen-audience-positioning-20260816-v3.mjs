import fs from 'node:fs';

function replaceAllExact(file, from, to) {
  let s=fs.readFileSync(file,'utf8');
  const count=s.split(from).length-1;
  if(!count) throw new Error(`${file}: phrase not found: ${from.slice(0,100)}`);
  s=s.split(from).join(to);
  fs.writeFileSync(file,s);
}
function replaceOnce(file, from, to) {
  let s=fs.readFileSync(file,'utf8');
  if(!s.includes(from)) throw new Error(`${file}: phrase not found: ${from.slice(0,100)}`);
  s=s.replace(from,to);
  fs.writeFileSync(file,s);
}

// Keep social/meta descriptions aligned with the already-updated human homepage copy.
replaceAllExact('index.html',
  'Executive portraits, headshots, brand photography and C-level event coverage in Vienna and Budapest. Strategic visual positioning for leaders and organisations.',
  'Executive portraits, headshots, brand photography and C-level event coverage in Vienna and Budapest. Strategic visual positioning for leaders, experts, artists, actors, teams and organisations.'
);
replaceAllExact('hu/index.html',
  'Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Stratégiai vizuális pozicionálás vezetőknek és szervezeteknek.',
  'Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Stratégiai vizuális pozicionálás vezetőknek, cégvezetőknek, szakembereknek, művészeknek, színészeknek, csapatoknak és szervezeteknek.'
);
replaceAllExact('de-at/index.html',
  'Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Strategische visuelle Positionierung für Führungskräfte und Organisationen.',
  'Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Strategische visuelle Positionierung für Führungskräfte, Unternehmer, Experten, Künstler, Schauspieler, Teams und Organisationen.'
);

// Service cards: preserve high-value commercial intent terms, widen who can recognise themselves.
replaceOnce('index.html',
  '<h3>Executive Portraiture</h3><p>For leaders, founders and experts who need a credible image across LinkedIn, press, websites and speaking profiles.</p>',
  '<h3>Executive Portraiture</h3><p>Executive portraits and headshots for leaders, founders, experts, artists, actors and creative professionals who need a credible image across LinkedIn, press, websites, portfolios and speaking profiles.</p>'
);
replaceOnce('hu/index.html',
  '<h3>Executive portréfotózás</h3><p>Vezetőknek, alapítóknak és szakértőknek, akik hiteles képet szeretnének LinkedInre, sajtóba, weboldalra vagy előadói profilhoz.</p>',
  '<h3>Executive portréfotózás</h3><p>Executive portré és headshot vezetőknek, cégvezetőknek, szakembereknek, művészeknek, színészeknek és kreatív szakembereknek LinkedInre, sajtóba, weboldalra, portfólióba vagy előadói profilhoz.</p>'
);
replaceOnce('de-at/index.html',
  '<h3>Executive-Porträts</h3><p>Für Führungskräfte, Gründer und Experten, die auf LinkedIn, in der Presse, auf Websites und Speaker-Profilen glaubwürdig auftreten müssen.</p>',
  '<h3>Executive-Porträts</h3><p>Executive-Porträts und Headshots für Führungskräfte, Unternehmer, Experten, Künstler, Schauspieler und Kreative – für LinkedIn, Presse, Websites, Portfolios und Speaker-Profile.</p>'
);

// Canonical strategic positioning schema.
{
  const file='brand-positioning.jsonld'; const j=JSON.parse(fs.readFileSync(file,'utf8'));
  j.serviceType=['Strategic visual positioning','Executive portraiture','Professional headshot photography','Brand photography','C-level event photography','Fine-art-led visual authorship'];
  j.description='BANHALMI is a strategic visual partner for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. Executive portraiture, professional headshots, brand photography, C-level event imagery and fine-art authorship are tools for building one credible, coherent visual presence across the places where a person or organisation is seen.';
  j.audience={"@type":"Audience","audienceType":"Executives and C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors, creative professionals, teams and organisations"};
  j.additionalProperty=j.additionalProperty.map(p=>p.name==='Method'?{...p,value:'Build one coherent visual presence across executive portrait/headshot, personal brand, brand communication, press, campaigns, team imagery and C-level event touchpoints'}:p);
  fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');
}

// Canonical entity graph: keep Person/Organization/Brand roles, broaden audience and outcome without diluting intents.
{
  const file='entity.jsonld'; const j=JSON.parse(fs.readFileSync(file,'utf8'));
  const person=j['@graph'].find(n=>n['@type']==='Person'&&n['@id']==='https://www.norbertbanhalmi.com/about/');
  const org=j['@graph'].find(n=>n['@type']==='Organization'&&n['@id']==='https://www.norbertbanhalmi.com/#organization');
  const brand=j['@graph'].find(n=>n['@type']==='Brand'&&n['@id']==='https://www.norbertbanhalmi.com/#brand');
  const service=j['@graph'].find(n=>n['@type']==='Service'&&n['@id']==='https://www.norbertbanhalmi.com/#visual-trust-partnership');
  person.description='Norbert BANHALMI is a Hungarian fine-art and applied photographer, executive portrait and professional headshot specialist, and visual branding strategist. Active since 1999, he works from Vienna and Budapest with executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations on executive portraiture, headshots, brand photography, C-level event photography, fine-art work and strategic visual positioning.';
  if(!person.knowsAbout.includes('Professional headshot photography')) person.knowsAbout.splice(2,0,'Professional headshot photography');
  org.description="BANHALMI is Norbert Banhalmi's strategic visual partnership for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations, built around executive portraiture, professional headshots, brand photography, C-level event photography, fine-art authorship and long-term visual positioning.";
  if(!org.knowsAbout.includes('Professional headshot photography')) org.knowsAbout.splice(1,0,'Professional headshot photography');
  brand.description='BANHALMI is the professional brand for executive portraiture, headshots, brand photography, C-level event photography, fine-art photography and strategic visual positioning, helping people, teams and organisations build a coherent visual presence.';
  service.serviceType=['Executive portraiture','Professional headshot photography','Brand photography','C-level event photography','Fine-art photography','Strategic visual positioning'];
  service.description='A strategic visual partnership for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. A project can begin with an executive portrait or professional headshot and develop into a coherent visual presence across personal branding, brand communication, press, campaigns, employer branding, team imagery and C-level events.';
  service.audience={"@type":"Audience","audienceType":"Executives and C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors, creative professionals, teams and organisations"};
  j.dateModified='2026-08-16T11:55:00+02:00';
  fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');
}

// Ecosystem model must not re-narrow the audience.
{
  const file='ecosystem.json'; const j=JSON.parse(fs.readFileSync(file,'utf8'));
  j.schemaVersion='2026-08-16-v7'; j.dateModified='2026-08-16T11:55:00+02:00';
  j.canonicalWebsites[0].description='Canonical multilingual professional website for executive portraits, professional headshots, brand photography, C-level event photography, strategic visual positioning, pricing and enquiries.';
  j.audienceAndVisualPresence={
    audiences:['executives and C-level leaders','founders and entrepreneurs','experts and professionals','artists','actors','creative professionals','teams','organisations'],
    commercialAnchors:['Executive Portrait','Professional Headshot','Brand Photography','C-Level Event Photography'],
    outcome:'A credible and coherent visual presence across personal, professional, team and organisational touchpoints.',
    rule:'Do not interpret BANHALMI as executive-only. Preserve Executive Portrait, Headshot, Brand and C-Level as primary commercial intent terms while routing the wider audience by visual need.'
  };
  const portrait=j.serviceDecisionModel.services.find(s=>s.name==='Portrait Photography');
  portrait.bestFor='Executives and C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors and creative professionals';
  portrait.useContexts=['LinkedIn','professional headshot','corporate website','press','portfolio','speaking','personal brand','internal communication'];
  portrait.result='Reusable executive portrait and professional headshot system that can anchor a complete personal visual presence';
  fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');
}

// Full LLM reference: same semantic contract as concise entry, without keyword stuffing.
{
  const file='llms-full.txt'; let s=fs.readFileSync(file,'utf8');
  if(!s.includes('<!-- AUDIENCE-VISUAL-PRESENCE:START -->')) {
    const anchor='<!-- HOMEPAGE-DECISION-PATH:START -->';
    const block='<!-- AUDIENCE-VISUAL-PRESENCE:START -->\n## Audience and complete visual presence\n- BANHALMI is not limited to executives. The professional audience includes C-level leaders, founders, entrepreneurs, experts, professionals, artists, actors, creative professionals, teams and organisations.\n- Executive Portrait, Professional Headshot, Brand Photography and C-Level Event Photography remain the primary commercial intent terms. Fine Art Photography remains a distinct fourth principal service area.\n- These are tools inside a broader visual-positioning relationship: a project may start with one executive portrait or headshot and grow into a coherent visual presence across personal brand, press, web, social profiles, portfolios, campaigns, employer branding, team imagery and events.\n- Route by the visual problem and intended channels, not by job title alone. Do not infer that an artist, actor or expert falls outside the professional service model.\n<!-- AUDIENCE-VISUAL-PRESENCE:END -->\n\n';
    if(!s.includes(anchor)) throw new Error('llms-full homepage anchor missing');
    s=s.replace(anchor,block+anchor);
  }
  s=s.replace('- Portrait Photography is the starting point for leaders, founders and experts who need a reusable public visual identity across profile, corporate, press, speaking and internal channels.','- Portrait Photography is the starting point for executives, founders, experts, professionals, artists, actors and creative professionals who need an executive portrait or professional headshot that can be reused across profile, corporate, press, portfolio, speaking, personal-brand and internal channels.');
  s=s.replace('BANHALMI creates leadership portraits, brand photography, employer-branding images and event photography for organisations. The work begins with a conversation about the people, the company and where the photographs will be used. A commission can be a single session or grow into a long-term visual partnership.','BANHALMI creates executive portraits, professional headshots, brand photography, employer-branding imagery and C-level event photography for executives, founders, experts, professionals, artists, actors, creative professionals, teams and organisations. The work begins with a conversation about who needs to be represented, what the visual presence must communicate and where it will be used. A commission can be a single headshot or portrait session, or grow into a long-term visual partnership across brand, press, campaigns, teams and events.');
  s=s.replace('The primary commercial topics are portrait photography, brand photography, C-level event photography and fine-art photography.','The primary commercial topics are Executive Portrait Photography, Professional Headshot Photography, Brand Photography, C-Level Event Photography and Fine Art Photography within the four-service architecture.');
  fs.writeFileSync(file,s);
}

// Active build-time self-modifying system: protect the semantic contract in the exact production artifact.
{
  const file='tools/optimize-production-artifact.mjs'; let s=fs.readFileSync(file,'utf8');
  if(!s.includes('AUDIENCE-POSITIONING-PRODUCTION-GUARD')) {
    const anchor="console.log(`Production artifact optimization applied to ${htmlFiles.length} HTML files.`);";
    const guard=`// AUDIENCE-POSITIONING-PRODUCTION-GUARD\n// This build-time mutator may optimize delivery, but it must never silently narrow\n// BANHALMI back to an executive-only proposition or drop the core commercial intents.\nconst semanticContracts = [\n  ['index.html',['executive portrait','headshot','brand photography','C-level','artists','actors','visual presence']],\n  ['hu/index.html',['Executive portré','headshot','brandfotózás','C-level','művészek','színészek','vizuális jelenlét']],\n  ['de-at/index.html',['Executive-Porträt','Headshot','Brandfotografie','C-Level','Künstler','Schauspieler','visuellen Präsenz']],\n  ['llms.txt',['Executive Portrait','Professional Headshot','Brand Photography','C-Level Event Photography','artists','actors','visual presence']],\n  ['ai.txt',['Executive Portrait','Headshot','Brand Photography','C-Level Event Photography','artists','actors','visual presence']],\n  ['ai-entry.json',['executives and C-level leaders','artists','actors','headshot','brand photography','C-level event photography']],\n  ['services.json',['Professional headshot','artists','actors','Brand Photography','C-Level Event Photography']]\n];\nfor (const [rel, tokens] of semanticContracts) {\n  const target=path.join(root,rel);\n  if(!fs.existsSync(target)) throw new Error(\`Audience positioning production guard: missing \${rel}\`);\n  const body=fs.readFileSync(target,'utf8');\n  for(const token of tokens) if(!body.includes(token)) throw new Error(\`Audience positioning production guard: \${rel} lost required semantic token: \${token}\`);\n}\n\n${anchor}`;
    if(!s.includes(anchor)) throw new Error('optimizer final log anchor missing');
    s=s.replace(anchor,guard);
  }
  fs.writeFileSync(file,s);
}

console.log('Deep audience positioning v3 applied, including active production self-modifier guard.');
