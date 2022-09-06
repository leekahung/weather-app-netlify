import fetch from "node-fetch";

const regionName = new Intl.DisplayNames(["en"], { type: "region" })

export const handler = async (event) => {
  const eventBody = JSON.parse(event.body);
  const GEOCODE_API = `https://api.openweathermap.org/geo/1.0/reverse?lat=${eventBody.lat}&lon=${eventBody.lon}&appid=${process.env.API_KEY}`;

  const response = await fetch(GEOCODE_API);
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      cityName: data[0].name,
      stateName: data[0].state,
      countryName: regionName.of(data[0].country)
      //data: data //debugger line
    })
  };
};