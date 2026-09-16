/* BANHALMI LAYOUT CONTRACT V18 — desktop footer disclosure state. */
(function(){
  'use strict';
  var query = window.matchMedia('(min-width:1180px)');
  var groups = Array.prototype.slice.call(document.querySelectorAll('details.footer-accordion'));
  if (!groups.length) return;

  function syncFooterGroups(){
    groups.forEach(function(details){
      details.open = query.matches;
    });
  }

  syncFooterGroups();
  if (typeof query.addEventListener === 'function') query.addEventListener('change', syncFooterGroups);
  else if (typeof query.addListener === 'function') query.addListener(syncFooterGroups);
})();
