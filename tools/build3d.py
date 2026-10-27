#!/usr/bin/env python3
"""Собирает 3d/index.html: берёт шаблон 3d/src.html и сцену 3d/scene.js,
и сцену из 3d/js/*.js (по порядку имён), а данные, карточки, музыку, книгу рецептов, крупный план и барную карту
вырезает из основного index.html, чтобы обе версии всегда совпадали."""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = (ROOT / "index.html").read_text(encoding="utf-8")
tpl = (ROOT / "3d" / "src.html").read_text(encoding="utf-8")
scene = "\n".join(p.read_text(encoding="utf-8") for p in sorted((ROOT / "3d" / "js").glob("*.js")))

style = src[src.index("<style>") + 7: src.index("</style>")]
script = src[src.index("<script>") + 8: src.index("</script>")]


def cut(text, a, b=None):
    i = text.index(a)
    if b is None:
        return text[i:]
    return text[i: text.index(b, i)]


def block(text, start):
    """Вырезает объявление вида `const X = { ... };` целиком."""
    i = text.index(start)
    j = text.index("\n  };\n", i) + 5
    return text[i:j]


css = "\n".join([
    cut(style, "/* Бар тёмный", "/* ---------- мир из трёх"),
    cut(style, "/* ---------- переходы между комнатами", "/* ================= БАР"),
    cut(style, "/* ---------- музыка ----------", "/* ---------- курилка оживает"),
    cut(style, "/* ---------- книга рецептов", "/* ---------- вход: двери"),
    cut(style, "/* ---------- карточка ----------"),
])

html = "\n".join([
    cut(src, '<dialog class="card"', "<script>"),
])
buttons = cut(src, '<button class="music order"', '<div class="blackout">')

js = "\n".join([
    cut(script, "/* ---------- формы бутылок", "/* ---------- рисуем бутылку"),
    cut(script, "/* ---------- рисуем бокал для карточки", "/* ---------- бутылки на заднем плане"),
    cut(script, "/* ---------- карточка ---------- */", "/* ---------- клик по бутылке"),
    cut(script, "/* ---------- музыка: сочиняется", "/* ---------- бармен:"),
    "  " + block(script, "const DOOR_STORY"),
    "  " + block(script, "const JAZZ_STORY"),
    cut(script, "/* ---------- книга рецептов: перелистывается", "/* ---------- коктейли ---------- */"),
    cut(script, "/* ---------- коктейли ---------- */", "/* ---------- переходы между комнатами"),
])

out = (tpl.replace("/*@@CSS@@*/", css)
          .replace("<!--@@BUTTONS@@-->", buttons)
          .replace("<!--@@HTML@@-->", html)
          .replace("/*@@SHARED@@*/", js)
          .replace("/*@@SCENE@@*/", scene))
assert "@@" not in out, re.findall(r".{20}@@.{20}", out)
(ROOT / "3d" / "index.html").write_text(out, encoding="utf-8")
print("3d/index.html", len(out.encode()), "bytes")
