#!/usr/bin/env python3
"""Собирает index.html: шаблон src/page.html + общие части из src/shared/
(данные напитков, карточки, музыка, книга рецептов, крупный план, барная карта)
+ 3D-сцена из src/js/*.js (склеиваются по порядку имён)."""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
S = ROOT / "src"
read = lambda p: p.read_text(encoding="utf-8")
scene = "\n".join(read(p) for p in sorted((S / "js").glob("*.js")))
out = (read(S / "page.html")
       .replace("/*@@CSS@@*/", read(S / "shared" / "style.css"))
       .replace("<!--@@BUTTONS@@-->", read(S / "shared" / "buttons.html"))
       .replace("<!--@@HTML@@-->", read(S / "shared" / "dialogs.html"))
       .replace("/*@@SHARED@@*/", read(S / "shared" / "shared.js"))
       .replace("/*@@SCENE@@*/", scene))
assert "@@" not in out, re.findall(r".{20}@@.{20}", out)
(ROOT / "index.html").write_text(out, encoding="utf-8")
print("index.html", len(out.encode()), "bytes")
