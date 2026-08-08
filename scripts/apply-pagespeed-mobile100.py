from pathlib import Path

path = Path('assets/js/main.js')
text = path.read_text(encoding='utf-8')

old_motion = '''  // Apple-inspired motion system — restrained, accessible and performance-safe.\n  (function () {\n    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;\n    var canObserve = "IntersectionObserver" in window;\n'''
new_motion = '''  // Apple-inspired motion system — restrained, accessible and performance-safe.\n  (function () {\n    // Mobile visitors get the finished content immediately. The editorial motion\n    // layer is decorative and its full-DOM scan is not worth blocking the main\n    // thread on compact/mobile CPUs. Desktop keeps the original motion system.\n    var compactViewport = window.matchMedia && window.matchMedia("(max-width: 680px)").matches;\n    if (compactViewport) return;\n    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;\n    var canObserve = "IntersectionObserver" in window;\n'''
if old_motion not in text:
    raise SystemExit('Apple motion marker not found')
text = text.replace(old_motion, new_motion, 1)

old_age = '''  var ageDialog=buildAgeDialog();\n  ageDialog.inert=true;\n  function showAgeDialog(index,trigger){pendingIndex=index;lastTrigger=trigger||null;ageDialog.inert=false;ageDialog.classList.add('open');ageDialog.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';ageDialog.querySelector('[data-age-accept]').focus();}\n  function closeAgeDialog(restore){ageDialog.classList.remove('open');ageDialog.setAttribute('aria-hidden','true');ageDialog.inert=true;document.body.style.overflow='';if(restore&&lastTrigger)lastTrigger.focus();}\n'''
new_age = '''  var ageDialog=null;\n  function ensureAgeDialog(){\n    if(!ageDialog){ageDialog=buildAgeDialog();ageDialog.inert=true;}\n    return ageDialog;\n  }\n  function showAgeDialog(index,trigger){pendingIndex=index;lastTrigger=trigger||null;var dialog=ensureAgeDialog();dialog.inert=false;dialog.classList.add('open');dialog.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';dialog.querySelector('[data-age-accept]').focus();}\n  function closeAgeDialog(restore){if(!ageDialog)return;ageDialog.classList.remove('open');ageDialog.setAttribute('aria-hidden','true');ageDialog.inert=true;document.body.style.overflow='';if(restore&&lastTrigger)lastTrigger.focus();}\n'''
if old_age not in text:
    raise SystemExit('Age dialog startup marker not found')
text = text.replace(old_age, new_age, 1)

old_key = "    if(ageDialog.classList.contains('open')){if(e.key==='Escape'){pendingIndex=null;closeAgeDialog(true);}return;}"
new_key = "    if(ageDialog&&ageDialog.classList.contains('open')){if(e.key==='Escape'){pendingIndex=null;closeAgeDialog(true);}return;}"
if old_key not in text:
    raise SystemExit('Age dialog keydown marker not found')
text = text.replace(old_key, new_key, 1)

path.write_text(text, encoding='utf-8')
print('Applied mobile PageSpeed remediation: decorative motion disabled on compact viewports and age dialog made interaction-lazy.')
