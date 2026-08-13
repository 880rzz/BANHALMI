import fs from 'node:fs';

const STYLE = `<style data-quote-simplified-style>
/* Quote flow simplification — keep pricing logic intact, reduce visible decision noise. */
@media (min-width: 900px){
  .smart-quote-layout{grid-template-columns:minmax(260px,.72fr) minmax(0,1.48fr);gap:clamp(30px,5vw,72px);align-items:start}
  .quote-intro{position:sticky;top:96px;align-self:start}
}
.quote-flow-line{margin-top:18px;font-size:.95rem;color:var(--muted,#5f6672);letter-spacing:.01em}
.quote-flow-line strong{color:inherit}
.quote-intro>h2{margin-bottom:10px}
.quote-intro>p:first-of-type{font-size:1.05rem;line-height:1.55}
.pricing-logic-card{margin-top:18px;border:1px solid rgba(16,34,63,.14);border-radius:16px;background:rgba(255,255,255,.62);overflow:hidden}
.pricing-logic-card>summary,.quote-deep-details>summary{cursor:pointer;list-style:none;font-weight:650;padding:16px 18px;min-height:52px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.pricing-logic-card>summary::-webkit-details-marker,.quote-deep-details>summary::-webkit-details-marker{display:none}
.pricing-logic-card>summary::after,.quote-deep-details>summary::after{content:'+';font-size:1.25rem;font-weight:400;line-height:1}
.pricing-logic-card[open]>summary::after,.quote-deep-details[open]>summary::after{content:'–'}
.pricing-logic-details{padding:0 18px 18px}
.machine-data-links{font-size:.86rem;opacity:.78}
.quote-deep-details{max-width:1180px;margin:34px auto 0;border-top:1px solid rgba(16,34,63,.14);border-bottom:1px solid rgba(16,34,63,.14)}
.quote-deep-details>summary{padding:18px clamp(20px,4vw,42px)}
.quote-deep-details>section{margin:0}
@media (max-width:899px){
  .quote-flow-line{font-size:.9rem}
  .quote-intro{margin-bottom:10px}
}
</style>`;

const configs = [
  {
    path: 'hu/ajanlatkeres/index.html',
    heroTitle: 'Válassza ki, mire van szüksége. Az árat azonnal látja.',
    heroBody: 'Négy rövid lépésben összeállíthatja a fotózást. Válasszon szolgáltatást, adja hozzá a szükséges opciókat, nézze meg a tájékoztató összeget, majd küldje el az ajánlatkérést.',
    flow: '<strong>1.</strong> Szolgáltatás → <strong>2.</strong> Opciók → <strong>3.</strong> Becsült ár → <strong>4.</strong> Ajánlatkérés',
    introTitle: 'Kezdje azzal, amit biztosan tud.',
    introBody: 'Válassza ki a fotózás típusát. A kalkulátor azonnal frissíti a becsült árat, miközben Ön halad a lehetőségeken. Ha valamiben bizonytalan, hagyja későbbre — a végleges ajánlat előtt egyeztetjük.',
    pricingSummary: 'Árképzés, ÁFA és számítási részletek',
    deepSummary: 'Szerződéses, licenc- és fizetési részletek'
  },
  {
    path: 'requestaquote/index.html',
    heroTitle: 'Choose what you need. See the price immediately.',
    heroBody: 'Build your photography project in four short steps. Choose the service, add the options you need, review the non-binding estimate, then send the request.',
    flow: '<strong>1.</strong> Service → <strong>2.</strong> Options → <strong>3.</strong> Estimate → <strong>4.</strong> Request',
    introTitle: 'Start with what you already know.',
    introBody: 'Choose the type of photography first. The calculator updates the estimate as you make selections. If you are unsure about a detail, leave it for later — we confirm the final scope before the written proposal.',
    pricingSummary: 'Pricing, VAT and calculation details',
    deepSummary: 'Contract, licensing and payment details'
  },
  {
    path: 'de-at/anfrage/index.html',
    heroTitle: 'Wählen Sie, was Sie brauchen. Den Preis sehen Sie sofort.',
    heroBody: 'Stellen Sie Ihr Fotoprojekt in vier kurzen Schritten zusammen. Leistung wählen, Optionen ergänzen, unverbindliche Schätzung prüfen und anschließend die Anfrage senden.',
    flow: '<strong>1.</strong> Leistung → <strong>2.</strong> Optionen → <strong>3.</strong> Schätzung → <strong>4.</strong> Anfrage',
    introTitle: 'Beginnen Sie mit dem, was bereits feststeht.',
    introBody: 'Wählen Sie zuerst die Art der Fotografie. Der Kalkulator aktualisiert die Schätzung sofort mit jeder Auswahl. Unsichere Details können offenbleiben — den endgültigen Umfang klären wir vor dem schriftlichen Angebot.',
    pricingSummary: 'Preisberechnung, USt. und Kalkulationsdetails',
    deepSummary: 'Vertrag, Nutzungsrechte und Zahlungsdetails'
  }
];

function replaceOnce(input, regex, replacement, label, path) {
  let count = 0;
  const output = input.replace(regex, (...args) => {
    count += 1;
    return typeof replacement === 'function' ? replacement(...args) : replacement;
  });
  if (count !== 1) throw new Error(`${path}: expected exactly one ${label} replacement, got ${count}`);
  return output;
}

for (const cfg of configs) {
  let html = fs.readFileSync(cfg.path, 'utf8');
  const before = html;

  if (!html.includes('data-quote-simplified-style')) {
    html = replaceOnce(html, /<\/head>/, `${STYLE}</head>`, 'style', cfg.path);
  }

  html = replaceOnce(
    html,
    /<section class="hero"><div class="wrap">\s*<h1>[\s\S]*?<\/h1>\s*<div class="prose reveal structural-prose"><p>[\s\S]*?<\/p><\/div><\/div><\/section>/,
    `<section class="hero quote-hero"><div class="wrap"><h1>${cfg.heroTitle}</h1><div class="prose reveal structural-prose"><p>${cfg.heroBody}</p><p class="quote-flow-line">${cfg.flow}</p></div></div></section>`,
    'hero',
    cfg.path
  );

  html = replaceOnce(
    html,
    /<div class="prose reveal quote-intro"><h2>[\s\S]*?<\/h2><p>[\s\S]*?<\/p><p>[\s\S]*?<\/p>/,
    `<div class="prose reveal quote-intro"><h2>${cfg.introTitle}</h2><p>${cfg.introBody}</p>`,
    'quote intro',
    cfg.path
  );

  html = replaceOnce(
    html,
    /<div class="pricing-logic-card" id="pricing-logic"><h3>([\s\S]*?)<\/h3>([\s\S]*?)<\/div><\/div>\s*<div class="form reveal">/,
    (_m, heading, body) => `<details class="pricing-logic-card" id="pricing-logic"><summary>${cfg.pricingSummary}</summary><div class="pricing-logic-details"><h3>${heading}</h3>${body}</div></details></div>\n<div class="form reveal">`,
    'pricing detail collapse',
    cfg.path
  );

  html = replaceOnce(
    html,
    /(<section class="section-band pricing-licensing-clarity"[\s\S]*?<section class="section-band payment-invoicing-clarity"[\s\S]*?<\/section>)(<\/main>)/,
    `<details class="quote-deep-details"><summary>${cfg.deepSummary}</summary>$1</details>$2`,
    'deep details collapse',
    cfg.path
  );

  if (html === before) throw new Error(`${cfg.path}: no changes produced`);

  const required = [
    'data-smart-quote',
    'data-quote-summary',
    'data-estimate-gross',
    'data-download-quote-pdf',
    'pricing-logic-card',
    'quote-deep-details',
    'category-grid',
    '/pricing.json',
    '/pricing-guide.json'
  ];
  for (const marker of required) {
    if (!html.includes(marker)) throw new Error(`${cfg.path}: missing required marker ${marker}`);
  }
  if (!html.includes('</form>') || !html.includes('</main>')) throw new Error(`${cfg.path}: structural closing tag missing`);

  fs.writeFileSync(cfg.path, html);
  console.log(`Simplified ${cfg.path}`);
}

console.log('Quote flow simplification completed for HU/EN/DE without changing pricing data or calculator logic.');
