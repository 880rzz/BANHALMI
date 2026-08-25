import fs from 'node:fs';
const p='assets/css/site.css';
let css=fs.readFileSync(p,'utf8');
const end='/* CLEAN-BANHALMI-DESIGN-AUTHORITY-20260825:END */';
if(!css.includes(end)) throw new Error('BANHALMI clean authority marker missing');
const marker='/* CLEAN-BANHALMI-FINAL-BROWSER-CASCADE-20260825:START */';
if(css.includes(marker)){console.log('Final browser cascade correction already present');process.exit(0);}
const block=`${marker}
/* Dark-surface typography: retain the editorial palette while satisfying AA in every reveal state. */
html body main :is([data-surface="dark"],.trust-proof,.cta-band,.dark-band,.section-dark) a.btn-link{
  color:#DCC56B!important;-webkit-text-fill-color:#DCC56B!important;opacity:1!important;
}
html body main :is([data-surface="dark"],.trust-proof,.cta-band,.dark-band,.section-dark) a.btn-link:hover,
html body main :is([data-surface="dark"],.trust-proof,.cta-band,.dark-band,.section-dark) a.btn-link:focus-visible{
  color:#F5F5F7!important;-webkit-text-fill-color:#F5F5F7!important;
}
html body main :is([data-surface="dark"],.trust-proof,.cta-band,.dark-band,.section-dark) :is(h1,h2,h3).text-reveal,
html body main :is([data-surface="dark"],.trust-proof,.cta-band,.dark-band,.section-dark) :is(h1,h2,h3){
  color:#F5F5F7!important;-webkit-text-fill-color:#F5F5F7!important;background:none!important;opacity:1!important;
}
html body main :is([data-surface="dark"],.trust-proof,.cta-band,.dark-band,.section-dark) :is(.eyebrow,p.eyebrow).text-reveal,
html body main :is([data-surface="dark"],.trust-proof,.cta-band,.dark-band,.section-dark) :is(.eyebrow,p.eyebrow){
  color:#DCC56B!important;-webkit-text-fill-color:#DCC56B!important;background:none!important;opacity:1!important;
}
/* The verified proof band is a dark semantic surface even where legacy markup omitted data-surface. */
html body main .trust-proof :is(h2,h2.text-reveal){color:#F5F5F7!important;-webkit-text-fill-color:#F5F5F7!important;background:none!important}
html body main .trust-proof :is(.eyebrow,p.eyebrow,.eyebrow.text-reveal,p.eyebrow.text-reveal){color:#DCC56B!important;-webkit-text-fill-color:#DCC56B!important;background:none!important}
/* Prevent hidden navigation/decorative layers and long legal identifiers from widening the document. */
html,body{max-width:100%;overflow-x:clip}
html body :is(.site-header,main,.site-footer,.bn-mega-menu,#bn-mega-menu){max-width:100%;overflow-x:clip}
html body .bn-mega-panel{width:min(1320px,100%)!important;max-width:100%!important;box-sizing:border-box!important}
html body :is(.legal,.person-profile-facts,.entity-facts,.trust-proof,.service-deep-dive){max-width:100%;overflow-x:clip}
html body :is(.legal,.person-profile-facts,.entity-facts,.trust-proof,.service-deep-dive) *{min-width:0;max-width:100%}
html body main :is(p,li,dd,dt,a,code,samp,kbd){overflow-wrap:anywhere}
html body main table{display:block;max-width:100%;overflow-x:auto}
@media(max-width:760px){
  html body .person-profile-hero .wrap,html body .person-profile-facts,html body .executive-profile-grid{grid-template-columns:minmax(0,1fr)!important}
  html body .person-profile-hero-media{min-width:0!important;width:100%!important;max-width:100%!important}
}
/* CLEAN-BANHALMI-FINAL-BROWSER-CASCADE-20260825:END */`;
css=css.replace(end,`${block}\n${end}`);
fs.writeFileSync(p,css,'utf8');
console.log('BANHALMI final browser cascade and containment correction inserted into the single CSS authority.');
