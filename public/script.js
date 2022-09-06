/* Main fetch functions for getting location and weather */
document.addEventListener("DOMContentLoaded", () => {
  const locSubmit = document.getElementById("loc-submit");
  const locSearch = document.getElementById("loc-search");
  const locName = document.getElementById("loc-name");
  const locHere = document.getElementById("loc-here");

  locHere.addEventListener("click", async (event) => {
    event.preventDefault();
    locName.innerHTML = "Locating...";
    getCoords(locName);
  });

  locSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    locName.innerHTML = "Locating..."
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

/* Helper functions that assist with obtaining weather data via fetch-weather*/
const getCoords = async (elem) => {
  const options = {
    enableHighAccuracy: true,
    timeout: 4000,
    maximumAge: 0
  };

  function success(pos) {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    getLoc(lat, lon, elem);
  }

  function error(err) {
    locName.innerHTML = `Unable to retrieve location. Reason: ${err.code} ${err.message}`;
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
};

const getLoc = async (latInp, lonInp, elem) => {
  const response = await fetch("/.netlify/functions/fetch-loc-reverse", {
    method: "POST",
    body: JSON.stringify({
      lat: latInp,
      lon: lonInp
    })
  });

  const data = await response.json();
  
  if (data.stateName === undefined) {
    elem.innerHTML = `${data.cityName}, ${data.countryName}`;
  } else {
    elem.innerHTML = `${data.cityName}, ${data.stateName}, ${data.countryName}`;
  }

  getWeather(latInp, lonInp);
}

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
  });

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