import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const marker = 'data-clarity-disclosure="20260817"';
const cookieCopy = {
  en: 'This website uses technically necessary storage. Google Analytics, Microsoft Clarity and optional review services load only after your consent.',
  hu: 'A weboldal technikailag szükséges tárolást használ. A Google Analytics, a Microsoft Clarity és az opcionális értékelési szolgáltatások csak az Ön hozzájárulása után töltődnek be.',
  de: 'Diese Website verwendet technisch notwendige Speicherung. Google Analytics, Microsoft Clarity und optionale Bewertungsdienste werden erst nach Ihrer Einwilligung geladen.'
};

const disclosure = {
  en: `<section class="section-band" ${marker} data-surface="soft"><div class="wrap"><div class="legal prose"><h2>Microsoft Clarity and <span class="bn-heading-accent">UX analytics</span></h2><p>With your explicit analytics consent, BANHALMI uses Microsoft Clarity (Microsoft Corporation) to understand how visitors interact with the websites through aggregated usage metrics, heatmaps and session interaction diagnostics. Clarity project <strong>ky4j4kbgt7</strong> is used on norbertbanhalmi.com and project <strong>pll7h5wbpt</strong> on banhalmi.art. The service is not loaded before analytics consent. Advertising storage remains denied and BANHALMI does not use Clarity for advertising or remarketing.</p><p>Depending on the consented Clarity configuration, interaction and technical data can include page and session identifiers, device/browser information, approximate network/location information, clicks, scrolling and rendered page interactions. Content masking is used to reduce exposure of user-entered or sensitive content. The legal basis is Article 6(1)(a) GDPR together with applicable ePrivacy rules. Consent can be withdrawn at any time through Cookie settings; withdrawal sends a denied consent signal to Clarity and clears available first-party Clarity cookies.</p><p>Clarity may use first-party cookies such as <code>_clck</code> and <code>_clsk</code> after consent and may involve Microsoft domains and related technical identifiers as documented by Microsoft. Any international transfer is handled under the safeguards applicable to Microsoft's active contractual framework. This processing is covered by the same controller and privacy framework across norbertbanhalmi.com and banhalmi.art.</p></div></div></section>`,
  hu: `<section class="section-band" ${marker} data-surface="soft"><div class="wrap"><div class="legal prose"><h2>Microsoft Clarity és <span class="bn-heading-accent">UX-analitika</span></h2><p>Kifejezett analitikai hozzájárulása esetén a BANHALMI Microsoft Clarityt (Microsoft Corporation) használ annak megértésére, hogyan használják a látogatók a weboldalakat: összesített használati mutatók, hőtérképek és munkamenet-interakciós diagnosztika segítségével. A norbertbanhalmi.com Clarity-projektje <strong>ky4j4kbgt7</strong>, a banhalmi.art projektje <strong>pll7h5wbpt</strong>. A szolgáltatás analitikai hozzájárulás előtt nem töltődik be. A reklámcélú tárolás tiltott marad, a BANHALMI a Clarityt nem használja reklámra vagy remarketingre.</p><p>A hozzájárulással engedélyezett Clarity-beállítástól függően az interakciós és technikai adatok közé tartozhatnak oldal- és munkamenet-azonosítók, eszköz- és böngészőadatok, hozzávetőleges hálózati/helyadatok, kattintások, görgetés és a megjelenített oldal használati eseményei. Tartalommaszkolást alkalmazunk a felhasználó által bevitt vagy érzékeny tartalom kitettségének csökkentésére. A jogalap a GDPR 6. cikk (1) bekezdés a) pontja és az alkalmazandó ePrivacy-szabályok. A hozzájárulás a Süti-beállításokban bármikor visszavonható; a visszavonás megtagadott hozzájárulási jelet küld a Claritynek és törli az elérhető első féltől származó Clarity-cookie-kat.</p><p>A Clarity hozzájárulás után használhat első féltől származó <code>_clck</code> és <code>_clsk</code> cookie-kat, valamint a Microsoft dokumentációja szerinti Microsoft-domainhez kapcsolódó technikai azonosítókat. Az esetleges nemzetközi adattovábbítás a Microsoft mindenkor hatályos szerződéses keretéhez tartozó megfelelő garanciák alapján történik. Ugyanez az adatkezelői és adatvédelmi keret vonatkozik a norbertbanhalmi.com és a banhalmi.art webhelyre.</p></div></div></section>`,
  de: `<section class="section-band" ${marker} data-surface="soft"><div class="wrap"><div class="legal prose"><h2>Microsoft Clarity und <span class="bn-heading-accent">UX-Analyse</span></h2><p>Mit Ihrer ausdrücklichen Einwilligung in Analytics nutzt BANHALMI Microsoft Clarity (Microsoft Corporation), um anhand aggregierter Nutzungsdaten, Heatmaps und Sitzungs-Interaktionsdiagnostik zu verstehen, wie Besucher die Websites verwenden. Für norbertbanhalmi.com wird das Clarity-Projekt <strong>ky4j4kbgt7</strong>, für banhalmi.art das Projekt <strong>pll7h5wbpt</strong> verwendet. Der Dienst wird vor einer Analytics-Einwilligung nicht geladen. Werbespeicherung bleibt verweigert; BANHALMI verwendet Clarity nicht für Werbung oder Remarketing.</p><p>Abhängig von der eingewilligten Clarity-Konfiguration können Interaktions- und technische Daten Seiten- und Sitzungskennungen, Geräte- und Browserinformationen, ungefähre Netzwerk-/Standortinformationen, Klicks, Scrollvorgänge und Interaktionen mit der dargestellten Seite umfassen. Content Masking reduziert die Offenlegung eingegebener oder sensibler Inhalte. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO zusammen mit den anwendbaren ePrivacy-Regeln. Die Einwilligung kann jederzeit über die Cookie-Einstellungen widerrufen werden; beim Widerruf wird Clarity ein verweigertes Einwilligungssignal übermittelt und verfügbare First-Party-Clarity-Cookies werden gelöscht.</p><p>Nach Einwilligung kann Clarity First-Party-Cookies wie <code>_clck</code> und <code>_clsk</code> sowie technische Kennungen im Zusammenhang mit Microsoft-Domains gemäß Microsoft-Dokumentation verwenden. Etwaige internationale Übermittlungen erfolgen auf Grundlage der Schutzmechanismen des jeweils geltenden Microsoft-Vertragsrahmens. Für norbertbanhalmi.com und banhalmi.art gilt derselbe Verantwortliche und derselbe Datenschutzrahmen.</p></div></div></section>`
};

function langOf(html) {
  const m = html.match(/<html[^>]*lang=["']([^"']+)/i);
  const value = (m?.[1] || 'en').toLowerCase();
  return value.startsWith('hu') ? 'hu' : value.startsWith('de') ? 'de' : 'en';
}

function updateCookieBanner(html, lang) {
  return html.replace(/(<div\b[^>]*class=["'][^"']*\bcookie\b[^"']*["'][^>]*>\s*<p>)[\s\S]*?(<\/p>)/i, `$1${cookieCopy[lang]}$2`);
}

const legalTargets = new Set([
  'trust/index.html','hu/bizalom/index.html','de-at/vertrauen/index.html',
  'privacy-policy/index.html','hu/adatvedelem/index.html','de-at/datenschutz/index.html',
  'cookie-policy/index.html','hu/sutik/index.html','de-at/cookies/index.html'
]);

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (['.git','node_modules','_site','test-results','playwright-report'].includes(entry.name)) continue;
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
}
walk(root);

let changed = 0;
for (const full of files) {
  const rel = path.relative(root,full).replaceAll('\\','/');
  let html = fs.readFileSync(full,'utf8');
  const lang = langOf(html);
  let next = updateCookieBanner(html,lang);
  if (legalTargets.has(rel) && !next.includes(marker)) next = next.replace('</main>', `${disclosure[lang]}</main>`);
  if (next !== html) { fs.writeFileSync(full,next); changed++; }
}

const trustPath = path.join(root,'trust-center.json');
const trust = JSON.parse(fs.readFileSync(trustPath,'utf8'));
trust.dateModified = '2026-08-17';
trust.analytics = {
  consentRequired: true,
  consentCategory: 'analytics',
  advertisingStorage: 'denied',
  services: [
    {name:'Google Analytics 4', measurementId:'G-90C452LJKQ', purpose:'aggregated website analytics'},
    {name:'Microsoft Clarity', provider:'Microsoft Corporation', professionalProjectId:'ky4j4kbgt7', artArchiveProjectId:'pll7h5wbpt', purpose:'UX analytics, heatmaps and session interaction diagnostics', cookiesAfterConsent:['_clck','_clsk']}
  ],
  authoritativePrivacyNotice:'https://www.norbertbanhalmi.com/privacy-policy/',
  authoritativeCookiePolicy:'https://www.norbertbanhalmi.com/cookie-policy/'
};
if (!trust.principles.includes('consent-first analytics and UX diagnostics')) trust.principles.push('consent-first analytics and UX diagnostics');
fs.writeFileSync(trustPath, JSON.stringify(trust));

console.log(`Clarity consent/trust migration updated ${changed} HTML files and trust-center.json.`);
