"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* Main functions for getting location and weather */
document.addEventListener("DOMContentLoaded", () => {
    const locSubmit = document.getElementById("loc-submit");
    const locSearch = document.getElementById("loc-search");
    const locName = document.getElementById("loc-name");
    const locHere = document.getElementById("loc-here");
    locHere.addEventListener("click", () => {
        locName.innerText = "Locating...";
        getCoords(locName);
    });
    locSubmit.addEventListener("click", () => {
        if (locSearch.value === "") {
            return;
        }
        locName.innerText = "Locating...";
        getLocDir(locSearch, locName);
    });
    document.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            locName.innerText = "Locating...";
        }
        if (event.key === "Enter" && locSearch.value === "") {
            getCoords(locName);
        }
        if (event.key === "Enter" && locSearch.value !== "") {
            getLocDir(locSearch, locName);
        }
    });
});
/* Helper functions that assist with obtaining geo coordinates via Navigator */
const getCoords = (elem) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        enableHighAccuracy: true,
        timeout: 4000,
        maximumAge: 0,
    };
    function success(pos) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        getLocRev(lat, lon, elem);
    }
    function error(err) {
        elem.innerText = `${err.message}; Unable to retrieve location.`;
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
});
const getLocDir = (elemSearch, elemLoc) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("/.netlify/functions/fetch-loc-direct", {
        method: "POST",
        body: JSON.stringify({
            locationName: elemSearch.value,
        }),
    });
    const data = yield response.json();
    if (response.ok) {
        if (!data.stateName) {
            elemLoc.innerText = `${data.cityName},\n ${data.countryName}`;
        }
        else {
            elemLoc.innerText = `${data.cityName}, ${data.stateName},\n ${data.countryName}`;
        }
        getWeather(data.lat, data.lon);
    }
    else {
        elemLoc.innerText = `${data.errMsg1}\n ${data.errMsg2}`;
    }
});
const getLocRev = (latInp, lonInp, elem) => __awaiter(void 0, void 0, void 0, function* () {
    elem.innerText = "Locating...";
    const response = yield fetch("/.netlify/functions/fetch-loc-reverse", {
        method: "POST",
        body: JSON.stringify({
            lat: latInp,
            lon: lonInp,
        }),
    });
    const data = yield response.json();
    if (!data.stateName) {
        elem.innerText = `${data.cityName},\n ${data.countryName}`;
    }
    else {
        elem.innerText = `${data.cityName}, ${data.stateName},\n ${data.countryName}`;
    }
    getWeather(latInp, lonInp);
});
let units = "F"; // set F as default
let origTemp;
let origTempHigh;
let origTempLow;
/* Main function to fetch weather from location coordinates */
const getWeather = (latInp, lonInp) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("/.netlify/functions/fetch-weather", {
        method: "POST",
        body: JSON.stringify({
            lat: latInp,
            lon: lonInp,
        }),
    });
    const data = yield response.json();
    const time = new Date();
    const tempCurr = document.getElementById("temp-curr");
    const tempHi = document.getElementById("temp-high");
    const tempLo = document.getElementById("temp-low");
    const weatherCond = document.getElementById("weather-cond");
    const weatherDesc = document.getElementById("weather-desc");
    const fetchCallTime = document.getElementById("fetch-time");
    origTemp = data.tempCurrent;
    origTempHigh = data.tempHigh;
    origTempLow = data.tempLow;
    weatherCond.innerText = data.weatherCondition;
    weatherDesc.innerText =
        data.weatherDescript[0].toUpperCase() + data.weatherDescript.slice(1);
    fetchCallTime.innerText = `Last checked: ${time.toLocaleString()}`;
    /* Logic to display weather image and icon */
    let utcTimeLocation = data.timeInfo / 3600;
    const utcTimeLocal = time.getTimezoneOffset() / -60;
    const locationHour = time.getHours() + (utcTimeLocation - utcTimeLocal);
    let condCode = data.conditionCode;
    const imgPath = "./img/webp/";
    const condImg = document.createElement("img");
    condImg.id = "cond-img";
    const condIcon = document.getElementById("cond-icon");
    const iconPath = "./img/icons/icons/";
    const iconImg = document.createElement("img");
    iconImg.id = "cond-icon-img";
    switch (String(condCode)[0]) {
        case "2":
            condImg.src = `${imgPath}thunderstorm.webp`;
            condImg.alt = "thunderstorm image";
            iconImg.src = `${iconPath}thunderstorm.svg`;
            iconImg.alt = "thunderstorm icon";
            break;
        case "3":
            condImg.src = `${imgPath}rain.webp`;
            condImg.alt = "rain image";
            iconImg.src = `${iconPath}drizzle.svg`;
            iconImg.alt = "drizzle icon";
            break;
        case "5":
            if (condCode === 511) {
                condImg.src = `${imgPath}snow.webp`;
                condImg.alt = "snow image";
                iconImg.src = `${iconPath}freezing_rain.svg`;
                iconImg.alt = "freezing rain icon";
                break;
            }
            else {
                condImg.src = `${imgPath}rain.webp`;
                condImg.alt = "rain image";
                iconImg.src = `${iconPath}rain.svg`;
                iconImg.alt = "rain icon";
                break;
            }
        case "6":
            condImg.src = `${imgPath}snow.webp`;
            condImg.alt = "snow image";
            iconImg.src = `${iconPath}snow.svg`;
            iconImg.alt = "snow icon";
            break;
        case "7":
            if (condCode === 781) {
                condImg.src = `${imgPath}tornado.webp`;
                condImg.alt = "tornado image";
                iconImg.src = `${iconPath}tornado_storm.svg`;
                iconImg.alt = "tornado and storm icon";
                break;
            }
            else if ([731, 751, 761].includes(condCode)) {
                condImg.src = `${imgPath}dust.webp`;
                condImg.alt = "sandstorm duststorm image";
                iconImg.src = `${iconPath}sandstorm.svg`;
                iconImg.alt = "sandstorm icon";
                break;
            }
            else {
                condImg.src = `${imgPath}fog.webp`;
                condImg.alt = "fog image";
                iconImg.src = `${iconPath}foggy.svg`;
                iconImg.alt = "foggy icon";
                break;
            }
        default:
            if (condCode === 800) {
                if (locationHour >= 6 && locationHour <= 18) {
                    condImg.src = `${imgPath}clear.webp`;
                    condImg.alt = "sunny image";
                    iconImg.src = `${iconPath}clear.svg`;
                    iconImg.alt = "sun icon";
                    break;
                }
                else {
                    condImg.src = `${imgPath}clear_night.webp`;
                    condImg.alt = "clear starry sky image";
                    iconImg.src = `${iconPath}clear_night.svg`;
                    iconImg.alt = "moon icon";
                    break;
                }
            }
            else if ([801, 802].includes(condCode)) {
                if (locationHour >= 6 && locationHour <= 18) {
                    condImg.src = `${imgPath}scatterclouds.webp`;
                    condImg.alt = "sun with scatter cloud image";
                    iconImg.src = `${iconPath}cloudy_with_sun.svg`;
                    iconImg.alt = "cloud with sun icon";
                    break;
                }
                else {
                    condImg.src = `${imgPath}cloudy_night.webp`;
                    condImg.alt = "moon with clouds image";
                    iconImg.src = `${iconPath}cloudy_with_moon.svg`;
                    iconImg.alt = "cloud with moon icon";
                    break;
                }
            }
            else {
                condImg.src = `${imgPath}overcast.webp`;
                condImg.alt = "cloudy image";
                iconImg.src = `${iconPath}cloudy.svg`;
                iconImg.alt = "cloud icon";
                break;
            }
    }
    /* Logic for updating weather img and icon */
    const condIconElem = document.getElementById("cond-icon-img");
    const condImgElement = document.getElementById("cond-img");
    if (!condIconElem) {
        condIcon.appendChild(iconImg);
    }
    else {
        condIconElem.src = iconImg.src;
        condIconElem.alt = iconImg.alt;
    }
    if (!condImgElement) {
        document.body.appendChild(condImg);
    }
    else {
        condImgElement.src = condImg.src;
        condImgElement.alt = condImg.alt;
    }
    /* Helper functions for temperature conversion */
    const setFahr = () => {
        tempCurr.innerText = `${Math.round(origTemp)}\u00B0`;
        tempHi.innerText = `Hi ${Math.round(origTempHigh)}\u00B0`;
        tempLo.innerText = `Lo ${Math.round(origTempLow)}\u00B0`;
        document.documentElement.style.setProperty("--tempF-select-opacity", "1");
        document.documentElement.style.setProperty("--tempC-select-opacity", "0");
        units = "F";
    };
    const setCel = () => {
        tempCurr.innerText = `${Math.round((origTemp - 32) * (5 / 9))}\u00B0`;
        tempHi.innerText = `Hi ${Math.round((origTempHigh - 32) * (5 / 9))}\u00B0`;
        tempLo.innerText = `Lo ${Math.round((origTempLow - 32) * (5 / 9))}\u00B0`;
        document.documentElement.style.setProperty("--tempF-select-opacity", "0");
        document.documentElement.style.setProperty("--tempC-select-opacity", "1");
        units = "C";
    };
    const fahr2Cel = () => {
        if (!tempCurr.innerText) {
            return;
        }
        if (units === "C") {
            setFahr();
        }
    };
    const cel2Fahr = () => {
        if (!tempCurr.innerText) {
            return;
        }
        if (units === "F") {
            setCel();
        }
    };
    /* Logic to create temp conversion buttons to weather container */
    if (!document.getElementById("tempF")) {
        const tempUnit = document.getElementById("temp-unit");
        const tempSym = new Map([
            ["F", ["\u2109", "fahr", "tempF"]],
            ["C", ["\u2103", "cel", "tempC"]],
        ]);
        const tempAbbrev = ["F", "C"];
        const convertFuncs = [fahr2Cel, cel2Fahr];
        for (let i = 0; i < tempSym.size; i++) {
            const elem = document.createElement("div");
            const btn = document.createElement("button");
            tempUnit.appendChild(elem).className = "btn-grp";
            tempUnit.appendChild(elem).id = tempSym.get(tempAbbrev[i])[2];
            tempUnit.appendChild(elem).appendChild(btn).id = tempSym.get(tempAbbrev[i])[1];
            tempUnit.appendChild(elem).appendChild(btn).innerText = tempSym.get(tempAbbrev[i])[0];
            tempUnit.appendChild(elem).appendChild(btn).onclick = convertFuncs[i];
        }
    }
    /* Logic to set temperature based on temperature scale settings */
    if (units === "F") {
        setFahr();
    }
    else {
        setCel();
    }
});
