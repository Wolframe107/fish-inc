// Cookie stuff --------------------------

async function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

async function data_init() {
  let model = {};
  let current_time = Date.now();
  let stored_time = await getCookie("elapsedTime");

  if (stored_time === "") {
    console.log("det fanns INTE en kaka");
    model.firstTime = true;
    setCookie("clickPower", 1.0, 100);
    setCookie("score", 0.0, 100);
    setCookie("elapsedTime", current_time, 100);
    setCookie("fishRate", 0.0, 100);
    setCookie("bleedrate", 0.0, 100);
    setCookie("bleedval", 0.0, 100);
    setCookie("formattingStyle", "default", 100);
    setCookie("data", JSON.stringify(data), 100);

    model.clickPower = 1.0;
    model.score = 0.0;
    model.elapsedTime = 0.0;
    model.fishRate = 0.0;
    model.bleedrate = 0.0;
    model.bleedval = 0.0;
    model.formattingStyle = "default";
  } else {
    console.log("det fanns en kaka");
    model.firstTime = false;
    let stored_clickPower = await getCookie("clickPower");
    let stored_score = await getCookie("score");
    let stored_fishRate = await getCookie("fishRate");
    let stored_bleedrate = await getCookie("bleedrate");
    let stored_bleedval = await getCookie("bleedval");
    let formattingStyle = await getCookie("formattingStyle");

    model.clickPower = parseInt(stored_clickPower);
    model.score = parseInt(stored_score);
    model.fishRate = parseFloat(stored_fishRate - stored_bleedval);
    model.bleedrate = parseFloat(stored_bleedrate);
    model.bleedval = parseFloat(stored_bleedval);
    model.formattingStyle = formattingStyle;

    let time_diff = current_time - stored_time;

    if (time_diff <= 1000 * 60 * 30) {
      model.score += model.fishRate * Math.round(time_diff / 1000);
      setCookie("score", model.score, 100);
    } else {
      model.score += model.fishRate * Math.round((1000 * 60 * 30) / 1000);
      setCookie("score", model.score, 100);
    }
    model.elapsedTime = parseInt(current_time);
    setCookie("elapsedTime", model.elapsedTime, 100);

    let await_time = Math.round(time_diff / 1000);

    if (await_time > 4) {
      swal({
        title: "Welcome back!",
        text:
          "You have been away for " +
          (await_time < 1000 * 60
            ? await_time + " seconds."
            : await_time / 60 + " minutes.") +
          "\nYou have earned " +
          (model.fishRate * Math.round(time_diff / 1000) > 1000000
            ? "a whole lot of"
            : model.fishRate * Math.round(time_diff / 1000)) +
          " fish :)",
      });
    }

    data = JSON.parse(await getCookie("data"));
  }

  console.log("Data is: ", data);
  console.log("Current model state: ", model);
  return model;
}

//let score = parseInt(getCookie("score"))
