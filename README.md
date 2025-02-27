# Pi-Weather-Screen

![Dark Mode Weather Dashboard](pics/Screenshot%202025-02-24%20152829.png)

Raspberry Pi home screen that shows real-time precipitation radar, weather forecasts, and time in a sleek, modern interface. Features both dark and light modes, with a clean design.

## Project Purpose

This project was created as the first step in building a larger AI system. I needed a sleek, visually appealing home screen that would serve as the central interface for the entire system. The weather dashboard combines interactive maps with essential weather data in a visually pleasing way.

The Pi-Weather-Screen is designed to be a constantly-running display that provides at-a-glance weather information and serves as the foundation for additional modules and AI features that will be added in future iterations. The AI features will be added to a different repository and I have no plans in updating this one unless the system stops working.

## Motivation

While researching similar projects online, I found that many existing weather dashboards for Raspberry Pi either looked outdated, didn't work as advertised, or required significant modifications to get functioning properly. Instead of struggling with incomplete solutions, I decided to build my own from scratch.

This project focuses on reliability, clean aesthetics, and a smooth user experience. It leverages modern web technologies that run efficiently on the Raspberry Pi while providing a responsive interface that just looks really sexy. I can't take full credit for this project as I was assisted by a variety of AI tools and even developed my own AI agent in the process of building this system.

## Features

- **Interactive precipitation radar map** using Mapbox and Tomorrow.io
- **Real-time weather data** including temperature, wind, precipitation chance, and sunrise/sunset times
- **5-day forecast** with temperature chart and daily conditions
- **Automatic hourly updates** for both weather data and precipitation radar
- **Responsive design** that works well on various screen sizes
- **Dark and light mode** toggle for different ambient lighting conditions

![Light Mode Weather Dashboard](pics/Screenshot%202025-02-24%20002700.png)

## Setup Requirements

- Raspberry Pi 
- Display connected to your Raspberry Pi (I'm using a touchscreen)
- Raspberry Pi OS
- Node.js 18.19.0 or higher
- Internet connection
- Tomorrow.io API key (for weather data)
- Mapbox access token (for interactive map)

## Installation and Setup

### Step 1: Set Up Your Raspberry Pi

If you haven't already set up your Raspberry Pi:
1. Install Raspberry Pi OS using the Raspberry Pi Imager
2. Connect to Wi-Fi during setup or via the desktop
3. Update your system:
   ```
   sudo apt update
   sudo apt upgrade -y
   ```

### Step 2: Install Required Software

Install Node.js (the project needs Node.js 18.19.0 or higher):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:
```bash
node -v  # Should show v18.x.x or higher
npm -v   # Should show the npm version
```

### Step 3: Get Required API Keys

This project requires two API keys:

1. **Tomorrow.io API Key**:
   - Go to [Tomorrow.io](https://www.tomorrow.io/) and sign up for an account
   - Navigate to their developer dashboard
   - Create a new API key
   - Copy the API key

2. **Mapbox API Key**:
   - Go to [Mapbox](https://www.mapbox.com/) and sign up for an account
   - Navigate to your account dashboard
   - Create a new access token (or use the default public token)
   - Copy the access token

### Step 4: Clone the Repository

1. Navigate to your home directory:
   ```bash
   cd ~
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/hudmarr/Pi-Weather-Screen.git
   ```

3. Navigate to the project directory:
   ```bash
   cd Pi-Weather-Screen
   ```

### Step 5: Configure Environment Variables

1. Edit the `.env` file:
   ```bash
   nano .env
   ```

2. Update with your Tomorrow.io API key:
   ```
   TOMORROW_IO_API_KEY=your_tomorrow_io_api_key_here
   PORT=3000
   ```

3. Save and exit (press Ctrl+X, then Y, then Enter)

### Step 6: (Optional) Change Default Location

If you want to change the default location from Gainesville, FL:

1. Open the server.js file:
   ```bash
   nano server.js
   ```

2. Find lines 16-17 in the file where the default coordinates are set:
   ```javascript
   const lat = req.query.lat || '29.6541';
   const lon = req.query.lon || '-82.3418';
   ```

3. Replace these coordinates with your desired location's latitude and longitude. This only affects the default weather data fetching - if map location is somewhere else then it will automatically fetch data for that location.

4. Save and exit (press Ctrl+X, then Y, then Enter)

Note: This step is completely optional. The application will work fine with the default location.

### Step 7: Update the script.js File

You also need to update the API keys directly in the script.js file:

1. Open the script.js file:
   ```bash
   nano public/script.js
   ```

2. Look for the following sections in the file and update them with your API keys:

   - Find the Mapbox token section (line 2):
     ```javascript
     // Mapbox Access Token
     mapboxgl.accessToken = '<enter in api key here>';
     ```
     Update it with your Mapbox access token.

   - Find the Tomorrow.io API key section (line 5):
     ```javascript
     // Tomorrow.io API Key
     const API_KEY = '<enter in api key here>'; 
     ```
     Update it with your Tomorrow.io API key.

3. Optionally, update the default location coordinates (lines 10-11):
   ```javascript
   // Enter you actual longitude and latitude (This is to Gainesville, FL)
   const longitude = -82.3418;
   const latitude = 29.6541;
   ```

4. Save and exit (press Ctrl+X, then Y, then Enter)

### Step 8: Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

This will install Express, dotenv, and node-fetch as specified in the `package.json` file.

### Step 9: Run the Application

Start the application:

```bash
npm start
```

The application should now be running, and your browser should automatically open to display the weather dashboard. If it doesn't open automatically, you can manually navigate to `http://localhost:3000` in your Raspberry Pi's browser.

Both the weather data and the precipitation radar map automatically refresh every hour to ensure you have up-to-date information.

