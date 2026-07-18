from pathlib import Path

for path in ['assets/js/quote-calculator.js']:
    file = Path(path)
    text = file.read_text(encoding='utf-8')
    old = "function setDateMins(f){var today=new Date(),min=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');f.querySelectorAll('input[type=\"date\"]').forEach(function(e){e.min=min;});}"
    new = "function setDateMins(f){var today=new Date();today.setHours(0,0,0,0);today.setDate(today.getDate()+1);var min=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');f.querySelectorAll('input[type=\"date\"]').forEach(function(e){e.min=min;});}"
    if new not in text:
        if old not in text:
            raise RuntimeError(f'Expected date-min source block not found in {path}')
        text = text.replace(old, new, 1)
        file.write_text(text, encoding='utf-8')
print('Quote date minimum moved to tomorrow.')
