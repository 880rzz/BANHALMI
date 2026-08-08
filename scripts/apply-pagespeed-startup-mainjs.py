from pathlib import Path

path = Path('assets/js/main.js')
text = path.read_text(encoding='utf-8')

old_footer = '''  var footerMedia = window.matchMedia("(min-width: 681px)");
  var footerAccordions = Array.prototype.slice.call(document.querySelectorAll("details.footer-accordion"));
  footerAccordions.forEach(function (details) {
    details.open = false;
  });

  function syncFooterAccordions(event) {
'''
new_footer = '''  var footerMedia = window.matchMedia("(min-width: 681px)");
  var footerAccordions = Array.prototype.slice.call(document.querySelectorAll("details.footer-accordion"));

  function syncFooterAccordions(event) {
'''
if old_footer not in text:
    raise SystemExit('footer startup block not found')
text = text.replace(old_footer, new_footer, 1)

old_reveal = '''    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
'''
new_reveal = '''    // Register below-fold reveal targets in small frame batches instead of
    // one startup loop. This preserves the visual behavior while keeping the
    // initial main-thread task short on mobile CPUs.
    var revealIndex = 0;
    function observeRevealBatch() {
      var end = Math.min(revealIndex + 8, items.length);
      while (revealIndex < end) {
        io.observe(items[revealIndex]);
        revealIndex += 1;
      }
      if (revealIndex < items.length) window.requestAnimationFrame(observeRevealBatch);
    }
    if (items.length) window.requestAnimationFrame(observeRevealBatch);
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
'''
if old_reveal not in text:
    raise SystemExit('reveal startup block not found')
text = text.replace(old_reveal, new_reveal, 1)

path.write_text(text, encoding='utf-8')
print('Applied BANHALMI startup remediation: removed footer double mutation and batched reveal observer registration.')
