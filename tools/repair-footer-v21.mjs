import fs from 'node:fs';

const cssPath='assets/css/site.css';
let css=fs.readFileSync(cssPath,'utf8');
const legacySix='grid-template-columns:minmax(280px,1.15fr) minmax(225px,1fr) minmax(140px,.68fr) minmax(135px,.68fr) minmax(150px,.72fr) minmax(270px,1.2fr)!important';
if(css.includes(legacySix)) css=css.split(legacySix).join('grid-template-columns:repeat(12,minmax(0,1fr))!important');
const start='/* FOOTER-DESKTOP-GEOMETRY-V21:START */';
const end='/* FOOTER-DESKTOP-GEOMETRY-V21:END */';
const block=`${start}
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
  html body .site-footer .footer-legal-list li>strong{white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;}
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
${end}`;
const oldRe=/\/\* FOOTER-DESKTOP-GEOMETRY-V21:START \*\/[\s\S]*?\/\* FOOTER-DESKTOP-GEOMETRY-V21:END \*\//m;
if(oldRe.test(css)) css=css.replace(oldRe,block);
else {
  const marker='/* CANONICAL-DESIGN-SYSTEM-20260827:END */';
  if(!css.includes(marker)) throw new Error('canonical CSS end marker missing');
  css=css.replace(marker,block+'\n'+marker);
}
fs.writeFileSync(cssPath,css);

const dPath='data/design-authority.json';
const d=JSON.parse(fs.readFileSync(dPath,'utf8'));
d.version='2026-09-17-v21-two-row-footer-no-overflow';
d.layout=d.layout||{};
d.layout.footer=Object.assign({},d.layout.footer||{}, {desktopColumns:12,desktopRows:2,desktopMinPx:1180,contactStudioColumns:2,preventHorizontalOverflow:true,semanticWordWrap:true,desktopPlacement:'brand/services/archive/profile row 1; contact/social/memberships/legal row 2'});
fs.writeFileSync(dPath,JSON.stringify(d,null,2)+'\n');

const aPath='tools/audit-executive-footer-contract.mjs';
let a=fs.readFileSync(aPath,'utf8');
a=a.replace("  'minmax(280px,1.15fr) minmax(225px,1fr) minmax(140px,.68fr) minmax(135px,.68fr) minmax(150px,.72fr) minmax(270px,1.2fr)',", "  'FOOTER-DESKTOP-GEOMETRY-V21:START',\n  'grid-template-columns:repeat(12,minmax(0,1fr))!important',\n  'grid-template-columns:repeat(2,minmax(0,1fr))!important',");
a=a.replace("  '@media(max-width:1460px)'", "  '@media(min-width:1180px)'");
if(!a.includes('legacy six-track footer overflow geometry remains')) a=a.replace('let footers = 0;',"if(css.includes('grid-template-columns:minmax(280px,1.15fr) minmax(225px,1fr) minmax(140px,.68fr) minmax(135px,.68fr) minmax(150px,.72fr) minmax(270px,1.2fr)!important')) errors.push('legacy six-track footer overflow geometry remains');\n\nlet footers = 0;");
fs.writeFileSync(aPath,a);
console.log('Footer V21 repair applied.');
