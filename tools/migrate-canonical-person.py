from pathlib import Path

CANONICAL = "https://www.norbertbanhalmi.com/about/"
OLD_VALUES = (
    "https://www.banhalmi.art/norbert-banhalmi#person",
    "https://banhalmi.art/norbert-banhalmi#person",
    "http://www.banhalmi.art/norbert-banhalmi#person",
    "http://banhalmi.art/norbert-banhalmi#person",
    "https://www.banhalmi.art/norbert-banhalmi/",
    "https://banhalmi.art/norbert-banhalmi/",
    "https://www.banhalmi.art/norbert-banhalmi",
    "https://banhalmi.art/norbert-banhalmi",
)
EXTENSIONS = {
    ".html", ".htm", ".json", ".jsonld", ".txt", ".md", ".mjs", ".js",
    ".cjs", ".xml", ".yaml", ".yml", ".css", ".svg", ".webmanifest", ".csv"
}
SPECIAL = {"_redirects", "robots.txt", "CNAME", "vercel.json"}
SELF = Path(__file__).resolve()
changed = []

for file in Path(".").rglob("*"):
    if not file.is_file() or file.resolve() == SELF:
        continue
    if any(part in {".git", "node_modules", "playwright-report", "test-results"} for part in file.parts):
        continue
    if file.suffix.lower() not in EXTENSIONS and file.name not in SPECIAL:
        continue
    try:
        text = file.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    original = text
    for old in OLD_VALUES:
        text = text.replace(old, CANONICAL)
    if text != original:
        file.write_text(text, encoding="utf-8")
        changed.append(str(file))

Path(".canonical-person-migration").unlink(missing_ok=True)
SELF.unlink(missing_ok=True)
print(f"Migrated {len(changed)} BANHALMI files to {CANONICAL}")
