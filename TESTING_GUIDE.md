# Testing Guide

Complete guide to test all features of the World Map Traveler application.

## Prerequisites

Before testing, ensure:
- ✅ Server is running on http://localhost:5000
- ✅ Client is running on http://localhost:3000
- ✅ Browser is open to http://localhost:3000
- ✅ Browser console is open (F12) to monitor for errors

## Test Suite

### Test 1: Initial Load
**Purpose**: Verify the application loads correctly with sample data.

**Steps**:
1. Open http://localhost:3000
2. Wait for the map to load

**Expected Results**:
- ✅ Map appears with the default ArcGIS Ocean basemap (ocean/land colors come from the selected tile source, not a fixed app color)
- ✅ One country (France) is highlighted in red (`#ef4444` — the "current" color; a country with more than one earlier visit would show teal `#10b981` instead)
- ✅ Header shows "World Map Traveler"
- ✅ Counter shows "1 Country Visited"
- ✅ A "Days abroad (total)" counter shows 11 (Jan 15–25 inclusive) and a "Days Abroad (current)" counter shows the same value (11) since there's only one visible entry
- ✅ Progress indicator shows "1/5"
- ✅ Left arrow is disabled (grayed out)
- ✅ Right arrow is enabled
- ✅ No errors in console

**Screenshot Points**:
- Map with France highlighted
- Counter showing "1"
- Controls showing "1/5"

---

### Test 2: Forward Navigation
**Purpose**: Test navigating forward through travel history.

**Steps**:
1. Press the Right Arrow key (or click right button)
2. Observe the map changes
3. Press Right Arrow again
4. Continue until you reach the end

**Expected Results**:
- ✅ First press: Italy appears highlighted (2 countries now)
- ✅ Counter updates to "2 Countries Visited"
- ✅ Progress shows "2/5"
- ✅ Left arrow becomes enabled
- ✅ Second press: Spain appears (3 countries)
- ✅ Third press: Germany appears (4 countries)
- ✅ Fourth press: Japan appears (5 countries)
- ✅ At end: Right arrow becomes disabled
- ✅ Counter shows "5 Countries Visited"
- ✅ Progress shows "5/5"
- ✅ All visited countries remain highlighted

**Notes**:
- Each country should smoothly appear
- Previous countries stay highlighted
- Transitions are smooth
- No flickering or errors

---

### Test 3: Backward Navigation
**Purpose**: Test navigating backward through travel history.

**Steps**:
1. From the end position (5/5), press Left Arrow key
2. Press Left Arrow multiple times
3. Observe countries disappearing
4. Continue until you reach the start

**Expected Results**:
- ✅ First press: Back to 4/5 (Japan disappears)
- ✅ Counter shows "4 Countries Visited"
- ✅ Second press: 3/5 (Germany disappears)
- ✅ Continue pressing: Countries disappear in reverse order
- ✅ At start: Only France is highlighted
- ✅ Counter shows "1 Country Visited"
- ✅ Progress shows "1/5"
- ✅ Left arrow becomes disabled again

**Notes**:
- Countries should disappear smoothly
- No jarring visual changes
- Counter updates correctly

---

### Test 4: Keyboard Controls
**Purpose**: Verify keyboard navigation works properly.

**Steps**:
1. Click anywhere on the page to ensure focus
2. Press Left Arrow key (should not move at start)
3. Press Right Arrow key (should move forward)
4. Press Left Arrow key (should move backward)
5. Rapidly press Right Arrow multiple times

**Expected Results**:
- ✅ Arrow keys control navigation
- ✅ Disabled directions don't respond
- ✅ Rapid presses work smoothly
- ✅ No lag or stuttering
- ✅ Counter updates in real-time

---

### Test 5: Country Tooltips (Hover)
**Purpose**: Test tooltip display when hovering over countries.

**Steps**:
1. Navigate to position 2/5 (France and Italy visible)
2. Hover mouse over France (should turn lighter)
3. Wait for popup to appear
4. Click on France to pin the popup
5. Read the popup content
6. Close popup (click X or click outside)
7. Hover over Italy
8. Check Italy's popup

**Expected Results - France**:
- ✅ Country highlights brighter on hover
- ✅ Popup appears smoothly
- ✅ Shows "France" as title
- ✅ Shows dates: "2020-01-15 to 2020-01-25"
- ✅ Shows places: "Paris, Alsace"
- ✅ Popup is styled nicely with purple border

**Expected Results - Italy**:
- ✅ Shows "Italy" as title
- ✅ Shows dates: "2020-06-10 to 2020-06-20"
- ✅ Shows places: "Rome, Venice"

**Notes**:
- Hover effect should be immediate
- Popup should be readable and well-styled
- Multiple visits to same country show multiple entries

---

### Test 5A: Place Markers and Google Maps Integration
**Purpose**: Test red place markers and Google Maps links.

**Steps**:
1. Navigate to position 1/5 (France visible)
2. Look for red dots on the map (Paris and Alsace)
3. Click on one of the red dots
4. Read the popup content
5. Click "Open in Google Maps" link
6. Verify Google Maps opens in new tab

**Expected Results**:
- ✅ Red dots visible on map for Paris and Alsace
- ✅ Red dots have white border and shadow
- ✅ Clicking red dot shows popup
- ✅ Popup shows place name (e.g., "Paris")
- ✅ Popup shows country (e.g., "France")
- ✅ Popup shows visit dates
- ✅ Popup has "Open in Google Maps" link at bottom
- ✅ Link is styled in purple color (#667eea)
- ✅ Link has hover effect (background color changes)
- ✅ Clicking link opens Google Maps in new tab
- ✅ Google Maps shows correct location
- ✅ Coordinates match the geocoded location

**Notes**:
- The link should have target="_blank" (opens in new tab)
- Google Maps should center on the exact coordinates
- URL format should be: https://www.google.com/maps?q=lat,lon

---

### Test 6: Country Counter Logic
**Purpose**: Verify unique country counting.

**Steps**:
1. Navigate to 1/5 (France)
2. Note counter: should be 1
3. Navigate to 2/5 (France + Italy)
4. Note counter: should be 2
5. Continue to 5/5
6. Note final counter: should be 5
7. Go back to 1/5
8. Verify counter is 1 again

**Expected Results**:
- ✅ Counter starts at 1
- ✅ Counter increments with each new country
- ✅ Counter correctly counts unique countries
- ✅ Counter decrements when going backward
- ✅ Counter never shows duplicate countries
- ✅ Final count at 5/5 is 5 unique countries

---

### Test 7: Add Country Form - Open/Close
**Purpose**: Test modal form functionality.

**Steps**:
1. Click "+ Add Visit" button in top-right
2. Observe modal appearance
3. Click outside the modal (on the overlay)
4. Verify modal closes
5. Click "+ Add Visit" again
6. Click the X button in top-right of modal
7. Verify modal closes

**Expected Results**:
- ✅ Modal slides up smoothly
- ✅ Background is dimmed (dark overlay)
- ✅ Form appears centered
- ✅ Clicking outside closes modal
- ✅ X button closes modal
- ✅ Animation is smooth
- ✅ Form has all fields visible

---

### Test 8: Add Country Form - Validation
**Purpose**: Test form validation rules.

**Steps**:
1. Open the form
2. Click "Add Visit" without filling anything
3. Observe error message
4. Fill only Country field: "Greece"
5. Click "Add Visit"
6. Observe error about required fields
7. Fill dates: From = "2023-07-10", To = "2023-07-01" (invalid)
8. Click "Add Visit"
9. Observe error about dates

**Expected Results**:
- ✅ Empty form shows error: "Please fill in all required fields"
- ✅ Missing dates show error
- ✅ Invalid date range shows error: "End date must be after start date"
- ✅ Errors appear in red box above form
- ✅ Form doesn't submit with errors

**Additional check — unresolvable location**: fill in a nonsense country name (e.g. "Zzzznotarealplace") with valid dates and submit.
- ✅ A "Validating country location..." message appears first (the app checks the name against OpenStreetMap before saving)
- ✅ After a short delay, an error appears: `Country "Zzzznotarealplace" could not be found. Please check the spelling.`
- ✅ Nothing is saved

---

### Test 9: Add Country Form - Success
**Purpose**: Test successfully adding a new country.

**Steps**:
1. Open the form
2. Fill in:
   - Country: "Greece"
   - From Date: "2023-07-01"
   - To Date: "2023-07-10"
   - Places: "Athens, Santorini"
3. Click "Add Visit"
4. Wait for form to close — this takes a few seconds, not instantly: the app validates "Greece" and then each place against OpenStreetMap one at a time (~1 request/second), showing a "Validating..." status message while it does
5. Press Right Arrow until you reach the last entry
6. Observe Greece is now in the list

**Expected Results**:
- ✅ Form submits successfully
- ✅ Modal closes automatically
- ✅ No error messages
- ✅ New entry appears in timeline (now 6/6)
- ✅ Greece is highlighted on map
- ✅ Counter updates to 6
- ✅ Hovering over Greece shows correct data
- ✅ Data persists after page refresh

**Verification**:
- Refresh the page (F5)
- Navigate to last entry
- Greece should still be there

---

### Test 10: Add Country Form - Empty Places
**Purpose**: Test adding a country without specific places.

**Steps**:
1. Open the form
2. Fill in:
   - Country: "Portugal"
   - From Date: "2023-08-15"
   - To Date: "2023-08-20"
   - Places: (leave empty)
3. Click "Add Visit"
4. Navigate to the new entry
5. Hover over Portugal

**Expected Results**:
- ✅ Form submits successfully
- ✅ Portugal appears on map
- ✅ Tooltip shows "Whole country visited" (no places)
- ✅ No errors

---

### Test 11: Multiple Places Parsing
**Purpose**: Test comma-separated places parsing.

**Steps**:
1. Open the form
2. Fill in:
   - Country: "Netherlands"
   - From Date: "2023-09-01"
   - To Date: "2023-09-05"
   - Places: "Amsterdam, Rotterdam, The Hague"
3. Submit
4. Navigate to Netherlands
5. Hover over Netherlands
6. Check popup

**Expected Results**:
- ✅ All three places appear in popup
- ✅ Places are separated by commas
- ✅ No extra whitespace
- ✅ Formatting is clean

---

### Test 12: Map Visual Styling
**Purpose**: Verify map appearance matches current behavior.

**Checks**:
- ✅ Unvisited land is tan (`#d2b48c`)
- ✅ Previously-visited countries (not the current one) are teal/green (`#10b981`)
- ✅ The single most-recent (current) country is red (`#ef4444`)
- ✅ Ocean/basemap appearance depends on whichever tile source is selected in the map-source dropdown (top-right) — this is expected, not a bug; switch sources and confirm the basemap changes while the three highlight colors above stay the same
- ✅ Country borders are visible
- ✅ Map is crisp and clear
- ✅ Zoom controls work
- ✅ Dragging works

**Steps**:
1. Visually inspect the map at the default basemap
2. Switch basemaps via the dropdown and confirm highlight colors are unaffected
3. Try zooming in/out
4. Try dragging the map

---

### Test 13: Responsive Behavior
**Purpose**: Test at different window sizes.

**Steps**:
1. Resize browser window to various widths
2. Check layout at:
   - Full screen (1920px)
   - Medium (1280px)
   - Small (1024px)
3. Verify elements remain accessible

**Expected Results**:
- ✅ Map resizes properly
- ✅ Header remains visible
- ✅ Controls stay centered at bottom
- ✅ Modal form fits on screen
- ✅ No horizontal scrolling
- ✅ All text is readable

---

### Test 14: Error Handling
**Purpose**: Test error scenarios.

**Test A: Server Down**
1. Stop the Flask server
2. Refresh the page
3. Expected: Error message appears
4. Restart server
5. Click "Retry" button
6. Expected: Data loads successfully

**Test B: Network Error**
1. Open browser dev tools
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to add a country
5. Expected: Error message appears

**Test C: Invalid Data**
1. Back up `server/countries.json`, then edit it to make it invalid (e.g. delete the closing `]`, or remove the `"dateFrom"` key from one entry)
2. Refresh the client (no need to restart the server)
3. Expected: the app shows its full-page "Failed to load countries data" error with a Retry button — **not** a blank map or an empty-looking state
4. While still corrupted, try "+ Add Visit" with any valid entry
5. Expected: an error appears and nothing is saved
6. Restore the backup, click Retry (or refresh)
7. Expected: the app loads normally again, and `countries.json` still has all its original entries — the broken state was never overwritten (see Test 14D)

**Test D: Corrupted File Doesn't Get Overwritten (regression test)**
This specifically checks a past bug where a broken `countries.json` would get silently replaced by a file containing only the newest "Add Visit" entry, wiping everything else.
1. Back up `server/countries.json`
2. Corrupt it the same way as Test C (e.g. delete the trailing `]`)
3. With the server running, try "+ Add Visit" with a valid entry (via the UI, or `curl -X POST http://localhost:5000/api/countries -H "Content-Type: application/json" -d '{"dateFrom":"2099-01-01","dateTo":"2099-01-02","country":"Testland"}'` if the UI won't let you reach the form from the error screen)
4. Expected: the request fails with an error
5. Open `countries.json` on disk and confirm it's **unchanged** — still just the corrupted version, not replaced with a file containing only "Testland"
6. Restore the backup

---

### Test 15: Data Persistence
**Purpose**: Verify data survives restarts.

**Steps**:
1. Add a new country: "Sweden"
2. Close browser completely
3. Stop server
4. Restart server
5. Open browser to http://localhost:3000
6. Navigate to your new entry
7. Verify Sweden appears

**Expected Results**:
- ✅ Data is saved to `countries.json`
- ✅ Data persists after server restart
- ✅ Data persists after browser close
- ✅ All details are correct

---

### Test 16: Progress Indicator
**Purpose**: Test progress display accuracy.

**Steps**:
1. Start at 1/5
2. Note display shows "1 / 5"
3. Navigate through all positions
4. Check display at each position

**Expected Results**:
- ✅ Position 1: Shows "1 / 5"
- ✅ Position 2: Shows "2 / 5"
- ✅ Position 3: Shows "3 / 5"
- ✅ Position 4: Shows "4 / 5"
- ✅ Position 5: Shows "5 / 5"
- ✅ Numbers are clearly visible
- ✅ Formatting is consistent

---

### Test 17: Button States
**Purpose**: Verify button enabled/disabled states.

**Checks**:
- At position 1/5:
  - ✅ Left button: Disabled (gray, no hover effect)
  - ✅ Right button: Enabled (purple, hover effect)

- At position 3/5:
  - ✅ Left button: Enabled
  - ✅ Right button: Enabled

- At position 5/5:
  - ✅ Left button: Enabled
  - ✅ Right button: Disabled

- Button interactions:
  - ✅ Hover effect only on enabled buttons
  - ✅ Click effect only on enabled buttons
  - ✅ Disabled buttons don't respond to clicks

---

### Test 18: Animation Smoothness
**Purpose**: Verify all animations work smoothly.

**Checks**:
- ✅ Modal open: Smooth slide-up
- ✅ Modal close: Smooth fade-out
- ✅ Button hover: Smooth scale
- ✅ Country hover: Smooth brightness
- ✅ Map transitions: Smooth updates
- ✅ No jarring movements
- ✅ No flickering
- ✅ Consistent timing

---

### Test 19: Console Check
**Purpose**: Verify no errors in console.

**Steps**:
1. Open browser console (F12)
2. Refresh page
3. Navigate through timeline
4. Add a country
5. Check console output

**Expected Results**:
- ✅ No red errors
- ✅ No warnings (or only minor React warnings)
- ✅ API calls show 200 status
- ✅ No CORS errors
- ✅ No 404 errors

---

### Test 20: Full User Journey
**Purpose**: Complete end-to-end test.

**Scenario**: New user explores their travel history and adds a new trip.

**Steps**:
1. Open application
2. See first country (France)
3. Read the counter (1 country)
4. Press Right Arrow 4 times to see all travels
5. Counter now shows 5 countries
6. Hover over each country to see details
7. Press Left Arrow to go back to start
8. Click "+ Add Visit"
9. Add new country: "Australia"
   - From: "2024-01-01"
   - To: "2024-01-15"
   - Places: "Sydney, Melbourne"
10. Navigate to new entry
11. Hover over Australia
12. Verify data is correct
13. Refresh page
14. Navigate back to Australia
15. Verify it still exists

**Expected Results**:
- ✅ Entire flow works smoothly
- ✅ No errors at any point
- ✅ All features work as expected
- ✅ Data persists correctly
- ✅ UI is responsive and professional
- ✅ User experience is intuitive

---

### Test 21: Map Source Toggle
**Purpose**: Verify the tile-provider dropdown works.

**Steps**:
1. Click the map-style button in the top-right corner of the map
2. Select each of the 6 options in turn: ArcGIS Ocean, OpenStreetMap, Stamen Terrain, CartoDB Positron, Esri Satellite, CartoDB Dark

**Expected Results**:
- ✅ Dropdown shows all 6 sources with a checkmark next to the active one
- ✅ Selecting a source swaps the basemap instantly, without a page reload
- ✅ Country highlight colors (tan/teal/red) stay the same regardless of basemap
- ✅ Clicking outside the dropdown closes it without changing the selection

---

### Test 22: Refresh Button
**Purpose**: Verify the header's Refresh button re-reads data from disk.

**Steps**:
1. With the app open, edit `server/countries.json` directly in a text editor (e.g. tweak a date or add an entry) and save
2. Without restarting the server or reloading the browser, click the "Refresh" button in the header

**Expected Results**:
- ✅ The app re-fetches and reflects your manual edit without a full page reload
- ✅ Your current timeline position/selection behaves reasonably after the refresh (the entry list may have shifted if you added/removed something)

---

### Test 23: Area Field
**Purpose**: Verify the optional "Area" field on Add Visit and its display.

**Steps**:
1. Click "+ Add Visit"
2. Fill in Country: "Spain", From: "2024-03-01", To: "2024-03-05", Area: "Barcelona", Places: "Barcelona"
3. Submit and navigate to the new entry

**Expected Results**:
- ✅ The "Current Country" badge shows the year, "Spain", and "(Barcelona)" next to it
- ✅ Leaving Area blank on a different entry doesn't show an empty "()" — the area suffix only appears when one is set

---

## Test Results Summary

Use this checklist to track your testing:

- [ ] Test 1: Initial Load
- [ ] Test 2: Forward Navigation
- [ ] Test 3: Backward Navigation
- [ ] Test 4: Keyboard Controls
- [ ] Test 5: Country Tooltips
- [ ] Test 5A: Place Markers and Google Maps Integration
- [ ] Test 6: Country Counter Logic
- [ ] Test 7: Add Form - Open/Close
- [ ] Test 8: Add Form - Validation
- [ ] Test 9: Add Form - Success
- [ ] Test 10: Add Form - Empty Places
- [ ] Test 11: Multiple Places Parsing
- [ ] Test 12: Map Visual Styling
- [ ] Test 13: Responsive Behavior
- [ ] Test 14: Error Handling (incl. Test D: corrupted-file regression check)
- [ ] Test 15: Data Persistence
- [ ] Test 16: Progress Indicator
- [ ] Test 17: Button States
- [ ] Test 18: Animation Smoothness
- [ ] Test 19: Console Check
- [ ] Test 20: Full User Journey
- [ ] Test 21: Map Source Toggle
- [ ] Test 22: Refresh Button
- [ ] Test 23: Area Field

---

## Bug Reporting

If you find any issues, note:
1. Test number where issue occurred
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Browser console errors (if any)
6. Screenshots (if helpful)

---

**All tests should pass! The application has been built to handle all these scenarios correctly.**
