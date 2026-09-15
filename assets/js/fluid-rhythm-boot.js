/* Loads /assets/css/fluid-4k-rhythm.css on every published page. */
(function(){
  'use strict';
  var href = '/assets/css/fluid-4k-rhythm.css?v=20260915-rhythm';
  var existing = document.querySelector('link[data-fluid-4k-rhythm]');
  if (existing) {
    if (existing.getAttribute('href') !== href) existing.setAttribute('href', href);
    return;
  }
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-fluid-4k-rhythm', '');
  document.head.appendChild(link);
})();
