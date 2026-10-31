/* ================= настоящая погода в Алматы за окнами и на улице =================
   Open-Meteo (бесплатно, без ключа). Обновляется каждые 15 минут; без интернета — погода по сезону.
   Проверить любую погоду: ?wx=rain | snow | storm | clear | fog */
const WX_CITY = { name: "Алматы", lat: 43.2389, lon: 76.8897, tz: "Asia/Almaty" };
const WX_NOW = { ok: false, temp: null, code: null, wind: 0, label: "" };
function wxLabel(code) {
  if (code === 0) return "ясно";
  if (code <= 2) return "небольшая облачность";
  if (code === 3) return "пасмурно";
  if (code === 45 || code === 48) return "туман";
  if (code >= 51 && code <= 57) return "морось";
  if (code >= 61 && code <= 67) return code >= 65 ? "ливень" : "дождь";
  if (code >= 71 && code <= 77) return code >= 75 ? "сильный снег" : "снег";
  if (code >= 80 && code <= 82) return "ливень";
  if (code >= 85 && code <= 86) return "снегопад";
  if (code >= 95) return "гроза";
  return "облачно";
}
function weatherLine() {
  if (!WX_NOW.ok) return "";
  const t = Math.round(WX_NOW.temp), sign = t > 0 ? "+" : t < 0 ? "−" : "";
  return `${WX_CITY.name}, ${sign}${Math.abs(t)}°, ${WX_NOW.label}.`;
}
/* погода → дождь, снег, звёзды, иней, звуки */
function applyWeather(code, temp, wind) {
  const rain = code >= 51 && code <= 57 ? .35 : code === 61 ? .5 : code === 63 ? .75 : code >= 64 && code <= 67 ? 1 : code >= 80 && code <= 82 ? .85 : code >= 95 ? 1 : 0;
  const snow = code === 71 || code === 77 ? .45 : code === 73 ? .7 : code === 75 ? 1 : code >= 85 && code <= 86 ? .85 : 0;
  const stars = code === 0 ? 1 : code === 1 ? .7 : code === 2 ? .35 : 0;
  const fog = code === 45 || code === 48;
  Object.assign(WEATHER, {
    rain, snow, stars: fog ? 0 : stars, storm: code >= 95, frost: temp < -1 ? 1 : temp < 2 ? .4 : 0,
    leaves: SEASON === "autumn" && !snow ? (wind > 14 ? 1 : .45) : 0
  });
  const u = rainMat.uniforms;
  for (const [k, v] of [["uRain", WEATHER.rain], ["uSnow", WEATHER.snow], ["uStars", WEATHER.stars], ["uLeaves", WEATHER.leaves], ["uFrost", WEATHER.frost]]) tween(u[k], { value: v }, 3);
  Music.weather({ rain: rain * .34, wind: Math.min(.55, wind / 45) + (snow ? .1 : 0), crickets: SEASON === "summer" && !rain && temp > 15 ? .35 : 0, fire: temp < 12 ? .55 : SEASON === "summer" ? 0 : .4 });
  // улица: капли, снежинки или сухо
  const P = PREC;
  P.snow = snow > 0;
  P.active = Math.round(P.N * (snow ? Math.max(.35, snow) : rain ? Math.max(.3, rain) : 0));
  P.g.setDrawRange(0, P.active * 2);
  P.lines.material.color.setHex(P.snow ? 0xffffff : 0xb8c8e8);
  P.lines.material.opacity = P.snow ? .8 : .33;
  P.rings.count = !P.snow && rain ? Math.round(P.RN * Math.max(.4, rain)) : 0;
  // подзаголовок читальни: что сейчас за окном
  const outside = snow ? "снег" : code >= 95 ? "гроза" : rain >= .8 ? "ливень" : rain ? "дождь" : code === 45 || code === 48 ? "туман" : stars > .5 ? "звёзды" : "ночной город";
  ZONES[0].sub = `Книги до потолка, ${outside} за окном`;
  if (curZone === 0 && !SEAT.on) subEl.textContent = ZONES[0].sub;
  // подпись у окна читальни
  const h = HOT.find(o => o.userData.hot.zone === 0 && /^Окно/.test(o.userData.hot.label));
  if (h) { h.userData.hot.label = `Окно: ${WX_NOW.label}, ${Math.round(temp) > 0 ? "+" : ""}${Math.round(temp)}°`; if (h.userData.chip) h.userData.chip.textContent = h.userData.hot.label; }
}
async function fetchWeather() {
  const force = QS.get("wx");
  if (force) {
    const code = { rain: 63, snow: 73, storm: 95, clear: 0, fog: 45, drizzle: 53 }[force] ?? 3;
    Object.assign(WX_NOW, { ok: true, code, temp: force === "snow" ? -6 : 9, wind: 8, label: wxLabel(code) });
    applyWeather(code, WX_NOW.temp, 8);
    return;
  }
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${WX_CITY.lat}&longitude=${WX_CITY.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=sunset&forecast_days=1&timezone=${encodeURIComponent(WX_CITY.tz)}`;
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json(), c = j.current;
    Object.assign(WX_NOW, { ok: true, code: c.weather_code, temp: c.temperature_2m, wind: c.wind_speed_10m, label: wxLabel(c.weather_code) });
    const ss = j.daily && j.daily.sunset && j.daily.sunset[0];
    if (ss) { const [hh, mm] = ss.slice(11, 16).split(":").map(Number); SUN.set = hh + mm / 60; }
    applyWeather(WX_NOW.code, WX_NOW.temp, WX_NOW.wind);
    applyTime();
  } catch (e) {
    console.info("погода недоступна, остаётся сезонная:", e.message);
  }
}
fetchWeather();
setInterval(fetchWeather, 15 * 60 * 1000);
Object.assign(H3D, { weather: WX_NOW, applyWeather });
