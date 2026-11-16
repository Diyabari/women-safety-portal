const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc   Register new user
// @route  POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, phone });

    return res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account has been deactivated" });
    }

    return res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

// @desc   Get current logged-in user
// @route  GET /api/auth/me
const getMe = async (req, res) => {
  const u = req.user;
  return res.json({
    success: true,
    data: { id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role },
  });
};

// @desc   Update profile
// @route  PUT /api/auth/me
const updateMe = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Profile update failed", error: err.message });
  }
};

// @desc   Update last known location (used for SOS + safe place search)
// @route  PUT /api/auth/location
const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "lat and lng are required" });
    }
    const user = await User.findById(req.user._id);
    user.lastKnownLocation = { lat, lng, updatedAt: new Date() };
    await user.save();
    return res.json({ success: true, data: user.lastKnownLocation });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update location", error: err.message });
  }
};

module.exports = { register, login, getMe, updateMe, updateLocation };
