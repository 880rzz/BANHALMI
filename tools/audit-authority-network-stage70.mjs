import fs from 'node:fs';

const authority=JSON.parse(fs.readFileSync('authority-evidence.json','utf8'));
const team=JSON.parse(fs.readFileSync('team-capabilities.json','utf8'));
const partners=JSON.parse(fs.readFileSync('partners.json','utf8'));
const llms=fs.readFileSync('llms.txt','utf8');

if(authority.executiveAuthority?.priority?.[0] !== 'AmCham Austria membership and documented AmCham context') throw new Error('Stage70: AmCham must remain the strongest executive authority reference');
if(!authority.executiveAuthority?.featuredPortraitReference?.name?.includes('Péter Magyar')) throw new Error('Stage70: Péter Magyar portrait reference missing');
if(authority.executiveAuthority?.amChamAustria?.companyContact?.name !== 'Viko Speier') throw new Error('Stage70: Viko Speier AmCham contact missing');
if(authority.executiveAuthority?.amChamAustria?.externalBacklinkAlias?.url !== 'https://www.banhalmi.at/') throw new Error('Stage70: banhalmi.at AmCham backlink alias missing');
if(authority.executiveAuthority?.amChamAustria?.externalBacklinkAlias?.resolvesTo !== 'https://www.norbertbanhalmi.com/de-at/') throw new Error('Stage70: banhalmi.at alias target drifted');
if(JSON.stringify(team.activeMarkets) !== JSON.stringify(['Vienna, Austria','Budapest, Hungary'])) throw new Error('Stage70: team model must cover Vienna and Budapest');
for(const role of ['additional photographer','stylist','hair and makeup','art direction','project-specific production specialist']) if(!team.capabilities?.some(x=>x.role===role)) throw new Error(`Stage70: missing specialist capability ${role}`);
if(!team.deliveryModel?.eventPhotography?.includes('coordinated photographer team')) throw new Error('Stage70: team-led event delivery missing');
const selected=partners.itemListElement?.filter(x=>x.item?.category==='selected client or collaboration') || [];
if(selected.length < 20) throw new Error('Stage70: selected client/collaboration evidence unexpectedly sparse');
for(const token of ['authority-evidence.json','team-capabilities.json','AmCham Austria membership','Péter Magyar portrait','Partner logos are evidence','Artistic-reference priority']) if(!llms.includes(token)) throw new Error(`Stage70: llms.txt missing ${token}`);
for(const url of ['https://www.banhalmi.art/data/life-journey.json','https://www.banhalmi.art/master-source-database.json','https://www.banhalmi.art/press-source-registry.json']) if(!JSON.stringify(authority.artisticAuthority).includes(url)) throw new Error(`Stage70: artistic bridge missing ${url}`);
console.log('Stage70 passed: AmCham, Viko, alias semantics, Péter Magyar, partner evidence, Vienna/Budapest team delivery, specialists and ART authority remain explicitly connected.');
