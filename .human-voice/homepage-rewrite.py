#!/usr/bin/env python3
"""Apply natural human-voice rewrites to the three homepages."""
from pathlib import Path
import json

HERE = Path(__file__).resolve().parent
pairs = json.loads((HERE / "homepage-voice-pairs.json").read_text(encoding="utf-8"))

FILES = {
    "index.html": pairs["en"],
    "hu/index.html": pairs["hu"],
    "de-at/index.html": pairs["de"],
}

def main():
    root = HERE.parent
    for rel, file_pairs in FILES.items():
        path = root / rel
        text = path.read_text(encoding="utf-8")
        for old, new in file_pairs:
            count = text.count(old)
            if count != 1:
                raise SystemExit(f"{rel}: expected 1 match, found {count} for: {old[:60]!r}")
            text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")
        print(f"updated {rel}")

if __name__ == "__main__":
    main()
