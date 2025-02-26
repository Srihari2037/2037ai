const User = require("../models/User"); // Ensure the file is named "User.js" exactly
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful.", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ message: "Logout failed." });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully." });
    });
  });
};
