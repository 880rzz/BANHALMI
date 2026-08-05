import fs from 'node:fs';

const path='tests/quote-calculator.spec.mjs';
let source=fs.readFileSync(path,'utf8');
const before=`      const after = amount(await gross.textContent());
      expect(after).toBeGreaterThan(0);
      expect(amount(await page.locator('input[name="estimate_gross"]').inputValue())).toBeCloseTo(after, 1);`;
const after=`      const after = amount(await gross.textContent());
      expect(after).toBeGreaterThan(0);
      const visibleAmountField = route.lang === 'hu' ? 'estimate_display_gross' : 'estimate_gross';
      expect(amount(await page.locator(\`input[name="\${visibleAmountField}"]\`).inputValue())).toBeCloseTo(after, 1);`;
const count=source.split(before).length-1;
if(count!==1)throw new Error('Expected one legacy visible/canonical currency assertion, found '+count);
source=source.replace(before,after);
fs.writeFileSync(path,source);
fs.rmSync('tools/_fix-huf-browser-test.mjs');
fs.rmSync('.github/workflows/_fix-huf-browser-test.yml');
