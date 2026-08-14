import fs from 'node:fs';

const failures=[];
const bios=['about/index.html','hu/eletmu/index.html','de-at/werk/index.html'];
const removed=['exhibitions','permanent-exhibition','curatorial-programme','books','media','professional-articles','video-media'];
function visible(html){return html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
for(const file of bios){
  const html=fs.readFileSync(file,'utf8');
  if(!/id=["']artistic-archive["']/i.test(html)) failures.push(`${file}: canonical ART bridge missing`);
  for(const id of removed) if(new RegExp(`id=["']${id}["']`,'i').test(html)) failures.push(`${file}: ART-owned detail #${id} still duplicated`);
  const words=visible(html.match(/<main\b[\s\S]*?<\/main>/i)?.[0]||html).split(/\s+/).filter(Boolean).length;
  if(words>2000) failures.push(`${file}: still too dense after ownership simplification (${words} words)`);
  if((html.match(/<h1\b/gi)||[]).length!==1) failures.push(`${file}: H1 invariant failed`);
}
const legal=[
 ['privacy-policy/index.html','faq/index.html','Booking fees, invoices and payment','/terms-conditions/','/privacy-policy/'],
 ['hu/adatvedelem/index.html','hu/gyik/index.html','Foglalási díj, számlázás és fizetés','/hu/aszf/','/hu/adatvedelem/'],
 ['de-at/datenschutz/index.html','de-at/faq/index.html','Reservierungsentgelt, Rechnung und Zahlung','/de-at/agb/','/de-at/datenschutz/']
];
for(const [privacy,faq,booking,termsHref,privacyHref] of legal){
  const p=fs.readFileSync(privacy,'utf8'),f=fs.readFileSync(faq,'utf8');
  if(visible(p).includes(booking)) failures.push(`${privacy}: commercial booking/payment chapter still lives in privacy notice`);
  if(!/class=["'][^"']*legal-navigation/i.test(f)) failures.push(`${faq}: canonical legal-navigation bridge missing`);
  if(!f.includes(termsHref)||!f.includes(privacyHref)) failures.push(`${faq}: canonical Terms/Privacy links missing`);
  for(const duplicate of ['Storage, access and deletion','Tárolás, hozzáférés és törlés','Speicherung, Zugriff und Löschung','Image use, approvals and reference rights','Képfelhasználás, jóváhagyás és referenciajog','Bildnutzung, Freigaben und Referenzrechte']) if(visible(f).includes(duplicate)) failures.push(`${faq}: full legal chapter still duplicated: ${duplicate}`);
}
const quotes=[
 ['requestaquote/index.html','/terms-conditions/','/privacy-policy/',['When a booking fee applies','Invoices and currency','Payment and delivery','No unapproved charges']],
 ['hu/ajanlatkeres/index.html','/hu/aszf/','/hu/adatvedelem/',['Mikor van foglalási díj?','Számla és pénznem','Fizetés és átadás','Nincs jóváhagyatlan költség']],
 ['de-at/anfrage/index.html','/de-at/agb/','/de-at/datenschutz/',['Wann ein Reservierungsentgelt gilt','Rechnung und Währung','Zahlung und Übergabe','Keine ungenehmigten Kosten']]
];
for(const [file,termsHref,privacyHref,oldHeadings] of quotes){
  const h=fs.readFileSync(file,'utf8'),v=visible(h);
  if(!/data-quote-legal-owner=["']terms["']/i.test(h)) failures.push(`${file}: compact quote legal bridge missing`);
  if(/payment-invoicing-clarity/i.test(h)) failures.push(`${file}: duplicated payment/invoicing card system remains`);
  if(!h.includes(termsHref)||!h.includes(privacyHref)) failures.push(`${file}: Terms/Privacy hand-off missing`);
  for(const heading of oldHeadings) if(v.includes(heading)) failures.push(`${file}: duplicated legal card remains: ${heading}`);
}
for(const root of ['hu','ai.txt','llms.txt','llms-full.txt','customer-needs.json']){
  const scan=file=>{if(!fs.existsSync(file)||fs.statSync(file).isDirectory())return;const t=fs.readFileSync(file,'utf8');if(/\baz vezetői\b/iu.test(t))failures.push(`${file}: incorrect Hungarian article remains`)};
  if(fs.existsSync(root)&&fs.statSync(root).isDirectory()){const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=`${d}/${e.name}`;e.isDirectory()?walk(p):scan(p)}};walk(root)}else scan(root);
}
for(const file of ['portrait/index.html','lifestyle/index.html','glamour/index.html','event-photography/index.html']){
  const h=fs.readFileSync(file,'utf8');
  if(/aria-label=["'](?:Previous|Next)["']/i.test(h)) failures.push(`${file}: ambiguous English lightbox accessible name remains`);
}
const css=fs.readFileSync('assets/css/site.css','utf8');
for(const marker of ['DESKTOP-A11Y-REMEDIATION-20260814','QUOTE-DENSITY-REMEDIATION-20260814']) if(!css.includes(marker)) failures.push(`site.css: ${marker} marker missing`);
if(failures.length){console.error('BANHALMI post-migration first-principles audit FAILED:\n'+failures.map(x=>' - '+x).join('\n'));process.exit(1)}
console.log('BANHALMI post-migration first-principles audit passed: content ownership, legal hand-offs, quote density and accessibility are consistent.');
