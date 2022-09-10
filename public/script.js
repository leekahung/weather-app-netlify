/* Main functions for getting location and weather */
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
    if (locSearch.value === "") {
      return;
    }

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

/* Helper functions that assist with obtaining geo coordinates via Navigator */
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

  if (response.ok) {
    if (data.stateName === undefined) {
      elemLoc.innerHTML = `${data.cityName},<br>
      ${data.countryName}`;
    } else {
      elemLoc.innerHTML = `${data.cityName}, ${data.stateName},<br> 
      ${data.countryName}`;
    }

    getWeather(data.lat, data.lon);
  } else {
    elemLoc.innerHTML = `${data.errMsg1}<br>
    ${data.errMsg2}`;
  }
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
    elem.innerHTML = `${data.cityName},<br>
    ${data.countryName}`;
  } else {
    elem.innerHTML = `${data.cityName}, ${data.stateName},<br>
    ${data.countryName}`;
  }

  getWeather(latInp, lonInp);
};

/* Helper functions that convert temperature */
const fahr2Cel = () => {
  if (tempCurr.innerHTML === "") {
    return;
  }

  if (units === "C") {
    tempCurr.innerHTML = `${Math.round(origTemp)}&#176;`;
    tempHi.innerHTML = `Hi ${Math.round(origTempHigh)}&#176;`;
    tempLo.innerHTML = `Lo ${Math.round(origTempLow)}&#176;`;
    units = "F";
  }
};

const cel2Fahr = () => {
  if (tempCurr.innerHTML === "") {
    return;
  }

  if (units === "F") {
    tempCurr.innerHTML = `${Math.round((origTemp - 32) * (5 / 9))}&#176;`;
    tempHi.innerHTML = `Hi ${Math.round((origTempHigh - 32) * (5 / 9))}&#176;`;
    tempLo.innerHTML = `Lo ${Math.round((origTempLow - 32) * (5 / 9))}&#176;`;
    units = "C";
  }
};

const tempCurr = document.getElementById("temp-curr");
const tempHi = document.getElementById("temp-high");
const tempLo = document.getElementById("temp-low");
const weatherCond = document.getElementById("weather-cond");
const weatherDesc = document.getElementById("weather-desc");
const fetchCallTime = document.getElementById("fetch-time");
const tempUnit = document.getElementById("temp-unit");
const tempSym = new Map([["F", ["&#8457;", "fahr", "tempF"]], ["C", ["&#8451;", "cel", "tempC"]]]);
const tempAbbrev = ["F", "C"];
const convertFuncs = [fahr2Cel, cel2Fahr];

let origTemp;
let origTempHigh;
let origTempLow;
let units = "F"; // set F as default

/* Main function to fetch weather from location coordinates */
const getWeather = async (latInp, lonInp) => {
  const response = await fetch("/.netlify/functions/fetch-weather", {
    method: "POST",
    body: JSON.stringify({
      lat: latInp,
      lon: lonInp
    })
  });

  const data = await response.json();
  const time = new Date();

  origTemp = data.tempCurrent;
  origTempHigh = data.tempHigh;
  origTempLow = data.tempLow;
  tempCurr.innerHTML = `${Math.round(origTemp)}&#176;`;
  tempHi.innerHTML = `Hi ${Math.round(origTempHigh)}&#176;`;
  tempLo.innerHTML = `Lo ${Math.round(origTempLow)}&#176;`;
  weatherCond.innerHTML = data.weatherCondition;
  weatherDesc.innerHTML = data.weatherDescript[0].toUpperCase() + data.weatherDescript.slice(1);
  fetchCallTime.innerHTML = `Last checked: ${time.toLocaleString()}`;

  if (document.getElementById("tempF") === null) {
    makeUnitBtns();
  }

  /* Logic to display weather icon */
  let utcTimeLocation = data.timeInfo / 3600;
  const utcTimeLocal = time.getTimezoneOffset() / -60;
  const locationHour = time.getHours() + (utcTimeLocation - utcTimeLocal);
 
  let condCode = data.conditionCode;
  const condIcon = document.getElementById("cond-icon");
  const iconPath = "./img/icons/icons/";
  const iconImg = document.createElement("img");
  iconImg.id = "cond-icon-img";

  switch (String(condCode)[0]) {
    case "2":
      iconImg.src = `${iconPath}thunderstorm.svg`;
      iconImg.alt = "thunderstorm icon";
      break;
    case "3":
      iconImg.src = `${iconPath}drizzle.svg`;
      iconImg.alt = "drizzle icon";
      break;
    case "5":
      if (condCode === 511) {
        iconImg.src = `${iconPath}freezing_rain.svg`;
        iconImg.alt = "freezing rain icon";
        break;
      } else {
        iconImg.src = `${iconPath}rain.svg`;
        iconImg.alt = "rain icon";
        break;
      }
    case "6":
      iconImg.src = `${iconPath}snow.svg`;
      iconImg.alt = "snow icon";
      break;
    case "7":
      if (condCode === 781) {
        iconImg.src = `${iconPath}tornado_storm.svg`;
        iconImg.alt = "tornado and storm icon";
        break;
      } else if ([731, 751, 761].includes(condCode)) {
        iconImg.src = `${iconPath}sandstorm.svg`;
        iconImg.alt = "sandstorm icon";
        break;
      } else {
        iconImg.src = `${iconPath}foggy.svg`;
        iconImg.alt = "foggy icon";
        break;
      }
    default:
      if (condCode === 800) {
        if ((locationHour >= 6) && (locationHour <= 1800)) {
          iconImg.src = `${iconPath}clear.svg`;
          iconImg.alt = "sun icon";
          break;
        } else {
          iconImg.src = `${iconPath}clear_night.svg`;
          iconImg.alt = "moon icon";
          break;
        }
      } else if ([801, 802].includes(condCode)) {
        if ((locationHour >= 6) && (locationHour <= 1800)) {
          iconImg.src = `${iconPath}cloudy_with_sun.svg`;
          iconImg.alt = "cloud with sun icon";
          break;
        } else {
          iconImg.src = `${iconPath}cloudy_with_moon.svg`;
          iconImg.alt = "cloud with moon icon";
          break;
        }
      } else {
        iconImg.src = `${iconPath}cloudy.svg`;
        iconImg.alt = "cloud icon";
        break;
      }
  }

  if (document.getElementById("cond-icon-img") === null) {
    condIcon.appendChild(iconImg);
  } else {
    document.getElementById("cond-icon-img").src = iconImg.src;
    document.getElementById("cond-icon-img").alt = iconImg.alt;
  }
};

/* Helper function to add temp conversion buttons to weather container */
const makeUnitBtns = () => {
  for (let i = 0; i < tempSym.size; i++) {
    const elem = document.createElement("div");
    const btn = document.createElement("button");
    tempUnit.appendChild(elem).className = "btn-grp";
    tempUnit.appendChild(elem).id = tempSym.get(tempAbbrev[i])[2];

    tempUnit.appendChild(elem).appendChild(btn).id = tempSym.get(tempAbbrev[i])[1];
    tempUnit.appendChild(elem).appendChild(btn).innerHTML = tempSym.get(tempAbbrev[i])[0];
    tempUnit.appendChild(elem).appendChild(btn).onclick = convertFuncs[i];
  }
};