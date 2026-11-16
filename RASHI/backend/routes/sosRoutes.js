const express = require("express");

const router = express.Router();

const {
  triggerSOS,
  getMySOSAlerts,
  updateSOSStatus
} = require("../controllers/sosController");

const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", triggerSOS);

router.get("/", getMySOSAlerts);

router.put("/:id/status", updateSOSStatus);

module.exports = router;