import fetch from "node-fetch";

export const handler = async (event) => {
  const eventBody = JSON.parse(event.body);
  const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=${eventBody.lat}&lon=${eventBody.lon}&appid=${process.env.API_KEY}&units=imperial`;

  const response = await fetch(WEATHER_API);
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      tempCurrent: data.main.temp,
      weatherCondition: data.weather[0].main,
      weatherDescript: data.weather[0].description,
      conditionCode: data.weather[0].id
    })
  };
};