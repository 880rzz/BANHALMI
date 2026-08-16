import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '_site');
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

walk(root);

const stylesheetRe = /<link rel="stylesheet" href="(\/assets\/css\/site\.css[^\"]*)"\s*\/>/g;
const mainScriptRe = /<script defer="" src="\/assets\/js\/main\.js\?v=20260808-mobile100-v2"><\/script>/g;
const quotePdfScriptRe = /<script([^>]*?)src="(\/assets\/js\/quote-pdf\.js[^\"]*)"([^>]*)><\/script>/g;

const asyncStyle = '<link rel="preload" as="style" href="$1"/><link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\';this.onload=null"/><noscript><link rel="stylesheet" href="$1"/></noscript>';

// The mega-menu runtime stays as a normal deferred script: it is small after
// minification and must be ready for the user's very first menu interaction.
// The heavier general runtime is not required for first paint/navigation. Loading
// it from requestIdleCallback made Chromium execute it almost immediately during
// Lighthouse's idle window and reflow the homepage inside the TBT measurement.
// Keep interaction as the fast path, but use a deterministic post-paint fallback
// instead of an eager idle callback.
const homeRuntimeLoader = `<script>(function(){var loaded=false,timer=null;function load(){if(loaded)return;loaded=true;if(timer)clearTimeout(timer);var s=document.createElement('script');s.src='/assets/js/main.js?v=20260808-mobile100-v2';s.defer=true;document.head.appendChild(s);}['pointerdown','keydown','touchstart'].forEach(function(type){addEventListener(type,load,{once:true,passive:true,capture:true});});timer=setTimeout(load,3000);})();</script>`;

function quotePdfLoader(src) {
  return `<script>(function(){var loading=false,ready=false,pending=null;function load(){if(ready||loading)return;loading=true;var s=document.createElement('script');s.src='${src}';s.onload=function(){ready=true;loading=false;if(pending){var el=pending;pending=null;setTimeout(function(){el.click();},0);}};s.onerror=function(){loading=false;pending=null;};document.head.appendChild(s);}document.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-download-quote-pdf]');if(!el||ready)return;ev.preventDefault();ev.stopImmediatePropagation();pending=el;load();},true);document.addEventListener('pointerover',function(ev){if(ev.target.closest&&ev.target.closest('[data-download-quote-pdf]'))load();},{passive:true,capture:true});document.addEventListener('focusin',function(ev){if(ev.target.closest&&ev.target.closest('[data-download-quote-pdf]'))load();},true);})();</script>`;
}

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const isHome = rel === 'index.html' || rel === 'hu/index.html' || rel === 'de-at/index.html';
  const isQuote = rel === 'requestaquote/index.html' || rel === 'hu/ajanlatkeres/index.html' || rel === 'de-at/anfrage/index.html';

  // Async CSS remains useful on ordinary content pages. The homepages and quote
  // builders are layout-dense enough that switching site.css from media=print to
  // all after FCP creates a full-document style/layout task. On the German home
  // page Lighthouse measured that restyle at 103–140 ms TBT despite almost no
  // script boot cost. Keep the same minified single stylesheet blocking on these
  // critical routes so layout is complete before FCP instead of becoming TBT.
  if (!isQuote && !isHome) html = html.replace(stylesheetRe, asyncStyle);

  if (isHome) {
    html = html.replace(mainScriptRe, homeRuntimeLoader);
  }

  if (isQuote) {
    html = html.replace(/class="prose reveal quote-intro(?: in)?"/g, 'class="prose quote-intro"');

    // The pricing engine validates the bundled price table synchronously, then
    // hides this loading message. If the message is visible in the initial HTML,
    // that hide moves the whole quote-intro block after FCP and creates a stable
    // ~0.05076 CLS on mobile. Start the status hidden in the production artifact;
    // setPricingUi(false) still unhides it if pricing is genuinely unavailable.
    html = html.replace(/data-pricing-status="">/g, 'data-pricing-status="" hidden>');
    if (!/data-pricing-status=""\s+hidden>/.test(html)) {
      throw new Error(`Quote pricing status was not stabilized in ${rel}`);
    }

    // PDF creation is only needed after an explicit download action. Loading
    // its renderer on first hover/focus/click removes startup evaluation from
    // the quote critical path while preserving the existing button contract.
    html = html.replace(quotePdfScriptRe, function(_match, _before, src){ return quotePdfLoader(src); });
  }

  if (rel === 'de-at/anfrage/index.html') {
    html = html.replace(/>Start<\/a>/g, '>BANHALMI Startseite</a>');
    html = html.replace(/aria-label="Studio Wien" class="map-card-link"/g, 'aria-label="Maps – Studio Wien" class="map-card-link"');
    html = html.replace(/aria-label="Studio Budapest" class="map-card-link"/g, 'aria-label="Maps – Studio Budapest" class="map-card-link"');
  }

  fs.writeFileSync(file, html);
}

// Preserve the canonical footer heading color after all legacy/mobile rules are
// concatenated. #CBB45F on #202530 clears WCAG AA/AAA and matches the source
// PAGESPEED-STAGE32 accessibility contract without adding another stylesheet.
const cssPath = path.join(root, 'assets/css/site.css');
if (fs.existsSync(cssPath)) {
  fs.appendFileSync(cssPath, '\n.site-footer .footer-accordion summary{color:#CBB45F!important;opacity:1!important;}\n');
}

console.log(`Production artifact optimization applied to ${htmlFiles.length} HTML files.`);
