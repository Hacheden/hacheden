/* ================= единый кинематографичный облик: материалы, тени, фокус ================= */
/* материалы: дерево под лаком, кожа с бархатистым отблеском, камень и металл с честными отражениями */
function physFrom(m, extra) {
  const p = new THREE.MeshPhysicalMaterial({ map: m.map, color: m.color, roughness: m.roughness, metalness: m.metalness, envMapIntensity: m.envMapIntensity,
    emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite });
  return Object.assign(p, extra);
}
const SWAP = new Map([
  [M.walnutGloss, physFrom(M.walnutGloss, { clearcoat: .7, clearcoatRoughness: .14, roughness: .32 })],
  [M.marble, physFrom(M.marble, { clearcoat: .9, clearcoatRoughness: .08, roughness: .28, envMapIntensity: 1.1 })],
  [M.leatherRed, physFrom(M.leatherRed, { sheen: .6, sheenRoughness: .45, sheenColor: new THREE.Color(0xff9a7a), roughness: .5 })],
  [M.leatherBrown, physFrom(M.leatherBrown, { sheen: .55, sheenRoughness: .5, sheenColor: new THREE.Color(0xe0a070), roughness: .55 })],
  [M.velvetGreen, physFrom(M.velvetGreen, { sheen: 1, sheenRoughness: .3, sheenColor: new THREE.Color(0x4a8a6a) })],
  [M.velvetRed, physFrom(M.velvetRed, { sheen: 1, sheenRoughness: .3, sheenColor: new THREE.Color(0xc04050) })],
  [glassMat, physFrom(glassMat, { clearcoat: 1, clearcoatRoughness: .02, ior: 1.5, specularIntensity: 1, envMapIntensity: 3 })],
  [MX.glass, physFrom(MX.glass, { clearcoat: 1, clearcoatRoughness: .02, ior: 1.5, specularIntensity: 1, envMapIntensity: 3.2 })]
]);
M.floor.envMapIntensity = 1.05; M.floor.roughness = .32;
M.walnut.envMapIntensity = .75;
M.brass.envMapIntensity = 1.7; M.chrome.envMapIntensity = 1.9;
world.traverse(o => {
  if (!o.isMesh) return;
  const s = SWAP.get(o.material);
  if (s) o.material = s;
});

/* тени: на высоком качестве — мягкие тени от заполняющего света зала (обновляются 10 раз в секунду);
   на всех уровнях — мягкие «контактные» пятна под людьми, чтобы никто не парил над полом */
const SHADOW = { on: POST.tier === 2, n: 0 };
const blobTex = canvasTex(128, 128, (g, w, h) => {
  const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
  gr.addColorStop(0, "rgba(0,0,0,.62)"); gr.addColorStop(.55, "rgba(0,0,0,.28)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
});
const blobMat = basic({ map: blobTex, transparent: true, depthWrite: false, opacity: .75 });
const blobGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
function addBlob(F) {
  if (F._blob) return;
  const b = new THREE.Mesh(blobGeo, blobMat);
  b.position.set(0, .006 - (F.y0 || 0), 0);
  b.scale.setScalar(F.seated ? .55 : .7);
  b.renderOrder = 1;
  F.root.add(b); F._blob = b;
}
FIGS.forEach(addBlob);
if (SHADOW.on) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const L = LIGHTS.fill;
  L.castShadow = true;
  L.shadow.mapSize.set(512, 512);
  L.shadow.bias = -.003; L.shadow.normalBias = .02; L.shadow.radius = 4;
  L.shadow.camera.near = .25; L.shadow.camera.far = 9;
  world.traverse(o => { if (o.isMesh && !(o.material && o.material.isMeshBasicMaterial)) o.receiveShadow = true; });
  const caster = r => r.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = true; });
  FIGS.forEach(F => caster(F.root));
  // табуреты, кресла, кафедра, столы — всё, что из кожи и металла
  world.traverse(o => { if (o.isMesh && (o.material === SWAP.get(M.leatherRed) || o.material === SWAP.get(M.leatherBrown) || o.material === M.chrome || o.material === M.brassDark)) o.castShadow = true; });
  for (const F of FIGS) if (F._blob) F._blob.material = blobMat;
  blobMat.opacity = .45;
  renderer.shadowMap.needsUpdate = true;
}
/* новые фигуры (живые посетители) тоже получают пятно и тень */
setInterval(() => {
  for (const F of FIGS) {
    if (F._blob) continue;
    addBlob(F);
    if (SHADOW.on) F.root.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) { o.castShadow = true; o.receiveShadow = true; } });
  }
}, 3000);
/* тени отбрасывает только то, что рядом с заполняющим светом: дальние залы в карту теней не попадают */
const CASTERS = [];
if (SHADOW.on) world.traverse(o => { if (o.isMesh && o.castShadow) CASTERS.push(o); });
const _sp = V3();
function cullCasters() {
  const L = LIGHTS.fill.position;
  for (const o of CASTERS) { o.getWorldPosition(_sp); o.castShadow = o.visible && _sp.distanceTo(L) < 5.5; }
}
setInterval(() => { if (SHADOW.on && POST.tier === 2) { for (const F of FIGS) F.root.traverse(o => { if (o.isMesh && o.castShadow && !CASTERS.includes(o)) CASTERS.push(o); }); cullCasters(); } }, 1500);
onTick(() => {
  if (!SHADOW.on || POST.tier < 2) { if (renderer.shadowMap.enabled && POST.tier < 2) { renderer.shadowMap.enabled = false; LIGHTS.fill.castShadow = false; } return; }
  if (++SHADOW.n % 6 === 0) renderer.shadowMap.needsUpdate = true;
});

/* фокус: крупные планы — шоу бармена, разговор у стойки, дегустация в погребе */
const LOOKAT = { p: null };
const _fh = V3();
onTick(() => {
  if (SHOW.on) POST.focus(SHOW.focus, .0016);
  else if (SEAT.on) { bt.head.getWorldPosition(_fh); POST.focus(_fh.clone(), .0011); }
  else if (typeof CEL !== "undefined" && CEL.on && CEL.busy) { SOM.head.getWorldPosition(_fh); POST.focus(_fh.clone(), .0012); }
  else if (LOOKAT.p) POST.focus(LOOKAT.p, .0014);
  else POST.focus(null);
});
