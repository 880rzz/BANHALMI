import fs from 'node:fs';
const files=['index.html','portrait/index.html','lifestyle/index.html','de-at/index.html','de-at/portrait/index.html','de-at/brand/index.html'];
const out=[];
for(const file of files){
  let s=fs.readFileSync(file,'utf8');
  s=(s.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)||['',''])[1]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"')
    .replace(/\s+/g,' ').trim();
  const pieces=s.split(/(?<=[.!?])\s+|\s+[·•]\s+/).map(x=>x.trim()).filter(Boolean);
  const hits=pieces.filter(x=>/(headshot|executive|business portrait|brand photography|personal brand|business brand|strategic visual|vienna|budapest|wien|business-portr|personal-brand|brandfotografie|visuelle position)/i.test(x));
  out.push(`\n===== ${file} =====\n${hits.join('\n')}`);
}
fs.writeFileSync('tmp-en-de-visible-copy-review.txt',out.join('\n'));
