import fs from 'node:fs';

const pages=['index.html','hu/index.html','de-at/index.html'];
const analytics='<script defer="" src="/assets/js/analytics.js?v=20260714-ga4"></script>';
const siteConfig='<script defer="" src="/assets/js/site-config.js?v=20260807-type-accent-v50"></script>';
const megaCss='<link data-banhalmi-mega-menu="" href="/assets/css/mega-menu.css?v=20260807-type-accent-v50" media="print" onload="this.media=\'all\'" rel="stylesheet"/><noscript><link href="/assets/css/mega-menu.css?v=20260807-type-accent-v50" rel="stylesheet"/></noscript>';
const megaJs='<script data-banhalmi-mega-menu="" defer="" src="/assets/js/mega-menu.js?v=20260807-type-accent-v50"></script>';
const lazyAnalytics=`<script>(function(){function loadAnalytics(){if(document.getElementById('banhalmi-analytics-runtime'))return;var s=document.createElement('script');s.id='banhalmi-analytics-runtime';s.src='/assets/js/analytics.js?v=20260714-ga4';s.defer=true;document.head.appendChild(s);}function schedule(){if('requestIdleCallback'in window)requestIdleCallback(loadAnalytics,{timeout:2500});else setTimeout(loadAnalytics,1800);}if(document.readyState==='complete')schedule();else window.addEventListener('load',schedule,{once:true});})();</script>`;
for(const page of pages){
  let html=fs.readFileSync(page,'utf8');
  if(!html.includes(analytics)) throw new Error(`${page}: analytics tag not found`);
  if(!html.includes(siteConfig)) throw new Error(`${page}: site-config tag not found`);
  html=html.replace(analytics,'');
  const headClose='</head>';
  if(!html.includes(headClose)) throw new Error(`${page}: head close missing`);
  html=html.replace(headClose,megaCss+headClose);
  html=html.replace(siteConfig,megaJs+lazyAnalytics);
  fs.writeFileSync(page,html);
}
console.log('Homepage PageSpeed migration applied to EN/HU/DE.');
