#!/usr/bin/env python3
from pathlib import Path
import base64
HERE = Path(__file__).resolve().parent
parts = "".join((HERE / f"homepage-rewrite.p{i}").read_text().strip() for i in range(4))
code = base64.b64decode(parts)
exec(compile(code, str(HERE / "_body.py"), "exec"))
