/* BANHALMI homepage runtime — EN/HU/DE only. Keep first paint lean and consent fail-closed. */
(function () {
  'use strict';

  var nav=document.querySelector('.nav');
  var btn=document.querySelector('.menu-btn');
  var submenus=nav?Array.prototype.slice.call(nav.querySelectorAll('.nav-submenu')):[];
  function closeSubmenus(){submenus.forEach(function(el){el.removeAttribute('open');});}
  function closeNav(restore){
    if(!nav||!btn)return;
    nav.classList.remove('open');
    document.documentElement.classList.remove('nav-open');
    btn.setAttribute('aria-expanded','false');
    closeSubmenus();
    if(restore)btn.focus();
  }
  if(nav&&btn){
    btn.addEventListener('click',function(){
      var open=!nav.classList.contains('open');
      nav.classList.toggle('open',open);
      document.documentElement.classList.toggle('nav-open',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      if(!open)closeSubmenus();
    });
    nav.addEventListener('click',function(event){
      if(event.target.closest('.nav-links a,.lang-switch a'))closeNav(false);
    });
  }
  document.addEventListener('click',function(event){
    if(nav&&btn&&nav.classList.contains('open')&&!nav.contains(event.target))closeNav(false);
  });
  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'&&nav&&nav.classList.contains('open'))closeNav(true);
  });

  var footerMedia=window.matchMedia('(min-width:681px)');
  var footerAccordions=Array.prototype.slice.call(document.querySelectorAll('details.footer-accordion'));
  function syncFooter(event){
    var desktop=event&&typeof event.matches==='boolean'?event.matches:footerMedia.matches;
    footerAccordions.forEach(function(el){el.open=desktop;});
  }
  if(footerAccordions.length){
    syncFooter();
    if(footerMedia.addEventListener)footerMedia.addEventListener('change',syncFooter);
    else if(footerMedia.addListener)footerMedia.addListener(syncFooter);
  }

  /* Mobile gets finished content immediately; desktop retains lightweight reveal. */
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var compact=window.matchMedia('(max-width:680px)').matches;
  if(!compact&&!reduce&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target);}});
    },{threshold:0.12});
    var reveal=Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var idx=0;
    function batch(){
      var end=Math.min(idx+8,reveal.length);
      while(idx<end){io.observe(reveal[idx]);idx+=1;}
      if(idx<reveal.length)requestAnimationFrame(batch);
    }
    if(reveal.length)requestAnimationFrame(batch);
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  }

  /* Consent + optional reviews. No analytics or external review script before explicit consent. */
  var KEY='banhalmi_consent_v3';
  var VERSION='3.0';
  var TTL=180*24*60*60*1000;
  var bar=document.querySelector('.cookie');
  var reviewDetails=null;
  var reviewArmed=false;
  var reviewLoading=false;
  function readChoice(){
    try{
      var raw=localStorage.getItem(KEY);
      if(!raw)return null;
      var data=JSON.parse(raw);
      if(!data||data.version!==VERSION||!data.savedAt||Date.now()-data.savedAt>TTL){localStorage.removeItem(KEY);return null;}
      return data.choice;
    }catch(e){return null;}
  }
  function saveChoice(choice){try{localStorage.setItem(KEY,JSON.stringify({choice:choice,version:VERSION,savedAt:Date.now(),expiresAt:Date.now()+TTL}));}catch(e){}}
  function hasScript(fragment){return Array.prototype.some.call(document.scripts,function(s){return String(s.src||'').indexOf(fragment)!==-1;});}
  function reviewTarget(){return document.querySelector('[data-third-party-reviews="true"]');}
  function copy(){
    var lang=String(document.documentElement.lang||'en').toLowerCase();
    if(lang.indexOf('hu')===0)return{note:'A Google-vélemények külső szolgáltatáson keresztül töltődnek be. A megjelenítéshez fogadja el az opcionális szolgáltatásokat.',button:'Süti-beállítások megnyitása',loading:'Az ügyfélvélemények betöltése…'};
    if(lang.indexOf('de')===0)return{note:'Google-Bewertungen werden über einen externen Dienst geladen. Bitte akzeptieren Sie optionale Dienste, um sie anzuzeigen.',button:'Cookie-Einstellungen öffnen',loading:'Kundenstimmen werden geladen…'};
    return{note:'Google reviews are loaded through an external service. Please accept optional services to display them.',button:'Open cookie settings',loading:'Loading client reviews…'};
  }
  function openSettings(){if(!bar)return;bar.classList.add('show');var first=bar.querySelector('button');if(first)first.focus({preventScroll:true});}
  function showReviewNote(details){
    if(!details||details.querySelector('.reviews-consent-note'))return;
    var c=copy(),widget=details.querySelector('[class*="elfsight-app-"]'),note=document.createElement('div');
    note.className='reviews-consent-note';note.setAttribute('role','status');
    var p=document.createElement('p');p.textContent=c.note;
    var b=document.createElement('button');b.type='button';b.className='btn btn-ghost';b.textContent=c.button;b.addEventListener('click',openSettings);
    note.appendChild(p);note.appendChild(b);if(widget)details.insertBefore(note,widget);else details.appendChild(note);
  }
  function loadReviews(){
    if(reviewLoading||readChoice()!=='all'||!reviewDetails||!reviewDetails.open)return;
    reviewLoading=true;
    var note=reviewDetails.querySelector('.reviews-consent-note');if(note)note.remove();
    var widget=reviewDetails.querySelector('[class*="elfsight-app-"]');
    if(widget){widget.setAttribute('aria-busy','true');widget.setAttribute('data-loading-label',copy().loading);}
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      if(!hasScript('cdn.trustindex.io/assets/js/richsnippet.js')){
        var ti=document.createElement('script');ti.id='trustindex-richsnippet';ti.async=true;ti.defer=true;ti.src='https://cdn.trustindex.io/assets/js/richsnippet.js?c307c9433572g62e';document.head.appendChild(ti);
      }
      if(widget&&!hasScript('elfsightcdn.com/platform.js')){
        var ef=document.createElement('script');ef.id='elfsight-platform';ef.async=true;ef.defer=true;ef.src='https://elfsightcdn.com/platform.js';
        ef.addEventListener('load',function(){widget.removeAttribute('aria-busy');});
        ef.addEventListener('error',function(){reviewLoading=false;widget.removeAttribute('aria-busy');});
        document.head.appendChild(ef);
      }else if(widget){widget.removeAttribute('aria-busy');}
    });});
  }
  function armReviews(){
    if(reviewArmed)return;
    var target=reviewTarget();if(!target){reviewArmed=true;return;}
    reviewDetails=target.matches('details')?target:(target.querySelector('details.review-drawer')||target.querySelector('details'));
    reviewArmed=true;
    if(!reviewDetails)return;
    reviewDetails.addEventListener('toggle',function(){
      if(!reviewDetails.open)return;
      if(readChoice()==='all')loadReviews();else{showReviewNote(reviewDetails);openSettings();}
    });
  }
  function grant(){
    if(window.BANHALMI_ANALYTICS&&typeof window.BANHALMI_ANALYTICS.grant==='function')window.BANHALMI_ANALYTICS.grant();
    armReviews();if(reviewDetails&&reviewDetails.open)loadReviews();
  }
  function revoke(){
    if(window.BANHALMI_ANALYTICS&&typeof window.BANHALMI_ANALYTICS.revoke==='function')window.BANHALMI_ANALYTICS.revoke();
    reviewLoading=false;
    ['trustindex-richsnippet','elfsight-platform'].forEach(function(id){var el=document.getElementById(id);if(el)el.remove();});
    document.querySelectorAll('iframe[src*="trustindex"],iframe[src*="elfsight"],script[src*="trustindex"],script[src*="elfsight"]').forEach(function(el){el.remove();});
  }
  armReviews();
  if(bar){
    var initial=readChoice();
    if(!initial)bar.classList.add('show');else if(initial==='all')grant();
    var accept=bar.querySelector('[data-accept]'),decline=bar.querySelector('[data-decline]');
    if(accept)accept.addEventListener('click',function(){saveChoice('all');bar.classList.remove('show');grant();});
    if(decline)decline.addEventListener('click',function(){var wasAll=readChoice()==='all';saveChoice('essential');revoke();bar.classList.remove('show');if(wasAll)location.reload();});
  }
  document.addEventListener('click',function(event){var trigger=event.target.closest('[data-cookie-settings]');if(trigger){event.preventDefault();openSettings();}});

  /* Desktop-only hero motion. Mobile/coarse/reduced-motion never hydrates video sources. */
  var fineHover=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(fineHover&&!reduce){
    var figure=document.querySelector('.hero.hero-image-first .hero-figure');
    var video=figure&&figure.querySelector('.hero-video');
    if(video){
      var bound=false;
      function bind(){
        if(bound)return;
        video.querySelectorAll('source[data-src]').forEach(function(source){source.src=source.getAttribute('data-src');source.removeAttribute('data-src');});
        bound=true;video.load();
      }
      function play(){bind();if(video.readyState>0){try{video.currentTime=0;}catch(e){}}var p=video.play();if(p&&p.catch)p.catch(function(){});}
      function stop(){video.pause();}
      figure.addEventListener('mouseenter',play,{passive:true,once:false});
      figure.addEventListener('mouseleave',stop,{passive:true});
    }
  }
})();
