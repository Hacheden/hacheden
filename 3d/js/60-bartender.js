/* ================= бармен: протирает бокал, ходит, достаёт бутылки с полки ================= */
const bt = makePerson({ vest: 0x2a0d13, shirt: 0xe6dfd0, trousers: 0x121012, skin: 0xb07a5a, hair: 0x140d09, mustache: true, bowtie: 0x7a0f22, apron: true, rolled: true });
const BT_Z = -3.4;
bt.root.position.set(.9, 0, BT_Z);
world.add(bt.root);
const REST = { lShx: -.62, lShy: 0, lShz: -.28, lEl: -1.45, rShx: -.78, rShy: 0, rShz: .32, rEl: -1.3, headX: .32, lean: .06, polish: 1 };
const POSE = Object.assign({ x: .9, z: BT_Z, ry: 0, look: 0, headY: 0, walk: 0 }, REST);
const BT = { busy: false, held: null, holdK: 0, holdFrom: V3(), gk: 1, rk: 1, nod: 0, get x() { return POSE.x; } };
// бокал и полотенце в руках
const btGlass = mesh(lathe([[0, 0], [.038, 0], [.039, .006], [.042, .09], [.043, .092]], 24), glassMat, 0, 0, 0);
btGlass.renderOrder = 5;
const ragGeo = new THREE.PlaneGeometry(.16, .22, 6, 6);
{ const p = ragGeo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 30) * .012 + Math.sin(p.getY(i) * 20) * .01); ragGeo.computeVertexNormals(); }
const btRag = mesh(ragGeo, std({ color: 0xd8d2c4, roughness: 1, side: THREE.DoubleSide }), 0, 0, 0);
const GLASS_SPOT = V3(), RAG_SPOT = V3();
const _v = V3(), _w = V3();

function poseBartender(t) {
  const P = POSE, pol = P.polish;
  bt.root.position.x = P.x; bt.root.position.z = P.z;
  bt.root.rotation.y = P.ry;
  const c = Math.sin(t * 5.4), s = Math.cos(t * 5.4);
  bt.R.sh.rotation.set(P.rShx + pol * .08 * c, P.rShy + pol * .16 * s, P.rShz + pol * .06 * s);
  bt.R.el.rotation.x = P.rEl + pol * .12 * c;
  bt.L.sh.rotation.set(P.lShx, P.lShy + pol * .05 * Math.sin(t * 1.3), P.lShz);
  bt.L.el.rotation.x = P.lEl;
  bt.L.hand.rotation.x = -(bt.L.sh.rotation.x + bt.L.el.rotation.x) * .9;
  const br = Math.sin(t * 1.7);
  bt.spine.rotation.x = P.lean + .012 * br;
  bt.spine.position.y = .004 * br;
  // шаг
  const w = Math.sin(t * 8.5) * P.walk;
  bt.hips.position.y = 1.0 + .018 * Math.abs(Math.sin(t * 8.5)) * P.walk;
  bt.legs[0].th.rotation.x = .4 * w; bt.legs[1].th.rotation.x = -.4 * w;
  bt.legs[0].kn.rotation.x = Math.max(0, -w) * .6; bt.legs[1].kn.rotation.x = Math.max(0, w) * .6;
  // голова: смотрит на гостя или на бокал
  const ang = Math.atan2(camera.position.x - P.x, camera.position.z - P.z) - P.ry;
  const a = Math.atan2(Math.sin(ang), Math.cos(ang));
  const beat = Music.beat();
  const nod = beat === null ? 0 : Math.pow(Math.max(0, Math.cos(beat * Math.PI * 2)), 6) * .06 * BT.nod;
  bt.head.rotation.y = lerp(P.headY, clamp(a, -.8, .8), P.look);
  bt.head.rotation.x = lerp(P.headX, .04, P.look) + nod;
  // предметы следуют за руками
  bt.root.updateMatrixWorld(true);
  bt.L.hand.getWorldPosition(_v);
  btGlass.position.lerpVectors(GLASS_SPOT, _v.add(_w.set(0, -.03, 0)), BT.gk);
  bt.R.hand.getWorldPosition(_v);
  btRag.position.lerpVectors(RAG_SPOT, _v.add(_w.set(0, -.08, 0)), BT.rk);
  btRag.rotation.set(BT.rk * .3 + (1 - BT.rk) * -Math.PI / 2, P.ry, 0);
  if (BT.held) {
    bt.R.hand.getWorldPosition(_v);
    _v.y -= .16;
    BT.held.root.position.lerpVectors(BT.holdFrom, _v, BT.holdK);
  }
}

/* положить бокал и полотенце на стойку, чтобы освободить руки */
function stash() {
  bt.L.hand.getWorldPosition(_v);
  GLASS_SPOT.set(clamp(_v.x, -3, 3), CT.top + .001, -2.68);
  RAG_SPOT.set(GLASS_SPOT.x - .22, CT.top + .004, -2.66);
  return Promise.all([tween(BT, { gk: 0, rk: 0 }, .45), tween(POSE, { polish: 0, lShx: -.7, lEl: -.7, rShx: -.7, rEl: -.7 }, .45)]);
}
async function unstash() {
  await walkTo(GLASS_SPOT.x - .05);
  await tween(POSE, { lShx: -.7, lEl: -.7, rShx: -.7, rEl: -.7, look: 0, headX: .4 }, .35);
  await tween(BT, { gk: 1, rk: 1 }, .45);
  await tween(POSE, REST, .6);
}
async function walkTo(tx, casual = false) {
  tx = clamp(tx, -2.85, 2.85);
  const d = Math.abs(tx - POSE.x);
  if (d < .04) return;
  const dur = clamp(d / (casual ? .7 : 1.1), .35, 4);
  tween(POSE, { walk: 1 }, .2);
  await tween(POSE, { x: tx }, dur, ease.sine);
  await tween(POSE, { walk: 0 }, .2);
}
const handOffX = () => .23;

async function fetchBottle(h) {
  BT.busy = true;
  await stash();
  await walkTo(h.home.x - handOffX());
  tween(POSE, { look: 0, headX: -.25 }, .4);
  await tween(POSE, { ry: Math.PI, z: -4.0 }, .5);
  await tween(POSE, { rShx: -1.5, rShz: .02, rEl: -.18 }, .45);
  h.root.userData.out = true;
  BT.holdFrom.copy(h.root.position); BT.holdK = 0; BT.held = h;
  await tween(BT, { holdK: 1 }, .35, ease.out);
  await tween(POSE, { rShx: -.95, rEl: -.95 }, .35);
  await tween(POSE, { ry: 0, z: -3.3, headX: .15 }, .55);
  await tween(POSE, { rShx: -1.2, rEl: -.32 }, .4);
  BT.held = null;
  const p = h.root.position;
  await tween(p, { y: CT.top + .002, z: -2.42 }, .3, ease.out);
  await tween(POSE, { rShx: -.35, rEl: -.5, lShx: -.75, lShz: .45, lEl: -.55, look: 1 }, .5);
}
async function returnBottle(h) {
  await tween(POSE, { look: 0, headX: .35, lShx: -.4, lShz: -.1, lEl: -.5, rShx: -1.2, rEl: -.32 }, .4);
  BT.holdFrom.copy(h.root.position); BT.holdK = 0; BT.held = h;
  await tween(BT, { holdK: 1 }, .3);
  await tween(POSE, { rShx: -.95, rEl: -.95 }, .3);
  await tween(POSE, { ry: Math.PI, z: -4.0, headX: -.25 }, .55);
  await tween(POSE, { rShx: -1.5, rEl: -.18 }, .4);
  BT.held = null;
  await tween(h.root.position, { x: h.home.x, y: h.home.y, z: h.home.z }, .35, ease.out);
  h.root.userData.out = false;
  await tween(POSE, { rShx: -.4, rEl: -.4 }, .3);
  await tween(POSE, { ry: 0, z: BT_Z, headX: .2 }, .5);
  await unstash();
  BT.busy = false;
}
/* коктейль: идёт к шейкеру и трясёт его, пока камера смотрит крупным планом */
async function prepCocktail() {
  BT.busy = true;
  await stash();
  await walkTo(1.05);
  await tween(POSE, { rShx: -1.9, rShz: .2, rEl: -1.6, lShx: -1.9, lShz: -.2, lEl: -1.6, look: .4 }, .5);
}
async function presentCocktail() {
  await tween(POSE, { rShx: -1.15, rShz: .2, rEl: -.4, lShx: -.4, lShz: -.1, lEl: -.4, look: 1 }, .45);
  await tween(POSE, { rShx: -.35, rEl: -.45 }, .4);
}
async function relax() {
  await tween(POSE, { look: 0 }, .3);
  await unstash();
  BT.busy = false;
}

/* сам по себе: протирает бокал, переходит, смотрит на гостей, кивает в такт */
async function idleLife() {
  if (STILL) return;
  for (;;) {
    await new Promise(r => setTimeout(r, R(3.2, 6.5) * 1000));
    if (BT.busy || PAUSED) continue;
    const r = rng();
    if (r < .3) {
      await walkTo(clamp(POSE.x + R(-1.8, 1.8), -2.3, 2.3), true);
    } else if (r < .62) {
      tween(POSE, { look: 1 }, .6);
      await new Promise(res => setTimeout(res, R(1.6, 2.8) * 1000));
      if (!BT.busy) tween(POSE, { look: 0 }, .8);
    } else if (r < .8) {
      tween(POSE, { lShx: -1.55, lEl: -1.05, lShz: -.1, headX: -.15, polish: .2 }, .7);
      await new Promise(res => setTimeout(res, 1600));
      if (!BT.busy) tween(POSE, { lShx: REST.lShx, lEl: REST.lEl, lShz: REST.lShz, headX: REST.headX, polish: 1 }, .8);
    } else {
      tween(BT, { nod: 1 }, .5);
      await new Promise(res => setTimeout(res, 4000));
      tween(BT, { nod: 0 }, .5);
    }
  }
}
