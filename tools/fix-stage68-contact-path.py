from pathlib import Path
repls={
'index.html':('href="https://meet.bookipi.com/zk5ly35r" target="_blank" rel="noopener"><strong>I am not sure yet</strong><span>Tell us the situation in a 15-minute video call and we will identify the simplest next step.</span><em>Book 15 minutes →</em>', 'href="/contact/"><strong>I am not sure yet</strong><span>Choose a 15-minute video call or send us a message. We will identify the simplest next step.</span><em>Call or message →</em>'),
'hu/index.html':('href="https://meet.bookipi.com/zk5ly35r" target="_blank" rel="noopener"><strong>Még nem vagyok biztos benne</strong><span>15 percben mondja el a helyzetet, és megmutatjuk a legegyszerűbb következő lépést. A foglalási felület angol nyelvű.</span><em>15 perces beszélgetés →</em>', 'href="/hu/kapcsolat/"><strong>Még nem vagyok biztos benne</strong><span>Válasszon 15 perces videóhívást vagy írjon üzenetet. Segítünk megtalálni a legegyszerűbb következő lépést.</span><em>Hívás vagy üzenet →</em>'),
'de-at/index.html':('href="https://meet.bookipi.com/zk5ly35r" target="_blank" rel="noopener"><strong>Ich bin noch nicht sicher</strong><span>Schildern Sie uns Ihre Situation in 15 Minuten; wir zeigen den einfachsten nächsten Schritt. Die Buchungsoberfläche ist auf Englisch.</span><em>15 Minuten buchen →</em>', 'href="/de-at/kontakt/"><strong>Ich bin noch nicht sicher</strong><span>Wählen Sie ein 15-minütiges Videogespräch oder schreiben Sie uns. Wir zeigen den einfachsten nächsten Schritt.</span><em>Gespräch oder Nachricht →</em>')}
for file,(old,new) in repls.items():
    p=Path(file); text=p.read_text()
    if old not in text: raise SystemExit(f'{file}: expected Stage 68 uncertainty card not found')
    p.write_text(text.replace(old,new,1))
