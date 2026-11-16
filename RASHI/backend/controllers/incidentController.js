const Incident = require("../models/Incident");

// @desc  Report a new incident
// @route POST /api/incidents
const createIncident = async (req, res) => {
  try {
    const { title, description, category, lat, lng, address, isAnonymous } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const evidenceFiles = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const incident = await Incident.create({
      reportedBy: req.user._id,
      title,
      description,
      category,
      location: { lat, lng, address },
      isAnonymous: isAnonymous === "true" || isAnonymous === true,
      evidenceFiles,
    });

    return res.status(201).json({ success: true, data: incident });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to report incident", error: err.message });
  }
};

// @desc  Get incidents reported by the logged-in user
// @route GET /api/incidents/mine
const getMyIncidents = async (req, res) => {
  const incidents = await Incident.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
  return res.json({ success: true, data: incidents });
};

// @desc  Get single incident (owner or admin only)
// @route GET /api/incidents/:id
const getIncidentById = async (req, res) => {
  const incident = await Incident.findById(req.params.id);
  if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });

  const isOwner = incident.reportedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized to view this incident" });
  }

  return res.json({ success: true, data: incident });
};

module.exports = { createIncident, getMyIncidents, getIncidentById };
