import fs from 'node:fs';
import path from 'node:path';

const siteRoot=path.resolve(process.argv[2]||'_site');
const sourceCss=fs.readFileSync('assets/css/site.css','utf8');
const constitutionCss=fs.readFileSync('assets/design/design-constitution.css.inc','utf8');
const opticalAxisCss=fs.readFileSync('assets/design/optical-axis-authority.css.inc','utf8');
const quoteMobileCss=fs.readFileSync('assets/design/quote-mobile-authority.css.inc','utf8');
const privateEventScript=path.resolve('assets/js/private-event-quote.js');
const privateEventPricing=path.resolve('private-event-pricing.json');
const targetCss=path.join(siteRoot,'assets/css/site.css');
const targetDesignDir=path.join(siteRoot,'assets/design');
if(!fs.existsSync(targetCss)) throw new Error('BANHALMI production site.css missing.');
if(!constitutionCss.includes('Design Constitution 2026-08-25')) throw new Error('BANHALMI design constitution marker missing.');
if(!opticalAxisCss.includes('BANHALMI Optical Axis Authority 2026-08-26')) throw new Error('BANHALMI optical-axis authority marker missing.');
if(!quoteMobileCss.includes('BANHALMI Quote Mobile Authority 2026-08-26')) throw new Error('BANHALMI quote mobile authority marker missing.');
if(!fs.existsSync(privateEventScript)||!fs.existsSync(privateEventPricing)) throw new Error('BANHALMI private-event quote sources missing.');
const merged=`${sourceCss.trimEnd()}\n\n/* BANHALMI-DESIGN-CONSTITUTION-MERGED:START */\n${constitutionCss.trim()}\n/* BANHALMI-DESIGN-CONSTITUTION-MERGED:END */\n\n/* BANHALMI-OPTICAL-AXIS-AUTHORITY-MERGED:START */\n${opticalAxisCss.trim()}\n/* BANHALMI-OPTICAL-AXIS-AUTHORITY-MERGED:END */\n\n/* BANHALMI-QUOTE-MOBILE-AUTHORITY-MERGED:START */\n${quoteMobileCss.trim()}\n/* BANHALMI-QUOTE-MOBILE-AUTHORITY-MERGED:END */\n`;
fs.writeFileSync(targetCss,merged,'utf8');
if(fs.existsSync(targetDesignDir)) fs.rmSync(targetDesignDir,{recursive:true,force:true});

const quotePages=new Set(['requestaquote/index.html','hu/ajanlatkeres/index.html','de-at/anfrage/index.html']);
const privateScriptTag='<script defer src="/assets/js/private-event-quote.js"></script>';
let checked=0,normalized=0,privateInjected=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory())walk(full);else if(e.isFile()&&e.name.endsWith('.html')){checked++;let html=fs.readFileSync(full,'utf8');const before=html;html=html.replace(/<link rel="preload" as="style" href="(\/assets\/css\/site\.css[^\"]*)"\s*\/><link rel="stylesheet" href="\1" media="print" onload="this\.media='all';this\.onload=null"\s*\/><noscript><link rel="stylesheet" href="\1"\s*\/><\/noscript>/g,'<link rel="stylesheet" href="$1"/>');const rel=path.relative(siteRoot,full).split(path.sep).join('/');if(quotePages.has(rel)&&!html.includes('/assets/js/private-event-quote.js')){html=html.replace(/<\/body>/i,`${privateScriptTag}</body>`);privateInjected++;}if(html!==before){fs.writeFileSync(full,html,'utf8');normalized++;}}}}
walk(siteRoot);

/* The static PDF engine already knows the event duration/guest model. Add only
   the private-event service label at artifact build time; calculation remains
   owned by the shared quote calculator and private-event pricing adapter. */
const quotePdfPath=path.join(siteRoot,'assets/js/quote-pdf.js');
let pdfPatched=0;
if(fs.existsSync(quotePdfPath)){
  let pdf=fs.readFileSync(quotePdfPath,'utf8');
  const needle="add(projectRows,l.service,categoryLabel(cat,lang));";
  const replacement="add(projectRows,l.service,form.getAttribute('data-private-event-active')==='true'?({en:'Private celebrations & family milestones',de:'Private Feiern & Familienjubiläen',hu:'Családi események és mérföldkő-ünnepek'})[lang]:categoryLabel(cat,lang));";
  if(pdf.includes(needle)){pdf=pdf.replace(needle,replacement);fs.writeFileSync(quotePdfPath,pdf,'utf8');pdfPatched=1;}
  else if(!pdf.includes('Private celebrations & family milestones')) throw new Error('BANHALMI private-event PDF label patch target missing.');
}
if(!sourceCss.includes('APPLE-RESPONSIVE-CONTRACT-V1:START')||!sourceCss.includes('APPLE-RESPONSIVE-CONTRACT-V1:END')) throw new Error('Approved BANHALMI Apple CSS authority markers missing.');
const finalCss=fs.readFileSync(targetCss,'utf8');
if(!finalCss.includes('BANHALMI-DESIGN-CONSTITUTION-MERGED:START')) throw new Error('BANHALMI design constitution was not merged into production CSS.');
if(!finalCss.includes('BANHALMI-OPTICAL-AXIS-AUTHORITY-MERGED:START')) throw new Error('BANHALMI optical-axis authority was not merged into production CSS.');
if(!finalCss.includes('BANHALMI-QUOTE-MOBILE-AUTHORITY-MERGED:START')) throw new Error('BANHALMI quote mobile authority was not merged into production CSS.');
for(const rel of quotePages){const full=path.join(siteRoot,rel);if(!fs.existsSync(full)||!fs.readFileSync(full,'utf8').includes('/assets/js/private-event-quote.js')) throw new Error(`BANHALMI private-event quote adapter missing from ${rel}.`);}
console.log(`BANHALMI production design authority restored; Design Constitution, optical-axis and quote-mobile authority merged; ${checked} HTML files checked, ${normalized} artifact HTML file(s) normalized, ${privateInjected} private-event quote adapter injection(s), ${pdfPatched} PDF label patch(es).`);
