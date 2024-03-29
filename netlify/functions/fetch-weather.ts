import fetch from "node-fetch";
import { CurrentWeatherType } from "../../public/openWeatherMapTypes";

interface FetchRequest {
  method: string;
  body: string;
}

interface FetchBody {
  lat: number;
  lon: number;
}

export const handler = async (event: FetchRequest) => {
  const eventBody: FetchBody = JSON.parse(event.body);
  const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=${eventBody.lat}&lon=${eventBody.lon}&appid=${process.env.API_KEY}&units=imperial`;

  const response = await fetch(WEATHER_API);
  const data = (await response.json()) as CurrentWeatherType;

  return {
    statusCode: 200,
    body: JSON.stringify({
      tempCurrent: data.main.temp,
      tempHigh: data.main.temp_max,
      tempLow: data.main.temp_min,
      weatherCondition: data.weather[0].main,
      weatherDescript: data.weather[0].description,
      conditionCode: data.weather[0].id,
      timeInfo: data.timezone,
    }),
  };
};
