const express = require("express");
const router = express.Router();
const { getTips, createTip, deleteTip } = require("../controllers/safetyTipController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getTips);
router.post("/", protect, adminOnly, createTip);
router.delete("/:id", protect, adminOnly, deleteTip);

module.exports = router;
