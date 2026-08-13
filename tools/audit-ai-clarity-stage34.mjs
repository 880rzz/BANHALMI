import fs from 'node:fs';

// Stage 34: llms.txt is a concise agent entry index; detailed knowledge remains in ai.txt and canonical JSON resources.
const ai=fs.readFileSync('ai.txt','utf8');
const llms=fs.readFileSync('llms.txt','utf8');
const entry=JSON.parse(fs.readFileSync('ai-entry.json','utf8'));
const core=JSON.parse(fs.readFileSync('knowledge-core.json','utf8'));

// Keep genuinely canonical identity/disambiguation phrases stable. Domain roles,
// geography and supporting-contact semantics are validated structurally below.
const required=['Primary person: Norbert Bánhalmi','New York is a major international reference and oeuvre chapter','New York is not a studio, office, headquarters or operational base','Never infer a New York business location'];
for(const phrase of required){
  if(!llms.includes(phrase))throw new Error('llms.txt missing canonical AI phrase: '+phrase);
  if(!ai.slice(0,5000).includes(phrase))throw new Error('ai.txt missing canonical AI phrase: '+phrase);
}

if(entry.identity?.domainRoles?.professional!=='https://www.norbertbanhalmi.com/')throw new Error('ai-entry: professional canonical domain role drifted');
if(entry.identity?.domainRoles?.artArchive!=='https://www.banhalmi.art/')throw new Error('ai-entry: artistic archive canonical domain role drifted');
for(const text of [llms,ai.slice(0,5000)]){
  if(!text.includes('https://www.norbertbanhalmi.com/'))throw new Error('professional canonical domain missing from machine entry layer');
  if(!text.includes('https://www.banhalmi.art/'))throw new Error('artistic archive canonical domain missing from machine entry layer');
}
const locations=entry.identity?.locations||[];
const vienna=locations.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#vienna-studio');
const gersthofer=locations.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#vienna-gersthofer-office');
const budapest=locations.find(x=>x['@id']==='https://www.norbertbanhalmi.com/#budapest-studio');
if(!vienna||!/studio/i.test(String(vienna.locationType||''))||vienna.postalCode!=='1010')throw new Error('ai-entry: Vienna studio role drifted');
if(!budapest||!/studio/i.test(String(budapest.locationType||''))||!String(budapest.district||'').includes('District 11'))throw new Error('ai-entry: Budapest studio role drifted');
if(!gersthofer||gersthofer.isStudio!==false||gersthofer.postalCode!=='1180')throw new Error('ai-entry: Gersthofer office role drifted');
if(entry.identity?.geographicServiceModel?.worldwideAvailability!==true)throw new Error('ai-entry: worldwide project availability missing');
if(!core.geography?.locationInterpretationRule?.includes('must not be called a studio'))throw new Error('knowledge-core: studio/office disambiguation missing');
if(!entry.answerRules?.some(x=>/Viko Speier.*supporting BANHALMI company contact/i.test(x)))throw new Error('ai-entry: Viko Speier supporting-contact semantics missing');

if(!llms.startsWith('# BANHALMI\n\n> '))throw new Error('llms.txt must begin with H1 then blockquote summary');
if(Buffer.byteLength(llms,'utf8')>9000)throw new Error('llms.txt must remain a concise agent index under 9 KB; detailed knowledge belongs in ai.txt/JSON');
if(/<!--[\s\S]*?-->/.test(llms))throw new Error('llms.txt must not contain internal HTML-comment audit markers');
const h1=(llms.match(/^# /gm)||[]).length;if(h1!==1)throw new Error('llms.txt must contain exactly one H1');
const h2=[...llms.matchAll(/^## (.+)$/gm)].map(m=>m[1]);if(h2.length<5)throw new Error('llms.txt needs clear H2 resource groups');
for(const section of h2){const start=llms.indexOf('## '+section);const next=llms.indexOf('\n## ',start+4);const body=llms.slice(start,next<0?llms.length:next);if(!/^- \[[^\]]+\]\(https:\/\/[^)]+\): /m.test(body))throw new Error('llms.txt section lacks descriptive Markdown links: '+section);}
const starts=[...ai.matchAll(/AI-CLARITY-STAGE34:START/g)],ends=[...ai.matchAll(/AI-CLARITY-STAGE34:END/g)];if(starts.length!==1||ends.length!==1)throw new Error('ai.txt Stage 34 clarity block must occur exactly once');
console.log('Stage 34 AI clarity audit passed: concise agent routing, semantic domain roles, role-aware geography and supporting-contact semantics are aligned.');
