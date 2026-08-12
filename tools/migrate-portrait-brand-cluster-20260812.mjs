import fs from 'node:fs';

const targets = {
  enHome: 'index.html',
  huHome: 'hu/index.html',
  deHome: 'de-at/index.html',
  enPortrait: 'portrait/index.html',
  huPortrait: 'hu/portre/index.html',
  dePortrait: 'de-at/portrait/index.html',
  enBrand: 'lifestyle/index.html',
  huBrand: 'hu/brand/index.html',
  deBrand: 'de-at/brand/index.html'
};

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, value) { fs.writeFileSync(path, value); }
function once(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 match, got ${count}`);
  return text.replace(from, to);
}
function title(text, value) {
  if (!/<title>[^<]*<\/title>/.test(text)) throw new Error('title missing');
  return text.replace(/<title>[^<]*<\/title>/, `<title>${value}</title>`);
}
function metaName(text, name, value) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<meta\\s+content="[^"]*"\\s+name="${esc}"\\s*\\/>`);
  if (!re.test(text)) throw new Error(`meta name=${name} missing`);
  return text.replace(re, `<meta content="${value}" name="${name}"/>`);
}
function metaProperty(text, prop, value) {
  const esc = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<meta\\s+content="[^"]*"\\s+property="${esc}"\\s*\\/>`);
  if (!re.test(text)) throw new Error(`meta property=${prop} missing`);
  return text.replace(re, `<meta content="${value}" property="${prop}"/>`);
}
function twitter(text, name, value) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<meta name="${esc}" content="[^"]*">`);
  if (!re.test(text)) throw new Error(`twitter ${name} missing`);
  return text.replace(re, `<meta name="${name}" content="${value}">`);
}
function seo(text, {pageTitle, description}) {
  text = title(text, pageTitle);
  text = metaName(text, 'description', description);
  text = metaProperty(text, 'og:title', pageTitle);
  text = metaProperty(text, 'og:description', description);
  text = twitter(text, 'twitter:title', pageTitle);
  text = twitter(text, 'twitter:description', description);
  return text;
}

// English homepage: make the service ladder explicit without changing the four-service IA.
{
  let s = read(targets.enHome);
  s = seo(s, {
    pageTitle: 'BANHALMI | Executive Portrait & Brand Photography | Vienna–Budapest',
    description: 'Headshots, business and executive portraits, personal brand photography and business brand photography in Vienna and Budapest — connected through strategic visual positioning.'
  });
  s = once(s,
    'Executive portraiture · Brand photography · C-level events · Fine art',
    'Headshots & executive portraits · Personal & business brand photography · C-level events · Fine art',
    'EN home service line');
  s = once(s,
    'Four principal services: Executive Portraiture, Brand Photography, C-Level Event Photography and Fine Art Photography. Headshots, employer-branding imagery, press portraits and visual brand strategy are tools within these areas—not extra categories you have to decode.',
    'Four principal services remain the structure: Portrait Photography, Brand Photography, C-Level Event Photography and Fine Art Photography. Within the business track, one connected system runs from a precise headshot and business portrait through executive portraiture to personal brand photography, business brand photography and strategic visual positioning.',
    'EN home hierarchy');
  s = once(s,
    'For leaders, founders and experts who need one credible visual identity across LinkedIn, company websites, press, speaking and internal communication—from a precise headshot to a complete public portrait system.',
    'For leaders, founders and experts who need credible headshots, business portraits and executive portraits across LinkedIn, company websites, press and speaking — with a clear route into personal-brand photography when one profile image is no longer enough.',
    'EN home portrait card');
  s = once(s,
    'For organisations that need founders, teams, workplaces and campaigns to read as one recognisable brand across recruitment, sales, media and corporate communication—not as unrelated image sets.',
    'For personal brands and organisations that need leaders, teams, workplaces and campaigns to read as one recognisable visual identity — from personal-brand photography to complete business-brand and employer-brand image systems.',
    'EN home brand card');
  write(targets.enHome, s);
}

// Hungarian homepage.
{
  let s = read(targets.huHome);
  s = seo(s, {
    pageTitle: 'BANHALMI | Headshot, executive portré és brandfotózás | Bécs–Budapest',
    description: 'Üzleti headshot, üzleti és executive portréfotózás, személyes brand fotózás és vállalati brandfotózás Budapesten és Bécsben, stratégiai vizuális pozicionálással.'
  });
  s = once(s,
    'Vezetői portré · Brandfotózás · Vezetői események · Művészi fotográfia',
    'Headshot és executive portré · Személyes és üzleti brandfotózás · Vezetői események · Művészi fotográfia',
    'HU home service line');
  s = once(s,
    'Négy fő szolgáltatás: vezetői portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia. Az üzleti portré, a munkáltatói márkaépítés, a sajtóportré és a vizuális márkastratégia egymást kiegészítő eszközök. A négy fő területen belül együtt építenek következetes képi rendszert, nem egymással versengő szolgáltatásként jelennek meg.',
    'A négy fő szolgáltatás változatlan: portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia. Az üzleti területen azonban egy összefüggő rendszer épül: üzleti headshot → üzleti portré → executive és vezetői portré → személyes brand fotózás → üzleti és vállalati brandfotózás → stratégiai vizuális pozicionálás.',
    'HU home hierarchy');
  s = once(s,
    'Vezetőknek, alapítóknak és szakértőknek, akiknek a LinkedInen, a vállalati weboldalon, a sajtóban, előadásokon és a belső kommunikációban is hiteles, egységes képi jelenlétre van szükségük — a pontos profilképtől a teljes nyilvános portrérendszerig.',
    'Vezetőknek, alapítóknak és szakértőknek: üzleti headshot, üzleti portré és executive portré a LinkedInhez, vállalati weboldalhoz, sajtóhoz és előadásokhoz — a pontos profilképtől a teljes vezetői portrérendszerig.',
    'HU home portrait card');
  s = once(s,
    'Szervezeteknek, amelyek azt szeretnék, hogy a vezetők, csapatok, munkakörnyezetek és kampányok a toborzásban, az értékesítésben, a médiában és a vállalati kommunikációban is egyetlen felismerhető márkaként jelenjenek meg — ne különálló képsorozatokként.',
    'Személyes márkát építő vezetőknek, szakértőknek és szervezeteknek: személyes brand fotózás, üzleti brand fotózás, vezetői és csapatképek, munkakörnyezet és kampányanyag egyetlen felismerhető vizuális rendszerben.',
    'HU home brand card');
  write(targets.huHome, s);
}

// German homepage.
{
  let s = read(targets.deHome);
  s = seo(s, {
    pageTitle: 'BANHALMI | Executive-Porträts & Brandfotografie | Wien–Budapest',
    description: 'Business-Headshots, Business- und Executive-Porträts, Personal-Branding-Fotografie und Unternehmensfotografie in Wien und Budapest — verbunden durch strategische visuelle Positionierung.'
  });
  s = once(s,
    'Executive-Porträts · Brandfotografie · C-Level-Events · Fine-Art-Fotografie',
    'Business-Headshots & Executive-Porträts · Personal & Business Brand Photography · C-Level-Events · Fine Art',
    'DE home service line');
  s = once(s,
    'Vier Hauptleistungen: Executive-Porträts, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie. Headshots, Employer-Branding-Bilder, Presseporträts und visuelle Markenstrategie sind Werkzeuge innerhalb dieser Bereiche — keine zusätzlichen Kategorien, die zuerst entschlüsselt werden müssen.',
    'Die vier Hauptleistungen bleiben Porträtfotografie, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie. Im Business-Bereich bilden sie eine klare Kette: Business-Headshot → Business-Porträt → Executive-Porträt → Personal Branding → Unternehmens- und Brandfotografie → strategische visuelle Positionierung.',
    'DE home hierarchy');
  s = once(s,
    'Für Führungskräfte, Gründer:innen und Expert:innen, die auf LinkedIn, der Unternehmenswebsite, in Presse, Vorträgen und interner Kommunikation eine glaubwürdige, konsistente visuelle Identität benötigen — vom präzisen Headshot bis zum vollständigen öffentlichen Porträtsystem.',
    'Für Führungskräfte, Gründer:innen und Expert:innen: Business-Headshots, Business-Porträts und Executive-Porträts für LinkedIn, Unternehmenswebsite, Presse und Vorträge — vom präzisen Profilbild bis zum vollständigen Leadership-Porträtsystem.',
    'DE home portrait card');
  s = once(s,
    'Für Organisationen, deren Führungskräfte, Teams, Arbeitswelten und Kampagnen in Recruiting, Vertrieb, Medien und Unternehmenskommunikation als eine wiedererkennbare Marke erscheinen sollen — nicht als voneinander unabhängige Bildserien.',
    'Für Personal Brands und Organisationen: Personal-Branding-Fotografie, Unternehmensfotografie, Führungskräfte, Teams, Arbeitswelten und Kampagnen als ein wiedererkennbares visuelles System für Recruiting, Vertrieb, Medien und Unternehmenskommunikation.',
    'DE home brand card');
  write(targets.deHome, s);
}

// Portrait pillar pages.
{
  let s = read(targets.enPortrait);
  s = seo(s, {
    pageTitle: 'Headshot & Executive Portrait Photography | Vienna & Budapest | BANHALMI',
    description: 'Business headshots, business portraits and executive portrait photography for leaders, founders and experts in Vienna and Budapest, with a direct path into personal brand photography.'
  });
  s = once(s, 'Headshots · Executive portraits · C-Level business photography · Vienna · Budapest', 'Headshots · Business portraits · Executive portraits · Personal branding · Vienna · Budapest', 'EN portrait eyebrow');
  s = once(s, 'A portrait that still feels like you.', 'Headshots, business portraits and executive portraits that still feel like you.', 'EN portrait H1');
  s = once(s,
    'You may need one precise business headshot. Or you may need a complete series. Either way, I shape the portrait around you, the people who will see it and the place where it needs to work.',
    'You may need one precise business headshot, a stronger executive portrait or a complete personal-brand series. I shape each portrait around you, the people who will see it and the place where it needs to work — in Vienna, Budapest or across an international communication system.',
    'EN portrait intro');
  s = once(s, 'Three core business services', 'One connected portrait and personal-brand system', 'EN portrait label');
  s = once(s, 'From a precise headshot to a complete leadership image set', 'From a precise headshot to executive presence and a complete personal brand', 'EN portrait section H2');
  s = once(s,
    '<li>Personal branding and professional websites</li>',
    '<li><a href="/lifestyle/">Personal brand photography</a> — a wider image system for founders, experts and public-facing leaders across websites, LinkedIn, press, speaking and thought leadership.</li>',
    'EN portrait personal brand list');
  write(targets.enPortrait, s);
}
{
  let s = read(targets.huPortrait);
  s = seo(s, {
    pageTitle: 'Üzleti headshot és executive portréfotózás | Budapest–Bécs | BANHALMI',
    description: 'Üzleti headshot, üzleti portré és executive portréfotózás vezetőknek, alapítóknak és szakértőknek Budapesten és Bécsben, továbbépíthető személyes brand fotózássá.'
  });
  s = once(s, 'üzleti portré · Vezetői portré · Felsővezetői üzleti fotózás · Bécs · Budapest', 'Üzleti headshot · Üzleti portré · Executive és vezetői portré · Személyes brand · Budapest · Bécs', 'HU portrait eyebrow');
  s = once(s, 'Egy portré, amelyen önmagára ismer.', 'Üzleti headshot és executive portré, amelyen önmagára ismer.', 'HU portrait H1');
  s = once(s,
    'Lehet, hogy egy pontos üzleti headshotra van szüksége. Lehet, hogy egy egész képsorozatra. Bármi is a cél, a portrét nem egy kész sablonhoz, hanem Önhöz és ahhoz a helyzethez igazítom, ahol majd használni fogja.',
    'Lehet, hogy egy pontos üzleti headshotra, egy erősebb executive portréra vagy egy teljes személyes brand képsorozatra van szüksége. A portrét nem kész sablonhoz, hanem Önhöz, a közönségéhez és a tényleges felhasználáshoz igazítom Budapesten és Bécsben.',
    'HU portrait intro');
  s = once(s, 'Három fő üzleti szolgáltatás', 'Egy összefüggő portré- és személyesbrand-rendszer', 'HU portrait label');
  s = once(s, 'A pontos üzleti portrétól a teljes vezetői képanyagig', 'Az üzleti headshottól az executive jelenléten át a teljes személyes brandig', 'HU portrait section H2');
  s = once(s,
    '<li>Személyes márkaépítés és szakmai weboldalak</li>',
    '<li><a href="/hu/brand/">Személyes brand fotózás</a> — szélesebb képi rendszer alapítóknak, vezetőknek és szakértőknek weboldalhoz, LinkedInhez, sajtóhoz, előadásokhoz és szakmai véleményformáláshoz.</li>',
    'HU portrait personal brand list');
  write(targets.huPortrait, s);
}
{
  let s = read(targets.dePortrait);
  s = seo(s, {
    pageTitle: 'Business-Headshot & Executive-Porträt | Wien–Budapest | BANHALMI',
    description: 'Business-Headshots, Business-Porträts und Executive-Porträtfotografie für Führungskräfte, Gründer:innen und Expert:innen in Wien und Budapest — ausbaubar zum Personal Branding.'
  });
  s = once(s, 'Headshots · Executive-Porträts · C-Level-Businessfotografie · Wien · Budapest', 'Business-Headshots · Business-Porträts · Executive-Porträts · Personal Branding · Wien · Budapest', 'DE portrait eyebrow');
  s = once(s, 'Ein Porträt, auf dem Sie sich wiedererkennen.', 'Business-Headshots und Executive-Porträts, auf denen Sie sich wiedererkennen.', 'DE portrait H1');
  s = once(s,
    'Vielleicht brauchen Sie einen präzisen Business-Headshot. Vielleicht eine ganze Serie. In beiden Fällen richte ich das Porträt nach Ihnen, den Betrachter:innen und dem späteren Einsatz aus.',
    'Vielleicht brauchen Sie einen präzisen Business-Headshot, ein stärkeres Executive-Porträt oder eine vollständige Personal-Branding-Serie. Ich richte jedes Bild nach Ihnen, Ihrem Publikum und dem tatsächlichen Einsatz aus — in Wien, Budapest und in internationaler Kommunikation.',
    'DE portrait intro');
  s = once(s, 'Drei zentrale Businessleistungen', 'Ein verbundenes Porträt- und Personal-Branding-System', 'DE portrait label');
  s = once(s, 'Vom präzisen Headshot bis zum vollständigen Porträtset für Führungskräfte', 'Vom Business-Headshot über Executive-Präsenz bis zum vollständigen Personal Branding', 'DE portrait section H2');
  s = once(s,
    '<li>Personal Branding und professionelle Websites</li>',
    '<li><a href="/de-at/brand/">Personal-Branding-Fotografie</a> — ein breiteres Bildsystem für Gründer:innen, Führungskräfte und Expert:innen auf Website, LinkedIn, in Presse, Vorträgen und Thought Leadership.</li>',
    'DE portrait personal brand list');
  write(targets.dePortrait, s);
}

// Brand pillar pages: explicitly own both personal-brand and business-brand search intent.
{
  let s = read(targets.enBrand);
  s = seo(s, {
    pageTitle: 'Personal & Business Brand Photography | Vienna & Budapest | BANHALMI',
    description: 'Personal brand photography and business brand photography in Vienna and Budapest for founders, leaders, experts and organisations — from portrait to complete visual positioning.'
  });
  s = once(s, 'Brand photography · Visual positioning strategy', 'Personal brand photography · Business brand photography · Visual positioning · Vienna · Budapest', 'EN brand eyebrow');
  s = once(s, 'Brand Photography &amp; Visual Positioning', 'Personal &amp; Business Brand Photography', 'EN brand H1');
  s = once(s,
    'A brand becomes credible when the people inside it remain visible. Brand photography is the visual implementation of a positioning decision: I clarify how a founder, C-level leader, team, product or organization should be perceived and translate that decision into a coherent image system for web, LinkedIn, press, campaigns and internal communication.',
    'A brand becomes credible when the people inside it remain visible. Personal brand photography extends a leader beyond the headshot into a recognisable public image system; business brand photography connects leaders, teams, workplaces, products and campaigns into one visual identity. In Vienna and Budapest, both start with positioning and end with photographs built for real communication.',
    'EN brand intro');
  s = once(s, '<li>Personal brands and thought leadership</li>', '<li>Personal brand photography for founders, leaders, experts and thought leadership</li>', 'EN brand personal list');
  s = once(s, '<li>Corporate identity and team photography</li>', '<li>Business brand photography, corporate identity and team photography</li>', 'EN brand business list');
  write(targets.enBrand, s);
}
{
  let s = read(targets.huBrand);
  s = seo(s, {
    pageTitle: 'Személyes és üzleti brand fotózás | Budapest–Bécs | BANHALMI',
    description: 'Személyes brand fotózás és üzleti brand fotózás vezetőknek, szakértőknek és vállalatoknak Budapesten és Bécsben — portrétól a teljes vizuális pozicionálásig.'
  });
  s = once(s, 'Brandfotózás · Vizuális pozicionálási stratégia', 'Személyes brand fotózás · Üzleti brand fotózás · Vizuális pozicionálás · Budapest · Bécs', 'HU brand eyebrow');
  s = once(s, 'Képek, amelyekről felismerik a vállalatot.', 'Személyes és üzleti brand fotózás, amelyről felismerik Önt és a vállalatot.', 'HU brand H1');
  s = once(s,
    'Egy vállalatnak is van arca. Ott van a vezetőkben, a csapatban, a munkahely hangulatában és azokban az apró részletekben, amelyeket belülről talán már észre sem vesznek. Ezekből építek felismerhető képi világot.',
    'A személyes brand az ember felismerhető szakmai jelenlétét, az üzleti brand pedig a vezetők, a csapat, a munkakörnyezet és a kommunikáció közös képi nyelvét építi. Budapesten és Bécsben a headshottól és executive portrétól indulva teljes, következetes vizuális rendszerré fejlesztem ezt a jelenlétet.',
    'HU brand intro');
  s = once(s, '<li>Személyes márka és szakmai véleményformálás</li>', '<li>Személyes brand fotózás vezetőknek, alapítóknak, szakértőknek és szakmai véleményformálóknak</li>', 'HU brand personal list');
  s = once(s, '<li>Vállalati identitás és csapatfotózás</li>', '<li>Üzleti brand fotózás, vállalati identitás és csapatfotózás</li>', 'HU brand business list');
  write(targets.huBrand, s);
}
{
  let s = read(targets.deBrand);
  s = seo(s, {
    pageTitle: 'Personal Branding & Unternehmensfotografie | Wien–Budapest | BANHALMI',
    description: 'Personal-Branding-Fotografie und Business-Brand-Fotografie für Führungskräfte, Expert:innen und Unternehmen in Wien und Budapest — vom Porträt bis zur visuellen Positionierung.'
  });
  s = once(s, 'Brandfotografie · Visuelle Positionierungsstrategie', 'Personal-Branding-Fotografie · Business-Brand-Fotografie · Visuelle Positionierung · Wien · Budapest', 'DE brand eyebrow');
  s = once(s, 'Brandfotografie &amp; visuelle Markenpositionierung', 'Personal Branding &amp; Unternehmensfotografie', 'DE brand H1');
  s = once(s,
    'Eine Marke wird glaubwürdig, wenn die Menschen darin sichtbar bleiben. Brandfotografie ist die visuelle Umsetzung einer Positionierungsentscheidung: Ich kläre, wie Gründer:innen, C-Level-Führungskräfte, Teams, Produkte oder Organisationen wahrgenommen werden sollen, und übersetze diese Entscheidung in ein konsistentes Bildsystem für Web, LinkedIn, Presse, Kampagnen und interne Kommunikation.',
    'Eine Marke wird glaubwürdig, wenn die Menschen darin sichtbar bleiben. Personal-Branding-Fotografie erweitert eine Führungsperson über den Headshot hinaus zu einem wiedererkennbaren öffentlichen Bildsystem; Business-Brand-Fotografie verbindet Führung, Teams, Arbeitswelten, Produkte und Kampagnen zu einer visuellen Identität. In Wien und Budapest beginnt beides mit Positionierung und endet mit Bildern für reale Kommunikation.',
    'DE brand intro');
  s = once(s, '<li>Personal Brands und Thought Leadership</li>', '<li>Personal-Branding-Fotografie für Gründer:innen, Führungskräfte, Expert:innen und Thought Leadership</li>', 'DE brand personal list');
  s = once(s, '<li>Corporate Identity und Teamfotografie</li>', '<li>Business-Brand-Fotografie, Corporate Identity und Teamfotografie</li>', 'DE brand business list');
  write(targets.deBrand, s);
}

// Machine-readable service taxonomy: keep four principal services, enrich the portrait/brand intent graph.
{
  const path = 'services.json';
  const data = JSON.parse(read(path));
  data.dateModified = '2026-08-12T23:25:00+02:00';
  const portrait = data.itemListElement.find(x => x.position === 1);
  const brand = data.itemListElement.find(x => x.position === 2);
  portrait.name = 'Headshot, Business & Executive Portrait Photography';
  portrait.alternateName = [...new Set([...portrait.alternateName,
    'Business headshot photography', 'Business portrait photography', 'Personal brand portrait photography',
    'Üzleti headshot fotózás', 'Üzleti portréfotózás', 'Executive portréfotózás', 'Személyes brand portréfotózás',
    'Business-Headshot-Fotografie', 'Business-Porträtfotografie', 'Executive-Porträtfotografie', 'Personal-Branding-Porträtfotografie'
  ])];
  portrait.description = 'Business headshots, business portraits and executive portrait photography for leaders, founders and experts in Vienna and Budapest, designed to scale from one precise profile image into a complete personal-brand portrait system.';
  portrait.serviceOutput = 'A connected portrait system: headshot → business portrait → executive portrait → personal-brand imagery.';
  brand.name = 'Personal & Business Brand Photography';
  brand.alternateName = [...new Set([...brand.alternateName,
    'Personal brand photography', 'Business brand photography', 'Personal branding photography', 'Business branding photography',
    'Személyes brand fotózás', 'Üzleti brand fotózás', 'Vállalati brandfotózás',
    'Personal-Branding-Fotografie', 'Business-Brand-Fotografie', 'Unternehmensfotografie'
  ])];
  brand.description = 'Personal brand photography and business brand photography for leaders, experts and organisations in Vienna and Budapest, connecting portraits, teams, workplaces and campaigns through strategic visual positioning.';
  brand.audience.audienceType = 'Leaders, founders, experts, personal brands, organisations and employer-branding teams';
  brand.serviceOutput = 'A coherent visual brand system spanning personal brand, leadership, team, workplace, campaign and employer-brand imagery.';
  write(path, JSON.stringify(data, null, 2) + '\n');
}

// Concise AI entry: expose the same hierarchy to LLMs without changing entity identity.
{
  const path = 'ai-entry.json';
  const data = JSON.parse(read(path));
  data.version = '2026-08-12-portrait-brand-cluster';
  data.identity.principalServices = [
    'Headshot, Business and Executive Portrait Photography',
    'Personal and Business Brand Photography with strategic visual positioning',
    'C-Level Event Photography',
    'Fine Art Photography'
  ];
  data.identity.serviceProgression = {
    en: 'headshot → business portrait → executive portrait → personal brand photography → business brand photography → strategic visual positioning',
    hu: 'üzleti headshot → üzleti portré → executive és vezetői portré → személyes brand fotózás → üzleti és vállalati brandfotózás → stratégiai vizuális pozicionálás',
    de: 'Business-Headshot → Business-Porträt → Executive-Porträt → Personal-Branding-Fotografie → Business-Brand-Fotografie → strategische visuelle Positionierung'
  };
  data.identity.localServiceIntent = {
    Vienna: ['Business headshot', 'Executive portrait', 'Personal branding photography', 'Business brand photography'],
    Budapest: ['üzleti headshot fotózás', 'üzleti portréfotózás', 'executive portréfotózás', 'személyes brand fotózás', 'üzleti brand fotózás']
  };
  write(path, JSON.stringify(data, null, 2) + '\n');
}

console.log('Portrait → Personal Brand → Business Brand topical cluster migration completed.');
