const SafePlace = require("../models/SafePlace");

// Haversine distance in km
const distanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// @desc  Find nearby safe places (police, hospital, help centers)
// @route GET /api/safe-places?lat=..&lng=..&type=..&radius=..
const getNearbySafePlaces = async (req, res) => {
  try {
    const { lat, lng, type, radius } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "lat and lng query params are required" });
    }

    const filter = {};
    if (type) filter.type = type;

    const places = await SafePlace.find(filter).lean();
    const maxRadius = radius ? parseFloat(radius) : 10; // default 10km

    const withDistance = places
      .map((p) => ({
        ...p,
        distanceKm: Math.round(distanceKm(parseFloat(lat), parseFloat(lng), p.location.lat, p.location.lng) * 10) / 10,
      }))
      .filter((p) => p.distanceKm <= maxRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.json({ success: true, count: withDistance.length, data: withDistance });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch safe places", error: err.message });
  }
};

// @desc  Admin: add a new safe place
// @route POST /api/safe-places
const addSafePlace = async (req, res) => {
  try {
    const { name, type, address, phone, lat, lng, is24x7 } = req.body;
    if (!name || !type || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "name, type, address, lat and lng are required" });
    }
    const place = await SafePlace.create({ name, type, address, phone, location: { lat, lng }, is24x7 });
    return res.status(201).json({ success: true, data: place });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to add safe place", error: err.message });
  }
};

module.exports = { getNearbySafePlaces, addSafePlace };
