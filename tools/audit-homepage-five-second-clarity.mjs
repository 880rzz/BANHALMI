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
  const hero=html.match(/<section class="hero hero-image-first hero-visual-only hero-cinematic"[^>]*>[\s\S]*?<\/section>/i)?.[0];
  assert.ok(hero,file+': photographic homepage hero missing');
  assert.ok(hero.includes('class="hero-cinematic-content"'),file+': overlaid hero text missing');
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file+': exactly one H1 required');
  const h1=hero.match(/<h1>([^<]+)<\/h1>/i)?.[1];
  assert.ok(h1 && h1.length<60,file+': concise photo hero H1 required');
  assert.ok(hero.includes('href="'+quote+'"'),file+': quote CTA missing from photo hero');
  assert.ok(hero.includes('href="#services"'),file+': services CTA missing');
  assert.ok(hero.includes('hero-cinematic-photo'),file+': static photo missing');
  assert.ok(hero.includes('fetchpriority="high"'),file+': photo LCP priority missing');
  assert.ok(hero.includes('src="/assets/img/curated/hero-city-skateboard-1920.avif"'),file+': expected photo path missing');
  assert.ok(!/data-service-owner-links/.test(hero),file+': repeated service labels in hero');
  const team=html.match(/<section class="hero hero-copy-only\b[\s\S]*?<\/section>/i)?.[0];
  assert.ok(team,file+': team explanation section missing below hero');
  const summary=team.match(/<\/h2>\s*<p>([^<]+)<\/p>/i)?.[1];
  assert.ok(summary && summary.length<=260,file+': concise team explanation required');
  assert.match(summary,brand,file+': brand missing');
  assert.match(summary,location,file+': geography missing');
  assert.match(summary,/50/,file+': team scale missing');
  assert.match(summary,/20|húsz|zwanzig/i,file+': operating history missing');
  assert.ok(fs.existsSync('assets/img/curated/hero-city-skateboard-1920.avif'),file+': uploaded image missing');

  const section=html.match(/<section id="services"[\s\S]*?<\/section>/i)?.[0];
  assert.ok(section,file+': services section missing');
  for(const href of services)assert.ok(section.includes('href="'+href+'"'),file+': missing service landing link '+href);
  console.log('Cinematic homepage clarity PASS: '+file);
}
