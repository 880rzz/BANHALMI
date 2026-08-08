import fs from 'node:fs';

function patchFile(file, patcher) {
  const before = fs.readFileSync(file, 'utf8');
  const after = patcher(before);
  if (after === before) console.log(`${file}: no textual change required`);
  else { fs.writeFileSync(file, after); console.log(`${file}: updated`); }
}
function appendBeforeMainEnd(text, marker, html) {
  if (text.includes(marker)) return text;
  if (!text.includes('</main>')) throw new Error(`Cannot insert ${marker}: </main> missing`);
  return text.replace('</main>', `${html}</main>`);
}

patchFile('assets/js/analytics.js', text => {
  let out = text;
  out = out.replace('functionality_storage: "granted",\n    security_storage: "granted",', 'functionality_storage: "denied",\n    personalization_storage: "denied",\n    security_storage: "granted",');
  out = out.replace('ad_personalization: "denied"\n    });', 'ad_personalization: "denied",\n      personalization_storage: "denied",\n      functionality_storage: "denied"\n    });');
  out = out.replace('ad_personalization: "denied"\n    });\n    clearAnalyticsCookies();', 'ad_personalization: "denied",\n      personalization_storage: "denied",\n      functionality_storage: "denied"\n    });\n    clearAnalyticsCookies();');
  return out;
});

const legalPatches = [
  ['impressum/index.html', [
    ['Supervisory authority: Magistrat der Stadt Wien.', 'Authority pursuant to § 5 ECG: Magistratisches Bezirksamt des I. Bezirkes.'],
    ['Profession: Berufsfotograf, awarded in Austria.', 'Regulated trade: Berufsfotograf (professional photographer).']
  ], '<section class="section-band" data-stage55-legal><div class="wrap"><h2>Media disclosure under § 25 Mediengesetz</h2><p><strong>Media owner:</strong> Bánhalmi Norbert e.U., owner Norbert Bánhalmi, Vienna, Austria.</p><p><strong>Basic editorial direction (Blattlinie):</strong> Information about BANHALMI professional photography services, visual strategy, artistic work and archive, exhibitions, books, education and company activities. The website is not aligned with a political party.</p><p>The competent authority for the registered photography trade under § 5 ECG is <strong>Magistratisches Bezirksamt des I. Bezirkes</strong>.</p></div></section>'],
  ['de-at/impressum/index.html', [
    ['Aufsichtsbehörde: Magistrat der Stadt Wien.', 'Behörde gemäß § 5 ECG: Magistratisches Bezirksamt des I. Bezirkes.'],
    ['Beruf: Berufsfotograf, in Österreich ausgezeichnet.', 'Reglementiertes Gewerbe: Berufsfotograf.'],
    ['Berufsbezeichnung: Berufsfotograf, in Österreich ausgezeichnet.', 'Reglementiertes Gewerbe: Berufsfotograf.']
  ], '<section class="section-band" data-stage55-legal><div class="wrap"><h2>Offenlegung gemäß § 25 Mediengesetz</h2><p><strong>Medieninhaber:</strong> Bánhalmi Norbert e.U., Inhaber Norbert Bánhalmi, Wien, Österreich.</p><p><strong>Blattlinie:</strong> Information über professionelle Fotografie- und Bildstrategie-Leistungen von BANHALMI, künstlerisches Werk und Archiv, Ausstellungen, Bücher, Bildung und Unternehmensaktivitäten. Die Website ist keiner politischen Partei zugeordnet.</p><p>Die zuständige Behörde für das angemeldete Fotografengewerbe gemäß § 5 ECG ist das <strong>Magistratische Bezirksamt des I. Bezirkes</strong>.</p></div></section>'],
  ['hu/impresszum/index.html', [
    ['Felügyeleti szerv: Magistrat der Stadt Wien.', 'Az § 5 ECG szerinti illetékes hatóság: Magistratisches Bezirksamt des I. Bezirkes.'],
    ['Szakmai megnevezés: Berufsfotograf, Ausztriában bejegyezve.', 'Szabályozott tevékenység: Berufsfotograf (hivatásos fotográfus).']
  ], '<section class="section-band" data-stage55-legal><div class="wrap"><h2>Médiatörvény szerinti közzététel (§ 25 Mediengesetz)</h2><p><strong>Médiatulajdonos:</strong> Bánhalmi Norbert e.U., tulajdonos Bánhalmi Norbert, Bécs, Ausztria.</p><p><strong>Alapvető szerkesztési irány (Blattlinie):</strong> tájékoztatás a BANHALMI professzionális fotográfiai és vizuális stratégiai szolgáltatásairól, művészeti életművéről és archívumáról, kiállításokról, könyvekről, oktatásról és vállalati tevékenységről. A weboldal nem kötődik politikai párthoz.</p><p>A bejelentett fotográfusi tevékenység § 5 ECG szerinti illetékes hatósága: <strong>Magistratisches Bezirksamt des I. Bezirkes</strong>.</p></div></section>']
];
for (const [file, replacements, section] of legalPatches) patchFile(file, text => {
  let out = text;
  for (const [from,to] of replacements) out = out.replace(from,to);
  return appendBeforeMainEnd(out, 'data-stage55-legal', section);
});

const cookieSections = {
  'cookie-policy/index.html': '<section class="section-band" data-stage55-cookie><div class="wrap"><h2>Consent standard for analytics</h2><p>Under § 165 Abs. 3 TKG 2021, non-essential storage or access on a user device requires prior informed consent. Google Analytics 4 is therefore not requested before analytics consent. The consent record is kept for up to 180 days and can be withdrawn at any time through the cookie settings. Advertising storage, ad-user-data, ad-personalisation, personalisation storage and Google Signals remain disabled.</p></div></section>',
  'de-at/cookies/index.html': '<section class="section-band" data-stage55-cookie><div class="wrap"><h2>Einwilligungsstandard für Analytics</h2><p>Nach § 165 Abs. 3 TKG 2021 erfordert nicht technisch notwendiges Speichern oder Auslesen am Endgerät eine vorherige informierte Einwilligung. Google Analytics 4 wird daher vor einer Analytics-Einwilligung nicht angefordert. Der Einwilligungsnachweis wird bis zu 180 Tage gespeichert und kann jederzeit über die Cookie-Einstellungen widerrufen werden. Werbespeicher, Ad-User-Data, Ad-Personalisierung, Personalisierungsspeicher und Google Signals bleiben deaktiviert.</p></div></section>',
  'hu/sutik/index.html': '<section class="section-band" data-stage55-cookie><div class="wrap"><h2>Hozzájárulási szabály az analitikához</h2><p>A § 165 Abs. 3 TKG 2021 alapján a technikailag nem szükséges, végberendezésen történő tárolás vagy hozzáférés előzetes, tájékozott hozzájárulást igényel. Ezért a Google Analytics 4 nem töltődik be analitikai hozzájárulás előtt. A hozzájárulás nyilvántartása legfeljebb 180 napig marad meg, és a sütibeállításokon keresztül bármikor visszavonható. A hirdetési tárhely, az ad-user-data, az ad-personalization, a personalization storage és a Google Signals kikapcsolva marad.</p></div></section>'
};
for (const [file, section] of Object.entries(cookieSections)) patchFile(file, text => appendBeforeMainEnd(text, 'data-stage55-cookie', section));

const trustSections = {
  'trust/index.html': '<section class="section-band" data-stage55-ai><div class="wrap"><div class="trust-note"><h2>EU AI Act transparency</h2><p>BANHALMI applies the transparency principle in Article 50 of Regulation (EU) 2024/1689. If synthetic or materially AI-manipulated image, audio or video content is published in a context in which it could be mistaken for authentic content, its artificial generation or manipulation is disclosed in an appropriate form. Public-interest informational text produced with AI assistance is subject to human editorial review and a responsible human publisher.</p><p>AI does not independently make decisions about publication, sensitive retouching, biometric categorisation or the selection of people. Client-confidential material is not intentionally submitted for public-model training.</p></div></div></section>',
  'de-at/vertrauen/index.html': '<section class="section-band" data-stage55-ai><div class="wrap"><div class="trust-note"><h2>Transparenz nach dem EU AI Act</h2><p>BANHALMI beachtet den Transparenzgrundsatz des Artikel 50 der Verordnung (EU) 2024/1689. Wenn synthetische oder wesentlich KI-manipulierte Bild-, Audio- oder Videoinhalte in einem Kontext veröffentlicht werden, in dem sie mit authentischen Inhalten verwechselt werden könnten, wird die künstliche Erzeugung oder Manipulation in geeigneter Form offengelegt. KI-unterstützte Informationstexte von öffentlichem Interesse unterliegen menschlicher redaktioneller Kontrolle und einem verantwortlichen menschlichen Herausgeber.</p><p>KI entscheidet nicht selbstständig über Veröffentlichung, sensible Retusche, biometrische Kategorisierung oder die Auswahl von Personen. Vertrauliches Kundenmaterial wird nicht absichtlich zum Training öffentlicher Modelle eingereicht.</p></div></div></section>',
  'hu/bizalom/index.html': '<section class="section-band" data-stage55-ai><div class="wrap"><div class="trust-note"><h2>Átláthatóság az EU AI Act alapján</h2><p>A BANHALMI alkalmazza az (EU) 2024/1689 rendelet 50. cikkének átláthatósági elvét. Ha szintetikus vagy érdemben AI-val módosított kép-, hang- vagy videótartalom olyan környezetben jelenik meg, ahol hiteles tartalommal összetéveszthető, a mesterséges előállítás vagy módosítás megfelelő módon jelölésre kerül. A közérdekű, AI-közreműködéssel készült tájékoztató szöveg emberi szerkesztői ellenőrzés és felelős emberi kiadó mellett jelenik meg.</p><p>Az AI nem dönt önállóan publikálásról, érzékeny retusról, biometrikus kategorizálásról vagy személyek kiválasztásáról. Bizalmas ügyfélanyagot szándékosan nem adunk át nyilvános modellek betanítására.</p></div></div></section>'
};
for (const [file, section] of Object.entries(trustSections)) patchFile(file, text => appendBeforeMainEnd(text, 'data-stage55-ai', section));

const trustIndex = JSON.parse(fs.readFileSync('trust-center.json','utf8'));
trustIndex.dateModified = '2026-08-08';
trustIndex.principles = Array.from(new Set([...(trustIndex.principles || []), 'EU AI Act Article 50 transparency for synthetic or materially AI-manipulated content', 'human editorial responsibility for AI-assisted public-interest information']));
fs.writeFileSync('trust-center.json', JSON.stringify(trustIndex) + '\n');

const processors = JSON.parse(fs.readFileSync('processors.json','utf8'));
processors.schemaVersion = '2026-08-08-v2';
processors.dateModified = '2026-08-08';
const ga = processors.providers.find(p => p.id === 'google-analytics-4');
if (!ga) throw new Error('processors.json: google-analytics-4 missing');
ga.controls = Array.from(new Set([...(ga.controls || []), 'analytics storage only after consent', 'personalization storage disabled']));
fs.writeFileSync('processors.json', JSON.stringify(processors, null, 2) + '\n');

const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
if (!pkg.scripts.audit.includes('audit-strict-trust-legal-stage55.mjs')) pkg.scripts.audit += ' && node tools/audit-strict-trust-legal-stage55.mjs';
pkg.scripts['audit:strict-trust-legal'] = 'node tools/audit-strict-trust-legal-stage55.mjs';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
