import fs from 'node:fs';

const failures=[];
const clean=s=>s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const headings=file=>{
  const html=fs.readFileSync(file,'utf8');
  return {
    h1:[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>clean(m[1])),
    h2:[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>clean(m[1])),
    text:clean(html)
  };
};
const expected={
  'index.html':{h1:'Photography built around people. Backed by a team.'},
  'hu/index.html':{h1:'Személyes látásmód. Egy teljes csapat biztonságával.'},
  'de-at/index.html':{h1:'Persönliche Bildsprache. Die Sicherheit eines ganzen Teams.'},
  'portrait/index.html':{h1:'Business portraits for leaders and professionals.',h2:['Portraits for LinkedIn, websites, press and public profiles.','Choosing the main portrait for your profile']},
  'hu/portre/index.html':{h1:'Üzleti portrék vezetőknek és szakembereknek.',h2:['Portrék LinkedInhez, weboldalhoz, sajtóhoz és szakmai bemutatkozáshoz.','A fő portré kiválasztása']},
  'de-at/portrait/index.html':{h1:'Business-Porträts für Führungskräfte und Fachleute.',h2:['Porträts für LinkedIn, Website, Presse und berufliche Profile.','Das Hauptporträt auswählen']},
  'lifestyle/index.html':{h1:'Brand photography for websites, social media and press.',h2:['A consistent set of photographs for different channels.']},
  'hu/brand/index.html':{h1:'Brandfotózás weboldalhoz, közösségi médiához és sajtóhoz.',h2:['Egységes képanyag a különböző felületekre.']},
  'de-at/brand/index.html':{h1:'Brandfotografie für Website, Social Media und Presse.',h2:['Einheitliches Bildmaterial für unterschiedliche Kanäle.']},
  'event-photography/index.html':{h1:'Event photography for conferences, corporate and institutional events.',h2:['Speakers, guests, atmosphere and key moments.']},
  'hu/rendezvenyfotozas/index.html':{h1:'Rendezvényfotózás konferenciákhoz, üzleti és intézményi eseményekhez.',h2:['Előadók, vendégek, hangulat és fontos pillanatok.']},
  'de-at/eventfotografie/index.html':{h1:'Eventfotografie für Konferenzen, Unternehmens- und institutionelle Veranstaltungen.',h2:['Redner:innen, Gäste, Atmosphäre und wichtige Momente.']},
  'fine-art/index.html':{h1:'Portrait and portfolio photography for artists and performers.',h2:['Photographs for press, casting, websites and promotion.']},
  'hu/muveszi-fotografia/index.html':{h1:'Portré- és portfóliófotózás művészeknek és előadóknak.',h2:['Fotók sajtóhoz, castinghoz, weboldalhoz és promócióhoz.']},
  'de-at/fine-art/index.html':{h1:'Porträt- und Portfoliofotografie für Kunstschaffende und Performer:innen.',h2:['Fotos für Presse, Casting, Website und Promotion.']},
  'about/index.html':{h1:'Norbert Bánhalmi',h2:['How I work with people in front of the camera.','Turning points in my work.','Studios and office in Vienna and Budapest']},
  'hu/eletmu/index.html':{h1:'Norbert Bánhalmi',h2:['Hogyan dolgozom azokkal, akiket fényképezek.','Szakmai fordulópontok.','Stúdiók és iroda Bécsben és Budapesten']},
  'de-at/werk/index.html':{h1:'Norbert Bánhalmi',h2:['Wie ich mit Menschen vor der Kamera arbeite.','Wichtige Wendepunkte meiner Arbeit.','Studios und Büro in Wien und Budapest']}
};
const forbidden=[
  'Portrait photography and visual presence — Vienna and Budapest.',
  'Portréfotózás és vizuális pozicionálás — Bécs és Budapest.',
  'Porträtfotografie und visuelle Präsenz — Wien und Budapest.',
  'A business portrait that represents you.',
  'Üzleti portré, amely Önt képviseli.',
  'Ein Business-Porträt, das Sie vertritt.',
  'Don’t think in separate pictures.',
  'Ne különálló képekben gondolkodjunk.',
  'Denken Sie nicht in einzelnen Bildern.',
  'Stage presence has its own face.',
  'A színpadi jelenlétnek saját arca van.',
  'Bühnenpräsenz hat ein eigenes Gesicht.'
];
for(const [file,contract] of Object.entries(expected)){
  if(!fs.existsSync(file)){failures.push(`${file}: missing`);continue;}
  const got=headings(file);
  if(got.h1.length!==1)failures.push(`${file}: expected exactly one H1, got ${got.h1.length}`);
  if(got.h1[0]!==contract.h1)failures.push(`${file}: H1 mismatch: "${got.h1[0]||''}"`);
  for(const h2 of contract.h2||[])if(!got.h2.includes(h2))failures.push(`${file}: required plain-language H2 missing: ${h2}`);
  for(const phrase of forbidden)if(got.text.includes(phrase))failures.push(`${file}: retired abstract/marketing heading remains: ${phrase}`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Plain-human heading gate PASS: ${Object.keys(expected).length} Professional EN/HU/DE priority routes use concrete H1/H2 copy and retired abstract headings cannot return.`);
