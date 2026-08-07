import fs from 'node:fs';

const file='entity.jsonld';
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const graph=Array.isArray(data['@graph']) ? data['@graph'] : [];
const person=graph.find(node=>{
  const t=node?.['@type'];
  return t==='Person' || (Array.isArray(t) && t.includes('Person'));
});
if(!person) throw new Error('Canonical Person node not found');
const before=Array.isArray(person.memberOf) ? person.memberOf.length : 0;
person.memberOf=(person.memberOf || []).filter(item=>{
  const hay=typeof item==='string' ? item : `${item?.name || ''} ${item?.alternateName || ''}`;
  return !/OM SYSTEM|Olympus/i.test(hay);
});
const removed=before-person.memberOf.length;
if(removed<1) throw new Error('No OM SYSTEM/Olympus memberOf relation found to remove');
const affiliations=(person.affiliation || []).map(item=>typeof item==='string'?item:`${item?.name||''} ${item?.url||''}`).join(' | ');
if(!/OM SYSTEM/i.test(affiliations)) throw new Error('OM SYSTEM affiliation missing; refusing destructive rewrite');
const roles=(person.additionalProperty || []).filter(x=>x?.propertyID==='professionalRole').map(x=>x?.name||'').join(' | ');
if(!/OM SYSTEM Ambassador/i.test(roles)) throw new Error('OM SYSTEM Ambassador professionalRole missing; refusing destructive rewrite');
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
console.log(`Removed ${removed} incorrect OM SYSTEM memberOf relation(s); affiliation and professionalRole preserved.`);
