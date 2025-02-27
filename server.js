require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const { exec } = require('child_process');

const app = express();

const TOMORROW_IO_API_KEY = process.env.TOMORROW_IO_API_KEY;
const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch weather data from Tomorrow.io (defaults to Gainesville, FL)
app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat || '29.6541';
    const lon = req.query.lon || '-82.3418';
    const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,windSpeed,precipitationProbability,humidity,sunriseTime,sunsetTime,weatherCode,temperatureMax,temperatureMin&timesteps=1d,current&units=imperial&apikey=${TOMORROW_IO_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(500).json({ error: 'Error fetching weather data' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching weather' });
  }
});

// (Optional) Geocoding endpoint using LocationIQ
app.get('/api/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: 'Address query parameter is required' });
    }
    const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.error) {
      return res.status(500).json({ error: 'Error fetching geocode data' });
    }
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching geocode' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Automatically open the default browser to the local URL (for Raspberry Pi/Linux)
  exec(`xdg-open http://localhost:${PORT}`, (err) => {
    if (err) {
      console.error('Error opening browser:', err);
    }
  });
});