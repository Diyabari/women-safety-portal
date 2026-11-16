# RASHI - Safety Tips & Safe Places Update

## What was changed

### Safety Tips
- The Safety Tips page now contains built-in safety tips, so it does not become blank when MongoDB has no SafetyTip records.
- Database tips are still used first when available.
- Category filters continue to work.
- Emergency numbers remain clickable.
- Added practical tips for general safety, travel, self-defense, digital safety and workplace safety.

### Safe Places
- The page now clearly searches using the browser's current location.
- You can choose a place type and radius.
- Results show name, address, type, 24x7 status and distance.
- Each result has a Google Maps button and a Call button when a phone number exists.
- If there are no database records in the selected radius, the page explains how to fix it instead of appearing broken.

## Important
Safe Places are read from MongoDB. The sample records in `backend/seed.js` are demonstration records and should be replaced/added with real local police stations, hospitals, help centres or NGOs before presenting the project as real-world data.

## Run
Backend:
    cd RASHI\backend
    npm run dev

If the database is connected:
    node seed.js

Frontend:
    cd RASHI\frontend
    npm run dev

Then open the frontend and:
1. Open Safety Tips to see the written tips.
2. Open Find Safe Places Nearby.
3. Allow browser location access.
4. Select a type/radius and click Search Safe Places.
