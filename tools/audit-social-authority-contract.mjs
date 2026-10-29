import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const SKIP=new Set(['.git','.github','node_modules','artifacts','_site']);
const retired=[
  'https://www.saatchiart.com/norbertbanhalmi',
  'https://www.tiktok.com/@banhalmi.norbert',
  'https://x.com/norbertbanhalmi'
];
const personal=[
  'https://www.linkedin.com/in/norbertbanhalmi/',
  'https://www.instagram.com/norbert.banhalmi/',
  'https://www.facebook.com/banhalmi.norbert',
  'https://www.youtube.com/@norbert.banhalmi',
  'https://www.pinterest.com/norbertbanhalmi/'
];
const company=[
  'https://www.linkedin.com/company/banhalmi/'
];
const personPortfolio=[
  'https://cherrydeck.com/norbert.banhalmi'
];
const personForbiddenProfessional=[
  'https://cherrydeck.com/profile/norbert.banhalmi'
];
const errors=[];

function files(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    if(SKIP.has(e.name)) return [];
    const full=path.join(dir,e.name);
    return e.isDirectory()?files(full):[full];
  });
}
function read(rel){return fs.readFileSync(path.join(ROOT,rel),'utf8');}

for(const file of files(ROOT)){
  if(!file.endsWith('.html')) continue;
  const rel=path.relative(ROOT,file).replaceAll('\\','/');
  const html=fs.readFileSync(file,'utf8');
  if(!html.includes('class="site-footer"')) continue;
  for(const url of [...retired,...personal,...personForbiddenProfessional]) if(html.includes(url)) errors.push(`${rel}: stale/personal social authority ${url}`);
  for(const url of [...company,...personPortfolio]) if(!html.includes(url)) errors.push(`${rel}: visible portfolio/company social missing ${url}`);
  const social=html.match(/<details class="footer-accordion" data-social-footer="">[\s\S]*?<\/details>/)?.[0]||'';
  if(!social) errors.push(`${rel}: social footer missing`);
  else{
    for(const url of [...company,...personPortfolio]) if(!social.includes(url)) errors.push(`${rel}: social footer missing ${url}`);
    for(const url of [...retired,...personal]) if(social.includes(url)) errors.push(`${rel}: social footer contains forbidden ${url}`);
  }
}

function extractSameAs(text, typeHint){
  try{
    const data=JSON.parse(text);
    const graph=Array.isArray(data['@graph'])?data['@graph']:[data];
    return graph.filter((node)=>{
      const types=Array.isArray(node?.['@type'])?node['@type']:[node?.['@type']];
      return types.includes(typeHint);
    });
  }catch{
    return [];
  }
}

for(const rel of ['entity.jsonld','person-authority.jsonld']){
  const text=read(rel);
  for(const url of [...retired,...personal,...personForbiddenProfessional]) if(text.includes(url)) errors.push(`${rel}: forbidden active identity ${url}`);
  for(const url of company) if(!text.includes(url)) errors.push(`${rel}: organization authority missing ${url}`);
  for(const url of personPortfolio) if(!text.includes(url)) errors.push(`${rel}: person portfolio authority missing ${url}`);
  const orgs=extractSameAs(text,'Organization').filter((node)=>String(node?.['@id']||'')==='https://www.banhalmiphotography.com/#organization');
  const people=extractSameAs(text,'Person').filter((node)=>String(node?.['@id']||'')==='https://www.banhalmiphotography.com/about/');
  for(const org of orgs){
    const same=Array.isArray(org.sameAs)?org.sameAs:[org.sameAs].filter(Boolean);
    for(const url of personPortfolio) if(same.includes(url)) errors.push(`${rel}: Cherrydeck must not remain Organization.sameAs`);
    for(const url of company) if(!same.includes(url)) errors.push(`${rel}: Organization.sameAs missing ${url}`);
  }
  for(const person of people){
    const same=Array.isArray(person.sameAs)?person.sameAs:[person.sameAs].filter(Boolean);
    for(const url of personPortfolio) if(!same.includes(url)) errors.push(`${rel}: Person.sameAs missing Cherrydeck portfolio ${url}`);
  }
}

const core=JSON.parse(read('data/machine-core.json'));
const orgProfiles=core.authorityOwnership?.professionalOrganization?.activeProfiles||[];
for(const url of company) if(!orgProfiles.includes(url)) errors.push(`machine-core: professional organization missing ${url}`);
for(const url of personPortfolio) if(orgProfiles.includes(url)) errors.push(`machine-core: Cherrydeck must not remain professionalOrganization.activeProfiles`);
const portfolioProfiles=core.authorityOwnership?.personPortfolioProfiles||[];
for(const url of personPortfolio) if(!portfolioProfiles.includes(url)) errors.push(`machine-core: personPortfolioProfiles missing ${url}`);
for(const url of retired) if(orgProfiles.includes(url)) errors.push(`machine-core: retired profile active ${url}`);
const artProfiles=core.authorityOwnership?.artisticPerson?.activeProfiles||[];
for(const url of personal.slice(0,4)) if(!artProfiles.includes(url)) errors.push(`machine-core: ART person ownership missing ${url}`);

const evidence=read('service-trust-evidence.json');
if(evidence.includes('https://www.saatchiart.com/norbertbanhalmi')) errors.push('service-trust-evidence.json: deleted Saatchi profile must not remain LIVE evidence');
if(evidence.includes('https://x.com/norbertbanhalmi')) errors.push('service-trust-evidence.json: retired personal X profile must not be active evidence');

if(errors.length){
  console.error('Social/entity authority contract failed:\n- '+errors.join('\n- '));
  process.exit(1);
}
console.log('Social/entity authority contract OK: Organization.sameAs uses company LinkedIn only; Cherrydeck is Person.sameAs portfolio; retired/personal profiles are absent from active Professional identity while ART ownership remains declared in machine-core.');

for (const file of ['ai.txt','llms-full.txt']) {
  const text=read(file);
  if (/Official profiles:[^\n]*(TikTok|\bX\b)/i.test(text)) errors.push(file+': retired TikTok/X must not be declared as active official profiles');
  if (/linked from every site footer[^\n]*(TikTok|\bX\b)/i.test(text)) errors.push(file+': stale footer social authority claim detected');
}
