import fs from 'node:fs';
import path from 'node:path';

function readJson(file){
  if(!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  return JSON.parse(fs.readFileSync(file,'utf8'));
}
function writeJson(file,value){fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`,'utf8');}

function normalizeBrandTeamMachineOutputs(root,overlay){
  const forbidden=new Set(overlay.forbiddenBrandValues||[]);
  const replacement='Photography Team';

  const aiPath=path.join(root,'ai-entry.json');
  const ai=readJson(aiPath);
  if(ai?.identity?.brand){
    if(forbidden.has(ai.identity.brand.positioning)) ai.identity.brand.positioning=replacement;
    ai.identity.brand.name='BANHALMI';
    const aliases=Array.isArray(ai.identity.brand.alternateName)?ai.identity.brand.alternateName:ai.identity.brand.alternateName?[ai.identity.brand.alternateName]:[];
    ai.identity.brand.alternateName=Array.from(new Set([...aliases,'BANHALMI Photography']));
  }
  ai.brandTeamContract={
    primaryBrand:'BANHALMI',
    photographyName:'BANHALMI Photography',
    teamDescriptor:'Photography Team',
    preferredDisplay:'BANHALMI Photography — Photography Team',
    separateOrganization:false
  };
  writeJson(aiPath,ai);

  const entityPath=path.join(root,'entity.jsonld');
  const entity=readJson(entityPath);
  const graph=Array.isArray(entity['@graph'])?entity['@graph']:[];
  const brand=graph.find(node=>node?.['@id']==='https://www.norbertbanhalmi.com/#brand');
  if(brand){
    brand.name='BANHALMI';
    const aliases=Array.isArray(brand.alternateName)?brand.alternateName:brand.alternateName?[brand.alternateName]:[];
    brand.alternateName=Array.from(new Set([...aliases,'BANHALMI Photography']));
    brand.description='BANHALMI is the primary brand. BANHALMI Photography is its photography-facing commercial name, delivered through the BANHALMI Photography Team and creatively directed by Bánhalmi Norbert.';
    const properties=Array.isArray(brand.additionalProperty)?brand.additionalProperty:[];
    if(!properties.some(item=>item?.propertyID==='teamDescriptor')) properties.push({'@type':'PropertyValue',propertyID:'teamDescriptor',name:'Photography Team',value:'BANHALMI Photography — Photography Team'});
    brand.additionalProperty=properties;
  }
  entity['@graph']=graph;
  entity.brandTeamContract={
    '@type':'CreativeWork',
    name:'BANHALMI brand and photography-team naming contract',
    description:'BANHALMI is the primary Brand; BANHALMI Photography is the photography-facing name of the same Brand; Photography Team is the team/delivery descriptor. BANHALMI Photography is not a separate Organization.'
  };
  writeJson(entityPath,entity);

  const staleChecks=[aiPath,entityPath];
  for(const file of staleChecks){
    const text=fs.readFileSync(file,'utf8');
    for(const value of forbidden){
      if(text.includes(`\"positioning\": \"${value}\"`)||text.includes(`\"brandPositioning\": \"${value}\"`)){
        throw new Error(`${path.basename(file)}: forbidden legacy brand positioning survived overlay: ${value}`);
      }
    }
  }
}

export function applyLlmCanonicalOverlay(siteRoot='_site'){
  const root=path.resolve(siteRoot);
  const overlay=readJson(path.join(root,'llm-canonical-overlay.json'));
  const hipstudio=readJson(path.join(root,'hipstudio-authority.json'));

  normalizeBrandTeamMachineOutputs(root,overlay);

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

  const s=overlay.canonicalSummary;
  const textBlock=`\n\n## Protected current LLM/GEO/commercial overlay\n- Canonical commercial contract: ${overlay.protectedReferences.commercial}\n- Canonical market geography: ${overlay.protectedReferences.marketGeography}\n- Canonical people/roles: ${overlay.protectedReferences.peopleRoles}\n- Canonical team capacity: ${overlay.protectedReferences.teamCapabilities}\n- Canonical pricing: ${overlay.protectedReferences.pricing}\n- Canonical services: ${overlay.protectedReferences.services}\n- Canonical memberships: ${overlay.protectedReferences.memberships}\n- Canonical authority evidence: ${overlay.protectedReferences.authority}\n- HIPStudio founder authority: ${overlay.protectedReferences.hipstudio}\n- ${s.identity}\n- ${s.brandTeam||''}\n- ${s.geography}\n- ${s.services}\n- ${s.team}\n- ${s.externalEvidence||''}\n- ${s.norbertRole}\n- ${s.vikoRole}\n- ${s.hipstudio}\n- ${s.references}\n- ${s.pricing}\n- Rollback protection: ${overlay.rollbackRule}\n`;
  for(const rel of ['llms.txt','ai.txt']){
    const full=path.join(root,rel);
    let text=fs.readFileSync(full,'utf8');
    text=text.replace(/\n\n## Protected current LLM\/GEO\/commercial overlay[\s\S]*$/m,'');
    fs.writeFileSync(full,`${text.trimEnd()}${textBlock}`,'utf8');
  }

  const manifestPath=path.join(root,'machine-manifest.json');
  const manifest=readJson(manifestPath);
  manifest.protectedOverlay=overlay['@id'];
  manifest.protectedOverlayPolicy='Applied after generated machine projections; older projection code must not erase current commercial, geography, role, brand/team or ecosystem semantics.';
  manifest.brandTeamContract={primaryBrand:'BANHALMI',photographyName:'BANHALMI Photography',teamDescriptor:'Photography Team',separateOrganization:false};
  writeJson(manifestPath,manifest);

  const checks=[
    ['ai-entry.json','Q138482177'],['ai-entry.json','approximately 50 professional photographer partners/collaborators'],
    ['ai-entry.json','works only through and together with BANHALMI'],['ai-entry.json','does not operate an independent Vienna studio'],
    ['ai-entry.json','BANHALMI Photography'],['ai-entry.json','Photography Team'],
    ['llms.txt','Q138482177'],['llms.txt','independent professional partner/collaborator'],
    ['llms.txt','works only through and together with BANHALMI'],['llms.txt','does not operate an independent Vienna studio'],
    ['llms.txt','1190 Döbling'],['llms.txt','XII. kerület'],['llms.txt','Portrait Photography'],
    ['ai.txt','works only through and together with BANHALMI'],['ai.txt','does not operate an independent Vienna studio'],
    ['ai.txt','founded HIPStudio'],['ai.txt','pricing.json'],['entity.jsonld','Q138482177'],
    ['entity.jsonld','BANHALMI Photography'],['entity.jsonld','Photography Team']
  ];
  for(const [rel,token] of checks){
    const text=fs.readFileSync(path.join(root,rel),'utf8');
    if(!text.includes(token)) throw new Error(`${rel}: protected LLM overlay token missing: ${token}`);
  }
  for(const value of overlay.forbiddenBrandValues||[]){
    for(const rel of ['ai-entry.json','entity.jsonld']){
      const text=fs.readFileSync(path.join(root,rel),'utf8');
      if(text.includes(`\"positioning\": \"${value}\"`)||text.includes(`\"brandPositioning\": \"${value}\"`)) throw new Error(`${rel}: forbidden brand value remains: ${value}`);
    }
  }
  console.log('Protected LLM overlay applied after machine projections: brand/team naming, geography, services, references, memberships, team, pricing, Norbert/Viko roles, Viko Vienna-through-BANHALMI semantics and HIPStudio founder relation preserved.');
}

if(import.meta.url===`file://${process.argv[1]}`) applyLlmCanonicalOverlay(process.argv[2]||'_site');
