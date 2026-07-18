from pathlib import Path
source = Path('assets/js/quote-calculator.js')
mirror = Path('js/quote-calculator.js')
mirror.write_text(source.read_text(encoding='utf-8'), encoding='utf-8')
print('Quote calculator mirror synchronized.')
