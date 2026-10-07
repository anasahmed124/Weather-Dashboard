const api = "https://api.open-meteo.com/v1/forecast";
console.log("API URL fucking working");
const searchBar = document.getElementById("search-bar");
const button = document.getElementById("search-button");

async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
  }
  throw new Error("City not found");
}

searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cityName = searchBar.value;
    geocodeCity(cityName);
    const { latitude, longitude } = coordinates;
    console.log(coordinates);
    console.log(coordinates.latitude.Date);
  }
});
//hena function ll geocode el city w fetch l data mn el api
button.addEventListener("click", function () {
  //5ale balk an awel 7aga hena betahsal hea el fetchh we 7ass feh 7aga naqsaa
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&hourly=temperature_2m,weathercode`,
  )
    .then((response) => {
      console.log(response);
      return response.json();
    })
    // ta7welat 3ady
    .then((data) => {
      console.log(data);

      let temperature = data.hourly.temperature_2m[0];
      console.log(data.hourly.temperature_2m[0]);

      let description = data.hourly.weathercode[0];
      console.log(data.hourly);

      let weatherElement = document.getElementById("weather");
      console.log(data.hourly.weathercode[0]);
      console.log("weather element fetched");

      let cityElement = document.getElementById("city-name");
      console.log("city element fetched");

      let dateElement = document.getElementById("date");
      console.log("date element fetched");

      document.getElementById("temperature").textContent =
        `Temperature: ${temperature} °C`;

      document.getElementById("weather").textContent =
        `Weather: ${description}`;

      document.getElementById("city-name").textContent = "Tokyo, Japan";

      document.getElementById("date").textContent =
        new Date().toLocaleDateString();
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
});
