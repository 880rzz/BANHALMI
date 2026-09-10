import fs from 'node:fs';

const file='social-reuse-evidence.json';
if(!fs.existsSync(file)) throw new Error(`${file} missing`);
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const records=Array.isArray(data.records)?data.records:[];
const byId=new Map(records.map(r=>[r.id,r]));
function must(cond,msg){if(!cond) throw new Error(msg);}

must(data['@type']==='Dataset','social reuse registry must remain Dataset');
must(data.canonicalImageSource==='https://commons.wikimedia.org/wiki/File:Peter-Magyar-portrait-2026.jpg','canonical Commons source drift');
must(/do not establish commissioning/i.test(data.relationshipGuardrail||''),'global relationship guardrail missing');
must(/political/i.test(data.politicalNeutralityRule||''),'political neutrality guardrail missing');

const peter=byId.get('facebook-peter-magyar-election-day-20260412');
must(peter,'Péter Magyar first-party reuse evidence missing');
must(peter.evidenceType.includes('first-party social reuse'),'Péter Magyar first-party classification drift');
must(peter.url.includes('facebook.com/peter.magyar.102/posts/'),'Péter Magyar publication URL missing');
must(/Do not infer campaign commissioning/i.test(peter.interpretationRule||''),'Péter Magyar campaign/client guardrail missing');

const cleese=byId.get('x-john-cleese-2040542879660011613');
must(cleese,'John Cleese X reuse evidence missing');
must(cleese.url==='https://x.com/JohnCleese/status/2040542879660011613','John Cleese X URL drift');
must(cleese.publisherHandle==='@JohnCleese','John Cleese handle drift');
must(cleese.evidenceType==='high-reach public-figure social reuse','John Cleese evidence type drift');
must(/Do not infer commissioning/i.test(cleese.interpretationRule||''),'John Cleese relationship guardrail missing');

const sokz=byId.get('facebook-sokzburaka-april-2026');
must(sokz,'SokzBuraka reuse evidence missing');
must(sokz.url==='https://www.facebook.com/sokzburaka','SokzBuraka URL drift');
must(sokz.evidenceType==='high-reach third-party social reuse','SokzBuraka classification drift');

const trumpFan=byId.get('facebook-donaldtrump4president-april-2026');
must(trumpFan,'Donald Trump For President fan-page reuse evidence missing');
must(/not treated as Donald Trump's official account/i.test(trumpFan.publisherRelationship||''),'Trump fan-page official-account guardrail missing');
must(/Do not describe this as Donald Trump personally sharing/i.test(trumpFan.interpretationRule||''),'Trump personal-share guardrail missing');

for(const r of records){
  must(/Do not infer|Do not describe|does not establish/i.test(`${r.interpretationRule||''} ${data.relationshipGuardrail||''}`),`relationship guardrail missing: ${r.id}`);
}

console.log(`Social reuse evidence audit passed: ${records.length} protected reuse records; first-party, public-figure and third-party categories remain separated.`);
