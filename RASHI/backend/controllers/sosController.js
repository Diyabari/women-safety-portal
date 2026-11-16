const SOSAlert = require("../models/SOSAlert");
const EmergencyContact = require("../models/EmergencyContact");

// @desc  Trigger a new SOS alert
// @route POST /api/sos
const triggerSOS = async (req, res) => {
  try {
    const { lat, lng, address, message } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "Location (lat, lng) is required to trigger SOS" });
    }

    const contacts = await EmergencyContact.find({ user: req.user._id });

    const alert = await SOSAlert.create({
      user: req.user._id,
      location: { lat, lng, address },
      message: message || "Emergency! I need help.",
      contactsNotified: contacts.map((c) => c._id),
      status: "active",
    });

    // NOTE: In production this is where you'd integrate an SMS/WhatsApp/Push
    // notification provider (e.g. Twilio) to actually notify each contact.
    // That integration is intentionally left as a hook for the future
    // enhancement described in the project report.

    return res.status(201).json({
      success: true,
      message: `SOS triggered. ${contacts.length} emergency contact(s) would be notified.`,
      data: alert,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to trigger SOS", error: err.message });
  }
};

// @desc  Get logged-in user's SOS history
// @route GET /api/sos
const getMySOSAlerts = async (req, res) => {
  const alerts = await SOSAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json({ success: true, data: alerts });
};

// @desc  Resolve or cancel an active SOS alert
// @route PUT /api/sos/:id/status
const updateSOSStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["resolved", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'resolved' or 'cancelled'" });
    }

    const alert = await SOSAlert.findOne({ _id: req.params.id, user: req.user._id });
    if (!alert) return res.status(404).json({ success: false, message: "SOS alert not found" });

    alert.status = status;
    if (status === "resolved") alert.resolvedAt = new Date();
    await alert.save();

    return res.json({ success: true, data: alert });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update SOS alert", error: err.message });
  }
};

module.exports = { triggerSOS, getMySOSAlerts, updateSOSStatus };
