# Architecture Overview

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                USER BROWSER (localhost:3000)                 │
├────────────────────────────────────────────────────────────┤
│  React Application                                            │
│   App                                                          │
│   ├── WorldMap          (Leaflet map, driven imperatively      │
│   │                      via `L`, not through react-leaflet)   │
│   ├── Controls          (timeline navigation)                  │
│   ├── Counter           (counts + current-country badge)       │
│   ├── AddCountryForm    (modal, shown conditionally)            │
│   ├── Notification      (toasts, 0..n at a time)                │
│   └── MapSourceToggle   (tile-provider dropdown)                 │
└────────────────────────────┬─────────────────────────────────┘
                              │ HTTP (Axios)
                              ↓
┌────────────────────────────────────────────────────────────┐
│               Flask Server (localhost:5000)                  │
│                                                                │
│  GET/POST /api/countries                                       │
│  GET      /api/stats                                            │
│  GET/POST /api/geocode-cache                                     │
│  POST     /api/validate-location  → proxies to Nominatim           │
│                                                                │
│  parse_countries_file() / write_countries_file()                │
└────────────────────────────┬─────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│                 Data Storage (JSON files)                    │
│                                                                │
│   server/countries.json      — travel entries                  │
│   server/geocode_cache.json  — cached place → {lat, lon}         │
└────────────────────────────────────────────────────────────┘
```

Services the **browser talks to directly**, bypassing Flask entirely:
- **GitHub raw** (`datasets/geo-countries`): country-border GeoJSON, fetched once per session
- **Map tile providers** configured in `mapConfig.js` (ArcGIS, OSM, Stadia/Stamen, CartoDB, Esri): basemap imagery for whichever source is selected
- **OpenStreetMap Nominatim**: place-marker geocoding lookups (`WorldMap.js` calls it directly; only the add-visit name *validation* call goes through the Flask proxy above)

## Component Hierarchy

```
App
├── Header
│   ├── Title (h1)
│   ├── Counter
│   │   ├── unique-country count + label
│   │   ├── days-abroad count + label
│   │   └── current country / area / year badge
│   └── Header Buttons
│       ├── Refresh (re-fetches countries.json)
│       └── + Add Visit
│
├── MapContainer
│   ├── MapSourceToggle (dropdown, top-right overlay)
│   └── WorldMap
│       ├── Leaflet Map + Tile Layer (swappable)
│       ├── GeoJSON Layer (country polygons + highlight styling)
│       ├── Place Markers (geocoded red dots)
│       ├── Popups (country visit details, place details)
│       └── Event Handlers (hover styling)
│
├── Notification (0..n toasts, one per data warning)
│
├── Controls
│   ├── First Button
│   ├── Previous Button
│   ├── Progress Indicator
│   ├── Next Button
│   └── Last Button
│
└── AddCountryForm (Modal, shown conditionally)
    ├── Form Fields
    │   ├── Country Input (validated against Nominatim)
    │   ├── Area Input (optional, not validated)
    │   ├── Date From Input
    │   ├── Date To Input
    │   └── Places Input (comma-separated, each validated against Nominatim)
    └── Action Buttons
        ├── Cancel
        └── Submit
```

## Data Flow

### 1. Initial Load
```
User Opens App
     ↓
App.useEffect() → fetchCountries()
     ↓
axios.get('/api/countries')
     ↓
Flask: parse_countries_file() reads & sorts countries.json by dateFrom
     ↓
Return JSON Response (IDs assigned on read)
     ↓
Update React State (entries), reset currentIndex to 0
     ↓
WorldMap Re-renders with visibleEntries = entries.slice(0, 1)

In parallel, independent of the above, WorldMap's own useEffect:
     ↓
Fetch country-border GeoJSON from GitHub (once, cached in state)
     ↓
Fetch geocode cache: axios.get('/api/geocode-cache') → geocodingCacheRef
     ↓
Once both the GeoJSON and entries are available, build the GeoJSON
layer, style it, and kick off marker geocoding (see below)
```

### 2. Navigation Flow
```
User Presses Right Arrow (or clicks a Controls button)
     ↓
Controls' keydown listener / button onClick → onNext() / onPrevious() / onFirst() / onLast()
     ↓
App: setCurrentIndex(...)
     ↓
visibleEntries = entries.slice(0, currentIndex + 1)   (recomputed, not stored in state)
uniqueCountries / countryCount / totalDaysAbroad / currentEntry all re-derived from visibleEntries
     ↓
WorldMap receives new `entries` prop (= visibleEntries)
     ↓
Re-render GeoJSON Layer: restyle visited/current/unvisited, add/remove place markers
     ↓
Counter re-renders with new counts and current-country badge
```

### 3. Add Country Flow
```
User Clicks "+ Add Visit" → AddCountryForm opens
     ↓
User fills form, clicks Submit
     ↓
Client-side check: required fields present, dateTo >= dateFrom
     ↓
POST /api/validate-location  { location: country, type: 'country' }   (proxies to Nominatim)
     ↓ (sequentially, ~1 req/sec, one call per place)
POST /api/validate-location  { location: place, type: 'place', country }
     ↓
If any validation fails → show inline error, stop (nothing is saved)
     ↓
onSubmit() → axios.post('/api/countries', { dateFrom, dateTo, country, area, places })
     ↓
Flask: parse_countries_file() → append new entry → write_countries_file()
      (re-sorts by dateFrom, strips id, writes full file back)
     ↓
Return success response
     ↓
App: fetchCountries() (full refetch) → close modal
```

### 4. Place Marker Geocoding Flow
```
WorldMap builds the set of (country, place) pairs that should be visible
     ↓
For each pair not already rendered:
     ↓
  Check in-memory geocodingCacheRef (populated from /api/geocode-cache on load)
     ↓ (miss)
  GET https://nominatim.openstreetmap.org/search?... (rate-limited to ~1 req/sec)
     ↓ (found)
  Cache in geocodingCacheRef + fire-and-forget POST /api/geocode-cache to persist
     ↓ (not found)
  onWarning(...) → one-time toast via Notification, deduped per session
     ↓
  Render L.marker with a custom red divIcon + popup (dates + "Open in Google Maps" link)
```

## State Management

### App Component State
```javascript
{
  entries: [],            // All travel entries (sorted by dateFrom, from the server)
  currentIndex: 0,        // Current timeline position
  loading: true,          // Loading state
  error: null,            // Error message
  showAddForm: false,     // Add-visit modal visibility
  refreshTrigger: 0,      // Bumped by the Refresh button; re-triggers WorldMap's data load effect
  notifications: [],      // Active toast warnings: { id, message, type }
  mapSource: 'arcgis'     // Selected tile provider key (see mapConfig.js)
}
```

### Derived State (recomputed on every render, not stored)
```javascript
visibleEntries   = entries.slice(0, currentIndex + 1)
uniqueCountries  = new Set(visibleEntries.map(e => e.country))
countryCount     = uniqueCountries.size
totalDaysAbroad  = sum of (dateTo - dateFrom + 1) over visibleEntries
currentEntry     = visibleEntries[visibleEntries.length - 1] (or null)
currentCountry   = currentEntry?.country
currentArea      = currentEntry?.area
currentYear      = year of currentEntry?.dateFrom
```

## API Contract

### GET /api/countries

**Response:**
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

### POST /api/countries

**Request:**
```json
{
  "dateFrom": "2023-05-10",
  "dateTo": "2023-05-20",
  "country": "Portugal",
  "area": "",
  "places": ["Lisbon", "Porto"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "dateFrom": "2023-05-10",
    "dateTo": "2023-05-20",
    "country": "Portugal",
    "places": ["Lisbon", "Porto"]
  }
}
```

### GET /api/stats

**Response:**
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

### GET /api/geocode-cache

**Response:**
```json
{
  "success": true,
  "data": {
    "France": { "Paris": { "lat": "48.8566", "lon": "2.3522" } }
  }
}
```

### POST /api/geocode-cache

**Request:**
```json
{ "country": "France", "place": "Paris", "coords": { "lat": "48.8566", "lon": "2.3522" } }
```

**Response:** the full updated cache object, same shape as the GET response.

### POST /api/validate-location

**Request:**
```json
{ "location": "Paris", "type": "place", "country": "France" }
```

**Response:**
```json
{ "success": true, "valid": true, "message": "Valid location" }
```
`type: "country"` additionally checks Nominatim's `addresstype === 'country'` rather than just "got a result".

## Key Technologies

### Frontend Stack
```
React 18.2.0
├── react-dom          (UI rendering)
├── react-scripts 5.0.1 (build tools / dev server)
├── leaflet 1.9.4       (mapping library — used directly via the `L` import)
├── react-leaflet 4.2.1 (listed dependency, currently unused in the codebase)
└── axios 1.6.0         (HTTP client, for both the Flask API and direct Nominatim calls)
```

### Backend Stack
```
Python 3.8+
├── Flask 3.0.0       (web framework)
└── flask-cors 4.0.0  (CORS support — currently wide open, no origin allowlist)
```

The `requests` library is used server-side too (for the Nominatim proxy in `/api/validate-location`), imported inline rather than listed in `requirements.txt` — it's typically already present as a Flask dependency, but isn't pinned.

## File Structure

```
world-map-traveler/
│
├── client/                         # Frontend
│   ├── public/
│   │   └── index.html              # HTML template
│   │
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── WorldMap.js / .css
│   │   │   ├── Controls.js / .css
│   │   │   ├── Counter.js / .css
│   │   │   ├── AddCountryForm.js / .css
│   │   │   ├── Notification.js / .css
│   │   │   └── MapSourceToggle.js / .css
│   │   │
│   │   ├── mapConfig.js            # Tile provider registry
│   │   ├── App.js                  # Root component
│   │   ├── App.css
│   │   ├── index.js                # Entry point
│   │   └── index.css
│   │
│   └── package.json                # Dependencies
│
├── server/                         # Backend
│   ├── app.py                      # Flask application
│   ├── requirements.txt            # Python deps
│   ├── countries.json              # Data storage (git-ignored)
│   ├── countries.json.example      # Template
│   ├── geocode_cache.json          # Geocoding cache (git-ignored)
│   └── geocode_cache.json.example  # Template
│
├── scripts/                        # Windows .bat / Git Bash .sh start & stop launchers
│
├── README.md
├── QUICKSTART.md
├── PROJECT_SUMMARY.md
├── ARCHITECTURE.md                 # This file
├── TESTING_GUIDE.md                # Manual QA checklist (no automated test suite exists)
├── CLAUDE.md                       # Guidance for Claude Code in this repo
└── .gitignore
```

## Design Patterns Used

### 1. Component Pattern
Each UI element is a reusable component with props and state.

### 2. Container/Presenter Pattern
- **Container**: App.js (manages state and data fetching)
- **Presenters**: Counter, Controls, Notification, MapSourceToggle (receive props, render UI)
- **Hybrid**: WorldMap and AddCountryForm manage their own local state/effects (map instance, geocoding, form fields) in addition to presenting

### 3. Controlled Components
Form inputs controlled by React state (`AddCountryForm`).

### 4. Imperative Escape Hatch
`WorldMap.js` steps outside React's declarative model and drives Leaflet directly through refs inside `useEffect`, since Leaflet owns a mutable DOM/canvas the virtual DOM shouldn't manage.

### 5. Configuration Registry
`mapConfig.js` is a plain object keyed by provider id; UI (`MapSourceToggle`) and rendering (`WorldMap`) both iterate/index it, so adding a tile provider requires touching only that one file.

### 6. REST API Pattern
Standard HTTP methods and JSON response envelopes (`{success, data | error}`).

### 7. MVC-like Pattern
- **Model**: `countries.json` / `geocode_cache.json`
- **View**: React components
- **Controller**: Flask endpoints

## Performance Considerations

### Frontend
- Minimal re-renders (state kept at the top, derived values computed per render rather than duplicated in state)
- Leaflet layers are removed/rebuilt rather than diffed, which is simple but means the whole GeoJSON layer re-renders on every navigation step
- Conditional rendering (modal, notifications)

### Backend
- Simple file I/O: the full `countries.json` is read and rewritten on every request — fine at the scale this app targets, but means a request's cost scales with total entry count
- No complex database queries
- Efficient parsing

### Network
- Geocoding and location validation are deliberately throttled to ~1 request/second to respect Nominatim's usage policy — this is a real, user-visible latency source (adding a multi-place visit can take several seconds), not just a backend implementation detail
- Geocode results are cached server-side so the throttle only applies to genuinely new places

## Security Architecture

### Input Validation
```
User Input
    ↓
Client-Side Validation (React: required fields, date ordering)
    ↓
Live Validation Against Nominatim (country/place existence, via the server proxy)
    ↓
Server-Side Validation (Flask: required-field check on POST /api/countries)
    ↓
Store (no further sanitization — data is trusted JSON written straight to disk)
```

### CORS Policy
`flask-cors`'s `CORS(app)` is applied with no origin restriction — any origin can call the API. This is acceptable for a single-user, localhost-only app, but would need an explicit allowlist before being exposed beyond localhost.

## Scalability Considerations

### Current Design
- Good for: a single user, roughly 100s of entries
- File-based storage works well at this scale; every write rewrites the entire file
- Fast response times for local use

### Future Scaling
- Larger datasets: move from the single JSON file to SQLite
- Multiple users: add authentication and per-user data files/tables
- Global access: deploy server + client, tighten the CORS policy
- Heavier place-marker usage: Nominatim's 1 req/sec policy becomes the binding constraint before anything else does — a paid/self-hosted geocoder would be the next step, not just caching

## Error Handling Flow

```
Error Occurs
    ↓
Try/Catch Block
    ↓
Non-fatal data issue (bad country name, bad date range, geocode miss)?
    ↓ yes                                   ↓ no (fetch/API failure)
Toast via onWarning(), deduped by key   Log to console, set `error` state
    ↓                                        ↓
App keeps rendering normally            Show full-page error view with Retry button
```

## Development Workflow

```
1. Make Changes
    ↓
2. Save Files
    ↓
3. React Hot Reload (Auto) / Flask Debug Reloader (Auto)
    ↓
4. View in Browser
    ↓
5. Check Console for Errors
    ↓
6. Manually walk through TESTING_GUIDE.md (no automated test suite exists)
    ↓
7. Repeat
```

---

This architecture provides a solid foundation that's easy to understand, maintain, and extend.
