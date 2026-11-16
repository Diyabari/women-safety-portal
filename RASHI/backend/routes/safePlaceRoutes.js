const express = require("express");
const router = express.Router();
const { getNearbySafePlaces, addSafePlace } = require("../controllers/safePlaceController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getNearbySafePlaces);
router.post("/", protect, adminOnly, addSafePlace);

module.exports = router;
