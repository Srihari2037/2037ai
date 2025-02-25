const express = require("express");
const passport = require("passport");

const router = express.Router();

// 🔹 Google OAuth Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 🔹 Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failed",
    session: true, // Ensures session is used
  }),
  (req, res) => {
    // Redirect user to frontend after login
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);

// 🔹 Logout Route (Destroy session & clear cookies)
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Clears session cookie
      return res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
