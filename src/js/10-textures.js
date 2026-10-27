/* ================= текстуры: всё рисуется в браузере, без чужих картинок ================= */
function canvasTex(w, h, draw, { color = true, repeat = null } = {}) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = ANISO;
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  return t;
}
function speckle(g, w, h, n, alpha, light = "#fff", dark = "#000") {
  for (let i = 0; i < n; i++) {
    g.globalAlpha = R(0, alpha);
    g.fillStyle = rng() < .5 ? light : dark;
    const s = R(1, 3);
    g.fillRect(rng() * w, rng() * h, s, s);
  }
  g.globalAlpha = 1;
}
/* волокна дерева: волнистые линии, повторяются по горизонтали без шва */
function grain(g, x, y, w, h, dark, light, n) {
  for (let i = 0; i < n; i++) {
    const yy = y + rng() * h, amp = R(1, h / 14), f = Math.ceil(R(.5, 3)), ph = R(0, 6.3);
    g.globalAlpha = R(.06, .3);
    g.strokeStyle = rng() < .65 ? dark : light;
    g.lineWidth = R(.6, 2.6);
    g.beginPath();
    for (let xx = 0; xx <= w; xx += 6) {
      const v = yy + Math.sin(xx / w * Math.PI * 2 * f + ph) * amp;
      xx ? g.lineTo(x + xx, v) : g.moveTo(x, v);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
}
function woodTex(base, dark, light) {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    grain(g, 0, 0, w, h, dark, light, 140);
    speckle(g, w, h, 900, .08);
  });
}
const TEX = {};
TEX.walnut = woodTex("#4a2a18", "#1a0b05", "#7a4a2a");
TEX.darkwood = woodTex("#2a170d", "#0c0503", "#5a3520");
TEX.oak = woodTex("#6a4426", "#2a170a", "#9a6a3e");

/* паркет: доски разной длины и оттенка */
TEX.floor = canvasTex(1024, 1024, (g, w, h) => {
  const rows = 8, rh = h / rows;
  for (let r = 0; r < rows; r++) {
    let x = -R(0, 400);
    while (x < w) {
      const len = R(260, 620), l = R(20, 34), hue = R(16, 26);
      g.fillStyle = `hsl(${hue} 45% ${l * .55}%)`;
      g.fillRect(x, r * rh, len, rh);
      g.save(); g.beginPath(); g.rect(x, r * rh, len, rh); g.clip();
      grain(g, x, r * rh, len, rh, "#0a0402", "#8a5a34", 26);
      g.restore();
      g.fillStyle = "rgba(0,0,0,.75)";
      g.fillRect(x, r * rh, 3, rh);
      x += len;
    }
    g.fillStyle = "rgba(0,0,0,.8)";
    g.fillRect(0, r * rh, w, 3);
  }
  speckle(g, w, h, 3000, .06);
}, { repeat: [7, 5] });

/* обои с дамасским узором */
function damask(base, ink, hi) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 1400, .05);
    const motif = (cx, cy, s) => {
      g.save(); g.translate(cx, cy); g.scale(s, s);
      for (const m of [1, -1]) {
        g.save(); g.scale(m, 1);
        g.fillStyle = ink;
        g.beginPath();
        g.moveTo(0, -70); g.bezierCurveTo(34, -58, 46, -22, 16, -4);
        g.bezierCurveTo(46, 4, 52, 36, 22, 50); g.bezierCurveTo(10, 56, 4, 62, 0, 74); g.closePath(); g.fill();
        g.fillStyle = base;
        g.beginPath(); g.moveTo(0, -46); g.bezierCurveTo(18, -38, 22, -18, 6, -8); g.bezierCurveTo(22, 4, 26, 26, 8, 34); g.lineTo(0, 46); g.closePath(); g.fill();
        g.fillStyle = ink;
        g.beginPath(); g.ellipse(34, -34, 7, 15, -.6, 0, 7); g.fill();
        g.beginPath(); g.ellipse(38, 30, 6, 12, .6, 0, 7); g.fill();
        g.restore();
      }
      g.fillStyle = hi;
      g.beginPath(); g.arc(0, 0, 5, 0, 7); g.fill();
      g.restore();
    };
    motif(128, 128, .9);
    for (const [x, y] of [[0, 0], [256, 0], [0, 256], [256, 256]]) motif(x, y, .9);
  });
}
TEX.wallBar = damask("#3a0d14", "#4f141d", "#6a2028");
TEX.wallNook = damask("#132119", "#1c3024", "#2a4232");
TEX.wallSmoke = damask("#2a1410", "#3a1c15", "#523022");

/* кожа и бархат */
TEX.leather = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = "#d4d4d4"; g.fillRect(0, 0, w, h);
  speckle(g, w, h, 5000, .12);
  // стёжка честерфилда: ромбы с пуговицами
  g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 3;
  for (let i = -1; i < 3; i++) {
    g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128 + 128, 128); g.lineTo(i * 128, 256); g.stroke();
    g.beginPath(); g.moveTo(i * 128 + 128, 0); g.lineTo(i * 128, 128); g.lineTo(i * 128 + 128, 256); g.stroke();
  }
  g.fillStyle = "rgba(0,0,0,.6)";
  for (const [x, y] of [[0, 0], [128, 128], [256, 0], [0, 256], [256, 256], [128, 0], [0, 128], [256, 128], [128, 256]]) {
    if ((x + y) % 256 !== 0 && !(x === 128 && y === 128)) continue;
    g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill();
  }
});
TEX.velvet = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = "#d8d8d8"; g.fillRect(0, 0, w, h);
  speckle(g, w, h, 3000, .1);
});

/* персидский ковёр */
function rugTex(base, border, accent, gold) {
  return canvasTex(512, 768, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const band = (m, c, wd) => { g.strokeStyle = c; g.lineWidth = wd; g.strokeRect(m, m, w - 2 * m, h - 2 * m); };
    band(18, border, 34); band(40, gold, 4); band(58, accent, 10); band(74, gold, 3);
    // мотивы на кайме
    g.fillStyle = gold;
    for (let x = 30; x < w - 20; x += 26) { g.beginPath(); g.arc(x, 18, 5, 0, 7); g.arc(x, h - 18, 5, 0, 7); g.fill(); }
    for (let y = 30; y < h - 20; y += 26) { g.beginPath(); g.arc(18, y, 5, 0, 7); g.arc(w - 18, y, 5, 0, 7); g.fill(); }
    // медальон
    g.save(); g.translate(w / 2, h / 2);
    for (const [s, c] of [[1, border], [.78, gold], [.7, accent], [.45, gold], [.38, base], [.2, border]]) {
      g.fillStyle = c; g.beginPath();
      g.moveTo(0, -200 * s); g.lineTo(130 * s, 0); g.lineTo(0, 200 * s); g.lineTo(-130 * s, 0); g.closePath(); g.fill();
    }
    g.restore();
    // мелкий узор поля
    g.fillStyle = accent; g.globalAlpha = .5;
    for (let y = 110; y < h - 100; y += 44) for (let x = 110; x < w - 100; x += 44) {
      if (Math.abs(x - w / 2) / 130 + Math.abs(y - h / 2) / 200 < 1.1) continue;
      g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 8, y); g.lineTo(x, y + 8); g.lineTo(x - 8, y); g.fill();
    }
    g.globalAlpha = 1;
    speckle(g, w, h, 9000, .14);
  });
}
TEX.rugRed = rugTex("#5a1016", "#1d1b3a", "#8a2a1e", "#c49a52");
TEX.rugGreen = rugTex("#1b3326", "#3a1012", "#2f5a3c", "#b8924c");

/* мягкое свечение для спрайтов */
TEX.glow = canvasTex(128, 128, (g, w, h) => {
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(.25, "rgba(255,255,255,.45)");
  r.addColorStop(.6, "rgba(255,255,255,.1)"); r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r; g.fillRect(0, 0, w, h);
});
TEX.puff = canvasTex(128, 128, (g, w, h) => {
  for (let i = 0; i < 18; i++) {
    const x = 64 + R(-22, 22), y = 64 + R(-22, 22), rr = R(18, 40);
    const r = g.createRadialGradient(x, y, 0, x, y, rr);
    r.addColorStop(0, "rgba(255,255,255,.18)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, w, h);
  }
});
const glowSprite = (color, size, x, y, z, parent = world, op = 1) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color, transparent: true, opacity: op,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }));
  s.scale.set(size, size, 1);
  s.position.set(x, y, z);
  parent.add(s);
  return s;
};

/* корешки книг: светлая основа, её окрашивает цвет каждой книги */
TEX.spine = canvasTex(64, 256, (g, w, h) => {
  g.fillStyle = "#d8d8d8"; g.fillRect(0, 0, w, h);
  speckle(g, w, h, 600, .15);
  g.fillStyle = "rgba(0,0,0,.45)";
  g.fillRect(0, 22, w, 10); g.fillRect(0, h - 40, w, 10);
  g.fillStyle = "rgba(255,240,200,.9)";
  g.fillRect(0, 34, w, 3); g.fillRect(0, 18, w, 2); g.fillRect(0, h - 28, w, 3);
  g.fillRect(w * .3, 80, w * .4, 60);
  g.fillStyle = "rgba(0,0,0,.25)";
  g.fillRect(0, 0, 6, h); g.fillRect(w - 6, 0, 6, h);
});

/* картина над камином: ночная гавань маслом */
TEX.painting = canvasTex(512, 384, (g, w, h) => {
  const sky = g.createLinearGradient(0, 0, 0, h * .6);
  sky.addColorStop(0, "#0d1428"); sky.addColorStop(1, "#3a2a3a");
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  const moon = g.createRadialGradient(360, 90, 4, 360, 90, 120);
  moon.addColorStop(0, "rgba(255,236,190,1)"); moon.addColorStop(.12, "rgba(255,220,160,.8)"); moon.addColorStop(1, "rgba(255,200,140,0)");
  g.fillStyle = moon; g.fillRect(0, 0, w, h);
  const sea = g.createLinearGradient(0, h * .6, 0, h);
  sea.addColorStop(0, "#1a1a2a"); sea.addColorStop(1, "#05070d");
  g.fillStyle = sea; g.fillRect(0, h * .6, w, h * .4);
  g.strokeStyle = "rgba(255,220,160,.5)";
  for (let i = 0; i < 40; i++) { const y = h * .62 + i * 3.4, x = 360 + R(-30, 30); g.lineWidth = R(1, 2.5); g.beginPath(); g.moveTo(x - R(10, 40), y); g.lineTo(x + R(10, 40), y); g.stroke(); }
  g.fillStyle = "#06070b";
  g.beginPath(); g.moveTo(90, h * .6); g.lineTo(230, h * .6); g.lineTo(212, h * .66); g.lineTo(104, h * .66); g.fill();
  g.fillRect(150, h * .2, 4, h * .4); g.fillRect(120, h * .3, 3, h * .3);
  g.beginPath(); g.moveTo(154, h * .22); g.lineTo(210, h * .55); g.lineTo(154, h * .55); g.fill();
  g.fillStyle = "#ffcc7a"; g.fillRect(180, h * .62, 3, 3);
  g.fillStyle = "#07080c"; g.beginPath(); g.moveTo(0, h * .6); g.lineTo(0, h * .48); g.lineTo(40, h * .52); g.lineTo(70, h * .45); g.lineTo(80, h * .6); g.fill();
  // мазки
  for (let i = 0; i < 2200; i++) { g.globalAlpha = R(0, .07); g.fillStyle = rng() < .5 ? "#fff" : "#000"; g.fillRect(rng() * w, rng() * h, R(2, 9), R(1, 3)); }
  g.globalAlpha = 1;
  const vg = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, w * .7);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.6)");
  g.fillStyle = vg; g.fillRect(0, 0, w, h);
});

/* циферблат */
TEX.clock = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = "#efe2c4"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill();
  g.strokeStyle = "#3a2410"; g.lineWidth = 4; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.stroke();
  g.fillStyle = "#2a1a10"; g.font = "28px Forum, Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
  const rom = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  rom.forEach((t, i) => { const a = i / 12 * Math.PI * 2; g.fillText(t, 128 + Math.sin(a) * 88, 128 - Math.cos(a) * 88); });
});

/* глобус: старинная карта сепией */
TEX.globe = canvasTex(512, 256, (g, w, h) => {
  g.fillStyle = "#b8a072"; g.fillRect(0, 0, w, h);
  const blobs = [[80, 70, 60, 40], [120, 160, 40, 60], [250, 80, 70, 40], [270, 150, 40, 50], [380, 80, 90, 45], [420, 170, 40, 25], [300, 220, 120, 14]];
  g.fillStyle = "#6e5432";
  for (const [x, y, rx, ry] of blobs) for (let k = 0; k < 26; k++) {
    g.beginPath(); g.ellipse(x + R(-rx, rx) * .7, y + R(-ry, ry) * .7, R(rx * .2, rx * .5), R(ry * .2, ry * .5), R(0, 3), 0, 7); g.fill();
  }
  g.strokeStyle = "rgba(60,40,20,.45)"; g.lineWidth = 1;
  for (let i = 1; i < 12; i++) { g.beginPath(); g.moveTo(i * w / 12, 0); g.lineTo(i * w / 12, h); g.stroke(); }
  for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); }
  speckle(g, w, h, 4000, .12);
});

/* бумага с рукописными строками */
function paperTex(lines = 14, title = "") {
  return canvasTex(256, 340, (g, w, h) => {
    g.fillStyle = "#ece0c2"; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 1600, .08);
    if (title) { g.fillStyle = "#4a1a12"; g.font = "30px Forum, Georgia, serif"; g.textAlign = "center"; g.fillText(title, w / 2, 52); }
    g.strokeStyle = "rgba(40,24,16,.55)"; g.lineWidth = 1.6;
    for (let i = 0; i < lines; i++) {
      const y = (title ? 90 : 40) + i * 18; let x = 26;
      g.beginPath(); g.moveTo(x, y);
      while (x < w - 30 - (i % 5 === 4 ? 80 : 0)) { x += R(4, 9); g.lineTo(x, y + R(-2, 2)); }
      g.stroke();
    }
  });
}
TEX.letter = paperTex(15);
TEX.page = paperTex(13);
TEX.news = canvasTex(256, 320, (g, w, h) => {
  g.fillStyle = "#d9d1bc"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#1a1612"; g.font = "bold 26px Georgia, serif"; g.textAlign = "center"; g.fillText("THE DAILY", w / 2, 36);
  g.fillRect(16, 46, w - 32, 2);
  g.font = "bold 16px Georgia, serif"; g.fillText("PROHIBITION ENDS", w / 2, 70);
  g.fillStyle = "rgba(20,16,12,.55)";
  for (let c = 0; c < 3; c++) for (let i = 0; i < 16; i++) g.fillRect(16 + c * 78, 86 + i * 13, 70 - (i % 6 === 5 ? 30 : 0), 4);
});
