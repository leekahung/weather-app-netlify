import fetch from "node-fetch";
import { GeoCodeType } from "./openWeatherMapTypes";

const regionName = new Intl.DisplayNames(["en"], { type: "region" });

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
  const GEOCODE_API = `https://api.openweathermap.org/geo/1.0/reverse?lat=${eventBody.lat}&lon=${eventBody.lon}&appid=${process.env.API_KEY}`;

  const response = await fetch(GEOCODE_API);
  const data = (await response.json()) as GeoCodeType[];

  return {
    statusCode: 200,
    body: JSON.stringify({
      cityName: data[0].name,
      stateName: data[0].state,
      countryName: regionName.of(data[0].country),
    }),
  };
};
