const express = require("express");
const passport = require("passport");
const { signup, login, logout } = require("../controllers/authController");

const router = express.Router();

// Debug middleware: Log all requests that hit this router.
router.use((req, res, next) => {
  console.log(`[AuthRoutes] ${req.method} ${req.url}`);
  next();
});

// 🔹 Temporary Test Route (GET)
// Visit https://your-render-url/api/auth/test to see if routing works.
router.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

// 🔹 Google OAuth Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 🔹 Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failed",
    session: true,
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);

// 🔹 Signup Route (POST)
router.post("/signup", signup);

// 🔹 Login Route (POST)
router.post("/login", login);

// 🔹 Logout Route (GET)
router.get("/logout", logout);

module.exports = router;
