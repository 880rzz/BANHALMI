import fs from 'node:fs';

const desktopBlock=`/* FOOTER-DESKTOP-GEOMETRY-V21:START */
@media(min-width:1180px){
  html body .site-footer .footer-grid{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;column-gap:clamp(18px,1.8vw,28px)!important;row-gap:28px!important;align-items:start!important;width:100%!important;max-width:100%!important;min-width:0!important;}
  html body .site-footer .footer-grid>*{min-width:0!important;max-width:100%!important;}
  html body .site-footer .footer-grid>:nth-child(1){grid-column:1/4!important;grid-row:1!important;}
  html body .site-footer .footer-grid>:nth-child(2){grid-column:4/6!important;grid-row:1!important;}
  html body .site-footer .footer-grid>:nth-child(3){grid-column:6/8!important;grid-row:1!important;}
  html body .site-footer .footer-grid>:nth-child(4){grid-column:8/10!important;grid-row:1!important;}
  html body .site-footer .footer-grid>:nth-child(5){grid-column:1/6!important;grid-row:2!important;}
  html body .site-footer .footer-grid>:nth-child(6){grid-column:6/8!important;grid-row:2!important;}
  html body .site-footer .footer-grid>:nth-child(7){grid-column:8/11!important;grid-row:2!important;}
  html body .site-footer .footer-grid>:nth-child(8){grid-column:11/13!important;grid-row:2!important;}
  html body .site-footer .footer-contact-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:clamp(22px,2vw,34px)!important;align-items:start!important;min-width:0!important;max-width:100%!important;}
  html body .site-footer .footer-contact-list .footer-studio{min-width:0!important;max-width:100%!important;margin:0!important;}
  html body .site-footer .footer-contact-list :is(.footer-address,.footer-phone,.footer-whatsapp){display:flex!important;max-width:100%!important;white-space:normal!important;overflow-wrap:normal!important;word-break:normal!important;hyphens:none!important;}
  html body .site-footer .footer-contact-actions{grid-template-columns:auto minmax(0,1fr)!important;column-gap:12px!important;align-items:center!important;}
  html body .site-footer .footer-contact-actions a{width:auto!important;max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important;}
  html body .site-footer .footer-grid ul:not(.footer-contact-list):not(.footer-legal-list) li,html body .site-footer .footer-grid ul:not(.footer-contact-list):not(.footer-legal-list) li>a{min-width:0!important;max-width:100%!important;white-space:normal!important;overflow-wrap:normal!important;word-break:normal!important;hyphens:none!important;}
  html body .site-footer .footer-legal-list{min-width:0!important;max-width:100%!important;}
  html body .site-footer .footer-legal-list li{grid-template-columns:minmax(0,58px) minmax(0,1fr)!important;min-width:0!important;}
  html body .site-footer .footer-legal-list li>*{min-width:0!important;max-width:100%!important;}
  html body .site-footer .footer-legal-list li>strong{white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;min-width:0!important;}
  html body .site-footer .footer-bottom,html body .banhalmi-ecosystem{min-width:0!important;max-width:100%!important;overflow-x:clip!important;}
}
@media(min-width:1180px) and (max-width:1365px){
  html body .site-footer .footer-grid>:nth-child(1){grid-column:1/5!important;}
  html body .site-footer .footer-grid>:nth-child(2){grid-column:5/7!important;}
  html body .site-footer .footer-grid>:nth-child(3){grid-column:7/9!important;}
  html body .site-footer .footer-grid>:nth-child(4){grid-column:9/13!important;}
  html body .site-footer .footer-grid>:nth-child(5){grid-column:1/7!important;}
  html body .site-footer .footer-grid>:nth-child(6){grid-column:7/9!important;}
  html body .site-footer .footer-grid>:nth-child(7){grid-column:9/13!important;grid-row:2!important;}
  html body .site-footer .footer-grid>:nth-child(8){grid-column:9/13!important;grid-row:3!important;margin-top:-8px!important;}
}
/* FOOTER-DESKTOP-GEOMETRY-V21:END */`;

const cssPath='assets/css/site.css';
let css=fs.readFileSync(cssPath,'utf8');
const legacySix='grid-template-columns:minmax(280px,1.15fr) minmax(225px,1fr) minmax(140px,.68fr) minmax(135px,.68fr) minmax(150px,.72fr) minmax(270px,1.2fr)!important';
if(css.includes(legacySix)) css=css.split(legacySix).join('grid-template-columns:repeat(12,minmax(0,1fr))!important');
const siteRe=/\/\* FOOTER-DESKTOP-GEOMETRY-V21:START \*\/[\s\S]*?\/\* FOOTER-DESKTOP-GEOMETRY-V21:END \*\//m;
if(siteRe.test(css)) css=css.replace(siteRe,desktopBlock);
else {
  const marker='/* CANONICAL-DESIGN-SYSTEM-20260827:END */';
  if(!css.includes(marker)) throw new Error('canonical CSS end marker missing');
  css=css.replace(marker,desktopBlock+'\n'+marker);
}
fs.writeFileSync(cssPath,css);

const fluidPath='assets/css/fluid-4k-rhythm.css';
let fluid=fs.readFileSync(fluidPath,'utf8');
const fluidStart='/* FOOTER-DESKTOP-GEOMETRY-V21-FLUID:START */';
const fluidEnd='/* FOOTER-DESKTOP-GEOMETRY-V21-FLUID:END */';
const fluidBlock=`${fluidStart}\n${desktopBlock.replaceAll('FOOTER-DESKTOP-GEOMETRY-V21:START','FOOTER-DESKTOP-GEOMETRY-V21-FLUID-INNER:START').replaceAll('FOOTER-DESKTOP-GEOMETRY-V21:END','FOOTER-DESKTOP-GEOMETRY-V21-FLUID-INNER:END')}\n${fluidEnd}`;
const fluidRe=/\/\* FOOTER-DESKTOP-GEOMETRY-V21-FLUID:START \*\/[\s\S]*?\/\* FOOTER-DESKTOP-GEOMETRY-V21-FLUID:END \*\//m;
fluid=fluidRe.test(fluid)?fluid.replace(fluidRe,fluidBlock):fluid.trimEnd()+'\n'+fluidBlock+'\n';
fs.writeFileSync(fluidPath,fluid);

const dPath='data/design-authority.json';
const d=JSON.parse(fs.readFileSync(dPath,'utf8'));
d.version='2026-09-17-v21-two-row-footer-no-overflow';
d.layout=d.layout||{};
d.layout.footer=Object.assign({},d.layout.footer||{}, {desktopColumns:12,desktopRows:2,desktopMinPx:1180,contactStudioColumns:2,preventHorizontalOverflow:true,semanticWordWrap:true,desktopPlacement:'brand/services/archive/profile row 1; contact/social/memberships/legal row 2'});
fs.writeFileSync(dPath,JSON.stringify(d,null,2)+'\n');

const bootPath='assets/js/fluid-rhythm-boot.js';
let boot=fs.readFileSync(bootPath,'utf8');
boot=boot.replace(/\/assets\/css\/fluid-4k-rhythm\.css\?v=[^'\"]+/g,'/assets/css/fluid-4k-rhythm.css?v=20260917-footer-v21');
fs.writeFileSync(bootPath,boot);

const footerAuditPath='tools/audit-footer-cards-tail-contract.mjs';
let fa=fs.readFileSync(footerAuditPath,'utf8');
fa=fa.replace("must(Number(footer.desktopColumns)===4,'desktop footer must use four readable tracks');","must(Number(footer.desktopColumns)===12,'desktop footer must use twelve safe tracks for the explicit two-row composition');");
fa=fa.replace("must(/grid-template-columns:minmax\\(0,2fr\\) repeat\\(3,minmax\\(0,1fr\\)\\)!important/.test(fluid),'canonical desktop footer must use four readable tracks');","must(fluid.includes('FOOTER-DESKTOP-GEOMETRY-V21-FLUID:START')&&/grid-template-columns:repeat\\(12,minmax\\(0,1fr\\)\\)!important/.test(fluid),'canonical desktop footer V21 twelve-track geometry missing');");
fa=fa.replace("boot.includes('/assets/css/fluid-4k-rhythm.css?v=20260916-live-pixel-v19')","boot.includes('/assets/css/fluid-4k-rhythm.css?v=20260917-footer-v21')");
fa=fa.replace("three-band desktop footer, compact intermediate geometry, equal cards and canonical CSS authority are protected.","two-row desktop footer, compact intermediate geometry, equal cards and canonical CSS authority are protected.");
fs.writeFileSync(footerAuditPath,fa);

const histPath='tools/audit-historical-design-regressions.mjs';
let hist=fs.readFileSync(histPath,'utf8');
hist=hist.replace("must(Number(authority.layout?.footer?.desktopColumns)===4,'BANHALMI desktop footer must use four readable tracks');","must(Number(authority.layout?.footer?.desktopColumns)===12,'BANHALMI desktop footer must use twelve safe tracks for the explicit two-row layout');");
hist=hist.replace("canonical canvases, three-band footer authority,","canonical canvases, two-row desktop footer authority,");
fs.writeFileSync(histPath,hist);

const execAuditPath='tools/audit-executive-footer-contract.mjs';
let ea=fs.readFileSync(execAuditPath,'utf8');
ea=ea.replace("  'minmax(280px,1.15fr) minmax(225px,1fr) minmax(140px,.68fr) minmax(135px,.68fr) minmax(150px,.72fr) minmax(270px,1.2fr)',", "  'FOOTER-DESKTOP-GEOMETRY-V21:START',\n  'grid-template-columns:repeat(12,minmax(0,1fr))!important',\n  'grid-template-columns:repeat(2,minmax(0,1fr))!important',");
ea=ea.replace("  '@media(max-width:1460px)'", "  '@media(min-width:1180px)'");
if(!ea.includes('legacy six-track footer overflow geometry remains')) ea=ea.replace('let footers = 0;',"if(css.includes('grid-template-columns:minmax(280px,1.15fr) minmax(225px,1fr) minmax(140px,.68fr) minmax(135px,.68fr) minmax(150px,.72fr) minmax(270px,1.2fr)!important')) errors.push('legacy six-track footer overflow geometry remains');\n\nlet footers = 0;");
fs.writeFileSync(execAuditPath,ea);

console.log('Footer V21 source, fluid authority, cache token and anti-rollback audits aligned.');
// Release trigger only: V21 source was audited before production deployment on 2026-09-18.
