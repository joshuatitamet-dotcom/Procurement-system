const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "email role isVerified createdAt").sort({ email: 1 }).lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

module.exports = router;
