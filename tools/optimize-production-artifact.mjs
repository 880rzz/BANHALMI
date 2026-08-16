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
const quoteMainScriptRe = /<script[^>]*\bsrc="(\/assets\/js\/main\.js\?v=[^\"]+)"[^>]*><\/script>/g;
const megaMenuScriptRe = /<script data-banhalmi-mega-menu="" defer="" src="\/assets\/js\/mega-menu\.js\?v=[^\"]+"><\/script>/g;
const quotePdfScriptRe = /<script([^>]*?)src="(\/assets\/js\/quote-pdf\.js[^\"]*)"([^>]*)><\/script>/g;

const asyncStyle = '<link rel="preload" as="style" href="$1"/><link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\';this.onload=null"/><noscript><link rel="stylesheet" href="$1"/></noscript>';

// Homepages do not need the descriptive menu runtime until the user approaches
// the menu. Keep the menu off the cold-start critical path, but distinguish
// "loading" from "ready" so a hover immediately followed by a click cannot lose
// the user's first activation. Any click received before readiness is replayed
// only after mega-menu.js has installed its own click handler.
const homeMegaMenuLoader = `<script>(function(){var loading=false,ready=false,pending=false;function replay(){if(!ready||!pending)return;pending=false;var b=document.querySelector('.menu-btn');if(b)setTimeout(function(){b.click();},0);}function load(openAfter){if(openAfter)pending=true;if(ready){replay();return;}if(loading)return;loading=true;var s=document.createElement('script');s.src='/assets/js/mega-menu.js?v=20260810-menu-polish-v65';s.defer=true;s.setAttribute('data-banhalmi-mega-menu','');s.onload=function(){loading=false;ready=true;replay();};s.onerror=function(){loading=false;};document.head.appendChild(s);}document.addEventListener('pointerover',function(e){if(e.target.closest&&e.target.closest('.menu-btn'))load(false);},{passive:true,capture:true});document.addEventListener('focusin',function(e){if(e.target.closest&&e.target.closest('.menu-btn'))load(false);},true);document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.menu-btn');if(!b||document.getElementById('bn-mega-menu'))return;if(!ready){e.preventDefault();e.stopImmediatePropagation();load(true);}},true);})();</script>`;

// The heavier general runtime is not required for first paint/navigation. Loading
// it from requestIdleCallback made Chromium execute it almost immediately during
// Lighthouse's idle window and reflow the homepage inside the TBT measurement.
// Keep interaction as the fast path, but use a deterministic post-paint fallback
// instead of an eager idle callback.
const homeRuntimeLoader = `<script>(function(){var loaded=false,timer=null;function load(){if(loaded)return;loaded=true;if(timer)clearTimeout(timer);var s=document.createElement('script');s.src='/assets/js/main.js?v=20260808-mobile100-v2';s.defer=true;document.head.appendChild(s);}['pointerdown','keydown','touchstart'].forEach(function(type){addEventListener(type,load,{once:true,passive:true,capture:true});});timer=setTimeout(load,3000);})();</script>`;

// Quote pages have their own calculator runtime. The general site runtime mostly
// wires navigation, consent UI, reveals and optional widgets, so it should not
// compete with the calculator during the cold-start measurement. Load it when a
// user approaches an interactive control; keep a delayed fallback so consent and
// navigation still initialize even if the page is only being read.
function quoteRuntimeLoader(src) {
  return `<script>(function(){var loading=false,ready=false,pending=null,timer=null;function replay(){if(!ready||!pending)return;var el=pending;pending=null;setTimeout(function(){el.click();},0);}function load(replayTarget){if(replayTarget)pending=replayTarget;if(ready){replay();return;}if(loading)return;loading=true;if(timer)clearTimeout(timer);var s=document.createElement('script');s.src='${src}';s.defer=true;s.onload=function(){loading=false;ready=true;replay();};s.onerror=function(){loading=false;pending=null;};document.head.appendChild(s);}document.addEventListener('pointerover',function(ev){if(ev.target.closest&&ev.target.closest('.menu-btn,[data-cookie-settings]'))load(null);},{passive:true,capture:true});document.addEventListener('focusin',function(ev){if(ev.target.closest&&ev.target.closest('.menu-btn,[data-cookie-settings]'))load(null);},true);document.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('.menu-btn,[data-cookie-settings]');if(!el||ready)return;ev.preventDefault();ev.stopImmediatePropagation();load(el);},true);['pointerdown','keydown','touchstart'].forEach(function(type){addEventListener(type,function(){load(null);},{once:true,passive:true,capture:true});});timer=setTimeout(function(){load(null);},5000);})();</script>`;
}

function quotePdfLoader(src) {
  return `<script>(function(){var loading=false,ready=false,pending=null;function load(){if(ready||loading)return;loading=true;var s=document.createElement('script');s.src='${src}';s.onload=function(){ready=true;loading=false;if(pending){var el=pending;pending=null;setTimeout(function(){el.click();},0);}};s.onerror=function(){loading=false;pending=null;};document.head.appendChild(s);}document.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-download-quote-pdf]');if(!el||ready)return;ev.preventDefault();ev.stopImmediatePropagation();pending=el;load();},true);document.addEventListener('pointerover',function(ev){if(ev.target.closest&&ev.target.closest('[data-download-quote-pdf]'))load();},{passive:true,capture:true});document.addEventListener('focusin',function(ev){if(ev.target.closest&&ev.target.closest('[data-download-quote-pdf]'))load();},true);})();</script>`;
}

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const isHome = rel === 'index.html' || rel === 'hu/index.html' || rel === 'de-at/index.html';
  const isQuote = rel === 'requestaquote/index.html' || rel === 'hu/ajanlatkeres/index.html' || rel === 'de-at/anfrage/index.html';

  if (!isQuote && !isHome) html = html.replace(stylesheetRe, asyncStyle);

  if (isHome) {
    html = html.replace(megaMenuScriptRe, homeMegaMenuLoader);
    html = html.replace(mainScriptRe, homeRuntimeLoader);
    if (/data-banhalmi-mega-menu="" defer=""/.test(html)) {
      throw new Error(`Homepage mega-menu runtime remained eager in ${rel}`);
    }
  }

  if (isQuote) {
    html = html.replace(/class="prose reveal quote-intro(?: in)?"/g, 'class="prose quote-intro"');
    html = html.replace(/data-pricing-status="">/g, 'data-pricing-status="" hidden>');
    if (!/data-pricing-status=""\s+hidden>/.test(html)) {
      throw new Error(`Quote pricing status was not stabilized in ${rel}`);
    }
    html = html.replace(quoteMainScriptRe, function(_match, src){ return quoteRuntimeLoader(src); });
    html = html.replace(quotePdfScriptRe, function(_match, _before, src){ return quotePdfLoader(src); });
    if (/<script[^>]*\bsrc="\/assets\/js\/main\.js\?v=[^\"]+"[^>]*><\/script>/.test(html)) {
      throw new Error(`Quote general runtime remained eager in ${rel}`);
    }
  }

  if (rel === 'de-at/anfrage/index.html') {
    html = html.replace(/>Start<\/a>/g, '>BANHALMI Startseite</a>');
    html = html.replace(/aria-label="Studio Wien" class="map-card-link"/g, 'aria-label="Maps – Studio Wien" class="map-card-link"');
    html = html.replace(/aria-label="Studio Budapest" class="map-card-link"/g, 'aria-label="Maps – Studio Budapest" class="map-card-link"');
  }

  fs.writeFileSync(file, html);
}

const quoteCalculatorPath = path.join(root, 'assets/js/quote-calculator.js');
if (fs.existsSync(quoteCalculatorPath)) {
  let quoteJs = fs.readFileSync(quoteCalculatorPath, 'utf8');

  // The embedded pricing object is part of the audited artifact. Do not first
  // disable the quote UI and then immediately re-enable it: that creates two
  // avoidable DOM mutation/layout passes on every quote-page cold start.
  const loadPricingStart = "function loadPricing(){\n    setPricingUi(false,'');\n    var embedded=window.BANHALMI_PRICING_DATA;";
  const optimizedLoadPricingStart = "function loadPricing(){\n    var embedded=window.BANHALMI_PRICING_DATA;";
  if (!quoteJs.includes(loadPricingStart)) throw new Error('Quote optimizer could not find eager pricing UI reset.');
  quoteJs = quoteJs.replace(loadPricingStart, optimizedLoadPricingStart);

  const protocolMarker = "    var protocol=String(window.location&&window.location.protocol||'');";
  if (!quoteJs.includes(protocolMarker)) throw new Error('Quote optimizer could not find pricing fallback marker.');
  quoteJs = quoteJs.replace(protocolMarker, "    if(pricingReady)return Promise.resolve(true);\n    setPricingUi(false,'');\n" + protocolMarker);

  // loadPricing() performs the one required first paint after verified embedded
  // prices are applied. init() only wires context, date constraints and events,
  // avoiding a duplicate startup panel/layout pass in all three languages.
  const oldInit = "function init(f){applyRequestedServiceContext(f);setDateMins(f);updatePanels(f);f.addEventListener('change',function(event){if(event&&event.target&&event.target.name==='category')syncServiceContextFromCategory(f,true);updatePanels(f);paint(f);});f.addEventListener('input',function(){paint(f);});paint(f);}";
  const newInit = "function init(f){applyRequestedServiceContext(f);setDateMins(f);f.addEventListener('change',function(event){if(event&&event.target&&event.target.name==='category')syncServiceContextFromCategory(f,true);paint(f);});f.addEventListener('input',function(){paint(f);});}";
  if (!quoteJs.includes(oldInit)) throw new Error('Quote optimizer could not find duplicate startup paint contract.');
  quoteJs = quoteJs.replace(oldInit, newInit);
  fs.writeFileSync(quoteCalculatorPath, quoteJs);
}

const cssPath = path.join(root, 'assets/css/site.css');
if (fs.existsSync(cssPath)) {
  fs.appendFileSync(cssPath, '\n.site-footer .footer-accordion summary{color:#CBB45F!important;opacity:1!important;}\n');
}

// AUDIENCE-POSITIONING-PRODUCTION-GUARD
const semanticContracts = [
  ['index.html',['Executive Portraiture &amp; Headshots','brand photography','C-level','artists','actors','visual presence']],
  ['hu/index.html',['Executive portré &amp; headshot','brandfotózás','C-level','művészek','színészek','vizuális jelenlét']],
  ['de-at/index.html',['Executive-Porträts &amp; Headshots','Brandfotografie','C-Level','Künstler','Schauspieler','visuelle Präsenz']],
  ['llms.txt',['Executive Portrait','Professional Headshot','Brand Photography','C-Level Event Photography','artists','actors','visual presence']],
  ['ai.txt',['Executive Portrait','Headshot','Brand Photography','C-Level Event Photography','artists','actors','visual presence']],
  ['ai-entry.json',['executives and C-level leaders','artists','actors','headshot','brand photography','C-level event photography']],
  ['services.json',['Professional headshot','artists','actors','Brand Photography','C-Level Event Photography']]
];
for (const [rel,tokens] of semanticContracts){
  const target=path.join(root,rel);
  if(!fs.existsSync(target)) throw new Error(`Audience positioning production guard: missing ${rel}`);
  const body=fs.readFileSync(target,'utf8');
  for(const token of tokens) if(!body.includes(token)) throw new Error(`Audience positioning production guard: ${rel} lost required semantic token: ${token}`);
}

console.log(`Production artifact optimization applied to ${htmlFiles.length} HTML files.`);
