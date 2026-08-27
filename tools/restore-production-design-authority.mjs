import fs from 'node:fs';
import path from 'node:path';

const siteRoot=path.resolve(process.argv[2]||'_site');
const sourceCss=fs.readFileSync('assets/css/site.css','utf8');
const privateEventScript=path.resolve('assets/js/private-event-quote.js');
const privateEventPricing=path.resolve('private-event-pricing.json');
const targetCss=path.join(siteRoot,'assets/css/site.css');
const targetDesignDir=path.join(siteRoot,'assets/design');
if(!fs.existsSync(targetCss)) throw new Error('BANHALMI production site.css missing.');
if(!fs.existsSync(privateEventScript)||!fs.existsSync(privateEventPricing)) throw new Error('BANHALMI private-event quote sources missing.');
/* Production receives the audited source authority byte-for-byte. Design
   fragments are historical references, never deploy-time patch layers. */
fs.writeFileSync(targetCss,sourceCss,'utf8');
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
if(finalCss!==sourceCss) throw new Error('BANHALMI production restore mutated the canonical CSS authority.');
for(const rel of quotePages){const full=path.join(siteRoot,rel);if(!fs.existsSync(full)||!fs.readFileSync(full,'utf8').includes('/assets/js/private-event-quote.js')) throw new Error(`BANHALMI private-event quote adapter missing from ${rel}.`);}
console.log(`BANHALMI canonical production design preserved byte-for-byte; ${checked} HTML files checked, ${normalized} artifact HTML file(s) normalized, ${privateInjected} private-event quote adapter injection(s), ${pdfPatched} PDF label patch(es).`);
