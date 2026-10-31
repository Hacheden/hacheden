/* ================= интерфейс: «сейчас играет» и компактное меню на телефоне ================= */
  /* при смене композиции под заголовком зала ненадолго появляется её название */
  const npPill = document.createElement("div");
  npPill.className = "np-pill"; npPill.setAttribute("role", "status"); npPill.setAttribute("aria-live", "polite");
  document.getElementById("app").appendChild(npPill);
  let npLast = "", npT = 0;
  Music.onChange(() => {
    const I = Music.info();
    if (!I.on || I.switching) return;
    const key = I.track.id;
    if (key === npLast) return;
    npLast = key;
    npPill.innerHTML = `<span class="np-eq" aria-hidden="true"><i></i><i></i><i></i></span><b></b><span></span>`;
    npPill.querySelector("b").textContent = I.track.title;
    npPill.querySelector("span:last-child").textContent = I.track.artist;
    npPill.classList.add("show");
    clearTimeout(npT);
    npT = setTimeout(() => npPill.classList.remove("show"), 5200);
  });
  npPill.addEventListener("click", () => { npPill.classList.remove("show"); openPlayer(); });

  /* телефон: кнопки справа прячутся в одну, чтобы не закрывать зал */
  {
    const tools = document.getElementById("tools");
    const tg = document.createElement("button");
    tg.type = "button"; tg.className = "tool tool-more"; tg.id = "t-more";
    tg.setAttribute("aria-label", "Ещё: посетители, фото, музыка, журнал, настройки"); tg.setAttribute("aria-expanded", "false");
    tg.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="6" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="18" cy="12" r="1.8" fill="currentColor"/></svg><i class="tool-dot" id="t-more-dot" hidden></i>`;
    tools.prepend(tg);
    const setOpen = on => { tools.classList.toggle("open", on); tg.setAttribute("aria-expanded", String(on)); };
    tg.addEventListener("click", () => setOpen(!tools.classList.contains("open")));
    tools.addEventListener("click", e => { if (e.target.closest(".tool:not(.tool-more)")) setOpen(false); });
    document.addEventListener("pointerdown", e => { if (!e.target.closest("#tools")) setOpen(false); });
    // точка на «ещё», если в журнале есть новое или в баре кто-то есть
    setInterval(() => {
      const jd = document.getElementById("t-journal-dot"), fn = document.getElementById("t-friends-n");
      document.getElementById("t-more-dot").hidden = !((jd && !jd.hidden) || (fn && !fn.hidden));
    }, 1500);
  }
