/* ================= первое впечатление: неоновый логотип, пропуск вступления, знакомство с управлением ================= */
/* логотип зажигается по буквам, как настоящая неоновая трубка; потом по нему пробегает отблеск */
{
  const h1 = introTitle;
  if (!h1.classList.contains("off") && !STILL) {
    const txt = h1.textContent;
    h1.textContent = "";
    h1.classList.add("neon-in");
    h1.setAttribute("aria-label", txt);
    [...txt].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "nl"; s.textContent = ch; s.setAttribute("aria-hidden", "true");
      s.style.animationDelay = (.35 + i * .13 + (i === 3 ? .5 : 0)) + "s";   // одна буква упрямится — так бывает с неоном
      h1.appendChild(s);
    });
    const sweep = document.createElement("i"); sweep.className = "nl-sweep"; sweep.setAttribute("aria-hidden", "true"); h1.appendChild(sweep);
  }
}
/* вход: интро не просто гаснет, а камера словно проходит сквозь него */
enter.addEventListener("click", () => { intro.classList.add("dive"); }, { capture: true });

/* «Пропустить вступление»: сразу внутрь, за стойку */
const skipBtn = document.createElement("button");
skipBtn.type = "button"; skipBtn.className = "skip-intro"; skipBtn.textContent = "Пропустить вступление";
skipBtn.hidden = true;
app.appendChild(skipBtn);
async function skipStreet() {
  if (!STREET.on) return;
  skipBtn.hidden = true;
  STREET.step = "inside";
  streetTalk([]);
  bubbleEl.classList.remove("show");
  SDOOR.eyes.visible = false;
  await fade(true, .45);
  flight = null;
  Music.room(1);
  setCam(framed(1));
  app.classList.remove("street");
  STREET.on = false;
  renderZoneUI(1);
  hintEl.textContent = ZONES[1].hint;
  SDOOR.g.rotation.y = 0;
  doorway.material.opacity = 0; STREET.doorStreak.material.opacity = 0;
  streetLights(false);
  street.visible = false;
  try { localStorage.setItem("hacheden-visited", "1"); } catch (e) {}
  await fade(false, .7);
}
skipBtn.addEventListener("click", skipStreet);
addEventListener("keydown", e => { if (e.key === "Escape" && STREET.on && !skipBtn.hidden) skipStreet(); });
onTick(() => { const want = STREET.on && started; if (skipBtn.hidden === want) skipBtn.hidden = !want; });

/* знакомство с управлением: три коротких подсказки при первом визите */
const COACH = [
  { t: "Осмотритесь", d: COARSE ? "Проведите пальцем по экрану — камера повернётся." : "Зажмите кнопку мыши и потяните — камера повернётся." },
  { t: "Всё живое", d: COARSE ? "Нажимайте на людей и предметы. Кнопки внизу дублируют всё, что есть в зале." : "Наведите на предмет — он подсветится. Нажмите, чтобы взаимодействовать. Кнопки внизу дублируют всё, что есть в зале." },
  { t: "Ваш вечер", d: "Внизу — залы бара. Справа — посетители, фото, музыка, журнал секретов и настройки. Барная карта — слева сверху." }
];
const coachEl = document.createElement("div");
coachEl.className = "coach"; coachEl.hidden = true; coachEl.setAttribute("role", "dialog"); coachEl.setAttribute("aria-label", "Знакомство с управлением");
app.appendChild(coachEl);
let coachI = 0;
function coachShow() {
  const c = COACH[coachI];
  coachEl.innerHTML = `<b>${c.t}</b><p>${c.d}</p><div class="coach-row"><span>${coachI + 1} / ${COACH.length}</span>
    <button class="clear" type="button" data-coach-skip>Не показывать</button><button class="make" type="button" data-coach-next>${coachI < COACH.length - 1 ? "Дальше" : "Понятно"}</button></div>`;
  coachEl.hidden = false;
  coachEl.classList.remove("in"); void coachEl.offsetWidth; coachEl.classList.add("in");
}
function coachEnd() { coachEl.hidden = true; try { localStorage.setItem("hacheden-coach", "1"); } catch (e) {} }
coachEl.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if ("coachSkip" in b.dataset) coachEnd();
  else if (++coachI < COACH.length) coachShow(); else coachEnd();
});
{
  let seen = false; try { seen = localStorage.getItem("hacheden-coach") === "1"; } catch (e) {}
  if (!seen) {
    const t = setInterval(() => {
      if (!started || STREET.on || busy || modalOpen()) return;
      clearInterval(t);
      setTimeout(coachShow, 1800);
    }, 1000);
  }
}
Object.assign(H3D, { skipStreet, coach: () => { coachI = 0; coachShow(); }, owner: OWNER });
