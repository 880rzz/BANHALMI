import fs from 'node:fs';

const pages = {
  'index.html': {
    required: [
      ['Two roles. One visual language.', 'Visual Trust Strategy'],
      ['A strong portrait speaks before the meeting begins.', 'We build visual trust before the meeting begins.']
    ],
    optional: [
      ['A photograph can say a great deal about you. That you can be trusted. That you know where you are going. And that there are real people behind the company name. I create leadership portraits, brand photography and event images that tell the same story wherever they appear.', 'BANHALMI is a strategic visual partner for leaders and organisations. Executive portraiture, brand photography, C-level event imagery and fine-art authorship form one coherent visual system that builds trust wherever the images appear.']
    ]
  },
  'hu/index.html': {
    required: [
      ['Két szerep. Egy vizuális nyelv.', 'Vizuális bizalomstratégia'],
      ['A jó portré már az első találkozás előtt beszél.', 'Vizuális bizalmat építünk már az első találkozás előtt.']
    ],
    optional: [
      ['Egy kép sok mindent elmondhat Önről. Azt, hogy lehet Önben bízni. Azt, hogy tudja, merre tart. És azt is, hogy milyen emberek állnak a vállalat mögött. Vezetői portrékat, brandfotókat és rendezvényképeket készítek, amelyek együtt is ugyanazt a történetet mesélik.', 'A BANHALMI stratégiai vizuális partner vezetőknek és szervezeteknek. Az executive portré, a brandfotózás, a C-level eseményfotózás és a képzőművészeti szerzőség egyetlen koherens vizuális rendszerben épít bizalmat minden megjelenési felületen.']
    ]
  },
  'de-at/index.html': {
    required: [
      ['Zwei Rollen. Eine visuelle Sprache.', 'Strategie für visuelles Vertrauen'],
      ['Ein starkes Porträt spricht schon vor der ersten Begegnung.', 'Wir schaffen visuelles Vertrauen vor der ersten Begegnung.']
    ],
    optional: [
      ['Ein Bild kann viel über Sie erzählen. Dass man Ihnen vertrauen kann. Dass Sie wissen, wohin Sie wollen. Und dass hinter einem Unternehmen echte Menschen stehen. Ich fotografiere Führungskräfte, Marken und Veranstaltungen so, dass überall dieselbe Geschichte spürbar wird.', 'BANHALMI ist strategischer visueller Partner für Führungskräfte und Organisationen. Executive-Porträts, Markenfotografie, C-Level-Eventbilder und künstlerische Autorenschaft bilden ein kohärentes visuelles System, das an jedem Kontaktpunkt Vertrauen schafft.'],
      ['diplomatischen geschäftliche und diplomatische Situationen', 'diplomatische und geschäftliche Situationen']
    ]
  }
};

for (const [file, config] of Object.entries(pages)) {
  let html = fs.readFileSync(file, 'utf8');
  for (const [from, to] of [...config.required, ...config.optional]) html = html.replaceAll(from, to);
  for (const [, to] of config.required) {
    if (!html.includes(to)) throw new Error(`${file}: required visible target text missing after migration: ${to}`);
  }
  fs.writeFileSync(file, html);
}

console.log('Visible Visual Trust positioning applied to all localized homepages.');
