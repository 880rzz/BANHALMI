/* Legacy-compatible loader for the canonical fluid 4K rhythm contract. Navigation authority lives in mega-menu.js. */
(function(){
  'use strict';
  var href = '/assets/css/fluid-4k-rhythm.css?v=20260915-footer-cards-v1';
  var recoveryHref = '/assets/css/layout-contract-v18.css?v=20260916-v18';
  var recoveryScriptSrc = '/assets/js/layout-contract-v18.js?v=20260916-v18';

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

  var recovery = document.querySelector('link[data-layout-contract-v18]');
  if (!recovery) {
    recovery = document.createElement('link');
    recovery.rel = 'stylesheet';
    recovery.href = recoveryHref;
    recovery.setAttribute('data-layout-contract-v18', '');
    document.head.appendChild(recovery);
  } else if (recovery.getAttribute('href') !== recoveryHref) {
    recovery.setAttribute('href', recoveryHref);
  }

  if (!document.querySelector('script[data-layout-contract-v18]')) {
    var script = document.createElement('script');
    script.src = recoveryScriptSrc;
    script.defer = true;
    script.setAttribute('data-layout-contract-v18', '');
    document.head.appendChild(script);
  }
})();
