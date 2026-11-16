const User = require("../models/User");
const Incident = require("../models/Incident");
const SOSAlert = require("../models/SOSAlert");

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json({ success: true, data: users });
};

// @desc  Activate/deactivate a user
// @route PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  user.isActive = !!isActive;
  await user.save();
  return res.json({ success: true, data: user });
};

// @desc  Get all incidents (with filters)
// @route GET /api/admin/incidents
const getAllIncidents = async (req, res) => {
  const { status, category } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const incidents = await Incident.find(filter)
    .populate("reportedBy", "name email phone")
    .sort({ createdAt: -1 });

  return res.json({ success: true, data: incidents });
};

// @desc  Update incident status / add admin notes
// @route PUT /api/admin/incidents/:id
const updateIncident = async (req, res) => {
  const { status, adminNotes } = req.body;
  const incident = await Incident.findById(req.params.id);
  if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });

  if (status) incident.status = status;
  if (adminNotes !== undefined) incident.adminNotes = adminNotes;
  await incident.save();

  return res.json({ success: true, data: incident });
};

// @desc  Get dashboard analytics
// @route GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  const [totalUsers, totalIncidents, pendingIncidents, activeSOS, incidentsByCategory] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Incident.countDocuments(),
    Incident.countDocuments({ status: "pending" }),
    SOSAlert.countDocuments({ status: "active" }),
    Incident.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
  ]);

  return res.json({
    success: true,
    data: {
      totalUsers,
      totalIncidents,
      pendingIncidents,
      activeSOS,
      incidentsByCategory,
    },
  });
};

module.exports = { getAllUsers, updateUserStatus, getAllIncidents, updateIncident, getAnalytics };
