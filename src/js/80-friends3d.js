/* ================= друзья за стойкой: фигуры, имена, напитки, реплики ================= */
const FRS = { slots: [], on: false };
const FR_X = [0, -1.25, -2.5, 2.5];   // табурет 1.25 — ваш собственный
const FR_LOOKS = [
  { kind: "suit", body: "#3a2a4a", tie: "#c9944a", skin: 0xd0a07e, hair: 0x2a1a10 },
  { kind: "dress", body: "#6a1424", skin: 0xe0b090, hair: 0x5a2e14, hairStyle: "bob", lady: true },
  { kind: "suit", body: "#1f3a2c", tie: "#8a1428", skin: 0xa8704e, hair: 0x0c0806, mustache: true },
  { kind: "dress", body: "#1c2a4a", skin: 0xc89070, hair: 0x140c08, hairStyle: "bob", lady: true }
];
function frSlot(i) {
  const x = FR_X[i];
  const F = makeFigure(Object.assign({ seated: true, hipY: .93 }, FR_LOOKS[i]));
  placeFig(F, x, -1.5, Math.PI);
  F.legsFixed = true;
  F.legs.forEach(lg => { lg.tgt.set(lg.side * .1, .33, .14); lg.cur.copy(lg.tgt); });
  F.leanT = .12;
  F.root.visible = false;
  const spot = fromFig(F, V3(-.1, CT.top, .62));
  const G = { F, glass: null, spot, busy: true, x, friend: true, uid: null, drinkId: null };
  restHands(G);
  const tag = document.createElement("div"); tag.className = "nametag"; tag.hidden = true; app.appendChild(tag);
  const bub = document.createElement("div"); bub.className = "fbubble"; app.appendChild(bub);
  G.tag = tag; G.bub = bub; G.bubUntil = 0;
  hot(F.root, 1, "Друг", () => { if (G.uid) { FRIENDS.cheers(); } }, { grow: 0, noChip: true });
  GUESTS.push(G);
  return G;
}
function frGlass(G, d) {
  const id = d ? d.id + d.pour : null;
  if (id === G.drinkId) return;
  G.drinkId = id;
  if (G.glass) { world.remove(G.glass); G.glass = null; }
  if (!d) return;
  G.glass = makeGlass(d.cup || "rocks", d.pour || "#c27a1a", { garnish: d.garnish || null, ice: !!d.ice, op: .85 });
  G.glass.position.copy(G.spot); G.glass.scale.setScalar(1.25);
  world.add(G.glass);
}
function frHideGuests(hide) {
  for (const G of GUESTS) {
    if (G.friend) continue;
    G.F.root.visible = !hide; if (G.glass) G.glass.visible = !hide;
    G.busy = hide ? true : false;
  }
}
function frSync(peers, myUid) {
  const others = Object.entries(peers).filter(([k]) => k !== myUid).sort((a, b) => (a[1].seat || 0) - (b[1].seat || 0)).slice(0, FR_X.length);
  const n = Object.keys(peers).length;
  const badge = document.getElementById("t-friends-n");
  if (badge) { badge.hidden = n < 2; badge.textContent = n; }
  if (!FRS.slots.length && others.length) FRS.slots = FR_X.map((_, i) => frSlot(i));
  frHideGuests(n > 0);
  FRS.on = n > 0;
  FRS.slots.forEach((G, i) => {
    const o = others[i];
    if (!o) {
      if (G.uid) { G.uid = null; G.F.root.visible = false; G.busy = true; G.tag.hidden = true; G.bub.classList.remove("show"); frGlass(G, null); }
      return;
    }
    const [uid, u] = o;
    const fresh = G.uid !== uid;
    G.uid = uid; G.name = u.name; G.zone = u.zone;
    G.F.root.visible = true;
    G.F.root.userData.hot.label = `${u.name}: чокнуться`;
    G.tag.textContent = u.name + (u.zone !== 1 && u.zone != null ? " · " + (["в читальне", "", "в курилке", "у сцены", "в погребе"][u.zone] || "") : "");
    frGlass(G, u.drink);
    G.busy = !G.glass;   // без бокала гость только болтает
    if (fresh) { say(bt, `${u.name}, добрый вечер! Ваше место свободно.`, 4); if (!STILL) laugh(G); }
  });
}
function frSlotOf(uid) { return FRS.slots.find(G => G.uid === uid); }
function frEvent(uid, kind, text) {
  const G = frSlotOf(uid); if (!G) return;
  if (kind === "cheers") { if (!G.busy && G.glass) sip(G); clink(); }
  G.bub.textContent = kind === "cheers" ? "🥂 За вас!" : text;
  G.bubUntil = NOW + Math.min(9000, 2500 + (text || "").length * 70);
}
function frCheers() {
  clink();
  for (const G of FRS.slots) if (G.uid && G.glass && !G.busy) sip(G);
}
const _ft = V3();
onTick(() => {
  if (!FRS.on) return;
  const vis = curZone === 1 && !STREET.on && !SHOW.on;
  for (const G of FRS.slots) {
    if (!G.uid || !vis) { G.tag.hidden = true; G.bub.classList.remove("show"); continue; }
    G.F.head.getWorldPosition(_ft); _ft.y += .2;
    const p = _ft.clone().project(camera);
    const ok = p.z < 1 && Math.abs(p.x) < 1.05 && Math.abs(p.y) < 1.05;
    G.tag.hidden = !ok;
    if (!ok) { G.bub.classList.remove("show"); continue; }
    const x = (p.x + 1) / 2 * innerWidth, y = (1 - p.y) / 2 * innerHeight;
    G.tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    const talk = NOW < G.bubUntil;
    G.bub.classList.toggle("show", talk);
    if (talk) { const half = G.bub.offsetWidth / 2 + 8; G.bub.style.transform = `translate(${clamp(x, half, innerWidth - half)}px, ${Math.max(G.bub.offsetHeight + 8, y - 30)}px) translate(-50%, -100%)`; }
  }
});
H3D.friends = { sync: frSync, event: frEvent, cheers: frCheers, slots: FRS.slots };
/* по ссылке с комнатой: после входа в бар сразу предлагаем сесть к друзьям */
if (/^[a-z0-9]{8}$/.test(QS.get("room") || "")) {
  const t = setInterval(() => {
    if (!started || STREET.on || busy) return;
    clearInterval(t);
    FRIENDS.open();
  }, 1500);
}
