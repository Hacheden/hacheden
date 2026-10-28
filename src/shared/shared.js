/* ---------- формы бутылок ---------- */
  const SHAPES = {
    bordeaux: { d: "M25 14H35V62C35 76 52 80 52 104V186Q52 194 44 194H16Q8 194 8 186V104C8 80 25 76 25 62Z", neck: [25, 35], top: 14, body: [8, 44] },
    squat:    { d: "M24 24H36V50C36 58 54 62 54 90V184Q54 194 44 194H16Q6 194 6 184V90C6 62 24 58 24 50Z", neck: [24, 36], top: 24, body: [6, 48] },
    tall:     { d: "M24 22H36V60C36 68 50 70 50 84V186Q50 194 42 194H18Q10 194 10 186V84C10 70 24 68 24 60Z", neck: [24, 36], top: 22, body: [10, 40] },
    flask:    { d: "M23 18H37V44C37 52 54 54 54 70V186Q54 194 46 194H14Q6 194 6 186V70C6 54 23 52 23 44Z", neck: [23, 37], top: 18, body: [6, 48] },
    square:   { d: "M24 20H36V52L50 62V186Q50 194 42 194H18Q10 194 10 186V62L24 52Z", neck: [24, 36], top: 20, body: [10, 40] },
    round:    { d: "M25 20H35V44C35 52 50 56 50 76V186Q50 194 42 194H18Q10 194 10 186V76C10 56 25 52 25 44Z", neck: [25, 35], top: 20, body: [10, 40] }
  };

  /* ---------- напитки ---------- */
  const DRINKS = [
    {
      id: "wine", name: "Вино", shape: "bordeaux", cap: "#4a0f1c",
      glass: "#1f2c1d", glassOp: .96, liquid: "#4a0d1e", liquidOp: .5, level: 54,
      labelBg: "#eadcbc", labelInk: "#4a0f1c", labelY: 120, labelH: 50,
      cup: "wine", pour: "#6b1228", pourLevel: 42, glassLabel: "Бокал красного вина",
      tagline: "Напиток из сброженного виноградного сока",
      facts: [["Родина", "Закавказье"], ["Крепость", "9–15%"], ["Подача", "красное 16–18 °C, белое 8–12 °C"]],
      history: "Вино — один из старейших напитков человечества. Следы виноделия возрастом около 8000 лет нашли в Грузии: виноград бродил там в больших глиняных сосудах, квеври, которые закапывали в землю. Позже вино разнесли по Средиземноморью финикийцы, греки и римляне, а в Средние века виноделие сохраняли монастыри Европы.",
      ingredients: [["Виноград", "сок, кожица и иногда косточки: от них зависят цвет и вкус"], ["Дрожжи", "превращают сахар винограда в спирт"], ["Время", "вино выдерживают в бочках, квеври или стальных чанах"]],
      serve: "Красное подают при 16–18 °C, белое и розовое охлаждают до 8–12 °C. Бокал наполняют не больше чем на треть, чтобы аромат раскрылся."
    },
    {
      id: "cognac", name: "Коньяк", shape: "squat", cap: "#2a1a10",
      glass: "#2a1a0e", glassOp: .96, liquid: "#a85a14", liquidOp: .75, level: 44,
      labelBg: "#1b1210", labelInk: "#e2b866", labelY: 112, labelH: 52,
      cup: "snifter", pour: "#b8651a", pourLevel: 64, glassLabel: "Бокал-снифтер с коньяком",
      tagline: "Виноградный бренди из французского региона Коньяк",
      facts: [["Родина", "Франция"], ["Крепость", "от 40%"], ["Подача", "комнатная температура"]],
      history: "Название пришло от города Коньяк на западе Франции. В XVI–XVII веках голландские купцы скупали местное вино, а по распространённой версии начали перегонять его, чтобы оно не портилось в дороге и занимало меньше места на корабле. Оказалось, что дистиллят, постоявший в дубовых бочках, получается вкуснее самого вина. Так появился коньяк.",
      ingredients: [["Белый виноград", "чаще всего сорт юни блан"], ["Двойная перегонка", "в медных кубах, после неё получается спирт-сырец"], ["Дубовые бочки", "выдержка не меньше двух лет, лучшие коньяки стоят десятилетиями"], ["Купаж", "мастер смешивает спирты разных лет в один вкус"]],
      serve: "Коньяк подают в бокале-снифтере при комнатной температуре и без льда. Бокал согревают ладонью, и аромат раскрывается. Классическая пара — горький шоколад или кофе."
    },
    {
      id: "rum", name: "Ром", shape: "tall", cap: "#b98a55",
      glass: "#26150d", glassOp: .95, liquid: "#6d2f10", liquidOp: .8, level: 62,
      labelBg: "#8c2020", labelInk: "#f1e4cc", labelY: 110, labelH: 56,
      cup: "rocks", ice: true, pour: "#8a3f12", pourLevel: 70, glassLabel: "Стакан рома со льдом",
      tagline: "Крепкий напиток из сахарного тростника",
      facts: [["Родина", "Карибы"], ["Крепость", "37,5–50%"], ["Подача", "со льдом или в коктейле"]],
      history: "Ром появился в XVII веке на карибских плантациях: из патоки, отхода сахарного производства, начали гнать крепкий спирт. Его история тесно связана с колониальной торговлей и рабством. С 1740 года британский флот стал разбавлять ромовый паёк водой, и этот напиток назвали грогом.",
      ingredients: [["Патока или тростниковый сок", "основа, из которой получается сахар для брожения"], ["Вода и дрожжи", "запускают брожение"], ["Выдержка", "светлый ром выдерживают недолго, тёмный годами в бочках"]],
      serve: "Светлый ром — основа коктейлей: мохито, дайкири, пина колада. Выдержанный ром пьют чистым или со льдом, как виски."
    },
    {
      id: "whisky", name: "Виски", shape: "flask", cap: "#3b2a1d",
      glass: "#3a2410", glassOp: .9, liquid: "#c27a1a", liquidOp: .85, level: 56,
      labelBg: "#1f4034", labelInk: "#f1e4cc", labelY: 104, labelH: 60,
      cup: "rocks", ice: true, pour: "#c9831f", pourLevel: 70, glassLabel: "Стакан виски со льдом",
      tagline: "Зерновой дистиллят, выдержанный в дубовых бочках",
      facts: [["Родина", "Шотландия и Ирландия"], ["Крепость", "40–46% в бутылке"], ["Подача", "чистым, с водой или льдом"]],
      history: "Первое письменное упоминание шотландского виски датируется 1494 годом: в налоговых записях значится солод для монаха Джона Кора, из которого тот гнал aqua vitae, «воду жизни». Само слово «виски» восходит к гэльскому uisge beatha, что тоже значит «вода жизни». Долгие века это был домашний напиток, а в XIX веке виски начали делать в промышленных масштабах.",
      ingredients: [["Ячменный солод", "в других видах виски добавляют кукурузу, рожь или пшеницу"], ["Вода и дрожжи", "из них получается брага"], ["Перегонка", "в медных кубах, чаще дважды"], ["Дубовые бочки", "шотландский виски выдерживают минимум три года"]],
      serve: "Виски подают в стакане рокс. Его пьют чистым, с каплей воды, которая раскрывает аромат, или со льдом. Из виски делают коктейли олд фэшн и виски сауэр."
    },
    {
      id: "gin", name: "Джин", shape: "square", cap: "#c9ced1",
      glass: "#9cc4cf", glassOp: .35, liquid: "#d6e8ec", liquidOp: .35, level: 56,
      labelBg: "#20505c", labelInk: "#f1e4cc", labelY: 100, labelH: 60,
      cup: "highball", pour: "#cfe6ea", pourLevel: 48, pourOp: .55, garnish: "wheel", glassLabel: "Джин-тоник с долькой лайма",
      tagline: "Крепкий напиток с ароматом можжевельника",
      facts: [["Родина", "Нидерланды, Англия"], ["Крепость", "37,5–47%"], ["Подача", "с тоником и льдом"]],
      history: "Джин родился в Нидерландах в XVI–XVII веках как можжевеловая настойка, которую считали лекарством. Голландцы называли её женевер, от слова «можжевельник». Англичане упростили рецепт, и в XVIII веке джин стал самым дешёвым напитком Лондона: это время зовут «джиновой лихорадкой». Британцы в Индии пили хинный тоник от малярии и добавляли в него джин, так появился джин-тоник.",
      ingredients: [["Нейтральный зерновой спирт", "основа напитка"], ["Можжевельник", "главная нота, без него джин джином не считается"], ["Травы и специи", "кориандр, цедра цитрусов, корень дягиля, анис"]],
      serve: "Классика — джин-тоник в высоком стакане: одна часть джина на две-три части тоника, лёд и долька лайма. Из джина также делают мартини, негрони и «Том Коллинз»."
    },
    {
      id: "tequila", name: "Текила", shape: "round", cap: "#b07c48",
      glass: "#d8c48f", glassOp: .25, liquid: "#e8cf86", liquidOp: .55, level: 58,
      labelBg: "#3f6b2f", labelInk: "#f6efd8", labelY: 108, labelH: 58,
      cup: "shot", pour: "#e6cf85", pourLevel: 70, pourOp: .85, garnish: "wedge", glassLabel: "Рюмка текилы с долькой лайма",
      tagline: "Мексиканский напиток из голубой агавы",
      facts: [["Родина", "Мексика, Халиско"], ["Крепость", "35–55%, обычно 38–40%"], ["Подача", "в узкой рюмке"]],
      history: "Текилу делают вокруг города Текила в штате Халиско. Ещё ацтеки готовили из агавы слабый напиток пульке, а после прихода испанцев в XVI веке научились его перегонять. Одну из первых лицензий на промышленное производство получила семья Куэрво в конце XVIII века.",
      ingredients: [["Голубая агава", "сердцевину, пинью, запекают и отжимают сок"], ["Дрожжи и вода", "сок бродит, затем его перегоняют, чаще дважды"], ["Выдержка", "бланко не выдерживают, репосадо стоит от 2 до 12 месяцев, аньехо от года до трёх лет"]],
      serve: "Текилу подают в узкой рюмке. Выдержанную пьют небольшими глотками, без закуски. Популярный способ — с долькой лайма и солью. Из текилы делают маргариту и «Текила санрайз»."
    }
  ];
  const ROWS = [["wine", "cognac", "rum"], ["whisky", "gin", "tequila"]];

  /* ---------- история из газеты ---------- */
  const STORY = {
    name: "Сухой закон и спикизи",
    tagline: "Как выглядели подпольные бары Америки",
    facts: [["Годы", "1920–1933"], ["Страна", "США"]],
    sections: [
      ["Что произошло", "С января 1920 года в США запретили производство, продажу и перевозку алкоголя. Поправку к конституции приняли в 1919 году, а отменили её только в 1933-м, когда вступила в силу 21-я поправка."],
      ["Спикизи", "Пить не перестали, бары просто ушли в подполье. Их называли спикизи, от английского speakeasy. По одной из версий, название пришло от привычки говорить тихо, чтобы не привлечь полицию. Попасть внутрь можно было по паролю, особому стуку или рекомендации знакомого."],
      ["Коктейли", "Качество нелегального алкоголя часто было плохим, поэтому его смешивали с соками, сиропами и травами. Считается, что именно в эти годы коктейли стали по-настоящему популярны."]
    ]
  };

  
/* ---------- рисуем бокал для карточки ---------- */
  const ICE = `<g transform="rotate(-8 52 80)"><rect x="40" y="66" width="26" height="26" rx="5" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.4)"/></g>
               <g transform="rotate(10 72 88)"><rect x="62" y="78" width="24" height="24" rx="5" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.4)"/></g>`;
  const GLASSES = {
    wine: {
      body: "M32 12H88C90 56 80 84 60 86C40 84 30 56 32 12Z",
      before: `<rect x="58" y="86" width="4" height="58" fill="rgba(255,235,200,.35)"/><ellipse cx="60" cy="148" rx="26" ry="5" fill="rgba(255,235,200,.22)" stroke="rgba(255,235,200,.5)"/>`,
      shine: "M38 24C38 48 44 66 52 74", after: ""
    },
    snifter: {
      body: "M44 18C14 34 12 82 40 96C52 102 68 102 80 96C108 82 106 34 76 18Z",
      before: `<rect x="58" y="100" width="4" height="34" fill="rgba(255,235,200,.35)"/><ellipse cx="60" cy="142" rx="28" ry="5" fill="rgba(255,235,200,.22)" stroke="rgba(255,235,200,.5)"/>`,
      shine: "M30 40C24 58 28 76 38 86", after: ""
    },
    rocks: {
      body: "M24 40H96L90 130Q89 140 79 140H41Q31 140 30 130Z", before: "",
      shine: "M32 52L35 124", after: ""
    },
    highball: {
      body: "M38 16H82L78 140Q77 150 68 150H52Q43 150 42 140Z", before: "",
      shine: "M45 28L47 130",
      after: `<g transform="rotate(-6 52 70)"><rect x="46" y="58" width="22" height="22" rx="4" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.4)"/></g>
              <g transform="rotate(8 66 104)"><rect x="56" y="94" width="20" height="20" rx="4" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.4)"/></g>
              <g fill="#fff" fill-opacity=".5"><circle cx="52" cy="118" r="1.6"/><circle cx="70" cy="92" r="1.4"/><circle cx="60" cy="132" r="1.8"/><circle cx="72" cy="124" r="1.3"/></g>`,
      gx: 84, gy: 17
    },
    shot: {
      body: "M42 54H78L74 134Q73 142 65 142H55Q47 142 46 134Z", before: "",
      shine: "M50 70L52 124", after: "", gx: 70, gy: 40
    },
    coupe: {
      body: "M24 34H96Q94 72 60 76Q26 72 24 34Z",
      before: `<rect x="58" y="74" width="4" height="62" fill="rgba(255,235,200,.35)"/><ellipse cx="60" cy="140" rx="24" ry="5" fill="rgba(255,235,200,.22)" stroke="rgba(255,235,200,.5)"/>`,
      shine: "M32 42Q36 60 48 68", after: "", gx: 92, gy: 34
    },
    martini: {
      body: "M20 26H100L62 80H58Z",
      before: `<rect x="58" y="78" width="4" height="58" fill="rgba(255,235,200,.35)"/><ellipse cx="60" cy="140" rx="24" ry="5" fill="rgba(255,235,200,.22)" stroke="rgba(255,235,200,.5)"/>`,
      shine: "M30 32L52 62", after: "", gx: 94, gy: 26, ox: 60, oy: 46
    }
  };
  GLASSES.wine.gx = 86; GLASSES.wine.gy = 14;
  GLASSES.snifter.gx = 80; GLASSES.snifter.gy = 22;
  GLASSES.rocks.gx = 92; GLASSES.rocks.gy = 40;
  const GARNISH = {
    wheel: `<circle r="15" fill="#8fb12f"/><circle r="12.5" fill="#d3e57c"/><path d="M0 0L0 -12.5M0 0L10.8 -6.2M0 0L10.8 6.2M0 0L0 12.5M0 0L-10.8 6.2M0 0L-10.8 -6.2" stroke="#8fb12f" stroke-width="1.2"/><circle r="2" fill="#8fb12f"/>`,
    wedge: `<path d="M0 14C6 -4 30 -2 34 18C26 8 12 8 0 14Z" fill="#8fb12f"/><path d="M4 14C9 2 26 2 29 15C22 9 12 9 4 14Z" fill="#d3e57c"/>`,
    orange: `<circle r="14" fill="#e98a1a"/><circle r="11.5" fill="#f6b54a"/><path d="M0 0L0 -11.5M0 0L10 -5.7M0 0L10 5.7M0 0L0 11.5M0 0L-10 5.7M0 0L-10 -5.7" stroke="#e98a1a" stroke-width="1.2"/>`,
    lemon: `<path d="M-14 -2C-6 -14 6 8 16 -4" stroke="#f2d14a" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    mint: `<g transform="translate(0 9)"><path d="M0 0C-10 -6 -12 -18 -4 -24C2 -16 4 -6 0 0Z" fill="#3f8f3a"/><path d="M2 -2C10 -10 20 -10 24 -4C16 0 8 2 2 -2Z" fill="#4fa548"/><path d="M-2 -2C-12 -6 -20 -2 -22 4C-14 6 -6 4 -2 -2Z" fill="#357d31"/></g>`,
    cherry: `<path d="M0 -4C4 -14 10 -20 16 -24" stroke="#5a3a1a" stroke-width="1.6" fill="none"/><circle r="7" fill="#a3122a"/><circle cx="-2.5" cy="-2.5" r="1.8" fill="#ff8a9a"/>`,
    pineapple: `<g transform="translate(0 12)"><path d="M-12 2L12 2L0 -16Z" fill="#f2c94c"/><path d="M0 -16L-6 -27M0 -16V-29M0 -16L6 -27" stroke="#3f8f3a" stroke-width="3" stroke-linecap="round"/></g>`,
    olive: `<path d="M-16 -22L12 20" stroke="#c9b48a" stroke-width="1.6"/><ellipse cy="4" rx="6.5" ry="8.5" fill="#7a8a2a"/><circle cy="0" r="2.2" fill="#b3263e"/>`
  };
  function glassSVG(d, opt = {}) {
    const g = GLASSES[d.cup], id = (opt.pre || "pour-") + d.id;
    const pour = opt.still ? "" : ' class="pour"', late = opt.still ? "" : ' class="late"';
    const grad = d.grad ? `<linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="${d.grad[0]}"/><stop offset="1" stop-color="${d.grad[1]}"/></linearGradient>` : "";
    const fill = d.grad ? `url(#${id}-g)` : d.pour;
    const garnish = d.garnish
      ? `<g transform="translate(${d.garnish === "olive" && g.ox ? g.ox + " " + g.oy : g.gx + " " + g.gy})">${GARNISH[d.garnish]}</g>` : "";
    return `<svg viewBox="0 0 120 170" role="img" aria-label="${d.glassLabel}">
      <defs><clipPath id="${id}"><path d="${g.body}"/></clipPath>${grad}</defs>
      ${g.before}
      <path d="${g.body}" fill="rgba(255,255,255,.06)"/>
      <g clip-path="url(#${id})"><rect${pour} x="0" y="${d.pourLevel}" width="120" height="170" fill="${fill}" fill-opacity="${d.pourOp || .9}"/></g>
      <g${late}>${d.ice ? ICE : ""}</g>
      <path d="${g.body}" fill="none" stroke="rgba(255,235,200,.6)" stroke-width="1.5"/>
      <path d="${g.shine}" stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g${late}>${g.after}${garnish}</g>
    </svg>`;
  }

  
/* ---------- карточка ---------- */
  const dlg = document.getElementById("card");
  function cardHTML(d) {
    const head = `<div class="close-wrap"><button class="close" type="button" aria-label="Закрыть" data-close>×</button></div>`;
    const facts = `<dl class="facts">${d.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
    if (d.recipe) {
      return head + `<div class="card-inner">
        <div class="stage">${glassSVG(d)}</div>
        <h2 class="title" id="card-title">${d.name}</h2>
        <p class="tagline">${d.tagline}</p>
        ${facts}
        <h3>История</h3>
        <p>${d.history}</p>
        <h3>Рецепт</h3>
        <ul class="recipe">${d.recipe.map(([a, b]) => `<li><b>${a}</b> ${b}</li>`).join("")}</ul>
        <h3>Как готовить</h3>
        <p>${d.steps}</p>
      </div>`;
    }
    if (d.sections) {
      return head + `<div class="card-inner">
        <h2 class="title" id="card-title">${d.name}</h2>
        <p class="tagline">${d.tagline}</p>
        ${facts}
        ${d.sections.map(([h, t]) => `<h3>${h}</h3><p>${t}</p>`).join("")}
      </div>`;
    }
    return head + `<div class="card-inner">
      <div class="stage">${glassSVG(d)}</div>
      <h2 class="title" id="card-title">${d.name}</h2>
      <p class="tagline">${d.tagline}</p>
      ${facts}
      <h3>История</h3>
      <p>${d.history}</p>
      <h3>Из чего делают</h3>
      <ul>${d.ingredients.map(([b, t]) => `<li><b>${b}.</b> ${t}</li>`).join("")}</ul>
      <h3>Как подают</h3>
      <p>${d.serve}</p>
    </div>`;
  }
  function openCard(d) {
    dlg.innerHTML = cardHTML(d);
    dlg.showModal();
    dlg.scrollTop = 0;
    dlg.querySelectorAll(".card-inner > *").forEach((el, i) => { el.style.animationDelay = (0.2 + i * 0.07) + "s"; });
  }
  dlg.addEventListener("click", e => {
    if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
  });

  
/* ---------- музыка: сочиняется прямо в браузере, чужих треков нет ---------- */
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const CHORDS = [
    { root: 38, notes: [53, 57, 60, 64] },  // Dm9
    { root: 43, notes: [53, 57, 59, 64] },  // G13
    { root: 36, notes: [52, 55, 59, 62] },  // Cmaj9
    { root: 45, notes: [55, 59, 60, 64] }   // Am9
  ];
  const MELODY = [72, 74, 76, 79, 81, 84];

  function createBand(ctx, out) {
    const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // электропиано: основной тон и два тихих обертона
    function keys(m, t, dur, vel) {
      const f = mtof(m), g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vel, t + .012);
      g.gain.exponentialRampToValueAtTime(vel * .35, t + .45);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      [[1, 1], [2, .16], [3, .04]].forEach(([mul, amp]) => {
        const o = ctx.createOscillator(), og = ctx.createGain();
        o.frequency.value = f * mul;
        o.detune.value = (Math.random() - .5) * 6;
        og.gain.value = amp;
        o.connect(og).connect(g);
        o.start(t); o.stop(t + dur + .05);
      });
      g.connect(out);
    }
    function chord(c, t, dur, vel) {
      c.notes.forEach((n, i) => keys(n, t + i * .018 + Math.random() * .01, dur, vel * (1 - i * .08)));
    }
    function bass(m, t, dur) {
      const o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = "triangle"; o.frequency.value = mtof(m);
      lp.type = "lowpass"; lp.frequency.value = 380;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.2, t + .02);
      g.gain.exponentialRampToValueAtTime(.06, t + dur * .6);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(lp).connect(g).connect(out);
      o.start(t); o.stop(t + dur + .05);
    }
    function brush(t, v) {
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; f.type = "bandpass"; f.frequency.value = 6500; f.Q.value = .6;
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(.0001, t + .16);
      s.connect(f).connect(g).connect(out);
      s.start(t, Math.random() * .7, .2);
    }
    function kick(t, v) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(95, t);
      o.frequency.exponentialRampToValueAtTime(42, t + .14);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(.0001, t + .32);
      o.connect(g).connect(out);
      o.start(t); o.stop(t + .35);
    }
    // треск пластинки
    function crackle() {
      const len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * .004;
        if (Math.random() < .0006) d[i] += (Math.random() * 2 - 1) * .5;
      }
      const s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = b; s.loop = true;
      hp.type = "highpass"; hp.frequency.value = 1200;
      g.gain.value = .18;
      s.connect(hp).connect(g).connect(out);
      s.start();
      return s;
    }
    // один шаг — восьмая доля; аккорд меняется каждые два такта
    function play(step, t, beat) {
      const k = step % 16, pos = step % 8, ci = Math.floor(step / 16) % 4;
      const c = CHORDS[ci], next = CHORDS[(ci + 1) % 4];
      if (k === 0) chord(c, t, 3.4, .06);
      if (k === 6 && Math.random() < .5) chord(c, t, 1.6, .035);
      if (k === 11) chord(c, t, 2.2, .045);
      if (pos === 0) bass(c.root, t, beat * 1.8);
      if (pos === 4) bass(Math.random() < .6 ? c.root + 7 : c.root + 12, t, beat * 1.6);
      if (k === 15 && Math.random() < .5) bass(next.root + (Math.random() < .5 ? 1 : -1), t, beat * .45);
      if (pos === 0) kick(t, .16);
      if (pos === 5 && Math.random() < .3) kick(t, .09);
      if (pos === 2 || pos === 6) brush(t, .045);
      else if (Math.random() < .55) brush(t, .012 + Math.random() * .01);
      if (k !== 0 && Math.random() < .09) keys(MELODY[Math.floor(Math.random() * MELODY.length)], t, 1.4, .03);
    }
    return { play, crackle };
  }

  const Music = (() => {
    const BEAT = 60 / 68, EIGHTH = BEAT / 2;
    let ctx = null, tone, master, band, timer = null, nextTime = 0, step = 0, on = false, roomIdx = 1, anchor = 0, sfx = null, fire = null, rain = null, crick = null, wind = null;
    // погода за окном: громкость дождя, сверчков, ветра и камина; меняется по сезону
    const WX = { rain: .32, crickets: 0, wind: 0, fire: .5 };
    // погоду слышно у окна читальни (0) и громче всего на улице (3)
    const outside = () => roomIdx === 0 ? 1 : roomIdx === 3 ? 1.8 : 0;
    const roomFreq = () => roomIdx === 1 ? 3400 : roomIdx === 3 ? 420 : 950;   // в соседних комнатах музыка звучит глуше, как из-за стены
    function impulse(sec) {
      const len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = b.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      return b;
    }
    function setup() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = roomFreq(); tone.Q.value = .4;
      const dry = ctx.createGain(); dry.gain.value = .8;
      const wet = ctx.createGain(); wet.gain.value = .32;
      const verb = ctx.createConvolver(); verb.buffer = impulse(2.6);
      const comp = ctx.createDynamicsCompressor();
      tone.connect(dry).connect(master);
      tone.connect(wet).connect(verb).connect(master);
      master.connect(comp).connect(ctx.destination);
      band = createBand(ctx, tone);
      band.crackle();
      // треск камина: слышен только в курилке
      fire = ctx.createGain(); fire.gain.value = roomIdx === 2 ? WX.fire : 0;
      const fb = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), fd = fb.getChannelData(0);
      let env = 0;
      for (let i = 0; i < fd.length; i++) {
        if (Math.random() < .0009) env = .35 + Math.random() * .6;
        env *= .985;
        fd[i] = (Math.random() * 2 - 1) * (env + .012);
      }
      const fsrc = ctx.createBufferSource(), flp = ctx.createBiquadFilter();
      fsrc.buffer = fb; fsrc.loop = true; flp.type = "lowpass"; flp.frequency.value = 3200;
      fsrc.connect(flp).connect(fire).connect(master); fsrc.start();
      // дождь за окном читальни
      rain = ctx.createGain(); rain.gain.value = outside() * WX.rain;
      const rb = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate), rd = rb.getChannelData(0);
      for (let i = 0; i < rd.length; i++) rd[i] = (Math.random() * 2 - 1) * (Math.random() < .002 ? .5 : .07);
      const rsrc = ctx.createBufferSource(), rbp = ctx.createBiquadFilter();
      rsrc.buffer = rb; rsrc.loop = true; rbp.type = "bandpass"; rbp.frequency.value = 2400; rbp.Q.value = .5;
      rsrc.connect(rbp).connect(rain).connect(master); rsrc.start();
      // сверчки летней ночью
      crick = ctx.createGain(); crick.gain.value = outside() * WX.crickets;
      const cb = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), cd = cb.getChannelData(0), sr = ctx.sampleRate;
      for (const [f, per, off, amp] of [[4400, .62, .05, .5], [4950, .81, .31, .35], [3900, 1.13, .6, .25]]) {
        for (let t0 = off; t0 < 3.9; t0 += per) for (let k = 0; k < 3; k++) {
          const st = Math.floor((t0 + k * .045) * sr), n = Math.floor(.022 * sr);
          for (let i = 0; i < n && st + i < cd.length; i++) cd[st + i] += Math.sin(2 * Math.PI * f * i / sr) * Math.sin(Math.PI * i / n) * amp;
        }
      }
      const csrc = ctx.createBufferSource(); csrc.buffer = cb; csrc.loop = true;
      csrc.connect(crick).connect(master); csrc.start();
      // зимний ветер
      wind = ctx.createGain(); wind.gain.value = outside() * WX.wind;
      const wb = ctx.createBuffer(1, ctx.sampleRate * 8, ctx.sampleRate), wd = wb.getChannelData(0);
      let lp = 0;
      for (let i = 0; i < wd.length; i++) { lp = lp * .995 + (Math.random() * 2 - 1) * .005; const k = i / wd.length; wd[i] = lp * 9 * (.55 + .45 * Math.sin(k * Math.PI * 2 * 2 + Math.sin(k * 9))); }
      const wsrc = ctx.createBufferSource(); wsrc.buffer = wb; wsrc.loop = true;
      wsrc.connect(wind).connect(master); wsrc.start();
      return true;
    }
    function tick() {
      while (nextTime < ctx.currentTime + .2) {
        band.play(step, nextTime, BEAT);
        nextTime += step % 2 === 0 ? EIGHTH * 1.25 : EIGHTH * .75;   // свинг
        step++;
      }
    }
    function run() {
      nextTime = ctx.currentTime + .1;
      anchor = nextTime - (Math.floor(step / 2) * BEAT + (step % 2 ? EIGHTH * 1.25 : 0));
      clearInterval(timer);
      timer = setInterval(tick, 40);
    }
    function start() {
      if (!ctx && !setup()) return false;
      on = true;
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(.75, ctx.currentTime, .8);
      run();
      return true;
    }
    function stop() {
      on = false;
      if (!ctx) return;
      clearInterval(timer); timer = null;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, .4);
      setTimeout(() => { if (!on) ctx.suspend(); }, 1800);
    }
    function room(i) {
      roomIdx = i;
      if (ctx) {
        tone.frequency.setTargetAtTime(roomFreq(), ctx.currentTime, .5);
        fire.gain.setTargetAtTime(roomIdx === 2 ? WX.fire : 0, ctx.currentTime, .6);
        rain.gain.setTargetAtTime(outside() * WX.rain, ctx.currentTime, .6);
        crick.gain.setTargetAtTime(outside() * WX.crickets, ctx.currentTime, .6);
        wind.gain.setTargetAtTime(outside() * WX.wind, ctx.currentTime, .6);
      }
    }
    function weather(o) { Object.assign(WX, o); room(roomIdx); }
    document.addEventListener("visibilitychange", () => {
      if (!ctx || !on) return;
      if (document.hidden) { clearInterval(timer); ctx.suspend(); }
      else ctx.resume().then(run);
    });
    // где мы внутри доли: 0 — сильная доля, бармен кивает
    function beat() {
      if (!ctx || !on || ctx.state !== "running") return null;
      return (((ctx.currentTime - anchor) / BEAT) % 1 + 1) % 1;
    }
    // лёд в шейкере
    function shake(ms) {
      if (!ctx || !on) return;
      if (!sfx) {
        sfx = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .2), ctx.sampleRate);
        const d = sfx.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const t0 = ctx.currentTime + .05, n = Math.floor(ms / 120);
      for (let i = 0; i < n; i++) {
        const t = t0 + i * .12 + (Math.random() - .5) * .015, v = i % 2 ? .05 : .08;
        const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = sfx; f.type = "bandpass"; f.frequency.value = 3800 + Math.random() * 1200; f.Q.value = 1.2;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(v, t + .01);
        g.gain.exponentialRampToValueAtTime(.0001, t + .09);
        src.connect(f).connect(g).connect(master);
        src.start(t, Math.random() * .08, .1);
      }
    }
    // далёкий раскат грома
    function thunder() {
      if (!ctx || !on) return;
      const len = ctx.sampleRate * 3.2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
      let v = 0;
      for (let i = 0; i < len; i++) {
        v = v * .985 + (Math.random() * 2 - 1) * .15;
        const k = i / len;
        d[i] = v * Math.min(1, k * 14) * Math.pow(1 - k, 1.6) * (1 + .6 * Math.sin(k * 23));
      }
      const src = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = b; lp.type = "lowpass"; lp.frequency.value = 260; g.gain.value = 1.4;
      src.connect(lp).connect(g).connect(master); src.start();
    }
    return { start, stop, room, weather, beat, shake, thunder, get on() { return on; } };
  })();

  const musicBtn = document.getElementById("music");
  function setMusic(want) {
    const ok = want ? Music.start() : (Music.stop(), true);
    if (!ok) return;
    const text = want ? "Выключить музыку" : "Включить музыку";
    musicBtn.classList.toggle("on", want);
    document.body.classList.toggle("music-on", want);
    musicBtn.setAttribute("aria-label", text);
    musicBtn.querySelector(".label").textContent = text;
    try { localStorage.setItem("hacheden-music", want ? "on" : "off"); } catch (e) {}
  }
  musicBtn.addEventListener("click", () => setMusic(!Music.on));
  let musicWasOn = false;
  try { musicWasOn = localStorage.getItem("hacheden-music") === "on"; } catch (e) {}
  if (musicWasOn) {
    // браузер разрешает звук только после действия человека: включаем при первом клике
    addEventListener("pointerdown", e => { if (!e.target.closest("#music, #sm-gramo, [data-act=gramo]") && !Music.on) setMusic(true); }, { once: true });
  }

  
  const DOOR_STORY = {
    name: "Три стука в дверь",
    tagline: "Как попадали в подпольный бар",
    facts: [["Годы", "1920–1933"], ["Страна", "США"]],
    sections: [
      ["Условный стук и пароль", "Вход в спикизи часто выглядел как дверь склада, прачечной или обычного подъезда. Гость стучал условным стуком, в двери открывалось окошко, и охранник спрашивал пароль или имя знакомого, который за гостя поручился."],
      ["Если нагрянет полиция", "Бары готовились к облавам: прятали бутылки в тайниках за стенами и под полом, а в некоторых заведениях запасы можно было быстро сбросить в потайной подвал или слив."],
      ["Что осталось до наших дней", "Традиция живёт и сейчас: многие современные бары прячут вход за неприметной дверью, телефонной будкой или книжным шкафом, а иногда просят назвать пароль."]
    ]
  };
  const JAZZ_STORY = {
    name: "Век джаза",
    tagline: "Письмо, забытое между книгами",
    facts: [["Время", "1920-е"], ["Где", "США и Европа"]],
    sections: [
      ["Откуда название", "Выражение «век джаза» прославил писатель Фрэнсис Скотт Фицджеральд: в 1922 году вышел его сборник рассказов «Сказки века джаза». Так стали называть всё десятилетие с его музыкой, танцами и вечеринками."],
      ["«Великий Гэтсби»", "В 1925 году Фицджеральд опубликовал роман «Великий Гэтсби». Его герой, как намекает автор, разбогател на подпольной торговле алкоголем, а пышные вечеринки в его особняке стали символом эпохи."],
      ["Музыка подпольных баров", "Во многих спикизи играл живой джаз. Под него танцевали, пили запрещённые коктейли и спорили о книгах до утра."]
    ]
  };
/* ---------- книга рецептов: перелистывается как настоящая ---------- */
  const Book = (() => {
    const bookDlg = document.getElementById("book"), stage = document.getElementById("book-stage");
    const L = document.getElementById("book-l"), R = document.getElementById("book-r"), pos = document.getElementById("book-pos");
    const prevB = bookDlg.querySelector('[data-turn="-1"]'), nextB = bookDlg.querySelector('[data-turn="1"]');
    const wide = matchMedia("(min-width: 760px)");
    const ORN = `<svg class="orn" viewBox="0 0 160 20" aria-hidden="true"><path d="M0 10H60M100 10H160" stroke="#a08a64"/><path d="M80 2L88 10L80 18L72 10Z" fill="#6b0f22"/><circle cx="64" cy="10" r="2" fill="#a08a64"/><circle cx="96" cy="10" r="2" fill="#a08a64"/></svg>`;
    let pages = [], i = 0, turning = false, n = 0;
    function build() {
      const first = 2;
      const toc = BASES.map(([base, title]) => {
        const list = COCKTAILS.filter(c => c.base === base);
        if (!list.length) return "";
        return `<p class="toc-h">${title}</p><ul class="toc">${list.map(c => {
          const k = COCKTAILS.indexOf(c), pg = first + k * 2;
          return `<li><button type="button" data-go="${pg}">${c.name}</button><span class="dots"></span><span>${pg + 1}</span></li>`;
        }).join("")}</ul>`;
      }).join("");
      pages = [
        `<div class="pg pg-title">${ORN}<div class="big">Hacheden</div><h3>Книга рецептов</h3>${ORN}
          <p class="tag">Шестнадцать классических коктейлей,<br>их истории и рецепты</p></div>`,
        `<div class="pg"><h2>Содержание</h2>${toc}</div>`
      ];
      COCKTAILS.forEach(c => {
        pages.push(`<div class="pg"><h2>${c.name}</h2><p class="tag">${c.tagline}</p>
          <div class="pg-glass">${glassSVG(c, { pre: "bk" + (n++) + "-", still: true })}</div>
          <dl>${c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
          <h3>История</h3><p>${c.history}</p></div>`);
        pages.push(`<div class="pg"><h3>Рецепт</h3><ul>${c.recipe.map(([a, b]) => `<li><b>${a}</b> ${b}</li>`).join("")}</ul>
          <h3>Как готовить</h3><p>${c.steps}</p>
          <button class="cook" type="button" data-cook="${c.id}">Приготовить у стойки</button></div>`);
      });
    }
    const page = k => pages[k] ? pages[k] + `<span class="pg-num">${k + 1}</span>` : "";
    const stepSize = () => wide.matches ? 2 : 1;
    function render() {
      if (wide.matches) { i -= i % 2; L.innerHTML = page(i); R.innerHTML = page(i + 1); }
      else { L.innerHTML = ""; R.innerHTML = page(i); }
      const st = stepSize();
      prevB.disabled = i <= 0;
      nextB.disabled = i + st >= pages.length;
      pos.textContent = wide.matches ? `${i + 1}–${Math.min(i + 2, pages.length)} из ${pages.length}` : `${i + 1} из ${pages.length}`;
    }
    let sctx = null;
    function rustle() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      sctx = sctx || new AC();
      sctx.resume();
      const len = sctx.sampleRate * .35, b = sctx.createBuffer(1, len, sctx.sampleRate), d = b.getChannelData(0);
      for (let j = 0; j < len; j++) { const k = j / len; d[j] = (Math.random() * 2 - 1) * Math.sin(Math.PI * k) * (.6 + .4 * Math.random()); }
      const s = sctx.createBufferSource(), f = sctx.createBiquadFilter(), g = sctx.createGain();
      s.buffer = b; f.type = "bandpass"; f.frequency.value = 3000; f.Q.value = .7; g.gain.value = .16;
      s.connect(f).connect(g).connect(sctx.destination); s.start();
    }
    function turn(dir, target) {
      if (turning) return;
      const st = stepSize();
      let ni = target != null ? target : i + dir * st;
      if (wide.matches) ni -= ni % 2;
      if (ni < 0 || ni >= pages.length || ni === i) return;
      dir = ni > i ? 1 : -1;
      if (reduceMotion.matches) { i = ni; render(); return; }
      turning = true;
      rustle();
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      if (wide.matches) {
        if (dir > 0) {
          leaf.innerHTML = `<div class="face r">${page(i + 1)}<div class="shade"></div></div><div class="face l" style="transform: rotateY(180deg)">${page(ni)}</div>`;
          R.innerHTML = page(ni + 1);
        } else {
          leaf.innerHTML = `<div class="face l">${page(i)}<div class="shade"></div></div><div class="face r" style="transform: rotateY(-180deg)">${page(ni + 1)}</div>`;
          L.innerHTML = page(ni);
        }
      } else {
        leaf.innerHTML = dir > 0 ? `<div class="face r">${page(i)}<div class="shade"></div></div>` : `<div class="face r">${page(ni)}</div>`;
        if (dir > 0) R.innerHTML = page(ni);
      }
      stage.appendChild(leaf);
      const faces = [...leaf.querySelectorAll(".face")];
      const deg = wide.matches ? (dir > 0 ? -180 : 180) : -180;
      const anims = faces.map(f => {
        const base = f.style.transform || "";
        const from = !wide.matches && dir < 0 ? `rotateY(-180deg)` : `${base}`;
        const to = !wide.matches && dir < 0 ? `rotateY(0deg)` : `${base} rotateY(${deg}deg)`;
        return f.animate([{ transform: from }, { transform: to }], { duration: 900, easing: "cubic-bezier(.45,.05,.25,1)", fill: "forwards" });
      });
      leaf.querySelectorAll(".shade").forEach(sh => sh.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 900 }));
      anims[0].finished.then(() => { i = ni; render(); leaf.remove(); turning = false; });
    }
    function open(at) {
      if (busy) return;
      if (!pages.length) build();
      if (at != null) i = at;
      render();
      bookDlg.showModal();
      nextB.focus();
    }
    bookDlg.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (e.target === bookDlg || (b && "bookClose" in b.dataset)) { bookDlg.close(); return; }
      if (!b) return;
      if (b.dataset.turn) turn(+b.dataset.turn);
      else if (b.dataset.go) turn(0, +b.dataset.go);
      else if (b.dataset.cook) {
        const id = b.dataset.cook;
        bookDlg.close();
        setRoom(1);
        setTimeout(() => makeCocktail(id), reduceMotion.matches ? 0 : 1300);
      }
    });
    bookDlg.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); turn(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); turn(-1); }
    });
    let tx = null;
    stage.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", e => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      tx = null;
      if (dx < -50) turn(1); else if (dx > 50) turn(-1);
    }, { passive: true });
    wide.addEventListener("change", () => { if (bookDlg.open) render(); });
    return { open, get isOpen() { return bookDlg.open; } };
  })();

  /* ================= крупный план: бармен готовит коктейль ================= */
  const Closeup = (() => {
    const NS = "http://www.w3.org/2000/svg";
    const $ = id => document.getElementById(id);
    const root = $("closeup"), svg = $("cu-svg"), camG = $("cu-cam");
    const LY = { fall: $("cu-fall"), ves: $("cu-ves"), hold: $("cu-hold"), arms: $("cu-arms") };
    const capBox = $("cu-cap"), capCount = $("cu-count"), capText = $("cu-text"), titleEl = $("cu-title"), skipBtn = $("cu-skip");
    const canvas = $("cu-bokeh"), bctx = canvas.getContext("2d");
    const E = (tag, attrs, parent) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    };
    const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
    const rnd = (a, b) => a + Math.random() * (b - a);
    const SPD = .76;                                   // общий темп: меньше — быстрее
    let uid = 0, alive = false, fast = false, raf = 0, S = null;
    const objs = new Set(), arms = new Set(), streams = new Set();
    let tweens = [], timers = [];

    /* ---------- движок: плавные переходы ---------- */
    const EZ = {
      io: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
      out: k => 1 - Math.pow(1 - k, 3),
      in: k => k * k * k,
      lin: k => k,
      sine: k => -(Math.cos(Math.PI * k) - 1) / 2,
      back: k => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); }
    };
    const CAM = { x: 600, y: 470, s: 1 };
    function to(o, props, dur, e = EZ.io) {
      return new Promise(res => {
        // новое движение того же свойства заменяет старое
        tweens = tweens.filter(t => {
          if (t.o !== o || !Object.keys(props).some(k => k in t.props)) return true;
          if (o !== CAM) Object.assign(o, t.props);
          t.res();
          return false;
        });
        if (fast || dur <= 0) { Object.assign(o, props); res(); return; }
        const from = {};
        for (const k in props) from[k] = o[k];
        tweens.push({ o, from, props, t0: performance.now(), dur: dur * SPD, e, res });
      });
    }
    function sleep(ms) { return new Promise(res => { if (fast) res(); else timers.push({ at: performance.now() + ms * SPD, res }); }); }
    function flush() {
      const tw = tweens, tm = timers;
      tweens = []; timers = [];
      tw.forEach(t => { Object.assign(t.o, t.props); t.res(); });
      tm.forEach(t => t.res());
    }
    // камера сама подбирает приближение, чтобы в кадр попало всё от top до bottom (и не меньше width по ширине)
    const VB = { x: 0, y: 0, w: 1200, h: 800, top: 80, bottom: 700 };
    function view(x, top, bottom, width = 380, ms = 850) {
      const s = Math.max(.8, Math.min(1.6, (VB.bottom - VB.top) / (bottom - top), VB.w * .92 / width));
      const mid = (VB.top + VB.bottom) / 2;
      return to(CAM, { x, y: (top + bottom) / 2 - (mid - CY) / s, s }, ms, EZ.sine);
    }

    /* ---------- объекты сцены ---------- */
    class Obj {
      constructor(parent, html = "", props = {}) {
        this.parent = parent instanceof Obj ? parent : null;
        this.g = E("g", {}, this.parent ? parent.g : parent);
        if (html) this.g.innerHTML = html;
        Object.assign(this, { x: 0, y: 0, r: 0, s: 1, o: 1 }, props);
        objs.add(this);
      }
      draw() {
        this.g.setAttribute("transform", `translate(${this.x.toFixed(2)} ${this.y.toFixed(2)}) rotate(${this.r.toFixed(2)}) scale(${this.s.toFixed(4)})`);
        this.g.setAttribute("opacity", Math.max(0, Math.min(1, this.o)).toFixed(3));
      }
      wp(lx, ly) {
        const a = this.r * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
        const px = this.x + (lx * c - ly * sn) * this.s, py = this.y + (lx * sn + ly * c) * this.s;
        return this.parent ? this.parent.wp(px, py) : [px, py];
      }
      kill() { this.g.remove(); objs.delete(this); }
    }

    // прозрачный сосуд: бокал или стакан для смешивания, с живой жидкостью
    class Vessel extends Obj {
      constructor(parent, shape, meta, s, top) {
        super(parent, "", { s });
        Object.assign(this, { shape, meta, top, frac: 0, cr: 240, cg: 240, cb: 240, alpha: .9, amp: 0, pouring: 0, fizz: 0, swirl: 0, sink: 0, salt: 0 });
        const id = "cuv" + (++uid);
        const inner = E("g", { transform: `translate(-60 ${-meta.base})` }, this.g);
        inner.innerHTML = `<defs><clipPath id="${id}"><path d="${shape.body}"/></clipPath>
            <linearGradient id="${id}s" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#a80f26"/><stop offset=".55" stop-color="#d42a3a" stop-opacity=".6"/><stop offset="1" stop-color="#e86a30" stop-opacity="0"/></linearGradient></defs>
          ${shape.before || ""}
          <path d="${shape.body}" fill="#fff" fill-opacity=".07"/>
          <g clip-path="url(#${id})"><g class="extra"></g><path class="liq"/><rect class="sink" x="0" width="120" height="0" fill="url(#${id}s)"/><g class="ice"></g><g class="fizz"></g></g>
          <path d="${shape.body}" fill="none" stroke="#fff0e8" stroke-opacity=".75" stroke-width="1.5"/>
          <path d="${shape.shine}" stroke="#fff" stroke-opacity=".42" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          ${shape.deco || ""}
          ${meta.rimX ? `<path class="salt" d="M${meta.rimX[0]} ${meta.rim + 1}H${meta.rimX[1]}" stroke="#f6f2ea" stroke-width="5" stroke-dasharray="1.6 1.3" stroke-linecap="round" opacity="0"/>` : ""}
          <g class="gar"></g>`;
        const q = c => inner.querySelector(c);
        this.liq = q(".liq"); this.sinkEl = q(".sink"); this.extra = q(".extra"); this.iceG = q(".ice");
        this.saltEl = q(".salt"); this.gar = q(".gar");
        this.cubes = []; this.leaves = [];
        this.bubbles = Array.from({ length: 18 }, (_, i) => E("circle", { r: (1 + (i % 4) * .45).toFixed(2), fill: "#fff", opacity: 0 }, q(".fizz")));
        [this.x0, this.x1] = meta.innerX;
      }
      level() { const m = this.meta; return m.bottom - this.frac * (m.bottom - this.top); }
      mouth() { return this.wp(0, this.meta.rim - this.meta.base); }
      surface() { return this.wp(0, (this.frac > .01 ? this.level() : this.meta.bottom - 4) - this.meta.base); }
      local(lx, ly) { return this.wp(lx - 60, ly - this.meta.base); }
      fill(d, hex, ms) {
        const nf = Math.min(1, this.frac + d), [r, g, b] = rgb(hex);
        if (this.frac < .005) { this.cr = r; this.cg = g; this.cb = b; }
        const w = nf > 0 ? (nf - this.frac) / nf : 1;
        this.pouring++;
        return to(this, { frac: nf, cr: this.cr + (r - this.cr) * w, cg: this.cg + (g - this.cg) * w, cb: this.cb + (b - this.cb) * w }, ms, EZ.lin)
          .then(() => { this.pouring = Math.max(0, this.pouring - 1); });
      }
      addCube(i, crushed, at) {
        const m = this.meta;
        const [x, y] = at || m.ice[i % m.ice.length];
        const size = crushed ? rnd(7, 11) : m.cube;
        const el = E("g", {}, this.iceG);
        el.innerHTML = crushed
          ? `<path d="M${-size / 2} ${-size / 3}L${size / 3} ${-size / 2}L${size / 2} ${size / 4}L${-size / 5} ${size / 2}Z" fill="#fff" fill-opacity=".5" stroke="#fff" stroke-opacity=".8" stroke-width=".8"/>`
          : `<rect x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" rx="${size * .22}" fill="#fff" fill-opacity=".22" stroke="#fff" stroke-opacity=".62" stroke-width="1.2"/><path d="M${-size * .3} ${-size * .26}L${size * .16} ${-size * .33}" stroke="#fff" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round"/>`;
        const cb = { el, x, y, r: rnd(-18, 18), dy: -12 };
        this.cubes.push(cb);
        to(cb, { dy: 0 }, 420, EZ.back);
        this.amp = Math.max(this.amp, 3);
      }
      addLeaf(x, y) {
        const el = E("g", {}, this.extra);
        el.innerHTML = MINT_LEAF;
        const lf = { el, x, y, r: rnd(0, 360), sq: 1 };
        el.setAttribute("transform", `translate(${x} ${y}) rotate(${lf.r}) scale(.85)`);
        this.leaves.push(lf);
      }
      draw(t) {
        super.draw();
        const m = this.meta, y = this.level();
        if (this.pouring > 0) this.amp = Math.max(this.amp, 2.4);
        if (this.frac > .004) {
          let d = `M-4 ${m.bottom + 12}`;
          for (let x = -4; x <= 124; x += 6) {
            const w = this.amp * Math.sin(x * .09 + t * .006) + this.amp * .45 * Math.sin(x * .05 - t * .0095);
            d += `L${x} ${(y + w).toFixed(2)}`;
          }
          this.liq.setAttribute("d", d + `L124 ${m.bottom + 12}Z`);
          this.liq.setAttribute("fill", `rgb(${this.cr | 0},${this.cg | 0},${this.cb | 0})`);
          this.liq.setAttribute("fill-opacity", this.alpha.toFixed(3));
        } else this.liq.setAttribute("d", "");
        this.amp *= .955;
        const sh = Math.max(0, this.sink * (m.bottom - y));
        this.sinkEl.setAttribute("y", (m.bottom - sh).toFixed(1));
        this.sinkEl.setAttribute("height", sh.toFixed(1));
        const sw = this.swirl;
        this.cubes.forEach((cb, i) => {
          const ph = t * .0045 + i * 1.7;
          const fx = Math.sin(ph) * 9 * sw, fy = Math.cos(ph * .8) * 3 * sw + cb.dy + Math.sin(t * .002 + i) * .6;
          cb.el.setAttribute("transform", `translate(${(cb.x + fx).toFixed(1)} ${(cb.y + fy).toFixed(1)}) rotate(${(cb.r + Math.sin(ph) * 14 * sw).toFixed(1)})`);
        });
        this.leaves.forEach((lf, i) => {
          const fx = Math.sin(t * .004 + i * 2) * 6 * sw;
          lf.el.setAttribute("transform", `translate(${(lf.x + fx).toFixed(1)} ${lf.y.toFixed(1)}) rotate(${(lf.r + fx * 3).toFixed(1)}) scale(.85 ${(.85 * lf.sq).toFixed(3)})`);
        });
        const show = this.frac > .05 ? this.fizz : 0;
        this.bubbles.forEach((b, i) => {
          if (show < .02) { b.setAttribute("opacity", 0); return; }
          const ph = (t * .00028 * (1 + (i % 3) * .35) + i * .137) % 1;
          const bx = this.x0 + 6 + ((i * 37) % 100) / 100 * (this.x1 - this.x0 - 12) + Math.sin(t * .004 + i) * 1.5;
          b.setAttribute("cx", bx.toFixed(1));
          b.setAttribute("cy", (m.bottom - 3 - ph * (m.bottom - y - 3)).toFixed(1));
          b.setAttribute("opacity", (show * .6 * (1 - ph * .4)).toFixed(2));
        });
        if (this.saltEl) this.saltEl.setAttribute("opacity", this.salt.toFixed(2));
      }
    }

    // металлический шейкер: жидкости не видно, зато он покрывается инеем
    class Tin extends Obj {
      constructor(parent) { super(parent, TIN); this.frost = 0; this.fr = this.g.querySelector(".frost"); }
      draw(t) { super.draw(); this.fr.setAttribute("opacity", (this.frost * .42).toFixed(3)); }
      mouth() { return this.wp(0, 0); }
      surface() { return this.wp(0, 22); }
      fill() { return Promise.resolve(); }
    }
    class Jigger extends Obj {
      constructor(parent) { super(parent, JIGGER, { s: 1.25 }); this.frac = 0; this.col = "#ffffff"; this.jl = this.g.querySelector(".jl"); }
      draw(t) { super.draw(); this.jl.setAttribute("fill", this.col); this.jl.setAttribute("opacity", Math.min(1, this.frac * 1.5).toFixed(2)); }
      mouth() { return this.wp(0, 0); }
      surface() { return this.wp(0, 5); }
      fill(d, hex, ms) { this.col = hex; return to(this, { frac: 1 }, ms, EZ.lin); }
    }

    // рука бармена: кулак на предмете, предплечье и закатанный рукав уходят за кадр
    const R_ANCHOR = [1540, -300], L_ANCHOR = [-340, -300];
    class Arm {
      constructor(obj, gx, gy, anchor) {
        Object.assign(this, { obj, gx, gy, ax: anchor[0], ay: anchor[1], pull: 0 });
        this.g = E("g", {}, LY.arms);
        this.g.innerHTML = `<path class="sl" fill="url(#cu-shirt)" stroke="#ff7890" stroke-opacity=".25"/><path class="cf" fill="#6b4c54"/><path class="fa" fill="url(#cu-skin)"/>
          <g class="fist"><ellipse rx="31" ry="26" fill="url(#cu-skin)"/>
            <path d="M14 -22Q27 -11 15 0Q27 11 14 22" stroke="#3c1e14" stroke-opacity=".45" stroke-width="2" fill="none"/>
            <path d="M-4 -25Q8 -27 16 -21M-6 -9Q8 -11 18 -6M-6 7Q8 5 18 9" stroke="#3c1e14" stroke-opacity=".35" stroke-width="1.6" fill="none"/>
            <ellipse cx="2" cy="-23" rx="15" ry="8" transform="rotate(14 2 -23)" fill="url(#cu-skin)" stroke="#3c1e14" stroke-opacity=".3"/></g>`;
        this.sl = this.g.querySelector(".sl"); this.cf = this.g.querySelector(".cf"); this.fa = this.g.querySelector(".fa"); this.fist = this.g.querySelector(".fist");
        arms.add(this);
      }
      draw() {
        const [gx, gy] = this.obj.wp(this.gx, this.gy);
        const x = gx + (this.ax - gx) * this.pull, y = gy + (this.ay - gy) * this.pull;
        const dx = this.ax - x, dy = this.ay - y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
        const P = (d, w) => `${(x + ux * d + nx * w).toFixed(1)} ${(y + uy * d + ny * w).toFixed(1)}`;
        const cut = 250;
        this.fa.setAttribute("d", `M${P(6, 20)}L${P(cut, 27)}L${P(cut, -27)}L${P(6, -20)}Z`);
        this.cf.setAttribute("d", `M${P(cut - 8, 31)}L${P(cut + 20, 33)}L${P(cut + 20, -33)}L${P(cut - 8, -31)}Z`);
        this.sl.setAttribute("d", `M${P(cut + 16, 34)}L${P(L + 80, 42)}L${P(L + 80, -42)}L${P(cut + 16, -34)}Z`);
        const ang = Math.atan2(-uy, -ux) * 180 / Math.PI;
        this.fist.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
      }
      kill() { this.g.remove(); arms.delete(this); }
    }
    const grab = (obj, gx, gy, side = "R") => new Arm(obj, gx, gy, side === "R" ? R_ANCHOR : L_ANCHOR);

    // струя жидкости с брызгами
    class Stream {
      constructor(col, w) {
        this.el = E("path", { fill: "none", stroke: col, "stroke-linecap": "round", "stroke-opacity": .92, pathLength: 1 }, LY.fall);
        Object.assign(this, { w, head: 0, tail: 0 });
        this.drops = [0, 1, 2].map(() => E("circle", { r: 2.2, fill: col, opacity: 0 }, LY.fall));
        streams.add(this);
      }
      draw(t) {
        const [x1, y1] = this.src(), [x2, y2] = this.dst();
        const wob = Math.sin(t * .03) * .8;
        const cx = x1 * .35 + x2 * .65, cy = y1 + (y2 - y1) * .12;
        this.el.setAttribute("d", `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${(x2 + wob).toFixed(1)} ${y2.toFixed(1)}`);
        this.el.setAttribute("stroke-width", (this.w * (1 - this.tail * .5)).toFixed(2));
        this.el.setAttribute("stroke-dasharray", `${Math.max(0, this.head - this.tail).toFixed(3)} 2`);
        this.el.setAttribute("stroke-dashoffset", (-this.tail).toFixed(3));
        const on = this.head > .95 && this.tail < .2;
        this.drops.forEach((d, i) => {
          if (!on) { d.setAttribute("opacity", 0); return; }
          const a = t * .02 + i * 2.1;
          d.setAttribute("cx", (x2 + Math.sin(a) * 9).toFixed(1));
          d.setAttribute("cy", (y2 - Math.abs(Math.cos(a * 1.3)) * 10).toFixed(1));
          d.setAttribute("opacity", .75);
        });
      }
      kill() { this.el.remove(); this.drops.forEach(d => d.remove()); streams.delete(this); }
    }
    async function pour(src, dst, col, ms, w = 6) {
      const s = new Stream(col, w);
      s.src = src; s.dst = () => dst.surface();
      await to(s, { head: 1 }, 150, EZ.in);
      await sleep(ms);
      await to(s, { tail: 1 }, 170, EZ.in);
      s.kill();
    }
    function drip([x, y], v, col) {
      const d = new Obj(LY.fall, `<ellipse rx="3" ry="4.6" fill="${col}"/>`, { x, y });
      const [tx, ty] = v.surface();
      to(d, { x: tx + rnd(-6, 6) }, 380, EZ.lin);
      return to(d, { y: ty }, 380, EZ.in).then(() => { d.kill(); v.amp = Math.max(v.amp || 0, 2); });
    }

    /* ---------- барный инвентарь ---------- */
    const TIN = `<path d="M-54 0H54L42 228Q41 236 32 236H-32Q-41 236 -42 228Z" fill="url(#cu-metal)"/>
      <path class="frost" d="M-54 0H54L42 228Q41 236 32 236H-32Q-41 236 -42 228Z" fill="#f4f8fb" opacity="0"/>
      <ellipse cx="0" cy="0" rx="54" ry="9" fill="#25282c" stroke="#e6eaee" stroke-width="2"/>
      <path d="M-36 16L-30 220" stroke="#fff" stroke-opacity=".38" stroke-width="6" stroke-linecap="round"/>
      <path d="M-50 40H50M-46 200H46" stroke="#5e646b" stroke-opacity=".5" stroke-width="2"/>`;
    const CAP = `<path d="M-55 0H55L48 -64Q44 -82 26 -86H-26Q-44 -82 -48 -64Z" fill="url(#cu-metal)"/>
      <rect x="-16" y="-104" width="32" height="20" rx="6" fill="url(#cu-metal)"/>
      <path d="M-38 -10L-32 -60" stroke="#fff" stroke-opacity=".38" stroke-width="5" stroke-linecap="round"/>`;
    const STRAINER = `<ellipse cx="0" cy="0" rx="52" ry="9" fill="#c9ced3" stroke="#8d939a"/>
      <path d="M-44 6q4 8 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0" stroke="#aeb4ba" stroke-width="3" fill="none"/>
      <rect x="44" y="-5" width="74" height="10" rx="5" fill="#c9ced3"/>`;
    const JIGGER = `<path d="M-24 0H24L8 48H-8Z" fill="url(#cu-metal)"/><rect x="-9" y="47" width="18" height="6" fill="#9aa1a8"/>
      <path d="M-8 52H8L22 100H-22Z" fill="url(#cu-metal)"/>
      <ellipse cx="0" cy="0" rx="24" ry="4.5" fill="#33363b" stroke="#e6eaee" stroke-width="1.5"/>
      <ellipse class="jl" cx="0" cy="1.5" rx="21" ry="3.4" opacity="0"/>`;
    const SCOOP = `<path d="M-150 -30H-22Q-6 -30 -6 0Q-6 30 -22 30H-150Q-162 0 -150 -30Z" fill="url(#cu-metal)"/>
      <rect x="-8" y="-9" width="78" height="18" rx="8" fill="#2a1a12"/>
      <g class="sc" fill="#fff" fill-opacity=".45" stroke="#fff" stroke-opacity=".8">
        <rect x="-142" y="-44" width="28" height="28" rx="6"/><rect x="-112" y="-50" width="28" height="28" rx="6"/><rect x="-82" y="-42" width="28" height="28" rx="6"/></g>`;
    const SPOON = `<path d="M0 0V344" stroke="#d4d8dc" stroke-width="4"/>
      <path d="M-2 20L2 34L-2 48L2 62L-2 76L2 90L-2 104L2 118L-2 132L2 146" stroke="#9aa0a5" stroke-width="2" fill="none"/>
      <ellipse cx="0" cy="354" rx="9" ry="14" fill="#d4d8dc"/><circle cx="0" cy="-4" r="7" fill="#d4d8dc"/>`;
    const MUDDLER = `<rect x="-9" y="0" width="18" height="250" rx="8" fill="#6b4126"/><rect x="-12" y="236" width="24" height="46" rx="9" fill="#5a331d"/>
      <path d="M-4 12V228" stroke="#ffdcb4" stroke-opacity=".25" stroke-width="3"/>`;
    const MINT_LEAF = `<path d="M0 -10C7 -6 7 6 0 10C-7 6 -7 -6 0 -10Z" fill="#4fa548"/><path d="M0 -9V9" stroke="#2f6f2a" stroke-width=".8"/>`;
    const MINT_BUNCH = `<path d="M0 0V40" stroke="#3f7a2a" stroke-width="3"/><g transform="translate(-8 4) rotate(-30) scale(1.6)">${MINT_LEAF}</g>
      <g transform="translate(9 10) rotate(35) scale(1.6)">${MINT_LEAF}</g><g transform="translate(-6 24) rotate(-20) scale(1.5)">${MINT_LEAF}</g><g transform="translate(8 30) rotate(25) scale(1.4)">${MINT_LEAF}</g>`;

    const MIXER_SHAPE = {
      body: "M14 10H106L100 150Q99 160 89 160H31Q21 160 20 150Z",
      shine: "M24 22L30 146",
      deco: `<path d="M14 10H106" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><path d="M14 10Q8 4 6 12" stroke="#fff0e8" stroke-opacity=".7" stroke-width="1.5" fill="none"/>
        <g stroke="#fff" stroke-opacity=".12" stroke-width="1.5"><path d="M40 20V150M60 20V152M80 20V150"/></g>`
    };
    const MIXER_META = { base: 160, bottom: 158, rim: 10, innerX: [16, 104], cube: 26, ice: [[40, 140], [66, 142], [90, 138], [50, 116], [78, 118], [62, 94], [40, 92], [86, 94]] };
    const CUP = {
      highball: { base: 150, bottom: 150, rim: 16, innerX: [38, 82], rimX: [38, 82], cube: 19, ice: [[52, 136], [68, 130], [50, 114], [66, 108], [56, 90], [70, 84], [50, 66], [64, 60]] },
      rocks: { base: 140, bottom: 140, rim: 40, innerX: [24, 96], rimX: [24, 96], cube: 27, ice: [[46, 122], [74, 120], [60, 100], [44, 98], [76, 96]] },
      coupe: { base: 145, bottom: 76, rim: 34, innerX: [24, 96], rimX: [24, 96], cube: 0, ice: [] },
      martini: { base: 145, bottom: 80, rim: 26, innerX: [20, 100], rimX: [20, 100], cube: 0, ice: [] },
      wine: { base: 153, bottom: 86, rim: 12, innerX: [32, 88], rimX: [32, 88], cube: 18, ice: [[50, 74], [68, 70], [58, 54]] },
      shot: { base: 142, bottom: 142, rim: 54, innerX: [42, 78], rimX: [42, 78], cube: 0, ice: [] }
    };
    const CAP_ML = { highball: 165, rocks: 90, coupe: 150, martini: 130, wine: 210, shot: 60 };   // лёд занимает часть бокала

    const LOOK = {
      rum: { kind: "spirit", glass: "#3a2414", liq: "#efe3c4", label: "#efe6d2", ink: "#3a1a0e", name: "РОМ" },
      tequila: { kind: "spirit", glass: "#d9caa0", op: .45, liq: "#f0e2b0", label: "#3f6b2f", ink: "#f6efd8", name: "ТЕКИЛА" },
      gin: { kind: "square", glass: "#9cc4cf", op: .4, liq: "#eaf4f6", label: "#20505c", ink: "#f1e4cc", name: "ДЖИН" },
      whisky: { kind: "flask", glass: "#3a2410", liq: "#c27a1a", label: "#1f4034", ink: "#f1e4cc", name: "ВИСКИ" },
      cognac: { kind: "squat", glass: "#2a1a0e", liq: "#b8651a", label: "#1b1210", ink: "#e2b866", name: "КОНЬЯК" },
      wine: { kind: "wine", glass: "#1f2c1d", liq: "#6b0f24", label: "#eadcbc", ink: "#4a0f1c", name: "ВИНО" },
      triple: { kind: "squat", glass: "#c9752a", op: .8, liq: "#f3e9c8", label: "#2a1a10", ink: "#f2b25a", name: "ЛИКЁР" },
      campari: { kind: "spirit", glass: "#b3122e", op: .85, liq: "#c8102e", label: "#f1e4cc", ink: "#8a0c22", name: "КАМПАРИ" },
      vermouthR: { kind: "wine", glass: "#3a0f10", liq: "#7a1a14", label: "#e8d9b8", ink: "#5a0f12", name: "ВЕРМУТ" },
      vermouthD: { kind: "wine", glass: "#2a3a26", liq: "#eeecc8", label: "#e8d9b8", ink: "#2a3a26", name: "СУХОЙ" },
      bitters: { kind: "dash", glass: "#3a1a0c", liq: "#5a1a0c", label: "#f2e8cf", ink: "#7a1a10", name: "БИТТЕР" },
      tonic: { kind: "soda", glass: "#cfe6ea", op: .45, liq: "#eef6f6", label: "#d8b04a", ink: "#2a1a10", name: "ТОНИК" },
      soda: { kind: "soda", glass: "#d6eef2", op: .45, liq: "#f2f8fa", label: "#2f6f8a", ink: "#f1f6f8", name: "СОДОВАЯ" },
      cola: { kind: "soda", glass: "#2a0f06", op: .92, liq: "#2a0f06", label: "#b3122a", ink: "#f8eee6", name: "КОЛА" },
      oj: { kind: "carafe", glass: "#ffffff", op: .16, liq: "#f39a1e", name: "" },
      pineapple: { kind: "carafe", glass: "#ffffff", op: .16, liq: "#f2d36a", name: "" },
      coconut: { kind: "squeeze", glass: "#f4eee2", op: .95, liq: "#f7f2e6", label: "#5a3a22", ink: "#f7f2e6", name: "КОКОС" },
      lime: { kind: "squeeze", glass: "#ffffff", op: .25, liq: "#d9e8a0", label: "#8fb12f", ink: "#1a2a0a", name: "ЛАЙМ" },
      lemon: { kind: "squeeze", glass: "#ffffff", op: .25, liq: "#f2e48a", label: "#e8c832", ink: "#2a2208", name: "ЛИМОН" },
      syrup: { kind: "squeeze", glass: "#ffffff", op: .3, liq: "#f6efd8", label: "#e8dcc0", ink: "#4a3a22", name: "СИРОП" },
      grenadine: { kind: "squeeze", glass: "#b3122a", op: .85, liq: "#b3122a", label: "#f2e8cf", ink: "#8a0c22", name: "ГРЕНАДИН" }
    };
    // горлышко в точке (0,0), корпус уходит вниз
    const BOTTLE = {
      spirit: { d: "M-11 0H11V88C11 104 44 112 44 140V312Q44 322 34 322H-34Q-44 322 -44 312V140C-44 112 -11 104 -11 88Z", label: [176, 92], w: 80, grip: 232 },
      square: { d: "M-11 0H11V70L42 100V312Q42 322 32 322H-32Q-42 322 -42 312V100L-11 70Z", label: [164, 104], w: 76, grip: 222 },
      flask: { d: "M-12 0H12V56C12 76 50 80 50 108V310Q50 322 38 322H-38Q-50 322 -50 310V108C-50 80 -12 76 -12 56Z", label: [152, 116], w: 88, grip: 222 },
      squat: { d: "M-11 0H11V48C11 62 52 70 52 112V250Q52 262 40 262H-40Q-52 262 -52 250V112C-52 70 -11 62 -11 48Z", label: [130, 88], w: 92, grip: 190 },
      wine: { d: "M-10 0H10V100C10 122 38 128 38 160V320Q38 330 28 330H-28Q-38 330 -38 320V160C-38 128 -10 122 -10 100Z", label: [204, 86], w: 68, grip: 252 },
      dash: { d: "M-6 0H6V18C6 26 26 28 26 44V124Q26 132 18 132H-18Q-26 132 -26 124V44C-26 28 -6 26 -6 18Z", label: [52, 64], w: 46, grip: 92 },
      soda: { d: "M-9 0H9V40C9 60 32 66 32 92V226Q32 236 22 236H-22Q-32 236 -32 226V92C-32 66 -9 60 -9 40Z", label: [118, 58], w: 58, grip: 160 },
      squeeze: { d: "M-4 0H4L9 28H-9ZM-30 34H30Q34 34 34 40V176Q34 184 26 184H-26Q-34 184 -34 176V40Q-34 34 -30 34Z", label: [82, 60], w: 62, grip: 124 },
      carafe: { d: "M-16 0Q-6 7 6 0H16V40C16 54 46 64 46 100V196Q46 206 36 206H-36Q-46 206 -46 196V100C-46 64 -16 54 -16 40Z", label: null, w: 0, grip: 132 }
    };
    function bottleHTML(look) {
      const b = BOTTLE[look.kind], id = "cub" + (++uid), op = look.op == null ? .95 : look.op;
      let h = `<defs><clipPath id="${id}"><path d="${b.d}"/></clipPath></defs>
        <path d="${b.d}" fill="${look.glass}" fill-opacity="${op}" stroke="#ffebe0" stroke-opacity=".35" stroke-width="1.5"/>
        <rect x="-60" y="${b.grip - 70}" width="120" height="400" fill="${look.liq}" fill-opacity="${op < .6 ? .78 : .3}" clip-path="url(#${id})"/>
        <rect x="-30" y="${b.grip - 90}" width="6" height="150" rx="3" fill="#fff" fill-opacity=".2" clip-path="url(#${id})"/>`;
      if (b.label && look.name) {
        const fs = Math.min(16, (b.w - 10) / (look.name.length * .62));
        h += `<rect x="${-b.w / 2}" y="${b.label[0]}" width="${b.w}" height="${b.label[1]}" rx="3" fill="${look.label}"/>
          <rect x="${-b.w / 2 + 4}" y="${b.label[0] + 5}" width="${b.w - 8}" height="1.2" fill="${look.ink}" opacity=".6"/>
          <rect x="${-b.w / 2 + 4}" y="${b.label[0] + b.label[1] - 6}" width="${b.w - 8}" height="1.2" fill="${look.ink}" opacity=".6"/>
          <text x="0" y="${b.label[0] + b.label[1] / 2 + fs * .36}" text-anchor="middle" font-family="Forum, Georgia, serif" font-size="${fs.toFixed(1)}" letter-spacing=".5" fill="${look.ink}">${look.name}</text>`;
      }
      if (look.kind !== "squeeze" && look.kind !== "carafe") h += `<rect x="-6" y="-16" width="12" height="18" rx="3" fill="#c9ced3"/><path d="M-3 -16L3 -26H6L1 -16Z" fill="#c9ced3"/>`;
      return h;
    }
    async function bottleIn(ing, at) {
      const look = LOOK[ing], spec = BOTTLE[look.kind];
      const B = new Obj(LY.hold, bottleHTML(look), { x: 1380, y: 40, r: -8, s: .9 });
      B.spec = spec;
      B.arm = grab(B, 0, spec.grip);
      const [x, y] = at();
      await to(B, { x: x + 150, y: y - 110, r: -55 }, 560, EZ.out);
      await to(B, { x, y, r: -122 }, 380, EZ.io);
      return B;
    }
    async function bottleOut(B) {
      await to(B, { x: B.x + 130, y: B.y - 90, r: -45 }, 360, EZ.io);
      await to(B, { x: 1400, y: 10, r: -5 }, 460, EZ.in);
      B.arm.kill(); B.kill();
    }
    const spout = B => () => B.wp(B.spec === BOTTLE.squeeze || B.spec === BOTTLE.carafe ? -4 : 2, -22);

    /* ---------- что делает бармен ---------- */
    const vessel = n => n === "tin" ? S.tin : n === "mixer" ? S.mixer : S.glass;
    function fracFor(v, ml) {
      if (v === S.glass) return Math.min(.92 - v.frac, ml / CAP_ML[S.c.cup]);
      if (v === S.mixer) return Math.min(.8 - v.frac, ml / 230);
      return 0;
    }
    const FIZZY = { tonic: 1, soda: 1, cola: 1 };
    const colorOf = c => { const [r, g, b] = rgb(c.pour); return { cr: r, cg: g, cb: b }; };

    const STEPS = {
      async ice([, tgt, crushed]) {
        const v = vessel(tgt), [mx, my] = v.mouth();
        view(mx + 50, my - 230, BASE + 30);
        const sc = new Obj(LY.hold, SCOOP, { x: 1380, y: 120 });
        const arm = grab(sc, 36, 0);
        await to(sc, { x: mx + 150, y: my - 200, r: -10 }, 620, EZ.out);
        await to(sc, { x: mx + 128, y: my - 176, r: -62 }, 320, EZ.io);
        sc.g.querySelector(".sc").setAttribute("opacity", 0);
        const lip = sc.wp(-150, 0);
        const n = crushed ? 22 : v instanceof Vessel ? v.meta.ice.length : 6;
        const falls = [];
        for (let i = 0; i < n; i++) falls.push(dropIce(v, i, !!crushed, lip, i * (crushed ? 28 : 75)));
        await Promise.all(falls);
        await to(sc, { x: 1400, y: 60, r: 0 }, 520, EZ.in);
        arm.kill(); sc.kill();
      },
      async jig([, ing, ml, tgt]) {
        const v = vessel(tgt || S.def), look = LOOK[ing], [mx, my] = v.mouth();
        view(mx + 70, my - 275, BASE + 30);
        if (!S.jig) {
          S.jig = new Jigger(LY.hold);
          Object.assign(S.jig, { x: -160, y: 160 });
          S.jigArm = grab(S.jig, 0, 50, "L");
        }
        const J = S.jig, home = { x: mx + 86, y: my - 150, r: 0 };
        const jin = to(J, home, 560, EZ.out);
        const B = await bottleIn(ing, () => [home.x + 34, home.y - 104]);
        await jin;
        const ms = 220 + ml * 11;
        J.fill(1, look.liq, ms + 150);
        await pour(spout(B), J, look.liq, ms);
        const out = bottleOut(B);
        await to(J, { x: mx + 30, y: my - 58, r: -128 }, 420, EZ.io);
        v.fill(fracFor(v, ml), look.liq, 520);
        to(J, { frac: 0 }, 420, EZ.lin);
        await pour(() => J.wp(-14, 2), v, look.liq, 300, 7);
        await to(J, home, 360, EZ.out);
        await out;
      },
      async pour([, ing, ml]) {
        const v = S.glass, look = LOOK[ing], [mx, my] = v.mouth();
        view(mx + 40, my - 190, BASE + 30);
        const B = await bottleIn(ing, () => [mx + 28, my - 86]);
        const ms = 300 + ml * 9;
        v.fill(fracFor(v, ml), look.liq, ms + 150);
        await pour(spout(B), v, look.liq, ms, 7);
        await bottleOut(B);
      },
      async top([, ing]) {
        const v = S.glass, look = LOOK[ing], [mx, my] = v.mouth();
        view(mx + 40, my - 180, BASE + 30);
        const B = await bottleIn(ing, () => [mx + 26, my - 80]);
        const ms = 1350;
        v.fill(1 - v.frac, look.liq, ms + 150);
        if (FIZZY[ing]) to(v, { fizz: 1 }, ms, EZ.lin);
        await pour(spout(B), v, look.liq, ms, 7);
        await bottleOut(B);
      },
      async dash([, ing, n, tgt]) {
        const v = vessel(tgt || S.def), look = LOOK[ing], [mx, my] = v.mouth();
        view(mx + 30, my - 200, BASE + 30);
        const B = new Obj(LY.hold, bottleHTML(look), { x: 1380, y: 60, r: -10 });
        B.arm = grab(B, 0, BOTTLE.dash.grip);
        await to(B, { x: mx + 8, y: my - 120, r: -172 }, 660, EZ.out);
        for (let i = 0; i < n; i++) {
          await to(B, { y: my - 94 }, 110, EZ.in);
          drip(B.wp(0, -6), v, look.liq);
          await to(B, { y: my - 120 }, 180, EZ.out);
        }
        await sleep(250);
        await to(B, { x: 1400, y: 20, r: -10 }, 560, EZ.in);
        B.arm.kill(); B.kill();
      },
      async leaves() {
        const v = S.glass, [mx, my] = v.mouth();
        view(mx + 20, my - 140, BASE + 30);
        const P = new Obj(LY.hold, MINT_BUNCH, { x: 1380, y: 160, r: 20, s: 1.6 });
        const arm = grab(P, 0, -8);
        await to(P, { x: mx + 20, y: my - 80, r: 0 }, 660, EZ.out);
        const falls = [0, 1, 2, 3, 4, 5].map(i => (async () => {
          await sleep(i * 120);
          const lf = new Obj(LY.fall, MINT_LEAF, { x: mx + 14 + rnd(-14, 14), y: my - 60, r: rnd(0, 360), s: v.s * .85 });
          const lx = rnd(v.x0 + 10, v.x1 - 10), ly = v.meta.bottom - rnd(8, 22);
          const [tx, ty] = v.local(lx, ly);
          to(lf, { x: tx, r: lf.r + 200 }, 720, EZ.out);
          await to(lf, { y: ty }, 720, EZ.in);
          lf.kill(); v.addLeaf(lx, ly);
        })());
        await Promise.all(falls);
        await to(P, { x: 1400, y: 120, r: 30 }, 520, EZ.in);
        arm.kill(); P.kill();
      },
      async muddle() {
        const v = S.glass, [bx, by] = v.local(60, v.meta.bottom - 6), len = 282;
        view(bx + 20, by - 350, BASE + 30);
        const M = new Obj(LY.hold, MUDDLER, { x: 1320, y: -60, r: 30 });
        const arm = grab(M, 0, 40);
        await to(M, { x: bx + 6, y: by - len - 50, r: 3 }, 660, EZ.out);
        for (let i = 0; i < 3; i++) {
          await to(M, { y: by - len, r: -2 }, 230, EZ.in);
          v.amp = 4;
          v.leaves.forEach(lf => { lf.sq = Math.max(.45, lf.sq - .18); });
          to(v, { x: v.x + (i % 2 ? 2 : -2) }, 60, EZ.lin).then(() => to(v, { x: S.gx }, 120, EZ.out));
          await to(M, { y: by - len - 36, r: 3 }, 260, EZ.out);
        }
        await to(M, { x: 1340, y: -100, r: 30 }, 560, EZ.in);
        arm.kill(); M.kill();
      },
      async squeeze() {
        const v = S.glass, [mx, my] = v.mouth();
        view(mx, my - 150, BASE + 30);
        const W = new Obj(LY.hold, GARNISH.wedge, { x: 1360, y: 140, r: -30, s: 2.2 });
        const arm = grab(W, 20, 4);
        await to(W, { x: mx - 30, y: my - 90, r: 12 }, 660, EZ.out);
        for (let i = 0; i < 2; i++) {
          await to(W, { s: 1.95, r: 6 }, 150, EZ.in);
          drip(W.wp(17, 14), v, "#e6f0b8"); drip(W.wp(12, 16), v, "#e6f0b8");
          await to(W, { s: 2.2, r: 12 }, 200, EZ.out);
        }
        await to(arm, { pull: 1 }, 320, EZ.in);
        arm.kill();
        const lx = 52, ly = v.meta.bottom - 26, [tx, ty] = v.local(lx, ly);
        to(W, { x: tx - 20, r: 70, s: 1.3 }, 520, EZ.out);
        await to(W, { y: ty - 10 }, 520, EZ.in);
        W.kill();
        const el = E("g", { transform: `translate(${lx - 16} ${ly - 8}) rotate(70 17 8) scale(.62)` }, v.extra);
        el.innerHTML = GARNISH.wedge;
        v.amp = 3.5;
      },
      async rim() {
        const v = S.glass, m = v.meta, p0 = v.local(m.rimX[0], m.rim), p1 = v.local(m.rimX[1], m.rim);
        view((p0[0] + p1[0]) / 2, p0[1] - 110, BASE + 30, 300);
        const W = new Obj(LY.hold, GARNISH.wedge, { x: 1360, y: 140, r: -20, s: 1.7 });
        const arm = grab(W, 20, 4);
        await to(W, { x: p0[0] - 20, y: p0[1] - 22, r: 0 }, 640, EZ.out);
        await to(W, { x: p1[0] - 40, y: p1[1] - 22 }, 720, EZ.sine);
        await to(W, { x: 1380, y: 120, r: -20 }, 480, EZ.in);
        arm.kill(); W.kill();
        const Pn = new Obj(LY.hold, `<circle r="7" fill="#f6f2ea"/><circle cx="-4" cy="-2" r="4" fill="#fff"/>`, { x: 1360, y: 100 });
        const a2 = grab(Pn, 0, -14);
        await to(Pn, { x: p0[0], y: p0[1] - 44 }, 600, EZ.out);
        to(v, { salt: 1 }, 900, EZ.lin);
        const mv = to(Pn, { x: p1[0], y: p1[1] - 44 }, 900, EZ.sine);
        const grains = [];
        for (let i = 0; i < 16; i++) grains.push((async () => {
          await sleep(i * 55);
          const gr = new Obj(LY.fall, `<rect width="3.2" height="3.2" fill="#fff"/>`, { x: Pn.x + rnd(-6, 6), y: Pn.y + 8 });
          await to(gr, { y: p0[1] + rnd(2, 10), o: .2 }, 260, EZ.in);
          gr.kill();
        })());
        await mv; await Promise.all(grains);
        await to(Pn, { x: 1380, y: 60 }, 500, EZ.in);
        a2.kill(); Pn.kill();
      },
      async float() {
        const v = S.glass, look = LOOK.grenadine, [mx, my] = v.mouth();
        view(mx + 20, my - 130, BASE + 30);
        const B = await bottleIn("grenadine", () => [mx + 30, my - 60]);
        const ms = 1500;
        to(v, { sink: .62, frac: Math.max(v.frac, .95) }, ms + 700, EZ.out);
        await pour(spout(B), { surface: () => v.local(80, v.level() + 3) }, look.liq, ms, 3.6);
        await bottleOut(B);
        await sleep(350);
      },
      async shake() {
        const R = S.rig, T = S.tin, C = S.cap, home = { x: R.x, y: R.y, r: 0 };
        view(R.x + 90, R.y - 360, BASE + 30, 520);
        Object.assign(C, { o: 1, y: -320 });
        const ca = grab(C, 0, -72);
        await to(C, { y: -6 }, 540, EZ.out);
        await to(C, { y: 0 }, 120, EZ.in);
        const ta = grab(T, 0, 168, "L");
        ta.pull = 1;
        await to(ta, { pull: 0 }, 380, EZ.out);
        view(640, 90, BASE + 30, 620, 700);
        await to(R, { x: 640, y: 300, r: -32 }, 640, EZ.io);
        Music.shake(2600);
        to(T, { frost: 1 }, 2600, EZ.lin);
        const ax = .53, ay = .85, A = 44;
        for (let i = 0; i < 9 && !fast; i++) {
          await to(R, { x: 640 + ax * A, y: 300 + ay * A, r: -28 }, 145, EZ.sine);
          await to(R, { x: 640 - ax * A, y: 300 - ay * A, r: -36 }, 145, EZ.sine);
        }
        T.frost = 1;
        view(R.x + 110, home.y - 160, BASE + 30, 520, 700);
        await to(R, home, 660, EZ.io);
        await to(ta, { pull: 1 }, 360, EZ.in); ta.kill();
        await to(C, { x: 520, y: -560, r: 20 }, 640, EZ.in); ca.kill();
        C.o = 0;
      },
      async stir() { await stirWith(S.mixer, 2300); },
      async stirIn() { to(S.glass, { frac: Math.max(S.glass.frac, .95) }, 1150, EZ.out); await stirWith(S.glass, 1150); },
      async strain() {
        const R = S.rig, v = S.glass, St = S.strainer, home = { x: R.x, y: R.y, r: 0 }, [gx, gy] = v.mouth();
        view((R.x + gx) / 2 + 40, gy - 220, BASE + 30, 520);
        Object.assign(St, { o: 1, y: -70 });
        await to(St, { y: -2 }, 320, EZ.out);
        const ra = S.tin ? grab(S.tin, 34, 110) : grab(S.mixer, 34, -100);
        ra.pull = 1;
        await to(ra, { pull: 0 }, 380, EZ.out);
        await to(R, { x: gx + (S.tin ? 40 : 60), y: gy - 76, r: -112 }, 740, EZ.io);
        Object.assign(v, colorOf(S.c));
        v.fill(1 - v.frac, S.c.pour, 1650);
        if (S.mixer) to(S.mixer, { frac: 0 }, 1500, EZ.lin);
        await pour(() => R.wp(S.lip[0], S.lip[1]), v, S.c.pour, 1350, 7.5);
        await to(R, home, 640, EZ.io);
        await to(ra, { pull: 1 }, 340, EZ.in); ra.kill();
        await to(St, { y: -90, o: 0 }, 300, EZ.in);
      },
      async garnish() {
        const v = S.glass, c = S.c, g = GLASSES[c.cup];
        const [lx, ly] = c.garnish === "olive" && g.ox ? [g.ox, g.oy] : [g.gx, g.gy];
        const [wx, wy] = v.local(lx, ly);
        view(wx - 30, wy - 130, Math.min(BASE + 30, wy + 300), 300);
        const P = new Obj(LY.hold, GARNISH[c.garnish], { x: 1340, y: 120, r: -40, s: v.s });
        const arm = grab(P, 4, -10);
        await to(P, { x: wx + 70, y: wy - 110, r: -12 }, 660, EZ.out);
        await to(P, { x: wx, y: wy - 10, r: 0 }, 400, EZ.io);
        await to(P, { y: wy }, 160, EZ.in);
        await to(arm, { pull: 1 }, 400, EZ.in);
        arm.kill(); P.kill();
        const el = E("g", { transform: `translate(${lx} ${ly})` }, v.gar);
        el.innerHTML = GARNISH[c.garnish];
        v.amp = Math.max(v.amp, 1.6);
      },
      async serve() {
        const v = S.glass, [, my] = v.mouth();
        view(v.x - 40, my - 90, BASE + 30 + 30, 420, 1000);
        v.amp = 1.4;
        await to(v, { y: v.y + 26, s: v.s * 1.07 }, 1000, EZ.io);
        await sleep(1300);
      }
    };
    async function dropIce(v, i, crushed, [lx, ly], delay) {
      await sleep(delay);
      const isV = v instanceof Vessel, s = isV ? v.s : 1.6;
      const size = (crushed ? 9 : isV ? v.meta.cube : 22) * s;
      const cube = new Obj(LY.fall, crushed
        ? `<path d="M${-size / 2} ${-size / 3}L${size / 3} ${-size / 2}L${size / 2} ${size / 4}L${-size / 5} ${size / 2}Z" fill="#fff" fill-opacity=".55" stroke="#fff" stroke-opacity=".8"/>`
        : `<rect x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" rx="${size * .22}" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-opacity=".7" stroke-width="1.6"/>`,
        { x: lx + rnd(-10, 10), y: ly, r: rnd(0, 40) });
      let at = null, tx, ty;
      if (isV && !crushed) [tx, ty] = v.local(...v.meta.ice[i % v.meta.ice.length]);
      else if (isV) { at = [rnd(v.x0 + 6, v.x1 - 6), v.meta.bottom - rnd(4, (v.meta.bottom - v.top) * .75)]; [tx, ty] = v.local(...at); }
      else { const [mx, my] = v.mouth(); tx = mx + rnd(-30, 30); ty = my + 80; }
      const d = 280 + Math.abs(ty - cube.y) * .85;
      to(cube, { x: tx, r: cube.r + rnd(60, 140) }, d, EZ.lin);
      await to(cube, { y: ty }, d, EZ.in);
      cube.kill();
      if (isV) v.addCube(i, crushed, at);
    }
    async function stirWith(v, ms) {
      const [bx, by] = v.local(66, v.meta.bottom - 16), top = by - 354;
      view(bx + 20, by - 400, BASE + 30);
      const sp = new Obj(LY.hold, SPOON, { x: 1330, y: -150, r: 20 });
      const arm = grab(sp, 0, 46);
      await to(sp, { x: bx + 12, y: top - 80, r: 4 }, 620, EZ.out);
      await to(sp, { y: top, r: 0 }, 340, EZ.io);
      to(v, { swirl: 1 }, 400, EZ.out);
      to(v, colorOf(S.c), ms, EZ.lin);
      const end = performance.now() + ms * SPD;
      while (!fast && performance.now() < end) {
        await to(sp, { x: bx + 16, r: -3 }, 190, EZ.sine);
        await to(sp, { x: bx - 8, r: 3 }, 190, EZ.sine);
      }
      to(v, { swirl: 0 }, 700, EZ.out);
      await to(sp, { y: top - 130, x: bx + 30, r: 10 }, 420, EZ.in);
      await to(sp, { x: 1340, y: -240, r: 20 }, 420, EZ.in);
      arm.kill(); sp.kill();
    }
    async function retireJigger() {
      await to(S.jig, { x: -180, y: 120, r: 20 }, 480, EZ.in);
      S.jigArm.kill(); S.jig.kill(); S.jig = null;
    }

    /* ---------- рецепты по шагам ---------- */
    const PROGRAMS = {
      "c-mojito": [["leaves"], ["jig", "lime", 20], ["jig", "syrup", 15], ["muddle"], ["ice", "glass", true], ["jig", "rum", 45], ["top", "soda"], ["stirIn"], ["garnish"]],
      "c-daiquiri": [["ice", "tin"], ["jig", "rum", 60], ["jig", "lime", 20], ["jig", "syrup", 15], ["shake"], ["strain"], ["garnish"]],
      "c-cubalibre": [["ice", "glass"], ["squeeze"], ["jig", "rum", 50], ["top", "cola"], ["stirIn"], ["garnish"]],
      "c-pinacolada": [["ice", "tin"], ["jig", "rum", 50], ["jig", "coconut", 30], ["jig", "pineapple", 50], ["shake"], ["ice", "glass"], ["strain"], ["garnish"]],
      "c-margarita": [["rim"], ["ice", "tin"], ["jig", "tequila", 50], ["jig", "triple", 20], ["jig", "lime", 15], ["shake"], ["strain"], ["garnish"]],
      "c-sunrise": [["ice", "glass"], ["jig", "tequila", 45], ["pour", "oj", 90], ["float"], ["garnish"]],
      "c-gintonic": [["ice", "glass"], ["jig", "gin", 50], ["top", "tonic"], ["squeeze"], ["stirIn"], ["garnish"]],
      "c-negroni": [["ice", "mixer"], ["jig", "gin", 30], ["jig", "campari", 30], ["jig", "vermouthR", 30], ["stir"], ["ice", "glass"], ["strain"], ["garnish"]],
      "c-martini": [["ice", "mixer"], ["jig", "gin", 60], ["jig", "vermouthD", 10], ["stir"], ["strain"], ["garnish"]],
      "c-collins": [["ice", "glass"], ["jig", "gin", 45], ["jig", "lemon", 30], ["jig", "syrup", 15], ["top", "soda"], ["stirIn"], ["garnish"]],
      "c-oldfashioned": [["jig", "syrup", 10, "glass"], ["dash", "bitters", 2, "glass"], ["ice", "glass"], ["jig", "whisky", 45, "glass"], ["stirIn"], ["garnish"]],
      "c-manhattan": [["ice", "mixer"], ["jig", "whisky", 50], ["jig", "vermouthR", 20], ["dash", "bitters", 1], ["stir"], ["strain"], ["garnish"]],
      "c-sour": [["ice", "tin"], ["jig", "whisky", 45], ["jig", "lemon", 25], ["jig", "syrup", 20], ["shake"], ["ice", "glass"], ["strain"], ["garnish"]],
      "c-sidecar": [["ice", "tin"], ["jig", "cognac", 50], ["jig", "triple", 20], ["jig", "lemon", 20], ["shake"], ["strain"], ["garnish"]],
      "c-sangria": [["ice", "glass"], ["pour", "wine", 150], ["pour", "oj", 50], ["top", "soda"], ["stirIn"], ["garnish"]],
      "c-nojito": [["leaves"], ["jig", "lime", 20], ["jig", "syrup", 15], ["muddle"], ["ice", "glass", true], ["top", "soda"], ["stirIn"], ["garnish"]]
    };
    const GEN = { rum: "рома", tequila: "текилы", gin: "джина", whisky: "виски", cognac: "коньяка", wine: "вина", triple: "апельсинового ликёра",
      campari: "кампари", vermouthR: "красного вермута", vermouthD: "сухого вермута", bitters: "ангостуры", tonic: "тоника", soda: "содовой",
      cola: "колы", oj: "апельсинового сока", pineapple: "ананасового сока", coconut: "кокосовых сливок", lime: "сока лайма",
      lemon: "лимонного сока", syrup: "сахарного сиропа", grenadine: "гренадина" };
    const TOPACC = { soda: "содовую", tonic: "тоник", cola: "колу" };
    const GNAME = { wheel: "кружок лайма", wedge: "долька лайма", orange: "кружок апельсина", lemon: "лимонная цедра", mint: "веточка мяты",
      cherry: "коктейльная вишня", pineapple: "долька ананаса", olive: "оливка на шпажке" };
    function stepText(st) {
      switch (st[0]) {
        case "ice": return st[2] ? "Засыпаем колотый лёд" : st[1] === "tin" ? "Кладём лёд в шейкер" : st[1] === "mixer" ? "Наполняем стакан для смешивания льдом" : "Наполняем бокал льдом";
        case "jig": return `Отмеряем джиггером ${st[2]} мл ${GEN[st[1]]}`;
        case "pour": return `Наливаем ${st[2]} мл ${GEN[st[1]]}`;
        case "top": return `Доливаем ${TOPACC[st[1]]}`;
        case "dash": return `Добавляем ${st[2]} ${st[2] === 1 ? "каплю" : "капли"} ангостуры`;
        case "leaves": return "Кладём листики свежей мяты";
        case "muddle": return "Мягко разминаем мяту, чтобы она отдала аромат";
        case "squeeze": return "Выжимаем дольку лайма";
        case "rim": return "Делаем солёный ободок";
        case "shake": return "Встряхиваем со льдом, пока шейкер не покроется инеем";
        case "stir": return "Размешиваем барной ложкой, чтобы охладить";
        case "stirIn": return "Аккуратно перемешиваем";
        case "strain": return "Процеживаем через стрейнер в бокал";
        case "float": return "Медленно вливаем гренадин: он тяжелее и опускается на дно";
        case "garnish": return `Украшаем: ${GNAME[S.c.garnish]}`;
        case "serve": return "Готово. Приятного вечера!";
      }
      return "";
    }
    function say(count, text) {
      capCount.textContent = count;
      capText.textContent = text;
      capBox.classList.remove("show");
      void capBox.offsetWidth;
      capBox.classList.add("show");
    }

    /* ---------- фон: расфокусированный бар и люди за спиной ---------- */
    const BK = { W: 0, H: 0, dots: [], people: [], next: 0, shelf: null };
    function bkResize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      BK.W = canvas.clientWidth; BK.H = canvas.clientHeight;
      if (!BK.W || !BK.H) return;
      canvas.width = Math.round(BK.W * dpr); canvas.height = Math.round(BK.H * dpr);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = ["255,60,95", "255,150,80", "255,110,140", "255,200,140"];
      BK.dots = Array.from({ length: 34 }, () => {
        const r = rnd(16, 86), c = cols[Math.floor(Math.random() * 4)], a = rnd(.05, .2);
        const sp = document.createElement("canvas");
        sp.width = sp.height = Math.ceil(r * 2);
        const g = sp.getContext("2d"), gr = g.createRadialGradient(r, r, 0, r, r, r);
        gr.addColorStop(0, `rgba(${c},${a.toFixed(3)})`); gr.addColorStop(.6, `rgba(${c},${(a * .55).toFixed(3)})`); gr.addColorStop(1, `rgba(${c},0)`);
        g.fillStyle = gr; g.fillRect(0, 0, sp.width, sp.height);
        return { x: Math.random() * BK.W, y: Math.random() * BK.H * .6, r, sp, vx: rnd(-.1, .1), ph: rnd(0, 6.28) };
      });
      const man = document.createElement("canvas");
      man.width = 220; man.height = 320;
      const mg = man.getContext("2d");
      if ("filter" in mg) mg.filter = "blur(9px)";
      mg.fillStyle = "rgba(6,1,3,.66)";
      mg.beginPath(); mg.ellipse(110, 205, 72, 112, 0, 0, 6.283); mg.fill();
      mg.beginPath(); mg.arc(110, 80, 28, 0, 6.283); mg.fill();
      BK.man = man;
      const sh = document.createElement("canvas");
      sh.width = BK.W; sh.height = BK.H;
      const s = sh.getContext("2d"), k = BK.H / 800;
      const band = s.createLinearGradient(0, BK.H * .1, 0, BK.H * .62);
      band.addColorStop(0, "rgba(120,10,30,0)"); band.addColorStop(.45, "rgba(200,30,60,.32)"); band.addColorStop(1, "rgba(80,8,20,0)");
      s.fillStyle = band; s.fillRect(0, 0, BK.W, BK.H);
      if ("filter" in s) s.filter = "blur(7px)";
      for (let row = 0; row < 2; row++) {
        const by = BK.H * (.32 + row * .17);
        for (let x = 10; x < BK.W; x += rnd(30, 60) * k + 8) {
          const h = rnd(50, 110) * k, w = rnd(14, 28) * k;
          s.fillStyle = `rgba(${Math.round(rnd(20, 70))},${Math.round(rnd(5, 20))},${Math.round(rnd(10, 25))},.9)`;
          s.fillRect(x, by - h, w, h);
          s.fillRect(x + w * .36, by - h - h * .35, w * .28, h * .36);
        }
        s.fillStyle = "rgba(255,120,140,.3)"; s.fillRect(0, by, BK.W, 3);
      }
      BK.shelf = sh;
    }
    function drawBokeh(t) {
      const c = bctx, { W, H } = BK;
      if (!W) return;
      c.clearRect(0, 0, W, H);
      if (BK.shelf) c.drawImage(BK.shelf, 0, 0, W, H);
      for (const d of BK.dots) {
        d.x += d.vx;
        if (d.x < -100) d.x = W + 100; else if (d.x > W + 100) d.x = -100;
        c.globalAlpha = .7 + .3 * Math.sin(t * .0012 + d.ph);
        c.drawImage(d.sp, d.x - d.r, d.y - d.r);
      }
      c.globalAlpha = 1;
      if (t > BK.next) {
        const dir = Math.random() < .5 ? 1 : -1;
        BK.people.push({ x: dir > 0 ? -160 : W + 160, dir, y: H * rnd(.28, .36), s: rnd(.8, 1.3) * Math.max(.6, H / 800), v: rnd(.6, 1.2) });
        BK.next = t + rnd(2500, 7000);
      }
      BK.people = BK.people.filter(p => {
        p.x += p.dir * p.v;
        const bob = Math.abs(Math.sin(p.x * .025)) * 4 * p.s;
        c.drawImage(BK.man, p.x - 110 * p.s, p.y - 80 * p.s - bob, 220 * p.s, 320 * p.s);
        return p.x > -240 && p.x < W + 240;
      });
    }

    /* ---------- кадр ---------- */
    let CY = 470;
    function fit() {
      const W = root.clientWidth, H = Math.max(1, root.clientHeight), r = W / H;
      const vb = r < .9 ? [300, 70, 600, 860] : r < 1.3 ? [160, 40, 880, 780] : [0, 0, 1200, 800];
      svg.setAttribute("viewBox", vb.join(" "));
      [VB.x, VB.y, VB.w, VB.h] = vb;
      CY = vb[1] + vb[3] / 2;
      const k = Math.min(W / vb[2], H / vb[3]), offY = (H - vb[3] * k) / 2;
      const titleB = titleEl.getBoundingClientRect().bottom - root.getBoundingClientRect().top + 8;
      const capT = 130;
      VB.top = vb[1] + Math.max(0, (titleB - offY) / k);
      VB.bottom = vb[1] + vb[3] - Math.max(0, (capT - offY) / k);
      bkResize();
    }
    function frame(t) {
      raf = 0;
      if (!alive) return;
      tweens = tweens.filter(tw => {
        const k = Math.max(0, Math.min(1, (t - tw.t0) / tw.dur)), e = tw.e(k);
        for (const p in tw.props) tw.o[p] = tw.from[p] + (tw.props[p] - tw.from[p]) * e;
        if (k >= 1) { tw.res(); return false; }
        return true;
      });
      timers = timers.filter(x => { if (t >= x.at) { x.res(); return false; } return true; });
      const dx = Math.sin(t * .0004) * 4, dy = Math.cos(t * .00031) * 3;
      camG.setAttribute("transform", `translate(600 ${CY}) scale(${CAM.s.toFixed(4)}) translate(${(-CAM.x + dx).toFixed(2)} ${(-CAM.y + dy).toFixed(2)})`);
      objs.forEach(o => o.draw(t));
      streams.forEach(s => s.draw(t));
      arms.forEach(a => a.draw());
      drawBokeh(t);
      raf = requestAnimationFrame(frame);
    }

    /* ---------- сцена коктейля ---------- */
    const BASE = 650;
    function setup(c, prog) {
      [LY.fall, LY.ves, LY.hold, LY.arms].forEach(l => { l.innerHTML = ""; });
      objs.clear(); arms.clear(); streams.clear(); tweens = []; timers = [];
      const hasShake = prog.some(s => s[0] === "shake"), hasStir = prog.some(s => s[0] === "stir");
      const gx = hasShake || hasStir ? 745 : 620;
      const glass = new Vessel(LY.ves, GLASSES[c.cup], CUP[c.cup], 2.1, c.pourLevel);
      Object.assign(glass, { x: gx, y: BASE, alpha: c.pourOp || .9 });
      S = { c, glass, gx, def: hasShake ? "tin" : hasStir ? "mixer" : "glass", jig: null };
      if (hasShake) {
        S.rig = new Obj(LY.ves, "", { x: 470, y: BASE - 236 });
        S.tin = new Tin(S.rig);
        S.strainer = new Obj(S.rig, STRAINER, { o: 0 });
        S.cap = new Obj(S.rig, CAP, { y: -320, o: 0 });
        S.lip = [-50, 2];
      } else if (hasStir) {
        S.rig = new Obj(LY.ves, "", { x: 470, y: BASE - 150 * 1.8 });
        S.mixer = new Vessel(S.rig, MIXER_SHAPE, MIXER_META, 1.8, 60);
        Object.assign(S.mixer, { y: 150 * 1.8, alpha: .85 });
        S.strainer = new Obj(S.rig, STRAINER, { o: 0, s: 1.5 });
        S.lip = [-78, 2];
      }
      Object.assign(CAM, { x: 600, y: 470, s: 1 });
    }
    function skip() { if (alive && !fast) { fast = true; flush(); } }
    skipBtn.addEventListener("click", skip);
    addEventListener("keydown", e => { if (e.key === "Escape" && alive) skip(); });
    new ResizeObserver(() => { if (alive) fit(); }).observe(root);

    async function play(c) {
      const prog = (PROGRAMS[c.id] || [["garnish"]]).concat([["serve"]]);
      setup(c, prog);
      titleEl.textContent = c.name;
      say("", "");
      root.hidden = false;
      fit();
      alive = true; fast = false;
      view(S.gx - 100, 330, BASE + 30, 560, 0);
      raf = requestAnimationFrame(frame);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      document.getElementById("app").classList.add("cu");
      root.classList.remove("out");
      root.classList.add("in");
      skipBtn.focus({ preventScroll: true });
      await new Promise(r => setTimeout(r, 1300));
      const appEl = document.getElementById("app");
      appEl.classList.add("cu-hide");
      Bartender.setActive(false); Ambience.setActive(false);
      const total = prog.length - 1;
      for (let i = 0; i < prog.length; i++) {
        const st = prog[i];
        say(st[0] === "serve" ? "" : `Шаг ${i + 1} из ${total}`, stepText(st));
        await STEPS[st[0]](st);
        if (S.jig && (prog[i + 1] || [])[0] !== "jig") await retireJigger();
      }
      fast = false;
      appEl.classList.remove("cu-hide");
      Bartender.setActive(true); Ambience.setActive(true);
      await new Promise(r => requestAnimationFrame(r));
      root.classList.remove("in");
      root.classList.add("out");
      appEl.classList.remove("cu");
      await new Promise(r => setTimeout(r, 1000));
      alive = false;
      cancelAnimationFrame(raf);
      root.hidden = true;
      root.classList.remove("out");
    }
    return { play, get active() { return alive; } };
  })();

  
/* ---------- коктейли ---------- */
  const ING = [
    ["Крепкое", [["wine", "Вино"], ["cognac", "Коньяк"], ["rum", "Ром"], ["whisky", "Виски"], ["gin", "Джин"], ["tequila", "Текила"]]],
    ["Ликёры и вермуты", [["triple", "Апельсиновый ликёр"], ["campari", "Кампари"], ["vermouthR", "Красный вермут"], ["vermouthD", "Сухой вермут"], ["bitters", "Ангостура"]]],
    ["Соки и газировка", [["tonic", "Тоник"], ["soda", "Содовая"], ["cola", "Кола"], ["oj", "Апельсиновый сок"], ["pineapple", "Ананасовый сок"], ["coconut", "Кокосовые сливки"]]],
    ["Свежее и сиропы", [["lime", "Лайм"], ["lemon", "Лимон"], ["mint", "Мята"], ["syrup", "Сахарный сироп"], ["grenadine", "Гренадин"]]]
  ];
  const ING_NAME = Object.fromEntries(ING.flatMap(([, items]) => items));
  const low = id => ING_NAME[id].toLowerCase();
  const METHOD = { shake: "встряхнуть в шейкере", stir: "размешать со льдом", build: "собрать прямо в бокале" };
  const GLASS_NAME = { highball: "высокий стакан", rocks: "рокс", coupe: "шампанское блюдце", martini: "коктейльный бокал", wine: "винный бокал" };
  const BASES = [["rum", "С ромом"], ["tequila", "С текилой"], ["gin", "С джином"], ["whisky", "С виски"], ["cognac", "С коньяком"], ["wine", "С вином"], ["none", "Без алкоголя"]];
  const COCKTAILS = [
    { id: "c-mojito", name: "Мохито", base: "rum", origin: "Куба", method: "build", need: ["rum", "lime", "syrup", "mint", "soda"],
      cup: "highball", pour: "#dfeccb", pourOp: .55, pourLevel: 30, garnish: "mint",
      tagline: "Освежающий ром с мятой и лаймом",
      history: "Мохито родом с Кубы. Похожий напиток из тростниковой водки, мяты и лайма, «Эль Драке», пили там ещё несколько веков назад. В XX веке мохито прославили бары Гаваны, и сейчас это один из самых известных коктейлей в мире.",
      recipe: [["45 мл", "белого рома"], ["20 мл", "сока лайма"], ["15 мл", "сахарного сиропа"], ["6–8", "листиков мяты"], ["до верха", "содовой"]],
      steps: "Слегка разомни мяту с соком лайма и сиропом на дне стакана, чтобы она отдала аромат, но не порвалась. Добавь ром, засыпь стакан колотым льдом и долей содовую. Аккуратно перемешай и укрась веточкой мяты." },
    { id: "c-daiquiri", name: "Дайкири", base: "rum", origin: "Куба", method: "shake", need: ["rum", "lime", "syrup"],
      cup: "coupe", pour: "#f2ecc8", pourOp: .75, pourLevel: 40, garnish: "wheel",
      tagline: "Ром, лайм и сахар: три ингредиента и идеальный баланс",
      history: "Назван в честь пляжа и рудника Дайкири на востоке Кубы. По популярной версии, рецепт около 1900 года придумал американский инженер Дженнингс Кокс, который работал там на шахтах.",
      recipe: [["60 мл", "белого рома"], ["20 мл", "сока лайма"], ["15 мл", "сахарного сиропа"]],
      steps: "Налей всё в шейкер, наполни его льдом и встряхивай 10–15 секунд. Процеди в охлаждённое шампанское блюдце и укрась кружком лайма." },
    { id: "c-cubalibre", name: "Куба либре", base: "rum", origin: "Куба", method: "build", need: ["rum", "cola", "lime"],
      cup: "highball", pour: "#3b1608", pourOp: .92, pourLevel: 30, garnish: "wedge",
      tagline: "Ром с колой и долькой лайма",
      history: "Название переводится как «Свободная Куба». Напиток появился в Гаване около 1900 года, вскоре после испано-американской войны, когда на остров завезли колу.",
      recipe: [["50 мл", "рома"], ["120 мл", "колы"], ["10 мл", "сока лайма"]],
      steps: "Наполни высокий стакан льдом, выжми в него лайм, налей ром и долей колу. Легко перемешай и укрась долькой лайма." },
    { id: "c-pinacolada", name: "Пина колада", base: "rum", origin: "Пуэрто-Рико", method: "shake", need: ["rum", "pineapple", "coconut"],
      cup: "highball", pour: "#f5ecd2", pourOp: .95, pourLevel: 28, garnish: "pineapple",
      tagline: "Сливочный тропический коктейль с ананасом и кокосом",
      history: "С 1978 года — официальный напиток Пуэрто-Рико. Сразу несколько баров Сан-Хуана называют себя его родиной, а самая известная версия относит рецепт к 1954 году. Название по-испански значит «процеженный ананас».",
      recipe: [["50 мл", "белого рома"], ["30 мл", "кокосовых сливок"], ["50 мл", "ананасового сока"]],
      steps: "Хорошо встряхни всё в шейкере со льдом или взбей в блендере с колотым льдом. Перелей в высокий стакан и укрась долькой ананаса." },
    { id: "c-margarita", name: "Маргарита", base: "tequila", origin: "Мексика", method: "shake", need: ["tequila", "triple", "lime"],
      cup: "coupe", pour: "#e6e8a8", pourOp: .7, pourLevel: 40, garnish: "wheel",
      tagline: "Текила, апельсиновый ликёр и лайм",
      history: "Кто придумал маргариту, точно неизвестно: есть несколько историй о барменах из Мексики и Калифорнии 1930–40-х годов. Ободок бокала часто обмакивают в соль, она подчёркивает вкус лайма.",
      recipe: [["50 мл", "текилы"], ["20 мл", "апельсинового ликёра"], ["15 мл", "сока лайма"]],
      steps: "По желанию сделай солёный ободок: смочи край бокала лаймом и обмакни в соль. Встряхни всё в шейкере со льдом и процеди в бокал." },
    { id: "c-sunrise", name: "Текила санрайз", base: "tequila", origin: "США", method: "build", need: ["tequila", "oj", "grenadine"],
      cup: "highball", pour: "#f6a623", grad: ["#f6a623", "#c8102e"], pourOp: .92, pourLevel: 30, garnish: "orange",
      tagline: "Коктейль, похожий на рассвет в стакане",
      history: "Современный рецепт появился в начале 1970-х в баре в Саусалито, Калифорния. Знаменитым его сделала группа The Rolling Stones, которая пила этот коктейль во время американского тура 1972 года.",
      recipe: [["45 мл", "текилы"], ["90 мл", "апельсинового сока"], ["15 мл", "гренадина"]],
      steps: "Наполни стакан льдом, налей текилу и апельсиновый сок, перемешай. Медленно влей гренадин по краю: он тяжелее и опустится на дно, получится переход от красного к оранжевому. Не перемешивай." },
    { id: "c-gintonic", name: "Джин-тоник", base: "gin", origin: "Великобритания", method: "build", need: ["gin", "tonic", "lime"],
      cup: "highball", pour: "#e3f0f2", pourOp: .5, pourLevel: 30, garnish: "wheel",
      tagline: "Самый простой и самый популярный коктейль с джином",
      history: "Британцы в Индии пили хинный тоник как средство от малярии, а чтобы горечь было легче терпеть, добавляли в него джин, сахар и лайм. Так привычка стала классикой.",
      recipe: [["50 мл", "джина"], ["100–150 мл", "тоника"], ["1", "долька лайма"]],
      steps: "Наполни стакан льдом доверху, налей джин и долей холодный тоник. Выжми лайм и опусти дольку в стакан." },
    { id: "c-negroni", name: "Негрони", base: "gin", origin: "Италия", method: "stir", need: ["gin", "campari", "vermouthR"],
      cup: "rocks", ice: true, pour: "#b0122c", pourOp: .9, pourLevel: 62, garnish: "orange",
      tagline: "Горько-сладкий итальянский аперитив в равных долях",
      history: "По популярной версии, около 1919 года во Флоренции граф Камилло Негрони попросил бармена сделать коктейль «Американо» покрепче и заменить в нём содовую на джин.",
      recipe: [["30 мл", "джина"], ["30 мл", "кампари"], ["30 мл", "красного вермута"]],
      steps: "Налей всё в стакан со льдом и размешивай 20–30 секунд, чтобы напиток охладился. Укрась кружком или цедрой апельсина." },
    { id: "c-martini", name: "Мартини", base: "gin", origin: "США", method: "stir", need: ["gin", "vermouthD"],
      cup: "martini", pour: "#eef2e6", pourOp: .4, pourLevel: 32, garnish: "olive",
      tagline: "Джин и сухой вермут: строгая классика",
      history: "Точное происхождение неизвестно, коктейль появился в США в конце XIX века. Чем меньше в нём вермута, тем мартини называют «суше».",
      recipe: [["60 мл", "джина"], ["10 мл", "сухого вермута"], ["1", "оливка"]],
      steps: "Размешай джин и вермут со льдом в стакане для смешивания 20–30 секунд. Процеди в охлаждённый коктейльный бокал и укрась оливкой на шпажке." },
    { id: "c-collins", name: "Том Коллинз", base: "gin", origin: "США", method: "build", need: ["gin", "lemon", "syrup", "soda"],
      cup: "highball", pour: "#efeed6", pourOp: .55, pourLevel: 30, garnish: "lemon",
      tagline: "Лимонад с джином и пузырьками",
      history: "Известен с 1870-х годов. Название связывают с розыгрышем 1874 года в Нью-Йорке: людям говорили, что некий Том Коллинз распускает о них слухи в соседнем баре, и они шли его искать.",
      recipe: [["45 мл", "джина"], ["30 мл", "лимонного сока"], ["15 мл", "сахарного сиропа"], ["60 мл", "содовой"]],
      steps: "Смешай джин, лимонный сок и сироп в высоком стакане со льдом, долей содовую и легко перемешай. Укрась цедрой лимона." },
    { id: "c-oldfashioned", name: "Олд фэшн", base: "whisky", origin: "США", method: "stir", need: ["whisky", "syrup", "bitters"],
      cup: "rocks", ice: true, pour: "#b8641a", pourOp: .9, pourLevel: 62, garnish: "orange",
      tagline: "Виски, сахар и биттер: коктейль «по-старому»",
      history: "Один из старейших коктейлей. В XIX веке посетители, уставшие от новых сложных рецептов, просили сделать коктейль «по-старому»: просто спирт, сахар, вода и биттер. Отсюда и название.",
      recipe: [["45 мл", "бурбона или ржаного виски"], ["5–10 мл", "сахарного сиропа"], ["2 капли", "ангостуры"]],
      steps: "Смешай сироп и биттер в стакане, добавь виски и крупный кусок льда. Размешивай около 30 секунд и укрась апельсиновой цедрой." },
    { id: "c-manhattan", name: "Манхэттен", base: "whisky", origin: "США", method: "stir", need: ["whisky", "vermouthR", "bitters"],
      cup: "coupe", pour: "#8a2614", pourOp: .9, pourLevel: 40, garnish: "cherry",
      tagline: "Виски и красный вермут с вишней",
      history: "Появился в Нью-Йорке в 1870–80-х годах. Известную легенду о том, что его придумали на приёме Дженни Черчилль в Манхэттенском клубе, историки считают выдумкой: в те дни она была в Англии.",
      recipe: [["50 мл", "ржаного виски"], ["20 мл", "красного вермута"], ["1 капля", "ангостуры"]],
      steps: "Размешай всё со льдом в стакане для смешивания, процеди в охлаждённый бокал и укрась коктейльной вишней." },
    { id: "c-sour", name: "Виски сауэр", base: "whisky", origin: "США", method: "shake", need: ["whisky", "lemon", "syrup"],
      cup: "rocks", ice: true, pour: "#e3bd62", pourOp: .85, pourLevel: 62, garnish: "cherry",
      tagline: "Кисло-сладкий виски с лимоном",
      history: "Сауэры — целое семейство коктейлей: крепкий напиток, кислый сок и сладкое. Рецепт виски сауэр напечатан уже в книге знаменитого бармена Джерри Томаса 1862 года.",
      recipe: [["45 мл", "виски"], ["25 мл", "лимонного сока"], ["20 мл", "сахарного сиропа"]],
      steps: "Хорошо встряхни всё в шейкере со льдом. Процеди в рокс со свежим льдом и укрась вишней. Иногда добавляют яичный белок для пышной пены." },
    { id: "c-sidecar", name: "Сайдкар", base: "cognac", origin: "Франция или Англия", method: "shake", need: ["cognac", "triple", "lemon"],
      cup: "coupe", pour: "#dea04a", pourOp: .85, pourLevel: 40, garnish: "lemon",
      tagline: "Коньяк с апельсиновым ликёром и лимоном",
      history: "Появился во время Первой мировой войны или сразу после неё; на родство претендуют бары Парижа и Лондона. Название означает мотоциклетную коляску.",
      recipe: [["50 мл", "коньяка"], ["20 мл", "апельсинового ликёра"], ["20 мл", "лимонного сока"]],
      steps: "Встряхни всё в шейкере со льдом и процеди в охлаждённое блюдце. Ободок можно обсыпать сахаром." },
    { id: "c-sangria", name: "Сангрия", base: "wine", origin: "Испания", method: "build", need: ["wine", "oj", "soda"],
      cup: "wine", pour: "#7a0f24", pourOp: .88, pourLevel: 40, garnish: "orange",
      tagline: "Вино с фруктами для большой компании",
      history: "Испанский напиток из красного вина, нарезанных фруктов и сока. Название связывают с испанским словом sangre — «кровь» — из-за цвета.",
      recipe: [["150 мл", "красного вина"], ["50 мл", "апельсинового сока"], ["50 мл", "содовой"], ["по вкусу", "нарезанные апельсин и яблоко, немного коньяка"]],
      steps: "Смешай вино, сок и нарезанные фрукты, по желанию добавь немного коньяка и дай постоять в холодильнике хотя бы час. Перед подачей добавь лёд и содовую." },
    { id: "c-nojito", name: "Мохито без алкоголя", base: "none", origin: "Куба", method: "build", need: ["lime", "syrup", "mint", "soda"],
      cup: "highball", pour: "#e6f2da", pourOp: .5, pourLevel: 30, garnish: "mint",
      tagline: "Вся свежесть мохито, только без рома",
      history: "Безалкогольная версия знаменитого кубинского коктейля. Мята, лайм и пузырьки освежают не хуже оригинала.",
      recipe: [["20 мл", "сока лайма"], ["15 мл", "сахарного сиропа"], ["6–8", "листиков мяты"], ["до верха", "содовой"]],
      steps: "Разомни мяту с лаймом и сиропом, засыпь стакан колотым льдом и долей содовую. Перемешай и укрась мятой." }
  ];
  COCKTAILS.forEach(c => {
    c.glassLabel = `${c.name}: ${GLASS_NAME[c.cup]}`;
    c.facts = [["Родина", c.origin], ["Бокал", GLASS_NAME[c.cup]], ["Как делают", METHOD[c.method]]];
  });
  const COCKTAIL_BY_ID = Object.fromEntries(COCKTAILS.map(c => [c.id, c]));

  /* ---------- барная карта ---------- */
  const mixDlg = document.getElementById("mix"), orderBtn = document.getElementById("order");
  const hintEl = document.getElementById("hint"), HINT = hintEl.textContent, served = document.getElementById("served");
  const inShaker = new Set();
  let mixN = 0;

  function drinkRow(c, side, btn) {
    mixN++;
    return `<li class="drink">${glassSVG(c, { pre: "m" + mixN + "-", still: true })}
      <div><b>${c.name}</b><span>${c.need.map(low).join(", ")}</span>${side || ""}</div>${btn}</li>`;
  }
  const makeBtn = c => `<button class="make" type="button" data-make="${c.id}" aria-label="Приготовить: ${c.name}">Приготовить</button>`;

  function renderMix() {
    mixN = 0;
    const picked = [...inShaker];
    document.getElementById("mix-summary").textContent = picked.length
      ? "В шейкере: " + picked.map(low).join(", ") + "."
      : "Шейкер пока пуст. Отмечай ингредиенты ниже или бери бутылки прямо с полки.";
    const can = [], almost = [];
    COCKTAILS.forEach(c => {
      const miss = c.need.filter(i => !inShaker.has(i));
      if (!miss.length) can.push(c);
      else if (miss.length === 1 && c.need.length > 1) almost.push([c, miss[0]]);
    });
    let html = "";
    if (picked.length) {
      html += `<h3>Можно приготовить</h3>` + (can.length
        ? `<ul class="drinks">${can.map(c => drinkRow(c, "", makeBtn(c))).join("")}</ul>`
        : `<p class="empty">Пока ничего. Добавь ещё ингредиентов.</p>`);
      if (almost.length) html += `<h3>Не хватает одного</h3><ul class="drinks">${almost.map(([c, m]) =>
        drinkRow(c, `<span class="miss">Не хватает: ${low(m)}</span>`,
          `<button class="make ghost" type="button" data-add="${m}" aria-label="Добавить ${low(m)} в шейкер">+ ${low(m)}</button>`)).join("")}</ul>`;
    }
    document.getElementById("mix-results").innerHTML = html;
    document.getElementById("mix-chips").innerHTML = ING.map(([title, items]) =>
      `<h3>${title}</h3><div class="chips">${items.map(([id, name]) =>
        `<button class="chip" type="button" data-ing="${id}" aria-pressed="${inShaker.has(id)}">${name}</button>`).join("")}</div>`).join("");
    document.querySelectorAll(".bottle").forEach(b => b.classList.toggle("in", inShaker.has(b.dataset.id)));
  }
  function renderMenu() {
    mixN = 100;
    document.getElementById("panel-menu").innerHTML = BASES.map(([base, title]) => {
      const list = COCKTAILS.filter(c => c.base === base);
      return list.length ? `<h3>${title}</h3><ul class="drinks">${list.map(c => drinkRow(c, "", makeBtn(c))).join("")}</ul>` : "";
    }).join("");
  }
  function toggleIng(id) {
    inShaker.has(id) ? inShaker.delete(id) : inShaker.add(id);
    const keepFocus = document.activeElement && document.activeElement.dataset.ing;
    renderMix();
    if (keepFocus) { const f = mixDlg.querySelector(`[data-ing="${keepFocus}"]`); if (f) f.focus(); }
  }
  function setTab(name) {
    mixDlg.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
    document.getElementById("panel-mix").hidden = name !== "mix";
    document.getElementById("panel-menu").hidden = name !== "menu";
  }
  function openMix(tab) {
    if (busy) return;
    if (cur !== 1) setRoom(1);
    renderMix(); renderMenu(); setTab(tab || "mix");
    mixDlg.show();
    app.classList.add("mixing");
    hintEl.textContent = "Кликай по бутылкам на полке, чтобы положить их в шейкер.";
    mixDlg.querySelector(".tab").focus();
  }
  mixDlg.addEventListener("close", () => {
    app.classList.remove("mixing");
    if (!busy) hintEl.textContent = HINT;
  });
  orderBtn.addEventListener("click", () => mixDlg.open ? mixDlg.close() : openMix());
  mixDlg.addEventListener("click", e => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.ing) toggleIng(t.dataset.ing);
    else if (t.dataset.add) { inShaker.add(t.dataset.add); renderMix(); }
    else if (t.dataset.make) makeCocktail(t.dataset.make);
    else if (t.dataset.tab) setTab(t.dataset.tab);
    else if ("clear" in t.dataset) { inShaker.clear(); renderMix(); }
    else if ("mixClose" in t.dataset) { mixDlg.close(); orderBtn.focus(); }
  });

  async function makeCocktail(id) {
    if (busy) return;
    const c = COCKTAIL_BY_ID[id];
    c.need.forEach(i => inShaker.add(i));
    busy = true;
    mixDlg.close();
    hintEl.textContent = `Бармен готовит: ${c.name}`;
    Bartender.prep();
    if (!reduceMotion.matches) await Closeup.play(c);
    served.innerHTML = glassSVG(c, { pre: "sv-" });
    served.style.left = Bartender.glassX() + "px";
    Bartender.done();
    hintEl.textContent = HINT;
    busy = false;
    openCard(c);
  }
  addEventListener("keydown", e => {
    if (e.key === "Escape" && mixDlg.open && !dlg.open) { mixDlg.close(); orderBtn.focus(); }
  });

  