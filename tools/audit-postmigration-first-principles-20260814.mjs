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
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('BANHALMI post-migration first-principles audit passed.');
