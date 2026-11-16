const express = require("express");
const router = express.Router();
const { createIncident, getMyIncidents, getIncidentById } = require("../controllers/incidentController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.post("/", upload.array("evidence", 5), createIncident);
router.get("/mine", getMyIncidents);
router.get("/:id", getIncidentById);

module.exports = router;
