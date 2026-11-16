const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  getAllIncidents,
  updateIncident,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);
router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.get("/incidents", getAllIncidents);
router.put("/incidents/:id", updateIncident);
router.get("/analytics", getAnalytics);

module.exports = router;
