const api = "https://api.open-meteo.com/v1/forecast";
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const toggleButton = document.getElementById("toggle-button");
const statusElement = document.getElementById("status");
const locationButton = document.getElementById("location-button");
const resultsElement = document.getElementById("results");
let temperature = 0;
let isCelsius = true;
let savedCity = "lastCity";
let dailyData = null;

function saveLastCity(city) {
  try {
    localStorage.setItem(savedCity, city);
  } catch (error) {
    console.error("Could not save city:", error);
  }
}

function loadLastCity() {
  try {
    return localStorage.getItem(savedCity);
  } catch (error) {
    return null;
  }
}

function renderState(state, message = "") {
  if (state === "success") {
    resultsElement.hidden = false;
    statusElement.textContent = "";
  } else {
    resultsElement.hidden = true;
    statusElement.textContent = message;
  }

  const isLoading = state === "loading";
  searchButton.disabled = isLoading;
  locationButton.disabled = isLoading;
}

function inIt() {
  const lastCity = loadLastCity();

  if (lastCity) {
    searchBar.value = lastCity;
    search(lastCity);
  } else {
    renderState("idle", "Search a city to get started");
  }
}

async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cityName,
  )}&count=1&language=en&format=json`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
  }

  throw new Error("City not found");
}

async function fetchWeatherMyLocation(latitude, longitude) {
  const response = await fetch(
    `${api}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`,
  );

  const data = await response.json();

  temperature = data.current.temperature_2m;
  const weatherCode = data.current.weather_code;
  const weatherDescription = weatherDescriptions[weatherCode] ?? "Unknown";
  const windSpeed = data.current.wind_speed_10m;
  const humidity = data.current.relative_humidity_2m;

  renderTemperature();
  dailyData = data.daily;
  renderForecast();

  document.getElementById("weather-conditions").textContent =
    `Weather Conditions: ${weatherDescription}`;

  document.getElementById("wind-speed").textContent =
    `Wind Speed: ${windSpeed} km/h`;

  document.getElementById("humidity").textContent = `Humidity: ${humidity} %`;

  document.getElementById("date").textContent = new Date().toLocaleDateString();
}

async function fetchWeatherData(cityName) {
  const coordinates = await geocodeCity(cityName);
  const { latitude, longitude } = coordinates;
  await fetchWeatherMyLocation(latitude, longitude);

  document.getElementById("city-name").textContent = cityName;
  saveLastCity(cityName);
}

async function search(cityName) {
  if (searchButton.disabled) return;

  const cleanSearch = cityName.trim();
  if (cleanSearch === "") return;

  renderState("loading", "Loading…");
  try {
    await fetchWeatherData(cleanSearch);
    renderState("success");
  } catch (error) {
    console.log(error.message);
    if (error.message === "City not found") {
      renderState("error", "City not found. Check the spelling and try again.");
    } else {
      renderState("error", "Something went wrong. Please try again.");
    }
  }
}

searchButton.addEventListener("click", () => {
  search(searchBar.value);
});

searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    search(searchBar.value);
  }
});

locationButton.addEventListener("click", () => {
  if (locationButton.disabled) return;

  async function success(position) {
    const { latitude, longitude } = position.coords;
    try {
      await fetchWeatherMyLocation(latitude, longitude);
      document.getElementById("city-name").textContent = "Your location";
      renderState("success");
    } catch (err) {
      console.log(err.message);
      renderState("error", "Something went wrong. Please try again.");
    }
  }

  function error(err) {
    console.log(err.message);
    renderState(
      "error",
      "Location access denied. Please search for a city instead.",
    );
  }

  renderState("loading", "Loading…");
  navigator.geolocation.getCurrentPosition(success, error);
});

function celsiusChange(celsius) {
  return ((celsius * 9) / 5 + 32).toFixed(2);
}

function renderTemperature() {
  if (isCelsius) {
    document.getElementById("temperature").textContent =
      `Temperature: ${temperature} °C`;
  } else {
    document.getElementById("temperature").textContent =
      `Temperature: ${celsiusChange(temperature)} °F`;
  }
}

function renderForecast() {
  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  if (!dailyData) return;

  for (let i = 1; i <= 5; i++) {
    const dayName = new Date(dailyData.time[i] + "T00:00").toLocaleDateString(
      "en-US",
      { weekday: "short" },
    );
    const icon = dayIcons[dailyData.weather_code[i]] ?? "🌡️";
    const max = isCelsius
      ? Math.round(dailyData.temperature_2m_max[i])
      : Math.round(celsiusChange(dailyData.temperature_2m_max[i]));
    const min = isCelsius
      ? Math.round(dailyData.temperature_2m_min[i])
      : Math.round(celsiusChange(dailyData.temperature_2m_min[i]));
    const unit = isCelsius ? "°C" : "°F";

    const card = document.createElement("div");
    card.className = "forecast-card";

    const dayEl = document.createElement("div");
    dayEl.className = "forecast-day";
    dayEl.textContent = dayName;

    const iconEl = document.createElement("div");
    iconEl.className = "forecast-icon";
    iconEl.textContent = icon;

    const tempsEl = document.createElement("div");
    tempsEl.className = "forecast-temps";
    tempsEl.textContent = `${max}${unit} / ${min}${unit}`;

    card.appendChild(dayEl);
    card.appendChild(iconEl);
    card.appendChild(tempsEl);
    forecastEl.appendChild(card);
  }
}

toggleButton.addEventListener("click", () => {
  isCelsius = !isCelsius;
  renderTemperature();
  renderForecast();
});

inIt();
