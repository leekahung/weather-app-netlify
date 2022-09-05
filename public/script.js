document.addEventListener("DOMContentLoaded", () => {
  const locSubmit = document.getElementById("loc-submit");
  const locSearch = document.getElementById("loc-search");
  const locName = document.getElementById("loc-name");

  locSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    const response = await fetch("/.netlify/functions/fetch-loc-direct", {
      method: "POST",
      body: JSON.stringify({
        locationName: locSearch.value
      })
    });

    const data = await response.json();

    //console.log(data); //debugger line
    if (data.stateName === undefined) {
      locName.innerHTML = `${data.cityName}, ${data.countryName}`;
    } else {
      locName.innerHTML = `${data.cityName}, ${data.stateName}, ${data.countryName}`;
    }

    getWeather(data.lat, data.lon);
  });
});

const tempCurr = document.getElementById("temp-curr");
const weatherCond = document.getElementById("weather-cond");
const weatherDesc = document.getElementById("weather-desc");
let origTemp;
let units = "F"; // set F as default

const getWeather = async (latInp, lonInp) => {
  const response = await fetch("/.netlify/functions/fetch-weather", {
    method: "POST",
    body: JSON.stringify({
      lat: latInp,
      lon: lonInp
    })
  })

  const data = await response.json();

  origTemp = data.tempCurrent;
  tempCurr.innerHTML = Math.round(origTemp);
  tempCurr.innerHTML += "&#8457;";
  weatherCond.innerHTML = data.weatherCondition;
  weatherDesc.innerHTML = data.weatherDescript[0].toUpperCase() + data.weatherDescript.slice(1);
};

const fahrBtn = document.getElementById("fahr");
const celBtn = document.getElementById("cel");

fahrBtn.addEventListener("click", () => {
  if (tempCurr.innerHTML === "") {
    return;
  }

  if (units === "C") {
    tempCurr.innerHTML = Math.round(origTemp);
    tempCurr.innerHTML += "&#8457;";
    units = "F";
  }
});

celBtn.addEventListener("click", () => {
  if (tempCurr.innerHTML === "") {
    return;
  }

  if (units === "F") {
    tempCurr.innerHTML = Math.round((origTemp - 32) * (5 / 9));
    tempCurr.innerHTML += "&#8451;";
    units = "C";
  }
});