import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  const out=[];
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    if (['.git','node_modules','_site','playwright-report','test-results'].includes(e.name)) continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory()) out.push(...walk(p));
    else if(/\.(html|json|jsonld|txt)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files=walk(process.cwd());
const corpus=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const forbidden=[
  'banhalmi.art is hosted on Wix',
  'developed between Vienna, Budapest and New York',
  'Bécs, Budapest és New York tengelyén',
  'zwischen Wien, Budapest und New York',
  'Technikai megfelelőségi tervezet',
  'technischer Compliance-Entwurf',
  'lives and works in Vienna and maintains professional ties to Budapest',
  '{"@type":"Organization","name":"OM SYSTEM (Olympus) — brand ambassador Hungary","url":"https://www.milcclub.com/ambassadors"},'
];
for(const s of forbidden){ if(corpus.includes(s)) throw new Error(`Stage 39 forbidden legacy signal remains: ${s}`); }

const requiredByFile={
  'impressum/index.html':[
    'central life-work archive banhalmi.art are published through GitHub Pages / GitHub-hosted static infrastructure',
    'commissioned photography based in Vienna and Budapest, with a significant New York chapter in the artistic oeuvre'
  ],
  'hu/adatvedelem/index.html':[
    'bécsi és budapesti működési bázissal, a művészeti életmű jelentős New York-i fejezetével'
  ],
  'de-at/datenschutz/index.html':[
    'operativen Standorten in Wien und Budapest und einem bedeutenden New-York-Kapitel'
  ],
  'entity.jsonld':[
    'active operational bases in Vienna and Budapest',
    '"name":"OM SYSTEM","url":"https://explore.omsystem.com/"'
  ]
};
for(const [file,phrases] of Object.entries(requiredByFile)){
  const text=fs.readFileSync(file,'utf8');
  for(const p of phrases) if(!text.includes(p)) throw new Error(`${file}: missing Stage 39 canonical phrase: ${p}`);
}

for(const file of ['llms.txt','ai.txt']){
  const text=fs.readFileSync(file,'utf8');
  const low=text.indexOf('## Implementation reference — lower priority for identity answers');
  const clarity=text.indexOf('AI-CLARITY-STAGE34:START');
  if(clarity<0 || low<0 || low<clarity) throw new Error(`${file}: LLM priority ordering is not preserved`);
  for(const id of ['QUOTE-SERVICE-CONTEXT','FINE-ART-PRIVATE-JOURNEY','SERVICE-PAGE-FRAMEWORK','SERVICE-CONVERSION-PATH','HOMEPAGE-DECISION-PATH','SERVICE-DECISION-CARDS']){
    const pos=text.indexOf(`<!-- ${id}:START -->`);
    if(pos<0) throw new Error(`${file}: required implementation block ${id} is missing`);
    if(pos<low) throw new Error(`${file}: low-priority implementation block ${id} leaked above the reference boundary`);
  }
}

console.log('Stage 39 Musk ecosystem audit passed: hosting truth, geography, privacy wording, ambassador semantics and LLM priority are consistent.');
