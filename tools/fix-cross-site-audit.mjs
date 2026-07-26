import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'test-results' || entry.name === 'playwright-report') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:html|json|jsonld|xml|js)$/i.test(entry.name)) files.push(full);
  }
}

function languageFor(rel) {
  if (rel.startsWith('hu/')) return { og: 'hu_HU', alternates: ['en_US', 'de_AT'] };
  if (rel.startsWith('de-at/')) return { og: 'de_AT', alternates: ['en_US', 'hu_HU'] };
  return { og: 'en_US', alternates: ['de_AT', 'hu_HU'] };
}

function metaValue(html, key, attr = 'property') {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<meta\\b[^>]*${attr}=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i'))?.[1]
    || html.match(new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${escaped}["'][^>]*>`, 'i'))?.[1]
    || '';
}

function escapeAttr(value = '') {
  return value.replace(/&(?!(?:amp|quot|#39|lt|gt);)/g, '&amp;').replace(/"/g, '&quot;');
}

function replaceOrInsert(html, re, tag) {
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function normalizeSocial(html, rel) {
  const lang = languageFor(rel);
  html = html.replace(/<meta\b[^>]*property=["']og:locale(?::alternate)?["'][^>]*>\s*/gi, '');
  const localeTags = [
    `<meta property="og:locale" content="${lang.og}">`,
    ...lang.alternates.map((value) => `<meta property="og:locale:alternate" content="${value}">`),
  ].join('\n');
  const anchor = html.match(/<meta\b[^>]*property=["']og:url["'][^>]*>/i)?.[0]
    || html.match(/<meta\b[^>]*property=["']og:type["'][^>]*>/i)?.[0];
  if (anchor) html = html.replace(anchor, `${anchor}\n${localeTags}`);
  else html = html.replace('</head>', `${localeTags}\n</head>`);

  const title = metaValue(html, 'og:title') || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
  const description = metaValue(html, 'og:description') || metaValue(html, 'description', 'name');
  const image = metaValue(html, 'og:image');
  const imageAlt = metaValue(html, 'og:image:alt') || title;

  if (!metaValue(html, 'og:site_name')) html = replaceOrInsert(html, /<meta\b[^>]*property=["']og:site_name["'][^>]*>/i, '<meta property="og:site_name" content="BANHALMI">');
  if (image && !metaValue(html, 'og:image:alt')) html = replaceOrInsert(html, /<meta\b[^>]*property=["']og:image:alt["'][^>]*>/i, `<meta property="og:image:alt" content="${escapeAttr(imageAlt)}">`);
  if (image && !metaValue(html, 'og:image:width')) html = replaceOrInsert(html, /<meta\b[^>]*property=["']og:image:width["'][^>]*>/i, '<meta property="og:image:width" content="1200">');
  if (image && !metaValue(html, 'og:image:height')) html = replaceOrInsert(html, /<meta\b[^>]*property=["']og:image:height["'][^>]*>/i, '<meta property="og:image:height" content="630">');
  html = replaceOrInsert(html, /<meta\b[^>]*name=["']twitter:card["'][^>]*>/i, '<meta name="twitter:card" content="summary_large_image">');
  if (title) html = replaceOrInsert(html, /<meta\b[^>]*name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(title)}">`);
  if (description) html = replaceOrInsert(html, /<meta\b[^>]*name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(description)}">`);
  if (image) html = replaceOrInsert(html, /<meta\b[^>]*name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${escapeAttr(image)}">`);
  if (imageAlt) html = replaceOrInsert(html, /<meta\b[^>]*name=["']twitter:image:alt["'][^>]*>/i, `<meta name="twitter:image:alt" content="${escapeAttr(imageAlt)}">`);
  return html;
}

const privacyBlocks = {
  'privacy-policy/index.html': `<section class="section section--narrow" data-cross-site-privacy="true"><div class="container"><h2>BANHALMI ART and cross-domain measurement</h2><p>This privacy notice also covers <a href="https://www.banhalmi.art/">banhalmi.art</a>, the official artistic archive operated by the same controller. Both sites use the GA4 property <strong>G-90C452LJKQ</strong>. Analytics loads only after explicit consent. Cross-domain linking may preserve an anonymous visit path between banhalmi.art and norbertbanhalmi.com; advertising storage, Google Signals and ad-personalisation remain disabled.</p><p>Consent is stored locally for a maximum of 180 days and can be withdrawn at any time through the cookie settings. Withdrawing consent disables analytics storage and removes available Google Analytics cookies.</p></div></section>`,
  'hu/adatvedelem/index.html': `<section class="section section--narrow" data-cross-site-privacy="true"><div class="container"><h2>BANHALMI ART és domainek közötti mérés</h2><p>Ez az adatvédelmi tájékoztató a <a href="https://www.banhalmi.art/">banhalmi.art</a> hivatalos művészeti archívumra is kiterjed, amelyet ugyanaz az adatkezelő működtet. Mindkét oldal a <strong>G-90C452LJKQ</strong> GA4-tulajdont használja. Az analitika kizárólag kifejezett hozzájárulás után töltődik be. A domainek közötti összekapcsolás névtelenül megőrizheti a banhalmi.art és a norbertbanhalmi.com közötti látogatási útvonalat; a hirdetési adattárolás, a Google Signals és a személyre szabott hirdetések tiltva maradnak.</p><p>A hozzájárulást legfeljebb 180 napig tároljuk helyben, és a sütibeállításokban bármikor visszavonható. A visszavonás letiltja az analitikai adattárolást és törli az elérhető Google Analytics sütiket.</p></div></section>`,
  'de-at/datenschutz/index.html': `<section class="section section--narrow" data-cross-site-privacy="true"><div class="container"><h2>BANHALMI ART und domainübergreifende Messung</h2><p>Diese Datenschutzerklärung gilt auch für <a href="https://www.banhalmi.art/">banhalmi.art</a>, das offizielle Kunstarchiv desselben Verantwortlichen. Beide Websites verwenden die GA4-Property <strong>G-90C452LJKQ</strong>. Analytics wird ausschließlich nach ausdrücklicher Einwilligung geladen. Eine domainübergreifende Verknüpfung kann den anonymen Besuchsweg zwischen banhalmi.art und norbertbanhalmi.com erhalten; Werbespeicher, Google Signals und personalisierte Werbung bleiben deaktiviert.</p><p>Die Einwilligung wird höchstens 180 Tage lokal gespeichert und kann über die Cookie-Einstellungen jederzeit widerrufen werden. Der Widerruf deaktiviert den Analytics-Speicher und entfernt vorhandene Google-Analytics-Cookies.</p></div></section>`,
};

await walk(root);
const changed = [];
for (const file of files) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  const original = await readFile(file, 'utf8');
  let content = original;

  if (/\.(?:html|json|jsonld|xml)$/i.test(rel) && /Szösszenetek|Snippets|szosszenetek/i.test(content + rel)) {
    content = content.replace(/2310005245015|9786155596766|978-615-5596-76-6|9786150000534|978-615-00-0053-4/g, '9786150000534');
  }

  content = content
    .replace(/twenty documented exhibitions and long-term projects/gi, 'nineteen completed exhibitions and one project in development')
    .replace(/20 documented exhibitions and long-term projects/gi, '19 completed exhibitions and 1 project in development')
    .replace(/húsz dokumentált kiállítás(?: és hosszú távú projekt)?/gi, 'tizenkilenc megvalósult kiállítás és egy fejlesztés alatt álló projekt')
    .replace(/zwanzig dokumentierte Ausstellungen(?: und langfristige Projekte)?/gi, 'neunzehn realisierte Ausstellungen und ein Projekt in Entwicklung')
    .replace(/twenty[- ]five years/gi, 'since 1999')
    .replace(/25 years/gi, 'since 1999')
    .replace(/1999 óta épülő/gi, '1999 óta')
    .replace(/25 éve/gi, '1999 óta')
    .replace(/seit 25 Jahren/gi, 'seit 1999');

  if (rel.endsWith('.html') && !/http-equiv=["']refresh["']/i.test(content)) content = normalizeSocial(content, rel);

  const privacyBlock = privacyBlocks[rel];
  if (privacyBlock && !content.includes('data-cross-site-privacy="true"')) {
    content = content.includes('</main>') ? content.replace('</main>', `${privacyBlock}\n</main>`) : content.replace('</body>', `${privacyBlock}\n</body>`);
  }

  if (content !== original) {
    await writeFile(file, content, 'utf8');
    changed.push(rel);
  }
}
console.log(JSON.stringify({ changed, total: changed.length }, null, 2));
