import fs from 'node:fs';

const pages=['about/index.html','hu/eletmu/index.html','de-at/werk/index.html'];
const forbidden=['id="exhibitions"','id="permanent-exhibition"','id="curatorial-programme"','id="books"','id="media"','id="professional-articles"','id="video-media"'];
const biographyFacts = new Map([
  ['about/index.html', ['Books and exhibitions</dt><dd>Five books', 'first worked with Norbert as his student', 'independent professional partner', 'independent businesses']],
  ['hu/eletmu/index.html', ['Könyvek és kiállítások</dt><dd>Öt könyv', 'Norbert tanítványaként', 'független szakmai partnerként', 'különálló vállalkozásként']],
  ['de-at/werk/index.html', ['Bücher und Ausstellungen</dt><dd>Fünf Bücher', 'lernte zunächst bei Norbert', 'unabhängige professionelle Partnerin', 'eigenständige Unternehmen']]
]);
const failures=[];
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  for(const token of forbidden) if(html.includes(token)) failures.push(`${file}: ART-owned full archive section survived: ${token}`);
  if(!html.includes('id="artistic-archive"')) failures.push(`${file}: canonical ART archive bridge missing`);
  const artLinks=(html.match(/https:\/\/www\.banhalmi\.art\//g)||[]).length;
  if(artLinks<2) failures.push(`${file}: archive bridge must expose both archive and press/source path`);
  for (const fact of biographyFacts.get(file)) {
    if(!html.includes(fact)) failures.push(`${file}: visible professional/archival boundary fact missing: ${fact}`);
  }
  if(!/<p[^>]*>[^<]*2006[^<]*<a href="https:\/\/www\.hipstudio\.hu\/kapcsolat">HIPStudio<\/a>/.test(html)) failures.push(`${file}: first-party HIPStudio history reference missing`);
  const h1=(html.match(/<h1\b/gi)||[]).length;
  if(h1!==1) failures.push(`${file}: expected exactly one H1, found ${h1}`);
}
if(failures.length){console.error('BANHALMI/ART ownership audit FAILED:\n'+failures.map(x=>' - '+x).join('\n'));process.exit(1)}
console.log('BANHALMI/ART ownership audit passed: professional biography keeps context; detailed oeuvre remains canonical on BANHALMI ART.');
