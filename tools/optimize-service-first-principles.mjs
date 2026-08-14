import fs from 'node:fs';
import path from 'node:path';

export function optimizeServicePages(rootInput='_site') {
  const root=path.resolve(rootInput);
  if(!fs.existsSync(path.join(root,'portrait/index.html'))){
    console.log('Service first-principles optimization skipped: no complete site artifact detected.');
    return;
  }
  const commercial={
    'portrait/index.html':'en','lifestyle/index.html':'en','event-photography/index.html':'en',
    'hu/portre/index.html':'hu','hu/brand/index.html':'hu','hu/rendezvenyfotozas/index.html':'hu',
    'de-at/portrait/index.html':'de','de-at/brand/index.html':'de','de-at/eventfotografie/index.html':'de'
  };
  const copy={
    en:{title:'Project framework',summary:'Fees, delivery, rights and privacy',pricing:['What does the project fee cover?','The accepted written offer defines preparation, photography, selection, retouching, the final fee and any travel or production cost. Vienna and Budapest on-site work is included; other locations are agreed in advance.'],delivery:['What arrives, and when?','The written offer records the preview, selection and final-delivery deadlines and the agreed final formats, so timing and outputs are clear before production.'],rights:['How are approvals, privacy and image use handled?','One authorised approver consolidates feedback. Unreleased material stays confidential by default. Client usage follows the agreed licence, and BANHALMI does not publish client work as a reference without permission.'],booking:['How do booking and rescheduling work?','A date is reserved after written acceptance and any agreed booking payment. Changes, cancellation terms and documented external costs are handled according to the accepted offer.'],links:['Read the full terms','Privacy & data handling']},
    hu:{title:'Projektkeretek',summary:'Díjazás, átadás, jogok és adatvédelem',pricing:['Mit tartalmaz a projekt díja?','Az elfogadott írásos ajánlat rögzíti az előkészítést, fotózást, válogatást, retust, a végleges díjat és az esetleges utazási vagy gyártási költséget. A bécsi és budapesti helyszíni munka benne van; más helyszínt előre egyeztetünk.'],delivery:['Mit kap kézhez az ügyfél, és mikor?','Az írásos ajánlat tartalmazza az előnézet, a válogatás és a végleges átadás határidejét, valamint a kért fájlformátumokat, így az ütemezés és az eredmény már a gyártás előtt egyértelmű.'],rights:['Hogyan kezeljük a jóváhagyást, adatvédelmet és képhasználatot?','Egy kijelölt jóváhagyó fogja össze a visszajelzést. A még nem publikált anyag alapértelmezetten bizalmas. Az ügyfél képhasználatát a megállapodott licenc szabályozza, a BANHALMI pedig engedély nélkül nem teszi közzé referenciaként az ügyfélanyagokat.'],booking:['Hogyan működik a foglalás és az átütemezés?','Az időpont az írásos elfogadás és az esetlegesen egyeztetett foglalási díj után válik véglegessé. Az időpontváltozás, lemondási feltételek és igazolt külső költségek az elfogadott ajánlat szerint kezelhetők.'],links:['Teljes szerződéses feltételek','Adatvédelem és adatkezelés']},
    de:{title:'Projektrahmen',summary:'Honorar, Lieferung, Rechte und Datenschutz',pricing:['Was umfasst das Projekthonorar?','Das angenommene schriftliche Angebot definiert Vorbereitung, Fotografie, Auswahl, Retusche, das finale Honorar sowie mögliche Reise- oder Produktionskosten. Einsätze in Wien und Budapest sind enthalten; andere Orte werden vorab vereinbart.'],delivery:['Was wird geliefert und wann?','Das schriftliche Angebot hält Vorschau-, Auswahl- und finale Liefertermine sowie die vereinbarten Dateiformate fest. Damit sind Zeitplan und Ergebnis vor Produktionsbeginn klar.'],rights:['Wie werden Freigabe, Datenschutz und Bildnutzung geregelt?','Eine autorisierte Person bündelt das Feedback. Unveröffentlichtes Material bleibt grundsätzlich vertraulich. Die Nutzung durch den Kunden folgt der vereinbarten Lizenz; BANHALMI veröffentlicht Kundenarbeiten nicht ohne Erlaubnis als Referenz.'],booking:['Wie funktionieren Buchung und Terminänderungen?','Ein Termin ist nach schriftlicher Annahme und einer gegebenenfalls vereinbarten Buchungszahlung reserviert. Änderungen, Stornobedingungen und belegte externe Kosten richten sich nach dem angenommenen Angebot.'],links:['Vollständige Vertragsbedingungen','Datenschutz & Datenverarbeitung']}
  };
  const routes={en:['/terms-conditions/','/privacy-policy/'],hu:['/hu/altalanos-szerzodesi-feltetelek/','/hu/adatvedelem/'],de:['/de-at/agb/','/de-at/datenschutz/']};

  const replaceFramework=(html,lang,rel)=>{
    const re=/<details class="project-framework-drawer" data-project-framework="stage20">[\s\S]*?<\/details>/;
    if(!re.test(html)) throw new Error(`${rel}: Stage20 project framework drawer missing`);
    const c=copy[lang],r=routes[lang];
    const block=`<details class="project-framework-drawer service-framework-compact" data-project-framework="stage20"><summary><span><strong>${c.title}</strong><small>${c.summary}</small></span><span aria-hidden="true">+</span></summary><div class="project-framework-content"><section class="section-band" data-pricing-licensing="stage7"><h2>${c.pricing[0]}</h2><p>${c.pricing[1]}</p></section><section class="section-band" data-delivery-system="stage9"><h2>${c.delivery[0]}</h2><p>${c.delivery[1]}</p></section><section class="section-band" data-data-retention="stage12" data-image-rights="stage13" data-governance-confidentiality="stage10"><h2>${c.rights[0]}</h2><p>${c.rights[1]}</p></section><section class="section-band" data-booking-contingency="stage11"><h2>${c.booking[0]}</h2><p>${c.booking[1]}</p><p class="service-framework-links"><a href="${r[0]}">${c.links[0]}</a> · <a href="${r[1]}">${c.links[1]}</a></p></section></div></details>`;
    return html.replace(re,block);
  };
  const removePartnership=(html,rel)=>{
    const re=/<section class="section-band partnership-deliverables"[^>]*data-strategic-partnership="concrete"[^>]*>[\s\S]*?<\/section>/;
    if(!re.test(html)) throw new Error(`${rel}: concrete partnership section missing before first-principles simplification`);
    return html.replace(re,'');
  };
  const eventPrivate={
    'event-photography/index.html':'Private and family occasions',
    'hu/rendezvenyfotozas/index.html':'Privát és családi alkalmak',
    'de-at/eventfotografie/index.html':'Private und familiäre Anlässe'
  };

  let changed=0,removedPartnerships=0,compactFrameworks=0,removedPrivate=0;
  for(const [rel,lang] of Object.entries(commercial)){
    const file=path.join(root,rel);if(!fs.existsSync(file))throw new Error(`${rel}: production service page missing`);
    let html=fs.readFileSync(file,'utf8'),before=html;
    html=removePartnership(html,rel);removedPartnerships++;
    html=replaceFramework(html,lang,rel);compactFrameworks++;
    if(eventPrivate[rel]){
      const phrase=eventPrivate[rel].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const re=new RegExp(`<li>\\s*${phrase}\\s*</li>`,'i');
      if(!re.test(html))throw new Error(`${rel}: private/family event item missing before C-level focus cleanup`);
      html=html.replace(re,'');removedPrivate++;
    }
    if(html.includes('data-strategic-partnership="concrete"'))throw new Error(`${rel}: duplicate six-step partnership block survived production simplification`);
    if((html.match(/data-project-framework="stage20"/g)||[]).length!==1)throw new Error(`${rel}: compact framework count is not one`);
    for(const marker of ['data-pricing-licensing="stage7"','data-delivery-system="stage9"','data-data-retention="stage12"','data-image-rights="stage13"','data-governance-confidentiality="stage10"','data-booking-contingency="stage11"'])if((html.split(marker).length-1)!==1)throw new Error(`${rel}: compact framework lost ${marker}`);
    if(before!==html){fs.writeFileSync(file,html);changed++;}
  }
  if(changed!==9||removedPartnerships!==9||compactFrameworks!==9||removedPrivate!==3)throw new Error(`service simplification coverage mismatch changed=${changed} partnership=${removedPartnerships} frameworks=${compactFrameworks} private=${removedPrivate}`);
  console.log(`Stage77 service first-principles artifact optimization passed: ${changed} commercial service pages simplified, ${removedPartnerships} duplicate six-step partnership sections removed, ${compactFrameworks} legal/governance drawers compressed to four decision questions, ${removedPrivate} private/family event items removed from the C-level service.`);
}

if(import.meta.url===new URL(`file://${process.argv[1]}`).href) optimizeServicePages(process.argv[2]||'_site');
