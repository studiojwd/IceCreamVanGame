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
    slush: "assets/equipment/slush-machine-twin.png",
    slushUpgraded: "assets/equipment/slush-machine-twin-upgraded.png",
    cups: "assets/equipment/cup-lid-dispenser.png",
    cupsUpgraded: "assets/equipment/cup-lid-dispenser-upgraded.png",
    boiler: "assets/equipment/hot-chocolate-boiler.png",
    boilerUpgraded: "assets/equipment/hot-chocolate-boiler-upgraded.png",
    fridge: "assets/equipment/drinks-fridge.png",
    fridgeUpgraded: "assets/equipment/drinks-fridge-upgraded.png",
    restockBox: "assets/equipment/restocking-box.png",
    canCrate: "assets/equipment/can-crate.png"
  };

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

  const PRODUCT_GROUPS = {
    ice: { label: "ICE CREAM", short: "ICE" },
    cans: { label: "COLD CANS", short: "CANS" },
    slush: { label: "SLUSH BAR", short: "SLUSH" },
    hot: { label: "HOT DRINKS", short: "HOT" }
  };

  const LOCATIONS = [
    { id: "seaside", name: "Seaside", detail: "SEA BREEZE · STEADY QUEUE", unlock: 0, duration: 75, spawn: 3.5, patience: 18, mult: 1, groups: ["ice"], maxItems: 1, groupChance: 0, scene: "#38aee8", asset: "assets/location-seaside.jpg" },
    { id: "village", name: "Village Fête", detail: "CANS · FAMILY RUSH", unlock: 2400, duration: 75, spawn: 3, patience: 17, mult: 1.15, groups: ["ice", "cans"], maxItems: 1, groupChance: 0, scene: "#54be75", asset: "assets/location-village.jpg" },
    { id: "football", name: "Football Match", detail: "GROUP ORDERS · HALF-TIME", unlock: 6500, duration: 80, spawn: 2.45, patience: 16, mult: 1.35, groups: ["ice", "cans"], maxItems: 2, groupChance: .42, scene: "#e9ad37", asset: "assets/location-football.jpg" },
    { id: "london", name: "London", detail: "SLUSHES · TOURIST GROUPS", unlock: 11500, duration: 82, spawn: 2.2, patience: 15.5, mult: 1.55, groups: ["ice", "cans", "slush"], maxItems: 2, groupChance: .5, scene: "#e36d55", asset: "assets/location-london.jpg" },
    { id: "christmas", name: "Christmas", detail: "HOT CHOCOLATE · FESTIVE RUSH", unlock: 17500, duration: 85, spawn: 2.05, patience: 15, mult: 1.75, groups: ["ice", "hot"], maxItems: 2, groupChance: .55, scene: "#5267b7", asset: "assets/location-christmas.jpg" },
    { id: "market", name: "Evening Market", detail: "FULL MENU · TRIPLE ORDERS", unlock: 25000, duration: 85, spawn: 1.85, patience: 14.5, mult: 1.95, groups: ["ice", "cans", "slush", "hot"], maxItems: 3, groupChance: .62, scene: "#674f9c", asset: "assets/location-evening-market.jpg" },
    { id: "sydney", name: "Sydney Opera House", detail: "HEATWAVE · WORLD TOUR", unlock: 36000, duration: 90, spawn: 1.7, patience: 13.5, mult: 2.2, groups: ["ice", "cans", "slush", "hot"], maxItems: 3, groupChance: .7, scene: "#20a4de", asset: "assets/location-sydney.jpg" }
  ];

  const locationImages = Object.fromEntries(LOCATIONS.map((location) => {
    const image = new Image();
    image.src = location.asset;
    return [location.id, image];
  }));

  const UPGRADES = [
    { id: "machine", icon: "M", name: "Soft-Serve Machine", desc: "Whips cones and 99s 13% faster per level.", base: 120 },
    { id: "heads", icon: "2×", name: "Twin-Head Setup", desc: "Adds simultaneous prep slots at levels 1 and 3.", base: 180 },
    { id: "freezer", icon: "F", name: "Display Freezer", desc: "Adds can stock and serves cans, lollies and sundaes faster.", base: 135, equipment: ["fridge", "fridgeUpgraded"] },
    { id: "slushMachine", icon: "S", name: "Slush Machine", desc: "Cuts slush preparation time by 13% per level.", base: 190, equipment: ["slush", "slushUpgraded"] },
    { id: "boiler", icon: "H", name: "Chocolate Boiler", desc: "Pours hot chocolate 13% faster per level.", base: 190, equipment: ["boiler", "boilerUpgraded"] },
    { id: "till", icon: "£", name: "Contactless Till", desc: "Faster payment keeps patience high and lifts every tip.", base: 150 },
    { id: "hatch", icon: "H", name: "Serving Hatch", desc: "A wider hatch holds a larger, more patient queue.", base: 165, equipment: ["cups", "cupsUpgraded"] },
    { id: "power", icon: "⚡", name: "Quiet Generator", desc: "More reliable power speeds up every order.", base: 210 }
  ];

  const DEFAULT_SAVE = {
    bank: 0,
    career: 0,
    highs: { seaside: 0, village: 0, football: 0, london: 0, christmas: 0, market: 0, sydney: 0 },
    upgrades: { machine: 0, heads: 0, freezer: 0, slushMachine: 0, boiler: 0, till: 0, hatch: 0, power: 0 },
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
      return {
        ...structuredClone(DEFAULT_SAVE),
        ...raw,
        highs: { ...DEFAULT_SAVE.highs, ...migratedHighs },
        upgrades: { ...DEFAULT_SAVE.upgrades, ...(raw.upgrades || {}) }
      };
    } catch (_) {
      return structuredClone(DEFAULT_SAVE);
    }
  }

  let save = loadSave();
  let mode = "title";
  let selectedLocation = 0;
  let previousScreen = "titleScreen";
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
  function formatTime(value) {
    const v = Math.max(0, Math.ceil(value));
    return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
  }

  function careerBest() { return Math.max(save.career, ...Object.values(save.highs)); }
  function unlocked(loc) { return careerBest() >= loc.unlock; }
  function maxQueue() { return 5 + Math.floor(save.upgrades.hatch / 2); }
  function prepSlots() { return 1 + (save.upgrades.heads >= 1 ? 1 : 0) + (save.upgrades.heads >= 3 ? 1 : 0); }

  function playTone(kind) {
    if (!save.sound) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime;
      const notes = kind === "serve" ? [523, 659, 784] : kind === "bad" ? [180, 140] : kind === "buy" ? [440, 660] : [320];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(.035, now + i * .07);
        gain.gain.exponentialRampToValueAtTime(.001, now + i * .07 + .11);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + i * .07);
        osc.stop(now + i * .07 + .12);
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

    const tabs = $("categoryTabs");
    tabs.innerHTML = "";
    groups.forEach((group) => {
      const tab = document.createElement("button");
      tab.className = `category-tab${group === selectedCategory ? " active" : ""}`;
      tab.textContent = PRODUCT_GROUPS[group].label;
      tab.setAttribute("aria-pressed", group === selectedCategory ? "true" : "false");
      tab.addEventListener("click", () => {
        selectedCategory = group;
        buildProductButtons();
        updateButtons();
      });
      tabs.appendChild(tab);
    });

    const holder = $("productButtons");
    holder.innerHTML = "";
    const products = locationProducts(loc).filter((product) => product.group === selectedCategory);
    visibleProductIds = products.map((product) => product.id);
    products.forEach((product, index) => {
      const key = String(index + 1);
      const button = document.createElement("button");
      button.className = "product-btn";
      button.dataset.product = product.id;
      button.setAttribute("aria-label", `Prepare ${product.name}, key ${key}`);
      const stock = product.group === "cans" && game ? ` · STOCK ${game.canStock[product.id]}` : "";
      button.innerHTML = `<canvas width="48" height="48" aria-hidden="true"></canvas><span><strong>${product.short}</strong><small>£${product.price}${stock}</small></span><i class="key">${key}</i>`;
      button.addEventListener("click", () => startProduct(product.id));
      holder.appendChild(button);
      const iconCtx = button.querySelector("canvas").getContext("2d");
      iconCtx.imageSmoothingEnabled = false;
      drawTreat(iconCtx, product.id, 24, 24, 1.15);
      button.style.setProperty("--order", index);
    });

    if (selectedCategory === "cans") {
      const restock = document.createElement("button");
      restock.id = "restockBtn";
      restock.className = "product-btn restock-btn";
      restock.setAttribute("aria-label", "Restock canned drinks");
      restock.innerHTML = `<img class="restock-art" src="${EQUIPMENT_ASSETS.restockBox}" alt="" aria-hidden="true"><span><strong>RESTOCK</strong><small>REFILL THE FRIDGE</small></span>`;
      restock.addEventListener("click", restockCans);
      holder.appendChild(restock);
    }
  }

  function refreshHeader() {
    const active = game && (mode === "playing" || mode === "paused");
    $("scoreValue").textContent = formatScore(active ? game.score : 0);
    $("cashValue").textContent = `£${active ? game.cash : save.bank}`;
    $("timeValue").textContent = formatTime(active ? game.time : LOCATIONS[selectedLocation].duration);
    $("comboValue").textContent = `x${active ? Math.max(1, game.combo) : 1}`;
    $("careerBest").textContent = formatScore(careerBest());
    $("soundBtn").textContent = save.sound ? "♪" : "×";
    $("pauseBtn").disabled = mode !== "playing";
  }

  function renderLocations() {
    $("bankValue").textContent = `£${save.bank}`;
    const grid = $("locationGrid");
    grid.innerHTML = "";
    LOCATIONS.forEach((loc, index) => {
      const isOpen = unlocked(loc);
      const button = document.createElement("button");
      button.className = `location-card${index === selectedLocation ? " selected" : ""}`;
      button.style.setProperty("--scene", loc.scene);
      button.style.backgroundImage = `url("${loc.asset}")`;
      button.disabled = !isOpen;
      button.innerHTML = `${isOpen ? "" : `<span class="lock">SCORE ${formatScore(loc.unlock)} TO UNLOCK</span>`}<strong>${loc.name}</strong><small>${loc.detail}</small><small class="record">BEST ${formatScore(save.highs[loc.id])}</small>`;
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

  function renderGarage() {
    $("garageBank").textContent = `£${save.bank}`;
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

  function openGarage() {
    mode = "menu";
    renderGarage();
    showScreen("garageScreen");
    refreshHeader();
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
    playTone("buy");
  }

  function endRound(quit = false) {
    if (!game || game.ended) return;
    game.ended = true;
    const loc = game.loc;
    const beforeCareer = careerBest();
    const previousHigh = save.highs[loc.id] || 0;
    if (!quit) {
      save.bank += game.cash;
      save.highs[loc.id] = Math.max(previousHigh, Math.round(game.score));
      save.career = Math.max(save.career, Math.round(game.score));
    }
    persist();
    mode = "results";
    $("resultEyebrow").textContent = quit ? "HATCH CLOSED EARLY" : "SHIFT COMPLETE";
    $("resultsHeading").textContent = quit ? "PACKING UP?" : game.score >= loc.unlock + 3500 ? "WHAT A ROUND!" : "NICE WORK!";
    $("finalScore").textContent = formatScore(game.score);
    $("servedResult").textContent = game.served;
    $("comboResult").textContent = `x${Math.max(1, game.bestCombo)}`;
    $("cashResult").textContent = `£${quit ? 0 : game.cash}`;
    $("newBest").classList.toggle("hidden", quit || game.score <= previousHigh);
    const afterCareer = careerBest();
    const newlyUnlocked = LOCATIONS.find((place) => place.unlock > beforeCareer && place.unlock <= afterCareer);
    const unlock = $("unlockNotice");
    unlock.classList.toggle("hidden", !newlyUnlocked);
    unlock.textContent = newlyUnlocked ? `NEW PITCH UNLOCKED · ${newlyUnlocked.name.toUpperCase()}` : "";
    showScreen("resultsScreen");
    refreshHeader();
  }

  function addCustomer() {
    if (!game || game.customers.length >= maxQueue()) return false;
    const locIndex = LOCATIONS.indexOf(game.loc);
    let pool = locationProducts(game.loc);
    if (locIndex === 0 && game.elapsed < 12) pool = pool.slice(0, 2);
    let itemCount = 1;
    if (game.loc.maxItems >= 2 && Math.random() < game.loc.groupChance) itemCount = 2;
    if (game.loc.maxItems >= 3 && itemCount === 2 && Math.random() < .42) itemCount = 3;
    const orders = Array.from({ length: itemCount }, () => pool[Math.floor(Math.random() * pool.length)].id);
    const patienceBoost = 1 + save.upgrades.hatch * .055 + save.upgrades.till * .04;
    const orderBoost = 1 + (itemCount - 1) * .22;
    const maxPatience = game.loc.patience * patienceBoost * orderBoost * (.88 + Math.random() * .28);
    game.customers.push({
      id: `${Date.now()}-${Math.random()}`,
      orders,
      completed: orders.map(() => false),
      patience: maxPatience,
      maxPatience,
      look: customerLooks[Math.floor(Math.random() * customerLooks.length)],
      phase: Math.random() * Math.PI * 2,
      entering: 1
    });
    updateQueueUI();
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
    playTone("tap");
    updateButtons();
  }

  function finishRestock() {
    const stock = canCapacity();
    game.canStock = { cola: stock, lemonade: stock, orange: stock, water: stock };
    buildProductButtons();
    updateButtons();
    pushEffect("fizz", 760, 235, 70, 1, 8);
    showToast("DRINKS FRIDGE FULL", "good");
    playTone("buy");
  }

  function pushEffect(effect, x, y, size = 64, life = 1, rise = 14, vx = 0) {
    if (!game) return;
    game.particles.push({ effect, x, y, size, life, maxLife: life, rise, vx });
  }

  function mistake(message, cashPenalty = 0) {
    if (!game) return;
    game.combo = 0;
    game.score = Math.max(0, game.score - 60);
    game.cash = Math.max(0, game.cash - cashPenalty);
    game.shake = .25;
    game.customers.forEach(c => { c.patience = Math.max(.4, c.patience - .45); });
    pushEffect("wrongOrder", 760, 235, 82, 1.1, 7);
    showToast(cashPenalty ? `${message} · -£${cashPenalty} TAKINGS` : message, "bad");
    playTone("bad");
    refreshHeader();
  }

  function serveCustomer(targetId, productId, targetItemIndex) {
    let index = game.customers.findIndex((customer) => customer.id === targetId);
    let itemIndex = targetItemIndex;
    let customer = game.customers[index];
    if (index < 0 || customer.completed[itemIndex] || customer.orders[itemIndex] !== productId) {
      const fallback = findPendingOrder(productId);
      if (fallback) {
        index = game.customers.indexOf(fallback.customer);
        customer = fallback.customer;
        itemIndex = fallback.itemIndex;
      }
    }
    if (!customer || itemIndex < 0) {
      mistake("ORDER LEFT THE QUEUE");
      return;
    }
    customer.completed[itemIndex] = true;
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
    const orderComplete = customer.completed.every(Boolean);
    let groupBonus = 0;
    if (orderComplete) {
      groupBonus = Math.round((customer.orders.length - 1) * 130 * game.loc.mult);
      game.score += groupBonus;
      game.served += 1;
      game.customers.splice(index, 1);
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
    game.customers.splice(index, 1);
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
    const canUse = mode === "playing" && game && game.prep.length < prepSlots();
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
      restock.disabled = mode !== "playing" || !canUse || full || game.prep.some((item) => item.kind === "restock");
      restock.classList.toggle("busy", !!game?.prep.some((item) => item.kind === "restock"));
    }
  }

  function updateQueueUI() {
    const count = game ? game.customers.length : 0;
    const max = maxQueue();
    $("queueCount").textContent = `${count} / ${max}`;
    const pips = $("queuePips");
    pips.innerHTML = Array.from({ length: max }, (_, i) => `<i class="${i < count ? "on" : ""}"></i>`).join("");
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
      customer.patience -= dt * patienceRate;
      customer.entering = Math.max(0, customer.entering - dt * 2.6);
      if (customer.patience <= 0) loseCustomer(i);
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
    if (loc.id === "city") {
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
      if (loc.id === "whitby") {
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
      } else {
        rect(ctx, 0, 218, 960, 322, "#75889b");
        rect(ctx, 0, 308, 960, 232, "#4b9a5e");
        for(let i=0;i<20;i++){rect(ctx,i*50,168+(i%2)*15,45,105,"#243c5b");rect(ctx,i*50+7,184+(i%2)*15,7,7,"#ffd84d");rect(ctx,i*50+27,184+(i%2)*15,7,7,"#fffdf4");}
        rect(ctx,0,270,960,12,"#e9ad37");
        pixelText(ctx,"MATCH DAY",770,130,28,"#fffdf4","center");
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

  function drawVan() {
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
    drawTreat(ctx,"whippy",x+357,y+111,.65); drawTreat(ctx,"flake",x+382,y+111,.65); drawTreat(ctx,"lolly",x+406,y+111,.65);
    rect(ctx,x+486,y+44,41,105,"#dce9ee");
    rect(ctx,x+91,y+208,61,25,"#10243f"); rect(ctx,x+430,y+208,61,25,"#10243f");
    ctx.fillStyle="#10243f";ctx.beginPath();ctx.arc(x+121,y+220,38,0,Math.PI*2);ctx.arc(x+460,y+220,38,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ced8df";ctx.beginPath();ctx.arc(x+121,y+220,20,0,Math.PI*2);ctx.arc(x+460,y+220,20,0,Math.PI*2);ctx.fill();
    rect(ctx,x+25,y+192,40,24,"#d6e0e5"); rect(ctx,x+505,y+191,40,25,"#d6e0e5");
    rect(ctx,x+46,y+180,16,10,"#ffd84d");
    rect(ctx,x+181,y+18,328,17,"#10243f");
    pixelText(ctx,"WHITBY WHIPPY",x+345,y+27,18,"#fffdf4","center");
    pixelText(ctx,"BRITISH COACHBUILT",x+345,y+183,11,"#fffdf4","center");
  }

  function drawCustomer(customer, index, total) {
    const spacing = Math.min(76, 310 / Math.max(1, total));
    const x = 650 + index * spacing + customer.entering * 130;
    const bob = Math.round(Math.sin((game.elapsed + customer.phase) * 4) * 2);
    const y = 372 + bob;
    const [skin,hair,shirt] = customer.look;
    rect(ctx,x-15,y-63,30,25,skin);
    rect(ctx,x-17,y-68,34,11,hair); rect(ctx,x-17,y-60,7,15,hair);
    rect(ctx,x-18,y-38,36,43,shirt);
    rect(ctx,x-21,y+5,15,38,"#263b5c"); rect(ctx,x+6,y+5,15,38,"#263b5c");
    rect(ctx,x-22,y+41,19,7,"#10243f"); rect(ctx,x+4,y+41,19,7,"#10243f");
    rect(ctx,x-4,y-53,4,4,"#10243f"); rect(ctx,x+7,y-53,4,4,"#10243f");
    const bubbleW=Math.max(56,customer.orders.length*34+14),bubbleX=x-bubbleW/2,bubbleY=y-126-(index%2)*58;
    rect(ctx,bubbleX-4,bubbleY-4,bubbleW+8,55,"#10243f"); rect(ctx,bubbleX,bubbleY,bubbleW,47,"#fffdf4");
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
    const ratio=Math.max(0,customer.patience/customer.maxPatience);
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
  }

  function resumeGame() {
    if (mode !== "paused") return;
    mode = "playing";
    showScreen(null);
    lastTime = performance.now();
    updateButtons();
    refreshHeader();
  }

  $("playBtn").addEventListener("click", () => {
    if (!save.helpSeen) {
      previousScreen = "locationScreen";
      save.helpSeen = true; persist();
      showScreen("helpScreen");
    } else openLocations();
  });
  $("howBtn").addEventListener("click", () => { previousScreen = "titleScreen"; showScreen("helpScreen"); });
  $("helpBackBtn").addEventListener("click", () => previousScreen === "locationScreen" ? openLocations() : showScreen("titleScreen"));
  $("backTitleBtn").addEventListener("click", () => { mode="title"; showScreen("titleScreen"); refreshHeader(); });
  $("brandBtn").addEventListener("click", () => {
    if (mode === "playing") { pauseGame(); return; }
    mode="title"; showScreen("titleScreen"); refreshHeader();
  });
  $("garageBtn").addEventListener("click", openGarage);
  $("garageBackBtn").addEventListener("click", openLocations);
  $("resultsGarageBtn").addEventListener("click", openGarage);
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
      const first = game.customers[0];
      const itemIndex = first?.completed.findIndex((done) => !done);
      if (first && itemIndex >= 0) {
        const product = PRODUCTS.find((item) => item.id === first.orders[itemIndex]);
        if (product.group !== selectedCategory) { selectedCategory = product.group; buildProductButtons(); }
        startProduct(product.id);
      }
    }
    if (event.key === "Escape") { if (mode === "playing") pauseGame(); else if (mode === "paused") resumeGame(); }
  });

  document.addEventListener("visibilitychange", () => { if (document.hidden && mode === "playing") pauseGame(); });

  buildProductButtons();
  updateQueueUI();
  refreshHeader();
  showScreen("titleScreen");
  requestAnimationFrame(loop);
})();
