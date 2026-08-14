import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '_site');
const pages = ['index.html', 'hu/index.html', 'de-at/index.html'];
const scriptRe = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi;
const oldStyleToken = 'style.css?v=20260810-menu-polish-v65';
const previousStyleToken = 'style.css?v=20260813-apple-authority-v70';
const newStyleToken = 'style.css?v=20260813-stage75-first-principles';

const stage77 = {
  'index.html': {
    eyebrow: 'Executive portrait · Brand photography · C-level events · Fine art',
    location: 'Vienna · Budapest · Worldwide projects',
    h1: 'A portrait is not a picture. <span class="title-accent title-accent--block">It is positioning.</span>',
    lead: 'Before a meeting, a profile visit or a press appearance, your image has already said something.',
    support: 'BANHALMI builds that first impression deliberately — from one executive portrait to a coherent visual system for a leadership team or organisation.',
    principleEyebrow: 'The principle',
    principleH2: 'Make the person clear <span class="title-accent title-accent--block">before making the image impressive.</span>',
    principleP1: 'The work starts with one question: what must this image make clear about you?',
    principleP2: 'Light, direction and setting follow that answer. The result should feel precise, credible and recognisably yours.',
    bridgeEyebrow: 'Choose by need, not terminology',
    bridgeH2: 'Four ways to solve the visual problem.',
    bridgeP: 'Executive portraiture, brand photography, C-level event photography and fine art are different tools for one goal: a clear, credible visual presence.',
    bridgeCta: 'See the four starting points ↓',
    servicesEyebrow: 'Four starting points',
    servicesH2: 'Choose the result you need.',
    cards: [
      ['Executive Portraiture','For leaders, founders and experts who need a credible image across LinkedIn, press, websites and speaking profiles.','See portrait work ›'],
      ['Brand Photography','For organisations that need leadership, teams and campaigns to look like one coherent brand.','See brand photography ›'],
      ['C-Level Event Photography','Discreet documentation for leadership meetings, conferences and high-trust events.','See event coverage ›'],
      ['Fine Art Photography','Author-led personal work for people looking for something more individual than a conventional portrait.','Explore fine-art work ›']
    ]
  },
  'hu/index.html': {
    eyebrow: 'Vezetői portré · Brandfotózás · Vezetői események · Művészi fotográfia',
    location: 'Bécs · Budapest · Világszerte projektalapon',
    h1: 'A vezető portréja nem kép. <span class="title-accent title-accent--block">Pozíció.</span>',
    lead: 'Mire belép egy tárgyalásra, megnyitják a profilját vagy megjelenik a sajtóban, a képe már mondott valamit Önről.',
    support: 'A BANHALMI ezt az első benyomást építi tudatosan — egyetlen vezetői portrétól egy teljes vezetői vagy vállalati vizuális rendszerig.',
    principleEyebrow: 'Az alapelv',
    principleH2: 'Előbb legyen világos, ki Ön. <span class="title-accent title-accent--block">Utána legyen látványos a kép.</span>',
    principleP1: 'A munka egy kérdéssel indul: mit kell a képnek egyértelművé tennie Önről?',
    principleP2: 'A fény, az irányítás és a helyszín ezt szolgálja. Az eredmény legyen pontos, hiteles és felismerhetően az Öné.',
    bridgeEyebrow: 'Ne szolgáltatásnevet válasszon, hanem célt',
    bridgeH2: 'Négy út ugyanahhoz: tiszta vizuális jelenléthez.',
    bridgeP: 'Vezetői portré, brandfotózás, vezetői eseményfotózás és művészi fotográfia — négy külön eszköz egy hiteles, következetes jelenléthez.',
    bridgeCta: 'A négy kiindulópont megtekintése ↓',
    servicesEyebrow: 'Négy kiindulópont',
    servicesH2: 'Válassza ki az eredményt, amire szüksége van.',
    cards: [
      ['Portréfotózás','Vezetőknek, alapítóknak és szakértőknek, akiknek hiteles képre van szükségük LinkedInre, sajtóba, weboldalra vagy előadói profilhoz.','Portrémunkák megtekintése ›'],
      ['Brandfotózás','Szervezeteknek, amelyek azt szeretnék, hogy a vezetők, csapatok és kampányok egyetlen következetes márkaként jelenjenek meg.','Brandfotózás megtekintése ›'],
      ['Felsővezetői eseményfotózás','Diszkrét dokumentáció vezetői ülésekhez, konferenciákhoz és magas bizalmi szintű eseményekhez.','Eseményfotózás megtekintése ›'],
      ['Művészi fotográfia','Szerzői személyes munka azoknak, akik a hagyományos portrénál egyedibb képi világot keresnek.','Művészi munkák megtekintése ›']
    ]
  },
  'de-at/index.html': {
    eyebrow: 'Executive-Porträt · Brandfotografie · C-Level-Events · Fine Art',
    location: 'Wien · Budapest · Weltweite Projekte',
    h1: 'Ein Führungsporträt ist kein Bild. <span class="title-accent title-accent--block">Es ist Positionierung.</span>',
    lead: 'Bevor ein Gespräch beginnt, ein Profil geöffnet wird oder Sie in der Presse erscheinen, hat Ihr Bild bereits etwas über Sie gesagt.',
    support: 'BANHALMI gestaltet diesen ersten Eindruck bewusst — vom einzelnen Executive-Porträt bis zu einem konsistenten visuellen System für Führungsteams und Organisationen.',
    principleEyebrow: 'Das Prinzip',
    principleH2: 'Zuerst muss klar sein, wer Sie sind. <span class="title-accent title-accent--block">Dann darf das Bild beeindrucken.</span>',
    principleP1: 'Die Arbeit beginnt mit einer Frage: Was muss dieses Bild über Sie eindeutig vermitteln?',
    principleP2: 'Licht, Führung und Umgebung folgen dieser Antwort. Das Ergebnis soll präzise, glaubwürdig und unverwechselbar sein.',
    bridgeEyebrow: 'Nach Bedarf wählen, nicht nach Fachbegriff',
    bridgeH2: 'Vier Wege zu einer klaren visuellen Präsenz.',
    bridgeP: 'Executive-Porträts, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie sind vier Werkzeuge für dasselbe Ziel: eine glaubwürdige, konsistente Präsenz.',
    bridgeCta: 'Die vier Startpunkte ansehen ↓',
    servicesEyebrow: 'Vier Startpunkte',
    servicesH2: 'Wählen Sie das Ergebnis, das Sie brauchen.',
    cards: [
      ['Executive-Porträts','Für Führungskräfte, Gründer und Experten, die auf LinkedIn, in der Presse, auf Websites und Speaker-Profilen glaubwürdig auftreten müssen.','Porträtarbeiten ansehen ›'],
      ['Brandfotografie','Für Organisationen, deren Führung, Teams und Kampagnen wie eine konsistente Marke wirken sollen.','Brandfotografie ansehen ›'],
      ['C-Level-Eventfotografie','Diskrete Dokumentation für Führungstreffen, Konferenzen und Veranstaltungen mit hohem Vertrauensanspruch.','Eventreportagen ansehen ›'],
      ['Fine-Art-Fotografie','Autorengeführte persönliche Arbeit für Menschen, die mehr Individualität als ein klassisches Porträt suchen.','Fine-Art-Arbeiten ansehen ›']
    ]
  }
};

function anchorContract(html) {
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]).sort();
  const fragments = [...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map(match => match[1]).sort();
  return { ids, fragments };
}

function assertSameAnchorContract(before, after, rel) {
  const beforeJson = JSON.stringify(before);
  const afterJson = JSON.stringify(after);
  if (beforeJson !== afterJson) throw new Error(`${rel}: homepage redesign changed an existing id or internal #anchor contract.`);
}

function applyHomepageSurfaceRoles(html) {
  return html
    .replace(/<section class="section-band presence-thesis"/g, '<section class="section-band presence-thesis surface-dark" data-surface="dark"')
    .replace(/<section class="section-band client-decision-bridge"/g, '<section class="section-band client-decision-bridge surface-white" data-surface="white"')
    .replace(/<section id="services">/g, '<section id="services" class="surface-soft" data-surface="soft">')
    .replace(/<section class="trust-proof"/g, '<section class="trust-proof surface-dark" data-surface="dark"')
    .replace(/<section class="reviews-drawer-section"/g, '<section class="reviews-drawer-section surface-soft" data-surface="soft"')
    .replace(/<section class="next-step-selector"/g, '<section class="next-step-selector surface-white" data-surface="white"')
    .replace(/<section class="cta-band"/g, '<section class="cta-band surface-dark" data-surface="dark"');
}

function simplifyHomepageCopy(html, rel) {
  const copy = stage77[rel];
  if (!copy) throw new Error(`${rel}: Stage77 copy contract missing.`);
  if (html.includes('data-copy-simplified="stage77"')) return html;

  const heroRe = /(<section class="hero hero-copy-only[^>]*><div class="wrap">)([\s\S]*?)(<div class="hero-actions">[\s\S]*?<\/div>)(<\/div><\/section>)/;
  const hero = heroRe.exec(html);
  if (!hero) throw new Error(`${rel}: Stage77 hero-copy section missing.`);
  const heroBody = `<p class="eyebrow">${copy.eyebrow}</p><p class="hero-location-line">${copy.location}</p><h1>${copy.h1}</h1><p>${copy.lead}</p><p>${copy.support}</p>`;
  html = html.replace(heroRe, `${hero[1]}${heroBody}${hero[3]}${hero[4]}`);

  const presenceRe = /<section class="section-band presence-thesis surface-dark" data-surface="dark" id="presence">[\s\S]*?<\/section>/;
  const presence = presenceRe.exec(html);
  if (!presence) throw new Error(`${rel}: Stage77 presence section missing.`);
  const presenceLinks = (presence[0].match(/<div class="hero-actions presence-links">[\s\S]*?<\/div>/) || [''])[0];
  if (!presenceLinks) throw new Error(`${rel}: Stage77 presence links missing.`);
  const presenceHtml = `<section class="section-band presence-thesis surface-dark" data-surface="dark" id="presence"><div class="wrap"><div class="prose structural-prose"><p class="eyebrow">${copy.principleEyebrow}</p><h2>${copy.principleH2}</h2><p>${copy.principleP1}</p><p>${copy.principleP2}</p>${presenceLinks}</div></div></section>`;
  html = html.replace(presenceRe, presenceHtml);

  const bridgeRe = /<section class="section-band client-decision-bridge surface-white" data-surface="white" aria-labelledby="client-decision-title">[\s\S]*?<\/section>/;
  if (!bridgeRe.test(html)) throw new Error(`${rel}: Stage77 decision bridge missing.`);
  const bridgeHtml = `<section class="section-band client-decision-bridge surface-white" data-surface="white" aria-labelledby="client-decision-title"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">${copy.bridgeEyebrow}</span><h2 id="client-decision-title">${copy.bridgeH2}</h2></div><div class="prose reveal structural-prose"><p>${copy.bridgeP}</p><a class="btn-link" href="#services">${copy.bridgeCta}</a></div></div></section>`;
  html = html.replace(bridgeRe, bridgeHtml);

  const servicesRe = /<section id="services" class="surface-soft" data-surface="soft">[\s\S]*?<\/section>/;
  const services = servicesRe.exec(html);
  if (!services) throw new Error(`${rel}: Stage77 services section missing.`);
  let cardIndex = 0;
  const cardsHtml = services[0].replace(/(<a class="card reveal" href="[^"]+">)[\s\S]*?<\/a>/g, (match, opening) => {
    const card = copy.cards[cardIndex++];
    if (!card) throw new Error(`${rel}: Stage77 encountered more than four service cards.`);
    return `${opening}<h3>${card[0]}</h3><p>${card[1]}</p><span class="more">${card[2]}</span></a>`;
  });
  if (cardIndex !== 4) throw new Error(`${rel}: Stage77 expected four service cards, found ${cardIndex}.`);
  const servicesInnerRe = /<section id="services" class="surface-soft" data-surface="soft"><div class="wrap">[\s\S]*?<div class="cards reveal">/;
  if (!servicesInnerRe.test(cardsHtml)) throw new Error(`${rel}: Stage77 services wrapper contract changed.`);
  const rewrittenServices = cardsHtml.replace(servicesInnerRe, `<section id="services" class="surface-soft" data-surface="soft"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">${copy.servicesEyebrow}</span><h2>${copy.servicesH2}</h2></div><div class="cards reveal">`);
  html = html.replace(servicesRe, rewrittenServices);

  html = html.replace('data-homepage-redesign="stage76"', 'data-homepage-redesign="stage76" data-copy-simplified="stage77"');
  for (const required of [copy.lead, copy.bridgeH2, copy.servicesH2, ...copy.cards.map(card => card[0])]) {
    if (!html.includes(required)) throw new Error(`${rel}: Stage77 required visible copy missing: ${required}`);
  }
  return html;
}

function firstPrinciplesHomepage(html, rel) {
  if (html.includes('data-homepage-redesign="stage76"')) return html;
  const beforeAnchors = anchorContract(html);
  const decisionRe = /(<section class="fp-decision-system"[^>]*data-first-principles-path="stage68"[\s\S]*?<\/section>)/;
  const heroRe = /<section class="hero hero-image-first"><div class="wrap">(?<figure><figure class="hero-figure editorial-hero reveal">[\s\S]*?<\/figure>)(?<copy>[\s\S]*?)<\/div><\/section>/;
  const decision = decisionRe.exec(html);
  const hero = heroRe.exec(html);
  if (!decision || !hero) throw new Error(`${rel}: expected Stage68 decision block and canonical hero structure.`);
  if (decision.index > hero.index) throw new Error(`${rel}: unexpected source hierarchy; refusing ambiguous production rewrite.`);
  const gap = html.slice(decision.index + decision[0].length, hero.index);
  if (gap.trim()) throw new Error(`${rel}: unexpected content between decision layer and hero.`);

  const visual = `<section class="hero hero-image-first hero-visual-only" data-hero-position="header-first"><div class="wrap">${hero.groups.figure}</div></section>`;
  const copy = `<section class="hero hero-copy-only surface-white" data-hero-copy="stage76" data-surface="white"><div class="wrap">${hero.groups.copy}</div></section>`;
  const decisionBlock = decision[0].replace('<section class="fp-decision-system"', '<section class="fp-decision-system surface-soft" data-surface="soft"');
  let rewritten = html.slice(0, decision.index) + visual + copy + decisionBlock + html.slice(hero.index + hero[0].length);
  rewritten = applyHomepageSurfaceRoles(rewritten);
  rewritten = rewritten.replace('<main id="main">', '<main id="main" data-homepage-redesign="stage76">');
  rewritten = simplifyHomepageCopy(rewritten, rel);

  const mainPos = rewritten.indexOf('data-homepage-redesign="stage76"');
  const visualPos = rewritten.indexOf('data-hero-position="header-first"');
  const copyPos = rewritten.indexOf('data-hero-copy="stage76"');
  const decisionPos = rewritten.indexOf('data-first-principles-path="stage68"');
  if (!(mainPos >= 0 && visualPos > mainPos && copyPos > visualPos && decisionPos > copyPos)) {
    throw new Error(`${rel}: failed header -> hero visual -> hero statement -> decision contract.`);
  }
  if (!rewritten.includes('data-copy-simplified="stage77"')) throw new Error(`${rel}: Stage77 production copy marker missing.`);
  assertSameAnchorContract(beforeAnchors, anchorContract(rewritten), rel);
  return rewritten;
}

async function updateStyleTokens(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await updateStyleTokens(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const before = await readFile(full, 'utf8');
      if (!before.includes(oldStyleToken) && !before.includes(previousStyleToken)) continue;
      await writeFile(full, before.replaceAll(oldStyleToken, newStyleToken).replaceAll(previousStyleToken, newStyleToken), 'utf8');
    }
  }
}

await updateStyleTokens(root);

for (const rel of pages) {
  const file = path.join(root, rel);
  let html = await readFile(file, 'utf8');
  html = firstPrinciplesHomepage(html, rel);
  const headClose = html.indexOf('</head>');
  const bodyClose = html.lastIndexOf('</body>');
  if (headClose < 0 || bodyClose < 0 || bodyClose <= headClose) {
    throw new Error(`${rel}: malformed document; cannot harden critical path.`);
  }

  const head = html.slice(0, headClose);
  const scripts = [...head.matchAll(scriptRe)].map(match => match[0]);
  if (!scripts.length) throw new Error(`${rel}: no JSON-LD found in <head>; expected canonical schema graph.`);

  for (const script of scripts) {
    const json = script.replace(/^<script\b[^>]*>/i, '').replace(/<\/script>$/i, '');
    JSON.parse(json);
  }

  const headBeforeBytes = Buffer.byteLength(head, 'utf8');
  const cleanedHead = head.replace(scriptRe, '');
  const headAfterBytes = Buffer.byteLength(cleanedHead, 'utf8');
  const reduction = headBeforeBytes - headAfterBytes;
  if (reduction < 5000) {
    throw new Error(`${rel}: JSON-LD relocation reduced critical <head> by only ${reduction} bytes; expected >= 5000.`);
  }

  html = `${cleanedHead}${html.slice(headClose)}`;
  const insertion = `\n${scripts.join('\n')}\n`;
  const newBodyClose = html.lastIndexOf('</body>');
  html = `${html.slice(0, newBodyClose)}${insertion}${html.slice(newBodyClose)}`;

  const newHead = html.slice(0, html.indexOf('</head>'));
  if (scriptRe.test(newHead)) throw new Error(`${rel}: JSON-LD remains in critical <head> after relocation.`);
  scriptRe.lastIndex = 0;

  const totalScripts = [...html.matchAll(scriptRe)].length;
  if (totalScripts !== scripts.length) {
    throw new Error(`${rel}: schema count changed during relocation (${scripts.length} -> ${totalScripts}).`);
  }
  if (!html.includes(newStyleToken)) throw new Error(`${rel}: Stage75 shared stylesheet cache token missing.`);
  if (!html.includes('data-copy-simplified="stage77"')) throw new Error(`${rel}: Stage77 simplified production copy missing.`);

  await writeFile(file, html, 'utf8');
  console.log(`${rel}: first-principles hero hierarchy and Stage77 copy locked; anchor contract preserved; moved ${scripts.length} JSON-LD block(s); head reduced by ${reduction} bytes.`);
}

await import('./apply-service-design-stage77.mjs');
