import fs from 'node:fs';
import assert from 'node:assert/strict';

// Static five-second clarity contract: guarantees a short, concrete answer to
// what BANHALMI offers, for whom, where and how to take the next step.
// This is a content/IA safeguard, not a substitute for user comprehension tests.
const variants = [
  {file:'index.html', quote:'/requestaquote/', services:['/portrait/','/lifestyle/','/event-photography/','/fine-art/'], location:/vienna/i, brand:/BANHALMI Photography/i},
  {file:'hu/index.html', quote:'/hu/ajanlatkeres/', services:['/hu/portre/','/hu/brand/','/hu/rendezvenyfotozas/','/hu/muveszi-fotografia/'], location:/bécsben/i, brand:/BANHALMI Photography/i},
  {file:'de-at/index.html', quote:'/de-at/anfrage/', services:['/de-at/portrait/','/de-at/brand/','/de-at/eventfotografie/','/de-at/fine-art/'], location:/wien/i, brand:/BANHALMI Photography/i}
];
for(const {file,quote,services,location,brand} of variants){
  const html=fs.readFileSync(file,'utf8');
  const hero=html.match(/<section class="hero hero-copy-only\b[\s\S]*?<\/section>/i)?.[0];
  assert.ok(hero,file+': homepage copy hero missing');
  const h1=hero.match(/<h1>([^<]+)<\/h1>/i)?.[1];
  assert.ok(h1 && h1.length<95,file+': short brand H1 required');
  const summary=hero.match(/<\/h1>\s*<p>([^<]+)<\/p>/i)?.[1];
  assert.ok(summary && summary.length<=260,file+': concise brand explanation required');
  assert.match(summary,brand,file+': brand missing');
  assert.match(summary,location,file+': geography missing');
  assert.match(summary,/50/,file+': team scale missing');
  assert.match(summary,/20|húsz|zwanzig/i,file+': operating history missing');
  assert.ok(hero.includes('href="'+quote+'"'),file+': quote CTA missing');
  assert.equal((hero.match(/class="btn btn-primary"/g)||[]).length,1,file+': one primary CTA');
  assert.ok(!/data-service-owner-links/.test(hero),file+': repeated service keywords in hero');
  const section=html.match(/<section id="services"[\s\S]*?<\/section>/i)?.[0];
  assert.ok(section,file+': services section missing');
  for(const href of services)assert.ok(section.includes('href="'+href+'"'),file+': missing service landing link '+href);
  console.log('Brand-first homepage clarity PASS: '+file);
}
