/* BANHALMI LIVE-PIXEL-GEOMETRY-V23 — release-blocking desktop geometry authority.
   Loaded after fluid-4k-rhythm.css. This file exists to retire conflicting legacy
   footer/hero cascade rules without reintroducing runtime geometry mutation. */

html,body{min-height:100%}
body{min-height:100vh;min-height:100dvh;display:grid;grid-template-rows:auto minmax(0,1fr) auto}
body>main,body>#main{min-width:0;min-height:0;width:100%}
html body>.site-footer,html body .site-footer{height:auto!important;min-height:0!important;max-height:none!important;align-self:end!important}
html body .site-footer>.wrap,html body .site-footer .footer-grid,html body .site-footer .footer-inner{height:auto!important;min-height:0!important;max-height:none!important;align-content:start!important;grid-auto-rows:max-content!important}

@media (min-width:1180px){
  html body .site-footer{padding-top:18px!important;padding-bottom:12px!important}
  html body .site-footer .footer-grid{display:grid!important;grid-template-columns:repeat(11,minmax(0,1fr))!important;grid-template-rows:max-content!important;grid-auto-flow:row!important;column-gap:16px!important;row-gap:0!important;align-items:start!important}
  html body .site-footer .footer-grid>*{min-width:0!important;max-width:100%!important;margin-top:0!important}
  html body .site-footer .footer-grid>div:first-child{grid-column:span 2!important}
  html body .site-footer .footer-grid>details.footer-accordion{grid-column:span 1!important}
  html body .site-footer .footer-grid>div:nth-last-child(-n+2){grid-column:span 2!important}
  html body .site-footer .footer-accordion>summary{min-height:32px!important;padding:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;pointer-events:none!important}
  html body .site-footer .footer-accordion li,html body .site-footer .footer-accordion li>a{min-width:0!important;max-width:100%!important}
  html body .site-footer .footer-accordion li>a{min-height:24px!important;padding-block:1px!important;font-size:.72rem!important;line-height:1.2!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list){overflow:visible!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list) .footer-contact-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0 16px!important;align-items:start!important;margin:0!important;padding:0!important;min-width:0!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list) .footer-studio{min-width:0!important;max-width:100%!important;margin:0!important;padding:0!important;border-top:0!important;overflow:visible!important;align-content:start!important;row-gap:1px!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list) :is(.footer-studio-link,.footer-address,.footer-phone,.footer-whatsapp){display:block!important;min-width:0!important;max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;font-size:.7rem!important;line-height:1.22!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list) .footer-contact-actions{grid-column:1 / -1!important;display:flex!important;flex-wrap:wrap!important;gap:2px 10px!important;min-width:0!important;max-width:100%!important;margin-top:4px!important;padding-top:4px!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list) .footer-contact-actions a{min-height:22px!important;padding:0!important;font-size:.7rem!important;line-height:1.2!important;white-space:normal!important;overflow-wrap:anywhere!important}
  html body .site-footer .footer-legal-list{min-width:0!important;max-width:100%!important;margin:0!important;padding:0!important}
  html body .site-footer .footer-legal-list li{display:grid!important;grid-template-columns:54px minmax(0,1fr)!important;column-gap:8px!important;min-width:0!important;max-width:100%!important;margin-bottom:5px!important;font-size:.7rem!important;line-height:1.2!important}
  html body .site-footer .footer-legal-list li>*{min-width:0!important;max-width:100%!important}
  html body .site-footer .footer-legal-list li>strong{white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;min-width:0!important}
  html body .site-footer .footer-brand-col .footer-entity{font-size:.69rem!important;line-height:1.25!important;margin:4px 0!important}
  html body .site-footer .footer-wko-profile{margin-top:4px!important}
  html body .site-footer .footer-wko-profile img{width:auto!important;max-width:84px!important;height:auto!important}
  html body .site-footer .footer-bottom{margin-top:8px!important;padding-top:6px!important;min-height:0!important;gap:4px 14px!important;font-size:.69rem!important;line-height:1.2!important}
  html body .site-footer .banhalmi-ecosystem,html body .banhalmi-ecosystem{margin-top:4px!important;padding-top:4px!important;min-height:0!important;gap:2px 10px!important;font-size:.69rem!important;line-height:1.15!important}
  html body .site-footer .banhalmi-ecosystem a,html body .banhalmi-ecosystem a{min-height:28px!important;padding-block:0!important}
}

@media (min-width:1180px) and (max-width:1599px){
  html body .site-footer .footer-grid{column-gap:12px!important}
  html body .site-footer .footer-heading,html body .site-footer .footer-accordion>summary{font-size:.68rem!important;line-height:1.15!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list) .footer-contact-list{column-gap:10px!important}
  html body .site-footer .footer-grid>div:has(.footer-contact-list) :is(.footer-studio-link,.footer-address,.footer-phone,.footer-whatsapp),html body .site-footer .footer-grid>div:has(.footer-contact-list) .footer-contact-actions a,html body .site-footer .footer-legal-list li{font-size:.64rem!important;line-height:1.16!important}
  html body .site-footer .footer-legal-list li{grid-template-columns:48px minmax(0,1fr)!important;column-gap:6px!important}
}

@media (min-width:1180px){
  html body main[data-homepage-redesign="stage76"]{align-items:stretch!important}
  html body main[data-homepage-redesign="stage76"]>.hero-visual-only,html body main[data-homepage-redesign="stage76"]>.hero-copy-only{margin:0!important;border-top:0!important;border-bottom:0!important}
  html body main[data-homepage-redesign="stage76"]>.hero-visual-only{padding:0!important}
  html body main[data-homepage-redesign="stage76"]>.hero-visual-only>.wrap,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure picture,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure picture>img,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-video{margin:0!important;padding:0!important;border:0!important}
  html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure{border-radius:0!important}
  html body main[data-homepage-redesign="stage76"]>.hero-copy-only{align-self:stretch!important}
  html body main[data-homepage-redesign="stage76"]>.hero-visual-only+ .hero-copy-only{margin-top:0!important}
}

/* No ornamental spacer may exist between a hero and its following section. */
html body main>.hero+section{margin-top:0!important}
html body main>.hero{margin-bottom:0!important}
