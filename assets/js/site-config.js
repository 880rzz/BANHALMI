/* BANHALMI multilingual runtime configuration — single domain, workers.dev gateway. */
window.BANHALMI_CONFIG = Object.assign({}, window.BANHALMI_CONFIG || {}, {
  formEndpoint: "https://banhalmi-form-gateway.6ymnrwgnv9.workers.dev/api/banhalmi-form",
  submissionMode: "cloudflare-workers-dev-language-payload",
  siteLanguage: document.documentElement.lang || "en",
  siteDomain: "www.norbertbanhalmi.com",
  supportEmail: "hello@norbertbanhalmi.com",
  analyticsMeasurementId: "G-90C452LJKQ"
});

/* Load the shared ART-inspired descriptive navigation on every page. */
(function loadDescriptiveMenu(){
  'use strict';
  if(!document.querySelector('link[data-banhalmi-mega-menu]')){
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/assets/css/mega-menu.css?v=20260807-blue-palette-v49';
    style.setAttribute('data-banhalmi-mega-menu','');
    document.head.appendChild(style);
  }
  if(!document.querySelector('script[data-banhalmi-mega-menu]')){
    var script = document.createElement('script');
    script.src = '/assets/js/mega-menu.js?v=20260807-blue-palette-v49';
    script.defer = true;
    script.setAttribute('data-banhalmi-mega-menu','');
    document.head.appendChild(script);
  }
})();

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
      addIdempotency(form);
      verifiedDelivery = false;
    };
  }

  function validationCopy(form){
    var lang = languageOf(form);
    return {
      en:{title:'Please complete the highlighted fields',intro:'The quote request cannot be sent yet. Check the marked section(s) below.',field:'This field is required or contains an invalid value.',choice:'Please select an option.',email:'Please enter a valid email address.',privacy:'Please accept the privacy notice before sending.',button:'Go to the first error'},
      hu:{title:'Kérjük, javítsa a kiemelt mezőket',intro:'Az ajánlatkérés még nem küldhető el. Ellenőrizze az alább megjelölt részeket.',field:'Ez a mező kötelező, vagy a megadott érték nem megfelelő.',choice:'Kérjük, válasszon egy lehetőséget.',email:'Kérjük, adjon meg érvényes e-mail-címet.',privacy:'Kérjük, küldés előtt fogadja el az adatvédelmi tájékoztatót.',button:'Ugrás az első hibához'},
      de:{title:'Bitte korrigieren Sie die markierten Felder',intro:'Die Anfrage kann noch nicht gesendet werden. Prüfen Sie die unten markierten Bereiche.',field:'Dieses Feld ist erforderlich oder enthält einen ungültigen Wert.',choice:'Bitte wählen Sie eine Option aus.',email:'Bitte geben Sie eine gültige E-Mail-Adresse ein.',privacy:'Bitte akzeptieren Sie vor dem Senden die Datenschutzhinweise.',button:'Zum ersten Fehler'}
    }[lang];
  }

  function fieldContainer(field){
    return field.closest('fieldset, .quote-field, .form-field, .field, .form-group, .choice-grid, .option-grid, .quote-section, label') || field.parentElement;
  }

  function fieldLabel(field){
    var form = field.form;
    var label = field.id && form ? form.querySelector('label[for="' + field.id.replace(/"/g,'\\"') + '"]') : null;
    if(!label) label = field.closest('label');
    if(!label && fieldContainer(field)) label = fieldContainer(field).querySelector('legend, label, h2, h3, h4');
    return label ? String(label.textContent || '').replace(/\s+/g,' ').trim().replace(/[*:]\s*$/,'') : (field.name || 'Field');
  }

  function clearFieldError(field){
    field.removeAttribute('aria-invalid');
    field.classList.remove('is-invalid-field');
    var container = fieldContainer(field);
    if(container){
      container.classList.remove('is-invalid-group');
      container.querySelectorAll('.field-error-message[data-for="' + (field.name || field.id || '') + '"]').forEach(function(message){ message.remove(); });
    }
  }

  function errorMessage(field, copy){
    if(field.name === 'privacy_acknowledged') return copy.privacy;
    if(field.type === 'email' && field.validity && field.validity.typeMismatch) return copy.email;
    if(field.type === 'radio' || field.type === 'checkbox') return copy.choice;
    return field.validationMessage || copy.field;
  }

  function markFieldError(field, copy){
    var groupFields = (field.type === 'radio' || field.type === 'checkbox') && field.name ? field.form.querySelectorAll('[name="' + CSS.escape(field.name) + '"]') : [field];
    Array.prototype.forEach.call(groupFields, function(item){
      item.setAttribute('aria-invalid','true');
      item.classList.add('is-invalid-field');
    });
    var container = fieldContainer(field);
    if(container){
      container.classList.add('is-invalid-group');
      var key = field.name || field.id || 'field';
      if(!container.querySelector('.field-error-message[data-for="' + key + '"]')){
        var message = document.createElement('span');
        message.className = 'field-error-message';
        message.setAttribute('data-for',key);
        message.setAttribute('role','alert');
        message.textContent = errorMessage(field, copy);
        container.appendChild(message);
      }
    }
  }

  function invalidFields(form){
    return Array.prototype.slice.call(form.elements || []).filter(function(field){
      return field && field.willValidate && !field.validity.valid && !field.disabled && field.offsetParent !== null;
    });
  }

  function renderValidationSummary(form, fields){
    var copy = validationCopy(form);
    var summary = form.querySelector('[data-validation-summary]');
    if(!summary){
      summary = document.createElement('section');
      summary.className = 'quote-validation-summary';
      summary.setAttribute('data-validation-summary','');
      summary.setAttribute('role','alert');
      summary.setAttribute('aria-live','assertive');
      summary.setAttribute('tabindex','-1');
      form.insertBefore(summary, form.firstChild);
    }
    var unique = [];
    var seen = {};
    fields.forEach(function(field){
      var key = field.name || field.id || String(unique.length);
      if(seen[key]) return;
      seen[key] = true;
      unique.push(field);
    });
    summary.innerHTML = '';
    var title = document.createElement('h2'); title.textContent = copy.title; summary.appendChild(title);
    var intro = document.createElement('p'); intro.textContent = copy.intro; summary.appendChild(intro);
    var list = document.createElement('ul');
    unique.forEach(function(field, index){
      if(!field.id) field.id = 'quote-error-field-' + index + '-' + Date.now();
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + field.id;
      link.textContent = fieldLabel(field) + ': ' + errorMessage(field, copy);
      link.addEventListener('click', function(event){ event.preventDefault(); focusError(field); });
      item.appendChild(link); list.appendChild(item);
    });
    summary.appendChild(list);
    var button = document.createElement('button');
    button.type = 'button'; button.className = 'btn btn-primary'; button.textContent = copy.button;
    button.addEventListener('click', function(){ focusError(unique[0]); });
    summary.appendChild(button);
    summary.hidden = false;
    summary.focus({preventScroll:true});
    summary.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function focusError(field){
    if(!field) return;
    var target = fieldContainer(field) || field;
    target.scrollIntoView({behavior:'smooth',block:'center'});
    window.setTimeout(function(){ try { field.focus({preventScroll:true}); } catch(e) { field.focus(); } }, 320);
  }

  function clearValidationSummary(form){
    var summary = form.querySelector('[data-validation-summary]');
    if(summary) summary.hidden = true;
  }

  function prepareVisibleValidation(form){
    form.setAttribute('novalidate','novalidate');
    form.addEventListener('input', function(event){
      if(event.target && event.target.willValidate && event.target.validity.valid) clearFieldError(event.target);
      if(!invalidFields(form).length) clearValidationSummary(form);
    });
    form.addEventListener('change', function(event){
      if(event.target && event.target.willValidate && event.target.validity.valid) clearFieldError(event.target);
      if(!invalidFields(form).length) clearValidationSummary(form);
    });
    form.addEventListener('submit', function(event){
      Array.prototype.forEach.call(form.elements || [], clearFieldError);
      var fields = invalidFields(form);
      if(fields.length){
        event.preventDefault();
        event.stopImmediatePropagation();
        var copy = validationCopy(form);
        fields.forEach(function(field){ markFieldError(field, copy); });
        renderValidationSummary(form, fields);
      } else {
        clearValidationSummary(form);
      }
    }, true);
  }

  function initForm(form){
    placePdfAction(form);
    prepareStatus(form);
    prepareDates(form);
    applyZeroPriceDefault(form);
    addIdempotency(form);
    protectReset(form);
    restoreDraft(form);
    prepareVisibleValidation(form);
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
