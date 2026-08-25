import fs from 'node:fs';
import path from 'node:path';

const siteRoot=path.resolve(process.argv[2]||'_site');
const sourceCss=fs.readFileSync('assets/css/site.css','utf8');
const constitutionCss=fs.readFileSync('assets/design/design-constitution.css.inc','utf8');
const targetCss=path.join(siteRoot,'assets/css/site.css');
const targetDesignDir=path.join(siteRoot,'assets/design');
if(!fs.existsSync(targetCss)) throw new Error('BANHALMI production site.css missing.');
if(!constitutionCss.includes('Design Constitution 2026-08-25')) throw new Error('BANHALMI design constitution marker missing.');
const merged=`${sourceCss.trimEnd()}\n\n/* BANHALMI-DESIGN-CONSTITUTION-MERGED:START */\n${constitutionCss.trim()}\n/* BANHALMI-DESIGN-CONSTITUTION-MERGED:END */\n`;
fs.writeFileSync(targetCss,merged,'utf8');
if(fs.existsSync(targetDesignDir)) fs.rmSync(targetDesignDir,{recursive:true,force:true});

let checked=0,normalized=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory())walk(full);else if(e.isFile()&&e.name.endsWith('.html')){checked++;let html=fs.readFileSync(full,'utf8');const before=html;html=html.replace(/<link rel="preload" as="style" href="(\/assets\/css\/site\.css[^\"]*)"\s*\/><link rel="stylesheet" href="\1" media="print" onload="this\.media='all';this\.onload=null"\s*\/><noscript><link rel="stylesheet" href="\1"\s*\/><\/noscript>/g,'<link rel="stylesheet" href="$1"/>');if(html!==before){fs.writeFileSync(full,html,'utf8');normalized++;}}}}
walk(siteRoot);
if(!sourceCss.includes('APPLE-RESPONSIVE-CONTRACT-V1:START')||!sourceCss.includes('APPLE-RESPONSIVE-CONTRACT-V1:END')) throw new Error('Approved BANHALMI Apple CSS authority markers missing.');
if(!fs.readFileSync(targetCss,'utf8').includes('BANHALMI-DESIGN-CONSTITUTION-MERGED:START')) throw new Error('BANHALMI design constitution was not merged into production CSS.');
console.log(`BANHALMI production design authority restored and Design Constitution merged; ${checked} HTML files checked, ${normalized} async stylesheet mutations normalized.`);