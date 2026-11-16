const SafetyTip = require("../models/SafetyTip");

const getTips = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const tips = await SafetyTip.find(filter).sort({ createdAt: -1 });
  return res.json({ success: true, data: tips });
};

const createTip = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }
    const tip = await SafetyTip.create({ title, content, category, createdBy: req.user._id });
    return res.status(201).json({ success: true, data: tip });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create safety tip", error: err.message });
  }
};

const deleteTip = async (req, res) => {
  const tip = await SafetyTip.findByIdAndDelete(req.params.id);
  if (!tip) return res.status(404).json({ success: false, message: "Tip not found" });
  return res.json({ success: true, message: "Tip removed" });
};

module.exports = { getTips, createTip, deleteTip };
