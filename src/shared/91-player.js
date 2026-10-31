/* ================= музыкальный плеер: композиции домашнего ансамбля ================= */
  const IC = {
    play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>`,
    prev: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM19 5.5v13L9 12z" fill="currentColor"/></svg>`,
    next: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM5 5.5v13L15 12z" fill="currentColor"/></svg>`
  };
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const plDlg = makeSheet("player", "Музыка");
  let vizRaf = 0;
  const favTrack = id => PROG.favTracks.includes(id);
  function renderPlayer() {
    const I = Music.info(), T = I.track;
    plDlg.body.innerHTML = `
      <div class="np">
        <p class="np-title" id="np-title">${T.title}</p>
        <p class="np-artist">${T.artist} · ${MOODS_MUSIC[T.mood]}</p>
        <canvas class="np-viz" id="np-viz" width="360" height="54" aria-hidden="true"></canvas>
        <div class="np-bar" aria-hidden="true"><i id="np-prog"></i></div>
        <div class="np-time"><span id="np-el">0:00</span><span>${mmss(TRACK_LEN)}</span></div>
        <div class="np-ctl">
          <button class="pbtn" type="button" data-p="prev" aria-label="Предыдущая композиция">${IC.prev}</button>
          <button class="pbtn big" type="button" data-p="toggle" aria-label="${I.on ? "Пауза" : "Играть"}">${I.on ? IC.pause : IC.play}</button>
          <button class="pbtn" type="button" data-p="next" aria-label="Следующая композиция">${IC.next}</button>
          <button class="fav" type="button" data-pfav="${T.id}" aria-pressed="${favTrack(T.id)}" aria-label="${favTrack(T.id) ? "Убрать из любимых" : "В любимые"}: ${T.title}">${favTrack(T.id) ? "★" : "☆"}</button>
        </div>
      </div>
      ${rngRow("music", "Громкость музыки")}
      <h3>Настроение</h3>
      <div class="seg" role="group" aria-label="Настроение музыки">${Object.entries(MOODS_MUSIC).map(([v, t]) => `<button class="chip" type="button" data-pm="${v}" aria-pressed="${I.mood === v}">${t}</button>`).join("")}</div>
      <h3>Композиции</h3>
      <ul class="tracks">${TRACKS.map((t, i) => `<li class="trk${i === I.i ? " cur" : ""}">
        <button class="pbtn" type="button" data-pt="${i}" aria-label="${i === I.i && I.on ? "Играет" : "Включить"}: ${t.title}">${i === I.i && I.on ? IC.pause : IC.play}</button>
        <div><b>${t.title}</b><span>${t.artist} · ${MOODS_MUSIC[t.mood]} · ${t.bpm} уд/мин</span></div>
        <time>${mmss(TRACK_LEN)}</time>
        <button class="fav" type="button" data-pfav="${t.id}" aria-pressed="${favTrack(t.id)}" aria-label="${favTrack(t.id) ? "Убрать из любимых" : "В любимые"}: ${t.title}">${favTrack(t.id) ? "★" : "☆"}</button>
      </li>`).join("")}</ul>
      <p class="note">Вся музыка сочиняется прямо в браузере: это импровизации нашего домашнего ансамбля, а не чужие записи. На сцене музыканты играют ровно те ноты, что звучат. В режиме «По часам» вечером играют спокойные пьесы, ближе к полуночи — свинг, после часа ночи — поздние баллады.</p>`;
  }
  function vizLoop() {
    vizRaf = 0;
    if (!plDlg.open) return;
    const I = Music.info();
    const prog = plDlg.querySelector("#np-prog"), el = plDlg.querySelector("#np-el");
    if (prog) prog.style.width = Math.min(100, I.elapsed / I.len * 100) + "%";
    if (el) el.textContent = mmss(Math.min(I.elapsed, I.len));
    const cv = plDlg.querySelector("#np-viz");
    if (cv) {
      const g = cv.getContext("2d"), w = cv.width, h = cv.height, N = 32;
      g.clearRect(0, 0, w, h);
      const arr = vizLoop.arr || (vizLoop.arr = new Uint8Array(64));
      const live = I.on && Music.spectrum(arr) && !reduceMotion.matches;
      for (let i = 0; i < N; i++) {
        const v = live ? arr[Math.floor(i * 1.6) + 1] / 255 : .06;
        const bh = Math.max(2, v * h * .95), x = i * (w / N) + 2;
        g.fillStyle = `rgba(${214 + i},${150 + i * 2},${80 + i * 2},${.45 + v * .5})`;
        g.fillRect(x, h - bh, w / N - 4, bh);
      }
    }
    if (I.on) vizRaf = requestAnimationFrame(vizLoop);
    else setTimeout(() => { if (plDlg.open && !vizRaf) vizRaf = requestAnimationFrame(vizLoop); }, 500);
  }
  function refreshPlayer() {
    if (!plDlg.open) return;
    const f = document.activeElement && (document.activeElement.dataset.p || document.activeElement.dataset.pt || document.activeElement.dataset.pm || document.activeElement.dataset.pfav);
    const key = f ? Object.entries(document.activeElement.dataset)[0] : null;
    renderPlayer();
    if (key) { const el = plDlg.querySelector(`[data-${key[0].replace(/[A-Z]/g, m => "-" + m.toLowerCase())}="${key[1]}"]`); if (el) el.focus({ preventScroll: true }); }
    if (!vizRaf) vizRaf = requestAnimationFrame(vizLoop);
  }
  Music.onChange(() => {
    const I = Music.info();
    if (I.on && !I.switching) track("track", I.track.id);
    refreshPlayer();
  });
  plDlg.addEventListener("input", e => {
    const t = e.target; if (t.type !== "range") return;
    t.style.setProperty("--v", t.value + "%"); t.nextElementSibling.textContent = t.value + "%";
    setSetting("music", +t.value / 100);
  });
  plDlg.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.p === "toggle") setMusic(!Music.on);
    else if (b.dataset.p === "next") { Music.next(); if (!Music.on) setMusic(true); }
    else if (b.dataset.p === "prev") { Music.prev(); if (!Music.on) setMusic(true); }
    else if (b.dataset.pt != null) {
      const i = +b.dataset.pt, I = Music.info();
      if (i === I.i && I.on) setMusic(false);
      else { Music.play(i); setMusic(true); }
    } else if (b.dataset.pm) Music.setMood(b.dataset.pm);
    else if (b.dataset.pfav) {
      const id = b.dataset.pfav, k = PROG.favTracks.indexOf(id);
      if (k >= 0) PROG.favTracks.splice(k, 1); else PROG.favTracks.push(id);
      saveProgress(); track("count", "favtrack");
      refreshPlayer();
    }
  });
  plDlg.addEventListener("close", () => { cancelAnimationFrame(vizRaf); vizRaf = 0; });
  function openPlayer() { renderPlayer(); openSheet(plDlg); if (!vizRaf) vizRaf = requestAnimationFrame(vizLoop); }
  document.getElementById("t-player").addEventListener("click", openPlayer);
