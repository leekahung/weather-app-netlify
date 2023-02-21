import fetch from "node-fetch";
import { GeoCodeType } from "../../public/openWeatherMapTypes";

interface FetchRequest {
  method: string;
  body: string;
}

interface FetchBody {
  locationName: string;
}

const regionName = new Intl.DisplayNames(["en"], { type: "region" });

export const handler = async (event: FetchRequest) => {
  const eventBody: FetchBody = JSON.parse(event.body);
  const GEOCODE_API = `https://api.openweathermap.org/geo/1.0/direct?q=${eventBody.locationName}&limit=5&appid=${process.env.API_KEY}`;

  try {
    const response = await fetch(GEOCODE_API);
    const data = (await response.json()) as GeoCodeType[];

    const locArr = eventBody.locationName
      .toLowerCase()
      .split(",")
      .map((item) => item.trim());
    let likelyLoc!: GeoCodeType;

    switch (locArr.length) {
      case 1:
        likelyLoc = data[0];
        break;
      case 2:
      case 3:
        likelyLoc = data.filter(
          (item) =>
            item.hasOwnProperty("state") &&
            item.state?.toLowerCase() === locArr[1]
        )[0];
        if (likelyLoc === undefined) {
          likelyLoc = data.filter(
            (item) => regionName.of(item.country)?.toLowerCase() === locArr[1]
          )[0];
        }
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        cityName: likelyLoc.name,
        stateName: likelyLoc.state,
        countryName: regionName.of(likelyLoc.country),
        lat: likelyLoc.lat,
        lon: likelyLoc.lon,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        errMsg1: "Unable to retrieve location;",
        errMsg2: "Try to include country name.",
      }),
    };
  }
};
