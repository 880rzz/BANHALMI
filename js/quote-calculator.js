/* BANHALMI guided quote calculator — pricing.json is the canonical machine-readable price source. */
(function(){
  "use strict";
  var VAT = 0.20;
  var EU_COUNTRIES = {
    AT:{prefix:'AT', label:{en:'Austria',hu:'Ausztria',de:'Österreich'}},
    BE:{prefix:'BE', label:{en:'Belgium',hu:'Belgium',de:'Belgien'}},
    BG:{prefix:'BG', label:{en:'Bulgaria',hu:'Bulgária',de:'Bulgarien'}},
    HR:{prefix:'HR', label:{en:'Croatia',hu:'Horvátország',de:'Kroatien'}},
    CY:{prefix:'CY', label:{en:'Cyprus',hu:'Ciprus',de:'Zypern'}},
    CZ:{prefix:'CZ', label:{en:'Czechia',hu:'Csehország',de:'Tschechien'}},
    DK:{prefix:'DK', label:{en:'Denmark',hu:'Dánia',de:'Dänemark'}},
    EE:{prefix:'EE', label:{en:'Estonia',hu:'Észtország',de:'Estland'}},
    FI:{prefix:'FI', label:{en:'Finland',hu:'Finnország',de:'Finnland'}},
    FR:{prefix:'FR', label:{en:'France',hu:'Franciaország',de:'Frankreich'}},
    DE:{prefix:'DE', label:{en:'Germany',hu:'Németország',de:'Deutschland'}},
    GR:{prefix:'EL', label:{en:'Greece',hu:'Görögország',de:'Griechenland'}},
    HU:{prefix:'HU', label:{en:'Hungary',hu:'Magyarország',de:'Ungarn'}},
    IE:{prefix:'IE', label:{en:'Ireland',hu:'Írország',de:'Irland'}},
    IT:{prefix:'IT', label:{en:'Italy',hu:'Olaszország',de:'Italien'}},
    LV:{prefix:'LV', label:{en:'Latvia',hu:'Lettország',de:'Lettland'}},
    LT:{prefix:'LT', label:{en:'Lithuania',hu:'Litvánia',de:'Litauen'}},
    LU:{prefix:'LU', label:{en:'Luxembourg',hu:'Luxemburg',de:'Luxemburg'}},
    MT:{prefix:'MT', label:{en:'Malta',hu:'Málta',de:'Malta'}},
    NL:{prefix:'NL', label:{en:'Netherlands',hu:'Hollandia',de:'Niederlande'}},
    PL:{prefix:'PL', label:{en:'Poland',hu:'Lengyelország',de:'Polen'}},
    PT:{prefix:'PT', label:{en:'Portugal',hu:'Portugália',de:'Portugal'}},
    RO:{prefix:'RO', label:{en:'Romania',hu:'Románia',de:'Rumänien'}},
    SK:{prefix:'SK', label:{en:'Slovakia',hu:'Szlovákia',de:'Slowakei'}},
    SI:{prefix:'SI', label:{en:'Slovenia',hu:'Szlovénia',de:'Slowenien'}},
    ES:{prefix:'ES', label:{en:'Spain',hu:'Spanyolország',de:'Spanien'}},
    SE:{prefix:'SE', label:{en:'Sweden',hu:'Svédország',de:'Schweden'}}
  };
  var VAT_PATTERNS = {
    AT:/^ATU\d{8}$/, BE:/^BE0?\d{9}$/, BG:/^BG\d{9,10}$/, HR:/^HR\d{11}$/,
    CY:/^CY\d{8}[A-Z]$/, CZ:/^CZ\d{8,10}$/, DE:/^DE\d{9}$/, DK:/^DK\d{8}$/,
    EE:/^EE\d{9}$/, EL:/^EL\d{9}$/, ES:/^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
    FI:/^FI\d{8}$/, FR:/^FR[A-HJ-NP-Z0-9]{2}\d{9}$/, HU:/^HU\d{8}$/,
    IE:/^IE(?:\d{7}[A-W][A-I]?|[7-9][A-Z*+]\d{5}[A-W])$/, IT:/^IT\d{11}$/,
    LT:/^LT(?:\d{9}|\d{12})$/, LU:/^LU\d{8}$/, LV:/^LV\d{11}$/,
    MT:/^MT\d{8}$/, NL:/^NL\d{9}B\d{2}$/, PL:/^PL\d{10}$/,
    PT:/^PT\d{9}$/, RO:/^RO\d{2,10}$/, SE:/^SE\d{12}$/,
    SI:/^SI\d{8}$/, SK:/^SK\d{10}$/
  };
  var labels = {
    en:{
      net:'Net',vat:'VAT',gross:'Gross',vat20:'20% Austrian VAT included.',
      reverse:'EU B2B outside Austria: 0% Austrian VAT estimate (reverse charge), subject to VAT ID and place-of-supply validation.',
      customerType:'Customer type',privateClient:'Private client',businessClient:'Business',billingCountry:'Billing country',
      taxHelp:'0% is estimated only for a business established in another EU Member State with a formally valid VAT ID matching that country. Final VAT treatment is confirmed after validation.',
      taxEligible:'Reverse-charge estimate active. The VAT ID and place of supply must still be validated before invoicing.',
      taxNotEligible:'20% Austrian VAT remains in the estimate until all reverse-charge conditions are met.'
    },
    hu:{
      net:'Nettó',vat:'ÁFA',gross:'Bruttó',vat20:'20% osztrák ÁFA-val számolva.',
      reverse:'Ausztrián kívüli EU-s vállalkozás: fordított adózás / 0% osztrák ÁFA becslés, az adószám és a teljesítési hely ellenőrzésével.',
      customerType:'Ügyféltípus',privateClient:'Magánszemély',businessClient:'Vállalkozás',billingCountry:'Számlázási ország',
      taxHelp:'A kalkulátor csak akkor becsül 0%-ot, ha a megrendelő más EU-tagállamban letelepedett vállalkozás, és az országhoz illeszkedő, formailag megfelelő EU-adószámot ad meg. A végleges adókezelés ellenőrzés után állapítható meg.',
      taxEligible:'A fordított adózás becslése aktív. Számlázás előtt az EU-adószámot és a teljesítési helyet ellenőrizni kell.',
      taxNotEligible:'A becslésben 20% osztrák ÁFA marad, amíg a fordított adózás minden feltétele nem teljesül.'
    },
    de:{
      net:'Netto',vat:'USt.',gross:'Brutto',vat20:'Inklusive 20% österreichischer USt.',
      reverse:'EU-Unternehmen außerhalb Österreichs: Reverse Charge / 0% österreichische USt.-Schätzung, vorbehaltlich UID- und Leistungsortprüfung.',
      customerType:'Kundentyp',privateClient:'Privatkunde',businessClient:'Unternehmen',billingCountry:'Rechnungsland',
      taxHelp:'0% werden nur geschätzt, wenn der Auftraggeber ein in einem anderen EU-Mitgliedstaat ansässiges Unternehmen ist und eine zum Land passende, formal gültige UID angibt. Die endgültige steuerliche Behandlung wird nach Prüfung bestätigt.',
      taxEligible:'Reverse-Charge-Schätzung aktiv. UID und Leistungsort müssen vor der Rechnungsstellung noch geprüft werden.',
      taxNotEligible:'Die Schätzung enthält weiterhin 20% österreichische USt., bis alle Reverse-Charge-Voraussetzungen erfüllt sind.'
    }
  };
  var pricesGross = {
    quick30:220, guided60:420, guided120:690,
    groupSetup:390, groupPerson:45, groupInstantBase:690, groupInstantPerson:55,
    brand60:499, brand120:790, brand180:1090, brand240:1390,
    art60:690, art120:990, art180:1290,
    event60:590, event120:890, event180:1190, event240:1490, eventFullDay:2490,
    retouchPortrait:35, retouchGroup:29, retouchArt:45,
    stylist:220, hair:220, makeup:220, express:120, mobile:240, artdirection:260,
    extraPhotographer:390, extraPhotographerEventHour:120
  };
  var pricingLoaded = false;
  function applyPricingJson(data){
    if(!data ||!data.priceComponentsGrossEUR) return;
    var p = data.priceComponentsGrossEUR;
    pricesGross.quick30 = Number(p.individualQuick30 || pricesGross.quick30);
    pricesGross.guided60 = Number(p.individualGuided60 || pricesGross.guided60);
    pricesGross.guided120 = Number(p.individualGuided120 || pricesGross.guided120);
    pricesGross.groupSetup = Number(p.groupSetupLaterRetouching || pricesGross.groupSetup);
    pricesGross.groupPerson = Number(p.groupPerPersonLaterRetouching || pricesGross.groupPerson);
    pricesGross.groupInstantBase = Number(p.groupInstantBaseMax6People || pricesGross.groupInstantBase);
    pricesGross.groupInstantPerson = Number(p.groupInstantPerPerson || pricesGross.groupInstantPerson);
    pricesGross.brand60 = Number(p.brandFastOneHour || pricesGross.brand60);
    pricesGross.brand120 = Number(p.brandTwoHours || pricesGross.brand120);
    pricesGross.brand180 = Number(p.brandThreeHours || pricesGross.brand180);
    pricesGross.brand240 = Number(p.brandFourHours || pricesGross.brand240);
    var fineArtBase = Number(p.fineArtBase || pricesGross.art60);
    pricesGross.art60 = Number(p.fineArtOneHour || fineArtBase);
    pricesGross.art120 = Number(p.fineArtTwoHours || pricesGross.art120 || fineArtBase);
    pricesGross.art180 = Number(p.fineArtThreeHours || pricesGross.art180 || fineArtBase);
    pricesGross.retouchPortrait = Number(p.retouchedImagePortrait || pricesGross.retouchPortrait);
    pricesGross.retouchGroup = Number(p.retouchedImageGroup || pricesGross.retouchGroup);
    pricesGross.retouchArt = Number(p.retouchedImageFineArt || pricesGross.retouchArt);
    pricesGross.stylist = Number(p.stylist || pricesGross.stylist);
    pricesGross.hair = Number(p.hair || pricesGross.hair);
    pricesGross.makeup = Number(p.makeup || pricesGross.makeup);
    pricesGross.express = Number(p.expressDelivery || pricesGross.express);
    pricesGross.mobile = Number(p.mobileStudio || pricesGross.mobile);
    pricesGross.artdirection = Number(p.artDirection || pricesGross.artdirection);
    pricesGross.extraPhotographer = Number(p.additionalPhotographer || pricesGross.extraPhotographer);
    pricesGross.extraPhotographerEventHour = Number(p.additionalPhotographerEventPerHour || pricesGross.extraPhotographerEventHour);
    pricesGross.event60 = Number(p.eventOneHour || pricesGross.event60);
    pricesGross.event120 = Number(p.eventTwoHours || pricesGross.event120);
    pricesGross.event180 = Number(p.eventThreeHours || pricesGross.event180);
    pricesGross.event240 = Number(p.eventFourHours || pricesGross.event240);
    pricesGross.eventFullDay = Number(p.eventFullDay || pricesGross.eventFullDay);
    pricingLoaded = true;
  }
  function loadPricing(){
    if (!window.fetch) return Promise.resolve(false);
    return fetch('/pricing.json', {cache:'no-store'}).then(function(resp){
      if(!resp ||!resp.ok) throw new Error('pricing unavailable');
      return resp.json();
    }).then(function(data){
      applyPricingJson(data);
      document.querySelectorAll('[data-smart-quote]').forEach(function(form){ paint(form); });
      return true;
    }).catch(function(){ pricingLoaded = false; return false; });
  }
  function money(v){ return '€' + Math.round(v).toLocaleString('de-DE'); }
  function checked(form,name){ return Array.prototype.slice.call(form.querySelectorAll('[name="'+name+'"]:checked')).map(function(i){return i.value;}); }
  function val(form,name, fallback){ var el=form.querySelector('[name="'+name+'"]:checked')||form.querySelector('[name="'+name+'"]'); return el? el.value: fallback; }
  function num(form,name,fallback){ var el=form.querySelector('[name="'+name+'"]'); var n=el?parseInt(el.value,10):fallback; return isNaN(n)?fallback:n; }
  function numericSelect(form,name,fallback){ var el=form.querySelector('[name="'+name+'"]'); var n=el?parseInt(el.value,10):fallback; return isNaN(n)?fallback:n; }
  function extraPhotographerCost(form, cat, durationHours){
    var team = cat === 'group'? numericSelect(form,'photographers',1): numericSelect(form,'photographer_team',1);
    var extra = Math.max(0, team-1);
    if(!extra) return {cost:0, count:0};
    if(cat === 'event') return {cost: extra * pricesGross.extraPhotographerEventHour * Math.max(1,durationHours || 1), count: extra};
    return {cost: extra * pricesGross.extraPhotographer, count: extra};
  }
  function normalizeVatId(value){
    return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g,'');
  }
  function isVatIdFormallyValid(vatId, billingCountry){
    var raw = normalizeVatId(vatId);
    var country = EU_COUNTRIES[billingCountry];
    if(!country || !raw) return false;
    if(raw.slice(0, country.prefix.length) !== country.prefix) return false;
    var pattern = VAT_PATTERNS[country.prefix];
    return pattern? pattern.test(raw): false;
  }
  function getTaxProfile(form){
    var customerType = val(form,'customer_type','private');
    var billingCountry = val(form,'billing_country','AT');
    var company = (form.querySelector('[name="company"]')||{}).value||'';
    var vatId = (form.querySelector('[data-vat-id]')||{}).value||'';
    var euCountry = !!EU_COUNTRIES[billingCountry];
    var formalVatValid = isVatIdFormallyValid(vatId, billingCountry);
    var eligible = customerType === 'business' && !!company.trim() && euCountry && billingCountry !== 'AT' && formalVatValid;
    return {
      eligible: eligible,
      customerType: customerType,
      billingCountry: billingCountry,
      vatId: normalizeVatId(vatId),
      formalVatValid: formalVatValid,
      reason: eligible? 'eu-b2b-non-at-formal-vat-match': 'austrian-vat-default'
    };
  }
  function createField(tag, attrs, text){
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function(key){
      if(key === 'className') el.className = attrs[key];
      else el.setAttribute(key, attrs[key]);
    });
    if(text != null) el.textContent = text;
    return el;
  }
  function ensureTaxFields(form){
    if(form.querySelector('[name="customer_type"]')) return;
    var lang=form.getAttribute('data-lang')||'en';
    var l=labels[lang]||labels.en;
    var vatField=form.querySelector('[data-vat-id]');
    var anchor=vatField && vatField.closest('.grid-2');
    if(!anchor || !anchor.parentNode) return;

    var grid=createField('div',{className:'grid-2','data-tax-profile-fields':''});
    var typeWrap=createField('div',{className:'field'});
    var typeLabel=createField('label',{'for':'customer_type'},l.customerType);
    var typeSelect=createField('select',{'id':'customer_type','name':'customer_type','required':''});
    typeSelect.appendChild(createField('option',{'value':'private'},l.privateClient));
    typeSelect.appendChild(createField('option',{'value':'business'},l.businessClient));
    typeWrap.appendChild(typeLabel); typeWrap.appendChild(typeSelect);

    var countryWrap=createField('div',{className:'field'});
    var countryLabel=createField('label',{'for':'billing_country'},l.billingCountry);
    var countrySelect=createField('select',{'id':'billing_country','name':'billing_country','required':''});
    Object.keys(EU_COUNTRIES).forEach(function(code){
      var option=createField('option',{'value':code},EU_COUNTRIES[code].label[lang]||EU_COUNTRIES[code].label.en);
      if(code==='AT') option.selected=true;
      countrySelect.appendChild(option);
    });
    var outside=createField('option',{'value':'NON_EU'},lang==='hu'?'EU-n kívüli ország':(lang==='de'?'Land außerhalb der EU':'Country outside the EU'));
    countrySelect.appendChild(outside);
    countryWrap.appendChild(countryLabel); countryWrap.appendChild(countrySelect);
    grid.appendChild(typeWrap); grid.appendChild(countryWrap);
    anchor.parentNode.insertBefore(grid, anchor);

    var help=createField('p',{className:'field-help','data-tax-help':''},l.taxHelp);
    anchor.parentNode.insertBefore(help, anchor.nextSibling);
    var status=createField('p',{className:'field-help','data-tax-status':'','aria-live':'polite'},l.taxNotEligible);
    help.parentNode.insertBefore(status, help.nextSibling);
  }
  function updateTaxUi(form, profile){
    var lang=form.getAttribute('data-lang')||'en';
    var l=labels[lang]||labels.en;
    var status=form.querySelector('[data-tax-status]');
    if(status) status.textContent=profile.eligible?l.taxEligible:l.taxNotEligible;
    var vat=form.querySelector('[data-vat-id]');
    if(vat){
      vat.setAttribute('aria-invalid', profile.customerType==='business' && profile.billingCountry!=='AT' && !profile.formalVatValid? 'true':'false');
    }
  }
  function updatePanels(form){
    var cat=val(form,'category','individual');
    form.querySelectorAll('[data-panel]').forEach(function(p){ p.hidden = p.getAttribute('data-panel')!== cat; });
    var delivery=val(form,'group_delivery','later');
    var people=form.querySelector('[name="people_count"]');
    if(cat==='group' && delivery==='instant' && people && parseInt(people.value,10)>6){ people.value=6; }
    if(people){ people.max = (cat==='group' && delivery==='instant')? 6: 200; }
  }
  function calc(form){
    updatePanels(form);
    var cat=val(form,'category','individual');
    var gross=0, parts=[];
    var retouches=Math.max(1,num(form,'retouched_images',1));
    if(cat==='individual'){
      var m=val(form,'individual_mode','quick30'); gross += pricesGross[m] || pricesGross.quick30; parts.push(m.replace(/[0-9]+$/, '').replace('quick', 'quick portrait').replace('guided', 'guided portrait'));
      if(retouches>1){ gross += (retouches-1)*pricesGross.retouchPortrait; parts.push('extra retouched images: '+(retouches-1)); }
    } else if(cat==='group'){
      var people=Math.max(1,num(form,'people_count',6)); var delivery=val(form,'group_delivery','later');
      if(delivery==='instant'){ people=Math.min(people,6); gross += pricesGross.groupInstantBase + people*pricesGross.groupInstantPerson; parts.push('instant retouching, '+people+' people'); }
      else { gross += pricesGross.groupSetup + people*pricesGross.groupPerson + retouches*pricesGross.retouchGroup; parts.push('later retouching, '+people+' people'); }
      var groupExtra = extraPhotographerCost(form, cat, 1);
      if(groupExtra.count>0){ gross += groupExtra.cost; parts.push('additional photographers: '+groupExtra.count); }
    } else if(cat==='brand'){
      var b=val(form,'brand_duration','brand60'); gross += pricesGross[b] || pricesGross.brand60; parts.push(b.replace('brand', 'brand session '));
      gross += Math.max(0,retouches-3)*pricesGross.retouchPortrait; parts.push('retouched images: '+retouches);
      var brandExtra = extraPhotographerCost(form, cat, 1); if(brandExtra.count>0){ gross += brandExtra.cost; parts.push('additional photographers: '+brandExtra.count); }
    } else if(cat==='art'){
      var a=val(form,'art_duration','art60'); gross += pricesGross[a] || pricesGross.art60; parts.push(val(form,'art_type','artportrait')); parts.push(a + ' — final fine-art scope confirmed in writing');
      gross += Math.max(0,retouches-2)*pricesGross.retouchArt; parts.push('retouched images: '+retouches);
      var artExtra = extraPhotographerCost(form, cat, 1); if(artExtra.count>0){ gross += artExtra.cost; parts.push('additional photographers: '+artExtra.count); }
    } else if(cat==='event'){
      var ev=val(form,'event_duration','event60'); gross += pricesGross[ev] || pricesGross.event60; parts.push(ev.replace('event', 'event coverage '));
      var eventHours = ({event60:1,event120:2,event180:3,event240:4,eventFullDay:8})[ev] || 1;
      gross += Math.max(0,retouches-3)*pricesGross.retouchPortrait; parts.push('retouched images: '+retouches);
      var eventExtra = extraPhotographerCost(form, cat, eventHours); if(eventExtra.count>0){ gross += eventExtra.cost; parts.push('additional event photographers: '+eventExtra.count+' x '+eventHours+'h'); }
    }
    checked(form,'addons').forEach(function(ad){ gross += pricesGross[ad] || 0; parts.push(ad); });
    var taxProfile=getTaxProfile(form);
    var reverse=taxProfile.eligible;
    updateTaxUi(form, taxProfile);
    var grossRounded = Math.round(gross);
    var net = Math.round(gross/(1+VAT));
    var vat = reverse? 0: grossRounded-net; /* VAT derived from rounded values so net + VAT always equals gross */
    var total = reverse? net: grossRounded;
    return {
      gross: total,
      grossBeforeVatMode: grossRounded,
      net: net,
      vat: vat,
      reverse: reverse,
      vatMode: reverse? 'reverse-charge-0-vat': 'austrian-vat-20',
      parts: parts.join(', '),
      category: cat,
      pricingSource: pricingLoaded? 'pricing.json': 'pricing.json fallback',
      prices: pricesGross,
      customerType: taxProfile.customerType,
      billingCountry: taxProfile.billingCountry,
      euVatNumber: taxProfile.vatId,
      vatIdFormallyValid: taxProfile.formalVatValid,
      reverseChargeReason: taxProfile.reason
    };
  }
  function paint(form){
    var lang=form.getAttribute('data-lang')||'en'; var l=labels[lang]||labels.en; var c=calc(form);
    var box=document.querySelector('[data-quote-summary]'); if(!box) return c;
    box.classList.toggle('reverse', c.reverse);
    var total=box.querySelector('[data-total]'), net=box.querySelector('[data-net]'), vat=box.querySelector('[data-vat]'), note=box.querySelector('[data-vat-note]');
    if(total) total.textContent=money(c.gross); if(net) net.textContent=money(c.net); if(vat) vat.textContent=money(c.vat); if(note) note.textContent=c.reverse?l.reverse:l.vat20;
    var hNet=form.querySelector('[data-estimate-net]'), hVat=form.querySelector('[data-estimate-vat]'), hGross=form.querySelector('[data-estimate-gross]'), hMode=form.querySelector('[data-estimate-vat-mode]'), hSummary=form.querySelector('[data-estimate-summary]');
    if(hNet) hNet.value=c.net; if(hVat) hVat.value=c.vat; if(hGross) hGross.value=c.gross; if(hMode) hMode.value=c.vatMode; if(hSummary) hSummary.value=c.parts;
    return c;
  }
  function initForm(form){
    ensureTaxFields(form);
    form.addEventListener('input', function(){ paint(form); });
    form.addEventListener('change', function(){ paint(form); });
    form.addEventListener('submit', function(){ paint(form); });
    return paint(form);
  }
  window.BANHALMI_QUOTE = window.BANHALMI_QUOTE || {};
  window.BANHALMI_QUOTE.calculate = calc;
  window.BANHALMI_QUOTE.paint = paint;
  window.BANHALMI_QUOTE.updatePanels = updatePanels;
  window.BANHALMI_QUOTE.loadPricing = loadPricing;
  window.BANHALMI_QUOTE.applyPricingJson = applyPricingJson;
  window.BANHALMI_QUOTE.getPrices = function(){ return JSON.parse(JSON.stringify(pricesGross)); };
  window.BANHALMI_QUOTE.money = money;
  window.BANHALMI_QUOTE.labels = labels;
  document.querySelectorAll('[data-smart-quote]').forEach(initForm);
  loadPricing();
})();
