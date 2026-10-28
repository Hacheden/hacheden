/* ================= шоу бармена: предметы движутся по продуманным траекториям, пальцы их обхватывают ================= */
const SHOW = { on: false, gen: 0, fast: false, served: false, ran: false, glassV: null, main: null, c: null, focus: V3(), force: null };
const ABORT = { abort: true };
let SG = 0;
const rr = (a, b) => a + Math.random() * (b - a);
const chance = p => Math.random() < p;
const choose = list => list[Math.floor(Math.random() * list.length)];
function live() { if (SHOW.gen !== SG) throw ABORT; }
const SL = () => SHOW.slow || 1;
async function ws(s) { await sleep(SHOW.fast ? Math.min(s, .01) : s * SL()); live(); }
const PROG = () => Closeup.PROGRAMS;
const NOM = { rum: "Ром", tequila: "Текила", gin: "Джин", whisky: "Виски", cognac: "Коньяк", wine: "Красное вино", triple: "Апельсиновый ликёр",
  campari: "Кампари", vermouthR: "Красный вермут", vermouthD: "Сухой вермут", bitters: "Ангостура", tonic: "Тоник", soda: "Содовая",
  cola: "Кола", oj: "Апельсиновый сок", pineapple: "Ананасовый сок", coconut: "Кокосовые сливки", lime: "Сок лайма",
  lemon: "Лимонный сок", syrup: "Сахарный сироп", grenadine: "Гренадин" };
const liqOf = ing => new THREE.Color((Closeup.LOOK[ing] || {}).liq || "#ffffff");

/* ---------- координаты: всё считается от места бармена (x — его левая рука, z — к гостю) ---------- */
const ST = { bx: 1.2, bz: -3.0 };
const B = (x, y, z) => V3(ST.bx + x, y, ST.bz + z);
const TOP = () => CT.top;
const Qe = (x = 0, y = 0, z = 0) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, "YXZ"));
const Qz = a => new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), a);
const Qx = a => new THREE.Quaternion().setFromAxisAngle(V3(1, 0, 0), a);
const _up = V3(0, 1, 0);

/* ---------- материалы ---------- */
const MX = {
  glass: std({ color: 0xf2f6ff, transparent: true, opacity: .22, roughness: .02, envMapIntensity: 2.8, side: THREE.DoubleSide, depthWrite: false }),
  rim: new THREE.MeshBasicMaterial({ color: 0xfff4e4, transparent: true, opacity: .55, depthWrite: false }),
  ice: std({ color: 0xf4fbff, transparent: true, opacity: .62, roughness: .04, envMapIntensity: 2.4, emissive: 0x334450, depthWrite: false }),
  frost: std({ color: 0xe6edf0, metalness: .45, roughness: .62, envMapIntensity: 1 }),
  wood: std({ color: 0x5a3420, roughness: .55 }),
  stream: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .92, depthWrite: false }),
  core: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending })
};
const cubeGeo = new RoundedBoxGeometry(.024, .024, .024, 2, .006);
const crushGeo = new RoundedBoxGeometry(.013, .011, .013, 1, .004);

/* сосуд: стекло или металл, уровень жидкости, кольцо по краю, чтобы силуэт читался */
function vessel(profile, mat, [r0, r1, y0, y1, cap], { rim = true, scale = 1 } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(lathe(profile, 32), mat);
  body.renderOrder = 5;
  g.add(body);
  const mouthY = profile[profile.length - 1][1], mouthR = profile[profile.length - 1][0];
  if (rim && mat === MX.glass) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(mouthR, .0011, 4, 40), MX.rim);
    ring.rotation.x = Math.PI / 2; ring.position.y = mouthY; ring.renderOrder = 6;
    g.add(ring);
  }
  const lg = new THREE.CylinderGeometry(r1, r0, 1, 28);
  lg.translate(0, .5, 0);
  const liq = new THREE.Mesh(lg, std({ color: 0xffffff, transparent: true, opacity: .88, roughness: .12, emissive: 0x000000 }));
  liq.renderOrder = 4; liq.position.y = y0; liq.scale.y = .0001; liq.visible = false;
  g.add(liq);
  g.scale.setScalar(scale);
  g.visible = false;
  world.add(g);
  return { g, body, liq, ml: 0, cap, col: new THREE.Color(0xffffff), ice: [], y0, y1, r0, r1, mouthY, mouthR, scale };
}
function setLevel(V) {
  const f = clamp(V.ml / V.cap, 0, .94);
  V.liq.visible = f > .004;
  V.liq.scale.y = Math.max(.0001, f * (V.y1 - V.y0));
  V.liq.material.color.copy(V.col);
  V.liq.material.emissive.copy(V.col).multiplyScalar(.3);
}
const mouth = (V, dy = 0) => V.g.localToWorld(V3(0, V.mouthY + dy / V.scale, 0));
const surface = V => V.g.localToWorld(V3(0, V.y0 + Math.max(.004, clamp(V.ml / V.cap, 0, .94) * (V.y1 - V.y0)), 0));

/* ---------- реквизит ---------- */
const P = {};
(() => {
  P.tin = vessel([[0, 0], [.043, 0], [.044, .004], [.048, .175], [.05, .178]], M.chrome, [.04, .046, .004, .17, 520]);
  P.cap = { g: new THREE.Group() };
  P.cap.g.add(new THREE.Mesh(lathe([[0, 0], [.036, 0], [.037, .004], [.042, .12], [.043, .123]], 28), M.chrome));
  world.add(P.cap.g); P.cap.g.visible = false;
  P.mixer = vessel([[0, 0], [.048, 0], [.049, .008], [.05, .15], [.051, .152]], MX.glass, [.045, .047, .01, .145, 420]);
  // джиггер: верхняя чаша 50 мл, нижняя 25 мл
  P.jig = { g: new THREE.Group() };
  P.jig.g.add(new THREE.Mesh(lathe([[.017, 0], [.019, .001], [.009, .043], [.009, .047], [.024, .088], [.026, .09]], 24), M.chrome));
  const jl = new THREE.CylinderGeometry(.022, .01, 1, 18); jl.translate(0, .5, 0);
  P.jig.liq = mesh(jl, std({ color: 0xffffff, transparent: true, opacity: .9, roughness: .1 }), 0, .049, 0, P.jig.g);
  P.jig.liq.visible = false;
  world.add(P.jig.g); P.jig.g.visible = false;
  // барная ложка: витая ручка, капля на конце
  P.spoon = { g: new THREE.Group() };
  const nonIdx = x => x.index ? x.toNonIndexed() : x;
  const sp = [new THREE.CylinderGeometry(.0026, .0026, .29, 6)];
  sp[0].translate(0, -.15, 0);
  for (let i = 0; i < 22; i++) { const t = new THREE.TorusGeometry(.003, .0008, 3, 6); t.rotateX(Math.PI / 2); t.translate(0, -.04 - i * .0095, 0); sp.push(t); }
  const bowl = new THREE.SphereGeometry(.011, 12, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); bowl.scale(1, .45, 1.7); bowl.translate(0, -.302, 0); sp.push(bowl);
  sp.push(new THREE.SphereGeometry(.0065, 10, 8));
  P.spoon.g.add(new THREE.Mesh(mergeGeometries(sp.map(nonIdx)), M.chrome));
  world.add(P.spoon.g); P.spoon.g.visible = false;
  // стрейнер: диск, пружина по краю, ручка
  P.strainer = { g: new THREE.Group() };
  const sg = [new THREE.CylinderGeometry(.047, .047, .003, 28), new THREE.TorusGeometry(.039, .0045, 6, 28), new THREE.BoxGeometry(.018, .003, .1)];
  sg[1].rotateX(Math.PI / 2); sg[1].translate(0, -.006, 0);
  sg[2].translate(0, 0, .09);
  for (let i = 0; i < 40; i++) { const a = i / 40 * 6.28, t = new THREE.TorusGeometry(.004, .0009, 3, 6); t.rotateY(a); t.translate(Math.cos(a) * .04, -.007, Math.sin(a) * .04); sg.push(t); }
  P.strainer.g.add(new THREE.Mesh(mergeGeometries(sg.map(nonIdx)), M.chrome));
  world.add(P.strainer.g); P.strainer.g.visible = false;
  // мадлер
  P.muddler = { g: new THREE.Group() };
  P.muddler.g.add(new THREE.Mesh(lathe([[0, -.22], [.014, -.22], [.016, -.2], [.012, -.06], [.015, -.02], [.013, 0], [0, 0]], 14), MX.wood));
  world.add(P.muddler.g); P.muddler.g.visible = false;
  // совок для льда: ковш вдоль +x, ручка вдоль −x
  P.scoop = { g: new THREE.Group() };
  const sc = new THREE.CylinderGeometry(.035, .035, .1, 20, 1, true, Math.PI * .4, Math.PI * 1.2); sc.rotateZ(Math.PI / 2); sc.translate(.05, 0, 0);
  const scEnd = new THREE.CircleGeometry(.035, 20); scEnd.rotateY(Math.PI / 2);
  const scH = new THREE.CylinderGeometry(.008, .009, .09, 10); scH.rotateZ(Math.PI / 2); scH.translate(-.045, .006, 0);
  P.scoop.g.add(new THREE.Mesh(mergeGeometries([sc, scEnd, scH].map(nonIdx)), std({ color: 0xd8dde2, metalness: 1, roughness: .2, side: THREE.DoubleSide, envMapIntensity: 1.6 })));
  P.scoop.cubes = [];
  for (let i = 0; i < 5; i++) { const c = mesh(cubeGeo, MX.ice, .025 + (i % 3) * .022, -.014 + Math.floor(i / 3) * .018, (i % 2 - .5) * .018, P.scoop.g); c.rotation.set(rr(0, 2), rr(0, 2), 0); c.renderOrder = 5; c.visible = false; P.scoop.cubes.push(c); }
  world.add(P.scoop.g); P.scoop.g.visible = false;
  // ведёрко со льдом
  P.bucket = { g: new THREE.Group() };
  P.bucket.g.add(new THREE.Mesh(lathe([[0, 0], [.07, 0], [.075, .01], [.09, .14], [.094, .145]], 32), M.chrome));
  const bi = new THREE.InstancedMesh(cubeGeo, MX.ice, 18), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < 18; i++) { m4.compose(V3(rr(-.06, .06), .11 + rr(0, .03), rr(-.06, .06)), q.setFromEuler(e.set(rr(0, 3), rr(0, 3), 0)), V3(1.1, 1.1, 1.1)); bi.setMatrixAt(i, m4); }
  bi.renderOrder = 5;
  P.bucket.g.add(bi);
  world.add(P.bucket.g); P.bucket.g.visible = false;
  // доска с гарниром
  P.tray = { g: new THREE.Group() };
  const t = P.tray.g;
  t.add(new THREE.Mesh(new RoundedBoxGeometry(.2, .018, .13, 2, .006), MX.wood));
  for (let i = 0; i < 3; i++) mesh(new THREE.CylinderGeometry(.022, .022, .006, 20), std({ color: 0xa8c83e, roughness: .5, emissive: 0x1a2a00 }), -.07 + i * .028, .013 + i * .003, -.035, t).rotation.z = .2;
  for (let i = 0; i < 3; i++) mesh(new THREE.SphereGeometry(.01, 12, 8), std({ color: 0xa8101e, roughness: .2 }), .03 + i * .02, .019, -.035, t);
  for (let i = 0; i < 3; i++) mesh(new THREE.SphereGeometry(.01, 12, 8), std({ color: 0x8a9a30, roughness: .35 }), .03 + i * .02, .018, .03, t).scale.set(1, .8, 1);
  mesh(new THREE.CylinderGeometry(.022, .022, .006, 20), std({ color: 0xf08a22, roughness: .5 }), -.05, .015, .035, t).rotation.z = -.15;
  world.add(t); t.visible = false;
  P.salt = mesh(new THREE.CylinderGeometry(.065, .06, .012, 28), std({ color: 0xf4f1ea, roughness: .95 }), 0, 0, 0);
  P.salt.visible = false;
})();
const PROPS = () => [P.tin.g, P.cap.g, P.mixer.g, P.jig.g, P.spoon.g, P.strainer.g, P.muddler.g, P.scoop.g, P.bucket.g, P.tray.g, P.salt];

/* ---------- бутылка с крупной этикеткой ---------- */
const BKIND = { spirit: "tall", square: "square", flask: "flask", squat: "squat", wine: "bordeaux", dash: "bordeaux", soda: "round", squeeze: "squeeze", carafe: "carafe" };
const LABELS = {};
function bigLabel(ing) {
  if (LABELS[ing]) return LABELS[ing];
  const L = Closeup.LOOK[ing] || {};
  const t = canvasTex(512, 160, (g, w, h) => {
    g.fillStyle = L.label || "#efe6d2"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(201,148,74,.9)"; g.lineWidth = 5; g.strokeRect(146, 10, 220, h - 20);
    g.fillStyle = L.ink || "#2a1a10"; g.textAlign = "center"; g.textBaseline = "middle";
    const name = L.name || (NOM[ing] || "").toUpperCase();
    g.font = `400 ${name.length > 7 ? 38 : 50}px Forum, serif`;
    g.fillText(name, 256, 68);
    g.font = "400 19px Literata, serif"; g.globalAlpha = .75; g.fillText("HACHEDEN · 1924", 256, 118);
  });
  return (LABELS[ing] = t);
}
function makeBottle(ing) {
  const L = Closeup.LOOK[ing] || { kind: "spirit", glass: "#2a1a10", liq: "#c27a1a" };
  const g = new THREE.Group();
  let top = .3, r = .035;
  if (L.kind === "carafe") {
    g.add(new THREE.Mesh(lathe([[0, 0], [.045, 0], [.05, .02], [.05, .14], [.03, .2], [.028, .24], [.034, .25]], 28), MX.glass));
    mesh(new THREE.CylinderGeometry(.046, .046, .12, 24), std({ color: L.liq, transparent: true, opacity: .9, roughness: .2, emissive: new THREE.Color(L.liq).multiplyScalar(.2) }), 0, .075, 0, g);
    top = .25; r = .05;
  } else if (L.kind === "squeeze") {
    mesh(new THREE.CylinderGeometry(.032, .032, .15, 24), std({ color: L.glass, transparent: (L.op || 1) < 1, opacity: Math.max(.5, L.op || 1), roughness: .3 }), 0, .075, 0, g);
    if ((L.op || 1) < .6) mesh(new THREE.CylinderGeometry(.03, .03, .1, 18), std({ color: L.liq, roughness: .3 }), 0, .052, 0, g);
    mesh(new THREE.CylinderGeometry(.008, .02, .05, 12), std({ color: 0xe8e2d0, roughness: .4 }), 0, .175, 0, g);
    const lab = mesh(new THREE.CylinderGeometry(.0325, .0325, .06, 28, 1, true), std({ map: bigLabel(ing), roughness: .7 }), 0, .085, 0, g);
    lab.rotation.y = Math.PI;
    top = .2; r = .032;
  } else {
    const shape = BKIND[L.kind] || "tall", s = L.kind === "dash" ? .6 : L.kind === "soda" ? .85 : 1;
    const b = new THREE.Mesh(BGEO[shape], std({ color: L.glass, transparent: (L.op || 1) < 1, opacity: Math.max(.5, L.op || .95), roughness: .05, metalness: .1, envMapIntensity: 2.4 }));
    b.scale.setScalar(s); g.add(b);
    r = bodyR(shape) * s;
    const lh = .08 * s;
    const lab = BOTTLE[shape].seg === 4
      ? mesh(new THREE.BoxGeometry(r * 1.42, lh, r * 1.42), std({ map: bigLabel(ing), roughness: .7 }), 0, .11 * s, 0, g)
      : mesh(new THREE.CylinderGeometry(r * 1.015, r * 1.015, lh, 32, 1, true), std({ map: bigLabel(ing), roughness: .7 }), 0, .11 * s, 0, g);
    lab.rotation.y = Math.PI;
    top = neckTop(shape) * s;
    mesh(new THREE.CylinderGeometry(.007, .0055, .032, 10), M.chrome, 0, top + .013, 0, g);
    top += .028;
  }
  g.userData = { top, r, ing };
  world.add(g);
  return g;
}

/* ---------- движение предметов: путь с подъёмом, поворот по кратчайшей дуге ---------- */
const TMP = new Set();
onTick((t, dt) => { for (const f of TMP) f(t, dt); });
function onTickTmp(fn) { TMP.add(fn); return () => TMP.delete(fn); }
function place(o, p, q) { o.position.copy(p); if (q) o.quaternion.copy(q); o.visible = true; }
function move(o, p, { q = null, dur = .5, e = ease.io, arc = 0 } = {}) {
  const p0 = o.position.clone(), q0 = o.quaternion.clone(), p1 = p.clone(), q1 = q ? q.clone() : null;
  const d = SHOW.fast ? .001 : dur * SL(), t0 = performance.now();
  return new Promise(res => {
    const stop = onTickTmp(() => {
      const k = clamp((performance.now() - t0) / (d * 1000), 0, 1), v = e(k);
      o.position.lerpVectors(p0, p1, v);
      if (arc) o.position.y += Math.sin(Math.PI * v) * arc;
      if (q1) o.quaternion.slerpQuaternions(q0, q1, v);
      if (k >= 1) { stop(); res(); }
    });
  }).then(live);
}
/* поворот вокруг точки предмета (горлышко, край): точка стоит на месте */
function tiltAbout(o, pivotLocal, q1, dur = .4, e = ease.io) {
  o.updateMatrixWorld(true);
  const pw = o.localToWorld(pivotLocal.clone()), q0 = o.quaternion.clone(), qq = new THREE.Quaternion(), d = SHOW.fast ? .001 : dur * SL(), t0 = performance.now();
  return new Promise(res => {
    const stop = onTickTmp(() => {
      const k = clamp((performance.now() - t0) / (d * 1000), 0, 1);
      qq.slerpQuaternions(q0, q1, e(k));
      o.quaternion.copy(qq);
      o.position.copy(pw).sub(pivotLocal.clone().multiply(o.scale).applyQuaternion(qq));
      if (k >= 1) { stop(); res(); }
    });
  }).then(live);
}
/* где поставить предмет, чтобы его точка оказалась в нужном месте */
function posFor(o, local, at, q = o.quaternion) { return at.clone().sub(local.clone().multiply(o.scale).applyQuaternion(q)); }
function waitTicks(dur, fn) {
  const d = SHOW.fast ? .001 : dur * SL(), t0 = performance.now();
  return new Promise(res => { const stop = onTickTmp(() => { const t = (performance.now() - t0) / 1000 / SL(), k = clamp(t * SL() / d, 0, 1); fn(k, t); if (k >= 1) { stop(); res(); } }); }).then(live);
}

/* ---------- кисти: рука держится за предмет, пальцы обхватывают ---------- */
const HANDS = new Map();
const _gq = new THREE.Quaternion(), _hc = V3(), _gf = V3(), _gn = V3(), _gw = V3();
function dirToFig(v) { const c = Math.cos(-bt.face), s = Math.sin(-bt.face); return V3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c); }
/* хват: p — точка на предмете, f — куда смотрят пальцы, n — куда смотрит ладонь (к предмету), r — толщина предмета */
function grip(arm, obj, g, dur = .38) {
  arm.manual = true;
  handPose(arm, g.pose || "grip", g.r || .03);
  const H = { obj, g: Object.assign({ r: .03 }, g), k: 0, from: arm.cur.clone(), lift: g.lift ?? .04 };
  HANDS.set(arm, H);
  if (SHOW.fast || dur <= 0) { H.k = 1; return Promise.resolve(); }
  return tween(H, { k: 1 }, dur * SL(), ease.io).then(live);
}
function letGo(arm, pose = "relax") {
  HANDS.delete(arm);
  arm.snap = false; arm.k = 11;
  handPose(arm, pose);
}
/* свободная рука: плавно в точку мира */
function handTo(arm, p, f, n, pose = "relax", dur = .35) {
  HANDS.delete(arm);
  arm.snap = false; arm.k = 3.4 / Math.max(.1, dur * SL());
  arm.manual = true;
  handPose(arm, pose);
  const l = toFig(bt, p);
  reach(arm, l.x, l.y, l.z, dirToFig(f), dirToFig(n));
  return ws(dur);
}
/* руки на стойке, ладонями вниз — спокойная поза между делом */
function rest(arm) {
  const s = arm.side;
  return handTo(arm, B(s * .19, TOP() + .028, .3), V3(-s * .3, -.12, 1), V3(0, -1, 0), "relax", .45).catch(() => {});
}
PRE_FIG.push(() => {
  if (!HANDS.size) return;
  for (const [arm, H] of HANDS) {
    const o = H.obj, g = H.g;
    o.updateMatrixWorld(true);
    o.getWorldQuaternion(_gq);
    o.localToWorld(_hc.copy(g.p));
    _gf.copy(g.f).applyQuaternion(_gq).normalize();
    _gn.copy(g.n).applyQuaternion(_gq).normalize();
    // запястье: от точки хвата назад вдоль пальцев и от ладони
    _gw.copy(_hc).addScaledVector(_gf, -(g.along ?? .048)).addScaledVector(_gn, -(.013 + g.r));
    const l = toFig(bt, _gw);
    if (H.k < 1) { l.lerpVectors(H.from, l, H.k); l.y += Math.sin(Math.PI * H.k) * H.lift; }
    reach(arm, l.x, l.y, l.z, dirToFig(_gf), dirToFig(_gn));
    arm.snap = true;
  }
});
/* хват для правой (s = -1) и левой (s = 1) руки: кисть заходит сзади-сбоку, пальцы обнимают предмет спереди */
const wrap = (s, p, r, extra = {}) => Object.assign({ p, r, f: V3(s * .7, 0, .7), n: V3(-s * .7, 0, .7), pose: "grip" }, extra);

/* ---------- струя ---------- */
const streamMesh = mesh(new THREE.CylinderGeometry(.0042, .0034, 1, 10, 1, true), MX.stream, 0, 0, 0);
const streamCore = mesh(new THREE.CylinderGeometry(.0016, .0012, 1, 6, 1, true), MX.core, 0, 0, 0);
streamMesh.visible = streamCore.visible = false;
streamMesh.renderOrder = 6; streamCore.renderOrder = 7;
const splash = glowSprite(0xffffff, .05, 0, 0, 0, world, 0);
const STREAM = { from: null, to: null, w: 1 };
const _sa = V3(), _sb = V3(), _sd = V3();
function streamOn(fromFn, toFn, color, w = 1) {
  STREAM.from = fromFn; STREAM.to = toFn; STREAM.w = w;
  MX.stream.color.copy(color).lerp(new THREE.Color(0xffffff), .12);
  streamMesh.visible = streamCore.visible = true;
  splash.material.color.copy(color).lerp(new THREE.Color(0xffffff), .5);
}
function streamOff() { streamMesh.visible = streamCore.visible = false; STREAM.from = null; splash.material.opacity = 0; }
onTick(t => {
  if (!streamMesh.visible || !STREAM.from) return;
  STREAM.from(_sa); STREAM.to(_sb);
  _sd.subVectors(_sb, _sa);
  const len = _sd.length();
  const wob = 1 + Math.sin(t * 40) * .08;
  _sd.normalize();
  for (const m of [streamMesh, streamCore]) {
    m.position.copy(_sa).addScaledVector(_sd, len / 2);
    m.scale.set(STREAM.w * wob, Math.max(.001, len), STREAM.w * wob);
    m.quaternion.setFromUnitVectors(_up, _sd);
  }
  splash.position.copy(_sb);
  splash.material.opacity = .5 + Math.sin(t * 30) * .2;
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
  clink: () => { if (SHOW.fast) return; const c = fx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.frequency.value = rr(3200, 4200); g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25); o.connect(g).connect(c.destination); o.start(t); o.stop(t + .3); noiseHit(0, .05, 5000, 2, .07); },
  pour: dur => { if (SHOW.fast) return; for (let i = 0; i < dur * 14; i++) noiseHit(i / 14, .08, rr(700, 1400), 4, .05); },
  rattle: (dur, hz) => { if (SHOW.fast) return; for (let i = 0; i < dur * hz * 2; i++) noiseHit(i / (hz * 2), .06, rr(3500, 5200), 1.5, .13); },
  tap: () => { if (!SHOW.fast) noiseHit(0, .05, 1800, 3, .25); },
  tick: () => { if (!SHOW.fast) noiseHit(0, .03, 2600, 5, .12); },
  clap: () => { if (!SHOW.fast) noiseHit(0, .07, 1500, 1, .35, "highpass"); },
  plop: () => { if (SHOW.fast) return; const c = fx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.frequency.setValueAtTime(500, t); o.frequency.exponentialRampToValueAtTime(1100, t + .08); g.gain.setValueAtTime(.09, t); g.gain.exponentialRampToValueAtTime(.0001, t + .12); o.connect(g).connect(c.destination); o.start(t); o.stop(t + .14); },
  tinkle: dur => { if (SHOW.fast) return; for (let i = 0; i < dur * 6; i++) setTimeout(() => SND.clink(), i * 170 + rr(0, 60)); }
};

/* ---------- станция ---------- */
function station() {
  ST.bx = SEAT.on ? SEAT_X + .02 : 1.2;
  ST.bz = -3.0;
  const T = TOP();
  Object.assign(ST, {
    glass: B(-.07, T, .42), serve: SEAT.on ? V3(SEAT_X + .06, T, -2.14) : B(-.07, T, .78),
    tin: B(.15, T, .38), cap: B(.29, T, .5), jig: B(.31, T, .36), spoon: B(.07, T + .005, .54), strainer: B(.36, T + .004, .53),
    bucket: B(-.44, T, .27), scoop: B(-.3, T + .006, .25), tray: B(-.31, T + .01, .47), rail: B(-.22, T - .21, .17), salt: B(-.2, T + .006, .3)
  });
}

/* ---------- камера-режиссёр: кадр строится вокруг точки действия и плавно её ведёт ---------- */
const CD = { shot: "medium", fs: V3(), snap: true, side: 1 };
function shot(name, focus, side = choose([-1, 1])) { CD.shot = SHOW.force || name; SHOW.focus.copy(focus); CD.side = side; CD.snap = true; }
function follow(focus) { SHOW.focus.copy(focus); }
function shotDef(name, f) {
  const s = CD.side, bx = ST.bx, bz = ST.bz;
  switch (name) {
    case "macro": return { pos: f.clone().add(V3(s * .17, .01, .5)), tgt: f.clone().add(V3(0, .01, 0)), span: .44 };
    case "low": return { pos: f.clone().add(V3(s * .24, -.04, .52)), tgt: f.clone().add(V3(0, .07, 0)), span: .55 };
    case "top": return { pos: f.clone().add(V3(s * .06, .44, .3)), tgt: f.clone(), span: .4 };
    case "side": return { pos: f.clone().add(V3(s * .62, .08, .34)), tgt: f.clone().add(V3(0, .03, 0)), span: .55 };
    case "face": return { pos: V3(bx + s * .3, (f.y + 1.58) / 2 + .04, bz + 1.25), tgt: V3(bx + (f.x - bx) * .5, (f.y + 1.58) / 2, bz + .25), span: .85 };
    default: return { pos: V3(bx + s * .22, 1.43, bz + 1.5), tgt: V3(bx + (f.x - bx) * .4, 1.31, bz + .33), span: 1.05 };
  }
}
const _cp = V3(), _ct = V3(), CARD_W = 280;
onTick((t, dt) => {
  if (!SHOW.on || flight) return;
  if (CD.snap) CD.fs.copy(SHOW.focus); else CD.fs.lerp(SHOW.focus, smoothK(3.2, dt));
  const aspect = innerWidth / innerHeight;
  let fov;
  if (SEAT.on) {
    const s = seatShot();
    _cp.set(s.px, s.py, s.pz); _ct.copy(CD.fs).add(V3(0, .04, 0));
    const dist = _cp.distanceTo(_ct), span = CD.shot === "face" || CD.shot === "medium" ? .95 : .62;
    const need = 2 * Math.atan(span / 2 / dist) / D2R;
    fov = clamp(aspect < 1 ? 2 * Math.atan(Math.tan(need * D2R / 2) / aspect) / D2R : need, 26, 62);
    if (innerWidth > 640) {
      const hf = 2 * Math.atan(Math.tan(fov / 2 * D2R) * aspect) / D2R;
      _ct.addScaledVector(V3().subVectors(_ct, _cp).cross(_up).normalize(), 2 * dist * Math.tan(hf / 2 * D2R) * (CARD_W / 2 / innerWidth));
    }
  } else {
    const d = shotDef(CD.shot, CD.fs);
    const base = aspect < 1 ? 56 : 36;
    const hf = 2 * Math.atan(Math.tan(base / 2 * D2R) * aspect) / D2R, mf = Math.min(base, hf);
    const dist = d.span / 2 / Math.tan(mf / 2 * D2R);
    const dir = d.pos.clone().sub(d.tgt).normalize();
    _cp.copy(d.tgt).addScaledVector(dir, dist);
    _cp.z = Math.max(_cp.z, CT.z0 + .45);
    _cp.y = Math.max(_cp.y, 1.0);
    _ct.copy(d.tgt); fov = base;
    // справа карточка рецепта: действие сдвигаем левее центра
    if (innerWidth > 640) {
      const r = V3().subVectors(_ct, _cp).cross(_up).normalize();
      const sh = 2 * dist * Math.tan(hf / 2 * D2R) * (CARD_W / 2 / innerWidth);
      _cp.addScaledVector(r, sh); _ct.addScaledVector(r, sh);
    }
  }
  if (CD.snap) { setCam({ px: _cp.x, py: _cp.y, pz: _cp.z, tx: _ct.x, ty: _ct.y, tz: _ct.z, fov }); CD.snap = false; return; }
  const k = smoothK(2.4, dt), kt = smoothK(4, dt);
  CAM.px += (_cp.x - CAM.px) * k; CAM.py += (_cp.y - CAM.py) * k; CAM.pz += (_cp.z - CAM.pz) * k;
  CAM.tx += (_ct.x - CAM.tx) * kt; CAM.ty += (_ct.y - CAM.ty) * kt; CAM.tz += (_ct.z - CAM.tz) * kt;
  CAM.fov += (fov - CAM.fov) * k;
});

/* ---------- интерфейс: подписи, карточка рецепта, ярлык у бутылки ---------- */
const showUI = { root: document.getElementById("show-ui"), title: document.getElementById("show-title"), count: document.getElementById("show-count"), text: document.getElementById("show-text"), cap: document.getElementById("show-cap"),
  list: document.getElementById("sc-list"), sub: document.getElementById("sc-sub"), cup: document.getElementById("sc-cup"), tag: document.getElementById("show-tag") };
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
    case "ice": return st[2] ? "Колотый лёд доверху" : st[1] === "tin" ? "Лёд в шейкер" : st[1] === "mixer" ? "Лёд в стакан для смешивания" : "Лёд в бокал";
    case "jig": return `${st[2]} мл ${GEN[st[1]]} — точно по джиггеру`;
    case "pour": return `${st[2]} мл ${GEN[st[1]]}`;
    case "top": return `Доливаем ${TOPACC[st[1]]}`;
    case "dash": return `${st[2]} ${st[2] === 1 ? "капля" : "капли"} ангостуры`;
    case "leaves": return "Листья свежей мяты";
    case "muddle": return "Мягко разминаем мяту — она отдаёт аромат";
    case "squeeze": return "Выжимаем лайм";
    case "rim": return "Солёный ободок";
    case "shake": return "Встряхиваем, пока шейкер не покроется инеем";
    case "stir": return "Размешиваем ложкой: холодно и прозрачно";
    case "stirIn": return "Перемешиваем";
    case "strain": return "Процеживаем через стрейнер";
    case "float": return "Гренадин тяжелее — он опускается на дно";
    case "garnish": return `Финальный штрих: ${GNAME[c.garnish] || "украшение"}`;
    case "serve": return choose(["Готово. Приятного вечера!", "Ваш коктейль. Наслаждайтесь.", "Прошу. За ваш вечер!"]);
  }
  return "";
}
const GCOL = { wheel: 0xa8c83e, wedge: 0xa8c83e, lemon: 0xf2d24a, orange: 0xf08a22, mint: 0x3f8f3a, cherry: 0xa8101e, pineapple: 0xf2c84a, olive: 0x8a9a30 };
/* строка карточки для шага рецепта */
function cardRow(st, c) {
  const { GNAME } = Closeup;
  const ing = (n, a) => ({ name: NOM[n] || n, amt: a, col: "#" + liqOf(n).getHexString() });
  const tech = (name, amt = "") => ({ name, amt, tech: true });
  switch (st[0]) {
    case "ice": return tech(st[2] ? "Колотый лёд" : "Лёд", st[1] === "tin" ? "в шейкер" : st[1] === "mixer" ? "в стакан" : "в бокал");
    case "jig": case "pour": return ing(st[1], `${st[2]} мл`);
    case "top": return ing(st[1], "доверху");
    case "dash": return ing("bitters", `${st[2]} ${st[2] === 1 ? "капля" : "капли"}`);
    case "float": return ing("grenadine", "15 мл");
    case "leaves": return { name: "Мята", amt: "8 листьев", col: "#3f8f3a" };
    case "squeeze": return { name: "Лайм", amt: "выжать", col: "#a8c83e" };
    case "rim": return { name: "Соль", amt: "на ободок", col: "#f4f1ea" };
    case "muddle": return tech("Размять");
    case "shake": return tech("Взболтать", "со льдом");
    case "stir": return tech("Размешать", "со льдом");
    case "stirIn": return tech("Перемешать");
    case "strain": return tech("Процедить", "в бокал");
    case "garnish": { const g = GNAME[c.garnish] || "украшение"; return { name: g[0].toUpperCase() + g.slice(1), amt: "", col: "#" + new THREE.Color(GCOL[c.garnish] || 0x9fc23a).getHexString() }; }
  }
  return null;
}
const CUP_SVG = {
  martini: { d: "M14 14 L86 14 L50 62 Z", stem: [62, 104], top: 14, bot: 62 },
  coupe: { d: "M14 18 Q16 58 50 60 Q84 58 86 18 Z", stem: [60, 104], top: 18, bot: 60 },
  wine: { d: "M26 10 Q20 60 50 64 Q80 60 74 10 Z", stem: [64, 104], top: 10, bot: 64 },
  rocks: { d: "M22 44 L26 108 L74 108 L78 44 Z", stem: null, top: 44, bot: 108 },
  highball: { d: "M30 8 L32 110 L68 110 L70 8 Z", stem: null, top: 8, bot: 110 },
  shot: { d: "M36 60 L39 108 L61 108 L64 60 Z", stem: null, top: 60, bot: 108 },
  snifter: { d: "M30 30 Q14 70 50 76 Q86 70 70 30 Z", stem: [76, 104], top: 30, bot: 76 }
};
const CARD = { rows: [], map: [], layers: [], total: 100, filled: 0, cup: null };
function buildCard(c, prog) {
  showUI.list.innerHTML = "";
  CARD.rows = []; CARD.map = []; CARD.layers = []; CARD.filled = 0;
  const kind = prog.some(s => s[0] === "shake") ? "shake" : prog.some(s => s[0] === "stir") ? "stir" : "build";
  showUI.sub.textContent = { shake: "Взболтать в шейкере", stir: "Размешать со льдом", build: "Собрать в бокале" }[kind];
  prog.forEach((st, i) => {
    const r = cardRow(st, c);
    if (!r) { CARD.map[i] = -1; return; }
    const li = document.createElement("li");
    if (r.tech) li.className = "tech";
    li.innerHTML = `<i${r.col ? ` style="background:${r.col}"` : ""}></i><span class="n"></span><span class="a"></span>`;
    li.querySelector(".n").textContent = r.name; li.querySelector(".a").textContent = r.amt;
    showUI.list.appendChild(li);
    CARD.map[i] = CARD.rows.length;
    CARD.rows.push(li);
  });
  CARD.total = prog.reduce((s, st) => s + (st[0] === "jig" || st[0] === "pour" ? st[2] : st[0] === "top" ? 70 : st[0] === "float" ? 15 : st[0] === "squeeze" ? 10 : st[0] === "dash" ? 4 : 0), 0) || 100;
  const cup = CUP_SVG[c.cup] || CUP_SVG.rocks;
  const stem = cup.stem ? `<path d="M50 ${cup.stem[0]} L50 ${cup.stem[1]}" class="st"/><ellipse cx="50" cy="${cup.stem[1] + 3}" rx="17" ry="3" class="st"/>` : "";
  showUI.cup.innerHTML = `<defs><clipPath id="sc-clip"><path d="${cup.d}"/></clipPath></defs><g clip-path="url(#sc-clip)" id="sc-fill"></g><path d="${cup.d}" class="gl"/>${stem}`;
  CARD.cup = cup;
}
function cardStep(i) {
  const k = CARD.map[i];
  if (k === undefined || k < 0) return;
  CARD.rows.forEach((li, j) => { li.classList.toggle("now", j === k); if (j < k) li.classList.add("done"); });
  const li = CARD.rows[k];
  if (li && li.scrollIntoView && showUI.list.scrollHeight > showUI.list.clientHeight) li.scrollIntoView({ block: "nearest", inline: "nearest" });
}
function cardDone() { CARD.rows.forEach(li => { li.classList.remove("now"); li.classList.add("done"); }); }
/* слой в маленьком бокале на карточке */
function cardLayer(col, ml) {
  const cup = CARD.cup, fill = document.getElementById("sc-fill");
  if (!cup || !fill) return;
  const H = cup.bot - cup.top, h = H * .88 * ml / CARD.total;
  const y = cup.bot - CARD.filled - h;
  CARD.filled += h;
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  r.setAttribute("x", 0); r.setAttribute("y", y.toFixed(2)); r.setAttribute("width", 100); r.setAttribute("height", (h + .6).toFixed(2));
  r.setAttribute("fill", "#" + col.getHexString());
  r.classList.add("ly");
  fill.appendChild(r);
  CARD.layers.push(r);
}
function cardMix(col) { const h = "#" + new THREE.Color(col).getHexString(); CARD.layers.forEach(r => r.setAttribute("fill", h)); }
/* ярлык у бутылки: «Текила · 50 мл» рядом с этикеткой */
const TAG = { obj: null };
function tagOn(obj, text) { TAG.obj = obj; showUI.tag.textContent = text; showUI.tag.classList.add("show"); }
function tagOff() { TAG.obj = null; showUI.tag.classList.remove("show"); }
const _tp = V3();
onTick(() => {
  if (!TAG.obj || !SHOW.on) return;
  TAG.obj.updateMatrixWorld(true);
  TAG.obj.localToWorld(_tp.set(0, TAG.obj.userData.top * .5, 0)).project(camera);
  const x = (_tp.x * .5 + .5) * innerWidth, y = (-_tp.y * .5 + .5) * innerHeight;
  const W = showUI.tag.offsetWidth || 140;
  const left = innerWidth <= 640 ? x - W - 30 : x < innerWidth * .5 ? x + 40 : x - W - 40;
  showUI.tag.style.transform = `translate(${clamp(left, 8, innerWidth - W - 8).toFixed(0)}px, ${clamp(y - 16, 70, innerHeight - 170).toFixed(0)}px)`;
});

/* ---------- лёд ---------- */
function iceSpot(V, crushed) {
  const n = V.ice.length, r = Math.max(.006, Math.min(V.r0, V.r1) * .55);
  const a = n * 2.39996, per = crushed ? 6 : 3;
  const ring = n % per === 0 ? .2 : 1;
  return V3(Math.cos(a) * r * ring, V.y0 + .013 + Math.floor(n / per) * (crushed ? .011 : .02), Math.sin(a) * r * ring);
}
async function dropCube(V, from, crushed) {
  const cube = new THREE.Mesh(crushed ? crushGeo : cubeGeo, MX.ice);
  cube.renderOrder = 5;
  cube.position.copy(from);
  cube.rotation.set(rr(0, 3), rr(0, 3), 0);
  world.add(cube);
  const local = iceSpot(V, crushed);
  V.ice.push(cube);
  const dst = V.g.localToWorld(local.clone());
  await tween(cube.position, { x: dst.x, y: dst.y, z: dst.z }, SHOW.fast ? .001 : rr(.16, .24), ease.in);
  V.g.attach(cube);
  SND.clink();
}
async function stepIce(st) {
  const V = st[1] === "tin" ? P.tin : st[1] === "mixer" ? P.mixer : SHOW.glassV, crushed = !!st[2];
  const n = crushed ? 12 : V === SHOW.glassV ? (SHOW.c.cup === "rocks" ? 3 : 5) : 7;
  const S = P.scoop.g, R = bt.R;
  shot(choose(["macro", "low", "medium"]), ST.bucket.clone().add(V3(.15, .12, .05)));
  bt.look = ST.bucket;
  // совок за ручку: ладонь сверху, пальцы вдоль ручки
  await grip(R, S, { p: V3(-.06, .006, 0), r: .009, f: V3(0, 0, 1), n: V3(0, -1, 0), pose: "grip", along: .045 }, .45);
  const inB = ST.bucket.clone().add(V3(.02, .11, 0));
  await move(S, inB.clone().add(V3(0, .09, 0)), { q: Qe(0, .25, -.5), dur: .4, arc: .03 });
  await move(S, inB, { q: Qe(0, .25, -.7), dur: .2, e: ease.in });
  P.scoop.cubes.forEach((c, i) => { c.visible = i < Math.min(5, n); c.geometry = crushed ? crushGeo : cubeGeo; });
  SND.clink();
  await move(S, inB.clone().add(V3(0, .1, 0)), { q: Qe(0, .25, .2), dur: .25, e: ease.out });
  follow(mouth(V));
  bt.look = mouth(V);
  // над сосудом и наклон ковшом вниз
  const over = mouth(V, .06).add(V3(-.04, 0, 0));
  await move(S, over, { q: Qe(0, 0, .2), dur: .55, arc: .05 });
  await move(S, over.clone().add(V3(.01, -.01, 0)), { q: Qe(0, 0, -.9), dur: .25 });
  P.scoop.cubes.forEach(c => { c.visible = false; });
  const from = mouth(V, .04);
  for (let i = 0; i < n; i++) { dropCube(V, from.clone().add(V3(rr(-.012, .012), rr(0, .03), rr(-.012, .012))), crushed); await ws(crushed ? .03 : .06); }
  await ws(.2);
  await move(S, over.clone().add(V3(0, .03, 0)), { q: Qe(0, 0, .1), dur: .25 });
  await move(S, ST.scoop, { q: Qe(0, 0, 0), dur: .45, arc: .05 });
  letGo(R);
  await rest(R);
}

/* ---------- бутылка: из рейла, показать этикетку, налить ---------- */
async function bottleUp(ing, label) {
  const b = makeBottle(ing), u = b.userData, R = bt.R;
  place(b, ST.rail, Qe(0, 0, 0));
  bt.look = b.position.clone().add(V3(0, .3, 0));
  await grip(R, b, wrap(-1, V3(0, u.top * .5, 0), u.r), .4);
  // поднимает и на миг показывает этикетку гостю
  const show = B(-.17, TOP() + .1, .36);
  await move(b, show, { q: Qe(0, rr(-.15, .15), 0), dur: .5, arc: .04 });
  tagOn(b, `${NOM[ing] || ""}${label ? " · " + label : ""}`);
  const r = Math.random();
  if (r < .25 && !SHOW.fast) {
    // прокрутка в ладони
    await move(b, show.clone().add(V3(0, .02, 0)), { q: Qe(0, Math.PI * 2 - .01, 0), dur: .55 });
  } else if (r < .42 && !SHOW.fast) {
    // подброс с переворотом и ловля
    const H = HANDS.get(R); HANDS.delete(R);
    handPose(R, "open");
    await move(b, show.clone().add(V3(0, .26, 0)), { q: Qe(Math.PI, 0, 0), dur: .3, e: ease.out });
    await move(b, show, { q: Qe(Math.PI * 2 - .001, 0, 0), dur: .3, e: ease.in });
    b.quaternion.identity();
    HANDS.set(R, H); handPose(R, "grip", u.r);
    SND.tap();
  } else await ws(.35);
  return b;
}
async function bottleDown(b) {
  tagOff();
  await move(b, ST.rail.clone().add(V3(0, .06, 0)), { q: Qe(0, 0, 0), dur: .45, arc: .03 });
  letGo(bt.R);
  move(b, ST.rail.clone().add(V3(0, -.35, 0)), { dur: .3, e: ease.in }).then(() => world.remove(b), () => world.remove(b));
  rest(bt.R);
}
/* налить из предмета с носиком: носик подходит к цели, поворот вокруг носика, струя */
async function pourFrom(o, spoutLocal, to, ml, col, { gap = .05, ang = -2.25, rate = 1, fill = null, approach = .5, w = 1 } = {}) {
  const tgt = to().add(V3(0, gap, 0));
  const q1 = Qz(ang * .45);
  await move(o, posFor(o, spoutLocal, tgt.clone().add(V3(ang < 0 ? -.03 : .03, .03, 0)), q1), { q: q1, dur: approach, arc: .03 });
  await tiltAbout(o, spoutLocal, Qz(ang), .32);
  const spout = v => v.copy(o.localToWorld(spoutLocal.clone()));
  streamOn(spout, v => v.copy(to()), col, w * (ml > 60 ? 1.25 : 1));
  const dur = (.45 + ml / 65) / rate;
  SND.pour(Math.min(2.5, dur));
  await waitTicks(dur, k => { if (fill) fill(k); });
  streamOff();
  // отсекает струю: горлышко вверх
  await tiltAbout(o, spoutLocal, Qz(ang * .4), .22);
}

/* ---------- джиггер ---------- */
let jigOn = false;
const JIG_WAIST = V3(0, .046, 0);
async function jiggerUp(V) {
  const L = bt.L, J = P.jig.g;
  if (!jigOn) {
    await grip(L, J, wrap(1, JIG_WAIST, .01, { pose: "pinch", along: .05 }), .4);
    jigOn = true;
  }
  await move(J, posFor(J, JIG_WAIST, mouth(V, .05).add(V3(.035, 0, -.005)), Qe(0, 0, 0)), { q: Qe(0, 0, 0), dur: .4, arc: .03 });
}
async function jiggerPark() {
  if (!jigOn) return;
  await move(P.jig.g, ST.jig, { q: Qe(0, 0, 0), dur: .4, arc: .04 });
  letGo(bt.L); jigOn = false;
  await rest(bt.L);
}
async function stepJig(st) {
  const [, ing, ml, into] = st;
  const V = into === "glass" ? SHOW.glassV : SHOW.main;
  const col = liqOf(ing), J = P.jig.g, jl = P.jig.liq;
  shot(choose(["macro", "low", "side", "macro"]), mouth(V, .12).add(V3(-.06, 0, 0)));
  const [b] = await Promise.all([bottleUp(ing, `${ml} мл`), jiggerUp(V)]);
  const full = .039 * clamp(ml / 50, .25, 1);
  const jSurf = () => J.localToWorld(V3(0, .049 + Math.max(.004, jl.scale.y), 0));
  follow(J.localToWorld(V3(0, .1, 0)));
  bt.look = J.position;
  const high = chance(.35) && ml >= 20;
  jl.material.color.copy(col); jl.material.emissive = col.clone().multiplyScalar(.3);
  await pourFrom(b, V3(0, b.userData.top, 0), jSurf, ml, col, {
    gap: high ? rr(.18, .26) : rr(.05, .08), rate: high ? .85 : 1,
    fill: k => { jl.visible = k > .02; jl.scale.y = Math.max(.0001, full * k); }
  });
  if (high) bt.look = camera.position;
  bottleDown(b);
  // джиггер переворачивается над сосудом
  follow(mouth(V, .04));
  bt.look = mouth(V);
  const flip = 2.5;
  await tiltAbout(J, JIG_WAIST, Qz(flip), .26, ease.in);
  streamOn(v => v.copy(J.localToWorld(V3(-.025, .089, 0))), v => v.copy(surface(V)), col, .95);
  const m0 = V.ml;
  await waitTicks(.34, k => { jl.scale.y = Math.max(.0001, full * (1 - k)); V.ml = m0 + ml * k; if (V !== P.tin) { V.col.lerp(col, .08); setLevel(V); } });
  streamOff();
  jl.visible = false;
  V.ml = m0 + ml; V.col.lerp(col, ml / Math.max(V.ml, 1)); setLevel(V);
  cardLayer(col, ml);
  await tiltAbout(J, JIG_WAIST, Qz(0), .24);
  // иногда небрежно крутит джиггер пальцами
  if (chance(.25) && !SHOW.fast) await move(J, J.position.clone().add(V3(0, .02, 0)), { q: Qe(0, Math.PI * 2 - .01, 0), dur: .45 });
}
async function stepPour(st, isTop = false) {
  const [, ing, ml0] = st, ml = isTop ? 70 : ml0;
  const V = SHOW.glassV, col = liqOf(ing);
  await jiggerPark();
  shot(choose(["side", "macro", "low"]), mouth(V, .05));
  const b = await bottleUp(ing, isTop ? "доверху" : `${ml} мл`);
  bt.look = mouth(V);
  follow(mouth(V, .08));
  const m0 = V.ml;
  await pourFrom(b, V3(0, b.userData.top, 0), () => surface(V), ml, col, {
    gap: isTop ? rr(.04, .07) : rr(.1, .2), rate: isTop ? .75 : 1.1,
    fill: k => { V.ml = m0 + ml * k; V.col.lerp(col, .05); setLevel(V); }
  });
  cardLayer(col, ml);
  await bottleDown(b);
}
async function stepDash(st) {
  const V = st[3] === "glass" ? SHOW.glassV : SHOW.main;
  await jiggerPark();
  shot("macro", mouth(V, .06));
  const b = await bottleUp("bitters", `${st[2]} ${st[2] === 1 ? "капля" : "капли"}`);
  const top = V3(0, b.userData.top, 0), q = Qz(-2.4);
  follow(mouth(V, .06));
  await move(b, posFor(b, top, mouth(V, .09), q), { q, dur: .45, arc: .03 });
  for (let i = 0; i < (st[2] || 1); i++) {
    const p0 = b.position.clone();
    await move(b, p0.clone().add(V3(0, -.03, 0)), { dur: .08, e: ease.in });
    const d = mesh(new THREE.SphereGeometry(.004, 8, 6), std({ color: 0x5a1a0c }), 0, 0, 0);
    b.localToWorld(d.position.copy(top));
    tween(d.position, { y: surface(V).y }, .18, ease.in).then(() => world.remove(d));
    await move(b, p0, { dur: .14, e: ease.out });
    await ws(.12);
  }
  cardLayer(new THREE.Color(0x5a1a0c), 4);
  await bottleDown(b);
}

/* ---------- шейк ---------- */
async function stepShake() {
  const V = P.tin, T = V.g, C = P.cap.g, R = bt.R, L = bt.L;
  await jiggerPark();
  shot(choose(["macro", "low"]), mouth(V, .05));
  bt.look = mouth(V);
  // малый стакан: левой рукой, переворот и сверху на шейкер
  await grip(L, C, wrap(1, V3(0, .07, 0), .04), .38);
  const qC = Qx(Math.PI);
  await move(C, posFor(C, V3(0, .123, 0), mouth(V, .05), qC), { q: qC, dur: .45, arc: .05 });
  await move(C, posFor(C, V3(0, .123, 0), mouth(V, -.03), qC), { dur: .16, e: ease.in });
  T.attach(C);
  // ладонью прихлопывает
  letGo(L, "flat");
  const capTop = () => C.localToWorld(V3(0, 0, 0));
  await handTo(L, capTop().add(V3(0, .06, -.03)), V3(0, 0, 1), V3(0, -1, 0), "flat", .16);
  await handTo(L, capTop().add(V3(0, .03, -.03)), V3(0, 0, 1), V3(0, -1, 0), "flat", .08);
  SND.tap();
  // обе руки: правая на корпусе, левая на дне малого стакана
  const tl = T.worldToLocal(capTop());
  await Promise.all([
    grip(R, T, wrap(-1, V3(0, .07, 0), .047), .35),
    grip(L, T, { p: tl.clone().add(V3(0, .004, 0)), r: .012, f: V3(0, 0, 1), n: V3(0, -1, 0), pose: "hook", along: .05 }, .35)
  ]);
  const style = choose(["shoulder", "shoulder", "front", "hard"]);
  // иногда подброс: шейкер переворачивается в воздухе
  if (chance(.22) && !SHOW.fast) {
    const hold = [HANDS.get(R), HANDS.get(L)]; HANDS.clear();
    handPose(R, "open"); handPose(L, "open");
    const p0 = T.position.clone();
    await move(T, p0.clone().add(V3(0, .3, .02)), { q: Qe(0, Math.PI, 0), dur: .32, e: ease.out });
    await move(T, p0.clone().add(V3(0, .12, 0)), { q: Qe(0, Math.PI * 2 - .001, 0), dur: .28, e: ease.in });
    T.quaternion.identity();
    HANDS.set(R, hold[0]); HANDS.set(L, hold[1]); handPose(R, "grip", .047); handPose(L, "hook");
    SND.tap();
  }
  shot(choose(["face", "medium", "face"]), B(-.05, 1.42, .3));
  bt.look = chance(.6) ? camera.position : null;
  BT.nod = 1;
  // ось шейкера: корпус у плеча, малый стакан к гостю
  const axis = { shoulder: V3(.25, -.06, .97), front: V3(.05, .97, .22), hard: V3(.3, .1, .95) }[style].normalize();
  const base = { shoulder: B(-.17, 1.46, .12), front: B(-.03, 1.2, .3), hard: B(-.16, 1.4, .13) }[style];
  const ctr = base.clone().addScaledVector(axis, .14);
  const q = new THREE.Quaternion().setFromUnitVectors(_up, axis);
  await move(T, base, { q, dur: .5, arc: .04 });
  follow(ctr);
  const dur = rr(2.4, 3.1), hz = rr(2.6, 3.3), amp = rr(.06, .085);
  SND.rattle(Math.min(dur, 3), hz);
  const side = V3().crossVectors(axis, V3(1, 0, 0)).normalize();
  await waitTicks(dur, (k, t) => {
    const ph = t * hz * Math.PI * 2;
    let o;
    if (style === "hard") { const i = Math.floor(((ph / (Math.PI * 2)) % 1) * 3); o = [axis.clone().multiplyScalar(amp), side.clone().multiplyScalar(-.04), axis.clone().multiplyScalar(-amp * .8)][i]; }
    else o = axis.clone().multiplyScalar(Math.sin(ph) * amp).addScaledVector(side, Math.cos(ph) * .015);
    T.position.copy(base).add(o);
    T.quaternion.copy(q).multiply(Qx(Math.sin(ph) * .08));
    bt.spine.position.y = Math.sin(ph) * .005;
    bt.leanT = .1 + Math.sin(ph * .5) * .02;
  });
  BT.nod = 0; bt.spine.position.y = 0; bt.leanT = .1;
  cardMix(SHOW.c.pour);
  // на стойку: металл в инее
  T.children[0].material = MX.frost;
  shot(choose(["macro", "low"]), mouth(V, .09));
  await move(T, ST.tin, { q: Qe(0, 0, 0), dur: .5, arc: .05 });
  SND.tap();
  // ладонью по стыку, малый стакан снимается
  letGo(L, "flat");
  const seam = mouth(V, .0);
  await handTo(L, seam.clone().add(V3(.13, .02, -.02)), V3(0, .3, 1), V3(-1, 0, 0), "flat", .2);
  await handTo(L, seam.clone().add(V3(.075, .02, -.02)), V3(0, .3, 1), V3(-1, 0, 0), "flat", .07);
  SND.tap();
  world.attach(C);
  await grip(L, C, wrap(1, V3(0, .06, 0), .04), .3);
  await move(C, C.position.clone().add(V3(.02, .08, 0)), { q: Qx(Math.PI).multiply(Qe(0, .6, 0)), dur: .3 });
  await move(C, ST.cap, { q: Qe(0, 0, 0), dur: .45, arc: .06 });
  letGo(L); letGo(R);
  await Promise.all([rest(L), rest(R)]);
}

/* ---------- стир ---------- */
const SPOON_GRIP = { p: V3(0, -.05, 0), r: .004, f: V3(0, -1, .25), n: V3(-1, 0, 0), pose: "pinch", along: .07 };
async function stepStir() {
  const V = P.mixer, S = P.spoon.g, R = bt.R, L = bt.L;
  await jiggerPark();
  shot(choose(["macro", "low", "side"]), mouth(V, .03));
  bt.look = mouth(V);
  await grip(L, V.g, wrap(1, V3(0, .05, 0), .05), .35);
  place(S, ST.spoon, Qx(Math.PI / 2));
  await grip(R, S, SPOON_GRIP, .4);
  const c0 = mouth(V);
  await move(S, c0.clone().add(V3(0, .32, 0)), { q: Qe(0, 0, 0), dur: .45, arc: .04 });
  await move(S, c0.clone().add(V3(.026, .155, 0)), { dur: .3, e: ease.in });
  const dur = rr(2.4, 3), w = rr(8.5, 11);
  SND.tinkle(Math.min(dur, 3));
  await waitTicks(dur, (k, t) => {
    const a = t * w;
    // ложка идёт по стенке, спинкой к стеклу
    S.position.set(c0.x + Math.cos(a) * .026, c0.y + .155, c0.z + Math.sin(a) * .026);
    S.quaternion.copy(Qe(0, -a, 0)).multiply(Qz(.06));
    V.ice.forEach((cube, i) => { cube.rotation.y += .06; const b = a * .35 + i * 1.9, rr_ = (i % 3) ? .022 : .006; cube.position.x = Math.cos(b) * rr_; cube.position.z = Math.sin(b) * rr_; });
  });
  V.col.lerp(new THREE.Color(SHOW.c.pour), .8); setLevel(V);
  cardMix(SHOW.c.pour);
  await move(S, c0.clone().add(V3(0, .34, 0)), { q: Qe(0, 0, 0), dur: .35, e: ease.out });
  if (chance(.35) && !SHOW.fast) await move(S, c0.clone().add(V3(0, .36, 0)), { q: Qe(0, Math.PI * 4 - .01, 0), dur: .55 });
  await move(S, ST.spoon, { q: Qx(Math.PI / 2), dur: .45, arc: .04 });
  letGo(R); letGo(L);
  await Promise.all([rest(R), rest(L)]);
}
async function stepStirIn() {
  const V = SHOW.glassV, S = P.spoon.g, R = bt.R;
  await jiggerPark();
  shot(choose(["macro", "low"]), mouth(V, .03));
  place(S, ST.spoon, Qx(Math.PI / 2));
  await grip(R, S, SPOON_GRIP, .4);
  const c0 = mouth(V);
  await move(S, c0.clone().add(V3(0, .34, 0)), { q: Qe(0, 0, 0), dur: .45, arc: .04 });
  const knob = V.g.position.y + .305 + .015;
  await move(S, V3(c0.x, knob, c0.z), { dur: .3, e: ease.in });
  const dur = rr(1.2, 1.7);
  SND.tinkle(dur);
  await waitTicks(dur, (k, t) => { const a = t * 9; S.position.set(c0.x + Math.cos(a) * .012, knob + Math.sin(t * 6) * .01, c0.z + Math.sin(a) * .012); S.quaternion.copy(Qe(0, -a, 0)); });
  V.col.lerp(new THREE.Color(SHOW.c.pour), .85); setLevel(V);
  cardMix(SHOW.c.pour);
  await move(S, c0.clone().add(V3(0, .36, 0)), { q: Qe(0, 0, 0), dur: .3 });
  await move(S, ST.spoon, { q: Qx(Math.PI / 2), dur: .4, arc: .04 });
  letGo(R);
  await rest(R);
}

/* ---------- процеживание ---------- */
async function stepStrain() {
  const S = SHOW.main, G = SHOW.glassV, R = bt.R, L = bt.L, SR = P.strainer.g;
  await jiggerPark();
  shot(choose(["macro", "low"]), mouth(S, .03));
  bt.look = mouth(S);
  // стрейнер на край, ручкой к бармену
  place(SR, ST.strainer, Qe(0, 0, 0));
  await grip(L, SR, { p: V3(0, 0, .11), r: .004, f: V3(0, 0, -1), n: V3(0, -1, 0), pose: "pinch", along: .05 }, .35);
  await move(SR, mouth(S, .004), { q: Qe(0, Math.PI, 0), dur: .45, arc: .05 });
  S.g.attach(SR);
  letGo(L);
  const high = chance(.3);
  // правая рука: корпус, указательный прижимает стрейнер
  await grip(R, S.g, wrap(-1, V3(0, .12, 0), .048), .35);
  R.ft = [.12, .55, .62, .7];
  // левая придерживает бокал у основания
  grip(L, G.g, wrap(1, V3(0, .012, 0), .015, { pose: "pinch", along: .05 }), .4).catch(() => {});
  shot(choose(["side", "macro", "low"]), mouth(G, .09));
  bt.look = mouth(G);
  const spout = V3(-S.mouthR, S.mouthY, 0);
  const col = new THREE.Color(SHOW.c.pour), ml = Math.max(40, S.ml * .82), m0 = G.ml;
  G.col.copy(col);
  await pourFrom(S.g, spout, () => surface(G), ml, col, {
    gap: high ? rr(.12, .16) : rr(.05, .08), ang: 1.75, rate: .9,
    fill: k => { G.ml = m0 + ml * k; setLevel(G); }
  });
  S.ml = 0;
  letGo(L);
  rest(L);
  await move(S.g, ST.tin, { q: Qe(0, 0, 0), dur: .5, arc: .05 });
  letGo(R);
  world.attach(SR);
  SR.visible = false;
  await rest(R);
}

/* ---------- мята, мадлер, лайм, ободок, гренадин ---------- */
function leafMesh() { const l = mesh(new THREE.SphereGeometry(.013, 10, 6), std({ color: 0x3f8f3a, roughness: .55, emissive: 0x0a2a08 }), 0, 0, 0); l.scale.set(1, .22, .55); return l; }
const PINCH = (p = V3(0, 0, 0)) => ({ p, r: .006, f: V3(.2, -.45, .85).normalize(), n: V3(.95, 0, .25).normalize(), pose: "pinch", along: .068 });
async function stepLeaves() {
  const G = SHOW.glassV, R = bt.R;
  shot(choose(["macro", "low"]), mouth(G, .04));
  bt.look = ST.tray;
  const bunch = new THREE.Group();
  for (let i = 0; i < 6; i++) { const l = leafMesh(); world.remove(l); l.position.set(rr(-.008, .008), i * .006, rr(-.008, .008)); l.rotation.set(rr(0, 1), rr(0, 3), 0); bunch.add(l); }
  world.add(bunch);
  place(bunch, ST.tray.clone().add(V3(.04, .02, 0)));
  await grip(R, bunch, PINCH(V3(0, .01, 0)), .4);
  await move(bunch, mouth(G, .06), { dur: .5, arc: .06 });
  bt.look = mouth(G);
  letGo(R, "open");
  [...bunch.children].forEach((l, i) => {
    world.attach(l);
    const d = G.g.localToWorld(V3(rr(-.012, .012), G.y0 + .006 + i * .003, rr(-.012, .012)));
    tween(l.position, { x: d.x, y: d.y, z: d.z }, SHOW.fast ? .001 : .3 + i * .03, ease.in).then(() => G.g.attach(l));
  });
  world.remove(bunch);
  await ws(.45);
  await rest(R);
}
async function stepMuddle() {
  const G = SHOW.glassV, MD = P.muddler.g, R = bt.R, L = bt.L;
  shot(choose(["macro", "low"]), mouth(G, .04));
  const home = ST.spoon.clone().add(V3(.02, .012, -.05));
  place(MD, home, Qz(Math.PI / 2));
  await Promise.all([grip(R, MD, { p: V3(0, -.03, 0), r: .014, f: V3(0, 0, 1), n: V3(1, 0, 0), pose: "grip" }, .4), grip(L, G.g, wrap(1, V3(0, .04, 0), .035), .4)]);
  const c0 = mouth(G);
  await move(MD, c0.clone().add(V3(0, .26, 0)), { q: Qe(0, 0, 0), dur: .45, arc: .03 });
  const low = G.g.localToWorld(V3(0, G.y0 + .015, 0)).add(V3(0, .22, 0));
  for (let i = 0; i < 4; i++) {
    await move(MD, low, { q: Qe(0, i * .9 + .9, 0), dur: .22, e: ease.in });
    SND.tick();
    await move(MD, low.clone().add(V3(0, .05, 0)), { q: Qe(0, i * .9 + .5, 0), dur: .18, e: ease.out });
  }
  G.col.set(0xbfdc8a);
  await move(MD, home, { q: Qz(Math.PI / 2), dur: .45, arc: .05 });
  letGo(R); letGo(L);
  MD.visible = false;
  await Promise.all([rest(R), rest(L)]);
}
async function stepSqueeze() {
  const G = SHOW.glassV, R = bt.R;
  shot(choose(["macro", "low"]), mouth(G, .06));
  const wedge = mesh(new THREE.CylinderGeometry(.024, .024, .022, 14, 1, false, 0, Math.PI), std({ color: 0xa8c83e, roughness: .5, emissive: 0x1a2a00 }), 0, 0, 0);
  place(wedge, ST.tray.clone().add(V3(-.04, .02, -.02)), Qz(Math.PI / 2));
  await grip(R, wedge, PINCH(), .4);
  await move(wedge, mouth(G, .07), { q: Qz(Math.PI / 2).multiply(Qx(.4)), dur: .5, arc: .05 });
  handPose(R, "fist");
  for (let i = 0; i < 8; i++) {
    const d = mesh(new THREE.SphereGeometry(.0028, 6, 4), std({ color: 0xe0eeb0, emissive: 0x3a4a10 }), 0, 0, 0);
    d.position.copy(wedge.position);
    tween(d.position, { y: surface(G).y, x: d.position.x + rr(-.01, .01) }, .22, ease.in).then(() => world.remove(d));
    await ws(.04);
  }
  letGo(R, "open");
  const dst = G.g.localToWorld(V3(.008, G.y0 + .03, 0));
  await tween(wedge.position, { x: dst.x, y: dst.y, z: dst.z }, SHOW.fast ? .001 : .22, ease.in);
  G.g.attach(wedge);
  SND.plop();
  cardLayer(new THREE.Color(0xd9e8a0), 10);
  await rest(R);
}
async function stepRim() {
  const G = SHOW.glassV, R = bt.R;
  place(P.salt, ST.salt);
  shot(choose(["macro", "side"]), ST.salt.clone().add(V3(0, .1, 0)));
  bt.look = ST.salt;
  await grip(R, G.g, wrap(-1, V3(0, .03, 0), .008, { pose: "pinch", along: .05 }), .4);
  const lip = V3(0, G.mouthY, 0), over = ST.salt.clone().add(V3(0, .008, 0)), qInv = Qx(Math.PI * .82);
  await move(G.g, posFor(G.g, lip, over.clone().add(V3(0, .05, 0)), qInv), { q: qInv, dur: .55, arc: .08 });
  await move(G.g, posFor(G.g, lip, over, qInv), { dur: .18 });
  await waitTicks(.9, k => { G.g.quaternion.copy(Qe(0, k * Math.PI * 2, 0)).multiply(qInv); G.g.position.copy(posFor(G.g, lip, over)); });
  const rim = mesh(new THREE.TorusGeometry(G.mouthR + .0015, .0032, 6, 32), std({ color: 0xf4f1ea, roughness: .95 }), 0, G.mouthY - .004, 0, G.g);
  rim.rotation.x = Math.PI / 2;
  await move(G.g, ST.glass, { q: Qe(0, 0, 0), dur: .6, arc: .06 });
  letGo(R);
  P.salt.visible = false;
  await rest(R);
}
async function stepFloat() {
  const G = SHOW.glassV;
  await jiggerPark();
  shot(choose(["side", "macro"]), mouth(G, -.03));
  const b = await bottleUp("grenadine", "15 мл");
  const col = new THREE.Color(0xb3122a);
  const layer = mesh(new THREE.CylinderGeometry(G.r0 * .98, G.r0 * .96, 1, 24), std({ color: col, transparent: true, opacity: .92, roughness: .2, emissive: col.clone().multiplyScalar(.3) }), 0, G.y0, 0, G.g);
  layer.geometry.translate(0, .5, 0); layer.scale.y = .0001; layer.renderOrder = 4;
  await pourFrom(b, V3(0, b.userData.top, 0), () => mouth(G, -.02).add(V3(-.015, 0, 0)), 15, col, { gap: .04, ang: -2.0, rate: .6, fill: k => { layer.scale.y = Math.max(.0001, (G.y1 - G.y0) * .28 * k); } });
  cardLayer(col, 15);
  await bottleDown(b);
}

/* ---------- гарнир ---------- */
function garnishMesh(kind) {
  const col = GCOL[kind] || 0x9fc23a;
  const g = new THREE.Group();
  const m = std({ color: col, roughness: kind === "cherry" ? .15 : .45, emissive: new THREE.Color(col).multiplyScalar(.15) });
  if (kind === "olive" || kind === "cherry") {
    mesh(new THREE.SphereGeometry(.011, 16, 12), m, 0, 0, 0, g).scale.set(1, kind === "olive" ? .8 : 1, 1);
    if (kind === "olive") { mesh(new THREE.CylinderGeometry(.0011, .0011, .11, 6), std({ color: 0xd8c08a, roughness: .5 }), 0, .035, 0, g); mesh(new THREE.SphereGeometry(.003, 8, 6), std({ color: 0xa8101e }), 0, 0, .009, g); }
    else { const s = mesh(new THREE.CylinderGeometry(.0009, .0009, .035, 4), std({ color: 0x3a5a1a }), 0, .02, 0, g); s.rotation.z = .3; }
  } else if (kind === "mint") {
    mesh(new THREE.CylinderGeometry(.0015, .0015, .06, 4), std({ color: 0x2a5a1a }), 0, .02, 0, g);
    for (let i = 0; i < 7; i++) { const l = leafMesh(); world.remove(l); l.position.set(rr(-.012, .012), .01 + i * .007, rr(-.012, .012)); l.rotation.set(rr(-.6, .6), rr(0, 3), rr(-.6, .6)); g.add(l); }
  } else if (kind === "lemon") {
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 12 }, (_, i) => V3(Math.cos(i * .9) * .012, -i * .006, Math.sin(i * .9) * .012)));
    mesh(new THREE.TubeGeometry(curve, 40, .004, 6), m, 0, .03, 0, g);
  } else {
    const w = mesh(new THREE.CylinderGeometry(.024, .024, .005, 22, 1, false, 0, kind === "wedge" ? Math.PI : Math.PI * 2), m, 0, 0, 0, g);
    w.rotation.x = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(.019, .019, .0055, 22), std({ color: new THREE.Color(col).lerp(new THREE.Color(0xffffff), .45), roughness: .6 }), 0, 0, 0, g).rotation.x = Math.PI / 2;
  }
  world.add(g);
  return g;
}
async function stepGarnish(c) {
  const G = SHOW.glassV, kind = c.garnish || "wheel", R = bt.R, L = bt.L;
  const rw = G.mouthR * G.scale, m = mouth(G);
  shot(choose(["macro", "low", "side"]), m.clone().add(V3(0, .06, 0)));
  bt.look = ST.tray;
  const gm = garnishMesh(kind);
  place(gm, ST.tray.clone().add(V3(.03, .02, 0)));
  const pinch = PINCH(V3(0, kind === "olive" ? .07 : 0, 0));
  await grip(R, gm, pinch, .42);
  if (kind === "olive" || kind === "cherry") {
    // высоко над бокалом: пауза для гостя, затем медленно вниз
    await move(gm, m.clone().add(V3(0, .22, 0)), { dur: .55, arc: .04 });
    bt.look = camera.position;
    follow(m.clone().add(V3(0, .12, 0)));
    await ws(rr(.5, .8));
    bt.look = m;
    if (kind === "cherry" || chance(.35)) {
      letGo(R, "open");
      const dst = G.g.localToWorld(V3(0, G.y0 + Math.max(.012, (G.y1 - G.y0) * .55), 0));
      await tween(gm.position, { x: dst.x, y: dst.y, z: dst.z }, SHOW.fast ? .001 : .3, ease.in);
      SND.plop();
      for (let i = 0; i < 6; i++) { const s = mesh(new THREE.SphereGeometry(.003, 6, 4), std({ color: new THREE.Color(c.pour), transparent: true, opacity: .9 }), 0, 0, 0); s.position.copy(dst).add(V3(0, .02, 0)); tween(s.position, { x: s.position.x + rr(-.03, .03), y: s.position.y + rr(.02, .05), z: s.position.z + rr(-.03, .03) }, .25, ease.out).then(() => world.remove(s)); }
    } else {
      const dst = G.g.localToWorld(V3(0, G.y0 + (G.y1 - G.y0) * .4, 0));
      await move(gm, dst, { q: Qz(.3), dur: 1.1, e: ease.out });
      SND.plop();
      letGo(R, "open");
    }
  } else if (kind === "mint") {
    // хлопок: мята между ладонями отдаёт аромат
    const mid = B(-.05, 1.33, .38);
    await move(gm, mid, { q: Qx(-.3), dur: .5, arc: .04 });
    letGo(R, "flat");
    await Promise.all([handTo(R, mid.clone().add(V3(-.03, 0, 0)), V3(0, 1, .2), V3(1, 0, 0), "flat", .2), handTo(L, mid.clone().add(V3(.13, 0, 0)), V3(0, 1, .2), V3(-1, 0, 0), "flat", .3)]);
    await handTo(L, mid.clone().add(V3(.035, 0, 0)), V3(0, 1, .2), V3(-1, 0, 0), "flat", .1);
    SND.clap();
    await ws(.15);
    rest(L);
    await grip(R, gm, pinch, .25);
    await move(gm, m.clone().add(V3(.01, .01, 0)), { q: Qe(0, 0, 0), dur: .5 });
    letGo(R, "open");
  } else if (kind === "lemon") {
    // скручивает цедру над бокалом: брызги эфирного масла
    await move(gm, m.clone().add(V3(0, .1, 0)), { dur: .5, arc: .04 });
    await move(gm, m.clone().add(V3(0, .1, 0)), { q: Qe(0, Math.PI * 1.5, 0), dur: .45 });
    for (let i = 0; i < 12; i++) {
      const s = glowSprite(0xfff0a0, .035, gm.position.x, gm.position.y, gm.position.z, world, .9);
      tween(s.position, { x: s.position.x + rr(-.05, .05), y: s.position.y - rr(.03, .08), z: s.position.z + rr(-.05, .05) }, .45).then(() => world.remove(s));
    }
    await ws(.3);
    await move(gm, m.clone().add(V3(rw * .85, -.012, 0)), { q: Qz(.4), dur: .4 });
    letGo(R, "open");
  } else {
    // кружок на край бокала: надрез садится на стекло
    await move(gm, m.clone().add(V3(rw, .08, 0)), { q: Qe(0, Math.PI / 2, 0), dur: .5, arc: .04 });
    await move(gm, m.clone().add(V3(rw - .004, -.008, 0)), { dur: .3, e: ease.in });
    letGo(R, "open");
  }
  G.g.attach(gm);
  await ws(.2);
  await rest(R);
}

/* ---------- подача ---------- */
async function stepServe() {
  const G = SHOW.glassV, R = bt.R;
  shot(SEAT.on ? "medium" : choose(["medium", "low"]), G.g.position.clone().add(V3(0, .1, .15)));
  bt.look = G.g.position;
  // двумя пальцами за основание — бокал скользит к гостю
  await grip(R, G.g, { p: V3(0, .004, -.03), r: .006, f: V3(0, -.45, .9).normalize(), n: V3(0, -.9, -.45).normalize(), pose: "hook", along: .065 }, .4);
  follow(ST.serve.clone().add(V3(0, .1, 0)));
  await move(G.g, ST.serve, { dur: .9, e: ease.io });
  letGo(R, "flat");
  // открытая ладонь: «прошу»
  bt.look = camera.position;
  await handTo(R, B(-.16, TOP() + .1, .55), V3(-.3, .1, 1), V3(0, 1, .2), "flat", .4);
  bt.nod = .08;
  await ws(.35);
  bt.nod = 0;
  await ws(.45);
}

/* ---------- маленькие жесты между шагами ---------- */
const FLOURISH = [
  async () => { bt.look = camera.position; bt.nod = .07; await ws(.3); bt.nod = 0; await ws(.25); bt.look = null; },
  async () => { await Promise.all([handTo(bt.L, B(.04, 1.5, .12), V3(-.4, .8, .3), V3(-.4, 0, 1), "pinch", .35), handTo(bt.R, B(-.04, 1.5, .12), V3(.4, .8, .3), V3(.4, 0, 1), "pinch", .35)]); await ws(.3); await Promise.all([rest(bt.L), rest(bt.R)]); },
  async () => { for (let i = 0; i < 3; i++) { await handTo(bt.R, B(-.19, TOP() + .05, .3), V3(.3, -.3, 1), V3(0, -1, 0), "relax", .1); await handTo(bt.R, B(-.19, TOP() + .028, .3), V3(.3, -.3, 1), V3(0, -1, 0), "relax", .08); SND.tick(); } await rest(bt.R); },
  async () => { bt.tilt = rr(-.12, .12); bt.look = camera.position; await ws(.55); bt.tilt = 0; bt.look = null; }
];
async function flourish() { if (!SHOW.fast && chance(.3)) await choose(FLOURISH)(); }

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
  const V = vessel(prof, MX.glass, [r0, r1, y0, y1, Closeup.CAP_ML[c.cup] || 150], { scale: 1.35 });
  V.g.visible = true;
  return V;
}
function resetVessel(V) {
  V.ml = 0; V.col.set(0xffffff); setLevel(V);
  V.ice.forEach(i => i.parent && i.parent.remove(i)); V.ice = [];
}
async function setupStation(c) {
  station();
  BT.busy = true;
  BT.mode = "free";
  if (bt.held.some(h => h.obj === btGlass)) await stash();
  btGlass.visible = btRag.visible = false;
  STATIC_TOOLS.forEach(o => { o.visible = false; });
  resetVessel(P.tin); resetVessel(P.mixer);
  P.tin.g.children[0].material = M.chrome;
  world.attach(P.cap.g); world.attach(P.strainer.g);
  for (const o of PROPS()) { o.visible = false; o.quaternion.identity(); }
  place(P.bucket.g, ST.bucket); place(P.tray.g, ST.tray); place(P.scoop.g, ST.scoop, Qe(0, 0, 0));
  place(P.jig.g, ST.jig); place(P.spoon.g, ST.spoon, Qx(Math.PI / 2));
  place(P.strainer.g, ST.strainer);
  P.jig.liq.visible = false;
  const prog = PROG()[c.id] || [];
  const shaken = prog.some(s => s[0] === "shake"), stirred = prog.some(s => s[0] === "stir");
  SHOW.main = shaken ? P.tin : stirred ? P.mixer : null;
  if (shaken) { place(P.tin.g, ST.tin); place(P.cap.g, ST.cap); }
  if (stirred) place(P.mixer.g, ST.tin);
  if (SHOW.glassV) world.remove(SHOW.glassV.g);
  SHOW.glassV = buildGlass(c);
  place(SHOW.glassV.g, ST.glass);
  if (!SHOW.main) SHOW.main = SHOW.glassV;
  for (const o of [P.bucket.g, P.tray.g, P.jig.g, P.spoon.g, P.strainer.g, P.tin.g, P.cap.g, P.mixer.g, P.scoop.g, SHOW.glassV.g]) {
    if (!o.visible) continue;
    const y = o.position.y; o.position.y += .03;
    tween(o.position, { y }, SHOW.fast ? .001 : .35, ease.out);
  }
  shot("medium", B(0, 1.3, .35), 1);
  await walkTo(ST.bx, ST.bz, 0);
  await turnTo(0);
  bt.leanT = .1;
  await Promise.all([rest(bt.L), rest(bt.R)]);
}
function cleanup(c, aborted) {
  for (const t of TMP) TMP.delete(t);
  HANDS.clear();
  for (const a of [bt.L, bt.R]) { a.manual = false; a.snap = false; a.k = 9; }
  streamOff(); tagOff();
  jigOn = false;
  BT.nod = 0; bt.nod = 0; bt.tilt = 0;
  world.attach(P.cap.g); world.attach(P.strainer.g);
  PROPS().forEach(o => { o.visible = false; o.quaternion.identity(); });
  STATIC_TOOLS.forEach(o => { o.visible = true; });
  btGlass.visible = btRag.visible = true;
  for (const o of [...world.children]) if (o.userData && o.userData.ing) world.remove(o);
  if (aborted || !SHOW.glassV) {
    if (SHOW.glassV) world.remove(SHOW.glassV.g);
    SHOW.glassV = null;
    placeServed(c);
  } else {
    if (servedGlass && servedGlass !== SHOW.glassV.g) world.remove(servedGlass);
    const V = SHOW.glassV;
    if (V.ml < V.cap * .5) { V.ml = V.cap * .82; V.col.set(c.pour); setLevel(V); }
    V.g.position.copy(ST.serve); V.g.quaternion.identity();
    servedGlass = V.g;
    SHOW.glassV = null;
  }
  SHOW.served = true;
  bt.leanT = .07; bt.spine.position.y = 0;
  reach(bt.L, .23, .92, .06, DIR.down, V3(-1, 0, .3), .25);
  reach(bt.R, -.23, .92, .06, DIR.down, V3(1, 0, .3), .25);
}
async function playShow(c) {
  SHOW.on = true; SHOW.ran = true; SHOW.fast = false; SHOW.served = false; SHOW.c = c;
  SG = ++SHOW.gen;
  const prog = (PROG()[c.id] || [["garnish"]]).concat([["serve"]]);
  showUI.title.textContent = c.name;
  buildCard(c, prog);
  showUI.root.hidden = false;
  app.classList.add("showing");
  caption("", choose(["Бармен берётся за дело", "Сейчас будет красиво", "Минуту — и готово"]));
  let aborted = false;
  try {
    await setupStation(c);
    const total = prog.length - 1;
    for (let i = 0; i < prog.length; i++) {
      const st = prog[i];
      caption(st[0] === "serve" ? "" : `Шаг ${i + 1} из ${total}`, stepCaption(st, c));
      cardStep(i);
      await STEP[st[0]](st, c);
      const next = (prog[i + 1] || [])[0];
      if (jigOn && next !== "jig") await jiggerPark();
      if (i < prog.length - 2) await flourish();
    }
    cardDone();
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
Object.assign(H3D, { show: SHOW, bt, handPose, HANDS });
