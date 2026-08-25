import fs from 'node:fs';
const p='assets/css/site.css';
let css=fs.readFileSync(p,'utf8');
const end='/* CLEAN-BANHALMI-DESIGN-AUTHORITY-20260825:END */';
if(!css.includes(end)) throw new Error('BANHALMI clean authority marker missing');
const marker='/* CLEAN-BANHALMI-BROWSER-QA-20260825:START */';
if(css.includes(marker)){console.log('Browser QA correction already present');process.exit(0);}
const block=`${marker}
/* Systemic render corrections proven by the exhaustive 58-page / 348-render browser gate. */
html body button.menu-btn{
  box-sizing:border-box!important;width:44px!important;min-width:44px!important;max-width:44px!important;
  height:44px!important;min-height:44px!important;max-height:44px!important;padding:10px!important;
  display:grid!important;place-items:center!important;flex:0 0 44px!important;
}
/* Editorial links on light homepage surfaces use the AA-safe deep brand gold. */
html body a.btn-link{color:#8A681F!important;opacity:1!important;-webkit-text-fill-color:currentColor!important}
html body a.btn-link:hover,html body a.btn-link:focus-visible{color:#6F5218!important}
/* Reveal animation may never determine legibility. Evidence headings are readable before and after JS. */
html body .text-reveal{opacity:1!important;visibility:visible!important;transform:none!important}
html body h2.text-reveal{color:#202530!important;-webkit-text-fill-color:#202530!important;background:none!important}
html body p.eyebrow.text-reveal,html body .eyebrow.text-reveal{color:#8A681F!important;-webkit-text-fill-color:#8A681F!important;background:none!important}
/* Containment: no hidden menu shell or long legal/entity token may widen the document. */
html body .bn-mega-panel,html body .bn-mega-menu,html body #bn-mega-menu{box-sizing:border-box!important;max-width:100vw!important}
html body main,html body main>*,html body section,html body article,html body .wrap,html body .legal,html body .prose,html body .person-profile-facts,html body .entity-facts{min-width:0!important}
html body .legal :is(p,li,a,dd,dt),html body .prose :is(p,li,a,dd,dt),html body .entity-facts :is(dd,a),html body .person-profile-facts :is(p,a,dd){overflow-wrap:anywhere;word-break:normal}
@media(min-width:861px){html body .bn-mega-panel{width:min(1440px,100%)!important}}
/* CLEAN-BANHALMI-BROWSER-QA-20260825:END */`;
css=css.replace(end,`${block}\n${end}`);
fs.writeFileSync(p,css,'utf8');
console.log('BANHALMI systemic browser QA correction inserted inside the final CSS authority.');
