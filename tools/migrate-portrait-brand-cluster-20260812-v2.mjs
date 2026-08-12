import fs from 'node:fs';

const R = fs.readFileSync;
const W = fs.writeFileSync;
const read = p => R(p, 'utf8');
const write = (p, s) => W(p, s);
function rx1(s, re, to, label) {
  const m = s.match(re);
  if (!m || m.length !== 1) throw new Error(`${label}: expected exactly one match`);
  return s.replace(re, to);
}
function lit1(s, from, to, label) {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`${label}: expected 1 literal match, got ${n}`);
  return s.replace(from, to);
}
function setSeo(s, pageTitle, description) {
  s = rx1(s, /<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`, 'title');
  s = rx1(s, /<meta\s+content="[^"]*"\s+name="description"\s*\/>/, `<meta content="${description}" name="description"/>`, 'description');
  s = rx1(s, /<meta\s+content="[^"]*"\s+property="og:title"\s*\/>/, `<meta content="${pageTitle}" property="og:title"/>`, 'og:title');
  s = rx1(s, /<meta\s+content="[^"]*"\s+property="og:description"\s*\/>/, `<meta content="${description}" property="og:description"/>`, 'og:description');
  s = rx1(s, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${pageTitle}">`, 'twitter:title');
  s = rx1(s, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`, 'twitter:description');
  return s;
}

const pages = {
  homeEn: 'index.html', homeHu: 'hu/index.html', homeDe: 'de-at/index.html',
  portraitEn: 'portrait/index.html', portraitHu: 'hu/portre/index.html', portraitDe: 'de-at/portrait/index.html',
  brandEn: 'lifestyle/index.html', brandHu: 'hu/brand/index.html', brandDe: 'de-at/brand/index.html'
};

// EN homepage
{
  let s = read(pages.homeEn);
  s = setSeo(s, 'BANHALMI | Executive Portrait &amp; Brand Photography | Vienna–Budapest', 'Headshots, business and executive portraits, personal brand photography and business brand photography in Vienna and Budapest — connected through strategic visual positioning.');
  s = lit1(s, 'Executive portraiture · Brand photography · C-level events · Fine art', 'Headshots &amp; executive portraits · Personal &amp; business brand photography · C-level events · Fine art', 'EN home service line');
  s = rx1(s, /Four principal services:[^<]+/, 'Four principal services remain the structure: Portrait Photography, Brand Photography, C-Level Event Photography and Fine Art Photography. Within the business track, one connected system runs from a precise headshot and business portrait through executive portraiture to personal brand photography, business brand photography and strategic visual positioning.', 'EN home hierarchy');
  s = rx1(s, /For leaders, founders and experts who need one credible visual identity[^<]+/, 'For leaders, founders and experts who need credible headshots, business portraits and executive portraits across LinkedIn, company websites, press and speaking — with a clear route into personal-brand photography when one profile image is no longer enough.', 'EN home portrait card');
  s = rx1(s, /For organisations that need founders, teams, workplaces and campaigns to read as one recognisable brand[^<]+/, 'For personal brands and organisations that need leaders, teams, workplaces and campaigns to read as one recognisable visual identity — from personal-brand photography to complete business-brand and employer-brand image systems.', 'EN home brand card');
  write(pages.homeEn, s);
}

// HU homepage
{
  let s = read(pages.homeHu);
  s = setSeo(s, 'BANHALMI | Headshot, executive portré és brandfotózás | Bécs–Budapest', 'Üzleti headshot, üzleti és executive portréfotózás, személyes brand fotózás és vállalati brandfotózás Budapesten és Bécsben, stratégiai vizuális pozicionálással.');
  s = lit1(s, 'Vezetői portré · Brandfotózás · Vezetői események · Művészi fotográfia', 'Headshot és executive portré · Személyes és üzleti brandfotózás · Vezetői események · Művészi fotográfia', 'HU home service line');
  s = rx1(s, /Négy fő szolgáltatás:[^<]+/, 'A négy fő szolgáltatás változatlan: portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia. Az üzleti területen azonban egy összefüggő rendszer épül: üzleti headshot → üzleti portré → executive és vezetői portré → személyes brand fotózás → üzleti és vállalati brandfotózás → stratégiai vizuális pozicionálás.', 'HU home hierarchy');
  s = rx1(s, /Vezetőknek, alapítóknak és szakértőknek, akiknek a LinkedInen[^<]+/, 'Vezetőknek, alapítóknak és szakértőknek: üzleti headshot, üzleti portré és executive portré a LinkedInhez, vállalati weboldalhoz, sajtóhoz és előadásokhoz — a pontos profilképtől a teljes vezetői portrérendszerig.', 'HU home portrait card');
  s = rx1(s, /Szervezeteknek, amelyek azt szeretnék, hogy a vezetők, csapatok, munkakörnyezetek és kampányok[^<]+/, 'Személyes márkát építő vezetőknek, szakértőknek és szervezeteknek: személyes brand fotózás, üzleti brand fotózás, vezetői és csapatképek, munkakörnyezet és kampányanyag egyetlen felismerhető vizuális rendszerben.', 'HU home brand card');
  write(pages.homeHu, s);
}

// DE homepage
{
  let s = read(pages.homeDe);
  s = setSeo(s, 'BANHALMI | Executive-Porträts &amp; Brandfotografie | Wien–Budapest', 'Business-Headshots, Business- und Executive-Porträts, Personal-Branding-Fotografie und Unternehmensfotografie in Wien und Budapest — verbunden durch strategische visuelle Positionierung.');
  s = lit1(s, 'Executive-Porträts · Brandfotografie · C-Level-Events · Fine-Art-Fotografie', 'Business-Headshots &amp; Executive-Porträts · Personal &amp; Business Brand Photography · C-Level-Events · Fine Art', 'DE home service line');
  s = rx1(s, /Vier Hauptleistungen:[^<]+/, 'Die vier Hauptleistungen bleiben Porträtfotografie, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie. Im Business-Bereich bilden sie eine klare Kette: Business-Headshot → Business-Porträt → Executive-Porträt → Personal Branding → Unternehmens- und Brandfotografie → strategische visuelle Positionierung.', 'DE home hierarchy');
  s = rx1(s, /Für Führungskräfte, Gründer:innen und Expert:innen, die auf LinkedIn[^<]+/, 'Für Führungskräfte, Gründer:innen und Expert:innen: Business-Headshots, Business-Porträts und Executive-Porträts für LinkedIn, Unternehmenswebsite, Presse und Vorträge — vom präzisen Profilbild bis zum vollständigen Leadership-Porträtsystem.', 'DE home portrait card');
  s = rx1(s, /Für Organisationen, deren Führungskräfte, Teams, Arbeitswelten und Kampagnen[^<]+/, 'Für Personal Brands und Organisationen: Personal-Branding-Fotografie, Unternehmensfotografie, Führungskräfte, Teams, Arbeitswelten und Kampagnen als ein wiedererkennbares visuelles System für Recruiting, Vertrieb, Medien und Unternehmenskommunikation.', 'DE home brand card');
  write(pages.homeDe, s);
}

function portraitPage(path, lang) {
  let s = read(path);
  if (lang === 'en') {
    s = setSeo(s, 'Headshot &amp; Executive Portrait Photography | Vienna &amp; Budapest | BANHALMI', 'Business headshots, business portraits and executive portrait photography for leaders, founders and experts in Vienna and Budapest, with a direct path into personal brand photography.');
    s = lit1(s, 'Headshots · Executive portraits · C-Level business photography · Vienna · Budapest', 'Headshots · Business portraits · Executive portraits · Personal branding · Vienna · Budapest', 'EN portrait eyebrow');
    s = lit1(s, 'A portrait that still feels like you.', 'Headshots, business portraits and executive portraits that still feel like you.', 'EN portrait H1');
    s = rx1(s, /You may need one precise business headshot\.[^<]+/, 'You may need one precise business headshot, a stronger executive portrait or a complete personal-brand series. I shape each portrait around you, the people who will see it and the place where it needs to work — in Vienna, Budapest or across an international communication system.', 'EN portrait intro');
    s = lit1(s, 'Three core business services', 'One connected portrait and personal-brand system', 'EN portrait label');
    s = lit1(s, 'From a precise headshot to a complete leadership image set', 'From a precise headshot to executive presence and a complete personal brand', 'EN portrait H2');
    s = rx1(s, /<li>Personal branding and professional websites<\/li>/, '<li><a href="/lifestyle/">Personal brand photography</a> — a wider image system for founders, experts and public-facing leaders across websites, LinkedIn, press, speaking and thought leadership.</li>', 'EN portrait brand link');
  } else if (lang === 'hu') {
    s = setSeo(s, 'Üzleti headshot és executive portréfotózás | Budapest–Bécs | BANHALMI', 'Üzleti headshot, üzleti portré és executive portréfotózás vezetőknek, alapítóknak és szakértőknek Budapesten és Bécsben, továbbépíthető személyes brand fotózássá.');
    s = lit1(s, 'üzleti portré · Vezetői portré · Felsővezetői üzleti fotózás · Bécs · Budapest', 'Üzleti headshot · Üzleti portré · Executive és vezetői portré · Személyes brand · Budapest · Bécs', 'HU portrait eyebrow');
    s = lit1(s, 'Egy portré, amelyen önmagára ismer.', 'Üzleti headshot és executive portré, amelyen önmagára ismer.', 'HU portrait H1');
    s = rx1(s, /Lehet, hogy egy pontos üzleti headshotra van szüksége\.[^<]+/, 'Lehet, hogy egy pontos üzleti headshotra, egy erősebb executive portréra vagy egy teljes személyes brand képsorozatra van szüksége. A portrét nem kész sablonhoz, hanem Önhöz, a közönségéhez és a tényleges felhasználáshoz igazítom Budapesten és Bécsben.', 'HU portrait intro');
    s = lit1(s, 'Három fő üzleti szolgáltatás', 'Egy összefüggő portré- és személyesbrand-rendszer', 'HU portrait label');
    s = lit1(s, 'A pontos üzleti portrétól a teljes vezetői képanyagig', 'Az üzleti headshottól az executive jelenléten át a teljes személyes brandig', 'HU portrait H2');
    s = rx1(s, /<li>Személyes márkaépítés és szakmai weboldalak<\/li>/, '<li><a href="/hu/brand/">Személyes brand fotózás</a> — szélesebb képi rendszer alapítóknak, vezetőknek és szakértőknek weboldalhoz, LinkedInhez, sajtóhoz, előadásokhoz és szakmai véleményformáláshoz.</li>', 'HU portrait brand link');
  } else {
    s = setSeo(s, 'Business-Headshot &amp; Executive-Porträt | Wien–Budapest | BANHALMI', 'Business-Headshots, Business-Porträts und Executive-Porträtfotografie für Führungskräfte, Gründer:innen und Expert:innen in Wien und Budapest — ausbaubar zum Personal Branding.');
    s = lit1(s, 'Headshots · Executive-Porträts · C-Level-Businessfotografie · Wien · Budapest', 'Business-Headshots · Business-Porträts · Executive-Porträts · Personal Branding · Wien · Budapest', 'DE portrait eyebrow');
    s = lit1(s, 'Ein Porträt, auf dem Sie sich wiedererkennen.', 'Business-Headshots und Executive-Porträts, auf denen Sie sich wiedererkennen.', 'DE portrait H1');
    s = rx1(s, /Vielleicht brauchen Sie einen präzisen Business-Headshot\.[^<]+/, 'Vielleicht brauchen Sie einen präzisen Business-Headshot, ein stärkeres Executive-Porträt oder eine vollständige Personal-Branding-Serie. Ich richte jedes Bild nach Ihnen, Ihrem Publikum und dem tatsächlichen Einsatz aus — in Wien, Budapest und in internationaler Kommunikation.', 'DE portrait intro');
    s = lit1(s, 'Drei zentrale Businessleistungen', 'Ein verbundenes Porträt- und Personal-Branding-System', 'DE portrait label');
    s = lit1(s, 'Vom präzisen Headshot bis zum vollständigen Porträtset für Führungskräfte', 'Vom Business-Headshot über Executive-Präsenz bis zum vollständigen Personal Branding', 'DE portrait H2');
    s = rx1(s, /<li>Personal Branding und professionelle Websites<\/li>/, '<li><a href="/de-at/brand/">Personal-Branding-Fotografie</a> — ein breiteres Bildsystem für Gründer:innen, Führungskräfte und Expert:innen auf Website, LinkedIn, in Presse, Vorträgen und Thought Leadership.</li>', 'DE portrait brand link');
  }
  write(path, s);
}
portraitPage(pages.portraitEn, 'en');
portraitPage(pages.portraitHu, 'hu');
portraitPage(pages.portraitDe, 'de');

function brandPage(path, lang) {
  let s = read(path);
  if (lang === 'en') {
    s = setSeo(s, 'Personal &amp; Business Brand Photography | Vienna &amp; Budapest | BANHALMI', 'Personal brand photography and business brand photography in Vienna and Budapest for founders, leaders, experts and organisations — from portrait to complete visual positioning.');
    s = lit1(s, 'Brand photography · Visual positioning strategy', 'Personal brand photography · Business brand photography · Visual positioning · Vienna · Budapest', 'EN brand eyebrow');
    s = lit1(s, 'Brand Photography &amp; Visual Positioning', 'Personal &amp; Business Brand Photography', 'EN brand H1');
    s = rx1(s, /A brand becomes credible when the people inside it remain visible\.[^<]+/, 'A brand becomes credible when the people inside it remain visible. Personal brand photography extends a leader beyond the headshot into a recognisable public image system; business brand photography connects leaders, teams, workplaces, products and campaigns into one visual identity. In Vienna and Budapest, both start with positioning and end with photographs built for real communication.', 'EN brand intro');
    s = lit1(s, '<li>Personal brands and thought leadership</li>', '<li>Personal brand photography for founders, leaders, experts and thought leadership</li>', 'EN brand personal');
    s = lit1(s, '<li>Corporate identity and team photography</li>', '<li>Business brand photography, corporate identity and team photography</li>', 'EN brand business');
  } else if (lang === 'hu') {
    s = setSeo(s, 'Személyes és üzleti brand fotózás | Budapest–Bécs | BANHALMI', 'Személyes brand fotózás és üzleti brand fotózás vezetőknek, szakértőknek és vállalatoknak Budapesten és Bécsben — portrétól a teljes vizuális pozicionálásig.');
    s = lit1(s, 'Brandfotózás · Vizuális pozicionálási stratégia', 'Személyes brand fotózás · Üzleti brand fotózás · Vizuális pozicionálás · Budapest · Bécs', 'HU brand eyebrow');
    s = lit1(s, 'Képek, amelyekről felismerik a vállalatot.', 'Személyes és üzleti brand fotózás, amelyről felismerik Önt és a vállalatot.', 'HU brand H1');
    s = rx1(s, /Egy vállalatnak is van arca\.[^<]+/, 'A személyes brand az ember felismerhető szakmai jelenlétét, az üzleti brand pedig a vezetők, a csapat, a munkakörnyezet és a kommunikáció közös képi nyelvét építi. Budapesten és Bécsben a headshottól és executive portrétól indulva teljes, következetes vizuális rendszerré fejlesztem ezt a jelenlétet.', 'HU brand intro');
    s = lit1(s, '<li>Személyes márka és szakmai véleményformálás</li>', '<li>Személyes brand fotózás vezetőknek, alapítóknak, szakértőknek és szakmai véleményformálóknak</li>', 'HU brand personal');
    s = lit1(s, '<li>Vállalati identitás és csapatfotózás</li>', '<li>Üzleti brand fotózás, vállalati identitás és csapatfotózás</li>', 'HU brand business');
  } else {
    s = setSeo(s, 'Personal Branding &amp; Unternehmensfotografie | Wien–Budapest | BANHALMI', 'Personal-Branding-Fotografie und Business-Brand-Fotografie für Führungskräfte, Expert:innen und Unternehmen in Wien und Budapest — vom Porträt bis zur visuellen Positionierung.');
    s = rx1(s, /Brandfotografie · Visuelle[^<]+/, 'Personal-Branding-Fotografie · Business-Brand-Fotografie · Visuelle Positionierung · Wien · Budapest', 'DE brand eyebrow');
    s = rx1(s, /Brandfotografie &amp; visuelle Markenpositionierung|Brandfotografie &amp; Visuelle Markenpositionierung/, 'Personal Branding &amp; Unternehmensfotografie', 'DE brand H1');
    s = rx1(s, /Eine Marke wird glaubwürdig, wenn die Menschen darin sichtbar bleiben\.[^<]+/, 'Eine Marke wird glaubwürdig, wenn die Menschen darin sichtbar bleiben. Personal-Branding-Fotografie erweitert eine Führungsperson über den Headshot hinaus zu einem wiedererkennbaren öffentlichen Bildsystem; Business-Brand-Fotografie verbindet Führung, Teams, Arbeitswelten, Produkte und Kampagnen zu einer visuellen Identität. In Wien und Budapest beginnt beides mit Positionierung und endet mit Bildern für reale Kommunikation.', 'DE brand intro');
    s = rx1(s, /<li>Personal Brands[^<]*<\/li>/, '<li>Personal-Branding-Fotografie für Gründer:innen, Führungskräfte, Expert:innen und Thought Leadership</li>', 'DE brand personal');
    s = rx1(s, /<li>Corporate Identity[^<]*<\/li>/, '<li>Business-Brand-Fotografie, Corporate Identity und Teamfotografie</li>', 'DE brand business');
  }
  write(path, s);
}
brandPage(pages.brandEn, 'en');
brandPage(pages.brandHu, 'hu');
brandPage(pages.brandDe, 'de');

// Machine-readable service taxonomy.
{
  const p = 'services.json';
  const data = JSON.parse(read(p));
  data.dateModified = '2026-08-12T23:25:00+02:00';
  const portrait = data.itemListElement.find(x => x.position === 1);
  const brand = data.itemListElement.find(x => x.position === 2);
  portrait.name = 'Headshot, Business & Executive Portrait Photography';
  portrait.alternateName = [...new Set([...portrait.alternateName, 'Business headshot photography','Business portrait photography','Personal brand portrait photography','Üzleti headshot fotózás','Üzleti portréfotózás','Executive portréfotózás','Személyes brand portréfotózás','Business-Headshot-Fotografie','Business-Porträtfotografie','Executive-Porträtfotografie','Personal-Branding-Porträtfotografie'])];
  portrait.description = 'Business headshots, business portraits and executive portrait photography for leaders, founders and experts in Vienna and Budapest, designed to scale from one precise profile image into a complete personal-brand portrait system.';
  portrait.serviceOutput = 'A connected portrait system: headshot → business portrait → executive portrait → personal-brand imagery.';
  brand.name = 'Personal & Business Brand Photography';
  brand.alternateName = [...new Set([...brand.alternateName, 'Personal brand photography','Business brand photography','Personal branding photography','Business branding photography','Személyes brand fotózás','Üzleti brand fotózás','Vállalati brandfotózás','Personal-Branding-Fotografie','Business-Brand-Fotografie','Unternehmensfotografie'])];
  brand.description = 'Personal brand photography and business brand photography for leaders, experts and organisations in Vienna and Budapest, connecting portraits, teams, workplaces and campaigns through strategic visual positioning.';
  brand.audience.audienceType = 'Leaders, founders, experts, personal brands, organisations and employer-branding teams';
  brand.serviceOutput = 'A coherent visual brand system spanning personal brand, leadership, team, workplace, campaign and employer-brand imagery.';
  write(p, JSON.stringify(data, null, 2) + '\n');
}

// LLM entry.
{
  const p = 'ai-entry.json';
  const data = JSON.parse(read(p));
  data.version = '2026-08-12-portrait-brand-cluster';
  data.identity.principalServices = ['Headshot, Business and Executive Portrait Photography','Personal and Business Brand Photography with strategic visual positioning','C-Level Event Photography','Fine Art Photography'];
  data.identity.serviceProgression = {
    en: 'headshot → business portrait → executive portrait → personal brand photography → business brand photography → strategic visual positioning',
    hu: 'üzleti headshot → üzleti portré → executive és vezetői portré → személyes brand fotózás → üzleti és vállalati brandfotózás → stratégiai vizuális pozicionálás',
    de: 'Business-Headshot → Business-Porträt → Executive-Porträt → Personal-Branding-Fotografie → Business-Brand-Fotografie → strategische visuelle Positionierung'
  };
  data.identity.localServiceIntent = {
    Vienna: ['Business headshot','Business portrait','Executive portrait','Personal branding photography','Business brand photography'],
    Budapest: ['üzleti headshot fotózás','üzleti portréfotózás','executive portréfotózás','személyes brand fotózás','üzleti brand fotózás']
  };
  write(p, JSON.stringify(data, null, 2) + '\n');
}

console.log('EN/HU/DE portrait → personal brand → business brand cluster migrated for Vienna and Budapest.');
