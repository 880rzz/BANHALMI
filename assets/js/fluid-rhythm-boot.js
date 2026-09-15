/* Loads the fluid 4K rhythm contract and applies the canonical Work-menu labels on every published page. */
(function(){
  'use strict';
  var href = '/assets/css/fluid-4k-rhythm.css?v=20260915-rhythm';
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

  var menuCopy={
    en:[
      ['Gallery','https://www.banhalmi.art/#works','Selected commissioned and author-led photography.'],
      ['Art Archive','/archive/','The artistic archive, works, exhibitions and source material.'],
      ['Partners','/partners/','Professional memberships, institutional relationships and selected partners.']
    ],
    hu:[
      ['Galéria','https://www.banhalmi.art/hu/#works','Válogatás megbízásos és szerzői fotográfiákból.'],
      ['Művészeti archívum','/hu/archivum/','Művek, sorozatok, kiállítások és az alkotói archívum.'],
      ['Partnerek','/hu/partnerek/','Szakmai tagságok, intézményi kapcsolatok és válogatott partnerek.']
    ],
    de:[
      ['Galerie','https://www.banhalmi.art/de-at/#works','Eine Auswahl aus Auftragsarbeiten und autorengeführter Fotografie.'],
      ['Kunstarchiv','/de-at/archiv/','Werke, Serien, Ausstellungen und das künstlerische Archiv.'],
      ['Partner','/de-at/partner/','Fachmitgliedschaften, institutionelle Beziehungen und ausgewählte Partner.']
    ]
  };
  function lang(){var l=String(document.documentElement.lang||'en').toLowerCase();return l.indexOf('hu')===0?'hu':l.indexOf('de')===0?'de':'en';}
  function patchMenu(){
    var root=document.getElementById('bn-mega-menu');
    if(!root)return false;
    var col=root.querySelector('.bn-mega-primary');
    if(!col)return false;
    var items=col.querySelectorAll('.bn-mega-item');
    if(items.length<3)return false;
    menuCopy[lang()].forEach(function(copy,i){
      var a=items[i].querySelector('a.bn-mega-link');
      var p=items[i].querySelector('.bn-mega-desc');
      if(a){a.textContent=copy[0];a.href=copy[1];a.removeAttribute('aria-current');a.classList.remove('active');}
      if(p)p.textContent=copy[2];
    });
    var here=String(location.pathname||'/').replace(/\/+$/,'')||'/';
    col.querySelectorAll('a.bn-mega-link').forEach(function(a){try{var u=new URL(a.href,location.href);var p=String(u.pathname||'/').replace(/\/+$/,'')||'/';if(u.origin===location.origin&&p===here){a.classList.add('active');a.setAttribute('aria-current','page');}}catch(e){}});
    return true;
  }
  if(!patchMenu()){
    var observer=new MutationObserver(function(){if(patchMenu())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    window.setTimeout(function(){observer.disconnect();patchMenu();},5000);
  }
})();
