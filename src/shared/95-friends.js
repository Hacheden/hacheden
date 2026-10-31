/* ================= бар с друзьями: общая комната по ссылке =================
   Связь через Firebase Realtime Database (бесплатный тариф). Ключи ниже не секретные:
   их видит любой браузер, а защиту дают правила базы (docs/firebase-rules.json).
   Для проверки без сервера: ?room=…&net=local — вкладки одного браузера видят друг друга. */
  const FIREBASE_CONFIG = null;
  const FB_VER = "10.12.2";
  const ROOM_MAX = 5;
  const FR = { room: null, me: null, uid: null, peers: {}, log: [], net: null, joining: false, lastSay: 0 };
  const roomCode = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), b => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31]).join("");
  const validRoom = s => /^[a-z0-9]{8}$/.test(s || "");
  const friendsReady = () => !!FIREBASE_CONFIG || QS_FR.get("net") === "local";
  const QS_FR = new URLSearchParams(location.search);
  const myName = () => { try { return localStorage.getItem("hacheden-name") || ""; } catch (e) { return ""; } };

  /* транспорт: Firebase или (для проверки) BroadcastChannel между вкладками */
  function localNet() {
    const ch = new BroadcastChannel("hacheden-room"), H = {}, users = {};
    let room = null, uid = "u" + Math.random().toString(36).slice(2, 10), timer = 0;
    const emit = (e, d) => (H[e] || []).forEach(f => f(d));
    const post = m => ch.postMessage(Object.assign({ room }, m));
    ch.onmessage = e => {
      const m = e.data; if (m.room !== room) return;
      if (m.type === "user") { if (m.data) users[m.uid] = m.data; else delete users[m.uid]; emit("peers", Object.assign({}, users)); }
      else if (m.type === "hello") post({ type: "user", uid, data: users[uid] });
      else if (m.type === "msg") emit("msg", m.data);
    };
    return {
      on(e, f) { (H[e] = H[e] || []).push(f); },
      async join(code, me) {
        room = code; users[uid] = Object.assign({}, me, { t: Date.now() });
        post({ type: "hello" });
        await new Promise(r => setTimeout(r, 300));
        const taken = Object.entries(users).filter(([k]) => k !== uid).map(([, u]) => u.seat);
        if (taken.length >= ROOM_MAX) throw new Error("full");
        let s = 0; while (taken.includes(s)) s++;
        users[uid].seat = s;
        post({ type: "user", uid, data: users[uid] });
        emit("peers", Object.assign({}, users));
        addEventListener("pagehide", () => post({ type: "user", uid, data: null }));
        timer = setInterval(() => post({ type: "user", uid, data: users[uid] }), 15000);
        return uid;
      },
      update(p) { Object.assign(users[uid], p); post({ type: "user", uid, data: users[uid] }); emit("peers", Object.assign({}, users)); },
      send(m) { const d = Object.assign({ uid, t: Date.now() }, m); post({ type: "msg", data: d }); emit("msg", d); },
      leave() { clearInterval(timer); post({ type: "user", uid, data: null }); delete users[uid]; room = null; }
    };
  }
  function firebaseNet() {
    const H = {}, emit = (e, d) => (H[e] || []).forEach(f => f(d));
    let F = null, db = null, uid = null, meRef = null, room = null, offs = [], hb = 0, joinedAt = 0;
    async function load() {
      const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
      const [app, auth, rdb] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-database.js")]);
      const a = app.initializeApp(FIREBASE_CONFIG);
      const au = auth.getAuth(a);
      const cred = await auth.signInAnonymously(au);
      uid = cred.user.uid;
      db = rdb.getDatabase(a);
      F = rdb;
    }
    return {
      on(e, f) { (H[e] = H[e] || []).push(f); },
      async join(code, me) {
        if (!F) await load();
        room = code;
        const usersRef = F.ref(db, `rooms/${room}/users`);
        const snap = await F.get(usersRef);
        const now = Date.now(), cur = snap.val() || {};
        const live = Object.entries(cur).filter(([k, u]) => k !== uid && u && now - (u.seen || 0) < 120000);
        if (live.length >= ROOM_MAX) throw new Error("full");
        const taken = live.map(([, u]) => u.seat);
        let s = 0; while (taken.includes(s)) s++;
        meRef = F.ref(db, `rooms/${room}/users/${uid}`);
        await F.onDisconnect(meRef).remove();
        await F.set(meRef, Object.assign({}, me, { seat: s, seen: Date.now(), t: F.serverTimestamp() }));
        joinedAt = Date.now();
        offs.push(F.onValue(usersRef, sn => {
          const all = sn.val() || {}, t = Date.now(), out = {};
          for (const [k, u] of Object.entries(all)) if (k === uid || t - (u.seen || 0) < 120000) out[k] = u;
          emit("peers", out);
        }));
        const q = F.query(F.ref(db, `rooms/${room}/chat`), F.orderByChild("t"), F.startAt(joinedAt - 60000));
        offs.push(F.onChildAdded(q, sn => emit("msg", sn.val())));
        hb = setInterval(() => F.update(meRef, { seen: Date.now() }), 30000);
        return uid;
      },
      update(p) { if (meRef) F.update(meRef, Object.assign({}, p, { seen: Date.now() })); },
      send(m) { if (room) F.push(F.ref(db, `rooms/${room}/chat`), Object.assign({ uid, t: F.serverTimestamp() }, m)); },
      leave() { clearInterval(hb); offs.forEach(f => f()); offs = []; if (meRef) F.remove(meRef); meRef = null; room = null; }
    };
  }

  /* ---------- состояние и события ---------- */
  const frDlg = makeSheet("friends", "Бар с друзьями");
  function drinkInfo(c) { return c ? { id: c.id, name: String(c.name).slice(0, 32), cup: c.cup, pour: c.pour, garnish: c.garnish || "", ice: !!c.ice } : null; }
  function zoneName(z) { return ["в читальне", "за стойкой", "в курилке", "у сцены", "в погребе"][z] || "в баре"; }
  async function joinRoom(code, name) {
    if (FR.joining || FR.room) return;
    if (!validRoom(code)) { toast("Неверный код комнаты", "Код — 8 латинских букв и цифр"); return; }
    name = (name || "").trim().replace(/\s+/g, " ").slice(0, 24);
    if (!name) { toast("Как вас зовут?", "Напишите имя — его увидят друзья"); return; }
    try { localStorage.setItem("hacheden-name", name); } catch (e) {}
    FR.joining = true; renderFriends();
    try {
      FR.net = FR.net || (FIREBASE_CONFIG && QS_FR.get("net") !== "local" ? firebaseNet() : localNet());
      if (!FR.bound) {
        FR.bound = true;
        FR.net.on("peers", p => { FR.peers = p; if (H3D.friends) H3D.friends.sync(p, FR.uid); renderFriends(true); });
        FR.net.on("msg", m => onMsg(m));
      }
      FR.me = { name, look: Math.floor(Math.random() * 5), drink: drinkInfo(LAST_DRINK), zone: typeof cur === "number" ? cur : 1 };
      FR.uid = await FR.net.join(code, FR.me);
      FR.room = code;
      const u = new URL(location.href); u.searchParams.set("room", code); history.replaceState(null, "", u.pathname + u.search + u.hash);
      toast("Вы в комнате", "Отправьте друзьям ссылку — и они сядут рядом");
      uiSound("chime");
      track("count", "friends");
    } catch (e) {
      console.warn(e);
      toast(e.message === "full" ? "Комната заполнена" : "Не получилось подключиться", e.message === "full" ? `За стойкой помещается ${ROOM_MAX} человек` : "Проверьте интернет и попробуйте ещё раз");
    }
    FR.joining = false; renderFriends();
  }
  function leaveRoom() {
    if (!FR.room) return;
    FR.net.leave();
    FR.room = null; FR.peers = {}; FR.log = [];
    if (H3D.friends) H3D.friends.sync({}, FR.uid);
    const u = new URL(location.href); u.searchParams.delete("room"); history.replaceState(null, "", u.pathname + u.search + u.hash);
    renderFriends();
  }
  function onMsg(m) {
    if (!m || !m.uid) return;
    const who = (FR.peers[m.uid] && FR.peers[m.uid].name) || m.name || "Гость";
    FR.log.push({ who, me: m.uid === FR.uid, text: m.text, kind: m.kind });
    if (FR.log.length > 40) FR.log.shift();
    if (m.uid !== FR.uid) {
      if (H3D.friends) H3D.friends.event(m.uid, m.kind, m.text);
      if (m.kind === "cheers") toast(`${who} поднимает бокал`, "За вас!");
      else if (!frDlg.open && (typeof cur !== "number" || cur !== 1)) toast(who, m.text);
    }
    renderLog();
  }
  function say(text) {
    text = (text || "").trim().slice(0, 140);
    if (!text || !FR.room) return;
    if (Date.now() - FR.lastSay < 1200) return;
    FR.lastSay = Date.now();
    FR.net.send({ kind: "say", text, name: FR.me.name });
  }
  function cheers() {
    if (!FR.room) return;
    FR.net.send({ kind: "cheers", text: "За вас!", name: FR.me.name });
    if (H3D.friends) H3D.friends.cheers();
  }
  onProgress((ev) => { if (ev === "drink" && FR.room) FR.net.update({ drink: drinkInfo(LAST_DRINK) }); if (ev === "room" && FR.room) FR.net.update({ zone: cur }); });

  /* ---------- панель ---------- */
  function linkFor(code) { const u = new URL(location.origin + location.pathname); u.searchParams.set("room", code); if (QS_FR.get("net") === "local") u.searchParams.set("net", "local"); return u.toString(); }
  function renderLog() {
    const box = frDlg.querySelector("#fr-log"); if (!box) return;
    box.innerHTML = FR.log.length ? FR.log.map(l => `<p class="${l.me ? "me" : ""}"><b>${escH(l.who)}</b>${l.kind === "cheers" ? " 🥂 " : ": "}${escH(l.text)}</p>`).join("") : `<p class="note">Здесь появятся ваши разговоры.</p>`;
    box.scrollTop = box.scrollHeight;
  }
  function renderFriends(soft) {
    if (soft && FR.room && frDlg.open) {
      const pl = frDlg.querySelector("#fr-people");
      if (pl) { pl.innerHTML = peopleHTML(); return; }
    }
    if (!friendsReady()) {
      frDlg.body.innerHTML = `<p class="note">Скоро здесь можно будет позвать друзей: вы сядете рядом за стойкой, будете видеть их напитки, говорить и чокаться. Подключаем сервер.</p>`;
      return;
    }
    if (!FR.room) {
      const code = validRoom(QS_FR.get("room")) ? QS_FR.get("room") : "";
      frDlg.body.innerHTML = `
        <p class="note">Позовите друзей в Hacheden: каждый садится за стойку со своим именем, видно, кто что пьёт, можно говорить и чокаться. Без регистрации, до ${ROOM_MAX} человек.</p>
        <div class="row" style="grid-template-columns:1fr"><label for="fr-name">Ваше имя</label><input class="fr-in" id="fr-name" maxlength="24" autocomplete="nickname" value="${escH(myName())}" placeholder="Как вас называть"></div>
        ${code ? `<div class="acts"><button class="make big" type="button" data-fr-join="${code}"${FR.joining ? " disabled" : ""}>${FR.joining ? "Подключаемся…" : "Войти в комнату друга"}</button></div>`
          : `<div class="acts"><button class="make big" type="button" data-fr-new${FR.joining ? " disabled" : ""}>${FR.joining ? "Подключаемся…" : "Создать комнату"}</button></div>
        <h3>Есть код от друга?</h3>
        <div class="fr-row"><input class="fr-in" id="fr-code" maxlength="8" autocomplete="off" placeholder="например, k3m9pqrs"><button class="make" type="button" data-fr-code>Войти</button></div>`}
        <p class="note">Ссылку на комнату видят только те, кому вы её отправите.</p>`;
      return;
    }
    frDlg.body.innerHTML = `
      <div class="fr-link"><span>Ссылка для друзей</span><code id="fr-url">${escH(linkFor(FR.room))}</code>
        <div class="acts"><button class="make" type="button" data-fr-copy>Скопировать</button>${navigator.share ? `<button class="make ghost" type="button" data-fr-share>Отправить…</button>` : ""}</div></div>
      <h3>За стойкой</h3>
      <ul class="jlist" id="fr-people">${peopleHTML()}</ul>
      <h3>Разговор</h3>
      <div class="fr-log" id="fr-log" aria-live="polite"></div>
      <form class="fr-row" id="fr-form"><input class="fr-in" id="fr-text" maxlength="140" autocomplete="off" placeholder="Сказать что-нибудь…" aria-label="Сообщение"><button class="make" type="submit">Сказать</button></form>
      <div class="acts"><button class="make" type="button" data-fr-cheers>🥂 Чокнуться</button><button class="make ghost" type="button" data-fr-leave>Выйти из комнаты</button></div>`;
    renderLog();
  }
  function peopleHTML() {
    const list = Object.entries(FR.peers).sort((a, b) => (a[1].seat || 0) - (b[1].seat || 0));
    return list.map(([k, u]) => `<li class="jitem"><span class="ji" aria-hidden="true">${k === FR.uid ? "★" : "☺"}</span><div><b>${escH(u.name)}${k === FR.uid ? " (вы)" : ""}</b><span>${zoneName(u.zone)}${u.drink ? " · пьёт «" + escH(u.drink.name) + "»" : ""}</span></div></li>`).join("")
      + (list.length < 2 ? `<li class="note" style="list-style:none">Пока вы одни. Отправьте ссылку — друзья появятся на соседних табуретах.</li>` : "");
  }
  frDlg.addEventListener("click", async e => {
    const b = e.target.closest("button"); if (!b) return;
    const name = () => (frDlg.querySelector("#fr-name") || {}).value || myName();
    if ("frNew" in b.dataset) joinRoom(roomCode(), name());
    else if (b.dataset.frJoin) joinRoom(b.dataset.frJoin, name());
    else if ("frCode" in b.dataset) joinRoom(((frDlg.querySelector("#fr-code") || {}).value || "").trim().toLowerCase(), name());
    else if ("frCopy" in b.dataset) { try { await navigator.clipboard.writeText(linkFor(FR.room)); toast("Ссылка скопирована", "Отправьте её друзьям"); } catch (er) { toast("Скопируйте ссылку вручную", linkFor(FR.room)); } }
    else if ("frShare" in b.dataset) navigator.share({ title: "Hacheden", text: "Заходи в бар Hacheden, я за стойкой", url: linkFor(FR.room) }).catch(() => {});
    else if ("frCheers" in b.dataset) cheers();
    else if ("frLeave" in b.dataset) leaveRoom();
  });
  frDlg.addEventListener("submit", e => {
    e.preventDefault();
    const inp = frDlg.querySelector("#fr-text"); say(inp.value); inp.value = ""; inp.focus();
  });
  function openFriends() { renderFriends(); openSheet(frDlg); }
  document.getElementById("t-friends").addEventListener("click", openFriends);
  // пока сервер не подключён, кнопку не показываем (кроме проверки ?net=local)
  document.getElementById("t-friends").hidden = !friendsReady();
  const FRIENDS = { get room() { return FR.room; }, get uid() { return FR.uid; }, get peers() { return FR.peers; }, open: openFriends, join: joinRoom, say, cheers, leave: leaveRoom };
