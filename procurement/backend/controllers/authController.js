const User = require("../models/user");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser };