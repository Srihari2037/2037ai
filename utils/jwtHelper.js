const jwt = require("jsonwebtoken");

// Check if JWT_SECRET is properly loaded
if (!process.env.JWT_SECRET) {
  throw new Error("❌ ERROR: Missing JWT_SECRET in .env file");
}

// ✅ Function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

module.exports = generateToken;
