import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const changed = [];

function replaceExact(text, from, to, file, label) {
  if (text.includes(to)) return text;
  if (!text.includes(from)) throw new Error(`${file}: ${label} source text was not found`);
  return text.replace(from, to);
}

function replacePattern(text, pattern, replacement, file, label) {
  if (!pattern.test(text)) throw new Error(`${file}: ${label} structure was not found`);
  return text.replace(pattern, replacement);
}

const pages = {
  'about/index.html': {
    metaOld: 'The first camera came into my hands during military service. Since then I have photographed leaders, artists, weddings, international brands and people going through some of the hardest periods of their lives. The settings changed. The question did not: how can a photograph show the person rather than merely record their appearance?',
    metaNew: 'Norbert Banhalmi’s photographic path began in 1999 during the MOL Y2K project, leading to portraits, books, exhibitions and visual strategy.',
    h1New: 'I did not set out to become a photographer. I began by documenting what was already in front of me.',
    leadNew: 'During the MOL Y2K project, I was working as an IT specialist. I began photographing the project on my own initiative with a basic 1.3-megapixel digital camera. That was where digital image-making entered my life. Military documentation followed later as a separate phase. The settings changed, but the question did not: how can a photograph show the person rather than merely record their appearance?',
    originOld: 'My first profession was information technology, and I completed an Information Engineering degree in 2005. Photography developed alongside it. In 2006 I founded the Hungarian Defence Forces’ professional photo studio, in 2015 I completed a programme at the New York Institute of Photography, and in 2018 I qualified as an applied photographer in Budapest.',
    originNew: 'My first profession was information technology. During the MOL Y2K project in 1999, I began photographing the work on my own initiative with a basic 1.3-megapixel digital camera. That was the beginning of digital image-making in my life. I completed an Information Engineering degree in 2005, founded the Hungarian Defence Forces’ professional photo studio in 2006, studied at the New York Institute of Photography in 2015, and qualified as an applied photographer in Budapest in 2018.',
    timelineOld: 'Photography begins as a sustained personal and professional practice.',
    timelineNew: 'While working as an IT specialist on the MOL Y2K project, I begin documenting the project on my own initiative with a basic 1.3-megapixel digital camera.'
  },
  'hu/eletmu/index.html': {
    metaOld: 'Az első fényképezőgép a katonai szolgálat alatt került a kezembe. Azóta fotóztam vezetőket, művészeket, esküvőket, nemzetközi márkákat és olyan embereket, akik életük nehéz időszakában álltak kamera elé. A helyzetek változtak, a kérdés nem: hogyan mutathatja meg a fénykép az embert, nem csupán a külsejét?',
    metaNew: 'Bánhalmi Norbert fotográfiai útja 1999-ben, a MOL Y2K projekt dokumentálásával indult; portrék, könyvek, kiállítások és vizuális stratégia.',
    h1New: 'Nem fotósnak készültem. Azzal kezdődött, hogy dokumentálni akartam azt, ami előttem történt.',
    leadNew: 'A MOL Y2K projektben informatikusként dolgoztam. Saját elhatározásból kezdtem fényképezni a projektet egy egyszerű, 1,3 megapixeles digitális géppel. Itt lépett be a digitális képalkotás az életembe; a katonai dokumentáció később, külön szakaszként következett. A helyzetek változtak, a kérdés nem: hogyan mutathatja meg a fénykép az embert, nem csupán a külsejét?',
    originOld: 'Első szakmám az informatika volt; 2005-ben informatikai mérnöki diplomát szereztem. A fotográfia ezzel párhuzamosan vált hivatássá. 2006-ban létrehoztam a Magyar Honvédség professzionális fotóstúdióját, 2015-ben elvégeztem a New York Institute of Photography képzését, 2018-ban pedig alkalmazott fotográfusi képesítést szereztem Budapesten.',
    originNew: 'Első szakmám az informatika volt. 1999-ben, a MOL Y2K projektben saját elhatározásból kezdtem fényképezni a munkát egy egyszerű, 1,3 megapixeles digitális géppel. Itt kezdődött el a digitális képalkotás az életemben. 2005-ben informatikai mérnöki diplomát szereztem, 2006-ban létrehoztam a Magyar Honvédség professzionális fotóstúdióját, 2015-ben elvégeztem a New York Institute of Photography képzését, 2018-ban pedig alkalmazott fotográfusi képesítést szereztem Budapesten.',
    timelineOld: 'A fotográfia tartós alkotói és szakmai gyakorlattá válik.',
    timelineNew: 'A MOL Y2K projekt informatikusaként saját elhatározásból kezdem dokumentálni a munkát egy egyszerű, 1,3 megapixeles digitális géppel.'
  },
  'de-at/werk/index.html': {
    metaOld: 'Die erste Kamera kam während des Militärdienstes in meine Hände. Seitdem habe ich Führungskräfte, Künstler:innen, Hochzeiten, internationale Marken und Menschen in schwierigen Lebensphasen fotografiert. Die Situationen wechselten, die Frage blieb: Wie kann ein Bild den Menschen zeigen und nicht nur sein Äußeres festhalten?',
    metaNew: 'Norbert Banhalmis fotografischer Weg begann 1999 mit der Dokumentation des MOL-Y2K-Projekts und führte zu Porträts, Büchern, Ausstellungen und visueller Strategie.',
    h1New: 'Ich wollte nicht Fotograf werden. Es begann damit, dass ich festhalten wollte, was vor mir geschah.',
    leadNew: 'Beim MOL-Y2K-Projekt arbeitete ich als IT-Spezialist. Aus eigenem Entschluss begann ich, das Projekt mit einer einfachen Digitalkamera mit 1,3 Megapixeln zu fotografieren. Dort trat die digitale Bildgestaltung in mein Leben; die militärische Dokumentation folgte später als eigene Phase. Die Situationen wechselten, die Frage blieb: Wie kann ein Bild den Menschen zeigen und nicht nur sein Äußeres festhalten?',
    originOld: 'Mein erster Beruf war die Informationstechnologie; 2005 schloss ich ein Ingenieurstudium in Informatik ab. Parallel entwickelte sich die Fotografie zur professionellen Arbeit. 2006 gründete ich das professionelle Fotostudio der Ungarischen Streitkräfte, 2015 absolvierte ich eine Ausbildung am New York Institute of Photography und 2018 erwarb ich in Budapest die Qualifikation als angewandter Fotograf.',
    originNew: 'Mein erster Beruf war die Informationstechnik. 1999 begann ich beim MOL-Y2K-Projekt aus eigenem Entschluss, die Arbeit mit einer einfachen Digitalkamera mit 1,3 Megapixeln zu dokumentieren. Dort begann die digitale Bildgestaltung in meinem Leben. 2005 schloss ich mein Studium der Informationstechnik ab, 2006 gründete ich das professionelle Fotostudio der Ungarischen Streitkräfte, 2015 absolvierte ich das New York Institute of Photography und 2018 erwarb ich in Budapest die Qualifikation als angewandter Fotograf.',
    timelineOld: 'Fotografie wird zu einer kontinuierlichen künstlerischen und professionellen Praxis.',
    timelineNew: 'Als IT-Spezialist beim MOL-Y2K-Projekt beginne ich aus eigenem Entschluss, die Arbeit mit einer einfachen Digitalkamera mit 1,3 Megapixeln zu dokumentieren.'
  }
};

for (const [relative, copy] of Object.entries(pages)) {
  const file = path.join(root, relative);
  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes(copy.metaNew)) {
    const metaPattern = new RegExp(`<meta content="${copy.metaOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" name="description"/>`);
    html = replacePattern(html, metaPattern, `<meta content="${copy.metaNew}" name="description"/>`, relative, 'meta description');
  }

  const heroPattern = /(<section class="hero oeuvre-hero"><div class="wrap"><p class="eyebrow">[\s\S]*?<\/p><h1>)[\s\S]*?(<\/h1><p class="lead">)[\s\S]*?(<\/p><figure class="service-hero-image)/;
  html = replacePattern(html, heroPattern, `$1${copy.h1New}$2${copy.leadNew}$3`, relative, 'hero');
  html = replaceExact(html, copy.originOld, copy.originNew, relative, 'origin paragraph');
  html = replaceExact(html, copy.timelineOld, copy.timelineNew, relative, '1999 timeline');
  html = html.replaceAll('2026-07-15T23:30:00+02:00', '2026-08-02T17:10:00+02:00');

  fs.writeFileSync(file, html, 'utf8');
  changed.push(relative);
}

const oeuvrePath = path.join(root, 'oeuvre.json');
const oeuvre = JSON.parse(fs.readFileSync(oeuvrePath, 'utf8'));
oeuvre.version = '2026-08-02-human-origin-v3';
oeuvre.person.canonicalId = 'https://www.norbertbanhalmi.com/about/';
oeuvre.origin = {
  year: 1999,
  context: 'MOL Y2K project',
  role: 'IT specialist',
  action: 'Self-initiated documentation of the project',
  equipment: 'Basic 1.3-megapixel digital camera; exact model not claimed',
  evidenceStatus: 'Artist recollection',
  chronology: 'Military documentation followed later as a separate phase.'
};
oeuvre.timeline[0] = [
  '1999',
  'While working as an IT specialist on the MOL Y2K project, Norbert Banhalmi began documenting the project on his own initiative with a basic 1.3-megapixel digital camera.'
];
fs.writeFileSync(oeuvrePath, `${JSON.stringify(oeuvre, null, 2)}\n`, 'utf8');
changed.push('oeuvre.json');

const ecosystemBlock = `

<!-- HUMAN-SEO-GEO-LLM-ECOSYSTEM:START -->
## Official three-site ecosystem
- Professional services, pricing and enquiries: https://www.norbertbanhalmi.com/
- Artistic oeuvre and source archive: https://www.banhalmi.art/
- Essays and migrated blog posts: https://blog.banhalmi.art/
- Canonical Person: https://www.norbertbanhalmi.com/about/

## Origin chronology
Norbert Banhalmi recalls that digital image-making entered his life during the MOL Y2K project in 1999. He participated as an IT specialist and began documenting the project on his own initiative with a basic 1.3-megapixel digital camera. Military documentation followed later as a separate phase. The MOL Y2K photography was self-initiated documentation, not a commissioned photography assignment; no exact camera model is claimed.
<!-- HUMAN-SEO-GEO-LLM-ECOSYSTEM:END -->
`;
for (const relative of ['llms.txt', 'ai.txt']) {
  const file = path.join(root, relative);
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/\n?<!-- HUMAN-SEO-GEO-LLM-ECOSYSTEM:START -->[\s\S]*?<!-- HUMAN-SEO-GEO-LLM-ECOSYSTEM:END -->\n?/g, '\n');
  text = `${text.trimEnd()}${ecosystemBlock}`;
  fs.writeFileSync(file, text, 'utf8');
  changed.push(relative);
}

console.log(`Professional human/SEO/GEO/schema/LLM migration updated ${changed.length} files.`);
for (const relative of changed) console.log(relative);
