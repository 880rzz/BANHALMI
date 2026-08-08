/* BANHALMI mega menu loader — keep the full menu out of the startup critical path. */
(function(){'use strict';
var loading=false,loaded=false;
function findButton(){var header=document.querySelector('.site-header');var nav=header&&header.querySelector('.nav');return nav&&nav.querySelector('.menu-btn');}
function arm(){var btn=findButton();if(!btn||btn.dataset.megaLoaderArmed==='true')return;btn.dataset.megaLoaderArmed='true';var first=function(e){
  if(loaded)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(loading)return;
  loading=true;
  var s=document.createElement('script');
  s.src='/assets/js/mega-menu-full.js?v=20260809-lazy-v1';
  s.async=true;
  s.addEventListener('load',function(){
    loaded=true;loading=false;
    btn.removeEventListener('click',first,true);
    window.requestAnimationFrame(function(){btn.click();});
  },{once:true});
  s.addEventListener('error',function(){loading=false;},{once:true});
  document.head.appendChild(s);
};
btn.addEventListener('click',first,true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arm,{once:true});else arm();
})();
