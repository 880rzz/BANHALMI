import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Public contact-only lines: these do not replace the canonical footers,
// WhatsApp Dock or WKO/Google Business Profile phone authority.
const locales={
  'contact/index.html':['Phone · Austria','Phone · Hungary','WhatsApp · Austria','WhatsApp · Hungary'],
  'hu/kapcsolat/index.html':['Telefon · Ausztria','Telefon · Magyarország','WhatsApp · Ausztria','WhatsApp · Magyarország'],
  'de-at/kontakt/index.html':['Telefon · Österreich','Telefon · Ungarn','WhatsApp · Österreich','WhatsApp · Ungarn']
};
const people={
 norbert:{at:'tel:+4367761655592',hu:'tel:+36704698397',wa:'https://wa.me/4367761655592',forbiddenWa:'https://wa.me/36704698397'},
 viko:{at:'tel:+4367764733262',hu:'tel:+36304788850',wa:'https://wa.me/36304788850',forbiddenWa:'https://wa.me/4367764733262'}
};
for(const [path,labels] of Object.entries(locales)){
 const html=readFileSync(path,'utf8');
 const regions=[...html.matchAll(/<div class="contact-profile-contact" aria-label="([^"]+)">([\s\S]*?)<\/div>/g)];
 assert.equal(regions.length,2,path+': exactly two contact profiles');
 for(const [i,who] of ['norbert','viko'].entries()){
   const group=regions[i][2],p=people[who];
   for(const link of [p.at,p.hu,p.wa])assert.ok(group.includes('href="'+link+'"'),path+': '+who+' missing '+link);
   assert.ok(!group.includes(p.forbiddenWa),path+': '+who+' WhatsApp on incorrect number');
   const waLink=group.match(/<a href="https:\/\/wa\.me\/\d+"[^>]*>/)?.[0]||'';
   assert.match(waLink,/rel="noopener noreferrer"/,path+': external WhatsApp link rel');
   assert.match(waLink,/target="_blank"/,path+': WhatsApp target');
   assert.ok(group.includes('<span>'+labels[i===0?2:3]+'</span>'),path+': WhatsApp label');
 }
 for(const s of labels.slice(0,2))assert.ok(html.includes('<span>'+s+'</span>'),path+': wrong locale phone label');
 assert.match(html,/href="https:\/\/www\.banhalmiphotography\.com\//,path+': canonical domain');
 assert.ok(html.includes('https://www.banhalmi.art/#about'),path+': Person identity lost');
 assert.ok(html.includes('https://www.banhalmiphotography.com/#organization'),path+': Organization identity lost');
}
// Do not turn two individual HU contacts into a replacement public GBP telephone.
const machine=JSON.parse(readFileSync('data/machine-core.json','utf8'));
assert.equal(machine.organization.contactAuthority.whatsapp,'+4367761655592');
assert.equal(machine.organization.contactAuthority.telephoneByLanguage.en,'+4367764733262');
assert.equal(machine.organization.contactAuthority.telephoneByLanguage['hu-HU'],'+4367761655592');
console.log('BANHALMI EN/HU/DE named Austrian/Hungarian telephone and WhatsApp channel parity PASS');
