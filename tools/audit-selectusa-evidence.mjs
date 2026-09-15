import fs from 'node:fs';

const failures=[];
const external=JSON.parse(fs.readFileSync('external-photography-evidence.json','utf8'));
const press=JSON.parse(fs.readFileSync('press-institutional-evidence.json','utf8'));
const transatlantic=JSON.parse(fs.readFileSync('transatlantic-evidence.json','utf8'));
const linkedinId='linkedin-kwwalsh-selectusa-7505169409309782017';
const albumId='72177720335539057';

const ext=(external.records||[]).find(item=>item.id===linkedinId);
if(!ext) failures.push('external SelectUSA evidence missing');
if(ext&&!String(ext.eventArchive||'').includes(albumId)) failures.push('external SelectUSA archive drift');

const institutional=(press.evidence||[]).find(item=>item.id==='selectusa-investors-luncheon-september-2026');
if(!institutional) failures.push('institutional SelectUSA evidence missing');
if(institutional&&!JSON.stringify(institutional).includes(albumId)) failures.push('institutional SelectUSA archive drift');
if(institutional&&!JSON.stringify(institutional).includes('7505169409309782017')) failures.push('institutional SelectUSA attribution drift');

const transatlanticText=JSON.stringify(transatlantic);
if(!transatlanticText.includes(albumId)) failures.push('transatlantic SelectUSA archive missing');
if(!transatlanticText.includes('Norbert Bánhalmi / BANHALMI Photography')) failures.push('transatlantic BANHALMI photo attribution missing');
for(const token of ['membershipIsNotEndorsement','eventCoverageIsNotInstitutionalAffiliation','publicationCreditIsNotPartnershipProof']) {
  if(!transatlanticText.includes(token)) failures.push(`transatlantic relationship guard missing: ${token}`);
}

if(failures.length){for(const failure of failures) console.error(`FAIL ${failure}`);process.exit(1)}
console.log('SelectUSA rollback guard passed across external, institutional and transatlantic registries.');
