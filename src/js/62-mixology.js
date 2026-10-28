/* ================= шоу бармена: каждый коктейль он готовит сам, в 3D, и всякий раз по-своему ================= */
const SHOW = { on: false, gen: 0, fast: false, served: false, ran: false, glass: null, main: null, last: "" };
const ABORT = { abort: true };
let SG = 0;
const rr = (a, b) => a + Math.random() * (b - a);
const chance = p => Math.random() < p;
const choose = list => list[Math.floor(Math.random() * list.length)];
function live() { if (SHOW.gen !== SG) throw ABORT; }
async function ws(s) { await sleep(SHOW.fast ? s * .05 : s); live(); }
const PROG = () => Closeup.PROGRAMS;

/* ---------- материалы и реквизит ---------- */
const MX = {
  glass: std({ color: 0xf2f6ff, transparent: true, opacity: .26, roughness: .02, envMapIntensity: 2.6, side: THREE.DoubleSide, depthWrite: false }),
  ice: std({ color: 0xf4faff, transparent: true, opacity: .55, roughness: .05, envMapIntensity: 2, depthWrite: false }),
  frost: std({ color: 0xdfe6ea, metalness: .55, roughness: .55, envMapIntensity: 1 }),
  wood: std({ color: 0x5a3420, roughness: .6 }),
  stream: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .85 })
};
const cubeGeo = new RoundedBoxGeometry(.026, .026, .026, 2, .006);
const smallCube = new RoundedBoxGeometry(.014, .014, .014, 1, .004);
const P = {};
function vesselMesh(profile, mat, liq) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(lathe(profile, 28), mat));
  const V = { g, ml: 0, col: new THREE.Color(0xffffff), ice: [], liq: null, y0: liq[2], y1: liq[3], r: liq[1], cap: liq[4] || 200 };
  const lg = new THREE.CylinderGeometry(liq[1], liq[0], 1, 24);
  lg.translate(0, .5, 0);
  V.liq = new THREE.Mesh(lg, std({ color: 0xffffff, transparent: true, opacity: .82, roughness: .15, emissive: 0x000000 }));
  V.liq.renderOrder = 4;
  V.liq.position.y = liq[2];
  V.liq.scale.y = .0001;
  V.liq.visible = false;
  g.add(V.liq);
  g.children[0].renderOrder = 5;
  V.mouthY = profile[profile.length - 1][1];
  world.add(g);
  g.visible = false;
  return V;
}
function setLevel(V) {
  if (!V.liq) return;
  const f = clamp(V.ml / V.cap, 0, .93);
  V.liq.visible = f > .002;
  V.liq.scale.y = Math.max(.0001, f * (V.y1 - V.y0));
  V.liq.material.color.copy(V.col);
  V.liq.material.emissive.copy(V.col).multiplyScalar(.22);
}
const mouth = V => V.g.localToWorld(V3(0, V.mouthY, 0));
(() => {
  // шейкер: большой и малый стаканы
  P.tin = vesselMesh([[0, 0], [.043, 0], [.044, .004], [.048, .175], [.05, .178]], M.chrome, [.04, .046, .004, .17, 520]);
  P.tin.g.children[0].material = M.chrome;
  P.cap = { g: new THREE.Group() };
  P.cap.g.add(new THREE.Mesh(lathe([[0, 0], [.036, 0], [.037, .004], [.042, .12], [.043, .123]], 24), M.chrome));
  world.add(P.cap.g); P.cap.g.visible = false;
  P.mixer = vesselMesh([[0, 0], [.046, 0], [.047, .006], [.049, .15], [.05, .152]], MX.glass, [.043, .046, .008, .145, 420]);
  // джиггер, ложка, стрейнер, мадлер
  P.jig = { g: new THREE.Group(), top: .09 };
  P.jig.g.add(new THREE.Mesh(lathe([[.017, 0], [.024, .002], [.009, .045], [.024, .088], [.025, .09]], 18), M.chrome));
  P.jig.liq = mesh(new THREE.CylinderGeometry(.021, .012, .03, 14), std({ color: 0xffffff, transparent: true, opacity: .85 }), 0, .07, 0, P.jig.g);
  P.jig.liq.visible = false;
  world.add(P.jig.g); P.jig.g.visible = false;
  P.spoon = { g: new THREE.Group() };
  const sp = [new THREE.CylinderGeometry(.0028, .0028, .3, 6)];
  sp[0].translate(0, -.15, 0);
  const bowl = new THREE.SphereGeometry(.011, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); bowl.scale(1, .5, 1.6); bowl.translate(0, -.302, 0); sp.push(bowl);
  const knob = new THREE.SphereGeometry(.006, 8, 6); sp.push(knob);
  P.spoon.g.add(new THREE.Mesh(mergeGeometries(sp.map(x => x.toNonIndexed())), M.chrome));
  world.add(P.spoon.g); P.spoon.g.visible = false;
  P.strainer = { g: new THREE.Group() };
  const sg = [new THREE.CylinderGeometry(.047, .047, .003, 24), new THREE.TorusGeometry(.04, .004, 6, 20)];
  sg[1].rotateX(Math.PI / 2); sg[1].translate(0, -.006, 0);
  const handle = new THREE.BoxGeometry(.016, .003, .1); handle.translate(0, 0, .085); sg.push(handle);
  P.strainer.g.add(new THREE.Mesh(mergeGeometries(sg.map(x => x.toNonIndexed())), M.chrome));
  world.add(P.strainer.g); P.strainer.g.visible = false;
  P.muddler = { g: new THREE.Group() };
  const mg = new THREE.CylinderGeometry(.012, .016, .22, 12); mg.translate(0, -.11, 0);
  P.muddler.g.add(new THREE.Mesh(mg, MX.wood));
  world.add(P.muddler.g); P.muddler.g.visible = false;
  // ведёрко со льдом
  P.bucket = { g: new THREE.Group() };
  P.bucket.g.add(new THREE.Mesh(lathe([[0, 0], [.07, 0], [.075, .01], [.09, .14], [.094, .145]], 28), M.chrome));
  const bi = new THREE.InstancedMesh(cubeGeo, MX.ice, 14), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < 14; i++) { m4.compose(V3(R(-.05, .05), .1 + R(0, .04), R(-.05, .05)), q.setFromEuler(e.set(R(0, 3), R(0, 3), 0)), V3(1, 1, 1)); bi.setMatrixAt(i, m4); }
  P.bucket.g.add(bi);
  world.add(P.bucket.g); P.bucket.g.visible = false;
  // доска с гарниром
  P.tray = { g: new THREE.Group() };
  const t = P.tray.g;
  t.add(new THREE.Mesh(new RoundedBoxGeometry(.24, .02, .14, 2, .006), MX.wood));
  for (let i = 0; i < 3; i++) mesh(new THREE.CylinderGeometry(.024, .024, .006, 18), std({ color: 0x9fc23a, roughness: .5 }), -.08 + i * .03, .014 + i * .002, -.03, t).rotation.z = .2;
  for (let i = 0; i < 3; i++) mesh(new THREE.SphereGeometry(.011, 10, 8), std({ color: 0x9a0f1e, roughness: .25 }), .04 + i * .022, .02, -.035, t);
  for (let i = 0; i < 3; i++) { const o = mesh(new THREE.SphereGeometry(.011, 10, 8), std({ color: 0x7a8a2a, roughness: .35 }), .03 + i * .025, .02, .03, t); o.scale.set(1, .8, 1); }
  mesh(new THREE.CylinderGeometry(.024, .024, .006, 18), std({ color: 0xf08a22, roughness: .5 }), -.06, .016, .035, t).rotation.z = -.15;
  world.add(t); t.visible = false;
  // солонка для ободка
  P.salt = mesh(new THREE.CylinderGeometry(.06, .055, .012, 24), std({ color: 0xf2f0ea, roughness: .9 }), 0, 0, 0);
  P.salt.visible = false;
})();
const PROPS = () => [P.tin.g, P.cap.g, P.mixer.g, P.jig.g, P.spoon.g, P.strainer.g, P.muddler.g, P.bucket.g, P.tray.g, P.salt];

/* бутылка для ингредиента: появляется из рейла под стойкой */
const BKIND = { spirit: "tall", square: "square", flask: "flask", squat: "squat", wine: "bordeaux", dash: "bordeaux", soda: "round", squeeze: "squeeze", carafe: "carafe" };
function makeBottle(ing) {
  const L = Closeup.LOOK[ing] || { kind: "spirit", glass: "#2a1a10", liq: "#c27a1a" };
  const g = new THREE.Group();
  let top = .3;
  if (L.kind === "carafe") {
    g.add(new THREE.Mesh(lathe([[0, 0], [.045, 0], [.05, .02], [.05, .14], [.03, .2], [.028, .24], [.034, .25]], 24), MX.glass));
    mesh(new THREE.CylinderGeometry(.046, .046, .12, 20), std({ color: L.liq, transparent: true, opacity: .85, roughness: .2 }), 0, .075, 0, g);
    top = .25;
  } else if (L.kind === "squeeze") {
    mesh(new THREE.CylinderGeometry(.032, .032, .15, 18), std({ color: L.glass, transparent: (L.op || 1) < 1, opacity: Math.max(.5, L.op || 1), roughness: .3 }), 0, .075, 0, g);
    if ((L.op || 1) < .6) mesh(new THREE.CylinderGeometry(.03, .03, .1, 16), std({ color: L.liq, roughness: .3 }), 0, .052, 0, g);
    mesh(new THREE.CylinderGeometry(.008, .02, .05, 12), std({ color: 0xe8e2d0, roughness: .4 }), 0, .175, 0, g);
    if (L.label) mesh(new THREE.CylinderGeometry(.0325, .0325, .05, 18, 1, true), std({ color: L.label }), 0, .08, 0, g);
    top = .2;
  } else {
    const shape = BKIND[L.kind] || "tall", s = L.kind === "dash" ? .55 : L.kind === "soda" ? .8 : 1;
    const b = new THREE.Mesh(BGEO[shape], std({ color: L.glass, transparent: (L.op || 1) < 1, opacity: Math.max(.45, L.op || .95), roughness: .06, metalness: .1, envMapIntensity: 2 }));
    b.scale.setScalar(s); g.add(b);
    if (L.label) mesh(BOTTLE[shape].seg === 4 ? new THREE.BoxGeometry(bodyR(shape) * 1.3 * s, .07 * s, bodyR(shape) * 1.3 * s) : new THREE.CylinderGeometry(bodyR(shape) * 1.01 * s, bodyR(shape) * 1.01 * s, .07 * s, 20, 1, true), std({ color: L.label, roughness: .7 }), 0, .1 * s, 0, g);
    top = neckTop(shape) * s;
    mesh(new THREE.CylinderGeometry(.008, .006, .03, 8), M.chrome, 0, top + .012, 0, g);   // гейзер-носик
    top += .026;
  }
  g.userData.top = top;
  g.userData.col = new THREE.Color(L.liq || "#ffffff");
  world.add(g);
  return g;
}

/* ---------- струя ---------- */
const streamMesh = mesh(new THREE.CylinderGeometry(.0035, .0028, 1, 8, 1, true), MX.stream, 0, 0, 0);
streamMesh.visible = false;
streamMesh.renderOrder = 6;
const STREAM = { from: null, to: null, color: new THREE.Color() };
const _sa = V3(), _sb = V3(), _sd = V3(), _up = V3(0, 1, 0);
function streamOn(fromFn, toFn, color, width = 1) { STREAM.from = fromFn; STREAM.to = toFn; MX.stream.color.copy(color); streamMesh.scale.x = streamMesh.scale.z = width; streamMesh.visible = true; }
function streamOff() { streamMesh.visible = false; STREAM.from = null; }

/* ---------- прицел: держит предмет (или его точку) в нужном месте, подправляя руку ---------- */
const AIMS = new Set();
function aim(hold, pos, point = null, k = .35) {
  for (const a of AIMS) if (a.hold === hold) AIMS.delete(a);
  const a = { hold, pos: pos.clone(), point, k };
  AIMS.add(a);
  return a;
}
function unaim(hold) { for (const a of AIMS) if (a.hold === hold) AIMS.delete(a); }
const _ae = V3(), _ap = V3();
onTick(() => {
  for (const a of AIMS) {
    const o = a.hold.obj;
    o.updateMatrixWorld(true);
    if (a.point) o.localToWorld(_ap.copy(a.point)); else _ap.copy(o.position);
    _ae.subVectors(a.pos, _ap);
    if (_ae.lengthSq() > .25) _ae.setLength(.5);
    const c = Math.cos(-bt.face), s = Math.sin(-bt.face);
    a.hold.arm.tgt.x += (_ae.x * c + _ae.z * s) * a.k;
    a.hold.arm.tgt.y += _ae.y * a.k;
    a.hold.arm.tgt.z += (-_ae.x * s + _ae.z * c) * a.k;
  }
  if (streamMesh.visible && STREAM.from) {
    STREAM.from(_sa); STREAM.to(_sb);
    _sd.subVectors(_sb, _sa);
    const len = _sd.length();
    streamMesh.position.copy(_sa).addScaledVector(_sd, .5);
    streamMesh.scale.y = Math.max(.001, len);
    streamMesh.quaternion.setFromUnitVectors(_up, _sd.normalize());
  }
});

/* ---------- звуки ---------- */
function noiseHit(t, dur, freq, q, gain, type = "bandpass") {
  const c = fx(); if (!c) return;
  const len = Math.max(1, Math.floor(c.sampleRate * dur)), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = b; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = gain;
  s.connect(f).connect(g).connect(c.destination); s.start(c.currentTime + t);
}
const SND = {
  clink: () => { const c = fx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.frequency.value = rr(3200, 4200); g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25); o.connect(g).connect(c.destination); o.start(t); o.stop(t + .3); noiseHit(0, .05, 5000, 2, .08); },
  pour: dur => { for (let i = 0; i < dur * 14; i++) noiseHit(i / 14, .08, rr(700, 1400), 4, .05); },
  rattle: (dur, hz) => { for (let i = 0; i < dur * hz * 2; i++) noiseHit(i / (hz * 2), .06, rr(3500, 5200), 1.5, .13); },
  tap: () => noiseHit(0, .05, 1800, 3, .25),
  tick: () => noiseHit(0, .03, 2600, 5, .12),
  clap: () => noiseHit(0, .07, 1500, 1, .35, "highpass"),
  plop: () => { const c = fx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.frequency.setValueAtTime(500, t); o.frequency.exponentialRampToValueAtTime(1100, t + .08); g.gain.setValueAtTime(.09, t); g.gain.exponentialRampToValueAtTime(.0001, t + .12); o.connect(g).connect(c.destination); o.start(t); o.stop(t + .14); },
  tinkle: dur => { for (let i = 0; i < dur * 6; i++) setTimeout(() => SND.clink(), i * 170 + rr(0, 60)); }
};

/* ---------- станция ---------- */
const ST = {};
function station() {
  const bx = SEAT.on ? SEAT_X + .02 : 1.2;
  Object.assign(ST, {
    bx, bz: -3.06,
    glass: V3(bx - .15, CT.top, -2.58), serve: SEAT.on ? V3(SEAT_X + .08, CT.top, -2.12) : V3(bx - .15, CT.top, -2.24),
    tin: V3(bx + .1, CT.top, -2.62), jig: V3(bx + .3, CT.top, -2.5), spoon: V3(bx + .22, CT.top + .005, -2.42),
    strainer: V3(bx + .38, CT.top + .004, -2.42), bucket: V3(bx - .46, CT.top, -2.63), tray: V3(bx + .56, CT.top + .01, -2.55),
    rail: V3(bx - .32, .82, -2.98), salt: V3(bx - .34, CT.top + .006, -2.42)
  });
}
function home(obj, p) { obj.position.copy(p); obj.rotation.set(0, 0, 0); obj.visible = true; }

/* ---------- камера: каждый шаг — свой ракурс ---------- */
function angle(name) {
  const G = ST.glass, T = ST.tin, bx = ST.bx;
  if (SEAT.on) {
    const base = seatShot();
    if (name === "close") return framed({ pos: [SEAT_X + .05, 1.42, -1.62], tgt: [ST.bx - .05, 1.3, -2.9], span: 1.0, pull: .4 });
    if (name === "top") return framed({ pos: [T.x - .1, 1.66, -2.12], tgt: [T.x - .1, 1.2, -2.62], span: .75, pull: .3 });
    return base;
  }
  const A = {
    hero: { pos: [G.x + .2, 1.22, -1.98], tgt: [G.x - .02, 1.45, -2.85], span: .95, pull: .4 },
    over: { pos: [bx + .12, 1.56, -1.5], tgt: [bx, 1.3, -2.9], span: 1.45, pull: .6 },
    side: { pos: [bx + 1.3, 1.48, -2.4], tgt: [bx, 1.35, -2.8], span: 1.25, pull: .5 },
    top: { pos: [T.x + .38, 1.86, -1.72], tgt: [T.x - .04, 1.18, -2.66], span: 1.0, pull: .4 },
    face: { pos: [bx - .12, 1.6, -1.85], tgt: [bx, 1.55, -3.1], span: 1.1, pull: .5 },
    low: { pos: [bx - .45, 1.18, -2.0], tgt: [bx, 1.42, -2.9], span: 1.2, pull: .4 }
  }[name];
  return framed(A);
}
const SHOTS = {
  ice: ["over", "top", "side", "low"], jig: ["top", "hero", "side", "over", "low"], pour: ["hero", "side", "over"], top: ["hero", "side", "low"],
  dash: ["top", "hero"], shake: ["face", "over", "side", "low"], stir: ["hero", "low", "side"], strain: ["hero", "side", "low"],
  garnish: ["hero", "hero", "low", "top"], serve: ["over", "hero"], leaves: ["top", "over"], muddle: ["hero", "side"], squeeze: ["hero", "top"],
  rim: ["side", "hero"], float: ["hero", "low"], stirIn: ["hero", "low"]
};
function cut(step) {
  let list = SEAT.on ? (["shake", "jig", "garnish"].includes(step) ? ["seat", "close", "top", "seat"] : ["seat", "close", "seat"]) : (SHOTS[step] || ["over"]);
  let name = SHOW.force || choose(list);
  if (name === SHOW.last && list.length > 1) name = choose(list.filter(n => n !== name));
  SHOW.last = name;
  const s = angle(name);
  if (SHOW.fast) { setCam(s); return; }
  flyTo(s, rr(.8, 1.15), 0).then(() => {
    // медленный проезд, как в кино
    if (!SHOW.on) return;
    const d = Object.assign({}, s);
    d.px += rr(-.06, .06); d.py += rr(-.03, .03); d.pz += rr(-.05, .08);
    flyTo(d, rr(3, 5), 0);
  });
}

/* ---------- подписи ---------- */
const showUI = { root: document.getElementById("show-ui"), title: document.getElementById("show-title"), count: document.getElementById("show-count"), text: document.getElementById("show-text"), cap: document.getElementById("show-cap") };
document.getElementById("show-skip").addEventListener("click", () => { if (SHOW.on) { SHOW.fast = true; SHOW.gen++; } });
addEventListener("keydown", e => { if (e.key === "Escape" && SHOW.on) { SHOW.fast = true; SHOW.gen++; } });
function caption(count, text) {
  showUI.count.textContent = count;
  showUI.text.textContent = text;
  showUI.cap.classList.remove("show"); void showUI.cap.offsetWidth; showUI.cap.classList.add("show");
}
function stepCaption(st, c) {
  const { GEN, TOPACC, GNAME } = Closeup;
  switch (st[0]) {
    case "ice": return st[2] ? "Засыпаем колотый лёд" : st[1] === "tin" ? "Лёд в шейкер" : st[1] === "mixer" ? "Лёд в стакан для смешивания" : "Лёд в бокал";
    case "jig": return `${st[2]} мл ${GEN[st[1]]}, точно по джиггеру`;
    case "pour": return `Наливаем ${st[2]} мл ${GEN[st[1]]}`;
    case "top": return `Доливаем ${TOPACC[st[1]]}`;
    case "dash": return `${st[2]} ${st[2] === 1 ? "капля" : "капли"} ангостуры`;
    case "leaves": return "Свежая мята";
    case "muddle": return "Мягко разминаем мяту, чтобы она отдала аромат";
    case "squeeze": return "Выжимаем лайм";
    case "rim": return "Солёный ободок";
    case "shake": return "Встряхиваем, пока шейкер не покроется инеем";
    case "stir": return "Размешиваем барной ложкой: холодно и прозрачно";
    case "stirIn": return "Перемешиваем";
    case "strain": return "Процеживаем через стрейнер";
    case "float": return "Гренадин тяжелее: он опускается на дно";
    case "garnish": return `Финальный штрих: ${GNAME[c.garnish] || "украшение"}`;
    case "serve": return choose(["Готово. Приятного вечера!", "Ваш коктейль. Наслаждайтесь.", "Прошу. За ваш вечер!"]);
  }
  return "";
}

/* ---------- руки бармена ---------- */
const W2F = p => toFig(bt, p);
function handAt(arm, p, f, palm, curl) { const l = W2F(p); reach(arm, l.x, l.y, l.z, f, palm, curl); }
function take(arm, obj, off = V3(0, -.05, .05), woff = null, dur = .22) { const h = grab(bt, arm, obj, off, dur); Object.assign(h, { tiltZ: 0, roll: 0, yaw: 0 }); if (woff) h.woff = woff; return h; }
function drop(obj, p, dur = .25) { unaimObj(obj); return putDown(bt, obj, p, SHOW.fast ? .01 : dur); }
function unaimObj(obj) { for (const a of AIMS) if (a.hold.obj === obj) AIMS.delete(a); }
function holdOf(obj) { return bt.held.find(h => h.obj === obj); }
function rest(arm) { arm === bt.L ? reach(bt.L, .24, .98, .14, DIR.down, V3(-1, 0, .3), .3) : reach(bt.R, -.24, .98, .14, DIR.down, V3(1, 0, .3), .3); }

/* бутылку из рейла — в правую руку, иногда с трюком */
async function fetchBottleFor(ing) {
  const b = makeBottle(ing);
  b.position.copy(ST.rail);
  handAt(bt.R, ST.rail.clone().add(V3(0, .14, .04)), V3(0, -.2, 1), DIR.in(-1), .15);
  await ws(.42);
  bt.R.curlT = .85;
  const h = take(bt.R, b, V3(0, -.04, .045), V3(0, -.13, 0), .2);
  h.tilt = 0;
  handAt(bt.R, V3(ST.bx - .26, 1.36, -2.78), V3(0, .2, 1), DIR.in(-1));
  await ws(.38);
  const r = Math.random();
  if (r < .22 && !SHOW.fast) {
    // крутит бутылку в ладони
    await tween(h, { roll: Math.PI * 2 }, .55, ease.io); h.roll = 0;
  } else if (r < .36 && !SHOW.fast) {
    // подбрасывает и ловит
    release(bt, b);
    const y0 = b.position.y;
    const spin = { a: 0 };
    tween(spin, { a: Math.PI * 2 }, .62, ease.io);
    const up = tween(b.position, { y: y0 + .34 }, .31, ease.out);
    const tick = onTickTmp(() => { b.rotation.set(spin.a, bt.face, 0); });
    await up; await tween(b.position, { y: y0 }, .31, ease.in); tick();
    b.rotation.set(0, bt.face, 0);
    const h2 = take(bt.R, b, V3(0, -.04, .045), V3(0, -.13, 0), 0); h2.k = 1; h2.tilt = 0;
    SND.tap();
    return { b, h: h2 };
  }
  return { b, h };
}
function stowBottle(b) {
  unaimObj(b);
  release(bt, b);
  tween(b.position, { y: ST.rail.y - .3 }, SHOW.fast ? .01 : .35, ease.in).then(() => { world.remove(b); });
  handAt(bt.R, ST.rail.clone().add(V3(0, .2, .04)), V3(0, -.2, 1), DIR.in(-1), .2);
}
/* временный обработчик кадра */
const TMP = new Set();
onTick((t, dt) => { for (const f of TMP) f(t, dt); });
function onTickTmp(fn) { TMP.add(fn); return () => TMP.delete(fn); }

/* налить из того, что в руке (бутылка/джиггер/шейкер), в сосуд V */
async function pourInto(hold, V, ml, color, { gap = .06, tilt = 2.15, side = false, rate = 1, spout = null } = {}) {
  const target = mouth(V).add(V3(0, gap, 0));
  const top = V3(0, spout || hold.obj.userData.top || .1, 0);
  aim(hold, target, top, .3);
  await ws(.3);
  side ? tween(hold, { tiltZ: tilt }, .3) : tween(hold, { tilt }, .3);
  await ws(.25);
  const tf = V3(0, top.y, 0);
  streamOn(o => hold.obj.localToWorld(o.copy(tf)), o => o.copy(mouth(V)).add(V3(0, -.04, 0)), color, ml > 60 ? 1.2 : 1);
  const dur = (.35 + ml / 70) / rate;
  SND.pour(Math.min(2.5, dur));
  const m0 = V.ml, start = performance.now();
  const stop = onTickTmp(() => {
    const k = clamp((performance.now() - start) / (dur * 1000), 0, 1);
    const w = (m0 + ml * k) || 1;
    V.ml = m0 + ml * k;
    V.col.lerp(color, clamp(ml * .016 / w * 60, 0, 1) * .08);
    setLevel(V);
  });
  await ws(dur);
  stop(); V.ml = m0 + ml; setLevel(V);
  streamOff();
  side ? tween(hold, { tiltZ: 0, roll: (hold.roll || 0) + (chance(.6) ? 1.1 : 0) }, .3) : tween(hold, { tilt: 0, roll: (hold.roll || 0) + (chance(.6) ? 1.1 : 0) }, .3);
  await ws(.28);
  hold.roll = 0;
  unaim(hold);
}

/* ---------- лёд ---------- */
function iceSpot(V, crushed) {
  const n = V.ice.length, r = V === SHOW.glassV ? .02 : .022;
  const a = n * 2.4, ring = (n % 4) / 4;
  return V3(Math.cos(a) * r * ring + rr(-.005, .005), V.y0 + .016 + Math.floor(n / 4) * (crushed ? .012 : .024), Math.sin(a) * r * ring);
}
async function dropCube(V, from, crushed) {
  const cube = new THREE.Mesh(crushed ? smallCube : cubeGeo, MX.ice);
  cube.renderOrder = 5;
  cube.position.copy(from);
  cube.rotation.set(rr(0, 3), rr(0, 3), 0);
  world.add(cube);
  const local = iceSpot(V, crushed);
  V.ice.push(cube);
  const dst = V.g.localToWorld(local.clone());
  await tween(cube.position, { x: dst.x, y: dst.y, z: dst.z }, SHOW.fast ? .01 : rr(.16, .24), ease.in);
  V.g.attach(cube);
  SND.clink();
}
async function stepIce(st) {
  const V = st[1] === "tin" ? P.tin : st[1] === "mixer" ? P.mixer : SHOW.glassV, crushed = !!st[2];
  bt.look = mouth(V);
  const n = crushed ? 9 : V === SHOW.glassV ? (["rocks"].includes(SHOW.c.cup) ? 2 : 4) : 6;
  if (crushed || chance(.6)) {
    // совком
    handAt(bt.R, ST.bucket.clone().add(V3(0, .16, .02)), V3(0, -.9, .4), DIR.in(-1), .6);
    await ws(.45);
    handAt(bt.R, ST.bucket.clone().add(V3(0, .09, .02)), V3(0, -.9, .4), DIR.in(-1), .8);
    await ws(.25);
    handAt(bt.R, mouth(V).add(V3(-.02, .16, -.04)), V3(0, -.4, 1), DIR.down, .8);
    await ws(.45);
    const from = mouth(V).add(V3(0, .1, 0));
    for (let i = 0; i < n; i++) { dropCube(V, from.clone().add(V3(rr(-.015, .015), rr(0, .03), rr(-.015, .015))), crushed); await ws(.07); }
    await ws(.25);
  } else {
    // по одному кубику, щипцами пальцев
    for (let i = 0; i < Math.min(n, 3); i++) {
      handAt(bt.R, ST.bucket.clone().add(V3(0, .14, .02)), V3(0, -.9, .4), DIR.in(-1), .5);
      await ws(.3);
      handAt(bt.R, mouth(V).add(V3(0, .12, -.03)), V3(0, -.6, .8), DIR.in(-1), .9);
      await ws(.3);
      dropCube(V, mouth(V).add(V3(0, .07, 0)), false);
      await ws(.12);
    }
  }
  rest(bt.R);
}

/* ---------- джиггер ---------- */
let jigHold = null;
async function stepJig(st) {
  const [, ing, ml, into] = st;
  const V = into === "glass" ? SHOW.glassV : SHOW.main;
  const col = new THREE.Color((Closeup.LOOK[ing] || {}).liq || "#ffffff");
  const { b, h } = await fetchBottleFor(ing);
  if (!jigHold) {
    handAt(bt.L, ST.jig.clone().add(V3(.02, .06, -.02)), V3(-.3, -.5, 1), DIR.in(1), .2);
    await ws(.35);
    bt.L.curlT = .85;
    jigHold = take(bt.L, P.jig.g, V3(0, -.045, .04), V3(0, -.045, 0), .2);
    jigHold.tilt = 0;
  }
  // джиггер над сосудом, бутылка над джиггером
  const jtop = mouth(V).add(V3(.03, .08, 0));
  aim(jigHold, jtop, V3(0, .09, 0), .3);
  bt.look = jtop;
  await ws(.35);
  const fake = { g: P.jig.g, mouthY: .09 };
  const high = chance(.35) && ml >= 20;
  P.jig.liq.material.color.copy(col);
  // наливаем в джиггер (уровень в нём растёт)
  const jV = { g: P.jig.g, ml: 0, cap: 60, col: col.clone(), liq: null, y0: .05, y1: .09 };
  const stopJ = onTickTmp(() => { P.jig.liq.visible = jV.ml > 1; P.jig.liq.scale.y = clamp(jV.ml / 45, .05, 1); });
  const tmpV = Object.assign(jV, { mouthY: .09 });
  await pourInto(h, tmpV, ml, col, { gap: high ? rr(.18, .28) : rr(.04, .07), tilt: rr(2.0, 2.3), rate: high ? .8 : 1 });
  stopJ();
  if (high) bt.look = camera.position;
  stowBottle(b);
  // джиггер в сосуд
  aim(jigHold, mouth(V).add(V3(.02, .05, 0)), V3(0, .09, 0), .3);
  await ws(.25);
  tween(jigHold, { tilt: 2.4 }, .2);
  await ws(.12);
  streamOn(o => P.jig.g.localToWorld(o.set(0, .09, 0)), o => o.copy(mouth(V)), col, .9);
  const m0 = V.ml;
  P.jig.liq.visible = false;
  await ws(.25);
  streamOff();
  V.ml = m0 + ml; V.col.lerp(col, ml / Math.max(V.ml, 1)); if (V.liq) setLevel(V);
  tween(jigHold, { tilt: 0 }, .2);
  await ws(.2);
  unaim(jigHold);
  // небрежно крутит джиггер в пальцах
  if (chance(.25) && !SHOW.fast) { await tween(jigHold, { roll: Math.PI * 2 }, .45); jigHold.roll = 0; }
  rest(bt.R);
}
async function parkJigger() {
  if (!jigHold) return;
  unaim(jigHold);
  handAt(bt.L, ST.jig.clone().add(V3(.02, .07, -.02)), V3(-.3, -.5, 1), DIR.in(1), .8);
  await ws(.3);
  await drop(P.jig.g, ST.jig);
  P.jig.g.rotation.set(0, 0, 0);
  jigHold = null;
  rest(bt.L);
}
async function stepPour(st, top = false) {
  const [, ing, ml] = st;
  const col = new THREE.Color((Closeup.LOOK[ing] || {}).liq || "#ffffff");
  const { b, h } = await fetchBottleFor(ing);
  bt.look = mouth(SHOW.glassV);
  await pourInto(h, SHOW.glassV, top ? 60 : ml, col, { gap: top ? rr(.03, .06) : rr(.08, .2), tilt: rr(1.9, 2.25), rate: top ? .8 : 1.2 });
  stowBottle(b);
}
async function stepDash(st) {
  const V = st[3] === "glass" ? SHOW.glassV : SHOW.main;
  const { b, h } = await fetchBottleFor("bitters");
  aim(h, mouth(V).add(V3(0, .08, 0)), V3(0, b.userData.top, 0), .3);
  await ws(.35);
  for (let i = 0; i < (st[2] || 1); i++) {
    tween(h, { tilt: 2.5 }, .1); await ws(.14);
    // капля
    const d = mesh(new THREE.SphereGeometry(.004, 6, 4), std({ color: 0x5a1a0c }), 0, 0, 0);
    b.localToWorld(d.position.set(0, b.userData.top, 0));
    tween(d.position, { y: mouth(V).y - .05 }, .2, ease.in).then(() => world.remove(d));
    tween(h, { tilt: 1.6 }, .1); await ws(.16);
  }
  tween(h, { tilt: 0 }, .2); await ws(.2);
  unaim(h);
  stowBottle(b);
}

/* ---------- шейк ---------- */
async function stepShake() {
  const V = P.tin;
  await parkJigger();
  // накрываем малым стаканом
  handAt(bt.R, P.cap.g.position.clone().add(V3(0, .08, -.03)), V3(0, -.5, 1), DIR.in(-1), .2);
  await ws(.35);
  bt.R.curlT = .85;
  const ch = take(bt.R, P.cap.g, V3(0, -.05, .05), V3(0, -.06, 0), .2);
  ch.tilt = 0;
  await ws(.15);
  tween(ch, { tilt: Math.PI }, .3);
  aim(ch, mouth(V).add(V3(0, .1, 0)), null, .3);
  await ws(.4);
  aim(ch, mouth(V).add(V3(0, .075, 0)), null, .35);
  await ws(.2);
  SND.tap();
  release(bt, P.cap.g); unaimObj(P.cap.g);
  P.cap.g.position.copy(mouth(V).add(V3(0, .068, 0)));
  P.cap.g.rotation.set(Math.PI, 0, 0);
  V.g.attach(P.cap.g);
  // обе руки на шейкер
  handAt(bt.R, V.g.position.clone().add(V3(-.02, .07, -.05)), V3(0, -.2, 1), DIR.in(-1), .2);
  handAt(bt.L, V.g.position.clone().add(V3(.02, .22, -.04)), V3(0, .2, 1), DIR.in(1), .2);
  await ws(.38);
  bt.R.curlT = .9; bt.L.curlT = .7;
  const th = take(bt.R, V.g, V3(0, -.05, .05), V3(0, -.08, 0), .2);
  th.tilt = 0;
  const style = choose(["shoulder", "front", "hard", "shoulder"]);
  const tinPos = () => V.g.position;
  // иногда — подброс шейкера перед встряской
  if (chance(.25) && !SHOW.fast) {
    aim(th, V3(ST.bx - .05, 1.38, -2.72), null, .3);
    await ws(.3);
    release(bt, V.g); unaimObj(V.g);
    const y0 = V.g.position.y, spin = { a: 0 };
    tween(spin, { a: Math.PI * 2 }, .6, ease.io);
    const stop = onTickTmp(() => V.g.rotation.set(0, spin.a, 0));
    await tween(V.g.position, { y: y0 + .3 }, .3, ease.out);
    await tween(V.g.position, { y: y0 }, .3, ease.in);
    stop();
    SND.tap();
    const t2 = take(bt.R, V.g, V3(0, -.05, .05), V3(0, -.08, 0), 0); t2.k = 1; t2.tilt = 0;
    Object.assign(th, t2);
  }
  const hold = holdOf(V.g);
  bt.look = chance(.55) ? camera.position : null;
  BT.nod = 1;
  const dur = SHOW.fast ? .05 : rr(2.3, 3.1), hz = rr(2.6, 3.4), amp = rr(.07, .11);
  SND.rattle(Math.min(dur, 3), hz);
  const base = { shoulder: V3(-.2, 1.5, .2), front: V3(-.02, 1.34, .38), hard: V3(-.08, 1.42, .3) }[style];
  const tiltBase = { shoulder: -1.2, front: -1.5, hard: -1.3 }[style];
  hold.tilt = tiltBase;
  const t0 = performance.now();
  unaim(hold);
  const stop = onTickTmp(() => {
    const t = (performance.now() - t0) / 1000, ph = t * hz * Math.PI * 2;
    let o;
    if (style === "hard") { const k = (ph / (Math.PI * 2)) % 1, i = Math.floor(k * 3); o = [V3(-.05, .1, -.06), V3(.03, 0, .06), V3(-.02, -.08, .1)][i]; }
    else if (style === "shoulder") o = V3(-.04, .08, -.1).multiplyScalar(Math.sin(ph) * amp / .1);
    else o = V3(0, .02, .12).multiplyScalar(Math.sin(ph) * amp / .1);
    reach(bt.R, base.x + o.x, base.y + o.y, base.z + o.z, V3(0, .6, .5), DIR.in(-1), .95);
    reach(bt.L, base.x + o.x + .06, base.y + o.y + .14, base.z + o.z - .02, V3(0, .9, .2), DIR.in(1), .8);
    hold.tilt = tiltBase + Math.sin(ph) * .12;
    bt.spine.position.y = Math.sin(ph) * .006;
    bt.leanT = .08 + Math.sin(ph * .5) * .03;
  });
  bt.R.k = bt.L.k = 18;
  await ws(dur);
  stop();
  bt.R.k = bt.L.k = 9;
  BT.nod = 0;
  // на стойку, иней, хлопок ладонью, снимаем малый стакан
  V.g.children[0].material = MX.frost;
  tween(hold, { tilt: 0 }, .35);
  aim(hold, ST.tin, null, .3);
  await ws(.5);
  await drop(V.g, ST.tin, .15);
  V.g.rotation.set(0, 0, 0);
  handAt(bt.L, V.g.position.clone().add(V3(.07, .2, 0)), V3(0, .3, 1), DIR.in(1), 0);
  await ws(.18);
  handAt(bt.L, V.g.position.clone().add(V3(.04, .2, 0)), V3(0, .3, 1), DIR.in(1), 0);
  SND.tap();
  await ws(.2);
  handAt(bt.L, V.g.position.clone().add(V3(.02, .25, -.03)), V3(0, -.5, 1), DIR.in(1), .3);
  await ws(.3);
  bt.L.curlT = .85;
  world.attach(P.cap.g);
  const cap = take(bt.L, P.cap.g, V3(0, -.05, .05), V3(0, .04, 0), .2);
  cap.tilt = Math.PI;
  await ws(.25);
  tween(cap, { tilt: 0 }, .3);
  await drop(P.cap.g, ST.tin.clone().add(V3(.16, 0, .1)), .3);
  P.cap.g.rotation.set(0, 0, 0);
  rest(bt.L); rest(bt.R);
}

/* ---------- стир ---------- */
async function stepStir() {
  const V = P.mixer;
  await parkJigger();
  handAt(bt.L, V.g.position.clone().add(V3(.06, .05, -.01)), V3(-.2, -.2, 1), DIR.in(1), .7);
  handAt(bt.R, ST.spoon.clone().add(V3(0, .06, 0)), V3(0, -.6, 1), DIR.down, .2);
  await ws(.38);
  bt.R.curlT = .7;
  const sp = take(bt.R, P.spoon.g, V3(0, -.04, .03), null, .2);
  sp.tilt = 0;
  const c = mouth(V).add(V3(0, .21, 0));
  aim(sp, mouth(V).add(V3(0, .18, 0)), V3(0, 0, 0), .3);
  bt.look = mouth(V);
  await ws(.45);
  unaim(sp);
  const dur = SHOW.fast ? .05 : rr(2.2, 3), w = rr(9, 12), t0 = performance.now(), cl = W2F(c);
  SND.tinkle(Math.min(dur, 3));
  const stop = onTickTmp(() => {
    const t = (performance.now() - t0) / 1000;
    reach(bt.R, cl.x + Math.cos(t * w) * .016, cl.y, cl.z + Math.sin(t * w) * .016, V3(0, -.3, 1), DIR.down, .7);
    sp.roll = t * w;
    V.ice.forEach((cube, i) => { cube.rotation.y += .05; cube.position.x = Math.cos(t * 2 + i) * .016; cube.position.z = Math.sin(t * 2 + i) * .016; });
  });
  bt.R.k = 16;
  await ws(dur);
  stop();
  bt.R.k = 9;
  if (chance(.4) && !SHOW.fast) { reach(bt.R, cl.x, cl.y + .18, cl.z, V3(0, -.3, 1), DIR.down, .7); await tween(sp, { roll: sp.roll + Math.PI * 4 }, .55); }
  V.col.lerp(new THREE.Color(SHOW.c.pour), .7); setLevel(V);
  await drop(P.spoon.g, ST.spoon, .3);
  P.spoon.g.rotation.set(Math.PI / 2, 0, 0);
  rest(bt.L); rest(bt.R);
}
async function stepStirIn() {
  const V = SHOW.glassV;
  handAt(bt.R, ST.spoon.clone().add(V3(0, .06, 0)), V3(0, -.6, 1), DIR.down, .2);
  await ws(.35);
  bt.R.curlT = .7;
  const sp = take(bt.R, P.spoon.g, V3(0, -.04, .03), null, .2);
  sp.tilt = 0;
  const c = mouth(V).add(V3(0, .19, 0)), cl = W2F(c);
  aim(sp, mouth(V).add(V3(0, .15, 0)), V3(0, 0, 0), .3);
  await ws(.4);
  unaim(sp);
  const t0 = performance.now(), dur = SHOW.fast ? .05 : rr(1.1, 1.6);
  const stop = onTickTmp(() => { const t = (performance.now() - t0) / 1000; reach(bt.R, cl.x + Math.cos(t * 8) * .01, cl.y, cl.z + Math.sin(t * 8) * .01, V3(0, -.3, 1), DIR.down, .7); sp.roll = t * 8; });
  SND.tinkle(dur);
  await ws(dur);
  stop();
  V.col.lerp(new THREE.Color(SHOW.c.pour), .8); setLevel(V);
  await drop(P.spoon.g, ST.spoon, .3);
  P.spoon.g.rotation.set(Math.PI / 2, 0, 0);
  rest(bt.R);
}

/* ---------- процеживание ---------- */
async function stepStrain() {
  const S = SHOW.main, G = SHOW.glassV;
  await parkJigger();
  // стрейнер на шейкер левой рукой
  handAt(bt.L, ST.strainer.clone().add(V3(0, .06, 0)), V3(0, -.6, 1), DIR.down, .2);
  await ws(.35);
  bt.L.curlT = .6;
  const st = take(bt.L, P.strainer.g, V3(0, -.04, .04), null, .2);
  st.tilt = 0;
  aim(st, mouth(S).add(V3(0, .004, 0)), null, .3);
  await ws(.4);
  unaimObj(P.strainer.g); release(bt, P.strainer.g);
  P.strainer.g.position.copy(mouth(S).add(V3(0, .003, 0)));
  P.strainer.g.rotation.set(0, Math.PI, 0);
  S.g.attach(P.strainer.g);
  handAt(bt.R, S.g.position.clone().add(V3(-.02, .07, -.05)), V3(0, -.2, 1), DIR.in(-1), .2);
  handAt(bt.L, mouth(S).add(V3(.03, .02, -.02)), V3(0, -.3, 1), DIR.down, .6);
  await ws(.35);
  bt.R.curlT = .9;
  const h = take(bt.R, S.g, V3(0, -.05, .05), V3(0, -.08, 0), .2);
  h.tilt = 0;
  const high = chance(.4);
  bt.look = mouth(G);
  // левая рука держит стрейнер вместе с шейкером
  const stopL = onTickTmp(() => { const m = W2F(mouth(S)); reach(bt.L, m.x + .03, m.y + .02, m.z - .02, V3(0, -.3, 1), DIR.down, .6); });
  const col = new THREE.Color(SHOW.c.pour);
  const ml = Math.max(40, S.ml * .85);
  G.col.copy(col);
  await pourInto(h, G, ml, col, { gap: high ? rr(.15, .24) : rr(.05, .08), tilt: rr(1.75, 2.05), side: true, spout: S.mouthY, rate: .9 });
  stopL();
  S.ml = 0;
  aim(h, ST.tin, null, .3);
  await ws(.4);
  await drop(S.g, ST.tin, .15);
  S.g.rotation.set(0, 0, 0);
  world.attach(P.strainer.g);
  P.strainer.g.visible = false;
  rest(bt.L); rest(bt.R);
}

/* ---------- мята, мадлер, лайм, ободок, гренадин ---------- */
async function stepLeaves() {
  const G = SHOW.glassV;
  handAt(bt.R, ST.tray.clone().add(V3(0, .07, 0)), V3(0, -.6, 1), DIR.down, .3);
  await ws(.35);
  bt.R.curlT = .8;
  handAt(bt.R, mouth(G).add(V3(0, .1, -.03)), V3(0, -.4, 1), DIR.down, .8);
  await ws(.4);
  for (let i = 0; i < 5; i++) {
    const l = mesh(new THREE.SphereGeometry(.012, 8, 6), std({ color: 0x3f8f3a, roughness: .6 }), 0, 0, 0);
    l.scale.set(1, .25, .6);
    l.position.copy(mouth(G).add(V3(rr(-.01, .01), .06, rr(-.01, .01))));
    const dst = G.g.localToWorld(V3(rr(-.015, .015), G.y0 + .01 + i * .004, rr(-.015, .015)));
    tween(l.position, { x: dst.x, y: dst.y, z: dst.z }, .25, ease.in).then(() => G.g.attach(l));
    l.rotation.set(rr(0, 1), rr(0, 3), 0);
    await ws(.06);
  }
  bt.R.curlT = .3;
  rest(bt.R);
}
async function stepMuddle() {
  const G = SHOW.glassV;
  P.muddler.g.visible = true;
  P.muddler.g.position.copy(ST.spoon.clone().add(V3(.05, .004, -.05)));
  P.muddler.g.rotation.set(Math.PI / 2, 0, 0);
  handAt(bt.R, P.muddler.g.position.clone().add(V3(0, .06, 0)), V3(0, -.6, 1), DIR.down, .2);
  handAt(bt.L, G.g.position.clone().add(V3(.05, .05, -.01)), V3(-.2, -.2, 1), DIR.in(1), .7);
  await ws(.38);
  bt.R.curlT = .9;
  const h = take(bt.R, P.muddler.g, V3(0, -.03, .04), null, .2);
  h.tilt = 0;
  for (let i = 0; i < 4; i++) {
    aim(h, mouth(G).add(V3(0, .13, 0)), V3(0, -.22, 0), .35); await ws(.22);
    aim(h, G.g.localToWorld(V3(0, G.y0 + .01 + .22, 0)), V3(0, -.22, 0), .4); h.roll = (h.roll || 0) + .8; await ws(.22);
    SND.tick();
  }
  unaim(h);
  G.col.set(0xbfdc8a);
  await drop(P.muddler.g, ST.spoon.clone().add(V3(.05, .004, -.05)), .3);
  P.muddler.g.rotation.set(Math.PI / 2, 0, 0);
  rest(bt.L); rest(bt.R);
}
async function stepSqueeze() {
  const G = SHOW.glassV;
  handAt(bt.R, ST.tray.clone().add(V3(-.07, .06, -.03)), V3(0, -.6, 1), DIR.down, .3);
  await ws(.35);
  const wedge = mesh(new THREE.CylinderGeometry(.024, .024, .02, 12, 1, false, 0, Math.PI), std({ color: 0x9fc23a, roughness: .5 }), 0, 0, 0);
  const h = take(bt.R, wedge, V3(0, -.05, .04), null, .15);
  h.tilt = .5;
  aim(h, mouth(G).add(V3(0, .08, 0)), null, .3);
  await ws(.45);
  bt.R.curlT = 1;
  for (let i = 0; i < 6; i++) {
    const d = mesh(new THREE.SphereGeometry(.003, 6, 4), std({ color: 0xd9e8a0 }), 0, 0, 0);
    d.position.copy(wedge.position);
    tween(d.position, { y: mouth(G).y - .04, x: d.position.x + rr(-.01, .01) }, .25, ease.in).then(() => world.remove(d));
    await ws(.05);
  }
  unaim(h);
  release(bt, wedge);
  const dst = G.g.localToWorld(V3(.01, G.y0 + .03, 0));
  await tween(wedge.position, { x: dst.x, y: dst.y, z: dst.z }, .2, ease.in);
  G.g.attach(wedge);
  SND.plop();
  bt.R.curlT = .3;
  rest(bt.R);
}
async function stepRim() {
  const G = SHOW.glassV;
  home(P.salt, ST.salt);
  handAt(bt.R, G.g.position.clone().add(V3(-.05, .06, -.01)), V3(.2, -.2, 1), DIR.in(-1), .2);
  await ws(.38);
  bt.R.curlT = .85;
  const h = take(bt.R, G.g, V3(0, -.05, .05), V3(0, -.05, 0), .2);
  h.tilt = 0;
  aim(h, ST.salt.clone().add(V3(0, .1, 0)), null, .3);
  await ws(.4);
  tween(h, { tilt: 2.4 }, .3);
  await ws(.3);
  await tween(h, { yaw: Math.PI * 2 }, SHOW.fast ? .01 : .9);
  h.yaw = 0;
  const rim = mesh(new THREE.TorusGeometry(G.r + .002, .003, 6, 24), std({ color: 0xf2f0ea, roughness: .9 }), 0, G.mouthY - .004, 0, G.g);
  rim.rotation.x = Math.PI / 2;
  tween(h, { tilt: 0 }, .3);
  aim(h, ST.glass, null, .3);
  await ws(.45);
  await drop(G.g, ST.glass, .15);
  G.g.rotation.set(0, 0, 0);
  P.salt.visible = false;
  rest(bt.R);
}
async function stepFloat() {
  const G = SHOW.glassV;
  const { b, h } = await fetchBottleFor("grenadine");
  const layer = mesh(new THREE.CylinderGeometry(G.r * .9, G.r * .7, 1, 20), std({ color: 0xb3122a, transparent: true, opacity: .9, roughness: .2 }), 0, G.y0, 0, G.g);
  layer.geometry.translate(0, .5, 0);
  layer.scale.y = .0001;
  layer.renderOrder = 4;
  const sink = onTickTmp(() => {});
  aim(h, mouth(G).add(V3(0, .05, 0)), V3(0, b.userData.top, 0), .3);
  await ws(.35);
  tween(h, { tilt: 2.0 }, .3); await ws(.25);
  streamOn(o => b.localToWorld(o.set(0, b.userData.top, 0)), o => o.copy(mouth(G)).add(V3(0, -.03, 0)), new THREE.Color(0xb3122a), .8);
  await tween(layer.scale, { y: (G.y1 - G.y0) * .3 }, SHOW.fast ? .01 : 1.3);
  streamOff(); sink();
  tween(h, { tilt: 0 }, .3); await ws(.3);
  unaim(h);
  stowBottle(b);
}

/* ---------- гарнир ---------- */
function garnishMesh(kind) {
  const col = { wheel: 0x9fc23a, wedge: 0x9fc23a, lemon: 0xf2d24a, orange: 0xf08a22, mint: 0x3f8f3a, cherry: 0x9a0f1e, pineapple: 0xf2c84a, olive: 0x7a8a2a }[kind] || 0x9fc23a;
  const g = new THREE.Group();
  if (kind === "olive" || kind === "cherry") {
    mesh(new THREE.SphereGeometry(.012, 12, 8), std({ color: col, roughness: kind === "cherry" ? .2 : .35 }), 0, 0, 0, g).scale.set(1, kind === "olive" ? .8 : 1, 1);
    if (kind === "olive") mesh(new THREE.CylinderGeometry(.0012, .0012, .1, 4), std({ color: 0xe8dcc0 }), 0, .03, 0, g);
    else mesh(new THREE.CylinderGeometry(.001, .001, .03, 4), std({ color: 0x3a5a1a }), 0, .018, 0, g);
  } else if (kind === "mint") {
    for (let i = 0; i < 5; i++) { const l = mesh(new THREE.SphereGeometry(.014, 8, 6), std({ color: col, roughness: .6 }), rr(-.01, .01), i * .008, rr(-.01, .01), g); l.scale.set(1, .35, .6); l.rotation.set(rr(0, 1), rr(0, 3), 0); }
  } else if (kind === "lemon") {
    const peel = new THREE.TorusGeometry(.02, .004, 6, 16, Math.PI * 1.4);
    mesh(peel, std({ color: col, roughness: .5 }), 0, 0, 0, g);
  } else {
    mesh(new THREE.CylinderGeometry(.024, .024, .005, 18, 1, false, 0, kind === "wedge" ? Math.PI : Math.PI * 2), std({ color: col, roughness: .5 }), 0, 0, 0, g).rotation.z = Math.PI / 2;
  }
  world.add(g);
  return g;
}
async function stepGarnish(c) {
  const G = SHOW.glassV, kind = c.garnish || "wheel", rw = G.r * G.g.scale.x;
  handAt(bt.R, ST.tray.clone().add(V3(0, .07, 0)), V3(0, -.6, 1), DIR.down, .3);
  bt.look = ST.tray;
  await ws(.4);
  const gm = garnishMesh(kind);
  gm.position.copy(ST.tray.clone().add(V3(0, .02, 0)));
  bt.R.curlT = .9;
  const h = take(bt.R, gm, V3(0, -.07, .03), null, .2);
  h.tilt = 0;
  const m = mouth(G);
  if (kind === "olive" || kind === "cherry") {
    // поднимает высоко над бокалом и смотрит на гостя
    aim(h, m.clone().add(V3(0, .26, 0)), null, .3);
    await ws(.5);
    bt.look = camera.position;
    await ws(SHOW.fast ? 0 : rr(.5, .9));
    if (kind === "cherry" || chance(.4)) {
      unaim(h); release(bt, gm);
      const dst = G.g.localToWorld(V3(0, G.y0 + Math.max(.012, (G.y1 - G.y0) * .6), 0));
      await tween(gm.position, { x: dst.x, y: dst.y, z: dst.z }, SHOW.fast ? .01 : .3, ease.in);
      SND.plop();
    } else {
      aim(h, G.g.localToWorld(V3(0, G.y1 - .01, 0)), null, .25);
      await ws(.7);
      unaim(h); release(bt, gm);
      SND.plop();
    }
    gm.rotation.set(0, 0, .35);
  } else if (kind === "mint") {
    // хлопок ладонями — мята отдаёт аромат
    const mid = V3(ST.bx - .05, 1.32, -2.72);
    aim(h, mid, null, .3);
    handAt(bt.L, mid.clone().add(V3(.12, 0, 0)), V3(0, .3, 1), DIR.in(1), 0);
    await ws(.4);
    handAt(bt.L, mid.clone().add(V3(.03, 0, 0)), V3(0, .3, 1), DIR.in(1), 0);
    await ws(.12);
    SND.clap();
    rest(bt.L);
    aim(h, m.clone().add(V3(.01, .05, 0)), null, .3);
    await ws(.45);
    unaim(h); release(bt, gm);
    gm.position.copy(m.clone().add(V3(.01, -.01, 0)));
  } else if (kind === "lemon") {
    // скручивает цедру: брызги эфирного масла над бокалом
    aim(h, m.clone().add(V3(0, .08, 0)), null, .3);
    await ws(.45);
    await tween(h, { roll: Math.PI }, .35);
    for (let i = 0; i < 10; i++) {
      const s = glowSprite(0xfff0a0, .03, gm.position.x, gm.position.y, gm.position.z, world, .9);
      tween(s.position, { x: s.position.x + rr(-.04, .04), y: s.position.y - rr(.03, .07), z: s.position.z + rr(-.04, .04) }, .4).then(() => world.remove(s));
    }
    await ws(.3);
    unaim(h); release(bt, gm);
    gm.position.copy(m.clone().add(V3(rw * .9, -.01, 0)));
    gm.rotation.set(0, 0, Math.PI / 2);
  } else {
    // долька на край бокала
    aim(h, m.clone().add(V3(rw, .06, 0)), null, .3);
    await ws(.45);
    aim(h, m.clone().add(V3(rw, -.004, 0)), null, .3);
    await ws(.3);
    unaim(h); release(bt, gm);
    gm.position.copy(m.clone().add(V3(rw - .004, -.006, 0)));
  }
  G.g.attach(gm);
  bt.R.curlT = .3;
  rest(bt.R);
}

/* ---------- подача ---------- */
async function stepServe() {
  const G = SHOW.glassV;
  handAt(bt.R, G.g.position.clone().add(V3(-.04, .05, -.04)), V3(.2, -.4, 1), DIR.in(-1), .2);
  bt.look = G.g.position;
  await ws(.4);
  bt.R.curlT = .5;
  const h = take(bt.R, G.g, V3(0, -.05, .05), V3(0, -.04, 0), .15);
  h.tilt = 0;
  // скользит по стойке к гостю
  const to = ST.serve.clone();
  const a = aim(h, G.g.position.clone(), null, .35);
  const from = G.g.position.clone(), t0 = performance.now(), dur = SHOW.fast ? .01 : .8;
  const stop = onTickTmp(() => { const k = ease.io(clamp((performance.now() - t0) / (dur * 1000), 0, 1)); a.pos.lerpVectors(from, to, k); a.pos.y = CT.top; });
  await ws(dur + .15);
  stop();
  await drop(G.g, to, .1);
  G.g.rotation.set(0, 0, 0);
  // открытая ладонь, взгляд на гостя, лёгкий кивок
  reach(bt.R, -.05, 1.12, .42, V3(-.3, 0, 1), V3(.2, 1, 0), .1);
  bt.look = camera.position;
  bt.nod = .08;
  await ws(.35);
  bt.nod = 0;
  await ws(.5);
}

/* ---------- маленькие жесты между шагами: каждый раз разные ---------- */
const FLOURISH = [
  async () => { bt.look = camera.position; bt.nod = .07; await ws(.3); bt.nod = 0; await ws(.3); bt.look = null; },
  async () => { reach(bt.L, .12, 1.0, .2, V3(-.4, -.6, .6), DIR.in(1), .5); reach(bt.R, -.12, 1.0, .2, V3(.4, -.6, .6), DIR.in(-1), .5); await ws(.3); reach(bt.L, .1, .98, .22, V3(-.4, -.6, .6), DIR.in(1), .5); await ws(.25); rest(bt.L); rest(bt.R); },
  async () => { for (let i = 0; i < 2; i++) { reach(bt.R, -.1, CT.top + .05, .52, V3(0, -.6, 1), DIR.down, .4); await ws(.12); reach(bt.R, -.1, CT.top + .01, .52, V3(0, -.6, 1), DIR.down, .4); SND.tick(); await ws(.12); } rest(bt.R); },
  async () => { reach(bt.L, .05, 1.52, .14, V3(-.3, .9, .2), V3(-.3, 0, 1), .6); reach(bt.R, -.05, 1.52, .14, V3(.3, .9, .2), V3(.3, 0, 1), .6); bt.look = null; await ws(.45); rest(bt.L); rest(bt.R); },
  async () => { bt.tilt = rr(-.12, .12); bt.look = camera.position; await ws(.6); bt.tilt = 0; bt.look = null; }
];
async function flourish() { if (!SHOW.fast && chance(.38)) await choose(FLOURISH)(); }

/* ---------- сцена целиком ---------- */
const STEP = {
  ice: stepIce, jig: stepJig, pour: st => stepPour(st), top: st => stepPour(st, true), dash: stepDash, shake: stepShake, stir: stepStir,
  strain: stepStrain, stirIn: stepStirIn, leaves: stepLeaves, muddle: stepMuddle, squeeze: stepSqueeze, rim: stepRim, float: stepFloat,
  garnish: (st, c) => stepGarnish(c), serve: stepServe
};
function buildGlass(c) {
  const cup = CUPS[c.cup] || CUPS.rocks;
  const prof = cup.p.map(([r, y]) => [r / 100, y / 100]);
  const [r0, r1, y0, y1] = cup.liq.map(v => v / 100);
  const cap = (Closeup.CAP_ML[c.cup] || 150) * (c.cup === "rocks" || c.cup === "highball" ? 1 : 1.05);
  const V = vesselMesh(prof, MX.glass, [r0, r1, y0, y1, cap]);
  V.g.scale.setScalar(1.35);
  V.g.visible = true;
  return V;
}
function resetVessel(V) {
  V.ml = 0; V.col.set(0xffffff); if (V.liq) setLevel(V);
  V.ice.forEach(i => i.parent && i.parent.remove(i)); V.ice = [];
}
async function setupStation(c) {
  station();
  BT.busy = true;
  BT.mode = "free";
  if (bt.held.some(h => h.obj === btGlass)) await stash();
  STATIC_TOOLS.forEach(o => { o.visible = false; });
  resetVessel(P.tin); resetVessel(P.mixer);
  P.tin.g.children[0].material = M.chrome;
  world.attach(P.cap.g);
  home(P.bucket.g, ST.bucket); home(P.tray.g, ST.tray);
  home(P.jig.g, ST.jig); home(P.spoon.g, ST.spoon); P.spoon.g.rotation.set(Math.PI / 2, 0, 0);
  home(P.strainer.g, ST.strainer);
  const prog = PROG()[c.id] || [];
  const shaken = prog.some(s => s[0] === "shake"), stirred = prog.some(s => s[0] === "stir");
  SHOW.main = shaken ? P.tin : stirred ? P.mixer : null;
  P.tin.g.visible = P.cap.g.visible = shaken;
  P.mixer.g.visible = stirred;
  if (shaken) { home(P.tin.g, ST.tin); home(P.cap.g, ST.tin.clone().add(V3(.16, 0, .1))); }
  if (stirred) home(P.mixer.g, ST.tin);
  if (SHOW.glassV) world.remove(SHOW.glassV.g);
  SHOW.glassV = buildGlass(c);
  SHOW.glassV.g.position.copy(ST.glass);
  if (!SHOW.main) SHOW.main = SHOW.glassV;
  // всё появляется на стойке с лёгким «приземлением»
  for (const o of [P.bucket.g, P.tray.g, P.jig.g, P.spoon.g, P.strainer.g, P.tin.g, P.cap.g, P.mixer.g, SHOW.glassV.g]) {
    if (!o.visible) continue;
    const y = o.position.y; o.position.y += .03;
    tween(o.position, { y }, SHOW.fast ? .01 : .35, ease.out);
  }
  await walkTo(ST.bx, ST.bz, 0);
  await turnTo(0);
  rest(bt.L); rest(bt.R);
}
function cleanup(c, aborted) {
  for (const t of TMP) TMP.delete(t);
  AIMS.clear();
  streamOff();
  bt.held = bt.held.filter(h => !PROPS().includes(h.obj) && !(SHOW.glassV && h.obj === SHOW.glassV.g));
  for (const h of [...bt.held]) if (h.obj !== btGlass && h.obj !== btRag) { release(bt, h.obj); if (h.obj.parent === world && !PROPS().includes(h.obj)) world.remove(h.obj); }
  jigHold = null;
  bt.R.k = bt.L.k = 9;
  BT.nod = 0; bt.nod = 0; bt.tilt = 0;
  // реквизит убирается, бокал остаётся гостю
  world.attach(P.cap.g); world.attach(P.strainer.g);
  PROPS().forEach(o => { o.visible = false; });
  STATIC_TOOLS.forEach(o => { o.visible = true; });
  if (aborted || !SHOW.glassV) {
    if (SHOW.glassV) world.remove(SHOW.glassV.g);
    SHOW.glassV = null;
    placeServed(c);
  } else {
    if (servedGlass && servedGlass !== SHOW.glassV.g) world.remove(servedGlass);
    const V = SHOW.glassV;
    if (V.ml < V.cap * .5) { V.ml = V.cap * .82; V.col.set(c.pour); setLevel(V); }
    V.g.position.copy(ST.serve);
    servedGlass = V.g;
    SHOW.glassV = null;
  }
  SHOW.served = true;
  bt.leanT = .07; bt.spine.position.y = 0;
  rest(bt.L); rest(bt.R);
}
async function playShow(c) {
  SHOW.on = true; SHOW.ran = true; SHOW.fast = false; SHOW.served = false; SHOW.c = c; SHOW.last = "";
  SG = ++SHOW.gen;
  showUI.title.textContent = c.name;
  showUI.root.hidden = false;
  app.classList.add("showing");
  caption("", choose(["Бармен берётся за дело", "Сейчас будет красиво", "Минуту — и готово"]));
  let aborted = false;
  try {
    await setupStation(c);
    const prog = (PROG()[c.id] || [["garnish"]]).concat([["serve"]]);
    const total = prog.length - 1;
    for (let i = 0; i < prog.length; i++) {
      const st = prog[i];
      caption(st[0] === "serve" ? "" : `Шаг ${i + 1} из ${total}`, stepCaption(st, c));
      cut(st[0]);
      await STEP[st[0]](st, c);
      if (st[0] !== "serve" && (prog[i + 1] || [])[0] !== "jig") { if (jigHold && (prog[i + 1] || [])[0] !== "jig") await parkJigger(); }
      if (i < prog.length - 2) await flourish();
    }
  } catch (e) {
    if (e !== ABORT) console.error(e);
    aborted = true;
  }
  cleanup(c, aborted);
  showUI.root.hidden = true;
  app.classList.remove("showing");
  SHOW.on = false;
  BT.mode = "free";
  if (SEAT.on) flyTo(seatShot(true), 1.2, 0);
  else flyTo(framed({ pos: [ST.bx - .2, 1.6, -.6], tgt: [ST.bx - .15, 1.3, -2.4], span: 2.2, pull: 1 }), 1.3, 0);
  await sleep(.3);
}
/* крупный план теперь живёт в 3D: подменяем старое 2D-представление */
Closeup.play = c => playShow(c);
Object.defineProperty(Closeup, "active", { get: () => SHOW.on, configurable: true });
Object.assign(H3D, { show: SHOW });
