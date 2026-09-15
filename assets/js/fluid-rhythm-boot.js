/* Legacy-compatible loader for the canonical fluid 4K rhythm contract. Navigation authority lives in mega-menu.js. */
(function(){
  'use strict';
  var styles = [
    { href:'/assets/css/fluid-4k-rhythm.css?v=20260915-desktop-v2', attr:'data-fluid-4k-rhythm' },
    { href:'/assets/css/desktop-visual-redesign-v2-gate.css?v=20260915-gate1', attr:'data-desktop-v2-gate' }
  ];
  styles.forEach(function(style){
    var existing = document.querySelector('link[' + style.attr + ']');
    if (existing) {
      if (existing.getAttribute('href') !== style.href) existing.setAttribute('href', style.href);
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = style.href;
    link.setAttribute(style.attr, '');
    document.head.appendChild(link);
  });
})();
