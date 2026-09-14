/* Loads /assets/css/fluid-4k-rhythm.css on every published page. */
(function(){
  'use strict';
  if (document.querySelector('link[data-fluid-4k-rhythm]')) return;
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/css/fluid-4k-rhythm.css?v=20260914-rhythm';
  link.setAttribute('data-fluid-4k-rhythm', '');
  document.head.appendChild(link);
})();
