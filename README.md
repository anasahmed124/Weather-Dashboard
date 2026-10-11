🌤️ Weather Dashboard

A responsive weather app built with vanilla HTML, CSS, and JavaScript. Search any city to see the current weather and a 5-day forecast, or use your current location. No frameworks and no API key needed.

 
<img width="1600" height="801" alt="image" src="https://github.com/user-attachments/assets/7ad328cf-65ae-4d45-86bc-08dd5e8f0895" />


✨ Features
🔎 Search by city name (button or Enter key)
🌡️ Current weather: temperature, conditions, humidity, and wind speed
📅 5-day forecast with high/low temperatures and icons
🔁 °C / °F toggle (no new request needed)
📍 "My Location" button using the Geolocation API
💾 Remembers your last search with localStorage
⏳ Clear loading and error messages
♿ Accessible: labeled input and an aria-live status area
🛠️ Built With
HTML5, CSS3, JavaScript (ES6+)
Open-Meteo API (free, no API key)
🚀 Run It
Clone the repo:
bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
Open index.html in your browser, or use the Live Server extension in VS Code.

📍 "My Location" works on localhost or https, so use a local server to test it.

📁 Project Structure
├── index.html        # Page structure
├── style.css         # Styling
├── main.js           # App logic
├── descriptions.js   # Weather code → text and icon lookups
└── background-image/ # Background image
🧠 How It Works
The city name is converted into coordinates (Geocoding API).
The coordinates are used to fetch the weather (Forecast API).
Weather codes are translated into readable text and icons.
The result is shown, and the last city is saved.
If something fails, the user sees a clear error message instead of a blank screen.
📚 What I Learned
Using fetch and async/await, including two dependent requests
Handling loading and error states with try/catch/finally
Managing the UI state in one place
Saving data with localStorage
Using the Geolocation API and handling denied permission
🙏 Credits

Weather data by Open-Meteo.available under the [MIT License](LICENSE).
