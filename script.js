// ---------------------------------------------------------
// Obhavo — kunlik ob-havo kuzatuvi
// Ma'lumotlar manbai: Open-Meteo (API kalit talab qilinmaydi)
// ---------------------------------------------------------

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Loyiha ochilganda ko'rsatiladigan boshlang'ich shahar
const DEFAULT_CITY = { name: "Toshkent", latitude: 41.2995, longitude: 69.2401, country: "O'zbekiston" };

const heroMain = document.getElementById("heroMain");
const detailGrid = document.getElementById("detailGrid");
const forecastSection = document.getElementById("forecastSection");
const forecastRow = document.getElementById("forecastRow");
const suggestions = document.getElementById("suggestions");
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const WEEKDAYS_UZ = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
const MONTHS_UZ = ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"];

// WMO ob-havo kodlarini toifa va tavsifga moslashtirish
function classifyWeatherCode(code) {
  if (code === 0) return { category: "clear", label: "Ochiq osmon" };
  if ([1, 2].includes(code)) return { category: "clear", label: "Deyarli ochiq" };
  if (code === 3) return { category: "cloudy", label: "Bulutli" };
  if ([45, 48].includes(code)) return { category: "fog", label: "Tuman" };
  if ([51, 53, 55, 56, 57].includes(code)) return { category: "rain", label: "Mayda yomg'ir" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { category: "rain", label: "Yomg'ir" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { category: "snow", label: "Qor yog'moqda" };
  if ([95, 96, 99].includes(code)) return { category: "storm", label: "Momaqaldiroq" };
  return { category: "cloudy", label: "Bulutli" };
}

function weatherGlyph(category, size = 64) {
  const stroke = "currentColor";
  const icons = {
    clear: `<circle cx="32" cy="32" r="14" fill="#F2A65A"/>
      ${[0,45,90,135,180,225,270,315].map(a => {
        const rad = (a * Math.PI) / 180;
        const x1 = 32 + Math.cos(rad) * 20, y1 = 32 + Math.sin(rad) * 20;
        const x2 = 32 + Math.cos(rad) * 27, y2 = 32 + Math.sin(rad) * 27;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F2A65A" stroke-width="3" stroke-linecap="round"/>`;
      }).join("")}`,
    cloudy: `<circle cx="24" cy="30" r="10" fill="#8A97B3"/>
      <ellipse cx="36" cy="34" rx="16" ry="12" fill="#C7D2E8"/>`,
    fog: `<line x1="10" y1="24" x2="54" y2="24" stroke="#8A97B3" stroke-width="3" stroke-linecap="round"/>
      <line x1="16" y1="34" x2="54" y2="34" stroke="#C7D2E8" stroke-width="3" stroke-linecap="round"/>
      <line x1="10" y1="44" x2="48" y2="44" stroke="#8A97B3" stroke-width="3" stroke-linecap="round"/>`,
    rain: `<ellipse cx="32" cy="24" rx="17" ry="12" fill="#8A97B3"/>
      <line x1="22" y1="42" x2="18" y2="54" stroke="#3FA79A" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="42" x2="28" y2="54" stroke="#3FA79A" stroke-width="3" stroke-linecap="round"/>
      <line x1="42" y1="42" x2="38" y2="54" stroke="#3FA79A" stroke-width="3" stroke-linecap="round"/>`,
    snow: `<ellipse cx="32" cy="22" rx="16" ry="11" fill="#C7D2E8"/>
      <circle cx="20" cy="46" r="2.5" fill="#EEF1F6"/>
      <circle cx="32" cy="50" r="2.5" fill="#EEF1F6"/>
      <circle cx="44" cy="46" r="2.5" fill="#EEF1F6"/>`,
    storm: `<ellipse cx="32" cy="20" rx="16" ry="10" fill="#5C6B8A"/>
      <path d="M30 32 L22 46 L30 46 L26 58 L42 40 L33 40 Z" fill="#F2A65A"/>`
  };
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${icons[category] || icons.cloudy}</svg>`;
}

function formatDate(date) {
  return `${WEEKDAYS_UZ[date.getDay()]}, ${date.getDate()}-${MONTHS_UZ[date.getMonth()]}`;
}

function windDirectionLabel(deg) {
  const dirs = ["Shimol", "Sh-Sh", "Sharq", "J-Sh", "Janub", "J-G'", "G'arb", "Sh-G'"];
  return dirs[Math.round(deg / 45) % 8];
}

async function fetchWeather(place) {
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
    timezone: "auto"
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error("Ob-havo ma'lumotlarini olishda xatolik");
  return res.json();
}

async function searchCity(query) {
  const params = new URLSearchParams({ name: query, count: 5, language: "ru", format: "json" });
  const res = await fetch(`${GEOCODE_URL}?${params}`);
  if (!res.ok) throw new Error("Qidiruvda xatolik");
  const data = await res.json();
  return data.results || [];
}

function setAmbience(category) {
  document.body.className = `wx-${category}`;
}

function renderLoading() {
  heroMain.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Ob-havo yuklanmoqda…</p>
    </div>`;
  detailGrid.hidden = true;
  forecastSection.hidden = true;
}

function renderError(message) {
  heroMain.innerHTML = `<div class="error-box"><p>${message}</p></div>`;
  detailGrid.hidden = true;
  forecastSection.hidden = true;
}

function renderWeather(place, data) {
  const current = data.current;
  const daily = data.daily;
  const { category, label } = classifyWeatherCode(current.weather_code);

  setAmbience(category);

  const today = new Date();
  const placeLabel = [place.name, place.admin1, place.country].filter(Boolean).slice(0, 2).join(", ");

  heroMain.innerHTML = `
    <div class="hero-content">
      <div>
        <p class="place-date">${formatDate(today)}</p>
        <h1 class="place-name">${placeLabel}</h1>
        <div class="temp-block">
          <span class="temp-value">${Math.round(current.temperature_2m)}</span>
          <span class="temp-unit">°C</span>
        </div>
      </div>
      <div class="condition-side">
        <div class="weather-glyph">${weatherGlyph(category, 64)}</div>
        <p class="condition-label">${label}</p>
        <p class="condition-range">Sezilishi ${Math.round(current.apparent_temperature)}°C · Yuqori ${Math.round(daily.temperature_2m_max[0])}° / Past ${Math.round(daily.temperature_2m_min[0])}°</p>
      </div>
    </div>
  `;

  // Shamol kompasi
  const windNeedle = document.getElementById("windNeedle");
  windNeedle.style.transform = `rotate(${current.wind_direction_10m}deg)`;
  document.getElementById("windValue").textContent =
    `${Math.round(current.wind_speed_10m)} km/soat · ${windDirectionLabel(current.wind_direction_10m)}`;

  // Namlik o'lchagichi (yarim doira, uzunligi ~126)
  const humidityFill = document.getElementById("humidityFill");
  const humidityRatio = Math.min(Math.max(current.relative_humidity_2m / 100, 0), 1);
  humidityFill.style.strokeDashoffset = String(126 - 126 * humidityRatio);
  document.getElementById("humidityValue").textContent = `${current.relative_humidity_2m}%`;

  document.getElementById("precipValue").textContent = `${daily.precipitation_probability_max[0]}%`;
  document.getElementById("precipSum").textContent = `Yog'in miqdori: ${daily.precipitation_sum[0]} mm`;
  document.getElementById("pressureValue").textContent = Math.round(current.surface_pressure);

  detailGrid.hidden = false;

  // 7 kunlik prognoz
  forecastRow.innerHTML = daily.time.map((dateStr, i) => {
    const d = new Date(dateStr);
    const { category: cat } = classifyWeatherCode(daily.weather_code[i]);
    const dayLabel = i === 0 ? "Bugun" : WEEKDAYS_UZ[d.getDay()];
    return `
      <div class="forecast-card">
        <span class="forecast-day">${dayLabel}</span>
        <div class="forecast-glyph">${weatherGlyph(cat, 32)}</div>
        <span class="forecast-high">${Math.round(daily.temperature_2m_max[i])}°</span>
        <span class="forecast-low">${Math.round(daily.temperature_2m_min[i])}°</span>
      </div>`;
  }).join("");

  forecastSection.hidden = false;
}

async function loadPlace(place) {
  renderLoading();
  try {
    const data = await fetchWeather(place);
    renderWeather(place, data);
  } catch (err) {
    renderError("Ob-havo ma'lumotlarini yuklab bo'lmadi. Internet aloqasini tekshiring.");
    console.error(err);
  }
}

// Qidiruv formasi
let searchTimeout = null;
cityInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestions.innerHTML = "";
    return;
  }
  searchTimeout = setTimeout(async () => {
    try {
      const results = await searchCity(query);
      suggestions.innerHTML = results.map(r => `
        <div class="suggestion-item" data-lat="${r.latitude}" data-lon="${r.longitude}" data-name="${r.name}" data-country="${r.country || ""}" data-admin1="${r.admin1 || ""}">
          ${[r.name, r.admin1, r.country].filter(Boolean).join(", ")}
        </div>`).join("");
    } catch (err) {
      console.error(err);
    }
  }, 350);
});

suggestions.addEventListener("click", (e) => {
  const item = e.target.closest(".suggestion-item");
  if (!item) return;
  const place = {
    name: item.dataset.name,
    latitude: parseFloat(item.dataset.lat),
    longitude: parseFloat(item.dataset.lon),
    country: item.dataset.country,
    admin1: item.dataset.admin1
  };
  suggestions.innerHTML = "";
  cityInput.value = "";
  loadPlace(place);
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = cityInput.value.trim();
  if (!query) return;
  try {
    const results = await searchCity(query);
    if (results.length > 0) {
      const r = results[0];
      suggestions.innerHTML = "";
      cityInput.value = "";
      loadPlace({ name: r.name, latitude: r.latitude, longitude: r.longitude, country: r.country, admin1: r.admin1 });
    } else {
      renderError("Shahar topilmadi. Boshqa nom bilan urinib ko'ring.");
    }
  } catch (err) {
    renderError("Qidiruvda xatolik yuz berdi.");
  }
});

// Boshlang'ich yuklash
loadPlace(DEFAULT_CITY);
