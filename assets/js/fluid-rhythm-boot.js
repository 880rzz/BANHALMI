/* Loader for the canonical fluid 4K rhythm contract. Navigation authority lives in mega-menu.js. */
(function(){
  'use strict';
  var sheets = [
    {href:'/assets/css/fluid-4k-rhythm.css?v=20260916-live-pixel-v22', key:'fluid-4k-rhythm'},
    {href:'/assets/css/live-pixel-geometry-v23.css?v=20260917', key:'live-pixel-geometry-v23'}
  ];
  sheets.forEach(function(sheet){
    var selector='link[data-'+sheet.key+']';
    var existing=document.querySelector(selector);
    if(existing){
      if(existing.getAttribute('href')!==sheet.href) existing.setAttribute('href',sheet.href);
      return;
    }
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href=sheet.href;
    link.setAttribute('data-'+sheet.key,'');
    document.head.appendChild(link);
  });

  /* Runtime owns disclosure state only. Pixel geometry belongs to the canonical stylesheets. */
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
