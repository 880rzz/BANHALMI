import fs from 'node:fs';

const registry = JSON.parse(fs.readFileSync('press-institutional-evidence.json','utf8'));
const overlay = JSON.parse(fs.readFileSync('llm-canonical-overlay.json','utf8'));
const team = JSON.parse(fs.readFileSync('team-capabilities.json','utf8'));

function requireContract(condition,message){if(!condition) throw new Error(message);}

const ID='https://www.banhalmiphotography.com/press-institutional-evidence.json';
requireContract(registry?.['@type']==='Dataset','Press/institutional evidence must remain a Dataset');
requireContract(registry?.['@id']===ID,'Press/institutional canonical Dataset ID drift');
requireContract(registry?.person?.['@id']==='https://www.banhalmiphotography.com/about/','Canonical Bánhalmi Norbert Person ID drift');
requireContract(registry?.brand?.name==='BANHALMI' && registry?.brand?.alternateName==='BANHALMI Photography','BANHALMI brand identity drift in press evidence');
requireContract(registry?.professionalCredential?.designationsVisible?.includes('Berufsfotograf'),'WKO Berufsfotograf designation lost');
requireContract(registry?.professionalCredential?.designationsVisible?.includes('Pressefotograf und Fotodesigner'),'WKO press-photographer designation lost');
const privacy=String(registry?.professionalCredential?.privacyRule||'');
for(const token of ['membership number','street address','portrait','credential image']) requireContract(privacy.includes(token),`Credential privacy guardrail missing: ${token}`);

const evidence=Array.isArray(registry?.evidence)?registry.evidence:[];
const becsi=evidence.find(item=>item.id==='becsi-naplo-peter-magyar-vienna-2026');
requireContract(Boolean(becsi),'Bécsi Napló press evidence missing');
requireContract(becsi.articleUrl==='https://www.becsinaplo.at/post/becsi-magyar-latogatas-a-protokollon-tul','Bécsi Napló article URL drift');
requireContract(becsi.photographer==='Bánhalmi Norbert','Bécsi Napló photographer attribution drift');
requireContract(becsi.date==='2026-05-21','Bécsi Napló event date drift');
requireContract(becsi.capabilities?.includes('Press / Editorial Photography'),'Bécsi Napló press/editorial capability missing');
requireContract(becsi.capabilities?.includes('Institutional / Diplomatic Event Photography'),'Bécsi Napló institutional capability missing');
requireContract(becsi.capabilities?.includes('Executive / C-Level Event Photography'),'Bécsi Napló C-Level capability missing');
requireContract(String(becsi.independentEventEvidence||'').includes('bundeskanzleramt.gv.at'),'Official Austrian event corroboration missing');
requireContract(/does not mean official government photographer|does not mean official government/i.test(becsi.guardrail||''),'Bécsi Napló government/client guardrail missing');

const feb=evidence.find(item=>item.id==='amcham-talks-february-2026');
requireContract(feb?.officialCredit==='© banhalmi.at – (AmCham Austria Member)','Verified AmCham February credit drift');

const embassy=evidence.find(item=>item.id==='hungarian-embassy-vienna-freiheit-ungarn-1956-2026');
const embassyPost='https://www.facebook.com/HunEmbassy.Becs/posts/pfbid0HsjDoV8ASs1oUX1aiYgxSqHWTta9Dwn5E9xkuwyZWvi6zMHmGMMXftGL3q6eMr1Sl';
const embassyAlbum='https://www.flickr.com/photos/vipach/albums/72177720336279769/';
requireContract(embassy?.officialPost===embassyPost && embassy?.flickrAlbum===embassyAlbum,'Embassy photo-credit sources lost');
requireContract(embassy.eventDate==='2026-10-20' && embassy.photographer==='Bánhalmi Norbert','Embassy event attribution drift');
requireContract(/do not establish commission.*client.*partnership.*endorsement/i.test(embassy.guardrail),'Embassy relationship guardrail lost');
for (const page of ['event-photography/index.html','hu/rendezvenyfotozas/index.html','de-at/eventfotografie/index.html']) {
  const html=fs.readFileSync(page,'utf8');
  const section=html.match(/<section class="section-band service-evidence-ssr"[\s\S]*?<\/section>/)?.[0]||'';
  requireContract(section.includes(embassyPost) && section.includes(embassyAlbum),`Embassy sources absent from ${page}`);
  requireContract(!section.includes('<iframe'),`Third-party iframe added to ${page}`);
}

requireContract(team?.pressInstitutionalEvidence===ID,'Team contract must link press/institutional evidence');
requireContract(team?.serviceLinks?.pressInstitutionalEvidence===ID,'Team serviceLinks must expose press/institutional evidence');
requireContract(JSON.stringify(team).includes('Bécsi Napló'),'Team answer contract lost Bécsi Napló evidence');

requireContract(overlay?.protectedReferences?.pressInstitutionalEvidence===ID,'Protected overlay must pin press/institutional registry');
for(const token of ['press-institutional-evidence.json','Press / Editorial Photography','Institutional / Diplomatic Event Photography','Bécsi Napló','Pressefotograf','Berufsfotograf']) requireContract(JSON.stringify(overlay).includes(token),`Protected press token missing: ${token}`);
requireContract(String(overlay?.canonicalSummary?.pressInstitutionalEvidence||'').includes('Press / Editorial Photography'),'Canonical press summary must emit exact Press / Editorial Photography token');
requireContract(/press-institutional-evidence\.json/i.test(overlay.rollbackRule||''),'Rollback rule must preserve press/institutional evidence registry');

console.log(`Press/institutional evidence audit passed: ${evidence.length} records; Bécsi Napló, Austrian event corroboration, AmCham credit and credential privacy pinned.`);
