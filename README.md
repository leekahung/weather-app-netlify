# weather-app-netlify

Welcome to the main repository for the weather app! The main app is now deployed on [Netlify]( https://khl-weather-app.netlify.app/).

For this build, it utilizes OpenWeatherMap's API to obtain the local weather data of a certain location.

To get location of interest, global coordinates are used. From the app, these coordinates can be obtained in one of two ways:

1. Locate Me, and
2. Search

The "Locate Me" approach can be access in one of two ways:

1. By clicking the "Locate Me" button, or
2. By pressing the "Enter" key from the keyboard when the search bar is empty

In either cases, "Locate Me" utilizes the Navigator API to collect a device's location coordinates, then calls OpenWeatherMap the obtain local weather of these coordinates. This approach requires device's permission and would not work if permission is denied.

The second approach is "Search". The "Search" approach is more direct in the sense that it utilizes the OpenWeatherMap API directly from the app. A location's name could be entered by typing in the search bar. At the moment, the app could accept several inputs:

1. City
1. City, Country
1. City, State/Province
1. City, State/Province, Country

From there, the OpenWeatherMap API would obtain the weather of the area using the coordinates of the location.