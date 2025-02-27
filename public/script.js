
// Mapbox Access Token
mapboxgl.accessToken = '<enter in api key here>';

// Tomorrow.io API Key
const API_KEY = '<enter in api key here>'; 

const DATA_FIELD = 'precipitationIntensity';


// Enter you actual longitude and latitude (This is to Gainesville, FL)
const longitude = -82.3418;
const latitude = 29.6541;

// Initialize the map centered on Gainesville, FL
var map = (window.map = new mapboxgl.Map({
  container: 'map',
  zoom: 8,
  center: [longitude, latitude], // [long, lat]
  style: 'mapbox://styles/mapbox/light-v10',
  antialias: true
}));

// Function to add (or re-add) the Tomorrow.io precipitation overlay
function addWeatherOverlay() {
  const newTimestamp = new Date().toISOString();
  if (map.getSource('tomorrow-io-api')) {
    try {
      map.removeLayer('radar-tiles');
      map.removeSource('tomorrow-io-api');
    } catch (e) {
      // If removal fails, ignore it.
    }
  }
  map.addSource('tomorrow-io-api', {
    type: 'raster',
    tiles: [
      `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/${DATA_FIELD}/${newTimestamp}.png?apikey=${API_KEY}`
    ],
    tileSize: 256,
    attribution:
      '&copy; <a href="https://www.tomorrow.io/weather-api">Powered by Tomorrow.io</a>'
  });
  map.addLayer({
    id: 'radar-tiles',
    type: 'raster',
    source: 'tomorrow-io-api',
    minzoom: 1,
    maxzoom: 12
  });
}

// Initial load: add the weather overlay
map.on('load', function () {
  addWeatherOverlay();
});

// Theme toggle logic with re-adding overlay after style change
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const body = document.body;
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
    map.setStyle('mapbox://styles/mapbox/dark-v10');
    map.once('styledata', addWeatherOverlay);
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeToggle.textContent = 'Dark Mode';
    map.setStyle('mapbox://styles/mapbox/light-v10');
    map.once('styledata', addWeatherOverlay);
  }
});

// Update the current date/time with separate elements for time and date
function updateDateTime() {
  const now = new Date();
  const timeOptions = { hour: 'numeric', minute: '2-digit' };
  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const timeString = now.toLocaleTimeString([], timeOptions);
  const dateString = now.toLocaleDateString([], dateOptions);
  document.getElementById('current-time').textContent = timeString;
  document.getElementById('current-date').textContent = dateString;
}
updateDateTime();
setInterval(updateDateTime, 60 * 1000); // update every minute

// Helper to format ISO time to local HH:MM
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Map Tomorrow.io weather codes to descriptions
function weatherCodeToDescription(code) {
  const mapping = {
    1000: 'Clear',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    1001: 'Cloudy',
    2000: 'Fog',
    2100: 'Light Fog',
    3000: 'Light Wind',
    3001: 'Wind',
    3002: 'Strong Wind',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6001: 'Freezing Rain',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Light Ice Pellets',
    7102: 'Heavy Ice Pellets',
    8000: 'Unknown Precipitation'
  };
  return mapping[code] || `Unknown (${code})`;
}

// Get weather icon URL from OpenWeatherMap
function getWeatherIcon(code) {
  let iconCode = '01d'; // default: clear
  switch (code) {
    case 1000:
      iconCode = '01d';
      break;
    case 1100:
      iconCode = '02d';
      break;
    case 1101:
      iconCode = '03d';
      break;
    case 1102:
      iconCode = '04d';
      break;
    case 1001:
      iconCode = '04d';
      break;
    case 2000:
    case 2100:
      iconCode = '50d';
      break;
    case 3000:
    case 3001:
    case 3002:
      iconCode = '50d';
      break;
    case 4000:
      iconCode = '09d';
      break;
    case 4001:
      iconCode = '10d';
      break;
    case 4200:
    case 4201:
      iconCode = '10d';
      break;
    case 5000:
    case 5001:
    case 5100:
    case 5101:
      iconCode = '13d';
      break;
    case 6000:
      iconCode = '09d';
      break;
    case 6001:
      iconCode = '10d';
      break;
    case 6200:
    case 6201:
      iconCode = '10d';
      break;
    case 7000:
    case 7101:
    case 7102:
      iconCode = '13d';
      break;
    case 8000:
      iconCode = '50d';
      break;
    default:
      iconCode = '01d';
      break;
  }
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Render the forecast chart and icon row
function renderForecast(dailyData) {
  const labels = [];
  const avgTemps = [];
  dailyData.forEach(interval => {
    const date = new Date(interval.startTime);
    labels.push(date.toLocaleDateString([], { weekday: 'short' }));
    const { temperatureMax, temperatureMin } = interval.values;
    avgTemps.push((temperatureMax + temperatureMin) / 2);
  });
  const ctx = document.getElementById('avgTempChart').getContext('2d');
  if (window.avgTempChartInstance) {
    window.avgTempChartInstance.destroy();
  }
  window.avgTempChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Avg Temp (°F)',
          data: avgTemps,
          borderColor: '#f1c40f',
          backgroundColor: 'rgba(241,196,15,0.2)',
          fill: true,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: false } }
    }
  });
  const forecastIconsContainer = document.getElementById('forecast-icons');
  forecastIconsContainer.innerHTML = '';
  dailyData.forEach(interval => {
    const date = new Date(interval.startTime);
    const dayLabel = date.toLocaleDateString([], { weekday: 'short' });
    const { weatherCode, temperatureMax, temperatureMin } = interval.values;
    const iconUrl = getWeatherIcon(weatherCode);
    const high = Math.round(temperatureMax);
    const low = Math.round(temperatureMin);
    const card = document.createElement('div');
    card.className = 'forecast-icon-card';
    card.innerHTML = `
      <div>${dayLabel}</div>
      <img src="${iconUrl}" alt="Weather icon" style="width:40px;height:40px;">
      <div>${high}° / ${low}°</div>
    `;
    forecastIconsContainer.appendChild(card);
  });
}

// Fetch and update weather data (using a 5-day forecast)
async function updateWeather() {
  try {
    const response = await fetch('/api/weather?lat=29.6516&lon=-82.3248');
    if (!response.ok) {
      console.error('Failed to fetch weather data:', response.statusText);
      return;
    }
    const data = await response.json();
    if (!data.data || !data.data.timelines) {
      console.error('Unexpected weather data format:', data);
      return;
    }
    const currentTimeline = data.data.timelines.find(t => t.timestep === 'current');
    if (!currentTimeline || !currentTimeline.intervals?.length) {
      console.error('No current weather data available.');
      return;
    }
    const currentValues = currentTimeline.intervals[0].values;
    document.getElementById('current-temp').textContent = `${Math.round(currentValues.temperature)} °F`;
    document.getElementById('conditions').textContent = weatherCodeToDescription(currentValues.weatherCode);
    document.getElementById('wind').textContent = `Wind: ${Math.round(currentValues.windSpeed)} mph`;
    document.getElementById('precip').textContent = `Precip: ${Math.round(currentValues.precipitationProbability)}%`;
    document.getElementById('sunrise').textContent = `Sunrise: ${formatTime(currentValues.sunriseTime)}`;
    document.getElementById('sunset').textContent = `Sunset: ${formatTime(currentValues.sunsetTime)}`;
    const dailyTimeline = data.data.timelines.find(t => t.timestep === '1d');
    if (dailyTimeline) {
      // Use only a 5-day forecast
      const dailyData = dailyTimeline.intervals.slice(0, 5);
      renderForecast(dailyData);
    }
  } catch (error) {
    console.error('Error updating weather data:', error);
  }
}

updateWeather();
// Update weather and map overlay every hour
setInterval(() => {
  updateWeather();
  addWeatherOverlay();
}, 60 * 60 * 1000);
