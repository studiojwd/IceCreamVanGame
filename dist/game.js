(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const $ = (id) => document.getElementById(id);
  const screens = [...document.querySelectorAll(".screen")];

  const PRODUCTS = [
    { id: "whippy", group: "ice", name: "Classic Whippy", short: "WHIPPY", price: 3, points: 120, prep: 1.35, asset: "classic-whippy.png" },
    { id: "flake", group: "ice", name: "Chocolate 99", short: "99 FLAKE", price: 4, points: 170, prep: 1.8, asset: "99-flake.png" },
    { id: "sundae", group: "ice", name: "Berry Sundae", short: "SUNDAE", price: 5, points: 220, prep: 2.15, asset: "sundae.png" },
    { id: "lolly", group: "ice", name: "Rocket Lolly", short: "LOLLY", price: 2, points: 95, prep: .9, asset: "rocket-lolly.png" },
    { id: "cola", group: "cans", name: "Cola Can", short: "COLA", price: 2, points: 85, prep: .42, asset: "can-cola.png" },
    { id: "lemonade", group: "cans", name: "Lemonade Can", short: "LEMONADE", price: 2, points: 85, prep: .42, asset: "can-lemonade.png" },
    { id: "orange", group: "cans", name: "Orange Can", short: "ORANGE", price: 2, points: 85, prep: .42, asset: "can-orange.png" },
    { id: "water", group: "cans", name: "Water Can", short: "WATER", price: 2, points: 75, prep: .35, asset: "can-water.png" },
    { id: "slushRed", group: "slush", name: "Cherry Slush", short: "RED SLUSH", price: 4, points: 190, prep: 2.1, asset: "slush-red.png" },
    { id: "slushBlue", group: "slush", name: "Blue Slush", short: "BLUE SLUSH", price: 4, points: 190, prep: 2.1, asset: "slush-blue.png" },
    { id: "slushMix", group: "slush", name: "Mixed Slush", short: "MIXED SLUSH", price: 5, points: 250, prep: 2.8, asset: "slush-mixed.png" },
    { id: "hotChoc", group: "hot", name: "Hot Chocolate", short: "HOT CHOC", price: 4, points: 200, prep: 2.3, asset: "hot-chocolate-plain.png" },
    { id: "hotCream", group: "hot", name: "Cream Hot Chocolate", short: "+ CREAM", price: 5, points: 260, prep: 3, asset: "hot-chocolate-cream.png" },
    { id: "hotDeluxe", group: "hot", name: "Marshmallow Hot Chocolate", short: "MALLOW CHOC", price: 6, points: 320, prep: 3.6, asset: "hot-chocolate-marshmallows.png" }
  ];

  const PRODUCT_ASSETS = {
    ...Object.fromEntries(PRODUCTS.map((product) => [product.id, `assets/products/${product.asset}`])),
    emptyCold: "assets/products/empty-cup-cold.png",
    coldLid: "assets/products/lid-cold-dome.png",
    straw: "assets/products/straw.png",
    emptyHot: "assets/products/empty-cup-hot.png",
    hotLid: "assets/products/lid-hot.png"
  };

  const productImages = Object.fromEntries(Object.entries(PRODUCT_ASSETS).map(([id, source]) => {
    const image = new Image();
    image.src = source;
    return [id, image];
  }));
  const productImageCrops = new Map();

  const EQUIPMENT_ASSETS = {
    machine: "assets/equipment/soft-serve-machine-aria.png",
    machineUpgraded: "assets/equipment/soft-serve-machine-aria-pink.png",
    battery: "assets/equipment/battery-inverter.png",
    batteryUpgraded: "assets/equipment/battery-inverter-upgraded.png",
    slush: "assets/equipment/slush-machine-twin.png",
    slushUpgraded: "assets/equipment/slush-machine-twin-upgraded.png",
    cups: "assets/equipment/cup-lid-dispenser.png",
    cupsUpgraded: "assets/equipment/cup-lid-dispenser-upgraded.png",
    boiler: "assets/equipment/hot-chocolate-boiler.png",
    boilerUpgraded: "assets/equipment/hot-chocolate-boiler-upgraded.png",
    till: "assets/equipment/contactless-till.png",
    tillUpgraded: "assets/equipment/contactless-till-upgraded.png",
    fridge: "assets/equipment/drinks-fridge.png",
    fridgeUpgraded: "assets/equipment/drinks-fridge-upgraded.png",
    restockBox: "assets/equipment/restocking-box.png",
    canCrate: "assets/equipment/can-crate.png"
  };

  const VAN_SKINS = [
    { id: "cream", name: "Electric Cream", asset: "assets/vehicles/whitby-electric-ice-cream-van.png" },
    { id: "blue", name: "Classic Blue", asset: "assets/vehicles/whitby-electric-blue.png" },
    { id: "pink", name: "Strawberry Pink", asset: "assets/vehicles/whitby-electric-pink.png" },
    { id: "lilac", name: "Twilight Lilac", asset: "assets/vehicles/whitby-electric-lilac.png" }
  ];

  const EFFECT_ASSETS = {
    steam: "assets/effects/steam-puff.png",
    fizz: "assets/effects/fizzy-can-opening.png",
    slushSplash: "assets/effects/slush-splash-mixed.png",
    coin: "assets/effects/coin.png",
    soldOut: "assets/effects/sold-out-indicator.png",
    wrongOrder: "assets/effects/wrong-order-reaction.png",
    tipJar: "assets/effects/tip-jar.png",
    snow: "assets/effects/snow-burst.png",
    heatShimmer: "assets/effects/sydney-heat-shimmer.png",
    festiveLights: "assets/effects/festive-lights.png"
  };

  function loadImageSet(assets) {
    return Object.fromEntries(Object.entries(assets).map(([id, source]) => {
      const image = new Image();
      image.src = source;
      return [id, image];
    }));
  }

  const equipmentImages = loadImageSet(EQUIPMENT_ASSETS);
  const effectImages = loadImageSet(EFFECT_ASSETS);
  const vanImages = loadImageSet(Object.fromEntries(VAN_SKINS.map((skin) => [skin.id, skin.asset])));
  const uiImages = loadImageSet({
    logo: "assets/logos/ice-cream-van-dash-logo.png",
    home: "assets/scenes/seaside-van-complete.png"
  });

  const CUSTOMER_ASSETS = {
    summerWomanYoung: "assets/customers/customer-01-summer-woman-young.png",
    summerManYoung: "assets/customers/customer-02-summer-man-young.png",
    summerWomanMiddle: "assets/customers/customer-03-summer-woman-middle-aged.png",
    winterManElderlyA: "assets/customers/customer-04-winter-man-elderly.png",
    winterWomanAdult: "assets/customers/customer-05-winter-woman-adult.png",
    winterBoyTeen: "assets/customers/customer-06-winter-boy-teen.png",
    footballWomanYoung: "assets/customers/customer-07-football-woman-young.png",
    footballManMiddle: "assets/customers/customer-08-football-man-middle-aged.png",
    footballWomanElderly: "assets/customers/customer-09-football-woman-elderly.png",
    touristManAdult: "assets/customers/customer-10-tourist-man-adult.png",
    touristWomanElderly: "assets/customers/customer-11-tourist-woman-elderly.png",
    touristManYoung: "assets/customers/customer-12-tourist-man-young.png",
    summerWomanYoungB: "assets/customers/customer-13-summer-woman-young.png",
    summerManElderly: "assets/customers/customer-14-summer-man-elderly.png",
    summerManMiddle: "assets/customers/customer-15-summer-man-middle-aged.png",
    winterManYoung: "assets/customers/customer-16-winter-man-young.png",
    winterWomanMiddle: "assets/customers/customer-17-winter-woman-middle-aged.png",
    winterManElderlyB: "assets/customers/customer-18-winter-man-elderly.png",
    footballGirlTeen: "assets/customers/customer-19-football-girl-teen.png",
    footballManAdult: "assets/customers/customer-20-football-man-adult.png",
    footballWomanMiddle: "assets/customers/customer-21-football-woman-middle-aged.png",
    touristWomanYoung: "assets/customers/customer-22-tourist-woman-young.png",
    touristWomanMiddle: "assets/customers/customer-23-tourist-woman-middle-aged.png",
    touristManElderly: "assets/customers/customer-24-tourist-man-elderly.png"
  };

  const customerImages = loadImageSet(CUSTOMER_ASSETS);
  const customerCleanImages = new Map();
  const customerFrameCrops = new Map();

  const SUMMER_CUSTOMERS = ["summerWomanYoung", "summerManYoung", "summerWomanMiddle", "summerWomanYoungB", "summerManElderly", "summerManMiddle"];
  const WINTER_CUSTOMERS = ["winterManElderlyA", "winterWomanAdult", "winterBoyTeen", "winterManYoung", "winterWomanMiddle", "winterManElderlyB"];
  const FOOTBALL_CUSTOMERS = ["footballWomanYoung", "footballManMiddle", "footballWomanElderly", "footballGirlTeen", "footballManAdult", "footballWomanMiddle"];
  const TOURIST_CUSTOMERS = ["touristManAdult", "touristWomanElderly", "touristManYoung", "touristWomanYoung", "touristWomanMiddle", "touristManElderly"];
  const CUSTOMER_POOLS = {
    seaside: SUMMER_CUSTOMERS,
    village: [...SUMMER_CUSTOMERS, ...TOURIST_CUSTOMERS.slice(0, 3)],
    football: FOOTBALL_CUSTOMERS,
    london: TOURIST_CUSTOMERS,
    christmas: WINTER_CUSTOMERS,
    market: [...SUMMER_CUSTOMERS, ...TOURIST_CUSTOMERS],
    sydney: [...SUMMER_CUSTOMERS, ...TOURIST_CUSTOMERS]
  };

  const PRODUCT_GROUPS = {
    ice: { label: "ICE CREAM", short: "ICE" },
    cans: { label: "COLD CANS", short: "CANS" },
    slush: { label: "SLUSH BAR", short: "SLUSH" },
    hot: { label: "HOT DRINKS", short: "HOT" }
  };

  const LOCATIONS = [
    { id: "christmas", name: "Christmas", detail: "FEATURED · HOT CHOCOLATE · FESTIVE FUN", difficulty: 1, unlock: 0, duration: 75, spawn: 3.5, patience: 18, mult: 1.1, groups: ["ice", "hot"], maxItems: 1, groupChance: 0, starterProducts: ["whippy", "hotChoc"], featured: true, scene: "#5267b7", asset: "assets/location-christmas.jpg" },
    { id: "seaside", name: "Seaside", detail: "SEA BREEZE · STEADY QUEUE", difficulty: 1, unlock: 0, duration: 75, spawn: 3.5, patience: 18, mult: 1, groups: ["ice"], maxItems: 1, groupChance: 0, starterProducts: ["whippy", "flake"], scene: "#38aee8", asset: "assets/location-seaside.jpg" },
    { id: "village", name: "Village Fête", detail: "CANS · FAMILY RUSH", difficulty: 2, unlock: 2400, duration: 75, spawn: 3, patience: 17, mult: 1.15, groups: ["ice", "cans"], maxItems: 1, groupChance: 0, scene: "#54be75", asset: "assets/location-village.jpg" },
    { id: "football", name: "Football Match", detail: "GROUP ORDERS · HALF-TIME", difficulty: 3, unlock: 6500, duration: 80, spawn: 2.45, patience: 16, mult: 1.35, groups: ["ice", "cans"], maxItems: 2, groupChance: .42, scene: "#e9ad37", asset: "assets/location-football.jpg" },
    { id: "london", name: "London", detail: "SLUSHES · TOURIST GROUPS", difficulty: 3, unlock: 11500, duration: 82, spawn: 2.2, patience: 15.5, mult: 1.55, groups: ["ice", "cans", "slush"], maxItems: 2, groupChance: .5, scene: "#e36d55", asset: "assets/location-london.jpg" },
    { id: "market", name: "Evening Market", detail: "FULL MENU · TRIPLE ORDERS", difficulty: 5, unlock: 25000, duration: 85, spawn: 1.85, patience: 14.5, mult: 1.95, groups: ["ice", "cans", "slush", "hot"], maxItems: 3, groupChance: .62, scene: "#674f9c", asset: "assets/location-evening-market.jpg" },
    { id: "sydney", name: "Sydney Opera House", detail: "HEATWAVE · WORLD TOUR", difficulty: 5, unlock: 36000, duration: 90, spawn: 1.7, patience: 13.5, mult: 2.2, groups: ["ice", "cans", "slush"], maxItems: 3, groupChance: .7, scene: "#20a4de", asset: "assets/location-sydney.jpg" }
  ];

  const locationImages = Object.fromEntries(LOCATIONS.map((location) => {
    const image = new Image();
    image.src = location.asset;
    return [location.id, image];
  }));

  const UPGRADES = [
    { id: "machine", icon: "M", name: "ARIA Soft-Serve Machine", desc: "Whips cones and 99s 13% faster per level.", base: 120, equipment: ["machine", "machineUpgraded"] },
    { id: "heads", icon: "2×", name: "Twin-Head Setup", desc: "Adds simultaneous prep slots at levels 1 and 3.", base: 180 },
    { id: "freezer", icon: "F", name: "Display Freezer", desc: "Adds can stock and serves cans, lollies and sundaes faster.", base: 135, equipment: ["fridge", "fridgeUpgraded"] },
    { id: "slushMachine", icon: "S", name: "Slush Machine", desc: "Cuts slush preparation time by 13% per level.", base: 190, equipment: ["slush", "slushUpgraded"] },
    { id: "boiler", icon: "H", name: "Chocolate Boiler", desc: "Pours hot chocolate 13% faster per level.", base: 190, equipment: ["boiler", "boilerUpgraded"] },
    { id: "till", icon: "£", name: "Contactless Till", desc: "Faster payment keeps patience high and lifts every tip.", base: 150, equipment: ["till", "tillUpgraded"] },
    { id: "hatch", icon: "H", name: "Serving Hatch", desc: "A wider hatch holds a larger, more patient queue.", base: 165, equipment: ["cups", "cupsUpgraded"] },
    { id: "power", icon: "⚡", name: "Battery & Inverter", desc: "Reliable electric power speeds up every order.", base: 210, equipment: ["battery", "batteryUpgraded"] }
  ];

  const DEFAULT_SAVE = {
    bank: 0,
    career: 0,
    highs: { seaside: 0, village: 0, football: 0, london: 0, christmas: 0, market: 0, sydney: 0 },
    upgrades: { machine: 0, heads: 0, freezer: 0, slushMachine: 0, boiler: 0, till: 0, hatch: 0, power: 0 },
    vanSkin: "cream",
    sound: true,
    helpSeen: false
  };

  function loadSave() {
    try {
      const raw = JSON.parse(localStorage.getItem("whitby-whippy-dash-save"));
      if (!raw) return structuredClone(DEFAULT_SAVE);
      const migratedHighs = { ...(raw.highs || {}) };
      if (!migratedHighs.seaside && migratedHighs.whitby) migratedHighs.seaside = migratedHighs.whitby;
      if (!migratedHighs.football && migratedHighs.match) migratedHighs.football = migratedHighs.match;
      if (!migratedHighs.london && migratedHighs.city) migratedHighs.london = migratedHighs.city;
      const merged = {
        ...structuredClone(DEFAULT_SAVE),
        ...raw,
        highs: { ...DEFAULT_SAVE.highs, ...migratedHighs },
        upgrades: { ...DEFAULT_SAVE.upgrades, ...(raw.upgrades || {}) }
      };
      if (!VAN_SKINS.some((skin) => skin.id === merged.vanSkin)) merged.vanSkin = DEFAULT_SAVE.vanSkin;
      return merged;
    } catch (_) {
      return structuredClone(DEFAULT_SAVE);
    }
  }

  let save = loadSave();
  let mode = "title";
  let selectedLocation = 0;
  let previousScreen = "titleScreen";
  let garageReturn = "locationScreen";
  let game = null;
  let lastTime = performance.now();
  let toastTimer = 0;
  let audioCtx = null;
  let selectedCategory = "ice";
  let visibleProductIds = [];

  const customerLooks = [
    ["#f1b888", "#59311f", "#e93448"], ["#9a603d", "#17131a", "#33a8e8"],
    ["#f4caa2", "#d86735", "#54b979"], ["#71412f", "#28202e", "#efb93f"],
    ["#d89568", "#3a281f", "#e761a3"], ["#f0b07d", "#222b3a", "#7b62c2"]
  ];

  function persist() {
    localStorage.setItem("whitby-whippy-dash-save", JSON.stringify(save));
  }

  function showScreen(id) {
    screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
  }

  function showToast(message, tone = "normal") {
    const el = $("toast");
    el.textContent = message;
    el.style.background = tone === "bad" ? "#ff8c8c" : tone === "good" ? "#54d69b" : "#ffd84d";
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1500);
  }

  function formatScore(value) { return Math.max(0, Math.round(value)).toString().padStart(6, "0"); }
  function formatMoney(value) {
    const amount = Math.round(value);
    return amount < 0 ? `-£${Math.abs(amount)}` : `£${amount}`;
  }
  function formatTime(value) {
    const v = Math.max(0, Math.ceil(value));
    return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
  }

  function careerBest() { return Math.max(save.career, ...Object.values(save.highs)); }
  function unlocked(loc) { return careerBest() >= loc.unlock; }
  function maxQueue() { return 5 + Math.floor(save.upgrades.hatch / 2); }
  function prepSlots() { return 1 + (save.upgrades.heads >= 1 ? 1 : 0) + (save.upgrades.heads >= 3 ? 1 : 0); }

  const SOUND_PATTERNS = {
    tap: [[320, 0, .05, "square", .022]],
    ui: [[300, 0, .05, "square", .02], [450, .045, .05, "square", .018]],
    serve: [[523, 0, .09, "square", .032], [659, .07, .09, "square", .032], [784, .14, .12, "square", .032]],
    bad: [[180, 0, .12, "sawtooth", .035], [140, .09, .18, "sawtooth", .03]],
    buy: [[440, 0, .08, "square", .03], [660, .08, .11, "square", .03]],
    arrival: [[392, 0, .045, "square", .018], [523, .05, .06, "square", .018]],
    start: [[262, 0, .07, "square", .026], [392, .08, .07, "square", .026], [523, .16, .12, "square", .03]],
    restock: [[180, 0, .06, "square", .024], [230, .08, .06, "square", .024], [280, .16, .08, "square", .024]],
    restockDone: [[392, 0, .06, "square", .024], [523, .06, .07, "square", .026], [659, .12, .1, "square", .028]],
    result: [[523, 0, .09, "square", .028], [659, .08, .09, "square", .028], [784, .16, .12, "square", .03], [1047, .25, .15, "square", .026]],
    pause: [[220, 0, .08, "triangle", .025], [165, .08, .12, "triangle", .024]]
  };

  function playTone(kind = "ui") {
    if (!save.sound) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime;
      const pattern = SOUND_PATTERNS[kind] || SOUND_PATTERNS.ui;
      pattern.forEach(([freq, offset, duration, type, volume]) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, now + offset);
        gain.gain.exponentialRampToValueAtTime(.001, now + offset + duration);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + duration + .01);
      });
    } catch (_) { /* audio is a bonus */ }
  }

  function locationProducts(loc = game?.loc || LOCATIONS[selectedLocation]) {
    return PRODUCTS.filter((product) => loc.groups.includes(product.group));
  }

  function canCapacity() { return 3 + save.upgrades.freezer; }

  function buildProductButtons() {
    const loc = game?.loc || LOCATIONS[selectedLocation];
    const groups = loc.groups;
    if (!groups.includes(selectedCategory)) selectedCategory = groups[0];

    const holder = $("productButtons");
    const priorScroll = holder.scrollLeft;
    holder.innerHTML = "";
    const products = locationProducts(loc);
    visibleProductIds = products.map((product) => product.id);
    products.forEach((product, index) => {
      const key = index < 9 ? String(index + 1) : "";
      const button = document.createElement("button");
      button.className = "product-btn";
      button.dataset.product = product.id;
      button.dataset.group = product.group;
      button.setAttribute("aria-label", `Prepare ${product.name}${key ? `, key ${key}` : ""}`);
      const stock = product.group === "cans" && game ? ` · STOCK ${game.canStock[product.id]}` : "";
      button.innerHTML = `<canvas width="48" height="48" aria-hidden="true"></canvas><span><strong>${product.short}</strong><small>£${product.price}${stock}</small><em>${PRODUCT_GROUPS[product.group].label}</em></span>${key ? `<i class="key">${key}</i>` : ""}`;
      button.addEventListener("click", () => startProduct(product.id));
      holder.appendChild(button);
      const iconCtx = button.querySelector("canvas").getContext("2d");
      iconCtx.imageSmoothingEnabled = false;
      drawTreat(iconCtx, product.id, 24, 24, 1.15);
      button.style.setProperty("--order", index);
      const nextProduct = products[index + 1];
      if (product.group === "cans" && nextProduct?.group !== "cans") {
        const restock = document.createElement("button");
        restock.id = "restockBtn";
        restock.className = "product-btn restock-btn";
        restock.setAttribute("aria-label", "Restock canned drinks");
        restock.innerHTML = `<img class="restock-art" src="${EQUIPMENT_ASSETS.restockBox}" alt="" aria-hidden="true"><span><strong>RESTOCK</strong><small>REFILL THE FRIDGE</small><em>COLD CANS</em></span>`;
        restock.addEventListener("click", restockCans);
        holder.appendChild(restock);
      }
    });
    if (!holder.dataset.wheelReady) {
      holder.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        holder.scrollLeft += event.deltaY;
      }, { passive: false });
      holder.dataset.wheelReady = "true";
    }
    requestAnimationFrame(() => { holder.scrollLeft = priorScroll; });
  }

  function refreshHeader() {
    const active = game && !game.ended && (
      mode === "playing" || mode === "paused" ||
      (mode === "help" && ["game", "pauseScreen"].includes(previousScreen)) ||
      (mode === "garage" && ["game", "pauseScreen"].includes(garageReturn))
    );
    $("scoreValue").textContent = formatScore(active ? game.score : 0);
    $("cashValue").textContent = formatMoney(active ? game.cash : save.bank);
    $("timeValue").textContent = formatTime(active ? game.time : LOCATIONS[selectedLocation].duration);
    $("comboValue").textContent = `x${active ? Math.max(1, game.combo) : 1}`;
    $("careerBest").textContent = formatScore(careerBest());
    $("soundBtn").textContent = save.sound ? "♪" : "×";
    $("pauseBtn").disabled = mode !== "playing";
  }

  function renderLocations() {
    $("bankValue").textContent = `£${save.bank}`;
    const best = careerBest();
    const grid = $("locationGrid");
    grid.innerHTML = "";
    LOCATIONS.forEach((loc, index) => {
      const isOpen = unlocked(loc);
      const button = document.createElement("button");
      button.className = `location-card${index === selectedLocation ? " selected" : ""}`;
      button.style.setProperty("--scene", loc.scene);
      button.style.backgroundImage = `url("${loc.asset}")`;
      button.disabled = !isOpen;
      const unlockProgress = loc.unlock ? Math.min(1, best / loc.unlock) : 1;
      const unlockLabel = isOpen ? "PITCH OPEN" : `${formatScore(Math.max(0, loc.unlock - best))} TO GO`;
      const badge = !isOpen
        ? `<span class="lock">SCORE ${formatScore(loc.unlock)} TO UNLOCK</span>`
        : loc.featured ? `<span class="featured">★ FEATURED PITCH</span>` : "";
      button.innerHTML = `${badge}<strong>${loc.name}</strong><small>${loc.detail}</small><span class="pitch-meta"><em>${unlockLabel}</em><em>DIFFICULTY ${"◆".repeat(loc.difficulty)}</em></span>${isOpen ? "" : `<span class="unlock-progress" aria-hidden="true"><i style="width:${Math.round(unlockProgress * 100)}%"></i></span>`}<small class="record">BEST ${formatScore(save.highs[loc.id])}</small>`;
      button.addEventListener("click", () => {
        selectedLocation = index;
        renderLocations();
        setTimeout(() => startRound(index), 140);
      });
      grid.appendChild(button);
    });
  }

  function upgradeCost(upgrade) {
    const level = save.upgrades[upgrade.id];
    return Math.round(upgrade.base * (1 + level * .76));
  }

  function renderVanSkins() {
    const grid = $("vanSkinGrid");
    if (!grid) return;
    grid.innerHTML = "";
    VAN_SKINS.forEach((skin) => {
      const selected = save.vanSkin === skin.id;
      const button = document.createElement("button");
      button.className = `van-skin-card${selected ? " selected" : ""}`;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.setAttribute("aria-label", `${skin.name} van livery${selected ? ", selected" : ""}`);
      button.innerHTML = `<img src="${skin.asset}" alt=""><span>${skin.name}</span><small>${selected ? "SELECTED" : "CHOOSE LIVERY"}</small>`;
      button.addEventListener("click", () => {
        if (save.vanSkin === skin.id) return;
        save.vanSkin = skin.id;
        persist();
        playTone("buy");
        showToast(`${skin.name.toUpperCase()} SELECTED`, "good");
        renderVanSkins();
      });
      grid.appendChild(button);
    });
  }

  function renderGarage() {
    $("garageBank").textContent = `£${save.bank}`;
    renderVanSkins();
    const grid = $("upgradeGrid");
    grid.innerHTML = "";
    UPGRADES.forEach((upgrade) => {
      const level = save.upgrades[upgrade.id];
      const cost = upgradeCost(upgrade);
      const maxed = level >= 4;
      const card = document.createElement("article");
      card.className = `upgrade-card${upgrade.equipment ? " has-art" : ""}`;
      const equipmentId = upgrade.equipment?.[level >= 2 ? 1 : 0];
      const equipmentArt = equipmentId ? `<img class="upgrade-art" src="${EQUIPMENT_ASSETS[equipmentId]}" alt="" aria-hidden="true">` : upgrade.icon;
      card.innerHTML = `<div class="upgrade-icon${equipmentId ? " art" : ""}">${equipmentArt}</div><div><h3>${upgrade.name}</h3><p>${upgrade.desc}</p><div class="level-pips">${[0,1,2,3].map(i => `<i class="${i < level ? "on" : ""}"></i>`).join("")}</div></div><button class="buy-btn" ${maxed || save.bank < cost ? "disabled" : ""}>${maxed ? "MAX LEVEL" : `UPGRADE · £${cost}`}</button>`;
      card.querySelector("button").addEventListener("click", () => buyUpgrade(upgrade));
      grid.appendChild(card);
    });
  }

  function buyUpgrade(upgrade) {
    const level = save.upgrades[upgrade.id];
    const cost = upgradeCost(upgrade);
    if (level >= 4 || save.bank < cost) return;
    save.bank -= cost;
    save.upgrades[upgrade.id] += 1;
    persist();
    playTone("buy");
    showToast(`${upgrade.name.toUpperCase()} UPGRADED`, "good");
    renderGarage();
    refreshHeader();
  }

  function openLocations() {
    mode = "menu";
    renderLocations();
    showScreen("locationScreen");
    refreshHeader();
  }

  function activeScreenId() {
    return screens.find((screen) => screen.classList.contains("active"))?.id || null;
  }

  function currentContext() {
    const active = activeScreenId();
    if (active === "helpScreen") return previousScreen;
    if (mode === "playing") return "game";
    return active || (game && !game.ended ? "game" : "titleScreen");
  }

  function restoreContext(context) {
    if (context === "game" && game && !game.ended) {
      mode = "playing";
      showScreen(null);
      lastTime = performance.now();
      updateButtons();
    } else if (context === "pauseScreen" && game && !game.ended) {
      mode = "paused";
      showScreen("pauseScreen");
      updateButtons();
    } else if (context === "locationScreen") {
      openLocations();
      return;
    } else if (context === "garageScreen") {
      mode = "garage";
      renderGarage();
      showScreen("garageScreen");
    } else if (context === "resultsScreen" && game?.ended) {
      mode = "results";
      showScreen("resultsScreen");
    } else {
      mode = "title";
      showScreen("titleScreen");
    }
    refreshHeader();
  }

  function openHelp(returnTo = currentContext()) {
    previousScreen = returnTo;
    mode = "help";
    $("helpBackBtn").textContent = ["game", "pauseScreen"].includes(returnTo) ? "BACK TO THE HATCH" : "GOT IT";
    showScreen("helpScreen");
    refreshHeader();
    playTone("ui");
  }

  function closeHelp() {
    restoreContext(previousScreen);
    playTone("ui");
  }

  function openGarage(returnTo = "locationScreen") {
    garageReturn = returnTo;
    mode = "garage";
    const labels = { game: "BACK TO THE HATCH", pauseScreen: "BACK TO PAUSE", resultsScreen: "BACK TO RESULTS", titleScreen: "BACK TO TITLE" };
    $("garageBackBtn").textContent = labels[returnTo] || "BACK TO LOCATIONS";
    renderGarage();
    showScreen("garageScreen");
    refreshHeader();
    playTone("ui");
  }

  function closeGarage() {
    restoreContext(garageReturn);
    playTone("ui");
  }

  function startRound(index) {
    selectedLocation = index;
    const loc = LOCATIONS[index];
    const stock = canCapacity();
    game = {
      loc,
      score: 0,
      cash: 0,
      time: loc.duration,
      combo: 0,
      bestCombo: 0,
      served: 0,
      lost: 0,
      mistakes: 0,
      attempts: 0,
      correctItems: 0,
      spawnTimer: .7,
      customers: [],
      prep: [],
      particles: [],
      shake: 0,
      ended: false,
      elapsed: 0,
      canStock: { cola: stock, lemonade: stock, orange: stock, water: stock }
    };
    selectedCategory = loc.groups[0];
    mode = "playing";
    showScreen(null);
    buildProductButtons();
    updateButtons();
    updateQueueUI();
    refreshHeader();
    showToast(`${loc.name.toUpperCase()} · HATCH OPEN`, "good");
    playTone("start");
  }

  function endRound(quit = false) {
    if (!game || game.ended) return;
    game.ended = true;
    const loc = game.loc;
    const beforeCareer = careerBest();
    const previousHigh = save.highs[loc.id] || 0;
    if (!quit) {
      save.bank = Math.max(0, save.bank + game.cash);
      save.highs[loc.id] = Math.max(previousHigh, Math.round(game.score));
      save.career = Math.max(save.career, Math.round(game.score));
    }
    persist();
    mode = "results";
    $("resultEyebrow").textContent = quit ? "HATCH CLOSED EARLY" : "SHIFT COMPLETE";
    const perfectShift = !quit && game.served >= 5 && game.lost === 0 && game.mistakes === 0;
    $("resultsHeading").textContent = quit ? "PACKING UP?" : perfectShift ? "PERFECT SHIFT!" : game.score >= loc.unlock + 3500 ? "WHAT A ROUND!" : "NICE WORK!";
    $("finalScore").textContent = formatScore(game.score);
    $("servedResult").textContent = game.served;
    $("lostResult").textContent = game.lost;
    $("mistakesResult").textContent = game.mistakes;
    $("accuracyResult").textContent = `${game.attempts ? Math.round(game.correctItems / game.attempts * 100) : 100}%`;
    $("comboResult").textContent = `x${Math.max(1, game.bestCombo)}`;
    $("cashResult").textContent = formatMoney(quit ? 0 : game.cash);
    $("newBest").classList.toggle("hidden", quit || game.score <= previousHigh);
    const afterCareer = careerBest();
    const newlyUnlocked = LOCATIONS.find((place) => place.unlock > beforeCareer && place.unlock <= afterCareer);
    const unlock = $("unlockNotice");
    unlock.classList.toggle("hidden", !newlyUnlocked);
    unlock.textContent = newlyUnlocked ? `NEW PITCH UNLOCKED · ${newlyUnlocked.name.toUpperCase()}` : "";
    showScreen("resultsScreen");
    $("gameStatus").textContent = `Shift ended. ${game.served} customers served, ${game.lost} missed, ${game.mistakes} mistakes, ${formatMoney(quit ? 0 : game.cash)} takings.`;
    refreshHeader();
    playTone(quit ? "bad" : "result");
  }

  function addCustomer() {
    if (!game || game.customers.length >= maxQueue()) return false;
    let pool = locationProducts(game.loc);
    if (game.elapsed < 12 && game.loc.starterProducts) {
      pool = game.loc.starterProducts.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean);
    }
    let itemCount = 1;
    if (game.loc.maxItems >= 2 && Math.random() < game.loc.groupChance) itemCount = 2;
    if (game.loc.maxItems >= 3 && itemCount === 2 && Math.random() < .42) itemCount = 3;
    const orders = Array.from({ length: itemCount }, () => pool[Math.floor(Math.random() * pool.length)].id);
    const patienceBoost = 1 + save.upgrades.hatch * .055 + save.upgrades.till * .04;
    const orderBoost = 1 + (itemCount - 1) * .22;
    const maxPatience = game.loc.patience * patienceBoost * orderBoost * (.88 + Math.random() * .28);
    const characterPool = CUSTOMER_POOLS[game.loc.id] || SUMMER_CUSTOMERS;
    game.customers.push({
      id: `${Date.now()}-${Math.random()}`,
      orders,
      completed: orders.map(() => false),
      patience: maxPatience,
      maxPatience,
      look: customerLooks[Math.floor(Math.random() * customerLooks.length)],
      character: characterPool[Math.floor(Math.random() * characterPool.length)],
      phase: Math.random() * Math.PI * 2,
      entering: 1,
      exiting: 0,
      status: "waiting",
      happyPulse: 0,
      mistakePulse: 0
    });
    updateQueueUI();
    playTone("arrival");
    return true;
  }

  function prepDuration(product) {
    let speed = 1 + save.upgrades.power * .08;
    if (product.group === "ice") speed += save.upgrades.machine * .13;
    if (["sundae", "lolly"].includes(product.id) || product.group === "cans") speed += save.upgrades.freezer * .12;
    if (product.group === "slush") speed += save.upgrades.slushMachine * .13;
    if (product.group === "hot") speed += save.upgrades.boiler * .13;
    return Math.max(.38, product.prep / speed);
  }

  function findPendingOrder(productId) {
    for (const customer of game.customers) {
      if (customer.status !== "waiting") continue;
      for (let itemIndex = 0; itemIndex < customer.orders.length; itemIndex++) {
        const reserved = game.prep.some((item) => item.targetId === customer.id && item.itemIndex === itemIndex);
        if (!customer.completed[itemIndex] && customer.orders[itemIndex] === productId && !reserved) {
          return { customer, itemIndex };
        }
      }
    }
    return null;
  }

  function startProduct(productId) {
    if (mode !== "playing" || !game || game.ended) return;
    const product = PRODUCTS.find(p => p.id === productId);
    selectedCategory = product.group;
    if (product.group === "cans" && game.canStock[productId] <= 0) {
      showToast(`${product.short} SOLD OUT · RESTOCK THE FRIDGE`, "bad");
      pushEffect("soldOut", 760, 235, 78, 1.1, 6);
      playTone("bad");
      return;
    }
    const waiting = findPendingOrder(productId);
    if (!waiting) {
      mistake("NO ONE ORDERED THAT!", product.price);
      return;
    }
    if (game.prep.length >= prepSlots()) {
      showToast("ALL PREP STATIONS ARE BUSY", "bad");
      playTone("bad");
      return;
    }
    game.attempts += 1;
    if (product.group === "cans") game.canStock[productId] -= 1;
    game.prep.push({ kind: "order", type: productId, targetId: waiting.customer.id, itemIndex: waiting.itemIndex, elapsed: 0, duration: prepDuration(product) });
    playTone("tap");
    if (product.group === "cans") buildProductButtons();
    updateButtons();
  }

  function restockCans() {
    if (mode !== "playing" || !game || game.ended) return;
    const full = Object.values(game.canStock).every((amount) => amount >= canCapacity());
    if (full) { showToast("THE DRINKS FRIDGE IS ALREADY FULL"); return; }
    if (game.prep.some((item) => item.kind === "restock")) return;
    if (game.prep.length >= prepSlots()) { showToast("ALL PREP STATIONS ARE BUSY", "bad"); return; }
    const duration = Math.max(.65, 1.8 - save.upgrades.freezer * .18);
    game.prep.push({ kind: "restock", type: "restock", elapsed: 0, duration });
    showToast("RESTOCKING THE DRINKS FRIDGE");
    playTone("restock");
    updateButtons();
  }

  function finishRestock() {
    const stock = canCapacity();
    game.canStock = { cola: stock, lemonade: stock, orange: stock, water: stock };
    buildProductButtons();
    updateButtons();
    pushEffect("fizz", 760, 235, 70, 1, 8);
    showToast("DRINKS FRIDGE FULL", "good");
    playTone("restockDone");
  }

  function pushEffect(effect, x, y, size = 64, life = 1, rise = 14, vx = 0) {
    if (!game) return;
    game.particles.push({ effect, x, y, size, life, maxLife: life, rise, vx });
  }

  function mistake(message, cashPenalty = 0, countAttempt = true) {
    if (!game) return;
    game.mistakes += 1;
    if (countAttempt) game.attempts += 1;
    game.combo = 0;
    game.score = Math.max(0, game.score - 60);
    game.cash -= cashPenalty;
    game.shake = .25;
    game.customers.forEach(c => {
      if (c.status !== "waiting") return;
      c.patience = Math.max(.4, c.patience - .45);
      c.mistakePulse = .85;
    });
    pushEffect("wrongOrder", 760, 235, 82, 1.1, 7);
    if (cashPenalty) game.particles.push({ x: 760, y: 205, life: 1.15, maxLife: 1.15, text: `-£${cashPenalty}`, color: "#ff8c8c", rise: 28 });
    showToast(cashPenalty ? `${message} · -£${cashPenalty} TAKINGS` : message, "bad");
    playTone("bad");
    refreshHeader();
  }

  function serveCustomer(targetId, productId, targetItemIndex) {
    let index = game.customers.findIndex((customer) => customer.id === targetId);
    let itemIndex = targetItemIndex;
    let customer = game.customers[index];
    if (index < 0 || customer?.status !== "waiting" || customer.completed[itemIndex] || customer.orders[itemIndex] !== productId) {
      const fallback = findPendingOrder(productId);
      if (fallback) {
        index = game.customers.indexOf(fallback.customer);
        customer = fallback.customer;
        itemIndex = fallback.itemIndex;
      }
    }
    if (!customer || itemIndex < 0) {
      mistake("ORDER LEFT THE QUEUE", 0, false);
      return;
    }
    customer.completed[itemIndex] = true;
    game.correctItems += 1;
    const product = PRODUCTS.find(p => p.id === productId);
    const patienceRatio = customer.patience / customer.maxPatience;
    game.combo += 1;
    game.bestCombo = Math.max(game.bestCombo, game.combo);
    const comboMult = Math.min(3, 1 + Math.floor(game.combo / 4) * .25);
    const fastBonus = Math.round(patienceRatio * 70);
    const points = Math.round((product.points + fastBonus) * game.loc.mult * comboMult);
    const tipChance = Math.min(.9, .2 + patienceRatio * .42 + save.upgrades.till * .07);
    let tip = Math.random() < tipChance ? 1 + Math.floor(save.upgrades.till / 2) : 0;
    if ((["sundae", "lolly"].includes(productId) || product.group === "cans") && save.upgrades.freezer >= 2 && Math.random() < .35) tip += 1;
    game.score += points;
    game.cash += product.price + tip;
    customer.patience = Math.min(customer.maxPatience, customer.patience + .8);
    customer.happyPulse = .9;
    const orderComplete = customer.completed.every(Boolean);
    let groupBonus = 0;
    if (orderComplete) {
      groupBonus = Math.round((customer.orders.length - 1) * 130 * game.loc.mult);
      game.score += groupBonus;
      game.served += 1;
      customer.status = "celebrating";
      customer.reaction = 1.05;
    }
    const effectX = 695 + index * 58;
    game.particles.push({ x: effectX, y: 225, life: 1, maxLife: 1, text: `+${points}`, color: patienceRatio > .6 ? "#ffd84d" : "#fffdf4", rise: 24 });
    if (product.group === "cans") pushEffect("fizz", effectX + 18, 260, 54, .8, 12);
    else if (product.group === "slush") pushEffect("slushSplash", effectX + 18, 258, 62, .9, 10);
    else if (product.group === "hot") pushEffect("steam", effectX + 18, 255, 50, .9, 18);
    else pushEffect("coin", effectX + 18, 255, 34, .75, 22);
    if (tip) pushEffect("tipJar", effectX + 42, 250, 48, 1.1, 12);
    const resultText = orderComplete
      ? `${customer.orders.length > 1 ? `GROUP ORDER +${groupBonus} · ` : ""}SERVED +${points}`
      : `${customer.completed.filter(Boolean).length} OF ${customer.orders.length} ITEMS READY`;
    showToast(tip ? `${resultText} · £${tip} TIP` : resultText, "good");
    playTone("serve");
    updateQueueUI();
    refreshHeader();
  }

  function loseCustomer(index) {
    const customer = game.customers[index];
    if (!customer || customer.status !== "waiting") return;
    customer.status = "leaving";
    customer.exiting = 0;
    game.combo = 0;
    game.lost += 1;
    game.score = Math.max(0, game.score - 85);
    game.shake = .2;
    game.particles.push({ x: 760, y: 240, life: 1, maxLife: 1, text: "TOO SLOW!", color: "#ff8c8c", rise: 24 });
    pushEffect("wrongOrder", 815, 245, 62, .9, 8);
    playTone("bad");
    updateQueueUI();
    refreshHeader();
  }

  function updateButtons() {
    const hasWaitingCustomer = !!game?.customers.some((customer) => customer.status === "waiting");
    const canPrep = mode === "playing" && game && game.prep.length < prepSlots();
    const canUse = canPrep && hasWaitingCustomer;
    document.querySelectorAll(".product-btn[data-product]").forEach((button) => {
      const type = button.dataset.product;
      const busy = game && game.prep.some(item => item.type === type);
      const product = PRODUCTS.find((item) => item.id === type);
      const soldOut = product?.group === "cans" && game?.canStock[type] <= 0;
      button.disabled = !canUse || soldOut;
      button.classList.toggle("busy", !!busy);
    });
    const restock = $("restockBtn");
    if (restock) {
      const full = !game || Object.values(game.canStock).every((amount) => amount >= canCapacity());
      restock.disabled = !canPrep || full || game.prep.some((item) => item.kind === "restock");
      restock.classList.toggle("busy", !!game?.prep.some((item) => item.kind === "restock"));
    }
  }

  function updateQueueUI() {
    const count = game ? game.customers.length : 0;
    const max = maxQueue();
    $("queueCount").textContent = `${count} / ${max}`;
    const pips = $("queuePips");
    pips.innerHTML = Array.from({ length: max }, (_, i) => `<i class="${i < count ? "on" : ""}"></i>`).join("");
    const first = game?.customers.find((customer) => customer.status === "waiting");
    const pending = first?.orders.filter((_, index) => !first.completed[index]).map((id) => PRODUCTS.find((product) => product.id === id)?.name).filter(Boolean) || [];
    $("gameStatus").textContent = first ? `${count} customers in the queue. First order: ${pending.join(", ")}.` : "No customers are waiting.";
  }

  function updateGame(dt) {
    if (mode !== "playing" || !game || game.ended) return;
    game.elapsed += dt;
    game.time -= dt;
    game.spawnTimer -= dt;
    game.shake = Math.max(0, game.shake - dt);

    if (game.spawnTimer <= 0) {
      const added = addCustomer();
      const rush = game.loc.id === "football" && game.time < 42 && game.time > 25 ? .68 : 1;
      game.spawnTimer = added ? game.loc.spawn * rush * (.84 + Math.random() * .32) : .8;
    }

    const patienceRate = 1 - save.upgrades.till * .025;
    for (let i = game.customers.length - 1; i >= 0; i--) {
      const customer = game.customers[i];
      customer.entering = Math.max(0, customer.entering - dt * 2.6);
      customer.happyPulse = Math.max(0, (customer.happyPulse || 0) - dt);
      customer.mistakePulse = Math.max(0, (customer.mistakePulse || 0) - dt);
      if (customer.status === "celebrating") {
        customer.reaction -= dt;
        if (customer.reaction <= 0) customer.status = "leaving";
      } else if (customer.status === "leaving") {
        customer.exiting += dt * 2.15;
        if (customer.exiting >= 1) {
          game.customers.splice(i, 1);
          updateQueueUI();
        }
      } else {
        customer.patience -= dt * patienceRate;
        if (customer.patience <= 0) loseCustomer(i);
      }
    }

    for (let i = game.prep.length - 1; i >= 0; i--) {
      const item = game.prep[i];
      item.elapsed += dt;
      if (item.elapsed >= item.duration) {
        game.prep.splice(i, 1);
        if (item.kind === "restock") finishRestock();
        else serveCustomer(item.targetId, item.type, item.itemIndex);
      }
    }

    game.particles.forEach(p => {
      p.life -= dt;
      p.y -= dt * (p.rise ?? 24);
      p.x += dt * (p.vx ?? 0);
    });
    game.particles = game.particles.filter(p => p.life > 0);
    updateButtons();
    refreshHeader();
    if (game.time <= 0) endRound(false);
  }

  function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function roundedRect(c, x, y, w, h, radius, color) {
    c.fillStyle = color;
    c.beginPath();
    c.roundRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h), radius);
    c.fill();
  }
  function line(c, x1, y1, x2, y2, color, width = 2) { c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(Math.round(x1), Math.round(y1)); c.lineTo(Math.round(x2), Math.round(y2)); c.stroke(); }

  function pixelText(c, text, x, y, size, color, align = "left") {
    c.save();
    c.fillStyle = color;
    c.textAlign = align;
    c.textBaseline = "middle";
    c.font = `400 ${size}px "Changa One", Impact, sans-serif`;
    c.fillText(text, x, y);
    c.restore();
  }

  function imageCrop(image) {
    if (productImageCrops.has(image)) return productImageCrops.get(image);
    const maxSample = 256;
    const ratio = Math.min(1, maxSample / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * ratio));
    const height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const sample = document.createElement("canvas");
    sample.width = width;
    sample.height = height;
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
    sampleCtx.drawImage(image, 0, 0, width, height);
    const pixels = sampleCtx.getImageData(0, 0, width, height).data;
    let left = width, top = height, right = -1, bottom = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (pixels[(y * width + x) * 4 + 3] > 12) {
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
        }
      }
    }
    const scaleX = image.naturalWidth / width;
    const scaleY = image.naturalHeight / height;
    const margin = 3;
    const cropLeft = Math.max(0, left - margin);
    const cropTop = Math.max(0, top - margin);
    const cropRight = Math.min(width, right + margin + 1);
    const cropBottom = Math.min(height, bottom + margin + 1);
    const crop = right < left ? { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight } : {
      x: cropLeft * scaleX,
      y: cropTop * scaleY,
      w: (cropRight - cropLeft) * scaleX,
      h: (cropBottom - cropTop) * scaleY
    };
    productImageCrops.set(image, crop);
    return crop;
  }

  function drawImageAsset(c, imageSet, type, maxSize = 38) {
    const image = imageSet[type];
    if (!image?.complete || !image.naturalWidth) return false;
    const crop = imageCrop(image);
    const fit = Math.min(maxSize / crop.w, maxSize / crop.h);
    const width = crop.w * fit;
    const height = crop.h * fit;
    c.drawImage(image, crop.x, crop.y, crop.w, crop.h, -width / 2, -height / 2, width, height);
    return true;
  }

  function drawProductImage(c, type, maxSize = 38) {
    return drawImageAsset(c, productImages, type, maxSize);
  }

  function drawEffect(type, x, y, size, alpha = 1) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    drawImageAsset(ctx, effectImages, type, size);
    ctx.restore();
  }

  function drawEquipment(type, x, y, size, alpha = 1) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    drawImageAsset(ctx, equipmentImages, type, size);
    ctx.restore();
  }

  function drawTreat(c, type, x, y, s = 1) {
    c.save();
    c.translate(Math.round(x), Math.round(y));
    c.scale(s, s);
    if (drawProductImage(c, type)) {
      c.restore();
      return;
    }
    if (type === "lolly") {
      rect(c, -3, 9, 6, 13, "#b9813e");
      rect(c, -10, -17, 20, 9, "#e93448");
      rect(c, -10, -8, 20, 9, "#fffdf4");
      rect(c, -10, 1, 20, 9, "#33a8e8");
      rect(c, -7, -20, 14, 3, "#e93448");
    } else if (type === "sundae") {
      rect(c, -13, 0, 26, 15, "#74bfe8");
      rect(c, -10, 15, 20, 4, "#10243f");
      rect(c, -10, -4, 20, 9, "#fffdf4");
      rect(c, -7, -11, 14, 7, "#fffdf4");
      rect(c, -4, -16, 8, 5, "#fffdf4");
      rect(c, 4, -9, 5, 6, "#e93471");
      rect(c, -9, -2, 5, 4, "#e93471");
    } else if (["cola", "lemonade", "orange", "water"].includes(type)) {
      const colors = { cola: "#e93448", lemonade: "#ffd84d", orange: "#ff8b32", water: "#33a8e8" };
      rect(c, -10, -17, 20, 34, "#10243f");
      rect(c, -7, -14, 14, 28, colors[type]);
      rect(c, -7, -14, 14, 4, "#dbe7ed");
      rect(c, -7, 10, 14, 4, "#a7b9c5");
      rect(c, -3, -17, 7, 2, "#dbe7ed");
      pixelText(c, type === "cola" ? "C" : type === "water" ? "W" : type === "orange" ? "O" : "L", 0, 1, 11, type === "lemonade" ? "#10243f" : "#fffdf4", "center");
    } else if (["slushRed", "slushBlue", "slushMix"].includes(type)) {
      const primary = type === "slushBlue" ? "#29a9ee" : "#e93471";
      rect(c, -11, -11, 22, 25, "#10243f");
      rect(c, -8, -8, 16, 19, primary);
      if (type === "slushMix") rect(c, 0, -8, 8, 19, "#29a9ee");
      rect(c, -13, -14, 26, 5, "#fffdf4");
      line(c, 3, -14, 10, -25, type === "slushBlue" ? "#e93471" : "#33a8e8", 3);
      rect(c, -4, 14, 8, 3, "#10243f");
    } else if (["hotChoc", "hotCream", "hotDeluxe"].includes(type)) {
      rect(c, -12, -8, 22, 22, "#10243f");
      rect(c, -9, -5, 16, 16, "#8f4b32");
      rect(c, 10, -3, 6, 11, "#10243f");
      rect(c, 10, 0, 3, 5, "#fffdf4");
      if (type !== "hotChoc") rect(c, -8, -10, 14, 6, "#fffdf4");
      if (type === "hotDeluxe") { rect(c, -6, -13, 5, 5, "#ffd7d7"); rect(c, 2, -13, 5, 5, "#fffdf4"); }
      line(c, -5, -15, -2, -22, "#fffdf4", 2);
      line(c, 4, -15, 7, -22, "#fffdf4", 2);
    } else {
      c.fillStyle = "#f2ad3c";
      c.beginPath(); c.moveTo(-9, 5); c.lineTo(9, 5); c.lineTo(0, 23); c.fill();
      line(c, -6, 9, 5, 15, "#a96827", 2);
      line(c, 6, 9, -3, 17, "#a96827", 2);
      rect(c, -12, -3, 24, 9, "#fffdf4");
      rect(c, -9, -10, 18, 8, "#fffdf4");
      rect(c, -5, -15, 10, 5, "#fffdf4");
      if (type === "flake") {
        c.save(); c.rotate(.23); rect(c, 5, -20, 5, 22, "#6c3527"); c.restore();
      }
    }
    c.restore();
  }

  function drawCloud(x, y, s = 1) {
    rect(ctx, x, y, 80*s, 13*s, "#fffdf4");
    rect(ctx, x+15*s, y-11*s, 43*s, 11*s, "#fffdf4");
    rect(ctx, x+29*s, y-19*s, 24*s, 10*s, "#fffdf4");
    rect(ctx, x+8*s, y+13*s, 58*s, 4*s, "#d7ecf6");
  }

  function drawBackground(loc) {
    rect(ctx, 0, 0, 960, 540, loc.scene);
    if (loc.id === "london") {
      rect(ctx, 0, 0, 960, 270, "#372c63");
      rect(ctx, 0, 225, 960, 315, "#203d4e");
      for (let i=0;i<13;i++) {
        const h = 65 + (i%4)*25;
        rect(ctx, i*78, 235-h, 58, h, i%2 ? "#213253" : "#172841");
        for (let j=0;j<4;j++) rect(ctx, i*78+9+(j%2)*22, 190-h+j*24, 7, 9, (i+j)%3 ? "#ffd84d" : "#6c6fa4");
      }
      rect(ctx, 0, 320, 960, 220, "#2c6b59");
      rect(ctx, 0, 440, 960, 100, "#44505f");
      for (let i=0;i<10;i++) rect(ctx, i*112-20, 468, 62, 5, "#697483");
      rect(ctx, 30, 42, 5, 5, "#fff4a5"); rect(ctx, 188, 72, 4, 4, "#fff4a5"); rect(ctx, 774, 48, 5, 5, "#fff4a5");
    } else {
      drawCloud(90, 65, 1); drawCloud(610, 45, .8);
      if (loc.id === "seaside") {
        rect(ctx, 0, 255, 960, 120, "#177fb6");
        for (let i=0;i<12;i++) rect(ctx, i*96 + (i%2)*20, 280+(i%3)*16, 52, 4, "#8ed9ef");
        rect(ctx, 0, 366, 960, 174, "#c7a77c");
        rect(ctx, 0, 356, 960, 18, "#705b4d");
        for (let i=0;i<18;i++) rect(ctx, i*59, 390+(i%3)*27, 46, 4, "#a58463");
        rect(ctx, 820, 145, 8, 110, "#465773"); rect(ctx, 860, 145, 8, 110, "#465773");
        line(ctx, 808,145,842,100,"#465773",7); line(ctx, 842,100,879,145,"#465773",7); line(ctx,815,183,870,183,"#465773",5);
      } else if (loc.id === "village") {
        rect(ctx, 0, 250, 960, 290, "#4cae62");
        rect(ctx, 0, 357, 960, 183, "#77c46e");
        for (let i=0;i<15;i++) rect(ctx, i*80, 421+(i%3)*17, 5, 13, "#3e9850");
        line(ctx, 0,110,960,175,"#fffdf4",3);
        const flags=["#e93448","#ffd84d","#33a8e8","#fffdf4"];
        for(let i=0;i<18;i++){ctx.fillStyle=flags[i%4];ctx.beginPath();ctx.moveTo(i*58+5,114+i*4);ctx.lineTo(i*58+24,116+i*4);ctx.lineTo(i*58+15,134+i*4);ctx.fill();}
        rect(ctx, 755, 177, 120, 75, "#fffdf4");
        ctx.fillStyle="#e93448";ctx.beginPath();ctx.moveTo(735,178);ctx.lineTo(895,178);ctx.lineTo(815,123);ctx.fill();
      } else if (loc.id === "football") {
        rect(ctx, 0, 218, 960, 322, "#75889b");
        rect(ctx, 0, 308, 960, 232, "#4b9a5e");
        for(let i=0;i<20;i++){rect(ctx,i*50,168+(i%2)*15,45,105,"#243c5b");rect(ctx,i*50+7,184+(i%2)*15,7,7,"#ffd84d");rect(ctx,i*50+27,184+(i%2)*15,7,7,"#fffdf4");}
        rect(ctx,0,270,960,12,"#e9ad37");
        pixelText(ctx,"MATCH DAY",770,130,28,"#fffdf4","center");
      } else {
        rect(ctx, 0, 245, 960, 295, loc.scene);
        rect(ctx, 0, 390, 960, 150, "rgba(16,36,63,.18)");
      }
    }
  }

  function drawLocationArt(loc) {
    const image = locationImages[loc.id];
    if (image?.complete && image.naturalWidth) {
      ctx.drawImage(image, 0, 0, 960, 540);
    } else {
      drawBackground(loc);
    }

    const shade = ctx.createLinearGradient(0, 250, 0, 500);
    shade.addColorStop(0, "rgba(7,22,40,0)");
    shade.addColorStop(1, "rgba(7,22,40,.44)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 250, 960, 250);
  }

  function drawPrepStatus() {
    if (!game) return;
    const slots = prepSlots();
    const slotWidth = 86;
    const gap = 8;
    const totalWidth = slots * slotWidth + (slots - 1) * gap;
    const startX = 500 - totalWidth / 2;
    rect(ctx, startX - 100, 17, totalWidth + 111, 55, "rgba(7,22,40,.9)");
    pixelText(ctx, "HATCH PREP", startX - 12, 45, 13, "#ffd84d", "right");

    for (let i = 0; i < slots; i++) {
      const item = game.prep[i];
      const x = startX + i * (slotWidth + gap);
      rect(ctx, x, 29, slotWidth, 31, "#10243f");
      rect(ctx, x + 4, 33, slotWidth - 8, 23, "#506276");
      if (item) {
        rect(ctx, x + 4, 33, (slotWidth - 8) * Math.min(1, item.elapsed / item.duration), 23, "#54d69b");
        if (item.kind === "restock") {
          drawEquipment("canCrate", x + slotWidth / 2, 44, 28);
        } else {
          drawTreat(ctx, prepArtwork(item), x + slotWidth / 2, 43, .55);
          const product = PRODUCTS.find((candidate) => candidate.id === item.type);
          if (product?.group === "hot" && item.elapsed / item.duration > .18) {
            drawEffect("steam", x + slotWidth / 2 + 16, 35, 24, .72);
          }
        }
      } else {
        pixelText(ctx, "READY", x + slotWidth / 2, 45, 12, "#d8e7ee", "center");
      }
    }
  }

  function prepArtwork(item) {
    const product = PRODUCTS.find((candidate) => candidate.id === item.type);
    if (!product) return item.type;
    const progress = Math.min(1, item.elapsed / item.duration);
    if (product.group === "slush") {
      if (progress < .2) return "emptyCold";
      if (progress < .42) return item.type;
      if (progress < .62) return "coldLid";
      if (progress < .82) return "straw";
    }
    if (product.group === "hot") {
      if (progress < .25) return "emptyHot";
      if (progress < .7) return item.type;
      if (progress < .86) return "hotLid";
    }
    return item.type;
  }

  function drawLegacyVan() {
    const x=34, y=225;
    rect(ctx,x+35,y+35,510,202,"#10243f");
    rect(ctx,x+42,y+27,494,194,"#fffdf4");
    rect(ctx,x+173,y+1,363,220,"#fffdf4");
    ctx.fillStyle="#fffdf4";ctx.beginPath();ctx.moveTo(x+42,y+27);ctx.lineTo(x+173,y+1);ctx.lineTo(x+173,y+220);ctx.lineTo(x+42,y+220);ctx.fill();
    rect(ctx,x+51,y+73,118,76,"#1f5e83");
    ctx.fillStyle="#6ec5e9";ctx.beginPath();ctx.moveTo(x+59,y+78);ctx.lineTo(x+154,y+57);ctx.lineTo(x+154,y+132);ctx.lineTo(x+76,y+132);ctx.fill();
    rect(ctx,x+159,y+58,8,95,"#10243f");
    line(ctx,x+55,y+154,x+164,y+154,"#10243f",5);
    rect(ctx,x+42,y+164,494,31,"#e93448"); rect(ctx,x+42,y+195,494,13,"#33a8e8");
    rect(ctx,x+233,y+35,246,122,"#10243f");
    rect(ctx,x+241,y+43,230,106,"#e5f2f7");
    rect(ctx,x+241,y+43,230,15,"#e93448");
    for(let i=0;i<8;i++) rect(ctx,x+241+i*29,y+43,14,15,i%3===1?"#33a8e8":i%3===2?"#fffdf4":"#e93448");
    rect(ctx,x+260,y+72,59,68,"#b8c8d1"); rect(ctx,x+269,y+81,41,19,"#708596");
    rect(ctx,x+276,y+105,5,27,"#10243f"); rect(ctx,x+298,y+105,5,27,"#10243f");
    rect(ctx,x+339,y+83,83,57,"#fffdf4");
    const stationEquipment = selectedCategory === "cans"
      ? (save.upgrades.freezer >= 2 ? "fridgeUpgraded" : "fridge")
      : selectedCategory === "slush"
        ? (save.upgrades.slushMachine >= 2 ? "slushUpgraded" : "slush")
        : selectedCategory === "hot"
          ? (save.upgrades.boiler >= 2 ? "boilerUpgraded" : "boiler")
          : (save.upgrades.machine >= 2 ? "machineUpgraded" : "machine");
    if (stationEquipment) drawEquipment(stationEquipment,x+382,y+109,72);
    rect(ctx,x+486,y+44,41,105,"#dce9ee");
    rect(ctx,x+91,y+208,61,25,"#10243f"); rect(ctx,x+430,y+208,61,25,"#10243f");
    ctx.fillStyle="#10243f";ctx.beginPath();ctx.arc(x+121,y+220,38,0,Math.PI*2);ctx.arc(x+460,y+220,38,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ced8df";ctx.beginPath();ctx.arc(x+121,y+220,20,0,Math.PI*2);ctx.arc(x+460,y+220,20,0,Math.PI*2);ctx.fill();
    rect(ctx,x+25,y+192,40,24,"#d6e0e5"); rect(ctx,x+505,y+191,40,25,"#d6e0e5");
    rect(ctx,x+46,y+180,16,10,"#ffd84d");
    rect(ctx,x+181,y+18,328,17,"#10243f");
    pixelText(ctx,"WHITBY WHIPPY",x+345,y+27,18,"#fffdf4","center");
    pixelText(ctx,"WHITBY MORRISON COACHBUILT",x+345,y+183,10,"#fffdf4","center");
  }

  function drawVan() {
    const skin = VAN_SKINS.find((candidate) => candidate.id === save.vanSkin) || VAN_SKINS[0];
    const image = vanImages[skin.id];
    if (!image?.complete || !image.naturalWidth) {
      drawLegacyVan();
      return;
    }

    const crop = imageCrop(image);
    const width = 620;
    const height = width * crop.h / crop.w;
    const x = 14;
    const y = 463 - height;
    ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, x, y, width, height);

    const hatchX = x + 252;
    const hatchY = y + 87;
    const hatchW = 256;
    const hatchH = 92;
    rect(ctx, hatchX - 5, hatchY - 5, hatchW + 10, hatchH + 10, "#10243f");
    rect(ctx, hatchX, hatchY, hatchW, hatchH, "#eaf6fa");
    rect(ctx, hatchX, hatchY, hatchW, 14, "#fffdf4");
    for (let stripe = 0; stripe < 12; stripe++) {
      rect(ctx, hatchX + stripe * 22, hatchY, 11, 14, stripe % 3 === 1 ? "#54d69b" : "#e93448");
    }
    rect(ctx, hatchX + 8, hatchY + 65, hatchW - 16, 18, "#10243f");
    pixelText(ctx, PRODUCT_GROUPS[selectedCategory].short, hatchX + 17, hatchY + 74, 10, "#ffd84d");

    const stationEquipment = selectedCategory === "cans"
      ? (save.upgrades.freezer >= 2 ? "fridgeUpgraded" : "fridge")
      : selectedCategory === "slush"
        ? (save.upgrades.slushMachine >= 2 ? "slushUpgraded" : "slush")
        : selectedCategory === "hot"
          ? (save.upgrades.boiler >= 2 ? "boilerUpgraded" : "boiler")
          : (save.upgrades.machine >= 2 ? "machineUpgraded" : "machine");
    drawEquipment(stationEquipment, hatchX + 157, hatchY + 48, 72);
    drawEquipment(save.upgrades.till >= 2 ? "tillUpgraded" : "till", hatchX + 222, hatchY + 48, 52);

    const showcase = selectedCategory === "ice"
      ? ["whippy", "flake", "lolly"]
      : locationProducts().filter((product) => product.group === selectedCategory).slice(0, 3).map((product) => product.id);
    showcase.forEach((product, index) => drawTreat(ctx, product, hatchX + 41 + index * 34, hatchY + 46, .58));
  }

  function cleanCustomerSheet(character) {
    if (customerCleanImages.has(character)) return customerCleanImages.get(character);
    const image = customerImages[character];
    if (!image?.complete || !image.naturalWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const cleanCtx = canvas.getContext("2d", { willReadFrequently: true });
    cleanCtx.imageSmoothingEnabled = false;
    cleanCtx.drawImage(image, 0, 0);
    const imageData = cleanCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i], green = pixels[i + 1], blue = pixels[i + 2];
      if (pixels[i + 3] > 0 && red > 210 && green < 52 && blue < 52 && red - Math.max(green, blue) > 165) pixels[i + 3] = 0;
    }
    cleanCtx.putImageData(imageData, 0, 0);
    const cleaned = { canvas, pixels, width: canvas.width, height: canvas.height };
    customerCleanImages.set(character, cleaned);
    return cleaned;
  }

  function customerFrameCrop(character, frame) {
    const key = `${character}-${frame}`;
    if (customerFrameCrops.has(key)) return customerFrameCrops.get(key);
    const cleaned = cleanCustomerSheet(character);
    if (!cleaned) return null;
    const startX = Math.floor(frame * cleaned.width / 5);
    const endX = Math.floor((frame + 1) * cleaned.width / 5);
    let left = endX, top = cleaned.height, right = -1, bottom = -1;
    for (let y = 0; y < cleaned.height; y++) {
      for (let x = startX; x < endX; x++) {
        if (cleaned.pixels[(y * cleaned.width + x) * 4 + 3] > 12) {
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
        }
      }
    }
    const margin = 2;
    const crop = right < left ? null : {
      source: cleaned.canvas,
      x: Math.max(startX, left - margin),
      y: Math.max(0, top - margin),
      w: Math.min(endX, right + margin + 1) - Math.max(startX, left - margin),
      h: Math.min(cleaned.height, bottom + margin + 1) - Math.max(0, top - margin)
    };
    customerFrameCrops.set(key, crop);
    return crop;
  }

  function drawCustomerSprite(customer, x, y, frame, flip, moving) {
    const crop = customerFrameCrop(customer.character, frame);
    if (!crop) return false;
    const height = 118;
    const scale = height / crop.h;
    const width = crop.w * scale;
    const step = Math.sin((game.elapsed + customer.phase) * 15);
    ctx.save();
    ctx.globalAlpha = .22;
    ctx.fillStyle = "#10243f";
    ctx.beginPath();
    ctx.ellipse(x, y + 48, Math.min(25, width * .33), 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y + 48 + (moving ? Math.abs(step) * -2 : 0)));
    if (flip) ctx.scale(-1, 1);
    if (moving) ctx.rotate(step * .018);
    ctx.drawImage(crop.source, crop.x, crop.y, crop.w, crop.h, -width / 2, -height, width, height);
    ctx.restore();
    return true;
  }

  function drawCustomer(customer, index, total) {
    const spacing = Math.min(76, 310 / Math.max(1, total));
    const moving = customer.entering > 0 || customer.status === "leaving";
    const x = 650 + index * spacing + customer.entering * 145 + (customer.exiting || 0) * 175;
    const bob = Math.round(Math.sin((game.elapsed + customer.phase) * (moving ? 8 : 4)) * (moving ? 1 : 2));
    const y = 372 + bob;
    const ratio = Math.max(0, customer.patience / customer.maxPatience);
    let frame = 0;
    if (moving) frame = 4;
    else if (customer.status === "celebrating" || customer.happyPulse > 0) frame = 3;
    else if (customer.mistakePulse > 0 || ratio < .42) frame = 2;
    else if (Math.floor((game.elapsed + customer.phase) * 1.35) % 6 === 0) frame = 1;
    const rendered = drawCustomerSprite(customer, x, y, frame, customer.entering > 0, moving);
    if (!rendered) {
      const [skin,hair,shirt] = customer.look;
      rect(ctx,x-15,y-63,30,25,skin);
      rect(ctx,x-17,y-68,34,11,hair); rect(ctx,x-17,y-60,7,15,hair);
      rect(ctx,x-18,y-38,36,43,shirt);
      rect(ctx,x-21,y+5,15,38,"#263b5c"); rect(ctx,x+6,y+5,15,38,"#263b5c");
      rect(ctx,x-22,y+41,19,7,"#10243f"); rect(ctx,x+4,y+41,19,7,"#10243f");
    }
    if (customer.status !== "waiting") return;
    const bubbleW=Math.max(56,customer.orders.length*34+14),bubbleX=x-bubbleW/2,bubbleY=y-126-(index%2)*58;
    roundedRect(ctx,bubbleX-4,bubbleY-4,bubbleW+8,55,11,"#10243f"); roundedRect(ctx,bubbleX,bubbleY,bubbleW,47,8,"#fffdf4");
    ctx.fillStyle="#10243f";ctx.beginPath();ctx.moveTo(x-5,bubbleY+51);ctx.lineTo(x+7,bubbleY+51);ctx.lineTo(x+1,bubbleY+61);ctx.fill();
    customer.orders.forEach((order,itemIndex)=>{
      const itemX=bubbleX+17+itemIndex*34;
      ctx.save();
      if(customer.completed[itemIndex]) ctx.globalAlpha=.28;
      drawTreat(ctx,order,itemX,bubbleY+23,.62);
      ctx.restore();
      if(customer.completed[itemIndex]){
        rect(ctx,itemX-10,bubbleY+34,20,8,"#54d69b");
        pixelText(ctx,"OK",itemX,bubbleY+38,8,"#10243f","center");
      }
    });
    rect(ctx,x-23,y+55,47,8,"#10243f");
    rect(ctx,x-21,y+57,43*ratio,4,ratio>.55?"#54d69b":ratio>.25?"#ffd84d":"#e93448");
  }

  function renderGame() {
    const loc = game ? game.loc : LOCATIONS[selectedLocation];
    ctx.save();
    if (game && game.shake > 0) ctx.translate((Math.random()-.5)*8,(Math.random()-.5)*5);
    drawLocationArt(loc);
    if (loc.id === "christmas") {
      drawEffect("festiveLights", 480, 70, 620, .9);
      drawEffect("snow", 820, 165 + Math.sin((game?.elapsed || 0) * 1.8) * 8, 150, .56);
    } else if (loc.id === "sydney") {
      drawEffect("heatShimmer", 820, 170 + Math.sin((game?.elapsed || 0) * 2.2) * 6, 150, .42);
    }
    drawVan();
    drawPrepStatus();
    if (game) game.customers.forEach((customer,i) => drawCustomer(customer,i,game.customers.length));
    rect(ctx,0,486,960,54,"#10243f");
    rect(ctx,0,486,960,5,"#e93448");
    if (game) {
      pixelText(ctx,game.loc.name.toUpperCase(),24,510,19,"#fffdf4");
      pixelText(ctx,`${game.served} SERVED`,936,510,17,"#ffd84d","right");
      if (game.combo >= 4) pixelText(ctx,`COMBO x${game.combo}`,625,510,21,"#54d69b","center");
      game.particles.forEach((p) => {
        const alpha = Math.max(0, p.life / (p.maxLife || 1));
        if (p.effect) drawEffect(p.effect, p.x, p.y, p.size || 60, alpha);
        if (p.text) {
          ctx.globalAlpha = alpha;
          pixelText(ctx, p.text, p.x, p.y, 18, p.color, "center");
          ctx.globalAlpha = 1;
        }
      });
      if (game.loc.id === "football" && game.time < 42 && game.time > 25) {
        rect(ctx,710,16,225,35,"#e93448"); pixelText(ctx,"HALF-TIME RUSH!",822,34,20,"#fffdf4","center");
      }
    }
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min(.05, (now - lastTime) / 1000);
    lastTime = now;
    updateGame(dt);
    renderGame();
    requestAnimationFrame(loop);
  }

  function pauseGame() {
    if (mode !== "playing") return;
    mode = "paused";
    showScreen("pauseScreen");
    updateButtons();
    refreshHeader();
    playTone("pause");
  }

  function resumeGame() {
    if (mode !== "paused") return;
    mode = "playing";
    showScreen(null);
    lastTime = performance.now();
    updateButtons();
    refreshHeader();
    playTone("ui");
  }

  function scrollMenu(direction) {
    if (mode !== "playing" || !game) return;
    $("productButtons").scrollBy({ left: direction * 260, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  $("playBtn").addEventListener("click", () => {
    if (!save.helpSeen) {
      save.helpSeen = true;
      persist();
      openHelp("locationScreen");
    } else openLocations();
  });
  $("howBtn").addEventListener("click", () => openHelp("titleScreen"));
  $("helpBackBtn").addEventListener("click", closeHelp);
  $("backTitleBtn").addEventListener("click", () => { mode="title"; showScreen("titleScreen"); refreshHeader(); playTone("ui"); });
  $("brandBtn").addEventListener("click", () => {
    const roundContext = game && !game.ended && (
      ["playing", "paused"].includes(mode) ||
      (mode === "help" && ["game", "pauseScreen"].includes(previousScreen)) ||
      (mode === "garage" && ["game", "pauseScreen"].includes(garageReturn))
    );
    if (roundContext) {
      restoreContext("pauseScreen");
      return;
    }
    mode="title"; showScreen("titleScreen"); refreshHeader(); playTone("ui");
  });
  $("garageBtn").addEventListener("click", () => openGarage("locationScreen"));
  $("garageBackBtn").addEventListener("click", closeGarage);
  $("resultsGarageBtn").addEventListener("click", () => openGarage("resultsScreen"));
  $("topHelpBtn").addEventListener("click", () => openHelp(currentContext()));
  $("topGarageBtn").addEventListener("click", () => {
    const active = activeScreenId();
    if (active === "garageScreen") return;
    if (active === "helpScreen" && previousScreen === "garageScreen") {
      restoreContext("garageScreen");
      playTone("ui");
      return;
    }
    openGarage(active === "helpScreen" ? previousScreen : currentContext());
  });
  $("locationsBtn").addEventListener("click", openLocations);
  $("againBtn").addEventListener("click", () => startRound(selectedLocation));
  $("pauseBtn").addEventListener("click", pauseGame);
  $("resumeBtn").addEventListener("click", resumeGame);
  $("quitBtn").addEventListener("click", () => endRound(true));
  $("soundBtn").addEventListener("click", () => { save.sound=!save.sound;persist();refreshHeader();if(save.sound)playTone("buy"); });

  document.addEventListener("keydown", (event) => {
    if (["INPUT","TEXTAREA","SELECT"].includes(event.target.tagName)) return;
    const keyIndex = Number(event.key) - 1;
    if (keyIndex >= 0 && visibleProductIds[keyIndex]) { event.preventDefault(); startProduct(visibleProductIds[keyIndex]); }
    if (event.code === "Space" && mode === "playing") {
      event.preventDefault();
      const first = game.customers.find((customer) => customer.status === "waiting" && customer.completed.some((done) => !done));
      const itemIndex = first?.completed.findIndex((done) => !done);
      if (first && itemIndex >= 0) {
        const product = PRODUCTS.find((item) => item.id === first.orders[itemIndex]);
        startProduct(product.id);
      }
    }
    if ((event.key.toLowerCase() === "q" || event.key === "ArrowLeft") && mode === "playing") { event.preventDefault(); scrollMenu(-1); }
    if ((event.key.toLowerCase() === "e" || event.key === "ArrowRight") && mode === "playing") { event.preventDefault(); scrollMenu(1); }
    if (event.key === "Escape") {
      if (mode === "playing") pauseGame();
      else if (mode === "paused") resumeGame();
      else if (mode === "help") closeHelp();
      else if (mode === "garage") closeGarage();
    }
  });

  document.addEventListener("visibilitychange", () => { if (document.hidden && mode === "playing") pauseGame(); });

  async function runLoadingScreen() {
    const loader = $("loadingScreen");
    const bar = $("loadingBar");
    const label = $("loadingPercent");
    if (!loader || !bar || !label) return;
    const imageSets = [productImages, equipmentImages, effectImages, vanImages, customerImages, locationImages, uiImages];
    const imageMap = new Map();
    imageSets.flatMap((set) => Object.values(set)).forEach((image) => imageMap.set(image.src, image));
    const images = [...imageMap.values()];
    let complete = 0;
    const update = () => {
      const percent = images.length ? Math.round(complete / images.length * 100) : 100;
      bar.style.width = `${percent}%`;
      label.textContent = `LOADING ${percent}%`;
    };
    const waitForImage = (image) => new Promise((resolve) => {
      const done = () => { complete += 1; update(); resolve(); };
      if (image.complete) done();
      else {
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      }
    });
    update();
    const preload = Promise.all([
      ...images.map(waitForImage),
      document.fonts?.ready || Promise.resolve()
    ]);
    await Promise.all([
      Promise.race([preload, new Promise((resolve) => setTimeout(resolve, 6000))]),
      new Promise((resolve) => setTimeout(resolve, 500))
    ]);
    complete = images.length;
    update();
    await new Promise((resolve) => setTimeout(resolve, 140));
    loader.classList.add("ready");
    setTimeout(() => loader.remove(), 500);
  }

  buildProductButtons();
  updateQueueUI();
  refreshHeader();
  showScreen("titleScreen");
  runLoadingScreen();
  requestAnimationFrame(loop);
})();
