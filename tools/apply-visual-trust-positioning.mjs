import fs from 'node:fs';

const replacements = {
  'index.html': [
    ['BANHALMI | Strategic Visual Partnership &amp; Executive Portraiture','BANHALMI | Visual Trust Strategy &amp; Executive Portraiture'],
    ['Leadership portraits, brand photography and event photography in Vienna and Budapest. A first impression shaped by human images that build trust and tell a genuine story.','Strategic visual partnership for leaders and organisations. Executive portraiture, brand photography and C-level event imagery designed as one coherent system that builds visual trust.'],
    ['BANHALMI | Executive Portraiture &amp; Visual Branding','BANHALMI | We Build Visual Trust'],
    ['Two roles. One visual language.','One visual system. Built for trust.']
  ],
  'hu/index.html': [
    ['BANHALMI | Stratégiai vizuális együttműködés és executive portré','BANHALMI | Vizuális bizalomstratégia és executive portré'],
    ['Vezetői portré, brandfotózás és eseményfotózás Bécsben és Budapesten. Az első benyomást emberi, bizalmat építő és történetet mesélő képek formálják.','Stratégiai vizuális partnerség vezetőknek és szervezeteknek. Executive portré, brandfotózás és C-level eseményfotózás egy koherens rendszerben, amely vizuális bizalmat épít.'],
    ['BANHALMI | Executive portréfotózás és vizuális brandstratégia','BANHALMI | Vizuális bizalmat építünk'],
    ['Két szerep. Egy vizuális nyelv.','Egy vizuális rendszer. Bizalomra építve.']
  ],
  'de-at/index.html': [
    ['BANHALMI | Strategische visuelle Partnerschaft &amp; Executive-Porträts','BANHALMI | Strategie für visuelles Vertrauen &amp; Executive-Porträts'],
    ['Executive-Porträts, Markenfotografie und Eventfotografie in Wien und Budapest. Der erste Eindruck wird durch menschliche Bilder geprägt, die Vertrauen schaffen und eine echte Geschichte erzählen.','Strategische visuelle Partnerschaft für Führungskräfte und Organisationen. Executive-Porträts, Markenfotografie und C-Level-Eventfotografie als kohärentes System, das visuelles Vertrauen aufbaut.'],
    ['BANHALMI | Executive-Porträts &amp; visuelle Markenpositionierung','BANHALMI | Wir schaffen visuelles Vertrauen'],
    ['Zwei Rollen. Eine visuelle Sprache.','Ein visuelles System. Für Vertrauen gebaut.']
  ]
};

for (const [file, pairs] of Object.entries(replacements)) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  let text = fs.readFileSync(file, 'utf8');
  for (const [from, to] of pairs) text = text.split(from).join(to);
  fs.writeFileSync(file, text);
}

const machineFiles = ['ai.txt','llms.txt','llms-full.txt','knowledge.json','entity.jsonld','entity-graph.json','services.json','partner-service-context.json'];
const oldEn = 'Leadership portraits, brand photography and event photography in Vienna and Budapest. A first impression shaped by human images that build trust and tell a genuine story.';
const newEn = 'BANHALMI is a strategic visual partner for leaders and organisations. Executive portraiture, brand photography, C-level event imagery and fine-art authorship form one coherent visual system whose business outcome is visual trust.';
for (const file of machineFiles) {
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, 'utf8');
  text = text.split(oldEn).join(newEn);
  text = text.split('Strategic Visual Partnership').join('Strategic Visual Partnership — building visual trust');
  text = text.split('strategic visual positioning').join('strategic visual positioning and visual trust');
  fs.writeFileSync(file, text);
}

const positioning = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://www.norbertbanhalmi.com/#visual-trust-partnership',
  name: 'BANHALMI Strategic Visual Partnership',
  alternateName: ['Visual Trust Strategy','Vizuális bizalomstratégia','Strategie für visuelles Vertrauen'],
  provider: {'@id':'https://www.norbertbanhalmi.com/#organization'},
  areaServed: ['Vienna','Budapest','Europe'],
  serviceType: ['Strategic visual positioning','Executive portraiture','Brand photography','C-level event photography','Fine-art-led visual authorship'],
  description: newEn,
  slogan: ['We do not create isolated photographs. We build visual trust.','Nem különálló fényképeket készítünk. Vizuális bizalmat építünk.','Wir erstellen keine isolierten Fotos. Wir schaffen visuelles Vertrauen.'],
  additionalProperty: [
    {'@type':'PropertyValue','name':'Primary outcome','value':'Visual trust'},
    {'@type':'PropertyValue','name':'Method','value':'One coherent visual system across leadership, brand, event and editorial touchpoints'},
    {'@type':'PropertyValue','name':'Distinctive capability','value':'Fine-art authorship combined with executive and organisational visual strategy'}
  ]
};
fs.writeFileSync('brand-positioning.jsonld', JSON.stringify(positioning, null, 2) + '\n');

console.log('Applied BANHALMI visual-trust positioning.');
