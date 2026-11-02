<div align="center">

# 🗺️ World Map Traveler

### Track and visualize all the countries and places you've visited

<img src="https://raw.githubusercontent.com/StephanWagner/worldMapSvg/master/maps/world-with-stroke.svg" width="400" alt="World Map"/>

*A modern, professional web application for your travel memories*

</div>

---

## Features

- **Interactive World Map**: Country-border visualization powered by Leaflet.js
- **Configurable Map Sources**: Switch between 6 tile providers (ArcGIS Ocean, OpenStreetMap, Stamen Terrain, CartoDB Positron, Esri Satellite, CartoDB Dark) from a dropdown in the top-right corner
- **Timeline Navigation**: Step through your travel history chronologically with arrow keys or the on-screen controls (including jump-to-first/jump-to-last)
- **Country Counter**: Real-time counter of unique countries visited, plus two days-abroad counters — a deduplicated running total and the length of just the currently selected visit
- **Current Country Badge**: Shows the year, country, and (optional) area/region of your current position in the timeline
- **Detailed Tooltips**: Hover over a visited country to see every visit's dates and places
- **Place Markers**: Red dots mark specific locations, geocoded on demand via OpenStreetMap's Nominatim service
- **Google Maps Integration**: Click a place marker to open its exact coordinates in Google Maps
- **Add New Visits**: Form to add new travel entries, with live validation that the country/place names are real locations before saving
- **Data Warnings**: Non-fatal issues (unrecognized country name, bad date range, geocoding failures) surface as dismissible toast notifications instead of silently failing
- **Manual Refresh**: Reload data from disk without restarting the app
- **Responsive Design**: Works seamlessly on desktop browsers
- **Modern UI**: Clean, professional interface with smooth animations

## Technology Stack

### Frontend
- **React 18**: UI framework
- **Leaflet.js**: Map rendering, driven directly (the `react-leaflet` dependency in `package.json` is currently unused)
- **Axios**: HTTP client for API and geocoding calls
- **CSS3**: Custom styling with animations and transitions

### Backend
- **Python Flask**: Lightweight API server
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **JSON File Storage**: Simple, human-readable, git-ignored data files

### External Services
- **GitHub-hosted GeoJSON** (`datasets/geo-countries`): Country border polygons
- **OpenStreetMap Nominatim**: Free geocoding for place markers and for validating country/place names when adding a visit

## Project Structure

```
world-map-traveler/
├── server/
│   ├── app.py                      # Flask server with API endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── countries.json              # Travel data (git-ignored; create from the .example)
│   ├── countries.json.example      # Template for travel data
│   ├── geocode_cache.json          # Cached place -> coordinates (git-ignored)
│   └── geocode_cache.json.example  # Template for the geocode cache
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorldMap.js         # Main map component (Leaflet)
│   │   │   ├── Controls.js         # Timeline navigation
│   │   │   ├── Counter.js          # Country/days counter + current country badge
│   │   │   ├── AddCountryForm.js   # Add visit modal form
│   │   │   ├── Notification.js     # Toast notifications
│   │   │   └── MapSourceToggle.js  # Map tile source dropdown
│   │   ├── mapConfig.js            # Map tile source definitions
│   │   ├── App.js                  # Root component (state + data fetching)
│   │   └── index.js
│   └── package.json
├── scripts/                        # Windows .bat and Git Bash/WSL .sh launchers
└── README.md
```

## Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Step 1: Set Up Your Travel Data

Create your own travel data file from the example:

```bash
cd server
cp countries.json.example countries.json
cp geocode_cache.json.example geocode_cache.json
```

Edit `countries.json` to add your own travel history (or just use the "+ Add Visit" button once the app is running — `countries.json` is also auto-created with sample data the first time you start the server if it doesn't exist yet).

### Step 2: Install Server Dependencies

```bash
cd server
pip install -r requirements.txt
```

### Step 3: Install Client Dependencies

```bash
cd client
npm install
```

## Running the Application

You need to run both the server and client in separate terminal windows.

### Terminal 1: Start the Flask Server

```bash
cd server
python app.py
```

The server will start on `http://localhost:5000`

### Terminal 2: Start the React Client

```bash
cd client
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

## Stopping the Application

You can easily stop the application using the provided scripts:

### Windows (Command Prompt or PowerShell)
```bash
# Stop both client and server
scripts\stop-all.bat

# Or stop them individually
scripts\stop-client.bat  # Stops React client on port 3000
scripts\stop-server.bat  # Stops Flask server on port 5000
```

### Git Bash or WSL
```bash
# Stop both client and server
./scripts/stop-all.sh

# Or stop them individually
./scripts/stop-client.sh  # Stops React client on port 3000
./scripts/stop-server.sh  # Stops Flask server on port 5000
```

### Manual Method
If the scripts don't work, you can:
- Close the terminal windows where you started the servers
- Or press `Ctrl+C` in each terminal window

## How to Use

### Initial View
- When you first open the app, you'll see the first country from your travel history highlighted on the map
- The counter shows how many unique countries you've visited so far, plus cumulative days abroad, up to that point

### Navigating Your Travel History
- **Right Arrow Key** or **Right Button**: Move forward in time
- **Left Arrow Key** or **Left Button**: Move backward in time
- **Jump-to-first / jump-to-last buttons**: Skip straight to the start or end of your history
- As you navigate, countries are highlighted cumulatively, showing your travel history up to that point
- The progress indicator shows your current position (e.g., "3/8")

### Viewing Details
- **Hover over any visited country** to see a popup with:
  - Country name
  - One entry per visit, with dates (from - to)
  - Specific places visited within that country
  - If no places are specified, it shows "Whole country visited"
- **Click on red place markers** to see a popup with:
  - Place name and country
  - All visit dates for that place
  - "Open in Google Maps" link - click to open the exact location in Google Maps

### Switching the Map Background
Click the map-style button in the top-right corner of the map to pick between ArcGIS Ocean, OpenStreetMap, Stamen Terrain, CartoDB Positron, Esri Satellite, or CartoDB Dark. The switch happens instantly without reloading the page.

### Adding New Visits
1. Click the **"+ Add Visit"** button in the top-right corner
2. Fill in the form:
   - **Country**: Name of the country (e.g., "France")
   - **Area**: (Optional) a specific region or island within the country (e.g., "Crete")
   - **From Date** / **To Date**: Start and end date of your visit
   - **Places**: (Optional) Comma-separated list of places (e.g., "Paris, Alsace")
3. Click **"Add Visit"**

Before saving, the app validates the country and every place against OpenStreetMap, one lookup per name at roughly one request per second — so submitting a visit with several places can take a few seconds. If a name can't be resolved, you'll get an inline error instead of a silently-broken map pin.

### Country Counter
- Shows the total number of unique countries visited up to the current point in your timeline
- **Days abroad (total)**: the number of distinct calendar days covered by every visible visit, with overlapping date ranges (e.g. a day trip to a neighboring country during a longer trip) counted once, not twice
- **Days Abroad (current)**: just the length of the single visit you're currently viewing (`dateTo - dateFrom + 1`), shown next to the total
- If you visit a country multiple times, it's only counted once toward the country total (but each visit still adds its days to the total)
- Reaches the final count when you navigate to the last entry

### Refreshing Data
Click the **"Refresh"** button in the header to re-fetch `countries.json` from disk — useful if you edited the file by hand while the app was running.

## Data Format

Travel data lives in `server/countries.json` as a JSON array. Each entry:

```json
{
  "dateFrom": "2020-01-15",
  "dateTo": "2020-01-25",
  "country": "France",
  "area": "",
  "places": ["Paris", "Alsace"]
}
```

- **dateFrom / dateTo**: `YYYY-MM-DD`
- **country**: Must match the country's standard English name as used in the app's GeoJSON country-border dataset, or it won't highlight (a short alias table in `WorldMap.js` currently covers "USA", "UK", and "UAE")
- **area**: Optional region/island label shown next to the country name in the "Current Country" badge
- **places**: Optional array of place names; each is geocoded on demand and shown as a red marker

Entries don't need to be pre-sorted in the file — the server sorts by `dateFrom` every time it reads the file. IDs are assigned on read and aren't stored.

`server/geocode_cache.json` caches geocoding lookups so repeat visits to the same place don't re-hit Nominatim:

```json
{
  "France": {
    "Paris": { "lat": "48.8566", "lon": "2.3522" }
  }
}
```

## Sample Data

If `countries.json` doesn't exist, the server creates it on first run with this sample data:

```json
[
  { "dateFrom": "2020-01-15", "dateTo": "2020-01-25", "country": "France", "places": ["Paris", "Alsace"] },
  { "dateFrom": "2020-06-10", "dateTo": "2020-06-20", "country": "Italy", "places": ["Rome", "Venice"] },
  { "dateFrom": "2021-03-05", "dateTo": "2021-03-15", "country": "Spain", "places": ["Barcelona", "Madrid"] },
  { "dateFrom": "2021-08-01", "dateTo": "2021-08-10", "country": "Germany", "places": ["Berlin"] },
  { "dateFrom": "2022-02-14", "dateTo": "2022-02-21", "country": "Japan", "places": ["Tokyo", "Kyoto"] }
]
```

## API Endpoints

### GET `/api/countries`
Returns all travel entries, sorted by `dateFrom`, each with an assigned `id`.
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "dateFrom": "2020-01-15",
      "dateTo": "2020-01-25",
      "country": "France",
      "area": "",
      "places": ["Paris", "Alsace"]
    }
  ]
}
```

### POST `/api/countries`
Add a new travel entry. `dateFrom`, `dateTo`, and `country` are required; `area` and `places` are optional.
```json
{
  "dateFrom": "2023-05-10",
  "dateTo": "2023-05-20",
  "country": "Portugal",
  "area": "",
  "places": ["Lisbon", "Porto"]
}
```

### GET `/api/stats`
Get travel statistics.
```json
{
  "success": true,
  "data": {
    "totalVisits": 5,
    "uniqueCountries": 5,
    "countries": ["France", "Italy", "Spain", "Germany", "Japan"]
  }
}
```

### GET `/api/geocode-cache`
Returns the cached place-name → coordinates lookups.

### POST `/api/geocode-cache`
Adds one `{country, place}` → `{coords}` entry to the cache.
```json
{ "country": "France", "place": "Paris", "coords": { "lat": "48.8566", "lon": "2.3522" } }
```

### POST `/api/validate-location`
Server-side proxy to Nominatim used by the "Add Visit" form to check a country or place name resolves to a real location before saving.
```json
{ "location": "Paris", "type": "place", "country": "France" }
```
```json
{ "success": true, "valid": true, "message": "Valid location" }
```

## Design Features

- **Highlight Colors** (set in `WorldMap.js`, independent of the tile source you pick):
  - Unvisited land: Tan (`#d2b48c`)
  - Previously visited countries: Teal/green (`#10b981`)
  - Current country (the last visible entry in the timeline): Red (`#ef4444`)
  - Ocean color and general basemap styling come from whichever tile provider is selected in the map-source dropdown

- **Animations**:
  - Smooth transitions when navigating
  - Hover effects on countries
  - Button animations
  - Modal slide-up effect

- **Professional UI**:
  - Modern gradient header
  - Rounded corners and shadows
  - Consistent spacing and typography
  - Clear visual hierarchy

## Troubleshooting

### Server Issues
- **Port 5000 already in use**: Change the port in `server/app.py` (the `app.run(...)` call at the bottom)
- **CORS errors**: Make sure Flask-CORS is installed and the server is running

### Client Issues
- **Dependencies not found**: Run `npm install` in the client directory
- **Map not loading**: Check your internet connection (country borders and tile images both load from external sources)
- **Port 3000 already in use**: React will prompt you to use a different port

### Data Issues
- **Countries not appearing**: Ensure country names in `countries.json` match the GeoJSON data (standard English names) — a toast warning will tell you if a name couldn't be matched
- **Place markers missing / "Location not found" warnings**: The place name may not be resolvable by Nominatim, or the lookup may still be in flight — geocoding is throttled to roughly 1 request/second
- **"Add Visit" taking a while**: Expected for entries with multiple places — each place is validated against Nominatim sequentially at ~1 request/second
- **App shows a "Failed to load countries data" error with a Retry button**: `countries.json` exists but couldn't be parsed (invalid JSON, or an entry missing `dateFrom`). The app deliberately refuses to proceed rather than guessing — fix the file by hand and click Retry. It will never overwrite the file for you in this state, so your data is safe while you fix it.

## Customization

### Adding More Sample Data
Edit `server/countries.json` directly or use the "+ Add Visit" button in the application.

### Changing Colors
The visited/unvisited/current highlight colors are set in the `style()` function inside `client/src/components/WorldMap.js` (not CSS, since Leaflet styles GeoJSON features via JS). General UI colors live in the CSS files under `client/src/components/`.

### Adding Map Tile Sources
Add a new entry to the `mapSources` object in `client/src/mapConfig.js` (needs `id`, `name`, `url`, `attribution`, `maxZoom`) — it will automatically appear in the map-source dropdown.

### Map Settings
Adjust initial zoom/center and fit-bounds behavior in `client/src/components/WorldMap.js`.

## Future Enhancements

Potential features for future versions:
- Edit and delete existing entries
- Export data to various formats (JSON, CSV)
- Statistics dashboard with charts
- Search and filter functionality
- Multiple user support with authentication
- Photo attachments for visits
- Shareable travel maps

## License

This project is open source and available for personal use.

## Support

For issues or questions, please check:
1. This README file
2. Console logs in browser developer tools
3. Server terminal output for error messages

---

**Enjoy tracking your world travels!**
