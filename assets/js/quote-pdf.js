/* BANHALMI client-side PDF offer generator — premium localized customer copy. */
(function(){
  "use strict";
  var I18N={
    en:{title:'BANHALMI orientation offer',subtitle:'Prepared from your brief details',created:'Created',total:'Estimated total',subtotal:'Calculated subtotal',net:'Net',vat:'VAT',tax:'Tax mode',service:'Service',package:'Package',duration:'Duration',people:'People',photographers:'Photographers',retouched:'Retouched images',location:'Location',travelCountry:'Travel country',date:'Preferred date',budget:'Budget',addons:'Add-ons',client:'Client',customerType:'Customer type',billingCountry:'Billing country',company:'Company',email:'Email',phone:'Phone',vatid:'VAT ID',message:'Project note',basis:'Calculation basis',none:'None selected',taxVat:'20% Austrian VAT',taxReverse:'20% VAT included; 0% only after legal and VAT-ID verification',disclaimer:'This PDF is a non-binding orientation estimate. The final written offer is confirmed after the brief, location, usage rights, timing, production complexity and tax status have been reviewed.',footer:'BANHALMI · Executive portraits, brand photography and fine art work · Vienna / Budapest · hello@norbertbanhalmi.com',filename:'banhalmi-orientation-offer'},
    de:{title:'BANHALMI Orientierungsangebot',subtitle:'Aus Ihren Angaben vorbereitet',created:'Erstellt',total:'Geschätzte Summe',subtotal:'Berechnete Zwischensumme',net:'Netto',vat:'USt.',tax:'Steuerlogik',service:'Leistung',package:'Paket',duration:'Dauer',people:'Personen',photographers:'Fotografen',retouched:'Retuschierte Bilder',location:'Ort',travelCountry:'Reiseland',date:'Wunschtermin',budget:'Budget',addons:'Zusatzleistungen',client:'Kunde',customerType:'Kundentyp',billingCountry:'Rechnungsland',company:'Unternehmen',email:'E-Mail',phone:'Telefon',vatid:'UID',message:'Projektnotiz',basis:'Berechnungsgrundlage',none:'Keine ausgewählt',taxVat:'20% österreichische Umsatzsteuer',taxReverse:'20% USt. enthalten; 0% erst nach rechtlicher und UID-Prüfung',disclaimer:'Dieses PDF ist eine unverbindliche Orientierungsschätzung. Das finale schriftliche Angebot wird nach Prüfung von Briefing, Ort, Nutzungsrechten, Timing, Produktionsaufwand und Steuerstatus bestätigt.',footer:'BANHALMI · Executive Portraits, Brand-Fotografie und künstlerische Fotografie · Wien / Budapest · hello@norbertbanhalmi.com',filename:'banhalmi-orientierungsangebot'},
    hu:{title:'BANHALMI tájékoztató ajánlat',subtitle:'Az Ön adatai alapján előkészítve',created:'Készült',total:'Becsült végösszeg',subtotal:'Kalkulált részösszeg',net:'Nettó',vat:'ÁFA',tax:'Adózási mód',service:'Szolgáltatás',package:'Csomag',duration:'Időtartam',people:'Létszám',photographers:'Fotósok',retouched:'Retusált képek',location:'Helyszín',travelCountry:'Utazási ország',date:'Időpont',budget:'Költségkeret',addons:'Kiegészítők',client:'Ügyfél',customerType:'Ügyféltípus',billingCountry:'Számlázási ország',company:'Cég',email:'E-mail',phone:'Telefon',vatid:'EU adószám',message:'Projektleírás',basis:'Számítás alapja',none:'Nincs kiválasztva',taxVat:'20% osztrák ÁFA',taxReverse:'20% ÁFA szerepel; 0% csak jogszabályi és adószám-ellenőrzés után',disclaimer:'Ez a PDF nem kötelező érvényű tájékoztató becslés. A végleges írásos ajánlat a brief, a helyszín, a felhasználási jogok, az időzítés, a produkciós összetettség és az adózási státusz ellenőrzése után erősíthető meg.',footer:'BANHALMI · Executive portré, brand fotózás és művészi fotográfia · Bécs / Budapest · hello@norbertbanhalmi.com',filename:'banhalmi-tajekoztato-ajanlat'}
  };
  var DUR={
    en:{headshotcv:'10 minutes',quick30:'30 minutes',guided60:'1 hour',guided120:'2 hours',brand60:'1 hour',brand120:'2 hours',brand180:'3 hours',brand240:'4 hours',event60:'1 hour',event120:'2 hours',event180:'3 hours',event240:'4 hours',eventFullDay:'full day, up to 8 hours',art60:'1 hour',art120:'2 hours',art180:'3 hours',group:'from 1 hour, depending on team size'},
    de:{headshotcv:'10 Minuten',quick30:'30 Minuten',guided60:'1 Stunde',guided120:'2 Stunden',brand60:'1 Stunde',brand120:'2 Stunden',brand180:'3 Stunden',brand240:'4 Stunden',event60:'1 Stunde',event120:'2 Stunden',event180:'3 Stunden',event240:'4 Stunden',eventFullDay:'ganzer Tag, bis zu 8 Stunden',art60:'1 Stunde',art120:'2 Stunden',art180:'3 Stunden',group:'ab 1 Stunde, abhängig von der Teamgröße'},
    hu:{headshotcv:'10 perc',quick30:'30 perc',guided60:'1 óra',guided120:'2 óra',brand60:'1 óra',brand120:'2 óra',brand180:'3 óra',brand240:'4 óra',event60:'1 óra',event120:'2 óra',event180:'3 óra',event240:'4 óra',eventFullDay:'egész nap, legfeljebb 8 óra',art60:'1 óra',art120:'2 óra',art180:'3 óra',group:'1 órától, a csapat méretétől függően'}
  };
  var CAT={
    en:{individual:'Individual portrait',group:'Group portraits',brand:'Brand photography',art:'Fine art work',event:'C-level event photography'},
    de:{individual:'Einzelporträt',group:'Gruppenporträts',brand:'Brand-Fotografie',art:'Fine-Art-Fotografie',event:'C-Level-Eventfotografie'},
    hu:{individual:'Egyéni portré',group:'Csoportos portré',brand:'Brand fotózás',art:'Művészi fotózás',event:'C-level eseményfotózás'}
  };
  function radioValue(form,name){ var el=form.querySelector('[name="'+name+'"]:checked'); return el?el.value:''; }
  function cleanLabel(label){ if(!label)return ''; var clone=label.cloneNode(true); clone.querySelectorAll('.info-tip,[data-tooltip]').forEach(function(node){node.remove();}); return (clone.textContent||'').replace(/\s+/g,' ').trim(); }
  function checkedValues(form,name){ return Array.prototype.slice.call(form.querySelectorAll('[name="'+name+'"]:checked')).map(function(el){ return el.value; }); }
  function selectedLabel(form,name){ var r=form.querySelector('[name="'+name+'"]:checked'); if(r && r.closest('label')) return cleanLabel(r.closest('label')); var sel=form.querySelector('select[name="'+name+'"]'); if(sel && sel.selectedIndex>=0) return sel.options[sel.selectedIndex].text.replace(/\s+/g,' ').trim(); return ''; }
  function field(form,name){ var input=form.querySelector('[name="'+name+'"]'); return input? String(input.value || '').trim(): ''; }
  function langOf(form){ var raw=(form.getAttribute('data-lang')||document.documentElement.lang||'en').toLowerCase(); return raw.indexOf('hu')===0?'hu':raw.indexOf('de')===0?'de':'en'; }
  function durationKey(form,cat){ return cat==='individual'?radioValue(form,'individual_mode'):cat==='brand'?radioValue(form,'brand_duration'):cat==='event'?radioValue(form,'event_duration'):cat==='art'?field(form,'art_duration'):''; }
  function packageDuration(form,cat,lang){ if(cat==='group'){ var gh=field(form,'group_hours')||'1'; return gh+' '+(lang==='hu'?'óra':lang==='de'?'Stunde(n)':'hour(s)'); } return (DUR[lang] && DUR[lang][durationKey(form,cat)]) || ''; }
  function categoryLabel(code,lang){ return (CAT[lang] && CAT[lang][code]) || code || ''; }
  function packageLabel(form,cat){ if(cat==='individual') return selectedLabel(form,'individual_mode'); if(cat==='group') return ({hu:'Minőségi csoportos portré',de:'Qualitatives Gruppenporträt',en:'Quality group portrait'})[langOf(form)] || 'Quality group portrait'; if(cat==='brand') return selectedLabel(form,'brand_duration'); if(cat==='art') return [selectedLabel(form,'art_type'), selectedLabel(form,'art_duration')].filter(Boolean).join(' — '); if(cat==='event') return selectedLabel(form,'event_duration'); return ''; }

  function addonLabel(code,lang){
    var map={en:{mobile:'Mobile studio',instantretouch:'Immediate on-site retouching',stylist:'Stylist',hair:'Hair stylist',makeup:'Make-up artist',express:'Express delivery',artdirection:'Art direction'},hu:{mobile:'Mobil stúdió',instantretouch:'Azonnali helyszíni retusálás',stylist:'Stylist',hair:'Fodrász',makeup:'Sminkes',express:'Expressz átadás',artdirection:'Művészeti irányítás'},de:{mobile:'Mobiles Studio',instantretouch:'Sofortige Retusche vor Ort',stylist:'Styling',hair:'Hair-Styling',makeup:'Make-up',express:'Expresslieferung',artdirection:'Art Direction'}};
    return (map[lang]&&map[lang][code])||code;
  }
  function photographers(form,cat){ var api=window.BANHALMI_QUOTE, e=api&&api.calculate?api.calculate(form):null; return e?String(e.photographerCount||1):'1'; }
  function taxLabel(mode,lang){ var l=I18N[lang]||I18N.en; return String(mode||'').indexOf('potential-zero')>=0?l.taxReverse:l.taxVat; }
  function basisText(form,cat,lang){
    var l=I18N[lang]||I18N.en, svc=categoryLabel(cat,lang), dur=packageDuration(form,cat,lang), ph=photographers(form,cat)||'1', ret=field(form,'retouched_images')||'1';
    if(lang==='de') return [svc, dur, ph+' Fotograf'+(ph==='1'?'':'en'), ret+' retuschierte'+(ret==='1'?'s Bild':' Bilder')].filter(Boolean).join(', ');
    if(lang==='hu') return [svc, dur, ph+' fotós', ret+' retusált kép'].filter(Boolean).join(', ');
    return [svc, dur, ph+' photographer'+(ph==='1'?'':'s'), ret+' retouched image'+(ret==='1'?'':'s')].filter(Boolean).join(', ');
  }
  function collect(form){
    var api=window.BANHALMI_QUOTE;
    var estimate=api && typeof api.paint==='function'? api.paint(form): api && typeof api.calculate==='function'? api.calculate(form): null;
    var lang=langOf(form), l=I18N[lang]||I18N.en, cat=radioValue(form,'category')||'individual', rows=[];
    function add(label,value){ if(value && String(value).trim()) rows.push([label, String(value).replace(/\s+([,.;:!?])/g,'$1').trim()]); }
    add(l.service, categoryLabel(cat,lang));
    add(l.package, packageLabel(form,cat));
    add(l.duration, packageDuration(form,cat,lang));
    if(cat==='group') add(l.people, field(form,'people_count'));
    if(cat==='brand') add(l.people, field(form,'brand_people_count'));
    if(cat==='event') add(l.people, field(form,'event_guest_count'));
    add(l.photographers, photographers(form,cat));
    var estimateForRows=estimate||{};
    var perPerson=field(form,'retouched_images')||'1';
    var totalRetouched=estimateForRows.retouchedImagesTotal||perPerson;
    var retouchedText=(cat==='group'||cat==='brand')?(perPerson+' '+(lang==='hu'?'kép / fő, összesen ':lang==='de'?'Bilder / Person, insgesamt ':'images / person, total ')+totalRetouched):(cat==='event'?(perPerson+' '+(lang==='hu'?'becsült átadott kép':lang==='de'?'voraussichtlich gelieferte Bilder':'estimated delivered images')):perPerson);
    add(l.retouched, retouchedText);
    var locationLabel=selectedLabel(form,'location'), exactLocation=field(form,'specific_location');
    add(l.location, exactLocation?[locationLabel,exactLocation].filter(Boolean).join(' — '):locationLabel);
    var travelCountryCode=field(form,'travel_country');
    if(exactLocation && travelCountryCode) add(l.travelCountry, selectedLabel(form,'travel_country'));
    add(l.date, [1,2,3].map(function(i){var d=field(form,'preferred_date_'+i),t=selectedLabel(form,'preferred_daypart_'+i);return d?{date:d,label:d+' ('+(t||'')+')'}:null;}).filter(Boolean).sort(function(a,b){return a.date.localeCompare(b.date);}).map(function(x){return x.label;}).join(', ') || (form.querySelector('[name="date_coordination_requested"]:checked')?(lang==='hu'?'Egyeztetést kérek':lang==='de'?'Terminabstimmung gewünscht':'Please coordinate the date'):''));
    add(l.budget, field(form,'budget'));
    var addons=checkedValues(form,'addons').map(function(code){return addonLabel(code,lang);}).join(', '); add(l.addons, addons || l.none);
    add(l.client, field(form,'name'));
    var customerTypeCode=field(form,'customer_type');
    add(l.customerType, selectedLabel(form,'customer_type'));
    add(l.billingCountry, selectedLabel(form,'billing_country'));
    if(customerTypeCode==='business') add(l.company, field(form,'company'));
    add(l.email, field(form,'email'));
    add(l.phone, field(form,'phone'));
    if(customerTypeCode==='business') add(l.vatid, field(form,'vat_id'));
    add(l.message, field(form,'message'));
    add(l.basis, estimate&&estimate.parts?estimate.parts:basisText(form,cat,lang));
    var mode=estimate?estimate.vatMode:field(form,'estimate_vat_mode')||'';
    if(estimate&&estimate.customTravel) add(l.basis, lang==='hu'?'Részösszeg: a nemzetközi utazás és logisztika nincs benne.':lang==='de'?'Zwischensumme: internationale Reise und Logistik sind nicht enthalten.':'Subtotal: international travel and logistics are excluded.');
    return {lang:lang,l:l,rows:rows,isSubtotal:!!(estimate&&estimate.customTravel),net:estimate?estimate.net:field(form,'estimate_net')||'0',vat:estimate?estimate.vat:field(form,'estimate_vat')||'0',gross:estimate?estimate.gross:field(form,'estimate_gross')||'0',tax:taxLabel(mode,lang),date:new Date().toLocaleDateString(lang==='hu'?'hu-HU':lang==='de'?'de-AT':'en-GB')};
  }
  function eur(v){ var n=Number(String(v==null?'':v).replace(',', '.')); if(!Number.isFinite(n)) n=0; return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(n); }
  function wrap(ctx,text,maxWidth){ text=String(text||''); var words=text.split(/\s+/), lines=[], line=''; words.forEach(function(w){ var t=line?line+' '+w:w; if(ctx.measureText(t).width>maxWidth && line){ lines.push(line); line=w; } else { line=t; } }); if(line) lines.push(line); return lines; }
  function pdfEscapeName(s){ return String(s||'quote').toLowerCase().replace(/[^a-z0-9\-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,''); }
  function renderCanvases(data){
    var W=1240,H=1754,M=112,pages=[],ctx,y,labelW=450,rowFont=21,rowLine=38,rowGap=30;
    function newPage(){ var canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H; ctx=canvas.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H); ctx.textBaseline='top'; y=M; pages.push(canvas); ctx.fillStyle='#111'; ctx.font='700 40px Arial, Helvetica, sans-serif'; ctx.fillText('BANHALMI',M,y); y+=60; ctx.font='700 30px Arial, Helvetica, sans-serif'; wrap(ctx,data.l.title,W-2*M).slice(0,2).forEach(function(line){ ctx.fillText(line,M,y); y+=38; }); ctx.font='400 21px Arial, Helvetica, sans-serif'; ctx.fillStyle='#606060'; ctx.fillText(data.l.subtitle+' — '+data.l.created+': '+data.date,M,y); y+=66; ctx.strokeStyle='#dedede'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(M,y); ctx.lineTo(W-M,y); ctx.stroke(); y+=42; ctx.fillStyle='#111'; }
    function footer(){ ctx.font='400 17px Arial, Helvetica, sans-serif'; ctx.fillStyle='#686868'; var lines=wrap(ctx,data.l.footer,W-2*M); var yy=H-M-46; lines.slice(0,2).forEach(function(line){ ctx.fillText(line,M,yy); yy+=24; }); ctx.fillStyle='#111'; }
    function ensure(h){ if(y+h>H-M-96){ footer(); newPage(); } }
    function drawRow(label,value){ ctx.font='700 '+rowFont+'px Arial, Helvetica, sans-serif'; var lLines=wrap(ctx,label,labelW-34); ctx.font='400 '+rowFont+'px Arial, Helvetica, sans-serif'; var vLines=wrap(ctx,value,W-2*M-labelW); var h=Math.max(lLines.length*rowLine,vLines.length*rowLine)+rowGap; ensure(h+4); ctx.font='700 '+rowFont+'px Arial, Helvetica, sans-serif'; ctx.fillStyle='#111'; lLines.forEach(function(line,i){ ctx.fillText(line,M,y+i*rowLine); }); ctx.font='400 '+rowFont+'px Arial, Helvetica, sans-serif'; ctx.fillStyle='#222'; vLines.forEach(function(line,i){ ctx.fillText(line,M+labelW,y+i*rowLine); }); y+=h; }
    newPage(); var cardH=190; ctx.fillStyle='#f6f6f4'; ctx.fillRect(M,y,W-2*M,cardH); ctx.fillStyle='#111'; ctx.font='700 25px Arial, Helvetica, sans-serif'; ctx.fillText(data.isSubtotal?(data.l.subtotal||data.l.total):data.l.total,M+32,y+32); ctx.font='700 56px Arial, Helvetica, sans-serif'; ctx.fillText(eur(data.gross),M+32,y+84); ctx.font='400 21px Arial, Helvetica, sans-serif'; ctx.fillStyle='#555'; var taxText=data.l.net+': '+eur(data.net)+'    '+data.l.vat+': '+eur(data.vat)+'    '+data.l.tax+': '+data.tax; wrap(ctx,taxText,W-2*M-510).slice(0,4).forEach(function(line,i){ ctx.fillText(line,M+520,y+70+i*31); }); y+=cardH+58; data.rows.forEach(function(r){ drawRow(r[0],r[1]); }); ensure(210); y+=26; ctx.strokeStyle='#dedede'; ctx.beginPath(); ctx.moveTo(M,y); ctx.lineTo(W-M,y); ctx.stroke(); y+=38; ctx.font='400 22px Arial, Helvetica, sans-serif'; ctx.fillStyle='#555'; wrap(ctx,data.l.disclaimer,W-2*M).forEach(function(line){ ctx.fillText(line,M,y); y+=34; }); footer(); return pages;
  }
  function bytesFromText(text){ return new TextEncoder().encode(text); }
  function dataUrlToBytes(url){ var raw=atob(url.split(',')[1]); var a=new Uint8Array(raw.length); for(var i=0;i<raw.length;i++) a[i]=raw.charCodeAt(i); return a; }
  function makePdf(canvases){ var chunks=[],offset=0,offsets=[]; function addText(t){ var b=bytesFromText(t); chunks.push(b); offset+=b.length; } function addBytes(b){ chunks.push(b); offset+=b.length; } function obj(id,body,bytes){ offsets[id]=offset; addText(id+' 0 obj\n'+body); if(bytes){ addBytes(bytes); addText('\nendstream\nendobj\n'); } else { addText('endobj\n'); } } addText('%PDF-1.3\n%\xE2\xE3\xCF\xD3\n'); var n=canvases.length,kids=[]; for(var i=0;i<n;i++){ kids.push((3+i*3)+' 0 R'); } obj(1,'<< /Type /Catalog /Pages 2 0 R >>\n'); obj(2,'<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+n+' >>\n'); canvases.forEach(function(canvas,i){ var pageObj=3+i*3, contentObj=4+i*3, imageObj=5+i*3, im='Im'+(i+1); var jpeg=dataUrlToBytes(canvas.toDataURL('image/jpeg',0.92)); var content='q\n595.28 0 0 841.89 0 0 cm\n/'+im+' Do\nQ\n'; obj(pageObj,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /'+im+' '+imageObj+' 0 R >> >> /Contents '+contentObj+' 0 R >>\n'); obj(contentObj,'<< /Length '+bytesFromText(content).length+' >>\nstream\n', bytesFromText(content)); obj(imageObj,'<< /Type /XObject /Subtype /Image /Width '+canvas.width+' /Height '+canvas.height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n', jpeg); }); var xref=offset,maxObj=2+n*3; addText('xref\n0 '+(maxObj+1)+'\n0000000000 65535 f \n'); for(var j=1;j<=maxObj;j++){ addText(String(offsets[j]||0).padStart(10,'0')+' 00000 n \n'); } addText('trailer\n<< /Size '+(maxObj+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF'); return new Blob(chunks,{type:'application/pdf'}); }
  function download(blob,filename){ var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click(); window.setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1000); }
  document.addEventListener('click',function(ev){ var btn=ev.target.closest('[data-download-quote-pdf]'); if(!btn) return; ev.preventDefault(); var form=document.querySelector('[data-smart-quote]'); if(!form) return; var api=window.BANHALMI_QUOTE; if(api&&typeof api.isPricingReady==='function'&&!api.isPricingReady()) return; if(api&&typeof api.validate==='function'&&!api.validate(form,true)) return; if(typeof form.checkValidity==='function'&&!form.checkValidity()){if(typeof form.reportValidity==='function')form.reportValidity();return;} var data=collect(form); var pdf=makePdf(renderCanvases(data)); var name=pdfEscapeName(data.l.filename)+'-'+new Date().toISOString().slice(0,10)+'.pdf'; download(pdf,name); });
})();
