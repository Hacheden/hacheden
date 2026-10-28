/* ================= люди: фигуры с суставами, руки и ноги сами тянутся к точкам (IK) ================= */
const FIGS = [];
const _m1 = new THREE.Matrix4(), _m2 = new THREE.Matrix4(), _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
const _a = V3(), _b = V3(), _xa = V3(), _ya = V3(), _za = V3(), _w0 = V3();
const smoothK = (k, dt) => 1 - Math.exp(-k * dt);

function taper(r0, r1, len, seg = 14) { const g = new THREE.CylinderGeometry(r0, r1, len, seg, 1); g.translate(0, -len / 2, 0); return g; }
const sph = (r, x, y, z, sx = 1, sy = 1, sz = 1, ws = 16, hs = 12) => { const g = new THREE.SphereGeometry(r, ws, hs); g.scale(sx, sy, sz); g.translate(x, y, z); return g; };
const rbox = (w, h, d, x, y, z, r = .01) => { const g = new RoundedBoxGeometry(w, h, d, 2, r); g.translate(x, y, z); return g; };

/* ---------- одежда: рисуем на развёртке торса ---------- */
const CLOTH = {};
function torsoTex(o) {
  const key = JSON.stringify(o);
  if (CLOTH[key]) return CLOTH[key];
  const t = canvasTex(512, 512, (g, w, h) => {
    const Y = v => h - v * h, U = u => u * w;
    const poly = (pts, c) => { g.fillStyle = c; g.beginPath(); pts.forEach(([u, v], i) => i ? g.lineTo(U(u), Y(v)) : g.moveTo(U(u), Y(v))); g.closePath(); g.fill(); };
    const dot = (u, v, r, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(U(u), Y(v), r * .55, r, 0, 0, 7); g.fill(); };
    g.fillStyle = o.shirt || "#e6dfd0"; g.fillRect(0, 0, w, h);
    if (o.kind === "vest") {
      g.fillStyle = o.body; g.fillRect(0, Y(.88), w, h);
      // спинка жилета атласная
      g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(0, Y(.86), U(.18), h); g.fillRect(U(.82), Y(.86), U(.18), h);
      g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(U(.02), Y(.3)); g.lineTo(U(.98), Y(.3)); g.stroke();
      // проймы
      for (const u of [.25, .75]) { g.fillStyle = o.shirt; g.beginPath(); g.ellipse(U(u), Y(.86), U(.05), h * .12, 0, 0, 7); g.fill(); }
      // вырез: белая рубашка
      poly([[.5 - .08, .92], [.5 + .08, .92], [.5, .42]], o.shirt);
      g.strokeStyle = "rgba(0,0,0,.45)"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(U(.42), Y(.92)); g.lineTo(U(.5), Y(.42)); g.lineTo(U(.58), Y(.92)); g.stroke();
      for (let i = 0; i < 5; i++) dot(.5, .38 - i * .072, 6, "#c9944a");
      g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(U(.36), Y(.24), 34, 4); g.fillRect(U(.6), Y(.24), 34, 4); g.fillRect(U(.6), Y(.56), 30, 4);
      // цепочка карманных часов
      g.strokeStyle = "#d8aa5a"; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(U(.5), Y(.24)); g.quadraticCurveTo(U(.56), Y(.15), U(.62), Y(.235)); g.stroke();
      for (let i = 0; i < 1200; i++) { g.fillStyle = `rgba(${rng() < .5 ? "255,255,255" : "0,0,0"},.05)`; g.fillRect(rng() * w, Y(.88) + rng() * h * .88, 1, 3); }
    } else if (o.kind === "suit") {
      g.fillStyle = o.body; g.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 10) { g.fillStyle = "rgba(255,255,255,.035)"; g.fillRect(x, 0, 1, h); }
      poly([[.5 - .14, .95], [.5 + .14, .95], [.5 + .02, .3], [.5 - .02, .3]], o.lapel || "rgba(0,0,0,.4)");
      poly([[.5 - .085, .95], [.5 + .085, .95], [.5, .36]], o.shirt);
      poly([[.5 - .014, .9], [.5 + .014, .9], [.5 + .02, .44], [.5, .38], [.5 - .02, .44]], o.tie || "#6a0f1e");
      g.fillStyle = "#f0ece0"; g.beginPath(); g.moveTo(U(.6), Y(.62)); g.lineTo(U(.64), Y(.62)); g.lineTo(U(.62), Y(.68)); g.fill();
      dot(.5, .26, 6, "#111"); dot(.5, .16, 6, "#111");
    } else if (o.kind === "dress") {
      g.fillStyle = o.body; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i++) { g.fillStyle = rng() < .5 ? "rgba(255,220,150,.35)" : "rgba(0,0,0,.25)"; g.fillRect(rng() * w, rng() * h, 2, 2); }
      poly([[.5 - .07, .95], [.5 + .07, .95], [.5, .72]], o.skin);
      g.fillStyle = o.skin; g.fillRect(0, Y(1), w, h * .07);
      for (let i = 0; i <= 26; i++) { const k = i / 26, u = .43 + k * .14, v = .9 - Math.sin(k * Math.PI) * .38; dot(u, v, 5, "#f4eee2"); }
      g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, Y(.12), w, 10);
    } else {
      // вязаный кардиган
      g.fillStyle = o.body; g.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 6) { g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(x, 0, 2, h); }
      poly([[.5 - .07, .95], [.5 + .07, .95], [.5, .5]], o.shirt);
      for (let i = 0; i < 5; i++) dot(.5, .45 - i * .08, 5, "#3a2a1a");
    }
  });
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return (CLOTH[key] = t);
}

/* профиль торса: от пояса (0) до основания шеи */
const TORSO_PROFILE = [[0, -.03], [.14, -.03], [.142, .02], [.146, .07], [.152, .12], [.16, .17], [.168, .22], [.174, .27], [.178, .32], [.179, .37], [.176, .41], [.166, .445], [.14, .47], [.095, .49], [.058, .505], [0, .51]];

function makeFigure(o) {
  const P = Object.assign({
    kind: "suit", body: "#2a2420", shirt: "#e6dfd0", trousers: 0x1c1a18, skin: 0xc48c6a, hair: 0x1a110b, hairStyle: "short",
    shoes: 0x0c0908, mustache: false, bowtie: null, rolled: false, hat: null, lady: false, scale: 1, seated: false
  }, o);
  const mSkin = std({ color: P.skin, roughness: .6 });
  const mHair = std({ color: P.hair, roughness: P.hairStyle === "slick" ? .35 : .8 });
  const mTr = std({ color: P.trousers, roughness: .8 });
  const mShoe = std({ color: P.shoes, roughness: .3, envMapIntensity: .8 });
  const mTorso = std({ map: torsoTex({ kind: P.kind, body: P.body, shirt: P.shirt, skin: "#" + new THREE.Color(P.skin).getHexString(), tie: P.tie }), roughness: .75 });
  const sleeveCol = P.kind === "vest" ? P.shirt : P.body;
  const mSleeve = std({ color: sleeveCol, roughness: .8 });
  const mWhite = std({ color: P.shirt, roughness: .8 });

  const root = new THREE.Group();
  root.scale.setScalar(P.scale);
  const pelvis = group(0, P.hipY || (P.seated ? .5 : .96), 0, root);
  const spine = group(0, .02, 0, pelvis);

  // торс с одеждой
  const torso = new THREE.Mesh(new THREE.LatheGeometry(TORSO_PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 28, Math.PI, Math.PI * 2), mTorso);
  torso.scale.set(1.12, 1, .7);
  spine.add(torso);
  // бёдра в брюках или юбке
  const hipG = lathe([[0, .0], [.152, .0], [.158, -.06], [.15, -.13], [0, -.14]], 22);
  hipG.scale(1.08, 1, .78);
  mesh(hipG, P.lady ? std({ color: new THREE.Color(P.body), roughness: .6 }) : mTr, 0, 0, 0, pelvis);
  // шея, голова
  const neckParts = [taper(.045, .05, .08)]; neckParts[0].translate(0, .565, 0);
  if (P.bowtie || P.kind !== "dress") { const col = new THREE.TorusGeometry(.055, .014, 6, 18); col.rotateX(Math.PI / 2); col.scale(1, 1, .9); col.translate(0, .5, .005); mesh(col, mWhite, 0, 0, 0, spine); }
  merged(neckParts, mSkin, spine);
  if (P.bowtie) {
    const bm = std({ color: P.bowtie, roughness: .45 });
    const parts = [];
    for (const s of [-1, 1]) { const c = new THREE.ConeGeometry(.024, .045, 4); c.rotateZ(s * Math.PI / 2); c.rotateY(Math.PI / 4); c.scale(1, 1, .5); c.translate(s * .022, .487, .116); parts.push(c); }
    parts.push(sph(.01, 0, .487, .122));
    merged(parts, bm, spine);
  }
  const head = group(0, .535, 0, spine);
  const skin = [sph(.1, 0, .11, 0, .88, 1.07, .98, 24, 18), sph(.078, 0, .055, .022, .86, .72, .9), sph(.016, 0, .1, .095, .62, .9, 1.15, 10, 8)];
  for (const s of [-1, 1]) skin.push(sph(.022, s * .086, .1, -.005, .45, 1, .75, 10, 8));
  merged(skin, mSkin, head);
  // глаза: белки, зрачки; моргают
  const eyes = group(0, .118, .078, head);
  const ew = [], ei = [];
  for (const s of [-1, 1]) { ew.push(sph(.0105, s * .033, 0, -.002, 1, .7, .5, 10, 8)); ei.push(sph(.0068, s * .033, 0, .004, 1, 1, .5, 8, 6)); }
  merged(ew, std({ color: 0xece4d8, roughness: .3 }), eyes);
  merged(ei, std({ color: 0x1a120c, roughness: .2 }), eyes);
  // брови, волосы, усы
  const hair = [];
  for (const s of [-1, 1]) { const b = rbox(.03, .007, .01, s * .034, .143, .088, .003); b.rotateZ ? 0 : 0; hair.push(b); }
  if (P.hairStyle === "bob") {
    hair.push(sph(.116, 0, .125, -.008, .95, 1, 1.02, 24, 14));
    const band = new THREE.CylinderGeometry(.112, .118, .1, 24, 1, true, Math.PI * .3, Math.PI * 1.4); band.translate(0, .085, -.006); hair.push(band);
    hair.push(rbox(.15, .03, .03, 0, .175, .085, .012));
  } else {
    const cap = new THREE.SphereGeometry(.1, 28, 14, 0, Math.PI * 2, 0, Math.PI * .56); cap.rotateX(-.72); cap.scale(.93, 1.11, 1.05); cap.translate(0, .112, -.008); hair.push(cap);
    for (const s of [-1, 1]) hair.push(rbox(.012, .04, .02, s * .084, .098, .03, .004));
  }
  if (P.mustache) {
    const curve = new THREE.CatmullRomCurve3([V3(-.056, .082, .07), V3(-.042, .066, .088), V3(-.018, .066, .1), V3(0, .07, .102), V3(.018, .066, .1), V3(.042, .066, .088), V3(.056, .082, .07)]);
    hair.push(new THREE.TubeGeometry(curve, 20, .0055, 6));
  }
  merged(hair, mHair, head);
  if (P.lady) mesh(new THREE.BoxGeometry(.026, .006, .006), std({ color: 0x9a1a2a }), 0, .045, .093, head);
  else mesh(new THREE.BoxGeometry(.026, .004, .006), std({ color: 0x5a2a20 }), 0, .045, .093, head);
  if (P.hat) {
    const hm = std({ color: P.hat, roughness: .7 });
    merged([(() => { const g = new THREE.CylinderGeometry(.17, .17, .012, 28); g.translate(0, .2, 0); return g; })(), (() => { const g = new THREE.CylinderGeometry(.092, .106, .1, 24); g.translate(0, .25, 0); return g; })()], hm, head);
    mesh(new THREE.CylinderGeometry(.107, .107, .022, 24), std({ color: 0x3a0e16 }), 0, .215, 0, head);
  }

  // руки
  const LA = .285, LB = .26;
  const arm = side => {
    const S = V3(side * .2, .425, -.005);
    const up = group(S.x, S.y, S.z, spine);
    merged([sph(.05, 0, -.01, 0), taper(.05, .043, LA)], mSleeve, up);
    const fo = group(0, -LA, 0, up);
    const fp = [sph(.045, 0, 0, 0), taper(.044, .034, LB)];
    if (P.rolled) {
      merged(fp, mSkin, fo);
      const cuff = new THREE.TorusGeometry(.05, .02, 8, 16); cuff.rotateX(Math.PI / 2); cuff.translate(0, .01, 0);
      merged([cuff], mWhite, fo);
    } else {
      merged(fp, mSleeve, fo);
      const cuff = taper(.037, .036, .03); cuff.translate(0, -LB + .02, 0);
      merged([cuff], mWhite, fo);
    }
    const hand = group(0, -LB, 0, fo);
    const palm = [rbox(.062, .072, .026, 0, -.038, 0, .012)];
    const th = new THREE.CapsuleGeometry(.0115, .035, 3, 8); th.rotateZ(side * .7); th.translate(side * .038, -.035, .012); palm.push(th);
    merged(palm, mSkin, hand);
    const fing = group(0, -.072, 0, hand);
    merged([rbox(.058, .062, .02, 0, -.028, 0, .0095)], mSkin, fing);
    return { S, up, fo, hand, fing, side, tgt: V3(), cur: V3(), ori: { f: V3(0, -1, 0), p: V3(0, 0, 1) }, curl: .2, curlT: .2, pole: V3(side * .45, -1, -.35), k: 9, set: false };
  };
  const L = arm(1), Rr = arm(-1);
  // ноги
  const TA = .44, TB = .43;
  const leg = side => {
    const H = V3(side * .092, -.07, 0);
    const th = group(H.x, H.y, H.z, pelvis);
    merged([sph(.07, 0, 0, 0), taper(.074, .056, TA)], P.lady ? std({ color: new THREE.Color(P.body), roughness: .6 }) : mTr, th);
    const sh = group(0, -TA, 0, th);
    merged([sph(.054, 0, 0, 0), taper(.052, .04, TB)], P.lady ? std({ color: 0xa87a64, roughness: .5 }) : mTr, sh);
    const ank = group(0, -TB, 0, sh);
    merged([rbox(P.lady ? .065 : .085, .06, P.lady ? .2 : .25, 0, -.04, .055, .025)], mShoe, ank);
    return { H, th, sh, ank, side, tgt: V3(), cur: V3(), world: V3(), from: V3(), to: V3(), stepT: 1, pole: V3(0, 0, 1) };
  };
  const legs = [leg(1), leg(-1)];
  const F = {
    P, root, pelvis, spine, head, eyes, L, R: Rr, legs, LA, LB, TA, TB,
    x: 0, z: 0, face: 0, tx: 0, tz: 0, tface: 0, speed: 0, faceWalk: true,
    lean: .04, twist: 0, sway: 0, leanT: .04, twistT: 0, look: null, lookK: 0, hy: 0, hp: 0,
    blink: R(1, 4), seated: P.seated, hipY: P.hipY || (P.seated ? .5 : .96), bob: 0, breath: R(0, 6), held: [], legsFixed: P.seated
  };
  world.add(root);
  FIGS.push(F);
  return F;
}

/* место и направление фигуры */
function placeFig(F, x, z, face) { F.x = F.tx = x; F.z = F.tz = z; F.face = F.tface = face; F.root.position.set(x, 0, z); F.root.rotation.y = face; for (const lg of F.legs) lg.stepT = 1; F._init = false; }
/* перевод точки из мира в систему фигуры и обратно */
function toFig(F, p, out = V3()) { const c = Math.cos(-F.face), s = Math.sin(-F.face), dx = p.x - F.x, dz = p.z - F.z; return out.set(dx * c + dz * s, p.y, -dx * s + dz * c); }
function fromFig(F, p, out = V3()) { const c = Math.cos(F.face), s = Math.sin(F.face); return out.set(F.x + p.x * c + p.z * s, p.y, F.z - p.x * s + p.z * c); }
/* задать цель руке: точка в системе фигуры; f — куда смотрят пальцы, p — куда ладонь */
function reach(arm, x, y, z, f, p, curl) {
  arm.tgt.set(x, y, z);
  if (f) arm.ori.f.copy(f).normalize();
  if (p) arm.ori.p.copy(p).normalize();
  if (curl !== undefined) arm.curlT = curl;
  if (!arm.set) { arm.cur.copy(arm.tgt); arm.set = true; }
}

/* двухзвенная IK: плечо S, цель T, длины a и b, подсказка изгиба pole (всё в одной системе) */
function solve2(S, T, a, b, pole, outE, outT) {
  _a.subVectors(T, S);
  let Ld = _a.length();
  const L = clamp(Ld, Math.abs(a - b) + 1e-3, a + b - 1e-3);
  const dir = _a.normalize();
  const cosA = clamp((a * a + L * L - b * b) / (2 * a * L), -1, 1), A = Math.acos(cosA);
  _b.copy(pole).addScaledVector(dir, -pole.dot(dir));
  if (_b.lengthSq() < 1e-6) _b.set(0, 0, 1).addScaledVector(dir, -dir.z);
  _b.normalize();
  outE.copy(S).addScaledVector(dir, Math.cos(A) * a).addScaledVector(_b, Math.sin(A) * a);
  outT.copy(S).addScaledVector(dir, L);
}
/* повернуть кость (растёт вдоль -Y) так, чтобы она шла от A к B, а сустав сгибался в сторону C */
function aimBone(bone, A, B, C, bendSign, parentQ) {
  _ya.subVectors(A, B).normalize();
  _za.subVectors(C, B).normalize();
  _za.addScaledVector(_ya, -_za.dot(_ya));
  if (_za.lengthSq() < 1e-6) _za.set(0, 0, 1).addScaledVector(_ya, -_ya.z);
  _za.normalize().multiplyScalar(bendSign);
  _xa.crossVectors(_ya, _za);
  _m1.makeBasis(_xa, _ya, _za);
  _q1.setFromRotationMatrix(_m1);
  if (parentQ) _q1.premultiply(_q2.copy(parentQ).invert());
  bone.quaternion.copy(_q1);
}
const _S = V3(), _T = V3(), _E = V3(), _TT = V3(), _pq = new THREE.Quaternion(), _hq = new THREE.Quaternion();
const _inv = new THREE.Matrix4(), _pole = V3();
function solveArm(F, arm, dt) {
  arm.cur.lerp(arm.tgt, smoothK(arm.k, dt));
  arm.curl += (arm.curlT - arm.curl) * smoothK(10, dt);
  // цель в системе позвоночника
  F.pelvis.updateMatrix(); F.spine.updateMatrix();
  _m2.multiplyMatrices(F.pelvis.matrix, F.spine.matrix);
  _inv.copy(_m2).invert();
  _T.copy(arm.cur).applyMatrix4(_inv);
  _S.copy(arm.S);
  _pole.copy(arm.pole);
  solve2(_S, _T, F.LA, F.LB, _pole, _E, _TT);
  // плечо: кость от S к E, локоть сгибается вперёд к цели
  aimBone(arm.up, _S, _E, _TT, 1, null);
  // предплечье: шарнир
  _a.subVectors(_E, _S).normalize(); _b.subVectors(_TT, _E).normalize();
  const ang = Math.acos(clamp(_a.dot(_b), -1, 1));
  arm.fo.quaternion.setFromAxisAngle(_xa.set(1, 0, 0), -ang);
  // кисть: пальцы и ладонь в системе фигуры
  _pq.copy(F.pelvis.quaternion).multiply(F.spine.quaternion).multiply(arm.up.quaternion).multiply(arm.fo.quaternion);
  _ya.copy(arm.ori.f).negate();
  _za.copy(arm.ori.p).addScaledVector(_ya, -arm.ori.p.dot(_ya));
  if (_za.lengthSq() < 1e-6) _za.set(0, 0, 1);
  _za.normalize();
  _xa.crossVectors(_ya, _za);
  _m1.makeBasis(_xa, _ya, _za);
  _hq.setFromRotationMatrix(_m1);
  arm.hand.quaternion.copy(_pq.invert().multiply(_hq));
  arm.fing.rotation.x = -arm.curl * 1.5;
}
function solveLeg(F, lg) {
  F.pelvis.updateMatrix();
  _inv.copy(F.pelvis.matrix).invert();
  _T.copy(lg.cur).applyMatrix4(_inv);
  solve2(lg.H, _T, F.TA, F.TB, _pole.set(lg.side * .15, 0, 1), _E, _TT);
  aimBone(lg.th, lg.H, _E, _TT, -1, null);
  _a.subVectors(_E, lg.H).normalize(); _b.subVectors(_TT, _E).normalize();
  const ang = Math.acos(clamp(_a.dot(_b), -1, 1));
  lg.sh.quaternion.setFromAxisAngle(_xa.set(1, 0, 0), ang);
  // стопа стоит ровно на полу
  _pq.copy(F.pelvis.quaternion).multiply(lg.th.quaternion).multiply(lg.sh.quaternion);
  lg.ank.quaternion.copy(_pq.invert());
}

/* шаги: стопа остаётся на месте, пока тело не уйдёт далеко, потом переставляется дугой */
function stepFeet(F, dt, vx, vz) {
  const homes = F.legs.map(lg => fromFig(F, V3(lg.side * .1, .075, .02)));
  if (!F._init) { F.legs.forEach((lg, i) => { lg.world.copy(homes[i]); lg.stepT = 1; }); F._init = true; }
  const moving = Math.hypot(vx, vz) > .05;
  F.legs.forEach((lg, i) => {
    const other = F.legs[1 - i];
    const lead = V3(vx * .32, 0, vz * .32);
    const want = homes[i].clone().add(lead);
    if (lg.stepT >= 1 && other.stepT >= 1) {
      const d = Math.hypot(lg.world.x - want.x, lg.world.z - want.z);
      const od = Math.hypot(other.world.x - homes[1 - i].x, other.world.z - homes[1 - i].z);
      if (d > (moving ? .16 : .07) && d >= od - .01) { lg.from.copy(lg.world); lg.to.copy(want); lg.stepT = 0; }
    }
    if (lg.stepT < 1) {
      lg.stepT = Math.min(1, lg.stepT + dt / (moving ? .3 : .26));
      const k = ease.sine(lg.stepT);
      lg.world.lerpVectors(lg.from, lg.to, k);
      lg.world.y = .075 + Math.sin(Math.PI * lg.stepT) * .07;
    }
    toFig(F, lg.world, lg.cur);
  });
}

function updateFigure(F, t, dt) {
  // перемещение к цели с разгоном и торможением
  const dx = F.tx - F.x, dz = F.tz - F.z, dist = Math.hypot(dx, dz);
  const want = dist > .02 ? Math.min(F.maxSpeed || .85, dist * 2.4) : 0;
  F.speed += (want - F.speed) * smoothK(5, dt);
  let vx = 0, vz = 0;
  if (dist > .005) { vx = dx / dist * F.speed; vz = dz / dist * F.speed; F.x += vx * dt; F.z += vz * dt; }
  // поворот: при ходьбе лицом по ходу, иначе к заданному направлению
  let faceT = F.tface;
  if (F.faceWalk && F.speed > .25 && dist > .15) faceT = Math.atan2(vx, vz);
  let df = Math.atan2(Math.sin(faceT - F.face), Math.cos(faceT - F.face));
  F.face += df * smoothK(6, dt);
  F.root.position.set(F.x, 0, F.z);
  F.root.rotation.y = F.face;
  // тело: дыхание, наклон, поворот плеч в сторону взгляда
  F.breath += dt;
  F.lean += (F.leanT - F.lean) * smoothK(4, dt);
  F.twist += (F.twistT - F.twist) * smoothK(4, dt);
  const stepping = F.legs.some(l => l.stepT < 1);
  F.bob += ((stepping ? -.018 : 0) - F.bob) * smoothK(10, dt);
  F.pelvis.position.y = F.hipY + F.bob + (F.seated ? 0 : .003 * Math.sin(F.breath * 1.6));
  F.pelvis.rotation.y = F.seated ? 0 : -df * .15;
  F.spine.rotation.set(F.lean + .012 * Math.sin(F.breath * 1.6), F.twist + df * .2, F.sway);
  F.spine.scale.set(1 + .008 * Math.sin(F.breath * 1.6), 1, 1 + .012 * Math.sin(F.breath * 1.6));
  // голова: смотрит на цель (точка в мире) или прямо
  let hy = 0, hp = .05;
  if (F.look) {
    toFig(F, F.look, _w0);
    const hx = _w0.x, hyy = _w0.y - (F.pelvis.position.y + .67) * F.P.scale, hz = _w0.z;
    hy = clamp(Math.atan2(hx, hz) - F.twist, -1.1, 1.1);
    hp = clamp(-Math.atan2(hyy, Math.hypot(hx, hz)), -.6, .7);
  }
  if (F.nod) hp += F.nod;
  F.hy += (hy - F.hy) * smoothK(5, dt);
  F.hp += (hp - F.hp) * smoothK(5, dt);
  F.head.rotation.set(F.hp - F.lean * .6, F.hy * .8, F.tilt || 0);
  F.spine.rotation.y += F.hy * .15;
  // моргание
  F.blink -= dt;
  F.eyes.scale.y = F.blink < .12 ? .12 : 1;
  if (F.blink < 0) F.blink = R(2, 5.5);
  // ноги
  if (!F.legsFixed) stepFeet(F, dt, vx, vz);
  else F.legs.forEach(lg => lg.cur.lerp(lg.tgt, smoothK(6, dt)));
  F.legs.forEach(lg => solveLeg(F, lg));
  // руки
  solveArm(F, F.L, dt);
  solveArm(F, F.R, dt);
  F.root.updateMatrixWorld(true);
  // предметы в руках
  for (const h of F.held) {
    const k = h.k === undefined ? 1 : h.k;
    h.arm.hand.localToWorld(_w0.copy(h.off));
    if (h.woff) _w0.add(h.woff);
    if (k >= 1) h.obj.position.copy(_w0);
    else h.obj.position.lerpVectors(h.from, _w0, k);
    if (h.tilt !== undefined) {
      h.obj.rotation.set(0, F.face + (h.yaw || 0), 0);
      h.obj.rotateX(h.tilt);
      if (h.tiltZ) h.obj.rotateZ(h.tiltZ);
      if (h.roll) h.obj.rotateY(h.roll);
    }
  }
}
function updateFigures(t, dt) { for (const F of FIGS) if (!F.off) updateFigure(F, t, dt); }
/* взять предмет: он плавно переходит из своего места в руку */
function grab(F, arm, obj, off, dur = .3) {
  const h = { arm, obj, off: off.clone(), from: obj.position.clone(), k: 0, tilt: 0 };
  F.held.push(h);
  tween(h, { k: 1 }, dur, ease.out);
  return h;
}
function release(F, obj) { F.held = F.held.filter(h => h.obj !== obj); }
/* пальцы смотрят вперёд, ладонь внутрь — обычный хват стакана */
const DIR = { fwd: V3(0, 0, 1), down: V3(0, -1, 0), up: V3(0, 1, 0), in: s => V3(-s, 0, 0), out: s => V3(s, 0, 0), back: V3(0, 0, -1) };
