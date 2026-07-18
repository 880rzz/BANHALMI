from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    if new in text:
        return
    if old not in text:
        raise RuntimeError(f"Expected source block not found in {path}")
    file.write_text(text.replace(old, new, 1), encoding="utf-8")


calculator = Path("assets/js/quote-calculator.js")
text = calculator.read_text(encoding="utf-8")
old_val = "function val(f,n,d){var e=f.querySelector('[name=\"'+n+'\"]:checked')||f.querySelector('[name=\"'+n+'\"]');return e?e.value:d;}"
new_val = "function val(f,n,d){var checkedField=f.querySelector('[name=\"'+n+'\"]:checked');if(checkedField)return checkedField.value;var field=f.querySelector('[name=\"'+n+'\"]');if(!field)return d;if(field.type==='radio'||field.type==='checkbox')return d;return field.value;}"
if new_val not in text:
    if old_val not in text:
        raise RuntimeError("Calculator value-reader source block not found")
    text = text.replace(old_val, new_val, 1)

old_calc = "  function calculate(f){if(!pricingReady)return{gross:0,grossBeforeVatMode:0,net:0,vat:0,reverse:false,vatMode:'pricing-unavailable',parts:'',category:val(f,'category','individual'),photographerCount:1,peopleCount:1,retouchedImagesPerPerson:Math.max(1,num(f,'retouched_images',1)),retouchedImagesTotal:Math.max(1,num(f,'retouched_images',1)),instantRetouchHours:0,pricingSource:'unavailable',pricingReady:false,customTravel:false,travelCountry:''};var cat=val(f,'category','individual'),l=copy[lang(f)],gross=0,parts=[],ret=Math.max(1,num(f,'retouched_images',1)),people=peopleCount(f,cat),photographers=requiredPhotographers(f,cat),mode=val(f,'individual_mode','quick30');"
new_calc = "  function emptyEstimate(ready,mode){return{gross:0,grossBeforeVatMode:0,net:0,vat:0,reverse:false,reverseEligible:false,vatMode:mode||'at-vat-20',parts:'',category:'',photographerCount:0,peopleCount:0,retouchedImagesPerPerson:0,retouchedImagesTotal:0,instantRetouchHours:0,pricingSource:ready?(pricingLoaded?'pricing.json':'embedded'):'unavailable',pricingReady:!!ready,customTravel:false,travelCountry:'',eventRecommendedPhotographers:0,eventDeliveredImagesEstimate:0};}\n  function calculate(f){if(!pricingReady)return emptyEstimate(false,'pricing-unavailable');var categoryField=f.querySelector('[name=\"category\"]:checked');if(!categoryField)return emptyEstimate(true,'at-vat-20');var cat=categoryField.value;if((cat==='individual'&&!f.querySelector('[name=\"individual_mode\"]:checked'))||(cat==='brand'&&!f.querySelector('[name=\"brand_duration\"]:checked'))||(cat==='event'&&!f.querySelector('[name=\"event_duration\"]:checked')))return emptyEstimate(true,'at-vat-20');var l=copy[lang(f)],gross=0,parts=[],ret=Math.max(1,num(f,'retouched_images',1)),people=peopleCount(f,cat),photographers=requiredPhotographers(f,cat),mode=val(f,'individual_mode','quick30');"
if new_calc not in text:
    if old_calc not in text:
        raise RuntimeError("Calculator calculation source block not found")
    text = text.replace(old_calc, new_calc, 1)
calculator.write_text(text, encoding="utf-8")

site = Path("assets/js/site-config.js")
text = site.read_text(encoding="utf-8")
start_marker = "  function hasBillableSelection(form){"
end_marker = "  function applyZeroPriceDefault(form){"
if start_marker in text:
    start = text.index(start_marker)
    end = text.index(end_marker)
    text = text[:start] + text[end:]
text = text.replace("      renderZeroEstimate(form);\n", "")
text = text.replace("    installZeroPriceGuard(form);\n", "")
site.write_text(text, encoding="utf-8")

test_file = Path("tests/quote-calculator.spec.mjs")
text = test_file.read_text(encoding="utf-8")
block = "      await expect(page.locator('[data-pricing-ready=\"true\"]')).toHaveCount(1, { timeout: 10000 });\n      const gross = root.locator('[data-estimate-gross]');"
replacement = "      await expect(page.locator('[data-pricing-ready=\"true\"]')).toHaveCount(1, { timeout: 10000 });\n      await page.locator('input[name=\"category\"][value=\"individual\"]').check();\n      await page.locator('input[name=\"individual_mode\"][value=\"quick30\"]').check();\n      const gross = root.locator('[data-estimate-gross]');"
if replacement not in text:
    if block not in text:
        raise RuntimeError("Responsive calculator test block not found")
    text = text.replace(block, replacement, 1)

before = "    await expect(page.locator('[data-pricing-ready=\"true\"]')).toHaveCount(1, { timeout: 10000 });\n  });"
after = "    await expect(page.locator('[data-pricing-ready=\"true\"]')).toHaveCount(1, { timeout: 10000 });\n    await page.locator('input[name=\"category\"][value=\"individual\"]').check();\n    await page.locator('input[name=\"individual_mode\"][value=\"quick30\"]').check();\n  });"
if after not in text:
    if before not in text:
        raise RuntimeError("Complete-strategy beforeEach block not found")
    text = text.replace(before, after, 1)

vat_before = "    await expect(page.locator('[data-pricing-ready=\"true\"]')).toHaveCount(1, { timeout: 10000 });\n    await form.locator('[name=\"customer_type\"]').selectOption('business');"
vat_after = "    await expect(page.locator('[data-pricing-ready=\"true\"]')).toHaveCount(1, { timeout: 10000 });\n    await form.locator('input[name=\"category\"][value=\"individual\"]').check();\n    await form.locator('input[name=\"individual_mode\"][value=\"quick30\"]').check();\n    await form.locator('[name=\"customer_type\"]').selectOption('business');"
if vat_after not in text:
    if vat_before not in text:
        raise RuntimeError("Localized VAT test block not found")
    text = text.replace(vat_before, vat_after, 1)
test_file.write_text(text, encoding="utf-8")

print("Zero-start calculator patch applied.")
