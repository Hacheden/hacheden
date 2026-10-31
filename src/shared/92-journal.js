/* ================= журнал: секреты, достижения и «мой вечер» =================
   Секреты не раскрываются заранее: в журнале видно только найденное и сколько ещё спрятано. */
  const SECRET_INFO = {
    cellar: { name: "Погреб за книжным шкафом", text: "Книга, которая торчит из полки, открывает ход вниз — к сомелье и бочкам." },
    glowbook: { name: "Книга, что светится в темноте", text: "Задуйте свечу в читальне — и одна книга на столе начнёт светиться." },
    cat: { name: "Кошачье доверие", text: "Кот у камина замурлыкал и перевернулся на спину: его гладили достаточно долго." },
    knock: { name: "Условный стук", text: "Три стука в дверь «Приват» — и за ней узнают своего." },
    barkeep: { name: "Терпение бармена", text: "Если звать бармена слишком настойчиво, он ответит по-особому." },
    midnight: { name: "Разговор после полуночи", text: "После полуночи у стойки можно попросить историю не для всех." },
    closing: { name: "Конец смены", text: "Вы видели, как бар закрывается: музыканты кланяются, гаснет неон." },
    catvisit: { name: "Гость на стойке", text: "Редкий вечер: кот пришёл из курилки и устроился прямо на стойке." },
    raid: { name: "Облава сухого закона", text: "Однажды в дверь постучала полиция, и бар за минуту превратился в клуб любителей чая." }
  };
  const ACH = [
    { id: "regular", icon: "⌂", name: "Завсегдатай", text: "Побывать во всех четырёх залах.", test: () => [0, 1, 2, 3].every(i => PROG.rooms.includes(i)) },
    { id: "first", icon: "🍸", name: "Первый глоток", text: "Заказать первый коктейль.", test: () => Object.keys(PROG.drinks).length >= 1 },
    { id: "taster", icon: "✧", name: "Дегустатор", text: "Попробовать 5 разных коктейлей.", test: () => Object.keys(PROG.drinks).length >= 5 },
    { id: "collector", icon: "❖", name: "Коллекционер", text: "Попробовать 12 разных коктейлей.", test: () => Object.keys(PROG.drinks).length >= 12 },
    { id: "author", icon: "✎", name: "Автор рецепта", text: "Придумать и сохранить свой коктейль.", test: () => MINE.length >= 1 },
    { id: "offmenu", icon: "✦", name: "Не из меню", text: "Найти тайный рецепт.", test: () => FOUND.size >= 1 },
    { id: "keeper", icon: "♛", name: "Хранитель рецептов", text: "Найти все тайные рецепты.", test: () => FOUND.size >= SECRETS.length },
    { id: "sleuth", icon: "⌕", name: "Сыщик", text: "Найти три секрета бара.", test: () => Object.keys(PROG.secrets).length >= 3 },
    { id: "insider", icon: "⚿", name: "Свой человек", text: "Найти все секреты бара.", test: () => Object.keys(SECRET_INFO).every(k => PROG.secrets[k]) },
    { id: "sommelier", icon: "🍷", name: "Сомелье", text: "Попробовать все четыре вина в погребе.", test: () => { try { return JSON.parse(localStorage.getItem("hacheden-tasted") || "[]").length >= 4; } catch (e) { return false; } } },
    { id: "melomane", icon: "♪", name: "Меломан", text: "Послушать три разные композиции.", test: () => PROG.tracks.length >= 3 },
    { id: "bookworm", icon: "❦", name: "Книжный червь", text: "Прочитать три рассказа в читальне.", test: () => PROG.stories.length >= 3 },
    { id: "favs", icon: "★", name: "Свой вечер", text: "Отметить три коктейля в избранном.", test: () => FAV.size >= 3 },
    { id: "owl", icon: "☾", name: "Полуночник", text: "Зайти в бар после полуночи.", test: () => !!PROG.counters.owl }
  ];
  let jUnseen = false;
  function checkAch(quiet) {
    for (const a of ACH) {
      if (PROG.ach[a.id]) continue;
      let ok = false; try { ok = a.test(); } catch (e) {}
      if (!ok) continue;
      PROG.ach[a.id] = Date.now();
      saveProgress();
      if (!quiet) { setTimeout(() => { uiSound("chime"); toast("Достижение: " + a.name, a.text, "ach"); }, 900); jUnseen = true; }
    }
    const dot = document.getElementById("t-journal-dot");
    if (dot) dot.hidden = !jUnseen;
  }
  onProgress((ev) => { if (ev === "secret") jUnseen = true; checkAch(); });
  {
    const h = new Date().getHours();
    if (h < 3 && !PROG.counters.owl) { PROG.counters.owl = 1; saveProgress(); }
  }
  setTimeout(() => checkAch(true), 0);

  const jDlg = makeSheet("journal", "Журнал", "wide");
  let jTab = "secrets";
  const dateRu = t => new Date(t).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  function renderJournal() {
    const keys = Object.keys(SECRET_INFO), found = keys.filter(k => PROG.secrets[k]);
    const tabs = `<div class="tabs jtabs" role="tablist">${[["secrets", "Секреты"], ["ach", "Достижения"], ["me", "Мой вечер"]].map(([id, t]) =>
      `<button class="tab" type="button" role="tab" data-jt="${id}" aria-selected="${jTab === id}">${t}</button>`).join("")}</div>`;
    let html = "";
    if (jTab === "secrets") {
      const n = found.length + FOUND.size, total = keys.length + SECRETS.length;
      html = `<div class="jmeter"><span>Найдено ${n} из ${total}</span><div class="np-bar"><i style="width:${n / total * 100}%"></i></div></div>
        ${found.length ? `<ul class="jlist">${found.map(k => `<li class="jitem"><span class="ji" aria-hidden="true">✦</span><div><b>${SECRET_INFO[k].name}</b><span>${SECRET_INFO[k].text}</span><em>${dateRu(PROG.secrets[k])}</em></div></li>`).join("")}</ul>`
          : `<p class="note">Пока ни одного. В баре есть вещи, которые замечают не все: присматривайтесь, нажимайте, возвращайтесь в разное время.</p>`}
        ${keys.length - found.length ? `<p class="note">Ещё спрятано: ${keys.length - found.length}. Подсказок здесь не будет — только намёки бармена.</p>` : `<p class="note">Все секреты бара найдены. Вы знаете Hacheden лучше многих.</p>`}
        <h3>Тайные рецепты · ${FOUND.size} из ${SECRETS.length}</h3>
        ${FOUND.size ? `<ul class="jlist">${SECRETS.filter(s => FOUND.has(s.id)).map(s => `<li class="jitem"><span class="ji" aria-hidden="true">🍸</span><div><b>${s.name}</b><span>${s.tagline}</span></div></li>`).join("")}</ul>`
          : `<p class="note">Их собирают в шейкере во вкладке «Смешать». Подсказки — в барной карте.</p>`}`;
    } else if (jTab === "ach") {
      const got = ACH.filter(a => PROG.ach[a.id]).length;
      html = `<div class="jmeter"><span>Открыто ${got} из ${ACH.length}</span><div class="np-bar"><i style="width:${got / ACH.length * 100}%"></i></div></div>
        <ul class="jlist">${ACH.map(a => `<li class="jitem${PROG.ach[a.id] ? "" : " locked"}"><span class="ji" aria-hidden="true">${PROG.ach[a.id] ? a.icon : "·"}</span><div><b>${a.name}</b><span>${a.text}</span>${PROG.ach[a.id] ? `<em>${dateRu(PROG.ach[a.id])}</em>` : ""}</div></li>`).join("")}</ul>`;
    } else {
      const tried = Object.entries(PROG.drinks).sort((a, b) => b[1] - a[1]);
      const top = tried.slice(0, 3).map(([id]) => COCKTAIL_BY_ID[id]).filter(Boolean);
      const rooms = ["Читальня", "Бар", "Курилка", "Сцена", "Погреб"].filter((r, i) => PROG.rooms.includes(i));
      const fav = [...FAV].map(id => COCKTAIL_BY_ID[id]).filter(Boolean);
      const favT = PROG.favTracks.map(id => TRACKS.find(t => t.id === id)).filter(Boolean);
      html = `<div class="stats">
          <div class="stat"><b>${PROG.visits}</b><span>визитов в бар</span></div>
          <div class="stat"><b>${tried.length}</b><span>разных коктейлей</span></div>
          <div class="stat"><b>${MINE.length}</b><span>своих рецептов</span></div>
          <div class="stat"><b>${Object.keys(PROG.secrets).length + FOUND.size}</b><span>найдено секретов</span></div>
        </div>
        <h3>Залы</h3><p class="note">${rooms.length ? rooms.join(", ") : "Пока только улица."}</p>
        <h3>Чаще всего</h3><p class="note">${top.length ? top.map(c => escH(c.name)).join(", ") : "Ещё ничего не заказано."}</p>
        <h3>Избранные коктейли</h3><p class="note">${fav.length ? fav.map(c => escH(c.name)).join(", ") : "Отмечайте звёздочкой в барной карте."}</p>
        <h3>Свои рецепты</h3><p class="note">${MINE.length ? MINE.map(c => escH(c.name)).join(", ") : "Смешайте что-нибудь своё во вкладке «Смешать»."}</p>
        <h3>Любимые композиции</h3><p class="note">${favT.length ? favT.map(t => t.title).join(", ") : "Отмечайте звёздочкой в плеере."}</p>
        <p class="note">Первый визит: ${dateRu(PROG.first)}. Всё хранится только в этом браузере — без регистрации.</p>
        <div class="acts"><button class="make ghost${jWipe ? " warn" : ""}" type="button" data-jwipe>${jWipe ? "Точно стереть? Нажмите ещё раз" : "Стереть прогресс"}</button></div>`;
    }
    jDlg.body.innerHTML = tabs + html;
  }
  let jWipe = false;
  jDlg.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.jt) { jTab = b.dataset.jt; jWipe = false; renderJournal(); jDlg.querySelector(`[data-jt="${jTab}"]`).focus(); }
    else if ("jwipe" in b.dataset) {
      if (!jWipe) { jWipe = true; renderJournal(); jDlg.querySelector("[data-jwipe]").focus(); return; }
      for (const k of ["hacheden-progress", "hacheden-found", "hacheden-mine", "hacheden-fav", "hacheden-tasted", "hacheden-cellar"]) { try { localStorage.removeItem(k); } catch (er) {} }
      location.reload();
    }
  });
  jDlg.addEventListener("close", () => { jWipe = false; });
  function openJournal(tab) {
    if (tab) jTab = tab;
    checkAch(true);
    jUnseen = false;
    const dot = document.getElementById("t-journal-dot"); if (dot) dot.hidden = true;
    renderJournal(); openSheet(jDlg);
  }
  document.getElementById("t-journal").addEventListener("click", () => openJournal());
