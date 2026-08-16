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

const asyncStyle = '<link rel="preload" as="style" href="$1"/><link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\';this.onload=null"/><noscript><link rel="stylesheet" href="$1"/></noscript>';

// The mega-menu runtime stays as a normal deferred script: it is small after
// minification and must be ready for the user's very first menu interaction.
// The heavier general runtime can safely wait for interaction/idle because it
// does not create the primary navigation structure.
const homeRuntimeLoader = `<script>(function(){var loaded=false;function load(){if(loaded)return;loaded=true;var s=document.createElement('script');s.src='/assets/js/main.js?v=20260808-mobile100-v2';s.defer=true;document.head.appendChild(s);}['pointerdown','keydown','touchstart'].forEach(function(type){addEventListener(type,load,{once:true,passive:true,capture:true});});if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:5000});else setTimeout(load,5000);})();</script>`;

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(stylesheetRe, asyncStyle);

  const rel = path.relative(root, file).replaceAll('\\', '/');
  const isHome = rel === 'index.html' || rel === 'hu/index.html' || rel === 'de-at/index.html';
  if (isHome) {
    html = html.replace(mainScriptRe, homeRuntimeLoader);
  }

  const isQuote = rel === 'requestaquote/index.html' || rel === 'hu/ajanlatkeres/index.html' || rel === 'de-at/anfrage/index.html';
  if (isQuote) {
    html = html.replace(/class="prose reveal quote-intro(?: in)?"/g, 'class="prose quote-intro"');
  }

  if (rel === 'de-at/anfrage/index.html') {
    html = html.replace(/>Start<\/a>/g, '>BANHALMI Startseite</a>');
    html = html.replace(/aria-label="Studio Wien" class="map-card-link"/g, 'aria-label="Maps – Studio Wien" class="map-card-link"');
    html = html.replace(/aria-label="Studio Budapest" class="map-card-link"/g, 'aria-label="Maps – Studio Budapest" class="map-card-link"');
  }

  fs.writeFileSync(file, html);
}

console.log(`Production artifact optimization applied to ${htmlFiles.length} HTML files.`);
