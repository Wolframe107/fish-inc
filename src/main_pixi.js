// App initialization -------------------------
async function main() {
  let model = await data_init();

  let app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    background: "#2ea6c9",
  });
  document.body.appendChild(app.view);

  // Load assets -------------------------
  // Playfield
  PIXI.Assets.add("background", "../public/images/background.png");
  PIXI.Assets.add("foreground", "../public/images/foreground.png");
  PIXI.Assets.add("cloud_1", "../public/images/cloud.png");
  PIXI.Assets.add("cloud_2", "../public/images/cloud2.png");
  PIXI.Assets.add("sun", "../public/images/sun.png");
  PIXI.Assets.add("sunrays", "../public/images/sunrays.png");
  PIXI.Assets.add("boat", "../public/images/boat.png");

  // Endscreen
  PIXI.Assets.add("endScreen", "../public/images/endgame_background.png");

  // UI
  PIXI.Assets.add("topBar", "../public/images/topBar.png");
  PIXI.Assets.add("fish", "../public/images/fish.png");
  PIXI.Assets.add("deadFish", "../public/images/deadFish.png");
  PIXI.Assets.add("format", "../public/images/format.png");

  // Shop
  PIXI.Assets.add("shop_icon", "../public/images/shop_icon.png");
  PIXI.Assets.add("shop_icon_open", "../public/images/shop_icon_open.png");
  PIXI.Assets.add(
    "shop_module_background",
    "../public/images/shop_module_background.png"
  );
  PIXI.Assets.add("upgrade_button", "../public/images/upgrade_button.png");
  PIXI.Assets.add("fish_rod", "../public/images/fish_rod.png");
  PIXI.Assets.add("fisherman", "../public/images/fisherman.png");
  PIXI.Assets.add("rowing_boat", "../public/images/rowing_boat.png");
  PIXI.Assets.add("handliner", "../public/images/handliner.png");
  PIXI.Assets.add("gill_netter", "../public/images/gill_netter.png");
  PIXI.Assets.add("line_vessel", "../public/images/line_vessel.png");
  PIXI.Assets.add("lift_netter", "../public/images/lift_netter.png");
  PIXI.Assets.add("dredger", "../public/images/dredger.png");
  PIXI.Assets.add("trawler", "../public/images/trawler.png");

  // Bird
  PIXI.Assets.add("bird", "../public/images/seagull.png");
  PIXI.Assets.add("explosion", "../public/images/bird_explosion.png");

  const assets = await PIXI.Assets.load([
    "background",
    "foreground",
    "cloud_1",
    "cloud_2",
    "sun",
    "sunrays",
    "boat",
    "endScreen",
    "topBar",
    "fish",
    "deadFish",
    "format",
    "shop_icon",
    "shop_icon_open",
    "shop_module_background",
    "upgrade_button",
    "fisherman",
    "fish_rod",
    "rowing_boat",
    "handliner",
    "gill_netter",
    "line_vessel",
    "lift_netter",
    "dredger",
    "trawler",
    "bird",
    "explosion",
  ]);

  if (model.firstTime) {
    swal({
      title: "Welcome to the game!",
      text: "As you awaken to a new day, your eyes fall upon an old envelope resting on your desk. You open it to find a letter from your grandfather, revealing that he has left his beloved fishing company to you. Do you have what it takes to tackle the competition and create the most successful fishing company in the world? \n\nGood luck! \n\nbtw, by clicking the Start button, you're accepting that cookies will be used 🍪",
      button: "Start",
      closeOnClickOutside: false,
      closeOnEsc: false,
    });
  }

  let time = Date.now();
  document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
      let time_calc = Math.round((Date.now() - time) / 1000);
      model.score += model.fishRate * time_calc;

      if (time_calc < 60 * 2) {
        model.bleedval += model.bleedrate * time_calc;
      } else {
        model.bleedval += model.bleedrate * 60 * 2;
      }
      saveGame();
      refreshTexts();
    } else {
      time = Date.now();
    }
  });

  window.addEventListener("resize", resize);
  resize();

  // Text styles --------------------------------

  const feedback_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',

    fill: "0xffffff",
    fontSize: 32,
  });

  const score_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',

    fill: "0xffffff",
    fontSize: 32,
    align: "left",
  });

  const fish_rate_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    fill: "0xffffff",
    fontSize: 32,
    align: "left",
  });

  const module_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',

    fill: "0xffffff",
    fontSize: 24,
  });

  const rate_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',

    fill: "0xffffff",
    fontSize: 20,
    fontStyle: "italic",
  });

  const upgrade_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',

    fill: "#000000",
    fontSize: 20,
  });

  const upgrade_cost_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',

    fill: "0xffffff",
    fontSize: 20,
    fontStyle: "italic",
  });

  const amount_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',

    fill: "0xffffff",
    fontSize: 30,
  });

  const endScreen_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    align: "center",
    fill: "0xffffff",
    fontSize: 36,
  });

  const bleed_style = new PIXI.TextStyle({
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    align: "center",
    fill: "0xf77777",
    fontSize: 36,
  });

  const bleedsheet = [
    [3500000, 100],
    [25000000, 1000],
    [50000000, 5000],
    [200000000, 10000],
    [500000000, 250000],
  ];

  // Playfield ----------------------------------

  let playField = new PIXI.Container();
  app.stage.addChild(playField);

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  let background = PIXI.Sprite.from(assets.background);
  let foreground = PIXI.Sprite.from(assets.foreground);
  let cloud_1 = PIXI.Sprite.from(assets.cloud_1);
  let cloud_2 = PIXI.Sprite.from(assets.cloud_2);
  let sun = PIXI.Sprite.from(assets.sun);
  let sunrays = PIXI.Sprite.from(assets.sunrays);
  let boat = PIXI.Sprite.from(assets.boat);

  background.y = 120;
  foreground.y = 120;

  cloud_1.y = 200;
  cloud_1.x = Math.random() * 500;
  cloud_2.y = 170;

  cloud_2.x = 900 + Math.random() * 500;

  sun.anchor.set(0.5);
  sun.width = 300;
  sun.height = 300;
  sun.position.set(screen.width / 2, 350);

  sunrays.anchor.set(0.5);
  sunrays.width = 300;
  sunrays.height = 300;
  sunrays.position.set(screen.width / 2, 350);

  boat.anchor.set(0.5);
  boat.scale.set(1.2);
  boat.position.set(screen.width / 2 - 90, 530);

  playField.interactive = true;
  playField.cursor = "pointer";
  playField.on("pointerdown", onClick);

  background.filters = [filter];
  foreground.filters = [filter];
  cloud_1.filters = [filter];
  cloud_2.filters = [filter];
  sun.filters = [filter];
  sunrays.filters = [filter];

  playField.addChild(background);
  playField.addChild(sun);
  playField.addChild(sunrays);
  playField.addChild(cloud_1);
  playField.addChild(cloud_2);
  playField.addChild(boat);
  playField.addChild(foreground);

  // Bleedrate + Ticker -------------------------

  function bleedcalc(baserate, bleedsheet) {
    for (let i = bleedsheet.length - 1; i >= 0; i--) {
      if (bleedsheet[i][0] < baserate) {
        return parseInt(bleedsheet[i][1]);
      }
    }
    return 0;
  }

  let second = 0.0;
  let elapsed = 0.0;
  let bloomStrength = 0;
  let bird_event = 0;

  app.ticker.add((delta) => {
    second += (1 / 60) * delta;
    bird_event += (1 / 60) * delta;

    // Each second
    if (second >= 1) {
      model.bleedval += model.bleedrate;
      model.fishRate -= model.bleedval;
      if (model.fishRate > 0) {
        model.score += parseInt(model.fishRate);

        if (model.bleedrate > 0) {
          bleed_visualisation(model.bleedval);
        }

        second = 0.0;
        refreshTexts();
        saveGame();
      }
    }

    // When bleedbegin
    if (model.bleedrate != 0) {
      bloomStrength += delta;
      if (bloomStrength > 80) {
        bloomStrength = 0;
      }

      bloomFilter.blur = (bloomStrength * 0.25) / 4;
      alertFilter.alpha = (bloomStrength * 0.025) / 4;

      bloomFilter.treshold = bloomStrength * 0.1;

      // End game
      if (model.fishRate <= 0) {
        endOverlay.visible = true;
        black_overlay.visible = true;

        shop_button_open.interactive = false;
        shop_button_open.buttonMode = false;
        shop_button_closed.interactive = false;
        shop_button_closed.buttonMode = false;
        shop_container.visible = false;
        playField.interactive = false;
        playField.cursor = "default";

        fish.visible = false;
        let deadFish = PIXI.Sprite.from(assets.deadFish);
        deadFish.scale.set(0.14);
        deadFish.x = 50;
        deadFish.y = 25;

        deadFish.filters = [filter];

        topBar.addChild(deadFish);

        model.fishRate = 0;
        refreshTexts();
      }
    }

    // Animation
    cloud_1.x += 0.1;
    cloud_2.x += 0.1;
    if (cloud_1.x > screen.width) {
      cloud_1.x = -300;
    }

    if (cloud_2.x > screen.width) {
      cloud_2.x = -300;
    }

    elapsed += 0.01;
    sunrays.scale.x = 0.6 + Math.sin(elapsed) * 0.05;
    sunrays.scale.y = 0.6 + Math.sin(elapsed) * 0.05;

    boat.y += Math.sin(elapsed) * 0.04;
    boat.x += Math.sin(elapsed * 0.8) * 0.02;

    if (bird_event > 100) {
      addBird();
      bird_event = 0;
    }
  });

  // Top-Bar ------------------------------------

  let topBar = new PIXI.Container();
  app.stage.addChild(topBar);

  let bar = PIXI.Sprite.from(assets.topBar);
  bar.filters = [filter_low];
  topBar.addChild(bar);

  // Score --------------------------------------

  let fish = PIXI.Sprite.from(assets.fish);

  let score_text = new PIXI.Text(": " + formatNumber(model.score), score_style);
  fish.scale.set(0.14);
  fish.x = 50;
  fish.y = 25;

  score_text.x = 130;
  score_text.y = 38;

  fish.filters = [filter];

  topBar.addChild(fish);
  topBar.addChild(score_text);

  // Fish rate ----------------------------------

  let fish_rate = new PIXI.Text(
    "Fishing rate: " + formatNumber(model.fishRate) + " f/s",
    fish_rate_style
  );

  let bloomFilter = new PIXI.filters.BloomFilter();
  let alertFilter = new PIXI.filters.ColorOverlayFilter();

  alertFilter.color = [1, 0, 0];
  fish_rate.filters = [bloomFilter, alertFilter];
  fish_rate.x = 320;
  fish_rate.y = 38;

  topBar.addChild(fish_rate);

  // Format change ------------------------------

  let format_button = PIXI.Sprite.from(assets.format);
  format_button.scale.set(0.8);
  format_button.anchor.set(0.5);
  format_button.position.set(1920 - 100, 60);

  format_button.interactive = true;
  format_button.buttonMode = true;

  format_button.on("pointerover", () => {
    format_button.tint = 0x999999;
  });

  format_button.on("pointerout", () => {
    format_button.tint = 0xffffff;
  });

  format_button.on("pointerdown", () => {
    model.formattingStyle =
      model.formattingStyle == "default" ? "scientific" : "default";
    setCookie("formattingStyle", model.formattingStyle, 100);
    refreshTexts();
  });

  topBar.addChild(format_button);

  // Shop button --------------------------------

  const shop_button_closed = PIXI.Sprite.from(assets.shop_icon);
  shop_button_closed.height = 95;
  shop_button_closed.width = 290;
  shop_button_closed.anchor.set(0.5);
  shop_button_closed.position.set(screen.width / 2 + 5, 60);
  shop_button_closed.filters = [filter_low];

  const shop_button_open = PIXI.Sprite.from(assets.shop_icon_open);
  shop_button_open.height = 95;
  shop_button_open.width = 290;
  shop_button_open.anchor.set(0.5);
  shop_button_open.position.set(screen.width / 2 + 5, 60);
  shop_button_open.filters = [filter_low];
  shop_button_open.visible = false;

  shop_button_closed.on("pointerdown", (event) => {
    shop_container.visible = !shop_container.visible;
    shop_button_closed.visible = false;
    shop_button_open.visible = true;
  });

  shop_button_open.on("pointerdown", (event) => {
    shop_container.visible = !shop_container.visible;
    shop_button_closed.visible = true;
    shop_button_open.visible = false;
  });

  shop_button_closed.buttonMode = true;
  shop_button_closed.interactive = true;

  shop_button_open.buttonMode = true;
  shop_button_open.interactive = true;

  topBar.addChild(shop_button_closed);
  topBar.addChild(shop_button_open);

  // Shop ---------------------------------------

  let shop_container = new PIXI.Container();

  shop_container.position.set(screen.width / 2 - 250, 118);
  shop_container.visible = false;

  app.stage.addChild(shop_container);

  function shop_module(upgrade_data, next_module) {
    let module = new PIXI.Container();
    module.upgrade_data = upgrade_data;
    module.position.y = 99 * (upgrade_data.number - 2);

    // Background
    const shop_background = PIXI.Sprite.from(assets.shop_module_background);
    shop_background.filters = [filter_low];

    // Icon
    const icon = PIXI.Sprite.from(assets[upgrade_data.image_url]);
    icon.position.set(35, 11);
    icon.width = 60;
    icon.height = 60;

    // Rate
    const rate = new PIXI.Text(
      formatNumber(upgrade_data.baserate) + " f/s",
      rate_style
    );
    rate.position.set(38, 69);

    // Name
    const name = new PIXI.Text(upgrade_data.display_name, module_style);
    name.anchor.set(0.5);
    name.position.set(250, 20);

    // Upgrade button
    const upgrade = new PIXI.Container();

    const upgrade_button = PIXI.Sprite.from(assets.upgrade_button);
    upgrade_button.anchor.set(0.5);
    upgrade_button.position.set(250, 53);
    upgrade_button.width = 120;

    let upgrade_button_text = new PIXI.Text("UPGRADE", upgrade_style);
    upgrade_button_text.anchor.set(0.5);
    upgrade_button_text.position.set(250, 52);

    upgrade.addChild(upgrade_button);
    upgrade.addChild(upgrade_button_text);

    if (upgrade_data.upgraded == 1) {
      upgrade_button_text.text = "UPGRADED";
      upgrade_button.tint = 0x999999;
      upgrade.interactive = false;
      upgrade.cursor = "default";
    } else {
      upgrade.interactive = true;
      upgrade.cursor = "pointer";
      upgrade.on("pointerdown", function () {
        if (model.score >= upgrade_data.upgrade_cost) {
          model.score -= upgrade_data.upgrade_cost;
          model.fishRate += upgrade_data.baserate * upgrade_data.amount;
          upgrade_data.baserate *= 2;

          model.bleedrate = bleedcalc(model.fishRate, bleedsheet);

          upgrade_button_text.text = "UPGRADED";
          upgrade_data.upgraded = 1;
          upgrade.interactive = false;
          upgrade.cursor = "default";
          upgrade_button.tint = 0x999999;

          rate.text = formatNumber(upgrade_data.baserate) + " f/s";

          saveGame();
        } else {
          upgrade_button.tint = 0xff5c5c;

          window.setTimeout(() => {
            upgrade_button.tint = 0xffffff;
          }, 300);
        }
      });
    }

    // Upgrade cost
    let upgrade_cost_text = new PIXI.Text(
      formatNumber(upgrade_data.upgrade_cost),
      upgrade_cost_style
    );
    upgrade_cost_text.anchor.set(0.5);
    upgrade_cost_text.position.set(250, 82);

    // Amount
    let amount = new PIXI.Text(
      upgrade_data.amount + "/" + upgrade_data.max_amount,
      amount_style
    );
    amount.anchor.set(0.5);
    amount.position.set(410, 23);

    // Buy button
    const buy = new PIXI.Container();

    const buy_button = PIXI.Sprite.from(assets.upgrade_button);
    buy_button.anchor.set(0.5);
    buy_button.position.set(410, 53);
    buy_button.width = 60;
    buy_button.height = 26;

    let buy_button_text = new PIXI.Text("BUY", upgrade_style);
    buy_button_text.anchor.set(0.5);
    buy_button_text.position.set(410, 52);

    buy.addChild(buy_button);
    buy.addChild(buy_button_text);

    if (upgrade_data.amount == upgrade_data.max_amount) {
      buy_button.tint = 0x999999;
      buy.interactive = false;
      buy.cursor = "default";
    } else {
      buy.interactive = true;
    }

    buy.cursor = "pointer";
    buy.on("pointerdown", function () {
      if (
        upgrade_data.amount < upgrade_data.max_amount &&
        model.score >= upgrade_data.cost
      ) {
        model.score -= upgrade_data.cost;
        upgrade_data.amount++;
        model.fishRate += upgrade_data.baserate;

        model.bleedrate = bleedcalc(model.fishRate, bleedsheet);

        amount.text = upgrade_data.amount + "/" + upgrade_data.max_amount;

        if (model.score < 1000000) {
          upgrade_data.cost += upgrade_data.cost * 0.1;
        }
        cost_text.text = formatNumber(Math.round(upgrade_data.cost));

        if (upgrade_data.amount == upgrade_data.max_amount) {
          buy.interactive = false;
          buy.cursor = "default";
          buy_button.tint = 0x999999;
        }

        if (next_module && next_module.visible == false) {
          next_module.visible = true;
          data[upgrade_data.number + 1].unlocked = 1;
        }

        saveGame();
      } else {
        buy_button.tint = 0xff5c5c;

        window.setTimeout(() => {
          buy_button.tint = 0xffffff;
        }, 300);
      }
    });

    // Cost
    let cost_text = new PIXI.Text(
      formatNumber(Math.round(upgrade_data.cost)),
      upgrade_cost_style
    );
    cost_text.anchor.set(0.5);
    cost_text.position.set(410, 82);

    module.addChild(shop_background);
    module.addChild(icon);
    module.addChild(rate);
    module.addChild(name);
    module.addChild(upgrade);
    module.addChild(upgrade_cost_text);
    module.addChild(amount);
    module.addChild(buy);
    module.addChild(cost_text);

    if (upgrade_data.unlocked === 1) {
      module.visible = true;
    } else {
      module.visible = false;
    }

    return module;
  }

  function shop_module_active(upgrade_data, next_module) {
    let module = new PIXI.Container();
    module.upgrade_data = upgrade_data;
    module.position.y = 99 * (upgrade_data.number - 1);
    module.position.x = -500;

    // Background
    const shop_background = PIXI.Sprite.from(assets.shop_module_background);
    shop_background.filters = [filter_low];

    // Icon
    const icon = PIXI.Sprite.from(assets[upgrade_data.image_url]);
    icon.position.set(35, 11);
    icon.width = 60;
    icon.height = 60;

    // Rate
    const rate = new PIXI.Text(
      formatNumber(model.clickPower) + " f/click",
      rate_style
    );
    rate.position.set(38, 69);

    // Name
    const name = new PIXI.Text(upgrade_data.display_name, module_style);
    name.anchor.set(0.5);
    name.position.set(250, 20);

    // Amount
    let amount = new PIXI.Text(
      upgrade_data.amount + "/" + upgrade_data.max_amount,
      amount_style
    );
    amount.anchor.set(0.5);
    amount.position.set(410, 53);

    // Buy button
    const buy = new PIXI.Container();

    const buy_button = PIXI.Sprite.from(assets.upgrade_button);
    buy_button.anchor.set(0.5);
    buy_button.position.set(250, 53);
    buy_button.width = 120;
    buy_button.height = 26;

    let buy_button_text = new PIXI.Text("UPGRADE", upgrade_style);
    buy_button_text.anchor.set(0.5);
    buy_button_text.position.set(250, 52);

    buy.addChild(buy_button);
    buy.addChild(buy_button_text);

    if (upgrade_data.amount == upgrade_data.max_amount) {
      buy_button.tint = 0x999999;
      buy.interactive = false;
      buy.cursor = "default";
    } else {
      buy.interactive = true;
    }

    buy.cursor = "pointer";
    buy.on("pointerdown", function () {
      if (
        upgrade_data.amount < upgrade_data.max_amount &&
        model.score >= upgrade_data.cost
      ) {
        model.score -= upgrade_data.cost;
        upgrade_data.amount++;
        model.clickPower *= 2;

        amount.text = upgrade_data.amount + "/" + upgrade_data.max_amount;
        rate.text =
          formatNumber(upgrade_data.baserate * model.clickPower) + " f/click";

        if (upgrade_data.amount > 0 && upgrade_data.amount < 5) {
          upgrade_data.cost *= 2;
        } else upgrade_data.cost *= 10;

        cost_text.text = formatNumber(Math.round(upgrade_data.cost));

        if (upgrade_data.amount == upgrade_data.max_amount) {
          buy.interactive = false;
          buy.cursor = "default";
          buy_button.tint = 0x999999;
        }

        if (next_module && next_module.visible == false) {
          next_module.visible = true;
          data[upgrade_data.number + 1].unlocked = 1;
        }

        saveGame();
      } else {
        buy_button.tint = 0xff5c5c;

        window.setTimeout(() => {
          buy_button.tint = 0xffffff;
        }, 300);
      }
    });

    // Cost
    let cost_text = new PIXI.Text(
      formatNumber(Math.round(upgrade_data.cost)),
      upgrade_cost_style
    );
    cost_text.anchor.set(0.5);
    cost_text.position.set(250, 82);

    module.addChild(shop_background);
    module.addChild(icon);
    module.addChild(rate);
    module.addChild(name);
    module.addChild(amount);
    module.addChild(buy);
    module.addChild(cost_text);

    if (upgrade_data.unlocked === 1) {
      module.visible = true;
    } else {
      module.visible = false;
    }

    return module;
  }

  let trawler = shop_module(data[9]);
  let dredger = shop_module(data[8], trawler);
  let lift_netter = shop_module(data[7], dredger);
  let line_vessel = shop_module(data[6], lift_netter);
  let gill_netter = shop_module(data[5], line_vessel);
  let handliner = shop_module(data[4], gill_netter);
  let rowing_boat = shop_module(data[3], handliner);
  let fisherman = shop_module(data[2], rowing_boat);
  let fishing_rod = shop_module_active(data[1], fisherman);

  shop_container.addChild(fishing_rod);
  shop_container.addChild(fisherman);
  shop_container.addChild(rowing_boat);
  shop_container.addChild(handliner);
  shop_container.addChild(gill_netter);
  shop_container.addChild(line_vessel);
  shop_container.addChild(lift_netter);
  shop_container.addChild(dredger);
  shop_container.addChild(trawler);

  // Endscreen ----------------------------------

  let endOverlay = new PIXI.Container();
  let endScreen = PIXI.Sprite.from(assets.endScreen);

  endScreen.anchor.set(0.5);
  endScreen.interactive = true;
  endScreen.filters = [filter];

  let endScreen_text = new PIXI.Text(
    "GAME OVER\n\nYou've extracted all available fish from \nthe ocean! Oh no!\n\n\n A game by Mille Kåge & Matias Eriksson\nThanks for playing!",
    endScreen_style
  );

  endScreen_text.anchor.set(0.5);
  endOverlay.position.set(screen.width / 2, screen.height / 2 - 100);
  endOverlay.visible = false;

  black_overlay = new PIXI.Graphics();
  black_overlay.beginFill(0x000000);
  black_overlay.drawRect(0, 0, screen.width, screen.height);
  black_overlay.endFill();
  black_overlay.alpha = 0.6;
  black_overlay.visible = false;

  app.stage.addChild(black_overlay);

  endOverlay.addChild(endScreen);
  endOverlay.addChild(endScreen_text);
  app.stage.addChild(endOverlay);

  // Utility functions --------------------------

  function saveGame() {
    setCookie("clickPower", parseInt(model.clickPower), 100);
    setCookie("score", parseInt(model.score), 100);
    setCookie("elapsedTime", parseInt(new Date().getTime()), 100);
    setCookie("fishRate", parseFloat(model.fishRate), 100);
    setCookie("bleedrate", parseFloat(model.bleedrate), 100);
    setCookie("bleedval", parseFloat(model.bleedval), 100);
    setCookie("data", JSON.stringify(data), 100);

    refreshTexts();
  }

  function refreshTexts() {
    score_text.text = ": " + formatNumber(Math.round(model.score));
    fish_rate.text = "Fishing rate: " + formatNumber(model.fishRate) + " f/s";

    for (let i = 1; i < shop_container.children.length; i++) {
      let module = shop_container.getChildAt(i);
      module.getChildAt(2).text =
        formatNumber(module.upgrade_data.baserate) + " f/s";
      module.getChildAt(5).text = formatNumber(
        module.upgrade_data.upgrade_cost
      );
      module.getChildAt(8).text = formatNumber(
        Math.round(module.upgrade_data.cost)
      );
    }
  }

  function scientificNotation(number) {
    if (number > 999) {
      let exponent = Math.floor(Math.log10(number));
      let mantissa = number / Math.pow(10, exponent);
      return mantissa.toFixed(2) + "e" + exponent;
    } else return number;
  }

  function formatNumber(number) {
    if (number == 0) {
      return 0;
    }

    if (model.formattingStyle == "default") {
      if (number >= 1000 && number < 1000000) {
        return (number / 1000).toFixed(1) + "k";
      } else if (number >= 1000000 && number < 1000000000) {
        return (number / 1000000).toFixed(1) + "M";
      } else if (number >= 1000000000 && number < 1000000000000) {
        return (number / 1000000000).toFixed(1) + "G";
      } else if (number >= 1000000000000 && number < 1000000000000000) {
        return (number / 1000000000000).toFixed(1) + "T";
      } else if (number >= 1000000000000000 && number < 1000000000000000000) {
        return (number / 1000000000000000).toFixed(1) + "P";
      } else return number;
    }

    if (model.formattingStyle == "scientific") {
      return scientificNotation(number);
    }
  }

  function onClick(e) {
    model.score += model.clickPower;
    setCookie("score", parseInt(model.score), 100);
    refreshTexts();

    // +1 Feedback
    let feedback_cont = new PIXI.Container();

    let click_feedback = new PIXI.Text(
      "+" + formatNumber(model.clickPower),
      feedback_style
    );
    click_feedback.anchor.set(0.5);
    click_feedback.x = e.data.global.x - 10 + Math.random() * 20;
    click_feedback.y = e.data.global.y - 10 + Math.random() * 20;

    click_feedback.scale.set(Math.random() * 0.1 + 1);

    feedback_cont.addChild(click_feedback);

    let feedback_ticker = new PIXI.Ticker();
    let elapsed = 0.0;
    let alpha = 1.0;
    feedback_ticker.add((delta) => {
      elapsed += delta;
      feedback_cont.alpha = alpha;
      alpha -= 0.01;
    });
    feedback_ticker.start();

    if (elapsed > 5.0) {
      feedback_ticker.destroy();
      app.stage.removeChild(feedback_cont);
    }

    app.stage.addChild(feedback_cont);
  }

  function bleed_visualisation(bleedval) {
    let blood_cont = new PIXI.Container();

    let bleed_text = new PIXI.Text("-" + formatNumber(bleedval), bleed_style);
    bleed_text.anchor.set(0.5);
    bleed_text.x = fish_rate.x + Math.random() * 100 + 200;
    bleed_text.y = fish_rate.y + Math.random() * 100 - 30;

    blood_cont.addChild(bleed_text);

    let blood_ticker = new PIXI.Ticker();
    let elapsed = 0.0;
    let alpha = 1.0;
    blood_ticker.add((delta) => {
      elapsed += delta;
      blood_cont.alpha = alpha;
      alpha -= 0.005;
    });
    blood_ticker.start();

    if (elapsed > 5.0) {
      blood_ticker.destroy();
      app.stage.removeChild(blood_cont);
    }

    app.stage.addChild(blood_cont);
  }

  function addBird() {
    let bird = PIXI.Sprite.from(assets.bird);
    bird.anchor.set(0.5);
    bird.x = Math.random() * (app.screen.width - 200) + 100;
    bird.y = -100;
    bird.scale.set(0.22);

    bird.interactive = true;
    bird.buttonMode = true;
    bird.cursor = "pointer";
    bird.on("pointerdown", () => {
      model.score += model.score * 0.25;
      setCookie("score", parseInt(model.score), 100);
      refreshTexts();

      let explosion = PIXI.Sprite.from(assets.explosion);
      explosion.anchor.set(0.5);
      explosion.x = bird.x;
      explosion.y = bird.y;
      explosion.rotation = 0.01;
      explosion.scale.set(0.9);

      app.stage.addChild(explosion);

      window.setTimeout(() => {
        app.stage.removeChild(explosion);
      }, 200);

      gull_ticker.destroy();
      app.stage.removeChild(bird);
    });

    let gull_ticker = new PIXI.Ticker();

    let elapsed_time = 0.0;
    gull_ticker.add((delta) => {
      elapsed_time += delta;
      bird.x += Math.sin(elapsed_time / 20);

      if (elapsed_time > 0 && elapsed_time < 55) {
        bird.y += 3;
      } else if (elapsed_time > 55 && elapsed_time < 200) {
        bird.y -= Math.sin(elapsed_time / 25);
      } else if (elapsed_time > 200 && elapsed_time < 3000) {
        bird.y -= 1;
      }

      if (elapsed_time > 5000.0) {
        gull_ticker.destroy();
        app.stage.removeChild(bird);
      }
    });

    gull_ticker.start();

    app.stage.addChild(bird);
  }

  function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}

main();
