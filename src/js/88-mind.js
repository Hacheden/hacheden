/* ================= характер бармена: состояния и реплики по обстоятельствам =================
   Бармен не говорит случайных фраз «в пустоту»: каждая реплика опирается на то, что происходит —
   время, погоду, музыку, гостей, ваш прошлый визит и ваши действия. */
const MIND = { state: "fresh", lastLine: 0, said: new Set(), greeted: false, bottles: [], menuOpens: [], quietSince: 0, wasCellar: false, mixT: 0, mixKey: "", mixSaid: 0 };
function btState() {
  const h = hourNow();
  if (SHOW.on || BT.busy && !SEAT.on) return "working";
  if (SEAT.on) return "talking";
  if (h >= 1.5 && h < 3) return "tired";
  if (h >= 17 && h < 19) return "fresh";
  return "evening";
}
const myGuestName = () => { try { const n = localStorage.getItem("hacheden-name"); return n && n !== "Гость" ? n : ""; } catch (e) { return ""; } };
const favDrink = () => { const e = Object.entries(PROG.drinks).sort((a, b) => b[1] - a[1])[0]; return e && e[1] >= 2 ? COCKTAIL_BY_ID[e[0]] : null; };
/* реплика: не чаще раза в 40 секунд и без повторов за вечер */
function btLine(text, dur = 5, force = false) {
  if (!text) return false;
  if (!force && (NOW - MIND.lastLine < 40000 || MIND.said.has(text))) return false;
  if (curZone !== 1 || STREET.on || SHOW.on || modalOpen() || CLOSING.on || (bubble && bubble.F !== bt)) return false;
  MIND.lastLine = NOW; MIND.said.add(text);
  say(bt, text, dur);
  return true;
}
const pickLine = arr => arr[Math.floor(Math.random() * arr.length)];
/* что сказать, когда гость рядом и ничем не занят: из обстоятельств вечера */
function ambientLine() {
  const st = btState(), h = hourNow(), opts = [];
  if (st === "fresh") opts.push("Только открылись — лёд свежий, бутылки протёрты. Лучшее время, чтобы выбрать не спеша.");
  if (st === "tired") opts.push("Под утро руки сами помнят рецепты. Голова уже думает о кофе.", "Скоро последний заказ. Если хотели что-то попробовать — самое время.");
  if (h >= 23 || h < 1) opts.push("Полночь — время для чего-нибудь покрепче. Или для разговора.");
  if (WX_NOW.ok && WX_NOW.temp <= 2) opts.push(`На улице ${Math.round(WX_NOW.temp)}°. Горячий тодди или ирландский кофе — и вечер спасён.`);
  if (WEATHER.rain && WX_NOW.ok) opts.push("Дождь стучит по окнам читальни. Там сейчас особенно уютно.");
  if (WEATHER.snow) opts.push("Снег идёт. В такие вечера заказывают коньяк — и правильно делают.");
  if (Music.on && BAND_HERE) opts.push(`Слышите? «${Music.info().track.title}». Наш пианист сегодня в ударе.`);
  if (!Music.on && BAND_HERE) opts.push("Музыканты на сцене, но молчат. Попросите их сыграть — они не откажут.");
  if (LAST_DRINK && !SEAT.on) opts.push(LAST_DRINK.custom ? `Ваш «${LAST_DRINK.name}» я записал в блокнот. Хороший рецепт.` : `Как вам «${LAST_DRINK.name}»? Если что — повторю.`);
  if (FRIENDS.on && Object.keys(FRIENDS.peers).length > 1) opts.push("Сегодня людно. Люблю, когда за стойкой разговаривают.");
  if (typeof HALLOWEEN !== "undefined" && HALLOWEEN) opts.push("Счастливого Хэллоуина. Тыквы горят до самого закрытия.");
  if (!LAST_DRINK && MIND.quietSince && NOW - MIND.quietSince > 150000) opts.push("Вы давно смотрите на полки. Садитесь — подберу что-нибудь под настроение.");
  // редкие реплики: раз в несколько вечеров
  if (Math.random() < .04) opts.push("Знаете, за этой стойкой однажды сделали предложение руки и сердца. Ответ был «да». Коктейль — «Френч 75».", "Говорят, ночью кот из курилки проверяет, все ли бутылки на месте. Пока ни одной не пропало.");
  const fresh = opts.filter(o => !MIND.said.has(o));
  return fresh.length ? pickLine(fresh) : null;
}
/* приветствие: первый раз — знакомство, повторно — узнаёт и помнит, что вы пьёте */
function greetGuest() {
  if (MIND.greeted) return;
  MIND.greeted = true;
  const name = myGuestName(), fav = favDrink(), st = btState();
  let text;
  if (PROG.visits <= 1) text = `Добрый вечер${name ? ", " + name : ""}! Впервые у нас? Садитесь за стойку — подберу коктейль по настроению.`;
  else if (fav) text = `С возвращением${name ? ", " + name : ""}! Снова «${fav.name}»? Или сегодня попробуем что-то новое?`;
  else text = `С возвращением${name ? ", " + name : ""}! Рад видеть.`;
  if (st === "tired") text += " Правда, вы к самому закрытию.";
  setTimeout(() => btLine(text, 6, true), 1200);
}
setInterval(() => {
  if (!started || STREET.on) return;
  if (curZone === 1 && !MIND.greeted && !busy) greetGuest();
  MIND.state = btState();
  if (curZone === 1 && !LAST_DRINK && !SEAT.on && !busy) { if (!MIND.quietSince) MIND.quietSince = NOW; } else MIND.quietSince = 0;
  if (curZone !== 1 || busy || SEAT.on || BT.busy || mixDlg.open) return;
  if (NOW - MIND.lastLine > 75000 && Math.random() < .5) btLine(ambientLine());
}, 15000);

/* необычные действия гостя */
for (const root of HOT) {
  const h = root.userData.hot;
  if (h.zone !== 1 || !DRINKS.some(d => d.name === h.label)) continue;
  const base = h.act;
  h.act = () => {
    MIND.bottles = MIND.bottles.filter(t => NOW - t < 12000); MIND.bottles.push(NOW);
    base();
    if (MIND.bottles.length === 4) setTimeout(() => btLine("Вы как будто проводите инвентаризацию. Все на месте, честное слово.", 5, true), 2500);
  };
}
mixDlg.addEventListener("close", () => {
  MIND.menuOpens = MIND.menuOpens.filter(t => NOW - t < 30000); MIND.menuOpens.push(NOW);
  if (MIND.menuOpens.length === 4 && !busy) btLine("Не можете выбрать? Садитесь за стойку — помогу.", 5, true);
});
/* реакция на ингредиенты в шейкере: после паузы, по делу и не на каждое нажатие */
mixDlg.addEventListener("click", e => {
  if (!e.target.closest("[data-ing]")) return;
  MIND.mixT = NOW;
  clearTimeout(MIND.mixTO);
  MIND.mixTO = setTimeout(mixComment, 1700);
});
function mixComment() {
  const set = [...inShaker].sort(), key = set.join("+");
  if (!set.length || key === MIND.mixKey || NOW - MIND.mixSaid < 9000 || !mixDlg.open) return;
  MIND.mixKey = key;
  const has = i => set.includes(i);
  const known = COCKTAILS.find(c => !c.custom && c.need.length === set.length && c.need.every(i => has(i)));
  const almostSecret = SECRETS.find(s => !FOUND.has(s.id) && s.need.length === set.length + 1 && set.every(i => s.need.includes(i)));
  let text = null;
  if (known) text = `«${known.name}» — узнаю. Жмите «Смешать».`;
  else if (almostSecret && set.length >= 2) text = "Хм… кажется, я догадываюсь, к чему вы ведёте. Не хватает самой малости.";
  else if (set.length >= 6) text = "Многовато для одного бокала. Я бы оставил три-четыре — вкус будет чище.";
  else if (has("coconut") && (has("tonic") || has("soda") || has("cola"))) text = "Сливки с газировкой могут расслоиться. Лучше возьмите сок.";
  else if (has("campari") && !has("vermouthR") && !has("syrup") && !has("oj")) text = "Кампари горчит. Ему нужен друг — красный вермут или апельсин.";
  else if (has("wine") && has("cola")) text = "Вино с колой? В Стране басков вас бы поняли.";
  else if (set.every(i => ["lime", "lemon", "syrup", "mint", "soda", "tonic", "grenadine"].includes(i)) && set.length >= 2) text = "Без крепкого — это лимонад. Тоже хороший выбор.";
  if (text) { MIND.mixSaid = NOW; MIND.lastLine = NOW; say(bt, text, 5); }
}
/* после погреба */
onTick(() => {
  if (typeof CEL !== "undefined" && CEL.on) MIND.wasCellar = true;
  else if (MIND.wasCellar && curZone === 1 && !busy) { MIND.wasCellar = false; setTimeout(() => btLine("Вы были внизу? Тогда вы знаете о нас больше, чем говорите.", 5, true), 2500); }
});
Object.assign(H3D, { mind: MIND, btState, ambientLine });
