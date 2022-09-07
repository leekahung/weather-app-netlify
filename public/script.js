/* Main fetch functions for getting location and weather */
document.addEventListener("DOMContentLoaded", () => {
  const locSubmit = document.getElementById("loc-submit");
  const locSearch = document.getElementById("loc-search");
  const locName = document.getElementById("loc-name");
  const locHere = document.getElementById("loc-here");

  locHere.addEventListener("click", () => {
    locName.innerHTML = "Locating...";
    getCoords(locName);
  });

  locSubmit.addEventListener("click", () => {
    locName.innerHTML = "Locating...";
    getLocDir(locSearch, locName);
  });

  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      locName.innerHTML = "Locating...";
      if (event.key === "Enter" && locSearch.value === "") {
        getCoords(locName);
      } else if (event.key === "Enter" && locSearch.value !== "") {
        getLocDir(locSearch, locName);
      }
    }
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
    getLocRev(lat, lon, elem);
  }

  function error(err) {
    elem.innerHTML = `${err.message}; Unable to retrieve location.`;
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
};

const getLocDir = async (elemSearch, elemLoc) => {
  const response = await fetch("/.netlify/functions/fetch-loc-direct", {
    method: "POST",
    body: JSON.stringify({
      locationName: elemSearch.value
    })
  });

  const data = await response.json();

  if (data.stateName === undefined) {
    elemLoc.innerHTML = `${data.cityName}<br>
    ${data.countryName}`;
  } else {
    elemLoc.innerHTML = `${data.cityName}, ${data.stateName}<br> 
    ${data.countryName}`;
  }

  getWeather(data.lat, data.lon);
};

const getLocRev = async (latInp, lonInp, elem) => {
  elem.innerHTML = "Locating...";
  const response = await fetch("/.netlify/functions/fetch-loc-reverse", {
    method: "POST",
    body: JSON.stringify({
      lat: latInp,
      lon: lonInp
    })
  });

  const data = await response.json();

  if (data.stateName === undefined) {
    elem.innerHTML = `${data.cityName}<br>
    ${data.countryName}`;
  } else {
    elem.innerHTML = `${data.cityName}, ${data.stateName}<br>
    ${data.countryName}`;
  }

  getWeather(latInp, lonInp);
};

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