# Quick Start Guide

Get your World Map Traveler application running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js installed (check: `node --version`)
- [ ] Python 3 installed (check: `python --version`)
- [ ] npm installed (check: `npm --version`)

## Installation Steps

### 1. Install Server Dependencies (1 minute)

Open a terminal and run:

```bash
cd server
pip install -r requirements.txt
```

### 2. Install Client Dependencies (2-3 minutes)

Open another terminal and run:

```bash
cd client
npm install
```

That's it for setup — `server/countries.json` is created automatically with sample data the first time the server runs if it doesn't already exist. If you want to start from the committed templates instead (e.g. to also get an empty `geocode_cache.json`), run:

```bash
cd server
cp countries.json.example countries.json
cp geocode_cache.json.example geocode_cache.json
```

## Running the Application

### Option A: Using Batch Scripts (Windows)

**Easiest method for Windows users:**

1. Double-click `scripts\start-server.bat` to start the backend
2. Double-click `scripts\start-client.bat` to start the frontend
3. Your browser will open automatically at http://localhost:3000

### Option B: Using Terminal Commands

**Terminal 1 - Start Server:**
```bash
cd server
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

**Terminal 2 - Start Client:**
```bash
cd client
npm start
```

Your browser will automatically open to http://localhost:3000

## First Time Using the App

1. **View the Map**: You'll see a world map with the first visited country highlighted
2. **Navigate**: Use the Right Arrow key or click the right/first/last buttons to move through your travel history
3. **Hover**: Move your mouse over visited countries to see details
4. **Switch Basemaps**: Click the map-style button in the top-right of the map to pick a different tile provider
5. **Add Visit**: Click "+ Add Visit" to add a new country

## Testing All Features

### ✓ Navigation
- Press **Right Arrow** key → Country counter should increase
- Press **Left Arrow** key → Go back in history
- Click the "jump to first/last" buttons to skip to either end

### ✓ Country Details
- Hover over any highlighted (visited) country
- You should see a popup with dates and places

### ✓ Place Markers
- Look for red dots on the map (specific locations)
- Click on a red dot to see place details
- Click "Open in Google Maps" to view the location in Google Maps

### ✓ Counters
- The header shows unique countries visited, "Days abroad (total)" (deduplicated across all visible visits — a day trip during a longer stay isn't double-counted), "Days Abroad (current)" (just the visit you're currently viewing), and the current country/area/year for your position in the timeline

### ✓ Map Source Toggle
- Click the dropdown button in the top-right of the map and switch between ArcGIS Ocean, OpenStreetMap, Stamen Terrain, CartoDB Positron, Esri Satellite, and CartoDB Dark

### ✓ Add New Country
1. Click "+ Add Visit" button
2. Fill in: Country = "Greece", From = "2023-07-01", To = "2023-07-10", Places = "Athens, Santorini"
3. Click "Add Visit"
4. The app validates the country and each place against OpenStreetMap before saving (roughly 1 request/second per name), so this can take a few seconds for multiple places
5. Press Right Arrow to navigate to your new entry

### ✓ Refresh
- Click the "Refresh" button in the header to re-read `countries.json` from disk without restarting the server

## Sample Data Included

The app comes with 5 sample visits (auto-generated in `countries.json` on first run):
1. France (Paris, Alsace) - Jan 2020
2. Italy (Rome, Venice) - Jun 2020
3. Spain (Barcelona, Madrid) - Mar 2021
4. Germany (Berlin) - Aug 2021
5. Japan (Tokyo, Kyoto) - Feb 2022

## Troubleshooting

### Server won't start
- **Error: Port 5000 in use**
  - Kill the process using port 5000, or
  - Edit `server/app.py`, change `port=5000` to `port=5001` (and update the client's API URLs to match — see README)

### Client won't start
- **Error: Dependencies not found**
  - Run `npm install` in the client directory again

### Map doesn't load
- **Check internet connection** (country borders and tile images are both loaded from external sources, not from the Flask server)
- **Check browser console** (F12) for errors

### Countries not showing
- **Verify server is running** on http://localhost:5000
- **Check browser console** for CORS errors
- A toast notification will appear if a country name in `countries.json` can't be matched to the map data
- If instead you see a full-page "Failed to load countries data" error with a Retry button, `countries.json` itself is invalid (bad JSON, or an entry missing `dateFrom`) — fix the file and click Retry; the app won't touch the file while it's in this state

### Add Visit form seems slow
- This is expected: each country/place name is checked against OpenStreetMap one at a time, throttled to ~1 request/second, before the visit is saved

## Next Steps

Once everything is working:

1. **Edit your data**: Open `server/countries.json` in a text editor
2. **Replace sample data** with your actual travels (see README for the JSON entry format)
3. **Restart the server** to see your data
4. Or use the "+ Add Visit" button to add entries one by one

## Need Help?

- Read the full [README.md](README.md) for detailed documentation
- Check the console logs in your browser (F12 → Console tab)
- Check the server terminal for Python errors

---

**That's it! Enjoy tracking your world travels! 🌍✈️**
