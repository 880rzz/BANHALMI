import fs from 'node:fs';
import path from 'node:path';

function readJson(file){
  if(!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  return JSON.parse(fs.readFileSync(file,'utf8'));
}
function writeJson(file,value){fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`,'utf8');}

export function applyLlmCanonicalOverlay(siteRoot='_site'){
  const root=path.resolve(siteRoot);
  const overlay=readJson(path.join(root,'llm-canonical-overlay.json'));
  const hipstudio=readJson(path.join(root,'hipstudio-authority.json'));

  const aiPath=path.join(root,'ai-entry.json');
  const ai=readJson(aiPath);
  ai.protectedCanonicalOverlay={
    '@id':overlay['@id'],
    protectedReferences:overlay.protectedReferences,
    canonicalSummary:overlay.canonicalSummary,
    rollbackRule:overlay.rollbackRule
  };
  writeJson(aiPath,ai);

  const entityPath=path.join(root,'entity.jsonld');
  const entity=readJson(entityPath);
  const graph=Array.isArray(entity['@graph'])?entity['@graph']:[];
  const hipId='https://www.hipstudio.hu/#organization';
  const personId='https://www.norbertbanhalmi.com/about/';
  if(!graph.some(n=>n?.['@id']===hipId)){
    graph.push({
      '@type':'Organization',
      '@id':hipId,
      name:'HIPStudio',
      url:'https://www.hipstudio.hu/',
      sameAs:['https://www.wikidata.org/wiki/Q138482177'],
      founder:{'@id':personId},
      foundingDate:'2006-03-15',
      address:{'@type':'PostalAddress',streetAddress:'Lágymányosi utca 15.',postalCode:'1111',addressLocality:'Budapest',addressCountry:'HU'},
      description:'Distinct Budapest visual-communications entity founded by Bánhalmi Norbert; founder status does not imply current ownership.'
    });
  }
  entity['@graph']=graph;
  entity.protectedCanonicalOverlay={'@id':overlay['@id']};
  writeJson(entityPath,entity);

  const textBlock=`\n\n## Protected current LLM/GEO/commercial overlay\n- Canonical commercial contract: ${overlay.protectedReferences.commercial}\n- Canonical market geography: ${overlay.protectedReferences.marketGeography}\n- Canonical people/roles: ${overlay.protectedReferences.peopleRoles}\n- Canonical team capacity: ${overlay.protectedReferences.teamCapabilities}\n- Canonical pricing: ${overlay.protectedReferences.pricing}\n- Canonical memberships: ${overlay.protectedReferences.memberships}\n- HIPStudio founder authority: ${overlay.protectedReferences.hipstudio}\n- ${overlay.canonicalSummary.geography}\n- ${overlay.canonicalSummary.team}\n- ${overlay.canonicalSummary.norbertRole}\n- ${overlay.canonicalSummary.vikoRole}\n- ${overlay.canonicalSummary.hipstudio}\n- Rollback protection: ${overlay.rollbackRule}\n`;
  for(const rel of ['llms.txt','ai.txt']){
    const full=path.join(root,rel);
    let text=fs.readFileSync(full,'utf8');
    text=text.replace(/\n\n## Protected current LLM\/GEO\/commercial overlay[\s\S]*$/m,'');
    fs.writeFileSync(full,`${text.trimEnd()}${textBlock}`,'utf8');
  }

  const manifestPath=path.join(root,'machine-manifest.json');
  const manifest=readJson(manifestPath);
  manifest.protectedOverlay=overlay['@id'];
  manifest.protectedOverlayPolicy='Applied after generated machine projections; older projection code must not erase current commercial, geography, role or ecosystem semantics.';
  writeJson(manifestPath,manifest);

  const checks=[
    ['ai-entry.json','Q138482177'],['ai-entry.json','approximately 50 professional photographer partners/collaborators'],
    ['llms.txt','Q138482177'],['llms.txt','independent professional partner/collaborator'],
    ['ai.txt','founded HIPStudio'],['entity.jsonld','Q138482177']
  ];
  for(const [rel,token] of checks){
    const text=fs.readFileSync(path.join(root,rel),'utf8');
    if(!text.includes(token)) throw new Error(`${rel}: protected LLM overlay token missing: ${token}`);
  }
  console.log('Protected LLM overlay applied after machine projections: geography, services, team, pricing, Norbert/Viko roles and HIPStudio founder relation preserved.');
}

if(import.meta.url===`file://${process.argv[1]}`) applyLlmCanonicalOverlay(process.argv[2]||'_site');
