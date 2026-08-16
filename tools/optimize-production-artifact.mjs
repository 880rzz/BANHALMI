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
// The heavier general runtime can safely wait for interaction/idle because it
// does not create the primary navigation structure.
const homeRuntimeLoader = `<script>(function(){var loaded=false;function load(){if(loaded)return;loaded=true;var s=document.createElement('script');s.src='/assets/js/main.js?v=20260808-mobile100-v2';s.defer=true;document.head.appendChild(s);}['pointerdown','keydown','touchstart'].forEach(function(type){addEventListener(type,load,{once:true,passive:true,capture:true});});if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:5000});else setTimeout(load,5000);})();</script>`;

function quotePdfLoader(src) {
  return `<script>(function(){var loading=false,ready=false,pending=null;function load(){if(ready||loading)return;loading=true;var s=document.createElement('script');s.src='${src}';s.onload=function(){ready=true;loading=false;if(pending){var el=pending;pending=null;setTimeout(function(){el.click();},0);}};s.onerror=function(){loading=false;pending=null;};document.head.appendChild(s);}document.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-download-quote-pdf]');if(!el||ready)return;ev.preventDefault();ev.stopImmediatePropagation();pending=el;load();},true);document.addEventListener('pointerover',function(ev){if(ev.target.closest&&ev.target.closest('[data-download-quote-pdf]'))load();},{passive:true,capture:true});document.addEventListener('focusin',function(ev){if(ev.target.closest&&ev.target.closest('[data-download-quote-pdf]'))load();},true);})();</script>`;
}

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const isHome = rel === 'index.html' || rel === 'hu/index.html' || rel === 'de-at/index.html';
  const isQuote = rel === 'requestaquote/index.html' || rel === 'hu/ajanlatkeres/index.html' || rel === 'de-at/anfrage/index.html';

  // Async CSS is a win on normal content pages, but the very large quote form
  // creates a costly post-FCP full-document restyle when the stylesheet flips
  // from media=print to all. Keep the same single minified stylesheet blocking
  // on quote routes so layout work finishes before FCP instead of inflating TBT.
  if (!isQuote) html = html.replace(stylesheetRe, asyncStyle);

  if (isHome) {
    html = html.replace(mainScriptRe, homeRuntimeLoader);
  }

  if (isQuote) {
    html = html.replace(/class="prose reveal quote-intro(?: in)?"/g, 'class="prose quote-intro"');
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
