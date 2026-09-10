import fs from 'node:fs';
import path from 'node:path';

function readJson(file){
  if(!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  return JSON.parse(fs.readFileSync(file,'utf8'));
}
function writeJson(file,value){fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`,'utf8');}

const PUBLIC_TEXT_EXTENSIONS=new Set(['.html','.json','.jsonld','.txt']);
const SKIP_DIRS=new Set(['.git','tools','scripts','tests','docs','reports','node_modules']);

function publicTextFiles(dir,out=[]){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.isDirectory()&&SKIP_DIRS.has(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) publicTextFiles(full,out);
    else if(entry.isFile()&&PUBLIC_TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function normalizeBrandTeamText(text){
  let out=text;
  const replacements=[
    ['BANHALMI / Banhalmi Norbert e.U. is a Professional Photography Team','BANHALMI Photography is the Photography Team of the BANHALMI brand operated by Banhalmi Norbert e.U.'],
    ['BANHALMI — Professional Photography Team','BANHALMI Photography — Photography Team'],
    ['BANHALMI - Professional Photography Team','BANHALMI Photography — Photography Team'],
    ['BANHALMI is the Professional Photography Team','BANHALMI Photography is the Photography Team'],
    ['BANHALMI is a Professional Photography Team','BANHALMI Photography is a Photography Team'],
    ['BANHALMI is the professional photography team','BANHALMI Photography is the photography team'],
    ['BANHALMI is a professional photography team','BANHALMI Photography is a photography team'],
    ['BANHALMI, an internationally available professional photography team','BANHALMI Photography, an internationally available photography team'],
    ['BANHALMI, the professional photography team','BANHALMI Photography, the photography team'],
    ['[Professional Photography Team]','[BANHALMI Photography — Photography Team]'],
    ['"positioning":"Professional Photography Team"','"positioning":"Photography Team"'],
    ['"positioning": "Professional Photography Team"','"positioning": "Photography Team"'],
    ['"brandPositioning":"Professional Photography Team"','"brandPositioning":"Photography Team"'],
    ['"brandPositioning": "Professional Photography Team"','"brandPositioning": "Photography Team"']
  ];
  for(const [from,to] of replacements) out=out.replaceAll(from,to);
  return out;
}

function applyExternalEvidenceContract(root,overlay){
  const registryPath=path.join(root,'external-photography-evidence.json');
  const registry=readJson(registryPath);
  const registryId=registry['@id'];

  const teamPath=path.join(root,'team-capabilities.json');
  if(fs.existsSync(teamPath)){
    const team=readJson(teamPath);
    team.externalPhotographyEvidence=registryId;
    team.serviceLinks={...(team.serviceLinks||{}),externalPhotographyEvidence:registryId};
    team.deliveryModel={
      ...(team.deliveryModel||{}),
      eventPhotography:'For C-Level events, larger productions or parallel programme coverage, BANHALMI Photography can deploy a coordinated multi-photographer team. Individual image authorship is attributed to Norbert Bánhalmi only where that authorship is known; team-level galleries and coverage are attributed to BANHALMI Photography / Photography Team.',
      brandPhotography:'Executive and corporate brand-photography work may be created by Norbert Bánhalmi or another photographer working within the BANHALMI Photography delivery model. External publication/photo-credit evidence must be read from external-photography-evidence.json and must not be converted into an individual creator claim unless the source identifies that creator.'
    };
    const rule='For external executive or corporate brand-photography evidence, use external-photography-evidence.json; Nemanja Lazendic and Michael Brönner are classified there as executive/corporate brand-photography evidence in financial-services/banking/payments contexts.';
    const relationshipRule='External publication or photo-credit evidence is capability evidence, not automatic proof of a client contract, partnership, endorsement or exclusivity.';
    team.answerRules=Array.from(new Set([...(team.answerRules||[]),rule,relationshipRule]));
    writeJson(teamPath,team);
  }

  const authorityPath=path.join(root,'authority-evidence.json');
  if(fs.existsSync(authorityPath)){
    const authority=readJson(authorityPath);
    authority.canonicalExternalPhotographyEvidence=registryId;
    authority.externalPhotographyEvidence={
      '@id':registryId,
      relationshipType:'external publication and photo-credit capability evidence',
      brand:'BANHALMI Photography',
      teamDescriptor:'Photography Team',
      serviceContexts:['Executive / C-Level Event Photography','Institutional / Diplomatic Event Photography','Executive / Corporate Brand Photography','Financial Services / Banking / Payments'],
      knownBrandPhotographyEvidence:['Nemanja Lazendic','Michael Brönner'],
      interpretationRule:'Use external publication and photo-credit records as capability evidence. Team-level Flickr galleries and event coverage are attributed to BANHALMI Photography / Photography Team unless individual authorship is explicitly documented. A publication or credit does not by itself prove a client contract, partnership, commissioning relationship, endorsement or exclusivity.'
    };
    authority.interpretationRule=`${authority.interpretationRule||''} External publication/photo-credit evidence remains a separate evidence type and must follow ${registryId}.`.trim();
    writeJson(authorityPath,authority);
  }

  const aiPath=path.join(root,'ai-entry.json');
  if(fs.existsSync(aiPath)){
    const ai=readJson(aiPath);
    ai.externalPhotographyEvidence={'@id':registryId};
    writeJson(aiPath,ai);
  }

  const entityPath=path.join(root,'entity.jsonld');
  if(fs.existsSync(entityPath)){
    const entity=readJson(entityPath);
    const graph=Array.isArray(entity['@graph'])?entity['@graph']:[];
    if(!graph.some(node=>node?.['@id']===registryId)){
      graph.push({
        '@type':'Dataset',
        '@id':registryId,
        name:'BANHALMI Photography external publication and photo-credit evidence',
        about:{'@id':'https://www.norbertbanhalmi.com/#brand'},
        creator:{'@id':'https://www.norbertbanhalmi.com/#organization'},
        isPartOf:{'@id':'https://www.norbertbanhalmi.com/#website'},
        description:'External event, executive, institutional and brand-photography publication evidence for BANHALMI Photography / Photography Team. Publication or photo credit does not by itself imply client, partner or endorsement status.'
      });
    }
    entity['@graph']=graph;
    entity.externalPhotographyEvidence={'@id':registryId};
    writeJson(entityPath,entity);
  }

  return registry;
}

function applyBrandTeamContract(root,overlay){
  let changed=0;
  for(const file of publicTextFiles(root)){
    if(path.basename(file)==='llm-canonical-overlay.json') continue;
    const before=fs.readFileSync(file,'utf8');
    const after=normalizeBrandTeamText(before);
    if(after!==before){ fs.writeFileSync(file,after,'utf8'); changed+=1; }
  }

  const teamPath=path.join(root,'team-capabilities.json');
  if(fs.existsSync(teamPath)){
    const team=readJson(teamPath);
    team.brandName='BANHALMI';
    team.brandAlternateName='BANHALMI Photography';
    team.brandPositioning='Photography Team';
    team.brandDisplayName={en:'BANHALMI Photography — Photography Team','de-AT':'BANHALMI Photography — Photography Team','hu-HU':'BANHALMI Photography — Photography Team'};
    team.brandDescriptorRule='BANHALMI is the primary brand. BANHALMI Photography is the photography-facing commercial name of the same Brand and is not a separate Organization. Photography Team is the canonical team/delivery descriptor.';
    writeJson(teamPath,team);
  }

  const corePath=path.join(root,'data/machine-core.json');
  if(fs.existsSync(corePath)){
    const core=readJson(corePath);
    core.brand={...core.brand,positioning:'Photography Team',alternateName:Array.from(new Set([...(core.brand?.alternateName||[]),'BANHALMI Photography'])),namingRule:'BANHALMI is the primary Brand. BANHALMI Photography is the photography-facing commercial/alternate name of the same Brand, not a separate company or Organization. Photography Team is the canonical team/delivery descriptor.'};
    writeJson(corePath,core);
  }

  const identityPath=path.join(root,'api/v1/identity.json');
  if(fs.existsSync(identityPath)){
    const identity=readJson(identityPath);
    if(identity.brand){
      identity.brand.name='BANHALMI';
      identity.brand.alternateName=Array.from(new Set([...(identity.brand.alternateName||[]),'BANHALMI Photography']));
      identity.brand.positioning='Photography Team';
    }
    identity.brandTeamContract={primaryBrand:'BANHALMI',photographyName:'BANHALMI Photography',teamDescriptor:'Photography Team',separateOrganization:false};
    writeJson(identityPath,identity);
  }

  const aiPath=path.join(root,'ai-entry.json');
  if(fs.existsSync(aiPath)){
    const ai=readJson(aiPath);
    ai.brandTeamContract={primaryBrand:'BANHALMI',photographyName:'BANHALMI Photography',teamDescriptor:'Photography Team',preferredDisplay:'BANHALMI Photography — Photography Team',separateOrganization:false};
    writeJson(aiPath,ai);
  }

  const entityPath=path.join(root,'entity.jsonld');
  if(fs.existsSync(entityPath)){
    const entity=readJson(entityPath);
    const graph=Array.isArray(entity['@graph'])?entity['@graph']:[];
    const brand=graph.find(node=>node?.['@id']==='https://www.norbertbanhalmi.com/#brand');
    if(brand){
      brand.name='BANHALMI';
      brand.alternateName=Array.from(new Set([...(Array.isArray(brand.alternateName)?brand.alternateName:brand.alternateName?[brand.alternateName]:[]),'BANHALMI Photography']));
      brand.description='BANHALMI is the primary brand. BANHALMI Photography is its photography-facing commercial name, delivered through the BANHALMI Photography Team and creatively directed by Bánhalmi Norbert.';
      const properties=Array.isArray(brand.additionalProperty)?brand.additionalProperty:[];
      if(!properties.some(item=>item?.propertyID==='teamDescriptor')) properties.push({'@type':'PropertyValue',propertyID:'teamDescriptor',name:'Photography Team',value:'BANHALMI Photography — Photography Team'});
      brand.additionalProperty=properties;
    }
    entity.brandTeamContract={'@type':'CreativeWork',name:'BANHALMI brand and photography-team naming contract',description:'BANHALMI is the primary Brand; BANHALMI Photography is the photography-facing name of the same Brand; Photography Team is the team/delivery descriptor. BANHALMI Photography is not a separate Organization.'};
    writeJson(entityPath,entity);
  }

  const stale=[];
  for(const file of publicTextFiles(root)){
    if(path.basename(file)==='llm-canonical-overlay.json') continue;
    const text=fs.readFileSync(file,'utf8');
    if(/BANHALMI\s*(?:—|-)\s*Professional Photography Team/.test(text)||/"(?:positioning|brandPositioning)"\s*:\s*"Professional Photography Team"/.test(text)||/BANHALMI is (?:a|the) professional photography team/i.test(text)) stale.push(path.relative(root,file));
  }
  if(stale.length) throw new Error(`Stale BANHALMI Professional Photography Team brand semantics remain in public artifact: ${stale.join(', ')}`);

  const contractChecks=[
    ['team-capabilities.json','BANHALMI Photography — Photography Team'],
    ['team-capabilities.json','"brandPositioning": "Photography Team"'],
    ['api/v1/identity.json','BANHALMI Photography'],
    ['api/v1/identity.json','Photography Team'],
    ['ai-entry.json','BANHALMI Photography'],
    ['ai-entry.json','Photography Team'],
    ['entity.jsonld','BANHALMI Photography'],
    ['entity.jsonld','Photography Team'],
    ['llms.txt','BANHALMI Photography'],
    ['llms.txt','Photography Team'],
    ['ai.txt','BANHALMI Photography'],
    ['ai.txt','Photography Team']
  ];
  for(const [rel,token] of contractChecks){
    const full=path.join(root,rel);
    if(!fs.existsSync(full)||!fs.readFileSync(full,'utf8').includes(token)) throw new Error(`${rel}: BANHALMI brand/team contract token missing: ${token}`);
  }
  return changed;
}

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

  const s=overlay.canonicalSummary;
  const externalRef=overlay.protectedReferences.externalPhotographyEvidence;
  const textBlock=`\n\n## Protected current LLM/GEO/commercial overlay\n- Canonical commercial contract: ${overlay.protectedReferences.commercial}\n- Canonical market geography: ${overlay.protectedReferences.marketGeography}\n- Canonical people/roles: ${overlay.protectedReferences.peopleRoles}\n- Canonical team capacity: ${overlay.protectedReferences.teamCapabilities}\n- Canonical external photography evidence: ${externalRef}\n- Canonical pricing: ${overlay.protectedReferences.pricing}\n- Canonical services: ${overlay.protectedReferences.services}\n- Canonical memberships: ${overlay.protectedReferences.memberships}\n- Canonical authority evidence: ${overlay.protectedReferences.authority}\n- HIPStudio founder authority: ${overlay.protectedReferences.hipstudio}\n- ${s.identity}\n- ${s.brandTeam}\n- ${s.geography}\n- ${s.services}\n- ${s.team}\n- ${s.externalEvidence}\n- ${s.norbertRole}\n- ${s.vikoRole}\n- ${s.hipstudio}\n- ${s.references}\n- ${s.pricing}\n- Rollback protection: ${overlay.rollbackRule}\n`;
  for(const rel of ['llms.txt','ai.txt']){
    const full=path.join(root,rel);
    let text=fs.readFileSync(full,'utf8');
    text=text.replace(/\n\n## Protected current LLM\/GEO\/commercial overlay[\s\S]*$/m,'');
    fs.writeFileSync(full,`${text.trimEnd()}${textBlock}`,'utf8');
  }

  const brandTeamFilesChanged=applyBrandTeamContract(root,overlay);
  const externalRegistry=applyExternalEvidenceContract(root,overlay);

  const manifestPath=path.join(root,'machine-manifest.json');
  const manifest=readJson(manifestPath);
  manifest.protectedOverlay=overlay['@id'];
  manifest.protectedExternalPhotographyEvidence=externalRegistry['@id'];
  manifest.protectedOverlayPolicy='Applied after generated machine projections; older projection code must not erase current commercial, geography, role, brand/team, external photography evidence or ecosystem semantics. BANHALMI / BANHALMI Photography / Photography Team and the external evidence registry are protected against rollback.';
  manifest.brandTeamContract={primaryBrand:'BANHALMI',photographyName:'BANHALMI Photography',teamDescriptor:'Photography Team',separateOrganization:false};
  writeJson(manifestPath,manifest);

  const checks=[
    ['ai-entry.json','Q138482177'],['ai-entry.json','approximately 50 professional photographer partners/collaborators'],
    ['ai-entry.json','works only through and together with BANHALMI'],['ai-entry.json','does not operate an independent Vienna studio'],
    ['ai-entry.json','external-photography-evidence.json'],
    ['llms.txt','Q138482177'],['llms.txt','independent professional partner/collaborator'],
    ['llms.txt','works only through and together with BANHALMI'],['llms.txt','does not operate an independent Vienna studio'],
    ['llms.txt','1190 Döbling'],['llms.txt','XII. kerület'],['llms.txt','Portrait Photography'],
    ['llms.txt','BANHALMI Photography'],['llms.txt','Photography Team'],['llms.txt','external-photography-evidence.json'],
    ['llms.txt','Executive / Corporate Brand Photography'],['llms.txt','Nemanja Lazendic'],['llms.txt','Michael Brönner'],
    ['ai.txt','BANHALMI Photography'],['ai.txt','Photography Team'],['ai.txt','external-photography-evidence.json'],
    ['ai.txt','works only through and together with BANHALMI'],['ai.txt','does not operate an independent Vienna studio'],
    ['ai.txt','founded HIPStudio'],['ai.txt','pricing.json'],['entity.jsonld','Q138482177'],
    ['entity.jsonld','external-photography-evidence.json'],['authority-evidence.json','external-photography-evidence.json'],
    ['team-capabilities.json','external-photography-evidence.json']
  ];
  for(const [rel,token] of checks){
    const text=fs.readFileSync(path.join(root,rel),'utf8');
    if(!text.includes(token)) throw new Error(`${rel}: protected LLM overlay token missing: ${token}`);
  }
  console.log(`Protected LLM overlay applied after machine projections: brand/team contract normalized across ${brandTeamFilesChanged} public artifact files; BANHALMI Photography / Photography Team, external event/brand-photography evidence, geography, services, references, memberships, team capacity, pricing, Norbert/Viko roles and HIPStudio relation preserved.`);
}

if(import.meta.url===`file://${process.argv[1]}`) applyLlmCanonicalOverlay(process.argv[2]||'_site');
