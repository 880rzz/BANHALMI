import fs from 'node:fs';

const quotePages = {
  'requestaquote/index.html': {
    lang: 'en',
    noteTitle: 'Artists & Performers',
    noteBody: 'Actor headshots, acting portfolios, dance photography, performing-artist portfolios and model/editorial portfolios are handled within the Fine Art / Artists & Performers route. The calculator remains a non-binding orientation estimate; the final proposal is matched to casting, portfolio, movement and production needs.',
    replacements: [
      ['Photography Quote | Portrait, Brand, Event &amp; Fine Art', 'Photography Quote | Portrait, Brand, Event, Artists &amp; Fine Art'],
      ['portrait, brand, executive-event or fine-art photography', 'portrait, brand, executive-event, artist-portfolio or fine-art photography'],
      ['Fine art and intimate portrait photography', 'Fine art, artists, performers and intimate portrait photography'],
      ['Fine Art &amp; Intimate Portrait', 'Fine Art / Artists &amp; Performers'],
      ['Fine Art / Intimate Portrait', 'Fine Art / Artists &amp; Performers']
    ]
  },
  'hu/ajanlatkeres/index.html': {
    lang: 'hu',
    noteTitle: 'Művészek és előadóművészek',
    noteBody: 'A színész headshot, színészportfólió, táncfotózás, előadóművész-portfólió és modell/editorial portfólió a Művészi fotózás / Művészek és előadók útvonalon kérhető. A kalkulátor előzetes, nem kötelező érvényű tájékoztató becslést ad; a végleges ajánlat a casting-, portfólió-, mozgás- és produkciós igényekhez igazodik.',
    replacements: [
      ['Fotós ajánlatkérés | Portré, brand, rendezvény és művészet', 'Fotós ajánlatkérés | Portré, brand, rendezvény, előadóművész és művészet'],
      ['portré-, brand-, vezetői rendezvény- vagy művészi fotózásra', 'portré-, brand-, vezetői rendezvény-, színész-, táncos-, előadóművész- vagy művészi fotózásra'],
      ['Művészi és intim portréfotózás', 'Művészi portré, művészek, előadók és intim portréfotózás'],
      ['Művészi / intim portré', 'Művészi fotózás / Művészek és előadók'],
      ['Művészi és intim portré', 'Művészi fotózás / Művészek és előadók']
    ]
  },
  'de-at/anfrage/index.html': {
    lang: 'de',
    noteTitle: 'Künstler:innen & Performer:innen',
    noteBody: 'Schauspiel-Headshots, Schauspielportfolios, Tanzfotografie, Performing-Artist-Portfolios sowie Model- und Editorial-Portfolios werden über Fine Art / Künstler:innen & Performer:innen angefragt. Der Rechner liefert eine unverbindliche Orientierung; das endgültige Angebot wird auf Casting-, Portfolio-, Bewegungs- und Produktionsanforderungen abgestimmt.',
    replacements: [
      ['Fine-Art- und intime Porträtfotografie', 'Fine-Art-, Künstler:innen-, Performer:innen- und intime Porträtfotografie'],
      ['Fine Art &amp; intimes Porträt', 'Fine Art / Künstler:innen &amp; Performer:innen'],
      ['Fine Art / intimes Porträt', 'Fine Art / Künstler:innen &amp; Performer:innen'],
      ['Fine-Art / Intimes Porträt', 'Fine Art / Künstler:innen &amp; Performer:innen']
    ]
  }
};

const faqPages = {
  'faq/index.html': {
    heading: 'Artists & Performers',
    items: [
      ['Do you photograph actors, dancers and performing artists?', 'Yes. BANHALMI creates actor headshots and acting portfolios, dance and movement photography, performing-artist portfolios, model/editorial portfolios and character-led artistic portraits in Vienna and Budapest.'],
      ['What should an actor portfolio or casting headshot communicate?', 'The priority is recognisability, character and casting relevance. We plan neutral, direct headshots alongside selected character or editorial portraits so the portfolio shows range without disguising the person.'],
      ['How is dance photography different from a standard portrait session?', 'Dance photography is planned around movement, line, timing and physical control. More time is usually recommended for warm-up, repeated movement, full-body frames, wardrobe changes and a separate portrait/editorial set.'],
      ['Can professional hair, make-up and styling be arranged?', 'Yes. Hair, make-up and styling can be added through trusted production partners. They are quoted separately because the exact cost depends on the creative direction, preparation time and the selected professional.'],
      ['Can an artistic or performing-artist session be bought as a gift?', 'Yes. A session can be arranged as a birthday, graduation or career-start gift. The creative direction is then finalised directly with the person being photographed so the result remains personal and professionally useful.'],
      ['Which quote option should an actor, dancer or model choose?', 'Choose Fine Art / Artists & Performers in the quote system. The preliminary estimate uses the artistic-production route; the final written proposal is then adjusted to the required headshots, portfolio variety, movement, styling, retouching and production scope.']
    ]
  },
  'hu/gyik/index.html': {
    heading: 'Művészek és előadóművészek',
    items: [
      ['Fotózol színészeket, táncosokat és előadóművészeket is?', 'Igen. A BANHALMI színész headshotokat és portfóliókat, tánc- és mozgásfotókat, előadóművész-portfóliókat, modell/editorial sorozatokat és karakterközpontú művészi portrékat is készít Bécsben és Budapesten.'],
      ['Mit kell megmutatnia egy jó színészportfóliónak vagy casting headshotnak?', 'Elsősorban felismerhetőséget, karaktert és casting szempontból használható jelenlétet. A letisztult, közvetlen headshotok mellé célzott karakter- vagy editorial portrék kerülhetnek, hogy a portfólió megmutassa a szakmai tartományt anélkül, hogy elrejtené az embert.'],
      ['Miben más a táncfotózás egy hagyományos portréfotózáshoz képest?', 'A táncfotózásnál a mozdulat, a vonalvezetés, az időzítés és a testtudat is része a képnek. Általában több időt érdemes hagyni bemelegítésre, a mozdulatok ismétlésére, egész alakos képekre, ruhacserére és egy külön portré/editorial sorozatra.'],
      ['Tudtok profi sminkest, fodrászt vagy stylistot biztosítani?', 'Igen. Megbízható produkciós partnerekkel smink, haj és styling is kérhető. Ezek külön tételként kerülnek az ajánlatba, mert a pontos költséget a kreatív koncepció, az előkészítési idő és a választott szakember határozza meg.'],
      ['Ajándékba is megvásárolható művészi vagy előadóművész fotózás?', 'Igen. A fotózás lehet születésnapi, ballagási, diploma- vagy pályakezdési ajándék is. A végleges kreatív koncepciót ilyenkor a fotózott személlyel közösen pontosítjuk, hogy a sorozat személyes és szakmailag használható legyen.'],
      ['Mit válasszon az ajánlatadóban egy színész, táncos vagy modell?', 'A Művészi fotózás / Művészek és előadók lehetőséget. Az előzetes becslés a művészi produkciós útvonal alapján készül, a végleges írásos ajánlatot pedig a szükséges headshotok, portfólió-változatosság, mozgás, styling, retusálás és produkciós igény alapján pontosítjuk.']
    ]
  },
  'de-at/faq/index.html': {
    heading: 'Künstler:innen & Performer:innen',
    items: [
      ['Fotografieren Sie auch Schauspieler:innen, Tänzer:innen und andere Performer:innen?', 'Ja. BANHALMI erstellt Schauspiel-Headshots und Schauspielportfolios, Tanz- und Bewegungsfotografie, Performing-Artist-Portfolios, Model-/Editorial-Portfolios sowie charakterorientierte künstlerische Porträts in Wien und Budapest.'],
      ['Was sollte ein gutes Schauspielportfolio oder Casting-Headshot vermitteln?', 'Im Vordergrund stehen Wiedererkennbarkeit, Charakter und Casting-Relevanz. Klare, direkte Headshots können durch gezielte Charakter- oder Editorial-Porträts ergänzt werden, damit das Portfolio Bandbreite zeigt, ohne die Person zu verkleiden.'],
      ['Worin unterscheidet sich Tanzfotografie von einer klassischen Porträtsession?', 'Bei Tanzfotografie gehören Bewegung, Linienführung, Timing und Körperkontrolle zum Bild. In der Regel sollte mehr Zeit für Aufwärmen, Wiederholungen, Ganzkörperaufnahmen, Outfitwechsel und eine separate Porträt-/Editorial-Serie eingeplant werden.'],
      ['Können professionelles Make-up, Haare und Styling organisiert werden?', 'Ja. Make-up, Hair und Styling können über bewährte Produktionspartner ergänzt werden. Diese Leistungen werden separat angeboten, da die Kosten von Kreativkonzept, Vorbereitungszeit und gewählter Fachperson abhängen.'],
      ['Kann eine künstlerische oder Performing-Artist-Session als Geschenk gebucht werden?', 'Ja. Eine Session kann zum Geburtstag, Abschluss oder Karrierestart verschenkt werden. Die endgültige kreative Ausrichtung wird anschließend direkt mit der fotografierten Person abgestimmt, damit die Serie persönlich und professionell nutzbar bleibt.'],
      ['Welche Option sollen Schauspieler:innen, Tänzer:innen oder Models im Angebotsrechner wählen?', 'Wählen Sie Fine Art / Künstler:innen & Performer:innen. Die vorläufige Kalkulation nutzt den künstlerischen Produktionspfad; das endgültige schriftliche Angebot wird anschließend an Headshots, Portfolio-Varianten, Bewegung, Styling, Retusche und Produktionsumfang angepasst.']
    ]
  }
};

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function updateFaqSchema(html, items) {
  const re = /<script([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;
  let found = false;
  html = html.replace(re, (whole, attrs, jsonText) => {
    let data;
    try { data = JSON.parse(jsonText); } catch { return whole; }
    const candidates = [];
    if (data && data['@type'] === 'FAQPage') candidates.push(data);
    if (Array.isArray(data?.['@graph'])) {
      for (const node of data['@graph']) if (node && node['@type'] === 'FAQPage') candidates.push(node);
    }
    if (!candidates.length) return whole;
    found = true;
    const faq = candidates[0];
    if (!Array.isArray(faq.mainEntity)) faq.mainEntity = [];
    for (const [q, a] of items) {
      if (faq.mainEntity.some(x => x?.name === q)) continue;
      faq.mainEntity.push({
        '@type': 'Question',
        name: q,
        acceptedAnswer: {'@type': 'Answer', text: a}
      });
    }
    return `<script${attrs}>${JSON.stringify(data)}</script>`;
  });
  if (!found) {
    const node = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(([q,a]) => ({'@type':'Question', name:q, acceptedAnswer:{'@type':'Answer', text:a}}))
    };
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(node)}</script></head>`);
  }
  return html;
}

function patchFaq(path, spec) {
  let html = fs.readFileSync(path, 'utf8');
  if (!html.includes('id="artists-performers-faq"')) {
    const details = spec.items.map(([q,a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join('\n');
    const section = `\n<section class="section" id="artists-performers-faq" aria-labelledby="artists-performers-heading"><div class="container"><div class="section-head"><h2 id="artists-performers-heading">${escapeHtml(spec.heading)}</h2></div><div class="faq-list">${details}</div></div></section>\n`;
    if (!html.includes('</main>')) throw new Error(`${path}: missing </main>`);
    html = html.replace('</main>', `${section}</main>`);
  }
  html = updateFaqSchema(html, spec.items);
  fs.writeFileSync(path, html);
}

function patchQuote(path, spec) {
  let html = fs.readFileSync(path, 'utf8');
  for (const [from,to] of spec.replacements) html = html.split(from).join(to);
  html = html.replace(/value=(['"])art\1(?![^>]*data-audience)/g, `value=$1art$1 data-audience="artists-performers"`);
  if (!html.includes('data-artists-performers-quote-note')) {
    const note = `\n<section class="section" data-artists-performers-quote-note><div class="container"><div class="quote-context-card"><h2>${escapeHtml(spec.noteTitle)}</h2><p>${escapeHtml(spec.noteBody)}</p></div></div></section>\n`;
    if (!html.includes('</main>')) throw new Error(`${path}: missing </main>`);
    html = html.replace('</main>', `${note}</main>`);
  }
  fs.writeFileSync(path, html);
}

function patchPricing(path) {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const fine = Array.isArray(data.services) ? data.services.find(s => s.id === 'fine-art') : null;
  if (!fine) throw new Error(`${path}: fine-art service not found`);
  fine.scope = Array.from(new Set([...(fine.scope || []),
    'actor headshots',
    'acting portfolio photography',
    'dance photography',
    'movement photography',
    'performing artist portfolio photography',
    'model portfolio photography',
    'editorial portrait photography',
    'creative professional portraits'
  ]));
  fine.audiences = {
    ...(fine.audiences || {}),
    en: ['actors','acting students','dancers','performers','models','creative professionals'],
    hu: ['színészek','színészhallgatók','táncosok','előadóművészek','modellek','kreatív szakemberek'],
    'de-AT': ['Schauspieler:innen','Schauspielstudierende','Tänzer:innen','Performer:innen','Models','Kreativschaffende']
  };
  fine.quoteRouting = {
    serviceValue: 'art',
    interfaceLabel: {
      en: 'Fine Art / Artists & Performers',
      hu: 'Művészi fotózás / Művészek és előadók',
      'de-AT': 'Fine Art / Künstler:innen & Performer:innen'
    },
    note: 'Actor, dance, performer and model/editorial portfolio requests use the existing artistic-production calculation route so the submission backend and delivery contract remain unchanged.'
  };
  const know = data.publisher?.knowsAbout;
  if (Array.isArray(know)) {
    for (const term of ['actor headshot photography','acting portfolio photography','dance photography','performing artist photography','model portfolio photography','editorial portrait photography']) {
      if (!know.includes(term)) know.push(term);
    }
  }
  data.schemaVersion = String(data.schemaVersion || '2026-08-31') + (String(data.schemaVersion || '').includes('artists-performers') ? '' : '-artists-performers');
  data.dateModified = '2026-08-31T23:25:00+02:00';
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

for (const [path,spec] of Object.entries(faqPages)) patchFaq(path,spec);
for (const [path,spec] of Object.entries(quotePages)) patchQuote(path,spec);
patchPricing('pricing.json');
patchPricing('pricing-huf.json');

console.log('Artists & Performers expansion applied to FAQ, quote pages and pricing data.');
