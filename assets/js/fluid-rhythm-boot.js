/* Legacy-compatible loader for the canonical fluid 4K rhythm contract. Navigation authority lives in mega-menu.js. */
(function(){
  'use strict';
  var href = '/assets/css/fluid-4k-rhythm.css?v=20260915-footer-cards-v1';
  var existing = document.querySelector('link[data-fluid-4k-rhythm]');
  if (existing) {
    if (existing.getAttribute('href') !== href) existing.setAttribute('href', href);
  } else {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-fluid-4k-rhythm', '');
    document.head.appendChild(link);
  }

  /* 2026-09-16 production layout recovery. Keep this in the existing runtime
     authority instead of introducing a third stylesheet. */
  var recoveryId = 'banhalmi-layout-v18';
  if (!document.getElementById(recoveryId)) {
    var style = document.createElement('style');
    style.id = recoveryId;
    style.textContent = [
      'html{background:#fff!important}',
      'html body{display:block!important;min-height:0!important;background:#fff!important}',
      'html body>.site-footer{align-self:auto!important;height:auto!important;min-height:0!important;max-height:none!important}',
      '@media(min-width:1180px){',
      'html body .site-footer details.footer-accordion>:not(summary){display:block!important}',
      'html body .site-footer details.footer-accordion>summary{pointer-events:none!important;cursor:default!important}',
      'html body main[data-homepage-redesign="stage76"]{--desktop-hero-min:clamp(520px,62vh,680px)!important}',
      'html body main[data-homepage-redesign="stage76"]>.hero-visual-only,html body main[data-homepage-redesign="stage76"]>.hero-copy-only,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure picture,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure picture>img,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-video{min-height:var(--desktop-hero-min)!important}',
      'html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-figure picture>img,html body main[data-homepage-redesign="stage76"]>.hero-visual-only .hero-video{object-position:center 30%!important}',
      '}',
      'html body main .cards:not(.smart-quote-layout):not(.quote-layout),html body main .archive-cards,html body main .card-grid,html body main .service-info-cards{align-items:stretch!important}',
      'html body main .cards:not(.smart-quote-layout):not(.quote-layout)>.card,html body main .archive-cards>.archive-card,html body main .card-grid>.card,html body main .service-info-cards>.card{height:100%!important;min-height:100%!important;display:flex!important;flex-direction:column!important}',
      'html body main .cards>.card :is(.more,.btn-link):last-child,html body main .archive-card :is(.more,.btn-link):last-child,html body main .card-grid>.card :is(.more,.btn-link):last-child,html body main .service-info-cards>.card :is(.more,.btn-link):last-child{margin-top:auto!important}',
      'html body main .contact-custom-quote .cards,html body main .smart-quote-layout,html body main .quote-layout{align-items:start!important}',
      'html body main .reviews-drawer-section details.review-drawer>summary{position:relative;padding-right:34px!important;cursor:pointer}',
      'html body main .reviews-drawer-section details.review-drawer>summary::after{content:"⌄"!important;position:absolute;right:4px;top:50%;transform:translateY(-56%);display:block!important;color:#8f7118;font-size:1.35rem;line-height:1;font-weight:500;transition:transform .18s ease}',
      'html body main .reviews-drawer-section details.review-drawer[open]>summary::after{transform:translateY(-44%) rotate(180deg)}'
    ].join('');
    document.head.appendChild(style);
  }

  var query = window.matchMedia('(min-width:1180px)');
  var groups = Array.prototype.slice.call(document.querySelectorAll('details.footer-accordion'));
  function syncFooterGroups(){
    groups.forEach(function(details){ details.open = query.matches; });
  }
  if (groups.length) {
    syncFooterGroups();
    if (typeof query.addEventListener === 'function') query.addEventListener('change', syncFooterGroups);
    else if (typeof query.addListener === 'function') query.addListener(syncFooterGroups);
  }
})();
