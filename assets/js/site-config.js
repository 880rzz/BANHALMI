/* BANHALMI multilingual runtime configuration — single domain, workers.dev gateway. */
window.BANHALMI_CONFIG = Object.assign({}, window.BANHALMI_CONFIG || {}, {
  formEndpoint: "https://banhalmi-form-gateway.6ymnrwgnv9.workers.dev/api/banhalmi-form",
  submissionMode: "cloudflare-workers-dev-language-payload",
  siteLanguage: document.documentElement.lang || "en",
  siteDomain: "www.norbertbanhalmi.com",
  supportEmail: "hello@norbertbanhalmi.com",
  analyticsMeasurementId: "G-90C452LJKQ"
});

/* Quote-system hardening shared by every language version. */
(function hardenQuoteSystem(){
  'use strict';

  var endpoint = window.BANHALMI_CONFIG.formEndpoint;
  var verifiedDelivery = false;
  var storagePrefix = 'banhalmi_quote_draft_v1:';

  function languageOf(form){
    var raw = String((form && form.getAttribute('data-lang')) || document.documentElement.lang || 'en').toLowerCase();
    return raw.indexOf('hu') === 0 ? 'hu' : raw.indexOf('de') === 0 ? 'de' : 'en';
  }

  function tomorrowIso(){
    var date = new Date();
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() + 1);
    return date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
  }

  function draftKey(form){
    return storagePrefix + (form.getAttribute('data-lang') || document.documentElement.lang || 'en');
  }

  function hasDraft(form){
    try { return !!localStorage.getItem(draftKey(form)); } catch(e) { return false; }
  }

  function serializeDraft(form){
    var values = {};
    Array.prototype.forEach.call(form.elements || [], function(field){
      if(!field.name || field.name === 'website' || field.type === 'file' || field.type === 'submit' || field.type === 'button') return;
      if(field.type === 'checkbox' || field.type === 'radio'){
        if(!values[field.name]) values[field.name] = [];
        if(field.checked) values[field.name].push(field.value);
      } else {
        values[field.name] = field.value;
      }
    });
    return values;
  }

  function restoreDraft(form){
    var raw;
    try { raw = localStorage.getItem(draftKey(form)); } catch(e) { return; }
    if(!raw) return;
    var values;
    try { values = JSON.parse(raw); } catch(e) { return; }
    Object.keys(values || {}).forEach(function(name){
      var fields = form.querySelectorAll('[name="' + CSS.escape(name) + '"]');
      Array.prototype.forEach.call(fields, function(field){
        if(field.type === 'checkbox' || field.type === 'radio') field.checked = Array.isArray(values[name]) && values[name].indexOf(field.value) >= 0;
        else if(typeof values[name] === 'string') field.value = values[name];
      });
    });
    form.dispatchEvent(new Event('change', {bubbles:true}));
    form.dispatchEvent(new Event('input', {bubbles:true}));
  }

  function saveDraft(form){
    try { localStorage.setItem(draftKey(form), JSON.stringify(serializeDraft(form))); } catch(e) {}
  }

  function clearDraft(form){
    try { localStorage.removeItem(draftKey(form)); } catch(e) {}
  }

  function addIdempotency(form){
    var field = form.querySelector('[name="submission_key"]');
    if(!field){
      field = document.createElement('input');
      field.type = 'hidden';
      field.name = 'submission_key';
      form.appendChild(field);
    }
    if(!field.value){
      var random = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
      field.value = 'BQ-' + random;
    }
  }

  function prepareStatus(form){
    var note = form.querySelector('[data-form-note]');
    if(note){
      note.setAttribute('role','status');
      note.setAttribute('aria-live','polite');
      note.setAttribute('aria-atomic','true');
    }
  }

  function prepareDates(form){
    var min = tomorrowIso();
    form.querySelectorAll('input[type="date"]').forEach(function(input){ input.min = min; });
  }

  function hasBillableSelection(form){
    return !!form.querySelector([
      'input[type="radio"][name="category"]:checked',
      'input[type="radio"][name="individual_mode"]:checked',
      'input[type="radio"][name="brand_duration"]:checked',
      'input[type="radio"][name="event_duration"]:checked'
    ].join(','));
  }

  function zeroEstimate(){
    return {
      gross:0,
      grossBeforeVatMode:0,
      net:0,
      vat:0,
      reverse:false,
      reverseEligible:false,
      vatMode:'at-vat-20',
      parts:'',
      category:'',
      photographerCount:0,
      peopleCount:0,
      retouchedImagesPerPerson:0,
      retouchedImagesTotal:0,
      instantRetouchHours:0,
      pricingSource:'pricing.json',
      pricingReady:true,
      customTravel:false,
      travelCountry:'',
      eventRecommendedPhotographers:0,
      eventDeliveredImagesEstimate:0
    };
  }

  function renderZeroEstimate(form){
    if(hasBillableSelection(form)) return null;
    var root = form.closest('[data-quote-root], .smart-quote-layout') || form.parentElement;
    var formatted = new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(0);
    [['estimate_net','0'],['estimate_vat','0'],['estimate_gross','0'],['estimate_vat_mode','at-vat-20'],['estimate_summary','']].forEach(function(pair){
      var field = form.querySelector('[name="'+pair[0]+'"]');
      if(field) field.value = pair[1];
    });
    ['net','vat','gross'].forEach(function(key){
      var node = root && root.querySelector('[data-estimate-'+key+']');
      if(node) node.textContent = formatted;
    });
    var summary = form.querySelector('[data-estimate-summary]');
    if(summary) summary.value = '';
    return zeroEstimate();
  }

  function installZeroPriceGuard(form){
    function enforceAfterCalculator(){
      window.setTimeout(function(){ renderZeroEstimate(form); },0);
    }
    form.addEventListener('input', enforceAfterCalculator);
    form.addEventListener('change', enforceAfterCalculator);
    var attempts = 0;
    var timer = window.setInterval(function(){
      attempts += 1;
      var api = window.BANHALMI_QUOTE;
      if(api && !api.__zeroStartGuardInstalled){
        var nativeCalculate = api.calculate;
        var nativePaint = api.paint;
        api.calculate = function(target){
          return hasBillableSelection(target) ? nativeCalculate(target) : zeroEstimate();
        };
        api.paint = function(target){
          return hasBillableSelection(target) ? nativePaint(target) : renderZeroEstimate(target);
        };
        api.__zeroStartGuardInstalled = true;
        window.clearInterval(timer);
        renderZeroEstimate(form);
      } else if(attempts > 100){
        window.clearInterval(timer);
      }
    },25);
    enforceAfterCalculator();
  }

  function applyZeroPriceDefault(form){
    if(hasDraft(form)) return;
    form.querySelectorAll('input[type="radio"][name="category"], input[type="radio"][name="individual_mode"], input[type="radio"][name="brand_duration"], input[type="radio"][name="event_duration"]').forEach(function(input){
      input.checked = false;
    });
    form.querySelectorAll('input[type="checkbox"][name="addons"]').forEach(function(input){
      input.checked = false;
    });
    form.dispatchEvent(new Event('change', {bubbles:true}));
    form.dispatchEvent(new Event('input', {bubbles:true}));
  }

  function placePdfAction(form){
    var submitActions = form.querySelector('.quote-submit-actions');
    var root = form.closest('[data-quote-root], .smart-quote-layout') || form.parentElement;
    var pdfButton = root && root.querySelector('[data-download-quote-pdf]');
    var pdfActions = pdfButton && pdfButton.closest('.quote-actions');
    if(!submitActions || !pdfActions) return;
    submitActions.insertAdjacentElement('afterend', pdfActions);
    pdfActions.classList.add('quote-submit-pdf-actions');
  }

  function protectReset(form){
    var nativeReset = form.reset.bind(form);
    form.reset = function(){
      if(!verifiedDelivery) return;
      clearDraft(form);
      nativeReset();
      applyZeroPriceDefault(form);
      renderZeroEstimate(form);
      addIdempotency(form);
      verifiedDelivery = false;
    };
  }

  function initForm(form){
    placePdfAction(form);
    prepareStatus(form);
    prepareDates(form);
    applyZeroPriceDefault(form);
    addIdempotency(form);
    protectReset(form);
    restoreDraft(form);
    installZeroPriceGuard(form);
    var saveTimer;
    function scheduleSave(){
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(function(){ saveDraft(form); }, 180);
    }
    form.addEventListener('input', scheduleSave);
    form.addEventListener('change', scheduleSave);
  }

  /* Preserve entered data unless the backend explicitly confirms both email deliveries. */
  if(window.fetch){
    var nativeFetch = window.fetch.bind(window);
    window.fetch = function(resource, options){
      var url = typeof resource === 'string' ? resource : (resource && resource.url) || '';
      return nativeFetch(resource, options).then(function(response){
        if(url !== endpoint) return response;
        return response.clone().text().then(function(text){
          var data = {};
          try { data = text ? JSON.parse(text) : {}; } catch(e) { data = {}; }
          var explicitDelivery = data.adminEmailSent === true && data.customerEmailSent === true;
          verifiedDelivery = explicitDelivery;
          if(!explicitDelivery && data.ok !== false) data.unverified = true;
          var headers = new Headers(response.headers);
          headers.set('Content-Type','application/json;charset=utf-8');
          return new Response(JSON.stringify(data), {status:response.status,statusText:response.statusText,headers:headers});
        }).catch(function(){
          verifiedDelivery = false;
          return response;
        });
      });
    };
  }

  function init(){
    document.querySelectorAll('[data-smart-quote]').forEach(initForm);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();