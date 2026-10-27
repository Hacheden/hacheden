/* ================= люди: бармен и гости из простых форм, но с живой анимацией ================= */
function makePerson(o = {}) {
  const P = Object.assign({
    shirt: 0xe2dbcc, vest: 0x2a0d13, trousers: 0x141113, skin: 0xb98262, hair: 0x1a110b,
    seated: false, mustache: false, bowtie: null, hat: null, apron: false, rolled: false, jacket: null
  }, o);
  const mat = c => std({ color: c, roughness: .78 });
  const mSkin = std({ color: P.skin, roughness: .62 }), mShirt = mat(P.shirt), mBody = mat(P.jacket || P.vest);
  const mTr = mat(P.trousers), mHair = std({ color: P.hair, roughness: .85 }), mDark = std({ color: 0x0c0908, roughness: .5 });
  const root = new THREE.Group();
  const hips = group(0, P.seated ? .5 : 1.0, 0, root);
  const spine = group(0, 0, 0, hips);

  const torso = mesh(new THREE.CapsuleGeometry(.175, .4, 6, 18), mBody, 0, .36, 0, spine);
  torso.scale.set(1.15, 1, .72);
  const pelvis = mesh(new THREE.CapsuleGeometry(.16, .06, 4, 14), mTr, 0, .02, 0, spine);
  pelvis.scale.set(1.1, 1, .78);
  // вырез рубашки и воротник
  const vs = new THREE.Shape();
  vs.moveTo(-.07, 0); vs.lineTo(.07, 0); vs.lineTo(0, -.22); vs.closePath();
  const vneck = mesh(new THREE.ShapeGeometry(vs), mShirt, 0, .72, .124, spine);
  vneck.rotation.x = -.18;
  const collar = mesh(new THREE.TorusGeometry(.06, .018, 6, 16), mShirt, 0, .77, 0, spine);
  collar.rotation.x = Math.PI / 2;
  if (P.bowtie) {
    const bm = std({ color: P.bowtie, roughness: .5 });
    for (const s of [-1, 1]) { const c = mesh(new THREE.ConeGeometry(.026, .05, 4), bm, s * .024, .745, .13, spine); c.rotation.z = s * Math.PI / 2; }
    mesh(new THREE.SphereGeometry(.011, 8, 6), bm, 0, .745, .135, spine);
  }
  if (P.apron) {
    const ap = mesh(new THREE.BoxGeometry(.42, .62, .012), std({ color: 0x0d0b0c, roughness: .9 }), 0, -.26, .13, spine);
    mesh(new THREE.BoxGeometry(.42, .015, .2), std({ color: 0x0d0b0c }), 0, .06, 0, spine).scale.set(1.05, 1, 1);
    ap.rotation.x = .04;
  }
  // голова
  mesh(new THREE.CylinderGeometry(.048, .055, .1, 12), mSkin, 0, .8, 0, spine);
  const head = group(0, .86, 0, spine);
  const skull = mesh(new THREE.SphereGeometry(.105, 24, 18), mSkin, 0, .1, 0, head);
  skull.scale.set(.92, 1.12, 1);
  const hair = mesh(new THREE.SphereGeometry(.112, 24, 12, 0, Math.PI * 2, 0, Math.PI * .52), mHair, 0, .12, -.012, head);
  hair.rotation.x = -.35; hair.scale.set(.96, 1.05, 1.06);
  for (const s of [-1, 1]) {
    mesh(new THREE.SphereGeometry(.024, 10, 8), mSkin, s * .097, .1, -.005, head).scale.set(.45, 1, .75);
    mesh(new THREE.SphereGeometry(.0105, 8, 6), mDark, s * .036, .118, .089, head);
    const brow = mesh(new THREE.BoxGeometry(.034, .007, .01), mHair, s * .037, .142, .092, head);
    brow.rotation.z = s * -.12;
  }
  mesh(new THREE.SphereGeometry(.017, 10, 8), mSkin, 0, .093, .103, head).scale.set(.8, 1, 1.25);
  if (P.mustache) {
    for (const s of [-1, 1]) {
      const m = mesh(new THREE.CapsuleGeometry(.008, .032, 3, 6), mHair, s * .02, .066, .1, head);
      m.rotation.z = s * 1.2;
    }
  }
  if (P.hat) {
    const hm = std({ color: P.hat, roughness: .7 });
    mesh(new THREE.CylinderGeometry(.17, .17, .012, 24), hm, 0, .2, 0, head);
    mesh(new THREE.CylinderGeometry(.09, .105, .1, 20), hm, 0, .25, 0, head);
    mesh(new THREE.CylinderGeometry(.106, .106, .02, 20), std({ color: 0x3a0e16 }), 0, .215, 0, head);
  }
  // руки: плечо → локоть → кисть
  const arm = side => {
    const sh = group(side * .23, .62, 0, spine);
    mesh(new THREE.SphereGeometry(.06, 12, 10), mBody, 0, 0, 0, sh);
    mesh(new THREE.CapsuleGeometry(.05, .2, 4, 10), P.jacket ? mBody : mShirt, 0, -.15, 0, sh);
    const el = group(0, -.31, 0, sh);
    mesh(new THREE.CapsuleGeometry(.044, .18, 4, 10), P.rolled ? mSkin : (P.jacket ? mBody : mShirt), 0, -.13, 0, el);
    if (P.rolled) { const cuff = mesh(new THREE.TorusGeometry(.048, .016, 6, 14), mShirt, 0, -.02, 0, el); cuff.rotation.x = Math.PI / 2; }
    const hand = group(0, -.28, 0, el);
    mesh(new THREE.SphereGeometry(.046, 12, 10), mSkin, 0, 0, 0, hand).scale.set(.75, 1, .55);
    mesh(new THREE.CapsuleGeometry(.014, .035, 3, 6), mSkin, side * -.03, .005, .02, hand).rotation.z = side * .8;
    return { sh, el, hand };
  };
  const L = arm(1), Rr = arm(-1);
  // ноги
  const legs = [-1, 1].map(s => {
    const th = group(s * .09, 0, 0, hips);
    mesh(new THREE.CapsuleGeometry(.068, .36, 4, 10), mTr, 0, -.24, 0, th);
    const kn = group(0, -.47, 0, th);
    mesh(new THREE.CapsuleGeometry(.056, .36, 4, 10), mTr, 0, -.22, 0, kn);
    mesh(new RoundedBoxGeometry(.09, .06, .22, 2, .02), mDark, 0, -.47, .05, kn);
    if (P.seated) { th.rotation.x = -Math.PI / 2 + .05; kn.rotation.x = Math.PI / 2 - .05; }
    return { th, kn };
  });
  return { root, hips, spine, head, L, R: Rr, legs };
}
